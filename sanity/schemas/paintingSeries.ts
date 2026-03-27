import { defineField, defineType } from 'sanity'

export const paintingSeries = defineType({
  name: 'paintingSeries',
  title: 'Painting Series',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (R) => R.required() }),
    defineField({ name: 'year', title: 'Year / Period', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'description_fr', title: 'Description (FR)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'description_es', title: 'Description (ES)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
    defineField({
      name: 'artworks', title: 'Artworks', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
          defineField({ name: 'title', title: 'Title', type: 'string' }),
          defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
          defineField({ name: 'medium', title: 'Medium', type: 'string' }),
          defineField({ name: 'dimensions', title: 'Dimensions', type: 'string' }),
          defineField({ name: 'year', title: 'Year', type: 'string' }),
          defineField({ name: 'available', title: 'Available for sale', type: 'boolean' }),
          defineField({ name: 'hideDimensions', title: 'Hide dimensions', type: 'boolean' }),
          defineField({ name: 'featured', title: 'Featured', type: 'boolean' }),
          defineField({ name: 'subseries', title: 'Subseries', type: 'string' }),
          defineField({ name: 'link', title: 'External link', type: 'url' }),
        ],
        preview: { select: { title: 'title', media: 'image' } },
      }],
    }),
  ],
  orderings: [{ title: 'Year', name: 'yearDesc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'year', media: 'coverImage' } },
})
