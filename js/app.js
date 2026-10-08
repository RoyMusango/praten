// Interface de l'application (moteur commun aux apps de langues).
// Tout ce qui dépend de la langue vient de LANG (js/lang.js), de Conj (js/conjugator.js) et des données (js/data).
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const view = $('#view');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const S = () => Store.settings;
  const L = LANG, T = LANG.t, N = LANG.nav;
  const topicLabel = id => (GRAMMAR.TOPICS[id] && GRAMMAR.TOPICS[id].label) || GRAMMAR.EXTRA_TOPICS[id] || id;
  const pct = x => Math.round(x * 100);
  const meterCls = p => p < 45 ? 'low' : p < 70 ? 'mid' : 'high';
  const SOUNDS_ON = typeof SOUNDS !== 'undefined' && SOUNDS.length;

  // ---------- Icônes ----------
  const ICONS = {
    mic: '<path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"/><path d="M19 11a7 7 0 0 1-14 0M12 18v3"/>',
    stop: '<rect x="7" y="7" width="10" height="10" rx="1.5"/>',
    sound: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
    buoy: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    flame: '<path d="M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 0-8z"/>',
  };
  const icon = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]}</svg>`;
  const sayBtn = (text, title = 'Écouter') => `<button class="say" data-say="${esc(text)}" title="${title}">${icon('sound')}</button>`;
  // Vitesse de lecture : réglable partout (menu de l'en-tête) et en boutons dans la conversation et la lecture
  const SPEEDS = [0.75, 1, 1.25, 1.5, 2];
  const isRate = r => Math.abs(S().ttsRate - r) < 0.01;
  const speedChips = () => `<div class="speed" role="group" aria-label="Vitesse de lecture">${SPEEDS.map(r => `<button class="${isRate(r) ? 'on' : ''}" data-rate="${r}" title="Vitesse ${r}×">${r}×</button>`).join('')}</div>`;
  function syncSpeed() {
    const sel = $('#speedSel'), r = S().ttsRate;
    if (sel) sel.innerHTML = [...new Set([...SPEEDS, r])].sort((a, b) => a - b).map(x => `<option value="${x}" ${Math.abs(r - x) < 0.01 ? 'selected' : ''}>${x}×</option>`).join('');
    $$('[data-rate]').forEach(b => b.classList.toggle('on', isRate(+b.dataset.rate)));
    const rv = $('#rateV'), ri = $('#rate'); if (rv) rv.textContent = r; if (ri) ri.value = r;
  }
  function setSpeed(r) { S().ttsRate = r; Store.save(); syncSpeed(); Speech.repeat(); }

  // ---------- En-tête : marque et navigation ----------
  document.title = L.title;
  $('.brand').innerHTML = `<span class="brand-mark"></span>${esc(L.appName)}`;
  const NAV = ['today', 'speak', 'words', 'verbs', ...(SOUNDS_ON ? ['sounds'] : []), 'grammar', 'read', 'progress'];
  $('#nav').innerHTML = NAV.map(k => `<a href="#${k}" data-view="${k}">${esc(N[k])}</a>`).join('');
  $('#gearLink').href = '#settings';
  $('#gearLink').innerHTML = icon('gear');
  $('#fabBouee').innerHTML = icon('buoy') + '<span>Un mot me manque</span>';

  // ---------- Comparaison de réponses ----------
  const stripAccents = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const norm = s => String(s).toLowerCase().replace(/[’`]/g, "'").replace(/\(.*?\)/g, ' ').replace(/[¿?¡!.,;:«»"…]/g, ' ').replace(/\s+/g, ' ').trim();
  const noArticle = s => s.replace(L.normalize.articles, '');
  const noPronoun = s => s.replace(L.normalize.pronouns, '');
  function lev(a, b) {
    const m = a.length, n = b.length; if (Math.abs(m - n) > 2) return 3;
    const d = Array.from({ length: m + 1 }, (_, i) => [i]);
    for (let j = 1; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  // Résultat : 'ok' | 'accents' | 'typo' | 'wrong'
  function compare(answer, accepted, { loose = false, pronoun = false } = {}) {
    let a = norm(answer); if (!a) return 'wrong';
    if (pronoun) a = noPronoun(a);
    const variants = [];
    for (const x of accepted) for (const v of String(x).split('/')) { let n = norm(v); if (pronoun) n = noPronoun(n); if (n) variants.push(n, noArticle(n)); }
    const aa = [a, noArticle(a)];
    if (variants.some(v => aa.includes(v))) return 'ok';
    if (variants.some(v => aa.map(stripAccents).includes(stripAccents(v)))) return 'accents';
    if (loose && variants.some(v => v.length > 5 && aa.some(x => lev(stripAccents(x), stripAccents(v)) <= 1))) return 'typo';
    return 'wrong';
  }

  // ---------- Suivi du temps de pratique ----------
  let area = null, lastActivity = 0, currentListener = null;
  ['pointerdown', 'keydown', 'input'].forEach(ev => document.addEventListener(ev, () => { lastActivity = Date.now(); }, true));
  setInterval(() => {
    const listening = currentListener && currentListener.active;
    if (area && document.visibilityState === 'visible' && (listening || Date.now() - lastActivity < 90000)) {
      Store.day().min[area] += 0.25; Store.save(); updateChip();
    }
  }, 15000);
  function updateChip() {
    const m = Math.floor(Store.totalMin(Store.today())), goal = S().dailyMinutes;
    const chip = $('#todayChip');
    chip.classList.toggle('done', m >= goal);
    const ss = Sync.enabled() ? Sync.status.state : 'off';
    const sTitle = { ok: 'Synchronisé', syncing: 'Synchronisation…', error: 'Synchro en erreur : ' + (Sync.status.error || ''), off: 'Synchro désactivée' }[ss];
    chip.innerHTML = `<span>${m} / ${goal} min</span><span class="mini"><i style="width:${Math.min(100, m / goal * 100)}%"></i></span>${ss !== 'off' ? `<span class="sync-dot ${ss}" title="${esc(sTitle)}"></span>` : ''}`;
  }
  window.addEventListener('sync-status', () => updateChip());
  // Données reçues d'un autre appareil : on rafraîchit les pages de synthèse
  window.addEventListener('sync-updated', () => {
    if (['today', 'progress'].includes(currentRoute())) go(); else updateChip();
  });
  function streak() {
    let n = 0, i = Store.totalMin(Store.today()) >= 10 ? 0 : -1;
    while (Store.totalMin(Store.today(i)) >= 10) { n++; i--; }
    return n;
  }
  function planTargets() {
    const D = S().dailyMinutes;
    const vocab = Math.max(3, Math.round(D * 0.2)), gram = Math.max(3, Math.round(D * 0.2));
    return { vocab, gram, conv: Math.max(5, D - vocab - gram) };
  }

  // ---------- Configuration d'un appareil par lien (QR code) ----------
  const PAGES_URL = location.hostname.endsWith('github.io') ? location.origin + location.pathname : L.pagesUrl;
  const b64url = str => btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const fromB64url = str => decodeURIComponent(escape(atob(str.replace(/-/g, '+').replace(/_/g, '/'))));
  function loadScript(src) {
    return new Promise((ok, ko) => {
      if (window.QRCode && /qrcode/.test(src)) return ok();
      const el = document.createElement('script'); el.src = src; el.onload = ok; el.onerror = ko; document.head.appendChild(el);
    });
  }
  function importSetupFromHash() {
    const m = location.hash.match(/^#setup=([\w-]+)/);
    if (!m) return;
    try {
      const p = JSON.parse(fromB64url(m[1]));
      if (p.g) { Store.setSharedKey('geminiKey', p.g); S().provider = 'gemini'; }
      if (p.t && p.r) Sync.setCfg({ token: p.t, repo: p.r });
      Store.save();
      setTimeout(() => toast('Appareil configuré : clé IA et synchro activées pour toutes tes apps de langues.', 5000), 300);
    } catch (e) { }
    history.replaceState(null, '', location.pathname + '#today'); // retire les clés de l'adresse
  }

  // ---------- Toast ----------
  function toast(html, ms = 6000) {
    const t = document.createElement('div');
    t.className = 'notice warn';
    t.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);top:84px;z-index:50;width:min(560px, calc(100% - 32px));box-shadow:0 8px 24px rgba(0,0,0,.15)';
    t.innerHTML = html;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), ms);
  }
  window.addEventListener('tts-missing', e => toast(esc(e.detail) + ' <a href="#settings" class="link">Réglages voix</a>', 9000));

  // ---------- Routeur ----------
  const routes = {};
  // Anciennes adresses de l'app d'espagnol, toujours acceptées
  const ALIASES = { hoy: 'today', hablar: 'speak', palabras: 'words', verbos: 'verbs', gramatica: 'grammar', leer: 'read', progreso: 'progress', ajustes: 'settings' };
  const currentRoute = () => { const n = (location.hash.slice(1) || 'today').split('/')[0]; return ALIASES[n] || n; };
  function go() {
    if (currentListener) currentListener.stop();
    Speech.stopSpeaking();
    document.onkeydown = null;
    document.body.classList.remove('in-chat');
    const parts = location.hash.slice(1).split('/');
    const r = routes[currentRoute()] ? currentRoute() : 'today';
    $$('#nav a').forEach(a => a.classList.toggle('active', a.dataset.view === r));
    area = null;
    routes[r](parts[1], parts[2]);
    window.scrollTo(0, 0);
    updateChip();
  }
  window.addEventListener('hashchange', go);

  document.addEventListener('click', e => { const b = e.target.closest('[data-say]'); if (b) Speech.speak(b.dataset.say); });
  document.addEventListener('click', e => { const b = e.target.closest('[data-rate]'); if (b) setSpeed(+b.dataset.rate); });
  $('#speedSel').onchange = e => setSpeed(+e.target.value);
  syncSpeed();

  function modal(html) {
    $('#modalBox').innerHTML = `<button class="icon-btn close" data-close title="Fermer">${icon('x')}</button>` + html;
    $('#modal').classList.remove('hidden');
    return $('#modalBox');
  }
  function closeModal() { $('#modal').classList.add('hidden'); }
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal' || e.target.closest('[data-close]')) closeModal(); });

  const head = (eyebrow, title, lead = '') => `<div class="page-head"><span class="eyebrow">${eyebrow}</span><h1>${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}</div>`;
  const backLink = (href, label) => `<a href="${href}" class="link small" style="display:inline-flex;gap:6px;text-decoration:none;margin-bottom:18px">${icon('back')} ${esc(label)}</a>`;

  // Bouton micro branché sur un champ texte
  function micFor(btn, input, { onDone, autoSend } = {}) {
    btn.innerHTML = icon('mic');
    if (!Speech.supported) { btn.title = 'Micro indisponible : utilise Chrome ou Edge'; btn.disabled = true; return null; }
    const l = new Speech.Listener({
      onText: (fin, interim) => { input.value = (fin + ' ' + interim).trim(); },
      onState: on => { btn.classList.toggle('rec', on); btn.innerHTML = icon(on ? 'stop' : 'mic'); },
      onAutoStop: txt => onDone && onDone(txt),
    });
    btn.addEventListener('click', () => {
      if (l.active) { const txt = l.stop(); if (autoSend && txt && onDone) onDone(txt); }
      // Mains libres : envoi automatique après un silence, sans avoir à recliquer
      else { currentListener = l; input.value = ''; l.start({ autoStopAfterSilence: autoSend && S().handsFree ? 2500 : 0 }); }
    });
    return l;
  }

  // ---------- Vocabulaire : outils ----------
  const extraThemes = { erreurs: 'Mes erreurs', conversation: 'Mots des conversations', lectures: 'Mots des lectures' };
  const themeLabel = id => (VOCAB.THEMES[id] && VOCAB.THEMES[id].label) || extraThemes[id] || id;
  const allWords = () => [...Store.state.custom, ...VOCAB.WORDS];
  function activeThemes() {
    if (!S().vocabThemes) S().vocabThemes = Object.values(VOCAB.THEMES).filter(t => t.prio <= 1).map(t => t.id);
    return S().vocabThemes;
  }
  const speakable = s => s.replace(/\.\.\./g, ' ').replace(/\(.*?\)/g, '').trim();

  // Mots à faire réentendre en conversation / lecture : ceux que tu oublies, puis les plus récents
  function reviewWords(themes = []) {
    const words = allWords().filter(w => { const c = Store.card(w.id); return c && c.box > 0 && (c.lapses > 0 || c.box <= 2); });
    words.sort((a, b) => (themes.includes(b.theme) - themes.includes(a.theme)) || (Store.card(b.id).lapses - Store.card(a.id).lapses));
    return words.slice(0, 8).map(w => speakable(w.tl));
  }

  // ---------- Priorités : grammaire, verbes, vocabulaire ----------
  function weakestTense() { return Conj.PRIORITY.map(t => ({ t, s: Store.conjTense(t).score })).sort((a, b) => a.s - b.s)[0]; }
  function weakestTheme() {
    const st = Store.themeStats(allWords());
    const cand = Object.entries(st).filter(([id, s]) => s.seen >= 3 && VOCAB.THEMES[id]).map(([id, s]) => ({ id, r: s.lapses / s.seen, s }));
    cand.sort((a, b) => b.r - a.r);
    return cand.length && cand[0].r > 0 ? cand[0] : null;
  }
  function suggestScenarios(n = 3) {
    const weak = Store.weakest(GRAMMAR.ORDER).slice(0, 4);
    return SCENARIOS.filter(s => !s.free).map(s => {
      let sc = 0; weak.forEach((w, i) => { if (s.targets.includes(w)) sc += 4 - i; });
      sc += L.priorityCats[s.cat] || 0;
      return { s, sc: sc + Math.random() * 2.5 };
    }).sort((a, b) => b.sc - a.sc).slice(0, n).map(x => x.s);
  }

  const initials = name => name.replace(/^(Prof\.|Dra\.|Dr\.|Dr|Ms\.|Mr\.|Mevrouw|Meneer|El|La|Un|Una|The|De|Een)\s+/i, '').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  function scnCard(s, rec = false) {
    return `<a class="scn" href="#speak/${s.id}">
      ${rec ? '<span class="tag new rec">Pour toi</span>' : ''}
      <span class="eyebrow accent">${esc(s.cat)}${s.written ? ' · écrit' : ''}</span>
      <h3>${esc(s.title)}</h3><p>${esc(s.goal)}</p>
      <div>${s.targets.slice(0, 3).map(x => `<span class="tag">${esc(topicLabel(x))}</span>`).join('')}</div>
      <div class="who"><span class="avatar ${s.g}">${initials(s.who)}</span>Avec ${esc(s.who)}</div></a>`;
  }

  // =====================================================================
  // TODAY : tableau de bord du jour
  // =====================================================================
  routes.today = () => {
    const d = Store.dayAgg(), t = planTargets(), D = S().dailyMinutes;
    const total = Store.totalMin(Store.today());
    const req = d.requests, budget = S().dailyRequests;
    const convAffordable = Math.max(0, Math.floor((budget - req) / 2.5));
    const weakT = Store.weakest(GRAMMAR.ORDER);
    const wt = weakestTense(), wth = weakestTheme();
    const trouble = Store.troubleVerbs().slice(0, 4);
    const date = new Date().toLocaleDateString(L.locale, { weekday: 'long', day: 'numeric', month: 'long' });
    const sugg = suggestScenarios(3);
    const vocabCount = buildVocabQueue().length;
    const left = Math.max(0, D - total);
    // Étape 2 : prononciation tant qu'elle n'est pas solide (débutants), sinon verbes ou grammaire selon le plus faible
    const pron = Store.topic('pronunciacion');
    let step2;
    if (SOUNDS_ON && L.soundsFirst && (pron.n < 30 || pron.score < 0.75)) step2 = { href: '#sounds', desc: `Écoute une voix native et répète : les sons de base du ${L.langNameFr}.` };
    else if (wt.s < Store.topic(weakT[0]).score) step2 = { href: '#verbs', desc: `Verbes ciblés : <b>${esc(Conj.NAMES[wt.t])}</b>${trouble.length ? `, avec tes verbes difficiles (${trouble.map(esc).join(', ')})` : ''}.` };
    else step2 = { href: '#grammar/' + weakT[0], desc: `Point faible du moment : <b>${esc(topicLabel(weakT[0]))}</b>.` };

    const step = (n, key, title, desc, href, btn) => {
      const done = d.min[key], target = t[key], p = Math.min(100, done / target * 100);
      return `<div class="step ${p >= 100 ? 'done' : ''}"><span class="num">${p >= 100 ? icon('check') : n}</span>
        <h3>${title}</h3><span class="time">${Math.floor(done)} / ${target} min</span>
        <div class="meter"><i style="width:${p}%"></i></div><p>${desc}</p>
        <a class="btn ${p >= 100 ? 'quiet' : ''}" href="${href}">${btn} ${icon('arrow')}</a></div>`;
    };

    // Expression du jour : choisie selon la date
    const pool = VOCAB.WORDS.filter(w => L.wotdThemes.includes(w.theme) && w.syn.length);
    const seed = [...Store.today()].reduce((a, c) => a * 31 + c.charCodeAt(0), 7);
    const wotd = pool[Math.abs(seed) % pool.length];

    const segs = ['vocab', 'gram', 'conv'].map(k => `<i class="${k}" style="width:${Math.min(100, d.min[k] / D * 100)}%"></i>`).join('');
    view.innerHTML = `
      <div class="today-head">
        <div><span class="eyebrow">Aujourd’hui ${streak() ? `· ${icon('flame')} ${streak()} jour${streak() > 1 ? 's' : ''} d’affilée` : ''}</span>
          <h1>${esc(date.charAt(0).toUpperCase() + date.slice(1))}</h1>
          <p class="lead">${total >= D ? 'Séance du jour terminée. Tout ce que tu fais maintenant, c’est du bonus.' : `Encore <b>${Math.ceil(left)} min</b> pour atteindre ton objectif. L’essentiel se joue à l’oral.`}</p></div>
        <div class="big-num"><b>${Math.floor(total)}</b><span> / ${D} min</span></div>
      </div>
      <div class="day-meter">${segs}</div>
      ${total < D && d.skip ? `<div class="notice" style="margin-top:24px">Rappels coupés pour aujourd’hui. <button class="link" id="unskip">Les réactiver</button></div>` : ''}
      ${total >= D ? `<div class="notice done" style="margin-top:24px">Plus de rappel aujourd’hui pour le ${L.langNameFr}. Tu peux continuer si tu en as envie${AI.hasKey() ? ` : il te reste environ ${budget - req} requêtes IA, soit près de ${convAffordable} min de conversation.` : '.'}</div>` : ''}
      ${AI.hasKey() ? '' : `<div class="notice" style="margin-top:24px">La conversation avec l’IA n’est pas encore activée. <a class="link" href="#settings">Ajoute ta clé Gemini gratuite</a>, c’est l’affaire de deux minutes. En attendant, l’oral guidé fonctionne hors ligne.</div>`}

      <section class="section">
        <div class="section-head"><h2>${esc(T.session)}</h2><span class="muted small">${D} minutes</span></div>
        <div class="steps">
          ${step('01', 'vocab', esc(T.stepWords), `${vocabCount} carte${vocabCount > 1 ? 's' : ''} à revoir ou découvrir. Réponds à voix haute.`, '#words', 'Réviser')}
          ${step('02', 'gram', esc(step2.href === '#sounds' ? N.sounds : T.stepGrammar), step2.desc, step2.href, 'S’entraîner')}
          ${step('03', 'conv', esc(T.stepSpeak), AI.hasKey() ? `Jeu de rôle avec ${esc(sugg[0].who)} : <b>${esc(sugg[0].title)}</b>.` : 'Oral guidé : tu réponds à voix haute à des questions.', AI.hasKey() ? '#speak/' + sugg[0].id : '#speak/oral', 'Parler')}
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>${esc(T.priorities)}</h2><a class="link small" href="#progress">Voir tout</a></div>
        <div class="prio-grid">
          <a class="prio" href="#grammar/${weakT[0]}"><span class="eyebrow accent">Grammaire</span><h3>${esc(topicLabel(weakT[0]))}</h3>
            <p>${Store.topic(weakT[0]).n ? `Maîtrise estimée : ${pct(Store.topic(weakT[0]).score)} %.` : 'Pas encore évalué : commence par la fiche et une série d’exercices.'}</p>
            <div class="meter ${meterCls(pct(Store.topic(weakT[0]).score))}"><i style="width:${Store.topic(weakT[0]).n ? pct(Store.topic(weakT[0]).score) : 0}%"></i></div></a>
          <a class="prio" href="#verbs"><span class="eyebrow accent">${esc(T.verbsEyebrow)}</span><h3>${esc(Conj.NAMES[wt.t])}</h3>
            <p>${trouble.length ? `Verbes à revoir : ${trouble.map(esc).join(', ')}.` : Store.conjTense(wt.t).n ? `Maîtrise estimée : ${pct(wt.s)} %.` : 'L’entraîneur adapte les temps et les verbes à tes erreurs.'}</p>
            <div class="meter ${meterCls(pct(wt.s))}"><i style="width:${Store.conjTense(wt.t).n ? pct(wt.s) : 0}%"></i></div></a>
          <a class="prio" href="#words/themes"><span class="eyebrow accent">Vocabulaire</span><h3>${wth ? esc(themeLabel(wth.id)) : 'Corpus de base'}</h3>
            <p>${wth ? `${wth.s.lapses} oubli${wth.s.lapses > 1 ? 's' : ''} sur ${wth.s.seen} mots vus. Ce thème revient plus souvent.` : esc(T.vocabPrioDefault(activeThemes().length))}</p>
            <div class="meter ${wth ? meterCls(pct(wth.s.learned / wth.s.total)) : ''}"><i style="width:${wth ? pct(wth.s.learned / wth.s.total) : 0}%"></i></div></a>
        </div>
      </section>

      ${wotd ? `<section class="section">
        <div class="section-head"><h2>${esc(T.wotd)}</h2><span class="muted small">${esc(themeLabel(wotd.theme))}</span></div>
        <div class="wotd">
          <div><div class="es">${esc(wotd.tl)} ${sayBtn(speakable(wotd.tl))}</div><p class="muted" style="margin-top:8px">${esc(wotd.fr)}</p></div>
          <div><span class="eyebrow">Pour varier</span><div class="syns">${wotd.syn.map(s => `<div class="syn"><b>${esc(s)}</b> ${sayBtn(speakable(s))}</div>`).join('')}</div></div>
        </div>
      </section>` : ''}

      <section class="section">
        <div class="section-head"><h2>${esc(T.speakToday)}</h2><a class="link small" href="#speak">Toutes les situations</a></div>
        <div class="scn-grid">${sugg.map(s => scnCard(s)).join('')}</div>
      </section>

      <div class="footer-meta">${total < D && !d.skip ? '<button class="link" id="skipToday">Pas aujourd’hui : couper les rappels</button>' : ''}<span>Requêtes IA : ${req} / ${budget}</span><span>Temps au micro aujourd’hui : ${Math.round(d.speakSec / 60)} min</span><span>Voix : ${esc(Speech.status().msg)}</span></div>`;
    const setSkip = v => { Store.day().skip = v; Store.save(); Store.sync(true); if (Sync.enabled()) Sync.syncNow(); go(); };
    const sk = $('#skipToday'); if (sk) sk.onclick = () => setSkip(true);
    const us = $('#unskip'); if (us) us.onclick = () => setSkip(false);
  };

  // =====================================================================
  // SPEAK : situations + conversation
  // =====================================================================
  let speakFilter = 'Tout';
  routes.speak = (id) => {
    if (id === 'oral') return oralGuide();
    const scn = SCENARIOS.find(s => s.id === id);
    if (scn) return AI.hasKey() ? chatView(scn) : oralGuide();
    const cats = ['Tout', ...new Set(SCENARIOS.map(s => s.cat))];
    const rec = new Set(suggestScenarios(3).map(s => s.id));
    const render = () => {
      const list = SCENARIOS.filter(s => speakFilter === 'Tout' || s.cat === speakFilter);
      $('#chips').innerHTML = cats.map(c => `<button class="chip ${c === speakFilter ? 'on' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
      $('#grid').innerHTML = list.map(s => scnCard(s, rec.has(s.id))).join('');
    };
    view.innerHTML = head('Parler', esc(N.speak), `Choisis une situation. Ton interlocuteur joue son rôle, corrige tes phrases sans casser la conversation et t’aide si tu bloques. Si un mot te manque, dis-le en français : tu recevras le mot en ${L.langNameFr} et ses synonymes.`)
      + (AI.hasKey() ? '' : `<div class="notice">Sans clé IA, tu peux faire l’<a class="link" href="#speak/oral">oral guidé hors ligne</a>, ou <a class="link" href="#settings">ajouter une clé</a>.</div>`)
      + '<div class="chips" id="chips"></div><div class="scn-grid" id="grid"></div>';
    $('#chips').addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (b) { speakFilter = b.dataset.cat; render(); } });
    render();
  };

  function chatView(scn) {
    area = 'conv';
    document.body.classList.add('in-chat');
    const g = () => S().voiceByRole ? scn.g : null;
    const conv = { scn, history: [{ role: 'user', content: T.startConv }, { role: 'assistant', content: scn.opener }], msgs: [], corrections: [], vocab: [], busy: false };
    view.innerHTML = `
      <div class="chat-page">
        ${backLink('#speak', 'Situations')}
        <div class="chat-top"><span class="avatar ${scn.g}">${initials(scn.who)}</span>
          <div><h1>${esc(scn.title)}</h1><div class="sub">Avec ${esc(scn.who)} · ${esc(scn.cat)}</div></div></div>
        <div class="goal">${icon('target')}<span>${esc(scn.goal)}</span></div>
        <div class="chat-tools">
          <label class="check"><input type="checkbox" id="handsFree" ${S().handsFree ? 'checked' : ''}> Mains libres</label>
          <label class="check"><input type="checkbox" id="showTr" ${S().showTranslation ? 'checked' : ''}> Traductions</label>
          ${speedChips()}
          <span class="spacer"></span>
          <button class="btn small ghost" id="endBtn">Terminer et voir le bilan</button>
        </div>
        <div class="chat" id="chat"></div>
        <div class="suggest hidden" id="suggest"></div>
        <div class="composer">
          <button class="mic" id="mic" title="Parler (barre d’espace)"></button>
          <textarea id="msg" rows="2" placeholder="${scn.written ? 'Écris ton message…' : 'Appuie sur le micro et parle, ou écris ici. Un mot en français si tu bloques.'}"></textarea>
          <div class="composer-side">
            <button class="btn small" id="send">Envoyer</button>
            <button class="btn small quiet" id="help" title="Une idée de réponse">${icon('bulb')} Aide</button>
          </div>
        </div>
        <p class="small err" id="status"></p>
      </div>`;
    const chat = $('#chat'), input = $('#msg'), status = $('#status');
    $('#handsFree').onchange = e => { S().handsFree = e.target.checked; Store.save(); };
    $('#showTr').onchange = e => { S().showTranslation = e.target.checked; Store.save(); chat.classList.toggle('show-tr', e.target.checked); };
    chat.classList.toggle('show-tr', S().showTranslation);

    let listener = null;
    function addAI(m) {
      conv.msgs.push({ role: 'ai', ...m });
      const el = document.createElement('div');
      el.className = 'msg ai';
      el.innerHTML = `<span class="name">${esc(scn.who)}</span><div class="bubble">${esc(m.text)}<div class="tr">${esc(m.tr || '')}</div></div>
        <div class="msg-tools"><button data-a="say" title="Réécouter">${icon('sound')}</button><button data-a="slow" title="Plus lentement">0.75×</button>${m.tr ? '<button data-a="tr" title="Traduction">FR</button>' : ''}</div>
        ${m.vocab && m.vocab.length ? `<div class="words-pop">${m.vocab.map(v => `<span><b>${esc(v.word)}</b> ${esc(v.fr)}${v.syn && v.syn.length ? ` <span class="muted">· ${esc(v.syn.join(', '))}</span>` : ''}</span>`).join('')}</div>` : ''}`;
      el.querySelector('.msg-tools').onclick = e => {
        const a = e.target.closest('[data-a]'); if (!a) return;
        if (a.dataset.a === 'say') Speech.speak(m.text, { gender: g() });
        if (a.dataset.a === 'slow') Speech.speak(m.text, { rate: 0.75, gender: g() });
        if (a.dataset.a === 'tr') el.classList.toggle('show-tr');
      };
      chat.appendChild(el); el.scrollIntoView({ behavior: 'smooth', block: 'end' });
      if (S().autoSpeak && !scn.written) {
        Speech.speak(m.text, { gender: g(), onend: () => { if (S().handsFree && listener && $('#mic') && !conv.busy && !listener.active) { currentListener = listener; input.value = ''; listener.start({ autoStopAfterSilence: 2500 }); } } });
      }
      // Débutants : l'idée de réponse s'affiche d'office
      if (L.autoHint && m.suggestion) showSuggestion(m.suggestion);
    }
    function addMe(text) {
      const el = document.createElement('div');
      el.className = 'msg me';
      el.innerHTML = `<span class="name">Toi</span><div class="bubble">${esc(text)}</div><div class="corr"><span class="thinking">…</span></div>`;
      chat.appendChild(el); el.scrollIntoView({ behavior: 'smooth', block: 'end' });
      return el;
    }
    const fixHtml = c => `<div class="fix"><s>${esc(c.original)}</s> <b>${esc(c.corrected)}</b><span class="why">${esc(c.explication)}</span></div>`;
    function showSuggestion(sugg) {
      const s = $('#suggest');
      s.innerHTML = sugg
        ? `<span class="eyebrow">Idée de réponse</span><b>${esc(sugg)}</b> ${sayBtn(sugg)}<div class="muted small">Reformule-la avec tes mots plutôt que de la lire.</div>`
        : `<span class="eyebrow">Phrases de secours</span>${T.rescue.map(r => `<i>${esc(r)}</i>`).join(' · ')}`;
      s.classList.remove('hidden');
    }

    async function send(text) {
      text = (text || '').trim();
      if (!text || conv.busy) return;
      input.value = ''; status.textContent = '';
      $('#suggest').classList.add('hidden');
      const el = addMe(text);
      conv.history.push({ role: 'user', content: text });
      conv.busy = true;
      Store.day().msgs++;
      try {
        let hist = conv.history.slice(-24);
        while (hist.length && hist[0].role !== 'user') hist.shift();
        const r = await AI.converse(scn, hist, Store.weakest(GRAMMAR.ORDER).slice(0, 3), reviewWords(scn.themes));
        const corr = (r.corrections || []).filter(c => c.original && c.corrected && norm(c.original) !== norm(c.corrected));
        el.querySelector('.corr').innerHTML = corr.length ? corr.map(fixHtml).join('') : `<span class="ok-mark">${icon('check')} Bien dit</span>`;
        corr.forEach(c => {
          Store.recordTopic(c.topic, false);
          conv.corrections.push(c);
          Store.state.errors.push({ date: Store.today(), scn: scn.id, ...c });
        });
        if (Store.state.errors.length > 500) Store.state.errors.splice(0, Store.state.errors.length - 500);
        if (!corr.length && text.split(/\s+/).length >= 5) scn.targets.forEach(t => Store.recordTopic(t, true, 0.05));
        (r.vocab || []).forEach(v => { if (v.word && v.fr) conv.vocab.push(v); });
        conv.history.push({ role: 'assistant', content: r.reply });
        conv.suggestion = r.suggestion;
        Store.save();
        addAI({ text: r.reply, tr: r.translation_fr, vocab: r.vocab, suggestion: r.suggestion });
      } catch (e) {
        conv.history.pop();
        el.remove();
        status.innerHTML = `Erreur IA : ${esc(e.message)}${e.status === 429 ? '. Quota atteint : change de modèle dans les réglages ou passe à l’oral guidé.' : ''}`;
        input.value = text;
      } finally { conv.busy = false; }
    }

    listener = micFor($('#mic'), input, { onDone: t => send(t), autoSend: true });
    $('#send').onclick = () => { if (listener && listener.active) listener.stop(); send(input.value); };
    input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#send').click(); } });
    document.onkeydown = e => { if (e.code === 'Space' && document.activeElement !== input && $('#mic')) { e.preventDefault(); $('#mic').click(); } };
    $('#help').onclick = () => showSuggestion(conv.suggestion);
    $('#endBtn').onclick = () => endConversation(conv);
    addAI({ text: scn.opener, tr: scn.openerFr, suggestion: scn.hint });
  }

  function endConversation(conv) {
    if (currentListener) currentListener.stop();
    Speech.stopSpeaking();
    let added = 0;
    conv.corrections.forEach(c => { if (Store.addCustom({ id: 'err:' + norm(c.corrected), theme: 'erreurs', tl: c.corrected, fr: `Corrige : « ${c.original} » (${c.explication})`, syn: [] })) added++; });
    conv.vocab.forEach(v => { if (Store.addCustom({ id: 'conv:' + norm(v.word), theme: 'conversation', tl: v.word, fr: v.fr, syn: v.syn || [] })) added++; });
    const n = conv.msgs.filter(m => m.role === 'ai').length - 1;
    const box = modal(`<span class="eyebrow">Bilan</span><h2>${esc(conv.scn.title)}</h2>
      <div class="stat-row" style="margin-top:20px"><div><b>${n}</b><span>échanges</span></div><div><b>${conv.corrections.length}</b><span>corrections</span></div><div><b>${conv.vocab.length}</b><span>mots nouveaux</span></div><div><b>${added}</b><span>cartes ajoutées</span></div></div>
      ${conv.corrections.length ? `<h3 style="margin-bottom:10px">À retenir</h3>${conv.corrections.map(c => `<div class="fix"><s>${esc(c.original)}</s> <b>${esc(c.corrected)}</b><span class="why">${esc(c.explication)}</span></div>`).join('')}` : `<p>Aucune erreur relevée. ${esc(T.wellDone)}</p>`}
      ${conv.vocab.length ? `<h3 style="margin:20px 0 10px">Vocabulaire</h3><table>${conv.vocab.map(v => `<tr><td><b>${esc(v.word)}</b> ${sayBtn(v.word)}</td><td>${esc(v.fr)}</td><td class="muted">${esc((v.syn || []).join(', '))}</td></tr>`).join('')}</table>` : ''}
      <div id="aiReview"></div>
      <div class="row"><button class="btn" id="getReview">Bilan détaillé (1 requête)</button><a class="btn ghost" href="#today" data-close>Retour à la séance</a></div>`);
    $('#getReview', box).onclick = async (e) => {
      e.target.disabled = true; $('#aiReview', box).innerHTML = '<p class="thinking">Analyse en cours…</p>';
      const transcript = conv.history.slice(1).map(m => (m.role === 'user' ? 'Learner: ' : conv.scn.who + ': ') + m.content).join('\n');
      try { $('#aiReview', box).innerHTML = `<div class="review">${esc(await AI.sessionReview(transcript, conv.corrections))}</div>`; }
      catch (err) { $('#aiReview', box).innerHTML = `<p class="err">${esc(err.message)}</p>`; e.target.disabled = false; }
    };
  }

  // Oral guidé hors ligne
  function oralGuide() {
    area = 'conv';
    const prompts = Store.weakest(GRAMMAR.ORDER).flatMap(id => (GRAMMAR.TOPICS[id].speak || []).map(q => ({ q, id })));
    let i = 0;
    view.innerHTML = head('Parler sans IA', 'Oral guidé', 'Réponds à voix haute au moins une minute à chaque question. Relis ensuite ta transcription en t’appuyant sur la fiche.') + `
      <div class="trainer"><span class="eyebrow accent" id="oTopic"></span><div class="prompt" id="oQ"></div>
        <button class="mic big" id="oMic"></button>
        <textarea id="oTxt" rows="5" placeholder="Ta transcription s’affichera ici"></textarea>
        <div class="row"><button class="btn ghost" id="oFiche">Voir la fiche</button><button class="btn" id="oNext">Question suivante ${icon('arrow')}</button></div></div>`;
    const show = () => {
      const p = prompts[i % prompts.length];
      $('#oTopic').textContent = topicLabel(p.id); $('#oQ').textContent = p.q; $('#oTxt').value = '';
      Speech.speak(p.q);
    };
    micFor($('#oMic'), $('#oTxt'));
    $('#oNext').onclick = () => { if (currentListener) currentListener.stop(); i++; show(); };
    $('#oFiche').onclick = () => { const p = prompts[i % prompts.length]; modal(`<span class="eyebrow">Fiche</span><h2>${esc(topicLabel(p.id))}</h2><div class="fiche" style="margin-top:16px">${GRAMMAR.TOPICS[p.id].fiche}</div>`); };
    show();
  }

  // =====================================================================
  // WORDS : révision espacée, synonymes, thèmes
  // =====================================================================
  function buildVocabQueue() {
    const today = Store.today(), themes = activeThemes();
    const due = [], fresh = [];
    for (const w of allWords()) {
      const c = Store.card(w.id);
      if (c && c.box > 0) { if (c.due <= today) due.push(w); }
      else if (themes.includes(w.theme) || extraThemes[w.theme]) fresh.push(w);
    }
    // Les thèmes où tu oublies le plus passent en premier
    const st = Store.themeStats(allWords());
    const weight = w => { const s = st[w.theme]; return s && s.seen ? s.lapses / s.seen : 0; };
    due.sort((a, b) => weight(b) - weight(a) || Math.random() - .5);
    const prio = w => extraThemes[w.theme] ? 0 : VOCAB.THEMES[w.theme].prio;
    fresh.sort((a, b) => prio(a) - prio(b));
    // Nouveaux mots : on alterne les thèmes de même priorité
    const byTheme = {};
    fresh.forEach(w => (byTheme[w.theme] = byTheme[w.theme] || []).push(w));
    const mixed = []; let added = true;
    while (added) { added = false; for (const k of Object.keys(byTheme)) { const w = byTheme[k].shift(); if (w) { mixed.push(w); added = true; } } }
    mixed.sort((a, b) => prio(a) - prio(b));
    const newLeft = Math.max(0, S().newPerDay - (Store.dayAgg().newCards || 0));
    return [...due.slice(0, 50), ...mixed.slice(0, newLeft)];
  }

  const vocabTabs = active => `<div class="tabs">${[['', T.review], ['synonyms', T.synonyms], ['themes', T.themes]].map(([k, lbl]) => `<a class="${k === active ? 'active' : ''}" href="#words${k ? '/' + k : ''}">${esc(lbl)}</a>`).join('')}</div>`;

  routes.words = (tab) => {
    area = 'vocab';
    if (tab === 'themes' || tab === 'temas') return vocabThemes();
    if (tab === 'synonyms' || tab === 'sinonimos') return synonymTrainer();
    let queue = buildVocabQueue();
    const total = queue.length;
    const retry = new Set(), firstTry = {};
    let cur = null, answered = false, prevCard = null;
    view.innerHTML = head('Vocabulaire', esc(N.words), 'Révision espacée : chaque mot revient juste avant que tu l’oublies. Dis la réponse à voix haute, c’est ce qui l’ancre.') + vocabTabs('') + '<div class="trainer" id="flash"></div>';
    const box = $('#flash');
    function next() {
      if (currentListener) currentListener.stop();
      cur = queue.shift(); answered = false;
      if (!cur) {
        box.innerHTML = `<div class="done-box"><span class="eyebrow">Terminé</span><h2>Révisions du jour bouclées</h2><p class="muted" style="margin-top:12px">Tu peux entraîner les <a class="link" href="#words/synonyms">synonymes</a>, activer d’autres <a class="link" href="#words/themes">thèmes</a> ou passer aux <a class="link" href="#verbs">verbes</a>.</p></div>`;
        return;
      }
      const isNew = !Store.card(cur.id) || Store.card(cur.id).box === 0;
      const doneN = total - queue.length - 1;
      // Pour un débutant, un mot nouveau est d'abord montré et entendu avant d'être demandé
      const showFirst = isNew && L.introduceNewWords;
      box.innerHTML = `
        <div class="meta"><span>${esc(themeLabel(cur.theme))}</span><div class="meter"><i style="width:${Math.min(100, doneN / Math.max(1, total) * 100)}%"></i></div><span>${isNew ? '<span class="tag new">Nouveau</span>' : `${queue.length} restant${queue.length > 1 ? 's' : ''}`}</span></div>
        <span class="eyebrow">${esc(T.inLang)}</span>
        <div class="prompt">${esc(cur.fr)}</div>
        <div class="prompt-sub">${showFirst ? `<button class="link" id="vPeek">Écouter le mot avant de répondre</button>` : '&nbsp;'}</div>
        <div class="answer-row"><button class="mic" id="vMic"></button><input id="vIn" autocomplete="off" placeholder="Dis-le ou écris-le"><button class="btn" id="vCheck">Vérifier</button></div>
        <div class="row"><button class="link small" id="vSkip">Je ne sais pas</button></div>
        <div id="vRes"></div>`;
      const inp = $('#vIn'); inp.focus();
      const peek = $('#vPeek');
      if (peek) peek.onclick = () => { peek.parentElement.innerHTML = `<b>${esc(cur.tl)}</b> ${sayBtn(speakable(cur.tl))} <span class="muted">· répète-le, puis réponds</span>`; Speech.speak(speakable(cur.tl)); };
      micFor($('#vMic'), inp, { onDone: () => check(), autoSend: true });
      $('#vCheck').onclick = () => check();
      $('#vSkip').onclick = () => { inp.value = ''; check(true); };
      inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); answered ? next() : check(); } };
    }
    function check(skip) {
      if (answered) return next();
      answered = true;
      const res = skip ? 'wrong' : compare($('#vIn').value, [cur.tl, ...cur.syn], { loose: true });
      const ok = res !== 'wrong';
      if (!(cur.id in firstTry)) {
        firstTry[cur.id] = ok;
        const c = Store.card(cur.id);
        prevCard = c ? { ...c } : null;
        if (!c || c.box === 0) Store.day().newCards = (Store.day().newCards || 0) + 1;
        Store.gradeCard(cur.id, ok);
        Store.recordTopic('vocabulario', ok, 0.03);
      }
      if (!ok && !retry.has(cur.id)) { retry.add(cur.id); queue.push(cur); }
      const label = { ok: 'Correct', accents: 'Correct, attention aux accents', typo: 'Presque : petite faute de frappe', wrong: skip ? 'La réponse' : 'Pas tout à fait' }[res];
      $('#vRes').innerHTML = `<div class="feedback"><span class="verdict ${ok ? 'good' : 'bad'}">${icon(ok ? 'check' : 'x')} ${label}</span>
        <div class="solution">${esc(cur.tl)} ${sayBtn(speakable(cur.tl))}</div>
        ${cur.note ? `<div class="syn">${esc(cur.note)}</div>` : ''}
        ${cur.syn.length ? `<div class="syn">Pour varier : ${cur.syn.map(s => `<b>${esc(s)}</b>`).join(', ')}</div>` : ''}
        ${!ok ? '<p class="muted small" style="margin-top:10px">Répète la réponse deux fois à voix haute avant de continuer.</p>' : ''}
        <div class="row">${!ok && !skip ? '<button class="btn quiet small" id="vOverride">J’avais bon</button>' : ''}<button class="btn" id="vNext">Suivant ${icon('arrow')}</button></div></div>`;
      Speech.speak(speakable(cur.tl));
      $('#vNext').onclick = next;
      const ov = $('#vOverride');
      if (ov) ov.onclick = () => {
        if (prevCard) Store.state.cards[cur.id] = prevCard; else delete Store.state.cards[cur.id];
        Store.gradeCard(cur.id, true);
        queue = queue.filter(w => w !== cur);
        next();
      };
      $('#vNext').focus();
    }
    next();
  };

  // Synonymes : enrichir son expression
  function synonymTrainer() {
    const themes = activeThemes();
    const candidates = allWords().filter(w => w.syn.length && (themes.includes(w.theme) || Store.card(w.id)) && !/\.\.\.|\?/.test(w.tl));
    const seen = candidates.filter(w => Store.card(w.id) && Store.card(w.id).box > 0);
    let items = shuffle([...shuffle(seen).slice(0, 8), ...shuffle(candidates)]).filter((w, i, a) => a.indexOf(w) === i).slice(0, 12);
    let i = 0, score = 0, answered = false;
    view.innerHTML = head('Vocabulaire', esc(N.words), 'Trouve un autre mot pour dire la même chose. C’est ce qui te sauvera quand un mot ne vient pas.') + vocabTabs('synonyms') + '<div class="trainer" id="syn"></div>';
    const box = $('#syn');
    function show() {
      if (currentListener) currentListener.stop();
      answered = false;
      if (i >= items.length) {
        box.innerHTML = `<div class="done-box"><span class="eyebrow">Résultat</span><div class="score">${score}<span class="muted" style="font-size:1.4rem"> / ${items.length}</span></div><div class="row"><button class="btn" id="again">Nouvelle série</button></div></div>`;
        $('#again').onclick = () => synonymTrainer();
        return;
      }
      const w = items[i];
      box.innerHTML = `<div class="meta"><span>${esc(themeLabel(w.theme))}</span><div class="meter"><i style="width:${i / items.length * 100}%"></i></div><span>${i + 1} / ${items.length}</span></div>
        <span class="eyebrow">Un synonyme ou équivalent de</span>
        <div class="prompt">${esc(w.tl)}</div><div class="prompt-sub">${esc(w.fr)}</div>
        <div class="answer-row"><button class="mic" id="sMic"></button><input id="sIn" autocomplete="off" placeholder="Un autre mot"><button class="btn" id="sCheck">Vérifier</button></div>
        <div class="row"><button class="link small" id="sSkip">Je ne sais pas</button></div><div id="sRes"></div>`;
      const inp = $('#sIn'); inp.focus();
      micFor($('#sMic'), inp, { onDone: () => check(), autoSend: true });
      $('#sCheck').onclick = () => check();
      $('#sSkip').onclick = () => { inp.value = ''; check(); };
      inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); answered ? (i++, show()) : check(); } };
    }
    function check() {
      if (answered) return;
      answered = true;
      const w = items[i], val = $('#sIn').value;
      const same = compare(val, [w.tl]) !== 'wrong';
      const ok = !same && compare(val, w.syn, { loose: true }) !== 'wrong';
      if (ok) score++;
      Store.recordTopic('vocabulario', ok, 0.03);
      $('#sRes').innerHTML = `<div class="feedback"><span class="verdict ${ok ? 'good' : 'bad'}">${icon(ok ? 'check' : 'x')} ${ok ? 'Bien vu' : same ? 'C’est le même mot' : 'Les équivalents'}</span>
        <div class="syn" style="font-size:1.15rem;margin-top:10px">${w.syn.map(s => `<b>${esc(s)}</b> ${sayBtn(speakable(s))}`).join(' &nbsp; ')}</div>
        <div class="row"><button class="btn" id="sNext">Suivant ${icon('arrow')}</button></div></div>`;
      $('#sNext').onclick = () => { i++; show(); };
      $('#sNext').focus();
    }
    show();
  }

  function vocabThemes() {
    const themes = activeThemes(), all = allWords();
    const st = Store.themeStats(all);
    const groups = [...Object.values(VOCAB.THEMES).sort((a, b) => a.prio - b.prio).map(t => t.id), ...Object.keys(extraThemes)];
    view.innerHTML = head('Vocabulaire', esc(N.words), `Coche les thèmes dont les nouveaux mots entrent dans tes révisions.${L.courseThemesNote ? ' ' + L.courseThemesNote : ''}`) + vocabTabs('themes') + `
      <div>${groups.map(id => {
      const words = all.filter(w => w.theme === id); if (!words.length) return '';
      const s = st[id] || { learned: 0, total: words.length }, t = VOCAB.THEMES[id];
      return `<details class="theme"><summary>
          ${t ? `<input type="checkbox" data-theme="${id}" ${themes.includes(id) ? 'checked' : ''} title="Inclure dans les révisions">` : ''}
          <span class="name">${esc(themeLabel(id))} ${t && t.course ? '<span class="tag">Cours</span>' : ''}</span>
          <span class="muted small">${s.learned} / ${words.length}</span><span class="meter high"><i style="width:${s.learned / words.length * 100}%"></i></span></summary>
          <table class="words">${words.map(w => `<tr><td>${sayBtn(speakable(w.tl))} <b>${esc(w.tl)}</b></td><td>${esc(w.fr)}</td><td class="muted">${esc(w.syn.join(', '))}</td></tr>`).join('')}</table></details>`;
    }).join('')}</div>`;
    $$('[data-theme]').forEach(cb => {
      cb.onclick = e => e.stopPropagation();
      cb.onchange = () => {
        const set = new Set(activeThemes());
        cb.checked ? set.add(cb.dataset.theme) : set.delete(cb.dataset.theme);
        S().vocabThemes = [...set]; Store.touchPrefs();
      };
    });
  }

  // =====================================================================
  // VERBS : entraîneur adaptatif (les exercices viennent de Conj, propre à chaque langue)
  // =====================================================================
  function pickWeighted(list, w) { const tot = list.reduce((a, x) => a + w(x), 0); let r = Math.random() * tot; for (const x of list) { r -= w(x); if (r <= 0) return x; } return list[list.length - 1]; }
  function makeConjItem(tenses) {
    const tense = pickWeighted(tenses, t => 0.25 + (1 - Store.conjTense(t).score) * 1.5);
    return Conj.makeItem(tense, { pick, trouble: Store.troubleVerbs() });
  }

  let verbMode = null; // null = intelligent, sinon liste de temps
  routes.verbs = () => {
    area = 'gram';
    const NQ = 12;
    let items = [], i = 0, score = 0, answered = false, run = 0;
    view.innerHTML = head(esc(T.verbsEyebrow), esc(N.verbs), esc(T.verbsLead)) + `
      <div class="tabs"><a class="active" href="#verbs">Entraînement</a><a href="#grammar/conjugator">${esc(T.conjugator)}</a></div>
      <div class="chips" id="vChips"></div>
      <div class="two-col"><div class="panel" id="vt"></div><div class="tense-side" id="vSide"></div></div>`;
    const tensesNow = () => verbMode && verbMode.length ? verbMode : Conj.TRAIN;
    function chips() {
      $('#vChips').innerHTML = `<button class="chip ${!verbMode ? 'on' : ''}" data-t="smart">Intelligent</button>` + Conj.TRAIN.map(t => `<button class="chip ${verbMode && verbMode.includes(t) ? 'on' : ''}" data-t="${t}">${esc(Conj.NAMES[t])}</button>`).join('');
    }
    function side() {
      const trouble = Store.troubleVerbs().slice(0, 8);
      $('#vSide').innerHTML = `<div class="panel surface"><span class="eyebrow">Maîtrise</span>${Conj.TRAIN.map(t => { const x = Store.conjTense(t), p = pct(x.score); return `<div class="t" style="margin-top:12px"><span>${esc(Conj.NAMES[t])}</span><span class="muted small" style="text-align:right">${x.n ? p + ' %' : '…'}</span><div class="meter ${x.n ? meterCls(p) : ''}"><i style="width:${x.n ? p : 0}%"></i></div></div>`; }).join('')}</div>
        <div class="panel surface"><span class="eyebrow">Verbes à revoir</span>${trouble.length ? trouble.map(v => `<a class="tag weak" href="#grammar/conjugator/${encodeURIComponent(v)}" style="text-decoration:none">${esc(v)}</a>`).join('') : '<p class="muted small">Aucun pour l’instant.</p>'}</div>`;
    }
    $('#vChips').onclick = e => {
      const b = e.target.closest('[data-t]'); if (!b) return;
      const t = b.dataset.t;
      if (t === 'smart') verbMode = null;
      else { const set = new Set(verbMode || []); set.has(t) ? set.delete(t) : set.add(t); verbMode = set.size ? [...set] : null; }
      chips(); start();
    };
    function start() { items = Array.from({ length: NQ }, () => makeConjItem(tensesNow())); i = 0; score = 0; show(); }
    function show() {
      if (currentListener) currentListener.stop();
      answered = false;
      const box = $('#vt');
      if (i >= items.length) {
        Store.day().exercises++; Store.save();
        box.innerHTML = `<div class="done-box trainer"><span class="eyebrow">Série terminée</span><div class="score">${score}<span class="muted" style="font-size:1.4rem"> / ${items.length}</span></div><div class="row"><button class="btn" id="again">Nouvelle série</button></div></div>`;
        $('#again').onclick = start; side();
        return;
      }
      const it = items[i];
      box.innerHTML = `<div class="trainer"><div class="meta"><span>${it.kind === 'context' ? 'Choisis le temps' : 'Conjugue'}</span><div class="meter"><i style="width:${i / items.length * 100}%"></i></div><span>${i + 1} / ${items.length}${run >= 3 ? ` · ${icon('flame')} ${run}` : ''}</span></div>
        <div class="prompt">${esc(it.prompt).replace('___', '<span class="blank">___</span>')}</div><div class="prompt-sub">${esc(it.sub)}</div>
        ${helpBox(it)}
        <div class="answer-row"><button class="mic" id="cMic"></button><input id="cIn" autocomplete="off" placeholder="${esc(it.placeholder || 'Forme conjuguée')}"><button class="btn" id="cCheck">Vérifier</button></div>
        <div id="cRes"></div></div>`;
      const inp = $('#cIn'); inp.focus();
      micFor($('#cMic'), inp, { onDone: () => check(), autoSend: true });
      $('#cCheck').onclick = () => check();
      inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); answered ? (i++, show()) : check(); } };
    }
    // Aide avant de répondre (langues débutantes) : ouverte tant que le temps est encore nouveau
    function helpBox(it) {
      const rule = Conj.RULES && Conj.RULES[it.tense];
      if (!rule) return '';
      const table = Conj.itemTable ? Conj.itemTable(it) : null;
      const open = Store.conjTense(it.tense).n < 8 ? 'open' : '';
      return `<details class="help" ${open}><summary class="small">Aide : la règle${table ? ' et le modèle' : ''}</summary><p class="small">${esc(rule)}</p>
        ${table && it.tense !== 'vraag' ? `<table class="small">${table.rows.filter(r => !r[2]).map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</table>` : ''}</details>`;
    }
    function check() {
      if (answered) return;
      answered = true;
      const it = items[i], val = $('#cIn').value;
      const res = compare(val, it.a, { pronoun: true });
      const ok = res !== 'wrong';
      if (ok) { score++; run++; } else run = 0;
      Store.recordConj(it.tense, it.verb, ok);
      if (Conj.TOPIC[it.tense]) Store.recordTopic(Conj.TOPIC[it.tense], ok, 0.08);
      const wrongT = !ok && Conj.wrongTense ? Conj.wrongTense(it, v => compare(val, [v], { pronoun: true }) !== 'wrong') : null;
      if (it.kind === 'context' && Conj.CONTEXT_TOPIC) Store.recordTopic(Conj.CONTEXT_TOPIC, ok || !wrongT, 0.06);
      const table = Conj.itemTable ? Conj.itemTable(it) : null;
      const full = it.full || (it.kind === 'context' ? it.prompt.replace('___', it.a[0]) : it.a[0]);
      $('#cRes').innerHTML = `<div class="feedback"><span class="verdict ${ok ? 'good' : 'bad'}">${icon(ok ? 'check' : 'x')} ${ok ? (res === 'accents' ? 'Correct, attention aux accents' : 'Correct') : 'Réponse'}</span>
        <div class="solution">${esc(full)} ${sayBtn(it.say || full)}</div>
        ${it.kind === 'context' ? `<p class="small">Temps attendu : <b>${esc(Conj.NAMES[it.tense])}</b>${it.a.length > 1 ? ` (ou <i>${esc(it.a[1])}</i>)` : ''}.${wrongT ? ` Tu as utilisé : ${esc(Conj.NAMES[wrongT] || wrongT)}. Le repère temporel indique un autre temps.` : ''}</p>` : ''}
        ${it.note ? `<p class="small">${esc(it.note)}</p>` : ''}
        ${table ? `<details ${ok ? '' : 'open'}><summary class="small">${esc(table.title)}</summary><table>${table.rows.map(r => `<tr class="${r[2] ? 'hl' : ''}"><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</table></details>` : ''}
        <div class="row"><button class="btn" id="cNext">Suivant ${icon('arrow')}</button></div></div>`;
      if (!ok) Speech.speak(it.say || full);
      $('#cNext').onclick = () => { i++; show(); };
      $('#cNext').focus();
      side();
    }
    chips(); side(); start();
  };

  // =====================================================================
  // SOUNDS : écouter et répéter (prononciation)
  // =====================================================================
  routes.sounds = (groupId) => {
    if (!SOUNDS_ON) return go();
    area = 'gram';
    const group = SOUNDS.find(g => g.id === groupId);
    if (!group) {
      view.innerHTML = head('Prononciation', esc(N.sounds), esc(T.soundsLead)) + `
        <div class="topic-grid">${SOUNDS.map(g => {
        const s = Store.state.sounds && Store.state.sounds[g.id], p = s ? pct(s.ok / Math.max(1, s.n)) : 0;
        return `<a class="topic" href="#sounds/${g.id}"><h3>${esc(g.label)}</h3><span class="muted small">${esc(g.fr)}</span>
            <div class="meter ${s ? meterCls(p) : ''}"><i style="width:${p}%"></i></div><span class="stat">${s ? `${p} % · ${s.n} essais` : 'Pas encore pratiqué'}</span></a>`;
      }).join('')}</div>`;
      return;
    }
    let words = shuffle(group.words), i = 0;
    view.innerHTML = backLink('#sounds', N.sounds) + head('Prononciation', esc(group.label), esc(group.fr)) + `
      ${group.tip ? `<div class="notice">${esc(group.tip)}</div>` : ''}
      <div class="trainer" id="snd"></div>`;
    const box = $('#snd');
    const st = () => { Store.state.sounds = Store.state.sounds || {}; return Store.state.sounds[group.id] || (Store.state.sounds[group.id] = { n: 0, ok: 0 }); };
    function show() {
      if (currentListener) currentListener.stop();
      const w = words[i % words.length];
      box.innerHTML = `<div class="meta"><span>Écoute puis répète</span><div class="meter"><i style="width:${(i % words.length) / words.length * 100}%"></i></div><span>${(i % words.length) + 1} / ${words.length}</span></div>
        <div class="prompt">${esc(w.w)}</div><div class="prompt-sub">${esc(w.fr || '')}${w.ipa ? ` · <span class="muted">${esc(w.ipa)}</span>` : ''}</div>
        <div class="row" style="justify-content:center"><button class="btn ghost" id="pListen">${icon('sound')} Écouter</button><button class="btn quiet" id="pSlow">0.6×</button></div>
        <button class="mic big" id="pMic"></button>
        <input id="pHeard" readonly placeholder="Ce que le micro a compris" style="text-align:center">
        <div id="pRes"></div>`;
      $('#pListen').onclick = () => Speech.speak(w.w);
      $('#pSlow').onclick = () => Speech.speak(w.w, { rate: 0.6 });
      Speech.speak(w.w);
      micFor($('#pMic'), $('#pHeard'), { onDone: () => check(w), autoSend: true });
    }
    function check(w) {
      const heard = $('#pHeard').value;
      const res = compare(heard, [w.w], { loose: true });
      const ok = res !== 'wrong';
      const s = st(); s.n++; if (ok) s.ok++;
      Store.recordTopic('pronunciacion', ok, 0.05);
      $('#pRes').innerHTML = `<div class="feedback"><span class="verdict ${ok ? 'good' : 'bad'}">${icon(ok ? 'check' : 'x')} ${ok ? 'Bien prononcé' : 'Pas encore reconnu'}</span>
        <p class="small">${ok ? 'Le micro a reconnu le mot.' : `Le micro a compris « ${esc(heard || '…')} ». Réécoute en 0.6×, exagère le son, puis réessaie.`}</p>
        <div class="row"><button class="btn quiet small" id="pAgain">Réessayer</button><button class="btn" id="pNext">Suivant ${icon('arrow')}</button></div></div>`;
      $('#pAgain').onclick = show;
      $('#pNext').onclick = () => { i++; show(); };
    }
    show();
  };

  // =====================================================================
  // GRAMMAR : fiches + exercices
  // =====================================================================
  function buildExercises(topicId, n = 10) {
    const t = GRAMMAR.TOPICS[topicId];
    const bank = shuffle(t.bank || []);
    if (!t.gen || !Conj.genItem) return bank.slice(0, n);
    const items = bank.slice(0, Math.min(bank.length, Math.floor(n * 0.4)));
    while (items.length < n) items.push(Conj.genItem(t.gen, { pick }));
    return shuffle(items);
  }

  routes.grammar = (id, arg) => {
    area = 'gram';
    if (id === 'conjugator' || id === 'conjugador') return conjugatorView(arg && decodeURIComponent(arg));
    if (id && GRAMMAR.TOPICS[id]) return topicView(id);
    view.innerHTML = head('Grammaire', esc(N.grammar), 'Chaque barre reflète ta maîtrise estimée, mesurée sur tes exercices et sur les erreurs relevées en conversation. Les points les plus faibles remontent dans ta séance du jour.') + `
      <div class="tabs"><a class="active" href="#grammar">Points de grammaire</a><a href="#grammar/conjugator">${esc(T.conjugator)}</a></div>
      <div class="topic-grid">${GRAMMAR.ORDER.map(id => {
      const t = Store.topic(id), p = pct(t.score);
      return `<a class="topic" href="#grammar/${id}"><div><span class="tag">${GRAMMAR.TOPICS[id].level}</span>${Store.state.weakSelf.includes(id) ? '<span class="tag weak">Point faible</span>' : ''}</div><h3>${esc(GRAMMAR.TOPICS[id].label)}</h3>
          <div class="meter ${t.n ? meterCls(p) : ''}"><i style="width:${t.n ? p : 0}%"></i></div><span class="stat">${t.n ? `${p} % · ${t.n} réponses` : 'Pas encore évalué'}</span></a>`;
    }).join('')}</div>
      ${L.grammarLinks ? `<p class="muted small" style="margin-top:28px">${L.grammarLinks}</p>` : ''}`;
  };

  function topicView(id) {
    const t = GRAMMAR.TOPICS[id];
    view.innerHTML = backLink('#grammar', N.grammar) + head(`Grammaire · ${t.level}`, esc(t.label)) + `
      <div class="two-col"><div class="panel fiche">${t.fiche}</div><div class="panel" id="ex"></div></div>
      ${t.speak ? `<section class="section"><div class="section-head"><h2>${esc(T.speakAloud)}</h2><span class="muted small">Une minute à voix haute pour chaque question</span></div>${t.speak.map(q => `<p style="font-size:1.1rem">${esc(q)} ${sayBtn(q)}</p>`).join('')}</section>` : ''}`;
    runExercises(id, $('#ex'));
  }

  function runExercises(id, box) {
    let items = buildExercises(id), i = 0, score = 0, answered = false;
    function show() {
      if (currentListener) currentListener.stop();
      answered = false;
      if (i >= items.length) {
        Store.day().exercises++; Store.save();
        const s = SCENARIOS.filter(x => x.targets.includes(id));
        box.innerHTML = `<div class="done-box trainer"><span class="eyebrow">Résultat</span><div class="score">${score}<span class="muted" style="font-size:1.4rem"> / ${items.length}</span></div>
          <p class="muted" style="margin-top:14px">${score >= 8 ? 'Très bien. Passe maintenant à l’oral pour l’utiliser en situation.' : score >= 5 ? 'C’est en bonne voie. Une série de plus pour consolider.' : 'Relis la fiche à gauche, puis recommence une série.'}</p>
          <div class="row"><button class="btn" id="again">Nouvelle série</button>${s.length ? `<a class="btn ghost" href="#speak/${pick(s).id}">Pratiquer à l’oral</a>` : ''}</div></div>`;
        $('#again', box).onclick = () => { items = buildExercises(id); i = 0; score = 0; show(); };
        return;
      }
      const it = items[i];
      box.innerHTML = `<div class="trainer"><div class="meta"><span>Exercice</span><div class="meter"><i style="width:${i / items.length * 100}%"></i></div><span>${i + 1} / ${items.length}</span></div>
        <div class="prompt" style="font-size:1.5rem">${esc(it.q).replace('___', '<span class="blank">___</span>')}</div>
        <div class="prompt-sub">${it.hint ? esc(it.hint) : '&nbsp;'}</div>
        ${it.opts ? `<div class="opts">${shuffle(it.opts).map(o => `<button class="btn quiet" data-opt="${esc(o)}">${esc(o)}</button>`).join('')}</div>` : `
        <div class="answer-row"><button class="mic" id="gMic"></button><input id="gIn" autocomplete="off" placeholder="Ta réponse"><button class="btn" id="gCheck">Vérifier</button></div>`}
        <div id="gRes"></div></div>`;
      if (it.opts) $$('[data-opt]', box).forEach(b => b.onclick = () => check(b.dataset.opt, b));
      else {
        const inp = $('#gIn', box); inp.focus();
        micFor($('#gMic', box), inp, { onDone: () => check(inp.value), autoSend: true });
        $('#gCheck', box).onclick = () => check(inp.value);
        inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); answered ? (i++, show()) : check(inp.value); } };
      }
    }
    function check(val, btn) {
      if (answered) return;
      answered = true;
      const it = items[i];
      const res = compare(val, it.a, { pronoun: !!it.verb });
      const ok = res !== 'wrong';
      if (ok) score++;
      Store.recordTopic(id, ok);
      if (it.verb) Store.recordConj(it.tense, it.verb, ok);
      if (btn) btn.classList.add(ok ? 'good' : 'bad');
      const shown = ok && res === 'ok' ? norm(val) === norm(it.a[0]) ? it.a[0] : val.trim() : it.a[0];
      // Phrase complète : la question remplie, ou la réponse seule pour une question à choix sans trou
      const full = !it.q.includes('___') ? shown : it.q.includes('\n') ? it.q.split('\n').pop().replace('___', shown) : it.q.replace('___', shown);
      const table = it.verb && Conj.itemTable ? Conj.itemTable(it) : null;
      $('#gRes', box).innerHTML = `<div class="feedback"><span class="verdict ${ok ? 'good' : 'bad'}">${icon(ok ? 'check' : 'x')} ${ok ? (res === 'accents' ? 'Correct, attention aux accents' : 'Correct') : 'Réponse'}</span>
        <div class="solution" style="font-size:1.2rem">${esc(full)} ${it.noSay || /→/.test(it.q) ? '' : sayBtn(full)}</div>
        ${it.a.length > 1 ? `<p class="small muted">Aussi accepté : ${it.a.filter(x => x !== shown).map(esc).join(', ')}</p>` : ''}
        ${it.expl ? `<p class="small">${esc(it.expl)}</p>` : ''}
        ${table ? `<details><summary class="small">${esc(table.title)}</summary><table>${table.rows.map(r => `<tr class="${r[2] ? 'hl' : ''}"><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</table></details>` : ''}
        <div class="row"><button class="btn" id="gNext">Suivant ${icon('arrow')}</button></div></div>`;
      $('#gNext', box).onclick = () => { i++; show(); };
      $('#gNext', box).focus();
    }
    show();
  }

  function conjugatorView(initial) {
    view.innerHTML = head('Grammaire', esc(T.conjugator), 'Toutes les formes utiles pour chaque verbe. Clique sur une forme pour l’entendre.') + `
      <div class="tabs"><a href="#grammar">Points de grammaire</a><a class="active" href="#grammar/conjugator">${esc(T.conjugator)}</a></div>
      <label class="field" style="max-width:420px"><span>Verbe</span><select id="cVerb">${Conj.VERBS.slice().sort((a, b) => a.inf.localeCompare(b.inf)).map(v => `<option value="${esc(v.inf)}" ${v.inf === initial ? 'selected' : ''}>${esc(v.inf)} · ${esc(v.fr)}</option>`).join('')}</select></label>
      <div id="cOut"></div>`;
    const render = () => {
      const inf = $('#cVerb').value;
      const view = Conj.verbView(inf);
      $('#cOut').innerHTML = `${view.extras.length ? `<div class="stat-row">${view.extras.map(([l, v]) => `<div><span>${esc(l)}</span><b style="font-size:1.3rem">${esc(v)}</b></div>`).join('')}</div>` : ''}
        <div class="conj-grid">${view.tables.map(tb => `<table><tr><th colspan="2">${esc(tb.title)}</th></tr>${tb.rows.map(([p, f]) => `<tr><td class="muted">${esc(p)}</td><td><button class="link" style="text-decoration:none" data-say="${esc((p + ' ' + f).trim())}">${esc(f)}</button></td></tr>`).join('')}</table>`).join('')}</div>`;
    };
    $('#cVerb').onchange = render;
    render();
  }

  // =====================================================================
  // READ : lecture guidée générée par l'IA
  // =====================================================================
  routes.read = () => {
    area = 'conv';
    const saved = Store.state.reading;
    view.innerHTML = head('Lecture', esc(N.read), `Un texte écrit pour toi, à ton niveau, dans ton domaine. Écoute-le avec une voix native, survole les mots soulignés pour leur traduction, puis réponds aux questions à l’oral.`) + `
      <div class="panel surface"><span class="eyebrow">Sujet</span><div class="chips" id="rTopics">${L.readTopics.map(([k, l], j) => `<button class="chip ${j === 0 ? 'on' : ''}" data-k="${k}">${esc(l)}</button>`).join('')}</div>
        <span class="eyebrow">Longueur</span><div class="chips" id="rLen">${L.readLengths.map(([n, l], j) => `<button class="chip ${j === 1 ? 'on' : ''}" data-n="${n}">${l}</button>`).join('')}</div>
        <button class="btn" id="rGo" ${AI.hasKey() ? '' : 'disabled'}>Générer un texte (1 requête)</button>${AI.hasKey() ? '' : ' <span class="muted small">Nécessite une clé IA.</span>'}</div>
      <div id="rOut"></div>`;
    const sel = (id, attr) => $(`#${id} .chip.on`).dataset[attr];
    ['rTopics', 'rLen'].forEach(id => $('#' + id).onclick = e => { const b = e.target.closest('.chip'); if (!b) return; $$(`#${id} .chip`).forEach(c => c.classList.remove('on')); b.classList.add('on'); });
    $('#rGo').onclick = async () => {
      const k = sel('rTopics', 'k'), n = +sel('rLen', 'n');
      const tp = L.readTopics.find(x => x[0] === k);
      $('#rGo').disabled = true; $('#rOut').innerHTML = '<p class="thinking" style="margin-top:24px">Rédaction du texte…</p>';
      try {
        const r = await AI.reading(tp[2], n, reviewWords([k]));
        Store.state.reading = { ...r, answers: [], feedback: null, topic: tp[1] }; Store.save();
        renderReading(Store.state.reading);
      } catch (e) { $('#rOut').innerHTML = `<p class="err">${esc(e.message)}</p>`; }
      $('#rGo').disabled = false;
    };
    if (saved && saved.text) renderReading(saved);
  };

  function renderReading(r) {
    // Mise en évidence des mots du glossaire (une seule fois chacun)
    let html = esc(r.text);
    const marks = [];
    (r.glossary || []).forEach(g => {
      const re = new RegExp('(^|[^\\p{L}])(' + esc(g.word).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?![\\p{L}])', 'iu');
      html = html.replace(re, (m, pre, w) => { marks.push(`<span class="gl" data-fr="${esc(g.fr)}">${w}</span>`); return pre + '\u0001' + (marks.length - 1) + '\u0002'; });
    });
    html = html.replace(/\u0001(\d+)\u0002/g, (m, k) => marks[k]);
    const paras = html.split(/\n\s*\n|\n/).filter(p => p.trim()).map(p => `<p>${p}</p>`).join('');
    $('#rOut').innerHTML = `<section class="section"><div class="section-head"><h2>${esc(r.title)}</h2><span class="muted small">${esc(r.topic || '')}</span></div>
      <div class="row" style="margin:0 0 20px"><button class="btn ghost small" id="rListen">${icon('sound')} Écouter</button><button class="btn quiet small" id="rSlow">0.8×</button><button class="btn quiet small" id="rStop">Stop</button>${speedChips()}</div>
      <div class="reading">${paras}</div>
      ${r.translation_fr ? `<details style="margin-top:12px"><summary class="small">Traduction</summary><div class="review">${esc(r.translation_fr)}</div></details>` : ''}
      <details style="margin-top:12px"><summary class="small">Glossaire (${(r.glossary || []).length})</summary><table>${(r.glossary || []).map(g => `<tr><td>${sayBtn(g.word)} <b>${esc(g.word)}</b></td><td>${esc(g.fr)}</td></tr>`).join('')}</table>
        <button class="btn small quiet" id="rAdd">Ajouter ces mots à mes révisions</button></details></section>
      <section class="section"><div class="section-head"><h2>${esc(T.questions)}</h2><span class="muted small">Réponds à l’oral, en phrases complètes</span></div>
        ${(r.questions || []).map((q, k) => `<div class="q-block"><div class="q"><span class="muted">${k + 1}.</span><span>${esc(q)}</span>${sayBtn(q)}</div>
          <div class="answer-row"><button class="mic" data-mic="${k}"></button><textarea rows="2" data-ans="${k}" placeholder="Ta réponse">${esc((r.answers || [])[k] || '')}</textarea></div><div data-fb="${k}"></div></div>`).join('')}
        <div class="row"><button class="btn" id="rCheck">Corriger mes réponses (1 requête)</button></div></section>`;
    const text = r.text;
    $('#rListen').onclick = () => Speech.speak(text);
    $('#rSlow').onclick = () => Speech.speak(text, { rate: 0.8 });
    $('#rStop').onclick = () => Speech.stopSpeaking();
    $$('.gl').forEach(el => el.onclick = () => { el.classList.toggle('show'); Speech.speak(el.textContent); });
    $('#rAdd').onclick = e => {
      let n = 0; (r.glossary || []).forEach(g => { if (Store.addCustom({ id: 'lect:' + norm(g.word), theme: 'lectures', tl: g.word, fr: g.fr, syn: [] })) n++; });
      e.target.textContent = `${n} mot${n > 1 ? 's' : ''} ajouté${n > 1 ? 's' : ''}`; e.target.disabled = true;
    };
    $$('[data-mic]').forEach(b => micFor(b, $(`[data-ans="${b.dataset.mic}"]`)));
    const showFb = fb => (fb.items || []).forEach((f, k) => {
      const el = $(`[data-fb="${k}"]`); if (!el) return;
      el.innerHTML = `<div class="fix" style="margin-top:10px;border-color:${f.ok ? 'var(--good)' : 'var(--accent)'}"><b>${esc(f.better)}</b> ${sayBtn(f.better)}<span class="why">${esc(f.comment)}</span></div>`;
    });
    if (r.feedback) showFb(r.feedback);
    $('#rCheck').onclick = async e => {
      const answers = (r.questions || []).map((q, k) => $(`[data-ans="${k}"]`).value.trim());
      if (!answers.some(Boolean)) return;
      e.target.disabled = true; e.target.textContent = 'Correction…';
      try {
        const fb = await AI.readingFeedback(r.text, r.questions, answers);
        (fb.items || []).forEach(f => { if (f.topic) Store.recordTopic(f.topic, !!f.ok, 0.08); });
        Object.assign(Store.state.reading, { answers, feedback: fb }); Store.save();
        showFb(fb);
      } catch (err) { toast(esc(err.message)); }
      e.target.disabled = false; e.target.textContent = 'Corriger mes réponses (1 requête)';
    };
  }

  // =====================================================================
  // BOUÉE : retrouver un mot
  // =====================================================================
  function localLookup(q) {
    const n = stripAccents(norm(q)); if (!n) return [];
    return allWords().map(w => {
      let sc = 0;
      [w.fr, w.tl, ...w.syn].map(x => stripAccents(norm(x))).forEach((f, k) => {
        if (f === n) sc = Math.max(sc, 10 - k * 0.1); else if (f.split(/[ ,/']+/).includes(n)) sc = Math.max(sc, 6); else if (n.length > 2 && f.includes(n)) sc = Math.max(sc, 3);
      });
      return { w, sc };
    }).filter(x => x.sc > 0).sort((a, b) => b.sc - a.sc).slice(0, 12).map(x => x.w);
  }
  function boueeUI(root) {
    root.innerHTML = `<span class="eyebrow">Bouée</span><h2>Un mot me manque</h2>
      <p class="muted" style="margin-top:8px">Tape un mot en français, ou en ${L.langNameFr} pour trouver des synonymes.</p>
      <div class="answer-row" style="margin-top:16px"><input id="bIn" placeholder="${esc(T.lookupPlaceholder)}" autocomplete="off"><button class="btn" id="bGo">Chercher</button></div>
      <div id="bOut"></div>
      <div class="tip"><span class="eyebrow">En pleine conversation</span>${T.circumlocution.map(c => `<i>${esc(c)}</i>`).join(' · ')}</div>`;
    const goSearch = () => {
      const q = $('#bIn', root).value.trim(); if (!q) return;
      const res = localLookup(q);
      $('#bOut', root).innerHTML = `${res.length ? `<table style="margin-top:18px">${res.map(w => `<tr><td>${sayBtn(speakable(w.tl))} <b>${esc(w.tl)}</b></td><td>${esc(w.fr)}</td><td class="muted">${esc(w.syn.join(', '))}</td></tr>`).join('')}</table>` : '<p class="muted" style="margin-top:16px">Rien dans le dictionnaire de l’app.</p>'}
        ${AI.hasKey() ? '<button class="btn ghost small" id="bAI">Demander à l’IA</button><div id="bAIOut"></div>' : ''}`;
      const b = $('#bAI', root);
      if (b) b.onclick = async () => {
        b.disabled = true; $('#bAIOut', root).innerHTML = '<p class="thinking">Recherche…</p>';
        try {
          const r = await AI.lookup(q);
          $('#bAIOut', root).innerHTML = `<div class="review" style="white-space:normal">${(r.results || []).map(x => `<div style="margin-bottom:6px">${sayBtn(x.word)} <b>${esc(x.word)}</b> ${esc(x.fr)} ${x.note ? `<span class="tag">${esc(x.note)}</span>` : ''}</div>`).join('')}
            ${r.synonyms && r.synonyms.length ? `<p style="margin-top:10px"><span class="eyebrow">Synonymes</span>${r.synonyms.map(esc).join(', ')}</p>` : ''}
            ${r.example ? `<p><span class="eyebrow">Exemple</span><i>${esc(r.example)}</i></p>` : ''}${r.circumlocution ? `<p><span class="eyebrow">Pour le décrire</span><i>${esc(r.circumlocution)}</i></p>` : ''}
            <button class="btn small" id="bAdd">Ajouter à mes révisions</button></div>`;
          $('#bAdd', root).onclick = (e) => {
            (r.results || []).slice(0, 1).forEach(x => Store.addCustom({ id: 'conv:' + norm(x.word), theme: 'conversation', tl: x.word, fr: x.fr, syn: r.synonyms || [] }));
            e.target.textContent = 'Ajouté'; e.target.disabled = true;
          };
        } catch (e) { $('#bAIOut', root).innerHTML = `<p class="err">${esc(e.message)}</p>`; }
      };
    };
    $('#bGo', root).onclick = goSearch;
    $('#bIn', root).onkeydown = e => { if (e.key === 'Enter') goSearch(); };
    $('#bIn', root).focus();
  }
  $('#fabBouee').onclick = () => { const box = modal('<div id="mb"></div>'); boueeUI($('#mb', box)); };

  // =====================================================================
  // PROGRESS
  // =====================================================================
  routes.progress = () => {
    const days = Array.from({ length: 14 }, (_, k) => Store.today(k - 13));
    const goal = S().dailyMinutes;
    const max = Math.max(goal * 1.2, ...days.map(d => Store.totalMin(d)));
    const week = days.slice(-7).reduce((a, d) => a + Store.totalMin(d), 0);
    const allDates = new Set([...Object.keys(Store.state.days), ...Object.values(Store.state.peers || {}).flatMap(p => Object.keys(p.days || {}))]);
    const micMin = [...allDates].reduce((a, d) => a + Store.dayAgg(d).speakSec, 0) / 60;
    const learned = Object.values(Store.state.cards).filter(c => c.box >= 3).length;
    const errs = Store.state.errors.slice(-30).reverse();
    const errCount = {};
    Store.state.errors.forEach(e => { errCount[e.topic] = (errCount[e.topic] || 0) + 1; });
    view.innerHTML = head('Progrès', esc(N.progress)) + `
      <div class="stat-row"><div><b>${streak()}</b><span>jours d’affilée</span></div><div><b>${Math.round(week)}</b><span>min cette semaine</span></div><div><b>${Math.round(micMin)}</b><span>min au micro</span></div><div><b>${learned}</b><span>mots acquis</span></div></div>
      <div class="panel"><span class="eyebrow">14 derniers jours</span>
        <div class="chart" style="margin-top:16px">${days.map(d => {
      const x = Store.dayAgg(d), v = Store.totalMin(d);
      return `<div class="col" title="${d} : ${Math.round(v)} min"><div class="stack" style="height:${v / max * 100}%">${['vocab', 'gram', 'conv'].map(k => `<div class="seg ${k}" style="flex:${x.min[k]}"></div>`).join('')}</div><span>${d.slice(8)}</span></div>`;
    }).join('')}<div class="goal-line" style="bottom:${goal / max * 100}%"></div></div>
        <div class="legend"><span><i class="seg vocab"></i>Vocabulaire</span><span><i class="seg gram"></i>Verbes, grammaire${SOUNDS_ON ? ', prononciation' : ''}</span><span><i class="seg conv"></i>Oral et lecture</span><span>Pointillés : objectif</span></div></div>
      <div class="two-col" style="margin-top:20px">
        <div class="panel"><span class="eyebrow">Grammaire</span><p class="muted small">Coche les points où tu te sens faible : ils passent en priorité.</p>
          ${GRAMMAR.ORDER.map(id => { const t = Store.topic(id), p = pct(t.score); return `<label class="check" style="display:grid;grid-template-columns:auto 1fr 90px;gap:12px"><input type="checkbox" data-weak="${id}" ${Store.state.weakSelf.includes(id) ? 'checked' : ''}><span>${esc(topicLabel(id))}${errCount[id] ? ` <span class="muted small">· ${errCount[id]} erreur${errCount[id] > 1 ? 's' : ''} à l’oral</span>` : ''}</span><span class="meter ${t.n ? meterCls(p) : ''}"><i style="width:${t.n ? p : 0}%"></i></span></label>`; }).join('')}</div>
        <div><div class="panel"><span class="eyebrow">${esc(T.verbsEyebrow)}</span>${Conj.TRAIN.map(t => { const x = Store.conjTense(t), p = pct(x.score); return `<div style="display:grid;grid-template-columns:1fr 90px;gap:12px;align-items:center;margin:10px 0"><span>${esc(Conj.NAMES[t])}</span><span class="meter ${x.n ? meterCls(p) : ''}"><i style="width:${x.n ? p : 0}%"></i></span></div>`; }).join('')}</div>
          <div class="panel"><span class="eyebrow">Dernières erreurs à l’oral</span>${errs.length ? errs.map(c => `<div class="fix"><s>${esc(c.original)}</s> <b>${esc(c.corrected)}</b><span class="why">${esc(topicLabel(c.topic))}</span></div>`).join('') : '<p class="muted">Rien pour l’instant.</p>'}</div></div>
      </div>
      <div class="panel" style="margin-top:20px"><span class="eyebrow">Sauvegarde</span><p class="muted small">Tes progrès sont stockés dans ce navigateur${Sync.enabled() ? ' et synchronisés avec ton dépôt privé' : ''}. Tu peux aussi les exporter.</p>
        <div class="row"><button class="btn ghost small" id="exp">Exporter</button><label class="btn ghost small">Importer<input type="file" id="imp" accept=".json" hidden></label></div></div>`;
    $$('[data-weak]').forEach(cb => cb.onchange = () => {
      const set = new Set(Store.state.weakSelf), id = cb.dataset.weak;
      if (cb.checked) { set.add(id); const t = Store.topic(id); if (!t.n) t.score = 0.3; } else set.delete(id);
      Store.state.weakSelf = [...set]; Store.touchPrefs();
    });
    $('#exp').onclick = () => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([Store.exportData()], { type: 'application/json' }));
      a.download = `${L.id}-progres-${Store.today()}.json`; a.click();
    };
    $('#imp').onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      try { Store.importData(await f.text()); toast('Import réussi.'); go(); } catch (err) { toast('Fichier invalide.'); }
    };
  };

  // =====================================================================
  // SETTINGS
  // =====================================================================
  routes.settings = () => {
    const s = S();
    Speech.loadVoices();
    const vs = Speech.status();
    const V = L.voice;
    const voiceOpts = () => {
      const main = Speech.voices.filter(Speech.isPreferred), other = Speech.voices.filter(v => !Speech.isPreferred(v));
      const opt = v => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === s.ttsVoice ? 'selected' : ''}>${esc(v.name)}</option>`;
      return (main.length ? `<optgroup label="${esc(V.preferLabel)}">${main.map(opt).join('')}</optgroup>` : '') + (other.length ? `<optgroup label="${esc(V.otherLabel)}">${other.map(opt).join('')}</optgroup>` : '') || `<option>Aucune voix native trouvée</option>`;
    };
    view.innerHTML = head('Réglages', esc(N.settings)) + `
      <div class="panel"><span class="eyebrow">Intelligence artificielle</span><h3 style="margin-bottom:18px">Conversation, lecture et bouée</h3>
        <label class="field"><span>Fournisseur</span><select id="provider"><option value="gemini">Google Gemini, gratuit (recommandé)</option><option value="openai">Compatible OpenAI : Groq, OpenRouter…</option></select></label>
        <div id="pGemini">
          <ol class="small" style="padding-left:18px;color:var(--ink-2)"><li>Ouvre <a class="link" href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a> avec ton compte Google.</li><li>Clique sur « Create API key » et copie la clé.</li><li>Colle-la ci-dessous. Elle reste dans ce navigateur, est partagée avec tes autres apps de langues et n’est jamais écrite dans les sauvegardes.</li></ol>
          <label class="field"><span>Clé API Gemini</span><input id="gKey" type="password" value="${esc(s.geminiKey)}" placeholder="AIza… ou AQ.…"></label>
          <label class="field"><span>Modèle</span><div style="display:flex;gap:10px"><select id="gModel"><option value="${esc(s.geminiModel)}">${esc(s.geminiModel)}</option></select><button class="btn quiet small" id="gList">Charger la liste</button></div></label>
          <p class="muted small">« gemini-flash-latest » suit le dernier modèle Flash gratuit. Si le quota est atteint, l’app passe automatiquement sur un modèle plus léger. Le quota est commun à tes trois apps.</p>
        </div>
        <div id="pOA">
          <p class="small">Groq propose aussi un quota gratuit (<a class="link" href="https://console.groq.com/keys" target="_blank" rel="noopener">console.groq.com/keys</a>) : un bon plan B quand Gemini est épuisé.</p>
          <label class="field"><span>URL de base</span><input id="oBase" value="${esc(s.oaBase)}"></label>
          <label class="field"><span>Clé API</span><input id="oKey" type="password" value="${esc(s.oaKey)}"></label>
          <label class="field"><span>Modèle</span><input id="oModel" value="${esc(s.oaModel)}"></label>
        </div>
        <div class="row"><button class="btn" id="test">Tester la connexion</button><span id="testOut" class="small"></span></div>
      </div>
      <div class="panel"><span class="eyebrow">Voix</span><h3 style="margin-bottom:14px">${esc(V.title)}</h3>
        <div class="notice ${vs.ok && !vs.warn ? 'done' : 'warn'}">${vs.ok && !vs.warn ? `Voix active : <b>${esc(vs.msg)}</b>` : esc(vs.msg)}</div>
        <p class="muted small">${V.help}</p>
        ${V.variants ? `<label class="field"><span>Accent</span><select id="variant">${V.variants.map(([k, l]) => `<option value="${k}" ${s.voiceVariant === k ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>` : ''}
        <label class="field"><span>Voix par défaut</span><select id="voice">${voiceOpts()}</select></label>
        <label class="check"><input type="checkbox" id="byRole" ${s.voiceByRole ? 'checked' : ''}> Une voix d’homme ou de femme selon le personnage</label>
        <label class="field" style="margin-top:14px"><span>Vitesse : <b id="rateV">${s.ttsRate}</b></span><input id="rate" type="range" min="0.5" max="2" step="0.05" value="${s.ttsRate}"></label>
        <label class="check"><input type="checkbox" id="autoSpeak" ${s.autoSpeak ? 'checked' : ''}> Lire automatiquement les réponses en conversation</label>
        <label class="check"><input type="checkbox" id="hands" ${s.handsFree ? 'checked' : ''}> Mode mains libres : le micro se rouvre après chaque réponse</label>
        <div class="row"><button class="btn ghost small" id="tF">Tester une voix féminine</button><button class="btn ghost small" id="tM">Tester une voix masculine</button></div>
      </div>
      <div class="panel" id="syncPanel"><span class="eyebrow">Téléphone et synchronisation</span><h3 style="margin-bottom:14px">Même progression sur le PC et le téléphone</h3>
        <div class="notice" id="syncState"></div>
        <details ${Sync.enabled() ? '' : 'open'}><summary class="small" style="margin-bottom:12px">Créer ton jeton GitHub (une seule fois pour les trois apps, 2 minutes)</summary>
          <ol class="small" style="padding-left:18px;color:var(--ink-2)">
            <li>Ouvre <a class="link" href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">github.com/settings/personal-access-tokens/new</a>.</li>
            <li>Nom : <b>applangues</b>. Expiration : <b>1 an</b> (ou plus).</li>
            <li>Repository access : <b>Only select repositories</b>, puis choisis <b>hablemos-data</b>.</li>
            <li>Permissions, Repository permissions : <b>Contents</b> en <b>Read and write</b>. Rien d’autre.</li>
            <li>Clique sur <b>Generate token</b>, copie-le et colle-le ci-dessous.</li></ol>
          <p class="muted small">Ce jeton ne donne accès qu’à ton dépôt privé de progression. Il reste dans ce navigateur et sert aux trois apps.</p></details>
        <label class="field"><span>Jeton GitHub</span><input id="ghToken" type="password" value="${esc(Sync.cfg().token || '')}" placeholder="github_pat_…"></label>
        <label class="field"><span>Dépôt de progression</span><input id="ghRepo" value="${esc(Sync.cfg().repo || L.dataRepo)}"></label>
        <div class="row"><button class="btn" id="syncGo">Synchroniser maintenant</button></div>
        <div id="phoneBox" style="margin-top:28px;border-top:1px solid var(--line);padding-top:24px"></div>
      </div>
      <div class="panel"><span class="eyebrow">Séance</span><h3 style="margin-bottom:18px">Rythme quotidien</h3>
        <label class="field"><span>Durée visée par jour (minutes)</span><input id="dMin" type="number" min="5" max="120" value="${s.dailyMinutes}"></label>
        <label class="field"><span>Budget de requêtes IA par jour (pour cette langue)</span><input id="dReq" type="number" min="20" max="5000" value="${s.dailyRequests}"></label>
        <p class="muted small">Une minute de conversation coûte environ 2 à 3 requêtes. Le quota gratuit de Gemini est partagé entre tes trois apps.</p>
        <label class="field"><span>Nouveaux mots par jour</span><input id="nNew" type="number" min="0" max="50" value="${s.newPerDay}"></label>
        <label class="field"><span>Niveau de l’IA</span><select id="level">${L.levels.map(l => `<option>${l}</option>`).join('')}</select></label>
      </div>`;
    const set = (k, v) => { s[k] = v; if (Store.SHARED_PREFS.includes(k)) Store.touchPrefs(); else Store.save(); };
    $('#provider').value = s.provider; $('#level').value = s.level;
    const toggleP = () => { $('#pGemini').style.display = s.provider === 'gemini' ? '' : 'none'; $('#pOA').style.display = s.provider === 'gemini' ? 'none' : ''; };
    toggleP();
    $('#provider').onchange = e => { set('provider', e.target.value); toggleP(); };
    $('#gKey').onchange = e => { Store.setSharedKey('geminiKey', e.target.value.trim()); renderPhone(); };
    $('#gModel').onchange = e => set('geminiModel', e.target.value);
    $('#oBase').onchange = e => Store.setSharedKey('oaBase', e.target.value.trim());
    $('#oKey').onchange = e => Store.setSharedKey('oaKey', e.target.value.trim());
    $('#oModel').onchange = e => Store.setSharedKey('oaModel', e.target.value.trim());
    $('#dMin').onchange = e => set('dailyMinutes', Math.max(5, +e.target.value || L.defaults.dailyMinutes));
    $('#dReq').onchange = e => set('dailyRequests', Math.max(20, +e.target.value || 300));
    $('#nNew').onchange = e => set('newPerDay', Math.max(0, +e.target.value || 0));
    $('#level').onchange = e => set('level', e.target.value);
    $('#voice').onchange = e => set('ttsVoice', e.target.value);
    if ($('#variant')) $('#variant').onchange = e => { set('voiceVariant', e.target.value); set('ttsVoice', ''); Speech.loadVoices(); $('#voice').innerHTML = voiceOpts(); };
    $('#byRole').onchange = e => set('voiceByRole', e.target.checked);
    $('#rate').oninput = e => { set('ttsRate', +e.target.value); syncSpeed(); };
    $('#autoSpeak').onchange = e => set('autoSpeak', e.target.checked);
    $('#hands').onchange = e => set('handsFree', e.target.checked);
    $('#tF').onclick = () => Speech.speak(V.testF, { gender: 'f' });
    $('#tM').onclick = () => Speech.speak(V.testM, { gender: 'm' });
    // Les voix du navigateur arrivent parfois après le premier rendu
    window.addEventListener('voiceschanged-app', function once() { if ($('#voice')) $('#voice').innerHTML = voiceOpts(); else window.removeEventListener('voiceschanged-app', once); });

    // --- Synchro ---
    const syncState = () => {
      const st = Sync.status, el = $('#syncState'); if (!el) return;
      el.className = 'notice ' + (!Sync.enabled() ? '' : st.state === 'error' ? 'warn' : 'done');
      el.innerHTML = !Sync.enabled() ? 'Synchro désactivée : colle ton jeton GitHub ci-dessous.'
        : st.state === 'error' ? 'Erreur : ' + esc(st.error)
        : st.state === 'syncing' ? 'Synchronisation en cours…'
        : st.last ? `Synchronisé à ${st.last.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })}. Appareils : ${esc([Sync.deviceName() + ' (celui-ci)', ...Object.values(Store.state.peers || {}).map(p => p.name)].join(', '))}.`
        : 'Synchro activée.';
    };
    syncState();
    window.addEventListener('sync-status', function onS() { if ($('#syncState')) syncState(); else window.removeEventListener('sync-status', onS); });
    const saveCfg = () => Sync.setCfg({ token: $('#ghToken').value.trim(), repo: $('#ghRepo').value.trim() });
    $('#ghToken').onchange = () => { saveCfg(); renderPhone(); };
    $('#ghRepo').onchange = saveCfg;
    $('#syncGo').onclick = async () => { saveCfg(); await Sync.syncNow(); renderPhone(); };

    // --- Configuration du téléphone par QR code ---
    async function renderPhone() {
      const box = $('#phoneBox'); if (!box) return;
      const c = Sync.cfg();
      const link = PAGES_URL + '#setup=' + b64url(JSON.stringify({ g: s.geminiKey || '', t: c.token || '', r: c.repo || '' }));
      let ntfy = null;
      if (Sync.enabled()) { try { ntfy = await Sync.readJson('ntfy.json'); } catch (e) { } }
      if (!$('#phoneBox')) return;
      const others = (L.siblings || []).map(([n, u]) => `<a class="link" href="${u}" target="_blank" rel="noopener">${esc(n)}</a>`).join(', ');
      box.innerHTML = `<span class="eyebrow">Sur ton téléphone</span>
        <ol class="small" style="padding-left:18px;color:var(--ink-2)">
          <li>Scanne ce QR code avec l’appareil photo : l’app s’ouvre déjà configurée (clé Gemini et synchro, valables aussi pour tes autres apps de langues).</li>
          <li>Ajoute-la à l’écran d’accueil. Android (Chrome) : menu ⋮ puis « Ajouter à l’écran d’accueil ». iPhone (Safari) : bouton Partager puis « Sur l’écran d’accueil ».</li>
          <li>Autorise le micro au premier exercice oral.</li></ol>
        <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap;margin-top:12px"><div id="qr" style="background:#fff;padding:12px;line-height:0"></div>
          <div class="small" style="max-width:340px"><p>Ce QR code contient tes clés : ne le montre à personne.</p><button class="btn quiet small" id="copyLink">Copier le lien</button>
          <p class="muted" style="margin-top:10px">Adresse de l’app : <a class="link" href="${PAGES_URL}" target="_blank" rel="noopener">${PAGES_URL.replace('https://', '')}</a>${others ? `<br>Tes autres apps : ${others}` : ''}</p></div></div>
        ${ntfy && ntfy.topic ? `<div style="margin-top:24px"><span class="eyebrow">Rappels sur le téléphone</span>
          <ol class="small" style="padding-left:18px;color:var(--ink-2)"><li>Installe l’app gratuite <b>ntfy</b> (Play Store ou App Store).</li>
          <li>Touche « + » puis abonne-toi au sujet <b style="user-select:all">${esc(ntfy.topic)}</b> (serveur ntfy.sh, celui par défaut).</li>
          <li>Tu recevras un rappel toutes les 2 h entre 8 h et 20 h, tant qu’une séance du jour n’est pas faite.</li></ol></div>` : ''}`;
      try {
        await loadScript('js/vendor/qrcode.min.js');
        new QRCode($('#qr'), { text: link, width: 208, height: 208, correctLevel: QRCode.CorrectLevel.M });
      } catch (e) { $('#qr').textContent = 'QR code indisponible'; }
      $('#copyLink').onclick = async () => { try { await navigator.clipboard.writeText(link); $('#copyLink').textContent = 'Lien copié'; } catch (e) { prompt('Copie ce lien :', link); } };
    }
    renderPhone();

    $('#gList').onclick = async () => {
      try {
        const models = await AI.listGeminiModels();
        const ids = ['gemini-flash-latest', 'gemini-flash-lite-latest', ...models.map(m => m.id)];
        $('#gModel').innerHTML = [...new Set(ids)].map(id => `<option value="${esc(id)}" ${id === s.geminiModel ? 'selected' : ''}>${esc(id)}</option>`).join('');
      } catch (e) { toast('Impossible de lister les modèles : ' + esc(e.message)); }
    };
    $('#test').onclick = async () => {
      $('#testOut').textContent = '…';
      try { const r = await AI.chat(L.ai.testSystem, [{ role: 'user', content: L.ai.testUser }]); $('#testOut').innerHTML = `${icon('check')} ${esc(r)}`; }
      catch (e) { $('#testOut').innerHTML = `<span class="err">${esc(e.message)}</span>`; }
    };
  };

  importSetupFromHash();
  go();
  Store.sync(true);
  if (Sync.enabled()) Sync.syncNow();
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => { });
})();
