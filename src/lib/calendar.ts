export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
}

export async function getUpcomingEvents(
  calendarId: string | null | undefined
): Promise<CalendarEvent[]> {
  try {
    // Validate inputs
    if (!calendarId) {
      console.warn("[calendar] Missing calendarId");
      return [];
    }

    const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;
    if (!apiKey) {
      console.warn("[calendar] Missing GOOGLE_CALENDAR_API_KEY");
      return [];
    }

    const now = new Date();
    const params = new URLSearchParams({
      key: apiKey,
      orderBy: "startTime",
      singleEvents: "true",
      timeMin: now.toISOString(),
      maxResults: "8",
    });

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events?${params}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(
        `[calendar] API error: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data = await response.json();

    if (!data.items || !Array.isArray(data.items)) {
      console.warn("[calendar] No items in response");
      return [];
    }

    return data.items.map((event: any) => ({
      id: event.id,
      summary: event.summary || "Event",
      start: event.start?.dateTime || event.start?.date || "",
      end: event.end?.dateTime || event.end?.date || "",
      location: event.location,
      description: event.description,
    }));
  } catch (error) {
    console.error("[calendar] fetch error:", error);
    return [];
  }
}
