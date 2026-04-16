import React from 'react'
import './globals.css'
import { firaGo400, firaGo600, lgvAnastasia } from '../fonts'
import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ka"
      className={`${firaGo400.variable} ${firaGo600.variable} ${lgvAnastasia.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        {children}

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-825214182"
          strategy="afterInteractive"
        />
        <Script id="google-ads-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-825214182');
          `}
        </Script>
      </body>
    </html>
  )
}
