import IconCalender from '../../Assets/icon_calender.svg'
import useCalendar from '../../hooks/useCalendar'

type CalendarProps = {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

const monthYearFormatter = new Intl.DateTimeFormat('de-DE', {
  month: 'long',
  year: 'numeric',
})

const startOfCalendar = (date: Date) => {
  const first = new Date(date.getFullYear(), date.getMonth(), 1)
  const mondayOffset = (first.getDay() + 6) % 7

  first.setDate(first.getDate() - mondayOffset)
  return first
}

export default function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const today = new Date()
  const { displayMonth, changeMonth, goToToday } = useCalendar(selectedDate, onDateSelect)

  const calendarStart = startOfCalendar(displayMonth)
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart)
    date.setDate(calendarStart.getDate() + index)
    return date
  })
  const selectedKey = selectedDate.toDateString()

  return (
    <section className="calendar-panel" aria-label="Kalender">
      <div className="calendar-toolbar">
        <div>
          <span className="calendar-icon" aria-hidden="true">
            <img src={IconCalender} alt="" />
          </span>
          <div><h2>Kalender</h2></div>
        </div>
        <button className="calendar-today-button" type="button" onClick={goToToday}>
          Heute
        </button>
      </div>

      <div className="calendar-navigation">
        <button type="button" aria-label="Vorheriger Monat" onClick={() => changeMonth(-1)}>
          ‹
        </button>
        <strong>{monthYearFormatter.format(displayMonth)}</strong>
        <button type="button" aria-label="Nächster Monat" onClick={() => changeMonth(1)}>
          ›
        </button>
      </div>

      <div className="calendar-grid" role="grid">
        {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
          <span className="calendar-weekday" key={day}>{day}</span>
        ))}
        {days.map((date) => {
          const isCurrentMonth = date.getMonth() === displayMonth.getMonth()
          const isToday = date.toDateString() === today.toDateString()
          const isSelected = date.toDateString() === selectedKey

          return (
            <button
              className={`calendar-day ${isCurrentMonth ? '' : 'is-outside'} ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
              type="button"
              key={date.toISOString()}
              aria-label={date.toLocaleDateString('de-DE')}
              aria-pressed={isSelected}
              onClick={() => onDateSelect(date)}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </section>
  )
}
