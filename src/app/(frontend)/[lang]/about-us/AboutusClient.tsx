'use client'

import React from 'react'
import Image from 'next/image'
import { Shield, Network, Cpu, Flame, DoorOpen, CheckCircle } from 'lucide-react'
import ServicesGrid from '@/components/ServicesGrid'

// ტიპი Payload-ის Media ობიექტისთვის
type Media = {
  url: string
  alt?: string
}

// Payload-ის მონაცემების ტიპი
type AboutUsData = {
  hero: {
    titleBlue: string
    titleBlack: string
    story: string
    image: string | Media
  }
  priority: {
    title: string
    sub: string
    analysis: string
  }
  directions: {
    title: string
    items: Array<{
      title: string
      image: string | Media
    }>
  }
  support: {
    badge: string
    title: string
    text1: string
    text2: string
  }
  whyUs: {
    badge: string
    title: string
    items: Array<{
      title: string
      text: string
    }>
  }
}

export default function AboutClient({ t }: { lang: string; t: AboutUsData }) {
  const data = t
  const icons = [Shield, Cpu, Flame, DoorOpen, Network, CheckCircle]

  const getImageUrl = (media: string | Media) => (typeof media === 'object' ? media.url : media)

  return (
    <div className="bg-white text-[#0F172A] antialiased">
      {/* HERO SECTION */}
      <section className="max-w-[1440px] mx-auto pt-12 sm:pb-24 px-6 grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <h1 className="text-[48px] text-[#1976BA] md:text-[72px] font-bold leading-[1.05] uppercase tracking-tight">
            {data.hero.titleBlue}
            <br />
            <span className="text-[#000000]">{data.hero.titleBlack}</span>
          </h1>

          <p className="mt-8 text-[18px] text-slate-500 leading-relaxed max-w-xl font-firaGo400">
            {data.hero.story}
          </p>
        </div>

        <div className="relative h-[520px] rounded-[30px] overflow-hidden shadow-2xl">
          <Image
            src={getImageUrl(data.hero.image)}
            alt={data.hero.titleBlue}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      </section>

      {/* PRIORITY SECTION */}
      <section className="bg-white  py-20 px-6 border-y border-slate-200">
        <div className="grid lg:grid-cols-12 gap-y-16 lg:gap-x-0 max-w-[1440px] mx-auto">
          <div className="lg:col-span-7 pr-0 lg:pr-20">
            <h2 className="text-[36px] md:text-[54px] font-bold leading-[1.05] tracking-tight text-[#0F172A]">
              {data.priority.title}
            </h2>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between pt-4 ">
            <p className="text-[18px] md:text-[21px] leading-relaxed mb-4 text-slate-600 font-light">
              {data.priority.sub}
            </p>

            <div className="mt-16 lg:mt-0 p-10 bg-[#F8FAFC] rounded-2xl border border-slate-100">
              <p className="text-[16px] md:text-[18px] leading-relaxed text-[#0F172A]">
                {data.priority.analysis}
              </p>
              <div className="mt-6 flex gap-1">
                <div className="h-1 w-8 bg-[#1976BA]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesGrid data={data} icons={icons} getImageUrl={getImageUrl} />

      <section className="bg-white py-10 px-6">
        <div className="max-w-[1440px] mx-auto">
          <header>
            <span className="text-[14px] md:text-[16px] text-[#1976BA] font-firaGo600">
              {data.support.badge}
            </span>
            <h2 className="mt-6 text-[34px] md:text-[44px] font-bold leading-tight text-[#0F172A]">
              {data.support.title}
            </h2>
          </header>
          <div className="mt-8 space-y-4 text-[18px] leading-[1.9] text-slate-600 font-firaGo400 max-w-4xl">
            <p>{data.support.text1}</p>
            <p>{data.support.text2}</p>
          </div>
        </div>
      </section>

      {/* WHY US SECTION */}
      <section className="bg-[#F8FAFC] py-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-14 items-start">
            <div className="lg:col-span-4">
              <span className="text-[16px] text-[#1976BA] font-firaGo600">{data.whyUs.badge}</span>
              <h2 className="mt-6 text-[34px] md:text-[44px] font-bold leading-tight text-[#0F172A]">
                {data.whyUs.title}
              </h2>
            </div>

            <div className="lg:col-span-8">
              <dl className="divide-y divide-slate-200 border-t border-slate-200">
                {data.whyUs.items.map((item, i) => (
                  <div key={i} className="grid md:grid-cols-12 gap-4 md:gap-8 py-7">
                    <dt className="md:col-span-4 text-[18px] font-bold text-[#0F172A]">
                      {item.title}
                    </dt>
                    <dd className="md:col-span-8 text-[17px] leading-[1.8] text-slate-600 font-firaGo400">
                      {item.text}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
