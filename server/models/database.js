import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(process.cwd(), 'data');
mkdirSync(dataDir, { recursive: true });

const db = new Database(join(dataDir, 'jenq.db'));

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    license_type TEXT DEFAULT 'starter',
    license_expires TEXT,
    max_users INTEGER DEFAULT 5,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'staff',
    avatar TEXT,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    position TEXT,
    address TEXT,
    city TEXT,
    country TEXT,
    source TEXT,
    lead_status TEXT DEFAULT 'new',
    assigned_to TEXT,
    tags TEXT,
    notes TEXT,
    created_by TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    contact_id TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    address TEXT,
    city TEXT,
    country TEXT,
    total_revenue REAL DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS deals (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    title TEXT NOT NULL,
    contact_id TEXT,
    customer_id TEXT,
    value REAL DEFAULT 0,
    stage TEXT DEFAULT 'prospecting',
    probability INTEGER DEFAULT 10,
    expected_close TEXT,
    assigned_to TEXT,
    notes TEXT,
    created_by TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS proposals (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    deal_id TEXT,
    contact_id TEXT,
    customer_id TEXT,
    title TEXT NOT NULL,
    content TEXT,
    items TEXT,
    subtotal REAL DEFAULT 0,
    tax_rate REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    discount REAL DEFAULT 0,
    total REAL DEFAULT 0,
    status TEXT DEFAULT 'draft',
    valid_until TEXT,
    sent_at TEXT,
    viewed_at TEXT,
    accepted_at TEXT,
    rejected_at TEXT,
    notes TEXT,
    created_by TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS contracts (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    proposal_id TEXT,
    deal_id TEXT,
    contact_id TEXT,
    customer_id TEXT,
    title TEXT NOT NULL,
    content TEXT,
    status TEXT DEFAULT 'draft',
    sent_at TEXT,
    viewed_at TEXT,
    signed_at TEXT,
    signature_data TEXT,
    signatures TEXT,
    notes TEXT,
    created_by TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS contract_signers (
    id TEXT PRIMARY KEY,
    contract_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'signer',
    signed_at TEXT,
    ip_address TEXT,
    FOREIGN KEY (contract_id) REFERENCES contracts(id)
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    invoice_number TEXT NOT NULL,
    contract_id TEXT,
    deal_id TEXT,
    contact_id TEXT,
    customer_id TEXT,
    items TEXT,
    subtotal REAL DEFAULT 0,
    tax_rate REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    discount REAL DEFAULT 0,
    total REAL DEFAULT 0,
    paid_amount REAL DEFAULT 0,
    status TEXT DEFAULT 'unpaid',
    due_date TEXT,
    paid_date TEXT,
    notes TEXT,
    payment_link TEXT,
    created_by TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS invoice_payments (
    id TEXT PRIMARY KEY,
    invoice_id TEXT NOT NULL,
    amount REAL DEFAULT 0,
    method TEXT,
    transaction_id TEXT,
    paid_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
  );

  CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    user_id TEXT,
    type TEXT NOT NULL,
    module TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_id TEXT,
    entity_type TEXT,
    details TEXT,
    due_date TEXT,
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    name TEXT NOT NULL,
    sku TEXT,
    description TEXT,
    category TEXT,
    price REAL DEFAULT 0,
    cost REAL DEFAULT 0,
    quantity INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    unit TEXT DEFAULT 'piece',
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    order_number TEXT NOT NULL,
    customer_id TEXT,
    status TEXT DEFAULT 'pending',
    subtotal REAL DEFAULT 0,
    tax REAL DEFAULT 0,
    total REAL DEFAULT 0,
    notes TEXT,
    created_by TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    price REAL DEFAULT 0,
    total REAL DEFAULT 0,
    FOREIGN KEY (order_id) REFERENCES orders(id)
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT,
    amount REAL DEFAULT 0,
    date TEXT,
    vendor TEXT,
    status TEXT DEFAULT 'pending',
    receipt TEXT,
    notes TEXT,
    created_by TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    user_id TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    department TEXT,
    position TEXT,
    salary REAL DEFAULT 0,
    hire_date TEXT,
    status TEXT DEFAULT 'active',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS leaves (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    type TEXT,
    start_date TEXT,
    end_date TEXT,
    days INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    reason TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    client_id TEXT,
    status TEXT DEFAULT 'planning',
    priority TEXT DEFAULT 'medium',
    start_date TEXT,
    end_date TEXT,
    budget REAL DEFAULT 0,
    created_by TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS project_tasks (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to TEXT,
    status TEXT DEFAULT 'todo',
    priority TEXT DEFAULT 'medium',
    due_date TEXT,
    estimated_hours REAL DEFAULT 0,
    logged_hours REAL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
  );

  CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);
  CREATE INDEX IF NOT EXISTS idx_contacts_org ON contacts(organization_id);
  CREATE INDEX IF NOT EXISTS idx_customers_org ON customers(organization_id);
  CREATE INDEX IF NOT EXISTS idx_deals_org ON deals(organization_id);
  CREATE INDEX IF NOT EXISTS idx_proposals_org ON proposals(organization_id);
  CREATE INDEX IF NOT EXISTS idx_contracts_org ON contracts(organization_id);
  CREATE INDEX IF NOT EXISTS idx_invoices_org ON invoices(organization_id);
  CREATE INDEX IF NOT EXISTS idx_activities_org ON activities(organization_id);
  CREATE INDEX IF NOT EXISTS idx_products_org ON products(organization_id);
  CREATE INDEX IF NOT EXISTS idx_orders_org ON orders(organization_id);
  CREATE INDEX IF NOT EXISTS idx_expenses_org ON expenses(organization_id);
  CREATE INDEX IF NOT EXISTS idx_employees_org ON employees(organization_id);
  CREATE INDEX IF NOT EXISTS idx_projects_org ON projects(organization_id);
`);

const seedDefaultAdmin = () => {
  try {
    const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@jenq.com');
    if (existingAdmin) return;

    const adminId = uuidv4();
    const orgId = uuidv4();
    const hashedPassword = bcrypt.hashSync('JenQ@Admin2024', 10);

    db.prepare(`
      INSERT INTO organizations (id, name, email, license_type, license_expires, max_users)
      VALUES (?, 'JenQ Systems', 'admin@jenq.com', 'enterprise', datetime('now', '+365 days'), 999)
    `).run(orgId);

    db.prepare(`
      INSERT INTO users (id, organization_id, email, password, name, role)
      VALUES (?, ?, 'admin@jenq.com', ?, 'System Administrator', 'admin')
    `).run(adminId, orgId, hashedPassword);

    console.log('Default admin created: admin@jenq.com / JenQ@Admin2024');
  } catch (err) {
    console.error('Seed admin error:', err.message);
  }
};

seedDefaultAdmin();

export default db;