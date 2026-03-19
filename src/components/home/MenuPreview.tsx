import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'

interface MenuItem {
  _id: string
  name: string
  price: number | null
  badge: string | null
  category: string | null
  image: { asset: { _ref: string } | null; alt: string | null } | null
}

const BADGE_COLORS: Record<string, string> = {
  New: 'bg-brick-red text-white',
  'Fan Favorite': 'bg-muted-gold text-navy-black',
  Limited: 'bg-deep-navy text-warm-cream border border-warm-cream/20',
}

export function MenuPreview({ items }: { items: MenuItem[] }) {
  return (
    <section className="bg-navy-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="font-display text-brick-red uppercase tracking-[0.3em] text-sm mb-3">
            Featured
          </p>
          <h2 className="font-display font-bold uppercase text-warm-cream text-4xl sm:text-5xl tracking-tight">
            Taste Something Real
          </h2>
        </div>

        {/* Grid */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-deep-navy rounded overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-56 bg-navy-black/60">
                  {item.image?.asset ? (
                    <Image
                      src={urlFor(item.image).width(600).height(450).url()}
                      alt={item.image.alt ?? item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-warm-cream/20 text-5xl uppercase">
                        MNS
                      </span>
                    </div>
                  )}

                  {/* Badge */}
                  {item.badge && (
                    <span
                      className={`absolute top-3 left-3 px-2 py-1 font-display text-xs uppercase tracking-wider rounded ${BADGE_COLORS[item.badge] ?? 'bg-slate text-white'}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 flex items-start justify-between gap-4">
                  <div>
                    {item.category && (
                      <p className="font-display text-slate text-xs uppercase tracking-wider mb-1">
                        {item.category}
                      </p>
                    )}
                    <h3 className="font-display font-semibold uppercase text-warm-cream text-lg leading-tight">
                      {item.name}
                    </h3>
                  </div>
                  {item.price != null && (
                    <span className="font-mono text-muted-gold text-lg font-bold shrink-0">
                      ${item.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate font-display uppercase tracking-wider">
            Menu coming soon
          </p>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center px-8 py-4 font-display font-semibold uppercase tracking-wider text-sm bg-brick-red text-white hover:bg-brick-red/90 transition-colors rounded"
          >
            Full Menu
          </Link>
        </div>
      </div>
    </section>
  )
}
