'use client'

import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Globe,
} from 'lucide-react'

const IconMap = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  globe: Globe,
}

type ContactInfoData = {
  infoTitle: string
  phone: string
  email: string
  socials: {
    platformName: string
    icon: keyof typeof IconMap
    url: string
  }[]
  address: string
  mapEmbedUrl: string
}

const ContactInfo = ({ t }: { t: ContactInfoData }) => {
  return (
    <address
      className="not-italic bg-gradient-to-br from-[#1976BA] to-[#71C3FF] text-white p-8 rounded-[30px] shadow-lg h-full flex flex-col justify-between min-h-[500px]"
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      <div>
        <h3 className="text-2xl md:text-3xl mb-8">{t.infoTitle}</h3>

        <div className="space-y-6 font-firaGo400">
          <a
            href={`tel:${t.phone?.replace(/\s/g, '')}`}
            className="flex items-center gap-4 hover:opacity-80 transition-opacity"
            itemProp="telephone"
          >
            <Phone className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
            <span>{t.phone}</span>
          </a>

          <a
            href={`mailto:${t.email}`}
            className="flex items-center gap-4 hover:opacity-80 transition-opacity"
            itemProp="email"
          >
            <Mail className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
            <span>{t.email}</span>
          </a>

          {/* სოციალური ქსელების რენდერი */}
          {t.socials && t.socials.length > 0
            ? t.socials.map((social, index) => {
                const IconComponent = IconMap[social.icon] || Globe
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                  >
                    <IconComponent className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
                    <span>{social.platformName}</span>
                  </a>
                )
              })
            : /* ეს მხოლოდ დებაგისთვის გამოჩნდება ეკრანზე, თუ მასივი ცარიელია */
              process.env.NODE_ENV === 'development' && (
                <p className="text-xs text-red-200">Socials array is empty or missing.</p>
              )}

          <div
            className="flex items-center gap-4 mt-8"
            itemProp="address"
            itemScope
            itemType="https://schema.org/PostalAddress"
          >
            <MapPin className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
            <span itemProp="streetAddress">{t.address}</span>
          </div>
        </div>
      </div>

      <div className="w-full h-56 mt-8 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 shadow-xl">
        <iframe
          src={t.mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="I-TECHNO location map"
        />
      </div>
    </address>
  )
}

export default ContactInfo
