import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { MilestoneStatus } from '../../../../types/common'

export type MilestoneForm = {
  title: string
  description: string
  startDate: string
  endDate: string
  status: MilestoneStatus
}

type MilestoneModalProps = {
  form: MilestoneForm
  setForm: Dispatch<SetStateAction<MilestoneForm>>
  editing: number | null
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onClose: () => void
}

export default function MilestoneModal({ form, setForm, editing, onSubmit, onClose }: MilestoneModalProps) {
  return (
    <div className="modal-backdrop">
      <div className="project-modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>{editing === null ? 'Neuer Milestone' : 'Milestone bearbeiten'}</h2>
          <button className="modal-close" type="button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <label className="form-wide">
              Titel *
              <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            </label>
            <label className="form-wide">
              Beschreibung
              <textarea rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </label>
            <label>
              Startdatum
              <input type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} />
            </label>
            <label>
              Enddatum
              <input type="date" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} />
            </label>
            <label className="form-wide">
              Status
              <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as MilestoneStatus })}>
                <option>Geplant</option>
                <option>Aktiv</option>
                <option>Abgeschlossen</option>
              </select>
            </label>
          </div>
          <div className="modal-actions">
            <button className="secondary-button" type="button" onClick={onClose}>Abbrechen</button>
            <button className="primary-button" type="submit">Speichern</button>
          </div>
        </form>
      </div>
    </div>
  )
}
