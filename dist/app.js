'use strict';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const sources = {
  wiki: 'https://en.wikipedia.org/wiki/Ada_Lovelace',
  museum: 'https://collection.sciencemuseumgroup.org.uk/people/cp38764/ada-lovelace',
  history: 'https://www.computerhistory.org/babbage/adalovelace/'
};

$$('.filter').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  $$('.filter').forEach(item => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  let count = 0;
  $$('.project-card').forEach(card => {
    card.hidden = filter !== 'all' && card.dataset.kind !== filter;
    if (!card.hidden) count++;
  });
  $('#project-count').textContent = count === 6 ? '6 exponátov' : '3 exponáty';
}));

const projects = {
  bernoulli: {
    title: 'Bernoulli.exe', kind: 'fact',
    description: 'V poznámke G z roku 1843 Ada opísala postup na výpočet Bernoulliho čísel pomocou analytického stroja. Často sa uvádza ako prvý publikovaný počítačový program. Stroj však za jej života nebol dokončený. Názov „Bernoulli.exe“ je náš vtip — prípony súborov vtedy rozhodne neriešili.',
    extra: '<div class="dialog-callout">Malá ochutnávka veľkého nápadu<div class="number-demo"><label for="bernoulli-index">Vyberte číslo:</label><select id="bernoulli-index"><option value="2">B₂</option><option value="4">B₄</option><option value="6">B₆</option><option value="8">B₈</option><option value="10">B₁₀</option><option value="12">B₁₂</option></select><output id="bernoulli-result" for="bernoulli-index" aria-live="polite">1 / 6</output></div><small>Moderná ukážka vybraných hodnôt. Nejde o simuláciu pôvodného stroja ani Adinho algoritmu.</small></div>',
    source: sources.history, sourceLabel: 'Computer History Museum'
  },
  notes: {
    title: 'Poznámky A — G', kind: 'fact',
    description: 'Ada preložila z francúzštiny článok Luigiho Menabreu o Babbageovom analytickom stroji. Pripojila vlastné poznámky A až G, ktoré vysvetľovali jeho možnosti. Uvažovala aj o práci s inými symbolmi než číslami, napríklad s hudbou.',
    extra: '<div class="dialog-callout">Redakčný preklad do dnešnej reči:<br>„Opravila som README. A mimochodom, opísala budúcnosť počítačov.“<small>Vymyslená hláška, nie Adin citát.</small></div>',
    source: sources.museum, sourceLabel: 'Science Museum Group'
  },
  fly: {
    title: 'Flyology', kind: 'fact',
    description: 'V roku 1828 sa dvanásťročná Ada venovala predstavám o lietaní. Skúmala vtáky, proporcie krídel a vhodné materiály. Svoje skúmanie chcela zachytiť vo „Flyology“. Bol to mladícky výskum a návrh, nie úspešne skonštruované lietadlo.',
    extra: '<div class="dialog-callout">Stav projektu: nápad vzlietol.<br>Testovací pilot: radšej zostal na zemi.<small>Humorný komentár redakcie. Obrázok krídel na karte je naša ilustrácia, nie historický výkres.</small></div>',
    source: sources.wiki, sourceLabel: 'Wikipedia · detstvo'
  },
  tea: {
    title: 'TeaScript', kind: 'fiction',
    description: 'Náš úplne vymyslený programovací jazyk pre dámy, džentlmenov a prehriate kanvice. Každý program sa začína ohrevom vody a končí pochybnosťou, či sa mlieko pridáva pred čajom. Výnimky obsluhuje komorník.',
    extra: '<div class="dialog-callout">SyntaxError: chýba sušienka.<br>Riešenie: pridajte dve. Pre istotu.<small>Žiadna z týchto technológií historicky neexistovala.</small></div><button class="button primary dialog-action" data-go-lab>Vyskúšať TeaScript ↗</button>'
  },
  cloud: {
    title: 'Parný cloud™', kind: 'fiction',
    description: 'Fiktívna hostingová služba poháňaná parou a neopodstatneným sebavedomím. Dáta sa ukladajú do oblaku, zálohy do hmly a faktúry pod dvere. Pri daždi dochádza k neplánovanému sťahovaniu súborov.',
    extra: '<div class="dialog-callout">FREE plán: 5 MB pary<br>PRO plán: vlastný kotol<br>ENTERPRISE: niekto iný prikladá<small>Toto nie je skutočná ponuka. Nedá sa objednať ani poštovým holubom.</small></div>'
  },
  undo: {
    title: 'Salónový Undo', kind: 'fiction',
    description: 'Vymyslené zariadenie na vrátenie poslednej spoločenskej katastrofy. Rozliali ste čaj na baróna? Ctrl + Z. Pochválili ste nesprávny klobúk? Ctrl + Z. Prezradili ste, čo si myslíte o jeho matematike? Tam už treba nový salón.',
    extra: '<div class="dialog-callout" id="undo-message">„Váš klobúk vyzerá ako pokazený diferenciálny stroj.“</div><button class="button primary dialog-action" id="undo-demo">Zachrániť večierok · Ctrl + Z</button>'
  }
};

