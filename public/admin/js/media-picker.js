const MediaPicker = {
  onSelect: null,
  
  init() {
    this.modal = document.getElementById('media-modal');
    this.grid = document.getElementById('media-modal-grid');
    
    document.querySelector('.btn-close-modal').addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
  },

  async open(callback) {
    this.onSelect = callback;
    this.modal.classList.add('active');
    await this.loadMedia();
  },

  close() {
    this.modal.classList.remove('active');
    this.onSelect = null;
  },

  async loadMedia() {
    this.grid.innerHTML = '<div class="mono-text">Loading assets...</div>';
    try {
      const data = await API.get('/api/media?limit=50');
      
      if (data.items.length === 0) {
        this.grid.innerHTML = '<div class="mono-text">No assets found.</div>';
        return;
      }

      this.grid.innerHTML = data.items.map(m => `
        <div class="media-item" data-id="${m._id}" data-url="/api/media/${m._id}/file">
          ${m.mimeType.startsWith('image') 
            ? `<img src="/api/media/${m._id}/file" alt="${m.altText || ''}" loading="lazy">` 
            : `<div style="display:flex;height:100%;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:0.7rem;color:var(--text-tertiary);text-align:center;">${m.originalName}</div>`
          }
        </div>
      `).join('');

      this.grid.querySelectorAll('.media-item').forEach(item => {
        item.addEventListener('click', () => {
          if (this.onSelect) {
            this.onSelect(item.dataset.id, item.dataset.url);
            this.close();
          }
        });
      });
    } catch (err) {
      this.grid.innerHTML = '<div class="mono-text" style="color:var(--error);">Failed to load media</div>';
    }
  }
};