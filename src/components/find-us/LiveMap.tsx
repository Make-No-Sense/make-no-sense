"use client";

import { Truck, MapPin } from "lucide-react";
import type { TruckEvent } from "@/lib/events";

interface LiveMapProps {
  events: TruckEvent[];
  apiKey?: string;
}

export function LiveMap({ events, apiKey }: LiveMapProps) {
  const next = events[0] ?? null;
  const mapQuery = next?.address || next?.title || null;

  let mapUrl: string;

  if (mapQuery && apiKey) {
    mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(mapQuery)}&zoom=15`;
  } else if (apiKey) {
    mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=Nashville,TN&zoom=11`;
  } else {
    return (
      <div className="w-full bg-mid-gray rounded-lg aspect-video flex items-center justify-center">
        <p className="text-light-gray text-sm">API key required</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Next stop overlay bar */}
      {next && (
        <div className="bg-mid-gray px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 rounded-t-lg overflow-hidden">
          <Truck size={20} className="text-truck-red shrink-0 sm:size-6" />
          <div className="flex-1 min-w-0">
            <p className="text-truck-red uppercase tracking-widest text-xs font-semibold">
              Next Stop
            </p>
            <p className="text-off-white font-display uppercase tracking-tight text-sm sm:text-lg md:text-xl lg:text-2xl truncate">
              {next.title}
            </p>
          </div>
          <p className="text-light-gray text-xs sm:text-sm shrink-0">
            {next.date}
          </p>
        </div>
      )}

      {/* Map iframe */}
      <div className={next ? "rounded-b-lg overflow-hidden" : "rounded-lg overflow-hidden"}>
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

      {/* Directions CTAs */}
      {mapQuery && (
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 min-h-[44px] bg-truck-red text-off-white font-display uppercase tracking-wider text-xs sm:text-sm rounded hover:bg-flame-orange transition-colors w-full sm:w-auto"
          >
            <MapPin size={18} />
            <span>Google Maps</span>
          </a>
          <a
            href={`https://maps.apple.com/?q=${encodeURIComponent(mapQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 min-h-[44px] bg-mid-gray text-off-white border border-off-white/20 font-display uppercase tracking-wider text-xs sm:text-sm rounded hover:border-off-white/50 transition-colors w-full sm:w-auto"
          >
            <MapPin size={18} />
            <span>Apple Maps</span>
          </a>
        </div>
      )}
    </div>
  );
}
