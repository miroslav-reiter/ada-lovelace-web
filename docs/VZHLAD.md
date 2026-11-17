# Svetlý, tmavý a systémový režim

Na všetkých 85 stránkach je pri navigácii dostupný prepínač Vzhľad. Ovládanie je preložené do slovenčiny, češtiny, angličtiny, nemčiny a španielčiny.

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

## Rozbaľovacie ponuky 16. novembra 2026

Výber jazykov používa rozbaľovaciu ponuku s lokálnymi vektorovými vlajkami a názvami jazykov. Pri vzhľade sú ikonky monitora, slnka a mesiaca. Fajka označuje aktuálnu voľbu aj bez rozlišovania farieb. SVG ikony sú dekoratívne a skryté pred čítačkami obrazovky; ovládacie prvky majú textové názvy.

Ponuky používajú natívne `details` a `summary`, odkazy pre jazyky a tlačidlá s `aria-pressed` pre vzhľad. Enter alebo medzerník otvorí ponuku, šípky presúvajú fokus, Home a End vyberajú krajnú položku a Escape vráti fokus na prepínač. Kliknutie mimo ponuky alebo presunutie fokusu ju zatvorí. Zmena jazyka zachováva príslušnú podstránku aj odkaz na miesto v nej.

Na úzkych obrazovkách sa ponuka rozbalí do toku stránky, aby neprekrývala iné ovládanie. Pri vypnutom JavaScripte zostáva jazyková navigácia funkčná. Pri nenačítanom doplnku ponúk sa zachová pôvodný natívny výber vzhľadu. Súbory `dist/dropdowns.css`, `dist/dropdowns.js` a `scripts/ui_controls.py` tvoria spoločnú úpravu pre všetkých 55 strán.

Overené boli otvorené ponuky v piatich jazykoch, svetlý aj tmavý vzhľad pri šírke 1280 CSS px a mobilné rozloženie pri 320 CSS px. Slovenská a nemecká verzia boli overené aj pri 200 % texte. Po opravách boli kontrolované stavy bez automatických porušení axe-core 4.14.0 a bez horizontálneho presahu stránky. Overené bolo ovládanie klávesnicou, zatvorenie mimo ponuky, zachovanie podstránky pri zmene jazyka a uloženie vzhľadu po obnovení. Statická kontrola pokrýva 55 strán a 2120 miestnych odkazov či súborov. Limity auditu uvedené vyššie naďalej platia.

## Kompaktná hlavička 16. novembra 2026

Oba prepínače sú vedľa seba priamo v hlavičke. Samostatný jazykový riadok bol odstránený a panel pohodlného čítania zostal pri doplnkovej navigácii. Pri šírke 1280 CSS px sa začiatok obsahu posunul z približne 360 na 248 px od vrchu stránky.

Pri šírke do 760 CSS px sú Stroj času, Dierne štítky, Adina poradňa a Salónne noviny súčasťou rozbaľovacieho hlavného menu. Samostatný riadok s týmito odkazmi je na mobile skrytý. Na širších obrazovkách zostáva pôvodná doplnková navigácia. Obe zobrazenia používajú spoločné preklady a označujú aktuálnu podstránku; skryté odkazy nevstupujú do poradia klávesu Tab.

Na mobile sa zobrazí vlajka so skratkou jazyka a ikonka s krátkym názvom vzhľadu. Otvorené ponuky majú celú šírku dvojice prepínačov a rozbalia sa do toku stránky. Celé názvy zostávajú v ponukách aj v prístupných názvoch ovládania. Pri zväčšenom texte sa krátky názov vzhľadu skryje, aby oba prepínače zostali vedľa seba; aktuálny režim naďalej označuje ikonka a celý prístupný názov.

Overenie zahŕňalo otvorené ponuky vo všetkých piatich jazykoch pri 1280 a 320 CSS px, svetlý a tmavý režim, vybrané jazykové verzie pri 768 CSS px, mobilné menu a klávesnicové prepnutie na českú verziu aktuálneho CV. Slovenčina, nemčina a španielčina boli pri 320 CSS px overené aj s textom zväčšeným na 200 %. Po opravách boli kontrolované stavy bez horizontálneho presahu a automaticky zistených porušení axe-core. Statická kontrola potvrdzuje umiestnenie oboch prepínačov v hlavičke všetkých 55 strán. Nejde o úplnú certifikáciu WCAG; predchádzajúce limity overenia platia aj naďalej.
