import Link from 'next/link'
import { MapPin, Clock, Calendar } from 'lucide-react'

// Placeholder until Google Calendar is wired in (src/lib/calendar.ts)
const PLACEHOLDER_EVENT = {
  title: 'Downtown Nashville — Midday Rush',
  date: 'Check back soon for live dates',
  time: '11:00 AM – 3:00 PM',
  location: 'Bicentennial Capitol Mall State Park',
}

export function NextEventTeaser() {
  return (
    <section className="bg-warm-cream py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <p className="font-display text-brick-red uppercase tracking-[0.3em] text-sm mb-3">
            Come Find Us
          </p>
          <h2 className="font-display font-bold uppercase text-deep-navy text-4xl sm:text-5xl tracking-tight">
            Next Stop
          </h2>
        </div>

        <div className="bg-pale-blue rounded-lg overflow-hidden shadow-sm border border-deep-navy/10">
          <div className="border-l-4 border-brick-red p-8 sm:p-10">
            <h3 className="font-display font-bold uppercase text-deep-navy text-2xl sm:text-3xl mb-6 leading-tight">
              {PLACEHOLDER_EVENT.title}
            </h3>

            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-3 text-soft-charcoal">
                <Calendar size={18} className="text-brick-red shrink-0" />
                <span className="font-sans text-base">{PLACEHOLDER_EVENT.date}</span>
              </li>
              <li className="flex items-center gap-3 text-soft-charcoal">
                <Clock size={18} className="text-brick-red shrink-0" />
                <span className="font-sans text-base">{PLACEHOLDER_EVENT.time}</span>
              </li>
              <li className="flex items-center gap-3 text-soft-charcoal">
                <MapPin size={18} className="text-brick-red shrink-0" />
                <span className="font-sans text-base">{PLACEHOLDER_EVENT.location}</span>
              </li>
            </ul>
          </div>

          <div className="bg-pale-blue px-8 sm:px-10 py-5 border-t border-deep-navy/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-slate text-sm">
              Schedule updates weekly — follow us for real-time locations.
            </p>
            <Link
              href="/find-us"
              className="inline-flex items-center justify-center px-6 py-3 font-display font-semibold uppercase tracking-wider text-sm bg-deep-navy text-warm-cream hover:bg-brick-red transition-colors rounded shrink-0"
            >
              Full Schedule
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
