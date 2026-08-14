const API = {
  async request(endpoint, options = {}) {
    try {
      const res = await fetch(endpoint, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 401) {
          Auth.logoutLocal();
          window.location.hash = '#/login';
        }
        throw new Error(data.error || 'API Error');
      }
      
      return data;
    } catch (err) {
      throw err;
    }
  },

  async get(endpoint) { return this.request(endpoint); },
  async post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); },
  async put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); },
  async delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); },
  
  async upload(endpoint, formData) {
    try {
      const res = await fetch(endpoint, { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { Auth.logoutLocal(); window.location.hash = '#/login'; }
        throw new Error(data.error || 'Upload failed');
      }
      return data;
    } catch (err) {
      throw err;
    }
  }
};