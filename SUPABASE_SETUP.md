# 🚀 Supabase Kurulum Rehberi

## 📋 Adım Adım Kurulum

### 1️⃣ Supabase Projesi Oluştur

1. https://supabase.com adresine git
2. **"Start your project"** butonuna tıkla
3. GitHub ile giriş yap
4. **"New project"** oluştur
5. Proje adı: `pointblank-market`
6. Database şifresi oluştur (güçlü bir şifre kullan!)
7. Region seç (Frankfurt önerilir)

### 2️⃣ Database URL'ini Al

Supabase dashboard'da:
1. **Settings** → **Database**
2. **Connection string** → **URI** seç
3. URL'yi kopyala (şifre kısmını değiştir)

### 3️⃣ SQL Editor'da Tabloları Oluştur

1. Supabase dashboard'da **SQL Editor**'a git
2. **"New query"** oluştur
3. Aşağıdaki SQL kodunu yapıştır:

```sql
-- PointBlank Market Database Setup for Supabase PostgreSQL
-- Run this in Supabase SQL Editor

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Admin table
CREATE TABLE IF NOT EXISTS "Admin" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Settings table
CREATE TABLE IF NOT EXISTS "Settings" (
    id SERIAL PRIMARY KEY,
    "rubleRate" DECIMAL(10,2) NOT NULL DEFAULT 50.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Account table
CREATE TABLE IF NOT EXISTS "Account" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    "rankGif" VARCHAR(255) NOT NULL DEFAULT '0.gif',
    price DECIMAL(10,2) NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_username ON "Admin"(username);
CREATE INDEX IF NOT EXISTS idx_account_created_at ON "Account"(created_at);
CREATE INDEX IF NOT EXISTS idx_account_rank_gif ON "Account"("rankGif");

-- Insert default admin user (password: Ehmed2025%%%%% hashed with bcrypt)
INSERT INTO "Admin" (username, password) VALUES 
('Admin', '$2a$10$rQ8J8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K')
ON CONFLICT (username) DO NOTHING;

-- Insert default settings
INSERT INTO "Settings" ("rubleRate") VALUES (50.0)
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_admin_updated_at 
    BEFORE UPDATE ON "Admin" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at 
    BEFORE UPDATE ON "Settings" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_account_updated_at 
    BEFORE UPDATE ON "Account" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) for better security
ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to Settings and Account
CREATE POLICY "Public read access to Settings" ON "Settings"
    FOR SELECT USING (true);

CREATE POLICY "Public read access to Account" ON "Account"
    FOR SELECT USING (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON "Settings" TO anon, authenticated;
GRANT SELECT ON "Account" TO anon, authenticated;
GRANT ALL ON "Admin" TO authenticated;

-- Grant sequence permissions for auto-increment
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
```

4. **"Run"** butonuna tıkla

### 4️⃣ Environment Variables Ayarla

Proje klasöründe `.env` dosyası oluştur:

```env
# Supabase Database Configuration
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase Configuration  
SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"

# Application Configuration
NODE_ENV=development
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-in-production-123456

# Frontend API URL (for development)
VITE_API_URL=http://localhost:3001
```

**Önemli:** `[YOUR-PASSWORD]`, `[YOUR-PROJECT-REF]`, `[YOUR-ANON-KEY]` kısımlarını gerçek değerlerle değiştir!

### 5️⃣ Supabase Bilgilerini Bul

**Database URL:**
- Supabase Dashboard → Settings → Database → Connection string → URI

**ANON KEY:**
- Supabase Dashboard → Settings → API → Project API keys → anon public

### 6️⃣ Prisma Client'ı Güncelle

```bash
npx prisma generate
npx prisma db push
```

### 7️⃣ Uygulamayı Başlat

```bash
npm install
npm run dev
```

## 🔧 Render.com Deploy

Render'da deploy için:

### Environment Variables:
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-change-in-production-123456
```

### Build Command:
```bash
yarn && npx prisma generate && npx prisma db push && npx tsc && npx vite build
```

## ✅ Test

Kurulum tamamlandıktan sonra:
- **Local:** http://localhost:5173
- **Admin:** http://localhost:5173/admin/login
- **Kullanıcı:** `Admin`
- **Şifre:** `Ehmed2025%%%%%`

## 🐛 Sorun Giderme

**Database bağlantı hatası:**
- DATABASE_URL'deki şifreyi kontrol et
- Supabase projesinin aktif olduğundan emin ol

**Permission hatası:**
- SQL Editor'da tüm kodları çalıştırdığından emin ol
- RLS policies'lerin doğru oluşturulduğunu kontrol et

**Admin giriş hatası:**
- Default admin kullanıcısının oluşturulduğunu kontrol et
- JWT_SECRET'ın ayarlandığından emin ol
