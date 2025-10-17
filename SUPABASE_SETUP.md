# 🚀 Supabase Kurulum Talimatları

## Adım 1: Supabase Dashboard'a Giriş

1. [Supabase Dashboard](https://app.supabase.com)'a gidin
2. Projenizi seçin: `https://tqmjhcvlhstrwowskxul.supabase.co`

## Adım 2: SQL Editor'da Tabloları Oluşturun

1. Sol menüden **SQL Editor** sekmesine tıklayın
2. **New Query** butonuna tıklayın
3. `SUPABASE_SETUP.sql` dosyasının tüm içeriğini kopyalayıp yapıştırın
4. **Run** butonuna tıklayın

SQL scripti şunları oluşturacak:
- ✅ `Admin` tablosu - Admin kullanıcı bilgileri
- ✅ `Settings` tablosu - Ruble kur ayarları
- ✅ `Account` tablosu - Hesap bilgileri
- ✅ İlk admin kullanıcısı (username: `admin`, password: `admin123`)
- ✅ Row Level Security politikaları

## Adım 3: Tabloları Kontrol Edin

1. Sol menüden **Table Editor** sekmesine tıklayın
2. Şu tabloları görmelisiniz:
   - Admin
   - Settings
   - Account

## Adım 4: Projeyi Çalıştırın

```bash
# Development modunda çalıştırma
npm run dev

# Veya sadece backend
npm start
```

## 🔑 Varsayılan Admin Girişi

- **Kullanıcı Adı:** admin
- **Şifre:** admin123

⚠️ **ÖNEMLİ:** İlk girişten sonra admin şifresini değiştirin!

## 🌐 Erişim Linkleri

- **Frontend (Development):** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Admin Panel:** http://localhost:5173/admin

## 📝 Ortam Değişkenleri

`.env` dosyası otomatik olarak oluşturuldu:
```
SUPABASE_URL=https://tqmjhcvlhstrwowskxul.supabase.co
ANON_PUBLIC=***
JWT_SECRET=***
PORT=3001
NODE_ENV=development
```

## 🔍 Test Etme

### 1. Settings API Test
```bash
curl http://localhost:3001/api/settings
```

### 2. Accounts API Test
```bash
curl http://localhost:3001/api/accounts
```

### 3. Admin Login Test
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

## ⚠️ Sorun Giderme

### Supabase bağlantı hatası
- Supabase URL ve Anon Key'in doğru olduğundan emin olun
- Supabase projenizin aktif olduğundan emin olun
- `SUPABASE_SETUP.sql` scriptini çalıştırdığınızdan emin olun

### Admin kullanıcısı bulunamadı hatası
- SQL Editor'da `SUPABASE_SETUP.sql` scriptini tekrar çalıştırın
- Table Editor'da `Admin` tablosunda kayıt olup olmadığını kontrol edin

## 📦 Production Deployment

Production için:
1. `.env` dosyasında `NODE_ENV=production` yapın
2. `npm run build` komutuyla frontend'i build edin
3. `npm start` ile sunucuyu başlatın
4. Sunucu hem API hem de frontend'i serve edecek

## 🎯 Özet Komutlar

```bash
# Development
npm run dev          # Frontend + Backend birlikte

# Production
npm run build        # Frontend build
npm start           # Production server

# Backend only
npm run server:dev   # Backend (development)
node server.js      # Backend (production)

# Frontend only  
npm run client:dev   # Frontend (development)
```

---

✅ Kurulum tamamlandı! Artık projeniz tamamen Supabase ile çalışıyor.

