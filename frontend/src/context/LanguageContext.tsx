import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'az' | 'tr' | 'ru'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: React.ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('az')

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && ['az', 'tr', 'ru'].includes(savedLang)) {
      setLanguageState(savedLang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

const translations: Record<Language, any> = {
  az: {
    common: {
      back: '← Geri',
      loading: 'Yüklənir...',
      cancel: 'Ləğv et',
      save: 'Yadda saxla',
      edit: 'Redaktə',
      delete: 'Sil',
      add: 'Əlavə et',
      update: 'Yenilə',
      buy: 'Satın Al',
      send: 'Göndər',
      login: 'Daxil ol',
      logout: 'Çıxış',
    },
    header: {
      title: 'PointBlank Market',
      adminPanel: 'Admin Panel',
      mainPage: 'Ana səhifə',
    },
    home: {
      welcome: 'Xoş gəldiniz!',
      selectOption: 'Zəhmət olmasa seçim edin:',
      rublePrice: 'Rubl qiyməti',
      rublePriceDesc: '1 Manat = ? Rubl',
      accounts: 'Satılıq hesablar',
      accountsDesc: 'Mövcud hesabları gör',
      adminLogin: 'Admin girişi',
    },
    ruble: {
      title: 'Rubl Qiyməti',
      rate: '1 Manat = {rate} Rubl',
    },
    accounts: {
      title: 'Satılıq Hesablar',
      noAccounts: 'Hələ ki satılıq hesab yoxdur',
      rank: 'Rütbə',
      price: 'Qiymət',
      rubleUnit: 'Manat',
    },
    purchase: {
      title: 'Hesab Satın Al',
      rubleTitle: 'Rubl Satın Al',
      selectedAccount: 'Seçilən hesab:',
      rubleAmount: 'Rubl Sayı',
      accountName: 'Nickname',
      accountEmail: 'Hesab Email',
      receiptUrl: 'Çek',
      sendWhatsapp: 'WhatsApp\'a Göndər',
    },
    admin: {
      login: {
        title: 'Giriş',
        username: 'İstifadəçi adı',
        password: 'Şifrə',
        loginButton: 'Daxil ol',
        loggingIn: 'Giriş edilir...',
      },
      panel: {
        rubleTab: 'Rubl Qiyməti',
        accountsTab: 'Satılıq Hesablar',
        rubleTitle: 'Rubl Qiymətini Dəyiş',
        rubleLabel: '1 Manat = ? Rubl',
        rubleSuccess: 'Rubl qiyməti uğurla yeniləndi!',
        updating: 'Yenilənir...',
        accountsTitle: 'Satılıq Hesablar',
        newAccount: '+ Yeni Hesab',
        editAccount: 'Hesabı Redaktə Et',
        addAccount: 'Yeni Hesab Əlavə Et',
        accountName: 'Hesab adı',
        description: 'Açıqlama',
        rank: 'Rütbə',
        rankPlaceholder: 'Məsələn: Gold Nova, Master Guardian',
        price: 'Qiymət (Manat)',
        youtubeUrl: 'YouTube Video URL',
        noAccountsYet: 'Hələ ki hesab əlavə edilməyib',
        deleteConfirm: 'Bu hesabı silmək istədiyinizə əminsiniz?',
      },
    },
  },
  tr: {
    common: {
      back: '← Geri',
      loading: 'Yükleniyor...',
      cancel: 'İptal',
      save: 'Kaydet',
      edit: 'Düzenle',
      delete: 'Sil',
      add: 'Ekle',
      update: 'Güncelle',
      buy: 'Satın Al',
      send: 'Gönder',
      login: 'Giriş Yap',
      logout: 'Çıkış',
    },
    header: {
      title: 'PointBlank Market',
      adminPanel: 'Admin Paneli',
      mainPage: 'Ana Sayfa',
    },
    home: {
      welcome: 'Hoş geldiniz!',
      selectOption: 'Lütfen seçim yapın:',
      rublePrice: 'Ruble fiyatı',
      rublePriceDesc: '1 Manat = ? Ruble',
      accounts: 'Satılık hesaplar',
      accountsDesc: 'Mevcut hesapları gör',
      adminLogin: 'Admin girişi',
    },
    ruble: {
      title: 'Ruble Fiyatı',
      rate: '1 Manat = {rate} Ruble',
    },
    accounts: {
      title: 'Satılık Hesaplar',
      noAccounts: 'Henüz satılık hesap yok',
      rank: 'Rütbe',
      price: 'Fiyat',
      rubleUnit: 'Manat',
    },
    purchase: {
      title: 'Hesap Satın Al',
      rubleTitle: 'Ruble Satın Al',
      selectedAccount: 'Seçilen hesap:',
      rubleAmount: 'Ruble Sayısı',
      accountName: 'Nickname',
      accountEmail: 'Hesap Email',
      receiptUrl: 'Fiş',
      sendWhatsapp: 'WhatsApp\'a Gönder',
    },
    admin: {
      login: {
        title: 'Giriş',
        username: 'Kullanıcı adı',
        password: 'Şifre',
        loginButton: 'Giriş Yap',
        loggingIn: 'Giriş yapılıyor...',
      },
      panel: {
        rubleTab: 'Ruble Fiyatı',
        accountsTab: 'Satılık Hesaplar',
        rubleTitle: 'Ruble Fiyatını Değiştir',
        rubleLabel: '1 Manat = ? Ruble',
        rubleSuccess: 'Ruble fiyatı başarıyla güncellendi!',
        updating: 'Güncelleniyor...',
        accountsTitle: 'Satılık Hesaplar',
        newAccount: '+ Yeni Hesap',
        editAccount: 'Hesabı Düzenle',
        addAccount: 'Yeni Hesap Ekle',
        accountName: 'Hesap adı',
        description: 'Açıklama',
        rank: 'Rütbe',
        rankPlaceholder: 'Örnek: Gold Nova, Master Guardian',
        price: 'Fiyat (Manat)',
        youtubeUrl: 'YouTube Video URL',
        noAccountsYet: 'Henüz hesap eklenmedi',
        deleteConfirm: 'Bu hesabı silmek istediğinizden emin misiniz?',
      },
    },
  },
  ru: {
    common: {
      back: '← Назад',
      loading: 'Загрузка...',
      cancel: 'Отмена',
      save: 'Сохранить',
      edit: 'Редактировать',
      delete: 'Удалить',
      add: 'Добавить',
      update: 'Обновить',
      buy: 'Купить',
      send: 'Отправить',
      login: 'Войти',
      logout: 'Выход',
    },
    header: {
      title: 'PointBlank Market',
      adminPanel: 'Панель администратора',
      mainPage: 'Главная страница',
    },
    home: {
      welcome: 'Добро пожаловать!',
      selectOption: 'Пожалуйста, выберите:',
      rublePrice: 'Цена рубля',
      rublePriceDesc: '1 Манат = ? Рублей',
      accounts: 'Аккаунты на продажу',
      accountsDesc: 'Посмотреть доступные аккаунты',
      adminLogin: 'Вход администратора',
    },
    ruble: {
      title: 'Цена Рубля',
      rate: '1 Манат = {rate} Рублей',
    },
    accounts: {
      title: 'Аккаунты на Продажу',
      noAccounts: 'Пока нет аккаунтов на продажу',
      rank: 'Ранг',
      price: 'Цена',
      rubleUnit: 'Манат',
    },
    purchase: {
      title: 'Купить Аккаунт',
      rubleTitle: 'Купить Рубли',
      selectedAccount: 'Выбранный аккаунт:',
      rubleAmount: 'Количество Рублей',
      accountName: 'Никнейм',
      accountEmail: 'Email Аккаунта',
      receiptUrl: 'Чек',
      sendWhatsapp: 'Отправить в WhatsApp',
    },
    admin: {
      login: {
        title: 'Вход',
        username: 'Имя пользователя',
        password: 'Пароль',
        loginButton: 'Войти',
        loggingIn: 'Вход...',
      },
      panel: {
        rubleTab: 'Цена Рубля',
        accountsTab: 'Аккаунты на Продажу',
        rubleTitle: 'Изменить Цену Рубля',
        rubleLabel: '1 Манат = ? Рублей',
        rubleSuccess: 'Цена рубля успешно обновлена!',
        updating: 'Обновление...',
        accountsTitle: 'Аккаунты на Продажу',
        newAccount: '+ Новый Аккаунт',
        editAccount: 'Редактировать Аккаунт',
        addAccount: 'Добавить Новый Аккаунт',
        accountName: 'Название аккаунта',
        description: 'Описание',
        rank: 'Ранг',
        rankPlaceholder: 'Например: Gold Nova, Master Guardian',
        price: 'Цена (Манаты)',
        youtubeUrl: 'URL YouTube Видео',
        noAccountsYet: 'Пока не добавлено аккаунтов',
        deleteConfirm: 'Вы уверены, что хотите удалить этот аккаунт?',
      },
    },
  },
}

