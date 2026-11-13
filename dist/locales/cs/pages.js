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
      {category:"ŽIVOT",q:"Ve kterém roce se Ada Lovelace narodila?",options:['1815','1843','1915',"Když se načetla první webová stránka"],correct:0,why:"Narodila se 10. prosince 1815 v Londýně. Rok 1843 patří jejím slavným poznámkám.",source:reference.biography},
      {category:"RODINA",q:"Kdo byl Adin otec?",options:['Charles Babbage',"Básník Lord Byron",'Augustus De Morgan',"Zakladatel Parního cloudu"],correct:1,why:"Jejím otcem byl básník Lord Byron. Babbage byl jejím pozdějším spolupracovníkem.",source:reference.biography},
      {category:"SPOLUPRÁCE",q:"Se kterým vynálezcem se pojí její práce na analytickém stroji?",options:['Thomas Edison','Nikola Tesla','Charles Babbage',"Komorník s certifikátem DevOps"],correct:2,why:"Charles Babbage navrhoval analytický stroj. Ada vysvětlovala jeho možnosti a popsala výpočetní postup.",source:reference.museum},
      {category:"ALGORITMY",q:"Co počítal postup popsaný v poznámce G?",options:["Optimální teplotu čaje","Počet klobouků na plese","Pravděpodobnost pádu Wi-Fi","Bernoulliho čísla"],correct:3,why:"Poznámka G popisuje postup pro Bernoulliho čísla. Název Bernoulli.exe na našem webu je moderní žert.",source:reference.notes},
      {category:"JAZYKY",q:"Z jakého jazyka Ada přeložila Menabreův článek?",options:["Z francouzštiny","Z Pythonu","Z italštiny","Z Morseovy abecedy"],correct:0,why:"Článek vyšel ve francouzštině v roce 1842. Anglický překlad s Adinými poznámkami byl publikován v roce 1843.",source:reference.notes},
      {category:"HARDWARE",q:"Jaký byl osud analytického stroje během Adina života?",options:["Prodával se jako notebook","Nebyl dokončen","Běžel v každé čajovně","Zapomněli mu heslo"],correct:1,why:"Analytický stroj za jejího života dokončen nebyl. Proto na něm svůj publikovaný postup nemohla spustit.",source:reference.museum},
      {category:"PŘEDSTAVIVOST",q:"O jaké možnosti stroje Ada uvažovala kromě počítání?",options:["O vyřizování víz","O automatickém vaření čaje","O práci s hudbou","O prodeji předplatného"],correct:2,why:"Uvažovala o manipulaci s jinými symboly než čísly a uvedla i možnost práce s hudbou. Neznamená to, že vytvořila hudební aplikaci.",source:reference.notes},
      {category:"DĚTSKÉ NÁPADY",q:"S čím souvisel mladický projekt Flyology?",options:["S kompilátory","S létáním a křídly","S taxonomií počítačových chyb","S marketingem aerolinek"],correct:1,why:"Ve dvanácti se zajímala o létání, křídla a materiály. Projekt nebyl hotovým funkčním letadlem.",source:reference.biography},
      {category:"VZDĚLÁVÁNÍ",q:"S kým Ada korespondenčně studovala pokročilou matematiku?",options:["S Lordem Byronem","S Isaacem Newtonem","S chatbotem ČajGPT","S Augustem De Morganem"],correct:3,why:"Její matematické dopisy s Augustem De Morganem z let 1840 - 1841 jsou důležitým pramenem o jejím vzdělávání.",source:reference.letters},
      {category:"JAZYK ADA",q:"Jaký vztah má Ada Lovelace k programovacímu jazyku Ada?",options:["Napsala jeho kompilátor","Používala ho v roce 1843","Jazyk byl pojmenován na její počest","Je to její tajný pseudonym"],correct:2,why:"Jazyk vznikl až ve 20. století a první standard vyšel v roce 1983. Ada Lovelace ho nevytvořila; nese její jméno.",source:'/cs/jazyk-ada/'},
      {category:"SKUTEČNOST, NEBO RECESE",q:"Který z těchto projektů je na našem webu zcela vymyšlený?",options:['TeaScript',"Poznámky A - G","Postup pro Bernoulliho čísla","Zkoumání létání"],correct:0,why:"TeaScript je náš fiktivní čajový jazyk. Skutečný programovací jazyk Ada najdete na samostatné podstránce.",source:'/cs/portfolio/'},
      {category:"DĚJINY BEZ ZKRATEK",q:"Které tvrzení o Adě je nejpřesnější?",options:["Vynalezla všechny počítače sama","Byla průkopnicí; přesné označení „první“ potřebuje kontext","Napsala první mobilní aplikaci","Založila první cloud v Londýně"],correct:1,why:"Často je označována za první programátorku zejména kvůli publikovanému postupu z roku 1843. Babbage měl i starší nepublikované postupy; její odkaz zahrnuje také širší vizi výpočetních strojů.",source:reference.museum}
    ];
    let index = 0;
    let responses = [];
    let locked = false;
    const score = () => responses.filter((answer,i) => answer === questions[i].correct).length;
    const createSource = url => {
      const link = document.createElement('a');
      link.href = url;
      link.textContent = " Ověřit zdroj ↗";
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
          title.textContent = correct?"Správně. Sušenka pro vás!":"Tentokrát vás historie nachytala.";
          const explanation = document.createElement('p');
          explanation.textContent = (correct?'':`Správná odpověď: ${q.options[q.correct]}. `)+q.why;
          explanation.append(createSource(q.source));
          find('#vq-feedback').append(title,explanation);
          find('#vq-feedback').classList.add(correct?'positive':'negative');
          find('#vq-next').textContent = index===questions.length-1?"Ukázat výsledek →":"Další otázka →";
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
      find('#vq-position').textContent="ZKOUŠKA UKONČENA";
      find('#vq-result-number').textContent=`${total} / ${questions.length}`;
      find('#vq-result-title').textContent=total>=10?"Čestný doktorát ze salonu.":total>=7?"Váš algoritmus na historii funguje.":total>=4?"Dobrý základ. Teď doplnit poznámky.":"Doporučujeme druhý šálek historie.";
      find('#vq-result-text').textContent=`Správně jste odpověděli na ${total} z ${questions.length} otázek (${Math.round(total/questions.length*100)} %). ${total===12?"Bezchybný výkon. I kompilátor uznale mlčí.":"Prohlédněte si přehled, objevte zdroje a klidně si zahrajte znovu."}`;
      find('#vq-review').replaceChildren();
      questions.forEach((q,i)=>{
        const row=document.createElement('li');
        const title=document.createElement('strong');title.textContent=q.q;
        const answer=document.createElement('p');answer.textContent=`${responses[i]===q.correct?'✓':'✕'} Vaše odpověď: ${q.options[responses[i]]}`;
        const solution=document.createElement('p');solution.textContent=`Správně: ${q.options[q.correct]}. ${q.why}`;solution.append(createSource(q.source));
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
      pitch:"Složitá zadání měním na přesné kroky. Dokumentuji i to, co ještě nikdo nepostavil. Hledám tým, který považuje zvědavost za kvalifikaci.",
      skills:["Algoritmické myšlení a schopnost rozdělit problém na kroky.","Technická dokumentace, kterou stojí za to číst.","Propojování matematiky, tvořivosti a praktických otázek.","Trpělivost s hardwarem. Historicky ověřená."],
      jobTitle:"Algorithm Designer · imaginární tým Analytical Engine",
      job:"Navrhla jsem postup, popsala předpoklady a vysvětlila jeho možnosti. Dnes bych k tomu přidala testy a trvala na srozumitelném code review.",
      sideTitle:"TeaScript · hlavní architektka konvice",
      side:"Prototyp jazyka, jehož build pipeline končí šálkem čaje. Dosažený výsledek: tým je hydratovaný a dokumentace voní po bergamotu.",
      method:"Nejdřív pochopím problém. Pak navrhnu postup, ověřím předpoklady a teprve potom otevřu editor. „U mě to funguje“ považuji za začátek diskuse.",
      conditions:"Smysluplný problém, prostor na přemýšlení a počítač, který už existuje.",
      letter:"Vážený týme, ve vašem inzerátu požadujete tři roky praxe s nástrojem, který existuje dva roky. Myslím, že si budeme rozumět. Já jsem pracovala na programu dřív, než byl hotový počítač."
    },
    vibe: {
      title:"Vibe coderka & poetická prototypářka",
      pitch:"Z neurčitého „ať to má jiskru“ udělám prototyp a potom se zeptám, co má vlastně dělat. AI beru jako pomocníka. Odpovědnost za výsledek si nechávám.",
      skills:["Překlad mlhavého nápadu do srozumitelného zadání.","Rychlé prototypování s AI, čajem a kritickým myšlením.","Kontrola vygenerovaného kódu a ověřování chování.","Schopnost říct „pěkné, ale tohle ještě nefunguje“."],
      jobTitle:"Prompt-to-Prototype Lead · fiktivní studio Poetical Science",
      job:"V této alternativní současnosti bych s AI zkoušela nápady, zpřesňovala zadání a kontrolovala, zda výsledek dělá to, co slibuje. Prompt „nějak to oprav“ bych vracela k dopracování.",
      sideTitle:"Parní cloud · prototyp na hranici kondenzace",
      side:"Navrhla jsem fiktivní cloud s působivou prezentací a otazníkem u fyziky. Po prvním dešti jsme objevili potřebu záloh. MVP získalo vlastní deštník.",
      method:"Nejdřív pojmenuji cíl. Potom zadávám, zkouším, čtu a opravuji. Kód od AI nenasazuji jen proto, že mi odpověděla velmi zdvořile.",
      conditions:"AI asistent, dobré zadání, čas na testování a zákaz meetingů během louhování.",
      letter:"Vážený týme, váš produkt potřebuje vizi, prototyp a někoho, kdo ověří, zda tlačítko opravdu funguje. Nabízím všechny tři věci. Na otázku „kolik promptů denně?“ odpovídám: raději správný problém než hodně promptů."
    }
  };
  if(find('#cv-sheet')) {
    all('[data-cv-role]').forEach(button=>button.addEventListener('click',()=>{
      const role=cvRoles[button.dataset.cvRole];
      all('[data-cv-role]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
      const fields={'cv-role-title':'title','cv-pitch':'pitch','cv-job-title':'jobTitle','cv-job-description':'job','cv-side-title':'sideTitle','cv-side-description':'side','cv-method':'method','cv-conditions':'conditions','cv-letter':'letter'};
      for(const [id,key] of Object.entries(fields)) find('#'+id).textContent=role[key];
      find('#cv-skills').replaceChildren(...role.skills.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
      find('#cv-announcement').textContent="Životopis aktualizován: "+role.title+'.';
    }));
    find('#print-cv').addEventListener('click',()=>window.print());
  }
  if(find('#ada-example')) {
    const examples={
      hello:{file:'hello.adb',code:'with Ada.Text_IO; use Ada.Text_IO;\n\nprocedure Hello is\nbegin\n   Put_Line ("Hello, salon!");\nend Hello;',output:'Hello, salon!',explanation:"Put_Line vypíše text a ukončí řádek. Procedura Hello je vstupním bodem této ukázky."},
      loop:{file:'caj.adb',code:'with Ada.Text_IO; use Ada.Text_IO;\n\nprocedure Caj is\nbegin\n   for I in 1 .. 3 loop\n      Put_Line ("Salka" & Integer\'Image (I));\n   end loop;\nend Caj;',output:'Salka 1\nSalka 2\nSalka 3',explanation:"Cyklus projde hodnoty 1 až 3 včetně. Integer'Image převede číslo na text; u kladného čísla obsahuje také úvodní mezeru."},
      type:{file:'kanvica.adb',code:'with Ada.Text_IO; use Ada.Text_IO;\n\nprocedure Kanvica is\n   subtype Teplota is Integer range 0 .. 100;\n   Voda : Teplota := 95;\nbegin\n   Put_Line ("Teplota:" & Integer\'Image (Voda));\nend Kanvica;',output:'Teplota: 95',explanation:"Podtyp Teplota omezuje povolená celá čísla na rozsah 0 až 100. Hodnota 95 do rozsahu patří. Symbol := znamená přiřazení."}
    };
    find('#ada-example').addEventListener('change',()=>{
      const example=examples[find('#ada-example').value];
      find('#ada-code').textContent=example.code;
      find('#ada-filename').textContent=example.file;
      find('#ada-explanation').textContent=example.explanation;
      find('#ada-output').textContent="Vyberte „Ukázat očekávaný výstup“.";
      find('#ada-copy').textContent="Kopírovat kód";
    });
    find('#ada-show-output').addEventListener('click',()=>{find('#ada-output').textContent=examples[find('#ada-example').value].output;});
    find('#ada-copy').addEventListener('click',async()=>{
      try {await navigator.clipboard.writeText(examples[find('#ada-example').value].code);find('#ada-copy').textContent="Kód zkopírován ✓";find('#page-toast').textContent="Kód byl zkopírován do schránky.";}
      catch {find('#ada-copy').textContent="Označte a zkopírujte kód ručně";const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(find('#ada-code'));selection.removeAllRanges();selection.addRange(range);}
    });
  }
})();
