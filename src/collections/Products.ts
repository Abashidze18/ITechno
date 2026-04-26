import { CollectionConfig, Where } from 'payload'
import { FilterOptionsProps } from 'payload'
import { Product } from '@/payload-types'

interface FilterGroupObj {
  id: string | number
  name?: string
}

interface FilterValueItem {
  filter_group?: FilterGroupObj | string | number | null
  value_rel?: { value?: string } | string | number | null
}

interface FilterValuesProduct extends Omit<Product, 'filter_values'> {
  filter_values?: FilterValueItem[]
}

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'price', 'isPopular', 'category'],
    group: 'Shop Content',
  },
  endpoints: [
    {
      path: '/unique-specs',
      method: 'get',
      handler: async (req) => {
        const { payload } = req

        if (!req.url) {
          return Response.json({ error: 'URL is missing' }, { status: 400 })
        }

        const { searchParams } = new URL(req.url)
        const lang = searchParams.get('lang') || 'ka'

        const result = await payload.find({
          collection: 'products',
          depth: 1,
          limit: 1700,
          pagination: false,
          locale: lang as 'ka' | 'en',
          select: {
            filter_values: true,
          },
        })

        const dynamicFilters: Record<string, string[]> = {}

        result.docs.forEach((prod) => {
          const p = prod as FilterValuesProduct
          p.filter_values?.forEach((item) => {
            const groupObj = item.filter_group
            const groupName =
              typeof groupObj === 'object' && groupObj !== null ? groupObj.name : null
            const valText =
              typeof item.value_rel === 'object' && item.value_rel !== null
                ? item.value_rel.value
                : null

            if (groupName && valText) {
              if (!dynamicFilters[groupName]) dynamicFilters[groupName] = []
              if (!dynamicFilters[groupName].includes(valText)) {
                dynamicFilters[groupName].push(valText)
              }
            }
          })
        })

        Object.keys(dynamicFilters).forEach((key) => {
          dynamicFilters[key].sort()
        })

        return Response.json(dynamicFilters, {
          headers: {
            'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=600',
          },
        })
      },
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'isPopular',
      type: 'checkbox',
      defaultValue: false,
      label: 'პოპულარული პროდუქტი',
      admin: {
        position: 'sidebar',
        description: 'მონიშნეთ, თუ გსურთ გამოჩნდეს მთავარ სლაიდერში',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (data?.title) {
              const titleToConvert =
                typeof data.title === 'object'
                  ? (data.title as Record<string, string>).en ||
                    (data.title as Record<string, string>).ka ||
                    ''
                  : String(data.title)

              // თუ en title გვაქვს — slug მისგან
              // თუ მხოლოდ ka — timestamp დავამატოთ უნიკალობისთვის
              const base = titleToConvert
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '')

              // თუ slug ცარიელია (მხოლოდ ქართული სიმბოლოები იყო)
              if (!base) {
                return `product-${Date.now()}`
              }

              return base
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'specifications',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'filter_values',
      type: 'array',
      label: 'ფილტრაციის პარამეტრები',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'filter_group',
          type: 'relationship',
          relationTo: 'filters',
          required: true,
          label: 'ფილტრის ჯგუფი',
        },
        {
          name: 'value_rel',
          type: 'relationship',
          relationTo: 'filter-options',
          required: true,
          label: 'აირჩიეთ მნიშვნელობა',
          filterOptions: ({ siblingData }: FilterOptionsProps): Where => {
            const currentGroup = (siblingData as { filter_group?: string | { id: string } })
              ?.filter_group

            if (currentGroup) {
              const groupId = typeof currentGroup === 'object' ? currentGroup.id : currentGroup
              return { group: { equals: groupId } }
            }

            return { id: { exists: false } }
          },
        },
      ],
    },
    {
      name: 'price',
      type: 'number',
      min: 0,
    },
    {
      name: 'discountPrice',
      type: 'number',
      min: 0,
    },
    {
      name: 'stock',
      type: 'select',
      defaultValue: 'in-stock',
      options: [
        { label: 'In Stock', value: 'in-stock' },
        { label: 'Out of Stock', value: 'out-of-stock' },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      index: true,
      maxDepth: 1,
    },
    {
      name: 'additionalCategories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'დამატებითი კატეგორიები',
      admin: {
        description: 'პროდუქტი ამ კატეგორიებშიც გამოჩნდება',
      },
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
    },
    {
      name: 'mainImage',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
