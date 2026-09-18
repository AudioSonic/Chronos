import { useCallback, useState } from 'react'
import type { Project } from '../ProjectOverview/ProjectOverview'
import ProjectTabs from './ProjectTabs'
import ProjectSettings from './ProjectSettings'
import ResourcesOverview from './ResourcesOverview'
import './ProjectDetails.css'
import ProjectTasks from './ProjectTasks'
import ProjectMilestones from './ProjectMilestones'

const tabs = ['Aufgaben', 'Milestones', 'Dokumentation', 'Ressourcen', 'Einstellungen']

export default function ProjectDetails({ project, onBack }: { project: Project; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [progress, setProgress] = useState(project.progress)
  const [taskTotal, setTaskTotal] = useState(0)
  const updateProgress = useCallback((completed: number, total: number) => { setProgress(total ? Math.round(completed / total * 100) : 0); setTaskTotal(total); setCompletedTasks(completed) }, [])
  const [completedTasks, setCompletedTasks] = useState(0)

  return <section className="project-details">
    <div className="project-breadcrumb"><button type="button" onClick={onBack}>Projekte</button><span>›</span><strong>{project.name}</strong></div>
    <header className="project-hero">
      <div className="project-hero-image" style={project.image && project.image !== 'default' ? { backgroundImage: `url(${project.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>{!project.image && <><span>✦ {project.name}</span><strong>Planen.<br />Umsetzen.<br />Wachsen.</strong></>}</div>
      <div className="project-hero-info"><div className="project-title-row"><h1>{project.name}</h1><button type="button">✎ Bearbeiten</button></div><p>{project.description}</p><div className="tag-list">{project.tags.map((tag) => <span className="tag" key={tag}>#{tag}</span>)}</div><div className="project-facts"><span>◷ <small>Status</small><b>{project.status}</b></span><span>□ <small>Kategorie</small><b>{project.category || 'Keine Kategorie'}</b></span><span>▣ <small>Zeitraum</small><b>{project.dates}</b></span></div></div>
      <div className="project-progress"><div className="progress-circle" style={{ background: `conic-gradient(var(--color-accent) 0 ${progress}%, #2a6da0 ${progress}% 100%)` }}><strong>{progress} %</strong></div><span>{completedTasks} / {taskTotal} Tasks</span></div>
    </header>
    <ProjectTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
    {activeTab === 'Aufgaben' ? <ProjectTasks project={project} onProgress={updateProgress} /> : activeTab === 'Milestones' ? <ProjectMilestones project={project} /> : activeTab === 'Einstellungen' ? <ProjectSettings project={project} /> : activeTab === 'Ressourcen' ? <ResourcesOverview /> : <div className="project-tab-content"><p>{activeTab} – Inhalte folgen.</p></div>}
  </section>
}
