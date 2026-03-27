import { groq } from 'next-sanity'

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  name, tagline, tagline_fr, tagline_es, bio, bio_fr, bio_es,
  heroImage, heroImageAlt, socialLinks, seoDescription, seoDescription_fr, seoDescription_es
}`

export const paintingSeriesAllQuery = groq`*[_type == "paintingSeries"] | order(year desc, order asc){
  _id, title, slug, year, coverImage, description, description_fr, description_es,
  "availableCount": count(artworks[available != false]),
  "firstAvailableImage": artworks[available != false][0].image
}`

export const availableCoverQuery = groq`*[_type == "paintingSeries" && slug.current == "2015-2017"][0]
  .artworks[title match "Sol del Coraz*" && !(title match "*overview*")][0].image`

export const availablePaintingsQuery = groq`*[_type == "paintingSeries" && title != "People with their painting" && count(artworks[available != false]) > 0] | order(year desc) {
  _id, title, slug, year, medium,
  "availableArtworks": artworks[available != false]{
    image, title, slug, medium, dimensions, hideDimensions, featured, year
  }
}`

export const availableNavQuery = groq`*[_type == "paintingSeries" && title != "People with their painting" && count(artworks[available != false]) > 0] | order(year desc) {
  slug,
  "items": artworks[available != false && slug.current != null]{ title, slug }
}`

export const paintingSeriesBySlugQuery = groq`*[_type == "paintingSeries" && slug.current == $slug][0]{
  _id, title, slug, year, description, description_fr, description_es, medium,
  artworks[]{ image, title, slug, medium, dimensions, hideDimensions, featured, year, available, subseries }
}`

export const artworkBySlugQuery = groq`*[_type == "paintingSeries" && slug.current == $seriesSlug][0]{
  _id, title, slug, year, medium,
  "artwork": artworks[slug.current == $artworkSlug][0]{
    image, title, slug, medium, dimensions, hideDimensions, year, available, link, subseries
  },
  "siblings": artworks[image != null && slug.current != null]{ title, slug, image }
}`

export const allArtworkSlidesQuery = groq`*[_type == "paintingSeries"] | order(year desc, order asc){
  "seriesSlug": slug.current,
  "items": artworks[image != null && slug.current != null]{ title, slug, image }
}`

export const jewelryCollectionsQuery = groq`*[_type == "jewelryCollection"] | order(order asc){
  _id, title, slug, subtitle, description, collaborator, pieces[]{ image, title, category, materials, available }
}`

export const exhibitionsQuery = groq`*[_type == "exhibition"] | order(startDate desc){
  _id, title, type, venue, city, startDate, endDate, description, image, link, upcoming, collaborators
}`

export const collectivesQuery = groq`*[_type == "collective"] | order(order asc){
  _id, name, slug, location, years, description, image, gallery, link
}`

export const consultingProjectsQuery = groq`*[_type == "consultingProject"] | order(order asc){
  _id, title, year, description, services, languages, featured
}`

export const researchQuery = groq`*[_type == "researchItem"] | order(year desc){
  _id, title, year, language, coAuthors, publication, description, link
}`
