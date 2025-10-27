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

// PYTHON HACK VERSION CHECK
app.get('/api/hack-version', async (req, res) => {
  try {
    const { version } = req.query;
    console.log(`[HACK_VERSION] Versiyon kontrolü - Client: ${version}`);
    
    // Current version
    const currentVersion = "1.0.0";
    const downloadUrl = "https://github.com/your-repo/releases/latest/pbazgold_hack.exe";
    const changelog = "v1.0.0 - İlk sürüm";
    
    const needsUpdate = version !== currentVersion;
    
    res.json({
      current: currentVersion,
      latest: currentVersion,
      needsUpdate,
      downloadUrl,
      changelog
    });
  } catch (error) {
    console.error('[HACK_VERSION] ❌ Hata:', error);
    res.status(500).json({ error: 'Server xətası' });
  }
});

// PYTHON HACK AUTH ENDPOINTS
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`[HACK_LOGIN] ========================================`);
    console.log(`[HACK_LOGIN] Login denemesi - Kullanıcı: ${username}`);
    console.log(`[HACK_LOGIN] ========================================`);

    console.log(`[HACK_LOGIN] Supabase'den kullanıcı aranıyor...`);
    
    // Try both uppercase and lowercase table names
    let hackUser = null;
    let error = null;
    
    const { data, error: err1 } = await supabase
      .from('hackusers')
      .select('*')
      .eq('username', username)
      .single();
    
    if (err1) {
      console.log(`[HACK_LOGIN] hackusers tablosunda bulunamadı, HackUsers deneniyor...`);
      const { data: data2, error: err2 } = await supabase
        .from('HackUsers')
        .select('*')
        .eq('username', username)
        .single();
      
      hackUser = data2;
      error = err2;
    } else {
      hackUser = data;
      error = err1;
    }

    console.log(`[HACK_LOGIN] Supabase query tamamlandı`);
    console.log(`[HACK_LOGIN] Error:`, error);
    console.log(`[HACK_LOGIN] HackUser found:`, !!hackUser);

    if (error) {
      console.log(`[HACK_LOGIN] ❌ Supabase hatası: ${error.message}`);
      console.log(`[HACK_LOGIN] ❌ Error code: ${error.code}`);
      console.log(`[HACK_LOGIN] ❌ Error details: ${error.details}`);
      console.log(`[HACK_LOGIN] ❌ Full error:`, JSON.stringify(error, null, 2));
      return res.json({ success: false, message: 'İstifadəçi tapılmadı' });
    }

    if (!hackUser) {
      console.log(`[HACK_LOGIN] ❌ Kullanıcı bulunamadı: ${username}`);
      return res.json({ success: false, message: 'İstifadəçi tapılmadı' });
    }

    console.log(`[HACK_LOGIN] ✅ Kullanıcı bulundu:`);
    console.log(`[HACK_LOGIN] - ID: ${hackUser.id}`);
    console.log(`[HACK_LOGIN] - Username: ${hackUser.username}`);
    console.log(`[HACK_LOGIN] - Is active: ${hackUser.is_active}`);

    // Check if user is active
    if (!hackUser.is_active) {
      console.log(`[HACK_LOGIN] ❌ Kullanıcı pasif durumda: ${username}`);
      return res.json({ success: false, message: 'Hesabınız pasif durumda! Admin ile iletişime geçin.' });
    }

    console.log(`[HACK_LOGIN] Şifre kontrolü yapılıyor...`);
    const isValidPassword = await bcrypt.compare(password, hackUser.password);
    console.log(`[HACK_LOGIN] Şifre doğru mu: ${isValidPassword}`);
    
    if (!isValidPassword) {
      console.log(`[HACK_LOGIN] ❌ Şifre yanlış - Kullanıcı: ${username}`);
      return res.json({ success: false, message: 'Şifrə yanlışdır' });
    }

    const token = jwt.sign({ id: hackUser.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    console.log(`[HACK_LOGIN] ✅ Login başarılı - Kullanıcı: ${username}`);
    console.log(`[HACK_LOGIN] Token oluşturuldu (ilk 30): ${token.substring(0, 30)}...`);
    
    res.json({ 
      success: true,
      token,
      user: {
        id: hackUser.id,
        username: hackUser.username,
        is_active: hackUser.is_active,
        subscription_end: hackUser.subscription_end
      }
    });
    console.log(`[HACK_LOGIN] ========================================`);
  } catch (error) {
    console.error('[HACK_LOGIN] ❌ Login hatası:', error);
    console.error('[HACK_LOGIN] ❌ Error stack:', error.stack);
    res.json({ success: false, message: 'Server xətası' });
  }
});

