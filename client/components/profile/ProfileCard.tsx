interface ProfileCardProps {
  initial: string
  avatarColorClass: string
  displayName: string
  email: string
  memberSinceLabel: string
}

export default function ProfileCard({
  initial,
  avatarColorClass,
  displayName,
  email,
  memberSinceLabel,
}: ProfileCardProps) {
  return (
    <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div
          aria-hidden="true"
          className={`w-24 h-24 ${avatarColorClass} rounded-full flex items-center justify-center font-black text-white text-4xl shrink-0 select-none shadow-lg`}
        >
          {initial}
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <h1 className="text-2xl font-black text-gray-900 break-all">
            {displayName}
          </h1>
          <p className="text-gray-500 text-sm break-all">{email}</p>
          <p className="text-gray-400 text-xs pt-2">{memberSinceLabel}</p>
        </div>
      </div>
    </section>
  )
}
