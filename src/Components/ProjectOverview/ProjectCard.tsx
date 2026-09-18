import type { Project } from './ProjectOverview'

export default function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const hasImage = Boolean(project.image && project.image !== 'default')
  return <article className="project-card" onClick={onOpen} onKeyDown={(event) => event.key === 'Enter' && onOpen()} role="button" tabIndex={0}>
    <div className="project-card-cover" style={hasImage ? { backgroundImage: `linear-gradient(rgba(4, 19, 33, .35), rgba(4, 19, 33, .75)), url(${project.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
      {!project.image && <><span className="cover-logo">✦ Chronos</span><strong>Planen.<br />Umsetzen.<br />Wachsen.</strong></>}
    </div>
    <div className="project-card-body"><div className="project-card-title-row"><h2>{project.name}</h2><button className="icon-button" type="button" aria-label="Projektoptionen" onClick={(event) => event.stopPropagation()}>⋮</button></div><p className="project-description">{project.description}</p><div className="tag-list">{project.tags.map((tag) => <span className="tag" key={tag}>#{tag}</span>)}</div><div className="progress-row"><div className="progress-track"><span style={{ width: `${project.progress}%` }} /></div><span>{project.progress} %</span></div><div className="project-meta"><span>▣ &nbsp;{project.tasks}</span><span>□ &nbsp;{project.dates}</span></div><span className="status status-offen">{project.status}</span></div>
  </article>
}
