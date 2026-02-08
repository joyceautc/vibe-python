import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useProgress } from './ProgressProvider'
import { getCurriculum, getLesson } from '../content/curriculum'
import { ContentRenderer } from './ContentRenderer'

const SECTION_LABELS: Record<string, string> = {
  intro: '🌅 引入',
  concept: '💡 概念',
  demo: '🔬 示範',
  practice: '✏️ 實作',
  summary: '📝 總結',
}

export function LessonView() {
  const { stageId, lessonId } = useParams<{ stageId: string; lessonId: string }>()
  const { isCompleted, markComplete, setLastVisited } = useProgress()

  if (!stageId || !lessonId) return <p>缺少課程或單元參數。</p>

  const lesson = getLesson(stageId, lessonId)
  if (!lesson) return <p>找不到這堂課。</p>

  useEffect(() => {
    setLastVisited(lesson.id)
  }, [lesson.id, setLastVisited])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [lessonId])

  const curriculum = getCurriculum()
  const stage = curriculum.stages.find((s) => s.id === stageId)
  const lessonIndex = stage?.lessons.findIndex((l) => l.id === lessonId) ?? -1
  const prevLesson = lessonIndex > 0 ? stage?.lessons[lessonIndex - 1] : null
  const nextLesson = lessonIndex >= 0 && stage && lessonIndex < stage.lessons.length - 1
    ? stage.lessons[lessonIndex + 1]
    : null

  const completed = isCompleted(lesson.id)

  return (
    <article className="lesson-view">
      <nav className="breadcrumb">
        <Link to="/">課程地圖</Link>
        {stage && (
          <>
            <span className="breadcrumb-sep">›</span>
            <Link to={`/stage/${stage.id}`}>{stage.title}</Link>
          </>
        )}
        <span className="breadcrumb-sep">›</span>
        <span>Day {lesson.day}</span>
      </nav>

      <h1>{lesson.title}</h1>

      {lesson.conceptGoal && (
        <div className="concept-goal">
          🎯 {lesson.conceptGoal}
        </div>
      )}

      {lesson.noCode && (
        <span className="badge no-code">📖 無程式碼</span>
      )}

      <div className="lesson-sections">
        {lesson.sections?.map((sec, index) => (
          <section
            key={sec.id}
            className={`lesson-section section-${sec.id}`}
            style={{ '--index': index } as React.CSSProperties}
          >
            <h2>{SECTION_LABELS[sec.id] || sec.title}</h2>
            <ContentRenderer content={sec.content} />
          </section>
        ))}
      </div>

      <div className="lesson-actions">
        <button
          type="button"
          className={`complete-btn${completed ? ' completed' : ''}`}
          onClick={() => markComplete(lesson.id)}
        >
          {completed ? (
            <>
              <span className="check-icon">✓</span>
              已完成
            </>
          ) : (
            '標記為完成'
          )}
        </button>
      </div>

      <nav className="lesson-nav">
        {prevLesson ? (
          <Link to={`/lesson/${stageId}/${prevLesson.id}`} className="nav-prev">
            ← 上一課
          </Link>
        ) : (
          <span />
        )}
        {nextLesson ? (
          <Link to={`/lesson/${stageId}/${nextLesson.id}`} className="nav-next">
            下一課 →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  )
}
