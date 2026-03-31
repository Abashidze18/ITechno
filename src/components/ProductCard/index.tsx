'use client'

import Image from 'next/image'
import Link from 'next/link'
import dict from '@/lib/translations.json'
import { Product, Media } from '@/payload-types'

// თარგმანების სტრუქტურის ტიპიზაცია
interface TranslationDict {
  productCard: {
    inStock: string
    outStock: string // გასწორდა დასახელება JSON-ის შესაბამისად
    contactUs: string
    buttonTitle: string
  }
}

const translations = dict as Record<string, TranslationDict>

interface ProductCardProps {
  product: Product
  lang: string
}

export const ProductCard = ({ product, lang }: ProductCardProps) => {
  // სურათის URL-ის უსაფრთხოდ ამოღება
  const imageUrl =
    typeof product.mainImage === 'object' && product.mainImage !== null
      ? (product.mainImage as Media).url || ''
      : ''

  const price = product.price ?? 0
  const discountPrice = product.discountPrice ?? 0

  const hasDiscount = discountPrice > 0 && discountPrice < price
  const isPriceZero = price === 0

  // ენის ვალიდაცია
  const currentLang = lang === 'ka' || lang === 'en' ? lang : 'ka'
  const t = translations[currentLang] || translations['ka']

  return (
    <Link href={`/${lang}/product-details/${product.slug}`} className="group block h-full">
      <div className="bg-white border border-gray-200 rounded-[20px] overflow-hidden transition-all duration-300 hover:shadow-xl p-4 h-full flex flex-col relative">
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-[#1976BA] text-white text-xs px-3 py-1 rounded-md font-bold">
            {product.stock === 'in-stock' ? t.productCard.inStock : t.productCard.outStock}
          </span>
        </div>

        {hasDiscount && !isPriceZero && (
          <div className="absolute top-12 left-4 z-10 bg-[#EE3E33] text-white px-2 py-0.5 rounded-md text-xs font-bold">
            -{Math.round(((price - discountPrice) / price) * 100)}%
          </div>
        )}

        <div className="relative h-48 w-full mb-4 mt-6 flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
          ) : (
            <div className="text-gray-300 text-[10px]">სურათი არ არის</div>
          )}
        </div>

        <div className="flex flex-col flex-1">
          <p className="text-xs text-[#F28F24] font-mono mb-1 uppercase">
            CODE: {product.id?.toString().slice(-5)}
          </p>

          <h2 className="font-semibold text-gray-700 text-base line-clamp-2 leading-snug min-h-[34px]">
            {product.title}
          </h2>

          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-4">
              {isPriceZero ? (
                <span className="text-[13px] font-bold text-[#1976BA]">
                  {t.productCard.contactUs}
                </span>
              ) : hasDiscount ? (
                <>
                  <span className="text-[20px] font-bold text-[#1976BA]">
                    {discountPrice.toFixed(2)}₾
                  </span>
                  <span className="text-[13px] text-gray-400 line-through">
                    {price.toFixed(2)}₾
                  </span>
                </>
              ) : (
                <span className="text-[20px] font-bold text-[#1976BA]">{price.toFixed(2)}₾</span>
              )}
            </div>

            <div className="w-full bg-[#1976BA] text-white py-2.5 rounded-xl font-bold text-[13px] transition-colors group-hover:bg-[#1E5D91] text-center">
              <span>{t.productCard.buttonTitle}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
