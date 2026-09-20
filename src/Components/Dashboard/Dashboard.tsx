import { FormEvent, useMemo, useRef, useState } from 'react'
import './Dashboard.css'
import IconToday from '../../Assets/icon_today.svg'
import ProjectTaskPool from './ProjectTaskPool'
import CalendarComponent from './Calendar'
import TaskList from './TaskList'
import DaySummary from './DaySummary'
import WorkMode from './WorkMode'
import TaskDialog, { type TaskForm } from './TaskDialog'
import useTasks from './useTasks'
import { matchesRecurrence, type Task } from '../../domain/task'
import useTaskTimer from '../../hooks/useTaskTimer'
import useDialog from '../../hooks/useDialog'
import useWorkMode from '../../hooks/useWorkMode'
import { projectStorage } from '../../services/storage/projectStorage'
import { milestoneStorage } from '../../services/storage/milestoneStorage'
import {
  dateKey,
  formatDate,
  secondsBetween,
  shortDateFormatter,
} from './dashboardUtils'

export type { Task } from '../../domain/task'

export default function Dashboard() {
  const today = new Date()
  const {
    tasks,
    setTasks,
    addTask: addStoredTask,
    updateTask: updateStoredTask,
    toggleTask: toggleStoredTask,
    removeTask: removeStoredTask,
  } = useTasks()
  const [selectedDay, setSelectedDay] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate()),
  )
  const {
    isOpen: isDialogOpen,
    editingId: editingTaskId,
    openCreate: openTaskDialog,
    openEdit: openTaskEditDialog,
    close: closeTaskDialog,
  } = useDialog<number>()
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
  const timerPanelRef = useRef<HTMLElement>(null)
  const {
    elapsedSeconds,
    isRunning: isTimerRunning,
    setIsRunning: setIsTimerRunning,
    reset: resetTimer,
  } = useTaskTimer(activeTaskId !== null)
  const { isFullscreen, start, close, toggleFullscreen } = useWorkMode({ setTasks, resetTimer, timerPanelRef })
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
    closeTaskDialog()
    setForm({ title: '', date: dateKey(selectedDay), endDate: '', startTime: '', endTime: '', description: '', repeats: false, frequency: 'weekly', weekdays: [] })
  }

  const openEditDialog = (task: Task) => {
    openTaskEditDialog(task.id)
    setForm({ title: task.title, date: task.date ?? dateKey(selectedDay), endDate: task.recurrence?.endDate ?? '', startTime: task.startTime, endTime: task.endTime, description: task.description, repeats: Boolean(task.recurrence), frequency: task.recurrence?.frequency ?? 'weekly', weekdays: task.recurrence?.weekdays ?? [] })
    setOpenMenuTaskId(null)
  }

  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.title.trim()) return

    const recurrence = form.repeats
      ? {
        frequency: form.frequency,
        startDate: form.date,
        ...(form.endDate ? { endDate: form.endDate } : {}),
        ...(form.frequency === 'custom' ? { weekdays: form.weekdays } : {}),
      }
      : undefined
    const details = {
      date: form.date,
      recurrence,
      title: form.title.trim(),
      description: form.description.trim(),
      startTime: form.startTime,
      endTime: form.endTime,
    }

    if (editingTaskId !== null) {
      updateStoredTask(editingTaskId, details)
    } else {
      addStoredTask({
        ...details,
        completed: false,
        investedSeconds: 0,
      })
    }

    closeDialog()
  }

  const toggleTask = (id: number) => toggleStoredTask(id)
  const planProjectTask = (id: number) => setTasks((current) => current.map((task) => task.id === id ? { ...task, plannedForDate: dateKey(new Date()) } : task))
  const removeProjectTaskFromPlan = (id: number) => setTasks((current) => current.map((task) => task.id === id ? { ...task, plannedForDate: undefined } : task))
  const removeTask = (id: number) => {
    removeStoredTask(id)
    setOpenMenuTaskId(null)
  }
  const activeTask = tasks.find((task) => task.id === activeTaskId)
  const projectNames = useMemo(
    () => new Map(projectStorage.read().map((project) => [project.id, project.name])),
    [tasks],
  )
  const milestoneNames = useMemo(
    () => new Map(milestoneStorage.read().map((milestone) => [milestone.id, milestone.title])),
    [tasks],
  )

  const changeSelectedDay = (offset: number) => setSelectedDay((current) => {
    const next = new Date(current)
    next.setDate(next.getDate() + offset)
    return next
  })

  const startWorkMode = (id: number) => {
    setActiveTaskId(id)
    start(id, resetTimer)
    setIsTimerRunning(true)
  }

  const closeWorkMode = (completeTask = false) => {
    close(elapsedSeconds, completeTask)
    setActiveTaskId(null)
  }

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
        isTimerFullscreen={isFullscreen}
        timerPanelRef={timerPanelRef}
        onClose={() => closeWorkMode()}
        onToggleTimer={() => setIsTimerRunning((running) => !running)}
        onResetTimer={resetTimer}
        onCompleteTask={() => closeWorkMode(true)}
        onToggleFullscreen={toggleFullscreen}
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
                    openTaskDialog()
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
