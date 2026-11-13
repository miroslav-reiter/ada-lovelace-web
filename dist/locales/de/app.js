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
  $('#project-count').textContent = count === 6 ? "6 Exponate" : "3 Exponate";
}));

const projects = {
  bernoulli: {
    title: 'Bernoulli.exe', kind: 'fact',
    description: "In Anmerkung G von 1843 beschrieb Ada ein Verfahren zur Berechnung der Bernoulli-Zahlen mit der Analytical Engine. Es wird häufig als erstes veröffentlichtes Computerprogramm bezeichnet. Die Maschine wurde zu ihren Lebzeiten jedoch nicht fertiggestellt. Der Name „Bernoulli.exe“ ist unser Witz - Dateiendungen waren damals garantiert kein Thema.",
    extra: "<div class=\"dialog-callout\">Ein kleiner Vorgeschmack auf eine große Idee<div class=\"number-demo\"><label for=\"bernoulli-index\">Wählen Sie eine Zahl:</label><select id=\"bernoulli-index\"><option value=\"2\">B₂</option><option value=\"4\">B₄</option><option value=\"6\">B₆</option><option value=\"8\">B₈</option><option value=\"10\">B₁₀</option><option value=\"12\">B₁₂</option></select><output id=\"bernoulli-result\" for=\"bernoulli-index\" aria-live=\"polite\">1 / 6</output></div><small>Eine moderne Darstellung ausgewählter Werte. Keine Simulation der ursprünglichen Maschine oder von Adas Algorithmus.</small></div>",
    source: sources.history, sourceLabel: 'Computer History Museum'
  },
  notes: {
    title: "Anmerkungen A - G", kind: 'fact',
    description: "Ada übersetzte Luigi Menabreas Artikel über Babbages Analytical Engine aus dem Französischen. Sie ergänzte ihre eigenen Anmerkungen A bis G, in denen sie die Möglichkeiten der Maschine erklärte. Dabei dachte sie auch über die Verarbeitung anderer Symbole als Zahlen nach, beispielsweise Musik.",
    extra: "<div class=\"dialog-callout\">Die Redaktion übersetzt ins Heute:<br>„Ich habe die README korrigiert. Und nebenbei die Zukunft des Computers beschrieben.“<small>Ein erfundener Spruch, kein Zitat von Ada.</small></div>",
    source: sources.museum, sourceLabel: 'Science Museum Group'
  },
  fly: {
    title: 'Flyology', kind: 'fact',
    description: "1828 beschäftigte sich die zwölfjährige Ada mit Ideen zum Fliegen. Sie untersuchte Vögel, die Proportionen von Flügeln und geeignete Materialien. Ihre Untersuchungen wollte sie in „Flyology“ festhalten. Es war jugendliche Forschung und ein Entwurf, kein erfolgreich gebautes Flugzeug.",
    extra: "<div class=\"dialog-callout\">Projektstatus: Die Idee ist abgehoben.<br>Der Testpilot blieb lieber am Boden.<small>Humorvoller Kommentar der Redaktion. Die Flügel auf der Karte sind unsere Illustration, keine historische Zeichnung.</small></div>",
    source: sources.wiki, sourceLabel: "Wikipedia · Kindheit"
  },
  tea: {
    title: 'TeaScript', kind: 'fiction',
    description: "Unsere völlig erfundene Programmiersprache für Damen, Herren und überhitzte Teekessel. Jedes Programm beginnt mit dem Erhitzen von Wasser und endet mit der Frage, ob die Milch vor dem Tee in die Tasse kommt. Exceptions behandelt der Butler.",
    extra: "<div class=\"dialog-callout\">SyntaxError: Keks fehlt.<br>Lösung: Zwei hinzufügen. Sicher ist sicher.<small>Keine dieser Technologien hat historisch existiert.</small></div><button class=\"button primary dialog-action\" data-go-lab>TeaScript ausprobieren ↗</button>"
  },
  cloud: {
    title: "Dampf-Cloud™", kind: 'fiction',
    description: "Ein fiktiver Hostingdienst, angetrieben von Dampf und unbegründetem Selbstvertrauen. Daten landen in der Wolke, Backups im Nebel und Rechnungen unter der Tür. Bei Regen kommt es zu ungeplanten Datei-Downloads.",
    extra: "<div class=\"dialog-callout\">FREE-Tarif: 5 MB Dampf<br>PRO-Tarif: eigener Kessel<br>ENTERPRISE: jemand anderes legt Kohle nach<small>Dies ist kein echtes Angebot. Auch nicht per Brieftaube bestellbar.</small></div>"
  },
  undo: {
    title: "Salon-Undo", kind: 'fiction',
    description: "Ein erfundenes Gerät, das die letzte gesellschaftliche Katastrophe rückgängig macht. Sie haben Tee über den Baron geschüttet? Ctrl + Z. Den falschen Hut gelobt? Ctrl + Z. Verraten, was Sie von seiner Mathematik halten? Da hilft nur noch ein neuer Salon.",
    extra: "<div class=\"dialog-callout\" id=\"undo-message\" role=\"status\" aria-live=\"polite\" aria-atomic=\"true\">„Ihr Hut sieht aus wie eine kaputte Differenzmaschine.“</div><button class=\"button primary dialog-action\" id=\"undo-demo\">Die Abendgesellschaft retten · Ctrl + Z</button>"
  }
};

