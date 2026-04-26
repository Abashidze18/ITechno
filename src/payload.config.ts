import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Categories } from './collections/Categories'
import { Brands } from './collections/Brands'
import { Filters } from './collections/FilterGroups'
import { FilterOptions } from './collections/FilterOptions'
import { AboutUs } from './collections/AboutUs'
import { Services } from './collections/Services'
import { ContactInfo } from './collections/ContactInfo'
import { ContactPage } from './collections/ContactPage'
import { HeroSlider } from './collections/HeroSlider'
import { CategoryBar } from './collections/CategoryBarCollection'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [
    Users,
    Media,
    Filters,
    FilterOptions,
    Products,
    Categories,
    HeroSlider,
    CategoryBar,
    Brands,
    AboutUs,
    Services,
    ContactInfo,
    ContactPage,
  ],

  localization: {
    locales: [
      { label: 'Georgian', code: 'ka' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'ka',
    fallback: true,
  },

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
  sharp,

  // მთავარი ნაწილი: Cloud Storage პლაგინი
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: '',
          generateFileURL: ({ filename }: { filename: string }) => {
            return `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${filename}`
          },
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: 'auto',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
})
