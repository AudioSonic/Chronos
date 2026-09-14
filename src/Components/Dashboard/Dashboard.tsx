import { FormEvent, type CSSProperties, useEffect, useMemo, useState } from 'react'
import './Dashboard.css'

type Task = {
  id: number
  title: string
  description: string
  startTime: string
  endTime: string
  completed: boolean
  investedSeconds: number
}

const initialTasks: Task[] = []

const formatDate = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const secondsBetween = (startTime: string, endTime: string) => {
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)
  const start = startHour * 3600 + startMinute * 60
  const end = endHour * 3600 + endMinute * 60
  return Math.max(0, end - start)
}

const formatDuration = (seconds: number) => `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
const formatInvestedTime = (seconds: number) => {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  return `${formatDuration(safeSeconds).slice(0, 5)}h`
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [form, setForm] = useState({ title: '', startTime: '08:00', endTime: '09:00', description: '' })
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null)
  const [openMenuTaskId, setOpenMenuTaskId] = useState<number | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const completed = useMemo(() => tasks.filter((task) => task.completed).length, [tasks])
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingTaskId(null)
    setForm({ title: '', startTime: '08:00', endTime: '09:00', description: '' })
  }

  const openEditDialog = (task: Task) => {
    setEditingTaskId(task.id)
    setForm({ title: task.title, startTime: task.startTime, endTime: task.endTime, description: task.description })
    setOpenMenuTaskId(null)
    setIsDialogOpen(true)
  }

  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.title.trim()) return
    setTasks((current) => {
      if (editingTaskId !== null) return current.map((task) => task.id === editingTaskId ? { ...task, title: form.title.trim(), description: form.description.trim(), startTime: form.startTime, endTime: form.endTime } : task).sort((a, b) => a.startTime.localeCompare(b.startTime))
      return [...current, { id: Date.now(), title: form.title.trim(), description: form.description.trim(), startTime: form.startTime, endTime: form.endTime, completed: false, investedSeconds: 0 }].sort((a, b) => a.startTime.localeCompare(b.startTime))
    })
    closeDialog()
  }

  const toggleTask = (id: number) => setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task))
  const removeTask = (id: number) => {
    setTasks((current) => current.filter((task) => task.id !== id))
    setOpenMenuTaskId(null)
  }
  const activeTask = tasks.find((task) => task.id === activeTaskId)

  useEffect(() => {
    if (!activeTask || !isTimerRunning) return
    const timer = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000)
    return () => window.clearInterval(timer)
  }, [activeTask, isTimerRunning])

  const startWorkMode = (id: number) => {
    setActiveTaskId(id)
    setElapsedSeconds(0)
    setIsTimerRunning(true)
  }

  const closeWorkMode = (completeTask = false) => {
    if (activeTaskId !== null && elapsedSeconds > 0) {
      setTasks((current) => current.map((task) => task.id === activeTaskId ? { ...task, investedSeconds: task.investedSeconds + elapsedSeconds, completed: completeTask ? true : task.completed } : task))
    } else if (activeTaskId !== null && completeTask) {
      setTasks((current) => current.map((task) => task.id === activeTaskId ? { ...task, completed: true } : task))
    }
    setActiveTaskId(null)
    setElapsedSeconds(0)
  }

  if (activeTask) {
    const plannedSeconds = secondsBetween(activeTask.startTime, activeTask.endTime)
    const timerProgress = plannedSeconds ? Math.min(elapsedSeconds / plannedSeconds * 100, 100) : 0
    const nextTask = tasks.find((task) => task.startTime > activeTask.startTime && task.id !== activeTask.id)
    return <section className="dashboard work-mode">
      <header className="work-mode-header"><button type="button" onClick={() => closeWorkMode()}>⌂ <span>Dashboard</span></button><span>›</span><strong>Work Mode</strong><time>{formatDate.format(new Date())}</time></header>
      <div className="work-layout">
        <section className="work-timer-panel"><p className="work-active-label"><i /> WORK MODE AKTIV</p><div className="work-ring" style={{ '--progress': `${timerProgress * 3.6}deg` } as CSSProperties}><div><strong>{formatDuration(elapsedSeconds)} <em>/</em> {formatDuration(plannedSeconds)}</strong><button type="button" aria-label={isTimerRunning ? 'Timer pausieren' : 'Timer fortsetzen'} onClick={() => setIsTimerRunning((running) => !running)}>{isTimerRunning ? 'Ⅱ' : '▶'}</button></div></div><div className="work-actions"><button type="button" onClick={() => setElapsedSeconds(0)}>↻ <span>Timer zurücksetzen</span></button><button type="button" onClick={() => closeWorkMode(true)}>✓ <span>Aufgabe abschließen</span></button><button type="button" onClick={() => closeWorkMode()}>••• <span>Work Mode beenden</span></button></div></section>
        <aside className="work-sidebar"><section className="work-info"><h2>Aktueller Task</h2><h3>{activeTask.title}</h3><p>{activeTask.description || 'Keine Beschreibung hinterlegt.'}</p><dl><div><dt>◷ <span>Geplant</span></dt><dd>{activeTask.startTime} – {activeTask.endTime} Uhr ({formatDuration(plannedSeconds).slice(0, 5)}h)</dd></div><div><dt>☷ <span>Status</span></dt><dd>{isTimerRunning ? 'Timer läuft' : 'Pausiert'}</dd></div></dl></section>{nextTask && <section className="next-task"><h2>Nächster Task</h2><strong>{nextTask.title}</strong><p>{nextTask.startTime} – {nextTask.endTime} Uhr</p></section>}</aside>
      </div>
    </section>
  }

  return <section className="dashboard">
    <header className="dashboard-header">
      <div><h1>Guten Morgen!</h1><p>Hier ist dein Tagesplan für heute. Bleib fokussiert.</p></div>
      <time>{formatDate.format(new Date())}</time>
    </header>

    <div className="planning-layout">
      <section className="daily-plan" aria-labelledby="daily-plan-heading">
        <div className="plan-heading"><div><span className="calendar-icon" aria-hidden="true">▣</span><h2 id="daily-plan-heading">Tagesplan</h2></div><button className="add-task-button" type="button" onClick={() => setIsDialogOpen(true)}><span>＋</span> Zeitraum hinzufügen</button></div>
        <div className="task-list">
          {tasks.length ? tasks.map((task, index) => <article className={`task-card ${task.completed ? 'is-completed' : ''}`} key={task.id}>
            <span className={`task-color task-color-${index % 6}`} />
            <div className="task-time"><time>{task.startTime}</time><time>{task.endTime}</time></div>
            <div className="task-details"><h3>{task.title}</h3>{task.description && <p>{task.description}</p>}</div>
            <button className="work-mode-button" type="button" onClick={() => startWorkMode(task.id)} aria-label={`Work Mode für ${task.title} starten`}>▶ <span>Work Mode starten</span></button>
            <label className="task-checkbox" title={task.completed ? 'Als offen markieren' : 'Als abgeschlossen markieren'}><input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} aria-label={`${task.title} als ${task.completed ? 'offen' : 'abgeschlossen'} markieren`} /><span>✓</span></label>
            <div className="task-options"><button className="task-options-button" type="button" aria-label={`Optionen für ${task.title}`} aria-expanded={openMenuTaskId === task.id} onClick={() => setOpenMenuTaskId((current) => current === task.id ? null : task.id)}>⋮</button>{openMenuTaskId === task.id && <div className="task-options-menu"><button type="button" onClick={() => openEditDialog(task)}>Aufgabe bearbeiten</button><button className="danger-option" type="button" onClick={() => removeTask(task.id)}>Aufgabe entfernen</button></div>}</div>
          </article>) : <div className="empty-plan"><span>✦</span><h3>Noch nichts geplant</h3><p>Füge deinen ersten Zeitraum für heute hinzu.</p></div>}
        </div>
      </section>

      <aside className="day-summary" aria-label="Tagesübersicht">
        <h2>Tagesübersicht</h2>
        <div className="progress-ring" style={{ '--progress': `${progress * 3.6}deg` } as CSSProperties}><div><strong>{completed} / {tasks.length}</strong><span>Abgeschlossen</span></div></div>
        <dl className="summary-list"><div><dt><i className="open-dot" />Offen</dt><dd>{tasks.length - completed}</dd></div><div><dt><i className="done-dot" />Abgeschlossen</dt><dd>{completed}</dd></div></dl>
        <div className="invested-times"><h3>Investierte Zeit</h3>{tasks.filter((task) => Number.isFinite(task.investedSeconds) && task.investedSeconds >= 1).map((task) => <div className="invested-time-row" key={task.id}><span>{task.title}</span><strong>{formatInvestedTime(task.investedSeconds)}</strong></div>)}</div>
      </aside>
    </div>

    {isDialogOpen && <div className="dialog-backdrop" role="presentation" onMouseDown={closeDialog}><section className="task-dialog" role="dialog" aria-modal="true" aria-labelledby="task-dialog-title" onMouseDown={(event) => event.stopPropagation()}>
      <div className="dialog-title"><span className="calendar-icon" aria-hidden="true">▣</span><h2 id="task-dialog-title">{editingTaskId === null ? 'Neuen Zeitraum hinzufügen' : 'Aufgabe bearbeiten'}</h2><button type="button" aria-label="Dialog schließen" onClick={closeDialog}>×</button></div>
      <form onSubmit={addTask}>
        <label>Titel<input autoFocus required maxLength={80} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="z. B. Chronos, Gaming, Sport, ..." /></label>
        <div className="time-fields"><label>Startzeit<input type="time" required value={form.startTime} onChange={(event) => setForm({ ...form, startTime: event.target.value })} /></label><label>Endzeit<input type="time" required value={form.endTime} onChange={(event) => setForm({ ...form, endTime: event.target.value })} /></label></div>
        <label>Beschreibung <span>(optional)</span><textarea maxLength={200} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="z. B. Woran genau möchtest du arbeiten?" /><small>{form.description.length} / 200</small></label>
        <div className="dialog-actions"><button className="cancel-button" type="button" onClick={closeDialog}>Abbrechen</button><button className="submit-button" type="submit">{editingTaskId === null ? 'Hinzufügen' : 'Speichern'}</button></div>
      </form>
    </section></div>}
  </section>
}
