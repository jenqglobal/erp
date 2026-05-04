import express from 'express';
import db from '../models/database.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateId, paginate, generateOrderNumber } from '../utils/helpers.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/products', (req, res) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;
    const { limit: l, offset } = paginate(page, limit);
    
    let query = 'SELECT * FROM products WHERE organization_id = ? AND active = 1';
    const params = [req.user.organization_id];
    
    if (search) {
      query += ' AND (name LIKE ? OR sku LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s);
    }
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(l, offset);
    
    const products = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM products WHERE organization_id = ? AND active = 1').get(req.user.organization_id);
    
    res.json({ products, total: total.count, page: parseInt(page), limit: l });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.post('/products', (req, res) => {
  try {
    const { name, sku, description, category, price, cost, quantity, min_stock, unit } = req.body;
    
    db.prepare(`
      INSERT INTO products (id, organization_id, name, sku, description, category, price, cost, quantity, min_stock, unit)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(generateId(), req.user.organization_id, name, sku, description, category, price, cost, quantity, min_stock, unit);
    
    res.status(201).json({ message: 'Product created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, description, category, price, cost, quantity, min_stock, unit } = req.body;
    
    db.prepare(`
      UPDATE products SET name = COALESCE(?, name), sku = COALESCE(?, sku), description = COALESCE(?, description),
      category = COALESCE(?, category), price = COALESCE(?, price), cost = COALESCE(?, cost),
      quantity = COALESCE(?, quantity), min_stock = COALESCE(?, min_stock), unit = COALESCE(?, unit)
      WHERE id = ? AND organization_id = ?
    `).run(name, sku, description, category, price, cost, quantity, min_stock, unit, id, req.user.organization_id);
    
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('UPDATE products SET active = 0 WHERE id = ? AND organization_id = ?').run(id, req.user.organization_id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

router.get('/orders', (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const { limit: l, offset } = paginate(page, limit);
    
    let query = 'SELECT * FROM orders WHERE organization_id = ?';
    const params = [req.user.organization_id];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(l, offset);
    
    const orders = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM orders WHERE organization_id = ?').get(req.user.organization_id);
    
    res.json({ orders, total: total.count, page: parseInt(page), limit: l });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.post('/orders', (req, res) => {
  try {
    const { customer_id, items, notes } = req.body;
    const orderId = generateId();
    const orderNumber = generateOrderNumber();
    
    let subtotal = 0;
    items.forEach(item => {
      subtotal += item.quantity * item.price;
    });
    
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    db.prepare(`
      INSERT INTO orders (id, organization_id, order_number, customer_id, status, subtotal, tax, total, notes, created_by)
      VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?)
    `).run(orderId, req.user.organization_id, orderNumber, customer_id, subtotal, tax, total, notes, req.user.id);
    
    items.forEach(item => {
      db.prepare(`
        INSERT INTO order_items (id, order_id, product_id, quantity, price, total)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(generateId(), orderId, item.product_id, item.quantity, item.price, item.quantity * item.price);
    });
    
    res.status(201).json({ id: orderId, order_number: orderNumber, message: 'Order created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.put('/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    db.prepare('UPDATE orders SET status = COALESCE(?, status) WHERE id = ? AND organization_id = ?')
      .run(status, id, req.user.organization_id);
    
    res.json({ message: 'Order updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

export default router;