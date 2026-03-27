import { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'


export const revalidate = 3600

const REDBUBBLE_STORE = 'https://www.redbubble.com/people/ArmelleArt/shop?asc=u'

const designs = [
  {
    name: 'Espíritu de Planta',
    series: 'Transforma',
    products: [
      { type: 'toteBag', image: '/shop/totebag-espiritudeplanta.jpg', url: 'https://www.redbubble.com/i/tote-bag/Espiritu-de-Planta-by-ArmelleArt/177461306.A9G4R' },
      { type: 'pouch', image: '/shop/pouch-espiritudeplanta.jpg', url: 'https://www.redbubble.com/i/pouch/Espiritu-de-Planta-by-ArmelleArt/177461306.440R3' },
      { type: 'clock', image: '/shop/clock-espritudeplanta.jpg', url: 'https://www.redbubble.com/i/clock/Espiritu-de-Planta-by-ArmelleArt/177461306.7PFC0' },
      { type: 'pillow', image: '/shop/pillow-espiritudeplanta.jpg', url: 'https://www.redbubble.com/i/throw-pillow/Espiritu-de-Planta-by-ArmelleArt/177461306.5X2YF' },
      { type: 'backpack', image: '/shop/backpack-espiritudeplanta.jpg', url: 'https://www.redbubble.com/i/backpack/Espiritu-de-Planta-by-ArmelleArt/177461306.K1KHE' },
    ],
  },
  {
    name: 'Mundo Escondido',
    series: 'Transforma',
    products: [
      { type: 'toteBag', image: '/shop/totebag-mundoescondido.jpg', url: 'https://www.redbubble.com/i/tote-bag/Mundo-Escondido-by-ArmelleArt/177462134.A9G4R' },
      { type: 'pouch', image: '/shop/pouch-mundoescondido.jpg', url: 'https://www.redbubble.com/i/pouch/Mundo-Escondido-by-ArmelleArt/177462134.440R3' },
      { type: 'clock', image: '/shop/clock-mundoescondido.jpg', url: 'https://www.redbubble.com/i/clock/Mundo-Escondido-by-ArmelleArt/177462134.7PFC0' },
      { type: 'pillow', image: '/shop/pillow-mundoescondido.jpg', url: 'https://www.redbubble.com/i/throw-pillow/Mundo-Escondido-by-ArmelleArt/177462134.5X2YF' },
      { type: 'dress', image: '/shop/dress-mundoescondido.jpg', url: 'https://www.redbubble.com/i/dress/Mundo-Escondido-by-ArmelleArt/177462134.V4WQ8' },
    ],
  },
  {
    name: 'Vehículo Vegetal',
    series: 'Transforma',
    products: [
      { type: 'toteBag', image: '/shop/totebag-vehiculoVegetal.jpg', url: 'https://www.redbubble.com/i/tote-bag/Vehiculo-Vegetal-by-ArmelleArt/177461542.A9G4R' },
      { type: 'pouch', image: '/shop/pouch-vehiculovegetal.jpg', url: 'https://www.redbubble.com/i/pouch/Vehiculo-Vegetal-by-ArmelleArt/177461542.440R3' },
      { type: 'notebook', image: '/shop/vehiculovegetal-spiral-notebook.jpg', url: 'https://www.redbubble.com/i/notebook/Vehiculo-Vegetal-by-ArmelleArt/177461542.WX3NH' },
      { type: 'clock', image: '/shop/clock-vehiculovegetal.jpg', url: 'https://www.redbubble.com/i/clock/Vehiculo-Vegetal-by-ArmelleArt/177461542.7PFC0' },
      { type: 'pillow', image: '/shop/pillow-vehiculovegetal.jpg', url: 'https://www.redbubble.com/i/throw-pillow/Vehiculo-Vegetal-by-ArmelleArt/177461542.5X2YF' },
    ],
  },
  {
    name: 'El Mundo de las Plantas',
    series: 'Transforma',
    products: [
      { type: 'toteBag', image: '/shop/totebag-elmundodelasplantas.jpg', url: 'https://www.redbubble.com/i/tote-bag/El-mundo-de-las-plantas-by-ArmelleArt/177462452.A9G4R' },
      { type: 'pouch', image: '/shop/pouch-elmundodelasplantas.jpg', url: 'https://www.redbubble.com/i/pouch/El-mundo-de-las-plantas-by-ArmelleArt/177462452.440R3' },
      { type: 'sticker', image: '/shop/elmundodelasplantas-sticker.jpg', url: 'https://www.redbubble.com/i/sticker/El-mundo-de-las-plantas-by-ArmelleArt/177462452.EJUG5' },
      { type: 'clock', image: '/shop/clock-elmundodelasplantas.jpg', url: 'https://www.redbubble.com/i/clock/El-mundo-de-las-plantas-by-ArmelleArt/177462452.7PFC0' },
      { type: 'pillow', image: '/shop/pillow-elmundodelasplantas.jpg', url: 'https://www.redbubble.com/i/throw-pillow/El-mundo-de-las-plantas-by-ArmelleArt/177462452.5X2YF' },
    ],
  },
  {
    name: 'Universo Paralelo',
    series: 'Transforma',
    products: [
      { type: 'toteBag', image: '/shop/totebag-universoparrallelo.jpg', url: 'https://www.redbubble.com/i/tote-bag/Universo-Parrallelo-by-ArmelleArt/177461857.A9G4R' },
      { type: 'pouch', image: '/shop/pouch-universoparrallelo.jpg', url: 'https://www.redbubble.com/i/pouch/Universo-Parrallelo-by-ArmelleArt/177461857.440R3' },
      { type: 'clock', image: '/shop/clock-universoparrallelo.jpg', url: 'https://www.redbubble.com/i/clock/Universo-Parrallelo-by-ArmelleArt/177461857.7PFC0' },
      { type: 'pillow', image: '/shop/pillow-universoparrallelo.jpg', url: 'https://www.redbubble.com/i/throw-pillow/Universo-Parrallelo-by-ArmelleArt/177461857.5X2YF' },
      { type: 'dress', image: '/shop/dress-universoparrallelo.jpg', url: 'https://www.redbubble.com/i/dress/Universo-Parrallelo-by-ArmelleArt/177461857.V4WQ8' },
    ],
  },
]

const productLabels: Record<string, string> = {
  toteBag: 'Tote bag',
  pouch: 'Pouch',
  clock: 'Clock',
  pillow: 'Pillow',
  dress: 'Dress',
  backpack: 'Backpack',
  sticker: 'Sticker',
  notebook: 'Notebook',
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'shop' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('shop')

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-32">

        {/* Compact header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-10">
          <div>
            <h1 className="font-serif text-4xl font-light text-[--color-charcoal]">{t('title')}</h1>
            <p className="font-sans font-light text-sm text-[--color-muted] mt-1">{t('description')}</p>
          </div>
          <a
            href={REDBUBBLE_STORE}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-gold] hover:text-[--color-charcoal] transition-colors shrink-0"
          >
            {t('visitStore')}
          </a>
        </div>
        <div className="w-12 h-px bg-[--color-gold] mb-10" />

        {/* Designs */}
        {designs.map((design, i) => (
          <section key={design.name} className={`mb-20 pb-20 ${i < designs.length - 1 ? 'border-b border-[--color-border]' : ''}`}>
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-light text-[--color-charcoal]">
                {design.name}
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[--color-muted] font-sans font-light mt-1">
                {design.series}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {design.products.map((product) => (
                <a
                  key={product.image}
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="aspect-square relative overflow-hidden rounded-lg bg-[--color-cream] border border-[--color-border] group-hover:border-[--color-gold] transition-colors duration-300">
                    <Image
                      src={product.image}
                      alt={`${design.name} — ${productLabels[product.type]}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                    />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[--color-muted] font-sans font-light mt-2 group-hover:text-[--color-gold] transition-colors">
                    {productLabels[product.type]}
                  </p>
                </a>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="text-center pt-8">
          <a
            href={REDBUBBLE_STORE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-[--color-charcoal] text-[--color-charcoal] px-10 py-4 text-[11px] font-sans font-light tracking-[0.2em] uppercase hover:bg-[--color-charcoal] hover:text-[--color-cream] transition-all duration-300"
          >
            {t('visitStore')}
          </a>
        </section>
      </div>
    </>
  )
}
