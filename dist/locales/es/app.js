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
  $('#project-count').textContent = count === 6 ? "6 piezas" : "3 piezas";
}));

const projects = {
  bernoulli: {
    title: 'Bernoulli.exe', kind: 'fact',
    description: "En la nota G de 1843, Ada describió un procedimiento para calcular los números de Bernoulli con la máquina analítica. Se suele citar como el primer programa informático publicado. Sin embargo, la máquina no se terminó durante su vida. El nombre «Bernoulli.exe» es un chiste nuestro: entonces no andaban preocupados por las extensiones de archivo.",
    extra: "<div class=\"dialog-callout\">Una pequeña muestra de una gran idea<div class=\"number-demo\"><label for=\"bernoulli-index\">Elige un número:</label><select id=\"bernoulli-index\"><option value=\"2\">B₂</option><option value=\"4\">B₄</option><option value=\"6\">B₆</option><option value=\"8\">B₈</option><option value=\"10\">B₁₀</option><option value=\"12\">B₁₂</option></select><output id=\"bernoulli-result\" for=\"bernoulli-index\" aria-live=\"polite\">1 / 6</output></div><small>Demostración moderna de algunos valores. No simula la máquina original ni el algoritmo de Ada.</small></div>",
    source: sources.history, sourceLabel: 'Computer History Museum'
  },
  notes: {
    title: "Notas A - G", kind: 'fact',
    description: "Ada tradujo del francés un artículo de Luigi Menabrea sobre la máquina analítica de Babbage. Añadió sus propias notas, de la A a la G, para explicar sus posibilidades. También contempló trabajar con símbolos distintos de los números, por ejemplo con música.",
    extra: "<div class=\"dialog-callout\">Traducción de la redacción al lenguaje de hoy:<br>«He arreglado el README. Y, de paso, he descrito el futuro de los ordenadores».<small>Una ocurrencia inventada, no una cita de Ada.</small></div>",
    source: sources.museum, sourceLabel: 'Science Museum Group'
  },
  fly: {
    title: 'Flyology', kind: 'fact',
    description: "En 1828, Ada, de doce años, exploraba ideas sobre el vuelo. Estudiaba las aves, las proporciones de sus alas y los materiales adecuados. Quería recoger sus investigaciones en «Flyology». Fue un estudio y un diseño juvenil, no un avión construido con éxito.",
    extra: "<div class=\"dialog-callout\">Estado del proyecto: la idea despegó.<br>Piloto de pruebas: prefirió quedarse en tierra.<small>Comentario humorístico de la redacción. Las alas de la tarjeta son una ilustración nuestra, no un plano histórico.</small></div>",
    source: sources.wiki, sourceLabel: "Wikipedia · infancia"
  },
  tea: {
    title: 'TeaScript', kind: 'fiction',
    description: "Nuestro lenguaje de programación completamente inventado para damas, caballeros y teteras sobrecalentadas. Cada programa empieza calentando agua y termina preguntándose si la leche va antes del té. El mayordomo gestiona las excepciones.",
    extra: "<div class=\"dialog-callout\">SyntaxError: falta una galleta.<br>Solución: añade dos. Por si acaso.<small>Ninguna de estas tecnologías existió históricamente.</small></div><button class=\"button primary dialog-action\" data-go-lab>Probar TeaScript ↗</button>"
  },
  cloud: {
    title: "Nube de vapor™", kind: 'fiction',
    description: "Un servicio de alojamiento ficticio impulsado por vapor y una confianza injustificada. Los datos se guardan en la nube, las copias en la niebla y las facturas se deslizan bajo la puerta. Cuando llueve, se producen descargas de archivos no programadas.",
    extra: "<div class=\"dialog-callout\">Plan FREE: 5 MB de vapor<br>Plan PRO: caldera propia<br>ENTERPRISE: otra persona echa el carbón<small>No es una oferta real. No se puede contratar ni por paloma mensajera.</small></div>"
  },
  undo: {
    title: "Deshacer de salón", kind: 'fiction',
    description: "Un aparato inventado para deshacer la última catástrofe social. ¿Has derramado té sobre el barón? Ctrl + Z. ¿Has elogiado el sombrero equivocado? Ctrl + Z. ¿Has revelado lo que piensas de sus matemáticas? Para eso ya necesitas otro salón.",
    extra: "<div class=\"dialog-callout\" id=\"undo-message\" role=\"status\" aria-live=\"polite\" aria-atomic=\"true\">«Su sombrero parece una máquina diferencial averiada».</div><button class=\"button primary dialog-action\" id=\"undo-demo\">Salvar la velada · Ctrl + Z</button>"
  }
};

