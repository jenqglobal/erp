import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.js';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

const uploadMiddleware = upload.fields([
  { name: 'files', maxCount: 10 },
  { name: 'logo', maxCount: 1 }
]);

// ==================== DATA STORE ====================

// Onboarding Templates - Reusable onboarding flows
let onboardingTemplates = [
  {
    id: 1,
    name: 'SaaS Client Onboarding',
    type: 'saas',
    description: 'Complete onboarding flow for SaaS clients',
    is_default: true,
    stages: ['lead_converted', 'invited', 'in_progress', 'pending_approval', 'completed', 'project_activated'],
    created_at: '2024-01-15',
    tasks: [
      { id: 1, title: 'Complete Company Profile', description: 'Fill in company details', mandatory: true, order: 1 },
      { id: 2, title: 'Upload Business Logo', description: 'Company logo for branding', mandatory: true, order: 2 },
      { id: 3, title: 'Sign Service Agreement', description: 'Review and sign the contract', mandatory: true, order: 3 },
      { id: 4, title: 'Sign NDA', description: 'Non-disclosure agreement', mandatory: true, order: 4 },
      { id: 5, title: 'Upload Tax Documents', description: 'Business registration documents', mandatory: true, order: 5 },
      { id: 6, title: 'Configure Integration Settings', description: 'Set up API connections', mandatory: false, order: 6 },
      { id: 7, title: 'Schedule Kickoff Call', description: 'Book initial meeting', mandatory: true, order: 7 },
      { id: 8, title: 'Team Training Session', description: 'Schedule team training', mandatory: false, order: 8 },
    ],
    forms: [
      { id: 1, name: 'Company Information', fields: [
        { name: 'company_name', label: 'Company Name', type: 'text', required: true },
        { name: 'industry', label: 'Industry', type: 'select', options: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Other'], required: true },
        { name: 'company_size', label: 'Company Size', type: 'select', options: ['1-10', '11-50', '51-200', '201-500', '500+'], required: true },
        { name: 'website', label: 'Website', type: 'url', required: false },
        { name: 'address', label: 'Business Address', type: 'textarea', required: true },
      ]},
      { id: 2, name: 'Contact Details', fields: [
        { name: 'primary_contact', label: 'Primary Contact Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { name: 'role', label: 'Job Title', type: 'text', required: true },
      ]},
    ],
    documents: [
      { id: 1, name: 'Service Agreement', type: 'contract', mandatory: true },
      { id: 2, name: 'NDA', type: 'nda', mandatory: true },
      { id: 3, name: 'Privacy Policy', type: 'privacy', mandatory: false },
    ],
  },
  {
    id: 2,
    name: 'Enterprise Client Onboarding',
    type: 'enterprise',
    description: 'Comprehensive onboarding for enterprise clients',
    is_default: false,
    stages: ['lead_converted', 'invited', 'in_progress', 'pending_approval', 'completed', 'project_activated'],
    created_at: '2024-02-01',
    tasks: [
      { id: 1, title: 'Complete Company Profile', mandatory: true, order: 1 },
      { id: 2, title: 'Sign Enterprise Agreement', mandatory: true, order: 2 },
      { id: 3, title: 'Sign NDA', mandatory: true, order: 3 },
      { id: 4, title: 'Data Processing Agreement', mandatory: true, order: 4 },
      { id: 5, title: 'Upload Tax Documents', mandatory: true, order: 5 },
      { id: 6, title: 'Security Compliance Review', mandatory: true, order: 6 },
      { id: 7, title: 'Set Up Team Accounts', mandatory: true, order: 7 },
      { id: 8, title: 'Schedule Executive Kickoff', mandatory: true, order: 8 },
      { id: 9, title: 'Integration Planning Session', mandatory: false, order: 9 },
    ],
    forms: [
      { id: 1, name: 'Company Information', fields: [
        { name: 'company_name', label: 'Company Name', type: 'text', required: true },
        { name: 'industry', label: 'Industry', type: 'select', options: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Other'], required: true },
        { name: 'company_size', label: 'Company Size', type: 'select', options: ['100-500', '500-1000', '1000-5000', '5000+'], required: true },
        { name: 'headquarters', label: 'Headquarters Location', type: 'text', required: true },
      ]},
    ],
    documents: [
      { id: 1, name: 'Enterprise Service Agreement', type: 'contract', mandatory: true },
      { id: 2, name: 'NDA', type: 'nda', mandatory: true },
      { id: 3, name: 'Data Processing Agreement', type: 'dpa', mandatory: true },
      { id: 4, name: 'Security Compliance Certificate', type: 'custom', mandatory: true },
    ],
  },
  {
    id: 3,
    name: 'Local Business Onboarding',
    type: 'local',
    description: 'Simplified onboarding for local businesses',
    is_default: false,
    stages: ['lead_converted', 'invited', 'in_progress', 'pending_approval', 'completed', 'project_activated'],
    created_at: '2024-02-15',
    tasks: [
      { id: 1, title: 'Complete Business Profile', mandatory: true, order: 1 },
      { id: 2, title: 'Upload Business Logo', mandatory: false, order: 2 },
      { id: 3, title: 'Sign Service Agreement', mandatory: true, order: 3 },
      { id: 4, title: 'Schedule Kickoff Call', mandatory: true, order: 4 },
    ],
    forms: [
      { id: 1, name: 'Business Information', fields: [
        { name: 'business_name', label: 'Business Name', type: 'text', required: true },
        { name: 'owner_name', label: 'Owner Name', type: 'text', required: true },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
      ]},
    ],
    documents: [
      { id: 1, name: 'Service Agreement', type: 'contract', mandatory: true },
    ],
  },
];

// Onboarding Clients
let onboardingClients = [
  {
    id: 1,
    lead_id: null,
    company: 'Acme Corporation',
    contact_name: 'John Smith',
    email: 'john@acme.com',
    phone: '+1 555-0123',
    industry: 'Technology',
    company_size: '51-200',
    status: 'in_progress',
    stage: 'in_progress',
    progress: 35,
    template_id: 1,
    assigned_to: 'Sarah Johnson',
    invited_at: '2024-03-10',
    started_at: '2024-03-12',
    completed_at: null,
    created_at: '2024-03-10',
    forms: {
      'Company Information': { company_name: 'Acme Corporation', industry: 'Technology', company_size: '51-200', website: 'https://acme.com', address: '123 Tech St, Silicon Valley' },
      'Contact Details': { primary_contact: 'John Smith', email: 'john@acme.com', phone: '+1 555-0123', role: 'CEO' },
    },
    documents: [
      { id: 1, name: 'Service Agreement', type: 'contract', status: 'signed', signed_at: '2024-03-12', signed_by: 'John Smith', mandatory: true },
      { id: 2, name: 'NDA', type: 'nda', status: 'signed', signed_at: '2024-03-12', signed_by: 'John Smith', mandatory: true },
      { id: 3, name: 'Privacy Policy', type: 'privacy', status: 'pending', mandatory: false },
    ],
    tasks: [
      { id: 1, title: 'Complete Company Profile', status: 'completed', completed_at: '2024-03-11', mandatory: true },
      { id: 2, title: 'Upload Business Logo', status: 'completed', completed_at: '2024-03-11', mandatory: false },
      { id: 3, title: 'Sign Service Agreement', status: 'completed', completed_at: '2024-03-12', mandatory: true },
      { id: 4, title: 'Sign NDA', status: 'completed', completed_at: '2024-03-12', mandatory: true },
      { id: 5, title: 'Upload Tax Documents', status: 'in_progress', mandatory: true },
      { id: 6, title: 'Configure Integration Settings', status: 'pending', mandatory: false },
      { id: 7, title: 'Schedule Kickoff Call', status: 'pending', mandatory: true },
      { id: 8, title: 'Team Training Session', status: 'pending', mandatory: false },
    ],
    uploaded_documents: [],
    messages: [
      { id: 1, from: 'client', text: 'Hi, I need help with the integration setup', created_at: '2024-03-14T10:00:00Z' },
      { id: 2, from: 'admin', text: 'Sure! Let me guide you through the process', created_at: '2024-03-14T10:30:00Z' },
    ],
    meetings: [
      { id: 1, type: 'kickoff', scheduled_at: '2024-03-20T14:00:00Z', status: 'scheduled' },
    ],
  },
  {
    id: 2,
    lead_id: null,
    company: 'TechStart Inc',
    contact_name: 'Mike Wilson',
    email: 'mike@techstart.io',
    phone: '+1 555-0456',
    industry: 'Technology',
    company_size: '11-50',
    status: 'pending',
    stage: 'lead_converted',
    progress: 0,
    template_id: 1,
    assigned_to: 'Emily Brown',
    invited_at: null,
    started_at: null,
    completed_at: null,
    created_at: '2024-03-15',
    forms: {},
    documents: [],
    tasks: [],
    uploaded_documents: [],
    messages: [],
    meetings: [],
  },
];

// Automation Rules
let automationRules = [
  { id: 1, trigger: 'client_created', action: 'assign_template', config: { template_id: 1 }, active: true },
  { id: 2, trigger: 'all_tasks_completed', action: 'update_stage', config: { stage: 'pending_approval' }, active: true },
  { id: 3, trigger: 'documents_signed', action: 'send_notification', config: { type: 'admin' }, active: true },
];

// ==================== API ROUTES ====================

// Get all onboarding data
router.get('/', authMiddleware, (req, res) => {
  const { tab, stage, assigned_to } = req.query;
  
  if (tab === 'templates') {
    return res.json({ templates: onboardingTemplates });
  }
  
  if (tab === 'settings') {
    return res.json({ automationRules });
  }
  
  let filtered = [...onboardingClients];
  
  if (stage) {
    filtered = filtered.filter(c => c.stage === stage);
  }
  
  if (assigned_to) {
    filtered = filtered.filter(c => c.assigned_to === assigned_to);
  }
  
  res.json({
    clients: filtered,
    templates: onboardingTemplates,
    stats: {
      total: onboardingClients.length,
      lead_converted: onboardingClients.filter(c => c.stage === 'lead_converted').length,
      invited: onboardingClients.filter(c => c.stage === 'invited').length,
      in_progress: onboardingClients.filter(c => c.stage === 'in_progress').length,
      pending_approval: onboardingClients.filter(c => c.stage === 'pending_approval').length,
      completed: onboardingClients.filter(c => c.stage === 'completed').length,
      project_activated: onboardingClients.filter(c => c.stage === 'project_activated').length,
    },
    stages: [
      { key: 'lead_converted', label: 'Lead Converted', color: 'blue' },
      { key: 'invited', label: 'Client Invited', color: 'purple' },
      { key: 'in_progress', label: 'Onboarding In Progress', color: 'amber' },
      { key: 'pending_approval', label: 'Pending Approval', color: 'orange' },
      { key: 'completed', label: 'Completed', color: 'green' },
      { key: 'project_activated', label: 'Project Activated', color: 'teal' },
    ]
  });
});

// Get single client
router.get('/clients/:id', authMiddleware, (req, res) => {
  const client = onboardingClients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: 'Client not found' });
  res.json(client);
});

// Create new client from lead
router.post('/clients', authMiddleware, (req, res) => {
  const { company, contact_name, email, phone, industry, company_size, template_id, assigned_to } = req.body;
  
  const template = onboardingTemplates.find(t => t.id === (template_id || 1));
  
  const newClient = {
    id: Date.now(),
    lead_id: null,
    company,
    contact_name,
    email,
    phone,
    industry: industry || '',
    company_size: company_size || '',
    status: 'pending',
    stage: 'lead_converted',
    progress: 0,
    template_id: template?.id || 1,
    assigned_to: assigned_to || 'Unassigned',
    invited_at: null,
    started_at: null,
    completed_at: null,
    created_at: new Date().toISOString().split('T')[0],
    forms: {},
    documents: template?.documents.map(d => ({ ...d, status: 'pending' })) || [],
    tasks: template?.tasks.map(t => ({ ...t, status: 'pending' })) || [],
    uploaded_documents: [],
    messages: [],
    meetings: [],
  };
  
  onboardingClients.push(newClient);
  
  res.json({ success: true, client: newClient, message: 'Client created successfully' });
});

// Update client
router.put('/clients/:id', authMiddleware, (req, res) => {
  const client = onboardingClients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: 'Client not found' });
  
  Object.assign(client, req.body);
  res.json({ success: true, client });
});

