interface PageHeaderProps {
  title: string
  subtitle?: string
  description?: string
  centered?: boolean
  /** Tighter vertical rhythm, for pages whose content should reach the fold */
  compact?: boolean
}

export default function PageHeader({ title, subtitle, description, centered = false, compact = false }: PageHeaderProps) {
  const pad = compact ? 'pt-14 pb-4 md:pt-20 md:pb-6' : 'pt-20 pb-16 md:pt-28 md:pb-20'
  return (
    <div className={`${pad} ${centered ? 'text-center' : ''}`}>
      <div className="max-w-7xl mx-auto px-6">
        {subtitle && (
          <p className={`text-[10px] uppercase tracking-[0.3em] text-[--color-muted] font-sans font-light ${compact ? 'mb-5' : 'mb-8'}`}>
            {subtitle}
          </p>
        )}
        <h1 className={`font-serif text-5xl md:text-6xl font-light leading-[0.9] tracking-tight text-[--color-charcoal] ${compact ? '' : 'lg:text-7xl'}`}>
          {title}
        </h1>
        {description && (
          <p className={`${compact ? 'mt-5' : 'mt-8'} text-[--color-muted] font-sans font-light text-base max-w-xl leading-relaxed`}>
            {description}
          </p>
        )}
        <div className={`${compact ? 'mt-6' : 'mt-10'} w-12 h-px bg-[--color-gold]`} />
      </div>
    </div>
  )
}
