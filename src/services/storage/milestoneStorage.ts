import type { Milestone } from '../../domain/milestone'

const storageKey = 'chronos.milestones'

const readMilestones = (): Milestone[] => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) || '[]')
    return Array.isArray(value) ? value as Milestone[] : []
  } catch {
    return []
  }
}

const saveMilestones = (milestones: Milestone[]) => {
  localStorage.setItem(storageKey, JSON.stringify(milestones))
}

export const milestoneStorage = { read: readMilestones, save: saveMilestones }
