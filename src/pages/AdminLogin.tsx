import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import LanguageSelector from '../components/LanguageSelector'

const API_URL = import.meta.env.VITE_API_URL || ''

interface AdminLoginProps {
  setIsAuthenticated: (value: boolean) => void
}

function AdminLogin({ setIsAuthenticated }: AdminLoginProps) {
  const { t } = useLanguage()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Generate 6-digit random captcha
  const generateCaptcha = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000)
    setCaptcha(randomNum.toString())
    setCaptchaInput('')
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validate captcha
    if (captchaInput !== captcha) {
      setError('Captcha yanlışdır!')
      generateCaptcha()
      return
    }
    
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password,
      })

      localStorage.setItem('token', response.data.token)
      setIsAuthenticated(true)
      navigate('/admin/panel')
    } catch (error: any) {
      setError(error.response?.data?.error || 'Giriş xətası')
      generateCaptcha() // Generate new captcha on error
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue">
              {t('header.title')}
            </span>
          </h1>
          <p className="text-gray-400">{t('header.adminPanel')}</p>
        </div>

        <div className="bg-gray-800/50 border-2 border-neon-purple/50 rounded-xl p-8 shadow-neon-purple/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">{t('admin.login.title')}</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">{t('admin.login.username')}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">{t('admin.login.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Captcha</label>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-center">
                    <span className="text-2xl font-bold text-neon-blue select-none">{captcha}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  title="Yenile"
                >
                  🔄
                </button>
              </div>
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none transition-colors mt-2"
                placeholder="Captcha kodunu girin"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold rounded-lg hover:shadow-neon-purple transition-all duration-300 disabled:opacity-50"
            >
              {loading ? t('admin.login.loggingIn') : t('admin.login.loginButton')}
            </button>
          </form>

          <a
            href="/"
            className="block mt-6 text-center text-sm text-gray-500 hover:text-neon-blue transition-colors"
          >
            ← {t('header.mainPage')}
          </a>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin

