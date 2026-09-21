// supabase/seed.js — populates courses, modules, illustrations, and a sample
// QBank block. Run with: node supabase/seed.js
//
// Uses the SERVICE ROLE key (bypasses RLS) — set SUPABASE_SERVICE_KEY in your
// .env before running this. Never run this from the browser or commit the key.

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in your .env.\n' +
    'Get the service_role key from Supabase: Project Settings > API > service_role (secret).\n' +
    'This key is server-only — never expose it to the browser.'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ---------------------------------------------------------------------------
// Content — mirrors the 11-module curriculum built in the design canvas.
// Illustration rows reference storage_path/model_path that you upload
// separately to the "illustrations" and "models-3d" buckets; until real
// files exist, image_url/model_url will just 404 gracefully in the UI.
// ---------------------------------------------------------------------------

const COURSES = [
  { slug: 'step1', title: 'USMLE Step 1', subtitle: 'Basic science illustration curriculum', step: 'step1', sort_order: 1 },
  { slug: 'step2ck', title: 'USMLE Step 2 CK', subtitle: 'Clinical & surgical correlation', step: 'step2ck', sort_order: 2 },
];

const MODULES = [
  { course: 'step1', slug: 'cardiovascular', title: 'Cardiovascular', accent_color: '#b5472a', sort_order: 1,
    summary: 'Cardiac cycle & conduction, valvular pathology, congenital shunts, atherosclerosis, antiarrhythmic pharm.' },
  { course: 'step1', slug: 'neuroscience', title: 'Neuroscience', accent_color: '#3b5f8a', sort_order: 2,
    summary: 'Tracts, brainstem cross-sections, cranial nerve nuclei, stroke syndromes, receptor pharm.' },
  { course: 'step1', slug: 'renal', title: 'Renal, Fluid & Acid-Base', accent_color: '#5a7a3c', sort_order: 3,
    summary: 'Nephron transport, glomerular disease, acid-base maps, diuretic mechanism.' },
  { course: 'step1', slug: 'gi', title: 'GI & Hepatobiliary', accent_color: '#8a5a2a', sort_order: 4,
    summary: 'Gut wall layers, portal circulation, biliary tree, IBD, liver zonation.' },
  { course: 'step1', slug: 'endocrine', title: 'Endocrine', accent_color: '#7a4a8a', sort_order: 5,
    summary: 'HPA/HPT/HPG axes, pancreatic islet signaling, adrenal zonation, thyroid pathology.' },
  { course: 'step1', slug: 'musculoskeletal', title: 'Musculoskeletal', accent_color: '#2a7a72', sort_order: 6,
    summary: 'Joint biomechanics, brachial/lumbosacral plexus, fracture patterns, muscle compartments.' },
  { course: 'step1', slug: 'pathology', title: 'Pathology & Histology', accent_color: '#b5472a', sort_order: 7,
    summary: 'Cell injury cascades, inflammation timeline, tumor grading, classic histology plates.' },
  { course: 'step1', slug: 'pharmacology', title: 'Pharmacology Mechanisms', accent_color: '#3b5f8a', sort_order: 8,
    summary: 'Receptor/enzyme targets, autonomic pharm map, antimicrobial site-of-action wheel.' },
  { course: 'step1', slug: 'immunology', title: 'Immunology', accent_color: '#5a7a3c', sort_order: 9,
    summary: 'Innate/adaptive cascade, complement pathways, hypersensitivity types, cytokine map.' },
  { course: 'step1', slug: 'reproductive', title: 'Reproductive & Embryology', accent_color: '#8a5a2a', sort_order: 10,
    summary: 'Gametogenesis, pelvic anatomy, embryologic folding, congenital malformation atlas.' },
  { course: 'step2ck', slug: 'step2-clinical', title: 'Clinical & Surgical Correlation', accent_color: '#c9a25a', sort_order: 11,
    summary: 'Surgical approach diagrams, imaging correlation, procedural step sequences.' },
];

