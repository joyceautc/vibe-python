import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useProgress } from './ProgressProvider'
import { getCurriculum } from '../content/curriculum'

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { completedLessonIds } = useProgress()
  const curriculum = getCurriculum()
  const totalLessons = curriculum.stages.reduce((sum, s) => sum + s.lessons.length, 0)
  const completedCount = completedLessonIds.length

  const isHome = location.pathname === '/'
  const isStage = location.pathname.startsWith('/stage/')

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-left">
          {!isHome && (
            <Link
              to={isStage ? '/' : location.pathname.startsWith('/lesson/') ? `/stage/${location.pathname.split('/')[2]}` : '/'}
              className="header-back"
              aria-label="返回"
            >
              ←
            </Link>
          )}
          <Link to="/" className="site-title">
            🌱 Python 花園
          </Link>
        </div>
        <span className="header-progress">
          {completedCount}/{totalLessons} 堂課完成
        </span>
      </header>
      <main className="layout-main">
        {children}
      </main>
      <footer className="layout-footer">
        <p className="footer-text">🌸 派姨陪你從零開始學 Python 🌸</p>
      </footer>
    </div>
  )
}
