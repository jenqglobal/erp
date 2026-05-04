import express from 'express';
import db from '../models/database.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateId, paginate } from '../utils/helpers.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/employees', (req, res) => {
  try {
    const { page = 1, limit = 20, department, status } = req.query;
    const { limit: l, offset } = paginate(page, limit);
    
    let query = 'SELECT * FROM employees WHERE organization_id = ?';
    const params = [req.user.organization_id];
    
    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(l, offset);
    
    const employees = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM employees WHERE organization_id = ?').get(req.user.organization_id);
    
    res.json({ employees, total: total.count, page: parseInt(page), limit: l });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

router.post('/employees', (req, res) => {
  try {
    const { first_name, last_name, email, phone, department, position, salary, hire_date } = req.body;
    
    db.prepare(`
      INSERT INTO employees (id, organization_id, first_name, last_name, email, phone, department, position, salary, hire_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(generateId(), req.user.organization_id, first_name, last_name, email, phone, department, position, salary, hire_date);
    
    res.status(201).json({ message: 'Employee created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

router.put('/employees/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, department, position, salary, status } = req.body;
    
    db.prepare(`
      UPDATE employees SET first_name = COALESCE(?, first_name), last_name = COALESCE(?, last_name),
      email = COALESCE(?, email), phone = COALESCE(?, phone), department = COALESCE(?, department),
      position = COALESCE(?, position), salary = COALESCE(?, salary), status = COALESCE(?, status)
      WHERE id = ? AND organization_id = ?
    `).run(first_name, last_name, email, phone, department, position, salary, status, id, req.user.organization_id);
    
    res.json({ message: 'Employee updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

router.get('/leaves', (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const { limit: l, offset } = paginate(page, limit);
    
    let query = 'SELECT * FROM leaves WHERE organization_id = ?';
    const params = [req.user.organization_id];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(l, offset);
    
    const leaves = db.prepare(query).all(...params);
    res.json({ leaves, page: parseInt(page), limit: l });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaves' });
  }
});

router.post('/leaves', (req, res) => {
  try {
    const { employee_id, type, start_date, end_date, days, reason } = req.body;
    
    db.prepare(`
      INSERT INTO leaves (id, organization_id, employee_id, type, start_date, end_date, days, reason)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(generateId(), req.user.organization_id, employee_id, type, start_date, end_date, days, reason);
    
    res.status(201).json({ message: 'Leave request created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create leave' });
  }
});

router.put('/leaves/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    db.prepare('UPDATE leaves SET status = COALESCE(?, status) WHERE id = ? AND organization_id = ?')
      .run(status, id, req.user.organization_id);
    
    res.json({ message: 'Leave updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update leave' });
  }
});

export default router;