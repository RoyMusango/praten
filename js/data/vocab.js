// Corpus de vocabulaire (débutant) : "néerlandais | français | synonymes (séparés par ;)"
// Les noms sont donnés avec leur article (de / het). (BE) = usage courant en Flandre.
(function (global) {
  const RAW = {
    basis: { label: 'Les bases : saluer, remercier', prio: 1, words: `
hallo | bonjour, salut | hoi; dag (BE)
dag | bonjour, au revoir (BE) | hallo; tot ziens
goedemorgen | bonjour (le matin) | morgen
goedemiddag | bonjour (l’après-midi) |
goedenavond | bonsoir |
goedenacht | bonne nuit | slaapwel
tot ziens | au revoir | dag; daag
tot straks | à tout à l’heure | tot zo
tot morgen | à demain |
dank je wel | merci (tu) | bedankt; merci (BE)
dank u wel | merci (vous) | bedankt
alsjeblieft | s’il te plaît, voilà (tu) | alstublieft (vous)
alstublieft | s’il vous plaît, voilà | alsjeblieft (tu)
graag gedaan | avec plaisir, de rien | geen dank
sorry | pardon, désolé | excuseer (BE); pardon
ja | oui |
nee | non | neen (BE)
oké | d’accord | goed; in orde
Hoe gaat het? | Comment ça va ? | Alles goed?
Goed, en met jou? | Bien, et toi ? | Prima, en jij?
Hoe heet je? | Comment t’appelles-tu ? | Wat is je naam?
Ik heet … | Je m’appelle… | Mijn naam is …
Aangenaam. | Enchanté. | Leuk je te ontmoeten.
Welkom! | Bienvenue ! |
` },
    zinnen: { label: 'Phrases de survie', prio: 1, words: `
Ik begrijp het niet. | Je ne comprends pas. | Ik versta het niet.
Kunt u dat herhalen? | Pouvez-vous répéter ? | Nog een keer, alstublieft?
Langzaam, alstublieft. | Lentement, s’il vous plaît. | Wat trager, alstublieft.
Spreekt u Frans? | Parlez-vous français ? |
Spreekt u Engels? | Parlez-vous anglais ? |
Ik spreek een beetje Nederlands. | Je parle un peu néerlandais. |
Ik leer Nederlands. | J’apprends le néerlandais. |
Hoe zeg je … in het Nederlands? | Comment dit-on … en néerlandais ? |
Wat betekent …? | Que signifie … ? |
Ik weet het niet. | Je ne sais pas. |
Geen probleem. | Pas de problème. | Geen zorgen.
Waar is …? | Où est … ? |
Hoeveel kost het? | Combien ça coûte ? | Wat kost het?
Ik wil graag … | Je voudrais… | Mag ik … ?
Mag ik …? | Puis-je… ? |
Ik ben Belg. | Je suis belge. |
Ik kom uit Brussel. | Je viens de Bruxelles. |
Ik ben student. | Je suis étudiant. |
` },
    getallen: { label: 'Nombres', prio: 1, words: `
nul | zéro |
een | un | één (avec accent quand on insiste)
twee | deux |
drie | trois |
vier | quatre |
vijf | cinq |
zes | six |
zeven | sept |
acht | huit |
negen | neuf |
tien | dix |
elf | onze |
twaalf | douze |
dertien | treize |
veertien | quatorze |
vijftien | quinze |
twintig | vingt |
eenentwintig | vingt et un (« un-et-vingt ») |
dertig | trente |
veertig | quarante |
vijftig | cinquante |
honderd | cent |
duizend | mille |
de euro | l’euro |
` },
    tijd: { label: 'Temps : jours, heures, moments', prio: 1, words: `
vandaag | aujourd’hui |
morgen | demain |
gisteren | hier |
nu | maintenant | nu meteen
straks | tout à l’heure | zo meteen
later | plus tard |
altijd | toujours |
nooit | jamais |
soms | parfois | af en toe
vaak | souvent |
de dag | le jour |
de week | la semaine |
het weekend | le week-end |
de maand | le mois |
het jaar | l’année |
maandag | lundi |
dinsdag | mardi |
woensdag | mercredi |
donderdag | jeudi |
vrijdag | vendredi |
zaterdag | samedi |
zondag | dimanche |
het uur | l’heure (om drie uur = à trois heures) |
Hoe laat is het? | Quelle heure est-il ? | Hoe laat?
half drie | deux heures et demie (!) | 14.30 uur
kwart over vier | quatre heures et quart |
de ochtend | le matin | de morgen
de middag | l’après-midi |
de avond | le soir |
de nacht | la nuit |
` },
    personen: { label: 'Personnes & famille', prio: 1, words: `
ik | je |
jij | tu | je
u | vous (politesse) |
hij | il |
zij | elle, ils | ze
wij | nous | we
jullie | vous (pluriel) |
de man | l’homme, le mari |
de vrouw | la femme |
het kind | l’enfant | de kinderen (pluriel)
de vriend | l’ami | de maat (BE)
de vriendin | l’amie, la petite amie |
de familie | la famille |
de vader | le père | papa
de moeder | la mère | mama
de broer | le frère |
de zus | la sœur | de zuster
de ouders | les parents |
de collega | le collègue |
de buur | le voisin | de buurman
` },
    werkwoorden: { label: 'Verbes essentiels', prio: 1, words: `
zijn | être |
hebben | avoir |
gaan | aller |
komen | venir |
doen | faire |
maken | faire, fabriquer |
kunnen | pouvoir |
willen | vouloir |
moeten | devoir |
mogen | avoir le droit, pouvoir |
weten | savoir |
kennen | connaître |
zien | voir |
kijken | regarder |
horen | entendre |
luisteren | écouter |
spreken | parler (une langue) | praten (bavarder)
zeggen | dire |
vragen | demander |
antwoorden | répondre |
eten | manger |
drinken | boire |
werken | travailler |
wonen | habiter |
leren | apprendre |
studeren | étudier |
lezen | lire |
schrijven | écrire |
kopen | acheter |
betalen | payer |
wachten | attendre |
nemen | prendre |
geven | donner |
zoeken | chercher |
vinden | trouver, penser (= trouver que) |
begrijpen | comprendre | verstaan
helpen | aider |
` },
    bijvoeglijk: { label: 'Adjectifs de base', prio: 1, words: `
goed | bon, bien |
slecht | mauvais |
groot | grand |
klein | petit |
mooi | beau | schoon (BE)
lekker | bon (nourriture), délicieux |
leuk | sympa, chouette | plezant (BE); tof
duur | cher |
goedkoop | bon marché |
nieuw | nouveau |
oud | vieux |
jong | jeune |
warm | chaud |
koud | froid |
moe | fatigué |
blij | content | content (BE)
druk | occupé, animé |
rustig | calme |
snel | rapide |
traag | lent | langzaam
makkelijk | facile | gemakkelijk
moeilijk | difficile |
belangrijk | important |
` },
    vragen: { label: 'Mots interrogatifs', prio: 1, words: `
wie | qui |
wat | quoi, que |
waar | où |
wanneer | quand |
hoe | comment |
waarom | pourquoi |
hoeveel | combien |
welk / welke | quel, quelle |
hoe laat | à quelle heure |
waar … vandaan? | d’où ? | Waar kom je vandaan?
` },
    eten: { label: 'Manger et boire', prio: 2, words: `
de koffie | le café |
de thee | le thé |
het water | l’eau | plat water / bruiswater
het bier | la bière | een pintje (BE)
de wijn | le vin |
het brood | le pain |
het broodje | le sandwich, le petit pain |
de kaas | le fromage |
de friet | les frites | frietjes (BE)
de wafel | la gaufre |
de soep | la soupe |
het vlees | la viande |
de vis | le poisson |
de groenten | les légumes |
het fruit | les fruits |
de appel | la pomme |
het ontbijt | le petit-déjeuner |
de lunch | le déjeuner | het middageten
het avondeten | le dîner |
de rekening | l’addition |
Smakelijk! | Bon appétit ! | Eet smakelijk!
Gezondheid! | Santé ! (et « à vos souhaits ») | Santé! (BE)
Een koffie, alstublieft. | Un café, s’il vous plaît. |
Mag ik de rekening? | L’addition, s’il vous plaît ? | De rekening, alstublieft.
het café | le café (lieu) |
de bakker | la boulangerie, le boulanger | de bakkerij
de supermarkt | le supermarché |
` },
    stad: { label: 'En ville, se déplacer', prio: 2, words: `
de stad | la ville |
de straat | la rue |
het station | la gare |
de trein | le train |
de tram | le tram |
de bus | le bus |
de fiets | le vélo |
de auto | la voiture | de wagen (BE)
het kaartje | le ticket | het ticket; het biljet
enkel | aller simple |
heen en terug | aller-retour | retour (BE)
links | à gauche |
rechts | à droite |
rechtdoor | tout droit |
dichtbij | près |
ver | loin |
de halte | l’arrêt |
het perron | le quai | het spoor
de winkel | le magasin |
de apotheek | la pharmacie |
de bank | la banque, le banc |
het ziekenhuis | l’hôpital |
de markt | le marché, la grand-place |
` },
    huis: { label: 'Logement', prio: 2, words: `
het huis | la maison |
het appartement | l’appartement |
het kot | le kot, la chambre d’étudiant (BE) | de studentenkamer
de kamer | la chambre, la pièce |
de keuken | la cuisine |
de badkamer | la salle de bain |
het toilet | les toilettes | de wc
de tafel | la table |
de stoel | la chaise |
het bed | le lit |
de deur | la porte |
het raam | la fenêtre |
de sleutel | la clé |
de huur | le loyer |
` },
    werk: { label: 'Études & travail', prio: 2, words: `
het werk | le travail | de job (BE)
de universiteit | l’université | de unief (BE)
de student | l’étudiant |
de les | le cours |
het examen | l’examen |
de stage | le stage |
het kantoor | le bureau (lieu) |
de computer | l’ordinateur | de pc
de vergadering | la réunion |
de baas | le patron | de chef
de collega | le collègue |
het bedrijf | l’entreprise | de firma
het geld | l’argent | de centen (BE, familier)
de rekening | le compte (en banque), la facture |
de lening | le prêt |
de kunstmatige intelligentie | l’intelligence artificielle | AI; KI
de gegevens | les données | de data
het programma | le programme |
de ingenieur | l’ingénieur |
blokken | réviser, bûcher (BE) | studeren
` },
    weer: { label: 'Météo', prio: 3, words: `
het weer | le temps (météo) |
de zon | le soleil |
de regen | la pluie |
het regent | il pleut |
de wind | le vent |
de sneeuw | la neige |
Het is koud. | Il fait froid. |
Het is warm. | Il fait chaud. |
Wat een weer! | Quel temps ! | Wat een rotweer! (sale temps)
` },
    voetbal: { label: 'Football & loisirs', prio: 3, words: `
het voetbal | le football |
de match | le match | de wedstrijd
de ploeg | l’équipe (BE) | het team; de club
het doelpunt | le but | de goal
scoren | marquer |
winnen | gagner |
verliezen | perdre |
gelijkspel | match nul |
de supporter | le supporter | de fan
de hobby | le hobby |
de film | le film |
de muziek | la musique |
sporten | faire du sport |
` },
    vlaams: { label: 'Le flamand du quotidien', prio: 3, words: `
amai | waouw, oh là là (BE) | wauw
allee | allez, bon (BE) | kom op
goesting hebben | avoir envie (BE) | zin hebben
efkes | un instant (BE) | even
ambetant | embêtant (BE) | vervelend
plezant | agréable, chouette (BE) | leuk; fijn
de gsm | le portable (BE) | de mobiele telefoon
een babbeltje slaan | taper la causette (BE) | wat praten
Santé! | Santé ! (BE) | Proost!; Gezondheid!
Merci! | Merci ! (BE) | Dank je wel!
` },
  };

  const THEMES = {};
  const WORDS = [];
  for (const [id, t] of Object.entries(RAW)) {
    THEMES[id] = { id, label: t.label, course: !!t.course, prio: t.prio, count: 0 };
    for (const line of t.words.split('\n')) {
      if (!line.trim()) continue;
      const [tl, fr, syn] = line.split('|').map(s => (s || '').trim());
      WORDS.push({ id: id + ':' + tl, theme: id, tl, fr, syn: syn ? syn.split(';').map(s => s.trim()).filter(Boolean) : [] });
      THEMES[id].count++;
    }
  }
  global.VOCAB = { THEMES, WORDS };
})(typeof window !== 'undefined' ? window : globalThis);
