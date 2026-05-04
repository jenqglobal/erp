import express from 'express';
import db from '../models/database.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateId, paginate, generateInvoiceNumber, calculateTax } from '../utils/helpers.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/invoices', (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const { limit: l, offset } = paginate(page, limit);
    
    let query = 'SELECT * FROM invoices WHERE organization_id = ?';
    const params = [req.user.organization_id];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(l, offset);
    
    const invoices = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM invoices WHERE organization_id = ?').get(req.user.organization_id);
    
    res.json({ invoices, total: total.count, page: parseInt(page), limit: l });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

router.post('/invoices', (req, res) => {
  try {
    const { customer_id, order_id, subtotal, due_date, notes } = req.body;
    const invoiceId = generateId();
    const invoiceNumber = generateInvoiceNumber();
    
    const tax = calculateTax(subtotal);
    const total = subtotal + tax;
    
    db.prepare(`
      INSERT INTO invoices (id, organization_id, invoice_number, order_id, customer_id, subtotal, tax, total, due_date, notes, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(invoiceId, req.user.organization_id, invoiceNumber, order_id, customer_id, subtotal, tax, total, due_date, notes, req.user.id);
    
    res.status(201).json({ id: invoiceId, invoice_number: invoiceNumber, message: 'Invoice created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

router.put('/invoices/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, paid_date } = req.body;
    
    db.prepare(`
      UPDATE invoices SET status = COALESCE(?, status), paid_date = COALESCE(?, paid_date)
      WHERE id = ? AND organization_id = ?
    `).run(status, paid_date, id, req.user.organization_id);
    
    res.json({ message: 'Invoice updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

router.get('/expenses', (req, res) => {
  try {
    const { page = 1, limit = 20, category, status } = req.query;
    const { limit: l, offset } = paginate(page, limit);
    
    let query = 'SELECT * FROM expenses WHERE organization_id = ?';
    const params = [req.user.organization_id];
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(l, offset);
    
    const expenses = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM expenses WHERE organization_id = ?').get(req.user.organization_id);
    
    res.json({ expenses, total: total.count, page: parseInt(page), limit: l });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

router.post('/expenses', (req, res) => {
  try {
    const { title, category, amount, date, vendor, receipt, notes } = req.body;
    
    db.prepare(`
      INSERT INTO expenses (id, organization_id, title, category, amount, date, vendor, receipt, notes, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(generateId(), req.user.organization_id, title, category, amount, date, vendor, receipt, notes, req.user.id);
    
    res.status(201).json({ message: 'Expense created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

router.put('/expenses/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, amount, date, vendor, status, notes } = req.body;
    
    db.prepare(`
      UPDATE expenses SET title = COALESCE(?, title), category = COALESCE(?, category),
      amount = COALESCE(?, amount), date = COALESCE(?, date), vendor = COALESCE(?, vendor),
      status = COALESCE(?, status), notes = COALESCE(?, notes)
      WHERE id = ? AND organization_id = ?
    `).run(title, category, amount, date, vendor, status, notes, id, req.user.organization_id);
    
    res.json({ message: 'Expense updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

router.delete('/expenses/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM expenses WHERE id = ? AND organization_id = ?').run(id, req.user.organization_id);
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

router.get('/reports/summary', (req, res) => {
  try {
    const revenue = db.prepare(`
      SELECT COALESCE(SUM(total), 0) as value FROM invoices 
      WHERE organization_id = ? AND status = 'paid'
    `).get(req.user.organization_id);
    
    const pendingRevenue = db.prepare(`
      SELECT COALESCE(SUM(total), 0) as value FROM invoices 
      WHERE organization_id = ? AND status = 'sent'
    `).get(req.user.organization_id);
    
    const totalExpenses = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as value FROM expenses 
      WHERE organization_id = ? AND status = 'approved'
    `).get(req.user.organization_id);
    
    res.json({
      revenue: revenue.value,
      pending_revenue: pendingRevenue.value,
      expenses: totalExpenses.value,
      profit: revenue.value - totalExpenses.value
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

export default router;