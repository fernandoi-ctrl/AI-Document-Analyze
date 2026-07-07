interface ErrorStateProps {
  message: string
  onRetry?: () => void
  className?: string
}

export default function ErrorState({ message, onRetry, className }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={
        className ??
        'flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800'
      }
    >
      <svg
        className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div className="flex-1">
        <p className="text-sm font-semibold">Ocurrió un error</p>
        <p className="mt-0.5 text-sm">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-red-700 underline decoration-red-300 underline-offset-4 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  )
}
