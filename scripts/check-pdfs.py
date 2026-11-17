"""Verify PDF content, language metadata, embedded Unicode font and download links."""
from pathlib import Path
import hashlib
import json
import re
from pypdf import PdfReader
import learning_pages

ROOT=Path(__file__).resolve().parent.parent
manifest=json.loads((ROOT/'dist/downloads/pdf-manifest.json').read_text(encoding='utf-8'))
assert len(manifest)==10
normalize=lambda text:re.sub(r'\s+',' ',text).strip()
for item in manifest:
    path=ROOT/'dist/downloads'/item['file']
    data=path.read_bytes()
    assert data.startswith(b'%PDF-') and len(data)==item['bytes'],path
    assert hashlib.sha256(data).hexdigest()==item['sha256'],path
    reader=PdfReader(path)
    assert len(reader.pages)==item['pages']==2,path
    assert reader.trailer['/Root']['/Lang']==item['lang'],path
    t=learning_pages.load(ROOT/'i18n',item['lang'])
    solutions=item['kind']=='solutions'
    title=t['teachers.solutionsTitle' if solutions else 'teachers.worksheetTitle']
    assert reader.metadata.title==title and reader.metadata.author=='Miroslav Reiter',path
    text=normalize(' '.join(page.extract_text() for page in reader.pages))
    assert chr(8212) not in text and '\ufffd' not in text,path
    for i in range(1,5):
        for key in [f'teachers.q{i}Title',f'teachers.q{i}']+([f'teachers.a{i}'] if solutions else []):
            assert normalize(t[key]) in text,(path,key)
    assert normalize(t['teachers.credit']) in text,path
    for page in reader.pages:
        assert abs(float(page.mediabox.width)-595.28)<1 and abs(float(page.mediabox.height)-841.89)<1,path
        fonts=[f.get_object() for f in page['/Resources']['/Font'].values()]
        assert any('/ToUnicode' in f and '/FontDescriptor' in f and '/FontFile2' in f['/FontDescriptor'] for f in fonts),path
    lang=item['lang']
    route=learning_pages.ROUTES[lang][1]
    webpage=ROOT/'dist'/('' if lang=='sk' else lang)/route/'index.html'
    html=webpage.read_text(encoding='utf-8')
    assert f'href="/downloads/{item["file"]}" type="application/pdf" download="{item["file"]}"' in html,path
print('PASS: 10 PDF files, 20 A4 pages, all questions and solutions, correct language, embedded Unicode font, metadata and matching download links.')
