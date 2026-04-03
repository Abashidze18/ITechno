import { withPayload } from '@payloadcms/next/withPayload'

const isProduction = process.env.NEXT_PUBLIC_INDEXABLE === 'true'

const nextConfig = {
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },

  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: isProduction ? 'index, follow, max-image-preview:large' : 'noindex, nofollow',
          },
          { key: 'X-Publisher', value: 'I-TECHNO' },
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=59',
          },
        ],
      },
    ]
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'flagcdn.com' },
      { protocol: 'https', hostname: 'www.ezviz.com' },
      { protocol: 'https', hostname: 'ajax.systems' },
      { protocol: 'https', hostname: 'hdsurveillance.com.au' },
      { protocol: 'https', hostname: 'www.westerndigital.com' },
      { protocol: 'https', hostname: 'img.icons8.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'www.hikvision.com' },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'seeklogo.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      { protocol: 'https', hostname: 'pub-98050be1a67d4bc4987cc1921342d259.r2.dev' },
    ],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