// A representative slice of illustrations per module (2D + 3D). Extend freely —
// storage_path/model_path are relative paths inside their buckets; upload
// matching files later and these rows will resolve automatically.
const ILLUSTRATIONS = {
  cardiovascular: [
    { kind: '2d', title: 'Cardiac Cycle Timeline', description: 'Pressure-volume loop synced to ECG & heart sounds, phase-labeled.', storage_path: 'cardiovascular/wiggers-diagram.png' },
    { kind: '2d', title: 'Conduction System', description: 'SA→AV→bundle of His→Purkinje, with conduction velocity annotations.', storage_path: 'cardiovascular/conduction-map.png' },
    { kind: '2d', title: 'Congenital Shunt Atlas', description: 'VSD, ASD, PDA, tetralogy of Fallot — flow-direction arrows on schematic chambers.', storage_path: 'cardiovascular/shunt-atlas.png' },
    { kind: '3d', title: 'Four-Chamber Heart, Exploded', description: 'Rotatable chambers with valve layer separable from myocardium and pericardium.', model_path: 'cardiovascular/heart-4chamber.glb', storage_path: 'cardiovascular/heart-4chamber-poster.png' },
    { kind: '3d', title: 'Coronary Artery Distribution', description: 'LAD/LCx/RCA territories mapped onto a rotating epicardial surface.', model_path: 'cardiovascular/coronary-tree.glb', storage_path: 'cardiovascular/coronary-tree-poster.png' },
  ],
  neuroscience: [
    { kind: '2d', title: 'Corticospinal & DCML Pathways', description: 'Decussation points labeled on a schematic spinal cross-section stack.', storage_path: 'neuroscience/tract-diagram.png' },
    { kind: '2d', title: 'Stroke Syndrome Atlas', description: 'Vascular territory → deficit mapping across MCA/ACA/PCA/lacunar strokes.', storage_path: 'neuroscience/circle-of-willis.png' },
    { kind: '3d', title: 'Whole-Brain Transparency Model', description: 'Cortex ghosted to reveal ventricles, basal ganglia, and internal capsule in situ.', model_path: 'neuroscience/brain-transparent.glb', storage_path: 'neuroscience/brain-transparent-poster.png' },
  ],
  renal: [
    { kind: '2d', title: 'Nephron Transport Map', description: 'Segment-by-segment transporters with diuretic sites overlaid.', storage_path: 'renal/nephron-map.png' },
    { kind: '3d', title: 'Kidney Cutaway Model', description: 'Cortex/medulla/pelvis in coronal section with a single nephron traced in 3D.', model_path: 'renal/kidney-cutaway.glb', storage_path: 'renal/kidney-cutaway-poster.png' },
  ],
};

async function upsertCourses() {
  const { data, error } = await supabase.from('courses').upsert(COURSES, { onConflict: 'slug' }).select();
  if (error) throw error;
  console.log(`Upserted ${data.length} courses.`);
  return Object.fromEntries(data.map((c) => [c.slug, c.id]));
}

async function upsertModules(courseIdBySlug) {
  const rows = MODULES.map((m) => ({
    course_id: courseIdBySlug[m.course],
    slug: m.slug,
    title: m.title,
    summary: m.summary,
    accent_color: m.accent_color,
    sort_order: m.sort_order,
  }));
  const { data, error } = await supabase.from('modules').upsert(rows, { onConflict: 'slug' }).select();
  if (error) throw error;
  console.log(`Upserted ${data.length} modules.`);
  return Object.fromEntries(data.map((m) => [m.slug, m.id]));
}

async function upsertIllustrations(moduleIdBySlug) {
  let total = 0;
  for (const [moduleSlug, plates] of Object.entries(ILLUSTRATIONS)) {
    const moduleId = moduleIdBySlug[moduleSlug];
    if (!moduleId) {
      console.warn(`Skipping illustrations for unknown module slug "${moduleSlug}".`);
      continue;
    }
    const rows = plates.map((p, i) => ({
      module_id: moduleId,
      title: p.title,
      description: p.description,
      kind: p.kind,
      storage_path: p.storage_path || null,
      model_path: p.model_path || null,
      sort_order: i + 1,
    }));
    // Clear existing rows for this module before inserting, so re-running the
    // seed script doesn't duplicate plates (illustrations has no natural
    // unique key across re-runs).
    const { error: delErr } = await supabase.from('illustrations').delete().eq('module_id', moduleId);
    if (delErr) throw delErr;
    const { data, error } = await supabase.from('illustrations').insert(rows).select();
    if (error) throw error;
    total += data.length;
  }
  console.log(`Inserted ${total} illustrations.`);
}

async function seedSampleQBankBlock(courseIdBySlug, moduleIdBySlug) {
  const { data: block, error: blockErr } = await supabase
    .from('qbank_blocks')
    .upsert(
      {
        slug: 'cardiovascular-block-1',
        title: 'Cardiovascular — Block 1',
        description: 'A sample timed block covering cardiac cycle, conduction, and valvular disease.',
        course_id: courseIdBySlug['step1'],
        module_id: moduleIdBySlug['cardiovascular'],
        time_limit_sec: 3600,
        mode_default: 'tutor',
        sort_order: 1,
      },
      { onConflict: 'slug' }
    )
    .select()
    .single();
  if (blockErr) throw blockErr;

  const { error: delErr } = await supabase.from('qbank_questions').delete().eq('block_id', block.id);
  if (delErr) throw delErr;

  const { data: q1, error: q1Err } = await supabase
    .from('qbank_questions')
    .insert({
      block_id: block.id,
      position: 1,
      stem:
        'A 58-year-old man presents with exertional chest pain that resolves with rest. ' +
        'ECG shows no acute changes. Cardiac catheterization reveals a 90% stenosis of the ' +
        'proximal left anterior descending artery.',
      lead_in: 'Which of the following myocardial territories is most likely to show ischemic changes?',
      system_tag: 'Cardiovascular',
      difficulty: 'medium',
      explanation:
        'The left anterior descending (LAD) artery supplies the anterior wall of the left ventricle ' +
        'and the anterior two-thirds of the interventricular septum. A proximal LAD stenosis therefore ' +
        'places the anteroseptal territory at risk of ischemia, which would be reflected by ST changes ' +
        'in leads V1–V4 on ECG.',
      educational_objective: 'Know the myocardial territory supplied by each major coronary artery and its ECG correlate.',
      references: 'First Aid for the USMLE Step 1 — Cardiovascular: Coronary artery anatomy.',
    })
    .select()
    .single();
  if (q1Err) throw q1Err;

  const choices = [
    { label: 'A', choice_text: 'Inferior wall', is_correct: false },
    { label: 'B', choice_text: 'Anteroseptal wall', is_correct: true },
    { label: 'C', choice_text: 'Posterior wall', is_correct: false },
    { label: 'D', choice_text: 'Lateral wall', is_correct: false },
    { label: 'E', choice_text: 'Right ventricular free wall', is_correct: false },
  ].map((c, i) => ({ ...c, question_id: q1.id, sort_order: i + 1 }));
  const { error: chErr } = await supabase.from('qbank_choices').insert(choices);
  if (chErr) throw chErr;

  console.log('Seeded sample QBank block "Cardiovascular — Block 1" with 1 question.');
}

async function main() {
  console.log('Seeding Supabase project...');
  const courseIdBySlug = await upsertCourses();
  const moduleIdBySlug = await upsertModules(courseIdBySlug);
  await upsertIllustrations(moduleIdBySlug);
  await seedSampleQBankBlock(courseIdBySlug, moduleIdBySlug);
  console.log('Done.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
