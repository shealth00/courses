// app.js — router + catalog views for the USMLE Illustration Portfolio.

import { getSupabase } from './supabaseClient.js';
import { mountViewer } from './viewer3d.js';
import { mountQBank } from './qbank.js';
import { mountFlashcards } from './flashcards.js';
import { mountPathways } from './pathway.js';
import { mountAccount } from './account.js';

const appEl = document.getElementById('app');
const navLinks = document.querySelectorAll('.topnav a');
const navAccountLink = document.getElementById('nav-account');

function setActiveNav(route) {
  navLinks.forEach((a) => a.classList.toggle('active', a.dataset.route === route));
}

// Keep the nav's "Sign in" link in sync with auth state (shows the signed-in
// email instead once logged in). Anonymous usage is unaffected either way.
async function refreshAccountNav() {
  if (!navAccountLink) return;
  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  navAccountLink.textContent = user ? user.email || 'Account' : 'Sign in';
}

getSupabase().then((supabase) => {
  refreshAccountNav();
  supabase.auth.onAuthStateChange(() => {
    refreshAccountNav();
    if ((window.location.hash || '').startsWith('#/account')) router();
  });
});

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------
async function router() {
  const hash = window.location.hash || '#/catalog';
  const [, path, ...rest] = hash.split('/'); // "#", "catalog", ...

  if (path === 'catalog' && rest.length === 0) {
    setActiveNav('catalog');
    return renderCatalog();
  }
  if (path === 'module' && rest[0]) {
    setActiveNav('catalog');
    return renderModule(rest[0]);
  }
  if (path === 'qbank') {
    setActiveNav('qbank');
    return mountQBank(appEl, rest);
  }
  if (path === 'flashcards') {
    setActiveNav('flashcards');
    const supabase = await getSupabase();
    return mountFlashcards(appEl, supabase, rest);
  }
  if (path === 'pathways' || path === 'pathway') {
    setActiveNav('pathways');
    const supabase = await getSupabase();
    return mountPathways(appEl, supabase, path === 'pathway' ? rest : []);
  }
  if (path === 'account') {
    setActiveNav('account');
    const supabase = await getSupabase();
    return mountAccount(appEl, supabase);
  }

  setActiveNav('catalog');
  return renderCatalog();
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);

// ---------------------------------------------------------------------------
// Catalog view: courses -> modules
// ---------------------------------------------------------------------------
async function renderCatalog() {
  appEl.innerHTML = `<div class="empty-state">Loading course library&hellip;</div>`;
  const supabase = await getSupabase();

  const { data: courses, error: courseErr } = await supabase
    .from('courses')
    .select('id, slug, title, subtitle, sort_order')
    .order('sort_order', { ascending: true });

  if (courseErr || !courses) {
    appEl.innerHTML = `<div class="empty-state">Could not load courses. Check Supabase config and that schema.sql has been run.</div>`;
    console.error(courseErr);
    return;
  }

  const { data: modules, error: moduleErr } = await supabase
    .from('modules')
    .select('id, course_id, slug, title, summary, accent_color, sort_order')
    .order('sort_order', { ascending: true });

  if (moduleErr) {
    console.error(moduleErr);
  }

  const modulesByCourse = {};
  (modules || []).forEach((m) => {
    (modulesByCourse[m.course_id] ??= []).push(m);
  });

  if (courses.length === 0) {
    appEl.innerHTML = `<div class="empty-state">No courses yet. Run <code>node supabase/seed.js</code> to populate the catalog.</div>`;
    return;
  }

  appEl.innerHTML = courses
    .map((course) => {
      const mods = modulesByCourse[course.id] || [];
      return `
        <section class="course-group">
          <h2>${escapeHtml(course.title)}</h2>
          <div class="subtitle">${escapeHtml(course.subtitle || '')}</div>
          <div class="module-grid">
            ${mods
              .map(
                (m) => `
              <a class="module-card" href="#/module/${encodeURIComponent(m.slug)}" style="border-top-color:${m.accent_color || '#3b5f8a'}">
                <h3>${escapeHtml(m.title)}</h3>
                <p>${escapeHtml(m.summary || '')}</p>
              </a>
            `
              )
              .join('')}
            ${mods.length === 0 ? '<div class="empty-state">No modules yet for this course.</div>' : ''}
          </div>
        </section>
      `;
    })
    .join('');
}

