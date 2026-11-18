# Kontrola lokálneho rozšírenia

Dátum: 18. november 2026. Rozsah: osem zlepšení, slovenčina, čeština, angličtina, nemčina a španielčina. Overovanie prebehlo na lokálnej adrese, bez nasadenia do Sites.

## Výsledky

| Kontrola | Výsledok |
| --- | --- |
| Preklady a navigácia | 125 jazykových stránok, úplné katalógy a zodpovedajúce odkazy pri zmene jazyka |
| Miestne odkazy | 135 HTML súborov, 6 955 odkazov a aktív; bez chýbajúcich súborov, duplicitných ID a porušenia jedného hlavného nadpisu |
| Nové stránky | axe-core 4.14.0: 40 nových stránok v svetlom režime, bez automaticky zistených porušení; záznam `studio-browser-audit.json` |
| Mobilný tmavý režim | Šírka 320 px, stránky vstupu, sťahovania, kvízu a plánovača v SK/DE/ES: 12 kontrol bez automatických porušení a vodorovného pretečenia stránky |
| Zväčšenie | Slovenský plánovač pri šírke 320 px a základnom texte 200 % bez vodorovného pretečenia; fokus po zostavení na nadpise plánu |
| Klávesnica | Preskočenie na obsah presúva fokus na hlavný obsah; Enter spustí vyhľadávanie; Escape zatvorí mobilné menu |
| Trasy | Odškrtnutý krok zostal po obnovení aj prepnutí SK -> EN |
| Kvíz | Nesprávna odpoveď zostala po obnovení; pokračovanie SK -> EN; výsledok 5/6; opakovanie jednej chyby skončilo 1/1 |
| Detektívna hra | Nesprávna odpoveď neodomkla ďalšiu indíciu; obnovenie druhého kroku; všetky tri skúšky a dokončenie |
| Plán hodiny | 27 kombinácií overených testom časovania; v prehliadači SK 45 min/13 až 15/kritické myslenie, zmena cieľa a stiahnuté HTML zachovalo úpravu |
| Dokumenty | Nemecký DOCX stiahnutý cez centrum mal totožný SHA-256 s pôvodným súborom |
| Offline v prehliadači | Všetkých 5 jazykov uložených; lokálny HTTP server zastavený a jeho nedostupnosť overená samostatnou požiadavkou; vyhľadávanie, pokročilý kvíz aj 45-minútový plán fungovali v každom jazyku |
| Offline dokumenty | Anglické PDF, DOCX a jazykový ZIP stiahnuté pri vypnutom serveri; SHA-256 všetkých troch súborov zhodný s originálmi |
| Správa offline balíka | Odstránenie španielskeho balíka, potvrdenie neúplnosti a opätovné uloženie; kontrola uloženého slovenského balíka aj bez servera |
| Odolnosť | Testy neplatného uloženého kvízu, chýbajúceho dokumentu, prerušeného offline uloženia, zachovania starej kópie a izolovaného odstránenia; API a POST požiadavky sa neukladajú |
| Pôvodné interakcie | Existujúce testy Bernoulliho výpočtov, dielne a vzhľadu prešli |

## Opravy nájdené pri skúšaní

- Vyhľadávanie uprednostňuje názov a opis pred všeobecným výskytom textu. Pri výraze Bernoulli je prvý výsledok stránka algoritmu vo všetkých jazykoch.
- Kvízové ovládanie sa aktivuje až po načítaní otázok, aby rýchle prepnutie úrovne neprepísal obnovovaný stav.
- Offline kontrola používa už aktívny worker aj bez pripojenia a pri otvorení stránky nezobrazuje nesprávne tvrdenie o chýbajúcom balíku.
- Centrum sťahovania načíta dokument do pamäte pred uložením. Tým funguje offline aj v prehliadači, ktorý pri priamom sťahovaní obchádza service worker.
- Nemecký slovník používa termín Rekurrenz pre matematický vzťah medzi po sebe vypočítanými hodnotami.

## Limity overenia

Automatický audit nie je certifikácia úplnej zhody WCAG. Testy neprebehli s NVDA, JAWS ani VoiceOver, na fyzickom mobile, v Safari ani v skupine skutočných žiakov a učiteľov. Šírka 320 px je simulované rozloženie v prehliadači. Výpadok bol overený zastavením lokálneho servera; sieť počítača sa nevypínala. Externé zdroje, veľké fotografie a externé písma ostávajú mimo offline balíka. Spoločný ZIP všetkých jazykov sa sťahuje online.

Preklady majú kontrolovanú štruktúru, zástupné premenné, lokálne odkazy a konzistentný nový slovník. Nejde o potvrdenie profesionálnej korektúry rodenými hovoriacimi. Pri budúcom používateľskom teste treba zaznamenať zariadenie, jazyk, úlohu, výsledok a konkrétnu prekážku.

## Scenár následného používateľského testu

1. Nájsť pracovný list vo vlastnom jazyku, zmeniť ho na upraviteľný Word a stiahnuť ho.
2. Vytvoriť 45-minútovú hodinu pre vek 13 až 15 rokov, upraviť cieľ a uložiť plán.
3. Dokončiť kvíz, zopakovať chybu, obnoviť stránku a zmeniť jazyk.
4. Prejsť detektívnu hru s klávesnicou a použiť nápovedu.
5. Uložiť balík, odpojiť pripojenie, otvoriť vyhľadávanie, aktivitu a dokument.

Otvorené položky sa majú označiť ako nevykonané, kým nie sú skutočne odskúšané.
