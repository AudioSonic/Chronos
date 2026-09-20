import { useState, type FormEvent } from 'react'
import type { Project } from '../../projectTypes'
import './ProjectMilestones.css'
import MilestoneModal, { type MilestoneForm } from './MilestoneModal'
import type { Milestone } from '../../../../domain/milestone'
import { milestoneStorage } from '../../../../services/storage/milestoneStorage'
import { taskStorage } from '../../../../services/storage/taskStorage'
import useMilestones from '../../../../hooks/useMilestones'
import type { Task } from '../../../../domain/task'
import useDialog from '../../../../hooks/useDialog'
const date = (v: string) => v ? new Intl.DateTimeFormat('de-DE').format(new Date(`${v}T12:00:00`)) : '–'
const empty: MilestoneForm = { title: '', description: '', startDate: '', endDate: '', status: 'Geplant' }
export default function ProjectMilestones({ project }: { project: Project }) {
  const { milestones: items, setMilestones: setItems } = useMilestones(project.id)
  const [form, setForm] = useState(empty); const [menu, setMenu] = useState<number | null>(null)
  const { isOpen: open, editingId: editing, openCreate, openEdit, close } = useDialog<number>()
  const save = (next: Milestone[]) => { milestoneStorage.save([...milestoneStorage.read().filter((m) => m.projectId !== project.id), ...next]); setItems(next) }
  const submit = (e: FormEvent) => { e.preventDefault(); if (!form.title.trim()) return; const next = editing === null ? [...items, { ...form, title: form.title.trim(), id: Date.now(), projectId: project.id }] : items.map((m) => m.id === editing ? { ...m, ...form, title: form.title.trim() } : m); save(next); close() }
  const edit = (m: Milestone) => { openEdit(m.id); setForm({ title: m.title, description: m.description, startDate: m.startDate, endDate: m.endDate, status: m.status || 'Geplant' }); setMenu(null) }
  const remove = (id: number) => { const choice = window.prompt('Milestone löschen: 1 = Aufgaben behalten, 2 = Aufgaben ebenfalls löschen'); if (choice !== '1' && choice !== '2') return; const tasks = taskStorage.read(); taskStorage.save(choice === '2' ? tasks.filter((t) => t.milestoneId !== id) : tasks.map((t) => t.milestoneId === id ? { ...t, milestoneId: undefined } : t)); save(items.filter((m) => m.id !== id)); setMenu(null) }
  const rows = items.map((milestone) => {
    const tasks = taskStorage.read().filter((task: Task) => task.projectId === project.id && task.milestoneId === milestone.id)
    const completedTasks = tasks.filter((task) => task.completed).length
    return { milestone, totalTasks: tasks.length, completedTasks, progress: tasks.length ? Math.round(completedTasks / tasks.length * 100) : 0 }
  })
  return <div className="milestone-content"><div className="project-task-heading"><div><h2>Milestones</h2><p>Wichtige Meilensteine deines Projekts im Überblick.</p></div><button className="primary-button" type="button" onClick={() => { setForm(empty); openCreate() }}>＋ Milestone hinzufügen</button></div><div className="milestone-table-wrap"><table className="milestone-table"><thead><tr><th>#</th><th>Name</th><th>Zeitraum</th><th>Status</th><th>Fortschritt</th><th>Tasks</th><th>Optionen</th></tr></thead><tbody>{rows.length ? rows.map(({ milestone: m, totalTasks, completedTasks, progress }, i) => <tr key={m.id}><td>{i + 1}</td><td><strong>{m.title}</strong>{m.description && <small>{m.description}</small>}</td><td>{date(m.startDate)} – {date(m.endDate)}</td><td><span className={`milestone-status status-${m.status.toLowerCase()}`}>{m.status}</span></td><td><div className="milestone-progress"><span style={{ width: `${progress}%` }} /></div><small>{progress} %</small></td><td>{completedTasks} / {totalTasks}</td><td><div className="milestone-options"><button type="button" onClick={() => setMenu(menu === m.id ? null : m.id)}>⋮</button>{menu === m.id && <div className="milestone-actions"><button type="button" onClick={() => edit(m)}>Bearbeiten</button><button type="button" className="danger-option" onClick={() => remove(m.id)}>Löschen</button></div>}</div></td></tr>) : <tr><td colSpan={7} className="milestone-empty">Noch keine Milestones vorhanden.</td></tr>}</tbody></table></div>{open && <MilestoneModal form={form} setForm={setForm} editing={editing} onSubmit={submit} onClose={close} />}</div>
}
