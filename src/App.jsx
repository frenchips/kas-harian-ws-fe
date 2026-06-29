import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Categories from './pages/Categories'
import Kas from './pages/Kas'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Router>
      <div className="app-container">
        {sidebarOpen && (
          <div 
            className="sidebar-overlay active" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main-content-wrapper">
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/kas" element={<Kas />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
