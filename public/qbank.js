// qbank.js — UWorld-style exam-feel QBank: block list, timed/tutor session,
// question navigator, flagging, per-question explanations, results summary.

import { getSupabase } from './supabaseClient.js';

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

// ---------------------------------------------------------------------------
// Lab values reference panel — static normal-ranges table, independent of
// any one question. No schema/state needed, so it's plain module data.
// ---------------------------------------------------------------------------
const LAB_VALUES = [
  {
    section: 'Complete Blood Count (CBC)',
    rows: [
      ['Hemoglobin (Hgb)', 'Male: 13.5–17.5 g/dL · Female: 12.0–15.5 g/dL'],
      ['Hematocrit (Hct)', 'Male: 41–53% · Female: 36–46%'],
      ['WBC count', '4,500–11,000 /mm³'],
      ['Platelets', '150,000–400,000 /mm³'],
    ],
  },
  {
    section: 'Basic Metabolic Panel (BMP)',
    rows: [
      ['Sodium (Na+)', '135–145 mEq/L'],
      ['Potassium (K+)', '3.5–5.0 mEq/L'],
      ['Chloride (Cl−)', '95–105 mEq/L'],
      ['Bicarbonate (HCO3−)', '22–28 mEq/L'],
      ['BUN', '7–20 mg/dL'],
      ['Creatinine (Cr)', '0.6–1.2 mg/dL'],
      ['Glucose (fasting)', '70–100 mg/dL'],
    ],
  },
  {
    section: 'Liver Function Tests (LFTs)',
    rows: [
      ['AST', '8–20 U/L'],
      ['ALT', '8–20 U/L'],
      ['Alkaline phosphatase (ALP)', '20–70 U/L'],
      ['Total bilirubin', '0.1–1.0 mg/dL'],
      ['Albumin', '3.5–5.5 g/dL'],
      ['Total protein', '6.0–7.8 g/dL'],
    ],
  },
  {
    section: 'Arterial Blood Gas (ABG)',
    rows: [
      ['pH', '7.35–7.45'],
      ['PaCO2', '33–45 mmHg'],
      ['PaO2', '75–105 mmHg (on room air)'],
      ['HCO3−', '22–28 mEq/L'],
    ],
  },
  {
    section: 'Coagulation',
    rows: [
      ['PT', '11–15 sec'],
      ['PTT', '25–40 sec'],
      ['INR', '0.8–1.1'],
      ['Bleeding time', '2–7 min'],
    ],
  },
  {
    section: 'Other',
    rows: [
      ['Calcium (Ca2+)', '8.4–10.2 mg/dL'],
      ['Magnesium (Mg2+)', '1.5–2.0 mEq/L'],
      ['Phosphate', '3.0–4.5 mg/dL'],
      ['TSH', '0.4–4.0 μU/mL'],
      ['Uric acid', 'Male: 3.5–7.2 mg/dL · Female: 2.6–6.0 mg/dL'],
    ],
  },
];

function labValuesSectionHtml(section) {
  return `
    <div class="labvalues-section">
      <h4>${escapeHtml(section.section)}</h4>
      <table class="labvalues-table">
        ${section.rows
          .map(
            ([name, range]) => `
          <tr class="labvalues-row" data-search="${escapeHtml(`${name} ${range}`.toLowerCase())}">
            <td>${escapeHtml(name)}</td>
            <td>${escapeHtml(range)}</td>
          </tr>`
          )
          .join('')}
      </table>
    </div>
  `;
}

