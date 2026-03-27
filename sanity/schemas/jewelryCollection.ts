import { defineField, defineType } from 'sanity'

export const jewelryCollection = defineType({
  name: 'jewelryCollection',
  title: 'Jewelry Collection',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'collaborator', title: 'Collaborator (if any)', type: 'string' }),
    defineField({
      name: 'pieces', title: 'Pieces', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
          defineField({ name: 'title', title: 'Title', type: 'string' }),
          defineField({ name: 'category', title: 'Category', type: 'string', options: { list: ['Earrings', 'Necklace', 'Bracelet', 'Ring', 'Other'] } }),
          defineField({ name: 'materials', title: 'Materials', type: 'string' }),
          defineField({ name: 'available', title: 'Available', type: 'boolean' }),
        ],
        preview: { select: { title: 'title', media: 'image' } },
      }],
    }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  preview: { select: { title: 'title', subtitle: 'subtitle' } },
})
