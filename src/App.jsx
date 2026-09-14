import { useState } from 'react'
import './App.css'
import Sidebar from './Components/Sidebar/Sidebar'
import ProjectOverview from './Components/ProjectOverview/ProjectOverview'
import ProjectDetails from './Components/ProjectDetails/ProjectDetails'
import Dashboard from './Components/Dashboard/Dashboard'

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [selectedProject, setSelectedProject] = useState(null)

  const handleNavigate = (page) => {
    setActivePage(page)
    if (page === 'dashboard') setSelectedProject(null)
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />

      <main className="content" aria-label="Inhaltsbereich">
        {activePage === 'projects' && !selectedProject ? <ProjectOverview onOpenProject={setSelectedProject} /> : selectedProject ? <ProjectDetails project={selectedProject} onBack={() => setSelectedProject(null)} /> : <Dashboard />}
      </main>
    </div>
  )
}

export default App
