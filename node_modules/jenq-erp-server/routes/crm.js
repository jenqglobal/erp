import express from 'express';
import db from '../models/database.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateId, paginate } from '../utils/helpers.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/stats', (req, res) => {
  try {
    const stats = {
      totalLeads: db.prepare('SELECT COUNT(*) as count FROM contacts WHERE organization_id = ?').get(req.user.organization_id).count,
      totalDeals: db.prepare('SELECT COUNT(*) as count FROM deals WHERE organization_id = ?').get(req.user.organization_id).count,
      totalCustomers: db.prepare('SELECT COUNT(*) as count FROM customers WHERE organization_id = ?').get(req.user.organization_id).count,
      totalProposals: db.prepare('SELECT COUNT(*) as count FROM proposals WHERE organization_id = ?').get(req.user.organization_id).count,
      totalContracts: db.prepare('SELECT COUNT(*) as count FROM contracts WHERE organization_id = ?').get(req.user.organization_id).count,
      totalInvoices: db.prepare('SELECT COUNT(*) as count FROM invoices WHERE organization_id = ?').get(req.user.organization_id).count,
      revenue: db.prepare('SELECT COALESCE(SUM(paid_amount), 0) as total FROM invoices WHERE organization_id = ?').get(req.user.organization_id).total,
      pipelineValue: db.prepare('SELECT COALESCE(SUM(value), 0) as total FROM deals WHERE organization_id = ?').get(req.user.organization_id).total,
    };
    
    const stageStats = db.prepare(`
      SELECT stage, COUNT(*) as count, COALESCE(SUM(value), 0) as value 
      FROM deals WHERE organization_id = ? GROUP BY stage
    `).all(req.user.organization_id);
    
    const leadStats = db.prepare(`
      SELECT lead_status, COUNT(*) as count FROM contacts WHERE organization_id = ? GROUP BY lead_status
    `).all(req.user.organization_id);
    
    const proposalStats = db.prepare(`
      SELECT status, COUNT(*) as count FROM proposals WHERE organization_id = ? GROUP BY status
    `).all(req.user.organization_id);
    
    res.json({ stats, stageStats, leadStats, proposalStats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/contacts', (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const { limit: l, offset } = paginate(page, limit);
    
    let query = 'SELECT * FROM contacts WHERE organization_id = ?';
    const params = [req.user.organization_id];
    
    if (search) {
      query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR company LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }
    
    if (status) {
      query += ' AND lead_status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(l, offset);
    
    const contacts = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM contacts WHERE organization_id = ?').get(req.user.organization_id);
    
    res.json({ contacts, total: total.count, page: parseInt(page), limit: l });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

router.post('/contacts', (req, res) => {
  try {
    const { first_name, last_name, email, phone, company, position, address, city, country, source, lead_status, assigned_to, tags, notes } = req.body;
    
    const contactId = generateId();
    
    db.prepare(`
      INSERT INTO contacts (id, organization_id, first_name, last_name, email, phone, company, position, address, city, country, source, lead_status, assigned_to, tags, notes, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(contactId, req.user.organization_id, first_name, last_name, email, phone, company, position, address, city, country, source, lead_status || 'new', assigned_to, tags, notes, req.user.id);
    
    db.prepare(`
      INSERT INTO activities (id, organization_id, user_id, type, module, action, entity_id, details)
      VALUES (?, ?, ?, 'create', 'crm', 'lead_created', ?, ?)
    `).run(generateId(), req.user.organization_id, req.user.id, contactId, first_name + ' ' + last_name);
    
    res.status(201).json({ id: contactId, message: 'Contact created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

router.put('/contacts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, company, position, address, city, country, source, lead_status, assigned_to, tags, notes } = req.body;
    
    db.prepare(`
      UPDATE contacts SET first_name = COALESCE(?, first_name), last_name = COALESCE(?, last_name), 
      email = COALESCE(?, email), phone = COALESCE(?, phone), company = COALESCE(?, company),
      position = COALESCE(?, position), address = COALESCE(?, address), city = COALESCE(?, city),
      country = COALESCE(?, country), source = COALESCE(?, source), lead_status = COALESCE(?, lead_status),
      assigned_to = COALESCE(?, assigned_to), tags = COALESCE(?, tags), notes = COALESCE(?, notes)
      WHERE id = ? AND organization_id = ?
    `).run(first_name, last_name, email, phone, company, position, address, city, country, source, lead_status, assigned_to, tags, notes, id, req.user.organization_id);
    
    res.json({ message: 'Contact updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

router.delete('/contacts/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM contacts WHERE id = ? AND organization_id = ?').run(id, req.user.organization_id);
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

router.get('/customers', (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const { limit: l, offset } = paginate(page, limit);
    
    let query = 'SELECT * FROM customers WHERE organization_id = ?';
    const params = [req.user.organization_id];
    
    if (search) {
      query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR company LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(l, offset);
    
    const customers = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM customers WHERE organization_id = ?').get(req.user.organization_id);
    
    res.json({ customers, total: total.count, page: parseInt(page), limit: l });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

router.post('/customers', (req, res) => {
  try {
    const { contact_id, first_name, last_name, email, phone, company, address, city, country } = req.body;
    
    const customerId = generateId();
    
    db.prepare(`
      INSERT INTO customers (id, organization_id, contact_id, first_name, last_name, email, phone, company, address, city, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(customerId, req.user.organization_id, contact_id, first_name, last_name, email, phone, company, address, city, country);
    
    if (contact_id) {
      db.prepare('UPDATE contacts SET lead_status = ? WHERE id = ?').run('customer', contact_id);
    }
    
    res.status(201).json({ id: customerId, message: 'Customer created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

router.get('/customers/:id/history', (req, res) => {
  try {
    const { id } = req.params;
    
    const deals = db.prepare('SELECT * FROM deals WHERE customer_id = ? AND organization_id = ?').all(id, req.user.organization_id);
    const proposals = db.prepare('SELECT * FROM proposals WHERE customer_id = ? AND organization_id = ?').all(id, req.user.organization_id);
    const contracts = db.prepare('SELECT * FROM contracts WHERE customer_id = ? AND organization_id = ?').all(id, req.user.organization_id);
    const invoices = db.prepare('SELECT * FROM invoices WHERE customer_id = ? AND organization_id = ?').all(id, req.user.organization_id);
    const activities = db.prepare('SELECT * FROM activities WHERE entity_id = ? AND organization_id = ? ORDER BY created_at DESC').all(id, req.user.organization_id);
    
    res.json({ deals, proposals, contracts, invoices, activities });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer history' });
  }
});

router.get('/deals', (req, res) => {
  try {
    const { page = 1, limit = 50, stage } = req.query;
    const { limit: l, offset } = paginate(page, limit);
    
    let query = 'SELECT d.*, c.first_name as contact_name, c.company as contact_company FROM deals d LEFT JOIN contacts c ON d.contact_id = c.id WHERE d.organization_id = ?';
    const params = [req.user.organization_id];
    
    if (stage) {
      query += ' AND d.stage = ?';
      params.push(stage);
    }
    
    query += ' ORDER BY d.created_at DESC LIMIT ? OFFSET ?';
    params.push(l, offset);
    
    const deals = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM deals WHERE organization_id = ?').get(req.user.organization_id);
    
    res.json({ deals, total: total.count, page: parseInt(page), limit: l });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

router.post('/deals', (req, res) => {
  try {
    const { title, contact_id, customer_id, value, stage, probability, expected_close, assigned_to, notes } = req.body;
    
    const dealId = generateId();
    
    db.prepare(`
      INSERT INTO deals (id, organization_id, title, contact_id, customer_id, value, stage, probability, expected_close, assigned_to, notes, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(dealId, req.user.organization_id, title, contact_id, customer_id, value, stage || 'prospecting', probability || 10, expected_close, assigned_to, notes, req.user.id);
    
    db.prepare(`
      INSERT INTO activities (id, organization_id, user_id, type, module, action, entity_id, details)
      VALUES (?, ?, ?, 'create', 'crm', 'deal_created', ?, ?)
    `).run(generateId(), req.user.organization_id, req.user.id, dealId, title);
    
    res.status(201).json({ id: dealId, message: 'Deal created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create deal' });
  }
});

router.put('/deals/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, contact_id, customer_id, value, stage, probability, expected_close, assigned_to, notes } = req.body;
    
    const oldDeal = db.prepare('SELECT stage FROM deals WHERE id = ?').get(id);
    
    db.prepare(`
      UPDATE deals SET title = COALESCE(?, title), contact_id = COALESCE(?, contact_id),
      customer_id = COALESCE(?, customer_id), value = COALESCE(?, value), 
      stage = COALESCE(?, stage), probability = COALESCE(?, probability),
      expected_close = COALESCE(?, expected_close), assigned_to = COALESCE(?, assigned_to),
      notes = COALESCE(?, notes) WHERE id = ? AND organization_id = ?
    `).run(title, contact_id, customer_id, value, stage, probability, expected_close, assigned_to, notes, id, req.user.organization_id);
    
    if (oldDeal && oldDeal.stage !== stage) {
      db.prepare(`
        INSERT INTO activities (id, organization_id, user_id, type, module, action, entity_id, details)
        VALUES (?, ?, ?, 'update', 'crm', 'deal_stage_changed', ?, ?)
      `).run(generateId(), req.user.organization_id, req.user.id, id, `Stage changed to ${stage}`);
    }
    
    res.json({ message: 'Deal updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update deal' });
  }
});

router.delete('/deals/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM deals WHERE id = ? AND organization_id = ?').run(id, req.user.organization_id);
    res.json({ message: 'Deal deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete deal' });
  }
});

router.get('/proposals', (req, res) => {
  try {
    const { page = 1, limit = 20, status, deal_id } = req.query;
    const { limit: l, offset } = paginate(page, limit);
    
    let query = 'SELECT p.*, c.first_name as contact_name, c.company as contact_company, d.title as deal_title FROM proposals p LEFT JOIN contacts c ON p.contact_id = c.id LEFT JOIN deals d ON p.deal_id = d.id WHERE p.organization_id = ?';
    const params = [req.user.organization_id];
    
    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }
    
    if (deal_id) {
      query += ' AND p.deal_id = ?';
      params.push(deal_id);
    }
    
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(l, offset);
    
    const proposals = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM proposals WHERE organization_id = ?').get(req.user.organization_id);
    
    res.json({ proposals, total: total.count, page: parseInt(page), limit: l });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

router.post('/proposals', (req, res) => {
  try {
    const { deal_id, contact_id, customer_id, title, content, items, subtotal, tax_rate, tax_amount, discount, total, valid_until, notes } = req.body;
    
    const proposalId = generateId();
    
    db.prepare(`
      INSERT INTO proposals (id, organization_id, deal_id, contact_id, customer_id, title, content, items, subtotal, tax_rate, tax_amount, discount, total, valid_until, notes, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(proposalId, req.user.organization_id, deal_id, contact_id, customer_id, title, content, JSON.stringify(items || []), subtotal || 0, tax_rate || 0, tax_amount || 0, discount || 0, total || 0, valid_until, notes, req.user.id);
    
    if (deal_id) {
      db.prepare('UPDATE deals SET stage = ? WHERE id = ?').run('proposal', deal_id);
    }
    
    db.prepare(`
      INSERT INTO activities (id, organization_id, user_id, type, module, action, entity_id, details)
      VALUES (?, ?, ?, 'create', 'crm', 'proposal_created', ?, ?)
    `).run(generateId(), req.user.organization_id, req.user.id, proposalId, title);
    
    res.status(201).json({ id: proposalId, message: 'Proposal created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create proposal' });
  }
});

router.put('/proposals/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, items, subtotal, tax_rate, tax_amount, discount, total, status, valid_until, notes } = req.body;
    
    db.prepare(`
      UPDATE proposals SET title = COALESCE(?, title), content = COALESCE(?, content),
      items = COALESCE(?, items), subtotal = COALESCE(?, subtotal), tax_rate = COALESCE(?, tax_rate),
      tax_amount = COALESCE(?, tax_amount), discount = COALESCE(?, discount), total = COALESCE(?, total),
      status = COALESCE(?, status), valid_until = COALESCE(?, valid_until), notes = COALESCE(?, notes)
      WHERE id = ? AND organization_id = ?
    `).run(title, content, items ? JSON.stringify(items) : null, subtotal, tax_rate, tax_amount, discount, total, status, valid_until, notes, id, req.user.organization_id);
    
    res.json({ message: 'Proposal updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update proposal' });
  }
});

router.post('/proposals/:id/send', (req, res) => {
  try {
    const { id } = req.params;
    
    db.prepare(`
      UPDATE proposals SET status = 'sent', sent_at = datetime('now')
      WHERE id = ? AND organization_id = ?
    `).run(id, req.user.organization_id);
    
    db.prepare(`
      INSERT INTO activities (id, organization_id, user_id, type, module, action, entity_id, details)
      VALUES (?, ?, ?, 'update', 'crm', 'proposal_sent', ?, ?)
    `).run(generateId(), req.user.organization_id, req.user.id, id, 'Proposal sent to client');
    
    res.json({ message: 'Proposal sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send proposal' });
  }
});

router.post('/proposals/:id/accept', (req, res) => {
  try {
    const { id } = req.params;
    
    const proposal = db.prepare('SELECT * FROM proposals WHERE id = ?').get(id);
    
    db.prepare(`
      UPDATE proposals SET status = 'accepted', accepted_at = datetime('now')
      WHERE id = ? AND organization_id = ?
    `).run(id, req.user.organization_id);
    
    if (proposal?.deal_id) {
      db.prepare('UPDATE deals SET stage = ? WHERE id = ?').run('contract', proposal.deal_id);
    }
    
    db.prepare(`
      INSERT INTO activities (id, organization_id, user_id, type, module, action, entity_id, details)
      VALUES (?, ?, ?, 'update', 'crm', 'proposal_accepted', ?, ?)
    `).run(generateId(), req.user.organization_id, req.user.id, id, 'Proposal accepted');
    
    res.json({ message: 'Proposal accepted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept proposal' });
  }
});

router.post('/proposals/:id/reject', (req, res) => {
  try {
    const { id } = req.params;
    
    db.prepare(`
      UPDATE proposals SET status = 'rejected', rejected_at = datetime('now')
      WHERE id = ? AND organization_id = ?
    `).run(id, req.user.organization_id);
    
    res.json({ message: 'Proposal rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject proposal' });
  }
});

router.get('/contracts', (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const { limit: l, offset } = paginate(page, limit);
    
    let query = 'SELECT c.*, p.title as proposal_title, ct.first_name as contact_name FROM contracts c LEFT JOIN proposals p ON c.proposal_id = p.id LEFT JOIN contacts ct ON c.contact_id = ct.id WHERE c.organization_id = ?';
    const params = [req.user.organization_id];
    
    if (status) {
      query += ' AND c.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
    params.push(l, offset);
    
    const contracts = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM contracts WHERE organization_id = ?').get(req.user.organization_id);
    
    res.json({ contracts, total: total.count, page: parseInt(page), limit: l });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
});

router.post('/contracts', (req, res) => {
  try {
    const { proposal_id, deal_id, contact_id, customer_id, title, content, notes } = req.body;
    
    const contractId = generateId();
    
    db.prepare(`
      INSERT INTO contracts (id, organization_id, proposal_id, deal_id, contact_id, customer_id, title, content, notes, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(contractId, req.user.organization_id, proposal_id, deal_id, contact_id, customer_id, title, content, notes, req.user.id);
    
    if (proposal_id) {
      db.prepare('UPDATE proposals SET status = ? WHERE id = ?').run('contracted', proposal_id);
    }
    
    if (deal_id) {
      db.prepare('UPDATE deals SET stage = ? WHERE id = ?').run('negotiation', deal_id);
    }
    
    res.status(201).json({ id: contractId, message: 'Contract created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create contract' });
  }
});

router.put('/contracts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, status, notes } = req.body;
    
    db.prepare(`
      UPDATE contracts SET title = COALESCE(?, title), content = COALESCE(?, content),
      status = COALESCE(?, status), notes = COALESCE(?, notes)
      WHERE id = ? AND organization_id = ?
    `).run(title, content, status, notes, id, req.user.organization_id);
    
    res.json({ message: 'Contract updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contract' });
  }
});

router.post('/contracts/:id/send', (req, res) => {
  try {
    const { id } = req.params;
    
    db.prepare(`
      UPDATE contracts SET status = 'sent', sent_at = datetime('now')
      WHERE id = ? AND organization_id = ?
    `).run(id, req.user.organization_id);
    
    res.json({ message: 'Contract sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send contract' });
  }
});

router.post('/contracts/:id/sign', (req, res) => {
  try {
    const { id } = req.params;
    const { signer_name, signer_email, signature_data } = req.body;
    
    const contractId = id;
    
    db.prepare(`
      INSERT INTO contract_signers (id, contract_id, name, email, signed_at, ip_address)
      VALUES (?, ?, ?, ?, datetime('now'), ?)
    `).run(generateId(), contractId, signer_name, signer_email, req.ip);
    
    const signers = db.prepare('SELECT * FROM contract_signers WHERE contract_id = ?').all(contractId);
    
    db.prepare(`
      UPDATE contracts SET signatures = ?, status = 'signed', signed_at = datetime('now')
      WHERE id = ? AND organization_id = ?
    `).run(JSON.stringify(signers), id, req.user.organization_id);
    
    const contract = db.prepare('SELECT customer_id, deal_id FROM contracts WHERE id = ?').get(id);
    if (contract?.deal_id) {
      db.prepare('UPDATE deals SET stage = ? WHERE id = ?').run('closed_won', contract.deal_id);
      db.prepare('UPDATE deals SET stage = ? WHERE id = ?').run('invoice', contract.deal_id);
    }
    
    res.json({ message: 'Contract signed', signers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sign contract' });
  }
});

router.get('/invoices', (req, res) => {
  try {
    const { page = 1, limit = 20, status, customer_id } = req.query;
    const { limit: l, offset } = paginate(page, limit);
    
    let query = 'SELECT i.*, c.first_name as customer_name, c.company as customer_company FROM invoices i LEFT JOIN customers c ON i.customer_id = c.id WHERE i.organization_id = ?';
    const params = [req.user.organization_id];
    
    if (status) {
      query += ' AND i.status = ?';
      params.push(status);
    }
    
    if (customer_id) {
      query += ' AND i.customer_id = ?';
      params.push(customer_id);
    }
    
    query += ' ORDER BY i.created_at DESC LIMIT ? OFFSET ?';
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
    const { contract_id, deal_id, contact_id, customer_id, items, subtotal, tax_rate, tax_amount, discount, total, due_date, notes } = req.body;
    
    const invoiceId = generateId();
    const invoiceNumber = 'INV-' + Date.now().toString().slice(-8);
    
    db.prepare(`
      INSERT INTO invoices (id, organization_id, invoice_number, contract_id, deal_id, contact_id, customer_id, items, subtotal, tax_rate, tax_amount, discount, total, due_date, notes, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(invoiceId, req.user.organization_id, invoiceNumber, contract_id, deal_id, contact_id, customer_id, JSON.stringify(items || []), subtotal || 0, tax_rate || 0, tax_amount || 0, discount || 0, total || 0, due_date, notes, req.user.id);
    
    if (deal_id) {
      db.prepare('UPDATE deals SET stage = ? WHERE id = ?').run('invoice', deal_id);
    }
    
    res.status(201).json({ id: invoiceId, invoice_number: invoiceNumber, message: 'Invoice created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

router.put('/invoices/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { items, subtotal, tax_rate, tax_amount, discount, total, status, due_date, notes, payment_link } = req.body;
    
    db.prepare(`
      UPDATE invoices SET items = COALESCE(?, items), subtotal = COALESCE(?, subtotal),
      tax_rate = COALESCE(?, tax_rate), tax_amount = COALESCE(?, tax_amount),
      discount = COALESCE(?, discount), total = COALESCE(?, total),
      status = COALESCE(?, status), due_date = COALESCE(?, due_date),
      notes = COALESCE(?, notes), payment_link = COALESCE(?, payment_link)
      WHERE id = ? AND organization_id = ?
    `).run(items ? JSON.stringify(items) : null, subtotal, tax_rate, tax_amount, discount, total, status, due_date, notes, payment_link, id, req.user.organization_id);
    
    res.json({ message: 'Invoice updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

router.post('/invoices/:id/pay', (req, res) => {
  try {
    const { id } = req.params;
    const { amount, method, transaction_id } = req.body;
    
    const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    
    const newPaidAmount = (invoice.paid_amount || 0) + amount;
    const newStatus = newPaidAmount >= invoice.total ? 'paid' : 'partial';
    
    db.prepare(`
      INSERT INTO invoice_payments (id, invoice_id, amount, method, transaction_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(generateId(), id, amount, method, transaction_id);
    
    db.prepare(`
      UPDATE invoices SET paid_amount = ?, status = ?, paid_date = CASE WHEN ? >= total THEN datetime('now') ELSE paid_date END
      WHERE id = ?
    `).run(newPaidAmount, newStatus, newPaidAmount, id);
    
    if (newStatus === 'paid' && invoice.deal_id) {
      db.prepare('UPDATE deals SET stage = ? WHERE id = ?').run('closed_won', invoice.deal_id);
    }
    
    if (newStatus === 'paid' && invoice.customer_id) {
      const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(invoice.customer_id);
      db.prepare('UPDATE customers SET total_revenue = COALESCE(total_revenue, 0) + ? WHERE id = ?').run(amount, invoice.customer_id);
    }
    
    res.json({ message: 'Payment recorded', status: newStatus });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

router.get('/activities', (req, res) => {
  try {
    const { page = 1, limit = 50, entity_id, type } = req.query;
    const { limit: l, offset } = paginate(page, limit);
    
    let query = 'SELECT a.*, u.name as user_name FROM activities a LEFT JOIN users u ON a.user_id = u.id WHERE a.organization_id = ?';
    const params = [req.user.organization_id];
    
    if (entity_id) {
      query += ' AND a.entity_id = ?';
      params.push(entity_id);
    }
    
    if (type) {
      query += ' AND a.type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(l, offset);
    
    const activities = db.prepare(query).all(...params);
    
    res.json({ activities });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

router.post('/activities', (req, res) => {
  try {
    const { type, module, action, entity_id, entity_type, details, due_date } = req.body;
    
    const activityId = generateId();
    
    db.prepare(`
      INSERT INTO activities (id, organization_id, user_id, type, module, action, entity_id, entity_type, details, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(activityId, req.user.organization_id, req.user.id, type, module, action, entity_id, entity_type, details, due_date);
    
    res.status(201).json({ id: activityId, message: 'Activity created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

router.put('/activities/:id/complete', (req, res) => {
  try {
    const { id } = req.params;
    
    db.prepare('UPDATE activities SET completed = 1 WHERE id = ? AND organization_id = ?').run(id, req.user.organization_id);
    
    res.json({ message: 'Activity completed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete activity' });
  }
});

router.delete('/activities/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM activities WHERE id = ? AND organization_id = ?').run(id, req.user.organization_id);
    res.json({ message: 'Activity deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

export default router;