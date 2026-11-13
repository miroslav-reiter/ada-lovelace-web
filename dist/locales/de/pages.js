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
      {category:"LEBEN",q:"In welchem Jahr wurde Ada Lovelace geboren?",options:['1815','1843','1915',"Als die erste Website geladen wurde"],correct:0,why:"Sie wurde am 10. Dezember 1815 in London geboren. 1843 erschienen ihre berühmten Anmerkungen.",source:reference.biography},
      {category:"FAMILIE",q:"Wer war Adas Vater?",options:['Charles Babbage',"Der Dichter Lord Byron",'Augustus De Morgan',"Der Gründer der Dampf-Cloud"],correct:1,why:"Ihr Vater war der Dichter Lord Byron. Babbage wurde später ihr wissenschaftlicher Partner.",source:reference.biography},
      {category:"ZUSAMMENARBEIT",q:"Mit welchem Erfinder ist ihre Arbeit an der Analytical Engine verbunden?",options:['Thomas Edison','Nikola Tesla','Charles Babbage',"Der Butler mit DevOps-Zertifikat"],correct:2,why:"Charles Babbage entwarf die Analytical Engine. Ada erläuterte ihre Möglichkeiten und beschrieb ein Berechnungsverfahren.",source:reference.museum},
      {category:"ALGORITHMEN",q:"Was berechnete das in Anmerkung G beschriebene Verfahren?",options:["Die optimale Teetemperatur","Die Anzahl der Hüte auf einem Ball","Die Wahrscheinlichkeit eines WLAN-Ausfalls","Bernoulli-Zahlen"],correct:3,why:"Anmerkung G beschreibt ein Verfahren für Bernoulli-Zahlen. Der Name Bernoulli.exe auf unserer Website ist ein moderner Scherz.",source:reference.notes},
      {category:"SPRACHEN",q:"Aus welcher Sprache übersetzte Ada Menabreas Artikel?",options:["Aus dem Französischen","Aus Python","Aus dem Italienischen","Aus dem Morsealphabet"],correct:0,why:"Der Artikel erschien 1842 auf Französisch. Die englische Übersetzung mit Adas Anmerkungen wurde 1843 veröffentlicht.",source:reference.notes},
      {category:"HARDWARE",q:"Was geschah mit der Analytical Engine zu Adas Lebzeiten?",options:["Sie wurde als Notebook verkauft","Sie wurde nicht fertiggestellt","Sie lief in jeder Teestube","Man hatte ihr Passwort vergessen"],correct:1,why:"Die Analytical Engine wurde zu ihren Lebzeiten nicht fertiggestellt. Deshalb konnte sie ihr veröffentlichtes Verfahren darauf nicht ausführen.",source:reference.museum},
      {category:"FANTASIE",q:"Über welche Fähigkeit der Maschine dachte Ada neben dem Rechnen nach?",options:["Über die Bearbeitung von Visaanträgen","Über das automatische Teekochen","Über die Arbeit mit Musik","Über den Verkauf von Abonnements"],correct:2,why:"Sie dachte über die Verarbeitung anderer Symbole als Zahlen nach und erwähnte auch die Arbeit mit Musik. Das bedeutet nicht, dass sie eine Musik-App entwickelt hat.",source:reference.notes},
      {category:"KINDLICHE IDEEN",q:"Womit beschäftigte sich ihr Jugendprojekt Flyology?",options:["Mit Compilern","Mit Fliegen und Flügeln","Mit der Klassifizierung von Computerfehlern","Mit dem Marketing von Fluggesellschaften"],correct:1,why:"Mit zwölf Jahren interessierte sie sich für das Fliegen, Flügel und Materialien. Das Projekt war kein fertiges, funktionsfähiges Flugzeug.",source:reference.biography},
      {category:"BILDUNG",q:"Mit wem studierte Ada höhere Mathematik per Briefwechsel?",options:["Mit Lord Byron","Mit Isaac Newton","Mit dem Chatbot TeeGPT","Mit Augustus De Morgan"],correct:3,why:"Ihre mathematischen Briefe mit Augustus De Morgan aus den Jahren 1840 - 1841 sind eine wichtige Quelle zu ihrer Ausbildung.",source:reference.letters},
      {category:"SPRACHE ADA",q:"Welche Verbindung besteht zwischen Ada Lovelace und der Programmiersprache Ada?",options:["Sie schrieb deren Compiler","Sie benutzte sie im Jahr 1843","Die Sprache wurde ihr zu Ehren benannt","Sie ist ihr geheimes Pseudonym"],correct:2,why:"Die Sprache entstand erst im 20. Jahrhundert; der erste Standard erschien 1983. Ada Lovelace hat sie nicht entwickelt. Sie trägt ihren Namen.",source:'/de/ada-sprache/'},
      {category:"FAKT ODER SCHABERNACK",q:"Welches dieser Projekte ist auf unserer Website völlig erfunden?",options:['TeaScript',"Anmerkungen A - G","Ein Verfahren für Bernoulli-Zahlen","Die Erforschung des Fliegens"],correct:0,why:"TeaScript ist unsere fiktive Teesprache. Die echte Programmiersprache Ada finden Sie auf einer eigenen Unterseite.",source:'/de/portfolio/'},
      {category:"GESCHICHTE OHNE ABKÜRZUNGEN",q:"Welche Aussage über Ada ist am genauesten?",options:["Sie erfand alle Computer im Alleingang","Sie war eine Pionierin; die genaue Bezeichnung „erste“ braucht Kontext","Sie schrieb die erste mobile App","Sie gründete die erste Cloud in London"],correct:1,why:"Sie wird häufig als erste Programmiererin bezeichnet, insbesondere wegen ihres 1843 veröffentlichten Verfahrens. Babbage hatte auch frühere, unveröffentlichte Verfahren entworfen. Zu ihrem Vermächtnis gehört außerdem eine umfassendere Vision von Rechenmaschinen.",source:reference.museum}
    ];
    let index = 0;
    let responses = [];
    let locked = false;
    const score = () => responses.filter((answer,i) => answer === questions[i].correct).length;
    const createSource = url => {
      const link = document.createElement('a');
      link.href = url;
      link.textContent = " Quelle überprüfen ↗";
      if (url.startsWith('https:')) {link.target='_blank';link.rel='noopener noreferrer';}
      return link;
    };
    function renderQuestion(focus = false) {
      locked = false;
      const q = questions[index];
      find('#vq-position').textContent = `FRAGE ${String(index+1).padStart(2,'0')} / ${questions.length}`;
      find('#vq-score').textContent = `PUNKTE ${score()}`;
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
          find('#vq-score').textContent = `PUNKTE ${score()}`;
          find('#vq-progress').style.width = `${(index+1)/questions.length*100}%`;
          const title = document.createElement('strong');
          title.textContent = correct?"Richtig. Ein Keks für Sie!":"Diesmal hat die Geschichte Sie erwischt.";
          const explanation = document.createElement('p');
          explanation.textContent = (correct?'':`Richtige Antwort: ${q.options[q.correct]}. `)+q.why;
          explanation.append(createSource(q.source));
          find('#vq-feedback').append(title,explanation);
          find('#vq-feedback').classList.add(correct?'positive':'negative');
          find('#vq-next').textContent = index===questions.length-1?"Ergebnis anzeigen →":"Nächste Frage →";
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
      find('#vq-position').textContent="PRÜFUNG ABGESCHLOSSEN";
      find('#vq-result-number').textContent=`${total} / ${questions.length}`;
      find('#vq-result-title').textContent=total>=10?"Eine Ehrendoktorwürde aus dem Salon.":total>=7?"Ihr Geschichtsalgorithmus funktioniert.":total>=4?"Eine gute Grundlage. Jetzt noch die Anmerkungen ergänzen.":"Wir empfehlen eine zweite Tasse Geschichte.";
      find('#vq-result-text').textContent=`Sie haben ${total} von ${questions.length} Fragen richtig beantwortet (${Math.round(total/questions.length*100)} %). ${total===12?"Eine fehlerfreie Leistung. Selbst der Compiler schweigt anerkennend.":"Sehen Sie sich die Übersicht an, entdecken Sie die Quellen und spielen Sie gerne noch einmal."}`;
      find('#vq-review').replaceChildren();
      questions.forEach((q,i)=>{
        const row=document.createElement('li');
        const title=document.createElement('strong');title.textContent=q.q;
        const answer=document.createElement('p');answer.textContent=`${responses[i]===q.correct?'✓':'✕'} Ihre Antwort: ${q.options[responses[i]]}`;
        const solution=document.createElement('p');solution.textContent=`Richtig: ${q.options[q.correct]}. ${q.why}`;solution.append(createSource(q.source));
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
      title:"Programmiererin & Analystin",
      pitch:"Ich verwandle komplexe Aufgaben in präzise Schritte. Ich dokumentiere auch, was noch niemand gebaut hat. Ich suche ein Team, das Neugier als Qualifikation betrachtet.",
      skills:["Algorithmisches Denken und die Fähigkeit, Probleme in einzelne Schritte zu zerlegen.","Technische Dokumentation, die man tatsächlich lesen möchte.","Die Verbindung von Mathematik, Kreativität und praktischen Fragen.","Geduld mit Hardware. Historisch belegt."],
      jobTitle:"Algorithm Designer · imaginäres Team Analytical Engine",
      job:"Ich entwarf ein Verfahren, beschrieb seine Voraussetzungen und erklärte seine Möglichkeiten. Heute würde ich Tests ergänzen und auf verständlichen Code-Reviews bestehen.",
      sideTitle:"TeaScript · Chefarchitektin des Teekessels",
      side:"Der Prototyp einer Sprache, deren Build-Pipeline mit einer Tasse Tee endet. Erreichtes Ergebnis: Das Team ist gut hydriert und die Dokumentation duftet nach Bergamotte.",
      method:"Zuerst verstehe ich das Problem. Dann entwerfe ich ein Verfahren, prüfe die Voraussetzungen und öffne erst danach den Editor. „Bei mir funktioniert es“ ist für mich der Beginn einer Diskussion.",
      conditions:"Eine sinnvolle Aufgabe, Raum zum Nachdenken und ein Computer, den es bereits gibt.",
      letter:"Sehr geehrtes Team, in Ihrer Anzeige wünschen Sie sich drei Jahre Erfahrung mit einem Werkzeug, das es seit zwei Jahren gibt. Ich glaube, wir werden uns verstehen. Ich habe an einem Programm gearbeitet, bevor der Computer fertig war."
    },
    vibe: {
      title:"Vibe-Coderin & poetische Prototypenentwicklerin",
      pitch:"Aus einem vagen „Es soll das gewisse Etwas haben“ mache ich einen Prototyp und frage dann, was er eigentlich tun soll. KI ist für mich eine Assistentin. Die Verantwortung für das Ergebnis behalte ich.",
      skills:["Die Übersetzung einer vagen Idee in eine verständliche Aufgabenstellung.","Schnelles Prototyping mit KI, Tee und kritischem Denken.","Die Prüfung generierten Codes und seines Verhaltens.","Die Fähigkeit zu sagen: „Hübsch, aber das funktioniert noch nicht.“"],
      jobTitle:"Prompt-to-Prototype Lead · fiktives Studio Poetical Science",
      job:"In dieser alternativen Gegenwart würde ich mit KI Ideen erproben, Aufgaben präzisieren und prüfen, ob das Ergebnis hält, was es verspricht. Den Prompt „Reparier das irgendwie“ würde ich zur Überarbeitung zurückgeben.",
      sideTitle:"Dampf-Cloud · ein Prototyp am Rand der Kondensation",
      side:"Ich entwarf eine fiktive Cloud mit beeindruckender Präsentation und fragwürdiger Physik. Nach dem ersten Regen entdeckten wir den Bedarf an Backups. Das MVP bekam einen eigenen Regenschirm.",
      method:"Zuerst benenne ich das Ziel. Dann formuliere, teste, lese und korrigiere ich. KI-Code setze ich nicht allein deshalb ein, weil die Antwort ausgesprochen höflich war.",
      conditions:"Eine KI-Assistenz, eine gute Aufgabenstellung, Zeit zum Testen und keine Meetings, während der Tee zieht.",
      letter:"Sehr geehrtes Team, Ihr Produkt braucht eine Vision, einen Prototyp und jemanden, der prüft, ob der Button tatsächlich funktioniert. Ich biete alle drei Dinge. Auf die Frage „Wie viele Prompts pro Tag?“ antworte ich: lieber das richtige Problem als viele Prompts."
    }
  };
  if(find('#cv-sheet')) {
    all('[data-cv-role]').forEach(button=>button.addEventListener('click',()=>{
      const role=cvRoles[button.dataset.cvRole];
      all('[data-cv-role]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
      const fields={'cv-role-title':'title','cv-pitch':'pitch','cv-job-title':'jobTitle','cv-job-description':'job','cv-side-title':'sideTitle','cv-side-description':'side','cv-method':'method','cv-conditions':'conditions','cv-letter':'letter'};
      for(const [id,key] of Object.entries(fields)) find('#'+id).textContent=role[key];
      find('#cv-skills').replaceChildren(...role.skills.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
      find('#cv-announcement').textContent="Lebenslauf aktualisiert: "+role.title+'.';
    }));
    find('#print-cv').addEventListener('click',()=>window.print());
  }
  if(find('#ada-example')) {
    const examples={
      hello:{file:'hello.adb',code:'with Ada.Text_IO; use Ada.Text_IO;\n\nprocedure Hello is\nbegin\n   Put_Line ("Hello, salon!");\nend Hello;',output:'Hello, salon!',explanation:"Put_Line gibt Text aus und beendet die Zeile. Die Prozedur Hello ist der Einstiegspunkt dieses Beispiels."},
      loop:{file:'caj.adb',code:'with Ada.Text_IO; use Ada.Text_IO;\n\nprocedure Caj is\nbegin\n   for I in 1 .. 3 loop\n      Put_Line ("Salka" & Integer\'Image (I));\n   end loop;\nend Caj;',output:'Salka 1\nSalka 2\nSalka 3',explanation:"Die Schleife durchläuft die Werte 1 bis einschließlich 3. Integer'Image wandelt eine Zahl in Text um; bei einer positiven Zahl enthält der Text ein führendes Leerzeichen."},
      type:{file:'kanvica.adb',code:'with Ada.Text_IO; use Ada.Text_IO;\n\nprocedure Kanvica is\n   subtype Teplota is Integer range 0 .. 100;\n   Voda : Teplota := 95;\nbegin\n   Put_Line ("Teplota:" & Integer\'Image (Voda));\nend Kanvica;',output:'Teplota: 95',explanation:"Der Untertyp Teplota begrenzt die zulässigen ganzen Zahlen auf den Bereich von 0 bis 100. Der Wert 95 liegt in diesem Bereich. Das Symbol := bedeutet Zuweisung."}
    };
    find('#ada-example').addEventListener('change',()=>{
      const example=examples[find('#ada-example').value];
      find('#ada-code').textContent=example.code;
      find('#ada-filename').textContent=example.file;
      find('#ada-explanation').textContent=example.explanation;
      find('#ada-output').textContent="Wählen Sie „Erwartete Ausgabe anzeigen“.";
      find('#ada-copy').textContent="Code kopieren";
    });
    find('#ada-show-output').addEventListener('click',()=>{find('#ada-output').textContent=examples[find('#ada-example').value].output;});
    find('#ada-copy').addEventListener('click',async()=>{
      try {await navigator.clipboard.writeText(examples[find('#ada-example').value].code);find('#ada-copy').textContent="Code kopiert ✓";find('#page-toast').textContent="Der Code wurde in die Zwischenablage kopiert.";}
      catch {find('#ada-copy').textContent="Markieren und kopieren Sie den Code manuell";const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(find('#ada-code'));selection.removeAllRanges();selection.addRange(range);}
    });
  }
})();
