Router.add('/projects', async (container) => {
  container.innerHTML = `
    <div class="flex justify-between items-center" style="margin-bottom: 2rem;">
      <h2 class="display-text" style="margin: 0;">Systems & Projects</h2>
      <a href="#/projects/new" class="btn btn-primary">+ New System</a>
    </div>
    <div class="mono-text">Loading...</div>
  `;

  try {
    const res = await API.get('/api/projects/admin/all');
    container.innerHTML = `
      <div class="flex justify-between items-center" style="margin-bottom: 2rem;">
        <h2 class="display-text" style="margin: 0;">Systems & Projects</h2>
        <a href="#/projects/new" class="btn btn-primary">+ New System</a>
      </div>
      
      <table class="admin-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Title</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Featured</th>
            <th style="width: 100px;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${res.projects.map(p => `
            <tr>
              <td>${p.sortOrder}</td>
              <td>${p.title}</td>
              <td>${p.slug}</td>
              <td><span class="badge ${p.status === 'production' ? 'badge-success' : ''}">${p.status}</span></td>
              <td>${p.featured ? 'Yes' : 'No'}</td>
              <td>
                <a href="#/projects/edit/${p._id}" class="btn" style="padding: 0.3rem 0.6rem;">Edit</a>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (err) {}
});