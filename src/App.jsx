import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Categories from './components/Categories'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
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
          <Categories />
        </div>
      </div>
    </div>
  )
}

export default App
