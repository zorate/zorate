Router.add('/post-editor', async (container, params) => {
  const isEdit = !!params.id;
  let p = { title: '', slug: '', excerpt: '', content: '', tags: [], status: 'draft' };

  if (isEdit) {
    container.innerHTML = '<div class="mono-text">Loading...</div>';
    try {
      const res = await API.get(`/api/posts/admin/${params.id}`);
      p = res.post || p;
    } catch (err) {
      Toast.error('Failed to load post');
      return Router.navigate('/posts');
    }
  }

  container.innerHTML = `
    <div class="flex justify-between items-center" style="margin-bottom: 2rem;">
      <h2 class="display-text" style="margin: 0;">${isEdit ? 'Edit Post' : 'New Post'}</h2>
      <div>
        ${isEdit ? `<button id="btn-delete" class="btn" style="color:var(--error); border-color:var(--error); margin-right: 1rem;">Delete</button>` : ''}
        <button id="btn-save" class="btn btn-primary">Save Post</button>
      </div>
    </div>
    
    <div class="grid" style="grid-template-columns: 2fr 1fr; gap: 2rem;">
      <div>
        <div class="card" style="margin-bottom: 2rem;">
          <div class="form-group">
            <label class="form-label">Title</label>
            <input type="text" id="p-title" class="form-control" value="${p.title}">
          </div>
          <div class="form-group">
            <label class="form-label">Slug</label>
            <input type="text" id="p-slug" class="form-control" value="${p.slug}">
          </div>
          <div class="form-group">
            <label class="form-label">Excerpt</label>
            <textarea id="p-excerpt" class="form-control" rows="3">${p.excerpt || ''}</textarea>
          </div>
        </div>

        <div class="card">
          <div class="flex justify-between items-center" style="margin-bottom: 1.5rem;">
            <h3 class="mono-text" style="color: var(--accent); margin:0;">CONTENT (MARKDOWN)</h3>
            <button id="btn-media-insert" class="btn" style="font-size:0.6rem; padding: 0.3rem 0.6rem;">Insert Media</button>
          </div>
          <textarea id="p-content">${p.content || ''}</textarea>
        </div>
      </div>

      <div>
        <div class="card" style="margin-bottom: 2rem;">
          <div class="form-group">
            <label class="form-label">Status</label>
            <select id="p-status" class="form-control">
              <option value="draft" ${p.status === 'draft' ? 'selected' : ''}>Draft</option>
              <option value="published" ${p.status === 'published' ? 'selected' : ''}>Published</option>
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
            <label class="form-label">Tags (Comma separated)</label>
            <input type="text" id="p-tags" class="form-control" value="${(p.tags || []).join(', ')}">
          </div>
        </div>
      </div>
    </div>
  `;

  const simplemde = Editor.init('p-content');

  document.getElementById('p-title').addEventListener('blur', (e) => {
    const slugInput = document.getElementById('p-slug');
    if (!slugInput.value) {
      slugInput.value = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
  });

  document.getElementById('btn-media-insert').addEventListener('click', () => {
    MediaPicker.open((id, url) => {
      simplemde.codemirror.replaceSelection(`![Image alt text](${url})`);
    });
  });

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

  document.getElementById('btn-save').addEventListener('click', async () => {
    const data = {
      title: document.getElementById('p-title').value,
      slug: document.getElementById('p-slug').value,
      excerpt: document.getElementById('p-excerpt').value,
      content: simplemde.value(),
      status: document.getElementById('p-status').value,
      tags: document.getElementById('p-tags').value.split(',').map(s => s.trim()).filter(Boolean),
    };
    const coverId = document.getElementById('p-cover').value;
    if (coverId) data.coverMediaId = coverId;

    try {
      if (isEdit) {
        await API.put(`/api/posts/${params.id}`, data);
        Toast.success('Post updated');
      } else {
        await API.post('/api/posts', data);
        Toast.success('Post created');
        Router.navigate('/posts');
      }
    } catch (err) { Toast.error(err.message); }
  });

  if (isEdit) {
    document.getElementById('btn-delete').addEventListener('click', async () => {
      if (confirm('Delete this post permanently?')) {
        try {
          await API.delete(`/api/posts/${params.id}`);
          Toast.success('Post deleted');
          Router.navigate('/posts');
        } catch (err) { Toast.error(err.message); }
      }
    });
  }
});