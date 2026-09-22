// flashcards.js — Anki-style flashcard deck: manual creation, a simplified
// SM-2 spaced-repetition study mode, and a short untimed quiz mode.
//
// Anonymous by default: a browser-persisted owner id (localStorage) scopes a
// deck, the same "id is the access token" model qbank.js uses for attempts,
// just persisted across sessions instead of carried in a URL hash.

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

const OWNER_KEY = 'usmle_flashcard_owner_id';

// Returns the signed-in user's auth.uid() when there's a session, otherwise
// falls back to the existing anonymous localStorage uuid — same RLS-visible
// owner_id either way (`owner_id = auth.uid()` once signed in, or the
// anonymous "auth.uid() is null" branch), so nothing about the anonymous
// flow changes for anyone who never signs in.
async function getOwnerId(supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) return user.id;

  let id = localStorage.getItem(OWNER_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(OWNER_KEY, id);
  }
  return id;
}

// ---------------------------------------------------------------------------
// Simplified SM-2 scheduler. Real Anki uses sub-day "learning steps" for
// "Again" and a more elaborate fuzz/leech model — this is the well-known
// SM-2 core (ease factor + interval growth) at day granularity, which is
// enough to actually space out review without the full Anki scheduler.
// ---------------------------------------------------------------------------
function nextSchedule({ ease_factor, interval_days, repetitions }, rating) {
  let ef = ease_factor;
  let reps = repetitions;
  let interval;

  if (rating === 'again') {
    reps = 0;
    interval = 0; // due again today
    ef = Math.max(1.3, ef - 0.2);
  } else {
    const delta = { hard: -0.15, good: 0, easy: 0.15 }[rating];
    ef = Math.max(1.3, ef + delta);
    reps += 1;
    if (reps === 1) interval = rating === 'easy' ? 4 : 1;
    else if (reps === 2) interval = rating === 'easy' ? 8 : rating === 'hard' ? 2 : 6;
    else {
      const mult = rating === 'easy' ? 1.3 : rating === 'hard' ? 0.8 : 1;
      interval = Math.max(1, Math.round(interval_days * ef * mult));
    }
  }

  const due_at = new Date(Date.now() + interval * 86400000).toISOString();
  return { ease_factor: Number(ef.toFixed(2)), interval_days: interval, repetitions: reps, due_at };
}

// ---------------------------------------------------------------------------
// Called from qbank.js: "Create flashcard from this question".
// ---------------------------------------------------------------------------
export async function createFlashcardFromQuestion(supabase, { front, back, systemTag, questionId }) {
  const { error } = await supabase.from('flashcards').insert({
    owner_id: await getOwnerId(supabase),
    front,
    back,
    system_tag: systemTag || null,
    source_question_id: questionId || null,
  });
  if (error) console.error(error);
}

// ---------------------------------------------------------------------------
// Router entry
// ---------------------------------------------------------------------------
export async function mountFlashcards(appEl, supabase, routeParts) {
  if (routeParts[0] === 'study') return renderStudySession(appEl, supabase);
  if (routeParts[0] === 'quiz') return renderShortQuiz(appEl, supabase);
  return renderDeckHome(appEl, supabase);
}

