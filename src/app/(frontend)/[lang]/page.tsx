import { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { CategoryBar } from '@/components/CategoryBar'
import { Hero } from '@/components/Hero'
import { PopularProducts } from '@/components/PopularProducts'
import { BrandsSlider } from '@/components/BrandSlider'
import AboutGrid from '@/components/AboutGrid'
import ServicesGrid from '@/components/ServicesGrid'
import { Shield, Network, Cpu, Flame, DoorOpen, CheckCircle } from 'lucide-react'

type PageParams = { params: Promise<{ lang: string }> }

type Media = {
  url: string
  alt?: string
}

type HeroSliderData = {
  buttonAllProducts: string
  buttonOurServices: string
  slides: Array<{
    id?: string
    title: string
    description: string
    link1: string
    link2: string
    image: string | Media
  }>
}

// სერვისების მონაცემების ტიპი
type ServicesData = {
  directions: {
    title: string
    items: Array<{
      title: string
      image: string | Media
    }>
  }
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const resolvedParams = await params
  const lang = resolvedParams.lang === 'en' ? 'en' : 'ka'
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'
  const siteName = 'I-TECHNO'

  const data = {
    ka: {
      title: 'I-TECHNO - უსაფრთხოების სისტემები და ტექნოლოგიები',
      description:
        'უმაღლესი ხარისხის სამეთვალყურეო კამერები, სიგნალიზაცია და ჭკვიანი სახლის სისტემები საქართველოში.',
    },
    en: {
      title: 'I-TECHNO - Security Systems & Technologies',
      description: 'High-quality surveillance cameras, alarms, and smart home systems in Georgia.',
    },
  }

  const currentData = data[lang as keyof typeof data]

  return {
    title: { default: currentData.title, template: `%s | ${siteName}` },
    description: currentData.description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${lang}`,
      languages: { 'ka-GE': '/ka', 'en-US': '/en' },
    },
    openGraph: {
      title: currentData.title,
      description: currentData.description,
      url: `${baseUrl}/${lang}`,
      type: 'website',
      siteName,
      images: [{ url: `${baseUrl}/og-image.png`, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: 'summary_large_image',
      title: currentData.title,
      description: currentData.description,
      images: [`${baseUrl}/og-image.png`],
    },
  }
}

export default async function Page({ params }: PageParams) {
  const resolvedParams = await params
  const lang = (resolvedParams.lang === 'en' ? 'en' : 'ka') as 'ka' | 'en'
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'

  const payload = await getPayload({ config: await config })
  const icons = [Shield, Cpu, Flame, DoorOpen, Network, CheckCircle]
  const getImageUrl = (media: string | Media) => (typeof media === 'object' ? media.url : media)
  const [popularProducts, heroRes, aboutRes] = await Promise.all([
    payload.find({
      collection: 'products',
      where: { isPopular: { equals: true } },
      limit: 10,
      locale: lang,
    }),
    payload.find({ collection: 'hero-slider' as any, locale: lang, limit: 1 }),
    payload.find({ collection: 'about-us' as any, locale: lang, limit: 1 }),
  ])

  const heroData = (heroRes.docs[0] || {}) as unknown as HeroSliderData
  const servicesData = (aboutRes.docs[0] || {}) as unknown as ServicesData

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/${lang}/#website`,
        url: `${baseUrl}/${lang}`,
        name: 'I-TECHNO',
        publisher: { '@id': `${baseUrl}/${lang}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/${lang}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${baseUrl}/${lang}/#organization`,
        name: 'I-TECHNO',
        image: `${baseUrl}/og-image.png`,
        url: `${baseUrl}/${lang}`,
        telephone: '+995595126054',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Tbilisi, Georgia',
          addressLocality: 'Tbilisi',
          addressCountry: 'GE',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 41.7151, longitude: 44.8271 },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '10:00',
          closes: '19:00',
        },
      },
    ],
  }

  return (
    <div className="min-h-screen pb-20 antialiased font-firaGo">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <h1 className="sr-only">
        {lang === 'ka'
          ? 'I-TECHNO - უსაფრთხოების სისტემების და ვიდეო კამერების ონლაინ მაღაზია'
          : 'I-TECHNO - Online Store for Security Systems and Cameras'}
      </h1>

      <CategoryBar lang={lang} />

      <main>
        <section aria-label="Main Introduction">
          <Hero lang={lang} t={heroData} />
        </section>

        <section className="mt-8" aria-label="Our Partners">
          <BrandsSlider />
        </section>

        {servicesData?.directions && (
          <section className="my-12" aria-label="Services and Directions">
            <ServicesGrid data={servicesData} icons={icons} getImageUrl={getImageUrl} />
          </section>
        )}

        <section className="py-12" aria-labelledby="popular-heading">
          <PopularProducts
            products={popularProducts.docs}
            lang={lang}
            title={lang === 'ka' ? 'პოპულარული პროდუქტები' : 'Popular Products'}
          />
        </section>

        <section className="py-16" aria-labelledby="about-grid-heading">
          <AboutGrid lang={lang} />
        </section>
      </main>
    </div>
  )
}
