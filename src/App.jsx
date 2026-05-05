import { Routes, Route } from 'react-router-dom'
import './App.css'
import KanbanPage from './components/Layout'
import UsersList from './components/UsersList'

function App() {
  return (
    <Routes>
      <Route path="/" element={<KanbanPage />} />
      <Route path="/users" element={<UsersList />} />
    </Routes>
  )
}

export default App
