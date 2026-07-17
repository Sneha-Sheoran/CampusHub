const API_BASE_URL = 'http://localhost:5000';

function getStorageKey(endpoint) {
  const normalized = endpoint.split('?')[0].replace(/^\/api\//, '');

  const keyMap = {
    notes: 'campushub-notes',
    'lost-items': 'campushub-lostfound',
    marketplace: 'campushub-marketplace',
    complaints: 'campushub-complaints',
    events: 'campushub-events',
    notices: 'campushub-notices'
  };

  return keyMap[normalized] || null;
}

function getFallbackData(endpoint, method = 'GET', payload = null) {
  const storageKey = getStorageKey(endpoint);
  if (!storageKey || !window.StorageManager) {
    return null;
  }

  const list = window.StorageManager.get(storageKey) || [];
  const normalizedEndpoint = endpoint.split('?')[0];

  if (method === 'GET') {
    return { success: true, data: list };
  }

  if (method === 'POST') {
    const item = {
      id: `${storageKey}-${Date.now()}`,
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      date: payload.date || new Date().toISOString().slice(0, 10)
    };

    const updatedList = [item, ...list];
    window.StorageManager.set(storageKey, updatedList);
    return { success: true, message: 'Saved locally', data: item };
  }

  if (method === 'PUT') {
    const id = normalizedEndpoint.split('/').pop();
    const itemIndex = list.findIndex((entry) => entry.id === id);
    if (itemIndex === -1) {
      return null;
    }

    const updatedItem = { ...list[itemIndex], ...payload, updatedAt: new Date().toISOString() };
    const updatedList = [...list];
    updatedList[itemIndex] = updatedItem;
    window.StorageManager.set(storageKey, updatedList);
    return { success: true, data: updatedItem };
  }

  if (method === 'DELETE') {
    const id = normalizedEndpoint.split('/').pop();
    const updatedList = list.filter((entry) => entry.id !== id);
    window.StorageManager.set(storageKey, updatedList);
    return { success: true, message: 'Deleted locally' };
  }

  return null;
}

async function apiRequest(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();

  try {
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
  } catch (error) {
    const fallbackData = getFallbackData(endpoint, method, options.body ? JSON.parse(options.body) : null);
    if (fallbackData) {
      return fallbackData;
    }

    throw error;
  }
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
