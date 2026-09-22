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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('qbank_attempts')
    .insert({ block_id: blockId, mode, started_at: new Date().toISOString(), user_id: user?.id ?? null })
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
        ${escapeHtml(q.stem)}
        ${q.exhibit_image_path ? `<img class="exam-exhibit" src="${escapeHtml(supabase.storage.from('illustrations').getPublicUrl(q.exhibit_image_path).data.publicUrl)}" alt="Exhibit">` : ''}
        ${q.lead_in ? `<div class="exam-lead-in">${escapeHtml(q.lead_in)}</div>` : ''}
      </div>
      <div class="choice-list">
        ${choices
          .map((c) => {
            const classes = ['choice-row'];
            const isSelected = st.choiceId === c.id;
            const revealed = tutorReveal || !!attempt.submitted_at;
            if (isSelected) classes.push('selected');
            if (revealed) {
              if (c.is_correct) classes.push('correct');
              else if (isSelected) classes.push('incorrect');
            }
            return `
            <div class="${classes.join(' ')}" data-choice-id="${c.id}">
              <span class="choice-label">${escapeHtml(c.label)}</span>
              <span>${escapeHtml(c.choice_text)}</span>
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
