import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.ANON_PUBLIC
);

const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || '*']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Serve static files from frontend dist folder
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token yoxdur' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token etibarsızdır' });
    }
    req.user = user;
    next();
  });
};

// Database initialization
async function initializeDatabase() {
  try {
    console.log('Supabase bağlantısı test ediliyor...');
    
    // Test Supabase connection
    const { data, error } = await supabase.from('Settings').select('*').limit(1);
    
    if (error) {
      console.error('Supabase bağlantı hatası:', error);
      return;
    }
    
    console.log('Supabase bağlantısı başarılı!');
    
    // Check if admin user exists
    const { data: adminData, error: adminError } = await supabase
      .from('Admin')
      .select('*')
      .limit(1);
    
    if (adminError) {
      console.error('Admin kontrolü hatası:', adminError);
      return;
    }
    
    if (!adminData || adminData.length === 0) {
      console.log('Admin kullanıcısı bulunamadı. Lütfen Supabase SQL Editor\'da tabloları oluşturun.');
    } else {
      console.log('Admin kullanıcısı mevcut');
    }
    
  } catch (error) {
    console.error('Database başlatma xətası:', error);
  }
}

// API Routes

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`[LOGIN] Login denemesi - Kullanıcı: ${username}`);

    const { data: admin, error } = await supabase
      .from('Admin')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !admin) {
      console.log(`[LOGIN] ❌ Kullanıcı bulunamadı: ${username}`, error?.message);
      return res.status(401).json({ error: 'İstifadəçi tapılmadı' });
    }

    console.log(`[LOGIN] ✓ Kullanıcı bulundu: ${username}, ID: ${admin.id}`);
    console.log(`[LOGIN] Şifre kontrolü yapılıyor...`);

    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      console.log(`[LOGIN] ❌ Şifre yanlış - Kullanıcı: ${username}`);
      return res.status(401).json({ error: 'Şifrə yanlışdır' });
    }

    console.log(`[LOGIN] ✓ Şifre doğru - Token oluşturuluyor...`);
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    console.log(`[LOGIN] ✅ Login başarılı - Kullanıcı: ${username}`);
    
    res.json({ token });
  } catch (error) {
    console.error('[LOGIN] ❌ Login hatası:', error);
    res.status(500).json({ error: 'Server xətası' });
  }
});

// Settings routes
app.get('/api/settings', async (req, res) => {
  try {
    console.log('[SETTINGS] GET - Ayarlar getiriliyor...');
    const { data: settings, error } = await supabase
      .from('Settings')
      .select('*')
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.log('[SETTINGS] ❌ Ayarlar getirilemedi:', error.message);
      return res.status(500).json({ error: 'Server xətası' });
    }
    
    console.log('[SETTINGS] ✅ Ayarlar getirildi:', settings || { rubleRate: 0 });
    res.json(settings || { rubleRate: 0 });
  } catch (error) {
    console.error('[SETTINGS] ❌ Hata:', error);
    res.status(500).json({ error: 'Server xətası' });
  }
});

app.put('/api/settings', authenticateToken, async (req, res) => {
  try {
    const { rubleRate } = req.body;
    console.log(`[SETTINGS] PUT - Ruble rate güncelleniyor: ${rubleRate}`);
    
    const { data: settings, error: fetchError } = await supabase
      .from('Settings')
      .select('*')
      .limit(1)
      .single();
    
    if (settings) {
      console.log('[SETTINGS] Mevcut ayar güncelleniyor...');
      // Update existing settings
      const { data: updated, error } = await supabase
        .from('Settings')
        .update({ rubleRate: parseFloat(rubleRate) })
        .eq('id', settings.id)
        .select()
        .single();
      
      if (error) {
        console.log('[SETTINGS] ❌ Güncelleme hatası:', error.message);
        return res.status(500).json({ error: 'Server xətası' });
      }
      console.log('[SETTINGS] ✅ Ayarlar güncellendi:', updated);
      res.json(updated);
    } else {
      console.log('[SETTINGS] Yeni ayar oluşturuluyor...');
      // Create new settings
      const { data: created, error } = await supabase
        .from('Settings')
        .insert([{ rubleRate: parseFloat(rubleRate) }])
        .select()
        .single();
      
      if (error) {
        console.log('[SETTINGS] ❌ Oluşturma hatası:', error.message);
        return res.status(500).json({ error: 'Server xətası' });
      }
      console.log('[SETTINGS] ✅ Ayarlar oluşturuldu:', created);
      res.json(created);
    }
  } catch (error) {
    console.error('[SETTINGS] ❌ Hata:', error);
    res.status(500).json({ error: 'Server xətası' });
  }
});

