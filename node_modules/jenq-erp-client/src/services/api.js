const API_URL = (import.meta.env.DEV) ? '/api' : 'https://jenq-erp.onrender.com/api';

const getToken = () => localStorage.getItem('jenq_token');

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

export const api = {
  async get(endpoint) {
    const res = await fetch(`${API_URL}${endpoint}`, authHeader());
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },
  
  async post(endpoint, body) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...authHeader(),
      method: 'POST',
      headers: {
        ...authHeader().headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },
  
  async put(endpoint, body) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...authHeader(),
      method: 'PUT',
      headers: {
        ...authHeader().headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },
  
  async delete(endpoint) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...authHeader(),
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }
};

export const authService = {
  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('jenq_token', data.token);
    localStorage.setItem('jenq_user', JSON.stringify(data.user));
    localStorage.setItem('jenq_org', JSON.stringify(data.organization));
    return data;
  },
  
  async register(name, email, password, companyName) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, companyName })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    localStorage.setItem('jenq_token', data.token);
    localStorage.setItem('jenq_user', JSON.stringify(data.user));
    localStorage.setItem('jenq_org', JSON.stringify(data.organization));
    return data;
  },
  
  async me() {
    return api.get('/auth/me');
  },
  
  logout() {
    localStorage.removeItem('jenq_token');
    localStorage.removeItem('jenq_user');
    localStorage.removeItem('jenq_org');
  },
  
  getUser() {
    const user = localStorage.getItem('jenq_user');
    return user ? JSON.parse(user) : null;
  },
  
  getOrg() {
    const org = localStorage.getItem('jenq_org');
    return org ? JSON.parse(org) : null;
  },
  
  isAuthenticated() {
    return !!getToken();
  }
};

export const dashboardService = {
  getStats() {
    return api.get('/dashboard/stats');
  },
  getActivity() {
    return api.get('/dashboard/activity');
  },
  getRevenueChart() {
    return api.get('/dashboard/chart/revenue');
  },
  getSalesChart() {
    return api.get('/dashboard/chart/sales');
  }
};

export const crmService = {
  getStats() {
    return api.get('/crm/stats');
  },
  getContacts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/crm/contacts?${query}`);
  },
  createContact(data) {
    return api.post('/crm/contacts', data);
  },
  updateContact(id, data) {
    return api.put(`/crm/contacts/${id}`, data);
  },
  deleteContact(id) {
    return api.delete(`/crm/contacts/${id}`);
  },
  getCustomers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/crm/customers?${query}`);
  },
  createCustomer(data) {
    return api.post('/crm/customers', data);
  },
  getCustomerHistory(id) {
    return api.get(`/crm/customers/${id}/history`);
  },
  getDeals(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/crm/deals?${query}`);
  },
  createDeal(data) {
    return api.post('/crm/deals', data);
  },
  updateDeal(id, data) {
    return api.put(`/crm/deals/${id}`, data);
  },
  deleteDeal(id) {
    return api.delete(`/crm/deals/${id}`);
  },
  getProposals(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/crm/proposals?${query}`);
  },
  createProposal(data) {
    return api.post('/crm/proposals', data);
  },
  updateProposal(id, data) {
    return api.put(`/crm/proposals/${id}`, data);
  },
  sendProposal(id) {
    return api.post(`/crm/proposals/${id}/send`);
  },
  acceptProposal(id) {
    return api.post(`/crm/proposals/${id}/accept`);
  },
  rejectProposal(id) {
    return api.post(`/crm/proposals/${id}/reject`);
  },
  getContracts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/crm/contracts?${query}`);
  },
  createContract(data) {
    return api.post('/crm/contracts', data);
  },
  updateContract(id, data) {
    return api.put(`/crm/contracts/${id}`, data);
  },
  sendContract(id) {
    return api.post(`/crm/contracts/${id}/send`);
  },
  signContract(id, data) {
    return api.post(`/crm/contracts/${id}/sign`, data);
  },
  getInvoices(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/crm/invoices?${query}`);
  },
  createInvoice(data) {
    return api.post('/crm/invoices', data);
  },
  updateInvoice(id, data) {
    return api.put(`/crm/invoices/${id}`, data);
  },
  payInvoice(id, data) {
    return api.post(`/crm/invoices/${id}/pay`, data);
  },
  getActivities(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/crm/activities?${query}`);
  },
  createActivity(data) {
    return api.post('/crm/activities', data);
  },
  completeActivity(id) {
    return api.put(`/crm/activities/${id}/complete`);
  },
  deleteActivity(id) {
    return api.delete(`/crm/activities/${id}`);
  }
};

export const inventoryService = {
  getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/inventory/products?${query}`);
  },
  createProduct(data) {
    return api.post('/inventory/products', data);
  },
  updateProduct(id, data) {
    return api.put(`/inventory/products/${id}`, data);
  },
  deleteProduct(id) {
    return api.delete(`/inventory/products/${id}`);
  },
  getOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/inventory/orders?${query}`);
  },
  createOrder(data) {
    return api.post('/inventory/orders', data);
  },
  updateOrder(id, data) {
    return api.put(`/inventory/orders/${id}`, data);
  }
};

export const accountingService = {
  getInvoices(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/accounting/invoices?${query}`);
  },
  createInvoice(data) {
    return api.post('/accounting/invoices', data);
  },
  updateInvoice(id, data) {
    return api.put(`/accounting/invoices/${id}`, data);
  },
  getExpenses(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/accounting/expenses?${query}`);
  },
  createExpense(data) {
    return api.post('/accounting/expenses', data);
  },
  updateExpense(id, data) {
    return api.put(`/accounting/expenses/${id}`, data);
  },
  deleteExpense(id) {
    return api.delete(`/accounting/expenses/${id}`);
  },
  getSummary() {
    return api.get('/accounting/reports/summary');
  }
};

export const hrService = {
  getEmployees(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/hr/employees?${query}`);
  },
  createEmployee(data) {
    return api.post('/hr/employees', data);
  },
  updateEmployee(id, data) {
    return api.put(`/hr/employees/${id}`, data);
  },
  getLeaves(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/hr/leaves?${query}`);
  },
  createLeave(data) {
    return api.post('/hr/leaves', data);
  },
  updateLeave(id, data) {
    return api.put(`/hr/leaves/${id}`, data);
  }
};

export const projectsService = {
  getProjects(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/projects/projects?${query}`);
  },
  createProject(data) {
    return api.post('/projects/projects', data);
  },
  updateProject(id, data) {
    return api.put(`/projects/projects/${id}`, data);
  },
  deleteProject(id) {
    return api.delete(`/projects/projects/${id}`);
  },
  getTasks(projectId) {
    return api.get(`/projects/projects/${projectId}/tasks`);
  },
  createTask(projectId, data) {
    return api.post(`/projects/projects/${projectId}/tasks`, data);
  },
  updateTask(id, data) {
    return api.put(`/projects/tasks/${id}`, data);
  }
};

export const usersService = {
  getUsers() {
    return api.get('/users/users');
  },
  createUser(data) {
    return api.post('/users/users', data);
  },
  updateUser(id, data) {
    return api.put(`/users/users/${id}`, data);
  },
  deleteUser(id) {
    return api.delete(`/users/users/${id}`);
  }
};

export const posService = {
  getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/pos/products?${query}`);
  },
  createOrder(data) {
    return api.post('/pos/orders', data);
  },
  getOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/pos/orders?${query}`);
  }
};