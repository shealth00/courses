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
  // ===========================================================================
  // Cluster — Neuro / Psych / General
  // ===========================================================================
  {
    slug: 'headache',
    title: 'Headache',
    system_tag: 'Neuro/General',
    sort_order: 1,

    big_picture:
      "The overwhelming majority of headaches are primary (migraine, tension-type, cluster) — recurrent, benign, and diagnosed on pattern alone without imaging. The clinical job is to screen every headache for features that suggest a secondary cause instead: a thunderclap onset reaching maximum intensity within a minute, the 'worst headache of my life,' new headache after age 50, fever with neck stiffness, papilledema or a new focal neurologic deficit, headache that worsens with Valsalva or lying flat, and headache in someone who is pregnant, immunocompromised, or on anticoagulation. Any of these red flags shifts management from reassurance and symptomatic treatment toward urgent neuroimaging, and sometimes lumbar puncture, to rule out hemorrhage, infection, or a mass lesion before it can be called primary.",

    exam_findings:
      "Papilledema on fundoscopic exam → raised intracranial pressure (mass lesion, idiopathic intracranial hypertension, venous sinus thrombosis)\nNuchal rigidity with positive Kernig/Brudzinski signs → meningeal irritation (meningitis, subarachnoid hemorrhage)\nUnilateral dilated, poorly reactive pupil with ptosis and a 'down-and-out' eye → compressive CN III palsy from a posterior communicating artery aneurysm\nTemporal artery tenderness or thickening with jaw claudication → giant cell arteritis\nNew focal weakness, aphasia, or visual field cut → structural intracranial lesion (tumor, hemorrhage, stroke)\nSinus/facial tenderness with purulent nasal discharge → acute sinusitis\nIpsilateral lacrimation, conjunctival injection, ptosis, and miosis accompanying severe periorbital pain → cluster headache's trigeminal-autonomic features\nBilateral pericranial muscle tenderness with a band-like, pressing quality → tension-type headache",

    ddx: [
      {
        condition: 'Migraine',
        key_features:
          'Unilateral throbbing pain lasting hours, often with photophobia, phonophobia, and nausea; may be preceded by a visual or sensory aura; improves in a dark, quiet room; family history is common.',
        mechanism:
          'Cortical spreading depression (in those with aura) activates the trigeminovascular system, releasing CGRP and other vasoactive neuropeptides that cause meningeal vessel dilation, neurogenic inflammation, and sensitization of trigeminal nociceptors.',
      },
      {
        condition: 'Tension-type headache',
        key_features:
          'Bilateral, band-like, pressing pain of mild-to-moderate intensity, not worsened by routine physical activity, without significant nausea, vomiting, or photophobia.',
        mechanism:
          'Peripheral sensitization of pericranial myofascial nociceptors combined with a lower threshold for central pain processing produces diffuse head pain without any vascular or neuroinflammatory trigger.',
      },
      {
        condition: 'Subarachnoid hemorrhage',
        key_features:
          "Thunderclap onset reaching peak intensity within a minute, described as the worst headache of the patient's life, possible transient loss of consciousness, and meningismus on exam.",
        mechanism:
          'Rupture of a berry aneurysm (or arteriovenous malformation) releases blood directly into the subarachnoid space, causing an acute rise in intracranial pressure and chemical meningeal irritation from blood breakdown products.',
      },
      {
        condition: 'Bacterial meningitis',
        key_features:
          'Fever, nuchal rigidity, photophobia, and often altered mentation, sometimes with a petechial rash (meningococcemia); CSF shows neutrophilic pleocytosis with low glucose.',
        mechanism:
          'Bacterial invasion of the subarachnoid space triggers a pro-inflammatory cytokine cascade that inflames the meninges, impairs CSF resorption, and raises intracranial pressure via cerebral edema.',
      },
      {
        condition: 'Idiopathic intracranial hypertension',
        key_features:
          'Young, often obese woman with daily headache worse when lying down, transient visual obscurations, pulsatile tinnitus, and papilledema with normal brain imaging aside from subtle signs of raised pressure.',
        mechanism:
          'Impaired CSF resorption at the arachnoid granulations (or increased venous outflow resistance) raises intracranial pressure without any mass lesion, stretching pain-sensitive dural structures and compressing the optic nerve.',
      },
      {
        condition: 'Giant cell (temporal) arteritis',
        key_features:
          'Age over 50, new-onset headache, scalp tenderness, jaw claudication, markedly elevated ESR/CRP, and sometimes transient monocular vision loss; often coexists with polymyalgia rheumatica.',
        mechanism:
          'Granulomatous inflammation of medium and large arteries, especially branches of the external carotid, causes intimal hyperplasia and luminal narrowing, producing ischemic pain and risking anterior ischemic optic neuropathy if untreated.',
      },
      {
        condition: 'Cerebral venous sinus thrombosis',
        key_features:
          'Subacute headache in someone with a hypercoagulable risk factor (postpartum state, oral contraceptive use, thrombophilia), with papilledema, seizures, or focal deficits that do not respect a single arterial territory.',
        mechanism:
          'Thrombosis of a dural venous sinus obstructs venous outflow and impairs CSF resorption, raising intracranial pressure and risking venous infarction or hemorrhage from congested, high-pressure cerebral veins.',
      },
      {
        condition: 'Cluster headache',
        key_features:
          'Severe, strictly unilateral periorbital or temporal pain lasting 15–180 minutes, with ipsilateral lacrimation, conjunctival injection, rhinorrhea, and ptosis/miosis; patients are restless and pace rather than lying still, occurring in clusters with circadian regularity.',
        mechanism:
          'Activation of the posterior hypothalamic gray drives a trigeminal-autonomic reflex, producing both trigeminal nociceptor activation (pain) and parasympathetic outflow through the sphenopalatine ganglion (the autonomic features).',
      },
    ],
  },

  {
    slug: 'weakness',
    title: 'Weakness (Focal or Generalized)',
    system_tag: 'Neuro/General',
    sort_order: 2,

    big_picture:
      "Before chasing a differential, confirm the complaint is true neuromuscular weakness (reduced power against resistance) rather than generalized fatigue or asthenia, and then localize the lesion along the neuraxis: upper motor neuron (brain or spinal cord), lower motor neuron (anterior horn cell, root, plexus, or peripheral nerve), neuromuscular junction, or muscle itself. The exam pattern of tone, reflexes, and distribution does most of the localizing work. Red flags that demand urgency include sudden-onset focal weakness (stroke, a time-critical diagnosis), rapidly ascending weakness with early respiratory or bulbar involvement (Guillain-Barré syndrome, which can progress to ventilatory failure), and bilateral leg weakness with a sensory level or new bowel/bladder dysfunction (spinal cord compression, a surgical emergency).",

    exam_findings:
      "Increased tone, hyperreflexia, and a Babinski sign, with weakness favoring extensors in the arm and flexors in the leg → upper motor neuron lesion (brain or spinal cord)\nFlaccid tone, hyporeflexia or areflexia, fasciculations, and atrophy → lower motor neuron lesion (anterior horn cell, root, or nerve)\nA sensory level on the trunk with bilateral leg weakness → spinal cord compression at that level\nDistal, symmetric, ascending weakness with early areflexia → peripheral polyneuropathy (e.g., Guillain-Barré syndrome)\nWeakness that worsens with sustained or repeated activity and improves with rest, plus ptosis or diplopia → neuromuscular junction disorder (myasthenia gravis)\nProximal, symmetric weakness (trouble rising from a chair or climbing stairs) with normal reflexes and sensation → primary myopathy\nUnilateral facial droop that spares the forehead, paired with arm/leg weakness on the same side → central (upper motor neuron) facial weakness, e.g., stroke\nUnilateral facial weakness that includes the forehead → peripheral CN VII lesion (Bell palsy), not a central lesion",

    ddx: [
      {
        condition: 'Ischemic stroke',
        key_features:
          'Sudden-onset unilateral weakness, often with facial droop sparing the forehead, in a vascular distribution (e.g., arm/face-predominant with aphasia in MCA territory); hyperreflexia and a Babinski sign may take hours to appear.',
        mechanism:
          'Occlusion of a cerebral artery causes focal ischemia and infarction of corticospinal tract neurons or their axons, interrupting descending voluntary motor output below the lesion.',
      },
      {
        condition: 'Guillain-Barré syndrome',
        key_features:
          'Symmetric, ascending weakness developing over days, often 1–3 weeks after a gastrointestinal or respiratory infection (classically Campylobacter jejuni), with early areflexia and albuminocytologic dissociation (high CSF protein, normal cell count) on lumbar puncture.',
        mechanism:
          'Molecular mimicry between microbial antigens and peripheral nerve gangliosides triggers an autoimmune attack on myelin (or, in axonal variants, the axon itself) of peripheral nerve roots, slowing or blocking conduction.',
      },
      {
        condition: 'Myasthenia gravis',
        key_features:
          'Fatigable weakness that worsens with repeated use or later in the day, with ptosis and diplopia early on, normal reflexes and sensation, and improvement with rest, ice-pack testing, or edrophonium.',
        mechanism:
          'Autoantibodies against postsynaptic nicotinic acetylcholine receptors (or, in a subset, MuSK) at the neuromuscular junction reduce the number of functional receptors, progressively weakening endplate potentials with repetitive stimulation until transmission fails.',
      },
      {
        condition: 'Spinal cord compression (epidural metastasis or disc herniation)',
        key_features:
          'Back pain preceding bilateral leg weakness, a defined sensory level on the trunk, hyperreflexia below the lesion (or areflexia acutely), and new bowel/bladder dysfunction or saddle anesthesia if the cauda equina is involved.',
        mechanism:
          'Mechanical compression of the spinal cord (or cauda equina) directly disrupts corticospinal and sensory tract conduction and can secondarily cause venous congestion and ischemia of the compressed segment.',
      },
      {
        condition: 'Hypokalemic or thyrotoxic periodic paralysis',
        key_features:
          'Episodic proximal weakness, sometimes triggered by a high-carbohydrate meal or exertion followed by rest, with a low serum potassium during the attack and normal strength between episodes; may occur with known or occult hyperthyroidism.',
        mechanism:
          'A sudden intracellular shift of potassium (via mutant calcium/sodium channels, or thyroid-hormone-driven Na⁺/K⁺-ATPase activity) hyperpolarizes the skeletal muscle membrane, rendering it transiently inexcitable.',
      },
      {
        condition: 'Todd paralysis (post-ictal weakness)',
        key_features:
          'Transient focal weakness immediately following a witnessed seizure, most pronounced in the limb(s) involved in the seizure activity, resolving gradually over minutes to hours.',
        mechanism:
          'Transient neuronal exhaustion and local inhibitory mechanisms in the cortical region that generated the seizure suppress motor output until regional metabolic and synaptic function recovers.',
      },
      {
        condition: 'Polymyositis (inflammatory myopathy)',
        key_features:
          'Subacute, symmetric proximal weakness (difficulty combing hair or climbing stairs) with a markedly elevated creatine kinase, relatively preserved sensation and reflexes until weakness is severe.',
        mechanism:
          'T-cell-mediated inflammatory infiltration of skeletal muscle fibers causes myocyte injury and necrosis, reducing the contractile mass available to generate force.',
      },
      {
        condition: 'Functional (conversion) weakness',
        key_features:
          'Weakness that does not conform to a recognizable neuroanatomic distribution, with inconsistent effort on formal strength testing but a positive Hoover sign (involuntary hip extension when the contralateral hip is flexed against resistance), normal reflexes, and often a temporally related psychological stressor.',
        mechanism:
          'A functional disruption of the brain networks that generate voluntary movement, without a structural or physiologic lesion in the motor pathway — a diagnosis supported by specific positive exam signs, not merely the absence of other findings.',
      },
    ],
  },

  {
    slug: 'altered-mental-status',
    title: 'Altered Mental Status',
    system_tag: 'Neuro/General',
    sort_order: 3,

    big_picture:
      "Altered mental status is a final common pathway for an enormous range of insults, and the first, non-negotiable step is a fingerstick glucose — hypoglycemia is common, rapidly reversible, and rapidly fatal if missed. Beyond that, causes broadly sort into toxic-metabolic/systemic derangements (the largest bucket, and often reversible), structural or primary neurologic lesions, CNS or systemic infection, and, once these are excluded, primary psychiatric disease. Red flags that push toward urgent structural or infectious workup include focal neurologic deficits or a history of head trauma, fever with neck stiffness, and pinpoint pupils with respiratory depression (which should prompt empiric naloxone before imaging, since it is both diagnostic and immediately therapeutic).",

    exam_findings:
      "Fingerstick glucose at either extreme → hypoglycemia, or DKA/HHS from severe hyperglycemia\nPinpoint pupils with respiratory depression → opioid toxicity\nAsterixis (flapping tremor with wrist extension) → hepatic, uremic, or other metabolic/toxic encephalopathy\nFever with nuchal rigidity and photophobia → meningitis or encephalitis\nFocal neurologic deficit or gaze deviation → structural lesion (ischemic/hemorrhagic stroke, mass, abscess)\nFruity breath odor with Kussmaul respirations → diabetic ketoacidosis\nHyperthermia, tachycardia, tremor, and hyperreflexia/clonus → thyroid storm, serotonin syndrome, or sympathomimetic toxicity\nHypothermia, bradycardia, dry skin, and non-pitting (myxedematous) edema → myxedema coma",

    ddx: [
      {
        condition: 'Hypoglycemia',
        key_features:
          'Rapid onset, often with preceding diaphoresis, tremor, and palpitations in an awake patient before confusion sets in; confirmed by a low fingerstick glucose and reverses quickly with dextrose administration.',
        mechanism:
          'Neurons rely almost entirely on glucose for ATP production and cannot meaningfully use fatty acids; an insufficient glucose supply rapidly impairs cortical and subcortical neuronal function.',
      },
      {
        condition: 'Hepatic encephalopathy',
        key_features:
          'Known cirrhosis or portal hypertension, asterixis, an identifiable precipitant (GI bleed, infection, constipation, diuretic-induced hypokalemia, or a TIPS procedure), and often an elevated ammonia level.',
        mechanism:
          'Impaired hepatic clearance of nitrogenous waste (compounded by portosystemic shunting) allows ammonia and other gut-derived neurotoxins to reach the brain, where astrocytes convert ammonia to glutamine, causing osmotic astrocyte swelling and disrupted neurotransmission.',
      },
      {
        condition: 'Meningitis or encephalitis',
        key_features:
          'Fever, headache, nuchal rigidity, and photophobia (meningitis), or fever with seizures and focal/temporal-lobe features such as behavioral change or aphasia (HSV encephalitis); CSF pleocytosis confirms CNS infection.',
        mechanism:
          'Direct infection of the meninges or brain parenchyma, together with the resulting inflammatory cytokine response, causes cerebral edema, raised intracranial pressure, and (in HSV encephalitis) direct necrosis of temporal and limbic structures.',
      },
      {
        condition: 'Intracranial hemorrhage',
        key_features:
          'Sudden severe headache, vomiting, a focal neurologic deficit, and a history of anticoagulant use, trauma, or poorly controlled hypertension, with rapid decline in level of consciousness.',
        mechanism:
          'Extravasated blood produces direct mass effect and raises intracranial pressure, and blood breakdown products are themselves neurotoxic and irritate adjacent brain tissue and meninges.',
      },
      {
        condition: 'Sedative-hypnotic or opioid toxicity',
        key_features:
          'Recent ingestion or overdose history, miosis with respiratory depression (opioids) or a more variable exam with benzodiazepines, and rapid improvement with naloxone in the opioid case.',
        mechanism:
          'Opioids activate mu-opioid receptors in brainstem respiratory and reticular activating centers, suppressing arousal and respiratory drive; benzodiazepines potentiate GABA-A receptor chloride influx, producing widespread neuronal inhibition.',
      },
      {
        condition: 'Hypoxic or hypercapnic encephalopathy',
        key_features:
          'Known severe COPD or another cause of respiratory failure, cyanosis or low oxygen saturation, an elevated CO2 with respiratory acidosis, and improvement with supplemental oxygen or ventilatory support.',
        mechanism:
          'Inadequate cerebral oxygen delivery impairs oxidative ATP production in neurons, while hypercapnia independently causes cerebral vasodilation, worsens intracranial pressure, and directly depresses cortical activity via respiratory acidosis.',
      },
      {
        condition: 'Uremic encephalopathy',
        key_features:
          'Known end-stage renal disease or a missed dialysis session, asterixis, markedly elevated BUN/creatinine, and improvement following dialysis.',
        mechanism:
          'Accumulation of uremic solutes (guanidino compounds and other retained toxins), together with metabolic acidosis and cerebral edema from disturbed osmotic regulation, impairs normal neuronal signaling.',
      },
      {
        condition: 'Thyroid storm or myxedema coma',
        key_features:
          'Thyroid storm: fever, tachycardia, tremor, and agitation progressing to delirium in a patient with Graves disease or a recent precipitating stressor. Myxedema coma: hypothermia, bradycardia, and non-pitting edema in an elderly patient with known, often undertreated, hypothyroidism.',
        mechanism:
          'Thyroid storm: markedly excess thyroid hormone amplifies catecholamine sensitivity and cellular metabolic rate, producing a hypermetabolic state that overstimulates the CNS. Myxedema coma: severe thyroid hormone deficiency slows cerebral metabolism and impairs both thermoregulation and respiratory drive, producing a hypometabolic, depressed sensorium.',
      },
    ],
  },

  {
    slug: 'fever',
    title: 'Fever',
    system_tag: 'Neuro/General',
    sort_order: 4,

    big_picture:
      "True fever is a regulated upward shift of the hypothalamic thermoregulatory set point, driven by pyrogenic cytokines acting through prostaglandin E2 — a fundamentally different process from hyperthermia, in which heat production or environmental heat exposure overwhelms normal dissipation without any change in the set point. That distinction matters clinically: antipyretics work for fever but do nothing for hyperthermia, which instead requires active cooling. Most fevers reflect a self-limited infection, so the diagnostic task is to look for features that change management: hemodynamic instability (concern for sepsis and its source), immunocompromise or neutropenia (mandating urgent empiric broad-spectrum coverage), and localizing signs suggesting a source that needs drainage or debridement rather than antibiotics alone (an abscess, for instance).",

    exam_findings:
      "Nuchal rigidity with photophobia → meningitis\nNew regurgitant heart murmur with petechiae, Janeway lesions, or Osler nodes → infective endocarditis\nAbdominal rebound tenderness and guarding → an intra-abdominal source (appendicitis, cholecystitis, abscess)\nCostovertebral angle tenderness → pyelonephritis\nDiffuse lymphadenopathy with hepatosplenomegaly → systemic infection or a lymphoproliferative process\nA petechial/purpuric rash versus a diffuse maculopapular rash → meningococcemia versus a viral exanthem or drug reaction\nHot, dry skin with altered mentation and an extremely high temperature in a hot environment or on anticholinergic medication → heatstroke/hyperthermia rather than true fever\nWarm, swollen, tender joint with restricted range of motion → septic arthritis",

    ddx: [
      {
        condition: 'Bacterial pneumonia',
        key_features:
          'Cough, pleuritic chest pain, focal crackles or dullness to percussion, a lobar infiltrate on chest imaging, and leukocytosis with a left shift.',
        mechanism:
          'Bacterial invasion of the alveoli triggers local macrophage activation and systemic release of IL-1, IL-6, and TNF-alpha, which act on the hypothalamic preoptic area via prostaglandin E2 to raise the thermoregulatory set point.',
      },
      {
        condition: 'Pyelonephritis',
        key_features:
          'Dysuria and urinary frequency preceding flank pain, costovertebral angle tenderness, and urinalysis showing pyuria with bacteriuria.',
        mechanism:
          'Ascending bacterial infection of the renal parenchyma provokes local cytokine release that enters the systemic circulation and raises the hypothalamic set point via the same prostaglandin E2 pathway as other bacterial infections.',
      },
      {
        condition: 'Infective endocarditis',
        key_features:
          'A new or changing regurgitant murmur, embolic/immune phenomena (Janeway lesions, Osler nodes, splinter hemorrhages, Roth spots), persistently positive blood cultures, and a risk factor such as intravenous drug use or a prosthetic valve.',
        mechanism:
          'Bacterial vegetations on damaged or prosthetic valve surfaces continuously seed the bloodstream, and the resulting sustained bacteremia and immune-complex formation drive an ongoing cytokine-mediated pyrogenic response.',
      },
      {
        condition: 'Meningococcemia / bacterial meningitis',
        key_features:
          'Rapidly progressive fever with a petechial or purpuric rash, nuchal rigidity, and, in severe cases, hypotension and signs of disseminated intravascular coagulation.',
        mechanism:
          'Release of bacterial endotoxin (lipopolysaccharide) triggers a massive systemic cytokine cascade (TNF-alpha, IL-1) that produces both fever and widespread vascular endothelial injury, accounting for the petechiae.',
      },
      {
        condition: 'Drug fever',
        key_features:
          'Fever temporally linked to a recently started medication, relative bradycardia for the degree of fever, eosinophilia, a patient who otherwise looks well, and resolution within days of stopping the offending drug.',
        mechanism:
          'A hypersensitivity immune reaction to the drug or its metabolite triggers cytokine release (or the drug itself interferes with thermoregulation), raising the set point through the same final pathway as infection despite the absence of any infectious source.',
      },
      {
        condition: 'Heatstroke (hyperthermia, not true fever)',
        key_features:
          'Extreme environmental heat exposure or strenuous exertion, markedly elevated core temperature, altered mental status, and skin that may be hot and dry or profusely diaphoretic; critically, temperature does not respond to antipyretics.',
        mechanism:
          "Peripheral heat-dissipation mechanisms (cutaneous vasodilation and sweating) are overwhelmed by heat load, so core temperature rises passively rather than through a hypothalamic set-point change — since prostaglandin E2 signaling isn't driving the rise, antipyretics have no target to act on, and treatment is active external cooling.",
      },
      {
        condition: 'Lymphoma',
        key_features:
          'B symptoms — fever, drenching night sweats, and unintentional weight loss — with painless lymphadenopathy, sometimes a cyclical (Pel-Ebstein) fever pattern in Hodgkin lymphoma, and an elevated LDH.',
        mechanism:
          'Malignant lymphocytes and the reactive immune cells surrounding them release endogenous pyrogens (IL-6, TNF-alpha) directly, producing fever through the identical hypothalamic pathway as infection but without any infectious trigger.',
      },
      {
        condition: 'Adult-onset Still disease (autoinflammatory fever)',
        key_features:
          'A quotidian, daily-spiking fever pattern accompanied by an evanescent salmon-colored rash that appears with the fever spikes, arthralgias/arthritis, and a markedly elevated serum ferritin.',
        mechanism:
          'Dysregulated activation of the innate immune system drives excessive production of IL-1, IL-6, and IL-18, which act on the hypothalamus through the same pyrogenic pathway as infection, producing fever in the absence of any identifiable pathogen.',
      },
    ],
  },

  {
    slug: 'fatigue',
    title: 'Fatigue',
    system_tag: 'Neuro/General',
    sort_order: 5,

    big_picture:
      "Fatigue is one of the least specific complaints in medicine, and most cases seen in outpatient practice do not trace back to a single dramatic diagnosis. It helps to separate fatigue (a subjective lack of energy) from both excessive daytime sleepiness (pointing toward a sleep disorder) and true neuromuscular weakness (an objective, localizable motor deficit). Broad categories include lifestyle/physiologic causes (poor sleep, deconditioning), psychiatric disease (depression is the single most common identifiable cause in primary care), endocrine/metabolic disease, hematologic disease (anemia), and chronic organ dysfunction or malignancy. Features that should accelerate workup include unintentional weight loss, night sweats, or new lymphadenopathy (concern for malignancy or chronic infection), and signs of adrenal crisis such as hypotension with hyperpigmentation or hyperkalemia, which is a medical emergency rather than a routine fatigue evaluation.",

    exam_findings:
      "Conjunctival pallor, tachycardia, and a flow murmur → anemia\nDry skin, bradycardia, delayed relaxation phase of deep tendon reflexes, and non-pitting edema → hypothyroidism\nHyperpigmentation of the skin creases and buccal mucosa with orthostatic hypotension → primary adrenal insufficiency\nCervical or supraclavicular lymphadenopathy with unintentional weight loss → malignancy or chronic infection\nJugular venous distension, an S3 gallop, and peripheral edema → heart failure\nDepressed affect, psychomotor slowing, and anhedonia on interview → major depressive disorder\nSallow pallor with peripheral edema and a uremic odor to the breath → chronic kidney disease\nLarge neck circumference with loud snoring and witnessed apneas reported by a partner → obstructive sleep apnea",

    ddx: [
      {
        condition: 'Iron-deficiency (or other) anemia',
        key_features:
          'Pallor, exertional dyspnea, tachycardia, and a low hemoglobin/hematocrit with a low MCV in iron deficiency; may have pica or koilonychia, prompting a search for occult GI blood loss.',
        mechanism:
          'A reduced red cell mass lowers the blood’s oxygen-carrying capacity, leaving tissues relatively hypoxic and forcing compensatory tachycardia while cellular ATP production falls short of ordinary demand.',
      },
      {
        condition: 'Hypothyroidism',
        key_features:
          'Cold intolerance, weight gain, dry skin and hair, constipation, bradycardia, delayed relaxation of deep tendon reflexes, and an elevated TSH with a low free T4.',
        mechanism:
          'Insufficient thyroid hormone reduces basal metabolic rate and mitochondrial oxidative capacity across nearly every tissue, slowing cellular energy production and producing pervasive fatigue.',
      },
      {
        condition: 'Major depressive disorder',
        key_features:
          'Anhedonia and depressed mood present most days for at least two weeks, along with sleep or appetite changes and poor concentration; fatigue is often disproportionate to any single abnormal finding, and basic labs are normal.',
        mechanism:
          'Dysregulated monoaminergic (serotonergic and noradrenergic) neurotransmission combined with hyperactivity of the hypothalamic-pituitary-adrenal axis impairs motivation, sleep architecture, and perceived energy independent of any peripheral organ pathology.',
      },
      {
        condition: 'Obstructive sleep apnea',
        key_features:
          'Loud snoring with witnessed apneic pauses, morning headaches, obesity or a large neck circumference, and unrefreshing sleep despite what seems like an adequate number of hours in bed.',
        mechanism:
          'Repeated collapse of the upper airway during sleep causes intermittent hypoxia and repeated cortical arousals, fragmenting sleep architecture and preventing restorative slow-wave sleep, so daytime fatigue persists despite normal time asleep.',
      },
      {
        condition: 'Adrenal insufficiency',
        key_features:
          'Hyperpigmentation of skin creases and mucous membranes (primary adrenal insufficiency only), orthostatic hypotension, hyponatremia with hyperkalemia, weight loss, and worsening during physiologic stress; confirmed by a low morning cortisol.',
        mechanism:
          'Cortisol deficiency impairs hepatic gluconeogenesis, blunts the permissive effect on vascular catecholamine responsiveness, and reduces cellular metabolic responsiveness generally, producing systemic malaise and hypotension.',
      },
      {
        condition: 'Chronic kidney disease',
        key_features:
          'Known reduced GFR or elevated creatinine, peripheral edema, pruritus, and pallor from the associated anemia of reduced erythropoietin production, sometimes with electrolyte disturbances.',
        mechanism:
          'Retained uremic solutes plus reduced erythropoietin synthesis (causing anemia) and chronic metabolic acidosis together impair cellular energy metabolism and tissue oxygen delivery, producing systemic fatigue.',
      },
      {
        condition: 'Occult malignancy (e.g., colorectal cancer, lymphoma)',
        key_features:
          'Unintentional weight loss, night sweats, and a new palpable mass or lymphadenopathy, with fatigue that progresses gradually over weeks to months rather than appearing suddenly.',
        mechanism:
          'Tumor-derived cytokines (TNF-alpha, IL-6) and the increased metabolic demand of tumor growth produce a cachexia-like fatigue state, often compounded by anemia of chronic disease or occult chronic blood loss.',
      },
      {
        condition: 'Heart failure',
        key_features:
          'Exertional dyspnea, orthopnea, jugular venous distension, an S3 gallop, and peripheral edema, with a reduced ejection fraction confirmed on echocardiography.',
        mechanism:
          'Reduced cardiac output limits oxygen delivery to skeletal muscle and other tissues even during routine activity, while compensatory neurohormonal activation (renin-angiotensin-aldosterone and sympathetic systems) and skeletal muscle deconditioning further compound the perceived fatigue.',
      },
    ],
  },
  // ===========================================================================
  // Cluster — GI / Renal / GU
  // ===========================================================================
  {
    slug: 'abdominal-pain',
    title: 'Abdominal Pain',
    system_tag: 'GI/Renal',
    sort_order: 1,

    big_picture:
      'Abdominal pain is best organized first by character — dull, poorly localized visceral pain from a hollow or solid organ versus sharp, well-localized somatic (parietal) pain from irritation of the parietal peritoneum — and then by anatomic location, since each quadrant maps to a fairly predictable set of organs. The pace of onset matters as much as the location: pain that is sudden and severe from the first moment suggests perforation, rupture, torsion, or vascular occlusion, while pain that builds gradually over hours suggests an inflammatory or obstructive process. The most important red flags are peritoneal signs (rigidity, involuntary guarding, rebound tenderness), hemodynamic instability, and pain that is out of proportion to an unimpressive exam, which should raise concern for mesenteric ischemia. Elderly, pregnant, and immunosuppressed patients deserve extra caution, since they can harbor catastrophic intra-abdominal pathology behind a deceptively benign-looking exam.',

    exam_findings:
      'Rebound tenderness, involuntary guarding, or board-like rigidity → peritonitis from perforation or rupture\nPositive psoas sign (pain with hip extension, or flexion against resistance) → retrocecal appendicitis or psoas abscess\nPositive obturator sign (pain with internal rotation of the flexed hip) → pelvic appendicitis or a pelvic abscess\nMurphy sign (inspiratory arrest on right upper quadrant palpation) → acute cholecystitis\nRovsing sign (palpating the left lower quadrant produces right lower quadrant pain) → appendicitis\nCullen sign (periumbilical ecchymosis) or Grey Turner sign (flank ecchymosis) → retroperitoneal or hemorrhagic pancreatic bleeding\nPain markedly out of proportion to a soft, minimally tender abdomen → mesenteric ischemia\nCostovertebral angle tenderness → pyelonephritis or an obstructing renal stone',

    ddx: [
      {
        condition: 'Acute appendicitis',
        key_features:
          'Pain beginning periumbilically and migrating over hours to the right lower quadrant (McBurney point), anorexia, low-grade fever, positive Rovsing/psoas/obturator signs, mild leukocytosis.',
        mechanism:
          'Luminal obstruction of the appendix (fecalith or lymphoid hyperplasia) causes progressive distension, impaired venous outflow, bacterial overgrowth, and wall ischemia. Early distension produces poorly localized visceral pain referred to the periumbilical region via afferents entering the spinal cord at T10; once transmural inflammation reaches the adjacent parietal peritoneum, the pain becomes sharp and localizes to the right lower quadrant.',
      },
      {
        condition: 'Acute cholecystitis',
        key_features:
          'Right upper quadrant pain after a fatty meal, positive Murphy sign, fever and leukocytosis, ultrasound showing gallbladder wall thickening or pericholecystic fluid with a stone at the cystic duct.',
        mechanism:
          'A gallstone obstructs the cystic duct, causing gallbladder distension and rising intraluminal pressure that impairs mucosal blood flow. The resulting ischemia and secondary bacterial infection inflame the gallbladder wall, which irritates the overlying parietal peritoneum and produces localized, sharp right upper quadrant pain.',
      },
      {
        condition: 'Acute pancreatitis',
        key_features:
          'Severe, steady epigastric pain radiating to the back, worse lying supine and improved leaning forward, prominent nausea and vomiting, markedly elevated lipase, history of gallstones or heavy alcohol use.',
        mechanism:
          'Premature intra-acinar activation of trypsinogen to trypsin triggers autodigestion of pancreatic tissue by its own proteolytic and lipolytic enzymes. The resulting local inflammation, edema, and (in severe cases) fat necrosis and hemorrhage irritate the richly innervated, retroperitoneal pancreatic bed, producing deep, boring pain that radiates to the back.',
      },
      {
        condition: 'Mechanical small bowel obstruction',
        key_features:
          'Colicky, intermittent periumbilical pain in waves, abdominal distension, high-pitched or hyperactive early bowel sounds, obstipation, vomiting, often a history of prior abdominal surgery (adhesions).',
        mechanism:
          'A mechanical blockage (adhesions, hernia, or tumor) traps gas and fluid proximally, dilating the bowel wall and raising intraluminal pressure. Peristaltic smooth muscle contractions against the fixed obstruction produce crampy, colicky visceral pain; if the obstruction compromises the bowel wall’s blood supply (strangulation), pain becomes constant and peritoneal signs develop.',
      },
      {
        condition: 'Acute mesenteric ischemia',
        key_features:
          'Severe, poorly localized pain that is strikingly out of proportion to a soft, non-tender abdominal exam; history of atrial fibrillation or diffuse atherosclerosis; metabolic acidosis and elevated lactate.',
        mechanism:
          'Embolic or thrombotic occlusion of a mesenteric vessel (or a low-flow, nonocclusive state) deprives the bowel wall of oxygen. Ischemic tissue releases anaerobic metabolites and inflammatory mediators that intensely activate visceral nociceptors well before the bowel wall becomes frankly necrotic and peritoneal signs appear — the source of the classic pain-exam mismatch.',
      },
      {
        condition: 'Acute diverticulitis',
        key_features:
          'Left lower quadrant pain (sigmoid colon), fever, leukocytosis, a change in bowel habits, CT showing diverticular wall thickening with surrounding fat stranding.',
        mechanism:
          'A colonic diverticulum (an outpouching through the muscular wall at a point where the vasa recta penetrate it) becomes obstructed by inspissated fecal material, allowing bacterial proliferation and localized micro-perforation. The resulting pericolic inflammation irritates the adjacent parietal peritoneum over the sigmoid colon, producing focal left lower quadrant pain.',
      },
      {
        condition: 'Ruptured or rapidly expanding abdominal aortic aneurysm',
        key_features:
          'Sudden, severe abdominal or back pain, a pulsatile abdominal mass, hypotension or syncope, known risk factors (older age, smoking, hypertension, prior aneurysm).',
        mechanism:
          'Degeneration of elastin and collagen in the aortic media progressively weakens the vessel wall, allowing dilation over time. Rupture releases blood into the retroperitoneum, acutely stretching the peritoneum, retroperitoneal structures, and nerve plexuses, producing sudden severe pain, while ongoing hemorrhage drives hypotension.',
      },
      {
        condition: 'Nephrolithiasis (renal colic)',
        key_features:
          'Sudden, severe flank pain radiating to the groin, gross or microscopic hematuria, a patient who is writhing and unable to find a comfortable position (in contrast to the stillness of peritonitis), costovertebral angle tenderness.',
        mechanism:
          'A stone lodges in the ureter, causing acute obstruction and distension of the collecting system and ureter proximal to it. The resulting stretch of the renal capsule and ureteral wall activates visceral afferents that travel alongside sympathetic fibers to spinal levels T11–L2, while peristaltic waves attempting to move the stone produce the classic colicky, wave-like flank-to-groin pain.',
      },
    ],
  },

  {
    slug: 'jaundice',
    title: 'Jaundice',
    system_tag: 'GI/Renal',
    sort_order: 2,

    big_picture:
      'Jaundice reflects hyperbilirubinemia and is most efficiently approached by asking where in the bilirubin pathway the problem lies: prehepatic (overproduction, usually hemolysis, with unconjugated hyperbilirubinemia and normal liver enzymes), hepatic (impaired hepatocyte uptake, conjugation, or excretion, with a mixed picture and elevated transaminases), or posthepatic/obstructive (blocked bile flow after conjugation, with conjugated hyperbilirubinemia and a cholestatic enzyme pattern). Fractionating the bilirubin and pairing it with the liver enzyme pattern narrows the category before any imaging is needed. The key red flags are signs of fulminant hepatic failure (coagulopathy, encephalopathy), the Charcot triad of fever, jaundice, and right upper quadrant pain that signals ascending cholangitis (a biliary emergency), and painless jaundice with a palpable, nontender gallbladder (Courvoisier sign), which points toward malignant obstruction rather than a stone.',

    exam_findings:
      'Scleral icterus and skin jaundice severity → tracks the bilirubin level itself, not the underlying mechanism\nSpider angiomata, palmar erythema, caput medusae, gynecomastia → chronic liver disease with portal hypertension\nTender hepatomegaly → acute hepatitis or acute hepatic congestion\nNontender, palpable gallbladder (Courvoisier sign) → malignant distal biliary obstruction (e.g., pancreatic head cancer) rather than gallstone disease\nCharcot triad (fever, jaundice, right upper quadrant pain) → ascending cholangitis\nAsterixis and altered mental status → hepatic encephalopathy from decompensated liver failure\nSplenomegaly → portal hypertension or an underlying hemolytic process\nDark urine with pale, acholic stools → conjugated hyperbilirubinemia from biliary obstruction',

    ddx: [
      {
        condition: 'Hemolytic anemia (prehepatic)',
        key_features:
          'Predominantly indirect (unconjugated) hyperbilirubinemia, elevated LDH, low haptoglobin, reticulocytosis, normal liver enzymes, and possibly splenomegaly.',
        mechanism:
          'Accelerated red blood cell destruction (intravascular or extravascular) releases heme faster than it can be catabolized and conjugated. Unconjugated bilirubin production overwhelms the liver’s conjugating capacity (UDP-glucuronosyltransferase, UGT1A1), so unconjugated bilirubin rises disproportionately to conjugated bilirubin.',
      },
      {
        condition: 'Gilbert syndrome',
        key_features:
          'Mild, intermittent unconjugated hyperbilirubinemia that worsens with fasting, illness, or stress; normal liver enzymes and no evidence of hemolysis; an entirely benign course.',
        mechanism:
          'A promoter polymorphism reduces the activity of UGT1A1, the enzyme responsible for conjugating bilirubin with glucuronic acid. Mildly impaired conjugation causes intermittent, low-grade unconjugated hyperbilirubinemia without any underlying hepatocyte injury.',
      },
      {
        condition: 'Acute viral hepatitis (A, B, or C)',
        key_features:
          'A prodrome of malaise, nausea, and anorexia, marked transaminase elevation, relevant exposure history (travel, injection drug use, sexual contact), and a mixed hyperbilirubinemia.',
        mechanism:
          'Direct viral cytopathic injury and cytotoxic T-cell-mediated destruction of infected hepatocytes impair bilirubin uptake, conjugation, and canalicular excretion simultaneously. The combined defect produces a mixed hyperbilirubinemia alongside a hepatocellular pattern of markedly elevated aminotransferases.',
      },
      {
        condition: 'Alcoholic hepatitis',
        key_features:
          'An AST:ALT ratio greater than 2:1 with both values usually under 400, a history of heavy alcohol use, tender hepatomegaly, and disproportionately elevated GGT.',
        mechanism:
          'Ethanol metabolism through alcohol and aldehyde dehydrogenase generates acetaldehyde and shifts the hepatocyte’s redox state toward excess NADH, causing mitochondrial dysfunction, steatosis, and direct hepatocyte injury. This impairs bilirubin processing and bile canalicular transport, producing a mixed hyperbilirubinemia superimposed on hepatocellular injury.',
      },
      {
        condition: 'Choledocholithiasis',
        key_features:
          'Right upper quadrant or epigastric pain, conjugated hyperbilirubinemia with elevated alkaline phosphatase and GGT, and a dilated common bile duct on ultrasound, often with known gallstones.',
        mechanism:
          'A gallstone migrates out of the gallbladder and obstructs the common bile duct, blocking the outflow of bile that hepatocytes have already conjugated and excreted into the canaliculi. Rising pressure in the obstructed biliary tree forces conjugated bilirubin back across disrupted tight junctions into the bloodstream.',
      },
      {
        condition: 'Pancreatic head adenocarcinoma',
        key_features:
          'Painless, progressively worsening jaundice, unintentional weight loss, a palpable nontender gallbladder (Courvoisier sign), and sometimes new-onset atypical diabetes.',
        mechanism:
          'A tumor arising in the head of the pancreas compresses or invades the adjacent intrapancreatic common bile duct, causing gradual extrinsic obstruction. Because the gallbladder and cystic duct are otherwise normal (unlike in stone disease, which scars the gallbladder over time), the gallbladder distends smoothly and remains palpable but nontender as conjugated bilirubin steadily rises.',
      },
      {
        condition: 'Primary sclerosing cholangitis',
        key_features:
          'A chronic cholestatic enzyme pattern (disproportionately elevated alkaline phosphatase), a strong association with ulcerative colitis, and a "beaded" appearance of the bile ducts on cholangiography.',
        mechanism:
          'An immune-mediated process causes periductal fibrosis and inflammation of the intrahepatic and extrahepatic bile ducts, producing multifocal strictures alternating with dilations. The resulting irregular narrowing progressively impairs bile flow, producing conjugated hyperbilirubinemia and cholestasis as the disease advances.',
      },
      {
        condition: 'Ascending cholangitis',
        key_features:
          'The Charcot triad of fever, right upper quadrant pain, and jaundice, usually developing on top of an existing obstructing common bile duct stone; may progress to hypotension and altered mental status (Reynolds pentad).',
        mechanism:
          'Bacteria ascend from the duodenum into a biliary tree that is obstructed and stagnant (typically from a retained common bile duct stone), establishing a suppurative infection under pressure. Ongoing obstruction and inflammation of the bile ducts further impair bile excretion, raising conjugated bilirubin, while the infection itself carries a high risk of bacteremia and sepsis.',
      },
    ],
  },

  {
    slug: 'hematuria',
    title: 'Hematuria',
    system_tag: 'GI/Renal',
    sort_order: 3,

    big_picture:
      'Hematuria splits first into glomerular (dysmorphic red cells, red cell casts, and often proteinuria, pointing to a glomerulonephritis) versus non-glomerular/urologic (normal-appearing red cells, pointing to stones, infection, structural lesions, or tumor), and second into gross versus microscopic. Where in the urinary stream the blood appears — initial, terminal, or throughout — can further localize the source to the urethra, the bladder neck or prostate, or the upper tract/bladder respectively. The single most important red flag is painless gross hematuria in an adult, particularly a smoker or someone over 35–40, which must be assumed to be urothelial malignancy until cystoscopy and upper-tract imaging prove otherwise. Associated flank pain, fever, or a rapid rise in creatinine changes the urgency and direction of the workup considerably.',

    exam_findings:
      'Costovertebral angle tenderness → pyelonephritis or an obstructing renal stone\nSuprapubic tenderness → cystitis\nPalpable flank mass → renal cell carcinoma or polycystic kidney disease\nHypertension with periorbital or peripheral edema → glomerulonephritis (nephritic syndrome)\nEnlarged, nodular, asymmetric prostate on digital rectal exam → prostate cancer\nInitial hematuria (blood at the start of the stream that then clears) → a urethral source\nTerminal hematuria (blood at the end of the stream) → a bladder neck or prostatic source\nTotal hematuria present throughout the stream → an upper tract (renal) or diffuse bladder source',

    ddx: [
      {
        condition: 'Nephrolithiasis',
        key_features:
          'Gross or microscopic hematuria with colicky flank pain radiating to the groin, normal-appearing (non-dysmorphic) red cells, a stone visible on non-contrast CT.',
        mechanism:
          'A stone traversing or lodged in the urinary tract mechanically abrades the urothelium as it moves, while the accompanying obstruction raises intraluminal pressure and further injures the mucosa, both of which release red cells into the urine.',
      },
      {
        condition: 'Acute cystitis / urinary tract infection',
        key_features:
          'Dysuria, urinary urgency and frequency, suprapubic discomfort, and usually microscopic hematuria accompanied by pyuria and bacteriuria on urinalysis.',
        mechanism:
          'Bacterial invasion of the bladder mucosa provokes an acute neutrophilic inflammatory response with mucosal capillary injury and superficial erosion, allowing red blood cells to leak into the urine alongside white cells and bacteria.',
      },
      {
        condition: 'Bladder urothelial carcinoma',
        key_features:
          'Painless, often intermittent gross hematuria in an older patient with a smoking history; no proteinuria or dysmorphic red cells; a mass identified on cystoscopy.',
        mechanism:
          'Malignant urothelial cells form a disorganized, hypervascular tumor surface that lacks the normal protective mucosal architecture. This friable surface bleeds spontaneously with only the minor trauma of normal urine flow across it.',
      },
      {
        condition: 'Renal cell carcinoma',
        key_features:
          'May present with only painless hematuria, or with the classic (though uncommon when all three occur together) triad of flank pain, a palpable mass, and hematuria; occasionally accompanied by paraneoplastic polycythemia from ectopic erythropoietin.',
        mechanism:
          'The tumor invades or protrudes into the renal collecting system, and its disorganized neovasculature is structurally fragile, allowing direct hemorrhage from the tumor surface into the urinary tract.',
      },
      {
        condition: 'IgA nephropathy',
        key_features:
          'Gross hematuria appearing one to two days after an upper respiratory or gastrointestinal infection ("synpharyngitic" hematuria), often recurrent, with dysmorphic red cells or red cell casts and normal or mildly elevated creatinine.',
        mechanism:
          'Poorly O-glycosylated IgA1-containing immune complexes deposit in the glomerular mesangium, activating complement and driving mesangial cell proliferation. The resulting disruption of the glomerular capillary wall allows red cells to enter the urinary space, becoming distorted (dysmorphic) as they pass through the damaged basement membrane and tubular system.',
      },
      {
        condition: 'Benign prostatic hyperplasia',
        key_features:
          'An older man with lower urinary tract symptoms (weak stream, hesitancy, nocturia), microscopic or occasionally gross hematuria, and a diffusely enlarged, smooth prostate on exam.',
        mechanism:
          'Hyperplastic prostatic tissue compresses the urethra and congests the periurethral venous plexus and prostatic mucosa. The increased vascularity of hyperplastic tissue, combined with mechanical straining to void, can rupture small submucosal vessels and produce hematuria.',
      },
      {
        condition: 'Post-streptococcal glomerulonephritis',
        key_features:
          'A child with cola-colored urine, periorbital edema, and hypertension appearing one to three weeks after a group A streptococcal pharyngitis or skin infection, with a low serum C3.',
        mechanism:
          'Immune complexes containing streptococcal antigens deposit in the subepithelial space of the glomerular basement membrane, triggering complement activation and a neutrophilic inflammatory response. The resulting disruption of the capillary wall allows red cells and protein to leak into the tubular fluid.',
      },
      {
        condition: 'Autosomal dominant polycystic kidney disease',
        key_features:
          'A family history of the disease, bilateral flank masses, hypertension, and episodic gross hematuria from cyst rupture or hemorrhage, often with associated intracranial (berry) aneurysms.',
        mechanism:
          'Mutations in PKD1 or PKD2 disrupt polycystin-mediated tubular epithelial signaling, driving progressive cyst formation throughout the renal parenchyma. Vessels within cyst walls are prone to rupture, or cysts themselves can hemorrhage into the collecting system, releasing blood into the urine.',
      },
    ],
  },

  {
    slug: 'dysuria',
    title: 'Dysuria',
    system_tag: 'GI/Renal',
    sort_order: 4,

    big_picture:
      'Dysuria — pain or burning with urination — most often signals mucosal irritation somewhere along the lower urinary tract, so the first branch point is infectious versus non-infectious, and within infectious causes, whether the process is confined to the bladder or urethra versus having ascended to the kidney or prostate. In women it is also worth distinguishing true urinary-source (internal) dysuria from external dysuria caused by urine passing over inflamed vulvovaginal tissue, since the workup and treatment differ completely. Red flags that change management include fever, flank pain, or systemic toxicity suggesting pyelonephritis or prostatitis rather than simple cystitis; dysuria in a man, where uncomplicated cystitis is uncommon and prostatitis or a sexually transmitted infection should be considered; and chronic dysuria with persistently negative cultures, which raises interstitial cystitis or another non-bacterial cause.',

    exam_findings:
      'Suprapubic tenderness → cystitis\nCostovertebral angle tenderness with fever → pyelonephritis (upper tract involvement)\nExquisitely tender, boggy prostate on digital rectal exam → acute bacterial prostatitis (perform the exam gently, since vigorous prostatic massage can precipitate bacteremia)\nUrethral discharge → urethritis, gonococcal or chlamydial\nVulvovaginal erythema and discharge without urinary frequency or urgency → vaginitis mimicking true dysuria\nHigh fever, vomiting, and marked costovertebral tenderness → complicated or severe pyelonephritis\nExternal genital ulcers or vesicles → herpes simplex infection\nA normal pelvic or genital exam with persistent symptoms and repeatedly negative cultures → interstitial cystitis/bladder pain syndrome',

    ddx: [
      {
        condition: 'Acute uncomplicated cystitis',
        key_features:
          'Dysuria, urgency, and frequency with suprapubic discomfort but no fever or flank pain; pyuria and bacteriuria on urinalysis; typically a sexually active woman.',
        mechanism:
          'Uropathogenic bacteria, most commonly E. coli using P-fimbriae, ascend the urethra and adhere to and invade the bladder urothelium. The resulting inflammatory response sensitizes bladder and urethral nociceptors, producing pain with the mechanical stretch and flow of voiding.',
      },
      {
        condition: 'Acute pyelonephritis',
        key_features:
          'Dysuria plus fever, chills, and flank pain, with costovertebral angle tenderness and pyuria that includes white cell casts on urinalysis.',
        mechanism:
          'Infection ascends from the bladder (or occasionally arrives hematogenously) to reach the renal pelvis and parenchyma, producing interstitial inflammation and edema. Alongside the systemic infectious process, ongoing lower urinary tract mucosal irritation from the ascending infection continues to contribute to dysuria.',
      },
      {
        condition: 'Chlamydial urethritis',
        key_features:
          'Dysuria with scant, mucoid discharge that is often subtler than gonococcal infection, frequently asymptomatic in women, positive on nucleic acid amplification testing.',
        mechanism:
          'Chlamydia trachomatis, an obligate intracellular organism, infects urethral columnar epithelial cells and provokes a predominantly lymphocytic and monocytic inflammatory response. This produces urethral mucosal irritation and pain with urination that is generally milder than the brisk neutrophilic response seen with gonorrhea.',
      },
      {
        condition: 'Gonococcal urethritis',
        key_features:
          'Dysuria with copious purulent urethral discharge and rapid onset (two to five days after exposure); Gram-negative intracellular diplococci seen on Gram stain of the discharge.',
        mechanism:
          'Neisseria gonorrhoeae directly invades urethral epithelial cells, triggering an intense neutrophilic inflammatory response. The resulting purulent exudate and marked mucosal irritation produce pronounced pain with voiding.',
      },
      {
        condition: 'Acute bacterial prostatitis',
        key_features:
          'Dysuria with perineal or suprapubic pain, fever and chills, and an exquisitely tender, boggy prostate on exam, often in a man with recent urethral instrumentation or a preceding urinary tract infection.',
        mechanism:
          'Bacteria, usually ascending from the urethra or bladder, infect the prostate gland and cause acute glandular inflammation and edema. The swollen gland compresses the prostatic urethra and irritates surrounding tissue, producing pain referred to the perineum as well as pain with urination.',
      },
      {
        condition: 'Vulvovaginal candidiasis',
        key_features:
          'External dysuria — burning as urine passes over inflamed labia rather than true bladder-source pain — with thick, curdy discharge and pruritus; no true frequency or urgency; urine culture negative.',
        mechanism:
          'Overgrowth of Candida causes inflammation and excoriation of the vulvovaginal mucosa. When urine subsequently contacts this inflamed external tissue during voiding, it produces a burning sensation that mimics true urinary dysuria despite the bladder itself being entirely uninvolved.',
      },
      {
        condition: 'Interstitial cystitis / bladder pain syndrome',
        key_features:
          'Chronic dysuria and suprapubic pain with urgency and frequency lasting more than six weeks, worsening as the bladder fills and improving after voiding, with repeatedly negative urine cultures; cystoscopy may show glomerulations or Hunner lesions.',
        mechanism:
          'A defective urothelial glycosaminoglycan layer allows urinary solutes, particularly potassium, to leak into the bladder submucosa. This activates sensory nerve fibers and resident mast cells, producing chronic neurogenic bladder-wall inflammation and pain independent of any infection.',
      },
      {
        condition: 'Genital herpes simplex infection',
        key_features:
          'Often severe external dysuria from urine contacting painful vesicles or ulcers on the genitalia, tender inguinal lymphadenopathy, and in severe cases urinary retention from pain-related voiding avoidance.',
        mechanism:
          'HSV replicates within genital and perigenital epithelial cells, causing cytolysis and the formation of painful vesicles that rupture into ulcers. Urination over these denuded, richly innervated areas directly activates exposed nerve endings, producing intense external dysuria.',
      },
    ],
  },

  {
    slug: 'nausea-vomiting',
    title: 'Nausea and Vomiting',
    system_tag: 'GI/Renal',
    sort_order: 5,

    big_picture:
      'Nausea and vomiting are produced by a shared final common pathway — the medullary vomiting center and the chemoreceptor trigger zone in the area postrema — that can be activated by GI tract irritation or obstruction, vestibular input, direct central nervous system pathology, metabolic or endocrine derangements, drugs and toxins, or pregnancy. The most useful initial distinctions are whether vomiting is accompanied by abdominal pain (favoring a surgical or obstructive process) and whether the course is acute or chronic. Red flags that change the urgency of the workup include bilious or feculent vomiting (suggesting mechanical obstruction), hematemesis, early-morning vomiting with little preceding nausea and an accompanying headache or papilledema (suggesting raised intracranial pressure), and a positive pregnancy test in any woman of reproductive age presenting with new vomiting.',

    exam_findings:
      'Succussion splash on abdominal exam → gastric outlet obstruction or retained gastric contents\nHigh-pitched, hyperactive bowel sounds early, or a silent abdomen later → mechanical bowel obstruction or ileus\nPapilledema or focal neurologic deficits → increased intracranial pressure or a mass lesion\nNystagmus with a positive Dix-Hallpike maneuver → a vestibular cause\nAbdominal distension with tympany to percussion → obstruction or ileus\nEpigastric tenderness → gastritis or peptic ulcer disease\nDry mucous membranes, tachycardia, and poor skin turgor → a marker of dehydration severity regardless of the underlying cause\nFruity breath odor with Kussmaul respirations → diabetic ketoacidosis',

    ddx: [
      {
        condition: 'Viral gastroenteritis',
        key_features:
          'Acute-onset nausea and vomiting with watery diarrhea, diffuse crampy abdominal pain, low-grade fever, sick contacts, and a self-limited course.',
        mechanism:
          'Viral infection (e.g., norovirus, rotavirus) injures small intestinal enterocytes and disrupts normal fluid and electrolyte transport. Local release of inflammatory mediators and serotonin from enterochromaffin cells stimulates vagal afferents that signal directly to the medullary vomiting center.',
      },
      {
        condition: 'Mechanical bowel obstruction',
        key_features:
          'Bilious vomiting (proximal obstruction) or feculent, foul-smelling vomiting (distal, late obstruction), colicky abdominal pain, distension, and obstipation, often with a history of prior abdominal surgery or hernia.',
        mechanism:
          'A mechanical blockage causes proximal bowel distension and rising luminal pressure; the distension itself activates mechanoreceptors that signal via vagal and spinal afferents to the vomiting center, while retrograde peristalsis expels the accumulated proximal contents.',
      },
      {
        condition: 'Diabetic ketoacidosis',
        key_features:
          'Nausea and vomiting with polyuria, polydipsia, diffuse abdominal pain, Kussmaul respirations, and a fruity breath odor, with hyperglycemia, an anion-gap metabolic acidosis, and ketosis.',
        mechanism:
          'Absolute or relative insulin deficiency drives unrestrained lipolysis and hepatic ketogenesis. The circulating ketoacids and metabolic derangement directly stimulate the chemoreceptor trigger zone in the area postrema, which lacks a complete blood-brain barrier and senses circulating toxins and metabolites, triggering nausea and vomiting.',
      },
      {
        condition: 'Increased intracranial pressure (mass lesion or hemorrhage)',
        key_features:
          'Early-morning, often projectile vomiting with little preceding nausea, an associated headache that worsens with Valsalva maneuvers, papilledema, and focal neurologic deficits.',
        mechanism:
          'Elevated intracranial pressure or direct mass effect acts on the area postrema and adjacent dorsal vagal complex in the medulla, directly triggering the vomiting center. This bypasses the gradual buildup of nausea typically produced by GI-mediated vomiting, which is why vomiting can precede or occur without significant preceding nausea.',
      },
      {
        condition: 'Hyperemesis gravidarum',
        key_features:
          'Persistent, severe nausea and vomiting in the first trimester causing more than five percent body weight loss and dehydration or electrolyte disturbance, often with markedly elevated hCG (e.g., multiple gestation, molar pregnancy).',
        mechanism:
          'Rapidly rising human chorionic gonadotropin and estrogen levels are thought to directly stimulate the chemoreceptor trigger zone and slow gastric motility, producing nausea and vomiting well beyond the degree of typical early-pregnancy "morning sickness."',
      },
      {
        condition: 'Vestibular neuritis',
        key_features:
          'Acute, severe vertigo with prominent nausea and vomiting, nystagmus, and gait instability, frequently following a viral illness, with no other focal neurologic deficits and an abnormal head impulse test.',
        mechanism:
          'Inflammation of the vestibular nerve generates an asymmetric, erroneous signal of movement to the vestibular nuclei. This mismatched vestibular input is relayed to the medullary emetic pathways via connections between the vestibular nuclei and the vomiting center, producing nausea and vomiting alongside vertigo.',
      },
      {
        condition: 'Opioid- or chemotherapy-induced nausea',
        key_features:
          'Nausea and vomiting with a clear temporal relationship to a new or dose-escalated medication (opioids, cisplatin and other chemotherapeutic agents), resolving with dose adjustment, antiemetics, or discontinuation.',
        mechanism:
          'Opioids and many chemotherapeutic agents directly stimulate dopamine (D2) and serotonin (5-HT3) receptors in the chemoreceptor trigger zone; opioids additionally slow gastric emptying. Both effects converge on the same emetic pathway to trigger the vomiting reflex.',
      },
      {
        condition: 'Uremia (advanced chronic kidney disease)',
        key_features:
          'Nausea and vomiting with anorexia, fatigue, and pruritus, markedly elevated BUN and creatinine, and sometimes a metallic taste or uremic fetor.',
        mechanism:
          'Accumulation of nitrogenous waste products and other uremic toxins that the failing kidney can no longer clear directly stimulates the chemoreceptor trigger zone, and also produces uremic gastritis and enteritis, both of which contribute to persistent nausea and vomiting.',
      },
    ],
  },

  // ===========================================================================
  // Cluster — MSK / Derm / Heme
  // ===========================================================================
  {
    slug: "joint-pain",
    title: "Joint Pain",
    system_tag: "MSK/Derm/Heme",
    sort_order: 1,

    big_picture:
      "Start by splitting the presentation two ways: monoarticular versus polyarticular, and inflammatory (warmth, erythema, prolonged morning stiffness, elevated inflammatory markers) versus non-inflammatory/mechanical. Acute monoarticular joint pain with fever or an inability to bear weight is septic arthritis until proven otherwise — arthrocentesis with synovial fluid cell count, gram stain, and culture should not be delayed, since bacterial infection can destroy cartilage within days. Polyarticular, symmetric small-joint disease raises autoimmune causes (rheumatoid arthritis, SLE), while an asymmetric, lower-extremity, post-infectious pattern points toward the spondyloarthropathies. Crystal arthropathies (gout, CPPD) can mimic infection closely and are distinguished only by synovial fluid crystal analysis, so both are often pursued at once rather than sequentially. Age, tempo of onset, and systemic symptoms (fever, rash, mucosal ulcers) narrow things further before any lab test returns.",

    exam_findings:
      "Warmth, erythema, and effusion over the joint → inflammatory arthritis (infectious, crystal, or autoimmune)\nBony enlargement with Heberden's (DIP) and Bouchard's (PIP) nodes → osteoarthritis\nSymmetric small-joint (MCP/PIP/wrist) swelling with morning stiffness lasting over an hour → rheumatoid arthritis\nDactylitis (\"sausage digit\") → psoriatic or reactive arthritis\nNail pitting or onycholysis → psoriatic arthritis\nTophi over extensor surfaces or the ear helix → chronic tophaceous gout\nMalar rash and oral ulcers accompanying the arthritis → SLE\nConjunctivitis and urethritis alongside an asymmetric lower-extremity arthritis → reactive arthritis\nSacroiliac tenderness with reduced spinal flexion (Schober test) → axial spondyloarthropathy\nInability to bear weight, a single hot swollen joint, and fever → septic arthritis until excluded",

    ddx: [
      {
        condition: "Septic arthritis",
        key_features: "Acute monoarticular pain with fever, inability to bear weight, markedly restricted range of motion, elevated ESR/CRP and peripheral WBC, synovial fluid WBC typically >50,000/μL with neutrophil predominance and a positive gram stain or culture.",
        mechanism: "Hematogenous seeding (or direct/contiguous spread) introduces bacteria — commonly Staphylococcus aureus, or Neisseria gonorrhoeae in young sexually active adults — into the normally sterile synovial space. Bacterial proliferation and the resulting neutrophilic response release proteolytic enzymes and cytokines that degrade cartilage matrix within days, making this a joint-destroying emergency rather than just a painful joint."
      },
      {
        condition: "Gout",
        key_features: "Rapid overnight onset of severe pain and swelling, classically at the first metatarsophalangeal joint (podagra); tophi in chronic disease; negatively birefringent, needle-shaped crystals on polarized microscopy of synovial fluid.",
        mechanism: "Chronic hyperuricemia supersaturates synovial fluid, and monosodium urate crystallizes preferentially in cooler, less well-perfused peripheral joints. Resident macrophages phagocytose the crystals, which activate the NLRP3 inflammasome and drive IL-1β release, triggering an intense neutrophilic influx that produces the abrupt, severe inflammation."
      },
      {
        condition: "Calcium pyrophosphate deposition disease (pseudogout)",
        key_features: "Older patients, knee or wrist most commonly affected, chondrocalcinosis visible on plain radiographs, rhomboid-shaped, positively birefringent crystals on synovial fluid analysis.",
        mechanism: "Calcium pyrophosphate crystals deposit within articular cartilage over years (associated with aging, hemochromatosis, and hyperparathyroidism); when crystals shed into the joint space they activate the same macrophage/NLRP3 inflammasome pathway as urate, producing an acute synovitis that can be clinically indistinguishable from gout without crystal analysis."
      },
      {
        condition: "Rheumatoid arthritis",
        key_features: "Symmetric polyarthritis of the MCP, PIP, and wrist joints (DIP spared), morning stiffness lasting over an hour that improves with activity, positive rheumatoid factor and anti-CCP antibodies, marginal erosions on imaging.",
        mechanism: "Anti-CCP antibodies and immune complexes activate synovial fibroblasts and recruit T cells and macrophages that secrete TNF-α, IL-6, and IL-1. This drives proliferation of an invasive synovial pannus that progressively erodes articular cartilage and subchondral bone."
      },
      {
        condition: "Osteoarthritis",
        key_features: "Pain that worsens with joint use and improves with rest, brief morning stiffness under 30 minutes, Heberden's and Bouchard's nodes, joint space narrowing with osteophytes on imaging, and minimal systemic or laboratory abnormality.",
        mechanism: "Mechanical loading over time outpaces chondrocyte repair capacity; matrix metalloproteinase activity degrades articular cartilage faster than it can be replaced, exposing subchondral bone, which responds with sclerosis and osteophyte formation, accompanied by only low-grade secondary synovial inflammation."
      },
      {
        condition: "Reactive arthritis",
        key_features: "Asymmetric oligoarthritis of the lower extremities arising one to four weeks after a gastrointestinal (Campylobacter, Salmonella, Shigella) or genitourinary (Chlamydia trachomatis) infection, often with conjunctivitis/uveitis, urethritis, and enthesitis; HLA-B27 association.",
        mechanism: "An antecedent mucosal infection triggers an immune-mediated synovitis through molecular mimicry and persistent bacterial antigen deposition in the joint, without viable organisms typically recoverable by synovial fluid culture — an autoimmune/postinfectious process rather than direct joint infection."
      },
      {
        condition: "SLE-associated arthritis",
        key_features: "Symmetric, small-joint, often migratory arthritis that is typically nonerosive, accompanied by malar rash, photosensitivity, oral ulcers, and positive ANA/anti-dsDNA; a reducible, non-erosive deformity (Jaccoud arthropathy) can occur in longstanding disease.",
        mechanism: "Immune complex deposition and complement activation produce inflammation of the synovium and periarticular ligaments/tendons, but — unlike rheumatoid arthritis — there is no invasive cartilage-eroding pannus, so joint damage (when present) comes from ligamentous laxity rather than bone erosion."
      },
      {
        condition: "Psoriatic arthritis",
        key_features: "Psoriasis (often with nail pitting or onycholysis), dactylitis, and DIP joint involvement, which distinguishes it from rheumatoid arthritis; asymmetric oligoarthritis or axial disease; \"pencil-in-cup\" deformity on imaging in advanced disease.",
        mechanism: "IL-23/IL-17 axis activation drives Th17-mediated inflammation concentrated at entheses (tendon/ligament insertion sites) and synovium, simultaneously stimulating osteoclastic bone erosion and osteoblastic new bone formation (periostitis) — a combination of destruction and proliferation not seen in purely erosive arthritides."
      }
    ]
  },
  {
    slug: "rash",
    title: "Rash",
    system_tag: "MSK/Derm/Heme",
    sort_order: 2,

    big_picture:
      "Rash is one of the least specific presenting complaints in medicine, so the exam does most of the diagnostic work: morphology (macular, papular, vesicular, petechial/purpuric), distribution, and whether individual lesions blanch with pressure. The single most important branch point is blanching versus non-blanching — petechiae and purpura suggest a vascular or hematologic process (vasculitis, thrombocytopenia, DIC, meningococcemia) and, especially with fever, demand urgent evaluation. Mucosal involvement with skin sloughing or a positive Nikolsky sign signals a severe drug reaction (Stevens-Johnson syndrome/TEN) or staphylococcal scalded skin syndrome, both dermatologic emergencies. Chronicity and associated systemic symptoms then separate self-limited or purely cutaneous causes (contact dermatitis, urticaria, psoriasis) from infectious exanthems and systemic autoimmune or infectious disease.",

    exam_findings:
      "Lesions blanch fully with pressure → vasodilation/inflammation (urticaria, viral exanthem); non-blanching (petechiae/purpura) → vasculitis, thrombocytopenia, or DIC\nTarget lesions with dusky, necrotic centers → erythema multiforme/Stevens-Johnson-TEN spectrum\nGrouped vesicles on an erythematous base confined to one dermatome → herpes zoster\nKoplik spots on the buccal mucosa preceding a cephalocaudally spreading rash → measles\nMalar (\"butterfly\") rash sparing the nasolabial folds → SLE\nHerald patch followed by a \"Christmas tree\" truncal distribution → pityriasis rosea\nWell-demarcated plaques with silvery, micaceous scale on extensor surfaces → psoriasis\nHoney-colored crusting over superficial erosions → impetigo\nPositive Nikolsky sign (skin shears off with lateral pressure) → SJS/TEN or staphylococcal scalded skin syndrome\nPalpable purpura concentrated on dependent (gravity-affected) skin → small-vessel (leukocytoclastic) vasculitis",

    ddx: [
      {
        condition: "Urticaria",
        key_features: "Individual wheals that are intensely pruritic, blanch fully, and resolve within 24 hours (though new lesions continue to appear elsewhere); may coexist with angioedema; dermatographism can be elicited.",
        mechanism: "Mast cell and basophil degranulation — IgE-mediated or through direct mast cell activation — releases histamine and other vasoactive mediators, producing dermal vasodilation and increased capillary permeability. Because the process is purely vascular, there is no epidermal change and lesions leave no residual mark."
      },
      {
        condition: "Allergic contact dermatitis",
        key_features: "Geographic or linear eruption matching the exact site of allergen contact (poison ivy, nickel, a new topical product), well-demarcated borders, vesiculation possible, onset 24–48 hours after re-exposure.",
        mechanism: "A type IV (delayed) hypersensitivity reaction: allergen-specific T cells sensitized on first exposure release cytokines upon re-exposure that recruit inflammatory cells into the epidermis and dermis, producing spongiotic dermatitis — distinct from irritant contact dermatitis, which instead reflects direct chemical or physical disruption of the epidermal barrier without T-cell sensitization."
      },
      {
        condition: "Psoriasis",
        key_features: "Well-demarcated, erythematous plaques with thick silvery scale over extensor surfaces (elbows, knees) and the scalp, nail pitting, and pinpoint bleeding when scale is removed (Auspitz sign).",
        mechanism: "IL-23/IL-17 axis-driven keratinocyte hyperproliferation shortens epidermal turnover time from roughly 28 days to 3–5 days. Keratinocytes are shed before they can fully mature and desquamate normally, producing the thick parakeratotic scale characteristic of the plaques."
      },
      {
        condition: "Herpes zoster",
        key_features: "Grouped vesicles on an erythematous base strictly confined to a single dermatome, does not cross the midline, often preceded or accompanied by neuropathic (burning) pain in that distribution.",
        mechanism: "Reactivation of latent varicella-zoster virus within a dorsal root (or cranial nerve) ganglion allows the virus to replicate and travel anterogradely down the sensory axon to its corresponding dermatome, where direct viral cytopathic effect (ballooning degeneration of keratinocytes) produces the vesicles."
      },
      {
        condition: "Stevens-Johnson syndrome / toxic epidermal necrolysis",
        key_features: "Target or atypical target lesions progressing to mucosal erosions (oral, ocular, genital) and skin detachment, a positive Nikolsky sign, and body-surface-area involvement (<10% for SJS, >30% for TEN) following a new medication (or, for milder erythema multiforme, an HSV trigger).",
        mechanism: "Drug- or infection-altered antigens presented on keratinocytes trigger a CD8+ cytotoxic T-lymphocyte response against the epidermis, releasing granzyme B, perforin, and Fas ligand that drive widespread keratinocyte apoptosis — producing full-thickness epidermal necrosis and detachment as the reaction becomes more severe."
      },
      {
        condition: "IgA vasculitis (Henoch-Schönlein purpura) / leukocytoclastic vasculitis",
        key_features: "Palpable purpura concentrated on dependent areas (lower extremities, buttocks); in IgA vasculitis, accompanied by arthralgias, colicky abdominal pain, and hematuria; biopsy shows perivascular IgA immune complex deposition.",
        mechanism: "Circulating immune complexes deposit in postcapillary venule walls and activate complement, recruiting neutrophils whose degranulation (producing the nuclear debris called leukocytoclasis) damages the vessel wall itself and allows red blood cells to extravasate into the dermis — hence purpura that is palpable, not just discolored."
      },
      {
        condition: "Secondary syphilis",
        key_features: "Diffuse papulosquamous rash classically involving the palms and soles, condylomata lata, generalized lymphadenopathy, mucous patches, and a positive nontreponemal test (RPR/VDRL) confirmed by a treponemal test.",
        mechanism: "Treponema pallidum disseminates hematogenously from the site of the primary chancre; the resulting rash reflects an immune-complex-mediated small-vessel vasculitis with a perivascular lymphocytic and plasma cell infiltrate in the dermis, rather than direct organism-mediated tissue destruction."
      },
      {
        condition: "Measles (rubeola)",
        key_features: "Prodrome of fever, cough, coryza, and conjunctivitis; Koplik spots on the buccal mucosa appearing just before the rash; an erythematous maculopapular eruption that begins at the hairline/face and spreads cephalocaudally, becoming confluent.",
        mechanism: "Measles virus infects respiratory epithelium, then disseminates via lymphatics and infected monocytes; the rash itself is largely a cell-mediated (T-lymphocyte) immune response directed against virus-infected epidermal and endothelial cells, which is why the exanthem is delayed until the host immune response mounts — and why it can be blunted or absent in patients with impaired cellular immunity."
      }
    ]
  },
  {
    slug: "lymphadenopathy",
    title: "Lymphadenopathy",
    system_tag: "MSK/Derm/Heme",
    sort_order: 3,

    big_picture:
      "The key questions are localized versus generalized adenopathy, and whether the node's character is reassuring (soft, tender, mobile — favoring a reactive/infectious process) or concerning (firm or hard, fixed, matted, non-tender — favoring malignancy). Node location matters on its own: a left supraclavicular node (Virchow's node) should always prompt a search for an intra-abdominal or thoracic malignancy. Duration and accompanying systemic (\"B\") symptoms — fever, drenching night sweats, unintentional weight loss — shift concern toward lymphoma, leukemia, or a granulomatous infection like tuberculosis rather than a benign reactive process. A node that is larger than 2 cm, persists beyond four to six weeks without an identified infectious trigger, or continues to enlarge merits excisional biopsy rather than continued observation.",

    exam_findings:
      "Tender, soft, mobile node(s) → reactive/infectious lymphadenopathy\nFirm, fixed, matted, non-tender node(s) → malignancy (lymphoma or metastatic carcinoma)\nSupraclavicular node, especially left-sided (Virchow's node) → intra-abdominal or thoracic malignancy\nGeneralized adenopathy with splenomegaly and exudative pharyngitis → EBV/infectious mononucleosis\nPosterior cervical/occipital adenopathy with a fine pink rash → rubella\nUnilateral tender axillary or epitrochlear node after a cat scratch or bite → cat-scratch disease (Bartonella henselae)\nPainless, rubbery cervical or supraclavicular node with B symptoms → Hodgkin lymphoma\nGeneralized adenopathy with hepatosplenomegaly and cytopenias → leukemia\nBilateral hilar adenopathy on imaging with uveitis or erythema nodosum → sarcoidosis\nMatted, gradually enlarging node with a draining sinus tract → tuberculous lymphadenitis (scrofula)",

    ddx: [
      {
        condition: "Reactive (viral) lymphadenopathy, e.g. EBV infectious mononucleosis",
        key_features: "Tender, mobile, bilateral cervical nodes with exudative pharyngitis, fatigue, and splenomegaly; peripheral smear shows atypical lymphocytosis; positive heterophile antibody (monospot) test.",
        mechanism: "Viral antigen exposure drives polyclonal proliferation of B and T lymphocytes within the node's germinal centers and paracortex as the immune system mounts a response, producing nodal enlargement from benign hyperplasia rather than any malignant infiltration."
      },
      {
        condition: "Suppurative bacterial lymphadenitis",
        key_features: "Unilateral, markedly tender, warm node with overlying erythema, sometimes fluctuant, typically following a local skin or pharyngeal infection with Streptococcus pyogenes or Staphylococcus aureus.",
        mechanism: "Bacteria drain via afferent lymphatics into the regional node, provoking an intense neutrophilic response; neutrophil and bacterial byproducts can liquefy nodal tissue into a frank abscess if the infection is not controlled."
      },
      {
        condition: "Cat-scratch disease (Bartonella henselae)",
        key_features: "Unilateral, tender regional node (often axillary or epitrochlear) developing days to weeks after a cat scratch or bite, low-grade fever, occasional suppuration, history of feline exposure.",
        mechanism: "Bartonella-infected macrophages and vascular endothelial cells provoke a granulomatous, stellate necrotizing lymphadenitis as the immune system attempts to wall off the intracellular organism, producing the characteristic necrotizing granulomas seen on biopsy."
      },
      {
        condition: "Tuberculous lymphadenitis (scrofula)",
        key_features: "Painless, gradually enlarging cervical node(s) that can become matted, fixed, and eventually form a draining sinus tract; constitutional symptoms (night sweats, weight loss); positive IGRA/PPD; caseating granulomas on biopsy.",
        mechanism: "Mycobacteria disseminate to regional lymph nodes, where cell-mediated immunity organizes granulomas with central caseous necrosis in an attempt to contain the organism; over time the caseous material can liquefy and erode through the overlying skin."
      },
      {
        condition: "Hodgkin lymphoma",
        key_features: "Painless, firm, rubbery, non-tender cervical or supraclavicular node(s) that spread to contiguous nodal groups, B symptoms (fever, night sweats, weight loss), occasional alcohol-induced nodal pain, Reed-Sternberg cells on biopsy.",
        mechanism: "Neoplastic Reed-Sternberg cells (derived from germinal-center B cells) secrete cytokines such as IL-5, IL-6, and TNF that recruit a massive reactive background of eosinophils, lymphocytes, plasma cells, and histiocytes — and this cytokine burden itself is what produces the systemic B symptoms."
      },
      {
        condition: "Non-Hodgkin lymphoma",
        key_features: "Painless nodal or extranodal enlargement that can be localized or generalized, growth rate varying with grade, B symptoms more common in aggressive subtypes, excisional biopsy showing a clonal lymphocyte population effacing normal architecture.",
        mechanism: "Monoclonal proliferation of B or T lymphocytes arrested at a specific point in maturation, driven by an acquired genetic lesion (for example, the t(14;18) translocation upregulating BCL2 in follicular lymphoma, or t(8;14) activating MYC in Burkitt lymphoma), replaces the normal nodal architecture with malignant cells."
      },
      {
        condition: "Metastatic carcinoma",
        key_features: "Firm-to-hard, fixed, non-tender node, with location often predicting the primary site (left supraclavicular/Virchow node → gastrointestinal or other intra-abdominal primary; anterior cervical → head and neck primary); history and exam findings pointing to the primary tumor.",
        mechanism: "Tumor cells shed from the primary lesion travel through afferent lymphatics and lodge in the first draining (\"sentinel\") node, where they proliferate and progressively efface the normal follicular and paracortical architecture."
      },
      {
        condition: "Sarcoidosis",
        key_features: "Bilateral hilar lymphadenopathy on chest imaging (often an incidental finding), peripheral adenopathy in some patients, erythema nodosum, uveitis, elevated serum ACE level, non-caseating granulomas on biopsy.",
        mechanism: "An exaggerated, Th1-predominant cell-mediated immune response to an unidentified antigen forms non-caseating granulomas — aggregates of epithelioid histiocytes and multinucleated giant cells that wall off antigen without the central necrosis seen in tuberculosis — within lymph nodes and other organs."
      }
    ]
  },
  {
    slug: "easy-bruising-bleeding",
    title: "Easy Bruising / Bleeding",
    system_tag: "MSK/Derm/Heme",
    sort_order: 4,

    big_picture:
      "The physiology splits bleeding disorders into primary hemostasis (platelets and von Willebrand factor, which form the initial platelet plug) and secondary hemostasis (the coagulation cascade, which stabilizes that plug into a fibrin clot) — and the clinical pattern of bleeding usually tells you which is at fault. Primary hemostasis defects produce immediate mucocutaneous bleeding: petechiae, epistaxis, gingival bleeding, and bruising after only minor trauma. Secondary hemostasis defects instead produce delayed, deep bleeding — hemarthroses and intramuscular hematomas — because the initial platelet plug forms normally but is never stabilized. A new bleeding tendency accompanied by other cytopenias, fever, or bone pain raises marrow infiltration (leukemia); bleeding plus schistocytes, renal failure, and neurologic changes is a hematologic emergency (TTP/HUS) until proven otherwise. Medication review (anticoagulants, antiplatelet agents) and a basic panel (platelet count, PT, aPTT) triage the workup before more specialized testing is needed.",

    exam_findings:
      "Petechiae and mucosal bleeding (epistaxis, gum bleeding) with bruising after only minor trauma → primary hemostasis (platelet or von Willebrand) disorder\nHemarthrosis and deep intramuscular hematomas, delayed bleeding after surgery or trauma → coagulation factor deficiency\nPalpable purpura rather than flat, bland purpura → vasculitis rather than a simple platelet/coagulation defect\nBruising in unusual or well-protected sites, inconsistent with the reported mechanism → consider non-accidental trauma\nHyperextensible skin and joint hypermobility → a connective tissue disorder (e.g., Ehlers-Danlos syndrome)\nSplenomegaly with bruising and pallor → marrow infiltration or hypersplenism/sequestration\nBruising with fever and bone pain → acute leukemia\nEcchymoses confined to sun-damaged extensor forearms in an elderly patient, sparing mucosa → senile/actinic purpura (vascular fragility, not a hemostatic defect)\nNew medication (anticoagulant or antiplatelet agent) preceding the bleeding → drug-induced",

    ddx: [
      {
        condition: "Immune thrombocytopenia (ITP)",
        key_features: "Isolated thrombocytopenia with an otherwise normal CBC, petechiae, purpura, and mucosal bleeding, typically no splenomegaly, an otherwise well-appearing patient, often preceded by a viral illness in children.",
        mechanism: "Autoantibodies form against platelet surface glycoproteins (commonly GPIIb/IIIa), opsonizing platelets for accelerated phagocytic destruction by splenic macrophages — peripheral destruction that outpaces the marrow's ability to compensate with increased production."
      },
      {
        condition: "Von Willebrand disease",
        key_features: "Mucocutaneous bleeding (epistaxis, menorrhagia, easy bruising), a positive family history, prolonged bleeding after dental extraction, a normal platelet count with abnormal platelet function testing, and low von Willebrand factor antigen/activity.",
        mechanism: "Quantitative or qualitative deficiency of von Willebrand factor impairs platelet adhesion to exposed subendothelial collagen at sites of vascular injury, since vWF is the physical bridge between platelet GPIb and collagen; it also destabilizes circulating factor VIII, so both the platelet plug and (to a lesser extent) the coagulation cascade are impaired."
      },
      {
        condition: "Hemophilia A or B",
        key_features: "Male patient (X-linked inheritance), hemarthroses and deep muscle hematomas, delayed bleeding after trauma or surgery, an isolated prolonged aPTT with a normal PT, and low factor VIII (hemophilia A) or factor IX (hemophilia B) activity.",
        mechanism: "Deficiency of a specific intrinsic-pathway clotting factor prevents adequate thrombin generation and fibrin clot stabilization at the site of injury; an initial platelet plug still forms but is friable and prone to rebleeding, especially at high-flow, mechanically stressed sites like joints."
      },
      {
        condition: "Disseminated intravascular coagulation (DIC)",
        key_features: "Bleeding from multiple sites simultaneously (IV lines, mucosa, surgical wounds) alongside microvascular thrombosis, in the setting of sepsis, trauma, malignancy, or an obstetric complication; low platelets, low fibrinogen, elevated D-dimer, prolonged PT/aPTT, and schistocytes on smear.",
        mechanism: "Widespread tissue factor exposure triggers systemic activation of the coagulation cascade, generating innumerable microthrombi that consume platelets and clotting factors faster than the liver and marrow can replace them — so the net clinical picture is paradoxical bleeding despite a fundamentally hypercoagulable trigger."
      },
      {
        condition: "Thrombotic thrombocytopenic purpura (TTP)",
        key_features: "Thrombocytopenia with microangiopathic hemolytic anemia (schistocytes, elevated LDH, low haptoglobin), neurologic changes, renal dysfunction, and fever (the classic pentad, often incomplete); severely reduced ADAMTS13 activity.",
        mechanism: "Deficiency (usually autoantibody-mediated, occasionally congenital) of ADAMTS13 — the protease that normally cleaves ultra-large von Willebrand factor multimers — allows these multimers to persist in circulation and spontaneously aggregate platelets throughout the microvasculature, consuming platelets and mechanically shearing red cells as they pass through the platelet-rich microthrombi."
      },
      {
        condition: "Acute leukemia (marrow failure/infiltration)",
        key_features: "Bruising and bleeding accompanied by fatigue (from anemia), fever or recurrent infection (from neutropenia), bone pain, hepatosplenomegaly, and blasts on peripheral smear or bone marrow biopsy.",
        mechanism: "Malignant blast proliferation crowds out normal trilineage hematopoiesis within the marrow space, so thrombocytopenia here results from impaired platelet production rather than peripheral destruction or consumption."
      },
      {
        condition: "Vitamin K deficiency or warfarin effect",
        key_features: "Bruising or bleeding in a patient with malabsorption, poor nutrition, prolonged broad-spectrum antibiotic use, or vitamin K antagonist therapy; a prolonged PT/INR (with the aPTT normal or, later, also prolonged); correction with vitamin K administration unless underlying liver disease is also present.",
        mechanism: "Vitamin K is a required cofactor for hepatic gamma-carboxylation of clotting factors II, VII, IX, and X (and proteins C and S); without adequate vitamin K — or when warfarin blocks its recycling — these factors are synthesized in normal quantity but are functionally inactive, impairing thrombin generation."
      },
      {
        condition: "Senile (actinic) purpura",
        key_features: "Ecchymoses confined to sun-damaged extensor forearms and the dorsal hands in elderly patients, sharp-edged but non-palpable, with a normal platelet count and normal coagulation studies, and no mucosal bleeding.",
        mechanism: "Chronic UV-induced degeneration of dermal collagen and the perivascular connective tissue that normally cushions and supports cutaneous vessels leaves those vessels poorly supported, so trivial mechanical shear tears them and blood tracks visibly through the thinned, atrophic dermis — a vascular fragility phenomenon rather than any true hemostatic defect."
      }
    ]
  },
  {
    slug: "unintentional-weight-loss",
    title: "Unintentional Weight Loss",
    system_tag: "MSK/Derm/Heme",
    sort_order: 5,

    big_picture:
      "Unintentional weight loss (conventionally defined as more than 5% of body weight over 6–12 months) reflects one of four underlying mechanisms: decreased intake, malabsorption, increased metabolic demand, or increased losses — and identifying which is present narrows the differential considerably. In older adults it is one of the strongest independent predictors of a serious underlying organic disease, so age and any localizing symptom (dysphagia, a change in bowel habits, cough, night sweats) should raise the threshold for a thorough workup rather than reassurance. Preserved or increased appetite despite ongoing weight loss points toward a hypermetabolic state or a calorie-losing process (hyperthyroidism, uncontrolled diabetes, malabsorption), whereas true anorexia points toward malignancy, chronic infection, or a psychiatric cause. Even after a complete evaluation, a meaningful fraction of cases remain idiopathic — but those patients still need close longitudinal follow-up rather than having the workup declared closed.",

    exam_findings:
      "Cachexia with a palpable mass, organomegaly, or lymphadenopathy → malignancy\nTachycardia, warm moist skin, tremor, lid lag, and goiter → hyperthyroidism\nOral thrush, oral hairy leukoplakia, and generalized lymphadenopathy → HIV/AIDS\nAbdominal distension, steatorrhea, and glossitis → malabsorption (celiac disease, chronic pancreatitis)\nNight sweats, low-grade fever, and chronic cough → tuberculosis\nFlat affect and psychomotor slowing → major depressive disorder\nCognitive impairment, poor dentition, and social isolation → decreased intake from dementia, dysphagia, or food insecurity\nPeripheral edema with jugular venous distension → heart failure/cardiac cachexia\nHyperpigmentation with orthostatic hypotension → adrenal insufficiency\nFine tremor with hyperreflexia → thyrotoxicosis",

    ddx: [
      {
        condition: "Malignancy (solid tumor, e.g. pancreatic, GI, or lung cancer)",
        key_features: "Age over 50, symptoms pointing to the primary site (dysphagia, jaundice, hemoptysis, a change in bowel habits), a palpable mass, cachexia, elevated inflammatory markers, and a diagnostic mass or lesion on imaging/biopsy.",
        mechanism: "Tumor cells and tumor-associated macrophages release proinflammatory cytokines (TNF-α, IL-6, IL-1) that both suppress hypothalamic appetite centers and directly activate the ubiquitin-proteasome pathway in skeletal muscle and lipolysis in adipose tissue — a systemic catabolic state (cancer cachexia) distinct from simple starvation, which is why nutritional supplementation alone rarely reverses it."
      },
      {
        condition: "Hyperthyroidism (e.g., Graves disease)",
        key_features: "Weight loss despite a normal or increased appetite, heat intolerance, palpitations, tremor, lid lag/stare, warm moist skin, a suppressed TSH with elevated free T4/T3.",
        mechanism: "Excess thyroid hormone increases basal metabolic rate across virtually every tissue — upregulating Na+/K+-ATPase activity and mitochondrial uncoupling protein expression — so caloric expenditure outpaces intake even when intake is preserved or actually increased."
      },
      {
        condition: "HIV/AIDS (untreated, advanced)",
        key_features: "Weight loss with chronic diarrhea, oral thrush, generalized lymphadenopathy, recurrent opportunistic infections, a low CD4 count, and positive HIV antibody/RNA testing.",
        mechanism: "Chronic immune activation and persistently elevated inflammatory cytokines drive a hypermetabolic catabolic state, compounded by anorexia from recurring opportunistic infections and true malabsorption from HIV enteropathy or GI pathogens — the combination is termed wasting syndrome once weight loss exceeds 10% of baseline."
      },
      {
        condition: "Celiac disease (and other malabsorptive disorders)",
        key_features: "Weight loss with chronic diarrhea or steatorrhea, bloating, iron-deficiency anemia, dermatitis herpetiformis, positive tissue transglutaminase IgA, and villous atrophy on duodenal biopsy.",
        mechanism: "Gluten exposure triggers an autoimmune, T-cell-mediated destruction of small bowel villi that flattens the absorptive surface area, so macronutrients and micronutrients pass through the gut unabsorbed despite adequate dietary intake."
      },
      {
        condition: "Major depressive disorder",
        key_features: "Weight loss accompanying anhedonia, depressed mood, sleep disturbance, and poor concentration, with the patient often directly reporting decreased appetite; symptoms present most of the day for at least two weeks.",
        mechanism: "Dysregulation of the hypothalamic-pituitary-adrenal axis and central monoaminergic signaling suppresses appetite-driving neural circuits, and behavioral withdrawal (reduced motivation to shop for or prepare food) compounds a true reduction in intake — a decreased-intake mechanism rather than a hypermetabolic one."
      },
      {
        condition: "Tuberculosis (or another chronic granulomatous infection)",
        key_features: "Weight loss with night sweats, low-grade fevers, and a chronic productive cough (if pulmonary), relevant risk factors (known exposure, incarceration, immunosuppression, travel to an endemic area), a positive IGRA/PPD, and acid-fast bacilli on sputum smear/culture.",
        mechanism: "Sustained mycobacterial antigen exposure drives ongoing TNF-α and IFN-γ release from activated macrophages and T cells, producing a catabolic state similar to malignancy-associated cachexia, while granuloma formation itself consumes host energy and protein resources."
      },
      {
        condition: "Uncontrolled diabetes mellitus",
        key_features: "Weight loss with polyuria, polydipsia, and polyphagia (appetite often preserved or increased), glucosuria, and a markedly elevated glucose/HbA1c.",
        mechanism: "Insulin deficiency or resistance prevents cellular glucose uptake, so despite hyperglycemia the body senses a starvation-like state and shifts toward lipolysis and proteolysis for fuel, while osmotic diuresis from glucosuria drives additional fluid and caloric loss directly through the urine."
      },
      {
        condition: "Adrenal insufficiency (Addison disease)",
        key_features: "Weight loss with fatigue, anorexia, nausea, orthostatic hypotension, hyperpigmentation (in primary disease), hyponatremia and hyperkalemia, and a low morning cortisol that fails to rise appropriately with ACTH stimulation.",
        mechanism: "Cortisol deficiency impairs gluconeogenesis and blunts the normal stress-adaptive appetite and metabolic regulation, while concurrent mineralocorticoid deficiency (in primary adrenal disease) causes ongoing sodium and volume loss — together producing anorexia, GI symptoms, and progressive weight loss."
      }
    ]
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
