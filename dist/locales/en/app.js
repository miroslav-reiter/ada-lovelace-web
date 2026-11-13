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
  $('#project-count').textContent = count === 6 ? "6 exhibits" : "3 exhibits";
}));

const projects = {
  bernoulli: {
    title: 'Bernoulli.exe', kind: 'fact',
    description: "In Note G from 1843, Ada described a procedure for calculating Bernoulli numbers using the Analytical Engine. It is often cited as the first published computer program. However, the machine was not completed during her lifetime. The name “Bernoulli.exe” is our joke - file extensions were certainly not on the agenda back then.",
    extra: "<div class=\"dialog-callout\">A little taste of a big idea<div class=\"number-demo\"><label for=\"bernoulli-index\">Choose a number:</label><select id=\"bernoulli-index\"><option value=\"2\">B₂</option><option value=\"4\">B₄</option><option value=\"6\">B₆</option><option value=\"8\">B₈</option><option value=\"10\">B₁₀</option><option value=\"12\">B₁₂</option></select><output id=\"bernoulli-result\" for=\"bernoulli-index\" aria-live=\"polite\">1 / 6</output></div><small>A modern demonstration of selected values. This is not a simulation of the original machine or Ada's algorithm.</small></div>",
    source: sources.history, sourceLabel: 'Computer History Museum'
  },
  notes: {
    title: "Notes A - G", kind: 'fact',
    description: "Ada translated Luigi Menabrea's article about Babbage's Analytical Engine from French. She added her own Notes A to G, explaining its capabilities. She also considered working with symbols other than numbers, such as music.",
    extra: "<div class=\"dialog-callout\">The editors' translation into modern language:<br>“I fixed the README. And, by the way, described the future of computers.”<small>An invented quip, not a quotation from Ada.</small></div>",
    source: sources.museum, sourceLabel: 'Science Museum Group'
  },
  fly: {
    title: 'Flyology', kind: 'fact',
    description: "In 1828, twelve-year-old Ada explored ideas about flight. She studied birds, wing proportions and suitable materials. She hoped to record her investigations in “Flyology”. It was a youthful research and design project, not a successfully constructed aircraft.",
    extra: "<div class=\"dialog-callout\">Project status: the idea took flight.<br>Test pilot: preferred to stay grounded.<small>A humorous editorial comment. The wings on the card are our illustration, not a historical drawing.</small></div>",
    source: sources.wiki, sourceLabel: "Wikipedia · childhood"
  },
  tea: {
    title: 'TeaScript', kind: 'fiction',
    description: "Our entirely fictional programming language for ladies, gentlemen and overheated kettles. Every program starts by heating water and ends by wondering whether milk goes in before tea. The butler handles exceptions.",
    extra: "<div class=\"dialog-callout\">SyntaxError: missing biscuit.<br>Solution: add two. Just in case.<small>None of these technologies existed historically.</small></div><button class=\"button primary dialog-action\" data-go-lab>Try TeaScript ↗</button>"
  },
  cloud: {
    title: "Steam Cloud™", kind: 'fiction',
    description: "A fictional hosting service powered by steam and unjustified confidence. Data goes in the cloud, backups in the fog and invoices under the door. Rain triggers unscheduled file downloads.",
    extra: "<div class=\"dialog-callout\">FREE plan: 5 MB of steam<br>PRO plan: your own boiler<br>ENTERPRISE: someone else shovels the coal<small>This is not a real offer. You cannot order it, even by carrier pigeon.</small></div>"
  },
  undo: {
    title: "Salon Undo", kind: 'fiction',
    description: "An imaginary device for undoing your latest social disaster. Spilled tea on a baron? Ctrl + Z. Complimented the wrong hat? Ctrl + Z. Revealed what you think of his mathematics? You will need a new salon for that.",
    extra: "<div class=\"dialog-callout\" id=\"undo-message\" role=\"status\" aria-live=\"polite\" aria-atomic=\"true\">“Your hat looks like a broken Difference Engine.”</div><button class=\"button primary dialog-action\" id=\"undo-demo\">Save the party · Ctrl + Z</button>"
  }
};

