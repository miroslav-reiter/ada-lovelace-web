import {trace} from './bernoulli-core.mjs';
const panel=document.querySelector('#bernoulli-lab');
if(panel) {
  const t=JSON.parse(document.querySelector('#learning-data').textContent);
  const text=(key,vars={})=>t['algorithm.'+key].replace(/\{(\w+)\}/g,(_,k)=>String(vars[k]));
  const el=id=>document.getElementById('bernoulli-'+id);
  const sub=n=>String(n).replace(/\d/g,d=>'₀₁₂₃₄₅₆₇₈₉'[d]);
  let run=trace(Number(el('target').value)),position=0;
  function draw(announce=true) {
    const step=run.steps[position],vars={n:run.n,k:step.k,coefficient:step.coefficient,value:step.value,result:step.result};
    el('position').textContent=text('step',{current:position+1,total:run.steps.length});
    el('heading').textContent=text(step.kind+'Title',vars);
    el('explanation').textContent=text(step.kind+'Text',vars);
    el('equation').textContent=step.equation;
    el('sum').textContent=step.sum;
    el('progress').max=run.steps.length-1;el('progress').value=position;
    el('prev').disabled=position===0;el('next').disabled=position===run.steps.length-1;
    el('known').replaceChildren(...run.known.map((value,k)=>{
      const item=document.createElement('span'); item.textContent=`B${sub(k)} = ${value}`;
      if(step.kind==='add'&&step.k===k)item.className='active';return item;
    }));
    if(announce)el('status').textContent=el('position').textContent+'. '+el('heading').textContent+'. '+step.equation+'. '+el('explanation').textContent;
  }
  el('target').addEventListener('change',()=>{run=trace(Number(el('target').value));position=0;draw();});
  el('next').addEventListener('click',()=>{position=Math.min(position+1,run.steps.length-1);draw();});
  el('prev').addEventListener('click',()=>{position=Math.max(position-1,0);draw();});
  el('reset').addEventListener('click',()=>{position=0;draw();});
  panel.hidden=false;draw(false);
}
