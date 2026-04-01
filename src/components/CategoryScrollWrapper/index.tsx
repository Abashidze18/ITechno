'use client'

import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const CategoryScrollWrapper = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo =
        direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative group/wrapper">
      <button
        onClick={() => scroll('left')}
        aria-label="previous"
        className="absolute left-[-15px] top-1/2 -translate-y-1/2 z-20 bg-white shadow-xl border border-gray-100 rounded-full p-2 opacity-0 group-hover/wrapper:opacity-100 transition-all hover:bg-gray-50 hidden md:block"
      >
        <ChevronLeft aria-hidden="true" className="w-5 h-5 text-gray-600" />
      </button>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar">
        {children}
      </div>

      <button
        onClick={() => scroll('right')}
        aria-label="next"
        className="absolute right-[-15px] top-1/2 -translate-y-1/2 z-20 bg-white shadow-xl border border-gray-100 rounded-full p-2 opacity-0 group-hover/wrapper:opacity-100 transition-all hover:bg-gray-50 hidden md:block"
      >
        <ChevronRight aria-hidden="true" className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  )
}
