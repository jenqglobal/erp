const API_URL = '/api';

const getToken = () => localStorage.getItem('jenq_token') || localStorage.getItem('token');

const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

export const onboardingApi = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/onboarding?${query}`, authHeader());
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  getClient: async (id) => {
    const res = await fetch(`${API_URL}/onboarding/clients/${id}`, authHeader());
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  createClient: async (clientData) => {
    const res = await fetch(`${API_URL}/onboarding/clients`, {
      method: 'POST',
      headers: { ...authHeader().headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  updateClient: async (id, data) => {
    const res = await fetch(`${API_URL}/onboarding/clients/${id}`, {
      method: 'PUT',
      headers: { ...authHeader().headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Request failed');
    return result;
  },

  deleteClient: async (id) => {
    const res = await fetch(`${API_URL}/onboarding/clients/${id}`, {
      method: 'DELETE',
      headers: authHeader().headers
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  inviteClient: async (id) => {
    const res = await fetch(`${API_URL}/onboarding/clients/${id}/invite`, {
      method: 'POST',
      headers: authHeader().headers
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  assignTemplate: async (clientId, templateId) => {
    const res = await fetch(`${API_URL}/onboarding/clients/${clientId}/assign-template`, {
      method: 'POST',
      headers: { ...authHeader().headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_id: templateId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  submitForm: async (clientId, formName, formData) => {
    const res = await fetch(`${API_URL}/onboarding/clients/${clientId}/forms`, {
      method: 'POST',
      headers: { ...authHeader().headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ form_name: formName, form_data: formData })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  uploadDocument: async (clientId, formData) => {
    const res = await fetch(`${API_URL}/onboarding/clients/${clientId}/documents`, {
      method: 'POST',
      headers: authHeader().headers,
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  reviewDocument: async (clientId, docId, status, notes) => {
    const res = await fetch(`${API_URL}/onboarding/clients/${clientId}/documents/${docId}`, {
      method: 'PUT',
      headers: { ...authHeader().headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  sendDocument: async (clientId, docId) => {
    const res = await fetch(`${API_URL}/onboarding/clients/${clientId}/documents/${docId}/send`, {
      method: 'POST',
      headers: authHeader().headers
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  signDocument: async (clientId, docId, signerName, signature) => {
    const res = await fetch(`${API_URL}/onboarding/clients/${clientId}/documents/${docId}/sign`, {
      method: 'POST',
      headers: { ...authHeader().headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ signer_name: signerName, signature })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  updateTask: async (clientId, taskId, status) => {
    const res = await fetch(`${API_URL}/onboarding/clients/${clientId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { ...authHeader().headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  sendMessage: async (clientId, text, from = 'client') => {
    const res = await fetch(`${API_URL}/onboarding/clients/${clientId}/messages`, {
      method: 'POST',
      headers: { ...authHeader().headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, from })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  scheduleMeeting: async (clientId, type, scheduledAt, notes) => {
    const res = await fetch(`${API_URL}/onboarding/clients/${clientId}/meetings`, {
      method: 'POST',
      headers: { ...authHeader().headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, scheduled_at: scheduledAt, notes })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  completeOnboarding: async (id) => {
    const res = await fetch(`${API_URL}/onboarding/clients/${id}/complete`, {
      method: 'POST',
      headers: authHeader().headers
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  activateProject: async (id) => {
    const res = await fetch(`${API_URL}/onboarding/clients/${id}/activate`, {
      method: 'POST',
      headers: authHeader().headers
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  createTemplate: async (templateData) => {
    const res = await fetch(`${API_URL}/onboarding/templates`, {
      method: 'POST',
      headers: { ...authHeader().headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(templateData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  updateTemplate: async (id, data) => {
    const res = await fetch(`${API_URL}/onboarding/templates/${id}`, {
      method: 'PUT',
      headers: { ...authHeader().headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Request failed');
    return result;
  },

  deleteTemplate: async (id) => {
    const res = await fetch(`${API_URL}/onboarding/templates/${id}`, {
      method: 'DELETE',
      headers: authHeader().headers
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },
};