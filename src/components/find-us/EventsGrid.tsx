"use client";
import { MapPin, Calendar } from "lucide-react";
import type { TruckEvent } from "@/lib/events";

interface EventsGridProps {
  events: TruckEvent[];
}

export function EventsGrid({ events }: EventsGridProps) {
  return (
    <div>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-pale-blue rounded-lg border-l-4 border-brick-red p-5 sm:p-6 flex flex-col gap-3 w-full items-center text-center"
            >
              {/* Event name */}
              {event.title && (
                <p className="font-display font-bold uppercase text-deep-navy text-xl md:text-2xl tracking-tight leading-tight">
                  {event.title}
                </p>
              )}

              {/* Date + Time on one line */}
              <div className="flex items-center gap-4">
                <span className="text-slate text-sm font-medium">{event.date}</span>
                {event.time && (
                  <span className="text-slate text-sm">{event.time}</span>
                )}
              </div>

              {/* Address */}
              {event.address && (
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-brick-red shrink-0 mt-0.5" />
                  <p className="text-brick-red font-medium text-sm leading-relaxed text-left">
                    {event.address}
                  </p>
                </div>
              )}
            </div>
          ))}
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
