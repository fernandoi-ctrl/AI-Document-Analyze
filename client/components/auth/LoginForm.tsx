'use client'

import { useTranslations } from 'next-intl'
// import { useAuthForm } from '@/hooks/useAuthForm'

import AuthAlert from './AuthAlert'
import AuthTextField from './AuthTextField'
import AuthSubmitButton from './AuthSubmitButton'
import AuthModeSwitcher from './AuthModeSwitcher'
import { useAuthForm } from '@/hooks/useAuthForm'

export default function LoginForm() {
  const t = useTranslations('Login')
  const {
    mode,
    email,
    password,
    updating,
    errorMessage,
    registerSuccess,
    setEmail,
    setPassword,
    toggleMode,
    submit,
  } = useAuthForm()

  const isLogin = mode === 'login'

  return (
    <div className="w-full max-w-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 space-y-6">
      <h1 className="text-2xl font-black text-center">
        {isLogin ? t('loginTitle') : t('registerTitle')}
      </h1>

      {errorMessage && <AuthAlert variant="error" message={errorMessage} />}
      {registerSuccess && (
        <AuthAlert variant="success" message={t('registerSuccess')} />
      )}

      <form onSubmit={submit} className="space-y-4" noValidate>
        <AuthTextField
          label={t('emailLabel')}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('emailPlaceholder')}
        />
        <AuthTextField
          label={t('passwordLabel')}
          type="password"
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('passwordPlaceholder')}
        />
        <AuthSubmitButton
          loading={updating}
          loadingLabel={t('submitLoading')}
          label={isLogin ? t('submitLogin') : t('submitRegister')}
        />
      </form>

      <AuthModeSwitcher
        prompt={isLogin ? t('noAccount') : t('hasAccount')}
        actionLabel={isLogin ? t('switchToRegister') : t('switchToLogin')}
        onToggle={toggleMode}
      />
    </div>
  )
}
