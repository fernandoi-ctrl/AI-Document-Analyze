import type { ReactNode } from 'react'

interface AccountInfoRow {
  label: string
  value: ReactNode
}

interface AccountInfoProps {
  title: string
  rows: AccountInfoRow[]
}

function Row({ label, value }: AccountInfoRow) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-6 py-4">
      <dt className="text-sm font-semibold text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 break-all sm:text-right">{value}</dd>
    </div>
  )
}

export default function AccountInfo({ title, rows }: AccountInfoProps) {
  return (
    <section className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
      <h2 className="text-base font-bold text-gray-900 px-6 pt-6 pb-2">
        {title}
      </h2>
      <dl className="divide-y divide-gray-100">
        {rows.map((r) => (
          <Row key={r.label} label={r.label} value={r.value} />
        ))}
      </dl>
    </section>
  )
}
