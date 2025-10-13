// src/services/googleCalendar.ts

import { supabase } from "@/integrations/supabase/client";

interface EventDetails {
  title: string;
  description: string;
  startDateTime: string; // ISO format
  endDateTime: string; // ISO format
  attendeeEmails: string[];
  meetingLink?: string;
}

// Get the OAuth token from your database or state management
const getGoogleAccessToken = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // You'll need to store the Google access token in your database
  // This is a placeholder - implement based on your auth flow
  const { data, error } = await supabase
    .from("profiles")
    .select("google_access_token, google_refresh_token")
    .eq("id", user.id)
    .single();

  if (error || !data?.google_access_token) {
    throw new Error("Google Calendar not connected");
  }

  return data.google_access_token;
};

// Refresh the access token if expired
const refreshGoogleToken = async (refreshToken: string) => {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();

  // Update the token in your database
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .from("profiles")
      .update({ google_access_token: data.access_token })
      .eq("id", user.id);
  }

  return data.access_token;
};

// Create a Google Calendar event with Google Meet
export const createGoogleMeetEvent = async (
  eventDetails: EventDetails
): Promise<{
  success: boolean;
  eventId?: string;
  meetLink?: string;
  error?: string;
}> => {
  try {
    const accessToken = await getGoogleAccessToken();

    const event = {
      summary: eventDetails.title,
      description: eventDetails.description,
      start: {
        dateTime: eventDetails.startDateTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: eventDetails.endDateTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      attendees: eventDetails.attendeeEmails.map((email) => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 }, // 1 day before
          { method: "popup", minutes: 30 }, // 30 minutes before
        ],
      },
      sendUpdates: "all", // Send email invitations to all attendees
    };

    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (response.status === 401) {
      // Token expired, try to refresh
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("google_refresh_token")
          .eq("id", user.id)
          .single();

        if (data?.google_refresh_token) {
          const newToken = await refreshGoogleToken(data.google_refresh_token);
          // Retry the request with new token
          const retryResponse = await fetch(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${newToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(event),
            }
          );

          if (!retryResponse.ok) {
            throw new Error("Failed to create event after token refresh");
          }

          const retryData = await retryResponse.json();
          return {
            success: true,
            eventId: retryData.id,
            meetLink:
              retryData.hangoutLink ||
              retryData.conferenceData?.entryPoints?.[0]?.uri,
          };
        }
      }
      throw new Error("Token expired and refresh failed");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to create event");
    }

    const data = await response.json();

    return {
      success: true,
      eventId: data.id,
      meetLink: data.hangoutLink || data.conferenceData?.entryPoints?.[0]?.uri,
    };
  } catch (error) {
    console.error("Error creating Google Meet event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Get user's calendar authorization status
export const isGoogleCalendarConnected = async (): Promise<boolean> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("profiles")
      .select("google_access_token")
      .eq("id", user.id)
      .single();

    return !error && !!data?.google_access_token;
  } catch (error) {
    return false;
  }
};

// Initialize Google OAuth flow
export const initiateGoogleAuth = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/google/callback`;
  const scope = "https://www.googleapis.com/auth/calendar.events";

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(
    {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scope,
      access_type: "offline",
      prompt: "consent",
    }
  )}`;

  window.location.href = authUrl;
};
