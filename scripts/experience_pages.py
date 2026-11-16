"""Static, localized markup for the salon's interactive exhibits."""
from html import escape as esc
import json
import re

KINDS = ['timeline', 'workshop', 'advice', 'news']
EXTRA_ROUTES = {
    'sk': ['stroj-casu','dierne-stitky','poradna','noviny'],
    'cs': ['stroj-casu','derne-stitky','poradna','noviny'],
    'en': ['time-machine','punched-cards','advice','newspaper'],
    'de': ['zeitmaschine','lochkarten','ratgeber','zeitung'],
    'es': ['maquina-del-tiempo','tarjetas-perforadas','consultorio','periodico'],
}
QUESTIONS = ['bug','ai','deadline','meeting','learn','deploy']
NEWS = [('steam','cloud'),('hardware','cloud'),('meeting','work'),('bug','work'),('biscuit','science'),('ai','science')]
CHM = 'https://www.computerhistory.org/babbage/adalovelace/'
EVENTS = [
    ('1815','1815','chalon',CHM),
    ('1833','1833','carpenter',CHM),
    ('1840','1840 - 1841','chalon','https://www.claymath.org/online-resources/ada-lovelaces-mathematical-papers/'),
    ('1843','1843','claudet',CHM),
    ('1852','1852','carpenter',CHM),
    ('1983','1983','chalon','https://learn.adacore.com/courses/intro-to-ada/chapters/introduction.html'),
]
PICTURES = {
    'chalon':('/assets/ada-lovelace.jpg','https://commons.wikimedia.org/wiki/File:Ada_Lovelace_portrait.jpg','altChalon'),
    'carpenter':('/assets/gallery/ada-carpenter.jpg','https://commons.wikimedia.org/wiki/File:Ada_Lovelace.jpg','altCarpenter'),
    'claudet':('/assets/gallery/ada-claudet.jpg','https://commons.wikimedia.org/wiki/File:Ada_Byron_daguerreotype_by_Antoine_Claudet_1843_or_1850.jpg','altClaudet')
}

def load(root, lang):
    base=json.loads((root/'experience.sk.json').read_text(encoding='utf-8'))
    data=json.loads((root/f'experience.{lang}.json').read_text(encoding='utf-8'))
    assert set(base)==set(data), f'{lang}: experience translation keys differ'
    for k,v in data.items():
        assert isinstance(v,str) and v.strip(), (lang,k)
        assert chr(8212) not in v and not re.search(r'&(?:mdash|#8212|#x2014);|\\u2014',v,re.I), (lang,k)
        assert re.findall(r'\{\d+\}',v)==re.findall(r'\{\d+\}',base[k]), (lang,k)
    return data

def navigation_links(t, lang, index, page_url):
    return ''.join(f'<a href="{page_url(lang,7+i)}"'+(' aria-current="page"' if index==7+i else '')+f'>{esc(t["nav."+kind])}</a>' for i,kind in enumerate(KINDS))

def controls(t, lang, index, page_url):
    links=navigation_links(t, lang, index, page_url)
    return f'''<div class="salon-tools"><nav class="explore-nav" aria-label="{esc(t['nav.label'])}">{links}</nav>
<div class="salon-preferences">
<details class="reading-tools"><summary>{esc(t['read.title'])}</summary><div class="reading-panel" role="region" aria-label="{esc(t['read.title'])}">
<label for="reading-size">{esc(t['read.size'])}</label><select id="reading-size"><option value="100">{esc(t['read.default'])}</option><option value="125">125 %</option><option value="150">150 %</option><option value="200">200 %</option></select>
<label class="check-label"><input id="reading-calm" type="checkbox">{esc(t['read.calm'])}</label>
<label class="check-label"><input id="reading-motion" type="checkbox">{esc(t['read.motion'])}</label>
<button type="button" id="reading-reset">{esc(t['read.reset'])}</button><p>{esc(t['read.note'])}</p>
<p id="reading-status" class="sr-only" role="status" aria-live="polite"></p></div></details></div></div>'''

def home(t, lang, page_url):
    cards=''.join(f'<a href="{page_url(lang,7+i)}"><span class="eyebrow">{i+7:02d}</span><h3>{esc(t["nav."+kind])} <span aria-hidden="true">↗</span></h3><p>{esc(t["home."+kind])}</p></a>' for i,kind in enumerate(KINDS))
    return f'''<section class="section experience-home" aria-labelledby="experience-title"><span class="eyebrow">{esc(t['home.eyebrow'])}</span><h2 id="experience-title">{esc(t['home.title'])}</h2><p>{esc(t['home.intro'])}</p><div class="experience-cards">{cards}</div><a class="diploma-teaser" href="{page_url(lang,2)}">{esc(t['home.diploma'])} ↗</a></section>'''

