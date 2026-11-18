"""Static pages and build-time data for the learning studio."""
from html import escape as esc
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import subprocess
import hashlib

START=17
KINDS=['hub','downloads','search','practice','detective','lesson','offline','access']
ROUTES={
 'sk':['zacnite-tu','stiahnut','hladat','kvizova-akademia','stratena-poznamka','zostavit-hodinu','offline','pomoc'],
 'cs':['zacnete-zde','stahnout','hledat','kvizova-akademie','ztracena-poznamka','sestavit-hodinu','offline','napoveda'],
 'en':['start-here','downloads','search','quiz-academy','missing-note','lesson-builder','offline','help'],
 'de':['hier-starten','downloads','suche','quiz-akademie','verschwundene-notiz','unterricht-planen','offline','hilfe'],
 'es':['empieza-aqui','descargas','buscar','academia-quiz','nota-perdida','crear-clase','sin-conexion','ayuda']}
NAMES={'sk':'Slovenčina','cs':'Čeština','en':'English','de':'Deutsch','es':'Español'}
ROOT=Path(__file__).resolve().parent.parent

def load(root,lang):
    t=json.loads((root/f'studio.{lang}.json').read_text(encoding='utf-8'))
    base=json.loads((root/'studio.sk.json').read_text(encoding='utf-8'))
    assert t.keys()==base.keys(),lang
    for k,v in t.items():
        assert type(v)==type(base[k]),(lang,k)
        if isinstance(v,str):
            assert v.strip() and chr(8212) not in v,(lang,k)
            assert sorted(re.findall(r'\{\w+\}',v))==sorted(re.findall(r'\{\w+\}',base[k])),(lang,k)
    return t

def link(t,lang,kind,page_url,cls='learn-button'):
    return f'<a class="{cls}" href="{page_url(lang,START+KINDS.index(kind))}">{esc(t[kind+".title"])}</a>'

def navigation(t,lang,index,page_url):
    return '<a class="studio-nav" href="'+page_url(lang,START)+'"'+(' aria-current="page"' if index==START else '')+'>'+esc(t['nav'])+'</a>'

def home(t,lang,page_url):
    return f'<section class="section studio-promo"><div><span class="eyebrow">{esc(t["nav"])}</span><h2>{esc(t["hub.title"])}</h2><p>{esc(t["hub.deck"])}</p></div><div class="learn-actions">{link(t,lang,"hub",page_url)}{link(t,lang,"search",page_url)}</div></section>'

def status(id='studio-status'):
    return f'<p id="{id}" role="status" aria-live="polite" aria-atomic="true"></p>'

def select(id,label,options):
    disabled=' disabled' if id=='quiz-level' else ''
    return f'<label for="{id}">{esc(label)}</label><select id="{id}"{disabled}>'+''.join(f'<option value="{esc(str(v))}">{esc(str(name))}</option>' for v,name in options)+'</select>'

def button(id,text,extra=''):
    if id.startswith('quiz-'):extra+=' disabled'
    return f'<button type="button" id="{id}" {extra}>{esc(text)}</button>'

