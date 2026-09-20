import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Button from './Button'
import EmptyState from './EmptyState'
import Modal from './Modal'
import ProgressRing from './ProgressRing'

describe('Gemeinsame UI-Komponenten', () => {
  it('rendert Buttons mit Variante und reagiert auf Klicks', () => {
    const onClick = vi.fn()
    render(<Button variant="secondary" onClick={onClick}>Speichern</Button>)
    const button = screen.getByRole('button', { name: 'Speichern' })
    expect(button).toHaveClass('secondary-button')
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('zeigt einen leeren Zustand verständlich an', () => {
    render(<EmptyState title="Keine Aufgaben">Lege eine Aufgabe an.</EmptyState>)
    expect(screen.getByRole('heading', { name: 'Keine Aufgaben' })).toBeInTheDocument()
    expect(screen.getByText('Lege eine Aufgabe an.')).toBeInTheDocument()
  })

  it('rendert ein zugängliches Modal und schließt über den Hintergrund', () => {
    const onClose = vi.fn()
    render(<Modal onClose={onClose}>Dialoginhalt</Modal>)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
    fireEvent.mouseDown(screen.getByRole('presentation'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('begrenzt Fortschrittswerte auf 0 bis 100', () => {
    const { container } = render(<ProgressRing value={120} />)
    expect(container.firstElementChild).toHaveTextContent('120 %')
    expect(container.firstElementChild?.getAttribute('style')).toContain('100%')
  })
})
