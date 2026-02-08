import stage1Data from './stage-1.json'
import stage2Data from './stage-2.json'
import stage3Data from './stage-3.json'
import stage4Data from './stage-4.json'
import stage5Data from './stage-5.json'
import stage6Data from './stage-6.json'
import stage7Data from './stage-7.json'
import stage8Data from './stage-8.json'

export interface LessonSection {
  id: string
  title: string
  content: string
}

export interface Lesson {
  id: string
  day: number
  title: string
  conceptGoal?: string
  noCode?: boolean
  sections?: LessonSection[]
}

export interface Stage {
  id: string
  title: string
  weeks: string
  lessons: Lesson[]
}

export interface Curriculum {
  stages: Stage[]
}

const stage1Lessons: Lesson[] = (stage1Data as { lessons: Lesson[] }).lessons
const stage2Lessons: Lesson[] = (stage2Data as { lessons: Lesson[] }).lessons
const stage3Lessons: Lesson[] = (stage3Data as { lessons: Lesson[] }).lessons
const stage4Lessons: Lesson[] = (stage4Data as { lessons: Lesson[] }).lessons
const stage5Lessons: Lesson[] = (stage5Data as { lessons: Lesson[] }).lessons
const stage6Lessons: Lesson[] = (stage6Data as { lessons: Lesson[] }).lessons
const stage7Lessons: Lesson[] = (stage7Data as { lessons: Lesson[] }).lessons
const stage8Lessons: Lesson[] = (stage8Data as { lessons: Lesson[] }).lessons

const curriculum: Curriculum = {
  stages: [
    {
      id: '1',
      title: '理解電腦的思維方式',
      weeks: 'Week 1-2',
      lessons: stage1Lessons,
    },
    {
      id: '2',
      title: '讓程式做決定',
      weeks: 'Week 3-5',
      lessons: stage2Lessons,
    },
    {
      id: '3',
      title: '重複的力量',
      weeks: 'Week 6-8',
      lessons: stage3Lessons,
    },
    {
      id: '4',
      title: '組織你的程式',
      weeks: 'Week 9-11',
      lessons: stage4Lessons,
    },
    {
      id: '5',
      title: '資料結構',
      weeks: 'Week 12-14',
      lessons: stage5Lessons,
    },
    {
      id: '6',
      title: '檔案與實用技能',
      weeks: 'Week 15-16',
      lessons: stage6Lessons,
    },
    {
      id: '7',
      title: '物件導向思維',
      weeks: 'Week 17-18',
      lessons: stage7Lessons,
    },
    {
      id: '8',
      title: '綜合專案',
      weeks: 'Week 19-22',
      lessons: stage8Lessons,
    },
  ],
}

export function getCurriculum(): Curriculum {
  return curriculum
}

export function getLesson(stageId: string, lessonId: string): Lesson | null {
  const stage = curriculum.stages.find((s) => s.id === stageId)
  if (!stage) return null
  return stage.lessons.find((l) => l.id === lessonId) ?? null
}
