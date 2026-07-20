import { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { safeFetch } from '@/sanity/lib/client'
import { consultingProjectsQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import WordCloud from '@/components/WordCloud'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'consulting' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function ConsultingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('consulting')
  const nav = await getTranslations('nav')

  const projects = await safeFetch<any[]>(consultingProjectsQuery)
  const settings = await safeFetch<any>(siteSettingsQuery)
  const featured = projects?.filter((p: any) => p.featured) || []

  const services = [
    { title: t('consultantTitle'), desc: t('consultantDesc') },
    { title: t('interpreterTitle'), desc: t('interpreterDesc') },
    { title: t('writerTitle'), desc: t('writerDesc') },
  ]

  const professionalPath = [
    { org: 'Life Itself', role: t('lifeItselfRole'), dates: t('lifeItselfDates'), desc: t('lifeItselfDesc'), href: 'https://lifeitself.org/', external: true, logo: '/logos/lifeitself.svg' },
    { org: t('siaOrg'), role: t('siaRole'), dates: t('siaDates'), desc: t('siaDesc'), href: 'https://entersia.com/', external: true, logo: '/logos/sia.png' },
    { org: 'Seed2Shirt', role: t('seed2shirtRole'), dates: t('seed2shirtDates'), desc: t('seed2shirtDesc'), href: 'https://seed2shirt.com/fep/', external: true, logo: '/logos/seed2shirt.png' },
    { org: 'Existence', role: t('existenceRole'), dates: t('existenceDates'), desc: t('existenceDesc'), href: 'https://existence.fr/', external: true, logo: '/logos/existence.ico' },
    { org: 'Orinko', org2: 'Vibratis', href2: 'https://vibratis.fr/', role: t('orinkoRole'), dates: t('orinkoDates'), desc: t('orinkoDesc'), href: 'https://orinko.org/', external: true, logo: '/logos/orinko.png' },
    { org: 'Sunseed Desert Technology', role: t('sunseedRole'), dates: t('sunseedDates'), desc: t('sunseedDesc'), href: 'https://www.sunseed.org.uk/', external: true, logo: '/logos/sunseed.png' },
    { org: 'M33', role: t('m33Role'), dates: t('m33Dates'), desc: t('m33Desc'), href: 'https://www.instagram.com/atelierm33/', external: true, logo: '/logos/m33.png' },
  ]

  const education = [
    { title: t('phdTitle'), place: t('phdPlace'), date: t('phdDate'), detail: t('phdDetail') },
    { title: t('maTitle'), place: t('maPlace'), date: t('maDate'), detail: t('maDetail') },
    { title: t('m1Title'), place: t('m1Place'), date: t('m1Date'), detail: t('m1Detail') },
  ]

  const training = [
    { title: t('permacultureTitle'), place: t('permaculturePlace'), date: t('permacultureDate'), href: 'https://circlepermaculture.com' },
    { title: t('yogaTitle'), place: t('yogaPlace'), date: t('yogaDate'), href: 'http://yoga-toulouse.fr' },
    { title: t('herbalTitle'), place: t('herbalPlace'), date: t('herbalDate'), href: 'https://www.legattilier.com/' },
  ]

  const languages = [
    { lang: t('frenchLang'), level: t('frenchLevel') },
    { lang: t('englishLang'), level: t('englishLevel') },
    { lang: t('spanishLang'), level: t('spanishLevel') },
  ]

  // Testimonials — add entries as they arrive; the section stays hidden while this is empty.
  // Each testimonial carries its quote in all three languages plus the language it was written in.
  const testimonials: {
    quotes: { en: string; fr: string; es: string }
    name: string
    roles: { en: string; fr: string; es: string }
    originalLang: 'en' | 'fr' | 'es'
  }[] = [
    {
      name: 'Dominique Pichard',
      originalLang: 'fr',
      roles: {
        en: 'P-Mod Photographies, leading member of M33',
        fr: 'P-Mod Photographies, membre moteur de M33',
        es: 'P-Mod Photographies, miembro destacado de M33',
      },
      quotes: {
        fr: `J'ai rejoint M33 parce qu'Armelle avait réussi ce que peu de gens font: transformer une intuition en lieu vivant. Elle n'a pas seulement ouvert un atelier, elle a construit un collectif qui tient dans la durée, où des pratiques très différentes cohabitent vraiment. Voir loin tout en fédérant les gens autour d'un cap commun, c'est sa vraie force.`,
        en: `I joined M33 because Armelle had achieved what few people manage: turning an intuition into a living place. She didn't just open a studio, she built a collective that lasts over time, where very different practices genuinely coexist. Seeing far ahead while rallying people around a shared direction, that is her real strength.`,
        es: `Me uní a M33 porque Armelle había logrado lo que pocas personas consiguen: transformar una intuición en un lugar vivo. No solo abrió un taller, construyó un colectivo que perdura en el tiempo, donde conviven de verdad prácticas muy diferentes. Ver lejos y a la vez unir a las personas en torno a un rumbo común: esa es su verdadera fuerza.`,
      },
    },
    {
      name: 'Markus Fordemann',
      originalLang: 'en',
      roles: {
        en: 'Founder & CEO, SIA',
        fr: 'Fondateur & CEO, SIA',
        es: 'Fundador & CEO, SIA',
      },
      quotes: {
        en: `Armelle is super annoying. Like, for real. If you like stagnation, do not talk to her. If you prefer mediocre activities, run. She improves projects and plans faster and better than everyone else, and her grammar is better too. Every time I work with her, she spots the underlying issues in teams, structures, and processes in the blink of an eye, then spends all her energy communicating them reasonably. If people faced the truth Armelle delivers, it would work. But, people. Your team will need a good level of self-confidence and a no-ego approach to life at the same time. Her ability to generate complex, detailed plans, with granular actions and a long-term big-picture strategy, almost instantly, can shock people. What annoys me most is that she doesn't just bring the better plan, she also gets everyone on board with it. She reads people, understands what drives them, and moves the team in the same direction. As a leader, if you can make your interest her interest, your venture has already won. Armelle is a true gem for your business success and healthy team dynamics. You gotta be ready for Armelle. She's ready, for sure.`,
        fr: `Armelle est super pénible. Vraiment. Si vous aimez l'immobilisme, ne lui parlez pas. Si vous préférez la médiocrité, fuyez. Elle améliore les projets et les plans plus vite et mieux que tout le monde, et en plus elle a une meilleure orthographe. À chaque fois que je travaille avec elle, elle repère en un clin d'œil les vrais problèmes dans les équipes, les structures et les processus, puis dépense toute son énergie à les formuler avec tact. Si les gens acceptaient la vérité qu'Armelle leur livre, ça marcherait. Mais bon, les gens. Votre équipe aura besoin d'une bonne dose de confiance en soi et, en même temps, d'un rapport à la vie sans ego. Sa capacité à produire des plans complexes et détaillés, avec des actions précises et une vision stratégique à long terme, presque instantanément, peut déstabiliser. Ce qui m'agace le plus, c'est qu'elle n'apporte pas seulement le meilleur plan : elle réussit aussi à embarquer tout le monde. Elle sait lire les gens, comprendre ce qui les motive, et faire avancer l'équipe dans la même direction. En tant que dirigeant, si vous arrivez à faire de votre intérêt le sien, votre projet a déjà gagné. Armelle est une vraie perle pour la réussite de votre entreprise et pour une dynamique d'équipe saine. Il faut être prêt pour Armelle. Elle, elle l'est, c'est sûr.`,
        es: `Armelle es superpesada. En serio. Si te gusta el estancamiento, no hables con ella. Si prefieres las cosas mediocres, huye. Mejora los proyectos y los planes más rápido y mejor que nadie, y encima tiene mejor ortografía. Cada vez que trabajo con ella, detecta en un abrir y cerrar de ojos los problemas de fondo en los equipos, las estructuras y los procesos, y luego gasta toda su energía en comunicarlos con tacto. Si la gente aceptara la verdad que Armelle entrega, funcionaría. Pero, la gente. Tu equipo necesitará una buena dosis de confianza en sí mismo y, a la vez, una actitud sin ego ante la vida. Su capacidad para generar planes complejos y detallados, con acciones concretas y una estrategia a largo plazo, casi al instante, puede dejar a la gente atónita. Lo que más me molesta es que no solo trae el mejor plan: también consigue que todo el equipo se sume. Sabe leer a las personas, entender lo que las mueve y llevar al equipo en la misma dirección. Como líder, si consigues que tu interés sea el suyo, tu proyecto ya ha ganado. Armelle es una verdadera joya para el éxito de tu negocio y para una dinámica de equipo sana. Hay que estar preparado para Armelle. Ella lo está, seguro.`,
      },
    },
    {
      name: 'Paola Guigou',
      originalLang: 'fr',
      roles: {
        en: 'Photographer, Co-founder of M33',
        fr: 'Photographe, Co-fondatrice de M33',
        es: 'Fotógrafa, Cofundadora de M33',
      },
      quotes: {
        fr: `Sur ma liste des femmes inspirantes il y a Armelle Boussidan. C'est une des rares personnes à qui j'ai dit oui sans détours. D'abord partenaire, puis amie, elle a ce mélange précieux: esprit qui voit loin, intuition juste et vraie humanité. Avec elle, nos idées ont trouvé rapidement leur trajectoire. On a cofondé M33 en 2014. Au départ, nous étions deux, une mini enveloppe de départ, un hangar bancal et un rêve immense: un espace artistique modulable, multidisciplinaire, vivant. Là où beaucoup voyaient un gouffre à travaux et à frais, nous avons vu une scène de création, de transmission et de solidarité, pensée pour durer. Aujourd'hui en 2026, M33 se porte à merveille, c'est un collectif et un lieu de travail pour 14 indépendants, entourés de partenaires. Rien de magique: une vision assumée, de l'huile de coude, de la générosité, et bien sûr une Armelle pendant les 4 premières années de la vie de l'association, pour garder le cap. Armelle écrit juste, pense large, écoute vraiment. Elle connaît ses forces, ses limites, et délègue sans ego. Naturellement, j'avais pris en charge les aspects techniques et logistiques (plans, chantiers, montages) pendant qu'elle cadrait, structurait et rassemblait. En réunion, c'était un pilier: elle recentre, clarifie, fait émerger les décisions et laisse chacun trouver sa place. J'ai appris que l'impossible devient un itinéraire quand on pense long terme, qu'on ose la modularité et qu'on reste fidèle aux gens. Armelle est visionnaire sans grandiloquence, précise sans rigidité, généreuse sans posture. Je lui fais confiance à 100%. Pour un projet qui demande stratégie, écriture, structuration et mise en mouvement, c'est ma meilleure partenaire !`,
        en: `On my list of inspiring women is Armelle Boussidan. She's one of the rare people I said yes to without hesitation. First a partner, then a friend, she has that precious mix: a mind that sees far, sound intuition, and true humanity. With her, our ideas quickly found their path. We co-founded M33 in 2014. At the start there were just the two of us, a tiny starting budget, a rickety warehouse, and an enormous dream: a modular, multidisciplinary, living artistic space. Where many saw a money pit of renovations and costs, we saw a stage for creation, transmission, and solidarity, built to last. Today, in 2026, M33 is thriving: a collective and a workplace for 14 freelancers, surrounded by partners. Nothing magic about it: a committed vision, elbow grease, generosity, and of course an Armelle during the association's first four years, to keep us on course. Armelle writes with precision, thinks broadly, and truly listens. She knows her strengths, her limits, and delegates without ego. Naturally, I took on the technical and logistical side (plans, building work, installations) while she framed, structured, and brought people together. In meetings she was a pillar: she refocuses, clarifies, draws out decisions, and lets everyone find their place. I learned that the impossible becomes a route when you think long-term, dare to be modular, and stay loyal to people. Armelle is visionary without grandiosity, precise without rigidity, generous without posturing. I trust her 100%. For a project that calls for strategy, writing, structure, and getting things moving, she is my best partner!`,
        es: `En mi lista de mujeres inspiradoras está Armelle Boussidan. Es una de las pocas personas a las que dije que sí sin rodeos. Primero socia, luego amiga, tiene esa mezcla preciosa: una mente que ve lejos, una intuición certera y una humanidad verdadera. Con ella, nuestras ideas encontraron rápidamente su rumbo. Cofundamos M33 en 2014. Al principio éramos dos, un pequeño presupuesto inicial, un hangar destartalado y un sueño inmenso: un espacio artístico modulable, multidisciplinar y vivo. Donde muchos veían un pozo sin fondo de obras y gastos, nosotras vimos un escenario de creación, transmisión y solidaridad, pensado para durar. Hoy, en 2026, M33 va de maravilla: es un colectivo y un lugar de trabajo para 14 autónomos, rodeados de colaboradores. Nada de magia: una visión asumida, mucho esfuerzo, generosidad y, por supuesto, una Armelle durante los primeros cuatro años de vida de la asociación, para mantener el rumbo. Armelle escribe con precisión, piensa en grande y escucha de verdad. Conoce sus fortalezas, sus límites, y delega sin ego. Naturalmente, yo me encargaba de los aspectos técnicos y logísticos (planos, obras, montajes) mientras ella encuadraba, estructuraba y reunía a la gente. En las reuniones era un pilar: recentra, aclara, hace emerger las decisiones y deja que cada uno encuentre su lugar. Aprendí que lo imposible se convierte en un itinerario cuando se piensa a largo plazo, se apuesta por la modularidad y se es fiel a las personas. Armelle es visionaria sin grandilocuencia, precisa sin rigidez, generosa sin poses. Confío en ella al 100%. Para un proyecto que requiere estrategia, escritura, estructuración y puesta en marcha, ¡es mi mejor socia!`,
      },
    },
  ]

  const loc: 'en' | 'fr' | 'es' = locale === 'fr' ? 'fr' : locale === 'es' ? 'es' : 'en'
  const translatedFromLabels: Record<'en' | 'fr' | 'es', string> = {
    en: t('translatedFromEn'),
    fr: t('translatedFromFr'),
    es: t('translatedFromEs'),
  }
  const localizedTestimonials = testimonials.map((item) => ({
    quote: item.quotes[loc] || item.quotes[item.originalLang],
    name: item.name,
    role: item.roles[loc],
    translatedFrom: loc !== item.originalLang ? translatedFromLabels[item.originalLang] : null,
  }))

  return (
    <>
      {/* Hero — word cloud + intro, fits one screen */}
      <section className="min-h-[calc(100svh-3.5rem)] flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <WordCloud locale={locale} />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-muted] font-sans font-light mb-4">
              {t('subtitle')}
            </p>
            <div className="flex items-center gap-5 mb-6">
              <h1 className="font-serif text-5xl md:text-7xl font-light leading-[0.9] tracking-tight text-[--color-charcoal]">
                {t('title')}
              </h1>
              {settings?.heroImage && (
                <div className="shrink-0 h-20 w-20 md:h-24 md:w-24 overflow-hidden rounded-full ring-1 ring-[--color-border]">
                  <Image
                    src={urlFor(settings.heroImage).width(400).height(500).url()}
                    alt={settings.heroImageAlt || 'Armelle Boussidan'}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover object-[50%_8%]"
                  />
                </div>
              )}
            </div>
            <p className="font-serif text-lg md:text-xl font-light text-[--color-muted] mb-6">
              {t('tagline')}
            </p>
            <div className="w-8 h-px bg-[--color-gold] mb-6" />
            <div className="space-y-4">
              <p className="font-sans font-light text-sm leading-relaxed text-[--color-charcoal]">
                {t('intro')}
              </p>
              <p className="font-sans font-light text-sm leading-relaxed text-[--color-charcoal]">
                {t('vision')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-32">

        {/* Services */}
        <section className="mb-28 pb-28 border-b border-[--color-border]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-10">
            {t('servicesTitle')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {services.map((s) => (
              <div key={s.title}>
                <h3 className="font-serif text-xl font-light mb-1">{s.title}</h3>
                <p className="text-[11px] uppercase tracking-[0.15em] text-[--color-muted] font-sans font-light">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Professional Path */}
        <section className="mb-28 pb-28 border-b border-[--color-border]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-10">
            {t('professionalPath')}
          </p>
          <div className="space-y-0">
            {professionalPath.map((item) => (
              <div key={item.org} className="border-b border-[--color-border] py-5 flex items-start gap-4">
                {item.logo && (
                  <Image
                    src={item.logo}
                    alt={item.org}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain shrink-0 mt-0.5 rounded"
                  />
                )}
                <div className="flex-1 flex items-baseline justify-between gap-6">
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      {item.external ? (
                        <>
                          <a href={item.href} target="_blank" rel="noopener noreferrer" className="font-serif text-base font-light hover:text-[--color-gold] transition-colors">
                            {item.org}
                          </a>
                          {item.org2 && (
                            <>
                              <span className="font-serif text-base font-light">&</span>
                              <a href={item.href2} target="_blank" rel="noopener noreferrer" className="font-serif text-base font-light hover:text-[--color-gold] transition-colors">
                                {item.org2}
                              </a>
                            </>
                          )}
                        </>
                      ) : (
                        <Link href={item.href} className="font-serif text-base font-light hover:text-[--color-gold] transition-colors">
                          {item.org}
                        </Link>
                      )}
                      <span className="text-[11px] font-sans font-light text-[--color-muted]">{item.role}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] font-sans font-light text-[--color-muted] leading-relaxed">{item.desc}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-gold] shrink-0">
                    {item.dates}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Selected Projects (Sanity-driven) */}
        {featured.length > 0 && (
          <section className="mb-28 pb-28 border-b border-[--color-border]">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-10">
              {t('selectedProjects')}
            </p>
            <div className="space-y-0">
              {featured.map((p: any) => (
                <div key={p._id} className="border-b border-[--color-border] py-5 flex items-baseline justify-between gap-6">
                  <div>
                    <p className="font-serif text-base font-light">{p.title}</p>
                    {p.description && <p className="mt-0.5 text-[11px] text-[--color-muted] font-sans font-light">{p.description}</p>}
                    {p.services?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {p.services.map((s: string) => (
                          <span key={s} className="text-xs border border-[--color-border] px-2 py-0.5 font-sans text-[--color-muted]">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-gold] shrink-0">
                    {p.year}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Training — 2 columns like about page */}
        <section className="mb-28 pb-28 border-b border-[--color-border]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Education */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-8">
                {t('education')}
              </p>
              <div className="space-y-0">
                {education.map((item) => (
                  <div key={item.title} className="border-b border-[--color-border] py-5 flex items-baseline justify-between gap-6">
                    <div>
                      <p className="font-serif text-base font-light">{item.title}</p>
                      <p className="text-[11px] font-sans font-light text-[--color-muted] mt-0.5">{item.place}</p>
                      <p className="text-[11px] font-sans font-light text-[--color-muted] mt-0.5">{item.detail}</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-gold] shrink-0">
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Training */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-8">
                {t('additionalTraining')}
              </p>
              <div className="space-y-0">
                {training.map((item) => (
                  <div key={item.title} className="border-b border-[--color-border] py-5 flex items-baseline justify-between gap-6">
                    <div>
                      <p className="font-serif text-base font-light">{item.title}</p>
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-[11px] font-sans font-light text-[--color-muted] hover:text-[--color-charcoal] transition-colors">
                        {item.place}
                      </a>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[--color-gold] shrink-0">
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Publications */}
        <section className="mb-28 pb-28 border-b border-[--color-border]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-10">
            {nav('research')}
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <h3 className="font-serif text-2xl md:text-3xl font-light text-[--color-charcoal] mb-3 leading-tight">
                {t('publicationsTitle')}
              </h3>
              <p className="font-sans font-light text-sm text-[--color-muted] leading-relaxed">
                {t('publicationsDesc')}
              </p>
            </div>
            <Link
              href="/consulting/publications"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-sans font-light text-[--color-gold] hover:text-[--color-charcoal] transition-colors shrink-0"
            >
              {t('viewPublications')}
            </Link>
          </div>
        </section>

        {/* Languages */}
        <section className="mb-28 pb-28 border-b border-[--color-border]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-gold] font-sans font-light mb-10">
            {t('languages')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {languages.map((item) => (
              <div key={item.lang}>
                <h3 className="font-serif text-xl font-light mb-1">{item.lang}</h3>
                <p className="text-[11px] uppercase tracking-[0.15em] text-[--color-muted] font-sans font-light">{item.level}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials — rotating carousel; renders only once populated */}
        <TestimonialsCarousel testimonials={localizedTestimonials} title={t('testimonialsTitle')} />
      </div>

      {/* CTA */}
      <section className="bg-[--color-gold-light] border-t border-[--color-border] py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[--color-gold] font-sans text-sm font-medium tracking-wide uppercase mb-3">{t('availability')}</p>
          <h2 className="font-serif text-3xl mb-4">{t('collaboratorTitle')}</h2>
          <p className="text-[--color-muted] font-sans mb-8">{t('collaboratorDesc')}</p>
          <Link href="/contact" className="inline-block bg-[--color-charcoal] text-white px-10 py-4 text-sm font-sans font-medium tracking-wide hover:bg-[--color-gold] transition-colors">
            {t('getInTouch')}
          </Link>
        </div>
      </section>
    </>
  )
}
