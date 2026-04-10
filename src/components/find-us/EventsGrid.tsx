"use client";

import { MapPin, Calendar } from "lucide-react";
import { CalendarEvent } from "@/lib/calendar";

function formatEventDate(dateStr: string): {
  date: string;
  day: string;
} {
  const date = new Date(dateStr);
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
  const dayNum = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return { date: dayNum, day: dayOfWeek };
}

function formatEventTime(startStr: string, endStr: string): string {
  const start = new Date(startStr);
  const end = new Date(endStr);

  const startTime = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const endTime = end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${startTime} – ${endTime}`;
}

interface FindUsPageProps {
  events: CalendarEvent[];
}

export function EventsGrid({ events }: FindUsPageProps) {
  return (
    <div>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => {
            const { date, day } = formatEventDate(event.start);
            const time = formatEventTime(event.start, event.end);

            return (
              <div
                key={event.id}
                className="bg-pale-blue rounded-lg border-l-4 border-brick-red p-5 sm:p-6 flex flex-col gap-4 w-full"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-display font-bold uppercase text-deep-navy text-3xl md:text-4xl tracking-tight">
                      {date}
                    </p>
                    <p className="text-brick-red uppercase tracking-widest text-xs font-semibold mt-1">
                      {day}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-slate text-sm">{time}</p>

                  {event.location && (
                    <div className="flex items-start gap-2">
                      <MapPin size={18} className="text-deep-navy shrink-0 mt-0.5" />
                      <p className="text-deep-navy font-medium text-sm">
                        {event.location}
                      </p>
                    </div>
                  )}

                  {event.description && (
                    <p className="text-slate text-sm leading-relaxed pt-2">
                      {event.description}
                    </p>
                  )}
                </div>

                {event.summary && (
                  <p className="text-soft-charcoal font-semibold text-sm pt-2 border-t border-deep-navy/10">
                    {event.summary}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-pale-blue rounded-lg border-l-4 border-brick-red p-5 sm:p-6 md:p-8 text-center w-full">
          <Calendar size={48} className="mx-auto text-brick-red mb-4" />
          <p className="font-display font-semibold uppercase text-deep-navy text-lg md:text-xl tracking-tight">
            Check back soon
          </p>
          <p className="text-slate text-sm md:text-base mt-2">
            New events posted weekly. Follow us on social for live updates.
          </p>
        </div>
      )}
    </div>
  );
}
