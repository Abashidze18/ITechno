'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductGalleryProps {
  mainImage: string
  images: string[]
  title: string
}

export default function ProductGallery({ mainImage, images, title }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(mainImage)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  const allImages = Array.from(new Set([mainImage, ...images])).filter(Boolean)

  useEffect(() => {
    setMounted(true)
    setActiveImage(mainImage)
  }, [mainImage])

  const openLightbox = (url: string) => {
    const index = allImages.indexOf(url)
    setCurrentIndex(index !== -1 ? index : 0)
    setIsLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    document.body.style.overflow = 'unset'
  }

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length)
  }, [allImages.length])

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }, [allImages.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, nextImage, prevImage])

  // Lightbox portal — renders directly in <body>, outside all parent containers
  const lightbox =
    mounted && isLightboxOpen
      ? createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white z-10 p-2 bg-white/10 rounded-full transition-colors"
            >
              <X size={32} />
            </button>

            {/* Prev */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-4 lg:left-8 text-white/50 hover:text-white transition-all p-3 hover:bg-white/10 rounded-full"
              >
                <ChevronLeft size={48} />
              </button>
            )}

            {/* Next */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-4 lg:right-8 text-white/50 hover:text-white transition-all p-3 hover:bg-white/10 rounded-full"
              >
                <ChevronRight size={48} />
              </button>
            )}

            {/* Image */}
            <div className="relative w-[90vw] h-[80vh]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={allImages[currentIndex]}
                alt={title}
                fill
                className="object-contain select-none"
                quality={100}
                unoptimized
              />
            </div>

            {/* Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-10 text-white/60 font-medium tracking-widest text-sm">
                {currentIndex + 1} / {allImages.length}
              </div>
            )}
          </div>,
          document.body,
        )
      : null

  return (
    <div className="flex flex-col gap-6 sticky top-24">
      {/* Main image */}
      <div className="bg-white border border-gray-100 rounded-3xl p-4 lg:p-8 shadow-sm">
        <div className="relative aspect-square w-full overflow-hidden">
          {activeImage ? (
            <Image
              src={activeImage}
              alt={title}
              fill
              priority
              className="object-contain hover:scale-105 transition-transform duration-500 cursor-zoom-in"
              onClick={() => openLightbox(activeImage)}
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 text-gray-300">
              სურათი არ არის
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3 lg:gap-4">
          {allImages.map((url, index) => (
            <div
              key={index}
              onClick={() => setActiveImage(url)}
              className={`relative aspect-square rounded-2xl border-2 overflow-hidden bg-white cursor-pointer transition-all p-1 lg:p-2 group ${
                activeImage === url
                  ? 'border-[#1976BA] shadow-md'
                  : 'border-gray-100 hover:border-blue-300'
              }`}
            >
              <Image
                src={url}
                alt={`${title} - ${index + 1}`}
                fill
                className="object-contain p-1 group-hover:scale-110 transition-transform"
                unoptimized
              />
            </div>
          ))}
        </div>
      )}

      {lightbox}
    </div>
  )
}
