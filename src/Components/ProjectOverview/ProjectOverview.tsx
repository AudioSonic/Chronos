import ProjectCard from './ProjectCard'
import ProjectFilters from './ProjectFilters'
import './ProjectOverview.css'

export type Project = {
  name: string
  description: string
  tags: string[]
  progress: number
  tasks: string
  dates: string
  status: 'Offen' | 'Geplant' | 'Pausiert'
}

export const exampleProject: Project = {
  name: 'Chronos', description: 'Eine persönliche Plattform für Projekte, Aufgaben und Fortschritt.',
  tags: ['React', 'Frontend', 'Planung'], progress: 24, tasks: '6 / 25 Tasks', dates: '13.09.2026 – offen', status: 'Offen',
}

export default function ProjectOverview({ onOpenProject }: { onOpenProject: (project: Project) => void }) {
  return <section className="project-overview">
    <header className="overview-header"><div><h1>Projekte</h1><p>Deine Projekte im Überblick. Wähle ein Projekt, um loszulegen.</p></div><div className="overview-actions"><label className="project-search"><span>⌕</span><input type="search" placeholder="Projekte suchen ..." aria-label="Projekte suchen" /><kbd>Ctrl K</kbd></label><button className="primary-button" type="button">＋ Neues Projekt</button></div></header>
    <ProjectFilters />
    <div className="project-toolbar"><button className="sort-button" type="button">☷ &nbsp; Sortieren: Zuletzt bearbeitet⌄</button><div className="view-buttons"><button className="view-button is-selected" type="button">▦</button><button className="view-button" type="button">☷</button></div></div>
    <div className="project-grid"><ProjectCard project={exampleProject} onOpen={() => onOpenProject(exampleProject)} /></div>
  </section>
}
