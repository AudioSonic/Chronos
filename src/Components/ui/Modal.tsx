import type { ReactNode } from 'react'

export default function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="project-modal" role="dialog" aria-modal="true">{children}</div></div>
}
