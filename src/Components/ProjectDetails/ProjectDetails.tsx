import { useState } from 'react'
import type { Project } from '../ProjectOverview/ProjectOverview'
import ProjectTabs from './ProjectTabs'
import ProjectSettings from './ProjectSettings'
import ResourcesOverview from './ResourcesOverview'
import './ProjectDetails.css'

const tabs = ['Aufgaben', 'Milestones', 'Dokumentation', 'Ressourcen', 'Einstellungen']

export default function ProjectDetails({ project, onBack }: { project: Project; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState(tabs[0])

  return <section className="project-details">
    <div className="project-breadcrumb"><button type="button" onClick={onBack}>Projekte</button><span>›</span><strong>{project.name}</strong></div>
    <header className="project-hero">
      <div className="project-hero-image"><span>✦ {project.name}</span><strong>Planen.<br />Umsetzen.<br />Wachsen.</strong></div>
      <div className="project-hero-info"><div className="project-title-row"><h1>{project.name}</h1><button type="button">✎ Bearbeiten</button></div><p>{project.description}</p><div className="tag-list">{project.tags.map((tag) => <span className="tag" key={tag}>#{tag}</span>)}</div><div className="project-facts"><span>◷ <small>Status</small><b>{project.status}</b></span><span>□ <small>Kategorie</small><b>Entwicklung</b></span><span>▣ <small>Zeitraum</small><b>{project.dates}</b></span></div></div>
      <div className="project-progress"><div className="progress-circle" style={{ background: `conic-gradient(var(--color-accent) 0 ${project.progress}%, #2a6da0 ${project.progress}% 100%)` }}><strong>{project.progress} %</strong></div><span>{project.tasks}</span></div>
    </header>
    <ProjectTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
    {activeTab === 'Einstellungen' ? <ProjectSettings project={project} /> : activeTab === 'Ressourcen' ? <ResourcesOverview /> : <div className="project-tab-content"><p>{activeTab} – Inhalte folgen.</p></div>}
  </section>
}
