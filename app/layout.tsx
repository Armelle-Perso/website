import type { Metadata } from 'next'
import Script from 'next/script'
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://armelleboussidan.com'),
  title: { default: 'Armelle Boussidan', template: '%s | Armelle Boussidan' },
  description: 'Artist and consultant based in Strasbourg. Paintings, jewelry, multimedia, translation and facilitation.',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    siteName: 'Armelle Boussidan',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${cormorant.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light')document.documentElement.setAttribute('data-theme','dark')}catch(e){document.documentElement.setAttribute('data-theme','dark')}})()`,
          }}
        />
      </head>
      <body>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-7K82NCPMV3" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-7K82NCPMV3');`}
        </Script>
        {children}
      </body>
    </html>
  )
}
