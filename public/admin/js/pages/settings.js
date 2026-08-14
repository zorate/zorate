Router.add('/settings', async (container) => {
  container.innerHTML = `
    <h2 class="display-text" style="margin-bottom: 2rem;">Settings</h2>
    
    <div class="card" style="max-width: 500px;">
      <h3 class="mono-text" style="margin-bottom: 1.5rem; color: var(--accent);">SECURITY: CHANGE PASSWORD</h3>
      <form id="pwd-form">
        <div class="form-group">
          <label class="form-label">Current Password</label>
          <input type="password" id="cur-pwd" class="form-control" required>
        </div>
        <div class="form-group">
          <label class="form-label">New Password (min 8 chars)</label>
          <input type="password" id="new-pwd" class="form-control" required minlength="8">
        </div>
        <button type="submit" class="btn btn-primary">Update Password</button>
      </form>
    </div>
  `;

  document.getElementById('pwd-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await API.put('/api/admin/password', {
        currentPassword: document.getElementById('cur-pwd').value,
        newPassword: document.getElementById('new-pwd').value
      });
      Toast.success('Password updated successfully');
      e.target.reset();
    } catch (err) {
      Toast.error(err.message);
    }
  });
});