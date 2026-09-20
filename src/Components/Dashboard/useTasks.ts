import { useEffect, useState } from 'react'
import type { Task } from '../../domain/task'
import { taskStorage } from '../../services/storage/taskStorage'
import { createId } from '../../services/storage/storageUtils'

export default function useTasks(projectId?: number) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const allTasks = taskStorage.read()
    return projectId === undefined ? allTasks : allTasks.filter((task) => task.projectId === projectId)
  })

  useEffect(() => {
    if (projectId === undefined) {
      taskStorage.save(tasks)
      return
    }
    const otherTasks = taskStorage.read().filter((task) => task.projectId !== projectId)
    taskStorage.save([...otherTasks, ...tasks])
  }, [tasks, projectId])

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