const dialog = $('#project-dialog');
$$('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  $('#dialog-title').textContent = project.title;
  $('#dialog-tag').className = 'tag ' + project.kind;
  $('#dialog-tag').textContent = project.kind === 'fact' ? "● HISTORICAL BASIS" : "✳ PURE MISCHIEF · FICTIONAL";
  $('#dialog-description').textContent = project.description;
  $('#dialog-extra').innerHTML = project.extra;
  $('#dialog-source').innerHTML = project.source ? "Historical source: <a target=\"_blank\" rel=\"noopener noreferrer\" href=\"" + project.source + '">' + project.sourceLabel + ' ↗</a>' : "An imaginary project created for this humorous website. It is not part of Ada Lovelace's actual biography.";
  dialog.showModal();
  const numberSelect = $('#bernoulli-index');
  if (numberSelect) numberSelect.addEventListener('change', () => {
    const values = {2:'1 / 6',4:'−1 / 30',6:'1 / 42',8:'−1 / 30',10:'5 / 66',12:'−691 / 2730'};
    $('#bernoulli-result').textContent = values[numberSelect.value];
  });
  const labButton = $('[data-go-lab]');
  if (labButton) labButton.addEventListener('click', () => { dialog.close(); window.location.href = '/en/#laboratorium'; });
  const undoButton = $('#undo-demo');
  if (undoButton) undoButton.addEventListener('click', () => {
    $('#undo-message').textContent = "“What a daring hat! Nobody has tried that architecture before.” ✓ Party saved.";
    $('#undo-message').setAttribute('role', 'status');
    undoButton.textContent = "Scandal successfully withdrawn ✓";
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
const teaNames = {earl:'Earl Grey',green:"Green tea",coffee:"Coffee"};
$('#tea-type').addEventListener('change', () => { $('#code-tea').textContent = "'" + teaNames[$('#tea-type').value] + "'"; });
let brewing = false;
$('#brew-button').addEventListener('click', () => {
  if (brewing) return;
  brewing = true;
  const selected = $('#tea-type').value;
  const button = $('#brew-button');
  button.disabled = true;
  $('#tea-type').disabled = true;
  button.textContent = "Steeping the algorithm…";
  $('#tea-output').textContent = "> Heating water to operating temperature.\n> Checking biscuit supplies…";
  setTimeout(() => {
    const result = {
      earl: "> Earl Grey compiled successfully.\n> Hello, world. Now for a little elegance.\n✓ 0 errors. 2 biscuits. Ready for the future.",
      green: "> Green tea compiled successfully.\n> Power-saving mode: less steam, same genius.\n✓ Carbon footprint: one cup ring.",
      coffee: "> TypeError: coffee is not tea.\n> Calling the butler… the butler has left.\n! Try tea. Or start another startup."
    };
    $('#tea-output').textContent = result[selected];
    button.innerHTML = "Run again <span>↗</span>";
    button.disabled = false;
    $('#tea-type').disabled = false;
    brewing = false;
  }, 1100);
});

}

if ($('#question-text')) {
const questions = [
  {text:"Ada wrote an algorithm for a machine that was not completed during her lifetime.",answer:true,explanation:"Exactly. Her procedure for Bernoulli numbers was intended for Babbage's Analytical Engine. Software really did get ahead of hardware.",source:sources.history},
  {text:"TeaScript was the official language of British tearooms.",answer:false,explanation:"We made TeaScript up. Tearooms had to make do with ordinary conversation and quietly judging their guests."},
  {text:"Ada's father was the poet Lord Byron.",answer:true,explanation:"Yes. Poetry stayed in the family; Ada added mathematics.",source:sources.wiki},
  {text:"As a child, she explored how flight might work.",answer:true,explanation:"Yes. Her interest in wings and flight is associated with the Flyology project. It was not a completed aircraft.",source:sources.wiki},
  {text:"She and Babbage launched steam-powered cloud storage.",answer:false,explanation:"That is our Steam Cloud. You will not find it in actual history. Not even in exceptionally damp weather."},
  {text:"Ada saw the potential for the Analytical Engine to work with music too.",answer:true,explanation:"Yes. She considered the machine's possibilities beyond arithmetic alone. She did not build a Victorian Spotify, though.",source:sources.museum}
];
let currentQuestion = 0;
let score = 0;
let answered = false;
function renderQuestion() {
  answered = false;
  $('#question-number').textContent = "QUESTION " + String(currentQuestion + 1).padStart(2, '0') + ' / 06';
  $('#quiz-score').textContent = "SCORE " + score;
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
  $('#quiz-score').textContent = "SCORE " + score;
  const prefix = correct ? "Correct. A biscuit for you!" : "History caught you out this time.";
  $('#quiz-feedback').innerHTML = '<b>' + prefix + '</b>' + question.explanation + (question.source ? ' <a target="_blank" rel="noopener noreferrer" href="' + question.source + "\">Source ↗</a>" : " (Fictional content.)");
  $('#quiz-next').hidden = false;
  $('#quiz-next').textContent = currentQuestion === questions.length - 1 ? "Show result →" : "Next question →";
}));
$('#quiz-next').addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < questions.length) { renderQuestion(); $('[data-answer]').focus({preventScroll:true}); return; }
  $('#question-number').textContent = "TEST COMPLETE";
  $('#quiz-options').hidden = true;
  $('#quiz-next').hidden = true;
  $('#question-text').textContent = score >= 5 ? "An honorary doctorate in spotting fiction." : score >= 3 ? "You are welcome in the salon." : "We recommend another cup of history.";
  $('#quiz-feedback').textContent = "Result: " + score + " out of 6. " + (score === 6 ? "Ada would probably nod approvingly. That is, of course, our guess." : "You can revisit the true stories and our inventions in the projects.");
  $('#quiz-restart').hidden = false;
  $('#quiz-restart').focus({preventScroll:true});
});
$('#quiz-restart').addEventListener('click', () => {currentQuestion = 0; score = 0; renderQuestion(); $('[data-answer]').focus({preventScroll:true});});
renderQuestion();

}

let toastTimer;
const bugReports = ["Bug logged. Gardener summoned. The IT department will be invented later.", "Priority: high. Leg count: six. Estimated fix: after tea.", "The bug claims it is a feature. The investigation continues."];
let bugIndex = 0;
$('#bug-button')?.addEventListener('click', () => {
  clearTimeout(toastTimer);
  $('#toast').textContent = bugReports[bugIndex++ % bugReports.length];
  $('#toast').classList.add('visible');
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 6000);
});
