import Link from 'next/link'
import dynamic from 'next/dynamic'

const NotFoundAnimation = dynamic(() => import('@/components/animations/NotFoundAnimation'), {
  ssr: false,
  loading: () => <div className="h-64 w-full" />,
})

export default function NotFound() {
  return (
    <div className="min-h-[90dvh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-full max-w-sm">
        <NotFoundAnimation />
      </div>

      <h1 className="text-9xl font-extrabold text-[#1976BA] tracking-tight">404</h1>

      <p className="text-2xl font-semibold text-slate-800 mt-4 max-w-md">
        გვერდი ვერ მოიძებნა / Page not found
      </p>

      <p className="text-slate-600 mt-2 mb-10 max-w-sm">
        როგორც ჩანს, კამერამ ვერ დააფიქსირა ის, რასაც ეძებდით.
        <br />
        It looks like our camera couldn't focus on what you were looking for.
      </p>

      <div className="flex gap-4">
        <Link
          href="/ka"
          className="px-8 py-3.5 bg-[#1976BA] text-white rounded-xl font-semibold text-lg hover:bg-[#1976BA]/90 transition-colors shadow-lg shadow-[#1976BA]/20 active:scale-95"
        >
          მთავარზე (KA)
        </Link>
        <Link
          href="/en"
          className="px-8 py-3.5 border-2 border-[#1976BA] text-[#1976BA] rounded-xl font-semibold text-lg hover:bg-[#1976BA]/5 transition-colors active:scale-95"
        >
          Home (EN)
        </Link>
      </div>
    </div>
  )
}
