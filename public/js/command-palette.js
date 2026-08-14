// Command Palette (Ctrl+K)

document.addEventListener('DOMContentLoaded', () => {
  // Inject HTML for Command Palette
  const paletteHTML = `
    <div id="cmd-palette-backdrop" class="cmd-backdrop"></div>
    <div id="cmd-palette" class="cmd-palette">
      <div class="cmd-header">
        <input type="text" id="cmd-input" placeholder="Search systems or navigate... (Ctrl+K)" autocomplete="off">
      </div>
      <div class="cmd-results" id="cmd-results">
        <div class="cmd-group">
          <div class="cmd-group-label">Navigation</div>
          <a href="/" class="cmd-item">Home Surface</a>
          <a href="/projects" class="cmd-item">Systems & Projects</a>
          <a href="/lab" class="cmd-item">The Lab (Articles)</a>
          <a href="/about" class="cmd-item">About the Builder</a>
          <a href="/contact" class="cmd-item">Contact Protocol</a>
        </div>
        <div class="cmd-group" id="cmd-dynamic-projects">
          <div class="cmd-group-label">Quick Links</div>
          <a href="/projects/kolva" class="cmd-item">Open Kolva Architecture</a>
          <a href="/projects/trustcheck" class="cmd-item">Open TrustCheck System</a>
          <a href="/zorate" class="cmd-item">Admin Access</a>
        </div>
      </div>
      <div class="cmd-footer">
        <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
        <span><kbd>Enter</kbd> to select</span>
        <span><kbd>Esc</kbd> to close</span>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', paletteHTML);

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .cmd-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px); z-index: 9998;
      opacity: 0; pointer-events: none; transition: opacity 0.2s;
    }
    .cmd-backdrop.active { opacity: 1; pointer-events: auto; }
    
    .cmd-palette {
      position: fixed; top: 15%; left: 50%; transform: translateX(-50%) scale(0.95);
      width: 90%; max-width: 600px;
      background: var(--bg-surface-1); border: 1px solid var(--border-bright);
      border-radius: var(--radius-md); box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      z-index: 9999; opacity: 0; pointer-events: none; transition: all 0.2s;
      display: flex; flex-direction: column; overflow: hidden;
    }
    .cmd-palette.active { opacity: 1; transform: translateX(-50%) scale(1); pointer-events: auto; }
    
    .cmd-header { padding: 1rem; border-bottom: 1px solid var(--border-subtle); }
    #cmd-input {
      width: 100%; background: transparent; border: none; color: var(--text-primary);
      font-family: var(--font-mono); font-size: 1rem; outline: none;
    }
    
    .cmd-results { max-height: 400px; overflow-y: auto; padding: 0.5rem 0; }
    .cmd-group { padding: 0.5rem 0; }
    .cmd-group-label {
      padding: 0 1rem 0.5rem; font-family: var(--font-mono); font-size: 0.65rem;
      color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.1em;
    }
    .cmd-item {
      display: block; padding: 0.75rem 1rem; color: var(--text-secondary);
      font-size: 0.9rem; text-decoration: none; border-left: 2px solid transparent;
    }
    .cmd-item:hover, .cmd-item.selected {
      background: var(--bg-surface-2); color: var(--text-primary); border-left-color: var(--accent);
    }
    
    .cmd-footer {
      padding: 0.75rem 1rem; border-top: 1px solid var(--border-subtle);
      display: flex; justify-content: space-between; font-family: var(--font-mono);
      font-size: 0.65rem; color: var(--text-tertiary); background: rgba(0,0,0,0.2);
    }
    kbd {
      background: var(--bg-surface-2); border: 1px solid var(--border-subtle);
      border-radius: 3px; padding: 0.1rem 0.4rem; font-size: 0.6rem;
    }
  `;
  document.head.appendChild(style);

  // Logic
  const backdrop = document.getElementById('cmd-palette-backdrop');
  const palette = document.getElementById('cmd-palette');
  const input = document.getElementById('cmd-input');
  const items = document.querySelectorAll('.cmd-item');
  let selectedIndex = 0;

  function togglePalette() {
    const isActive = palette.classList.contains('active');
    if (isActive) {
      palette.classList.remove('active');
      backdrop.classList.remove('active');
      input.blur();
    } else {
      palette.classList.add('active');
      backdrop.classList.add('active');
      input.value = '';
      filterItems('');
      setTimeout(() => input.focus(), 100);
    }
  }

  function filterItems(query) {
    const q = query.toLowerCase();
    let visibleItems = [];
    
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(q)) {
        item.style.display = 'block';
        item.classList.remove('selected');
        visibleItems.push(item);
      } else {
        item.style.display = 'none';
      }
    });

    if (visibleItems.length > 0) {
      selectedIndex = 0;
      visibleItems[0].classList.add('selected');
    }
  }

  // Event Listeners
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      togglePalette();
    }
    if (e.key === 'Escape' && palette.classList.contains('active')) {
      togglePalette();
    }
  });

  backdrop.addEventListener('click', togglePalette);

  input.addEventListener('input', (e) => filterItems(e.target.value));

  input.addEventListener('keydown', (e) => {
    const visibleItems = Array.from(items).filter(i => i.style.display !== 'none');
    if (visibleItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      visibleItems[selectedIndex].classList.remove('selected');
      selectedIndex = (selectedIndex + 1) % visibleItems.length;
      visibleItems[selectedIndex].classList.add('selected');
      visibleItems[selectedIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      visibleItems[selectedIndex].classList.remove('selected');
      selectedIndex = (selectedIndex - 1 + visibleItems.length) % visibleItems.length;
      visibleItems[selectedIndex].classList.add('selected');
      visibleItems[selectedIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      window.location.href = visibleItems[selectedIndex].getAttribute('href');
    }
  });

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      items.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      const visibleItems = Array.from(items).filter(i => i.style.display !== 'none');
      selectedIndex = visibleItems.indexOf(item);
    });
  });
});