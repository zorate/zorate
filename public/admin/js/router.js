const Router = {
  routes: {},
  currentRoute: null,

  add(path, handler) {
    this.routes[path] = handler;
  },

  navigate(path) {
    window.location.hash = '#' + path;
  },

  async handle() {
    let path = window.location.hash.slice(1) || '/dashboard';
    
    // Auth guard
    if (path !== '/login') {
      const isAuth = await Auth.check();
      if (!isAuth) {
        return this.navigate('/login');
      }
      document.getElementById('app-layout').style.display = 'flex';
      document.getElementById('login-layout').style.display = 'none';
      this.updateActiveNav(path);
    } else {
      document.getElementById('app-layout').style.display = 'none';
      document.getElementById('login-layout').style.display = 'flex';
    }

    // Dynamic routing for editors
    let routeHandler;
    let params = {};

    if (path.startsWith('/projects/edit/')) {
      routeHandler = this.routes['/project-editor'];
      params.id = path.split('/').pop();
    } else if (path === '/projects/new') {
      routeHandler = this.routes['/project-editor'];
    } else if (path.startsWith('/posts/edit/')) {
      routeHandler = this.routes['/post-editor'];
      params.id = path.split('/').pop();
    } else if (path === '/posts/new') {
      routeHandler = this.routes['/post-editor'];
    } else {
      routeHandler = this.routes[path];
    }

    if (routeHandler) {
      const container = path === '/login' ? document.getElementById('login-container') : document.getElementById('view-container');
      container.innerHTML = '<div class="mono-text" style="color:var(--text-tertiary);">Loading...</div>';
      await routeHandler(container, params);
    } else {
      document.getElementById('view-container').innerHTML = '<h2>404 - Not Found</h2>';
    }
  },

  updateActiveNav(path) {
    document.querySelectorAll('.sidebar-link[data-route]').forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').replace('/zorate', '');
      if (path === href || path.startsWith(href + '/')) {
        link.classList.add('active');
      }
    });
  }
};

window.addEventListener('hashchange', () => Router.handle());