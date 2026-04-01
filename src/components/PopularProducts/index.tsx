'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import { ProductCard } from '../ProductCard'
import { Product } from '@/payload-types'

import 'swiper/css'
import 'swiper/css/navigation'

interface PopularProductsProps {
  products: Product[]
  lang: string
  title: string
}

export const PopularProducts = ({ products, lang, title }: PopularProductsProps) => {
  const currentLang = (lang === 'en' ? 'en' : 'ka') as 'ka' | 'en'

  return (
    <section className="px-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">{title}</h2>
            <div className="h-1 w-20 bg-[#1976BA] rounded-full"></div>
          </div>

          <div className="flex gap-2">
            <button
              aria-label="previous"
              className="swiper-prev-btn p-3 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-[#1976BA] hover:text-white transition-all text-gray-400"
            >
              <ChevronLeftIcon aria-hidden="true" />
            </button>
            <button
              aria-label="next"
              className="swiper-next-btn p-3 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-[#1976BA] hover:text-white transition-all text-gray-400"
            >
              <ChevronRightIcon aria-hidden="true" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{
            prevEl: '.swiper-prev-btn',
            nextEl: '.swiper-next-btn',
          }}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="popular-products-swiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="pb-4">
              {/* აქაც გადავაწოდოთ currentLang */}
              <ProductCard product={product} lang={currentLang} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

const ChevronLeftIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
)
const ChevronRightIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
)
