import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

let db = {
  organizations: [],
  users: [],
  contacts: [],
  customers: [],
  deals: [],
  proposals: [],
  contracts: [],
  contract_signers: [],
  invoices: [],
  invoice_payments: [],
  activities: [],
  products: [],
  orders: [],
  order_items: [],
  expenses: [],
  employees: [],
  leaves: [],
  projects: [],
  project_tasks: []
};

const tables = Object.keys(db);

export const dbExec = (sql) => {
  console.log('SQL execution:', sql.substring(0, 50) + '...');
};

export const dbAll = (sql, params = []) => {
  const tableMatch = sql.match(/FROM\s+(\w+)/i);
  if (tableMatch) {
    const table = tableMatch[1].toLowerCase();
    return db[table] || [];
  }
  if (sql.includes('SELECT') && sql.includes('WHERE')) {
    const tableMatch = sql.match(/FROM\s+(\w+)/i);
    if (tableMatch) {
      const table = tableMatch[1].toLowerCase();
      if (sql.includes('email = ?') && params[0]) {
        return db[table]?.filter(u => u.email === params[0]) || [];
      }
      if (sql.includes('id = ?') && params[0]) {
        return db[table]?.filter(u => u.id === params[0]) || [];
      }
    }
  }
  return [];
};

export const dbGet = (sql, params = []) => {
  const results = dbAll(sql, params);
  return results[0] || null;
};

export const dbRun = (sql, params = []) => {
  const tableMatch = sql.match(/INSERT INTO\s+(\w+)/i);
  if (tableMatch) {
    const table = tableMatch[1].toLowerCase();
    const data = {};
    params.forEach((val, idx) => {
      const colMatch = sql.match(/VALUES\s*\(([\w,\s?]+)\)/i);
      if (colMatch && table in db) {
        const cols = colMatch[1].split(',').map(c => c.trim());
        if (cols[idx]) data[cols[idx]] = val;
      }
    });
    if (!data.id) data.id = uuidv4();
    if (!data.created_at) data.created_at = new Date().toISOString();
    if (table === 'users' && !data.password) {
      data.password = bcrypt.hashSync('admin123', 10);
    }
    db[table] = db[table] || [];
    db[table].push(data);
    return { changes: 1, lastInsertRowid: Date.now() };
  }
  
  const updateMatch = sql.match(/UPDATE\s+(\w+)\s+SET/i);
  if (updateMatch) {
    const table = updateMatch[1].toLowerCase();
    if (table in db && params[0]) {
      const idx = db[table].findIndex(r => r.id === params[0]);
      if (idx >= 0) {
        Object.assign(db[table][idx], params[1] || {});
        return { changes: 1 };
      }
    }
    return { changes: 0 };
  }
  
  return { changes: 0 };
};

const seedDefaultAdmin = () => {
  try {
    const existingAdmin = db.users.find(u => u.email === 'admin@jenq.com');
    if (existingAdmin) return;

    const orgId = uuidv4();
    const adminId = uuidv4();
    const hashedPassword = bcrypt.hashSync('JenQ@Admin2024', 10);

    db.organizations.push({
      id: orgId,
      name: 'JenQ Systems',
      email: 'admin@jenq.com',
      license_type: 'enterprise',
      license_expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      max_users: 999,
      created_at: new Date().toISOString()
    });

    db.users.push({
      id: adminId,
      organization_id: orgId,
      email: 'admin@jenq.com',
      password: hashedPassword,
      name: 'System Administrator',
      role: 'admin',
      active: 1,
      created_at: new Date().toISOString()
    });

    console.log('Default admin created: admin@jenq.com / JenQ@Admin2024');
  } catch (err) {
    console.error('Seed admin error:', err.message);
  }
};

seedDefaultAdmin();

export default {
  prepare: (sql) => ({
    get: (...params) => dbGet(sql, params),
    all: (...params) => dbAll(sql, params),
    run: (...params) => dbRun(sql, params)
  })
};