import { client } from '@/sanity/lib/client'
import { siteSettingsQuery, featuredMenuItemsQuery } from '@/sanity/lib/queries'
import { HeroSection } from '@/components/home/HeroSection'
import { MenuPreview } from '@/components/home/MenuPreview'
import { NextEventTeaser } from '@/components/home/NextEventTeaser'
import { SocialStrip } from '@/components/home/SocialStrip'

export const revalidate = 60 // ISR: refresh every 60 seconds

export default async function HomePage() {
  const [settings, featuredItems] = await Promise.all([
    client.fetch(siteSettingsQuery),
    client.fetch(featuredMenuItemsQuery),
  ])

  return (
    <>
      <HeroSection
        headline={settings?.heroHeadline ?? null}
        subheadline={settings?.heroSubheadline ?? null}
      />
      <MenuPreview items={featuredItems ?? []} />
      <NextEventTeaser />
      <SocialStrip
        instagramUrl={settings?.instagramUrl ?? null}
        tiktokUrl={settings?.tiktokUrl ?? null}
        facebookUrl={settings?.facebookUrl ?? null}
      />
    </>
  )
}
