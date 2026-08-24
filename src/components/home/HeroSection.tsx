import Link from 'next/link'
import Image from 'next/image'
import { urlForOptimized } from '@/sanity/lib/image'

interface SanityImage {
  asset: { _ref: string; _type: string } | null
  alt: string | null
}

interface Props {
  headline: string | null
  subheadline: string | null
  truckImage: SanityImage | null
  truckImageMobile: SanityImage | null
}

export function HeroSection({ headline, subheadline, truckImage, truckImageMobile }: Props) {
  const desktopImg = truckImage
  const mobileImg = truckImageMobile ?? truckImage

  return (
    <section
      className="relative bg-char-black overflow-hidden flex flex-col justify-end"
      style={{ minHeight: 'calc(100dvh - 64px)' }}
    >
      {/* Desktop/tablet image (hidden on mobile) */}
      {desktopImg?.asset && (
        <Image
          src={urlForOptimized(desktopImg).width(1920).height(1080).url()}
          alt={desktopImg.alt ?? 'Make No Sense food truck'}
          fill
          priority
          className="object-cover hidden sm:block"
          sizes="100vw"
        />
      )}

      {/* Mobile image (hidden on sm+) */}
      {mobileImg?.asset && (
        <Image
          src={urlForOptimized(mobileImg).width(900).height(1600).url()}
          alt={mobileImg.alt ?? 'Make No Sense food truck'}
          fill
          priority
          className="object-cover object-center block sm:hidden"
          sizes="100vw"
        />
      )}

      {/* Gradient */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, #1A1A1A 0%, rgba(26,26,26,0.55) 45%, transparent 100%)' }}
      />

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full px-5 sm:px-6 lg:px-8 text-center" style={{ paddingBottom: '56px' }}>
        <div className="mx-auto max-w-4xl">
          <h1
            className="uppercase font-bold text-off-white leading-none tracking-tight text-5xl sm:text-7xl lg:text-8xl mb-4 sm:mb-6"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            {headline ?? 'Make No Sense'}
          </h1>

          {subheadline && (
            <p className="text-off-white/70 text-sm sm:text-lg max-w-xl mx-auto mb-5 sm:mb-8 leading-relaxed">
              {subheadline}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 font-display uppercase tracking-wider text-xs sm:text-sm border-2 border-off-white text-off-white hover:bg-off-white hover:text-char-black transition-colors rounded"
            >
              See the Menu
            </Link>
            <Link
              href="/find-us"
              className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 font-display uppercase tracking-wider text-xs sm:text-sm bg-truck-red text-off-white hover:bg-flame-orange transition-colors rounded"
            >
              Find the Truck
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
