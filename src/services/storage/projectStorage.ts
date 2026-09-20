import type { Project } from '../../domain/project'

const storageKey = 'chronos.projects'

const readProjects = (): Project[] => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) || '[]')
    if (!Array.isArray(value)) return []

    return value.filter((project): project is Project => Boolean(project && typeof project === 'object'))
  } catch {
    return []
  }
}

const saveProjects = (projects: Project[]) => {
  localStorage.setItem(storageKey, JSON.stringify(projects))
}

export const projectStorage = { read: readProjects, save: saveProjects }
