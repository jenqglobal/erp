const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

const getToken = () => localStorage.getItem('jenq_token') || localStorage.getItem('token');

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

export const documentsApi = {
  getAll: async (folderId = 'root', section = 'all') => {
    const res = await fetch(`${API_URL}/documents?folderId=${folderId || 'root'}&section=${section}`, authHeader());
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },
  
  getTrash: async () => {
    const res = await fetch(`${API_URL}/documents/trash`, authHeader());
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },
  
  createFolder: async (name, parentId = null) => {
    const res = await fetch(`${API_URL}/documents/folder`, {
      method: 'POST',
      headers: {
        ...authHeader().headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, parentId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },
  
  upload: async (file, parentId = null) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('parentId', parentId || 'null');
    
    const res = await fetch(`${API_URL}/documents/upload`, {
      method: 'POST',
      headers: authHeader().headers,
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
  },
  
  star: async (id) => {
    const res = await fetch(`${API_URL}/documents/${id}/star`, { 
      method: 'PUT',
      headers: authHeader().headers 
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Star failed');
    return data;
  },
  
  share: async (id) => {
    const res = await fetch(`${API_URL}/documents/${id}/share`, { 
      method: 'PUT',
      headers: authHeader().headers 
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Share failed');
    return data;
  },
  
  rename: async (id, name) => {
    const res = await fetch(`${API_URL}/documents/${id}/rename`, {
      method: 'PUT',
      headers: {
        ...authHeader().headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Rename failed');
    return data;
  },
  
  delete: async (id) => {
    const res = await fetch(`${API_URL}/documents/${id}`, { 
      method: 'DELETE',
      headers: authHeader().headers 
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Delete failed');
    return data;
  },
  
  restoreTrash: async (id) => {
    const res = await fetch(`${API_URL}/documents/trash/${id}/restore`, { 
      method: 'POST',
      headers: authHeader().headers 
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Restore failed');
    return data;
  },
  
  permanentDelete: async (id) => {
    const res = await fetch(`${API_URL}/documents/trash/${id}/permanent`, { 
      method: 'DELETE',
      headers: authHeader().headers 
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Delete failed');
    return data;
  },
  
  emptyTrash: async () => {
    const res = await fetch(`${API_URL}/documents/trash/empty`, { 
      method: 'DELETE',
      headers: authHeader().headers 
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Empty trash failed');
    return data;
  },
};