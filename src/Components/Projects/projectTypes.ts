export type ProjectStatus = 'Offen' | 'Geplant' | 'Pausiert' | 'Abgeschlossen' | 'Abgebrochen'

export type Project = {
  id: number
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
