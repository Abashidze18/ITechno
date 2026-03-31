import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, LucideIcon } from 'lucide-react'

interface Media {
  url: string
  alt?: string
}

interface ServiceItem {
  title: string
  image: string | Media
  link?: string
}

interface ServicesGridProps {
  data: {
    directions: {
      title: string
      items: ServiceItem[]
    }
  }
  icons: LucideIcon[]
  getImageUrl: (media: string | Media) => string
}

const ServicesGrid = ({ data, icons, getImageUrl }: ServicesGridProps) => {
  return (
    <section className="max-w-[1440px] mx-auto py-20">
      <h2 className="text-center text-[36px] md:text-[42px] font-bold uppercase tracking-widest mb-20 text-[#0F172A]">
        {data.directions.title}
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {data.directions.items.map((item, i) => {
          const Icon = icons[i] || CheckCircle
          const cardClass =
            'relative p-12 rounded-[32px] overflow-hidden hover:shadow-2xl transition group min-h-[300px] flex items-end'

          const inner = (
            <>
              <Image
                src={getImageUrl(item.image)}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
              <div className="relative z-10 text-white">
                <Icon size={42} className="text-[#1976BA]" />
                <h3 className="mt-6 text-[22px] font-bold leading-snug">{item.title}</h3>
                <div className="mt-5 flex gap-2">
                  <div className="w-8 h-[2px] bg-[#1976BA]" />
                  <div className="w-4 h-[2px] bg-[#F49427]" />
                </div>
              </div>
            </>
          )

          return item.link ? (
            <Link key={i} href={item.link} className={cardClass}>
              {inner}
            </Link>
          ) : (
            <div key={i} className={cardClass}>
              {inner}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ServicesGrid
