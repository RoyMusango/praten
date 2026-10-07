// Configuration propre à la langue : textes de l'interface, voix, IA, lecture.
// Le reste de l'app (js/app.js, store, sync, speech, ai) est commun aux apps de langues.
window.LANG = {
  id: 'nl',
  appName: 'Praten',
  title: 'Praten · Néerlandais',
  langNameFr: 'néerlandais',
  locale: 'nl-BE',
  storageKey: 'dutch-app-v1',
  syncFile: 'progress-nl.json',
  dataRepo: 'RoyMusango/hablemos-data',
  pagesUrl: 'https://roymusango.github.io/praten/',
  siblings: [['Espagnol', 'https://roymusango.github.io/hablemos/'], ['Anglais', 'https://roymusango.github.io/letstalk/']],

  // Débutant complet : traductions visibles, idée de réponse automatique, mots nouveaux d'abord entendus, prononciation en priorité
  defaults: { dailyMinutes: 20, level: 'A0-A1', newPerDay: 8, showTranslation: true, ttsRate: 0.85 },
  levels: ['A0', 'A0-A1', 'A1', 'A1-A2', 'A2'],
  autoHint: true,
  introduceNewWords: true,
  soundsFirst: true,

  nav: { today: 'Vandaag', speak: 'Spreken', words: 'Woorden', verbs: 'Werkwoorden', sounds: 'Uitspraak', grammar: 'Grammatica', read: 'Lezen', progress: 'Voortgang', settings: 'Instellingen' },
  t: {
    session: 'Jouw sessie', priorities: 'Jouw prioriteiten', wotd: 'Woord van de dag', speakToday: 'Vandaag praten',
    stepWords: 'Woorden', stepGrammar: 'Werkwoorden & grammatica', stepSpeak: 'Spreken',
    questions: 'Vragen', speakAloud: 'Zeg het hardop', wellDone: 'Goed gedaan!',
    review: 'Herhalen', synonyms: 'Synoniemen', themes: 'Thema’s', inLang: 'En néerlandais',
    conjugator: 'Vervoeging', verbsEyebrow: 'Verbes',
    verbsLead: 'Le présent d’abord (ik werk, jij werkt, wij werken), la question (werk jij ?), puis le passé composé (ik heb gewerkt). L’entraîneur insiste sur ce que tu rates.',
    soundsLead: 'Le néerlandais s’écrit presque comme il se prononce, à condition de connaître une quinzaine de sons. Écoute une voix native, répète, et le micro vérifie que tu es compris. Commence ici.',
    vocabPrioDefault: n => `${n} thèmes actifs : les bases pour te présenter, commander, te déplacer et comprendre l’essentiel.`,
    startConv: '(Begin het gesprek.)',
    rescue: ['Sorry, ik begrijp het niet.', 'Kunt u dat herhalen, alstublieft?', 'Hoe zeg je … in het Nederlands?', 'Wat betekent …?', 'Langzaam, alstublieft.'],
    circumlocution: ['Het is een ding om te…', 'Het is een plaats waar…', 'Het is iemand die…', 'Het is zoals…, maar…', 'Hoe zeg je « … » in het Nederlands?'],
    lookupPlaceholder: 'ex. : bonjour, gare, je voudrais, combien',
  },
  courseThemesNote: 'Commence par « Les bases » et « Phrases de survie ».',
  grammarLinks: 'Pour approfondir : <a class="link" href="https://www.dutchgrammar.com/" target="_blank" rel="noopener">Dutch Grammar</a> (en anglais) et <a class="link" href="https://taaladvies.net/" target="_blank" rel="noopener">Taaladvies</a> (le site de référence de la Taalunie).',

  normalize: {
    articles: /^(de|het|een|'t)\s+/,
    pronouns: /^(ik|jij|je|u|hij|zij|ze|het|wij|we|jullie)\s+/,
  },

  voice: {
    accept: /^nl([-_]|$)/i, defaultVariant: 'nl-BE',
    variants: [['nl-BE', 'Flamand (Belgique, recommandé)'], ['nl-NL', 'Néerlandais (Pays-Bas)']],
    title: 'Voix néerlandaise native', preferLabel: 'Accent choisi', otherLabel: 'Autre variante du néerlandais',
    female: /dena|colette|fenna|ellen|hanna|claire|google nederlands/i,
    male: /arnaud|maarten|frank|bart|xander/i,
    help: 'L’app n’utilise que des voix néerlandaises natives. Les plus naturelles sont les voix neuronales de <b>Microsoft Edge</b> : Dena et Arnaud pour le flamand, Fenna et Maarten pour les Pays-Bas. Dans Chrome, « Google Nederlands » (Pays-Bas).',
    missing: 'Aucune voix néerlandaise disponible. Ouvre l’app dans Microsoft Edge (voix flamandes Dena et Arnaud) ou Chrome.',
    onlyOther: 'L’accent choisi n’est pas disponible dans ce navigateur : une autre voix néerlandaise native est utilisée.',
    robotic: 'Voix néerlandaise disponible mais synthétique. Edge propose des voix neuronales bien plus naturelles.',
    testF: 'Hallo! Ik ben Anna. Hoe heet jij?',
    testM: 'Goedemorgen. Een koffie, alstublieft.',
  },

  ai: {
    get target() { return (Store.settings.voiceVariant || 'nl-BE') === 'nl-NL' ? 'Dutch (standard Dutch as spoken in the Netherlands)' : 'Dutch (standard Belgian Dutch, as spoken in Flanders)'; },
    levelRules: lv => `He is a TOTAL BEGINNER (level ${lv}) who had never heard Dutch before. Use only 1 or 2 very short sentences (3 to 10 words), very frequent words, mostly the present tense, and repeat key words. Introduce at most one new word per turn. If he answers in French, give him the Dutch sentence and ask him to repeat it. Be warm and encouraging. Use "je/jij" in casual scenes and "u" when the scene is formal.`,
    extraRules: '- Always fill "translation_fr" with a faithful French translation.\n- "suggestion" must be a very short Dutch sentence he can say next (max 8 words).\n- Prefer standard vocabulary; you may mention a common Flemish everyday variant when it is useful (e.g. "goesting", "amai"), labelled as Flemish.',
    errorTypes: 'word order (verb in second position, inversion after a time expression, verb at the end of subordinate clauses), de/het, verb conjugation (t-ending, jij inversion), plural, spelling, wrong word, French influence',
    readingLevel: 'at A1 level: very short sentences, the most frequent words, present tense',
    readingTranslation: true,
    lookupArticle: 'with de or het for nouns',
    testSystem: 'Answer in one very short, simple sentence in Dutch.',
    testUser: 'Zeg hallo tegen een Belgische student die Nederlands begint te leren.',
  },

  priorityCats: { 'Les bases': 2, 'Vie quotidienne': 1.5, 'Études & travail': 1 },
  wotdThemes: ['basis', 'zinnen', 'vlaams', 'tijd', 'werk'],
  readTopics: [
    ['basis', 'Se présenter', 'a young person introduces himself: name, country, studies, hobbies'],
    ['dag', 'Une journée', 'a normal day: getting up, breakfast, train, work or university, evening'],
    ['stad', 'En ville', 'a walk in Ghent or Antwerp: the station, a café, the market, a bakery'],
    ['eten', 'Manger et boire', 'Belgian food and drinks: fries, waffles, coffee, a pint'],
    ['werk', 'Études & travail', 'a student who works with computers and artificial intelligence at a bank (very simple words)'],
    ['voetbal', 'Football', 'watching a football match with friends in a Belgian café'],
  ],
  readLengths: [[60, 'Très court'], [100, 'Court'], [160, 'Moyen']],
};
