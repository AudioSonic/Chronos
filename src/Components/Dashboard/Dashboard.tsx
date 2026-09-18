import { FormEvent, type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import "./Dashboard.css"
import IconCalender from '../../Assets/icon_calender.svg'
import IconToday from '../../Assets/icon_today.svg'
import IconFullScreen from '../../Assets/icon full screen.svg'

type Task = {
  id: number
  date: string
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

const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

const monthFormatter = new Intl.DateTimeFormat('de-DE', { month: 'long' })
const monthYearFormatter = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' })
const shortDateFormatter = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })

const startOfCalendar = (date: Date) => {
  const first = new Date(date.getFullYear(), date.getMonth(), 1)
  const mondayOffset = (first.getDay() + 6) % 7
  first.setDate(first.getDate() - mondayOffset)
  return first
}

type CalendarProps = {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const today = new Date()
  const [displayMonth, setDisplayMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))
  useEffect(() => {
    setDisplayMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))
  }, [selectedDate])
  const calendarStart = startOfCalendar(displayMonth)
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart)
    date.setDate(calendarStart.getDate() + index)
    return date
  })
  const selectedKey = selectedDate.toDateString()

  const changeMonth = (offset: number) => setDisplayMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1))
  const goToToday = () => {
    const current = new Date()
    setDisplayMonth(new Date(current.getFullYear(), current.getMonth(), 1))
    onDateSelect(new Date(current.getFullYear(), current.getMonth(), current.getDate()))
  }

  return <section className="calendar-panel" aria-label="Kalender">
    <div className="calendar-toolbar">
      <div><span className="calendar-icon" aria-hidden="true"><img src={IconCalender} alt="" /></span><div><h2>Kalender</h2></div></div>
      <button className="calendar-today-button" type="button" onClick={goToToday}>Heute</button>
    </div>
    <div className="calendar-navigation">
      <button type="button" aria-label="Vorheriger Monat" onClick={() => changeMonth(-1)}>‹</button>
      <strong>{monthYearFormatter.format(displayMonth)}</strong>
      <button type="button" aria-label="Nächster Monat" onClick={() => changeMonth(1)}>›</button>
    </div>
    <div className="calendar-grid" role="grid">
      {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => <span className="calendar-weekday" key={day}>{day}</span>)}
      {days.map((date) => {
        const isCurrentMonth = date.getMonth() === displayMonth.getMonth()
        const isToday = date.toDateString() === today.toDateString()
        const isSelected = date.toDateString() === selectedKey
        return <button className={`calendar-day ${isCurrentMonth ? '' : 'is-outside'} ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`} type="button" key={date.toISOString()} aria-label={date.toLocaleDateString('de-DE')} aria-pressed={isSelected} onClick={() => onDateSelect(date)}>{date.getDate()}</button>
      })}
    </div>
  </section>
}

