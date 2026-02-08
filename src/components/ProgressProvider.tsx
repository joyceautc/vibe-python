import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

const STORAGE_KEY = 'python-garden-progress'

export interface ProgressState {
  completedLessonIds: string[]
  lastVisitedLessonId: string | null
  lastUpdated: number
}

const defaultState: ProgressState = {
  completedLessonIds: [],
  lastVisitedLessonId: null,
  lastUpdated: 0,
}

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw) as ProgressState
    return {
      completedLessonIds: Array.isArray(parsed.completedLessonIds) ? parsed.completedLessonIds : [],
      lastVisitedLessonId: parsed.lastVisitedLessonId ?? null,
      lastUpdated: typeof parsed.lastUpdated === 'number' ? parsed.lastUpdated : 0,
    }
  } catch {
    return defaultState
  }
}

function saveProgress(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

type ProgressContextValue = ProgressState & {
  isCompleted: (lessonId: string) => boolean
  markComplete: (lessonId: string) => void
  setLastVisited: (lessonId: string) => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadProgress)

  useEffect(() => {
    saveProgress(state)
  }, [state])

  const isCompleted = useCallback(
    (lessonId: string) => state.completedLessonIds.includes(lessonId),
    [state.completedLessonIds]
  )

  const markComplete = useCallback((lessonId: string) => {
    setState((prev) => {
      if (prev.completedLessonIds.includes(lessonId)) return prev
      return {
        ...prev,
        completedLessonIds: [...prev.completedLessonIds, lessonId],
        lastUpdated: Date.now(),
      }
    })
  }, [])

  const setLastVisited = useCallback((lessonId: string) => {
    setState((prev) => ({
      ...prev,
      lastVisitedLessonId: lessonId,
      lastUpdated: Date.now(),
    }))
  }, [])

  const value: ProgressContextValue = {
    ...state,
    isCompleted,
    markComplete,
    setLastVisited,
  }

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