function openLabValuesPanel() {
  const overlay = document.createElement('div');
  overlay.className = 'labvalues-overlay';
  overlay.innerHTML = `
    <div class="labvalues-panel">
      <div class="labvalues-head">
        <h3>Normal Lab Values</h3>
        <button class="labvalues-close" aria-label="Close">&times;</button>
      </div>
      <input type="text" class="labvalues-filter" id="labvalues-filter" placeholder="Filter (e.g. potassium, Hgb)&hellip;">
      <div class="labvalues-body" id="labvalues-body">
        ${LAB_VALUES.map(labValuesSectionHtml).join('')}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  function close() {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) {
    if (e.key === 'Escape') close();
  }
  overlay.querySelector('.labvalues-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', onKey);

  const filterInput = overlay.querySelector('#labvalues-filter');
  filterInput.addEventListener('input', () => {
    const term = filterInput.value.trim().toLowerCase();
    overlay.querySelectorAll('.labvalues-row').forEach((row) => {
      row.style.display = row.dataset.search.includes(term) ? '' : 'none';
    });
    overlay.querySelectorAll('.labvalues-section').forEach((sec) => {
      const anyVisible = [...sec.querySelectorAll('.labvalues-row')].some((r) => r.style.display !== 'none');
      sec.style.display = anyVisible ? '' : 'none';
    });
  });
  filterInput.focus();
}

// ---------------------------------------------------------------------------
// Highlighting — select text in the question stem, click the popup to mark
// it. Session-only (in-memory, resets on reload): questionId -> [start, end]
// plain-text character ranges into that question's stem.
// ---------------------------------------------------------------------------
let activeHighlightPopup = null;

function hideHighlightPopup() {
  if (activeHighlightPopup) {
    activeHighlightPopup.remove();
    activeHighlightPopup = null;
  }
}

function showHighlightPopup(range, onApply) {
  hideHighlightPopup();
  const rect = range.getBoundingClientRect();
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'qb-highlight-popup';
  btn.textContent = 'Highlight';
  btn.style.position = 'fixed';
  btn.style.top = `${Math.max(8, rect.top - 36)}px`;
  btn.style.left = `${Math.max(8, rect.left)}px`;
  btn.addEventListener('mousedown', (e) => {
    // mousedown (not click) fires before the selection-clearing click below.
    e.preventDefault();
    e.stopPropagation();
    onApply();
  });
  document.body.appendChild(btn);
  activeHighlightPopup = btn;

  setTimeout(() => {
    document.addEventListener('click', function onDocClick(ev) {
      if (ev.target !== btn) {
        hideHighlightPopup();
        document.removeEventListener('click', onDocClick);
      }
    });
  }, 0);
}

function mergeRanges(ranges) {
  if (!ranges.length) return [];
  const sorted = ranges.map((r) => [...r]).sort((a, b) => a[0] - b[0]);
  const merged = [sorted[0]];
  for (let i = 1; i < sorted.length; i += 1) {
    const last = merged[merged.length - 1];
    const [s, e] = sorted[i];
    if (s <= last[1]) last[1] = Math.max(last[1], e);
    else merged.push([s, e]);
  }
  return merged;
}

// Builds the stem's inner HTML, wrapping highlighted ranges in <mark>. Each
// segment is escaped independently so this stays as safe as plain escapeHtml.
function renderStemHtml(text, ranges) {
  const merged = mergeRanges(ranges || []);
  if (!merged.length) return escapeHtml(text);
  let html = '';
  let cursor = 0;
  merged.forEach(([s, e]) => {
    html += escapeHtml(text.slice(cursor, s));
    html += `<mark class="qb-highlight" data-hl-start="${s}" data-hl-end="${e}" title="Click to remove highlight">${escapeHtml(text.slice(s, e))}</mark>`;
    cursor = e;
  });
  html += escapeHtml(text.slice(cursor));
  return html;
}

// Converts a DOM Range boundary (node + offset) into a plain-character offset
// relative to `container`'s full text content (walking only text nodes).
function textOffsetWithin(container, node, offset) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let total = 0;
  let current = walker.nextNode();
  while (current) {
    if (current === node) return total + offset;
    total += current.textContent.length;
    current = walker.nextNode();
  }
  return total;
}

export async function mountQBank(appEl, routeParts) {
  const supabase = await getSupabase();

  if (routeParts[0] === 'session' && routeParts[1]) {
    return renderSession(appEl, supabase, routeParts[1]);
  }
  return renderBlockList(appEl, supabase);
}

// ---------------------------------------------------------------------------
// Block list
// ---------------------------------------------------------------------------
async function renderBlockList(appEl, supabase) {
  appEl.innerHTML = `<div class="empty-state">Loading QBank&hellip;</div>`;

  const { data: blocks, error } = await supabase
    .from('qbank_blocks')
    .select('id, slug, title, description, question_count, time_limit_sec, mode_default, sort_order')
    .order('sort_order', { ascending: true });

  if (error) {
    appEl.innerHTML = `<div class="empty-state">Could not load QBank blocks. Check that schema_qbank.sql has been run.</div>`;
    console.error(error);
    return;
  }

  if (!blocks || blocks.length === 0) {
    appEl.innerHTML = `<div class="empty-state">No QBank blocks yet. Run <code>node supabase/seed.js</code> to add the sample block.</div>`;
    return;
  }

  appEl.innerHTML = `
    <h1 class="serif" style="font-size:26px;margin:0 0 4px;">Question Bank</h1>
    <p style="color:var(--ink-soft);font-size:13.5px;max-width:640px;margin-bottom:24px;">
      Timed, exam-style blocks with a question navigator, flagging, and full explanations after each answer — modeled on the UWorld interface.
    </p>
    <div class="block-list">
      ${blocks.map(blockCard).join('')}
    </div>
  `;

  blocks.forEach((block) => {
    const card = appEl.querySelector(`[data-block-id="${block.id}"]`);
    if (!card) return;
    const toggleBtns = card.querySelectorAll('.mode-toggle button');
    let selectedMode = block.mode_default;
    toggleBtns.forEach((b) => {
      b.addEventListener('click', () => {
        selectedMode = b.dataset.mode;
        toggleBtns.forEach((x) => x.classList.toggle('selected', x === b));
      });
    });
    card.querySelector('.start-btn').addEventListener('click', async () => {
      const attemptId = await startAttempt(supabase, block.id, selectedMode);
      if (attemptId) window.location.hash = `#/qbank/session/${attemptId}`;
    });
  });
}

