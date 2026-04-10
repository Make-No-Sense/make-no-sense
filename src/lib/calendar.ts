import type { TruckEvent } from "./events";

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
}

// Strips internal prefixes like "MNS Lunch - " and returns the venue name
function parseVenue(summary: string): string {
  const idx = summary.indexOf(" - ");
  return idx !== -1 ? summary.slice(idx + 3).trim() : summary.trim();
}

function isAllDay(iso: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(iso);
}

function formatDate(iso: string): string {
  const date = new Date(isAllDay(iso) ? `${iso}T12:00:00` : iso);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "America/Chicago",
  });
}

function formatTimeStr(iso: string): string {
  return new Date(iso)
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Chicago",
    })
    .replace(/:00(?=\s)/, "") // drop :00 from e.g. "11:00 AM" → "11 AM"
    .toLowerCase();
}

function formatTime(start: string, end: string): string {
  if (isAllDay(start)) return "All day";
  const s = formatTimeStr(start);
  const e = end ? formatTimeStr(end) : "";
  return e ? `${s} – ${e}` : s;
}

export function normalizeCalendarEvents(events: CalendarEvent[]): TruckEvent[] {
  return events.map((e) => ({
    id: e.id,
    title: parseVenue(e.summary),
    date: formatDate(e.start),
    time: formatTime(e.start, e.end),
    address: e.location,
    source: "calendar" as const,
  }));
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
