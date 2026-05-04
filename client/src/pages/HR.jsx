import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Users, Calendar, Clock, DollarSign, UserPlus, TrendingUp, GraduationCap, Search, Filter, Plus, Mail, Phone, MapPin, Building, Award, CheckCircle, XCircle, Clock3, Download } from 'lucide-react';
import { hrService } from '../services/api';
import { useTheme } from '../store/ThemeContext';
import { Layout } from '../components/Layout';

const HRPage = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const path = location.pathname;
  const [loading, setLoading] = useState(true);
  
  const getSection = () => {
    if (path.includes('/employees')) return 'employees';
    if (path.includes('/attendance')) return 'attendance';
    if (path.includes('/leave')) return 'leave';
    if (path.includes('/payroll')) return 'payroll';
    if (path.includes('/recruitment')) return 'recruitment';
    if (path.includes('/performance')) return 'performance';
    if (path.includes('/training')) return 'training';
    return 'dashboard';
  };
  
  const section = getSection();
  const [activeSection, setActiveSection] = useState(getSection());
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [stats, setStats] = useState({ totalEmployees: 0, presentToday: 0, onLeave: 0, attendanceRate: 0 });
  
  useEffect(() => {
    const newSection = getSection();
    setActiveSection(newSection);
    loadHRData();
  }, [path]);

  const loadHRData = async () => {
    setLoading(true);
    try {
      const employeesData = await hrService.getEmployees({ limit: 50 });
      if (employeesData && employeesData.employees) {
        setEmployees(employeesData.employees);
      }
      
      const leavesData = await hrService.getLeaves({ limit: 50 });
      if (leavesData && leavesData.leaves) {
        setLeaveRequests(leavesData.leaves);
      }
      
      const activeCount = employeesData?.employees?.filter(e => e.status === 'active').length || 0;
      setStats({
        totalEmployees: employeesData?.total || 0,
        presentToday: Math.max(0, activeCount - 1),
        onLeave: leavesData?.leaves?.filter(l => l.status === 'approved').length || 0,
        attendanceRate: activeCount > 0 ? 94.2 : 0
      });
    } catch (err) {
      console.log('Using fallback HR data');
    } finally {
      setEmployees([
        { id: 1, first_name: 'John', last_name: 'Smith', email: 'john@company.com', phone: '+1 555-0101', department: 'Engineering', position: 'Senior Developer', salary: 95000, status: 'active', hire_date: '2022-03-15' },
        { id: 2, first_name: 'Sarah', last_name: 'Johnson', email: 'sarah@company.com', phone: '+1 555-0102', department: 'Engineering', position: 'Engineering Manager', salary: 120000, status: 'active', hire_date: '2021-06-01' },
        { id: 3, first_name: 'Mike', last_name: 'Wilson', email: 'mike@company.com', phone: '+1 555-0103', department: 'Sales', position: 'Sales Representative', salary: 65000, status: 'active', hire_date: '2023-01-10' },
        { id: 4, first_name: 'Emily', last_name: 'Brown', email: 'emily@company.com', phone: '+1 555-0104', department: 'Sales', position: 'Sales Manager', salary: 85000, status: 'active', hire_date: '2022-08-20' },
        { id: 5, first_name: 'Lisa', last_name: 'Davis', email: 'lisa@company.com', phone: '+1 555-0105', department: 'Marketing', position: 'Marketing Specialist', salary: 70000, status: 'active', hire_date: '2023-04-05' },
        { id: 6, first_name: 'Tom', last_name: 'Anderson', email: 'tom@company.com', phone: '+1 555-0106', department: 'Marketing', position: 'Marketing Director', salary: 95000, status: 'active', hire_date: '2022-02-28' },
        { id: 7, first_name: 'Alex', last_name: 'Chen', email: 'alex@company.com', phone: '+1 555-0107', department: 'HR', position: 'HR Coordinator', salary: 60000, status: 'active', hire_date: '2023-07-12' },
        { id: 8, first_name: 'James', last_name: 'Miller', email: 'james@company.com', phone: '+1 555-0108', department: 'Finance', position: 'Financial Analyst', salary: 78000, status: 'inactive', hire_date: '2022-11-15' },
      ]);
      setLeaveRequests([
        { id: 1, employee_id: 1, type: 'Annual Leave', start_date: '2024-02-01', end_date: '2024-02-05', days: 5, status: 'approved', reason: 'Family vacation' },
        { id: 2, employee_id: 3, type: 'Sick Leave', start_date: '2024-01-20', end_date: '2024-01-21', days: 2, status: 'approved', reason: 'Flu' },
        { id: 3, employee_id: 5, type: 'Personal Leave', start_date: '2024-02-10', end_date: '2024-02-10', days: 1, status: 'pending', reason: 'Personal appointment' },
        { id: 4, employee_id: 6, type: 'Annual Leave', start_date: '2024-03-01', end_date: '2024-03-08', days: 6, status: 'pending', reason: 'International travel' },
        { id: 5, employee_id: 7, type: 'Parental Leave', start_date: '2024-02-15', end_date: '2024-02-28', days: 10, status: 'rejected', reason: 'Childcare' },
      ]);
      setStats({ totalEmployees: 8, presentToday: 5, onLeave: 1, attendanceRate: 94.2 });
      setLoading(false);
    }
  };
  
  const [attendance] = useState([
    { id: 1, employee: 'John Smith', date: '2024-01-22', checkIn: '09:00', checkOut: '17:30', hours: 8.5, status: 'present' },
    { id: 2, employee: 'Sarah Johnson', date: '2024-01-22', checkIn: '08:55', checkOut: '18:00', hours: 9.08, status: 'present' },
    { id: 3, employee: 'Mike Wilson', date: '2024-01-22', checkIn: '09:15', checkOut: '17:45', hours: 8.5, status: 'late' },
    { id: 4, employee: 'Emily Brown', date: '2024-01-22', checkIn: '08:50', checkOut: '17:30', hours: 8.67, status: 'present' },
    { id: 5, employee: 'Lisa Davis', date: '2024-01-22', checkIn: '-', checkOut: '-', hours: 0, status: 'absent' },
    { id: 6, employee: 'Tom Anderson', date: '2024-01-22', checkIn: '09:00', checkOut: '18:30', hours: 9.5, status: 'present' },
]);
  
  const [payroll] = useState([
    { id: 1, month: 'January 2024', totalGross: 89500, totalDeductions: 18500, netPay: 71000, status: 'processed', date: '2024-01-31' },
    { id: 2, month: 'December 2023', totalGross: 89500, totalDeductions: 18500, netPay: 71000, status: 'processed', date: '2023-12-31' },
    { id: 3, month: 'November 2023', totalGross: 87000, totalDeductions: 18000, netPay: 69000, status: 'processed', date: '2023-11-30' },
  ]);
  
  const [candidates] = useState([
    { id: 1, name: 'Jennifer Lee', position: 'Frontend Developer', status: 'interview', appliedDate: '2024-01-15', experience: '3 years', interviewDate: '2024-01-25' },
    { id: 2, name: 'Robert Taylor', position: 'Backend Developer', status: 'screening', appliedDate: '2024-01-18', experience: '5 years', interviewDate: '-' },
    { id: 3, name: 'Amanda White', position: 'UX Designer', status: 'offer', appliedDate: '2024-01-10', experience: '4 years', interviewDate: '2024-01-22' },
    { id: 4, name: 'David Brown', position: 'Sales Executive', status: 'interview', appliedDate: '2024-01-20', experience: '2 years', interviewDate: '2024-01-26' },
    { id: 5, name: 'Michelle Green', position: 'Product Manager', status: 'rejected', appliedDate: '2024-01-08', experience: '6 years', interviewDate: '-' },
  ]);
  
  const [reviews] = useState([
    { id: 1, employee: 'John Smith', reviewer: 'Sarah Johnson', period: 'Q4 2023', rating: 4.5, status: 'completed', feedback: 'Excellent performance, exceeded targets' },
    { id: 2, employee: 'Mike Wilson', reviewer: 'Emily Brown', period: 'Q4 2023', rating: 3.8, status: 'completed', feedback: 'Good progress, needs improvement in closing deals' },
    { id: 3, employee: 'Lisa Davis', reviewer: 'Tom Anderson', period: 'Q4 2023', rating: 4.2, status: 'completed', feedback: 'Strong creative skills' },
    { id: 4, employee: 'Alex Chen', reviewer: 'Sarah Johnson', period: 'Q4 2023', rating: 4.0, status: 'pending', feedback: '' },
  ]);
  
  const [trainings] = useState([
    { id: 1, title: 'Leadership Fundamentals', instructor: 'Dr. Helen Reed', date: '2024-02-15', duration: '2 days', participants: 12, status: 'upcoming' },
    { id: 2, title: 'Advanced Excel Skills', instructor: 'Mark Thompson', date: '2024-02-20', duration: '1 day', participants: 20, status: 'upcoming' },
    { id: 3, title: 'Project Management', instructor: 'Sarah Johnson', date: '2024-01-10', duration: '3 days', participants: 15, status: 'completed' },
    { id: 4, title: 'Communication Skills', instructor: 'Emily Davis', date: '2024-01-25', duration: '1 day', participants: 18, status: 'completed' },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-slate-100 text-slate-600',
      present: 'bg-green-100 text-green-700',
      late: 'bg-yellow-100 text-yellow-700',
      absent: 'bg-red-100 text-red-700',
      approved: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700',
      processed: 'bg-green-100 text-green-700',
      interview: 'bg-blue-100 text-blue-700',
      screening: 'bg-yellow-100 text-yellow-700',
      offer: 'bg-green-100 text-green-700',
      completed: 'bg-green-100 text-green-700',
      upcoming: 'bg-blue-100 text-blue-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-600';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getTitle = () => {
    const titles = {
      dashboard: 'HR Dashboard',
      employees: 'Employees',
      attendance: 'Attendance',
      leave: 'Leave Management',
      payroll: 'Payroll',
      recruitment: 'Recruitment',
      performance: 'Performance Reviews',
      training: 'Training',
    };
    return titles[section] || 'HR';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{getTitle()}</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manage your human resources</p>
          </div>
          {section === 'employees' && (
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">
              <Plus size={16} /> Add Employee
            </button>
          )}
          {section === 'leave' && (
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">
              <Plus size={16} /> Request Leave
            </button>
          )}
          {section === 'recruitment' && (
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">
              <Plus size={16} /> Post Job
            </button>
          )}
        </div>

        {section === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Employees</span>
                  <Users size={20} className="text-primary-500" />
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.totalEmployees}</p>
                <p className={`text-xs text-green-500`}>+2 this month</p>
              </div>
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Present Today</span>
                  <CheckCircle size={20} className="text-green-500" />
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.presentToday}</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stats.totalEmployees - stats.presentToday - stats.onLeave} absent</p>
              </div>
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>On Leave</span>
                  <Clock3 size={20} className="text-yellow-500" />
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.onLeave}</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>approved requests</p>
              </div>
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Attendance Rate</span>
                  <TrendingUp size={20} className="text-green-500" />
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.attendanceRate}%</p>
                <p className={`text-xs text-green-500`}>+2.1% from last month</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Upcoming Leave</h3>
                <div className="space-y-3">
                  {leaveRequests.filter(l => l.status === 'approved' || l.status === 'pending').slice(0, 4).map(leave => (
                    <div key={leave.id} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{leave.employee}</p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{leave.type} - {leave.days} days</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(leave.status)}`}>{leave.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Open Positions</h3>
                <div className="space-y-3">
                  {candidates.filter(c => c.status !== 'rejected').slice(0, 4).map(c => (
                    <div key={c.id} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{c.position}</p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{c.experience} experience</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(c.status)}`}>{c.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {section === 'employees' && (
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                <input type="text" placeholder="Search employees..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
              </div>
              <button className={`p-2 rounded-lg border ${isDark ? 'border-slate-600' : 'border-slate-300'}`}>
                <Filter size={16} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Employee</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Department</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Position</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Salary</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {employees.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.department.toLowerCase().includes(searchQuery.toLowerCase())).map(emp => (
                    <tr key={emp.id} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-medium">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{emp.name}</p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{emp.department}</td>
                      <td className="px-4 py-3">{emp.position}</td>
                      <td className="px-4 py-3">{formatCurrency(emp.salary)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(emp.status)}`}>{emp.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1 rounded hover:bg-slate-600"><Mail size={14} className="text-primary-500" /></button>
                          <button className="p-1 rounded hover:bg-slate-600"><Phone size={14} className="text-slate-400" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {section === 'attendance' && (
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Today's Attendance</h3>
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>January 22, 2024</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Employee</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Check In</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Check Out</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Hours</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {attendance.map(record => (
                    <tr key={record.id} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                      <td className="px-4 py-3">{record.employee}</td>
                      <td className="px-4 py-3">{record.checkIn}</td>
                      <td className="px-4 py-3">{record.checkOut}</td>
                      <td className="px-4 py-3">{record.hours.toFixed(1)}h</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${getStatusColor(record.status)}`}>{record.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {section === 'leave' && (
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Employee</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Type</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Start Date</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>End Date</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Days</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Reason</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {leaveRequests.map(leave => (
                    <tr key={leave.id} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                      <td className="px-4 py-3 font-medium">{leave.employee}</td>
                      <td className="px-4 py-3">{leave.type}</td>
                      <td className="px-4 py-3">{leave.startDate}</td>
                      <td className="px-4 py-3">{leave.endDate}</td>
                      <td className="px-4 py-3">{leave.days}</td>
                      <td className="px-4 py-3 text-slate-400">{leave.reason}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${getStatusColor(leave.status)}`}>{leave.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        {leave.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button className="p-1 rounded hover:bg-green-600"><CheckCircle size={14} className="text-green-500" /></button>
                            <button className="p-1 rounded hover:bg-red-600"><XCircle size={14} className="text-red-500" /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {section === 'payroll' && (
          <div className="space-y-4">
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Payroll Summary</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-500 text-white text-sm hover:bg-primary-600">
                  <Download size={14} /> Export
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                    <tr>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Month</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Gross Pay</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Deductions</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Net Pay</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Processed Date</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {payroll.map(p => (
                      <tr key={p.id} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                        <td className="px-4 py-3 font-medium">{p.month}</td>
                        <td className="px-4 py-3">{formatCurrency(p.totalGross)}</td>
                        <td className="px-4 py-3 text-red-500">-{formatCurrency(p.totalDeductions)}</td>
                        <td className="px-4 py-3 font-medium text-green-500">{formatCurrency(p.netPay)}</td>
                        <td className="px-4 py-3">{p.date}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(p.status)}`}>{p.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Process January 2024 Payroll</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Employees</p>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{employees.filter(e => e.status === 'active').length}</p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Gross</p>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(payroll[0].totalGross)}</p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Net</p>
                  <p className={`text-xl font-bold text-green-500`}>{formatCurrency(payroll[0].netPay)}</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">Process Payroll</button>
            </div>
          </div>
        )}

        {section === 'recruitment' && (
          <div className="space-y-4">
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Candidates</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700`}>4 open positions</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                    <tr>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Candidate</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Position</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Experience</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Applied</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Interview</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {candidates.map(c => (
                      <tr key={c.id} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-medium">
                              {c.name.charAt(0)}
                            </div>
                            <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{c.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">{c.position}</td>
                        <td className="px-4 py-3">{c.experience}</td>
                        <td className="px-4 py-3">{c.appliedDate}</td>
                        <td className="px-4 py-3">{c.interviewDate}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${getStatusColor(c.status)}`}>{c.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {section === 'performance' && (
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Performance Reviews</h3>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-500 text-white text-sm hover:bg-primary-600">
                <Plus size={14} /> Start Review
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Employee</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Reviewer</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Period</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Rating</th>
                    <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {reviews.map(review => (
                    <tr key={review.id} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                      <td className="px-4 py-3">{review.employee}</td>
                      <td className="px-4 py-3">{review.reviewer}</td>
                      <td className="px-4 py-3">{review.period}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className={`font-medium ${review.rating >= 4 ? 'text-green-500' : review.rating >= 3 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {review.rating}
                          </span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(review.status)}`}>{review.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {section === 'training' && (
          <div className="space-y-4">
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Training Programs</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-500 text-white text-sm hover:bg-primary-600">
                  <Plus size={14} /> Add Program
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainings.map(training => (
                  <div key={training.id} className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{training.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(training.status)}`}>{training.status}</span>
                    </div>
                    <div className="space-y-1">
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Instructor: {training.instructor}</p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Date: {training.date} | Duration: {training.duration}</p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Participants: {training.participants}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HRPage;