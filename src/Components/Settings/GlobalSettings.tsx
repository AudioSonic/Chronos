import { useState, type Dispatch, type SetStateAction } from 'react'
import './GlobalSettings.css'

type Props = { categories: string[]; setCategories: Dispatch<SetStateAction<string[]>> }

export default function GlobalSettings({ categories, setCategories }: Props) {
  const [dialog, setDialog] = useState<{ index: number | null; value: string } | null>(null)
  const saveCategory = () => {
    const value = dialog?.value.trim()
    if (!value) return
    setCategories((current) => dialog?.index === null ? [...current, value] : current.map((category, index) => index === dialog?.index ? value : category))
    setDialog(null)
  }
  const removeCategory = (index: number) => { if (window.confirm(`Kategorie „${categories[index]}“ wirklich löschen?`)) setCategories((current) => current.filter((_, itemIndex) => itemIndex !== index)) }
  return <section className="global-settings"><header><h1>Einstellungen</h1><p>Verwalte die Kategorien für deine Projekte.</p></header><div className="global-settings-card"><div className="settings-heading"><h2>Kategorien</h2><button className="primary-button" type="button" onClick={() => setDialog({ index: null, value: '' })}>＋ Kategorie hinzufügen</button></div><div className="category-list">{categories.map((category, index) => <div className="category-row" key={`${category}-${index}`}><span>{category}</span><div><button type="button" aria-label={`${category} bearbeiten`} onClick={() => setDialog({ index, value: category })}>✎</button><button type="button" aria-label={`${category} löschen`} onClick={() => removeCategory(index)}>♧</button></div></div>)}</div></div>{dialog && <div className="category-dialog-backdrop" role="presentation"><div className="category-dialog" role="dialog" aria-modal="true"><h2>{dialog.index === null ? 'Kategorie hinzufügen' : 'Kategorie bearbeiten'}</h2><input autoFocus value={dialog.value} onChange={(event) => setDialog({ ...dialog, value: event.target.value })} onKeyDown={(event) => event.key === 'Enter' && saveCategory()} placeholder="Kategoriename" /><div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setDialog(null)}>Abbrechen</button><button className="primary-button" type="button" onClick={saveCategory}>Speichern</button></div></div></div>}</section>
}
