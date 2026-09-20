import { useEffect, useState } from 'react'
import type { Project } from '../domain/project'
import { projectStorage } from '../services/storage/projectStorage'
import { createId } from '../services/storage/storageUtils'

export default function useProjects() {
  const [projects, setProjects] = useState<Project[]>(projectStorage.read)

  useEffect(() => {
    projectStorage.save(projects)
  }, [projects])

  const addProject = (project: Omit<Project, 'id'>) => {
    const nextProject = { ...project, id: createId() }
    setProjects((current) => [...current, nextProject])
    return nextProject
  }

  const updateProject = (id: number, changes: Partial<Project>) => {
    setProjects((current) => current.map((project) =>
      project.id === id ? { ...project, ...changes } : project,
    ))
  }

  const removeProject = (id: number) => {
    setProjects((current) => current.filter((project) => project.id !== id))
  }

  return { projects, setProjects, addProject, updateProject, removeProject }
}
