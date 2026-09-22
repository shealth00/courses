// supabase/seed_pathophysiology.js — populates pathophysiology_topics, the
// symptom-first "Pathophysiology" tab (see schema_pathophysiology.sql /
// public/pathophysiology.js). One row per presenting complaint (not per
// disease): the big picture, the exam findings that narrow things down, and
// a differential where every candidate condition carries its own mechanism
// right alongside it.
//
// Distinct from clinical_topics (disease-first deep-dives, seed_topics.js)
// and flashcards (compact recall cards) — do not touch either of those
// files or their seed scripts from here.
//
// Multiple agents are contributing different symptom clusters to the same
// PATHOPHYSIOLOGY_TOPICS array in parallel. If you're adding a new cluster,
// APPEND your topic objects to the array below rather than replacing it,
// and keep each cluster's entries grouped together with a comment banner so
// merges stay easy to read.
//
// All framing/exam-findings/DDx/mechanism text is original writing — not
// reproduced or paraphrased from any commercial USMLE prep book or question
// bank.
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

  const { data, error } = await supabase.from('pathophysiology_topics').upsert(rows, { onConflict: 'slug' }).select();
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
