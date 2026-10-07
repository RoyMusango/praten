// Points de grammaire (débutant A0-A2) : fiche en français, exercices, phrases à dire à voix haute.
// Exercice : { q, a: [réponses acceptées], opts?: [choix], expl? }  ·  gen : exercices générés (présent)
(function (global) {
  const T = {};

  T.zijn_hebben = {
    label: 'Être et avoir : zijn, hebben', level: 'A0',
    fiche: `
<table><tr><th></th><th>zijn (être)</th><th>hebben (avoir)</th></tr>
<tr><td>ik</td><td>ben</td><td>heb</td></tr>
<tr><td>jij / je</td><td>bent</td><td>hebt</td></tr>
<tr><td>u (vous de politesse)</td><td>bent</td><td>hebt / heeft</td></tr>
<tr><td>hij / zij / het</td><td>is</td><td>heeft</td></tr>
<tr><td>wij / we</td><td>zijn</td><td>hebben</td></tr>
<tr><td>jullie</td><td>zijn</td><td>hebben</td></tr>
<tr><td>zij / ze (ils)</td><td>zijn</td><td>hebben</td></tr></table>
<p>Âge et faim se disent comme en français avec <b>zijn</b> pour l’âge : <i>Ik <b>ben</b> 22 jaar</i> (j’<b>ai</b> 22 ans !). Mais <i>Ik <b>heb</b> honger</i> (j’ai faim).</p>`,
    bank: [
      { q: 'Ik ___ student.', a: ['ben'], opts: ['ben', 'is', 'heb'] },
      { q: 'Hij ___ uit België.', a: ['is'], opts: ['ben', 'is', 'zijn'] },
      { q: 'Wij ___ een vraag.', a: ['hebben'], opts: ['heeft', 'hebben', 'zijn'] },
      { q: 'Jij ___ moe.', a: ['bent'], opts: ['ben', 'bent', 'is'] },
      { q: 'Zij (elle) ___ een fiets.', a: ['heeft'], opts: ['hebt', 'heeft', 'hebben'] },
      { q: 'Ik ___ 22 jaar. (âge)', a: ['ben'], opts: ['ben', 'heb'], expl: 'L’âge se dit avec « zijn » : ik ben 22 jaar.' },
      { q: 'Jullie ___ in Gent.', a: ['zijn'], opts: ['is', 'zijn', 'bent'] },
      { q: 'Ik ___ honger.', a: ['heb'], opts: ['ben', 'heb'] },
    ],
    speak: ['Stel jezelf voor: wie ben je, hoe oud ben je, wat heb je?', 'Hoe heet je en waar kom je vandaan?'],
  };

  T.presens = {
    label: 'Le présent (presens)', level: 'A1',
    gen: { tenses: ['presens'] },
    fiche: `
<p>On part du <b>radical</b> = forme de <b>ik</b> : <i>werken → ik werk</i>.</p>
<table><tr><td>ik</td><td>radical</td><td>ik <b>werk</b></td></tr>
<tr><td>jij, u, hij, zij, het</td><td>radical + <b>t</b></td><td>jij <b>werkt</b>, hij <b>werkt</b></td></tr>
<tr><td>wij, jullie, zij (pl.)</td><td>infinitif</td><td>wij <b>werken</b></td></tr></table>
<p><b>Orthographe du radical</b> (le piège) :</p>
<ul><li>voyelle longue qui se retrouve seule : on la double. <i>maken → ik <b>maak</b></i>, <i>lezen → ik <b>lees</b></i></li>
<li>consonne doublée : on n’en garde qu’une. <i>zitten → ik <b>zit</b></i>, <i>bellen → ik <b>bel</b></i></li>
<li>jamais de v ou z à la fin : <i>leven → ik <b>leef</b></i>, <i>reizen → ik <b>reis</b></i></li>
<li>radical en -t : pas de t en plus. <i>zitten → hij <b>zit</b></i></li></ul>`,
    bank: [
      { q: 'Ik ___ in Brussel. (werken)', a: ['werk'] },
      { q: 'Jij ___ Nederlands. (leren)', a: ['leert'] },
      { q: 'Wij ___ koffie. (drinken)', a: ['drinken'] },
      { q: 'Ik ___ een boek. (lezen)', a: ['lees'] },
      { q: 'Hij ___ op een terras. (zitten)', a: ['zit'] },
      { q: 'Ik ___ in Leuven. (wonen)', a: ['woon'] },
      { q: 'Zij (elle) ___ naar Spanje. (reizen)', a: ['reist'] },
    ],
    speak: ['Vertel over je dag: wat doe je normaal?', 'Wat doe je in het weekend?'],
  };

  T.vragen = {
    label: 'Poser une question', level: 'A1',
    fiche: `
<p><b>Question fermée</b> : le verbe passe en premier. <i>Jij werkt. → <b>Werk jij</b>?</i></p>
<p>Attention : avec <b>jij / je</b> derrière le verbe, le <b>-t disparaît</b> : <i><b>Werk</b> jij? <b>Woon</b> je hier? <b>Ben</b> je moe?</i> Avec u, hij, zij, il reste : <i>Werk<b>t</b> u? Werk<b>t</b> hij?</i></p>
<p><b>Mots interrogatifs</b> + verbe + sujet :</p>
<ul><li><b>Wie</b> (qui) · <b>Wat</b> (quoi) · <b>Waar</b> (où) · <b>Wanneer</b> (quand)</li>
<li><b>Hoe</b> (comment) · <b>Waarom</b> (pourquoi) · <b>Hoeveel</b> (combien) · <b>Welke / Welk</b> (quel)</li></ul>
<p><i><b>Waar woon</b> je? <b>Hoe heet</b> je? <b>Wat doe</b> je? <b>Hoeveel kost</b> het?</i></p>`,
    bank: [
      { q: '___ heet je? (comment)', a: ['hoe'] },
      { q: '___ woon je? (où)', a: ['waar'] },
      { q: '___ kost het? (combien)', a: ['hoeveel'] },
      { q: '___ is dat? (qui)', a: ['wie'] },
      { q: '___ doe je vanavond? (quoi)', a: ['wat'] },
      { q: '___ begint de les? (quand)', a: ['wanneer', 'hoe laat'] },
      { q: 'Question : « jij werkt » → ___ jij?', a: ['werk'], opts: ['werk', 'werkt'] },
      { q: 'Question : « u spreekt Frans » → ___ u Frans?', a: ['spreekt'], opts: ['spreek', 'spreekt'] },
      { q: 'Question : « je bent moe » → ___ je moe?', a: ['ben'], opts: ['ben', 'bent'] },
    ],
    speak: ['Stel vijf vragen aan een nieuwe collega.', 'Vraag de weg naar het station.'],
  };

  T.de_het = {
    label: 'Les articles : de, het, een', level: 'A1',
    fiche: `
<p>Deux articles définis : <b>de</b> (environ 2/3 des noms) et <b>het</b>. Un seul indéfini : <b>een</b>.</p>
<ul><li>Au <b>pluriel</b>, toujours <b>de</b> : <i>het huis → de huizen</i>.</li>
<li>Les <b>diminutifs</b> en -je sont toujours <b>het</b> : <i>het broodje, het kaartje, het pintje</i>.</li>
<li>Les infinitifs utilisés comme noms : <b>het</b> (<i>het eten</i>).</li>
<li>Les personnes, la plupart des fruits, arbres, chiffres : <b>de</b>.</li></ul>
<p>Le plus simple : apprendre chaque nom avec son article, comme en français avec le genre. Les cartes de vocabulaire te les donnent toujours.</p>`,
    bank: [
      { q: '___ huis is groot.', a: ['het'], opts: ['de', 'het'] },
      { q: '___ trein is laat.', a: ['de'], opts: ['de', 'het'] },
      { q: '___ broodje is lekker. (diminutif)', a: ['het'], opts: ['de', 'het'] },
      { q: '___ huizen zijn oud. (pluriel)', a: ['de'], opts: ['de', 'het'] },
      { q: '___ station is dichtbij.', a: ['het'], opts: ['de', 'het'] },
      { q: '___ koffie is warm.', a: ['de'], opts: ['de', 'het'] },
      { q: 'Ik heb ___ fiets. (un)', a: ['een'], opts: ['de', 'het', 'een'] },
      { q: '___ bier is koud.', a: ['het'], opts: ['de', 'het'] },
    ],
    speak: ['Beschrijf je kamer: wat zie je?'],
  };

  T.woordvolgorde = {
    label: 'L’ordre des mots', level: 'A1-A2',
    fiche: `
<p><b>Règle d’or</b> : dans une phrase principale, le verbe conjugué est toujours en <b>2e position</b>.</p>
<p><i>Ik <b>ga</b> morgen naar Gent.</i> → si on commence par <i>morgen</i>, le sujet passe <b>après</b> le verbe : <i>Morgen <b>ga</b> ik naar Gent.</i></p>
<p>Avec un <b>deuxième verbe</b> (infinitif ou participe), celui-ci part à la <b>fin</b> :</p>
<ul><li><i>Ik <b>wil</b> een koffie <b>drinken</b>.</i></li>
<li><i>Ik <b>ga</b> morgen <b>werken</b>.</i> (futur proche)</li>
<li><i>Ik <b>heb</b> gisteren <b>gewerkt</b>.</i></li></ul>
<p>Après <b>omdat</b> (parce que), <b>dat</b> (que), <b>als</b> (si, quand) : <b>tous</b> les verbes à la fin. <i>…omdat ik Nederlands <b>leer</b>.</i></p>`,
    bank: [
      { q: 'Morgen ___ ik naar Gent. (gaan)', a: ['ga'] },
      { q: 'Ik wil een koffie ___. (drinken)', a: ['drinken'] },
      { q: 'Vandaag ___ ik thuis. (werken)', a: ['werk'] },
      { q: 'Choisis l’ordre correct :', a: ['Morgen ga ik naar Brussel.'], opts: ['Morgen ik ga naar Brussel.', 'Morgen ga ik naar Brussel.'] },
      { q: 'Choisis l’ordre correct :', a: ['Ik leer Nederlands omdat ik in Gent woon.'], opts: ['Ik leer Nederlands omdat ik woon in Gent.', 'Ik leer Nederlands omdat ik in Gent woon.'] },
      { q: 'Choisis l’ordre correct :', a: ['Ik ga morgen voetbal kijken.'], opts: ['Ik ga kijken morgen voetbal.', 'Ik ga morgen voetbal kijken.'] },
      { q: 'Om negen uur ___ de les. (beginnen)', a: ['begint'] },
    ],
    speak: ['Wat ga je morgen doen? Begin je zin met « Morgen… ».'],
  };

  T.negatie = {
    label: 'La négation : niet ou geen', level: 'A1',
    fiche: `
<p><b>geen</b> = « pas de » devant un nom sans article défini (un nom avec <i>een</i> ou sans article) :</p>
<p><i>Ik heb <b>een</b> auto → Ik heb <b>geen</b> auto. Ik drink koffie → Ik drink <b>geen</b> koffie.</i></p>
<p><b>niet</b> dans tous les autres cas (verbe, adjectif, nom avec de/het, nom propre) :</p>
<p><i>Ik werk <b>niet</b>. Het is <b>niet</b> duur. Ik zie de trein <b>niet</b>.</i></p>
<p>Place de <i>niet</i> : en général en fin de phrase, mais <b>avant</b> un adjectif, un lieu ou un 2e verbe : <i>Ik ga <b>niet</b> naar Gent. Ik kan <b>niet</b> komen.</i></p>`,
    bank: [
      { q: 'Ik heb ___ tijd.', a: ['geen'], opts: ['niet', 'geen'] },
      { q: 'Ik werk vandaag ___.', a: ['niet'], opts: ['niet', 'geen'] },
      { q: 'Het is ___ duur.', a: ['niet'], opts: ['niet', 'geen'] },
      { q: 'Ik drink ___ bier.', a: ['geen'], opts: ['niet', 'geen'] },
      { q: 'Hij heeft ___ auto.', a: ['geen'], opts: ['niet', 'geen'] },
      { q: 'Ik begrijp het ___.', a: ['niet'], opts: ['niet', 'geen'] },
      { q: 'Wij spreken ___ Duits.', a: ['geen'], opts: ['niet', 'geen'], expl: 'Une langue sans article : geen. (« niet » est aussi entendu à l’oral.)' },
    ],
    speak: ['Wat doe je niet graag? Wat heb je niet?'],
  };

  T.meervoud = {
    label: 'Le pluriel', level: 'A1',
    fiche: `
<p>Deux terminaisons :</p>
<ul><li><b>-en</b> (la plupart) : <i>de boek → de boek<b>en</b></i>, <i>de les → de less<b>en</b></i> (on double la consonne après voyelle courte), <i>de straat → de strat<b>en</b></i> (voyelle longue : on la simplifie).</li>
<li><b>-s</b> : mots en -el, -em, -en, -er, -je, et beaucoup de mots étrangers : <i>de tafel<b>s</b>, de broodje<b>s</b>, de computer<b>s</b>, de collega’<b>s</b></i>.</li></ul>
<p>Irréguliers fréquents : <i>het kind → de kinder<b>en</b>, de stad → de steden</i>.</p>`,
    bank: [
      { q: 'het boek → de ___', a: ['boeken'] },
      { q: 'de tafel → de ___', a: ['tafels'] },
      { q: 'het broodje → de ___', a: ['broodjes'] },
      { q: 'de les → de ___', a: ['lessen'] },
      { q: 'de straat → de ___', a: ['straten'] },
      { q: 'het kind → de ___', a: ['kinderen'] },
      { q: 'de computer → de ___', a: ['computers'] },
    ],
  };

  T.bijvoeglijk = {
    label: 'L’adjectif : groot ou grote ?', level: 'A2',
    fiche: `
<p>Après le nom (avec <i>zijn</i>), l’adjectif ne change pas : <i>Het huis is <b>groot</b>.</i></p>
<p>Devant le nom, on ajoute <b>-e</b>… sauf dans un cas :</p>
<table><tr><td><b>de</b> grote man</td><td><b>een</b> grote man</td></tr>
<tr><td><b>het</b> grote huis</td><td><b>een groot huis</b> (pas de -e !)</td></tr>
<tr><td><b>de</b> grote huizen</td><td>grote huizen</td></tr></table>
<p>Seule exception : <b>een + nom en het</b> (singulier) → pas de -e.</p>`,
    bank: [
      { q: 'de ___ stad (groot)', a: ['grote'] },
      { q: 'een ___ huis (groot)', a: ['groot'] },
      { q: 'het ___ station (nieuw)', a: ['nieuwe'] },
      { q: 'een ___ fiets (nieuw)', a: ['nieuwe'] },
      { q: 'een ___ bier (koud)', a: ['koud'] },
      { q: 'De koffie is ___. (lekker)', a: ['lekker'] },
      { q: 'de ___ collega’s (leuk)', a: ['leuke'] },
    ],
  };

  T.perfectum = {
    label: 'Le passé composé (perfectum)', level: 'A2',
    fiche: `
<p><b>hebben</b> ou <b>zijn</b> + <b>participe</b> à la fin de la phrase : <i>Ik <b>heb</b> gisteren <b>gewerkt</b>.</i></p>
<p><b>Verbes réguliers</b> : ge + radical + <b>t</b> ou <b>d</b>. Règle du <b>’t kofschip</b> : si le radical finit par t, k, f, s, ch ou p → <b>-t</b> (<i>gewerkt, gefietst</i>) ; sinon <b>-d</b> (<i>gewoond, gespeeld, geleefd</i>).</p>
<p>Pas de <b>ge-</b> si le verbe commence par <i>be-, ge-, ver-, ont-, her-, er-</i> : <i>betaald, verteld, besteld, gebruikt</i>.</p>
<p><b>zijn</b> pour les déplacements vers un but et les changements : <i>Ik <b>ben</b> naar Gent <b>gegaan</b>. Hij <b>is</b> vroeg <b>opgestaan</b>.</i></p>
<p>Irréguliers à connaître : <i>gegaan, gekomen, gedaan, gegeten, gedronken, gezien, gelezen, geschreven, gesproken, genomen, gekocht, gedacht, gevonden, geweest, gehad</i>.</p>`,
    bank: [
      { q: 'Ik heb gisteren ___. (werken)', a: ['gewerkt'] },
      { q: 'Wij hebben in Leuven ___. (wonen)', a: ['gewoond'] },
      { q: 'Ik ___ naar Brussel gegaan.', a: ['ben'], opts: ['heb', 'ben'] },
      { q: 'Hij heeft een boek ___. (lezen)', a: ['gelezen'] },
      { q: 'Ik heb de rekening ___. (betalen)', a: ['betaald'] },
      { q: 'Zij ___ koffie gedronken.', a: ['heeft', 'hebben'], opts: ['is', 'heeft'] },
      { q: 'Wij hebben voetbal ___. (spelen)', a: ['gespeeld'] },
      { q: 'Ik heb een pintje ___. (bestellen)', a: ['besteld'] },
    ],
    speak: ['Wat heb je gisteren gedaan?', 'Wat heb je vorig weekend gedaan?'],
  };

  T.modaal = {
    label: 'Pouvoir, vouloir, devoir', level: 'A1',
    fiche: `
<table><tr><th></th><th>kunnen</th><th>willen</th><th>moeten</th><th>mogen</th></tr>
<tr><td>ik</td><td>kan</td><td>wil</td><td>moet</td><td>mag</td></tr>
<tr><td>jij / u</td><td>kunt / kan</td><td>wilt / wil</td><td>moet</td><td>mag</td></tr>
<tr><td>hij / zij</td><td>kan</td><td>wil</td><td>moet</td><td>mag</td></tr>
<tr><td>wij / jullie / zij</td><td>kunnen</td><td>willen</td><td>moeten</td><td>mogen</td></tr></table>
<p>L’infinitif part à la <b>fin</b> : <i>Ik <b>wil</b> een koffie <b>drinken</b>. Ik <b>moet</b> morgen <b>werken</b>.</i></p>
<p>Politesse : <i>Ik <b>wil graag</b> een koffie</i> (je voudrais), <i><b>Mag</b> ik de rekening?</i> (puis-je avoir…), <i><b>Kunt</b> u mij helpen?</i></p>`,
    bank: [
      { q: 'Ik ___ graag een koffie. (vouloir)', a: ['wil'] },
      { q: '___ ik de rekening? (puis-je)', a: ['mag'] },
      { q: '___ u mij helpen? (pouvez-vous)', a: ['kunt', 'kan'] },
      { q: 'Wij ___ morgen werken. (devoir)', a: ['moeten'] },
      { q: 'Hij ___ goed koken. (savoir, pouvoir)', a: ['kan'] },
      { q: 'Ik wil Nederlands ___. (leren)', a: ['leren'] },
    ],
    speak: ['Wat wil je dit jaar leren? Wat moet je deze week doen?'],
  };

  T.scheidbaar = {
    label: 'Verbes séparables', level: 'A2',
    fiche: `
<p>Certains verbes ont une particule (<i>op-, mee-, aan-, af-, uit-, terug-…</i>) qui se <b>sépare</b> au présent et part à la fin :</p>
<p><i><b>opstaan</b> → Ik <b>sta</b> om zeven uur <b>op</b>. <b>opbellen</b> → Ik <b>bel</b> je morgen <b>op</b>. <b>meenemen</b> → Ik <b>neem</b> een paraplu <b>mee</b>.</i></p>
<p>Avec un 2e verbe, elle reste collée : <i>Ik moet vroeg <b>opstaan</b>.</i> Au participe, <b>ge</b> se glisse au milieu : <i>op<b>ge</b>staan, op<b>ge</b>beld, mee<b>ge</b>nomen</i>.</p>`,
    bank: [
      { q: 'Ik sta om zeven uur ___. (opstaan)', a: ['op'] },
      { q: 'Ik ___ je morgen op. (opbellen)', a: ['bel'] },
      { q: 'Ik moet vroeg ___. (opstaan)', a: ['opstaan'] },
      { q: 'Hij is om zes uur ___. (opstaan, passé)', a: ['opgestaan'] },
      { q: 'Neem je een paraplu ___? (meenemen)', a: ['mee'] },
    ],
  };

  T.bezittelijk = {
    label: 'Mon, ton, son…', level: 'A1',
    fiche: `
<table><tr><td>mijn</td><td>mon, ma, mes</td></tr><tr><td>jouw / je</td><td>ton, ta, tes</td></tr>
<tr><td>uw</td><td>votre (politesse)</td></tr><tr><td>zijn</td><td>son (à lui)</td></tr><tr><td>haar</td><td>son (à elle)</td></tr>
<tr><td>ons / onze</td><td>notre (ons + mot en het, onze sinon)</td></tr><tr><td>jullie</td><td>votre (à vous)</td></tr><tr><td>hun</td><td>leur</td></tr></table>
<p>Le néerlandais distingue <b>zijn</b> (à lui) et <b>haar</b> (à elle) : <i>Anna en <b>haar</b> broer</i>.</p>`,
    bank: [
      { q: 'Dit is ___ broer. (mon)', a: ['mijn'] },
      { q: 'Anna en ___ vader. (son, à elle)', a: ['haar'] },
      { q: 'Tom en ___ moeder. (son, à lui)', a: ['zijn'] },
      { q: '___ huis is klein. (notre, het huis)', a: ['ons'] },
      { q: '___ kamer is groot. (notre, de kamer)', a: ['onze'] },
      { q: 'Is dit ___ fiets? (ta)', a: ['jouw', 'je'] },
    ],
  };

  T.getallen = {
    label: 'Nombres et heure', level: 'A1',
    fiche: `
<p>Après 20, on dit les unités d’abord : <i>21 = <b>een</b>en<b>twintig</b></i> (un-et-vingt), <i>35 = vijfendertig</i>.</p>
<p><b>L’heure</b> : piège n°1 pour un francophone ! <b>half drie</b> = <b>2 h 30</b> (la moitié <i>vers</i> trois heures).</p>
<ul><li><i>kwart over vier</i> = 4 h 15 · <i>kwart voor vijf</i> = 4 h 45</li>
<li><i>tien over half drie</i> = 2 h 40 (dix après la demie avant trois)</li>
<li><i>Hoe laat is het? Het is drie uur.</i></li></ul>`,
    bank: [
      { q: '21 = ___', a: ['eenentwintig'] },
      { q: '35 = ___', a: ['vijfendertig'] },
      { q: 'half drie = ___ h 30', a: ['2', 'deux'], opts: ['2', '3'] },
      { q: 'kwart over vier = 4 h ___', a: ['15'], opts: ['15', '45'] },
      { q: '12 = ___', a: ['twaalf'] },
      { q: 'half negen = ___ h 30', a: ['8', 'huit'], opts: ['8', '9'] },
    ],
  };

  T.registro = {
    label: 'Tu ou vous : jij / u', level: 'A1',
    fiche: `
<p><b>jij / je</b> : amis, collègues de ton âge, étudiants. En Flandre, on tutoie assez vite.</p>
<p><b>u</b> : inconnus plus âgés, clients, administration, professeurs (au début). Le verbe se conjugue comme avec <i>jij</i> : <i>u <b>bent</b>, u <b>werkt</b></i> ; avec <i>hebben</i> : <i>u <b>hebt</b></i> ou <i>u <b>heeft</b></i>.</p>
<p>Formules polies : <i>alstublieft</i> (vous) / <i>alsjeblieft</i> (tu), <i>dank u wel</i> / <i>dank je wel</i>, <i>Mag ik…? Kunt u…?</i></p>`,
    bank: [
      { q: 'À un serveur âgé : « ___ u mij helpen? »', a: ['kunt', 'kan'] },
      { q: 'À un ami : « Dank ___ wel! »', a: ['je'], opts: ['je', 'u'] },
      { q: 'À un client : « Dank ___ wel! »', a: ['u'], opts: ['je', 'u'] },
      { q: 'S’il vous plaît : « ___ »', a: ['alstublieft'], opts: ['alsjeblieft', 'alstublieft'] },
      { q: 'Avec u : « Waar ___ u? » (wonen)', a: ['woont'] },
    ],
  };

  // Points de grammaire dans l'ordre d'apprentissage ; autres sujets utilisés par l'IA pour classer ses corrections
  const ORDER = ['zijn_hebben', 'presens', 'vragen', 'de_het', 'negatie', 'getallen', 'modaal', 'woordvolgorde', 'bezittelijk', 'meervoud', 'registro', 'perfectum', 'bijvoeglijk', 'scheidbaar'];
  const EXTRA_TOPICS = { vocabulario: 'Vocabulaire', pronunciacion: 'Prononciation', otro: 'Autre' };

  global.GRAMMAR = { TOPICS: T, ORDER, EXTRA_TOPICS };
})(typeof window !== 'undefined' ? window : globalThis);
