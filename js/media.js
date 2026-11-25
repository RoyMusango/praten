// Médias interactifs (moteur commun) : sons d'interface synthétisés et lecteur de leçons animées.
// Aucun fichier audio ni vidéo : les sons sont générés par Web Audio, les leçons sont des scènes animées
// lues par la voix native de la langue (Speech). Les sous-titres explicatifs restent en français, à l'écran.
(function (global) {
  // =====================================================================
  // Sons d'interface (réglage « Effets sonores »)
  // =====================================================================
  const Sfx = (() => {
    let ctx = null;
    const enabled = () => !global.Store || Store.settings.sfx !== false;
    function ac() {
      const C = global.AudioContext || global.webkitAudioContext;
      if (!C) return null;
      if (!ctx) ctx = new C();
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }
    function tone(freq, start, dur, { type = 'sine', vol = 0.1, slide } = {}) {
      const c = ac(); if (!c) return;
      const t = c.currentTime + start;
      const o = c.createOscillator(), g = c.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(c.destination);
      o.start(t); o.stop(t + dur + 0.05);
    }
    const SOUNDS = {
      ok: () => { tone(880, 0, 0.16, { type: 'triangle', vol: 0.09 }); tone(1318.5, 0.08, 0.28, { type: 'triangle', vol: 0.09 }); },
      bad: () => { tone(311, 0, 0.26, { vol: 0.09, slide: 233 }); },
      tap: () => tone(1250, 0, 0.05, { vol: 0.04 }),
      pop: () => tone(620, 0, 0.1, { type: 'triangle', vol: 0.06, slide: 980 }),
      flip: () => tone(420, 0, 0.12, { vol: 0.05, slide: 640 }),
      streak: () => [784, 1046.5, 1318.5].forEach((f, i) => tone(f, i * 0.07, 0.2, { type: 'triangle', vol: 0.07 })),
      done: () => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.11, 0.42, { type: 'triangle', vol: 0.08 })),
      soft: () => [392, 523.25].forEach((f, i) => tone(f, i * 0.12, 0.35, { type: 'sine', vol: 0.07 })),
      scene: () => tone(1046.5, 0, 0.16, { vol: 0.025 }),
    };
    function play(name) { if (!enabled()) return; try { SOUNDS[name] && SOUNDS[name](); } catch (e) { } }
    return { play, enabled };
  })();

  // Petit effet visuel sur un bloc (réponse juste : léger rebond ; fausse : secousse)
  function react(el, ok) {
    if (!el) return;
    el.classList.remove('fx-good', 'fx-bad'); void el.offsetWidth;
    el.classList.add(ok ? 'fx-good' : 'fx-bad');
  }

  // =====================================================================
  // Lecteur de leçons animées
  // Une leçon = suite de scènes. Dans les phrases, *mot* est surligné ; « habl|é » sépare radical et terminaison.
  // Types : title, ex, conj, timeline, vs, tip, move, quiz (voir js/data/lessons.js)
  // =====================================================================
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const plain = s => String(s).replace(/\*/g, '').replace(/\|/g, '');
  const firstVariant = s => String(s).split('/')[0].trim();
  // Phrase avec surlignage : chaque mot apparaît à son tour
  function words(s, base = 0) {
    let on = false, i = base;
    return String(s).split(/\s+/).filter(Boolean).map(tok => {
      const open = /^[¿¡(«]*\*/.test(tok), close = /.\*[.,!?;:…)»]*$/.test(tok), t = tok.replace(/\*/g, '');
      if (open) on = true;
      const hl = on;
      if (close) on = false;
      return `<span class="w ${hl ? 'hl' : ''}" style="--i:${i++}">${esc(t)}</span>`;
    }).join(' ');
  }
  const mark = x => esc(x).replace(/\*([^*]+)\*/g, '<b class="end">$1</b>');
  const ending = s => { const [a, b] = String(s).split('|'); return b === undefined ? mark(a) : `${mark(a)}<b class="end">${mark(b)}</b>`; };
  const COLORS = ['var(--accent)', 'var(--accent-2)', 'var(--gold)', 'var(--good)'];

  function LessonPlayer(root, lesson, opt = {}) {
    const icon = opt.icon || (() => '');
    const scenes = lesson.scenes;
    let idx = 0, playing = true, token = 0, timer = null, quizOk = 0, quizN = 0;
    root.innerHTML = `<div class="lesson" tabindex="-1">
        <div class="lesson-stage"><div class="lesson-scene" aria-live="polite"></div><div class="voice-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div></div>
        <div class="lesson-cap"></div>
        <div class="lesson-bar">
          <button class="icon-btn" data-l="prev" title="Scène précédente" aria-label="Scène précédente">${icon('back')}</button>
          <button class="lesson-play" data-l="play" aria-label="Pause"></button>
          <button class="icon-btn" data-l="next" title="Scène suivante" aria-label="Scène suivante">${icon('arrow')}</button>
          <div class="lesson-segs">${scenes.map((_, i) => `<button data-seg="${i}" aria-label="Scène ${i + 1}"><i></i></button>`).join('')}</div>
          <button class="icon-btn" data-l="again" title="Réécouter la scène" aria-label="Réécouter la scène">${icon('sound')}</button>
        </div></div>`;
    const stage = root.querySelector('.lesson-scene'), cap = root.querySelector('.lesson-cap'), wave = root.querySelector('.voice-wave');
    const playBtn = root.querySelector('[data-l="play"]');
    const paintPlay = () => {
      playBtn.innerHTML = playing ? '<svg viewBox="0 0 24 24"><rect x="6.5" y="5" width="4" height="14" rx="1.2"/><rect x="13.5" y="5" width="4" height="14" rx="1.2"/></svg>' : '<svg viewBox="0 0 24 24"><path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.2-6.5a1 1 0 0 0 0-1.7L9.5 4.6A1 1 0 0 0 8 5.5z"/></svg>';
      playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Lecture');
      root.querySelector('.lesson').classList.toggle('paused', !playing);
    };
    const segs = () => root.querySelectorAll('[data-seg]');
    function paintSegs() { segs().forEach((b, i) => { b.className = i < idx ? 'done' : i === idx ? 'cur' : ''; }); }

    // Attente annulable : chaque changement de scène invalide les attentes en cours
    const alive = t => t === token && root.isConnected;
    const wait = (ms, t) => new Promise(ok => { timer = setTimeout(() => ok(alive(t)), ms); });
    function say(text, t) {
      return new Promise(ok => {
        if (!alive(t)) return ok(false);
        const txt = plain(text);
        let finished = false;
        const end = () => { if (finished) return; finished = true; wave.classList.remove('on'); ok(alive(t)); };
        wave.classList.add('on');
        // Filet de sécurité si la voix ne signale pas sa fin
        const rate = (global.Store && Store.settings.ttsRate) || 1;
        setTimeout(end, 2500 + txt.length * 110 / rate);
        Speech.speak(txt, { onend: end });
      });
    }
    const capTime = s => Math.min(9000, 1400 + String(s || '').length * 42);

    // ----- Rendu des scènes : chaque scène renvoie ses étapes (apparition + phrase lue) -----
    const R = {
      title: s => ({ html: `<div class="sc-title"><span class="eyebrow">${esc(s.kicker || 'Leçon')}</span><h2>${esc(s.h)}</h2>${s.sub ? `<p>${esc(s.sub)}</p>` : ''}</div>`, steps: s.say ? [{ say: s.say }] : [] }),
      ex: s => ({
        html: `<div class="sc-ex">${s.h ? `<h3>${esc(s.h)}</h3>` : ''}${s.ex.map((e, i) => `<div class="exl" data-step="${i}"><div class="tl">${words(e[0])}</div>${e[1] ? `<div class="fr">${esc(e[1])}</div>` : ''}</div>`).join('')}</div>`,
        steps: s.ex.map((e, i) => ({ show: i, say: e[0] })),
      }),
      conj: s => ({
        html: `<div class="sc-conj">${s.verb ? `<div class="verb">${ending(s.verb)}${s.vfr ? `<span>${esc(s.vfr)}</span>` : ''}</div>` : ''}<table>${s.rows.map((r, i) => `<tr data-step="${i}"><td>${esc(r[0])}</td><td>${ending(r[1])}</td>${r[2] ? `<td class="fr">${esc(r[2])}</td>` : ''}</tr>`).join('')}</table></div>`,
        steps: s.rows.map((r, i) => ({ show: i, say: s.sayLeft === false ? plain(r[1]) : firstVariant(r[0]) + ' ' + plain(r[1]) })),
      }),
      timeline: s => {
        const X = at => 300 + at * 250;
        const marks = s.events.map((e, i) => {
          const c = COLORS[i % COLORS.length], x = X(e.at);
          if (e.kind === 'span' || e.kind === 'habit') {
            const x1 = X(e.from), x2 = X(e.to);
            const dots = e.kind === 'habit' ? Array.from({ length: 6 }, (_, k) => `<circle cx="${x1 + (x2 - x1) * (k + 0.5) / 6}" cy="70" r="5" fill="${c}"/>`).join('') : `<rect x="${x1}" y="64" width="${x2 - x1}" height="12" rx="6" fill="${c}"/>`;
            return `<g class="tm span" data-step="${i}" style="transform-origin:${x1}px 70px">${dots}</g>`;
          }
          if (e.kind === 'link') return `<g class="tm link" data-step="${i}"><circle cx="${x}" cy="70" r="8" fill="${c}"/><path d="M${x} 62 Q ${(x + X(0)) / 2} 18 ${X(0) - 4} 60" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="5 6" stroke-linecap="round"/></g>`;
          return `<g class="tm point" data-step="${i}" style="transform-origin:${x}px 70px"><circle cx="${x}" cy="70" r="9" fill="${c}"/><path d="M${x} 52v-14" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/></g>`;
        }).join('');
        const L = s.labels || ['passé', 'maintenant', 'futur'];
        return {
          html: `<div class="sc-time"><svg viewBox="0 0 600 120" role="img" aria-label="Ligne du temps">
              <path class="axis" d="M30 70H570" /><path class="axis" d="M560 63l10 7-10 7"/>
              <path class="now" d="M300 40v52"/><text x="300" y="112" text-anchor="middle" class="nowt">${esc(L[1])}</text>
              <text x="36" y="112" class="lt">${esc(L[0])}</text><text x="566" y="112" text-anchor="end" class="lt">${esc(L[2])}</text>${marks}</svg>
            <div class="tl-list">${s.events.map((e, i) => `<div class="exl" data-step="${i}"><i style="background:${COLORS[i % COLORS.length]}"></i><div><div class="tl">${words(e.tl)}</div>${e.fr ? `<div class="fr">${esc(e.fr)}</div>` : ''}</div></div>`).join('')}</div></div>`,
          steps: s.events.map((e, i) => ({ show: i, say: e.tl })),
        };
      },
      vs: s => {
        const col = (c, k) => `<div class="vs-col ${k}"><h3>${esc(c.h)}</h3>${c.sub ? `<p class="sub">${esc(c.sub)}</p>` : ''}${c.ex.map((e, i) => `<div class="exl" data-step="${k}${i}"><div class="tl">${words(e[0])}</div>${e[1] ? `<div class="fr">${esc(e[1])}</div>` : ''}</div>`).join('')}</div>`;
        const steps = [];
        for (let i = 0; i < Math.max(s.a.ex.length, s.b.ex.length); i++) {
          if (s.a.ex[i]) steps.push({ show: 'a' + i, say: s.a.ex[i][0] });
          if (s.b.ex[i]) steps.push({ show: 'b' + i, say: s.b.ex[i][0] });
        }
        return { html: `<div class="sc-vs">${col(s.a, 'a')}<span class="vs-mark">ou</span>${col(s.b, 'b')}</div>`, steps };
      },
      tip: s => ({
        html: `<div class="sc-tip"><span class="tip-ico">${icon('bulb')}</span><div class="tip-txt">${s.tip}</div>${(s.ex || []).map((e, i) => `<div class="exl" data-step="${i}"><div class="tl">${words(e[0])}</div>${e[1] ? `<div class="fr">${esc(e[1])}</div>` : ''}</div>`).join('')}</div>`,
        steps: (s.ex || []).map((e, i) => ({ show: i, say: e[0] })),
      }),
      move: s => ({ html: `<div class="sc-move"><div class="tiles"></div>${s.note ? `<p class="fr">${esc(s.note)}</p>` : ''}</div>`, steps: [], run: runMove }),
      quiz: s => ({ html: `<div class="sc-quiz"><span class="eyebrow accent">À toi</span><div class="q">${esc(s.q).replace('___', '<span class="blank">___</span>')}</div>${s.hint ? `<p class="fr">${esc(s.hint)}</p>` : ''}<div class="opts">${s.opts.map(o => `<button class="btn quiet" data-q="${esc(o)}">${esc(o)}</button>`).join('')}</div><div class="quiz-res"></div></div>`, steps: [], run: runQuiz }),
    };

    // Réordonnancement animé des mots (ordre de la phrase, inversion…)
    async function runMove(s, t) {
      const box = stage.querySelector('.tiles');
      const toks = str => str.split(/\s+/).filter(Boolean).map(w => ({ raw: w.replace(/\*/g, ''), hl: /\*/.test(w), key: w.replace(/\*/g, '').toLowerCase().replace(/[.,!?¿¡;:]/g, '') }));
      const A = toks(s.from), B = toks(s.to);
      box.innerHTML = A.map(w => `<span class="tile" data-key="${esc(w.key)}">${esc(w.raw)}</span>`).join('');
      if (!await say(s.from, t)) return false;
      if (!await wait(500, t)) return false;
      const els = [...box.children], first = new Map(els.map(e => [e, e.getBoundingClientRect()]));
      const used = new Set(), order = [];
      B.forEach(w => {
        const e = els.find(x => !used.has(x) && x.dataset.key === w.key);
        if (e) { used.add(e); e.textContent = w.raw; e.classList.toggle('hl', w.hl); order.push(e); }
        else { const n = document.createElement('span'); n.className = 'tile new' + (w.hl ? ' hl' : ''); n.textContent = w.raw; order.push(n); }
      });
      els.filter(e => !used.has(e)).forEach(e => e.remove());
      order.forEach(e => box.appendChild(e));
      order.forEach(e => {
        const f = first.get(e); if (!f) return;
        const l = e.getBoundingClientRect();
        e.style.transform = `translate(${f.left - l.left}px, ${f.top - l.top}px)`;
        e.style.transition = 'none';
        requestAnimationFrame(() => requestAnimationFrame(() => { e.style.transition = ''; e.style.transform = ''; }));
      });
      Sfx.play('flip');
      if (!await wait(900, t)) return false;
      return say(s.to, t);
    }

    function runQuiz(s, t) {
      return new Promise(done => {
        const res = stage.querySelector('.quiz-res');
        stage.querySelectorAll('[data-q]').forEach(b => b.onclick = async () => {
          if (stage.querySelector('[data-q].good, [data-q].bad')) return;
          const ok = b.dataset.q === s.a;
          quizN++; if (ok) quizOk++;
          b.classList.add(ok ? 'good' : 'bad');
          if (!ok) stage.querySelectorAll('[data-q]').forEach(x => { if (x.dataset.q === s.a) x.classList.add('good'); });
          Sfx.play(ok ? 'ok' : 'bad');
          react(stage.querySelector('.sc-quiz'), ok);
          opt.onQuiz && opt.onQuiz(ok);
          const full = s.q.includes('___') ? s.q.replace('___', s.a) : s.a;
          res.innerHTML = `<span class="verdict ${ok ? 'good' : 'bad'}">${icon(ok ? 'check' : 'x')} ${ok ? 'Correct' : 'Réponse'}</span><div class="tl" style="margin-top:10px">${esc(full)}</div>${s.expl ? `<p class="fr">${esc(s.expl)}</p>` : ''}`;
          const spoken = s.say !== undefined ? s.say : full;
          if (spoken) await say(spoken, t);
          done(await wait(1400, t));
        });
      });
    }

    async function playScene(i) {
      clearTimeout(timer); Speech.stopSpeaking();
      const t = ++token;
      idx = Math.max(0, Math.min(scenes.length - 1, i));
      const s = scenes[idx], r = R[s.t] ? R[s.t](s) : R.tip({ tip: esc(s.fr || '') });
      stage.innerHTML = `<div class="scene scene-${s.t}">${r.html}</div>`;
      cap.innerHTML = s.fr ? esc(s.fr) : '';
      cap.classList.remove('in'); void cap.offsetWidth; cap.classList.add('in');
      paintSegs();
      if (idx > 0) Sfx.play('scene');
      const t0 = Date.now();
      if (!await wait(650, t)) return;
      for (const st of r.steps) {
        if (st.show !== undefined) { const el = stage.querySelector(`[data-step="${st.show}"]`); if (el) el.classList.add('on'); }
        if (!playing) { stage.querySelectorAll('[data-step]').forEach(e => e.classList.add('on')); return; }
        if (st.say && !await say(st.say, t)) return;
        if (!await wait(450, t)) return;
      }
      if (r.run && !await r.run(s, t)) return;
      // Laisse le temps de lire le sous-titre
      const left = capTime(s.fr) - (Date.now() - t0);
      if (left > 0 && !await wait(left, t)) return;
      if (!playing) return;
      if (idx < scenes.length - 1) playScene(idx + 1); else finish();
    }

    function finish() {
      token++; Speech.stopSpeaking();
      Sfx.play('done');
      idx = scenes.length; paintSegs();
      cap.textContent = '';
      stage.innerHTML = `<div class="scene sc-end"><span class="eyebrow">Leçon terminée</span><h2>${esc(lesson.title || '')}</h2>
        ${quizN ? `<p>Questions de la leçon : <b>${quizOk} / ${quizN}</b></p>` : ''}
        <div class="row" style="justify-content:center">${opt.endButtons || ''}<button class="btn ghost" data-l="restart">Revoir la leçon</button></div></div>`;
      playing = false; paintPlay();
      opt.onDone && opt.onDone({ ok: quizOk, n: quizN });
    }

    root.querySelector('.lesson').addEventListener('click', e => {
      const b = e.target.closest('[data-l], [data-seg]'); if (!b) return;
      const a = b.dataset.l;
      if (b.dataset.seg !== undefined) { playing = true; paintPlay(); return playScene(+b.dataset.seg); }
      if (a === 'play') {
        if (idx >= scenes.length) { quizOk = quizN = 0; playing = true; paintPlay(); return playScene(0); }
        playing = !playing; paintPlay();
        if (playing) playScene(idx); else { token++; clearTimeout(timer); Speech.stopSpeaking(); wave.classList.remove('on'); stage.querySelectorAll('[data-step]').forEach(x => x.classList.add('on')); }
      }
      if (a === 'prev') { playing = true; paintPlay(); playScene(idx - 1); }
      if (a === 'next') { playing = true; paintPlay(); idx >= scenes.length - 1 ? finish() : playScene(idx + 1); }
      if (a === 'again') { playing = true; paintPlay(); playScene(Math.min(idx, scenes.length - 1)); }
      if (a === 'restart') { quizOk = quizN = 0; playing = true; paintPlay(); playScene(0); }
    });
    paintPlay();
    playScene(0);
    return { stop() { token++; clearTimeout(timer); Speech.stopSpeaking(); } };
  }

  // Leçon de secours, construite à partir de la fiche, quand aucune leçon n'a été écrite pour ce point
  function autoLesson(topic) {
    const tmp = document.createElement('div'); tmp.innerHTML = topic.fiche || '';
    const paras = [...tmp.querySelectorAll('p')].map(p => p.innerHTML).filter(Boolean).slice(0, 3);
    const bank = (topic.bank || []).filter(b => b.q.includes('___') && !b.q.includes('\n') && !/→/.test(b.q));
    const filled = bank.slice(0, 4).map(b => [b.q.replace(/\s*\([^)]*\)/g, '').replace('___', '*' + b.a[0] + '*'), b.expl || '']);
    const scenes = [{ t: 'title', h: topic.label, sub: 'L’essentiel en deux minutes', fr: 'Écoute, regarde, puis réponds aux questions.' }];
    paras.forEach(p => scenes.push({ t: 'tip', tip: p, fr: 'La règle' }));
    if (filled.length) scenes.push({ t: 'ex', ex: filled, fr: 'Écoute ces phrases et répète-les à voix haute.' });
    bank.filter(b => b.opts).slice(0, 2).forEach(b => scenes.push({ t: 'quiz', q: b.q, opts: b.opts, a: b.a[0], expl: b.expl, fr: 'Choisis la bonne réponse.' }));
    return { title: topic.label, scenes, auto: true };
  }

  global.Sfx = Sfx;
  global.Media = { react, LessonPlayer, autoLesson };
})(window);
