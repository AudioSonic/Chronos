import type { EntityId, ProjectStatus } from '../types/common'

export type Project = {
  id: EntityId
  name: string
  description: string
  tags: string[]
  progress: number
  tasks: string
  dates: string
  status: ProjectStatus
  category?: string
  goal?: string
  startDate?: string
  endDate?: string
  image?: string
}

export const projectCategories = [
  'Keine Kategorie',
  'Programmierung',
  'Game Development',
  'Gaming',
  'Fitness',
  'Filme & Serien',
] as const
