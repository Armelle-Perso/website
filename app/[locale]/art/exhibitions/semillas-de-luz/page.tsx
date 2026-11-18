import { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { setRequestLocale } from 'next-intl/server'

// Event page for the Batx café show (QR code on the flyer, short link /semillas).
// Opening Thursday 3 Dec 2026 at 18:00, confirmed by Jess on 18 Nov 2026.
export const revalidate = 86400

const MAPS = 'https://www.google.com/maps/search/?api=1&query=Batx%20Santa%20Catalina%2C%20Carrer%20de%20Despuig%2063%2C%20Palma'
const BATX = 'https://batxcafe.com/'
const COMODO = 'https://www.coworking-palma.com/'
// Calendar: 18:00-21:00 Palma time = 17:00-20:00 UTC
const GCAL = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
  + '&text=' + encodeURIComponent('Semillas de luz · Armelle Boussidan (inauguración)')
  + '&dates=20261203T170000Z/20261203T200000Z'
  + '&location=' + encodeURIComponent('Batx Santa Catalina, Carrer de Despuig 63, Palma')
  + '&details=' + encodeURIComponent('Exposición de pintura de Armelle Boussidan. Entrada libre. https://www.armelleboussidan.com/semillas')
const ICS = '/semillas-de-luz.ics'

const T: Record<string, Record<string, string>> = {
  en: {
    kind: 'Painting exhibition', opening: 'Opening', openingDate: 'Thursday 3 December 2026, 6 pm',
    place: 'Where', hours: 'Opening hours', hoursText: 'Mon–Fri 8:00–16:00 · Sat–Sun 9:30–13:30',
    maps: 'Directions (Google Maps)', artist: 'Discover the artist', free: 'Free entry', calendar: 'Add to calendar', other: 'iPhone / Outlook', mapAlt: 'Map: Batx Santa Catalina, the harbour and the cathedral, Palma', flyerAlt: 'Semillas de luz, flyer',
  },
  fr: {
    kind: 'Exposition de peinture', opening: 'Vernissage', openingDate: 'jeudi 3 décembre 2026, 18 h',
    place: 'Lieu', hours: 'Horaires', hoursText: 'Lun–ven 8:00–16:00 · Sam–dim 9:30–13:30',
    maps: 'Itinéraire (Google Maps)', artist: "Découvrir l'artiste", free: 'Entrée libre', calendar: 'Ajouter au calendrier', other: 'iPhone / Outlook', mapAlt: 'Plan : Batx Santa Catalina, le port et la cathédrale, Palma', flyerAlt: 'Semillas de luz, flyer',
  },
  es: {
    kind: 'Exposición de pintura', opening: 'Inauguración', openingDate: 'jueves 3 de diciembre de 2026, 18:00',
    place: 'Lugar', hours: 'Horario', hoursText: 'Lun–vie 8:00–16:00 · Sáb–dom 9:30–13:30',
    maps: 'Cómo llegar (Google Maps)', artist: 'Conocer a la artista', free: 'Entrada libre', calendar: 'Añadir al calendario', other: 'iPhone / Outlook', mapAlt: 'Mapa: Batx Santa Catalina, el puerto y la catedral, Palma', flyerAlt: 'Semillas de luz, flyer',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = T[locale] || T.en
  const description = `${t.kind} · Armelle Boussidan · Batx Santa Catalina, Palma · ${t.opening}: ${t.openingDate} · ${t.free}`
  // Absolute www URL: the bare domain redirects, and WhatsApp does not follow redirects for preview images
  const image = { url: 'https://www.armelleboussidan.com/images/exhibitions/semillas-de-luz-og.jpg', width: 1200, height: 630, alt: 'Semillas de luz', type: 'image/jpeg' }
  const pageUrl = `https://www.armelleboussidan.com${locale === 'en' ? '' : '/' + locale}/art/exhibitions/semillas-de-luz`
  return {
    title: 'Semillas de luz', description,
    openGraph: { title: 'Semillas de luz · Armelle Boussidan', description, url: pageUrl, siteName: 'Armelle Boussidan', images: [image], type: 'website' },
    twitter: { card: 'summary_large_image', title: 'Semillas de luz · Armelle Boussidan', description, images: [image.url] },
  }
}

export default async function SemillasDeLuzPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = T[locale] || T.en
  const label = 'text-[10px] uppercase tracking-[0.25em] font-sans text-[--color-gold] mb-1'
  const btn = 'inline-flex items-center gap-2 border border-[--color-border] px-5 py-3 text-xs uppercase tracking-[0.18em] font-sans text-[--color-charcoal] hover:border-[--color-gold] hover:text-[--color-gold] transition-colors'
  return (
    <section className="max-w-6xl mx-auto px-6 pt-12 pb-24 md:pt-16">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-10 md:gap-x-16 md:gap-y-0 items-start">
        <div className="md:col-start-1 md:row-start-1">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-muted] font-sans font-light mb-6">{t.kind} · Armelle Boussidan</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light leading-[0.9] tracking-tight text-[--color-charcoal] mb-8">Semillas de luz</h1>
          <div className="w-12 h-px bg-[--color-gold] mb-8" />
          <div className="space-y-5 font-sans text-sm text-[--color-charcoal]">
            <div><p className={label}>{t.opening}</p><p className="font-serif text-2xl font-light">{t.openingDate}</p><p className="mt-1 text-xs uppercase tracking-[0.18em] text-[--color-muted]">{t.free}</p></div>
            <div><p className={label}>{t.place}</p><p>Batx Santa Catalina · Carrer de Despuig 63, Palma</p></div>
            <div><p className={label}>{t.hours}</p><p>{t.hoursText}</p></div>
          </div>
          <div className="flex flex-wrap gap-3 mt-10">
            <a href={MAPS} target="_blank" rel="noopener noreferrer" className={btn}>{t.maps} <span aria-hidden>↗</span></a>
            <a href={BATX} target="_blank" rel="noopener noreferrer" className={btn}>Batx <span aria-hidden>↗</span></a>
            <a href={COMODO} target="_blank" rel="noopener noreferrer" className={btn}>Cómodo&amp;Co <span aria-hidden>↗</span></a>
          </div>
          <p className="mt-6 text-xs font-sans text-[--color-muted]">
            {t.calendar}{locale === 'fr' ? ' :' : ':'}{' '}
            <a href={GCAL} target="_blank" rel="noopener noreferrer" className="text-[--color-gold] hover:underline">Google Calendar</a>
            {' · '}
            <a href={ICS} download className="text-[--color-gold] hover:underline">{t.other}</a>
          </p>
        </div>
        <Image src="/images/exhibitions/semillas-de-luz-flyer.jpg" alt={t.flyerAlt} width={1080} height={1350}
          className="md:col-start-2 md:row-start-1 md:row-span-2 w-full md:w-auto h-auto md:max-h-[calc(100svh-8rem)] md:ml-auto shadow-sm" sizes="(max-width: 768px) 100vw, 560px" priority />
        {/* Map + link to the artist: under the info on desktop, after the flyer on phones */}
        <div className="md:col-start-1 md:row-start-2">
          {/* Small map of Santa Catalina (OpenStreetMap, pin on Batx, harbour and cathedral); opens Google Maps */}
          <a href={MAPS} target="_blank" rel="noopener noreferrer" className="block md:mt-8 max-w-[320px] group">
            <Image src="/images/exhibitions/semillas-de-luz-plano.jpg" alt={t.mapAlt} width={1305} height={846}
              className="w-full h-auto border border-[--color-border] group-hover:border-[--color-gold] transition-colors" sizes="320px" />
          </a>
          <Link href="/art" className="group inline-flex items-baseline gap-3 mt-10">
            <span className="font-serif text-2xl font-light text-[--color-charcoal] group-hover:text-[--color-muted] transition-colors duration-300">{t.artist}</span>
            <span className="text-xs tracking-widest text-[--color-gold] transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </Link>
        </div>
      </div>

    </section>
  )
}
