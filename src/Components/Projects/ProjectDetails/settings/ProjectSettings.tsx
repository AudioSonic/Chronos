import type { Project } from '../../projectTypes'
import './ProjectSettings.css'

export default function ProjectSettings({ project }: { project: Project }) {
  return <div className="project-settings">
    <div className="settings-main">
      <section className="settings-card"><h2>▤ &nbsp; Projektinformationen</h2><label><span className="field-label">Projektname <em>*</em></span><input defaultValue={project.name} /></label><label><span className="field-label">Beschreibung <em>*</em></span><textarea defaultValue={project.description} rows={4} /></label></section>
      <section className="settings-card"><h2>◎ &nbsp; Projektziel</h2><label><span className="field-label">Ziel</span><textarea defaultValue="Eine vollständige Plattform entwickeln, mit der ich Projekte strukturiert planen, verfolgen und langfristig weiterentwickeln kann." rows={4} /></label></section>
      <section className="settings-card"><h2>◇ &nbsp; Kategorie und Tags</h2><div className="settings-two-columns"><label><span className="field-label">Kategorie <em>*</em></span><select defaultValue="Entwicklung"><option>Entwicklung</option><option>Privat</option><option>Arbeit</option></select></label><label><span className="field-label">Tags</span><div className="settings-tags">{project.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div><input placeholder="Tag hinzufügen ..." /></label></div></section>
    </div>
    <aside className="settings-side"><section className="settings-card"><h2>▧ &nbsp; Projektbild</h2><div className="settings-image"><strong>✦ {project.name}</strong><span>Planen. Umsetzen. Wachsen.</span></div><div className="settings-actions"><button type="button">▧ Bild ändern</button><button type="button">♜ Bild entfernen</button></div></section><section className="settings-card"><h2>⚙ &nbsp; Projektverwaltung</h2><button className="management-button" type="button">⇧ &nbsp; Projekt exportieren</button><button className="management-button" type="button">▣ &nbsp; Projekt duplizieren</button><button className="management-button muted" type="button">▣ &nbsp; Projekt archivieren</button><button className="management-button danger" type="button">♧ &nbsp; Projekt löschen</button><p className="warning">Das Löschen kann nicht rückgängig gemacht werden.</p></section></aside>
  </div>
}
