import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.js';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

let documents = [
  { id: 1, name: 'Documents', type: 'folder', parentId: null, items: 24, size: '2.4 GB', modified: '2024-01-20', starred: false, shared: false, ownerId: 1 },
  { id: 2, name: 'Images', type: 'folder', parentId: null, items: 156, size: '4.8 GB', modified: '2024-01-18', starred: false, shared: false, ownerId: 1 },
  { id: 3, name: 'Contracts', type: 'folder', parentId: null, items: 12, size: '156 MB', modified: '2024-01-15', starred: false, shared: false, ownerId: 1 },
  { id: 4, name: 'Invoices', type: 'folder', parentId: null, items: 48, size: '890 MB', modified: '2024-01-22', starred: false, shared: false, ownerId: 1 },
  { id: 5, name: 'Presentations', type: 'folder', parentId: null, items: 8, size: '420 MB', modified: '2024-01-10', starred: false, shared: false, ownerId: 1 },
  { id: 10, name: 'Q4 Report 2023.pdf', type: 'file', parentId: null, size: '2.4 MB', modified: '2024-01-20', starred: true, shared: true, ownerId: 1, fileType: 'pdf' },
  { id: 11, name: 'Employee Handbook.docx', type: 'file', parentId: 1, size: '1.2 MB', modified: '2024-01-18', starred: false, shared: false, ownerId: 1, fileType: 'doc' },
  { id: 12, name: 'Product mockup.png', type: 'file', parentId: 2, size: '4.8 MB', modified: '2024-01-15', starred: true, shared: true, ownerId: 1, fileType: 'image' },
  { id: 13, name: 'Service Agreement.pdf', type: 'file', parentId: 3, size: '890 KB', modified: '2024-01-22', starred: false, shared: true, ownerId: 1, fileType: 'pdf' },
  { id: 14, name: 'Meeting Notes.docx', type: 'file', parentId: null, size: '45 KB', modified: '2024-01-21', starred: false, shared: false, ownerId: 1, fileType: 'doc' },
  { id: 15, name: 'Project Timeline.xlsx', type: 'file', parentId: null, size: '234 KB', modified: '2024-01-19', starred: false, shared: true, ownerId: 1, fileType: 'xlsx' },
  { id: 16, name: 'Brand Guidelines.pdf', type: 'file', parentId: 1, size: '8.5 MB', modified: '2024-01-08', starred: true, shared: true, ownerId: 1, fileType: 'pdf' },
];

let trash = [];
let templates = [
  { id: 101, name: 'Invoice Template', description: 'Professional invoice layout', type: 'pdf', category: 'business' },
  { id: 102, name: 'Contract Template', description: 'Standard service agreement', type: 'doc', category: 'legal' },
  { id: 103, name: 'Proposal Template', description: 'Sales proposal format', type: 'doc', category: 'business' },
  { id: 104, name: 'NDA Template', description: 'Non-disclosure agreement', type: 'pdf', category: 'legal' },
  { id: 105, name: 'Employee Offer Letter', description: 'New hire onboarding', type: 'doc', category: 'hr' },
  { id: 106, name: 'Project Brief', description: 'Project initiation document', type: 'doc', category: 'project' },
];

let contracts = [
  { id: 201, name: 'Service Agreement - Acme', party: 'Acme Corp', status: 'active', expiry: '2024-12-31', value: '$50,000' },
  { id: 202, name: 'NDA - TechStart', party: 'TechStart Inc', status: 'active', expiry: '2025-06-15', value: 'N/A' },
  { id: 203, name: 'Consulting Contract', party: 'GlobalTech', status: 'expiring', expiry: '2024-02-28', value: '$25,000' },
  { id: 204, name: 'Vendor Agreement', party: 'AWS Services', status: 'draft', expiry: '-', value: '$12,000' },
];

let policies = [
  { id: 301, name: 'Employee Handbook', description: 'General policies and guidelines', updated: '2024-01-01' },
  { id: 302, name: 'Data Security Policy', description: 'Information security guidelines', updated: '2024-01-15' },
  { id: 303, name: 'Leave Policy', description: 'Vacation and leave guidelines', updated: '2023-12-01' },
  { id: 304, name: 'Remote Work Policy', description: 'Work from home guidelines', updated: '2024-01-10' },
  { id: 305, name: 'Code of Conduct', description: 'Professional behavior standards', updated: '2023-11-15' },
  { id: 306, name: 'IT Usage Policy', description: 'Technology and software guidelines', updated: '2024-01-05' },
];

let storage = { used: 8.4, total: 15, percentage: 56 };