const dialog = $('#project-dialog');
$$('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  $('#dialog-title').textContent = project.title;
  $('#dialog-tag').className = 'tag ' + project.kind;
  $('#dialog-tag').textContent = project.kind === 'fact' ? "● BASE HISTÓRICA" : "✳ PURA BROMA · INVENTADO";
  $('#dialog-description').textContent = project.description;
  $('#dialog-extra').innerHTML = project.extra;
  $('#dialog-source').innerHTML = project.source ? "Fuente histórica: <a target=\"_blank\" rel=\"noopener noreferrer\" href=\"" + project.source + '">' + project.sourceLabel + ' ↗</a>' : "Proyecto inventado para esta web humorística. No forma parte de la biografía real de Ada Lovelace.";
  dialog.showModal();
  const numberSelect = $('#bernoulli-index');
  if (numberSelect) numberSelect.addEventListener('change', () => {
    const values = {2:'1 / 6',4:'−1 / 30',6:'1 / 42',8:'−1 / 30',10:'5 / 66',12:'−691 / 2730'};
    $('#bernoulli-result').textContent = values[numberSelect.value];
  });
  const labButton = $('[data-go-lab]');
  if (labButton) labButton.addEventListener('click', () => { dialog.close(); window.location.href = '/es/#laboratorium'; });
  const undoButton = $('#undo-demo');
  if (undoButton) undoButton.addEventListener('click', () => {
    $('#undo-message').textContent = "«¡Qué sombrero tan atrevido! Nadie había probado una arquitectura así». ✓ Velada salvada.";
    $('#undo-message').setAttribute('role', 'status');
    undoButton.textContent = "Escándalo anulado con éxito ✓";
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
const teaNames = {earl:'Earl Grey',green:"Té verde",coffee:"Café"};
$('#tea-type').addEventListener('change', () => { $('#code-tea').textContent = "'" + teaNames[$('#tea-type').value] + "'"; });
let brewing = false;
$('#brew-button').addEventListener('click', () => {
  if (brewing) return;
  brewing = true;
  const selected = $('#tea-type').value;
  const button = $('#brew-button');
  button.disabled = true;
  $('#tea-type').disabled = true;
  button.textContent = "Infusionando el algoritmo…";
  $('#tea-output').textContent = "> Calentando el agua a temperatura de funcionamiento.\n> Comprobando las reservas de galletas…";
  setTimeout(() => {
    const result = {
      earl: "> Earl Grey compilado con éxito.\n> Hello, world. Y ahora, un poco de elegancia.\n✓ 0 errores. 2 galletas. El futuro está listo.",
      green: "> Té verde compilado con éxito.\n> Modo de ahorro: menos vapor, el mismo genio.\n✓ Huella de carbono: un cerco de taza.",
      coffee: "> TypeError: el café no es té.\n> Llamando al mayordomo… el mayordomo se ha marchado.\n! Prueba con té. O funda otra startup."
    };
    $('#tea-output').textContent = result[selected];
    button.innerHTML = "Ejecutar de nuevo <span>↗</span>";
    button.disabled = false;
    $('#tea-type').disabled = false;
    brewing = false;
  }, 1100);
});

}

if ($('#question-text')) {
const questions = [
  {text:"Ada escribió un algoritmo para una máquina que no se terminó durante su vida.",answer:true,explanation:"Exacto. Su procedimiento para los números de Bernoulli estaba pensado para la máquina analítica de Babbage. El software realmente se adelantó al hardware.",source:sources.history},
  {text:"TeaScript era el lenguaje oficial de las casas de té británicas.",answer:false,explanation:"TeaScript nos lo hemos inventado. Las casas de té tuvieron que conformarse con conversar y juzgar discretamente a sus clientes."},
  {text:"El padre de Ada fue el poeta Lord Byron.",answer:true,explanation:"Sí. La poesía se quedó en la familia; Ada le añadió las matemáticas.",source:sources.wiki},
  {text:"De niña investigó cómo se podría volar.",answer:true,explanation:"Sí. Su interés por las alas y el vuelo se relaciona con el proyecto Flyology. No era un avión terminado.",source:sources.wiki},
  {text:"Ada y Babbage lanzaron un servicio de almacenamiento en la nube impulsado por vapor.",answer:false,explanation:"Esa es nuestra Nube de vapor. No la encontrarás en la historia real. Ni siquiera con un tiempo extremadamente húmedo."},
  {text:"Ada vio que la máquina analítica también podía tener potencial para trabajar con música.",answer:true,explanation:"Sí. Reflexionó sobre las posibilidades de la máquina más allá de la aritmética. Pero no construyó ningún Spotify victoriano.",source:sources.museum}
];
let currentQuestion = 0;
let score = 0;
let answered = false;
function renderQuestion() {
  answered = false;
  $('#question-number').textContent = "PREGUNTA " + String(currentQuestion + 1).padStart(2, '0') + ' / 06';
  $('#quiz-score').textContent = "PUNTUACIÓN " + score;
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
  $('#quiz-score').textContent = "PUNTUACIÓN " + score;
  const prefix = correct ? "Correcto. ¡Una galleta para ti!" : "Esta vez la historia te ha pillado.";
  $('#quiz-feedback').innerHTML = '<b>' + prefix + '</b>' + question.explanation + (question.source ? ' <a target="_blank" rel="noopener noreferrer" href="' + question.source + "\">Fuente ↗</a>" : " (Contenido inventado.)");
  $('#quiz-next').hidden = false;
  $('#quiz-next').textContent = currentQuestion === questions.length - 1 ? "Mostrar el resultado →" : "Siguiente pregunta →";
}));
$('#quiz-next').addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < questions.length) { renderQuestion(); $('[data-answer]').focus({preventScroll:true}); return; }
  $('#question-number').textContent = "EXAMEN TERMINADO";
  $('#quiz-options').hidden = true;
  $('#quiz-next').hidden = true;
  $('#question-text').textContent = score >= 5 ? "Doctorado honorífico en detectar bromas." : score >= 3 ? "Tienes permiso para entrar en el salón." : "Te recomendamos otra taza de historia.";
  $('#quiz-feedback').textContent = "Resultado: " + score + " de 6. " + (score === 6 ? "Ada probablemente asentiría con aprobación. Eso, por supuesto, es una suposición nuestra." : "Puedes volver a consultar los relatos reales y nuestras invenciones en los proyectos.");
  $('#quiz-restart').hidden = false;
  $('#quiz-restart').focus({preventScroll:true});
});
$('#quiz-restart').addEventListener('click', () => {currentQuestion = 0; score = 0; renderQuestion(); $('[data-answer]').focus({preventScroll:true});});
renderQuestion();

}

let toastTimer;
const bugReports = ["Bicho registrado. Hemos llamado al jardinero. El departamento de informática se fundará más adelante.", "Prioridad: alta. Número de patas: seis. Reparación estimada: después del té.", "El bicho asegura que es una funcionalidad. La investigación continúa."];
let bugIndex = 0;
$('#bug-button')?.addEventListener('click', () => {
  clearTimeout(toastTimer);
  $('#toast').textContent = bugReports[bugIndex++ % bugReports.length];
  $('#toast').classList.add('visible');
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 6000);
});
