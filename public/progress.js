// progress.js — read-only performance dashboard: QBank accuracy (overall and
// per-system, pooled across every submitted attempt) and flashcard stats
// (deck size, due count, rating distribution). Pure aggregation over
// existing tables, same anonymous-first / whatever-RLS-shows model every
// other view in this app already uses — no schema changes, no new tables.

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

// Supabase's PostgREST default page size is 1000 rows; chunk .in() filters
// so a deck/attempt history bigger than that doesn't silently truncate.
function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function mountProgress(appEl, supabase) {
  appEl.innerHTML = `<div class="empty-state">Loading progress&hellip;</div>`;

  const [qbank, flashcards] = await Promise.all([
    loadQBankStats(supabase),
    loadFlashcardStats(supabase),
  ]);

  appEl.innerHTML = `
    <h1 class="serif" style="font-size:26px;margin:0 0 4px;">Progress</h1>
    <p style="color:var(--ink-soft);font-size:13.5px;max-width:640px;margin-bottom:24px;">
      Cumulative performance across every submitted QBank attempt and the current flashcard deck.
    </p>

    <div class="section-label">QBank performance</div>
    ${qbank.error ? `<div class="empty-state">Could not load QBank attempts. Check that schema_qbank.sql has been run.</div>` : renderQBankSection(qbank)}

    <div class="section-label">Flashcards</div>
    ${flashcards.error ? `<div class="empty-state">Could not load flashcards. Check that schema_flashcards.sql has been run.</div>` : renderFlashcardSection(flashcards)}
  `;
}

// ---------------------------------------------------------------------------
// QBank: pool every submitted attempt's answers, join to qbank_choices for
// correctness and qbank_questions for system_tag — same aggregation qbank.js's
// renderResults() does for one attempt, just across all of them.
// ---------------------------------------------------------------------------
async function loadQBankStats(supabase) {
  const { data: attempts, error: attemptsErr } = await supabase
    .from('qbank_attempts')
    .select('id')
    .not('submitted_at', 'is', null);

  if (attemptsErr) {
    console.error(attemptsErr);
    return { error: true };
  }

  const attemptIds = (attempts || []).map((a) => a.id);
  if (attemptIds.length === 0) {
    return { attemptCount: 0, totalAnswered: 0, totalCorrect: 0, bySystem: {} };
  }

  const answerBatches = await Promise.all(
    chunk(attemptIds, 200).map((ids) =>
      supabase.from('qbank_attempt_answers').select('question_id, choice_id').in('attempt_id', ids)
    )
  );
  const answers = answerBatches.flatMap((r) => r.data || []).filter((a) => a.choice_id);

  if (answers.length === 0) {
    return { attemptCount: attemptIds.length, totalAnswered: 0, totalCorrect: 0, bySystem: {} };
  }

  const questionIds = [...new Set(answers.map((a) => a.question_id))];
  const choiceIds = [...new Set(answers.map((a) => a.choice_id))];

  const [questionBatches, choiceBatches] = await Promise.all([
    Promise.all(chunk(questionIds, 200).map((ids) => supabase.from('qbank_questions').select('id, system_tag').in('id', ids))),
    Promise.all(chunk(choiceIds, 200).map((ids) => supabase.from('qbank_choices').select('id, is_correct').in('id', ids))),
  ]);
  const questionById = Object.fromEntries(questionBatches.flatMap((r) => r.data || []).map((q) => [q.id, q]));
  const choiceById = Object.fromEntries(choiceBatches.flatMap((r) => r.data || []).map((c) => [c.id, c]));

  let totalAnswered = 0;
  let totalCorrect = 0;
  const bySystem = {};

  answers.forEach((a) => {
    const choice = choiceById[a.choice_id];
    if (!choice) return; // choice was deleted after the fact — skip rather than miscount
    totalAnswered += 1;
    if (choice.is_correct) totalCorrect += 1;

    const tag = questionById[a.question_id]?.system_tag || 'General';
    bySystem[tag] ??= { correct: 0, total: 0 };
    bySystem[tag].total += 1;
    if (choice.is_correct) bySystem[tag].correct += 1;
  });

  return { attemptCount: attemptIds.length, totalAnswered, totalCorrect, bySystem };
}

