"""Build editable Word worksheets and teacher solutions from the shared catalogs."""
from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path
import argparse
import hashlib
import json
import re
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

from docx import Document
from docx.shared import Mm, Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.opc.constants import RELATIONSHIP_TYPE as RT
import learning_pages

ROOT = Path(__file__).resolve().parent.parent
LOCALES = {'sk':'sk-SK','cs':'cs-CZ','en':'en-GB','de':'de-DE','es':'es-ES'}
ORIGIN = 'https://ada-lovelace.vita-academy-7121.chatgpt.site'

def heading_text(text):
    return re.sub(r'\s+', ' ', re.sub(r'[^\w\s]', ' ', text).replace('_',' ')).strip()

def hyperlink(paragraph, label, url):
    link=OxmlElement('w:hyperlink')
    link.set(qn('r:id'), paragraph.part.relate_to(url, RT.HYPERLINK, is_external=True))
    run=OxmlElement('w:r')
    props=OxmlElement('w:rPr')
    color=OxmlElement('w:color'); color.set(qn('w:val'),'244F23'); props.append(color)
    under=OxmlElement('w:u'); under.set(qn('w:val'),'single'); props.append(under)
    run.append(props)
    text=OxmlElement('w:t'); text.text=label; run.append(text)
    link.append(run); paragraph._p.append(link)

def make_document(t, lang, solutions):
    doc=Document()
    for style in doc.styles:
        for border in list(style.element.iter(qn('w:pBdr'))):
            border.getparent().remove(border)
    section=doc.sections[0]
    section.page_width,section.page_height=Mm(210),Mm(297)
    section.top_margin=section.bottom_margin=Mm(20)
    section.left_margin=section.right_margin=Mm(20)
    section.footer_distance=Mm(10)
    for name in ('Normal','Title','Heading 1','Heading 2','Footer'):
        style=doc.styles[name]
        style.font.name='Arial'
        style.font.color.rgb=RGBColor(0,0,0)
        props=style.element.get_or_add_rPr()
        language=OxmlElement('w:lang'); language.set(qn('w:val'),LOCALES[lang]); props.append(language)
    normal=doc.styles['Normal']
    normal.font.size=Pt(12)
    normal.paragraph_format.line_spacing=1.15
    normal.paragraph_format.space_after=Pt(8)
    normal.paragraph_format.widow_control=True
    for name,size in [('Title',24),('Heading 1',15),('Heading 2',13)]:
        style=doc.styles[name]
        style.font.size=Pt(size)
        style.font.bold=name!='Title'
        style.paragraph_format.space_before=Pt(12 if name!='Title' else 0)
        style.paragraph_format.space_after=Pt(8 if name!='Title' else 14)
        style.paragraph_format.keep_with_next=True
    title=heading_text(t['teachers.solutionsTitle' if solutions else 'teachers.worksheetTitle'])
    props=doc.core_properties
    props.title=title
    props.subject=t['teachers.title']
    props.author='Miroslav Reiter'
    props.last_modified_by='Miroslav Reiter'
    props.language=LOCALES[lang]
    props.created=props.modified=datetime(2026,11,17,tzinfo=timezone.utc)
    props.comments=''
    doc.add_paragraph(title,'Title')
    doc.add_paragraph(t['teachers.intro'])
    doc.add_paragraph(t['teachers.materials'])
    if solutions:
        doc.add_heading(heading_text(t['teachers.goalTitle']),1)
        doc.add_paragraph(t['teachers.goals'])
    else:
        doc.add_paragraph(t['teachers.name'])
    def answer_space(count):
        for _ in range(count):
            p=doc.add_paragraph()
            p.paragraph_format.space_after=Pt(0)
            p.paragraph_format.line_spacing=Pt(21)
            borders=OxmlElement('w:pBdr')
            for edge in ('bottom','between'):
                border=OxmlElement('w:'+edge)
                for key,value in [('val','single'),('sz','3'),('color','C2C8BE'),('space','1')]:
                    border.set(qn('w:'+key),value)
                borders.append(border)
            p._p.get_or_add_pPr().append(borders)
            p.add_run(' ')
    for i in range(1,5):
        p=doc.add_heading(str(i)+' '+heading_text(t[f'teachers.q{i}Title']),1)
        if i==3: p.paragraph_format.page_break_before=True
        doc.add_paragraph(t[f'teachers.q{i}'])
        if solutions:
            doc.add_paragraph(t[f'teachers.a{i}'])
        else:
            answer_space(4)
    if solutions:
        doc.add_heading(heading_text(t['teachers.differentiateTitle']),1)
        doc.add_paragraph(t['teachers.differentiate'])
    else:
        doc.add_heading(heading_text(t['teachers.reflectTitle']),1)
        doc.add_paragraph(t['teachers.reflect'])
        answer_space(3)
    p=doc.add_paragraph()
    p.paragraph_format.space_before=Pt(12)
    url=ORIGIN+('/' if lang=='sk' else '/'+lang+'/')+learning_pages.ROUTES[lang][1]+'/'
    hyperlink(p,t['teachers.online'],url)
    p=doc.add_paragraph(t['teachers.credit']); p.runs[0].font.size=Pt(10)
    footer=section.footer.paragraphs[0]
    footer.style=doc.styles['Footer']; footer.style.font.size=Pt(9)
    footer.add_run('Ada Lovelace  |  '+lang.upper()+'  |  ')
    field=OxmlElement('w:fldSimple'); field.set(qn('w:instr'),'PAGE'); footer._p.append(field)
    raw=BytesIO(); doc.save(raw)
    # Stable archive metadata makes unchanged builds byte-identical.
    out=BytesIO()
    with ZipFile(raw) as original, ZipFile(out,'w',ZIP_DEFLATED) as archive:
        for name in sorted(original.namelist()):
            info=ZipInfo(name,date_time=(2026,11,17,0,0,0)); info.compress_type=ZIP_DEFLATED
            archive.writestr(info,original.read(name))
    return out.getvalue()

def build(output):
    output.mkdir(parents=True,exist_ok=True)
    manifest=[]
    for lang in LOCALES:
        t=learning_pages.load(ROOT/'i18n',lang)
        for solutions,kind in [(False,'worksheet'),(True,'solutions')]:
            name=f'ada-{kind}-{lang}.docx'
            data=make_document(t,lang,solutions)
            (output/name).write_bytes(data)
            manifest.append({'file':name,'lang':lang,'kind':kind,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()})
    (output/'docx-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print('Built 10 editable DOCX documents in five languages.')

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',type=Path,default=ROOT/'dist/downloads')
    build(parser.parse_args().output.resolve())
