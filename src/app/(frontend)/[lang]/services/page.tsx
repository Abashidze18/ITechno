import React from 'react'
import { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import ServicesClient from './ServicesClient'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ lang: string }>
}

type ServicesDoc = {
  items: Array<{
    id?: string
    title: string
    description: string
    brands?: Array<{ name: string }>
    features?: Array<{ name: string }>
  }>
  cta: {
    title: string
    text: string
  }
  header: {
    badge: string
    heading: string
    sub: string
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'

async function getServicesDoc(lang: 'ka' | 'en'): Promise<ServicesDoc | null> {
  const payload = await getPayload({ config: configPromise })
  const data = await payload.find({
    collection: 'services' as any,
    locale: lang,
    limit: 1,
  })
  return (data.docs[0] as unknown as ServicesDoc) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const currentLang = lang === 'en' ? 'en' : ('ka' as 'en' | 'ka')

  const doc = await getServicesDoc(currentLang)

  const title =
    doc?.header?.heading ||
    (currentLang === 'ka' ? 'სერვისები | I-TECHNO' : 'Services | I-TECHNO')

  const description =
    (doc?.header?.sub ?? '').slice(0, 160) ||
    (currentLang === 'ka'
      ? 'I-TECHNO გთავაზობთ უსაფრთხოების სისტემების სრულ სპექტრს — ვიდეოთვალთვალი, წვდომის კონტროლი, კიბერუსაფრთხოება და IT ინფრასტრუქტურა.'
      : 'I-TECHNO offers a full range of security systems — CCTV, access control, cybersecurity and IT infrastructure.')

  const serviceKeywords = doc?.items?.map((s) => s.title) ?? []
  const baseKeywords =
    currentLang === 'ka'
      ? ['კიბერუსაფრთხოება', 'ვიდეოთვალთვალი', 'წვდომის კონტროლი', 'IT ინფრასტრუქტურა', 'CCTV']
      : ['cybersecurity', 'CCTV', 'access control', 'IT infrastructure', 'security systems Georgia']

  return {
    title,
    description,
    keywords: [...baseKeywords, ...serviceKeywords],

    alternates: {
      canonical: `${BASE_URL}/${currentLang}/services`,
      languages: {
        'ka-GE': `${BASE_URL}/ka/services`,
        'en-US': `${BASE_URL}/en/services`,
      },
    },

    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${currentLang}/services`,
      siteName: 'I-TECHNO',
      locale: currentLang === 'ka' ? 'ka_GE' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/og/services.png`],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
  }
}

export default async function ServicesPage({ params }: Props) {
  const { lang } = await params
  const currentLang = lang === 'en' ? 'en' : ('ka' as 'en' | 'ka')

  const doc = await getServicesDoc(currentLang)

  if (!doc) return notFound()

  return <ServicesClient lang={lang} t={doc} />
}
