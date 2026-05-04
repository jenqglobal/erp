import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Plus, Search, X, FileText, Check, X as XIcon, Clock, User, Mail, Phone, 
  Calendar, Clipboard, Upload, Send, AlertCircle, CheckCircle, Circle, 
  PenTool, Shield, Building, Users, ArrowRight, ChevronRight, MessageSquare,
  MoreVertical, Trash2, Edit2, Play, Pause, Square, 
  FileSignature, FileUp, Image, BookOpen, Loader, Target
} from 'lucide-react';
import { useTheme } from '../store/ThemeContext';
import { Layout as AppLayout } from '../components/Layout';
import { onboardingApi } from '../api/onboarding';

const Onboarding = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const getInitialTab = () => {
    if (path.includes('/templates')) return 'templates';
    if (path.includes('/settings')) return 'settings';
    return 'clients';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [clients, setClients] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [stages, setStages] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Modal states
  const [showClientModal, setShowClientModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDocSignModal, setShowDocSignModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [meetingData, setMeetingData] = useState({ type: 'kickoff', date: '', time: '' });
  const [signData, setSignData] = useState({ signer_name: '', signature: '' });

  // Filter states
  const [stageFilter, setStageFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [newClient, setNewClient] = useState({
    company: '', contact_name: '', email: '', phone: '',
    industry: '', company_size: '', template_id: '', assigned_to: ''
  });
  const [formData, setFormData] = useState({});

  const showNotify = useCallback((type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  useEffect(() => {
    const newTab = getInitialTab();
    setActiveTab(newTab);
    fetchData();
  }, [path, stageFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (stageFilter) params.stage = stageFilter;
      const data = await onboardingApi.getAll(params);
      setClients(data.clients || []);
      setTemplates(data.templates || []);
      setStages(data.stages || []);
      if (data.stats) setStats(data.stats);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      showNotify('error', 'Failed to load data');
    }
    setLoading(false);
  };

  const getStageColor = (stage) => {
    const colors = {
      lead_converted: 'bg-blue-500',
      invited: 'bg-purple-500',
      in_progress: 'bg-amber-500',
      pending_approval: 'bg-orange-500',
      completed: 'bg-green-500',
      project_activated: 'bg-teal-500',
    };
    return colors[stage] || 'bg-slate-500';
  };

  const getStageLabel = (stage) => {
    return stages.find(s => s.key === stage)?.label || stage;
  };

  // Client operations
  const handleCreateClient = async () => {
    if (!newClient.company || !newClient.contact_name || !newClient.email) {
      showNotify('error', 'Please fill required fields');
      return;
    }
    try {
      const result = await onboardingApi.createClient(newClient);
      setClients([...clients, result.client]);
      setShowClientModal(false);
      setNewClient({ company: '', contact_name: '', email: '', phone: '', industry: '', company_size: '', template_id: '', assigned_to: '' });
      showNotify('success', 'Client created successfully');
      fetchData();
    } catch (err) {
      showNotify('error', 'Failed to create client');
    }
  };

  const handleInviteClient = async (id) => {
    try {
      const result = await onboardingApi.inviteClient(id);
      setClients(clients.map(c => c.id === id ? result.client : c));
      showNotify('success', 'Invitation sent');
    } catch (err) {
      showNotify('error', 'Failed to send invite');
    }
  };

  const handleDeleteClient = async (id) => {
    try {
      await onboardingApi.deleteClient(id);
      setClients(clients.filter(c => c.id !== id));
      showNotify('success', 'Client removed');
    } catch (err) {
      showNotify('error', 'Failed to remove client');
    }
  };

  const handleAssignTemplate = async (clientId, templateId) => {
    try {
      const result = await onboardingApi.assignTemplate(clientId, parseInt(templateId));
      setClients(clients.map(c => c.id === clientId ? result.client : c));
      showNotify('success', 'Template assigned');
    } catch (err) {
      showNotify('error', 'Failed to assign template');
    }
  };

  // Document operations
  const handleSendDoc = async (clientId, docId) => {
    try {
      const result = await onboardingApi.sendDocument(clientId, docId);
      updateClientDoc(clientId, docId, result.document);
      showNotify('success', 'Document sent');
    } catch (err) {
      showNotify('error', 'Failed to send document');
    }
  };

  const handleSignDoc = async () => {
    if (!selectedClient || !selectedDoc || !signData.signer_name || !signData.signature) {
      showNotify('error', 'Please provide name and signature');
      return;
    }
    try {
      const result = await onboardingApi.signDocument(selectedClient.id, selectedDoc.id, signData.signer_name, signData.signature);
      setClients(clients.map(c => c.id === selectedClient.id ? result.client : c));
      setShowDocSignModal(false);
      setSignData({ signer_name: '', signature: '' });
      showNotify('success', 'Document signed');
    } catch (err) {
      showNotify('error', 'Failed to sign document');
    }
  };

  const updateClientDoc = (clientId, docId, updatedDoc) => {
    setClients(clients.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          documents: c.documents.map(d => d.id === docId ? updatedDoc : d),
          progress: updatedDoc.progress || c.progress
        };
      }
      return c;
    }));
  };

  // Task operations
  const handleCompleteTask = async (clientId, taskId) => {
    try {
      const result = await onboardingApi.updateTask(clientId, taskId, 'completed');
      setClients(clients.map(c => c.id === clientId ? result.client : c));
      showNotify('success', 'Task completed');
    } catch (err) {
      showNotify('error', 'Failed to complete task');
    }
  };

  // Form operations
  const handleSubmitForm = async () => {
    if (!selectedClient || !selectedForm) return;
    try {
      const result = await onboardingApi.submitForm(selectedClient.id, selectedForm.name, formData);
      setClients(clients.map(c => c.id === selectedClient.id ? result.client : c));
      setShowFormModal(false);
      setFormData({});
      showNotify('success', 'Form submitted');
    } catch (err) {
      showNotify('error', 'Failed to submit form');
    }
  };

  // Message operations
  const handleSendMessage = async () => {
    if (!selectedClient || !messageText) return;
    try {
      const result = await onboardingApi.sendMessage(selectedClient.id, messageText, 'admin');
      setClients(clients.map(c => c.id === selectedClient.id ? { ...c, messages: [...c.messages, result.message] } : c));
      setMessageText('');
      setShowMessageModal(false);
    } catch (err) {
      showNotify('error', 'Failed to send message');
    }
  };

  // Meeting operations
  const handleScheduleMeeting = async () => {
    if (!selectedClient || !meetingData.date || !meetingData.time) {
      showNotify('error', 'Please select date and time');
      return;
    }
    try {
      const scheduledAt = `${meetingData.date}T${meetingData.time}:00Z`;
      const result = await onboardingApi.scheduleMeeting(selectedClient.id, meetingData.type, scheduledAt, '');
      setClients(clients.map(c => c.id === selectedClient.id ? result.client : c));
      setShowMeetingModal(false);
      setMeetingData({ type: 'kickoff', date: '', time: '' });
      showNotify('success', 'Meeting scheduled');
    } catch (err) {
      showNotify('error', 'Failed to schedule meeting');
    }
  };

  // Complete onboarding
  const handleCompleteOnboarding = async (id) => {
    try {
      const result = await onboardingApi.completeOnboarding(id);
      setClients(clients.map(c => c.id === id ? result.client : c));
      showNotify('success', 'Onboarding completed');
    } catch (err) {
      showNotify('error', 'Failed to complete');
    }
  };

  // Activate project
  const handleActivateProject = async (id) => {
    try {
      const result = await onboardingApi.activateProject(id);
      setClients(clients.map(c => c.id === id ? result.client : c));
      showNotify('success', 'Project activated');
    } catch (err) {
      showNotify('error', 'Failed to activate');
    }
  };

  const openClientDetail = (client) => {
    setSelectedClient(client);
    setShowDetailModal(true);
  };

  const openFormModal = (form) => {
    setSelectedForm(form);
    const existingData = selectedClient?.forms?.[form.name] || {};
    setFormData(existingData);
    setShowFormModal(true);
  };

  const filteredClients = clients.filter(c => {
    if (searchQuery) {
      return c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
             c.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             c.email.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const renderModal = (show, onClose, title, content, size = 'max-w-lg') => (
    show && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className={`rounded-2xl p-6 w-full ${size} ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-xl max-h-[90vh] overflow-y-auto`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
            <button onClick={onClose} className={`p-1 rounded-lg ${isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100'}`}>
              <X size={20} />
            </button>
          </div>
          {content}
        </div>
      </div>
    )
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {notification && (
          <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          } text-white`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : notification.type === 'error' ? <AlertCircle size={20} /> : <Loader size={20} />}
            <span className="text-sm font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-80"><X size={16} /></button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Customer Onboarding</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {activeTab === 'clients' && 'Manage client onboarding workflow and progress'}
              {activeTab === 'templates' && 'Create and manage onboarding templates'}
              {activeTab === 'settings' && 'Automation and notification settings'}
            </p>
          </div>
          {activeTab === 'clients' && (
            <button onClick={() => setShowClientModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">
              <Plus size={16} /> Add Client
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { key: 'clients', label: 'Clients', icon: Users },
            { key: 'templates', label: 'Templates', icon: Target },
            { key: 'settings', label: 'Settings', icon: Loader },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); navigate(`/onboarding${tab.key === 'clients' ? '' : `/${tab.key}`}`); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key ? 'bg-primary-500 text-white' : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12"><Loader className="animate-spin w-8 h-8 text-primary-500 mx-auto" /></div>
        ) : activeTab === 'clients' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {stages.map(stage => (
                <button
                  key={stage.key}
                  onClick={() => setStageFilter(stageFilter === stage.key ? '' : stage.key)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    stageFilter === stage.key ? 'ring-2 ring-primary-500' : ''
                  } ${isDark ? 'bg-slate-900 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                >
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stage.label}</p>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {stats[stage.key] || 0}
                  </p>
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className={`flex-1 relative ${isDark ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg`}>
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg bg-transparent outline-none ${isDark ? 'text-white placeholder-slate-400' : 'text-slate-900 placeholder-slate-500'}`}
                />
              </div>
              {stageFilter && (
                <button onClick={() => setStageFilter('')} className="text-sm text-primary-500 hover:underline">
                  Clear filter
                </button>
              )}
            </div>

            {/* Pipeline View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredClients.map(client => (
                <div
                  key={client.id}
                  className={`p-5 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                    isDark ? 'bg-slate-900 border-slate-700 hover:border-primary-500' : 'bg-white border-slate-200 hover:border-primary-500'
                  }`}
                  onClick={() => openClientDetail(client)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${getStageColor(client.stage)} flex items-center justify-center text-white font-bold`}>
                        {client.company?.charAt(0)}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{client.company}</h3>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{client.contact_name}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStageColor(client.stage)} text-white`}>
                      {getStageLabel(client.stage)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Progress</span>
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{client.progress}%</span>
                    </div>
                    <div className={`h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                      <div className={`h-full ${getStageColor(client.stage)} rounded-full transition-all`} style={{ width: `${client.progress}%` }} />
                    </div>
                  </div>

                  <div className={`flex items-center justify-between mt-4 pt-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-2 text-xs">
                      <Clipboard size={12} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                        {client.tasks?.filter(t => t.status === 'completed').length || 0}/{client.tasks?.length || 0} tasks
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {client.documents?.filter(d => d.status === 'signed').length}/{client.documents?.length || 0} docs
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredClients.length === 0 && (
              <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>No clients found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {templates.length} templates available
              </p>
              <button onClick={() => setShowTemplateModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">
                <Plus size={16} /> New Template
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map(template => (
                <div key={template.id} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{template.name}</h3>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{template.description}</p>
                    </div>
                    {template.is_default && (
                      <span className="px-2 py-1 text-xs bg-primary-500/20 text-primary-500 rounded">Default</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clipboard size={14} className="text-slate-400" />
                      <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{template.tasks?.length || 0} tasks</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText size={14} className="text-slate-400" />
                      <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{template.documents?.length || 0} docs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen size={14} className="text-slate-400" />
                      <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{template.forms?.length || 0} forms</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className={`flex-1 py-2 text-sm rounded-lg ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                      Edit
                    </button>
                    <button className="flex-1 py-2 text-sm rounded-lg bg-primary-500 text-white hover:bg-primary-600">
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Automation Rules</h3>
              <div className="space-y-3">
                {[
                  { name: 'Auto-assign template', trigger: 'Client created', action: 'Assign default template', active: true },
                  { name: 'Update stage', trigger: 'All tasks completed', action: 'Move to pending approval', active: true },
                  { name: 'Notify admin', trigger: 'Documents signed', action: 'Send notification', active: true },
                  { name: 'Welcome message', trigger: 'Client invited', action: 'Send welcome message', active: false },
                ].map((rule, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{rule.name}</p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{rule.trigger} → {rule.action}</p>
                    </div>
                    <button className={`w-12 h-6 rounded-full transition-colors ${rule.active ? 'bg-primary-500' : 'bg-slate-600'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${rule.active ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Notification Settings</h3>
              <div className="space-y-3">
                {['Task pending', 'Document rejected', 'Step completed', 'Onboarding stuck'].map((event, i) => (
                  <div key={i} className="flex items-center justify-between p-3">
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{event}</span>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked className="rounded text-primary-500" />
                        Email
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked className="rounded text-primary-500" />
                        In-app
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Client Modal */}
        {renderModal(showClientModal, () => setShowClientModal(false), 'Add New Client', (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Company Name *</label>
                <input type="text" value={newClient.company} onChange={(e) => setNewClient({...newClient, company: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Contact Name *</label>
                <input type="text" value={newClient.contact_name} onChange={(e) => setNewClient({...newClient, contact_name: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email *</label>
                <input type="email" value={newClient.email} onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Phone</label>
                <input type="tel" value={newClient.phone} onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Industry</label>
                <select value={newClient.industry} onChange={(e) => setNewClient({...newClient, industry: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}>
                  <option value="">Select...</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Onboarding Template</label>
                <select value={newClient.template_id} onChange={(e) => setNewClient({...newClient, template_id: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}>
                  <option value="">Select template...</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowClientModal(false)} className={`flex-1 py-2 rounded-lg ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>Cancel</button>
              <button onClick={handleCreateClient} className="flex-1 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">Create Client</button>
            </div>
          </div>
        ))}

        {/* Client Detail Modal */}
        {renderModal(showDetailModal, () => setShowDetailModal(false), selectedClient?.company, (
          <div className="space-y-6">
            {/* Progress & Stage */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary-500/10">
              <div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Current Stage</p>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{getStageLabel(selectedClient?.stage)}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Progress</p>
                <p className={`text-2xl font-bold text-primary-500`}>{selectedClient?.progress}%</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-slate-400" />
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{selectedClient?.contact_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" />
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{selectedClient?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-slate-400" />
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{selectedClient?.phone || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building size={14} className="text-slate-400" />
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{selectedClient?.industry || '-'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {selectedClient?.stage === 'lead_converted' && (
                <button onClick={() => { handleInviteClient(selectedClient.id); setShowDetailModal(false); }} className="flex-1 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 flex items-center justify-center gap-2">
                  <Send size={16} /> Send Invite
                </button>
              )}
              {selectedClient?.stage === 'in_progress' && (
                <>
                  <button onClick={() => setShowMessageModal(true)} className={`flex-1 py-2 rounded-lg ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'} flex items-center justify-center gap-2`}>
                    <MessageSquare size={16} /> Message
                  </button>
                  <button onClick={() => setShowMeetingModal(true)} className={`flex-1 py-2 rounded-lg ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'} flex items-center justify-center gap-2`}>
                    <Calendar size={16} /> Schedule
                  </button>
                </>
              )}
              {selectedClient?.stage === 'pending_approval' && (
                <button onClick={() => handleCompleteOnboarding(selectedClient.id)} className="flex-1 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> Complete Onboarding
                </button>
              )}
              {selectedClient?.stage === 'completed' && (
                <button onClick={() => handleActivateProject(selectedClient.id)} className="flex-1 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 flex items-center justify-center gap-2">
                  <Zap size={16} /> Activate Project
                </button>
              )}
            </div>

            {/* Tasks */}
            <div>
              <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Clipboard size={16} className="inline mr-2" />Tasks
              </h4>
              <div className="space-y-2">
                {selectedClient?.tasks?.map(task => (
                  <div key={task.id} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleCompleteTask(selectedClient.id, task.id)} disabled={task.status === 'completed'}>
                        {task.status === 'completed' ? (
                          <CheckCircle size={18} className="text-green-500" />
                        ) : task.status === 'in_progress' ? (
                          <Clock size={18} className="text-amber-500" />
                        ) : (
                          <Circle size={18} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                        )}
                      </button>
                      <div>
                        <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'} ${task.status === 'completed' ? 'line-through' : ''}`}>{task.title}</span>
                        {task.mandatory && <span className="ml-2 text-xs text-red-500">*</span>}
                      </div>
                    </div>
                    {task.status !== 'completed' && selectedClient?.stage !== 'completed' && (
                      <button onClick={() => handleCompleteTask(selectedClient.id, task.id)} className="text-xs px-2 py-1 rounded bg-primary-500/20 text-primary-500 hover:bg-primary-500/30">
                        Complete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div>
              <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <FileSignature size={16} className="inline mr-2" />Documents
              </h4>
              <div className="space-y-2">
                {selectedClient?.documents?.map(doc => (
                  <div key={doc.id} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <FileText size={16} className={doc.status === 'signed' ? 'text-green-500' : 'text-slate-400'} />
                      <div>
                        <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{doc.name}</span>
                        {doc.mandatory && <span className="ml-2 text-xs text-red-500">*</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        doc.status === 'signed' ? 'bg-green-500/20 text-green-500' :
                        doc.status === 'sent' ? 'bg-blue-500/20 text-blue-500' : 'bg-amber-500/20 text-amber-500'
                      }`}>{doc.status}</span>
                      {doc.status === 'pending' && (
                        <button onClick={() => handleSendDoc(selectedClient.id, doc.id)} className="text-xs px-2 py-1 rounded bg-primary-500 text-white">Send</button>
                      )}
                      {doc.status === 'sent' && (
                        <button onClick={() => { setSelectedDoc(doc); setShowDocSignModal(true); }} className="text-xs px-2 py-1 rounded bg-accent-500 text-white">Sign</button>
                      )}
                      {doc.status === 'signed' && (
                        <span className="text-xs text-green-500">✓ {doc.signed_at}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Forms */}
            {selectedClient?.tasks?.some(t => t.title.toLowerCase().includes('profile')) && (
              <div>
                <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <BookOpen size={16} className="inline mr-2" />Intake Forms
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {templates.find(t => t.id === selectedClient?.template_id)?.forms.map(form => {
                    const isFilled = selectedClient?.forms?.[form.name];
                    return (
                      <button
                        key={form.id}
                        onClick={() => openFormModal(form)}
                        className={`p-3 rounded-lg border text-left ${isFilled ? 'border-green-500 bg-green-500/10' : isDark ? 'border-slate-600' : 'border-slate-200'}`}
                      >
                        <span className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{form.name}</span>
                        {isFilled && <CheckCircle size={14} className="ml-2 text-green-500 inline" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Messages */}
            <div>
              <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <MessageSquare size={16} className="inline mr-2" />Communication
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedClient?.messages?.slice(-5).map(msg => (
                  <div key={msg.id} className={`p-2 rounded ${msg.from === 'system' ? 'bg-blue-500/10 text-blue-500' : msg.from === 'admin' ? 'bg-slate-700' : 'bg-slate-600'}`}>
                    <span className="text-sm">{msg.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Template Assignment */}
            <div>
              <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Assign Template</h4>
              <select
                className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                value=""
                onChange={(e) => e.target.value && handleAssignTemplate(selectedClient.id, e.target.value)}
              >
                <option value="">Change template...</option>
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
        ), 'max-w-2xl')}

        {/* E-Sign Modal */}
        {renderModal(showDocSignModal, () => setShowDocSignModal(false), 'E-Sign Document', (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Document: <span className="font-medium">{selectedDoc?.name}</span></p>
            </div>
            <div>
              <label className={`block text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Full Legal Name *</label>
              <input type="text" value={signData.signer_name} onChange={(e) => setSignData({...signData, signer_name: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
            </div>
            <div>
              <label className={`block text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Signature *</label>
              <textarea value={signData.signature} onChange={(e) => setSignData({...signData, signature: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border h-24 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                placeholder="Type your signature..." />
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>By signing, you agree to the terms and conditions</p>
            <div className="flex gap-2">
              <button onClick={() => setShowDocSignModal(false)} className={`flex-1 py-2 rounded-lg ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>Cancel</button>
              <button onClick={handleSignDoc} className="flex-1 py-2 rounded-lg bg-accent-500 text-white hover:bg-accent-600 flex items-center justify-center gap-2">
                <PenTool size={16} /> Sign Document
              </button>
            </div>
          </div>
        ))}

        {/* Form Modal */}
        {renderModal(showFormModal, () => setShowFormModal(false), selectedForm?.name, (
          <div className="space-y-4">
            {selectedForm?.fields?.map(field => (
              <div key={field.name}>
                <label className={`block text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                  >
                    <option value="">Select...</option>
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                    rows={3}
                  />
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                  />
                )}
              </div>
            ))}
            <div className="flex gap-2">
              <button onClick={() => setShowFormModal(false)} className={`flex-1 py-2 rounded-lg ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>Cancel</button>
              <button onClick={handleSubmitForm} className="flex-1 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">Submit Form</button>
            </div>
          </div>
        ))}

        {/* Message Modal */}
        {renderModal(showMessageModal, () => setShowMessageModal(false), 'Send Message', (
          <div className="space-y-4">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className={`w-full px-3 py-2 rounded-lg border h-32 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
            />
            <div className="flex gap-2">
              <button onClick={() => setShowMessageModal(false)} className={`flex-1 py-2 rounded-lg ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>Cancel</button>
              <button onClick={handleSendMessage} className="flex-1 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">Send Message</button>
            </div>
          </div>
        ))}

        {/* Meeting Modal */}
        {renderModal(showMeetingModal, () => setShowMeetingModal(false), 'Schedule Meeting', (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Meeting Type</label>
              <select value={meetingData.type} onChange={(e) => setMeetingData({...meetingData, type: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}>
                <option value="kickoff">Kickoff Call</option>
                <option value="demo">Demo Session</option>
                <option value="review">Review Session</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Date</label>
                <input type="date" value={meetingData.date} onChange={(e) => setMeetingData({...meetingData, date: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Time</label>
                <input type="time" value={meetingData.time} onChange={(e) => setMeetingData({...meetingData, time: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowMeetingModal(false)} className={`flex-1 py-2 rounded-lg ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>Cancel</button>
              <button onClick={handleScheduleMeeting} className="flex-1 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">Schedule</button>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
};

export default Onboarding;