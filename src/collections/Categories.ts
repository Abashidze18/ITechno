import type { CollectionConfig } from 'payload'
import slugify from 'slugify'
import { revalidateTag } from 'next/cache'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'parent', 'updatedAt'],
    group: 'Shop Content',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      () => {
        revalidateTag('categories')
      },
    ],
    afterDelete: [
      () => {
        revalidateTag('categories')
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data, operation }) => {
            if (!data) return undefined

            if (operation === 'create') {
              const nameToConvert = data?.name?.en || data?.name?.ka || data?.name
              if (nameToConvert) {
                return slugify(nameToConvert, { lower: true, strict: true })
              }
            }

            // update-ზე არსებული slug უცვლელად დარჩეს
            return data?.slug
          },
        ],
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
      maxDepth: 1,
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'assignedFilters',
      type: 'relationship',
      relationTo: 'filters',
      hasMany: true,
      maxDepth: 0,
      label: 'მიბმული ფილტრები',
      admin: {
        description:
          'აირჩიეთ ფილტრის ჯგუფები (მაგ: რეზოლუცია), რომლებიც ამ კატეგორიაში უნდა გამოჩნდეს',
      },
    },
  ],
}
