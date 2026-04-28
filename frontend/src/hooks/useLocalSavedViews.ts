import { useMemo, useState } from 'react'
import type { SavedSearchItem } from '@/components/ui/SavedSearch'

function buildStorageKey(scope: string) {
  return `hr_saved_views_${scope}`
}

function loadSavedViews(storageKey: string): SavedSearchItem[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = window.localStorage.getItem(storageKey)
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useLocalSavedViews(scope: string) {
  const storageKey = useMemo(() => buildStorageKey(scope), [scope])
  const [savedViews, setSavedViews] = useState<SavedSearchItem[]>(() => loadSavedViews(storageKey))

  function persist(next: SavedSearchItem[]) {
    setSavedViews(next)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, JSON.stringify(next))
    }
  }

  function saveView(name: string, filters: Record<string, unknown>) {
    const next: SavedSearchItem[] = [
      ...savedViews.filter(view => view.name.toLowerCase() !== name.toLowerCase()),
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        filters,
      },
    ]
    persist(next)
  }

  function deleteView(id: string | number) {
    persist(savedViews.filter(view => view.id !== id))
  }

  return {
    savedViews,
    saveView,
    deleteView,
  }
}
