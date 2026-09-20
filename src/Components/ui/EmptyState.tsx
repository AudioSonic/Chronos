import type { ReactNode } from 'react'

export default function EmptyState({ title, children, className = '' }: { title: string; children?: ReactNode; className?: string }) {
  return <div className={`empty-state ${className}`.trim()}><h3>{title}</h3>{children && <p>{children}</p>}</div>
}
