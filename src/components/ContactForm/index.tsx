'use client'

import React, { useState } from 'react'
import dict from '@/lib/translations.json'
import { sendContactEmail } from '@/app/actions/sendEmail'

const ContactForm = ({ lang = 'ka' }: { lang: 'ka' | 'en' }) => {
  const t = dict[lang as keyof typeof dict].contact
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')

    const formData = new FormData(e.currentTarget)
    const result = await sendContactEmail(formData)

    if (result.success) {
      setStatus('success')
      e.currentTarget.reset()
      setTimeout(() => setStatus('idle'), 5000) // Reset status after 5s
    } else {
      setStatus('error')
    }
  }


  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setStatus('idle');
    }, 3000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };


  React.useEffect(() => {
    if (status === 'success' || status === 'error') {
      startTimer();
    }
    return () => stopTimer();
  }, [status]);

  return (
    <form className="space-y-6 p-2 md:p-6" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="firstName" className="text-[#f28f24] font-firaGo600">
            {t.firstName}
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
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
            required
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
          required
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
          required
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
          required
          placeholder={t.placeholderMessage}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2980B9] outline-none font-firaGo400 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className={`w-full text-white font-firaGo600 py-4 rounded-xl transition duration-300 uppercase ${
          status === 'sending' ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2980B9] hover:bg-[#1F6391]'
        }`}
      >
        {status === 'sending' ? (lang === 'ka' ? 'იგზავნება...' : 'Sending...') : t.sendBtn}
      </button>


    {(status === 'success' || status === 'error') && (
  <div 
    onMouseEnter={stopTimer} // მაუსის მიტანისას გაჩერდება
    onMouseLeave={startTimer} // მაუსის მოცილებისას დაიწყება თავიდან
    className={`fixed z-[9999] transition-all duration-500 ease-out
      /* მობილურზე: ქვემოდან ცენტრში */
      bottom-6 left-1/2 -translate-x-1/2 
      /* დესკტოპზე (md): მარჯვენა ზედა კუთხეში */
      md:top-16 md:right-6 md:left-auto md:translate-x-0 
      animate-in fade-in 
      /* ანიმაცია: მობილურზე ქვემოდან ამოდის, დესკტოპზე მარჯვნიდან */
      slide-in-from-bottom-10 md:slide-in-from-right-10`}
  >
    <div className={`flex items-center gap-3 p-4 rounded-xl min-w-[320px] shadow-2xl border ${
      status === 'success' 
        ? 'bg-[#2980B9] text-white border-[#2980B9]' 
        : 'bg-white border-red-500 text-red-600'
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        status === 'success' ? 'bg-white/20' : 'bg-red-50'
      }`}>
        {status === 'success' ? (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>

      <div className="flex flex-col flex-1">
        <span className="font-firaGo600 text-[13px] uppercase tracking-wider leading-tight">
          {status === 'success' 
            ? (lang === 'ka' ? 'წარმატება' : 'Success') 
            : (lang === 'ka' ? 'შეცდომა' : 'Error')}
        </span>
        <p className="font-firaGo400 text-sm opacity-95">
          {status === 'success'
            ? (lang === 'ka' ? 'შეტყობინება წარმატებით გაიგზავნა!' : 'Message sent successfully!')
            : (lang === 'ka' ? 'ვერ გაიგზავნა, სცადეთ მოგვიანებით.' : 'Error! Please try again later.')}
        </p>
      </div>

      <button 
        onClick={() => setStatus('idle')}
        className={`ml-2 p-1 transition-opacity hover:opacity-70 ${status === 'success' ? 'text-white' : 'text-gray-400'}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
)}
  </form>
  )
}

export default ContactForm