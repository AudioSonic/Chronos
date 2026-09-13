import './Sidebar.css'

type NavigationItem = {
  label: string
  icon: string
}

type SidebarProps = {
  activePage: 'dashboard' | 'projects'
  onNavigate: (page: 'dashboard' | 'projects') => void
}

const navigation: NavigationItem[] = [
  { label: 'Dashboard', icon: '⌂' },
  { label: 'Projekte', icon: '▣' },
]

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Hauptnavigation">
      <div className="sidebar-brand">
        <span className="brand-mark" aria-hidden="true">✦</span>
        <span>Chronos</span>
      </div>

      <nav className="sidebar-navigation">
        {navigation.map((item, index) => (
          <a className={`navigation-item ${activePage === (index === 0 ? 'dashboard' : 'projects') ? 'is-active' : ''}`} href={`#${index === 0 ? 'dashboard' : 'projects'}`} key={item.label} onClick={(event) => { event.preventDefault(); onNavigate(index === 0 ? 'dashboard' : 'projects') }}>
            <span className="navigation-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <a className="navigation-item settings-item" href="#">
        <span className="navigation-icon" aria-hidden="true">⚙</span>
        <span>Einstellungen</span>
      </a>
    </aside>
  )
}