def document(template,t,lang,kind,page_url):
    s=lambda key:esc(t[key])
    body=f'<section class="section studio-hero"><span class="eyebrow">ADA / {s("nav")}</span><h1>{s(kind+".title")}</h1><p class="learn-lead">{s(kind+".deck")}</p></section>'
    if kind=='hub':
        routes=[[1,15,4],[12,8,20],[22,18,21]]
        body+=f'<section class="section"><h2>{s("journey.title")}</h2><p>{s("storage")}</p>{status()}<div class="studio-grid">'
        for role,indexes in enumerate(routes):
            body+=f'<article class="studio-card"><h3>{s("journey.role"+str(role))}</h3><p>{s("journey.desc"+str(role))}</p><p id="route-progress-{role}"></p><ol class="studio-route">'
            for step,index in enumerate(indexes):
                title=page_title(lang,index,t)
                body+=f'<li><a href="{page_url(lang,index)}">{esc(title)}</a><label><input type="checkbox" data-route="{role}" data-step="{step}"> {s("journey.done")}<span class="sr-only">: {esc(title)}</span></label></li>'
            body+='</ol></article>'
        body+=f'</div></section><section class="section"><h2>{s("journey.tools")}</h2><div class="studio-grid">'
        for item in KINDS[1:]:body+=f'<article class="studio-card"><h3>{link(t,lang,item,page_url,"studio-card-link")}</h3><p>{s(item+".deck")}</p></article>'
        body+='</div></section>'
    elif kind=='downloads':
        body+=f'<section class="section studio-download"><div class="studio-card"><div class="studio-fields">{select("download-language",t["download.language"],NAMES.items())}{select("download-kind",t["download.kind"],[("worksheet",t["download.worksheet"]),("solutions",t["download.solutions"])])}{select("download-format",t["download.format"],[("pdf","PDF"),("docx","Word (DOCX)"),("html","HTML")])}</div><div class="learn-actions"><a id="download-selected" class="learn-button" href="/downloads/ada-worksheet-{lang}.pdf" download>{s("download.selected")}</a><a id="download-pack" class="learn-button studio-primary" href="/downloads/ada-materials-{lang}.zip" download>{s("download.pack")}</a></div><p id="download-summary" role="status"></p><p>{s("download.details")}</p><a class="learn-button" href="/downloads/ada-materials-all.zip" download>{s("download.all")}</a></div><details class="learn-disclosure"><summary>{s("download.fallback")}</summary>'
        for code,name in NAMES.items():
            body+=f'<h2 lang="{code}">{name}</h2><ul>'
            for doc in ['worksheet','solutions']:
                for ext in ['pdf','docx','html']:body+=f'<li><a href="/downloads/ada-{doc}-{code}.{ext}" download>{s("download."+doc)} ({ext.upper()})</a></li>'
            body+=f'<li><a href="/downloads/ada-materials-{code}.zip" download>ZIP · {name}</a></li></ul>'
        body+='</details></section>'
    elif kind=='search':
        body+=f'<section class="section"><form id="search-form" role="search"><label for="search-query">{s("search.label")}</label><div class="studio-search"><input id="search-query" type="search" maxlength="160" placeholder="{s("search.placeholder")}" aria-describedby="search-hint" disabled><button type="submit" disabled>{s("search.button")}</button></div><p id="search-hint">{s("search.hint")}</p></form>{status()}<ol id="search-results" class="studio-results"></ol></section>'
    elif kind=='practice':
        body+=f'<section class="section"><p>{s("storage")}</p><div class="studio-fields">{select("quiz-level",t["quiz.level"],[(i,t["quiz.level"+str(i)]) for i in range(3)])}</div><div class="learn-actions">{button("quiz-start",t["quiz.start"])}{button("quiz-retry",t["quiz.retry"],"hidden")}{button("quiz-clear",t["quiz.clear"])}</div>{status()}<div id="practice-stage" class="studio-card" hidden></div></section>'
    elif kind=='detective':
        body+=f'<section class="section"><p>{s("game.intro")}</p><p>{s("storage")}</p>{status()}<div id="detective-stage" class="studio-card"></div><div class="learn-actions">{button("game-reset",t["reset"])}</div><details class="learn-disclosure"><summary>{s("game.teacher")}</summary><p>{s("game.solution")}</p><a class="learn-source" href="https://psychclassics.yorku.ca/Lovelace/lovelace.htm">{s("source")}: Note G, 1843</a>{link(t,lang,"lesson",page_url)}</details></section>'
    elif kind=='lesson':
        body+=f'<section class="section"><form id="lesson-form" class="studio-card"><div class="studio-fields">{select("lesson-duration",t["lesson.duration"],[(15,"15 min"),(45,"45 min"),(90,"90 min")])}{select("lesson-age",t["lesson.age"],[(0,"10 - 12"),(1,"13 - 15"),(2,"16+")])}{select("lesson-topic",t["lesson.topic"],[(i,t["lesson.topic"+str(i)]) for i in range(3)])}</div><button type="submit">{s("lesson.create")}</button></form>{status()}<div id="lesson-output" hidden><p>{s("lesson.edit")}</p><article id="lesson-plan" class="studio-card"></article><div class="learn-actions">{button("lesson-print",t["lesson.print"])}{button("lesson-save",t["lesson.save"])}</div></div></section>'
    elif kind=='offline':
        body+=f'<section class="section"><div class="studio-card"><p>{s("offline.scope")}</p><p>{s("offline.care")}</p><div class="learn-actions">{button("offline-save",t["offline.save"])}{button("offline-check",t["offline.check"])}{button("offline-remove",t["offline.remove"])}</div>{status()}<progress id="offline-progress" value="0" max="1" aria-label="{s("offline.save")}" hidden></progress></div></section>'
    elif kind=='access':
        body+=f'<section class="section studio-grid"><article class="studio-card"><h2>{s("access.keyboard")}</h2><p>{s("access.keyboardText")}</p></article><article class="studio-card"><h2>{s("access.status")}</h2><p>{s("access.statusText")}</p></article></section><section class="section"><h2>{s("access.glossary")}</h2><dl class="studio-glossary">'
        for i in range(6):body+=f'<div><dt>{s("glossary."+str(i))}</dt><dd>{s("glossary."+str(i)+"text")}</dd></div>'
        body+='</dl></section>'
    body+='<noscript><p class="section">'+s('nojs')+'</p></noscript>'
    if kind!='hub':body+='<nav class="section studio-related" aria-label="'+s('journey.tools')+'"><div class="learn-actions">'+''.join(link(t,lang,k,page_url) for k in ['hub','downloads','search','practice','detective','lesson','offline','access'] if k!=kind)+'</div></nav>'
    result=re.sub(r'<main\b[^>]*>.*?</main>',lambda _:f'<main id="obsah" tabindex="-1" data-studio="{kind}">{body}</main>',template,flags=re.S)
    title=esc(t[kind+'.title']+' - Ada Lovelace')
    result=re.sub(r'<title>.*?</title>',lambda _:'<title>'+title+'</title>',result)
    result=re.sub(r'(<meta (?:name="description"|property="og:description") content=")[^"]*',lambda m:m[1]+s(kind+'.deck'),result)
    result=re.sub(r'(<meta property="og:title" content=")[^"]*',lambda m:m[1]+title,result)
    return result.replace(' aria-current="page"','').replace('page-kviz','page-learning page-studio')

