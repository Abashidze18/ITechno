'use client'

import React from 'react'
import dict from '@/lib/translations.json'

const ContactForm = ({ lang = 'ka' }: { lang: 'ka' | 'en' }) => {
  const t = dict[lang as keyof typeof dict].contact

  return (
    <form className="space-y-6 p-2 md:p-6" action="#" method="POST" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="firstName" className="text-[#f28f24] font-firaGo600">
            {t.firstName}
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder={t.placeholderName}
            autoComplete="given-name"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2980B9] outline-none font-firaGo400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="lastName" className="text-[#f28f24] font-firaGo600">
            {t.lastName}
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder={t.placeholderSurname}
            autoComplete="family-name"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2980B9] outline-none font-firaGo400"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-[#f28f24] font-firaGo600">
          {t.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2980B9] outline-none font-firaGo400"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className="text-[#f28f24] font-firaGo600">
          {t.phone}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+995 --- -- -- --"
          autoComplete="tel"
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2980B9] outline-none font-firaGo400"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-[#f28f24] font-firaGo600">
          {t.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder={t.placeholderMessage}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2980B9] outline-none font-firaGo400 resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#2980B9] text-white font-firaGo600 py-4 rounded-xl hover:bg-[#1F6391] transition duration-300 uppercase"
      >
        {t.sendBtn}
      </button>
    </form>
  )
}

export default ContactForm
