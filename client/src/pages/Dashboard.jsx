import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, Package, DollarSign, ShoppingCart, TrendingUp, Clock, Zap, Target, Activity, Award, Star, ArrowUp, ArrowDown, Download, Filter, RefreshCw, Calendar, BarChart3 } from 'lucide-react';
import { StatCard, Card } from '../components/UI';
import { Layout } from '../components/Layout';
import { useTheme } from '../store/ThemeContext';
import { dashboardService } from '../services/api';

const Dashboard = () => {
  const { isDark, formatCurrency } = useTheme();
  const location = useLocation();
  const path = location.pathname;
  
  const getSection = () => {
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/customize')) return 'customize';
    return 'overview';
  };
  
  const [section, setSection] = useState(getSection());
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [widgetToggles, setWidgetToggles] = useState({
    revenueChart: true,
    topDeals: true,
    recentActivity: true,
    pipelineOverview: true,
    teamPerformance: false,
    goalProgress: false,
    taskSummary: false,
    notifications: true,
  });
  const [stats, setStats] = useState({
    revenue: 0,
    revenueChange: 0,
    pendingRevenue: 0,
    pendingChange: 0,
    orders: 0,
    ordersChange: 0,
    contacts: 0,
    contactsChange: 0,
    leads: 0,
    leadsChange: 0,
    deals: 0,
    dealsWon: 0,
    dealsValue: 0,
    winRate: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setSection(getSection());
  }, [path]);

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, activityData, revenueChartData, salesChartData] = await Promise.all([
        dashboardService.getStats().catch(() => null),
        dashboardService.getActivity().catch(() => null),
        dashboardService.getRevenueChart().catch(() => null),
        dashboardService.getSalesChart().catch(() => null)
      ]);
      
      if (statsData) {
        setStats({
          revenue: statsData.revenue || 0,
          revenueChange: 12.5,
          pendingRevenue: statsData.pending_revenue || 0,
          pendingChange: 5.2,
          orders: statsData.orders || 0,
          ordersChange: 18.3,
          contacts: statsData.contacts || 0,
          contactsChange: 8.7,
          leads: statsData.contacts || 0,
          leadsChange: 23.1,
          deals: statsData.deals || 0,
          dealsWon: 0,
          dealsValue: 0,
          winRate: 33
        });
      }
      
      if (activityData && activityData.activities) {
        const formattedActivities = activityData.activities.map((a, idx) => ({
          id: a.id || idx,
          action: a.action || 'Activity',
          detail: a.details || '',
          time: formatTimeAgo(a.created_at),
          type: a.module || 'default'
        }));
        setActivities(formattedActivities);
      }
      
      if (revenueChartData && revenueChartData.monthly) {
        const formattedRevenue = revenueChartData.monthly.map(m => ({
          month: m.month,
          revenue: m.revenue || 0,
          expenses: Math.floor((m.revenue || 0) * 0.6)
        }));
        setRevenueData(formattedRevenue);
      }
      
      if (salesChartData && salesChartData.byCategory) {
        setCategoryData(salesChartData.byCategory);
      }
      
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const toggleWidget = (widget) => {
    setWidgetToggles(prev => ({
      ...prev,
      [widget]: !prev[widget]
    }));
  };

  const getDefaultRevenueData = () => [
    { month: 'Jan', revenue: 45000, expenses: 28000 },
    { month: 'Feb', revenue: 52000, expenses: 31000 },
    { month: 'Mar', revenue: 48000, expenses: 29000 },
    { month: 'Apr', revenue: 61000, expenses: 35000 },
    { month: 'May', revenue: 55000, expenses: 32000 },
    { month: 'Jun', revenue: 67000, expenses: 38000 },
    { month: 'Jul', revenue: 72000, expenses: 41000 },
    { month: 'Aug', revenue: 68000, expenses: 39000 },
    { month: 'Sep', revenue: 81000, expenses: 45000 },
    { month: 'Oct', revenue: 78000, expenses: 42000 },
    { month: 'Nov', revenue: 92000, expenses: 50000 },
    { month: 'Dec', revenue: 98000, expenses: 52000 },
  ];

  const getDefaultCategoryData = () => [
    { name: 'Software', value: 45 },
    { name: 'Services', value: 30 },
    { name: 'Hardware', value: 15 },
    { name: 'Other', value: 10 },
  ];

  const getDefaultActivities = () => [
    { id: 1, action: 'System ready', detail: 'Dashboard loaded', time: 'Just now', type: 'default' },
  ];

  const topDeals = [
    { id: 1, company: 'Acme Corp', value: 125000, stage: 'negotiation', probability: 75 },
    { id: 2, company: 'Tech Solutions', value: 85000, stage: 'proposal', probability: 60 },
    { id: 3, company: 'Global Inc', value: 62000, stage: 'qualified', probability: 45 },
    { id: 4, company: 'Startup Hub', value: 45000, stage: 'prospecting', probability: 25 },
  ];

  const kpiCards = [
    { title: 'Total Revenue', value: formatCurrency(stats.revenue), change: stats.revenueChange, icon: DollarSign, color: 'primary' },
    { title: 'Pending Revenue', value: formatCurrency(stats.pendingRevenue), change: stats.pendingChange, icon: Clock, color: 'warning' },
    { title: 'Total Orders', value: stats.orders, change: stats.ordersChange, icon: ShoppingCart, color: 'accent' },
    { title: 'Active Leads', value: stats.leads, change: stats.leadsChange, icon: Users, color: 'platinum' },
  ];

  const getSectionTitle = () => section === 'overview' ? 'Dashboard Overview' : section === 'analytics' ? 'Analytics & Insights' : 'Customize Dashboard';
  const getSectionSubtitle = () => {
    if (section === 'overview') return 'Welcome back! Here\'s your business at a glance.';
    if (section === 'analytics') return 'Deep dive into your business metrics and trends.';
    return 'Customize your dashboard widgets and layout.';
  };

  const chartData = revenueData.length > 0 ? revenueData : getDefaultRevenueData();
  const catData = categoryData.length > 0 ? categoryData : getDefaultCategoryData();
  const recentActivities = activities.length > 0 ? activities : getDefaultActivities();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{getSectionTitle()}</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{getSectionSubtitle()}</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button 
              onClick={loadDashboardData}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-white'}`}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {loading && (
          <div className={`p-8 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Loading dashboard data...
          </div>
        )}

        {error && !loading && (
          <div className={`p-4 rounded-lg bg-red-100 text-red-700 border border-red-300`}>
            Error loading data: {error}
          </div>
        )}

        {!loading && !error && section === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpiCards.map((kpi, idx) => (
                <div key={idx} className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{kpi.title}</p>
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${
                      kpi.color === 'primary' ? 'from-primary-500 to-primary-600' :
                      kpi.color === 'accent' ? 'from-accent-500 to-accent-600' :
                      kpi.color === 'warning' ? 'from-amber-500 to-amber-600' :
                      'from-premium-platinum to-indigo-600'
                    }`}>
                      <kpi.icon size={16} className="text-white" />
                    </div>
                  </div>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {kpi.change > 0 ? <ArrowUp size={14} className="text-accent-500" /> : <ArrowDown size={14} className="text-red-500" />}
                    <span className={`text-xs ${kpi.change > 0 ? 'text-accent-500' : 'text-red-500'}`}>{Math.abs(kpi.change)}%</span>
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>vs last period</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`lg:col-span-2 p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Revenue & Expenses</h3>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-primary-500" />
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Revenue</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Expenses</span>
                    </div>
                  </div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                      <XAxis dataKey="month" stroke={isDark ? '#64748b' : '#64748b'} fontSize={12} />
                      <YAxis stroke={isDark ? '#64748b' : '#64748b'} fontSize={12} tickFormatter={v => `$${v/1000}k`} />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value)]}
                        contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', borderRadius: '8px' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                      <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Top Deals</h3>
                <div className="space-y-3">
                  {topDeals.map(deal => (
                    <div key={deal.id} className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{deal.company}</span>
                        <span className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{formatCurrency(deal.value)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          deal.stage === 'negotiation' ? 'bg-purple-100 text-purple-700' :
                          deal.stage === 'proposal' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>{deal.stage}</span>
                        <span className="text-xs text-slate-500">{deal.probability}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent Activity</h3>
              <div className="space-y-3">
                {recentActivities.map(activity => (
                  <div key={activity.id} className={`flex items-center gap-4 p-3 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'lead' ? 'bg-primary-100 text-primary-600' :
                      activity.type === 'deal' ? 'bg-accent-100 text-accent-600' :
                      activity.type === 'payment' ? 'bg-green-100 text-green-600' :
                      activity.type === 'hr' ? 'bg-purple-100 text-purple-600' :
                      activity.type === 'crm' ? 'bg-blue-100 text-blue-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {activity.type === 'lead' && <Users size={18} />}
                      {activity.type === 'deal' && <Target size={18} />}
                      {activity.type === 'payment' && <DollarSign size={18} />}
                      {activity.type === 'hr' && <Activity size={18} />}
                      {activity.type === 'crm' && <Activity size={18} />}
                      {activity.type === 'project' && <Package size={18} />}
                      {activity.type === 'default' && <Activity size={18} />}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{activity.action}</p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{activity.detail}</p>
                    </div>
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {!loading && section === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Sales Performance</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                    <XAxis dataKey="month" stroke={isDark ? '#64748b' : '#64748b'} fontSize={12} />
                    <YAxis stroke={isDark ? '#64748b' : '#64748b'} fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', borderRadius: '8px' }} />
                    <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Revenue by Category</h3>
              <div className="h-72 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={catData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                    <XAxis type="number" stroke={isDark ? '#64748b' : '#64748b'} fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke={isDark ? '#64748b' : '#64748b'} fontSize={12} width={80} />
                    <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', borderRadius: '8px' }} />
                    <Bar dataKey="value" fill="#2563eb" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Key Metrics</h3>
              <div className="space-y-4">
                {[
                  { label: 'Conversion Rate', value: '12.5%', change: '+2.3%', good: true },
                  { label: 'Avg Deal Size', value: '$53,000', change: '+8.5%', good: true },
                  { label: 'Sales Cycle', value: '28 days', change: '-3 days', good: true },
                  { label: 'Customer ACV', value: '$12,400', change: '+15.2%', good: true },
                ].map((metric, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{metric.value}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${metric.good ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Forecast vs Actual</h3>
              <div className="space-y-4">
                {[
                  { label: 'Q1 Target', target: 150000, actual: 145000 },
                  { label: 'Q2 Target', target: 180000, actual: 167000 },
                  { label: 'Q3 Target', target: 220000, actual: 0 },
                  { label: 'Q4 Target', target: 280000, actual: 0 },
                ].map((q, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{q.label}</span>
                      <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        ${q.actual.toLocaleString()} / ${q.target.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                        style={{ width: `${Math.min((q.actual / q.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && section === 'customize' && (
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Dashboard Widgets</h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-4`}>
              Toggle widgets on or off to customize your dashboard view.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Revenue Chart', key: 'revenueChart' },
                { name: 'Top Deals', key: 'topDeals' },
                { name: 'Recent Activity', key: 'recentActivity' },
                { name: 'Pipeline Overview', key: 'pipelineOverview' },
                { name: 'Team Performance', key: 'teamPerformance' },
                { name: 'Goal Progress', key: 'goalProgress' },
                { name: 'Task Summary', key: 'taskSummary' },
                { name: 'Notifications', key: 'notifications' },
              ].map((widget, idx) => (
                <div key={idx} className={`flex items-center justify-between p-4 rounded-lg border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                  <span className={isDark ? 'text-white' : 'text-slate-700'}>{widget.name}</span>
                  <button 
                    onClick={() => toggleWidget(widget.key)}
                    className={`w-12 h-6 rounded-full transition-colors ${widgetToggles[widget.key] ? 'bg-primary-500' : 'bg-slate-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${widgetToggles[widget.key] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;