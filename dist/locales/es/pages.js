(() => {
  'use strict';
  const find = selector => document.querySelector(selector);
  const all = selector => [...document.querySelectorAll(selector)];
  // Keep Tab navigation inside an open dialog; Escape still closes it natively.
  all('dialog').forEach(dialog => dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button:not([disabled]), a[href], select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter(element => element.getClientRects().length > 0 && !element.closest('[hidden]'));
    if (!controls.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }));
  const menu = find('.menu-toggle');
  if (menu) menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    find('#site-nav').classList.toggle('menu-open', open);
    menu.querySelector('span').textContent = open ? '−' : '+';
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
      menu.setAttribute('aria-expanded','false');
      menu.querySelector('span').textContent = '+';
      find('#site-nav').classList.remove('menu-open');
      menu.focus();
    }
  });

  const reference = {
    biography:'https://en.wikipedia.org/wiki/Ada_Lovelace',
    museum:'https://www.computerhistory.org/babbage/adalovelace/',
    notes:'https://psychclassics.yorku.ca/Lovelace/lovelace.htm',
    letters:'https://www.claymath.org/online-resources/ada-lovelaces-mathematical-papers/',
    language:'https://learn.adacore.com/courses/intro-to-ada/chapters/introduction.html'
  };
  if (find('#visitor-quiz')) {
    const questions = [
      {category:"VIDA",q:"¿En qué año nació Ada Lovelace?",options:['1815','1843','1915',"Cuando se cargó la primera página web"],correct:0,why:"Nació el 10 de diciembre de 1815 en Londres. El año 1843 corresponde a sus famosas notas.",source:reference.biography},
      {category:"FAMILIA",q:"¿Quién fue el padre de Ada?",options:['Charles Babbage',"El poeta Lord Byron",'Augustus De Morgan',"El fundador de Nube de vapor"],correct:1,why:"Su padre fue el poeta Lord Byron. Babbage fue un colaborador que conoció más tarde.",source:reference.biography},
      {category:"COLABORACIÓN",q:"¿Con qué inventor se relaciona su trabajo sobre la máquina analítica?",options:['Thomas Edison','Nikola Tesla','Charles Babbage',"Un mayordomo con certificación DevOps"],correct:2,why:"Charles Babbage diseñaba la máquina analítica. Ada explicaba sus posibilidades y describió un procedimiento de cálculo.",source:reference.museum},
      {category:"ALGORITMOS",q:"¿Qué calculaba el procedimiento descrito en la nota G?",options:["La temperatura óptima del té","El número de sombreros en el baile","La probabilidad de que fallara el Wi-Fi","Los números de Bernoulli"],correct:3,why:"La nota G describe un procedimiento para los números de Bernoulli. El nombre Bernoulli.exe de nuestra web es una broma moderna.",source:reference.notes},
      {category:"IDIOMAS",q:"¿De qué idioma tradujo Ada el artículo de Menabrea?",options:["Del francés","De Python","Del italiano","Del código morse"],correct:0,why:"El artículo se publicó en francés en 1842. La traducción al inglés con las notas de Ada se publicó en 1843.",source:reference.notes},
      {category:"HARDWARE",q:"¿Qué ocurrió con la máquina analítica durante la vida de Ada?",options:["Se vendía como portátil","No llegó a terminarse","Funcionaba en todas las casas de té","Olvidaron la contraseña"],correct:1,why:"La máquina analítica no llegó a terminarse durante su vida. Por eso no pudo ejecutar en ella el procedimiento que había publicado.",source:reference.museum},
      {category:"IMAGINACIÓN",q:"¿Qué posibilidad de la máquina contempló Ada, además del cálculo?",options:["Tramitar visados","Preparar té automáticamente","Trabajar con música","Vender suscripciones"],correct:2,why:"Pensó en manipular símbolos distintos de los números y mencionó la posibilidad de trabajar con música. Eso no significa que creara una aplicación musical.",source:reference.notes},
      {category:"IDEAS DE INFANCIA",q:"¿Con qué estaba relacionado el proyecto juvenil Flyology?",options:["Con los compiladores","Con el vuelo y las alas","Con la taxonomía de los errores informáticos","Con el marketing de aerolíneas"],correct:1,why:"A los doce años se interesaba por el vuelo, las alas y los materiales. El proyecto no era un avión terminado y funcional.",source:reference.biography},
      {category:"EDUCACIÓN",q:"¿Con quién estudió Ada matemáticas avanzadas por correspondencia?",options:["Con Lord Byron","Con Isaac Newton","Con el chatbot TéGPT","Con Augustus De Morgan"],correct:3,why:"Sus cartas matemáticas con Augustus De Morgan de 1840 a 1841 son una fuente importante sobre su formación.",source:reference.letters},
      {category:"LENGUAJE ADA",q:"¿Qué relación tiene Ada Lovelace con el lenguaje de programación Ada?",options:["Escribió su compilador","Lo utilizaba en 1843","El lenguaje fue bautizado en su honor","Es su seudónimo secreto"],correct:2,why:"El lenguaje no surgió hasta el siglo XX y su primer estándar se publicó en 1983. Ada Lovelace no lo creó; lleva su nombre.",source:'/es/lenguaje-ada/'},
      {category:"REALIDAD O BROMA",q:"¿Cuál de estos proyectos de nuestra web es completamente inventado?",options:['TeaScript',"Notas A - G","El procedimiento para los números de Bernoulli","Las investigaciones sobre el vuelo"],correct:0,why:"TeaScript es nuestro lenguaje de té ficticio. El auténtico lenguaje de programación Ada tiene su propia página.",source:'/es/portafolio/'},
      {category:"HISTORIA SIN ATAJOS",q:"¿Cuál de estas afirmaciones sobre Ada es la más precisa?",options:["Inventó todos los ordenadores ella sola","Fue una pionera; llamarla exactamente «la primera» requiere contexto","Escribió la primera aplicación móvil","Fundó la primera nube en Londres"],correct:1,why:"Se la suele considerar la primera programadora, sobre todo por su procedimiento publicado en 1843. Babbage también tenía procedimientos anteriores sin publicar; su legado incluye además una visión más amplia de las máquinas de cálculo.",source:reference.museum}
    ];
    let index = 0;
    let responses = [];
    let locked = false;
    const score = () => responses.filter((answer,i) => answer === questions[i].correct).length;
    const createSource = url => {
      const link = document.createElement('a');
      link.href = url;
      link.textContent = " Comprobar la fuente ↗";
      if (url.startsWith('https:')) {link.target='_blank';link.rel='noopener noreferrer';}
      return link;
    };
    function renderQuestion(focus = false) {
      locked = false;
      const q = questions[index];
      find('#vq-position').textContent = `PREGUNTA ${String(index+1).padStart(2,'0')} / ${questions.length}`;
      find('#vq-score').textContent = `PUNTUACIÓN ${score()}`;
      find('#vq-progress').style.width = `${index / questions.length * 100}%`;
      find('#vq-category').textContent = q.category;
      find('#vq-question').textContent = q.q;
      find('#vq-feedback').replaceChildren();
      find('#vq-feedback').className = 'answer-feedback';
      find('#vq-next').hidden = true;
      find('#vq-answers').replaceChildren();
      q.options.forEach((option, choice) => {
        const button = document.createElement('button');
        button.className = 'answer-option';
        const letter = document.createElement('span');
        letter.className = 'answer-letter';
        letter.textContent = String.fromCharCode(65+choice);
        const label = document.createElement('span');
        label.textContent = option;
        button.append(letter,label);
        button.addEventListener('click', () => {
          if(locked) return;
          locked=true;
          responses.push(choice);
          const correct=choice===q.correct;
          all('.answer-option').forEach((item,i) => {item.setAttribute('aria-disabled','true');item.classList.toggle('correct',i===q.correct);});
          button.classList.add(correct?'chosen-correct':'chosen-wrong');
          find('#vq-score').textContent = `PUNTUACIÓN ${score()}`;
          find('#vq-progress').style.width = `${(index+1)/questions.length*100}%`;
          const title = document.createElement('strong');
          title.textContent = correct?"Correcto. ¡Una galleta para ti!":"Esta vez la historia te ha pillado.";
          const explanation = document.createElement('p');
          explanation.textContent = (correct?'':`Respuesta correcta: ${q.options[q.correct]}. `)+q.why;
          explanation.append(createSource(q.source));
          find('#vq-feedback').append(title,explanation);
          find('#vq-feedback').classList.add(correct?'positive':'negative');
          find('#vq-next').textContent = index===questions.length-1?"Mostrar el resultado →":"Siguiente pregunta →";
          find('#vq-next').hidden = false;
          // Keep focus on the chosen answer; feedback is announced through the live region.
        });
        find('#vq-answers').append(button);
      });
      if(focus) find('#vq-question').focus();
    }
    function showResult() {
      const total=score();
      find('#vq-question-stage').hidden=true;
      find('#vq-result').hidden=false;
      find('#vq-position').textContent="EXAMEN TERMINADO";
      find('#vq-result-number').textContent=`${total} / ${questions.length}`;
      find('#vq-result-title').textContent=total>=10?"Doctorado honorífico del salón.":total>=7?"Tu algoritmo para la historia funciona.":total>=4?"Una buena base. Ahora toca ampliar las notas.":"Te recomendamos una segunda taza de historia.";
      find('#vq-result-text').textContent=`Has acertado ${total} de ${questions.length} preguntas (${Math.round(total/questions.length*100)} %). ${total===12?"Una actuación impecable. Hasta el compilador guarda un silencio de aprobación.":"Consulta el resumen, explora las fuentes y vuelve a jugar cuando quieras."}`;
      find('#vq-review').replaceChildren();
      questions.forEach((q,i)=>{
        const row=document.createElement('li');
        const title=document.createElement('strong');title.textContent=q.q;
        const answer=document.createElement('p');answer.textContent=`${responses[i]===q.correct?'✓':'✕'} Tu respuesta: ${q.options[responses[i]]}`;
        const solution=document.createElement('p');solution.textContent=`Respuesta correcta: ${q.options[q.correct]}. ${q.why}`;solution.append(createSource(q.source));
        row.append(title,answer,solution);find('#vq-review').append(row);
      });
      find('#vq-result-title').focus();
    }
    find('#vq-next').addEventListener('click',()=>{index++;if(index<questions.length)renderQuestion(true);else showResult();});
    find('#vq-restart').addEventListener('click',()=>{index=0;responses=[];find('#vq-question-stage').hidden=false;find('#vq-result').hidden=true;find('.answer-review').open=false;renderQuestion(true);});
    renderQuestion();
  }

  const cvRoles = {
    developer: {
      title:"Programadora y analista",
      pitch:"Transformo encargos complejos en pasos precisos. Documento incluso lo que nadie ha construido todavía. Busco un equipo que considere la curiosidad una cualificación.",
      skills:["Pensamiento algorítmico y capacidad para dividir un problema en pasos.","Documentación técnica que merece la pena leer.","La combinación de matemáticas, creatividad y cuestiones prácticas.","Paciencia con el hardware. Demostrada históricamente."],
      jobTitle:"Diseñadora de algoritmos · equipo imaginario Analytical Engine",
      job:"Diseñé un procedimiento, describí sus supuestos y expliqué sus posibilidades. Hoy añadiría pruebas y exigiría una revisión de código comprensible.",
      sideTitle:"TeaScript · arquitecta principal de la tetera",
      side:"Prototipo de un lenguaje cuyo proceso de compilación termina con una taza de té. Resultado: equipo hidratado y documentación con aroma a bergamota.",
      method:"Primero comprendo el problema. Después diseño el procedimiento, compruebo los supuestos y solo entonces abro el editor. «En mi equipo funciona» me parece el principio de una conversación.",
      conditions:"Un problema con sentido, espacio para pensar y un ordenador que ya exista.",
      letter:"Estimado equipo: en su oferta piden tres años de experiencia con una herramienta que existe desde hace dos. Creo que nos entenderemos. Yo trabajaba en un programa antes de que el ordenador estuviera terminado."
    },
    vibe: {
      title:"Vibe coder y creadora de prototipos poéticos",
      pitch:"Convierto un vago «que tenga chispa» en un prototipo y luego pregunto qué debe hacer exactamente. La IA es mi ayudante. La responsabilidad por el resultado sigue siendo mía.",
      skills:["Traducir una idea nebulosa en un encargo comprensible.","Crear prototipos rápidamente con IA, té y pensamiento crítico.","Revisar el código generado y comprobar su comportamiento.","Saber decir «es bonito, pero esto todavía no funciona»."],
      jobTitle:"Responsable de prompt a prototipo · estudio ficticio Poetical Science",
      job:"En este presente alternativo probaría ideas con IA, precisaría los requisitos y comprobaría que el resultado cumple lo prometido. Devolvería el prompt «arréglalo como sea» para que lo concretaran.",
      sideTitle:"Nube de vapor · prototipo al borde de la condensación",
      side:"Diseñé una nube ficticia con una presentación impresionante y alguna duda sobre la física. Tras la primera lluvia descubrimos la necesidad de copias de seguridad. El MVP consiguió su propio paraguas.",
      method:"Primero defino el objetivo. Después doy instrucciones, pruebo, leo y corrijo. No publico código de IA solo porque me haya respondido con mucha educación.",
      conditions:"Un asistente de IA, un buen encargo, tiempo para probar y ninguna reunión mientras se infusiona el té.",
      letter:"Estimado equipo: su producto necesita una visión, un prototipo y alguien que compruebe si el botón funciona de verdad. Ofrezco las tres cosas. A la pregunta «¿cuántos prompts al día?» respondo: prefiero el problema adecuado a un montón de prompts."
    }
  };
  if(find('#cv-sheet')) {
    all('[data-cv-role]').forEach(button=>button.addEventListener('click',()=>{
      const role=cvRoles[button.dataset.cvRole];
      all('[data-cv-role]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
      const fields={'cv-role-title':'title','cv-pitch':'pitch','cv-job-title':'jobTitle','cv-job-description':'job','cv-side-title':'sideTitle','cv-side-description':'side','cv-method':'method','cv-conditions':'conditions','cv-letter':'letter'};
      for(const [id,key] of Object.entries(fields)) find('#'+id).textContent=role[key];
      find('#cv-skills').replaceChildren(...role.skills.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
      find('#cv-announcement').textContent="Currículum actualizado: "+role.title+'.';
    }));
    find('#print-cv').addEventListener('click',()=>window.print());
  }
  if(find('#ada-example')) {
    const examples={
      hello:{file:'hello.adb',code:'with Ada.Text_IO; use Ada.Text_IO;\n\nprocedure Hello is\nbegin\n   Put_Line ("Hello, salon!");\nend Hello;',output:'Hello, salon!',explanation:"Put_Line muestra texto y termina la línea. El procedimiento Hello es el punto de entrada de este ejemplo."},
      loop:{file:'caj.adb',code:'with Ada.Text_IO; use Ada.Text_IO;\n\nprocedure Caj is\nbegin\n   for I in 1 .. 3 loop\n      Put_Line ("Salka" & Integer\'Image (I));\n   end loop;\nend Caj;',output:'Salka 1\nSalka 2\nSalka 3',explanation:"El bucle recorre los valores del 1 al 3, ambos incluidos. Integer'Image convierte el número en texto; los números positivos incluyen también un espacio inicial."},
      type:{file:'kanvica.adb',code:'with Ada.Text_IO; use Ada.Text_IO;\n\nprocedure Kanvica is\n   subtype Teplota is Integer range 0 .. 100;\n   Voda : Teplota := 95;\nbegin\n   Put_Line ("Teplota:" & Integer\'Image (Voda));\nend Kanvica;',output:'Teplota: 95',explanation:"El subtipo Teplota limita los enteros permitidos al rango de 0 a 100. El valor 95 pertenece a ese rango. El símbolo := indica una asignación."}
    };
    find('#ada-example').addEventListener('change',()=>{
      const example=examples[find('#ada-example').value];
      find('#ada-code').textContent=example.code;
      find('#ada-filename').textContent=example.file;
      find('#ada-explanation').textContent=example.explanation;
      find('#ada-output').textContent="Elige «Mostrar la salida esperada».";
      find('#ada-copy').textContent="Copiar código";
    });
    find('#ada-show-output').addEventListener('click',()=>{find('#ada-output').textContent=examples[find('#ada-example').value].output;});
    find('#ada-copy').addEventListener('click',async()=>{
      try {await navigator.clipboard.writeText(examples[find('#ada-example').value].code);find('#ada-copy').textContent="Código copiado ✓";find('#page-toast').textContent="El código se ha copiado al portapapeles.";}
      catch {find('#ada-copy').textContent="Selecciona y copia el código manualmente";const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(find('#ada-code'));selection.removeAllRanges();selection.addRange(range);}
    });
  }
})();
