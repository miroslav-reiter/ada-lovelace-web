# Kontrola prístupnosti

Dátum: 11. november 2026. Rozsah: sedem strán webu Ada Lovelace, lokálna verzia určená na publikovanie v Sites. Ide o technickú kontrolu a opravy, nie o vyhlásenie úplnej zhody s WCAG ani právnu certifikáciu.

## Zistenia a opravy

Pôvodné štýly používali pri popiskoch aj 6 až 10 px a pri viacerých odsekoch 12 až 14 px. Hlavný obsah má teraz štandardne 18 px, ovládacie prvky 16 px a pomocné popisky najmenej 14 px pri predvolenom nastavení prehliadača. Veľkosti obrazovkového textu sú v jednotkách rem a rešpektujú nastavenie základného písma. WCAG neurčuje univerzálnu minimálnu veľkosť písma v pixeloch; zvolené hodnoty sú rozhodnutie pre pohodlnejšie čítanie.

| Farebná dvojica | Pôvodne | Po oprave |
| --- | --- | --- |
| Zvýraznený text na papierovom pozadí | 2,86 : 1 | 5,28 : 1 |
| Tlmený text na papierovom pozadí | 4,41 : 1 | 5,62 : 1 |
| Text tlačidla kanvice na zelenom pozadí | 1,11 : 1 | 11,14 : 1 |
| Tmavý text na koralovom pozadí pásu a pečiatky | 4,34 : 1 | 5,59 : 1 |

Bežný tmavý text na papierovom pozadí dosahuje 12,44 : 1. Hodnoty sú vypočítané pre definované nepriehľadné farby CSS, nie pre každý pixel obrázkov. Bola odstránená textúra nad textom a upravené aj popisky v CV.

Opravené boli prístupné názvy projektových tlačidiel a galérie, použitie ARIA na pomenovaných skupinách, návrat a udržanie fokusu v dialógoch, viditeľný indikátor fokusu, oznámenia zmien CV a kvízu, ovládanie posúvateľných ukážok kódu a preskočenie navigácie. Kvíz po odpovedi ponechá fokus na zvolenej možnosti, oznámi spätnú väzbu a pri ďalšej otázke presunie fokus na nadpis. Význam odpovede je vyjadrený aj textom, nielen farbou. Blikajúce kurzory boli zastavené a zostáva podpora obmedzeného pohybu.

## Overenie

Použitý bol axe-core 4.14.0 s pravidlami WCAG 2 A/AA, WCAG 2.1 A/AA, WCAG 2.2 AA a odporúčanými kontrolami. Prehliadač: Opera na Windows.

- Všetkých sedem strán pri šírke 1280 CSS px: 0 automaticky zistených porušení.
- Všetkých sedem strán pri šírke 320 CSS px: 0 automaticky zistených porušení a bez horizontálneho presahu stránky.
- Všetkých sedem strán so základným písmom nastaveným na 200 % pri šírke 1280 CSS px: 0 automaticky zistených porušení a bez horizontálneho presahu stránky. Ide o test zväčšenia textu cez CSS, nie o samostatný test každej implementácie zoomu prehliadača.
- Všetkých sedem strán so zväčšenými rozostupmi: riadkovanie 1,5, medzery medzi odsekmi 2 em, medzi písmenami 0,12 em a medzi slovami 0,16 em. Bez horizontálneho presahu a automaticky zistených porušení.
- Otvorený projektový dialóg, otvorená galéria a spätná väzba kvízu: 0 automaticky zistených porušení.
- Klávesnicou overené: preskočenie na obsah, otvorenie a zatvorenie menu, Escape a návrat fokusu, pohyb po dialógu klávesom Tab, šípky v galérii, všetkých 12 otázok, správna aj nesprávna odpoveď, výsledok 11/12 a reštart kvízu.

Automatický nástroj ponechal položky na manuálne posúdenie pri dekoratívnych symboloch, obrázkoch, prekrývaných prvkoch a pozadiach s prechodmi. Nulový počet automatických porušení nie je dôkaz úplného súladu. Nebol vykonaný úplný audit s NVDA, JAWS alebo VoiceOver, test na fyzickom mobilnom zariadení, úplné posúdenie významu alternatívnych textov ani kontrola tlačového PDF. Prihlasovanie a rozhranie hostingu Sites, externé weby a externé PDF nie sú súčasťou tejto kontroly.

Na úplné vyhlásenie o zhode zostáva manuálne posúdenie všetkých uplatniteľných kritérií vrátane asistenčných technológií a doloženie výsledkov. Tento dokument nenahrádza zákonné vyhlásenie o prístupnosti prevádzkovateľa.

## Technické a právne podklady

WCAG AA vyžaduje pri bežnom texte kontrast najmenej 4,5 : 1, pri veľkom texte 3 : 1. Zväčšenie na 200 % nesmie viesť k strate obsahu alebo funkčnosti. ARIA opisuje význam a stav rozhrania pre asistenčné technológie; sama nepridáva klávesnicové správanie ani nezaručuje prístupnosť.

- [W3C: kontrast textu](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C: zväčšenie textu](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
- [W3C: prispôsobenie obsahu šírke](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [W3C: rozostupy textu](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
- [W3C: zásady používania ARIA](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)

Pre informačné technológie verejnej správy je relevantná vyhláška č. 78/2020 Z. z.; jej § 14 odkazuje na STN EN 301 549 a najmä WCAG 2.1 úrovní A a AA. Pri službách poskytovaných spotrebiteľom treba samostatne posúdiť pôsobnosť zákona č. 351/2022 Z. z. Konkrétna zákonná povinnosť závisí od prevádzkovateľa a účelu webu; z tohto technického auditu ju nemožno automaticky vyvodiť.

- [Vyhláška 78/2020 Z. z., znenie účinné od 15. 5. 2026](https://static.slov-lex.sk/static/SK/ZZ/2020/78/20260515.html)
- [Zákon 351/2022 Z. z., znenie účinné od 30. 5. 2026](https://static.slov-lex.sk/static/SK/ZZ/2022/351/20260530.html)
