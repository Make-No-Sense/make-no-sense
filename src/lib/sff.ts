import * as cheerio from "cheerio";
import type { TruckEvent } from "./events";

export interface SFFEvent {
  id: string;
  date: string;       // e.g. "Today (4/10)" or "Friday (4/17)"
  location: string;   // event/venue name
  time: string;       // e.g. "9:30pm-11pm"
  address: string;    // full address string
}

export async function getSFFEvents(): Promise<SFFEvent[]> {
  try {
    const res = await fetch(
      "https://streetfoodfinder.com/embed/MakeNoSense/calendar/small?d=14&u=MakeNoSense",
      { next: { revalidate: 3600 } } // cache for 1 hour
    );

    if (!res.ok) return [];

    const html = await res.text();
    const $ = cheerio.load(html);
    const events: SFFEvent[] = [];
    let currentDate = "";

    $("ul.list li").each((i, el) => {
      // Date header rows
      if ($(el).hasClass("section_header")) {
        currentDate = $(el).text().trim();
        return;
      }

      const a = $(el).find("a");
      if (!a.length) return;

      const location = a.find("div.ename").text().trim();
      const time = a.find("div.etime").text().trim();
      const address = a.find("small.eaddy").text().replace(/\s+/g, " ").trim();

      if (location) {
        events.push({
          id: `sff-${i}`,
          date: currentDate,
          location,
          time,
          address,
        });
      }
    });

    return events;
  } catch {
    return [];
  }
}

export function normalizeSFFEvents(events: SFFEvent[]): TruckEvent[] {
  return events.map((e) => ({
    id: e.id,
    title: e.location,
    date: e.date,
    time: e.time,
    address: e.address || undefined,
    source: "sff" as const,
  }));
}
