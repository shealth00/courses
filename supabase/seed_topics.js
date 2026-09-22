// supabase/seed_topics.js — populates clinical_topics, the "Clinical Pattern
// Recognition" topic deep-dive engine (see schema_topics.sql / public/topics.js).
// Run with: node supabase/seed_topics.js
//
// Multiple agents are contributing different modules to the same
// CLINICAL_TOPICS array in parallel. If you're adding a new module, APPEND
// your topic objects to the array below rather than replacing it, and keep
// each module's entries grouped together with a comment banner so merges
// stay easy to read.
//
// All vignettes/DDx/explanations are original writing — not reproduced from
// any commercial USMLE prep book or question bank. The seven-section shape
// (hook -> DDx -> diagnostics -> management -> recall check -> vignette ->
// flowchart) is a teaching format, reused across every topic/module.
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

const CLINICAL_TOPICS = [
  // ===========================================================================
  // Module 1 — Biochemistry
  // ===========================================================================
  {
    module_number: 1,
    module_title: "Biochemistry",
    key_submodule: "Nutritional Deficiencies",
    slug: "vitamin-b12-deficiency",
    title: "Vitamin B12 (Cobalamin) Deficiency",
    sort_order: 1,

    hook_vignette:
      "A 68-year-old woman presents with fatigue and a 3-month history of tingling in her feet and difficulty walking in the dark. Exam shows decreased vibration and proprioception in the lower extremities, a positive Romberg sign, and a beefy-red, smooth tongue. She has been a strict vegan for over a decade and reports no dietary supplementation.",

    ddx_mapping:
      "Vitamin B12 (cobalamin) deficiency vs. folate deficiency vs. copper deficiency vs. other mimics of subacute combined degeneration:\n\nB12 deficiency — macrocytic anemia PLUS neurologic findings (subacute combined degeneration: dorsal columns + lateral corticospinal tracts + spinocerebellar tracts), elevated methylmalonic acid AND homocysteine, hypersegmented neutrophils.\n\nFolate deficiency — identical macrocytic anemia and hypersegmented neutrophils, elevated homocysteine, but methylmalonic acid is normal, and no neurologic findings occur — folate deficiency does not cause subacute combined degeneration.\n\nCopper deficiency (e.g., after bariatric surgery or excess zinc ingestion) — can mimic B12 deficiency almost exactly, with myeloneuropathy, macrocytic anemia, and even hypersegmented neutrophils, but methylmalonic acid and homocysteine are normal.\n\nDiabetic peripheral neuropathy — sensory loss but no macrocytosis, no dorsal-column-predominant proprioceptive loss, no glossitis.\n\nVitamin E deficiency — can cause a spinocerebellar-predominant myelopathy, but without anemia, glossitis, or elevated methylmalonic acid.",

    diagnostic_evaluation:
      "Initial: CBC shows macrocytic (MCV >100) anemia; peripheral smear shows oval macrocytes and hypersegmented neutrophils (≥5 lobes). Serum B12 level is low but has limited sensitivity/specificity, so a low-normal result should be confirmed with methylmalonic acid (MMA) and homocysteine — both are elevated in true B12 deficiency, since the conversion of methylmalonyl-CoA to succinyl-CoA requires B12 as a cofactor for methylmalonyl-CoA mutase. Once biochemically confirmed, evaluate the cause: anti-intrinsic factor and anti-parietal cell antibodies for pernicious anemia, dietary review (vegan/strict vegetarian), and assessment for malabsorption (terminal ileal disease, Crohn disease, prior ileal resection, chronic pancreatitis, bacterial overgrowth, or metformin use).",

    management:
      "Replace cobalamin — parenteral (intramuscular) B12 injections are first-line when malabsorption or pernicious anemia is suspected or when neurologic symptoms are present, given daily-to-weekly initially then monthly maintenance; high-dose oral B12 (1000–2000 mcg/day) can be effective even in pernicious anemia because a small fraction is absorbed by passive diffusion independent of intrinsic factor, and is reasonable once the diagnosis is secure and neurologic disease is mild or absent. Reassess response (reticulocytosis within about a week, normalized MCV over 6–8 weeks) and watch for hypokalemia during the first days of treatment from rapid erythropoiesis. Neurologic deficits improve with treatment but may be only partially reversible if longstanding before therapy starts, which is why early recognition matters. Treat the underlying cause when identifiable (lifelong B12 for pernicious anemia or ileal disease; dietary counseling and supplementation for vegans).",

    first_order_prompt:
      "Match this finding to its diagnosis: Elevated methylmalonic acid AND elevated homocysteine, with macrocytic anemia and dorsal column/lateral corticospinal tract signs.",
    first_order_answer:
      "Vitamin B12 (cobalamin) deficiency — subacute combined degeneration.",

    second_order_vignette:
      "A 52-year-old man with a history of Crohn disease and a prior ileocecal resection presents with 6 months of progressive gait unsteadiness and numbness in both feet. He denies dietary restrictions. Neurologic exam reveals impaired vibration and position sense in the toes bilaterally, a wide-based gait, and hyperreflexia at the knees with extensor plantar responses. Complete blood count shows a hemoglobin of 10.2 g/dL with an MCV of 112 fL. Serum B12 is 180 pg/mL (low-normal).",
    second_order_question:
      "Which of the following is the most appropriate next step to confirm the diagnosis?",
    second_order_choices: JSON.stringify([
      {
        "text": "Serum folate level",
        "label": "A",
        "correct": false,
        "explanation": "Folate deficiency doesn't explain isolated dorsal column/corticospinal signs, and replacing folate alone without addressing B12 could mask the anemia while neurologic disease progresses — it isn't the confirmatory test needed here."
      },
      {
        "text": "Serum methylmalonic acid and homocysteine levels",
        "label": "B",
        "correct": true,
        "explanation": "Correct — with a low-normal B12 level but a compatible picture (macrocytic anemia plus subacute combined degeneration, plausible malabsorption from ileal disease/resection), elevated MMA and homocysteine confirm true tissue-level B12 deficiency, since serum B12 alone is an imperfect biomarker."
      },
      {
        "text": "Anti-intrinsic factor antibody only",
        "label": "C",
        "correct": false,
        "explanation": "This identifies pernicious anemia specifically once B12 deficiency is confirmed, but doesn't itself establish that a biochemical deficiency exists — and here the likely cause (ileal resection/Crohn disease) is already apparent, so mechanistic confirmation of deficiency is still needed first."
      },
      {
        "text": "MRI of the cervical spine",
        "label": "D",
        "correct": false,
        "explanation": "MRI may show dorsal column T2 hyperintensity in subacute combined degeneration and can support the diagnosis, but is nonspecific and not how the diagnosis is biochemically confirmed."
      },
      {
        "text": "Schilling test",
        "label": "E",
        "correct": false,
        "explanation": "Historically used to determine the CAUSE of already-established B12 deficiency (malabsorption vs. pernicious anemia), not to confirm that deficiency exists in the first place; it is also now largely obsolete."
      }
    ]),
    second_order_answer: "B",
    second_order_explanation:
      "Serum B12 has poor sensitivity in the low-normal range, so when clinical suspicion is high (macrocytic anemia plus posterior column and corticospinal tract findings, in a patient with a plausible malabsorptive cause), the next step is to confirm true tissue deficiency with methylmalonic acid and homocysteine, both of which rise because B12 is a required cofactor for methylmalonyl-CoA mutase (MMA metabolism) and methionine synthase (homocysteine remethylation). Only after biochemical confirmation should the underlying cause — here, terminal ileal loss of intrinsic factor–B12 receptor sites from Crohn disease/resection — be treated with parenteral B12.",

    flowchart_title: "Working Up Suspected B12 Deficiency",
    flowchart: JSON.stringify([
      {
        "node": "Macrocytic anemia (MCV >100) with or without neuropsychiatric/dorsal column signs",
        "branches": [
          {
            "next": "Confirm with methylmalonic acid + homocysteine",
            "label": "Low serum B12"
          },
          {
            "next": "Suspect folate deficiency instead",
            "label": "Low serum folate, normal B12"
          },
          {
            "next": "Check MMA/homocysteine anyway; consider copper deficiency",
            "label": "Normal B12 and folate but strong clinical suspicion"
          }
        ]
      },
      {
        "node": "Methylmalonic acid (MMA) and homocysteine results",
        "branches": [
          {
            "next": "True B12 deficiency confirmed",
            "label": "Both MMA and homocysteine elevated"
          },
          {
            "next": "Folate deficiency (not B12)",
            "label": "Only homocysteine elevated, MMA normal"
          },
          {
            "next": "Reconsider diagnosis; check serum copper",
            "label": "Both normal despite low-normal B12"
          }
        ]
      },
      {
        "node": "True B12 deficiency confirmed — determine cause",
        "branches": [
          {
            "next": "Pernicious anemia — lifelong parenteral or high-dose oral B12",
            "label": "Positive anti-intrinsic factor / anti-parietal cell antibodies"
          },
          {
            "next": "Malabsorptive B12 deficiency — treat cause + replace B12",
            "label": "History of ileal disease/resection, Crohn, bariatric surgery"
          },
          {
            "next": "Dietary B12 deficiency — oral supplementation",
            "label": "Strict vegan diet, no malabsorption"
          }
        ]
      }
    ]),
  },
  {
    module_number: 1,
    module_title: "Biochemistry",
    key_submodule: "Lysosomal Storage Diseases",
    slug: "gaucher-disease",
    title: "Gaucher Disease",
    sort_order: 2,

    hook_vignette:
      "A 6-year-old boy of Ashkenazi Jewish descent is brought in for easy bruising and fatigue. Exam reveals massive hepatosplenomegaly and mild pallor. Skeletal imaging obtained for chronic bone pain shows a flask-shaped deformity of the distal femur (Erlenmeyer flask deformity). Laboratory testing shows thrombocytopenia and mild anemia.",

    ddx_mapping:
      "Gaucher disease vs. other lysosomal storage diseases presenting with hepatosplenomegaly:\n\nGaucher disease (glucocerebrosidase deficiency, glucocerebroside accumulation) — hepatosplenomegaly, bone crises/Erlenmeyer flask deformity, cytopenias from marrow infiltration and hypersplenism, 'crumpled tissue paper' macrophages (Gaucher cells) on biopsy; the common type 1 (adult) form has NO primary CNS involvement.\n\nNiemann-Pick disease (sphingomyelinase deficiency, sphingomyelin accumulation) — hepatosplenomegaly PLUS progressive neurodegeneration and a cherry-red macula; foam cells (not crumpled-paper macrophages) on biopsy.\n\nTay-Sachs disease (hexosaminidase A deficiency, GM2 ganglioside accumulation) — progressive neurodegeneration, cherry-red macula, exaggerated startle response, but NO hepatosplenomegaly — this distinguishes it from Niemann-Pick despite the shared cherry-red spot.\n\nMucopolysaccharidoses (e.g., Hurler syndrome) — coarse facial features, corneal clouding, organomegaly, and skeletal dysplasia, with urinary glycosaminoglycan accumulation rather than a sphingolipid.\n\nLeukemia/lymphoma — can also present with hepatosplenomegaly and cytopenias in a child, but marrow biopsy shows blasts rather than lipid-laden macrophages.",

    diagnostic_evaluation:
      "Definitive diagnosis is by measuring leukocyte beta-glucocerebrosidase (acid beta-glucosidase) enzyme activity, which is markedly reduced; genetic testing for GBA mutations confirms and can predict phenotype/carrier status, especially given the high carrier frequency in the Ashkenazi Jewish population. Bone marrow biopsy, when done, shows characteristic lipid-laden macrophages with a fibrillary, \"crumpled tissue paper\" cytoplasm (Gaucher cells) — but biopsy is not required when enzyme assay is available and is used mainly to exclude other causes of cytopenia. Supportive labs: markedly elevated serum ferritin, elevated acid phosphatase and ACE (nonspecific markers of macrophage activation), cytopenias on CBC. Skeletal imaging (plain film, or DEXA/MRI for marrow infiltration) may show the Erlenmeyer flask deformity and evidence of avascular necrosis or bone infarcts.",

    management:
      "Enzyme replacement therapy (ERT) with recombinant glucocerebrosidase (e.g., imiglucerase), given as periodic intravenous infusions, is first-line for symptomatic type 1 (non-neuronopathic) disease and reverses organomegaly and cytopenias over months — but it does not cross the blood-brain barrier, so it does not help neuronopathic (type 2/3) forms. Substrate reduction therapy (e.g., miglustat, eliglustat) — oral agents that reduce glucocerebroside production — is an alternative for patients unable to tolerate infusions. Supportive care includes management of bone disease (bisphosphonates, orthopedic monitoring for avascular necrosis); splenectomy is reserved as a last resort for severe hypersplenism given the risk of accelerating bone/lung disease. Genetic counseling given autosomal recessive inheritance and high Ashkenazi Jewish carrier frequency.",

    first_order_prompt:
      "Match this finding to its diagnosis: 'Crumpled tissue paper'-appearing macrophages on bone marrow biopsy in a child with hepatosplenomegaly and bone pain, no CNS involvement.",
    first_order_answer:
      "Gaucher disease (glucocerebrosidase deficiency).",

    second_order_vignette:
      "A 29-year-old woman of Ashkenazi Jewish ancestry presents for evaluation of easy bruising and chronic fatigue. She reports intermittent, severe bone pain in her legs since her teenage years, previously attributed to growing pains. Physical exam reveals a palpable spleen tip 8 cm below the costal margin and hepatomegaly. Labs show hemoglobin 9.8 g/dL, platelets 78,000/mm3, and a markedly elevated serum ferritin. A bone marrow biopsy shows macrophages with a wrinkled, fibrillary cytoplasmic appearance.",
    second_order_question:
      "A deficiency of which of the following enzymes is most likely responsible for this patient's presentation?",
    second_order_choices: JSON.stringify([
      {
        "text": "Sphingomyelinase",
        "label": "A",
        "correct": false,
        "explanation": "Sphingomyelinase deficiency causes Niemann-Pick disease, which typically also produces progressive neurodegeneration and a cherry-red macula, and shows foam cells rather than crumpled-paper macrophages on biopsy."
      },
      {
        "text": "Hexosaminidase A",
        "label": "B",
        "correct": false,
        "explanation": "Hexosaminidase A deficiency causes Tay-Sachs disease, characterized by neurodegeneration and a cherry-red macula WITHOUT hepatosplenomegaly — the opposite organ-involvement pattern from this patient."
      },
      {
        "text": "Glucocerebrosidase",
        "label": "C",
        "correct": true,
        "explanation": "Correct — glucocerebrosidase (acid beta-glucosidase) deficiency causes Gaucher disease, the most common lysosomal storage disease, with glucocerebroside accumulating in macrophages to produce the classic crumpled-paper appearance, hepatosplenomegaly, cytopenias, and chronic bone pain/crises — all present here, with the Ashkenazi Jewish ancestry further raising pretest probability."
      },
      {
        "text": "Alpha-galactosidase A",
        "label": "D",
        "correct": false,
        "explanation": "Deficiency of this enzyme causes Fabry disease, an X-linked disorder presenting with acroparesthesias, angiokeratomas, and progressive renal failure — not this hepatosplenomegaly/bone pain picture."
      },
      {
        "text": "Arylsulfatase A",
        "label": "E",
        "correct": false,
        "explanation": "Deficiency of this enzyme causes metachromatic leukodystrophy, a demyelinating disease presenting with progressive motor and cognitive decline, not organomegaly."
      }
    ]),
    second_order_answer: "C",
    second_order_explanation:
      "This patient's hepatosplenomegaly, cytopenias from marrow infiltration/hypersplenism, chronic bone pain, elevated ferritin, and crumpled-tissue-paper macrophages on marrow biopsy — in a patient of Ashkenazi Jewish descent — is classic for Gaucher disease, caused by autosomal recessive deficiency of glucocerebrosidase and resulting lysosomal accumulation of glucocerebroside within macrophages (Gaucher cells). Unlike Niemann-Pick disease or Tay-Sachs disease, type 1 Gaucher disease (the most common form) spares the central nervous system, which is why cognitive/neurologic symptoms are absent here.",

    flowchart_title: "Hepatosplenomegaly + Cytopenias — Which Storage Disease?",
    flowchart: JSON.stringify([
      {
        "node": "Child or young adult with hepatosplenomegaly and cytopenias",
        "branches": [
          {
            "next": "Suspect Gaucher disease",
            "label": "Bone pain/crises, Erlenmeyer flask deformity, no neurologic findings"
          },
          {
            "next": "Suspect Niemann-Pick disease",
            "label": "Cherry-red macula and progressive neurodegeneration present"
          },
          {
            "next": "Suspect a mucopolysaccharidosis (e.g., Hurler syndrome)",
            "label": "Coarse facies, corneal clouding, skeletal dysplasia"
          }
        ]
      },
      {
        "node": "Suspect Gaucher disease",
        "branches": [
          {
            "next": "Confirm with leukocyte glucocerebrosidase assay",
            "label": "Marrow biopsy: crumpled-paper macrophages, elevated ferritin"
          },
          {
            "next": "Gaucher disease confirmed — type further by neurologic exam",
            "label": "Assay shows markedly reduced enzyme activity"
          }
        ]
      },
      {
        "node": "Type further by neurologic exam",
        "branches": [
          {
            "next": "Type 1 (chronic, non-neuronopathic) — ERT first-line",
            "label": "No CNS involvement"
          },
          {
            "next": "Type 2 (acute neuronopathic) — ERT ineffective for CNS disease, poor prognosis",
            "label": "Acute infantile CNS involvement"
          },
          {
            "next": "Type 3 (chronic neuronopathic)",
            "label": "Subacute CNS involvement, longer survival"
          }
        ]
      }
    ]),
  },
  {
    module_number: 1,
    module_title: "Biochemistry",
    key_submodule: "Peroxisomal Disorders",
    slug: "x-linked-adrenoleukodystrophy",
    title: "X-Linked Adrenoleukodystrophy",
    sort_order: 3,

    hook_vignette:
      "An 8-year-old boy presents with declining school performance, behavioral changes, and progressive clumsiness over the past several months. His mother notes he has also developed increased skin pigmentation, particularly at the knuckles and gum lines, despite no increase in sun exposure. Neurologic exam shows spasticity and impaired vision. MRI of the brain shows symmetric, posterior-predominant white matter demyelination.",

    ddx_mapping:
      "X-linked adrenoleukodystrophy (ALD) vs. its closest peroxisomal and demyelinating mimics:\n\nX-linked ALD (ABCD1 mutation, impaired peroxisomal beta-oxidation of very-long-chain fatty acids/VLCFAs) — onset in childhood/adolescence (boys), progressive white matter demyelination PLUS primary adrenal insufficiency (skin hyperpigmentation, fatigue, hypotension) from VLCFA accumulation in the adrenal cortex; patients are born normally and develop symptoms later — a single peroxisomal transporter defect, not a defect in peroxisome assembly itself.\n\nZellweger syndrome (peroxisome biogenesis disorder, PEX gene mutations) — presents in the NEONATAL period with severe hypotonia, seizures, characteristic craniofacial dysmorphism, hepatomegaly, and early death; reflects failure to form peroxisomes at all, so multiple peroxisomal pathways (not just VLCFA oxidation — also plasmalogen synthesis, for example) are impaired, unlike isolated ALD.\n\nMultiple sclerosis — white matter demyelination at a similar age is rare (MS typically presents in young adults), lacks adrenal insufficiency, and shows dissemination in time and space rather than a steadily progressive course.\n\nMetachromatic leukodystrophy (arylsulfatase A deficiency) — also progressive childhood white matter disease, but no adrenal insufficiency, with prominent peripheral nerve involvement (abnormal nerve conduction studies) rather than adrenal.\n\nIsolated autoimmune Addison disease — can produce isolated hyperpigmentation and adrenal insufficiency, but without the neurodegenerative/white matter component; ALD should be considered in any young male with 'idiopathic' primary adrenal insufficiency.",

    diagnostic_evaluation:
      "First-line biochemical test: plasma very-long-chain fatty acid (VLCFA) levels, markedly elevated (particularly C26:0 and the C24:0/C22:0 and C26:0/C22:0 ratios) from impaired peroxisomal beta-oxidation. Confirm with genetic testing for ABCD1 mutations (X-linked). Because adrenal insufficiency may precede or lag behind neurologic symptoms, check morning cortisol and ACTH stimulation testing in any boy with elevated VLCFAs or suggestive hyperpigmentation. Brain MRI is essential for staging: classic ALD shows symmetric, posterior (parieto-occipital)-predominant white matter demyelination, often with a hyperintense \"leading edge\" of active inflammation on contrast enhancement — MRI findings guide eligibility for hematopoietic stem cell transplant, since transplant is only beneficial early, before extensive demyelination. Newborn screening (available in many US states) now measures VLCFA-related markers to identify ALD before symptoms develop.",

    management:
      "Adrenal insufficiency is treated with lifelong glucocorticoid (and mineralocorticoid, if needed) replacement regardless of neurologic status — this is often the most immediately life-saving intervention and should not be delayed pending neurologic workup. For the cerebral demyelinating form, allogeneic hematopoietic stem cell transplantation (or ex vivo gene therapy with an autologous, lentivirally corrected CD34+ cell product, an approved alternative when a matched donor is unavailable) can halt progression if performed early, while MRI changes are still mild — it does not reverse existing damage, so early detection via newborn screening or surveillance MRI in known carriers/affected relatives is critical. Lorenzo's oil (a mixture of oleic and erucic acid) normalizes plasma VLCFA levels but has not reliably been shown to prevent or slow neurologic progression once boys are symptomatic, so it is not definitive therapy, though it remains used/studied as an adjunct in presymptomatic boys. Regular surveillance MRI in presymptomatic boys with confirmed ABCD1 mutations is key, since transplant timing is the single biggest determinant of neurologic outcome.",

    first_order_prompt:
      "Match this finding to its diagnosis: A boy with progressive behavioral decline, spasticity, posterior-predominant white matter demyelination on MRI, and new skin hyperpigmentation.",
    first_order_answer:
      "X-linked adrenoleukodystrophy (ABCD1 mutation, elevated very-long-chain fatty acids) with adrenal insufficiency.",

    second_order_vignette:
      "A term male infant is noted at birth to have severe hypotonia and poor feeding. Over the first weeks of life, he develops seizures. Exam shows a high forehead, wide-set eyes, and hepatomegaly. He fails to meet any developmental milestones and dies at 7 months of age. Laboratory testing obtained early in the workup showed elevated plasma very-long-chain fatty acids.",
    second_order_question:
      "Which of the following best explains this infant's disease, in contrast to X-linked adrenoleukodystrophy?",
    second_order_choices: JSON.stringify([
      {
        "text": "A mutation in a single peroxisomal beta-oxidation enzyme, sparing peroxisome assembly",
        "label": "A",
        "correct": false,
        "explanation": "This describes the defect in X-linked ALD (ABCD1, a peroxisomal membrane transporter for VLCFA-CoA), not this infant's disease; ALD does not present with this severe neonatal, multi-organ phenotype."
      },
      {
        "text": "A defect in peroxisome biogenesis affecting multiple peroxisomal enzyme functions",
        "label": "B",
        "correct": true,
        "explanation": "Correct — this infant's neonatal-onset hypotonia, seizures, characteristic craniofacial dysmorphism, hepatomegaly, and early death describe Zellweger syndrome, caused by mutations in PEX genes required for peroxisome assembly. Because whole peroxisomes fail to form, ALL peroxisomal functions are impaired (VLCFA beta-oxidation, plasmalogen synthesis, bile acid synthesis), not just one enzyme — explaining the more severe, multisystem neonatal phenotype compared to isolated ALD."
      },
      {
        "text": "An X-linked defect limited to adrenal cortex steroidogenesis",
        "label": "C",
        "correct": false,
        "explanation": "This does not describe either disease's core molecular defect; while ALD does cause adrenal insufficiency, that is a downstream consequence of VLCFA accumulation in the adrenal cortex, not a primary steroidogenic enzyme defect, and it doesn't explain this infant's neonatal multisystem presentation."
      },
      {
        "text": "Autosomal recessive deficiency of galactocerebrosidase",
        "label": "D",
        "correct": false,
        "explanation": "This describes Krabbe disease, a lysosomal (not peroxisomal) storage disease with globoid cells; VLCFAs are not characteristically elevated in Krabbe disease."
      },
      {
        "text": "Autosomal recessive deficiency of arylsulfatase A",
        "label": "E",
        "correct": false,
        "explanation": "This describes metachromatic leukodystrophy, a lysosomal disease with normal VLCFAs, not this infant's peroxisomal biogenesis disorder."
      }
    ]),
    second_order_answer: "B",
    second_order_explanation:
      "This infant's neonatal presentation — severe hypotonia, seizures, characteristic craniofacial features, hepatomegaly, and early death, with elevated VLCFAs — describes Zellweger syndrome, the most severe peroxisome biogenesis disorder. Unlike X-linked ALD, in which a single peroxisomal transporter (ABCD1) is defective and only VLCFA beta-oxidation is impaired (producing a later-onset, more limited phenotype of demyelination plus adrenal insufficiency), Zellweger syndrome results from failure of peroxisomes to assemble at all (PEX gene mutations), so every peroxisomal pathway is lost — a far more severe, multisystem, neonatal-lethal disease.",

    flowchart_title: "Elevated VLCFA in an Infant or Child — ALD vs. Zellweger",
    flowchart: JSON.stringify([
      {
        "node": "Elevated plasma very-long-chain fatty acids (VLCFA)",
        "branches": [
          {
            "next": "Suspect Zellweger syndrome (peroxisome biogenesis disorder)",
            "label": "Neonatal hypotonia, seizures, dysmorphic facies, hepatomegaly"
          },
          {
            "next": "Suspect X-linked adrenoleukodystrophy",
            "label": "School-age/adolescent boy: behavioral decline, spasticity, hyperpigmentation"
          },
          {
            "next": "Presymptomatic ABCD1 carrier — begin MRI surveillance",
            "label": "Asymptomatic boy with an affected relative"
          }
        ]
      },
      {
        "node": "X-linked ALD confirmed by ABCD1 genetic testing — assess adrenal function and brain MRI",
        "branches": [
          {
            "next": "Start lifelong glucocorticoid (+/- mineralocorticoid) replacement",
            "label": "Low cortisol / abnormal ACTH stimulation test"
          },
          {
            "next": "Refer promptly for hematopoietic stem cell transplant or gene therapy",
            "label": "MRI shows early/mild cerebral demyelination"
          },
          {
            "next": "Transplant offers limited benefit — supportive/palliative focus",
            "label": "MRI shows extensive demyelination"
          }
        ]
      }
    ]),
  },
  {
    module_number: 1,
    module_title: "Biochemistry",
    key_submodule: "Dyslipidemias",
    slug: "familial-hypercholesterolemia",
    title: "Familial Hypercholesterolemia",
    sort_order: 4,

    hook_vignette:
      "A 9-year-old boy is brought in after his parents noticed yellowish, raised nodules on his Achilles tendons and around both eyes. His father had a myocardial infarction at age 38. A lipid panel shows a total cholesterol of 410 mg/dL with an LDL of 340 mg/dL; triglycerides are normal.",

    ddx_mapping:
      "Familial hypercholesterolemia vs. other causes of markedly elevated LDL cholesterol:\n\nFamilial hypercholesterolemia (autosomal dominant; most commonly an LDL receptor mutation, also PCSK9 gain-of-function or ApoB defects) — isolated, severe LDL elevation from birth (triglycerides normal), tendon xanthomas (classically Achilles), xanthelasma, corneal arcus (especially before age 45), strong family history of very early atherosclerotic disease/MI; heterozygotes (~1 in 250) present in adulthood, homozygotes (rare) present in childhood with extreme LDL and MI before age 20.\n\nPolygenic/common hypercholesterolemia — modest LDL elevation from the combined small effect of many common variants plus diet, no tendon xanthomas, usually presents later and with less extreme LDL values and a weaker family history pattern.\n\nFamilial combined hyperlipidemia — elevated LDL AND triglycerides (a mixed pattern) with variable phenotype even within the same family, typically without tendon xanthomas.\n\nSecondary hypercholesterolemia (hypothyroidism, nephrotic syndrome, cholestasis, certain medications) — should be excluded with TSH, urinalysis for proteinuria, and a liver panel; still worth checking even when the pattern strongly suggests a genetic cause.\n\nSitosterolemia — also causes tendon xanthomas and premature atherosclerosis, but via a different mechanism (increased intestinal absorption of plant sterols from ABCG5/ABCG8 mutations), distinguished by elevated plasma plant sterols rather than isolated cholesterol elevation.",

    diagnostic_evaluation:
      "Diagnosis is primarily clinical, using validated criteria (e.g., Dutch Lipid Clinic Network criteria) that combine LDL level, tendon xanthomas, corneal arcus before age 45, and family history of premature coronary disease or very high LDL in first-degree relatives. A fasting lipid panel showing markedly elevated LDL with normal triglycerides is the key initial lab finding. Genetic testing (LDLR, APOB, PCSK9) confirms the diagnosis and is useful for cascade screening of relatives, though a substantial fraction of clinically diagnosed cases have no identifiable mutation on panel testing. Rule out secondary causes (TSH, urinalysis, liver function tests) before finalizing the diagnosis. Screen first-degree relatives with a lipid panel once an index case (proband) is identified, since roughly half of first-degree relatives of a heterozygote will also carry the mutation.",

    management:
      "High-intensity statin therapy is first-line in adults; in children/adolescents with FH, statins are typically started around age 8–10 depending on severity and guideline, given the markedly elevated lifetime cardiovascular risk. Ezetimibe is added if LDL goals are not met on maximally tolerated statin. PCSK9 inhibitors (evolocumab, alirocumab — monoclonal antibodies that prevent LDL receptor degradation) or, for severe/refractory cases, bempedoic acid or inclisiran (siRNA against PCSK9) are added for patients not at goal on statin plus ezetimibe, and are essentially required in homozygous FH since LDL-receptor-dependent statin efficacy is blunted when receptor function is severely impaired. Homozygous FH (extremely elevated LDL, MI risk in childhood) often requires LDL apheresis in addition to maximal drug therapy. Aggressive lifestyle modification (diet, exercise, smoking cessation) is adjunctive, not sufficient alone given the genetic, receptor-level defect. Cascade genetic/lipid screening of first-degree relatives is a key population-level management step once a proband is identified.",

    first_order_prompt:
      "Match this finding to its diagnosis: Isolated markedly elevated LDL (normal triglycerides) from birth, Achilles tendon xanthomas, and a father with an MI at age 38.",
    first_order_answer:
      "Familial hypercholesterolemia (typically an LDL receptor mutation).",

    second_order_vignette:
      "A 34-year-old woman presents for a routine physical. She has no symptoms but mentions that her father died suddenly of a heart attack at age 41 and her paternal uncle underwent bypass surgery in his 40s. Exam reveals bilateral yellowish plaques on the upper eyelids and a grayish ring around the periphery of both corneas. A fasting lipid panel shows total cholesterol 380 mg/dL, LDL 295 mg/dL, HDL 48 mg/dL, and triglycerides 110 mg/dL. TSH and urinalysis are normal.",
    second_order_question:
      "Which of the following is the most likely underlying molecular defect?",
    second_order_choices: JSON.stringify([
      {
        "text": "Deficiency of lipoprotein lipase",
        "label": "A",
        "correct": false,
        "explanation": "Lipoprotein lipase deficiency causes markedly elevated triglycerides (chylomicronemia), not the isolated LDL elevation with normal triglycerides seen here."
      },
      {
        "text": "Mutation in the LDL receptor gene",
        "label": "B",
        "correct": true,
        "explanation": "Correct — isolated, severe LDL elevation with normal triglycerides, xanthelasma, corneal arcus before age 45, and a strong family history of premature coronary disease is classic for heterozygous familial hypercholesterolemia, most commonly caused by loss-of-function mutations in the LDL receptor gene, which impair hepatic clearance of LDL particles."
      },
      {
        "text": "Apolipoprotein A-I deficiency",
        "label": "C",
        "correct": false,
        "explanation": "ApoA-I deficiency impairs HDL formation, causing low HDL, not elevated LDL — the opposite lipid abnormality from this patient's pattern."
      },
      {
        "text": "Deficiency of apolipoprotein C-II",
        "label": "D",
        "correct": false,
        "explanation": "ApoC-II deficiency impairs lipoprotein lipase activation, causing severe hypertriglyceridemia (chylomicronemia), not isolated LDL elevation."
      },
      {
        "text": "Mutation causing loss of function of PCSK9",
        "label": "E",
        "correct": false,
        "explanation": "Loss-of-function (not gain-of-function) PCSK9 mutations INCREASE LDL receptor recycling and LOWER LDL — this is actually protective against atherosclerosis, the opposite of this patient's presentation; a gain-of-function PCSK9 mutation would instead cause a hypercholesterolemia phenotype."
      }
    ]),
    second_order_answer: "B",
    second_order_explanation:
      "This patient's isolated, severe LDL elevation with normal triglycerides, xanthelasma, arcus before age 45, and strong family history of premature coronary events is the classic phenotype of heterozygous familial hypercholesterolemia. The most common cause is a loss-of-function mutation in the LDL receptor, which normally mediates hepatic uptake and clearance of circulating LDL particles — when receptor number or function is reduced, LDL clearance falls and plasma LDL rises, driving early atherosclerosis and the physical stigmata of lipid deposition (xanthomas, xanthelasma, arcus).",

    flowchart_title: "Severe Isolated LDL Elevation — Confirming Familial Hypercholesterolemia",
    flowchart: JSON.stringify([
      {
        "node": "Markedly elevated LDL with normal triglycerides on fasting lipid panel",
        "branches": [
          {
            "next": "Suspect familial hypercholesterolemia",
            "label": "Tendon xanthomas, xanthelasma, or arcus before age 45"
          },
          {
            "next": "More likely polygenic hypercholesterolemia",
            "label": "No physical stigmata, weak family history, modest elevation"
          },
          {
            "next": "Consider familial combined hyperlipidemia instead",
            "label": "Elevated triglycerides also present"
          }
        ]
      },
      {
        "node": "Suspect FH — after excluding secondary causes (TSH, urinalysis, liver panel normal), apply Dutch Lipid Clinic Network (or similar) clinical criteria",
        "branches": [
          {
            "next": "Clinical diagnosis of FH — offer LDLR/APOB/PCSK9 genetic testing",
            "label": "Criteria met: LDL severity + xanthomas + premature family MI"
          },
          {
            "next": "Suspect homozygous FH — needs apheresis + maximal drug therapy",
            "label": "Extreme LDL (>400-500) presenting in childhood with early MI"
          }
        ]
      },
      {
        "node": "Diagnosis confirmed (clinical +/- genetic) — initiate treatment",
        "branches": [
          {
            "next": "High-intensity statin; add ezetimibe, then PCSK9 inhibitor as needed; cascade-screen relatives",
            "label": "Heterozygous FH"
          },
          {
            "next": "Statin + ezetimibe + PCSK9 inhibitor plus LDL apheresis",
            "label": "Homozygous FH"
          }
        ]
      }
    ]),
  },
  {
    module_number: 1,
    module_title: "Biochemistry",
    key_submodule: "Hematologic Abnormalities",
    slug: "g6pd-deficiency",
    title: "Glucose-6-Phosphate Dehydrogenase (G6PD) Deficiency",
    sort_order: 5,

    hook_vignette:
      "A 6-year-old boy of Mediterranean descent presents with fatigue, dark urine, and scleral icterus 2 days after starting trimethoprim-sulfamethoxazole for a urinary tract infection. Labs show a hemoglobin drop from baseline, elevated indirect bilirubin, and elevated LDH with low haptoglobin. A peripheral smear shows bite cells and Heinz bodies.",

    ddx_mapping:
      "G6PD deficiency vs. other causes of acute hemolysis after an oxidative trigger:\n\nG6PD deficiency (X-linked, reduced NADPH-regenerating capacity, impaired neutralization of oxidative stress via reduced glutathione) — episodic hemolysis triggered by oxidative stressors (sulfa drugs, dapsone, primaquine/certain antimalarials, fava beans, infection itself); bite cells and Heinz bodies on smear; self-limited because the oldest, most-deficient RBCs are hemolyzed first while younger reticulocytes (relatively higher enzyme activity) survive — an enzyme assay done DURING an acute episode can be falsely normal because the most deficient cells have already been destroyed.\n\nPyruvate kinase deficiency — chronic, not episodic, hemolytic anemia (not triggered by oxidative stressors), autosomal recessive, no bite cells/Heinz bodies; caused by impaired glycolytic ATP production rather than impaired oxidative defense.\n\nHereditary spherocytosis — chronic hemolytic anemia with spherocytes (not bite cells) on smear, positive osmotic fragility test, splenomegaly common, autosomal dominant membrane defect — not triggered by oxidative drugs.\n\nAutoimmune hemolytic anemia — positive direct Coombs (direct antiglobulin) test, spherocytes may be present, not specifically tied to oxidative drug exposure, and can occur at any age without the male-predominant X-linked pattern.\n\nDrug-induced immune hemolysis (non-G6PD mechanism, e.g., certain penicillins) — also drug-associated, but mediated by antibody formation against a drug-hapten on the RBC membrane (Coombs-positive), not by direct oxidative RBC injury (Coombs-negative in G6PD deficiency).",

    diagnostic_evaluation:
      "During an acute hemolytic episode: CBC shows falling hemoglobin, peripheral smear shows bite cells (from splenic macrophages removing Heinz-body-containing membrane) and Heinz bodies (denatured hemoglobin precipitates, best seen with supravital stains like crystal violet), and hemolysis labs show elevated indirect bilirubin, elevated LDH, low haptoglobin, and reticulocytosis. Direct antiglobulin (Coombs) test is negative, distinguishing this from immune-mediated hemolysis. Definitive diagnosis is by measuring G6PD enzyme activity — but this assay is best deferred 2–3 months after an acute episode, since during/immediately after a hemolytic crisis the most severely deficient (oldest) red cells have already been destroyed and the remaining reticulocyte-enriched population can show falsely normal or near-normal activity.",

    management:
      "Acute episodes are usually self-limited once the offending oxidative trigger (drug, infection, fava beans) is identified and removed/treated — most patients do not require transfusion, but severe hemolysis with significant anemia or hemodynamic compromise warrants packed red blood cell transfusion and supportive care (IV fluids, monitoring for acute kidney injury from hemoglobinuria in severe cases). There is no enzyme-replacement or curative therapy; management centers on avoidance — patient education on the list of oxidative triggers to avoid for life (sulfonamides, dapsone, primaquine/certain antimalarials, nitrofurantoin, fava beans, and acute illness/infection itself, which can also precipitate hemolysis via oxidative stress from the immune response). Screen before prescribing known high-risk oxidant drugs in patients from high-prevalence populations (Mediterranean, African, Middle Eastern, and Southeast Asian ancestry) when feasible. Genetic counseling given X-linked inheritance — affected males are hemizygous, and heterozygous female carriers can have intermediate enzyme levels from random X-inactivation (lyonization) and occasionally manifest clinically.",

    first_order_prompt:
      "Match this finding to its diagnosis: Bite cells and Heinz bodies on peripheral smear with acute hemolysis 2 days after starting a sulfa antibiotic.",
    first_order_answer:
      "Glucose-6-phosphate dehydrogenase (G6PD) deficiency.",

    second_order_vignette:
      "A 4-year-old boy is brought to the emergency department with pallor and dark, tea-colored urine that began this morning. His parents report he ate fava beans for the first time at a family dinner two days ago. He appears jaundiced. Labs show hemoglobin 7.1 g/dL (baseline 12.5 g/dL one month ago), indirect bilirubin 4.8 mg/dL, markedly elevated LDH, and undetectable haptoglobin. Direct antiglobulin (Coombs) test is negative. Peripheral smear shows red cells with small, round areas of membrane missing along one edge.",
    second_order_question:
      "Which of the following best explains the mechanism of this patient's hemolysis?",
    second_order_choices: JSON.stringify([
      {
        "text": "Antibody-mediated destruction of red cells sensitized by a drug hapten",
        "label": "A",
        "correct": false,
        "explanation": "This mechanism describes certain drug-induced immune hemolytic anemias, which would show a POSITIVE direct Coombs test; this patient's Coombs test is negative, arguing against an antibody-mediated mechanism."
      },
      {
        "text": "Impaired regeneration of reduced glutathione due to decreased NADPH production",
        "label": "B",
        "correct": true,
        "explanation": "Correct — G6PD deficiency impairs the pentose phosphate pathway's ability to regenerate NADPH, which is required to keep glutathione in its reduced (protective, antioxidant) form. Without adequate reduced glutathione, oxidative stressors like fava bean glycosides cause hemoglobin denaturation (Heinz bodies), which splenic macrophages then \"bite\" out of the red cell membrane, producing the bite cells seen on this patient's smear and a Coombs-negative hemolytic anemia."
      },
      {
        "text": "A structural defect in the red cell membrane cytoskeleton",
        "label": "C",
        "correct": false,
        "explanation": "This describes hereditary spherocytosis, which produces spherocytes (not bite cells) on smear and is not triggered by fava bean ingestion."
      },
      {
        "text": "Deficient red cell ATP production from a glycolytic enzyme defect",
        "label": "D",
        "correct": false,
        "explanation": "This describes pyruvate kinase deficiency, a chronic (not acutely triggered) hemolytic anemia without the oxidative bite-cell morphology seen here."
      },
      {
        "text": "Mechanical shearing of red cells across an abnormal vascular surface",
        "label": "E",
        "correct": false,
        "explanation": "This describes a microangiopathic process (e.g., TTP/HUS/DIC), which would show schistocytes, not bite cells, and is not linked to fava bean exposure."
      }
    ]),
    second_order_answer: "B",
    second_order_explanation:
      "Fava bean ingestion (favism) is a classic oxidative trigger for hemolysis in G6PD deficiency: G6PD deficiency limits NADPH generation via the pentose phosphate pathway, which in turn limits the red cell's ability to regenerate reduced glutathione, the main defense against oxidative damage to hemoglobin. Oxidative stress from fava bean glycosides causes hemoglobin to denature and precipitate as Heinz bodies, and splenic macrophages then remove these precipitates by 'biting' a piece out of the red cell membrane — producing the characteristic bite cells and a Coombs-negative hemolytic anemia.",

    flowchart_title: "Acute Hemolysis After an Oxidative Trigger",
    flowchart: JSON.stringify([
      {
        "node": "Acute drop in hemoglobin with jaundice/dark urine after a drug, infection, or fava bean exposure",
        "branches": [
          {
            "next": "Consider drug-induced immune hemolytic anemia instead",
            "label": "Direct Coombs test positive"
          },
          {
            "next": "Suspect G6PD deficiency",
            "label": "Direct Coombs negative, bite cells/Heinz bodies on smear"
          },
          {
            "next": "Consider a microangiopathic process (TTP/HUS/DIC) instead",
            "label": "Direct Coombs negative, schistocytes (not bite cells) on smear"
          }
        ]
      },
      {
        "node": "Suspect G6PD deficiency",
        "branches": [
          {
            "next": "G6PD enzyme assay may be falsely normal — defer definitive testing",
            "label": "Acute episode, testing done now"
          },
          {
            "next": "Repeat G6PD enzyme assay for definitive diagnosis",
            "label": "2-3 months after the episode"
          }
        ]
      },
      {
        "node": "Manage the acute episode",
        "branches": [
          {
            "next": "Remove/avoid the trigger; supportive care, monitor for resolution",
            "label": "Mild-moderate anemia, hemodynamically stable"
          },
          {
            "next": "Transfuse packed red blood cells + IV fluids; monitor renal function",
            "label": "Severe anemia or hemodynamic compromise"
          }
        ]
      }
    ]),
  },
  {
    module_number: 1,
    module_title: "Biochemistry",
    key_submodule: "Dermatitis",
    slug: "pellagra-niacin-deficiency",
    title: "Pellagra (Niacin/Vitamin B3 Deficiency)",
    sort_order: 6,

    hook_vignette:
      "A 54-year-old man with chronic alcohol use disorder and a poor diet presents with a 2-month history of a painful, symmetric, hyperpigmented rash on his hands, forearms, and neck that worsens with sun exposure. He also reports profuse watery diarrhea and increasing confusion over the past few weeks, per his family.",

    ddx_mapping:
      "Pellagra (niacin/vitamin B3 deficiency, or deficiency of its precursor tryptophan) vs. its closest mimics:\n\nPellagra — the classic triad of dermatitis (symmetric, hyperpigmented, sharply demarcated rash in sun-exposed areas — a 'Casal necklace' around the neck is characteristic), diarrhea, and dementia ('the 3 D's,' with death the 4th D if untreated); risk factors include alcohol use disorder, malnutrition, carcinoid syndrome, and isoniazid therapy (which interferes with vitamin B6-dependent tryptophan-to-niacin conversion).\n\nHartnup disease — an autosomal recessive defect in neutral amino acid (including tryptophan) transport in renal and intestinal epithelium, causing a pellagra-like dermatitis and neurologic symptoms because tryptophan (a niacin precursor) is lost in the urine and malabsorbed; distinguished by neutral aminoaciduria on urine amino acid testing and usually presents in childhood.\n\nCarcinoid syndrome — tryptophan is diverted toward serotonin synthesis by the tumor, leaving less available for niacin synthesis, which can cause a secondary pellagra; distinguished by flushing, wheezing, and elevated urinary 5-HIAA.\n\nZinc deficiency/acrodermatitis enteropathica — also causes a symmetric, acral/periorificial dermatitis, but classically involves perioral, perianal, and periungual skin with more vesiculobullous/erosive lesions, plus alopecia and diarrhea, without the neuropsychiatric dementia component of pellagra; low serum zinc confirms.\n\nPorphyria cutanea tarda — also causes sun-exposed area skin changes, but produces blistering/fragility and hyperpigmentation with elevated urinary/plasma porphyrins, not a niacin-responsive rash, and lacks the diarrhea/dementia triad.",

    diagnostic_evaluation:
      "Pellagra is primarily a clinical diagnosis based on the classic triad (dermatitis, diarrhea, dementia) in a patient with a plausible risk factor (alcohol use disorder, severe malnutrition, isoniazid therapy, carcinoid syndrome, or a diet based heavily on unprocessed corn/maize, which contains niacin in a bound, poorly bioavailable form). Supportive labs include low urinary excretion of niacin metabolites (N1-methylnicotinamide), though this is rarely measured in practice. A therapeutic trial of niacin replacement with rapid clinical improvement is often used as practical confirmation. Evaluate for the underlying cause: nutritional history/alcohol screening, medication review (isoniazid use, and whether pyridoxine/B6 was co-administered), and, if carcinoid syndrome is suspected (flushing, diarrhea, wheezing), urinary 5-HIAA.",

    management:
      "Oral (or, in severe/malabsorptive cases, parenteral) niacin replacement — nicotinamide is often preferred over nicotinic acid to avoid the flushing side effect — produces rapid improvement in the dermatitis, GI symptoms, and neuropsychiatric symptoms, often within days, and is both diagnostic and therapeutic. Address the underlying cause: nutritional rehabilitation and alcohol use disorder treatment, adding pyridoxine (B6) supplementation for patients on isoniazid (B6 is a required cofactor for tryptophan-to-niacin conversion, and isoniazid depletes B6), and treatment of the underlying tumor if carcinoid syndrome is the cause. Because deficiency of one B vitamin often signals broader nutritional deficiency (especially in alcohol use disorder), evaluate for and empirically treat coexisting deficiencies (thiamine, folate, other B vitamins) — thiamine should generally be given before or alongside glucose administration in this population to avoid precipitating Wernicke encephalopathy.",

    first_order_prompt:
      "Match this finding to its diagnosis: Symmetric, hyperpigmented rash in sun-exposed skin plus diarrhea and confusion in a patient with alcohol use disorder.",
    first_order_answer:
      "Pellagra (niacin/vitamin B3 deficiency) — the classic triad of dermatitis, diarrhea, and dementia.",

    second_order_vignette:
      "A 61-year-old woman with a history of carcinoid tumor of the small bowel presents with a 3-month history of episodic facial flushing, wheezing, and watery diarrhea. She has also developed a rough, hyperpigmented, scaly rash on the backs of her hands and around her neck, along with new difficulty concentrating that her husband has noticed. Urinary 5-hydroxyindoleacetic acid (5-HIAA) is markedly elevated.",
    second_order_question:
      "The skin and neuropsychiatric findings in this patient are best explained by which of the following mechanisms?",
    second_order_choices: JSON.stringify([
      {
        "text": "Direct cutaneous and neurologic toxicity from circulating serotonin",
        "label": "A",
        "correct": false,
        "explanation": "Serotonin causes the flushing and GI symptoms of carcinoid syndrome, but it does not directly cause this niacin-deficiency dermatitis/dementia pattern — the mechanism here is indirect, via substrate diversion, not direct serotonin toxicity to skin or brain."
      },
      {
        "text": "Increased shunting of dietary tryptophan toward serotonin synthesis, leaving insufficient tryptophan for niacin synthesis",
        "label": "B",
        "correct": true,
        "explanation": "Correct — carcinoid tumors markedly upregulate conversion of tryptophan to serotonin (and its metabolite 5-HIAA); because a portion of the body's niacin (vitamin B3) is normally synthesized endogenously from dietary tryptophan, this diversion can deplete the tryptophan pool available for niacin synthesis and precipitate a secondary pellagra — with the classic dermatitis and dementia (plus the diarrhea also seen here) resulting from true niacin deficiency, not from serotonin itself."
      },
      {
        "text": "Autoimmune destruction of dermal melanocytes triggered by tumor antigens",
        "label": "C",
        "correct": false,
        "explanation": "This would describe a paraneoplastic vitiligo-like process, which does not fit this symmetric hyperpigmented (not depigmented), sun-exposed-area rash, nor would it explain the diarrhea/cognitive change."
      },
      {
        "text": "Malabsorption of vitamin B12 due to tumor-related bacterial overgrowth",
        "label": "D",
        "correct": false,
        "explanation": "B12 deficiency would cause macrocytic anemia and subacute combined degeneration (posterior column/corticospinal findings), not this dermatitis pattern, and isn't the mechanism linking carcinoid syndrome to pellagra."
      },
      {
        "text": "Zinc chelation by excess circulating serotonin",
        "label": "E",
        "correct": false,
        "explanation": "This is not a recognized mechanism; zinc deficiency causes a different dermatitis pattern (periorificial/acral) and is not linked to serotonin levels in carcinoid syndrome."
      }
    ]),
    second_order_answer: "B",
    second_order_explanation:
      "Carcinoid tumors can cause a secondary (niacin-deficiency) pellagra because a large share of the body's dietary tryptophan can be diverted into the tumor's serotonin-synthesis pathway, depleting the substrate normally available for endogenous niacin synthesis. The resulting true niacin deficiency produces the same dermatitis-diarrhea-dementia triad seen in nutritional pellagra, layered on top of the tumor's own flushing/wheezing/diarrhea from serotonin excess — recognizing this link matters because niacin supplementation, not just tumor-directed therapy, treats the deficiency symptoms.",

    flowchart_title: "Working Up Suspected Pellagra",
    flowchart: JSON.stringify([
      {
        "node": "Symmetric, hyperpigmented rash in sun-exposed skin",
        "branches": [
          {
            "next": "Suspect pellagra (niacin deficiency)",
            "label": "Plus diarrhea and confusion/cognitive decline"
          },
          {
            "next": "Suspect zinc deficiency (acrodermatitis enteropathica) instead",
            "label": "Perioral/perianal/periungual distribution with alopecia"
          },
          {
            "next": "Consider porphyria cutanea tarda instead",
            "label": "Blistering/skin fragility, no diarrhea/dementia"
          }
        ]
      },
      {
        "node": "Suspect pellagra (niacin deficiency)",
        "branches": [
          {
            "next": "Nutritional pellagra",
            "label": "History of alcohol use disorder / severe malnutrition"
          },
          {
            "next": "Isoniazid-induced pellagra (impaired B6-dependent tryptophan-to-niacin conversion)",
            "label": "On isoniazid therapy without B6 supplementation"
          },
          {
            "next": "Secondary pellagra from carcinoid syndrome",
            "label": "Flushing, wheezing, elevated urinary 5-HIAA"
          },
          {
            "next": "Hartnup disease instead",
            "label": "Childhood onset, neutral aminoaciduria on urine testing"
          }
        ]
      },
      {
        "node": "Confirm and treat",
        "branches": [
          {
            "next": "Oral nicotinamide replacement + treat underlying cause; rapid improvement confirms diagnosis",
            "label": "Mild-moderate disease, oral intake tolerated"
          },
          {
            "next": "Parenteral niacin replacement; screen for/treat coexisting thiamine and folate deficiency",
            "label": "Severe disease or malabsorption"
          }
        ]
      }
    ]),
  },
  // ===========================================================================
  // Module 2 — Immunology
  // ===========================================================================
  {
    module_number: 2,
    module_title: 'Immunology',
    key_submodule: 'Primary Immunodeficiencies',
    slug: 'x-linked-agammaglobulinemia',
    title: 'X-Linked Agammaglobulinemia',
    sort_order: 1,

    hook_vignette:
      'A 7-month-old boy is brought to clinic for his fourth episode of otitis media this year, now with a new productive cough and fever. He was born full-term and has been formula-fed since birth. On exam, his tonsils are conspicuously absent and no cervical lymph nodes are palpable despite the current infection. His mother mentions that her brother died of overwhelming sepsis as an infant.',

    ddx_mapping:
      'X-linked agammaglobulinemia (XLA) vs. common variable immunodeficiency (CVID): XLA presents in infancy once maternal IgG wanes (~6 months) with absent B cells; CVID presents later (20s-40s) with B cells present but failing to mature into antibody-secreting plasma cells.\n' +
      'XLA vs. transient hypogammaglobulinemia of infancy: the transient form is self-resolving, B cells are present in normal numbers, and immunoglobulin levels normalize by 2-4 years without treatment.\n' +
      'XLA vs. severe combined immunodeficiency (SCID): SCID involves a T-cell defect in addition to the B-cell defect, presenting earlier (by 3-6 months) with severe viral, fungal, and opportunistic infections plus failure to thrive, not just recurrent bacterial infections.\n' +
      'XLA vs. selective IgA deficiency: only IgA is low in the latter, with IgG and IgM normal; most patients are asymptomatic or have only mild recurrent sinopulmonary/GI infections.',

    diagnostic_evaluation:
      'Flow cytometry showing absent or markedly reduced CD19+/CD20+ B cells with a normal or even elevated proportion of CD3+ T cells.\n' +
      'Quantitative serum immunoglobulins showing profound reduction across all isotypes (IgG, IgA, IgM).\n' +
      'Physical exam correlate: absent or hypoplastic tonsils and peripheral lymph nodes, reflecting the absence of germinal centers.\n' +
      'Genetic testing confirming a mutation in BTK (Bruton tyrosine kinase, Xq22.1), which blocks pre-B-cell maturation into mature B cells.',

    management:
      'Lifelong immunoglobulin replacement therapy (IVIG or subcutaneous immunoglobulin) to provide passive antibody protection.\n' +
      'Prompt, aggressive antibiotic treatment of infections, with a low threshold to treat given the inability to mount a normal antibody response.\n' +
      'Avoidance of live-attenuated vaccines (limited benefit given the inability to seroconvert, and theoretical risk of vaccine-strain infection).\n' +
      'Genetic counseling for the family given X-linked inheritance.',

    first_order_prompt:
      'Which cell-surface marker is absent (or markedly reduced) on flow cytometry in X-linked agammaglobulinemia, confirming a pure B-cell defect?',
    first_order_answer:
      'CD19 (and CD20) — circulating B cells are essentially absent, while CD3+ T cells remain normal in number, since the defect (BTK mutation) selectively blocks B-cell maturation.',

    second_order_vignette:
      'A 9-month-old boy is brought to the emergency department with fever, lethargy, and refusal to bear weight on his right leg. Blood cultures and a joint aspirate both grow Streptococcus pneumoniae. This is his third invasive infection with an encapsulated organism since 5 months of age. On exam, no tonsillar tissue is visible.',
    second_order_question:
      'Which of the following is the most likely underlying defect in this patient?',
    second_order_choices: JSON.stringify([
      {
        label: 'A',
        text: 'Defect in NADPH oxidase impairing neutrophil oxidative burst',
        correct: false,
        explanation:
          'This describes chronic granulomatous disease, which classically presents with recurrent infections and granuloma formation from catalase-positive organisms (S. aureus, Serratia, Aspergillus), not primarily recurrent encapsulated bacterial infections with absent lymphoid tissue.',
      },
      {
        label: 'B',
        text: 'Mutation in BTK (Bruton tyrosine kinase) blocking B-cell maturation',
        correct: true,
        explanation:
          'Correct. A male infant with recurrent infections by encapsulated organisms beginning after maternal antibody wanes, plus absent tonsillar/lymphoid tissue, is classic for X-linked agammaglobulinemia caused by a BTK mutation that arrests B-cell development at the pre-B stage.',
      },
      {
        label: 'C',
        text: 'Microdeletion of chromosome 22q11 impairing thymic development',
        correct: false,
        explanation:
          'This describes DiGeorge syndrome, which presents with hypocalcemia (from parathyroid hypoplasia), conotruncal cardiac defects, and a T-cell deficiency from thymic hypoplasia — not the isolated antibody deficiency pattern described here.',
      },
      {
        label: 'D',
        text: 'Absence of the common gamma chain cytokine receptor subunit',
        correct: false,
        explanation:
          'This causes X-linked SCID, a combined T- and B-cell defect presenting even earlier with severe viral, fungal, and opportunistic infections and failure to thrive, a more severe picture than isolated recurrent bacterial infections.',
      },
      {
        label: 'E',
        text: 'Deficiency of the terminal complement complex (C5-C9)',
        correct: false,
        explanation:
          'Terminal complement deficiencies predispose specifically to recurrent Neisseria infections, not the broader pattern of recurrent encapsulated bacterial infections with absent lymphoid tissue seen here.',
      },
    ]),
    second_order_answer: 'B',
    second_order_explanation:
      'Recurrent infections with encapsulated organisms beginning after maternal IgG wanes (around 5-6 months of age), occurring in a male infant, with absent tonsils and lymph nodes on exam, points to X-linked agammaglobulinemia. A BTK mutation arrests B-cell development at the pre-B-cell stage, so no mature, antibody-producing B cells or plasma cells form, leaving the infant dependent entirely on maternal IgG until it wanes — after which recurrent bacterial infections begin.',

    flowchart_title: 'Working Up Recurrent Infections in an Infant Boy',
    flowchart: JSON.stringify([
      {
        node: 'Recurrent sinopulmonary infections with encapsulated bacteria beginning after ~6 months of age',
        branches: [
          {
            label: 'Absent tonsils/lymph nodes; flow cytometry shows no CD19+ B cells',
            next: 'X-linked agammaglobulinemia (BTK mutation)',
          },
          {
            label: 'B cells present, but low IgG with normal/high IgM',
            next: 'Hyper-IgM syndrome (CD40L defect)',
          },
          {
            label: 'Also severe viral/fungal/opportunistic infections plus failure to thrive',
            next: 'Severe combined immunodeficiency (SCID)',
          },
        ],
      },
      {
        node: 'Confirm with quantitative immunoglobulins',
        branches: [
          {
            label: 'All isotypes (IgG, IgA, IgM) markedly low',
            next: 'Consistent with XLA — proceed to genetic testing',
          },
          {
            label: 'Only IgA low, others normal',
            next: 'Selective IgA deficiency',
          },
        ],
      },
      {
        node: 'Genetic confirmation',
        branches: [
          {
            label: 'BTK mutation on Xq22.1 confirmed',
            next: 'Begin lifelong immunoglobulin replacement; avoid live vaccines',
          },
          {
            label: 'No BTK mutation found despite absent B cells',
            next: 'Consider a rarer autosomal recessive agammaglobulinemia (e.g. mu heavy chain deficiency)',
          },
        ],
      },
    ]),
  },

  {
    module_number: 2,
    module_title: 'Immunology',
    key_submodule: 'Hypersensitivity Reactions',
    slug: 'goodpasture-syndrome-type-ii-hypersensitivity',
    title: 'Goodpasture Syndrome (Type II Hypersensitivity)',
    sort_order: 2,

    hook_vignette:
      'A 24-year-old man presents with hemoptysis and progressive dyspnea over the past week, now accompanied by dark, tea-colored urine. He has no significant past medical history and denies smoking. Vitals show mild hypertension, and lung exam reveals scattered bibasilar crackles.',

    ddx_mapping:
      'Goodpasture syndrome vs. granulomatosis with polyangiitis (GPA): both cause a pulmonary-renal syndrome, but GPA is associated with c-ANCA/anti-PR3 antibodies, upper airway involvement (chronic sinusitis, saddle-nose deformity), and granulomatous inflammation on biopsy, rather than linear anti-GBM deposition.\n' +
      'Goodpasture syndrome vs. microscopic polyangiitis: p-ANCA/anti-MPO positive, pauci-immune (little to no immune deposition) crescentic glomerulonephritis, no granulomas.\n' +
      'Goodpasture syndrome vs. IgA nephropathy/IgA vasculitis: mesangial IgA deposition, often following an upper respiratory infection by days, typically with skin (palpable purpura) and GI involvement in the vasculitis form.\n' +
      'Goodpasture syndrome vs. lupus nephritis: multi-organ autoimmune disease with positive ANA/anti-dsDNA and a "full-house" granular immunofluorescence pattern (IgG, IgA, IgM, C3, C1q), not the linear pattern seen in anti-GBM disease.',

    diagnostic_evaluation:
      'Serum anti-glomerular basement membrane (anti-GBM) antibodies positive — these target the alpha-3 chain of type IV collagen, present in both glomerular and alveolar basement membranes (explaining the combined renal and pulmonary involvement).\n' +
      'Renal biopsy showing crescentic glomerulonephritis with linear IgG (+/- C3) deposition along the glomerular basement membrane on immunofluorescence — the hallmark finding distinguishing this from immune-complex-mediated diseases.\n' +
      'Chest imaging showing diffuse alveolar infiltrates from pulmonary hemorrhage.\n' +
      'Urinalysis showing hematuria, red cell casts, and proteinuria.',

    management:
      'Plasmapheresis to rapidly remove circulating pathogenic anti-GBM antibodies.\n' +
      'High-dose corticosteroids combined with cyclophosphamide (or rituximab in some regimens) to suppress new antibody production.\n' +
      'Supportive respiratory care for pulmonary hemorrhage; dialysis if renal failure develops.\n' +
      'Early initiation of treatment, before oliguric renal failure sets in, is critical to preserving long-term kidney function.',

    first_order_prompt:
      'What type of hypersensitivity reaction is Goodpasture syndrome, and what antigen do the autoantibodies target?',
    first_order_answer:
      'Type II (antibody-mediated, cytotoxic) hypersensitivity — autoantibodies bind the alpha-3 chain of type IV collagen within the basement membranes of the lung alveoli and renal glomeruli, fixing complement and recruiting inflammatory cells that damage both organs.',

    second_order_vignette:
      'A 31-year-old woman presents with a two-week history of progressive fatigue and decreased urine output. Labs reveal a creatinine of 4.8 mg/dL, up from a baseline of 0.9 mg/dL measured three months earlier. She also reports one episode of blood-streaked sputum last week. A renal biopsy is performed.',
    second_order_question:
      'Immunofluorescence microscopy of the renal biopsy in this patient would most likely reveal which of the following patterns?',
    second_order_choices: JSON.stringify([
      {
        label: 'A',
        text: 'Granular ("lumpy-bumpy") deposits of IgG and C3 along the capillary walls',
        correct: false,
        explanation:
          'This granular, "lumpy-bumpy" pattern reflects immune-complex deposition (Type III hypersensitivity), as seen in post-streptococcal glomerulonephritis or membranous nephropathy, not the linear pattern of direct antibody binding to a fixed basement-membrane antigen.',
      },
      {
        label: 'B',
        text: 'Linear deposition of IgG along the glomerular basement membrane',
        correct: true,
        explanation:
          'Correct. A pulmonary-renal syndrome (hemoptysis plus rapidly progressive glomerulonephritis) with linear IgG deposition along the GBM is the defining histologic feature of anti-GBM (Goodpasture) disease, reflecting antibodies binding directly and uniformly to the alpha-3 chain of type IV collagen.',
      },
      {
        label: 'C',
        text: 'Mesangial deposition of IgA',
        correct: false,
        explanation:
          'Mesangial IgA deposition is characteristic of IgA nephropathy, which typically presents with episodic gross or microscopic hematuria following an upper respiratory infection, not this rapidly progressive pulmonary-renal picture.',
      },
      {
        label: 'D',
        text: 'No significant immune deposits, with neutrophilic infiltration of the capillary wall (pauci-immune)',
        correct: false,
        explanation:
          'A pauci-immune pattern (little to no antibody/complement deposition) is characteristic of ANCA-associated vasculitides (GPA, microscopic polyangiitis), which are not primarily driven by anti-GBM antibodies.',
      },
      {
        label: 'E',
        text: 'Subepithelial "spike and dome" deposits of IgG',
        correct: false,
        explanation:
          'This describes membranous nephropathy, an immune-complex-mediated (Type III) disease causing nephrotic-range proteinuria, not a pulmonary-renal syndrome with hemoptysis.',
      },
    ]),
    second_order_answer: 'B',
    second_order_explanation:
      'Hemoptysis together with rapidly progressive renal failure should raise suspicion for a pulmonary-renal syndrome, and the linear IgG pattern on immunofluorescence is specific for anti-GBM (Goodpasture) disease: circulating IgG autoantibodies bind directly and diffusely to a fixed antigen (the alpha-3 chain of type IV collagen) present along both the glomerular and alveolar basement membranes, producing a smooth, continuous ("linear" or "ribbon-like") staining pattern — in contrast to the granular, "lumpy-bumpy" pattern produced when circulating immune complexes deposit at random sites (Type III hypersensitivity).',

    flowchart_title: 'Approach to a Pulmonary-Renal Syndrome',
    flowchart: JSON.stringify([
      {
        node: 'Hemoptysis plus acute kidney injury/hematuria (pulmonary-renal syndrome)',
        branches: [
          {
            label: 'Anti-GBM antibodies positive',
            next: 'Goodpasture syndrome (Type II hypersensitivity)',
          },
          {
            label: 'c-ANCA (anti-PR3) positive, granulomas, upper airway disease',
            next: 'Granulomatosis with polyangiitis',
          },
          {
            label: 'p-ANCA (anti-MPO) positive, no granulomas',
            next: 'Microscopic polyangiitis',
          },
        ],
      },
      {
        node: 'Renal biopsy immunofluorescence pattern',
        branches: [
          {
            label: 'Linear deposition along the basement membrane',
            next: 'Antibody binding directly to a fixed native antigen (Type II) — confirms Goodpasture',
          },
          {
            label: 'Granular ("lumpy-bumpy") deposition',
            next: 'Circulating immune-complex deposition (Type III) — reconsider diagnosis',
          },
        ],
      },
      {
        node: 'Confirmed Goodpasture syndrome — initiate treatment based on timing',
        branches: [
          {
            label: 'Treated before oliguric renal failure develops',
            next: 'Plasmapheresis + high-dose corticosteroids + cyclophosphamide, better chance of renal recovery',
          },
          {
            label: 'Oliguric renal failure already established at presentation',
            next: 'Same regimen started, but renal prognosis is poor; dialysis often still required',
          },
        ],
      },
    ]),
  },

  {
    module_number: 2,
    module_title: 'Immunology',
    key_submodule: 'Blood Transfusion Reactions',
    slug: 'acute-hemolytic-transfusion-reaction',
    title: 'Acute Hemolytic Transfusion Reaction',
    sort_order: 3,

    hook_vignette:
      'Ten minutes into a transfusion of packed red blood cells for symptomatic anemia, a 58-year-old woman becomes acutely anxious and reports flank pain and chills. Her temperature rises from 37.0C to 39.1C, her heart rate climbs to 128/min, and her blood pressure falls to 82/50 mmHg. Urine collected shortly afterward appears dark red.',

    ddx_mapping:
      'Acute hemolytic transfusion reaction vs. febrile non-hemolytic transfusion reaction: the latter causes fever and chills only, without hypotension, flank pain, or true hemolysis — it results from cytokines released by donor leukocytes/platelets during storage, and is mild and self-limited.\n' +
      'Acute hemolytic transfusion reaction vs. anaphylactic transfusion reaction: anaphylaxis occurs within seconds to minutes and presents with urticaria, wheezing, and angioedema, classically in IgA-deficient recipients with anti-IgA antibodies reacting to donor IgA — it is not primarily driven by hemolysis.\n' +
      'Acute hemolytic transfusion reaction vs. transfusion-related acute lung injury (TRALI): TRALI presents with respiratory distress and non-cardiogenic pulmonary edema within 6 hours, caused by donor anti-leukocyte antibodies acting on recipient neutrophils in the pulmonary vasculature, without hemolysis.\n' +
      'Acute hemolytic transfusion reaction vs. transfusion-associated circulatory overload (TACO): TACO presents with dyspnea, hypertension, and signs of volume overload (not hemolysis), more common in elderly patients or those with cardiac/renal disease receiving large volumes rapidly.',

    diagnostic_evaluation:
      'Stop the transfusion immediately and recheck patient and blood unit identification — a clerical ABO-matching error is the most common underlying cause.\n' +
      'Direct antiglobulin (Coombs) test positive, and repeat type-and-crossmatch confirming incompatibility.\n' +
      'Laboratory findings of intravascular hemolysis: hemoglobinemia, hemoglobinuria, decreased haptoglobin, and elevated indirect bilirubin and LDH.\n' +
      'The remaining donor unit and a fresh patient sample should be sent back to the blood bank for reinvestigation of the mismatch.',

    management:
      'Stop the transfusion immediately and keep the IV line open with normal saline.\n' +
      'Aggressive IV fluid resuscitation to maintain adequate urine output and limit hemoglobin-induced acute tubular necrosis.\n' +
      'Monitor closely for disseminated intravascular coagulation and manage hypotension/shock supportively.\n' +
      'Notify the blood bank immediately so the remaining unit can be investigated and future units re-verified.',

    first_order_prompt:
      'What is the underlying immunologic mechanism of an acute hemolytic transfusion reaction due to ABO incompatibility?',
    first_order_answer:
      'Preformed recipient IgM antibodies against donor ABO antigens bind the transfused red cells and fix complement, causing rapid complement-mediated intravascular hemolysis — a Type II hypersensitivity reaction.',

    second_order_vignette:
      'A 45-year-old man undergoing emergency surgery after a motor vehicle collision receives a rapid transfusion of two units of packed red blood cells. Within minutes he develops fever and hypotension, and hemoglobinuria is noted in his Foley catheter bag. Post-transfusion labs show newly elevated LDH and indirect bilirubin, along with a markedly decreased serum haptoglobin.',
    second_order_question:
      'Which of the following is the most common underlying cause of this reaction?',
    second_order_choices: JSON.stringify([
      {
        label: 'A',
        text: 'Anti-IgA antibodies in an IgA-deficient recipient',
        correct: false,
        explanation:
          'This mechanism causes an anaphylactic transfusion reaction — urticaria, wheezing, hypotension within seconds to minutes — not the hemolysis (hemoglobinuria, low haptoglobin, elevated LDH/bilirubin) described here.',
      },
      {
        label: 'B',
        text: 'Clerical error resulting in administration of ABO-incompatible blood',
        correct: true,
        explanation:
          'Correct. The most common cause of acute hemolytic transfusion reaction is a clerical/identification error leading to ABO-incompatible blood being transfused; preformed anti-A/anti-B IgM antibodies then fix complement and rapidly lyse the mismatched donor cells.',
      },
      {
        label: 'C',
        text: 'Donor leukocyte antibodies reacting with recipient pulmonary endothelium',
        correct: false,
        explanation:
          'This describes the mechanism of TRALI, which presents with acute respiratory distress and pulmonary infiltrates, not hemolysis.',
      },
      {
        label: 'D',
        text: 'Excessive transfusion rate causing volume overload in a patient with reduced cardiac reserve',
        correct: false,
        explanation:
          'This describes TACO, which presents with dyspnea, hypertension, and signs of fluid overload rather than laboratory evidence of hemolysis.',
      },
      {
        label: 'E',
        text: 'Cytokines released from donor white blood cells during blood storage',
        correct: false,
        explanation:
          'This describes febrile non-hemolytic transfusion reaction, which causes fever and chills without true hemolysis, hypotension, or hemoglobinuria.',
      },
    ]),
    second_order_answer: 'B',
    second_order_explanation:
      'Acute hemolytic transfusion reaction is most commonly caused by a clerical or patient-identification error resulting in transfusion of ABO-incompatible blood. Preformed recipient anti-A and/or anti-B IgM antibodies bind the mismatched donor red cells and fix complement, producing rapid intravascular hemolysis with fever, flank pain, hypotension, and hemoglobinuria, along with the classic hemolysis labs (low haptoglobin, elevated LDH and indirect bilirubin, positive direct antiglobulin test) and risk of DIC and acute kidney injury if not stopped promptly.',

    flowchart_title: 'Evaluating a Reaction During Blood Transfusion',
    flowchart: JSON.stringify([
      {
        node: 'A reaction occurs during or shortly after starting a blood transfusion',
        branches: [
          {
            label: 'Fever, flank pain, hypotension, hemoglobinuria',
            next: 'Suspect acute hemolytic transfusion reaction — stop transfusion immediately',
          },
          {
            label: 'Fever/chills only, hemodynamically stable',
            next: 'Febrile non-hemolytic transfusion reaction',
          },
          {
            label: 'Urticaria, wheezing, hypotension within seconds to minutes, no fever',
            next: 'Anaphylactic transfusion reaction (consider IgA deficiency)',
          },
          {
            label: 'New respiratory distress during/after transfusion',
            next: 'Distinguish TRALI (new bilateral infiltrates within 6h, no volume overload) from TACO (hypertension, volume-overload signs)',
          },
        ],
      },
      {
        node: 'For suspected acute hemolytic reaction, confirm with labs',
        branches: [
          {
            label: 'Positive direct antiglobulin test, low haptoglobin, high LDH/indirect bilirubin',
            next: 'Confirms intravascular hemolysis',
          },
          {
            label: 'Recheck patient ID and blood unit label',
            next: 'Identifies clerical ABO-mismatch error',
          },
        ],
      },
      {
        node: 'Management of confirmed acute hemolytic transfusion reaction',
        branches: [
          {
            label: 'Hemodynamically stable after stopping transfusion',
            next: 'Aggressive IV fluids to maintain urine output, monitor labs, notify blood bank',
          },
          {
            label: 'Refractory hypotension or evidence of DIC',
            next: 'ICU-level supportive care, treat coagulopathy, vasopressor support as needed',
          },
        ],
      },
    ]),
  },

  {
    module_number: 2,
    module_title: 'Immunology',
    key_submodule: 'Transplant Rejection',
    slug: 'transplant-rejection-classification',
    title: 'Transplant Rejection: Hyperacute, Acute, and Chronic',
    sort_order: 4,

    hook_vignette:
      'A 52-year-old woman receives a deceased-donor kidney transplant. Within minutes of completing the vascular anastomosis and reperfusing the graft, it turns mottled and cyanotic in the surgical field and stops producing urine. A transplant nephrectomy is performed later that same day.',

    ddx_mapping:
      'Hyperacute rejection: occurs within minutes to hours, caused by preformed recipient antibodies (anti-ABO or anti-HLA, from prior transplant, transfusion, or pregnancy) binding donor endothelial antigens, activating complement, and causing widespread microvascular thrombosis; there is no effective treatment once it starts, so prevention via pre-transplant crossmatch is essential.\n' +
      'Acute rejection: occurs weeks to months after transplant, mediated by cellular immunity (recipient CD8+ T cells directly attacking graft cells) and/or antibody-mediated mechanisms (newly formed donor-specific antibodies); presents with rising creatinine or graft dysfunction and is often reversible with increased immunosuppression.\n' +
      'Chronic rejection: occurs over months to years, driven by a mix of humoral and cellular mechanisms leading to progressive graft vascular fibrosis (chronic allograft vasculopathy) and interstitial fibrosis; presents as slowly progressive graft dysfunction and is largely irreversible.\n' +
      'Distinguish all three from graft-versus-host disease, which occurs after bone marrow/stem cell transplant when donor immune cells attack recipient tissue (the reverse direction of solid-organ rejection), and from acute tubular necrosis/delayed graft function, a non-immunologic cause of early graft non-function from ischemia during procurement, lacking the vascular thrombosis and complement deposition of hyperacute rejection.',

    diagnostic_evaluation:
      'Hyperacute rejection: a clinical diagnosis made intraoperatively (graft turns mottled/cyanotic and stops producing urine immediately after reperfusion); biopsy, if performed, shows diffuse microvascular thrombosis, neutrophilic margination, and fibrinoid necrosis of vessel walls.\n' +
      'Acute rejection: allograft biopsy is the gold standard — cellular rejection shows an interstitial lymphocytic infiltrate with tubulitis, while antibody-mediated rejection shows C4d deposition in peritubular capillaries along with circulating donor-specific antibodies; a rising creatinine or falling urine output prompts biopsy.\n' +
      'Chronic rejection: biopsy shows concentric intimal fibrosis of graft vessels (chronic allograft vasculopathy/arteriopathy) plus interstitial fibrosis and tubular atrophy, correlating with a slow, progressive rise in creatinine and new proteinuria over months to years.',

    management:
      'Hyperacute rejection: no effective treatment once it begins; the graft must be removed. Prevention is key, via a pre-transplant crossmatch (testing recipient serum against donor lymphocytes) to detect preformed antibodies before transplantation.\n' +
      'Acute rejection: increased immunosuppression — high-dose corticosteroids for cellular rejection; plasmapheresis, IVIG, and/or anti-CD20 (rituximab) or anti-thymocyte globulin for antibody-mediated rejection. Often reversible if caught early.\n' +
      'Chronic rejection: no proven therapy reverses established fibrosis; management focuses on optimizing baseline immunosuppression and controlling modifiable risk factors (hypertension, dyslipidemia), with eventual re-transplantation often required.',

    first_order_prompt:
      'What is the key immunologic difference between hyperacute and acute transplant rejection?',
    first_order_answer:
      'Hyperacute rejection is caused by preformed recipient antibodies (already present at the time of transplant) that immediately attack donor endothelial antigens and fix complement; acute rejection develops after transplantation as the recipient mounts a fresh cellular (T-cell) and/or antibody response against the graft over subsequent weeks to months.',

    second_order_vignette:
      'A 39-year-old man who received a deceased-donor kidney transplant eight months ago presents for a routine follow-up visit. He feels well, but his creatinine has risen gradually from a post-transplant baseline of 1.1 mg/dL to 2.3 mg/dL over the last four months, and he has developed new-onset proteinuria. He reports taking his tacrolimus and mycophenolate mofetil as prescribed. A graft biopsy is performed.',
    second_order_question:
      'Which histologic finding is most likely on biopsy, and what is the most appropriate next step in management?',
    second_order_choices: JSON.stringify([
      {
        label: 'A',
        text: 'Diffuse microvascular thrombosis with fibrinoid necrosis; graft nephrectomy is indicated',
        correct: false,
        explanation:
          'This is the histology of hyperacute rejection, which occurs within minutes to hours of reperfusion, not gradually over 8 months — the timeline here is inconsistent.',
      },
      {
        label: 'B',
        text: 'Dense interstitial lymphocytic infiltrate with tubulitis; high-dose IV corticosteroids should be started',
        correct: false,
        explanation:
          'This is the histology and treatment of acute cellular rejection. While acute rejection can occur at any point post-transplant, the slow, indolent four-month decline described here — rather than a relatively abrupt rise — is more consistent with chronic rejection.',
      },
      {
        label: 'C',
        text: 'Concentric intimal fibrosis of graft arteries with interstitial fibrosis and tubular atrophy; there is no proven therapy to reverse the process, so optimizing modifiable risk factors is the mainstay',
        correct: true,
        explanation:
          'Correct. A slow, progressive rise in creatinine with new proteinuria many months after transplant, despite therapeutic immunosuppression, is classic for chronic rejection: chronic allograft vasculopathy (concentric intimal fibrosis) plus interstitial fibrosis/tubular atrophy. Unlike acute rejection, this is generally irreversible with current regimens, so management shifts to slowing progression.',
      },
      {
        label: 'D',
        text: 'Normal-appearing graft parenchyma with elevated tacrolimus trough levels; the medication dose should be reduced',
        correct: false,
        explanation:
          'Calcineurin-inhibitor (tacrolimus) nephrotoxicity is a real consideration in a transplant patient with rising creatinine, but it does not explain new proteinuria and progressive decline as well as the classic fibrotic changes of chronic rejection, which is the more specifically testable finding here.',
      },
      {
        label: 'E',
        text: 'Extensive donor T-cell infiltration of recipient skin and gut, consistent with graft-versus-host disease',
        correct: false,
        explanation:
          'Graft-versus-host disease occurs after hematopoietic stem cell/bone marrow transplantation, when donor immune cells attack recipient tissue — the reverse direction of solid-organ (kidney) rejection, and not applicable here.',
      },
    ]),
    second_order_answer: 'C',
    second_order_explanation:
      'A gradual, progressive decline in graft function with new proteinuria occurring months after transplantation, in a patient on therapeutic immunosuppression, is the classic presentation of chronic rejection. Combined humoral and cellular injury over time produces chronic allograft vasculopathy (concentric intimal fibrosis of graft vessels) and interstitial fibrosis with tubular atrophy on biopsy. Unlike acute rejection, chronic rejection does not reliably respond to escalating immunosuppression, so management shifts toward optimizing the baseline regimen and controlling modifiable risk factors such as hypertension and dyslipidemia, with re-transplantation often eventually needed.',

    flowchart_title: 'Classifying Transplant Rejection by Timing and Mechanism',
    flowchart: JSON.stringify([
      {
        node: 'Graft dysfunction after transplantation — assess timing',
        branches: [
          {
            label: 'Minutes to hours after vascular anastomosis',
            next: 'Hyperacute rejection (preformed antibody, complement-mediated thrombosis)',
          },
          {
            label: 'Weeks to months post-transplant',
            next: 'Acute rejection (T-cell and/or antibody-mediated)',
          },
          {
            label: 'Months to years post-transplant, gradual decline',
            next: 'Chronic rejection (vascular + interstitial fibrosis)',
          },
        ],
      },
      {
        node: 'For acute rejection, biopsy pattern',
        branches: [
          {
            label: 'Lymphocytic infiltrate with tubulitis, no C4d',
            next: 'Acute cellular rejection — treat with high-dose corticosteroids',
          },
          {
            label: 'C4d+ in peritubular capillaries, donor-specific antibodies present',
            next: 'Acute antibody-mediated rejection — plasmapheresis/IVIG/rituximab',
          },
        ],
      },
      {
        node: 'For chronic rejection, biopsy pattern',
        branches: [
          {
            label: 'Concentric intimal fibrosis of graft vessels, interstitial fibrosis/tubular atrophy',
            next: 'Chronic allograft vasculopathy — no reversal therapy; optimize risk factors',
          },
          {
            label: 'No significant fibrosis/vasculopathy seen',
            next: 'Reconsider an alternate cause of graft dysfunction (e.g. BK virus nephropathy, recurrent native disease, calcineurin-inhibitor toxicity)',
          },
        ],
      },
      {
        node: 'Prevention strategy',
        branches: [
          {
            label: 'Pre-transplant crossmatch detects preformed antibodies',
            next: 'Prevents hyperacute rejection',
          },
          {
            label: 'Maintenance immunosuppression (calcineurin inhibitor + antimetabolite +/- steroid)',
            next: 'Reduces risk of acute rejection',
          },
        ],
      },
    ]),
  },

  // ===========================================================================
  // Module 4 — Pathology
  // ===========================================================================
  {
    module_number: 4,
    module_title: 'Pathology',
    key_submodule: 'Cellular Adaptations',
    slug: 'barrett-esophagus-metaplasia',
    title: 'Barrett Esophagus: Columnar Metaplasia from Chronic Reflux',
    sort_order: 1,

    hook_vignette:
      'A 54-year-old man with a 15-year history of heartburn after meals, worse when lying down, treated intermittently with over-the-counter antacids, undergoes upper endoscopy for new dysphagia to solids. The endoscopist notes a salmon-colored, tongue-like extension of mucosa above the gastroesophageal junction, replacing the normal pale squamous lining.',

    ddx_mapping:
      'Reflux esophagitis without metaplasia — erythema/erosions on endoscopy, but biopsy shows intact squamous epithelium with no goblet cells.\n' +
      'Eosinophilic esophagitis — younger patient, food impaction history, endoscopic rings/furrows, eosinophil-rich infiltrate rather than metaplastic columnar change.\n' +
      "Esophageal adenocarcinoma — Barrett's most feared complication; distinguished by a mass lesion or invasion through the basement membrane, not simple metaplasia.\n" +
      'Esophageal squamous cell carcinoma — different risk factor profile (smoking, alcohol), typically mid-esophageal, unrelated to Barrett change.\n' +
      'Hiatal hernia — an anatomic finding that promotes reflux and may coexist with Barrett esophagus, but produces no epithelial change on its own.',

    diagnostic_evaluation:
      'Upper endoscopy shows salmon-colored mucosa extending at least 1 cm proximal to the gastroesophageal junction.\n' +
      'Biopsy is required for diagnosis: intestinal-type columnar epithelium with goblet cells (intestinal metaplasia) replacing the normal stratified squamous epithelium.\n' +
      'Alcian blue stain highlights the acidic mucin within goblet cells.\n' +
      'Surveillance biopsies follow a four-quadrant protocol every 1-2 cm to detect dysplasia before progression to adenocarcinoma.',

    management:
      'Long-term proton pump inhibitor therapy to reduce acid-mediated injury and control reflux symptoms.\n' +
      'Surveillance interval depends on dysplasia grade: no dysplasia — endoscopy every 3-5 years; low-grade dysplasia — endoscopic eradication therapy or surveillance every 6-12 months; high-grade dysplasia or intramucosal carcinoma — endoscopic eradication therapy (radiofrequency ablation or endoscopic mucosal resection).\n' +
      'Lifestyle modification: weight loss, head-of-bed elevation, avoiding late meals.\n' +
      'Antireflux surgery (fundoplication) in select patients with refractory symptoms despite medical therapy.',

    first_order_prompt:
      'What type of epithelial change defines Barrett esophagus, and what specific histologic feature confirms it?',
    first_order_answer:
      'Intestinal metaplasia — replacement of the normal stratified squamous epithelium of the distal esophagus with columnar epithelium containing goblet cells.',

    second_order_vignette:
      'A 61-year-old woman with known Barrett esophagus, previously stable on surveillance, returns for her scheduled endoscopy. Biopsies from the Barrett segment now show glands with nuclear stratification, hyperchromasia, and loss of normal architecture, but the changes remain confined above the basement membrane with no invasion into the lamina propria.',
    second_order_question:
      'Which of the following best describes this histologic finding, and what is the most appropriate next step?',
    second_order_choices: JSON.stringify([
      {
        label: 'A',
        text: 'Low-grade dysplasia; continue surveillance endoscopy in 3-5 years',
        correct: false,
        explanation:
          'The description (marked nuclear atypia and architectural distortion confined to the epithelium) is more consistent with high-grade dysplasia, and even true low-grade dysplasia would not be managed with a 3-5 year interval.',
      },
      {
        label: 'B',
        text: 'High-grade dysplasia; endoscopic eradication therapy (radiofrequency ablation or endoscopic resection)',
        correct: true,
        explanation:
          'Marked cytologic atypia and architectural distortion confined above the basement membrane define high-grade dysplasia, which carries a high risk of progression to invasive carcinoma and is treated with endoscopic eradication therapy.',
      },
      {
        label: 'C',
        text: 'Intramucosal adenocarcinoma; esophagectomy is mandatory',
        correct: false,
        explanation:
          'Intramucosal carcinoma requires invasion into the lamina propria; the stem explicitly states no invasion beyond the basement membrane. Even intramucosal carcinoma without high-risk features is generally treated endoscopically, not with upfront esophagectomy.',
      },
      {
        label: 'D',
        text: 'Reflux esophagitis; increase PPI dose and rebiopsy in 8 weeks',
        correct: false,
        explanation:
          'Esophagitis shows acute/chronic inflammation of intact squamous or metaplastic epithelium, not stratified, hyperchromatic glands with architectural distortion.',
      },
      {
        label: 'E',
        text: 'Normal Barrett mucosa; no change in management',
        correct: false,
        explanation:
          'The description clearly shows dysplastic atypia (nuclear stratification, hyperchromasia, architectural loss), not simple, non-dysplastic intestinal metaplasia.',
      },
    ]),
    second_order_answer: 'B',
    second_order_explanation:
      'Dysplasia in Barrett esophagus is graded on a spectrum from indefinite/low-grade to high-grade based on cytologic atypia and architectural distortion, all while confined by the basement membrane (no invasion, which would define carcinoma). High-grade dysplasia carries substantial risk of harboring or progressing to invasive adenocarcinoma, so current guidelines favor endoscopic eradication therapy (radiofrequency ablation or endoscopic mucosal resection) over continued surveillance — and over esophagectomy, which carries higher morbidity for disease that remains endoscopically treatable while confined to the mucosa.',

    flowchart_title: 'Working Up Columnar-Lined Esophagus',
    flowchart: JSON.stringify([
      {
        node: 'Chronic GERD patient undergoes upper endoscopy',
        branches: [
          {
            label: 'Normal pale squamous mucosa',
            next: 'No Barrett esophagus — continue reflux management',
          },
          {
            label: 'Salmon-colored mucosa extending above the GE junction',
            next: 'Biopsy the columnar-appearing segment',
          },
        ],
      },
      {
        node: 'Biopsy of the columnar segment',
        branches: [
          {
            label: 'Columnar epithelium without goblet cells',
            next: 'Cardiac-type metaplasia only — not diagnostic of Barrett',
          },
          {
            label: 'Columnar epithelium with goblet cells (intestinal metaplasia)',
            next: 'Barrett esophagus confirmed — grade for dysplasia',
          },
        ],
      },
      {
        node: 'Dysplasia grading on biopsy',
        branches: [
          {
            label: 'No dysplasia',
            next: 'Surveillance endoscopy every 3-5 years, continue PPI',
          },
          {
            label: 'Low-grade dysplasia',
            next: 'Endoscopic eradication therapy or surveillance every 6-12 months',
          },
          {
            label: 'High-grade dysplasia / intramucosal carcinoma',
            next: 'Endoscopic eradication therapy (RFA/EMR)',
          },
          {
            label: 'Invasion beyond the lamina propria',
            next: 'Invasive adenocarcinoma — oncologic staging and resection',
          },
        ],
      },
    ]),
  },

  {
    module_number: 4,
    module_title: 'Pathology',
    key_submodule: 'Injury and Death',
    slug: 'coagulative-necrosis-renal-infarction',
    title: 'Coagulative Necrosis in Acute Renal Infarction',
    sort_order: 2,

    hook_vignette:
      'A 68-year-old man with atrial fibrillation, subtherapeutic on his anticoagulant, presents with sudden-onset severe left flank pain, nausea, and gross hematuria. He is afebrile, and his abdominal exam is unremarkable aside from left costovertebral angle tenderness. Labs show a markedly elevated LDH out of proportion to other findings.',

    ddx_mapping:
      'Pyelonephritis — fever, pyuria, bacteriuria, and CVA tenderness, but gradual onset over days rather than sudden; imaging shows a striated nephrogram, not a wedge-shaped perfusion defect.\n' +
      'Nephrolithiasis — colicky pain radiating to the groin with hematuria, but noncontrast CT shows a stone rather than a perfusion defect, and LDH is not characteristically elevated.\n' +
      'Renal vein thrombosis — more indolent course, associated with nephrotic syndrome/hypercoagulable states, imaging shows venous rather than arterial occlusion.\n' +
      'Renal cell carcinoma with hemorrhage — subacute presentation, possible palpable flank mass, imaging shows an enhancing mass rather than a non-enhancing wedge-shaped defect.',

    diagnostic_evaluation:
      'Contrast-enhanced CT shows a wedge-shaped, peripherally based, non-enhancing area of renal cortex/medulla with the apex pointing toward the hilum.\n' +
      'Markedly elevated serum LDH is often the most sensitive early lab clue (from ischemic tissue breakdown), with only mild or delayed creatinine rise unless the infarct is bilateral or extensive.\n' +
      'Workup for an embolic source: echocardiogram, rhythm monitoring for atrial fibrillation.\n' +
      "On histology, the infarcted zone shows coagulative necrosis — a pale, firm, wedge-shaped area in which cellular and tissue architecture (glomerular and tubular silhouettes) are preserved for several days despite loss of nuclei, because ischemic acidosis denatures structural proteins along with the cell's own hydrolytic enzymes, delaying proteolytic digestion of the dead tissue.",

    management:
      'Anticoagulation (initially heparin, transitioned to a longer-term agent) to prevent further embolization and treat the underlying source (e.g., rate/rhythm control plus anticoagulation for atrial fibrillation).\n' +
      'Pain control and blood pressure monitoring, given the risk of renin-mediated hypertension from the infarcted segment.\n' +
      'Reperfusion therapy (catheter-directed thrombolysis or thrombectomy) is reserved for bilateral infarction, infarction of a solitary kidney, or very early presentation with a large territory at risk, given the narrow therapeutic window.\n' +
      'Most segmental infarcts heal by fibrosis and cortical scarring rather than functional recovery; supportive monitoring of renal function follows.',

    first_order_prompt:
      'In an infarcted organ like the kidney, why does the basic architecture of dead cells remain visible under the microscope for several days before phagocytic cleanup, instead of dissolving immediately?',
    first_order_answer:
      "Coagulative necrosis: ischemia denatures both structural proteins and the cell's own hydrolytic enzymes, so proteolysis is delayed and the ghost outlines of cells and tissue architecture persist until inflammatory cells arrive to digest the debris.",

    second_order_vignette:
      'A 45-year-old woman with a history of infective endocarditis one week ago (now on antibiotics) develops abrupt severe left upper quadrant pain radiating to the left shoulder, along with low-grade fever. On exam she has left upper quadrant tenderness without rebound. CT abdomen shows a wedge-shaped, peripherally based hypoattenuating area in the spleen with an intact capsule.',
    second_order_question:
      'The area of splenic tissue seen on this CT scan is undergoing which pattern of necrosis, and what underlying process most likely produced it?',
    second_order_choices: JSON.stringify([
      {
        label: 'A',
        text: 'Liquefactive necrosis from a bacterial abscess',
        correct: false,
        explanation:
          'Liquefactive necrosis produces a soft, pus-filled cavity from enzymatic digestion (classic for bacterial infection or brain infarcts), not the firm wedge-shaped defect described, and no discrete abscess cavity is described.',
      },
      {
        label: 'B',
        text: 'Caseous necrosis from disseminated tuberculosis',
        correct: false,
        explanation:
          'Caseous necrosis produces a friable, cheese-like center within a granulomatous inflammatory reaction, classically from TB — not an acute wedge-shaped infarct in the setting of recent endocarditis.',
      },
      {
        label: 'C',
        text: 'Fat necrosis from acute pancreatitis',
        correct: false,
        explanation:
          'Fat necrosis occurs in adipose tissue (peripancreatic fat, breast) via lipase-mediated saponification and is unrelated to splenic parenchymal infarction.',
      },
      {
        label: 'D',
        text: 'Coagulative necrosis from septic embolization to the spleen',
        correct: true,
        explanation:
          'A vegetation-derived embolus lodging in the splenic artery produces a wedge-shaped ischemic infarct; the spleen, like the kidney and heart, undergoes coagulative rather than liquefactive necrosis regardless of the septic origin of the embolus.',
      },
      {
        label: 'E',
        text: 'Fibrinoid necrosis from an immune complex vasculitis',
        correct: false,
        explanation:
          'Fibrinoid necrosis is a vascular wall lesion with bright pink fibrin-like deposits, seen in vasculitis or malignant hypertension — not a wedge-shaped end-organ infarct.',
      },
    ]),
    second_order_answer: 'D',
    second_order_explanation:
      'Septic emboli from endocarditis vegetations lodge in end-arterial organs (spleen, kidney, brain) and cause wedge-shaped infarcts. Because the spleen, kidney, and heart have single end-arterial supply and comparatively low intrinsic enzyme content, they undergo coagulative necrosis even when the inciting embolus was septic — this contrasts with the brain, which undergoes liquefactive necrosis after infarction regardless of cause, due to its high lipid content and enzyme-rich glial response.',

    flowchart_title: 'Necrosis Pattern by Tissue and Insult',
    flowchart: JSON.stringify([
      {
        node: 'Sudden loss of blood supply to a solid organ (kidney, spleen, heart, or GI tissue outside the brain)',
        branches: [
          {
            label: 'Arterial occlusion (embolic or thrombotic)',
            next: 'Ischemic infarct — coagulative necrosis, architecture preserved',
          },
          {
            label: 'Occlusion within CNS tissue',
            next: 'Liquefactive necrosis (high lipid content, enzymatic autolysis)',
          },
        ],
      },
      {
        node: 'Coagulative necrosis confirmed (wedge-shaped, pale, firm)',
        branches: [
          {
            label: 'Source = cardiac mural thrombus or valvular vegetation',
            next: 'Embolic infarct — anticoagulate, treat the source',
          },
          {
            label: 'Source = local arterial thrombosis (e.g., ruptured atherosclerotic plaque)',
            next: 'Thrombotic infarct — manage underlying vascular disease',
          },
        ],
      },
      {
        node: 'Healing phase over days to weeks',
        branches: [
          {
            label: 'Small/segmental infarct',
            next: 'Organization and fibrous scar formation',
          },
          {
            label: 'Large infarct in a critical organ',
            next: 'Risk of organ dysfunction — consider revascularization if within window',
          },
        ],
      },
    ]),
  },

  {
    module_number: 4,
    module_title: 'Pathology',
    key_submodule: 'Inflammation',
    slug: 'acute-appendicitis-inflammation-cascade',
    title: 'Acute Appendicitis: The Neutrophilic Acute Inflammatory Response',
    sort_order: 3,

    hook_vignette:
      "A 19-year-old man presents with periumbilical pain that migrated to the right lower quadrant over 12 hours, now associated with anorexia, low-grade fever, and nausea. On exam he has focal tenderness and guarding at McBurney's point, with pain on passive extension of the right hip.",

    ddx_mapping:
      'Mesenteric lymphadenitis — often follows a viral URI, diffuse rather than focal tenderness, self-limited, common in children.\n' +
      'Ovarian torsion or ruptured ovarian cyst — female patient, sudden severe pain, distinguished by pelvic exam and ultrasound.\n' +
      'Ectopic pregnancy — must always be excluded with beta-hCG in a woman of reproductive age presenting with RLQ pain.\n' +
      'Meckel diverticulitis — can mimic appendicitis exactly; often only distinguished at surgery or on a nuclear (Meckel) scan.\n' +
      'Right-sided diverticulitis or Crohn disease — more insidious course, may have preceding GI symptoms, different distribution of inflammation on imaging.',

    diagnostic_evaluation:
      'Elevated WBC count with neutrophilic predominance reflects the acute inflammatory response.\n' +
      'CT abdomen/pelvis (or ultrasound, preferred first-line in children and pregnant patients) shows a dilated, non-compressible appendix greater than 6 mm with wall thickening and periappendiceal fat stranding.\n' +
      'On histology after appendectomy, neutrophilic infiltration of the muscularis propria is the defining diagnostic criterion (mucosal neutrophils alone are insufficient, since some are normally present in the lamina propria).\n' +
      'This reflects the classic acute inflammatory cascade: luminal obstruction (often by a fecalith) triggers local mediator release (histamine, prostaglandins, leukotriene B4 as a neutrophil chemoattractant), causing vasodilation and increased vascular permeability, followed by neutrophil margination, selectin-mediated rolling, integrin-mediated firm adhesion, transmigration, and chemotaxis into the tissue.',

    management:
      'Prompt surgical appendectomy (laparoscopic preferred) remains first-line for most patients, with perioperative broad-spectrum antibiotics covering gram-negative rods and anaerobes.\n' +
      'In select uncomplicated cases without a fecalith, antibiotics-first (non-operative) management is an accepted alternative, with a meaningful recurrence rate discussed with the patient.\n' +
      'A well-formed periappendiceal abscess is typically managed with percutaneous drainage and antibiotics first, followed by interval appendectomy weeks later, since immediate surgery in a densely inflamed field carries higher complication risk.\n' +
      'Untreated appendicitis risks perforation, peritonitis, and abscess formation.',

    first_order_prompt:
      'What is the sequence of events, from mediator release to tissue infiltration, that brings neutrophils into an acutely inflamed appendix?',
    first_order_answer:
      'Vasodilation and increased vascular permeability (histamine, prostaglandins) leading to neutrophil margination along the vessel wall, selectin-mediated rolling, integrin-mediated firm adhesion, transmigration through the endothelium, and chemotaxis along a gradient (e.g., leukotriene B4, bacterial products, complement C5a) into the inflamed tissue.',

    second_order_vignette:
      'A 7-year-old boy is brought to the emergency department with two days of fever and diffuse abdominal pain following a recent upper respiratory infection. Exam shows mild, poorly localized abdominal tenderness without rebound or guarding. Ultrasound shows a normal-caliber appendix but multiple enlarged mesenteric lymph nodes.',
    second_order_question:
      "Which of the following best explains this child's presentation?",
    second_order_choices: JSON.stringify([
      {
        label: 'A',
        text: 'Mesenteric lymphadenitis following a recent viral infection',
        correct: true,
        explanation:
          'A common appendicitis mimic in children, typically following a viral URI, with reactive enlargement of mesenteric lymph nodes on ultrasound while the appendix itself remains normal.',
      },
      {
        label: 'B',
        text: 'Acute appendicitis with atypical presentation',
        correct: false,
        explanation:
          'Ultrasound explicitly shows a normal-caliber appendix, arguing against appendicitis as the driver of this presentation.',
      },
      {
        label: 'C',
        text: 'Meckel diverticulitis',
        correct: false,
        explanation:
          'Would also show a normal appendix, but classically presents with painless lower GI bleeding or a focally inflamed diverticulum on imaging, not enlarged mesenteric nodes following a preceding viral illness.',
      },
      {
        label: 'D',
        text: 'Crohn disease flare',
        correct: false,
        explanation:
          'Crohn disease typically has a more chronic course with weight loss and diarrhea over weeks to months, not an acute two-day illness following a URI.',
      },
      {
        label: 'E',
        text: 'Yersinia enterocolitica ileitis',
        correct: false,
        explanation:
          'Can also mimic appendicitis with mesenteric adenitis, but no exposure history (undercooked pork, unpasteurized milk) is given here to favor it over the far more common self-limited viral-associated lymphadenitis in a child after a URI.',
      },
    ]),
    second_order_answer: 'A',
    second_order_explanation:
      'Mesenteric lymphadenitis is one of the most common appendicitis mimics in children, often following a viral upper respiratory infection, with reactive enlargement of mesenteric lymph nodes visible on ultrasound while the appendix itself remains normal in caliber. It is self-limited and managed supportively, in contrast to appendicitis, which requires surgical or antibiotic-first management.',

    flowchart_title: 'RLQ Pain Diagnostic Pathway',
    flowchart: JSON.stringify([
      {
        node: 'Patient with right lower quadrant pain',
        branches: [
          {
            label: 'Female of reproductive age',
            next: 'Obtain beta-hCG first to exclude ectopic pregnancy',
          },
          {
            label: 'Male, or beta-hCG negative',
            next: 'Proceed to imaging',
          },
        ],
      },
      {
        node: 'Imaging (ultrasound or CT)',
        branches: [
          {
            label: 'Dilated, non-compressible appendix >6mm with fat stranding',
            next: 'Acute appendicitis — surgical/antibiotic management',
          },
          {
            label: 'Normal appendix, enlarged mesenteric nodes, recent viral illness',
            next: 'Mesenteric lymphadenitis — supportive care',
          },
          {
            label: 'Adnexal mass or free fluid in a female patient',
            next: 'Evaluate for ovarian torsion or ruptured cyst',
          },
        ],
      },
      {
        node: 'If appendicitis is confirmed',
        branches: [
          {
            label: 'Uncomplicated, no fecalith',
            next: 'Appendectomy or antibiotics-first per shared decision-making',
          },
          {
            label: 'Perforated with abscess',
            next: 'Percutaneous drainage plus antibiotics, interval appendectomy later',
          },
        ],
      },
    ]),
  },

  {
    module_number: 4,
    module_title: 'Pathology',
    key_submodule: 'Wound Healing',
    slug: 'keloid-formation-wound-healing',
    title: 'Keloid Formation: Excess Collagen Beyond the Wound Margin',
    sort_order: 4,

    hook_vignette:
      'An 18-year-old woman of West African descent returns to clinic eight months after ear piercing, reporting a firm, raised, itchy nodule at the piercing site that has continued to grow beyond the original wound margins and now extends onto adjacent normal skin.',

    ddx_mapping:
      'Hypertrophic scar — raised and firm as well, but stays confined within the original wound boundary and tends to partially regress over 12-18 months, without the strong genetic/ethnic predisposition seen with keloids.\n' +
      "Dermatofibroma — a firm papule not tied to a preceding wound, dimples inward with lateral compression (the 'dimple sign') rather than growing outward beyond a scar.\n" +
      'Foreign body granuloma — history of retained suture or piercing material, granulomatous inflammation on biopsy rather than dense whorled collagen.\n' +
      'Dermatofibrosarcoma protuberans (and other cutaneous sarcomas) — progressively enlarging, infiltrative mass not linked to a discrete wound; biopsy needed to exclude in an atypical or rapidly growing lesion.',

    diagnostic_evaluation:
      'Primarily a clinical diagnosis: a raised, firm, often pruritic or tender nodule/plaque extending beyond the original wound margins that does not regress over time.\n' +
      'Biopsy, reserved for atypical presentations, shows thick, haphazardly arranged, hyalinized (glassy pink) collagen bundles in the dermis, in contrast to the more parallel, organized collagen bundles of a hypertrophic scar.\n' +
      'Keloids result from excessive type III (and later type I) collagen deposition from a relative imbalance favoring fibroblast collagen synthesis over collagenase-mediated remodeling during the proliferative and remodeling phases of wound healing.\n' +
      'Risk factors include darker skin pigmentation, family history, and wound location (ears, shoulders, upper chest, and jawline are especially prone).',

    management:
      'Intralesional corticosteroid injections (e.g., triamcinolone) are first-line, reducing fibroblast collagen synthesis and inflammation.\n' +
      'Other options include silicone gel sheeting, pressure therapy, cryotherapy, and laser treatment.\n' +
      'Surgical excision alone carries a high recurrence rate, often exceeding that of the original lesion, because the same fibroproliferative tendency reasserts itself; excision is generally combined with adjuvant intralesional steroids or radiotherapy to reduce recurrence.\n' +
      'Patients should be counseled that keloids can recur even with optimal treatment; prevention (avoiding elective piercings/procedures in high-risk patients, using prophylactic silicone sheeting/pressure on new wounds in those with a prior keloid) is emphasized.',

    first_order_prompt:
      'What distinguishes a keloid from a hypertrophic scar in terms of both growth pattern and the underlying collagen abnormality?',
    first_order_answer:
      'A keloid grows beyond the original wound margins and does not regress, with disorganized, hyalinized collagen bundles, while a hypertrophic scar stays confined within the wound margins and tends to regress over time, with more organized, parallel collagen bundles.',

    second_order_vignette:
      'A 34-year-old man underwent emergency abdominal surgery six weeks ago. He now notes a raised, pink, firm scar along the incision line that is limited strictly to the width of the original surgical incision and has started to flatten slightly on its own over the past two weeks.',
    second_order_question:
      "Which of the following best characterizes this patient's scar and its expected course?",
    second_order_choices: JSON.stringify([
      {
        label: 'A',
        text: 'Keloid formation, requiring intralesional steroid injection',
        correct: false,
        explanation:
          'The scar is confined to the original incision and is already beginning to regress spontaneously, which is not typical keloid behavior.',
      },
      {
        label: 'B',
        text: 'Wound dehiscence, requiring surgical revision',
        correct: false,
        explanation:
          "Dehiscence refers to separation of a healing wound's edges, not a raised firm scar; nothing in the vignette suggests wound separation.",
      },
      {
        label: 'C',
        text: 'Atrophic scar from collagen deficiency',
        correct: false,
        explanation:
          'Atrophic scars are depressed/sunken (e.g., acne scarring) from collagen loss — the opposite of this raised, firm scar.',
      },
      {
        label: 'D',
        text: 'Normal healing by primary intention with no distinct scar abnormality',
        correct: false,
        explanation:
          'A raised, firm scar is not simply flat, unremarkable healing, even though it is a benign and self-limited process; it specifically describes a hypertrophic scar pattern.',
      },
      {
        label: 'E',
        text: 'Hypertrophic scar, likely to partially regress over the following months without specific intervention',
        correct: true,
        explanation:
          'Confinement to the original wound margins plus early spontaneous regression are the defining features of a hypertrophic scar, generally managed conservatively.',
      },
    ]),
    second_order_answer: 'E',
    second_order_explanation:
      'Hypertrophic scars remain confined to the original wound margin and characteristically show partial spontaneous regression over 12-18 months, so they are generally observed or treated conservatively (silicone sheeting, pressure) rather than with the aggressive intralesional therapy reserved for keloids, which extend beyond the wound and do not regress on their own.',

    flowchart_title: 'Raised Scar Evaluation',
    flowchart: JSON.stringify([
      {
        node: 'New raised, firm tissue at a healed wound site',
        branches: [
          {
            label: 'Confined to original wound margins, may regress over time',
            next: 'Hypertrophic scar',
          },
          {
            label: 'Extends beyond original wound margins, does not regress',
            next: 'Keloid',
          },
        ],
      },
      {
        node: 'Keloid confirmed',
        branches: [
          {
            label: 'First presentation',
            next: 'Intralesional corticosteroid injection, silicone sheeting',
          },
          {
            label: 'Recurrent after excision alone',
            next: 'Excision plus adjuvant intralesional steroid or radiotherapy',
          },
        ],
      },
      {
        node: 'High-risk patient (prior keloid, darker skin pigmentation, high-risk site)',
        branches: [
          {
            label: 'Planning an elective procedure/piercing',
            next: 'Counsel on risk, consider prophylactic silicone/pressure therapy',
          },
        ],
      },
    ]),
  },

  {
    module_number: 4,
    module_title: 'Pathology',
    key_submodule: 'Intracellular Accumulations',
    slug: 'alpha1-antitrypsin-deficiency-accumulation',
    title: 'Alpha-1 Antitrypsin Deficiency: Misfolded Protein Accumulation in Hepatocytes',
    sort_order: 5,

    hook_vignette:
      'A 44-year-old lifelong nonsmoker presents with progressive dyspnea and is found to have panacinar emphysema predominantly affecting the lung bases on CT — an unusual distribution and an unusually young age for emphysema. His history also includes cirrhosis diagnosed a decade earlier without an identified cause at the time.',

    ddx_mapping:
      'Smoking-related COPD/emphysema — centriacinar, upper-lobe predominant, older patient with a significant smoking history; the distribution and age here are reversed.\n' +
      'Wilson disease — also causes liver disease at a young age, but distinguished by low ceruloplasmin, elevated urinary copper, Kayser-Fleischer rings, and neuropsychiatric symptoms, with no pulmonary component.\n' +
      'Hereditary hemochromatosis — also causes early cirrhosis, but with skin bronzing, diabetes, and elevated ferritin/transferrin saturation, and no emphysema.\n' +
      'Autoimmune hepatitis — elevated autoantibodies, interface hepatitis on biopsy, no pulmonary findings.',

    diagnostic_evaluation:
      'Serum alpha-1 antitrypsin level is low; PI (protease inhibitor) genotyping identifies the specific allele combination, with the PiZZ genotype causing the most severe disease.\n' +
      'Liver biopsy shows PAS-positive, diastase-resistant eosinophilic globules within the endoplasmic reticulum of periportal hepatocytes, representing misfolded mutant AAT protein (the Z allele produces a protein that polymerizes and cannot be properly secreted) accumulating intracellularly instead of being exported into serum.\n' +
      'This single mechanism explains both organs: liver damage from toxic intracellular accumulation, and lung damage from a lack of circulating AAT to inhibit neutrophil elastase, allowing unchecked proteolytic destruction of alveolar walls.\n' +
      'Pulmonary function tests show an obstructive pattern with reduced DLCO; chest CT shows panacinar emphysema with basilar predominance, as opposed to the apical predominance of smoking-related emphysema.',

    management:
      'Smoking cessation counseling and avoidance is critical, since smoking dramatically accelerates emphysema in these patients.\n' +
      'Intravenous augmentation therapy with pooled human AAT protein can slow the decline in lung function in appropriate candidates with demonstrated airflow obstruction.\n' +
      'Standard COPD management (bronchodilators, pulmonary rehabilitation, vaccination) as adjuncts; lung transplantation for end-stage pulmonary disease.\n' +
      "Liver disease is managed supportively — augmentation therapy does not help the liver, since the hepatic problem is intracellular accumulation of the toxic misfolded protein, not a lack of circulating protein — with liver transplantation curative for the liver disease and also normalizing serum AAT level, since the transplanted liver produces the normal genotype's protein.",

    first_order_prompt:
      'Why does alpha-1 antitrypsin deficiency damage the liver and lungs through two completely different mechanisms?',
    first_order_answer:
      'The mutant Z-allele protein misfolds, polymerizes, and accumulates intracellularly in the hepatocyte endoplasmic reticulum, causing direct hepatocyte injury and cirrhosis (a toxic gain-of-function/accumulation mechanism); because the misfolded protein cannot be secreted, serum AAT levels are low, leaving neutrophil elastase in the lung unopposed to progressively destroy alveolar walls (a loss-of-function mechanism) and cause panacinar emphysema.',

    second_order_vignette:
      'A 2-month-old infant presents with jaundice, pale stools, and dark urine. Liver biopsy reveals PAS-positive, diastase-resistant globules within periportal hepatocytes, and genetic testing confirms a PiZZ genotype.',
    second_order_question:
      "This infant's globules are composed primarily of which of the following?",
    second_order_choices: JSON.stringify([
      {
        label: 'A',
        text: 'Glycogen accumulated due to a glycogen storage disease',
        correct: false,
        explanation:
          'Glycogen stains PAS-positive but is diastase-labile (digested by diastase pretreatment), unlike the diastase-resistant globules described here.',
      },
      {
        label: 'B',
        text: 'Accumulated unconjugated bilirubin within hepatocytes',
        correct: false,
        explanation:
          'Bilirubin accumulation does not form PAS-positive, diastase-resistant globules and produces a different histologic and clinical picture.',
      },
      {
        label: 'C',
        text: 'Misfolded alpha-1 antitrypsin protein retained in the endoplasmic reticulum',
        correct: true,
        explanation:
          'The PiZZ genotype produces mutant AAT protein that misfolds, polymerizes, and cannot be secreted, accumulating as PAS-positive, diastase-resistant globules in periportal hepatocytes — a classic cause of neonatal cholestasis.',
      },
      {
        label: 'D',
        text: 'Copper deposited due to defective biliary excretion',
        correct: false,
        explanation:
          'Describes Wilson disease, which is exceedingly rare in infancy (it classically presents later in childhood/adolescence); copper is demonstrated with rhodanine stain, not PAS.',
      },
      {
        label: 'E',
        text: 'Amyloid protein deposition in the hepatic parenchyma',
        correct: false,
        explanation:
          'Amyloid is demonstrated with Congo red and apple-green birefringence under polarized light, not PAS-diastase, and hepatic amyloidosis is not a neonatal presentation.',
      },
    ]),
    second_order_answer: 'C',
    second_order_explanation:
      "In neonates, alpha-1 antitrypsin deficiency (PiZZ genotype) is an important cause of a neonatal cholestasis/'neonatal hepatitis' picture. PAS-positive, diastase-resistant globules in periportal hepatocytes are the pathognomonic histologic clue distinguishing it from other causes of neonatal cholestasis — the diastase pretreatment step is key, since it excludes glycogen (diastase-labile) as the cause of the PAS positivity.",

    flowchart_title: 'PAS-Positive Hepatocyte Globules Workup',
    flowchart: JSON.stringify([
      {
        node: 'Liver biopsy shows PAS-positive globules in hepatocytes',
        branches: [
          {
            label: 'Diastase-labile (digested by diastase)',
            next: 'Glycogen — consider a glycogen storage disease',
          },
          {
            label: 'Diastase-resistant (persists after diastase)',
            next: 'Alpha-1 antitrypsin deficiency — confirm with serum AAT level and PI genotyping',
          },
        ],
      },
      {
        node: 'AAT deficiency confirmed',
        branches: [
          {
            label: 'PiZZ genotype, pulmonary symptoms present',
            next: 'Evaluate for panacinar, basilar-predominant emphysema; consider augmentation therapy',
          },
          {
            label: 'Hepatic disease predominates (cirrhosis, neonatal cholestasis)',
            next: 'Supportive management; liver transplant is curative if end-stage',
          },
        ],
      },
      {
        node: 'Counsel patient/family',
        branches: [
          {
            label: 'Any smoking history/exposure',
            next: 'Strongly counsel cessation/avoidance — dramatically accelerates lung disease',
          },
          {
            label: 'Family planning',
            next: 'Offer genetic counseling given autosomal codominant inheritance',
          },
        ],
      },
    ]),
  },

  {
    module_number: 4,
    module_title: 'Pathology',
    key_submodule: 'Neoplasia',
    slug: 'papillary-thyroid-carcinoma-psammoma-bodies',
    title: 'Papillary Thyroid Carcinoma: Psammoma Bodies and Orphan Annie Eye Nuclei',
    sort_order: 6,

    hook_vignette:
      'A 32-year-old woman notices a painless nodule in her neck while applying makeup. On exam, a firm, non-tender nodule is palpated in the right thyroid lobe that moves with swallowing, and a palpable ipsilateral cervical lymph node is also noted. She has no history of head/neck radiation exposure and is clinically euthyroid.',

    ddx_mapping:
      'Follicular thyroid carcinoma — fine-needle aspiration cannot reliably distinguish follicular adenoma from carcinoma cytologically, since the distinguishing feature (capsular/vascular invasion) can only be assessed on the excised specimen; spreads hematogenously rather than to regional nodes, unlike papillary carcinoma.\n' +
      'Medullary thyroid carcinoma — arises from parafollicular C cells, produces calcitonin, associated with MEN2 syndromes, often with diarrhea/flushing; amyloid stroma on histology rather than psammoma bodies.\n' +
      'Anaplastic thyroid carcinoma — older patients, rapidly enlarging, highly aggressive, undifferentiated histology.\n' +
      'Benign colloid/multinodular goiter — rubbery, often multiple nodules, uniform colloid-filled follicles without malignant nuclear atypia.',

    diagnostic_evaluation:
      "Fine-needle aspiration biopsy is first-line and is often diagnostic, since papillary carcinoma's distinctive nuclear features are visible on cytology alone.\n" +
      "Classic findings: papillary architecture (finger-like projections with a fibrovascular core), 'Orphan Annie eye' nuclei (large nuclei with optically clear, empty-appearing chromatin), nuclear grooves, and psammoma bodies (concentrically laminated, calcified structures thought to represent dystrophic calcification of necrotic papillary tips).\n" +
      'Psammoma bodies, while classic and highly suggestive, are not required for diagnosis and can also be seen in a minority of other tumors (e.g., serous ovarian tumors, meningioma).\n' +
      'Thyroid ultrasound characterizes the nodule (hypoechoic, irregular margins, microcalcifications, increased vascularity raise suspicion) and guides biopsy. Diagnosis rests on nuclear features rather than invasion (unlike follicular carcinoma), so it is diagnosable on FNA alone.',

    management:
      'Surgical resection is the mainstay — lobectomy for small, low-risk, unifocal tumors, or total thyroidectomy for larger/higher-risk or multifocal disease, with central/lateral neck lymph node dissection if nodal involvement is confirmed.\n' +
      'Radioactive iodine (I-131) ablation is used postoperatively in intermediate- to high-risk patients to destroy residual thyroid tissue and any iodine-avid metastatic disease, exploiting the fact that well-differentiated thyroid cancer retains normal follicular-cell iodine uptake.\n' +
      'Lifelong levothyroxine replacement after thyroidectomy, often dosed to mildly suppress TSH in higher-risk patients, since TSH can stimulate residual tumor growth.\n' +
      'Serum thyroglobulin serves as a surveillance tumor marker after thyroidectomy. Prognosis is excellent overall — this is the most common and most indolent thyroid cancer subtype — and cervical lymph node spread, while common, does not carry the same poor prognostic weight it would in most other carcinomas.',

    first_order_prompt:
      'What two classic nuclear/architectural histologic features, together with concentrically calcified laminated bodies, define papillary thyroid carcinoma?',
    first_order_answer:
      'Orphan Annie eye nuclei (optically clear, ground-glass chromatin) and nuclear grooves, often accompanied by psammoma bodies (laminated calcified structures) — diagnosis rests on these nuclear features rather than capsular/vascular invasion.',

    second_order_vignette:
      'A 58-year-old man presents with a thyroid nodule found incidentally on a CT scan obtained for an unrelated reason. Fine-needle aspiration is read as a follicular neoplasm; cytology cannot distinguish a benign process from carcinoma. He proceeds to diagnostic lobectomy, and the pathology report describes a well-encapsulated tumor composed of uniform follicles, with capsular invasion identified in two areas but no vascular invasion and no nuclear features of papillary carcinoma.',
    second_order_question:
      "What is the most likely diagnosis, and why couldn't fine-needle aspiration alone establish it?",
    second_order_choices: JSON.stringify([
      {
        label: 'A',
        text: 'Follicular adenoma; FNA is always sufficient to diagnose benign follicular lesions',
        correct: false,
        explanation:
          'The pathology explicitly describes capsular invasion, the defining feature that makes this carcinoma rather than adenoma.',
      },
      {
        label: 'B',
        text: 'Papillary thyroid carcinoma, follicular variant; FNA missed the diagnostic nuclear features',
        correct: false,
        explanation:
          'The pathology report specifically notes no nuclear features of papillary carcinoma; papillary carcinoma (including its follicular variant) is actually reliably diagnosable on FNA because of its nuclear features, unlike follicular carcinoma.',
      },
      {
        label: 'C',
        text: 'Medullary thyroid carcinoma; FNA cannot detect calcitonin production',
        correct: false,
        explanation:
          'Nothing supports a C-cell origin tumor (no amyloid stroma, no calcitonin elevation mentioned), and medullary carcinoma has its own distinct cytologic appearance detectable on FNA.',
      },
      {
        label: 'D',
        text: 'Follicular carcinoma; FNA cannot assess capsular or vascular invasion, which can only be evaluated on the fully excised, sectioned specimen',
        correct: true,
        explanation:
          'Follicular carcinoma is diagnosed solely by demonstrating capsular and/or vascular invasion, an architectural relationship invisible on FNA cytology, which samples only individual cells.',
      },
      {
        label: 'E',
        text: 'Anaplastic thyroid carcinoma; FNA cannot be performed on rapidly growing tumors',
        correct: false,
        explanation:
          'Nothing suggests rapid growth or the markedly pleomorphic, undifferentiated histology of anaplastic carcinoma; this is an incidental, presumably slow-growing nodule.',
      },
    ]),
    second_order_answer: 'D',
    second_order_explanation:
      "Follicular carcinoma is unique among common thyroid cancers in that its diagnosis depends entirely on demonstrating capsular and/or vascular invasion on histologic sections of the whole excised nodule — a feature architecturally invisible on FNA cytology, which only samples cells. This is why an FNA read of 'follicular neoplasm' is inherently indeterminate and requires diagnostic lobectomy, in contrast with papillary carcinoma, which is reliably diagnosed on FNA alone because its diagnostic features are nuclear and visible on individual cells.",

    flowchart_title: 'Thyroid Nodule to Diagnosis',
    flowchart: JSON.stringify([
      {
        node: 'Palpable/incidental thyroid nodule',
        branches: [
          {
            label: 'Ultrasound suspicious features (hypoechoic, irregular, microcalcifications)',
            next: 'Proceed to fine-needle aspiration',
          },
          {
            label: 'Low-suspicion ultrasound features',
            next: 'Observe with follow-up ultrasound',
          },
        ],
      },
      {
        node: 'FNA cytology result',
        branches: [
          {
            label: 'Orphan Annie eye nuclei, nuclear grooves, +/- psammoma bodies',
            next: 'Papillary thyroid carcinoma — diagnostic on FNA',
          },
          {
            label: 'Uniform follicular cells, invasion cannot be assessed',
            next: "Indeterminate 'follicular neoplasm' — requires diagnostic lobectomy",
          },
          {
            label: 'Amyloid stroma, cells of C-cell lineage',
            next: 'Suspect medullary carcinoma — check serum calcitonin, screen for MEN2',
          },
        ],
      },
      {
        node: 'Diagnostic lobectomy specimen (for indeterminate FNA)',
        branches: [
          {
            label: 'Capsular and/or vascular invasion present',
            next: 'Follicular carcinoma — completion thyroidectomy per risk stratification',
          },
          {
            label: 'No invasion identified',
            next: 'Follicular adenoma — benign, no further treatment',
          },
        ],
      },
    ]),
  },
  // ===========================================================================
  // Module 3 — Microbiology
  // ===========================================================================
  {
    module_number: 3,
    module_title: "Microbiology",
    key_submodule: "CNS Infections",
    slug: "bacterial-meningitis-streptococcus-pneumoniae",
    title: "Acute Bacterial Meningitis (Streptococcus pneumoniae)",
    sort_order: 1,

    hook_vignette:
      "A 34-year-old woman presents to the emergency department with 12 hours of high fever, severe headache, and neck stiffness. Her husband reports she has become confused and unusually drowsy over the past two hours. On exam she winces and flexes her hips when her neck is passively flexed.",

    ddx_mapping:
      "Acute bacterial meningitis (classically S. pneumoniae in adults) evolves over hours and produces a triad of fever, neck stiffness, and altered mental status, often with photophobia and a markedly toxic appearance; CSF is turbid with a high neutrophil count.\nViral (aseptic) meningitis has a similar triad but a milder, more indolent course over 1-2 days, patients are less toxic-appearing and often remain alert and oriented, and CSF shows a lymphocytic pleocytosis with normal glucose.\nHerpes simplex encephalitis presents with fever plus prominent behavioral change, focal neurologic deficits, or seizures (temporal lobe involvement) rather than isolated meningismus, and CSF PCR for HSV is diagnostic; neck stiffness is often less pronounced than in bacterial meningitis.\nSubarachnoid hemorrhage causes a sudden 'thunderclap' headache reaching maximal intensity within seconds and can also produce neck stiffness and photophobia, but fever is absent or delayed and noncontrast head CT (followed by lumbar puncture if CT is negative) establishes the diagnosis rather than a septic CSF profile.\nBrain abscess presents more subacutely with headache, fever, and focal deficits (matching the abscess location) and lumbar puncture is often deferred because of the risk of herniation with a mass lesion; imaging (contrast MRI/CT) showing a ring-enhancing lesion distinguishes it from diffuse meningeal infection.",

    diagnostic_evaluation:
      "Blood cultures should be drawn immediately, before or simultaneously with any imaging, and empiric antibiotics should not be delayed for either imaging or lumbar puncture in a patient without contraindications.\nCT head before lumbar puncture is reserved for patients with papilledema, focal neurologic deficits, new seizure, altered consciousness, or immunocompromise, to rule out a mass effect that would risk herniation with LP.\nLumbar puncture in bacterial meningitis classically shows an opening pressure >180 mmH2O, WBC count often >1,000/mm3 with neutrophil predominance, glucose <40 mg/dL (or CSF:serum glucose ratio <0.4), and protein >150 mg/dL.\nCSF Gram stain and culture identify the organism; for S. pneumoniae, Gram-positive diplococci are seen on Gram stain, and CSF/blood PCR panels can speed identification when culture is pending.",

    management:
      "Empiric therapy in adults is started immediately (ideally within 30-60 minutes of presentation) with IV vancomycin plus a third-generation cephalosporin (ceftriaxone or cefotaxime) to cover resistant pneumococcus, plus dexamethasone given just before or with the first antibiotic dose (dexamethasone reduces neurologic complications and mortality specifically in pneumococcal meningitis, and should be discontinued if the organism turns out not to be S. pneumoniae).\nAdd ampicillin empirically in patients >50 years, alcoholic, or otherwise immunocompromised to cover Listeria monocytogenes, which is not covered by cephalosporins.\nOnce culture and susceptibility confirm penicillin-susceptible S. pneumoniae, therapy can be narrowed to penicillin G or ampicillin; total duration is typically 10-14 days.\nClose contacts require chemoprophylaxis only for meningococcal meningitis (rifampin, ciprofloxacin, or ceftriaxone), not for pneumococcal meningitis, since S. pneumoniae is not transmitted by the same droplet/close-contact risk profile that drives meningococcal prophylaxis.",

    first_order_prompt:
      "What is the single most common cause of community-acquired bacterial meningitis in immunocompetent adults?",
    first_order_answer:
      "Streptococcus pneumoniae (a Gram-positive, catalase-negative, alpha-hemolytic diplococcus).",

    second_order_vignette:
      "A 58-year-old man with a history of alcohol use disorder is brought to the emergency department after being found confused at home. His temperature is 39.4°C (102.9°F), blood pressure 100/62 mmHg, and heart rate 118/min. He is somnolent but arousable, and passive neck flexion produces pain and involuntary hip flexion. A noncontrast CT of the head shows no mass effect or midline shift.",
    second_order_question:
      "Which of the following is the most appropriate next step in management?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "Draw blood cultures, then perform lumbar puncture, and start IV vancomycin, ceftriaxone, ampicillin, and dexamethasone immediately after the LP without waiting for CSF results",
        "correct": true,
        "explanation": "Correct. CT already excluded a mass lesion, so LP should proceed without further imaging delay; empiric antibiotics (including ampicillin for Listeria coverage given his age and alcohol use) plus dexamethasone should start immediately after CSF is obtained rather than waiting for results, since delayed antibiotics increase mortality."
      },
      {
        "label": "B",
        "text": "Withhold antibiotics until CSF Gram stain and culture results are finalized, to avoid partially treating the infection before it is identified",
        "correct": false,
        "explanation": "Incorrect. Delaying antibiotics for culture confirmation increases the risk of neurologic complications and death; empiric therapy should start immediately after (or with) the LP."
      },
      {
        "label": "C",
        "text": "Obtain an MRI of the brain before proceeding with lumbar puncture, given the patient's altered mental status",
        "correct": false,
        "explanation": "Incorrect. A noncontrast CT has already excluded a mass effect; an additional MRI only delays LP and antibiotics without added safety benefit here."
      },
      {
        "label": "D",
        "text": "Start ceftriaxone monotherapy and defer vancomycin and ampicillin until an organism is identified",
        "correct": false,
        "explanation": "Incorrect. Empiric therapy must be broad from the start: vancomycin for resistant pneumococcus and ampicillin for Listeria (given his age >50 and alcohol use), not narrowed pending culture."
      },
      {
        "label": "E",
        "text": "Administer dexamethasone only if CSF Gram stain reveals Gram-positive diplococci",
        "correct": false,
        "explanation": "Incorrect. Dexamethasone should be given empirically with or just before the first antibiotic dose, before the organism is confirmed, and discontinued later if the organism turns out not to be S. pneumoniae."
      }
    ]),
    second_order_answer: "A",
    second_order_explanation:
      "This patient's presentation (fever, altered mental status, meningismus) in the setting of alcohol use disorder and age >50 raises specific concern for Listeria monocytogenes in addition to the more common S. pneumoniae and Neisseria meningitidis, so empiric therapy must include ampicillin alongside vancomycin (for resistant pneumococcus) and a third-generation cephalosporin (for pneumococcus/meningococcus). Because his CT already excluded a mass lesion, lumbar puncture should proceed without further imaging delay, and antibiotics (plus dexamethasone, ideally given with or just before the first antibiotic dose) should be started immediately after CSF is obtained rather than waiting for culture results — every hour of delay in antibiotic administration in bacterial meningitis is associated with increased mortality.",

    flowchart_title: "Approach to Suspected Bacterial Meningitis",
    flowchart: JSON.stringify([
      {
        "node": "Adult with fever, headache, neck stiffness ± altered mental status",
        "branches": [
          {
            "label": "Papilledema, focal deficit, new seizure, or immunocompromise present",
            "next": "Obtain blood cultures → CT head before LP"
          },
          {
            "label": "None of the above red flags present",
            "next": "Obtain blood cultures → proceed directly to LP"
          }
        ]
      },
      {
        "node": "CT head (if obtained)",
        "branches": [
          {
            "label": "Mass effect / shift present",
            "next": "Defer LP; start empiric antibiotics + dexamethasone immediately"
          },
          {
            "label": "No mass effect",
            "next": "Proceed to LP without further delay"
          }
        ]
      },
      {
        "node": "Lumbar puncture",
        "branches": [
          {
            "label": "Neutrophilic pleocytosis, glucose <40, protein >150",
            "next": "Start empiric vancomycin + ceftriaxone (+ampicillin if age >50/immunocompromised) + dexamethasone"
          },
          {
            "label": "Lymphocytic pleocytosis, normal glucose",
            "next": "Consider viral meningitis/encephalitis; add acyclovir if HSV encephalitis suspected"
          }
        ]
      },
      {
        "node": "CSF Gram stain / culture results",
        "branches": [
          {
            "label": "Gram-positive diplococci, penicillin-susceptible",
            "next": "Narrow to penicillin G or ampicillin; continue dexamethasone; treat 10-14 days"
          },
          {
            "label": "Organism other than S. pneumoniae",
            "next": "Discontinue dexamethasone; tailor antibiotics to organism/susceptibility"
          }
        ]
      }
    ]),
  },
  {
    module_number: 3,
    module_title: "Microbiology",
    key_submodule: "Pulmonary Infections",
    slug: "community-acquired-pneumonia-streptococcus-pneumoniae",
    title: "Community-Acquired Pneumonia (Streptococcus pneumoniae)",
    sort_order: 2,

    hook_vignette:
      "A 62-year-old man with type 2 diabetes presents with three days of fever, shaking chills, a productive cough with rust-colored sputum, and right-sided pleuritic chest pain. He appears ill and tachypneic, and lung auscultation over the right lower lobe reveals bronchial breath sounds with crackles and dullness to percussion.",

    ddx_mapping:
      "Typical (classic/lobar) pneumonia from Streptococcus pneumoniae presents acutely over 1-3 days with high fever, rigors, a productive cough with rust-colored or purulent sputum, pleuritic chest pain, and a lobar consolidation on chest x-ray; sputum Gram stain shows Gram-positive diplococci with abundant neutrophils.\nAtypical pneumonia (Mycoplasma pneumoniae) has a more gradual onset over days to a week with a dry, nonproductive cough, low-grade fever, and symptoms often 'out of proportion' to the relatively unremarkable exam findings ('walking pneumonia'); chest x-ray tends to show patchy, diffuse interstitial infiltrates rather than a dense lobar consolidation, and it occurs more often in younger patients, often in clusters (dormitories, military barracks).\nLegionella pneumonia should be suspected when pneumonia is accompanied by prominent GI symptoms (diarrhea, abdominal pain), relative bradycardia for the degree of fever, hyponatremia, and a history of exposure to contaminated water sources (cooling towers, hot tubs); diagnosis is via urine antigen testing, since it does not reliably grow on standard sputum culture media.\nViral pneumonia (influenza, and others) typically follows or accompanies upper respiratory prodrome symptoms (myalgias, coryza) and can be distinguished with a rapid viral PCR panel; secondary bacterial pneumonia (often S. pneumoniae or S. aureus) should be suspected if symptoms worsen after initial improvement.\nPulmonary tuberculosis presents more subacutely to chronically (weeks to months) with low-grade fever, night sweats, weight loss, and hemoptysis, typically with upper-lobe cavitary infiltrates on imaging, and requires acid-fast staining/culture or NAAT rather than routine sputum Gram stain/culture.",

    diagnostic_evaluation:
      "Chest x-ray (or CT if x-ray is equivocal) is required to confirm the diagnosis and typically shows a lobar or segmental consolidation with air bronchograms in classic pneumococcal pneumonia.\nSputum Gram stain and culture (good-quality sample, <10 squamous epithelial cells and >25 neutrophils per low-power field) can identify the organism, though yield is imperfect; blood cultures should be obtained in hospitalized patients before antibiotics.\nUrine antigen tests are available for both S. pneumoniae and Legionella and can rapidly support the diagnosis even after antibiotics have been started.\nSeverity/disposition scoring (CURB-65 or the Pneumonia Severity Index) using confusion, BUN, respiratory rate, blood pressure, and age helps decide between outpatient management, hospital ward admission, or ICU-level care.",

    management:
      "Outpatient treatment for a previously healthy adult without comorbidities is typically amoxicillin or, if atypical coverage is also desired, a macrolide (azithromycin) or doxycycline; patients with comorbidities (diabetes, chronic heart/lung/liver/renal disease) typically receive a respiratory fluoroquinolone (e.g., levofloxacin) or a beta-lactam plus a macrolide.\nInpatient (non-ICU) therapy is typically a beta-lactam (ceftriaxone) plus a macrolide, or a respiratory fluoroquinolone alone, to cover both typical and atypical organisms.\nICU-level severe CAP requires a beta-lactam plus either a macrolide or a respiratory fluoroquinolone, with additional coverage for Pseudomonas or MRSA added if specific risk factors (structural lung disease, recent hospitalization/antibiotics, prior isolation of these organisms) are present.\nPneumococcal conjugate and polysaccharide vaccines are recommended for prevention in age-eligible adults and those with qualifying comorbidities, and smoking cessation should be addressed as a modifiable risk factor.",

    first_order_prompt:
      "What is the classic sputum Gram stain finding in typical (pneumococcal) community-acquired pneumonia?",
    first_order_answer:
      "Gram-positive, lancet-shaped diplococci (Streptococcus pneumoniae) with numerous neutrophils on a good-quality sputum sample.",

    second_order_vignette:
      "A previously healthy 24-year-old college student living in a dormitory presents with five days of low-grade fever, malaise, and a persistent dry cough. He says he still went to most of his classes because he 'didn't feel that sick.' Chest x-ray shows patchy, diffuse interstitial infiltrates in both lower lung fields without a discrete lobar consolidation. His roommate has similar symptoms.",
    second_order_question:
      "Which organism is most likely responsible for this presentation?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "Streptococcus pneumoniae",
        "correct": false,
        "explanation": "Incorrect. S. pneumoniae typically causes an acute, toxic-appearing lobar pneumonia with a productive cough, not this gradual, mild illness with patchy infiltrates."
      },
      {
        "label": "B",
        "text": "Mycoplasma pneumoniae",
        "correct": true,
        "explanation": "Correct. A young patient in a dormitory cluster with a gradual onset, dry cough, and symptoms 'out of proportion' to a mild exam and diffuse patchy infiltrates is the classic picture of atypical ('walking') pneumonia due to Mycoplasma."
      },
      {
        "label": "C",
        "text": "Legionella pneumophila",
        "correct": false,
        "explanation": "Incorrect. Legionella typically causes more severe illness with GI symptoms, hyponatremia, and relative bradycardia, and is linked to a contaminated water source rather than person-to-person dormitory spread."
      },
      {
        "label": "D",
        "text": "Klebsiella pneumoniae",
        "correct": false,
        "explanation": "Incorrect. Klebsiella classically affects alcoholics/diabetics with a necrotizing lobar pneumonia and thick, blood-tinged (\"currant jelly\") sputum, not a mild outbreak among young dormitory residents."
      },
      {
        "label": "E",
        "text": "Pneumocystis jirovecii",
        "correct": false,
        "explanation": "Incorrect. PJP occurs in immunocompromised hosts (e.g., HIV with a low CD4 count), not a previously healthy young adult."
      }
    ]),
    second_order_answer: "B",
    second_order_explanation:
      "This vignette is a classic description of atypical ('walking') pneumonia due to Mycoplasma pneumoniae: a young, otherwise healthy patient with a gradual onset of mild constitutional symptoms and a dry cough who remains functional despite illness, occurring in a cluster among people in close contact (dormitories, military barracks), with chest imaging showing diffuse patchy interstitial infiltrates rather than a dense lobar consolidation. Mycoplasma lacks a cell wall, so beta-lactams are ineffective; treatment is with a macrolide, doxycycline, or a respiratory fluoroquinolone.",

    flowchart_title: "Community-Acquired Pneumonia: Typical vs Atypical",
    flowchart: JSON.stringify([
      {
        "node": "Adult with cough, fever, and abnormal chest imaging",
        "branches": [
          {
            "label": "Acute onset, high fever/rigors, productive rust-colored sputum, lobar consolidation",
            "next": "Suspect typical CAP (S. pneumoniae)"
          },
          {
            "label": "Gradual onset, dry cough, mild symptoms, diffuse patchy infiltrates",
            "next": "Suspect atypical CAP (Mycoplasma/Chlamydophila)"
          }
        ]
      },
      {
        "node": "Additional clues",
        "branches": [
          {
            "label": "GI symptoms, hyponatremia, relative bradycardia, water-source exposure",
            "next": "Consider Legionella; send urine antigen"
          },
          {
            "label": "Alcoholic/diabetic, currant-jelly sputum, bulging fissure on imaging",
            "next": "Consider Klebsiella pneumoniae"
          }
        ]
      },
      {
        "node": "Assess severity (CURB-65 / clinical judgment)",
        "branches": [
          {
            "label": "Low risk, no comorbidities",
            "next": "Outpatient: amoxicillin, or macrolide/doxycycline"
          },
          {
            "label": "Comorbidities or moderate severity, ward admission",
            "next": "Inpatient: beta-lactam + macrolide, or respiratory fluoroquinolone"
          },
          {
            "label": "Severe/ICU criteria met",
            "next": "Beta-lactam + macrolide or fluoroquinolone; add MRSA/Pseudomonas coverage if risk factors"
          }
        ]
      }
    ]),
  },
  {
    module_number: 3,
    module_title: "Microbiology",
    key_submodule: "Endocarditis",
    slug: "subacute-infective-endocarditis-viridans-streptococci",
    title: "Subacute Infective Endocarditis (Viridans Streptococci)",
    sort_order: 3,

    hook_vignette:
      "A 45-year-old man with a history of rheumatic heart disease and a known mitral valve murmur presents with three weeks of low-grade fevers, night sweats, fatigue, and a 4-kg weight loss. He recently had a dental extraction without antibiotic prophylaxis. On exam he has a new holosystolic murmur at the apex, tender nodules on his fingertips, and small hemorrhages under his nail beds.",

    ddx_mapping:
      "Subacute infective endocarditis (classically viridans group streptococci, e.g., Streptococcus sanguinis/mutans) develops over weeks on a previously damaged or abnormal valve (rheumatic heart disease, mitral valve prolapse, bicuspid aortic valve) following a bacteremic event such as a dental procedure, and presents with low-grade constitutional symptoms plus immune-complex phenomena (Osler nodes, Roth spots, glomerulonephritis) and embolic phenomena (Janeway lesions, splinter hemorrhages).\nAcute infective endocarditis (classically Staphylococcus aureus) instead affects normal or damaged valves, often in IV drug users (typically right-sided, tricuspid valve) or hospitalized patients with indwelling catheters, and progresses rapidly over days with high fevers, a more fulminant course, and a higher risk of valve destruction and septic emboli.\nRheumatic fever/rheumatic heart disease recurrence should be considered when there is a history of prior rheumatic fever and new migratory polyarthritis, carditis, chorea, or subcutaneous nodules following a recent streptococcal pharyngitis, distinguished from endocarditis by the Jones criteria and absence of a persistently positive blood culture.\nMarantic (nonbacterial thrombotic) endocarditis occurs in the setting of malignancy or a hypercoagulable state, produces sterile vegetations, and blood cultures remain negative despite similar valvular findings on echocardiography.\nAtrial myxoma can mimic endocarditis with constitutional symptoms, embolic phenomena, and a new murmur, but blood cultures are negative and echocardiography identifies a discrete intracardiac mass rather than a vegetation associated with infection.",

    diagnostic_evaluation:
      "Diagnosis uses the modified Duke criteria, combining major criteria (two or more positive blood cultures with a typical endocarditis organism, and echocardiographic evidence of endocardial involvement such as a vegetation, abscess, or new valvular regurgitation) with minor criteria (predisposing heart condition or IV drug use, fever ≥38°C, vascular phenomena, immunologic phenomena, and microbiologic evidence not meeting major criteria).\nThree sets of blood cultures from separate venipuncture sites, drawn before starting antibiotics, are essential, since subacute endocarditis produces continuous, low-grade bacteremia that is reliably captured this way.\nTransthoracic echocardiography (TTE) is the initial imaging study; transesophageal echocardiography (TEE) is more sensitive and is used when TTE is nondiagnostic, when a prosthetic valve is present, or when clinical suspicion remains high despite a negative TTE.\nSupporting labs may show a normocytic anemia of chronic disease, elevated inflammatory markers (ESR/CRP), and microscopic hematuria or red cell casts if immune-complex glomerulonephritis has developed.",

    management:
      "Empiric therapy pending culture results in a subacute presentation with a native valve typically targets streptococci and staphylococci (e.g., vancomycin plus ceftriaxone), then is narrowed once an organism and susceptibilities are known; penicillin-susceptible viridans streptococcal endocarditis is classically treated with IV penicillin G or ceftriaxone for four weeks, sometimes combined with gentamicin for a shorter synergistic course to shorten total treatment duration in uncomplicated cases.\nSurgical valve repair or replacement is indicated for refractory heart failure from valve destruction, uncontrolled infection (perivalvular abscess, persistent bacteremia despite appropriate antibiotics, fungal or highly resistant organisms), or recurrent large emboli despite antibiotics.\nAntibiotic prophylaxis before dental procedures involving gingival manipulation is reserved for the highest-risk patients: prosthetic heart valves, prior infective endocarditis, certain unrepaired or recently repaired congenital heart disease, and cardiac transplant recipients with valvulopathy — a single dose of amoxicillin (or clindamycin/azithromycin if penicillin-allergic) is given before the procedure.\nSerial blood cultures are repeated during therapy to confirm clearance of bacteremia, and patients are monitored for embolic and immune-complex complications throughout the treatment course.",

    first_order_prompt:
      "What organism classically causes subacute infective endocarditis on a previously damaged heart valve following a dental procedure?",
    first_order_answer:
      "Viridans group streptococci (e.g., Streptococcus sanguinis, S. mutans) — alpha-hemolytic, optochin-resistant streptococci that are part of normal oral flora.",

    second_order_vignette:
      "A 29-year-old man with a history of intravenous heroin use presents with five days of high fever, chills, and pleuritic chest pain. He appears acutely ill. Cardiac exam reveals a new murmur best heard at the left lower sternal border that increases with inspiration. Chest x-ray shows multiple bilateral peripheral nodular opacities, some with cavitation.",
    second_order_question:
      "Which of the following best describes the expected findings and most likely causative organism in this patient?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "Aortic valve vegetation with viridans streptococci, following a recent dental procedure",
        "correct": false,
        "explanation": "Incorrect. This is the wrong valve and organism for an IV drug user with an acute presentation; there is no dental exposure history here."
      },
      {
        "label": "B",
        "text": "Tricuspid valve vegetation with Staphylococcus aureus, with septic pulmonary emboli explaining the cavitary lung nodules",
        "correct": true,
        "explanation": "Correct. IV drug use is the classic risk factor for right-sided (tricuspid) endocarditis, most often from S. aureus; septic emboli travel to the lungs and produce multiple, sometimes cavitating, nodular opacities, and the murmur that increases with inspiration (Carvallo sign) localizes to the tricuspid valve."
      },
      {
        "label": "C",
        "text": "Mitral valve vegetation with Enterococcus faecalis, following a recent urinary catheterization",
        "correct": false,
        "explanation": "Incorrect. There is no catheterization history, and enterococcal endocarditis does not explain this acute right-sided picture with septic pulmonary emboli."
      },
      {
        "label": "D",
        "text": "Sterile mitral valve vegetation (marantic endocarditis) related to an undiagnosed malignancy",
        "correct": false,
        "explanation": "Incorrect. This patient has an acute febrile illness with a clear IV drug use risk factor and imaging consistent with septic emboli, not a sterile marantic process."
      },
      {
        "label": "E",
        "text": "Pulmonic valve vegetation with Candida albicans, related to long-term parenteral nutrition",
        "correct": false,
        "explanation": "Incorrect. There is no history of parenteral nutrition or central line exposure, and S. aureus in an IV drug user is far more classic than fungal endocarditis here."
      }
    ]),
    second_order_answer: "B",
    second_order_explanation:
      "IV drug use is the classic risk factor for right-sided (tricuspid valve) infective endocarditis, most commonly caused by Staphylococcus aureus, which can rapidly infect even a structurally normal valve. Septic emboli from a tricuspid vegetation travel through the right heart into the pulmonary circulation, producing the multiple, often cavitating, peripheral nodular lung opacities seen on this patient's chest x-ray (rather than the systemic embolic phenomena — Janeway lesions, splinter hemorrhages, Osler nodes — seen with left-sided endocarditis). The tricuspid regurgitant murmur at the left lower sternal border that increases with inspiration (Carvallo's sign) further supports right-sided valve involvement.",

    flowchart_title: "Suspected Infective Endocarditis Workup",
    flowchart: JSON.stringify([
      {
        "node": "Fever + new murmur ± embolic/immunologic signs",
        "branches": [
          {
            "label": "IV drug use, acute high fevers, right-sided murmur",
            "next": "Suspect acute right-sided IE (S. aureus, tricuspid valve)"
          },
          {
            "label": "Known valve disease, subacute course, recent dental/GI/GU procedure",
            "next": "Suspect subacute left-sided IE (viridans strep, enterococcus)"
          }
        ]
      },
      {
        "node": "Obtain 3 sets of blood cultures from separate sites before antibiotics",
        "branches": [
          {
            "label": "Two or more positive sets with typical organism",
            "next": "Major Duke blood-culture criterion met"
          },
          {
            "label": "Cultures negative/atypical organism",
            "next": "Consider fastidious organisms (HACEK), prior antibiotic exposure, or noninfective mimic"
          }
        ]
      },
      {
        "node": "Echocardiography",
        "branches": [
          {
            "label": "TTE shows vegetation/abscess/new regurgitation",
            "next": "Major imaging criterion met; confirm Duke diagnosis"
          },
          {
            "label": "TTE negative but suspicion remains high (or prosthetic valve)",
            "next": "Proceed to TEE"
          }
        ]
      },
      {
        "node": "Definitive management",
        "branches": [
          {
            "label": "Organism identified, susceptible, no complications",
            "next": "Pathogen-directed IV antibiotics (e.g., penicillin/ceftriaxone ± gentamicin for viridans strep) x4-6 weeks"
          },
          {
            "label": "Refractory heart failure, uncontrolled infection, or recurrent emboli",
            "next": "Refer for surgical valve repair/replacement"
          }
        ]
      }
    ]),
  },
  {
    module_number: 3,
    module_title: "Microbiology",
    key_submodule: "Infectious Arthritis",
    slug: "disseminated-gonococcal-infection",
    title: "Disseminated Gonococcal Infection",
    sort_order: 4,

    hook_vignette:
      "A 22-year-old sexually active woman presents with three days of migratory joint pain that has settled into her right wrist and left knee, along with several painless pustules on an erythematous base scattered over her hands and forearms. She reports no vaginal discharge but has had two new sexual partners in the past two months and inconsistent condom use.",

    ddx_mapping:
      "Disseminated gonococcal infection (DGI) classically presents in one of two overlapping patterns: a triad of migratory polyarthralgia/tenosynovitis, dermatitis (painless pustules/vesicopustules on an erythematous base), and fever without a single markedly swollen joint (the 'arthritis-dermatitis syndrome'), or a purulent monoarticular/oligoarticular septic arthritis (most often knee, wrist, or ankle) without the classic skin lesions; synovial fluid Gram stain/culture is often negative in the arthritis-dermatitis pattern but positive in the purulent monoarticular pattern.\nNongonococcal septic arthritis (most commonly Staphylococcus aureus, also streptococci and Gram-negative rods in older/immunocompromised patients) presents as a single acutely hot, swollen, exquisitely painful joint with a markedly elevated synovial WBC count and a positive Gram stain/culture much more consistently than gonococcal arthritis, and lacks the skin/tenosynovitis findings of DGI.\n(Formerly Reiter syndrome) Reactive arthritis, triggered by a preceding GI or genitourinary infection (Chlamydia, Campylobacter, Salmonella, Shigella, Yersinia), presents with asymmetric oligoarthritis, conjunctivitis/uveitis, and urethritis, but synovial fluid cultures are sterile since it is a post-infectious immune phenomenon rather than direct joint infection.\nAcute rheumatic fever presents with migratory polyarthritis of large joints following streptococcal pharyngitis, but is accompanied by carditis, chorea, erythema marginatum, and subcutaneous nodules (Jones criteria) rather than the pustular skin lesions of DGI, and synovial fluid is sterile.\nCrystal arthropathies (gout, pseudogout) cause acute monoarticular pain and swelling but typically lack fever/systemic toxicity and skin pustules, and are distinguished definitively by synovial fluid polarized microscopy showing negatively birefringent urate crystals (gout) or positively birefringent/weakly birefringent rhomboid calcium pyrophosphate crystals (pseudogout).",

    diagnostic_evaluation:
      "Synovial fluid aspiration is essential in any suspected septic joint: cell count, Gram stain, culture, and crystal analysis; in DGI-associated purulent arthritis, synovial WBC is typically markedly elevated (often >50,000/mm3) with neutrophil predominance, though Gram stain/culture positivity is lower for gonococcus than for other septic arthritis organisms because Neisseria gonorrhoeae is fastidious.\nNucleic acid amplification testing (NAAT) of urine, and/or cervical, urethral, rectal, or pharyngeal swabs (based on sexual exposure history) has much higher sensitivity than culture for detecting the primary mucosal gonococcal infection that seeded the disseminated disease.\nBlood cultures and skin lesion cultures/NAAT can also be obtained, though yield from blood is generally low; because gonococcus requires special media (Thayer-Martin) to grow, the microbiology lab should be alerted when gonococcal infection is suspected.\nAll patients diagnosed with gonorrhea should be tested for other sexually transmitted infections, including chlamydia (frequent coinfection), HIV, and syphilis.",

    management:
      "Empiric treatment for suspected DGI is IV ceftriaxone, continued until clinical improvement (typically 24-48 hours), followed by transition to an oral agent to complete at least a 7-day total course; because chlamydial coinfection is common, empiric treatment for chlamydia (doxycycline) is also given unless it has been specifically excluded by testing.\nDrainage of a purulent joint effusion (needle aspiration, and surgical washout for larger or difficult-to-access joints such as the hip) is part of management for the septic-arthritis pattern of DGI, similar to management of nongonococcal septic arthritis.\nBecause fluoroquinolone resistance in N. gonorrhoeae is now widespread, ceftriaxone-based regimens are preferred, and azithromycin is no longer routinely recommended as dual therapy given rising macrolide resistance; treatment should follow current local/CDC guidance given evolving resistance patterns.\nSexual partners from the preceding 60 days should be notified and treated (expedited partner therapy where permitted), and patients should abstain from sexual activity until therapy is completed and symptoms have resolved in both partners.",

    first_order_prompt:
      "What are the two classic clinical patterns of disseminated gonococcal infection?",
    first_order_answer:
      "(1) Arthritis-dermatitis syndrome — migratory polyarthralgia/tenosynovitis, painless pustular skin lesions, and fever, with often-negative joint cultures; and (2) purulent gonococcal septic arthritis — a single hot, swollen joint (often knee, wrist, or ankle) without the classic skin lesions, with a higher yield on synovial fluid Gram stain/culture.",

    second_order_vignette:
      "A 34-year-old man presents with two days of an acutely swollen, red, exquisitely tender right knee and fever to 38.9°C (102°F). He denies any recent sexual activity and has no skin lesions. He has a history of psoriasis but no other medical problems. Arthrocentesis yields cloudy synovial fluid with a WBC count of 85,000/mm3 (90% neutrophils), and Gram stain shows Gram-positive cocci in clusters.",
    second_order_question:
      "Which of the following is the most likely causative organism?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "Neisseria gonorrhoeae",
        "correct": false,
        "explanation": "Incorrect. N. gonorrhoeae is a Gram-negative diplococcus, inconsistent with the Gram-positive cocci in clusters seen here, and this patient lacks the sexual-exposure history and skin findings typical of DGI."
      },
      {
        "label": "B",
        "text": "Staphylococcus aureus",
        "correct": true,
        "explanation": "Correct. Gram-positive cocci in clusters with an acute, monoarticular, markedly neutrophilic septic arthritis is classic for S. aureus, the most common cause of nongonococcal septic arthritis overall, including in patients with skin conditions like psoriasis."
      },
      {
        "label": "C",
        "text": "Streptococcus pyogenes",
        "correct": false,
        "explanation": "Incorrect. Streptococci appear as Gram-positive cocci in chains on Gram stain, not clusters."
      },
      {
        "label": "D",
        "text": "Borrelia burgdorferi",
        "correct": false,
        "explanation": "Incorrect. Lyme arthritis is typically a less acutely inflammatory, more indolent monoarthritis without this degree of purulence, and Borrelia does not appear as Gram-positive cocci or grow easily on routine culture."
      },
      {
        "label": "E",
        "text": "Kingella kingae",
        "correct": false,
        "explanation": "Incorrect. Kingella classically affects young children, not an adult, and is a Gram-negative coccobacillus, not Gram-positive cocci in clusters."
      }
    ]),
    second_order_answer: "B",
    second_order_explanation:
      "An acutely hot, swollen, single joint with a markedly elevated, neutrophil-predominant synovial WBC count and Gram-positive cocci in clusters on Gram stain is classic for nongonococcal septic arthritis due to Staphylococcus aureus, the most common cause of septic arthritis overall in adults, including those with risk factors such as psoriasis (skin breakdown), diabetes, or prosthetic joints. This contrasts with gonococcal septic arthritis, which would show Gram-negative diplococci (often not seen at all on Gram stain given the fastidious nature of N. gonorrhoeae) in a sexually active patient, sometimes with associated tenosynovitis or pustular skin lesions.",

    flowchart_title: "Acute Monoarticular/Migratory Joint Pain with Fever",
    flowchart: JSON.stringify([
      {
        "node": "Sexually active patient with migratory arthralgia/tenosynovitis, fever, ± pustular skin lesions",
        "branches": [
          {
            "label": "Classic triad present, joint cultures often negative",
            "next": "Arthritis-dermatitis syndrome (disseminated gonococcal infection)"
          },
          {
            "label": "Single hot, purulent joint without skin lesions",
            "next": "Gonococcal septic arthritis (culture on Thayer-Martin media)"
          }
        ]
      },
      {
        "node": "Non-sexual-exposure-pattern acute monoarthritis",
        "branches": [
          {
            "label": "Gram-positive cocci in clusters on synovial Gram stain",
            "next": "Staphylococcus aureus septic arthritis"
          },
          {
            "label": "No organism seen; crystals on polarized microscopy",
            "next": "Gout (negatively birefringent) or pseudogout (positively birefringent)"
          }
        ]
      },
      {
        "node": "Preceding GI/GU infection, asymmetric oligoarthritis, sterile joint fluid",
        "branches": [
          {
            "label": "Conjunctivitis/uveitis and urethritis also present",
            "next": "Reactive arthritis"
          },
          {
            "label": "Recent Streptococcal pharyngitis, migratory large-joint arthritis, carditis",
            "next": "Acute rheumatic fever"
          }
        ]
      }
    ]),
  },
  {
    module_number: 3,
    module_title: "Microbiology",
    key_submodule: "Sore Throat",
    slug: "group-a-streptococcal-pharyngitis",
    title: "Group A Streptococcal Pharyngitis",
    sort_order: 5,

    hook_vignette:
      "An 8-year-old boy is brought in by his mother with one day of sudden-onset sore throat, fever to 38.9°C (102°F), and pain with swallowing. He has no cough or rhinorrhea. On exam he has tonsillar exudates, tender anterior cervical lymphadenopathy, and a fine, sandpaper-textured erythematous rash on his trunk.",

    ddx_mapping:
      "Group A streptococcal (Streptococcus pyogenes) pharyngitis presents with sudden-onset sore throat, fever, tonsillar exudates, and tender anterior cervical lymphadenopathy, classically without cough, rhinorrhea, or conjunctivitis; when accompanied by a diffuse sandpaper-like erythematous rash with circumoral pallor and a strawberry tongue, it defines scarlet fever, caused by an erythrogenic-toxin-producing strain. The Centor criteria (fever, tonsillar exudates, tender anterior cervical adenopathy, absence of cough) estimate the pretest probability of GAS.\nViral pharyngitis (most common overall cause of sore throat, from rhinovirus, adenovirus, coronavirus, etc.) typically features a more gradual onset with accompanying cough, rhinorrhea, conjunctivitis, and hoarseness — Centor-negative features that argue against GAS and against the need for testing/antibiotics.\nInfectious mononucleosis (Epstein-Barr virus) presents in adolescents/young adults with severe sore throat, exudative tonsillitis that can look identical to GAS on exam, but is distinguished by prominent posterior cervical (and generalized) lymphadenopathy, marked fatigue, splenomegaly, and a classic (though not universal) diffuse maculopapular rash if amoxicillin/ampicillin is mistakenly given; heterophile antibody (Monospot) testing or EBV-specific serology confirms the diagnosis, and peripheral smear shows atypical lymphocytes.\nPeritonsillar abscess is a suppurative complication that should be suspected when unilateral throat pain worsens despite initial treatment, with trismus, a muffled 'hot potato' voice, uvular deviation away from the affected side, and asymmetric tonsillar bulging on exam — this is a surgical emergency requiring drainage, distinct from uncomplicated pharyngitis.\nAcute HIV seroconversion can also present with pharyngitis plus fever, lymphadenopathy, and a diffuse rash, and should be considered when there is a relevant exposure history and the presentation doesn't fit cleanly with GAS or EBV; HIV RNA/antigen testing is used since antibody tests may still be negative in the acute window.",

    diagnostic_evaluation:
      "Rapid antigen detection testing (RADT) for GAS on a throat swab gives results within minutes and has high specificity but imperfect sensitivity; a throat culture is the gold standard and should be sent to confirm a negative RADT in children/adolescents (where false-negative RADT risk and complication risk from missed GAS are both higher), though this back-up culture is often not required in low-risk adults given a negative RADT.\nTesting (and treatment) is generally reserved for patients meeting Centor-based criteria (e.g., 3-4 points) to avoid over-testing/over-treating viral pharyngitis, since GAS pharyngitis is often self-limited and antibiotics mainly shorten symptom duration modestly while their main value is preventing suppurative and nonsuppurative complications.\nWhen mononucleosis is suspected instead, a heterophile antibody (Monospot) test and CBC with differential (looking for atypical lymphocytes and relative lymphocytosis) are the key studies; Monospot sensitivity is lower in the first week of illness and in young children, so EBV-specific serology (VCA IgM) can be used if clinical suspicion remains high despite a negative Monospot.\nAntistreptolysin O (ASO) titers are not useful for diagnosing acute pharyngitis but can retrospectively confirm a preceding GAS infection when evaluating suspected poststreptococcal sequelae (rheumatic fever, glomerulonephritis).",

    management:
      "First-line treatment for confirmed GAS pharyngitis is oral penicillin V or amoxicillin for 10 days (amoxicillin is often preferred in children for better taste/dosing); for penicillin-allergic patients, options include a first-generation cephalosporin (if the allergy is not severe), or azithromycin/clindamycin where local macrolide resistance rates are acceptable.\nA full 10-day course (even though symptoms often improve within a few days) is important specifically to prevent acute rheumatic fever; treatment does not reliably prevent poststreptococcal glomerulonephritis, but is still given for symptom relief, reducing contagious period, and preventing suppurative complications.\nSupportive care (analgesics/antipyretics, hydration, throat lozenges) is appropriate for both GAS and viral pharyngitis; antibiotics should not be given for viral pharyngitis.\nSuppurative complications (peritonsillar or retropharyngeal abscess, otitis media, sinusitis) require imaging/drainage and broader antibiotic coverage as indicated by the specific complication; patients with GAS pharyngitis can generally return to school/work/activities after 24 hours of antibiotics once afebrile.",

    first_order_prompt:
      "What clinical/exam finding, if present, argues AGAINST group A streptococcal pharyngitis and favors a viral etiology?",
    first_order_answer:
      "Cough (along with rhinorrhea and conjunctivitis) — one of the four Centor criteria is specifically the ABSENCE of cough; its presence lowers the pretest probability of GAS and favors a viral cause.",

    second_order_vignette:
      "A 19-year-old college student presents with five days of severe sore throat and fatigue so profound she has been unable to attend classes. Exam reveals exudative tonsillitis, prominent posterior cervical and generalized lymphadenopathy, and mild splenomegaly on abdominal palpation. A rapid strep test performed by student health is negative. Two days ago, before this visit, she was empirically started on amoxicillin by an urgent care clinic for presumed bacterial pharyngitis, and this morning she developed a diffuse, itchy maculopapular rash over her trunk and extremities.",
    second_order_question:
      "Which of the following best explains this patient's rash?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "A true IgE-mediated penicillin allergy",
        "correct": false,
        "explanation": "Incorrect. The classic amoxicillin/ampicillin-associated rash occurring during acute Epstein-Barr virus infection is not a true IgE-mediated allergic reaction."
      },
      {
        "label": "B",
        "text": "A nonallergic, immune-complex-mediated exanthem that occurs when aminopenicillins are given during acute Epstein-Barr virus infection",
        "correct": true,
        "explanation": "Correct. This patient's picture (severe pharyngitis, profound fatigue, posterior cervical/generalized adenopathy, splenomegaly, negative rapid strep test) is classic mononucleosis, and the diffuse rash after amoxicillin is the well-described EBV-amoxicillin rash — a non-IgE-mediated reaction, not a true allergy."
      },
      {
        "label": "C",
        "text": "Scarlet fever from an erythrogenic-toxin-producing group A Streptococcus co-infection",
        "correct": false,
        "explanation": "Incorrect. Her rapid strep test was negative, and her overall presentation (posterior cervical adenopathy, splenomegaly, profound fatigue) fits mononucleosis, not scarlet fever."
      },
      {
        "label": "D",
        "text": "Disseminated gonococcal infection",
        "correct": false,
        "explanation": "Incorrect. No joint findings or relevant sexual exposure history are described, and this does not explain the temporal link to starting amoxicillin."
      },
      {
        "label": "E",
        "text": "A normal expected side effect of amoxicillin unrelated to her underlying illness",
        "correct": false,
        "explanation": "Incorrect. This specific rash is strongly linked to giving aminopenicillins during acute EBV infection, not a generic amoxicillin side effect seen at this rate in other patients."
      }
    ]),
    second_order_answer: "B",
    second_order_explanation:
      "This patient's clinical picture — severe pharyngitis, marked fatigue, posterior cervical/generalized lymphadenopathy, and splenomegaly, with a negative rapid strep test — is classic for infectious mononucleosis due to Epstein-Barr virus, which can mimic GAS pharyngitis on throat exam alone. A well-described phenomenon is the development of a diffuse maculopapular rash in patients with acute EBV infection who are given amoxicillin or ampicillin; this is not a true penicillin allergy but rather a transient, non-IgE-mediated reaction thought to relate to the immune dysregulation of acute EBV infection, and it does not predict future reactions to penicillins outside of active EBV infection. This case also illustrates why empiric antibiotics for pharyngitis without confirmatory testing can cause diagnostic confusion; confirming mononucleosis with a Monospot test or EBV serology is appropriate here.",

    flowchart_title: "Evaluating Acute Sore Throat",
    flowchart: JSON.stringify([
      {
        "node": "Patient with acute sore throat",
        "branches": [
          {
            "label": "Cough, rhinorrhea, conjunctivitis present (Centor-negative features)",
            "next": "Favor viral pharyngitis; supportive care, no antibiotics"
          },
          {
            "label": "Fever, tonsillar exudate, tender anterior cervical nodes, no cough (Centor-positive)",
            "next": "Test for group A Streptococcus (RADT ± culture)"
          }
        ]
      },
      {
        "node": "Rapid antigen test for GAS",
        "branches": [
          {
            "label": "Positive",
            "next": "Treat with penicillin V or amoxicillin x10 days"
          },
          {
            "label": "Negative (especially in child/adolescent)",
            "next": "Back-up throat culture; treat if positive"
          }
        ]
      },
      {
        "node": "Atypical features: profound fatigue, posterior cervical nodes, splenomegaly",
        "branches": [
          {
            "label": "Present",
            "next": "Suspect infectious mononucleosis; send Monospot/EBV serology, avoid amoxicillin/ampicillin empirically"
          },
          {
            "label": "Absent",
            "next": "Continue standard GAS/viral pathway"
          }
        ]
      },
      {
        "node": "Red flags: unilateral pain worsening, trismus, muffled voice, uvular deviation",
        "branches": [
          {
            "label": "Present",
            "next": "Suspect peritonsillar abscess; urgent ENT evaluation/drainage"
          },
          {
            "label": "Absent",
            "next": "Continue outpatient management"
          }
        ]
      }
    ]),
  },
  {
    module_number: 3,
    module_title: "Microbiology",
    key_submodule: "HIV/AIDS Opportunistic Infections",
    slug: "pneumocystis-jirovecii-pneumonia",
    title: "Pneumocystis jirovecii Pneumonia (PJP)",
    sort_order: 6,

    hook_vignette:
      "A 36-year-old man with HIV infection, who has not been taking antiretroviral therapy for the past year, presents with three weeks of progressively worsening dry cough and exertional dyspnea, along with low-grade fevers and unintentional weight loss. He appears mildly tachypneic at rest, and his oxygen saturation drops from 96% to 88% with ambulation. His most recent CD4 count, checked six months ago, was 140 cells/mm3.",

    ddx_mapping:
      "Pneumocystis jirovecii pneumonia (PJP) classically occurs in HIV-infected patients with a CD4 count <200 cells/mm3 (or <14%) who are not on antiretroviral therapy or PJP prophylaxis, and presents subacutely over weeks with a dry cough, progressive exertional dyspnea, low-grade fever, and a characteristic finding of hypoxemia/desaturation that is disproportionate to a relatively clear-sounding lung exam and even a near-normal-appearing chest x-ray early in the disease; classic chest imaging later shows diffuse, bilateral, symmetric ground-glass or interstitial infiltrates.\nBacterial community-acquired pneumonia (still the most common cause of pneumonia even in HIV-positive patients, occurring across the CD4 spectrum) presents more acutely (days, not weeks) with a productive cough, higher fever, and often a focal lobar consolidation on imaging rather than diffuse bilateral ground-glass infiltrates.\nPulmonary tuberculosis can occur at any CD4 count in HIV-infected patients (though disseminated/atypical presentations become more common at lower CD4 counts) and should be suspected with a subacute course, night sweats, hemoptysis, and upper-lobe infiltrates or cavitation, particularly with relevant exposure history; it requires airborne isolation and AFB smear/culture or NAAT, distinct from PJP's diffuse pattern.\nCMV pneumonitis is a distinctly lower-CD4 (<50 cells/mm3) opportunistic infection, often coexisting with other CMV end-organ disease (retinitis, colitis), and is distinguished on bronchoalveolar lavage by characteristic cytomegalic cells with intranuclear/intracytoplasmic inclusions rather than the cystic forms seen with PJP.\nKaposi sarcoma with pulmonary involvement can also cause dyspnea and abnormal chest imaging in advanced HIV, but is typically accompanied by characteristic violaceous cutaneous/mucosal lesions and nodular (rather than diffuse ground-glass) pulmonary infiltrates, with bronchoscopy showing characteristic reddish-purple endobronchial lesions.",

    diagnostic_evaluation:
      "Chest x-ray classically shows diffuse, bilateral, symmetric interstitial or ground-glass infiltrates radiating from the hila, though it can be normal early in the disease course; high-resolution CT is more sensitive and shows ground-glass opacities even when the chest x-ray is unremarkable.\nAn elevated serum (1→3)-beta-D-glucan is a sensitive (though not specific) supportive marker, since Pneumocystis has beta-D-glucan in its cell wall; a markedly elevated LDH is also a nonspecific but classic supportive lab finding correlating with the degree of lung injury.\nDefinitive diagnosis requires visualizing the organism, most often via induced sputum or bronchoalveolar lavage with methenamine silver, Giemsa, or direct fluorescent antibody staining showing characteristic cystic or trophic forms — sputum/BAL PCR is also increasingly used given higher sensitivity, though it cannot distinguish colonization from true infection as reliably as staining in some contexts.\nArterial blood gas helps grade severity: an A-a gradient ≥35 mmHg or a room-air PaO2 <70 mmHg defines moderate-to-severe disease, which changes management by adding adjunctive corticosteroids.",

    management:
      "First-line treatment is trimethoprim-sulfamethoxazole (TMP-SMX) for 21 days, typically IV for more severe disease and transitioning to oral as the patient improves; for patients with a sulfa allergy or intolerance, alternatives include IV pentamidine, clindamycin plus primaquine, atovaquone (for mild-moderate disease), or dapsone plus TMP.\nAdjunctive corticosteroids (typically prednisone, tapered over about three weeks) are started as early as possible (within 72 hours) in moderate-to-severe disease (A-a gradient ≥35 mmHg or PaO2 <70 mmHg on room air), since they reduce the risk of respiratory failure and death from the inflammatory response that follows initial organism killing.\nPrimary/secondary prophylaxis with TMP-SMX (or an alternative such as dapsone, atovaquone, or aerosolized pentamidine if sulfa-intolerant) is indicated for any HIV-infected patient with a CD4 count <200 cells/mm3 (or a prior AIDS-defining illness, or CD4 <14%), and can be discontinued once antiretroviral therapy has raised the CD4 count above 200 cells/mm3 for at least three months.\nAntiretroviral therapy is typically started within about two weeks of beginning PJP treatment (rather than delayed), since earlier ART initiation in most opportunistic infections (with the notable exception of active untreated cryptococcal or tuberculous meningitis, where ART is delayed to avoid IRIS-related mortality) improves outcomes.",

    first_order_prompt:
      "At what CD4 count threshold should prophylaxis against Pneumocystis jirovecii pneumonia be started in an HIV-infected patient?",
    first_order_answer:
      "CD4 count <200 cells/mm3 (or CD4 <14%, or a prior AIDS-defining illness) — first-line prophylaxis is trimethoprim-sulfamethoxazole.",

    second_order_vignette:
      "A 41-year-old woman with AIDS (last known CD4 count 60 cells/mm3, not on antiretroviral therapy or any prophylaxis) presents with two weeks of dry cough and worsening dyspnea. Room-air arterial blood gas shows a PaO2 of 58 mmHg and an elevated A-a gradient. Chest CT shows diffuse bilateral ground-glass opacities. Bronchoalveolar lavage with methenamine silver stain confirms Pneumocystis jirovecii pneumonia. She has a documented history of a severe anaphylactic reaction to sulfa drugs.",
    second_order_question:
      "In addition to an alternative first-line antibiotic regimen, which of the following should also be included in this patient's initial management?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "Adjunctive corticosteroids, started promptly, because her room-air PaO2 is below 70 mmHg",
        "correct": true,
        "explanation": "Correct. She meets criteria for moderate-to-severe PJP (PaO2 <70 mmHg, elevated A-a gradient), so adjunctive corticosteroids should be started as early as possible (ideally within 72 hours) regardless of which antimicrobial regimen is used, to reduce the risk of respiratory failure and death."
      },
      {
        "label": "B",
        "text": "Delay of antiretroviral therapy until PJP treatment is fully completed in three weeks",
        "correct": false,
        "explanation": "Incorrect. ART is generally started within about two weeks of starting PJP treatment, not delayed to full completion; PJP is not one of the opportunistic infections where early ART is specifically avoided."
      },
      {
        "label": "C",
        "text": "Desensitization to sulfa drugs so that TMP-SMX can still be used as first-line therapy",
        "correct": false,
        "explanation": "Incorrect. With a history of anaphylaxis to sulfa drugs, an alternative agent (e.g., IV pentamidine, clindamycin-primaquine) should be used rather than attempting desensitization/rechallenge with TMP-SMX in this acute severe setting."
      },
      {
        "label": "D",
        "text": "Withholding corticosteroids to avoid worsening her immunosuppression",
        "correct": false,
        "explanation": "Incorrect. Corticosteroids are specifically indicated here given her hypoxemia, and this benefit outweighs the theoretical immunosuppression concern in treated PJP."
      },
      {
        "label": "E",
        "text": "Empiric addition of antituberculous therapy given her low CD4 count",
        "correct": false,
        "explanation": "Incorrect. There is no clinical or radiographic evidence supporting tuberculosis here (diffuse ground-glass rather than cavitary/upper-lobe disease, and the organism is already confirmed as Pneumocystis), so empiric TB therapy is not indicated without supporting evidence."
      }
    ]),
    second_order_answer: "A",
    second_order_explanation:
      "This patient meets criteria for moderate-to-severe PJP (room-air PaO2 <70 mmHg and an elevated A-a gradient), so adjunctive corticosteroids should be started as early as possible — ideally within 72 hours of starting anti-Pneumocystis therapy — regardless of which antimicrobial regimen is used, since they reduce the risk of respiratory failure and death from the inflammatory response to organism killing. Because of her sulfa anaphylaxis history, IV pentamidine or clindamycin plus primaquine would be reasonable alternatives to TMP-SMX. Antiretroviral therapy should generally still be started within about two weeks of beginning PJP treatment rather than delayed to completion, since PJP is not one of the opportunistic infections (unlike active cryptococcal or tuberculous meningitis) where early ART is specifically avoided.",

    flowchart_title: "Dyspnea and Hypoxia in an HIV-Positive Patient",
    flowchart: JSON.stringify([
      {
        "node": "HIV-positive patient with subacute dyspnea, dry cough, low-grade fever",
        "branches": [
          {
            "label": "CD4 <200, no prophylaxis, diffuse bilateral ground-glass infiltrates",
            "next": "Suspect PJP; obtain induced sputum/BAL stain or PCR, LDH, (1→3)-beta-D-glucan"
          },
          {
            "label": "Focal lobar consolidation, acute productive cough",
            "next": "Suspect bacterial CAP; treat per standard CAP guidelines"
          }
        ]
      },
      {
        "node": "Suspected PJP - assess severity via room-air ABG",
        "branches": [
          {
            "label": "PaO2 <70 mmHg or A-a gradient ≥35 mmHg",
            "next": "Moderate-severe: TMP-SMX + adjunctive corticosteroids (start within 72h)"
          },
          {
            "label": "PaO2 ≥70 mmHg, A-a gradient <35 mmHg",
            "next": "Mild disease: TMP-SMX (or atovaquone) alone, no steroids needed"
          }
        ]
      },
      {
        "node": "Sulfa allergy present?",
        "branches": [
          {
            "label": "Yes (especially severe/anaphylactic)",
            "next": "Use IV pentamidine or clindamycin + primaquine instead of TMP-SMX"
          },
          {
            "label": "No",
            "next": "TMP-SMX remains first-line"
          }
        ]
      },
      {
        "node": "After acute PJP treatment initiated",
        "branches": [
          {
            "label": "CD4 remains <200 or prior AIDS-defining illness",
            "next": "Continue/start TMP-SMX secondary prophylaxis; start ART within ~2 weeks"
          },
          {
            "label": "CD4 rises >200 for ≥3 months on ART",
            "next": "Prophylaxis can be safely discontinued"
          }
        ]
      }
    ]),
  },
  {
    module_number: 3,
    module_title: "Microbiology",
    key_submodule: "Dysuria",
    slug: "uncomplicated-cystitis-e-coli",
    title: "Uncomplicated Cystitis (Escherichia coli)",
    sort_order: 7,

    hook_vignette:
      "A 27-year-old otherwise healthy, nonpregnant woman presents with one day of burning with urination, urinary frequency, and urgency. She denies fever, chills, flank pain, or vaginal discharge. She has no history of urinary tract abnormalities and is currently sexually active.",

    ddx_mapping:
      "Uncomplicated cystitis (most commonly Escherichia coli, followed by Staphylococcus saprophyticus and Klebsiella pneumoniae) presents with dysuria, urinary frequency/urgency, and suprapubic discomfort, without fever, flank pain, nausea/vomiting, or systemic toxicity, in a healthy, nonpregnant woman with a structurally/functionally normal urinary tract.\nAcute pyelonephritis presents with the same lower urinary tract symptoms plus fever, chills, flank pain, and costovertebral angle tenderness, reflecting upper urinary tract (renal) involvement, and requires a longer antibiotic course and sometimes imaging/hospitalization depending on severity.\nVaginitis/cervicitis (Candida, bacterial vaginosis, or sexually transmitted Chlamydia/gonorrhea) can cause external dysuria (pain as urine passes over inflamed labia) rather than the internal, throughout-the-stream dysuria of cystitis, and is typically accompanied by vaginal discharge, odor, itching, or pelvic/cervical motion tenderness on exam rather than isolated urinary frequency/urgency.\nUrethritis (from Chlamydia trachomatis or Neisseria gonorrhoeae) causes dysuria, often with mucopurulent urethral discharge, and should be suspected especially in younger sexually active patients with new/multiple partners; urinalysis may show pyuria without a positive standard urine culture (since these organisms don't grow on routine culture media), prompting NAAT testing.\nInterstitial cystitis (bladder pain syndrome) is a chronic, noninfectious condition with urinary frequency/urgency and bladder/pelvic pain, distinguished from acute infectious cystitis by a negative urine culture and a more chronic/relapsing course, often requiring cystoscopy and other criteria to diagnose after infection has been excluded.",

    diagnostic_evaluation:
      "In an otherwise healthy, nonpregnant woman with classic symptoms (dysuria, frequency, urgency, without vaginal discharge/irritation) and no complicating factors, the diagnosis of uncomplicated cystitis can often be made clinically, without urinalysis or culture, given the very high pretest probability.\nWhen testing is done, urinalysis typically shows pyuria (WBCs) and bacteriuria, often with positive leukocyte esterase and nitrites (nitrites specifically suggest a nitrate-reducing organism such as E. coli); urine culture is not routinely needed for a first, uncomplicated episode but should be obtained for recurrent infections, treatment failure, pregnancy, suspected pyelonephritis, or other complicating factors (male sex, indwelling catheter, urologic abnormality, immunosuppression, recent instrumentation).\nA urine culture growing ≥10^5 CFU/mL of a single uropathogen (or a lower threshold, ~10^2-10^3 CFU/mL, in a symptomatic patient with a compatible urinalysis) confirms the diagnosis and identifies susceptibilities when culture is obtained.\nPregnancy testing should be considered in any woman of reproductive age with urinary symptoms, both because pregnancy changes the complicated/uncomplicated categorization and because it changes antibiotic choice.",

    management:
      "First-line antibiotic options for uncomplicated cystitis include nitrofurantoin for 5 days, trimethoprim-sulfamethoxazole for 3 days (if local E. coli resistance is <20%), or fosfomycin as a single dose; fluoroquinolones are effective but generally reserved as second-line given resistance concerns and their broader side-effect profile.\nSymptomatic therapy with a urinary analgesic (phenazopyridine) can be added short-term for dysuria relief but does not treat the underlying infection and should not be continued beyond a couple of days (it can mask ongoing symptoms and stains urine/other fluids orange).\nPregnant patients require different antibiotic choices (e.g., nitrofurantoin, cephalexin, or amoxicillin-clavulanate depending on trimester/local practice, avoiding sulfa near term and avoiding fluoroquinolones and tetracyclines throughout pregnancy) and should always have a urine culture sent, since even asymptomatic bacteriuria is treated in pregnancy given its association with pyelonephritis and preterm labor.\nRecurrent uncomplicated cystitis (≥2 infections in 6 months or ≥3 in a year) can be managed with patient-initiated self-treatment at symptom onset, postcoital prophylaxis if temporally related to intercourse, or continuous low-dose prophylaxis, alongside behavioral counseling (adequate hydration, voiding after intercourse).",

    first_order_prompt:
      "What is the most common causative organism of uncomplicated cystitis in otherwise healthy women?",
    first_order_answer:
      "Escherichia coli (accounting for roughly 75-90% of cases), followed by Staphylococcus saprophyticus and Klebsiella pneumoniae.",

    second_order_vignette:
      "A 30-year-old woman at 22 weeks of pregnancy presents with two days of dysuria and urinary frequency. She denies fever, flank pain, or nausea. Vital signs are normal. Urinalysis shows 20-30 WBCs/hpf, positive leukocyte esterase, and positive nitrites. Urine culture is pending.",
    second_order_question:
      "Which of the following is the most appropriate next step in management?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "Start empiric nitrofurantoin while awaiting urine culture results",
        "correct": true,
        "explanation": "Correct. Symptomatic cystitis in pregnancy should be treated empirically without waiting for culture confirmation, given the elevated risk of ascending infection; nitrofurantoin is a reasonable first-line choice away from term, while a culture is still sent to confirm the organism/susceptibilities."
      },
      {
        "label": "B",
        "text": "Withhold antibiotics until the urine culture confirms growth of a specific organism",
        "correct": false,
        "explanation": "Incorrect. Treatment should not be delayed for symptomatic cystitis in pregnancy given the risk of ascending infection/pyelonephritis."
      },
      {
        "label": "C",
        "text": "Start empiric ciprofloxacin, a highly effective first-line option for cystitis",
        "correct": false,
        "explanation": "Incorrect. Fluoroquinolones are avoided throughout pregnancy due to concerns about fetal cartilage/musculoskeletal toxicity."
      },
      {
        "label": "D",
        "text": "Reassure the patient that these findings are expected in pregnancy and no treatment is needed",
        "correct": false,
        "explanation": "Incorrect. Symptomatic cystitis (and even asymptomatic bacteriuria) is treated in pregnancy given the elevated risk of progression to pyelonephritis and adverse pregnancy outcomes."
      },
      {
        "label": "E",
        "text": "Start empiric trimethoprim-sulfamethoxazole, which is safe throughout all trimesters of pregnancy",
        "correct": false,
        "explanation": "Incorrect. TMP-SMX carries specific risks (folate antagonism/neural tube concerns in the first trimester, kernicterus risk near term) and is generally avoided at those times, making it a less universally \"safe\" choice than this answer claims."
      }
    ]),
    second_order_answer: "A",
    second_order_explanation:
      "This patient has symptomatic cystitis in pregnancy, which should always be treated with empiric antibiotics rather than awaiting culture confirmation, because untreated urinary tract infection in pregnancy carries an elevated risk of ascending to pyelonephritis and is associated with adverse outcomes such as preterm labor. Nitrofurantoin (avoided only very close to term, due to a theoretical neonatal hemolysis risk) or a beta-lactam such as cephalexin are reasonable first-line choices in pregnancy; fluoroquinolones are avoided throughout pregnancy, and trimethoprim-sulfamethoxazole carries specific trimester-dependent risks. A urine culture should still be sent in pregnancy (even though empiric treatment starts immediately) to confirm the organism and susceptibilities, and because even asymptomatic bacteriuria warrants treatment in this population.",

    flowchart_title: "Approach to Dysuria in a Woman",
    flowchart: JSON.stringify([
      {
        "node": "Dysuria in a nonpregnant woman",
        "branches": [
          {
            "label": "Frequency/urgency, no vaginal discharge, no fever/flank pain",
            "next": "Classic uncomplicated cystitis; treat empirically ± UA"
          },
          {
            "label": "Vaginal discharge/itching/odor present",
            "next": "Consider vaginitis/cervicitis; exam ± NAAT for STIs"
          },
          {
            "label": "Fever, flank pain, CVA tenderness",
            "next": "Consider pyelonephritis; send urine culture, treat accordingly"
          }
        ]
      },
      {
        "node": "Complicating factors present?",
        "branches": [
          {
            "label": "Pregnancy, male sex, recurrent infection, urologic abnormality, catheter",
            "next": "Treat as complicated UTI; always send urine culture"
          },
          {
            "label": "None (healthy, nonpregnant woman)",
            "next": "Uncomplicated cystitis pathway; culture not required for first episode"
          }
        ]
      },
      {
        "node": "Empiric antibiotic choice",
        "branches": [
          {
            "label": "Not pregnant, no contraindication",
            "next": "Nitrofurantoin x5d, TMP-SMX x3d, or fosfomycin x1 dose"
          },
          {
            "label": "Pregnant",
            "next": "Nitrofurantoin or cephalexin (avoid fluoroquinolones; avoid TMP-SMX/sulfa near term/1st trimester)"
          }
        ]
      }
    ]),
  },
  {
    module_number: 3,
    module_title: "Microbiology",
    key_submodule: "Infectious Diarrhea",
    slug: "enterohemorrhagic-e-coli-o157h7",
    title: "Enterohemorrhagic E. coli (EHEC O157:H7) Infection",
    sort_order: 8,

    hook_vignette:
      "A 6-year-old girl develops crampy abdominal pain and watery diarrhea three days after eating undercooked ground beef at a family barbecue. Over the next day the diarrhea becomes grossly bloody, though she remains afebrile. Her parents are told at urgent care not to give her any antidiarrheal or antibiotic medication and to watch closely for decreased urine output.",

    ddx_mapping:
      "Enterohemorrhagic E. coli (EHEC, classically serotype O157:H7) causes a noninflammatory-appearing prodrome of watery diarrhea and cramping that progresses to grossly bloody diarrhea over 1-3 days, typically without high fever, following ingestion of undercooked ground beef, unpasteurized milk/juice, or contaminated produce; its Shiga toxin, once absorbed, can cause hemolytic uremic syndrome (HUS) roughly 5-10 days after symptom onset, particularly in young children, making avoidance of antibiotics and antimotility agents critical since both increase toxin release and HUS risk.\nShigella causes an inflammatory (dysenteric) diarrhea with high fever, tenesmus, and small-volume bloody, mucoid stools, often with more prominent systemic toxicity/abdominal pain than EHEC and a lower infectious dose (person-to-person spread common); unlike EHEC, antibiotics (e.g., azithromycin or a fluoroquinolone) are indicated for shigellosis to shorten illness and limit spread.\nCampylobacter jejuni, typically from undercooked poultry or unpasteurized milk, causes an inflammatory diarrhea (often bloody) with fever and severe abdominal pain that can mimic appendicitis, and is the infectious diarrhea most classically associated with subsequent Guillain-Barré syndrome (as well as reactive arthritis); it is usually self-limited, with antibiotics (azithromycin) reserved for severe or prolonged cases.\nSalmonella (non-typhoidal) causes inflammatory diarrhea, often with fever, following exposure to poultry, eggs, or reptiles, is usually self-limited in healthy hosts (antibiotics are generally avoided as they can prolong carriage, except in infants, the elderly, or immunocompromised/bacteremic patients), and does not carry the same HUS association that EHEC does (though it can rarely occur).\nClostridioides difficile colitis should be suspected with watery-to-bloody diarrhea developing during or after antibiotic exposure (especially clindamycin, fluoroquinolones, cephalosporins), diagnosed by stool toxin/PCR testing rather than the food-exposure history that points toward EHEC.",

    diagnostic_evaluation:
      "Stool culture with specific request for sorbitol-MacConkey agar (or equivalent) is used to distinguish O157:H7, which characteristically does not ferment sorbitol, from most other (sorbitol-fermenting) E. coli strains; stool PCR/multiplex GI panels for Shiga toxin genes (stx1/stx2) are increasingly used and can also detect non-O157 Shiga toxin-producing strains that sorbitol-MacConkey screening would miss.\nA CBC, peripheral smear, basic metabolic panel, and LDH/haptoglobin should be monitored closely (even before overt renal failure develops) in any child with suspected EHEC, to catch the earliest laboratory signs of hemolytic uremic syndrome: microangiopathic hemolytic anemia (schistocytes on smear, low haptoglobin, elevated LDH), thrombocytopenia, and rising creatinine.\nStool studies should also be sent for routine bacterial culture (to evaluate for Shigella, Salmonella, Campylobacter) and, if there is recent antibiotic exposure, C. difficile toxin/PCR, since the differential for bloody diarrhea is broad and exposure history alone is not always sufficient to narrow it.\nBlood cultures are not routinely useful for uncomplicated EHEC gastroenteritis (it is not typically a bacteremic illness) but should be considered if the patient appears systemically ill or if an alternative invasive pathogen (e.g., Salmonella bacteremia) is being considered.",

    management:
      "Management of EHEC infection is primarily supportive: aggressive isotonic IV fluid hydration (some evidence supports this specifically reducing the risk/severity of subsequent HUS by maintaining renal perfusion), electrolyte monitoring/correction, and close monitoring of renal function and hematologic parameters for early signs of HUS.\nAntibiotics are specifically avoided in suspected or confirmed EHEC infection, because killing the bacteria can trigger a burst release of preformed Shiga toxin, increasing the risk of developing HUS; antimotility agents (e.g., loperamide) are likewise avoided, as they can prolong toxin exposure/absorption in the gut.\nIf hemolytic uremic syndrome develops (thrombocytopenia, microangiopathic hemolytic anemia, acute kidney injury), management shifts to supportive care for HUS: careful fluid/electrolyte management, blood product transfusion as needed (red cells for symptomatic anemia; platelet transfusion is generally avoided unless active bleeding or a procedure is planned, since it may worsen microthrombosis), and renal replacement therapy (dialysis) if renal failure is severe; most children recover renal function, though some develop chronic kidney disease.\nPrevention centers on food safety: thoroughly cooking ground beef to an internal temperature that kills the organism, avoiding unpasteurized dairy/juice, and careful hand hygiene, particularly around young children and petting zoos/farm animal exposure, which are also recognized transmission routes.",

    first_order_prompt:
      "Why are antibiotics and antimotility agents specifically avoided in suspected enterohemorrhagic E. coli (EHEC) infection?",
    first_order_answer:
      "Because both can increase the risk of hemolytic uremic syndrome — antibiotics by killing bacteria and triggering a surge release of preformed Shiga toxin, and antimotility agents by prolonging gut transit time and toxin absorption.",

    second_order_vignette:
      "A 4-year-old boy is brought to the emergency department eight days after an episode of bloody diarrhea that has since resolved. His parents report he now appears pale, lethargic, and has not urinated in over 12 hours. Exam reveals scattered petechiae and mild periorbital edema. Labs show hemoglobin 7.2 g/dL, platelet count 38,000/mm3, creatinine 2.4 mg/dL (baseline unknown but presumed normal), and peripheral smear shows numerous schistocytes.",
    second_order_question:
      "Which of the following is the most appropriate next step in this patient's management?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "Platelet transfusion to correct the severe thrombocytopenia before it causes spontaneous bleeding",
        "correct": false,
        "explanation": "Incorrect. Platelet transfusion is generally avoided in HUS unless there is active significant bleeding or an invasive procedure is planned, since transfused platelets may worsen ongoing microvascular thrombosis."
      },
      {
        "label": "B",
        "text": "Supportive care with careful fluid/electrolyte management, red cell transfusion for symptomatic anemia, and evaluation for renal replacement therapy",
        "correct": true,
        "explanation": "Correct. This triad of microangiopathic hemolytic anemia, thrombocytopenia, and acute kidney injury about a week after bloody diarrhea is classic postdiarrheal HUS, which is managed supportively — fluids/electrolytes, red cell transfusion as needed, and dialysis if renal failure is significant."
      },
      {
        "label": "C",
        "text": "Empiric IV ciprofloxacin to treat the presumed ongoing bacterial infection",
        "correct": false,
        "explanation": "Incorrect. Antibiotics are avoided in EHEC-associated illness and HUS, and there is no indication for antibiotics at this post-diarrheal HUS stage."
      },
      {
        "label": "D",
        "text": "Plasma exchange (plasmapheresis) as first-line therapy, as used in thrombotic thrombocytopenic purpura",
        "correct": false,
        "explanation": "Incorrect. Plasma exchange is the treatment for TTP (typically from ADAMTS13 deficiency), not for typical Shiga toxin-mediated HUS, which is managed supportively."
      },
      {
        "label": "E",
        "text": "Reassurance and outpatient follow-up, since his diarrhea has already resolved and this is likely a separate unrelated process",
        "correct": false,
        "explanation": "Incorrect. This presentation is classic for HUS following EHEC infection and requires urgent inpatient management, not outpatient reassurance."
      }
    ]),
    second_order_answer: "B",
    second_order_explanation:
      "This child's triad of microangiopathic hemolytic anemia (anemia with schistocytes), thrombocytopenia, and acute kidney injury, occurring roughly a week after an episode of bloody diarrhea, is the classic presentation of hemolytic uremic syndrome following EHEC (Shiga toxin-producing E. coli) infection. Management is supportive: careful fluid and electrolyte management, transfusion of red cells for symptomatic anemia, and renal replacement therapy (dialysis) if renal failure is significant. Platelet transfusion is generally withheld unless there is active bleeding or an invasive procedure is needed, because transfused platelets can be consumed in ongoing microthrombosis and may theoretically worsen the process. Plasma exchange is reserved for atypical HUS or TTP, not typical postdiarrheal Shiga-toxin-mediated HUS.",

    flowchart_title: "Bloody Diarrhea Evaluation and EHEC/HUS Recognition",
    flowchart: JSON.stringify([
      {
        "node": "Patient with diarrhea after a food/exposure history",
        "branches": [
          {
            "label": "Undercooked ground beef/unpasteurized dairy, watery→bloody, afebrile",
            "next": "Suspect EHEC O157:H7; send stool culture (sorbitol-MacConkey) + Shiga toxin PCR"
          },
          {
            "label": "High fever, tenesmus, small-volume bloody stool",
            "next": "Suspect Shigella; treat with antibiotics (azithromycin/fluoroquinolone)"
          },
          {
            "label": "Undercooked poultry, fever, severe cramping mimicking appendicitis",
            "next": "Suspect Campylobacter jejuni; consider antibiotics only if severe/prolonged"
          }
        ]
      },
      {
        "node": "EHEC suspected/confirmed",
        "branches": [
          {
            "label": "Uncomplicated gastroenteritis",
            "next": "Supportive IV hydration; explicitly avoid antibiotics and antimotility agents"
          },
          {
            "label": "5-10 days later: pallor, decreased urine output, petechiae",
            "next": "Evaluate for hemolytic uremic syndrome (CBC/smear, LDH, haptoglobin, creatinine)"
          }
        ]
      },
      {
        "node": "HUS labs (schistocytes, thrombocytopenia, rising creatinine)",
        "branches": [
          {
            "label": "Confirmed HUS",
            "next": "Supportive care: fluids/electrolytes, RBC transfusion PRN, dialysis if severe AKI; avoid platelet transfusion unless bleeding"
          },
          {
            "label": "Labs normal, no HUS developing",
            "next": "Continue supportive monitoring through recovery"
          }
        ]
      }
    ]),
  },
];

