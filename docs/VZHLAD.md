# Svetlý, tmavý a systémový režim

Na všetkých 55 stránkach je pri navigácii dostupný prepínač Vzhľad. Ovládanie je preložené do slovenčiny, češtiny, angličtiny, nemčiny a španielčiny.

- **Podľa systému** je predvolená voľba. Vzhľad sleduje nastavenie prehliadača alebo počítača a reaguje aj na jeho zmenu počas návštevy.
- **Svetlý režim** zachováva pôvodný papierový salón.
- **Tmavý režim** používa tmavé zelené podklady, svetlý text a teplé akcenty. Vlastné farby majú aj kvíz, galéria, projektové dialógy, poradňa a dielňa.

Voľba sa ukladá iba v prehliadači pod kľúčom `ada-theme-v1`. Platí aj po obnovení stránky, pri zmene podstránky alebo jazyka a synchronizuje sa medzi otvorenými kartami rovnakej adresy. Neodosiela sa na server. Ak prehliadač úložisko zablokuje, prepínač funguje v aktuálnej stránke a oznámi nemožnosť uloženia. Nastavenia čítania zostávajú samostatné.

`dist/theme.js` sa načíta v hlavičke pred štýlmi a nastaví vzhľad pred vykreslením obsahu. `dist/theme.css` dopĺňa spoločné ovládanie a paletu. Preklady sú v `i18n/experience.*.json`; ovládanie generuje `scripts/experience_pages.py`. Bez JavaScriptu zostáva svetlý režim, neaktívny prepínač a vysvetlenie. Tlačové štýly zachovávajú svetlé dokumenty. Papierový diplom a export PNG zostávajú svetlé aj pri tmavom rozhraní.

## Overenie 15. novembra 2026

- Automatické kontroly všetkých 55 strán a 2010 lokálnych odkazov, úplnosti prekladov, troch volieb a poradia načítania skriptu.
- Test správania: počiatočný systémový vzhľad, explicitná voľba, uloženie, zmena systému, synchronizácia kariet, neplatná uložená hodnota, zablokované úložisko a staršie rozhranie prehliadača.
- Opera, axe-core 4.14.0: všetkých 11 slovenských typov stránok v tmavom režime pri 1280 aj 320 CSS px a vo svetlom režime pri 1280 CSS px bez automaticky zistených porušení a horizontálneho presahu stránky.
- Tmavý režim so zväčšením textu na 200 % pri 320 CSS px: všetkých 11 slovenských typov stránok a nemecká titulná stránka bez horizontálneho presahu a automaticky zistených porušení po oprave dlhých popisov a odkazov.
- Pri 320 CSS px boli overené aj titulné stránky ostatných štyroch jazykov, preložený prepínač a zachovanie tmavej voľby.
- Overené prepnutie klávesnicou, obnovenie stránky, správna odpoveď kvízu, projektový dialóg a detail fotografie. Systémový režim v prehliadači zodpovedal aktuálnemu systémovému nastaveniu; zmenu samotného systému overuje test správania bez zmeny nastavení používateľovho počítača.

Príkazy:

```sh
python scripts/build-i18n.py
python scripts/check-i18n.py
python scripts/check-links.py
node scripts/test-theme.mjs
node scripts/test-experiences.mjs
```

Automatická kontrola má limity pri obrázkoch, dekoráciách a prekrývaných pozadiach. Nejde o certifikáciu úplnej zhody WCAG ani nový právny audit. Nebolo vykonané používateľské testovanie s čítačkou obrazovky, na fyzickom mobile ani kontrola výsledného tlačového PDF. Podrobnosti širšieho overenia sú v [kontrole prístupnosti](PRISTUPNOST.md).
