import { useEffect, useState } from 'react'

export default function useCalendar(selectedDate: Date, onDateSelect: (date: Date) => void) {
  const [displayMonth, setDisplayMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  )

  useEffect(() => {
    setDisplayMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))
  }, [selectedDate])

  const changeMonth = (offset: number) => {
    setDisplayMonth((current) =>
      new Date(current.getFullYear(), current.getMonth() + offset, 1),
    )
  }

  const goToToday = () => {
    const current = new Date()
    setDisplayMonth(new Date(current.getFullYear(), current.getMonth(), 1))
    onDateSelect(new Date(current.getFullYear(), current.getMonth(), current.getDate()))
  }

  return { displayMonth, changeMonth, goToToday }
}
