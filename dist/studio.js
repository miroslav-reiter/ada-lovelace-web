import {normalize,search,lessonPlan,freshQuiz,validQuiz,incorrectIds,downloadPath} from './studio-core.mjs';
const root=document.querySelector('[data-studio]');
if(root) init().catch(()=>{const status=document.querySelector('#studio-status');if(status)status.textContent=data().strings['load.error'];});
function data(){return JSON.parse(document.querySelector('#studio-data').textContent);}
async function init(){
  const {lang,strings:t,urls,routes}=data(),kind=root.dataset.studio;
  const $=id=>document.getElementById(id),txt=(key,vars={})=>String(t[key]).replace(/\{(\w+)\}/g,(_,k)=>String(vars[k]));
  const say=(value)=>{if($('studio-status'))$('studio-status').textContent=value;};
  const node=(tag,text,attrs={})=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,String(v)));return e;};
  const action=(label,handler)=>{const b=node('button',label,{type:'button'});b.addEventListener('click',handler);return b;};
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
  const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{let warning=$('storage-warning');if(!warning){warning=node('p',undefined,{id:'storage-warning',role:'status'});root.prepend(warning);}warning.textContent=t['storageFail'];return false;}};
  const source=(url)=>node('a',t.source,{href:url,class:'learn-source'});
  const getJSON=async(url)=>{const r=await fetch(url);if(!r.ok)throw Error('Data unavailable');return r.json();};
  const headingFocus=e=>{e.tabIndex=-1;e.focus();};

  if(kind==='hub'){
    let completed=read('ada-journeys-v1',[]);
    if(!Array.isArray(completed))completed=[];
    const draw=()=>{for(let role=0;role<3;role++)$(`route-progress-${role}`).textContent=txt('journey.progress',{done:[0,1,2].filter(s=>completed.includes(`${role}:${s}`)).length,total:3});};
    document.querySelectorAll('[data-route]').forEach(input=>{const key=input.dataset.route+':'+input.dataset.step;input.checked=completed.includes(key);input.addEventListener('change',()=>{completed=completed.filter(x=>x!==key);if(input.checked)completed.push(key);draw();say($(`route-progress-${input.dataset.route}`).textContent);save('ada-journeys-v1',completed);});});draw();
  }
  if(kind==='downloads'){
    // Fetch first so saved documents also work in browsers that bypass workers for direct downloads.
    root.addEventListener('click',async event=>{
      const link=event.target.closest('a[download]');
      if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0)return;
      const url=new URL(link.href);if(url.origin!==location.origin||!url.pathname.startsWith('/downloads/'))return;
      event.preventDefault();
      try{const response=await fetch(url);if(!response.ok)throw Error('Download unavailable');
        const blobURL=URL.createObjectURL(await response.blob()),a=node('a',undefined,{href:blobURL,download:url.pathname.split('/').pop()});document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(blobURL),1000);
      }catch{$('download-summary').textContent=t['download.error'];}
    });
    $('download-language').value=lang;
    const draw=()=>{const code=$('download-language').value,doc=$('download-kind').value,ext=$('download-format').value;
      const path=downloadPath(code,doc,ext);$('download-selected').href=path;$('download-selected').download=path.split('/').pop();
      const pack=`ada-materials-${code}.zip`;$('download-pack').href='/downloads/'+pack;$('download-pack').download=pack;
      $('download-summary').textContent=[...['download-language','download-kind','download-format'].map(id=>$(id).selectedOptions[0].textContent)].join(' · ');
    };['download-language','download-kind','download-format'].forEach(id=>$(id).addEventListener('change',draw));draw();
  }
  if(kind==='search'){
    const records=await getJSON(`/locales/${lang}/search.json`);
    const run=()=>{const query=$('search-query').value.trim();const matches=search(records,query);$('search-results').replaceChildren();
      matches.forEach(record=>{const li=node('li'),h=node('h2'),term=normalize(query).split(/\s+/)[0],at=normalize(record.text).indexOf(term),start=Math.max(0,at-60);h.append(node('a',record.title,{href:record.url}));li.append(h,node('p',(start?'…':'')+record.text.slice(start,start+230)+(record.text.length>start+230?'…':'')));$('search-results').append(li);});
      say(query?(matches.length?txt('search.count',{count:matches.length}):t['search.empty']):t['search.hint']);
      const url=new URL(location.href);if(query)url.searchParams.set('q',query);else url.searchParams.delete('q');history.replaceState(null,'',url);
    };
    $('search-form').addEventListener('submit',e=>{e.preventDefault();run();});
    let timer;$('search-query').addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(run,220);});
    $('search-query').value=new URL(location.href).searchParams.get('q')||'';run();
    $('search-query').disabled=false;$('search-form').querySelector('button').disabled=false;
  }
  if(kind==='practice'){
    const bank=await getJSON(`/locales/${lang}/quiz-bank.json`),key='ada-practice-v1';
    let state=read(key,null);if(!validQuiz(state)||!state.ids.every((id,i)=>state.answers[i]===undefined||state.answers[i]<bank[id].options.length))state=freshQuiz();
    $('quiz-level').value=state.level;
    function draw(focus=false){
      const panel=$('practice-stage');panel.hidden=false;panel.replaceChildren();$('quiz-retry').hidden=true;
      if(state.position>=state.ids.length){
        const wrong=incorrectIds(state,bank),h=node('h2',t['quiz.finished']);panel.append(h,node('p',txt('quiz.score',{score:state.ids.length-wrong.length,total:state.ids.length})));
        const review=node('details'),summary=node('summary',t['quiz.review']),list=node('ol');review.append(summary,list);
        state.ids.forEach((id,i)=>{const q=bank[id],li=node('li');li.append(node('h3',q.q),node('p',(state.answers[i]===q.correct?t.correct:t['quiz.wrong'])+' '+q.options[q.correct]),node('p',q.why),source(q.source));list.append(li);});panel.append(review);
        $('quiz-retry').hidden=!wrong.length;if(!wrong.length)panel.append(node('p',t['quiz.allCorrect']));if(focus)headingFocus(h);return;
      }
      const q=bank[state.ids[state.position]],h=node('h2',q.q),position=node('p',txt('quiz.position',{current:state.position+1,total:state.ids.length}));
      h.id='practice-question';panel.append(position,h);
      const answers=node('div',undefined,{class:'studio-answers',role:'group','aria-labelledby':h.id});panel.append(answers);
      const feedback=node('div',undefined,{class:'studio-feedback',role:'status','aria-live':'polite','aria-atomic':'true'});feedback.hidden=true;panel.append(feedback);
      const next=action(t.next,()=>{state.position++;save(key,state);say('');draw(true);});next.hidden=true;panel.append(next);
      function reveal(){
        const answer=state.answers[state.position];if(answer===undefined)return;
        [...answers.children].forEach((b,i)=>{b.setAttribute('aria-disabled','true');if(i===q.correct)b.dataset.answer='correct';else if(i===answer)b.dataset.answer='wrong';});
        feedback.replaceChildren(node('p',(answer===q.correct?t.correct:t['quiz.wrong'])+' '+q.why),source(q.source));feedback.hidden=false;next.hidden=false;
      }
      q.options.forEach((label,i)=>answers.append(action(label,()=>{if(state.answers[state.position]!==undefined)return;state.answers.push(i);save(key,state);reveal();})));
      reveal();if(focus)headingFocus(h);
    }
    $('quiz-start').addEventListener('click',()=>{state=freshQuiz(Number($('quiz-level').value));save(key,state);say('');draw(true);});
    $('quiz-retry').addEventListener('click',()=>{const wrong=incorrectIds(state,bank);if(wrong.length){state=freshQuiz(state.level,wrong);save(key,state);draw(true);}});
    $('quiz-clear').addEventListener('click',()=>{state=freshQuiz(Number($('quiz-level').value));try{localStorage.removeItem(key);}catch{say(t.storageFail);}draw(true);});draw();
    ['quiz-level','quiz-start','quiz-retry','quiz-clear'].forEach(id=>$(id).disabled=false);
  }
  if(kind==='detective'){
    const key='ada-detective-v1';let stage=read(key,0);if(!Number.isInteger(stage)||stage<0||stage>3)stage=0;
    const answers=[['1815','1843','1983'],[t['game.fake1'],t['game.real'],t['game.fake2']],['-1/6','1/6','3/2']];
    function draw(focus=false){
      const panel=$('detective-stage');panel.replaceChildren();
      if(stage===3){const h=node('h2',t['game.finish']);panel.append(h,node('p',t['game.solution']));if(focus)headingFocus(h);return;}
      const h=node('h2',t['game.clue'+stage]);h.id='clue-title';panel.append(node('p',txt('game.step',{current:stage+1})),h,node('p',t['game.text'+stage]));
      const hint=node('details');hint.append(node('summary',t['game.hint']),node('p',t['game.hint'+stage]));panel.append(hint,source(routes[stage===2?12:4]));
      const opts=node('div',undefined,{class:'studio-answers',role:'group','aria-labelledby':h.id});panel.append(opts);
      const feedback=node('p',undefined,{role:'status','aria-live':'polite'});panel.append(feedback);let solved=false;
      const next=action(t.next,()=>{if(!solved)return;stage++;save(key,stage);draw(true);});next.hidden=true;panel.append(next);
      answers[stage].forEach((label,i)=>opts.append(action(label,()=>{if(solved)return;if(i!==1){feedback.textContent=t.wrong;return;}solved=true;feedback.textContent=t.correct;[...opts.children].forEach(b=>b.setAttribute('aria-disabled','true'));next.hidden=false;})));
      if(focus)headingFocus(h);
    }
    $('game-reset').addEventListener('click',()=>{stage=0;save(key,0);draw(true);});draw();
  }
  if(kind==='lesson'){
    let current;
    const edit=(tag,text,label)=>node(tag,text,{contenteditable:'plaintext-only',role:'textbox','aria-label':label,'aria-multiline':'true'});
    function draw(){
      current=lessonPlan($('lesson-duration').value,$('lesson-age').value,$('lesson-topic').value);
      const {minutes,age,topic,stages}=current,panel=$('lesson-plan');panel.replaceChildren();
      panel.append(node('h2',t['lesson.topic'+topic]+' · '+minutes+' min'),node('p',t['lesson.age']+': '+$('lesson-age').selectedOptions[0].textContent));
      panel.append(node('h3',t['lesson.goal']),edit('p',t['lesson.goal'+topic],t['lesson.goal']));
      const titles=t['lesson.stages'].split(';'),activities=t['lesson.activity'+topic].split(';'),list=node('ol');panel.append(list);
      stages.forEach((time,i)=>{const li=node('li');li.append(node('h3',`${time.start} - ${time.end} min · ${titles[i]}`),edit('p',activities[i]+(minutes===90&&i===2?' '+t['lesson.extension']:''),titles[i]));list.append(li);});
      panel.append(node('h3',t['lesson.adaptation']),edit('p',t['lesson.adapt'+age],t['lesson.adaptation']),node('h3',t['lesson.resources']));
      const resources=node('ul');[topic===0?7:topic===1?8:15,18,21].forEach(index=>{const li=node('li');const labels=index>=17?t[['hub','downloads','search','practice','detective','lesson','offline','access'][index-17]+'.title']:t['lesson.topic'+topic];li.append(node('a',labels,{href:routes[index]}));resources.append(li);});panel.append(resources);
      $('lesson-output').hidden=false;say(txt('lesson.ready',{minutes}));
    }
    $('lesson-form').addEventListener('submit',e=>{e.preventDefault();draw();headingFocus($('lesson-plan').querySelector('h2'));});
    $('lesson-print').addEventListener('click',()=>window.print());
    $('lesson-save').addEventListener('click',()=>{
      const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      const parts=[...$('lesson-plan').children].map(e=>{
        if(e.tagName==='OL')return '<ol>'+[...e.children].map(li=>'<li><h3>'+escape(li.querySelector('h3').textContent)+'</h3><p contenteditable="true">'+escape(li.querySelector('p').textContent)+'</p></li>').join('')+'</ol>';
        if(e.tagName==='UL')return '<ul>'+[...e.querySelectorAll('a')].map(a=>'<li><a href="'+escape(new URL(a.getAttribute('href'),location.href).href)+'">'+escape(a.textContent)+'</a></li>').join('')+'</ul>';
        const tag=e.tagName==='H2'?'h1':e.tagName.toLowerCase();return '<'+tag+(e.hasAttribute('contenteditable')?' contenteditable="true"':'')+'>'+escape(e.textContent)+'</'+tag+'>';
      }).join('');
      const html='<!doctype html><html lang="'+lang+'"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(t['lesson.title'])+'</title><style>body{max-width:850px;margin:2rem auto;padding:1rem;font:18px/1.7 system-ui;color:#20251e;background:white}h2,h3{line-height:1.3}li{margin-bottom:1rem}@media print{body{font-size:12pt}}</style><main>'+parts+'</main></html>';
      const blobURL=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'})),a=node('a',undefined,{href:blobURL,download:`ada-lesson-${lang}-${current.minutes}min.html`});document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(blobURL),1000);
    });
  }
  if(kind==='offline'){
    if(!('serviceWorker' in navigator)||!window.isSecureContext){say(t['offline.unsupported']);['save','check','remove'].forEach(x=>$('offline-'+x).disabled=true);return;}
    let worker;
    async function ready(refresh=false){
      if(worker&&!refresh)return worker;
      let registration=await navigator.serviceWorker.getRegistration('/');
      if(!registration)registration=await navigator.serviceWorker.register('/offline-sw.js',{scope:'/'});
      else if(refresh)await registration.update();
      if(registration.installing){const installing=registration.installing;await new Promise((resolve,reject)=>{const check=()=>{if(installing.state==='activated')resolve();else if(installing.state==='redundant')reject(Error('Worker failed'));};installing.addEventListener('statechange',check);check();});}
      await navigator.serviceWorker.ready;
      // Activation is immediate for this opt-in, cache-only learning worker.
      worker=registration.active||navigator.serviceWorker.controller;
      if(!worker)throw Error('Worker unavailable');return worker;
    }
    async function send(type){
      ['save','check','remove'].forEach(x=>$('offline-'+x).disabled=true);
      try{const target=await ready(type==='SAVE');await new Promise((resolve,reject)=>{const channel=new MessageChannel();let timeout;
        const resetTimer=()=>{clearTimeout(timeout);timeout=setTimeout(()=>{channel.port1.close();reject(Error('Timeout'));},60000);};resetTimer();
        channel.port1.onmessage=event=>{const m=event.data;resetTimer();if(m.type==='progress'){$('offline-progress').hidden=false;$('offline-progress').max=m.total;$('offline-progress').value=m.done;say(txt('offline.wait',m));return;}
          clearTimeout(timeout);channel.port1.close();$('offline-progress').hidden=true;
          if(m.type==='error'){reject(Error(m.error));return;}say(t['offline.'+m.status]);resolve();};
        target.postMessage({type,lang},[channel.port2]);
      });}catch{say(t['offline.error']);}finally{['save','check','remove'].forEach(x=>$('offline-'+x).disabled=false);}
    }
    $('offline-save').addEventListener('click',()=>send('SAVE'));$('offline-check').addEventListener('click',()=>send('CHECK'));$('offline-remove').addEventListener('click',()=>send('REMOVE'));
    const existing=await navigator.serviceWorker.getRegistration('/');
    if(existing?.active){worker=existing.active;await send('CHECK');}else say(t['offline.empty']);
  }
}