def diploma(t):
    def s(k): return esc(t['diploma.'+k])
    return f'''<section class="diploma-section" aria-labelledby="diploma-title" hidden id="diploma-section">
<h3 id="diploma-title">{s('title')}</h3><p>{s('intro')}</p>
<label for="diploma-name">{s('name')}</label><input id="diploma-name" type="text" maxlength="50" autocomplete="off" placeholder="{s('placeholder')}" aria-describedby="diploma-privacy">
<p id="diploma-privacy" class="fine-print">{s('privacy')}</p>
<article id="diploma-certificate" class="diploma-certificate" aria-labelledby="certificate-heading">
<span class="certificate-star" aria-hidden="true">✳</span><h3 id="certificate-heading">{s('heading')}</h3>
<p class="certificate-name" id="certificate-name">{s('defaultName')}</p><p>{s('awarded')}</p>
<p class="certificate-rank" id="certificate-rank"></p><p id="certificate-score"></p><p id="certificate-date"></p>
<p class="certificate-signature">{s('signature')}</p><p class="fine-print">{s('disclaimer')}</p></article>
<div class="experience-actions"><button type="button" class="button primary" id="diploma-download">{s('download')}</button><button type="button" class="button" id="diploma-print">{s('print')}</button></div>
<p class="fine-print">{s('printHint')}</p><p id="diploma-status" role="status" aria-live="polite"></p></section>'''

def hero(t, kind):
    return f'''<section class="section experience-hero"><span class="eyebrow">{esc(t[kind+'.eyebrow'])}</span><h1>{esc(t[kind+'.title'])}</h1><p>{esc(t[kind+'.intro'])}</p></section>'''

def timeline(t):
    buttons=''.join(f'<button type="button" data-year="{key}" aria-controls="event-{key}" aria-pressed="false">{year}</button>' for key,year,_,_ in EVENTS)
    articles=[]
    for key,year,picture,source in EVENTS:
        src,url,alt=PICTURES[picture]
        articles.append(f'''<article class="timeline-event" id="event-{key}" data-event="{key}" aria-labelledby="event-title-{key}">
<figure class="event-portrait"><img src="{src}" alt="{esc(t['timeline.'+alt])}" width="480" height="620" loading="lazy"><figcaption>{esc(t['timeline.'+picture])} <a href="{url}" target="_blank" rel="noopener noreferrer">{esc(t['common.imageSource'])}</a></figcaption></figure>
<div class="event-story"><span class="event-year">{year}</span><span class="tag fact">{esc(t['common.fact'])}</span><h2 id="event-title-{key}">{esc(t['timeline.'+key+'.title'])}</h2><p>{esc(t['timeline.'+key+'.fact'])}</p><a class="text-link" href="{source}" target="_blank" rel="noopener noreferrer">{esc(t['common.source'])}</a>
<aside class="fiction-note"><span class="tag fiction">{esc(t['common.fiction'])}</span><h3>{esc(t['timeline.comment'])}</h3><p>{esc(t['timeline.'+key+'.joke'])}</p></aside></div></article>''')
    return hero(t,'timeline')+f'''<section class="section time-machine"><div class="year-controls" role="group" aria-label="{esc(t['timeline.controls'])}">{buttons}</div><p class="fine-print">{esc(t['timeline.disclaimer'])}</p>{''.join(articles)}<div class="experience-actions timeline-navigation"><button type="button" id="timeline-previous">{esc(t['timeline.previous'])}</button><span id="timeline-position" role="status" aria-live="polite"></span><button type="button" id="timeline-next">{esc(t['timeline.next'])}</button></div><p class="fine-print">{esc(t['timeline.imageNote'])}</p><noscript><p>{esc(t['common.nojs'])}</p></noscript></section>'''

def workshop(t):
    def s(k):return esc(t['workshop.'+k])
    return hero(t,'workshop')+f'''<section class="section workshop"><p class="fiction-banner">{s('disclaimer')}</p>
<div class="mission-picker"><label for="machine-mission">{s('mission')}</label><select id="machine-mission"><option value="math">{s('math')}</option><option value="tea">{s('tea')}</option></select><p id="machine-goal">{s('mathGoal')}</p></div>
<div class="workshop-grid"><section class="card-palette"><h2>{s('palette')}</h2><div id="machine-palette"></div><p class="fine-print">{s('limit')}</p><button id="machine-example" type="button">{s('example')}</button></section>
<section class="program-deck"><h2>{s('program')}</h2><p id="machine-empty">{s('empty')}</p><ol id="machine-program"></ol><button id="machine-clear" type="button">{s('clear')}</button></section>
<section class="machine-console"><h2>{s('machine')}</h2><div class="machine-dial"><span id="machine-state-label">{s('memory')}</span><output id="machine-value">0</output><div class="machine-lights" aria-hidden="true"><i></i><i></i><i></i></div></div>
<p id="machine-progress"></p><div class="experience-actions"><button type="button" id="machine-run" class="button primary">{s('run')}</button><button type="button" id="machine-step">{s('step')}</button><button type="button" id="machine-pause" hidden>{s('pause')}</button><button type="button" id="machine-restart">{s('restart')}</button></div>
<p id="machine-status" role="status" aria-live="polite" aria-atomic="true">{s('ready')}</p><details><summary>{s('trace')}</summary><ol id="machine-trace"></ol></details></section></div><noscript><p>{esc(t['common.nojs'])}</p></noscript></section>'''

