import { getPayload } from 'payload'
import config from '@/payload.config'
import { Products } from '@/components/Products'
import dict from '@/lib/translations.json'
import { Where } from 'payload'
import { Metadata } from 'next'
import { PaginatedDocs } from 'payload'
import { Category, Product } from '@/payload-types'
import { getCachedCategories } from '@/lib/getCachedCategories'

type Dictionary = typeof dict.ka
type SupportedLang = 'ka' | 'en'
type UniqueSpecs = Record<string, string[]>

interface PageProps {
  params: Promise<{ lang: string; category?: string[] }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}

// კატეგორია რომელიც პირველი უნდა ჩაიტვირთოს "ყველა"-ში
const PRIORITY_CATEGORY_SLUG = 'video-surveillance' // შეცვალე შენი სლაგით

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

  let isRealCategory = true

  if (categorySlug) {
    try {
      const allCats = await getCachedCategories(currentLang)
      const cat = allCats.find((c) => c.slug === categorySlug)

      if (cat) {
        const catName = cat.name || categorySlug
        title = `${catName}`
        description =
          currentLang === 'ka'
            ? `იყიდეთ ${catName} საუკეთესო ფასად. გარანტია და ადგილზე მიტანის სერვისი მთელ საქართველოში.`
            : `Buy ${catName} at the best price. Warranty and delivery service throughout Georgia.`
      } else {
        // თუ სლაგო წერია, მაგრამ კატეგორიებში ვერ ვიპოვეთ, ესე იგი არასწორი URL-ია
        isRealCategory = false
      }
    } catch (e) {
      console.error('Metadata fetch error', e)
    }
  }

  // თუ კატეგორია არ არსებობს, ვთიშავთ ინდექსაციას ამ URL-ისთვის
  if (!isRealCategory) {
    return {
      title: 'Page Not Found',
      robots: {
        index: false,
        follow: true,
      },
    }
  }

  const canonicalPath = categorySlug ? `/${lang}/products/${categorySlug}` : `/${lang}/products`

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalPath,
      languages: {
        ka: `/ka/products${categorySlug ? `/${categorySlug}` : ''}`,
        en: `/en/products${categorySlug ? `/${categorySlug}` : ''}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: 'I-TECHNO',
      locale: currentLang === 'ka' ? 'ka_GE' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

// --- HELPER: ყველა შვილი კატეგორიის ID-ები ---
function getAllChildIds(parentId: string | number, allCategories: Category[]): (string | number)[] {
  const children = allCategories.filter((c) => {
    const pId =
      typeof c.parent === 'object' && c.parent !== null && 'id' in c.parent
        ? (c.parent as { id: string | number }).id
        : c.parent
    return String(pId) === String(parentId)
  })
  return children.reduce<(string | number)[]>(
    (acc, child) => [...acc, child.id, ...getAllChildIds(child.id, allCategories)],
    [],
  )
}

// --- MAIN PAGE COMPONENT ---

export const revalidate = 7200 // 2 საათი წამებში

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

  // 1. კატეგორიების წამოღება
  const allCategories = await getCachedCategories(currentLang)

  let activeCategoryId: string | number | null = null
  let categoryFilterNames: string[] = []

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

      const filterIds = (foundCat.assignedFilters as (string | number)[]) || []
      const filtersData = await payload.find({
        collection: 'filters',
        where: { id: { in: filterIds } },
        locale: currentLang,
        limit: 100,
      })
      categoryFilterNames = filtersData.docs.map((f) => f.name).filter(Boolean)
    }
  }

  // 2. საერთო ფილტრები (search, URL params)
  const andFilters: Where[] = []

  if (activeCategoryId) {
    const allRelatedIds = [activeCategoryId, ...getAllChildIds(activeCategoryId, allCategories)]
    andFilters.push({
      or: [{ category: { in: allRelatedIds } }, { additionalCategories: { in: allRelatedIds } }],
    })
  }

  if (q) {
    andFilters.push({
      or: [{ title: { contains: q } }, { slug: { contains: q } }],
    })
  }

  Object.entries(filterParams).forEach(([key, value]) => {
    if (value) {
      andFilters.push({ 'filter_values.value_rel.value': { equals: value } })
    }
  })

  // 3. Specs fetch (პარალელურად)
  const specsPromise = fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/products/unique-specs?lang=${currentLang}`,
    { next: { revalidate: 3600 } },
  )
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}))

  // 4. Products fetch — priority logic მხოლოდ "ყველა" + page 1-ზე
  const isPriorityMode = !activeCategoryId && validatedPage === 1

  let productsRes: PaginatedDocs<Product>

  if (isPriorityMode) {
    const priorityCat = allCategories.find((c) => c.slug === PRIORITY_CATEGORY_SLUG)

    if (priorityCat) {
      const priorityIds = [priorityCat.id, ...getAllChildIds(priorityCat.id, allCategories)]

      // პარალელური query — priority + specs ერთდროულად
      const [priorityRes, specs] = await Promise.all([
        payload.find({
          collection: 'products',
          where: {
            and: [
              {
                or: [
                  { category: { in: priorityIds } },
                  { additionalCategories: { in: priorityIds } },
                ],
              },
              ...andFilters, // search და სხვა ფილტრები
            ],
          },
          locale: currentLang,
          limit: 16,
          depth: 2,
          sort: '-createdAt',
        }),
        specsPromise,
      ])

      const priorityDocIds = priorityRes.docs.map((p) => p.id)
      const remaining = 16 - priorityDocIds.length

      // დანარჩენი პროდუქტები — priority-ს ID-ები გამოვრიცხეთ
      const restRes =
        remaining > 0
          ? await payload.find({
              collection: 'products',
              where: {
                and: [
                  // priority კატეგორიის პროდუქტები გამოვრიცხოთ ID-ით (სწრაფი, indexed)
                  { id: { not_in: priorityDocIds } },
                  ...andFilters,
                ],
              },
              locale: currentLang,
              limit: remaining,
              depth: 2,
              sort: '-createdAt',
            })
          : ({
              docs: [],
              totalDocs: 0,
              totalPages: 1,
              page: 1,
            } as unknown as PaginatedDocs<Product>)

      const mergedDocs = [...priorityRes.docs, ...restRes.docs]
      const totalDocs = priorityRes.totalDocs + (restRes.totalDocs ?? 0)

      productsRes = {
        ...priorityRes,
        docs: mergedDocs,
        totalDocs,
        totalPages: Math.ceil(totalDocs / 16),
        page: 1,
        hasNextPage: totalDocs > 16,
        nextPage: totalDocs > 16 ? 2 : null,
      } as PaginatedDocs<Product>

      return (
        <main className="min-h-screen">
          <h1 className="sr-only">
            {currentLang === 'ka' ? 'პროდუქტების კატალოგი' : 'Products Catalog'}
          </h1>
          <Products
            products={productsRes}
            allCategories={allCategories.map((c) => ({ ...c, displayName: c.name || 'No Name' }))}
            lang={currentLang}
            t={t}
            specs={specs as UniqueSpecs}
            activeCategorySlug={categorySlug}
            categoryFilters={categoryFilterNames}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                itemListElement: mergedDocs.map((p: Product, index: number) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  url: `${process.env.NEXT_PUBLIC_SERVER_URL}/${currentLang}/products/${p.slug}`,
                  name: p.title,
                })),
              }),
            }}
          />
        </main>
      )
    }
  }

  // 5. ჩვეულებრივი რეჟიმი (კატეგორია არჩეულია, ან page > 1, ან priority cat არ მოიძებნა)
  const [productsResult, specs] = await Promise.all([
    payload.find({
      collection: 'products',
      where: andFilters.length > 0 ? { and: andFilters } : {},
      locale: currentLang,
      limit: 16,
      page: validatedPage,
      depth: 1,
      sort: '-createdAt',
    }),
    specsPromise,
  ])

  productsRes = productsResult

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
        allCategories={allCategories.map((c) => ({ ...c, displayName: c.name || 'No Name' }))}
        lang={currentLang}
        t={t}
        specs={specs as UniqueSpecs}
        activeCategorySlug={categorySlug}
        categoryFilters={categoryFilterNames}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: productsRes.docs.map((p: Product, index: number) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `${process.env.NEXT_PUBLIC_SERVER_URL}/${currentLang}/products/${p.slug}`,
              name: p.title,
            })),
          }),
        }}
      />
    </main>
  )
}
