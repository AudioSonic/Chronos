import { beforeEach, describe, expect, it } from 'vitest'
import type { Milestone } from '../../domain/milestone'
import type { Project } from '../../domain/project'
import type { Task } from '../../domain/task'
import { milestoneStorage } from './milestoneStorage'
import { projectStorage } from './projectStorage'
import { taskStorage } from './taskStorage'

const project: Project = {
  id: 1, name: 'Projekt', description: '', goal: '', category: 'Arbeit', tags: [],
  progress: 0, tasks: '0 / 0 Tasks', dates: 'Kein Zeitraum', status: 'Offen', image: 'default',
}

const task: Task = {
  id: 1, title: 'Aufgabe', description: '', startTime: '', endTime: '', completed: false, investedSeconds: 0,
}

const milestone: Milestone = {
  id: 1, projectId: 1, title: 'Meilenstein', description: '', startDate: '', endDate: '', status: 'Geplant',
}

beforeEach(() => {
  localStorage.clear()
})

describe('Storage-Parsing', () => {
  it('liefert leere Listen bei fehlenden oder beschädigten Werten', () => {
    expect(projectStorage.read()).toEqual([])
    localStorage.setItem('chronos.projects', '{ungültiges json')
    localStorage.setItem('chronos.tasks', JSON.stringify({ title: 'kein Array' }))
    expect(projectStorage.read()).toEqual([])
    expect(taskStorage.read()).toEqual([])
  })

  it('filtert ungültige Projekt-Einträge', () => {
    localStorage.setItem('chronos.projects', JSON.stringify([project, null, 'ungültig']))
    expect(projectStorage.read()).toEqual([project])
  })
})

describe('Storage-CRUD-Grundlagen', () => {
  it('speichert und liest Projekte, Aufgaben und Milestones', () => {
    projectStorage.save([project])
    taskStorage.save([task])
    milestoneStorage.save([milestone])
    expect(projectStorage.read()).toEqual([project])
    expect(taskStorage.read()).toEqual([task])
    expect(milestoneStorage.read()).toEqual([milestone])
  })

  it('unterstützt Ändern und Löschen über erneutes Speichern', () => {
    projectStorage.save([project])
    projectStorage.save([{ ...project, name: 'Geändert' }])
    expect(projectStorage.read()[0].name).toBe('Geändert')
    projectStorage.save([])
    expect(projectStorage.read()).toEqual([])
  })
})
