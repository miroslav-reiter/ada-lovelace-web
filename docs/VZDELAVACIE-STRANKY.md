# Vzdelávacie podstránky

Päť sekcií je dostupných v slovenčine, češtine, angličtine, nemčine a španielčine. Spoločný generátor `scripts/learning_pages.py` používa úplné katalógy `i18n/learning.*.json`. Navigácia Objavovať a karty na úvodnej stránke vedú na lokálnu jazykovú verziu. Prepínač jazyka zachováva typ podstránky.

- Adin algoritmus: moderná vzdelávacia rekurencia s presnými zlomkami, hodnotami B2, B4, B6 a B8, predchádzajúcim a ďalším krokom a resetom. Nejde o vernú emuláciu kariet poznámky G. Historické B7 je moderné B8. Použitá konvencia B1 = -1/2.
- Učiteľský kútik: plán na 45 minút, štyri úlohy, diferenciácia a desať materiálov (päť pracovných listov a päť riešení), každý priamo vo formáte PDF, Word (DOCX) aj HTML. Spolu ide o 30 súborov na stiahnutie. Súbory nemajú externé závislosti a fungujú offline.
- Priekopníčky: Grace Hopper, Margaret Hamilton, Jean Bartik a Frances Allen s odkazmi na múzejné alebo inštitucionálne zdroje. Súvislosti s Adou sú tematické paralely, nie tvrdenia o dokázanom osobnom vplyve.
- Fakty a mýty: päť rozbaliteľných tvrdení, vysvetlenia, zdroje, autentický citát a samostatne označená fiktívna replika.
- Zákulisie: skutočné úryvky zo zadaní autora, vysvetlené výsledky, skutočné snímky pred doplnením autorovej fotografie a po ňom. Snímky majú slovenský text, preložené popisy a alt text. Nejde o vymyslenú históriu tvorby.

## Zdroje a pôvod

- Ada, poznámky A a G (1843): https://psychclassics.yorku.ca/Lovelace/lovelace.htm
- Bernoulliho generujúca funkcia: https://dlmf.nist.gov/24.2#E1
- Ada a historický kontext: https://www.computerhistory.org/babbage/adalovelace/
- Grace Hopper, rozhovor (1980): https://archive.computerhistory.org/resources/text/Oral_History/Hopper_Grace/102702026.05.01.pdf
- Margaret Hamilton: https://www.nasa.gov/wp-content/uploads/static/history/alsj/a11/a11Hamilton.html
- Jean Bartik: https://computerhistory.org/profile/jean-jennings-bartik/
- Frances Allen: https://www.ibm.com/history/frances-allen
- Snímky `dist/assets/making/about-before.jpg` a `about-after.jpg`: vlastné snímky skutočného webu z predchádzajúcich úprav (pred fotografiou a po fotografii). Zachytávajú staršiu hlavičku, nie novú navigáciu Objavovať.

## Kontroly

Spustenie: `python scripts/build-i18n.py`, `python scripts/check-i18n.py`, `python scripts/check-links.py`, `node scripts/test-bernoulli.mjs`. Celý web má 85 jazykových stránok a 10 samostatných materiálov, každý v PDF, DOCX aj HTML. Existujúce kontroly vzhľadu a interaktívnych sekcií sa zachovávajú. Interaktívna vizualizácia oznamuje kroky cez živú oblasť, neprehráva sa automaticky a má statický príklad dostupný bez JavaScriptu.

Overené v prehliadači: všetkých 25 nových jazykových stránok vo svetlom režime (axe-core 4.14.0, bez nálezov a nedokončených kontrol), päť slovenských typov stránok v tmavom režime pri šírke 320 px (bez nálezov), jazykové prepínanie a výsledok B2 vo všetkých jazykoch, postup B8, návrat a reset, ovládanie menu šípkami a Escape, text na 200 % a otvorenie samostatného pracovného listu. Automatický audit nie je úplnou certifikáciou WCAG.

## Priame PDF na stiahnutie

Každý z desiatich PDF súborov má dve strany A4, základný text 12 bodov, vložené písmo DejaVu Sans, označenie jazyka, názov a autora v metadátach. Text možno vyberať a vyhľadávať. Pracovné listy majú priestor na ručné odpovede; riešenia obsahujú odpovede, ciele a diferenciáciu. Súbory nie sú interaktívnymi formulármi ani certifikovanými PDF/UA. Samostatné HTML verzie zostávajú dostupné aj pre asistenčné technológie.

PDF vznikajú z rovnakých katalógov `i18n/learning.*.json` ako web. Po zmene ich obsahu spusti:

```sh
python -m pip install -r scripts/requirements-pdf.txt
python scripts/build-pdfs.py
python scripts/build-i18n.py
python scripts/check-pdfs.py
python scripts/check-i18n.py
python scripts/check-links.py
```

Závislosti sú potrebné iba na generovanie a kontrolu PDF. Hotové súbory sú uložené v `dist/downloads/`; ich kontrolné súčty a veľkosti sú v `pdf-manifest.json`. Licencia a pôvod písma sú v `assets-originals/fonts/`.

Overené 17. novembra 2026: úplnosť úloh a riešení, diakritika, vložené písmo, jazyk, metadáta a odkazy všetkých desiatich PDF. Vizuálne bolo skontrolovaných všetkých 20 strán. Päť jazykových verzií učiteľského kútika prešlo kontrolou pri šírke 320 px bez vodorovného pretekania a bez nálezov axe-core.

## Upraviteľné Word dokumenty

Desať súborov DOCX obsahuje rovnaké úlohy a riešenia v piatich jazykoch. Majú formát A4, základné písmo Arial 12 bodov, štýly Title a Heading 1, označenie jazyka na kontrolu pravopisu a bežné upraviteľné odseky. Neobsahujú makrá ani ochranu proti úpravám. Prázdne odseky s riadkami možno doplniť odpoveďami alebo zmeniť ich počet. Päta používa automatické číslo strany.

```sh
python -m pip install -r scripts/requirements-docx.txt
python scripts/build-docx.py
python scripts/build-i18n.py
python scripts/check-docx.py
python scripts/check-i18n.py
python scripts/check-links.py
```

Generátor `scripts/build-docx.py` číta rovnaké katalógy ako PDF. Výsledky a kontrolné súčty sú v `dist/downloads/docx-manifest.json`. Pri zmene zadaní treba obnoviť oba formáty. Kontrola overuje úplnosť obsahu, jazyk, odkazy, integritu dokumentov a skutočnú úpravu textu, uloženie a opätovné otvorenie pomocou knižnice python-docx. Rozloženie sa môže po úpravách učiteľa alebo pri použití náhradného písma zmeniť.

Overené 17. novembra 2026: všetkých desať DOCX bolo vykreslených cez LibreOffice 26.8.3 a vizuálne skontrolovaných všetkých 20 strán. Každý dokument má v overenom vykreslení dve strany. Webové odkazy vo všetkých piatich jazykoch prešli kontrolou axe-core pri šírke 320 px bez nálezov, nedokončených kontrol a vodorovného pretekania. Celý web prešiel kontrolou 4315 lokálnych odkazov a súborov.
