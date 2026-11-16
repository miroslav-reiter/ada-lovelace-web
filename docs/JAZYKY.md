# Jazykové verzie

Slovenčina je hlavný a predvolený jazyk. Hlavná adresa zostáva slovenská bez automatického presmerovania podľa prehliadača. Prepínač na každej stránke otvorí rovnakú podstránku v zvolenom jazyku, prípadne zachová aj kotvu sekcie. Bežné odkazy pokračujú v zvolenom jazyku.

| Jazyk | Úvod |
| --- | --- |
| Slovenčina | `/` |
| Čeština | `/cs/` |
| English | `/en/` |
| Deutsch | `/de/` |
| Español | `/es/` |

Každý jazyk má jedenásť strán: úvod, portfólio, kvíz, CV, zdroje a knihy, jazyk Ada, fotografie, stroj času, dielňa diernych štítkov, poradňa a noviny. Preložené sú texty stránok, navigácia, titulky a popisy pre vyhľadávače, alternatívne texty obrázkov, názvy ovládacích prvkov aj dynamické výsledky kvízu, oba varianty CV a galéria. Názvy kníh, mená, originálne zdroje a samotné ukážky programového kódu zostávajú v pôvodnom znení.

## Úprava prekladov

- `i18n/catalog.json` obsahuje 697 textových položiek a ich slovenské znenie.
- `i18n/sk.json`, `cs.json`, `en.json`, `de.json`, `es.json` obsahujú kompletné preklady podľa rovnakých kľúčov.
- `i18n/templates/` obsahuje zdrojové HTML stránky a JavaScript pred lokalizáciou.
- `i18n/experience.sk.json`, `experience.cs.json`, `experience.en.json`, `experience.de.json`, `experience.es.json` obsahujú ďalších 210 textov nových sekcií, diplomu a nastavení čítania.
- `scripts/experience_pages.py` vytvára ich spoločné šablóny.
- `i18n/photos.sk.json` obsahuje zdrojové metadáta galérie.
- `scripts/build-i18n.py` vytvorí všetkých 55 strán a lokalizovaný JavaScript do `dist/`.

Pri zmene textu uprav príslušný preklad a spusti:

```sh
python scripts/build-i18n.py
python scripts/check-links.py
python scripts/check-i18n.py
```

Zástupné hodnoty ako `{0}` a `{1}` aj HTML značky v prekladoch zachovaj. Pri pridaní nového textu doplň zodpovedajúcu položku do katalógu a všetkých piatich slovníkov. Súbory HTML a lokalizovaný JavaScript v `dist/` sa pri zostavení prepíšu. Zdieľané CSS, `dist/language-switch.js`, `dist/experiences.js`, `dist/reading-init.js` a `dist/machine-core.mjs` sa upravujú priamo. Po zmene zdieľaných súborov aktualizuj aj verziu ich odkazu v generátore, aby prehliadač načítal aktuálny obsah.

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

## Rozšírenie 15. novembra 2026

Web má 55 strán, 697 základných a 210 nových prekladových položiek pre každý jazyk. Kontrola potvrdila úplnosť prekladov, 1900 lokálnych odkazov, správne jazykové odkazy, kanonické adresy a jazykové metadáta. Nové štyri sekcie boli v každom jazyku overené pri šírke 320 aj 1280 CSS px. Podrobnosti sú v [popise rozšírenia](INTERAKTIVNE-SEKCIE.md).

Prepínač vzhľadu pridal ďalších 7 položiek, spolu je teda 217 položiek v každom slovníku `experience.*.json`. Zdieľané `dist/theme.js` a `dist/theme.css` sa upravujú priamo. Všetky tri režimy a stavové oznámenia sú preložené do všetkých piatich jazykov. Podrobnosti sú v [dokumentácii vzhľadu](VZHLAD.md).

Od 16. novembra 2026 je výber jazykov rozbaľovací zoznam s vlajkami a názvami jazykov. Názvy zostávajú v príslušnom jazyku a aktívny jazyk označuje fajka aj `aria-current="page"`. Odkazy stále vedú na rovnakú podstránku vo vybranom jazyku a zachovávajú fragment adresy. Vlajky sa vykresľujú lokálne ako SVG, bez závislosti od podpory emoji v systéme. Spoločnú šablónu ponúk obsahuje `scripts/ui_controls.py`.

Kompaktná hlavička používa na mobile skratky SK, CZ, EN, DE a ES a preložené krátke názvy režimov vzhľadu. Pribudli tri položky `theme.short.*`, spolu má každý slovník `experience.*.json` 220 položiek. Celé názvy zostávajú dostupné v ponukách a pre asistenčné technológie.
