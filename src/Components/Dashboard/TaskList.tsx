import type { Task } from '../../domain/task'
import TaskCard from './TaskCard'

type TaskListProps = {
  tasks: Task[]
  projectNames: Map<number, string>
  milestoneNames: Map<number, string>
  openMenuTaskId: number | null
  onStartWorkMode: (id: number) => void
  onToggle: (id: number) => void
  onToggleMenu: (id: number) => void
  onRemoveFromPlan: (id: number) => void
  onEdit: (task: Task) => void
  onRemove: (id: number) => void
}

export default function TaskList({
  tasks,
  projectNames,
  milestoneNames,
  openMenuTaskId,
  onStartWorkMode,
  onToggle,
  onToggleMenu,
  onRemoveFromPlan,
  onEdit,
  onRemove,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="empty-plan">
        <span>✦</span>
        <h3>Noch nichts geplant</h3>
        <p>Füge deinen ersten Zeitraum für heute hinzu.</p>
      </div>
    )
  }

  const sortedTasks = [...tasks].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  )

  return (
    <>
      {sortedTasks.map((task, index) => (
        <TaskCard
          key={task.id}
          task={task}
          index={index}
          projectName={task.projectId !== undefined ? projectNames.get(task.projectId) : undefined}
          milestoneName={task.milestoneId !== undefined ? milestoneNames.get(task.milestoneId) : undefined}
          isMenuOpen={openMenuTaskId === task.id}
          onStartWorkMode={onStartWorkMode}
          onToggle={onToggle}
          onToggleMenu={onToggleMenu}
          onRemoveFromPlan={onRemoveFromPlan}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      ))}
    </>
  )
}
