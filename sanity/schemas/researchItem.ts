import { defineField, defineType } from 'sanity'

export const researchItem = defineType({
  name: 'researchItem',
  title: 'Research',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'year', title: 'Year', type: 'string' }),
    defineField({ name: 'language', title: 'Language', type: 'string', options: { list: ['English', 'French', 'Both'] } }),
    defineField({ name: 'coAuthors', title: 'Co-authors', type: 'string' }),
    defineField({ name: 'publication', title: 'Publication / Journal', type: 'string' }),
    defineField({ name: 'description', title: 'Description / Abstract', type: 'text', rows: 3 }),
    defineField({ name: 'link', title: 'Link', type: 'url' }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  orderings: [{ title: 'Year (newest)', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'year' } },
})