router.get('/', authMiddleware, (req, res) => {
  const { folderId, section } = req.query;
  
  if (section === 'templates') {
    return res.json({ documents: templates, storage });
  }
  
  if (section === 'contracts') {
    return res.json({ documents: contracts, storage });
  }
  
  if (section === 'policies') {
    return res.json({ documents: policies, storage });
  }
  
  if (section === 'starred') {
    return res.json({ documents: documents.filter(d => d.starred), storage });
  }
  
  if (section === 'shared') {
    return res.json({ documents: documents.filter(d => d.shared), storage });
  }
  
  if (section === 'recent') {
    return res.json({ documents: documents, storage });
  }
  
  let targetParentId = null;
  if (folderId && folderId !== 'root' && folderId !== 'null' && folderId !== 'undefined') {
    targetParentId = parseInt(folderId);
  }
  
  let filteredDocs = documents.filter(d => d.parentId === targetParentId);
  res.json({ documents: filteredDocs, storage, trashCount: trash.length });
});

router.get('/trash', authMiddleware, (req, res) => {
  res.json({ documents: trash });
});

router.post('/folder', authMiddleware, (req, res) => {
  try {
    const { name, parentId } = req.body;
    const newFolder = {
      id: Date.now(),
      name,
      type: 'folder',
      parentId: parentId || null,
      items: 0,
      size: '0 B',
      modified: new Date().toISOString().split('T')[0],
      starred: false,
      shared: false,
      ownerId: req.user?.id || 1,
      fileType: 'folder'
    };
    documents.push(newFolder);
    res.json({ success: true, document: newFolder });
  } catch (err) {
    console.error('Create folder error:', err);
    res.status(500).json({ error: 'Failed to create folder' });
  }
});

router.post('/upload', authMiddleware, upload.single('file'), (req, res) => {
  try {
    const file = req.file;
    let parentId = req.body.parentId;
    
    if (parentId === 'null' || parentId === 'undefined' || !parentId) {
      parentId = null;
    } else {
      parentId = parseInt(parentId);
    }
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const originalName = req.body.name || file.originalname;
    const ext = originalName.split('.').pop().toLowerCase();
    const fileType = ['pdf', 'doc', 'docx', 'xlsx', 'xls', 'png', 'jpg', 'jpeg', 'mp4', 'mp3', 'zip'].includes(ext) ? ext : 'file';
    
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    
    const newFile = {
      id: Date.now(),
      name: originalName,
      type: 'file',
      parentId: parentId,
      size: `${sizeMB} MB`,
      modified: new Date().toISOString().split('T')[0],
      starred: false,
      shared: false,
      ownerId: req.user?.id || 1,
      fileType
    };
    documents.push(newFile);
    res.json({ success: true, document: newFile });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.put('/:id/star', authMiddleware, (req, res) => {
  const doc = documents.find(d => d.id === parseInt(req.params.id));
  if (doc) {
    doc.starred = !doc.starred;
    res.json({ success: true, document: doc });
  } else {
    res.status(404).json({ error: 'Document not found' });
  }
});

router.put('/:id/share', authMiddleware, (req, res) => {
  const doc = documents.find(d => d.id === parseInt(req.params.id));
  if (doc) {
    doc.shared = !doc.shared;
    res.json({ success: true, document: doc });
  } else {
    res.status(404).json({ error: 'Document not found' });
  }
});

router.put('/:id/rename', authMiddleware, (req, res) => {
  const { name } = req.body;
  const doc = documents.find(d => d.id === parseInt(req.params.id));
  if (doc) {
    doc.name = name;
    doc.modified = new Date().toISOString().split('T')[0];
    res.json({ success: true, document: doc });
  } else {
    res.status(404).json({ error: 'Document not found' });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  const docIndex = documents.findIndex(d => d.id === parseInt(req.params.id));
  if (docIndex > -1) {
    const doc = { ...documents[docIndex] };
    doc.deletedAt = new Date().toISOString();
    trash.push(doc);
    documents.splice(docIndex, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Document not found' });
  }
});

router.post('/trash/:id/restore', authMiddleware, (req, res) => {
  const docIndex = trash.findIndex(d => d.id === parseInt(req.params.id));
  if (docIndex > -1) {
    const doc = trash[docIndex];
    delete doc.deletedAt;
    documents.push(doc);
    trash.splice(docIndex, 1);
    res.json({ success: true, document: doc });
  } else {
    res.status(404).json({ error: 'Document not found' });
  }
});

router.delete('/trash/:id/permanent', authMiddleware, (req, res) => {
  const docIndex = trash.findIndex(d => d.id === parseInt(req.params.id));
  if (docIndex > -1) {
    trash.splice(docIndex, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Document not found' });
  }
});

router.delete('/trash/empty', authMiddleware, (req, res) => {
  trash = [];
  res.json({ success: true });
});

export default router;