const dialog = $('#project-dialog');
$$('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  $('#dialog-title').textContent = project.title;
  $('#dialog-tag').className = 'tag ' + project.kind;
  $('#dialog-tag').textContent = project.kind === 'fact' ? '● HISTORICKÝ ZÁKLAD' : '✳ ČISTÁ RECESIA · VYMYSLENÉ';
  $('#dialog-description').textContent = project.description;
  $('#dialog-extra').innerHTML = project.extra;
  $('#dialog-source').innerHTML = project.source ? 'Historický zdroj: <a target="_blank" rel="noopener noreferrer" href="' + project.source + '">' + project.sourceLabel + ' ↗</a>' : 'Vymyslený projekt vytvorený pre tento humorný web. Nie je súčasťou skutočného životopisu Ady Lovelace.';
  dialog.showModal();
  const numberSelect = $('#bernoulli-index');
  if (numberSelect) numberSelect.addEventListener('change', () => {
    const values = {2:'1 / 6',4:'−1 / 30',6:'1 / 42',8:'−1 / 30',10:'5 / 66',12:'−691 / 2730'};
    $('#bernoulli-result').textContent = values[numberSelect.value];
  });
  const labButton = $('[data-go-lab]');
  if (labButton) labButton.addEventListener('click', () => { dialog.close(); window.location.href = '/#laboratorium'; });
  const undoButton = $('#undo-demo');
  if (undoButton) undoButton.addEventListener('click', () => {
    $('#undo-message').textContent = '„Aký odvážny klobúk! Takúto architektúru ešte nikto neskúsil.“ ✓ Večierok zachránený.';
    $('#undo-message').setAttribute('role', 'status');
    undoButton.textContent = 'Škandál úspešne odvolaný ✓';
    undoButton.disabled = true;
  });
}));
$('.dialog-close')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});

if ($('#tea-type')) {
const teaNames = {earl:'Earl Grey',green:'Zelený čaj',coffee:'Káva'};
$('#tea-type').addEventListener('change', () => { $('#code-tea').textContent = "'" + teaNames[$('#tea-type').value] + "'"; });
let brewing = false;
$('#brew-button').addEventListener('click', () => {
  if (brewing) return;
  brewing = true;
  const selected = $('#tea-type').value;
  const button = $('#brew-button');
  button.disabled = true;
  $('#tea-type').disabled = true;
  button.textContent = 'Lúhujem algoritmus…';
  $('#tea-output').textContent = '> Zahrievam vodu na prevádzkovú teplotu.\n> Kontrolujem zásoby sušienok…';
  setTimeout(() => {
    const result = {
      earl: '> Earl Grey úspešne skompilovaný.\n> Hello, world. A teraz trochu noblesy.\n✓ 0 chýb. 2 sušienky. Budúcnosť pripravená.',
      green: '> Zelený čaj úspešne skompilovaný.\n> Úsporný režim: menej pary, rovnaký génius.\n✓ Uhlíková stopa: jedna stopa od šálky.',
      coffee: '> TypeError: káva nie je čaj.\n> Volám komorníka… komorník odišiel.\n! Skúste čaj. Alebo založte iný startup.'
    };
    $('#tea-output').textContent = result[selected];
    button.innerHTML = 'Spustiť znova <span>↗</span>';
    button.disabled = false;
    $('#tea-type').disabled = false;
    brewing = false;
  }, 1100);
});

}

