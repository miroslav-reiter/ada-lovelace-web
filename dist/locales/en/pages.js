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
      {category:"LIFE",q:"In which year was Ada Lovelace born?",options:['1815','1843','1915',"When the first website loaded"],correct:0,why:"She was born on 10 December 1815 in London. The year 1843 belongs to her famous notes.",source:reference.biography},
      {category:"FAMILY",q:"Who was Ada's father?",options:['Charles Babbage',"The poet Lord Byron",'Augustus De Morgan',"The founder of Steam Cloud"],correct:1,why:"Her father was the poet Lord Byron. Babbage became her collaborator later.",source:reference.biography},
      {category:"COLLABORATION",q:"Which inventor is associated with her work on the Analytical Engine?",options:['Thomas Edison','Nikola Tesla','Charles Babbage',"A DevOps-certified butler"],correct:2,why:"Charles Babbage designed the Analytical Engine. Ada explained its capabilities and described a computational procedure.",source:reference.museum},
      {category:"ALGORITHMS",q:"What did the procedure described in Note G calculate?",options:["The ideal tea temperature","The number of hats at a ball","The probability of Wi-Fi failure","Bernoulli numbers"],correct:3,why:"Note G describes a procedure for Bernoulli numbers. The name Bernoulli.exe on our website is a modern joke.",source:reference.notes},
      {category:"LANGUAGES",q:"From which language did Ada translate Menabrea's article?",options:["French","Python","Italian","Morse code"],correct:0,why:"The article appeared in French in 1842. The English translation with Ada's notes was published in 1843.",source:reference.notes},
      {category:"HARDWARE",q:"What happened to the Analytical Engine during Ada's lifetime?",options:["It was sold as a laptop","It was not completed","It ran in every tearoom","They forgot its password"],correct:1,why:"The Analytical Engine was not completed during her lifetime. She therefore could not run her published procedure on it.",source:reference.museum},
      {category:"IMAGINATION",q:"What possibility did Ada consider for the machine beyond calculation?",options:["Processing visas","Making tea automatically","Working with music","Selling subscriptions"],correct:2,why:"She considered manipulating symbols other than numbers and mentioned the possibility of working with music. That does not mean she created a music app.",source:reference.notes},
      {category:"CHILDHOOD IDEAS",q:"What was the youthful Flyology project about?",options:["Compilers","Flight and wings","The taxonomy of computer bugs","Airline marketing"],correct:1,why:"At twelve, she was interested in flight, wings and materials. The project was not a completed working aircraft.",source:reference.biography},
      {category:"EDUCATION",q:"With whom did Ada study advanced mathematics by correspondence?",options:["Lord Byron","Isaac Newton","The chatbot TeaGPT","Augustus De Morgan"],correct:3,why:"Her mathematical letters with Augustus De Morgan from 1840 to 1841 are an important source on her education.",source:reference.letters},
      {category:"THE ADA LANGUAGE",q:"How is Ada Lovelace connected to the Ada programming language?",options:["She wrote its compiler","She used it in 1843","The language was named in her honour","It is her secret pseudonym"],correct:2,why:"The language was created in the 20th century, and its first standard appeared in 1983. Ada Lovelace did not create it; it bears her name.",source:'/en/ada-language/'},
      {category:"FACT OR FICTION",q:"Which of these projects is entirely fictional on our website?",options:['TeaScript',"Notes A - G","The procedure for Bernoulli numbers","The exploration of flight"],correct:0,why:"TeaScript is our fictional tea language. You will find the real Ada programming language on its own page.",source:'/en/portfolio/'},
      {category:"HISTORY WITHOUT SHORTCUTS",q:"Which statement about Ada is the most accurate?",options:["She invented every computer by herself","She was a pioneer; the precise label “first” needs context","She wrote the first mobile app","She founded the first cloud in London"],correct:1,why:"She is often called the first programmer, especially for her published procedure from 1843. Babbage also had earlier unpublished procedures; her legacy includes a broader vision of computing machines too.",source:reference.museum}
    ];
    let index = 0;
    let responses = [];
    let locked = false;
    const score = () => responses.filter((answer,i) => answer === questions[i].correct).length;
    const createSource = url => {
      const link = document.createElement('a');
      link.href = url;
      link.textContent = " Check the source ↗";
      if (url.startsWith('https:')) {link.target='_blank';link.rel='noopener noreferrer';}
      return link;
    };
    function renderQuestion(focus = false) {
      locked = false;
      const q = questions[index];
      find('#vq-position').textContent = `QUESTION ${String(index+1).padStart(2,'0')} / ${questions.length}`;
      find('#vq-score').textContent = `SCORE ${score()}`;
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
          find('#vq-score').textContent = `SCORE ${score()}`;
          find('#vq-progress').style.width = `${(index+1)/questions.length*100}%`;
          const title = document.createElement('strong');
          title.textContent = correct?"Correct. A biscuit for you!":"History caught you out this time.";
          const explanation = document.createElement('p');
          explanation.textContent = (correct?'':`Correct answer: ${q.options[q.correct]}. `)+q.why;
          explanation.append(createSource(q.source));
          find('#vq-feedback').append(title,explanation);
          find('#vq-feedback').classList.add(correct?'positive':'negative');
          find('#vq-next').textContent = index===questions.length-1?"Show result →":"Next question →";
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
      find('#vq-position').textContent="TEST COMPLETE";
      find('#vq-result-number').textContent=`${total} / ${questions.length}`;
      find('#vq-result-title').textContent=total>=10?"An honorary doctorate from the salon.":total>=7?"Your history algorithm works.":total>=4?"A good foundation. Time to add some notes.":"We recommend a second cup of history.";
      find('#vq-result-text').textContent=`You answered ${total} out of ${questions.length} questions correctly (${Math.round(total/questions.length*100)} %). ${total===12?"A flawless performance. Even the compiler is silently impressed.":"Review your answers, explore the sources and feel free to play again."}`;
      find('#vq-review').replaceChildren();
      questions.forEach((q,i)=>{
        const row=document.createElement('li');
        const title=document.createElement('strong');title.textContent=q.q;
        const answer=document.createElement('p');answer.textContent=`${responses[i]===q.correct?'✓':'✕'} Your answer: ${q.options[responses[i]]}`;
        const solution=document.createElement('p');solution.textContent=`Correct: ${q.options[q.correct]}. ${q.why}`;solution.append(createSource(q.source));
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
      title:"Programmer & analyst",
      pitch:"I turn complex briefs into precise steps. I document things nobody has built yet. I am looking for a team that considers curiosity a qualification.",
      skills:["Algorithmic thinking and the ability to break problems into steps.","Technical documentation worth reading.","Connecting mathematics, creativity and practical questions.","Patience with hardware. Historically proven."],
      jobTitle:"Algorithm Designer · imaginary Analytical Engine team",
      job:"I designed a procedure, documented its assumptions and explained its possibilities. Today I would add tests and insist on understandable code reviews.",
      sideTitle:"TeaScript · Chief Kettle Architect",
      side:"A prototype language whose build pipeline ends in a cup of tea. Outcome: a hydrated team and documentation scented with bergamot.",
      method:"First I understand the problem. Then I design a procedure, check the assumptions and only then open the editor. I consider “it works on my machine” the start of a discussion.",
      conditions:"A meaningful problem, room to think and a computer that already exists.",
      letter:"Dear team, your job advertisement asks for three years' experience with a tool that has existed for two years. I think we will get along. I worked on a program before the computer was ready."
    },
    vibe: {
      title:"Vibe coder & poetical prototyper",
      pitch:"I turn a vague “give it some sparkle” into a prototype, then ask what it should actually do. AI is my assistant. Responsibility for the result stays with me.",
      skills:["Turning a hazy idea into a clear brief.","Rapid prototyping with AI, tea and critical thinking.","Reviewing generated code and verifying its behaviour.","The ability to say “lovely, but this still does not work”."],
      jobTitle:"Prompt-to-Prototype Lead · fictional Poetical Science studio",
      job:"In this alternate present, I would test ideas with AI, refine the brief and check that the result does what it promises. I would send “just fix it somehow” prompts back for revision.",
      sideTitle:"Steam Cloud · a prototype on the verge of condensation",
      side:"I designed a fictional cloud with an impressive presentation and questionable physics. After the first rain, we discovered the need for backups. The MVP got its own umbrella.",
      method:"First I name the goal. Then I prompt, test, read and fix. I do not deploy AI-generated code simply because the AI answered very politely.",
      conditions:"An AI assistant, a good brief, time for testing and no meetings while the tea is steeping.",
      letter:"Dear team, your product needs a vision, a prototype and someone to check whether the button actually works. I offer all three. When asked “how many prompts a day?”, my answer is: the right problem beats a pile of prompts."
    }
  };
  if(find('#cv-sheet')) {
    all('[data-cv-role]').forEach(button=>button.addEventListener('click',()=>{
      const role=cvRoles[button.dataset.cvRole];
      all('[data-cv-role]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
      const fields={'cv-role-title':'title','cv-pitch':'pitch','cv-job-title':'jobTitle','cv-job-description':'job','cv-side-title':'sideTitle','cv-side-description':'side','cv-method':'method','cv-conditions':'conditions','cv-letter':'letter'};
      for(const [id,key] of Object.entries(fields)) find('#'+id).textContent=role[key];
      find('#cv-skills').replaceChildren(...role.skills.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
      find('#cv-announcement').textContent="CV updated: "+role.title+'.';
    }));
    find('#print-cv').addEventListener('click',()=>window.print());
  }
  if(find('#ada-example')) {
    const examples={
      hello:{file:'hello.adb',code:'with Ada.Text_IO; use Ada.Text_IO;\n\nprocedure Hello is\nbegin\n   Put_Line ("Hello, salon!");\nend Hello;',output:'Hello, salon!',explanation:"Put_Line prints text and ends the line. The Hello procedure is the entry point of this example."},
      loop:{file:'caj.adb',code:'with Ada.Text_IO; use Ada.Text_IO;\n\nprocedure Caj is\nbegin\n   for I in 1 .. 3 loop\n      Put_Line ("Salka" & Integer\'Image (I));\n   end loop;\nend Caj;',output:'Salka 1\nSalka 2\nSalka 3',explanation:"The loop runs through the values 1 to 3 inclusive. Integer'Image converts a number to text; for a positive number, the result includes a leading space."},
      type:{file:'kanvica.adb',code:'with Ada.Text_IO; use Ada.Text_IO;\n\nprocedure Kanvica is\n   subtype Teplota is Integer range 0 .. 100;\n   Voda : Teplota := 95;\nbegin\n   Put_Line ("Teplota:" & Integer\'Image (Voda));\nend Kanvica;',output:'Teplota: 95',explanation:"The Teplota subtype restricts permitted integers to the range 0 to 100. The value 95 falls within that range. The := symbol means assignment."}
    };
    find('#ada-example').addEventListener('change',()=>{
      const example=examples[find('#ada-example').value];
      find('#ada-code').textContent=example.code;
      find('#ada-filename').textContent=example.file;
      find('#ada-explanation').textContent=example.explanation;
      find('#ada-output').textContent="Select “Show expected output”.";
      find('#ada-copy').textContent="Copy code";
    });
    find('#ada-show-output').addEventListener('click',()=>{find('#ada-output').textContent=examples[find('#ada-example').value].output;});
    find('#ada-copy').addEventListener('click',async()=>{
      try {await navigator.clipboard.writeText(examples[find('#ada-example').value].code);find('#ada-copy').textContent="Code copied ✓";find('#page-toast').textContent="The code was copied to the clipboard.";}
      catch {find('#ada-copy').textContent="Select and copy the code manually";const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(find('#ada-code'));selection.removeAllRanges();selection.addRange(range);}
    });
  }
})();
