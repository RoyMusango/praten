// Appels IA : Gemini (gratuit via Google AI Studio) ou API compatible OpenAI (Groq, OpenRouter…).
// Les consignes sont communes aux apps de langues ; LANG.ai apporte la langue cible et ses règles propres.
(function (global) {
  const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta';
  // Modèles essayés si le modèle choisi est épuisé (429) ou introuvable (404)
  const GEMINI_FALLBACKS = ['gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];
  const A = LANG.ai;

  // Profil de l'apprenant, partagé par toutes les apps
  const PROFILE = `Learner profile: French-speaking Belgian engineering student specialising in artificial intelligence and decision support. He is going on an Erasmus exchange in Spain (Barcelona) where he will write his master's thesis (TFE) on the banking sector, with supervisors who speak Spanish and English. He did a research internship on designing a sovereign RAG system (retrieval-augmented generation with data and infrastructure under the bank's own control) applied to banking, and his supervisor will ask him about it. He wants a career in banking or finance. He is a huge FC Barcelona fan.`;

  const TYPO = '\n\nTypography: never use em dashes or en dashes as punctuation; use commas, colons or parentheses instead.';

  function hasKey() {
    const s = Store.settings;
    return s.provider === 'gemini' ? !!s.geminiKey : !!(s.oaKey && s.oaBase);
  }

  function countRequest() { Store.day().requests++; Store.save(); }

  class AIError extends Error { constructor(msg, status) { super(msg); this.status = status; } }

  async function gemini(model, body) {
    const res = await fetch(`${GEMINI_URL}/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': Store.settings.geminiKey },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new AIError((data.error && data.error.message) || res.statusText, res.status);
    const parts = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
    if (!parts) throw new AIError('Réponse vide (contenu bloqué ?)', 500);
    return parts.filter(p => !p.thought).map(p => p.text || '').join('');
  }

  async function callGemini(system, messages, schema) {
    const contents = messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
    const gen = { temperature: 0.8, thinkingConfig: { thinkingBudget: 0 } };
    if (schema) { gen.responseMimeType = 'application/json'; gen.responseSchema = schema; }
    const body = { systemInstruction: { parts: [{ text: system }] }, contents, generationConfig: gen };

    const chosen = Store.settings.geminiModel || GEMINI_FALLBACKS[0];
    const models = [chosen, ...GEMINI_FALLBACKS.filter(m => m !== chosen)];
    let lastErr;
    for (const model of models) {
      try {
        countRequest();
        try { return await gemini(model, body); }
        catch (e) {
          // Certains modèles refusent de désactiver la réflexion (parfois avec un simple « invalid argument ») : on réessaie sans.
          if (e.status === 400 && !/API key/i.test(e.message)) {
            const b2 = structuredClone(body); delete b2.generationConfig.thinkingConfig;
            countRequest();
            return await gemini(model, b2);
          }
          throw e;
        }
      } catch (e) {
        lastErr = e;
        if (e.status === 429 || e.status === 404 || e.status === 503) { console.warn(`Modèle ${model} indisponible (${e.status}), essai suivant`); continue; }
        throw e;
      }
    }
    throw lastErr;
  }

  async function callOpenAI(system, messages, schema) {
    const s = Store.settings;
    countRequest();
    const sys = schema ? system + '\n\nRespond ONLY with a JSON object with this structure: ' + JSON.stringify(schemaToExample(schema)) : system;
    const res = await fetch(s.oaBase.replace(/\/$/, '') + '/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s.oaKey },
      body: JSON.stringify({
        model: s.oaModel, temperature: 0.8,
        messages: [{ role: 'system', content: sys }, ...messages],
        ...(schema ? { response_format: { type: 'json_object' } } : {}),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new AIError((data.error && (data.error.message || data.error)) || res.statusText, res.status);
    return data.choices[0].message.content;
  }

  function schemaToExample(s) {
    if (s.type === 'OBJECT') return Object.fromEntries(Object.entries(s.properties).map(([k, v]) => [k, schemaToExample(v)]));
    if (s.type === 'ARRAY') return [schemaToExample(s.items)];
    if (s.type === 'BOOLEAN') return true;
    return s.enum ? s.enum.join('|') : (s.description || 'string');
  }

  // Retire les tirets longs si le modèle en produit quand même
  function clean(x) {
    if (typeof x === 'string') return x.replace(/\s*[—–]\s*/g, ', ').replace(/,\s*,/g, ',').replace(/^,\s*/gm, '');
    if (Array.isArray(x)) return x.map(clean);
    if (x && typeof x === 'object') return Object.fromEntries(Object.entries(x).map(([k, v]) => [k, clean(v)]));
    return x;
  }

  async function chat(system, messages, schema) {
    if (!hasKey()) throw new AIError('Aucune clé API : va dans Réglages.', 401);
    const fn = Store.settings.provider === 'gemini' ? callGemini : callOpenAI;
    const text = await fn(system + TYPO, messages, schema);
    return clean(schema ? parseJSON(text) : text);
  }

  function parseJSON(text) {
    try { return JSON.parse(text); } catch (e) { }
    const m = text.match(/\{[\s\S]*\}/);
    if (m) { try { return JSON.parse(m[0]); } catch (e) { } }
    throw new AIError('Réponse IA illisible : ' + text.slice(0, 200), 500);
  }

  async function listGeminiModels() {
    const res = await fetch(`${GEMINI_URL}/models?pageSize=200`, { headers: { 'x-goog-api-key': Store.settings.geminiKey } });
    const data = await res.json();
    if (!res.ok) throw new AIError((data.error && data.error.message) || res.statusText, res.status);
    return (data.models || [])
      .filter(m => (m.supportedGenerationMethods || []).includes('generateContent') && /gemini/.test(m.name) && !/image|tts|embedding|audio|live/i.test(m.name))
      .map(m => ({ id: m.name.replace('models/', ''), label: m.displayName }));
  }

  // ---------- Conversation ----------
  const TOPIC_IDS = () => [...GRAMMAR.ORDER, ...Object.keys(GRAMMAR.EXTRA_TOPICS)];

  const CONV_SCHEMA = () => ({
    type: 'OBJECT',
    properties: {
      reply: { type: 'STRING', description: `your answer in ${A.target}` },
      translation_fr: { type: 'STRING', description: 'French translation of reply' },
      corrections: {
        type: 'ARRAY', items: {
          type: 'OBJECT', properties: {
            original: { type: 'STRING', description: 'the learner’s wrong or unnatural fragment' },
            corrected: { type: 'STRING', description: 'correct, natural version' },
            explication: { type: 'STRING', description: 'short explanation in French' },
            topic: { type: 'STRING', enum: TOPIC_IDS() },
          }, required: ['original', 'corrected', 'explication', 'topic'],
        },
      },
      vocab: {
        type: 'ARRAY', items: {
          type: 'OBJECT', properties: {
            word: { type: 'STRING', description: `word or expression in ${A.target}` }, fr: { type: 'STRING' },
            syn: { type: 'ARRAY', items: { type: 'STRING' } },
          }, required: ['word', 'fr'],
        },
      },
      suggestion: { type: 'STRING', description: `a possible answer the learner could give next, in ${A.target}, at his level` },
    },
    required: ['reply', 'translation_fr', 'corrections', 'vocab', 'suggestion'],
  });

  function conversationSystem(scn, weakTopics, reviewWords) {
    const lv = Store.settings.level;
    const targets = (scn.targets || []).map(t => GRAMMAR.TOPICS[t] && `${GRAMMAR.TOPICS[t].label} (${t})`).filter(Boolean);
    const weak = weakTopics.map(t => GRAMMAR.TOPICS[t] ? GRAMMAR.TOPICS[t].label : t);
    return `You are a conversation partner and language tutor. The conversation happens in ${A.target}. The learner's level: ${lv}.
${PROFILE}

ROLE-PLAY SCENARIO: ${scn.role}
Your name is ${scn.who}. The learner's goal: ${scn.goal}

CONVERSATION RULES:
- Reply ONLY in ${A.target}. ${A.levelRules(lv)}
- The learner must speak MORE than you. End almost every turn with ONE open question that makes him talk.
- Naturally steer him to use: ${targets.length ? targets.join(', ') : 'varied topics'}. His current weak points: ${weak.join(', ') || 'unknown'}.
- Words he is learning or tends to forget: ${reviewWords.length ? reviewWords.join(', ') : '(none)'}. Reuse 1 or 2 per turn when they fit, so he hears them in context.
- If he writes in French or mixes in French because a word is missing, give the ${A.target} word in "vocab" (with 1 to 3 synonyms in "syn"), rephrase his sentence correctly in your reply and continue.
- If he asks how to say something or what a word means, answer briefly and return to the role-play.
- If the context is formal (supervisor, jury, bank, company) and his register is too casual, add a more formal alternative in "corrections" with topic "registro".
- Stay in character. Never present current facts you are unsure about (results, transfers, news, figures) as true: ask him or speak in general terms.
${A.extraRules || ''}

CORRECTIONS ("corrections"):
- Analyse ONLY the learner's last message. Report every real error: ${A.errorTypes}.
- IGNORE accents, capital letters and punctuation (the text comes from speech recognition). Do not correct what is fine. If there are no errors, return an empty list.
- "explication" in French, very short (max 20 words). "topic" = the closest topic id.

"vocab": 0 to 3 useful new words from your reply or that he needed (word, fr, syn).
"suggestion": a short possible answer at his level, in case he gets stuck.
"translation_fr": French translation of your "reply".`;
  }

  async function converse(scn, history, weakTopics, reviewWords = []) {
    return chat(conversationSystem(scn, weakTopics, reviewWords), history, CONV_SCHEMA());
  }

  // ---------- Lecture guidée ----------
  const READ_SCHEMA = () => ({
    type: 'OBJECT', properties: {
      title: { type: 'STRING' },
      text: { type: 'STRING', description: `text in ${A.target}; paragraphs separated by a blank line` },
      ...(A.readingTranslation ? { translation_fr: { type: 'STRING', description: 'full French translation' } } : {}),
      glossary: { type: 'ARRAY', items: { type: 'OBJECT', properties: { word: { type: 'STRING', description: 'exact form as it appears in the text' }, fr: { type: 'STRING' } }, required: ['word', 'fr'] } },
      questions: { type: 'ARRAY', items: { type: 'STRING' } },
    }, required: ['title', 'text', 'glossary', 'questions', ...(A.readingTranslation ? ['translation_fr'] : [])],
  });

  async function reading(topic, length, reviewWords) {
    const lv = Store.settings.level;
    const sys = `You are a teacher of ${A.target}. Write an original text for a learner at level ${lv}, ${A.readingLevel}.
${PROFILE}
Topic: ${topic}. Length: about ${length} words, in 2 to 4 paragraphs. Useful, real vocabulary of the field. Do not invent current facts presented as true (results, news, real figures): it can be an explanatory text, an email, a dialogue or a story.
If they fit, use some of these words the learner is reviewing: ${reviewWords.join(', ') || '(none)'}.
"glossary": 8 to 12 key words or expressions from the text (exact form as it appears) with their French translation.
"questions": 3 open comprehension questions in ${A.target}, and a fourth personal question about his own experience.`;
    return chat(sys, [{ role: 'user', content: 'Write the text.' }], READ_SCHEMA());
  }

  const FEEDBACK_SCHEMA = () => ({
    type: 'OBJECT', properties: {
      items: {
        type: 'ARRAY', items: {
          type: 'OBJECT', properties: {
            ok: { type: 'BOOLEAN', description: 'answer is understandable and correct in content' },
            comment: { type: 'STRING', description: 'short comment in French' },
            better: { type: 'STRING', description: `corrected, natural version of the answer, in ${A.target}` },
            topic: { type: 'STRING', enum: TOPIC_IDS() },
          }, required: ['ok', 'comment', 'better', 'topic'],
        },
      },
    }, required: ['items'],
  });

  async function readingFeedback(text, questions, answers) {
    const sys = `You are a teacher of ${A.target}. Assess a French-speaking learner's answers (level ${Store.settings.level}) to questions about a text. For each answer: "ok" (correct content), "comment" in French (max 25 words, point out the main language error if any), "better" (his answer corrected and natural), "topic" (grammar topic id of the main error, or "vocabulario"). Ignore accents and punctuation (may come from speech recognition).`;
    const content = 'TEXT:\n' + text + '\n\n' + questions.map((q, i) => `QUESTION ${i + 1}: ${q}\nANSWER: ${answers[i] || '(no answer)'}`).join('\n\n');
    return chat(sys, [{ role: 'user', content }], FEEDBACK_SCHEMA());
  }

  // ---------- Bouée ----------
  const LOOKUP_SCHEMA = {
    type: 'OBJECT', properties: {
      results: { type: 'ARRAY', items: { type: 'OBJECT', properties: { word: { type: 'STRING' }, fr: { type: 'STRING' }, note: { type: 'STRING' } }, required: ['word', 'fr'] } },
      synonyms: { type: 'ARRAY', items: { type: 'STRING' } },
      example: { type: 'STRING' },
      circumlocution: { type: 'STRING', description: 'how to describe the thing without knowing the word' },
    }, required: ['results', 'synonyms', 'example', 'circumlocution'],
  };

  async function lookup(query) {
    const sys = `You are a French / ${A.target} bilingual dictionary for a learner at level ${Store.settings.level} who studies AI, decision support and finance. The user gives a word or expression (French or ${A.target}). Return: "results" (1 to 3 common ${A.target} translations${A.lookupArticle ? ', ' + A.lookupArticle : ''}; "fr" = meaning in French; "note" = short register or nuance in French, e.g. courant, soutenu, technique, familier), "synonyms" (2 to 5 ${A.target} synonyms or close words, from the most common to the most formal), "example" (one simple example sentence in ${A.target}), "circumlocution" (a simple way to describe the thing in ${A.target} if the word is forgotten).`;
    return chat(sys, [{ role: 'user', content: query }], LOOKUP_SCHEMA);
  }

  async function sessionReview(transcript, corrections) {
    const sys = `You are a teacher of ${A.target}. Write IN FRENCH a short review (max 120 words) of a learner's conversation (level ${Store.settings.level}): 2 strengths, 3 concrete priorities (each with a corrected example), and 3 useful sentences in ${A.target} to reuse next time. Format: plain text, one idea per line, no markdown.`;
    const content = 'Transcript:\n' + transcript + '\n\nCorrections:\n' + corrections.map(c => `${c.original} → ${c.corrected} (${c.explication})`).join('\n');
    return chat(sys, [{ role: 'user', content }]);
  }

  global.AI = { hasKey, chat, converse, reading, readingFeedback, lookup, sessionReview, listGeminiModels, AIError };
})(window);
