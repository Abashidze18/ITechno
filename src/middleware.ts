import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['ka', 'en']

// საეჭვო გაფართოებები და გზები, რომლებსაც ბოტები ხშირად იყენებენ
const BLOCKED_EXTENSIONS = ['.php', '.asp', '.aspx', '.jsp', '.env', '.git']
const BLOCKED_PATHS = ['wp-admin', 'admin-panel', 'cgi-bin', 'etc/passwd', '.well-known']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameLower = pathname.toLowerCase()

  // 1. უსაფრთხოების და რესურსების ფილტრი
  // თუ ბოტი ითხოვს საეჭვო ფაილს, ვაბრუნებთ ცარიელ 404-ს Next.js-ის რენდერინგის გარეშე
  const isSuspicious =
    BLOCKED_EXTENSIONS.some((ext) => pathnameLower.endsWith(ext)) ||
    BLOCKED_PATHS.some((path) => pathnameLower.includes(path))

  if (isSuspicious) {
    return new NextResponse(null, { status: 404 })
  }

  // 2. სტატიკური ფაილების და სპეციალური როუტების გატარება
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next()
  }

  // 3. მთავარი გვერდის რედირექტი (/ -> /ka)
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/ka', request.url))
  }

  // 4. ენის შემოწმება
  const hasLocale = locales.some((loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`)

  if (hasLocale) return NextResponse.next()

  // 5. ენის მიბმა (Fallback)
  // მხოლოდ იმ შემთხვევაში, თუ ეს არ არის "ფაილი" (წერტილის შემოწმება უკვე გვაქვს ზემოთ)
  return NextResponse.redirect(new URL(`/ka${pathname}`, request.url))
}

export const config = {
  matcher: [
    /*
     * მატჩერი გამორიცხავს სტანდარტულ ფაილებს და API-ს,
     * რომ Middleware ზედმეტად ხშირად არ "გაიღვიძოს".
     */
    '/((?!api|_next/static|_next/image|favicon.ico|admin|.*\\..*).*)',
  ],
}
