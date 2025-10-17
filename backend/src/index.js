import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://pointblank-frontend.onrender.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

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

// Initialize default admin and settings
async function initializeDatabase() {
  try {
    // Check if admin exists
    const adminExists = await prisma.admin.findFirst();
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.admin.create({
        data: {
          username: 'admin',
          password: hashedPassword,
        },
      });
      console.log('Default admin created: username=admin, password=admin123');
    }

    // Check if settings exists
    const settingsExists = await prisma.settings.findFirst();
    if (!settingsExists) {
      await prisma.settings.create({
        data: {
          rubleRate: 1.0,
        },
      });
      console.log('Default settings created');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return res.status(401).json({ error: 'İstifadəçi adı və ya şifrə yanlışdır' });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'İstifadəçi adı və ya şifrə yanlışdır' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, username: admin.username });
  } catch (error) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// Settings routes
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await prisma.settings.findFirst();
    res.json(settings || { rubleRate: 1.0 });
  } catch (error) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

app.put('/api/settings', authenticateToken, async (req, res) => {
  try {
    const { rubleRate } = req.body;
    
    let settings = await prisma.settings.findFirst();
    
    if (!settings) {
      settings = await prisma.settings.create({
        data: { rubleRate },
      });
    } else {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: { rubleRate },
      });
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// Account routes
app.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await prisma.account.findMany({
      orderBy: { createdAt: 'desc' },
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
        youtubeUrl,
      },
    });

    res.json(account);
  } catch (error) {
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
        youtubeUrl,
      },
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
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Hesab silindi' });
  } catch (error) {
    res.status(500).json({ error: 'Server xətası' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, async () => {
  console.log(`Server ${PORT} portunda işləyir`);
  await initializeDatabase();
});

