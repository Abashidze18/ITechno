'use client'

import { Phone, Mail, Facebook, MapPin } from 'lucide-react'

type ContactInfoData = {
  infoTitle: string
  phone: string
  email: string
  social: string
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
          {/* tel: ბმული — Google-ი click-to-call-ად ცნობს */}
          <a
            href={`tel:${t.phone.replace(/\s/g, '')}`}
            className="flex items-center gap-4 hover:opacity-80 transition-opacity"
            itemProp="telephone"
          >
            <Phone className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
            <span>{t.phone}</span>
          </a>

          {/* mailto: ბმული */}
          <a
            href={`mailto:${t.email}`}
            className="flex items-center gap-4 hover:opacity-80 transition-opacity"
            itemProp="email"
          >
            <Mail className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
            <span>{t.email}</span>
          </a>

          <div className="flex items-center gap-4">
            <Facebook className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
            <span itemProp="sameAs">{t.social}</span>
          </div>

          <div className="flex items-center gap-4 mt-8" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
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
