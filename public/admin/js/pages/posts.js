Router.add('/posts', async (container) => {
  container.innerHTML = `
    <div class="flex justify-between items-center" style="margin-bottom: 2rem;">
      <h2 class="display-text" style="margin: 0;">The Lab</h2>
      <a href="#/posts/new" class="btn btn-primary">+ New Post</a>
    </div>
    <div class="mono-text">Loading...</div>
  `;

  try {
    const res = await API.get('/api/posts/admin/all');
    container.innerHTML = `
      <div class="flex justify-between items-center" style="margin-bottom: 2rem;">
        <h2 class="display-text" style="margin: 0;">The Lab</h2>
        <a href="#/posts/new" class="btn btn-primary">+ New Post</a>
      </div>
      
      <table class="admin-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Status</th>
            <th style="width: 100px;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${res.posts.map(p => `
            <tr>
              <td>${new Date(p.createdAt).toLocaleDateString()}</td>
              <td>${p.title}</td>
              <td><span class="badge ${p.status === 'published' ? 'badge-success' : ''}">${p.status}</span></td>
              <td>
                <a href="#/posts/edit/${p._id}" class="btn" style="padding: 0.3rem 0.6rem;">Edit</a>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (err) {}
});