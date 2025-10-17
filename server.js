import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Ensure DATABASE_URL is set (default for production)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./prod.db';
}

const prisma = new PrismaClient();
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
    // Create settings if not exists
    const settings = await prisma.settings.findFirst();
    if (!settings) {
      await prisma.settings.create({
        data: { rubleRate: 50.0 }
      });
      console.log('Settings yaradıldı');
    }

    // Create admin user if not exists
    const adminUser = await prisma.admin.findFirst();
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('Ehmed2025%%%%%', 10);
      await prisma.admin.create({
        data: {
          username: 'Admin',
          password: hashedPassword
        }
      });
      console.log('Admin istifadəçisi yaradıldı: Admin / Ehmed2025%%%%%');
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

    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
      return res.status(401).json({ error: 'İstifadəçi tapılmadı' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Şifrə yanlışdır' });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// Settings routes
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await prisma.settings.findFirst();
    res.json(settings || { rubleRate: 0 });
  } catch (error) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

app.put('/api/settings', authenticateToken, async (req, res) => {
  try {
    const { rubleRate } = req.body;
    
    const settings = await prisma.settings.findFirst();
    if (settings) {
      const updated = await prisma.settings.update({
        where: { id: settings.id },
        data: { rubleRate: parseFloat(rubleRate) }
      });
      res.json(updated);
    } else {
      const created = await prisma.settings.create({
        data: { rubleRate: parseFloat(rubleRate) }
      });
      res.json(created);
    }
  } catch (error) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// Accounts routes
app.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await prisma.account.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

app.post('/api/accounts', authenticateToken, async (req, res) => {
  try {
    const { name, description, rank, price, youtubeUrl } = req.body;
    
    const account = await prisma.account.create({
      data: {
        name,
        description,
        rank,
        price: parseFloat(price),
        youtubeUrl
      }
    });
    res.json(account);
  } catch (error) {
    console.error('Hesab yaratma xətası:', error);
    res.status(500).json({ error: 'Server xətası' });
  }
});

app.put('/api/accounts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, rank, price, youtubeUrl } = req.body;
    
    const account = await prisma.account.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        rank,
        price: parseFloat(price),
        youtubeUrl
      }
    });
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

app.delete('/api/accounts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.account.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true });
  } catch (error) {
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
  console.log(`Server ${PORT} portunda işləyir`);
  await initializeDatabase();
});

