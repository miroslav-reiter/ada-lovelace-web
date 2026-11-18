import assert from 'node:assert/strict';
import fs from 'node:fs';
import {LEVELS,normalize,search,lessonPlan,freshQuiz,validQuiz,incorrectIds,downloadPath} from '../dist/studio-core.mjs';
const root=new URL('../dist/',import.meta.url);
assert.equal(normalize('ČAJ Straße'),'caj strasse');
for(const lang of ['sk','cs','en','de','es']){
  const bank=JSON.parse(fs.readFileSync(new URL(`locales/${lang}/quiz-bank.json`,root)));
  assert.equal(bank.length,18);assert.equal(new Set(LEVELS.flat()).size,18);
  for(const q of bank){assert.ok(q.options[q.correct]);assert.ok(q.q&&q.why&&q.source);}
  for(let level=0;level<3;level++){
    const state=freshQuiz(level);assert.ok(validQuiz(state));
    state.answers=state.ids.map(id=>bank[id].correct);state.position=6;
    assert.ok(validQuiz(state));assert.deepEqual(incorrectIds(state,bank),[]);
    state.answers[2]=(state.answers[2]+1)%bank[state.ids[2]].options.length;
    assert.deepEqual(incorrectIds(state,bank),[state.ids[2]]);
    assert.ok(validQuiz(freshQuiz(level,incorrectIds(state,bank))));
  }
  const records=JSON.parse(fs.readFileSync(new URL(`locales/${lang}/search.json`,root)));
  assert.equal(records.length,27);
  assert.equal(search(records,'Bernoulli')[0].page,12);
  assert.deepEqual(search(records,'zzzz_no_such_phrase'),[]);
  assert.deepEqual(search(records,'  '),[]);
  assert.deepEqual(search(records,'<script>alert(1)</script>'),[]);
  for(const kind of ['worksheet','solutions'])for(const ext of ['pdf','docx','html'])assert.ok(fs.existsSync(new URL(downloadPath(lang,kind,ext).slice(1),root)));
}
for(const minutes of [15,45,90])for(const age of [0,1,2])for(const topic of [0,1,2]){
  const p=lessonPlan(minutes,age,topic);assert.equal(p.stages.reduce((n,s)=>n+s.duration,0),minutes);assert.equal(p.stages.at(-1).end,minutes);
  p.stages.forEach((s,i)=>assert.equal(s.start,i?p.stages[i-1].end:0));
}
for(const bad of [null,{},[],{...freshQuiz(),ids:[0,0]},{...freshQuiz(),position:2},{...freshQuiz(),answers:[8]},{...freshQuiz(),level:6}])assert.equal(validQuiz(bad),false);
assert.throws(()=>lessonPlan(99,0,0));assert.throws(()=>lessonPlan(15,4,0));assert.throws(()=>downloadPath('../','worksheet','pdf'));
console.log('PASS: 90 translated questions, 3 quiz levels, retry/persistence validation, multilingual search, 30 document selections and 27 lesson plans.');