// ---------------------------------------------------------------------------
// Deck home: stats, actions, manual creation form, card list.
// ---------------------------------------------------------------------------
async function renderDeckHome(appEl, supabase) {
  appEl.innerHTML = `<div class="empty-state">Loading flashcards&hellip;</div>`;
  const ownerId = await getOwnerId(supabase);

  const { data: cards, error } = await supabase
    .from('flashcards')
    .select('id, front, back, system_tag, due_at, repetitions, created_at')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error) {
    appEl.innerHTML = `<div class="empty-state">Could not load flashcards. Check that schema_flashcards.sql has been run.</div>`;
    console.error(error);
    return;
  }

  const now = Date.now();
  const dueCount = (cards || []).filter((c) => new Date(c.due_at).getTime() <= now).length;

  appEl.innerHTML = `
    <h1 class="serif" style="font-size:26px;margin:0 0 4px;">Flashcards</h1>
    <p style="color:var(--ink-soft);font-size:13.5px;max-width:640px;margin-bottom:20px;">
      Create cards from missed questions or write your own. Study mode uses spaced repetition (SM-2);
      short quiz mode is a fast, unscheduled recall check.
    </p>
    <div class="block-list" style="margin-bottom:24px;">
      <div class="block-card">
        <h3>${cards.length} card${cards.length === 1 ? '' : 's'}</h3>
        <p>${dueCount} due for review right now.</p>
        <button class="start-btn" id="btn-study" ${dueCount === 0 ? 'disabled' : ''}>Study due cards</button>
      </div>
      <div class="block-card">
        <h3>Short quiz</h3>
        <p>5 random cards, quick self-graded recall check. Doesn't affect the review schedule.</p>
        <button class="start-btn" id="btn-quiz" ${cards.length === 0 ? 'disabled' : ''}>Start short quiz</button>
      </div>
    </div>

    <div class="section-label">Create a flashcard</div>
    <form id="create-form" style="max-width:520px;margin-bottom:28px;display:flex;flex-direction:column;gap:8px;">
      <textarea id="new-front" placeholder="Front (question / prompt)" rows="2" required
        style="font:inherit;padding:10px;border:1px solid var(--ink-soft);border-radius:6px;"></textarea>
      <textarea id="new-back" placeholder="Back (answer)" rows="3" required
        style="font:inherit;padding:10px;border:1px solid var(--ink-soft);border-radius:6px;"></textarea>
      <input id="new-tag" placeholder="System tag (optional, e.g. Cardiovascular)"
        style="font:inherit;padding:10px;border:1px solid var(--ink-soft);border-radius:6px;">
      <button class="start-btn" type="submit" style="width:fit-content;">Add card</button>
    </form>

    <div class="section-label">All cards</div>
    <div id="card-list">
      ${cards.length === 0 ? '<div class="empty-state">No flashcards yet — create one above, or add one from a QBank explanation.</div>' : cards.map(cardRow).join('')}
    </div>
  `;

  appEl.querySelector('#btn-study').addEventListener('click', () => {
    window.location.hash = '#/flashcards/study';
  });
  appEl.querySelector('#btn-quiz').addEventListener('click', () => {
    window.location.hash = '#/flashcards/quiz';
  });

  appEl.querySelector('#create-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const front = appEl.querySelector('#new-front').value.trim();
    const back = appEl.querySelector('#new-back').value.trim();
    const tag = appEl.querySelector('#new-tag').value.trim();
    if (!front || !back) return;
    const { error: insErr } = await supabase.from('flashcards').insert({
      owner_id: ownerId,
      front,
      back,
      system_tag: tag || null,
    });
    if (insErr) {
      console.error(insErr);
      alert('Could not save this card.');
      return;
    }
    renderDeckHome(appEl, supabase);
  });

  appEl.querySelectorAll('[data-delete-card]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!confirm('Delete this flashcard?')) return;
      await supabase.from('flashcards').delete().eq('id', btn.dataset.deleteCard);
      renderDeckHome(appEl, supabase);
    });
  });
}

