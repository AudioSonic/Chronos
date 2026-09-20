import { useEffect, useState } from 'react'
import { categoryStorage } from '../services/storage/categoryStorage'

export default function useCategories() {
  const [categories, setCategories] = useState(categoryStorage.read)
  useEffect(() => categoryStorage.save(categories), [categories])
  return { categories, setCategories }
}
