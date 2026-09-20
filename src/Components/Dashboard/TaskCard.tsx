import type { Task } from './Dashboard'
import { formatTaskTime } from './dashboardUtils'

type TaskCardProps = {
  task: Task
  index: number
  projectName?: string
  milestoneName?: string
  isMenuOpen: boolean
  onStartWorkMode: (id: number) => void
  onToggle: (id: number) => void
  onToggleMenu: (id: number) => void
  onRemoveFromPlan: (id: number) => void
  onEdit: (task: Task) => void
  onRemove: (id: number) => void
}

export default function TaskCard({
  task,
  index,
  projectName,
  milestoneName,
  isMenuOpen,
  onStartWorkMode,
  onToggle,
  onToggleMenu,
  onRemoveFromPlan,
  onEdit,
  onRemove,
}: TaskCardProps) {
  return (
    <article className={`task-card ${task.completed ? 'is-completed' : ''}`}>
      <span className={`task-color task-color-${index % 6}`} />

      <div className="task-time">
        <time>{task.startTime}</time>
        <time>{task.endTime}</time>
      </div>

      <div className="task-details">
        <h3>{task.title}</h3>
        {task.projectId !== undefined && (
          <p className="project-task-context">
            <strong>{projectName || 'Projekt'}</strong>
            {milestoneName && <span> · {milestoneName}</span>}
          </p>
        )}
        {task.description && <p>{task.description}</p>}
        {task.investedSeconds > 0 && (
          <p className="task-time-invested">
            Investiert: {formatTaskTime(task.investedSeconds)}
          </p>
        )}
      </div>

      <button
        className="work-mode-button"
        type="button"
        onClick={() => onStartWorkMode(task.id)}
        aria-label={`Work Mode für ${task.title} starten`}
      >
        ▶ <span>Work Mode starten</span>
      </button>

      <label
        className="task-checkbox"
        title={task.completed ? 'Als offen markieren' : 'Als abgeschlossen markieren'}
      >
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`${task.title} als ${task.completed ? 'offen' : 'abgeschlossen'} markieren`}
        />
        <span>✓</span>
      </label>

      <div className="task-options">
        <button
          className="task-options-button"
          type="button"
          aria-label={`Optionen für ${task.title}`}
          aria-expanded={isMenuOpen}
          onClick={() => onToggleMenu(task.id)}
        >
          ⋮
        </button>

        {isMenuOpen && (
          <div className="task-options-menu">
            {task.projectId !== undefined && (
              <button type="button" onClick={() => onRemoveFromPlan(task.id)}>
                Aus Tagesplan entfernen
              </button>
            )}
            <button type="button" onClick={() => onEdit(task)}>
              Aufgabe bearbeiten
            </button>
            <button className="danger-option" type="button" onClick={() => onRemove(task.id)}>
              Aufgabe entfernen
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
