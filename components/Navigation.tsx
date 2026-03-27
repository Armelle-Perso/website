'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import DarkModeToggle from './DarkModeToggle'

export default function Navigation() {
  const pathname = usePathname()
  const t = useTranslations('nav')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [artOpen, setArtOpen] = useState(false)

  const navLinks = [
    { label: t('about'), href: '/about' as const },
    { label: t('consulting'), href: '/consulting' as const },
    {
      label: t('art'),
      href: '/art' as const,
      children: [
        { label: t('paintings'), href: '/art/paintings' as const, sub: [
          { label: t('available'), href: '/art/paintings/available' as const },
          { label: t('artInHomes'), href: '/art/paintings/people' as const },
        ]},
        { label: t('collectives'), href: '/art/collectives' as const },
        { label: t('exhibitions'), href: '/art/exhibitions' as const },
        { label: t('shop'), href: '/shop' as const },
      ],
    },
    { label: t('research'), href: '/research' as const },
    { label: t('contact'), href: '/contact' as const },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <header className="sticky top-0 z-50 border-b border-[--color-border]" style={{ backgroundColor: 'var(--color-cream)' }}>
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">

        {/* Logo */}
        <Link href="/" className="font-serif text-base tracking-[0.08em] hover:text-[--color-gold] transition-colors duration-300">
          Armelle Boussidan
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-10 text-[11px] font-sans font-light tracking-[0.18em] uppercase">
          {navLinks.map((link) =>
            link.children ? (
              <li key={link.href} className="relative group">
                <Link href={link.href} className={`uppercase transition-colors duration-300 hover:text-[--color-gold] pb-px ${isActive(link.href) ? 'text-[--color-gold]' : 'text-[--color-charcoal]'}`}>
                  {link.label}
                </Link>
                {/* Dropdown */}
                <ul className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 border border-[--color-border] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200" style={{ backgroundColor: 'var(--color-cream)' }}>
                  {link.children.map((child: any) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className={`block px-5 py-3 text-[11px] tracking-[0.15em] uppercase font-light hover:bg-[--color-gold-light] transition-colors duration-150 ${pathname === child.href ? 'text-[--color-gold]' : ''}`}
                      >
                        {child.label}
                      </Link>
                      {child.sub && child.sub.map((s: any) => (
                        <Link
                          key={s.href}
                          href={s.href}
                          className={`block pl-9 pr-5 py-2.5 text-[10px] tracking-[0.15em] uppercase font-light text-[--color-muted] hover:bg-[--color-gold-light] hover:text-[--color-charcoal] transition-colors duration-150 ${pathname === s.href ? 'text-[--color-gold]' : ''}`}
                        >
                          {s.label}
                        </Link>
                      ))}
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`transition-colors duration-300 hover:text-[--color-gold] ${isActive(link.href) ? 'text-[--color-gold]' : 'text-[--color-charcoal]'}`}
                >
                  {link.label}
                </Link>
              </li>
            )
          )}
          <li><LanguageSwitcher /></li>
          <li><DarkModeToggle /></li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-px bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[--color-border]" style={{ backgroundColor: 'var(--color-cream)' }}>
          <ul className="px-6 py-6 space-y-0">
            {navLinks.map((link) =>
              link.children ? (
                <li key={link.href}>
                  <button
                    onClick={() => setArtOpen(!artOpen)}
                    className="w-full text-left py-3 text-[11px] font-sans font-light tracking-[0.18em] uppercase flex justify-between items-center border-b border-[--color-border]"
                  >
                    {link.label}
                    <span className="text-[--color-muted]">{artOpen ? '−' : '+'}</span>
                  </button>
                  {artOpen && (
                    <ul className="py-2 pl-4">
                      {link.children.map((child: any) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block py-2.5 text-[11px] font-sans font-light tracking-[0.15em] uppercase text-[--color-muted] hover:text-[--color-charcoal] transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.label}
                          </Link>
                          {child.sub && child.sub.map((s: any) => (
                            <Link
                              key={s.href}
                              href={s.href}
                              className="block py-2 pl-5 text-[10px] font-sans font-light tracking-[0.15em] uppercase text-[--color-muted] hover:text-[--color-charcoal] transition-colors"
                              onClick={() => setMobileOpen(false)}
                            >
                              {s.label}
                            </Link>
                          ))}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-3 text-[11px] font-sans font-light tracking-[0.18em] uppercase border-b border-[--color-border] hover:text-[--color-gold] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>
          <div className="px-6 pb-4 flex items-center gap-6">
            <LanguageSwitcher />
            <DarkModeToggle />
          </div>
        </div>
      )}
    </header>
  )
}
