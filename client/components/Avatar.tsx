const COLORS = [
  'bg-violet-500', 'bg-blue-500', 'bg-teal-500',
  'bg-rose-500', 'bg-amber-500', 'bg-green-500',
]

function colorFromEmail(email: string) {
  let hash = 0
  for (const char of email) hash = char.charCodeAt(0) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

interface AvatarProps {
  email: string
  size?: 'sm' | 'md'
}

export default function Avatar({ email, size = 'md' }: AvatarProps) {
  const initial = email[0].toUpperCase()
  const color = colorFromEmail(email)
  const dim = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'

  return (
    <div
      title={email}
      className={`${dim} ${color} rounded-full flex items-center justify-center font-bold text-white shrink-0 select-none`}
    >
      {initial}
    </div>
  )
}
