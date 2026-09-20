import type { CSSProperties } from 'react'
import type { Task } from '../../domain/task'
import { formatInvestedTime } from './dashboardUtils'

type DaySummaryProps = {
  tasks: Task[]
  completed: number
  progress: number
}

export default function DaySummary({ tasks, completed, progress }: DaySummaryProps) {
  const investedTasks = tasks.filter(
    (task) => Number.isFinite(task.investedSeconds) && task.investedSeconds >= 1,
  )

  return (
    <section className="day-summary" aria-label="Tagesübersicht">
      <h2>Tagesübersicht</h2>

      <div
        className="progress-ring"
        style={{ '--progress': `${progress * 3.6}deg` } as CSSProperties}
      >
        <div>
          <strong>
            {completed} / {tasks.length}
          </strong>
          <span>Abgeschlossen</span>
        </div>
      </div>

      <dl className="summary-list">
        <div>
          <dt>
            <i className="open-dot" />Offen
          </dt>
          <dd>{tasks.length - completed}</dd>
        </div>
        <div>
          <dt>
            <i className="done-dot" />Abgeschlossen
          </dt>
          <dd>{completed}</dd>
        </div>
      </dl>

      <div className="invested-times">
        <h3>Investierte Zeit</h3>
        {investedTasks.map((task) => (
          <div className="invested-time-row" key={task.id}>
            <span>{task.title}</span>
            <strong>{formatInvestedTime(task.investedSeconds)}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}
