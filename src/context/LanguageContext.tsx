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
      accountsTitle: 'Hesablar',
      accountsDesc: 'Mövcud hesabları gör',
      boostTitle: 'Boost',
      boostDesc: 'Səviyyə yüksəltmə',
      macroTitle: 'Macro',
      macroDesc: 'Oyun makroları',
      adminLogin: 'Admin girişi',
    },
    ruble: {
      title: 'Rubl Qiyməti',
      rate: '1 Manat = {rate} Rubl',
    },
    boost: {
      title: 'Boost Xidmətləri',
      description: 'Oyununuzu bir səviyyə yüksəldin',
      priceLabel: 'Qiymət',
      contactButton: 'WhatsApp ilə əlaqə saxla',
      battlepass: {
        title: 'Battle Pass',
        desc: 'Səviyyə boost',
        detailTitle: 'Battle Pass Boost',
        startLevel: 'Başlanğıc Səviyyə',
        endLevel: 'Bitiş Səviyyə',
        selectedRange: 'Seçilən aralıq',
        invalidRange: 'Başlanğıc dəyər bitiş dəyərindən kiçik olmalıdır!',
        whatsappTitle: 'Battle Pass Boost Tələbi',
        range: 'Aralıq',
      },
      rank: {
        title: 'Rank',
        desc: 'Rank yüksəltmə',
        detailTitle: 'Rank Boost',
        contactText: 'Rank boost xidməti üçün bizimlə əlaqə saxlayın',
        whatsappTitle: 'Rank Boost Tələbi',
      },
      rutbe: {
        title: 'Rütbə',
        desc: 'Rütbə boost',
        detailTitle: 'Rütbə Boost',
        inputLabel: 'Rütbə adını yazın',
        placeholder: 'Məsələn: General, Polkovnik və s.',
        enterName: 'Lütfən rütbə adını yazın!',
        whatsappTitle: 'Rütbə Boost Tələbi',
        rankName: 'Rütbə',
      },
      misya: {
        title: 'Misya',
        desc: 'Misya boost',
        detailTitle: 'Misya Boost',
        contactText: 'Misya boost xidməti üçün bizimlə əlaqə saxlayın',
        whatsappTitle: 'Misya Boost Tələbi',
      },
    },
    accounts: {
      title: 'Satılıq Hesablar',
      noAccounts: 'Hələ ki satılıq hesab yoxdur',
      rank: 'Rütbə',
      price: 'Qiymət',
      rubleUnit: 'Manat',
      buyWithCredit: 'Kreditlə Al',
      creditAgreement: 'Kredit Şərtləri',
      creditTerms: 'İlkin ödəniş hesab qiymətinin 40-50%-i olmalıdır. Qalan məbləğ 1 ay ərzində ödənilməlidir. Əks halda, ilkin ödəniş geri qaytarılmır və hesab geri alınır.',
      acceptTerms: 'Şərtləri qəbul edirəm',
      mustAcceptTerms: 'Davam etmək üçün şərtləri qəbul etməlisiniz!',
      creditRequest: 'Kredit Tələbi',
      initialPayment: 'İlkin ödəniş (40%)',
      remainingPayment: 'Qalan ödəniş',
      sendWhatsapp: 'WhatsApp\'a Göndər',
      cancel: 'İptal',
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
    macro: {
      title: 'Macro Xidməti',
      description: 'Hz və hasar verən fayl ilə macro',
      configureTitle: 'Macro Konfiqurasiyası',
      hzLabel: 'Hz dəyəri:',
      hzHint: 'Məsələn: 60, 120, 144 Hz',
      hzRequired: 'Hz dəyəri daxil edin!',
      damageFileQuestion: 'İlave hasar verən fayl istəyirsiniz?',
      damageFileDesc: 'Əlavə hasar gücü üçün xüsusi fayl',
      totalPrice: 'Ümumi qiymət:',
      orderButton: 'WhatsApp ilə sifariş et',
      yesWithDamage: 'Bəli, hasar verən fayl istəyirəm',
      noDamage: 'Xeyr, hasar verən fayl lazım deyil',
      whatsappTitle: 'Macro Tələbi',
      damageFileLabel: 'İlave hasar verən fayl',
      priceLabel: 'Qiymət',
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
      accountsTitle: 'Hesaplar',
      accountsDesc: 'Mevcut hesapları gör',
      boostTitle: 'Boost',
      boostDesc: 'Seviye yükseltme',
      macroTitle: 'Macro',
      macroDesc: 'Oyun makroları',
      adminLogin: 'Admin girişi',
    },
    ruble: {
      title: 'Ruble Fiyatı',
      rate: '1 Manat = {rate} Ruble',
    },
    boost: {
      title: 'Boost Hizmetleri',
      description: 'Oyununuzu bir seviye yükseltin',
      priceLabel: 'Fiyat',
      contactButton: 'WhatsApp ile iletişime geç',
      battlepass: {
        title: 'Battle Pass',
        desc: 'Seviye boost',
        detailTitle: 'Battle Pass Boost',
        startLevel: 'Başlangıç Seviye',
        endLevel: 'Bitiş Seviye',
        selectedRange: 'Seçilen aralık',
        invalidRange: 'Başlangıç değeri bitiş değerinden küçük olmalı!',
        whatsappTitle: 'Battle Pass Boost Talebi',
        range: 'Aralık',
      },
      rank: {
        title: 'Rank',
        desc: 'Rank yükseltme',
        detailTitle: 'Rank Boost',
        contactText: 'Rank boost hizmeti için bizimle iletişime geçin',
        whatsappTitle: 'Rank Boost Talebi',
      },
      rutbe: {
        title: 'Rütbe',
        desc: 'Rütbe boost',
        detailTitle: 'Rütbe Boost',
        inputLabel: 'Rütbe adını yazın',
        placeholder: 'Örneğin: General, Albay vs.',
        enterName: 'Lütfen rütbe adını yazın!',
        whatsappTitle: 'Rütbe Boost Talebi',
        rankName: 'Rütbe',
      },
      misya: {
        title: 'Misyon',
        desc: 'Misyon boost',
        detailTitle: 'Misyon Boost',
        contactText: 'Misyon boost hizmeti için bizimle iletişime geçin',
        whatsappTitle: 'Misyon Boost Talebi',
      },
    },
    accounts: {
      title: 'Satılık Hesaplar',
      noAccounts: 'Henüz satılık hesap yok',
      rank: 'Rütbe',
      price: 'Fiyat',
      rubleUnit: 'Manat',
      buyWithCredit: 'Kredili Al',
      creditAgreement: 'Kredi Şartları',
      creditTerms: 'İlk ödeme hesap fiyatının %40-50\'si olmalıdır. Kalan tutar 1 ay içinde ödenmelidir. Aksi takdirde, ilk ödeme iade edilmez ve hesap geri alınır.',
      acceptTerms: 'Şartları kabul ediyorum',
      mustAcceptTerms: 'Devam etmek için şartları kabul etmelisiniz!',
      creditRequest: 'Kredi Talebi',
      initialPayment: 'İlk ödeme (%40)',
      remainingPayment: 'Kalan ödeme',
      sendWhatsapp: 'WhatsApp\'a Gönder',
      cancel: 'İptal',
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
    macro: {
      title: 'Macro Hizmeti',
      description: 'Hz ve hasar veren dosya ile macro',
      configureTitle: 'Macro Konfigürasyonu',
      hzLabel: 'Hz değeri:',
      hzHint: 'Örneğin: 60, 120, 144 Hz',
      hzRequired: 'Hz değeri girin!',
      damageFileQuestion: 'İlave hasar veren dosya ister misiniz?',
      damageFileDesc: 'Ekstra hasar gücü için özel dosya',
      totalPrice: 'Toplam fiyat:',
      orderButton: 'WhatsApp ile sipariş et',
      yesWithDamage: 'Evet, hasar veren dosya istiyorum',
      noDamage: 'Hayır, hasar veren dosya gerekli değil',
      whatsappTitle: 'Macro Talebi',
      damageFileLabel: 'İlave hasar veren dosya',
      priceLabel: 'Fiyat',
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
      accountsTitle: 'Аккаунты',
      accountsDesc: 'Посмотреть доступные аккаунты',
      boostTitle: 'Буст',
      boostDesc: 'Повышение уровня',
      macroTitle: 'Макрос',
      macroDesc: 'Игровые макросы',
      adminLogin: 'Вход администратора',
    },
    ruble: {
      title: 'Цена Рубля',
      rate: '1 Манат = {rate} Рублей',
    },
    boost: {
      title: 'Услуги Буста',
      description: 'Повысьте уровень вашей игры',
      priceLabel: 'Цена',
      contactButton: 'Связаться через WhatsApp',
      battlepass: {
        title: 'БАТЛ ПАСС',
        desc: 'Буст уровня',
        detailTitle: 'Буст БАТЛ ПАСС',
        startLevel: 'Начальный уровень',
        endLevel: 'Конечный уровень',
        selectedRange: 'Выбранный диапазон',
        invalidRange: 'Начальное значение должно быть меньше конечного!',
        whatsappTitle: 'Запрос на Буст БАТЛ ПАСС',
        range: 'Диапазон',
      },
      rank: {
        title: 'Ранг',
        desc: 'Повышение ранга',
        detailTitle: 'Буст Ранга',
        contactText: 'Свяжитесь с нами для услуги буста ранга',
        whatsappTitle: 'Запрос на Буст Ранга',
      },
      rutbe: {
        title: 'Звание',
        desc: 'Буст звания',
        detailTitle: 'Буст Звания',
        inputLabel: 'Введите название звания',
        placeholder: 'Например: Генерал, Полковник и т.д.',
        enterName: 'Пожалуйста, введите название звания!',
        whatsappTitle: 'Запрос на Буст Звания',
        rankName: 'Звание',
      },
      misya: {
        title: 'Миссия',
        desc: 'Буст миссии',
        detailTitle: 'Буст Миссии',
        contactText: 'Свяжитесь с нами для услуги буста миссии',
        whatsappTitle: 'Запрос на Буст Миссии',
      },
    },
    accounts: {
      title: 'Аккаунты на Продажу',
      noAccounts: 'Пока нет аккаунтов на продажу',
      rank: 'Ранг',
      price: 'Цена',
      rubleUnit: 'Манат',
      buyWithCredit: 'Купить в Кредит',
      creditAgreement: 'Условия Кредита',
      creditTerms: 'Первоначальный взнос должен составлять 40-50% от стоимости аккаунта. Остаток должен быть оплачен в течение 1 месяца. В противном случае первоначальный взнос не возвращается, и аккаунт забирается обратно.',
      acceptTerms: 'Я принимаю условия',
      mustAcceptTerms: 'Вы должны принять условия, чтобы продолжить!',
      creditRequest: 'Запрос на Кредит',
      initialPayment: 'Первоначальный взнос (40%)',
      remainingPayment: 'Остаток',
      sendWhatsapp: 'Отправить в WhatsApp',
      cancel: 'Отмена',
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
    macro: {
      title: 'Сервис Макросов',
      description: 'Макрос с Hz и файлом повышения урона',
      configureTitle: 'Конфигурация Макроса',
      hzLabel: 'Значение Hz:',
      hzHint: 'Например: 60, 120, 144 Hz',
      hzRequired: 'Введите значение Hz!',
      damageFileQuestion: 'Хотите дополнительный файл повышения урона?',
      damageFileDesc: 'Специальный файл для дополнительной силы урона',
      totalPrice: 'Общая цена:',
      orderButton: 'Заказать через WhatsApp',
      yesWithDamage: 'Да, хочу файл повышения урона',
      noDamage: 'Нет, файл повышения урона не нужен',
      whatsappTitle: 'Запрос на Макрос',
      damageFileLabel: 'Дополнительный файл урона',
      priceLabel: 'Цена',
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

