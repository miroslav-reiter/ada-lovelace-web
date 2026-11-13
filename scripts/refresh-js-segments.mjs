// Rebuild translation positions after editing the JavaScript templates.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const {parse} = await import(process.argv[2] ? pathToFileURL(path.resolve(process.argv[2])).href : 'acorn');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'i18n');
const catalog = JSON.parse(fs.readFileSync(path.join(root,'catalog.json'),'utf8'));
const ids = new Map(catalog.map(row=>[row.source,row.id]));
const uiTexts = JSON.parse(fs.readFileSync(path.join(root,'js-texts.json'),'utf8'));
const segments = {};
const hashes = {};
for (const file of ['app.js','pages.js','gallery.js']) {
  const code=fs.readFileSync(path.join(root,'templates',file),'utf8').replace(/\r\n/g,'\n');
  const entries=[];
  const allowed=new Set(uiTexts[file]);
  hashes[file]=createHash('sha256').update(code).digest('hex');
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    if (node.type==='Literal' && typeof node.value==='string' && allowed.has(node.value) && ids.has(node.value.trim())) {
      entries.push({start:node.start,end:node.end,kind:'literal',source:node.value,id:ids.get(node.value.trim())});
    }
    if (node.type==='TemplateLiteral') {
      const value=node.quasis.map((q,i)=>q.value.cooked+(i<node.expressions.length?'{'+i+'}':'')).join('');
      if(allowed.has(value) && ids.has(value.trim())) entries.push({start:node.start,end:node.end,kind:'template',source:value,id:ids.get(value.trim()),expressions:node.expressions.map(e=>code.slice(e.start,e.end)),expressionRanges:node.expressions.map(e=>({start:e.start,end:e.end}))});
    }
    for(const [key,value] of Object.entries(node)) {
      if(key==='start'||key==='end')continue;
      if(Array.isArray(value))value.forEach(visit);
      else if(value && typeof value==='object')visit(value);
    }
  }
  visit(parse(code,{ecmaVersion:'latest'}));
  segments[file]=entries;
}
fs.writeFileSync(path.join(root,'js-segments.json'),JSON.stringify(segments,null,2)+'\n');
fs.writeFileSync(path.join(root,'js-source-hashes.json'),JSON.stringify(hashes,null,2)+'\n');
console.log('Updated JavaScript translation positions and source hashes.');
