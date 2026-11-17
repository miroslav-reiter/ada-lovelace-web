"""Five educational exhibits, translated at build time with offline worksheets."""
from html import escape as esc
import json
import re

START = 12
KINDS = ['algorithm', 'teachers', 'pioneers', 'myths', 'making']
ROUTES = {
    'sk': ['adin-algoritmus', 'ucitelsky-kutik', 'priekopnicky', 'fakty-a-myty', 'tvorba-s-ai'],
    'cs': ['adin-algoritmus', 'ucitelsky-koutek', 'prukopnice', 'fakta-a-myty', 'tvorba-s-ai'],
    'en': ['adas-algorithm', 'teachers-corner', 'pioneers', 'facts-and-myths', 'making-with-ai'],
    'de': ['adas-algorithmus', 'lehrerecke', 'pionierinnen', 'fakten-und-mythen', 'gestaltung-mit-ki'],
    'es': ['algoritmo-de-ada', 'rincon-docente', 'pioneras', 'hechos-y-mitos', 'creacion-con-ia'],
}
SOURCES = {
    'note': ('Note G, 1843', 'https://psychclassics.yorku.ca/Lovelace/lovelace.htm'),
    'chm': ('Computer History Museum', 'https://www.computerhistory.org/babbage/adalovelace/'),
    'nist': ('NIST DLMF, 24.2', 'https://dlmf.nist.gov/24.2#E1'),
    'hopper': ('Computer History Museum: Grace Hopper', 'https://archive.computerhistory.org/resources/text/Oral_History/Hopper_Grace/102702026.05.01.pdf'),
    'hamilton': ('NASA: Margaret Hamilton', 'https://www.nasa.gov/wp-content/uploads/static/history/alsj/a11/a11Hamilton.html'),
    'bartik': ('Computer History Museum: Jean Bartik', 'https://computerhistory.org/profile/jean-jennings-bartik/'),
    'allen': ('IBM: Frances Allen', 'https://www.ibm.com/history/frances-allen'),
}
PEOPLE = [('hopper', 'Grace Hopper', 'A-0 · FLOW-MATIC'), ('hamilton', 'Margaret Hamilton', 'Apollo'), ('bartik', 'Jean Bartik', 'ENIAC'), ('allen', 'Frances Allen', 'IBM · PTRAN')]
REPOSITORY = 'https://github.com/miroslav-reiter/ada-lovelace-web'

def load(root, lang):
    base = json.loads((root/'learning.sk.json').read_text(encoding='utf-8'))
    data = json.loads((root/f'learning.{lang}.json').read_text(encoding='utf-8'))
    assert set(base) == set(data), f'{lang}: learning translation keys differ'
    for key, value in data.items():
        assert isinstance(value, str) and value.strip(), (lang, key)
        assert chr(8212) not in value and not re.search(r'&(?:mdash|#8212|#x2014);|\\u2014', value, re.I), (lang, key)
        assert re.findall(r'\{\w+\}', value) == re.findall(r'\{\w+\}', base[key]), (lang, key)
    return data

def source(key):
    title, url = SOURCES[key]
    return f'<a class="learn-source" href="{url}" target="_blank" rel="noopener noreferrer">{esc(title)} <span aria-hidden="true">↗</span></a>'

def navigation(t, lang, index, page_url):
    links = ''.join(f'<li><a href="{page_url(lang,START+i)}"'+(' aria-current="page"' if index == START+i else '')+f'><span class="option-name">{esc(t[k+".title"])}</span></a></li>' for i,k in enumerate(KINDS))
    return f'<details class="salon-dropdown learning-dropdown"><summary>{esc(t["nav"])} <svg class="ui-icon icon-chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><ul class="dropdown-panel">{links}</ul></details>'

def cards(t, lang, page_url, current=None):
    return '<div class="learn-cards">'+''.join(f'<a href="{page_url(lang,START+i)}"><span class="eyebrow">0{i+1}</span><h3>{esc(t[k+".title"])}</h3><p>{esc(t[k+".deck"])}</p><span aria-hidden="true">↗</span></a>' for i,k in enumerate(KINDS) if k != current)+'</div>'

def home(t, lang, page_url):
    return '<section class="section learn-home"><span class="eyebrow">'+esc(t['home.label'])+'</span><h2>'+esc(t['home.title'])+'</h2><p>'+esc(t['home.text'])+'</p>'+cards(t,lang,page_url)+'</section>'

