# Lokálne vzdelávacie rozšírenie

Dátum: 18. november 2026. Táto verzia je určená na lokálne skúšanie. Nebola publikovaná do Sites. GitHub vetva: `local-improvements`.

## Osem zlepšení

1. Prehliadky pre zvedavca, študenta a učiteľa: 3 trasy, odhad 5, 15 a 45 minút, odškrtávanie krokov a zachovanie pokroku pri prepnutí jazyka.
2. Centrum sťahovania: jazyk dokumentu, pracovný list alebo riešenia, PDF/DOCX/HTML, jazykový ZIP a spoločný ZIP. Priame odkazy fungujú aj bez JavaScriptu. Učiteľský kútik má skrátený panel s odkazom na centrum.
3. Vyhľadávanie: 25 strán a 2 HTML dokumenty na jazyk, bez rozlišovania diakritiky a veľkých písmen, uprednostnenie názvu a opisu, ukážka okolia hľadaného výrazu, zdieľateľný parameter `q`.
4. Kvízová akadémia: 18 otázok v každom jazyku, 3 úrovne po 6 otázok, vysvetlenia a zdroje, obnovenie rozpracovanej úrovne, prehľad odpovedí, opakovanie iba chýb a vymazanie uloženého kvízu. Pôvodný kvíz zostáva dostupný.
5. Stratená poznámka G: tri indície, nesprávne odpovede bez zablokovania hry, nápoveda, obnovenie kroku, dokončenie a samostatne rozbaliteľné riešenie pre učiteľa. Príbeh a ocenenie sú označené ako fikcia. Matematika používa moderné označenie.
6. Zostavovač hodiny: 15/45/90 minút, vek 10 až 12/13 až 15/16+, história/algoritmy/kritické myslenie. Spolu 27 kombinácií na jazyk. Ciele, časovanie, aktivity, prispôsobenie veku a odkazy. Text možno upraviť pred tlačou alebo stiahnutím ako samostatné HTML. PDF sa vytvára cez tlačový dialóg prehliadača.
7. Offline balík: výslovné uloženie jazyka, priebeh, kontrola úplnosti, odstránenie a opätovné uloženie. Obsahuje textové stránky okrem galérie, interakcie, vyhľadávanie, PDF/DOCX/HTML a ZIP daného jazyka. Veľké fotografie, externé zdroje a externé písma nie sú súčasťou balíka. Všetky jazyky možno uložiť postupne. Odkazy na neuložený jazyk vyžadujú pripojenie.
8. Použiteľnosť a jazyková kvalita: pomoc a slovník v piatich jazykoch, kontrola prekladových kľúčov, označenie polí, klávesnica, živé oznámenia, viditeľný fokus, responzívne rozloženie, svetlý/tmavý režim a zaznamenaný audit.

## Spustenie

Zo základného priečinka projektu:

```text
python scripts/preview.py
```

Otvorte `http://127.0.0.1:8743/zacnite-tu/`. Server počúva iba na miestnom počítači. Ukončenie: Ctrl+C. Pri obsadenom porte použite `python scripts/preview.py --port 8744`. Uložený offline obsah je viazaný aj na port a prehliadač. Otvorenie HTML cez `file:` neumožní všetky interakcie ani offline worker.

Vstupy jazykov: `/zacnite-tu/`, `/cs/zacnete-zde/`, `/en/start-here/`, `/de/hier-starten/`, `/es/empieza-aqui/`.

## Zdrojové súbory a obnovenie výstupov

- `scripts/studio-translations.py`: spoločný zdroj nových prekladov; generuje `i18n/studio.*.json`.
- `scripts/studio_pages.py`: HTML, vyhľadávacie indexy a offline manifest.
- `dist/studio.js`, `dist/studio-core.mjs`, `dist/studio.css`: správanie, pravidlá a vzhľad.
- `scripts/offline-sw.template.js`: zdroj service workera; `dist/offline-sw.js` sa generuje pri zostavení.
- `scripts/quiz-bank.cjs`: načíta existujúce preložené otázky; šesť nových otázok pochádza z nového katalógu.

```text
python scripts/studio-translations.py
python scripts/build-i18n.py
python scripts/check-i18n.py
python scripts/check-links.py
python scripts/check-studio.py
node scripts/test-studio.mjs
node scripts/test-offline.mjs
node scripts/test-bernoulli.mjs
node scripts/test-experiences.mjs
node scripts/test-theme.mjs
```

Výstup: 125 jazykových stránok, 10 HTML dokumentov, nezmenených 10 PDF, 10 DOCX a 6 ZIP balíkov. Nové stránky sú prepojené v menu, úvode a medzi sebou. Prepínač jazyka zachováva zodpovedajúcu stránku.

## Uchovávanie údajov

Trasy, aktuálny kvíz a krok hry sa ukladajú len v prehliadači. Jazykové verzie používajú spoločné identifikátory úloh. Neodosielajú sa výsledky na server a nevytvárajú sa používateľské účty. Zostavený plán ostáva v otvorenej stránke, kým si ho používateľ nestiahne. Vymazanie offline balíka nemaže pokrok.

Offline worker používa zoznam povolených miestnych súborov. Nezachytáva API, zápisové požiadavky ani externé domény. Neúplné sťahovanie sa neoznámi ako úspech; predchádzajúca verzia zostáva zachovaná. Po zmene obsahu sa mení identifikátor balíka. Pri novej verzii treba balík uložiť znova.

## Overenie a hranice

Výsledky a presný rozsah sú v `KONTROLA-STUDIO.md`. Automatické kontroly a simulovaná mobilná šírka nenahrádzajú testy s ľuďmi, fyzickými zariadeniami a asistenčnými technológiami. Kompletná certifikácia WCAG ani jazyková korektúra rodenými hovoriacimi nie sú súčasťou tejto verzie.
