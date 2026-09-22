// supabase/seed_pathophysiology.js — populates pathophysiology_topics, the
// symptom-first "Pathophysiology" tab (see schema_pathophysiology.sql /
// public/pathophysiology.js). One row per presenting complaint (not per
// disease) — given this symptom, what's the differential, and what's the
// actual mechanism behind each item on it. Distinct from clinical_topics
// (disease-first deep-dives, seed_topics.js) and flashcards (compact recall
// cards, seed.js).
// Run with: node supabase/seed_pathophysiology.js
//
// Multiple agents are contributing different symptom clusters to the same
// PATHOPHYSIOLOGY_TOPICS array in parallel. If you're adding a new cluster,
// APPEND your topic objects to the array below rather than replacing it, and
// keep each cluster's entries grouped together with a comment banner so
// merges stay easy to read.
//
// All framing/exam-findings/DDx/mechanisms are original writing — not
// reproduced from any commercial USMLE prep book or question bank.
//
// Uses the SERVICE ROLE key (bypasses RLS) — set SUPABASE_SERVICE_KEY in
// your .env before running this. Never run this from the browser or commit
// the key.

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const PATHOPHYSIOLOGY_TOPICS = [
  // ===========================================================================
  // Cluster — Cardiopulmonary
  // ===========================================================================
  {
    slug: "chest-pain",
    title: "Chest Pain",
    system_tag: "Cardiopulmonary",
    sort_order: 1,

    big_picture:
      "Chest pain forces a rapid sort across four broad buckets: cardiac (ischemic, from demand-supply mismatch in coronary disease, to non-ischemic causes like pericarditis or aortic pathology), pulmonary (parenchymal, pleural, or vascular), gastrointestinal (esophageal, gastric, or biliary), and musculoskeletal or psychiatric causes that are common but only become diagnoses of exclusion once something dangerous has been ruled out. The two features that most change management urgency are hemodynamic instability and a hemodynamically threatening pattern — tearing pain radiating to the back, sudden dyspnea with hypoxia, or pain with diaphoresis and exertion — since these point toward a process that can kill within minutes to hours: acute coronary occlusion, aortic dissection, tension pneumothorax, or a large pulmonary embolism. Reproducibility with palpation or a pleuritic, positional quality lowers but does not eliminate the probability of a dangerous cause, since inflammatory and even some ischemic pain can also vary with position or breathing. History, exam, and a handful of bedside tests (ECG, troponin, D-dimer or CT angiography, chest x-ray) are used together, not any single feature in isolation, to separate the can't-miss diagnoses from the far more common benign ones.",

    exam_findings:
      "Diaphoresis with an S4 gallop or a new murmur of mitral regurgitation — suggests acute myocardial ischemia/infarction with papillary muscle dysfunction\nBlood pressure or pulse discrepancy between the two arms, a new diastolic murmur of aortic regurgitation, or unequal peripheral pulses — suggests aortic dissection\nTachycardia and tachypnea with unilateral calf swelling or tenderness — suggests pulmonary embolism with a source DVT\nAbsent breath sounds unilaterally with hyperresonance to percussion and tracheal deviation away from that side — suggests tension pneumothorax\nA pericardial friction rub, with pain that improves sitting forward and worsens lying supine — suggests acute pericarditis\nPoint tenderness that exactly reproduces the pain on palpation of a costosternal or costochondral junction — suggests costochondritis\nEpigastric tenderness with pain related to meals or lying flat and relief with antacids — suggests a GI source (GERD, peptic disease)\nA young, otherwise well patient with a normal cardiopulmonary exam and situational triggers with hyperventilation — suggests panic disorder, though this remains a diagnosis of exclusion",

    ddx: [
      {
        condition: "ACS / unstable angina",
        key_features:
          "Pressure-like substernal pain, often with exertion or at rest if unstable, radiating to the arm or jaw, with diaphoresis or dyspnea; ECG ST changes and/or elevated troponin",
        mechanism:
          "A ruptured or eroded atherosclerotic plaque triggers platelet aggregation and thrombus formation that critically narrows or occludes a coronary artery, producing myocardial oxygen supply-demand mismatch and ischemia (or infarction if supply is cut off long enough for myocyte death).",
      },
      {
        condition: "Aortic dissection",
        key_features:
          "Abrupt, tearing or ripping pain radiating to the back, a blood pressure differential between arms, a widened mediastinum on chest x-ray",
        mechanism:
          "A tear in the aortic intima allows blood to dissect into and split the media, creating a false lumen; this can occlude branch vessels (producing the pulse deficits) and stretch or disrupt the aortic wall, producing the pain.",
      },
      {
        condition: "Pulmonary embolism",
        key_features:
          "Pleuritic chest pain with acute dyspnea and tachycardia, often a predisposing risk factor (immobility, malignancy, recent surgery), hypoxia out of proportion to the exam",
        mechanism:
          "A venous thrombus, usually from a lower-extremity DVT, embolizes to the pulmonary arterial circulation, obstructing blood flow and creating V/Q mismatch and right ventricular strain; pleuritic pain appears when a peripheral, pleura-adjacent segment infarcts.",
      },
      {
        condition: "Acute pericarditis",
        key_features:
          "Sharp, pleuritic pain that improves leaning forward and worsens lying supine, a pericardial friction rub, diffuse ST elevation with PR depression on ECG",
        mechanism:
          "Inflammation of the pericardium (viral, autoimmune, post-MI, or uremic) irritates adjacent pain-sensitive pericardial and pleural surfaces, and posture changes the contact and pressure between the inflamed layers, altering pain intensity.",
      },
      {
        condition: "Spontaneous pneumothorax",
        key_features:
          "Sudden unilateral pleuritic pain with dyspnea in a tall, thin young patient (primary) or one with underlying lung disease (secondary); decreased breath sounds and hyperresonance on the affected side",
        mechanism:
          "Air enters the pleural space, often through a ruptured subpleural bleb or damaged lung parenchyma, collapsing the underlying lung and stretching the parietal pleura, which produces the pain and reduces ventilation on that side.",
      },
      {
        condition: "GERD / esophageal reflux",
        key_features:
          "Burning retrosternal discomfort related to meals, lying flat, or bending over, often with a sour taste or regurgitation, relieved by antacids",
        mechanism:
          "Transient or persistent lower esophageal sphincter relaxation lets acidic gastric contents reflux into the esophagus, chemically irritating esophageal mucosa that is richly innervated by visceral afferents overlapping cardiac pain pathways.",
      },
      {
        condition: "Costochondritis",
        key_features:
          "Pain reproduced precisely by palpating the costosternal or costochondral joints, worsened by movement or deep breathing, normal cardiac workup",
        mechanism:
          "Inflammation of the costochondral or costosternal cartilage, often after minor strain or a viral illness, sensitizes local nociceptors, so mechanical pressure or chest wall movement directly provokes pain.",
      },
      {
        condition: "Panic disorder",
        key_features:
          "Recurrent episodes of chest tightness with palpitations, a sense of impending doom, paresthesias, and hyperventilation, often in a young patient with a normal cardiopulmonary workup",
        mechanism:
          "An acute sympathetic surge and hyperventilation produce chest tightness and a subjective sense of chest pressure and, through respiratory-alkalosis-related cerebral vasoconstriction, the associated paresthesias, without any structural cardiopulmonary pathology.",
      },
    ],
  },

  {
    slug: "dyspnea",
    title: "Dyspnea",
    system_tag: "Cardiopulmonary",
    sort_order: 2,

    big_picture:
      "Dyspnea reflects a mismatch between the demand for ventilation and the body's ability to meet it, and the differential splits broadly into cardiac causes (pump failure raising pulmonary venous pressure), pulmonary causes (airway, parenchymal, pleural, or vascular disease impairing gas exchange or mechanics), and a long list of non-cardiopulmonary drivers — anemia reducing oxygen-carrying capacity, metabolic acidosis provoking compensatory tachypnea, neuromuscular weakness limiting the respiratory pump, deconditioning, and anxiety-driven hyperventilation. Tempo matters as much as category: acute dyspnea over minutes to hours raises concern for pulmonary embolism, pneumothorax, acute pulmonary edema, or anaphylaxis, while chronic progressive dyspnea points toward COPD, interstitial lung disease, or chronic heart failure. The red flags that change management urgency are hypoxia, use of accessory respiratory muscles or inability to speak in full sentences, altered mental status, and stridor suggesting impending upper airway obstruction — any of these warrants immediate stabilization before the workup proceeds further.",

    exam_findings:
      "Bilateral crackles with an S3 gallop, jugular venous distension, and dependent edema — suggests cardiogenic pulmonary edema/heart failure\nDiffuse wheezing with a prolonged expiratory phase and reduced air movement — suggests an obstructive airway process (asthma or COPD exacerbation)\nUnilateral dullness to percussion with decreased breath sounds and decreased tactile fremitus — suggests a pleural effusion or consolidation\nUnilateral hyperresonance with absent breath sounds and tracheal deviation — suggests pneumothorax\nTachycardia and tachypnea with clear lung fields and unilateral leg swelling — suggests pulmonary embolism\nInspiratory stridor with a muffled voice — suggests upper airway obstruction (foreign body, angioedema, epiglottitis)\nPallor with a flow murmur and tachycardia but no pulmonary findings — suggests anemia as the driver\nDigital clubbing with fine end-inspiratory crackles — suggests chronic interstitial lung disease",

    ddx: [
      {
        condition: "Acute decompensated heart failure / cardiogenic pulmonary edema",
        key_features:
          "Orthopnea, paroxysmal nocturnal dyspnea, an S3 gallop, bilateral crackles, elevated BNP, bilateral interstitial edema on chest x-ray",
        mechanism:
          "Elevated left ventricular filling pressure, from systolic or diastolic dysfunction, transmits backward into the pulmonary veins and capillaries, raising hydrostatic pressure until fluid transudates into the alveolar interstitium and airspaces, impairing gas exchange.",
      },
      {
        condition: "Asthma exacerbation",
        key_features:
          "Episodic wheeze and dyspnea often triggered by allergens, cold air, or exercise, a history of atopy, improvement with bronchodilators",
        mechanism:
          "Airway hyperresponsiveness with bronchial smooth muscle constriction, mucosal edema, and mucus hypersecretion narrows the airway lumen, increasing airway resistance and trapping air distally.",
      },
      {
        condition: "COPD exacerbation",
        key_features:
          "Long smoking history, chronic productive cough, increased dyspnea or sputum purulence during the exacerbation, prolonged expiration",
        mechanism:
          "Chronic destruction of alveolar septa (emphysema) and small-airway inflammation and narrowing (chronic bronchitis) reduce elastic recoil and increase airway resistance, and an acute trigger such as infection worsens airflow obstruction and dynamic hyperinflation.",
      },
      {
        condition: "Pulmonary embolism",
        key_features:
          "Sudden dyspnea with pleuritic pain, tachycardia, hypoxia, a predisposing risk factor for venous thromboembolism, clear lung auscultation",
        mechanism:
          "Embolic obstruction of the pulmonary vasculature creates dead-space ventilation (ventilated but underperfused alveoli) and reflex bronchoconstriction and surfactant dysfunction in the affected territory, worsening V/Q mismatch and hypoxemia.",
      },
      {
        condition: "Pneumonia",
        key_features:
          "Fever, productive cough, pleuritic pain, focal crackles or bronchial breath sounds, a lobar infiltrate on imaging",
        mechanism:
          "Infectious inflammation fills alveoli with exudate (consolidation), which cannot participate in gas exchange, creating an intrapulmonary shunt and reducing effective oxygenation while also stimulating a tachypneic drive.",
      },
      {
        condition: "Pneumothorax",
        key_features:
          "Sudden pleuritic dyspnea with unilateral absent breath sounds and hyperresonance, often in a tall thin young patient or one with underlying lung disease",
        mechanism:
          "Air in the pleural space collapses the ipsilateral lung, reducing the surface area available for gas exchange and, if under tension, compressing the mediastinum and impairing venous return.",
      },
      {
        condition: "Anemia",
        key_features:
          "Pallor, fatigue, exertional dyspnea, tachycardia, a flow murmur, low hemoglobin on labs",
        mechanism:
          "Reduced circulating hemoglobin lowers blood oxygen-carrying capacity, so tissue oxygen delivery falls at any given cardiac output, and the body compensates with tachycardia and increased minute ventilation, which is perceived as dyspnea.",
      },
      {
        condition: "Anxiety-related hyperventilation",
        key_features:
          "A situational trigger, paresthesias, lightheadedness, normal oxygen saturation, a normal cardiopulmonary exam, resolution with reassurance or breathing coaching",
        mechanism:
          "Voluntary or sympathetically driven overbreathing lowers arterial CO2 (respiratory alkalosis), causing cerebral vasoconstriction and paresthesias that are misperceived as worsening air hunger, perpetuating the hyperventilation cycle despite normal oxygenation.",
      },
    ],
  },

  {
    slug: "palpitations",
    title: "Palpitations",
    system_tag: "Cardiopulmonary",
    sort_order: 3,

    big_picture:
      "Palpitations — an unpleasant awareness of one's own heartbeat — arise from true arrhythmias (tachyarrhythmias such as atrial fibrillation, supraventricular tachycardia, or ventricular tachycardia, and less often bradyarrhythmias), structural heart disease such as mitral valve prolapse, high-output or hyperadrenergic states (anemia, hyperthyroidism, fever, pregnancy, stimulant or caffeine use, pheochromocytoma), and psychiatric causes such as panic disorder, which is common but must remain a diagnosis of exclusion. The features that most raise concern and change management urgency are palpitations accompanied by syncope or near-syncope, exertional onset, associated chest pain, or a family history of sudden cardiac death or an inherited arrhythmia syndrome — these suggest a potentially life-threatening arrhythmia or structural substrate rather than a benign cause. Correlating the sensation with an actual rhythm, via ECG during an episode or ambulatory monitoring, is often more useful than the description of the palpitations themselves, since the same subjective sensation can arise from entirely different mechanisms.",

    exam_findings:
      "An irregularly irregular pulse — suggests atrial fibrillation\nA regular, rapid rate that starts and stops abruptly and terminates with vagal maneuvers — suggests AV nodal reentrant tachycardia or another supraventricular tachycardia\nA wide-complex, regular tachycardia with hemodynamic compromise — raises concern for ventricular tachycardia\nExophthalmos, a diffusely enlarged thyroid, warm moist skin, and a fine tremor — suggests hyperthyroidism\nPallor, tachycardia, and a systolic flow murmur — suggests anemia\nEpisodic severe hypertension with headache and diaphoresis, normal exam between episodes — suggests pheochromocytoma\nA mid-systolic click with or without a late systolic murmur — suggests mitral valve prolapse\nA normal cardiac exam between episodes in an anxious patient with situational triggers — suggests panic disorder, though this remains a diagnosis of exclusion after arrhythmia is reasonably excluded",

    ddx: [
      {
        condition: "Atrial fibrillation",
        key_features:
          "Irregularly irregular pulse, absent P waves with an irregularly irregular ventricular response on ECG, often in a patient with hypertension, structural heart disease, or hyperthyroidism",
        mechanism:
          "Multiple chaotic reentrant wavelets or rapidly firing ectopic foci, often near the pulmonary vein ostia, depolarize the atria in a disorganized and continuous fashion, and the AV node conducts an irregular subset of these impulses to the ventricles.",
      },
      {
        condition: "AV nodal reentrant tachycardia (SVT)",
        key_features:
          "Sudden-onset, sudden-offset regular rapid palpitations, terminated by vagal maneuvers or adenosine, a narrow-complex tachycardia on ECG",
        mechanism:
          "A functional reentry circuit forms using two pathways with different conduction velocities and refractory periods within or near the AV node, allowing an impulse to circulate repeatedly and drive the atria and ventricles at a rapid, regular rate.",
      },
      {
        condition: "Ventricular tachycardia",
        key_features:
          "Wide-complex regular tachycardia, often in a patient with structural heart disease or a prior myocardial infarction, may present with syncope or hemodynamic instability",
        mechanism:
          "A reentrant circuit or abnormal automaticity within scarred or diseased ventricular myocardium generates rapid ventricular depolarizations that bypass the normal His-Purkinje sequence, producing wide QRS complexes and, if sustained, compromising cardiac output.",
      },
      {
        condition: "Hyperthyroidism",
        key_features:
          "Weight loss, heat intolerance, tremor, lid lag, a diffuse goiter, suppressed TSH with elevated free T4/T3",
        mechanism:
          "Excess thyroid hormone upregulates cardiac beta-adrenergic receptor density and sensitivity and directly increases sinus node automaticity, producing sinus tachycardia and predisposing to atrial fibrillation.",
      },
      {
        condition: "Anemia",
        key_features:
          "Fatigue, pallor, exertional palpitations, a systolic flow murmur, low hemoglobin",
        mechanism:
          "Reduced oxygen-carrying capacity triggers a compensatory increase in heart rate and stroke volume to maintain tissue oxygen delivery, and the increased cardiac output is perceived as palpitations.",
      },
      {
        condition: "Pheochromocytoma",
        key_features:
          "Episodic palpitations, headache, and diaphoresis with paroxysmal severe hypertension, elevated plasma or urine metanephrines",
        mechanism:
          "A catecholamine-secreting adrenal (or extra-adrenal) chromaffin tumor episodically releases epinephrine and norepinephrine, directly stimulating cardiac beta-1 receptors to increase heart rate and contractility.",
      },
      {
        condition: "Panic disorder",
        key_features:
          "Recurrent discrete episodes of palpitations with a sense of impending doom, diaphoresis, and paresthesias, a normal cardiac workup between and during episodes",
        mechanism:
          "An acute surge of sympathetic outflow increases heart rate and contractility, while hyperventilation-driven hypocapnia contributes to the associated paresthesias and lightheadedness, without any underlying arrhythmia or structural disease.",
      },
      {
        condition: "Caffeine / stimulant-induced sinus tachycardia",
        key_features:
          "A temporal relationship to caffeine, decongestants, stimulant use, or withdrawal from sedatives or alcohol; a regular narrow-complex tachycardia that resolves with cessation",
        mechanism:
          "Sympathomimetic or adenosine-receptor-antagonist substances directly increase sinoatrial node firing rate, producing an appropriate but subjectively noticeable sinus tachycardia rather than a true arrhythmia.",
      },
    ],
  },

  {
    slug: "syncope",
    title: "Syncope",
    system_tag: "Cardiopulmonary",
    sort_order: 4,

    big_picture:
      "Syncope is transient loss of consciousness and postural tone from a brief, self-limited drop in global cerebral blood flow, and the differential is organized around three physiologic mechanisms: reflex (neurally mediated) syncope — vasovagal, situational, or carotid sinus — from an inappropriate autonomic reflex that drops heart rate and/or blood pressure; orthostatic hypotension, from an inadequate vasoconstrictor or heart rate response to standing (volume depletion, autonomic failure, or medications); and cardiac syncope, from either an arrhythmia (brady- or tachyarrhythmia) or a structural/obstructive lesion such as aortic stenosis, hypertrophic cardiomyopathy, or pulmonary embolism that acutely drops cardiac output. Seizure is an important mimic rather than a true cause, since consciousness is lost by a different mechanism (abnormal cortical electrical activity, not global hypoperfusion). The features that most raise concern and change management urgency are syncope during exertion, syncope without a preceding prodrome, syncope while supine, an abnormal ECG, known structural heart disease, or a family history of sudden cardiac death — these point toward a cardiac cause with real mortality risk, in contrast to the excellent prognosis of typical reflex syncope.",

    exam_findings:
      "A drop in systolic blood pressure of at least 20 mmHg (or a heart rate rise of at least 30 bpm) within a few minutes of standing — suggests orthostatic hypotension\nA clear prodrome of nausea, warmth, diaphoresis, or visual graying before the event, often triggered by prolonged standing, pain, or fear — suggests vasovagal (reflex) syncope\nA harsh crescendo-decrescendo systolic murmur radiating to the carotids with a delayed carotid upstroke — suggests aortic stenosis\nA systolic murmur that increases in intensity with Valsalva or standing — suggests hypertrophic cardiomyopathy\nAn irregular pulse or bradycardia in a patient with known conduction disease or structural heart disease — suggests arrhythmic (cardiac) syncope\nPostictal confusion, tongue biting, or urinary incontinence following the event — suggests seizure rather than true syncope\nTachycardia, hypoxia, and unilateral leg swelling — suggests pulmonary embolism as the precipitant\nA reproducible episode with head turning or a tight collar in an older patient — suggests carotid sinus hypersensitivity",

    ddx: [
      {
        condition: "Vasovagal (neurocardiogenic) syncope",
        key_features:
          "A prodrome of warmth, nausea, or graying vision; a trigger of prolonged standing, pain, or emotional stress; rapid, spontaneous, complete recovery",
        mechanism:
          "An exaggerated autonomic reflex, often from venous pooling reducing ventricular filling and triggering mechanoreceptor-mediated vagal outflow, produces a sudden drop in heart rate and/or systemic vascular resistance, transiently dropping cerebral perfusion.",
      },
      {
        condition: "Orthostatic hypotension",
        key_features:
          "Symptoms occur within seconds to minutes of standing, confirmed by a significant BP drop on orthostatic vitals, often in the setting of volume depletion, autonomic neuropathy, or vasoactive/diuretic medications",
        mechanism:
          "Insufficient compensatory vasoconstriction and tachycardia on standing, from hypovolemia, autonomic failure, or drug effect, allows gravitational venous pooling to reduce venous return and cardiac output enough to drop cerebral perfusion.",
      },
      {
        condition: "Cardiac arrhythmia (bradyarrhythmia or tachyarrhythmia)",
        key_features:
          "Sudden syncope without a prodrome, possible palpitations preceding the event, an abnormal baseline ECG (conduction disease, prior infarct, long QT), a documented arrhythmia on monitoring",
        mechanism:
          "An abrupt drop in heart rate, as in high-grade AV block or sinus node dysfunction, or an excessively rapid rate that doesn't allow adequate diastolic filling, as in VT or some SVTs, acutely reduces cardiac output below the threshold needed to maintain cerebral perfusion.",
      },
      {
        condition: "Aortic stenosis",
        key_features:
          "Exertional syncope, a harsh systolic ejection murmur radiating to the carotids, a slow-rising carotid pulse, often in an older patient",
        mechanism:
          "A fixed, severely narrowed aortic valve orifice caps forward cardiac output during exertion, precisely when peripheral vasodilation would otherwise require increased output, and the mismatch drops cerebral perfusion pressure.",
      },
      {
        condition: "Hypertrophic cardiomyopathy",
        key_features:
          "Exertional syncope in a young patient, a systolic murmur that intensifies with Valsalva or standing, a family history of sudden cardiac death, asymmetric septal hypertrophy on echocardiogram",
        mechanism:
          "Dynamic left ventricular outflow tract obstruction, from asymmetric septal hypertrophy and systolic anterior motion of the mitral valve, worsens with reduced preload or increased contractility during exertion, acutely limiting stroke volume, and the hypertrophied, disorganized myocardium is also independently arrhythmogenic.",
      },
      {
        condition: "Pulmonary embolism",
        key_features:
          "Syncope with preceding dyspnea, pleuritic pain, tachycardia, and hypoxia, with a venous thromboembolism risk factor",
        mechanism:
          "A large embolus acutely obstructs right ventricular outflow, causing acute right ventricular strain and a drop in left-sided cardiac output, transiently reducing cerebral perfusion.",
      },
      {
        condition: "Situational syncope",
        key_features:
          "Occurs during or immediately after a specific trigger such as micturition, defecation, coughing, or swallowing",
        mechanism:
          "The triggering act evokes an exaggerated vagal reflex, via visceral afferents or intrathoracic pressure changes that reduce venous return, producing the same bradycardia and vasodilation pathway as vasovagal syncope but tied to a specific stimulus.",
      },
      {
        condition: "Seizure (syncope mimic)",
        key_features:
          "A preceding aura, tonic-clonic activity, tongue biting, prolonged postictal confusion, urinary incontinence",
        mechanism:
          "Loss of consciousness results from abnormal, synchronized cortical electrical discharge rather than global cerebral hypoperfusion, which is why recovery is gradual (a postictal state) rather than the rapid, complete recovery typical of true syncope.",
      },
    ],
  },

  {
    slug: "edema",
    title: "Edema",
    system_tag: "Cardiopulmonary",
    sort_order: 5,

    big_picture:
      "Peripheral, dependent edema results from a disturbance in the Starling forces that normally keep fluid in the vascular space — increased capillary hydrostatic pressure (venous obstruction or insufficiency, right heart failure), decreased plasma oncotic pressure (hypoalbuminemia from nephrotic syndrome, cirrhosis, malnutrition, or protein-losing enteropathy), increased capillary permeability, or impaired lymphatic drainage (lymphedema). A first branch point is unilateral versus bilateral: unilateral edema points toward a local venous or lymphatic problem (DVT, chronic venous insufficiency, lymphedema), while bilateral, symmetric edema points toward a systemic process (heart failure, liver disease, kidney disease, or a medication effect). The red flags that change management urgency are acute unilateral swelling with pain and warmth, raising concern for DVT and the need for urgent evaluation to prevent pulmonary embolism, and rapidly progressive bilateral edema with dyspnea or orthopnea, suggesting decompensated heart failure or another cause of impending volume overload.",

    exam_findings:
      "Bilateral pitting edema with jugular venous distension, an S3 gallop, and pulmonary crackles — suggests heart failure (right-sided or biventricular)\nUnilateral leg swelling with calf warmth, tenderness, and a palpable venous cord — suggests deep vein thrombosis\nChronic bilateral edema with hyperpigmentation (hemosiderin staining), varicosities, and skin thickening near the ankles — suggests chronic venous insufficiency\nAscites, palmar erythema, spider angiomata, and jaundice — suggests cirrhosis with hypoalbuminemia and portal hypertension\nPeriorbital edema with frothy urine and significant proteinuria — suggests nephrotic syndrome\nNon-pitting, brawny edema confined to one limb, often with a history of lymph node dissection or radiation — suggests lymphedema\nNew bilateral ankle edema temporally linked to starting a dihydropyridine calcium channel blocker — suggests drug-induced edema\nGeneralized bilateral edema without jugular venous distension or cardiac findings, in a patient with poor nutritional intake or chronic diarrhea — suggests hypoalbuminemia from malnutrition or protein-losing enteropathy",

    ddx: [
      {
        condition: "Heart failure (right-sided or biventricular)",
        key_features:
          "Bilateral pitting edema, jugular venous distension, hepatojugular reflux, orthopnea or PND if a left-sided component is present, elevated BNP",
        mechanism:
          "Elevated right atrial and systemic venous pressure, from right ventricular failure or backward transmission from left heart failure via pulmonary hypertension, raises capillary hydrostatic pressure in dependent tissues, forcing fluid out into the interstitium.",
      },
      {
        condition: "Deep vein thrombosis",
        key_features:
          "Unilateral swelling, warmth, tenderness, and a palpable cord, often with a risk factor such as immobility, malignancy, recent surgery, or a hypercoagulable state",
        mechanism:
          "A venous thrombus mechanically obstructs venous outflow from the limb, raising local capillary hydrostatic pressure downstream of the clot and forcing fluid into the interstitial space.",
      },
      {
        condition: "Chronic venous insufficiency",
        key_features:
          "Bilateral, though often asymmetric, chronic edema with hemosiderin hyperpigmentation, varicose veins, and skin changes, worse at the end of the day and with standing, improved with elevation",
        mechanism:
          "Incompetent venous valves allow retrograde venous pressure transmission during standing, chronically raising capillary hydrostatic pressure in the lower extremities and, over time, damaging capillaries enough to cause the associated skin changes.",
      },
      {
        condition: "Cirrhosis",
        key_features:
          "Ascites, jaundice, spider angiomata, palmar erythema, a low serum albumin, a history of chronic liver disease",
        mechanism:
          "Impaired hepatic synthetic function lowers serum albumin, reducing plasma oncotic pressure, while portal hypertension raises splanchnic capillary hydrostatic pressure — both push fluid into the peritoneal cavity and, via low oncotic pressure, into peripheral tissue as well.",
      },
      {
        condition: "Nephrotic syndrome",
        key_features:
          "Periorbital and dependent edema, heavy proteinuria above 3.5 g/day, hypoalbuminemia, hyperlipidemia",
        mechanism:
          "Glomerular basement membrane damage allows massive urinary protein loss, dropping plasma oncotic pressure enough that fluid shifts from the vascular space into the interstitium, with some contribution from primary renal sodium retention as well.",
      },
      {
        condition: "Lymphedema",
        key_features:
          "Non-pitting, or only briefly pitting, brawny swelling confined to a limb, often after lymph node dissection, radiation, filarial infection, or malignant lymphatic obstruction, with a positive Stemmer sign",
        mechanism:
          "Destruction or obstruction of lymphatic channels prevents clearance of interstitial protein and fluid, and the retained protein raises local interstitial oncotic pressure, perpetuating and worsening the fluid accumulation over time.",
      },
      {
        condition: "Calcium channel blocker–induced edema",
        key_features:
          "New bilateral ankle edema temporally linked to starting a dihydropyridine calcium channel blocker such as amlodipine, without signs of volume overload (no JVD, no crackles), not responsive to diuretics",
        mechanism:
          "Dihydropyridine calcium channel blockers preferentially dilate precapillary arterioles without a matching effect on postcapillary venules, raising intracapillary hydrostatic pressure and driving fluid into the interstitium even though total body volume is not increased.",
      },
      {
        condition: "Hypoalbuminemia from malnutrition or protein-losing enteropathy",
        key_features:
          "Bilateral edema with a history of poor intake, malabsorption, or chronic GI protein loss such as inflammatory bowel disease, a low serum albumin, no cardiac or significant renal findings",
        mechanism:
          "Inadequate albumin synthesis from malnutrition, or excessive enteric protein loss, reduces plasma oncotic pressure globally, shifting the Starling balance so fluid moves from capillaries into the interstitial space throughout the body.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Insert
// ---------------------------------------------------------------------------

async function upsertPathophysiologyTopics(supabase) {
  const rows = PATHOPHYSIOLOGY_TOPICS.map((t) => ({
    slug: t.slug,
    title: t.title,
    system_tag: t.system_tag,
    sort_order: t.sort_order,
    big_picture: t.big_picture,
    exam_findings: t.exam_findings,
    ddx: t.ddx,
  }));

  const { data, error } = await supabase
    .from('pathophysiology_topics')
    .upsert(rows, { onConflict: 'slug' })
    .select();
  if (error) throw error;
  console.log(`Upserted ${data.length} pathophysiology_topics row(s).`);
  return data;
}

async function main() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in your .env.\n' +
      'Get the service_role key from Supabase: Project Settings > API > service_role (secret).\n' +
      'This key is server-only — never expose it to the browser.'
    );
    process.exit(1);
  }
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  console.log('Seeding pathophysiology_topics...');
  await upsertPathophysiologyTopics(supabase);
  console.log('Done.');
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}

module.exports = { PATHOPHYSIOLOGY_TOPICS, upsertPathophysiologyTopics };
