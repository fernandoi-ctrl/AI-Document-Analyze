type AuthAlertVariant = 'error' | 'success'

interface AuthAlertProps {
  variant: AuthAlertVariant
  message: string
}

const STYLES: Record<AuthAlertVariant, string> = {
  error: 'bg-red-500/20 border-red-400/40 text-red-200',
  success: 'bg-green-500/20 border-green-400/40 text-green-200',
}

export default function AuthAlert({ variant, message }: AuthAlertProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`border rounded-xl p-3 text-sm ${STYLES[variant]}`}
    >
      {message}
    </div>
  )
}
