import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { StageMap } from './components/StageMap'
import { LessonView } from './components/LessonView'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<StageMap />} />
        <Route path="/stage/:stageId" element={<StageMap />} />
        <Route path="/lesson/:stageId/:lessonId" element={<LessonView />} />
      </Routes>
    </Layout>
  )
}

export default App
