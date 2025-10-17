import { useState } from 'react'
import axios from 'axios'
import { useLanguage } from '../context/LanguageContext'
import LanguageSelector from '../components/LanguageSelector'

const API_URL = import.meta.env.VITE_API_URL || ''

interface Account {
  id: number
  name: string
  description: string
  rank: string
  price: number
  youtubeUrl: string
}


function HomePage() {
  const { t } = useLanguage()
  const [view, setView] = useState<'home' | 'ruble' | 'accounts'>('home')
  const [rubleRate, setRubleRate] = useState<number | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(false)
  const [showRubleModal, setShowRubleModal] = useState(false)
  const [rubleForm, setRubleForm] = useState({
    nickname: '',
    email: '',
    rubleAmount: '',
    receiptUrl: ''
  })

  const handleRubleClick = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/api/settings`)
      setRubleRate(response.data.rubleRate)
      setView('ruble')
    } catch (error) {
      console.error('Xəta:', error)
    }
    setLoading(false)
  }

  const handleAccountsClick = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/api/accounts`)
      setAccounts(response.data)
      setView('accounts')
    } catch (error) {
      console.error('Xəta:', error)
    }
    setLoading(false)
  }

  const getYoutubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`
    }
    return url
  }

  const handleBuyClick = (account: Account) => {
    const message = `*Yeni Satınalma Tələbi*\n\n` +
      `*Hesab:* ${account.name}\n` +
      `*Rütbə:* ${account.rank}\n` +
      `*Qiymət:* ${account.price} Manat\n` +
      `*Video:* ${account.youtubeUrl}`
    
    const whatsappUrl = `https://wa.me/994553474687?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleBuyRubleClick = () => {
    setShowRubleModal(true)
  }

  const handleRubleSubmit = () => {
    const message = `*Rubl Alışı Tələbi*\n\n` +
      `*Nickname:* ${rubleForm.nickname}\n` +
      `*Email:* ${rubleForm.email}\n` +
      `*Rubl Sayı:* ${rubleForm.rubleAmount}\n` +
      `*Çek:* ${rubleForm.receiptUrl}`
    
    const whatsappUrl = `https://wa.me/994553474687?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setShowRubleModal(false)
    setRubleForm({ nickname: '', email: '', rubleAmount: '', receiptUrl: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-neon-purple/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue">
                {t('header.title')}
              </span>
            </h1>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {view === 'home' && (
          <div className="flex flex-col items-center justify-center space-y-8 min-h-[60vh]">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">{t('home.welcome')}</h2>
              <p className="text-gray-400">{t('home.selectOption')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
              <button
                onClick={handleRubleClick}
                disabled={loading}
                className="group relative p-8 bg-gray-800/50 border-2 border-neon-blue/50 rounded-xl hover:border-neon-blue transition-all duration-300 hover:shadow-neon-blue disabled:opacity-50"
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">💰</div>
                  <h3 className="text-2xl font-bold text-neon-blue mb-2">{t('home.rublePrice')}</h3>
                  <p className="text-gray-400">{t('home.rublePriceDesc')}</p>
                </div>
              </button>

              <button
                onClick={handleAccountsClick}
                disabled={loading}
                className="group relative p-8 bg-gray-800/50 border-2 border-neon-pink/50 rounded-xl hover:border-neon-pink transition-all duration-300 hover:shadow-neon-pink disabled:opacity-50"
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">🎮</div>
                  <h3 className="text-2xl font-bold text-neon-pink mb-2">{t('home.accounts')}</h3>
                  <p className="text-gray-400">{t('home.accountsDesc')}</p>
                </div>
              </button>
            </div>

            <a
              href="/admin/login"
              className="mt-8 text-sm text-gray-500 hover:text-neon-purple transition-colors"
            >
              {t('home.adminLogin')}
            </a>
          </div>
        )}

        {view === 'ruble' && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setView('home')}
              className="mb-6 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {t('common.back')}
            </button>

            <div className="bg-gray-800/50 border-2 border-neon-blue rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">{t('ruble.title')}</h2>
              <div className="text-6xl font-bold text-neon-blue mb-4">
                {rubleRate !== null ? rubleRate.toFixed(2) : '---'}
              </div>
              <p className="text-gray-400 text-xl mb-6">{t('ruble.rate').replace('{rate}', rubleRate !== null ? rubleRate.toFixed(2) : '---')}</p>
              
              <button
                onClick={handleBuyRubleClick}
                className="px-8 py-3 bg-gradient-to-r from-neon-blue to-cyan-500 text-white font-bold rounded-lg hover:shadow-neon-blue transition-all duration-300"
              >
                💰 {t('common.buy')}
              </button>
            </div>
          </div>
        )}

        {view === 'accounts' && (
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => setView('home')}
              className="mb-6 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {t('common.back')}
            </button>

            <h2 className="text-3xl font-bold text-white mb-8 text-center">{t('accounts.title')}</h2>

            {accounts.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <p className="text-xl">{t('accounts.noAccounts')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="bg-gray-800/50 border-2 border-neon-pink/50 rounded-xl overflow-hidden hover:border-neon-pink transition-all duration-300 hover:shadow-neon-pink"
                  >
                    {account.youtubeUrl && (
                      <div className="aspect-video bg-black overflow-hidden">
                        <iframe
                          width="100%"
                          height="100%"
                          src={getYoutubeEmbedUrl(account.youtubeUrl)}
                          title={account.name}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-neon-pink mb-3">{account.name}</h3>
                      <p className="text-gray-300 mb-4">{account.description}</p>
                      
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-neon-blue">🏆 {t('accounts.rank')}:</span>
                          <span className="text-white font-semibold">{account.rank}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-neon-green">💰 {t('accounts.price')}:</span>
                          <span className="text-white font-semibold text-xl">{account.price} {t('accounts.rubleUnit')}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBuyClick(account)}
                        className="w-full py-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold rounded-lg hover:shadow-neon-pink transition-all duration-300"
                      >
                        🛒 {t('common.buy')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rubl Purchase Modal */}
        {showRubleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 border border-cyan-500">
              <h3 className="text-xl font-bold mb-4 text-cyan-400">
                {t('purchase.rubleTitle')}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">
                    {t('purchase.accountName')}
                  </label>
                  <input
                    type="text"
                    value={rubleForm.nickname}
                    onChange={(e) => setRubleForm({...rubleForm, nickname: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 focus:outline-none text-white"
                    placeholder="Nickname"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    {t('purchase.accountEmail')}
                  </label>
                  <input
                    type="email"
                    value={rubleForm.email}
                    onChange={(e) => setRubleForm({...rubleForm, email: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 focus:outline-none text-white"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    {t('purchase.rubleAmount')}
                  </label>
                  <input
                    type="number"
                    value={rubleForm.rubleAmount}
                    onChange={(e) => setRubleForm({...rubleForm, rubleAmount: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 focus:outline-none text-white"
                    placeholder="Rubl sayı"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    {t('purchase.receiptUrl')}
                  </label>
                  <input
                    type="url"
                    value={rubleForm.receiptUrl}
                    onChange={(e) => setRubleForm({...rubleForm, receiptUrl: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-cyan-500 focus:outline-none text-white"
                    placeholder="Çek URL"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleRubleSubmit}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-medium transition-colors"
                  >
                    {t('purchase.sendWhatsapp')}
                  </button>
                  <button
                    onClick={() => setShowRubleModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

    </div>
  )
}

export default HomePage

