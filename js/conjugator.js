// Verbes néerlandais : présent, question (inversion), passé composé (perfectum), imparfait, futur proche (gaan + infinitif).
// Personnes : 0 ik, 1 jij (u), 2 hij / zij / het, 3 wij, 4 jullie, 5 zij (pluriel)
// Toutes les formes sont écrites explicitement (l'orthographe néerlandaise piège les règles automatiques).
(function (global) {
  const PERSONS = ['ik', 'jij / u', 'hij / zij / het', 'wij', 'jullie', 'zij'];
  const PERSONS_SHORT = ['ik', 'jij', 'hij', 'wij', 'jullie', 'zij'];

  // ik : forme « ik » ; jij : forme « jij » (et hij si identique) ; hij : si différente ; past : sg/pl ; part : participe ; aux : h (hebben) ou z (zijn), hz = les deux
  // sep : particule des verbes séparables ; c : complément pour les phrases
  const VERBS = [
    { inf: 'zijn', fr: 'être', ik: 'ben', jij: 'bent', hij: 'is', past: 'was|waren', part: 'geweest', aux: 'z', c: 'in Gent' },
    { inf: 'hebben', fr: 'avoir', ik: 'heb', jij: 'hebt', hij: 'heeft', past: 'had|hadden', part: 'gehad', aux: 'h', c: 'een vraag' },
    { inf: 'gaan', fr: 'aller', ik: 'ga', jij: 'gaat', past: 'ging|gingen', part: 'gegaan', aux: 'z', c: 'naar Gent' },
    { inf: 'komen', fr: 'venir', ik: 'kom', jij: 'komt', past: 'kwam|kwamen', part: 'gekomen', aux: 'z', c: 'uit België' },
    { inf: 'doen', fr: 'faire', ik: 'doe', jij: 'doet', past: 'deed|deden', part: 'gedaan', aux: 'h', c: 'boodschappen' },
    { inf: 'kunnen', fr: 'pouvoir', ik: 'kan', jij: 'kunt|kan', hij: 'kan', past: 'kon|konden', part: 'gekund', aux: 'h', c: 'goed koken' },
    { inf: 'willen', fr: 'vouloir', ik: 'wil', jij: 'wilt|wil', hij: 'wil', past: 'wilde|wilden', part: 'gewild', aux: 'h', c: 'een koffie' },
    { inf: 'moeten', fr: 'devoir', ik: 'moet', jij: 'moet', past: 'moest|moesten', part: 'gemoeten', aux: 'h', c: 'werken' },
    { inf: 'mogen', fr: 'avoir le droit', ik: 'mag', jij: 'mag', past: 'mocht|mochten', part: 'gemogen', aux: 'h', c: 'hier parkeren' },
    { inf: 'weten', fr: 'savoir', ik: 'weet', jij: 'weet', past: 'wist|wisten', part: 'geweten', aux: 'h', c: 'het antwoord' },
    { inf: 'zien', fr: 'voir', ik: 'zie', jij: 'ziet', past: 'zag|zagen', part: 'gezien', aux: 'h', c: 'de trein' },
    { inf: 'eten', fr: 'manger', ik: 'eet', jij: 'eet', past: 'at|aten', part: 'gegeten', aux: 'h', c: 'een broodje' },
    { inf: 'drinken', fr: 'boire', ik: 'drink', jij: 'drinkt', past: 'dronk|dronken', part: 'gedronken', aux: 'h', c: 'koffie' },
    { inf: 'lezen', fr: 'lire', ik: 'lees', jij: 'leest', past: 'las|lazen', part: 'gelezen', aux: 'h', c: 'de krant' },
    { inf: 'schrijven', fr: 'écrire', ik: 'schrijf', jij: 'schrijft', past: 'schreef|schreven', part: 'geschreven', aux: 'h', c: 'een e-mail' },
    { inf: 'spreken', fr: 'parler (une langue)', ik: 'spreek', jij: 'spreekt', past: 'sprak|spraken', part: 'gesproken', aux: 'h', c: 'Nederlands' },
    { inf: 'nemen', fr: 'prendre', ik: 'neem', jij: 'neemt', past: 'nam|namen', part: 'genomen', aux: 'h', c: 'de bus' },
    { inf: 'geven', fr: 'donner', ik: 'geef', jij: 'geeft', past: 'gaf|gaven', part: 'gegeven', aux: 'h', c: 'een cadeau' },
    { inf: 'kopen', fr: 'acheter', ik: 'koop', jij: 'koopt', past: 'kocht|kochten', part: 'gekocht', aux: 'h', c: 'brood' },
    { inf: 'denken', fr: 'penser', ik: 'denk', jij: 'denkt', past: 'dacht|dachten', part: 'gedacht', aux: 'h', c: 'aan de examens' },
    { inf: 'brengen', fr: 'apporter', ik: 'breng', jij: 'brengt', past: 'bracht|brachten', part: 'gebracht', aux: 'h', c: 'de documenten' },
    { inf: 'zoeken', fr: 'chercher', ik: 'zoek', jij: 'zoekt', past: 'zocht|zochten', part: 'gezocht', aux: 'h', c: 'een kot' },
    { inf: 'vinden', fr: 'trouver', ik: 'vind', jij: 'vindt', past: 'vond|vonden', part: 'gevonden', aux: 'h', c: 'het station' },
    { inf: 'beginnen', fr: 'commencer', ik: 'begin', jij: 'begint', past: 'begon|begonnen', part: 'begonnen', aux: 'z', c: 'om negen uur' },
    { inf: 'blijven', fr: 'rester', ik: 'blijf', jij: 'blijft', past: 'bleef|bleven', part: 'gebleven', aux: 'z', c: 'thuis' },
    { inf: 'slapen', fr: 'dormir', ik: 'slaap', jij: 'slaapt', past: 'sliep|sliepen', part: 'geslapen', aux: 'h', c: 'goed' },
    { inf: 'lopen', fr: 'marcher', ik: 'loop', jij: 'loopt', past: 'liep|liepen', part: 'gelopen', aux: 'hz', c: 'naar huis' },
    { inf: 'rijden', fr: 'rouler, conduire', ik: 'rijd', jij: 'rijdt', past: 'reed|reden', part: 'gereden', aux: 'hz', c: 'met de fiets' },
    { inf: 'vragen', fr: 'demander', ik: 'vraag', jij: 'vraagt', past: 'vroeg|vroegen', part: 'gevraagd', aux: 'h', c: 'de weg' },
    { inf: 'zeggen', fr: 'dire', ik: 'zeg', jij: 'zegt', past: 'zei|zeiden', part: 'gezegd', aux: 'h', c: 'goedemorgen' },
    { inf: 'staan', fr: 'être debout, se trouver', ik: 'sta', jij: 'staat', past: 'stond|stonden', part: 'gestaan', aux: 'h', c: 'aan de bushalte' },
    { inf: 'zitten', fr: 'être assis', ik: 'zit', jij: 'zit', past: 'zat|zaten', part: 'gezeten', aux: 'h', c: 'op een terras' },
    { inf: 'helpen', fr: 'aider', ik: 'help', jij: 'helpt', past: 'hielp|hielpen', part: 'geholpen', aux: 'h', c: 'een collega' },
    { inf: 'krijgen', fr: 'recevoir', ik: 'krijg', jij: 'krijgt', past: 'kreeg|kregen', part: 'gekregen', aux: 'h', c: 'een bericht' },
    { inf: 'kijken', fr: 'regarder', ik: 'kijk', jij: 'kijkt', past: 'keek|keken', part: 'gekeken', aux: 'h', c: 'naar de match' },
    { inf: 'werken', fr: 'travailler', ik: 'werk', jij: 'werkt', past: 'werkte|werkten', part: 'gewerkt', aux: 'h', c: 'in Brussel' },
    { inf: 'wonen', fr: 'habiter', ik: 'woon', jij: 'woont', past: 'woonde|woonden', part: 'gewoond', aux: 'h', c: 'in Leuven' },
    { inf: 'maken', fr: 'faire, fabriquer', ik: 'maak', jij: 'maakt', past: 'maakte|maakten', part: 'gemaakt', aux: 'h', c: 'een plan' },
    { inf: 'spelen', fr: 'jouer', ik: 'speel', jij: 'speelt', past: 'speelde|speelden', part: 'gespeeld', aux: 'h', c: 'voetbal' },
    { inf: 'leren', fr: 'apprendre', ik: 'leer', jij: 'leert', past: 'leerde|leerden', part: 'geleerd', aux: 'h', c: 'Nederlands' },
    { inf: 'koken', fr: 'cuisiner', ik: 'kook', jij: 'kookt', past: 'kookte|kookten', part: 'gekookt', aux: 'h', c: 'pasta' },
    { inf: 'fietsen', fr: 'faire du vélo', ik: 'fiets', jij: 'fietst', past: 'fietste|fietsten', part: 'gefietst', aux: 'hz', c: 'naar school' },
    { inf: 'reizen', fr: 'voyager', ik: 'reis', jij: 'reist', past: 'reisde|reisden', part: 'gereisd', aux: 'hz', c: 'naar Spanje' },
    { inf: 'leven', fr: 'vivre', ik: 'leef', jij: 'leeft', past: 'leefde|leefden', part: 'geleefd', aux: 'h', c: 'gezond' },
    { inf: 'wachten', fr: 'attendre', ik: 'wacht', jij: 'wacht', past: 'wachtte|wachtten', part: 'gewacht', aux: 'h', c: 'op de tram' },
    { inf: 'praten', fr: 'parler, bavarder', ik: 'praat', jij: 'praat', past: 'praatte|praatten', part: 'gepraat', aux: 'h', c: 'met een vriend' },
    { inf: 'bellen', fr: 'téléphoner', ik: 'bel', jij: 'belt', past: 'belde|belden', part: 'gebeld', aux: 'h', c: 'naar mijn moeder' },
    { inf: 'horen', fr: 'entendre', ik: 'hoor', jij: 'hoort', past: 'hoorde|hoorden', part: 'gehoord', aux: 'h', c: 'muziek' },
    { inf: 'luisteren', fr: 'écouter', ik: 'luister', jij: 'luistert', past: 'luisterde|luisterden', part: 'geluisterd', aux: 'h', c: 'naar de radio' },
    { inf: 'studeren', fr: 'étudier', ik: 'studeer', jij: 'studeert', past: 'studeerde|studeerden', part: 'gestudeerd', aux: 'h', c: 'ingenieurswetenschappen' },
    { inf: 'betalen', fr: 'payer', ik: 'betaal', jij: 'betaalt', past: 'betaalde|betaalden', part: 'betaald', aux: 'h', c: 'met de kaart' },
    { inf: 'vertellen', fr: 'raconter', ik: 'vertel', jij: 'vertelt', past: 'vertelde|vertelden', part: 'verteld', aux: 'h', c: 'een verhaal' },
    { inf: 'bestellen', fr: 'commander', ik: 'bestel', jij: 'bestelt', past: 'bestelde|bestelden', part: 'besteld', aux: 'h', c: 'een pintje' },
    { inf: 'gebruiken', fr: 'utiliser', ik: 'gebruik', jij: 'gebruikt', past: 'gebruikte|gebruikten', part: 'gebruikt', aux: 'h', c: 'de computer' },
    { inf: 'wandelen', fr: 'se promener', ik: 'wandel', jij: 'wandelt', past: 'wandelde|wandelden', part: 'gewandeld', aux: 'hz', c: 'in het park' },
    { inf: 'opstaan', fr: 'se lever', ik: 'sta op', jij: 'staat op', past: 'stond op|stonden op', part: 'opgestaan', aux: 'z', sep: 'op', c: 'vroeg' },
    { inf: 'opbellen', fr: 'appeler (au téléphone)', ik: 'bel op', jij: 'belt op', past: 'belde op|belden op', part: 'opgebeld', aux: 'h', sep: 'op', c: 'de dokter' },
  ];
  const BY_INF = Object.fromEntries(VERBS.map(v => [v.inf, v]));
  const alts = x => x.split('|');
  const first = x => alts(x)[0];
  const ZIJN = ['ben', 'bent', 'is', 'zijn', 'zijn', 'zijn'];
  const HEBBEN = ['heb', 'hebt', 'heeft', 'hebben', 'hebben', 'hebben'];
  const GAAN = ['ga', 'gaat', 'gaat', 'gaan', 'gaan', 'gaan'];

  // Présent : toutes les formes acceptées pour une personne
  function presentAll(v, p) {
    if (p === 0) return [v.ik];
    if (p === 1) return alts(v.jij);
    if (p === 2) return v.hij ? alts(v.hij) : alts(v.jij);
    // Pluriel = infinitif (séparable : particule à la fin : « wij staan op »)
    return [v.sep ? `${v.inf.slice(v.sep.length)} ${v.sep}` : v.inf];
  }
  // Question : « jij » perd son -t en inversion (werk jij ?) = forme de « ik » ; sinon verbe puis sujet
  function questionAll(v, p) {
    const subj = PERSONS_SHORT[p];
    const verbForms = p === 1 ? [v.ik, ...(v.inf === 'kunnen' ? ['kun'] : [])] : presentAll(v, p);
    return verbForms.map(f => {
      if (v.sep) { const [verb, part] = f.split(' '); return `${verb} ${subj} ${part}`; }
      return `${f} ${subj}`;
    });
  }
  function auxAll(v, p) {
    const res = [];
    if (v.aux.includes('h')) res.push(HEBBEN[p]);
    if (v.aux.includes('z')) res.push(ZIJN[p]);
    return res;
  }
  const perfectAll = (v, p) => auxAll(v, p).map(a => `${a} ${v.part}`);
  const pastAll = (v, p) => [alts(v.past)[p < 3 ? 0 : 1]];
  const futureAll = (v, p) => [`${GAAN[p]} ${v.inf}`];

  function formsOf(v, tense, p) {
    switch (tense) {
      case 'presens': return presentAll(v, p);
      case 'vraag': return questionAll(v, p);
      case 'perfectum': return perfectAll(v, p);
      case 'imperfectum': return pastAll(v, p);
      case 'toekomst': return futureAll(v, p);
    }
    return [];
  }
  const conjugate = (inf, tense, p) => formsOf(BY_INF[inf], tense, p)[0];

  // ---------- Entraîneur (interface commune utilisée par app.js) ----------
  const TRAIN = ['presens', 'vraag', 'perfectum', 'toekomst', 'imperfectum'];
  const NAMES = { presens: 'Présent (presens)', vraag: 'Question (inversion)', perfectum: 'Passé composé (perfectum)', toekomst: 'Futur proche (gaan + inf.)', imperfectum: 'Imparfait (imperfectum)' };
  const TOPIC = { presens: 'presens', vraag: 'vragen', perfectum: 'perfectum', toekomst: 'woordvolgorde', imperfectum: 'perfectum' };
  const PRIORITY = ['presens', 'vraag', 'perfectum', 'toekomst', 'imperfectum'];
  // « zij » est ambigu (elle / ils) : la précision entre parenthèses est retirée dans les phrases
  const SUBJ = [['ik'], ['jij', 'u'], ['hij', 'zij (elle)', 'mijn collega', 'Anna'], ['wij'], ['jullie'], ['zij (ils)', 'mijn ouders']];
  const bare = s => s.replace(/\s*\(.*\)/, '');
  const PERSON_WEIGHTS = [0, 0, 0, 1, 1, 1, 2, 2, 3, 4, 5];
  // Les modaux et « zijn / hebben » sont surtout travaillés au présent
  const validVerbs = tense => VERBS.filter(v => !(tense === 'toekomst' && ['gaan', 'zijn', 'hebben', 'kunnen', 'willen', 'moeten', 'mogen', 'weten'].includes(v.inf)) && !(tense === 'perfectum' && ['mogen', 'moeten', 'kunnen', 'willen'].includes(v.inf)));

  const cap = s => s[0].toUpperCase() + s.slice(1);
  // Place le complément avant la particule séparable : « sta op » + « vroeg » → « sta vroeg op »
  const withC = (v, form, c) => v.sep && form.endsWith(' ' + v.sep) ? `${form.slice(0, -v.sep.length - 1)} ${c} ${v.sep}` : `${form} ${c}`;

  function makeItem(tense, { pick, trouble }) {
    const verbs = validVerbs(tense);
    const cand = trouble.filter(inf => verbs.some(v => v.inf === inf));
    const v = cand.length && Math.random() < 0.4 ? BY_INF[pick(cand)] : pick(verbs);
    let p = pick(PERSON_WEIGHTS);
    if (tense === 'vraag' && Math.random() < 0.6) p = 1; // l'inversion de « jij » est LE piège
    const label = pick(SUBJ[p]), subj = bare(label);
    const isU = subj === 'u';
    if (tense === 'vraag') {
      // « u » garde le -t (Werkt u?), « jij » le perd (Werk jij?)
      const verbForms = isU ? presentAll(v, 1).concat(v.inf === 'hebben' ? ['heeft'] : []) : p === 1 ? [v.ik, ...(v.inf === 'kunnen' ? ['kun'] : [])] : presentAll(v, p);
      const build = (f, withComp) => {
        const [verb, ...rest] = f.split(' ');
        const part = rest.join(' ');
        return [verb, subj, withComp ? v.c : '', part].filter(Boolean).join(' ');
      };
      const a = [...verbForms.map(f => build(f, false)), ...verbForms.map(f => build(f, true))];
      return { kind: 'bare', tense, verb: v.inf, p, prompt: `${label} · ${v.inf} · ${v.c}`, sub: 'Transforme en question : le verbe d’abord', a, full: cap(build(verbForms[0], true)) + '?', placeholder: 'ex. : werk jij' };
    }
    let a = formsOf(v, tense, p);
    if (isU && v.inf === 'hebben' && tense === 'presens') a = [...a, 'heeft'];
    if (isU && tense === 'perfectum' && v.aux.includes('h')) a = [...a, `heeft ${v.part}`];
    const head = a[0].split(' ')[0];
    const sentence = tense === 'perfectum' ? `${head} ${v.c} ${v.part}` : tense === 'toekomst' ? `${head} ${v.c} ${v.inf}` : withC(v, a[0], v.c);
    return { kind: 'bare', tense, verb: v.inf, p, prompt: `${label} · ${v.inf}`, sub: `${NAMES[tense]} · ${v.fr}`, a, full: `${cap(subj)} ${sentence}.`, placeholder: tense === 'perfectum' ? 'ex. : heb gewerkt' : tense === 'toekomst' ? 'ex. : ga werken' : 'Forme conjuguée' };
  }

  // Exercices générés pour les points de grammaire (présent uniquement, ordre simple sujet + verbe + complément)
  function genItem(g, { pick }) {
    const v = pick(VERBS.filter(x => !x.sep));
    const p = pick(PERSON_WEIGHTS);
    const label = pick(SUBJ[p]), subj = bare(label);
    const a = presentAll(v, p).concat(subj === 'u' && v.inf === 'hebben' ? ['heeft'] : []);
    return { q: `${cap(label)} ___ ${v.c}.`, hint: `${v.inf} (${v.fr}) au présent`, a, verb: v.inf, tense: 'presens', p };
  }

  function itemTable(it) {
    const v = BY_INF[it.verb]; if (!v) return null;
    const t = it.tense === 'vraag' ? 'presens' : it.tense;
    return { title: `${v.inf} : ${NAMES[t].toLowerCase()}`, rows: [0, 1, 2, 3, 4, 5].map(p => [PERSONS[p], formsOf(v, t, p).join(' / '), p === it.p]) };
  }

  function verbView(inf) {
    const v = BY_INF[inf];
    const tbl = t => ({ title: NAMES[t], rows: [0, 1, 2, 3, 4, 5].map(p => [PERSONS_SHORT[p], formsOf(v, t, p)[0]]) });
    return {
      extras: [['Traduction', v.fr], ['Participe', v.part], ['Auxiliaire', v.aux === 'z' ? 'zijn' : v.aux === 'h' ? 'hebben' : 'hebben ou zijn'], ['Imparfait', alts(v.past).join(' / ')]],
      tables: ['presens', 'perfectum', 'toekomst', 'imperfectum'].map(tbl),
    };
  }

  // Aide avant de répondre (débutant complet) : la règle en une ligne, avec un verbe modèle
  const RULES = {
    presens: 'ik = radical (ik werk) · jij, u, hij, zij = radical + t (jij werkt) · wij, jullie, zij (ils) = infinitif (wij werken). Irréguliers fréquents : zijn (ik ben, jij bent, hij is), hebben (ik heb, jij hebt, hij heeft).',
    vraag: 'Pour une question, le verbe passe en premier : Werkt hij? · Avec jij (après le verbe), le -t tombe : Werk jij? Mais Werkt u?',
    perfectum: 'hebben (ou zijn) conjugué + participe ge-…-t / ge-…-d : ik heb gewerkt, wij hebben gespeeld. Les verbes de déplacement ou de changement prennent zijn : ik ben gegaan.',
    toekomst: 'gaan conjugué + infinitif à la fin : ik ga werken, jij gaat werken, wij gaan werken.',
    imperfectum: 'Verbes réguliers : radical + te / de (ik werkte, wij werkten). Les verbes forts changent de voyelle : ik ging, ik was.',
  };
  global.Conj = { VERBS, BY_INF, PERSONS, PERSONS_SHORT, conjugate, TRAIN, NAMES, TOPIC, PRIORITY, CONTEXT_TOPIC: null, RULES, makeItem, genItem, itemTable, verbView };
})(typeof window !== 'undefined' ? window : globalThis);
