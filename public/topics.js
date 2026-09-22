// topics.js — "Clinical Pattern Recognition" topic deep-dives: seven
// structured teaching sections per topic (hook vignette, DDx mapping,
// diagnostic evaluation, management, a first-order recall check, a full
// second-order clinical vignette with choices, and a branching diagnostic
// flowchart). Richer than a single QBank question or a linear pathway —
// this is a whole-topic study page.

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

export async function mountTopics(appEl, supabase, routeParts) {
  if (routeParts.length > 0 && routeParts[0]) {
    return renderTopic(appEl, supabase, routeParts[0]);
  }
  return renderTopicList(appEl, supabase);
}

async function renderTopicList(appEl, supabase) {
  appEl.innerHTML = `<div class="empty-state">Loading clinical topics&hellip;</div>`;

  const { data: topics, error } = await supabase
    .from('clinical_topics')
    .select('id, module_number, module_title, key_submodule, slug, title, sort_order')
    .order('module_number', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    appEl.innerHTML = `<div class="empty-state">Could not load clinical topics. Check that schema_topics.sql has been run.</div>`;
    console.error(error);
    return;
  }

  if (!topics || topics.length === 0) {
    appEl.innerHTML = `<div class="empty-state">No clinical topics yet.</div>`;
    return;
  }

  const byModule = {};
  topics.forEach((t) => {
    const key = `${t.module_number}::${t.module_title}`;
    (byModule[key] ??= []).push(t);
  });

  appEl.innerHTML = `
    <h1 class="serif" style="font-size:26px;margin:0 0 4px;">Clinical Pattern Recognition</h1>
    <p style="color:var(--ink-soft);font-size:13.5px;max-width:680px;margin-bottom:24px;">
      Full topic deep-dives — a clinical hook, differential mapping, diagnostic workup, management,
      a quick recall check, a worked vignette, and a branching diagnostic flowchart, all in one place.
    </p>
    ${Object.entries(byModule)
      .map(([key, mods]) => {
        const [num, title] = key.split('::');
        return `
        <div class="section-label">Module ${escapeHtml(num)} &middot; ${escapeHtml(title)}</div>
        <div class="block-list" style="margin-bottom:24px;">
          ${mods
            .map(
              (t) => `
            <a class="block-card" style="text-decoration:none;color:inherit;display:block;" href="#/topic/${encodeURIComponent(t.slug)}">
              <h3>${escapeHtml(t.title)}</h3>
              <p>${escapeHtml(t.key_submodule)}</p>
            </a>
          `
            )
            .join('')}
        </div>
      `;
      })
      .join('')}
  `;
}

