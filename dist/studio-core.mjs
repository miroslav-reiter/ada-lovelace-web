export const LEVELS=[[0,1,2,5,7,10],[3,4,6,8,9,11],[12,13,14,15,16,17]];
export const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').toLowerCase();
export function search(records,query) {
  const terms=[...new Set(normalize(query).trim().split(/\s+/).filter(Boolean))].slice(0,12);
  if(!terms.length)return [];
  return records.map(record=>{
    const title=normalize(record.title),body=normalize(record.text),description=normalize(record.description||'');
    if(!terms.every(term=>title.includes(term)||body.includes(term)))return null;
    return {...record,rank:terms.reduce((n,term)=>n+(title.includes(term)?20:0)+(description.includes(term)?10:0)+Math.min(body.split(term).length-1,5),record.page===0?-1:0)};
  }).filter(Boolean).sort((a,b)=>b.rank-a.rank||a.title.localeCompare(b.title)).slice(0,30);
}
export function lessonPlan(minutes,age,topic) {
  minutes=Number(minutes);age=Number(age);topic=Number(topic);
  if(![15,45,90].includes(minutes)||![0,1,2].includes(age)||![0,1,2].includes(topic))throw new Error('Invalid lesson selection');
  const timing={15:[2,4,6,3],45:[5,15,15,10],90:[10,25,35,20]}[minutes];
  let elapsed=0;
  return {minutes,age,topic,stages:timing.map(duration=>{const start=elapsed;elapsed+=duration;return {start,end:elapsed,duration};})};
}
export function freshQuiz(level=0,ids=LEVELS[level]) {return {version:1,level,ids:[...ids],answers:[],position:0};}
export function validQuiz(value) {
  if(!value||value.version!==1||!Number.isInteger(value.level)||!LEVELS[value.level]||!Array.isArray(value.ids)||!value.ids.length||value.ids.length>6||new Set(value.ids).size!==value.ids.length)return false;
  if(!value.ids.every(id=>Number.isInteger(id)&&LEVELS[value.level].includes(id)))return false;
  if(!Array.isArray(value.answers)||value.answers.length>value.ids.length||!value.answers.every(a=>Number.isInteger(a)&&a>=0&&a<4))return false;
  return Number.isInteger(value.position)&&value.position>=0&&value.position<=value.ids.length&&value.answers.length>=value.position&&value.answers.length<=Math.min(value.position+1,value.ids.length);
}
export function incorrectIds(state,bank) {return state.ids.filter((id,i)=>state.answers[i]!==bank[id].correct);}
export function downloadPath(lang,kind,format) {
  if(!['sk','cs','en','de','es'].includes(lang)||!['worksheet','solutions'].includes(kind)||!['pdf','docx','html'].includes(format))throw new Error('Invalid document selection');
  return `/downloads/ada-${kind}-${lang}.${format}`;
}
