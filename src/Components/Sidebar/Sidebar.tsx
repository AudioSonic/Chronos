import './Sidebar.css'
import IconHome from '../../Assets/icon_home.svg'
import IconProject from '../../Assets/icon_project.svg'
import ChronosLogo from '../../Assets/Chronos_Logo.png'
import type { NavigationPage } from '../../types/navigation'

type NavigationItem = {
  label: string
  icon: string
}

type SidebarProps = {
  activePage: NavigationPage
  onNavigate: (page: NavigationPage) => void
}

const navigation: NavigationItem[] = [
  { label: 'Dashboard', icon: IconHome },
  { label: 'Projekte', icon: IconProject },
]

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Hauptnavigation">
      <div className="sidebar-brand">
        <img src={ChronosLogo} alt="Chronos" />
      </div>

      <nav className="sidebar-navigation">
        {navigation.map((item, index) => (
          <a
            className={`navigation-item ${
              activePage === (index === 0 ? 'dashboard' : 'projects')
                ? 'is-active'
                : ''
            }`}
            href={`#${index === 0 ? 'dashboard' : 'projects'}`}
            key={item.label}
            onClick={(event) => {
              event.preventDefault()
              onNavigate(index === 0 ? 'dashboard' : 'projects')
            }}
          >
            <span className="navigation-icon" aria-hidden="true">
              <img src={item.icon} alt="" />
            </span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <a className={`navigation-item settings-item ${activePage === 'settings' ? 'is-active' : ''}`} href="#settings" onClick={(event) => { event.preventDefault(); onNavigate('settings') }}>
        <span className="navigation-icon" aria-hidden="true">⚙</span>
        <span>Einstellungen</span>
      </a>
    </aside>
  )
}
