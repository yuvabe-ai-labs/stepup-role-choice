import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ScheduleInterviewRequest {
  applicationId: string;
  candidateName: string;
  candidateEmail: string;
  scheduledDate: string;
  title: string;
  description?: string;
  durationMinutes?: number;
}

// Google Calendar API integration
async function createGoogleMeetEvent(
  summary: string,
  description: string,
  startDateTime: string,
  durationMinutes: number,
  attendeeEmail: string
): Promise<{ meetLink: string; eventId: string }> {
  const GOOGLE_CLIENT_EMAIL = Deno.env.get("GOOGLE_CLIENT_EMAIL");
  const GOOGLE_PRIVATE_KEY = Deno.env.get("GOOGLE_PRIVATE_KEY")?.replace(/\\n/g, "\n");

  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error("Google credentials not configured");
  }

  // Create JWT for Google API authentication
  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: GOOGLE_CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/calendar",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const encoder = new TextEncoder();
  const base64url = (data: ArrayBuffer) =>
    btoa(String.fromCharCode(...new Uint8Array(data)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

  const jwtHeader = base64url(encoder.encode(JSON.stringify(header)));
  const jwtPayload = base64url(encoder.encode(JSON.stringify(payload)));

  // Import private key for signing
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = GOOGLE_PRIVATE_KEY.substring(
    GOOGLE_PRIVATE_KEY.indexOf(pemHeader) + pemHeader.length,
    GOOGLE_PRIVATE_KEY.indexOf(pemFooter)
  ).replace(/\s/g, "");

  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    encoder.encode(`${jwtHeader}.${jwtPayload}`)
  );

  const jwt = `${jwtHeader}.${jwtPayload}.${base64url(signature)}`;

  // Exchange JWT for access token
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // Calculate end time
  const startDate = new Date(startDateTime);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

  // Create calendar event with Google Meet
  const calendarEvent = {
    summary,
    description,
    start: {
      dateTime: startDate.toISOString(),
      timeZone: "UTC",
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: "UTC",
    },
    attendees: [{ email: attendeeEmail }],
    conferenceData: {
      createRequest: {
        requestId: crypto.randomUUID(),
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  const eventResponse = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(calendarEvent),
    }
  );

  if (!eventResponse.ok) {
    const errorText = await eventResponse.text();
    console.error("Google Calendar API error:", errorText);
    throw new Error(`Failed to create Google Meet: ${errorText}`);
  }

  const eventData = await eventResponse.json();
  const meetLink = eventData.hangoutLink || eventData.conferenceData?.entryPoints?.[0]?.uri;

  if (!meetLink) {
    throw new Error("Failed to generate Google Meet link");
  }

  return {
    meetLink,
    eventId: eventData.id,
  };
}

// Send email with interview details
async function sendInterviewEmail(
  candidateName: string,
  candidateEmail: string,
  title: string,
  scheduledDate: string,
  meetLink: string,
  description?: string
) {
  const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

  const formattedDate = new Date(scheduledDate).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });

  await resend.emails.send({
    from: "Interviews <onboarding@resend.dev>",
    to: [candidateEmail],
    subject: `Interview Scheduled: ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Interview Scheduled</h2>
        <p>Dear ${candidateName},</p>
        <p>Your interview has been scheduled with the following details:</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #555;">${title}</h3>
          ${description ? `<p style="color: #666;">${description}</p>` : ""}
          <p style="margin: 10px 0;"><strong>Date & Time:</strong> ${formattedDate}</p>
          <p style="margin: 10px 0;"><strong>Meeting Link:</strong></p>
          <a href="${meetLink}" style="display: inline-block; background-color: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 10px;">
            Join Google Meet
          </a>
        </div>
        
        <p>Please make sure to join the meeting on time. If you need to reschedule, please contact us as soon as possible.</p>
        
        <p>Best regards,<br>The Hiring Team</p>
      </div>
    `,
  });
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const {
      applicationId,
      candidateName,
      candidateEmail,
      scheduledDate,
      title,
      description,
      durationMinutes = 60,
    }: ScheduleInterviewRequest = await req.json();

    console.log("Creating Google Meet for interview:", { title, scheduledDate, candidateEmail });

    // Create Google Meet event
    const { meetLink, eventId } = await createGoogleMeetEvent(
      title,
      description || "",
      scheduledDate,
      durationMinutes,
      candidateEmail
    );

    console.log("Google Meet created:", meetLink);

    // Store interview in database
    const { data: interview, error: dbError } = await supabase
      .from("interviews")
      .insert({
        application_id: applicationId,
        title,
        description,
        scheduled_date: scheduledDate,
        meeting_link: meetLink,
        duration_minutes: durationMinutes,
        status: "scheduled",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }

    // Update application status to interviewed
    await supabase
      .from("applications")
      .update({ status: "interviewed" })
      .eq("id", applicationId);

    console.log("Sending email to candidate:", candidateEmail);

    // Send email to candidate
    await sendInterviewEmail(
      candidateName,
      candidateEmail,
      title,
      scheduledDate,
      meetLink,
      description
    );

    console.log("Interview scheduled successfully");

    return new Response(
      JSON.stringify({
        success: true,
        interview,
        meetLink,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error scheduling interview:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to schedule interview",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
