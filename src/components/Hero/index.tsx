'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type MediaObject = {
  url: string
  alt?: string
}

type SlideItem = {
  id?: string
  title: string
  description: string
  link1: string
  link2: string
  image: string | MediaObject
}

type HeroSliderData = {
  buttonAllProducts: string
  buttonOurServices: string
  slides: SlideItem[]
}

interface HeroProps {
  lang: 'ka' | 'en'
  t: HeroSliderData | undefined | null
}

const getImageUrl = (image: string | MediaObject): string =>
  typeof image === 'object' ? image.url : image

export const Hero = ({ lang = 'ka', t }: HeroProps) => {
  const [current, setCurrent] = useState(0)
  const slides = t?.slides ?? []

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  if (!slides.length) return null

  return (
    <section className="max-w-[1440px] container mx-auto mb-12">
      <div className="relative h-[400px] md:h-[480px] rounded-[2rem] overflow-hidden bg-slate-900 shadow-2xl">
        {slides.map((slide, index) => (
          <div
            key={slide.id ?? index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Image
              src={getImageUrl(slide.image)}
              alt={slide.title}
              fill
              className="object-cover opacity-60 scale-105"
              priority={index === 0}
              unoptimized
            />

            {/* mt-12 მობილურისთვის - ოპტიმალური დაშორება ზემოდან */}
            <div className="absolute inset-0 flex flex-col mt-12 sm:mt-0 sm:justify-center px-6 sm:px-8 md:px-14 max-w-4xl">
              {/* ტექსტის ზომა 24px - უფრო სტაბილურია პატარა ეკრანზე */}
              <h1 className="text-[24px] sm:text-3xl md:text-5xl font-semibold text-white mb-4 sm:mb-6 leading-[1.2] uppercase tracking-tighter drop-shadow-lg">
                {slide.title}
              </h1>
              {/* აღწერა 15px-ზე - რომ არ გადაიტვირთოს, მაგრამ კარგად იკითხებოდეს */}
              <p className="text-gray-200 text-[15px] md:text-base mb-6 leading-relaxed max-w-2xl font-medium opacity-90">
                {slide.description}
              </p>

              <div className="flex flex-row gap-2 w-full sm:w-auto">
                <Link
                  href={slide.link1}
                  className="bg-[#1976BA] hover:bg-[#1976BA] transition-all px-2 sm:px-5 text-white text-[11px] sm:text-sm h-[44px] sm:h-[50px] flex-1 sm:flex-none flex items-center justify-center rounded-lg font-bold shadow-xl active:scale-95 whitespace-nowrap"
                >
                  {t?.buttonAllProducts}
                </Link>
                <Link
                  href={slide.link2}
                  className="bg-white backdrop-blur-md px-2 sm:px-5 text-[#1976BA] hover:bg-white/80 text-[11px] sm:text-sm h-[44px] sm:h-[50px] flex-1 sm:flex-none flex items-center justify-center border border-white/30 rounded-lg font-bold transition-all active:scale-95 whitespace-nowrap"
                >
                  {t?.buttonOurServices}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {slides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current ? 'w-10 h-2 bg-[#1976BA]' : 'w-2 h-2 bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}