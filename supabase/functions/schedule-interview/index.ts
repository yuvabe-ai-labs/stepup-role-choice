import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
// Zoom API integration
async function createZoomMeeting(summary, description, startDateTime, durationMinutes, attendeeEmail) {
  const ZOOM_CLIENT_ID = Deno.env.get("ZOOM_CLIENT_ID");
  const ZOOM_CLIENT_SECRET = Deno.env.get("ZOOM_CLIENT_SECRET");
  const ZOOM_ACCOUNT_ID = Deno.env.get("ZOOM_ACCOUNT_ID");
  if (!ZOOM_CLIENT_ID || !ZOOM_CLIENT_SECRET || !ZOOM_ACCOUNT_ID) {
    throw new Error("Zoom credentials not configured");
  }
  // Get Zoom access token using account credentials
  const credentials = btoa(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`);
  const tokenResponse = await fetch("https://zoom.us/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`
  });
  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error("Zoom auth error:", errorText);
    throw new Error(`Failed to authenticate with Zoom: ${errorText}`);
  }
  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  // Format start time for Zoom API
  const startDate = new Date(startDateTime);
  const isoDateTime = startDate.toISOString().split(".")[0];
  // Create Zoom meeting
  const meetingPayload = {
    topic: summary,
    type: 2,
    start_time: isoDateTime,
    duration: durationMinutes,
    timezone: "Asia/Kolkata",
    settings: {
      join_before_host: true,
      mute_upon_entry: true,
      waiting_room: false
    }
  };
  const meetingResponse = await fetch(`https://api.zoom.us/v2/users/me/meetings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(meetingPayload)
  });
  if (!meetingResponse.ok) {
    const errorText = await meetingResponse.text();
    console.error("Zoom API error:", errorText);
    throw new Error(`Failed to create Zoom meeting: ${errorText}`);
  }
  const meetingData = await meetingResponse.json();
  const zoomLink = meetingData.join_url;
  const hostLink = meetingData.start_url;
  const meetingId = meetingData.id;
  if (!zoomLink) {
    throw new Error("Failed to generate Zoom meeting link");
  }
  return {
    zoomLink,
    hostLink,
    meetingId
  };
}
// Send email with interview details via SMTP
async function sendInterviewEmail(candidateName, candidateEmail, title, scheduledDate, meetingLink, description, intervieweeName = null, isHost = false) {
  const SMTP_HOST = Deno.env.get("SMTP_HOST");
  const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "587");
  const SMTP_USER = Deno.env.get("SMTP_USER");
  const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD");
  const SMTP_FROM_EMAIL = Deno.env.get("SMTP_FROM_EMAIL");
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM_EMAIL) {
    throw new Error("SMTP credentials not configured");
  }
  const formattedDate = new Date(scheduledDate).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC"
  });
  // Customize greeting based on recipient
  let greeting = `Dear ${candidateName},`;
  let roleText = "Your interview has been scheduled";
  let buttonText = "Join Zoom Meeting";
  if (isHost) {
    roleText = `Interview with ${intervieweeName} is ready to start`;
    buttonText = "Start Zoom Meeting";
  } else if (intervieweeName) {
    roleText = `An interview with ${intervieweeName} has been scheduled`;
  }
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Interview Scheduled</h2>
      <p>${greeting}</p>
      <p>${roleText} with the following details:</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #555;">${title}</h3>
        ${description ? `<p style="color: #666;"><strong>Description:</strong> ${description}</p>` : ""}
        <p style="margin: 10px 0;"><strong>Date & Time:</strong> ${formattedDate}</p>
        ${intervieweeName ? `<p style="margin: 10px 0;"><strong>Candidate:</strong> ${intervieweeName}</p>` : ""}
        <p style="margin: 10px 0;"><strong>Meeting Link:</strong></p>
        <a href="${meetingLink}" style="display: inline-block; background-color: #2d8cff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 10px;">
          ${buttonText}
        </a>
      </div>
      
      <p>${isHost ? "Please join a few minutes early to test your audio and video." : "Please make sure to join the meeting on time. If you need to reschedule, please contact us as soon as possible."}</p>
      
      <p>Best regards,<br>Team YuvaNext</p>
    </div>
  `;
  // Encode email data in base64 for SMTP
  const encoder = new TextEncoder();
  let emailBody = `From: ${SMTP_FROM_EMAIL}\r\n`;
  emailBody += `To: ${candidateEmail}\r\n`;
  emailBody += `Subject: Interview Scheduled: ${title}\r\n`;
  emailBody += `MIME-Version: 1.0\r\n`;
  emailBody += `Content-Type: text/html; charset=UTF-8\r\n`;
  emailBody += `\r\n`;
  emailBody += htmlContent;
  // Connect to SMTP server
  const conn = await Deno.connect({
    hostname: SMTP_HOST,
    port: SMTP_PORT
  });
  const writer = conn.writable.getWriter();
  const reader = conn.readable.getReader();
  const send = (data)=>{
    writer.write(encoder.encode(data));
  };
  const read = async ()=>{
    const { value } = await reader.read();
    return new TextDecoder().decode(value);
  };
  try {
    // Read server greeting
    await read();
    // Send EHLO
    send(`EHLO ${Deno.hostname()}\r\n`);
    await read();
    // Send AUTH LOGIN
    send(`AUTH LOGIN\r\n`);
    await read();
    // Send username
    send(`${btoa(SMTP_USER)}\r\n`);
    await read();
    // Send password
    send(`${btoa(SMTP_PASSWORD)}\r\n`);
    await read();
    // Send MAIL FROM
    send(`MAIL FROM:<${SMTP_FROM_EMAIL}>\r\n`);
    await read();
    // Send RCPT TO
    send(`RCPT TO:<${candidateEmail}>\r\n`);
    await read();
    // Send DATA
    send(`DATA\r\n`);
    await read();
    // Send email content
    send(emailBody);
    send(`\r\n.\r\n`);
    await read();
    // Send QUIT
    send(`QUIT\r\n`);
    await read();
  } catch (smtpError) {
    console.error("SMTP error:", smtpError);
    throw new Error(`Failed to send email: ${smtpError.message}`);
  } finally{
    try {
      reader.releaseLock();
      writer.releaseLock();
      conn.close();
    } catch (closeError) {
      console.error("Error closing connection:", closeError);
    }
  }
}
const handler = async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const { applicationId, candidateName, candidateEmail, scheduledDate, title, description, durationMinutes = 60, senderEmail, guestEmails } = await req.json();
    console.log("Creating Zoom meeting for interview:", {
      title,
      scheduledDate,
      candidateEmail
    });
    // Create Zoom meeting
    const { zoomLink, hostLink, meetingId } = await createZoomMeeting(title, description || "", scheduledDate, durationMinutes, candidateEmail);
    console.log("Zoom meeting created:", zoomLink);
    // Store interview in database
    const { data: interview, error: dbError } = await supabase.from("interviews").insert({
      application_id: applicationId,
      title,
      description,
      scheduled_date: scheduledDate,
      meeting_link: zoomLink,
      duration_minutes: durationMinutes,
      status: "scheduled"
    }).select().single();
    if (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }
    // Update application status to interviewed
    await supabase.from("applications").update({
      status: "interviewed"
    }).eq("id", applicationId);
    console.log("Sending emails...");
    // Send email to candidate with join link
    await sendInterviewEmail(candidateName, candidateEmail, title, scheduledDate, zoomLink, description, null, false);
    // Send email to host if provided - with HOST link to start the meeting
    if (senderEmail) {
      const hostName = senderEmail.split("@")[0];
      await sendInterviewEmail(hostName, senderEmail, title, scheduledDate, hostLink, description, candidateName, true);
    }
    // Send emails to guests if provided - with join link
    if (guestEmails && Array.isArray(guestEmails) && guestEmails.length > 0) {
      for (const guest of guestEmails){
        await sendInterviewEmail(guest.name || "Guest", guest.email, title, scheduledDate, zoomLink, description, candidateName, false);
      }
    }
    console.log("Interview scheduled successfully");
    return new Response(JSON.stringify({
      success: true,
      interview,
      zoomLink,
      hostLink
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("Error scheduling interview:", error);
    return new Response(JSON.stringify({
      error: error.message || "Failed to schedule interview"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
};
serve(handler);
