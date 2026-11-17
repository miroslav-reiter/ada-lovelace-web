# Ada Lovelace - Kód, čaj a chaos

Recesistický viacjazyčný web o Ade Lovelace: overené historické informácie, vedome vymyslené projekty a viktoriánsky humor s notebookom na pláži.

**Web:** [Ada Lovelace - Kód, čaj a chaos](https://ada-lovelace.vita-academy-7121.chatgpt.site/)

Prístup na web sa riadi jeho nastaveniami v Sites. Tento repozitár obsahuje kompletné súbory poslednej publikovanej verzie vrátane všetkých obrázkov. Pôvodná história troch úprav zo Sites je zachovaná v obnoviteľnom Git archíve `docs/source-history.bundle`.

## Jazyky

Slovenčina je predvolená. Každý jazyk obsahuje všetkých sedemnásť strán vrátane interaktívneho kvízu, životopisu, galérie a stránky o autorovi. Prepínač zachová rovnakú podstránku a sekciu.

Na mobile sú odkazy Stroj času, Dierne štítky, Adina poradňa a Salónne noviny v hlavnom rozbaľovacom menu, aby hlavička zaberala menej miesta. Na počítači zostávajú v samostatnej navigácii.

- [Slovenčina](https://ada-lovelace.vita-academy-7121.chatgpt.site/)
- [Čeština](https://ada-lovelace.vita-academy-7121.chatgpt.site/cs/)
- [English](https://ada-lovelace.vita-academy-7121.chatgpt.site/en/)
- [Deutsch](https://ada-lovelace.vita-academy-7121.chatgpt.site/de/)
- [Español](https://ada-lovelace.vita-academy-7121.chatgpt.site/es/)

[Úprava prekladov a technické overenie](docs/JAZYKY.md)

## Čo tu nájdeš

| Stránka | Cesta | Obsah |
| --- | --- | --- |
| Salón | `/` | Úvod do života Ady, projekty a humor |
| Portfólio | `/portfolio/` | Skutočné aj jasne označené vymyslené projekty |
| Kvíz | `/kviz/` | 12 otázok, vysvetlenia a osobný diplom s exportom PNG |
| Životopis / CV | `/cv/` | Ada ako dnešná programátorka alebo vibe coder |
| Zdroje a knihy | `/zdroje/` | Historické pramene a knihy |
| Jazyk Ada | `/jazyk-ada/` | Predstavenie programovacieho jazyka Ada |
| Fotografie | `/fotografie/` | Historická fotografia, dva maľované portréty a tri AI scény |
| Stroj času | `/stroj-casu/` | Šesť historických zastávok so zdrojmi a fiktívnym komentárom |
| Dierne štítky | `/dierne-stitky/` | Výpočtová a čajová úloha, poradie, krokovanie a chyby |
| Adina poradňa | `/poradna/` | Šesť pripravených otázok s humorom a praktickou radou |
| Salónne noviny | `/noviny/` | Šesť fiktívnych článkov s kategóriami a filtrami |
| O stránke Ada | `/o-stranke-ada/` | Vznik webu, autor Miroslav Reiter, IT Academy, VITA a profesijné profily |

Galéria obsahuje filtre, zväčšovanie, ovládanie šípkami, zatvorenie klávesom Escape a odkazy na stiahnutie obrázkov. Web má responzívny dizajn a mobilné menu. Na každej stránke je pohodlné čítanie: veľkosť textu až 200 %, pokojnejšie rozloženie a obmedzenie pohybu. Celkovo ide o 85 strán v piatich jazykoch. [Podrobnosti o stránke autora a zdrojoch](docs/O-STRANKE.md).

[Popis nových funkcií a overenia](docs/INTERAKTIVNE-SEKCIE.md)

## Nové vzdelávacie sekcie

- Adin algoritmus krok za krokom: interaktívny výpočet Bernoulliho čísel s presnými zlomkami.
- Učiteľský kútik: 45-minútová hodina, štyri úlohy a 10 samostatných materiálov na stiahnutie.
- Ženy v dejinách informatiky: štyri priekopníčky s overiteľnými zdrojmi.
- Fakt alebo mýtus?: päť tvrdení, vysvetlenia a rozlíšenie citátu od fikcie.
- Zákulisie tvorby s AI: skutočné zadania, zmeny a snímky pred úpravou a po nej.

Všetko je preložené do piatich jazykov. Stránky nájdete v menu Objavovať aj na úvode. Pracovné listy a riešenia sú priamo na stiahnutie ako PDF, upraviteľný Word (DOCX) aj samostatné HTML, spolu 30 súborov. Každé PDF má dve strany A4 a základný text veľkosti 12 bodov. Word dokumenty obsahujú bežné upraviteľné odseky a nadpisy, bez makier alebo ochrany proti úpravám. Všetky formáty fungujú offline. [Podrobný opis a zdroje](docs/VZDELAVACIE-STRANKY.md).

V každom jazyku je navyše tlačidlo na stiahnutie celého ZIP balíka. Jeden balík obsahuje štyri dokumenty v danom jazyku: pracovný list a riešenia vo formátoch PDF aj DOCX. ZIP balíky sa automaticky obnovujú pri `python scripts/build-i18n.py`; spusti ho po zmene PDF alebo DOCX. Kontrola obsahu: `python scripts/download_bundles.py --check`.

PDF vznikajú z rovnakých prekladov ako web. Na ich obnovenie po zmene obsahu:

```sh
python -m pip install -r scripts/requirements-pdf.txt
python scripts/build-pdfs.py
python scripts/build-i18n.py
python scripts/check-pdfs.py
```

Generátor, kontroly, vložené písmo aj jeho licencia sú súčasťou repozitára. Hotový web tieto vývojové závislosti nepotrebuje.

Word dokumenty sa obnovujú z rovnakých prekladov:

```sh
python -m pip install -r scripts/requirements-docx.txt
python scripts/build-docx.py
python scripts/build-i18n.py
python scripts/check-docx.py
```

## Spustenie lokálne

Na spustenie hotového webu nie je potrebná inštalácia balíkov ani zostavenie projektu. Súbory v `dist/` sú hotové statické HTML, CSS a JavaScript. Preklady sa upravujú v `i18n/` a generujú príkazom `python scripts/build-i18n.py`.

Po naklonovaní repozitára spusti v jeho koreňovom priečinku:

```sh
python -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Otvor [http://127.0.0.1:4173/](http://127.0.0.1:4173/). Na Windows môžeš namiesto `python` použiť `py`.

Web spúšťaj cez HTTP server. Odkazy a obrázky používajú absolútne cesty od koreňa webu, preto samotné otvorenie `index.html` cez `file://` nestačí.

## Štruktúra

```text
dist/                 Kompletný statický web a jeho zdrojové súbory
  assets/             Historické obrázky, favicon a optimalizované AI obrázky
  assets/gallery/     Galéria a metadáta obrázkov
  cs/, en/, de/, es/   Jazykové verzie s sedemnástimi stránkami
  locales/            Lokalizované skripty a metadáta galérie
  portfolio/          Slovenské samostatné podstránky
  kviz/
  cv/
  zdroje/
  jazyk-ada/
  fotografie/
  stroj-casu/
  dierne-stitky/
  poradna/
  noviny/
  o-stranke-ada/
  adin-algoritmus/
  ucitelsky-kutik/
  priekopnicky/
  fakty-a-myty/
  tvorba-s-ai/
  downloads/          Pracovné listy a riešenia v piatich jazykoch
assets-originals/ai/   Pôvodné AI obrázky v PNG a presné zadania generátoru
docs/                 Pôvod obrázkov a poznámky k úpravám
i18n/                 Prekladové slovníky a zdrojové šablóny
scripts/              Generovanie jazykov a kontrola odkazov/metadát
.openai/hosting.json  Existujúce nastavenie hostingu Sites
```

Zdieľané štýly sú v `dist/style.css` a `dist/pages.css`. Správanie úvodu je v `dist/app.js`, podstránok v `dist/pages.js` a fotogalérie v `dist/gallery.js`. Galéria má samostatný `dist/gallery.css`. Nové sekcie používajú `dist/experiences.css`, `dist/experiences.js` a čistý výpočtový model `dist/machine-core.mjs`. Nastavenia pred prvým vykreslením načíta `dist/reading-init.js`.

Pri úprave galérie aktualizuj zdrojovú šablónu `i18n/templates/fotografie/index.html`, údaje v `i18n/photos.sk.json` a príslušné preklady. Potom spusti generovanie jazykov. Podrobný postup je v [návode na preklady](docs/JAZYKY.md).

## Overenie

```sh
python scripts/check-links.py
python scripts/check-i18n.py
node --check dist/app.js
node --check dist/pages.js
node --check dist/gallery.js
node --check dist/experiences.js
node scripts/test-experiences.mjs
node scripts/test-theme.mjs
node scripts/test-bernoulli.mjs
```

Kontrola odkazov používa iba štandardnú knižnicu Pythonu. Node.js je potrebný len na uvedenú syntaktickú kontrolu JavaScriptu, nie na prevádzku webu. Kvíz, galéria a mobilné menu boli overené aj v prehliadači.

## Hosting

Na statickom hostingu nastav `dist` ako koreň publikovaných súborov. Existujúca konfigurácia Sites je zachovaná v `.openai/hosting.json`; jej identifikátor patrí pôvodnému webu. Bežný statický hosting tento súbor nepotrebuje.

Nahratie do tohto GitHub repozitára samo osebe neaktualizuje web v Sites a nezapína GitHub Pages. Pri hostingu pod podadresárom, napríklad pri projektovom GitHub Pages, treba najprv upraviť absolútne cesty alebo použiť vlastnú doménu s webom v koreňovom adresári.

Písma sa načítavajú z Google Fonts; pri nedostupnosti sa použijú náhradné systémové písma. Ostatné obrázky sú súčasťou repozitára.

## História, humor a obrázky

Vymyslené projekty a moderné dialógy sú súčasťou recesie. AI obrázky sú označené ako fikcia; nejde o historické fotografie ani dokumentáciu udalostí.

Historické pramene a knihy sú uvedené na stránke [Zdroje a knihy](dist/zdroje/index.html). Autorstvo a pôvod obrázkov nájdeš v [docs/OBRAZKY.md](docs/OBRAZKY.md). Presné zadania AI generátoru sú v [assets-originals/ai/prompty-a-povod.txt](assets-originals/ai/prompty-a-povod.txt).

Repozitár nepridáva samostatnú všeobecnú licenciu na celý projekt. Informácie o pôvode historických obrázkov zostávajú zachované pri jednotlivých dielach.

## Pôvodná história úprav

Archív `docs/source-history.bundle` obsahuje pôvodné Git commity zo Sites až po `6319f417327b4b7dd5f7c49f2cd05ecf0685c839`. Zachytáva stav pred neskoršími úpravami v tomto repozitári. Pôvodnú históriu môžeš obnoviť do nového priečinka:

```sh
git clone docs/source-history.bundle ada-lovelace-historia
```

## Prístupnosť

Zväčšené písmo, upravené kontrasty a ovládanie klávesnicou. Rozsah technického overenia a jeho limity sú v [kontrole prístupnosti](docs/PRISTUPNOST.md).

## Vzhľad

Na všetkých 85 stránkach môžete vybrať svetlý, tmavý alebo systémový režim. Predvolený systémový režim sleduje nastavenie prehliadača alebo počítača. Voľba sa pamätá pri prechode medzi stránkami aj jazykmi; ukladá sa iba v prehliadači. Prepínač je preložený do všetkých piatich jazykov. Podrobnosti a výsledky kontrol nájdete v [dokumentácii vzhľadu](docs/VZHLAD.md).

Jazyky sa vyberajú v rozbaľovacej ponuke s vlajkami a názvami. Ponuka vzhľadu má ikonky monitora, slnka a mesiaca. Obe podporujú klávesnicu, označujú aktuálnu voľbu fajkou a prispôsobujú sa mobilnému zobrazeniu.

Oba prepínače sú vedľa seba v kompaktnej hlavičke. Na mobile používajú skratku jazyka a krátky názov vzhľadu; otvorené ponuky aj prístupné názvy obsahujú celé označenia.
