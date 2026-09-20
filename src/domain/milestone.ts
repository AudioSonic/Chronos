import type { EntityId, MilestoneStatus } from '../types/common'

export type Milestone = {
  id: EntityId
  projectId: EntityId
  title: string
  description: string
  startDate: string
  endDate: string
  status: MilestoneStatus
}