// ---------------------------------------------------------------------------
// Module view: 2D + 3D plate grids
// ---------------------------------------------------------------------------
async function renderModule(moduleSlug) {
  appEl.innerHTML = `<div class="empty-state">Loading module&hellip;</div>`;
  const supabase = await getSupabase();

  const { data: mod, error: modErr } = await supabase
    .from('modules')
    .select('id, slug, title, summary, accent_color')
    .eq('slug', moduleSlug)
    .single();

  if (modErr || !mod) {
    appEl.innerHTML = `<div class="empty-state">Module not found.</div>`;
    console.error(modErr);
    return;
  }

  const { data: illustrations, error: illErr } = await supabase
    .from('illustrations')
    .select('id, title, description, kind, storage_path, model_path, sort_order')
    .eq('module_id', mod.id)
    .order('sort_order', { ascending: true });

  if (illErr) console.error(illErr);

  const withUrls = (illustrations || []).map((row) => ({
    ...row,
    image_url: row.storage_path ? supabase.storage.from('illustrations').getPublicUrl(row.storage_path).data.publicUrl : null,
    model_url: row.model_path ? supabase.storage.from('models-3d').getPublicUrl(row.model_path).data.publicUrl : null,
  }));

  const twoD = withUrls.filter((p) => p.kind === '2d');
  const threeD = withUrls.filter((p) => p.kind === '3d');

  appEl.innerHTML = `
    <a class="back-link" href="#/catalog">&larr; Course Library</a>
    <h1 class="serif" style="font-size:28px;margin:0 0 4px;">${escapeHtml(mod.title)}</h1>
    <p style="color:var(--ink-soft);font-size:13.5px;max-width:640px;">${escapeHtml(mod.summary || '')}</p>

    <div class="section-label">2D diagram set</div>
    <div class="plate-grid" id="grid-2d">
      ${twoD.length ? twoD.map(plateCard).join('') : emptyPlateNote('2D')}
    </div>

    <div class="section-label">3D interactive models</div>
    <div class="plate-grid" id="grid-3d">
      ${threeD.length ? threeD.map(plateCard).join('') : emptyPlateNote('3D')}
    </div>
  `;

  appEl.querySelectorAll('[data-view-3d]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const { modelUrl, title } = btn.dataset;
      open3DViewer({ modelUrl: btn.dataset.modelUrl || null, title: btn.dataset.title });
    });
  });
}

function emptyPlateNote(kind) {
  return `<div class="empty-state">No ${kind} plates seeded for this module yet. Add rows via supabase/seed.js or the illustrations table.</div>`;
}

function plateCard(plate) {
  if (plate.kind === '2d') {
    return `
      <div class="plate-card">
        <div class="plate-thumb">
          <span class="badge">2D</span>
          ${plate.image_url ? `<img src="${escapeHtml(plate.image_url)}" alt="${escapeHtml(plate.title)}" loading="lazy">` : escapeHtml(plate.title)}
        </div>
        <div class="plate-body">
          <h4>${escapeHtml(plate.title)}</h4>
          <p>${escapeHtml(plate.description || '')}</p>
        </div>
      </div>
    `;
  }
  return `
    <div class="plate-card">
      <div class="plate-thumb">
        <span class="badge">3D</span>
        ${plate.image_url ? `<img src="${escapeHtml(plate.image_url)}" alt="${escapeHtml(plate.title)}" loading="lazy">` : 'Interactive model'}
      </div>
      <div class="plate-body">
        <h4>${escapeHtml(plate.title)}</h4>
        <p>${escapeHtml(plate.description || '')}</p>
        <button class="plate-view-btn" data-view-3d data-model-url="${escapeHtml(plate.model_url || '')}" data-title="${escapeHtml(plate.title)}">
          Open 3D viewer
        </button>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 3D viewer modal
// ---------------------------------------------------------------------------
function open3DViewer({ modelUrl, title }) {
  const overlay = document.createElement('div');
  overlay.className = 'viewer-overlay';
  overlay.innerHTML = `
    <div class="viewer-panel">
      <div class="viewer-head">
        <h3>${escapeHtml(title)}</h3>
        <button class="viewer-close" aria-label="Close">&times;</button>
      </div>
      <div class="viewer-canvas-wrap">
        <div class="viewer-hint">Drag to rotate &middot; scroll to zoom${modelUrl ? '' : ' &middot; placeholder model (no .glb uploaded yet)'}</div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const canvasWrap = overlay.querySelector('.viewer-canvas-wrap');
  const viewer = mountViewer(canvasWrap, { modelUrl: modelUrl || null, title });

  function close() {
    viewer.dispose();
    overlay.remove();
  }
  overlay.querySelector('.viewer-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', onKey);
    }
  });
}
