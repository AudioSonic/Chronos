import { useState } from 'react'
import './App.css'
import Sidebar from './Components/Sidebar/Sidebar'
import AppView from './Components/AppView'
import type { Project } from './Components/Projects/projectTypes'
import type { NavigationPage } from './types/navigation'

function App() {
  const [activePage, setActivePage] = useState<NavigationPage>('dashboard')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

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
        />
      </main>
    </div>
  )
}

export default App
