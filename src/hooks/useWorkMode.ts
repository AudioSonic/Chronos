import { useEffect, useState, type Dispatch, type RefObject, type SetStateAction } from 'react'
import type { Task } from '../domain/task'

type UseWorkModeOptions = {
  setTasks: Dispatch<SetStateAction<Task[]>>
  resetTimer: () => void
  timerPanelRef: RefObject<HTMLElement | null>
}

export default function useWorkMode({ setTasks, resetTimer, timerPanelRef }: UseWorkModeOptions) {
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === timerPanelRef.current)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [timerPanelRef])

  const start = (id: number, onReset: () => void) => {
    setActiveTaskId(id)
    onReset()
  }

  const close = (elapsedSeconds: number, completeTask = false) => {
    if (activeTaskId !== null) {
      setTasks((current) => current.map((task) => task.id === activeTaskId ? {
        ...task,
        investedSeconds: task.investedSeconds + elapsedSeconds,
        completed: completeTask ? true : task.completed,
      } : task))
    }
    setActiveTaskId(null)
    resetTimer()
  }

  const toggleFullscreen = async () => {
    if (!timerPanelRef.current) return
    if (document.fullscreenElement) await document.exitFullscreen()
    else await timerPanelRef.current.requestFullscreen()
  }

  return { activeTaskId, isFullscreen, start, close, toggleFullscreen }
}
