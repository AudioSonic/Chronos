import { projectCategories } from '../../domain/project'

const storageKey = 'chronos.categories'

const readCategories = (): string[] => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) || 'null')
    return Array.isArray(value) && value.every((category) => typeof category === 'string') ? value : [...projectCategories]
  } catch {
    return [...projectCategories]
  }
}

const saveCategories = (categories: string[]) => localStorage.setItem(storageKey, JSON.stringify(categories))
export const categoryStorage = { read: readCategories, save: saveCategories }
