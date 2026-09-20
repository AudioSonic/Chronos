import { useMemo, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react'
import ProjectCard from './ProjectCard'
import ProjectFilters from './ProjectFilters'
import ProjectCreateModal from './ProjectCreateModal'
import './ProjectOverview.css'
import { projectCategories, type Project } from '../projectTypes'
import useProjects from '../../../hooks/useProjects'
import { taskStorage } from '../../../services/storage/taskStorage'
import { formatProjectDates, getProjectTaskSummary } from '../projectUtils'
export type { Project } from '../projectTypes'
export { projectCategories } from '../projectTypes'
const defaultCover = 'default'
export default function ProjectOverview({ onOpenProject }: { onOpenProject: (project: Project) => void }) {
  const { projects, addProject } = useProjects()
  const tasks = useMemo(() => taskStorage.read(), [projects])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [draftTags, setDraftTags] = useState<string[]>([])
  const createProject = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); const startDate = String(form.get('startDate') || ''); const endDate = String(form.get('endDate') || ''); if (startDate && endDate && endDate < startDate) { const input = event.currentTarget.elements.namedItem('endDate') as HTMLInputElement; input.setCustomValidity('Das Enddatum darf nicht vor dem Beginndatum liegen.'); input.reportValidity(); return } const pendingTags = String(form.get('tagInput') || '').split(',').map((tag) => tag.trim()).filter(Boolean); const tags = [...draftTags, ...pendingTags.filter((tag) => !draftTags.includes(tag))]; addProject({ name: String(form.get('name')).trim(), description: String(form.get('description') || ''), goal: String(form.get('goal') || ''), category: String(form.get('category') || projectCategories[0]), tags, progress: 0, tasks: '0 / 0 Tasks', dates: startDate ? `${startDate} – ${endDate || 'offen'}` : 'Kein Zeitraum', status: (form.get('status') as Project['status']) || 'Offen', startDate, endDate, image: String(form.get('image') || defaultCover) }); setIsCreateOpen(false); setDraftTags([]) }
  const updateImage = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { const image = event.target.form?.elements.namedItem('image') as HTMLInputElement | null; if (image) image.value = String(reader.result) }; reader.readAsDataURL(file) }
  const addTags = (event: KeyboardEvent<HTMLInputElement>) => { if (event.key !== 'Enter') return; event.preventDefault(); const values = event.currentTarget.value.split(',').map((tag) => tag.trim()).filter(Boolean); setDraftTags((current) => [...current, ...values.filter((tag) => !current.includes(tag))]); event.currentTarget.value = '' }
  return <section className="project-overview"><header className="overview-header"><div><h1>Projekte</h1><p>Deine Projekte im Überblick. Wähle ein Projekt, um loszulegen.</p></div><div className="overview-actions"><label className="project-search"><span>⌕</span><input type="search" placeholder="Projekte suchen ..." aria-label="Projekte suchen" /><kbd>Ctrl K</kbd></label><button className="primary-button" type="button" onClick={() => setIsCreateOpen(true)}>＋ Neues Projekt</button></div></header><ProjectFilters /><div className="project-toolbar"><button className="sort-button" type="button">☷ &nbsp; Sortieren: Zuletzt bearbeitet⌄</button><div className="view-buttons"><button className="view-button is-selected" type="button">▦</button><button className="view-button" type="button">☷</button></div></div><div className="project-grid">{projects.map((project) => { const summary = getProjectTaskSummary(project.id, tasks); return <ProjectCard key={`${project.name}-${project.startDate}`} project={project} {...summary} displayDates={formatProjectDates(project)} onOpen={() => onOpenProject(project)} /> })}</div>{isCreateOpen && <ProjectCreateModal draftTags={draftTags} setDraftTags={setDraftTags} onSubmit={createProject} onClose={() => setIsCreateOpen(false)} onImageChange={updateImage} onTagKeyDown={addTags} />}</section>
}
