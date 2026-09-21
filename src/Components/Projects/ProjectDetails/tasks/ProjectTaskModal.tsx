import type { Dispatch, FormEvent, SetStateAction } from 'react'
import Modal from '../../../ui/Modal'

export type ProjectTaskForm = {
  title: string
  description: string
  dueDate: string
  milestoneId: string
}

type Milestone = { id: number; title: string; projectId: number }

type ProjectTaskModalProps = {
  form: ProjectTaskForm
  setForm: Dispatch<SetStateAction<ProjectTaskForm>>
  milestones: Milestone[]
  editing: number | null
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onClose: () => void
}

export default function ProjectTaskModal({ form, setForm, milestones, editing, onSubmit, onClose }: ProjectTaskModalProps) {
  return (
    <Modal onClose={onClose}>
        <div className="modal-header">
          <h2>{editing === null ? 'Neue Projektaufgabe' : 'Projektaufgabe bearbeiten'}</h2>
          <button className="modal-close" type="button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <label className="form-wide">
              Titel *
              <input required autoFocus value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            </label>
            <label className="form-wide">
              Beschreibung
              <textarea rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </label>
            <label>
              Fälligkeitsdatum
              <span className="date-field">
                <input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
                {form.dueDate && <button className="clear-date-button" type="button" onClick={() => setForm({ ...form, dueDate: '' })}>Fälligkeit entfernen</button>}
              </span>
            </label>
            <label>
              Milestone
              <select value={form.milestoneId} onChange={(event) => setForm({ ...form, milestoneId: event.target.value })}>
                <option value="">Kein Milestone</option>
                {milestones.map((milestone) => <option key={milestone.id} value={milestone.id}>{milestone.title}</option>)}
              </select>
            </label>
          </div>
          <div className="modal-actions">
            <button className="secondary-button" type="button" onClick={onClose}>Abbrechen</button>
            <button className="primary-button" type="submit">Speichern</button>
          </div>
        </form>
    </Modal>
  )
}
