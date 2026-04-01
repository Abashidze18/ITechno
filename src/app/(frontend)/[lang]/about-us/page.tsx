import React from 'react'
import { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import AboutusClient from './AboutusClient'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ lang: string }>
}

type AboutUsDoc = {
  hero: {
    titleBlue: string
    titleBlack: string
    story: string
    image: string | { url: string; alt?: string }
  }
  priority: {
    title: string
    sub: string
    analysis: string
  }
  directions: {
    title: string
    items: Array<{
      title: string
      image: string | { url: string; alt?: string }
    }>
  }
  support: {
    badge: string
    title: string
    text1: string
    text2: string
  }
  whyUs: {
    badge: string
    title: string
    items: Array<{
      title: string
      text: string
    }>
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'

// ── ერთი fetch — ორივე generateMetadata და page იყენებს ──────────────────────
async function getAboutDoc(lang: 'ka' | 'en'): Promise<AboutUsDoc | null> {
  const payload = await getPayload({ config: configPromise })
  const data = await payload.find({
    collection: 'about-us' as any,
    locale: lang,
    limit: 1,
  })
  return (data.docs[0] as unknown as AboutUsDoc) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const currentLang = lang === 'en' ? 'en' : ('ka' as 'en' | 'ka')

  const doc = await getAboutDoc(currentLang)

  const title = doc?.hero?.titleBlue
    ? `${doc.hero.titleBlue} ${doc.hero.titleBlack} | I-TECHNO`
    : currentLang === 'ka'
      ? 'ჩვენს შესახებ | I-TECHNO'
      : 'About Us | I-TECHNO'

  const description =
    (doc?.hero?.story ?? '').slice(0, 160) ||
    (currentLang === 'ka'
      ? 'გაიცანით I-TECHNO — უმაღლესი ხარისხის უსაფრთხოების სისტემები საქართველოში.'
      : 'Meet I-TECHNO — high-quality security systems in Georgia.')

  const whyUsKeywords = doc?.whyUs?.items?.map((i) => i.title) ?? []

  return {
    title,
    description,
    keywords:
      currentLang === 'ka'
        ? ['I-TECHNO', 'უსაფრთხოების სისტემები', 'კომპანია', 'საქართველო', ...whyUsKeywords]
        : ['I-TECHNO', 'security systems', 'Georgia', 'about us', ...whyUsKeywords],

    alternates: {
      canonical: `${BASE_URL}/${currentLang}/about-us`,
      languages: {
        'ka-GE': `${BASE_URL}/ka/about-us`,
        'en-US': `${BASE_URL}/en/about-us`,
      },
    },

    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${currentLang}/about-us`,
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
      images: [`${BASE_URL}/og/about.png`],
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

export default async function AboutPage({ params }: Props) {
  const { lang } = await params
  const currentLang = lang === 'en' ? 'en' : ('ka' as 'en' | 'ka')

  const doc = await getAboutDoc(currentLang)

  if (!doc) return notFound()

  return <AboutusClient lang={lang} t={doc} />
}