// Accounts routes
app.get('/api/accounts', async (req, res) => {
  try {
    console.log('[ACCOUNTS] GET - Hesaplar listeleniyor...');
    const { data: accounts, error } = await supabase
      .from('Account')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.log('[ACCOUNTS] ❌ Hesaplar listelenemedi:', error.message);
      return res.status(500).json({ error: 'Server xətası' });
    }
    
    console.log(`[ACCOUNTS] ✅ ${accounts?.length || 0} hesap listelendi`);
    res.json(accounts || []);
  } catch (error) {
    console.error('[ACCOUNTS] ❌ Hata:', error);
    res.status(500).json({ error: 'Server xətası' });
  }
});

app.post('/api/accounts', authenticateToken, async (req, res) => {
  try {
    const { name, description, rankGif, price, youtubeUrl } = req.body;
    console.log(`[ACCOUNTS] POST - Yeni hesap ekleniyor: ${name}`);
    
    const { data: account, error } = await supabase
      .from('Account')
      .insert([{
        name,
        description,
        rankGif,
        price: parseFloat(price),
        youtubeUrl
      }])
      .select()
      .single();
    
    if (error) {
      console.log('[ACCOUNTS] ❌ Hesap eklenemedi:', error.message);
      return res.status(500).json({ error: 'Server xətası' });
    }
    
    console.log(`[ACCOUNTS] ✅ Hesap eklendi: ${name}, ID: ${account.id}`);
    res.json(account);
  } catch (error) {
    console.error('[ACCOUNTS] ❌ Hesap yaratma hatası:', error);
    res.status(500).json({ error: 'Server xətası' });
  }
});

app.put('/api/accounts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, rankGif, price, youtubeUrl } = req.body;
    console.log(`[ACCOUNTS] PUT - Hesap güncelleniyor: ID ${id}`);
    
    const { data: account, error } = await supabase
      .from('Account')
      .update({
        name,
        description,
        rankGif,
        price: parseFloat(price),
        youtubeUrl
      })
      .eq('id', parseInt(id))
      .select()
      .single();
    
    if (error) {
      console.log(`[ACCOUNTS] ❌ Hesap güncellenemedi: ID ${id}`, error.message);
      return res.status(500).json({ error: 'Server xətası' });
    }
    
    console.log(`[ACCOUNTS] ✅ Hesap güncellendi: ${name}, ID: ${id}`);
    res.json(account);
  } catch (error) {
    console.error('[ACCOUNTS] ❌ Güncelleme hatası:', error);
    res.status(500).json({ error: 'Server xətası' });
  }
});

app.delete('/api/accounts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[ACCOUNTS] DELETE - Hesap siliniyor: ID ${id}`);
    
    const { error } = await supabase
      .from('Account')
      .delete()
      .eq('id', parseInt(id));
    
    if (error) {
      console.log(`[ACCOUNTS] ❌ Hesap silinemedi: ID ${id}`, error.message);
      return res.status(500).json({ error: 'Server xətası' });
    }
    
    console.log(`[ACCOUNTS] ✅ Hesap silindi: ID ${id}`);
    res.json({ success: true });
  } catch (error) {
    console.error('[ACCOUNTS] ❌ Silme hatası:', error);
    res.status(500).json({ error: 'Server xətası' });
  }
});

// Serve frontend for all other routes (in production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, async () => {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                                                        ║');
  console.log(`║      🚀 SERVER BAŞLATILDI - PORT: ${PORT}              ║`);
  console.log('║                                                        ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  console.log(`📍 Backend API: http://localhost:${PORT}/api`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`📍 Frontend: http://localhost:${PORT}`);
  }
  console.log(`🔧 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n${'='.repeat(56)}\n`);
  
  await initializeDatabase();
  
  console.log(`\n${'='.repeat(56)}`);
  console.log('✅ Server hazır! İstekleri dinliyor...\n');
});

