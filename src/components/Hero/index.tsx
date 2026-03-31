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
      <div className="relative h-[400px] md:h-[480px] rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl">
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

            <div className="absolute inset-0 flex flex-col mt-10 sm:mt-0 sm:justify-center px-4 sm:px-8 md:px-14 max-w-4xl">
              <h1 className="text-[22px] sm:text-3xl md:text-5xl font-semibold text-white mb-4 sm:mb-6 leading-[1.1] uppercase tracking-tighter drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-gray-200 text-sm md:text-base mb-4 leading-relaxed max-w-2xl font-medium opacity-90">
                {slide.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href={slide.link1}
                  className="bg-[#1976BA] hover:bg-[#1976BA] transition-all px-6 text-white text-xs sm:text-sm h-[40px] sm:h-[50px] flex items-center justify-center rounded-lg font-bold shadow-xl hover:shadow-[#1976BA]/20 active:scale-95"
                >
                  {t?.buttonAllProducts}
                </Link>
                <Link
                  href={slide.link2}
                  className="bg-white backdrop-blur-md px-6 text-[#1976BA] hover:bg-white/80 text-xs sm:text-sm h-[40px] sm:h-[50px] flex items-center justify-center border border-white/30 rounded-lg font-bold transition-all active:scale-95"
                >
                  {t?.buttonOurServices}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {slides.length > 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current ? 'w-12 h-2 bg-[#1976BA]' : 'w-2 h-2 bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
