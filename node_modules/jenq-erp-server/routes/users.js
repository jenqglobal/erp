import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../models/database.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateId } from '../utils/helpers.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/users', (req, res) => {
  try {
    const users = db.prepare(`
      SELECT id, email, name, role, avatar, active, created_at FROM users 
      WHERE organization_id = ?
    `).all(req.user.organization_id);
    
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { email, name, role, password } = req.body;
    
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE organization_id = ?').get(req.user.organization_id);
    const org = db.prepare('SELECT max_users FROM organizations WHERE id = ?').get(req.user.organization_id);
    
    if (userCount.count >= org.max_users) {
      return res.status(400).json({ error: 'User limit reached for your license' });
    }
    
    const hashedPassword = await bcrypt.hash(password || 'password123', 10);
    
    db.prepare(`
      INSERT INTO users (id, organization_id, email, password, name, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(generateId(), req.user.organization_id, email, hashedPassword, name, role);
    
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.put('/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, active } = req.body;
    
    db.prepare(`
      UPDATE users SET name = COALESCE(?, name), role = COALESCE(?, role), active = COALESCE(?, active)
      WHERE id = ? AND organization_id = ?
    `).run(name, role, active, id, req.user.organization_id);
    
    res.json({ message: 'User updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }
    db.prepare('DELETE FROM users WHERE id = ? AND organization_id = ?').run(id, req.user.organization_id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;