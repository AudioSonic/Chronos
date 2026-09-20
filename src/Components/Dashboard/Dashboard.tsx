import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import './Dashboard.css'
import IconToday from '../../Assets/icon_today.svg'
import ProjectTaskPool from './ProjectTaskPool'
import CalendarComponent from './Calendar'
import TaskList from './TaskList'
import DaySummary from './DaySummary'
import WorkMode from './WorkMode'
import TaskDialog, { type TaskForm } from './TaskDialog'
import useTasks from './useTasks'
import type { Task } from '../../domain/task'
import {
  dateKey,
  formatDate,
  matchesRecurrence,
  secondsBetween,
  shortDateFormatter,
} from './dashboardUtils'

export type { Task } from '../../domain/task'

export default function Dashboard() {
  const today = new Date()
  const { tasks, setTasks } = useTasks()
  const [selectedDay, setSelectedDay] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate()),
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [form, setForm] = useState<TaskForm>({
    title: '',
    date: dateKey(selectedDay),
    endDate: '',
    startTime: '',
    endTime: '',
    description: '',
    repeats: false,
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom',
    weekdays: [] as number[],
  })
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null)
  const [openMenuTaskId, setOpenMenuTaskId] = useState<number | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [isTimerFullscreen, setIsTimerFullscreen] = useState(false)
  const timerPanelRef = useRef<HTMLElement>(null)
  const selectedDateKey = dateKey(selectedDay)
  const visibleTasks = useMemo(
    () => tasks.filter((task) => matchesRecurrence(task, selectedDateKey)),
    [tasks, selectedDateKey],
  )
  const completed = useMemo(() => visibleTasks.filter((task) => task.completed).length, [visibleTasks])
  const progress = visibleTasks.length
    ? Math.round((completed / visibleTasks.length) * 100)
    : 0

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingTaskId(null)
    setForm({ title: '', date: dateKey(selectedDay), endDate: '', startTime: '', endTime: '', description: '', repeats: false, frequency: 'weekly', weekdays: [] })
  }

  const openEditDialog = (task: Task) => {
    setEditingTaskId(task.id)
    setForm({ title: task.title, date: task.date ?? dateKey(selectedDay), endDate: task.recurrence?.endDate ?? '', startTime: task.startTime, endTime: task.endTime, description: task.description, repeats: Boolean(task.recurrence), frequency: task.recurrence?.frequency ?? 'weekly', weekdays: task.recurrence?.weekdays ?? [] })
    setOpenMenuTaskId(null)
    setIsDialogOpen(true)
  }

  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.title.trim()) return
    setTasks((current) => {
      const recurrence = form.repeats ? { frequency: form.frequency, startDate: form.date, ...(form.endDate ? { endDate: form.endDate } : {}), ...(form.frequency === 'custom' ? { weekdays: form.weekdays } : {}) } : undefined
      if (editingTaskId !== null) return current.map((task) => task.id === editingTaskId ? { ...task, date: form.date, recurrence, title: form.title.trim(), description: form.description.trim(), startTime: form.startTime, endTime: form.endTime } : task).sort((a, b) => a.startTime.localeCompare(b.startTime))
      return [...current, { id: Date.now(), date: form.date, recurrence, title: form.title.trim(), description: form.description.trim(), startTime: form.startTime, endTime: form.endTime, completed: false, investedSeconds: 0 }].sort((a, b) => a.startTime.localeCompare(b.startTime))
    })
    closeDialog()
  }

  const toggleTask = (id: number) => setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task))
  const planProjectTask = (id: number) => setTasks((current) => current.map((task) => task.id === id ? { ...task, plannedForDate: dateKey(new Date()) } : task))
  const removeProjectTaskFromPlan = (id: number) => setTasks((current) => current.map((task) => task.id === id ? { ...task, plannedForDate: undefined } : task))
  const removeTask = (id: number) => {
    setTasks((current) => current.filter((task) => task.id !== id))
    setOpenMenuTaskId(null)
  }
  const activeTask = tasks.find((task) => task.id === activeTaskId)
  const projectNames = new Map<number, string>()
  const milestoneNames = new Map<number, string>()
  try {
    const projects = JSON.parse(localStorage.getItem('chronos.projects') || '[]') as { id: number; name: string }[]
    const milestones = JSON.parse(localStorage.getItem('chronos.milestones') || '[]') as { id: number; title: string }[]
    projects.forEach((project) => projectNames.set(project.id, project.name))
    milestones.forEach((milestone) => milestoneNames.set(milestone.id, milestone.title))
  } catch { /* Ungültige optionale Metadaten werden ignoriert. */ }

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

  useEffect(() => {
    if (!isDialogOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [isDialogOpen])

  if (activeTask) {
    const plannedSeconds = secondsBetween(activeTask.startTime, activeTask.endTime)
    const timerProgress = plannedSeconds
      ? Math.min((elapsedSeconds / plannedSeconds) * 100, 100)
      : 0
    const nextTask = tasks.find(
      (task) => task.startTime > activeTask.startTime && task.id !== activeTask.id,
    )

    return (
      <WorkMode
        activeTask={activeTask}
        nextTask={nextTask}
        elapsedSeconds={elapsedSeconds}
        plannedSeconds={plannedSeconds}
        timerProgress={timerProgress}
        isTimerRunning={isTimerRunning}
        isTimerFullscreen={isTimerFullscreen}
        timerPanelRef={timerPanelRef}
        onClose={() => closeWorkMode()}
        onToggleTimer={() => setIsTimerRunning((running) => !running)}
        onResetTimer={() => setElapsedSeconds(0)}
        onCompleteTask={() => closeWorkMode(true)}
        onToggleFullscreen={toggleTimerFullscreen}
      />
    )

  }

  return (
    <section className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Guten Morgen!</h1>
          <p>Hier ist dein Tagesplan für heute. Bleib fokussiert.</p>
        </div>
        <time>{formatDate.format(new Date())}</time>
      </header>

      <div className="planning-layout">
        <div className="planning-main-column">
          <section className="daily-plan" aria-labelledby="daily-plan-heading">
            <div className="plan-heading">
              <div>
                <span className="calendar-icon" aria-hidden="true">
                  <img src={IconToday} alt="" />
                </span>
                <h2 id="daily-plan-heading">Tagesplan</h2>
              </div>
              <div className="plan-heading-actions">
                <div className="day-navigation" aria-label="Tag auswählen">
                  <button
                    type="button"
                    aria-label="Vorheriger Tag"
                    onClick={() => changeSelectedDay(-1)}
                  >
                    ‹
                  </button>
                  <time dateTime={selectedDay.toISOString().slice(0, 10)}>
                    {shortDateFormatter.format(selectedDay)}
                  </time>
                  <button
                    type="button"
                    aria-label="Nächster Tag"
                    onClick={() => changeSelectedDay(1)}
                  >
                    ›
                  </button>
                </div>
                <button
                  className="add-task-button"
                  type="button"
                  onClick={() => {
                    setForm({
                      title: '',
                      date: selectedDateKey,
                      endDate: '',
                      startTime: '08:00',
                      endTime: '09:00',
                      description: '',
                      repeats: false,
                      frequency: 'weekly',
                      weekdays: [],
                    })
                    setEditingTaskId(null)
                    setIsDialogOpen(true)
                  }}
                >
                  <span>＋</span> Aufgabe hinzufügen
                </button>
              </div>
            </div>
        <div className="task-list">
          <TaskList
            tasks={visibleTasks}
            projectNames={projectNames}
            milestoneNames={milestoneNames}
            openMenuTaskId={openMenuTaskId}
            onStartWorkMode={startWorkMode}
            onToggle={toggleTask}
            onToggleMenu={(id) => setOpenMenuTaskId((current) => current === id ? null : id)}
            onRemoveFromPlan={(id) => { removeProjectTaskFromPlan(id); setOpenMenuTaskId(null) }}
            onEdit={openEditDialog}
            onRemove={removeTask}
          />
        </div>
      </section>
      <ProjectTaskPool
        tasks={tasks}
        projects={[...projectNames].map(([id, name]) => ({ id, name }))}
        onPlan={planProjectTask}
      />
      </div>

      <aside className="planning-sidebar">
        <CalendarComponent selectedDate={selectedDay} onDateSelect={setSelectedDay} />
        <DaySummary tasks={visibleTasks} completed={completed} progress={progress} />
      </aside>
    </div>
    {isDialogOpen && <TaskDialog form={form} setForm={setForm} editingTaskId={editingTaskId} onSubmit={addTask} onClose={closeDialog} />}
    </section>
  )
}
