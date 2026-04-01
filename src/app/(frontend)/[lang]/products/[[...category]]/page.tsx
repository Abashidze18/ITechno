import { getPayload } from 'payload'
import config from '@/payload.config'
import { Products } from '@/components/Products'
import dict from '@/lib/translations.json'
import { Where } from 'payload'
import { Metadata } from 'next'
import { PaginatedDocs } from 'payload'
import { Category, Product } from '@/payload-types'
import { getCachedCategories } from '@/lib/getCachedCategories' // ✅

type Dictionary = typeof dict.ka
type SupportedLang = 'ka' | 'en'
type UniqueSpecs = Record<string, string[]>

interface PageProps {
  params: Promise<{ lang: string; category?: string[] }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}

// --- SEO & DYNAMIC METADATA ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, category } = await params
  const categorySlug = category?.[category.length - 1]
  const currentLang = (lang === 'en' ? 'en' : 'ka') as SupportedLang
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'

  let title = currentLang === 'ka' ? 'მაღაზია' : 'Shop'
  let description =
    currentLang === 'ka'
      ? 'აღმოაჩინეთ უახლესი ტექნოლოგიები, უსაფრთხოების კამერები და ჭკვიანი სახლის სისტემები I-TECHNO-ზე.'
      : 'Discover the latest technologies, security cameras, and smart home systems at I-TECHNO.'

  if (categorySlug) {
    try {
      // ✅ cache-დან ვიღებთ, DB-ზე არ მივდივართ
      const allCats = await getCachedCategories(currentLang)
      const cat = allCats.find((c) => c.slug === categorySlug)
      if (cat) {
        const catName = cat.name || categorySlug
        title = `${catName}`
        description =
          currentLang === 'ka'
            ? `იყიდეთ ${catName} საუკეთესო ფასად. გარანტია და ადგილზე მიტანის სერვისი მთელ საქართველოში.`
            : `Buy ${catName} at the best price. Warranty and delivery service throughout Georgia.`
      }
    } catch (e) {
      console.error('Metadata fetch error', e)
    }
  }

  const canonicalPath = categorySlug ? `/${lang}/products/${categorySlug}` : `/${lang}/products`

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}${canonicalPath}`,
      languages: {
        'ka-GE': `/ka/products${categorySlug ? `/${categorySlug}` : ''}`,
        'en-US': `/en/products${categorySlug ? `/${categorySlug}` : ''}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${canonicalPath}`,
      siteName: 'I-TECHNO',
      locale: currentLang === 'ka' ? 'ka_GE' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
  }
}

// --- MAIN PAGE COMPONENT ---
export default async function Page({ params, searchParams }: PageProps) {
  const { lang, category: categoryArray } = await params
  const resolvedSearchParams = await searchParams
  const payload = await getPayload({ config: await config })

  const currentLang: SupportedLang = (lang === 'en' ? 'en' : 'ka') as SupportedLang
  const t: Dictionary = (dict as Record<SupportedLang, Dictionary>)[currentLang] || dict.ka

  const categorySlug =
    categoryArray && categoryArray.length > 0 ? categoryArray[categoryArray.length - 1] : null
  const parentSlug =
    categoryArray && categoryArray.length > 1 ? categoryArray[categoryArray.length - 2] : null

  const currentPage = resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1
  const validatedPage = !isNaN(currentPage) && currentPage > 0 ? currentPage : 1

  const { q, page: _page, ...filterParams } = resolvedSearchParams

  // ✅ cache-დან — DB-ზე არ მივდივართ navigation-ზე
  const allCategories = await getCachedCategories(currentLang)

  let activeCategoryId: string | number | null = null
  let activeCategoryFilters: { name: string }[] = []

  if (categorySlug) {
    const matchingCats = allCategories.filter((c) => c.slug === categorySlug)
    let foundCat: Category | undefined

    if (matchingCats.length === 1) {
      foundCat = matchingCats[0]
    } else if (matchingCats.length > 1 && parentSlug) {
      const parentCat = allCategories.find((c) => c.slug === parentSlug)
      foundCat = matchingCats.find((c) => {
        const pId =
          typeof c.parent === 'object' && c.parent !== null && 'id' in c.parent
            ? (c.parent as { id: string | number }).id
            : c.parent
        return String(pId) === String(parentCat?.id)
      })
      if (!foundCat) foundCat = matchingCats[0]
    } else {
      foundCat = matchingCats[0]
    }

    if (foundCat) {
      activeCategoryId = foundCat.id
      activeCategoryFilters = (foundCat.assignedFilters as { name: string }[]) || []
    }
  }

  const andFilters: Where[] = []

  if (activeCategoryId) {
    const getAllChildIds = (parentId: string | number): (string | number)[] => {
      const children = allCategories.filter((c) => {
        const pId =
          typeof c.parent === 'object' && c.parent !== null && 'id' in c.parent
            ? (c.parent as { id: string | number }).id
            : c.parent
        return String(pId) === String(parentId)
      })
      return children.reduce<(string | number)[]>(
        (acc, child) => [...acc, child.id, ...getAllChildIds(child.id)],
        [],
      )
    }

    const allRelatedIds = [activeCategoryId, ...getAllChildIds(activeCategoryId)]
    andFilters.push({
      or: [{ category: { in: allRelatedIds } }, { additionalCategories: { in: allRelatedIds } }],
    })
  }

  if (q) {
    andFilters.push({
      or: [{ title: { contains: q } }, { slug: { contains: q } }],
    })
  }

  Object.entries(filterParams).forEach(([_groupName, value]) => {
    if (value) {
      andFilters.push({ 'filter_values.value_rel.value': { equals: value } })
    }
  })

  const [productsRes, specs] = await Promise.all([
    payload.find({
      collection: 'products',
      where: andFilters.length > 0 ? { and: andFilters } : {},
      locale: currentLang,
      limit: 16,
      page: validatedPage,
      depth: 2,
      sort: '-createdAt',
    }),
    fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/products/unique-specs?lang=${currentLang}`,
      { next: { revalidate: 300 } },
    )
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({})),
  ])

  return (
    <main className="min-h-screen">
      <h1 className="sr-only">
        {categorySlug
          ? `${categorySlug} - I-TECHNO`
          : currentLang === 'ka'
            ? 'პროდუქტების კატალოგი'
            : 'Products Catalog'}
      </h1>

      <Products
        products={productsRes as PaginatedDocs<Product>}
        allCategories={allCategories.map((c) => ({
          ...c,
          displayName: c.name || 'No Name',
        }))}
        lang={currentLang}
        t={t}
        specs={specs as UniqueSpecs}
        activeCategorySlug={categorySlug}
        categoryFilters={activeCategoryFilters.map((f) => f.name)}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: (productsRes as PaginatedDocs<Product>).docs.map(
              (p: Product, index: number) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `${process.env.NEXT_PUBLIC_SERVER_URL}/${currentLang}/products/${p.slug}`,
                name: p.title,
              }),
            ),
          }),
        }}
      />
    </main>
  )
}
