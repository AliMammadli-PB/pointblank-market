import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BoostPage from './pages/BoostPage'
import MacroPage from './pages/MacroPage'
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'
import HackAdminPanel from './pages/HackAdminPanel'
import { useState, useEffect } from 'react'
import { LanguageProvider } from './context/LanguageContext'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/boost" element={<BoostPage />} />
          <Route path="/macro" element={<MacroPage />} />
          <Route 
            path="/admin/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/admin/panel" /> : 
              <AdminLogin setIsAuthenticated={setIsAuthenticated} />
            } 
          />
          <Route 
            path="/admin/panel" 
            element={
              isAuthenticated ? 
              <AdminPanel setIsAuthenticated={setIsAuthenticated} /> : 
              <Navigate to="/admin/login" />
            } 
          />
          <Route 
            path="/panda/panda" 
            element={
              isAuthenticated ? 
              <HackAdminPanel /> : 
              <Navigate to="/admin/login" />
            } 
          />
        </Routes>
      </Router>
    </LanguageProvider>
  )
}

export default App
