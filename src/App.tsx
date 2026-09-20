import { useState } from 'react'
import './App.css'
import Sidebar from './Components/Sidebar/Sidebar'
import AppView from './Components/AppView'
import type { Project } from './Components/Projects/projectTypes'
import type { NavigationPage } from './types/navigation'
import useProjects from './hooks/useProjects'
import useCategories from './hooks/useCategories'

function App() {
  const [activePage, setActivePage] = useState<NavigationPage>('dashboard')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const { projects, addProject, updateProject, removeProject } = useProjects()
  const { categories, setCategories } = useCategories()

  const handleSaveProject = (changes: Partial<Project>) => {
    if (!selectedProject) return
    updateProject(selectedProject.id, changes)
    setSelectedProject({ ...selectedProject, ...changes })
  }

  const handleDeleteProject = () => {
    if (!selectedProject) return
    removeProject(selectedProject.id)
    setSelectedProject(null)
  }

  const handleNavigate = (page: NavigationPage) => {
    setActivePage(page)
    if (page === 'dashboard') setSelectedProject(null)
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <main className="content" aria-label="Inhaltsbereich">
        <AppView
          activePage={activePage}
          selectedProject={selectedProject}
          onOpenProject={setSelectedProject}
          onBackToProjects={() => setSelectedProject(null)}
          onSaveProject={handleSaveProject}
          onDeleteProject={handleDeleteProject}
          projects={projects}
          addProject={addProject}
          categories={categories}
          setCategories={setCategories}
        />
      </main>
    </div>
  )
}

export default App
