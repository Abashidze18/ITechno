import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['ka', 'en']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. სწრაფი შემოწმება სტატიკურ ფაილებზე (თუ matcher-მა მაინც გამოატარა)
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next()
  }

  // 2. მთავარი გვერდის რეზერვაცია (Redirect / -> /ka)
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/ka', request.url))
  }

  // 3. ენის შემოწმება
  const hasLocale = locales.some((loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`)

  if (hasLocale) return NextResponse.next()

  // 4. თუ ენა არ აქვს, დავამატოთ /ka
  return NextResponse.redirect(new URL(`/ka${pathname}`, request.url))
}

export const config = {
  // უფრო მკაცრი ფილტრი, რომ Middleware ნაკლებჯერ გაიღვიძოს
  matcher: [
    /*
     * გამოვრიცხავთ:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin
     * - ყველა ფაილი გაფართოებით (მაგ: .svg, .jpg, .png და ა.შ.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|admin|.*\\..*).*)',
  ],
}
