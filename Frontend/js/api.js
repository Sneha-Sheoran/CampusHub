const API_BASE_URL = 'http://localhost:5000';

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

window.API = {
  notes: {
    list: (query = '') => apiRequest(`/api/notes${query}`),
    create: (payload) => apiRequest('/api/notes', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => apiRequest(`/api/notes/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (id) => apiRequest(`/api/notes/${id}`, { method: 'DELETE' })
  },
  lostItems: {
    list: (query = '') => apiRequest(`/api/lost-items${query}`),
    create: (payload) => apiRequest('/api/lost-items', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => apiRequest(`/api/lost-items/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (id) => apiRequest(`/api/lost-items/${id}`, { method: 'DELETE' })
  },
  marketplace: {
    list: (query = '') => apiRequest(`/api/marketplace${query}`),
    create: (payload) => apiRequest('/api/marketplace', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => apiRequest(`/api/marketplace/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (id) => apiRequest(`/api/marketplace/${id}`, { method: 'DELETE' })
  },
  complaints: {
    list: (query = '') => apiRequest(`/api/complaints${query}`),
    create: (payload) => apiRequest('/api/complaints', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => apiRequest(`/api/complaints/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (id) => apiRequest(`/api/complaints/${id}`, { method: 'DELETE' })
  },
  events: {
    list: (query = '') => apiRequest(`/api/events${query}`),
    create: (payload) => apiRequest('/api/events', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => apiRequest(`/api/events/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (id) => apiRequest(`/api/events/${id}`, { method: 'DELETE' })
  },
  notices: {
    list: (query = '') => apiRequest(`/api/notices${query}`),
    create: (payload) => apiRequest('/api/notices', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => apiRequest(`/api/notices/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (id) => apiRequest(`/api/notices/${id}`, { method: 'DELETE' })
  }
};
