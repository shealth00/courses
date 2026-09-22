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

// Full 2D + 3D plate catalog per module, extracted from the original
// "USMLE Illustration Portfolio" design-canvas deck (11 modules, 83 plates
// total). storage_path/model_path are relative paths inside their buckets —
// upload matching files later and these rows resolve automatically; until
// then the catalog and 3D viewer show clearly-labeled placeholders.
const ILLUSTRATIONS = {
  cardiovascular: [
    { kind: '2d', title: 'Cardiac Cycle Timeline', description: 'Pressure-volume loop synced to ECG & heart sounds, phase-labeled.', storage_path: 'cardiovascular/cardiac-cycle-timeline.png' },
    { kind: '2d', title: 'Conduction System', description: 'SA→AV→bundle of His→Purkinje, with conduction velocity annotations.', storage_path: 'cardiovascular/conduction-system.png' },
    { kind: '2d', title: 'Congenital Shunt Atlas', description: 'VSD, ASD, PDA, tetralogy of Fallot — flow-direction arrows on schematic chambers.', storage_path: 'cardiovascular/congenital-shunt-atlas.png' },
    { kind: '2d', title: 'Atherosclerosis Progression', description: 'Fatty streak → fibrous cap → rupture, four-panel vessel wall sequence.', storage_path: 'cardiovascular/atherosclerosis-progression.png' },
    { kind: '2d', title: 'Antiarrhythmic Class Map', description: 'Classes I–IV over an action-potential curve, channel targets labeled.', storage_path: 'cardiovascular/antiarrhythmic-class-map.png' },
    { kind: '2d', title: 'Valvular Disease Chart', description: 'Stenosis/regurgitation murmurs mapped to cycle phase and auscultation point.', storage_path: 'cardiovascular/valvular-disease-chart.png' },
    { kind: '2d', title: 'JVP & Heart Sounds', description: 'a-c-v wave correlation with S1–S4 and pathologic variants.', storage_path: 'cardiovascular/jvp-heart-sounds.png' },
    { kind: '2d', title: 'Frank-Starling & Heart Failure', description: 'Preload/contractility curves, HFrEF vs HFpEF shift overlays.', storage_path: 'cardiovascular/frank-starling-heart-failure.png' },
    { kind: '3d', title: 'Four-Chamber Heart, Exploded', description: 'Rotatable chambers with valve layer separable from myocardium and pericardium.', model_path: 'cardiovascular/four-chamber-heart-exploded.glb', storage_path: 'cardiovascular/four-chamber-heart-exploded-poster.png' },
    { kind: '3d', title: 'Coronary Artery Distribution', description: 'LAD/LCx/RCA territories mapped onto a rotating epicardial surface.', model_path: 'cardiovascular/coronary-artery-distribution.glb', storage_path: 'cardiovascular/coronary-artery-distribution-poster.png' },
    { kind: '3d', title: 'Arterial Wall, Layer-Peel', description: 'Intima/media/adventitia peel-away with embedded plaque model.', model_path: 'cardiovascular/arterial-wall-layer-peel.glb', storage_path: 'cardiovascular/arterial-wall-layer-peel-poster.png' },
    { kind: '3d', title: 'Fetal → Neonatal Circulation', description: 'Animatable transition sequence: ductus/foramen closure in 3D space.', model_path: 'cardiovascular/fetal-neonatal-circulation.glb', storage_path: 'cardiovascular/fetal-neonatal-circulation-poster.png' },
  ],
  neuroscience: [
    { kind: '2d', title: 'Corticospinal & DCML Pathways', description: 'Decussation points labeled on a schematic spinal cross-section stack.', storage_path: 'neuroscience/corticospinal-dcml-pathways.png' },
    { kind: '2d', title: 'Brainstem Cross-Sections', description: 'Midbrain/pons/medulla levels with cranial nerve nuclei color-coded.', storage_path: 'neuroscience/brainstem-cross-sections.png' },
    { kind: '2d', title: 'Cranial Nerve Atlas (I–XII)', description: 'Foramen of exit, function, and lesion sign paired per nerve.', storage_path: 'neuroscience/cranial-nerve-atlas-ixii.png' },
    { kind: '2d', title: 'Stroke Syndrome Atlas', description: 'Vascular territory → deficit mapping across MCA/ACA/PCA/lacunar strokes.', storage_path: 'neuroscience/stroke-syndrome-atlas.png' },
    { kind: '2d', title: 'Neurotransmitter Pharm Map', description: 'Receptor subtypes and drug targets at dopaminergic/serotonergic/GABAergic synapses.', storage_path: 'neuroscience/neurotransmitter-pharm-map.png' },
    { kind: '2d', title: 'Visual Field Defect Chart', description: 'Lesion site along the optic pathway mapped to the resulting visual field cut.', storage_path: 'neuroscience/visual-field-defect-chart.png' },
    { kind: '2d', title: 'Basal Ganglia Circuitry', description: 'Direct/indirect pathway diagram, Parkinson\'s vs Huntington\'s shift.', storage_path: 'neuroscience/basal-ganglia-circuitry.png' },
    { kind: '2d', title: 'Seizure Classification Map', description: 'Focal vs generalized onset with EEG correlate panels.', storage_path: 'neuroscience/seizure-classification-map.png' },
    { kind: '3d', title: 'Whole-Brain Transparency Model', description: 'Cortex ghosted to reveal ventricles, basal ganglia, and internal capsule in situ.', model_path: 'neuroscience/whole-brain-transparency-model.glb', storage_path: 'neuroscience/whole-brain-transparency-model-poster.png' },
    { kind: '3d', title: 'White Matter Tract Bundles', description: 'Corticospinal, arcuate fasciculus and corpus callosum as rotatable fiber bundles.', model_path: 'neuroscience/white-matter-tract-bundles.glb', storage_path: 'neuroscience/white-matter-tract-bundles-poster.png' },
    { kind: '3d', title: 'Cerebral Vasculature Cast', description: 'Circle of Willis and branch territories as a standalone vessel-cast model.', model_path: 'neuroscience/cerebral-vasculature-cast.glb', storage_path: 'neuroscience/cerebral-vasculature-cast-poster.png' },
    { kind: '3d', title: 'Spinal Cord, Level-by-Level', description: 'Scrollable segments (C1–S5) each with gray/white matter and tract cross-section.', model_path: 'neuroscience/spinal-cord-level-by-level.glb', storage_path: 'neuroscience/spinal-cord-level-by-level-poster.png' },
  ],
  renal: [
    { kind: '2d', title: 'Nephron Transport Map', description: 'Segment-by-segment transporters (PCT/loop/DCT/collecting duct) with diuretic sites overlaid.', storage_path: 'renal/nephron-transport-map.png' },
    { kind: '2d', title: 'Glomerular Filtration Barrier', description: 'Podocyte/GBM/fenestrated endothelium layers, nephrotic vs nephritic pattern comparison.', storage_path: 'renal/glomerular-filtration-barrier.png' },
    { kind: '2d', title: 'Acid-Base Disturbance Map', description: 'Winter\'s formula nomogram with compensation trajectories labeled.', storage_path: 'renal/acid-base-disturbance-map.png' },
    { kind: '2d', title: 'RAAS Pathway', description: 'Renin→angiotensin→aldosterone cascade with ACEi/ARB/aldosterone antagonist targets.', storage_path: 'renal/raas-pathway.png' },
    { kind: '3d', title: 'Kidney Cutaway Model', description: 'Cortex/medulla/pelvis in coronal section with a single nephron traced in 3D.', model_path: 'renal/kidney-cutaway-model.glb', storage_path: 'renal/kidney-cutaway-model-poster.png' },
    { kind: '3d', title: 'Renal Vascular Architecture', description: 'Afferent/efferent arteriole and peritubular capillary network, rotatable.', model_path: 'renal/renal-vascular-architecture.glb', storage_path: 'renal/renal-vascular-architecture-poster.png' },
  ],
  gi: [
    { kind: '2d', title: 'GI Wall Histology Cross-Section', description: 'Mucosa/submucosa/muscularis/serosa labeled, with regional variation (stomach vs colon) side panels.', storage_path: 'gi/gi-wall-histology-cross-section.png' },
    { kind: '2d', title: 'Portal Circulation & Collaterals', description: 'Portal vein tributaries with portosystemic anastomosis sites (esophageal, umbilical, rectal) marked.', storage_path: 'gi/portal-circulation-collaterals.png' },
    { kind: '2d', title: 'Biliary Tree & Obstruction Sites', description: 'Cystic/common bile/pancreatic duct confluence with gallstone impaction points labeled.', storage_path: 'gi/biliary-tree-obstruction-sites.png' },
    { kind: '2d', title: 'Crohn\'s vs Ulcerative Colitis', description: 'Skip lesions/transmural vs continuous/mucosal pattern, side-by-side bowel schematic.', storage_path: 'gi/crohns-vs-ulcerative-colitis.png' },
    { kind: '2d', title: 'Hepatic Lobule Zonation', description: 'Zones 1–3 with oxygenation gradient and zone-specific injury patterns (toxin vs ischemia).', storage_path: 'gi/hepatic-lobule-zonation.png' },
    { kind: '2d', title: 'GI Hormone Signaling', description: 'Gastrin/CCK/secretin sources and targets along the gut tube.', storage_path: 'gi/gi-hormone-signaling.png' },
    { kind: '3d', title: 'Hepatic Lobule, 3D Sinusoid Model', description: 'Hexagonal lobule with central vein and portal triad in rotatable volumetric form.', model_path: 'gi/hepatic-lobule-3d-sinusoid-model.glb', storage_path: 'gi/hepatic-lobule-3d-sinusoid-model-poster.png' },
    { kind: '3d', title: 'Abdominal Viscera In Situ', description: 'Foregut/midgut/hindgut organs with peritoneal reflections shown as removable layers.', model_path: 'gi/abdominal-viscera-in-situ.glb', storage_path: 'gi/abdominal-viscera-in-situ-poster.png' },
  ],
  endocrine: [
    { kind: '2d', title: 'Hypothalamic-Pituitary Axes', description: 'HPA, HPT, and HPG feedback loops on one comparative three-panel diagram.', storage_path: 'endocrine/hypothalamic-pituitary-axes.png' },
    { kind: '2d', title: 'Pancreatic Islet Signaling', description: 'Beta/alpha/delta cell insulin-glucagon-somatostatin cross-regulation, glucose-sensing detail.', storage_path: 'endocrine/pancreatic-islet-signaling.png' },
    { kind: '2d', title: 'Adrenal Cortex Zonation', description: '"Salt, sugar, sex" zones with hormone products and enzyme steps labeled.', storage_path: 'endocrine/adrenal-cortex-zonation.png' },
    { kind: '2d', title: 'Thyroid Disease Comparison', description: 'Graves\' vs Hashimoto\'s vs toxic nodule, mechanism icons paired with lab pattern table.', storage_path: 'endocrine/thyroid-disease-comparison.png' },
    { kind: '3d', title: 'Pituitary Gland, Anterior/Posterior', description: 'Lobe-separable model showing hypothalamic portal system and hormone-secreting cell types.', model_path: 'endocrine/pituitary-gland-anterior-posterior.glb', storage_path: 'endocrine/pituitary-gland-anterior-posterior-poster.png' },
    { kind: '3d', title: 'Adrenal Gland, Layer-Peel', description: 'Cortex zones and medulla peelable in 3D with vascular supply shown.', model_path: 'endocrine/adrenal-gland-layer-peel.glb', storage_path: 'endocrine/adrenal-gland-layer-peel-poster.png' },
  ],
  musculoskeletal: [
    { kind: '2d', title: 'Brachial Plexus Schematic', description: 'Roots→trunks→divisions→cords→branches with injury-pattern call-outs (Erb\'s, Klumpke\'s).', storage_path: 'musculoskeletal/brachial-plexus-schematic.png' },
    { kind: '2d', title: 'Lumbosacral Plexus Schematic', description: 'Femoral/obturator/sciatic nerve origins with dermatome and myotome cross-reference.', storage_path: 'musculoskeletal/lumbosacral-plexus-schematic.png' },
    { kind: '2d', title: 'Fracture Pattern Atlas', description: 'Colles\', scaphoid, femoral neck, and Salter-Harris types with mechanism arrows.', storage_path: 'musculoskeletal/fracture-pattern-atlas.png' },
    { kind: '2d', title: 'Limb Compartment Cross-Sections', description: 'Anterior/posterior/lateral compartments with nerve-artery-muscle groupings for forearm and leg.', storage_path: 'musculoskeletal/limb-compartment-cross-sections.png' },
    { kind: '3d', title: 'Shoulder Joint, Rotator Cuff', description: 'Glenohumeral joint with SITS muscle layer separable from the capsule and labrum.', model_path: 'musculoskeletal/shoulder-joint-rotator-cuff.glb', storage_path: 'musculoskeletal/shoulder-joint-rotator-cuff-poster.png' },
    { kind: '3d', title: 'Knee Joint, Ligament Layer', description: 'ACL/PCL/MCL/LCL and menisci shown in rotatable exploded-layer form.', model_path: 'musculoskeletal/knee-joint-ligament-layer.glb', storage_path: 'musculoskeletal/knee-joint-ligament-layer-poster.png' },
  ],
  pathology: [
    { kind: '2d', title: 'Reversible → Irreversible Injury', description: 'Branching decision flowchart from cellular stress to necrosis vs apoptosis.', storage_path: 'pathology/reversible-irreversible-injury.png' },
    { kind: '2d', title: 'Acute Inflammation Timeline', description: 'Neutrophil→macrophage sequence with mediator call-outs at each stage.', storage_path: 'pathology/acute-inflammation-timeline.png' },
    { kind: '2d', title: 'Tumor Grading & Staging', description: 'TNM schematic paired with grade-vs-differentiation comparison figure.', storage_path: 'pathology/tumor-grading-staging.png' },
    { kind: '2d', title: 'Wound Healing Phases', description: 'Hemostasis→inflammation→proliferation→remodeling, four-panel sequence.', storage_path: 'pathology/wound-healing-phases.png' },
    { kind: '2d', title: 'Epithelial Tissue Types', description: 'Simple/stratified/pseudostratified, labeled with tissue-of-origin examples.', storage_path: 'pathology/epithelial-tissue-types.png' },
    { kind: '2d', title: 'Classic Malignant Patterns', description: 'Signet ring, Reed-Sternberg, psammoma bodies — illustrated in stylized H&E palette.', storage_path: 'pathology/classic-malignant-patterns.png' },
    { kind: '3d', title: 'Cell Injury, Organelle-Level', description: 'Mitochondrial swelling and membrane blebbing rendered as a rotatable subcellular model.', model_path: 'pathology/cell-injury-organelle-level.glb', storage_path: 'pathology/cell-injury-organelle-level-poster.png' },
    { kind: '3d', title: 'Tumor Invasion & Metastasis', description: 'Basement membrane breach and lymphovascular invasion in layered 3D tissue block.', model_path: 'pathology/tumor-invasion-metastasis.glb', storage_path: 'pathology/tumor-invasion-metastasis-poster.png' },
  ],
  pharmacology: [
    { kind: '2d', title: 'Autonomic Pharmacology Map', description: 'Sympathetic/parasympathetic synapses with receptor subtype and drug class labels.', storage_path: 'pharmacology/autonomic-pharmacology-map.png' },
    { kind: '2d', title: 'Antimicrobial Site-of-Action Wheel', description: 'Cell wall, protein synthesis (30S/50S), DNA gyrase, folate pathway targets on one bacterial cell schematic.', storage_path: 'pharmacology/antimicrobial-site-of-action-wheel.png' },
    { kind: '2d', title: 'Pharmacokinetics Curves', description: 'Zero- vs first-order elimination, loading/maintenance dose derivation graphics.', storage_path: 'pharmacology/pharmacokinetics-curves.png' },
    { kind: '2d', title: 'Coagulation Cascade & Anticoagulants', description: 'Intrinsic/extrinsic pathway with heparin/warfarin/DOAC targets marked.', storage_path: 'pharmacology/coagulation-cascade-anticoagulants.png' },
    { kind: '3d', title: 'GPCR Signal Transduction, 3D', description: 'Ligand binding through G-protein cascade to second messenger, membrane-embedded model.', model_path: 'pharmacology/gpcr-signal-transduction-3d.glb', storage_path: 'pharmacology/gpcr-signal-transduction-3d-poster.png' },
    { kind: '3d', title: 'Bacterial Cell, Layered Cutaway', description: 'Peptidoglycan wall, ribosomes, and nucleoid region with drug-target hotspots highlighted.', model_path: 'pharmacology/bacterial-cell-layered-cutaway.glb', storage_path: 'pharmacology/bacterial-cell-layered-cutaway-poster.png' },
  ],
  immunology: [
    { kind: '2d', title: 'Innate → Adaptive Cascade', description: 'Pathogen encounter through antigen presentation to T/B cell activation, one continuous flow diagram.', storage_path: 'immunology/innate-adaptive-cascade.png' },
    { kind: '2d', title: 'Complement Pathway Map', description: 'Classical, alternative, and lectin pathways converging on C3, MAC formation illustrated.', storage_path: 'immunology/complement-pathway-map.png' },
    { kind: '2d', title: 'Hypersensitivity Types I–IV', description: 'Mechanism icon and classic example paired for each Gell-Coombs type.', storage_path: 'immunology/hypersensitivity-types-iiv.png' },
    { kind: '2d', title: 'Cytokine Source & Target Map', description: 'Th1/Th2/Th17 differentiation cytokines with source cell and downstream effect labeled.', storage_path: 'immunology/cytokine-source-target-map.png' },
    { kind: '3d', title: 'Lymph Node, Zone Cutaway', description: 'Cortex/paracortex/medulla with germinal center detail in rotatable cutaway model.', model_path: 'immunology/lymph-node-zone-cutaway.glb', storage_path: 'immunology/lymph-node-zone-cutaway-poster.png' },
    { kind: '3d', title: 'Immunoglobulin Structure, 3D', description: 'Heavy/light chain and Fab/Fc regions built as a rotatable molecular model, isotypes compared.', model_path: 'immunology/immunoglobulin-structure-3d.glb', storage_path: 'immunology/immunoglobulin-structure-3d-poster.png' },
  ],
  reproductive: [
    { kind: '2d', title: 'Spermatogenesis & Oogenesis', description: 'Meiotic divisions side by side with chromosome-count tracking at each stage.', storage_path: 'reproductive/spermatogenesis-oogenesis.png' },
    { kind: '2d', title: 'Female Pelvic Anatomy Schematic', description: 'Broad/round/uterosacral ligament relationships with ureter crossing point highlighted.', storage_path: 'reproductive/female-pelvic-anatomy-schematic.png' },
    { kind: '2d', title: 'Embryonic Folding Sequence', description: 'Trilaminar disc through lateral and cephalocaudal folding, four-stage progression.', storage_path: 'reproductive/embryonic-folding-sequence.png' },
    { kind: '2d', title: 'Congenital Malformation Atlas', description: 'Neural tube defects, omphalocele/gastroschisis, and tracheoesophageal fistula variants illustrated.', storage_path: 'reproductive/congenital-malformation-atlas.png' },
    { kind: '2d', title: 'Genital Duct Derivatives', description: 'Wolffian/Mullerian duct fate map under SRY and hormone influence, male vs female branching.', storage_path: 'reproductive/genital-duct-derivatives.png' },
    { kind: '3d', title: 'Female Pelvis, Layer-Peel Model', description: 'Uterus/adnexa/bladder/rectum relationships in a rotatable, layer-separable pelvic model.', model_path: 'reproductive/female-pelvis-layer-peel-model.glb', storage_path: 'reproductive/female-pelvis-layer-peel-model-poster.png' },
    { kind: '3d', title: 'Embryonic Folding, Animated 3D', description: 'Flat disc-to-tube folding sequence rendered as a rotatable, steppable 3D model.', model_path: 'reproductive/embryonic-folding-animated-3d.glb', storage_path: 'reproductive/embryonic-folding-animated-3d-poster.png' },
  ],
  'step2-clinical': [
    { kind: '2d', title: 'Surgical Approach Diagrams', description: 'Incision lines and anatomic landmarks for appendectomy, cholecystectomy, hernia repair.', storage_path: 'step2-clinical/surgical-approach-diagrams.png' },
    { kind: '2d', title: 'Imaging Correlation Panels', description: 'Line-art anatomy overlaid on stylized CT/MRI cross-section for landmark recognition.', storage_path: 'step2-clinical/imaging-correlation-panels.png' },
    { kind: '2d', title: 'Clinical Decision Algorithms', description: 'Chest pain, acute abdomen, and altered mental status branching workup flowcharts.', storage_path: 'step2-clinical/clinical-decision-algorithms.png' },
    { kind: '2d', title: 'Procedural Step Sequences', description: 'Lumbar puncture, central line placement, and chest tube insertion in sequential panels.', storage_path: 'step2-clinical/procedural-step-sequences.png' },
    { kind: '3d', title: 'Regional Surgical Anatomy, 3D', description: 'Layer-peelable abdominal wall exposing target organ and surrounding neurovascular structures.', model_path: 'step2-clinical/regional-surgical-anatomy-3d.glb', storage_path: 'step2-clinical/regional-surgical-anatomy-3d-poster.png' },
    { kind: '3d', title: 'Trauma Assessment Views', description: 'FAST exam probe windows rendered on a 3D torso with underlying organ correlation.', model_path: 'step2-clinical/trauma-assessment-views.glb', storage_path: 'step2-clinical/trauma-assessment-views-poster.png' },
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

const PATHWAYS = {
  atherosclerosis: {
    title: 'Atherosclerosis',
    module: 'cardiovascular',
    summary: 'Endothelial injury through plaque rupture — the mechanism behind the "Atherosclerosis Progression" plate, step by step.',
    steps: [
      { label: 'Endothelial dysfunction', description: 'Chronic injury from shear stress, hypertension, smoking, or hyperglycemia disrupts the endothelial barrier.' },
      { label: 'LDL enters intima', description: 'Modified/oxidized LDL crosses the dysfunctional endothelium into the subendothelial space.' },
      { label: 'LDL oxidation', description: 'Oxidized LDL is immunogenic and directly cytotoxic to the vessel wall.' },
      { label: 'Monocyte adhesion', description: 'Endothelial adhesion molecules (VCAM-1) recruit circulating monocytes to the injured surface.',
        drug_intervention: 'Statins improve endothelial function and reduce LDL substrate available for this step.' },
      { label: 'Macrophage recruitment', description: 'Adherent monocytes migrate into the intima and differentiate into macrophages.' },
      { label: 'Foam cell formation', description: 'Macrophages engulf oxidized LDL via scavenger receptors, becoming lipid-laden foam cells.' },
      { label: 'Fatty streak', description: 'Accumulated foam cells form the earliest grossly visible atherosclerotic lesion.' },
      { label: 'Smooth muscle migration', description: 'Smooth muscle cells migrate from the media into the intima and proliferate.' },
      { label: 'Fibrous cap formation', description: 'Smooth muscle cells secrete collagen, forming a fibrous cap over the lipid core.' },
      { label: 'Plaque', description: 'A mature atherosclerotic plaque — lipid core plus fibrous cap — narrows the arterial lumen.' },
      { label: 'Rupture', description: 'Cap thinning, often from macrophage-derived matrix metalloproteinases, leads to plaque rupture.' },
      { label: 'Thrombus', description: 'Exposed subendothelial collagen triggers platelet aggregation and thrombosis, causing acute vessel occlusion.',
        drug_intervention: 'Antiplatelet agents (aspirin, P2Y12 inhibitors) and anticoagulants act at this final step.' },
    ],
  },
};

async function seedPathways(moduleIdBySlug) {
  let total = 0;
  for (const [slug, pathway] of Object.entries(PATHWAYS)) {
    const { data: row, error: pErr } = await supabase
      .from('pathways')
      .upsert(
        {
          slug,
          title: pathway.title,
          summary: pathway.summary,
          module_id: moduleIdBySlug[pathway.module] || null,
          sort_order: total + 1,
        },
        { onConflict: 'slug' }
      )
      .select()
      .single();
    if (pErr) throw pErr;

    const { error: delErr } = await supabase.from('pathway_steps').delete().eq('pathway_id', row.id);
    if (delErr) throw delErr;

    const stepRows = pathway.steps.map((s, i) => ({
      pathway_id: row.id,
      position: i + 1,
      label: s.label,
      description: s.description || null,
      drug_intervention: s.drug_intervention || null,
    }));
    const { error: stepErr } = await supabase.from('pathway_steps').insert(stepRows);
    if (stepErr) throw stepErr;
    total += 1;
  }
  console.log(`Seeded ${total} pathway(s).`);
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
    { label: 'A', choice_text: 'Inferior wall', is_correct: false,
      explanation: 'The inferior wall is supplied by the right coronary artery (or a dominant LCx), not the LAD — a proximal LAD lesion spares this territory.' },
    { label: 'B', choice_text: 'Anteroseptal wall', is_correct: true,
      explanation: 'Correct — the LAD supplies the anterior left ventricular wall and the anterior two-thirds of the interventricular septum via its septal perforator branches.' },
    { label: 'C', choice_text: 'Posterior wall', is_correct: false,
      explanation: 'The posterior wall is typically supplied by the posterior descending artery, usually a branch of the RCA (right-dominant circulation) — outside LAD territory.' },
    { label: 'D', choice_text: 'Lateral wall', is_correct: false,
      explanation: 'The lateral wall is chiefly supplied by the left circumflex artery (obtuse marginal branches), not the LAD.' },
    { label: 'E', choice_text: 'Right ventricular free wall', is_correct: false,
      explanation: 'The RV free wall is supplied by right marginal branches of the RCA, not the LAD.' },
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
  await seedPathways(moduleIdBySlug);
  await seedSampleQBankBlock(courseIdBySlug, moduleIdBySlug);
  console.log('Done.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
