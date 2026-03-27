import { Metadata } from 'next'
import Image from 'next/image'
import PageHeader from '@/components/PageHeader'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('nav')
  return { title: t('collectives') }
}

const collectives = [
  {
    name: 'Artmixture',
    location: { en: 'Alpujarra, Spain', fr: 'Alpujarra, Espagne', es: 'Alpujarra, España' },
    years: '2025',
    description: {
      en: 'A creative collective bringing together artists for collaborative performances and projects.',
      fr: 'Un collectif créatif réunissant des artistes pour des performances et projets collaboratifs.',
      es: 'Un colectivo creativo que reúne artistas para performances y proyectos colaborativos.',
    },
    role: { en: 'Member', fr: 'Membre', es: 'Miembro' },
    link: 'https://artmixturecollective.com/',
  },
  {
    name: 'Artists\' Network Alpujarra',
    location: { en: 'Alpujarra, Spain', fr: 'Alpujarra, Espagne', es: 'Alpujarra, España' },
    years: '2018–2022',
    description: {
      en: 'A network of artists based in the Alpujarra region of Andalusia, connecting creators across disciplines.',
      fr: 'Un réseau d\'artistes basé dans la région de l\'Alpujarra en Andalousie, reliant des créateurs de toutes disciplines.',
      es: 'Una red de artistas en la región de la Alpujarra en Andalucía, conectando creadores de todas las disciplinas.',
    },
    role: { en: 'Member', fr: 'Membre', es: 'Miembro' },
    link: null,
  },
  {
    name: 'M33',
    location: { en: 'Strasbourg, France', fr: 'Strasbourg, France', es: 'Estrasburgo, Francia' },
    years: '2014',
    description: {
      en: 'Collaborative art studio in a former aircraft engine factory (Junkers), co-founded with photographer Paola Guigou. A modular space transformed with recycled materials into a creative hive where each artist has their own world with the potential to share projects.',
      fr: 'Atelier d\'art collaboratif dans une ancienne usine de moteurs d\'avion (Junkers), co-fondé avec la photographe Paola Guigou. Un espace modulable transformé avec des matériaux recyclés en une ruche créative où chaque artiste a son propre univers avec la possibilité de partager des projets.',
      es: 'Taller de arte colaborativo en una antigua fábrica de motores de avión (Junkers), co-fundado con la fotógrafa Paola Guigou. Un espacio modular transformado con materiales reciclados en una colmena creativa donde cada artista tiene su propio mundo con la posibilidad de compartir proyectos.',
    },
    role: { en: 'Co-founder', fr: 'Co-fondatrice', es: 'Co-fundadora' },
    link: 'https://www.instagram.com/atelierm33/',
    images: [
      { src: '/images/collectives/m33-facade.jpg', alt: 'M33 — Junkers Factory, Strasbourg' },
      { src: '/images/collectives/m33-paola.jpg', alt: 'Setting up the studio' },
      { src: '/images/collectives/m33-inaug.jpg', alt: 'M33 inauguration' },
      { src: '/images/collectives/m33-event.jpg', alt: 'Event at M33' },
    ],
  },
  {
    name: 'The Lost Room',
    location: { en: 'Villeurbanne (Lyon), France', fr: 'Villeurbanne (Lyon), France', es: 'Villeurbanne (Lyon), Francia' },
    years: '2011–2012',
    description: {
      en: 'My first studio — a repurposed printer\'s building where artists, musicians, DJs, dancers, poets and creatives came together to experiment. The venue has closed, but its impact on our creativity is certainly not forgotten.',
      fr: 'Mon premier atelier — un ancien bâtiment d\'imprimerie où artistes, musiciens, DJ, danseurs, poètes et créatifs se réunissaient pour expérimenter. Le lieu a fermé, mais son impact sur notre créativité n\'est certainement pas oublié.',
      es: 'Mi primer taller — un antiguo edificio de imprenta donde artistas, músicos, DJs, bailarines, poetas y creativos se reunían para experimentar. El local ha cerrado, pero su impacto en nuestra creatividad ciertamente no se ha olvidado.',
    },
    role: { en: 'Member', fr: 'Membre', es: 'Miembro' },
    link: null,
    images: [
      { src: '/images/collectives/lost-room-atelier.jpg', alt: 'The Lost Room — studio space, Villeurbanne' },
      { src: '/images/collectives/lost-room-event.jpg', alt: 'Event at The Lost Room' },
    ],
  },
]

