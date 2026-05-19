import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery, featuredMenuItemsQuery } from '@/sanity/lib/queries'
import { getUpcomingEvents, normalizeCalendarEvents } from '@/lib/calendar'
import { HeroSection } from '@/components/home/HeroSection'
import { MenuPreview } from '@/components/home/MenuPreview'
import { NextEventTeaser } from '@/components/home/NextEventTeaser'
import { SocialStrip } from '@/components/home/SocialStrip'

export const metadata: Metadata = {
  title: "Make No Sense | Nashville Food Truck",
  description:
    "Nashville's boldest food truck. Bold burgers, seasoned fries, and scratch-made flavors. Find out where we're rolling next.",
  openGraph: {
    title: "Make No Sense | Nashville Food Truck",
    description:
      "Nashville's boldest food truck. Bold burgers, seasoned fries, and scratch-made flavors. Find out where we're rolling next.",
    type: "website",
    url: "https://makenosense.info",
    siteName: "Make No Sense",
  },
  twitter: {
    card: "summary_large_image",
    title: "Make No Sense | Nashville Food Truck",
    description:
      "Nashville's boldest food truck. Bold burgers, seasoned fries, and scratch-made flavors. Find out where we're rolling next.",
  },
}

export const revalidate = 60 // ISR: refresh every 60 seconds

export default async function HomePage() {
  const [settings, featuredItems] = await Promise.all([
    client.fetch(siteSettingsQuery),
    client.fetch(featuredMenuItemsQuery),
  ])

  const rawEvents = await getUpcomingEvents(settings?.googleCalendarId ?? null)
  const nextEvent = normalizeCalendarEvents(rawEvents)[0] ?? null

  return (
    <>
      <HeroSection
        headline={settings?.heroHeadline ?? null}
        subheadline={settings?.heroSubheadline ?? null}
      />
      <MenuPreview items={featuredItems ?? []} />
      <NextEventTeaser event={nextEvent} />
      <SocialStrip
        instagramUrl={settings?.instagramUrl ?? null}
        tiktokUrl={settings?.tiktokUrl ?? null}
        facebookUrl={settings?.facebookUrl ?? null}
      />
    </>
  )
}
