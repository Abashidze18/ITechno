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

// ხატულები რიგის მიხედვით — თუ სერვისები დაემატა/შეიცვალა Admin-ში, ბოლოს CheckCircle იქნება
const ICONS = [
  // eslint-disable-next-line react/jsx-key
  <Camera className="w-6 h-6 text-slate-900" />,
  // eslint-disable-next-line react/jsx-key
  <ShieldAlert className="w-6 h-6 text-slate-900" />,
  // eslint-disable-next-line react/jsx-key
  <Key className="w-6 h-6 text-slate-900" />,
  // eslint-disable-next-line react/jsx-key
  <Cpu className="w-6 h-6 text-slate-900" />,
  // eslint-disable-next-line react/jsx-key
  <Network className="w-6 h-6 text-slate-900" />,
]

export default function ServicesClient({ t }: { lang: string; t: ServicesDoc }) {
  const [openId, setOpenId] = useState<number>(0)

  const toggleService = (idx: number) => {
    setOpenId((prev) => (prev === idx ? -1 : idx))
  }

  return (
    <div className="min-h-screen text-slate-900">
      {/* SERVICES */}
      <section className="mx-auto max-w-[1440px] py-8 md:px-10 md:py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#111111] md:text-4xl">
                {t.header.badge}
              </h2>
              <p className="text-sm text-slate-400">{t.header.heading}</p>
              <p className="mt-5 max-w-md text-base leading-8 text-slate-600">{t.header.sub}</p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="space-y-4">
              {t.items.map((service, idx) => {
                const isOpen = openId === idx
                const Icon = ICONS[idx] ?? ICONS[ICONS.length - 1]

                return (
                  <div
                    key={service.id ?? idx}
                    className="overflow-hidden rounded-[20px] border border-slate-200 bg-white transition duration-300"
                  >
                    <button
                      onClick={() => toggleService(idx)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left md:px-8 md:py-7"
                    >
                      <div className="flex flex-col xs:flex-row items-start xs:items-center gap-4 md:gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                          {Icon}
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-[#1976BA] md:text-2xl">
                            {service.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            დააჭირეთ დეტალების სანახავად
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      >
                        <ChevronDown className="h-5 w-5 text-slate-700" />
                      </div>
                    </button>

                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t border-slate-100 px-6 pb-6 pt-6 md:px-8 md:pb-8 md:pt-7">
                          <p className="max-w-4xl text-base leading-8 text-slate-700 md:text-[17px]">
                            {service.description}
                          </p>

                          {service.brands && service.brands.length > 0 && (
                            <div className="mt-6">
                              <p className="mb-3 text-sm font-medium text-slate-400">ბრენდები</p>
                              <div className="flex flex-wrap gap-2">
                                {service.brands.map((brand, i) => (
                                  <span
                                    key={i}
                                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
                                  >
                                    {brand.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {service.features && service.features.length > 0 && (
                            <div className="mt-6">
                              <p className="mb-3 text-sm font-medium text-slate-400">
                                ძირითადი შესაძლებლობები
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
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1440px] py-16 md:px-10 md:py-24">
        <div className="rounded-[32px] bg-[#1976BA] px-8 py-10 text-white md:px-12 md:py-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <h3 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-5xl">
                {t.cta.title}
              </h3>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">{t.cta.text}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
