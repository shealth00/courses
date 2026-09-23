// pathway.js — step-through pathogenesis/pathway viewer ("watch the disease
// happen"). Not real video or 3D animation — a genuine ordered mechanism
// flow, played automatically or stepped manually, with an optional drug
// note per step so pharmacology can be shown acting on the mechanism
// directly. Same "real pipeline, honest about the asset" philosophy as
// viewer3d.js's placeholder model.

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

export async function mountPathways(appEl, supabase, routeParts) {
  if (routeParts.length > 0 && routeParts[0]) {
    return renderPathway(appEl, supabase, routeParts[0]);
  }
  return renderPathwayList(appEl, supabase);
}

async function renderPathwayList(appEl, supabase) {
  appEl.innerHTML = `<div class="empty-state">Loading pathways&hellip;</div>`;

  const { data: pathways, error } = await supabase
    .from('pathways')
    .select('id, slug, title, summary, sort_order')
    .order('sort_order', { ascending: true });

  if (error) {
    appEl.innerHTML = `<div class="empty-state">Could not load pathways. Check that schema_pathways.sql has been run.</div>`;
    console.error(error);
    return;
  }

  if (!pathways || pathways.length === 0) {
    appEl.innerHTML = `<div class="empty-state">No pathways yet. Run <code>node supabase/seed.js</code> to add the sample pathway.</div>`;
    return;
  }

  appEl.innerHTML = `
    <h1 class="serif" style="font-size:26px;margin:0 0 4px;">Pathways &amp; Pathogenesis</h1>
    <p style="color:var(--ink-soft);font-size:13.5px;max-width:640px;margin-bottom:24px;">
      Step through a mechanism instead of reading it as a paragraph — play it end to end, or move step by step.
    </p>
    <div class="block-list">
      ${pathways
        .map(
          (p) => `
        <div class="block-card">
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(p.summary || '')}</p>
          <a class="start-btn" style="display:block;text-align:center;text-decoration:none;" href="#/pathway/${encodeURIComponent(p.slug)}">Watch it happen</a>
        </div>
      `
        )
        .join('')}
    </div>
  `;
}

async function renderPathway(appEl, supabase, slug) {
  appEl.innerHTML = `<div class="empty-state">Loading pathway&hellip;</div>`;

  const { data: pathway, error: pErr } = await supabase.from('pathways').select('id, title, summary, video_path').eq('slug', slug).single();
  if (pErr || !pathway) {
    appEl.innerHTML = `<div class="empty-state">Pathway not found.</div>`;
    console.error(pErr);
    return;
  }

  const { data: steps, error: sErr } = await supabase
    .from('pathway_steps')
    .select('id, position, label, description, drug_intervention')
    .eq('pathway_id', pathway.id)
    .order('position', { ascending: true });

  if (sErr || !steps || steps.length === 0) {
    appEl.innerHTML = `<div class="empty-state">This pathway has no steps yet.</div>`;
    return;
  }

  let current = 0;
  let playing = false;
  let playTimer = null;

  appEl.innerHTML = `
    <a class="back-link" href="#/pathways">&larr; Pathways</a>
    <h1 class="serif" style="font-size:26px;margin:0 0 4px;">${escapeHtml(pathway.title)}</h1>
    <p style="color:var(--ink-soft);font-size:13.5px;max-width:640px;margin-bottom:20px;">${escapeHtml(pathway.summary || '')}</p>
    ${
      pathway.video_path
        ? `<div class="section-label">Narrated video</div>
           <video controls preload="metadata" style="width:100%;max-width:960px;border-radius:8px;border:1px solid var(--line);margin-bottom:28px;background:#000;">
             <source src="${escapeHtml(pathway.video_path)}" type="video/mp4">
           </video>
           <div class="section-label">Or step through it yourself</div>`
        : ''
    }
    <div class="pathway-shell">
      <div class="pathway-flow" id="pathway-flow"></div>
      <div class="pathway-detail" id="pathway-detail"></div>
    </div>
    <div class="exam-footer" style="border:none;padding:16px 0 0;">
      <button class="exam-btn" id="pw-prev">&larr; Previous</button>
      <button class="exam-btn primary" id="pw-play">Play</button>
      <button class="exam-btn primary" id="pw-next">Next &rarr;</button>
    </div>
  `;

  const flowEl = appEl.querySelector('#pathway-flow');
  const detailEl = appEl.querySelector('#pathway-detail');
  const playBtn = appEl.querySelector('#pw-play');

  function renderFlow() {
    flowEl.innerHTML = steps
      .map((s, i) => {
        const classes = ['pathway-node'];
        if (i === current) classes.push('current');
        if (i < current) classes.push('past');
        return `
        <div class="${classes.join(' ')}" data-idx="${i}">
          <span class="pathway-node-num">${i + 1}</span>
          <span class="pathway-node-label">${escapeHtml(s.label)}</span>
        </div>
        ${i < steps.length - 1 ? '<div class="pathway-arrow">&darr;</div>' : ''}
      `;
      })
      .join('');
    flowEl.querySelectorAll('.pathway-node').forEach((node) => {
      node.addEventListener('click', () => {
        stop();
        current = Number(node.dataset.idx);
        render();
      });
    });
  }

  function renderDetail() {
    const s = steps[current];
    detailEl.innerHTML = `
      <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-soft);">Step ${current + 1} of ${steps.length}</div>
      <h3 style="margin:6px 0 10px;">${escapeHtml(s.label)}</h3>
      <p style="font-size:14px;line-height:1.6;">${escapeHtml(s.description || '')}</p>
      ${
        s.drug_intervention
          ? `<div class="edu-objective" style="margin-top:14px;">Pharmacologic intervention here: ${escapeHtml(s.drug_intervention)}</div>`
          : ''
      }
    `;
  }

  function render() {
    renderFlow();
    renderDetail();
    appEl.querySelector('#pw-prev').disabled = current === 0;
    appEl.querySelector('#pw-next').disabled = current === steps.length - 1;
  }

  function stop() {
    playing = false;
    playBtn.textContent = 'Play';
    if (playTimer) clearInterval(playTimer);
    playTimer = null;
  }

  appEl.querySelector('#pw-prev').addEventListener('click', () => {
    stop();
    if (current > 0) {
      current -= 1;
      render();
    }
  });
  appEl.querySelector('#pw-next').addEventListener('click', () => {
    stop();
    if (current < steps.length - 1) {
      current += 1;
      render();
    }
  });
  playBtn.addEventListener('click', () => {
    if (playing) {
      stop();
      return;
    }
    playing = true;
    playBtn.textContent = 'Pause';
    playTimer = setInterval(() => {
      if (current >= steps.length - 1) {
        stop();
        return;
      }
      current += 1;
      render();
    }, 1800);
  });

  render();
}
