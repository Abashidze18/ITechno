'use client'

import React from 'react'
import { Phone } from 'lucide-react'
import Link from 'next/link'

const ContactButton: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <style jsx>{`
        @keyframes customGlow {
          0% {
            box-shadow: 0 0 2px #1976ba;
          }
          50% {
            box-shadow:
              0 0 8px #0081d7,
              0 0 10px #1976ba;
          }
          100% {
            box-shadow: 0 0 2px #1976ba;
          }
        }
        .animate-glow {
          animation: customGlow 2s infinite ease-in-out;
        }
      `}</style>

      <Link
        href="tel:+995595126054"
        aria-label="call us"
        className="w-14 h-14 rounded-full font-bold text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 animate-glow"
        style={{ backgroundColor: '#1976BA', minWidth: '44px', minHeight: '44px' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#0081D7')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#1976BA')}
      >
        <Phone className="w-5 h-5" aria-hidden="true" />
      </Link>
    </div>
  )
}

export default ContactButton
