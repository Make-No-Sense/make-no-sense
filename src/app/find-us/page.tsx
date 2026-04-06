import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { getUpcomingEvents } from "@/lib/calendar";
import { EventsGrid } from "@/components/find-us/EventsGrid";
import { LiveMap } from "@/components/find-us/LiveMap";

export const revalidate = 3600; // 1 hour

export const metadata = {
  title: "Find Us | Make No Sense",
  description:
    "Find Make No Sense food truck in Nashville. Map, upcoming locations, and event schedule.",
};

export default async function FindUsPage() {
  // Fetch site settings for calendar ID
  const settings = await client.fetch(siteSettingsQuery);
  const events = await getUpcomingEvents(settings?.googleCalendarId);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <section className="bg-deep-navy py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-display font-bold uppercase text-warm-cream text-5xl sm:text-6xl lg:text-7xl tracking-tight">
          Find the Truck
        </h1>
        <div className="mx-auto mt-5 h-1 w-16 bg-brick-red rounded" />
        <p className="mt-6 text-warm-cream/60 text-lg max-w-md mx-auto">
          We out here. Come find us!
        </p>
      </section>

      {/* ── Live Map ──────────────────────────────────────────────────────── */}
      <section className="bg-warm-cream py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="font-display text-brick-red uppercase tracking-[0.3em] text-sm mb-6 text-center">
            Live Location
          </p>
          <LiveMap
            events={events}
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          />
        </div>
      </section>

      {/* ── Upcoming Events ───────────────────────────────────────────────── */}
      <section className="bg-warm-cream py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold uppercase text-deep-navy text-4xl sm:text-5xl tracking-tight">
              Upcoming Locations
            </h2>
          </div>
          <EventsGrid events={events} />
        </div>
      </section>

      {/* ── Platform Links ───────────────────────────────────────────────── */}
      <section className="bg-warm-cream py-12 px-4 sm:px-6 lg:px-8 border-t border-deep-navy/10">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-slate text-xs sm:text-sm mb-4">Also follow us on</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
            <a
              href="https://streetfoodfinder.com/MakeNoSense"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 sm:px-6 py-3 min-h-[44px] rounded-full bg-deep-navy text-warm-cream text-xs sm:text-sm font-semibold hover:bg-brick-red transition-colors w-full sm:w-auto"
            >
              Street Food Finder
            </a>
            <a
              href="https://www.bestfoodtrucks.com/truck/make-no-sense-burgers-fries"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 sm:px-6 py-3 min-h-[44px] rounded-full bg-deep-navy text-warm-cream text-xs sm:text-sm font-semibold hover:bg-brick-red transition-colors w-full sm:w-auto"
            >
              Best Food Trucks
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
