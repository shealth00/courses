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
