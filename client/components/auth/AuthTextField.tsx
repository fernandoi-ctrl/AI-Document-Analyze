import type { InputHTMLAttributes } from 'react'

interface AuthTextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string
}

export default function AuthTextField({ label, id, ...inputProps }: AuthTextFieldProps) {
  const inputId = id ?? `auth-field-${label.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold mb-1 text-white/80"
      >
        {label}
      </label>
      <input
        id={inputId}
        {...inputProps}
        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
    </div>
  )
}
