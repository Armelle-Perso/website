'use client'

import Script from 'next/script'
import { useCookieConsent } from './CookieConsent'

// The env var is only set locally, not on Vercel, so production fell back to
// nothing and stopped tracking from 26 Sept 2026. The ID is public anyway.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-7K82NCPMV3'

export default function GoogleAnalytics() {
  const consent = useCookieConsent()

  if (!consent || !GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  )
}
