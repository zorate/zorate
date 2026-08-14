Router.add('/login', async (container) => {
  container.innerHTML = `
    <div style="width: 100%; max-width: 400px; padding: 2rem; background: var(--bg-surface-1); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
      <h1 class="mono-text" style="color: var(--accent); margin-bottom: 2rem; text-align: center; letter-spacing: 0.1em;">ZØR-ATÉ // CONTROL</h1>
      <form id="login-form">
        <div class="form-group">
          <label class="form-label" for="email">Email</label>
          <input type="email" id="email" class="form-control" required>
        </div>
        <div class="form-group" style="margin-bottom: 2rem;">
          <label class="form-label" for="password">Password</label>
          <input type="password" id="password" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">AUTHENTICATE</button>
      </form>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'VERIFYING...';
    btn.disabled = true;

    await Auth.login(
      document.getElementById('email').value,
      document.getElementById('password').value
    );

    btn.textContent = originalText;
    btn.disabled = false;
  });
});