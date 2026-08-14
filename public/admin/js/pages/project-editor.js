Router.add('/project-editor', async (container, params) => {
  const isEdit = !!params.id;
  let p = {
    title: '', slug: '', tagline: '', shortDescription: '', content: '',
    role: '', status: 'development', stack: [], tags: [], featured: false, sortOrder: 0,
    links: { live: '', github: '', demo: '' },
    metrics: { users: '', vendors: '', gmv: '', note: '' }
  };

  if (isEdit) {
    container.innerHTML = '<div class="mono-text">Loading...</div>';
    try {
      const res = await API.get(`/api/projects/admin/all`);
      p = res.projects.find(x => x._id === params.id) || p;
    } catch (err) {
      Toast.error('Failed to load project');
      return Router.navigate('/projects');
    }
  }

  container.innerHTML = `
    <div class="flex justify-between items-center" style="margin-bottom: 2rem;">
      <h2 class="display-text" style="margin: 0;">${isEdit ? 'Edit System' : 'New System'}</h2>
      <div>
        ${isEdit ? `<button id="btn-delete" class="btn" style="color:var(--error); border-color:var(--error); margin-right: 1rem;">Delete</button>` : ''}
        <button id="btn-save" class="btn btn-primary">Save System</button>
      </div>
    </div>
    
    <div class="grid" style="grid-template-columns: 2fr 1fr; gap: 2rem;">
      <div>
        <div class="card" style="margin-bottom: 2rem;">
          <h3 class="mono-text" style="margin-bottom: 1.5rem; color: var(--accent);">CORE DATA</h3>
          <div class="form-group">
            <label class="form-label">Title</label>
            <input type="text" id="p-title" class="form-control" value="${p.title}">
          </div>
          <div class="form-group">
            <label class="form-label">Slug</label>
            <input type="text" id="p-slug" class="form-control" value="${p.slug}">
          </div>
          <div class="form-group">
            <label class="form-label">Tagline</label>
            <input type="text" id="p-tagline" class="form-control" value="${p.tagline}">
          </div>
          <div class="form-group">
            <label class="form-label">Short Description</label>
            <textarea id="p-desc" class="form-control" rows="3">${p.shortDescription}</textarea>
          </div>
        </div>

        <div class="card" style="margin-bottom: 2rem;">
          <div class="flex justify-between items-center" style="margin-bottom: 1.5rem;">
            <h3 class="mono-text" style="color: var(--accent); margin:0;">CASE STUDY (MARKDOWN)</h3>
            <button id="btn-media-insert" class="btn" style="font-size:0.6rem; padding: 0.3rem 0.6rem;">Insert Media</button>
          </div>
          <textarea id="p-content">${p.content}</textarea>
        </div>
      </div>

      <div>
        <div class="card" style="margin-bottom: 2rem;">
          <h3 class="mono-text" style="margin-bottom: 1.5rem; color: var(--accent);">METADATA</h3>
          
          <div class="form-group">
            <label class="form-label">Status</label>
            <select id="p-status" class="form-control">
              <option value="development" ${p.status === 'development' ? 'selected' : ''}>Development</option>
              <option value="production" ${p.status === 'production' ? 'selected' : ''}>Production / Live</option>
              <option value="archived" ${p.status === 'archived' ? 'selected' : ''}>Archived</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Cover Image</label>
            <div id="cover-preview" style="width:100%; min-height: 100px; background: var(--bg-surface-2); border: 1px dashed var(--border-subtle); border-radius: var(--radius-sm); margin-bottom: 0.5rem; display:flex; align-items:center; justify-content:center; cursor:pointer; overflow:hidden;">
              ${p.coverMediaId ? `<img src="/api/media/${p.coverMediaId}/file" style="width:100%;height:auto;">` : '<span class="mono-text" style="font-size:0.7rem; color:var(--text-tertiary);">Click to select</span>'}
            </div>
            <input type="hidden" id="p-cover" value="${p.coverMediaId || ''}">
            <button id="btn-cover-clear" class="btn" style="font-size:0.6rem; padding: 0.2rem 0.5rem;">Clear Cover</button>
          </div>

          <div class="form-group">
            <label class="form-label">Role</label>
            <input type="text" id="p-role" class="form-control" value="${p.role || ''}">
          </div>

          <div class="form-group" style="display:flex; align-items:center; gap: 1rem;">
            <input type="checkbox" id="p-featured" ${p.featured ? 'checked' : ''}>
            <label class="form-label" for="p-featured" style="margin:0;">Featured System</label>
          </div>

          <div class="form-group" style="margin-top: 1rem;">
            <label class="form-label">Sort Order (Lower = First)</label>
            <input type="number" id="p-sort" class="form-control" value="${p.sortOrder}">
          </div>
        </div>

        <div class="card" style="margin-bottom: 2rem;">
          <h3 class="mono-text" style="margin-bottom: 1.5rem; color: var(--accent);">ARRAYS</h3>
          <div class="form-group">
            <label class="form-label">Stack (Comma separated)</label>
            <input type="text" id="p-stack" class="form-control" value="${(p.stack || []).join(', ')}">
          </div>
          <div class="form-group">
            <label class="form-label">Tags (Comma separated)</label>
            <input type="text" id="p-tags" class="form-control" value="${(p.tags || []).join(', ')}">
          </div>
        </div>

        <div class="card" style="margin-bottom: 2rem;">
          <h3 class="mono-text" style="margin-bottom: 1.5rem; color: var(--accent);">LINKS</h3>
          <div class="form-group">
            <label class="form-label">Live URL</label>
            <input type="text" id="p-link-live" class="form-control" value="${p.links?.live || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">GitHub URL</label>
            <input type="text" id="p-link-github" class="form-control" value="${p.links?.github || ''}">
          </div>
        </div>

        <div class="card">
          <h3 class="mono-text" style="margin-bottom: 1.5rem; color: var(--accent);">METRICS (Optional)</h3>
          <div class="form-group">
            <label class="form-label">Users / Volume</label>
            <input type="text" id="p-metric-users" class="form-control" value="${p.metrics?.users || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">GMV / Value</label>
            <input type="text" id="p-metric-gmv" class="form-control" value="${p.metrics?.gmv || ''}">
          </div>
        </div>
      </div>
    </div>
  `;

  // Init MDE
  const simplemde = Editor.init('p-content');

  // Slug auto-generation
  document.getElementById('p-title').addEventListener('blur', (e) => {
    const slugInput = document.getElementById('p-slug');
    if (!slugInput.value) {
      slugInput.value = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
  });

  // Media picker for markdown
  document.getElementById('btn-media-insert').addEventListener('click', () => {
    MediaPicker.open((id, url) => {
      const imgMd = `![Image alt text](${url})`;
      simplemde.codemirror.replaceSelection(imgMd);
    });
  });

  // Media picker for cover
  document.getElementById('cover-preview').addEventListener('click', () => {
    MediaPicker.open((id, url) => {
      document.getElementById('p-cover').value = id;
      document.getElementById('cover-preview').innerHTML = `<img src="${url}" style="width:100%;height:auto;">`;
    });
  });

  document.getElementById('btn-cover-clear').addEventListener('click', () => {
    document.getElementById('p-cover').value = '';
    document.getElementById('cover-preview').innerHTML = '<span class="mono-text" style="font-size:0.7rem; color:var(--text-tertiary);">Click to select</span>';
  });

  // Save
  document.getElementById('btn-save').addEventListener('click', async () => {
    const data = {
      title: document.getElementById('p-title').value,
      slug: document.getElementById('p-slug').value,
      tagline: document.getElementById('p-tagline').value,
      shortDescription: document.getElementById('p-desc').value,
      content: simplemde.value(),
      status: document.getElementById('p-status').value,
      role: document.getElementById('p-role').value,
      featured: document.getElementById('p-featured').checked,
      sortOrder: parseInt(document.getElementById('p-sort').value) || 0,
      stack: document.getElementById('p-stack').value.split(',').map(s => s.trim()).filter(Boolean),
      tags: document.getElementById('p-tags').value.split(',').map(s => s.trim()).filter(Boolean),
      links: {
        live: document.getElementById('p-link-live').value,
        github: document.getElementById('p-link-github').value,
      },
      metrics: {
        users: document.getElementById('p-metric-users').value,
        gmv: document.getElementById('p-metric-gmv').value,
      }
    };

    const coverId = document.getElementById('p-cover').value;
    if (coverId) data.coverMediaId = coverId;

    try {
      if (isEdit) {
        await API.put(`/api/projects/${params.id}`, data);
        Toast.success('System updated');
      } else {
        await API.post('/api/projects', data);
        Toast.success('System created');
        Router.navigate('/projects');
      }
    } catch (err) { Toast.error(err.message); }
  });

  // Delete
  if (isEdit) {
    document.getElementById('btn-delete').addEventListener('click', async () => {
      if (confirm('Are you absolutely sure you want to delete this system?')) {
        try {
          await API.delete(`/api/projects/${params.id}`);
          Toast.success('System deleted');
          Router.navigate('/projects');
        } catch (err) { Toast.error(err.message); }
      }
    });
  }
});