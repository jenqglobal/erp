import express from 'express';
import db from '../models/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/stats', (req, res) => {
  try {
    const contacts = db.prepare('SELECT COUNT(*) as count FROM contacts WHERE organization_id = ?').get(req.user.organization_id);
    const deals = db.prepare('SELECT COUNT(*) as count FROM deals WHERE organization_id = ?').get(req.user.organization_id);
    const products = db.prepare('SELECT COUNT(*) as count FROM products WHERE organization_id = ? AND active = 1').get(req.user.organization_id);
    const orders = db.prepare('SELECT COUNT(*) as count FROM orders WHERE organization_id = ?').get(req.user.organization_id);
    const invoices = db.prepare('SELECT COUNT(*) as count FROM invoices WHERE organization_id = ?').get(req.user.organization_id);
    const employees = db.prepare('SELECT COUNT(*) as count FROM employees WHERE organization_id = ?').get(req.user.organization_id);
    const projects = db.prepare('SELECT COUNT(*) as count FROM projects WHERE organization_id = ?').get(req.user.organization_id);
    
    const revenue = db.prepare(`
      SELECT COALESCE(SUM(total), 0) as value FROM invoices 
      WHERE organization_id = ? AND status = 'paid'
    `).get(req.user.organization_id);
    
    const pendingRevenue = db.prepare(`
      SELECT COALESCE(SUM(total), 0) as value FROM invoices 
      WHERE organization_id = ? AND status IN ('draft', 'sent')
    `).get(req.user.organization_id);
    
    res.json({
      contacts: contacts.count,
      deals: deals.count,
      products: products.count,
      orders: orders.count,
      invoices: invoices.count,
      employees: employees.count,
      projects: projects.count,
      revenue: revenue.value,
      pending_revenue: pendingRevenue.value
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/activity', (req, res) => {
  try {
    const activities = db.prepare(`
      SELECT * FROM activities WHERE organization_id = ?
      ORDER BY created_at DESC LIMIT 20
    `).all(req.user.organization_id);
    
    res.json({ activities });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

router.get('/chart/revenue', (req, res) => {
  try {
    const monthly = db.prepare(`
      SELECT strftime('%Y-%m', created_at) as month, SUM(total) as revenue
      FROM invoices WHERE organization_id = ? AND status = 'paid'
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month DESC LIMIT 12
    `).all(req.user.organization_id);
    
    res.json({ monthly });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

router.get('/chart/sales', (req, res) => {
  try {
    const byCategory = db.prepare(`
      SELECT category, COUNT(*) as count FROM products 
      WHERE organization_id = ? AND category IS NOT NULL
      GROUP BY category
    `).all(req.user.organization_id);
    
    res.json({ byCategory });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

export default router;