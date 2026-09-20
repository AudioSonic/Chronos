import { describe, expect, it } from 'vitest'
import { getProjectTaskSummary } from './projectUtils'

const task = (id: number, projectId: number, completed: boolean) => ({
  id, projectId, completed, title: `Task ${id}`, description: '', startTime: '', endTime: '', investedSeconds: 0,
})

describe('Projektfortschritt', () => {
  it('zählt Aufgaben und berechnet den Fortschritt', () => {
    expect(getProjectTaskSummary(1, [task(1, 1, true), task(2, 1, false), task(3, 2, true)])).toEqual({
      completedTasks: 1,
      totalTasks: 2,
      progress: 50,
    })
  })

  it('liefert bei einem leeren Projekt null Prozent', () => {
    expect(getProjectTaskSummary(1, [])).toEqual({ completedTasks: 0, totalTasks: 0, progress: 0 })
  })
})