async function renderTopic(appEl, supabase, slug) {
  appEl.innerHTML = `<div class="empty-state">Loading topic&hellip;</div>`;

  const { data: t, error } = await supabase.from('clinical_topics').select('*').eq('slug', slug).single();
  if (error || !t) {
    appEl.innerHTML = `<div class="empty-state">Topic not found.</div>`;
    console.error(error);
    return;
  }

  appEl.innerHTML = `
    <a class="back-link" href="#/topics">&larr; Clinical Pattern Recognition</a>
    <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-soft);">
      Module ${escapeHtml(String(t.module_number))} &middot; ${escapeHtml(t.module_title)} &middot; ${escapeHtml(t.key_submodule)}
    </div>
    <h1 class="serif" style="font-size:28px;margin:6px 0 20px;">${escapeHtml(t.title)}</h1>

    <div class="explanation-panel" style="margin-top:0;">
      <h4>1. Clinical Presentation</h4>
      <div class="explanation-text">${escapeHtml(t.hook_vignette)}</div>
    </div>

    <div class="section-label">2. Differential Diagnosis Mapping</div>
    <div class="explanation-text" style="white-space:pre-line;">${escapeHtml(t.ddx_mapping)}</div>

    <div class="section-label">3. Diagnostic Evaluation</div>
    <div class="explanation-text" style="white-space:pre-line;">${escapeHtml(t.diagnostic_evaluation)}</div>

    <div class="section-label">4. Intervention &amp; Management</div>
    <div class="explanation-text" style="white-space:pre-line;">${escapeHtml(t.management)}</div>

    <div class="section-label">5. First-Order Knowledge Check</div>
    <div class="block-card" id="foc-card" style="cursor:pointer;">
      <p style="margin:0;">${escapeHtml(t.first_order_prompt)}</p>
      <p id="foc-answer" style="display:none;margin:10px 0 0;font-weight:600;color:var(--correct);">${escapeHtml(t.first_order_answer)}</p>
      <div id="foc-hint" style="margin-top:10px;font-size:12px;color:var(--accent-blue);">Click to reveal answer</div>
    </div>

    <div class="section-label">6. Second-Order Clinical Vignette</div>
    <div class="exam-stem" style="margin-bottom:0;">${escapeHtml(t.second_order_vignette)}</div>
    <div class="exam-lead-in">${escapeHtml(t.second_order_question)}</div>
    <div class="choice-list" id="second-order-choices">
      ${(t.second_order_choices || [])
        .map(
          (c) => `
        <div class="choice-row" data-label="${escapeHtml(c.label)}" data-correct="${c.correct ? '1' : '0'}">
          <span class="choice-label">${escapeHtml(c.label)}</span>
          <span>${escapeHtml(c.text)}</span>
        </div>
      `
        )
        .join('')}
    </div>
    <div id="second-order-explanation" style="display:none;" class="explanation-panel">
      <h4>Explanation</h4>
      <div class="explanation-text">${escapeHtml(t.second_order_explanation)}</div>
    </div>

    <div class="section-label">7. Diagnostic Flowchart${t.flowchart_title ? ' &middot; ' + escapeHtml(t.flowchart_title) : ''}</div>
    <div id="flowchart-tree"></div>
  `;

  const focCard = appEl.querySelector('#foc-card');
  focCard.addEventListener('click', () => {
    appEl.querySelector('#foc-answer').style.display = 'block';
    appEl.querySelector('#foc-hint').style.display = 'none';
  });

  appEl.querySelectorAll('#second-order-choices .choice-row').forEach((row) => {
    row.addEventListener('click', () => {
      const revealed = appEl.querySelector('#second-order-explanation').style.display === 'block';
      if (revealed) return;
      appEl.querySelectorAll('#second-order-choices .choice-row').forEach((r) => {
        if (r.dataset.correct === '1') r.classList.add('correct');
        else if (r === row) r.classList.add('incorrect');
      });
      appEl.querySelector('#second-order-explanation').style.display = 'block';
    });
  });

  renderFlowchart(appEl.querySelector('#flowchart-tree'), t.flowchart || []);
}

function renderFlowchart(container, nodes) {
  if (!container) return;
  if (!nodes || nodes.length === 0) {
    container.innerHTML = `<div class="empty-state">No flowchart for this topic yet.</div>`;
    return;
  }
  container.innerHTML = `<div class="pathway-flow" style="align-items:stretch;">${nodes.map(renderFlowNode).join('')}</div>`;
}

function renderFlowNode(node, i) {
  const branches = node.branches || [];
  return `
    <div class="pathway-node current" style="cursor:default;">
      <span class="pathway-node-num">${i + 1}</span>
      <span class="pathway-node-label">${escapeHtml(node.node)}</span>
    </div>
    ${
      branches.length
        ? `<div style="margin:6px 0 6px 30px;display:flex;flex-direction:column;gap:6px;">
        ${branches
          .map(
            (b) => `
          <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;">
            <span style="color:var(--accent-blue);">&rarr;</span>
            <span><strong>${escapeHtml(b.label)}</strong>${b.next ? ' &mdash; ' + escapeHtml(b.next) : ''}</span>
          </div>
        `
          )
          .join('')}
      </div>`
        : ''
    }
  `;
}
