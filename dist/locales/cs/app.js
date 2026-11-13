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
  $('#project-count').textContent = count === 6 ? "6 exponátů" : "3 exponáty";
}));

const projects = {
  bernoulli: {
    title: 'Bernoulli.exe', kind: 'fact',
    description: "V poznámce G z roku 1843 Ada popsala postup výpočtu Bernoulliho čísel pomocí analytického stroje. Často je uváděn jako první publikovaný počítačový program. Stroj však za jejího života nebyl dokončen. Název „Bernoulli.exe“ je náš vtip - přípony souborů tehdy rozhodně neřešili.",
    extra: "<div class=\"dialog-callout\">Malá ochutnávka velkého nápadu<div class=\"number-demo\"><label for=\"bernoulli-index\">Vyberte číslo:</label><select id=\"bernoulli-index\"><option value=\"2\">B₂</option><option value=\"4\">B₄</option><option value=\"6\">B₆</option><option value=\"8\">B₈</option><option value=\"10\">B₁₀</option><option value=\"12\">B₁₂</option></select><output id=\"bernoulli-result\" for=\"bernoulli-index\" aria-live=\"polite\">1 / 6</output></div><small>Moderní ukázka vybraných hodnot. Nejde o simulaci původního stroje ani Adina algoritmu.</small></div>",
    source: sources.history, sourceLabel: 'Computer History Museum'
  },
  notes: {
    title: "Poznámky A - G", kind: 'fact',
    description: "Ada přeložila z francouzštiny článek Luigiho Menabrey o Babbageově analytickém stroji. Připojila vlastní poznámky A až G, které vysvětlovaly jeho možnosti. Uvažovala také o práci s jinými symboly než čísly, například s hudbou.",
    extra: "<div class=\"dialog-callout\">Redakční překlad do dnešní řeči:<br>„Opravila jsem README. A mimochodem, popsala budoucnost počítačů.“<small>Vymyšlená hláška, ne Adin citát.</small></div>",
    source: sources.museum, sourceLabel: 'Science Museum Group'
  },
  fly: {
    title: 'Flyology', kind: 'fact',
    description: "V roce 1828 se dvanáctiletá Ada zabývala představami o létání. Zkoumala ptáky, proporce křídel a vhodné materiály. Své zkoumání chtěla zachytit ve „Flyology“. Byl to mladický výzkum a návrh, nikoli úspěšně zkonstruované letadlo.",
    extra: "<div class=\"dialog-callout\">Stav projektu: nápad vzlétl.<br>Testovací pilot: raději zůstal na zemi.<small>Humorný komentář redakce. Obrázek křídel na kartě je naše ilustrace, nikoli historický výkres.</small></div>",
    source: sources.wiki, sourceLabel: "Wikipedia · dětství"
  },
  tea: {
    title: 'TeaScript', kind: 'fiction',
    description: "Náš zcela vymyšlený programovací jazyk pro dámy, gentlemany a přehřáté konvice. Každý program začíná ohřevem vody a končí pochybností, zda se mléko přidává před čajem. Výjimky obsluhuje komorník.",
    extra: "<div class=\"dialog-callout\">SyntaxError: chybí sušenka.<br>Řešení: přidejte dvě. Pro jistotu.<small>Žádná z těchto technologií historicky neexistovala.</small></div><button class=\"button primary dialog-action\" data-go-lab>Vyzkoušet TeaScript ↗</button>"
  },
  cloud: {
    title: "Parní cloud™", kind: 'fiction',
    description: "Fiktivní hostingová služba poháněná párou a neopodstatněným sebevědomím. Data se ukládají do oblaku, zálohy do mlhy a faktury pod dveře. Za deště dochází k neplánovanému stahování souborů.",
    extra: "<div class=\"dialog-callout\">FREE plán: 5 MB páry<br>PRO plán: vlastní kotel<br>ENTERPRISE: někdo jiný přikládá<small>Toto není skutečná nabídka. Nedá se objednat ani poštovním holubem.</small></div>"
  },
  undo: {
    title: "Salonní Undo", kind: 'fiction',
    description: "Vymyšlené zařízení na vrácení poslední společenské katastrofy. Rozlili jste čaj na barona? Ctrl + Z. Pochválili jste nesprávný klobouk? Ctrl + Z. Prozradili jste, co si myslíte o jeho matematice? Tam už je potřeba nový salon.",
    extra: "<div class=\"dialog-callout\" id=\"undo-message\" role=\"status\" aria-live=\"polite\" aria-atomic=\"true\">„Váš klobouk vypadá jako porouchaný diferenční stroj.“</div><button class=\"button primary dialog-action\" id=\"undo-demo\">Zachránit večírek · Ctrl + Z</button>"
  }
};

