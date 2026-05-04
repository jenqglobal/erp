import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FileText, Download, Calendar, Filter, BarChart3, PieChart, TrendingUp, DollarSign, Users, Package, ShoppingCart, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTheme } from '../store/ThemeContext';
import { Layout } from '../components/Layout';

const ReportsPage = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const path = location.pathname;
  
  const getSection = () => {
    if (path.includes('/sales')) return 'sales';
    if (path.includes('/financial')) return 'financial';
    if (path.includes('/inventory')) return 'inventory';
    if (path.includes('/hr-reports')) return 'hr-reports';
    if (path.includes('/crm-reports')) return 'crm-reports';
    if (path.includes('/analytics')) return 'analytics';
    return 'overview';
  };
  
  const [activeSection, setActiveSection] = useState(getSection());
  
  useEffect(() => {
    const newSection = getSection();
    setActiveSection(newSection);
  }, [path]);
  const [dateRange, setDateRange] = useState('30d');
  
  const salesData = [
    { metric: 'Total Sales', value: '$282,000', change: '+12.5%', trend: 'up' },
    { metric: 'Orders', value: '1,245', change: '+8.2%', trend: 'up' },
    { metric: 'Avg Order Value', value: '$226', change: '+4.1%', trend: 'up' },
    { metric: 'Conversion Rate', value: '2.0%', change: '-0.3%', trend: 'down' },
  ];
  
  const financialData = [
    { category: 'Product Revenue', amount: 125000, percentage: 62 },
    { category: 'Service Revenue', amount: 45000, percentage: 22 },
    { category: 'Subscription', amount: 22000, percentage: 11 },
    { category: 'Other', amount: 10000, percentage: 5 },
  ];
  
  const topProducts = [
    { name: 'Enterprise License', sales: 45, revenue: 45000, growth: 12.5 },
    { name: 'Pro Subscription', sales: 128, revenue: 25600, growth: 8.2 },
    { name: 'Support Package', sales: 89, revenue: 17800, growth: -2.1 },
    { name: 'Training Session', sales: 34, revenue: 10200, growth: 15.8 },
  ];
  
  const regionalData = [
    { region: 'North America', sales: 145000, growth: 12.5 },
    { region: 'Europe', sales: 85000, growth: 8.2 },
    { region: 'Asia Pacific', sales: 32000, growth: 22.4 },
    { region: 'Latin America', sales: 12000, growth: 5.1 },
  ];
  
  const employeePerformance = [
    { name: 'John Smith', deals: 12, revenue: 48000, target: 40000, achieve: 120 },
    { name: 'Sarah Johnson', deals: 8, revenue: 32000, target: 30000, achieve: 107 },
    { name: 'Mike Wilson', deals: 15, revenue: 62500, target: 50000, achieve: 125 },
    { name: 'Emily Brown', deals: 10, revenue: 41500, target: 40000, achieve: 104 },
  ];
  
  const activityLog = [
    { action: 'Invoice created', user: 'System', details: 'INV-004 for GlobalTech', time: '2 hours ago' },
    { action: 'Payment received', user: 'Sarah Johnson', details: '$15,000 from Acme Corp', time: '5 hours ago' },
    { action: 'Lead converted', user: 'Mike Wilson', details: 'TechStart Inc → Customer', time: '1 day ago' },
    { action: 'Employee added', user: 'HR Admin', details: 'Lisa Davis - Marketing', time: '2 days ago' },
  ];
  
  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const getTitle = () => {
    const titles = {
      overview: 'Reports Overview',
      sales: 'Sales Reports',
      financial: 'Financial Reports',
      inventory: 'Inventory Reports',
      'hr-reports': 'HR Reports',
      'crm-reports': 'CRM Reports',
      analytics: 'Analytics Reports',
    };
    return titles[section] || 'Reports';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{getTitle()}</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Generate and download reports</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`}>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${isDark ? 'border-slate-600 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-50'}`}>
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {section === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {salesData.map((item, i) => (
                <div key={i} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.metric}</span>
                    {item.trend === 'up' ? <ArrowUpRight size={16} className="text-green-500" /> : <ArrowDownRight size={16} className="text-red-500" />}
                  </div>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.value}</p>
                  <p className={`text-xs ${item.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{item.change}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Revenue Breakdown</h3>
                <div className="space-y-4">
                  {financialData.map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.category}</span>
                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(item.amount)} ({item.percentage}%)</span>
                      </div>
                      <div className={`h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                        <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent Activity</h3>
                <div className="space-y-4">
                  {activityLog.map((log, i) => (
                    <div key={i} className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{log.action}</p>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{log.details}</p>
                        </div>
                        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {section === 'sales' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {salesData.map((item, i) => (
                <div key={i} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.metric}</span>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.value}</p>
                  <p className={`text-xs ${item.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{item.change}</p>
                </div>
              ))}
            </div>

            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Top Products</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                    <tr>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Product</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Units Sold</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Revenue</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {topProducts.map((p, i) => (
                      <tr key={i} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                        <td className="px-4 py-3 font-medium">{p.name}</td>
                        <td className="px-4 py-3">{p.sales}</td>
                        <td className="px-4 py-3">{formatCurrency(p.revenue)}</td>
                        <td className={`px-4 py-3 ${p.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {p.growth >= 0 ? '+' : ''}{p.growth}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Regional Sales</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                    <tr>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Region</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Sales</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {regionalData.map((r, i) => (
                      <tr key={i} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                        <td className="px-4 py-3">{r.region}</td>
                        <td className="px-4 py-3 font-medium">{formatCurrency(r.sales)}</td>
                        <td className={`px-4 py-3 ${r.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {r.growth >= 0 ? '+' : ''}{r.growth}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {section === 'financial' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Income Statement Summary</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Revenue</p>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>$282,000</p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Expenses</p>
                  <p className={`text-xl font-bold text-red-500`}>$85,000</p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Net Profit</p>
                  <p className="text-xl font-bold text-green-500">$197,000</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                    <tr>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Category</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Amount</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>% of Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {financialData.map((item, i) => (
                      <tr key={i} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                        <td className="px-4 py-3">{item.category}</td>
                        <td className="px-4 py-3">{formatCurrency(item.amount)}</td>
                        <td className="px-4 py-3">{item.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {section === 'inventory' && (
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Inventory Report</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Product</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Stock</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Value</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {[
                    { name: 'Enterprise License', stock: 245, value: 245000, status: 'In Stock' },
                    { name: 'Pro Subscription', stock: 1280, value: 256000, status: 'In Stock' },
                    { name: 'Support Package', stock: 89, value: 17800, status: 'Low Stock' },
                    { name: 'Training Session', stock: 0, value: 0, status: 'Out of Stock' },
                  ].map((item, i) => (
                    <tr key={i} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3">{item.stock}</td>
                      <td className="px-4 py-3">{formatCurrency(item.value)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${item.status === 'In Stock' ? 'bg-green-100 text-green-700' : item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {section === 'hr-reports' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Employee Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                    <tr>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Employee</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Deals</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Revenue</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Target</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Achievement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {employeePerformance.map((emp, i) => (
                      <tr key={i} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                        <td className="px-4 py-3">{emp.name}</td>
                        <td className="px-4 py-3">{emp.deals}</td>
                        <td className="px-4 py-3">{formatCurrency(emp.revenue)}</td>
                        <td className="px-4 py-3">{formatCurrency(emp.target)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${emp.achieve >= 100 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {emp.achieve}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {section === 'crm-reports' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>CRM Metrics</h3>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Leads</p>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>245</p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Opportunities</p>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>89</p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Customers</p>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>156</p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Conversion</p>
                  <p className="text-xl font-bold text-green-500">18.2%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {section === 'analytics' && (
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Traffic & Engagement</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Page Views</p>
                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>45,230</p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Unique Visitors</p>
                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>12,450</p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Avg Session</p>
                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>4:32</p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Bounce Rate</p>
                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>32.5%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReportsPage;