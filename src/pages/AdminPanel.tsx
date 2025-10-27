import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import LanguageSelector from '../components/LanguageSelector'

const API_URL = import.meta.env.VITE_API_URL || ''

interface AdminPanelProps {
  setIsAuthenticated: (value: boolean) => void
}

interface Account {
  id: number
  name: string
  description: string
  rankGif: string
  price: number
  youtubeUrl: string
  creditPercentage?: number
}

function AdminPanel({ setIsAuthenticated }: AdminPanelProps) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'ruble' | 'accounts' | 'boost' | 'bit'>('ruble')
  
  // Available rank gifs (0.gif to 53.gif)
  const rankGifs = Array.from({ length: 54 }, (_, i) => `${i}.gif`)
  
  // Ruble settings
  const [rubleRate, setRubleRate] = useState('')
  const [rubleLoading, setRubleLoading] = useState(false)
  const [rubleSuccess, setRubleSuccess] = useState(false)

  // Boost settings
  const [boostSettings, setBoostSettings] = useState({
    battlePassPrice: '',
    rankPrice: '',
    rutbePrice: '',
    misyaPrice: '',
    macroPrice: ''
  })
  const [boostLoading, setBoostLoading] = useState(false)
  const [boostSuccess, setBoostSuccess] = useState(false)

  // Accounts
  const [accounts, setAccounts] = useState<Account[]>([])
  const [accountsLoading, setAccountsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rankGif: '0.gif',
    price: '',
    youtubeUrl: '',
    creditPercentage: '40',
  })

  // Bit settings
  const [bitLinks, setBitLinks] = useState<Record<string, string>>({})
  const [newVersion, setNewVersion] = useState('')
  const [newLink, setNewLink] = useState('')
  const [bitLoading, setBitLoading] = useState(false)
  const [bitSuccess, setBitSuccess] = useState(false)

  useEffect(() => {
    // Check token validity first
    const token = localStorage.getItem('token')
    if (!token) {
      handleLogout()
      return
    }

    loadRubleRate()
    loadAccounts()
    loadBoostSettings()
    loadBitLinks()
  }, [])

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    navigate('/admin/login')
  }

  const loadRubleRate = async () => {
    try {
      console.log('[ADMIN] Ruble rate yükleniyor...')
      const response = await axios.get(`${API_URL}/api/settings`)
      console.log('[ADMIN] ✅ Ruble rate yüklendi:', response.data.rubleRate)
      setRubleRate(response.data.rubleRate.toString())
    } catch (error) {
      console.error('[ADMIN] ❌ Ruble rate hatası:', error)
    }
  }

  const handleRubleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRubleLoading(true)
    setRubleSuccess(false)

    try {
      console.log('[ADMIN] Ruble rate güncelleniyor:', rubleRate)
      await axios.put(
        `${API_URL}/api/settings`,
        { rubleRate: parseFloat(rubleRate) },
        getAuthHeaders()
      )
      console.log('[ADMIN] ✅ Ruble rate güncellendi!')
      setRubleSuccess(true)
      setTimeout(() => setRubleSuccess(false), 3000)
    } catch (error) {
      console.error('[ADMIN] ❌ Ruble rate güncelleme hatası:', error)
    }

    setRubleLoading(false)
  }

  const loadBoostSettings = async () => {
    try {
      console.log('[ADMIN] Boost ayarları yükleniyor...')
      const response = await axios.get(`${API_URL}/api/boost-settings`)
      console.log('[ADMIN] ✅ Boost ayarları yüklendi:', response.data)
      console.log('[ADMIN] Raw data:', JSON.stringify(response.data, null, 2))
      setBoostSettings({
        battlePassPrice: response.data.battlePassPrice?.toString() || '0',
        rankPrice: response.data.rankPrice?.toString() || '0',
        rutbePrice: response.data.rutbePrice?.toString() || '0',
        misyaPrice: response.data.misyaPrice?.toString() || '0',
        macroPrice: response.data.macroPrice?.toString() || '0'
      })
    } catch (error: any) {
      console.error('[ADMIN] ❌ Boost ayarları hatası:', error)
      console.error('[ADMIN] ❌ Error message:', error.message)
      console.error('[ADMIN] ❌ Error response:', error.response)
    }
  }

  const handleBoostSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBoostLoading(true)
    setBoostSuccess(false)

    const payload = {
      battlePassPrice: parseFloat(boostSettings.battlePassPrice),
      rankPrice: parseFloat(boostSettings.rankPrice),
      rutbePrice: parseFloat(boostSettings.rutbePrice),
      misyaPrice: parseFloat(boostSettings.misyaPrice),
      macroPrice: parseFloat(boostSettings.macroPrice)
    }

    try {
      console.log('[ADMIN] Boost fiyatları güncelleniyor:', boostSettings)
      console.log('[ADMIN] Payload:', JSON.stringify(payload, null, 2))
      console.log('[ADMIN] API URL:', `${API_URL}/api/boost-settings`)
      console.log('[ADMIN] Token:', localStorage.getItem('token')?.substring(0, 20) + '...')
      
      const response = await axios.put(
        `${API_URL}/api/boost-settings`,
        payload,
        getAuthHeaders()
      )
      
      console.log('[ADMIN] ✅ Boost fiyatları güncellendi!', response.data)
      setBoostSuccess(true)
      setTimeout(() => setBoostSuccess(false), 3000)
    } catch (error: any) {
      console.error('[ADMIN] ❌ Boost güncelleme hatası - FULL ERROR:', error)
      console.error('[ADMIN] ❌ Error name:', error.name)
      console.error('[ADMIN] ❌ Error message:', error.message)
      console.error('[ADMIN] ❌ Error stack:', error.stack)
      console.error('[ADMIN] ❌ Error response:', error.response)
      console.error('[ADMIN] ❌ Response data:', error.response?.data)
      console.error('[ADMIN] ❌ Response status:', error.response?.status)
      console.error('[ADMIN] ❌ Response headers:', error.response?.headers)
      
      const errorMsg = error.response?.data?.error || error.message || 'Bilinmeyen hata'
      alert(`Boost güncelleme hatası:\n${errorMsg}\n\nDetay için console'a bakın`)
    }

    setBoostLoading(false)
  }

  const loadAccounts = async () => {
    setAccountsLoading(true)
    try {
      console.log('[ADMIN] Hesaplar yükleniyor...')
      const response = await axios.get(`${API_URL}/api/accounts`)
      console.log('[ADMIN] ✅ Hesaplar yüklendi:', response.data.length, 'hesap')
      setAccounts(response.data)
    } catch (error) {
      console.error('[ADMIN] ❌ Hesaplar yükleme hatası:', error)
    }
    setAccountsLoading(false)
  }

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingAccount) {
        await axios.put(
          `${API_URL}/api/accounts/${editingAccount.id}`,
          formData,
          getAuthHeaders()
        )
      } else {
        await axios.post(`${API_URL}/api/accounts`, formData, getAuthHeaders())
      }

      setFormData({ name: '', description: '', rankGif: '0.gif', price: '', youtubeUrl: '', creditPercentage: '40' })
      setShowForm(false)
      setEditingAccount(null)
      loadAccounts()
    } catch (error: any) {
      console.error('[ADMIN] ❌ Hesap kaydetme hatası:', error)
      console.error('[ADMIN] ❌ Hata detayı:', error.response?.data || error.message)
      alert(`Hesap kaydetme hatası: ${error.response?.data?.error || error.message}`)
    }
  }

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account)
    setFormData({
      name: account.name,
      description: account.description,
      rankGif: account.rankGif,
      price: account.price.toString(),
      youtubeUrl: account.youtubeUrl,
      creditPercentage: (account.creditPercentage || 40).toString(),
    })
    setShowForm(true)
  }

  const handleDeleteAccount = async (id: number) => {
    if (!confirm(t('admin.panel.deleteConfirm'))) return

    try {
      await axios.delete(`${API_URL}/api/accounts/${id}`, getAuthHeaders())
      loadAccounts()
    } catch (error: any) {
      console.error('[ADMIN] ❌ Hesap silme hatası:', error)
      console.error('[ADMIN] ❌ Hata detayı:', error.response?.data || error.message)
      alert(`Hesap silme hatası: ${error.response?.data?.error || error.message}`)
    }
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingAccount(null)
    setFormData({ name: '', description: '', rankGif: '0.gif', price: '', youtubeUrl: '', creditPercentage: '40' })
  }

  const loadBitLinks = async () => {
    try {
      console.log('[ADMIN] Bit linkleri yükleniyor...')
      const response = await axios.get(`${API_URL}/api/settings`)
      console.log('[ADMIN] ✅ Bit linkleri yüklendi:', response.data.bitDownloadLinks)
      setBitLinks(response.data.bitDownloadLinks || {})
    } catch (error) {
      console.error('[ADMIN] ❌ Bit linkleri hatası:', error)
      setBitLinks({})
    }
  }

  const handleBitAdd = async () => {
    if (!newVersion.trim() || !newLink.trim()) {
      alert('Versiyon ve link boş olamaz!')
      return
    }

    setBitLoading(true)
    setBitSuccess(false)

    try {
      const updatedLinks = {
        ...bitLinks,
        [newVersion]: newLink
      }

      await axios.put(
        `${API_URL}/api/settings`,
        { bitDownloadLinks: updatedLinks },
        getAuthHeaders()
      )

      setBitLinks(updatedLinks)
      setNewVersion('')
      setNewLink('')
      setBitSuccess(true)
      setTimeout(() => setBitSuccess(false), 3000)
    } catch (error) {
      console.error('[ADMIN] ❌ Hack linki ekleme hatası:', error)
      alert('Hack linki eklenemedi!')
    }

    setBitLoading(false)
  }

  const handleBitDelete = async (version: string) => {
    if (!confirm(`${version} versiyonunu silmek istediğinize emin misiniz?`)) return

    setBitLoading(true)

    try {
      const updatedLinks = { ...bitLinks }
      delete updatedLinks[version]

      await axios.put(
        `${API_URL}/api/settings`,
        { bitDownloadLinks: updatedLinks },
        getAuthHeaders()
      )

      setBitLinks(updatedLinks)
      setBitSuccess(true)
      setTimeout(() => setBitSuccess(false), 3000)
    } catch (error) {
      console.error('[ADMIN] ❌ Hack linki silme hatası:', error)
      alert('Hack linki silinemedi!')
    }

    setBitLoading(false)
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-neon-purple/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue">
                {t('header.adminPanel')}
              </span>
            </h1>
            <div className="flex gap-4 items-center">
              <LanguageSelector />
              <a
                href="/"
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {t('header.mainPage')}
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('common.logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('ruble')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'ruble'
                ? 'text-neon-blue border-b-2 border-neon-blue'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('admin.panel.rubleTab')}
          </button>
          <button
            onClick={() => setActiveTab('boost')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'boost'
                ? 'text-neon-purple border-b-2 border-neon-purple'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Boost Qiymətləri
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'accounts'
                ? 'text-neon-pink border-b-2 border-neon-pink'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('admin.panel.accountsTab')}
          </button>
          <button
            onClick={() => setActiveTab('bit')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'bit'
                ? 'text-green-500 border-b-2 border-green-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎮 Hack Download
          </button>
        </div>

        {/* Ruble Tab */}
        {activeTab === 'ruble' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800/50 border-2 border-neon-blue/50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">{t('admin.panel.rubleTitle')}</h2>

              {rubleSuccess && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm">
                  {t('admin.panel.rubleSuccess')}
                </div>
              )}

              <form onSubmit={handleRubleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">{t('admin.panel.rubleLabel')}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={rubleRate}
                    onChange={(e) => setRubleRate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-neon-blue focus:outline-none transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={rubleLoading}
                  className="w-full py-3 bg-gradient-to-r from-neon-blue to-cyan-500 text-white font-bold rounded-lg hover:shadow-neon-blue transition-all duration-300 disabled:opacity-50"
                >
                  {rubleLoading ? t('admin.panel.updating') : t('common.update')}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Boost Tab */}
        {activeTab === 'boost' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800/50 border-2 border-neon-purple/50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">🚀 Boost Qiymətləri</h2>

              {boostSuccess && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm">
                  Boost qiymətləri uğurla yeniləndi!
                </div>
              )}

              <form onSubmit={handleBoostSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">🎯 Battle Pass Qiyməti (Manat)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={boostSettings.battlePassPrice}
                    onChange={(e) => setBoostSettings({ ...boostSettings, battlePassPrice: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">⭐ Rank Boost Qiyməti (Manat)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={boostSettings.rankPrice}
                    onChange={(e) => setBoostSettings({ ...boostSettings, rankPrice: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">🎖️ Rütbə Boost Qiyməti (Manat)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={boostSettings.rutbePrice}
                    onChange={(e) => setBoostSettings({ ...boostSettings, rutbePrice: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">📋 Misya Boost Qiyməti (Manat)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={boostSettings.misyaPrice}
                    onChange={(e) => setBoostSettings({ ...boostSettings, misyaPrice: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">⚡ Macro Qiyməti (Manat)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={boostSettings.macroPrice}
                    onChange={(e) => setBoostSettings({ ...boostSettings, macroPrice: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={boostLoading}
                  className="w-full py-3 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold rounded-lg hover:shadow-neon-purple transition-all duration-300 disabled:opacity-50"
                >
                  {boostLoading ? 'Yenilənir...' : 'Qiymətləri Yenilə'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Accounts Tab */}
        {activeTab === 'accounts' && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">{t('admin.panel.accountsTitle')}</h2>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold rounded-lg hover:shadow-neon-pink transition-all duration-300"
                >
                  {t('admin.panel.newAccount')}
                </button>
              )}
            </div>

            {showForm && (
              <div className="bg-gray-800/50 border-2 border-neon-purple/50 rounded-xl p-8 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  {editingAccount ? t('admin.panel.editAccount') : t('admin.panel.addAccount')}
                </h3>

                <form onSubmit={handleAccountSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">{t('admin.panel.accountName')}</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">{t('admin.panel.description')}</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none transition-colors"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Rütbə GIF</label>
                    <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                      {rankGifs.map((gif) => (
                        <div key={gif} className="relative">
                          <input
                            type="radio"
                            id={gif}
                            name="rankGif"
                            value={gif}
                            checked={formData.rankGif === gif}
                            onChange={(e) => setFormData({ ...formData, rankGif: e.target.value })}
                            className="sr-only"
                          />
                          <label
                            htmlFor={gif}
                            className={`block cursor-pointer border-2 rounded p-1 transition-colors ${
                              formData.rankGif === gif 
                                ? 'border-neon-blue bg-blue-500/20' 
                                : 'border-gray-600 hover:border-gray-500'
                            }`}
                          >
                            <img
                              src={`/assets/rutbe/${gif}`}
                              alt={`Rank ${gif}`}
                              className="w-full h-8 object-cover rounded"
                            />
                            <div className="text-xs text-center text-gray-400 mt-1">
                              {gif.replace('.gif', '')}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">{t('admin.panel.price')}</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">{t('admin.panel.youtubeUrl')}</label>
                    <input
                      type="url"
                      value={formData.youtubeUrl}
                      onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Kredit Faizi (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.creditPercentage}
                      onChange={(e) => setFormData({ ...formData, creditPercentage: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none transition-colors"
                      required
                    />
                    <p className="text-gray-500 text-xs mt-1">İlkin ödəniş faizi (məsələn: 40 = %40)</p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold rounded-lg hover:shadow-neon-pink transition-all duration-300"
                    >
                      {editingAccount ? t('common.update') : t('common.add')}
                    </button>
                    <button
                      type="button"
                      onClick={cancelForm}
                      className="flex-1 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {accountsLoading ? (
              <div className="text-center text-gray-400 py-12">{t('common.loading')}</div>
            ) : accounts.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <p className="text-xl">{t('admin.panel.noAccountsYet')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="bg-gray-800/50 border-2 border-gray-700 rounded-xl overflow-hidden hover:border-neon-pink transition-all duration-300"
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2">{account.name}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{account.description}</p>
                      
                      <div className="mb-3 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-neon-blue text-sm">🏆 Rütbə:</span>
                          <img 
                            src={`/assets/rutbe/${account.rankGif}`}
                            alt={`Rank ${account.rankGif}`}
                            className="w-8 h-8 object-cover rounded"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-neon-green text-sm">💰 {t('accounts.price')}:</span>
                          <span className="text-white text-sm font-semibold">{account.price} {t('accounts.rubleUnit')}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditAccount(account)}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {t('common.edit')}
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(account.id)}
                          className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                        >
                          {t('common.delete')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bit Tab */}
        {activeTab === 'bit' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 border-2 border-green-500/50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">🎮 Hack Download Links</h2>

              {bitSuccess && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm">
                  Hack linkler başarıyla güncellendi!
                </div>
              )}

              {/* Add new version */}
              <div className="bg-gray-900/50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Yeni Versiyon Ekle</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Versiyon</label>
                    <input
                      type="text"
                      value={newVersion}
                      onChange={(e) => setNewVersion(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
                      placeholder="v1.0"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Download Link</label>
                    <input
                      type="url"
                      value={newLink}
                      onChange={(e) => setNewLink(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleBitAdd}
                      disabled={bitLoading}
                      className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {bitLoading ? 'Ekleniyor...' : 'Ekle'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Existing versions */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Mevcut Versiyonlar</h3>
                
                {Object.keys(bitLinks).length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    Henüz versiyon eklenmemiş
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(bitLinks).map(([version, link]) => (
                      <div
                        key={version}
                        className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-green-500 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-white mb-1">Versiyon: {version}</div>
                          <div className="text-sm text-gray-400 break-all">{link}</div>
                        </div>
                        <button
                          onClick={() => handleBitDelete(version)}
                          disabled={bitLoading}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
                        >
                          Sil
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminPanel

