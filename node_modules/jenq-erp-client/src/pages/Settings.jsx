import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Settings, Users, Shield, Bell, Database, CreditCard, Zap, Home, Building, Key, Save, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { useTheme } from '../store/ThemeContext';
import { Layout } from '../components/Layout';

const SettingsPage = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const path = location.pathname;
  
  const getSection = () => {
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/security')) return 'security';
    if (path.includes('/notifications')) return 'notifications';
    if (path.includes('/integrations')) return 'integrations';
    if (path.includes('/roles')) return 'roles';
    if (path.includes('/workspace')) return 'workspace';
    if (path.includes('/billing')) return 'billing';
    if (path.includes('/api')) return 'api';
    if (path.includes('/backup')) return 'backup';
    return 'company';
  };
  
  const section = getSection();
  
  useEffect(() => {
    // Reload section-specific data when path changes
  }, [path]);
  
  const [company, setCompany] = useState({
    name: 'My Company Inc.',
    email: 'contact@mycompany.com',
    phone: '+1 555-0100',
    address: '123 Business Street, Suite 100',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'United States',
    industry: 'Technology',
    website: 'https://mycompany.com'
  });
  
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@mycompany.com', role: 'Super Admin', status: 'active', lastActive: '2 min ago' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@mycompany.com', role: 'Admin', status: 'active', lastActive: '1 hour ago' },
    { id: 3, name: 'Mike Wilson', email: 'mike@mycompany.com', role: 'Manager', status: 'active', lastActive: '3 hours ago' },
    { id: 4, name: 'Emily Brown', email: 'emily@mycompany.com', role: 'Employee', status: 'inactive', lastActive: '2 days ago' },
  ]);
  
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Engineering', head: 'Mike Wilson', employees: 12 },
    { id: 2, name: 'Sales', head: 'Sarah Johnson', employees: 8 },
    { id: 3, name: 'Marketing', head: 'Emily Brown', employees: 5 },
    { id: 4, name: 'HR', head: 'Admin User', employees: 2 },
  ]);
  
  const [roles, setRoles] = useState([
    { id: 1, name: 'Super Admin', users: 1, permissions: ['all'] },
    { id: 2, name: 'Admin', users: 2, permissions: ['manage_users', 'manage_settings', 'view_reports'] },
    { id: 3, name: 'Manager', users: 5, permissions: ['manage_team', 'view_reports', 'edit_records'] },
    { id: 4, name: 'Employee', users: 15, permissions: ['view_own', 'edit_own'] },
  ]);
  
  const [integrations, setIntegrations] = useState([
    { id: 1, name: 'Slack', status: 'connected', icon: '💬' },
    { id: 2, name: 'Google Workspace', status: 'connected', icon: '📧' },
    { id: 3, name: 'Stripe', status: 'disconnected', icon: '💳' },
    { id: 4, name: 'Zapier', status: 'disconnected', icon: '⚡' },
    { id: 5, name: 'Mailchimp', status: 'connected', icon: '📰' },
    { id: 6, name: 'Twilio', status: 'disconnected', icon: '📱' },
  ]);
  
  const getTitle = () => {
    const titles = {
      company: 'Company Settings',
      profile: 'Profile Settings',
      security: 'Security Settings',
      notifications: 'Notifications',
      integrations: 'Integrations',
      roles: 'Roles & Permissions',
      workspace: 'Workspace Settings',
      billing: 'Billing & Subscription',
      api: 'API Keys',
      backup: 'Backup & Export'
    };
    return titles[section] || 'Settings';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{getTitle()}</h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage your {section === 'company' ? 'organization' : section} settings
          </p>
        </div>

        {section === 'company' && (
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Company Name</label>
                <input type="text" value={company.name} onChange={(e) => setCompany({...company, name: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Business Email</label>
                <input type="email" value={company.email} onChange={(e) => setCompany({...company, email: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Phone</label>
                <input type="text" value={company.phone} onChange={(e) => setCompany({...company, phone: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Industry</label>
                <select value={company.industry} onChange={(e) => setCompany({...company, industry: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`}>
                  <option>Technology</option>
                  <option>Healthcare</option>
                  <option>Finance</option>
                  <option>Retail</option>
                  <option>Manufacturing</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Address</label>
                <input type="text" value={company.address} onChange={(e) => setCompany({...company, address: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>City</label>
                <input type="text" value={company.city} onChange={(e) => setCompany({...company, city: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Website</label>
                <input type="text" value={company.website} onChange={(e) => setCompany({...company, website: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
              </div>
            </div>
            <button className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">
              <Save size={16} /> Save Changes
            </button>
          </div>
        )}

        {section === 'profile' && (
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Profile Information</h3>
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold">
                A
              </div>
              <div>
                <button className="text-sm text-primary-500 hover:text-primary-600">Change Avatar</button>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>JPG, PNG or GIF. Max 2MB</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>First Name</label>
                <input type="text" defaultValue="Admin"
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Last Name</label>
                <input type="text" defaultValue="User"
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email</label>
                <input type="email" defaultValue="admin@mycompany.com"
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Phone</label>
                <input type="text" defaultValue="+1 555-0100"
                  className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
              </div>
            </div>
            <button className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">
              <Save size={16} /> Save Profile
            </button>
          </div>
        )}

        {section === 'roles' && (
          <div className="space-y-4">
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Roles</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-500 text-white text-sm hover:bg-primary-600">
                  <Plus size={14} /> Add Role
                </button>
              </div>
              <div className="space-y-2">
                {roles.map(role => (
                  <div key={role.id} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{role.name}</p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{role.users} users</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                        {role.permissions.length} permissions
                      </span>
                      <button className="p-1 rounded hover:bg-slate-600"><Edit2 size={14} className="text-slate-400" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Team Members</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-500 text-white text-sm hover:bg-primary-600">
                  <Plus size={14} /> Invite User
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                    <tr>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>User</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Role</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status</th>
                      <th className={`px-4 py-3 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {users.map(user => (
                      <tr key={user.id} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-medium">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name}</p>
                              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{user.role}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">{user.lastActive}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {section === 'billing' && (
          <div className="space-y-4">
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Current Plan</h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Professional - $99/month</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">Active</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Users</p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>25 / 25</p>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Storage</p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>8.5 GB / 10 GB</p>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>API Calls</p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>12,450 / 50K</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">Upgrade Plan</button>
            </div>

            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Payment Method</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white text-xs font-bold">VISA</div>
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>•••• •••• •••• 4242</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Expires 12/25</p>
                </div>
                <button className="ml-auto text-sm text-primary-500 hover:text-primary-600">Update</button>
              </div>
            </div>
          </div>
        )}

        {section === 'integrations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map(int => (
              <div key={int.id} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xl">
                      {int.icon}
                    </div>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{int.name}</p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{int.status}</p>
                    </div>
                  </div>
                  <button className={`px-3 py-1.5 rounded-lg text-sm ${int.status === 'connected' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-primary-500 text-white hover:bg-primary-600'}`}>
                    {int.status === 'connected' ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {section === 'security' && (
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Two-Factor Authentication</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Add an extra layer of security</p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">Enable</button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Change Password</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Last changed 30 days ago</p>
                </div>
                <button className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50">Change</button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Active Sessions</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>2 devices currently logged in</p>
                </div>
                <button className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50">View</button>
              </div>
            </div>
          </div>
        )}

        {(section === 'notifications' || section === 'workspace' || section === 'api' || section === 'backup') && (
          <div className={`p-12 rounded-xl border text-center ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <Settings size={48} className={`mx-auto mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{getTitle()}</h3>
            <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>This section is available in the full version.</p>
            <button className="mt-4 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">Upgrade to Premium</button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SettingsPage;