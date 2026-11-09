import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intl = createMiddleware(routing)
const SITE = 'https://www.armelleboussidan.com'

// Tell Google the official address of each page (canonical, as an HTTP Link header,
// next to the hreflang links next-intl already sends). Skipped on redirects.
export default function middleware(req: NextRequest) {
  const res = intl(req)
  if (res.status < 300 && !res.headers.get('location')) {
    const canonical = `<${SITE}${req.nextUrl.pathname}>; rel="canonical"`
    const link = res.headers.get('link')
    res.headers.set('link', link ? `${link}, ${canonical}` : canonical)
  }
  return res
}

export const config = {
  matcher: ['/((?!api|_next|studio|.*\\..*).*)'],
}
