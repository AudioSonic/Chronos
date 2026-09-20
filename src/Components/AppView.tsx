import type { Project } from './Projects/projectTypes'
import Dashboard from './Dashboard/Dashboard'
import ProjectDetails from './Projects/ProjectDetails/ProjectDetails'
import ProjectOverview from './Projects/ProjectOverview/ProjectOverview'
import type { NavigationPage } from '../types/navigation'
import GlobalSettings from './Settings/GlobalSettings'
import type { Dispatch, SetStateAction } from 'react'

type AppViewProps = {
  activePage: NavigationPage
  selectedProject: Project | null
  onOpenProject: (project: Project) => void
  onBackToProjects: () => void
  onSaveProject: (changes: Partial<Project>) => void
  onDeleteProject: () => void
  projects: Project[]
  addProject: (project: Omit<Project, 'id'>) => Project
  categories: string[]
  setCategories: Dispatch<SetStateAction<string[]>>
}

export default function AppView({ activePage, selectedProject, onOpenProject, onBackToProjects, onSaveProject, onDeleteProject, projects, addProject, categories, setCategories }: AppViewProps) {
  if (selectedProject) {
    return <ProjectDetails project={selectedProject} onBack={onBackToProjects} onSave={onSaveProject} onDelete={onDeleteProject} categories={categories} />
  }

  if (activePage === 'projects') {
    return <ProjectOverview onOpenProject={onOpenProject} projects={projects} addProject={addProject} categories={categories} />
  }

  if (activePage === 'settings') return <GlobalSettings categories={categories} setCategories={setCategories} />

  return <Dashboard />
}
