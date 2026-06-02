interface AuthSubmitButtonProps {
  loading: boolean
  loadingLabel: string
  label: string
}

export default function AuthSubmitButton({
  loading,
  loadingLabel,
  label,
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 rounded-xl bg-amber-400 text-blue-900 font-black disabled:opacity-60 transition-all hover:bg-amber-300"
    >
      {loading ? loadingLabel : label}
    </button>
  )
}
