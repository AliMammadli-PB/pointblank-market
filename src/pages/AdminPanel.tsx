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
}

function AdminPanel({ setIsAuthenticated }: AdminPanelProps) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'ruble' | 'accounts' | 'boost'>('ruble')
  
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
    misyaPrice: ''
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
  })

  useEffect(() => {
    loadRubleRate()
    loadAccounts()
    loadBoostSettings()
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
      setBoostSettings({
        battlePassPrice: response.data.battlePassPrice.toString(),
        rankPrice: response.data.rankPrice.toString(),
        rutbePrice: response.data.rutbePrice.toString(),
        misyaPrice: response.data.misyaPrice.toString()
      })
    } catch (error) {
      console.error('[ADMIN] ❌ Boost ayarları hatası:', error)
    }
  }

  const handleBoostSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBoostLoading(true)
    setBoostSuccess(false)

    try {
      console.log('[ADMIN] Boost fiyatları güncelleniyor:', boostSettings)
      await axios.put(
        `${API_URL}/api/boost-settings`,
        {
          battlePassPrice: parseFloat(boostSettings.battlePassPrice),
          rankPrice: parseFloat(boostSettings.rankPrice),
          rutbePrice: parseFloat(boostSettings.rutbePrice),
          misyaPrice: parseFloat(boostSettings.misyaPrice)
        },
        getAuthHeaders()
      )
      console.log('[ADMIN] ✅ Boost fiyatları güncellendi!')
      setBoostSuccess(true)
      setTimeout(() => setBoostSuccess(false), 3000)
    } catch (error) {
      console.error('[ADMIN] ❌ Boost güncelleme hatası:', error)
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

      setFormData({ name: '', description: '', rankGif: '0.gif', price: '', youtubeUrl: '' })
      setShowForm(false)
      setEditingAccount(null)
      loadAccounts()
    } catch (error) {
      console.error('Xəta:', error)
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
    })
    setShowForm(true)
  }

  const handleDeleteAccount = async (id: number) => {
    if (!confirm(t('admin.panel.deleteConfirm'))) return

    try {
      await axios.delete(`${API_URL}/api/accounts/${id}`, getAuthHeaders())
      loadAccounts()
    } catch (error) {
      console.error('Xəta:', error)
    }
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingAccount(null)
    setFormData({ name: '', description: '', rankGif: '0.gif', price: '', youtubeUrl: '' })
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
      </div>
    </div>
  )
}

export default AdminPanel

