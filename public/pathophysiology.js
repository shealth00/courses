// pathophysiology.js — symptom-first reasoning: pick a presenting complaint
// (not a disease), see the big picture, the physical exam findings that
// narrow things down, and a differential where every condition carries its
// own mechanism right alongside it. Distinct from topics.js (disease-first
// deep-dives) and flashcards.js's reference decks (compact recall cards).

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

export async function mountPathophysiology(appEl, supabase, routeParts) {
  if (routeParts.length > 0 && routeParts[0]) {
    return renderTopic(appEl, supabase, routeParts[0]);
  }
  return renderTopicList(appEl, supabase);
}

async function renderTopicList(appEl, supabase) {
  appEl.innerHTML = `<div class="empty-state">Loading pathophysiology&hellip;</div>`;

  const { data: topics, error } = await supabase
    .from('pathophysiology_topics')
    .select('id, slug, title, system_tag, sort_order')
    .order('system_tag', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    appEl.innerHTML = `<div class="empty-state">Could not load pathophysiology topics. Check that schema_pathophysiology.sql has been run.</div>`;
    console.error(error);
    return;
  }

  if (!topics || topics.length === 0) {
    appEl.innerHTML = `<div class="empty-state">No pathophysiology topics yet.</div>`;
    return;
  }

  const bySystem = {};
  topics.forEach((t) => {
    const tag = t.system_tag || 'General';
    (bySystem[tag] ??= []).push(t);
  });

  appEl.innerHTML = `
    <h1 class="serif" style="font-size:26px;margin:0 0 4px;">Pathophysiology</h1>
    <p style="color:var(--ink-soft);font-size:13.5px;max-width:680px;margin-bottom:24px;">
      Start from the symptom, not the diagnosis — the big picture, the exam findings that narrow things
      down, and a differential where every candidate carries its own mechanism right alongside it.
    </p>
    ${Object.entries(bySystem)
      .map(
        ([tag, tagTopics]) => `
      <div class="section-label">${escapeHtml(tag)}</div>
      <div class="block-list" style="margin-bottom:24px;">
        ${tagTopics
          .map(
            (t) => `
          <a class="block-card" style="text-decoration:none;color:inherit;display:block;" href="#/pathophysiology/${encodeURIComponent(t.slug)}">
            <h3>${escapeHtml(t.title)}</h3>
          </a>
        `
          )
          .join('')}
      </div>
    `
      )
      .join('')}
  `;
}

async function renderTopic(appEl, supabase, slug) {
  appEl.innerHTML = `<div class="empty-state">Loading topic&hellip;</div>`;

  const { data: t, error } = await supabase.from('pathophysiology_topics').select('*').eq('slug', slug).single();
  if (error || !t) {
    appEl.innerHTML = `<div class="empty-state">Topic not found.</div>`;
    console.error(error);
    return;
  }

  const ddx = t.ddx || [];

  appEl.innerHTML = `
    <a class="back-link" href="#/pathophysiology">&larr; Pathophysiology</a>
    <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-soft);">${escapeHtml(t.system_tag || '')}</div>
    <h1 class="serif" style="font-size:28px;margin:6px 0 20px;">${escapeHtml(t.title)}</h1>

    <div class="explanation-panel" style="margin-top:0;">
      <h4>The Big Picture</h4>
      <div class="explanation-text">${escapeHtml(t.big_picture)}</div>
    </div>

    <div class="section-label">Physical Exam Findings</div>
    <div class="explanation-text" style="white-space:pre-line;">${escapeHtml(t.exam_findings)}</div>

    <div class="section-label">Differential Diagnosis &amp; Mechanism</div>
    <div id="ddx-list" style="display:flex;flex-direction:column;gap:10px;margin-top:12px;">
      ${ddx
        .map(
          (d) => `
        <div class="block-card">
          <h3 style="margin:0 0 6px;">${escapeHtml(d.condition)}</h3>
          ${d.key_features ? `<p style="margin:0 0 8px;"><strong>Key features:</strong> ${escapeHtml(d.key_features)}</p>` : ''}
          <p style="margin:0;color:var(--ink-soft);"><strong>Mechanism:</strong> ${escapeHtml(d.mechanism)}</p>
        </div>
      `
        )
        .join('')}
      ${ddx.length === 0 ? '<div class="empty-state">No differential entries yet for this topic.</div>' : ''}
    </div>
  `;
}
