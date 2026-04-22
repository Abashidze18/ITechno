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

      <button
        className="p-6 rounded-full font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 animate-glow"
        style={{
          backgroundColor: '#1976BA',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0081D7')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1976BA')}
      >
        <Link href="tel:+995595126054">
          <Phone className="w-5 h-5" aria-hidden="true" />
        </Link>
      </button>
    </div>
  )
}

export default ContactButton
