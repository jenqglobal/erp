import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import crmRoutes from './routes/crm.js';
import inventoryRoutes from './routes/inventory.js';
import accountingRoutes from './routes/accounting.js';
import hrRoutes from './routes/hr.js';
import projectsRoutes from './routes/projects.js';
import usersRoutes from './routes/users.js';
import documentsRoutes from './routes/documents.js';
import onboardingRoutes from './routes/onboarding.js';

const app = express();
const PORT = process.env.PORT || 3003;

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/accounting', accountingRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/onboarding', onboardingRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', name: 'JenQ ERP API' });
});

app.get('/', (req, res) => {
  res.json({ message: 'JenQ ERP API - Running', version: '1.0.0' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`JenQ ERP Server running on port ${PORT}`);
});

export default app;