// ---------------------------------------------------------------------------
// Insert
// ---------------------------------------------------------------------------

async function upsertClinicalTopics(supabase) {
  const rows = CLINICAL_TOPICS.map((t) => ({
    module_number: t.module_number,
    module_title: t.module_title,
    key_submodule: t.key_submodule,
    slug: t.slug,
    title: t.title,
    sort_order: t.sort_order,
    hook_vignette: t.hook_vignette,
    ddx_mapping: t.ddx_mapping,
    diagnostic_evaluation: t.diagnostic_evaluation,
    management: t.management,
    first_order_prompt: t.first_order_prompt,
    first_order_answer: t.first_order_answer,
    second_order_vignette: t.second_order_vignette,
    second_order_question: t.second_order_question,
    second_order_choices: JSON.parse(t.second_order_choices),
    second_order_answer: t.second_order_answer,
    second_order_explanation: t.second_order_explanation,
    flowchart_title: t.flowchart_title,
    flowchart: JSON.parse(t.flowchart),
  }));

  const { data, error } = await supabase.from('clinical_topics').upsert(rows, { onConflict: 'slug' }).select();
  if (error) throw error;
  console.log(`Upserted ${data.length} clinical_topics row(s).`);
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
  console.log('Seeding clinical_topics...');
  await upsertClinicalTopics(supabase);
  console.log('Done.');
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}

module.exports = { CLINICAL_TOPICS, upsertClinicalTopics };