app.post('/api/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    console.log(`[HACK_VERIFY] ========================================`);
    console.log(`[HACK_VERIFY] Verify request received`);
    console.log(`[HACK_VERIFY] Token exists: ${!!token}`);
    
    if (!token) {
      console.log(`[HACK_VERIFY] ❌ Token yok`);
      return res.json({ success: false, message: 'Token yoxdur' });
    }

    console.log(`[HACK_VERIFY] Token decrypt ediliyor...`);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`[HACK_VERIFY] Decoded token:`, decoded);
    console.log(`[HACK_VERIFY] User ID from token:`, decoded.id);
    
    // Try both lowercase and uppercase table names
    console.log(`[HACK_VERIFY] Supabase'den kullanıcı aranıyor (ID: ${decoded.id})...`);
    
    let hackUser = null;
    let error = null;
    
    const { data, error: err1 } = await supabase
      .from('hackusers')
      .select('*')
      .eq('id', decoded.id)
      .single();
    
    console.log(`[HACK_VERIFY] hackusers query sonucu:`, { data, error: err1 });
    
    if (err1) {
      console.log(`[HACK_VERIFY] hackusers tablosunda bulunamadı, HackUsers deneniyor...`);
      const { data: data2, error: err2 } = await supabase
        .from('HackUsers')
        .select('*')
        .eq('id', decoded.id)
        .single();
      
      console.log(`[HACK_VERIFY] HackUsers query sonucu:`, { data: data2, error: err2 });
      
      hackUser = data2;
      error = err2;
    } else {
      hackUser = data;
      error = err1;
    }

    console.log(`[HACK_VERIFY] Final result - HackUser found:`, !!hackUser);
    console.log(`[HACK_VERIFY] Final result - Error:`, error);

    if (error || !hackUser) {
      console.log(`[HACK_VERIFY] ❌ Kullanıcı bulunamadı`);
      if (error) {
        console.log(`[HACK_VERIFY] Error details:`, JSON.stringify(error, null, 2));
      }
      return res.json({ success: false, message: 'İstifadəçi tapılmadı' });
    }

    console.log(`[HACK_VERIFY] ✅ Kullanıcı bulundu:`, hackUser.username);
    
    res.json({ 
      success: true,
      user: {
        id: hackUser.id,
        username: hackUser.username,
        is_active: hackUser.is_active,
        subscription_end: hackUser.subscription_end
      }
    });
    
    console.log(`[HACK_VERIFY] ========================================`);
  } catch (error) {
    console.error('[HACK_VERIFY] ❌ Verify hatası:', error);
    console.error('[HACK_VERIFY] ❌ Error stack:', error.stack);
    res.json({ success: false, message: 'Token etibarsızdır' });
  }
});