def hero(t, kind):
    index=KINDS.index(kind)
    return f'<section class="section learn-hero"><div><span class="eyebrow">{START+index} / {esc(t["home.label"])}</span><h1>{esc(t[kind+".title"])}</h1><p class="learn-lead">{esc(t[kind+".deck"])}</p></div><div class="learn-emblem" aria-hidden="true">{["B₂", "45′", "{ }", "?!", "AI"][index]}</div></section>'

def algorithm(t, lang, page_url):
    s=lambda key:esc(t[key])
    return f'''<section class="section learn-grid"><div><h2>{s('algorithm.heading')}</h2><p>{s('algorithm.intro')}</p><p>{s('algorithm.scope')}</p><div class="learn-note"><h3>{s('algorithm.notationTitle')}</h3><p>{s('algorithm.notation')}</p><p class="learn-equation">B₁ → B₂ · B₃ → B₄ · B₅ → B₆ · B₇ → B₈</p></div>{source('note')}{source('nist')}</div><aside class="learn-card"><h2>{s('algorithm.recipeTitle')}</h2><ol class="learn-list">{''.join('<li>'+s('algorithm.recipe'+str(i))+'</li>' for i in range(1,4))}</ol><p>{s('algorithm.joke')}</p></aside></section>
<section class="section learn-lab" aria-labelledby="lab-title"><div class="learn-section-head"><span class="eyebrow">01 / {s('algorithm.try')}</span><h2 id="lab-title">{s('algorithm.labTitle')}</h2><p>{s('algorithm.instructions')}</p></div><div id="bernoulli-lab" class="learn-lab-grid" hidden><div><label for="bernoulli-target">{s('algorithm.target')}</label><select id="bernoulli-target"><option value="2">B₂</option><option value="4">B₄</option><option value="6">B₆</option><option value="8">B₈</option></select><h3>{s('algorithm.known')}</h3><p>{s('algorithm.knownHint')}</p><div id="bernoulli-known" class="learn-registers"></div><label for="bernoulli-progress">{s('algorithm.progress')}</label><progress id="bernoulli-progress" value="0" max="4"></progress></div><div class="learn-console"><p id="bernoulli-position" class="eyebrow"></p><h3 id="bernoulli-heading"></h3><p id="bernoulli-equation" class="learn-equation"></p><p id="bernoulli-explanation"></p><div class="learn-sum"><span>{s('algorithm.sum')}</span><output id="bernoulli-sum">0</output></div><p id="bernoulli-status" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></p><div class="learn-actions"><button id="bernoulli-prev" type="button">{s('algorithm.previous')}</button><button id="bernoulli-next" type="button">{s('algorithm.next')}</button><button id="bernoulli-reset" type="button">{s('algorithm.reset')}</button></div></div></div><noscript><p>{s('algorithm.nojs')}</p></noscript><details class="learn-disclosure"><summary>{s('algorithm.worked')}</summary><ol class="learn-list"><li>B₀ = 1, B₁ = -1/2</li><li>S = 1 × 1 + 3 × (-1/2) = -1/2</li><li>B₂ = -S / 3 = 1/6</li></ol><p>{s('algorithm.workedText')}</p></details></section>'''

def teachers(t, lang, page_url):
    s=lambda key:esc(t[key])
    lessons=''.join(f'<li><span class="learn-time">{time}</span><div><h3>{s("teachers.lesson"+str(i)+"Title")}</h3><p>{s("teachers.lesson"+str(i))}</p></div></li>' for i,time in enumerate(['0 - 5 min','5 - 15 min','15 - 30 min','30 - 40 min','40 - 45 min'],1))
    tasks=''.join(f'<article class="learn-card"><span class="eyebrow">0{i}</span><h3>{s("teachers.q"+str(i)+"Title")}</h3><p>{s("teachers.q"+str(i))}</p></article>' for i in range(1,5))
    return f'''<section class="section learn-grid"><div><h2>{s('teachers.heading')}</h2><p>{s('teachers.intro')}</p><p>{s('teachers.materials')}</p><div class="learn-note"><h3>{s('teachers.goalTitle')}</h3><p>{s('teachers.goals')}</p></div></div><aside class="learn-card"><h2>{s('teachers.downloadTitle')}</h2><p>{s('teachers.downloadText')}</p><div class="learn-actions"><a class="learn-button" href="/downloads/ada-worksheet-{lang}.html" download>{s('teachers.download')}</a><a class="learn-button" href="/downloads/ada-solutions-{lang}.html" download>{s('teachers.solutions')}</a></div><p>{s('teachers.printHelp')}</p><a class="learn-source" href="/downloads/ada-worksheet-{lang}.html">{s('teachers.openWorksheet')}</a></aside></section><section class="section"><h2>{s('teachers.planTitle')}</h2><ol class="learn-plan">{lessons}</ol></section><section class="section"><h2>{s('teachers.tasksTitle')}</h2><div class="learn-card-grid">{tasks}</div><div class="learn-actions"><a class="learn-button" href="{page_url(lang,2)}">{s('teachers.quiz')}</a><a class="learn-button" href="{page_url(lang,8)}">{s('teachers.cards')}</a><a class="learn-button" href="{page_url(lang,12)}">{s('algorithm.title')}</a></div><details class="learn-disclosure"><summary>{s('teachers.differentiateTitle')}</summary><p>{s('teachers.differentiate')}</p></details></section>'''

