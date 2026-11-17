# Vzdelávacie podstránky

Päť sekcií je dostupných v slovenčine, češtine, angličtine, nemčine a španielčine. Spoločný generátor `scripts/learning_pages.py` používa úplné katalógy `i18n/learning.*.json`. Navigácia Objavovať a karty na úvodnej stránke vedú na lokálnu jazykovú verziu. Prepínač jazyka zachováva typ podstránky.

- Adin algoritmus: moderná vzdelávacia rekurencia s presnými zlomkami, hodnotami B2, B4, B6 a B8, predchádzajúcim a ďalším krokom a resetom. Nejde o vernú emuláciu kariet poznámky G. Historické B7 je moderné B8. Použitá konvencia B1 = -1/2.
- Učiteľský kútik: plán na 45 minút, štyri úlohy, diferenciácia a desať samostatných súborov HTML na stiahnutie (päť pracovných listov a päť riešení). Súbory nemajú externé závislosti, fungujú offline, umožňujú tlač alebo uloženie PDF cez prehliadač.
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

Spustenie: `python scripts/build-i18n.py`, `python scripts/check-i18n.py`, `python scripts/check-links.py`, `node scripts/test-bernoulli.mjs`. Celý web má 85 jazykových stránok a 10 samostatných materiálov na stiahnutie. Existujúce kontroly vzhľadu a interaktívnych sekcií sa zachovávajú. Interaktívna vizualizácia oznamuje kroky cez živú oblasť, neprehráva sa automaticky a má statický príklad dostupný bez JavaScriptu.

Overené v prehliadači: všetkých 25 nových jazykových stránok vo svetlom režime (axe-core 4.14.0, bez nálezov a nedokončených kontrol), päť slovenských typov stránok v tmavom režime pri šírke 320 px (bez nálezov), jazykové prepínanie a výsledok B2 vo všetkých jazykoch, postup B8, návrat a reset, ovládanie menu šípkami a Escape, text na 200 % a otvorenie samostatného pracovného listu. Automatický audit nie je úplnou certifikáciou WCAG.
