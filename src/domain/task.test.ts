import { describe, expect, it } from 'vitest'
import { matchesRecurrence, type Task } from './task'
import { dateKey, formatDuration, formatInvestedTime, secondsBetween } from '../Components/Dashboard/dashboardUtils'

const task: Task = {
  id: 1,
  title: 'Testaufgabe',
  description: '',
  startTime: '09:00',
  endTime: '10:30',
  completed: false,
  investedSeconds: 0,
}

describe('Task-Zeitfunktionen', () => {
  it('berechnet die Zeit zwischen zwei Uhrzeiten', () => {
    expect(secondsBetween('09:00', '10:30')).toBe(5400)
    expect(secondsBetween('10:30', '09:00')).toBe(0)
  })

  it('formatiert Dauer und investierte Zeit', () => {
    expect(formatDuration(3661)).toBe('01:01:01')
    expect(formatInvestedTime(3661)).toBe('01:01h')
    expect(formatInvestedTime(Number.NaN)).toBe('00:00h')
  })

  it('erzeugt einen stabilen Datumsschlüssel', () => {
    expect(dateKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('Wiederholungen', () => {
  it('erkennt tägliche Wiederholungen innerhalb des Zeitraums', () => {
    const recurringTask = { ...task, recurrence: { frequency: 'daily' as const, startDate: '2026-01-05', endDate: '2026-01-07' } }
    expect(matchesRecurrence(recurringTask, '2026-01-06')).toBe(true)
    expect(matchesRecurrence(recurringTask, '2026-01-08')).toBe(false)
  })

  it('erkennt wöchentliche, monatliche und benutzerdefinierte Wiederholungen', () => {
    expect(matchesRecurrence({ ...task, recurrence: { frequency: 'weekly', startDate: '2026-01-05' } }, '2026-01-12')).toBe(true)
    expect(matchesRecurrence({ ...task, recurrence: { frequency: 'monthly', startDate: '2026-01-05' } }, '2026-02-05')).toBe(true)
    expect(matchesRecurrence({ ...task, recurrence: { frequency: 'custom', startDate: '2026-01-01', weekdays: [1] } }, '2026-01-05')).toBe(true)
  })
})
