-- PointBlank Market - Supabase Database Setup
-- Bu SQL scriptini Supabase Dashboard -> SQL Editor'da çalıştırın

-- 1. Admin tablosu oluştur
CREATE TABLE IF NOT EXISTS "Admin" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Settings tablosu oluştur
CREATE TABLE IF NOT EXISTS "Settings" (
  "id" SERIAL PRIMARY KEY,
  "rubleRate" DECIMAL(10, 2) NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Account tablosu oluştur
CREATE TABLE IF NOT EXISTS "Account" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "rankGif" VARCHAR(255),
  "price" DECIMAL(10, 2) NOT NULL,
  "youtubeUrl" VARCHAR(500),
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. İlk admin kullanıcısı oluştur (username: admin, password: admin123)
-- Şifre bcrypt ile hashlenmiş: admin123
INSERT INTO "Admin" ("username", "password")
VALUES ('admin', '$2a$10$VU6IJ5R6Z.Vdg9kXGDPTFu8tkHlF.XWFZrw2rl9QV5S5KkNH53pR2')
ON CONFLICT ("username") DO NOTHING;

-- 5. Varsayılan ayarları ekle
INSERT INTO "Settings" ("rubleRate")
VALUES (0)
ON CONFLICT DO NOTHING;

-- 6. Row Level Security (RLS) ayarları
ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;

-- 7. Public erişim politikaları
-- Settings tablosu - herkes okuyabilir
CREATE POLICY "Settings are viewable by everyone" ON "Settings"
  FOR SELECT USING (true);

-- Settings tablosu - herkes güncelleyebilir (backend'de auth kontrolü var)
CREATE POLICY "Settings can be updated by everyone" ON "Settings"
  FOR UPDATE USING (true);

-- Settings tablosu - herkes ekleyebilir
CREATE POLICY "Settings can be inserted by everyone" ON "Settings"
  FOR INSERT WITH CHECK (true);

-- Account tablosu - herkes okuyabilir
CREATE POLICY "Accounts are viewable by everyone" ON "Account"
  FOR SELECT USING (true);

-- Account tablosu - herkes ekleyebilir (backend'de auth kontrolü var)
CREATE POLICY "Accounts can be inserted by everyone" ON "Account"
  FOR INSERT WITH CHECK (true);

-- Account tablosu - herkes güncelleyebilir (backend'de auth kontrolü var)
CREATE POLICY "Accounts can be updated by everyone" ON "Account"
  FOR UPDATE USING (true);

-- Account tablosu - herkes silebilir (backend'de auth kontrolü var)
CREATE POLICY "Accounts can be deleted by everyone" ON "Account"
  FOR DELETE USING (true);

-- Admin tablosu - herkes okuyabilir (login için gerekli)
CREATE POLICY "Admin are viewable by everyone" ON "Admin"
  FOR SELECT USING (true);

-- Admin tablosu - herkes ekleyebilir
CREATE POLICY "Admin can be inserted by everyone" ON "Admin"
  FOR INSERT WITH CHECK (true);

