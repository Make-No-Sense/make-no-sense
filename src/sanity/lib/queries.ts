import { defineQuery } from 'next-sanity'

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    heroHeadline,
    heroSubheadline,
    phone,
    email,
    instagramUrl,
    tiktokUrl,
    facebookUrl,
    googleCalendarId
  }
`)

export const featuredMenuItemsQuery = defineQuery(`
  *[_type == "menuItem" && featured == true && available != false][0...3] {
    _id,
    name,
    price,
    badge,
    image {
      asset,
      alt
    },
    "category": category->name
  }
`)