function renderQBankSection(qbank) {
  if (qbank.totalAnswered === 0) {
    return `<div class="empty-state">No submitted QBank attempts yet. Finish a block to see accuracy here.</div>`;
  }

  const pct = Math.round((qbank.totalCorrect / qbank.totalAnswered) * 100);
  const systemRows = Object.entries(qbank.bySystem)
    .sort((a, b) => b[1].total - a[1].total)
    .map(([tag, s]) => barRow(tag, s.correct, s.total))
    .join('');

  return `
    <div class="block-list" style="margin-bottom:20px;">
      <div class="block-card">
        <h3>${pct}%</h3>
        <p>Overall accuracy across ${qbank.attemptCount} submitted attempt${qbank.attemptCount === 1 ? '' : 's'}.</p>
      </div>
      <div class="block-card">
        <h3>${qbank.totalCorrect} / ${qbank.totalAnswered}</h3>
        <p>Questions answered correctly out of total answered.</p>
      </div>
    </div>
    <div class="results-breakdown" style="margin:0 0 28px;max-width:640px;">
      ${systemRows}
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Flashcards: deck size, due count, and rating distribution from
// flashcard_reviews as the "trend" (a true time series felt like overkill
// for what's currently a small review log).
// ---------------------------------------------------------------------------
async function loadFlashcardStats(supabase) {
  const { data: cards, error: cardsErr } = await supabase.from('flashcards').select('id, due_at');
  if (cardsErr) {
    console.error(cardsErr);
    return { error: true };
  }

  const now = Date.now();
  const totalCards = (cards || []).length;
  const dueCount = (cards || []).filter((c) => new Date(c.due_at).getTime() <= now).length;

  const { data: reviews, error: reviewsErr } = await supabase.from('flashcard_reviews').select('rating');
  if (reviewsErr) {
    console.error(reviewsErr);
    return { error: true };
  }

  const ratingCounts = { again: 0, hard: 0, good: 0, easy: 0 };
  (reviews || []).forEach((r) => {
    if (ratingCounts[r.rating] !== undefined) ratingCounts[r.rating] += 1;
  });

  return { totalCards, dueCount, totalReviews: (reviews || []).length, ratingCounts };
}

function renderFlashcardSection(flashcards) {
  const { totalCards, dueCount, totalReviews, ratingCounts } = flashcards;

  const ratingLabels = { again: 'Again', hard: 'Hard', good: 'Good', easy: 'Easy' };
  const ratingRows = Object.entries(ratingLabels)
    .map(([key, label]) => barRow(label, ratingCounts[key], totalReviews))
    .join('');

  return `
    <div class="block-list" style="margin-bottom:20px;">
      <div class="block-card">
        <h3>${totalCards}</h3>
        <p>Total flashcard${totalCards === 1 ? '' : 's'} in the deck.</p>
      </div>
      <div class="block-card">
        <h3>${dueCount}</h3>
        <p>Due for review right now.</p>
      </div>
    </div>
    ${
      totalReviews === 0
        ? `<div class="empty-state">No flashcard reviews logged yet. Study a due card to start building this trend.</div>`
        : `
      <div style="font-size:12px;color:var(--ink-soft);margin-bottom:8px;">Review rating distribution &middot; ${totalReviews} review${totalReviews === 1 ? '' : 's'} logged</div>
      <div class="results-breakdown" style="margin:0 0 28px;max-width:640px;">
        ${ratingRows}
      </div>
    `
    }
  `;
}

// ---------------------------------------------------------------------------
// A single labeled row with a plain-CSS width-percentage bar — no charting
// library, per project convention. `count`/`denominator` doubles as
// "correct/total" (QBank) or "rating count/total reviews" (flashcards).
// ---------------------------------------------------------------------------
function barRow(label, count, denominator) {
  const pct = denominator > 0 ? Math.round((count / denominator) * 100) : 0;
  return `
    <div class="results-row" style="flex-direction:column;align-items:stretch;gap:6px;padding:10px 0;">
      <div style="display:flex;justify-content:space-between;">
        <span>${escapeHtml(label)}</span>
        <span>${count} / ${denominator} &middot; ${pct}%</span>
      </div>
      <div class="progress-bar-track">
        <div class="progress-bar-fill" style="width:${pct}%;"></div>
      </div>
    </div>
  `;
}
