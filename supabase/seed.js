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
  'diabetic-ketoacidosis': {
    title: 'Diabetic Ketoacidosis (DKA)',
    module: 'endocrine',
    summary: 'Absolute insulin deficiency to life-threatening ketoacidosis — the hormonal and metabolic cascade behind DKA, step by step.',
    steps: [
      { label: 'Absolute/severe insulin deficiency', description: 'New-onset type 1 diabetes, insulin non-adherence, or a physiologic stressor (infection, MI, surgery) in a type 1 diabetic leaves insulin critically insufficient to oppose counter-regulatory hormones.' },
      { label: 'Counter-regulatory hormone surge', description: 'Glucagon, catecholamines, cortisol, and growth hormone rise unopposed, each pushing serum glucose upward.' },
      { label: 'Unrestrained hepatic glucose output', description: 'Low insulin and high glucagon accelerate hepatic glycogenolysis and gluconeogenesis, driving plasma glucose progressively higher.' },
      { label: 'Impaired peripheral glucose uptake', description: 'Without insulin, skeletal muscle and adipose tissue cannot translocate GLUT4 transporters, so circulating glucose cannot be cleared into cells.' },
      { label: 'Osmotic diuresis', description: 'Once the renal glucose threshold is exceeded, glucose spills into the urine and osmotically drags water, sodium, potassium, and phosphate out with it.' },
      { label: 'Volume depletion', description: 'Progressive dehydration reduces effective circulating volume and glomerular filtration rate, impairing renal clearance of glucose and ketoacids and worsening both hyperglycemia and acidosis.',
        drug_intervention: 'IV isotonic saline is first-line: restoring perfusion and GFR improves renal clearance of glucose and ketoacids even before insulin is started.' },
      { label: 'Unrestrained lipolysis', description: 'Low insulin activates hormone-sensitive lipase in adipocytes, releasing free fatty acids into the circulation.' },
      { label: 'Hepatic ketogenesis', description: 'Free fatty acids taken up by the liver are shunted into mitochondrial beta-oxidation (unopposed CPT-1 activity) and converted to the ketone bodies beta-hydroxybutyrate and acetoacetate.' },
      { label: 'Anion-gap metabolic acidosis', description: 'Accumulating ketoacids consume serum bicarbonate buffer, producing a high anion-gap metabolic acidosis.' },
      { label: 'Kussmaul respirations', description: 'The respiratory center senses the acidemia and drives deep, rapid compensatory breathing to blow off CO2 and raise arterial pH.' },
      { label: 'Total-body potassium depletion', description: 'Acidosis and insulin deficiency shift potassium out of cells, so serum potassium can appear normal or even high, masking substantial total-body potassium losses from osmotic diuresis.',
        drug_intervention: 'IV regular insulin shuts off lipolysis and ketogenesis and drives glucose and potassium back into cells — but must be paired with potassium repletion, since insulin will unmask the underlying total-body deficit and can precipitate dangerous hypokalemia.' },
      { label: 'Obtundation and cerebral edema risk', description: 'Severe hyperosmolarity and acidosis can impair mental status, and rapid osmotic shifts during correction carry a risk of cerebral edema, particularly in pediatric patients.' },
    ],
  },
  'heart-failure-hfref': {
    title: 'Heart Failure (HFrEF): The Neurohormonal Cascade',
    module: 'cardiovascular',
    summary: 'From an initial drop in ejection fraction to the self-amplifying neurohormonal cascade of HFrEF — and where guideline-directed therapy interrupts it.',
    steps: [
      { label: 'Initial myocardial injury or overload', description: 'Myocardial infarction, chronic hypertension, or valvular disease reduces effective contractility or raises chronic wall stress, lowering stroke volume and ejection fraction.' },
      { label: 'Fall in cardiac output', description: 'Reduced stroke volume drops arterial filling and effective circulating blood volume, sensed by carotid and aortic arch baroreceptors as a fall in pressure.' },
      { label: 'Sympathetic activation', description: 'Decreased baroreceptor firing disinhibits the medullary vasomotor center, increasing sympathetic outflow to raise heart rate, contractility, and systemic vascular resistance.',
        drug_intervention: 'Beta-blockers (e.g., carvedilol, metoprolol succinate) blunt this chronic catecholamine surge, protecting the failing myocardium from its toxic, pro-arrhythmic, pro-remodeling effects.' },
      { label: 'Renin-angiotensin-aldosterone activation', description: 'Reduced renal perfusion pressure and direct beta-1 stimulation of juxtaglomerular cells trigger renin release, generating angiotensin II via ACE.',
        drug_intervention: 'ACE inhibitors and ARBs interrupt this axis, reducing angiotensin II-mediated vasoconstriction, aldosterone release, and cardiac remodeling.' },
      { label: 'Aldosterone-driven sodium and water retention', description: 'Angiotensin II stimulates aldosterone secretion, increasing distal nephron sodium reabsorption, while non-osmotic ADH release adds free water retention.' },
      { label: 'Increased preload', description: 'Expanded intravascular volume raises venous return and ventricular filling pressure, initially supporting stroke volume via the Frank-Starling mechanism.' },
      { label: 'Neurohormonal trophic signaling', description: 'Sustained exposure to angiotensin II, aldosterone, and catecholamines directly stimulates myocyte hypertrophy and interstitial fibrosis, independent of hemodynamic load.' },
      { label: 'Maladaptive ventricular remodeling', description: 'The ventricle dilates and becomes more spherical, with myocyte apoptosis and fibrosis reducing contractile efficiency.' },
      { label: 'Further decline in ejection fraction', description: 'Remodeled myocardium generates less force per unit of fiber shortening, dropping cardiac output further and re-triggering the cascade from step 2 in a self-amplifying cycle.' },
      { label: 'Elevated filling pressures transmitted backward', description: 'A stiffer, dilated ventricle cannot accommodate venous return without a disproportionate rise in end-diastolic pressure, which backs up into the pulmonary circulation (left heart failure) or systemic venous circulation (right heart failure).' },
      { label: 'Congestive symptoms and hypoperfusion', description: 'Pulmonary edema (dyspnea, orthopnea, paroxysmal nocturnal dyspnea) and systemic congestion (jugular venous distension, hepatomegaly, peripheral edema) develop, alongside fatigue and exertional intolerance from chronically low forward output.' },
    ],
  },
  'peptic-ulcer-disease': {
    title: 'Peptic Ulcer Disease: H. pylori-Mediated Mucosal Injury',
    module: 'gi',
    summary: 'How H. pylori breaches gastric mucosal defenses and drives ulcer formation — and where acid suppression and eradication therapy intervene.',
    steps: [
      { label: 'H. pylori colonization', description: 'Flagellated H. pylori penetrate the gastric mucus layer and use urease to locally buffer acidity, allowing survival within the otherwise hostile gastric lumen.' },
      { label: 'Urease-driven ammonia production', description: 'Bacterial urease hydrolyzes host urea into ammonia and CO2; the ammonia neutralizes surrounding acid but is directly cytotoxic to gastric epithelial cells.' },
      { label: 'Mucus layer degradation', description: 'Bacterial proteases, lipases, and mucinase activity thin the protective mucus-bicarbonate layer overlying the epithelium.' },
      { label: 'Epithelial adhesion and cytotoxin delivery', description: 'H. pylori adheres via outer membrane adhesins (e.g., BabA) and injects CagA through a type IV secretion system, while VacA forms vacuolating pores in epithelial cell membranes.' },
      { label: 'Chronic active gastritis', description: 'Epithelial injury and CagA/VacA signaling trigger IL-8 release, recruiting neutrophils and mononuclear cells and establishing a chronic inflammatory infiltrate.' },
      { label: 'Impaired mucosal defense', description: 'The combination of a thinned mucus layer, epithelial injury, and ongoing inflammation compromises the barrier that normally resists retrodiffusing gastric acid and pepsin.' },
      { label: 'Altered acid secretion', description: 'In antral-predominant infection, loss of somatostatin-producing D cells disinhibits gastrin release, increasing acid output and duodenal acid load, which favors duodenal ulcer formation.' },
      { label: 'Acid-pepsin digestion of the weakened mucosa', description: 'With mucosal defenses down and, in antral disease, acid output up, hydrochloric acid and pepsin progressively erode the compromised mucosa.',
        drug_intervention: 'Proton pump inhibitors irreversibly block the parietal cell H+/K+-ATPase, sharply reducing the acid available to injure the already-compromised mucosa and allowing the ulcer bed to heal.' },
      { label: 'Breach of the muscularis mucosae', description: 'Erosion extending beyond the muscularis mucosae defines a true ulcer, as opposed to a superficial mucosal erosion.' },
      { label: 'Ulcer complications', description: 'Continued deep erosion can erode into a submucosal vessel, causing GI bleeding, or perforate the gastric or duodenal wall, causing peritonitis — the two feared complications of untreated PUD.',
        drug_intervention: 'Triple or quadruple H. pylori eradication therapy (a PPI plus antibiotics such as amoxicillin, clarithromycin, or metronidazole and bismuth) removes the inciting organism, the definitive step that interrupts the cycle upstream of everything that follows.' },
    ],
  },
  anaphylaxis: {
    title: 'Anaphylaxis: Type I Hypersensitivity in Real Time',
    module: 'immunology',
    summary: 'From first antigen exposure to systemic mast cell degranulation and distributive shock — the type I hypersensitivity mechanism behind anaphylaxis.',
    steps: [
      { label: 'Sensitization on first exposure', description: 'An allergen (food, venom, drug, latex) is processed by antigen-presenting cells and drives a Th2-skewed response, with IL-4 promoting B cell class-switching to allergen-specific IgE.' },
      { label: 'IgE arms mast cells and basophils', description: 'Allergen-specific IgE binds high-affinity FcεRI receptors on mast cells and basophils, priming them without yet causing symptoms.' },
      { label: 'Re-exposure and antigen cross-linking', description: 'On a subsequent exposure, the same allergen binds and cross-links adjacent surface-bound IgE molecules on primed cells.' },
      { label: 'Mast cell and basophil degranulation', description: 'Cross-linking triggers FcεRI signaling and rapid degranulation, releasing preformed mediators — histamine, tryptase, heparin — within minutes.' },
      { label: 'Histamine-mediated vascular effects', description: 'Histamine acts on H1 receptors on vascular endothelium, causing vasodilation and increased capillary permeability with fluid shift out of the vasculature.' },
      { label: 'De novo mediator synthesis', description: 'Activated mast cells also synthesize new lipid mediators — leukotrienes C4/D4/E4 and prostaglandin D2 — from membrane phospholipids, amplifying and prolonging the reaction.' },
      { label: 'Bronchoconstriction and airway edema', description: 'Histamine and leukotrienes contract bronchial smooth muscle and increase mucus secretion, narrowing the lower airway, while laryngeal and pharyngeal edema can obstruct the upper airway directly.' },
      { label: 'Systemic vasodilation and capillary leak', description: 'Widespread mast cell activation causes diffuse vasodilation, dropping systemic vascular resistance, while capillary leak reduces effective circulating volume.' },
      { label: 'Distributive shock', description: 'The combination of low systemic vascular resistance and relative hypovolemia produces hypotension that is refractory to positioning alone — the hemodynamic hallmark of anaphylactic shock.',
        drug_intervention: 'Intramuscular epinephrine is first-line and acts at exactly this step: alpha-1 agonism reverses vasodilation and edema, while beta-1/beta-2 agonism supports cardiac output and bronchodilation.' },
      { label: 'Cutaneous and mucosal manifestations', description: 'Histamine-driven vasodilation and permeability changes also produce urticaria, flushing, and angioedema, often the earliest visible signs of the reaction.' },
      { label: 'Late-phase (biphasic) reaction', description: 'Recruited eosinophils and Th2 cytokines can drive a second wave of symptoms four to twelve or more hours after apparent resolution.',
        drug_intervention: 'H1-antihistamines and glucocorticoids are adjunctive: antihistamines blunt histamine-mediated symptoms and glucocorticoids are thought to reduce the risk and severity of this late-phase reinflammation, though neither substitutes for epinephrine.' },
    ],
  },
  'cap-to-sepsis': {
    title: 'Community-Acquired Pneumonia to Sepsis',
    module: 'pathology',
    summary: 'From alveolar infection to systemic inflammatory collapse — how untreated or overwhelming CAP progresses through the stages of sepsis, and where antibiotics and hemodynamic support intervene.',
    steps: [
      { label: 'Aspiration/inhalation of a pathogen', description: 'A virulent or high-inoculum organism, classically Streptococcus pneumoniae, overwhelms mucociliary clearance and the cough reflex, reaching the distal airways and alveoli.' },
      { label: 'Alveolar colonization', description: 'The organism adheres to and proliferates on the alveolar epithelium, evading initial innate defenses such as surfactant proteins and resident alveolar macrophages.' },
      { label: 'Innate immune activation', description: 'Alveolar macrophages recognize pathogen-associated molecular patterns via pattern recognition receptors (e.g., TLRs), releasing TNF-alpha, IL-1, and IL-6.' },
      { label: 'Neutrophil recruitment and exudation', description: 'Cytokine signaling upregulates endothelial adhesion molecules, recruiting neutrophils into the alveolar space; capillary leak floods alveoli with protein-rich exudate, the classic "red hepatization" of lobar pneumonia.' },
      { label: 'Impaired gas exchange', description: 'Exudate- and neutrophil-filled alveoli cannot participate in gas exchange, producing ventilation-perfusion mismatch and hypoxemia.' },
      { label: 'Breach into the bloodstream', description: 'If local containment fails, organisms and their toxins (e.g., pneumolysin, or LPS in gram-negative CAP) cross the alveolar-capillary barrier and enter the systemic circulation as bacteremia.',
        drug_intervention: 'Early empiric antibiotics targeted at likely CAP pathogens are the single highest-yield intervention, ideally given before this step completes, to prevent progression to bloodstream infection.' },
      { label: 'Systemic cytokine release', description: 'Circulating pathogen products trigger a body-wide innate response, with monocytes, macrophages, and endothelium throughout the body releasing TNF-alpha, IL-1, and IL-6 — the systemic inflammatory response.' },
      { label: 'Widespread endothelial activation', description: 'Systemic cytokines cause endothelial dysfunction, vasodilation, and capillary leak throughout the vasculature, not just in the lung.' },
      { label: 'Coagulation cascade activation', description: 'Inflammatory cytokines upregulate tissue factor on endothelium and monocytes while downregulating natural anticoagulants (protein C, antithrombin), tipping systemic hemostasis toward microvascular thrombosis and, in severe cases, DIC.' },
      { label: 'Sepsis (organ dysfunction)', description: 'Maldistributed blood flow, microvascular thrombosis, and direct cytokine effects on organs produce measurable dysfunction — rising creatinine, altered mental status, elevated lactate, coagulopathy — meeting the definitional threshold for sepsis.' },
      { label: 'Septic shock', description: 'Profound vasodilation and capillary leak drop systemic vascular resistance and effective circulating volume faster than the heart can compensate, producing hypotension that persists despite adequate fluid resuscitation.',
        drug_intervention: 'Norepinephrine is the first-line vasopressor once fluids alone are inadequate, acting via alpha-1-mediated vasoconstriction to restore mean arterial pressure.' },
      { label: 'Multi-organ dysfunction', description: 'Sustained hypoperfusion together with unchecked inflammation and coagulopathy progressively injures the kidneys, liver, lungs (ARDS), and CNS — the end stage of the cascade if it is not reversed.' },
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

// ---------------------------------------------------------------------------
// Real, original USMLE-style content for the other 10 modules (one block per
// module, 4 fully worked clinical-vignette questions each). Mirrors the shape
// and tone of seedSampleQBankBlock() above — every choice gets its own
// "why right / why wrong" explanation. step2-clinical questions are written
// in Step 2 CK management-reasoning style rather than pure basic science.
// ---------------------------------------------------------------------------
const QBANK_MODULE_BLOCKS = [
  {
    course: 'step1',
    module: 'neuroscience',
    slug: 'neuroscience-block-1',
    title: 'Neuroscience — Block 1',
    description: 'A sample timed block covering vascular neuroanatomy, movement disorders, spinal cord tracts, and visual pathways.',
    questions: [
      {
        stem: `A 62-year-old man is brought to the emergency department after the acute onset of vertigo, nausea, and difficulty swallowing. Examination shows dysarthria, decreased pain and temperature sensation on the left side of his face and the right side of his body, ipsilateral limb ataxia, and a left-sided ptosis and miosis. Vital signs are within normal limits.`,
        lead_in: `Occlusion of which of the following arteries is the most likely cause of this presentation?`,
        system_tag: 'Neurology',
        difficulty: 'medium',
        explanation: `Lateral medullary (Wallenberg) syndrome results from posterior inferior cerebellar artery (PICA) occlusion. Infarction of the nucleus ambiguus causes dysarthria/dysphagia; the spinal trigeminal nucleus/tract causes ipsilateral facial pain/temperature loss; the spinothalamic tract causes contralateral body pain/temperature loss; the inferior cerebellar peduncle causes ipsilateral ataxia; and descending sympathetic fibers cause an ipsilateral Horner syndrome.`,
        educational_objective: `Recognize lateral medullary (Wallenberg) syndrome as a crossed sensory deficit from PICA occlusion and localize each finding to its underlying medullary structure.`,
        references: `First Aid for the USMLE Step 1 — Neurology: Brainstem vascular syndromes.`,
        choices: [
          { label: 'A', choice_text: 'Posterior inferior cerebellar artery', is_correct: true,
            explanation: `Correct — PICA supplies the lateral medulla; occlusion produces exactly this crossed sensory/ataxia/Horner pattern.` },
          { label: 'B', choice_text: 'Anterior inferior cerebellar artery', is_correct: false,
            explanation: `AICA occlusion causes lateral pontine syndrome, which additionally includes ipsilateral facial paralysis and hearing loss (facial and vestibulocochlear nuclei lie in the pons, not the medulla).` },
          { label: 'C', choice_text: 'Anterior spinal artery', is_correct: false,
            explanation: `ASA occlusion at the medullary level causes medial medullary syndrome: contralateral hemiparesis, contralateral loss of proprioception, and ipsilateral tongue deviation — a different pattern entirely.` },
          { label: 'D', choice_text: 'Basilar artery (apex)', is_correct: false,
            explanation: `Basilar apex occlusion causes bilateral findings (e.g., locked-in syndrome or bilateral thalamic/midbrain infarcts), not this unilateral lateral medullary picture.` },
          { label: 'E', choice_text: 'Middle cerebral artery', is_correct: false,
            explanation: `MCA occlusion causes contralateral face/arm-predominant hemiparesis and hemisensory loss (plus aphasia if the dominant hemisphere is involved), not a crossed brainstem sensory pattern.` },
        ],
      },
      {
        stem: `A 45-year-old woman presents with a 2-year history of involuntary, irregular, dance-like movements of her limbs and trunk, along with progressive irritability and difficulty concentrating. Her father died in a psychiatric facility with a similar illness. MRI shows atrophy of the caudate nucleus with ex vacuo dilation of the frontal horns of the lateral ventricles.`,
        lead_in: `Loss of which of the following neurotransmitters in the striatum is most directly responsible for this patient's movement abnormality?`,
        system_tag: 'Neurology',
        difficulty: 'medium',
        explanation: `Huntington disease is an autosomal dominant CAG trinucleotide-repeat disorder causing selective loss of GABAergic (and cholinergic) medium spiny neurons in the caudate/putamen that normally project via the indirect pathway to the external globus pallidus. Loss of this inhibitory GABAergic output disinhibits the thalamus, producing hyperkinetic chorea.`,
        educational_objective: `Link the neurodegeneration in Huntington disease (loss of striatal GABAergic neurons of the indirect pathway) to the resulting hyperkinetic chorea.`,
        references: `First Aid for the USMLE Step 1 — Neurology: Basal ganglia circuits and movement disorders.`,
        choices: [
          { label: 'A', choice_text: 'GABA', is_correct: true,
            explanation: `Correct — loss of GABAergic indirect-pathway striatal neurons disinhibits the thalamus, producing chorea.` },
          { label: 'B', choice_text: 'Dopamine', is_correct: false,
            explanation: `Dopaminergic neuron loss (substantia nigra) causes the hypokinetic features of Parkinson disease — the opposite clinical direction from Huntington chorea.` },
          { label: 'C', choice_text: 'Serotonin', is_correct: false,
            explanation: `Serotonin depletion is linked to mood disorders, not to the striatal circuitry responsible for chorea.` },
          { label: 'D', choice_text: 'Glutamate', is_correct: false,
            explanation: `Excess, not loss, of corticostriatal glutamatergic signaling contributes to excitotoxic neuronal loss in Huntington disease — glutamate itself is not deficient.` },
          { label: 'E', choice_text: 'Norepinephrine', is_correct: false,
            explanation: `Norepinephrine pathways govern arousal and mood; their loss is not implicated in chorea.` },
        ],
      },
      {
        stem: `A 54-year-old man develops sudden bilateral leg weakness and loss of pain and temperature sensation below the umbilicus after a complicated aortic aneurysm repair. Vibration and proprioceptive sensation in the lower extremities are preserved. Deep tendon reflexes are initially diminished.`,
        lead_in: `Infarction in which of the following vascular territories best explains this presentation?`,
        system_tag: 'Neurology',
        difficulty: 'medium',
        explanation: `This is classic anterior spinal artery syndrome, often following aortic surgery (hypotension/cross-clamping compromising perfusion via the artery of Adamkiewicz). It produces bilateral corticospinal (motor) and spinothalamic (pain/temperature) deficits below the lesion, with sparing of posterior column-mediated vibration/proprioception, since the posterior spinal arteries are a separate, richly collateralized supply.`,
        educational_objective: `Recognize anterior spinal artery syndrome — bilateral motor and spinothalamic loss with sparing of dorsal column sensation — as a complication of aortic surgery.`,
        references: `First Aid for the USMLE Step 1 — Neurology: Spinal cord vascular supply and cord syndromes.`,
        choices: [
          { label: 'A', choice_text: 'Anterior spinal artery', is_correct: true,
            explanation: `Correct — supplies the anterior two-thirds of the cord (corticospinal and spinothalamic tracts) and spares the dorsal columns.` },
          { label: 'B', choice_text: 'Posterior spinal artery', is_correct: false,
            explanation: `Supplies the dorsal columns; its occlusion would cause loss of vibration/proprioception with sparing of motor and pain/temperature — the opposite pattern.` },
          { label: 'C', choice_text: 'Vertebral artery', is_correct: false,
            explanation: `Supplies the medulla and gives rise to the ASA/PICA proximally; its occlusion causes brainstem infarction, not a thoracolumbar cord syndrome.` },
          { label: 'D', choice_text: 'Great radicular artery (of Adamkiewicz)', is_correct: false,
            explanation: `This segmental feeder (typically T9–T12) supplies the anterior spinal artery in the lower cord and is the vessel often compromised during aortic surgery — but the infarcted vascular territory itself is the anterior spinal artery distribution, not this feeder vessel per se.` },
          { label: 'E', choice_text: 'Basilar artery', is_correct: false,
            explanation: `Supplies the brainstem and cerebellum, not the spinal cord below the cervicomedullary junction.` },
        ],
      },
      {
        stem: `A 39-year-old woman presents with headaches and progressive loss of peripheral vision. She also reports irregular menses and a milky nipple discharge for the past year. Visual field testing reveals loss of the temporal fields bilaterally, with intact central and nasal fields.`,
        lead_in: `A lesion at which of the following locations best explains this patient's visual field deficit?`,
        system_tag: 'Neurology',
        difficulty: 'easy',
        explanation: `A prolactinoma (pituitary macroadenoma) compressing the optic chiasm from below classically damages the decussating nasal retinal fibers, which carry temporal visual field information from each eye, producing bitemporal hemianopia. The prolactin excess explains the galactorrhea and amenorrhea.`,
        educational_objective: `Localize bitemporal hemianopia to a chiasmal lesion (classically a pituitary macroadenoma) and correlate with prolactin excess symptoms.`,
        references: `First Aid for the USMLE Step 1 — Neurology: Visual field defects and lesion localization.`,
        choices: [
          { label: 'A', choice_text: 'Optic chiasm', is_correct: true,
            explanation: `Correct — compression here damages the crossing nasal retinal fibers, producing bitemporal hemianopia.` },
          { label: 'B', choice_text: 'Optic nerve (unilateral)', is_correct: false,
            explanation: `A unilateral optic nerve lesion causes monocular vision loss, not a bitemporal pattern affecting both eyes.` },
          { label: 'C', choice_text: 'Optic tract', is_correct: false,
            explanation: `A postchiasmal optic tract lesion causes a contralateral homonymous hemianopia, not a bitemporal defect.` },
          { label: 'D', choice_text: 'Optic radiations (Meyer loop)', is_correct: false,
            explanation: `Meyer loop lesions cause a contralateral homonymous superior quadrantanopia, not bitemporal loss.` },
          { label: 'E', choice_text: 'Primary visual (calcarine) cortex', is_correct: false,
            explanation: `Occipital cortex lesions cause contralateral homonymous hemianopia, often with macular sparing — not a bitemporal defect.` },
        ],
      },
    ],
  },
  {
    course: 'step1',
    module: 'renal',
    slug: 'renal-block-1',
    title: 'Renal, Fluid & Acid-Base — Block 1',
    description: 'A sample timed block covering nephrotic syndrome, renal tubular acidosis, acid-base disturbances, and diuretic pharmacology.',
    questions: [
      {
        stem: `A 4-year-old boy is brought in for periorbital and lower extremity edema that his parents first noticed 3 days ago. Urinalysis shows 4+ proteinuria without hematuria or red cell casts. Serum albumin is low and cholesterol is elevated. A renal biopsy is performed; light microscopy is normal, and immunofluorescence is negative.`,
        lead_in: `Which of the following is the most likely finding on electron microscopy?`,
        system_tag: 'Renal',
        difficulty: 'easy',
        explanation: `Minimal change disease is the most common cause of nephrotic syndrome in children, characterized by normal light microscopy, negative immunofluorescence, and diffuse podocyte foot process effacement on EM, thought to result from a circulating factor causing cytokine-mediated podocyte injury (often following a viral infection). It is typically markedly steroid-responsive.`,
        educational_objective: `Recognize minimal change disease as the leading cause of pediatric nephrotic syndrome and identify foot process effacement as its defining EM finding.`,
        references: `First Aid for the USMLE Step 1 — Renal: Nephrotic syndromes.`,
        choices: [
          { label: 'A', choice_text: 'Diffuse effacement of podocyte foot processes', is_correct: true,
            explanation: `Correct — the defining ultrastructural finding of minimal change disease, with otherwise unremarkable light microscopy and negative immunofluorescence.` },
          { label: 'B', choice_text: '"Spike and dome" subepithelial deposits', is_correct: false,
            explanation: `This describes membranous nephropathy, which typically shows granular immunofluorescence, not the negative IF seen here.` },
          { label: 'C', choice_text: 'Subendothelial "wire loop" deposits', is_correct: false,
            explanation: `Characteristic of lupus nephritis (class IV), which would also show strong immunofluorescence staining, not a negative result.` },
          { label: 'D', choice_text: 'Splitting of the glomerular basement membrane ("tram-tracking")', is_correct: false,
            explanation: `Seen in membranoproliferative glomerulonephritis, typically with immune complex deposits on immunofluorescence.` },
          { label: 'E', choice_text: 'Mesangial IgA deposits', is_correct: false,
            explanation: `Diagnostic of IgA nephropathy, which would show positive (not negative) immunofluorescence and usually presents with hematuria.` },
        ],
      },
      {
        stem: `A 31-year-old woman with a history of Sjögren syndrome presents with generalized weakness. Labs show serum sodium 138 mEq/L, potassium 2.9 mEq/L, chloride 112 mEq/L, and bicarbonate 15 mEq/L. Arterial blood gas confirms a non-anion gap metabolic acidosis. Urine pH is 6.2 despite the systemic acidemia. Renal ultrasound shows bilateral nephrocalcinosis.`,
        lead_in: `A defect in which of the following processes is the most likely cause of this patient's acid-base disturbance?`,
        system_tag: 'Renal',
        difficulty: 'hard',
        explanation: `This patient has distal (type 1) renal tubular acidosis, an autoimmune-associated (Sjögren syndrome) failure of alpha-intercalated cells to secrete H+ into the collecting duct lumen. The inability to acidify the urine (pH persistently >5.5 despite systemic acidosis) leads to a hyperchloremic non-anion gap metabolic acidosis, hypokalemia (from resulting hyperaldosteronism-driven potassium wasting), and nephrocalcinosis from the alkaline, calcium-phosphate-rich urine.`,
        educational_objective: `Distinguish distal (type 1) RTA — impaired distal H+ secretion causing hypokalemia, high urine pH, and nephrocalcinosis — from proximal and type 4 RTA.`,
        references: `First Aid for the USMLE Step 1 — Renal: Renal tubular acidosis.`,
        choices: [
          { label: 'A', choice_text: 'Hydrogen ion secretion by alpha-intercalated cells of the collecting duct', is_correct: true,
            explanation: `Correct — the defect in type 1 (distal) RTA, producing an inappropriately high urine pH despite systemic acidemia.` },
          { label: 'B', choice_text: 'Bicarbonate reabsorption in the proximal convoluted tubule', is_correct: false,
            explanation: `This describes type 2 (proximal) RTA, which is often accompanied by Fanconi syndrome and, once serum bicarbonate falls below the reabsorptive threshold, the urine pH can appropriately fall below 5.5 — unlike the persistently high urine pH here.` },
          { label: 'C', choice_text: 'Aldosterone-mediated sodium reabsorption in the principal cell', is_correct: false,
            explanation: `Impairment here causes type 4 RTA, which presents with hyperkalemia (not the hypokalemia seen in this patient).` },
          { label: 'D', choice_text: 'Sodium-potassium-2-chloride cotransport in the thick ascending limb', is_correct: false,
            explanation: `A defect here (as in Bartter syndrome or loop diuretic use) causes hypokalemic metabolic alkalosis, not acidosis.` },
          { label: 'E', choice_text: 'Carbonic anhydrase activity in the proximal tubule', is_correct: false,
            explanation: `Impaired proximal carbonic anhydrase activity produces a proximal (type 2)-like picture, not the distal acidification defect described here.` },
        ],
      },
      {
        stem: `A 6-week-old male infant has had progressively worsening projectile, non-bilious vomiting after feeds for one week. On examination, a firm, olive-shaped mass is palpated in the epigastrium. Serum electrolytes show sodium 138 mEq/L, potassium 3.0 mEq/L, chloride 88 mEq/L, and bicarbonate 32 mEq/L.`,
        lead_in: `Which of the following best describes this patient's acid-base status and the expected respiratory compensation?`,
        system_tag: 'Renal',
        difficulty: 'medium',
        explanation: `This is pyloric stenosis. Loss of HCl-rich gastric contents from persistent vomiting produces a hypochloremic, hypokalemic metabolic alkalosis (volume depletion drives aldosterone-mediated renal H+ and K+ wasting, worsening the alkalosis — "paradoxical aciduria"). The expected respiratory compensation for metabolic alkalosis is hypoventilation, raising PCO2 to blunt the rise in pH.`,
        educational_objective: `Recognize the hypochloremic, hypokalemic metabolic alkalosis of pyloric stenosis/persistent vomiting and know that hypoventilation is the appropriate respiratory compensation.`,
        references: `First Aid for the USMLE Step 1 — Renal: Acid-base disorders and compensation.`,
        choices: [
          { label: 'A', choice_text: 'Hypochloremic, hypokalemic metabolic alkalosis with compensatory hypoventilation', is_correct: true,
            explanation: `Correct — matches the low chloride, low potassium, elevated bicarbonate, and the appropriate hypoventilatory respiratory response.` },
          { label: 'B', choice_text: 'Anion gap metabolic acidosis with compensatory hyperventilation', is_correct: false,
            explanation: `The bicarbonate here is elevated (32), not decreased, ruling out an acidosis.` },
          { label: 'C', choice_text: 'Non-anion gap metabolic acidosis with compensatory hyperventilation', is_correct: false,
            explanation: `Again inconsistent with an elevated (not decreased) serum bicarbonate.` },
          { label: 'D', choice_text: 'Respiratory alkalosis with renal compensation via bicarbonate excretion', is_correct: false,
            explanation: `A primary respiratory process would be driven by an abnormal ventilation pattern, not by GI HCl loss, and renal compensation for respiratory alkalosis excretes bicarbonate over days, not the acute picture described.` },
          { label: 'E', choice_text: 'Metabolic alkalosis with compensatory hyperventilation', is_correct: false,
            explanation: `The correct compensation for metabolic alkalosis is hypoventilation (to retain CO2 and blunt the pH rise), not hyperventilation.` },
        ],
      },
      {
        stem: `A 68-year-old man with a history of heart failure with reduced ejection fraction presents with worsening bilateral lower extremity edema, orthopnea, and a 4-kg weight gain over one week. He is started on intravenous furosemide with good diuretic response.`,
        lead_in: `Furosemide produces its diuretic effect primarily by inhibiting which of the following?`,
        system_tag: 'Renal',
        difficulty: 'easy',
        explanation: `Furosemide is a loop diuretic that inhibits the Na+/K+/2Cl- cotransporter in the thick ascending limb, abolishing the lumen-positive potential that drives paracellular Ca2+/Mg2+ reabsorption and disrupting the countercurrent multiplier, producing potent natriuresis — useful for the volume overload of decompensated heart failure. Adverse effects include hypokalemia, hypocalcemia, metabolic alkalosis, and ototoxicity.`,
        educational_objective: `Localize furosemide's site and mechanism of action to the thick ascending limb Na+/K+/2Cl- cotransporter, and contrast with thiazide, K+-sparing, and carbonic anhydrase inhibitor diuretic sites.`,
        references: `First Aid for the USMLE Step 1 — Renal: Diuretic mechanisms and sites of action.`,
        choices: [
          { label: 'A', choice_text: 'The Na+/K+/2Cl- cotransporter in the thick ascending limb of the loop of Henle', is_correct: true,
            explanation: `Correct — the site and mechanism of loop diuretics like furosemide.` },
          { label: 'B', choice_text: 'The Na+/Cl- cotransporter in the distal convoluted tubule', is_correct: false,
            explanation: `This is the target of thiazide diuretics, a distinct, weaker natriuretic site distal to the loop of Henle.` },
          { label: 'C', choice_text: 'Epithelial sodium channels in the principal cells of the collecting duct', is_correct: false,
            explanation: `Targeted by amiloride/triamterene (potassium-sparing diuretics), not furosemide.` },
          { label: 'D', choice_text: 'Carbonic anhydrase in the proximal convoluted tubule', is_correct: false,
            explanation: `Targeted by acetazolamide, which causes a mild, self-limited bicarbonate diuresis distinct from loop diuretic action.` },
          { label: 'E', choice_text: 'Aldosterone receptor binding in the principal cells', is_correct: false,
            explanation: `This describes spironolactone/eplerenone, mineralocorticoid receptor antagonists, not furosemide's mechanism.` },
        ],
      },
    ],
  },
  {
    course: 'step1',
    module: 'gi',
    slug: 'gi-block-1',
    title: 'GI & Hepatobiliary — Block 1',
    description: 'A sample timed block covering inflammatory bowel disease, biliary obstruction, hepatic zonation, and GI neuroendocrine tumors.',
    questions: [
      {
        stem: `A 24-year-old woman presents with a 6-month history of intermittent right lower quadrant abdominal pain, non-bloody diarrhea, and a 10-lb weight loss. She also reports a perianal fistula that has drained intermittently. Colonoscopy shows patchy areas of inflamed mucosa interspersed with normal-appearing segments, and biopsy reveals transmural inflammation with non-caseating granulomas.`,
        lead_in: `Which of the following best characterizes this patient's underlying disease process?`,
        system_tag: 'Gastrointestinal',
        difficulty: 'easy',
        explanation: `The skip lesions, transmural involvement, non-caseating granulomas, and perianal fistulizing disease described here are classic for Crohn disease, which can affect any part of the GI tract (though the terminal ileum and colon are most common), in contrast to ulcerative colitis's continuous, mucosa-limited, rectum-starting pattern.`,
        educational_objective: `Distinguish Crohn disease (transmural, skip lesions, granulomas, fistulas, any GI segment) from ulcerative colitis (continuous, mucosal, rectum-based, no granulomas).`,
        references: `First Aid for the USMLE Step 1 — Gastrointestinal: Inflammatory bowel disease.`,
        choices: [
          { label: 'A', choice_text: 'Transmural inflammation with skip lesions, which may occur anywhere from mouth to anus', is_correct: true,
            explanation: `Correct — this is the defining pattern of Crohn disease, matching the granulomas and fistula described.` },
          { label: 'B', choice_text: 'Continuous mucosal and submucosal inflammation limited to the colon, beginning in the rectum', is_correct: false,
            explanation: `Describes ulcerative colitis, which does not produce skip lesions, transmural granulomas, or perianal fistulas.` },
          { label: 'C', choice_text: 'Inflammation limited to the mucosa with crypt abscesses and no granulomas, always involving the rectum', is_correct: false,
            explanation: `Also describes ulcerative colitis; granulomas and fistulizing disease argue strongly against it.` },
          { label: 'D', choice_text: 'Eosinophilic infiltration of the esophageal mucosa in response to food allergens', is_correct: false,
            explanation: `Describes eosinophilic esophagitis, presenting with dysphagia/food impaction, unrelated to this RLQ/fistula presentation.` },
          { label: 'E', choice_text: 'Villous atrophy and crypt hyperplasia triggered by gluten exposure', is_correct: false,
            explanation: `Describes celiac disease, which causes malabsorption, not transmural granulomatous inflammation with fistulas.` },
        ],
      },
      {
        stem: `A 58-year-old woman presents with fever, right upper quadrant pain, and jaundice. Vital signs show a temperature of 38.9°C (102°F) and heart rate of 110/min. Laboratory studies reveal a total bilirubin of 6.8 mg/dL (predominantly direct), alkaline phosphatase 410 U/L, and a leukocyte count of 16,000/mm3. Abdominal ultrasound shows dilation of the common bile duct with an echogenic focus within it.`,
        lead_in: `Obstruction at which of the following sites best explains this presentation?`,
        system_tag: 'Gastrointestinal',
        difficulty: 'medium',
        explanation: `Fever, jaundice, and RUQ pain (Charcot triad) with a dilated CBD and echogenic stone on ultrasound indicate choledocholithiasis complicated by ascending cholangitis — infection ascending from the duodenum into an obstructed, stagnant biliary system. This is a GI/surgical emergency requiring biliary decompression (ERCP) plus antibiotics.`,
        educational_objective: `Recognize Charcot triad and common bile duct obstruction as the hallmark of ascending cholangitis, and distinguish it from isolated cystic duct obstruction (cholecystitis).`,
        references: `First Aid for the USMLE Step 1 — Gastrointestinal: Biliary tract disease.`,
        choices: [
          { label: 'A', choice_text: 'Common bile duct', is_correct: true,
            explanation: `Correct — matches the direct hyperbilirubinemia, elevated alkaline phosphatase, dilated CBD, and Charcot triad of ascending cholangitis.` },
          { label: 'B', choice_text: 'Cystic duct only', is_correct: false,
            explanation: `Isolated cystic duct obstruction causes acute cholecystitis (a tender, distended gallbladder) without jaundice, since bile can still drain from the liver through a patent common bile duct.` },
          { label: 'C', choice_text: 'Main pancreatic duct', is_correct: false,
            explanation: `Isolated pancreatic duct obstruction presents as pancreatitis (epigastric pain, elevated lipase/amylase), not this cholangitis picture.` },
          { label: 'D', choice_text: 'Ampulla of Vater with concurrent pancreatic duct obstruction', is_correct: false,
            explanation: `Would be expected to also show elevated pancreatic enzymes/gallstone pancreatitis features, which are not described here; the ultrasound specifically localizes the stone to the common bile duct.` },
          { label: 'E', choice_text: 'Right hepatic duct', is_correct: false,
            explanation: `An isolated right hepatic duct stone would cause segmental (not diffuse extrahepatic) biliary dilation, unlike the dilated common bile duct seen here.` },
        ],
      },
      {
        stem: `A 19-year-old woman is brought to the emergency department 36 hours after ingesting a large quantity of acetaminophen in a suicide attempt. She now has right upper quadrant pain, jaundice, and a markedly elevated AST/ALT. Liver biopsy would be expected to show necrosis concentrated around the central veins of the hepatic lobules.`,
        lead_in: `Hepatocytes in this zone are most susceptible to acetaminophen toxicity for which of the following reasons?`,
        system_tag: 'Gastrointestinal',
        difficulty: 'medium',
        explanation: `Zone 3 (centrilobular) hepatocytes contain the highest concentration of cytochrome P450 2E1, which metabolizes acetaminophen to the hepatotoxic reactive metabolite NAPQI. Normally NAPQI is detoxified by conjugation with glutathione, but in overdose glutathione stores are depleted, NAPQI accumulates, and centrilobular necrosis results. Zone 3 is also farthest from the oxygenated blood entering at the portal triad, making it independently most vulnerable to ischemic injury.`,
        educational_objective: `Localize acetaminophen-induced hepatotoxicity to zone 3 (centrilobular) hepatocytes and explain this based on cytochrome P450 concentration and NAPQI generation.`,
        references: `First Aid for the USMLE Step 1 — Gastrointestinal: Liver zonation and drug/toxin-induced injury patterns.`,
        choices: [
          { label: 'A', choice_text: 'Highest concentration of cytochrome P450 enzymes, which generate the toxic metabolite NAPQI', is_correct: true,
            explanation: `Correct — CYP2E1 is most concentrated in zone 3, driving local NAPQI generation once glutathione is depleted.` },
          { label: 'B', choice_text: 'Lowest concentration of cytochrome P450 enzymes and highest antioxidant reserve', is_correct: false,
            explanation: `The opposite is true — zone 3 has the highest P450 activity and is relatively glutathione-poor compared to zone 1.` },
          { label: 'C', choice_text: 'Closest proximity to the portal triad and highest oxygen tension', is_correct: false,
            explanation: `This describes zone 1, which is relatively protected from acetaminophen toxicity and instead most vulnerable to ischemic/toxin injury delivered directly via the portal circulation (e.g., viral hepatitis).` },
          { label: 'D', choice_text: 'Highest rate of glycogen storage, making this zone susceptible to hypoglycemic injury', is_correct: false,
            explanation: `Glycogen handling is not the mechanism underlying acetaminophen-induced centrilobular necrosis.` },
          { label: 'E', choice_text: 'Predominant site of bile acid synthesis, causing local cholestatic injury', is_correct: false,
            explanation: `Not the mechanism of acetaminophen toxicity, which is oxidative/metabolite-driven, not cholestatic.` },
        ],
      },
      {
        stem: `A 46-year-old man has a 1-year history of recurrent, multiple peptic ulcers refractory to high-dose proton pump inhibitor therapy, along with chronic diarrhea that improves with PPI use. Endoscopy shows thickened gastric folds and ulcers in the duodenal bulb and distal duodenum. Fasting serum gastrin is markedly elevated and paradoxically rises further after secretin administration.`,
        lead_in: `A tumor secreting an excess of which of the following hormones is the most likely cause of this patient's presentation?`,
        system_tag: 'Gastrointestinal',
        difficulty: 'medium',
        explanation: `This is Zollinger-Ellison syndrome, caused by a gastrin-secreting neuroendocrine tumor (gastrinoma), often located in the duodenum or pancreas. Excess gastrin drives massive gastric acid hypersecretion, producing multiple/refractory peptic ulcers and acid-mediated diarrhea (which improves with acid suppression). The paradoxical rise in gastrin after secretin administration is the classic confirmatory test, since secretin normally suppresses gastrin release from G cells but stimulates gastrin release from gastrinoma cells.`,
        educational_objective: `Recognize Zollinger-Ellison syndrome (gastrinoma) as a cause of refractory multifocal peptic ulcers and understand the paradoxical secretin stimulation test.`,
        references: `First Aid for the USMLE Step 1 — Gastrointestinal: GI hormones and neuroendocrine tumors.`,
        choices: [
          { label: 'A', choice_text: 'Gastrin', is_correct: true,
            explanation: `Correct — a gastrinoma explains the refractory ulcers, acid-driven diarrhea, and paradoxical secretin test.` },
          { label: 'B', choice_text: 'Cholecystokinin', is_correct: false,
            explanation: `CCK stimulates gallbladder contraction and pancreatic enzyme secretion; it is not associated with this ulcer/diarrhea syndrome.` },
          { label: 'C', choice_text: 'Secretin', is_correct: false,
            explanation: `Secretin is used diagnostically here to provoke the paradoxical gastrin rise; it is not the hormone being oversecreted by the tumor.` },
          { label: 'D', choice_text: 'Vasoactive intestinal peptide', is_correct: false,
            explanation: `A VIPoma causes watery diarrhea, hypokalemia, and achlorhydria (WDHA syndrome), not peptic ulcer disease.` },
          { label: 'E', choice_text: 'Somatostatin', is_correct: false,
            explanation: `A somatostatinoma causes diabetes, cholelithiasis, and steatorrhea via broad inhibition of GI secretion, not ulcers.` },
        ],
      },
    ],
  },
  {
    course: 'step1',
    module: 'endocrine',
    slug: 'endocrine-block-1',
    title: 'Endocrine — Block 1',
    description: 'A sample timed block covering adrenal insufficiency, insulinoma, Graves disease, and congenital adrenal hyperplasia.',
    questions: [
      {
        stem: `A 39-year-old woman presents with fatigue, weight loss, and darkening of her skin over the past several months, particularly in her palmar creases and buccal mucosa. Laboratory studies show sodium 128 mEq/L, potassium 5.8 mEq/L, and a morning cortisol level that is low. Plasma ACTH is markedly elevated.`,
        lead_in: `Which of the following best explains this patient's elevated ACTH level?`,
        system_tag: 'Endocrine',
        difficulty: 'easy',
        explanation: `This is primary adrenal insufficiency (Addison disease), most commonly from autoimmune adrenalitis. Destruction of the adrenal cortex causes deficient cortisol (and often aldosterone) production; loss of cortisol's negative feedback on the hypothalamic-pituitary axis causes a compensatory rise in CRH and ACTH. Elevated ACTH (and its co-secreted melanocyte-stimulating peptide) causes hyperpigmentation, a finding absent in secondary/tertiary adrenal insufficiency where ACTH is low.`,
        educational_objective: `Differentiate primary adrenal insufficiency (low cortisol, high ACTH, hyperpigmentation, hyperkalemia) from secondary/tertiary causes (low cortisol, low ACTH, no hyperpigmentation).`,
        references: `First Aid for the USMLE Step 1 — Endocrine: Adrenal insufficiency.`,
        choices: [
          { label: 'A', choice_text: "Loss of negative feedback inhibition of the pituitary and hypothalamus due to primary adrenal cortisol deficiency", is_correct: true,
            explanation: `Correct — the adrenal gland itself has failed, so cortisol can no longer suppress CRH/ACTH release, driving ACTH upward.` },
          { label: 'B', choice_text: 'An ACTH-secreting pituitary adenoma', is_correct: false,
            explanation: `Would cause Cushing disease with elevated (not low) cortisol, and would not produce this hyperkalemic, hyponatremic picture.` },
          { label: 'C', choice_text: 'Ectopic ACTH secretion from a small cell lung carcinoma', is_correct: false,
            explanation: `Also causes hypercortisolism, typically with hypokalemic metabolic alkalosis, not adrenal insufficiency.` },
          { label: 'D', choice_text: 'Increased corticosteroid-binding globulin from estrogen therapy', is_correct: false,
            explanation: `Raises total but not free cortisol and does not produce this electrolyte pattern or hyperpigmentation.` },
          { label: 'E', choice_text: 'Exogenous glucocorticoid withdrawal', is_correct: false,
            explanation: `Causes transient secondary adrenal insufficiency with low (not high) ACTH, since ACTH was previously suppressed, and no hyperpigmentation.` },
        ],
      },
      {
        stem: `A 52-year-old woman reports recurrent episodes of confusion, diaphoresis, and palpitations that occur several hours after meals and are relieved promptly by eating. During a monitored 72-hour fast, she develops symptomatic hypoglycemia (plasma glucose 38 mg/dL) with an inappropriately elevated serum insulin level and an elevated C-peptide level.`,
        lead_in: `Which of the following is the most likely diagnosis?`,
        system_tag: 'Endocrine',
        difficulty: 'medium',
        explanation: `Whipple triad (hypoglycemic symptoms, documented low glucose, relief with glucose administration) plus elevated insulin and C-peptide during hypoglycemia indicates endogenous hyperinsulinism from a pancreatic beta-cell tumor (insulinoma). The elevated C-peptide is key: it confirms insulin is being co-secreted from endogenous proinsulin cleavage, excluding exogenous insulin injection (which contains no C-peptide and would suppress the patient's own C-peptide production).`,
        educational_objective: `Use elevated C-peptide to distinguish endogenous hyperinsulinism (insulinoma, sulfonylurea use) from exogenous insulin administration as a cause of hypoglycemia.`,
        references: `First Aid for the USMLE Step 1 — Endocrine: Pancreatic islet tumors and hypoglycemia.`,
        choices: [
          { label: 'A', choice_text: 'Insulinoma', is_correct: true,
            explanation: `Correct — elevated insulin with elevated C-peptide during hypoglycemia indicates an endogenous source, i.e., a beta-cell tumor.` },
          { label: 'B', choice_text: 'Surreptitious (factitious) exogenous insulin administration', is_correct: false,
            explanation: `Exogenous insulin would suppress endogenous secretion, producing a low, not elevated, C-peptide level.` },
          { label: 'C', choice_text: 'Sulfonylurea ingestion', is_correct: false,
            explanation: `Also raises both insulin and C-peptide by stimulating endogenous secretion, and is an important mimicker — but is confirmed by a positive sulfonylurea screen, which is not described, making insulinoma the better answer here.` },
          { label: 'D', choice_text: 'Glucagonoma', is_correct: false,
            explanation: `Causes hyperglycemia and a characteristic rash (necrolytic migratory erythema), not hypoglycemia.` },
          { label: 'E', choice_text: 'Adrenal insufficiency', is_correct: false,
            explanation: `Can cause mild fasting hypoglycemia but not with elevated insulin/C-peptide, and would show other features (hyperpigmentation, hyperkalemia).` },
        ],
      },
      {
        stem: `A 33-year-old woman presents with a 3-month history of palpitations, heat intolerance, weight loss despite increased appetite, and tremor. Examination reveals a diffusely enlarged, non-tender thyroid gland, bilateral exophthalmos, and warm, moist skin. TSH is suppressed and free T4 is elevated.`,
        lead_in: `Which of the following mechanisms is most directly responsible for this patient's thyroid findings?`,
        system_tag: 'Endocrine',
        difficulty: 'easy',
        explanation: `Graves disease is caused by thyroid-stimulating immunoglobulins (TSIs), autoantibodies that bind and activate the TSH receptor, driving diffuse thyroid hyperplasia and excess hormone synthesis independent of pituitary control (hence suppressed TSH). These same autoantibodies, along with T-cell mediated orbital inflammation, cause the infiltrative ophthalmopathy (exophthalmos) unique to Graves disease among causes of hyperthyroidism.`,
        educational_objective: `Identify TSH receptor-stimulating autoantibodies as the mechanism of Graves disease and recognize exophthalmos as a distinguishing feature from other causes of hyperthyroidism.`,
        references: `First Aid for the USMLE Step 1 — Endocrine: Thyroid disease.`,
        choices: [
          { label: 'A', choice_text: 'Autoantibodies that bind and stimulate the TSH receptor', is_correct: true,
            explanation: `Correct — the mechanism of Graves disease, explaining both the hyperthyroidism and, via associated orbital autoimmunity, the exophthalmos.` },
          { label: 'B', choice_text: 'Autoantibodies against thyroid peroxidase causing progressive glandular destruction', is_correct: false,
            explanation: `Describes Hashimoto thyroiditis, which causes hypothyroidism, not this hyperthyroid picture.` },
          { label: 'C', choice_text: 'Autonomous, TSH-independent hormone secretion from a solitary hyperfunctioning nodule', is_correct: false,
            explanation: `Describes a toxic adenoma, which shows a single "hot" nodule on scan and diffuse gland enlargement without exophthalmos, unlike this case.` },
          { label: 'D', choice_text: 'A TSH-secreting pituitary adenoma', is_correct: false,
            explanation: `Would produce an elevated, not suppressed, TSH.` },
          { label: 'E', choice_text: 'Transient release of preformed thyroid hormone from a virally damaged gland', is_correct: false,
            explanation: `Describes subacute (de Quervain) thyroiditis, which presents with a painful, tender thyroid, not this chronic autoimmune picture with exophthalmos.` },
        ],
      },
      {
        stem: `A newborn female presents with ambiguous genitalia, including clitoromegaly and partial labial fusion. On day 5 of life, she develops vomiting, lethargy, and poor feeding. Laboratory studies show sodium 122 mEq/L, potassium 7.2 mEq/L, and a markedly elevated 17-hydroxyprogesterone level.`,
        lead_in: `A deficiency of which of the following enzymes is the most likely cause of this presentation?`,
        system_tag: 'Endocrine',
        difficulty: 'medium',
        explanation: `This is classic salt-wasting congenital adrenal hyperplasia due to 21-hydroxylase deficiency, the most common form of CAH. The enzyme block shunts precursors toward androgen synthesis (virilizing a female fetus in utero) while impairing both cortisol and aldosterone production, causing the life-threatening salt-wasting crisis (hyponatremia, hyperkalemia, hypotension) seen here. The markedly elevated 17-hydroxyprogesterone (the substrate just proximal to the block) is diagnostic.`,
        educational_objective: `Recognize 21-hydroxylase deficiency as the most common cause of congenital adrenal hyperplasia, presenting with virilization plus salt-wasting and elevated 17-OH-progesterone.`,
        references: `First Aid for the USMLE Step 1 — Endocrine: Congenital adrenal hyperplasia.`,
        choices: [
          { label: 'A', choice_text: '21-hydroxylase', is_correct: true,
            explanation: `Correct — the most common CAH enzyme defect, producing virilization with salt-wasting and elevated 17-OH-progesterone.` },
          { label: 'B', choice_text: '11-beta-hydroxylase', is_correct: false,
            explanation: `Also causes virilization, but with hypertension and hypokalemia (from accumulated 11-deoxycorticosterone, a mineralocorticoid), not the salt-wasting hyponatremia/hyperkalemia seen here.` },
          { label: 'C', choice_text: '17-alpha-hydroxylase', is_correct: false,
            explanation: `Causes decreased sex steroids (undervirilized genitalia in 46,XY infants, not virilization of a female) with hypertension and low, not elevated, 17-OH-progesterone.` },
          { label: 'D', choice_text: 'Aromatase', is_correct: false,
            explanation: `Aromatase deficiency can virilize a female fetus but is not associated with the salt-wasting electrolyte crisis or elevated 17-OH-progesterone described.` },
          { label: 'E', choice_text: '5-alpha-reductase', is_correct: false,
            explanation: `Causes undervirilization of 46,XY males (impaired DHT synthesis), not ambiguous genitalia in a female or a salt-wasting crisis.` },
        ],
      },
    ],
  },
  {
    course: 'step1',
    module: 'musculoskeletal',
    slug: 'musculoskeletal-block-1',
    title: 'Musculoskeletal — Block 1',
    description: 'A sample timed block covering brachial plexus injury, carpal fractures, compartment syndrome, and rotator cuff pathology.',
    questions: [
      {
        stem: `A newborn delivered via a difficult vaginal delivery complicated by shoulder dystocia is noted to hold his right arm adducted and internally rotated at the shoulder, with the elbow extended, forearm pronated, and wrist flexed ("waiter's tip" posture). Grip strength in the right hand is normal.`,
        lead_in: `Injury to which of the following is the most likely cause of this presentation?`,
        system_tag: 'Musculoskeletal',
        difficulty: 'easy',
        explanation: `Excessive lateral traction on the neck during a difficult delivery (or a fall onto the shoulder) stretches the upper trunk (C5-C6) of the brachial plexus, causing Erb-Duchenne palsy. Loss of C5-C6-innervated muscles (deltoid, supraspinatus/infraspinatus, biceps) produces the characteristic "waiter's tip" posture, while the C8-T1-innervated intrinsic hand muscles (and grip) are spared.`,
        educational_objective: `Recognize Erb-Duchenne (upper trunk, C5-C6) palsy's "waiter's tip" posture and distinguish it from Klumpke (lower trunk, C8-T1) palsy.`,
        references: `First Aid for the USMLE Step 1 — Musculoskeletal: Brachial plexus lesions.`,
        choices: [
          { label: 'A', choice_text: 'Upper trunk of the brachial plexus (C5-C6)', is_correct: true,
            explanation: `Correct — traction injury here produces the "waiter's tip" posture with preserved hand function.` },
          { label: 'B', choice_text: 'Lower trunk of the brachial plexus (C8-T1)', is_correct: false,
            explanation: `Injury here causes Klumpke palsy: a claw hand with intact shoulder/elbow function — the opposite pattern from this case.` },
          { label: 'C', choice_text: 'Posterior cord of the brachial plexus', is_correct: false,
            explanation: `Would cause wrist drop and extensor weakness (radial nerve territory) with normal shoulder positioning, not this posture.` },
          { label: 'D', choice_text: 'Long thoracic nerve', is_correct: false,
            explanation: `Causes a winged scapula from serratus anterior weakness, not this global limb posture.` },
          { label: 'E', choice_text: 'Axillary nerve alone', is_correct: false,
            explanation: `Causes isolated deltoid/teres minor weakness with lateral shoulder sensory loss, not this full limb posture.` },
        ],
      },
      {
        stem: `A 22-year-old man falls onto an outstretched hand while skateboarding. He has point tenderness in the anatomic snuffbox of his right wrist. Initial radiographs are read as normal, and he is placed in a thumb spica splint with follow-up imaging in 2 weeks.`,
        lead_in: `This injury places the patient at greatest risk for which of the following complications?`,
        system_tag: 'Musculoskeletal',
        difficulty: 'medium',
        explanation: `Scaphoid fractures are the most common carpal fracture, classically from a fall on an outstretched hand, and present with snuffbox tenderness — often with initially normal radiographs, since occult fractures may not be visible for 1-2 weeks. The scaphoid receives a retrograde blood supply entering distally from branches of the radial artery, so fractures through the waist or proximal pole can disrupt flow to the proximal fragment, predisposing to avascular necrosis and nonunion.`,
        educational_objective: `Recognize the scaphoid's retrograde blood supply as the reason waist/proximal pole fractures risk avascular necrosis, even when initial x-rays appear normal.`,
        references: `First Aid for the USMLE Step 1 — Musculoskeletal: Upper extremity fractures.`,
        choices: [
          { label: 'A', choice_text: 'Avascular necrosis of the proximal scaphoid fragment', is_correct: true,
            explanation: `Correct — the retrograde blood supply makes the proximal fragment vulnerable to ischemic necrosis after a waist fracture.` },
          { label: 'B', choice_text: 'Avascular necrosis of the lunate', is_correct: false,
            explanation: `Kienböck disease (lunate AVN) is a separate entity, not the typical complication of a scaphoid fracture.` },
          { label: 'C', choice_text: 'Compartment syndrome of the forearm', is_correct: false,
            explanation: `Not a typical complication of an isolated scaphoid fracture, which lacks the closed fascial compartment mechanism.` },
          { label: 'D', choice_text: 'Radial nerve palsy', is_correct: false,
            explanation: `The radial nerve is at risk with midshaft humeral fractures, not wrist/snuffbox injuries.` },
          { label: 'E', choice_text: 'Ulnar artery pseudoaneurysm', is_correct: false,
            explanation: `Not a typical complication of a scaphoid fracture; the vessel at risk here is the scaphoid's own retrograde blood supply, not the ulnar artery.` },
        ],
      },
      {
        stem: `A 26-year-old man sustains a closed tibial shaft fracture in a motorcycle accident. Six hours after cast placement, he develops severe leg pain that is disproportionate to the injury and markedly worsens with passive plantarflexion of the toes. The anterior compartment of the leg is tense and tender to palpation, and he has decreased sensation in the web space between the first and second toes.`,
        lead_in: `Which of the following nerves is most likely being compromised by this process?`,
        system_tag: 'Musculoskeletal',
        difficulty: 'medium',
        explanation: `This is acute compartment syndrome of the anterior leg compartment following a tibial fracture — a surgical emergency. Pain out of proportion to exam and pain with passive stretch of the toe extensors/flexors are early warning signs. The anterior compartment contains the deep peroneal nerve, which supplies sensation to the first dorsal web space and motor function to the toe/foot dorsiflexors; its compromise causes the described sensory loss and risks foot drop if pressure is not urgently relieved by fasciotomy.`,
        educational_objective: `Recognize the clinical signs of acute compartment syndrome and localize deep peroneal nerve dysfunction to the anterior leg compartment.`,
        references: `First Aid for the USMLE Step 1 — Musculoskeletal: Compartment syndrome and lower extremity nerve anatomy.`,
        choices: [
          { label: 'A', choice_text: 'Deep peroneal nerve', is_correct: true,
            explanation: `Correct — runs in the anterior compartment and supplies the first web space, matching this sensory deficit.` },
          { label: 'B', choice_text: 'Superficial peroneal nerve', is_correct: false,
            explanation: `Supplies sensation to the dorsum of the foot (excluding the first web space) and lies in the lateral, not anterior, compartment.` },
          { label: 'C', choice_text: 'Tibial nerve', is_correct: false,
            explanation: `Travels in the posterior compartment and supplies the sole of the foot, not the first web space.` },
          { label: 'D', choice_text: 'Sural nerve', is_correct: false,
            explanation: `Purely sensory, supplying the lateral foot/ankle, not the first web space.` },
          { label: 'E', choice_text: 'Superior gluteal nerve', is_correct: false,
            explanation: `Unrelated to the leg/foot; supplies gluteus medius/minimus and tensor fasciae latae.` },
        ],
      },
      {
        stem: `A 58-year-old man who works as a house painter reports several months of progressive right shoulder pain, worse with overhead reaching and at night when lying on that side. On examination, he has pain and weakness with the first 15-20 degrees of active abduction, though passive range of motion is full. Strength markedly improves once the arm is passively abducted past 90 degrees.`,
        lead_in: `Dysfunction of which of the following structures is most consistent with this presentation?`,
        system_tag: 'Musculoskeletal',
        difficulty: 'medium',
        explanation: `The supraspinatus (innervated by the suprascapular nerve) initiates shoulder abduction through its first 15-20 degrees before the deltoid takes over; it is also the rotator cuff tendon most vulnerable to impingement under the acromion and to degenerative tearing with repetitive overhead activity, producing a classic painful arc and initiation weakness with preserved motion once the deltoid mechanically takes over.`,
        educational_objective: `Localize weakness in the initial degrees of shoulder abduction to the supraspinatus muscle and recognize rotator cuff impingement/tear as a cause of chronic overhead-activity shoulder pain.`,
        references: `First Aid for the USMLE Step 1 — Musculoskeletal: Rotator cuff anatomy and shoulder pathology.`,
        choices: [
          { label: 'A', choice_text: 'Supraspinatus muscle/tendon', is_correct: true,
            explanation: `Correct — initiates abduction and is the rotator cuff tendon most susceptible to impingement/tearing.` },
          { label: 'B', choice_text: 'Infraspinatus muscle/tendon', is_correct: false,
            explanation: `Primarily responsible for external rotation; weakness would appear with resisted external rotation, not abduction initiation.` },
          { label: 'C', choice_text: 'Subscapularis muscle/tendon', is_correct: false,
            explanation: `The primary internal rotator; weakness is shown on the "lift-off test," not abduction initiation.` },
          { label: 'D', choice_text: 'Long head of the biceps tendon', is_correct: false,
            explanation: `Tendinopathy here causes anterior shoulder pain with resisted forearm supination/elbow flexion, not this abduction pattern.` },
          { label: 'E', choice_text: 'Deltoid muscle', is_correct: false,
            explanation: `The deltoid takes over abduction from about 15-90 degrees onward; it is not responsible for the initial degrees affected here, and its own dysfunction (axillary nerve injury) would impair abduction throughout, not selectively at initiation.` },
        ],
      },
    ],
  },
  {
    course: 'step1',
    module: 'pathology',
    slug: 'pathology-block-1',
    title: 'Pathology & Histology — Block 1',
    description: 'A sample timed block covering reversible vs. irreversible cell injury, mediators of acute inflammation, tumor staging, and classic lymphoma histology.',
    questions: [
      {
        stem: `A 63-year-old man undergoes emergent surgical revascularization for acute limb ischemia after 5 hours of complete arterial occlusion. Muscle biopsy of the affected limb obtained just prior to reperfusion shows swollen cells with dilated endoplasmic reticulum and detached ribosomes, but intact plasma and lysosomal membranes.`,
        lead_in: `Based on these findings, which of the following best describes the state of these cells?`,
        system_tag: 'Pathology',
        difficulty: 'medium',
        explanation: `Cellular swelling, ER dilation, and ribosome detachment (reduced protein synthesis) are hallmarks of reversible ischemic cell injury, occurring from ATP depletion impairing the Na+/K+-ATPase. The point of no return to irreversibility is marked by severe mitochondrial damage, massive calcium influx, and plasma/lysosomal membrane rupture — none of which are present here, so timely reperfusion can still rescue these cells.`,
        educational_objective: `Distinguish the morphologic hallmarks of reversible ischemic cell injury (swelling, ER dilation, ribosome detachment) from the markers of irreversibility (membrane rupture, mitochondrial permeability transition, massive Ca2+ influx).`,
        references: `First Aid for the USMLE Step 1 — Pathology: Cell injury and death.`,
        choices: [
          { label: 'A', choice_text: 'Reversibly injured, capable of returning to baseline function if perfusion is restored promptly', is_correct: true,
            explanation: `Correct — swelling, ER dilation, and ribosome detachment with intact membranes are all reversible findings.` },
          { label: 'B', choice_text: 'Irreversibly injured due to plasma membrane disruption', is_correct: false,
            explanation: `The plasma membrane is explicitly described as intact, ruling this out.` },
          { label: 'C', choice_text: 'Irreversibly injured due to massive mitochondrial calcium influx and permeability transition', is_correct: false,
            explanation: `No mitochondrial vacuolization or calcium influx is described — this is the threshold marker of irreversibility that is absent here.` },
          { label: 'D', choice_text: 'Already necrotic, with karyolysis and loss of nuclear detail', is_correct: false,
            explanation: `No nuclear changes are described in this biopsy.` },
          { label: 'E', choice_text: 'Undergoing apoptosis, with cell shrinkage and chromatin condensation', is_correct: false,
            explanation: `No apoptotic morphology (shrinkage, pyknosis) is described; the findings instead reflect reversible ischemic swelling.` },
        ],
      },
      {
        stem: `A 34-year-old man develops a tender, fluctuant abscess at the site of a puncture wound. Incision and drainage yields purulent material; histologic examination of the abscess wall shows a dense infiltrate of neutrophils.`,
        lead_in: `Which of the following mediators is most directly responsible for recruiting these neutrophils to the site of injury?`,
        system_tag: 'Pathology',
        difficulty: 'medium',
        explanation: `Leukotriene B4, generated from arachidonic acid via the 5-lipoxygenase pathway, along with complement component C5a and bacterial formyl-methionine peptides, is one of the principal chemoattractants that recruits neutrophils along a concentration gradient to a site of infection or injury, driving the purulent neutrophilic infiltrate of an abscess.`,
        educational_objective: `Identify leukotriene B4 as a key neutrophil chemoattractant, distinct from mediators of vasodilation (histamine, prostacyclin, NO) and pain (bradykinin) in acute inflammation.`,
        references: `First Aid for the USMLE Step 1 — Pathology: Mediators of acute inflammation.`,
        choices: [
          { label: 'A', choice_text: 'Leukotriene B4', is_correct: true,
            explanation: `Correct — a principal neutrophil chemoattractant generated via the 5-lipoxygenase pathway.` },
          { label: 'B', choice_text: 'Histamine', is_correct: false,
            explanation: `Mediates immediate vasodilation and increased vascular permeability, not neutrophil chemotaxis.` },
          { label: 'C', choice_text: 'Bradykinin', is_correct: false,
            explanation: `Mediates pain and vasodilation via the kinin cascade, not chemotaxis.` },
          { label: 'D', choice_text: 'Prostacyclin (PGI2)', is_correct: false,
            explanation: `Causes vasodilation and inhibits platelet aggregation, not chemotaxis.` },
          { label: 'E', choice_text: 'Nitric oxide', is_correct: false,
            explanation: `Causes vascular smooth muscle relaxation/vasodilation, not neutrophil recruitment.` },
        ],
      },
      {
        stem: `A 55-year-old woman is diagnosed with invasive ductal carcinoma of the breast. Pathology shows a well-differentiated (low-grade) tumor measuring 4.5 cm, with metastases identified in 6 axillary lymph nodes and a separate metastatic lesion in the liver on imaging.`,
        lead_in: `Which of the following is the most important prognostic factor in this patient's case?`,
        system_tag: 'Pathology',
        difficulty: 'medium',
        explanation: `Stage — the anatomic extent of disease captured by the TNM system (tumor size, nodal spread, distant metastasis) — is generally the single strongest predictor of prognosis across most solid tumors, more so than histologic grade. This patient's low tumor grade is favorable, but her extensive nodal disease and distant hepatic metastasis (stage IV disease) dominate her prognosis.`,
        educational_objective: `Understand that tumor stage (TNM) is generally a stronger predictor of prognosis than histologic grade, even when the two point in different directions.`,
        references: `First Aid for the USMLE Step 1 — Pathology: Neoplasia — grading and staging.`,
        choices: [
          { label: 'A', choice_text: 'Tumor stage (size, nodal involvement, and distant metastasis)', is_correct: true,
            explanation: `Correct — stage IV disease (distant metastasis) dominates prognosis regardless of favorable histologic grade.` },
          { label: 'B', choice_text: 'Tumor grade (degree of histologic differentiation)', is_correct: false,
            explanation: `This patient is actually low-grade/well-differentiated, yet her disease is advanced-stage — illustrating that stage generally outweighs grade in determining prognosis.` },
          { label: 'C', choice_text: 'Estrogen receptor status alone', is_correct: false,
            explanation: `Guides therapy selection but does not override the prognostic weight of documented distant metastasis.` },
          { label: 'D', choice_text: "Patient's age at diagnosis", is_correct: false,
            explanation: `A relevant but secondary prognostic modifier compared to the anatomic extent of disease.` },
          { label: 'E', choice_text: 'Tumor size alone, independent of nodal or metastatic status', is_correct: false,
            explanation: `Size is only one component of overall stage and is far less prognostically significant once nodal and distant metastases are present.` },
        ],
      },
      {
        stem: `A 27-year-old man presents with a several-week history of painless, progressively enlarging cervical lymphadenopathy, drenching night sweats, and a 12-lb weight loss. He also reports that the lymph nodes become painful after drinking alcohol. Excisional biopsy of a cervical node shows scattered large, binucleated cells with prominent eosinophilic nucleoli against a background of reactive lymphocytes, eosinophils, and histiocytes.`,
        lead_in: `The malignant cells in this biopsy are most likely to express which of the following markers?`,
        system_tag: 'Pathology',
        difficulty: 'easy',
        explanation: `The binucleate ("owl's eye") Reed-Sternberg cells described here are the diagnostic hallmark of classic Hodgkin lymphoma and characteristically express CD15 and CD30, despite arising from germinal center B cells that have lost most conventional B-cell surface markers. The reactive mixed inflammatory background and alcohol-induced lymph node pain are classic associated clinical clues.`,
        educational_objective: `Identify Reed-Sternberg cells (CD15+/CD30+, binucleate with prominent nucleoli) as diagnostic of classic Hodgkin lymphoma.`,
        references: `First Aid for the USMLE Step 1 — Pathology: Lymphoid neoplasms.`,
        choices: [
          { label: 'A', choice_text: 'CD15 and CD30', is_correct: true,
            explanation: `Correct — the classic immunophenotype of Reed-Sternberg cells in Hodgkin lymphoma.` },
          { label: 'B', choice_text: 'CD19 and CD20', is_correct: false,
            explanation: `Typical B-cell markers seen in most non-Hodgkin B-cell lymphomas; classic Reed-Sternberg cells characteristically lose most of these markers.` },
          { label: 'C', choice_text: 'CD3 and CD5', is_correct: false,
            explanation: `T-cell markers associated with T-cell lymphomas, not Hodgkin lymphoma.` },
          { label: 'D', choice_text: 'TdT', is_correct: false,
            explanation: `A marker of immature lymphoblasts, seen in ALL/lymphoblastic lymphoma, not Hodgkin lymphoma.` },
          { label: 'E', choice_text: 'CD117 (c-KIT)', is_correct: false,
            explanation: `Associated with GISTs, mast cell disease, and some leukemias, not Hodgkin lymphoma.` },
        ],
      },
    ],
  },
  {
    course: 'step1',
    module: 'pharmacology',
    slug: 'pharmacology-block-1',
    title: 'Pharmacology Mechanisms — Block 1',
    description: 'A sample timed block covering cholinergic toxicology, antimicrobial mechanisms, elimination kinetics, and anticoagulant pharmacology.',
    questions: [
      {
        stem: `A 44-year-old farm worker is brought to the emergency department after an accidental exposure to a crop pesticide. He has excessive salivation, lacrimation, urination, diarrhea, muscle fasciculations, and bilateral pinpoint pupils. Heart rate is 48/min.`,
        lead_in: `The toxic mechanism responsible for this presentation most directly involves which of the following?`,
        system_tag: 'Pharmacology',
        difficulty: 'easy',
        explanation: `Organophosphate insecticides irreversibly inhibit acetylcholinesterase, preventing the breakdown of acetylcholine and causing its accumulation at both muscarinic (SLUDGE: salivation, lacrimation, urination, diarrhea, GI upset, emesis; also miosis and bradycardia) and nicotinic (fasciculations, later paralysis) synapses. Treatment involves atropine (muscarinic antagonism) and pralidoxime (regenerates active acetylcholinesterase if given before "aging" of the enzyme-inhibitor complex).`,
        educational_objective: `Recognize organophosphate toxicity as acetylcholinesterase inhibition producing a combined muscarinic/nicotinic cholinergic toxidrome, and know its antidotes.`,
        references: `First Aid for the USMLE Step 1 — Pharmacology: Cholinergic pharmacology and toxicology.`,
        choices: [
          { label: 'A', choice_text: 'Irreversible inhibition of acetylcholinesterase, causing accumulation of acetylcholine at synapses', is_correct: true,
            explanation: `Correct — the mechanism of organophosphate toxicity, producing this combined muscarinic/nicotinic toxidrome.` },
          { label: 'B', choice_text: 'Competitive antagonism at nicotinic acetylcholine receptors', is_correct: false,
            explanation: `Would cause a paralytic picture without cholinergic excess — the opposite of the accumulation-driven toxidrome seen here.` },
          { label: 'C', choice_text: 'Direct agonism at muscarinic receptors without affecting acetylcholine metabolism', is_correct: false,
            explanation: `Organophosphates act by blocking ACh breakdown, not by directly binding receptors, even though the resulting clinical picture looks similar.` },
          { label: 'D', choice_text: 'Blockade of voltage-gated sodium channels in peripheral nerves', is_correct: false,
            explanation: `Describes local anesthetics or toxins like tetrodotoxin, not this cholinergic toxidrome.` },
          { label: 'E', choice_text: 'Inhibition of monoamine oxidase, increasing catecholamine levels', is_correct: false,
            explanation: `An unrelated mechanism that would not produce this cholinergic presentation.` },
        ],
      },
      {
        stem: `A 61-year-old hospitalized patient develops methicillin-resistant Staphylococcus aureus bacteremia and is started on intravenous vancomycin. During the infusion, he develops flushing and pruritus of the face, neck, and upper torso, which resolves when the infusion rate is slowed.`,
        lead_in: `Vancomycin exerts its bactericidal effect by which of the following mechanisms?`,
        system_tag: 'Pharmacology',
        difficulty: 'medium',
        explanation: `Vancomycin is a glycopeptide that binds the D-Ala-D-Ala terminus of peptidoglycan cell wall precursors, sterically blocking the transglycosylation and transpeptidation steps needed for cross-linking, which is bactericidal against gram-positive organisms including MRSA. The described reaction is "red man syndrome," a rate-related, non-IgE-mediated histamine release reaction (not a true allergy), managed by slowing the infusion rate and/or antihistamine pretreatment.`,
        educational_objective: `Know vancomycin's mechanism (binding D-Ala-D-Ala to block peptidoglycan cross-linking) and recognize red man syndrome as an infusion-rate-related reaction rather than a true allergy.`,
        references: `First Aid for the USMLE Step 1 — Pharmacology: Cell wall synthesis inhibitors.`,
        choices: [
          { label: 'A', choice_text: 'Binding the D-alanyl-D-alanine terminus of peptidoglycan precursors, preventing cell wall cross-linking', is_correct: true,
            explanation: `Correct — this is vancomycin's mechanism, distinct from direct transpeptidase inhibition by beta-lactams.` },
          { label: 'B', choice_text: 'Inhibiting penicillin-binding proteins (transpeptidases) directly', is_correct: false,
            explanation: `This is the mechanism of beta-lactam antibiotics — a distinct way of disrupting the same overall cell wall pathway.` },
          { label: 'C', choice_text: 'Binding the 30S ribosomal subunit and causing misreading of mRNA', is_correct: false,
            explanation: `Describes aminoglycosides, not vancomycin.` },
          { label: 'D', choice_text: 'Binding the 50S ribosomal subunit and blocking translocation', is_correct: false,
            explanation: `Describes macrolides, not vancomycin.` },
          { label: 'E', choice_text: 'Inhibiting DNA gyrase (topoisomerase II)', is_correct: false,
            explanation: `Describes fluoroquinolones, not vancomycin.` },
        ],
      },
      {
        stem: `A patient taking phenytoin for seizure control has his dose increased. At the new, higher dose, a relatively small dosage increase produces a disproportionately large rise in steady-state plasma drug concentration, and the drug is eliminated at a constant amount per unit time regardless of its plasma concentration.`,
        lead_in: `This elimination pattern is best described by which of the following?`,
        system_tag: 'Pharmacology',
        difficulty: 'medium',
        explanation: `At therapeutic-to-high doses, phenytoin's hepatic metabolism (like ethanol's) becomes saturated, so the enzyme system can only eliminate a fixed amount of drug per unit time regardless of concentration — zero-order kinetics. This is why small dose increases near or above the saturation point can produce disproportionate jumps in steady-state levels and toxicity, unlike most drugs, which follow first-order kinetics (constant fraction/half-life eliminated per unit time) throughout their clinical dosing range.`,
        educational_objective: `Recognize zero-order elimination kinetics (constant amount/time, enzyme-saturated) as characteristic of phenytoin, ethanol, and aspirin at high doses, in contrast to first-order kinetics.`,
        references: `First Aid for the USMLE Step 1 — Pharmacology: Pharmacokinetics — order of elimination.`,
        choices: [
          { label: 'A', choice_text: 'Zero-order kinetics, because the metabolizing enzyme system is saturated', is_correct: true,
            explanation: `Correct — a constant amount eliminated per unit time indicates enzyme saturation, the hallmark of zero-order kinetics.` },
          { label: 'B', choice_text: 'First-order kinetics, because a constant fraction of drug is eliminated per unit time', is_correct: false,
            explanation: `A constant fraction (not amount) eliminated per unit time is the definition of first-order kinetics — not what is described here.` },
          { label: 'C', choice_text: 'First-order kinetics with a fixed half-life at all doses', is_correct: false,
            explanation: `First-order elimination has a constant half-life regardless of concentration, which does not hold for phenytoin at high doses.` },
          { label: 'D', choice_text: 'Facilitated diffusion-limited elimination that increases proportionally with dose', is_correct: false,
            explanation: `Not a standard pharmacokinetic classification, and it does not match a saturable, capacity-limited elimination process.` },
          { label: 'E', choice_text: 'Non-linear absorption kinetics unrelated to elimination', is_correct: false,
            explanation: `The vignette describes an elimination (metabolic), not an absorption, phenomenon.` },
        ],
      },
      {
        stem: `A 71-year-old man with atrial fibrillation on chronic warfarin therapy presents with gum bleeding and easy bruising. His INR is found to be 6.5 (therapeutic range 2-3 for his indication).`,
        lead_in: `Warfarin produces its anticoagulant effect by which of the following mechanisms?`,
        system_tag: 'Pharmacology',
        difficulty: 'easy',
        explanation: `Warfarin inhibits vitamin K epoxide reductase, preventing the regeneration of reduced vitamin K needed as a cofactor for gamma-carboxylation (and thus full biologic activity) of clotting factors II, VII, IX, and X, as well as protein C and S. Because factor VII (shortest half-life) falls first, early warfarin effect is reflected by a rising INR/PT before full anticoagulation is achieved; excessive anticoagulation is managed with vitamin K and/or factor replacement depending on severity.`,
        educational_objective: `Know warfarin's mechanism (vitamin K epoxide reductase inhibition, decreasing factors II, VII, IX, X and proteins C/S) and distinguish it from heparin and the direct oral anticoagulants.`,
        references: `First Aid for the USMLE Step 1 — Pharmacology: Anticoagulants.`,
        choices: [
          { label: 'A', choice_text: 'Inhibition of vitamin K epoxide reductase, reducing synthesis of functional factors II, VII, IX, and X', is_correct: true,
            explanation: `Correct — warfarin's mechanism, explaining the elevated INR/PT and bleeding risk.` },
          { label: 'B', choice_text: 'Direct inhibition of thrombin (factor IIa)', is_correct: false,
            explanation: `Describes dabigatran, a direct thrombin inhibitor, not warfarin.` },
          { label: 'C', choice_text: 'Direct inhibition of factor Xa', is_correct: false,
            explanation: `Describes rivaroxaban/apixaban, direct factor Xa inhibitors, not warfarin.` },
          { label: 'D', choice_text: 'Potentiation of antithrombin III activity against factors IIa and Xa', is_correct: false,
            explanation: `Describes heparin's mechanism, not warfarin's.` },
          { label: 'E', choice_text: 'Inhibition of platelet cyclooxygenase-1, reducing thromboxane A2 synthesis', is_correct: false,
            explanation: `Describes aspirin, an antiplatelet (not anticoagulant) mechanism, not warfarin.` },
        ],
      },
    ],
  },
  {
    course: 'step1',
    module: 'immunology',
    slug: 'immunology-block-1',
    title: 'Immunology — Block 1',
    description: 'A sample timed block covering hypersensitivity mechanisms, complement deficiencies, Th-cell cytokines, and B-cell immunodeficiency.',
    questions: [
      {
        stem: `A 24-year-old woman develops facial swelling, diffuse urticaria, wheezing, and hypotension within minutes of being stung by a bee. She carries a history of a similar, milder reaction to a bee sting 2 years ago.`,
        lead_in: `Which of the following mechanisms is most directly responsible for this reaction?`,
        system_tag: 'Immunology',
        difficulty: 'easy',
        explanation: `This is anaphylaxis, a type I hypersensitivity reaction. On first exposure, bee venom antigen induces IgE production, which binds FcεRI receptors on mast cells and basophils ("sensitization," explaining her prior milder reaction). On re-exposure, antigen cross-links the cell-bound IgE, triggering rapid degranulation and release of histamine and other mediators, producing the urticaria, bronchospasm, and vasodilatory hypotension seen here.`,
        educational_objective: `Recognize anaphylaxis as an IgE-mediated (type I) hypersensitivity reaction requiring prior sensitization, and distinguish it from type II-IV mechanisms.`,
        references: `First Aid for the USMLE Step 1 — Immunology: Hypersensitivity reactions.`,
        choices: [
          { label: 'A', choice_text: 'Cross-linking of allergen-specific IgE bound to mast cell and basophil Fc receptors, triggering degranulation', is_correct: true,
            explanation: `Correct — the type I hypersensitivity mechanism underlying anaphylaxis.` },
          { label: 'B', choice_text: 'Deposition of antigen-antibody complexes in tissue, activating complement', is_correct: false,
            explanation: `Describes type III hypersensitivity (e.g., serum sickness), not this immediate IgE-mediated reaction.` },
          { label: 'C', choice_text: 'Antibody-mediated cytotoxicity directed against a cell-surface antigen', is_correct: false,
            explanation: `Describes type II hypersensitivity (e.g., hemolytic transfusion reaction), not anaphylaxis.` },
          { label: 'D', choice_text: 'Sensitized T lymphocytes directly damaging tissue without antibody involvement', is_correct: false,
            explanation: `Describes type IV hypersensitivity (e.g., contact dermatitis), which is delayed (24-72 hr), not immediate like this reaction.` },
          { label: 'E', choice_text: 'Complement activation via the alternative pathway independent of antibody', is_correct: false,
            explanation: `Not the primary mechanism of an IgE-mediated sting reaction.` },
        ],
      },
      {
        stem: `A 19-year-old college student presents with his second episode of meningococcemia in the past 3 years. Family history reveals that a maternal uncle also had recurrent Neisseria infections. Screening reveals a normal total white blood cell count and normal immunoglobulin levels but an undetectable CH50 (total hemolytic complement) level.`,
        lead_in: `A deficiency of which of the following is most likely responsible for this patient's recurrent infections?`,
        system_tag: 'Immunology',
        difficulty: 'medium',
        explanation: `The membrane attack complex (C5b-C9) is responsible for directly lysing the thin outer membrane of Neisseria species; deficiencies in any of the terminal complement components (C5-C9) selectively predispose patients to recurrent Neisseria meningitidis and N. gonorrhoeae infections, often with a family history, since it is typically inherited in an autosomal recessive pattern. A CH50 of zero with normal immunoglobulins localizes the defect to the complement cascade rather than antibody production.`,
        educational_objective: `Link terminal complement (C5-C9/MAC) deficiency to recurrent Neisseria infections, and distinguish it from other complement deficiencies (C1 inhibitor, C3, DAF).`,
        references: `First Aid for the USMLE Step 1 — Immunology: Complement pathway deficiencies.`,
        choices: [
          { label: 'A', choice_text: 'Terminal complement components C5-C9 (membrane attack complex)', is_correct: true,
            explanation: `Correct — MAC deficiency selectively predisposes to recurrent Neisseria infections.` },
          { label: 'B', choice_text: 'C1 esterase inhibitor', is_correct: false,
            explanation: `Deficiency causes hereditary angioedema, not recurrent Neisseria infections.` },
          { label: 'C', choice_text: 'C3', is_correct: false,
            explanation: `C3 deficiency causes severe, recurrent infections with encapsulated pyogenic bacteria broadly, not the Neisseria-specific susceptibility of terminal component deficiency.` },
          { label: 'D', choice_text: 'Decay-accelerating factor (CD55)', is_correct: false,
            explanation: `Deficiency causes paroxysmal nocturnal hemoglobinuria (complement-mediated hemolysis), not recurrent Neisseria infections.` },
          { label: 'E', choice_text: 'Mannose-binding lectin', is_correct: false,
            explanation: `Deficiency causes mild, generally increased susceptibility to pyogenic infections in infancy, not this specific recurrent Neisseria pattern.` },
        ],
      },
      {
        stem: `A 34-year-old man has well-demarcated, erythematous plaques with silvery scale on his elbows and knees, along with pitting of several fingernails. Skin biopsy shows marked epidermal hyperplasia with elongated rete ridges and a dermal infiltrate rich in a T-helper subset known to secrete a cytokine that recruits neutrophils and stimulates keratinocyte proliferation.`,
        lead_in: `Which of the following cytokines is most directly implicated in this patient's skin disease?`,
        system_tag: 'Immunology',
        difficulty: 'medium',
        explanation: `Psoriasis is driven substantially by Th17 cells and their signature cytokine IL-17, which recruits neutrophils and stimulates keratinocyte hyperproliferation, producing the well-demarcated, scaly plaques and epidermal hyperplasia seen on biopsy. This pathway is the basis for targeted biologic therapies (e.g., secukinumab, an anti-IL-17A antibody) used in moderate-to-severe disease.`,
        educational_objective: `Identify IL-17 (Th17 pathway) as the key cytokine driving psoriasis pathology, distinct from Th1 (IFN-gamma) and Th2 (IL-4) mediated disease.`,
        references: `First Aid for the USMLE Step 1 — Immunology: T-helper cell subsets and cytokines.`,
        choices: [
          { label: 'A', choice_text: 'IL-17', is_correct: true,
            explanation: `Correct — the signature Th17 cytokine driving neutrophil recruitment and keratinocyte proliferation in psoriasis.` },
          { label: 'B', choice_text: 'IFN-gamma', is_correct: false,
            explanation: `The signature Th1 cytokine, more central to granulomatous/intracellular pathogen defense, not the primary driver targeted in psoriasis-specific biologic therapy.` },
          { label: 'C', choice_text: 'IL-4', is_correct: false,
            explanation: `The signature Th2 cytokine, driving IgE class switching and central to allergic/atopic disease, not psoriasis.` },
          { label: 'D', choice_text: 'IL-10', is_correct: false,
            explanation: `An anti-inflammatory, regulatory T cell-associated cytokine that suppresses, rather than drives, this type of inflammation.` },
          { label: 'E', choice_text: 'IL-2', is_correct: false,
            explanation: `Primarily drives T cell proliferation/survival broadly, not the specific keratinocyte-proliferative, neutrophil-recruiting pathology of psoriasis.` },
        ],
      },
      {
        stem: `A 7-month-old boy has had three episodes of otitis media and one episode of Streptococcus pneumoniae bacteremia since he was 5 months old. He was well for the first several months of life. Flow cytometry shows markedly decreased circulating B cells with normal T cell numbers, and serum immunoglobulins of all classes are markedly low.`,
        lead_in: `A defect in which of the following is most likely responsible for this patient's condition?`,
        system_tag: 'Immunology',
        difficulty: 'medium',
        explanation: `X-linked agammaglobulinemia (Bruton) results from a mutation in BTK, a tyrosine kinase required for pre-B cell receptor signaling and B cell maturation; without it, B cells arrest early in development, leading to absent/near-absent circulating B cells and panhypogammaglobulinemia. Affected boys are typically healthy for the first ~6 months of life while protected by transplacentally acquired maternal IgG, then develop recurrent infections with encapsulated bacteria as maternal antibody wanes.`,
        educational_objective: `Recognize X-linked agammaglobulinemia (BTK defect) as a cause of absent B cells and panhypogammaglobulinemia presenting after maternal antibody wanes around 6 months of age.`,
        references: `First Aid for the USMLE Step 1 — Immunology: B-cell immunodeficiencies.`,
        choices: [
          { label: 'A', choice_text: 'Bruton tyrosine kinase (BTK), required for B cell maturation', is_correct: true,
            explanation: `Correct — BTK deficiency arrests B cell development, producing absent B cells and panhypogammaglobulinemia.` },
          { label: 'B', choice_text: 'The common gamma chain shared by multiple interleukin receptors', is_correct: false,
            explanation: `Defective in X-linked SCID, which presents with combined B- and T-cell dysfunction and severe, early opportunistic infections, not this isolated B-cell defect.` },
          { label: 'C', choice_text: 'WAS gene product, required for cytoskeletal reorganization in hematopoietic cells', is_correct: false,
            explanation: `Defective in Wiskott-Aldrich syndrome, which presents with the triad of eczema, thrombocytopenia, and recurrent infections — a distinct immunologic profile.` },
          { label: 'D', choice_text: '22q11 deletion affecting thymic development', is_correct: false,
            explanation: `Causes DiGeorge syndrome, a T-cell deficiency with an absent/hypoplastic thymic shadow, not this isolated B-cell/antibody deficiency.` },
          { label: 'E', choice_text: 'CD40 ligand on activated T cells', is_correct: false,
            explanation: `Defective in hyper-IgM syndrome, where B cells are present but cannot class-switch, so IgM is normal/elevated while IgG/IgA/IgE are low — unlike the panhypogammaglobulinemia with absent B cells seen here.` },
        ],
      },
    ],
  },
  {
    course: 'step1',
    module: 'reproductive',
    slug: 'reproductive-block-1',
    title: 'Reproductive & Embryology — Block 1',
    description: 'A sample timed block covering sex chromosome disorders, androgen insensitivity, abdominal wall embryology, and pelvic surgical anatomy.',
    questions: [
      {
        stem: `A 16-year-old girl is evaluated for primary amenorrhea. She is 142 cm tall (well below the 5th percentile) and has a webbed neck, a broad chest with widely spaced nipples, and a history of a surgically repaired coarctation of the aorta in infancy. Pelvic ultrasound shows streak ovaries and a hypoplastic uterus. Karyotype reveals a 45,X pattern in most cells examined.`,
        lead_in: `Which of the following mechanisms most likely accounts for this patient's karyotype?`,
        system_tag: 'Reproductive',
        difficulty: 'easy',
        explanation: `Turner syndrome (45,X) results from meiotic nondisjunction (most often paternal loss of a sex chromosome) leading to a single X chromosome. The classic phenotype includes short stature, a webbed neck (from resolved fetal cystic hygromas), a broad "shield" chest, coarctation of the aorta, and gonadal (streak ovary) dysgenesis causing primary amenorrhea and estrogen deficiency.`,
        educational_objective: `Recognize Turner syndrome (45,X, from meiotic nondisjunction) as a cause of primary amenorrhea with short stature, webbed neck, and coarctation of the aorta.`,
        references: `First Aid for the USMLE Step 1 — Reproductive: Genetic disorders of sexual development.`,
        choices: [
          { label: 'A', choice_text: 'Meiotic nondisjunction resulting in monosomy X', is_correct: true,
            explanation: `Correct — the mechanism underlying Turner syndrome (45,X).` },
          { label: 'B', choice_text: 'Meiotic nondisjunction resulting in an additional X chromosome in a male', is_correct: false,
            explanation: `Describes Klinefelter syndrome (47,XXY), which presents in phenotypic males with testicular dysgenesis, not this phenotype.` },
          { label: 'C', choice_text: 'Robertsonian translocation involving an autosome', is_correct: false,
            explanation: `A mechanism relevant to translocation Down syndrome, not Turner syndrome.` },
          { label: 'D', choice_text: 'Uniparental disomy of chromosome 15', is_correct: false,
            explanation: `Relevant to Prader-Willi/Angelman syndromes, unrelated to this presentation.` },
          { label: 'E', choice_text: 'Trinucleotide repeat expansion', is_correct: false,
            explanation: `A mechanism of diseases like fragile X syndrome or Huntington disease, not a chromosomal monosomy.` },
        ],
      },
      {
        stem: `A 17-year-old phenotypic female presents for evaluation of primary amenorrhea. She has normal breast development but sparse axillary and pubic hair. Pelvic examination reveals a blind-ending vaginal pouch and no palpable cervix or uterus on ultrasound. Karyotype is 46,XY, and testes are found in the inguinal canals bilaterally.`,
        lead_in: `Which of the following best explains this patient's phenotype?`,
        system_tag: 'Reproductive',
        difficulty: 'hard',
        explanation: `Complete androgen insensitivity syndrome results from a mutation in the androgen receptor, so a 46,XY individual with functioning testes cannot respond to testosterone/DHT — external genitalia and secondary sexual development default to a female phenotype (peripheral aromatization of testosterone to estradiol drives normal breast development), pubic/axillary hair is sparse (androgen-dependent), and the testes (still secreting anti-Müllerian hormone normally) cause regression of the Müllerian structures (uterus, upper vagina, fallopian tubes), explaining the blind vaginal pouch and absent uterus.`,
        educational_objective: `Recognize complete androgen insensitivity syndrome (46,XY, androgen receptor defect) as a cause of a female phenotype with normal breasts, sparse body hair, absent uterus, and intra-abdominal/inguinal testes.`,
        references: `First Aid for the USMLE Step 1 — Reproductive: Disorders of sexual differentiation.`,
        choices: [
          { label: 'A', choice_text: 'A mutation in the androgen receptor causing peripheral resistance to testosterone and dihydrotestosterone', is_correct: true,
            explanation: `Correct — explains normal (estrogen-driven) breast development, sparse androgen-dependent hair, and Müllerian regression from intact AMH secretion.` },
          { label: 'B', choice_text: 'Deficiency of 5-alpha-reductase, impairing conversion of testosterone to dihydrotestosterone', is_correct: false,
            explanation: `Typically presents with ambiguous or predominantly male-appearing external genitalia at birth that virilizes further at puberty, since rising testosterone still acts via intact androgen receptors — not this fully female phenotype with normal breast development.` },
          { label: 'C', choice_text: 'Complete gonadal dysgenesis (Swyer syndrome) with absent testosterone production', is_correct: false,
            explanation: `Would show absent breast development at puberty (no peripheral aromatization of testicular androgens to estrogen, since there are no functioning testes) and typically a uterus present, since testes never form to secrete anti-Müllerian hormone.` },
          { label: 'D', choice_text: '21-hydroxylase deficiency causing excess fetal androgen exposure', is_correct: false,
            explanation: `This is congenital adrenal hyperplasia, which virilizes a 46,XX fetus, not the pattern seen in a 46,XY individual with testes.` },
          { label: 'E', choice_text: 'Kallmann syndrome with isolated GnRH deficiency', is_correct: false,
            explanation: `Presents with absent puberty (no breast development, amenorrhea) and anosmia, not with this androgen-resistant phenotype and palpable testes.` },
        ],
      },
      {
        stem: `A newborn is delivered with loops of bowel protruding through a defect in the abdominal wall to the right of an intact, normally inserted umbilical cord. The exposed bowel is not covered by any membrane or sac and appears edematous and matted.`,
        lead_in: `Which of the following is the most likely diagnosis?`,
        system_tag: 'Reproductive',
        difficulty: 'easy',
        explanation: `Gastroschisis is a paraumbilical (usually right-sided) full-thickness abdominal wall defect, lateral to a normally inserted umbilical cord, through which uncovered bowel herniates and is exposed directly to amniotic fluid (accounting for the edematous, matted appearance). This contrasts with omphalocele, a defect at the umbilical ring itself with herniated viscera covered by a peritoneal/amniotic sac, which is more strongly associated with other congenital anomalies.`,
        educational_objective: `Distinguish gastroschisis (paraumbilical, uncovered bowel) from omphalocele (through the umbilical ring, sac-covered, associated anomalies).`,
        references: `First Aid for the USMLE Step 1 — Reproductive: Abdominal wall and embryologic malformations.`,
        choices: [
          { label: 'A', choice_text: 'Gastroschisis', is_correct: true,
            explanation: `Correct — a paraumbilical defect with uncovered, exposed bowel, exactly as described.` },
          { label: 'B', choice_text: 'Omphalocele', is_correct: false,
            explanation: `Bowel herniates through the umbilical ring itself (not lateral to it) and remains covered by a peritoneal/amniotic membrane, often with other congenital anomalies.` },
          { label: 'C', choice_text: 'Umbilical hernia', is_correct: false,
            explanation: `A skin-covered protrusion through an incompletely closed umbilical ring, not exposed, uncovered bowel.` },
          { label: 'D', choice_text: 'Diaphragmatic hernia', is_correct: false,
            explanation: `Abdominal viscera herniate into the thoracic cavity through a diaphragmatic defect, not through the anterior abdominal wall.` },
          { label: 'E', choice_text: 'Meckel diverticulum', is_correct: false,
            explanation: `A true diverticulum of the ileum from incomplete vitelline duct obliteration, unrelated to an abdominal wall defect.` },
        ],
      },
      {
        stem: `A 44-year-old woman undergoes an uncomplicated-appearing total abdominal hysterectomy for symptomatic fibroids. On postoperative day 3, she develops flank pain and is found to have new-onset right hydronephrosis on ultrasound, with clear fluid draining from her vaginal cuff incision.`,
        lead_in: `Injury to the right ureter during ligation of which of the following structures most likely explains this complication?`,
        system_tag: 'Reproductive',
        difficulty: 'medium',
        explanation: `Classically remembered as "water [ureter] under the bridge [uterine artery]," the ureter passes inferior and posterior to the uterine artery approximately 2 cm lateral to the cervix, making it vulnerable to inadvertent clamping, ligation, or transection during ligation of the uterine vessels at hysterectomy. Injury here can present with flank pain, hydronephrosis, or a urine leak (vaginal cuff drainage, as in this patient) postoperatively.`,
        educational_objective: `Recall the "water under the bridge" relationship — the ureter passing beneath the uterine artery near the cervix — as the classic site of iatrogenic ureteral injury during hysterectomy.`,
        references: `First Aid for the USMLE Step 1 — Reproductive: Female pelvic anatomy.`,
        choices: [
          { label: 'A', choice_text: 'Uterine artery, at the level of the cervix, where the ureter passes directly beneath it', is_correct: true,
            explanation: `Correct — the classic "water under the bridge" site of ureteral injury during hysterectomy.` },
          { label: 'B', choice_text: 'Ovarian artery, within the infundibulopelvic ligament, where the ureter passes posterior to it near the pelvic brim', is_correct: false,
            explanation: `A genuine at-risk crossing point, but not the classic, most frequently tested "water under the bridge" relationship, which specifically refers to the uterine artery crossing near the cervix.` },
          { label: 'C', choice_text: 'Round ligament', is_correct: false,
            explanation: `The ureter does not have a direct crossing relationship with the round ligament analogous to "water under the bridge."` },
          { label: 'D', choice_text: 'Uterosacral ligament, at its attachment to the sacrum', is_correct: false,
            explanation: `The ureter runs near the uterosacral ligament along the pelvic sidewall, but the classic, most frequently injured crossing point in hysterectomy is at the uterine artery, not here.` },
          { label: 'E', choice_text: 'Broad ligament, at its most lateral free edge', is_correct: false,
            explanation: `The broad ligament is a peritoneal fold within which the uterine vessels and ureter both travel, but it is the specific uterine artery crossing, not the broad ligament's free edge generally, that is the named "water under the bridge" relationship.` },
        ],
      },
    ],
  },
  {
    course: 'step2ck',
    module: 'step2-clinical',
    slug: 'step2-clinical-block-1',
    title: 'Clinical & Surgical Correlation — Block 1',
    description: 'A sample timed block in Step 2 CK management-reasoning style, covering STEMI triage, acute appendicitis, DKA management, and trauma evaluation.',
    questions: [
      {
        stem: `A 61-year-old man presents to the emergency department with 45 minutes of crushing substernal chest pain radiating to his left arm, associated with diaphoresis and nausea. ECG shows 3-mm ST-segment elevations in leads II, III, and aVF with reciprocal depressions in I and aVL. A right-sided ECG confirms ST elevation in V4R. Vital signs show blood pressure 96/60 mmHg and heart rate 58/min.`,
        lead_in: `Which of the following is the most appropriate next step in management?`,
        system_tag: 'Cardiology',
        difficulty: 'medium',
        explanation: `This is an inferior STEMI (II, III, aVF) with right ventricular involvement (V4R ST elevation), which requires immediate reperfusion — primary PCI is preferred over fibrinolysis when available within guideline time windows. Nitrates and other preload-reducing agents should be avoided in RV infarction because these patients depend on adequate right-sided filling pressure to maintain cardiac output, and can develop profound hypotension.`,
        educational_objective: `Recognize inferior STEMI with right ventricular involvement, know that emergent PCI is the preferred reperfusion strategy, and avoid preload-reducing agents (nitrates) in RV infarction.`,
        references: `First Aid for the USMLE Step 2 CK — Cardiovascular: Acute coronary syndromes.`,
        choices: [
          { label: 'A', choice_text: 'Emergent cardiac catheterization with percutaneous coronary intervention', is_correct: true,
            explanation: `Correct — timely PCI is the preferred reperfusion strategy for STEMI when available.` },
          { label: 'B', choice_text: 'Administration of sublingual nitroglycerin', is_correct: false,
            explanation: `Contraindicated here, since this ST pattern indicates a preload-dependent right ventricular infarct, and nitrates can precipitate severe hypotension.` },
          { label: 'C', choice_text: 'Intravenous thrombolytic therapy alone, without catheterization', is_correct: false,
            explanation: `PCI at a capable facility is preferred over fibrinolysis when it can be performed within the guideline-recommended time window; fibrinolytics are the fallback when timely PCI is unavailable.` },
          { label: 'D', choice_text: 'Beta-blocker administration prior to reperfusion therapy', is_correct: false,
            explanation: `Relatively contraindicated here given the bradycardia and borderline hypotension, and reperfusion should not be delayed for it.` },
          { label: 'E', choice_text: 'CT angiography of the chest to exclude aortic dissection before proceeding', is_correct: false,
            explanation: `The ECG findings are diagnostic of an inferior/right ventricular STEMI; delaying reperfusion for imaging in this classic presentation risks additional myocardial loss.` },
        ],
      },
      {
        stem: `A 22-year-old previously healthy man presents with 18 hours of periumbilical pain that has migrated to and localized in the right lower quadrant, accompanied by anorexia, nausea, and a low-grade fever. Examination shows focal tenderness and guarding at McBurney point with a positive psoas sign. Leukocyte count is 14,200/mm3.`,
        lead_in: `Which of the following is the most appropriate next step in management?`,
        system_tag: 'General Surgery',
        difficulty: 'easy',
        explanation: `This patient has a classic clinical presentation of acute appendicitis (periumbilical pain migrating to the RLQ, anorexia, low-grade fever, McBurney point tenderness, positive psoas sign, leukocytosis). When the clinical picture is this classic, prompt surgical consultation for appendectomy is appropriate; imaging (CT or ultrasound) is most useful when the presentation is atypical or the diagnosis is uncertain (e.g., in young women, where gynecologic causes must be excluded).`,
        educational_objective: `Recognize classic acute appendicitis and know that a clinically clear presentation warrants prompt surgical evaluation rather than further diagnostic delay.`,
        references: `First Aid for the USMLE Step 2 CK — Surgery: Acute abdomen and appendicitis.`,
        choices: [
          { label: 'A', choice_text: 'Surgical consultation for appendectomy', is_correct: true,
            explanation: `Correct — the appropriate next step for a classic acute appendicitis presentation.` },
          { label: 'B', choice_text: 'Reassurance and outpatient follow-up in 48 hours', is_correct: false,
            explanation: `This presentation warrants prompt surgical evaluation given the risk of perforation, not outpatient observation.` },
          { label: 'C', choice_text: 'Colonoscopy to evaluate for inflammatory bowel disease', is_correct: false,
            explanation: `Not indicated as an initial step in a classic acute appendicitis presentation, and could be unsafe in a potentially inflamed, perforation-prone bowel.` },
          { label: 'D', choice_text: 'Empiric oral antibiotics with discharge home', is_correct: false,
            explanation: `Nonoperative antibiotic-only management is an evolving option in select uncomplicated cases, but the standard next step for this classic presentation — especially with an elevated WBC and a positive psoas sign suggesting more advanced disease — remains surgical evaluation.` },
          { label: 'E', choice_text: 'Barium enema', is_correct: false,
            explanation: `Not appropriate in suspected acute appendicitis and carries a risk of precipitating perforation.` },
        ],
      },
      {
        stem: `A 19-year-old woman with type 1 diabetes mellitus is brought to the emergency department with 2 days of polyuria, polydipsia, and vomiting. She is tachypneic with deep, labored breathing. Laboratory studies show glucose 480 mg/dL, sodium 132 mEq/L, potassium 5.2 mEq/L, bicarbonate 9 mEq/L, and arterial pH 7.14. Serum and urine ketones are strongly positive.`,
        lead_in: `Which of the following is the most appropriate initial step in management?`,
        system_tag: 'Internal Medicine',
        difficulty: 'medium',
        explanation: `The initial priority in DKA management is aggressive isotonic (normal saline) fluid resuscitation, which improves perfusion, begins to lower glucose by dilution and improved renal clearance, and helps correct the effective circulating volume before insulin therapy is initiated. Insulin should be started shortly after fluids (once potassium is confirmed not to be low, since insulin will shift potassium intracellularly), with potassium repletion added to the fluids once levels are known.`,
        educational_objective: `Sequence DKA management correctly: isotonic fluids first, then insulin (with potassium monitoring/repletion), and know when bicarbonate is (rarely) indicated.`,
        references: `First Aid for the USMLE Step 2 CK — Endocrinology: Diabetic ketoacidosis management.`,
        choices: [
          { label: 'A', choice_text: 'Isotonic intravenous fluid resuscitation', is_correct: true,
            explanation: `Correct — the appropriate first step, restoring volume before insulin is started.` },
          { label: 'B', choice_text: 'Immediate intravenous insulin bolus followed by a continuous infusion', is_correct: false,
            explanation: `Should follow initiation of fluids and confirmation that potassium is not already low, since insulin drives potassium intracellularly and can precipitate dangerous hypokalemia and arrhythmia if given first.` },
          { label: 'C', choice_text: 'Intravenous sodium bicarbonate to correct the acidemia', is_correct: false,
            explanation: `Not routinely given in DKA except in cases of extreme acidemia (e.g., pH <6.9), since it can worsen hypokalemia and cause paradoxical CNS acidosis; it is not needed here as fluids and insulin will correct the acidosis.` },
          { label: 'D', choice_text: 'Empiric broad-spectrum antibiotics', is_correct: false,
            explanation: `Not indicated without evidence of a precipitating infection; treatment should target the metabolic derangement first.` },
          { label: 'E', choice_text: 'Potassium chloride infusion prior to any fluids or insulin', is_correct: false,
            explanation: `This patient's potassium is currently normal-high (though total body potassium is actually depleted); potassium repletion is guided by ongoing labs once insulin therapy begins, not given empirically before fluids.` },
        ],
      },
      {
        stem: `A 29-year-old man is brought to the emergency department after a high-speed motor vehicle collision. He is confused, with a blood pressure of 78/48 mmHg and heart rate of 128/min despite two liters of crystalloid infusion. A focused assessment with sonography for trauma (FAST) examination shows free fluid in the perihepatic and perisplenic spaces.`,
        lead_in: `Which of the following is the most appropriate next step in management?`,
        system_tag: 'Trauma Surgery',
        difficulty: 'medium',
        explanation: `In a hemodynamically unstable trauma patient with a positive FAST examination (free intraperitoneal fluid, presumed hemoperitoneum), the appropriate next step is emergent exploratory laparotomy for hemorrhage control, not further imaging (CT), which is reserved for hemodynamically stable patients where organ-specific characterization can safely guide nonoperative versus operative management.`,
        educational_objective: `Apply the trauma algorithm correctly: an unstable patient with a positive FAST goes directly to the operating room, while CT imaging is reserved for the hemodynamically stable patient.`,
        references: `First Aid for the USMLE Step 2 CK — Surgery: Trauma evaluation and the FAST exam.`,
        choices: [
          { label: 'A', choice_text: 'Emergent exploratory laparotomy', is_correct: true,
            explanation: `Correct — the appropriate next step for an unstable patient with a positive FAST exam.` },
          { label: 'B', choice_text: 'CT scan of the abdomen and pelvis with intravenous contrast', is_correct: false,
            explanation: `Appropriate for a hemodynamically stable trauma patient, but not for this patient, who remains unstable despite resuscitation and needs immediate hemorrhage control rather than further imaging.` },
          { label: 'C', choice_text: 'Continued crystalloid resuscitation with serial abdominal exams', is_correct: false,
            explanation: `This patient has already failed to stabilize with 2 liters of crystalloid and has a positive FAST, indicating ongoing intra-abdominal hemorrhage requiring surgical control, not continued observation.` },
          { label: 'D', choice_text: 'Diagnostic peritoneal lavage', is_correct: false,
            explanation: `Largely supplanted by FAST in modern trauma algorithms, and would add delay without changing management once FAST is already positive in an unstable patient.` },
          { label: 'E', choice_text: 'Discharge with outpatient surgical follow-up', is_correct: false,
            explanation: `Inappropriate and unsafe given hemodynamic instability and evidence of significant hemoperitoneum.` },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Seeds one qbank_blocks row + its qbank_questions + qbank_choices for each
// entry in QBANK_MODULE_BLOCKS. Re-running is safe: blocks are upserted on
// slug and each block's questions are deleted before being re-inserted
// (cascades to their choices), same pattern as seedSampleQBankBlock().
// ---------------------------------------------------------------------------
async function seedModuleQBankBlocks(courseIdBySlug, moduleIdBySlug) {
  let totalBlocks = 0;
  let totalQuestions = 0;

  for (const [i, blockDef] of QBANK_MODULE_BLOCKS.entries()) {
    const { data: block, error: blockErr } = await supabase
      .from('qbank_blocks')
      .upsert(
        {
          slug: blockDef.slug,
          title: blockDef.title,
          description: blockDef.description,
          course_id: courseIdBySlug[blockDef.course],
          module_id: moduleIdBySlug[blockDef.module],
          time_limit_sec: 3600,
          mode_default: 'tutor',
          sort_order: i + 2, // cardiovascular-block-1 (from seedSampleQBankBlock) is sort_order 1
        },
        { onConflict: 'slug' }
      )
      .select()
      .single();
    if (blockErr) throw blockErr;

    const { error: delErr } = await supabase.from('qbank_questions').delete().eq('block_id', block.id);
    if (delErr) throw delErr;

    for (const [qi, q] of blockDef.questions.entries()) {
      const { data: question, error: qErr } = await supabase
        .from('qbank_questions')
        .insert({
          block_id: block.id,
          position: qi + 1,
          stem: q.stem,
          lead_in: q.lead_in,
          system_tag: q.system_tag,
          difficulty: q.difficulty,
          explanation: q.explanation,
          educational_objective: q.educational_objective,
          references: q.references,
        })
        .select()
        .single();
      if (qErr) throw qErr;

      const choiceRows = q.choices.map((c, ci) => ({
        question_id: question.id,
        label: c.label,
        choice_text: c.choice_text,
        is_correct: c.is_correct,
        explanation: c.explanation,
        sort_order: ci + 1,
      }));
      const { error: chErr } = await supabase.from('qbank_choices').insert(choiceRows);
      if (chErr) throw chErr;

      totalQuestions += 1;
    }

    totalBlocks += 1;
    console.log(`Seeded QBank block "${blockDef.title}" with ${blockDef.questions.length} question(s).`);
  }

  console.log(`Seeded ${totalBlocks} module QBank block(s) with ${totalQuestions} total question(s).`);
}

async function main() {
  console.log('Seeding Supabase project...');
  const courseIdBySlug = await upsertCourses();
  const moduleIdBySlug = await upsertModules(courseIdBySlug);
  await upsertIllustrations(moduleIdBySlug);
  await seedPathways(moduleIdBySlug);
  await seedSampleQBankBlock(courseIdBySlug, moduleIdBySlug);
  await seedModuleQBankBlocks(courseIdBySlug, moduleIdBySlug);
  console.log('Done.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
