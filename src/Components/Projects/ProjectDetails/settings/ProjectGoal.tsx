import type { Project } from '../../projectTypes'
export default function ProjectGoal({ project }: { project: Project }) { return <section className="settings-card"><h2>◎ &nbsp; Projektziel</h2><label><span className="field-label">Ziel</span><textarea name="goal" defaultValue={project.goal ?? ''} rows={4} /></label></section> }
