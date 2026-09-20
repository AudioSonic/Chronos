import { useEffect, useState } from 'react'

export default function useTaskTimer(isActive: boolean) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    if (!isActive || !isRunning) return
    const timer = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000)
    return () => window.clearInterval(timer)
  }, [isActive, isRunning])

  return {
    elapsedSeconds,
    isRunning,
    setIsRunning,
    reset: () => setElapsedSeconds(0),
  }
}
