(() => {
  'use strict';
  const find = selector => document.querySelector(selector);
  const all = selector => [...document.querySelectorAll(selector)];
  const photos = JSON.parse(find('#gallery-data').textContent);
  const dialog = find('#photo-dialog');
  let selectedFilter = 'all';
  let currentId = photos[0].id;
  let currentScope = photos.map(p => p.id);
  let previousOverflow = '';
  let opener = null;
  function filterBy(kind) {
    selectedFilter = kind;
    all('[data-gallery-filter]').forEach(button => {
      const selected = button.dataset.galleryFilter === kind;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed',String(selected));
    });
    let count = 0;
    all('.gallery-card').forEach(card => {
      card.hidden = kind !== 'all' && card.dataset.photoKind !== kind;
      if(!card.hidden)count++;
    });
    find('#gallery-count').textContent = count === 6 ? "6 Bilder" : "3 Bilder";
  }
  function renderPhoto(id) {
    currentId = id;
    const photo = photos.find(p => p.id === id);
    const image = find('#photo-large');
    image.src = photo.src;
    image.alt = photo.alt;
    image.width = photo.width;
    image.height = photo.height;
    find('#photo-dialog-type').textContent = photo.label;
    find('#photo-dialog-type').className = 'gallery-badge '+photo.kind;
    find('#photo-title').textContent = photo.title;
    find('#photo-caption').textContent = photo.caption;
    find('#photo-origin').textContent = photo.credit;
    find('#photo-date').textContent = photo.date;
    find('#photo-position').textContent = `${currentScope.indexOf(id)+1} / ${currentScope.length}`;
    find('#photo-source').hidden = !photo.source;
    if(photo.source) {
      find('#photo-source').href = photo.source;
      find('#photo-source').textContent = photo.sourceLabel+' ↗';
    } else find('#photo-source').removeAttribute('href');
    find('#photo-download').href = photo.src;
    find('#photo-download').download = photo.src.split('/').pop();
    find('#photo-download').textContent = photo.kind === 'ai' ? "KI-Bild herunterladen ↓" : "Reproduktion herunterladen ↓";
    find('#photo-announcement').textContent = `${currentScope.indexOf(id)+1} von ${currentScope.length}. ${photo.title} ${photo.label}`;
  }
  function openPhoto(id,button) {
    currentScope=photos.filter(p=>selectedFilter==='all'||p.kind===selectedFilter).map(p=>p.id);
    if(!currentScope.includes(id))currentScope=photos.map(p=>p.id);
    opener=button;
    renderPhoto(id);
    previousOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    dialog.showModal();
    find('.photo-close').focus();
  }
  function step(direction) {
    const i=currentScope.indexOf(currentId);
    renderPhoto(currentScope[(i+direction+currentScope.length)%currentScope.length]);
  }
  all('[data-gallery-filter]').forEach(button=>button.addEventListener('click',()=>filterBy(button.dataset.galleryFilter)));
  all('[data-photo-open]').forEach(button=>button.addEventListener('click',()=>openPhoto(button.dataset.photoOpen,button)));
  find('.photo-close').addEventListener('click',()=>dialog.close());
  find('#photo-prev').addEventListener('click',()=>step(-1));
  find('#photo-next').addEventListener('click',()=>step(1));
  dialog.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'){event.preventDefault();step(-1);}
    if(event.key==='ArrowRight'){event.preventDefault();step(1);}
  });
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const rect=dialog.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();
  });
  dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;opener?.focus({preventScroll:true});});
})();
