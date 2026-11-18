'use client'
//@ts-ignore
import '../app/globals.css';
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider'
import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/auth.reducer'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import Avatar from './Avatar'

export default function LandingPage() {
  const dispatch = useAppDispatch()
  const { user, loading } = useAuth()
  const t = useTranslations('Home')
  const tc = useTranslations('Common')

  function handleLogout() {
    dispatch(logout())
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center 
  bg-gradient-to-r from-[#FFF8DC] via-[#FFD700] to-[#FFA500] 
  shadow-lg hover:scale-105 transition-transform duration-200">
            <span className="font-black text-sm 
    bg-gradient-to-r from-[#FFD700] to-[#FF8C00] 
    bg-clip-text text-black">
              LS
            </span>
          </div>

          <span className="text-xl font-black tracking-tight">{tc('appName')}</span>
        </div>
        {!loading && (
          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            {user ? (
              <>
                <Link
                  href="/my-analyses"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {tc('myAnalyses')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  {tc('logout')}
                </button>
                <Link
                  href="/profile"
                  aria-label={tc('viewProfile')}
                  title={tc('viewProfile')}
                  className="rounded-full hover:ring-2 hover:ring-white/40 transition-all"
                >
                  <Avatar email={user.email!} />
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm px-4 py-2 border border-white/20 rounded-xl text-white/70 hover:text-white hover:border-white/40 transition-colors"
              >
                {tc('signIn')}
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-24 text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm px-4 py-2 rounded-full">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          {t('badge')}
        </div>

        {/* <h1 className="text-4xl sm:text-5xl font-black leading-tight">
          {t('headline')}{' '}
          <span className="text-amber-400">{t('headlineHighlight')}</span>
        </h1> */}
        <h1 className="text-4xl sm:text-5xl font-black leading-tight text-premium-white">
          {t('headline')}{' '}
          <span className="text-golden">{t('headlineHighlight')}</span>
        </h1>

        <p className="text-lg text-white/70 leading-relaxed max-w-xl mx-auto">
          {t('subhead')}
        </p>

        {/* <Link
          href="/analyze"
          className="
            inline-flex items-center gap-3 px-10 py-5 rounded-2xl
            bg-amber-400 text-blue-900 font-black text-xl
            hover:bg-amber-300 active:bg-amber-500
            transition-all duration-200 shadow-2xl hover:scale-105
          "
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {t('ctaAnalyze')}
        </Link> */}

        <Link
          href="/analyze"
          className="
    inline-flex items-center gap-3 px-10 py-5 rounded-2xl
    font-black text-xl text-blue-900
    transition-all duration-200 shadow-2xl hover:scale-105
    bg-gradient-to-r from-[#FFF8DC] via-[#FFD700] to-[#FFA500]
    hover:from-[#FFEFD5] hover:via-[#FFC107] hover:to-[#FF8C00]
    active:from-[#FFD700] active:via-[#FFA500] active:to-[#FF4500]
  "
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          {t('ctaAnalyze')}
        </Link>




        <p className="text-sm text-white/40">
          {t('creditsHint')}
        </p>
      </section>

      {/* How it works */}
      <section className="bg-white/5 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-center mb-10 text-white/90">
            {t('howItWorks')}
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: '1', title: t('step1Title'), desc: t('step1Desc'), icon: '📝' },
              { step: '2', title: t('step2Title'), desc: t('step2Desc'), icon: '🖥️' },
              { step: '3', title: t('step3Title'), desc: t('step3Desc'), icon: '📊' },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="bg-white/10 rounded-2xl p-6 space-y-3 text-center">
                <div className="text-4xl">{icon}</div>
                <div className="w-7 h-7 bg-amber-400 text-blue-900 rounded-full text-sm font-black flex items-center justify-center mx-auto">
                  {step}
                </div>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*Our experts*/}
      <section className="experience-block">
        <div className="experience-text">
          <h2 className="headline">{t('experienceHeadline')}</h2>
          <p className="subtext">
            {t('experienceSubtext')}
          </p>
        </div>

        <div className="experience-image">
          <Image src="/arnulfo_abogado2.jpg" alt="Imagen legal" width={400} height={300} />
        </div>
      </section>

      {/* Case types */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white/90">{t('caseTypesTitle')}</h2>
        <p className="text-white/50 mb-8 text-sm">
          {t('caseTypesSub')}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {['Civil', 'Mercantil', 'Penal', 'Familiar', 'Laboral'].map((type) => (
            <span
              key={type}
              className="px-5 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-semibold text-white/80"
            >
              {type}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#FFF8DC] via-[#FFD700] to-[#FFA500] py-12 shadow-xl">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-5">
          <h2 className="text-2xl font-black 
      bg-gradient-to-r from-[#FFD700] to-[#FF8C00] 
      bg-clip-text text-black">
            {t('ctaCardTitle')}
          </h2>
          <p className="text-blue-900/80 text-base font-medium">
            {t('ctaCardDesc')}
          </p>
          <Link
            href="/analyze"
            className="inline-block px-8 py-4 rounded-2xl font-bold text-base
        bg-blue-900 text-white shadow-lg
        hover:bg-blue-800 active:bg-blue-950
        transition-all duration-200 hover:scale-105 cta-button"
          >
            {t('ctaCardButton')}
          </Link>
          <p className="text-blue-900/70 text-sm">
            {t.rich('ctaCardFinePrint', { b: (chunks) => <strong>{chunks}</strong> })}
          </p>
        </div>
      </section>



      {/* Footer */}
      <footer className="text-center py-6 text-white/30 text-xs px-6">
        <p>{t('footer')}</p>
      </footer>
    </main>
  )
}