def pioneers(t, lang, page_url):
    s=lambda key:esc(t[key])
    articles=''.join(f'<article class="learn-pioneer"><div class="learn-initials" aria-hidden="true">{name.split()[0][0]}{name.split()[-1][0]}</div><div><span class="eyebrow">{project}</span><h2>{name}</h2><p>{s("pioneers."+key)}</p><div class="learn-note"><h3>{s("pioneers.connectionTitle")}</h3><p>{s("pioneers."+key+"Link")}</p></div>{source(key)}</div></article>' for key,name,project in PEOPLE)
    return f'<section class="section"><p class="learn-intro">{s("pioneers.intro")}</p><p>{s("pioneers.context")}</p><div class="learn-pioneers">{articles}</div><div class="learn-note"><h2>{s("pioneers.challengeTitle")}</h2><p>{s("pioneers.challenge")}</p><a class="learn-source" href="{page_url(lang,13)}">{s("teachers.title")} ↗</a></div></section>'

def myths(t, lang, page_url):
    s=lambda key:esc(t[key])
    items=''.join(f'<article class="learn-myth"><span class="eyebrow">0{i}</span><h2>{s("myths.q"+str(i))}</h2><details class="learn-disclosure"><summary>{s("myths.reveal")}</summary><p class="learn-verdict">{s("myths.v"+str(i))}</p><p>{s("myths.a"+str(i))}</p>{source("chm" if i in (1,2,3) else "note")}</details></article>' for i in range(1,6))
    return f'''<section class="section"><p class="learn-intro">{s('myths.intro')}</p><div class="learn-card-grid">{items}</div></section><section class="section learn-grid"><div class="learn-card"><span class="eyebrow">{s('myths.quoteLabel')}</span><h2>{s('myths.quoteTitle')}</h2><blockquote lang="en">“The Analytical Engine has no pretensions whatever to originate any thing.”</blockquote><p>{s('myths.quoteTranslation')}</p><p>{s('myths.quoteContext')}</p>{source('note')}</div><div class="learn-card"><span class="eyebrow">{s('myths.fictionLabel')}</span><h2>{s('myths.fictionTitle')}</h2><blockquote>{s('myths.fictionQuote')}</blockquote><p>{s('myths.fictionText')}</p><a class="learn-source" href="{page_url(lang,4)}">{s('myths.more')} ↗</a></div></section>'''