const residency = {
  name: 'Anankha',
  location: { en: 'Orarca Techno Zen Centre, Spain', fr: 'Orarca Techno Zen Centre, Espagne', es: 'Orarca Techno Zen Centre, España' },
  years: '2020',
  description: {
    en: 'First artist in residence at the Molino, a space mindfully designed to support contemplation, healing and creativity. In collaboration with visual artist Michal Hermon, we explored our connection to nature through video art, installation and ritual — leading to the creation of Anankha, a live prismatic ceremony held in a tipi.',
    fr: 'Première artiste en résidence au Molino, un espace conçu pour la contemplation, la guérison et la créativité. En collaboration avec l\'artiste visuelle Michal Hermon, nous avons exploré notre connexion à la nature à travers l\'art vidéo, l\'installation et le rituel — menant à la création d\'Anankha, une cérémonie prismatique en direct dans un tipi.',
    es: 'Primera artista en residencia en el Molino, un espacio diseñado para la contemplación, la sanación y la creatividad. En colaboración con la artista visual Michal Hermon, exploramos nuestra conexión con la naturaleza a través del videoarte, la instalación y el ritual — creando Anankha, una ceremonia prismática en vivo en un tipi.',
  },
  role: { en: 'Artist in Residence', fr: 'Artiste en résidence', es: 'Artista en residencia' },
  link: 'https://www.orarca.org/',
}

export default async function CollectivesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('nav')
  const lang = (locale === 'fr' || locale === 'es') ? locale : 'en'

  return (
    <>
      <PageHeader
        title={t('collectives')}
        subtitle="Art"
      />

      {/* Collectives */}
      <section className="max-w-5xl mx-auto px-6 pb-20 space-y-16">
        {collectives.map((col) => (
          <div key={col.name} className="border-b border-[--color-border] pb-16 last:border-0">
            <div className={col.images ? 'grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16 items-start' : ''}>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-4">
                  <h2 className="font-serif text-3xl font-light">
                    {col.link ? (
                      <a href={col.link} target="_blank" rel="noopener noreferrer" className="hover:text-[--color-gold] transition-colors duration-300">
                        {col.name} <span className="text-lg">↗</span>
                      </a>
                    ) : col.name}
                  </h2>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-gold]">
                    {col.role[lang]}
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted] mb-4">
                  {[col.location[lang], col.years].filter(Boolean).join(' · ')}
                </p>
                <p className="font-sans font-light text-sm leading-relaxed text-[--color-muted]">
                  {col.description[lang]}
                </p>
              </div>
              {col.images && (
                <div className="grid grid-cols-2 gap-3">
                  {col.images.map((img) => (
                    <div key={img.src} className="overflow-hidden">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={400}
                        height={300}
                        className="w-[calc(100%+16px)] h-[calc(100%+16px)] max-w-none object-cover -m-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Residency */}
      <section className="border-t border-[--color-border] max-w-5xl mx-auto px-6 py-20">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-12">
          {lang === 'fr' ? 'Résidence' : lang === 'es' ? 'Residencia' : 'Residency'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16 items-start">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-4">
              <h2 className="font-serif text-3xl font-light">
                <a href={residency.link} target="_blank" rel="noopener noreferrer" className="hover:text-[--color-gold] transition-colors duration-300">
                  {residency.name} <span className="text-lg">↗</span>
                </a>
              </h2>
              <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-gold]">
                {residency.role[lang]}
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-muted] mb-4">
              {residency.location[lang]} · {residency.years}
            </p>
            <p className="font-sans font-light text-sm leading-relaxed text-[--color-muted]">
              {residency.description[lang]}
            </p>
          </div>
          <div className="space-y-6">
            <div className="aspect-video">
              <iframe
                src="https://www.youtube.com/embed/Zjqw1j-XYAg"
                title="Anankha — Live Prismatic Ceremony"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <Image
              src="/images/collectives/anankha.webp"
              alt="Anankha — Live Prismatic Ceremony, Orarca 2020"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>
    </>
  )
}