// Delete client
router.delete('/clients/:id', authMiddleware, (req, res) => {
  const index = onboardingClients.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Client not found' });
  
  onboardingClients.splice(index, 1);
  res.json({ success: true });
});

// Invite client to onboarding
router.post('/clients/:id/invite', authMiddleware, (req, res) => {
  const client = onboardingClients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: 'Client not found' });
  
  client.stage = 'invited';
  client.invited_at = new Date().toISOString().split('T')[0];
  client.status = 'invited';
  
  // Add welcome message
  client.messages.push({
    id: Date.now(),
    from: 'system',
    text: `Welcome to ${client.company}'s onboarding! Complete your tasks to get started.`,
    created_at: new Date().toISOString()
  });
  
  res.json({ success: true, client, message: 'Invitation sent successfully' });
});

// Submit form data
router.post('/clients/:id/forms', authMiddleware, (req, res) => {
  const client = onboardingClients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: 'Client not found' });
  
  const { form_name, form_data } = req.body;
  client.forms[form_name] = form_data;
  
  // Auto-progress when forms completed
  const template = onboardingTemplates.find(t => t.id === client.template_id);
  const completedForms = Object.keys(client.forms).length;
  if (template && completedForms >= template.forms.length) {
    client.stage = 'in_progress';
    client.started_at = new Date().toISOString().split('T')[0];
  }
  
  res.json({ success: true, client, message: 'Form submitted successfully' });
});

