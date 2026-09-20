import type { Project } from '../../projectTypes'
import type { FormEvent } from 'react'
import './ProjectSettings.css'
import ProjectInformation from './ProjectInformation'
import ProjectGoal from './ProjectGoal'
import ProjectCategoryTags from './ProjectCategoryTags'
import ProjectImage from './ProjectImage'
import ProjectManagement from './ProjectManagement'

export default function ProjectSettings({ project, onSave, onDelete, categories }: { project: Project; onSave: (changes: Partial<Project>) => void; onDelete: () => void; categories: string[] }) {
  const handleDelete = () => {
    if (window.confirm('Dieses Projekt wird unwiderruflich gelöscht. Möchtest du wirklich mit Ja bestätigen?')) onDelete()
  }
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    onSave({
      name: String(data.get('name') ?? '').trim(),
      description: String(data.get('description') ?? '').trim(),
      goal: String(data.get('goal') ?? '').trim(),
      category: String(data.get('category') ?? ''),
      tags: String(data.get('tags') ?? '').split(',').map((tag) => tag.trim()).filter(Boolean),
      image: String(data.get('image') ?? 'default'),
    })
  }

  return <form className="project-settings" onSubmit={handleSubmit}><div className="settings-main"><ProjectInformation project={project} /><ProjectGoal project={project} /><ProjectCategoryTags project={project} categories={categories} /></div><aside className="settings-side"><ProjectImage project={project} /><ProjectManagement onDelete={handleDelete} /></aside></form>
}
