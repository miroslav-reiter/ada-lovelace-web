# Interaktívne rozšírenie salónu

Implementované 15. novembra 2026. Všetky funkcie sú v slovenčine, češtine, angličtine, nemčine a španielčine. Slovenčina zostáva predvolená. Web má 11 strán v každom jazyku, spolu 55.

## Nové miestnosti

| Sekcia | Slovenská cesta | Správanie |
| --- | --- | --- |
| Adin stroj času | `/stroj-casu/` | Šesť udalostí, výber roka, predchádzajúca a ďalšia udalosť, portréty s pôvodom, odkazy na historické zdroje. Jazykový prepínač zachová vybranú udalosť. |
| Dielňa diernych štítkov | `/dierne-stitky/` | Dve úlohy: výpočet čísla 10 a príprava čaju. Pridávanie, presun a odstránenie štítkov, vzorový program, krokovanie, spustenie, pozastavenie, reštart a záznam krokov. |
| Adina poradňa | `/poradna/` | Šesť pripravených otázok o chybách, AI, termínoch, poradách, učení a nasadzovaní. Každá odpoveď má fiktívny komentár a praktickú radu. |
| Salónne noviny | `/noviny/` | Šesť fiktívnych článkov v troch kategóriách, filter s počtom výsledkov a rozbalenie celého článku. |

História a vymyslené komentáre sú označené osobitne. Poradňa používa pripravené odpovede; nepripája sa na AI službu. Dielňa je moderná vzdelávacia simulácia a nepredstiera rekonštrukciu historického analytického stroja.

Historické oporné body pochádzajú z [Computer History Museum](https://www.computerhistory.org/babbage/adalovelace/), [Clay Mathematics Institute](https://www.claymath.org/online-resources/ada-lovelaces-mathematical-papers/) a [úvodu AdaCore k jazyku Ada](https://learn.adacore.com/courses/intro-to-ada/chapters/introduction.html). Historické portréty ilustrujú osobnosť, nie konkrétny rok udalosti.

## Diplom po kvíze

Po dokončení 12 otázok návštevník dostane diplom so skóre, dátumom a titulom podľa výsledku. Meno alebo prezývka sú nepovinné. Diplom sa vytvorí lokálne v prehliadači a dá sa stiahnuť ako PNG s rozmermi 1800 × 1272 px. Po vytvorení zostane dostupný aj samostatný odkaz na stiahnutie. Zmena mena alebo reštart kvízu zruší starý odkaz, aby sa nepoužil neaktuálny súbor.

Tlačidlo tlače pripraví samostatný diplom pre tlačový dialóg prehliadača, kde možno zvoliť uloženie do PDF. Ide o humornú pamiatku, nie akreditovaný doklad. Meno ani výsledok sa neposielajú na server.

## Pohodlné čítanie

Spoločné ovládanie ponúka text 100, 125, 150 alebo 200 %, pokojnejšie rozloženie a obmedzenie pohybu. Voľby sú uložené pod `ada-reading-v1` v miestnom úložisku prehliadača a platia naprieč stránkami aj jazykmi. Pri nedostupnom úložisku možno voľby použiť na aktuálnej stránke. Obnovenie predvolených hodnôt je dostupné priamo v paneli.

## Overenie

- Generovanie všetkých 55 strán, úplnosť 697 základných a 210 nových textových položiek na jazyk.
- Kontrola 1900 lokálnych odkazov a súborov, jedinečných identifikátorov, jedného hlavného nadpisu a jazykových metadát.
- Testy výpočtového modelu: aritmetika, zlé poradie, chýbajúci výstup, neznámy príkaz, maximálny počet štítkov, predpoklady čajových krokov, nemennosť predchádzajúceho stavu a hranice titulov na diplome.
- V prehliadači overené úspešné aj chybné programy, krokovanie, presun štítku, pozastavenie a pokračovanie, obe úlohy, prepnutie jazyka so zachovaním udalosti, poradňa klávesnicou, filtre a otvorenie článku.
- Dokončenie slovenského aj anglického kvízu, výsledok 12/12, meno na diplome, vytvorenie odkazu na PNG a reštart kvízu. Použité rozhranie automatizovaného prehliadača nepodporuje prevzatie súborov z adresy `blob:`, preto nebol výsledný PNG vizuálne skontrolovaný zo stiahnutého súboru. Tlačové PDF neprešlo samostatnou vizuálnou kontrolou.
- Axe-core 4.14.0 na všetkých 20 nových jazykových podstránkach pri šírke 320 aj 1280 CSS px: žiadne automaticky zistené porušenia. Niektoré obrázkové pozadia zostali na manuálne posúdenie kontrastu.
- Zväčšenie na 200 % pri 320 CSS px, ukladanie a obnovenie nastavení, opravy zalamovania dlhých názvov a dekorácií.

Automatická kontrola nie je úplný audit WCAG. Podrobnosti a jeho hranice sú v [poznámkach k prístupnosti](PRISTUPNOST.md).

```sh
python scripts/build-i18n.py
python scripts/check-links.py
python scripts/check-i18n.py
node scripts/test-experiences.mjs
node --check dist/experiences.js
node --check dist/reading-init.js
```

Zdrojové preklady nových častí sú v `i18n/experience.<jazyk>.json`, šablóny v `scripts/experience_pages.py`, správanie v `dist/experiences.js` a čistý výpočtový model v `dist/machine-core.mjs`. Nie je potrebný serverový účet, databáza ani platená AI služba.
