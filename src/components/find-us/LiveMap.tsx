"use client";

import { Truck, MapPin } from "lucide-react";
import { CalendarEvent } from "@/lib/calendar";

interface LiveMapProps {
  events: CalendarEvent[];
  apiKey?: string;
}

function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function LiveMap({ events, apiKey }: LiveMapProps) {
  // Find first event with location
  const eventWithLocation = events.find((e) => e.location);

  // Build map URL
  let mapUrl: string;
  let eventName: string | null = null;
  let eventDate: string | null = null;

  if (eventWithLocation && apiKey) {
    const encodedLocation = encodeURIComponent(eventWithLocation.location || "");
    mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedLocation}&zoom=15`;
    eventName = eventWithLocation.summary;
    eventDate = formatEventDate(eventWithLocation.start);
  } else if (apiKey) {
    // Fallback to Nashville
    mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=Nashville,TN&zoom=11`;
  } else {
    // No API key
    return (
      <div className="w-full bg-navy-black rounded-lg aspect-video flex items-center justify-center">
        <p className="text-warm-cream/30 text-sm">API key required</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Overlay bar */}
      {eventWithLocation && eventName && eventDate && (
        <div className="bg-deep-navy px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 rounded-t-lg overflow-hidden">
          <Truck size={20} className="text-brick-red shrink-0 sm:size-6" />
          <div className="flex-1 min-w-0">
            <p className="text-brick-red uppercase tracking-widest text-xs font-semibold">
              Next Stop
            </p>
            <p className="text-white font-display font-semibold uppercase tracking-tight text-sm sm:text-lg md:text-xl lg:text-2xl truncate">
              {eventName}
            </p>
          </div>
          <p className="text-white/60 text-xs sm:text-sm font-semibold shrink-0">{eventDate}</p>
        </div>
      )}

      {/* Map */}
      <div
        className={eventWithLocation ? "rounded-b-lg overflow-hidden" : "rounded-lg overflow-hidden"}
      >
        <iframe
          src={mapUrl}
          width="100%"
          height={500}
          style={{ border: "none" }}
          allowFullScreen
          loading="lazy"
          title="Make No Sense Location Map"
        />
      </div>

      {/* CTA Buttons */}
      {eventWithLocation && eventWithLocation.location && (
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              eventWithLocation.location
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 min-h-[44px] bg-deep-navy text-white font-display font-semibold uppercase tracking-wider text-xs sm:text-sm rounded hover:bg-brick-red transition-colors w-full sm:w-auto"
          >
            <MapPin size={18} />
            <span>Google Maps</span>
          </a>
          <a
            href={`https://maps.apple.com/?q=${encodeURIComponent(
              eventWithLocation.location
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 min-h-[44px] bg-warm-cream text-deep-navy border-2 border-deep-navy font-display font-semibold uppercase tracking-wider text-xs sm:text-sm rounded hover:bg-pale-blue transition-colors w-full sm:w-auto"
          >
            <MapPin size={18} />
            <span>Apple Maps</span>
          </a>
        </div>
      )}
    </div>
  );
}
