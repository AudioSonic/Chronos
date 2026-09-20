import type { Project } from '../projectTypes'
import { taskStorage } from '../../../services/storage/taskStorage'

export default function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const projectTasks = taskStorage.read().filter((task) => task.projectId === project.id)
  const completedTasks = projectTasks.filter((task) => task.completed).length
  const progress = projectTasks.length ? Math.round(completedTasks / projectTasks.length * 100) : 0
  const displayDates = project.startDate ? `${new Intl.DateTimeFormat('de-DE').format(new Date(`${project.startDate}T12:00:00`))} – ${project.endDate ? new Intl.DateTimeFormat('de-DE').format(new Date(`${project.endDate}T12:00:00`)) : 'offen'}` : project.dates
  const hasImage = Boolean(project.image && project.image !== 'default')
  return <article className="project-card" onClick={onOpen} onKeyDown={(event) => event.key === 'Enter' && onOpen()} role="button" tabIndex={0}>
    <div className="project-card-cover" style={hasImage ? { backgroundImage: `linear-gradient(rgba(4, 19, 33, .35), rgba(4, 19, 33, .75)), url(${project.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
      {!project.image && <><span className="cover-logo">✦ Chronos</span><strong>Planen.<br />Umsetzen.<br />Wachsen.</strong></>}
    </div>
    <div className="project-card-body"><div className="project-card-title-row"><h2>{project.name}</h2></div><p className="project-description">{project.description}</p><div className="tag-list">{project.tags.map((tag) => <span className="tag" key={tag}>#{tag}</span>)}</div><div className="progress-row"><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><span>{progress} %</span></div><div className="project-meta"><span>▣ &nbsp;{completedTasks} / {projectTasks.length} Aufgaben</span><span>□ &nbsp;{displayDates}</span></div><span className="status status-offen">{project.status}</span></div>
  </article>
}
