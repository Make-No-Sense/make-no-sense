import { type SchemaTypeDefinition } from 'sanity'
import { menuCategory } from './menuCategory'
import { menuItem } from './menuItem'
import { galleryImage } from './galleryImage'
import { siteSettings } from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [menuCategory, menuItem, galleryImage, siteSettings],
}
