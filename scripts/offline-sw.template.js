/* Explicitly saved, same-origin educational content only. Never cache authentication or APIs. */
const VERSION='__VERSION__',PACKS=__PACKS__,PREFIX='ada-studio-offline-',BUSY=new Set();
const name=lang=>PREFIX+lang+'-'+VERSION;
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('message',event=>{
  const {type,lang}=event.data||{},port=event.ports[0];
  if(!port||!PACKS[lang]||!['SAVE','CHECK','REMOVE'].includes(type))return;
  event.waitUntil((async()=>{
    if(BUSY.has(lang)){port.postMessage({type:'error',error:'busy'});return;}
    BUSY.add(lang);let staging;
    try{
      const final=name(lang),urls=PACKS[lang];
      if(type==='SAVE'){
        staging=final+'-pending-'+Date.now();const cache=await caches.open(staging);let done=0;
        for(const url of urls){
          const response=await fetch(new Request(url,{cache:'reload',credentials:'same-origin'}));
          const finalURL=new URL(response.url);
          if(!response.ok||response.type==='opaque'||finalURL.origin!==location.origin||finalURL.pathname!==new URL(url,location.origin).pathname)throw Error('Incomplete pack');
          await cache.put(url,response);port.postMessage({type:'progress',done:++done,total:urls.length});
        }
        // An intact previous version remains available until every response is fetched.
        const target=await caches.open(final);
        for(const url of urls)await target.put(url,await cache.match(url));
        await caches.delete(staging);staging=null;
        for(const old of await caches.keys())if(old.startsWith(PREFIX+lang+'-')&&old!==final)await caches.delete(old);
        port.postMessage({type:'done',status:'ready'});
      }else if(type==='REMOVE'){
        for(const old of await caches.keys())if(old.startsWith(PREFIX+lang+'-'))await caches.delete(old);
        port.postMessage({type:'done',status:'removed'});
      }else{
        let complete=false;
        if((await caches.keys()).includes(final)){
          const cache=await caches.open(final);complete=true;
          for(const url of urls)if(!await cache.match(url)){complete=false;break;}
        }
        port.postMessage({type:'done',status:complete?'ready':'empty'});
      }
    }catch(error){if(staging)await caches.delete(staging);port.postMessage({type:'error',error:String(error)});}
    finally{BUSY.delete(lang);}
  })());
});
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==location.origin||url.pathname.startsWith('/api/')||url.pathname.startsWith('/__'))return;
  const path=url.pathname,allowed=Object.values(PACKS).some(urls=>urls.includes(path));
  if(!allowed)return;
  event.respondWith((async()=>{
    try{return await fetch(request);}catch(error){
      const keys=(await caches.keys()).filter(key=>key.startsWith(PREFIX)&&!key.includes('-pending-'));
      // Current version first; retained previous packages remain useful until refreshed.
      keys.sort((a,b)=>Number(b.endsWith(VERSION))-Number(a.endsWith(VERSION)));
      for(const key of keys){const hit=await (await caches.open(key)).match(path);if(hit)return hit;}
      throw error;
    }
  })());
});
