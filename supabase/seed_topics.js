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

  {
    module_number: 2,
    module_title: 'Immunology',
    key_submodule: 'Primary Immunodeficiencies',
    slug: 'selective-iga-deficiency',
    title: 'Selective IgA Deficiency',
    sort_order: 5,

    hook_vignette:
      'A 19-year-old college student is evaluated for recurrent sinus infections (four episodes in the past year) and two bouts of unexplained watery diarrhea that resolved with metronidazole; stool studies at the time grew Giardia lamblia. She reports that during a prior hospitalization for an appendectomy, she developed sudden facial flushing, wheezing, and hypotension partway through a blood transfusion, which was stopped immediately. She has otherwise been generally healthy.',

    ddx_mapping:
      'Selective IgA deficiency vs. common variable immunodeficiency (CVID): IgA deficiency shows an ISOLATED low/absent serum IgA with normal IgG and IgM, and most patients are asymptomatic; CVID shows low IgG plus low IgA and/or IgM (not isolated), with B cells present but failing to mature into plasma cells, and a higher rate of granulomatous disease, autoimmunity, and lymphoma.\n' +
      'Selective IgA deficiency vs. X-linked agammaglobulinemia: XLA shows ALL immunoglobulin isotypes low with absent B cells, presents in infancy, and affects only males; IgA deficiency can present at any age and B cells are normal.\n' +
      'Selective IgA deficiency vs. normal population variation: a single mildly low IgA value in an otherwise healthy adult without recurrent infections or a prior reaction history, with normal IgG/IgM, may simply reflect assay/individual variability rather than clinically significant deficiency — repeat testing and clinical correlation matter.\n' +
      'Selective IgA deficiency vs. secondary IgA deficiency: certain medications (e.g., antiepileptics, sulfasalazine) and conditions can transiently lower IgA; a thorough medication history helps distinguish a secondary, potentially reversible cause from the primary (usually lifelong) disorder.',

    diagnostic_evaluation:
      'Quantitative serum immunoglobulins showing low or undetectable IgA with normal IgG and IgM, confirming an isolated pattern (distinguishing it from CVID).\n' +
      'If gastrointestinal symptoms or malabsorption are present, use an IgG-based celiac serology panel (e.g., IgG-deamidated gliadin peptide) rather than the standard IgA-based tissue transglutaminase antibody test, which is unreliable in a patient who cannot make IgA in the first place.\n' +
      'No B- or T-cell flow cytometry abnormality is expected — a normal lymphocyte flow panel helps distinguish this from XLA or SCID.\n' +
      'In any patient with a history concerning for an anaphylactoid reaction to blood products or IVIG, test for anti-IgA antibodies before any future transfusion or immunoglobulin administration is planned.',

    management:
      'Most patients require no specific treatment beyond prompt management of infections as they arise; routine antibiotic prophylaxis is not indicated unless infections are frequent or severe.\n' +
      'IVIG is NOT indicated for isolated IgA deficiency itself, and standard IVIG is relatively contraindicated in a patient with known anti-IgA antibodies and a prior reaction, since it still contains IgA and can trigger anaphylaxis; reserve immunoglobulin replacement for patients whose antibody deficiency broadens over time (evolving toward a CVID-like picture) with recurrent serious infection.\n' +
      'For a patient with a history of a transfusion or IVIG reaction, use washed or IgA-depleted red blood cell products, and an IgA-depleted immunoglobulin preparation if IVIG ever becomes necessary.\n' +
      'Screen for and monitor associated autoimmune disease (celiac disease, systemic lupus erythematosus, rheumatoid arthritis), which occur at increased frequency, and note that IgA deficiency can co-occur with CVID within the same family, so relatives with recurrent infections may warrant their own immunoglobulin screening.',

    first_order_prompt:
      'A patient\'s immunoglobulin panel shows an isolated, markedly low IgA with normal IgG and IgM. What is the diagnosis, and what precaution should be flagged before any future blood transfusion or IVIG administration?',
    first_order_answer:
      'Selective IgA deficiency; flag the chart for a risk of anaphylactic transfusion/IVIG reaction from anti-IgA antibodies, and use washed or IgA-depleted blood products (and an IgA-depleted immunoglobulin preparation if IVIG is ever needed) if any reaction history is present.',

    second_order_vignette:
      'A 26-year-old man with a history of recurrent sinusitis and one prior episode of anaphylaxis during a platelet transfusion presents for elective surgery expected to require blood transfusion. Preoperative immunoglobulin studies confirm undetectable IgA with normal IgG and IgM.',
    second_order_question:
      'Which of the following is the most appropriate step to reduce this patient\'s risk during the planned transfusion?',
    second_order_choices: JSON.stringify([
      {
        label: 'A',
        text: 'Administer standard packed red blood cells with premedication (diphenhydramine and acetaminophen) only',
        correct: false,
        explanation:
          'Premedication reduces the risk of typical febrile/allergic transfusion reactions but does not address anti-IgA-antibody-mediated anaphylaxis, which requires an IgA-free product rather than premedication alone.',
      },
      {
        label: 'B',
        text: 'Use washed or IgA-depleted blood products for the transfusion',
        correct: true,
        explanation:
          'Correct. Removing donor plasma IgA (by washing cellular components or using IgA-depleted products) eliminates the antigen that anti-IgA antibodies react against, preventing anaphylaxis in a sensitized patient.',
      },
      {
        label: 'C',
        text: 'Administer prophylactic standard IVIG before the transfusion',
        correct: false,
        explanation:
          'Standard IVIG itself contains IgA and could trigger the same anaphylactic reaction in a patient with anti-IgA antibodies; it does not prevent a transfusion reaction here.',
      },
      {
        label: 'D',
        text: 'Proceed with a standard transfusion, since the prior reaction was most likely unrelated',
        correct: false,
        explanation:
          'A clear reaction history in a patient now confirmed to have selective IgA deficiency is a well-established risk factor that should not be dismissed.',
      },
      {
        label: 'E',
        text: 'Delay surgery indefinitely until anti-IgA antibody titers become undetectable',
        correct: false,
        explanation:
          'Anti-IgA antibodies do not reliably disappear over time, and delaying necessary surgery indefinitely is impractical; using appropriately prepared (washed/IgA-depleted) products allows safe, timely transfusion instead.',
      },
    ]),
    second_order_answer: 'B',
    second_order_explanation:
      'A patient with selective IgA deficiency and a prior anaphylactoid reaction to a blood product most likely has anti-IgA antibodies, which react against donor IgA present in standard blood components and immunoglobulin preparations. The appropriate mitigation is to remove that antigen from the product itself — washed red cells/platelets or IgA-depleted preparations — rather than relying on premedication, avoiding transfusion altogether, or using standard IVIG (which contains the same triggering antigen).',

    flowchart_title: 'Evaluating IgA Deficiency and Transfusion Risk',
    flowchart: JSON.stringify([
      {
        node: 'Recurrent sinopulmonary/GI infections OR an unexplained anaphylactoid transfusion reaction',
        branches: [
          {
            label: 'Isolated low IgA, normal IgG/IgM',
            next: 'Selective IgA deficiency',
          },
          {
            label: 'Low IgG plus low IgA and/or IgM, B cells present',
            next: 'Common variable immunodeficiency',
          },
          {
            label: 'All isotypes low, absent B cells, infancy onset',
            next: 'X-linked agammaglobulinemia',
          },
        ],
      },
      {
        node: 'Confirmed selective IgA deficiency — assess reaction history',
        branches: [
          {
            label: 'History of anaphylaxis with a blood product or IVIG',
            next: 'Anti-IgA antibodies likely — use washed/IgA-depleted products; avoid standard IVIG',
          },
          {
            label: 'No prior reaction, asymptomatic',
            next: 'No specific treatment needed; routine blood products acceptable',
          },
        ],
      },
      {
        node: 'Associated conditions to screen for',
        branches: [
          {
            label: 'Gastrointestinal symptoms',
            next: 'Use IgG-based celiac serology, not the standard IgA-based test',
          },
          {
            label: 'New autoimmune symptoms',
            next: 'Evaluate for SLE/other autoimmune disease; monitor for evolution toward a CVID-like picture',
          },
        ],
      },
    ]),
  },

  {
    module_number: 2,
    module_title: 'Immunology',
    key_submodule: 'Phagocyte Disorders',
    slug: 'chediak-higashi-syndrome',
    title: 'Chediak-Higashi Syndrome',
    sort_order: 6,

    hook_vignette:
      'A 2-year-old boy is brought in for evaluation of recurrent skin abscesses and two episodes of pneumonia since infancy. His parents note that his hair has an unusual silvery-blond sheen despite both parents having dark hair, and his skin is lighter than his siblings\'. On examination he has mild gait unsteadiness and decreased sensation in his feet. A complete blood count shows mild thrombocytopenia, and a peripheral smear is ordered.',

    ddx_mapping:
      'Chediak-Higashi syndrome vs. Griscelli syndrome: both cause partial albinism with possible immune dysfunction, but Chediak-Higashi shows giant cytoplasmic granules in leukocytes on peripheral smear (essentially pathognomonic), from a LYST mutation impairing phagolysosome fusion, while Griscelli syndrome (RAB27A or MYO5A mutations affecting melanosome/lytic granule transport) does NOT show giant granules.\n' +
      'Chediak-Higashi syndrome vs. Hermansky-Pudlak syndrome: Hermansky-Pudlak causes albinism plus a bleeding tendency (platelet storage pool defect) and pulmonary fibrosis, but no giant granules and infection is not a prominent feature, unlike Chediak-Higashi.\n' +
      'Chediak-Higashi syndrome vs. chronic granulomatous disease: CGD causes recurrent infection with catalase-positive organisms and granuloma formation from a NADPH oxidase defect (confirmed by a negative NBT/DHR test), but no albinism and no giant granules.\n' +
      'Chediak-Higashi syndrome vs. leukocyte adhesion deficiency: LAD causes recurrent infection WITHOUT pus formation (impaired neutrophil adhesion/extravasation) and delayed umbilical cord separation, with normal pigmentation, distinct from the albinism and giant-granule findings here.',

    diagnostic_evaluation:
      'Peripheral blood smear showing giant cytoplasmic granules in neutrophils, lymphocytes, and other granule-containing cells — the key diagnostic clue.\n' +
      'Genetic testing confirming a mutation in LYST (lysosomal trafficking regulator gene).\n' +
      'Hair shaft microscopy showing clumped, irregular melanin distribution, distinct from the fine, evenly distributed pigment of normal hair or the pattern seen in Griscelli syndrome.\n' +
      'CBC often shows mild thrombocytopenia and variable neutropenia; monitor closely for the accelerated (lymphoproliferative/hemophagocytic) phase — fever, hepatosplenomegaly, pancytopenia, and markedly elevated ferritin — which is life-threatening, can occur at any point in childhood, and is often triggered by a viral infection (commonly EBV).',

    management:
      'Aggressive, prompt treatment of bacterial infections as they arise.\n' +
      'The only curative therapy for the underlying immune defect is allogeneic hematopoietic stem cell transplantation, ideally performed before the accelerated phase develops; HSCT corrects the hematologic/immunologic manifestations but does not reverse the neurologic or pigmentary changes, which reflect non-hematopoietic cell involvement as well.\n' +
      'If the accelerated (hemophagocytic lymphohistiocytosis-like) phase develops, treat per HLH-directed protocols (e.g., etoposide-based chemo-immunotherapy with corticosteroids) as a bridge to transplant.\n' +
      'Genetic counseling for the family, given autosomal recessive inheritance (25% recurrence risk for future pregnancies).',

    first_order_prompt:
      'What peripheral blood smear finding is essentially pathognomonic for Chediak-Higashi syndrome, and what gene is mutated?',
    first_order_answer:
      'Giant cytoplasmic granules within neutrophils and other leukocytes; caused by mutation in LYST (lysosomal trafficking regulator gene), which impairs microtubule-dependent phagolysosome fusion.',

    second_order_vignette:
      'A 4-year-old girl with known Chediak-Higashi syndrome, previously stable on prophylactic antibiotics, presents with two weeks of high fever and is found to have hepatosplenomegaly. Labs reveal pancytopenia with a ferritin of 15,000 ng/mL, and a bone marrow biopsy shows hemophagocytosis.',
    second_order_question:
      'Which of the following best describes this patient\'s current presentation and the most appropriate next step?',
    second_order_choices: JSON.stringify([
      {
        label: 'A',
        text: 'A typical pyogenic bacterial infection; begin broader-spectrum antibiotics alone',
        correct: false,
        explanation:
          'The combination of hepatosplenomegaly, pancytopenia, extreme hyperferritinemia, and hemophagocytosis on marrow biopsy indicates the accelerated/HLH-like phase of the disease, not a routine bacterial infection.',
      },
      {
        label: 'B',
        text: 'The accelerated (hemophagocytic lymphohistiocytosis-like) phase of Chediak-Higashi syndrome; initiate HLH-directed therapy (e.g., etoposide-based, per HLH protocol) as a bridge to transplant',
        correct: true,
        explanation:
          'Correct. Fever, hepatosplenomegaly, pancytopenia, markedly elevated ferritin, and hemophagocytosis together define the accelerated phase, a life-threatening complication of Chediak-Higashi syndrome requiring urgent HLH-directed therapy and expedited transplant planning.',
      },
      {
        label: 'C',
        text: 'Expected disease progression requiring only supportive care and observation',
        correct: false,
        explanation:
          'The untreated accelerated phase is rapidly fatal; active HLH-directed therapy, not observation alone, is required.',
      },
      {
        label: 'D',
        text: 'A transfusion reaction related to platelet dense granule dysfunction',
        correct: false,
        explanation:
          'This presentation (fever, hepatosplenomegaly, pancytopenia, hemophagocytosis) is not a transfusion reaction and is unrelated to any transfusion event in this vignette.',
      },
      {
        label: 'E',
        text: 'Relapse of an underlying leukemia requiring induction chemotherapy',
        correct: false,
        explanation:
          'No primary malignancy is described; this presentation is the HLH-like accelerated phase specific to Chediak-Higashi syndrome, treated with HLH-directed therapy rather than leukemia induction chemotherapy.',
      },
    ]),
    second_order_answer: 'B',
    second_order_explanation:
      'In a child with known Chediak-Higashi syndrome, the new onset of fever, hepatosplenomegaly, pancytopenia, markedly elevated ferritin, and hemophagocytosis on bone marrow biopsy defines the accelerated phase — an HLH-like lymphoproliferative complication that is rapidly fatal without treatment. Management requires urgent HLH-directed chemo-immunotherapy (e.g., etoposide and corticosteroids) to control the hyperinflammatory state, serving as a bridge to the only potentially curative therapy, allogeneic hematopoietic stem cell transplantation.',

    flowchart_title: 'Recognizing and Managing Chediak-Higashi Syndrome',
    flowchart: JSON.stringify([
      {
        node: 'Partial albinism plus recurrent pyogenic infections',
        branches: [
          {
            label: 'Giant granules on peripheral smear',
            next: 'Chediak-Higashi syndrome — confirm LYST mutation',
          },
          {
            label: 'No giant granules; RAB27A/MYO5A mutation',
            next: 'Griscelli syndrome',
          },
          {
            label: 'Albinism plus bleeding and pulmonary fibrosis, no giant granules',
            next: 'Hermansky-Pudlak syndrome',
          },
        ],
      },
      {
        node: 'Confirmed Chediak-Higashi syndrome — assess for the accelerated phase',
        branches: [
          {
            label: 'Fever, hepatosplenomegaly, pancytopenia, very high ferritin, hemophagocytosis on marrow',
            next: 'Accelerated (HLH-like) phase — start HLH-directed therapy urgently',
          },
          {
            label: 'Stable, no HLH features',
            next: 'Continue infection prophylaxis; plan HSCT before an accelerated phase can develop',
          },
        ],
      },
      {
        node: 'Definitive therapy',
        branches: [
          {
            label: 'HSCT performed',
            next: 'Corrects the hematologic/immune defect (neurologic and pigmentary changes persist)',
          },
          {
            label: 'HSCT not yet performed or unavailable',
            next: 'High risk of a fatal accelerated phase; aggressive infection control and close monitoring',
          },
        ],
      },
    ]),
  },

  {
    module_number: 2,
    module_title: 'Immunology',
    key_submodule: 'Primary Immunodeficiencies',
    slug: 'wiskott-aldrich-syndrome',
    title: 'Wiskott-Aldrich Syndrome',
    sort_order: 7,

    hook_vignette:
      'A 10-month-old boy is brought in for evaluation of a diffuse eczematous rash present since 6 weeks of age, several episodes of bloody stools, and easy bruising with prolonged bleeding after a heel-stick. He has also had two episodes of otitis media. A CBC reveals a platelet count of 38,000/mm3, and the peripheral smear is notable for unusually small platelets.',

    ddx_mapping:
      'Wiskott-Aldrich syndrome vs. immune thrombocytopenic purpura (ITP): Wiskott-Aldrich shows the classic triad of eczema, thrombocytopenia with SMALL platelets (low mean platelet volume), and recurrent infections, in a boy (X-linked recessive); ITP causes isolated thrombocytopenia with NORMAL-TO-LARGE platelets, no eczema, and no recurrent-infection pattern, typically following a viral illness in an otherwise well toddler.\n' +
      'Wiskott-Aldrich syndrome vs. eczema with secondary skin infection: eczema and staphylococcal skin infection are common in the general pediatric population, but a normal platelet count and the absence of bloody stools or a systemic infection pattern argue against Wiskott-Aldrich.\n' +
      'Wiskott-Aldrich syndrome vs. hyper-IgM syndrome or other combined immunodeficiencies: recurrent infections are seen in both, but hyper-IgM syndrome is distinguished by its immunoglobulin pattern (elevated IgM with low IgG/IgA/IgE) rather than thrombocytopenia with small platelets and eczema.\n' +
      'Wiskott-Aldrich syndrome vs. X-linked agammaglobulinemia: XLA causes panhypogammaglobulinemia with absent B cells but no thrombocytopenia or eczema, a distinct laboratory and clinical picture from Wiskott-Aldrich.',

    diagnostic_evaluation:
      'CBC with peripheral smear showing thrombocytopenia with characteristically SMALL platelets (low mean platelet volume) — the key distinguishing laboratory clue versus ITP.\n' +
      'Immunoglobulin panel often shows low IgM, normal-to-elevated IgA, and elevated IgE, with a poor antibody response to polysaccharide (e.g., pneumococcal) vaccine antigens despite a normal response to protein antigens.\n' +
      'Flow cytometry can show reduced or absent WASp (WAS protein) expression in lymphocytes.\n' +
      'Genetic testing confirms a mutation in the WAS gene (Xp11.23); family history often reveals affected maternal male relatives, consistent with X-linked recessive inheritance.',

    management:
      'Supportive care for eczema (topical emollients and corticosteroids) and for bleeding episodes (platelet transfusion when clinically significant).\n' +
      'Prompt antibiotic treatment of infections, with consideration of prophylactic antibiotics or IVIG for patients with frequent or severe recurrent infection.\n' +
      'Splenectomy can improve the thrombocytopenia but increases the risk of overwhelming infection with encapsulated organisms, so it is used selectively and requires lifelong antibiotic prophylaxis if performed.\n' +
      'The only curative therapy is allogeneic hematopoietic stem cell transplantation, ideally from a matched sibling donor early in life, which corrects the hematologic and immunologic defects; without transplant, patients remain at long-term risk for severe bleeding, infection, autoimmune disease, and lymphoma.',

    first_order_prompt:
      'What three findings make up the classic triad of Wiskott-Aldrich syndrome, and what is the key laboratory clue that distinguishes its thrombocytopenia from ITP?',
    first_order_answer:
      'Eczema, thrombocytopenia, and recurrent infections; the key distinguishing laboratory clue is small platelets (low mean platelet volume) on peripheral smear, versus the normal-to-large platelets typically seen in ITP.',

    second_order_vignette:
      'A 14-month-old boy with a history of eczema and recurrent otitis media is found to have a platelet count of 42,000/mm3 with small platelets on smear. Genetic testing confirms a WAS gene mutation. His parents ask about long-term treatment options.',
    second_order_question:
      'Which of the following is the only currently curative therapy for this condition?',
    second_order_choices: JSON.stringify([
      {
        label: 'A',
        text: 'Lifelong IVIG replacement therapy',
        correct: false,
        explanation:
          'IVIG can reduce infection frequency by supplying passive antibody, but it does not correct the underlying platelet or T-cell defect and is supportive rather than curative.',
      },
      {
        label: 'B',
        text: 'Splenectomy',
        correct: false,
        explanation:
          'Splenectomy can improve the platelet count but increases the risk of overwhelming infection and does not address the underlying immunodeficiency; it is not curative.',
      },
      {
        label: 'C',
        text: 'Allogeneic hematopoietic stem cell transplantation from a matched donor',
        correct: true,
        explanation:
          'Correct. Replacing the defective hematopoietic stem cell compartment with donor cells is the only therapy that corrects both the immunologic and hematologic defects of Wiskott-Aldrich syndrome, ideally performed early before complications accrue.',
      },
      {
        label: 'D',
        text: 'Chronic prophylactic antibiotics alone',
        correct: false,
        explanation:
          'Reduces the frequency and severity of infections but does not correct the underlying disease process.',
      },
      {
        label: 'E',
        text: 'Regular platelet transfusions',
        correct: false,
        explanation:
          'Addresses bleeding episodes acutely but is not a long-term or curative strategy, and carries a risk of alloimmunization with repeated use.',
      },
    ]),
    second_order_answer: 'C',
    second_order_explanation:
      'Wiskott-Aldrich syndrome results from a defect intrinsic to hematopoietic stem cells and their progeny (WASp is required for actin cytoskeletal reorganization across platelets, lymphocytes, and other blood cell lineages), so only replacing that stem cell compartment — via allogeneic hematopoietic stem cell transplantation from a matched donor — can correct the underlying disease. All other options manage individual complications (infection, bleeding) without addressing the root cause, so patients who do not undergo transplant remain at cumulative long-term risk for severe bleeding, infection, autoimmune disease, and lymphoma.',

    flowchart_title: 'Working Up Eczema, Thrombocytopenia, and Infection in an Infant Boy',
    flowchart: JSON.stringify([
      {
        node: 'Eczema plus thrombocytopenia plus recurrent infections in an infant boy',
        branches: [
          {
            label: 'Platelets small (low MPV), X-linked family history',
            next: 'Wiskott-Aldrich syndrome — confirm WAS gene mutation',
          },
          {
            label: 'Platelets normal/large, no eczema or infection pattern',
            next: 'Consider ITP instead',
          },
          {
            label: 'No thrombocytopenia, isolated eczema plus skin infection',
            next: 'Atopic dermatitis with secondary infection',
          },
        ],
      },
      {
        node: 'Confirmed Wiskott-Aldrich syndrome — assess donor availability',
        branches: [
          {
            label: 'Matched sibling or unrelated donor available',
            next: 'Proceed to allogeneic HSCT early, before complications accrue',
          },
          {
            label: 'No donor yet identified, or mild disease',
            next: 'Supportive care: antibiotic prophylaxis, IVIG, manage bleeding/eczema; continue donor search',
          },
        ],
      },
      {
        node: 'Long-term risks if untreated',
        branches: [
          {
            label: 'Severe bleeding episode',
            next: 'Platelet transfusion; consider splenectomy with lifelong antibiotic prophylaxis if recurrent',
          },
          {
            label: 'Development of autoimmune disease or lymphoma',
            next: 'Manage per specific complication; reinforces the importance of early transplant',
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
  {
    module_number: 3,
    module_title: "Microbiology",
    key_submodule: "Tuberculosis",
    slug: "pulmonary-tuberculosis-evaluation",
    title: "Pulmonary Tuberculosis: Latent vs. Active Disease Workup",
    sort_order: 9,

    hook_vignette:
      "A 41-year-old man who immigrated 2 years ago from a country with high tuberculosis prevalence presents with 6 weeks of productive cough, low-grade fevers, night sweats, and a 12-lb unintentional weight loss. He works at a homeless shelter. Chest X-ray shows a cavitary lesion in the right upper lobe.",

    ddx_mapping:
      "Active pulmonary tuberculosis classically causes a subacute-to-chronic (weeks-to-months) course of productive cough, low-grade fevers, drenching night sweats, and substantial weight loss, often with upper-lobe cavitary disease on imaging (reflecting the higher oxygen tension favoring obligate aerobic Mycobacterium tuberculosis growth apically), with risk factors including recent immigration from an endemic region, congregate living/homeless shelter exposure, and HIV coinfection.\nCommunity-acquired bacterial pneumonia typically has a much more acute (days, not weeks) onset with high fever and lobar consolidation rather than cavitation, and responds to a short course of empiric antibiotics rather than following the indolent, progressively wasting course described here.\nPrimary lung malignancy (particularly squamous cell carcinoma, which favors a central/upper-lobe location and can cavitate) can mimic TB's chronicity and weight loss, but typically occurs in an older patient with a heavy smoking history, lacks the prominent fevers/night sweats pattern, and is distinguished by cytology/biopsy rather than acid-fast smear.\nNontuberculous mycobacterial (NTM) infection (e.g., Mycobacterium avium complex) can also cause chronic cough, cavitary upper-lobe disease, and weight loss, particularly in older patients with underlying structural lung disease (bronchiectasis, COPD), but lacks the same epidemiologic risk factors here and requires mycobacterial speciation (not just AFB smear positivity, which cannot distinguish TB from NTM) to guide a markedly different treatment regimen.\nEndemic fungal infections (e.g., histoplasmosis, coccidioidomycosis) can also produce chronic cavitary lung disease with weight loss and can mimic TB radiographically, but are suggested by a compatible geographic exposure history (river valleys for Histoplasma; the desert Southwest for Coccidioides) rather than this patient's risk factors, and are diagnosed by fungal antigen/serology and culture rather than AFB smear.",

    diagnostic_evaluation:
      "Any patient with suspected active pulmonary TB should be placed in airborne isolation immediately, before further workup, given the risk of aerosol transmission.\nThree separate sputum specimens (ideally morning samples on different days) should be sent for acid-fast bacilli (AFB) smear microscopy, nucleic acid amplification testing (NAAT, e.g., Xpert MTB/RIF, which also rapidly screens for rifampin resistance), and mycobacterial culture, which remains the gold standard and is required for full drug-susceptibility testing even though it can take weeks to result.\nInterferon-gamma release assays (IGRA) or the tuberculin skin test (TST) support a diagnosis of TB infection (exposure) but cannot distinguish latent from active disease and should not be relied upon alone when active disease is clinically suspected — a symptomatic patient with a cavitary infiltrate needs sputum studies regardless of IGRA/TST result.\nHIV testing should be performed in every patient newly diagnosed with active TB, given the strong bidirectional relationship between the two infections and the implications for treatment duration/regimen and immune reconstitution risk.\nIn a patient with only an incidentally found positive IGRA/TST and no symptoms or radiographic abnormality, latent TB infection (LTBI) is diagnosed once active disease has been excluded by history, exam, and chest imaging.",

    management:
      "Active, drug-susceptible pulmonary TB is treated with a four-drug regimen — rifampin, isoniazid, pyrazinamide, and ethambutol (RIPE) — for an initial 2-month intensive phase, followed by a 4-month continuation phase of rifampin plus isoniazid (total 6 months), once susceptibility to rifampin and isoniazid is confirmed.\nPyridoxine (vitamin B6) is co-administered with isoniazid to prevent isoniazid-associated peripheral neuropathy, and baseline/periodic liver function tests are monitored given the hepatotoxicity risk of isoniazid, rifampin, and pyrazinamide.\nDirectly observed therapy (DOT) is preferred to ensure adherence and prevent the emergence of drug resistance, and public health authorities must be notified for contact tracing and airborne isolation precautions until the patient is no longer considered infectious (generally after smear conversion and clinical improvement on appropriate therapy).\nLatent TB infection, once active disease is excluded, is treated with a shorter rifamycin-based regimen (e.g., 4 months of rifampin, or 3 months of once-weekly isoniazid plus rifapentine) now preferred over the older 9-month isoniazid monotherapy regimen, given better completion rates with similar efficacy and lower hepatotoxicity risk.",

    first_order_prompt:
      "Why does active pulmonary tuberculosis characteristically involve the upper lobes rather than the lower lobes?",
    first_order_answer:
      "Because M. tuberculosis is an obligate aerobe, and the lung apices have relatively higher oxygen tension and lower lymphatic drainage/blood flow than the lower lobes, favoring bacillary growth there.",

    second_order_vignette:
      "A 52-year-old man with a positive tuberculin skin test placed for a pre-employment health screen (16 mm induration) has no cough, fever, weight loss, or night sweats. He has no documented prior TB exposure history, and a chest X-ray shows no infiltrate, cavitation, or hilar adenopathy. He has no history of HIV infection or other immunosuppression.",
    second_order_question:
      "Which of the following is the most appropriate next step in management?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "Treat for latent TB infection with a rifamycin-based regimen after excluding active disease",
        "correct": true,
        "explanation": "Correct. Active disease has already been reasonably excluded by history, exam, and a normal chest X-ray, so a clearly positive TST is managed as latent TB infection, treated with a shorter rifamycin-based regimen to reduce future reactivation risk."
      },
      {
        "label": "B",
        "text": "Start standard four-drug RIPE therapy for active tuberculosis",
        "correct": false,
        "explanation": "Incorrect. There is no clinical or radiographic evidence of active disease, so full active-TB therapy is not indicated."
      },
      {
        "label": "C",
        "text": "Repeat the tuberculin skin test in 3 months to confirm a true positive",
        "correct": false,
        "explanation": "Incorrect. A clearly positive TST with active disease already excluded does not require repeat testing before treating for LTBI."
      },
      {
        "label": "D",
        "text": "No further action is needed since he has no symptoms",
        "correct": false,
        "explanation": "Incorrect. A positive TST/IGRA with active disease excluded should generally be treated for LTBI, since this reduces the future risk of reactivation."
      },
      {
        "label": "E",
        "text": "Obtain a sputum AFB smear and culture despite the normal chest X-ray",
        "correct": false,
        "explanation": "Incorrect. Without symptoms or an abnormal chest X-ray, sputum studies for active disease are low-yield and unnecessary once active disease has already been reasonably excluded."
      }
    ]),
    second_order_answer: "A",
    second_order_explanation:
      "A clearly positive tuberculin skin test or IGRA in an asymptomatic patient with a normal chest X-ray, once active tuberculosis has been reasonably excluded by history, exam, and imaging, is managed as latent TB infection (LTBI). LTBI treatment (a rifamycin-based regimen — 4 months of rifampin, or 3 months of once-weekly isoniazid plus rifapentine — now preferred over the older 9-month isoniazid monotherapy course) reduces the lifetime risk of reactivation to active disease and does not require repeat skin testing or sputum studies when active disease has already been excluded.",

    flowchart_title: "Evaluation of Suspected Tuberculosis",
    flowchart: JSON.stringify([
      {
        "node": "Patient with risk factors + subacute cough/fever/night sweats/weight loss, or an incidental positive IGRA/TST",
        "branches": [
          {
            "label": "Symptomatic with abnormal CXR (infiltrate/cavitation)",
            "next": "Airborne isolation; send 3 sputum specimens for AFB smear + NAAT + mycobacterial culture"
          },
          {
            "label": "Asymptomatic, positive IGRA/TST, normal CXR",
            "next": "Evaluate for latent TB infection (LTBI) once active disease is excluded"
          }
        ]
      },
      {
        "node": "Sputum studies",
        "branches": [
          {
            "label": "AFB smear/NAAT positive for M. tuberculosis",
            "next": "Begin empiric 4-drug RIPE therapy; notify public health; continue isolation"
          },
          {
            "label": "AFB smear negative but clinical suspicion remains high",
            "next": "Continue isolation pending culture; consider repeat sampling/bronchoscopy"
          }
        ]
      },
      {
        "node": "Culture and susceptibility results",
        "branches": [
          {
            "label": "Drug-susceptible M. tuberculosis confirmed",
            "next": "Continue RIPE x2 months, then rifampin + isoniazid x4 months (total 6 months)"
          },
          {
            "label": "Drug-resistant organism (e.g., rifampin-resistant/MDR-TB)",
            "next": "Refer to a TB specialist for an individualized multidrug regimen"
          }
        ]
      },
      {
        "node": "LTBI pathway (active disease excluded)",
        "branches": [
          {
            "label": "No contraindication to rifamycin-based therapy",
            "next": "4 months rifampin, or 3 months once-weekly isoniazid + rifapentine"
          },
          {
            "label": "Rifamycin contraindicated (e.g., significant drug interaction)",
            "next": "9 months isoniazid monotherapy with pyridoxine"
          }
        ]
      }
    ]),
  },
  {
    module_number: 3,
    module_title: "Microbiology",
    key_submodule: "Antibiotic-Associated Diarrhea",
    slug: "clostridioides-difficile-colitis",
    title: "Clostridioides difficile Colitis",
    sort_order: 10,

    hook_vignette:
      "A 74-year-old woman hospitalized 10 days ago for a hip fracture repair, treated with perioperative cefazolin and then a course of clindamycin for a presumed wound infection, develops new watery diarrhea (8 episodes per day) with diffuse abdominal cramping and a low-grade fever on hospital day 9. She has no blood in her stool.",

    ddx_mapping:
      "Clostridioides difficile colitis should be strongly suspected in any patient with new diarrhea (typically watery, sometimes with mucus, only occasionally grossly bloody) occurring during or within several weeks of antibiotic exposure — clindamycin, fluoroquinolones, and broad-spectrum cephalosporins carry the highest risk — especially in a hospitalized or recently hospitalized older adult, resulting from antibiotic-driven disruption of normal colonic flora that allows toxin-producing C. difficile overgrowth.\nAntibiotic-associated diarrhea without true colitis (a benign osmotic/functional effect of antibiotics on gut flora, without toxin-mediated mucosal injury) can produce similar mild diarrhea during antibiotic therapy, but lacks fever, marked leukocytosis, or pseudomembranes, and resolves once the antibiotic is stopped without needing directed anti-C. difficile therapy.\nAn inflammatory bowel disease flare (particularly ulcerative colitis) can present with diarrhea and abdominal pain in a patient with a known IBD history, but typically lacks a clear temporal relationship to recent antibiotic exposure and more often features bloody stool as a prominent finding; C. difficile infection can also complicate or trigger an IBD flare, so testing for it remains appropriate in this population.\nIschemic colitis presents with abdominal pain (often out of proportion to exam, or in an older patient with vascular risk factors) and bloody diarrhea, typically without an antibiotic-exposure history, and is instead associated with hypotension, atrial fibrillation, or other risk factors for bowel hypoperfusion.\nNorovirus or other viral gastroenteritis causes acute watery diarrhea with vomiting, often in outbreak clusters (e.g., on a hospital ward), typically self-limited over 1-3 days without the antibiotic-exposure link or the more prolonged course seen in C. difficile colitis.",

    diagnostic_evaluation:
      "Stool testing should be sent only in patients with clinically significant diarrhea (generally ≥3 unformed stools in 24 hours) and no clear alternative explanation (e.g., laxative use), since testing an asymptomatic patient or one with formed stool risks detecting nonpathogenic colonization and leading to unnecessary treatment.\nA two-step testing algorithm is preferred: a highly sensitive nucleic acid amplification test (NAAT, detecting the toxin gene) or glutamate dehydrogenase (GDH) antigen screen is used first, followed by a toxin enzyme immunoassay (EIA) to confirm that toxin is actually being produced when the first test is positive, since NAAT/GDH alone cannot distinguish true toxin-producing infection from asymptomatic colonization with a toxigenic strain.\nA complete blood count and basic metabolic panel are obtained to assess severity — a markedly elevated white blood cell count (especially >15,000/mm3) and/or an elevated creatinine are used to risk-stratify to severe disease and guide treatment choice.\nAbdominal imaging (CT) and/or flexible sigmoidoscopy (looking for the characteristic yellow-white pseudomembranes) are reserved for patients with severe or fulminant presentations (e.g., ileus, toxic megacolon, or diagnostic uncertainty), not for routine, uncomplicated cases.",

    management:
      "The offending antibiotic should be discontinued as soon as clinically feasible, and treatment is stratified by severity: for a first, non-severe episode, oral vancomycin or oral fidaxomicin is now preferred over oral metronidazole, which is reserved for settings where the preferred agents are unavailable given its inferior efficacy.\nFor a first severe episode (marked leukocytosis and/or elevated creatinine as above), oral vancomycin is used at a standard dose and fidaxomicin is also an option; for fulminant disease (hypotension, ileus, or toxic megacolon), oral (or per-rectum, if ileus prevents oral delivery) vancomycin is combined with IV metronidazole, and surgery (subtotal colectomy) is considered for those who fail to improve or who develop perforation.\nRecurrent C. difficile infection (relapse within about 8 weeks of completing therapy) is common and is managed with a prolonged/tapered vancomycin course, fidaxomicin, or — for multiple recurrences — fecal microbiota transplantation, which restores healthy colonic flora and has high efficacy in preventing further relapse; bezlotoxumab (a monoclonal antibody against C. difficile toxin B) can also be added to reduce recurrence risk in high-risk patients.\nAntimotility agents (e.g., loperamide) are generally avoided in active C. difficile colitis, as they may worsen toxin retention and precipitate toxic megacolon, similar to the concern with EHEC infection.",

    first_order_prompt:
      "What is the recommended first-line oral regimen for a first episode of non-severe C. difficile colitis, and which agent is no longer considered first-line?",
    first_order_answer:
      "Oral vancomycin or oral fidaxomicin is preferred first-line; oral metronidazole is no longer first-line and is reserved for situations where the preferred agents are unavailable.",

    second_order_vignette:
      "A 68-year-old man is hospitalized for C. difficile colitis, diagnosed by NAAT and toxin EIA after receiving levofloxacin for presumed sinusitis, and is started on oral vancomycin. On hospital day 3 he develops worsening abdominal distension, absent bowel sounds, and a rising white blood cell count to 28,000/mm3, with blood pressure now 84/52 mmHg.",
    second_order_question:
      "Which of the following is the most appropriate next step in management?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "Add IV metronidazole to the ongoing oral vancomycin and urgently evaluate for possible colectomy",
        "correct": true,
        "explanation": "Correct. Ileus, hypotension, and a rising white blood cell count on established therapy indicate fulminant C. difficile colitis, which is managed with combination oral/rectal vancomycin plus IV metronidazole and urgent surgical evaluation."
      },
      {
        "label": "B",
        "text": "Switch from oral vancomycin to oral fidaxomicin monotherapy",
        "correct": false,
        "explanation": "Incorrect. A lateral switch in oral monotherapy does not address the fulminant picture (ileus, shock), which requires escalation, not substitution."
      },
      {
        "label": "C",
        "text": "Discontinue vancomycin and begin fecal microbiota transplantation immediately",
        "correct": false,
        "explanation": "Incorrect. Fecal microbiota transplantation is indicated for recurrent, not acute/fulminant first-episode, disease, and is not an emergent intervention for shock or ileus."
      },
      {
        "label": "D",
        "text": "Add loperamide to reduce stool frequency and improve hemodynamics",
        "correct": false,
        "explanation": "Incorrect. Antimotility agents are contraindicated in active C. difficile colitis and risk worsening toxin retention and toxic megacolon."
      },
      {
        "label": "E",
        "text": "Continue current oral vancomycin alone and reassess in 48 hours",
        "correct": false,
        "explanation": "Incorrect. Ileus, hypotension, and rising leukocytosis signal fulminant disease, a medical/surgical emergency that requires immediate escalation, not watchful waiting."
      }
    ]),
    second_order_answer: "A",
    second_order_explanation:
      "New ileus, hypotension, and rising leukocytosis in a patient already on oral vancomycin for C. difficile colitis indicate progression to fulminant disease (including possible toxic megacolon). Management escalates to combination therapy — oral (or per-rectum, if ileus prevents oral delivery) vancomycin plus IV metronidazole — together with urgent surgical evaluation for possible subtotal colectomy, since fulminant C. difficile colitis carries a high risk of perforation and death if not promptly escalated.",

    flowchart_title: "C. difficile Testing and Severity-Based Management",
    flowchart: JSON.stringify([
      {
        "node": "Hospitalized or recently antibiotic-exposed patient with ≥3 unformed stools/24h",
        "branches": [
          {
            "label": "No alternative cause identified (e.g., laxatives, tube feeds)",
            "next": "Send NAAT/GDH screen + toxin EIA (two-step algorithm)"
          },
          {
            "label": "Alternative cause identified",
            "next": "Do not test; address the alternative cause"
          }
        ]
      },
      {
        "node": "Stool testing result",
        "branches": [
          {
            "label": "NAAT/GDH positive and toxin EIA positive",
            "next": "Confirmed C. difficile infection; discontinue offending antibiotic; risk-stratify severity"
          },
          {
            "label": "NAAT/GDH positive but toxin EIA negative",
            "next": "Likely colonization, not active toxin-mediated disease; treat only if strong clinical suspicion remains"
          }
        ]
      },
      {
        "node": "Severity assessment",
        "branches": [
          {
            "label": "WBC <15,000/mm3, creatinine normal",
            "next": "Non-severe: oral vancomycin or fidaxomicin"
          },
          {
            "label": "WBC ≥15,000/mm3 and/or elevated creatinine, no ileus/shock",
            "next": "Severe: oral vancomycin (or fidaxomicin), standard dosing"
          },
          {
            "label": "Ileus, toxic megacolon, or hypotension",
            "next": "Fulminant: oral/rectal vancomycin + IV metronidazole; urgent surgical evaluation"
          }
        ]
      },
      {
        "node": "Recurrent disease (relapse within ~8 weeks)",
        "branches": [
          {
            "label": "First recurrence",
            "next": "Prolonged/tapered vancomycin or fidaxomicin"
          },
          {
            "label": "Multiple recurrences",
            "next": "Fecal microbiota transplantation ± bezlotoxumab"
          }
        ]
      }
    ]),
  },
  {
    module_number: 3,
    module_title: "Microbiology",
    key_submodule: "Tick-Borne Illness",
    slug: "lyme-disease-staged-presentation",
    title: "Lyme Disease: Staged Presentation and Testing",
    sort_order: 11,

    hook_vignette:
      "A 34-year-old man returns from a camping trip in Connecticut 10 days ago and now has an expanding, painless, erythematous patch with partial central clearing on his thigh, 14 cm in diameter, along with mild fatigue and low-grade fever. He does not recall a tick bite.",

    ddx_mapping:
      "Early localized Lyme disease presents 3-30 days after a tick bite (often unrecognized, since the Ixodes tick bite itself is typically painless) as erythema migrans — an expanding, usually painless or minimally pruritic annular erythematous patch, classically (though not always) with central clearing — often with mild constitutional symptoms (fatigue, low-grade fever, myalgias) but no other organ involvement, and is a clinical diagnosis that does not require serologic confirmation before treatment.\nCellulitis (typically Staphylococcus aureus or Streptococcus pyogenes) can also cause an expanding area of erythema, but is usually more acutely painful, warm, and tender, expands more rapidly (over hours to a day or two, not days to weeks), and lacks the central clearing pattern typical of erythema migrans.\nA local irritant/hypersensitivity reaction to the tick bite itself is typically smaller (usually less than 5 cm), appears within hours to a day or two of the bite rather than after a delay, and resolves within a few days without expanding, unlike the progressively enlarging erythema migrans lesion.\nSouthern tick-associated rash illness (STARI), caused by the bite of the Lone Star tick (Amblyomma americanum) rather than Ixodes, produces a nearly identical expanding erythema migrans-like lesion but occurs in the southeastern/south-central United States, outside the range of Lyme-transmitting Ixodes ticks, is not caused by Borrelia burgdorferi, and does not progress to disseminated Lyme manifestations.\nEarly disseminated Lyme disease (weeks after the bite, if early localized disease is untreated or missed) can present with multiple secondary erythema migrans lesions, facial nerve palsy (sometimes bilateral), or lymphocytic meningitis, and late Lyme disease (months later) classically causes an oligoarticular, migratory large-joint arthritis (especially the knee) or, less commonly, cardiac conduction abnormalities (e.g., AV block) — recognizing which stage is present matters for the diagnostic approach and treatment duration.",

    diagnostic_evaluation:
      "Early localized Lyme disease (a classic erythema migrans lesion in a patient with plausible exposure in an endemic area) is diagnosed clinically — serologic testing is neither required nor reliable at this stage, since antibodies typically have not yet developed and a substantial proportion of early infections would be missed by testing, falsely reassuring a negative result.\nFor any later-stage or extracutaneous manifestation (facial palsy, meningitis, arthritis, carditis), the standard two-tier serologic algorithm is used: a sensitive first-tier enzyme immunoassay (EIA), and if positive or equivocal, a confirmatory second-tier test — traditionally a Western blot (IgM and IgG bands), though a second EIA-based two-tier algorithm is also now accepted — since a single EIA alone has too high a false-positive rate to stand alone.\nIgM Western blot is interpreted cautiously and largely discounted beyond the first month of illness, since false-positive IgM bands are common with prolonged symptoms, and a positive IgM with a negative IgG in a patient with symptoms lasting more than a month should raise suspicion for a false-positive rather than active early infection.\nLumbar puncture (with CSF Lyme antibody index) is reserved for patients with suspected Lyme neuroborreliosis (meningitis, radiculopathy, or encephalitis) rather than isolated facial palsy or arthritis, where serology plus a compatible clinical picture is generally sufficient.",

    management:
      "Early localized Lyme disease (erythema migrans) is treated with a course of oral doxycycline (now considered acceptable for short courses even in young children, per updated evidence), or oral amoxicillin/cefuroxime as alternatives, typically for 10-14 days depending on the specific regimen and guideline used.\nEarly disseminated disease with isolated facial nerve palsy (without meningitis) is treated with the same oral regimens as early localized disease, since oral therapy achieves adequate CNS penetration for isolated cranial neuropathy without overt meningitis; frank Lyme meningitis is treated with IV ceftriaxone, though oral doxycycline is also now considered acceptable by some guidelines for uncomplicated Lyme meningitis in patients who can take oral medication.\nLyme arthritis is treated with a longer course (typically 28 days) of oral doxycycline or amoxicillin; if joint symptoms persist despite an appropriate oral course (\"antibiotic-refractory\" Lyme arthritis, thought to reflect a post-infectious immune process rather than ongoing active infection), NSAIDs or DMARDs are used rather than additional prolonged antibiotics.\nLyme carditis with high-grade AV block may require temporary pacing in addition to antibiotics (IV ceftriaxone for hospitalized/high-grade block, oral therapy for milder involvement), and typically resolves fully once treated, since the conduction disturbance is usually reversible.",

    first_order_prompt:
      "Why is serologic testing not recommended for a classic erythema migrans lesion in a patient with a plausible tick exposure?",
    first_order_answer:
      "Because early localized Lyme disease is a clinical diagnosis — antibodies have often not yet developed at this early stage, so serologic testing has poor sensitivity here, and a negative result could be falsely reassuring and delay treatment.",

    second_order_vignette:
      "A 45-year-old woman from Wisconsin presents with a 3-month history of recurrent, migratory swelling and pain in her right knee, each episode lasting 1-2 weeks and resolving before recurring in the same or the opposite knee. She recalls a single episode of an expanding thigh rash with a tick bite about 5 months ago that resolved without treatment. She has no fever currently. Two-tier Lyme serology (EIA followed by Western blot) is positive for IgG.",
    second_order_question:
      "Which of the following is the most appropriate treatment?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "Oral doxycycline (or amoxicillin) for 28 days",
        "correct": true,
        "explanation": "Correct. This migratory large-joint arthritis pattern following an untreated erythema migrans lesion, with positive two-tier serology, is Lyme arthritis, treated with a 28-day course of oral doxycycline or amoxicillin."
      },
      {
        "label": "B",
        "text": "Intra-articular corticosteroid injection alone, without antibiotics",
        "correct": false,
        "explanation": "Incorrect. Active Lyme arthritis should be treated with antibiotics first; steroid injections are not primary therapy and are not given without first addressing the underlying infection."
      },
      {
        "label": "C",
        "text": "IV ceftriaxone for 14 days as first-line therapy",
        "correct": false,
        "explanation": "Incorrect. Oral therapy is first-line for Lyme arthritis; IV ceftriaxone is reserved for neurologic involvement, carditis with high-grade block, or arthritis that fails an oral course."
      },
      {
        "label": "D",
        "text": "No antibiotic therapy is needed since the acute erythema migrans phase has already resolved",
        "correct": false,
        "explanation": "Incorrect. Active arthritis, a later-stage manifestation, still requires antibiotic treatment even though the initial skin lesion has already resolved."
      },
      {
        "label": "E",
        "text": "Methotrexate as first-line disease-modifying therapy for presumed rheumatoid arthritis",
        "correct": false,
        "explanation": "Incorrect. This migratory large-joint pattern with a preceding erythema migrans and positive Lyme serology points to Lyme arthritis, not rheumatoid arthritis; antibiotics, not DMARDs, are first-line."
      }
    ]),
    second_order_answer: "A",
    second_order_explanation:
      "A migratory, monoarticular-to-oligoarticular large-joint arthritis (classically the knee) following an untreated or missed erythema migrans lesion months earlier, confirmed by positive two-tier Lyme serology, is Lyme arthritis. It is treated with a longer oral antibiotic course (28 days of doxycycline or amoxicillin) than earlier-stage disease; IV therapy and DMARDs are reserved for neurologic/cardiac involvement or antibiotic-refractory arthritis that persists despite an appropriate oral course.",

    flowchart_title: "Staged Evaluation and Treatment of Lyme Disease",
    flowchart: JSON.stringify([
      {
        "node": "Patient with possible tick exposure in an endemic area",
        "branches": [
          {
            "label": "Expanding annular erythema (± central clearing), days after exposure",
            "next": "Diagnose early localized Lyme disease clinically; no serology needed; oral doxycycline/amoxicillin x10-14 days"
          },
          {
            "label": "Facial palsy, meningitis symptoms, migratory arthritis, or cardiac symptoms, weeks-months after exposure",
            "next": "Send two-tier serology (EIA, then Western blot/second EIA if positive or equivocal)"
          }
        ]
      },
      {
        "node": "Two-tier serology result",
        "branches": [
          {
            "label": "Positive on both tiers",
            "next": "Diagnose Lyme disease at the corresponding stage"
          },
          {
            "label": "Negative",
            "next": "Reconsider alternative diagnosis; repeat serology in 2-4 weeks if early disseminated disease still suspected"
          }
        ]
      },
      {
        "node": "Disseminated disease — determine manifestation",
        "branches": [
          {
            "label": "Isolated facial palsy, no meningitis",
            "next": "Oral doxycycline/amoxicillin, same as early localized regimen"
          },
          {
            "label": "Meningitis/radiculopathy",
            "next": "IV ceftriaxone (oral doxycycline acceptable per some guidelines if uncomplicated)"
          },
          {
            "label": "Migratory large-joint arthritis",
            "next": "Oral doxycycline/amoxicillin x28 days"
          },
          {
            "label": "Carditis with high-grade AV block",
            "next": "IV ceftriaxone ± temporary pacing"
          }
        ]
      },
      {
        "node": "Arthritis persists after an appropriate oral course",
        "branches": [
          {
            "label": "Antibiotic-refractory (post-infectious) arthritis",
            "next": "NSAIDs/DMARDs, not repeated or prolonged antibiotics"
          },
          {
            "label": "Ongoing active infection suspected (rare)",
            "next": "Consider retreatment or specialist referral"
          }
        ]
      }
    ]),
  },
  // Module 13 — Psychiatry
  // ===========================================================================
  {
    module_number: 13,
    module_title: "Psychiatry",
    key_submodule: "Child and Adolescent",
    slug: "adhd-attention-deficit-hyperactivity-disorder",
    title: "Attention-Deficit/Hyperactivity Disorder (ADHD)",
    sort_order: 1,

    hook_vignette:
      "An 8-year-old boy is referred by his second-grade teacher for repeatedly leaving his seat during lessons, blurting out answers before questions are finished, and losing his homework folder almost every week. His parents report he cannot sit through a family meal without fidgeting and often seems not to listen when spoken to directly. The pattern has been present since kindergarten and shows up both at school and at home.",

    ddx_mapping:
      "Normal developmental variation in energy/attention for age (no functional impairment, not present across settings)\nOppositional defiant disorder — defiance and anger toward authority, not primarily an attention/impulse-control deficit\nLearning disorder — inattention is secondary to frustration with a specific academic skill (e.g., reading), not global\nAutism spectrum disorder — social communication deficits and restricted/repetitive behavior dominate, not just inattention\nHearing or vision impairment — \"inattention\" resolves once the sensory deficit is corrected\nAbsence seizures — brief, stereotyped staring episodes with abrupt on/off, not a pervasive attention pattern\nAnxiety disorder or mood disorder (including pediatric mania) — inattention tied to worry/rumination or a discrete mood episode\nInadequate or disrupted sleep — daytime inattention/hyperactivity that improves once sleep is addressed",

    diagnostic_evaluation:
      "DSM-5 requires ≥6 symptoms of inattention and/or ≥6 symptoms of hyperactivity-impulsivity (≥5 of either if the patient is 17 or older), present for at least 6 months, with onset of several symptoms before age 12, and clear evidence the symptoms interfere with functioning in at least 2 settings (e.g., home and school).\nADHD is a clinical diagnosis — there is no lab test or imaging study that confirms it. Gather standardized teacher and parent rating scales (e.g., Vanderbilt) across settings, since a single office visit rarely captures the full pattern.\nBefore diagnosing, screen for and rule out hearing or vision problems, an inadequate sleep schedule/sleep-disordered breathing, and medical contributors such as hyperthyroidism or lead exposure, since these can all mimic the presentation.",

    management:
      "For children age 6 and older, first-line treatment is a stimulant medication (a methylphenidate- or amphetamine-based agent) combined with behavioral therapy — parent training in behavior management plus classroom-based behavioral interventions.\nFor preschool-age children (4–5 years old), behavioral therapy is first-line, with medication reserved for cases where behavioral treatment alone is insufficient.\nNon-stimulant options (atomoxetine, or the alpha-2 agonists guanfacine/clonidine) are useful when there is a comorbid tic disorder, significant anxiety, a family history concerning for stimulant misuse, or intolerable stimulant side effects.\nMonitor growth (height/weight), appetite, and cardiovascular symptoms on stimulants; a routine baseline EKG is not required unless there is a personal or family history of cardiac disease.",

    first_order_prompt:
      "What is the minimum symptom duration and the age-of-onset requirement for diagnosing ADHD?",
    first_order_answer:
      "Symptoms must be present for at least 6 months, and several inattentive or hyperactive-impulsive symptoms must have been present before age 12.",

    second_order_vignette:
      "A 15-year-old girl is referred by her school counselor for declining grades over the past year. Her teachers describe her as quiet, \"daydreamy,\" and forgetful — she frequently loses assignments, misses details in instructions, and seems to drift off during class, but she is never disruptive and has no behavioral complaints. Her parents note she has always been this way at home too, forgetting chores and misplacing belongings, since elementary school.",
    second_order_question:
      "Which of the following is the most likely diagnosis?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "ADHD, predominantly inattentive presentation",
        "correct": true,
        "explanation": "Correct. Chronic, cross-situational inattention (losing items, forgetting instructions, distractibility) since childhood, without prominent hyperactivity/impulsivity, is the classic inattentive presentation of ADHD — often under-recognized because it is not disruptive."
      },
      {
        "label": "B",
        "text": "Generalized anxiety disorder",
        "correct": false,
        "explanation": "Incorrect. GAD involves excessive, hard-to-control worry about multiple areas of life plus associated physical symptoms (restlessness, muscle tension, sleep disturbance) — nothing here describes pervasive worry as the driver of her forgetfulness."
      },
      {
        "label": "C",
        "text": "Major depressive disorder",
        "correct": false,
        "explanation": "Incorrect. There is no depressed mood, anhedonia, or the other associated neurovegetative symptoms described, and her pattern has been stable since childhood rather than representing a new, discrete change."
      },
      {
        "label": "D",
        "text": "Normal adolescent daydreaming",
        "correct": false,
        "explanation": "Incorrect. A lifelong, cross-setting pattern (home and school) causing measurable academic decline is beyond ordinary variation and meets the threshold for functional impairment."
      },
      {
        "label": "E",
        "text": "Specific learning disorder in reading",
        "correct": false,
        "explanation": "Incorrect. A learning disorder produces academic difficulty that is circumscribed to the affected skill area; this vignette describes broad forgetfulness and inattention across both academic and everyday home tasks, not a specific skill deficit."
      }
    ]),
    second_order_answer: "A",
    second_order_explanation:
      "The inattentive presentation of ADHD is easy to miss because it lacks the disruptive hyperactivity/impulsivity that typically prompts a referral. The key diagnostic clues are the same as for any ADHD presentation — chronicity (since childhood), pervasiveness (more than one setting), and functional impairment — just expressed through forgetfulness, distractibility, and disorganization rather than restlessness.",

    flowchart_title: "ADHD Diagnostic Pathway",
    flowchart: JSON.stringify([
      {
        "node": "Child presents with concerns about inattention and/or hyperactivity",
        "branches": [
          {
            "label": "Symptoms <6 months or confined to one setting",
            "next": "Reassess; consider situational factors rather than ADHD"
          },
          {
            "label": "Symptoms ≥6 months, ≥2 settings, several present before age 12",
            "next": "Proceed to rule out mimics"
          }
        ]
      },
      {
        "node": "Rule out mimics and contributors",
        "branches": [
          {
            "label": "Hearing or vision deficit identified",
            "next": "Treat the sensory deficit first, then reassess"
          },
          {
            "label": "Sleep disorder or medical cause (e.g., hyperthyroidism, lead exposure)",
            "next": "Treat the underlying cause first"
          },
          {
            "label": "None found",
            "next": "Proceed to formal DSM-5 symptom count"
          }
        ]
      },
      {
        "node": "Apply DSM-5 symptom criteria",
        "branches": [
          {
            "label": "≥6 inattentive symptoms (≥5 if age ≥17)",
            "next": "Predominantly Inattentive Presentation"
          },
          {
            "label": "≥6 hyperactive/impulsive symptoms",
            "next": "Predominantly Hyperactive/Impulsive Presentation"
          },
          {
            "label": "Both thresholds met",
            "next": "Combined Presentation"
          }
        ]
      },
      {
        "node": "Initiate treatment",
        "branches": [
          {
            "label": "Age 4–5",
            "next": "Behavioral parent training first-line"
          },
          {
            "label": "Age ≥6",
            "next": "Stimulant medication + behavioral therapy first-line"
          },
          {
            "label": "Comorbid tics, anxiety, or stimulant intolerance",
            "next": "Consider non-stimulant (atomoxetine, guanfacine/clonidine)"
          }
        ]
      }
    ]),
  },
  {
    module_number: 13,
    module_title: "Psychiatry",
    key_submodule: "Ego Defenses",
    slug: "ego-defense-mechanisms",
    title: "Ego Defense Mechanisms: Mature vs. Immature",
    sort_order: 2,

    hook_vignette:
      "A 45-year-old surgeon learns his research grant was rejected. Rather than confronting his disappointment directly, he spends the next week picking up extra trauma-bay shifts and mentoring junior residents with unusual intensity, later describing it as \"the most productive week of my career.\" His unacceptable frustration has been channeled into a socially valued, constructive outlet — a mature defense called sublimation.",

    ddx_mapping:
      "Defense mechanisms are unconscious (with one key exception) mental strategies the ego uses to manage anxiety from unacceptable impulses, conflicts, or stressors. They are best organized into three tiers by adaptiveness:\nMature defenses (healthiest, seen in well-adjusted adults under stress): sublimation (channeling an unacceptable impulse into a socially productive outlet), altruism (managing distress by helping others), humor (finding comic elements to defuse a difficult situation), and suppression (the one CONSCIOUS defense — deliberately, knowingly postponing attention to a distressing thought or feeling while continuing to function).\nNeurotic / intermediate defenses (common, moderately adaptive): repression (unconsciously excluding a distressing thought/memory from awareness), displacement (redirecting an emotional reaction from its true, threatening target to a safer substitute), reaction formation (converting an unacceptable feeling into its behavioral opposite), intellectualization (using abstract, detached reasoning to avoid the emotional content of a stressor), and rationalization (constructing a logical-sounding but false justification to avoid an uncomfortable truth).\nImmature defenses (associated with significant psychopathology, especially personality disorders): denial (refusing to acknowledge an obvious, distressing reality), projection (attributing one's own unacceptable feelings/impulses to someone else), splitting (viewing people/situations as all-good or all-bad, classically seen in borderline personality disorder), acting out (expressing an unconscious wish or impulse through action instead of reflection, e.g., a tantrum), regression (reverting to an earlier developmental stage of functioning under stress), and passive aggression (indirectly expressing hostility through resistance/procrastination rather than direct confrontation).",

    diagnostic_evaluation:
      "Identifying which defense is in play requires three questions: (1) Is the process conscious or unconscious? Only suppression is conscious — everything else operates outside awareness. (2) Does it distort external reality, or only redirect/transform an internal feeling? Denial and projection distort reality itself; displacement, sublimation, and reaction formation leave reality intact but redirect or transform the emotional response. (3) What is the observable behavior — avoidance, redirection to a substitute target, transformation into a productive activity, or transformation into the opposite feeling?\nA common exam trap is confusing denial with suppression: denial is unconscious refusal to accept a fact (\"I don't have cancer\"), while suppression is a conscious, deliberate choice to set the feeling aside for later (\"I know I have cancer, but I need to focus on this meeting right now\").\nAnother common trap is projection vs. displacement: projection relocates an internal, unacceptable feeling onto another person (\"She hates me\" when the patient actually harbors hostility), while displacement relocates the emotional reaction itself onto a safer external target, without misattributing the feeling's origin.",

    management:
      "In psychotherapy, the goal is not to eliminate defenses (everyone uses them) but to help a patient shift from immature/neurotic defenses toward mature ones. This is especially central in treating personality disorders — for example, borderline personality disorder is characterized by heavy reliance on splitting, and psychodynamic psychotherapy (transference-focused therapy, mentalization-based therapy) works explicitly to help the patient integrate ambivalent (both good and bad) views of the same person.\nClinicians can also model and reinforce mature coping directly: encouraging humor, structured suppression (\"let's come back to that feeling after we finish the visit\"), and channeling distress into productive activity (sublimation) are practical, teachable substitutes for denial, acting out, or projection.",

    first_order_prompt:
      "A man who is furious with his boss, but cannot safely confront him, comes home and yells at his spouse over a minor issue. Which defense mechanism is this?",
    first_order_answer:
      "Displacement — redirecting an emotional reaction from its true, threatening target (the boss) to a safer substitute target (the spouse).",

    second_order_vignette:
      "A 30-year-old woman is diagnosed with early-stage breast cancer. At her follow-up visit she tells her oncologist she \"doesn't have time to fall apart right now,\" and describes spending the week researching clinical trial options, scheduling her surgery, and organizing a fundraising walk with friends. She appears calm, articulate, and highly functional, with no tearfulness or avoidance of the topic, and clearly states she plans to \"deal with the emotional part later, once treatment is underway.\"",
    second_order_question:
      "Which defense mechanism best describes this patient's response?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "Denial",
        "correct": false,
        "explanation": "Incorrect. Denial would involve refusing to accept the diagnosis itself or avoiding treatment; this patient fully acknowledges her diagnosis and is actively pursuing appropriate care."
      },
      {
        "label": "B",
        "text": "Suppression",
        "correct": true,
        "explanation": "Correct. She is consciously and deliberately choosing to postpone processing her distress (\"deal with the emotional part later\") while remaining fully functional and engaged with reality — this conscious postponement is the hallmark of suppression, a mature defense."
      },
      {
        "label": "C",
        "text": "Repression",
        "correct": false,
        "explanation": "Incorrect. Repression is the unconscious exclusion of a distressing thought from awareness. This patient is acutely aware of the diagnosis and her feelings about it — nothing here is outside her conscious awareness."
      },
      {
        "label": "D",
        "text": "Sublimation",
        "correct": false,
        "explanation": "Incorrect, though tempting. Sublimation channels an unacceptable impulse into a socially valued outlet (e.g., aggression into competitive sport). This patient is not transforming an impulse into a productive activity — she is consciously deferring an emotional reaction, which is suppression."
      },
      {
        "label": "E",
        "text": "Reaction formation",
        "correct": false,
        "explanation": "Incorrect. Reaction formation converts an unacceptable feeling into its behavioral opposite (e.g., hostility expressed as excessive sweetness). There is no unacceptable feeling being masked by an opposite display here."
      }
    ]),
    second_order_answer: "B",
    second_order_explanation:
      "Suppression is the single conscious defense mechanism and is considered mature specifically because it allows a person to acknowledge a stressor honestly while choosing, deliberately, to manage the timing of their emotional response — unlike denial (unconscious refusal to accept reality) or repression (unconscious exclusion from awareness), both of which distort or hide the underlying truth from the person themselves.",

    flowchart_title: "Classifying an Ego Defense",
    flowchart: JSON.stringify([
      {
        "node": "Is the mental process conscious or unconscious?",
        "branches": [
          {
            "label": "Conscious, deliberate postponement of a distressing feeling",
            "next": "Suppression"
          },
          {
            "label": "Unconscious",
            "next": "Proceed to next question"
          }
        ]
      },
      {
        "node": "Does the unconscious defense distort external reality?",
        "branches": [
          {
            "label": "Yes — reality is denied or misattributed to someone else",
            "next": "Denial or Projection"
          },
          {
            "label": "No — reality is intact, but the feeling/impulse is redirected or transformed",
            "next": "Proceed to next question"
          }
        ]
      },
      {
        "node": "How is the feeling handled?",
        "branches": [
          {
            "label": "Redirected to a safer substitute target",
            "next": "Displacement"
          },
          {
            "label": "Transformed into a productive, socially valued activity",
            "next": "Sublimation"
          },
          {
            "label": "Transformed into its behavioral opposite",
            "next": "Reaction Formation"
          }
        ]
      },
      {
        "node": "Overall maturity tier",
        "branches": [
          {
            "label": "Sublimation, altruism, humor, suppression",
            "next": "Mature — reinforce in therapy"
          },
          {
            "label": "Repression, displacement, reaction formation, intellectualization, rationalization",
            "next": "Neurotic — common, moderately adaptive"
          },
          {
            "label": "Denial, projection, splitting, acting out, regression, passive aggression",
            "next": "Immature — often a treatment target, especially in personality disorders"
          }
        ]
      }
    ]),
  },
  {
    module_number: 13,
    module_title: "Psychiatry",
    key_submodule: "Amnesia/Dissociation/Delirium",
    slug: "delirium-vs-dementia",
    title: "Delirium",
    sort_order: 3,

    hook_vignette:
      "An 82-year-old man with mild baseline forgetfulness is admitted for a urinary tract infection. Over the following 24 hours, nursing staff note he is intermittently agitated and picking at his IV line, then becomes drowsy and calm an hour later. When asked, he cannot say what day it is and insists he is still at home.",

    ddx_mapping:
      "Dementia — insidious onset over months to years, generally stable or slowly progressive course (not fluctuating hour to hour), and preserved level of consciousness/attention until late in the disease.\nDepression (\"pseudodementia\") — cognitive complaints and psychomotor slowing that track with a depressive episode, with intact attention/consciousness and often exaggerated self-report of memory loss (versus minimization in true dementia).\nNonconvulsive status epilepticus — can also present with fluctuating confusion; distinguished by EEG showing ongoing seizure activity.\nPrimary psychotic disorder — hallucinations/delusions without the fluctuating attention, disorientation, and medical trigger that define delirium.\nThe defining features that separate delirium from all of these are onset (acute to subacute, hours to days), course (fluctuating, often worse at night — \"sundowning\"), and a clouded, waxing-and-waning level of consciousness with markedly impaired attention, which is what makes delirium a medical emergency requiring urgent cause-finding rather than a primary psychiatric or neurodegenerative diagnosis.",

    diagnostic_evaluation:
      "DSM-5 delirium criteria: a disturbance in attention and awareness that develops over a short period (hours to days), represents a change from baseline, tends to fluctuate in severity over the course of a day, is accompanied by an additional cognitive disturbance (memory, language, orientation, perception), and is not better explained by a pre-existing neurocognitive disorder — with evidence the disturbance is caused by a medical condition, intoxication, or withdrawal.\nBedside screening uses the Confusion Assessment Method (CAM): acute onset/fluctuating course AND inattention, plus either disorganized thinking or an altered level of consciousness.\nBecause delirium is, by definition, caused by something, the workup is a search for the trigger: full medication reconciliation (anticholinergics, opioids, benzodiazepines, and recent medication changes are classic culprits), CBC, basic metabolic panel, urinalysis/urine culture, chest imaging, oxygen saturation, and an EKG if indicated. Cognitive testing alone cannot reliably distinguish delirium from dementia — collateral history about the patient's cognitive baseline is essential.",

    management:
      "Identify and treat the underlying cause — infection, metabolic derangement (hypoxia, hyponatremia, hypoglycemia), or drug toxicity/withdrawal — and discontinue any offending medications.\nNonpharmacologic measures are first-line for agitation: frequent reorientation (clocks, calendars, familiar objects, consistent staff and caregivers), correcting sensory deficits (glasses, hearing aids), normalizing the sleep-wake cycle, encouraging mobility, and minimizing unnecessary lines/catheters and physical restraints, all of which can worsen agitation.\nReserve low-dose antipsychotics (e.g., haloperidol) for severe agitation that poses a safety risk when nonpharmacologic measures fail, and avoid benzodiazepines in general delirium (they can worsen confusion) — except specifically for alcohol or benzodiazepine withdrawal delirium, where benzodiazepines are the treatment of choice.",

    first_order_prompt:
      "What single clinical feature most reliably distinguishes delirium from dementia?",
    first_order_answer:
      "Acute onset with a fluctuating course and impaired attention/level of consciousness (delirium) versus insidious onset with a generally stable-to-progressive course and preserved consciousness early on (dementia).",

    second_order_vignette:
      "A 74-year-old woman with known mild Alzheimer disease is brought to the emergency department by her family after two days of \"not being herself.\" She reports seeing bugs crawling on the walls, cannot state the date, and alternates between somnolence and agitation throughout the visit. Her family reports she started a new medication for overactive bladder, oxybutynin, one week ago, and that before this she was consistently pleasant and oriented, if mildly forgetful.",
    second_order_question:
      "Which of the following is the most likely explanation for this presentation?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "Natural progression of her underlying Alzheimer disease",
        "correct": false,
        "explanation": "Incorrect. Alzheimer disease progresses gradually over months to years; an abrupt, fluctuating change over two days — with new hallucinations and altered consciousness — is far too acute to represent dementia progression alone."
      },
      {
        "label": "B",
        "text": "Delirium superimposed on dementia, likely precipitated by the new anticholinergic medication",
        "correct": true,
        "explanation": "Correct. Dementia is the single strongest risk factor for delirium, and anticholinergic medications (oxybutynin is a classic culprit) are a common precipitant in older adults. The acute, fluctuating course with visual hallucinations and altered consciousness, temporally linked to a new anticholinergic, is textbook delirium superimposed on a dementia baseline."
      },
      {
        "label": "C",
        "text": "New-onset schizophrenia",
        "correct": false,
        "explanation": "Incorrect. Schizophrenia essentially never has its first onset at age 74, and it does not produce a fluctuating level of consciousness — the acute, waxing-waning course here points to a medical/delirious process, not a primary psychotic disorder."
      },
      {
        "label": "D",
        "text": "Major depressive disorder with psychotic features",
        "correct": false,
        "explanation": "Incorrect. Depression with psychotic features does not produce fluctuating consciousness or disorientation, and the abrupt onset tied to a new medication is inconsistent with a primary mood disorder."
      },
      {
        "label": "E",
        "text": "Normal aging",
        "correct": false,
        "explanation": "Incorrect. Hallucinations, disorientation, and a fluctuating level of consciousness are never a normal part of aging and always warrant an urgent search for a cause."
      }
    ]),
    second_order_answer: "B",
    second_order_explanation:
      "Delirium superimposed on dementia is common and frequently under-recognized because baseline cognitive impairment can mask the acute change. The key is comparing current presentation against a clear collateral baseline: this patient's family describes a distinct, abrupt worsening — not her usual state — which should immediately trigger a search for a precipitant, in this case a newly started anticholinergic medication, a well-known cause of delirium in older adults.",

    flowchart_title: "Delirium vs. Dementia Workup",
    flowchart: JSON.stringify([
      {
        "node": "Acute change in mental status is reported",
        "branches": [
          {
            "label": "Onset over hours to days, fluctuating course",
            "next": "Think delirium"
          },
          {
            "label": "Onset over months to years, stable or slowly progressive",
            "next": "Think dementia"
          }
        ]
      },
      {
        "node": "Assess attention and level of consciousness (delirium suspected)",
        "branches": [
          {
            "label": "Impaired attention with altered/clouded consciousness",
            "next": "Delirium confirmed (CAM positive)"
          },
          {
            "label": "Attention and consciousness intact",
            "next": "Reconsider dementia or a primary psychiatric cause"
          }
        ]
      },
      {
        "node": "Search for a precipitant",
        "branches": [
          {
            "label": "Infection (UTI, pneumonia)",
            "next": "Treat the infection"
          },
          {
            "label": "Medication (anticholinergic, opioid, benzodiazepine, polypharmacy)",
            "next": "Discontinue or taper the offending agent"
          },
          {
            "label": "Metabolic derangement (hypoxia, electrolyte abnormality, hypoglycemia)",
            "next": "Correct the metabolic derangement"
          },
          {
            "label": "No clear cause found",
            "next": "Broaden workup (EEG, neuroimaging, lumbar puncture if indicated)"
          }
        ]
      },
      {
        "node": "Manage agitation",
        "branches": [
          {
            "label": "Mild-to-moderate agitation",
            "next": "Nonpharmacologic reorientation and environmental measures first"
          },
          {
            "label": "Severe agitation with safety risk",
            "next": "Low-dose haloperidol, short-term"
          },
          {
            "label": "Alcohol or benzodiazepine withdrawal delirium",
            "next": "Benzodiazepines (not haloperidol alone)"
          }
        ]
      }
    ]),
  },
  {
    module_number: 13,
    module_title: "Psychiatry",
    key_submodule: "Psychosis",
    slug: "psychotic-disorder-timeline",
    title: "Psychotic Disorders by Timeline: Brief Psychotic Disorder, Schizophreniform Disorder, and Schizophrenia",
    sort_order: 4,

    hook_vignette:
      "A 24-year-old graduate student is brought to the emergency department by her roommates after three days of believing her thesis advisor implanted a listening device in her dorm room and that classmates are being paid to monitor her. She has not slept in two days and speaks in a disorganized, tangential manner. She has no prior psychiatric history, and the episode began the week her thesis proposal was rejected.",

    ddx_mapping:
      "Once a primary psychotic disorder is suspected, the family of diagnoses is distinguished largely by duration and by the relationship to mood episodes — always after substance use and medical causes have been excluded:\nSchizoaffective disorder — psychotic symptoms occur together with a major mood episode, but psychotic symptoms are also present for at least 2 weeks in the absence of any mood symptoms at some point in the illness.\nMood disorder with psychotic features — psychotic symptoms occur exclusively during a major depressive or manic episode and resolve when the mood episode resolves.\nSubstance/medication-induced psychotic disorder — psychotic symptoms temporally linked to intoxication or withdrawal from a substance, or to a medication.\nPsychotic disorder due to another medical condition — symptoms directly attributable to a general medical condition (e.g., CNS lesion, autoimmune encephalitis, thyroid disease).\nOnce these are excluded, the primary psychotic disorders are distinguished purely by the total duration of continuous signs of the disturbance: Brief Psychotic Disorder (1 day to less than 1 month, typically triggered by acute stress, with full return to baseline), Schizophreniform Disorder (1 to 6 months), and Schizophrenia (6 months or more, including at least 1 month of active-phase symptoms plus prodromal/residual periods).",

    diagnostic_evaluation:
      "All three share the same core symptom requirement: at least 2 of the following, with at least 1 being delusions, hallucinations, or disorganized speech — delusions, hallucinations, disorganized speech, grossly disorganized or catatonic behavior, or negative symptoms (flat affect, avolition, alogia). What differs is exclusively the duration threshold described above.\nRegardless of duration, the workup must rule out substance intoxication/withdrawal (urine toxicology screen) and medical causes (TSH, B12, RPR/HIV if clinically indicated, and neuroimaging if there are focal neurologic findings, an atypical age of onset, or an atypical clinical picture) before assigning a primary psychiatric diagnosis.",

    management:
      "Brief psychotic disorder: a short course of antipsychotic medication and close monitoring, since the episode is typically self-limited; address the precipitating psychosocial stressor once symptoms improve.\nSchizophreniform disorder: managed similarly to schizophrenia with an antipsychotic trial, but the diagnosis is provisional — the patient must be reassessed at the 6-month mark, at which point the diagnosis either resolves or converts to schizophrenia if symptoms persist.\nSchizophrenia: long-term antipsychotic therapy (first- or second-generation) is the cornerstone, paired with psychosocial treatment — cognitive behavioral therapy for psychosis, supported employment, family psychoeducation, and assertive community treatment for patients with severe/frequent relapses. Clozapine is reserved for treatment-resistant disease (failure of at least two adequate antipsychotic trials) given its efficacy but need for absolute neutrophil count monitoring (agranulocytosis risk).",

    first_order_prompt:
      "A patient has had continuous psychotic symptoms, including an active phase of hallucinations and disorganized speech, for a total of 4 months. Substance use and medical causes have been excluded. What is the diagnosis?",
    first_order_answer:
      "Schizophreniform disorder — total duration of 1 to 6 months. (If symptoms persist beyond 6 months, the diagnosis converts to schizophrenia.)",

    second_order_vignette:
      "A 19-year-old college freshman is evaluated for 7 months of progressively worsening social withdrawal, flattened affect, and poverty of speech, along with intermittent auditory hallucinations telling him his roommates are plotting against him. His symptoms have been continuously present throughout this period. Urine toxicology is negative, TSH is normal, and there is no history of a distinct depressive or manic episode.",
    second_order_question:
      "Which of the following is the most likely diagnosis?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "Schizophrenia",
        "correct": true,
        "explanation": "Correct. Continuous signs of the disturbance for 7 months (exceeding the 6-month threshold), with active-phase psychotic symptoms and negative symptoms, and with substance use and medical/mood causes excluded, meets criteria for schizophrenia."
      },
      {
        "label": "B",
        "text": "Schizophreniform disorder",
        "correct": false,
        "explanation": "Incorrect. Schizophreniform disorder is capped at 6 months of total duration; this patient's 7 months of continuous symptoms exceeds that window and meets criteria for schizophrenia instead."
      },
      {
        "label": "C",
        "text": "Brief psychotic disorder",
        "correct": false,
        "explanation": "Incorrect. Brief psychotic disorder lasts from 1 day to less than 1 month with full return to baseline; 7 months of continuous, worsening symptoms is far outside this window."
      },
      {
        "label": "D",
        "text": "Schizoaffective disorder",
        "correct": false,
        "explanation": "Incorrect. Schizoaffective disorder requires a concurrent major mood episode (depressive or manic) at some point during the illness; none is described here."
      },
      {
        "label": "E",
        "text": "Substance-induced psychotic disorder",
        "correct": false,
        "explanation": "Incorrect. Urine toxicology is negative, removing substance use as the explanation for these symptoms."
      }
    ]),
    second_order_answer: "A",
    second_order_explanation:
      "The family of primary psychotic disorders (brief psychotic disorder, schizophreniform disorder, schizophrenia) shares an identical symptom checklist and differs only by the total duration of continuous signs of illness — a detail that is easy to overlook but is usually the entire basis for the correct answer once secondary causes and mood-disorder overlap have been excluded.",

    flowchart_title: "Timeline-Based Classification of Primary Psychosis",
    flowchart: JSON.stringify([
      {
        "node": "Psychotic symptoms present — first exclude secondary causes",
        "branches": [
          {
            "label": "Positive toxicology screen or medical cause identified",
            "next": "Substance/medication-induced, or due to a medical condition — treat the cause"
          },
          {
            "label": "Substance use and medical causes excluded",
            "next": "Proceed to assess for a mood episode"
          }
        ]
      },
      {
        "node": "Assess relationship to any mood episode",
        "branches": [
          {
            "label": "Psychosis occurs only during mood episodes",
            "next": "Mood disorder with psychotic features"
          },
          {
            "label": "Psychosis + mood episode, but psychosis also present ≥2 weeks without mood symptoms",
            "next": "Schizoaffective disorder"
          },
          {
            "label": "No mood episode present",
            "next": "Proceed to assess total duration"
          }
        ]
      },
      {
        "node": "Total duration of continuous signs",
        "branches": [
          {
            "label": "1 day to <1 month, full return to baseline",
            "next": "Brief Psychotic Disorder"
          },
          {
            "label": "1 to 6 months",
            "next": "Schizophreniform Disorder"
          },
          {
            "label": "≥6 months",
            "next": "Schizophrenia"
          }
        ]
      },
      {
        "node": "Management",
        "branches": [
          {
            "label": "Brief psychotic disorder or schizophreniform disorder",
            "next": "Short antipsychotic course; reassess duration at follow-up"
          },
          {
            "label": "Schizophrenia",
            "next": "Long-term antipsychotic + psychosocial treatment; clozapine if treatment-resistant"
          }
        ]
      }
    ]),
  },
  {
    module_number: 13,
    module_title: "Psychiatry",
    key_submodule: "Mood Disorders",
    slug: "major-depressive-disorder",
    title: "Major Depressive Disorder",
    sort_order: 5,

    hook_vignette:
      "A 52-year-old accountant presents with 6 weeks of low mood and anhedonia — he no longer enjoys his weekly golf game — along with early-morning awakening, poor appetite with a 10-pound weight loss, and difficulty concentrating at work. He denies ever having had a period of elevated mood, decreased need for sleep, or grandiosity.",

    ddx_mapping:
      "Bipolar disorder — the single most important condition to screen for before starting an antidepressant, since any history of a past manic or hypomanic episode changes the diagnosis and treatment entirely (antidepressant monotherapy can precipitate a manic switch).\nPersistent depressive disorder (dysthymia) — chronic, milder depressive symptoms lasting at least 2 years, rather than a discrete 2-week episode.\nAdjustment disorder with depressed mood — clear identifiable stressor with a mood reaction that does not meet full criteria for a major depressive episode.\nNormal grief/bereavement — DSM-5 removed the automatic bereavement exclusion, but clinically, grief tends to center on the loss itself and comes in waves tied to reminders of the deceased, whereas MDD produces a more pervasive, persistent low mood and self-worth disturbance.\nHypothyroidism and other medical mimics — screened for with labs before finalizing a psychiatric diagnosis.\nSubstance-induced mood disorder — temporally linked to intoxication, withdrawal, or a medication (e.g., interferon, corticosteroids).",

    diagnostic_evaluation:
      "DSM-5 requires at least 5 of the 9 SIGECAPS symptoms (Sleep change, loss of Interest/anhedonia, Guilt/worthlessness, low Energy, poor Concentration, Appetite/weight change, Psychomotor agitation or retardation, and Suicidal ideation) present for at least 2 weeks, with at least one of the 5 being depressed mood or anhedonia, causing clinically significant impairment, and not attributable to a substance or medical condition.\nCritically, the patient must also have no history of a manic or hypomanic episode — if one is present, the diagnosis is bipolar disorder instead, regardless of how the current episode looks.\nThe PHQ-9 is a useful screening/severity tool. Baseline labs to exclude medical mimics include TSH, CBC, and vitamin B12, with toxicology screening if substance use is suspected.",

    management:
      "For mild-to-moderate depression, psychotherapy alone (CBT or interpersonal therapy) is a reasonable first-line option.\nFor moderate-to-severe depression, an SSRI is first-line pharmacotherapy, typically combined with psychotherapy; if there is inadequate response after an adequate 4–6 week trial at an adequate dose, options include switching to another agent or augmentation.\nFor treatment-resistant depression, options include switching drug class (SNRI, bupropion, mirtazapine), augmentation with an atypical antipsychotic or lithium, or electroconvulsive therapy (ECT) — ECT is also preferred for severe depression with psychotic features, catatonia, high acute suicide risk, or during pregnancy when rapid, reliable response is needed.\nSuicide risk must be assessed at every visit regardless of chosen treatment.",

    first_order_prompt:
      "How many of the 9 SIGECAPS symptoms are required, and for how long, to diagnose a major depressive episode?",
    first_order_answer:
      "At least 5 of the 9 SIGECAPS symptoms (including depressed mood or anhedonia) for at least 2 weeks.",

    second_order_vignette:
      "A 34-year-old woman started on sertraline 3 weeks ago for depression returns to clinic talkative and energetic. She reports needing only 3 hours of sleep per night and feeling \"more productive than ever\" — she has started three new business ventures in the past week and maxed out a credit card on supplies for them. Her family says she is \"not herself,\" describing her as irritable and speaking unusually fast.",
    second_order_question:
      "Which of the following best explains this presentation, and what is the most appropriate next step?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "The sertraline is working as intended; continue the current dose",
        "correct": false,
        "explanation": "Incorrect. Decreased need for sleep, grandiosity/excessive goal-directed activity, and impulsive spending are core manic symptoms, not a normal antidepressant response."
      },
      {
        "label": "B",
        "text": "This represents an antidepressant-induced manic switch, suggesting underlying bipolar disorder; discontinue the antidepressant and start a mood stabilizer",
        "correct": true,
        "explanation": "Correct. A manic or hypomanic episode emerging during antidepressant treatment is highly suggestive of an underlying bipolar diathesis unmasked by the antidepressant. The appropriate next step is to stop the antidepressant (to avoid worsening or prolonging the manic episode) and initiate a mood stabilizer, and to revise the diagnosis from unipolar MDD to bipolar disorder."
      },
      {
        "label": "C",
        "text": "This represents generalized anxiety disorder; increase the sertraline dose",
        "correct": false,
        "explanation": "Incorrect. GAD does not produce decreased need for sleep, grandiosity, or impulsive overspending — these are manic, not anxious, symptoms — and increasing the antidepressant would likely worsen the mania."
      },
      {
        "label": "D",
        "text": "This is a normal SSRI side effect and requires no change in management",
        "correct": false,
        "explanation": "Incorrect. A full manic episode is not a benign, expected SSRI side effect — it requires stopping the antidepressant and starting mood-stabilizing treatment."
      },
      {
        "label": "E",
        "text": "This represents malingering",
        "correct": false,
        "explanation": "Incorrect. There is no external incentive described, and the temporal link to starting an antidepressant with classic manic symptoms points to a genuine pharmacologically triggered mood switch, not feigned symptoms."
      }
    ]),
    second_order_answer: "B",
    second_order_explanation:
      "Any manic or hypomanic episode — even one that appears only after starting an antidepressant — reclassifies the patient's diagnosis from major depressive disorder to bipolar disorder, because antidepressant monotherapy in bipolar disorder can precipitate exactly this kind of switch. This is precisely why screening for a personal history of mania/hypomania is mandatory before starting antidepressant monotherapy for a depressive episode.",

    flowchart_title: "Evaluating a Depressive Episode",
    flowchart: JSON.stringify([
      {
        "node": "Patient reports depressive symptoms for ≥2 weeks",
        "branches": [
          {
            "label": "<5 SIGECAPS symptoms, or a clear stressor without meeting full criteria",
            "next": "Consider adjustment disorder with depressed mood"
          },
          {
            "label": "≥5 SIGECAPS symptoms, meeting full criteria",
            "next": "Proceed to screen for mania/hypomania"
          }
        ]
      },
      {
        "node": "Screen for any history of mania or hypomania",
        "branches": [
          {
            "label": "History positive (even one past episode)",
            "next": "Bipolar disorder — avoid antidepressant monotherapy, use a mood stabilizer"
          },
          {
            "label": "History negative",
            "next": "Major Depressive Disorder"
          }
        ]
      },
      {
        "node": "Rule out medical or substance causes",
        "branches": [
          {
            "label": "Abnormal TSH or substance use identified",
            "next": "Treat the underlying cause first"
          },
          {
            "label": "Workup unremarkable",
            "next": "Proceed to select treatment by severity"
          }
        ]
      },
      {
        "node": "Choose initial treatment by severity",
        "branches": [
          {
            "label": "Mild-to-moderate",
            "next": "Psychotherapy (CBT/IPT), with or without an SSRI"
          },
          {
            "label": "Moderate-to-severe",
            "next": "SSRI + psychotherapy"
          },
          {
            "label": "Psychotic features, catatonia, or high acute suicide risk",
            "next": "Consider ECT / urgent psychiatric admission"
          }
        ]
      }
    ]),
  },
  {
    module_number: 13,
    module_title: "Psychiatry",
    key_submodule: "Anxiety Spectrum",
    slug: "panic-disorder",
    title: "Panic Disorder",
    sort_order: 6,

    hook_vignette:
      "A 29-year-old woman presents to the emergency department for the third time this month with sudden chest tightness, palpitations, shortness of breath, dizziness, and a sense of impending doom that peaked within about 10 minutes and resolved over the next half hour. Cardiac workup, including troponin and EKG, has been unremarkable on each visit. She now avoids the subway for fear of having another attack while trapped underground.",

    ddx_mapping:
      "Cardiac causes (acute coronary syndrome, arrhythmia) and pulmonary causes (pulmonary embolism, asthma exacerbation) — must be excluded first given overlapping symptoms.\nEndocrine causes — hyperthyroidism, pheochromocytoma, and hypoglycemia can all mimic panic attacks.\nSubstance intoxication or withdrawal — caffeine, stimulants, and alcohol withdrawal are common triggers of panic-like symptoms.\nGeneralized anxiety disorder — chronic, diffuse worry without discrete, abrupt attacks.\nSpecific phobia — panic occurs only when confronted with a specific object or situation (e.g., heights, animals).\nSocial anxiety disorder — panic occurs only in social or performance situations involving potential scrutiny by others.\nPosttraumatic stress disorder — panic-like symptoms triggered specifically by reminders of a traumatic event.\nThe defining feature of panic disorder itself is that at least some attacks are unexpected (not tied to a specific trigger), plus persistent worry or behavior change (like this patient's subway avoidance) following the attacks.",

    diagnostic_evaluation:
      "DSM-5 requires recurrent unexpected panic attacks — an abrupt surge of intense fear or discomfort peaking within about 10 minutes, with at least 4 of: palpitations, sweating, trembling, shortness of breath, sensation of choking, chest pain, nausea, dizziness, chills or heat sensations, paresthesias, derealization/depersonalization, fear of losing control, and fear of dying — plus at least 1 month of persistent worry about additional attacks or a significant maladaptive change in behavior (such as avoidance) following at least one attack.\nBecause the physical symptoms overlap heavily with medical emergencies, initial workup should include an EKG, TSH, and, when suspicion is high, a urine toxicology screen or glucose check — a general medical condition or substance must be excluded before attributing the attacks to panic disorder.",

    management:
      "First-line treatment is cognitive behavioral therapy — including interoceptive exposure (deliberately inducing feared bodily sensations in a controlled setting to reduce their threat value) — and/or an SSRI or SNRI.\nBenzodiazepines can provide rapid short-term symptom control during an acute attack or while waiting for an SSRI/SNRI to take effect, but are not appropriate for long-term monotherapy given dependence and tolerance risk.\nPatients should also be counseled to reduce caffeine and stimulant intake, which can trigger or worsen attacks.",

    first_order_prompt:
      "What time course defines the \"peak\" of a panic attack per DSM-5?",
    first_order_answer:
      "An abrupt surge of intense fear or discomfort that peaks within about 10 minutes.",

    second_order_vignette:
      "A 22-year-old man refuses to attend his college classes because he fears having to give an in-class presentation in front of his peers. He reports intense anxiety, sweating, and a racing heart only in these performance situations, but is entirely comfortable in other settings, including riding a crowded bus alone.",
    second_order_question:
      "Which of the following is the most likely diagnosis?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "Panic disorder",
        "correct": false,
        "explanation": "Incorrect. His attacks are always situationally bound to performance/social scrutiny rather than occurring unexpectedly \"out of the blue,\" which is the defining feature of panic disorder."
      },
      {
        "label": "B",
        "text": "Social anxiety disorder (social phobia)",
        "correct": true,
        "explanation": "Correct. Anxiety symptoms that occur specifically and consistently in social or performance situations involving potential scrutiny by others, with comfort in non-social settings, is the classic presentation of social anxiety disorder."
      },
      {
        "label": "C",
        "text": "Generalized anxiety disorder",
        "correct": false,
        "explanation": "Incorrect. GAD involves diffuse, free-floating worry across many areas of life, not anxiety confined to one specific situational trigger."
      },
      {
        "label": "D",
        "text": "Specific phobia",
        "correct": false,
        "explanation": "Incorrect. Specific phobia is triggered by a discrete object or situation like heights, animals, or needles — not by social evaluation, which is the trigger for social anxiety disorder specifically."
      },
      {
        "label": "E",
        "text": "Agoraphobia",
        "correct": false,
        "explanation": "Incorrect. Agoraphobia involves fear of situations where escape might be difficult or help unavailable (e.g., crowds, open spaces); this patient is explicitly comfortable in a crowded bus, which argues against agoraphobia."
      }
    ]),
    second_order_answer: "B",
    second_order_explanation:
      "Distinguishing anxiety disorders hinges on identifying exactly what triggers the anxiety and whether attacks are expected/situational or unexpected. Panic disorder is defined by at least some unexpected attacks plus ongoing worry/avoidance after them; when anxiety is consistently and specifically triggered by social/performance scrutiny, social anxiety disorder is the better fit even when the physical symptoms mimic a panic attack.",

    flowchart_title: "Working Up Episodic Anxiety Symptoms",
    flowchart: JSON.stringify([
      {
        "node": "Patient has discrete episodes of intense fear or physical symptoms",
        "branches": [
          {
            "label": "Attacks always triggered by a specific situation",
            "next": "Situational — consider social anxiety disorder, specific phobia, or agoraphobia"
          },
          {
            "label": "Attacks occur unexpectedly, \"out of the blue\"",
            "next": "Proceed to rule out medical/substance mimics"
          }
        ]
      },
      {
        "node": "Rule out medical and substance mimics",
        "branches": [
          {
            "label": "Abnormal EKG, TSH, or toxicology screen",
            "next": "Treat the underlying medical or substance cause"
          },
          {
            "label": "Workup negative",
            "next": "Proceed to assess for ongoing worry/avoidance"
          }
        ]
      },
      {
        "node": "Assess for ≥1 month of anticipatory anxiety or avoidance after attacks",
        "branches": [
          {
            "label": "Present",
            "next": "Panic Disorder"
          },
          {
            "label": "Absent (isolated attacks only)",
            "next": "Panic attacks without panic disorder — monitor"
          }
        ]
      },
      {
        "node": "Initial management of confirmed panic disorder",
        "branches": [
          {
            "label": "Preference for therapy, or mild-to-moderate symptoms",
            "next": "CBT with interoceptive exposure"
          },
          {
            "label": "Moderate-to-severe, ongoing symptoms",
            "next": "SSRI or SNRI + CBT"
          },
          {
            "label": "Acute, severe symptom control needed",
            "next": "Short-term benzodiazepine as a bridge only"
          }
        ]
      }
    ]),
  },
  {
    module_number: 13,
    module_title: "Psychiatry",
    key_submodule: "Personality Disorders",
    slug: "borderline-personality-disorder",
    title: "Borderline Personality Disorder",
    sort_order: 7,

    hook_vignette:
      "A 26-year-old woman presents two days after a superficial wrist-cutting episode that followed a breakup. She describes a pattern, dating back to her late teens, of intense and unstable relationships that swing between idealizing new partners and abruptly devaluing them, chronic feelings of emptiness, an intense fear of being abandoned, and several past episodes of self-injury during periods of interpersonal conflict.",

    ddx_mapping:
      "Bipolar disorder — mood shifts in borderline personality disorder are reactive, brief (minutes to hours), and directly tied to interpersonal triggers, whereas bipolar episodes last days to weeks and are less dependent on immediate interpersonal events.\nNarcissistic personality disorder — dominated by grandiosity, need for admiration, and lack of empathy, without the chronic emptiness, abandonment fear, and recurrent self-harm central to BPD.\nHistrionic personality disorder — dominated by attention-seeking and shallow, rapidly shifting emotional expression, without BPD's core identity disturbance and self-injurious behavior.\nAntisocial personality disorder — dominated by disregard for others' rights and deceit for personal gain, rather than fear of abandonment.\nPTSD / complex trauma — frequently comorbid and with overlapping history of early trauma, but the core presentation of PTSD centers on re-experiencing/avoidance of a specific trauma rather than a pervasive identity disturbance and relational instability.\nMajor depressive disorder — mood symptoms in MDD are more pervasive and less reactive to momentary interpersonal events than the affective instability of BPD.",

    diagnostic_evaluation:
      "DSM-5 requires at least 5 of 9 criteria: frantic efforts to avoid real or imagined abandonment; a pattern of unstable, intense relationships alternating between idealization and devaluation; identity disturbance (markedly unstable self-image); impulsivity in at least 2 potentially self-damaging areas (spending, sex, substance use, reckless driving, binge eating); recurrent suicidal behavior, gestures, threats, or self-mutilation; affective instability due to marked mood reactivity (intense episodic dysphoria lasting hours); chronic feelings of emptiness; inappropriate, intense anger or difficulty controlling anger; and transient, stress-related paranoid ideation or severe dissociative symptoms.\nThis is a pervasive pattern that must begin by early adulthood and be present across multiple contexts — it is a longitudinal, history-based clinical diagnosis (ideally corroborated with collateral history), not something diagnosed from a single crisis presentation.",

    management:
      "First-line treatment is psychotherapy. Dialectical Behavior Therapy (DBT) is the best-studied approach, combining individual therapy with a skills group targeting emotion regulation, distress tolerance, interpersonal effectiveness, and mindfulness. Other evidence-based options include mentalization-based therapy and transference-focused psychotherapy.\nNo medication is FDA-approved to treat borderline personality disorder itself. Pharmacotherapy is used adjunctively and symptom-targeted — for example, an SSRI for comorbid depression/anxiety, or a low-dose second-generation antipsychotic for transient stress-related psychotic or dissociative symptoms. Long-term benzodiazepines are generally avoided given disinhibition and dependence risk in this population.",

    first_order_prompt:
      "What is the first-line, evidence-based psychotherapy for borderline personality disorder?",
    first_order_answer:
      "Dialectical Behavior Therapy (DBT).",

    second_order_vignette:
      "A 24-year-old man in his third serious relationship this year describes each new partner as \"perfect — the only person who has ever understood me\" within just a few weeks of dating, then abruptly calls them \"worthless and cruel\" after a minor disagreement. He also describes chronically feeling \"empty inside\" and has a history of cutting his forearms whenever a partner threatens to leave him.",
    second_order_question:
      "Which of the following is the most likely diagnosis?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "Borderline personality disorder",
        "correct": true,
        "explanation": "Correct. Idealization-devaluation cycling in relationships, chronic emptiness, intense abandonment fear, and self-harm tied to relational rejection together meet the criteria for borderline personality disorder."
      },
      {
        "label": "B",
        "text": "Bipolar II disorder",
        "correct": false,
        "explanation": "Incorrect. His mood shifts occur over minutes to hours and are directly triggered by interpersonal rejection, rather than representing discrete, sustained hypomanic episodes lasting days as required for bipolar II."
      },
      {
        "label": "C",
        "text": "Narcissistic personality disorder",
        "correct": false,
        "explanation": "Incorrect. This vignette lacks the grandiosity, entitlement, and need for admiration that define narcissistic personality disorder; his devaluation of partners is reactive to fear of abandonment, not rooted in a sense of superiority."
      },
      {
        "label": "D",
        "text": "Histrionic personality disorder",
        "correct": false,
        "explanation": "Incorrect. The core feature of histrionic personality disorder is attention-seeking and shallow emotional expression, not the abandonment fear and self-injury described here."
      },
      {
        "label": "E",
        "text": "Adjustment disorder",
        "correct": false,
        "explanation": "Incorrect. This is a longstanding, pervasive relational pattern that has repeated across multiple relationships since young adulthood, not a time-limited reaction to a single recent stressor."
      }
    ]),
    second_order_answer: "A",
    second_order_explanation:
      "The idealization-devaluation cycle (\"splitting\") combined with chronic emptiness, frantic efforts to avoid abandonment, and self-injury tied to relational rejection is the classic presentation of borderline personality disorder. The key differentiator from bipolar disorder is that the mood shifts here are reactive and brief rather than sustained, discrete episodes independent of interpersonal triggers.",

    flowchart_title: "Recognizing Borderline Personality Disorder",
    flowchart: JSON.stringify([
      {
        "node": "Pattern of unstable relationships and self-harm — when did it begin?",
        "branches": [
          {
            "label": "Onset by early adulthood, pervasive across relationships and contexts",
            "next": "Proceed to count DSM-5 criteria"
          },
          {
            "label": "Isolated to one recent stressor or relationship",
            "next": "Consider adjustment disorder instead"
          }
        ]
      },
      {
        "node": "Count DSM-5 criteria (abandonment fear, unstable relationships, identity disturbance, impulsivity, self-harm, affective instability, emptiness, anger, stress-related paranoia/dissociation)",
        "branches": [
          {
            "label": "≥5 criteria present",
            "next": "Borderline Personality Disorder"
          },
          {
            "label": "<5 criteria present",
            "next": "Consider another Cluster B disorder, or trait-level features only"
          }
        ]
      },
      {
        "node": "Characterize the mood shifts",
        "branches": [
          {
            "label": "Hours in duration, tied to interpersonal triggers",
            "next": "Consistent with BPD affective instability"
          },
          {
            "label": "Days to weeks, less reactive, with true hypomanic/manic symptoms",
            "next": "Reconsider bipolar disorder"
          }
        ]
      },
      {
        "node": "Treatment approach",
        "branches": [
          {
            "label": "Confirmed BPD",
            "next": "Dialectical Behavior Therapy as first-line"
          },
          {
            "label": "Comorbid depression or anxiety",
            "next": "Adjunctive SSRI"
          },
          {
            "label": "Acute, transient stress-related psychotic/dissociative symptoms",
            "next": "Short-term, low-dose second-generation antipsychotic"
          }
        ]
      }
    ]),
  },
  {
    module_number: 13,
    module_title: "Psychiatry",
    key_submodule: "Factitious/Somatic",
    slug: "somatic-symptom-disorder-factitious-disorder-malingering",
    title: "Somatic Symptom Disorder, Factitious Disorder, and Malingering",
    sort_order: 8,

    hook_vignette:
      "A 38-year-old woman is admitted for the fifth time this year with recurrent, unexplained hypoglycemic episodes. A nurse finds insulin syringes hidden in her hospital bag, though she denies using them and continues to request additional testing, insisting she wants to \"find out what's really wrong\" with her.",

    ddx_mapping:
      "These conditions are best distinguished by two questions: are the symptoms intentionally produced, and if so, what is the underlying goal?\nSomatic symptom disorder — one or more genuinely experienced (not intentionally produced) somatic symptoms, accompanied by excessive, disproportionate thoughts, anxiety, or behavior related to those symptoms; there is no external goal.\nIllness anxiety disorder — persistent preoccupation with having or acquiring a serious illness, with minimal or absent actual somatic symptoms, despite reassurance and appropriate workup.\nConversion disorder (functional neurological symptom disorder) — a neurologic symptom (e.g., weakness, nonepileptic seizures) that is incompatible with recognized neurologic disease, and is not intentionally produced.\nFactitious disorder (imposed on self) — symptoms are intentionally produced or feigned, and the motivation is internal: an unconscious or semi-conscious psychological need to assume the sick role and receive medical attention, with no obvious external incentive.\nFactitious disorder imposed on another (formerly Munchausen syndrome by proxy) — a caregiver intentionally produces or feigns illness in a dependent (classically a child) for that same internal psychological gain.\nMalingering — symptoms are intentionally produced or feigned, but the motivation is an external, tangible incentive (avoiding work or legal responsibility, obtaining disability payments, drugs, or housing); it is not classified as a mental disorder.",

    diagnostic_evaluation:
      "Evaluation centers on three questions: is the symptom real, exaggerated, or fabricated? Is its production intentional? And what is the apparent goal — an internal psychological need for the sick role, or an external tangible gain?\nClues supporting factitious disorder or malingering include objective evidence of self-induced findings (for example, factitious hypoglycemia shows a low C-peptide with detectable exogenous insulin, since endogenous insulin secretion would raise C-peptide along with it), materials found in the patient's possession consistent with self-induced illness, a pattern of repeated presentations across multiple providers or hospitals (\"doctor shopping\"), and a marked discrepancy between reported symptom severity and objective findings.\nMalingering is further supported by a clear, identifiable external incentive (an upcoming disability hearing, active litigation, or avoidance of a legal/work obligation) closely tied in time to the symptom presentation.",

    management:
      "Somatic symptom disorder: scheduled, regular visits with a single primary provider (rather than symptom-driven, as-needed visits), cognitive behavioral therapy, minimizing unnecessary testing and procedures (which tends to reinforce the pattern), and treating any comorbid anxiety or depression.\nFactitious disorder: a nonconfrontational approach that avoids directly accusing the patient, minimizes unnecessary invasive workups, and involves psychiatry to address the underlying psychological need; factitious disorder imposed on another requires mandatory reporting to child (or dependent adult) protective services to protect the victim.\nMalingering: not itself a treatable psychiatric illness — the appropriate approach is to identify and address the external incentive, document findings objectively, and avoid inadvertently reinforcing secondary gain, such as by prescribing controlled substances or excusing work/legal obligations without clear medical justification.",

    first_order_prompt:
      "What single factor best distinguishes malingering from factitious disorder?",
    first_order_answer:
      "The underlying motivation: malingering is driven by an external, tangible incentive (money, avoiding legal or work obligations), while factitious disorder is driven by an internal psychological need to assume the sick role, with no obvious external gain.",

    second_order_vignette:
      "A 45-year-old man involved in a workplace slip-and-fall two weeks before a scheduled disability hearing presents with severe, inconsistent low back pain. On repeated strength testing he gives markedly variable effort, and both imaging and a detailed neurologic exam are entirely normal. During the visit he mentions, unprompted, that his disability claim requires documentation that he \"can't work.\"",
    second_order_question:
      "Which of the following is the most likely explanation for this presentation?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "Conversion disorder",
        "correct": false,
        "explanation": "Incorrect. Conversion disorder symptoms are not intentionally produced and are not driven by an external incentive; the inconsistent effort and clear financial motive here point to intentional symptom exaggeration instead."
      },
      {
        "label": "B",
        "text": "Malingering",
        "correct": true,
        "explanation": "Correct. A clear external incentive (the pending disability claim), combined with inconsistent effort on exam and normal objective findings, is the classic pattern of malingering — intentional symptom production or exaggeration for tangible external gain."
      },
      {
        "label": "C",
        "text": "Somatic symptom disorder",
        "correct": false,
        "explanation": "Incorrect. There is no evidence of genuine, disproportionate internal distress about a real symptom; instead there is inconsistent effort and an overt external incentive suggesting intentional exaggeration."
      },
      {
        "label": "D",
        "text": "Factitious disorder",
        "correct": false,
        "explanation": "Incorrect. There is no evidence of an internal psychological need to assume the sick role; his stated goal is explicitly the external disability payment, which defines malingering rather than factitious disorder."
      },
      {
        "label": "E",
        "text": "Illness anxiety disorder",
        "correct": false,
        "explanation": "Incorrect. He shows no preoccupation with or fear of having an undiagnosed serious illness — he already has an explanation for his symptoms (the fall) and a clear financial goal."
      }
    ]),
    second_order_answer: "B",
    second_order_explanation:
      "The combination of an identifiable external incentive, inconsistent/exaggerated exam findings (such as variable effort on formal strength testing), and normal objective workup should raise suspicion for malingering. This is a behavioral pattern rather than a mental illness, and management focuses on objective documentation rather than psychiatric treatment.",

    flowchart_title: "Distinguishing Somatic Symptom Conditions",
    flowchart: JSON.stringify([
      {
        "node": "Are the symptoms intentionally produced or fabricated?",
        "branches": [
          {
            "label": "No — patient genuinely experiences them",
            "next": "Consider somatic symptom disorder or illness anxiety disorder"
          },
          {
            "label": "Yes — intentionally produced or fabricated",
            "next": "Proceed to assess the underlying goal"
          }
        ]
      },
      {
        "node": "What is the underlying goal of intentional symptom production?",
        "branches": [
          {
            "label": "Internal psychological need to assume the sick role, no clear external gain",
            "next": "Factitious disorder (imposed on self, or on another if perpetrated on a dependent)"
          },
          {
            "label": "Clear external, tangible incentive (money, avoiding work or legal duty)",
            "next": "Malingering"
          }
        ]
      },
      {
        "node": "If symptoms are genuine — what is the primary feature?",
        "branches": [
          {
            "label": "Disproportionate distress or behavior about real somatic symptoms",
            "next": "Somatic Symptom Disorder"
          },
          {
            "label": "Preoccupation with having a serious illness, few or no actual symptoms",
            "next": "Illness Anxiety Disorder"
          },
          {
            "label": "Neurologic symptom incompatible with disease, not intentionally produced",
            "next": "Conversion Disorder"
          }
        ]
      },
      {
        "node": "Management approach",
        "branches": [
          {
            "label": "Somatic symptom disorder or illness anxiety disorder",
            "next": "Scheduled visits with one provider, CBT, minimize unnecessary testing"
          },
          {
            "label": "Factitious disorder",
            "next": "Nonconfrontational psychiatric involvement; mandatory report if imposed on a dependent"
          },
          {
            "label": "Malingering",
            "next": "Identify and address the external incentive; avoid reinforcing secondary gain"
          }
        ]
      }
    ]),
  },
  {
    module_number: 13,
    module_title: "Psychiatry",
    key_submodule: "Eating Disorders",
    slug: "anorexia-nervosa",
    title: "Anorexia Nervosa",
    sort_order: 9,

    hook_vignette:
      "A 17-year-old girl is brought in by her mother for amenorrhea and progressive weight loss. She has a BMI of 16, restricts her intake to under 800 kcal per day, and exercises for two hours daily, yet insists she is \"still too big\" despite visible cachexia. On exam she has fine lanugo hair on her back and a resting heart rate of 42.",

    ddx_mapping:
      "Bulimia nervosa — recurrent binge-purge cycles, but body weight is typically within or above the normal range, lacking the significantly low body weight that defines anorexia nervosa.\nAvoidant/restrictive food intake disorder (ARFID) — food restriction without any body-image disturbance or fear of weight gain, driven instead by things like sensory sensitivity or fear of choking/vomiting.\nMajor depressive disorder — appetite loss and weight change can occur, but are not driven by body-image distortion or a specific fear of gaining weight.\nOrganic causes of weight loss — hyperthyroidism, malignancy, and inflammatory bowel disease can all cause significant weight loss but without the body-image disturbance and intentional restriction seen in anorexia nervosa.\nBody dysmorphic disorder — preoccupation with a specific perceived physical defect, rather than a global fear of fatness organized around eating and weight.",

    diagnostic_evaluation:
      "DSM-5 requires restriction of energy intake leading to a significantly low body weight (relative to age, sex, developmental trajectory, and physical health), an intense fear of gaining weight or persistent behavior that interferes with weight gain, and a disturbance in the way body weight or shape is experienced, or persistent lack of recognition of the seriousness of the current low body weight. Subtypes are restricting type and binge-eating/purging type.\nWorkup includes weight/BMI trend, vital signs (bradycardia, hypotension, and hypothermia reflect a hypometabolic adaptation to starvation), an EKG (QTc prolongation and arrhythmia risk), electrolytes (hypokalemia especially if purging is present), a CBC, and a DEXA scan if amenorrhea has been prolonged (osteoporosis risk from chronic estrogen deficiency). Note that DSM-5 removed amenorrhea as a required diagnostic criterion, though it remains a very common associated finding.",

    management:
      "Care is multidisciplinary: nutritional rehabilitation with careful, gradual caloric reintroduction, monitoring closely for refeeding syndrome; psychotherapy — family-based treatment (\"the Maudsley method\") is first-line, especially for adolescents, while cognitive behavioral therapy is favored for adults; and ongoing medical monitoring for cardiac and bone complications.\nNo medication is first-line or FDA-approved to treat the core restrictive eating behavior of anorexia nervosa itself; SSRIs may help treat comorbid depression or anxiety but do not reliably drive weight restoration on their own.\nInpatient medical admission is indicated for severe bradycardia, hypotension, significant electrolyte derangement, or other signs of medical instability.",

    first_order_prompt:
      "What life-threatening metabolic complication must be monitored for during early nutritional rehabilitation of a severely malnourished anorexia nervosa patient?",
    first_order_answer:
      "Refeeding syndrome — hypophosphatemia (along with hypokalemia and hypomagnesemia), which can precipitate cardiac arrhythmia and heart failure; caloric intake must be reintroduced gradually with close electrolyte monitoring.",

    second_order_vignette:
      "A 20-year-old college student with a BMI of 19 (within the normal range) presents with recurrent episodes, occurring roughly twice weekly for the past 4 months, of eating unusually large amounts of food in under two hours with a sense of loss of control, followed each time by self-induced vomiting. She reports that her self-evaluation is \"unduly influenced by my weight and shape.\"",
    second_order_question:
      "Which of the following is the most likely diagnosis?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "Anorexia nervosa, binge-eating/purging type",
        "correct": false,
        "explanation": "Incorrect. Anorexia nervosa requires a significantly low body weight; this patient's BMI is within the normal range, which is the key feature ruling out anorexia nervosa here."
      },
      {
        "label": "B",
        "text": "Bulimia nervosa",
        "correct": true,
        "explanation": "Correct. Recurrent binge eating with a sense of loss of control, followed by compensatory purging, occurring at least weekly for 3 months, with self-evaluation unduly influenced by body shape/weight, and body weight in or above the normal range, meets criteria for bulimia nervosa."
      },
      {
        "label": "C",
        "text": "Binge eating disorder",
        "correct": false,
        "explanation": "Incorrect. Binge eating disorder involves recurrent binges without the regular compensatory behaviors (such as self-induced vomiting) that this patient displays."
      },
      {
        "label": "D",
        "text": "Avoidant/restrictive food intake disorder (ARFID)",
        "correct": false,
        "explanation": "Incorrect. ARFID involves food avoidance/restriction without body-image disturbance, and does not involve a binge-purge behavioral pattern."
      },
      {
        "label": "E",
        "text": "Major depressive disorder with atypical features",
        "correct": false,
        "explanation": "Incorrect. While atypical depression can feature increased appetite, it does not capture the discrete, recurrent binge-purge cycle and body-image-driven self-evaluation described here."
      }
    ]),
    second_order_answer: "B",
    second_order_explanation:
      "The single most important feature separating bulimia nervosa from anorexia nervosa, binge-eating/purging type, is body weight: bulimia nervosa occurs at a normal or above-normal body weight, whereas the binge-eating/purging subtype of anorexia nervosa still requires the same significantly-low-body-weight criterion as the restricting subtype.",

    flowchart_title: "Working Up Disordered Eating and Weight Loss",
    flowchart: JSON.stringify([
      {
        "node": "Patient has significant weight loss, low body weight, or disordered eating behavior",
        "branches": [
          {
            "label": "Body-image distortion or fear of weight gain drives restriction",
            "next": "Proceed to assess body weight"
          },
          {
            "label": "No body-image disturbance (e.g., sensory aversion, fear of choking)",
            "next": "Consider ARFID"
          },
          {
            "label": "Organic cause suspected (thyroid disease, malignancy, GI disease)",
            "next": "Medical workup for organic weight loss"
          }
        ]
      },
      {
        "node": "Is body weight significantly low for age, sex, and development?",
        "branches": [
          {
            "label": "Yes, with body-image distortion or fear of weight gain",
            "next": "Anorexia Nervosa"
          },
          {
            "label": "No — weight normal or elevated, with recurrent binge-purge cycles",
            "next": "Proceed to assess compensatory behavior"
          }
        ]
      },
      {
        "node": "Binge eating with or without compensatory behavior?",
        "branches": [
          {
            "label": "Binges + compensatory purging, laxatives, or excessive exercise",
            "next": "Bulimia Nervosa"
          },
          {
            "label": "Binges without compensatory behavior",
            "next": "Binge Eating Disorder"
          }
        ]
      },
      {
        "node": "Assess medical acuity",
        "branches": [
          {
            "label": "Bradycardia, QTc prolongation, or severe electrolyte derangement",
            "next": "Inpatient medical stabilization + cautious, gradual refeeding"
          },
          {
            "label": "Medically stable",
            "next": "Outpatient family-based therapy (adolescents) or CBT (adults), plus nutritional rehabilitation"
          }
        ]
      }
    ]),
  },
  {
    module_number: 13,
    module_title: "Psychiatry",
    key_submodule: "Pharmacology and Drug Emergencies",
    slug: "serotonin-syndrome",
    title: "Serotonin Syndrome",
    sort_order: 10,

    hook_vignette:
      "A 26-year-old woman on fluoxetine for depression takes tramadol for a headache. Within a few hours she develops agitation, diaphoresis, tremor, and diarrhea. On exam she has hyperreflexia with inducible clonus in her lower extremities, and her temperature is 39.4°C.",

    ddx_mapping:
      "Neuroleptic malignant syndrome (NMS) — triggered by antipsychotic (dopamine-blocking) exposure rather than serotonergic drugs, with onset over days rather than hours, \"lead-pipe\" rigidity, and hyporeflexia rather than the hyperreflexia and clonus seen in serotonin syndrome.\nMalignant hyperthermia — triggered by inhaled anesthetics or succinylcholine, occurring intraoperatively, with generalized muscle rigidity.\nAnticholinergic toxicity — presents with dry, flushed skin and dry mucous membranes, urinary retention, and absent bowel sounds (\"dry as a bone\"), in contrast to the diaphoresis, diarrhea (hyperactive bowel sounds), and clonus of serotonin syndrome.\nSepsis or CNS infection — fever and altered mental status, but without clonus and without a recent serotonergic drug exposure.\nSympathomimetic/stimulant intoxication — can overlap with agitation and hyperthermia, but typically lacks the specific combination of a serotonergic drug trigger and prominent clonus/hyperreflexia.",

    diagnostic_evaluation:
      "Serotonin syndrome is a clinical diagnosis, commonly applied using the Hunter Criteria: in a patient who has taken a serotonergic agent, the presence of spontaneous clonus, OR inducible clonus plus agitation or diaphoresis, OR ocular clonus plus agitation or diaphoresis, OR tremor plus hyperreflexia, OR hypertonia plus a temperature above 38°C plus ocular or inducible clonus.\nOnset is rapid, typically within 24 hours (often within hours) of starting, increasing the dose of, or combining serotonergic agents — classic culprits include SSRIs, SNRIs, MAOIs, tramadol, linezolid, triptans, MDMA, and St. John's Wort.\nLaboratory findings (elevated CK, leukocytosis) are nonspecific and supportive only — there is no confirmatory lab test, and the diagnosis rests on the clinical picture and medication history.",

    management:
      "The first and most important step is immediate discontinuation of all serotonergic agents.\nSupportive care follows: IV fluids, active cooling for hyperthermia, and benzodiazepines for agitation, which also help reduce muscle rigidity and indirectly control hyperthermia caused by excessive muscle activity.\nCyproheptadine, a serotonin antagonist, is used for moderate-to-severe cases that do not respond adequately to supportive care alone.\nPhysical restraints should be avoided, since isometric struggling against restraints can worsen hyperthermia and precipitate rhabdomyolysis; severe cases with marked hyperthermia and rigidity may require intubation and neuromuscular blockade with a non-depolarizing agent. Most cases resolve within 24–72 hours of stopping the offending agent(s) with supportive management.",

    first_order_prompt:
      "What exam finding helps distinguish serotonin syndrome from neuroleptic malignant syndrome?",
    first_order_answer:
      "Hyperreflexia and clonus (especially inducible or lower-extremity clonus) point to serotonin syndrome; neuroleptic malignant syndrome instead features hyporeflexia and \"lead-pipe\" rigidity, with a slower (days-long) onset tied to antipsychotic exposure rather than a serotonergic drug.",

    second_order_vignette:
      "A 61-year-old man with schizophrenia is started on haloperidol after a medication change during hospitalization. Three days later he develops a temperature of 40°C, generalized \"lead-pipe\" muscle rigidity, diaphoresis, and confusion, with markedly decreased (not increased) reflexes on exam. His creatine kinase is significantly elevated.",
    second_order_question:
      "Which of the following is the most likely diagnosis?",
    second_order_choices: JSON.stringify([
      {
        "label": "A",
        "text": "Serotonin syndrome",
        "correct": false,
        "explanation": "Incorrect. The trigger here is an antipsychotic (dopamine antagonist), not a serotonergic agent, and the exam shows hyporeflexia with lead-pipe rigidity rather than the hyperreflexia and clonus that define serotonin syndrome."
      },
      {
        "label": "B",
        "text": "Neuroleptic malignant syndrome",
        "correct": true,
        "explanation": "Correct. Onset over days following a new or increased antipsychotic, with lead-pipe rigidity, hyporeflexia, hyperthermia, autonomic instability, and elevated CK, is the classic presentation of neuroleptic malignant syndrome."
      },
      {
        "label": "C",
        "text": "Malignant hyperthermia",
        "correct": false,
        "explanation": "Incorrect. Malignant hyperthermia is triggered by inhaled anesthetics or succinylcholine in an intraoperative setting, neither of which is described here."
      },
      {
        "label": "D",
        "text": "Anticholinergic toxicity",
        "correct": false,
        "explanation": "Incorrect. Anticholinergic toxicity produces dry skin and absent bowel sounds rather than diaphoresis and rigidity, and is not temporally linked to starting an antipsychotic."
      },
      {
        "label": "E",
        "text": "Heat stroke",
        "correct": false,
        "explanation": "Incorrect. There is no environmental heat exposure described, and the clear temporal link to a newly started antipsychotic plus lead-pipe rigidity is much more consistent with neuroleptic malignant syndrome."
      }
    ]),
    second_order_answer: "B",
    second_order_explanation:
      "Serotonin syndrome and neuroleptic malignant syndrome can both present with fever, altered mental status, and autonomic instability, but they are distinguished by the triggering drug class (serotonergic agent vs. antipsychotic), onset speed (hours vs. days), and neuromuscular exam (hyperreflexia/clonus vs. hyporeflexia/lead-pipe rigidity). NMS is managed by stopping the antipsychotic, supportive cooling and fluids, and dantrolene and/or bromocriptine for severe cases — a useful contrast to serotonin syndrome's management of stopping the serotonergic agent and using cyproheptadine if refractory.",

    flowchart_title: "Working Up Fever with Rigidity or Agitation on Psychiatric Medications",
    flowchart: JSON.stringify([
      {
        "node": "Fever with altered mental status and/or rigidity — what drug was recently started or combined?",
        "branches": [
          {
            "label": "Serotonergic agent (SSRI, SNRI, MAOI, tramadol, triptan) added or increased",
            "next": "Suspect Serotonin Syndrome"
          },
          {
            "label": "Antipsychotic (dopamine antagonist) recently started or increased",
            "next": "Suspect Neuroleptic Malignant Syndrome"
          },
          {
            "label": "Inhaled anesthetic or succinylcholine, intraoperative setting",
            "next": "Suspect Malignant Hyperthermia"
          }
        ]
      },
      {
        "node": "Onset timing",
        "branches": [
          {
            "label": "Hours after exposure",
            "next": "Supports Serotonin Syndrome"
          },
          {
            "label": "Days after exposure",
            "next": "Supports Neuroleptic Malignant Syndrome"
          }
        ]
      },
      {
        "node": "Neuromuscular exam",
        "branches": [
          {
            "label": "Hyperreflexia and clonus (especially lower-extremity/ocular)",
            "next": "Serotonin Syndrome"
          },
          {
            "label": "Hyporeflexia with lead-pipe rigidity",
            "next": "Neuroleptic Malignant Syndrome"
          }
        ]
      },
      {
        "node": "Initial management",
        "branches": [
          {
            "label": "Serotonin syndrome",
            "next": "Stop serotonergic agents; supportive care/benzodiazepines; cyproheptadine if refractory"
          },
          {
            "label": "Neuroleptic malignant syndrome",
            "next": "Stop antipsychotic; supportive cooling/fluids; dantrolene/bromocriptine if severe"
          },
          {
            "label": "Malignant hyperthermia",
            "next": "Stop triggering anesthetic; give dantrolene emergently"
          }
        ]
      }
    ]),
  },
  // ==========================================================================
  // Module 14 — Renal
  // ==========================================================================
  {
    module_number: 14,
    module_title: 'Renal',
    key_submodule: 'Acute Kidney Injury (AKI)',
    slug: 'prerenal-azotemia-vs-acute-tubular-necrosis',
    title: 'Prerenal Azotemia vs. Acute Tubular Necrosis',
    sort_order: 1,

    hook_vignette:
      'A 74-year-old man with heart failure is admitted for a diarrheal illness with poor oral intake over three days. On admission his creatinine has risen from a baseline of 1.0 mg/dL to 2.4 mg/dL. He is tachycardic, his mucous membranes are dry, and his urine output has fallen to 15 mL/hr.',

    ddx_mapping:
      'Prerenal azotemia vs. acute tubular necrosis (ATN) is the single most tested AKI distinction.\n' +
      'Prerenal azotemia: kidney parenchyma is intact and tubules avidly reabsorb sodium and water in response to true or effective volume depletion (dehydration, hemorrhage, heart failure, cirrhosis, sepsis before tubular injury sets in). BUN rises disproportionately to creatinine (urea is passively reabsorbed with sodium), giving a BUN:Cr ratio >20:1.\n' +
      'ATN: sustained hypoperfusion (a prolonged prerenal state) or a direct nephrotoxic insult (aminoglycosides, IV contrast, myoglobin, cisplatin) kills tubular epithelial cells, so the tubules lose their ability to concentrate urine or reabsorb sodium. BUN:Cr ratio falls toward 10-15:1.\n' +
      'Other mimics: postrenal obstruction (BPH, pelvic mass, bilateral stones) — look for oliguria/anuria with a distended bladder or hydronephrosis on ultrasound, easily excluded with a bladder scan; acute interstitial nephritis (AIN) — a recent new drug (a beta-lactam, NSAID, PPI), fever, rash, and eosinophils/eosinophiluria with white cell casts but little proteinuria; acute glomerulonephritis — hematuria with dysmorphic RBCs and RBC casts, often with hypertension and edema.',

    diagnostic_evaluation:
      'Urinalysis and urine chemistries separate prerenal azotemia from ATN:\n' +
      'Prerenal: FeNa <1% (FeUrea <35% if on diuretics), urine osmolality >500 mOsm/kg, urine sodium <20 mEq/L, bland sediment with hyaline casts.\n' +
      'ATN: FeNa >2%, urine osmolality near plasma (roughly 300 mOsm/kg, isosthenuric — tubules can no longer concentrate), urine sodium >40 mEq/L, and muddy brown granular casts with renal tubular epithelial cells on microscopy.\n' +
      'Renal ultrasound is obtained early to exclude obstruction. A rapid improvement in urine output/creatinine after a fluid challenge favors prerenal azotemia; no response supports established ATN.',

    management:
      'Prerenal azotemia: restore effective circulating volume with isotonic IV fluids, treat the underlying cause (hold diuretics/ACEi/ARB/NSAIDs, optimize cardiac output in heart failure, treat sepsis). Creatinine typically improves within 24-72 hours once perfusion is corrected; untreated, sustained hypoperfusion progresses to ATN.\n' +
      'ATN: mainly supportive — stop the offending nephrotoxin, maintain euvolemia, correct electrolyte and acid-base derangements, renally dose medications, and start dialysis for refractory volume overload, hyperkalemia, severe acidosis, uremic symptoms, or toxin ingestion (the "AEIOU" indications). Tubular recovery typically takes one to three weeks, often with a polyuric recovery phase before function normalizes.',

    first_order_prompt:
      'A patient with AKI has FeNa 0.4%, urine osmolality 650 mOsm/kg, and a BUN:Cr ratio of 28:1. What is the diagnosis?',
    first_order_answer:
      'Prerenal azotemia — intact tubules are avidly reabsorbing sodium and concentrating urine in response to renal hypoperfusion.',

    second_order_vignette:
      'A 68-year-old woman is hospitalized for an ST-elevation MI and undergoes emergent cardiac catheterization with a large contrast load. Two days later her creatinine has risen from 0.9 to 2.1 mg/dL and her urine output has decreased. Urinalysis shows muddy brown granular casts. Urine sodium is 55 mEq/L.',
    second_order_question:
      "Which of the following best explains this patient's laboratory findings?",
    second_order_choices: JSON.stringify([
      { label: 'A', text: 'Loss of tubular concentrating and sodium-reabsorbing capacity from ischemic/toxic tubular injury', correct: true, explanation: 'Correct. Contrast-induced ATN causes direct tubular epithelial injury (plus ischemia from medullary hypoperfusion), producing muddy brown granular casts and an inability to concentrate urine or conserve sodium (FeNa typically >2%, urine Na >40) — matching this presentation.' },
      { label: 'B', text: 'Increased renin-angiotensin-aldosterone activity causing avid distal sodium reabsorption', correct: false, explanation: 'This describes the compensatory response seen in prerenal azotemia, which produces a low urine sodium and a bland sediment (hyaline casts) — the opposite of this patient’s high urine sodium and muddy brown casts.' },
      { label: 'C', text: 'Obstruction of the ureters by a retroperitoneal mass', correct: false, explanation: 'Postrenal obstruction would be expected to show hydronephrosis on renal ultrasound and typically does not produce muddy brown casts, which are specific for tubular epithelial injury.' },
      { label: 'D', text: 'Immune complex deposition in the glomerular basement membrane', correct: false, explanation: 'Immune complex glomerulonephritis produces dysmorphic RBCs and RBC casts with hematuria, not muddy brown granular casts, and would not typically follow a large contrast load by 48 hours.' },
      { label: 'E', text: 'Acute hypersensitivity reaction to iodinated contrast with interstitial eosinophil infiltration', correct: false, explanation: 'Acute interstitial nephritis classically shows white cell casts and eosinophiluria, often with fever/rash; the muddy brown granular casts here are the classic marker of direct tubular injury (ATN), not interstitial inflammation.' },
    ]),
    second_order_answer: 'A',
    second_order_explanation:
      'Contrast-induced nephropathy is a common iatrogenic cause of ATN, typically manifesting 24-48 hours after a large iodinated contrast load, especially with pre-existing CKD, diabetes, or volume depletion. It combines direct tubular epithelial cytotoxicity with medullary vasoconstriction/ischemia, producing the classic ATN picture: muddy brown granular casts, FeNa >2%, urine Na >40 mEq/L, and isosthenuric urine — distinguishing it from prerenal azotemia (bland sediment, FeNa <1%) and from glomerular or interstitial causes.',

    flowchart_title: 'Working up AKI',
    flowchart: JSON.stringify([
      { node: 'Rising creatinine / oliguria', branches: [
        { label: 'Bladder distended or hydronephrosis on ultrasound', next: 'Postrenal obstruction — relieve with catheter/nephrostomy' },
        { label: 'No obstruction, bland sediment, FeNa <1%, urine osm >500', next: 'Prerenal azotemia — trial of IV fluids' },
        { label: 'No obstruction, muddy brown casts, FeNa >2%', next: 'Acute tubular necrosis — supportive care, remove nephrotoxin' },
        { label: 'No obstruction, WBC casts, eosinophiluria, new drug exposure', next: 'Acute interstitial nephritis — stop offending drug' },
      ]},
      { node: 'Response to IV fluid challenge', branches: [
        { label: 'Rapid improvement in urine output/creatinine', next: 'Confirms prerenal azotemia' },
        { label: 'No improvement, persistent hypoperfusion', next: 'Progresses to ischemic ATN' },
      ]},
      { node: 'ATN confirmed', branches: [
        { label: 'Refractory hyperkalemia, acidosis, volume overload, uremia, or toxin', next: 'Initiate dialysis (AEIOU indications)' },
        { label: 'None of the above', next: 'Supportive management; expect recovery over 1-3 weeks' },
      ]},
    ]),
  },

  {
    module_number: 14,
    module_title: 'Renal',
    key_submodule: 'Chronic Kidney Disease (CKD)',
    slug: 'diabetic-nephropathy',
    title: 'Diabetic Nephropathy',
    sort_order: 2,

    hook_vignette:
      'A 58-year-old man with a 15-year history of type 2 diabetes presents for routine follow-up. He has no symptoms, but a screening urine albumin-to-creatinine ratio is 180 mg/g. His blood pressure is 148/92 mmHg, and his most recent HbA1c is 8.6%.',

    ddx_mapping:
      'Diabetic nephropathy is the leading cause of CKD/ESRD in the developed world and should be distinguished from other causes of proteinuric CKD in a diabetic patient.\n' +
      'Diabetic nephropathy: a gradual, painless rise in albuminuria over years, typically accompanied by diabetic retinopathy, with slowly progressive GFR decline and normal-to-mildly-enlarged kidneys early in disease.\n' +
      'Contrast with: hypertensive nephrosclerosis (usually milder proteinuria, long-standing poorly controlled hypertension, no retinopathy); another primary glomerular disease presenting in a diabetic (rapid-onset nephrotic-range proteinuria, no retinopathy, atypical sediment with dysmorphic RBCs/RBC casts — should prompt biopsy rather than assuming diabetic nephropathy); and ischemic nephropathy from renal artery stenosis (an abrupt creatinine rise after starting an ACEi/ARB, an abdominal bruit, asymmetric kidney size).\n' +
      'A patient with long-standing diabetes, concurrent retinopathy, and a gradual proteinuric decline in GFR does not need a biopsy — the clinical picture is diagnostic. Absent retinopathy, or an atypical/rapid course, should trigger biopsy to look for another glomerulopathy.',

    diagnostic_evaluation:
      'Screening: an annual urine albumin-to-creatinine ratio (UACR) starting at diagnosis in type 2 diabetes (5 years after diagnosis in type 1). Moderately increased albuminuria = UACR 30-300 mg/g; severely increased albuminuria = UACR >300 mg/g, confirmed with a repeat sample since exercise, fever, and hyperglycemia can transiently elevate albuminuria.\n' +
      'Estimated GFR by a creatinine-based equation, staged alongside albuminuria per the KDIGO heat-map (CKD stage = G1-G5 by eGFR x A1-A3 by albuminuria).\n' +
      'Renal biopsy is reserved for atypical features (above); if performed, classic findings are diffuse glomerular basement membrane thickening, mesangial expansion, and eosinophilic nodular glomerulosclerosis (Kimmelstiel-Wilson nodules).',

    management:
      'Glycemic control slows progression, most robustly demonstrated early in disease.\n' +
      'Blood pressure control with an ACE inhibitor or ARB — these lower intraglomerular pressure and reduce albuminuria independent of their systemic antihypertensive effect, and are first-line even in normotensive patients with albuminuria.\n' +
      'SGLT2 inhibitors reduce proteinuria and slow eGFR decline independent of glycemic effect and are now standard add-on therapy for diabetic CKD with albuminuria.\n' +
      'A nonsteroidal mineralocorticoid receptor antagonist (finerenone) is added for residual albuminuria despite maximal ACEi/ARB and SGLT2i therapy in appropriate patients.\n' +
      'General CKD care: blood pressure goal typically <130/80, sodium restriction, avoiding nephrotoxins, statin therapy, and monitoring potassium after starting ACEi/ARB/finerenone. Refer to nephrology and begin dialysis-access planning as eGFR approaches stage G4/G5.',

    first_order_prompt:
      'What renal biopsy finding is classically described in advanced diabetic nephropathy?',
    first_order_answer:
      'Nodular glomerulosclerosis (Kimmelstiel-Wilson nodules) with diffuse glomerular basement membrane thickening and mesangial expansion.',

    second_order_vignette:
      'A 61-year-old woman with type 2 diabetes for 12 years and known moderate nonproliferative diabetic retinopathy is found on routine labs to have a UACR of 420 mg/g and an eGFR of 52 mL/min/1.73m². She has no hematuria and a bland urine sediment. She currently takes metformin and empagliflozin; her blood pressure is 138/86 mmHg and she is not on any antihypertensive.',
    second_order_question:
      'Which of the following is the most appropriate next step in management?',
    second_order_choices: JSON.stringify([
      { label: 'A', text: 'Perform a renal biopsy', correct: false, explanation: 'Her clinical picture — long-standing diabetes, concurrent retinopathy, gradual albuminuric CKD with a bland sediment — is classic for diabetic nephropathy and does not require biopsy; biopsy is reserved for atypical features such as absent retinopathy, an active sediment, or a rapid GFR decline.' },
      { label: 'B', text: 'Discontinue empagliflozin due to her declining eGFR', correct: false, explanation: 'SGLT2 inhibitors are renoprotective in diabetic CKD and should be continued (with monitoring) at this eGFR; they are only stopped at very low eGFR thresholds per labeling, not simply because eGFR is below normal.' },
      { label: 'C', text: 'Start an ACE inhibitor or ARB', correct: true, explanation: 'Correct. In a diabetic patient with albuminuria (UACR >300 mg/g), an ACE inhibitor or ARB is first-line regardless of blood pressure because it lowers intraglomerular pressure and slows progression of albuminuric CKD, in addition to treating her hypertension.' },
      { label: 'D', text: 'Restrict dietary protein to below 0.6 g/kg/day', correct: false, explanation: 'Severe protein restriction is not standard therapy for diabetic nephropathy and risks malnutrition; this is not the most appropriate next step compared with starting renin-angiotensin system blockade.' },
      { label: 'E', text: 'Initiate hemodialysis access planning immediately', correct: false, explanation: 'An eGFR of 52 (stage G3a) does not warrant dialysis planning; access planning typically begins as eGFR approaches stage G4 (eGFR <30) or sooner if rapidly progressive.' },
    ]),
    second_order_answer: 'C',
    second_order_explanation:
      'In diabetic patients with albuminuric CKD, ACE inhibitors/ARBs are first-line regardless of blood pressure because they lower intraglomerular pressure via efferent arteriolar dilation, reducing albuminuria and slowing GFR decline beyond their antihypertensive effect. SGLT2 inhibitors and, when needed, finerenone are added for residual risk; biopsy is reserved for atypical presentations.',

    flowchart_title: 'Diabetic CKD screening and management',
    flowchart: JSON.stringify([
      { node: 'Diabetic patient: annual UACR + eGFR screening', branches: [
        { label: 'UACR <30 mg/g', next: 'Normal — continue annual screening' },
        { label: 'UACR 30-300 mg/g (confirmed on repeat)', next: 'Moderately increased albuminuria — start ACEi/ARB + SGLT2i' },
        { label: 'UACR >300 mg/g', next: 'Severely increased albuminuria — ACEi/ARB + SGLT2i, consider finerenone' },
      ]},
      { node: 'Atypical features present?', branches: [
        { label: 'No retinopathy, active sediment, or rapid GFR decline', next: 'Consider renal biopsy for an alternate glomerulopathy' },
        { label: 'Typical diabetic course with retinopathy', next: 'Diagnosis is clinical — no biopsy needed' },
      ]},
      { node: 'Albuminuria persists despite ACEi/ARB + SGLT2i', branches: [
        { label: 'eGFR and potassium acceptable', next: 'Add finerenone' },
        { label: 'eGFR declining toward stage G4', next: 'Refer nephrology; begin dialysis-access planning' },
      ]},
    ]),
  },

  {
    module_number: 14,
    module_title: 'Renal',
    key_submodule: 'Albuminuria and Proteinuria',
    slug: 'minimal-change-disease',
    title: 'Minimal Change Disease',
    sort_order: 3,

    hook_vignette:
      'A previously healthy 4-year-old boy is brought in for new periorbital swelling that is worse in the morning, followed over the next two days by swelling of his legs and abdomen. He has had no fever, rash, or gross blood in his urine. Urinalysis shows 4+ protein without blood.',

    ddx_mapping:
      'Nephrotic syndrome (proteinuria >3.5 g/day, hypoalbuminemia, edema, hyperlipidemia) has different leading causes by age.\n' +
      'Minimal change disease (MCD): overwhelmingly the most common cause of nephrotic syndrome in children (peak age 2-6 years), presenting with abrupt-onset edema, normal renal function, normal complement, and a bland urine sediment (no hematuria, no casts). Often follows a viral URI or immunization; classically exquisitely steroid-responsive.\n' +
      'Membranous nephropathy: the most common cause of primary nephrotic syndrome in non-diabetic adults; more insidious onset, associated with anti-PLA2R antibodies (primary) or with malignancy/hepatitis B/lupus/NSAIDs (secondary); higher risk of renal vein thrombosis than other nephrotic syndromes.\n' +
      'Focal segmental glomerulosclerosis (FSGS): another major adult cause, associated with HIV, heroin use, obesity, or idiopathic/genetic disease; more often has some hematuria, hypertension, and a lower complete steroid-response rate than MCD.\n' +
      'Diabetic nephropathy and amyloidosis are important adult causes with distinct clinical contexts (long-standing diabetes/retinopathy; systemic amyloid deposition, e.g. in multiple myeloma or chronic inflammatory disease).\n' +
      'The key discriminator favoring MCD over these mimics is the combination of young age, abrupt onset, and a completely bland sediment with normal complement and normal renal function at presentation.',

    diagnostic_evaluation:
      'Urinalysis: heavy proteinuria (dipstick 3-4+), no hematuria, no cellular casts (fatty casts/oval fat bodies with a "Maltese cross" appearance under polarized light may be seen from lipiduria).\n' +
      'A 24-hour urine protein or spot urine protein-to-creatinine ratio confirms nephrotic-range proteinuria (>3.5 g/day or ratio >3.5).\n' +
      'Labs: hypoalbuminemia (<3 g/dL), hyperlipidemia (compensatory hepatic lipoprotein synthesis), normal serum complement (C3/C4), normal renal function.\n' +
      'In children with a classic presentation, empiric corticosteroid therapy is started without biopsy. Biopsy is reserved for children with atypical features (age <1 or >8, hematuria, hypertension, renal insufficiency, low complement) or for adults; biopsy in MCD typically shows effacement of podocyte foot processes on electron microscopy with normal light microscopy and negative immunofluorescence.',

    management:
      'First-line: oral corticosteroids, to which the great majority of children with MCD achieve complete remission (resolution of proteinuria), usually within 2-4 weeks; this steroid responsiveness is itself considered strong confirmatory evidence for the diagnosis.\n' +
      'Frequent relapsers or steroid-dependent/steroid-resistant patients are managed with steroid-sparing agents (e.g., cyclophosphamide, a calcineurin inhibitor such as cyclosporine/tacrolimus, mycophenolate mofetil, or rituximab).\n' +
      'Supportive care during active nephrotic syndrome: sodium restriction and diuretics for symptomatic edema, plus monitoring — nephrotic patients are hypercoagulable (urinary loss of antithrombin III) and at increased infection risk (urinary loss of immunoglobulins, particularly pneumococcal infection/spontaneous bacterial peritonitis), so watch for thrombosis and infection during flares.',

    first_order_prompt:
      'What is the most common cause of nephrotic syndrome in children, and what electron microscopy finding is characteristic?',
    first_order_answer:
      'Minimal change disease; effacement (fusion) of podocyte foot processes on electron microscopy, with normal light microscopy and negative immunofluorescence.',

    second_order_vignette:
      'A 5-year-old girl develops new periorbital and lower extremity edema one week after an upper respiratory infection. Labs show serum albumin 1.9 g/dL, total cholesterol 320 mg/dL, and a urine protein-to-creatinine ratio of 6.2. Serum creatinine and complement levels are normal, and urine microscopy shows no red blood cells or casts.',
    second_order_question:
      'What is the most appropriate next step in management?',
    second_order_choices: JSON.stringify([
      { label: 'A', text: 'Renal biopsy before starting any treatment', correct: false, explanation: 'Biopsy is reserved for children with atypical features (age <1 or >8 years, hematuria, hypertension, renal insufficiency, or low complement) — none of which this patient has, so empiric steroids without biopsy is appropriate.' },
      { label: 'B', text: 'Empiric oral corticosteroid therapy', correct: true, explanation: 'Correct. In a child with the classic presentation of minimal change disease (young age, abrupt nephrotic-range proteinuria, bland sediment, normal complement and renal function), empiric corticosteroids are started without biopsy; the rapid, complete response to steroids is itself diagnostic.' },
      { label: 'C', text: 'Testing for anti-PLA2R antibodies', correct: false, explanation: 'Anti-PLA2R antibodies are associated with primary membranous nephropathy, an adult disease; they have no role in evaluating a child with a classic minimal change disease presentation.' },
      { label: 'D', text: 'Start an ACE inhibitor as sole therapy', correct: false, explanation: 'ACE inhibitors reduce proteinuria in chronic proteinuric kidney disease but are not first-line, steroid-sparing therapy for pediatric minimal change disease, which is exquisitely steroid-responsive; steroids are the appropriate first step.' },
      { label: 'E', text: 'Immediate initiation of cyclophosphamide', correct: false, explanation: 'Cytotoxic agents like cyclophosphamide are reserved for frequently relapsing, steroid-dependent, or steroid-resistant disease — not first-line therapy for an initial presentation.' },
    ]),
    second_order_answer: 'B',
    second_order_explanation:
      'Minimal change disease is the leading cause of nephrotic syndrome in young children and typically presents with abrupt edema, heavy proteinuria, hypoalbuminemia, hyperlipidemia, a bland urine sediment, and normal complement/renal function. Given this classic picture, empiric corticosteroids are started without biopsy, and the near-universal, rapid remission with steroids in this age group is itself considered confirmatory.',

    flowchart_title: 'Nephrotic syndrome in a child',
    flowchart: JSON.stringify([
      { node: 'Nephrotic-range proteinuria + edema in a child', branches: [
        { label: 'Age 1-8, bland sediment, normal complement/renal function', next: 'Presumed minimal change disease — start empiric steroids' },
        { label: 'Age <1 or >8, hematuria, hypertension, low complement, or renal insufficiency', next: 'Atypical — renal biopsy indicated' },
      ]},
      { node: 'Empiric steroid trial', branches: [
        { label: 'Complete remission within 2-4 weeks', next: 'Confirms minimal change disease — taper steroids' },
        { label: 'Steroid-resistant or frequent relapses', next: 'Biopsy + steroid-sparing agent (calcineurin inhibitor, cyclophosphamide, or rituximab)' },
      ]},
      { node: 'During an active nephrotic flare', branches: [
        { label: 'Signs of thrombosis (loss of antithrombin III)', next: 'Evaluate for venous thromboembolism' },
        { label: 'Fever / peritoneal signs', next: 'Evaluate for spontaneous bacterial peritonitis (from urinary Ig loss)' },
      ]},
    ]),
  },

  {
    module_number: 14,
    module_title: 'Renal',
    key_submodule: 'Hematuria',
    slug: 'iga-nephropathy',
    title: 'IgA Nephropathy',
    sort_order: 4,

    hook_vignette:
      'A 22-year-old man presents with cola-colored urine that began one day after he developed a sore throat and low-grade fever. He has had two similar episodes of gross hematuria over the past year, each coinciding with an upper respiratory infection. His blood pressure is mildly elevated and he has no edema.',

    ddx_mapping:
      'IgA nephropathy (Berger disease) is the most common cause of primary glomerulonephritis worldwide. Its hallmark is gross hematuria that begins synpharyngitically — within 24-48 hours of a mucosal (upper respiratory or GI) infection — reflecting a rise in poorly galactosylated IgA1 immune complexes that deposit in the mesangium. Episodes recur with subsequent infections, and microscopic hematuria often persists between flares.\n' +
      'Post-streptococcal glomerulonephritis (PSGN): the key distinguisher from IgA nephropathy is timing — PSGN classically develops 1-3 weeks after group A streptococcal pharyngitis or a skin infection (the latency reflects the time needed to generate immune complexes), not 1-2 days. It is more common in children, presents with the full nephritic syndrome (hematuria, hypertension, edema, oliguria), and is associated with a low C3 that normalizes over 6-8 weeks.\n' +
      'Alport syndrome: a (usually X-linked) type IV collagen defect presenting with persistent microscopic/gross hematuria plus sensorineural hearing loss and ocular abnormalities, with a family history of males with progressive renal failure — a genetic/syndromic picture rather than infection-triggered episodes.\n' +
      'Thin basement membrane disease (benign familial hematuria): persistent isolated microscopic hematuria with normal renal function and a benign family history, without progression to renal failure or hearing/eye involvement.\n' +
      'The combination of a very short latency to infection, recurrent episodic gross hematuria, and normal complement favors IgA nephropathy over PSGN, Alport syndrome, or thin basement membrane disease.',

    diagnostic_evaluation:
      'Urinalysis during a flare: gross or microscopic hematuria with dysmorphic RBCs and RBC casts (confirming a glomerular source), and variable, usually sub-nephrotic, proteinuria.\n' +
      'Serum complement (C3/C4): normal in IgA nephropathy, distinguishing it from PSGN (low C3) and lupus nephritis (low C3/C4).\n' +
      'Serum IgA is elevated in a minority of patients and is not diagnostic on its own.\n' +
      'Definitive diagnosis requires renal biopsy: light microscopy shows mesangial proliferation/expansion, immunofluorescence shows dominant mesangial IgA deposits (often with C3 and IgG), and electron microscopy shows mesangial electron-dense deposits. Biopsy is typically pursued for recurrent gross hematuria, proteinuria >0.5-1 g/day, hypertension, or a declining eGFR — an isolated episode with normal function and minimal proteinuria may simply be observed.',

    management:
      'Isolated hematuria with normal blood pressure, normal eGFR, and minimal proteinuria: observation with periodic monitoring of blood pressure, eGFR, and proteinuria — many patients have a benign course.\n' +
      'Persistent proteinuria (>0.5-1 g/day) and/or hypertension: maximal-tolerated ACE inhibitor or ARB therapy to reduce intraglomerular pressure and proteinuria, along with blood pressure control and general supportive CKD measures — first-line regardless of biopsy severity.\n' +
      'An SGLT2 inhibitor is added in patients with proteinuric CKD from IgA nephropathy, consistent with its broader use in proteinuric kidney disease.\n' +
      'Persistent proteinuria (>0.75-1 g/day) despite maximal supportive therapy for 3-6 months, particularly with active inflammation on biopsy: a glucocorticoid course (or a targeted-release budesonide formulation) may be added; immunosuppression is reserved for higher-risk patients given the side-effect burden.\n' +
      'A meaningful minority of patients progress to ESRD over decades; the disease can recur in a transplanted kidney, usually slowly.',

    first_order_prompt:
      'How many days after an upper respiratory infection does gross hematuria classically appear in IgA nephropathy, and how does this differ from post-streptococcal glomerulonephritis?',
    first_order_answer:
      'IgA nephropathy: 1-2 days (synpharyngitic). PSGN: 1-3 weeks (the latent period needed for immune complex formation).',

    second_order_vignette:
      'A 9-year-old boy presents with dark, tea-colored urine, periorbital edema, and a blood pressure of 128/86 mmHg. His mother reports he had a sore throat with fever about two weeks ago that resolved without antibiotics. Labs show a low serum C3 with a normal C4, and urinalysis shows RBC casts.',
    second_order_question:
      'What is the most likely diagnosis?',
    second_order_choices: JSON.stringify([
      { label: 'A', text: 'IgA nephropathy', correct: false, explanation: 'IgA nephropathy causes gross hematuria within 1-2 days of a mucosal infection (synpharyngitic), not after a two-week latency, and complement levels are typically normal — both features argue against IgA nephropathy here.' },
      { label: 'B', text: 'Alport syndrome', correct: false, explanation: 'Alport syndrome presents with a chronic pattern of hematuria plus sensorineural hearing loss and ocular findings from a hereditary collagen defect, not an acute nephritic syndrome following a discrete streptococcal infection with low complement.' },
      { label: 'C', text: 'Minimal change disease', correct: false, explanation: 'Minimal change disease causes nephrotic syndrome (heavy proteinuria, hypoalbuminemia) with a bland urine sediment — not RBC casts and hypertension, which indicate a nephritic, glomerulonephritic process.' },
      { label: 'D', text: 'Post-streptococcal glomerulonephritis', correct: true, explanation: 'Correct. The roughly two-week latency after streptococcal pharyngitis, the full nephritic syndrome (hematuria, edema, hypertension), RBC casts, and a transiently low C3 with normal C4 are classic for PSGN, resulting from immune complex deposition after a preceding group A strep infection.' },
      { label: 'E', text: 'Lupus nephritis', correct: false, explanation: 'Lupus nephritis can present with low complement and RBC casts, but this young boy lacks other systemic lupus features, and the clear temporal association with recent streptococcal pharyngitis strongly favors PSGN over lupus.' },
    ]),
    second_order_answer: 'D',
    second_order_explanation:
      'Post-streptococcal glomerulonephritis follows group A streptococcal pharyngitis or impetigo by 1-3 weeks (the time needed to form and deposit immune complexes), classically presenting in children with the full nephritic syndrome — hematuria with RBC casts, hypertension, and edema — along with a transiently depressed C3 that normalizes over 6-8 weeks. This contrasts with IgA nephropathy’s rapid (24-48 hour) synpharyngitic hematuria and normal complement.',

    flowchart_title: 'Gross hematuria after a recent infection',
    flowchart: JSON.stringify([
      { node: 'Gross hematuria temporally linked to an infection', branches: [
        { label: 'Hematuria within 1-2 days of URI, recurrent episodes, normal complement', next: 'IgA nephropathy' },
        { label: 'Hematuria 1-3 weeks after strep pharyngitis/skin infection, low C3', next: 'Post-streptococcal glomerulonephritis' },
        { label: 'Chronic hematuria + sensorineural hearing loss + family history', next: 'Alport syndrome' },
        { label: 'Isolated persistent microscopic hematuria, benign family history', next: 'Thin basement membrane disease' },
      ]},
      { node: 'Biopsy indicated? (recurrent gross hematuria, proteinuria >0.5-1 g/day, hypertension, or falling eGFR)', branches: [
        { label: 'Yes', next: 'Biopsy: mesangial IgA deposits confirm IgA nephropathy' },
        { label: 'No — isolated hematuria, normal function', next: 'Observe with periodic monitoring' },
      ]},
      { node: 'Confirmed IgA nephropathy with proteinuria/hypertension', branches: [
        { label: 'Responds to ACEi/ARB + SGLT2i', next: 'Continue supportive therapy' },
        { label: 'Persistent proteinuria >0.75-1 g/day despite 3-6 months', next: 'Consider glucocorticoid/budesonide therapy' },
      ]},
    ]),
  },

  {
    module_number: 14,
    module_title: 'Renal',
    key_submodule: 'Flank Pain',
    slug: 'nephrolithiasis',
    title: 'Nephrolithiasis',
    sort_order: 5,

    hook_vignette:
      'A 38-year-old man presents with sudden-onset, severe left flank pain that radiates to his groin, coming in waves. He is writhing on the stretcher, unable to find a comfortable position, and has associated nausea and one episode of vomiting. Urinalysis shows microscopic hematuria.',

    ddx_mapping:
      'Acute flank pain has several mimics that renal colic must be distinguished from.\n' +
      'Nephrolithiasis (renal colic): colicky pain that waxes and wanes as the stone moves and the ureter spasms, radiating from flank toward the groin/testicle or labia as the stone descends; the patient is restless, constantly shifting position (in contrast to peritonitis, where patients lie still). Hematuria is common but its absence does not exclude a stone.\n' +
      'Pyelonephritis: fever, chills, and costovertebral angle tenderness with a more constant (not colicky) pain, associated with pyuria, bacteriuria, and systemic toxicity — urinalysis and clinical context differentiate it from a sterile stone.\n' +
      'Ruptured or leaking abdominal aortic aneurysm: must be strongly considered in an older patient with vascular risk factors who has flank/back pain, hypotension, and a pulsatile abdominal mass — immediately life-threatening and must be excluded before attributing pain to a stone in this demographic.\n' +
      'Ovarian torsion / testicular torsion: unilateral pelvic or scrotal pain that can radiate to the flank in a younger patient; exam and targeted ultrasound (Doppler flow) distinguish these.\n' +
      'Musculoskeletal strain: pain reproducible/worsened by movement or palpation, without hematuria or a colicky quality.\n' +
      'The waxing-waning colicky quality with radiation toward the groin, patient restlessness, and hematuria specifically point toward a ureteral stone.',

    diagnostic_evaluation:
      'Urinalysis: microscopic (or gross) hematuria in most patients (absence does not rule out a stone, especially with complete obstruction).\n' +
      'Non-contrast CT of the abdomen and pelvis (CT KUB) is the gold-standard imaging study — it identifies virtually all stone types (including radiolucent uric acid stones, which are visible on CT though not on plain film) as well as size, location, and degree of hydronephrosis.\n' +
      'Renal ultrasound is a reasonable first-line study in pregnant patients or children (avoids radiation) and can detect hydronephrosis, though it is less sensitive for small or ureteral stones.\n' +
      'Metabolic workup (24-hour urine collection for volume, calcium, oxalate, citrate, uric acid, and sodium, plus stone analysis if captured) is reserved for recurrent stone formers or high-risk first stones, to guide targeted prevention.\n' +
      'Stone composition context: calcium oxalate stones are by far the most common overall; struvite (magnesium ammonium phosphate) stones form in alkaline urine from urease-producing organisms (Proteus, Klebsiella) and can form large "staghorn" calculi; uric acid stones form in persistently acidic urine and are radiolucent on plain film; cystine stones occur in the inherited disorder cystinuria.',

    management:
      'Acute management: IV fluids for hydration, NSAIDs (e.g., ketorolac) as first-line analgesia (also reduce ureteral smooth muscle spasm and inflammation), with opioids as needed for breakthrough pain and antiemetics for nausea.\n' +
      'Most stones <5 mm pass spontaneously with hydration and analgesia within a few weeks; a stone 5-10 mm may be given a trial of medical expulsive therapy with an alpha-blocker (e.g., tamsulosin) to relax ureteral smooth muscle and facilitate passage.\n' +
      'Indications for urologic intervention: a stone unlikely to pass spontaneously (size >10 mm), persistent obstruction, infection in the setting of an obstructing stone (a urologic emergency requiring urgent decompression — percutaneous nephrostomy or ureteral stent — plus antibiotics), intractable pain/vomiting, or a solitary kidney with obstruction. Options include extracorporeal shock-wave lithotripsy (ESWL), ureteroscopy with laser lithotripsy, or percutaneous nephrolithotomy for very large/staghorn stones.\n' +
      'Secondary prevention: increased fluid intake (goal urine output >2-2.5 L/day) is universally recommended; moderate dietary sodium and animal protein; thiazide diuretics reduce urinary calcium excretion for recurrent calcium stone formers; potassium citrate alkalinizes urine and increases citrate (a stone inhibitor) for calcium oxalate and uric acid stones; allopurinol lowers uric acid for urate stone formers.',

    first_order_prompt:
      'A patient with an obstructing 6 mm ureteral stone develops fever and chills. What is the appropriate management?',
    first_order_answer:
      'Urgent decompression (percutaneous nephrostomy or ureteral stent) plus antibiotics — an infected obstructed system is a urologic emergency, not managed with medical expulsive therapy alone.',

    second_order_vignette:
      'A 45-year-old woman presents with three episodes of colicky right flank pain over the past two years, each associated with passage of a small stone. Stone analysis from her most recent episode reveals a struvite (magnesium ammonium phosphate) composition. Urine culture grows Proteus mirabilis.',
    second_order_question:
      "What is the most likely underlying mechanism promoting this patient's stone formation?",
    second_order_choices: JSON.stringify([
      { label: 'A', text: 'Chronically acidic urine promoting uric acid precipitation', correct: false, explanation: 'Persistently acidic urine (not alkaline) favors uric acid stone formation, typically in patients with gout, high-purine diets, or chronic diarrhea — not the mechanism behind struvite stones, which require alkaline urine from urease-producing bacteria.' },
      { label: 'B', text: 'Excess intestinal oxalate absorption from fat malabsorption', correct: false, explanation: 'Enteric hyperoxaluria from fat malabsorption (e.g., Crohn disease or after bariatric surgery) promotes calcium oxalate stones, not struvite stones, which are driven specifically by urease-splitting infection.' },
      { label: 'C', text: 'An inherited defect in renal tubular amino acid transport', correct: false, explanation: 'This describes cystinuria, which produces cystine stones (often hexagonal crystals on microscopy), not struvite stones tied to chronic urease-positive urinary infection.' },
      { label: 'D', text: 'Idiopathic hypercalciuria from excess intestinal calcium absorption', correct: false, explanation: 'Idiopathic hypercalciuria is the most common identifiable cause of calcium oxalate/phosphate stones, not struvite stones, which form specifically in the setting of chronic infection with urease-producing organisms.' },
      { label: 'E', text: 'Urease-producing bacteria alkalinizing the urine and increasing ammonia concentration', correct: true, explanation: 'Correct. Proteus mirabilis (and other urease-producing organisms like Klebsiella) hydrolyzes urea to ammonia, alkalinizing the urine and raising ammonium and phosphate concentrations, which precipitate with magnesium to form struvite stones — these can enlarge quickly into staghorn calculi filling the renal pelvis.' },
    ]),
    second_order_answer: 'E',
    second_order_explanation:
      'Struvite stones are unique among the major stone types in being directly caused by infection rather than a metabolic derangement: urease-producing organisms such as Proteus mirabilis, Klebsiella, and Providencia split urinary urea into ammonia, alkalinizing the urine and supersaturating it with ammonium and phosphate. These stones can grow rapidly into staghorn calculi filling the collecting system, and management requires both stone removal (often percutaneous nephrolithotomy for large stones) and eradication of the underlying infection to prevent recurrence.',

    flowchart_title: 'Acute flank pain with suspected stone',
    flowchart: JSON.stringify([
      { node: 'Acute colicky flank pain', branches: [
        { label: 'Older patient, vascular risk factors, hypotension/pulsatile mass', next: 'Exclude ruptured AAA emergently' },
        { label: 'Fever, chills, CVA tenderness, pyuria', next: 'Suspect pyelonephritis — evaluate for a concomitant stone' },
        { label: 'Colicky pain radiating to groin, restless patient, hematuria', next: 'Suspect nephrolithiasis — obtain non-contrast CT KUB' },
      ]},
      { node: 'Non-contrast CT confirms a ureteral stone', branches: [
        { label: 'Stone <5 mm, no infection, pain controlled', next: 'Trial of spontaneous passage: fluids + NSAIDs' },
        { label: 'Stone 5-10 mm', next: 'Medical expulsive therapy with an alpha-blocker (tamsulosin)' },
        { label: 'Stone >10 mm or refractory symptoms', next: 'Urologic intervention (ureteroscopy, ESWL, or PCNL)' },
        { label: 'Fever/signs of infection with obstruction', next: 'Emergent decompression (stent/nephrostomy) + antibiotics' },
      ]},
      { node: 'Recurrent stone former', branches: [
        { label: 'Calcium oxalate stones', next: 'Increase fluids, reduce sodium/protein, consider thiazide + citrate' },
        { label: 'Uric acid stones', next: 'Urinary alkalinization, allopurinol' },
        { label: 'Struvite stones with recurrent infection', next: 'Complete stone clearance + treat/prevent UTI' },
      ]},
    ]),
  },

  {
    module_number: 14,
    module_title: 'Renal',
    key_submodule: 'Renal and Urinary Tract Masses',
    slug: 'renal-cell-carcinoma',
    title: 'Renal Cell Carcinoma',
    sort_order: 6,

    hook_vignette:
      'A 63-year-old man with a 40-pack-year smoking history presents with several weeks of intermittent gross hematuria and a dull, constant right flank ache. He reports an unintentional 12-lb weight loss over three months. On exam, a vague fullness is palpable in the right flank.',

    ddx_mapping:
      'Renal and urinary tract masses differ substantially by age, presentation, and cell of origin.\n' +
      'Renal cell carcinoma (RCC): the most common primary renal malignancy in adults (typically 6th-7th decade), arising from proximal tubular epithelium (clear cell subtype most common). Risk factors include smoking, obesity, hypertension, acquired cystic kidney disease from long-term dialysis, and von Hippel-Lindau syndrome (bilateral/multiple RCCs at a younger age). The classic triad of flank pain, hematuria, and a palpable mass is present together in only a minority of patients at diagnosis; more often it is found incidentally on imaging, or presents with a paraneoplastic syndrome (erythrocytosis from ectopic EPO, hypercalcemia from PTHrP, hypertension from renin secretion, or nonmetastatic hepatic dysfunction/Stauffer syndrome).\n' +
      'Urothelial (transitional cell) carcinoma of the renal pelvis/ureter/bladder: painless gross hematuria is the dominant presenting symptom, strongly linked to smoking and occupational aromatic amine exposure; arises from urothelium rather than renal parenchyma and can be multifocal along the urothelial-lined tract.\n' +
      'Wilms tumor (nephroblastoma): the most common renal malignancy of childhood (peak age 2-5 years), presenting as an asymptomatic abdominal mass found by a caregiver or on exam, usually not crossing the midline; associated with WT1 mutations and syndromes (WAGR, Denys-Drash, Beckwith-Wiedemann).\n' +
      'Simple renal cyst: an incidental, well-circumscribed, fluid-filled, avascular lesion on imaging (Bosniak category I) — benign, requiring no further workup, distinguished from a complex/solid mass by imaging characteristics.\n' +
      'Angiomyolipoma: a benign fat-containing renal tumor (fat density on CT is diagnostic), associated with tuberous sclerosis when multiple/bilateral; risk of spontaneous hemorrhage when large.',

    diagnostic_evaluation:
      'Contrast-enhanced CT of the abdomen (CT urogram) is the primary imaging modality — RCC appears as a solid, enhancing renal mass (enhancement with contrast is the key feature distinguishing a solid tumor from a simple cyst). The Bosniak classification stratifies cystic renal lesions by malignancy risk based on wall thickness, septations, calcification, and enhancement.\n' +
      'Renal mass biopsy is not routinely required before resection of a suspicious solid enhancing mass (imaging plus clinical context is usually sufficient to proceed to surgery), but may be used when the diagnosis is uncertain or systemic therapy is planned without surgery.\n' +
      'Staging includes chest imaging (RCC commonly metastasizes hematogenously to lung, bone, and brain), and bone scan/brain MRI if symptomatic.\n' +
      'Labs may show erythrocytosis (ectopic EPO), hypercalcemia (PTHrP), or liver enzyme/dysfunction out of proportion to actual hepatic metastasis (Stauffer syndrome), any of which typically resolve after nephrectomy if driven by the tumor itself.',

    management:
      'Localized disease: partial nephrectomy (nephron-sparing) is preferred for smaller tumors when technically feasible to preserve renal function; radical nephrectomy for larger or centrally located tumors. RCC is notably resistant to conventional cytotoxic chemotherapy and radiation, so surgery is the mainstay for localized disease.\n' +
      'Small, incidentally found renal masses (<2-3 cm) in select patients (older, significant comorbidities) may be managed with active surveillance given their low metastatic potential, or with thermal ablation.\n' +
      'Metastatic/advanced disease does not respond well to conventional chemotherapy; treatment relies on targeted therapy against the VHL/HIF/VEGF pathway (tyrosine kinase inhibitors such as sunitinib, pazopanib, cabozantinib) and immune checkpoint inhibitors (nivolumab, ipilimumab, pembrolizumab), often in combination, reflecting RCC’s relative immunogenicity.\n' +
      'Cytoreductive nephrectomy may be considered in select metastatic patients as part of a multimodal approach. Paraneoplastic derangements (erythrocytosis, hypercalcemia, hypertension) are managed symptomatically and by treating the underlying tumor, after which they often resolve.',

    first_order_prompt:
      'What cell of origin distinguishes renal cell carcinoma from urothelial (transitional cell) carcinoma of the renal pelvis?',
    first_order_answer:
      'RCC arises from renal tubular epithelium (most commonly proximal tubule, clear cell type); urothelial carcinoma arises from the transitional epithelium lining the renal pelvis, ureter, and bladder.',

    second_order_vignette:
      'A 58-year-old woman undergoes an abdominal CT for unrelated gallstone symptoms and is incidentally found to have a 4 cm solid, enhancing mass in the left kidney. She reports no flank pain, hematuria, or weight loss. Routine labs show a hemoglobin of 18.9 g/dL and a normal calcium.',
    second_order_question:
      "What is the most likely explanation for this patient's elevated hemoglobin?",
    second_order_choices: JSON.stringify([
      { label: 'A', text: 'Chronic gastrointestinal blood loss leading to iron overload', correct: false, explanation: 'GI blood loss causes iron-deficiency anemia (a low, not elevated, hemoglobin), the opposite of this patient’s finding.' },
      { label: 'B', text: 'Ectopic erythropoietin production by the tumor', correct: true, explanation: 'Correct. Renal cell carcinoma is a classic cause of paraneoplastic erythrocytosis via ectopic (or dysregulated local) erythropoietin secretion, independent of any bleeding or physiologic hypoxia. This typically resolves after nephrectomy if driven by the tumor.' },
      { label: 'C', text: 'Dehydration causing hemoconcentration', correct: false, explanation: 'While dehydration can mildly elevate hemoglobin via hemoconcentration, nothing in this vignette suggests volume depletion, and a well-described paraneoplastic mechanism directly linked to RCC is the more likely explanation given the incidental renal mass.' },
      { label: 'D', text: 'Polycythemia vera from a JAK2 mutation', correct: false, explanation: 'Polycythemia vera is a primary bone marrow disorder unrelated to this incidentally discovered renal mass; while it should be considered in unexplained erythrocytosis generally, the solid enhancing renal mass makes paraneoplastic EPO production from RCC the more directly relevant explanation here.' },
      { label: 'E', text: 'Hypercalcemia-induced renal concentrating defect', correct: false, explanation: 'This patient’s calcium is normal, and a renal concentrating defect from hypercalcemia would cause polyuria/volume depletion, not a specific rise in red cell mass, so it does not explain true erythrocytosis.' },
    ]),
    second_order_answer: 'B',
    second_order_explanation:
      'Renal cell carcinoma is well known for paraneoplastic syndromes, most classically erythrocytosis from ectopic erythropoietin secretion, but also hypercalcemia from PTHrP, hypertension from renin secretion, and Stauffer syndrome (nonmetastatic hepatic dysfunction). These syndromes can be the presenting clue to an otherwise asymptomatic tumor and typically resolve after nephrectomy when tumor-driven.',

    flowchart_title: 'Evaluating an incidental renal mass',
    flowchart: JSON.stringify([
      { node: 'Renal mass found on imaging', branches: [
        { label: 'Simple, fluid-filled, avascular, thin wall (Bosniak I)', next: 'Simple cyst — benign, no further workup' },
        { label: 'Fat density on CT', next: 'Angiomyolipoma — consider tuberous sclerosis if multiple/bilateral' },
        { label: 'Solid, enhancing with contrast', next: 'Suspicious for renal cell carcinoma' },
        { label: 'Complex cystic features (septa, calcification, enhancement)', next: 'Bosniak II-IV — risk-stratify; higher categories favor resection' },
      ]},
      { node: 'Suspected RCC — staging workup', branches: [
        { label: 'Localized, feasible margins', next: 'Partial (nephron-sparing) or radical nephrectomy' },
        { label: 'Small mass, poor surgical candidate', next: 'Active surveillance or thermal ablation' },
        { label: 'Metastatic disease on staging imaging', next: 'Systemic therapy: TKI ± checkpoint inhibitor' },
      ]},
      { node: 'Paraneoplastic labs present (erythrocytosis, hypercalcemia, hypertension)', branches: [
        { label: 'Resolves after nephrectomy', next: 'Confirms a tumor-driven paraneoplastic syndrome' },
        { label: 'Persists despite nephrectomy', next: 'Evaluate for residual/metastatic disease or an unrelated cause' },
      ]},
    ]),
  },

  {
    module_number: 14,
    module_title: 'Renal',
    key_submodule: 'Congenital Anomalies',
    slug: 'autosomal-dominant-polycystic-kidney-disease',
    title: 'Autosomal Dominant Polycystic Kidney Disease',
    sort_order: 7,

    hook_vignette:
      'A 34-year-old woman presents with new-onset hypertension and intermittent dull bilateral flank discomfort. Her father was started on dialysis at age 58. Abdominal exam reveals bilaterally palpable, irregular flank masses.',

    ddx_mapping:
      'Congenital/hereditary renal anomalies differ in inheritance, age of presentation, and associated findings.\n' +
      'Autosomal dominant polycystic kidney disease (ADPKD): the most common inherited kidney disease, from mutations in PKD1 (~85%, more severe/earlier ESRD) or PKD2 (~15%, a milder course). Presents in adulthood (often the 30s-40s) with hypertension (often the earliest sign, from cyst-mediated activation of the renin-angiotensin system), bilateral flank pain/hematuria, and progressive bilateral kidney enlargement with numerous cysts, eventually progressing to ESRD in the majority of PKD1 patients. Key extrarenal associations: intracranial (berry) aneurysms — screened with MR angiography only if there is a family history of aneurysm/hemorrhage or a high-risk occupation — hepatic cysts (the most common extrarenal manifestation), mitral valve prolapse, and colonic diverticula.\n' +
      'Autosomal recessive polycystic kidney disease (ARPKD): a PKHD1 mutation presenting in infancy/childhood, often with oligohydramnios in utero (from decreased fetal urine output) leading to Potter sequence (pulmonary hypoplasia, characteristic facies, limb deformities) in severe cases, plus congenital hepatic fibrosis — a very different, earlier and typically more severe course than ADPKD.\n' +
      'Posterior urethral valves: the most common cause of congenital lower urinary tract obstruction in male infants (an obstructing membrane in the posterior urethra), presenting with a weak urinary stream, a palpable bladder, and bilateral hydronephrosis, and can cause oligohydramnios/pulmonary hypoplasia in utero if severe — an obstructive rather than cystic process, and specific to males.\n' +
      'Simple/acquired cysts, unlike ADPKD, are typically unilateral or few in number, lack a strong family history, and do not carry the same extrarenal disease burden.\n' +
      'The combination of adult-onset bilateral flank masses, hypertension, and a strong family history of ESRD distinguishes ADPKD from these other congenital entities.',

    diagnostic_evaluation:
      'Renal ultrasound is the standard screening/diagnostic test in a patient with a family history: age-based ultrasound criteria (e.g., at least 2 cysts total, uni- or bilateral, in an at-risk patient age 15-39, with more cysts required at older ages since cysts also increase with normal aging) confirm the diagnosis in most at-risk relatives.\n' +
      'Genetic testing (PKD1/PKD2) is reserved for atypical presentations, equivocal imaging, or reproductive/living-donor decision-making.\n' +
      'Once diagnosed, monitor blood pressure closely and renal function (eGFR trend; total kidney volume by MRI is used as a prognostic marker in some patients to identify rapid progressors), and screen for extrarenal manifestations as indicated (liver imaging if symptomatic; MR angiography for intracranial aneurysm only with a family history of aneurysm/subarachnoid hemorrhage or a high-risk occupation, not as universal screening).\n' +
      'Urinalysis may show microscopic hematuria; gross hematuria can occur with cyst rupture or infection.',

    management:
      'Blood pressure control is central — an ACE inhibitor or ARB is first-line, targeting tighter blood pressure control in most patients to slow cyst growth and preserve renal function.\n' +
      'Tolvaptan (a vasopressin V2-receptor antagonist) slows cyst growth and eGFR decline in patients with rapidly progressive disease by blocking cAMP-mediated cystogenesis; requires monitoring for hepatotoxicity and causes significant polyuria/thirst as an on-target effect.\n' +
      'General supportive measures: adequate hydration (may help suppress vasopressin-driven cyst growth), avoiding nephrotoxins, treating cyst infections with lipophilic antibiotics that penetrate cysts (e.g., fluoroquinolones, trimethoprim-sulfamethoxazole), and conservative management of pain from cyst hemorrhage/mass effect (rarely, cyst decompression or nephrectomy for severe symptomatic cases).\n' +
      'Progression to ESRD is managed with dialysis or transplantation as in other causes of CKD; genetic counseling is offered given the 50% inheritance risk to offspring of an affected parent, and first-degree relatives are screened with renal ultrasound.',

    first_order_prompt:
      'What is the earliest and most common systemic finding in ADPKD, and what is its mechanism?',
    first_order_answer:
      'Hypertension — cyst expansion causes local renal ischemia, activating the renin-angiotensin-aldosterone system, often preceding any decline in GFR.',

    second_order_vignette:
      "A 41-year-old man with known ADPKD and well-controlled hypertension presents with a sudden severe headache described as \"the worst of his life,\" along with neck stiffness and photophobia. He has a family history of a sibling who died suddenly of a brain hemorrhage in his 30s.",
    second_order_question:
      'What is the most likely cause of this presentation?',
    second_order_choices: JSON.stringify([
      { label: 'A', text: 'Hypertensive encephalopathy from poorly controlled blood pressure', correct: false, explanation: "This patient's hypertension is described as well-controlled, and hypertensive encephalopathy typically presents with a more gradual, severe headache with altered mental status/visual changes rather than a sudden \"worst headache of life\" with meningismus, which is more specific for subarachnoid hemorrhage." },
      { label: 'B', text: 'Rupture of a hepatic cyst', correct: false, explanation: 'Hepatic cysts are the most common extrarenal manifestation of ADPKD but present with right upper quadrant pain/hepatomegaly, not a thunderclap headache and meningismus.' },
      { label: 'C', text: 'Rupture of an intracranial (berry) aneurysm', correct: true, explanation: 'Correct. ADPKD is associated with an increased prevalence of intracranial saccular (berry) aneurysms, particularly in the anterior circulation. A thunderclap headache with meningismus, especially with a family history of aneurysmal hemorrhage, is classic for rupture causing subarachnoid hemorrhage — a recognized, life-threatening extrarenal complication of ADPKD.' },
      { label: 'D', text: 'Bacterial meningitis', correct: false, explanation: 'Bacterial meningitis can present with headache, neck stiffness, and photophobia, but typically also with fever and a more subacute onset over hours, whereas the sudden onset and ADPKD/family history context point specifically to aneurysmal subarachnoid hemorrhage.' },
      { label: 'E', text: 'Mitral valve prolapse causing an embolic stroke', correct: false, explanation: 'MVP is associated with ADPKD but is a rare source of embolic stroke; the presentation described (thunderclap headache, meningismus) is classic for subarachnoid hemorrhage from aneurysm rupture, not embolic ischemic stroke.' },
    ]),
    second_order_answer: 'C',
    second_order_explanation:
      'Intracranial berry aneurysms occur at a meaningfully increased rate in ADPKD patients compared with the general population, especially with a family history of aneurysm or hemorrhage. Rupture causes subarachnoid hemorrhage, classically presenting as a sudden, severe ("thunderclap") headache with meningismus — a neurosurgical emergency requiring urgent CT/CT angiography and neurosurgical evaluation. This is why MR angiography screening is targeted at ADPKD patients with such a family history rather than performed universally.',

    flowchart_title: 'Evaluating suspected ADPKD',
    flowchart: JSON.stringify([
      { node: 'Adult with a family history of ESRD + bilateral flank masses/hypertension', branches: [
        { label: 'Age-appropriate cyst count on renal ultrasound', next: 'Diagnostic for ADPKD' },
        { label: 'Equivocal imaging or atypical presentation', next: 'PKD1/PKD2 genetic testing' },
      ]},
      { node: 'ADPKD confirmed', branches: [
        { label: 'Hypertension present', next: 'Start ACEi/ARB, tight BP control' },
        { label: 'Rapidly progressive disease (large total kidney volume, PKD1)', next: 'Consider tolvaptan' },
        { label: 'Family history of intracranial aneurysm/hemorrhage', next: 'MR angiography screening' },
      ]},
      { node: 'Sudden thunderclap headache in an ADPKD patient', branches: [
        { label: 'Meningismus present', next: 'Emergent CT/CTA — evaluate for a ruptured berry aneurysm' },
        { label: 'Gradual, atypical headache without meningismus', next: 'Evaluate other, less urgent causes' },
      ]},
    ]),
  },

  {
    module_number: 14,
    module_title: 'Renal',
    key_submodule: 'Urinary Incontinence',
    slug: 'urinary-incontinence-classification',
    title: 'Urinary Incontinence: Stress vs. Urge vs. Overflow',
    sort_order: 8,

    hook_vignette:
      'A 58-year-old woman who has had three vaginal deliveries reports leaking small amounts of urine whenever she coughs, sneezes, or lifts her grandchildren. She does not leak at night and has no urgency or sensation preceding the leakage.',

    ddx_mapping:
      'Urinary incontinence is classified by mechanism, and distinguishing the type from history alone directs both workup and treatment.\n' +
      'Stress incontinence: involuntary leakage with increased intra-abdominal pressure (coughing, sneezing, laughing, lifting) from urethral sphincter/pelvic floor weakness (vaginal childbirth, pelvic surgery, age-related estrogen loss) or urethral hypermobility. Small-volume leaks, no preceding urge, provoked by a specific activity.\n' +
      'Urge incontinence (overactive bladder): a sudden, strong urge to void immediately followed by involuntary leakage, from detrusor overactivity/involuntary bladder contractions; often with urinary frequency and nocturia. Can be idiopathic or associated with neurologic disease (stroke, multiple sclerosis, Parkinson disease) or bladder irritation (UTI, stone, tumor).\n' +
      'Overflow incontinence: continuous or frequent dribbling/leakage from a chronically over-distended bladder that cannot empty (impaired detrusor contractility or bladder outlet obstruction), commonly from diabetic neuropathy, BPH, or anticholinergic/opioid medications; associated with a weak stream, an incomplete-emptying sensation, and an elevated post-void residual volume.\n' +
      'Mixed incontinence: features of both stress and urge incontinence together — common, particularly in older women.\n' +
      'Functional incontinence: a normal urinary tract, but the patient cannot reach the toilet in time due to cognitive, mobility, or environmental factors (e.g., dementia, severe arthritis) — an important "non-urologic" mimic, since treating the urinary tract itself will not help.\n' +
      'The single most useful discriminating feature is whether leakage is provoked by increased abdominal pressure without urge (stress), preceded by an urgent sensation (urge), continuous/dribbling with incomplete emptying (overflow), or purely situational/mobility-related (functional).',

    diagnostic_evaluation:
      'History and a bladder diary (voiding frequency, volumes, and triggers) are the foundation of evaluation and often sufficient to classify the type.\n' +
      'Urinalysis to exclude UTI or hematuria (which would suggest an alternative or contributing cause such as stone or malignancy) in all patients.\n' +
      'Post-void residual (PVR) volume by bladder ultrasound or catheterization: an elevated PVR (generally >150-200 mL) supports overflow incontinence or points to outlet obstruction/impaired detrusor contractility; a low PVR supports stress or urge incontinence.\n' +
      'Cough stress test (observing for leakage with a full bladder during a cough): a positive test (immediate leakage coincident with the cough) supports stress incontinence.\n' +
      'Urodynamic studies (measuring detrusor pressure and involuntary contractions) are reserved for diagnostic uncertainty, mixed symptoms, prior failed treatment, or before surgical correction — not first-line for a classic presentation.\n' +
      'Pelvic exam assesses for pelvic organ prolapse and urethral hypermobility (Q-tip test) contributing to stress incontinence; a post-menopausal woman should also be assessed for atrophic vaginitis.',

    management:
      'Stress incontinence: first-line is pelvic floor (Kegel) muscle training, often with a pelvic floor physical therapist; weight loss if overweight; a pessary or vaginal support device for select patients. Surgery (most often a mid-urethral sling) for those who fail conservative management.\n' +
      'Urge incontinence/overactive bladder: first-line is behavioral therapy — bladder training (scheduled voiding, urge suppression techniques), fluid/caffeine moderation, and pelvic floor exercises. Pharmacologic options if behavioral therapy is insufficient: antimuscarinics (e.g., oxybutynin, tolterodine — watch for anticholinergic side effects, use cautiously in the elderly and in cognitive impairment) or a beta-3 agonist (mirabegron, which relaxes the detrusor without anticholinergic burden and is often preferred in older adults). Refractory cases may proceed to onabotulinumtoxinA bladder injection or sacral neuromodulation.\n' +
      'Overflow incontinence: address the underlying cause of impaired emptying — relieve outlet obstruction (e.g., an alpha-blocker or surgery for BPH), discontinue offending medications where possible, and use intermittent self-catheterization for a neurogenic/atonic bladder to prevent chronic over-distension and upper tract damage. Anticholinergics and other agents that further impair contractility should be avoided.\n' +
      'Functional incontinence: address the underlying mobility, cognitive, or environmental barrier (scheduled toileting, improved toilet access, treating the underlying condition) rather than the bladder itself.\n' +
      'Mixed incontinence: treat the dominant component first, typically starting with behavioral therapy that helps both.',

    first_order_prompt:
      'A patient leaks urine continuously in small amounts and has an elevated post-void residual volume. What type of incontinence is this, and what is the general treatment approach?',
    first_order_answer:
      'Overflow incontinence — from impaired detrusor contractility or bladder outlet obstruction; treat the underlying cause (e.g., relieve obstruction, stop offending medications) and use intermittent catheterization if needed.',

    second_order_vignette:
      'A 71-year-old man with type 2 diabetes and known BPH reports several months of constant dribbling incontinence and a sensation of incomplete bladder emptying. He denies urgency or leakage with coughing. Bladder ultrasound after voiding shows a post-void residual of 420 mL.',
    second_order_question:
      'What is the most appropriate next step in management?',
    second_order_choices: JSON.stringify([
      { label: 'A', text: 'Start oxybutynin for overactive bladder', correct: false, explanation: 'Anticholinergics like oxybutynin are used for urge incontinence/detrusor overactivity, but they further impair detrusor contractility and would worsen overflow incontinence and urinary retention in this patient — the opposite of what is needed.' },
      { label: 'B', text: 'Pelvic floor (Kegel) muscle training', correct: false, explanation: 'Kegel exercises target stress incontinence from pelvic floor/sphincter weakness, which is not this patient’s problem — he has no leakage with increased abdominal pressure, and his elevated PVR points to a retention/overflow process instead.' },
      { label: 'C', text: 'Reassure that this is normal age-related bladder dysfunction requiring no intervention', correct: false, explanation: 'A PVR of 420 mL is markedly abnormal and puts the patient at risk for recurrent UTIs, bladder stones, and upper tract damage (hydronephrosis) if untreated — this requires active management, not reassurance.' },
      { label: 'D', text: 'Intermittent self-catheterization', correct: true, explanation: "Correct. This patient's constant dribbling, incomplete-emptying sensation, and markedly elevated post-void residual (420 mL) indicate overflow incontinence from impaired bladder emptying — likely a combination of diabetic autonomic neuropathy and BPH-related outlet obstruction. Intermittent catheterization relieves chronic over-distension and prevents upper urinary tract damage while the underlying causes are addressed." },
      { label: 'E', text: 'Mid-urethral sling placement', correct: false, explanation: 'A mid-urethral sling is a surgical treatment for stress incontinence, which is not this patient’s presentation; placing a sling would not address — and could worsen — his underlying outlet obstruction and retention.' },
    ]),
    second_order_answer: 'D',
    second_order_explanation:
      'Overflow incontinence results from a bladder that cannot empty effectively, from impaired detrusor contractility (e.g., diabetic autonomic/peripheral neuropathy), bladder outlet obstruction (e.g., BPH), or both together, as in this patient. Its hallmark is continuous dribbling with a markedly elevated post-void residual. Management addresses the underlying cause(s) and relieves chronic bladder over-distension, typically with intermittent catheterization, while avoiding agents (like anticholinergics) that would further impair emptying.',

    flowchart_title: 'Classifying urinary incontinence',
    flowchart: JSON.stringify([
      { node: 'New urinary incontinence — history + bladder diary + urinalysis + PVR', branches: [
        { label: 'Leakage with cough/sneeze/lifting, no urge, low PVR', next: 'Stress incontinence' },
        { label: 'Sudden strong urge then leakage, frequency/nocturia, low PVR', next: 'Urge incontinence / overactive bladder' },
        { label: 'Continuous dribbling, incomplete emptying, high PVR', next: 'Overflow incontinence' },
        { label: 'Normal urinary tract, impaired mobility/cognition', next: 'Functional incontinence' },
      ]},
      { node: 'Stress incontinence confirmed', branches: [
        { label: 'First-line', next: 'Pelvic floor muscle training ± pessary' },
        { label: 'Fails conservative therapy', next: 'Mid-urethral sling surgery' },
      ]},
      { node: 'Urge incontinence confirmed', branches: [
        { label: 'First-line', next: 'Bladder training, fluid/caffeine moderation' },
        { label: 'Inadequate response', next: 'Antimuscarinic or beta-3 agonist (mirabegron)' },
        { label: 'Refractory', next: 'Botulinum toxin bladder injection or sacral neuromodulation' },
      ]},
      { node: 'Overflow incontinence confirmed', branches: [
        { label: 'Identify cause (BPH, neuropathy, medications)', next: 'Treat obstruction / stop offending drugs' },
        { label: 'Persistent high PVR', next: 'Intermittent self-catheterization' },
      ]},
    ]),
  },

  {
    module_number: 14,
    module_title: 'Renal',
    key_submodule: 'Electrolyte Disturbances',
    slug: 'siadh',
    title: 'SIADH',
    sort_order: 9,

    hook_vignette:
      'A 67-year-old man with small cell lung cancer is found on routine labs to have a serum sodium of 118 mEq/L. He reports mild headache and nausea but is alert and oriented. He has no edema, and his blood pressure and heart rate are normal.',

    ddx_mapping:
      'Hypotonic hyponatremia is worked up by first assessing volume status, since SIADH is a euvolemic hyponatremia and only one branch of that workup.\n' +
      'Hypovolemic hyponatremia: volume depletion (vomiting, diarrhea, diuretic use, adrenal insufficiency) triggers non-osmotic ADH release as a compensatory response to protect circulating volume at the expense of serum sodium; exam shows dry mucous membranes, tachycardia, orthostasis; urine sodium is low (<20 mEq/L) unless the cause is renal salt wasting or diuretics.\n' +
      'Hypervolemic hyponatremia: heart failure, cirrhosis, and nephrotic syndrome all decrease effective circulating volume (despite total body volume overload), triggering ADH release and sodium/water retention; exam shows edema, ascites, or an elevated JVP; urine sodium is typically low (<20 mEq/L), reflecting avid renal sodium retention.\n' +
      'SIADH (euvolemic hyponatremia, the most common cause of hyponatremia in hospitalized patients): ADH is secreted independent of the normal osmotic or volume stimuli, causing water retention with mild volume expansion that is not clinically detectable as edema (no edema, no orthostasis). Urine osmolality is inappropriately concentrated (>100 mOsm/kg, often much higher) relative to the low serum osmolality, and urine sodium is typically >40 mEq/L (reflecting normal renal sodium handling in a euvolemic, not volume-depleted, patient).\n' +
      'Causes of SIADH: ectopic ADH production (classically small cell lung cancer), CNS causes (stroke, hemorrhage, meningitis, trauma), pulmonary causes (pneumonia, positive-pressure ventilation), and drugs (SSRIs, carbamazepine, cyclophosphamide, DDAVP).\n' +
      'Other euvolemic causes to exclude before diagnosing SIADH: hypothyroidism and adrenal (cortisol) insufficiency, since low cortisol itself permits inappropriate ADH release.',

    diagnostic_evaluation:
      'Confirm hypotonic hyponatremia: serum osmolality <275 mOsm/kg (excludes pseudohyponatremia from hyperlipidemia/hyperproteinemia and hyperglycemia-driven translocational hyponatremia).\n' +
      'Assess volume status clinically (exam for edema, orthostatics, mucous membranes) — SIADH is diagnosed only after excluding hypovolemic and hypervolemic causes.\n' +
      'Diagnostic criteria for SIADH: euvolemia, urine osmolality >100 mOsm/kg (inappropriately concentrated given the low serum osmolality), urine sodium usually >40 mEq/L (with normal salt/water intake), and normal thyroid and adrenal (cortisol) function (both must be excluded, since they can mimic SIADH).\n' +
      'Once SIADH is confirmed, search for the underlying cause: chest imaging (malignancy, pneumonia), CNS imaging if a neurologic cause is suspected, and a thorough medication review.',

    management:
      'The rate of sodium correction is the single highest-yield management point: chronic hyponatremia must not be corrected faster than 8 mEq/L in any 24-hour period, because overly rapid correction risks osmotic demyelination syndrome (central pontine myelinolysis) — presenting days later with spastic quadriparesis, dysarthria, and altered consciousness. Patients at highest risk for ODS include those with severe hyponatremia, alcoholism, malnutrition, or hypokalemia.\n' +
      'Mild/moderate, chronic, asymptomatic SIADH: fluid restriction (typically <800 mL-1 L/day) is first-line; salt tablets or a loop diuretic can be added to increase free water excretion.\n' +
      'More severe or symptomatic (but not severely symptomatic) cases refractory to fluid restriction: a vasopressin receptor antagonist ("vaptan," e.g., tolvaptan) can be used, or demeclocycline (induces a form of nephrogenic diabetes insipidus) as a second-line option; vaptans should not be combined with fluid restriction due to the risk of overly rapid correction.\n' +
      'Severe, symptomatic hyponatremia (seizure, severe confusion, coma): hypertonic (3%) saline is given in a monitored setting, in small boluses, specifically to raise sodium quickly enough to halt/reverse life-threatening symptoms while still respecting the 24-hour correction limit — frequent sodium rechecks are mandatory to avoid overcorrection; if correction is inadvertently too rapid, this can be actively re-lowered with desmopressin plus free water.\n' +
      'Definitive management is treatment of the underlying cause (tumor treatment, discontinuing an offending drug, treating the CNS/pulmonary process).',

    first_order_prompt:
      'Why must chronic hyponatremia not be corrected faster than about 8 mEq/L in 24 hours?',
    first_order_answer:
      'To avoid osmotic demyelination syndrome (central pontine myelinolysis), a delayed, often irreversible neurologic injury from overly rapid correction of chronic hyponatremia.',

    second_order_vignette:
      'A 74-year-old woman with a history of chronic alcohol use disorder and poor nutritional intake is admitted with a serum sodium of 108 mEq/L, found to be due to SIADH from a recent pneumonia. Her sodium is carefully corrected to 116 mEq/L over the first 24 hours per protocol. On hospital day 4, she develops new dysarthria and lethargy progressing to obtundation, along with spastic weakness in all four limbs.',
    second_order_question:
      'What is the most likely diagnosis for her new neurologic findings?',
    second_order_choices: JSON.stringify([
      { label: 'A', text: 'Recurrent severe hyponatremia', correct: false, explanation: 'Recurrent hyponatremia would present with symptoms similar to her original presentation (confusion, possible seizure) at a time when sodium is re-measured as low again — but the delayed onset days after correction, with dysarthria and spastic quadriparesis, is specific for osmotic demyelination rather than a return of hyponatremic symptoms.' },
      { label: 'B', text: 'Wernicke encephalopathy from thiamine deficiency', correct: false, explanation: 'Wernicke encephalopathy classically presents with the triad of confusion, ophthalmoplegia, and ataxia in a malnourished/alcohol-use patient — it does not typically cause spastic quadriparesis, and the temporal relationship to a recent sodium correction points specifically to osmotic demyelination.' },
      { label: 'C', text: 'Acute ischemic stroke', correct: false, explanation: 'While stroke is always a consideration with new focal neurologic deficits, the specific clinical context — recent correction of severe hyponatremia in a high-risk patient, with a delayed, symmetric presentation of dysarthria and quadriparesis — is far more consistent with osmotic demyelination syndrome than a vascular event.' },
      { label: 'D', text: 'Hepatic encephalopathy', correct: false, explanation: 'Hepatic encephalopathy typically presents with confusion and asterixis in the setting of significant liver dysfunction/portal hypertension, not the delayed dysarthria and spastic quadriparesis following sodium correction described here, and there is no mention of underlying cirrhosis in this vignette.' },
      { label: 'E', text: 'Osmotic demyelination syndrome', correct: true, explanation: 'Correct. Despite a sodium correction rate that stayed within the generally accepted 24-hour limit (an 8 mEq/L rise here), this patient has multiple major risk factors for osmotic demyelination syndrome — severe baseline hyponatremia, chronic alcohol use, and malnutrition — all of which lower the safe threshold for correction. The delayed onset (days later) of dysarthria, altered consciousness, and spastic quadriparesis is the classic presentation of ODS rather than an acute complication of hyponatremia itself.' },
    ]),
    second_order_answer: 'E',
    second_order_explanation:
      'Osmotic demyelination syndrome can occur even when correction technically stays within generally cited 24-hour limits, particularly in high-risk patients — severe baseline hyponatremia (sodium <110-115), chronic alcohol use disorder, malnutrition, and hypokalemia all lower the safe correction threshold. Its hallmark is a delayed (days later) onset of dysarthria, dysphagia, altered consciousness, and spastic quadriparesis from pontine (and sometimes extrapontine) demyelination, which is why especially cautious, slower correction and frequent monitoring are warranted in higher-risk patients even when following standard rate limits.',

    flowchart_title: 'Working up hyponatremia',
    flowchart: JSON.stringify([
      { node: 'Serum sodium <135 mEq/L', branches: [
        { label: 'Serum osmolality normal/high', next: 'Pseudohyponatremia or translocational (hyperglycemia) — not true hypotonic hyponatremia' },
        { label: 'Serum osmolality <275 mOsm/kg (true hypotonic hyponatremia)', next: 'Assess volume status' },
      ]},
      { node: 'Volume status assessment', branches: [
        { label: 'Hypovolemic (dry mucous membranes, orthostasis)', next: 'Hypovolemic hyponatremia — treat with isotonic saline' },
        { label: 'Hypervolemic (edema, ascites, elevated JVP)', next: 'Hypervolemic hyponatremia (CHF/cirrhosis/nephrotic) — fluid + sodium restriction, treat underlying disease' },
        { label: 'Euvolemic, urine osm >100, urine Na >40, normal thyroid/cortisol', next: 'SIADH — search for cause (malignancy, CNS, pulmonary, drugs)' },
      ]},
      { node: 'Treating hyponatremia', branches: [
        { label: 'Asymptomatic/mild, chronic', next: 'Fluid restriction ± salt tablets/loop diuretic' },
        { label: 'Refractory to fluid restriction', next: 'Vasopressin antagonist (tolvaptan) or demeclocycline' },
        { label: 'Severe symptoms (seizure, coma)', next: 'Hypertonic 3% saline in a monitored setting, frequent sodium rechecks' },
      ]},
      { node: 'Correction rate management', branches: [
        { label: 'Standard risk', next: 'Limit rise to ~8 mEq/L per 24 hours' },
        { label: 'High risk for ODS (severe hyponatremia, alcoholism, malnutrition, hypokalemia)', next: 'Correct even more cautiously; monitor closely for delayed neurologic symptoms' },
      ]},
    ]),
  },
  // ===========================================================================
  // Module 12 — Neurology and Special Senses
  // ===========================================================================
  {
    module_number: 12,
    module_title: 'Neurology and Special Senses',
    key_submodule: 'Headache',
    slug: 'subarachnoid-hemorrhage',
    title: 'Subarachnoid Hemorrhage',
    sort_order: 1,

    hook_vignette: `A 52-year-old woman with poorly controlled hypertension is gardening when she suddenly clutches her head and collapses, describing the worst headache of her life reaching maximum intensity within seconds. She is nauseated, photophobic, and has a stiff neck on exam; there is no focal weakness, but she is somnolent and difficult to arouse.`,

    ddx_mapping: `Thunderclap headache (peak intensity in under a minute) is the discriminating feature that separates subarachnoid hemorrhage from nearly every headache mimic.
Migraine: builds over 20-60 minutes, unilateral/throbbing, aura or photophobia present, but never truly instantaneous; the patient usually has a prior personal history of similar (less severe) headaches.
Bacterial meningitis: fever, neck stiffness, and headache are shared with SAH, but onset is over hours and photophobia/nuchal rigidity develop alongside progressive fever rather than exploding at a single moment.
Cerebral venous sinus thrombosis: subacute headache worsening over days, often with papilledema and seizures, in a hypercoagulable patient (postpartum, oral contraceptives) — not an instantaneous peak.
Reversible cerebral vasoconstriction syndrome: recurrent thunderclap headaches over days to weeks, often triggered by Valsalva or vasoactive substances, with normal initial CT — distinguished from SAH by angiography showing reversible "string of beads" vasospasm without blood on initial imaging.
Primary (benign) thunderclap headache: a diagnosis of exclusion only after a negative CT and LP have ruled out aneurysmal rupture.`,

    diagnostic_evaluation: `Noncontrast head CT within 6 hours of symptom onset is more than 95% sensitive for subarachnoid blood and is the first step; it may show hyperdensity in the basal cisterns, sylvian fissures, or interhemispheric fissure.
If CT is negative but clinical suspicion remains (especially beyond 6 hours), lumbar puncture is mandatory: look for xanthochromia (yellow discoloration of centrifuged CSF from bilirubin breakdown), which distinguishes true SAH from a traumatic tap — a traumatic tap shows decreasing red cell counts between tubes 1 and 4, while true SAH does not clear.
Once SAH is confirmed, CT angiography (or catheter angiography) is obtained to localize a ruptured aneurysm, most commonly at the anterior communicating artery, before definitive treatment.
ECG and troponin are checked because SAH can trigger a catecholamine surge producing diffuse T-wave inversions ("cerebral T waves") and neurogenic stunned myocardium, which can be mistaken for an acute coronary syndrome.`,

    management: `Secure the airway/circulation and control blood pressure (typically keeping systolic pressure below roughly 160 mmHg) to reduce rebleeding risk before the aneurysm is secured.
Nimodipine is started for every SAH patient regardless of aneurysm location — it reduces delayed cerebral ischemia from vasospasm (a mortality benefit) even though it does not meaningfully lower blood pressure at the doses used.
Definitive treatment of the ruptured aneurysm is either endovascular coiling or surgical clipping, generally performed within 24-72 hours to prevent rebleeding, with the choice driven by aneurysm location/morphology and center expertise.
Patients are monitored in a neuro-ICU for vasospasm (via serial transcranial Dopplers and neuro checks), typically days 3-14 after the bleed, and for hydrocephalus (which may need an external ventricular drain) from blood obstructing CSF outflow.`,

    first_order_prompt: `What CSF finding distinguishes true subarachnoid hemorrhage from a traumatic lumbar puncture?`,
    first_order_answer: `Xanthochromia (yellow discoloration from RBC breakdown products) — true SAH does not show a decreasing red cell count between the first and last collection tubes, unlike a traumatic tap.`,

    second_order_vignette: `A 61-year-old man with a history of autosomal dominant polycystic kidney disease presents to the emergency department 2 hours after the sudden onset of the worst headache of his life while lifting weights. He is awake but complains of neck stiffness and vomits once in the ED. Noncontrast CT of the head is negative for hemorrhage.`,
    second_order_question: `Which of the following is the most appropriate next step in management?`,
    second_order_choices: JSON.stringify([
      { label: 'A', text: 'Reassure the patient and discharge with outpatient follow-up', correct: false, explanation: `A negative CT within 6 hours markedly lowers but does not eliminate the probability of SAH, especially with this presentation and ADPKD's association with berry aneurysms; discharge without further workup risks missing a rupture.` },
      { label: 'B', text: 'Perform a lumbar puncture to assess for xanthochromia', correct: true, explanation: `With a compelling thunderclap presentation and a negative CT, LP looking for xanthochromia (or persistent RBCs across tubes) is the next step to rule out SAH, particularly since this patient's ADPKD confers an elevated baseline risk of berry aneurysms.` },
      { label: 'C', text: 'Start empiric antibiotics for presumed bacterial meningitis', correct: false, explanation: `Nothing in the vignette (fever, altered mentation over hours) points to meningitis, and the instantaneous thunderclap onset argues strongly against an infectious cause; empiric antibiotics are not indicated here.` },
      { label: 'D', text: 'Obtain an MRI of the cervical spine', correct: false, explanation: `Cervical spine imaging addresses structural neck pathology, not the intracranial process suggested by thunderclap headache; it does not evaluate for subarachnoid blood.` },
      { label: 'E', text: 'Administer sumatriptan for presumed migraine', correct: false, explanation: `This patient lacks a prior migraine history, and treating an unexplained thunderclap headache as migraine without first excluding SAH would be dangerous — triptans are also relatively contraindicated in suspected vascular catastrophe.` },
    ]),
    second_order_answer: 'B',
    second_order_explanation: `ADPKD carries a well-known association with intracranial (berry) aneurysms, and this patient's thunderclap headache pattern is classic for aneurysmal rupture. A noncontrast CT is highly sensitive but not perfect, particularly if performed later after onset or if the bleed is small; when clinical suspicion remains high after a negative CT, lumbar puncture to look for xanthochromia (which appears several hours after bleeding as CSF bilirubin accumulates) is the required next step before the patient can be safely reassured. If the LP is also negative, an unruptured aneurysm workup (CTA/MRA) may still be considered given the ADPKD association.`,

    flowchart_title: 'Thunderclap Headache Workup',
    flowchart: JSON.stringify([
      { node: "Sudden-onset, maximal-intensity headache ('worst of life')", branches: [
        { label: 'Onset over minutes-to-hours with fever/meningismus', next: 'Consider bacterial meningitis — LP + empiric antibiotics' },
        { label: 'True thunderclap (peak <1 min)', next: 'Obtain noncontrast head CT' },
      ] },
      { node: 'Noncontrast head CT', branches: [
        { label: 'Positive for subarachnoid blood', next: 'CT angiography to localize aneurysm' },
        { label: 'Negative, <6 hrs from onset, high suspicion persists', next: 'Lumbar puncture for xanthochromia' },
      ] },
      { node: 'Lumbar puncture result', branches: [
        { label: 'Xanthochromia present / RBCs non-clearing', next: 'Treat as SAH — CT angiography, neurosurgery consult' },
        { label: 'Clear CSF, RBCs clear between tubes', next: 'SAH excluded — consider primary thunderclap headache or RCVS' },
      ] },
      { node: 'Confirmed ruptured aneurysm', branches: [
        { label: 'Amenable to endovascular approach', next: 'Coiling + nimodipine + neuro-ICU monitoring for vasospasm' },
        { label: 'Wide-necked / complex morphology', next: 'Surgical clipping + nimodipine + neuro-ICU monitoring' },
      ] },
    ]),
  },
  {
    module_number: 12,
    module_title: 'Neurology and Special Senses',
    key_submodule: 'Brain Tumors',
    slug: 'glioblastoma-multiforme',
    title: 'Glioblastoma Multiforme',
    sort_order: 2,

    hook_vignette: `A 64-year-old right-handed man develops progressively worsening headaches over three weeks, worse in the morning and with coughing, accompanied by new-onset expressive word-finding difficulty and mild right-hand clumsiness noticed by his wife. His wife also reports that yesterday he had a brief episode of unresponsiveness with rhythmic jerking of his right arm.`,

    ddx_mapping: `The combination of a subacute focal neurologic deficit, a new seizure, and morning headache worsened by Valsalva (all pointing to a mass lesion with raised intracranial pressure) narrows the differential mainly to primary brain tumor vs. metastasis vs. abscess vs. demyelinating lesion.
Glioblastoma (WHO grade 4 astrocytoma): typically a single, irregular, ring-enhancing mass with central necrosis that often crosses the corpus callosum ("butterfly glioma"), in a patient usually over age 50 with no other primary cancer known.
Metastatic disease: also ring-enhancing but classically multiple lesions at the gray-white junction, in a patient with a known primary malignancy (lung, breast, melanoma, renal, GI) — a solitary lesion without a known primary favors a primary glial tumor.
Brain abscess: also ring-enhancing, but the rim is typically thinner and smoother, restricted diffusion on DWI/ADC is characteristic of pus, and there's usually a source (endocarditis, sinusitis, dental infection, immunosuppression) with fever.
Meningioma: extra-axial (arises from dura, displaces rather than infiltrates brain), homogeneously enhancing, often with a dural tail, and grows slowly — typically presents with seizures or focal deficits evolving over months to years rather than weeks.
Tumefactive demyelinating lesion (MS variant): can mimic a tumor on imaging with an incomplete ("open") ring of enhancement in a younger patient, often with a history of other neurologic episodes.`,

    diagnostic_evaluation: `MRI brain with and without gadolinium contrast is the key study: glioblastoma classically shows an irregular, thick, and often heterogeneous ring of enhancement surrounding a necrotic core, with substantial surrounding vasogenic edema and frequent crossing of the corpus callosum.
Definitive diagnosis requires tissue via stereotactic biopsy or surgical resection. Histology shows a highly cellular, pleomorphic astrocytic tumor with pseudopalisading necrosis (tumor cells lined up in a palisade around necrotic zones) and microvascular/endothelial proliferation — the features that distinguish grade 4 glioblastoma from lower-grade astrocytomas.
Molecular testing is now essential to WHO classification: IDH-wildtype status defines primary (de novo) glioblastoma (worse prognosis, typical in older adults), versus IDH-mutant tumors (better prognosis, often arising from a lower-grade astrocytoma in younger patients). MGMT promoter methylation status is also checked because it predicts a better response to temozolomide chemotherapy.`,

    management: `Maximal safe surgical resection is the first step, both to relieve mass effect/reduce tumor burden and to obtain tissue for diagnosis; complete resection is rarely curative because glioblastoma infiltrates diffusely beyond the visible tumor margin.
Adjuvant treatment follows the Stupp protocol: concurrent radiotherapy with daily temozolomide, followed by six cycles of maintenance temozolomide.
Dexamethasone is used perioperatively to reduce vasogenic edema and mass effect; levetiracetam or another antiepileptic is given if the patient has had a seizure.
Despite treatment, glioblastoma has a poor prognosis (median survival roughly 12-15 months), and recurrence is essentially universal — tumor-treating fields (alternating electric field therapy) and bevacizumab are used in some patients for recurrent or refractory disease. Goals-of-care and quality-of-life discussions should begin early.`,

    first_order_prompt: `What histologic finding is characteristic of glioblastoma and distinguishes it from lower-grade astrocytomas?`,
    first_order_answer: `Pseudopalisading necrosis (tumor cells arranged in a palisade around necrotic foci) with microvascular/endothelial proliferation.`,

    second_order_vignette: `A 58-year-old woman with no significant past medical history presents with three weeks of progressively worsening left-sided weakness and a single generalized tonic-clonic seizure. MRI brain shows a large, irregular, heterogeneously enhancing right frontal mass with a necrotic center and extensive surrounding edema, crossing the genu of the corpus callosum. Biopsy is performed.`,
    second_order_question: `Which histologic finding would confirm this is a grade 4 glioblastoma rather than a lower-grade diffuse astrocytoma?`,
    second_order_choices: JSON.stringify([
      { label: 'A', text: 'Psammoma bodies', correct: false, explanation: `Psammoma bodies (laminated calcific whorls) are characteristic of meningioma and papillary thyroid carcinoma, not glioblastoma.` },
      { label: 'B', text: 'Pseudopalisading necrosis with microvascular proliferation', correct: true, explanation: `This is the defining histologic feature that upgrades a diffuse astrocytoma to WHO grade 4 glioblastoma — necrosis surrounded by densely packed, palisading tumor nuclei, along with glomeruloid endothelial proliferation reflecting the tumor's aggressive angiogenesis.` },
      { label: 'C', text: 'Rosenthal fibers and eosinophilic granular bodies', correct: false, explanation: `These are characteristic of pilocytic astrocytoma, a WHO grade 1 tumor typically seen in children, often in the cerebellum — a much more indolent lesion than glioblastoma.` },
      { label: 'D', text: 'Perivascular pseudorosettes', correct: false, explanation: `Perivascular pseudorosettes (tumor cells radially arranged around a central vessel) are characteristic of ependymoma, not glioblastoma.` },
      { label: 'E', text: 'Call-Exner bodies', correct: false, explanation: `Call-Exner bodies are seen in granulosa cell tumors of the ovary, an unrelated entity.` },
    ]),
    second_order_answer: 'B',
    second_order_explanation: `Glioblastoma (WHO grade 4 diffuse glioma) is defined histologically by necrosis (often with pseudopalisading tumor cells surrounding it) and/or microvascular proliferation superimposed on the diffusely infiltrating astrocytic tumor pattern seen in lower-grade gliomas. These features reflect the tumor's aggressive growth outstripping its blood supply and its potent angiogenic signaling, and are what separates it from grade 2-3 diffuse astrocytomas on biopsy, independent of molecular (IDH) status.`,

    flowchart_title: 'Adult Enhancing Brain Mass Workup',
    flowchart: JSON.stringify([
      { node: 'New focal deficit + seizure + morning headache', branches: [
        { label: 'MRI shows single lesion crossing corpus callosum, ring-enhancing with necrosis', next: 'Favor primary glioma — biopsy/resection' },
        { label: 'MRI shows multiple lesions at gray-white junction', next: 'Favor metastatic disease — search for primary (CT chest/abd/pelvis)' },
      ] },
      { node: 'Single ring-enhancing lesion, primary unknown', branches: [
        { label: 'Thin smooth rim, restricted diffusion, fever/source', next: 'Favor abscess — treat as infection, consider aspiration' },
        { label: 'Irregular thick rim, necrotic core, vasogenic edema', next: 'Favor high-grade glioma — tissue diagnosis needed' },
      ] },
      { node: 'Biopsy/resection histology', branches: [
        { label: 'Pseudopalisading necrosis + microvascular proliferation', next: 'Glioblastoma, WHO grade 4' },
        { label: 'Diffusely infiltrating without necrosis/microvascular proliferation', next: 'Lower-grade diffuse astrocytoma (grade 2-3) — check IDH status' },
      ] },
      { node: 'Confirmed glioblastoma', branches: [
        { label: 'Standard management', next: 'Maximal safe resection → Stupp protocol (RT + temozolomide)' },
        { label: 'MGMT promoter methylated', next: 'Better predicted response to temozolomide' },
      ] },
    ]),
  },
  {
    module_number: 12,
    module_title: 'Neurology and Special Senses',
    key_submodule: 'Weakness',
    slug: 'guillain-barre-syndrome',
    title: 'Guillain-Barré Syndrome',
    sort_order: 3,

    hook_vignette: `A 29-year-old man presents with two days of progressive, symmetric weakness that began in his feet and has now ascended to involve his thighs, making it hard to climb stairs. He reports a diarrheal illness with foul-smelling, watery stools about two weeks earlier. On exam he has symmetric distal-to-proximal weakness and absent deep tendon reflexes throughout, with only mild distal sensory changes.`,

    ddx_mapping: `The key pattern is ascending, symmetric, areflexic weakness following an antecedent infection — this points strongly toward Guillain-Barré syndrome (an acute inflammatory demyelinating polyradiculoneuropathy) over its mimics.
Myasthenia gravis: weakness is typically fatigable and fluctuating, prominently affects extraocular/bulbar muscles first (ptosis, diplopia, dysphagia) before limbs, and reflexes are preserved — unlike the fixed, ascending, areflexic pattern of GBS.
Transverse myelitis: also causes bilateral leg weakness, but there is usually a clear sensory level on exam and early bowel/bladder dysfunction, with an upper motor neuron pattern rather than the flaccid, areflexic lower motor neuron pattern of GBS.
Botulism: also causes descending flaccid paralysis with early bulbar/autonomic involvement (diplopia, dysarthria, dry mouth) and normal sensation, associated with improperly canned food or wound contamination, distinguished by a presynaptic neuromuscular junction block rather than demyelination.
Hypokalemic periodic paralysis: episodic weakness associated with a low serum potassium, often triggered by carbohydrate load or exercise, without a preceding infectious trigger or sensory findings, and resolves with potassium repletion.
Tick paralysis: ascending flaccid paralysis resembling GBS, but CSF protein is normal (no albuminocytologic dissociation) and it resolves rapidly after the tick is removed.`,

    diagnostic_evaluation: `The diagnosis is primarily clinical, supported by:
Lumbar puncture showing albuminocytologic dissociation — markedly elevated CSF protein with a normal white cell count — which typically appears after the first week of symptoms (can be normal early in the illness).
Nerve conduction studies/EMG showing demyelinating features: prolonged distal latencies, conduction block, and slowed conduction velocities, consistent with acute inflammatory demyelinating polyradiculoneuropathy (the classic Western variant); an axonal variant (AMAN) can also occur, often linked to prior Campylobacter jejuni infection with anti-GM1 antibodies.
Serologic/stool testing may identify the antecedent trigger (Campylobacter jejuni is the most commonly implicated organism via molecular mimicry against peripheral nerve gangliosides), though this doesn't change acute management.
All patients require close monitoring of respiratory function with serial forced vital capacity (FVC) and negative inspiratory force (NIF) measurements — the danger in GBS is progression to diaphragmatic weakness and respiratory failure, not just limb weakness, so bedside spirometry (not just pulse oximetry) is essential.`,

    management: `Admit for monitoring given the risk of rapid progression to respiratory failure and autonomic instability (labile blood pressure, arrhythmias); intubate electively if FVC falls below roughly 15-20 mL/kg or NIF weakens significantly, rather than waiting for hypoxia to develop.
Disease-modifying treatment is either IVIG or plasma exchange (plasmapheresis) — both have equivalent efficacy and are not typically combined; the choice depends on availability and patient factors (e.g., IVIG is often preferred given easier administration and fewer hemodynamic effects).
Corticosteroids are NOT effective in GBS and should not be used — this is a key distinction from many other inflammatory neurologic diseases.
Supportive care includes DVT prophylaxis (immobile patients), pain control (neuropathic pain is common), and early physical therapy; most patients recover over weeks to months, though a minority have residual weakness and a small percentage relapse or plateau requiring further treatment (CIDP if weakness continues progressing beyond 8 weeks).`,

    first_order_prompt: `What CSF finding is classically seen in Guillain-Barré syndrome, and roughly when does it appear?`,
    first_order_answer: `Albuminocytologic dissociation — elevated CSF protein with a normal white blood cell count — typically emerging after the first week of illness.`,

    second_order_vignette: `A 45-year-old woman presents 10 days after an upper respiratory illness with two days of ascending numbness and weakness, now unable to stand from a chair without assistance. Vital signs show a heart rate that fluctuates between 55 and 130 bpm over the exam. Deep tendon reflexes are absent in both lower extremities. Forced vital capacity is 18 mL/kg.`,
    second_order_question: `Which of the following is the most appropriate immediate next step?`,
    second_order_choices: JSON.stringify([
      { label: 'A', text: 'Begin high-dose intravenous corticosteroids', correct: false, explanation: `Corticosteroids have been studied in GBS and shown no benefit — unlike in many other autoimmune/inflammatory neurologic conditions, they are not part of standard therapy here.` },
      { label: 'B', text: 'Admit to a monitored unit with serial respiratory function testing and initiate IVIG or plasmapheresis', correct: true, explanation: `This patient has autonomic instability (fluctuating heart rate) and a borderline FVC, both markers of a GBS patient at risk for rapid deterioration; she needs close monitoring (ideally ICU-level) plus disease-modifying therapy with IVIG or plasma exchange, initiated as early as possible.` },
      { label: 'C', text: 'Discharge with outpatient neurology follow-up in one week', correct: false, explanation: `This ascending, progressive weakness with autonomic instability and a low-normal FVC represents a medical emergency requiring inpatient monitoring — outpatient follow-up risks a fatal delay if she progresses to respiratory failure.` },
      { label: 'D', text: 'Obtain an MRI of the lumbar spine to evaluate for cauda equina syndrome', correct: false, explanation: `Cauda equina typically presents with saddle anesthesia, bowel/bladder dysfunction, and often asymmetric findings/back pain, not symmetric ascending weakness with autonomic dysfunction following a preceding infection; the clinical picture here fits GBS far better.` },
      { label: 'E', text: 'Start pyridostigmine for presumed myasthenic crisis', correct: false, explanation: `Pyridostigmine treats myasthenia gravis, which causes fatigable, fluctuating weakness with preserved reflexes and prominent ocular/bulbar involvement — not the fixed ascending, areflexic weakness with autonomic instability seen here.` },
    ]),
    second_order_answer: 'B',
    second_order_explanation: `This patient's ascending weakness, areflexia, antecedent infection, and — critically — autonomic instability (wide swings in heart rate) plus a marginal FVC identify her as a high-risk GBS patient who needs immediate admission to a monitored setting (ideally ICU) with serial pulmonary function testing to catch impending respiratory failure before it becomes an emergency, along with prompt initiation of IVIG or plasma exchange to shorten the disease course.`,

    flowchart_title: 'Ascending Weakness Evaluation',
    flowchart: JSON.stringify([
      { node: 'Progressive, symmetric ascending weakness', branches: [
        { label: 'Preserved reflexes, fatigable, ocular/bulbar predominant', next: 'Consider myasthenia gravis — acetylcholine receptor antibodies, EMG' },
        { label: 'Absent/reduced reflexes, recent GI or respiratory infection', next: 'Consider Guillain-Barré syndrome' },
      ] },
      { node: 'Suspected GBS — confirm diagnosis', branches: [
        { label: 'LP after first week: high protein, normal WBC', next: 'Albuminocytologic dissociation supports GBS' },
        { label: 'NCS/EMG shows demyelinating pattern', next: 'Supports AIDP variant of GBS' },
      ] },
      { node: 'Assess respiratory and autonomic status', branches: [
        { label: 'FVC <15-20 mL/kg or falling rapidly', next: 'Elective intubation, ICU admission' },
        { label: 'Autonomic instability (BP/HR swings)', next: 'Continuous cardiac monitoring' },
      ] },
      { node: 'Disease-modifying treatment', branches: [
        { label: 'Available access', next: 'IVIG' },
        { label: 'Alternative / IVIG contraindicated', next: 'Plasmapheresis' },
        { label: 'Not indicated', next: 'Corticosteroids — no proven benefit, avoid' },
      ] },
    ]),
  },
  {
    module_number: 12,
    module_title: 'Neurology and Special Senses',
    key_submodule: 'Sensory Abnormalities',
    slug: 'subacute-combined-degeneration',
    title: 'Subacute Combined Degeneration (Vitamin B12 Deficiency)',
    sort_order: 4,

    hook_vignette: `A 68-year-old woman with a history of autoimmune gastritis presents with several months of progressive gait unsteadiness and tingling in her feet and hands. On exam she has diminished vibration and proprioception in the toes, a positive Romberg sign, hyperreflexic patellar reflexes but absent ankle jerks, and an upgoing plantar response bilaterally. She also reports irritability and mild memory difficulty.`,

    ddx_mapping: `The combination of impaired proprioception/vibration sense (dorsal column) with upper motor neuron signs (hyperreflexia, upgoing plantar response) plus a peripheral neuropathy (absent ankle jerks) in the same patient is a very specific pattern that should immediately suggest vitamin B12 deficiency causing subacute combined degeneration, rather than a pure peripheral neuropathy or a pure myelopathy.
Diabetic peripheral neuropathy: a symmetric, length-dependent, purely peripheral sensory neuropathy (stocking-glove pattern) — it does NOT produce upper motor neuron signs like hyperreflexia or an upgoing plantar response, because it doesn't affect the spinal cord.
Tabes dorsalis (tertiary neurosyphilis): also damages the dorsal columns (impaired vibration/proprioception, positive Romberg, areflexia) but classically spares the corticospinal tracts, so reflexes are diminished/absent rather than the mixed picture of hyper- and hypo-reflexia seen in B12 deficiency; look for Argyll Robertson pupils and a history of syphilis.
Copper deficiency myelopathy: can mimic subacute combined degeneration almost exactly (identical dorsal column plus corticospinal findings), classically seen after bariatric surgery or excessive zinc ingestion (zinc induces copper deficiency) — differentiated by serum copper/ceruloplasmin levels with a normal B12.
Multiple sclerosis: can cause combined sensory and motor deficits, but typically has a relapsing-remitting course in a younger patient with lesions disseminated in time and space on MRI, rather than the steady subacute progression and symmetric dorsal column pattern of B12 deficiency.`,

    diagnostic_evaluation: `Serum vitamin B12 level is the first test, though it can be falsely normal in early deficiency — serum methylmalonic acid (MMA) and homocysteine are more sensitive and both are elevated in true B12 deficiency (homocysteine alone is also elevated in folate deficiency, but MMA is elevated specifically in B12 deficiency, which helps distinguish the two).
CBC with peripheral smear may show a macrocytic anemia with hypersegmented neutrophils, though neurologic disease can precede hematologic changes and can occur even with a normal MCV, so a normal CBC does not rule out the diagnosis.
Because this patient's B12 deficiency is due to autoimmune gastritis (pernicious anemia), intrinsic factor antibodies and/or parietal cell antibodies should be checked to confirm the underlying cause — autoimmune destruction of gastric parietal cells impairs production of intrinsic factor, which is required for terminal ileal B12 absorption.
MRI of the spinal cord (if obtained) may show T2 hyperintensity in the dorsal columns, classically described as an "inverted V" or "rabbit ears" sign on axial imaging, reflecting posterior column demyelination.`,

    management: `Treat with parenteral (intramuscular) vitamin B12 replacement, especially when malabsorption (as in pernicious anemia) is the cause, since oral replacement may not be reliably absorbed; high-dose oral B12 can be used in some cases once intrinsic factor-independent absorption is established.
Neurologic improvement can be substantial if treatment starts early, but deficits present for a long time (often described as beyond several months) may be only partially reversible or permanent — this is why early recognition matters.
Critically, folate should never be given alone to a patient with unrecognized B12 deficiency: folate replacement can correct the megaloblastic anemia and mask the hematologic clue to B12 deficiency while the neurologic damage continues to progress silently — so B12 status must always be checked and treated before or alongside folate.
Because the underlying cause here is pernicious anemia, these patients need lifelong B12 supplementation (the intrinsic factor deficiency does not resolve) and should be monitored, as pernicious anemia also carries an increased risk of gastric cancer/carcinoid, warranting consideration of surveillance.`,

    first_order_prompt: `Which two spinal cord tracts are affected in subacute combined degeneration, producing its combined sensory-and-motor exam pattern?`,
    first_order_answer: `The dorsal (posterior) columns (impaired vibration/proprioception, positive Romberg) and the lateral corticospinal tracts (upper motor neuron signs — hyperreflexia, spasticity, upgoing plantar response), plus a peripheral neuropathy component.`,

    second_order_vignette: `A 74-year-old man who underwent a Roux-en-Y gastric bypass three years ago presents with six months of progressive difficulty walking and numbness in his feet. Exam reveals loss of vibration sense in the toes bilaterally, brisk knee reflexes, absent ankle reflexes, and bilateral upgoing plantar responses. Serum vitamin B12 level is within the low-normal range.`,
    second_order_question: `Which additional laboratory test is most likely to confirm the diagnosis despite the normal-appearing B12 level?`,
    second_order_choices: JSON.stringify([
      { label: 'A', text: 'Serum methylmalonic acid', correct: true, explanation: `Serum B12 can be falsely "normal" in early or borderline deficiency; methylmalonic acid (a substrate that accumulates when the B12-dependent enzyme methylmalonyl-CoA mutase is impaired) is a more sensitive marker and would be elevated in true B12 deficiency, fitting this patient's post-bariatric malabsorption risk and classic combined dorsal column/corticospinal exam.` },
      { label: 'B', text: 'Serum ferritin', correct: false, explanation: `Iron deficiency causes a microcytic anemia and fatigue, not this combined sensory-motor neurologic syndrome; it would not explain or confirm this presentation.` },
      { label: 'C', text: 'Thyroid-stimulating hormone', correct: false, explanation: `Hypothyroidism can cause a peripheral neuropathy and cognitive slowing but does not produce the specific dorsal column plus corticospinal tract pattern described here.` },
      { label: 'D', text: 'Anti-nuclear antibody', correct: false, explanation: `ANA screens for systemic autoimmune disease (like lupus) and is nonspecific; it would not confirm a nutritional myelopathy in this clinical context.` },
      { label: 'E', text: 'Serum lead level', correct: false, explanation: `Lead toxicity classically causes a motor-predominant peripheral neuropathy (wrist/foot drop) and microcytic anemia with basophilic stippling, not this combined dorsal column/corticospinal picture, and there's no exposure history given.` },
    ]),
    second_order_answer: 'A',
    second_order_explanation: `Roux-en-Y gastric bypass bypasses the stomach and duodenum, impairing intrinsic factor-mediated B12 absorption and predisposing to deficiency over years as body stores deplete. Serum B12 alone is an imperfect test and can sit in a falsely reassuring low-normal range; methylmalonic acid (and homocysteine) rise before or independent of a clearly low serum B12 level and are the appropriate confirmatory tests when clinical suspicion (as here, with the classic combined dorsal column and corticospinal exam) is high despite a normal-appearing B12.`,

    flowchart_title: 'Combined Sensory-Motor Neuropathy Evaluation',
    flowchart: JSON.stringify([
      { node: 'Impaired vibration/proprioception + upper motor neuron signs', branches: [
        { label: 'Absent reflexes throughout, pupils affected (Argyll Robertson)', next: 'Consider pure dorsal column process — check syphilis serologies (tabes dorsalis)' },
        { label: 'Mixed hyper-/hypo-reflexia (dorsal column + corticospinal)', next: 'Suspect subacute combined degeneration' },
      ] },
      { node: 'Suspected B12 deficiency — initial testing', branches: [
        { label: 'Serum B12 clearly low', next: 'Confirms diagnosis — proceed to cause workup' },
        { label: 'Serum B12 normal/borderline but suspicion high', next: 'Check methylmalonic acid and homocysteine' },
      ] },
      { node: 'Identify the underlying cause', branches: [
        { label: 'Positive intrinsic factor / parietal cell antibodies', next: 'Pernicious anemia (autoimmune gastritis)' },
        { label: 'History of bariatric surgery or terminal ileal disease', next: 'Malabsorptive B12 deficiency' },
        { label: 'Normal B12/MMA but low ceruloplasmin', next: 'Consider copper deficiency myelopathy instead' },
      ] },
      { node: 'Treatment', branches: [
        { label: 'Malabsorption present', next: 'Parenteral (IM) B12 replacement, lifelong' },
        { label: 'Concurrent low folate', next: 'Replace B12 first/alongside — never folate alone' },
      ] },
    ]),
  },
  {
    module_number: 12,
    module_title: 'Neurology and Special Senses',
    key_submodule: 'Altered Mental Status',
    slug: 'wernicke-encephalopathy',
    title: 'Wernicke Encephalopathy',
    sort_order: 5,

    hook_vignette: `A 47-year-old man with a long history of heavy alcohol use is brought to the emergency department by his family for three days of confusion after not eating much and drinking heavily over the past week. On exam he is disoriented to time and place, has a wide-based, unsteady gait, and has impaired horizontal eye movements with nystagmus bilaterally.`,

    ddx_mapping: `The classic triad of encephalopathy (confusion), ataxia, and ophthalmoplegia/nystagmus in a malnourished or alcohol-use patient is highly specific for Wernicke encephalopathy, though the full triad is present in only a minority of cases — a high index of suspicion is needed in any at-risk patient with even one of these findings.
Alcohol withdrawal delirium (delirium tremens): also causes confusion in a patient with heavy alcohol use, but is accompanied by autonomic hyperactivity (tachycardia, hypertension, diaphoresis, fever), tremor, and often hallucinations, typically 48-96 hours after the last drink — it lacks the specific ataxia/ophthalmoplegia pairing of Wernicke's and is identified largely by its timing relative to cessation of drinking.
Hepatic encephalopathy: confusion with asterixis in a patient with cirrhosis/liver failure and an elevated ammonia level, without the specific eye movement abnormalities of Wernicke's.
Alcoholic intoxication itself: causes ataxia and confusion acutely, but resolves as blood alcohol clears and does not typically cause sustained ophthalmoplegia; if confusion/ataxia persist beyond expected intoxication, Wernicke's must be considered.
Hypoglycemia: can cause acute confusion and even ataxia in an alcoholic patient (impaired gluconeogenesis), checked immediately with fingerstick glucose, but does not cause ophthalmoplegia and resolves rapidly with glucose administration.
Critically, if IV glucose is given to a thiamine-deficient patient before thiamine is replaced, it can precipitate or worsen Wernicke encephalopathy by consuming the little remaining thiamine as a cofactor for glucose metabolism — thiamine must be given first or simultaneously.`,

    diagnostic_evaluation: `Wernicke encephalopathy is a clinical diagnosis — do not wait for confirmatory testing before treating, since delayed treatment risks irreversible brain injury.
Thiamine (vitamin B1) level can be sent but usually returns after the window for empiric treatment; it is not required to initiate therapy.
MRI brain, if obtained, may show characteristic T2/FLAIR hyperintensity in the mammillary bodies, medial thalami, and periaqueductal gray matter, supporting the diagnosis but not required for it.
Associated labs to check include glucose (avoid unopposed glucose administration), electrolytes (refeeding-risk patients), and liver function, since chronic alcohol use commonly coexists with other nutritional and hepatic derangements that need concurrent management.`,

    management: `Immediate empiric high-dose IV thiamine (before or simultaneously with any glucose-containing fluids) is the cornerstone of treatment — this is a clinical emergency, and thiamine is inexpensive and essentially risk-free, so treatment should never be withheld pending labs.
Ophthalmoplegia and ataxia typically improve within days of thiamine repletion, but confusion may take longer to resolve and can leave residual cognitive impairment.
If untreated (or treated too late), Wernicke encephalopathy can progress to Korsakoff syndrome — a chronic amnestic disorder with anterograde and retrograde amnesia and confabulation, caused by damage to the mammillary bodies and related circuits; Korsakoff syndrome's memory deficits are often only partially reversible even with thiamine.
Longer-term management addresses the underlying alcohol use disorder (counseling, consideration of pharmacotherapy) and ensures ongoing nutritional supplementation, since these patients remain at risk for recurrent thiamine deficiency.`,

    first_order_prompt: `What is the classic clinical triad of Wernicke encephalopathy?`,
    first_order_answer: `Confusion (encephalopathy), ataxia, and ophthalmoplegia/nystagmus — though all three are present together in only a minority of patients.`,

    second_order_vignette: `A 55-year-old woman with a history of alcohol use disorder is brought to the emergency department after several days of poor oral intake. She is found to be hypoglycemic (glucose 48 mg/dL) and confused, and the resident orders IV dextrose to be given immediately, planning to check a thiamine level afterward and treat if low.`,
    second_order_question: `What is the most significant risk of this management plan?`,
    second_order_choices: JSON.stringify([
      { label: 'A', text: 'The dextrose will cause acute hepatic failure', correct: false, explanation: `IV dextrose does not directly precipitate hepatic failure; this is not the primary concern in a thiamine-deficient patient.` },
      { label: 'B', text: 'Administering glucose before thiamine may precipitate or worsen Wernicke encephalopathy', correct: true, explanation: `Thiamine is a required cofactor for glucose metabolism (pyruvate dehydrogenase, alpha-ketoglutarate dehydrogenase, transketolase); giving a glucose load to a thiamine-depleted patient can consume remaining thiamine stores and precipitate or worsen Wernicke encephalopathy, so thiamine should be given before or together with glucose-containing fluids in any at-risk patient.` },
      { label: 'C', text: 'Waiting for the thiamine level will unnecessarily delay treatment of her hypoglycemia', correct: false, explanation: `Hypoglycemia itself is being treated promptly with dextrose in this plan; the danger is not delayed glucose treatment but the sequence in which glucose and thiamine are given relative to each other.` },
      { label: 'D', text: 'IV dextrose is contraindicated in all patients with alcohol use disorder', correct: false, explanation: `Dextrose is not contraindicated in alcohol use disorder generally — it is specifically the timing relative to thiamine replacement in a potentially thiamine-deficient patient that matters, not an absolute contraindication to glucose.` },
      { label: 'E', text: 'Thiamine levels are unreliable and should never be checked', correct: false, explanation: `The real point is not that thiamine levels are unreliable, but that treatment for suspected Wernicke encephalopathy should never wait for lab confirmation — thiamine should be given empirically before or with glucose regardless of whether a level is sent.` },
    ]),
    second_order_answer: 'B',
    second_order_explanation: `This patient, with alcohol use disorder and poor intake, is at high risk for subclinical thiamine deficiency. Thiamine pyrophosphate is a cofactor in glucose metabolism, and administering a glucose load without first (or simultaneously) replacing thiamine can acutely deplete remaining thiamine reserves and trigger or worsen Wernicke encephalopathy. The correct approach is to give thiamine before or at the same time as dextrose in any patient at risk, rather than treating hypoglycemia first and checking thiamine status afterward.`,

    flowchart_title: 'Suspected Wernicke Encephalopathy in an At-Risk Patient',
    flowchart: JSON.stringify([
      { node: 'Confusion in a patient with alcohol use disorder / malnutrition', branches: [
        { label: 'Autonomic hyperactivity, tremor, timing tied to cessation of drinking', next: 'Consider alcohol withdrawal / delirium tremens' },
        { label: 'Ataxia and/or ophthalmoplegia present', next: 'Treat empirically as Wernicke encephalopathy' },
      ] },
      { node: 'Before any glucose-containing fluids', branches: [
        { label: 'Thiamine deficiency risk present', next: 'Give IV thiamine first or simultaneously with glucose' },
        { label: 'Glucose given first without thiamine', next: 'Risk of precipitating/worsening Wernicke encephalopathy' },
      ] },
      { node: 'Response to thiamine repletion', branches: [
        { label: 'Treated promptly', next: 'Ataxia/ophthalmoplegia typically improve within days' },
        { label: 'Delayed or untreated', next: 'Risk of progression to Korsakoff syndrome' },
      ] },
      { node: 'Korsakoff syndrome develops', branches: [
        { label: 'Anterograde and retrograde amnesia, confabulation', next: 'Often only partially reversible despite thiamine' },
        { label: 'Started early, aggressively treated', next: 'Best chance of meaningful cognitive recovery' },
      ] },
    ]),
  },
  {
    module_number: 12,
    module_title: 'Neurology and Special Senses',
    key_submodule: 'Movement Disorders',
    slug: 'parkinsons-disease',
    title: "Parkinson's Disease",
    sort_order: 6,

    hook_vignette: `A 68-year-old retired accountant is brought in by his daughter, who has noticed over the past year that he walks with a stooped posture and shuffling steps, has a soft, monotone voice, and has developed a resting tremor in his right hand that lessens when he reaches for his coffee cup. He also reports a diminished sense of smell over several years and occasionally acts out his dreams during sleep.`,

    ddx_mapping: `The combination of asymmetric resting tremor, bradykinesia, rigidity, and postural instability, developing gradually and preceded by nonmotor prodromal features (anosmia, REM sleep behavior disorder, constipation), is classic for idiopathic Parkinson's disease and helps separate it from its main mimics.
Essential tremor: a bilateral, symmetric action/postural tremor (worse with movement or sustained posture, better at rest) — essentially the opposite pattern from Parkinson's resting tremor — often improves with alcohol and has a family history; it does not cause bradykinesia or rigidity.
Drug-induced parkinsonism: caused by dopamine-receptor-blocking agents (typical antipsychotics, metoclopramide), typically symmetric in onset and temporally linked to starting the offending drug, improving after the drug is stopped — always check the medication list before diagnosing idiopathic Parkinson's disease.
Multiple system atrophy: parkinsonism plus early, prominent autonomic failure (orthostatic hypotension, urinary dysfunction) and/or cerebellar signs, with a poor/absent response to levodopa — a red flag distinguishing it from idiopathic Parkinson's disease.
Progressive supranuclear palsy: parkinsonism with early, prominent postural instability/falls and a characteristic vertical (especially downward) gaze palsy, also with a poor levodopa response.
Normal pressure hydrocephalus: the classic triad of gait disturbance ("magnetic" broad-based gait), urinary incontinence, and cognitive decline — gait apraxia rather than a true parkinsonian shuffle, and no resting tremor.`,

    diagnostic_evaluation: `Parkinson's disease remains primarily a clinical diagnosis based on the cardinal features — bradykinesia plus at least one of resting tremor, rigidity, or postural instability — along with supportive features (asymmetric onset, excellent and sustained response to levodopa, presence of nonmotor prodromal symptoms).
Neuroimaging (MRI brain) is typically obtained not to confirm Parkinson's disease itself but to exclude structural mimics (normal pressure hydrocephalus, vascular parkinsonism, structural lesions).
DaTscan (dopamine transporter SPECT imaging) can help distinguish Parkinson's disease/other degenerative parkinsonian syndromes (all of which show reduced striatal dopamine transporter uptake) from essential tremor or drug-induced parkinsonism (which have normal DaTscan uptake), though it cannot distinguish idiopathic Parkinson's disease from the atypical parkinsonian syndromes (MSA, PSP) from each other.
A trial of levodopa with a robust, sustained motor improvement is itself considered strong supportive evidence for idiopathic Parkinson's disease, since atypical parkinsonian syndromes characteristically respond poorly.`,

    management: `Levodopa/carbidopa remains the most effective symptomatic therapy for the motor symptoms of Parkinson's disease; carbidopa is a peripheral decarboxylase inhibitor that prevents peripheral conversion of levodopa to dopamine, reducing peripheral side effects (nausea) and increasing the amount of levodopa reaching the brain.
In younger patients, or to delay levodopa-related motor complications (dyskinesias, motor fluctuations/"wearing off"), a dopamine agonist (e.g., pramipexole, ropinirole) or an MAO-B inhibitor (e.g., selegiline) may be used first or as an adjunct, though dopamine agonists carry a notable risk of impulse control disorders (compulsive gambling, hypersexuality) that patients and families should be counseled about.
As disease progresses and levodopa-related motor fluctuations become disabling, deep brain stimulation (typically targeting the subthalamic nucleus or globus pallidus interna) can be considered in appropriately selected patients who still have a good levodopa response.
Nonmotor symptoms need active management too: orthostatic hypotension, constipation, depression, and cognitive decline (Parkinson's disease dementia typically emerges late, distinguishing it in timing from dementia with Lewy bodies, where cognitive decline precedes or closely coincides with parkinsonism) all require attention as part of comprehensive care, along with physical/occupational therapy for gait and fall prevention.`,

    first_order_prompt: `What is the underlying neuropathologic hallmark of idiopathic Parkinson's disease, and where does the earliest, most clinically relevant degeneration occur?`,
    first_order_answer: `Loss of dopaminergic neurons in the substantia nigra pars compacta, with intracellular Lewy bodies (alpha-synuclein aggregates) — degeneration of the nigrostriatal pathway produces the classic motor features.`,

    second_order_vignette: `A 71-year-old man presents with a 2-year history of slowness of movement and rigidity. His wife notes that over the past 8 months he has had several unexplained falls backward and has increasing trouble looking down when walking down stairs. His tremor has never been prominent, and a trial of levodopa produced minimal improvement in his symptoms.`,
    second_order_question: `Which diagnosis best explains this presentation?`,
    second_order_choices: JSON.stringify([
      { label: 'A', text: "Idiopathic Parkinson's disease", correct: false, explanation: `Idiopathic Parkinson's disease typically features a prominent asymmetric resting tremor and a robust, sustained response to levodopa — neither of which this patient has, making idiopathic Parkinson's disease less likely than an atypical parkinsonian syndrome.` },
      { label: 'B', text: 'Progressive supranuclear palsy', correct: true, explanation: `Early, prominent postural instability with falls (particularly backward falls), a vertical (especially downward) gaze palsy causing difficulty looking down stairs, minimal tremor, and poor levodopa responsiveness are the classic features distinguishing progressive supranuclear palsy from idiopathic Parkinson's disease.` },
      { label: 'C', text: 'Essential tremor', correct: false, explanation: `Essential tremor causes a bilateral action/postural tremor without bradykinesia, rigidity, falls, or gaze abnormalities — this patient's presentation is dominated by rigidity, falls, and a gaze palsy, not tremor.` },
      { label: 'D', text: 'Normal pressure hydrocephalus', correct: false, explanation: `NPH causes a magnetic, apraxic gait with urinary incontinence and cognitive decline, but does not classically cause a vertical gaze palsy, which is the specific localizing clue here.` },
      { label: 'E', text: 'Drug-induced parkinsonism', correct: false, explanation: `There is no history given of a dopamine-blocking medication, and drug-induced parkinsonism does not produce a supranuclear gaze palsy; it also typically improves after stopping the offending agent.` },
    ]),
    second_order_answer: 'B',
    second_order_explanation: `The vertical (particularly downward) supranuclear gaze palsy combined with early prominent postural instability/falls and poor levodopa response is the classic triad pointing to progressive supranuclear palsy, one of the atypical parkinsonian ("Parkinson-plus") syndromes. Recognizing these red-flag features (early falls, poor levodopa response, gaze palsy, or in MSA's case, early autonomic/cerebellar involvement) is what separates the atypical syndromes from idiopathic Parkinson's disease on the exam and in practice, since prognosis and levodopa responsiveness differ substantially.`,

    flowchart_title: 'Parkinsonism Evaluation',
    flowchart: JSON.stringify([
      { node: 'Bradykinesia + rigidity and/or resting tremor', branches: [
        { label: 'Symmetric onset, recent dopamine-blocking drug started', next: 'Drug-induced parkinsonism — stop offending agent' },
        { label: 'Asymmetric onset, prodromal anosmia/REM sleep behavior disorder', next: "Favor idiopathic Parkinson's disease" },
      ] },
      { node: 'Red flags for atypical parkinsonism', branches: [
        { label: 'Early falls + vertical gaze palsy', next: 'Progressive supranuclear palsy' },
        { label: 'Early autonomic failure and/or cerebellar signs', next: 'Multiple system atrophy' },
        { label: 'None present, good levodopa response', next: "Supports idiopathic Parkinson's disease" },
      ] },
      { node: 'Levodopa trial response', branches: [
        { label: 'Robust, sustained improvement', next: "Strongly supports idiopathic Parkinson's disease" },
        { label: 'Minimal/poor response', next: 'Reconsider atypical parkinsonian syndrome or alternate diagnosis' },
      ] },
      { node: "Management of confirmed Parkinson's disease", branches: [
        { label: 'Motor symptoms limiting function', next: 'Levodopa/carbidopa (± dopamine agonist/MAO-B inhibitor)' },
        { label: 'Disabling motor fluctuations despite medication', next: 'Consider deep brain stimulation' },
      ] },
    ]),
  },
  {
    module_number: 12,
    module_title: 'Neurology and Special Senses',
    key_submodule: 'Ataxia',
    slug: 'friedreich-ataxia',
    title: 'Friedreich Ataxia',
    sort_order: 7,

    hook_vignette: `A 12-year-old boy is brought to clinic because of progressive clumsiness and frequent falls over the past year, along with slurred speech that his teachers have noticed. Exam reveals a wide-based, ataxic gait, dysarthria, absent ankle and knee reflexes, but bilateral upgoing plantar responses, along with pes cavus (high-arched feet) and mild kyphoscoliosis. His echocardiogram is ordered given a murmur heard on exam.`,

    ddx_mapping: `Progressive ataxia beginning in childhood/adolescence with the combination of absent reflexes (peripheral neuropathy) plus extensor plantar responses (corticospinal tract involvement), skeletal changes (pes cavus, scoliosis), and cardiac involvement is the classic pattern of Friedreich ataxia, distinguishing it from other causes of ataxia.
Ataxia-telangiectasia: also presents in childhood with progressive ataxia, but is distinguished by oculocutaneous telangiectasias (appearing later, often by age 4-6), recurrent sinopulmonary infections (IgA deficiency), an elevated alpha-fetoprotein, and a markedly increased risk of lymphoma/leukemia and radiosensitivity — not the cardiomyopathy/pes cavus pattern of Friedreich ataxia.
Vitamin E deficiency: can produce a nearly identical phenotype to Friedreich ataxia (posterior column and peripheral nerve involvement, areflexia, ataxia) due to shared oxidative-stress-related pathophysiology, but is distinguished by a low serum vitamin E level and a history of fat malabsorption (e.g., cystic fibrosis, abetalipoproteinemia) rather than a genetic trinucleotide repeat.
Multiple sclerosis: can cause ataxia in a similar age range, but typically has a relapsing-remitting course with other disseminated CNS lesions on MRI (optic neuritis, sensory symptoms in different distributions over time) rather than a steady, symmetric progression with peripheral areflexia and skeletal/cardiac findings.
Spinocerebellar ataxias (autosomal dominant, various types): typically present later (adulthood) with a positive family history in each generation (autosomal dominant inheritance) versus Friedreich ataxia's autosomal recessive pattern (often with unaffected, non-consanguineous-appearing parents).`,

    diagnostic_evaluation: `Genetic testing is diagnostic: Friedreich ataxia is caused by a GAA trinucleotide repeat expansion in the FXN gene (encoding frataxin, a mitochondrial iron-binding protein important for iron-sulfur cluster assembly), inherited in an autosomal recessive pattern; longer repeat expansions generally correlate with earlier onset and more severe disease.
Nerve conduction studies show a sensory axonal neuropathy with reduced or absent sensory nerve action potentials, reflecting dorsal root ganglion degeneration, while motor conduction is relatively preserved early on.
MRI of the spine/brain may show atrophy of the cervical spinal cord and cerebellum, though imaging is supportive rather than diagnostic.
Because cardiomyopathy (typically hypertrophic, sometimes progressing to dilated) is a leading cause of death in Friedreich ataxia, echocardiography and ECG should be obtained at diagnosis and monitored regularly; diabetes mellitus (from pancreatic involvement) should also be screened for periodically.`,

    management: `There is no cure; management is supportive and multidisciplinary — physical and occupational therapy to maintain mobility and function, bracing or orthopedic surgery for progressive scoliosis or pes cavus deformity as needed, and speech therapy for dysarthria/dysphagia.
Regular cardiology follow-up is essential given the high risk and severity of cardiomyopathy, which along with respiratory complications from scoliosis is a major cause of early mortality; heart failure is managed per standard cardiomyopathy protocols when it develops.
Diabetes screening and management are needed given the risk of impaired glucose regulation from pancreatic beta-cell involvement.
Omaveloxolone, an Nrf2 activator, is an FDA-approved disease-modifying therapy for Friedreich ataxia (improving mitochondrial function/reducing oxidative stress) — a newer option that reflects growing understanding of the frataxin-related oxidative stress pathophysiology; genetic counseling should also be offered to the family given the autosomal recessive inheritance pattern.`,

    first_order_prompt: `What is the genetic defect underlying Friedreich ataxia, and what protein does it affect?`,
    first_order_answer: `An autosomal recessive GAA trinucleotide repeat expansion in the FXN gene, reducing frataxin — a mitochondrial protein required for iron-sulfur cluster assembly.`,

    second_order_vignette: `A 16-year-old girl with a 3-year history of progressive gait ataxia and dysarthria is noted on routine exam to have absent deep tendon reflexes in both lower extremities, bilateral extensor plantar responses, and pes cavus. Her parents are healthy and unrelated, with no family history of neurologic disease. An echocardiogram reveals asymmetric septal hypertrophy.`,
    second_order_question: `A mutation in which gene is most likely responsible for this patient's presentation?`,
    second_order_choices: JSON.stringify([
      { label: 'A', text: 'FXN', correct: true, explanation: `This is the classic triad of Friedreich ataxia — ataxia with areflexia (peripheral neuropathy) plus extensor plantar responses (corticospinal involvement), pes cavus, and hypertrophic cardiomyopathy — caused by a GAA repeat expansion in FXN reducing frataxin, inherited in an autosomal recessive pattern consistent with unaffected, unrelated parents.` },
      { label: 'B', text: 'ATM', correct: false, explanation: `ATM mutations cause ataxia-telangiectasia, which would be expected to show telangiectasias, recurrent infections, and elevated alpha-fetoprotein rather than the cardiomyopathy and pes cavus described here.` },
      { label: 'C', text: 'HTT', correct: false, explanation: `HTT (huntingtin) CAG repeat expansions cause Huntington disease, an autosomal dominant chorea/cognitive disorder presenting in adulthood, not a childhood ataxic syndrome with areflexia and cardiomyopathy.` },
      { label: 'D', text: 'SMN1', correct: false, explanation: `SMN1 mutations cause spinal muscular atrophy, a lower motor neuron disease causing weakness and areflexia without ataxia, cardiomyopathy, or extensor plantar responses.` },
      { label: 'E', text: 'PMP22', correct: false, explanation: `PMP22 duplication causes Charcot-Marie-Tooth disease type 1A, a peripheral neuropathy with distal weakness and areflexia, but it does not cause ataxia, extensor plantar responses, or cardiomyopathy.` },
    ]),
    second_order_answer: 'A',
    second_order_explanation: `The combination of childhood-onset progressive ataxia, sensory neuropathy with areflexia, extensor plantar responses (corticospinal tract involvement), skeletal findings (pes cavus), and hypertrophic cardiomyopathy in a patient with unaffected, unrelated parents (fitting autosomal recessive inheritance) is the classic presentation of Friedreich ataxia, caused by a GAA trinucleotide repeat expansion in the FXN gene that reduces frataxin expression and impairs mitochondrial iron-sulfur cluster assembly, leading to oxidative damage in neurons and cardiomyocytes.`,

    flowchart_title: 'Childhood/Adolescent Progressive Ataxia Workup',
    flowchart: JSON.stringify([
      { node: 'Progressive ataxia with onset in childhood/adolescence', branches: [
        { label: 'Telangiectasias, recurrent infections, elevated AFP', next: 'Consider ataxia-telangiectasia — ATM testing' },
        { label: 'Areflexia + extensor plantar responses + pes cavus', next: 'Consider Friedreich ataxia' },
      ] },
      { node: 'Suspected Friedreich ataxia — confirm cause', branches: [
        { label: 'History of fat malabsorption, low serum vitamin E', next: 'Consider vitamin E deficiency ataxia instead' },
        { label: 'No malabsorption history, normal vitamin E', next: 'Proceed to genetic testing for FXN GAA repeat expansion' },
      ] },
      { node: 'FXN GAA repeat expansion confirmed', branches: [
        { label: 'Baseline workup', next: 'Echocardiogram/ECG + diabetes screening at diagnosis' },
        { label: 'Ongoing care', next: 'Multidisciplinary supportive management + omaveloxolone' },
      ] },
      { node: 'Surveillance for complications', branches: [
        { label: 'Hypertrophic cardiomyopathy develops', next: 'Cardiology management, monitor for progression to heart failure' },
        { label: 'Progressive scoliosis', next: 'Orthopedic bracing/surgery as needed' },
      ] },
    ]),
  },
  {
    module_number: 12,
    module_title: 'Neurology and Special Senses',
    key_submodule: 'Seizures',
    slug: 'temporal-lobe-epilepsy',
    title: 'Temporal Lobe Epilepsy (Mesial Temporal Sclerosis)',
    sort_order: 8,

    hook_vignette: `A 26-year-old woman has recurrent episodes, several times a month, in which she reports a rising epigastric sensation and an intense feeling of déjà vu, followed by staring, lip-smacking, and unresponsiveness lasting about a minute, with no memory of the event afterward. She has a history of a prolonged febrile seizure at age 3.`,

    ddx_mapping: `A focal aura (epigastric rising sensation, déjà vu) followed by impaired awareness with automatisms (lip-smacking, staring) is classic for a focal seizure with impaired awareness arising from the temporal lobe, and the childhood history of prolonged febrile seizure is a well-established risk factor for mesial temporal sclerosis.
Absence seizures: brief (a few seconds), abrupt-onset staring spells without a preceding aura and without postictal confusion, typically in children, with a 3-Hz spike-and-wave pattern on EEG — distinguished from temporal lobe seizures by the lack of an aura, absence of automatisms, and much shorter duration.
Psychogenic nonepileptic seizures (PNES): can mimic focal seizures with altered awareness, but events often have variable/atypical semiology (asynchronous limb movements, pelvic thrusting, eyes closed and resistant to opening, waxing-waning course, longer duration), occur preferentially in front of witnesses, and are not associated with abnormal ictal EEG findings — video EEG monitoring is the gold standard to distinguish PNES from true epilepsy.
Syncope (including convulsive syncope): typically has a clear provoking trigger (prolonged standing, pain, emotional stress) with a brief prodrome of lightheadedness/graying vision, rapid recovery without prolonged postictal confusion, and any jerking movements are brief and follow the loss of consciousness rather than an aura preceding it.
Panic attack: can share the epigastric rising sensation and derealization/déjà vu-like feelings, but typically lasts longer (many minutes), is accompanied by prominent autonomic symptoms (palpitations, sweating, hyperventilation) without loss of awareness or automatisms, and there is no postictal confusion.`,

    diagnostic_evaluation: `EEG (ideally including sleep-deprived or video EEG monitoring to capture an event) is the key test, looking for interictal epileptiform discharges (spikes or sharp waves) localized over the anterior/mid temporal region, and ictal rhythmic temporal theta activity during a captured seizure.
MRI brain with epilepsy protocol (thin cuts through the hippocampus) is essential to look for mesial temporal sclerosis — hippocampal atrophy with increased T2/FLAIR signal, often with loss of the normal internal hippocampal architecture — the most common structural lesion underlying temporal lobe epilepsy, frequently related to a remote history of prolonged febrile seizures in childhood.
Neuropsychological testing can help lateralize temporal lobe dysfunction (verbal memory deficits with dominant/left temporal involvement, visuospatial memory deficits with nondominant/right temporal involvement) and is often used as part of presurgical evaluation.
A careful description of the aura and automatisms from the patient and witnesses remains central to localization even before any testing, since the specific aura (epigastric rising sensation, fear, déjà vu/jamais vu, olfactory hallucination) is a strong clinical localizer to the mesial temporal structures.`,

    management: `Antiseizure medications are first-line: options effective for focal seizures include levetiracetam, lamotrigine, carbamazepine, and oxcarbazepine, chosen based on side-effect profile, comorbidities, and (in women of childbearing age) teratogenicity considerations (valproate is generally avoided given its higher teratogenic risk).
About a third of patients with temporal lobe epilepsy due to mesial temporal sclerosis have seizures that are drug-resistant (failing two appropriately chosen and dosed antiseizure medications) — this is an important threshold, as continuing to try more medications indefinitely delays consideration of surgery, which has strong evidence of benefit in this specific population.
For drug-resistant temporal lobe epilepsy with a clearly localized unilateral mesial temporal sclerosis lesion, anterior temporal lobectomy (or selective amygdalohippocampectomy) offers a high likelihood of seizure freedom and is supported by randomized trial evidence — surgical referral should not be delayed once drug resistance is established.
Patients should also receive standard seizure safety counseling (driving restrictions per local law, medication adherence, avoiding known triggers like sleep deprivation and alcohol) and, for those not surgical candidates, alternatives like vagus nerve stimulation or responsive neurostimulation may be considered.`,

    first_order_prompt: `What structural brain finding on MRI is classically responsible for drug-resistant temporal lobe epilepsy, and what childhood risk factor is it associated with?`,
    first_order_answer: `Mesial temporal (hippocampal) sclerosis — hippocampal atrophy with T2/FLAIR hyperintensity — associated with a history of prolonged childhood febrile seizures.`,

    second_order_vignette: `A 34-year-old man has had episodes for the past two years, occurring roughly weekly, that begin with an intense feeling of fear and a rising sensation in his stomach, after which witnesses report he stares blankly, repeatedly picks at his shirt, and does not respond to his name for about 90 seconds; he is confused and tired for several minutes afterward and has no memory of the event. Trials of levetiracetam and then lamotrigine at adequate doses have not controlled his seizures. MRI shows left hippocampal atrophy with increased T2 signal.`,
    second_order_question: `Which of the following is the most appropriate next step in management?`,
    second_order_choices: JSON.stringify([
      { label: 'A', text: 'Add a third antiseizure medication and reassess in 6 months', correct: false, explanation: `This patient already meets criteria for drug-resistant epilepsy (failure of two appropriately chosen and dosed antiseizure medications), and continuing to cycle through more drugs has a low likelihood of achieving seizure freedom while delaying a treatment (surgery) that could be curative for his clearly localized lesion.` },
      { label: 'B', text: 'Refer for presurgical evaluation for possible anterior temporal lobectomy', correct: true, explanation: `This patient has drug-resistant temporal lobe epilepsy (failed two adequate antiseizure medication trials) with a clearly lateralized structural lesion (left mesial temporal sclerosis) on MRI concordant with his semiology — this is the classic profile for which epilepsy surgery offers a high chance of seizure freedom, and guidelines support prompt referral rather than further medication trials.` },
      { label: 'C', text: 'Begin video EEG monitoring only to confirm this is epilepsy, then discharge', correct: false, explanation: `While video EEG is part of presurgical workup, simply confirming the diagnosis and discharging without addressing his drug-resistant status and surgical candidacy fails to act on the actionable finding here — he needs referral toward definitive treatment, not just diagnostic confirmation.` },
      { label: 'D', text: 'Start a ketogenic diet as first-line treatment', correct: false, explanation: `Ketogenic diet is used mainly in pediatric drug-resistant epilepsy or as an adjunct when surgery isn't feasible/desired — it is not the preferred next step for an adult with a clearly localized, surgically resectable lesion.` },
      { label: 'E', text: 'Reassure him that temporal lobe epilepsy resolves spontaneously in adulthood and continue current therapy', correct: false, explanation: `Temporal lobe epilepsy due to mesial temporal sclerosis does not typically remit spontaneously, and this reassurance is inaccurate and would delay appropriate escalation of care.` },
    ]),
    second_order_answer: 'B',
    second_order_explanation: `This patient meets the standard definition of drug-resistant epilepsy (failure of two appropriately chosen and adequately dosed antiseizure medications), and has a clearly lateralizing lesion (left mesial temporal sclerosis) that is concordant with his seizure semiology (epigastric aura, automatisms, impaired awareness). This is precisely the population in which randomized controlled trial data show anterior temporal lobectomy produces substantially better seizure freedom rates than continued medical therapy, so timely referral for presurgical evaluation (video EEG monitoring, neuropsychological testing, and confirmation of localization) is the appropriate next step rather than further medication trials.`,

    flowchart_title: 'Focal Seizure with Impaired Awareness Workup',
    flowchart: JSON.stringify([
      { node: 'Episodic aura + staring + automatisms + postictal confusion', branches: [
        { label: 'Brief (seconds), no aura, no automatisms, child', next: 'Consider absence seizures — EEG for 3-Hz spike-wave' },
        { label: 'Aura (epigastric/déjà vu) + automatisms + amnesia for event', next: 'Consider temporal lobe epilepsy' },
      ] },
      { node: 'Suspected temporal lobe epilepsy — confirm', branches: [
        { label: 'Atypical semiology, normal ictal EEG on video monitoring', next: 'Consider psychogenic nonepileptic seizures' },
        { label: 'Interictal temporal spikes / ictal temporal rhythmic activity', next: 'MRI epilepsy protocol' },
      ] },
      { node: 'MRI epilepsy protocol', branches: [
        { label: 'Hippocampal atrophy + T2/FLAIR hyperintensity', next: 'Mesial temporal sclerosis confirmed' },
        { label: 'No structural lesion identified', next: 'Nonlesional focal epilepsy — antiseizure medication trial' },
      ] },
      { node: 'Treatment course', branches: [
        { label: 'Seizures controlled on 1st or 2nd medication', next: 'Continue antiseizure medication' },
        { label: 'Failed 2 adequate medication trials (drug-resistant)', next: 'Refer for presurgical evaluation / anterior temporal lobectomy' },
      ] },
    ]),
  },
  {
    module_number: 12,
    module_title: 'Neurology and Special Senses',
    key_submodule: 'Ophthalmology',
    slug: 'pituitary-adenoma-bitemporal-hemianopia',
    title: 'Pituitary Adenoma and Bitemporal Hemianopia',
    sort_order: 9,

    hook_vignette: `A 45-year-old woman presents with several months of headaches and progressive difficulty with peripheral vision, having bumped into objects and people at the edges of her vision on both sides. She also reports irregular menstrual periods and unexpected milky nipple discharge despite not breastfeeding. Visual field testing reveals loss of the outer (temporal) visual fields bilaterally, with central vision preserved.`,

    ddx_mapping: `Localizing a visual field defect starts with a simple anatomic rule: lesions anterior to the optic chiasm cause monocular deficits, lesions AT the chiasm cause bitemporal deficits, and lesions posterior to the chiasm (optic tract, radiations, occipital cortex) cause homonymous (same-side) deficits in both eyes — this patient's bilateral temporal field loss localizes precisely to the optic chiasm.
Optic neuritis: causes monocular vision loss (central scotoma), pain with eye movement, and an afferent pupillary defect in one eye — a pre-chiasmal, unilateral pattern, not the bilateral temporal pattern seen here, and typically associated with multiple sclerosis in a younger patient.
Occipital lobe stroke (posterior cerebral artery territory): causes a homonymous hemianopia (loss of the same side of the visual field in both eyes), often with macular sparing (due to dual blood supply to the occipital pole) — a fundamentally different pattern (posterior to the chiasm) than the bitemporal loss described here.
Optic tract lesion: also produces a homonymous field defect (incongruous, i.e., not identical in shape between the two eyes), located just posterior to the chiasm — again distinct from bitemporal loss.
Craniopharyngioma: can also compress the optic chiasm from above (arising from Rathke's pouch remnants) producing a similar bitemporal hemianopia, but classically occurs in a bimodal age distribution (children and older adults) with suprasellar calcifications on imaging, distinguishing it radiographically from a pituitary adenoma even though the visual field pattern can look identical.
The key overall teaching point: this patient's bilateral, symmetric temporal field loss with preserved central and nasal fields is essentially diagnostic of a chiasmal lesion, most commonly a pituitary macroadenoma compressing the chiasm from below, which pinches the crossing nasal retinal fibers (which carry temporal field information) first.`,

    diagnostic_evaluation: `Formal automated visual field testing (perimetry) confirms and maps the bitemporal hemianopia, typically denser superiorly initially (since the inferior chiasmal fibers, carrying superior field information, are compressed first by a pituitary mass growing upward from below) before progressing to complete quadrant/hemifield loss.
MRI brain with pituitary protocol (dedicated thin-cut sequences through the sella) is the definitive imaging study, looking for a pituitary mass and assessing the degree of suprasellar extension and optic chiasm compression.
A full pituitary hormone panel should be obtained: prolactin (this patient's galactorrhea and menstrual irregularity suggest a prolactinoma, though a very large nonfunctioning adenoma can also modestly elevate prolactin via "stalk effect" by compressing the pituitary stalk and disrupting dopamine's tonic inhibition of prolactin — a markedly elevated prolactin level, however, favors a true prolactin-secreting tumor over stalk effect), along with IGF-1 (acromegaly), cortisol/ACTH (Cushing disease), and TSH/free T4, since pituitary masses can be either hormonally active (functioning) or silent (nonfunctioning) and each has different implications for both symptoms and treatment.
Formal ophthalmologic exam, including visual acuity and fundoscopy (to assess for optic disc pallor from chronic compression), rounds out the evaluation and helps establish a baseline to track treatment response.`,

    management: `Treatment depends heavily on tumor type: if this is a prolactinoma (confirmed by a markedly elevated prolactin level appropriate to tumor size), first-line treatment is a dopamine agonist (cabergoline preferred over bromocriptine for efficacy and tolerability) — this is unusual among pituitary tumors in that medical therapy alone, rather than surgery, is first-line and often shrinks the tumor enough to relieve chiasmal compression and restore vision.
For other functioning or nonfunctioning macroadenomas causing visual field compromise, or for a prolactinoma that fails to respond adequately to dopamine agonist therapy, transsphenoidal surgical resection is the standard approach, chosen because it avoids external incisions and has a strong track record for pituitary lesions.
Visual field defects from chiasmal compression can improve substantially after decompression (medical or surgical), especially if treated before permanent optic nerve damage (optic atrophy) sets in — this is why prompt diagnosis and treatment matter for visual prognosis, not just for controlling the mass itself.
Postoperative or ongoing endocrine monitoring is essential, since pituitary surgery can cause new hormone deficiencies (hypopituitarism, sometimes including transient or permanent diabetes insipidus from posterior pituitary/stalk disruption) that need to be screened for and treated with hormone replacement as needed.`,

    first_order_prompt: `What is the classic visual field defect caused by a pituitary adenoma compressing the optic chiasm, and which retinal fibers does this reflect?`,
    first_order_answer: `Bitemporal hemianopia — from compression of the crossing nasal retinal fibers at the optic chiasm, which carry information from the temporal visual fields.`,

    second_order_vignette: `A 52-year-old man presents with 6 months of headache and new difficulty seeing objects to the outer edges of his vision on both sides while driving. Visual field testing confirms a bitemporal hemianopia, denser in the superior quadrants. MRI reveals a 2.5 cm pituitary mass with suprasellar extension abutting the optic chiasm. Serum prolactin is 38 ng/mL (mildly elevated; upper limit of normal ~20 ng/mL), and all other pituitary hormone levels are normal.`,
    second_order_question: `Which of the following best explains this patient's mild prolactin elevation, and what is the most appropriate next step?`,
    second_order_choices: JSON.stringify([
      { label: 'A', text: 'This represents a true prolactinoma; start cabergoline', correct: false, explanation: `A prolactin level this mildly elevated in the setting of a large (2.5 cm) macroadenoma is more consistent with "stalk effect" from pituitary stalk compression than a true prolactin-secreting tumor, which typically causes prolactin levels rising into the hundreds or thousands in proportion to tumor size; treating this as a prolactinoma with medication alone risks leaving a compressive, likely nonfunctioning mass untreated.` },
      { label: 'B', text: 'This is stalk effect from mass compression disrupting dopaminergic inhibition; the mass is likely a nonfunctioning adenoma requiring transsphenoidal surgery given chiasmal compression', correct: true, explanation: `A large pituitary mass compressing the pituitary stalk disrupts the normal tonic dopaminergic inhibition of prolactin secretion, causing a mild-to-moderate ("stalk effect") prolactin elevation (usually less than 100-150 ng/mL) that is disproportionately low relative to the tumor's size — this pattern, combined with symptomatic chiasmal compression, points to a nonfunctioning macroadenoma that needs surgical decompression rather than dopamine agonist therapy alone.` },
      { label: 'C', text: 'Prolactin elevation is a normal, expected finding of no clinical significance in any pituitary mass and needs no further action', correct: false, explanation: `Prolactin elevation always requires interpretation in the context of the mass — it can mean a true prolactinoma (managed medically) or stalk effect from a nonfunctioning tumor (usually managed surgically when symptomatic); it is never something to simply disregard.` },
      { label: 'D', text: 'The mass is a craniopharyngioma and prolactin elevation is unrelated', correct: false, explanation: `While craniopharyngioma is on the differential for a sellar/suprasellar mass, nothing here (patient's age, absence of suprasellar calcifications noted) specifically points to it over a pituitary adenoma, and the prolactin elevation is directly relevant to characterizing the pituitary lesion itself, not an incidental unrelated finding.` },
      { label: 'E', text: 'Recommend observation alone with repeat imaging in one year', correct: false, explanation: `This patient has symptomatic chiasmal compression (progressive visual field loss) from a large mass — observation alone is inappropriate when there is an active, symptomatic mass effect on the optic apparatus; timely intervention is needed to prevent permanent vision loss.` },
    ]),
    second_order_answer: 'B',
    second_order_explanation: `The key teaching point is that not every prolactin elevation in the setting of a pituitary mass means a prolactinoma. A mild-to-moderate prolactin rise disproportionate to a large tumor's size classically reflects "stalk effect" — compression of the pituitary stalk impairs delivery of hypothalamic dopamine, which normally tonically suppresses lactotroph prolactin secretion, so prolactin rises modestly regardless of the tumor's actual secretory type. This distinction matters clinically: a true prolactinoma is treated first with a dopamine agonist, while a nonfunctioning macroadenoma causing stalk effect and symptomatic chiasmal compression (as in this patient, with progressive bitemporal visual field loss) is generally treated with transsphenoidal surgical decompression.`,

    flowchart_title: 'Visual Field Defect Localization',
    flowchart: JSON.stringify([
      { node: 'Visual field defect pattern', branches: [
        { label: 'Monocular loss, pain with eye movement', next: 'Pre-chiasmal — optic neuritis or other optic nerve lesion' },
        { label: 'Bitemporal loss, both eyes', next: 'Chiasmal lesion — pituitary adenoma or craniopharyngioma' },
        { label: 'Homonymous loss, same side both eyes', next: 'Post-chiasmal — optic tract, radiations, or occipital cortex lesion' },
      ] },
      { node: 'Confirmed chiasmal (bitemporal) defect', branches: [
        { label: 'Suprasellar calcifications, bimodal age (child/older adult)', next: 'Favor craniopharyngioma' },
        { label: 'Sellar mass, no calcification', next: 'Favor pituitary adenoma — obtain full hormone panel' },
      ] },
      { node: 'Prolactin level relative to tumor size', branches: [
        { label: 'Markedly elevated, proportional to size', next: 'True prolactinoma — first-line dopamine agonist' },
        { label: 'Mildly elevated, disproportionate to a large mass', next: 'Stalk effect — likely nonfunctioning adenoma' },
      ] },
      { node: 'Symptomatic chiasmal compression present', branches: [
        { label: 'Prolactinoma responsive to medical therapy', next: 'Continue dopamine agonist, monitor vision/imaging' },
        { label: 'Nonfunctioning adenoma or medical therapy failure', next: 'Transsphenoidal surgical resection' },
      ] },
    ]),
  },
  {
    module_number: 12,
    module_title: 'Neurology and Special Senses',
    key_submodule: 'Otolaryngology',
    slug: 'benign-paroxysmal-positional-vertigo',
    title: 'Benign Paroxysmal Positional Vertigo',
    sort_order: 10,

    hook_vignette: `A 58-year-old woman presents with recurrent episodes of intense spinning sensation lasting less than a minute, consistently triggered by rolling over in bed or looking up to reach a high shelf. Between episodes she feels completely normal, and she denies hearing loss, tinnitus, weakness, or double vision.`,

    ddx_mapping: `The single most useful discriminator between peripheral (inner ear) and central (brainstem/cerebellar) vertigo is the HINTS exam (Head Impulse, Nystagmus, Test of Skew) when a patient has acute, continuous vertigo with nystagmus — but this patient's brief, positional, recurrent pattern without any accompanying neurologic or auditory symptoms is itself already classic for benign paroxysmal positional vertigo (BPPV).
BPPV: brief (seconds to about a minute) episodes of vertigo specifically triggered by changes in head position relative to gravity (rolling over, looking up, bending down), due to displaced otoconia (canaliths) in the semicircular canals (most commonly the posterior canal) stimulating the cupula inappropriately; no hearing loss, tinnitus, or focal neurologic symptoms.
Vestibular neuritis (or labyrinthitis if hearing is also involved): continuous, severe vertigo lasting days, not triggered specifically by position (though movement worsens it), often following a viral illness, with a unidirectional horizontal nystagmus and an abnormal (positive) head impulse test — the sustained, non-episodic pattern differs from BPPV's brief, positional attacks.
Ménière disease: episodic vertigo lasting minutes to hours (longer than BPPV), classically with the triad of vertigo, fluctuating sensorineural hearing loss, and tinnitus/aural fullness — the auditory symptoms are the key differentiator from BPPV.
Central (posterior circulation stroke/TIA) vertigo: should be suspected when vertigo is accompanied by other brainstem/cerebellar signs (dysarthria, diplopia, ataxia disproportionate to the vertigo, limb weakness/numbness) or in a patient with vascular risk factors and acute continuous vertigo; a normal head impulse test paired with direction-changing nystagmus or skew deviation (the pattern making up a concerning HINTS exam) should raise suspicion for a central cause even when the patient otherwise looks well, and warrants MRI (with diffusion-weighted imaging, since even MRI can be falsely negative for a small posterior fossa stroke in the first 24-48 hours).`,

    diagnostic_evaluation: `The Dix-Hallpike maneuver is both diagnostic and the classic bedside test for posterior canal BPPV (the most common variant): the patient is moved rapidly from sitting to supine with the head turned 45 degrees to one side and extended slightly off the table edge; a positive test reproduces the vertigo and shows a brief (under a minute), fatigable, upbeating and torsional nystagmus with a short latency after the position change.
A supine roll test is used instead when horizontal (lateral) canal BPPV is suspected (nystagmus is horizontal rather than torsional).
No imaging is required for a straightforward positional-only presentation with a classic Dix-Hallpike response and no red-flag features (no hearing loss, no other neurologic findings) — this is a clinical diagnosis.
Red flags that should prompt further workup (MRI with attention to the posterior fossa, and possibly a formal HINTS exam by a trained clinician) include vertigo that is continuous rather than positional/episodic, new hearing loss, other neurologic symptoms (diplopia, dysarthria, limb ataxia, weakness/numbness), severe headache, or significant vascular risk factors in an older patient — any of these should make a clinician reconsider central causes before assuming BPPV.`,

    management: `Canalith repositioning maneuvers are both diagnostic and therapeutic: the Epley maneuver (for posterior canal BPPV) sequentially repositions the displaced otoconia out of the semicircular canal and back into the utricle, often relieving symptoms after just one or a few treatments, and can be taught to patients for at-home repetition (modified Epley/Semont maneuvers) if symptoms recur.
Vestibular suppressant medications (meclizine, benzodiazepines) are generally discouraged as primary therapy for BPPV — they only provide symptomatic relief and can actually impair the central vestibular compensation that helps resolve symptoms long-term, so they're reserved for brief use in patients with significant associated nausea rather than as ongoing treatment.
BPPV commonly recurs, and patients should be counseled about this and taught to self-perform repositioning maneuvers if symptoms return, rather than needing to return to a clinician for each episode.
If a central cause is suspected instead (based on red flags noted above), immediate neuroimaging and neurology consultation take priority over any peripheral vertigo treatment, since a missed posterior circulation stroke carries far greater morbidity than a delayed BPPV diagnosis.`,

    first_order_prompt: `What bedside maneuver both diagnoses and treats posterior canal BPPV, respectively?`,
    first_order_answer: `The Dix-Hallpike maneuver is used to diagnose it (reproducing vertigo with characteristic upbeating/torsional nystagmus), and the Epley maneuver is used to treat it (repositioning the otoconia out of the semicircular canal).`,

    second_order_vignette: `A 67-year-old man with hypertension and type 2 diabetes presents with 6 hours of continuous vertigo, mild unsteadiness when walking, and difficulty forming words. He denies hearing loss. On exam he has dysarthria and mild left-sided limb dysmetria on finger-to-nose testing. His symptoms are present even at rest and are not specifically triggered by head position.`,
    second_order_question: `Which of the following features in this patient should raise the most concern for a central (rather than peripheral) cause of vertigo?`,
    second_order_choices: JSON.stringify([
      { label: 'A', text: 'Absence of hearing loss', correct: false, explanation: `Absence of hearing loss doesn't distinguish central from peripheral vertigo well by itself — many peripheral causes (including BPPV and vestibular neuritis) also lack hearing loss; it is not the key red flag here.` },
      { label: 'B', text: 'Continuous vertigo at rest with dysarthria and limb dysmetria', correct: true, explanation: `Vertigo that is continuous rather than triggered by position, combined with other brainstem/cerebellar signs (dysarthria, limb dysmetria/ataxia) in a patient with vascular risk factors (hypertension, diabetes), is the classic red-flag pattern for a posterior circulation (cerebellar/brainstem) stroke or TIA and should prompt urgent neuroimaging rather than a peripheral vertigo workup.` },
      { label: 'C', text: 'Patient age over 60', correct: false, explanation: `While advancing age is a nonspecific risk factor for vascular disease, it alone is not what identifies this presentation as central vertigo — the specific combination of continuous vertigo with brainstem/cerebellar signs is the true red flag.` },
      { label: 'D', text: 'Presence of vertigo itself', correct: false, explanation: `Vertigo alone is a nonspecific symptom seen in both peripheral and central disease; it is the accompanying findings (continuous course, dysarthria, dysmetria) that localize this to a central process, not vertigo in isolation.` },
      { label: 'E', text: 'Mild nausea associated with the episode', correct: false, explanation: `Nausea commonly accompanies both peripheral and central vertigo and does not help distinguish between them; it is not a red flag for a central cause.` },
    ]),
    second_order_answer: 'B',
    second_order_explanation: `This patient's presentation — continuous (not positional) vertigo accompanied by dysarthria and limb dysmetria in a patient with significant vascular risk factors — is the classic red-flag pattern for a posterior circulation (vertebrobasilar) stroke or TIA affecting the cerebellum/brainstem, not benign peripheral vertigo. This warrants urgent MRI with diffusion-weighted imaging (recognizing it can still be falsely negative early) and neurology involvement, in contrast to the brief, position-triggered, isolated vertigo without other neurologic signs that characterizes BPPV.`,

    flowchart_title: 'Vertigo: Peripheral vs Central Localization',
    flowchart: JSON.stringify([
      { node: 'Patient presents with vertigo', branches: [
        { label: 'Brief episodes, triggered strictly by head position change', next: 'Suspect BPPV — perform Dix-Hallpike maneuver' },
        { label: 'Continuous vertigo, not positionally triggered', next: 'Assess for peripheral vs central cause' },
      ] },
      { node: 'Continuous vertigo — check for red flags', branches: [
        { label: 'Other brainstem/cerebellar signs (dysarthria, dysmetria, weakness) or vascular risk factors', next: 'Concerning for central (posterior circulation) cause — urgent MRI' },
        { label: 'Recent viral illness, unidirectional nystagmus, abnormal head impulse test, no other neuro signs', next: 'Favor vestibular neuritis/labyrinthitis' },
      ] },
      { node: 'Dix-Hallpike result', branches: [
        { label: 'Positive: brief upbeating/torsional nystagmus reproducing vertigo', next: 'Confirms posterior canal BPPV' },
        { label: 'Negative, but horizontal canal BPPV suspected', next: 'Perform supine roll test instead' },
      ] },
      { node: 'Confirmed BPPV', branches: [
        { label: 'Standard treatment', next: 'Epley maneuver (canalith repositioning)' },
        { label: 'Recurrent symptoms', next: 'Teach self-repositioning maneuvers; avoid chronic vestibular suppressants' },
      ] },
    ]),
  },

  // ===========================================================================
  // Module 5 — Pharmacology
  // (Serotonin Syndrome already exists under Module 13 — Psychiatry, so it is
  // deliberately not duplicated here; Salicylate Toxicity covers a comparable
  // toxidrome/overdose theme instead.)
  // ===========================================================================
  {
    module_number: 5,
    module_title: "Pharmacology",
    key_submodule: "Psychiatric Drug Emergencies",
    slug: "neuroleptic-malignant-syndrome",
    title: "Neuroleptic Malignant Syndrome",
    sort_order: 1,

    hook_vignette:
      "A 34-year-old man with schizophrenia is brought to the emergency department by his family 4 days after his antipsychotic medication was switched to a higher-potency agent and his dose was increased. He is diaphoretic, has a temperature of 40.1°C (104.2°F), and is minimally responsive. Exam reveals diffuse \"lead-pipe\" muscle rigidity, and his family notes he has been increasingly confused for the past day. Heart rate is 128/min and blood pressure is 162/98 mmHg.",

    ddx_mapping:
      "Neuroleptic malignant syndrome vs. serotonin syndrome vs. malignant hyperthermia vs. heat stroke vs. CNS infection:\n\nNMS — recent (days-to-weeks) start or dose increase of a dopamine antagonist (antipsychotic), or abrupt withdrawal of a dopamine agonist (e.g., levodopa); fever plus lead-pipe RIGIDITY plus autonomic instability plus altered mental status, with HYPOreflexia; onset over 1-3 days; markedly elevated CK from muscle breakdown; leukocytosis.\n\nSerotonin syndrome — recent addition of a serotonergic agent or combination (SSRI plus MAOI/tramadol/linezolid/triptan); onset within hours; HYPERreflexia and inducible or spontaneous CLONUS (especially in the lower extremities), tremor, diarrhea — reflexes are increased, not decreased.\n\nMalignant hyperthermia — onset during or shortly after general anesthesia with a volatile anesthetic or succinylcholine, not an outpatient psychiatric medication change; ryanodine receptor (RYR1) mutation; rigidity plus rapidly rising end-tidal CO2 and hyperkalemia.\n\nHeat stroke — history of environmental/exertional heat exposure rather than a psychotropic medication change; skin is classically hot and DRY (anhidrotic); no true diffuse muscular rigidity/hyporeflexia pattern.\n\nCNS infection (meningoencephalitis) — fever and altered mental status overlap, but nuchal rigidity (not diffuse limb rigidity), headache, and CSF pleocytosis point toward infection rather than a drug reaction, with no clear temporal link to an antipsychotic change.",

    diagnostic_evaluation:
      "Diagnosis is clinical, anchored to the temporal relationship with an antipsychotic (or dopamine agonist withdrawal) plus the core tetrad of fever, rigidity, autonomic instability, and altered mental status. Supporting labs: markedly elevated creatine kinase (often well above 1,000 U/L) from ongoing muscle breakdown, leukocytosis, and sometimes elevated liver transaminases. Renal function should be checked given the risk of rhabdomyolysis-induced acute kidney injury (myoglobinuric renal failure). Other causes of fever plus altered mental status (CNS infection, serotonin syndrome, malignant hyperthermia, thyrotoxicosis) should be excluded based on history, exposure timeline, and exam findings — lumbar puncture is reserved for genuine suspicion of infection, since NMS itself is a clinical diagnosis rather than one confirmed by a specific test.",

    management:
      "Immediately stop the offending antipsychotic (or resume the dopamine agonist if NMS was triggered by its withdrawal). Supportive care is central: aggressive IV fluid hydration to prevent myoglobinuric renal failure, active cooling for hyperthermia, and cardiorespiratory monitoring (ICU-level for severe cases). For moderate-to-severe disease, dantrolene (a direct skeletal muscle relaxant that blocks ryanodine receptor-mediated calcium release) reduces rigidity and hyperthermia, and bromocriptine or amantadine (dopamine agonists) counteract the central dopamine blockade driving the syndrome. Benzodiazepines help with agitation. If antipsychotic therapy must eventually be resumed, wait at least 2 weeks, use a lower-potency or atypical agent at the lowest effective dose, and monitor closely, since recurrence risk is significant.",

    first_order_prompt:
      "Match this finding to its diagnosis: Fever, lead-pipe rigidity, autonomic instability, and altered mental status with HYPOreflexia, beginning 1-3 days after starting a high-potency antipsychotic.",
    first_order_answer:
      "Neuroleptic malignant syndrome (NMS).",

    second_order_vignette:
      "A 41-year-old woman with bipolar disorder is started on haloperidol for acute agitation during a psychiatric hospitalization. Three days later, nursing staff note she is markedly diaphoretic, tachycardic, and difficult to arouse. Temperature is 39.8°C (103.6°F). Exam shows diffuse rigidity of all four extremities and depressed deep tendon reflexes. Laboratory studies show a creatine kinase of 12,400 U/L and a white blood cell count of 16,000/mm^3.",
    second_order_question:
      "Which of the following is the most appropriate next step in management?",
    second_order_choices: JSON.stringify([
      { label: "A", text: "Discontinue haloperidol and begin aggressive IV hydration with cardiorespiratory monitoring", correct: true,
        explanation: "Correct — the first and most essential steps are stopping the offending antipsychotic and starting supportive care (fluids to prevent myoglobinuric renal failure, monitoring), with dantrolene/bromocriptine reserved for more severe or refractory cases." },
      { label: "B", text: "Administer cyproheptadine and continue haloperidol at a reduced dose", correct: false,
        explanation: "Cyproheptadine treats serotonin syndrome, not NMS, and the offending antipsychotic must be stopped, not continued at a lower dose." },
      { label: "C", text: "Perform an emergent lumbar puncture before initiating any treatment", correct: false,
        explanation: "NMS is a clinical diagnosis; delaying supportive care and drug discontinuation to pursue an LP first is not appropriate given the classic, temporally-linked presentation." },
      { label: "D", text: "Start dantrolene alone while continuing haloperidol until the diagnosis is confirmed", correct: false,
        explanation: "The offending antipsychotic must be stopped regardless of whether dantrolene is also used; continuing it perpetuates the underlying cause." },
      { label: "E", text: "Administer succinylcholine to facilitate rapid intubation", correct: false,
        explanation: "Succinylcholine carries its own risk of triggering a malignant hyperthermia-like reaction and hyperkalemia, and is not an appropriate routine step here." },
    ]),
    second_order_answer: "A",
    second_order_explanation:
      "The most urgent priorities in NMS are removing the causative agent and starting supportive care (IV fluids to prevent myoglobinuric renal failure from rhabdomyolysis, cooling, and monitoring). Dantrolene and/or bromocriptine are added for moderate-to-severe or refractory cases, but discontinuing haloperidol and initiating supportive care cannot wait, and continuing the antipsychotic in any form (choices B and D) would perpetuate the syndrome.",

    flowchart_title: "Working Up Fever + Rigidity + Altered Mental Status",
    flowchart: JSON.stringify([
      { node: "Fever + altered mental status + muscle rigidity", branches: [
        { label: "Recent antipsychotic start/increase, HYPOreflexia", next: "Suspect neuroleptic malignant syndrome" },
        { label: "Recent serotonergic drug combination, HYPERreflexia/clonus", next: "Suspect serotonin syndrome" },
        { label: "Recent inhalational anesthetic/succinylcholine exposure", next: "Suspect malignant hyperthermia" },
        { label: "Environmental heat exposure, hot dry skin", next: "Suspect heat stroke" },
      ] },
      { node: "Suspected NMS — confirm and grade severity", branches: [
        { label: "CK markedly elevated, leukocytosis, lead-pipe rigidity", next: "Stop antipsychotic; IV fluids; active cooling" },
        { label: "Refractory rigidity or severe autonomic instability", next: "Add dantrolene and/or bromocriptine" },
      ] },
      { node: "Recovery and antipsychotic re-challenge", branches: [
        { label: "Symptoms resolved", next: "Wait at least 2 weeks before resuming an antipsychotic if needed" },
        { label: "Antipsychotic still required", next: "Use a lower-potency or atypical agent at the lowest effective dose, monitor closely" },
      ] },
    ]),
  },
  {
    module_number: 5,
    module_title: "Pharmacology",
    key_submodule: "Toxidromes",
    slug: "anticholinergic-toxicity",
    title: "Anticholinergic Toxicity",
    sort_order: 2,

    hook_vignette:
      "A 22-year-old man is brought to the emergency department by paramedics after being found agitated and disoriented in a park, picking at his clothing. He is flushed and febrile (38.7°C), with dry mucous membranes, dilated pupils that react sluggishly to light, and no bowel sounds on auscultation. He is unable to void and requires bladder catheterization. Friends report he had been chewing on the seeds of a wild plant.",

    ddx_mapping:
      "Anticholinergic toxicity vs. sympathomimetic toxicity vs. serotonin syndrome vs. NMS vs. heat stroke:\n\nAnticholinergic toxicity (e.g., diphenhydramine, tricyclic antidepressants, atropine, jimsonweed/Datura) — hyperthermia, mydriasis, DRY mucous membranes and skin, urinary retention, DECREASED bowel sounds, agitated delirium (\"dry as a bone, red as a beet, mad as a hatter, blind as a bat, full as a flask\").\n\nSympathomimetic toxicity (cocaine, amphetamines) — shares mydriasis, tachycardia, agitation, and hyperthermia, but skin is DIAPHORETIC and bowel sounds are hyperactive rather than decreased.\n\nSerotonin syndrome — agitation and hyperthermia overlap, but the hallmark findings are hyperreflexia and clonus, not urinary retention/decreased bowel sounds, and there is a recent serotonergic drug history.\n\nNeuroleptic malignant syndrome — fever and altered mental status overlap, but lead-pipe rigidity with hyporeflexia and a recent antipsychotic exposure (not an anticholinergic ingestion) are the key clues.\n\nHeat stroke — hot, dry skin overlaps, but no mydriasis/urinary retention/decreased-bowel-sounds pattern, and there is clear environmental/exertional heat exposure rather than an ingestion.",

    diagnostic_evaluation:
      "Diagnosis is primarily clinical, based on recognizing the toxidrome (mydriasis, dry/flushed skin, hyperthermia, urinary retention, decreased bowel sounds, agitated delirium) plus an exposure history (over-the-counter sleep aids/antihistamines, tricyclic antidepressants, motion-sickness patches, or plant ingestion such as jimsonweed/Datura). An ECG should be obtained to look for QRS/QTc prolongation, which suggests concomitant tricyclic antidepressant or other sodium/potassium-channel-blocking co-ingestion, since this changes management. Basic labs (electrolytes, creatine kinase, renal function) assess for rhabdomyolysis from agitation/hyperthermia and guide supportive care. Bladder scan or catheterization confirms urinary retention when present.",

    management:
      "Supportive care is the mainstay: IV fluids, benzodiazepines for agitation/seizures, and active cooling for hyperthermia. Physostigmine, a centrally acting acetylcholinesterase inhibitor, can reverse the syndrome and is considered for severe, refractory delirium/agitation, but only when the ECG shows no evidence of sodium-channel blockade (normal QRS), since physostigmine can precipitate seizures or asystole when a sodium-channel-blocking co-ingestant (e.g., a tricyclic) is also on board — in that setting IV sodium bicarbonate is used instead to narrow the QRS and stabilize cardiac conduction. Bladder catheterization treats urinary retention. Activated charcoal may be considered if the ingestion was recent and the airway is protected. Most cases resolve with supportive care alone as the causative agent is metabolized and cleared.",

    first_order_prompt:
      "Match this finding to its diagnosis: Hyperthermia, mydriasis, dry/flushed skin, urinary retention, decreased bowel sounds, and agitated delirium after an antihistamine overdose.",
    first_order_answer:
      "Anticholinergic toxicity.",

    second_order_vignette:
      "A 17-year-old girl is brought to the emergency department after ingesting an unknown quantity of diphenhydramine tablets in a suicide attempt. She is agitated, flushed, and has dry mucous membranes, dilated pupils, and absent bowel sounds. An ECG shows a QRS duration of 145 ms.",
    second_order_question:
      "Which of the following is the most appropriate next step in management?",
    second_order_choices: JSON.stringify([
      { label: "A", text: "IV sodium bicarbonate", correct: true,
        explanation: "Correct — the markedly widened QRS indicates sodium-channel blockade (diphenhydramine can produce this at high doses, similar to a tricyclic), and sodium bicarbonate narrows the QRS and stabilizes cardiac conduction; physostigmine would be relatively contraindicated here." },
      { label: "B", text: "Physostigmine", correct: false,
        explanation: "Physostigmine is relatively contraindicated when there is evidence of sodium-channel blockade (widened QRS), given the risk of asystole/refractory arrhythmia." },
      { label: "C", text: "Discharge home once she is medically cleared psychiatrically", correct: false,
        explanation: "She has active, significant cardiac conduction abnormality and requires further inpatient monitoring and treatment, not discharge." },
      { label: "D", text: "Naloxone", correct: false,
        explanation: "There are no signs of opioid toxicity (this patient has mydriasis and dry mucosa, not miosis/sedation), so naloxone would not be expected to help." },
      { label: "E", text: "Atropine", correct: false,
        explanation: "Atropine is itself an anticholinergic and would worsen this patient's anticholinergic toxicity." },
    ]),
    second_order_answer: "A",
    second_order_explanation:
      "A QRS duration of 145 ms indicates significant cardiac sodium-channel blockade, a recognized effect of diphenhydramine at high doses (similar to tricyclic antidepressants). IV sodium bicarbonate is the appropriate next step: it increases the extracellular sodium gradient and alkalinizes the serum, both of which improve sodium channel function and narrow the QRS, reducing the risk of ventricular arrhythmia. Physostigmine, while useful for anticholinergic delirium without cardiac conduction abnormality, is relatively contraindicated once significant QRS widening is present.",

    flowchart_title: "Approach to Suspected Anticholinergic Toxicity",
    flowchart: JSON.stringify([
      { node: "Agitated delirium + dry/flushed skin + mydriasis + urinary retention", branches: [
        { label: "Decreased bowel sounds, hot/dry skin", next: "Anticholinergic toxidrome" },
        { label: "Diaphoretic, hyperactive bowel sounds", next: "Reconsider sympathomimetic toxicity" },
      ] },
      { node: "Anticholinergic toxidrome confirmed — check ECG", branches: [
        { label: "QRS under 100 ms, no arrhythmia", next: "Supportive care; consider physostigmine if severe/refractory" },
        { label: "QRS 100 ms or greater (sodium-channel blockade)", next: "IV sodium bicarbonate; avoid physostigmine" },
      ] },
      { node: "Ongoing management", branches: [
        { label: "Severe agitation/hyperthermia", next: "Benzodiazepines, active cooling, IV fluids" },
        { label: "Urinary retention", next: "Bladder catheterization" },
      ] },
    ]),
  },
  {
    module_number: 5,
    module_title: "Pharmacology",
    key_submodule: "Cardiac Drug Toxicity",
    slug: "digoxin-toxicity",
    title: "Digoxin Toxicity",
    sort_order: 3,

    hook_vignette:
      "A 78-year-old woman with heart failure and atrial fibrillation on chronic digoxin therapy presents with nausea, vomiting, and fatigue for the past week. She reports seeing yellow-green halos around lights. Her family notes she was recently started on a new antibiotic for a urinary tract infection. ECG shows a new atrial tachycardia with variable AV block.",

    ddx_mapping:
      "Digoxin toxicity vs. other causes of nausea/visual disturbance/arrhythmia:\n\nDigoxin toxicity — GI symptoms (nausea, vomiting, anorexia), visual disturbances (yellow-green halos, blurred vision), and virtually any arrhythmia (classically atrial tachycardia with AV block, or an accelerated junctional rhythm); often precipitated by a new interacting drug (clarithromycin, verapamil, amiodarone, quinidine — all raise digoxin levels) or by renal impairment reducing its clearance, and potentiated by hypokalemia (increases digoxin binding to Na+/K+-ATPase) and hypomagnesemia.\n\nPrimary hyperkalemia (unrelated to digoxin) — can cause arrhythmia and GI symptoms, but lacks visual halos and typically shows peaked T waves rather than the classic \"scooped\" ST depression of digoxin effect; in acute digoxin toxicity, potassium is often elevated as a direct result of Na+/K+-ATPase inhibition, reflecting toxicity rather than a separate primary cause.\n\nOther drug-induced arrhythmia (e.g., a QT-prolonging drug) — can produce arrhythmia, but without the digoxin-specific visual disturbance and GI prodrome.\n\nAge-related renal decline alone — can raise digoxin levels over time even without a newly added interacting drug, so renal function should always be checked as a contributing cause.",

    diagnostic_evaluation:
      "Check a serum digoxin level (though levels correlate imperfectly with toxicity, especially with chronic use) along with serum potassium, magnesium, and renal function. ECG is essential: digoxin toxicity can produce virtually any arrhythmia, but atrial tachycardia with AV block and accelerated junctional rhythm are particularly characteristic; the diffuse \"scooped\" ST-segment depression (digoxin effect) is a normal finding at therapeutic levels and does not itself indicate toxicity. Review the medication list for a recently added interacting drug (clarithromycin, verapamil, amiodarone, quinidine — all raise digoxin levels via reduced clearance or altered distribution) and assess renal function, since digoxin is renally cleared and toxicity risk rises sharply with even modest kidney injury.",

    management:
      "Discontinue digoxin and correct contributing electrolyte abnormalities (potassium, magnesium), while avoiding overly aggressive potassium correction if hyperkalemia is already present from acute toxicity, since digoxin-toxic myocardium behaves unpredictably. For hemodynamically significant arrhythmias, symptomatic bradycardia/AV block, or markedly elevated potassium from acute toxicity, give digoxin-specific antibody fragments (digoxin immune Fab), which bind free digoxin and rapidly reverse toxicity. Calcium administration for digoxin-associated hyperkalemia is classically avoided (historical concern for worsening cardiac excitability), with digoxin immune Fab favored first in significant toxicity. Continuous cardiac monitoring is required until the arrhythmia resolves.",

    first_order_prompt:
      "Match this finding to its diagnosis: Nausea, yellow-green visual halos, and a new atrial tachycardia with AV block in a patient on chronic digoxin after starting a new antibiotic.",
    first_order_answer:
      "Digoxin toxicity (precipitated by a drug interaction with the newly added antibiotic).",

    second_order_vignette:
      "An 82-year-old man on digoxin for atrial fibrillation is started on clarithromycin for a respiratory infection. Five days later he develops nausea, confusion, and a regularized, slow ventricular rate on telemetry. Serum potassium is 6.1 mEq/L, and his digoxin level is markedly elevated.",
    second_order_question:
      "Which of the following is the most appropriate next step in management?",
    second_order_choices: JSON.stringify([
      { label: "A", text: "Digoxin-specific antibody fragments (digoxin immune Fab)", correct: true,
        explanation: "Correct — with a markedly elevated digoxin level, significant hyperkalemia, and an arrhythmia, digoxin immune Fab provides rapid, targeted reversal of toxicity." },
      { label: "B", text: "IV calcium gluconate as first-line therapy for the hyperkalemia", correct: false,
        explanation: "Calcium is classically avoided as first-line therapy for digoxin-toxicity-associated hyperkalemia because of concern for worsening cardiac excitability; digoxin immune Fab is preferred." },
      { label: "C", text: "Increase the digoxin dose to overcome the antibiotic interaction", correct: false,
        explanation: "This would worsen an already toxic, elevated digoxin level and is dangerous." },
      { label: "D", text: "Emergent hemodialysis to remove digoxin", correct: false,
        explanation: "Digoxin has a very large volume of distribution and is not effectively removed by hemodialysis; digoxin immune Fab is the appropriate targeted therapy." },
      { label: "E", text: "Administer atropine and observe", correct: false,
        explanation: "Atropine alone is insufficient for this degree of toxicity with significant hyperkalemia and a clinically significant arrhythmia." },
    ]),
    second_order_answer: "A",
    second_order_explanation:
      "This patient has clear digoxin toxicity (markedly elevated level, precipitated by clarithromycin's interaction with digoxin) with hyperkalemia and a significant arrhythmia — findings that warrant digoxin immune Fab, which binds and neutralizes free digoxin, rapidly reversing both the arrhythmia and the toxicity-driven hyperkalemia. Hemodialysis is not effective given digoxin's large volume of distribution, and increasing the dose or using atropine/calcium as sole measures does not address the underlying toxicity.",

    flowchart_title: "Suspected Digoxin Toxicity",
    flowchart: JSON.stringify([
      { node: "Nausea + visual disturbance + new arrhythmia in a patient on digoxin", branches: [
        { label: "Recent interacting drug (clarithromycin, verapamil, amiodarone) or renal decline", next: "Check digoxin level, potassium, and renal function" },
        { label: "No clear precipitant identified", next: "Still check digoxin level; consider chronic accumulation" },
      ] },
      { node: "Digoxin level elevated / ECG shows a toxicity-pattern arrhythmia", branches: [
        { label: "Stable rhythm, mild symptoms", next: "Stop digoxin; correct potassium/magnesium; monitor" },
        { label: "Life-threatening arrhythmia or markedly elevated potassium", next: "Give digoxin immune Fab" },
      ] },
      { node: "After stabilization", branches: [
        { label: "Ongoing AF/heart failure management needed", next: "Resume rate/rhythm control with a non-digoxin agent" },
        { label: "Renal impairment identified", next: "Adjust future digoxin dosing or avoid it entirely" },
      ] },
    ]),
  },
  {
    module_number: 5,
    module_title: "Pharmacology",
    key_submodule: "Toxicology and Overdose Management",
    slug: "acetaminophen-overdose",
    title: "Acetaminophen (Paracetamol) Overdose",
    sort_order: 4,

    hook_vignette:
      "A 19-year-old woman is brought to the emergency department 8 hours after intentionally ingesting approximately 40 tablets of acetaminophen (500 mg each) in a suicide attempt. She currently feels well other than mild nausea and vomiting. She has no prior liver disease.",

    ddx_mapping:
      "Acetaminophen toxicity vs. other causes of acute liver injury / toxic ingestion:\n\nAcetaminophen toxicity — classically an early asymptomatic or mild-nausea phase (first 24 hr), followed by rising transaminases and hepatic injury (24-72 hr), then either recovery or fulminant hepatic failure (72-96+ hr); history of a large single ingestion or supratherapeutic chronic use; diagnosis anchored to a timed serum acetaminophen level plotted on the Rumack-Matthew nomogram.\n\nSalicylate (aspirin) toxicity — can also cause nausea/vomiting after overdose, but classically produces tinnitus and a mixed respiratory alkalosis/anion gap metabolic acidosis, not the delayed hepatotoxic course of acetaminophen.\n\nViral hepatitis — elevated transaminases overlap, but has a more gradual onset over days-to-weeks with a prodrome (malaise, low-grade fever) and positive viral serologies, not a specific timed toxic ingestion.\n\nIschemic hepatitis (\"shock liver\") — very high transaminases can overlap acetaminophen toxicity, but occurs after a hypotensive/hypoxic episode, not an ingestion, and typically improves rapidly once perfusion is restored.\n\nOther hepatotoxic ingestions (e.g., Amanita phalloides mushrooms, isoniazid, valproate) — should be considered when the acetaminophen history is unclear or transaminases are disproportionate to the reported acetaminophen level.",

    diagnostic_evaluation:
      "Obtain a serum acetaminophen level at (or extrapolated to) 4 hours post-ingestion and plot it on the Rumack-Matthew nomogram to estimate hepatotoxicity risk and the need for treatment; levels drawn earlier than 4 hours may not reflect peak absorption and should be repeated. Check liver function tests (AST/ALT, bilirubin, INR) and renal function, since severe cases can also cause acute kidney injury. Serial monitoring of INR and transaminases over the following days tracks the degree of hepatic injury; a rising INR with encephalopathy signals impending fulminant hepatic failure and the need for transplant evaluation (e.g., via King's College criteria).",

    management:
      "N-acetylcysteine (NAC) is the antidote — it replenishes hepatic glutathione stores, which conjugate and detoxify NAPQI (N-acetyl-p-benzoquinone imine), the toxic CYP2E1-generated metabolite that accumulates once glutathione is depleted, especially after a large single overdose. NAC is most effective when started within 8-10 hours of ingestion but still provides benefit later, including in patients who already have fulminant hepatic failure. Activated charcoal can be given if the patient presents within about 1-2 hours of ingestion and can protect their airway. Patients with a level above the treatment line on the nomogram, an unknown ingestion time with a potentially toxic history, or evidence of hepatotoxicity should receive NAC; severe cases with progressive hepatic failure require transfer to a transplant center.",

    first_order_prompt:
      "Match this finding to its diagnosis: A patient 8 hours after a large single acetaminophen ingestion, currently asymptomatic other than mild nausea, with a plan to plot a 4-hour level on a treatment nomogram.",
    first_order_answer:
      "Acetaminophen overdose (early, pre-hepatotoxic phase).",

    second_order_vignette:
      "A 24-year-old man presents 30 hours after ingesting an unknown large quantity of acetaminophen tablets. He now has right upper quadrant pain, nausea, and jaundice. AST is 3,800 U/L, ALT is 4,100 U/L, and INR is 2.4.",
    second_order_question:
      "Which of the following is the most appropriate next step in management?",
    second_order_choices: JSON.stringify([
      { label: "A", text: "Begin N-acetylcysteine immediately regardless of a current acetaminophen level", correct: true,
        explanation: "Correct — with established hepatotoxicity this far out from ingestion, NAC should be started immediately; it still reduces morbidity and mortality even in established liver injury and should not be delayed to obtain a level, which may now be low or undetectable despite ongoing injury." },
      { label: "B", text: "Withhold NAC since more than 24 hours have passed and it is no longer effective", correct: false,
        explanation: "NAC still provides meaningful benefit well beyond 24 hours, including in patients with established hepatotoxicity or fulminant hepatic failure, so it should not be withheld." },
      { label: "C", text: "Activated charcoal alone", correct: false,
        explanation: "Activated charcoal is only useful very early after ingestion (roughly within 1-2 hours) and is not an appropriate sole therapy this far out with established liver injury." },
      { label: "D", text: "Immediate liver transplantation without a trial of medical therapy", correct: false,
        explanation: "Transplant evaluation is reserved for progressive fulminant hepatic failure meeting criteria (e.g., King's College criteria); NAC and supportive care should be tried first." },
      { label: "E", text: "Discharge with outpatient hepatology follow-up", correct: false,
        explanation: "This patient has active, significant hepatotoxicity (markedly elevated transaminases, elevated INR) and requires inpatient treatment and monitoring, not discharge." },
    ]),
    second_order_answer: "A",
    second_order_explanation:
      "Even though this patient presents well beyond the window where activated charcoal or nomogram-based risk stratification are most useful, N-acetylcysteine still meaningfully reduces morbidity and mortality once hepatotoxicity is established and should be started immediately rather than delayed. Serial monitoring of transaminases and INR guides ongoing care, and evaluation for transplantation is reserved for those who progress to fulminant hepatic failure.",

    flowchart_title: "Working Up Suspected Acetaminophen Overdose",
    flowchart: JSON.stringify([
      { node: "History or suspicion of acetaminophen ingestion", branches: [
        { label: "Under 24 hr since ingestion, level plottable on nomogram", next: "Obtain a 4-hour (or later) level and plot on the Rumack-Matthew nomogram" },
        { label: "Over 24 hr since ingestion or timing unknown, signs of liver injury", next: "Start NAC empirically without waiting on the nomogram" },
      ] },
      { node: "Nomogram / clinical assessment", branches: [
        { label: "Level above the treatment line", next: "Start N-acetylcysteine" },
        { label: "Level below the treatment line, asymptomatic", next: "Observe; NAC not needed" },
      ] },
      { node: "Monitor hepatic injury", branches: [
        { label: "Improving LFTs/INR", next: "Continue NAC to completion; supportive care" },
        { label: "Rising INR with encephalopathy (fulminant hepatic failure)", next: "Evaluate for liver transplantation (e.g., King's College criteria)" },
      ] },
    ]),
  },
  {
    module_number: 5,
    module_title: "Pharmacology",
    key_submodule: "Anticoagulant Pharmacology",
    slug: "anticoagulant-reversal-warfarin-heparin",
    title: "Anticoagulant-Associated Bleeding: Warfarin and Heparin Reversal",
    sort_order: 5,

    hook_vignette:
      "A 74-year-old man on chronic warfarin therapy for a mechanical aortic valve presents with a large, painful thigh hematoma after a fall. His INR is 9.2, and his hemoglobin has dropped from a baseline of 13.5 g/dL to 9.8 g/dL. He is hemodynamically stable but reports increasing pain and swelling.",

    ddx_mapping:
      "Choosing an anticoagulant reversal strategy depends on which agent is involved, the severity of bleeding, and urgency:\n\nWarfarin excess/bleeding — reversed with vitamin K (restores synthesis of factors II, VII, IX, X over hours-to-a-day) and, for serious bleeding or an urgent procedure, 4-factor prothrombin complex concentrate (PCC) for immediate factor replacement (faster acting and with a smaller volume load than fresh frozen plasma).\n\nUnfractionated heparin excess/bleeding — reversed with protamine sulfate, which directly binds and neutralizes heparin, with rapid effect.\n\nLow molecular weight heparin (e.g., enoxaparin) excess/bleeding — protamine only partially reverses LMWH's anti-Xa activity (it more completely reverses the anti-IIa component), so reversal is less complete than with unfractionated heparin.\n\nDirect oral anticoagulants (DOACs) — dabigatran is reversed with idarucizumab (a monoclonal antibody fragment); factor Xa inhibitors (apixaban, rivaroxaban) are reversed with andexanet alfa or, if unavailable, 4-factor PCC; identifying which specific DOAC a patient is on (and last dose timing) is essential since the antidotes are agent-specific and not interchangeable.\n\nMinor bleeding or asymptomatic supratherapeutic INR — often managed simply by holding the next dose(s) and monitoring, without reversal agents, since aggressive reversal itself carries thrombotic risk (especially with a mechanical valve or recent VTE).",

    diagnostic_evaluation:
      "Confirm the specific anticoagulant, last dose and timing, and the indication for anticoagulation (which affects how aggressively to reverse, given competing thrombotic risk). Check INR (warfarin), aPTT or anti-Xa level (unfractionated heparin), or a DOAC-specific/anti-Xa assay when available (many hospital labs cannot rapidly quantify DOAC levels, so clinical judgment based on last dose timing is often used instead). Assess the severity and location of bleeding (e.g., life-threatening intracranial or retroperitoneal hemorrhage vs. minor bruising) and hemodynamic stability, since these determine urgency of reversal. Obtain a complete blood count and type and screen if transfusion may be needed.",

    management:
      "For life-threatening or severe warfarin-associated bleeding: hold warfarin, give IV vitamin K, and administer 4-factor PCC (preferred over fresh frozen plasma for speed and lower volume) for immediate reversal, then repeat the INR to confirm correction. For minor bleeding or an asymptomatic elevated INR without bleeding, oral or no vitamin K and simply holding doses may suffice. For unfractionated heparin-associated bleeding, give protamine sulfate dosed to the estimated circulating heparin. For DOAC-associated life-threatening bleeding, give the agent-specific antidote (idarucizumab for dabigatran; andexanet alfa, or 4-factor PCC if unavailable, for factor Xa inhibitors) alongside general supportive measures (local hemostasis, transfusion as needed, holding future anticoagulant doses until safe to resume). In every case, weigh the competing risk of thrombosis (mechanical valve thrombosis, recurrent VTE/stroke) before over-aggressively reversing anticoagulation, and resume it as soon as it is safe to do so.",

    first_order_prompt:
      "Match this finding to its treatment: Life-threatening bleeding with an INR of 9.2 in a patient on warfarin.",
    first_order_answer:
      "IV vitamin K plus 4-factor prothrombin complex concentrate (PCC).",

    second_order_vignette:
      "A 68-year-old woman on dabigatran for atrial fibrillation presents after a motor vehicle collision with a large intracranial hemorrhage on CT. She last took her dose 4 hours ago.",
    second_order_question:
      "Which of the following is the most appropriate agent to reverse her anticoagulation?",
    second_order_choices: JSON.stringify([
      { label: "A", text: "Idarucizumab", correct: true,
        explanation: "Correct — idarucizumab is a monoclonal antibody fragment that specifically and rapidly binds and neutralizes dabigatran, making it the agent-specific reversal choice for this life-threatening bleed." },
      { label: "B", text: "Protamine sulfate", correct: false,
        explanation: "Protamine reverses heparin (unfractionated more completely than low molecular weight), not dabigatran, a direct thrombin inhibitor." },
      { label: "C", text: "Vitamin K", correct: false,
        explanation: "Vitamin K reverses warfarin by restoring vitamin K-dependent clotting factor synthesis; it has no effect on dabigatran." },
      { label: "D", text: "Andexanet alfa", correct: false,
        explanation: "Andexanet alfa reverses factor Xa inhibitors (apixaban, rivaroxaban), not the direct thrombin inhibitor dabigatran." },
      { label: "E", text: "Fresh frozen plasma alone", correct: false,
        explanation: "FFP is not a reliable, targeted reversal strategy for dabigatran and should not substitute for the specific antidote when it is available for this life-threatening bleed." },
    ]),
    second_order_answer: "A",
    second_order_explanation:
      "Dabigatran is a direct thrombin (factor IIa) inhibitor, and its specific reversal agent is idarucizumab, a monoclonal antibody fragment that binds dabigatran with high affinity and rapidly neutralizes its anticoagulant effect — the appropriate choice for this life-threatening intracranial hemorrhage. Protamine, vitamin K, and andexanet alfa are each specific to a different anticoagulant class and would not effectively reverse dabigatran.",

    flowchart_title: "Choosing an Anticoagulant Reversal Strategy",
    flowchart: JSON.stringify([
      { node: "Bleeding or supratherapeutic anticoagulation", branches: [
        { label: "On warfarin", next: "Check INR; assess bleeding severity" },
        { label: "On unfractionated or low molecular weight heparin", next: "Check aPTT/anti-Xa; assess bleeding severity" },
        { label: "On a DOAC (dabigatran, apixaban, rivaroxaban)", next: "Identify the specific agent and last dose timing" },
      ] },
      { node: "Severity assessment", branches: [
        { label: "Minor bleeding / asymptomatic", next: "Hold dose(s), monitor, minimal intervention" },
        { label: "Life-threatening bleeding or urgent procedure", next: "Proceed to agent-specific reversal" },
      ] },
      { node: "Agent-specific reversal", branches: [
        { label: "Warfarin", next: "Vitamin K plus 4-factor PCC" },
        { label: "Unfractionated heparin", next: "Protamine sulfate" },
        { label: "Dabigatran", next: "Idarucizumab" },
        { label: "Apixaban/rivaroxaban", next: "Andexanet alfa (or 4-factor PCC if unavailable)" },
      ] },
    ]),
  },
  {
    module_number: 5,
    module_title: "Pharmacology",
    key_submodule: "Toxicology and Overdose Management",
    slug: "salicylate-toxicity",
    title: "Salicylate (Aspirin) Toxicity",
    sort_order: 6,

    hook_vignette:
      "A 26-year-old woman presents to the emergency department with tinnitus, nausea, vomiting, and rapid breathing several hours after ingesting a large quantity of aspirin in a suicide attempt. She is tachypneic with a respiratory rate of 32/min. Arterial blood gas shows a pH of 7.48, PCO2 of 22 mmHg, and HCO3- of 16 mEq/L.",

    ddx_mapping:
      "Salicylate toxicity vs. other causes of a mixed acid-base disturbance / toxic ingestion:\n\nSalicylate toxicity — a classic MIXED acid-base disturbance: early respiratory alkalosis (direct stimulation of the medullary respiratory center causing hyperventilation) plus a concurrent anion gap metabolic acidosis (uncoupling of oxidative phosphorylation and accumulation of organic acids); tinnitus and hyperventilation are early clues, and severe toxicity progresses to cerebral edema and altered mental status.\n\nDiabetic ketoacidosis — anion gap metabolic acidosis overlaps, but has hyperglycemia and ketosis, lacks the early respiratory alkalosis/tinnitus of salicylate toxicity, and has a history of insulin non-adherence or new-onset diabetes rather than an ingestion.\n\nSepsis with lactic acidosis — anion gap acidosis overlaps, but has an infectious source and hemodynamic instability, not tinnitus or a specific overdose history.\n\nAcetaminophen overdose — can co-occur (combination products) but does not itself cause this mixed respiratory alkalosis/metabolic acidosis pattern or tinnitus; its toxicity is hepatic and appears hours-to-days later.\n\nMethanol/ethylene glycol toxicity — also cause an anion gap metabolic acidosis, but lack the early respiratory alkalosis phase and tinnitus, and instead feature visual disturbance (methanol) or oxalate crystalluria/renal injury (ethylene glycol) with an elevated osmolar gap.",

    diagnostic_evaluation:
      "Obtain a serum salicylate level (serial levels are warranted with chronic or sustained-release ingestion, since a single level can be misleading), an arterial or venous blood gas to characterize the mixed respiratory alkalosis/metabolic acidosis pattern, and a basic metabolic panel to calculate the anion gap. Check for coingestants, including an acetaminophen level, given frequent combination products. Monitor mental status closely, since worsening acidemia (as respiratory compensation fails, e.g., from fatigue or CNS depression by a coingestant) drives more salicylate into the brain (ion trapping) and precipitates neurologic deterioration and cerebral edema.",

    management:
      "Alkalinize the serum and urine with IV sodium bicarbonate — this promotes ionization of salicylate, trapping it in the plasma and enhancing renal elimination (urinary alkalinization), while also directly counteracting the metabolic acidosis and reducing salicylate entry into the CNS. Maintain adequate potassium replacement, since hypokalemia impairs the kidney's ability to alkalinize the urine (a hypokalemic kidney preferentially reabsorbs potassium over hydrogen ion, limiting urinary pH rise). Avoid interventions that worsen acidemia or blunt compensatory hyperventilation — if intubation is required, matching or exceeding the patient's spontaneous minute ventilation is critical, since inadequate ventilation after intubation can precipitate rapid, catastrophic acidemia. Hemodialysis is indicated for severe toxicity: markedly elevated levels, renal failure, refractory acidosis, pulmonary edema, or significant CNS effects (seizures, coma).",

    first_order_prompt:
      "Match this finding to its diagnosis: Tinnitus, hyperventilation, and a mixed respiratory alkalosis/anion gap metabolic acidosis after a large aspirin ingestion.",
    first_order_answer:
      "Salicylate (aspirin) toxicity.",

    second_order_vignette:
      "A 45-year-old man is brought to the emergency department after ingesting a large quantity of aspirin. He is confused and tachypneic. Arterial blood gas shows pH 7.18, PCO2 34 mmHg, HCO3- 12 mEq/L. Salicylate level is markedly elevated. He requires emergent intubation for airway protection.",
    second_order_question:
      "Which of the following is most important to ensure immediately after intubation in this patient?",
    second_order_choices: JSON.stringify([
      { label: "A", text: "Set the ventilator to match or exceed his pre-intubation minute ventilation", correct: true,
        explanation: "Correct — this patient depends on compensatory hyperventilation to limit acidemia and CNS salicylate entry; under-ventilating him after intubation can cause rapid, severe acidemia and clinical deterioration." },
      { label: "B", text: "Target a normal respiratory rate of 12-16/min regardless of his pre-intubation status", correct: false,
        explanation: "A 'normal' rate would represent significant under-ventilation relative to his compensatory baseline, worsening acidemia and driving more salicylate into the CNS." },
      { label: "C", text: "Withhold sodium bicarbonate until dialysis can be arranged", correct: false,
        explanation: "Sodium bicarbonate should be continued or started promptly for alkalinization; it should not be withheld pending dialysis, which is reserved for the most severe cases." },
      { label: "D", text: "Discontinue all IV fluids to avoid pulmonary edema", correct: false,
        explanation: "Adequate IV fluids are still needed; the correct approach is careful monitoring for pulmonary edema, not blanket discontinuation of fluids." },
      { label: "E", text: "Administer a nondepolarizing paralytic infusion as the first priority to prevent patient-ventilator dyssynchrony", correct: false,
        explanation: "Ensuring adequate minute ventilation matched to this patient's compensatory needs is the priority; paralysis is not the first, most important step." },
    ]),
    second_order_answer: "A",
    second_order_explanation:
      "Salicylate-poisoned patients rely on marked compensatory hyperventilation to limit acidemia and reduce CNS salicylate entry (ion trapping worsens as pH falls). Intubation and mechanical ventilation are dangerous in this setting if the ventilator is not set to match or exceed the patient's own high pre-intubation minute ventilation, since even brief under-ventilation can precipitate severe acidemia, increased CNS salicylate levels, and rapid deterioration.",

    flowchart_title: "Approach to Suspected Salicylate Toxicity",
    flowchart: JSON.stringify([
      { node: "Tinnitus + hyperventilation +/- altered mental status after an ingestion", branches: [
        { label: "ABG shows mixed respiratory alkalosis + anion gap metabolic acidosis", next: "Confirm with a serum salicylate level" },
        { label: "ABG shows a pure metabolic acidosis without respiratory alkalosis", next: "Reconsider another toxic ingestion (methanol, ethylene glycol)" },
      ] },
      { node: "Salicylate toxicity confirmed", branches: [
        { label: "Mild-moderate severity, normal mental status", next: "IV sodium bicarbonate (urinary alkalinization); serial levels" },
        { label: "Severe (renal failure, refractory acidosis, seizures, coma, pulmonary edema)", next: "Emergent hemodialysis" },
      ] },
      { node: "If intubation is required", branches: [
        { label: "Airway protection needed", next: "Match or exceed pre-intubation minute ventilation; avoid worsening acidemia" },
      ] },
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
