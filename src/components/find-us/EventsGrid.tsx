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
              className="bg-mid-gray rounded-lg border-l-4 p-5 sm:p-6 flex flex-col gap-3 w-full items-center text-center"
              style={{ borderLeftColor: '#F0A500' }}
            >
              {/* Event name */}
              {event.title && (
                <p className="font-display text-off-white text-xl md:text-2xl leading-tight">
                  {event.title}
                </p>
              )}

              {/* Date + Time on one line */}
              <div className="flex items-center gap-4">
                <span className="text-light-gray text-sm font-medium">{event.date}</span>
                {event.time && (
                  <span className="text-light-gray text-sm">{event.time}</span>
                )}
              </div>

              {/* Address */}
              {event.address && (
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="shrink-0 mt-0.5" style={{ color: '#F0A500' }} />
                  <p className="font-medium text-sm leading-relaxed text-left" style={{ color: '#F0A500' }}>
                    {event.address}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-mid-gray rounded-lg border-l-4 border-truck-red p-5 sm:p-6 md:p-8 text-center w-full">
          <Calendar size={48} className="mx-auto mb-4" style={{ color: '#F0A500' }} />
          <p className="font-display text-off-white text-lg md:text-xl">
            Check back soon
          </p>
          <p className="text-light-gray text-sm md:text-base mt-2">
            New events posted weekly. Follow us on social for live updates.
          </p>
        </div>
      )}
    </div>
  );
}
