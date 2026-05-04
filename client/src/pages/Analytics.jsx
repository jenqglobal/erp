import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TrendingUp, TrendingDown, Users, DollarSign, Package, Target, BarChart3, PieChart, LineChart, Activity, ArrowUpRight, ArrowDownRight, Calendar, Download, Filter } from 'lucide-react';
import { useTheme } from '../store/ThemeContext';
import { Layout } from '../components/Layout';

const AnalyticsPage = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const path = location.pathname;
  
  const getSection = () => {
    if (path.includes('/sales')) return 'sales';
    if (path.includes('/revenue')) return 'revenue';
    if (path.includes('/customers')) return 'customers';
    if (path.includes('/inventory')) return 'inventory';
    if (path.includes('/employees')) return 'employees';
    return 'overview';
  };
  
  const [activeSection, setActiveSection] = useState(getSection());
  
  useEffect(() => {
    const newSection = getSection();
    setActiveSection(newSection);
  }, [path]);
  
  const [timeRange, setTimeRange] = useState('7d');
  
  const salesData = [
    { period: 'Mon', revenue: 4200, orders: 42, avgOrder: 100 },
    { period: 'Tue', revenue: 5800, orders: 58, avgOrder: 100 },
    { period: 'Wed', revenue: 4900, orders: 49, avgOrder: 100 },
    { period: 'Thu', revenue: 7200, orders: 72, avgOrder: 100 },
    { period: 'Fri', revenue: 6100, orders: 61, avgOrder: 100 },
    { period: 'Sat', revenue: 8500, orders: 85, avgOrder: 100 },
    { period: 'Sun', revenue: 3200, orders: 32, avgOrder: 100 },
  ];
  
  const revenueBySource = [
    { source: 'Product Sales', amount: 125000, percentage: 62 },
    { source: 'Services', amount: 45000, percentage: 22 },
    { source: 'Subscriptions', amount: 22000, percentage: 11 },
    { source: 'Other', amount: 10000, percentage: 5 },
  ];
  
  const topProducts = [
    { name: 'Enterprise License', sales: 45, revenue: 45000, growth: 12.5 },
    { name: 'Pro Subscription', sales: 128, revenue: 25600, growth: 8.2 },
    { name: 'Support Package', sales: 89, revenue: 17800, growth: -2.1 },
    { name: 'Training Session', sales: 34, revenue: 10200, growth: 15.8 },
    { name: 'Consulting Hours', sales: 56, revenue: 8400, growth: 5.4 },
  ];
  
  const customerSegments = [
    { segment: 'Enterprise', count: 45, revenue: 185000, percentage: 45 },
    { segment: 'Business', count: 128, revenue: 95000, percentage: 24 },
    { segment: 'Startup', count: 234, revenue: 45000, percentage: 11 },
    { segment: 'Individual', count: 892, revenue: 28000, percentage: 7 },
  ];
  
  const regionalSales = [
    { region: 'North America', sales: 245000, percentage: 48, growth: 12.5 },
    { region: 'Europe', sales: 145000, percentage: 28, growth: 8.2 },
    { region: 'Asia Pacific', sales: 85000, percentage: 17, growth: 22.4 },
    { region: 'Latin America', sales: 25000, percentage: 5, growth: 5.1 },
    { region: 'Other', sales: 12000, percentage: 2, growth: -1.2 },
  ];
  
  const inventoryStats = [
    { category: 'Electronics', stock: 2450, value: 245000, turnover: 4.2 },
    { category: 'Furniture', stock: 890, value: 178000, turnover: 2.8 },
    { category: 'Software', stock: 5200, value: 52000, turnover: 12.5 },
    { category: 'Accessories', stock: 3200, value: 64000, turnover: 8.1 },
  ];
  
  const employeeMetrics = [
    { name: 'John Smith', deals: 12, revenue: 48000, conversion: 68 },
    { name: 'Sarah Johnson', deals: 8, revenue: 32000, conversion: 72 },
    { name: 'Mike Wilson', deals: 15, revenue: 62500, conversion: 58 },
    { name: 'Emily Brown', deals: 10, revenue: 41500, conversion: 65 },
    { name: 'Lisa Davis', deals: 7, revenue: 28500, conversion: 70 },
  ];
  
  const funnelData = [
    { stage: 'Visitors', count: 12500, rate: 100 },
    { stage: 'Sign Ups', count: 3200, rate: 25.6 },
    { stage: 'Activated', count: 1850, rate: 14.8 },
    { stage: 'Subscribers', count: 890, rate: 7.1 },
    { stage: 'Paid', count: 245, rate: 2.0 },
  ];
  
  const getTitle = () => {
    const titles = {
      overview: 'Analytics Overview',
      sales: 'Sales Analytics',
      revenue: 'Revenue Analytics',
      customers: 'Customer Analytics',
      inventory: 'Inventory Analytics',
      employees: 'Employee Analytics',
    };
    return titles[section] || 'Analytics';
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{getTitle()}</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Data-driven insights and trends</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`}>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <button className={`p-2 rounded-lg border ${isDark ? 'border-slate-600' : 'border-slate-300'}`}>
              <Download size={16} />
            </button>
          </div>
        </div>

        {section === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Revenue</span>
                  <DollarSign size={20} className="text-green-500" />
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>$282,000</p>
                <p className={`text-xs flex items-center gap-1 text-green-500`}>+12.5% <ArrowUpRight size={12} /></p>
              </div>
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Orders</span>
                  <Package size={20} className="text-primary-500" />
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>1,245</p>
                <p className={`text-xs flex items-center gap-1 text-green-500`}>+8.2% <ArrowUpRight size={12} /></p>
              </div>
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Conversion Rate</span>
                  <Target size={20} className="text-yellow-500" />
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>2.0%</p>
                <p className={`text-xs flex items-center gap-1 text-red-500`}>-0.3% <ArrowDownRight size={12} /></p>
              </div>
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Avg Order Value</span>
                  <BarChart3 size={20} className="text-blue-500" />
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>$226</p>
                <p className={`text-xs flex items-center gap-1 text-green-500`}>+4.1% <ArrowUpRight size={12} /></p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Sales Trend</h3>
                <div className="flex items-end justify-between h-48 gap-2">
                  {salesData.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gradient-to-t from-primary-500 to-accent-500 rounded-t transition-all hover:opacity-80"
                        style={{ height: `${(d.revenue / 8500) * 100}%` }} />
                      <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{d.period}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Revenue by Source</h3>
                <div className="space-y-4">
                  {revenueBySource.map((s, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{s.source}</span>
                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(s.amount)}</span>
                      </div>
                      <div className={`h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                        <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" style={{ width: `${s.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {section === 'sales' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Sales</span>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>$282,000</p>
              </div>
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Orders</span>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>1,245</p>
              </div>
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Avg Order Value</span>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>$226</p>
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
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Share</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {regionalSales.map((r, i) => (
                      <tr key={i} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                        <td className="px-4 py-3">{r.region}</td>
                        <td className="px-4 py-3 font-medium">{formatCurrency(r.sales)}</td>
                        <td className="px-4 py-3">{r.percentage}%</td>
                        <td className={`px-4 py-3 ${r.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {r.growth >= 0 ? '+' : ''}{r.growth}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {section === 'revenue' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Monthly Recurring</span>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>$22,000</p>
              </div>
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Annual Recurring</span>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>$264,000</p>
              </div>
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Churn Rate</span>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>2.4%</p>
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Revenue Breakdown</h3>
              <div className="space-y-4">
                {revenueBySource.map((s, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{s.source}</span>
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(s.amount)} ({s.percentage}%)</span>
                    </div>
                    <div className={`h-3 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                      <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" style={{ width: `${s.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {section === 'customers' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Customers</span>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>1,299</p>
              </div>
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>New This Month</span>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>145</p>
              </div>
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>LTV</span>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>$1,850</p>
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Customer Segments</h3>
              <div className="space-y-4">
                {customerSegments.map((s, i) => (
                  <div key={i} className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.segment}</span>
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{s.count} customers</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className={`h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                          <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" style={{ width: `${s.percentage}%` }} />
                        </div>
                      </div>
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(s.revenue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {section === 'inventory' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Products</span>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>47</p>
              </div>
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Stock</span>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>11,740</p>
              </div>
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Stock Value</span>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>$543K</p>
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Inventory by Category</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                    <tr>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Category</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Stock</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Value</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Turnover</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {inventoryStats.map((item, i) => (
                      <tr key={i} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                        <td className="px-4 py-3 font-medium">{item.category}</td>
                        <td className="px-4 py-3">{item.stock.toLocaleString()}</td>
                        <td className="px-4 py-3">{formatCurrency(item.value)}</td>
                        <td className="px-4 py-3">{item.turnover}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {section === 'employees' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Employees</span>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>8</p>
              </div>
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Deals Closed</span>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>52</p>
              </div>
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Avg Conversion</span>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>66.6%</p>
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Employee Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                    <tr>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Employee</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Deals</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Revenue</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Conversion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {employeeMetrics.map((emp, i) => (
                      <tr key={i} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                        <td className="px-4 py-3">{emp.name}</td>
                        <td className="px-4 py-3">{emp.deals}</td>
                        <td className="px-4 py-3">{formatCurrency(emp.revenue)}</td>
                        <td className={`px-4 py-3 ${emp.conversion >= 65 ? 'text-green-500' : emp.conversion >= 55 ? 'text-yellow-500' : 'text-red-500'}`}>
                          {emp.conversion}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AnalyticsPage;