"""Shared dropdown markup with local vector flags and decorative icons."""
from html import escape as esc

def icon(name):
    paths = {
        'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
        'moon': '<path d="M20.8 13.1A9 9 0 0 1 10.9 3.2 9 9 0 1 0 20.8 13.1Z"/>',
        'monitor': '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
        'chevron': '<path d="m7 10 5 5 5-5"/>',
        'check': '<path d="m5 12 4 4L19 6"/>',
    }
    return f'<svg class="ui-icon icon-{name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">{paths[name]}</svg>'

def flag(lang):
    shapes = {
        'sk': '<path fill="#fff" d="M0 0h32v24H0z"/><path fill="#0b4ea2" d="M0 8h32v8H0z"/><path fill="#ee1c25" d="M0 16h32v8H0z"/><path fill="#ee1c25" stroke="#fff" stroke-width=".8" d="M8 5h10v8c0 4-5 6-5 6s-5-2-5-6Z"/><path stroke="#fff" stroke-width="1.4" d="M13 7v8m-3-5h6m-5-2h4"/><path fill="#0b4ea2" d="M9 15q1-3 2 0 2-5 4 0 1-3 2 0-1 2-4 3-3-1-4-3"/>',
        'cs': '<path fill="#fff" d="M0 0h32v24H0z"/><path fill="#d7141a" d="M0 12h32v12H0z"/><path fill="#11457e" d="m0 0 16 12L0 24Z"/>',
        'en': '<path fill="#012169" d="M0 0h32v24H0z"/><path stroke="#fff" stroke-width="6" d="m0 0 32 24M32 0 0 24"/><path stroke="#c8102e" stroke-width="2" d="m0 0 32 24M32 0 0 24"/><path stroke="#fff" stroke-width="9" d="M16 0v24M0 12h32"/><path stroke="#c8102e" stroke-width="5" d="M16 0v24M0 12h32"/>',
        'de': '<path fill="#151515" d="M0 0h32v8H0z"/><path fill="#d00" d="M0 8h32v8H0z"/><path fill="#ffce00" d="M0 16h32v8H0z"/>',
        'es': '<path fill="#aa151b" d="M0 0h32v24H0z"/><path fill="#f1bf00" d="M0 6h32v12H0z"/><path fill="#aa151b" d="M9 9h5v5c0 3-5 3-5 0z"/><path stroke="#f5e6b4" stroke-width="1.5" d="M11.5 9v7m-2.5-4h5M7 10v5m9-5v5"/><path fill="#aa151b" d="M9 7h5v1H9z"/>',
    }
    return f'<svg class="language-flag" viewBox="0 0 32 24" aria-hidden="true" focusable="false">{shapes[lang]}</svg>'

def language_picker(lang, languages, index, page_url, label, nav_label):
    options = []
    for code, name in languages.items():
        active = ' aria-current="page"' if code == lang else ''
        options.append(f'<li><a href="{page_url(code,index)}" lang="{code}" hreflang="{code}" data-language="{code}"{active}>{flag(code)}<span class="option-name">{name}</span><span class="option-check">{icon("check")}</span></a></li>')
    code = 'CZ' if lang == 'cs' else lang.upper()
    return f'''<nav class="language-bar" aria-label="{esc(nav_label)}"><span id="language-label" class="sr-only">{esc(nav_label)}</span>
<details class="salon-dropdown language-dropdown"><summary aria-labelledby="language-label language-current-name language-current-code">{flag(lang)}<span id="language-current-name" lang="{lang}">{languages[lang]}</span><span id="language-current-code" class="compact-label" aria-hidden="true">{code}</span>{icon('chevron')}</summary>
<ul class="language-switch dropdown-panel">{''.join(options)}</ul></details></nav>'''

def theme_picker(t):
    modes = [('system','monitor'),('light','sun'),('dark','moon')]
    options = ''.join(f'<li><button type="button" data-theme-option="{value}" data-short-label="{esc(t["theme.short."+value])}" aria-pressed="{str(value=="system").lower()}">{icon(symbol)}<span class="option-name">{esc(t["theme."+value])}</span><span class="option-check">{icon("check")}</span></button></li>' for value,symbol in modes)
    native = ''.join(f'<option value="{value}"'+(' selected' if value=='system' else '')+f'>{esc(t["theme."+value])}</option>' for value,_ in modes)
    return f'''<div class="theme-picker" role="region" aria-label="{esc(t['theme.label'])}"><label id="theme-label" class="sr-only" for="theme-select">{esc(t['theme.label'])}</label>
<select id="theme-select" disabled data-system-status="{esc(t['theme.systemStatus'])}" data-storage-notice="{esc(t['theme.storage'])}">{native}</select>
<details class="salon-dropdown theme-dropdown" hidden><summary aria-labelledby="theme-label theme-current-label"><span id="theme-current-icon">{icon('monitor')}</span><span id="theme-current-label">{esc(t['theme.system'])}</span><span id="theme-current-short" class="compact-label" aria-hidden="true">{esc(t['theme.short.system'])}</span>{icon('chevron')}</summary><ul class="dropdown-panel">{options}</ul></details>
<p id="theme-status" class="sr-only" role="status" aria-live="polite"></p><noscript>{esc(t['theme.noScript'])}</noscript></div>'''
