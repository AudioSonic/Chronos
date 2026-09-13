const filters = [{ label: 'Alle' }, { label: 'Offen', count: 1 }, { label: 'Geplant', count: 0 }, { label: 'Pausiert', count: 0 }, { label: 'Abgeschlossen', count: 0 }]

export default function ProjectFilters() {
  return <div className="project-filters" role="tablist" aria-label="Projektstatus">{filters.map((filter, index) => <button className={`filter-button ${index === 0 ? 'is-active' : ''}`} type="button" role="tab" aria-selected={index === 0} key={filter.label}>{filter.label}{filter.count !== undefined && <span>{filter.count}</span>}</button>)}</div>
}
