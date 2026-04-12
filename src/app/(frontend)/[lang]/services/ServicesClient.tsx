'use client'

import React, { useState } from 'react'
import { Camera, ShieldAlert, Key, Cpu, Network, ChevronDown } from 'lucide-react'

type ServiceItem = {
  id?: string
  title: string
  description: string
  brands?: Array<{ name: string }>
  features?: Array<{ name: string }>
}

type ServicesDoc = {
  items: ServiceItem[]
  cta: {
    title: string
    text: string
  }
  header: {
    badge: string
    heading: string
    sub: string
  }
}

const ICONS = [
  <Camera key="cam" className="w-6 h-6 text-slate-900" />,
  <ShieldAlert key="shield" className="w-6 h-6 text-slate-900" />,
  <Key key="key" className="w-6 h-6 text-slate-900" />,
  <Cpu key="cpu" className="w-6 h-6 text-slate-900" />,
  <Network key="net" className="w-6 h-6 text-slate-900" />,
]

function ServicesJsonLd({ t }: { t: ServicesDoc }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t.header.badge,
    description: t.header.sub,
    numberOfItems: t.items.length,
    itemListElement: t.items.map((service, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Service',
        name: service.title,
        description: service.description,
        ...(service.brands?.length
          ? { brand: service.brands.map((b) => ({ '@type': 'Brand', name: b.name })) }
          : {}),
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// SEO: JSON-LD for FAQ
function FaqJsonLd({ t }: { t: ServicesDoc }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.items.map((service) => ({
      '@type': 'Question',
      name: service.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: service.description,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default function ServicesClient({ lang, t }: { lang: string; t: ServicesDoc }) {
  const [openId, setOpenId] = useState<number>(0)

  const toggleService = (idx: number) => {
    setOpenId((prev) => (prev === idx ? -1 : idx))
  }

  return (
    <>
      <ServicesJsonLd t={t} />
      <FaqJsonLd t={t} />

      <div className="min-h-screen text-slate-900">
        {/* SERVICES */}
        <section
          className="mx-auto max-w-[1440px] py-8 md:px-10 md:py-14"
          aria-label={t.header.badge}
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                {/* h1 — primary page heading for crawlers */}
                <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#111111] md:text-4xl">
                  {t.header.badge}
                </h1>
                <p className="text-sm text-slate-400">{t.header.heading}</p>
                <p className="mt-5 max-w-md text-base leading-8 text-slate-600">{t.header.sub}</p>
              </div>
            </div>

            <div className="lg:col-span-8">
              {/* ol signals an ordered list of services to crawlers */}
              <ol className="space-y-4 list-none">
                {t.items.map((service, idx) => {
                  const isOpen = openId === idx
                  const Icon = ICONS[idx] ?? ICONS[ICONS.length - 1]

                  return (
                    <li
                      key={service.id ?? idx}
                      className="overflow-hidden rounded-[20px] border border-slate-200 bg-white transition duration-300"
                      itemScope
                      itemType="https://schema.org/Service"
                    >
                      <button
                        onClick={() => toggleService(idx)}
                        className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left md:px-8 md:py-7"
                        aria-expanded={isOpen}
                        aria-controls={`service-panel-${idx}`}
                        id={`service-btn-${idx}`}
                      >
                        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-4 md:gap-5">
                          <div
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100"
                            aria-hidden="true"
                          >
                            {Icon}
                          </div>

                          <div>
                            {/* h2 for service titles — correct hierarchy under h1 */}
                            <h2
                              className="text-lg font-semibold text-[#1976BA] md:text-2xl"
                              itemProp="name"
                            >
                              {service.title}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                              {lang === 'ka'
                                ? 'დააჭირეთ დეტალების სანახავად'
                                : 'Click to view details'}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        >
                          <ChevronDown className="h-5 w-5 text-slate-700" />
                        </div>
                      </button>

                      <div
                        id={`service-panel-${idx}`}
                        role="region"
                        aria-labelledby={`service-btn-${idx}`}
                        className={`grid transition-all duration-300 ease-in-out ${
                          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="border-t border-slate-100 px-6 pb-6 pt-6 md:px-8 md:pb-8 md:pt-7">
                            <p
                              className="max-w-4xl text-base leading-8 text-slate-700 md:text-[17px]"
                              itemProp="description"
                            >
                              {service.description}
                            </p>

                            {service.brands && service.brands.length > 0 && (
                              <div className="mt-6">
                                <p className="mb-3 text-sm font-medium text-slate-400">
                                  {lang === 'ka' ? 'ბრენდები' : 'Brands'}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {service.brands.map((brand, i) => (
                                    <span
                                      key={i}
                                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
                                      itemProp="brand"
                                      itemScope
                                      itemType="https://schema.org/Brand"
                                    >
                                      <span itemProp="name">{brand.name}</span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {service.features && service.features.length > 0 && (
                              <div className="mt-6">
                                <p className="mb-3 text-sm font-medium text-slate-400">
                                  {lang === 'ka' ? 'ძირითადი შესაძლებლობები' : 'Key Features'}
                                </p>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                  {service.features.map((feature, i) => (
                                    <div
                                      key={i}
                                      className="rounded-xl border border-slate-200 bg-[#f8f8f6] px-4 py-4 text-sm font-medium text-slate-800"
                                    >
                                      {feature.name}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="mx-auto max-w-[1440px] py-16 md:px-10 md:py-24"
          aria-label={t.cta.title}
        >
          <div className="rounded-[32px] bg-[#1976BA] px-8 py-10 text-white md:px-12 md:py-14">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-5xl">
                  {t.cta.title}
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">{t.cta.text}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
