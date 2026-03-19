import type { StructureResolver } from 'sanity/structure'

// Singleton document types — excluded from the default list
const SINGLETON_TYPES = new Set(['siteSettings'])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singleton: Site Settings (one fixed document, no "new" button)
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings')
        ),

      S.divider(),

      // Regular document types, excluding singletons
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETON_TYPES.has(item.getId() ?? '')
      ),
    ])
