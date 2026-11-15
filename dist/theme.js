// Resolve the appearance before styles render. Preferences never leave the browser.
(() => {
  const key = 'ada-theme-v1';
  const root = document.documentElement;
  const normalize = value => ['light', 'dark', 'system'].includes(value) ? value : 'system';
  let preference = 'system';
  try { preference = normalize(localStorage.getItem(key)); } catch { /* Use the system without storage. */ }
  const media = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  let select, status;
  function apply(announce = false, storageAvailable = true) {
    const resolved = preference === 'system' ? (media?.matches ? 'dark' : 'light') : preference;
    root.dataset.theme = resolved;
    root.dataset.themePreference = preference;
    if (!select) return;
    select.value = preference;
    const label = select.querySelector('option[value="' + resolved + '"]').textContent;
    const message = preference === 'system' ? select.dataset.systemStatus.replace('{0}', label) : label;
    if (announce) status.textContent = message + (storageAvailable ? '' : ' ' + select.dataset.storageNotice);
  }
  apply();
  const changed = () => { if (preference === 'system') apply(true); };
  if (media?.addEventListener) media.addEventListener('change', changed);
  else if (media?.addListener) media.addListener(changed);
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    preference = normalize(event.key === null ? null : event.newValue);
    apply(true);
  });
  document.addEventListener('DOMContentLoaded', () => {
    select = document.querySelector('#theme-select');
    status = document.querySelector('#theme-status');
    if (!select || !status) return;
    select.disabled = false;
    apply();
    select.addEventListener('change', () => {
      preference = normalize(select.value);
      let available = true;
      try { localStorage.setItem(key, preference); } catch { available = false; }
      apply(true, available);
    });
  }, {once: true});
})();
