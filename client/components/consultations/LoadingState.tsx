interface LoadingStateProps {
  label?: string
  className?: string
}

export default function LoadingState({
  label = 'Cargando…',
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={
        className ??
        'flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white p-6 text-gray-600'
      }
    >
      <svg
        className="h-5 w-5 animate-spin text-blue-700"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          className="opacity-25"
        />
        <path
          fill="currentColor"
          className="opacity-75"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}
