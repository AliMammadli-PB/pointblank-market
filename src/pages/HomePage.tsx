import { useState } from 'react'
import axios from 'axios'
import { useLanguage } from '../context/LanguageContext'
import LanguageSelector from '../components/LanguageSelector'

const API_URL = import.meta.env.VITE_API_URL || ''

interface Account {
  id: number
  name: string
  description: string
  rankGif: string
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
      `*Rütbə:* ${account.rankGif.replace('.gif', '')}\n` +
      `*Qiymət:* ${account.price} Manat\n` +
      `*Video:* ${account.youtubeUrl}`
    
    const whatsappUrl = `https://wa.me/79271031033?text=${encodeURIComponent(message)}`
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
    
    const whatsappUrl = `https://wa.me/79271031033?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setShowRubleModal(false)
    setRubleForm({ nickname: '', email: '', rubleAmount: '', receiptUrl: '' })
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-white">
              {t('header.title')}
            </h1>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        {view === 'home' && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">{t('home.welcome')}</h2>
              <p className="text-gray-400 text-lg">{t('home.selectOption')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Rubl */}
              <button
                onClick={handleRubleClick}
                disabled={loading}
                className="clean-card p-8 rounded-lg hover:bg-white/5 disabled:opacity-50 text-left group"
              >
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400">Rubl</h3>
                <p className="text-gray-400 text-sm">{t('home.rublePriceDesc')}</p>
              </button>

              {/* Boost */}
              <a
                href="/boost"
                className="clean-card p-8 rounded-lg hover:bg-white/5 text-left group"
              >
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400">Boost</h3>
                <p className="text-gray-400 text-sm">Səviyyə yüksəltmə</p>
              </a>

              {/* Hesablar */}
              <button
                onClick={handleAccountsClick}
                disabled={loading}
                className="clean-card p-8 rounded-lg hover:bg-white/5 disabled:opacity-50 text-left group"
              >
                <div className="text-4xl mb-4">🎮</div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-pink-400">Hesablar</h3>
                <p className="text-gray-400 text-sm">{t('home.accountsDesc')}</p>
              </button>
            </div>
          </div>
        )}

        {view === 'ruble' && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setView('home')}
              className="mb-8 text-gray-400 hover:text-white"
            >
              ← {t('common.back')}
            </button>

            <div className="clean-card rounded-lg p-10 text-center">
              <h2 className="text-3xl font-bold text-white mb-8">{t('ruble.title')}</h2>
              <div className="text-6xl font-bold text-white mb-6">
                {rubleRate !== null ? rubleRate.toFixed(2) : '---'}
              </div>
              <p className="text-gray-400 mb-8">{t('ruble.rate').replace('{rate}', rubleRate !== null ? rubleRate.toFixed(2) : '---')}</p>
              
              <button
                onClick={handleBuyRubleClick}
                className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200"
              >
                {t('common.buy')}
              </button>
            </div>
          </div>
        )}

        {view === 'accounts' && (
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => setView('home')}
              className="mb-8 text-gray-400 hover:text-white"
            >
              ← {t('common.back')}
            </button>

            <h2 className="text-3xl font-bold text-white mb-10">{t('accounts.title')}</h2>

            {accounts.length === 0 ? (
              <div className="clean-card rounded-lg p-12 text-center">
                <p className="text-gray-400">{t('accounts.noAccounts')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="clean-card rounded-lg overflow-hidden"
                  >
                    {account.youtubeUrl && (
                      <div className="aspect-video bg-black">
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
                      <h3 className="text-xl font-semibold text-white mb-2">{account.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{account.description}</p>
                      
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm">Rütbə:</span>
                          <img 
                            src={`/assets/rutbe/${account.rankGif}`}
                            alt="Rank"
                            className="w-8 h-8"
                          />
                        </div>
                        <div className="text-white font-semibold text-lg">
                          {account.price} ₼
                        </div>
                      </div>

                      <button
                        onClick={() => handleBuyClick(account)}
                        className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200"
                      >
                        {t('common.buy')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rubl Modal */}
        {showRubleModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="clean-card rounded-lg p-8 w-full max-w-md">
              <h3 className="text-2xl font-bold text-white mb-6">
                {t('purchase.rubleTitle')}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    {t('purchase.accountName')}
                  </label>
                  <input
                    type="text"
                    value={rubleForm.nickname}
                    onChange={(e) => setRubleForm({...rubleForm, nickname: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-gray-800 rounded-lg text-white focus:border-gray-600 focus:outline-none"
                    placeholder="Nickname"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    {t('purchase.accountEmail')}
                  </label>
                  <input
                    type="email"
                    value={rubleForm.email}
                    onChange={(e) => setRubleForm({...rubleForm, email: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-gray-800 rounded-lg text-white focus:border-gray-600 focus:outline-none"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    {t('purchase.rubleAmount')}
                  </label>
                  <input
                    type="number"
                    value={rubleForm.rubleAmount}
                    onChange={(e) => setRubleForm({...rubleForm, rubleAmount: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-gray-800 rounded-lg text-white focus:border-gray-600 focus:outline-none"
                    placeholder="Rubl sayı"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    {t('purchase.receiptUrl')}
                  </label>
                  <input
                    type="text"
                    value={rubleForm.receiptUrl}
                    onChange={(e) => setRubleForm({...rubleForm, receiptUrl: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-gray-800 rounded-lg text-white focus:border-gray-600 focus:outline-none"
                    placeholder="Çek URL"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleRubleSubmit}
                    className="flex-1 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200"
                  >
                    {t('purchase.sendWhatsapp')}
                  </button>
                  <button
                    onClick={() => setShowRubleModal(false)}
                    className="flex-1 py-3 bg-white/5 text-white font-semibold rounded-lg hover:bg-white/10 border border-gray-800"
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