// Upload document
router.post('/clients/:id/documents', authMiddleware, uploadMiddleware, (req, res) => {
  const client = onboardingClients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: 'Client not found' });
  
  const { document_name, document_type, status } = req.body;
  
  const newDoc = {
    id: Date.now(),
    name: document_name,
    type: document_type || 'custom',
    status: status || 'pending',
    uploaded_at: new Date().toISOString().split('T')[0],
    uploaded_by: client.contact_name,
    file_name: req.files?.files?.[0]?.originalname || null,
  };
  
  client.uploaded_documents.push(newDoc);
  res.json({ success: true, document: newDoc });
});

// Approve/reject uploaded document
router.put('/clients/:id/documents/:docId', authMiddleware, (req, res) => {
  const client = onboardingClients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: 'Client not found' });
  
  const doc = client.uploaded_documents.find(d => d.id === parseInt(req.params.docId));
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  
  const { status, notes } = req.body;
  doc.status = status;
  doc.notes = notes;
  doc.reviewed_at = new Date().toISOString();
  
  // Add system message
  client.messages.push({
    id: Date.now(),
    from: 'system',
    text: status === 'approved' ? `Document "${doc.name}" has been approved` : `Document "${doc.name}" needs revision: ${notes}`,
    created_at: new Date().toISOString()
  });
  
  res.json({ success: true, document: doc });
});

