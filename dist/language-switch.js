(() => {
  'use strict';
  // The URL is the language preference: root stays Slovak, links stay in their edition.
  // Preserve an in-page location when the visitor changes language.
  const links = [...document.querySelectorAll('.language-switch a')];
  const update = () => links.forEach(link => {
    const target = new URL(link.href);
    target.hash = window.location.hash;
    link.href = target.href;
  });
  update();
  window.addEventListener('hashchange', update);
})();