def making(t, lang, page_url):
    s=lambda key:esc(t[key])
    prompts=[('nech je to vtipné a zábavné ten web','humor'),('daj prepínače jazyka a vzhľadu vedľa seba do hlavičky, nech nezaberajú toľko miesta.','header'),('Na podstránku O stránke Ada pridaj aj moju fotografiu z webu VITA.','photo')]
    examples=''.join(f'<article class="learn-card"><h3>{s("making."+key+"Title")}</h3><blockquote lang="sk">{esc(prompt)}</blockquote><p class="learn-translation">{s("making."+key+"Prompt")}</p><p>{s("making."+key+"Result")}</p></article>' for prompt,key in prompts)
    lessons=''.join(f'<li><h3>{s("making.lesson"+str(i)+"Title")}</h3><p>{s("making.lesson"+str(i))}</p></li>' for i in range(1,4))
    return f'''<section class="section"><h2>{s('making.heading')}</h2><p class="learn-intro">{s('making.intro')}</p><p>{s('making.roles')}</p><div class="learn-note"><p>{s('making.promptNote')}</p></div><div class="learn-card-grid">{examples}</div></section><section class="section"><h2>{s('making.compareTitle')}</h2><p>{s('making.compareText')}</p><div class="learn-comparison"><figure><img src="/assets/making/about-before.jpg" width="1280" height="900" loading="lazy" decoding="async" alt="{s('making.beforeAlt')}"><figcaption><strong>{s('making.before')}</strong> {s('making.beforeText')} <a href="/assets/making/about-before.jpg" target="_blank" rel="noopener noreferrer">{s('making.full')}</a></figcaption></figure><figure><img src="/assets/making/about-after.jpg" width="1280" height="900" loading="lazy" decoding="async" alt="{s('making.afterAlt')}"><figcaption><strong>{s('making.after')}</strong> {s('making.afterText')} <a href="/assets/making/about-after.jpg" target="_blank" rel="noopener noreferrer">{s('making.full')}</a></figcaption></figure></div></section><section class="section learn-grid"><div><h2>{s('making.lessonsTitle')}</h2><ol class="learn-lessons">{lessons}</ol></div><aside class="learn-card"><h2>{s('making.checkTitle')}</h2><p>{s('making.checkText')}</p><p>{s('making.limits')}</p><a class="learn-source" href="{REPOSITORY}" target="_blank" rel="noopener noreferrer">{s('making.github')} ↗</a><a class="learn-source" href="{page_url(lang,11)}">{s('making.author')} ↗</a></aside></section>'''

def document(template, t, lang, kind, page_url):
    body=hero(t,kind)+globals()[kind](t,lang,page_url)
    body+='<section class="section learn-related"><h2>'+esc(t['related'])+'</h2>'+cards(t,lang,page_url,kind)+'</section>'
    result=re.sub(r'<main\b[^>]*>.*?</main>',lambda _: '<main id="obsah" tabindex="-1">'+body+'</main>',template,flags=re.S)
    title=esc(t[kind+'.title']+' - Ada Lovelace')
    result=re.sub(r'<title>.*?</title>',lambda _: '<title>'+title+'</title>',result)
    result=re.sub(r'(<meta (?:name="description"|property="og:description") content=")[^"]*',lambda m:m[1]+esc(t[kind+'.deck'],quote=True),result)
    result=re.sub(r'(<meta property="og:title" content=")[^"]*',lambda m:m[1]+title,result)
    return result.replace(' aria-current="page"','').replace('page-kviz','page-learning')

def worksheet(t, lang, solutions=False):
    s=lambda key:esc(t[key])
    title=s('teachers.solutionsTitle' if solutions else 'teachers.worksheetTitle')
    tasks=''.join('<section><h2>'+str(i)+'. '+s('teachers.q'+str(i)+'Title')+'</h2><p>'+s('teachers.q'+str(i))+'</p>'+('<p class="answer">'+s('teachers.a'+str(i))+'</p>' if solutions else '<div class="answer-space"></div>')+'</section>' for i in range(1,5))
    return f'''<!DOCTYPE html><html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title} - Ada Lovelace</title><style>body{{max-width:800px;margin:32px auto;padding:0 24px;font:18px/1.7 system-ui,sans-serif;color:#20251e;background:white}}h1{{font-size:2rem;line-height:1.2}}h2{{font-size:1.25rem}}section{{break-inside:avoid;margin:28px 0}}a{{color:#244f23}}button{{font:inherit;padding:10px 18px;border:2px solid #20251e;background:white;color:#20251e;cursor:pointer}}.answer-space{{height:95px;background:repeating-linear-gradient(white 0 30px,#b5b8b0 30px 31px)}}.answer{{padding:14px;border-left:4px solid #526a40}}@media print{{body{{font-size:12pt;margin:0;max-width:none}}button{{display:none}}a{{color:inherit}}}}@page{{size:A4;margin:18mm}}</style></head><body><main><p>Ada Lovelace · {s('teachers.title')}</p><h1>{title}</h1><p>{s('teachers.intro')}</p><p>{s('teachers.materials')}</p><button type="button" onclick="window.print()">{s('teachers.print')}</button><p>{s('teachers.name')}</p>{tasks}<h2>{s('teachers.reflectTitle')}</h2><p>{s('teachers.reflect')}</p><p><a href="https://ada-lovelace.vita-academy-7121.chatgpt.site/{('' if lang=='sk' else lang+'/')+ROUTES[lang][1]}/">{s('teachers.online')}</a></p><p>{s('teachers.credit')}</p></main></body></html>'''
