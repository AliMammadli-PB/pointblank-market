import { useState, useEffect } from 'react'
import axios from 'axios'
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
    const phoneNumber = '79271031033' // WhatsApp numarası
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
    <div className="min-h-screen animated-bg text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-neon-purple rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-neon-pink rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold float">
            <span className="gradient-text">
              🚀 Boost Xidmətləri
            </span>
          </h1>
          <p className="text-gray-300 text-xl md:text-2xl">Oyununuzu bir səviyyə yüksəldin</p>
          <a
            href="/"
            className="inline-block px-6 py-3 glass hover-scale rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/20"
          >
            ← Ana səhifəyə qayıt
          </a>
        </div>

        {/* Boost Types */}
        {!selectedBoost && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Battle Pass */}
            <div
              onClick={() => setSelectedBoost('battlepass')}
              className="glass-strong card-shine rounded-2xl p-8 border border-neon-purple/30 hover:border-neon-purple hover-scale cursor-pointer transition-all duration-500 group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-neon-purple transition-colors">
                  Battle Pass
                </h3>
                <p className="text-gray-400 mb-4">Səviyyə boost</p>
                <div className="text-neon-blue text-xl font-bold">
                  {settings.battlePassPrice} ₼
                </div>
              </div>
            </div>

            {/* Rank */}
            <div
              onClick={() => setSelectedBoost('rank')}
              className="glass-strong card-shine rounded-2xl p-8 border border-neon-pink/30 hover:border-neon-pink hover-scale cursor-pointer transition-all duration-500 group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-neon-pink transition-colors">
                  Rank
                </h3>
                <p className="text-gray-400 mb-4">Rank yüksəltmə</p>
                <div className="text-neon-pink text-xl font-bold">
                  {settings.rankPrice} ₼
                </div>
              </div>
            </div>

            {/* Rutbe */}
            <div
              onClick={() => setSelectedBoost('rutbe')}
              className="glass-strong card-shine rounded-2xl p-8 border border-neon-blue/30 hover:border-neon-blue hover-scale cursor-pointer transition-all duration-500 group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🎖️</div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-neon-blue transition-colors">
                  Rütbə
                </h3>
                <p className="text-gray-400 mb-4">Rütbə boost</p>
                <div className="text-neon-blue text-xl font-bold">
                  {settings.rutbePrice} ₼
                </div>
              </div>
            </div>

            {/* Misya */}
            <div
              onClick={() => setSelectedBoost('misya')}
              className="glass-strong card-shine rounded-2xl p-8 border border-yellow-500/30 hover:border-yellow-500 hover-scale cursor-pointer transition-all duration-500 group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-yellow-500 transition-colors">
                  Misya
                </h3>
                <p className="text-gray-400 mb-4">Misya boost</p>
                <div className="text-yellow-500 text-xl font-bold">
                  {settings.misyaPrice} ₼
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Battle Pass Details */}
        {selectedBoost === 'battlepass' && (
          <div className="max-w-2xl mx-auto bg-gray-800/50 border-2 border-neon-purple/50 rounded-xl p-8">
            <button
              onClick={() => setSelectedBoost(null)}
              className="mb-6 text-gray-400 hover:text-white transition-colors"
            >
              ← Geri
            </button>
            
            <h2 className="text-3xl font-bold mb-6 text-center text-neon-purple">
              Battle Pass Boost
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Başlanğıc Səviyyə: {battlePassFrom}</label>
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
                <label className="block text-gray-300 mb-2">Bitiş Səviyyə: {battlePassTo}</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={battlePassTo}
                  onChange={(e) => setBattlePassTo(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 mb-2">Seçilən aralıq</p>
                <p className="text-2xl font-bold text-neon-purple">
                  {battlePassFrom} - {battlePassTo}
                </p>
              </div>

              <div className="text-center text-xl font-bold text-neon-blue">
                Qiymət: {settings.battlePassPrice} ₼
              </div>

              <button
                onClick={handleBattlePassSubmit}
                className="w-full py-4 bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold rounded-lg hover:shadow-neon-purple transition-all duration-300"
              >
                WhatsApp ilə əlaqə saxla
              </button>
            </div>
          </div>
        )}

        {/* Rank Details */}
        {selectedBoost === 'rank' && (
          <div className="max-w-2xl mx-auto bg-gray-800/50 border-2 border-neon-pink/50 rounded-xl p-8">
            <button
              onClick={() => setSelectedBoost(null)}
              className="mb-6 text-gray-400 hover:text-white transition-colors"
            >
              ← Geri
            </button>
            
            <h2 className="text-3xl font-bold mb-6 text-center text-neon-pink">
              Rank Boost
            </h2>

            <div className="text-center space-y-6">
              <div className="text-6xl">⭐</div>
              <p className="text-gray-400 text-lg">
                Rank boost xidməti üçün bizimlə əlaqə saxlayın
              </p>
              
              <div className="text-3xl font-bold text-neon-pink">
                Qiymət: {settings.rankPrice} ₼
              </div>

              <button
                onClick={handleRankBoost}
                className="w-full py-4 bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold rounded-lg hover:shadow-neon-pink transition-all duration-300"
              >
                WhatsApp ilə əlaqə saxla
              </button>
            </div>
          </div>
        )}

        {/* Rutbe Details */}
        {selectedBoost === 'rutbe' && (
          <div className="max-w-2xl mx-auto bg-gray-800/50 border-2 border-neon-blue/50 rounded-xl p-8">
            <button
              onClick={() => setSelectedBoost(null)}
              className="mb-6 text-gray-400 hover:text-white transition-colors"
            >
              ← Geri
            </button>
            
            <h2 className="text-3xl font-bold mb-6 text-center text-neon-blue">
              Rütbə Boost
            </h2>

            <div className="space-y-6">
              <div className="text-6xl text-center">🎖️</div>
              
              <div>
                <label className="block text-gray-300 mb-2">Rütbə adını yazın:</label>
                <input
                  type="text"
                  value={rutbeName}
                  onChange={(e) => setRutbeName(e.target.value)}
                  placeholder="Məsələn: General, Polkovnik və s."
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-neon-blue focus:outline-none transition-colors"
                />
              </div>

              <div className="text-center text-xl font-bold text-neon-blue">
                Qiymət: {settings.rutbePrice} ₼
              </div>

              <button
                onClick={handleRutbeSubmit}
                className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-lg hover:shadow-neon-blue transition-all duration-300"
              >
                WhatsApp ilə əlaqə saxla
              </button>
            </div>
          </div>
        )}

        {/* Misya Details */}
        {selectedBoost === 'misya' && (
          <div className="max-w-2xl mx-auto bg-gray-800/50 border-2 border-yellow-500/50 rounded-xl p-8">
            <button
              onClick={() => setSelectedBoost(null)}
              className="mb-6 text-gray-400 hover:text-white transition-colors"
            >
              ← Geri
            </button>
            
            <h2 className="text-3xl font-bold mb-6 text-center text-yellow-500">
              Misya Boost
            </h2>

            <div className="text-center space-y-6">
              <div className="text-6xl">📋</div>
              <p className="text-gray-400 text-lg">
                Misya boost xidməti üçün bizimlə əlaqə saxlayın
              </p>
              
              <div className="text-3xl font-bold text-yellow-500">
                Qiymət: {settings.misyaPrice} ₼
              </div>

              <button
                onClick={handleMisyaBoost}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-yellow transition-all duration-300"
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

