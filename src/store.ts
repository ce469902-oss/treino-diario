import { useCallback, useEffect, useState } from 'react'
import type { AppData } from './types'

export const defaultData: AppData = {
  profile: null,
  onboardingComplete: false,
  tasksByDate: {}, workouts: [], meals: [], water: [], recovery: [], weights: [], photos: [], favorites: [],
  settings: { theme: 'dark', reducedMotion: false, largeText: false, reminders: false }
}

const KEY = 'evolve:data:v1'

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...defaultData, ...JSON.parse(raw) } : defaultData
  } catch { return defaultData }
}

export function useAppStore() {
  const [data, setData] = useState<AppData>(loadData)
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(data)) }, [data])
  const update = useCallback((recipe: (current: AppData) => AppData) => setData(current => recipe(current)), [])
  const reset = useCallback(() => { localStorage.removeItem(KEY); setData(defaultData) }, [])
  return { data, update, reset }
}

export function exportData(data: AppData) {
  const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), data }, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url; anchor.download = `evolve-backup-${new Date().toISOString().slice(0, 10)}.json`; anchor.click()
  URL.revokeObjectURL(url)
}
