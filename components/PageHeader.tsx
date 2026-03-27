interface PageHeaderProps {
  title: string
  subtitle?: string
  description?: string
  centered?: boolean
}

export default function PageHeader({ title, subtitle, description, centered = false }: PageHeaderProps) {
  return (
    <div className={`pt-20 pb-16 md:pt-28 md:pb-20 ${centered ? 'text-center' : ''}`}>
      <div className="max-w-7xl mx-auto px-6">
        {subtitle && (
          <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-muted] font-sans font-light mb-8">
            {subtitle}
          </p>
        )}
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[0.9] tracking-tight text-[--color-charcoal]">
          {title}
        </h1>
        {description && (
          <p className="mt-8 text-[--color-muted] font-sans font-light text-base max-w-xl leading-relaxed">
            {description}
          </p>
        )}
        <div className="mt-10 w-12 h-px bg-[--color-gold]" />
      </div>
    </div>
  )
}
