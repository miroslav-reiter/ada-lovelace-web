// Apply saved reading preferences before the first paint, without cookies.
(() => {
  try {
    const saved=JSON.parse(localStorage.getItem('ada-reading-v1')||'{}');
    const root=document.documentElement;
    if([100,125,150,200].includes(saved?.size))root.dataset.readingSize=String(saved.size);
    if(saved?.calm===true)root.dataset.readingCalm='true';
    if(saved?.motion===true)root.dataset.readingMotion='true';
  } catch { /* Unavailable storage does not prevent reading. */ }
})();