function cardRow(card) {
  const due = new Date(card.due_at);
  const isDue = due.getTime() <= Date.now();
  return `
    <div class="block-card" style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;gap:12px;">
        <div>
          <div style="font-size:13.5px;font-weight:600;">${escapeHtml(card.front.slice(0, 140))}</div>
          <div style="font-size:12px;color:var(--ink-soft);margin-top:4px;">
            ${card.system_tag ? escapeHtml(card.system_tag) + ' &middot; ' : ''}
            ${isDue ? 'Due now' : `Due ${due.toLocaleDateString()}`}
            &middot; reviewed ${card.repetitions}&times;
          </div>
        </div>
        <button data-delete-card="${card.id}" class="viewer-close" aria-label="Delete" style="flex:none;">&times;</button>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Study session: due cards, SM-2 scheduling.
// ---------------------------------------------------------------------------
async function renderStudySession(appEl, supabase) {
  appEl.innerHTML = `<div class="empty-state">Loading study session&hellip;</div>`;
  const ownerId = await getOwnerId(supabase);

  const { data: due, error } = await supabase
    .from('flashcards')
    .select('id, front, back, ease_factor, interval_days, repetitions')
    .eq('owner_id', ownerId)
    .lte('due_at', new Date().toISOString())
    .order('due_at', { ascending: true });

  if (error || !due || due.length === 0) {
    appEl.innerHTML = `
      <a class="back-link" href="#/flashcards">&larr; Flashcards</a>
      <div class="empty-state">No cards due right now. Nice work.</div>
    `;
    return;
  }

  let idx = 0;
  let revealed = false;
  let reviewedCount = 0;

  function render() {
    if (idx >= due.length) {
      appEl.innerHTML = `
        <div class="results-panel">
          <div style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-soft);">Study session &middot; done</div>
          <div class="results-score">${reviewedCount} card${reviewedCount === 1 ? '' : 's'} reviewed</div>
          <a class="back-link" href="#/flashcards" style="margin-top:12px;display:inline-block;">&larr; Back to flashcards</a>
        </div>
      `;
      return;
    }
    const card = due[idx];
    appEl.innerHTML = `
      <a class="back-link" href="#/flashcards">&larr; Flashcards</a>
      <div style="font-size:12px;color:var(--ink-soft);margin-bottom:8px;">Card ${idx + 1} of ${due.length}</div>
      <div class="results-panel" style="text-align:left;">
        <div class="explanation-text" style="font-size:16px;">${escapeHtml(card.front)}</div>
        ${revealed ? `<hr style="margin:16px 0;border:none;border-top:1px solid var(--ink-soft);opacity:0.3;"><div class="explanation-text">${escapeHtml(card.back)}</div>` : ''}
      </div>
      <div style="margin-top:16px;">
        ${
          revealed
            ? `
          <div style="display:flex;gap:8px;">
            <button class="exam-btn" data-rate="again">Again</button>
            <button class="exam-btn" data-rate="hard">Hard</button>
            <button class="exam-btn primary" data-rate="good">Good</button>
            <button class="exam-btn primary" data-rate="easy">Easy</button>
          </div>
        `
            : `<button class="exam-btn primary" id="btn-reveal">Reveal answer</button>`
        }
      </div>
    `;

    if (!revealed) {
      appEl.querySelector('#btn-reveal').addEventListener('click', () => {
        revealed = true;
        render();
      });
    } else {
      appEl.querySelectorAll('[data-rate]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const rating = btn.dataset.rate;
          const sched = nextSchedule(card, rating);
          await supabase
            .from('flashcards')
            .update({ ...sched, last_reviewed_at: new Date().toISOString(), last_rating: rating })
            .eq('id', card.id);
          await supabase.from('flashcard_reviews').insert({
            flashcard_id: card.id,
            rating,
            interval_days: sched.interval_days,
          });
          reviewedCount += 1;
          idx += 1;
          revealed = false;
          render();
        });
      });
    }
  }

  render();
}

// ---------------------------------------------------------------------------
// Short quiz: N random cards, self-graded correct/incorrect, no SRS update.
// ---------------------------------------------------------------------------
async function renderShortQuiz(appEl, supabase) {
  appEl.innerHTML = `<div class="empty-state">Loading short quiz&hellip;</div>`;
  const ownerId = await getOwnerId(supabase);

  const { data: all, error } = await supabase.from('flashcards').select('id, front, back').eq('owner_id', ownerId);

  if (error || !all || all.length === 0) {
    appEl.innerHTML = `
      <a class="back-link" href="#/flashcards">&larr; Flashcards</a>
      <div class="empty-state">No flashcards to quiz yet.</div>
    `;
    return;
  }

  const pool = [...all].sort(() => Math.random() - 0.5).slice(0, Math.min(5, all.length));
  let idx = 0;
  let revealed = false;
  let correct = 0;
  let incorrect = 0;

  function render() {
    if (idx >= pool.length) {
      appEl.innerHTML = `
        <div class="results-panel">
          <div style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-soft);">Short quiz &middot; results</div>
          <div class="results-score">${correct} / ${pool.length}</div>
          <div style="color:var(--ink-soft);font-size:14px;">${incorrect} marked for review</div>
          <a class="back-link" href="#/flashcards" style="margin-top:12px;display:inline-block;">&larr; Back to flashcards</a>
        </div>
      `;
      return;
    }
    const card = pool[idx];
    appEl.innerHTML = `
      <div style="font-size:12px;color:var(--ink-soft);margin-bottom:8px;">Short quiz &middot; ${idx + 1} of ${pool.length}</div>
      <div class="results-panel" style="text-align:left;">
        <div class="explanation-text" style="font-size:16px;">${escapeHtml(card.front)}</div>
        ${revealed ? `<hr style="margin:16px 0;border:none;border-top:1px solid var(--ink-soft);opacity:0.3;"><div class="explanation-text">${escapeHtml(card.back)}</div>` : ''}
      </div>
      <div style="margin-top:16px;">
        ${
          revealed
            ? `
          <div style="display:flex;gap:8px;">
            <button class="exam-btn incorrect-btn" id="btn-wrong">I got it wrong</button>
            <button class="exam-btn primary" id="btn-right">I got it right</button>
          </div>
        `
            : `<button class="exam-btn primary" id="btn-reveal">Show answer</button>`
        }
      </div>
    `;
    if (!revealed) {
      appEl.querySelector('#btn-reveal').addEventListener('click', () => {
        revealed = true;
        render();
      });
    } else {
      appEl.querySelector('#btn-right').addEventListener('click', () => {
        correct += 1;
        idx += 1;
        revealed = false;
        render();
      });
      appEl.querySelector('#btn-wrong').addEventListener('click', () => {
        incorrect += 1;
        idx += 1;
        revealed = false;
        render();
      });
    }
  }

  render();
}