// Sign document (E-sign)
router.post('/clients/:id/documents/:docId/sign', authMiddleware, (req, res) => {
  const client = onboardingClients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: 'Client not found' });
  
  const doc = client.documents.find(d => d.id === parseInt(req.params.docId));
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  
  const { signer_name, signature } = req.body;
  doc.status = 'signed';
  doc.signed_at = new Date().toISOString().split('T')[0];
  doc.signed_by = signer_name;
  doc.signature = signature;
  
  // Calculate progress
  const totalMandatory = client.tasks.filter(t => t.mandatory).length;
  const completedMandatory = client.tasks.filter(t => t.status === 'completed' && t.mandatory).length;
  const signedDocs = client.documents.filter(d => d.status === 'signed').length;
  const totalDocs = client.documents.filter(d => d.mandatory).length;
  
  client.progress = Math.round(((completedMandatory / totalMandatory) + (signedDocs / totalDocs)) / 2 * 100);
  
  res.json({ success: true, document: doc, progress: client.progress });
});

// Send document to client
router.post('/clients/:id/documents/:docId/send', authMiddleware, (req, res) => {
  const client = onboardingClients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: 'Client not found' });
  
  const doc = client.documents.find(d => d.id === parseInt(req.params.docId));
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  
  doc.status = 'sent';
  doc.sent_at = new Date().toISOString();
  
  client.messages.push({
    id: Date.now(),
    from: 'system',
    text: `New document "${doc.name}" is ready for your review and signature`,
    created_at: new Date().toISOString()
  });
  
  res.json({ success: true, document: doc });
});

