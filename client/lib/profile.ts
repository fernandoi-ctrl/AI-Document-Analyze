const COLORS = [
  'bg-violet-500',
  'bg-blue-500',
  'bg-teal-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-green-500',
] as const

export function colorFromEmail(email: string): string {
  let hash = 0
  for (const char of email) hash = char.charCodeAt(0) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

const dateLocale = (l: string): string => (l === 'es' ? 'es-MX' : 'en-US')

export function formatProfileDate(
  iso: string | undefined | null,
  locale: string,
): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(dateLocale(locale), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function displayNameFromUser(args: {
  email: string
  fullName?: string
}): string {
  return args.fullName?.trim() || args.email.split('@')[0]
}

export function initialFromEmail(email: string): string {
  return email[0]?.toUpperCase() ?? '?'
}
