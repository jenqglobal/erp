import express from 'express';
import db from '../models/database.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateId, paginate } from '../utils/helpers.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/projects', (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const { limit: l, offset } = paginate(page, limit);
    
    let query = 'SELECT * FROM projects WHERE organization_id = ?';
    const params = [req.user.organization_id];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(l, offset);
    
    const projects = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM projects WHERE organization_id = ?').get(req.user.organization_id);
    
    res.json({ projects, total: total.count, page: parseInt(page), limit: l });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/projects', (req, res) => {
  try {
    const { name, description, client_id, status, priority, start_date, end_date, budget } = req.body;
    
    db.prepare(`
      INSERT INTO projects (id, organization_id, name, description, client_id, status, priority, start_date, end_date, budget, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(generateId(), req.user.organization_id, name, description, client_id, status, priority, start_date, end_date, budget, req.user.id);
    
    res.status(201).json({ message: 'Project created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.put('/projects/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, client_id, status, priority, start_date, end_date, budget } = req.body;
    
    db.prepare(`
      UPDATE projects SET name = COALESCE(?, name), description = COALESCE(?, description),
      client_id = COALESCE(?, client_id), status = COALESCE(?, status), priority = COALESCE(?, priority),
      start_date = COALESCE(?, start_date), end_date = COALESCE(?, end_date), budget = COALESCE(?, budget)
      WHERE id = ? AND organization_id = ?
    `).run(name, description, client_id, status, priority, start_date, end_date, budget, id, req.user.organization_id);
    
    res.json({ message: 'Project updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/projects/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM projects WHERE id = ? AND organization_id = ?').run(id, req.user.organization_id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

router.get('/projects/:id/tasks', (req, res) => {
  try {
    const { id } = req.params;
    const tasks = db.prepare('SELECT * FROM project_tasks WHERE project_id = ? ORDER BY created_at DESC').all(id);
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/projects/:id/tasks', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assigned_to, priority, due_date, estimated_hours } = req.body;
    
    db.prepare(`
      INSERT INTO project_tasks (id, project_id, title, description, assigned_to, priority, due_date, estimated_hours)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(generateId(), id, title, description, assigned_to, priority, due_date, estimated_hours);
    
    res.status(201).json({ message: 'Task created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.put('/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, assigned_to, status, priority, due_date, estimated_hours, logged_hours } = req.body;
    
    db.prepare(`
      UPDATE project_tasks SET title = COALESCE(?, title), assigned_to = COALESCE(?, assigned_to),
      status = COALESCE(?, status), priority = COALESCE(?, priority), due_date = COALESCE(?, due_date),
      estimated_hours = COALESCE(?, estimated_hours), logged_hours = COALESCE(?, logged_hours)
      WHERE id = ?
    `).run(title, assigned_to, status, priority, due_date, estimated_hours, logged_hours, id);
    
    res.json({ message: 'Task updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

export default router;