def advice(t):
    buttons=''.join(f'<button type="button" data-question="{key}" aria-controls="advice-{key}" aria-pressed="false">{esc(t["advice."+key+".q"])}</button>' for key in QUESTIONS)
    answers=''.join(f'''<article class="advice-answer" id="advice-{key}" data-advice="{key}" aria-labelledby="advice-title-{key}"><span class="tag fiction">{esc(t['common.fiction'])}</span><h2 id="advice-title-{key}">{esc(t['advice.'+key+'.q'])}</h2><h3>{esc(t['advice.answer'])}</h3><p class="advice-quip">{esc(t['advice.'+key+'.a'])}</p><aside class="practical-note"><h3>{esc(t['advice.practical'])}</h3><p>{esc(t['advice.'+key+'.tip'])}</p></aside></article>''' for key in QUESTIONS)
    return hero(t,'advice')+f'''<section class="section"><p class="fiction-banner">{esc(t['advice.disclaimer'])}</p><div class="advice-layout"><aside class="advice-questions"><img src="/assets/ada-lovelace.jpg" alt="{esc(t['timeline.altChalon'])}" width="180" height="180"><h2>{esc(t['advice.choose'])}</h2><div role="group" aria-label="{esc(t['advice.choose'])}">{buttons}</div></aside><div id="advice-responses">{answers}</div></div><p id="advice-announcement" class="sr-only" role="status" aria-live="polite"></p><noscript><p>{esc(t['common.nojs'])}</p></noscript></section>'''

def news(t):
    filters=''.join(f'<button type="button" data-news-filter="{kind}" aria-pressed="{str(kind=="all").lower()}">{esc(t["news."+kind])}</button>' for kind in ['all','cloud','work','science'])
    articles=''.join(f'''<article class="news-card" data-news-category="{category}"><div class="news-meta"><span>{esc(t['news.'+category])}</span><span aria-hidden="true">0{i+1}</span></div><span class="tag fiction">{esc(t['common.fiction'])}</span><h2>{esc(t['news.'+key+'.title'])}</h2><p class="news-summary">{esc(t['news.'+key+'.summary'])}</p><details><summary>{esc(t['news.read'])}</summary><p>{esc(t['news.'+key+'.body'])}</p></details></article>''' for i,(key,category) in enumerate(NEWS))
    return hero(t,'news')+f'''<section class="section newspaper"><div class="newspaper-masthead"><span>{esc(t['news.edition'])}</span><p>{esc(t['news.motto'])}</p><span aria-hidden="true">✳</span></div><div class="news-filters" role="group" aria-label="{esc(t['news.filter'])}">{filters}</div><p id="news-count" role="status" aria-live="polite">{esc(t['news.count'].replace('{0}','6'))}</p><div class="news-grid">{articles}</div><aside class="fake-ad"><h2>{esc(t['news.ad'])}</h2><p>{esc(t['news.adText'])}</p></aside></section>'''

def document(template, t, kind):
    body={'timeline':timeline,'workshop':workshop,'advice':advice,'news':news}[kind](t)
    result=re.sub(r'<main\b[^>]*>.*?</main>','<main id="obsah" tabindex="-1">'+body+'</main>',template,flags=re.S)
    result=re.sub(r'<title>.*?</title>','<title>'+esc(t[kind+'.title'])+' - Ada Lovelace</title>',result)
    result=re.sub(r'(<meta (?:name="description"|property="og:description") content=")[^"]*',lambda m:m[1]+esc(t[kind+'.description'],quote=True),result)
    result=re.sub(r'(<meta property="og:title" content=")[^"]*',lambda m:m[1]+esc(t[kind+'.title']+' - Ada Lovelace',quote=True),result)
    result=result.replace(' aria-current="page"','').replace('page-kviz','page-'+kind)
    return result

def runtime_data(t,index):
    prefixes=['read.','common.']
    if index>=7:prefixes.append(KINDS[index-7]+'.')
    if index==2:prefixes.append('diploma.')
    return {k:v for k,v in t.items() if any(k.startswith(p) for p in prefixes)}
