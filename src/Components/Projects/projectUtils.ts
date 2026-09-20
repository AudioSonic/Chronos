import type { Project } from '../../domain/project'
import type { Task } from '../../domain/task'

export const getProjectTaskSummary = (projectId: number, tasks: Task[]) => {
  const projectTasks = tasks.filter((task) => task.projectId === projectId)
  const completedTasks = projectTasks.filter((task) => task.completed).length

  return {
    completedTasks,
    totalTasks: projectTasks.length,
    progress: projectTasks.length ? Math.round(completedTasks / projectTasks.length * 100) : 0,
  }
}

export const formatProjectDates = (project: Project) => {
  if (!project.startDate) return project.dates

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat('de-DE').format(new Date(`${value}T12:00:00`))

  return `${formatDate(project.startDate)} – ${project.endDate ? formatDate(project.endDate) : 'offen'}`
}
