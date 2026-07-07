interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

export default function EmptyState({
  title,
  description,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={
        className ??
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center'
      }
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400" aria-hidden="true">
        {icon ?? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm leading-relaxed text-gray-500">{description}</p>
      )}
    </div>
  )
}
