import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import LanguageSelector from '../components/LanguageSelector'

const API_URL = import.meta.env.VITE_API_URL || ''

interface HackUser {
  id: number
  username: string
  password: string
  is_active: boolean
  subscription_end: string | null
  public_ip: string | null
  created_at: string
  updated_at: string
}

function HackAdminPanel() {
  const navigate = useNavigate()
  const [hackUsers, setHackUsers] = useState<HackUser[]>([])
  const [hackUsersLoading, setHackUsersLoading] = useState(false)
  const [showHackForm, setShowHackForm] = useState(false)
  const [editingHackUser, setEditingHackUser] = useState<HackUser | null>(null)
  const [hackFormData, setHackFormData] = useState({
    username: '',
    password: '',
    is_active: true,
    subscription_days: '30'
  })

  useEffect(() => {
    loadHackUsers()
  }, [])

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/admin/login')
  }

  // Hack Users functions
  const loadHackUsers = async () => {
    setHackUsersLoading(true)
    try {
      console.log('[HACK_ADMIN] Hack kullanıcıları yükleniyor...')
      const response = await axios.get(`${API_URL}/api/users`, getAuthHeaders())
      console.log('[HACK_ADMIN] ✅ Hack kullanıcıları yüklendi:', response.data.length, 'kullanıcı')
      setHackUsers(response.data)
    } catch (error: any) {
      console.error('[HACK_ADMIN] ❌ Hack users yükleme hatası:', error)
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('Oturum süresi doldu. Lütfen tekrar giriş yapın.')
        handleLogout()
      }
    }
    setHackUsersLoading(false)
  }

  const handleHackUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Calculate subscription_end
    const days = parseInt(hackFormData.subscription_days)
    const subscription_end = new Date()
    subscription_end.setDate(subscription_end.getDate() + days)

    const payload = {
      username: hackFormData.username,
      password: hackFormData.password,
      is_active: hackFormData.is_active,
      subscription_end: subscription_end.toISOString()
    }

    console.log('[HACK_ADMIN] 📤 Hack kullanıcı kaydetme başlıyor...')
    console.log('[HACK_ADMIN] Payload:', JSON.stringify(payload, null, 2))

    try {
      const headers = getAuthHeaders()

      if (editingHackUser) {
        console.log('[HACK_ADMIN] PUT request gönderiliyor...')
        await axios.put(
          `${API_URL}/api/users/${editingHackUser.id}`,
          payload,
          headers
        )
      } else {
        console.log('[HACK_ADMIN] POST request gönderiliyor...')
        await axios.post(`${API_URL}/api/users`, payload, headers)
      }

      console.log('[HACK_ADMIN] ✅ Hack kullanıcı başarıyla kaydedildi!')
      setHackFormData({ username: '', password: '', is_active: true, subscription_days: '30' })
      setShowHackForm(false)
      setEditingHackUser(null)
      loadHackUsers()
    } catch (error: any) {
      console.error('[HACK_ADMIN] ❌ Hack kullanıcı kaydetme hatası:', error)
      alert(`Hack kullanıcı kaydetme hatası: ${error.response?.data?.error || error.message}`)
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('Oturum süresi doldu. Lütfen tekrar giriş yapın.')
        handleLogout()
      }
    }
  }

  const handleEditHackUser = (user: HackUser) => {
    const days = user.subscription_end ? Math.ceil((new Date(user.subscription_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 30
    setEditingHackUser(user)
    setHackFormData({
      username: user.username,
      password: '', // Don't set password when editing
      is_active: user.is_active,
      subscription_days: days.toString()
    })
    setShowHackForm(true)
  }

  const handleDeleteHackUser = async (id: number) => {
    console.log('[HACK_ADMIN] 🔴 Sil butonuna tıklandı - ID:', id)
    console.log('[HACK_ADMIN] ID tipi:', typeof id)
    console.log('[HACK_ADMIN] API URL:', `${API_URL}/api/users/${id}`)
    
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      console.log('[HACK_ADMIN] ❌ Silme iptal edildi (kullanıcı reddetti)')
      return
    }

    try {
      console.log('[HACK_ADMIN] 📤 DELETE request gönderiliyor...')
      console.log('[HACK_ADMIN] Headers:', getAuthHeaders())
      
      const response = await axios.delete(`${API_URL}/api/users/${id}`, getAuthHeaders())
      
      console.log('[HACK_ADMIN] ✅ DELETE response:', response.status)
      console.log('[HACK_ADMIN] Response data:', response.data)
      
      console.log('[HACK_ADMIN] 🔄 Kullanıcılar yeniden yükleniyor...')
      await loadHackUsers()
      console.log('[HACK_ADMIN] ✅ Kullanıcılar yeniden yüklendi')
    } catch (error: any) {
      console.error('[HACK_ADMIN] ❌ Silme hatası:', error)
      console.error('[HACK_ADMIN] ❌ Error response:', error.response)
      console.error('[HACK_ADMIN] ❌ Error status:', error.response?.status)
      console.error('[HACK_ADMIN] ❌ Error data:', error.response?.data)
      
      alert(`Kullanıcı silme hatası: ${error.response?.data?.error || error.message}`)
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('Oturum süresi doldu. Lütfen tekrar giriş yapın.')
        handleLogout()
      }
    }
  }

  const cancelHackForm = () => {
    setShowHackForm(false)
    setEditingHackUser(null)
    setHackFormData({ username: '', password: '', is_active: true, subscription_days: '30' })
  }

  const formatRemainingTime = (subscription_end: string | null) => {
    if (!subscription_end) return 'Süre yok'
    
    const end = new Date(subscription_end)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Süre doldu'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days} gün ${hours} saat`
    if (hours > 0) return `${hours} saat ${minutes} dakika`
    return `${minutes} dakika kaldı`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-red-500/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-700 to-red-500">
                🐍 Hack Admin Panel
              </span>
            </h1>
            <div className="flex gap-4 items-center">
              <LanguageSelector />
              <a
                href="/"
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Ana Sayfa
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">🐍 Hack Kullanıcıları</h2>
            {!showHackForm && (
              <button
                onClick={() => setShowHackForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:shadow-red-500/50 transition-all duration-300"
              >
                + Yeni Kullanıcı
              </button>
            )}
          </div>

          {showHackForm && (
            <div className="bg-gray-800/50 border-2 border-red-500/50 rounded-xl p-8 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">
                {editingHackUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
              </h3>

              <form onSubmit={handleHackUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Kullanıcı Adı</label>
                  <input
                    type="text"
                    value={hackFormData.username}
                    onChange={(e) => setHackFormData({ ...hackFormData, username: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Şifre</label>
                  <input
                    type="password"
                    value={hackFormData.password}
                    onChange={(e) => setHackFormData({ ...hackFormData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
                    required={!editingHackUser}
                    placeholder={editingHackUser ? "Boş bırakırsanız değişmez" : ""}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Aktif Durumu</label>
                  <select
                    value={hackFormData.is_active ? 'true' : 'false'}
                    onChange={(e) => setHackFormData({ ...hackFormData, is_active: e.target.value === 'true' })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
                  >
                    <option value="true">Aktif</option>
                    <option value="false">Pasif</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Abonelik Süresi (Gün)</label>
                  <input
                    type="number"
                    min="1"
                    value={hackFormData.subscription_days}
                    onChange={(e) => setHackFormData({ ...hackFormData, subscription_days: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:shadow-red-500/50 transition-all duration-300"
                  >
                    {editingHackUser ? 'Güncelle' : 'Ekle'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelHackForm}
                    className="flex-1 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          )}

          {hackUsersLoading ? (
            <div className="text-center text-gray-400 py-12">Yükleniyor...</div>
          ) : hackUsers.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p className="text-xl">Henüz kullanıcı yok</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {hackUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-gray-800/50 border-2 border-gray-700 rounded-xl p-6 hover:border-red-500 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{user.username}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          user.is_active 
                            ? 'bg-green-500/20 text-green-400 border border-green-500' 
                            : 'bg-red-500/20 text-red-400 border border-red-500'
                        }`}>
                          {user.is_active ? '✓ Aktif' : '✗ Pasif'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Kalan Süre:</span>
                          <span className={`ml-2 font-semibold ${
                            formatRemainingTime(user.subscription_end).includes('doldu')
                              ? 'text-red-400'
                              : formatRemainingTime(user.subscription_end).includes('Süre yok')
                              ? 'text-yellow-400'
                              : 'text-green-400'
                          }`}>
                            {formatRemainingTime(user.subscription_end)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Oluşturulma:</span>
                          <span className="ml-2 text-white">
                            {new Date(user.created_at).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">IP Adresi:</span>
                          <span className="ml-2 text-white font-mono text-xs">
                            {user.public_ip || 'Henüz atanmadı'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditHackUser(user)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDeleteHackUser(user.id)}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HackAdminPanel

