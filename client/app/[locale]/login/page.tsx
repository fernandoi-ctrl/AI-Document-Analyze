import LoginScreen from '@/components/auth/LoginScreen'
import { setRequestLocale } from 'next-intl/server'
// import LoginScreen from '@/components/auth/LoginScreen'

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return <LoginScreen />
}
