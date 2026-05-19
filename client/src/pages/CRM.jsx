import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Edit2, Trash2, Mail, Phone, Building, Users, DollarSign, 
  Target, TrendingUp, Filter, Download, MoreHorizontal, X, 
  ArrowRight, Sparkles, CheckCircle, AlertCircle, Clock,
  Package, CreditCard, User, Calendar, FileText, BarChart3
} from 'lucide-react';
import { crmService } from '../services/api';
import { useTheme } from '../store/ThemeContext';
import { Layout } from '../components/Layout';

const CRM = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  
  const tabs = [
    { key: 'pipeline', label: 'Pipeline', icon: Target },
    { key: 'leads', label: 'Leads', icon: Users },
    { key: 'deals', label: 'Deals', icon: DollarSign },
    { key: 'contacts', label: 'Contacts', icon: Phone },
    { key: 'companies', label: 'Companies', icon: Building },
    { key: 'accounts', label: 'Accounts', icon: CreditCard },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];
  
  const getInitialTab = () => {
    if (path.includes('/leads')) return 'leads';
    if (path.includes('/deals')) return 'deals';
    if (path.includes('/contacts')) return 'contacts';
    if (path.includes('/companies')) return 'companies';
    if (path.includes('/accounts')) return 'accounts';
    if (path.includes('/analytics')) return 'analytics';
    return 'pipeline';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [leads, setLeads] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalDeals: 0,
    wonDeals: 0,
    conversionRate: 0,
    pipelineValue: 0,
    avgDealSize: 0,
    leadsByStatus: [],
    dealsByStage: [],
    monthlyTrends: []
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState('lead'); // lead, contact, deal
  const [editingItem, setEditingItem] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    // Lead & Contact fields
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    address: '',
    city: '',
    country: '',
    source: 'Website',
    lead_status: 'new',
    notes: '',
    // Deal fields
    title: '',
    value: '',
    stage: 'prospecting',
    probability: 10,
    expected_close: '',
    description: '',
  });

  useEffect(() => {
    const newTab = getInitialTab();
    setActiveTab(newTab);
    loadData();
  }, [path]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'deals' || activeTab === 'pipeline') {
        const data = await crmService.getDeals({ limit: 50 });
        if (data.deals) setDeals(data.deals);
      } else {
        const data = await crmService.getContacts({ limit: 50, search: searchTerm });
        if (data.contacts) {
          setContacts(data.contacts);
          setLeads(data.contacts.filter(c => c.lead_status !== 'customer'));
        }
      }
    } catch (err) {
      console.log('Using fallback data');
    }
    
    // Fallback data
    if (activeTab === 'leads') {
      setLeads([
        { id: 1, first_name: 'Alex', last_name: 'Turner', email: 'alex@techcorp.com', phone: '+1 555-0101', company: 'TechCorp Inc', position: 'CTO', lead_status: 'new', source: 'Website', created_at: '2024-01-15' },
        { id: 2, first_name: 'Maria', last_name: 'Garcia', email: 'maria@startup.io', phone: '+1 555-0102', company: 'Startup Hub', position: 'CEO', lead_status: 'qualified', source: 'Referral', created_at: '2024-01-14' },
        { id: 3, first_name: 'James', last_name: 'Wilson', email: 'james@global.com', phone: '+1 555-0103', company: 'Global Solutions', position: 'VP Ops', lead_status: 'in-progress', source: 'LinkedIn', created_at: '2024-01-12' },
        { id: 4, first_name: 'Sophie', last_name: 'Chen', email: 'sophie@innovate.co', phone: '+1 555-0104', company: 'Innovate Co', position: 'Product Lead', lead_status: 'new', source: 'Website', created_at: '2024-01-10' },
        { id: 5, first_name: 'David', last_name: 'Kim', email: 'david@enterprise.com', phone: '+1 555-0105', company: 'Enterprise Ltd', position: 'Director', lead_status: 'converted', source: 'Webinar', created_at: '2024-01-08' },
      ]);
    }
    
    if (activeTab === 'deals' || activeTab === 'pipeline') {
      setDeals([
        { id: 1, title: 'Enterprise License', value: 125000, stage: 'negotiation', probability: 75, expected_close: '2024-03-15', contact: 'TechCorp Inc', created_at: '2024-01-15' },
        { id: 2, title: 'Annual Subscription', value: 45000, stage: 'proposal', probability: 50, expected_close: '2024-03-30', contact: 'Startup Hub', created_at: '2024-01-14' },
        { id: 3, title: 'Startup Package', value: 15000, stage: 'qualified', probability: 30, expected_close: '2024-04-15', contact: 'Global Solutions', created_at: '2024-01-12' },
        { id: 4, title: 'Platform Integration', value: 32000, stage: 'closed_won', probability: 100, expected_close: '2024-02-28', contact: 'Innovate Co', created_at: '2024-01-10' },
        { id: 5, title: 'Support Contract', value: 24000, stage: 'prospecting', probability: 20, expected_close: '2024-04-01', contact: 'Enterprise Ltd', created_at: '2024-01-08' },
      ]);
    }
    
    if (activeTab === 'contacts') {
      setContacts([
        { id: 1, first_name: 'John', last_name: 'Smith', email: 'john@acme.com', phone: '+1 555-0101', company: 'Acme Corp', position: 'CEO', lead_status: 'customer' },
        { id: 2, first_name: 'Sarah', last_name: 'Johnson', email: 'sarah@techsol.com', phone: '+1 555-0102', company: 'Tech Solutions', position: 'VP Sales', lead_status: 'customer' },
        { id: 3, first_name: 'Mike', last_name: 'Wilson', email: 'mike@startup.io', phone: '+1 555-0103', company: 'Startup Inc', position: 'Founder', lead_status: 'customer' },
      ]);
    }
    
    if (activeTab === 'companies') {
      setCompanies([
        { id: 1, name: 'Acme Corp', industry: 'Technology', website: 'acme.com', employees: 250, status: 'active' },
        { id: 2, name: 'Tech Solutions', industry: 'Software', website: 'techsol.com', employees: 150, status: 'active' },
        { id: 3, name: 'Startup Inc', industry: 'Fintech', website: 'startup.io', employees: 50, status: 'active' },
      ]);
    }
    
    setLoading(false);
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    
    // Set modal title
    if (type === 'lead') {
      setModalTitle(item ? 'Edit Lead' : 'Add New Lead');
    } else if (type === 'contact') {
      setModalTitle(item ? 'Edit Contact' : 'Add New Contact');
    } else if (type === 'deal') {
      setModalTitle(item ? 'Edit Deal' : 'Add New Deal');
    }
    
    if (item) {
      setFormData(item);
    } else {
      // Reset form
      setFormData({
        first_name: '', last_name: '', email: '', phone: '', company: '', position: '',
        address: '', city: '', country: '', source: 'Website', lead_status: 'new', notes: '',
        title: '', value: '', stage: 'prospecting', probability: 10, expected_close: '', description: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      first_name: '', last_name: '', email: '', phone: '', company: '', position: '',
      address: '', city: '', country: '', source: 'Website', lead_status: 'new', notes: '',
      title: '', value: '', stage: 'prospecting', probability: 10, expected_close: '', description: '',
    });
  };

  const handleSave = async () => {
    try {
      if (modalType === 'lead' || modalType === 'contact') {
        if (editingItem) {
          await crmService.updateContact(editingItem.id, formData);
        } else {
          await crmService.createContact(formData);
        }
      } else if (modalType === 'deal') {
        if (editingItem) {
          await crmService.updateDeal(editingItem.id, formData);
        } else {
          await crmService.createDeal(formData);
        }
      }
    } catch (err) {
      console.log('Saving locally');
      if (modalType === 'lead') {
        if (editingItem) {
          setLeads(leads.map(l => l.id === editingItem.id ? { ...l, ...formData } : l));
        } else {
          setLeads([...leads, { ...formData, id: Date.now(), created_at: new Date().toISOString() }]);
        }
      } else if (modalType === 'deal') {
        if (editingItem) {
          setDeals(deals.map(d => d.id === editingItem.id ? { ...d, ...formData } : d));
        } else {
          setDeals([...deals, { ...formData, id: Date.now(), created_at: new Date().toISOString() }]);
        }
      }
    }
    closeModal();
    loadData();
  };

  const handleDelete = async (id, type) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      if (type === 'lead') await crmService.deleteContact(id);
      else if (type === 'deal') await crmService.deleteDeal(id);
    } catch (err) {
      console.log('Deleting locally');
    }
    loadData();
  };

  const convertToDeal = (lead) => {
    setModalType('deal');
    setFormData({
      title: `${lead.company} - Deal`,
      contact_id: lead.id,
      value: '',
      stage: 'prospecting',
      probability: 25,
      expected_close: '',
      description: '',
      // Keep lead info
      first_name: lead.first_name,
      last_name: lead.last_name,
      company: lead.company,
    });
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-700',
      'in-progress': 'bg-yellow-100 text-yellow-700',
      qualified: 'bg-purple-100 text-purple-700',
      converted: 'bg-green-100 text-green-700',
      customer: 'bg-green-100 text-green-700',
      prospecting: 'bg-slate-100 text-slate-700',
      proposal: 'bg-amber-100 text-amber-700',
      negotiation: 'bg-indigo-100 text-indigo-700',
      closed_won: 'bg-green-100 text-green-700',
      closed_lost: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

  const stageColumns = [
    { key: 'prospecting', label: 'Prospecting', color: 'slate' },
    { key: 'qualified', label: 'Qualified', color: 'primary' },
    { key: 'proposal', label: 'Proposal', color: 'warning' },
    { key: 'negotiation', label: 'Negotiation', color: 'indigo' },
    { key: 'closed_won', label: 'Closed Won', color: 'green' },
    { key: 'closed_lost', label: 'Closed Lost', color: 'red' }
  ];

  const dealsByStageData = stageColumns.map(stage => {
    const count = deals.filter(d => d.stage === stage.key).length;
    return {
      name: stage.label,
      count,
      color: stage.color,
      percentage: deals.length > 0 ? Math.round((count / deals.length) * 100) : 0
    };
  });

  const leadSourceData = [
    { name: 'Website', count: leads.filter(l => l.source === 'Website').length, color: 'primary' },
    { name: 'Referral', count: leads.filter(l => l.source === 'Referral').length, color: 'accent' },
    { name: 'Social', count: leads.filter(l => l.source === 'Social').length, color: 'indigo' },
    { name: 'Email', count: leads.filter(l => l.source === 'Email').length, color: 'green' },
    { name: 'Other', count: leads.filter(l => l.source !== 'Website' && l.source !== 'Referral' && l.source !== 'Social' && l.source !== 'Email').length, color: 'slate' },
  ];

  const totalValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
  const wonValue = deals.filter(d => d.stage === 'closed_won').reduce((sum, d) => sum + (d.value || 0), 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activeTab === 'pipeline' ? 'Sales Pipeline' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {activeTab === 'pipeline' ? 'Track your deals through the sales pipeline' : 
               activeTab === 'leads' ? 'Manage your leads and convert them to deals' :
               'Manage your CRM'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={() => loadData()} className={`p-2 rounded-lg border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
              <Filter size={18} />
            </button>
            
            {/* Add Button - changes based on tab */}
            {activeTab === 'leads' && (
              <button onClick={() => openModal('lead')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">
                <Plus size={16} /> Add Lead
              </button>
            )}
            {activeTab === 'contacts' && (
              <button onClick={() => openModal('contact')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">
                <Plus size={16} /> Add Contact
              </button>
            )}
            {(activeTab === 'deals' || activeTab === 'pipeline') && (
              <button onClick={() => openModal('deal')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">
                <Plus size={16} /> Add Deal
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 w-fit">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  navigate(`/crm/${tab.key === 'pipeline' ? '' : tab.key}`);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white dark:bg-slate-700 text-primary-500 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Stats for Deals/Pipeline */}
        {(activeTab === 'deals' || activeTab === 'pipeline') && (
          <div className="grid grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pipeline Value</p>
              <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(totalValue)}</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Closed Won</p>
              <p className="text-xl font-bold text-green-500">{formatCurrency(wonValue)}</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Deals</p>
              <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{deals.length}</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Win Rate</p>
              <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {deals.length > 0 ? Math.round((deals.filter(d => d.stage === 'closed_won').length / deals.length) * 100) : 0}%
              </p>
            </div>
          </div>
        )}

        {/* Stats for Leads */}
        {activeTab === 'leads' && (
          <div className="grid grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Leads</p>
              <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{leads.length}</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className="text-sm text-blue-500">New</p>
              <p className="text-xl font-bold text-blue-600">{leads.filter(l => l.lead_status === 'new').length}</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className="text-sm text-purple-500">Qualified</p>
              <p className="text-xl font-bold text-purple-600">{leads.filter(l => l.lead_status === 'qualified').length}</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className="text-sm text-green-500">Converted</p>
              <p className="text-xl font-bold text-green-600">{leads.filter(l => l.lead_status === 'converted').length}</p>
            </div>
          </div>
        )}

        {/* Pipeline View */}
        {(activeTab === 'pipeline' || activeTab === 'deals') && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {stageColumns.map(stage => {
              const stageDeals = deals.filter(d => d.stage === stage.key);
              const stageValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);
              return (
                <div key={stage.key} className={`min-w-[280px] flex-1 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className={`p-3 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{stage.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                        {stageDeals.length}
                      </span>
                    </div>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{formatCurrency(stageValue)}</p>
                  </div>
                  <div className="p-2 space-y-2 max-h-[400px] overflow-y-auto">
                    {stageDeals.map(deal => (
                      <div key={deal.id} 
                        onClick={() => openModal('deal', deal)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'}`}>
                        <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{deal.title}</p>
                        <p className={`text-xs text-slate-500 mb-2`}>{deal.contact || deal.company}</p>
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(deal.value)}</span>
                          <span className="text-xs text-slate-500">{deal.probability}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Leads Table */}
        {activeTab === 'leads' && (
          <div className={`rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="p-4 border-b border-slate-700">
              <div className="relative max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'border-slate-300'}`}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Name</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Company</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Source</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Created</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {leads.map(lead => (
                    <tr key={lead.id} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-medium">
                            {lead.first_name?.charAt(0)}
                          </div>
                          <div>
                            <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{lead.first_name} {lead.last_name}</p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{lead.company}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${getStatusColor(lead.lead_status)}`}>
                          {lead.lead_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{lead.created_at?.split('T')[0]}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => convertToDeal(lead)} className="px-2 py-1 text-xs bg-primary-500 text-white rounded hover:bg-primary-600">
                            Convert
                          </button>
                          <button onClick={() => openModal('lead', lead)} className={`p-1 rounded ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(lead.id, 'lead')} className="p-1 rounded text-red-500 hover:bg-red-100">
                            <Trash2 size={14} />
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

        {/* Contacts Table */}
        {activeTab === 'contacts' && (
          <div className={`rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Name</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Company</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Email</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Phone</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {contacts.map(contact => (
                    <tr key={contact.id} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-medium">
                            {contact.first_name?.charAt(0)}
                          </div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{contact.first_name} {contact.last_name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">{contact.company}</td>
                      <td className="px-4 py-3">{contact.email}</td>
                      <td className="px-4 py-3">{contact.phone}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openModal('contact', contact)} className={`p-1 rounded ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(contact.id, 'lead')} className="p-1 rounded text-red-500 hover:bg-red-100">
                            <Trash2 size={14} />
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

        {/* Companies Table */}
        {activeTab === 'companies' && (
          <div className={`rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Company</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Industry</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Website</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Employees</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {companies.map(company => (
                    <tr key={company.id} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                      <td className="px-4 py-3 font-medium">{company.name}</td>
                      <td className="px-4 py-3">{company.industry}</td>
                      <td className="px-4 py-3">{company.website}</td>
                      <td className="px-4 py-3">{company.employees}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => openModal('company', company)} className={`p-1 rounded ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                          <Edit2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Accounts Table */}
        {activeTab === 'accounts' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Accounts</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{accounts.length}</p>
              </div>
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Active</p>
                <p className="text-2xl font-bold text-green-500">{accounts.filter(a => a.status === 'active').length}</p>
              </div>
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Revenue</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>${accounts.reduce((sum, a) => sum + (a.revenue || 0), 0).toLocaleString()}</p>
              </div>
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Avg. Account Value</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>${accounts.length > 0 ? Math.round(accounts.reduce((sum, a) => sum + (a.revenue || 0), 0) / accounts.length).toLocaleString() : 0}</p>
              </div>
            </div>
            <div className={`rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Customer Accounts</h3>
                <button onClick={() => openModal('account', null)} className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm">
                  <Plus size={16} /> Add Account
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                    <tr>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Company</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Contact</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Email</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Revenue</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {accounts.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No accounts yet. Add your first account.</td></tr>
                    ) : (
                      accounts.map(account => (
                        <tr key={account.id} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                          <td className="px-4 py-3 font-medium">{account.company}</td>
                          <td className="px-4 py-3">{account.contact}</td>
                          <td className="px-4 py-3">{account.email}</td>
                          <td className="px-4 py-3">${(account.revenue || 0).toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs ${account.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                              {account.status || 'active'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => openModal('account', account)} className={`p-1 rounded ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                              <Edit2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Revenue</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>${analytics.totalRevenue.toLocaleString()}</p>
              </div>
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Deals</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{analytics.totalDeals}</p>
              </div>
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Won Deals</p>
                <p className="text-2xl font-bold text-green-500">{analytics.wonDeals}</p>
              </div>
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Conversion Rate</p>
                <p className="text-2xl font-bold text-primary-500">{analytics.conversionRate}%</p>
              </div>
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pipeline Value</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>${analytics.pipelineValue.toLocaleString()}</p>
              </div>
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Avg Deal Size</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>${analytics.avgDealSize.toLocaleString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Deals by Stage</h3>
                <div className="space-y-3">
                  {dealsByStageData.map(stage => (
                    <div key={stage.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-${stage.color}-500`}></div>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{stage.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-32 h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                          <div className={`h-2 rounded-full bg-${stage.color}-500`} style={{ width: `${stage.percentage}%` }}></div>
                        </div>
                        <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stage.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Lead Sources</h3>
                <div className="space-y-3">
                  {leadSourceData.map(source => (
                    <div key={source.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-${source.color}-500`}></div>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{source.name}</span>
                      </div>
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{source.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm" onClick={closeModal} />
            <div className="flex min-h-full items-center justify-center p-4">
              <div className={`relative w-full max-w-xl rounded-2xl shadow-2xl border animate-in zoom-in-95 duration-200 ${
                isDark 
                  ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-slate-700' 
                  : 'bg-white border-slate-200'
              }`}>
                {/* Header */}
                <div className={`relative px-6 py-5 border-b ${
                  isDark ? 'border-slate-700' : 'border-slate-100'
                }`}>
                  <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-r from-primary-500/10 to-accent-500/5" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                        {modalType === 'lead' && <Users size={20} className="text-white" />}
                        {modalType === 'contact' && <Phone size={20} className="text-white" />}
                        {modalType === 'deal' && <DollarSign size={20} className="text-white" />}
                      </div>
                      <div>
                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {editingItem ? 'Edit' : 'Add New'} {modalType === 'lead' ? 'Lead' : modalType === 'contact' ? 'Contact' : 'Deal'}
                        </h2>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {editingItem ? 'Update the details below' : 'Fill in the information below'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={closeModal} 
                      className={`p-2 rounded-xl transition-colors ${
                        isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'
                      }`}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                
                {/* Form Content */}
                <div className="p-6 space-y-5">
                  {/* Lead/Contact Form Fields */}
                  {(modalType === 'lead' || modalType === 'contact') && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className={`flex items-center gap-1.5 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <User size={14} /> First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.first_name}
                            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                            placeholder="John"
                            className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                              isDark 
                                ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' 
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                            }`}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className={`flex items-center gap-1.5 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={formData.last_name}
                            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                            placeholder="Doe"
                            className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                              isDark 
                                ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' 
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                            }`}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className={`flex items-center gap-1.5 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <Mail size={14} /> Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="john@example.com"
                            className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                              isDark 
                                ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' 
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                            }`}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className={`flex items-center gap-1.5 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <Phone size={14} /> Phone
                          </label>
                          <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="+1 555-0000"
                            className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                              isDark 
                                ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' 
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                            }`}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className={`flex items-center gap-1.5 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <Building size={14} /> Company <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                            placeholder="Acme Corp"
                            className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                              isDark 
                                ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' 
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                            }`}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className={`flex items-center gap-1.5 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <Package size={14} /> Position
                          </label>
                          <input
                            type="text"
                            value={formData.position}
                            onChange={(e) => setFormData({...formData, position: e.target.value})}
                            placeholder="CEO"
                            className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                              isDark 
                                ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' 
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                            }`}
                          />
                        </div>
                      </div>
                      
                      {modalType === 'lead' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Lead Source</label>
                            <select
                              value={formData.source}
                              onChange={(e) => setFormData({...formData, source: e.target.value})}
                              className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                                isDark 
                                  ? 'bg-slate-800/50 border-slate-600 text-white' 
                                  : 'bg-slate-50 border-slate-200 text-slate-900'
                              }`}
                            >
                              <option value="Website">Website</option>
                              <option value="Referral">Referral</option>
                              <option value="LinkedIn">LinkedIn</option>
                              <option value="Cold Call">Cold Call</option>
                              <option value="Webinar">Webinar</option>
                              <option value="Social Media">Social Media</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Status</label>
                            <select
                              value={formData.lead_status}
                              onChange={(e) => setFormData({...formData, lead_status: e.target.value})}
                              className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                                isDark 
                                  ? 'bg-slate-800/50 border-slate-600 text-white' 
                                  : 'bg-slate-50 border-slate-200 text-slate-900'
                              }`}
                            >
                              <option value="new">New</option>
                              <option value="in-progress">In Progress</option>
                              <option value="qualified">Qualified</option>
                              <option value="converted">Converted</option>
                            </select>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Notes</label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({...formData, notes: e.target.value})}
                          placeholder="Add any additional notes..."
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 resize-none ${
                            isDark 
                              ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' 
                              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                          }`}
                        />
                      </div>
                    </>
                  )}
                  
                  {/* Deal Form Fields */}
                  {modalType === 'deal' && (
                    <>
                      <div className="space-y-2">
                        <label className={`flex items-center gap-1.5 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          <Target size={14} /> Deal Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="Enterprise License Deal"
                          className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                            isDark 
                              ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' 
                              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                          }`}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className={`flex items-center gap-1.5 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <DollarSign size={14} /> Value ($)
                          </label>
                          <div className="relative">
                            <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>$</span>
                            <input
                              type="number"
                              value={formData.value}
                              onChange={(e) => setFormData({...formData, value: e.target.value})}
                              placeholder="0"
                              className={`w-full pl-8 pr-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                                isDark 
                                  ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' 
                                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                              }`}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className={`flex items-center gap-1.5 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <TrendingUp size={14} /> Probability (%)
                          </label>
                          <input
                            type="number"
                            value={formData.probability}
                            onChange={(e) => setFormData({...formData, probability: e.target.value})}
                            placeholder="50"
                            max="100"
                            className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                              isDark 
                                ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' 
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                            }`}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Stage</label>
                          <select
                            value={formData.stage}
                            onChange={(e) => setFormData({...formData, stage: e.target.value})}
                            className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                              isDark 
                                ? 'bg-slate-800/50 border-slate-600 text-white' 
                                : 'bg-slate-50 border-slate-200 text-slate-900'
                            }`}
                          >
                            <option value="prospecting">Prospecting</option>
                            <option value="qualified">Qualified</option>
                            <option value="proposal">Proposal</option>
                            <option value="negotiation">Negotiation</option>
                            <option value="closed_won">Closed Won</option>
                            <option value="closed_lost">Closed Lost</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className={`flex items-center gap-1.5 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <Calendar size={14} /> Expected Close
                          </label>
                          <input
                            type="date"
                            value={formData.expected_close}
                            onChange={(e) => setFormData({...formData, expected_close: e.target.value})}
                            className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 ${
                              isDark 
                                ? 'bg-slate-800/50 border-slate-600 text-white' 
                                : 'bg-slate-50 border-slate-200 text-slate-900'
                            }`}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Describe the deal details..."
                          rows={3}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-primary-500 resize-none ${
                            isDark 
                              ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-500' 
                              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                          }`}
                        />
                      </div>
                    </>
                  )}
                </div>
                
                {/* Footer */}
                <div className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${
                  isDark ? 'border-slate-700' : 'border-slate-100'
                }`}>
                  <button
                    onClick={closeModal}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${
                      isDark 
                        ? 'text-slate-300 hover:bg-slate-700' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-xl font-medium bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02]"
                  >
                    {editingItem ? 'Update' : 'Save'} {modalType === 'lead' ? 'Lead' : modalType === 'contact' ? 'Contact' : 'Deal'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CRM;