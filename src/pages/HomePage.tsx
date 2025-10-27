import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { DollarSign, TrendingUp, Gamepad2, ArrowLeft, ShoppingCart, Zap, Download, Wallet } from 'lucide-react'
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
  creditPercentage?: number
}

interface CreditModalState {
  show: boolean
  account: Account | null
}

function HomePage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [view, setView] = useState<'home' | 'ruble' | 'accounts' | 'bit'>('home')
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
  const [creditModal, setCreditModal] = useState<CreditModalState>({ show: false, account: null })
  const [acceptCreditTerms, setAcceptCreditTerms] = useState(false)

  // URL'e göre view'i sync et
  useEffect(() => {
    console.log('[HOMEPAGE] URL değişti:', location.pathname, location.search)
    const params = new URLSearchParams(location.search)
    const viewParam = params.get('view')
    console.log('[HOMEPAGE] View parametresi:', viewParam)
    
    if (viewParam === 'ruble' || viewParam === 'accounts') {
      console.log('[HOMEPAGE] View değiştiriliyor:', viewParam)
      setView(viewParam)
      if (viewParam === 'ruble') {
        console.log('[HOMEPAGE] Ruble rate yükleniyor...')
        fetchRubleRate()
      } else if (viewParam === 'accounts') {
        console.log('[HOMEPAGE] Accounts yükleniyor...')
        fetchAccounts()
      }
    } else {
      console.log('[HOMEPAGE] Ana sayfaya dönülüyor...')
      setView('home')
    }
  }, [location.search])

  const fetchRubleRate = async () => {
    try {
      console.log('[HOMEPAGE] API isteği: /api/settings')
      const response = await axios.get(`${API_URL}/api/settings`)
      console.log('[HOMEPAGE] ✅ Ruble rate yüklendi:', response.data.rubleRate)
      setRubleRate(response.data.rubleRate)
    } catch (error) {
      console.error('[HOMEPAGE] ❌ Ruble rate hatası:', error)
    }
  }

  const fetchAccounts = async () => {
    try {
      console.log('[HOMEPAGE] API isteği: /api/accounts')
      const response = await axios.get(`${API_URL}/api/accounts`)
      console.log('[HOMEPAGE] ✅ Accounts yüklendi:', response.data.length, 'hesap')
      setAccounts(response.data)
    } catch (error) {
      console.error('[HOMEPAGE] ❌ Accounts hatası:', error)
    }
  }

  const handleRubleClick = async () => {
    console.log('[HOMEPAGE] Ruble butonuna tıklandı')
    setLoading(true)
    navigate('/?view=ruble')
    setLoading(false)
  }

  const handleAccountsClick = async () => {
    console.log('[HOMEPAGE] Hesaplar butonuna tıklandı')
    setLoading(true)
    navigate('/?view=accounts')
    setLoading(false)
  }

  const handleBackToHome = () => {
    console.log('[HOMEPAGE] Geri butonuna tıklandı, ana sayfaya dönülüyor')
    navigate('/')
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

  const handleCreditClick = (account: Account) => {
    setCreditModal({ show: true, account })
    setAcceptCreditTerms(false)
  }

  const handleCreditSubmit = () => {
    if (!acceptCreditTerms) {
      alert(t('accounts.mustAcceptTerms'))
      return
    }

    if (!creditModal.account) return

    const account = creditModal.account
    const percentage = (account.creditPercentage || 40) / 100
    const initialPayment = Math.round(account.price * percentage)
    const remainingPayment = account.price - initialPayment

    const message = `*${t('accounts.creditRequest')}*\n\n` +
      `*Hesab:* ${account.name}\n` +
      `*Rütbə:* ${account.rankGif.replace('.gif', '')}\n` +
      `*Ümumi Qiymət:* ${account.price} Manat\n` +
      `*İlkin Ödəniş (${account.creditPercentage || 40}%):* ${initialPayment} Manat\n` +
      `*Qalan Ödəniş:* ${remainingPayment} Manat (1 ay ərzində)\n` +
      `*Video:* ${account.youtubeUrl}\n\n` +
      `✅ Kredit şərtlərini qəbul etdim`
    
    const whatsappUrl = `https://wa.me/79271031033?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setCreditModal({ show: false, account: null })
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Rubl */}
              <button
                onClick={handleRubleClick}
                disabled={loading}
                className="clean-card p-8 rounded-lg hover:bg-white/5 disabled:opacity-50 text-left group transition-all"
              >
                <div className="mb-4 text-blue-400 group-hover:scale-110 transition-transform inline-block">
                  <DollarSign size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Rubl</h3>
                <p className="text-gray-400 text-sm">{t('home.rublePriceDesc')}</p>
              </button>

              {/* Boost */}
              <a
                href="/boost"
                className="clean-card p-8 rounded-lg hover:bg-white/5 text-left group transition-all"
              >
                <div className="mb-4 text-purple-400 group-hover:scale-110 transition-transform inline-block">
                  <TrendingUp size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t('home.boostTitle')}</h3>
                <p className="text-gray-400 text-sm">{t('home.boostDesc')}</p>
              </a>

              {/* Macro */}
              <a
                href="/macro"
                className="clean-card p-8 rounded-lg hover:bg-white/5 text-left group transition-all"
              >
                <div className="mb-4 text-yellow-400 group-hover:scale-110 transition-transform inline-block">
                  <Zap size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t('home.macroTitle')}</h3>
                <p className="text-gray-400 text-sm">{t('home.macroDesc')}</p>
              </a>

              {/* Hesablar */}
              <button
                onClick={handleAccountsClick}
                disabled={loading}
                className="clean-card p-8 rounded-lg hover:bg-white/5 disabled:opacity-50 text-left group transition-all"
              >
                <div className="mb-4 text-pink-400 group-hover:scale-110 transition-transform inline-block">
                  <Gamepad2 size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t('home.accountsTitle')}</h3>
                <p className="text-gray-400 text-sm">{t('home.accountsDesc')}</p>
              </button>

              {/* Bit */}
              <button
                onClick={() => {
                  setView('bit')
                  setLoading(false)
                }}
                className="clean-card p-8 rounded-lg hover:bg-white/5 text-left group transition-all"
              >
                <div className="mb-4 text-green-400 group-hover:scale-110 transition-transform inline-block">
                  <Download size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t('home.bitTitle')}</h3>
                <p className="text-gray-400 text-sm">{t('home.bitDesc')}</p>
              </button>
            </div>
          </div>
        )}

        {view === 'ruble' && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleBackToHome}
              className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={20} />
              {t('common.back')}
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
              onClick={handleBackToHome}
              className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={20} />
              {t('common.back')}
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
                          <span className="text-gray-400 text-sm">{t('accounts.rank')}:</span>
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

                      <div className="space-y-2">
                        <button
                          onClick={() => handleBuyClick(account)}
                          className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2 transition-colors"
                        >
                          <ShoppingCart size={20} />
                          {t('common.buy')}
                        </button>
                        <button
                          onClick={() => handleCreditClick(account)}
                          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                        >
                          <ShoppingCart size={20} />
                          {t('accounts.buyWithCredit')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'bit' && (
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleBackToHome}
              className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={20} />
              {t('common.back')}
            </button>

            <div className="clean-card rounded-lg p-10">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">{t('bit.title')}</h2>
              
              <div className="mb-8">
                <div className="bg-white/5 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{t('bit.gameName')}</h3>
                  <p className="text-gray-400">{t('bit.description')}</p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={async () => {
                      try {
                        const response = await axios.get(`${API_URL}/api/bit-download-link`)
                        if (response.data.link) {
                          window.open(response.data.link, '_blank')
                        } else {
                          alert('Download link not available')
                        }
                      } catch (error) {
                        console.error('[BIT] Download link hatası:', error)
                        alert('Download link could not be fetched')
                      }
                    }}
                    className="w-full py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download size={24} />
                    {t('bit.download')}
                  </button>

                  <button
                    onClick={() => {
                      const message = `*${t('bit.purchaseRequest')}*\n\n` +
                        `*Oyun:* PBAZGOLD\n` +
                        `*İstifadəçi kodu:* ${t('bit.requestingCode')}`
                      const whatsappUrl = `https://wa.me/79271031033?text=${encodeURIComponent(message)}`
                      window.open(whatsappUrl, '_blank')
                    }}
                    className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Wallet size={24} />
                    {t('bit.buy')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Credit Modal */}
        {creditModal.show && creditModal.account && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="clean-card rounded-lg p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">
                {t('accounts.creditAgreement')}
              </h3>
              
              <div className="mb-6">
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <p className="text-white font-semibold mb-2">{creditModal.account.name}</p>
                  <p className="text-gray-400 text-sm mb-2">
                    {t('accounts.price')}: {creditModal.account.price} ₼
                  </p>
                  <p className="text-green-400 text-sm">
                    {t('accounts.initialPayment').replace('40%', `${creditModal.account.creditPercentage || 40}%`)}: {Math.round(creditModal.account.price * ((creditModal.account.creditPercentage || 40) / 100))} ₼
                  </p>
                  <p className="text-yellow-400 text-sm">
                    {t('accounts.remainingPayment')}: {creditModal.account.price - Math.round(creditModal.account.price * ((creditModal.account.creditPercentage || 40) / 100))} ₼
                  </p>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                  <p className="text-red-400 text-sm leading-relaxed">
                    {t('accounts.creditTerms')}
                  </p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={acceptCreditTerms}
                    onChange={(e) => setAcceptCreditTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-blue-600 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-white text-sm group-hover:text-blue-400 transition-colors">
                    {t('accounts.acceptTerms')}
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreditSubmit}
                  disabled={!acceptCreditTerms}
                  className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('accounts.sendWhatsapp')}
                </button>
                <button
                  onClick={() => setCreditModal({ show: false, account: null })}
                  className="flex-1 py-3 bg-white/5 text-white font-semibold rounded-lg hover:bg-white/10 border border-gray-800 transition-colors"
                >
                  {t('accounts.cancel')}
                </button>
              </div>
            </div>
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
