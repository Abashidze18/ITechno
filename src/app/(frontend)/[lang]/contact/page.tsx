import { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import ContactForm from '@/components/ContactForm'
import ContactInfo from '@/components/ContactInfo'
import ContactImage from '@/assets/images/Contact.png'
import Image from 'next/image'

interface Props {
  params: Promise<{ lang: 'ka' | 'en' }>
}

type ContactInfoData = {
  infoTitle: string
  phone: string
  email: string
  social: string
  address: string
  mapEmbedUrl: string
}

type ContactPageData = {
  contactPageTitle: string
  subtitle: string
  metaDescription: string
}

// --- 1. DYNAMIC METADATA ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const currentLang = (lang === 'en' ? 'en' : 'ka') as 'en' | 'ka'
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'
  const payload = await getPayload({ config: configPromise })

  const data = await payload.find({
    collection: 'contact-page' as any,
    locale: currentLang,
    limit: 1,
  })

  const doc = data.docs[0] as unknown as ContactPageData | undefined

  const title =
    doc?.contactPageTitle ||
    (currentLang === 'ka' ? 'კონტაქტი - დაგვიკავშირდით' : 'Contact Us - Get in Touch')

  const description =
    doc?.metaDescription?.slice(0, 160) ||
    (currentLang === 'ka'
      ? 'დაგვიკავშირდით I-TECHNO-ს გუნდს. მისამართი: თბილისი, საქართველო.'
      : 'Contact I-TECHNO team. Address: Tbilisi, Georgia.')

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${currentLang}/contact`,
      languages: {
        'ka-GE': `${baseUrl}/ka/contact`,
        'en-US': `${baseUrl}/en/contact`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${currentLang}/contact`,
      siteName: 'I-TECHNO',
      images: [{ url: '/og-contact.jpg', width: 1200, height: 630 }],
      locale: currentLang === 'ka' ? 'ka_GE' : 'en_US',
      type: 'website',
    },
  }
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params
  const currentLang = (lang === 'en' ? 'en' : 'ka') as 'en' | 'ka'
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'
  const payload = await getPayload({ config: configPromise })

  const [pageData, infoData] = await Promise.all([
    payload.find({ collection: 'contact-page' as any, locale: currentLang, limit: 1 }),
    payload.find({ collection: 'contact-info' as any, locale: currentLang, limit: 1 }),
  ])

  if (!pageData.docs.length || !infoData.docs.length) {
    return notFound()
  }

  const t = pageData.docs[0] as unknown as ContactPageData
  const contactInfo = infoData.docs[0] as unknown as ContactInfoData

  // --- 2. LOCAL BUSINESS SCHEMA ---
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'I-TECHNO',
    image: `${baseUrl}/og-image.jpg`,
    '@id': `${baseUrl}/${currentLang}/contact`,
    url: baseUrl,
    telephone: contactInfo.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contactInfo.address,
      addressLocality: 'Tbilisi',
      postalCode: '0100',
      addressCountry: 'GE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.7151,
      longitude: 44.8271,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '19:00',
    },
  }

  return (
    <main className="min-h-screen pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <div className="relative w-full max-w-[1440px] h-[250px] md:h-[300px] mx-auto flex items-center justify-center overflow-hidden rounded-[30px] md:rounded-[40px] mt-8">
        <Image
          src={ContactImage}
          alt={t.contactPageTitle}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter leading-tight">
            {t.contactPageTitle}
          </h1>
          <p className="text-lg md:text-2xl font-light">{t.subtitle}</p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto mt-12 lg:mt-24 px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-5">
            <h2 className="sr-only">Contact Information</h2>
            <ContactInfo t={contactInfo} />
          </div>
          <div className="lg:col-span-7">
            <h2 className="sr-only">Send us a message</h2>
            <ContactForm lang={lang} />
          </div>
        </div>
      </div>
    </main>
  )
}
