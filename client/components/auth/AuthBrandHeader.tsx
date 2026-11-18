import { Link } from '@/i18n/navigation'
import LocaleSwitcher from '@/components/LocaleSwitcher'

export default function AuthBrandHeader() {
  return (
    <nav className="px-6 py-5 max-w-5xl mx-auto w-full flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 w-fit">
        <div className="w-9 h-9 bg-amber-400 rounded-lg flex items-center justify-center">
          <span className="text-blue-900 font-black text-sm">LS</span>
        </div>
        <span className="text-xl font-black tracking-tight">Analiza tu juicio</span>
      </Link>
      <LocaleSwitcher />
    </nav>
  )
}
