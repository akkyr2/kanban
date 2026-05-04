import { Routes, Route } from 'react-router-dom'
import './App.css'
import KanbanPage from './components/Layout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<KanbanPage />} />
    </Routes>
  )
}

export default App
