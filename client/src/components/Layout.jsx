import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useTheme, currencies } from '../store/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Users, Package, Receipt, UserPlus, FolderKanban, BarChart3,
  Settings, LogOut, ChevronLeft, ChevronRight, Bell, Menu, Sun, Moon, Sparkles,
  TrendingUp, DollarSign, ShoppingCart, Warehouse, Calculator, FileText, Workflow,
  Database, Mail, Phone, MessageSquare, Calendar, Target, Award, Clock, UsersRound,
  Briefcase, ClipboardList, FileCheck, PieChart, BarChart, Activity,
  Search, Filter, Download, Upload, MoreVertical, Plus, Star, Zap,
  Building, Home, CreditCard, Gift, Truck, PackageCheck, AlertTriangle, Shield,
  UserPlus as OnboardingIcon, FileSignature, ClipboardCheck, Send, UserCheck
} from 'lucide-react';

const menuConfig = [
  { 
    id: 'dashboard',
    path: '/dashboard', 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    subMenus: [
      { path: '/dashboard', label: 'Overview' },
      { path: '/dashboard/analytics', label: 'Analytics' },
      { path: '/dashboard/customize', label: 'Customize' }
    ]
  },
  { 
    id: 'crm',
    path: '/crm', 
    icon: Target, 
    label: 'CRM', 
    badge: 'Premium',
    subMenus: [
      { path: '/crm', label: 'Pipeline', icon: FolderKanban },
      { path: '/crm/leads', label: 'Leads', icon: Users },
      { path: '/crm/deals', label: 'Deals', icon: DollarSign },
      { path: '/crm/contacts', label: 'Contacts', icon: Phone },
      { path: '/crm/companies', label: 'Companies', icon: Building },
      { path: '/crm/accounts', label: 'Accounts', icon: CreditCard },
      { path: '/crm/campaigns', label: 'Campaigns', icon: Mail },
      { path: '/crm/analytics', label: 'CRM Analytics', icon: PieChart }
    ]
  },
  { 
    id: 'inventory',
    path: '/inventory', 
    icon: Package, 
    label: 'Inventory', 
    subMenus: [
      { path: '/inventory', label: 'Products' },
      { path: '/inventory/stock', label: 'Stock Levels' },
      { path: '/inventory/warehouses', label: 'Warehouses', icon: Warehouse },
      { path: '/inventory/purchase', label: 'Purchase Orders', icon: ShoppingCart },
      { path: '/inventory/transfers', label: 'Transfers', icon: Truck },
      { path: '/inventory/returns', label: 'Returns', icon: PackageCheck },
      { path: '/inventory/suppliers', label: 'Suppliers', icon: Building },
      { path: '/inventory/reports', label: 'Inventory Reports', icon: BarChart }
    ]
  },
  { 
    id: 'pos',
    path: '/pos', 
    icon: ShoppingCart, 
    label: 'POS', 
    badge: 'New',
    subMenus: [
      { path: '/pos', label: 'Point of Sale', icon: ShoppingCart },
      { path: '/pos/transactions', label: 'Transactions', icon: Receipt }
    ]
  },
  { 
    id: 'accounting',
    path: '/accounting', 
    icon: Calculator, 
    label: 'Billing', 
    badge: 'New',
    subMenus: [
      { path: '/accounting', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/accounting/invoices', label: 'Invoices', icon: FileText },
      { path: '/accounting/customers', label: 'Customers', icon: UserCheck },
      { path: '/accounting/payments', label: 'Payments', icon: CreditCard },
      { path: '/accounting/expenses', label: 'Expenses', icon: DollarSign },
      { path: '/accounting/accounts', label: 'Chart of Accounts', icon: Database },
      { path: '/accounting/reports', label: 'Financial Reports', icon: BarChart3 },
      { path: '/accounting/tax', label: 'Tax Settings', icon: Activity }
    ]
  },
  { 
    id: 'hr',
    path: '/hr', 
    icon: UsersRound, 
    label: 'HR', 
    subMenus: [
      { path: '/hr', label: 'Dashboard' },
      { path: '/hr/employees', label: 'Employees', icon: Users },
      { path: '/hr/attendance', label: 'Attendance', icon: Clock },
      { path: '/hr/leave', label: 'Leave Management', icon: Calendar },
      { path: '/hr/payroll', label: 'Payroll', icon: DollarSign },
      { path: '/hr/recruitment', label: 'Recruitment', icon: Users },
      { path: '/hr/performance', label: 'Performance', icon: TrendingUp },
      { path: '/hr/training', label: 'Training', icon: Briefcase }
    ]
  },
  { 
    id: 'projects',
    path: '/projects', 
    icon: FolderKanban, 
    label: 'Projects', 
    subMenus: [
      { path: '/projects', label: 'All Projects' },
      { path: '/projects/kanban', label: 'Kanban Board', icon: LayoutDashboard },
      { path: '/projects/timeline', label: 'Timeline', icon: Calendar },
      { path: '/projects/tasks', label: 'Tasks', icon: ClipboardList },
      { path: '/projects/gantt', label: 'Gantt Chart', icon: BarChart },
      { path: '/projects/time', label: 'Time Tracking', icon: Clock },
      { path: '/projects/resources', label: 'Resources', icon: Users },
      { path: '/projects/reports', label: 'Project Reports', icon: FileCheck }
    ]
  },
  { 
    id: 'documents',
    path: '/documents', 
    icon: FileText, 
    label: 'Documents', 
    subMenus: [
      { path: '/documents', label: 'All Documents' },
      { path: '/documents/shared', label: 'Shared with Me', icon: Users },
      { path: '/documents/recent', label: 'Recent', icon: Clock },
      { path: '/documents/starred', label: 'Starred', icon: Star },
      { path: '/documents/templates', label: 'Templates', icon: FileCheck },
      { path: '/documents/contracts', label: 'Contracts', icon: FileText },
      { path: '/documents/policies', label: 'Policies', icon: Briefcase }
    ]
  },
  { 
    id: 'analytics',
    path: '/analytics', 
    icon: PieChart, 
    label: 'Analytics', 
    badge: 'AI',
    subMenus: [
      { path: '/analytics', label: 'Overview' },
      { path: '/analytics/sales', label: 'Sales Analytics', icon: TrendingUp },
      { path: '/analytics/revenue', label: 'Revenue', icon: DollarSign },
      { path: '/analytics/forecasts', label: 'Forecasts', icon: Zap },
      { path: '/analytics/customers', label: 'Customers', icon: Users },
      { path: '/analytics/products', label: 'Products', icon: Package },
      { path: '/analytics/reports', label: 'Custom Reports', icon: FileText }
    ]
  },
  { 
    id: 'onboarding',
    path: '/onboarding', 
    icon: OnboardingIcon, 
    label: 'Onboarding', 
    badge: 'New',
    subMenus: [
      { path: '/onboarding', label: 'Client Onboarding', icon: UserPlus },
      { path: '/onboarding/templates', label: 'Document Templates', icon: FileSignature },
      { path: '/onboarding/tasks', label: 'Onboarding Tasks', icon: ClipboardCheck },
      { path: '/onboarding/portal', label: 'Portal Access', icon: Send }
    ]
  },
  { 
    id: 'workflows',
    path: '/workflows', 
    icon: Workflow, 
    label: 'Workflows', 
    subMenus: [
      { path: '/workflows', label: 'Automation' },
      { path: '/workflows/approvals', label: 'Approvals', icon: FileCheck },
      { path: '/workflows/webhooks', label: 'Webhooks', icon: Zap },
      { path: '/workflows/schedules', label: 'Schedules', icon: Calendar },
      { path: '/workflows/integrations', label: 'Integrations', icon: Database },
      { path: '/workflows/bulk', label: 'Bulk Operations', icon: Users }
    ]
  },
  { 
    id: 'reports',
    path: '/reports', 
    icon: BarChart3, 
    label: 'Reports', 
    subMenus: [
      { path: '/reports', label: 'All Reports' },
      { path: '/reports/sales', label: 'Sales Reports', icon: TrendingUp },
      { path: '/reports/financial', label: 'Financial', icon: DollarSign },
      { path: '/reports/inventory', label: 'Inventory', icon: Package },
      { path: '/reports/hr', label: 'HR Reports', icon: Users },
      { path: '/reports/custom', label: 'Custom Builder', icon: FileText },
      { path: '/reports/export', label: 'Export Data', icon: Download }
    ]
  },
  { 
    id: 'settings',
    path: '/settings', 
    icon: Settings, 
    label: 'Settings', 
    subMenus: [
      { path: '/settings', label: 'Company' },
      { path: '/settings/profile', label: 'Profile', icon: Users },
      { path: '/settings/security', label: 'Security', icon: Shield },
      { path: '/settings/notifications', label: 'Notifications', icon: Bell },
      { path: '/settings/integrations', label: 'Integrations', icon: Database },
      { path: '/settings/roles', label: 'Roles & Permissions', icon: UsersRound },
      { path: '/settings/workspace', label: 'Workspace', icon: Home },
      { path: '/settings/billing', label: 'Billing', icon: CreditCard },
      { path: '/settings/api', label: 'API Keys', icon: Zap },
      { path: '/settings/backup', label: 'Backup', icon: Database }
    ]
  }
];

export const Sidebar = ({ collapsed, onToggle, isMobileOpen, onMobileClose }) => {
  const location = useLocation();
  const { user, organization } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [expandedMenu, setExpandedMenu] = useState(() => {
    // Auto-expand menu when on sub-menu
    const currentPath = location.pathname;
    for (const menu of menuConfig) {
      if (menu.subMenus) {
        for (const sub of menu.subMenus) {
          if (currentPath.startsWith(sub.path)) {
            return menu.id;
          }
        }
      }
    }
    return null;
  });
  const sidebarRef = useRef(null);

  const toggleExpand = (menuId) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside 
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full z-40 flex flex-col ${
          isDark 
            ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-800' 
            : 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900'
        } ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
      <div className="h-16 flex items-center px-3 border-b border-slate-700/50">
        {!collapsed && (
          <div className="flex items-center gap-2 w-full">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white truncate">JenQ ERP</h1>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Premium</span>
                <div className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
              </div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30 mx-auto">
            <Sparkles size={20} className="text-white" />
          </div>
        )}
      </div>
      
      <nav className="flex-1 py-2 overflow-y-auto scrollbar-thin">
        {menuConfig.slice(0, collapsed ? 5 : menuConfig.length).map((menu) => {
          const Icon = menu.icon;
          const isActive = location.pathname === menu.path || location.pathname.startsWith(menu.path + '/');
          const isExpanded = expandedMenu === menu.id;
          
          return (
            <div 
              key={menu.id}
              className="relative mx-2 mb-0.5"
            >
              <Link
                to={menu.subMenus ? menu.subMenus[0].path : menu.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30' 
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <div className="relative">
                  <Icon size={18} />
                  {menu.badge && !collapsed && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-white">{menu.badge.charAt(0)}</span>
                    </div>
                  )}
                </div>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-sm font-medium truncate">{menu.label}</span>
                    {menu.subMenus && (
                      <div 
                        onClick={(e) => { e.preventDefault(); toggleExpand(menu.id); }}
                        className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                      >
                        <ChevronRight size={14} className="text-slate-400" />
                      </div>
                    )}
                  </>
                )}
              </Link>
              
              {!collapsed && menu.subMenus && isExpanded && (
                <div className="mt-1 ml-2 border-l border-slate-600/50 pl-2 space-y-0.5">
                  {menu.subMenus.map((subMenu, idx) => {
                    const SubIcon = subMenu.icon || Menu;
                    const isSubActive = location.pathname === subMenu.path;
                    
                    return (
                      <Link
                        key={idx}
                        to={subMenu.path}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                          isSubActive 
                            ? 'bg-primary-500/20 text-primary-400' 
                            : 'text-slate-300/90 hover:bg-slate-700/50 hover:text-white'
                        }`}
                      >
                        <SubIcon size={14} />
                        <span className="text-sm">{subMenu.label}</span>
                        {isSubActive && (
                          <ChevronRight size={12} className="ml-auto" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      
      <div className={`p-3 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-700/50'} space-y-2`}>
        {!collapsed && (
          <div className={`px-3 py-2 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-800'}`}>
            <div className="flex items-center justify-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-slate-400 capitalize">{organization?.license_type || 'starter'} Plan</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg transition-all ${
              isDark 
                ? 'bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700' 
                : 'bg-slate-700 text-slate-300 hover:text-white'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {!collapsed && <span className="text-xs">{isDark ? 'Light' : 'Dark'}</span>}
          </button>
          
          <button
            onClick={onToggle}
            className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg transition-all ${
              isDark 
                ? 'bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700' 
                : 'bg-slate-700 text-slate-300 hover:text-white'
            }`}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!collapsed && <span className="text-xs">Collapse</span>}
          </button>
        </div>
        
        {!collapsed && (
          <div className={`text-center py-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            <span className="text-[10px]">v1.0.0 • © {currentYear} JenQ ERP</span>
          </div>
        )}
      </div>
    </aside>
    </>
  );
};
export const Header = ({ onMobileMenuToggle, isMobileMenuOpen }) => {
  const navigate = useNavigate();
  const { user, organization, logout } = useAuth();
  const { isDark, toggleTheme, currency, setCurrencyCode, currencies } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const notifRef = useRef(null);
  const menuRef = useRef(null);
  const currencyRef = useRef(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New lead assigned', description: 'You have been assigned a new lead from Acme Corp', time: '2 min ago', read: false, type: 'lead', icon: Users },
    { id: 2, title: 'Invoice #1234 paid', description: 'Payment received for $15,000', time: '1 hour ago', read: false, type: 'payment', icon: DollarSign },
    { id: 3, title: 'Meeting reminder', description: 'Team meeting in 30 minutes', time: '3 hours ago', read: true, type: 'meeting', icon: Calendar },
    { id: 4, title: 'Deal closed', description: 'Won deal worth $50,000', time: '5 hours ago', read: false, type: 'deal', icon: Target },
    { id: 5, title: 'Low stock alert', description: 'Product "Widget Pro" is running low', time: '1 day ago', read: true, type: 'inventory', icon: AlertTriangle },
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setShowCurrency(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        e.stopPropagation();
        setSearchQuery('');
        setShowSearch(true);
        setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.select();
        }, 100);
      }
      if (e.key === 'Escape') {
        if (showSearch) {
          setShowSearch(false);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const searchResults = searchQuery.length > 0 ? [
    ...(searchQuery.toLowerCase().includes('dashboard') ? [{ type: 'page', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }] : []),
    ...(searchQuery.toLowerCase().includes('crm') || searchQuery.toLowerCase().includes('deal') || searchQuery.toLowerCase().includes('lead') ? [{ type: 'page', label: 'CRM', path: '/crm', icon: Target }] : []),
    ...(searchQuery.toLowerCase().includes('project') ? [{ type: 'page', label: 'Projects', path: '/projects', icon: FolderKanban }] : []),
    ...(searchQuery.toLowerCase().includes('inventory') || searchQuery.toLowerCase().includes('product') ? [{ type: 'page', label: 'Inventory', path: '/inventory', icon: Package }] : []),
    ...(searchQuery.toLowerCase().includes('accounting') || searchQuery.toLowerCase().includes('invoice') ? [{ type: 'page', label: 'Accounting', path: '/accounting', icon: Calculator }] : []),
    ...(searchQuery.toLowerCase().includes('hr') || searchQuery.toLowerCase().includes('employee') ? [{ type: 'page', label: 'HR', path: '/hr', icon: UsersRound }] : []),
    ...(searchQuery.toLowerCase().includes('report') ? [{ type: 'page', label: 'Reports', path: '/reports', icon: BarChart3 }] : []),
    ...(searchQuery.toLowerCase().includes('setting') ? [{ type: 'page', label: 'Settings', path: '/settings', icon: Settings }] : []),
    ...(searchQuery.toLowerCase().includes('pos') || searchQuery.toLowerCase().includes('sale') ? [{ type: 'page', label: 'POS', path: '/pos', icon: ShoppingCart }] : []),
    ...(searchQuery.toLowerCase().includes('analytics') || searchQuery.toLowerCase().includes('ai') ? [{ type: 'page', label: 'Analytics', path: '/analytics', icon: PieChart }] : []),
  ] : [
    { type: 'quick', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { type: 'quick', label: 'CRM', path: '/crm', icon: Target },
    { type: 'quick', label: 'Projects', path: '/projects', icon: FolderKanban },
    { type: 'quick', label: 'Inventory', path: '/inventory', icon: Package },
    { type: 'quick', label: 'HR', path: '/hr', icon: UsersRound },
    { type: 'quick', label: 'Reports', path: '/reports', icon: BarChart3 },
  ];

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleSearchSelect = (path) => {
    navigate(path);
    setSearchQuery('');
    setShowSearch(false);
  };

  return (
    <header className={`h-16 backdrop-blur-xl transition-colors duration-300 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 ${
      isDark 
        ? 'bg-slate-900/80 border-slate-800' 
        : 'bg-white/80 border-slate-200'
    } border-b`}>
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu size={24} />
        </button>
        <div className="relative w-48 md:w-80" ref={searchRef}>
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search anything... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${
              isDark 
                ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500' 
                : 'bg-slate-50 border-slate-200'
            } focus:outline-none focus:ring-2 focus:ring-primary-500`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className={`px-1.5 py-0.5 text-[10px] rounded border ${
              isDark ? 'bg-slate-700 border-slate-600 text-slate-400' : 'bg-slate-200 border-slate-300 text-slate-500'
            }`}>⌘</kbd>
            <kbd className={`px-1.5 py-0.5 text-[10px] rounded border ${
              isDark ? 'bg-slate-700 border-slate-600 text-slate-400' : 'bg-slate-200 border-slate-300 text-slate-500'
            }`}>K</kbd>
          </div>
          
          {showSearch && (
            <div className={`absolute top-full mt-2 w-full rounded-xl shadow-2xl border overflow-hidden z-50 ${
              isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="py-2">
                {searchResults.map((result, idx) => {
                  const ResultIcon = result.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSearchSelect(result.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                        isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <ResultIcon size={16} />
                      <span>{result.label}</span>
                      <span className={`text-xs ml-auto ${
                        isDark ? 'text-slate-500' : 'text-slate-400'
                      }`}>{result.type}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative" ref={currencyRef}>
          <button 
            onClick={() => setShowCurrency(!showCurrency)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all border ${
              isDark ? 'border-slate-700 hover:border-primary-500 bg-slate-800/50' : 'border-slate-200 hover:border-primary-300 bg-white'
            }`}
          >
            <span className="text-xl">{currencies.find(c => c.code === currency)?.flag}</span>
            <div className="hidden md:block">
              <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{currency}</p>
            </div>
          </button>
          
          {showCurrency && (
            <div className={`absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl border overflow-hidden z-50 animate-in zoom-in-95 duration-200 ${
              isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className={`px-5 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                    <span className="text-xl">{currencies.find(c => c.code === currency)?.flag}</span>
                  </div>
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Select Currency</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Current: {currency}</p>
                  </div>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto py-2">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => { setCurrencyCode(curr.code); setShowCurrency(false); }}
                    className={`w-full flex items-center gap-4 px-5 py-3 text-sm transition-all ${
                      currency === curr.code 
                        ? isDark ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/10 border-l-2 border-primary-500' : 'bg-primary-50 border-l-2 border-primary-500'
                        : isDark ? 'hover:bg-slate-800 border-l-2 border-transparent' : 'hover:bg-slate-50 border-l-2 border-transparent'
                    }`}
                  >
                    <span className="text-2xl">{curr.flag}</span>
                    <div className="flex-1 text-left">
                      <p className={`font-semibold ${currency === curr.code ? (isDark ? 'text-primary-400' : 'text-primary-600') : (isDark ? 'text-white' : 'text-slate-900')}`}>
                        {curr.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {curr.symbol} {curr.code}
                      </p>
                    </div>
                    {currency === curr.code && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-lg relative transition-colors ${
              isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
            }`}
          >
            <Bell size={18} className={isDark ? 'text-slate-300' : 'text-slate-600'} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-2xl border overflow-hidden z-50 ${
              isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <p className="text-sm font-medium">Notifications</p>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-primary-500 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => {
                  const NotifIcon = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer ${
                        !notif.read 
                          ? isDark ? 'bg-primary-500/10' : 'bg-primary-50'
                          : isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'
                      } ${isDark ? 'border-slate-700/50' : 'border-slate-100'} border-b`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        notif.type === 'lead' ? 'bg-blue-500/20 text-blue-500' :
                        notif.type === 'payment' ? 'bg-green-500/20 text-green-500' :
                        notif.type === 'deal' ? 'bg-emerald-500/20 text-emerald-500' :
                        notif.type === 'inventory' ? 'bg-amber-500/20 text-amber-500' :
                        'bg-slate-500/20 text-slate-500'
                      }`}>
                        <NotifIcon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>{notif.title}</p>
                        <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{notif.description}</p>
                        <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-primary-500 mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className={`px-4 py-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <button className="w-full text-center text-sm text-primary-500 hover:underline">
                  View all notifications
                </button>
              </div>
            </div>
          )}
</div>
        
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${
            isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
          }`}
        >
          {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
        </button>
        
        <div className="h-6 w-px bg-slate-300/30" />
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className={`flex items-center gap-3 p-1.5 rounded-lg transition-all ${
              isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 flex items-center justify-center text-white text-sm font-medium shadow-lg shadow-primary-500/30">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role || 'user'}</p>
            </div>
          </button>
          
          {showMenu && (
            <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-2xl border overflow-hidden animate-in fade-in slide-in-from-top-2 ${
              isDark 
                ? 'bg-slate-900 border-slate-700' 
                : 'bg-white border-slate-200'
            }`}>
              <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <p className="text-sm font-medium">{organization?.name || 'My Company'}</p>
                <p className="text-xs text-slate-500 capitalize">{organization?.license_type || 'starter'} Plan</p>
              </div>
              <div className="py-2">
                <Link 
                  to="/settings"
                  className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                    isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  onClick={() => setShowMenu(false)}
                >
                  <Settings size={16} />
                  Settings
                </Link>
                <Link 
                  to="/settings/profile"
                  className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                    isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  onClick={() => setShowMenu(false)}
                >
                  <Users size={16} />
                  Profile
                </Link>
                <Link 
                  to="/settings/billing"
                  className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                    isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  onClick={() => setShowMenu(false)}
                >
                  <CreditCard size={16} />
                  Billing
                </Link>
                <div className={`my-2 ${isDark ? 'border-slate-700' : 'border-slate-100'} border-t`} />
                <button 
                  onClick={logout}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors text-red-500 hover:bg-red-500/10`}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export const Layout = ({ children, sidebarCollapsed, onToggleSidebar }) => {
  const { isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const marginClass = sidebarCollapsed ? 'md:ml-16' : 'md:ml-64';
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-slate-950' : 'bg-slate-50'
    } bg-pattern`}>
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={onToggleSidebar} 
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className={`transition-all duration-300 ml-0 ${marginClass}`}>
        <Header 
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          isMobileMenuOpen={mobileMenuOpen}
        />
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};