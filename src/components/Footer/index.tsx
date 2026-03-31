'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Phone, Mail, MapPin } from 'lucide-react'
import WhiteLogo from '@/assets/white_logo.svg'
import dict from '@/lib/translations.json'

interface FooterProps {
  lang: string
}

interface TranslationDict {
  footer: {
    securityAlarm: string
    fireAlarm: string
    storage: string
    videoSurveillance: string
    description: string
    products: string
    company: string
    contact: string
    address: string
    rights: string
    terms: string
  }

  nav: {
    home: string
    services: string
    products: string
    about: string
    contact: string
  }
}

const translations = dict as Record<string, TranslationDict>

export const Footer = ({ lang }: FooterProps) => {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const currentLang = (['ka', 'en'].includes(segments[1]) ? segments[1] : 'ka') as 'ka' | 'en'
  const t = translations[currentLang] || translations['ka']

  const getLocalizedHref = (path: string) => {
    return path === '/' ? `/${currentLang}` : `/${currentLang}${path}`
  }

  const productLinks = [
    { name: 'EZVIZ - Smart Home', slug: 'ezviz' },
    { name: 'AJAX', slug: 'ajax' },
    { name: t.footer.videoSurveillance, slug: 'video-surveillance' },
    { name: t.footer.storage, slug: 'storage' },
    { name: t.footer.fireAlarm, slug: 'fire-alarm' },
    { name: t.footer.securityAlarm, slug: 'security-alarm' },
  ]
  return (
    <footer className="bg-[#1976BA] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <Link href={`/${currentLang}`} className="inline-block p-2 rounded-lg">
              <Image
                src={WhiteLogo}
                alt="ITECHNO"
                width={150}
                height={50}
                className="object-contain"
                unoptimized
              />
            </Link>

            <p className="text-sm leading-relaxed text-blue-50 opacity-90">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 uppercase tracking-wider">{t.footer.products}</h4>

            <ul className="space-y-3 text-sm">
              {productLinks.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${currentLang}/products/${cat.slug}`}
                    className="hover:underline opacity-80 hover:opacity-100"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 uppercase tracking-wider">{t.footer.company}</h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href={getLocalizedHref('/services')}
                  className="hover:underline opacity-80 hover:opacity-100"
                >
                  {t.nav.services}
                </Link>
              </li>

              <li>
                <Link
                  href={getLocalizedHref('/about-us')}
                  className="hover:underline opacity-80 hover:opacity-100"
                >
                  {t.nav.about}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 uppercase tracking-wider">{t.footer.contact}</h4>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 text-blue-200" />

                <span className="opacity-90">{t.footer.address}</span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0 text-blue-200" />

                <span className="opacity-90">+995 595 12 60 54</span>
              </li>

              {/* <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0 text-blue-200" />

                <span className="opacity-90">+995 532 69 48 42</span>
              </li> */}

              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0 text-blue-200" />

                <span className="opacity-90">info@itechno.ge</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0 text-blue-200" />

                <span className="opacity-90">sales@itechno.ge</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium opacity-80">
          <div>
            © {new Date().getFullYear()} ITECHNO {t.footer.rights}
          </div>

          <div className="uppercase">Powered By GARGARI</div>

          <div className="flex gap-4">
            <Link href={getLocalizedHref('/terms')} className="hover:underline">
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
