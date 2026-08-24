import Image from 'next/image'
import Link from 'next/link'
import { urlForOptimized } from '@/sanity/lib/image'

interface MenuItem {
  _id: string
  name: string
  description: string | null
  price: number | null
  badge: string | null
  category: string | null
  image: { asset: { _ref: string } | null; alt: string | null } | null
}

const BADGE_STYLES: Record<string, string> = {
  New: 'bg-flame-orange text-off-white',
  'Best Seller': 'bg-truck-red text-off-white',
  Limited: 'bg-char-black/80 text-off-white border border-off-white/20 backdrop-blur-sm',
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
              <article
                key={item._id}
                className="group bg-mid-gray rounded-xl overflow-hidden flex flex-col h-full border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-2xl hover:shadow-black/30"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-char-black">
                  {item.image?.asset?._ref ? (
                    <Image
                      src={urlForOptimized(item.image).width(900).height(675).fit('crop').url()}
                      alt={item.image.alt ?? item.name}
                      fill
                      className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-char-black">
                      <span className="font-display text-off-white/15 text-4xl uppercase tracking-widest">
                        MNS
                      </span>
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />

                  {item.badge && (
                    <span
                      className={`absolute top-3 left-3 z-10 px-2.5 py-1 font-display text-[11px] uppercase tracking-wider rounded-md shadow-md ${BADGE_STYLES[item.badge] ?? 'bg-light-gray text-off-white'}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1 gap-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-off-white text-base leading-tight">
                      {item.name}
                    </h3>
                    {item.price !== null && (
                      <span className="font-display text-off-white text-sm whitespace-nowrap">
                        ${item.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </article>
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
