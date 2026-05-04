import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import { ThemeProvider } from './store/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import CRM from './pages/CRM';
import Inventory from './pages/Inventory';
import Accounting from './pages/Accounting';
import HR from './pages/HR';
import Projects from './pages/Projects';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import POS from './pages/POS';

const ProtectedRoute = ({ children }) => {
  const { loading, user } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AuthRoute = ({ children }) => {
  const { loading, user } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
      
      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/analytics" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/customize" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      
      {/* CRM Routes */}
      <Route path="/crm" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
      <Route path="/crm/leads" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
      <Route path="/crm/deals" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
      <Route path="/crm/contacts" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
      <Route path="/crm/companies" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
      <Route path="/crm/accounts" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
      <Route path="/crm/campaigns" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
      <Route path="/crm/analytics" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
      
      {/* Inventory Routes */}
      <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/inventory/stock" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/inventory/warehouses" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/inventory/purchase" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/inventory/transfers" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/inventory/returns" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/inventory/suppliers" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/inventory/reports" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      
      {/* Accounting/Billing Routes */}
      <Route path="/accounting" element={<ProtectedRoute><Accounting /></ProtectedRoute>} />
      <Route path="/accounting/invoices" element={<ProtectedRoute><Accounting /></ProtectedRoute>} />
      <Route path="/accounting/customers" element={<ProtectedRoute><Accounting /></ProtectedRoute>} />
      <Route path="/accounting/bills" element={<ProtectedRoute><Accounting /></ProtectedRoute>} />
      <Route path="/accounting/payments" element={<ProtectedRoute><Accounting /></ProtectedRoute>} />
      <Route path="/accounting/expenses" element={<ProtectedRoute><Accounting /></ProtectedRoute>} />
      <Route path="/accounting/accounts" element={<ProtectedRoute><Accounting /></ProtectedRoute>} />
      <Route path="/accounting/reports" element={<ProtectedRoute><Accounting /></ProtectedRoute>} />
      <Route path="/accounting/tax" element={<ProtectedRoute><Accounting /></ProtectedRoute>} />
      
      {/* POS Routes */}
      <Route path="/pos" element={<ProtectedRoute><POS /></ProtectedRoute>} />
      <Route path="/pos/transactions" element={<ProtectedRoute><POS /></ProtectedRoute>} />
      
      {/* HR Routes */}
      <Route path="/hr" element={<ProtectedRoute><HR /></ProtectedRoute>} />
      <Route path="/hr/employees" element={<ProtectedRoute><HR /></ProtectedRoute>} />
      <Route path="/hr/attendance" element={<ProtectedRoute><HR /></ProtectedRoute>} />
      <Route path="/hr/leave" element={<ProtectedRoute><HR /></ProtectedRoute>} />
      <Route path="/hr/payroll" element={<ProtectedRoute><HR /></ProtectedRoute>} />
      <Route path="/hr/recruitment" element={<ProtectedRoute><HR /></ProtectedRoute>} />
      <Route path="/hr/performance" element={<ProtectedRoute><HR /></ProtectedRoute>} />
      <Route path="/hr/training" element={<ProtectedRoute><HR /></ProtectedRoute>} />
      
      {/* Projects Routes */}
      <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/projects/kanban" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/projects/timeline" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/projects/tasks" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/projects/gantt" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/projects/time" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/projects/resources" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/projects/reports" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      
      {/* Documents Routes */}
      <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
      <Route path="/documents/shared" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
      <Route path="/documents/recent" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
      <Route path="/documents/starred" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
      <Route path="/documents/templates" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
      <Route path="/documents/contracts" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
      <Route path="/documents/policies" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
      
      {/* Analytics Routes */}
      <Route path="/analytics" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/analytics/sales" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/analytics/revenue" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/analytics/forecasts" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/analytics/customers" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/analytics/products" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/analytics/reports" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      
      {/* Workflows Routes */}
      <Route path="/workflows" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/workflows/approvals" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/workflows/webhooks" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/workflows/schedules" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/workflows/integrations" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/workflows/bulk" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      
      {/* Reports Routes */}
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/reports/sales" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/reports/financial" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/reports/inventory" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/reports/hr" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/reports/custom" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/reports/export" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      
      {/* Settings Routes */}
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/settings/profile" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/settings/security" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/settings/notifications" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/settings/integrations" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/settings/roles" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/settings/workspace" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/settings/billing" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/settings/api" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/settings/backup" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      
      {/* Onboarding Routes */}
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/onboarding/templates" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/onboarding/tasks" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/onboarding/portal" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;