// Update task status
router.put('/clients/:id/tasks/:taskId', authMiddleware, (req, res) => {
  const client = onboardingClients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: 'Client not found' });
  
  const task = client.tasks.find(t => t.id === parseInt(req.params.taskId));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  
  const { status } = req.body;
  task.status = status;
  if (status === 'completed') {
    task.completed_at = new Date().toISOString();
  }
  
  // Calculate progress
  const totalMandatory = client.tasks.filter(t => t.mandatory).length;
  const completedMandatory = client.tasks.filter(t => t.status === 'completed' && t.mandatory).length;
  const signedDocs = client.documents.filter(d => d.status === 'signed').length;
  const totalDocs = client.documents.filter(d => d.mandatory).length;
  
  client.progress = Math.round(((completedMandatory / totalMandatory) + (signedDocs / (totalDocs || 1))) / 2 * 100);
  
  // Check if all mandatory tasks completed
  if (completedMandatory === totalMandatory) {
    client.stage = 'pending_approval';
  }
  
  res.json({ success: true, task, progress: client.progress });
});

// Add message
router.post('/clients/:id/messages', authMiddleware, (req, res) => {
  const client = onboardingClients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: 'Client not found' });
  
  const { text, from } = req.body;
  const message = {
    id: Date.now(),
    from: from || 'client',
    text,
    created_at: new Date().toISOString()
  };
  
  client.messages.push(message);
  res.json({ success: true, message });
});

// Schedule meeting
router.post('/clients/:id/meetings', authMiddleware, (req, res) => {
  const client = onboardingClients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: 'Client not found' });
  
  const { type, scheduled_at, notes } = req.body;
  const meeting = {
    id: Date.now(),
    type,
    scheduled_at,
    status: 'scheduled',
    notes: notes || '',
    created_at: new Date().toISOString()
  };
  
  client.meetings.push(meeting);
  
  // Add task for meeting
  const taskTitle = type === 'kickoff' ? 'Kickoff Call' : 'Demo Session';
  client.tasks.push({
    id: Date.now(),
    title: taskTitle,
    status: 'completed',
    completed_at: scheduled_at,
    mandatory: true,
    order: 999
  });
  
  res.json({ success: true, meeting });
});

// Complete onboarding
router.post('/clients/:id/complete', authMiddleware, (req, res) => {
  const client = onboardingClients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: 'Client not found' });
  
  client.stage = 'completed';
  client.status = 'completed';
  client.completed_at = new Date().toISOString().split('T')[0];
  client.progress = 100;
  
  res.json({ success: true, client, message: 'Onboarding completed successfully' });
});

// Activate project
router.post('/clients/:id/activate', authMiddleware, (req, res) => {
  const client = onboardingClients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: 'Client not found' });
  
  client.stage = 'project_activated';
  client.status = 'project_active';
  
  res.json({ success: true, client, message: 'Project activated successfully' });
});

// Template management
router.post('/templates', authMiddleware, (req, res) => {
  const { name, type, description, tasks, forms, documents } = req.body;
  
  const newTemplate = {
    id: Date.now(),
    name,
    type,
    description,
    is_default: false,
    stages: ['lead_converted', 'invited', 'in_progress', 'pending_approval', 'completed', 'project_activated'],
    created_at: new Date().toISOString().split('T')[0],
    tasks: tasks || [],
    forms: forms || [],
    documents: documents || [],
  };
  
  onboardingTemplates.push(newTemplate);
  res.json({ success: true, template: newTemplate });
});

router.put('/templates/:id', authMiddleware, (req, res) => {
  const template = onboardingTemplates.find(t => t.id === parseInt(req.params.id));
  if (!template) return res.status(404).json({ error: 'Template not found' });
  
  Object.assign(template, req.body);
  res.json({ success: true, template });
});

router.delete('/templates/:id', authMiddleware, (req, res) => {
  const index = onboardingTemplates.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Template not found' });
  
  onboardingTemplates.splice(index, 1);
  res.json({ success: true });
});

// Assign template to client
router.post('/clients/:id/assign-template', authMiddleware, (req, res) => {
  const client = onboardingClients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: 'Client not found' });
  
  const template = onboardingTemplates.find(t => t.id === req.body.template_id);
  if (!template) return res.status(404).json({ error: 'Template not found' });
  
  client.template_id = template.id;
  client.tasks = template.tasks.map(t => ({ ...t, status: 'pending' }));
  client.documents = template.documents.map(d => ({ ...d, status: 'pending' }));
  client.forms = {};
  client.uploaded_documents = [];
  client.progress = 0;
  client.stage = 'lead_converted';
  
  res.json({ success: true, client, message: 'Template assigned successfully' });
});

export default router;