// lib/googleCalendar.ts
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set credentials (you'll need to get these through OAuth flow)
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

export interface CreateEventParams {
  summary: string;
  description: string;
  startTime: Date;
  endTime: Date;
  attendees: string[];
  timeZone?: string;
}

export async function createCalendarEvent(params: CreateEventParams) {
  try {
    const event = {
      summary: params.summary,
      description: params.description,
      start: {
        dateTime: params.startTime.toISOString(),
        timeZone: params.timeZone || "UTC",
      },
      end: {
        dateTime: params.endTime.toISOString(),
        timeZone: params.timeZone || "UTC",
      },
      attendees: params.attendees.map((email) => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      conferenceDataVersion: 1,
    });

    return {
      eventId: response.data.id,
      meetingLink: response.data.hangoutLink,
      htmlLink: response.data.htmlLink,
      conferenceData: response.data.conferenceData,
    };
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
}
