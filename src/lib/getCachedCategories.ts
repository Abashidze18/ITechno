import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Category } from '@/payload-types'

export const getCachedCategories = unstable_cache(
  async (lang: 'ka' | 'en'): Promise<Category[]> => {
    const payload = await getPayload({ config: await config })
    const res = await payload.find({
      collection: 'categories',
      limit: 500,
      locale: lang,
      depth: 1,
    })
    return res.docs as Category[]
  },
  ['categories'],
  {
    revalidate: 300,
    tags: ['categories'],
  },
)
