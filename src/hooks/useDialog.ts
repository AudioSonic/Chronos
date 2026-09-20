import { useState } from 'react'

export default function useDialog<T = number>() {
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<T | null>(null)

  const openCreate = () => { setEditingId(null); setIsOpen(true) }
  const openEdit = (id: T) => { setEditingId(id); setIsOpen(true) }
  const close = () => { setIsOpen(false); setEditingId(null) }

  return { isOpen, editingId, openCreate, openEdit, close }
}
