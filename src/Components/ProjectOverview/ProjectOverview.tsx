import { useEffect, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react'
import ProjectCard from './ProjectCard'
import ProjectFilters from './ProjectFilters'
import './ProjectOverview.css'

export type Project = { name: string; description: string; tags: string[]; progress: number; tasks: string; dates: string; status: 'Offen' | 'Geplant' | 'Pausiert'; category?: string; goal?: string; startDate?: string; endDate?: string; image?: string }
const defaultCover = 'default'
const projectsStorageKey = 'chronos.projects'

const loadProjects = (): Project[] => {
  try {
    const stored = localStorage.getItem(projectsStorageKey)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

export default function ProjectOverview({ onOpenProject }: { onOpenProject: (project: Project) => void }) {
  const [projects, setProjects] = useState<Project[]>(loadProjects)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [draftTags, setDraftTags] = useState<string[]>([])

  useEffect(() => { localStorage.setItem(projectsStorageKey, JSON.stringify(projects)) }, [projects])

  const createProject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const startDate = String(form.get('startDate') || '')
    const endDate = String(form.get('endDate') || '')
    if (startDate && endDate && endDate < startDate) {
      const input = event.currentTarget.elements.namedItem('endDate') as HTMLInputElement
      input.setCustomValidity('Das Enddatum darf nicht vor dem Beginndatum liegen.')
      input.reportValidity()
      return
    }
    const project: Project = { name: String(form.get('name')).trim(), description: String(form.get('description') || ''), goal: String(form.get('goal') || ''), category: String(form.get('category') || 'Keine Kategorie'), tags: draftTags, progress: 0, tasks: '0 / 0 Tasks', dates: startDate ? `${startDate} – ${endDate || 'offen'}` : 'Kein Zeitraum', status: (form.get('status') as Project['status']) || 'Offen', startDate, endDate, image: String(form.get('image') || defaultCover) }
    setProjects((current) => [...current, project])
    setIsCreateOpen(false)
    setDraftTags([])
  }

  const updateImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { const image = event.target.form?.elements.namedItem('image') as HTMLInputElement | null; if (image) image.value = String(reader.result) }
    reader.readAsDataURL(file)
  }

  const addTags = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    const values = event.currentTarget.value.split(',').map((tag) => tag.trim()).filter(Boolean)
    setDraftTags((current) => [...current, ...values.filter((tag) => !current.includes(tag))])
    event.currentTarget.value = ''
  }

  return <section className="project-overview">
    <header className="overview-header"><div><h1>Projekte</h1><p>Deine Projekte im Überblick. Wähle ein Projekt, um loszulegen.</p></div><div className="overview-actions"><label className="project-search"><span>⌕</span><input type="search" placeholder="Projekte suchen ..." aria-label="Projekte suchen" /><kbd>Ctrl K</kbd></label><button className="primary-button" type="button" onClick={() => setIsCreateOpen(true)}>＋ Neues Projekt</button></div></header>
    <ProjectFilters />
    <div className="project-toolbar"><button className="sort-button" type="button">☷ &nbsp; Sortieren: Zuletzt bearbeitet⌄</button><div className="view-buttons"><button className="view-button is-selected" type="button">▦</button><button className="view-button" type="button">☷</button></div></div>
    <div className="project-grid">{projects.map((project) => <ProjectCard key={`${project.name}-${project.startDate}`} project={project} onOpen={() => onOpenProject(project)} />)}</div>
    {isCreateOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsCreateOpen(false)}><div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="create-project-title"><div className="modal-header"><div><h2 id="create-project-title">Neues Projekt</h2><p>Lege die wichtigsten Informationen für dein Projekt fest.</p></div><button className="modal-close" type="button" aria-label="Modal schließen" onClick={() => setIsCreateOpen(false)}>×</button></div><form onSubmit={createProject}><div className="form-grid"><label>Projektname *<input name="name" required autoFocus /></label><label>Kategorie<select name="category" defaultValue="Keine Kategorie"><option>Keine Kategorie</option><option>Programmierung</option><option>Game Development</option><option>Gaming</option><option>Fitness</option></select></label><label className="form-wide">Beschreibung<textarea name="description" rows={3} /></label><label className="form-wide">Projektziel<textarea name="goal" rows={2} /></label><label className="form-wide">Tags<div className="tag-input"><div className="draft-tags">{draftTags.map((tag) => <button type="button" className="tag" key={tag} onClick={() => setDraftTags((current) => current.filter((item) => item !== tag))}>#{tag} ×</button>)}</div><input name="tagInput" placeholder="Tag eingeben und Enter drücken" onKeyDown={addTags} /></div><input type="hidden" name="tags" value={draftTags.join(',')} /></label><label>Status<select name="status" defaultValue="Offen"><option>Offen</option><option>Geplant</option><option>Abgeschlossen</option><option>Abgebrochen</option></select></label><label>Bild<input type="file" accept="image/*" onChange={updateImage} /><input type="hidden" name="image" defaultValue={defaultCover} /></label><label>Beginndatum<input type="date" name="startDate" /></label><label>Enddatum<input type="date" name="endDate" /></label></div><div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setIsCreateOpen(false)}>Abbrechen</button><button className="primary-button" type="submit">Projekt erstellen</button></div></form></div></div>}
  </section>
}
