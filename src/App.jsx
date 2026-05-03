import { useState } from 'react'
import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom'
// import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Layout>  
      <Routes>
        <Route path="/" element={<h1>hello</h1>} />
      </Routes>
    </Layout>
  )
}{}

export default App
