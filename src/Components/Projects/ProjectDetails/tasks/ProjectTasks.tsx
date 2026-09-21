import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Project } from '../../projectTypes'
import type { Task } from '../../../../domain/task'
import type { Milestone } from '../../../../domain/milestone'
import { milestoneStorage } from '../../../../services/storage/milestoneStorage'
import ProjectTaskModal, { type ProjectTaskForm } from './ProjectTaskModal'
import useTasks from '../../../Dashboard/useTasks'
import WorkMode from '../../../Dashboard/WorkMode'
import '../../../Dashboard/Dashboard.css'
import useDialog from '../../../../hooks/useDialog'
import useTaskTimer from '../../../../hooks/useTaskTimer'
import useWorkMode from '../../../../hooks/useWorkMode'
import { secondsBetween } from '../../../Dashboard/dashboardUtils'
import EmptyState from '../../../ui/EmptyState'

const emptyForm: ProjectTaskForm = { title: '', description: '', dueDate: '', milestoneId: '' }
const formatDate = (value?: string) => value ? new Intl.DateTimeFormat('de-DE').format(new Date(`${value}T12:00:00`)) : 'Keine Fälligkeit'
const formatTime = (seconds: number) => `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:${String(Math.floor(seconds % 3600 / 60)).padStart(2, '0')} h`

type ProjectTasksProps = { project: Project; onProgress: (completed: number, total: number) => void }

export default function ProjectTasks({ project, onProgress }: ProjectTasksProps) {
  const { tasks, setTasks } = useTasks(project.id)
  const [milestones] = useState<Milestone[]>(() => milestoneStorage.read().filter((milestone) => milestone.projectId === project.id))
  const [form, setForm] = useState<ProjectTaskForm>(emptyForm)
  const { isOpen: isModalOpen, editingId, openCreate, openEdit, close } = useDialog<number>()
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null)
  const timerPanelRef = useRef<HTMLElement>(null)
  const { elapsedSeconds, isRunning: isTimerRunning, setIsRunning: setIsTimerRunning, reset: resetTimer } = useTaskTimer(activeTaskId !== null)
  const { isFullscreen, start, close: closeWorkMode, toggleFullscreen } = useWorkMode({ setTasks, resetTimer, timerPanelRef })

  const saveTasks = (nextTasks: Task[]) => {
    setTasks(nextTasks)
  }

  useEffect(() => {
    onProgress(tasks.filter((task) => task.completed).length, tasks.length)
  }, [tasks, onProgress])

  const editTask = (task: Task) => {
    openEdit(task.id)
    setForm({ title: task.title, description: task.description, dueDate: task.dueDate || '', milestoneId: task.milestoneId ? String(task.milestoneId) : '' })
    setOpenMenuId(null)
    
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.title.trim()) return
    const details = { title: form.title.trim(), description: form.description.trim(), dueDate: form.dueDate || undefined, milestoneId: form.milestoneId ? Number(form.milestoneId) : undefined }
    const nextTasks = editingId === null
      ? [...tasks, { ...details, id: Date.now(), date: form.dueDate || undefined, startTime: '', endTime: '', completed: false, investedSeconds: 0, projectId: project.id }]
      : tasks.map((task) => task.id === editingId ? { ...task, ...details } : task)
    saveTasks(nextTasks)
    close()
  }

  const startTaskWorkMode = (id: number) => {
    setActiveTaskId(id)
    start(id, resetTimer)
    setIsTimerRunning(true)
  }

  const finishWorkMode = (completeTask = false) => {
    closeWorkMode(elapsedSeconds, completeTask)
    setActiveTaskId(null)
  }

  const activeTask = tasks.find((task) => task.id === activeTaskId)
  if (activeTask) {
    const plannedSeconds = secondsBetween(activeTask.startTime, activeTask.endTime)
    const nextTask = tasks.find((task) => task.startTime > activeTask.startTime && task.id !== activeTask.id)
    return <WorkMode
      activeTask={activeTask}
      nextTask={nextTask}
      elapsedSeconds={elapsedSeconds}
      plannedSeconds={plannedSeconds}
      timerProgress={plannedSeconds ? Math.min((elapsedSeconds / plannedSeconds) * 100, 100) : 0}
      isTimerRunning={isTimerRunning}
      isTimerFullscreen={isFullscreen}
      timerPanelRef={timerPanelRef}
      onClose={() => finishWorkMode()}
      onToggleTimer={() => setIsTimerRunning((running) => !running)}
      onResetTimer={resetTimer}
      onCompleteTask={() => finishWorkMode(true)}
      onToggleFullscreen={toggleFullscreen}
    />
  }

  return (
    <div className="project-task-content">
      <div className="project-task-heading">
        <div><h2>Aufgaben</h2><p>Verwalte die Aufgaben für dieses Projekt.</p></div>
        <button className="primary-button" type="button" onClick={() => { setForm(emptyForm); openCreate() }}>＋ Aufgabe hinzufügen</button>
      </div>
      <div className="project-task-list">
        {tasks.length ? tasks.map((task) => (
          <article className={`project-task-card ${task.completed ? 'is-completed' : ''}`} key={task.id}>
            <label className="task-checkbox"><input type="checkbox" checked={task.completed} onChange={() => saveTasks(tasks.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item))} /><span>✓</span></label>
            <div><h3>{task.title}</h3>{task.description && <p>{task.description}</p>}<small>Fällig: {formatDate(task.dueDate)}{task.startTime || task.endTime ? ` · ${task.startTime || '–'} – ${task.endTime || '–'}` : ''}</small>{task.investedSeconds > 0 && <small className="task-invested-time">Investiert: {formatTime(task.investedSeconds)}</small>}</div>
            <button className="work-mode-button project-work-mode-button" type="button" onClick={() => startTaskWorkMode(task.id)} aria-label={`Work Mode für ${task.title} starten`}>▶ <span>Work Mode starten</span></button>
            <div className="project-task-options"><button type="button" onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}>⋮</button>{openMenuId === task.id && <div className="project-task-menu"><button type="button" onClick={() => editTask(task)}>Aufgabe bearbeiten</button><button type="button" className="danger-option" onClick={() => { saveTasks(tasks.filter((item) => item.id !== task.id)); setOpenMenuId(null) }}>Aufgabe entfernen</button></div>}</div>
          </article>
        )) : <EmptyState className="project-task-empty" title="Noch keine Aufgaben">Füge die erste Aufgabe für dieses Projekt hinzu.</EmptyState>}
      </div>
      {isModalOpen && <ProjectTaskModal form={form} setForm={setForm} milestones={milestones} editing={editingId} onSubmit={submit} onClose={close} />}
    </div>
  )
}
