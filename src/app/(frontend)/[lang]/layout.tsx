import React from 'react'
import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

interface LangLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export async function generateStaticParams() {
  return [{ lang: 'ka' }, { lang: 'en' }]
}

// --- SENIOR SEO: DYNAMIC METADATA GENERATION ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const isEn = lang === 'en'
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://i-techno.ge'
  const isProduction = process.env.NEXT_PUBLIC_INDEXABLE === 'true'

  const slogan = isEn ? 'Security Systems & Technologies' : 'უსაფრთხოების სისტემები და ტექნოლოგიები'

  // KEYWORDS - სტრიქონად, რომ ანალიზატორებმა აუცილებლად წაიკითხონ
  const keywordsStr = isEn
    ? 'Security Cameras, CCTV Installation, Alarm Systems, Smart Home, I-TECHNO, Surveillance, Georgia, Tbilisi, IP Cameras, Hikvision, Hiwatch, NVR DVR Recorder, CCTV Kits, Network Installation, WiFi Network Setup, Office Network Setup, Structured Cabling, Router Configuration, Network Switches, Smart System Installation, Home Automation, Remote Control Systems, Fire Alarm Installation, Fire Detection System, Smoke Detectors, Fire Alarm Panels, Addressable Fire Alarm System, Buy Security Cameras, CCTV Camera Price, Security Systems Shop, Mobile Video Surveillance, Business Security Systems, Warehouse Surveillance, Elevator Cameras, Wireless Cameras, Complete Security Solution, CCTV Installation Tbilisi, Security Systems Tbilisi, Network Services Tbilisi, Fire Alarm Georgia'
    : 'სამეთვალყურეო კამერები, სამეთვალყურეო კამერების მონტაჟი, ვიდეო სამეთვალყურეო სისტემები, CCTV კამერების დაყენება, უსაფრთხოების კამერები სახლისთვის, ოფისის ვიდეო კონტროლი, IP კამერები, Hikvision კამერები, Hiwatch კამერები, კამერების მონტაჟი თბილისში, ინტერნეტ ქსელის მონტაჟი, WiFi ქსელის მოწყობა, ოფისის ქსელის მოწყობა, კაბელური ქსელის გაყვანა, ქსელური ინფრასტრუქტურა, ჭკვიანი სახლი, სახლის ავტომატიზაცია, Smart უსაფრთხოების სისტემა, სახანძრო სიგნალიზაციის მონტაჟი, სახანძრო დეტექციის სისტემა, კვამლის დეტექტორები, მისამართიანი სახანძრო სისტემა, უსაფრთხოების კამერების ყიდვა, ვიდეო რეგისტრატორი, კამერების კომპლექტები, უსაფრთხოების სისტემების მაღაზია, კამერების მონტაჟი საქართველოში, უსაფრთხოების სისტემები თბილისი, ქსელური მომსახურება თბილისი, სახანძრო სისტემა საქართველო, ბიზნეს უსაფრთხოების სისტემა, საწყობის ვიდეო კონტროლი, ლიფტის კამერები, უკაბელო კამერები, სიგნალიზაცია, ჭკვიანი სახლი, დაცვის სისტემები, საქართველო'
  return {
    title: {
      default: `I-TECHNO - ${slogan}`,
      template: `%s | I-TECHNO - ${slogan}`,
    },
    description: isEn
      ? 'High-quality surveillance cameras, alarms, and smart home systems in Georgia.'
      : 'ვიდეო სამეთვალყურეო კამერები, სიგნალიზაცია და ჭკვიანი სახლის სისტემები საქართველოში.',

    // ეს ველი აგენერირებს <meta name="keywords" ...>
    keywords: keywordsStr,

    publisher: 'I-TECHNO',
    authors: [{ name: 'I-TECHNO' }],
    metadataBase: new URL(baseUrl),

    alternates: {
      canonical: `/${lang}`,
      languages: {
        'ka-GE': '/ka',
        'en-US': '/en',
      },
    },

    openGraph: {
      siteName: 'I-TECHNO',
      title: `I-TECHNO - ${slogan}`,
      description: isEn
        ? 'High-quality surveillance cameras and security systems.'
        : 'უმაღლესი ხარისხის კამერები და დაცვის სისტემები.',
      url: `${baseUrl}/${lang}`,
      type: 'website',
      locale: isEn ? 'en' : 'ka',
      images: [{ url: '/og-main.jpg', width: 1200, height: 630, alt: 'I-TECHNO' }],
    },

    robots: {
      index: isProduction,
      follow: isProduction,
      googleBot: {
        index: isProduction,
        follow: isProduction,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // აქ ჩავამატეთ "იძულებითი" თეგები ანალიზატორებისთვის
    other: {
      publisher: 'I-TECHNO',
      author: 'I-TECHNO',
      copyright: 'I-TECHNO',
      language: isEn ? 'en' : 'ka',
      keywords: keywordsStr, // დუბლირება 'other'-ში გარანტიისთვის
    },

    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
  }
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params

  return (
    <div lang={lang} className="min-h-screen flex flex-col">
      <Header lang={lang} />
      <main className="flex-grow px-4">{children}</main>
      <Footer lang={lang} />
    </div>
  )
}