export default function Dashboard() {
  const today = new Date()
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [selectedDay, setSelectedDay] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()))
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [form, setForm] = useState({ title: '', date: dateKey(selectedDay), startTime: '08:00', endTime: '09:00', description: '' })
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null)
  const [openMenuTaskId, setOpenMenuTaskId] = useState<number | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [isTimerFullscreen, setIsTimerFullscreen] = useState(false)
  const timerPanelRef = useRef<HTMLElement>(null)
  const selectedDateKey = dateKey(selectedDay)
  const visibleTasks = useMemo(() => tasks.filter((task) => task.date === selectedDateKey), [tasks, selectedDateKey])
  const completed = useMemo(() => visibleTasks.filter((task) => task.completed).length, [visibleTasks])
  const progress = visibleTasks.length ? Math.round((completed / visibleTasks.length) * 100) : 0

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingTaskId(null)
    setForm({ title: '', date: dateKey(selectedDay), startTime: '08:00', endTime: '09:00', description: '' })
  }

  const openEditDialog = (task: Task) => {
    setEditingTaskId(task.id)
    setForm({ title: task.title, date: task.date, startTime: task.startTime, endTime: task.endTime, description: task.description })
    setOpenMenuTaskId(null)
    setIsDialogOpen(true)
  }

  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.title.trim()) return
    setTasks((current) => {
      if (editingTaskId !== null) return current.map((task) => task.id === editingTaskId ? { ...task, date: form.date, title: form.title.trim(), description: form.description.trim(), startTime: form.startTime, endTime: form.endTime } : task).sort((a, b) => a.startTime.localeCompare(b.startTime))
      return [...current, { id: Date.now(), date: form.date, title: form.title.trim(), description: form.description.trim(), startTime: form.startTime, endTime: form.endTime, completed: false, investedSeconds: 0 }].sort((a, b) => a.startTime.localeCompare(b.startTime))
    })
    closeDialog()
  }

  const toggleTask = (id: number) => setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task))
  const removeTask = (id: number) => {
    setTasks((current) => current.filter((task) => task.id !== id))
    setOpenMenuTaskId(null)
  }
  const activeTask = tasks.find((task) => task.id === activeTaskId)

  const changeSelectedDay = (offset: number) => setSelectedDay((current) => {
    const next = new Date(current)
    next.setDate(next.getDate() + offset)
    return next
  })

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

  const toggleTimerFullscreen = async () => {
    if (!timerPanelRef.current) return
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    } else {
      await timerPanelRef.current.requestFullscreen()
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => setIsTimerFullscreen(document.fullscreenElement === timerPanelRef.current)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  if (activeTask) {
    const plannedSeconds = secondsBetween(activeTask.startTime, activeTask.endTime)
    const timerProgress = plannedSeconds ? Math.min(elapsedSeconds / plannedSeconds * 100, 100) : 0
    const nextTask = tasks.find((task) => task.startTime > activeTask.startTime && task.id !== activeTask.id)
    return <section className="dashboard work-mode">
      <header className="work-mode-header"><button type="button" onClick={() => closeWorkMode()}>⌂ <span>Dashboard</span></button><span>›</span><strong>Work Mode</strong><time>{formatDate.format(new Date())}</time></header>
      <div className="work-layout">
        <section className="work-timer-panel" ref={timerPanelRef}><button className="timer-fullscreen-button" type="button" onClick={toggleTimerFullscreen} aria-label={isTimerFullscreen ? 'Fullscreen verlassen' : 'Timer im Fullscreen öffnen'} title={isTimerFullscreen ? 'Fullscreen verlassen' : 'Fullscreen öffnen'}><img src={IconFullScreen} alt="" /></button><p className="work-active-label"><i /> WORK MODE AKTIV</p><div className="work-ring" style={{ '--progress': `${timerProgress * 3.6}deg` } as CSSProperties}><div><strong>{formatDuration(elapsedSeconds)} <em>/</em> {formatDuration(plannedSeconds)}</strong><button type="button" aria-label={isTimerRunning ? 'Timer pausieren' : 'Timer fortsetzen'} onClick={() => setIsTimerRunning((running) => !running)}>{isTimerRunning ? 'Ⅱ' : '▶'}</button></div></div><div className="work-actions"><button type="button" onClick={() => setElapsedSeconds(0)}>↻ <span>Timer zurücksetzen</span></button><button type="button" onClick={() => closeWorkMode(true)}>✓ <span>Aufgabe abschließen</span></button><button type="button" onClick={() => closeWorkMode()}>••• <span>Work Mode beenden</span></button></div></section>
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
        <div className="plan-heading"><div><span className="calendar-icon" aria-hidden="true"><img src={IconToday} alt="" /></span><h2 id="daily-plan-heading">Tagesplan</h2></div><div className="plan-heading-actions"><div className="day-navigation" aria-label="Tag auswählen"><button type="button" aria-label="Vorheriger Tag" onClick={() => changeSelectedDay(-1)}>‹</button><time dateTime={selectedDay.toISOString().slice(0, 10)}>{shortDateFormatter.format(selectedDay)}</time><button type="button" aria-label="Nächster Tag" onClick={() => changeSelectedDay(1)}>›</button></div><button className="add-task-button" type="button" onClick={() => { setForm({ title: '', date: selectedDateKey, startTime: '08:00', endTime: '09:00', description: '' }); setEditingTaskId(null); setIsDialogOpen(true) }}><span>＋</span> Aufgabe hinzufügen</button></div></div>
        <div className="task-list">
          {visibleTasks.length ? visibleTasks.map((task, index) => <article className={`task-card ${task.completed ? 'is-completed' : ''}`} key={task.id}>
            <span className={`task-color task-color-${index % 6}`} />
            <div className="task-time"><time>{task.startTime}</time><time>{task.endTime}</time></div>
            <div className="task-details"><h3>{task.title}</h3>{task.description && <p>{task.description}</p>}</div>
            <button className="work-mode-button" type="button" onClick={() => startWorkMode(task.id)} aria-label={`Work Mode für ${task.title} starten`}>▶ <span>Work Mode starten</span></button>
            <label className="task-checkbox" title={task.completed ? 'Als offen markieren' : 'Als abgeschlossen markieren'}><input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} aria-label={`${task.title} als ${task.completed ? 'offen' : 'abgeschlossen'} markieren`} /><span>✓</span></label>
            <div className="task-options"><button className="task-options-button" type="button" aria-label={`Optionen für ${task.title}`} aria-expanded={openMenuTaskId === task.id} onClick={() => setOpenMenuTaskId((current) => current === task.id ? null : task.id)}>⋮</button>{openMenuTaskId === task.id && <div className="task-options-menu"><button type="button" onClick={() => openEditDialog(task)}>Aufgabe bearbeiten</button><button className="danger-option" type="button" onClick={() => removeTask(task.id)}>Aufgabe entfernen</button></div>}</div>
          </article>) : <div className="empty-plan"><span>✦</span><h3>Noch nichts geplant</h3><p>Füge deinen ersten Zeitraum für heute hinzu.</p></div>}
        </div>
      </section>

      <aside className="planning-sidebar">
        <Calendar selectedDate={selectedDay} onDateSelect={setSelectedDay} />
        <section className="day-summary" aria-label="Tagesübersicht">
          <h2>Tagesübersicht</h2>
        <div className="progress-ring" style={{ '--progress': `${progress * 3.6}deg` } as CSSProperties}><div><strong>{completed} / {visibleTasks.length}</strong><span>Abgeschlossen</span></div></div>
        <dl className="summary-list"><div><dt><i className="open-dot" />Offen</dt><dd>{visibleTasks.length - completed}</dd></div><div><dt><i className="done-dot" />Abgeschlossen</dt><dd>{completed}</dd></div></dl>
        <div className="invested-times"><h3>Investierte Zeit</h3>{visibleTasks.filter((task) => Number.isFinite(task.investedSeconds) && task.investedSeconds >= 1).map((task) => <div className="invested-time-row" key={task.id}><span>{task.title}</span><strong>{formatInvestedTime(task.investedSeconds)}</strong></div>)}</div>
        </section>
      </aside>
    </div>

    {isDialogOpen && <div className="dialog-backdrop" role="presentation" onMouseDown={closeDialog}><section className="task-dialog" role="dialog" aria-modal="true" aria-labelledby="task-dialog-title" onMouseDown={(event) => event.stopPropagation()}>
      <div className="dialog-title"><span className="calendar-icon" aria-hidden="true">▣</span><h2 id="task-dialog-title">{editingTaskId === null ? 'Neue Aufgabe hinzufügen' : 'Aufgabe bearbeiten'}</h2><button type="button" aria-label="Dialog schließen" onClick={closeDialog}>×</button></div>
      <form onSubmit={addTask}>
        <label>Titel<input autoFocus required maxLength={80} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="z. B. Chronos, Gaming, Sport, ..." /></label>
        <label>Datum<input type="date" required value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label>
        <div className="time-fields"><label>Startzeit<input type="time" required value={form.startTime} onChange={(event) => setForm({ ...form, startTime: event.target.value })} /></label><label>Endzeit<input type="time" required value={form.endTime} onChange={(event) => setForm({ ...form, endTime: event.target.value })} /></label></div>
        <label>Beschreibung <span>(optional)</span><textarea maxLength={200} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="z. B. Woran genau möchtest du arbeiten?" /><small>{form.description.length} / 200</small></label>
        <div className="dialog-actions"><button className="cancel-button" type="button" onClick={closeDialog}>Abbrechen</button><button className="submit-button" type="submit">{editingTaskId === null ? 'Hinzufügen' : 'Speichern'}</button></div>
      </form>
    </section></div>}
  </section>
}
