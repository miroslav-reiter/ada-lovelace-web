"""Verify editable Word content, language, package integrity and web links."""
from io import BytesIO
from pathlib import Path
from zipfile import ZipFile
import hashlib
import importlib.util
import json
import re
from docx import Document
from docx.oxml.ns import qn
import learning_pages

ROOT=Path(__file__).resolve().parent.parent
spec=importlib.util.spec_from_file_location('build_docx',ROOT/'scripts/build-docx.py')
builder=importlib.util.module_from_spec(spec); spec.loader.exec_module(builder)
manifest=json.loads((ROOT/'dist/downloads/docx-manifest.json').read_text(encoding='utf-8'))
assert len(manifest)==10
assert {(i['lang'],i['kind']) for i in manifest}=={(l,k) for l in builder.LOCALES for k in ('worksheet','solutions')}
normalize=lambda text:re.sub(r'\s+',' ',text).strip()
for item in manifest:
    path=ROOT/'dist/downloads'/item['file']
    data=path.read_bytes()
    assert len(data)==item['bytes'] and hashlib.sha256(data).hexdigest()==item['sha256'],path
    with ZipFile(path) as archive:
        assert archive.testzip() is None,path
        assert not any('vbaProject' in n or n.startswith('word/media/') for n in archive.namelist()),path
        for name in archive.namelist():
            if name.endswith('.xml'):
                text=archive.read(name).decode('utf-8')
                assert chr(8212) not in text and '\ufffd' not in text,path
    doc=Document(path)
    lang=item['lang']; solutions=item['kind']=='solutions'
    t=learning_pages.load(ROOT/'i18n',lang)
    text=normalize(' '.join(p.text for p in doc.paragraphs))
    assert doc.core_properties.language==builder.LOCALES[lang],path
    assert doc.core_properties.author=='Miroslav Reiter',path
    assert doc.paragraphs[0].style.name=='Title',path
    assert not list(doc.styles['Title'].element.iter(qn('w:pBdr'))),path
    assert doc.styles['Normal'].font.size.pt==12,path
    assert doc.settings.element.find(qn('w:documentProtection')) is None,path
    assert doc.settings.element.find(qn('w:trackRevisions')) is None,path
    assert len(doc.tables)==0 and len(doc.inline_shapes)==0,path
    assert abs(doc.sections[0].page_width.mm-210)<1 and abs(doc.sections[0].page_height.mm-297)<1,path
    for i in range(1,5):
        for key in [f'teachers.q{i}']+([f'teachers.a{i}'] if solutions else []):
            assert normalize(t[key]) in text,(path,key)
        assert normalize(builder.heading_text(t[f'teachers.q{i}Title'])) in text,path
    assert normalize(t['teachers.credit']) in text,path
    assert any(p.paragraph_format.page_break_before for p in doc.paragraphs),path
    assert builder.make_document(t,lang,solutions)==data,(path,'build must be reproducible')
    # Simulate a teacher editing and saving a real paragraph, then reopen it.
    target=next(p for p in doc.paragraphs if p.text==t['teachers.q1'])
    target.add_run(' EDIT CHECK')
    saved=BytesIO(); doc.save(saved); saved.seek(0)
    assert any(p.text.endswith(' EDIT CHECK') for p in Document(saved).paragraphs),path
    route=learning_pages.ROUTES[lang][1]
    html=(ROOT/'dist'/('' if lang=='sk' else lang)/route/'index.html').read_text(encoding='utf-8')
    mime='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    assert f'href="/downloads/{item["file"]}" type="{mime}" download="{item["file"]}"' in html,path
print('PASS: 10 editable DOCX documents, complete activities and solutions, language, A4, 12 pt, no macros or edit protection, reproducible builds, edit/save/reopen and download links.')
