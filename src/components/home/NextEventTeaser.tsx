import Link from 'next/link'
import { MapPin, Clock, Calendar } from 'lucide-react'

const PLACEHOLDER_EVENT = {
  title: 'Downtown Nashville — Midday Rush',
  date: 'Check back soon for live dates',
  time: '11:00 AM – 3:00 PM',
  location: 'Bicentennial Capitol Mall State Park',
}

export function NextEventTeaser() {
  return (
    <section className="bg-mid-gray py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <p className="font-display text-truck-red uppercase tracking-[0.3em] text-sm mb-3">
            Come Find Us
          </p>
          <h2 className="font-display uppercase text-off-white text-4xl sm:text-5xl tracking-tight">
            Next Stop
          </h2>
        </div>

        <div className="bg-char-black rounded-lg overflow-hidden border border-off-white/10">
          <div className="border-l-4 border-truck-red p-8 sm:p-10">
            <h3 className="font-display uppercase text-off-white text-2xl sm:text-3xl mb-6 leading-tight">
              {PLACEHOLDER_EVENT.title}
            </h3>

            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-3 text-off-white">
                <Calendar size={18} className="text-truck-red shrink-0" />
                <span className="font-sans text-base">{PLACEHOLDER_EVENT.date}</span>
              </li>
              <li className="flex items-center gap-3 text-off-white">
                <Clock size={18} className="text-truck-red shrink-0" />
                <span className="font-sans text-base">{PLACEHOLDER_EVENT.time}</span>
              </li>
              <li className="flex items-center gap-3 text-off-white">
                <MapPin size={18} className="text-truck-red shrink-0" />
                <span className="font-sans text-base">{PLACEHOLDER_EVENT.location}</span>
              </li>
            </ul>
          </div>

          <div className="bg-mid-gray px-8 sm:px-10 py-5 border-t border-off-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-light-gray text-sm">
              Schedule updates weekly — follow us for real-time locations.
            </p>
            <Link
              href="/find-us"
              className="inline-flex items-center justify-center px-6 py-3 font-display uppercase tracking-wider text-sm bg-truck-red text-off-white hover:bg-flame-orange transition-colors rounded shrink-0"
            >
              Full Schedule
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
