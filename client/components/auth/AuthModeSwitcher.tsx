interface AuthModeSwitcherProps {
  prompt: string
  actionLabel: string
  onToggle: () => void
}

export default function AuthModeSwitcher({
  prompt,
  actionLabel,
  onToggle,
}: AuthModeSwitcherProps) {
  return (
    <p className="text-center text-sm text-white/60">
      {prompt}{' '}
      <button
        type="button"
        onClick={onToggle}
        className="text-amber-400 font-semibold hover:underline"
      >
        {actionLabel}
      </button>
    </p>
  )
}
