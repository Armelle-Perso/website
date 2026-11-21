import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

// Closing link for art pages that would otherwise end without a next step
// (Collectives, Exhibitions): the same large link as at the end of the Creative path.
export default async function AvailableWorksLink({ className = '' }: { className?: string }) {
  const t = await getTranslations('creativePath')
  return (
    <Link href="/art/available" className={`group inline-flex items-baseline gap-3 ${className}`}>
      <span className="font-serif text-2xl font-light text-[--color-charcoal] group-hover:text-[--color-muted] transition-colors duration-300">
        {t('seeAvailable').replace(' →', '')}
      </span>
      <span className="text-xs tracking-widest text-[--color-gold] transition-transform duration-300 group-hover:translate-x-1.5">→</span>
    </Link>
  )
}
