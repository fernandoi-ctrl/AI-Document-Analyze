'use client'

interface DangerZoneProps {
  signOutLabel: string
  signingOutLabel: string
  loading: boolean
  onSignOut: () => void
}

export default function DangerZone({
  signOutLabel,
  signingOutLabel,
  loading,
  onSignOut,
}: DangerZoneProps) {
  return (
    <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
      <button
        type="button"
        onClick={onSignOut}
        disabled={loading}
        className="w-full py-3 rounded-xl border-2 border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors disabled:opacity-60"
      >
        {loading ? signingOutLabel : signOutLabel}
      </button>
    </section>
  )
}
