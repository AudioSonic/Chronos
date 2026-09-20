import type { Task } from '../../domain/task'

const storageKey = 'chronos.tasks'

const readTasks = (): Task[] => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) || '[]')
    return Array.isArray(value) ? value as Task[] : []
  } catch {
    return []
  }
}

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(storageKey, JSON.stringify(tasks))
}

export const taskStorage = { read: readTasks, save: saveTasks }
