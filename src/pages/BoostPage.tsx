import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { Target, Star, Award, ClipboardList, ArrowLeft, MessageCircle } from 'lucide-react'
import LanguageSelector from '../components/LanguageSelector'
import { useLanguage } from '../context/LanguageContext'

const API_URL = import.meta.env.VITE_API_URL || ''

interface BoostSettings {
  battlePassPrice: number
  rankPrice: number
  rutbePrice: number
  misyaPrice: number
}

function BoostPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [settings, setSettings] = useState<BoostSettings>({
    battlePassPrice: 0,
    rankPrice: 0,
    rutbePrice: 0,
    misyaPrice: 0
  })
  const [selectedBoost, setSelectedBoost] = useState<string | null>(null)
  const [battlePassFrom, setBattlePassFrom] = useState(1)
  const [battlePassTo, setBattlePassTo] = useState(50)
  const [rutbeName, setRutbeName] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  // URL'den boost tipini al
  useEffect(() => {
    console.log('[BOOST] URL değişti:', location.pathname, location.search)
    const params = new URLSearchParams(location.search)
    const boostType = params.get('type')
    console.log('[BOOST] Boost tipi:', boostType)
    
    if (boostType && ['battlepass', 'rank', 'rutbe', 'misya'].includes(boostType)) {
      console.log('[BOOST] ✓ Geçerli boost tipi seçildi:', boostType)
      setSelectedBoost(boostType)
    } else {
      console.log('[BOOST] Ana boost sayfasında')
      setSelectedBoost(null)
    }
  }, [location.search])

  const fetchSettings = async () => {
    try {
      console.log('[BOOST] API isteği: /api/boost-settings')
      const response = await axios.get(`${API_URL}/api/boost-settings`)
      console.log('[BOOST] ✅ Boost ayarları yüklendi:', response.data)
      setSettings(response.data)
    } catch (error) {
      console.error('[BOOST] ❌ Boost ayarları yüklenemedi:', error)
    }
  }

  const handleWhatsApp = (message: string) => {
    const phoneNumber = '79271031033'
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank')
  }

  const handleBattlePassSubmit = () => {
    console.log('[BOOST] Battle Pass submit - From:', battlePassFrom, 'To:', battlePassTo)
    if (battlePassFrom >= battlePassTo) {
      console.log('[BOOST] ❌ Geçersiz aralık!')
      alert(t('boost.battlepass.invalidRange'))
      return
    }
    const message = `*${t('boost.battlepass.whatsappTitle')}*\n\n` +
      `*${t('boost.battlepass.range')}:* ${battlePassFrom}-${battlePassTo}\n` +
      `*${t('boost.priceLabel')}:* ${settings.battlePassPrice} Manat`
    console.log('[BOOST] ✓ WhatsApp\'a yönlendiriliyor...')
    handleWhatsApp(message)
  }

  const handleRankBoost = () => {
    console.log('[BOOST] Rank boost - WhatsApp\'a yönlendiriliyor...')
    const message = `*${t('boost.rank.whatsappTitle')}*\n\n` +
      `*${t('boost.priceLabel')}:* ${settings.rankPrice} Manat`
    handleWhatsApp(message)
  }

  const handleRutbeSubmit = () => {
    console.log('[BOOST] Rutbe submit - Rütbe:', rutbeName)
    if (!rutbeName.trim()) {
      console.log('[BOOST] ❌ Rütbe adı boş!')
      alert(t('boost.rutbe.enterName'))
      return
    }
    const message = `*${t('boost.rutbe.whatsappTitle')}*\n\n` +
      `*${t('boost.rutbe.rankName')}:* ${rutbeName}\n` +
      `*${t('boost.priceLabel')}:* ${settings.rutbePrice} Manat`
    console.log('[BOOST] ✓ WhatsApp\'a yönlendiriliyor...')
    handleWhatsApp(message)
  }

  const handleMisyaBoost = () => {
    console.log('[BOOST] Misya boost - WhatsApp\'a yönlendiriliyor...')
    const message = `*${t('boost.misya.whatsappTitle')}*\n\n` +
      `*${t('boost.priceLabel')}:* ${settings.misyaPrice} Manat`
    handleWhatsApp(message)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t('boost.title')}
          </h1>
          <p className="text-gray-400 mb-8">{t('boost.description')}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            {t('common.back')}
          </button>
        </div>

        {/* Boost Types */}
        {!selectedBoost && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Battle Pass */}
            <div
              onClick={() => navigate('/boost?type=battlepass')}
              className="clean-card p-8 rounded-lg cursor-pointer hover:bg-white/5 text-center group transition-all"
            >
              <div className="mb-4 text-purple-400 flex justify-center group-hover:scale-110 transition-transform">
                <Target size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('boost.battlepass.title')}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{t('boost.battlepass.desc')}</p>
              <div className="text-white font-semibold">
                {settings.battlePassPrice} ₼
              </div>
            </div>

            {/* Rank */}
            <div
              onClick={() => navigate('/boost?type=rank')}
              className="clean-card p-8 rounded-lg cursor-pointer hover:bg-white/5 text-center group transition-all"
            >
              <div className="mb-4 text-blue-400 flex justify-center group-hover:scale-110 transition-transform">
                <Star size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('boost.rank.title')}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{t('boost.rank.desc')}</p>
              <div className="text-white font-semibold">
                {settings.rankPrice} ₼
              </div>
            </div>

            {/* Rutbe */}
            <div
              onClick={() => navigate('/boost?type=rutbe')}
              className="clean-card p-8 rounded-lg cursor-pointer hover:bg-white/5 text-center group transition-all"
            >
              <div className="mb-4 text-green-400 flex justify-center group-hover:scale-110 transition-transform">
                <Award size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('boost.rutbe.title')}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{t('boost.rutbe.desc')}</p>
              <div className="text-white font-semibold">
                {settings.rutbePrice} ₼
              </div>
            </div>

            {/* Misya */}
            <div
              onClick={() => navigate('/boost?type=misya')}
              className="clean-card p-8 rounded-lg cursor-pointer hover:bg-white/5 text-center group transition-all"
            >
              <div className="mb-4 text-yellow-400 flex justify-center group-hover:scale-110 transition-transform">
                <ClipboardList size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('boost.misya.title')}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{t('boost.misya.desc')}</p>
              <div className="text-white font-semibold">
                {settings.misyaPrice} ₼
              </div>
            </div>
          </div>
        )}

        {/* Battle Pass Details */}
        {selectedBoost === 'battlepass' && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => navigate('/boost')}
              className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={20} />
              {t('common.back')}
            </button>
            
            <div className="clean-card rounded-lg p-8">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                {t('boost.battlepass.detailTitle')}
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-3">{t('boost.battlepass.startLevel')}: {battlePassFrom}</label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={battlePassFrom}
                    onChange={(e) => setBattlePassFrom(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-white mb-3">{t('boost.battlepass.endLevel')}: {battlePassTo}</label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={battlePassTo}
                    onChange={(e) => setBattlePassTo(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="bg-white/5 rounded-lg p-6 text-center">
                  <p className="text-gray-400 mb-2">{t('boost.battlepass.selectedRange')}</p>
                  <p className="text-3xl font-bold text-white">
                    {battlePassFrom} - {battlePassTo}
                  </p>
                </div>

                <div className="text-center text-2xl font-bold text-white">
                  {t('boost.priceLabel')}: {settings.battlePassPrice} ₼
                </div>

                <button
                  onClick={handleBattlePassSubmit}
                  className="w-full py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={20} />
                  {t('boost.contactButton')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rank Details */}
        {selectedBoost === 'rank' && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => navigate('/boost')}
              className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={20} />
              {t('common.back')}
            </button>
            
            <div className="clean-card rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-8">
                {t('boost.rank.detailTitle')}
              </h2>

              <div className="mb-6 text-blue-400 flex justify-center">
                <Star size={64} strokeWidth={1.5} />
              </div>
              <p className="text-gray-400 text-lg mb-8">
                {t('boost.rank.contactText')}
              </p>
              
              <div className="text-3xl font-bold text-white mb-8">
                {t('boost.priceLabel')}: {settings.rankPrice} ₼
              </div>

              <button
                onClick={handleRankBoost}
                className="w-full py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200"
              >
                {t('boost.contactButton')}
              </button>
            </div>
          </div>
        )}

        {/* Rutbe Details */}
        {selectedBoost === 'rutbe' && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => navigate('/boost')}
              className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={20} />
              {t('common.back')}
            </button>
            
            <div className="clean-card rounded-lg p-8">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                {t('boost.rutbe.detailTitle')}
              </h2>

              <div className="space-y-6">
                <div className="mb-6 text-green-400 flex justify-center">
                  <Award size={64} strokeWidth={1.5} />
                </div>
                
                <div>
                  <label className="block text-white mb-2">{t('boost.rutbe.inputLabel')}</label>
                  <input
                    type="text"
                    value={rutbeName}
                    onChange={(e) => setRutbeName(e.target.value)}
                    placeholder={t('boost.rutbe.placeholder')}
                    className="w-full px-4 py-3 bg-white/5 border border-gray-800 rounded-lg text-white focus:border-gray-600 focus:outline-none"
                  />
                </div>

                <div className="text-center text-2xl font-bold text-white">
                  {t('boost.priceLabel')}: {settings.rutbePrice} ₼
                </div>

                <button
                  onClick={handleRutbeSubmit}
                  className="w-full py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200"
                >
                  {t('boost.contactButton')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Misya Details */}
        {selectedBoost === 'misya' && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => navigate('/boost')}
              className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={20} />
              {t('common.back')}
            </button>
            
            <div className="clean-card rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-8">
                {t('boost.misya.detailTitle')}
              </h2>

              <div className="mb-6 text-yellow-400 flex justify-center">
                <ClipboardList size={64} strokeWidth={1.5} />
              </div>
              <p className="text-gray-400 text-lg mb-8">
                {t('boost.misya.contactText')}
              </p>
              
              <div className="text-3xl font-bold text-white mb-8">
                {t('boost.priceLabel')}: {settings.misyaPrice} ₼
              </div>

              <button
                onClick={handleMisyaBoost}
                className="w-full py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200"
              >
                {t('boost.contactButton')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BoostPage