const dialog = $('#project-dialog');
$$('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  $('#dialog-title').textContent = project.title;
  $('#dialog-tag').className = 'tag ' + project.kind;
  $('#dialog-tag').textContent = project.kind === 'fact' ? "● HISTORISCHE GRUNDLAGE" : "✳ PURER SCHABERNACK · ERFUNDEN";
  $('#dialog-description').textContent = project.description;
  $('#dialog-extra').innerHTML = project.extra;
  $('#dialog-source').innerHTML = project.source ? "Historische Quelle: <a target=\"_blank\" rel=\"noopener noreferrer\" href=\"" + project.source + '">' + project.sourceLabel + ' ↗</a>' : "Ein erfundenes Projekt für diese humorvolle Website. Es gehört nicht zur tatsächlichen Biografie von Ada Lovelace.";
  dialog.showModal();
  const numberSelect = $('#bernoulli-index');
  if (numberSelect) numberSelect.addEventListener('change', () => {
    const values = {2:'1 / 6',4:'−1 / 30',6:'1 / 42',8:'−1 / 30',10:'5 / 66',12:'−691 / 2730'};
    $('#bernoulli-result').textContent = values[numberSelect.value];
  });
  const labButton = $('[data-go-lab]');
  if (labButton) labButton.addEventListener('click', () => { dialog.close(); window.location.href = '/de/#laboratorium'; });
  const undoButton = $('#undo-demo');
  if (undoButton) undoButton.addEventListener('click', () => {
    $('#undo-message').textContent = "„Was für ein gewagter Hut! Eine solche Architektur hat noch niemand versucht.“ ✓ Abendgesellschaft gerettet.";
    $('#undo-message').setAttribute('role', 'status');
    undoButton.textContent = "Skandal erfolgreich zurückgenommen ✓";
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
const teaNames = {earl:'Earl Grey',green:"Grüner Tee",coffee:"Kaffee"};
$('#tea-type').addEventListener('change', () => { $('#code-tea').textContent = "'" + teaNames[$('#tea-type').value] + "'"; });
let brewing = false;
$('#brew-button').addEventListener('click', () => {
  if (brewing) return;
  brewing = true;
  const selected = $('#tea-type').value;
  const button = $('#brew-button');
  button.disabled = true;
  $('#tea-type').disabled = true;
  button.textContent = "Der Algorithmus zieht…";
  $('#tea-output').textContent = "> Wasser wird auf Betriebstemperatur erhitzt.\n> Keksbestände werden überprüft…";
  setTimeout(() => {
    const result = {
      earl: "> Earl Grey erfolgreich kompiliert.\n> Hello, world. Und jetzt etwas Noblesse.\n✓ 0 Fehler. 2 Kekse. Die Zukunft ist bereit.",
      green: "> Grüner Tee erfolgreich kompiliert.\n> Energiesparmodus: weniger Dampf, gleich viel Genie.\n✓ CO₂-Fußabdruck: ein Tassenabdruck.",
      coffee: "> TypeError: Kaffee ist kein Tee.\n> Butler wird gerufen… Butler hat gekündigt.\n! Versuchen Sie Tee. Oder gründen Sie ein anderes Start-up."
    };
    $('#tea-output').textContent = result[selected];
    button.innerHTML = "Erneut starten <span>↗</span>";
    button.disabled = false;
    $('#tea-type').disabled = false;
    brewing = false;
  }, 1100);
});

}

if ($('#question-text')) {
const questions = [
  {text:"Ada schrieb einen Algorithmus für eine Maschine, die zu ihren Lebzeiten nicht fertiggestellt wurde.",answer:true,explanation:"Genau. Ihr Verfahren für Bernoulli-Zahlen war für Babbages Analytical Engine gedacht. Die Software war der Hardware tatsächlich voraus.",source:sources.history},
  {text:"TeaScript war die offizielle Sprache britischer Teestuben.",answer:false,explanation:"TeaScript haben wir erfunden. Die Teestuben mussten mit gewöhnlichen Gesprächen und stiller Bewertung ihrer Gäste auskommen."},
  {text:"Adas Vater war der Dichter Lord Byron.",answer:true,explanation:"Ja. Die Poesie blieb in der Familie, Ada ergänzte die Mathematik.",source:sources.wiki},
  {text:"Als Kind untersuchte sie, wie man fliegen könnte.",answer:true,explanation:"Ja. Ihr Interesse an Flügeln und am Fliegen ist mit dem Projekt Flyology verbunden. Es war kein fertiges Flugzeug.",source:sources.wiki},
  {text:"Zusammen mit Babbage startete sie einen dampfbetriebenen Cloudspeicher.",answer:false,explanation:"Das ist unsere Dampf-Cloud. In der echten Geschichte werden Sie sie nicht finden. Nicht einmal bei besonders feuchtem Wetter."},
  {text:"Ada erkannte in der Analytical Engine auch das Potenzial, mit Musik zu arbeiten.",answer:true,explanation:"Ja. Sie dachte über Möglichkeiten der Maschine jenseits der reinen Arithmetik nach. Ein viktorianisches Spotify hat sie allerdings nicht gebaut.",source:sources.museum}
];
let currentQuestion = 0;
let score = 0;
let answered = false;
function renderQuestion() {
  answered = false;
  $('#question-number').textContent = "FRAGE " + String(currentQuestion + 1).padStart(2, '0') + ' / 06';
  $('#quiz-score').textContent = "PUNKTE " + score;
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
  $('#quiz-score').textContent = "PUNKTE " + score;
  const prefix = correct ? "Richtig. Ein Keks für Sie!" : "Diesmal hat die Geschichte Sie erwischt.";
  $('#quiz-feedback').innerHTML = '<b>' + prefix + '</b>' + question.explanation + (question.source ? ' <a target="_blank" rel="noopener noreferrer" href="' + question.source + "\">Quelle ↗</a>" : " (Erfundener Inhalt.)");
  $('#quiz-next').hidden = false;
  $('#quiz-next').textContent = currentQuestion === questions.length - 1 ? "Ergebnis anzeigen →" : "Nächste Frage →";
}));
$('#quiz-next').addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < questions.length) { renderQuestion(); $('[data-answer]').focus({preventScroll:true}); return; }
  $('#question-number').textContent = "PRÜFUNG ABGESCHLOSSEN";
  $('#quiz-options').hidden = true;
  $('#quiz-next').hidden = true;
  $('#question-text').textContent = score >= 5 ? "Ehrendoktorwürde im Erkennen von Schabernack." : score >= 3 ? "Sie dürfen den Salon betreten." : "Wir empfehlen noch eine Tasse Geschichte.";
  $('#quiz-feedback').textContent = "Ergebnis: " + score + " von 6. " + (score === 6 ? "Ada hätte vermutlich anerkennend genickt. Das ist natürlich unsere Einschätzung." : "Die echten Geschichten und unsere Erfindungen können Sie bei den Projekten noch einmal nachlesen.");
  $('#quiz-restart').hidden = false;
  $('#quiz-restart').focus({preventScroll:true});
});
$('#quiz-restart').addEventListener('click', () => {currentQuestion = 0; score = 0; renderQuestion(); $('[data-answer]').focus({preventScroll:true});});
renderQuestion();

}

let toastTimer;
const bugReports = ["Käfer erfasst. Der Gärtner wurde gerufen. Die IT-Abteilung wird später gegründet.", "Priorität: hoch. Anzahl der Beine: sechs. Geschätzte Reparaturzeit: nach dem Tee.", "Der Käfer behauptet, er sei ein Feature. Die Untersuchung läuft weiter."];
let bugIndex = 0;
$('#bug-button')?.addEventListener('click', () => {
  clearTimeout(toastTimer);
  $('#toast').textContent = bugReports[bugIndex++ % bugReports.length];
  $('#toast').classList.add('visible');
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 6000);
});
