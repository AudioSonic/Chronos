import type { Project } from '../projectTypes'

type ProjectHeaderProps = {
  project: Project
  completedTasks: number
  taskTotal: number
  progress: number
  totalInvestedSeconds: number
  onBack: () => void
}

const formatTotalTime = (seconds: number) => `${Math.floor(seconds / 3600).toString().padStart(2, '0')}:${Math.floor(seconds % 3600 / 60).toString().padStart(2, '0')} h`
const formatDate = (value: string) => value ? new Intl.DateTimeFormat('de-DE').format(new Date(`${value}T12:00:00`)) : 'offen'

export default function ProjectHeader({ project, completedTasks, taskTotal, progress, totalInvestedSeconds, onBack }: ProjectHeaderProps) {
  const displayDates = project.startDate
    ? `${formatDate(project.startDate)} – ${formatDate(project.endDate || '')}`
    : project.dates

  return <>
    <div className="project-breadcrumb"><button type="button" onClick={onBack}>Projekte</button><span>›</span><strong>{project.name}</strong></div>
    <header className="project-hero">
      <div className="project-hero-image" style={project.image && project.image !== 'default' ? { backgroundImage: `url(${project.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>{!project.image && <><span>✦ {project.name}</span><strong>Planen.<br />Umsetzen.<br />Wachsen.</strong></>}</div>
      <div className="project-hero-info"><div className="project-title-row"><h1>{project.name}</h1><button type="button">✎ Bearbeiten</button></div><p>{project.description}</p><div className="tag-list">{project.tags.map((tag) => <span className="tag" key={tag}>#{tag}</span>)}</div><div className="project-facts"><span>◷ <small>Status</small><b>{project.status}</b></span><span>□ <small>Kategorie</small><b>{project.category || 'Keine Kategorie'}</b></span><span>▣ <small>Zeitraum</small><b>{displayDates}</b></span><span>◷ <small>Investierte Zeit</small><b>{formatTotalTime(totalInvestedSeconds)}</b></span></div></div>
      <div className="project-progress"><div className="progress-circle" style={{ background: `conic-gradient(var(--color-accent) 0 ${progress}%, #2a6da0 ${progress}% 100%)` }}><strong>{progress} %</strong></div><span>{completedTasks} / {taskTotal} Tasks</span></div>
    </header>
  </>
}