app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    console.log('[HACK_USERS] GET - Kullanıcılar listeleniyor...');
    
    // Try hackusers table name first (lowercase)
    const { data: hackUsers, error } = await supabase
      .from('hackusers')
      .select('*')
      .order('id', { ascending: false });
    
    if (error) {
      console.log('[HACK_USERS] ❌ HackUsers ile hata:', error.message);
      console.log('[HACK_USERS] ❌ Hata detayı:', JSON.stringify(error, null, 2));
      
      // Try public.hackusers if exists
      const { data: data2, error: error2 } = await supabase
        .from('public.hackusers')
        .select('*')
        .order('id', { ascending: false });
      
      if (error2) {
        console.log('[HACK_USERS] ❌ public.hackusers ile hata:', error2.message);
        return res.status(500).json({ error: 'Server xətası', details: error.message });
      }
      
      console.log(`[HACK_USERS] ✅ ${data2.length} kullanıcı getirildi (public.hackusers)`);
      return res.json(data2);
    }
    
    console.log(`[HACK_USERS] ✅ ${hackUsers.length} kullanıcı getirildi`);
    res.json(hackUsers);
  } catch (error) {
    console.error('[HACK_USERS] ❌ Hata:', error);
    console.error('[HACK_USERS] ❌ Error stack:', error.stack);
    res.status(500).json({ error: 'Server xətası', details: error.message });
  }
});

app.post('/api/users', authenticateToken, async (req, res) => {
  try {
    const { username, password, is_active, subscription_end } = req.body;
    console.log('[HACK_USERS] POST - Yeni kullanıcı ekleniyor...', username);
    console.log('[HACK_USERS] Payload:', JSON.stringify({ username, is_active, subscription_end, password: '***' }, null, 2));

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('[HACK_USERS] Password hashed');

    const { data, error } = await supabase
      .from('hackusers')
      .insert([{
        username,
        password: hashedPassword,
        is_active,
        subscription_end
      }])
      .select()
      .single();
    
    if (error) {
      console.log('[HACK_USERS] ❌ Kullanıcı eklenemedi:', error.message);
      console.log('[HACK_USERS] ❌ Error code:', error.code);
      console.log('[HACK_USERS] ❌ Error details:', error.details);
      console.log('[HACK_USERS] ❌ Full error:', JSON.stringify(error, null, 2));
      return res.status(500).json({ error: 'Server xətası', details: error.message });
    }
    
    console.log('[HACK_USERS] ✅ Kullanıcı eklendi:', data.id);
    res.json(data);
  } catch (error) {
    console.error('[HACK_USERS] ❌ Hata:', error);
    console.error('[HACK_USERS] ❌ Error stack:', error.stack);
    res.status(500).json({ error: 'Server xətası', details: error.message });
  }
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, is_active, subscription_end } = req.body;
    console.log('[HACK_USERS] PUT - Kullanıcı güncelleniyor...', id);

    const updateData = { username, is_active, subscription_end };
    
    // Only update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    console.log('[HACK_USERS] Update data:', JSON.stringify({ ...updateData, password: updateData.password ? '***' : undefined }, null, 2));

    const { data, error } = await supabase
      .from('hackusers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.log('[HACK_USERS] ❌ Kullanıcı güncellenemedi:', error.message);
      console.log('[HACK_USERS] ❌ Error details:', JSON.stringify(error, null, 2));
      return res.status(500).json({ error: 'Server xətası', details: error.message });
    }
    
    console.log('[HACK_USERS] ✅ Kullanıcı güncellendi:', data.id);
    res.json(data);
  } catch (error) {
    console.error('[HACK_USERS] ❌ Hata:', error);
    console.error('[HACK_USERS] ❌ Error stack:', error.stack);
    res.status(500).json({ error: 'Server xətası', details: error.message });
  }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('[HACK_USERS] DELETE - Kullanıcı siliniyor...', id);

    const { error } = await supabase
      .from('hackusers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.log('[HACK_USERS] ❌ Kullanıcı silinemedi:', error.message);
      console.log('[HACK_USERS] ❌ Error details:', JSON.stringify(error, null, 2));
      return res.status(500).json({ error: 'Server xətası', details: error.message });
    }
    
    console.log('[HACK_USERS] ✅ Kullanıcı silindi:', id);
    res.json({ success: true });
  } catch (error) {
    console.error('[HACK_USERS] ❌ Hata:', error);
    console.error('[HACK_USERS] ❌ Error stack:', error.stack);
    res.status(500).json({ error: 'Server xətası', details: error.message });
  }
});

