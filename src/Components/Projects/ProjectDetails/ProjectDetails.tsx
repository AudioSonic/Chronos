import { useCallback, useState } from 'react'
import type { Project } from '../projectTypes'
import ProjectTabs from './ProjectTabs'
import ProjectSettings from './settings/ProjectSettings'
import ResourcesOverview from './resources/ResourcesOverview'
import './ProjectDetails.css'
import ProjectTasks from './tasks/ProjectTasks'
import ProjectMilestones from './milestones/ProjectMilestones'

const tabs = ['Aufgaben', 'Milestones', 'Dokumentation', 'Ressourcen', 'Einstellungen']
const formatTotalTime = (seconds: number) => `${Math.floor(seconds / 3600).toString().padStart(2, '0')}:${Math.floor(seconds % 3600 / 60).toString().padStart(2, '0')} h`
const formatDate = (value: string) => value ? new Intl.DateTimeFormat('de-DE').format(new Date(`${value}T12:00:00`)) : 'offen'

export default function ProjectDetails({ project, onBack }: { project: Project; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [progress, setProgress] = useState(project.progress)
  const [taskTotal, setTaskTotal] = useState(0)
  const updateProgress = useCallback((completed: number, total: number) => { setProgress(total ? Math.round(completed / total * 100) : 0); setTaskTotal(total); setCompletedTasks(completed) }, [])
  const [completedTasks, setCompletedTasks] = useState(0)
  const totalInvestedSeconds = (() => { try { const tasks = JSON.parse(localStorage.getItem('chronos.tasks') || '[]') as { projectId?: number; investedSeconds?: number }[]; return tasks.filter((task) => task.projectId === project.id).reduce((total, task) => total + (task.investedSeconds || 0), 0) } catch { return 0 } })()

  return <section className="project-details">
    <div className="project-breadcrumb"><button type="button" onClick={onBack}>Projekte</button><span>›</span><strong>{project.name}</strong></div>
    <header className="project-hero">
      <div className="project-hero-image" style={project.image && project.image !== 'default' ? { backgroundImage: `url(${project.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>{!project.image && <><span>✦ {project.name}</span><strong>Planen.<br />Umsetzen.<br />Wachsen.</strong></>}</div>
      <div className="project-hero-info"><div className="project-title-row"><h1>{project.name}</h1><button type="button">✎ Bearbeiten</button></div><p>{project.description}</p><div className="tag-list">{project.tags.map((tag) => <span className="tag" key={tag}>#{tag}</span>)}</div><div className="project-facts"><span>◷ <small>Status</small><b>{project.status}</b></span><span>□ <small>Kategorie</small><b>{project.category || 'Keine Kategorie'}</b></span><span>▣ <small>Zeitraum</small><b>{project.startDate ? `${formatDate(project.startDate)} – ${formatDate(project.endDate || '')}` : project.dates}</b></span><span>◷ <small>Investierte Zeit</small><b>{formatTotalTime(totalInvestedSeconds)}</b></span></div></div>
      <div className="project-progress"><div className="progress-circle" style={{ background: `conic-gradient(var(--color-accent) 0 ${progress}%, #2a6da0 ${progress}% 100%)` }}><strong>{progress} %</strong></div><span>{completedTasks} / {taskTotal} Tasks</span></div>
    </header>
    <ProjectTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
    {activeTab === 'Aufgaben' ? <ProjectTasks project={project} onProgress={updateProgress} /> : activeTab === 'Milestones' ? <ProjectMilestones project={project} /> : activeTab === 'Einstellungen' ? <ProjectSettings project={project} /> : activeTab === 'Ressourcen' ? <ResourcesOverview /> : <div className="project-tab-content"><p>{activeTab} – Inhalte folgen.</p></div>}
  </section>
}
