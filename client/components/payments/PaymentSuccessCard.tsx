'use client'

import { Link } from '@/i18n/navigation'

interface PaymentSuccessCardProps {
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
}

export default function PaymentSuccessCard({
  title,
  description,
  ctaLabel,
  ctaHref,
}: PaymentSuccessCardProps) {
  return (
    <div className="max-w-md w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-10 text-center space-y-6">
      <div
        aria-hidden="true"
        className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto"
      >
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-black">{title}</h1>
        <p className="text-white/70 text-sm leading-relaxed">{description}</p>
      </div>

      <Link
        href={ctaHref}
        className="inline-block w-full py-3 rounded-xl bg-amber-400 text-blue-900 font-black hover:bg-amber-300 transition-colors"
      >
        {ctaLabel}
      </Link>
    </div>
  )
}
