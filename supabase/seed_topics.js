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
