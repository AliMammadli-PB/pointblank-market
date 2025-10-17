import { useLanguage } from '../context/LanguageContext'

function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  const languages = [
    { code: 'az' as const, name: 'AZ', flag: '🇦🇿' },
    { code: 'tr' as const, name: 'TR', flag: '🇹🇷' },
    { code: 'ru' as const, name: 'RU', flag: '🇷🇺' },
  ]

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-2 rounded-lg font-semibold transition-all duration-300 ${
            language === lang.code
              ? 'bg-gradient-to-r from-neon-pink to-neon-purple text-white shadow-neon-purple'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span className="mr-1">{lang.flag}</span>
          {lang.name}
        </button>
      ))}
    </div>
  )
}

export default LanguageSelector

