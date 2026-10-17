// Apply the theme before styles load to avoid a flash when changing pages.
(() => {
  const key = 'rakam-color-theme';
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const readPreference = () => {
    try {
      const saved = localStorage.getItem(key);
      return saved === 'light' || saved === 'dark' ? saved : null;
    } catch { return null; }
  };
  let preference = readPreference();
  function apply(theme) {
    root.dataset.theme = theme;
    const dark = theme === 'dark';
    const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
      button.setAttribute('aria-pressed', String(dark));
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#101a19' : '#f8f7f2';
  }
  apply(preference || (system.matches ? 'dark' : 'light'));
  document.addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.theme);
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.addEventListener('click', () => {
        preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem(key, preference); } catch { /* Session-only fallback. */ }
        apply(preference);
      });
    });
  });
  system.addEventListener('change', event => {
    if (!preference) apply(event.matches ? 'dark' : 'light');
  });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      preference = readPreference();
      apply(preference || (system.matches ? 'dark' : 'light'));
    }
  });
})();
