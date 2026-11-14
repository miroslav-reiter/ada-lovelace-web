import {commands,initialMachine,stepMachine,diplomaRank} from './machine-core.mjs';
const data=JSON.parse(document.querySelector('#experience-data')?.textContent||'{}');
const t=(key,...values)=>(data[key]||key).replace(/\{(\d+)\}/g,(_,i)=>String(values[Number(i)]??''));
const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];

// Reading preferences are local to the visitor's browser.
const root=document.documentElement;
const size=$('#reading-size'),calm=$('#reading-calm'),motion=$('#reading-motion');
if(size){
  size.value=root.dataset.readingSize||'100';
  calm.checked=root.dataset.readingCalm==='true';
  motion.checked=root.dataset.readingMotion==='true';
  const apply=()=>{
    root.dataset.readingSize=size.value;
    root.dataset.readingCalm=String(calm.checked);
    root.dataset.readingMotion=String(motion.checked);
    let message='read.saved';
    try{localStorage.setItem('ada-reading-v1',JSON.stringify({size:Number(size.value),calm:calm.checked,motion:motion.checked}));}
    catch{message='read.storage';}
    $('#reading-status').textContent=t(message);
  };
  [size,calm,motion].forEach(control=>control.addEventListener('change',apply));
  $('#reading-reset').addEventListener('click',()=>{size.value='100';calm.checked=false;motion.checked=false;apply();});
}

// The timeline preserves the chosen event when the language is switched.
const years=$$('[data-year]');
if(years.length){
  let selected=0;
  function showYear(index,updateHash=false){
    selected=Math.max(0,Math.min(years.length-1,index));
    const year=years[selected].dataset.year;
    $$('[data-event]').forEach(article=>{article.hidden=article.dataset.event!==year;});
    years.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===selected)));
    $('#timeline-position').textContent=t('timeline.position',selected+1,years.length);
    $('#timeline-previous').disabled=selected===0;
    $('#timeline-next').disabled=selected===years.length-1;
    if(updateHash)history.replaceState(null,'','#event-'+year);
    // replaceState does not emit hashchange, so update the language links here.
    $$('.language-switch a').forEach(link=>{const url=new URL(link.href);url.hash=location.hash;link.href=url.href;});
  }
  years.forEach((button,index)=>button.addEventListener('click',()=>showYear(index,true)));
  $('#timeline-previous').addEventListener('click',()=>showYear(selected-1,true));
  $('#timeline-next').addEventListener('click',()=>showYear(selected+1,true));
  const fromHash=()=>{const i=years.findIndex(button=>'#event-'+button.dataset.year===location.hash);showYear(i<0?0:i);};
  window.addEventListener('hashchange',fromHash);
  fromHash();
}

const questions=$$('[data-question]');
if(questions.length){
  const selectQuestion=(key,announce)=>{
    questions.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.question===key)));
    $$('[data-advice]').forEach(article=>{article.hidden=article.dataset.advice!==key;});
    if(announce)$('#advice-announcement').textContent=t('advice.answer')+': '+t('advice.'+key+'.a')+' '+t('advice.practical')+': '+t('advice.'+key+'.tip');
  };
  questions.forEach(button=>button.addEventListener('click',()=>selectQuestion(button.dataset.question,true)));
  selectQuestion(questions[0].dataset.question,false);
}

const newsFilters=$$('[data-news-filter]');
if(newsFilters.length){
  newsFilters.forEach(button=>button.addEventListener('click',()=>{
    const category=button.dataset.newsFilter;
    newsFilters.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    let count=0;
    $$('[data-news-category]').forEach(article=>{
      article.hidden=category!=='all'&&article.dataset.newsCategory!==category;
      if(!article.hidden)count++;
    });
    $('#news-count').textContent=t('news.count',count);
  }));
}

