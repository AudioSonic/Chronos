import { useEffect, useState } from 'react'
import type { Task } from '../../domain/task'
import { taskStorage } from '../../services/storage/taskStorage'

export default function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(taskStorage.read)

  useEffect(() => {
    taskStorage.save(tasks)
  }, [tasks])

  return { tasks, setTasks }
}
