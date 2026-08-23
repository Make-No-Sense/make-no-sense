import Image from 'next/image'
import Link from 'next/link'
import { urlForOptimized } from '@/sanity/lib/image'

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
    <section className="bg-char-black py-12 sm:py-20 px-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-14">
          <p className="font-display text-truck-red uppercase tracking-[0.3em] text-sm mb-3">
            Featured
          </p>
          <h2 className="font-display uppercase text-off-white text-3xl sm:text-5xl tracking-tight">
            Taste Something Real
          </h2>
        </div>

        {/* Grid */}
        {items.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-mid-gray rounded overflow-hidden group"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-char-black/60">
                  {item.image?.asset?._ref ? (
                    <Image
                      src={urlForOptimized(item.image).width(600).height(450).url()}
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
                <div className="p-3 sm:p-5 text-center">
                  <h3 className="font-display text-off-white text-sm sm:text-xl font-bold leading-tight">
                    {item.name}
                  </h3>
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