if ($('#question-text')) {
const questions = [
  {text:'Ada napísala algoritmus pre stroj, ktorý za jej života nebol dokončený.',answer:true,explanation:'Presne tak. Jej postup pre Bernoulliho čísla bol určený pre Babbageov analytický stroj. Softvér naozaj predbehol hardvér.',source:sources.history},
  {text:'TeaScript bol oficiálnym jazykom britských čajovní.',answer:false,explanation:'TeaScript sme si vymysleli. Čajovne si museli vystačiť s bežnou konverzáciou a tichým súdením hostí.'},
  {text:'Adin otec bol básnik Lord Byron.',answer:true,explanation:'Áno. Poézia zostala v rodine, Ada k nej pridala matematiku.',source:sources.wiki},
  {text:'Ako dieťa skúmala, ako by sa dalo lietať.',answer:true,explanation:'Áno. Jej záujem o krídla a lietanie sa spája s projektom Flyology. Nebolo to hotové lietadlo.',source:sources.wiki},
  {text:'S Babbageom spustili cloudové úložisko poháňané parou.',answer:false,explanation:'To je náš Parný cloud. V skutočných dejinách ho nenájdete. Ani za mimoriadne vlhkého počasia.'},
  {text:'Ada videla v analytickom stroji potenciál pracovať aj s hudbou.',answer:true,explanation:'Áno. Uvažovala o možnostiach stroja za hranicami samotnej aritmetiky. Žiadny viktoriánsky Spotify však nepostavila.',source:sources.museum}
];
let currentQuestion = 0;
let score = 0;
let answered = false;
function renderQuestion() {
  answered = false;
  $('#question-number').textContent = 'OTÁZKA ' + String(currentQuestion + 1).padStart(2, '0') + ' / 06';
  $('#quiz-score').textContent = 'SKÓRE ' + score;
  $('#quiz-progress-bar').style.width = ((currentQuestion + 1) / questions.length * 100) + '%';
  $('#question-text').textContent = questions[currentQuestion].text;
  $('#quiz-feedback').textContent = '';
  $('#quiz-options').hidden = false;
  $('#quiz-next').hidden = true;
  $('#quiz-restart').hidden = true;
  $$('[data-answer]').forEach(button => {button.disabled = false; button.classList.remove('selected');});
}
$$('[data-answer]').forEach(button => button.addEventListener('click', () => {
  if (answered) return;
  answered = true;
  const question = questions[currentQuestion];
  const correct = (button.dataset.answer === 'true') === question.answer;
  if (correct) score++;
  button.classList.add('selected');
  $$('[data-answer]').forEach(item => {item.disabled = true;});
  $('#quiz-score').textContent = 'SKÓRE ' + score;
  const prefix = correct ? 'Správne. Sušienka pre vás!' : 'Tentoraz vás história nachytala.';
  $('#quiz-feedback').innerHTML = '<b>' + prefix + '</b>' + question.explanation + (question.source ? ' <a target="_blank" rel="noopener noreferrer" href="' + question.source + '">Zdroj ↗</a>' : ' (Vymyslený obsah.)');
  $('#quiz-next').hidden = false;
  $('#quiz-next').textContent = currentQuestion === questions.length - 1 ? 'Ukázať výsledok →' : 'Ďalšia otázka →';
}));
$('#quiz-next').addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < questions.length) { renderQuestion(); $('[data-answer]').focus({preventScroll:true}); return; }
  $('#question-number').textContent = 'SKÚŠKA UKONČENÁ';
  $('#quiz-options').hidden = true;
  $('#quiz-next').hidden = true;
  $('#question-text').textContent = score >= 5 ? 'Čestný doktorát z rozpoznávania recesie.' : score >= 3 ? 'Do salónu máte vstup povolený.' : 'Odporúčame ešte jednu šálku histórie.';
  $('#quiz-feedback').textContent = 'Výsledok: ' + score + ' zo 6. ' + (score === 6 ? 'Ada by pravdepodobne uznanlivo prikývla. To je, samozrejme, náš odhad.' : 'Pravé príbehy aj naše výmysly si môžete znovu pozrieť v projektoch.');
  $('#quiz-restart').hidden = false;
  $('#quiz-restart').focus({preventScroll:true});
});
$('#quiz-restart').addEventListener('click', () => {currentQuestion = 0; score = 0; renderQuestion(); $('[data-answer]').focus({preventScroll:true});});
renderQuestion();

}

let toastTimer;
const bugReports = ['Chrobák zaevidovaný. Záhradník bol privolaný. IT oddelenie vznikne neskôr.', 'Priorita: vysoká. Počet nôh: šesť. Odhad opravy: po čaji.', 'Chrobák tvrdí, že je to funkcia. Vyšetrovanie pokračuje.'];
let bugIndex = 0;
$('#bug-button')?.addEventListener('click', () => {
  clearTimeout(toastTimer);
  $('#toast').textContent = bugReports[bugIndex++ % bugReports.length];
  $('#toast').classList.add('visible');
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 6000);
});
