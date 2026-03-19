import Link from 'next/link'

interface Props {
  headline: string | null
  subheadline: string | null
}

export function HeroSection({ headline, subheadline }: Props) {
  return (
    <section className="relative min-h-screen bg-navy-black flex items-center justify-center overflow-hidden">
      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-black/60 via-transparent to-navy-black/80" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-display text-brick-red uppercase tracking-[0.3em] text-sm sm:text-base mb-6">
          Nashville Food Truck
        </p>

        <h1 className="font-display font-bold uppercase text-warm-cream leading-none tracking-tight text-5xl sm:text-7xl lg:text-8xl mb-6">
          {headline ?? 'Make No\u00A0Sense'}
        </h1>

        {subheadline && (
          <p className="text-warm-cream/70 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            {subheadline}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center px-8 py-4 font-display font-semibold uppercase tracking-wider text-sm border-2 border-warm-cream text-warm-cream hover:bg-warm-cream hover:text-navy-black transition-colors rounded"
          >
            See the Menu
          </Link>
          <Link
            href="/find-us"
            className="inline-flex items-center justify-center px-8 py-4 font-display font-semibold uppercase tracking-wider text-sm bg-brick-red text-white hover:bg-brick-red/90 transition-colors rounded"
          >
            Find the Truck
          </Link>
        </div>
      </div>

      {/* Scroll nudge */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-warm-cream/40">
        <span className="font-display text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-warm-cream/30" />
      </div>
    </section>
  )
}
