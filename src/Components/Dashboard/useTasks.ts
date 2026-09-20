import { useEffect, useState } from 'react'
import type { Task } from '../../domain/task'
import { taskStorage } from '../../services/storage/taskStorage'
import { createId } from '../../services/storage/storageUtils'

export default function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(taskStorage.read)

  useEffect(() => {
    taskStorage.save(tasks)
  }, [tasks])

  const addTask = (task: Omit<Task, 'id'>) => {
    const nextTask = { ...task, id: createId() }
    setTasks((current) => [...current, nextTask])
    return nextTask
  }

  const updateTask = (id: number, changes: Partial<Task>) => {
    setTasks((current) => current.map((task) =>
      task.id === id ? { ...task, ...changes } : task,
    ))
  }

  const removeTask = (id: number) => {
    setTasks((current) => current.filter((task) => task.id !== id))
  }

  const toggleTask = (id: number) => {
    setTasks((current) => current.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    ))
  }

  return { tasks, setTasks, addTask, updateTask, removeTask, toggleTask }
}
