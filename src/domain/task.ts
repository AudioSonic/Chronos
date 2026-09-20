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
