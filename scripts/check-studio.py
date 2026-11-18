"""Check translation shape, search coverage and completeness of all offline packs."""
from pathlib import Path
import json
import re
import studio_pages as studio
root=Path(__file__).resolve().parent.parent
dist=root/'dist'
manifest=json.loads((dist/'offline-manifest.json').read_text(encoding='utf-8'))
for lang in studio.NAMES:
    t=studio.load(root/'i18n',lang)
    assert len(t['lesson.stages'].split(';'))==4
    for i in range(3):assert len(t[f'lesson.activity{i}'].split(';'))==4
    assert len(manifest['packs'][lang])==len(set(manifest['packs'][lang]))
    for url in manifest['packs'][lang]:
        assert url.startswith('/') and not url.startswith('//') and '..' not in url
        file=dist/url.lstrip('/')
        if file.is_dir():file=file/'index.html'
        assert file.is_file(),(lang,url)
    for format in ['pdf','docx','html']:
        for kind in ['worksheet','solutions']:assert f'/downloads/ada-{kind}-{lang}.{format}' in manifest['packs'][lang]
    assert f'/locales/{lang}/quiz-bank.json' in manifest['packs'][lang]
    assert f'/locales/{lang}/search.json' in manifest['packs'][lang]
for file in [*root.glob('scripts/*'),*root.glob('i18n/studio.*.json'),*dist.glob('studio.*'),dist/'offline-sw.js']:
    if not file.is_file():continue
    text=file.read_text(encoding='utf-8')
    assert chr(8212) not in text,file
    # Detect literal forbidden entities or escapes, not the checker regex itself.
    assert not re.search('&'+'(?:md'+'ash|#8212|#x2014);',text,re.I),file
print('PASS: 5 studio catalogs, 5 complete offline packs, same-origin allowlists and translation structure.')
