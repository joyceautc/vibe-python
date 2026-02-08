import { useParams, Link } from 'react-router-dom'
import { useProgress } from './ProgressProvider'
import { getCurriculum } from '../content/curriculum'
import { ProgressBar } from './ProgressBar'

const STAGE_COLORS = [
  '#F5A623', // Stage 1: amber
  '#7BAD6B', // Stage 2: sage
  '#D97B8A', // Stage 3: dusty rose
  '#4A7AA0', // Stage 4: slate blue
  '#CC7A14', // Stage 5: burnt orange
  '#8B7EC8', // Stage 6: lavender
  '#5E8F50', // Stage 7: forest green
  '#C4915E', // Stage 8: warm tan
]

export function StageMap() {
  const { stageId } = useParams()
  const { isCompleted, lastVisitedLessonId } = useProgress()
  const curriculum = getCurriculum()

  // Stage detail view (lesson list)
  if (stageId) {
    const stageIndex = curriculum.stages.findIndex((s) => s.id === stageId)
    const stage = curriculum.stages[stageIndex]
    if (!stage) return <p>找不到這個階段。</p>
    const stageColor = STAGE_COLORS[stageIndex] || STAGE_COLORS[0]

    return (
      <section className="stage-map">
        <div className="stage-header">
          <h1>{stage.title}</h1>
          <p className="stage-weeks">{stage.weeks}</p>
        </div>
        <ul className="lesson-list">
          {stage.lessons.map((lesson, i) => {
            const completed = isCompleted(lesson.id)
            const isLastVisited = lastVisitedLessonId === lesson.id
            return (
              <li
                key={lesson.id}
                className={`lesson-row${isLastVisited ? ' last-visited' : ''}`}
                style={{ '--index': i } as React.CSSProperties}
              >
                <Link to={`/lesson/${stage.id}/${lesson.id}`}>
                  <span
                    className="lesson-day-badge"
                    style={{ background: stageColor }}
                  >
                    {lesson.day}
                  </span>
                  <span className="lesson-row-title">{lesson.title}</span>
                  {completed && (
                    <span className="lesson-check" aria-label="已完成">✓</span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
        <Link to="/" className="back-link">← 回到課程地圖</Link>
      </section>
    )
  }

  // Home view (all stages)
  const totalLessons = curriculum.stages.reduce((s, st) => s + st.lessons.length, 0)
  const totalCompleted = curriculum.stages.reduce(
    (s, st) => s + st.lessons.filter((l) => isCompleted(l.id)).length, 0
  )

  // Find a resume target
  let resumeLink: string | null = null
  if (lastVisitedLessonId) {
    for (const stage of curriculum.stages) {
      const lesson = stage.lessons.find((l) => l.id === lastVisitedLessonId)
      if (lesson) {
        resumeLink = `/lesson/${stage.id}/${lesson.id}`
        break
      }
    }
  }

  return (
    <section className="stage-map">
      <div className="stage-map-header">
        <h1>🌿 課程地圖</h1>
        <p className="subtitle">派姨陪你從零開始學 Python</p>
        <div className="global-progress">
          🌱 {totalCompleted}/{totalLessons} 堂課完成
        </div>
        {resumeLink && (
          <div>
            <Link to={resumeLink} className="resume-link">
              ▶ 繼續上次的課程
            </Link>
          </div>
        )}
      </div>
      <ul className="stage-cards">
        {curriculum.stages.map((stage, index) => {
          const completed = stage.lessons.filter((l) => isCompleted(l.id)).length
          const total = stage.lessons.length
          const color = STAGE_COLORS[index]
          return (
            <li
              key={stage.id}
              className="stage-card"
              style={{ '--index': index, '--stage-color': color } as React.CSSProperties}
            >
              <Link to={`/stage/${stage.id}`}>
                <div className="stage-card-title">{stage.title}</div>
                <div className="stage-card-weeks">{stage.weeks} · {total} 堂課</div>
                <div className="stage-card-progress">
                  <ProgressBar completed={completed} total={total} color={color} />
                  <span className="stage-card-progress-text">
                    {completed}/{total} 堂課完成
                  </span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
