import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../models/database.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';
import { generateId, sanitizeUser } from '../utils/helpers.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, companyName } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateId();
    const orgId = generateId();
    
    const organization = db.prepare(`
      INSERT INTO organizations (id, name, email, license_type, license_expires, max_users)
      VALUES (?, ?, ?, 'starter', datetime('now', '+14 days'), 5)
    `).run(orgId, companyName || 'My Company', email);
    
    const user = db.prepare(`
      INSERT INTO users (id, organization_id, email, password, name, role)
      VALUES (?, ?, ?, ?, ?, 'admin')
    `).run(userId, orgId, email, hashedPassword, name);
    
    const token = generateToken({
      id: userId,
      email,
      name,
      role: 'admin',
      organization_id: orgId,
      license_type: 'starter'
    });
    
    res.status(201).json({
      token,
      user: { id: userId, email, name, role: 'admin' },
      organization: { id: orgId, name: companyName || 'My Company', license_type: 'starter' }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND active = 1').get(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const organization = db.prepare('SELECT * FROM organizations WHERE id = ?').get(user.organization_id);
    
    const licenseExpired = organization.license_expires && 
      new Date(organization.license_expires) < new Date();
    
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organization_id: user.organization_id,
      license_type: licenseExpired ? 'expired' : organization.license_type,
      license_expires: organization.license_expires
    });
    
    const { password: _, ...sanitizedUser } = user;
    
    res.json({
      token,
      user: sanitizedUser,
      organization: {
        ...organization,
        license_expired: licenseExpired
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', authMiddleware, (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    const organization = db.prepare('SELECT * FROM organizations WHERE id = ?').get(req.user.organization_id);
    
    const { password, ...sanitizedUser } = user;
    
    res.json({
      user: sanitizedUser,
      organization
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;