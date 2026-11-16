// Native disclosures remain usable without scripts; this adds keyboard conveniences.
document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = [...document.querySelectorAll('.salon-dropdown')];
  const close = (dropdown, restore = false) => {
    dropdown.open = false;
    if (restore) dropdown.querySelector('summary').focus();
  };
  dropdowns.forEach(dropdown => {
    const summary = dropdown.querySelector('summary');
    const items = [...dropdown.querySelectorAll('.dropdown-panel a, .dropdown-panel button')];
    dropdown.addEventListener('toggle', () => {
      if (dropdown.open) dropdowns.filter(other => other !== dropdown).forEach(other => close(other));
    });
    dropdown.addEventListener('keydown', event => {
      if (event.key === 'Escape' && dropdown.open) {
        event.preventDefault(); event.stopPropagation(); close(dropdown, true);
        return;
      }
      const index = items.indexOf(document.activeElement);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault(); dropdown.open = true;
        const active = items.findIndex(item => item.matches('[aria-current="page"],[aria-pressed="true"]'));
        const next = document.activeElement === summary ? Math.max(0, active) : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items[next]?.focus();
      } else if (dropdown.open && index >= 0 && ['Home','End'].includes(event.key)) {
        event.preventDefault(); items[event.key === 'Home' ? 0 : items.length - 1]?.focus();
      }
    });
  });
  const closeOutside = event => dropdowns.filter(dropdown => dropdown.open && !dropdown.contains(event.target)).forEach(dropdown => close(dropdown));
  document.addEventListener('click', closeOutside);
  document.addEventListener('focusin', closeOutside);

  const select = document.querySelector('#theme-select');
  const theme = document.querySelector('.theme-dropdown');
  if (!select || !theme || select.disabled) return;
  const buttons = [...theme.querySelectorAll('[data-theme-option]')];
  const synchronize = () => {
    const selected = buttons.find(button => button.dataset.themeOption === select.value);
    if (!selected) return;
    document.querySelector('#theme-current-label').textContent = selected.querySelector('.option-name').textContent;
    document.querySelector('#theme-current-icon').replaceChildren(selected.querySelector('.ui-icon').cloneNode(true));
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button === selected)));
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    select.value = button.dataset.themeOption;
    select.dispatchEvent(new Event('change', {bubbles: true}));
    synchronize(); close(theme, true);
  }));
  select.addEventListener('change', synchronize);
  new MutationObserver(synchronize).observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme','data-theme-preference']});
  synchronize(); select.hidden = true; theme.hidden = false;
  const label = document.querySelector('#theme-label');
  label.removeAttribute('for');
  label.addEventListener('click', () => theme.querySelector('summary').focus());
});
