document.addEventListener('DOMContentLoaded', () => {
  MediaPicker.init();

  document.getElementById('btn-logout').addEventListener('click', () => {
    Auth.logout();
  });

  document.querySelectorAll('a[data-route]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      Router.navigate(link.getAttribute('href').replace('/zorate', ''));
    });
  });

  // Initial load
  if (!window.location.hash) {
    window.location.hash = '#/dashboard';
  } else {
    Router.handle();
  }
});