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

// --- 1. SENIOR SEO: DYNAMIC METADATA & ALTERNATES ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lang } = await params
  const currentLang: SupportedLang = (lang === 'en' ? 'en' : 'ka') as SupportedLang
  const payload = await getPayload({ config: await config })
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'
  const imageBaseUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_URL

  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    locale: currentLang,
    depth: 1,
  })

  const product = docs[0] as unknown as Product
  if (!product) return { title: `პროდუქტი ვერ მოიძებნა` }

  // Title სლოგანით
  const title = `${product.title}`

  const description = product.specifications
    ? `${product.title}: ${product.specifications.substring(0, 160)}`
    : `${product.title} - შეიძინეთ გარანტიით I-TECHNO-ში. დაგვიკავშირდით კონსულტაციისთვის.`

  const mainImage = product.mainImage as Media | undefined
  const imageUrl = mainImage?.url || ''
  const fullImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : imageUrl
      ? `${imageBaseUrl}${imageUrl}`
      : `${baseUrl}/og-image.png`

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${currentLang}/products/${slug}`,
      languages: {
        'ka-GE': `${baseUrl}/ka/products/${slug}`,
        'en-US': `${baseUrl}/en/products/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${currentLang}/products/${slug}`,
      // შეცვლილია 'website'-ზე ერორის ასაცილებლად
      type: 'website',
      images: [{ url: fullImageUrl, width: 1200, height: 630, alt: product.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
    },
    // Production-ისთვის ინდექსაციის ჩართვა
    robots: {
      index: process.env.NEXT_PUBLIC_INDEXABLE === 'true',
      follow: process.env.NEXT_PUBLIC_INDEXABLE === 'true',
    },
  }
}
export default async function ProductDetails({ params }: PageProps) {
  const { slug, lang } = await params
  const payload = await getPayload({ config: await config })
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'

  const currentLang: SupportedLang = (lang === 'en' ? 'en' : 'ka') as SupportedLang
  const t: Dictionary = (dict as Record<SupportedLang, Dictionary>)[currentLang] || dict.ka

  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    locale: currentLang,
    depth: 2,
  })

  const product = docs[0] as unknown as Product
  if (!product) return notFound()

  // სურათების დამუშავება
  const galleryImages = (product.images || [])
    .map((item) => (item.image as unknown as Media | null | undefined)?.url || null)
    .filter((url): url is string => !!url)

  const mainImage = product.mainImage as unknown as Media | undefined
  const category = product.category as unknown as Category | undefined

  // მსგავსი პროდუქტები
  const relatedRes = await payload.find({
    collection: 'products',
    limit: 4,
    where: {
      and: [{ category: { equals: category?.id } }, { slug: { not_equals: slug } }],
    },
    locale: currentLang,
    depth: 1,
  })

  const isPriceZero = !product.price || product.price === 0
  const hasDiscount = !!(
    product.discountPrice &&
    product.discountPrice > 0 &&
    product.discountPrice < (product.price || 0)
  )
  const displayPrice = hasDiscount ? product.discountPrice! : product.price || 0

  // --- 2. SENIOR SEO: JSON-LD STRUCTURED DATA ---
  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    image: mainImage?.url ? `${baseUrl}${mainImage.url}` : '',
    description: product.description || product.title,
    brand: { '@type': 'Brand', name: 'I-Techno' },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/${currentLang}/products/${slug}`,
      priceCurrency: 'GEL',
      price: displayPrice,
      availability:
        product.stock === 'in-stock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  }

  return (
    <div className="bg-white min-h-screen text-slate-900 antialiased overflow-x-hidden">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <main className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
        {/* Breadcrumbs - Important for Crawler Navigation */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-10 flex-wrap">
          <Link
            href={`/${currentLang}/products`}
            className="hover:text-[#1976BA] transition-colors"
          >
            {currentLang === 'ka' ? 'პროდუქცია' : 'Products'}
          </Link>
          {category && (
            <>
              <ChevronRight size={10} className="shrink-0" />
              <Link
                href={`/${currentLang}/products/${category.slug}`}
                className="hover:text-[#1976BA] transition-colors"
              >
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight size={10} className="shrink-0" />
          <span className="text-[#1976BA] font-black truncate">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-32 items-start">
          <div className="lg:col-span-5 w-full max-w-lg mx-auto lg:mx-0">
            <ProductGallery
              mainImage={mainImage?.url || ''}
              images={galleryImages}
              title={product.title}
            />
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

                <h2 className="text-[12px] text-gray-600 font-medium font-firaGo400">
                  {currentLang === 'ka'
                    ? '* გთხოვთ, მარაგის გადასამოწმებლად დაგვიკავშირდეთ'
                    : '* Please contact us to verify availability'}
                </h2>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
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
              <h3 className="text-[18px] font-semibold uppercase tracking-[0.3em] text-black">
                {currentLang === 'ka' ? 'პროდუქტის აღწერა' : 'Description'}
              </h3>
              <div className="text-slate-600 text-[16px] leading-relaxed font-light whitespace-pre-line max-w-2xl">
                {product.description}
              </div>
            </div>

            {product.specifications && (
              <div className="border-l-2 border-slate-100 pl-8 py-2 mb-8 bg-slate-50/50 rounded-r-xl">
                <p className="text-sm leading-relaxed text-slate-500 font-light max-w-md">
                  {product.specifications}
                </p>
              </div>
            )}

            {/* CTAs - Conversion Optimization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-xl">
              <a
                href="tel:+995595126054"
                className="bg-[#1976BA] text-white py-4 rounded-xl flex justify-center items-center gap-2 font-bold hover:bg-[#1976BA]/90 transition-all shadow-lg shadow-[#1976BA]/20"
              >
                <Phone size={14} /> {currentLang === 'ka' ? 'დაგვირეკეთ' : 'Call Us'}
              </a>
              <a
                href={`https://wa.me/995555123456?text=${encodeURIComponent(product.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 border border-slate-200 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors"
              >
                <MessageCircle size={16} className="text-green-500" /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Similar Products - Essential for Internal Linking SEO */}
        {relatedRes.docs.length > 0 && (
          <section className="border-t border-slate-50 pt-24">
            <div className="flex items-end justify-between mb-16">
              <div className="space-y-3">
                <h2 className="text-3xl lg:text-4xl font-medium tracking-tight">
                  {currentLang === 'ka' ? 'მსგავსი მოდელები' : 'Similar Models'}
                </h2>
                <div className="h-1 w-12 bg-[#1976BA] rounded-full" />
              </div>
              <Link
                href={`/${currentLang}/products`}
                className="group flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest border-b border-black pb-1 hover:text-[#1976BA] hover:border-[#1976BA] transition-all"
              >
                {currentLang === 'ka' ? 'ყველას ნახვა' : 'View All'}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
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
