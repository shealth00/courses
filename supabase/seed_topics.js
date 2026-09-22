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
