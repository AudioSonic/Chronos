import type { CSSProperties, RefObject } from 'react'
import type { Task } from './Dashboard'
import IconFullScreen from '../../Assets/icon full screen.svg'
import { formatDuration } from './dashboardUtils'

type WorkModeProps = {
  activeTask: Task
  nextTask?: Task
  elapsedSeconds: number
  plannedSeconds: number
  timerProgress: number
  isTimerRunning: boolean
  isTimerFullscreen: boolean
  timerPanelRef: RefObject<HTMLElement | null>
  onClose: () => void
  onToggleTimer: () => void
  onResetTimer: () => void
  onCompleteTask: () => void
  onToggleFullscreen: () => void
}

export default function WorkMode({
  activeTask,
  nextTask,
  elapsedSeconds,
  plannedSeconds,
  timerProgress,
  isTimerRunning,
  isTimerFullscreen,
  timerPanelRef,
  onClose,
  onToggleTimer,
  onResetTimer,
  onCompleteTask,
  onToggleFullscreen,
}: WorkModeProps) {
  return (
    <section className="dashboard work-mode">
      <header className="work-mode-header">
        <button type="button" onClick={onClose}>
          ⌂ <span>Dashboard</span>
        </button>
        <span>›</span>
        <strong>Work Mode</strong>
        <time>{new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}</time>
      </header>

      <div className="work-layout">
        <section className="work-timer-panel" ref={timerPanelRef}>
          <button
            className="timer-fullscreen-button"
            type="button"
            onClick={onToggleFullscreen}
            aria-label={isTimerFullscreen ? 'Fullscreen verlassen' : 'Timer im Fullscreen öffnen'}
            title={isTimerFullscreen ? 'Fullscreen verlassen' : 'Fullscreen öffnen'}
          >
            <img src={IconFullScreen} alt="" />
          </button>

          <p className="work-active-label"><i /> WORK MODE AKTIV</p>

          <div
            className="work-ring"
            style={{ '--progress': `${timerProgress * 3.6}deg` } as CSSProperties}
          >
            <div>
              <strong>
                {formatDuration(elapsedSeconds)} <em>/</em> {formatDuration(plannedSeconds)}
              </strong>
              <button
                type="button"
                aria-label={isTimerRunning ? 'Timer pausieren' : 'Timer fortsetzen'}
                onClick={onToggleTimer}
              >
                {isTimerRunning ? 'Ⅱ' : '▶'}
              </button>
            </div>
          </div>

          <div className="work-actions">
            <button type="button" onClick={onResetTimer}>↻ <span>Timer zurücksetzen</span></button>
            <button type="button" onClick={onCompleteTask}>✓ <span>Aufgabe abschließen</span></button>
            <button type="button" onClick={onClose}>••• <span>Work Mode beenden</span></button>
          </div>
        </section>

        <aside className="work-sidebar">
          <section className="work-info">
            <h2>Aktueller Task</h2>
            <h3>{activeTask.title}</h3>
            <p>{activeTask.description || 'Keine Beschreibung hinterlegt.'}</p>
            <dl>
              <div>
                <dt>◷ <span>Geplant</span></dt>
                <dd>{activeTask.startTime} – {activeTask.endTime} Uhr ({formatDuration(plannedSeconds).slice(0, 5)}h)</dd>
              </div>
              <div>
                <dt>☷ <span>Status</span></dt>
                <dd>{isTimerRunning ? 'Timer läuft' : 'Pausiert'}</dd>
              </div>
            </dl>
          </section>

          {nextTask && (
            <section className="next-task">
              <h2>Nächster Task</h2>
              <strong>{nextTask.title}</strong>
              <p>{nextTask.startTime} – {nextTask.endTime} Uhr</p>
            </section>
          )}
        </aside>
      </div>
    </section>
  )
}
