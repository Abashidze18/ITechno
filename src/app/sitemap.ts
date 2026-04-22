import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const revalidate = 604800 // 7 დღე

type SlugDoc = { slug: string; updatedAt?: string }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: await config })
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'
  const langs = ['ka', 'en'] as const

  const staticPages = [
    { path: '', priority: 1.0, freq: 'weekly' as const },
    { path: '/about-us', priority: 0.7, freq: 'monthly' as const },
    { path: '/contact', priority: 0.7, freq: 'monthly' as const },
  ]

  const staticEntries = staticPages.flatMap(({ path, priority, freq }) =>
    langs.map((lang) => ({
      url: `${baseUrl}/${lang}${path}`,
      lastModified: new Date(),
      changeFrequency: freq,
      priority,
      alternates: {
        languages: {
          'ka-GE': `${baseUrl}/ka${path}`,
          'en-US': `${baseUrl}/en${path}`,
          'x-default': `${baseUrl}/ka${path}`,
        },
      },
    })),
  )

  // კატეგორიები — 200-ზე ნაკლებია, pagination არ სჭირდება
  const categoriesRes = await payload.find({
    collection: 'categories',
    limit: 200,
    depth: 0,
    pagination: false,
    select: { slug: true, updatedAt: true },
  })

  const categoryEntries = (categoriesRes.docs as SlugDoc[]).flatMap((cat) =>
    langs.map((lang) => ({
      url: `${baseUrl}/${lang}/products/${cat.slug}`,
      lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
      alternates: {
        languages: {
          'ka-GE': `${baseUrl}/ka/products/${cat.slug}`,
          'en-US': `${baseUrl}/en/products/${cat.slug}`,
          'x-default': `${baseUrl}/ka/products/${cat.slug}`,
        },
      },
    })),
  )

  // პროდუქტები — paginated fetch, ყველა გვერდი
  const fetchAllProducts = async (): Promise<SlugDoc[]> => {
    const all: SlugDoc[] = []
    let page = 1
    let hasNextPage = true

    while (hasNextPage) {
      const res = await payload.find({
        collection: 'products',
        limit: 100,
        page,
        depth: 0,
        select: { slug: true, updatedAt: true },
      })
      all.push(...(res.docs as SlugDoc[]))
      hasNextPage = res.hasNextPage
      page++
    }

    return all
  }

  const allProducts = await fetchAllProducts()

  const productEntries = allProducts.flatMap((prod) =>
    langs.map((lang) => ({
      url: `${baseUrl}/${lang}/products/${prod.slug}`,
      lastModified: prod.updatedAt ? new Date(prod.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          'ka-GE': `${baseUrl}/ka/products/${prod.slug}`,
          'en-US': `${baseUrl}/en/products/${prod.slug}`,
          'x-default': `${baseUrl}/ka/products/${prod.slug}`,
        },
      },
    })),
  )

  return [...staticEntries, ...categoryEntries, ...productEntries]
}
