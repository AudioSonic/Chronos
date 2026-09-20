import type { Task } from './Dashboard'

type Project = { id: number; name: string }
const format = (date: string) => new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${date}T12:00:00`))

type ProjectTaskPoolProps = {
  tasks: Task[]
  projects: Project[]
  onPlan: (id: number) => void
}

export default function ProjectTaskPool({ tasks, projects, onPlan }: ProjectTaskPoolProps) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
  const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 8)
  const groups = { 'Überfällig': [] as Task[], Heute: [] as Task[], Demnächst: [] as Task[], 'Ohne Fälligkeit': [] as Task[] }
  tasks.filter((task) => task.projectId !== undefined && !task.completed && !task.plannedForDate).forEach((task) => { if (!task.dueDate) groups['Ohne Fälligkeit'].push(task); else { const due = new Date(`${task.dueDate}T12:00:00`); const dueDay = new Date(due); dueDay.setHours(0, 0, 0, 0); if (dueDay < today) groups['Überfällig'].push(task); else if (dueDay.getTime() === today.getTime()) groups.Heute.push(task); else if (dueDay >= tomorrow && dueDay < nextWeek) groups.Demnächst.push(task); } })
  return <section className="project-task-pool"><div className="project-task-pool-heading"><h2>Projektaufgaben</h2><p>Plane deine nächsten Aufgaben für den Tagesplan.</p></div>{Object.entries(groups).map(([name, items]) => <section className={`project-task-group group-${name.toLowerCase().replace('ü', 'u')}`} key={name}><header><h3>{name}</h3><span>{items.length}</span></header>{items.length ? items.map((task) => <article className="project-pool-task" key={task.id}><div className="pool-task-main"><h4>{task.title}</h4><p>{projects.find((project) => project.id === task.projectId)?.name || 'Projekt'} · {task.dueDate ? format(task.dueDate) : 'Kein Fälligkeitsdatum'}</p></div><button type="button" onClick={() => onPlan(task.id)}>Für heute einplanen</button></article>) : <p className="project-task-group-empty">Keine Aufgaben</p>}</section>)}</section>
}
