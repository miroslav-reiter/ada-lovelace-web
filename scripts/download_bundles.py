"""Build or verify language ZIPs and one combined ZIP of all PDF and DOCX files."""
from io import BytesIO
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
import argparse
import hashlib
import json
import learning_pages

ROOT=Path(__file__).resolve().parent.parent
DOWNLOADS=ROOT/'dist/downloads'
LANGUAGES=('sk','cs','en','de','es')
PACKS=(*LANGUAGES,'all')

def names(lang):
    if lang=='all':
        return [f'{code}/{name}' for code in LANGUAGES for name in names(code)]
    return [f'ada-{kind}-{lang}.{suffix}' for kind in ('worksheet','solutions') for suffix in ('pdf','docx')]

def archive_bytes(folder,lang):
    out=BytesIO()
    with ZipFile(out,'w',compression=ZIP_DEFLATED) as archive:
        for name in names(lang):
            data=(folder/Path(name).name).read_bytes()
            assert data.startswith(b'%PDF-') if name.endswith('.pdf') else data.startswith(b'PK\x03\x04'), name
            info=ZipInfo(name,date_time=(2026,11,17,0,0,0))
            info.compress_type=ZIP_DEFLATED
            info.external_attr=0o100644 << 16
            archive.writestr(info,data)
    return out.getvalue()

def build(folder=DOWNLOADS):
    # Read all inputs first so a missing source cannot leave partially built packs.
    packs=[(lang,archive_bytes(folder,lang)) for lang in PACKS]
    manifest=[]
    for lang,data in packs:
        name=f'ada-materials-{lang}.zip'
        (folder/name).write_bytes(data)
        manifest.append({'file':name,'lang':lang,'files':names(lang),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()})
    (folder/'zip-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print('Built 5 language ZIP packs with 4 files each and 1 combined ZIP with 20 files in 5 language folders.')

def check(folder=DOWNLOADS):
    manifest=json.loads((folder/'zip-manifest.json').read_text(encoding='utf-8'))
    assert len(manifest)==6 and {item['lang'] for item in manifest}==set(PACKS)
    for item in manifest:
        lang=item['lang']; path=folder/item['file']; data=path.read_bytes()
        assert item['file']==f'ada-materials-{lang}.zip'
        assert len(data)==item['bytes'] and hashlib.sha256(data).hexdigest()==item['sha256'],path
        assert item['files']==names(lang) and data==archive_bytes(folder,lang),path
        with ZipFile(BytesIO(data)) as archive:
            assert archive.testzip() is None,path
            assert archive.namelist()==names(lang),path
            assert len(archive.namelist())==(20 if lang=='all' else 4),path
            for name in names(lang):
                assert archive.read(name)==(folder/Path(name).name).read_bytes(),(path,name)
                assert '\\' not in name and '..' not in name and not archive.getinfo(name).flag_bits & 1,name
                assert name.count('/')==(1 if lang=='all' else 0),name
            if lang=='all':
                for code in LANGUAGES:
                    assert {n for n in archive.namelist() if n.startswith(code+'/')}=={f'{code}/{n}' for n in names(code)},code
        for page_lang in (LANGUAGES if lang=='all' else (lang,)):
            route=learning_pages.ROUTES[page_lang][1]
            text=(ROOT/'dist'/('' if page_lang=='sk' else page_lang)/route/'index.html').read_text(encoding='utf-8')
            assert f'href="/downloads/{item["file"]}" type="application/zip" download="{item["file"]}"' in text,(path,page_lang)
    print('PASS: 5 language ZIPs and 1 combined ZIP, all 20 source documents, language folders, CRC, hashes, exact bytes, reproducible builds and links in every language.')

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check',action='store_true',help='Verify existing packs and page links without modifying files.')
    if parser.parse_args().check: check()
    else: build()
