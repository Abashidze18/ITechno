'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'

// ლოგოების იმპორტი
import Hikvision from '@/assets/Hikvision_logo.svg'
import Ezviz from '@/assets/Eviz_logo.svg'
import HiWatch from '@/assets/HiWatch_logo.svg'

export const BrandsSlider = () => {
  // შენი ლოკალური ლოგოები (რადგან assets-დან გინდა)
  const localBrands = [
    { id: '1', src: Hikvision.src || Hikvision, name: 'Hikvision' },
    { id: '2', src: Ezviz.src || Ezviz, name: 'Ezviz' },
    { id: '3', src: HiWatch.src || HiWatch, name: 'HiWatch' },
  ]

  // უსასრულო ეფექტისთვის
  const displayBrands = [...localBrands, ...localBrands, ...localBrands]

  return (
    <section className="py-12 bg-white border-y border-gray-100 overflow-hidden">
      <div className="max-w-full mx-auto px-6">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={80}
          slidesPerView={2}
          loop={true}
          speed={5000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 8 },
          }}
          className="brands-ticker"
        >
          {displayBrands.map((brand, idx) => (
            <SwiperSlide key={`${brand.id}-${idx}`} className="flex items-center justify-center">
              <div className="group cursor-pointer">
                <div
                  style={{
                    maskImage: `url(${brand.src})`,
                    WebkitMaskImage: `url(${brand.src})`,
                    maskRepeat: 'no-repeat',
                    maskSize: 'contain',
                    maskPosition: 'center',
                  }}
                  className="w-32 h-10 bg-gray-400 transition-colors duration-300 group-hover:bg-[#1976BA]"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .brands-ticker .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </section>
  )
}
