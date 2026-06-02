'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useProfile } from '@/hooks/useProfile'
import {
  colorFromEmail,
  displayNameFromUser,
  formatProfileDate,
  initialFromEmail,
} from '@/lib/profile'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileCard from '@/components/profile/ProfileCard'
import CreditsCard from '@/components/profile/CreditsCard'
import AnalysesCard from '@/components/profile/AnalysesCard'
import AccountInfo from '@/components/profile/AccountInfo'
import DangerZone from '@/components/profile/DangerZone'

export default function ProfilePage() {
  const t = useTranslations('Profile')
  const tc = useTranslations('Common')
  const locale = useLocale()

  const {
    user,
    credits,
    analysesCount,
    buyingCredits,
    ready,
    buyCredits,
    signOut,
  } = useProfile()

  if (!ready || !user) return null

  const email = user.email
  const memberSince = t('memberSince', {
    date: formatProfileDate(user.createdAt, locale),
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <ProfileHeader
        appName={tc('appName')}
        breadcrumb={t('breadcrumb')}
        newAnalysisLabel={tc('newAnalysis')}
      />

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <ProfileCard
          initial={initialFromEmail(email)}
          avatarColorClass={colorFromEmail(email)}
          displayName={displayNameFromUser({ email, fullName: user.fullName })}
          email={email}
          memberSinceLabel={memberSince}
        />

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CreditsCard
            label={t('credits')}
            hint={t('creditsHint')}
            credits={credits}
            buyLabel={t('buyCredits')}
            redirectingLabel={t('redirecting')}
            buying={buyingCredits}
            onBuy={buyCredits}
          />
          <AnalysesCard
            label={t('analysesDone')}
            hint={t('analysesHint')}
            count={analysesCount}
            viewLabel={t('viewAnalyses')}
          />
        </section>

        <AccountInfo
          title={t('accountInfo')}
          rows={[
            { label: t('email'), value: email },
            {
              label: t('userId'),
              value: (
                <code className="text-xs text-gray-600 break-all">{user.id}</code>
              ),
            },
            {
              label: t('registeredAt'),
              value: formatProfileDate(user.createdAt, locale),
            },
            {
              label: t('lastSignIn'),
              value: formatProfileDate(user.lastSignInAt, locale),
            },
          ]}
        />

        <DangerZone
          signOutLabel={t('signOut')}
          signingOutLabel={t('signingOut')}
          loading={false}
          onSignOut={signOut}
        />
      </div>
    </main>
  )
}
