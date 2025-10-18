import { useState, useEffect } from 'react'
import axios from 'axios'
import { Target, Star, Award, ClipboardList, ArrowLeft, MessageCircle } from 'lucide-react'
import LanguageSelector from '../components/LanguageSelector'

const API_URL = import.meta.env.VITE_API_URL || ''

interface BoostSettings {
  battlePassPrice: number
  rankPrice: number
  rutbePrice: number
  misyaPrice: number
}

function BoostPage() {
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

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/boost-settings`)
      setSettings(response.data)
    } catch (error) {
      console.error('Boost ayarları yüklenemedi:', error)
    }
  }

  const handleWhatsApp = (message: string) => {
    const phoneNumber = '79271031033'
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank')
  }

  const handleBattlePassSubmit = () => {
    if (battlePassFrom >= battlePassTo) {
      alert('Başlangıç değeri bitiş değerinden küçük olmalı!')
      return
    }
    const message = `Battle Pass Boost: ${battlePassFrom}-${battlePassTo} arası boost istiyorum. Fiyat: ${settings.battlePassPrice} manat`
    handleWhatsApp(message)
  }

  const handleRankBoost = () => {
    const message = `Rank için boost istiyorum. Fiyat: ${settings.rankPrice} manat`
    handleWhatsApp(message)
  }

  const handleRutbeSubmit = () => {
    if (!rutbeName.trim()) {
      alert('Lütfen rütbe ismini yazın!')
      return
    }
    const message = `Rütbe Boost: ${rutbeName} için boost istiyorum. Fiyat: ${settings.rutbePrice} manat`
    handleWhatsApp(message)
  }

  const handleMisyaBoost = () => {
    const message = `Misya boost istiyorum. Fiyat: ${settings.misyaPrice} manat`
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
            Boost Xidmətləri
          </h1>
          <p className="text-gray-400 mb-8">Oyununuzu bir səviyyə yüksəldin</p>
          <a
            href="/"
            className="inline-block text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={20} />
            Ana səhifəyə qayıt
          </a>
        </div>

        {/* Boost Types */}
        {!selectedBoost && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Battle Pass */}
            <div
              onClick={() => setSelectedBoost('battlepass')}
              className="clean-card p-8 rounded-lg cursor-pointer hover:bg-white/5 text-center group transition-all"
            >
              <div className="mb-4 text-purple-400 flex justify-center group-hover:scale-110 transition-transform">
                <Target size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Battle Pass
              </h3>
              <p className="text-gray-400 text-sm mb-4">Səviyyə boost</p>
              <div className="text-white font-semibold">
                {settings.battlePassPrice} ₼
              </div>
            </div>

            {/* Rank */}
            <div
              onClick={() => setSelectedBoost('rank')}
              className="clean-card p-8 rounded-lg cursor-pointer hover:bg-white/5 text-center group transition-all"
            >
              <div className="mb-4 text-blue-400 flex justify-center group-hover:scale-110 transition-transform">
                <Star size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Rank
              </h3>
              <p className="text-gray-400 text-sm mb-4">Rank yüksəltmə</p>
              <div className="text-white font-semibold">
                {settings.rankPrice} ₼
              </div>
            </div>

            {/* Rutbe */}
            <div
              onClick={() => setSelectedBoost('rutbe')}
              className="clean-card p-8 rounded-lg cursor-pointer hover:bg-white/5 text-center group transition-all"
            >
              <div className="mb-4 text-green-400 flex justify-center group-hover:scale-110 transition-transform">
                <Award size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Rütbə
              </h3>
              <p className="text-gray-400 text-sm mb-4">Rütbə boost</p>
              <div className="text-white font-semibold">
                {settings.rutbePrice} ₼
              </div>
            </div>

            {/* Misya */}
            <div
              onClick={() => setSelectedBoost('misya')}
              className="clean-card p-8 rounded-lg cursor-pointer hover:bg-white/5 text-center group transition-all"
            >
              <div className="mb-4 text-yellow-400 flex justify-center group-hover:scale-110 transition-transform">
                <ClipboardList size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Misya
              </h3>
              <p className="text-gray-400 text-sm mb-4">Misya boost</p>
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
              onClick={() => setSelectedBoost(null)}
              className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={20} />
              Geri
            </button>
            
            <div className="clean-card rounded-lg p-8">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Battle Pass Boost
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-3">Başlanğıc Səviyyə: {battlePassFrom}</label>
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
                  <label className="block text-white mb-3">Bitiş Səviyyə: {battlePassTo}</label>
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
                  <p className="text-gray-400 mb-2">Seçilən aralıq</p>
                  <p className="text-3xl font-bold text-white">
                    {battlePassFrom} - {battlePassTo}
                  </p>
                </div>

                <div className="text-center text-2xl font-bold text-white">
                  Qiymət: {settings.battlePassPrice} ₼
                </div>

                <button
                  onClick={handleBattlePassSubmit}
                  className="w-full py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={20} />
                  WhatsApp ilə əlaqə saxla
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rank Details */}
        {selectedBoost === 'rank' && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setSelectedBoost(null)}
              className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={20} />
              Geri
            </button>
            
            <div className="clean-card rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-8">
                Rank Boost
              </h2>

              <div className="mb-6 text-blue-400 flex justify-center">
                <Star size={64} strokeWidth={1.5} />
              </div>
              <p className="text-gray-400 text-lg mb-8">
                Rank boost xidməti üçün bizimlə əlaqə saxlayın
              </p>
              
              <div className="text-3xl font-bold text-white mb-8">
                Qiymət: {settings.rankPrice} ₼
              </div>

              <button
                onClick={handleRankBoost}
                className="w-full py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200"
              >
                WhatsApp ilə əlaqə saxla
              </button>
            </div>
          </div>
        )}

        {/* Rutbe Details */}
        {selectedBoost === 'rutbe' && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setSelectedBoost(null)}
              className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={20} />
              Geri
            </button>
            
            <div className="clean-card rounded-lg p-8">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Rütbə Boost
              </h2>

              <div className="space-y-6">
                <div className="mb-6 text-green-400 flex justify-center">
                  <Award size={64} strokeWidth={1.5} />
                </div>
                
                <div>
                  <label className="block text-white mb-2">Rütbə adını yazın:</label>
                  <input
                    type="text"
                    value={rutbeName}
                    onChange={(e) => setRutbeName(e.target.value)}
                    placeholder="Məsələn: General, Polkovnik və s."
                    className="w-full px-4 py-3 bg-white/5 border border-gray-800 rounded-lg text-white focus:border-gray-600 focus:outline-none"
                  />
                </div>

                <div className="text-center text-2xl font-bold text-white">
                  Qiymət: {settings.rutbePrice} ₼
                </div>

                <button
                  onClick={handleRutbeSubmit}
                  className="w-full py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200"
                >
                  WhatsApp ilə əlaqə saxla
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Misya Details */}
        {selectedBoost === 'misya' && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setSelectedBoost(null)}
              className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={20} />
              Geri
            </button>
            
            <div className="clean-card rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-8">
                Misya Boost
              </h2>

              <div className="mb-6 text-yellow-400 flex justify-center">
                <ClipboardList size={64} strokeWidth={1.5} />
              </div>
              <p className="text-gray-400 text-lg mb-8">
                Misya boost xidməti üçün bizimlə əlaqə saxlayın
              </p>
              
              <div className="text-3xl font-bold text-white mb-8">
                Qiymət: {settings.misyaPrice} ₼
              </div>

              <button
                onClick={handleMisyaBoost}
                className="w-full py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200"
              >
                WhatsApp ilə əlaqə saxla
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BoostPage
