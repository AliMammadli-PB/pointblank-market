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
    <div className="min-h-screen animated-bg relative overflow-hidden">
      {/* Animated Particles Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-neon-purple rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-neon-pink rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-neon-blue rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="glass-strong border-b border-white/10 relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl md:text-5xl font-bold float">
              <span className="gradient-text">
                {t('header.title')}
              </span>
            </h1>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 relative z-10">
        {view === 'home' && (
          <div className="flex flex-col items-center justify-center space-y-12 min-h-[70vh]">
            <div className="text-center mb-8 space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold gradient-text animate-fade-in">{t('home.welcome')}</h2>
              <p className="text-gray-300 text-lg md:text-xl">{t('home.selectOption')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
              {/* Rubl Card */}
              <button
                onClick={handleRubleClick}
                disabled={loading}
                className="group relative card-shine glass hover-scale overflow-hidden rounded-2xl p-8 border border-neon-blue/30 hover:border-neon-blue disabled:opacity-50 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative text-center space-y-4">
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">💰</div>
                  <h3 className="text-3xl font-bold text-neon-blue">Rubl</h3>
                  <p className="text-gray-300">{t('home.rublePriceDesc')}</p>
                  <div className="h-1 w-16 mx-auto bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </button>

              {/* Boost Card */}
              <a
                href="/boost"
                className="group relative card-shine glass hover-scale overflow-hidden rounded-2xl p-8 border border-neon-purple/30 hover:border-neon-purple transition-all duration-500 pulse-glow"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative text-center space-y-4">
                  <div className="text-6xl mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">🚀</div>
                  <h3 className="text-3xl font-bold text-neon-purple">Boost</h3>
                  <p className="text-gray-300">Səviyyə yüksəltmə</p>
                  <div className="h-1 w-16 mx-auto bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-br from-neon-pink to-neon-purple text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">YENİ</div>
                </div>
              </a>

              {/* Hesablar Card */}
              <button
                onClick={handleAccountsClick}
                disabled={loading}
                className="group relative card-shine glass hover-scale overflow-hidden rounded-2xl p-8 border border-neon-pink/30 hover:border-neon-pink disabled:opacity-50 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative text-center space-y-4">
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🎮</div>
                  <h3 className="text-3xl font-bold text-neon-pink">Hesablar</h3>
                  <p className="text-gray-300">{t('home.accountsDesc')}</p>
                  <div className="h-1 w-16 mx-auto bg-gradient-to-r from-transparent via-neon-pink to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </button>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-12">
              <div className="glass rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="text-white font-semibold mb-2">Sürətli Çatdırılma</h4>
                <p className="text-gray-400 text-sm">24/7 dəstək</p>
              </div>
              <div className="glass rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">🛡️</div>
                <h4 className="text-white font-semibold mb-2">Güvənli Ödəniş</h4>
                <p className="text-gray-400 text-sm">Tam təhlükəsiz</p>
              </div>
              <div className="glass rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">⭐</div>
                <h4 className="text-white font-semibold mb-2">Premium Keyfiyyət</h4>
                <p className="text-gray-400 text-sm">Ən yaxşı qiymət</p>
              </div>
            </div>

          </div>
        )}

        {view === 'ruble' && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setView('home')}
              className="mb-6 px-6 py-3 glass hover-scale rounded-xl text-white hover:bg-white/10 transition-all duration-300 border border-white/20"
            >
              ← {t('common.back')}
            </button>

            <div className="glass-strong rounded-3xl p-10 text-center border border-neon-blue/30 card-shine overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
              <div className="relative">
                <h2 className="text-4xl font-bold gradient-text mb-8">{t('ruble.title')}</h2>
                <div className="relative inline-block mb-8">
                  <div className="text-7xl md:text-8xl font-bold text-neon-blue animate-pulse">
                    {rubleRate !== null ? rubleRate.toFixed(2) : '---'}
                  </div>
                  <div className="absolute -inset-4 bg-neon-blue/20 blur-2xl -z-10 animate-pulse"></div>
                </div>
                <p className="text-gray-300 text-xl mb-8">{t('ruble.rate').replace('{rate}', rubleRate !== null ? rubleRate.toFixed(2) : '---')}</p>
                
                <button
                  onClick={handleBuyRubleClick}
                  className="px-10 py-4 bg-gradient-to-r from-neon-blue to-cyan-500 text-white font-bold rounded-xl hover-scale shadow-xl hover:shadow-neon-blue transition-all duration-300 text-lg"
                >
                  💰 {t('common.buy')}
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'accounts' && (
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => setView('home')}
              className="mb-6 px-6 py-3 glass hover-scale rounded-xl text-white hover:bg-white/10 transition-all duration-300 border border-white/20"
            >
              ← {t('common.back')}
            </button>

            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-12 text-center">{t('accounts.title')}</h2>

            {accounts.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">🎮</div>
                <p className="text-xl text-gray-300">{t('accounts.noAccounts')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="glass-strong card-shine rounded-2xl overflow-hidden border border-neon-pink/30 hover:border-neon-pink transition-all duration-500 hover-scale group"
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
                    
                    <div className="p-6 space-y-4">
                      <h3 className="text-2xl font-bold text-neon-pink group-hover:scale-105 transition-transform">{account.name}</h3>
                      <p className="text-gray-300 leading-relaxed">{account.description}</p>
                      
                      <div className="space-y-3 bg-black/30 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-neon-blue flex items-center gap-2">
                            <span>🏆</span>
                            <span>Rütbə:</span>
                          </span>
                          <img 
                            src={`/assets/rutbe/${account.rankGif}`}
                            alt={`Rank ${account.rankGif}`}
                            className="w-10 h-10 object-cover rounded-lg shadow-lg"
                          />
                        </div>
                        <div className="h-px bg-gradient-to-r from-transparent via-neon-pink to-transparent"></div>
                        <div className="flex items-center justify-between">
                          <span className="text-neon-green flex items-center gap-2">
                            <span>💰</span>
                            <span>{t('accounts.price')}:</span>
                          </span>
                          <span className="text-white font-bold text-2xl">{account.price} ₼</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBuyClick(account)}
                        className="w-full py-4 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue text-white font-bold rounded-xl hover-scale shadow-xl hover:shadow-neon-pink transition-all duration-300 text-lg"
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-strong rounded-3xl p-8 w-full max-w-md border border-neon-blue/30 card-shine">
              <h3 className="text-3xl font-bold mb-6 gradient-text">
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
                    className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:border-neon-blue focus:outline-none text-white placeholder-gray-400 transition-colors"
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
                    className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:border-neon-blue focus:outline-none text-white placeholder-gray-400 transition-colors"
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
                    className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:border-neon-blue focus:outline-none text-white placeholder-gray-400 transition-colors"
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
                    className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:border-neon-blue focus:outline-none text-white placeholder-gray-400 transition-colors"
                    placeholder="Çek URL"
                  />
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={handleRubleSubmit}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover-scale text-white py-4 px-6 rounded-xl font-bold shadow-xl hover:shadow-green-500/50 transition-all duration-300"
                  >
                    {t('purchase.sendWhatsapp')} 📱
                  </button>
                  <button
                    onClick={() => setShowRubleModal(false)}
                    className="flex-1 glass hover:bg-white/10 text-white py-4 px-6 rounded-xl font-semibold border border-white/20 transition-all duration-300"
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

