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
  New: 'bg-flame-orange text-off-white',
  'Fan Favorite': 'bg-truck-red text-off-white',
  Limited: 'bg-mid-gray text-off-white border border-off-white/20',
}

export function MenuPreview({ items }: { items: MenuItem[] }) {
  return (
    <section className="bg-char-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="font-display text-truck-red uppercase tracking-[0.3em] text-sm mb-3">
            Featured
          </p>
          <h2 className="font-display uppercase text-off-white text-4xl sm:text-5xl tracking-tight">
            Taste Something Real
          </h2>
        </div>

        {/* Grid */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-mid-gray rounded overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-56 bg-char-black/60">
                  {item.image?.asset?._ref ? (
                    <Image
                      src={urlFor(item.image).width(600).height(450).url()}
                      alt={item.image.alt ?? item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-off-white/20 text-5xl uppercase">
                        MNS
                      </span>
                    </div>
                  )}

                  {/* Badge */}
                  {item.badge && (
                    <span
                      className={`absolute top-3 left-3 px-2 py-1 font-display text-xs uppercase tracking-wider rounded ${BADGE_COLORS[item.badge] ?? 'bg-light-gray text-off-white'}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 flex items-start justify-between gap-4">
                  <div>
                    {item.category && (
                      <p className="font-display text-light-gray text-xs uppercase tracking-wider mb-1">
                        {item.category}
                      </p>
                    )}
                    <h3 className="font-display uppercase text-off-white text-lg leading-tight">
                      {item.name}
                    </h3>
                  </div>
                  {item.price != null && item.price > 0 && (
                    <span className="font-mono text-amber-gold text-lg font-bold shrink-0">
                      ${item.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-light-gray font-display uppercase tracking-wider">
            Menu coming soon
          </p>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center px-8 py-4 font-display uppercase tracking-wider text-sm bg-truck-red text-off-white hover:bg-flame-orange transition-colors rounded"
          >
            Full Menu
          </Link>
        </div>
      </div>
    </section>
  )
}
