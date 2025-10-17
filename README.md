# PointBlank Market

React + TypeScript + Tailwind + Node.js + Express + Prisma (SQLite) ile geliştirilmiş PointBlank Market web uygulaması.

## Özellikler

- 🌐 **3 Dil Desteği**: Azerbaycan dili (varsayılan), Türkçe ve Rusça
- 🎮 **Kullanıcı Arayüzü**: Rubl fiyatı görüntüleme ve satılık hesapları listeleme
- 🔐 **Admin Paneli**: Giriş yapma, rubl fiyatını güncelleme ve hesap yönetimi
- 🎨 **Modern UI**: Koyu tema ve neon renkli tasarım
- 📹 **YouTube Entegrasyonu**: Hesap tanıtım videoları için embed player
- 💾 **SQLite Veritabanı**: Prisma ORM ile kolay veritabanı yönetimi
- 💬 **WhatsApp Entegrasyonu**: Satın alma talebi için otomatik WhatsApp mesajı

## Kurulum

### 1. Bağımlılıkları yükleyin

```bash
npm run setup
```

Bu komut hem backend hem de frontend için gerekli paketleri yükleyecektir.

### 2. Backend .env dosyası

`backend/.env` dosyası otomatik oluşturulmadıysa, aşağıdaki içerikle kendiniz oluşturun:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3001
```

### 3. Veritabanını hazırlayın

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
cd ..
```

### 4. Uygulamayı başlatın

```bash
npm start
```

Bu komut hem backend (port 3001) hem de frontend (port 3000) sunucularını aynı anda başlatır.

## Kullanım

### Dil Değiştirme

Site 3 dil destekler:
- 🇦🇿 **Azərbaycan dili** (Varsayılan)
- 🇹🇷 **Türkçe**
- 🇷🇺 **Русский**

Sağ üstteki dil seçici butonlardan dilini değiştirebilirsiniz. Seçilen dil tarayıcıda (localStorage) kaydedilir ve bir sonraki ziyarette aynı dil yüklenir.

### Kullanıcı Arayüzü

- Ana sayfa: http://localhost:3000
- **Rubl qiyməti** butonuna tıklayarak güncel rubl kuru görüntülenebilir
- **Satılıq hesablar** butonuna tıklayarak mevcut hesaplar listelenebilir
- Her hesap için **Satın Al** butonu ile WhatsApp üzerinden satın alma talebi gönderilebilir

### Admin Paneli

- Admin girişi: http://localhost:3000/admin/login
- Varsayılan kullanıcı adı: `admin`
- Varsayılan şifre: `admin123`

Admin panelinde:
- Rubl fiyatını güncelleyebilirsiniz (1 Manat = ? Rubl)
- Yeni hesap ekleyebilirsiniz
- Mevcut hesapları düzenleyebilir veya silebilirsiniz

### Hesap Ekleme

Hesap eklerken:
- **Hesab adı**: Hesabın ismini girin
- **Açıqlama**: Hesap hakkında bilgi verin
- **Rütbə**: Hesabın rütbesini girin (örnek: Gold Nova, Master Guardian)
- **Qiymət**: Hesabın fiyatını Rubl cinsinden girin
- **YouTube Video URL**: Tanıtım videosunun YouTube linkini girin

### Satın Alma

Kullanıcılar hem rubl satın alabilir hem de hesap satın alabilir. Satın Al butonuna tıklandığında:
- Rubl sayısı
- Hesab adı
- Hesab emaili
- Dekont URL'si istenir

Form doldurulduktan sonra WhatsApp'a (+994123456789) otomatik olarak mesaj gönderilir.

## Teknolojiler

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express
- Prisma ORM
- SQLite
- JWT Authentication
- bcryptjs

## Proje Yapısı

```
pointblank-market/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   └── index.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   └── AdminPanel.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin girişi

### Settings
- `GET /api/settings` - Rubl fiyatını görüntüle
- `PUT /api/settings` - Rubl fiyatını güncelle (Auth gerekli)

### Accounts
- `GET /api/accounts` - Tüm hesapları listele
- `POST /api/accounts` - Yeni hesap ekle (Auth gerekli)
- `PUT /api/accounts/:id` - Hesap güncelle (Auth gerekli)
- `DELETE /api/accounts/:id` - Hesap sil (Auth gerekli)

## Güvenlik Notu

⚠️ **Önemli**: Production ortamında `.env` dosyasındaki `JWT_SECRET` değerini mutlaka değiştirin ve güçlü bir şifre belirleyin!

## Lisans

MIT