function blockCard(block) {
  const minutes = Math.round(block.time_limit_sec / 60);
  return `
    <div class="block-card" data-block-id="${block.id}">
      <h3>${escapeHtml(block.title)}</h3>
      <p>${escapeHtml(block.description || '')}</p>
      <div class="block-meta">
        <span>${block.question_count} question${block.question_count === 1 ? '' : 's'}</span>
        <span>${minutes} min limit</span>
      </div>
      <div class="mode-toggle">
        <button data-mode="tutor" class="${block.mode_default === 'tutor' ? 'selected' : ''}">Tutor mode</button>
        <button data-mode="timed" class="${block.mode_default === 'timed' ? 'selected' : ''}">Timed mode</button>
      </div>
      <button class="start-btn">Start block</button>
    </div>
  `;
}

async function startAttempt(supabase, blockId, mode) {
  const { data, error } = await supabase
    .from('qbank_attempts')
    .insert({ block_id: blockId, mode, started_at: new Date().toISOString() })
    .select('id')
    .single();
  if (error) {
    console.error(error);
    alert('Could not start this block. Check your Supabase connection.');
    return null;
  }
  return data.id;
}

// ---------------------------------------------------------------------------
// Exam session
// ---------------------------------------------------------------------------
async function renderSession(appEl, supabase, attemptId) {
  appEl.innerHTML = `<div class="empty-state">Loading exam session&hellip;</div>`;

  const { data: attempt, error: attemptErr } = await supabase
    .from('qbank_attempts')
    .select('id, block_id, mode, started_at, submitted_at, time_used_sec, score_correct, score_total')
    .eq('id', attemptId)
    .single();

  if (attemptErr || !attempt) {
    appEl.innerHTML = `<div class="empty-state">Session not found.</div>`;
    console.error(attemptErr);
    return;
  }

  const { data: block } = await supabase
    .from('qbank_blocks')
    .select('id, title, time_limit_sec')
    .eq('id', attempt.block_id)
    .single();

  const { data: questions, error: qErr } = await supabase
    .from('qbank_questions')
    .select('id, position, stem, lead_in, exhibit_image_path, explanation, educational_objective, references, system_tag')
    .eq('block_id', attempt.block_id)
    .order('position', { ascending: true });

  if (qErr || !questions || questions.length === 0) {
    appEl.innerHTML = `<div class="empty-state">This block has no questions yet.</div>`;
    return;
  }

  const { data: choicesRaw } = await supabase
    .from('qbank_choices')
    .select('id, question_id, label, choice_text, is_correct, explanation, sort_order')
    .in('question_id', questions.map((q) => q.id))
    .order('sort_order', { ascending: true });

  const choicesByQuestion = {};
  (choicesRaw || []).forEach((c) => {
    (choicesByQuestion[c.question_id] ??= []).push(c);
  });

  const { data: existingAnswers } = await supabase
    .from('qbank_attempt_answers')
    .select('question_id, choice_id, flagged, answered_at')
    .eq('attempt_id', attemptId);

  const answerState = {}; // question_id -> { choiceId, flagged, answered }
  questions.forEach((q) => {
    const existing = (existingAnswers || []).find((a) => a.question_id === q.id);
    answerState[q.id] = {
      choiceId: existing?.choice_id || null,
      flagged: existing?.flagged || false,
      answered: !!existing?.answered_at,
    };
  });

  if (attempt.submitted_at) {
    return renderResults(appEl, { attempt, block, questions, choicesByQuestion, answerState });
  }

  // Session-only UI state (in-memory, lost on reload) for the two purely
  // visual UWorld-style tools: stem highlighting and choice strike-through.
  // Neither affects scoring or is persisted to Supabase.
  const highlightState = {}; // question_id -> [start, end][] (char ranges into q.stem)
  const strikeState = {}; // question_id -> Set<choice_id>

  let currentIndex = 0;
  const isTimed = attempt.mode === 'timed';
  const timeLimitSec = block?.time_limit_sec || 3600;
  const elapsedAtLoad = attempt.time_used_sec || 0;
  const startedAtMs = Date.now() - elapsedAtLoad * 1000;

  appEl.innerHTML = `
    <div class="exam-shell">
      <div class="exam-topbar">
        <span class="exam-title">${escapeHtml(block?.title || 'Question Block')} &middot; ${attempt.mode === 'timed' ? 'Timed' : 'Tutor'} mode</span>
        <span class="exam-timer" id="exam-timer">--:--</span>
      </div>
      <div class="exam-body">
        <div class="exam-main" id="exam-main"></div>
        <div class="exam-sidebar">
          <div class="qnav-grid" id="qnav-grid"></div>
          <div style="font-size:11px;color:var(--ink-soft);line-height:1.6;">
            <div>&#9679; Answered</div>
            <div>&#9675; Unanswered</div>
            <div>&#9899; Flagged</div>
          </div>
        </div>
      </div>
      <div class="exam-footer">
        <button class="exam-btn" id="btn-prev">&larr; Previous</button>
        <div style="display:flex;gap:10px;">
          <button class="exam-btn flag" id="btn-flag">Flag for review</button>
          <button class="exam-btn" id="btn-lab-values">Lab values</button>
          <button class="exam-btn primary" id="btn-submit-block">End block</button>
        </div>
        <button class="exam-btn primary" id="btn-next">Next &rarr;</button>
      </div>
    </div>
  `;

  const mainEl = appEl.querySelector('#exam-main');
  const qnavEl = appEl.querySelector('#qnav-grid');
  const timerEl = appEl.querySelector('#exam-timer');

  function renderQNav() {
    qnavEl.innerHTML = questions
      .map((q, i) => {
        const st = answerState[q.id];
        const classes = ['qnav-btn'];
        if (i === currentIndex) classes.push('current');
        if (st.answered) classes.push('answered');
        if (st.flagged) classes.push('flagged');
        return `<button class="${classes.join(' ')}" data-idx="${i}">${i + 1}</button>`;
      })
      .join('');
    qnavEl.querySelectorAll('.qnav-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentIndex = Number(btn.dataset.idx);
        renderQuestion();
      });
    });
  }

  function renderQuestion() {
    const q = questions[currentIndex];
    const choices = choicesByQuestion[q.id] || [];
    const st = answerState[q.id];
    const tutorReveal = attempt.mode === 'tutor' && st.answered;

    mainEl.innerHTML = `
      <div class="exam-stem">
        <span class="stem-text" id="stem-text">${renderStemHtml(q.stem, highlightState[q.id])}</span>
        ${q.exhibit_image_path ? `<img class="exam-exhibit" src="${escapeHtml(supabase.storage.from('illustrations').getPublicUrl(q.exhibit_image_path).data.publicUrl)}" alt="Exhibit">` : ''}
        ${q.lead_in ? `<div class="exam-lead-in">${escapeHtml(q.lead_in)}</div>` : ''}
      </div>
      <div class="choice-list">
        ${choices
          .map((c) => {
            const classes = ['choice-row'];
            const isSelected = st.choiceId === c.id;
            const revealed = tutorReveal || !!attempt.submitted_at;
            const isStruck = strikeState[q.id]?.has(c.id);
            if (isSelected) classes.push('selected');
            if (isStruck) classes.push('struck');
            if (revealed) {
              if (c.is_correct) classes.push('correct');
              else if (isSelected) classes.push('incorrect');
            }
            return `
            <div class="${classes.join(' ')}" data-choice-id="${c.id}">
              <span class="choice-label">${escapeHtml(c.label)}</span>
              <span class="choice-text">${escapeHtml(c.choice_text)}</span>
              <button type="button" class="choice-strike-btn${isStruck ? ' active' : ''}" data-strike-choice="${c.id}" title="Eliminate this choice">Strike</button>
            </div>
            ${
              revealed && c.explanation
                ? `<div class="choice-why ${c.is_correct ? 'why-correct' : 'why-wrong'}">
                     <strong>${c.is_correct ? 'Why this is correct:' : `Why ${escapeHtml(c.label)} is wrong:`}</strong>
                     ${escapeHtml(c.explanation)}
                   </div>`
                : ''
            }
          `;
          })
          .join('')}
      </div>
      ${
        tutorReveal
          ? `
        <div class="explanation-panel">
          ${q.educational_objective ? `<div class="edu-objective">${escapeHtml(q.educational_objective)}</div>` : ''}
          <h4>Explanation</h4>
          <div class="explanation-text">${escapeHtml(q.explanation)}</div>
          ${q.references ? `<div class="references-text">${escapeHtml(q.references)}</div>` : ''}
          <button class="exam-btn" id="btn-make-flashcard" style="margin-top:12px;">+ Create flashcard from this question</button>
        </div>
      `
          : ''
      }
    `;

    if (tutorReveal) {
      const flashBtn = mainEl.querySelector('#btn-make-flashcard');
      if (flashBtn) {
        flashBtn.addEventListener('click', async () => {
          const correctChoice = choices.find((c) => c.is_correct);
          const front = q.lead_in ? `${q.stem}\n\n${q.lead_in}` : q.stem;
          const back = [
            correctChoice ? `Correct answer: ${correctChoice.label}. ${correctChoice.choice_text}` : null,
            q.explanation,
            q.educational_objective ? `Educational objective: ${q.educational_objective}` : null,
          ]
            .filter(Boolean)
            .join('\n\n');
          const { createFlashcardFromQuestion } = await import('./flashcards.js');
          await createFlashcardFromQuestion(supabase, { front, back, systemTag: q.system_tag, questionId: q.id });
          flashBtn.textContent = 'Added to flashcards ✓';
          flashBtn.disabled = true;
        });
      }
    }

    mainEl.querySelectorAll('.choice-row').forEach((row) => {
      row.addEventListener('click', async () => {
        if (attempt.mode === 'tutor' && st.answered) return; // locked after reveal in tutor mode
        const choiceId = row.dataset.choiceId;
        st.choiceId = choiceId;
        st.answered = true;
        await saveAnswer(supabase, attemptId, q.id, { choiceId, flagged: st.flagged, answered: true });
        renderQuestion();
        renderQNav();
      });
    });

    // Strike-through: purely visual "eliminate this choice" toggle, independent
    // of actually selecting the choice as the answer — doesn't touch scoring.
    mainEl.querySelectorAll('.choice-strike-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // don't let the click bubble up into choice-row selection
        const choiceId = btn.dataset.strikeChoice;
        const struck = (strikeState[q.id] ??= new Set());
        if (struck.has(choiceId)) struck.delete(choiceId);
        else struck.add(choiceId);
        renderQuestion();
      });
    });

    // Highlighting: select text in the stem, click the popup to mark it;
    // click an existing <mark> to remove it. Session-only (see highlightState).
    const stemTextEl = mainEl.querySelector('#stem-text');
    if (stemTextEl) {
      stemTextEl.addEventListener('mouseup', () => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
        const range = sel.getRangeAt(0);
        if (!stemTextEl.contains(range.commonAncestorContainer)) return;
        const start = textOffsetWithin(stemTextEl, range.startContainer, range.startOffset);
        const end = textOffsetWithin(stemTextEl, range.endContainer, range.endOffset);
        if (end <= start) return;
        showHighlightPopup(range, () => {
          (highlightState[q.id] ??= []).push([start, end]);
          sel.removeAllRanges();
          renderQuestion();
        });
      });
      stemTextEl.addEventListener('click', (e) => {
        const mark = e.target.closest('mark.qb-highlight');
        if (!mark) return;
        const s = Number(mark.dataset.hlStart);
        const en = Number(mark.dataset.hlEnd);
        highlightState[q.id] = (highlightState[q.id] || []).filter(([rs, re]) => rs !== s || re !== en);
        renderQuestion();
      });
    }

    appEl.querySelector('#btn-flag').classList.toggle('active', st.flagged);
    appEl.querySelector('#btn-prev').disabled = currentIndex === 0;
    appEl.querySelector('#btn-next').textContent = currentIndex === questions.length - 1 ? 'Finish review' : 'Next →';
  }

  appEl.querySelector('#btn-prev').addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      renderQuestion();
      renderQNav();
    }
  });
  appEl.querySelector('#btn-next').addEventListener('click', () => {
    if (currentIndex < questions.length - 1) {
      currentIndex += 1;
      renderQuestion();
      renderQNav();
    }
  });
  appEl.querySelector('#btn-flag').addEventListener('click', async () => {
    const q = questions[currentIndex];
    const st = answerState[q.id];
    st.flagged = !st.flagged;
    await saveAnswer(supabase, attemptId, q.id, { choiceId: st.choiceId, flagged: st.flagged, answered: st.answered });
    renderQuestion();
    renderQNav();
  });
  appEl.querySelector('#btn-submit-block').addEventListener('click', () => {
    if (confirm('End this block and see your results? You will not be able to change answers after this.')) {
      finishAttempt();
    }
  });
  appEl.querySelector('#btn-lab-values').addEventListener('click', () => openLabValuesPanel());

  // Timer
  let timerInterval;
  function tick() {
    const elapsed = (Date.now() - startedAtMs) / 1000;
    if (isTimed) {
      const remaining = timeLimitSec - elapsed;
      timerEl.textContent = formatTime(remaining);
      timerEl.classList.toggle('low', remaining < 300);
      if (remaining <= 0) {
        clearInterval(timerInterval);
        finishAttempt();
      }
    } else {
      timerEl.textContent = formatTime(elapsed);
    }
  }
  tick();
  timerInterval = setInterval(tick, 1000);

  async function finishAttempt() {
    clearInterval(timerInterval);
    const timeUsed = Math.round((Date.now() - startedAtMs) / 1000);
    let correct = 0;
    questions.forEach((q) => {
      const st = answerState[q.id];
      const choice = (choicesByQuestion[q.id] || []).find((c) => c.id === st.choiceId);
      if (choice?.is_correct) correct += 1;
    });
    await supabase
      .from('qbank_attempts')
      .update({
        submitted_at: new Date().toISOString(),
        time_used_sec: timeUsed,
        score_correct: correct,
        score_total: questions.length,
      })
      .eq('id', attemptId);

    window.location.hash = `#/qbank/session/${attemptId}`;
    window.location.reload();
  }

  renderQNav();
  renderQuestion();
}

