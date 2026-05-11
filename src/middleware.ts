import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['ka', 'en']

const VALID_CATEGORIES = [
  'video-surveillance',
  'storage-devices',
  'network-devices',
  'smart-home',
  'security-alarm',
  'network-equipment',
  'ezviz-smart-home',
  'tvdisplays',
  'fire-alarm-systems',
  'cables',
  'ajax',
  'access-control-systems',
  // ჩაწერე აქ შენი დანარჩენი კატეგორიების სლაგები
]

const BLOCKED_EXTENSIONS = ['.php', '.asp', '.aspx', '.jsp', '.env', '.git']
const BLOCKED_PATHS = ['wp-admin', 'admin-panel', 'cgi-bin', 'etc/passwd', '.well-known']

export function middleware(request: NextRequest) {
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

  // --- ახალი ლოგიკა: /products/ -> /product-details/ REDIRECT ---
  const segments = pathname.split('/').filter(Boolean)
  // segments მაგალითი: ['en', 'products', 'doorphone-slug']

  if (segments.length === 3 && segments[1] === 'products') {
    const [lang, , slug] = segments

    // თუ სლაგო არ არის კატეგორიების სიაში, ესე იგი პროდუქტია
    if (!VALID_CATEGORIES.includes(slug)) {
      return NextResponse.redirect(
        new URL(`/${lang}/product-details/${slug}`, request.url),
        301, // აუცილებლად 301, რომ Google-მა ლინკი ჩაანაცვლოს
      )
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
