import { defineField, defineType } from 'sanity'

export const consultingProject = defineType({
  name: 'consultingProject',
  title: 'Consulting Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title / Client', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'year', title: 'Year', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({
      name: 'services', title: 'Services', type: 'array',
      of: [{ type: 'string' }],
      options: { list: ['Translation', 'Interpreting', 'Writing', 'Project Coordination', 'Facilitation', 'Research'] },
    }),
    defineField({ name: 'languages', title: 'Languages', type: 'string' }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean' }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  preview: { select: { title: 'title', subtitle: 'year' } },
})
