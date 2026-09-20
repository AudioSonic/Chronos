import type { DateString, EntityId, RecurrenceFrequency } from '../types/common'

export type Recurrence = {
  frequency: RecurrenceFrequency
  startDate: DateString
  endDate?: DateString
  weekdays?: number[]
}

export type Task = {
  id: EntityId
  date?: DateString
  title: string
  description: string
  startTime: string
  endTime: string
  completed: boolean
  investedSeconds: number
  recurrence?: Recurrence
  projectId?: EntityId
  milestoneId?: EntityId
  dueDate?: DateString
  plannedForDate?: DateString
}

const parseDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export const matchesRecurrence = (task: Task, key: string) => {
  if (task.projectId !== undefined) return task.plannedForDate === key
  if (!task.recurrence) return (task.date ?? '') === key

  const current = parseDate(key)
  const start = parseDate(task.recurrence.startDate)
  if (current < start || (task.recurrence.endDate && current > parseDate(task.recurrence.endDate))) return false
  if (task.recurrence.frequency === 'daily') return true
  if (task.recurrence.frequency === 'weekly') return current.getDay() === start.getDay()
  if (task.recurrence.frequency === 'monthly') return current.getDate() === start.getDate()
  if (task.recurrence.frequency === 'yearly') return current.getDate() === start.getDate() && current.getMonth() === start.getMonth()
  return task.recurrence.weekdays?.includes(current.getDay()) ?? false
}
