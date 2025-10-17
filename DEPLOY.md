# 🚀 Render.com Deploy Rehberi

## 📋 Hazırlık

Artık **tek klasör** yapısı var:
- ✅ `server.js` - Backend API
- ✅ `src/` - Frontend React kodu
- ✅ `dist/` - Build edilmiş frontend
- ✅ Tek `node_modules` ve `package.json`

## 🔧 Render.com'da Deploy

### 1️⃣ Yeni Web Service Oluştur

1. https://render.com dashboard'a git
2. **"New +"** → **"Web Service"**
3. GitHub repository'yi bağla: `AliMammadli-PB/pointblank-market`

### 2️⃣ Ayarlar

**Build & Deploy:**
- **Name:** `pointblank-market`
- **Region:** Frankfurt (veya en yakın)
- **Branch:** `main`
- **Root Directory:** (boş bırak)
- **Runtime:** Node
- **Build Command:** 
  ```bash
  npm install && npx prisma generate && npx prisma db push && npm run build
  ```
- **Start Command:** 
  ```bash
  npm start
  ```

### 3️⃣ Environment Variables

Aşağıdaki değişkenleri ekle:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=file:./prod.db
JWT_SECRET=your-super-secret-key-change-this-123456
```

**Önemli:** `JWT_SECRET` için güçlü bir şifre kullan!

### 4️⃣ Deploy!

**"Create Web Service"** butonuna tıkla! 🎉

## 📱 İlk Kullanım

Deploy tamamlandıktan sonra:

1. Site URL'niz: `https://pointblank-market.onrender.com`
2. Admin girişi: `https://pointblank-market.onrender.com/admin/login`
3. Varsayılan kullanıcı:
   - **Username:** `admin`
   - **Password:** `admin123`

⚠️ **İlk giriş yaptıktan sonra şifreyi değiştirin!**

## 🔄 Yerel Geliştirme

```bash
# Dependencies yükle
npm install

# Database oluştur
npx prisma generate
npx prisma db push

# Development mode (backend + frontend)
npm run dev

# Sadece backend
npm run server:dev

# Sadece frontend
npm run client:dev

# Production build test
npm run build
npm start
```

## 🌐 URL'ler

- **Local Frontend:** http://localhost:5173
- **Local Backend API:** http://localhost:3001/api
- **Production:** https://pointblank-market.onrender.com

## 📝 Notlar

- ✅ Free tier: İlk istekte 50 saniye gecikme olabilir
- ✅ Database: SQLite (production'da Postgres önerilir)
- ✅ Auto-deploy: Her push'ta otomatik deploy olur
- ✅ Admin kullanıcısı otomatik oluşturulur

## 🐛 Sorun Giderme

**Deploy başarısız olursa:**
1. Render logs'u kontrol et
2. Build command'in doğru olduğundan emin ol
3. Environment variables'ları kontrol et
4. `DATABASE_URL` mutlaka ayarlanmış olmalı

**Database problemi:**
```bash
# Yerel test
DATABASE_URL="file:./dev.db" npx prisma db push
```

**Build hatası:**
```bash
npm run build
# Eğer başarılıysa, deploy de başarılı olur
```

## ✅ Başarı!

Site çalışıyorsa:
- Ana sayfa görünmeli
- Dil değiştirme çalışmalı
- Admin panel'e giriş yapılabilmeli
- Rubl fiyatı ve hesaplar eklenebilmeli
- WhatsApp entegrasyonu çalışmalı

🎉 **Tebrikler! Siteniz canlıda!**

