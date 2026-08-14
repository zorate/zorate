// Core JS for public site

document.addEventListener('DOMContentLoaded', () => {
  // Navigation active state
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === '/' && currentPath === '/') {
      link.classList.add('active');
    } else if (href !== '/' && currentPath.startsWith(href)) {
      link.classList.add('active');
    }
  });

  // Health check polling
  const statusDot = document.querySelector('.status-dot');
  const statusText = document.querySelector('.status-text');
  
  if (statusDot && statusText) {
    async function checkHealth() {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'operational') {
            statusDot.classList.remove('offline');
            statusText.textContent = 'SYSTEM ONLINE';
          } else {
            statusDot.classList.add('offline');
            statusText.textContent = 'SYSTEM DEGRADED';
          }
        } else {
          statusDot.classList.add('offline');
          statusText.textContent = 'SYSTEM OFFLINE';
        }
      } catch (err) {
        statusDot.classList.add('offline');
        statusText.textContent = 'SYSTEM UNREACHABLE';
      }
    }
    
    // Initial check and set interval
    checkHealth();
    setInterval(checkHealth, 60000); // Check every minute
  }
});

// Format date helper
function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}