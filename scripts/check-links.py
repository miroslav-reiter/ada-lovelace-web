from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from collections import Counter
root = Path(__file__).resolve().parent.parent / 'dist'
class Page(HTMLParser):
    def __init__(self, file):
        super().__init__(); self.file=file; self.ids=[]; self.links=[]; self.h1=0
        self.feed(file.read_text(encoding='utf-8'))
    def handle_starttag(self, tag, attrs):
        d=dict(attrs)
        if 'id' in d: self.ids.append(d['id'])
        if tag=='h1': self.h1+=1
        for key in ('href','src'):
            if key in d: self.links.append(d[key])
pages = {file:Page(file) for file in root.rglob('*.html')}
errors=[]; local_count=0
for file,page in pages.items():
    duplicate=[key for key,n in Counter(page.ids).items() if n>1]
    if duplicate: errors.append(f'{file}: duplicate IDs {duplicate}')
    if page.h1 != 1: errors.append(f'{file}: expected one h1, got {page.h1}')
    for raw in page.links:
        url=urlsplit(raw)
        if url.scheme or url.netloc: continue
        target=(root / unquote(url.path).lstrip('/')) if url.path.startswith('/') else (file.parent / unquote(url.path))
        if not url.path: target=file
        if target.is_dir(): target=target/'index.html'
        target=target.resolve()
        if not target.is_file(): errors.append(f'{file.name}: missing {raw}')
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            errors.append(f'{file.name}: missing anchor {raw}')
        local_count+=1
print(f'Checked {len(pages)} HTML pages and {local_count} local links/assets.')
if errors: raise SystemExit('\n'.join(errors))
print('PASS: unique IDs, one main heading, all local pages/assets/anchors exist.')

