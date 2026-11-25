// Leçons animées : une par point de grammaire (même identifiant que dans grammar.js).
// Les sous-titres (fr) sont en français ; les phrases en néerlandais sont lues par une voix native (flamande par défaut).
// Débutant total : chaque phrase a sa traduction. *mot* est surligné ; « werk|t » sépare radical et terminaison.
// Scènes : title, ex, conj, timeline, vs, tip, move, quiz (voir js/media.js).
window.LESSONS = {
  zijn_hebben: {
    yt: 'néerlandais zijn hebben cours débutant',
    scenes: [
      { t: 'title', h: 'Zijn en hebben', sub: 'Être et avoir', fr: 'Les deux verbes les plus utiles du néerlandais. Avec eux, tu peux déjà te présenter.' },
      { t: 'conj', verb: 'zijn', vfr: 'être', rows: [['ik', 'ben', 'je suis'], ['jij', 'bent', 'tu es'], ['hij / zij', 'is', 'il, elle est'], ['wij', 'zijn', 'nous sommes'], ['jullie', 'zijn', 'vous êtes'], ['zij', 'zijn', 'ils sont']], fr: 'Écoute et répète chaque forme. Zijn est irrégulier, comme être en français.' },
      { t: 'conj', verb: 'hebben', vfr: 'avoir', rows: [['ik', 'heb', 'j’ai'], ['jij', 'hebt', 'tu as'], ['hij / zij', 'heeft', 'il, elle a'], ['wij', 'hebben', 'nous avons'], ['zij', 'hebben', 'ils ont']], fr: 'Attention à hij heeft, avec deux e.' },
      { t: 'quiz', q: 'Ik ___ student.', hint: 'zijn, ik', opts: ['ben', 'bent', 'is'], a: 'ben', expl: 'Ik ben : je suis.', fr: 'À toi.' },
      { t: 'vs', a: { h: 'IK BEN…', sub: 'l’âge se dit avec être', ex: [['Ik *ben* 22 jaar.', 'J’ai 22 ans.']] }, b: { h: 'IK HEB…', sub: 'la faim, comme en français', ex: [['Ik *heb* honger.', 'J’ai faim.']] }, fr: 'Le piège : pour l’âge, on dit littéralement « je suis 22 ans ».' },
      { t: 'quiz', q: 'Hij ___ een fiets.', hint: 'hebben, hij', opts: ['heeft', 'hebt', 'heb'], a: 'heeft', expl: 'Il a un vélo.', fr: 'Dernière question.' },
    ],
  },

  presens: {
    yt: 'néerlandais présent conjugaison débutant',
    scenes: [
      { t: 'title', h: 'Le présent', sub: 'Ik werk, jij werkt, wij werken', fr: 'Bonne nouvelle : le présent néerlandais n’a que trois formes.' },
      { t: 'conj', verb: 'werk|en', vfr: 'travailler', rows: [['ik', 'werk', 'je travaille'], ['jij', 'werk|t', 'tu travailles'], ['hij / zij', 'werk|t', 'il, elle travaille'], ['wij', 'werk|en', 'nous travaillons'], ['jullie', 'werk|en', 'vous travaillez'], ['zij', 'werk|en', 'ils travaillent']], fr: 'Ik prend le radical seul. Jij et hij ajoutent un t. Le pluriel reprend l’infinitif.' },
      { t: 'quiz', q: 'Zij ___ in Gent.', hint: 'wonen, zij (elle)', opts: ['woont', 'woon', 'wonen'], a: 'woont', expl: 'Elle habite à Gand.', fr: 'À toi.' },
      { t: 'ex', h: 'L’orthographe du radical', ex: [['maken : ik *maak*', 'voyelle longue seule : on la double'], ['zitten : ik *zit*', 'consonne double : on en garde une'], ['leven : ik *leef*', 'jamais de v à la fin : f']], fr: 'Le radical s’écrit parfois différemment de l’infinitif, mais il se prononce pareil.' },
      { t: 'quiz', q: 'Ik ___ een boek.', hint: 'lezen, ik', opts: ['lees', 'les', 'leez'], a: 'lees', expl: 'Lezen donne ik lees : voyelle doublée, z devient s.', fr: 'Dernière question.' },
    ],
  },

  vragen: {
    yt: 'néerlandais poser une question débutant',
    scenes: [
      { t: 'title', h: 'Poser une question', sub: 'Le verbe passe devant', fr: 'Pour poser une question, on inverse simplement le sujet et le verbe.' },
      { t: 'move', from: 'Jij woont in Brussel.', to: '*Woon* jij in Brussel?', note: 'Avec jij derrière le verbe, le t disparaît : woon jij.', fr: 'Le verbe passe en première position.' },
      { t: 'quiz', q: '___ jij Nederlands?', hint: 'spreken, question avec jij', opts: ['Spreek', 'Spreekt', 'Spreken'], a: 'Spreek', expl: 'Parles-tu néerlandais ? Le t disparaît devant jij.', fr: 'À toi.' },
      { t: 'ex', h: 'Les mots interrogatifs', ex: [['*Waar* woon je?', 'Où habites-tu ?'], ['*Hoe* heet je?', 'Comment t’appelles-tu ?'], ['*Wat* doe je?', 'Que fais-tu ?'], ['*Hoeveel* kost het?', 'Combien ça coûte ?']], fr: 'Mot interrogatif, puis le verbe, puis le sujet.' },
      { t: 'quiz', q: '___ heet je?', hint: 'Comment', opts: ['Hoe', 'Wat', 'Waar'], a: 'Hoe', fr: 'Dernière question : la première qu’on te posera.' },
    ],
  },

  de_het: {
    yt: 'néerlandais de het een articles',
    scenes: [
      { t: 'title', h: 'De, het, een', sub: 'Les articles', fr: 'Deux articles définis, de et het, et un seul indéfini, een.' },
      { t: 'vs', a: { h: 'DE', sub: 'environ deux noms sur trois', ex: [['*de* man', 'l’homme'], ['*de* stad', 'la ville']] }, b: { h: 'HET', sub: 'un tiers des noms', ex: [['*het* huis', 'la maison'], ['*het* boek', 'le livre']] }, fr: 'Il n’y a pas de règle simple : apprends chaque nom avec son article.' },
      { t: 'tip', tip: 'Trois aides : au <b>pluriel</b>, toujours <b>de</b>. Les diminutifs en <b>-je</b> sont toujours <b>het</b>. Et <b>een</b> sert pour tous.', ex: [['het huis, *de* huizen', 'la maison, les maisons'], ['*het* broodje', 'le petit pain'], ['*een* huis, *een* man', 'une maison, un homme']], fr: 'Ces trois règles marchent à tous les coups.' },
      { t: 'quiz', q: '___ broodje met kaas, alstublieft.', hint: 'Article défini (diminutif en -je)', opts: ['Het', 'De'], a: 'Het', expl: 'Les mots en -je sont toujours het.', fr: 'À toi.' },
      { t: 'quiz', q: '___ kinderen spelen buiten.', hint: 'Article défini (pluriel)', opts: ['De', 'Het'], a: 'De', expl: 'Au pluriel, toujours de.', fr: 'Dernière question.' },
    ],
  },

  negatie: {
    yt: 'néerlandais niet geen négation',
    scenes: [
      { t: 'title', h: 'Niet of geen', sub: 'La négation', fr: 'Deux mots pour dire non : geen devant un nom, niet partout ailleurs.' },
      { t: 'move', from: 'Ik heb een auto.', to: 'Ik heb *geen* auto.', note: 'Geen remplace een, ou se place devant un nom sans article.', fr: 'Geen veut dire « pas de ».' },
      { t: 'ex', ex: [['Ik drink *geen* koffie.', 'Je ne bois pas de café.'], ['Ik werk *niet*.', 'Je ne travaille pas.'], ['Het is *niet* duur.', 'Ce n’est pas cher.']], fr: 'Geen devant un nom. Niet avec un verbe ou un adjectif.' },
      { t: 'quiz', q: 'Ik heb ___ tijd.', hint: 'Négation devant un nom sans article', opts: ['geen', 'niet'], a: 'geen', expl: 'Je n’ai pas le temps.', fr: 'À toi.' },
      { t: 'tip', tip: '<b>Niet</b> se place souvent en fin de phrase, mais <b>avant</b> un lieu ou un deuxième verbe.', ex: [['Ik ga *niet* naar Gent.', 'Je ne vais pas à Gand.'], ['Ik kan *niet* komen.', 'Je ne peux pas venir.']], fr: 'Écoute où tombe niet.' },
      { t: 'quiz', q: 'Ik begrijp het ___.', hint: 'Négation d’un verbe', opts: ['niet', 'geen'], a: 'niet', expl: 'Je ne comprends pas.', fr: 'Dernière question : une phrase de secours très utile.' },
    ],
  },

  getallen: {
    yt: 'néerlandais nombres heure half drie',
    scenes: [
      { t: 'title', h: 'Nombres et heure', sub: 'Eenentwintig, half drie', fr: 'Deux pièges pour un francophone : les unités avant les dizaines, et la demi-heure.' },
      { t: 'ex', ex: [['21 : *eenentwintig*', 'un-et-vingt'], ['35 : *vijfendertig*', 'cinq-et-trente'], ['48 : *achtenveertig*', 'huit-et-quarante']], fr: 'Après vingt, on dit les unités d’abord, comme en allemand.' },
      { t: 'quiz', q: '42 : ___', hint: 'Nombre en néerlandais', opts: ['tweeënveertig', 'veertigtwee', 'vierentwintig'], a: 'tweeënveertig', say: 'tweeënveertig', fr: 'À toi.' },
      { t: 'ex', h: 'L’heure', ex: [['Het is *drie uur*.', 'Il est trois heures.'], ['Het is *half drie*.', 'Il est deux heures et demie.'], ['Het is *kwart over vier*.', 'Il est quatre heures et quart.'], ['Het is *kwart voor vijf*.', 'Il est cinq heures moins le quart.']], fr: 'Half drie, c’est la moitié du chemin vers trois heures : deux heures et demie.' },
      { t: 'quiz', q: 'Half negen = ___', hint: 'L’heure en français', opts: ['8 h 30', '9 h 30', '9 h 00'], a: '8 h 30', say: 'Het is half negen.', expl: 'La moitié vers neuf heures.', fr: 'Dernière question : le piège n° 1.' },
    ],
  },

  modaal: {
    yt: 'néerlandais kunnen willen moeten mogen',
    scenes: [
      { t: 'title', h: 'Pouvoir, vouloir, devoir', sub: 'kunnen, willen, moeten, mogen', fr: 'Quatre verbes indispensables pour demander, proposer et s’organiser.' },
      { t: 'conj', rows: [['ik', 'kan', 'je peux'], ['ik', 'wil', 'je veux'], ['ik', 'moet', 'je dois'], ['ik', 'mag', 'j’ai le droit']], fr: 'Au singulier, une forme courte. Au pluriel, l’infinitif : wij kunnen, wij willen.' },
      { t: 'move', from: 'Ik drink een koffie.', to: 'Ik *wil* een koffie *drinken*.', note: 'Le deuxième verbe part à la fin de la phrase.', fr: 'Avec un verbe modal, l’infinitif file tout au bout.' },
      { t: 'quiz', q: 'Ik moet morgen ___.', hint: 'werken, place du deuxième verbe', opts: ['werken', 'werk', 'werkt'], a: 'werken', expl: 'Je dois travailler demain.', fr: 'À toi.' },
      { t: 'ex', h: 'Être poli', ex: [['Ik wil *graag* een koffie.', 'Je voudrais un café.'], ['*Mag ik* de rekening?', 'Puis-je avoir l’addition ?'], ['*Kunt u* mij helpen?', 'Pouvez-vous m’aider ?']], fr: 'Trois phrases à savoir par cœur pour le café, le restaurant et la rue.' },
      { t: 'quiz', q: '___ ik betalen met de kaart?', hint: 'Demander la permission', opts: ['Mag', 'Moet', 'Wil'], a: 'Mag', expl: 'Puis-je payer par carte ?', fr: 'Dernière question.' },
    ],
  },

  woordvolgorde: {
    yt: 'néerlandais ordre des mots verbe en deuxième position',
    scenes: [
      { t: 'title', h: 'L’ordre des mots', sub: 'Le verbe en deuxième position', fr: 'La règle d’or du néerlandais : le verbe conjugué est toujours le deuxième élément de la phrase.' },
      { t: 'move', from: 'Ik ga morgen naar Gent.', to: 'Morgen *ga ik* naar Gent.', note: 'Morgen prend la première place ; le verbe reste deuxième, le sujet passe derrière.', fr: 'Si la phrase commence par autre chose que le sujet, le sujet passe après le verbe.' },
      { t: 'quiz', q: 'Vandaag ___ thuis.', hint: 'werken, ik, verbe en 2e position', opts: ['werk ik', 'ik werk'], a: 'werk ik', expl: 'Aujourd’hui, je travaille à la maison.', fr: 'À toi.' },
      { t: 'move', from: 'Ik werk thuis.', to: 'Ik *heb* thuis *gewerkt*.', note: 'L’auxiliaire reste deuxième ; le participe part à la fin.', fr: 'Avec deux verbes, le second file à la fin, comme une pince.' },
      { t: 'tip', tip: 'Après <b>omdat</b> (parce que), <b>dat</b> (que) et <b>als</b> (si, quand), <b>tous</b> les verbes partent à la fin.', ex: [['Ik leer Nederlands *omdat* ik in België *woon*.', 'J’apprends le néerlandais parce que j’habite en Belgique.']], fr: 'Écoute bien : woon arrive tout au bout.' },
      { t: 'quiz', q: 'Ik blijf thuis omdat ik ziek ___.', hint: 'zijn, après omdat', opts: ['ben', 'is'], a: 'ben', expl: 'Je reste à la maison parce que je suis malade.', fr: 'Dernière question.' },
    ],
  },

  bezittelijk: {
    yt: 'néerlandais adjectifs possessifs mijn jouw zijn haar',
    scenes: [
      { t: 'title', h: 'Mon, ton, son', sub: 'Les possessifs', fr: 'Les possessifs ne changent pas selon le genre du nom, sauf ons et onze.' },
      { t: 'conj', rows: [['mon, ma, mes', 'mijn'], ['ton, ta, tes', 'jouw'], ['votre (poli)', 'uw'], ['son (à lui)', 'zijn'], ['son (à elle)', 'haar'], ['leur', 'hun']], sayLeft: false, fr: 'Écoute chaque forme. Mijn se prononce comme « mèïn ».' },
      { t: 'vs', a: { h: 'ZIJN', sub: 'à lui', ex: [['Tom en *zijn* zus', 'Tom et sa sœur']] }, b: { h: 'HAAR', sub: 'à elle', ex: [['Anna en *haar* broer', 'Anna et son frère']] }, fr: 'Contrairement au français, on regarde le possesseur : un homme, zijn ; une femme, haar.' },
      { t: 'quiz', q: 'Lisa belt ___ moeder.', hint: 'Possessif (à elle)', opts: ['haar', 'zijn'], a: 'haar', expl: 'Lisa appelle sa mère.', fr: 'À toi.' },
      { t: 'quiz', q: 'Dit is ___ fiets, niet de jouwe.', hint: 'Possessif : mon', opts: ['mijn', 'jouw', 'uw'], a: 'mijn', expl: 'C’est mon vélo, pas le tien.', fr: 'Dernière question.' },
    ],
  },

  meervoud: {
    yt: 'néerlandais pluriel en s',
    scenes: [
      { t: 'title', h: 'Le pluriel', sub: '-en ou -s', fr: 'Deux terminaisons pour le pluriel : -en pour la plupart des mots, -s pour certains.' },
      { t: 'conj', rows: [['het boek', 'de boek|en', 'les livres'], ['de les', 'de less|en', 'les leçons'], ['de straat', 'de strat|en', 'les rues']], sayLeft: false, fr: 'Avec -en, l’orthographe s’adapte pour garder le son : less-en, strat-en.' },
      { t: 'conj', rows: [['de tafel', 'de tafel|s', 'les tables'], ['het broodje', 'de broodje|s', 'les petits pains'], ['de computer', 'de computer|s', 'les ordinateurs']], sayLeft: false, fr: 'Avec -s : les mots en -el, -er, -je, et beaucoup de mots étrangers.' },
      { t: 'quiz', q: 'twee ___', hint: 'Pluriel de « de tafel »', opts: ['tafels', 'tafelen', 'tafel'], a: 'tafels', fr: 'À toi.' },
      { t: 'ex', h: 'Deux irréguliers fréquents', ex: [['het kind, de *kinderen*', 'l’enfant, les enfants'], ['de stad, de *steden*', 'la ville, les villes']], fr: 'À retenir tels quels.' },
      { t: 'quiz', q: 'Ik heb drie ___.', hint: 'Pluriel de « het boek »', opts: ['boeken', 'boeks', 'boekken'], a: 'boeken', expl: 'J’ai trois livres.', fr: 'Dernière question.' },
    ],
  },

  registro: {
    yt: 'néerlandais jij ou u politesse',
    scenes: [
      { t: 'title', h: 'Jij ou u', sub: 'Tutoyer ou vouvoyer', fr: 'En Flandre, on tutoie assez vite. Mais avec un inconnu plus âgé, un client ou l’administration, on dit u.' },
      { t: 'vs', a: { h: 'JIJ', sub: 'amis, collègues, étudiants', ex: [['Hoe gaat het met *jou*?', 'Comment vas-tu ?'], ['Dank *je* wel.', 'Merci.']] }, b: { h: 'U', sub: 'inconnus, clients, professeurs', ex: [['Hoe gaat het met *u*?', 'Comment allez-vous ?'], ['Dank *u* wel.', 'Merci.']] }, fr: 'Même phrase, deux registres.' },
      { t: 'ex', ex: [['*U bent* welkom.', 'Vous êtes le bienvenu.'], ['*Kunt u* dat herhalen?', 'Pouvez-vous répéter ?'], ['*Alstublieft.*', 'S’il vous plaît, voici.']], fr: 'Avec u, le verbe se conjugue comme avec jij : u bent, u kunt.' },
      { t: 'quiz', q: 'Kunt ___ mij helpen, meneer?', hint: 'Vouvoiement', opts: ['u', 'jij', 'jullie'], a: 'u', expl: 'Pouvez-vous m’aider, monsieur ?', fr: 'À toi.' },
      { t: 'quiz', q: 'Dank ___ wel, Tom!', hint: 'Tutoiement, entre amis', opts: ['je', 'u'], a: 'je', fr: 'Dernière question.' },
    ],
  },

  perfectum: {
    yt: 'néerlandais perfectum passé composé t kofschip',
    scenes: [
      { t: 'title', h: 'Le passé composé', sub: 'Het perfectum', fr: 'Comme en français : un auxiliaire, hebben ou zijn, et un participe. Mais le participe part à la fin.' },
      { t: 'timeline', events: [{ kind: 'point', at: -0.55, tl: 'Ik *heb* gisteren *gewerkt*.', fr: 'J’ai travaillé hier.' }], fr: 'Écoute : heb est en deuxième position, gewerkt tout au bout.' },
      { t: 'conj', rows: [['werken', 'ge|werkt', 'travaillé'], ['wonen', 'ge|woond', 'habité'], ['spelen', 'ge|speeld', 'joué']], sayLeft: false, fr: 'Ge, puis le radical, puis t ou d.' },
      { t: 'tip', tip: 'T ou d ? Si le radical finit par une lettre de <b>’t kofschip</b> (t, k, f, s, ch, p), on met <b>t</b>. Sinon, <b>d</b>.', ex: [['Ik heb *gefietst*.', 'J’ai fait du vélo : fiets finit par s.'], ['Ik heb in Gent *gewoond*.', 'J’ai habité à Gand : woon finit par n.']], fr: 'Le mot magique : ’t kofschip.' },
      { t: 'quiz', q: 'Wij hebben voetbal ___.', hint: 'spelen, participe', opts: ['gespeeld', 'gespeelt', 'speeld'], a: 'gespeeld', expl: 'Speel ne finit pas par une lettre de ’t kofschip : d.', fr: 'À toi.' },
      { t: 'vs', a: { h: 'HEBBEN', sub: 'la plupart des verbes', ex: [['Ik *heb* gegeten.', 'J’ai mangé.']] }, b: { h: 'ZIJN', sub: 'aller vers un but, changer d’état', ex: [['Ik *ben* naar Gent gegaan.', 'Je suis allé à Gand.']] }, fr: 'Zijn pour les déplacements vers un but et les changements, comme être en français.' },
      { t: 'quiz', q: 'Hij ___ naar Antwerpen gegaan.', hint: 'Auxiliaire (déplacement)', opts: ['is', 'heeft'], a: 'is', expl: 'Il est allé à Anvers.', fr: 'Dernière question.' },
    ],
  },

  bijvoeglijk: {
    yt: 'néerlandais adjectif terminaison e groot grote',
    scenes: [
      { t: 'title', h: 'Groot ou grote ?', sub: 'L’adjectif', fr: 'L’adjectif prend un e devant le nom, avec une seule exception.' },
      { t: 'vs', a: { h: 'APRÈS LE NOM', sub: 'il ne change pas', ex: [['Het huis is *groot*.', 'La maison est grande.']] }, b: { h: 'DEVANT LE NOM', sub: 'on ajoute -e', ex: [['het *grote* huis', 'la grande maison']] }, fr: 'Après is ou zijn, l’adjectif reste nu. Devant le nom, il prend un e.' },
      { t: 'ex', ex: [['de *grote* man', 'le grand homme'], ['een *grote* man', 'un grand homme'], ['*grote* huizen', 'de grandes maisons'], ['een *groot* huis', 'une grande maison : pas de e']], fr: 'L’exception : een, puis un mot en het au singulier. Là, pas de e.' },
      { t: 'quiz', q: 'Ik woon in een ___ huis.', hint: 'Adjectif : een + mot en het', opts: ['klein', 'kleine'], a: 'klein', expl: 'Een + huis (het) : pas de e.', fr: 'À toi : l’exception.' },
      { t: 'quiz', q: 'Ik drink een ___ koffie.', hint: 'Adjectif : een + mot en de (warm)', opts: ['warme', 'warm'], a: 'warme', expl: 'Koffie est un mot en de : warme.', fr: 'Dernière question.' },
    ],
  },

  scheidbaar: {
    yt: 'néerlandais verbes séparables opstaan',
    scenes: [
      { t: 'title', h: 'Les verbes séparables', sub: 'opstaan, opbellen, meenemen', fr: 'Certains verbes ont une particule qui se détache et part à la fin de la phrase.' },
      { t: 'move', from: 'opstaan', to: 'Ik *sta* om zeven uur *op*.', note: 'Je me lève à sept heures : sta en deuxième position, op tout au bout.', fr: 'Au présent, le verbe se coupe en deux.' },
      { t: 'ex', ex: [['Ik *bel* je morgen *op*.', 'Je t’appelle demain.'], ['Ik *neem* een paraplu *mee*.', 'Je prends un parapluie.'], ['De trein *komt* om tien uur *aan*.', 'Le train arrive à dix heures.']], fr: 'Écoute la particule qui arrive en fin de phrase : op, mee, aan.' },
      { t: 'quiz', q: 'Ik neem mijn laptop ___.', hint: 'meenemen, particule', opts: ['mee', 'op', 'aan'], a: 'mee', expl: 'J’emporte mon ordinateur.', fr: 'À toi.' },
      { t: 'tip', tip: 'Avec un deuxième verbe, la particule reste <b>collée</b>. Au participe, <b>ge</b> se glisse au milieu.', ex: [['Ik moet vroeg *opstaan*.', 'Je dois me lever tôt.'], ['Ik ben vroeg *opgestaan*.', 'Je me suis levé tôt.']], fr: 'Opstaan reste entier ; opgestaan prend ge au milieu.' },
      { t: 'quiz', q: 'Ik heb je gisteren ___.', hint: 'opbellen, participe', opts: ['opgebeld', 'geopbeld', 'opbeld'], a: 'opgebeld', expl: 'Je t’ai appelé hier.', fr: 'Dernière question.' },
    ],
  },
};
