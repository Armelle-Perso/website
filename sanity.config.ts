import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemas } from './sanity/schemas'

export default defineConfig({
  name: 'armelle-boussidan',
  title: 'Armelle Boussidan',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('Site Settings').id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.listItem().title('Art').id('art').child(
              S.list().title('Art').items([
                S.documentTypeListItem('paintingSeries').title('Painting Series'),
                S.documentTypeListItem('jewelryCollection').title('Jewelry'),
                S.documentTypeListItem('collective').title('Collectives & Studios'),
                S.documentTypeListItem('exhibition').title('Exhibitions & Events'),
              ])
            ),
            S.divider(),
            S.documentTypeListItem('consultingProject').title('Consulting Projects'),
            S.documentTypeListItem('researchItem').title('Research'),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemas },
})
