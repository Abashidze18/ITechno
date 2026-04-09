import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import ProductGallery from '@/components/ProductGallery'
import { ProductCard } from '@/components/ProductCard'
import Link from 'next/link'
import { Metadata } from 'next'
import { Phone, MessageCircle, ChevronRight, ArrowRight } from 'lucide-react'
import dict from '@/lib/translations.json'
import { Product, Category, Media } from '@/payload-types'

type SupportedLang = 'ka' | 'en'
type Dictionary = typeof dict.ka

interface PageProps {
  params: Promise<{ slug: string; lang: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'
const CDN_URL = process.env.NEXT_PUBLIC_S3_PUBLIC_URL || 'https://cdn.itechno.ge'
const PRODUCTS_ROUTE = 'product-details'
const PRODUCTS_LIST_ROUTE = 'products'

function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return `${BASE_URL}/og-image.png`
  if (url.startsWith('http')) return url
  if (url.startsWith('/')) return `${CDN_URL}${url}`
  return `${CDN_URL}/${url}`
}

async function getProduct(slug: string, lang: SupportedLang, depth: 1 | 2 = 1) {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    locale: lang,
    depth,
  })
  return docs[0] as unknown as Product | undefined
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lang } = await params
  const currentLang = (lang === 'en' ? 'en' : 'ka') as SupportedLang

  const product = await getProduct(slug, currentLang, 1)
  if (!product)
    return { title: currentLang === 'ka' ? 'პროდუქტი ვერ მოიძებნა' : 'Product not found' }

  const mainImage = product.mainImage as unknown as Media | undefined
  // resolveImageUrl — CDN სრული URL, არასდროს relative
  const imageUrl = resolveImageUrl(mainImage?.url)

  const title = product.title
  const description = product.specifications
    ? `${product.title}: ${product.specifications.substring(0, 155)}`
    : currentLang === 'ka'
      ? `${product.title} — შეიძინეთ გარანტიით I-TECHNO-ში.`
      : `${product.title} — Buy with warranty at I-TECHNO.`

  const pageUrl = `${BASE_URL}/${currentLang}/${PRODUCTS_ROUTE}/${slug}`

  return {
    // ── metadataBase აუცილებელია ──────────────────────────────────────────────
    // გარეშე: Next.js locale: 'ka_GE'-ს flagcdn.com/ge.svg-ად გარდაქმნის og:image-ში
    // არსებობისას: ყველა URL სწორად რეზოლვდება BASE_URL-ის მიმართ
    metadataBase: new URL(BASE_URL),

    title,
    description,

    alternates: {
      canonical: pageUrl,
      languages: {
        ka: `${BASE_URL}/ka/${PRODUCTS_ROUTE}/${slug}`,
        en: `${BASE_URL}/en/${PRODUCTS_ROUTE}/${slug}`,
      },
    },

    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'website',
      siteName: 'I-TECHNO',
      // locale გამოტოვებულია — სწორედ ეს იწვევდა flagcdn bug-ს
      images: [
        {
          url: imageUrl, // სრული CDN URL — relative არ არის
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },

    robots: {
      index: process.env.NEXT_PUBLIC_INDEXABLE === 'true',
      follow: process.env.NEXT_PUBLIC_INDEXABLE === 'true',
      googleBot: {
        index: process.env.NEXT_PUBLIC_INDEXABLE === 'true',
        follow: process.env.NEXT_PUBLIC_INDEXABLE === 'true',
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function ProductDetails({ params }: PageProps) {
  const { slug, lang } = await params
  const currentLang = (lang === 'en' ? 'en' : 'ka') as SupportedLang
  const t: Dictionary = (dict as Record<SupportedLang, Dictionary>)[currentLang] || dict.ka

  const product = await getProduct(slug, currentLang, 2)
  if (!product) return notFound()

  const mainImage = product.mainImage as unknown as Media | undefined
  const category = product.category as unknown as Category | undefined

  const galleryImages = (product.images || [])
    .map((item) => (item.image as unknown as Media | null | undefined)?.url || null)
    .filter((url): url is string => !!url)
    .map(resolveImageUrl)

  const isPriceZero = !product.price || product.price === 0
  const hasDiscount = !!(
    product.discountPrice &&
    product.discountPrice > 0 &&
    product.discountPrice < (product.price || 0)
  )
  const displayPrice = hasDiscount ? product.discountPrice! : product.price || 0

  const relatedRes = await (
    await getPayload({ config: await config })
  ).find({
    collection: 'products',
    limit: 4,
    where: {
      and: [{ category: { equals: category?.id } }, { slug: { not_equals: slug } }],
    },
    locale: currentLang,
    depth: 1,
  })

  const pageUrl = `${BASE_URL}/${currentLang}/${PRODUCTS_ROUTE}/${slug}`

  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    image: resolveImageUrl(mainImage?.url),
    description: product.description || product.title,
    brand: { '@type': 'Brand', name: 'I-TECHNO' },
    offers: {
      '@type': 'Offer',
      url: pageUrl,
      priceCurrency: 'GEL',
      price: isPriceZero ? undefined : displayPrice,
      availability:
        product.stock === 'in-stock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'I-TECHNO' },
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: currentLang === 'ka' ? 'პროდუქცია' : 'Products',
        item: `${BASE_URL}/${currentLang}/${PRODUCTS_ROUTE}`,
      },
      ...(category
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: category.name,
              item: `${BASE_URL}/${currentLang}/${PRODUCTS_ROUTE}/${category.slug}`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: category ? 3 : 2,
        name: product.title,
        item: pageUrl,
      },
    ],
  }

  return (
    <div className="bg-white min-h-screen text-slate-900 antialiased overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
        <nav
          aria-label="breadcrumb"
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-10 flex-wrap"
        >
          <Link
            href={`/${currentLang}/${PRODUCTS_LIST_ROUTE}`}
            className="hover:text-[#1976BA] transition-colors"
          >
            {currentLang === 'ka' ? 'პროდუქცია' : 'Products'}
          </Link>
          {category && (
            <>
              <ChevronRight size={10} className="shrink-0" aria-hidden="true" />
              <Link
                href={`/${currentLang}/${PRODUCTS_LIST_ROUTE}/${category.slug}`}
                className="hover:text-[#1976BA] transition-colors"
              >
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight size={10} className="shrink-0" aria-hidden="true" />
          <span className="text-[#1976BA] font-black truncate" aria-current="page">
            {product.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-32 items-start">
          <div className="lg:col-span-5 w-full max-w-lg mx-auto lg:mx-0 flex flex-col gap-10">
            <ProductGallery
              mainImage={resolveImageUrl(mainImage?.url)}
              images={galleryImages}
              title={product.title}
            />
            {product.specifications && (
              <div className="border-l-2 border-slate-100 px-8 py-4 mb-8 bg-slate-50/50 rounded-r-xl">
                <p className="text-sm leading-relaxed text-slate-500 font-light max-w-md">
                  {product.specifications}
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 flex flex-col">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div
                  className={`inline-flex items-center justify-center px-4 py-1 rounded-md text-[13px] font-bold text-white w-fit
                    ${product.stock === 'in-stock' ? 'bg-[#1976BA]' : 'bg-red-500'}`}
                >
                  {product.stock === 'in-stock'
                    ? currentLang === 'ka'
                      ? 'მარაგშია'
                      : 'In Stock'
                    : currentLang === 'ka'
                      ? 'არ არის მარაგში'
                      : 'Out of Stock'}
                </div>
                <p className="text-[12px] text-gray-600 font-medium font-firaGo400">
                  {currentLang === 'ka'
                    ? '* გთხოვთ, მარაგის გადასამოწმებლად დაგვიკავშირდეთ'
                    : '* Please contact us to verify availability'}
                </p>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] break-words">
                {product.title}
              </h1>
            </div>

            <div className="pt-8 pb-4">
              {isPriceZero ? (
                <p className="text-2xl font-light text-slate-400">
                  {currentLang === 'ka' ? 'ფასი შეთანხმებით' : 'Price on request'}
                </p>
              ) : (
                <div className="flex items-baseline gap-5">
                  <span className="text-5xl font-extralight tracking-tighter text-[#1976BA]">
                    {displayPrice.toLocaleString()}₾
                  </span>
                  {hasDiscount && (
                    <span className="text-2xl text-slate-300 line-through font-extralight">
                      {product.price?.toLocaleString()}₾
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="pt-6 pb-8 space-y-4 border-t border-slate-200">
              <h2 className="text-[18px] font-semibold uppercase tracking-[0.3em] text-black">
                {currentLang === 'ka' ? 'პროდუქტის აღწერა' : 'Description'}
              </h2>
              <div className="text-slate-600 text-[16px] leading-relaxed font-light whitespace-pre-line max-w-2xl">
                {product.description}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-xl">
              <a
                href="tel:+995595126054"
                className="bg-[#1976BA] text-white py-4 rounded-xl flex justify-center items-center gap-2 font-bold hover:bg-[#1976BA]/90 transition-all shadow-lg shadow-[#1976BA]/20"
              >
                <Phone size={14} aria-hidden="true" />
                {currentLang === 'ka' ? 'დაგვირეკეთ' : 'Call Us'}
              </a>
              <a
                href={`https://wa.me/995555123456?text=${encodeURIComponent(product.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 border border-slate-200 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors"
              >
                <MessageCircle size={16} className="text-green-500" aria-hidden="true" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {relatedRes.docs.length > 0 && (
          <section
            className="border-t border-slate-50 pt-24"
            aria-label={currentLang === 'ka' ? 'მსგავსი მოდელები' : 'Similar Models'}
          >
            <div className="flex items-end justify-between mb-16">
              <div className="space-y-3">
                <h2 className="text-3xl lg:text-4xl font-medium tracking-tight">
                  {currentLang === 'ka' ? 'მსგავსი მოდელები' : 'Similar Models'}
                </h2>
                <div className="h-1 w-12 bg-[#1976BA] rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {relatedRes.docs.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item as unknown as Product}
                  lang={currentLang}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
