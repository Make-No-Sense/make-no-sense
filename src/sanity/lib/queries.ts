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

export const menuCategoriesQuery = defineQuery(`
  *[_type == "menuCategory"] | order(sortOrder asc) {
    _id,
    name,
    "slug": slug.current
  }
`)

export const menuItemsByCategoryQuery = defineQuery(`
  *[_type == "menuItem" && available != false] | order(name asc) {
    _id,
    name,
    description,
    price,
    badge,
    available,
    image {
      asset,
      alt
    },
    "categoryId": category->_id,
    "categorySlug": category->slug.current,
    "categoryName": category->name
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
