import { useEffect, useState } from 'react'
import type { Task } from './Dashboard'

const storageKey = 'chronos.tasks'

const loadTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(storageKey)
    if (!stored) return []

    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed as Task[] : []
  } catch {
    return []
  }
}

export default function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks))
  }, [tasks])

  return { tasks, setTasks }
}
