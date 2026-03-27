import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'tagline_fr', title: 'Tagline (FR)', type: 'string' }),
    defineField({ name: 'tagline_es', title: 'Tagline (ES)', type: 'string' }),
    defineField({ name: 'bio', title: 'Bio', type: 'text', rows: 4 }),
    defineField({ name: 'bio_fr', title: 'Bio (FR)', type: 'text', rows: 4 }),
    defineField({ name: 'bio_es', title: 'Bio (ES)', type: 'text', rows: 4 }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroImageAlt', title: 'Hero Image Alt Text', type: 'string' }),
    defineField({
      name: 'socialLinks', title: 'Social Links', type: 'object',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
        defineField({ name: 'redbubble', title: 'Redbubble URL', type: 'url' }),
      ],
    }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2 }),
    defineField({ name: 'seoDescription_fr', title: 'SEO Description (FR)', type: 'text', rows: 2 }),
    defineField({ name: 'seoDescription_es', title: 'SEO Description (ES)', type: 'text', rows: 2 }),
  ],
})