def page_title(lang,index,t):
    if index>=START:return t[KINDS[index-START]+'.title']
    if index>=12:
        data=json.loads((ROOT/'i18n'/f'learning.{lang}.json').read_text(encoding='utf-8'))
        return data[['algorithm','teachers','pioneers','myths','making'][index-12]+'.title']
    # Titles from the already generated pages preserve existing editorial translations.
    manifest=json.loads((ROOT/'dist'/'languages.json').read_text(encoding='utf-8'))
    path=next(p['path'] for p in manifest['pages'] if p['lang']==lang and p['page']==index)
    text=(ROOT/'dist'/path.lstrip('/')/'index.html').read_text(encoding='utf-8')
    from html import unescape
    return unescape(re.search(r'<title>(.*?)</title>',text).group(1)).split(' - Ada Lovelace')[0]

def runtime(t,lang,page_url):
    return {'lang':lang,'strings':t,'urls':{kind:page_url(lang,START+i) for i,kind in enumerate(KINDS)},'routes':[page_url(lang,i) for i in range(START+len(KINDS))]}

class SearchText(HTMLParser):
    def __init__(self):
        super().__init__();self.depth=0;self.skip=0;self.title=False;self.title_text=[];self.parts=[];self.description=''
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if tag=='meta' and d.get('name')=='description':self.description=d.get('content','')
        if tag=='main':self.depth+=1
        if tag in ['script','style']:self.skip+=1
        if tag=='title':self.title=True
    def handle_endtag(self,tag):
        if tag=='main':self.depth-=1
        if tag in ['script','style']:self.skip-=1
        if tag=='title':self.title=False
    def handle_data(self,text):
        if self.title:self.title_text.append(text)
        if self.depth and not self.skip and text.strip():self.parts.append(text.strip())

def finish(dist,paths):
    for lang in NAMES:
        t=load(ROOT/'i18n',lang)
        items=[(p['path'],p['page']) for p in paths if p['lang']==lang]
        items += [(f'/downloads/ada-{kind}-{lang}.html',-1) for kind in ['worksheet','solutions']]
        records=[]
        for url,index in items:
            file=dist/url.lstrip('/')
            if file.is_dir():file=file/'index.html'
            parser=SearchText();parser.feed(file.read_text(encoding='utf-8'))
            records.append({'url':url,'title':' '.join(parser.title_text).split(' - Ada Lovelace')[0],'description':parser.description,'text':' '.join(parser.parts),'page':index})
        (dist/'locales'/lang/'search.json').write_text(json.dumps(records,ensure_ascii=False),encoding='utf-8')
        code=dist/('pages.js' if lang=='sk' else 'locales/'+lang+'/pages.js')
        output=subprocess.check_output(['node',str(ROOT/'scripts/quiz-bank.cjs'),str(code)],text=True,encoding='utf-8')
        bank=json.loads(output)
        for i in range(6):
            index=t[f'extra.{i}.page']
            url=next(p['path'] for p in paths if p['lang']==lang and p['page']==index)
            bank.append({'q':t[f'extra.{i}.q'],'options':t[f'extra.{i}.options'].split(';'),'correct':t[f'extra.{i}.correct'],'why':t[f'extra.{i}.why'],'source':url})
        for i,q in enumerate(bank):q['id']=i
        (dist/'locales'/lang/'quiz-bank.json').write_text(json.dumps(bank,ensure_ascii=False),encoding='utf-8')
    build_offline(dist,paths)

def build_offline(dist,paths):
    common=['/'+p.name for p in dist.iterdir() if p.is_file() and p.suffix in ['.js','.mjs','.css'] and p.name!='offline-sw.js']
    common+=['/assets/favicon.svg','/languages.json']
    packs={}
    for lang in NAMES:
        urls=common+[p['path'] for p in paths if p['lang']==lang and p['page']!=6]
        urls += ['/'+p.relative_to(dist).as_posix() for p in (dist/'locales'/lang).iterdir() if p.suffix in ['.js','.json']]
        urls += [f'/downloads/ada-{kind}-{lang}.{ext}' for kind in ['worksheet','solutions'] for ext in ['pdf','docx','html']]
        urls += [f'/downloads/ada-materials-{lang}.zip']
        packs[lang]=sorted(set(urls))
    digest=hashlib.sha256()
    for url in sorted(set(sum(packs.values(),[]))):
        path=dist/url.lstrip('/')
        if path.is_dir():path=path/'index.html'
        digest.update(url.encode());digest.update(path.read_bytes())
    version=digest.hexdigest()[:16]
    manifest={'version':version,'packs':packs}
    (dist/'offline-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    template=(ROOT/'scripts/offline-sw.template.js').read_text(encoding='utf-8')
    (dist/'offline-sw.js').write_text(template.replace('__VERSION__',version).replace('__PACKS__',json.dumps(packs)),encoding='utf-8')