async function saveAnswer(supabase, attemptId, questionId, { choiceId, flagged, answered }) {
  await supabase.from('qbank_attempt_answers').upsert(
    {
      attempt_id: attemptId,
      question_id: questionId,
      choice_id: choiceId,
      flagged,
      answered_at: answered ? new Date().toISOString() : null,
    },
    { onConflict: 'attempt_id,question_id' }
  );
}

// ---------------------------------------------------------------------------
// Results screen
// ---------------------------------------------------------------------------
function renderResults(appEl, { attempt, block, questions, choicesByQuestion, answerState }) {
  const total = attempt.score_total ?? questions.length;
  const correct = attempt.score_correct ?? 0;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  const bySystem = {};
  questions.forEach((q) => {
    const st = answerState[q.id];
    const choice = (choicesByQuestion[q.id] || []).find((c) => c.id === st.choiceId);
    const tag = q.system_tag || 'General';
    bySystem[tag] ??= { correct: 0, total: 0 };
    bySystem[tag].total += 1;
    if (choice?.is_correct) bySystem[tag].correct += 1;
  });

  appEl.innerHTML = `
    <a class="back-link" href="#/qbank">&larr; QBank</a>
    <div class="results-panel">
      <div style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-soft);">${escapeHtml(block?.title || '')} &middot; Results</div>
      <div class="results-score">${correct} / ${total}</div>
      <div style="color:var(--ink-soft);font-size:14px;">${pct}% correct &middot; time used ${formatTime(attempt.time_used_sec || 0)}</div>
      <div class="results-breakdown">
        ${Object.entries(bySystem)
          .map(
            ([tag, s]) => `
          <div class="results-row">
            <span>${escapeHtml(tag)}</span>
            <span>${s.correct} / ${s.total}</span>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}
