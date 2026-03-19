interface Props {
  instagramUrl: string | null
  tiktokUrl: string | null
  facebookUrl: string | null
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.79 1.52V6.74a4.85 4.85 0 0 1-1.02-.05z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

const SOCIAL_LABEL: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
}

export function SocialStrip({ instagramUrl, tiktokUrl, facebookUrl }: Props) {
  const socials = [
    { key: 'instagram', url: instagramUrl, Icon: InstagramIcon },
    { key: 'tiktok', url: tiktokUrl, Icon: TikTokIcon },
    { key: 'facebook', url: facebookUrl, Icon: FacebookIcon },
  ].filter((s) => s.url)

  return (
    <section className="bg-deep-navy py-14 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl flex flex-col items-center gap-8">
        <div className="text-center">
          <p className="font-display font-bold uppercase text-warm-cream text-2xl sm:text-3xl tracking-tight">
            Follow the Truck
          </p>
          <p className="text-slate text-sm mt-2">
            Real-time locations, new dishes, and behind-the-scenes.
          </p>
        </div>

        {socials.length > 0 ? (
          <div className="flex items-center gap-6 sm:gap-10">
            {socials.map(({ key, url, Icon }) => (
              <a
                key={key}
                href={url!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={SOCIAL_LABEL[key]}
                className="flex flex-col items-center gap-2 text-warm-cream/60 hover:text-warm-cream transition-colors group"
              >
                <span className="p-3 rounded-full border border-warm-cream/20 group-hover:border-warm-cream/60 group-hover:bg-warm-cream/5 transition-colors">
                  <Icon />
                </span>
                <span className="font-display text-xs uppercase tracking-widest">
                  {SOCIAL_LABEL[key]}
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-6 sm:gap-10">
            {[
              { key: 'instagram', Icon: InstagramIcon },
              { key: 'tiktok', Icon: TikTokIcon },
              { key: 'facebook', Icon: FacebookIcon },
            ].map(({ key, Icon }) => (
              <div
                key={key}
                className="flex flex-col items-center gap-2 text-warm-cream/30"
              >
                <span className="p-3 rounded-full border border-warm-cream/10">
                  <Icon />
                </span>
                <span className="font-display text-xs uppercase tracking-widest">
                  {SOCIAL_LABEL[key]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
