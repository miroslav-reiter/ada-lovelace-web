"""Build ten printable, selectable-text A4 PDFs from the site's translations.

Run with Python containing dependencies in scripts/requirements-pdf.txt.
The regular site build stays dependency-free; committed PDFs are served as assets.
"""
from pathlib import Path
from io import BytesIO
from html import escape
import argparse
import json
import hashlib

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Flowable, KeepTogether
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, TextStringObject
import learning_pages

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT/'assets-originals/fonts/DejaVuSans.ttf'
ORIGIN = 'https://ada-lovelace.vita-academy-7121.chatgpt.site'
INK = colors.HexColor('#202a23')
GREEN = colors.HexColor('#3d5838')
LINE = colors.HexColor('#aab4a4')
SAGE = colors.HexColor('#eef2e8')
PAGE_W, PAGE_H = A4
MARGIN = 20*mm
WIDTH = PAGE_W-2*MARGIN

class WritingLines(Flowable):
    def __init__(self, count=4):
        super().__init__()
        self.count=count
        self.width=WIDTH
        self.height=(count*7+3)*mm
    def wrap(self, available_width, available_height):
        self.width=available_width
        return self.width,self.height
    def draw(self):
        self.canv.setStrokeColor(LINE)
        self.canv.setLineWidth(.45)
        for line in range(self.count):
            y=self.height-(line+1)*7*mm
            self.canv.line(0,y,self.width,y)

def styles():
    common=dict(fontName='AdaSans', textColor=INK, alignment=TA_LEFT, splitLongWords=False)
    return {
        'title':ParagraphStyle('title',fontSize=23,leading=29,spaceAfter=16,**common),
        'body':ParagraphStyle('body',fontSize=12,leading=17,spaceAfter=9,**common),
        'heading':ParagraphStyle('heading',fontSize=14,leading=19,spaceBefore=12,spaceAfter=8,keepWithNext=True,**common),
        'small':ParagraphStyle('small',fontSize=9.5,leading=14,spaceAfter=8,**common),
        'answer':ParagraphStyle('answer',fontSize=12,leading=17,spaceBefore=12,spaceAfter=20,borderColor=LINE,borderWidth=.5,borderPadding=8,backColor=SAGE,**common),
    }

def make_pdf(t, lang, solutions):
    font=pdfmetrics.getFont('AdaSans')
    used=''.join(v for k,v in t.items() if k.startswith('teachers.'))
    missing=sorted({ch for ch in used if not ch.isspace() and ord(ch) not in font.face.charToGlyph})
    assert not missing, (lang,missing)
    style=styles()
    title=t['teachers.solutionsTitle' if solutions else 'teachers.worksheetTitle']
    section_label=t['teachers.pdfSolutionsLabel' if solutions else 'teachers.pdfWorksheetLabel']
    url=ORIGIN+('/' if lang=='sk' else '/'+lang+'/')+learning_pages.ROUTES[lang][1]+'/'
    def para(text,kind='body'):
        return Paragraph(escape(text),style[kind])
    story=[para(title,'title'),para(t['teachers.intro']),para(t['teachers.materials'])]
    if solutions:
        story += [para(t['teachers.goalTitle'],'heading'),para(t['teachers.goals'])]
    else:
        story += [Spacer(1,3*mm),para(t['teachers.name'],'small'),Spacer(1,3*mm)]
    for i in range(1,5):
        if i==3:
            story += [PageBreak(),para(t['teachers.tasksTitle'],'title')]
        block=[para(f'{i:02d} / '+t[f'teachers.q{i}Title'],'heading'),para(t[f'teachers.q{i}'])]
        block += [para(t[f'teachers.a{i}'],'answer')] if solutions else [WritingLines(4),Spacer(1,3*mm)]
        story += [KeepTogether(block)]
    if solutions:
        story += [para(t['teachers.differentiateTitle'],'heading'),para(t['teachers.differentiate'])]
    else:
        story += [para(t['teachers.reflectTitle'],'heading'),para(t['teachers.reflect']),WritingLines(3)]
    story += [Spacer(1,5*mm),Paragraph('<link href="'+url+'" color="#294b2b"><u>'+escape(t['teachers.online'])+'</u></link>',style['small']),para(t['teachers.credit'],'small')]

    def page_frame(canvas,doc):
        canvas.saveState()
        canvas.setFillColor(INK)
        canvas.setFont('Helvetica-Bold',12)
        canvas.drawString(MARGIN,PAGE_H-13*mm,'ADA LOVELACE')
        canvas.setFont('AdaSans',9)
        canvas.drawRightString(PAGE_W-MARGIN,PAGE_H-13*mm,lang.upper()+' / A4')
        canvas.setStrokeColor(GREEN)
        canvas.setLineWidth(1)
        canvas.line(MARGIN,PAGE_H-17*mm,PAGE_W-MARGIN,PAGE_H-17*mm)
        canvas.setFont('AdaSans',8.5)
        canvas.drawString(MARGIN,12*mm,section_label)
        canvas.drawRightString(PAGE_W-MARGIN,12*mm,f'{doc.page} / 2')
        canvas.restoreState()

    raw=BytesIO()
    doc=SimpleDocTemplate(raw,pagesize=A4,leftMargin=MARGIN,rightMargin=MARGIN,topMargin=24*mm,bottomMargin=22*mm,title=title,author='Miroslav Reiter',creator='Ada Lovelace - PDF worksheet generator',pageCompression=1,invariant=1)
    doc.build(story,onFirstPage=page_frame,onLaterPages=page_frame)
    reader=PdfReader(raw)
    assert len(reader.pages)==2, f'{lang}: unexpected page count {len(reader.pages)}'
    writer=PdfWriter(clone_from=reader)
    writer.root_object[NameObject('/Lang')]=TextStringObject(lang)
    writer.add_outline_item(title,0)
    writer.add_outline_item(t['teachers.tasksTitle']+' 3 - 4',1)
    result=BytesIO()
    writer.write(result)
    return result.getvalue()

def build(output):
    pdfmetrics.registerFont(TTFont('AdaSans',str(FONT)))
    output.mkdir(parents=True,exist_ok=True)
    manifest=[]
    for lang in ('sk','cs','en','de','es'):
        t=learning_pages.load(ROOT/'i18n',lang)
        for solutions,label in [(False,'worksheet'),(True,'solutions')]:
            name=f'ada-{label}-{lang}.pdf'
            data=make_pdf(t,lang,solutions)
            (output/name).write_bytes(data)
            manifest.append({'file':name,'lang':lang,'kind':label,'pages':2,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()})
    (output/'pdf-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print(json.dumps(manifest,ensure_ascii=False))

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',type=Path,default=ROOT/'dist/downloads')
    args=parser.parse_args()
    build(args.output.resolve())
