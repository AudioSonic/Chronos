import { useEffect, useState } from 'react'
import type { Milestone } from '../domain/milestone'
import { milestoneStorage } from '../services/storage/milestoneStorage'
import { createId } from '../services/storage/storageUtils'

export default function useMilestones(projectId: number) {
  const [milestones, setMilestones] = useState<Milestone[]>(() =>
    milestoneStorage.read().filter((milestone) => milestone.projectId === projectId),
  )

  useEffect(() => {
    const otherMilestones = milestoneStorage.read().filter(
      (milestone) => milestone.projectId !== projectId,
    )
    milestoneStorage.save([...otherMilestones, ...milestones])
  }, [milestones, projectId])

  const addMilestone = (milestone: Omit<Milestone, 'id'>) => {
    const nextMilestone = { ...milestone, id: createId() }
    setMilestones((current) => [...current, nextMilestone])
    return nextMilestone
  }

  const updateMilestone = (id: number, changes: Partial<Milestone>) => {
    setMilestones((current) => current.map((milestone) =>
      milestone.id === id ? { ...milestone, ...changes } : milestone,
    ))
  }

  const removeMilestone = (id: number) => {
    setMilestones((current) => current.filter((milestone) => milestone.id !== id))
  }

  return { milestones, setMilestones, addMilestone, updateMilestone, removeMilestone }
}
