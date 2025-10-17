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
  rank: string
  price: number
  youtubeUrl: string
}

function AdminPanel({ setIsAuthenticated }: AdminPanelProps) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'ruble' | 'accounts'>('ruble')
  
  // Ruble settings
  const [rubleRate, setRubleRate] = useState('')
  const [rubleLoading, setRubleLoading] = useState(false)
  const [rubleSuccess, setRubleSuccess] = useState(false)

  // Accounts
  const [accounts, setAccounts] = useState<Account[]>([])
  const [accountsLoading, setAccountsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rank: '',
    price: '',
    youtubeUrl: '',
  })

  useEffect(() => {
    loadRubleRate()
    loadAccounts()
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
      const response = await axios.get(`${API_URL}/api/settings`)
      setRubleRate(response.data.rubleRate.toString())
    } catch (error) {
      console.error('Xəta:', error)
    }
  }

  const handleRubleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRubleLoading(true)
    setRubleSuccess(false)

    try {
      await axios.put(
        `${API_URL}/api/settings`,
        { rubleRate: parseFloat(rubleRate) },
        getAuthHeaders()
      )
      setRubleSuccess(true)
      setTimeout(() => setRubleSuccess(false), 3000)
    } catch (error) {
      console.error('Xəta:', error)
    }

    setRubleLoading(false)
  }

  const loadAccounts = async () => {
    setAccountsLoading(true)
    try {
      const response = await axios.get(`${API_URL}/api/accounts`)
      setAccounts(response.data)
    } catch (error) {
      console.error('Xəta:', error)
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

      setFormData({ name: '', description: '', rank: '', price: '', youtubeUrl: '' })
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
      rank: account.rank,
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
    setFormData({ name: '', description: '', rank: '', price: '', youtubeUrl: '' })
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
                    <label className="block text-gray-300 mb-2">{t('admin.panel.rank')}</label>
                    <input
                      type="text"
                      value={formData.rank}
                      onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                      placeholder={t('admin.panel.rankPlaceholder')}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:outline-none transition-colors"
                      required
                    />
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
                          <span className="text-neon-blue text-sm">🏆 {t('accounts.rank')}:</span>
                          <span className="text-white text-sm font-semibold">{account.rank}</span>
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

