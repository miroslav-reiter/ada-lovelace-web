import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const origin='http://localhost',events={},memory=new Map();
const canonical=url=>new URL(typeof url==='string'?url:url.url,origin).pathname;
const storage={
  keys:async()=>[...memory.keys()],
  delete:async key=>memory.delete(key),
  open:async key=>{if(!memory.has(key))memory.set(key,new Map());const map=memory.get(key);return {put:async(url,response)=>map.set(canonical(url),response),match:async url=>map.get(canonical(url))};}
};
let online=true,failedPath=null,htmlRedirect=null;
const response=url=>({ok:true,status:200,type:'basic',url:new URL(canonical(url).endsWith('.html')&&htmlRedirect?htmlRedirect(url):url,origin).href,text:'cached '+canonical(url)});
const context={URL,Date,Set,console,location:{origin},caches:storage,Request:class{constructor(url){this.url=new URL(url,origin).href;this.method='GET';}},fetch:async req=>{const url=typeof req==='string'?req:req.url;if(!online||canonical(url)===failedPath)throw Error('offline');return response(url);},self:{addEventListener:(type,fn)=>events[type]=fn,skipWaiting:()=>{},clients:{claim:async()=>{}}}};
vm.runInNewContext(fs.readFileSync(new URL('../dist/offline-sw.js',import.meta.url),'utf8'),context);
const manifest=JSON.parse(fs.readFileSync(new URL('../dist/offline-manifest.json',import.meta.url)));
async function message(type,lang){const replies=[];let promise;events.message({data:{type,lang},ports:[{postMessage:value=>replies.push(value)}],waitUntil:p=>promise=p});await promise;return replies;}
async function request(path,method='GET'){let result;events.fetch({request:{url:origin+path,method},respondWith:p=>result=p});return result;}
for(const lang of ['sk','cs','en','de','es']){
  assert.equal((await message('CHECK',lang)).at(-1).status,'empty');
  assert.equal((await message('SAVE',lang)).at(-1).status,'ready');
  assert.equal((await message('CHECK',lang)).at(-1).status,'ready');
}
htmlRedirect=url=>url.slice(0,-5);
for(const lang of ['sk','cs','en','de','es'])assert.equal((await message('SAVE',lang)).at(-1).status,'ready');
htmlRedirect=()=>'/login';
assert.equal((await message('SAVE','sk')).at(-1).type,'error');
assert.equal((await message('CHECK','sk')).at(-1).status,'ready');
htmlRedirect=url=>'https://other.example'+canonical(url).slice(0,-5);
assert.equal((await message('SAVE','sk')).at(-1).type,'error');
htmlRedirect=url=>url.slice(0,-5);
online=false;
assert.ok((await request('/en/search/?q=ada')).text.includes('/en/search/'));
assert.ok((await request('/locales/es/quiz-bank.json')).text.includes('quiz-bank'));
assert.ok((await request('/downloads/ada-worksheet-sk.pdf')).text.includes('worksheet'));
assert.ok((await request('/downloads/ada-solutions-sk.html')).text.includes('solutions'));
assert.ok((await request('/downloads/ada-solutions-sk')).text.includes('solutions'));
assert.equal(await request('/api/private'),undefined);
assert.equal(await request('/not-in-pack/'),undefined);
assert.equal(await request('/en/search/','POST'),undefined);
assert.equal((await message('SAVE','sk')).at(-1).type,'error');
assert.equal((await message('CHECK','sk')).at(-1).status,'ready');
assert.ok(!(await storage.keys()).some(key=>key.includes('-pending-')));
online=true;await storage.open('unrelated-application');
await message('REMOVE','es');assert.equal((await message('CHECK','es')).at(-1).status,'empty');assert.equal((await message('CHECK','de')).at(-1).status,'ready');assert.ok(memory.has('unrelated-application'));
failedPath=manifest.packs.es.at(-1);assert.equal((await message('SAVE','es')).at(-1).type,'error');assert.equal((await message('CHECK','es')).at(-1).status,'empty');
assert.deepEqual(await message('SAVE','xx'),[]);
console.log('PASS: five packs, canonical HTML redirects and offline aliases, rejected login and cross-origin redirects, saved-file fallback, partial failure, retained prior copy, isolated removal and API/POST exclusion.');
