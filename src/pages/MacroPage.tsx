import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Zap, ArrowLeft, MessageCircle } from 'lucide-react'
import LanguageSelector from '../components/LanguageSelector'
import { useLanguage } from '../context/LanguageContext'

const API_URL = import.meta.env.VITE_API_URL || ''

interface MacroSettings {
  macroPrice: number
}

function MacroPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [settings, setSettings] = useState<MacroSettings>({
    macroPrice: 0
  })
  const [hz, setHz] = useState('')
  const [wantDamageFile, setWantDamageFile] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      console.log('[MACRO] API isteği: /api/boost-settings')
      const response = await axios.get(`${API_URL}/api/boost-settings`)
      console.log('[MACRO] ✅ Macro ayarları yüklendi:', response.data)
      setSettings({
        macroPrice: response.data.macroPrice || 0
      })
    } catch (error) {
      console.error('[MACRO] ❌ Macro ayarları yüklenemedi:', error)
    }
  }

  const handleSubmit = () => {
    console.log('[MACRO] Macro submit - Hz:', hz, 'Hasar veren dosya:', wantDamageFile)
    
    if (!hz || hz.trim() === '') {
      console.log('[MACRO] ❌ Hz boş!')
      alert(t('macro.hzRequired'))
      return
    }

    const damageFileText = wantDamageFile ? t('macro.yesWithDamage') : t('macro.noDamage')
    const message = `*${t('macro.whatsappTitle')}*\n\n` +
      `*Hz:* ${hz.trim()}\n` +
      `*${t('macro.damageFileLabel')}:* ${damageFileText}\n` +
      `*${t('macro.priceLabel')}:* ${settings.macroPrice} Manat`
    
    console.log('[MACRO] ✓ WhatsApp\'a yönlendiriliyor...')
    const phoneNumber = '79271031033'
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-6 text-yellow-400 flex justify-center">
            <Zap size={64} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {t('macro.title')}
          </h1>
          <p className="text-gray-400 mb-8">{t('macro.description')}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            {t('common.back')}
          </button>
        </div>

        {/* Macro Form */}
        <div className="max-w-2xl mx-auto">
          <div className="clean-card rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              {t('macro.configureTitle')}
            </h2>

            <div className="space-y-6">
              {/* Hz Input */}
              <div>
                <label className="block text-white mb-3 text-lg">
                  {t('macro.hzLabel')}
                </label>
                <input
                  type="number"
                  value={hz}
                  onChange={(e) => setHz(e.target.value)}
                  placeholder="60, 120, 144..."
                  className="w-full px-4 py-4 bg-white/5 border border-gray-800 rounded-lg text-white text-lg focus:border-yellow-400 focus:outline-none transition-colors"
                />
                <p className="text-gray-500 text-sm mt-2">
                  {t('macro.hzHint')}
                </p>
              </div>

              {/* Damage File Checkbox */}
              <div className="bg-white/5 rounded-lg p-6 border border-gray-800">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={wantDamageFile}
                    onChange={(e) => setWantDamageFile(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-600 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="text-white text-lg font-semibold block mb-1 group-hover:text-yellow-400 transition-colors">
                      {t('macro.damageFileQuestion')}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {t('macro.damageFileDesc')}
                    </span>
                  </div>
                </label>
              </div>

              {/* Price Display */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-6 border border-yellow-500/30 text-center">
                <p className="text-gray-400 mb-2">{t('macro.totalPrice')}</p>
                <p className="text-4xl font-bold text-white">
                  {settings.macroPrice} ₼
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-yellow-500/50 flex items-center justify-center gap-2 transition-all text-lg"
              >
                <MessageCircle size={24} />
                {t('macro.orderButton')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MacroPage

