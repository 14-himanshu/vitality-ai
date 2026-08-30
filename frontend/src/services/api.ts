const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Helper to get auth headers
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const fetchWithRetry = async (url: string, options: RequestInit, retries = 2) => {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      // Don't retry client errors (4xx)
      if (res.status >= 400 && res.status < 500) return res; 
    } catch (err) {
      if (i === retries) throw err;
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 500));
    }
  }
  throw new Error('Max retries reached');
};

export const api = {
  get: async (endpoint: string) => {
    try {
      const res = await fetchWithRetry(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Error ${res.status}`);
      }
      return res.json();
    } catch (error: any) {
      console.error(`[API GET ERROR] ${endpoint}:`, error.message);
      throw error;
    }
  },

  post: async (endpoint: string, data: any) => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Error ${res.status}`);
      }
      return res.json();
    } catch (error: any) {
      console.error(`[API POST ERROR] ${endpoint}:`, error.message);
      throw error;
    }
  }
};
