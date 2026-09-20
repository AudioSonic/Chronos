import type { Project } from './Projects/projectTypes'
import Dashboard from './Dashboard/Dashboard'
import ProjectDetails from './Projects/ProjectDetails/ProjectDetails'
import ProjectOverview from './Projects/ProjectOverview/ProjectOverview'
import type { NavigationPage } from '../types/navigation'

type AppViewProps = {
  activePage: NavigationPage
  selectedProject: Project | null
  onOpenProject: (project: Project) => void
  onBackToProjects: () => void
}

export default function AppView({ activePage, selectedProject, onOpenProject, onBackToProjects }: AppViewProps) {
  if (selectedProject) {
    return <ProjectDetails project={selectedProject} onBack={onBackToProjects} />
  }

  if (activePage === 'projects') {
    return <ProjectOverview onOpenProject={onOpenProject} />
  }

  return <Dashboard />
}
