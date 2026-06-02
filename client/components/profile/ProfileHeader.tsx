'use client'

import { Link } from '@/i18n/navigation'
import LocaleSwitcher from '@/components/LocaleSwitcher'

interface ProfileHeaderProps {
  appName: string
  breadcrumb: string
  newAnalysisLabel: string
}

export default function ProfileHeader({
  appName,
  breadcrumb,
  newAnalysisLabel,
}: ProfileHeaderProps) {
  return (
    <header className="bg-blue-900 text-white px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
              <span className="text-blue-900 font-black text-xs">LS</span>
            </div>
            <span className="font-black tracking-tight text-lg">{appName}</span>
          </Link>
          <span aria-hidden="true" className="text-white/40">
            ›
          </span>
          <span className="text-white/70 text-sm">{breadcrumb}</span>
        </div>
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Link
            href="/analyze"
            className="px-4 py-2 bg-amber-400 text-blue-900 rounded-xl text-sm font-bold hover:bg-amber-300 transition-colors"
          >
            {newAnalysisLabel}
          </Link>
        </div>
      </div>
    </header>
  )
}
