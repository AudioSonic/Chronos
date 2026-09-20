import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react'

type ProjectCreateModalProps = {
  draftTags: string[]
  setDraftTags: (update: (current: string[]) => string[]) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onClose: () => void
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void
  onTagKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  categories: string[]
}

export default function ProjectCreateModal({
  draftTags,
  setDraftTags,
  onSubmit,
  onClose,
  onImageChange,
  onTagKeyDown,
  categories,
}: ProjectCreateModalProps) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="create-project-title">
        <div className="modal-header">
          <div>
            <h2 id="create-project-title">Neues Projekt</h2>
            <p>Lege die wichtigsten Informationen für dein Projekt fest.</p>
          </div>
          <button className="modal-close" type="button" aria-label="Modal schließen" onClick={onClose}>×</button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <label>Projektname *<input name="name" required autoFocus /></label>
            <label>Kategorie<select name="category" defaultValue={categories[0]}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className="form-wide">Beschreibung<textarea name="description" rows={3} /></label>
            <label className="form-wide">Projektziel<textarea name="goal" rows={2} /></label>
            <label className="form-wide">Tags
              <div className="tag-input">
                <div className="draft-tags">{draftTags.map((tag) => <button type="button" className="tag" key={tag} onClick={() => setDraftTags((current) => current.filter((item) => item !== tag))}>#{tag} ×</button>)}</div>
                <input name="tagInput" placeholder="Tag eingeben und Enter drücken" onKeyDown={onTagKeyDown} />
              </div>
              <input type="hidden" name="tags" value={draftTags.join(',')} />
            </label>
            <label>Status<select name="status" defaultValue="Offen"><option>Offen</option><option>Geplant</option><option>Abgeschlossen</option><option>Abgebrochen</option></select></label>
            <label>Bild<input type="file" accept="image/*" onChange={onImageChange} /><input type="hidden" name="image" defaultValue="default" /></label>
            <label>Beginndatum<input type="date" name="startDate" /></label>
            <label>Enddatum<input type="date" name="endDate" /></label>
          </div>
          <div className="modal-actions">
            <button className="secondary-button" type="button" onClick={onClose}>Abbrechen</button>
            <button className="primary-button" type="submit">Projekt erstellen</button>
          </div>
        </form>
      </div>
    </div>
  )
}