// The workshop executes a small, finite instruction set, never arbitrary code.
if($('#machine-mission')){
  let mission='math',program=[],state=initialMachine(),timer=null;
  const w=(key,...values)=>t('workshop.'+key,...values);
  const stop=()=>{if(timer!==null)clearInterval(timer);timer=null;$('#machine-pause').hidden=true;};
  function renderState(message){
    $('#machine-state-label').textContent=w(mission==='math'?'memory':'kettle');
    $('#machine-value').textContent=mission==='math'?String(state.memory):w(['stateEmpty','stateWater','stateHot','stateLeaves','stateSteep','stateServed'][state.stage]);
    $('#machine-progress').textContent=w('progress',state.index,program.length);
    $('.machine-console').dataset.state=state.status;
    const error=state.status==='error'&&!['needCards','full'].includes(state.message);
    $('#machine-status').textContent=message||(error?w('errorPrefix')+' ':'')+w(state.message,...state.values);
    $('#machine-step').disabled=state.status==='error'||state.status==='success'||timer!==null;
    $('#machine-run').disabled=timer!==null;
    $('#machine-trace').replaceChildren(...state.trace.map(entry=>{
      const li=document.createElement('li');li.textContent=entry.step+'. '+w(entry.message,...entry.values);return li;
    }));
    $$('#machine-program li').forEach((row,index)=>{
      row.classList.toggle('is-current',index===state.index&&state.status!=='success');
      row.classList.toggle('is-complete',index<state.index);
    });
  }
  function renderProgram(){
    const list=$('#machine-program');
    list.replaceChildren();
    $('#machine-empty').hidden=program.length>0;
    program.forEach((action,index)=>{
      const row=document.createElement('li');row.className='punch-card';
      const top=document.createElement('div');top.className='punch-card-heading';
      const number=document.createElement('span');number.className='punch-number';number.textContent=String(index+1).padStart(2,'0');
      const name=document.createElement('strong');name.textContent=w(action);
      const holes=document.createElement('span');holes.className='punch-holes';holes.setAttribute('aria-hidden','true');
      const code=Object.values(commands).flat().indexOf(action)+1;
      for(let bit=3;bit>=0;bit--){const hole=document.createElement('i');hole.classList.toggle('punched',Boolean(code&(1<<bit)));holes.append(hole);}
      top.append(number,name,holes);row.append(top);
      const tools=document.createElement('div');tools.className='card-actions';
      for(const [kind,symbol] of [['up','↑'],['down','↓'],['remove','×']]){
        const button=document.createElement('button');button.type='button';button.dataset.action=kind;button.textContent=symbol;
        button.setAttribute('aria-label',w(kind,index+1));
        const unavailable=kind==='up'&&index===0||kind==='down'&&index===program.length-1;
        button.setAttribute('aria-disabled',String(unavailable));
        button.addEventListener('click',()=>{
          if(unavailable)return;
          let destination=index;
          if(kind==='remove')program.splice(index,1);
          else {destination=index+(kind==='up'?-1:1);[program[index],program[destination]]=[program[destination],program[index]];}
          edited();
          const rows=$$('#machine-program li');
          if(rows.length)rows[Math.min(destination,rows.length-1)].querySelector('[data-action="'+kind+'"]').focus();
          else $('#machine-palette button').focus();
        });
        tools.append(button);
      }
      row.append(tools);list.append(row);
    });
  }
  function edited(){
    stop();state=initialMachine();renderProgram();renderState(w('edited'));
  }
  function palette(){
    $('#machine-palette').replaceChildren(...commands[mission].map(action=>{
      const button=document.createElement('button');button.type='button';button.dataset.command=action;
      button.textContent=w(action)+' +';button.setAttribute('aria-label',w('addCard',w(action)));
      button.addEventListener('click',()=>{
        if(program.length===12){$('#machine-status').textContent=w('full');return;}
        program.push(action);edited();
      });
      return button;
    }));
  }
  function tick(){
    state=stepMachine(state,mission,program);
    if(['error','success'].includes(state.status))stop();
    renderState();
  }
  $('#machine-mission').addEventListener('change',()=>{
    mission=$('#machine-mission').value;program=[];palette();edited();
    $('#machine-goal').textContent=w(mission+'Goal');
  });
  $('#machine-example').addEventListener('click',()=>{program=[...commands[mission]];edited();});
  $('#machine-clear').addEventListener('click',()=>{program=[];edited();});
  $('#machine-restart').addEventListener('click',()=>{stop();state=initialMachine();renderState();});
  $('#machine-step').addEventListener('click',tick);
  $('#machine-pause').addEventListener('click',()=>{stop();renderState(w('paused'));});
  $('#machine-run').addEventListener('click',()=>{
    if(['error','success'].includes(state.status))state=initialMachine();
    stop();
    tick();
    if(['error','success'].includes(state.status))return;
    timer=setInterval(tick,650);
    $('#machine-pause').hidden=false;
    renderState();
  });
  window.addEventListener('pagehide',stop);
  palette();renderProgram();renderState();
}

