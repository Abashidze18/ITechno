'use client'

import React from 'react'
import AboutImage from '../../assets/images/about.png'
import CameraImage from '../../assets/images/camera.svg'
import Image from 'next/image'
import dict from '@/lib/translations.json'

const AboutGrid = ({ lang = 'ka' }: { lang: 'ka' | 'en' }) => {
  const t = dict[lang as keyof typeof dict].about

  return (
    <div className="max-w-[1440px] mx-auto pt-16 bg-white flex items-center justify-center font-firaGo600 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full auto-rows-auto">
        <div className="bg-[#0081D7] rounded-[30px] p-8 flex flex-col justify-center md:min-h-[250px]">
          <h1 className="text-white text-3xl sm:text-5xl font-lgv leading-tight uppercase tracking-wide flex gap-2 md:flex-col md:gap-0">
            <span>{t.title?.split(' ')[0]}</span>
            <span>{t.title?.split(' ')[1]}</span>
          </h1>
        </div>

        <div className="md:row-span-2 bg-[#F0F2F5] rounded-[30px] p-10 flex flex-col relative z-20">
          <div className="absolute -top-20 lg:-top-28 -right-20 lg:-right-52 w-[250px] lg:w-[400px] z-30 hidden md:block pointer-events-none">
            <Image
              src={CameraImage}
              alt="Security Camera"
              className="object-contain drop-shadow-2xl"
              priority
              unoptimized
            />
          </div>

          <h2 className="text-[#1976BA] text-3xl sm:text-5xl font-lgv lg:mb-8 uppercase">
            {t.reliability}
          </h2>
          <p className="text-gray-800 leading-relaxed text-lg mt-6 font-firaGo400">
            {t.description}
          </p>
        </div>

        <div className="bg-[#F0F2F5] rounded-[30px] p-8 flex items-center justify-start md:justify-center text-center md:min-h-[250px]">
          <h2 className="text-[#1976BA] text-2xl sm:text-5xl font-lgv uppercase leading-tight flex gap-3 md:flex-col md:gap-0">
            <span>{t.experienceYear}</span>
            <span>{t.experienceMarket}</span>
          </h2>
        </div>

        <div className="relative group overflow-hidden rounded-[30px] h-[300px] lg:h-full">
          <Image
            src={AboutImage}
            alt="Team"
            fill
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          <button className="absolute bottom-6 left-6 bg-white text-black px-6 py-2 rounded-xl flex items-center gap-2 font-firaGo400 hover:bg-gray-100 transition-colors z-10">
            {t.viewMore}
            <span className="text-sm">→</span>
          </button>
        </div>

        <div className="bg-[#F0F2F5] rounded-[30px] p-8 flex flex-col justify-center min-h-[250px]">
          <h3 className="text-[#1976BA] text-3xl md:text-4xl font-lgv mb-6 uppercase">
            {t.contactUs}
          </h3>
          <div className="space-y-3 text-lg font-firaGo600 text-gray-800">
            <p>+995 595 12 60 54</p>
            <p className="hover:text-[#0081D7] cursor-pointer inline-block">Instagram</p>
            <p className="hover:text-[#0081D7] cursor-pointer inline-block ml-4 lg:ml-0 lg:block">
              Facebook
            </p>
            <p>{t.address}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutGrid
