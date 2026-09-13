export default function ProjectTabs({ tabs, activeTab, onChange }: { tabs: string[]; activeTab: string; onChange: (tab: string) => void }) {
  return <nav className="project-tabs" aria-label="Projektbereiche">{tabs.map((tab) => <button className={activeTab === tab ? 'is-active' : ''} type="button" onClick={() => onChange(tab)} key={tab}>{tab}</button>)}</nav>
}
