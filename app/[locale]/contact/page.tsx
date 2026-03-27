import { Suspense } from 'react'
import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <Suspense>
      <ContactForm />
    </Suspense>
  )
}
