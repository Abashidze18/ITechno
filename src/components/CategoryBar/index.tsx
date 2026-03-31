import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Category } from '@/payload-types'
import { CategoryScrollWrapper } from '../CategoryScrollWrapper'
import MenuIcon from '@/assets/icons/menu.svg'

type MediaObj = { url: string; alt?: string }

type CategoryBarItem = {
  id?: string
  category: Category
  backgroundImage: string | MediaObj
  icon?: string | MediaObj | null
}

type CategoryBarData = {
  allShopLabel: string
  items: CategoryBarItem[]
}

const getUrl = (media: string | MediaObj | null | undefined): string | null => {
  if (!media) return null
  return typeof media === 'object' ? media.url : media
}

export const CategoryBar = async ({ lang = 'ka' }: { lang?: string }) => {
  const payload = await getPayload({ config: await config })

  const data = await payload.find({
    collection: 'category-bar' as any,
    locale: lang as 'ka' | 'en',
    limit: 1,
    depth: 2,
  })

  const barData = data.docs[0] as unknown as CategoryBarData | undefined

  if (!barData?.items?.length) return null

  return (
    <div className="max-w-[1440px] container mx-auto py-8">
      <CategoryScrollWrapper>
        <Link
          href={`/${lang}/products`}
          className="group flex-shrink-0 w-36 h-24 md:w-40 md:h-28 bg-[#1976BA] rounded-2xl flex flex-col items-center justify-center text-white gap-2 transition-all shadow-md overflow-hidden"
        >
          <div className="relative w-7 h-7 transition-transform duration-500 group-hover:scale-125">
            <Image src={MenuIcon} alt="menu" fill className="invert brightness-0" unoptimized />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-tighter">
            {barData.allShopLabel || (lang === 'ka' ? 'ყველა' : 'All Shop')}
          </span>
        </Link>

        {barData.items.map((item, i) => {
          const cat = item.category
          const bgUrl = getUrl(item.backgroundImage)
          const iconUrl = getUrl(item.icon)

          if (!bgUrl) return null

          return (
            <Link
              key={item.id ?? i}
              href={`/${lang}/products/${cat.slug}`}
              className="group relative flex-shrink-0 w-36 h-24 md:w-40 md:h-28 rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md"
            >
              <Image
                src={bgUrl}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                unoptimized
              />

              <div className="absolute inset-0 bg-black/50 transition-opacity duration-500 group-hover:bg-black/20" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2 text-center gap-1.5">
                {iconUrl && (
                  <div className="relative w-7 h-7 md:w-8 md:h-8 transition-transform duration-500 group-hover:scale-110">
                    <Image
                      src={iconUrl}
                      alt="icon"
                      fill
                      className="object-contain invert brightness-0"
                      unoptimized
                    />
                  </div>
                )}
                <span className="text-[10px] md:text-[11px] font-bold leading-tight uppercase tracking-tight drop-shadow-xl">
                  {cat.name}
                </span>
              </div>
            </Link>
          )
        })}
      </CategoryScrollWrapper>
    </div>
  )
}
