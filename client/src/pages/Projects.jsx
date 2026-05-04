import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, FolderKanban, Edit2, Trash2, CheckCircle, Clock, Calendar, Users, Target, AlertCircle, ArrowUpRight, GripVertical, MoreHorizontal, ChevronRight, Filter, Search, Download, BarChart2, LayoutGrid, List, Kanban, ClipboardList, BarChart, DollarSign } from 'lucide-react';
import { projectsService } from '../services/api';
import { Modal, Card, Badge, Tabs, Pagination, EmptyState } from '../components/UI';
import { useTheme } from '../store/ThemeContext';
import { Layout } from '../components/Layout';

const Projects = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const path = location.pathname;
  
  const getInitialView = () => {
    if (path.includes('/kanban')) return 'kanban';
    if (path.includes('/timeline')) return 'timeline';
    if (path.includes('/tasks')) return 'tasks';
    if (path.includes('/gantt')) return 'gantt';
    if (path.includes('/time')) return 'time';
    if (path.includes('/resources')) return 'resources';
    if (path.includes('/reports')) return 'reports';
    return 'kanban';
  };
  
  const [viewMode, setViewMode] = useState(getInitialView());
  const [activeView, setActiveView] = useState(getInitialView());
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [dragTask, setDragTask] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const projectReports = [
    { title: 'Project Status', icon: BarChart2, desc: 'Overview of all project statuses', data: { planning: 2, active: 5, onHold: 1, completed: 8, cancelled: 1 } },
    { title: 'Team Performance', icon: Users, desc: 'Team workload and productivity', data: { members: 12, avgTasks: 8, completed: 45, overdue: 3 } },
    { title: 'Timeline Analysis', icon: Calendar, desc: 'Project timeline compliance', data: { onTime: 12, delayed: 3, atRisk: 2 } },
    { title: 'Budget Overview', icon: DollarSign, desc: 'Budget vs actual spending', data: { total: 250000, spent: 187500, remaining: 62500 } },
    { title: 'Task Completion', icon: CheckCircle, desc: 'Task completion rates', data: { total: 156, completed: 98, inProgress: 35, todo: 23 } },
    { title: 'Resource Utilization', icon: GripVertical, desc: 'Resource allocation analysis', data: { allocated: 85, available: 15, overCapacity: 2 } },
  ];

  useEffect(() => {
    const newView = getInitialView();
    setViewMode(newView);
    setActiveView(newView);
    fetchData();
  }, [path]);
  
  const [form, setForm] = useState({
    name: '', description: '', client_id: '', status: 'planning', priority: 'medium', start_date: '', end_date: '', budget: ''
  });

  const [taskForm, setTaskForm] = useState({
    title: '', description: '', assigned_to: '', priority: 'medium', due_date: '', estimated_hours: '', status: 'todo'
  });

  useEffect(() => {
    fetchData();
  }, [page, viewMode]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await projectsService.getProjects({ page });
      setProjects(data.projects || []);
      setTotal(data.total || 0);
    } catch (error) {
      setProjects([
        { id: 1, name: 'Website Redesign', description: 'Complete overhaul of company website', status: 'active', priority: 'high', budget: 25000, start_date: '2024-01-15', end_date: '2024-03-30', progress: 65 },
        { id: 2, name: 'Mobile App Development', description: 'Build native iOS and Android apps', status: 'planning', priority: 'high', budget: 50000, start_date: '2024-04-01', end_date: '2024-08-30', progress: 0 },
        { id: 3, name: 'Marketing Campaign', description: 'Q1 marketing initiatives', status: 'active', priority: 'medium', budget: 15000, start_date: '2024-01-01', end_date: '2024-03-31', progress: 45 },
        { id: 4, name: 'System Migration', description: 'Cloud infrastructure upgrade', status: 'completed', priority: 'low', budget: 10000, start_date: '2023-11-01', end_date: '2024-01-15', progress: 100 },
        { id: 5, name: 'Data Analytics Platform', description: 'Business intelligence setup', status: 'on-hold', priority: 'medium', budget: 35000, start_date: '2024-02-01', end_date: '2024-05-30', progress: 20 },
      ]);
      setTotal(5);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await projectsService.updateProject(editingId, form);
      } else {
        await projectsService.createProject(form);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      if (!editingId) {
        const newProject = { ...form, id: Date.now(), progress: 0 };
        setProjects([...projects, newProject]);
      }
      setShowModal(false);
      resetForm();
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setProjects(projects.filter(p => p.id !== id));
  };

  const resetForm = () => {
    setForm({ name: '', description: '', client_id: '', status: 'planning', priority: 'medium', start_date: '', end_date: '', budget: '' });
    setEditingId(null);
  };

  const handleDragStart = (task) => {
    setDragTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (status) => {
    if (dragTask) {
      setTasks(tasks.map(t => t.id === dragTask.id ? { ...t, status } : t));
      setDragTask(null);
    }
  };

  const statusColumns = [
    { key: 'planning', label: 'Planning', color: 'slate' },
    { key: 'active', label: 'Active', color: 'primary' },
    { key: 'on-hold', label: 'On Hold', color: 'warning' },
    { key: 'completed', label: 'Completed', color: 'accent' },
  ];

  const filteredProjects = projects.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filtered = viewMode === 'kanban' 
    ? statusColumns.map(col => ({
        ...col,
        items: filteredProjects.filter(p => p.status === col.key)
      }))
    : filteredProjects;

  const getTitle = () => {
    const titles = {
      kanban: 'Kanban Board',
      timeline: 'Timeline',
      tasks: 'Tasks',
      gantt: 'Gantt Chart',
      time: 'Time Tracking',
      resources: 'Resources',
      reports: 'Project Reports'
    };
    return titles[viewMode] || 'Projects';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{getTitle()}</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {viewMode === 'kanban' && 'View projects as Kanban board'}
              {viewMode === 'timeline' && 'View projects on timeline'}
              {viewMode === 'tasks' && 'Manage all project tasks'}
              {viewMode === 'gantt' && 'View Gantt chart'}
              {viewMode === 'time' && 'Track time spent on projects'}
              {viewMode === 'resources' && 'Manage project resources'}
              {viewMode === 'reports' && 'Project analytics and reports'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/30"
            >
              <Plus size={16} />
              New Project
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`flex rounded-lg overflow-hidden border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  viewMode === 'kanban' 
                    ? 'bg-primary-500 text-white' 
                    : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Kanban size={16} />
                Kanban
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary-500 text-white' 
                    : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <List size={16} />
                List
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  viewMode === 'timeline' 
                    ? 'bg-primary-500 text-white' 
                    : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Calendar size={16} />
                Timeline
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-9 pr-4 py-2 rounded-lg border text-sm w-64 ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                    : 'bg-white border-slate-300'
                }`}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Projects', value: projects.length, icon: FolderKanban, color: 'primary' },
            { label: 'In Progress', value: projects.filter(p => p.status === 'active').length, icon: Clock, color: 'warning' },
            { label: 'Completed', value: projects.filter(p => p.status === 'completed').length, icon: CheckCircle, color: 'accent' },
            { label: 'On Hold', value: projects.filter(p => p.status === 'on-hold').length, icon: AlertCircle, color: 'danger' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${
                  stat.color === 'primary' ? 'from-primary-500 to-primary-600' :
                  stat.color === 'accent' ? 'from-accent-500 to-accent-600' :
                  stat.color === 'warning' ? 'from-amber-500 to-amber-600' :
                  'from-red-500 to-red-600'
                } shadow-lg`}>
                  <stat.icon size={20} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {filtered.map(col => (
              <div 
                key={col.key}
                className={`rounded-xl border overflow-hidden ${
                  isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(col.key)}
              >
                <div className={`px-4 py-3 border-b flex items-center justify-between ${
                  isDark ? 'border-slate-700' : 'border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      col.color === 'primary' ? 'bg-primary-500' :
                      col.color === 'accent' ? 'bg-accent-500' :
                      col.color === 'warning' ? 'bg-amber-500' :
                      'bg-slate-400'
                    }`} />
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{col.label}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {col.items.length}
                  </span>
                </div>
                <div className="p-2 space-y-2 max-h-[500px] overflow-y-auto">
                  {col.items.length === 0 ? (
                    <p className={`text-center py-8 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No projects</p>
                  ) : (
                    col.items.map(project => (
                      <div
                        key={project.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                          isDark 
                            ? 'bg-slate-800 border-slate-700 hover:border-primary-500' 
                            : 'bg-white border-slate-200 hover:border-primary-300'
                        }`}
                        draggable
                        onDragStart={() => handleDragStart(project)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{project.name}</h4>
                          <button className="text-slate-400 hover:text-slate-600">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} line-clamp-2 mb-3`}>
                          {project.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Badge variant={project.priority === 'high' ? 'danger' : project.priority === 'medium' ? 'warning' : 'default'}>
                              {project.priority}
                            </Badge>
                          </div>
                          {project.budget && (
                            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              ${project.budget.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {project.progress !== undefined && (
                          <div className="mt-3">
                            <div className={`h-1 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                              <div 
                                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              {project.progress}% complete
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className={`rounded-xl border overflow-hidden ${
            isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Project</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Priority</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Progress</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Budget</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Timeline</th>
                    <th className="text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filtered.map(project => (
                    <tr key={project.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${
                            project.status === 'completed' ? 'from-accent-500 to-accent-600' :
                            project.status === 'active' ? 'from-primary-500 to-primary-600' :
                            'from-slate-400 to-slate-500'
                          }`}>
                            <FolderKanban size={16} className="text-white" />
                          </div>
                          <div>
                            <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{project.name}</p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{project.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={
                          project.status === 'completed' ? 'success' :
                          project.status === 'active' ? 'primary' :
                          project.status === 'on-hold' ? 'warning' : 'default'
                        }>
                          {project.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={
                          project.priority === 'high' ? 'danger' :
                          project.priority === 'medium' ? 'warning' : 'default'
                        }>
                          {project.priority}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-20 h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                            <div 
                              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                              style={{ width: `${project.progress || 0}%` }}
                            />
                          </div>
                          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{project.progress || 0}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`${isDark ? 'text-white' : 'text-slate-900'}`}>
                          ${project.budget?.toLocaleString() || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {project.start_date && project.end_date 
                            ? `${new Date(project.start_date).toLocaleDateString()} - ${new Date(project.end_date).toLocaleDateString()}`
                            : '-'
                          }
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleEdit(project)} className="p-1.5 rounded hover:bg-slate-100">
                            <Edit2 size={16} className="text-slate-400" />
                          </button>
                          <button onClick={() => handleDelete(project.id)} className="p-1.5 rounded hover:bg-red-50">
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewMode === 'timeline' && (
          <div className={`rounded-xl border overflow-hidden ${
            isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="p-4">
              <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-900'} mb-4`}>Project Timeline</h3>
              <div className="space-y-4">
                {filtered.map((project, idx) => (
                  <div key={project.id} className="relative">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        project.status === 'completed' ? 'bg-accent-500' :
                        project.status === 'active' ? 'bg-primary-500' :
                        project.status === 'on-hold' ? 'bg-amber-500' :
                        'bg-slate-400'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{project.name}</p>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {project.start_date && project.end_date 
                              ? `${new Date(project.start_date).toLocaleDateString()} - ${new Date(project.end_date).toLocaleDateString()}`
                              : 'No timeline'
                            }
                          </p>
                        </div>
                        <div className={`mt-1 h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                          <div 
                            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all"
                            style={{ width: `${project.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    {idx < filtered.length - 1 && (
                      <div className={`absolute left-1.5 top-4 w-px h-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'tasks' && (
          <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="p-4">
              <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-900'} mb-4`}>All Project Tasks</h3>
              <div className="space-y-2">
                {filtered.flatMap(project => 
                  (project.tasks || []).map((task, idx) => (
                    <div key={`${project.id}-${idx}`} className={`flex items-center gap-4 p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <div className={`w-4 h-4 rounded border-2 ${task.status === 'done' ? 'bg-green-500 border-green-500' : 'border-slate-400'}`} />
                      <div className="flex-1">
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{task.title || 'Task'}</p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{project.name}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${task.priority === 'high' ? 'bg-red-500/20 text-red-500' : task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-slate-500/20 text-slate-500'}`}>{task.priority}</span>
                    </div>
                  ))
                )}
                {filtered.length > 0 && filtered.flatMap(p => p.tasks || []).length === 0 && (
                  <p className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No tasks found. Create tasks within projects.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'gantt' && (
          <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="p-4">
              <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-900'} mb-4`}>Gantt Chart</h3>
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className={`grid grid-cols-12 gap-2 p-3 border-b ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <div className="col-span-4 text-sm font-medium">Project</div>
                    {Array.from({ length: 12 }, (_, i) => (
                      <div key={i} className="col-span-1 text-xs text-center">M{i + 1}</div>
                    ))}
                  </div>
                  {filtered.map((project) => (
                    <div key={project.id} className={`grid grid-cols-12 gap-2 p-3 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                      <div className="col-span-4">
                        <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{project.name}</p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{project.status}</p>
                      </div>
                      <div className="col-span-8 relative">
                        <div className={`h-6 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                          <div className="h-full bg-primary-500 rounded" style={{ width: `${project.progress || 0}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'time' && (
          <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="p-4">
              <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-900'} mb-4`}>Time Tracking</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Hours</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{filtered.reduce((sum, p) => sum + (p.logged_hours || 0), 0)}h</p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>This Week</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>24h</p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Billable</p>
                  <p className={`text-2xl font-bold text-primary-500`}>18h</p>
                </div>
              </div>
              <div className="space-y-3">
                {filtered.map(project => (
                  <div key={project.id} className={`flex items-center justify-between p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{project.name}</p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{project.logged_hours || 0} hours logged</p>
                    </div>
                    <button className="px-3 py-1 rounded-lg bg-primary-500 text-white text-sm">Log Time</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'resources' && (
          <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="p-4">
              <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-900'} mb-4`}>Project Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'John Smith', role: 'Project Manager', projects: 3, tasks: 12 },
                  { name: 'Sarah Johnson', role: 'Developer', projects: 2, tasks: 8 },
                  { name: 'Mike Brown', role: 'Designer', projects: 2, tasks: 6 },
                  { name: 'Emily Davis', role: 'QA Engineer', projects: 1, tasks: 4 },
                ].map((member, idx) => (
                  <div key={idx} className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-100 text-primary-600'}`}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{member.name}</p>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{member.role}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Projects: {member.projects}</span>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Tasks: {member.tasks}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectReports.map((report, idx) => (
              <div key={idx} onClick={() => setSelectedReport(report)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${isDark ? 'bg-slate-900 border-slate-700 hover:border-primary-500' : 'bg-white border-slate-200 hover:border-primary-500'}`}>
                <div className={`p-3 rounded-xl w-fit mb-4 ${isDark ? 'bg-primary-500/10' : 'bg-primary-50'}`}>
                  <report.icon size={24} className="text-primary-500" />
                </div>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{report.title}</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{report.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editingId ? 'Edit Project' : 'New Project'}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Project Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({...p, name: e.target.value}))}
              className={`input w-full ${isDark ? 'bg-slate-800 border-slate-600 text-white' : ''}`}
            />
          </div>
          <div className="col-span-2">
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({...p, description: e.target.value}))}
              className={`input w-full min-h-[80px] resize-y ${isDark ? 'bg-slate-800 border-slate-600 text-white' : ''}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Status</label>
            <select
              value={form.status}
              onChange={e => setForm(p => ({...p, status: e.target.value}))}
              className={`input w-full ${isDark ? 'bg-slate-800 border-slate-600 text-white' : ''}`}
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Priority</label>
            <select
              value={form.priority}
              onChange={e => setForm(p => ({...p, priority: e.target.value}))}
              className={`input w-full ${isDark ? 'bg-slate-800 border-slate-600 text-white' : ''}`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Start Date</label>
            <input
              type="date"
              value={form.start_date}
              onChange={e => setForm(p => ({...p, start_date: e.target.value}))}
              className={`input w-full ${isDark ? 'bg-slate-800 border-slate-600 text-white' : ''}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>End Date</label>
            <input
              type="date"
              value={form.end_date}
              onChange={e => setForm(p => ({...p, end_date: e.target.value}))}
              className={`input w-full ${isDark ? 'bg-slate-800 border-slate-600 text-white' : ''}`}
            />
          </div>
          <div className="col-span-2">
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Budget</label>
            <input
              type="number"
              value={form.budget}
              onChange={e => setForm(p => ({...p, budget: e.target.value}))}
              className={`input w-full ${isDark ? 'bg-slate-800 border-slate-600 text-white' : ''}`}
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
          <button 
            onClick={() => setShowModal(false)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              isDark 
                ? 'border-slate-600 text-slate-300 hover:bg-slate-800' 
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
          >
            {editingId ? 'Update' : 'Create'}
          </button>
        </div>
      </Modal>

      {selectedReport && (
        <Modal isOpen={!!selectedReport} onClose={() => setSelectedReport(null)} title={selectedReport.title} size="lg">
          <div className="space-y-4">
            {selectedReport.title === 'Project Status' && (
              <div className="grid grid-cols-4 gap-4">
                <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedReport.data.planning}</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Planning</p>
                </div>
                <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                  <p className={`text-2xl font-bold text-blue-500`}>{selectedReport.data.active}</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Active</p>
                </div>
                <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}>
                  <p className={`text-2xl font-bold text-yellow-500`}>{selectedReport.data.onHold}</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>On Hold</p>
                </div>
                <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                  <p className={`text-2xl font-bold text-green-500`}>{selectedReport.data.completed}</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Completed</p>
                </div>
              </div>
            )}
            {selectedReport.title === 'Team Performance' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Team Members</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedReport.data.members}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Avg Tasks/Member</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedReport.data.avgTasks}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                    <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>Tasks Completed</p>
                    <p className={`text-2xl font-bold text-green-500`}>{selectedReport.data.completed}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                    <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>Overdue</p>
                    <p className={`text-2xl font-bold text-red-500`}>{selectedReport.data.overdue}</p>
                  </div>
                </div>
              </div>
            )}
            {selectedReport.title === 'Timeline Analysis' && (
              <div className="grid grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                  <p className={`text-2xl font-bold text-green-500`}>{selectedReport.data.onTime}</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>On Time</p>
                </div>
                <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}>
                  <p className={`text-2xl font-bold text-yellow-500`}>{selectedReport.data.delayed}</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Delayed</p>
                </div>
                <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                  <p className={`text-2xl font-bold text-red-500`}>{selectedReport.data.atRisk}</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>At Risk</p>
                </div>
              </div>
            )}
            {selectedReport.title === 'Budget Overview' && (
              <div className="space-y-4">
                <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Budget</p>
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>${selectedReport.data.total.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-primary-500/10' : 'bg-primary-50'}`}>
                    <p className={`text-sm ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>Spent</p>
                    <p className={`text-2xl font-bold text-primary-500`}>${selectedReport.data.spent.toLocaleString()}</p>
                    <div className={`mt-2 h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(selectedReport.data.spent/selectedReport.data.total)*100}%` }} />
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                    <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>Remaining</p>
                    <p className={`text-2xl font-bold text-green-500`}>${selectedReport.data.remaining.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
            {selectedReport.title === 'Task Completion' && (
              <div className="space-y-4">
                <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Tasks</p>
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedReport.data.total}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                    <p className={`text-2xl font-bold text-green-500`}>{selectedReport.data.completed}</p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Completed</p>
                  </div>
                  <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                    <p className={`text-2xl font-bold text-blue-500`}>{selectedReport.data.inProgress}</p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>In Progress</p>
                  </div>
                  <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedReport.data.todo}</p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>To Do</p>
                  </div>
                </div>
              </div>
            )}
            {selectedReport.title === 'Resource Utilization' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-primary-500/10' : 'bg-primary-50'}`}>
                    <p className={`text-2xl font-bold text-primary-500`}>{selectedReport.data.allocated}%</p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Allocated</p>
                  </div>
                  <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                    <p className={`text-2xl font-bold text-green-500`}>{selectedReport.data.available}%</p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Available</p>
                  </div>
                  <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                    <p className={`text-2xl font-bold text-red-500`}>{selectedReport.data.overCapacity}</p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Over Capacity</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <button className={`flex-1 py-2 rounded-lg border ${isDark ? 'border-slate-600 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-50'} flex items-center justify-center gap-2`}>
                <Download size={16} /> Export
              </button>
              <button className={`flex-1 py-2 rounded-lg border ${isDark ? 'border-slate-600 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-50'} flex items-center justify-center gap-2`}>
                <BarChart2 size={16} /> View Details
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default Projects;