const dialog = $('#project-dialog');
$$('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  $('#dialog-title').textContent = project.title;
  $('#dialog-tag').className = 'tag ' + project.kind;
  $('#dialog-tag').textContent = project.kind === 'fact' ? "● HISTORICKÝ ZÁKLAD" : "✳ ČISTÁ RECESE · VYMYŠLENO";
  $('#dialog-description').textContent = project.description;
  $('#dialog-extra').innerHTML = project.extra;
  $('#dialog-source').innerHTML = project.source ? "Historický zdroj: <a target=\"_blank\" rel=\"noopener noreferrer\" href=\"" + project.source + '">' + project.sourceLabel + ' ↗</a>' : "Vymyšlený projekt vytvořený pro tento humorný web. Není součástí skutečného životopisu Ady Lovelace.";
  dialog.showModal();
  const numberSelect = $('#bernoulli-index');
  if (numberSelect) numberSelect.addEventListener('change', () => {
    const values = {2:'1 / 6',4:'−1 / 30',6:'1 / 42',8:'−1 / 30',10:'5 / 66',12:'−691 / 2730'};
    $('#bernoulli-result').textContent = values[numberSelect.value];
  });
  const labButton = $('[data-go-lab]');
  if (labButton) labButton.addEventListener('click', () => { dialog.close(); window.location.href = '/cs/#laboratorium'; });
  const undoButton = $('#undo-demo');
  if (undoButton) undoButton.addEventListener('click', () => {
    $('#undo-message').textContent = "„Jak odvážný klobouk! Takovou architekturu ještě nikdo nezkusil.“ ✓ Večírek zachráněn.";
    $('#undo-message').setAttribute('role', 'status');
    undoButton.textContent = "Skandál úspěšně odvolán ✓";
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
const teaNames = {earl:'Earl Grey',green:"Zelený čaj",coffee:"Káva"};
$('#tea-type').addEventListener('change', () => { $('#code-tea').textContent = "'" + teaNames[$('#tea-type').value] + "'"; });
let brewing = false;
$('#brew-button').addEventListener('click', () => {
  if (brewing) return;
  brewing = true;
  const selected = $('#tea-type').value;
  const button = $('#brew-button');
  button.disabled = true;
  $('#tea-type').disabled = true;
  button.textContent = "Louhuji algoritmus…";
  $('#tea-output').textContent = "> Zahřívám vodu na provozní teplotu.\n> Kontroluji zásoby sušenek…";
  setTimeout(() => {
    const result = {
      earl: "> Earl Grey úspěšně zkompilován.\n> Hello, world. A teď trochu noblesy.\n✓ 0 chyb. 2 sušenky. Budoucnost připravena.",
      green: "> Zelený čaj úspěšně zkompilován.\n> Úsporný režim: méně páry, stejný génius.\n✓ Uhlíková stopa: jedna stopa po šálku.",
      coffee: "> TypeError: káva není čaj.\n> Volám komorníka… komorník odešel.\n! Zkuste čaj. Nebo založte jiný startup."
    };
    $('#tea-output').textContent = result[selected];
    button.innerHTML = "Spustit znovu <span>↗</span>";
    button.disabled = false;
    $('#tea-type').disabled = false;
    brewing = false;
  }, 1100);
});

}

if ($('#question-text')) {
const questions = [
  {text:"Ada napsala algoritmus pro stroj, který za jejího života nebyl dokončen.",answer:true,explanation:"Přesně tak. Její postup pro Bernoulliho čísla byl určen pro Babbageův analytický stroj. Software opravdu předběhl hardware.",source:sources.history},
  {text:"TeaScript byl oficiálním jazykem britských čajoven.",answer:false,explanation:"TeaScript jsme si vymysleli. Čajovny si musely vystačit s běžnou konverzací a tichým posuzováním hostů."},
  {text:"Adin otec byl básník Lord Byron.",answer:true,explanation:"Ano. Poezie zůstala v rodině, Ada k ní přidala matematiku.",source:sources.wiki},
  {text:"V dětství zkoumala, jak by se dalo létat.",answer:true,explanation:"Ano. Její zájem o křídla a létání se pojí s projektem Flyology. Nebylo to hotové letadlo.",source:sources.wiki},
  {text:"S Babbagem spustili cloudové úložiště poháněné párou.",answer:false,explanation:"To je náš Parní cloud. Ve skutečných dějinách ho nenajdete. Ani za mimořádně vlhkého počasí."},
  {text:"Ada viděla v analytickém stroji potenciál pracovat i s hudbou.",answer:true,explanation:"Ano. Uvažovala o možnostech stroje za hranicemi samotné aritmetiky. Žádné viktoriánské Spotify však nepostavila.",source:sources.museum}
];
let currentQuestion = 0;
let score = 0;
let answered = false;
function renderQuestion() {
  answered = false;
  $('#question-number').textContent = "OTÁZKA " + String(currentQuestion + 1).padStart(2, '0') + ' / 06';
  $('#quiz-score').textContent = "SKÓRE " + score;
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
  $('#quiz-score').textContent = "SKÓRE " + score;
  const prefix = correct ? "Správně. Sušenka pro vás!" : "Tentokrát vás historie nachytala.";
  $('#quiz-feedback').innerHTML = '<b>' + prefix + '</b>' + question.explanation + (question.source ? ' <a target="_blank" rel="noopener noreferrer" href="' + question.source + "\">Zdroj ↗</a>" : " (Vymyšlený obsah.)");
  $('#quiz-next').hidden = false;
  $('#quiz-next').textContent = currentQuestion === questions.length - 1 ? "Ukázat výsledek →" : "Další otázka →";
}));
$('#quiz-next').addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < questions.length) { renderQuestion(); $('[data-answer]').focus({preventScroll:true}); return; }
  $('#question-number').textContent = "ZKOUŠKA UKONČENA";
  $('#quiz-options').hidden = true;
  $('#quiz-next').hidden = true;
  $('#question-text').textContent = score >= 5 ? "Čestný doktorát z rozpoznávání recese." : score >= 3 ? "Do salonu máte vstup povolen." : "Doporučujeme ještě jeden šálek historie.";
  $('#quiz-feedback').textContent = "Výsledek: " + score + " ze 6. " + (score === 6 ? "Ada by pravděpodobně uznale přikývla. To je samozřejmě náš odhad." : "Pravé příběhy i naše výmysly si můžete znovu prohlédnout v projektech.");
  $('#quiz-restart').hidden = false;
  $('#quiz-restart').focus({preventScroll:true});
});
$('#quiz-restart').addEventListener('click', () => {currentQuestion = 0; score = 0; renderQuestion(); $('[data-answer]').focus({preventScroll:true});});
renderQuestion();

}

let toastTimer;
const bugReports = ["Brouk zaevidován. Zahradník přivolán. IT oddělení vznikne později.", "Priorita: vysoká. Počet nohou: šest. Odhad opravy: po čaji.", "Brouk tvrdí, že je to funkce. Vyšetřování pokračuje."];
let bugIndex = 0;
$('#bug-button')?.addEventListener('click', () => {
  clearTimeout(toastTimer);
  $('#toast').textContent = bugReports[bugIndex++ % bugReports.length];
  $('#toast').classList.add('visible');
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 6000);
});
