import { Plus, Minus } from 'lucide-react'

export default function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-line py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between label">
        {title}
        <Plus size={14} className="group-open:hidden" />
        <Minus size={14} className="hidden group-open:block" />
      </summary>
      <div className="whitespace-pre-line pt-4 text-sm leading-relaxed text-muted">{children}</div>
    </details>
  )
}