// A locally generated memento. No visitor name is sent to a server.
if($('#diploma-section')){
  let result=null,issued=null;
  let downloadUrl=null,downloadGeneration=0;
  function clearDownload(){
    downloadGeneration++;
    if(downloadUrl)URL.revokeObjectURL(downloadUrl);
    downloadUrl=null;
    $('#diploma-status').replaceChildren();
  }
  const d=(key,...values)=>t('diploma.'+key,...values);
  const cleanName=()=>Array.from($('#diploma-name').value).filter(c=>c.charCodeAt(0)>=32&&c.charCodeAt(0)!==127).map(c=>c.charCodeAt(0)===8212?'-':c).join('').trim().slice(0,50)||d('defaultName');
  const certificateValues=()=>({
    name:cleanName(),
    rank:d(diplomaRank(result.correct,result.total)),
    score:d('score',result.correct,result.total,Math.round(result.correct/result.total*100)),
    date:d('date',new Intl.DateTimeFormat(document.documentElement.lang,{dateStyle:'long'}).format(issued))
  });
  function renderCertificate(){
    if(!result)return;
    clearDownload();
    const value=certificateValues();
    for(const key of ['name','rank','score','date'])$('#certificate-'+key).textContent=value[key];
  }
  document.addEventListener('ada:quiz-complete',event=>{
    result=event.detail;issued=new Date();
    $('#diploma-section').hidden=false;renderCertificate();
  });
  document.addEventListener('ada:quiz-reset',()=>{
    clearDownload();
    result=null;issued=null;$('#diploma-section').hidden=true;$('#diploma-name').value='';$('#diploma-status').textContent='';
  });
  $('#diploma-name').addEventListener('input',renderCertificate);
  $('#diploma-download').addEventListener('click',()=>{
    if(!result)return;
    clearDownload();
    const generation=downloadGeneration;
    try{
      const canvas=document.createElement('canvas');canvas.width=1800;canvas.height=1272;
      const context=canvas.getContext('2d');
      if(!context)throw Error('Canvas unavailable');
      const values=certificateValues();
      context.fillStyle='#eeeade';context.fillRect(0,0,1800,1272);
      context.strokeStyle='#252820';context.lineWidth=3;context.strokeRect(48,48,1704,1176);
      context.strokeStyle='#ad351f';context.lineWidth=2;context.strokeRect(68,68,1664,1136);
      context.textAlign='center';context.textBaseline='top';
      function text(value,y,maxSize=38,color='#252820',family='Georgia'){
        let fontSize=maxSize;
        do{context.font=fontSize+'px '+family; if(context.measureText(value).width<=1480)break;fontSize--;}while(fontSize>20);
        context.fillStyle=color;context.fillText(value,900,y);
      }
      function lines(value,y,size=26,width=1450){
        context.font=size+'px Arial';context.fillStyle='#252820';
        const words=value.split(/\s+/);let line='';
        for(const word of words){const candidate=(line?line+' ':'')+word;if(context.measureText(candidate).width>width&&line){context.fillText(line,900,y);y+=size*1.5;line=word;}else line=candidate;}
        if(line){context.fillText(line,900,y);y+=size*1.5;}
        return y;
      }
      text('✳',95,72,'#ad351f');
      text(d('heading'),200,49);
      text(values.name,318,69);
      text(d('awarded'),432,31,'#595d50','Arial');
      text(values.rank,503,54,'#ad351f');
      context.strokeStyle='#b9b8a9';context.beginPath();context.moveTo(280,614);context.lineTo(1520,614);context.stroke();
      text(values.score,661,38,'#252820','Arial');
      text(values.date,733,29,'#595d50','Arial');
      text(d('signature'),852,35);
      lines(d('disclaimer'),966,26);
      text('ada-lovelace.vita-academy-7121.chatgpt.site',1123,23,'#595d50','Arial');
      canvas.toBlob(blob=>{
        if(generation!==downloadGeneration)return;
        if(!blob){$('#diploma-status').textContent=d('error');return;}
        downloadUrl=URL.createObjectURL(blob);
        const link=document.createElement('a');
        link.id='diploma-file';link.href=downloadUrl;
        link.download='ada-diplom-'+document.documentElement.lang+'.png';
        link.textContent=d('download');
        $('#diploma-status').append(document.createTextNode(d('saved')+' '),link);
        link.click();
      },'image/png');
    }catch{$('#diploma-status').textContent=d('error');}
  });
  const clearPrint=()=>{document.body.classList.remove('printing-diploma');$('#print-certificate')?.remove();};
  window.addEventListener('afterprint',clearPrint);
  $('#diploma-print').addEventListener('click',()=>{
    if(!result)return;
    clearPrint();
    const copy=$('#diploma-certificate').cloneNode(true);copy.id='print-certificate';copy.removeAttribute('aria-labelledby');
    copy.querySelectorAll('[id]').forEach(element=>element.removeAttribute('id'));
    document.body.append(copy);document.body.classList.add('printing-diploma');
    try{window.print();}finally{clearPrint();}
  });
}
