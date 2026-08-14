Router.add('/dashboard', async (container) => {
  container.innerHTML = `<h2 class="display-text" style="margin-bottom: 2rem;">Dashboard</h2><div class="mono-text">Loading metrics...</div>`;
  try {
    const [projectsRes, postsRes, mediaRes] = await Promise.all([
      API.get('/api/projects/admin/all'),
      API.get('/api/posts/admin/all'),
      API.get('/api/media?limit=1')
    ]);

    const liveProjects = projectsRes.projects.filter(p => p.status === 'production').length;
    
    container.innerHTML = `
      <div class="flex justify-between items-center" style="margin-bottom: 2rem;">
        <h2 class="display-text" style="margin: 0;">Dashboard</h2>
        <div class="mono-text" style="color: var(--text-tertiary);">${new Date().toISOString().split('T')[0]}</div>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
        <div class="card">
          <div class="mono-text" style="font-size: 0.7rem; color: var(--text-tertiary); margin-bottom: 0.5rem;">SYSTEMS (LIVE/TOTAL)</div>
          <div class="display-text" style="font-size: 2rem; color: var(--text-primary);">${liveProjects} <span style="color: var(--text-tertiary); font-size: 1.2rem;">/ ${projectsRes.projects.length}</span></div>
        </div>
        <div class="card">
          <div class="mono-text" style="font-size: 0.7rem; color: var(--text-tertiary); margin-bottom: 0.5rem;">LAB POSTS</div>
          <div class="display-text" style="font-size: 2rem; color: var(--text-primary);">${postsRes.posts.length}</div>
        </div>
        <div class="card">
          <div class="mono-text" style="font-size: 0.7rem; color: var(--text-tertiary); margin-bottom: 0.5rem;">MEDIA ASSETS</div>
          <div class="display-text" style="font-size: 2rem; color: var(--text-primary);">${mediaRes.total || 0}</div>
        </div>
      </div>

      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div>
          <h3 class="mono-text" style="color: var(--accent); margin-bottom: 1rem;">RECENT SYSTEMS</h3>
          <table class="admin-table">
            <thead><tr><th>Title</th><th>Status</th></tr></thead>
            <tbody>
              ${projectsRes.projects.slice(0, 5).map(p => `
                <tr>
                  <td><a href="#/projects/edit/${p._id}" class="link-accent">${p.title}</a></td>
                  <td><span class="badge ${p.status === 'production' ? 'badge-success' : ''}">${p.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div>
          <h3 class="mono-text" style="color: var(--accent); margin-bottom: 1rem;">RECENT POSTS</h3>
          <table class="admin-table">
            <thead><tr><th>Title</th><th>Status</th></tr></thead>
            <tbody>
              ${postsRes.posts.slice(0, 5).map(p => `
                <tr>
                  <td><a href="#/posts/edit/${p._id}" class="link-accent">${p.title}</a></td>
                  <td><span class="badge">${p.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="toast error show" style="position:static; transform:none;">Failed to load dashboard data</div>`;
  }
});