# Jazykové verzie

Slovenčina je hlavný a predvolený jazyk. Hlavná adresa zostáva slovenská bez automatického presmerovania podľa prehliadača. Prepínač na každej stránke otvorí rovnakú podstránku v zvolenom jazyku, prípadne zachová aj kotvu sekcie. Bežné odkazy pokračujú v zvolenom jazyku.

| Jazyk | Úvod |
| --- | --- |
| Slovenčina | `/` |
| Čeština | `/cs/` |
| English | `/en/` |
| Deutsch | `/de/` |
| Español | `/es/` |

Každý jazyk má sedem strán: úvod, portfólio, kvíz, CV, zdroje a knihy, jazyk Ada a fotografie. Preložené sú texty stránok, navigácia, titulky a popisy pre vyhľadávače, alternatívne texty obrázkov, názvy ovládacích prvkov aj dynamické výsledky kvízu, oba varianty CV a galéria. Názvy kníh, mená, originálne zdroje a samotné ukážky programového kódu zostávajú v pôvodnom znení.

## Úprava prekladov

- `i18n/catalog.json` obsahuje 697 textových položiek a ich slovenské znenie.
- `i18n/sk.json`, `cs.json`, `en.json`, `de.json`, `es.json` obsahujú kompletné preklady podľa rovnakých kľúčov.
- `i18n/templates/` obsahuje zdrojové HTML stránky a JavaScript pred lokalizáciou.
- `i18n/photos.sk.json` obsahuje zdrojové metadáta galérie.
- `scripts/build-i18n.py` vytvorí všetkých 35 strán a lokalizovaný JavaScript do `dist/`.

Pri zmene textu uprav príslušný preklad a spusti:

```sh
python scripts/build-i18n.py
python scripts/check-links.py
python scripts/check-i18n.py
```

Zástupné hodnoty ako `{0}` a `{1}` aj HTML značky v prekladoch zachovaj. Pri pridaní nového textu doplň zodpovedajúcu položku do katalógu a všetkých piatich slovníkov. Súbory HTML a lokalizovaný JavaScript v `dist/` sa pri zostavení prepíšu. Zdieľané CSS a `dist/language-switch.js` sa upravujú priamo.

Ak meníš JavaScript v zdrojových šablónach, obnov aj jeho mapu prekladov. Na tento vývojový krok je potrebný parser Acorn:

Nové texty zobrazované z JavaScriptu pridaj aj do `i18n/js-texts.json` pod príslušný názov súboru. Tento explicitný zoznam oddeľuje prekladané texty od technických hodnôt, napríklad názvov HTML elementov alebo atribútov.

```sh
npm install --no-save acorn@8.19.0
node scripts/refresh-js-segments.mjs
python scripts/build-i18n.py
```

Kontrola odtlačkov zdrojov zabráni zostaveniu so zastaranou mapou. Na bežnú úpravu prekladov stačí Python. Na prevádzku hotového webu nie je potrebný Python, Node.js ani prekladová služba.

## Odkazy a vyhľadávače

Každá stránka má vlastnú kanonickú adresu, nastavenie `lang`, päť alternatív `hreflang` a slovenský `x-default`. Verejnú dostupnosť a indexovanie naďalej určujú nastavenia hostingu. Aktívny jazyk je viditeľne označený a poskytuje `aria-current="page"`.

## Overenie 13. novembra 2026

Overených bolo 35 strán a 995 lokálnych odkazov či súborov, úplnosť slovníkov, jazyk navigácie, metadáta a syntax JavaScriptu. V prehliadači boli skontrolované stránky pri šírke 1280 a 320 CSS pixelov, prepínanie jazykov, kvíz, oba varianty CV, galéria, preložené popisy a ukážky jazyka Ada. Pri jazykovej úprave bol opravený prístupný názov nemeckých tlačidiel a zvýšený kontrast drobnej poznámky pri portréte.

Automatická kontrola prístupnosti nenahrádza úplný audit WCAG ani používateľské testovanie s asistenčnými technológiami. Pôvodné historické dátumy overenia zdrojov zostali zachované; preklad nepredstavuje nový historický výskum.
