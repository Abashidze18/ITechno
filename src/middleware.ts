import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['ka', 'en']
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://itechno.ge'

const BLOCKED_EXTENSIONS = ['.php', '.asp', '.aspx', '.jsp', '.env', '.git']
const BLOCKED_PATHS = ['wp-admin', 'admin-panel', 'cgi-bin', 'etc/passwd', '.well-known']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameLower = pathname.toLowerCase()

  // 1. უსაფრთხოების ფილტრი
  const isSuspicious =
    BLOCKED_EXTENSIONS.some((ext) => pathnameLower.endsWith(ext)) ||
    BLOCKED_PATHS.some((path) => pathnameLower.includes(path))

  if (isSuspicious) {
    return new NextResponse(null, { status: 404 })
  }

  // 2. სტატიკური ფაილების გატარება
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next()
  }

  // --- სრულიად დინამიური ლოგიკა: /products/ -> /product-details/ ---
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 3 && segments[1] === 'products') {
    const [lang, , slug] = segments

    try {
      // ვეკითხებით Payload-ის API-ს, არსებობს თუ არა პროდუქტი ამ სლაგით
      // ვიყენებთ `limit=1` და `select`, რომ პასუხი იყოს მომენტალური
      const response = await fetch(
        `${BASE_URL}/api/products?where[slug][equals]=${slug}&limit=1&select[slug]=true`,
        {
          next: { revalidate: 3600 }, // ბრაუზერის დონეზეც რომ დააქეშოს Next-მა
        },
      )

      if (response.ok) {
        const data = await response.json()

        // თუ პროდუქტებში იპოვა ასეთი სლაგო, ესე იგი ეგ ლინკი შეცდომაა და ვაკეთებთ რედირექტს!
        if (data.docs && data.docs.length > 0) {
          return NextResponse.redirect(
            new URL(`/${lang}/product-details/${slug}`, request.url),
            301,
          )
        }
      }
    } catch (error) {
      console.error('Middleware product check error:', error)
    }
  }
  // -----------------------------------------------------------

  // 3. მთავარი გვერდის რედირექტი
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/ka', request.url))
  }

  // 4. ენის შემოწმება
  const hasLocale = locales.some((loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`)

  if (hasLocale) return NextResponse.next()

  // 5. ენის მიბმა (Fallback)
  return NextResponse.redirect(new URL(`/ka${pathname}`, request.url))
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|admin|.*\\..*).*)'],
}
