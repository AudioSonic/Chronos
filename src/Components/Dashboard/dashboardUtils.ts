import type { Task } from '../../domain/task'

export const formatDate = new Intl.DateTimeFormat('de-DE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export const shortDateFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
})

export const secondsBetween = (startTime: string, endTime: string) => {
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)
  const start = startHour * 3600 + startMinute * 60
  const end = endHour * 3600 + endMinute * 60

  return Math.max(0, end - start)
}

export const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

export const formatInvestedTime = (seconds: number) => {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  return `${formatDuration(safeSeconds).slice(0, 5)}h`
}

export const formatTaskTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} h`
}

export const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

const parseDateKey = (key: string) => {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export const matchesRecurrence = (task: Task, key: string) => {
  if (task.projectId !== undefined) return task.plannedForDate === key
  if (!task.recurrence) return (task.date ?? '') === key

  const current = parseDateKey(key)
  const start = parseDateKey(task.recurrence.startDate)

  if (
    current < start ||
    (task.recurrence.endDate && current > parseDateKey(task.recurrence.endDate))
  ) {
    return false
  }

  if (task.recurrence.frequency === 'daily') return true
  if (task.recurrence.frequency === 'weekly') return current.getDay() === start.getDay()
  if (task.recurrence.frequency === 'monthly') return current.getDate() === start.getDate()
  if (task.recurrence.frequency === 'yearly') {
    return current.getDate() === start.getDate() && current.getMonth() === start.getMonth()
  }

  return task.recurrence.weekdays?.includes(current.getDay()) ?? false
}
