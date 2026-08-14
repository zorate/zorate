Router.add('/media', async (container) => {
  container.innerHTML = `
    <div class="flex justify-between items-center" style="margin-bottom: 2rem;">
      <h2 class="display-text" style="margin: 0;">Media Assets</h2>
      <div>
        <input type="file" id="media-upload" style="display:none;" accept="image/*,video/*,application/pdf">
        <label for="media-upload" class="btn btn-primary" style="cursor:pointer;">+ Upload File</label>
      </div>
    </div>
    <div id="media-grid" class="media-grid">
      <div class="mono-text">Loading...</div>
    </div>
  `;

  const loadMedia = async () => {
    try {
      const res = await API.get('/api/media?limit=100');
      const grid = document.getElementById('media-grid');
      
      if (res.items.length === 0) {
        grid.innerHTML = '<div class="mono-text">No media uploaded yet.</div>';
        return;
      }

      grid.innerHTML = res.items.map(m => `
        <div class="card" style="padding: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
          <div style="aspect-ratio: 1; background: var(--bg-surface-2); border-radius: var(--radius-sm); overflow: hidden; display:flex; align-items:center; justify-content:center;">
            ${m.mimeType.startsWith('image') 
              ? `<img src="/api/media/${m._id}/file" style="width:100%;height:100%;object-fit:cover;">`
              : `<div class="mono-text" style="font-size:0.6rem; color:var(--text-tertiary); text-align:center; padding:1rem;">${m.originalName}</div>`
            }
          </div>
          <div class="mono-text" style="font-size: 0.6rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${m.originalName}">${m.originalName}</div>
          <div class="flex justify-between">
            <button class="btn btn-copy" data-url="/api/media/${m._id}/file" style="padding: 0.2rem 0.5rem; font-size: 0.6rem;">Copy URL</button>
            <button class="btn btn-del" data-id="${m._id}" style="padding: 0.2rem 0.5rem; font-size: 0.6rem; color: var(--error); border-color: var(--error);">Del</button>
          </div>
        </div>
      `).join('');

      // Add listeners
      grid.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', () => {
          navigator.clipboard.writeText(btn.dataset.url);
          Toast.success('URL copied to clipboard');
        });
      });

      grid.querySelectorAll('.btn-del').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (confirm('Permanently delete this file?')) {
            try {
              await API.delete(`/api/media/${btn.dataset.id}`);
              Toast.success('File deleted');
              loadMedia();
            } catch(e) { Toast.error(e.message); }
          }
        });
      });

    } catch (err) {
      document.getElementById('media-grid').innerHTML = '<div class="mono-text" style="color:var(--error);">Failed to load media</div>';
    }
  };

  await loadMedia();

  // Upload handler
  document.getElementById('media-upload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const label = document.querySelector('label[for="media-upload"]');
    const origText = label.textContent;
    label.textContent = 'Uploading...';
    label.style.pointerEvents = 'none';

    try {
      await API.upload('/api/media/upload', formData);
      Toast.success('File uploaded successfully');
      e.target.value = '';
      loadMedia();
    } catch (err) {
      Toast.error(err.message);
    } finally {
      label.textContent = origText;
      label.style.pointerEvents = 'auto';
    }
  });
});