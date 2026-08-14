const Auth = {
  state: {
    isAuthenticated: false,
    admin: null
  },

  async check() {
    try {
      const data = await API.get('/api/admin/me');
      this.state.isAuthenticated = true;
      this.state.admin = data.admin;
      return true;
    } catch (err) {
      this.state.isAuthenticated = false;
      this.state.admin = null;
      return false;
    }
  },

  async login(email, password) {
    try {
      await API.post('/api/admin/login', { email, password });
      this.state.isAuthenticated = true;
      Toast.success('Authentication successful');
      Router.navigate('/dashboard');
    } catch (err) {
      Toast.error(err.message);
    }
  },

  async logout() {
    try {
      await API.post('/api/admin/logout');
      this.logoutLocal();
      Toast.success('Session terminated');
      Router.navigate('/login');
    } catch (err) {
      Toast.error('Logout failed');
    }
  },

  logoutLocal() {
    this.state.isAuthenticated = false;
    this.state.admin = null;
  }
};