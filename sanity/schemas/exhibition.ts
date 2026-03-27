import { defineField, defineType } from 'sanity'

export const exhibition = defineType({
  name: 'exhibition',
  title: 'Exhibition / Event',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'type', title: 'Type', type: 'string', options: { list: ['Solo Exhibition', 'Group Exhibition', 'Art Fair', 'Event', 'Residency', 'Other'] } }),
    defineField({ name: 'venue', title: 'Venue / Location', type: 'string' }),
    defineField({ name: 'city', title: 'City / Country', type: 'string' }),
    defineField({ name: 'startDate', title: 'Start Date', type: 'date' }),
    defineField({ name: 'endDate', title: 'End Date', type: 'date' }),
    defineField({ name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'link', title: 'External Link', type: 'url' }),
    defineField({ name: 'upcoming', title: 'Upcoming / Current', type: 'boolean' }),
  ],
  orderings: [{ title: 'Date (newest)', name: 'dateDesc', by: [{ field: 'startDate', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'city', date: 'startDate' } },
})
