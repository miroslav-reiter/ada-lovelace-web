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
      {category:"ŽIVOT",q:"V ktorom roku sa Ada Lovelace narodila?",options:['1815','1843','1915',"Keď sa načítala prvá webstránka"],correct:0,why:"Narodila sa 10. decembra 1815 v Londýne. Rok 1843 patrí jej slávnym poznámkam.",source:reference.biography},
      {category:"RODINA",q:"Kto bol Adin otec?",options:['Charles Babbage',"Básnik Lord Byron",'Augustus De Morgan',"Zakladateľ Parného cloudu"],correct:1,why:"Jej otcom bol básnik Lord Byron. Babbage bol jej neskorší spolupracovník.",source:reference.biography},
      {category:"SPOLUPRÁCA",q:"S ktorým vynálezcom sa spája jej práca na analytickom stroji?",options:['Thomas Edison','Nikola Tesla','Charles Babbage',"Komorník s certifikátom DevOps"],correct:2,why:"Charles Babbage navrhoval analytický stroj. Ada vysvetľovala jeho možnosti a opísala výpočtový postup.",source:reference.museum},
      {category:"ALGORITMY",q:"Čo počítal postup opísaný v poznámke G?",options:["Optimálnu teplotu čaju","Počet klobúkov na plese","Pravdepodobnosť pádu Wi-Fi","Bernoulliho čísla"],correct:3,why:"Poznámka G opisuje postup pre Bernoulliho čísla. Názov Bernoulli.exe na našom webe je moderný žart.",source:reference.notes},
      {category:"JAZYKY",q:"Z akého jazyka Ada preložila Menabreov článok?",options:["Z francúzštiny","Z Pythonu","Z taliančiny","Z Morseovej abecedy"],correct:0,why:"Článok vyšiel vo francúzštine v roku 1842. Anglický preklad s Adinými poznámkami bol publikovaný v roku 1843.",source:reference.notes},
      {category:"HARDVÉR",q:"Aký bol osud analytického stroja počas Adinho života?",options:["Predával sa ako notebook","Nebol dokončený","Bežal v každej čajovni","Zabudli mu heslo"],correct:1,why:"Analytický stroj za jej života dokončený nebol. Preto na ňom svoj publikovaný postup nemohla spustiť.",source:reference.museum},
      {category:"PREDSTAVIVOSŤ",q:"O akej možnosti stroja Ada uvažovala okrem počítania?",options:["O vybavovaní víz","O automatickom varení čaju","O práci s hudbou","O predaji predplatného"],correct:2,why:"Uvažovala o manipulácii s inými symbolmi než číslami a uviedla aj možnosť práce s hudbou. Neznamená to, že vytvorila hudobnú aplikáciu.",source:reference.notes},
      {category:"DETSKÉ NÁPADY",q:"S čím súvisel mladícky projekt Flyology?",options:["S kompilátormi","S lietaním a krídlami","S taxonómiou počítačových chýb","S marketingom aeroliniek"],correct:1,why:"Ako dvanásťročná sa zaujímala o lietanie, krídla a materiály. Projekt nebol hotovým funkčným lietadlom.",source:reference.biography},
      {category:"VZDELÁVANIE",q:"S kým Ada korešpondenčne študovala pokročilú matematiku?",options:["S Lordom Byronom","S Isaacom Newtonom","S chatbotom ČajGPT","S Augustom De Morganom"],correct:3,why:"Jej matematické listy s Augustom De Morganom z rokov 1840 – 1841 sú dôležitým prameňom o jej vzdelávaní.",source:reference.letters},
      {category:"JAZYK ADA",q:"Aký vzťah má Ada Lovelace k programovaciemu jazyku Ada?",options:["Napísala jeho kompilátor","Používala ho v roku 1843","Jazyk bol pomenovaný na jej počesť","Je to jej tajný pseudonym"],correct:2,why:"Jazyk vznikol až v 20. storočí a prvý štandard vyšiel v roku 1983. Ada Lovelace ho nevytvorila; nesie jej meno.",source:'/jazyk-ada/'},
      {category:"SKUTOČNOSŤ ČI RECESIA",q:"Ktorý z týchto projektov je na našom webe úplne vymyslený?",options:['TeaScript',"Poznámky A – G","Postup pre Bernoulliho čísla","Skúmanie lietania"],correct:0,why:"TeaScript je náš fiktívny čajový jazyk. Skutočný programovací jazyk Ada nájdete na samostatnej podstránke.",source:'/portfolio/'},
      {category:"DEJINY BEZ SKRATIEK",q:"Ktoré tvrdenie o Ade je najpresnejšie?",options:["Vynašla všetky počítače sama","Bola priekopníčkou; presné označenie „prvá“ potrebuje kontext","Napísala prvú mobilnú aplikáciu","Založila prvý cloud v Londýne"],correct:1,why:"Je často označovaná za prvú programátorku najmä pre publikovaný postup z roku 1843. Babbage mal aj skoršie nepublikované postupy; jej odkaz zahŕňa tiež širšiu víziu výpočtových strojov.",source:reference.museum}
    ];
    let index = 0;
    let responses = [];
    let locked = false;
    const score = () => responses.filter((answer,i) => answer === questions[i].correct).length;
    const createSource = url => {
      const link = document.createElement('a');
      link.href = url;
      link.textContent = " Overiť zdroj ↗";
      if (url.startsWith('https:')) {link.target='_blank';link.rel='noopener noreferrer';}
      return link;
    };
    function renderQuestion(focus = false) {
      locked = false;
      const q = questions[index];
      find('#vq-position').textContent = `OTÁZKA ${String(index+1).padStart(2,'0')} / ${questions.length}`;
      find('#vq-score').textContent = `SKÓRE ${score()}`;
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
          find('#vq-score').textContent = `SKÓRE ${score()}`;
          find('#vq-progress').style.width = `${(index+1)/questions.length*100}%`;
          const title = document.createElement('strong');
          title.textContent = correct?"Správne. Sušienka pre vás!":"Tentoraz vás história nachytala.";
          const explanation = document.createElement('p');
          explanation.textContent = (correct?'':`Správna odpoveď: ${q.options[q.correct]}. `)+q.why;
          explanation.append(createSource(q.source));
          find('#vq-feedback').append(title,explanation);
          find('#vq-feedback').classList.add(correct?'positive':'negative');
          find('#vq-next').textContent = index===questions.length-1?"Ukázať výsledok →":"Ďalšia otázka →";
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
      find('#vq-position').textContent="SKÚŠKA UKONČENÁ";
      find('#vq-result-number').textContent=`${total} / ${questions.length}`;
      find('#vq-result-title').textContent=total>=10?"Čestný doktorát zo salónu.":total>=7?"Váš algoritmus na históriu funguje.":total>=4?"Dobrý základ. Teraz doplniť poznámky.":"Odporúčame druhú šálku histórie.";
      find('#vq-result-text').textContent=`Správne ste odpovedali na ${total} z ${questions.length} otázok (${Math.round(total/questions.length*100)} %). ${total===12?"Bezchybný výkon. Aj kompilátor uznanlivo mlčí.":"Pozrite si prehľad, objavte zdroje a pokojne si zahrajte znova."}`;
      find('#vq-review').replaceChildren();
      questions.forEach((q,i)=>{
        const row=document.createElement('li');
        const title=document.createElement('strong');title.textContent=q.q;
        const answer=document.createElement('p');answer.textContent=`${responses[i]===q.correct?'✓':'✕'} Vaša odpoveď: ${q.options[responses[i]]}`;
        const solution=document.createElement('p');solution.textContent=`Správne: ${q.options[q.correct]}. ${q.why}`;solution.append(createSource(q.source));
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
      title:"Programátorka & analytička",
      pitch:"Zložité zadania mením na presné kroky. Dokumentujem aj to, čo ešte nikto nepostavil. Hľadám tím, ktorý považuje zvedavosť za kvalifikáciu.",
      skills:["Algoritmické myslenie a schopnosť rozdeliť problém na kroky.","Technická dokumentácia, ktorú sa oplatí čítať.","Spájanie matematiky, tvorivosti a praktických otázok.","Trpezlivosť s hardvérom. Historicky overená."],
      jobTitle:"Algorithm Designer · imaginárny tím Analytical Engine",
      job:"Navrhla som postup, opísala predpoklady a vysvetlila jeho možnosti. Dnes by som k tomu pridala testy a trvala na zrozumiteľnom code review.",
      sideTitle:"TeaScript · hlavná architektka kanvice",
      side:"Prototyp jazyka, ktorého build pipeline sa končí šálkou čaju. Dosiahnutý výsledok: tím je hydratovaný a dokumentácia vonia po bergamote.",
      method:"Najprv pochopím problém. Potom navrhnem postup, overím predpoklady a až následne otvorím editor. „U mňa to funguje“ považujem za začiatok diskusie.",
      conditions:"Zmysluplný problém, priestor na premýšľanie a počítač, ktorý už existuje.",
      letter:"Vážený tím, vo vašom inzeráte žiadate tri roky praxe s nástrojom, ktorý existuje dva roky. Myslím, že si budeme rozumieť. Ja som pracovala na programe skôr, než bol hotový počítač."
    },
    vibe: {
      title:"Vibe coderka & poetická prototypárka",
      pitch:"Z neurčitého „nech to má iskru“ spravím prototyp a potom sa opýtam, čo má vlastne robiť. AI beriem ako pomocníka. Zodpovednosť za výsledok si nechávam.",
      skills:["Preklad hmlistého nápadu do zrozumiteľného zadania.","Rýchle prototypovanie s AI, čajom a kritickým myslením.","Kontrola vygenerovaného kódu a overovanie správania.","Schopnosť povedať „pekné, ale toto ešte nefunguje“."],
      jobTitle:"Prompt-to-Prototype Lead · fiktívne štúdio Poetical Science",
      job:"V tejto alternatívnej súčasnosti by som s AI skúšala nápady, spresňovala zadanie a kontrolovala, či výsledok robí to, čo sľubuje. Prompt „nejako to oprav“ by som vracala na dopracovanie.",
      sideTitle:"Parný cloud · prototyp na hranici kondenzácie",
      side:"Navrhla som fiktívny cloud s pôsobivou prezentáciou a otáznikom pri fyzike. Po prvom daždi sme objavili potrebu záloh. MVP získalo vlastný dáždnik.",
      method:"Najprv pomenujem cieľ. Potom zadávam, skúšam, čítam a opravujem. Kód od AI nenasadzujem iba preto, že mi odpovedala veľmi zdvorilo.",
      conditions:"AI asistent, dobré zadanie, čas na testovanie a zákaz meetingov počas lúhovania.",
      letter:"Vážený tím, váš produkt potrebuje víziu, prototyp a niekoho, kto overí, či tlačidlo naozaj funguje. Ponúkam všetky tri veci. Na otázku „koľko promptov denne?“ odpovedám: radšej správny problém než veľa promptov."
    }
  };
  if(find('#cv-sheet')) {
    all('[data-cv-role]').forEach(button=>button.addEventListener('click',()=>{
      const role=cvRoles[button.dataset.cvRole];
      all('[data-cv-role]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
      const fields={'cv-role-title':'title','cv-pitch':'pitch','cv-job-title':'jobTitle','cv-job-description':'job','cv-side-title':'sideTitle','cv-side-description':'side','cv-method':'method','cv-conditions':'conditions','cv-letter':'letter'};
      for(const [id,key] of Object.entries(fields)) find('#'+id).textContent=role[key];
      find('#cv-skills').replaceChildren(...role.skills.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
      find('#cv-announcement').textContent="Životopis aktualizovaný: "+role.title+'.';
    }));
    find('#print-cv').addEventListener('click',()=>window.print());
  }
  if(find('#ada-example')) {
    const examples={
      hello:{file:'hello.adb',code:'with Ada.Text_IO; use Ada.Text_IO;\n\nprocedure Hello is\nbegin\n   Put_Line ("Hello, salon!");\nend Hello;',output:'Hello, salon!',explanation:"Put_Line vypíše text a ukončí riadok. Procedúra Hello je vstupným bodom tejto ukážky."},
      loop:{file:'caj.adb',code:'with Ada.Text_IO; use Ada.Text_IO;\n\nprocedure Caj is\nbegin\n   for I in 1 .. 3 loop\n      Put_Line ("Salka" & Integer\'Image (I));\n   end loop;\nend Caj;',output:'Salka 1\nSalka 2\nSalka 3',explanation:"Cyklus prejde hodnoty 1 až 3 vrátane. Integer'Image prevedie číslo na text; pri kladnom čísle obsahuje aj úvodnú medzeru."},
      type:{file:'kanvica.adb',code:'with Ada.Text_IO; use Ada.Text_IO;\n\nprocedure Kanvica is\n   subtype Teplota is Integer range 0 .. 100;\n   Voda : Teplota := 95;\nbegin\n   Put_Line ("Teplota:" & Integer\'Image (Voda));\nend Kanvica;',output:'Teplota: 95',explanation:"Podtyp Teplota obmedzuje povolené celé čísla na rozsah 0 až 100. Hodnota 95 do rozsahu patrí. Symbol := znamená priradenie."}
    };
    find('#ada-example').addEventListener('change',()=>{
      const example=examples[find('#ada-example').value];
      find('#ada-code').textContent=example.code;
      find('#ada-filename').textContent=example.file;
      find('#ada-explanation').textContent=example.explanation;
      find('#ada-output').textContent="Vyberte „Ukázať očakávaný výstup“.";
      find('#ada-copy').textContent="Kopírovať kód";
    });
    find('#ada-show-output').addEventListener('click',()=>{find('#ada-output').textContent=examples[find('#ada-example').value].output;});
    find('#ada-copy').addEventListener('click',async()=>{
      try {await navigator.clipboard.writeText(examples[find('#ada-example').value].code);find('#ada-copy').textContent="Kód skopírovaný ✓";find('#page-toast').textContent="Kód bol skopírovaný do schránky.";}
      catch {find('#ada-copy').textContent="Označte a skopírujte kód ručne";const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(find('#ada-code'));selection.removeAllRanges();selection.addRange(range);}
    });
  }
})();
