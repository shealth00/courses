-- USMLE Illustration Portfolio — Clinical Topics extension
-- Run AFTER schema.sql. A "clinical pattern recognition" topic deep-dive:
-- richer than a single QBank question or a linear pathway, this models one
-- disease/topic as seven structured teaching sections (hook vignette, DDx
-- mapping, diagnostic evaluation, management, a first-order recall check, a
-- second-order clinical vignette, and a branching diagnostic flowchart).
--
-- Content shape is original to this project — inspired by real clinical
-- knowledge, not reproduced from any copyrighted textbook.

create extension if not exists "pgcrypto";

create table if not exists clinical_topics (
  id                    uuid primary key default gen_random_uuid(),
  module_number         int not null,        -- author's own numbering (gaps allowed, e.g. 1-4, 12-14)
  module_title          text not null,       -- "Biochemistry", "Immunology", ...
  key_submodule         text not null,       -- "Nutritional Deficiencies"
  slug                  text unique not null,
  title                 text not null,       -- "Vitamin B12 Deficiency"
  sort_order            int not null default 0,

  -- 1. Clinical Presentation (the hook)
  hook_vignette         text not null,

  -- 2. Differential Diagnosis mapping
  ddx_mapping           text not null,

  -- 3. Diagnostic Evaluation
  diagnostic_evaluation text not null,

  -- 4. Intervention & Management
  management            text not null,

  -- 5. First-order knowledge check (simple recall match)
  first_order_prompt    text not null,
  first_order_answer    text not null,

  -- 6. Second-order clinical vignette (full USMLE-style question)
  second_order_vignette text not null,
  second_order_question text not null,
  second_order_choices  jsonb not null default '[]'::jsonb,  -- [{label,text,correct,explanation}]
  second_order_answer   text not null,        -- correct choice label, denormalized for quick display
  second_order_explanation text not null,

  -- 7. Diagnostic flowchart — a simple branching tree:
  -- [{node:"...", branches:[{label:"...", next:"..."}]}, ...] rendered as an
  -- indented decision tree by topics.js; no schema-level graph structure
  -- needed for this depth.
  flowchart_title       text,
  flowchart             jsonb not null default '[]'::jsonb,

  created_at            timestamptz not null default now()
);

create index if not exists idx_clinical_topics_module on clinical_topics(module_number, sort_order);

alter table clinical_topics enable row level security;

create policy "Public can read clinical topics" on clinical_topics for select using (true);
