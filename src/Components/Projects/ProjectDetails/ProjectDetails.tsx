import { useCallback, useState } from 'react'
import type { Project } from '../projectTypes'
import ProjectTabs from './ProjectTabs'
import ProjectSettings from './settings/ProjectSettings'
import ResourcesOverview from './resources/ResourcesOverview'
import './ProjectDetails.css'
import ProjectTasks from './tasks/ProjectTasks'
import ProjectMilestones from './milestones/ProjectMilestones'
import { taskStorage } from '../../../services/storage/taskStorage'
import ProjectHeader from './ProjectHeader'

const tabs = ['Aufgaben', 'Milestones', 'Dokumentation', 'Ressourcen', 'Einstellungen']
export default function ProjectDetails({ project, onBack }: { project: Project; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [progress, setProgress] = useState(project.progress)
  const [taskTotal, setTaskTotal] = useState(0)
  const updateProgress = useCallback((completed: number, total: number) => { setProgress(total ? Math.round(completed / total * 100) : 0); setTaskTotal(total); setCompletedTasks(completed) }, [])
  const [completedTasks, setCompletedTasks] = useState(0)
  const totalInvestedSeconds = taskStorage.read()
    .filter((task) => task.projectId === project.id)
    .reduce((total, task) => total + (task.investedSeconds || 0), 0)

  return <section className="project-details">
    <ProjectHeader project={project} completedTasks={completedTasks} taskTotal={taskTotal} progress={progress} totalInvestedSeconds={totalInvestedSeconds} onBack={onBack} />
    <ProjectTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
    {activeTab === 'Aufgaben' ? <ProjectTasks project={project} onProgress={updateProgress} /> : activeTab === 'Milestones' ? <ProjectMilestones project={project} /> : activeTab === 'Einstellungen' ? <ProjectSettings project={project} /> : activeTab === 'Ressourcen' ? <ResourcesOverview /> : <div className="project-tab-content"><p>{activeTab} – Inhalte folgen.</p></div>}
  </section>
}
