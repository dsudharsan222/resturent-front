import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = async (endpoint, options = {}, isProtected = false) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (isProtected) {
    const token = localStorage.getItem('adminToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const rawData = await response.json().catch(() => ({}));

  // Check if it's the new wrapped response structure: { settings: { success, message }, data }
  const isWrappedResponse = rawData && rawData.settings && typeof rawData.settings.success !== 'undefined';

  if (isWrappedResponse) {
    const { success, message } = rawData.settings;
    
    // If the API explicitly returns success: 0, it's an error
    if (success === 0 || !response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }
      if (message) toast.error(message);
      throw new Error(message || 'API request failed');
    }

    // It's successful (success === 1)
    // Show success toast for mutations (POST, PUT, DELETE) to avoid spamming on GET requests
    const method = options.method || 'GET';
    if (method !== 'GET' && message) {
      toast.success(message);
    }

    return rawData.data;
  }

  // Fallback for legacy response structures if any API hasn't been updated yet
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
      return;
    }
    const errorMessage = Array.isArray(rawData.message) ? rawData.message.join(', ') : rawData.message || 'API request failed';
    if (options.method && options.method !== 'GET') {
      toast.error(errorMessage);
    }
    throw new Error(errorMessage);
  }

  return rawData;
};
