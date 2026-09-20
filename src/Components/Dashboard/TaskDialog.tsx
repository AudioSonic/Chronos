import type { Dispatch, FormEvent, SetStateAction } from 'react'

export type TaskForm = {
  title: string
  date: string
  endDate: string
  startTime: string
  endTime: string
  description: string
  repeats: boolean
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
  weekdays: number[]
}

type TaskDialogProps = {
  form: TaskForm
  setForm: Dispatch<SetStateAction<TaskForm>>
  editingTaskId: number | null
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onClose: () => void
}

export default function TaskDialog({
  form,
  setForm,
  editingTaskId,
  onSubmit,
  onClose,
}: TaskDialogProps) {
  const updateForm = <K extends keyof TaskForm>(field: K, value: TaskForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="task-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="dialog-title">
          <span className="calendar-icon" aria-hidden="true">▣</span>
          <h2 id="task-dialog-title">
            {editingTaskId === null ? 'Neue Aufgabe hinzufügen' : 'Aufgabe bearbeiten'}
          </h2>
          <button type="button" aria-label="Dialog schließen" onClick={onClose}>×</button>
        </div>

        <form onSubmit={onSubmit}>
          <label>
            Titel
            <input
              autoFocus
              required
              maxLength={80}
              value={form.title}
              onChange={(event) => updateForm('title', event.target.value)}
              placeholder="z. B. Chronos, Gaming, Sport, ..."
            />
          </label>

          <label>
            {form.repeats ? 'Startdatum' : 'Datum'}
            <input
              type="date"
              required
              value={form.date}
              onChange={(event) => updateForm('date', event.target.value)}
            />
          </label>

          <label className="repeat-toggle">
            <input
              type="checkbox"
              checked={form.repeats}
              onChange={(event) => updateForm('repeats', event.target.checked)}
            />
            <span>Aufgabe wiederholen</span>
          </label>

          {form.repeats && (
            <div className="recurrence-fields">
              <label>
                Wiederholung
                <select
                  value={form.frequency}
                  onChange={(event) => updateForm('frequency', event.target.value as TaskForm['frequency'])}
                >
                  <option value="daily">Täglich</option>
                  <option value="weekly">Wöchentlich</option>
                  <option value="monthly">Monatlich</option>
                  <option value="yearly">Jährlich</option>
                  <option value="custom">Individuell</option>
                </select>
              </label>

              <label>
                Enddatum <span>(optional)</span>
                <input
                  type="date"
                  min={form.date}
                  value={form.endDate}
                  onChange={(event) => updateForm('endDate', event.target.value)}
                />
              </label>

              {form.frequency === 'custom' && (
                <div className="weekday-picker">
                  <span>Wochentage</span>
                  <div>
                    {[['Mo', 1], ['Di', 2], ['Mi', 3], ['Do', 4], ['Fr', 5], ['Sa', 6], ['So', 0]].map(([label, day]) => {
                      const weekday = day as number
                      return (
                        <label key={weekday}>
                          <input
                            type="checkbox"
                            checked={form.weekdays.includes(weekday)}
                            onChange={(event) => updateForm(
                              'weekdays',
                              event.target.checked
                                ? [...form.weekdays, weekday]
                                : form.weekdays.filter((item) => item !== weekday),
                            )}
                          />
                          <span>{label}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="time-fields">
            <label>
              Startzeit
              <input type="time" required value={form.startTime} onChange={(event) => updateForm('startTime', event.target.value)} />
            </label>
            <label>
              Endzeit
              <input type="time" required value={form.endTime} onChange={(event) => updateForm('endTime', event.target.value)} />
            </label>
          </div>

          <label>
            Beschreibung <span>(optional)</span>
            <textarea
              maxLength={200}
              value={form.description}
              onChange={(event) => updateForm('description', event.target.value)}
              placeholder="z. B. Woran genau möchtest du arbeiten?"
            />
            <small>{form.description.length} / 200</small>
          </label>

          <div className="dialog-actions">
            <button className="cancel-button" type="button" onClick={onClose}>Abbrechen</button>
            <button className="submit-button" type="submit">
              {editingTaskId === null ? 'Hinzufügen' : 'Speichern'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