// Auth routes (Admin Panel)
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
    const { name, description, rankGif, price, youtubeUrl, creditPercentage } = req.body;
    console.log(`[ACCOUNTS] POST - Yeni hesap ekleniyor: ${name}`);
    
    const { data: account, error } = await supabase
      .from('Account')
      .insert([{
        name,
        description,
        rankGif,
        price: parseFloat(price),
        youtubeUrl,
        creditPercentage: creditPercentage ? parseInt(creditPercentage) : 40
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
    const { name, description, rankGif, price, youtubeUrl, creditPercentage } = req.body;
    console.log(`[ACCOUNTS] PUT - Hesap güncelleniyor: ID ${id}`);
    
    const { data: account, error } = await supabase
      .from('Account')
      .update({
        name,
        description,
        rankGif,
        price: parseFloat(price),
        youtubeUrl,
        creditPercentage: creditPercentage ? parseInt(creditPercentage) : 40
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

// Boost Settings routes
app.get('/api/boost-settings', async (req, res) => {
  try {
    console.log('[BOOST] GET - Boost ayarları getiriliyor...');
    const { data: settings, error } = await supabase
      .from('BoostSettings')
      .select('*')
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.log('[BOOST] ❌ Boost ayarları getirilemedi:', error.message);
      return res.status(500).json({ error: 'Server xətası' });
    }
    
    console.log('[BOOST] ✅ Boost ayarları getirildi:', settings || { battlePassPrice: 0, rankPrice: 0, rutbePrice: 0, misyaPrice: 0, macroPrice: 0 });
    res.json(settings || { battlePassPrice: 0, rankPrice: 0, rutbePrice: 0, misyaPrice: 0, macroPrice: 0 });
  } catch (error) {
    console.error('[BOOST] ❌ Hata:', error);
    res.status(500).json({ error: 'Server xətası' });
  }
});

app.put('/api/boost-settings', authenticateToken, async (req, res) => {
  try {
    const { battlePassPrice, rankPrice, rutbePrice, misyaPrice, macroPrice } = req.body;
    console.log(`[BOOST] PUT - Boost ayarları güncelleniyor...`);
    
    const { data: settings, error: fetchError } = await supabase
      .from('BoostSettings')
      .select('*')
      .limit(1)
      .single();
    
    if (settings) {
      console.log('[BOOST] Mevcut ayar güncelleniyor...');
      // Update existing settings
      const updateData = {
        battlePassPrice: parseFloat(battlePassPrice),
        rankPrice: parseFloat(rankPrice),
        rutbePrice: parseFloat(rutbePrice),
        misyaPrice: parseFloat(misyaPrice)
      };
      
      // Add macroPrice if provided
      if (macroPrice !== undefined) {
        updateData.macroPrice = parseFloat(macroPrice);
      }
      
      const { data: updated, error } = await supabase
        .from('BoostSettings')
        .update(updateData)
        .eq('id', settings.id)
        .select()
        .single();
      
      if (error) {
        console.log('[BOOST] ❌ Güncelleme hatası:', error.message);
        return res.status(500).json({ error: 'Server xətası' });
      }
      console.log('[BOOST] ✅ Boost ayarları güncellendi:', updated);
      res.json(updated);
    } else {
      console.log('[BOOST] Yeni ayar oluşturuluyor...');
      // Create new settings
      const insertData = {
        battlePassPrice: parseFloat(battlePassPrice),
        rankPrice: parseFloat(rankPrice),
        rutbePrice: parseFloat(rutbePrice),
        misyaPrice: parseFloat(misyaPrice)
      };
      
      // Add macroPrice if provided
      if (macroPrice !== undefined) {
        insertData.macroPrice = parseFloat(macroPrice);
      }
      
      const { data: created, error } = await supabase
        .from('BoostSettings')
        .insert([insertData])
        .select()
        .single();
      
      if (error) {
        console.log('[BOOST] ❌ Oluşturma hatası:', error.message);
        return res.status(500).json({ error: 'Server xətası' });
      }
      console.log('[BOOST] ✅ Boost ayarları oluşturuldu:', created);
      res.json(created);
    }
  } catch (error) {
    console.error('[BOOST] ❌ Hata:', error);
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

