const API_URL = import.meta.env.VITE_API_URL || '';
const BASE_API = API_URL ? `${API_URL}/api` : '/api';

export { BASE_API as API_URL };

export const authHeader = () => {
  const token = localStorage.getItem('jenq_token') || localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
};