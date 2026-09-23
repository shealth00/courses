-- USMLE Illustration Portfolio — Pathway/pathogenesis extension
-- Run AFTER schema.sql. A step-through mechanism visualizer ("watch the
-- disease happen") — a genuine ordered-step flow a learner can play through
-- or step manually, with an optional drug-intervention note per step so
-- pharmacology can be shown acting directly on the mechanism.
--
-- Pathways can also carry a real narrated MP4 (video_path): one frame per
-- step rendered in this same visual style, gTTS narration per step, gentle
-- zoom motion, muxed with ffmpeg — see scripts/make_pathway_video.py. Not
-- every pathway has one; the manual step-through always works regardless.

create extension if not exists "pgcrypto";

create table if not exists pathways (
  id         uuid primary key default gen_random_uuid(),
  module_id  uuid references modules(id) on delete set null,
  slug       text unique not null,
  title      text not null,
  summary    text,
  sort_order int not null default 0,
  video_path text,  -- narrated MP4 (see scripts/make_pathway_video.py), null if not yet generated
  created_at timestamptz not null default now()
);

create table if not exists pathway_steps (
  id                 uuid primary key default gen_random_uuid(),
  pathway_id         uuid not null references pathways(id) on delete cascade,
  position           int not null,
  label              text not null,   -- short node label, e.g. "Endothelial dysfunction"
  description        text,            -- one- or two-sentence mechanism detail
  drug_intervention  text,            -- optional: a drug/class that acts at this step
  unique (pathway_id, position)
);

create index if not exists idx_pathway_steps_pathway on pathway_steps(pathway_id);

alter table pathways enable row level security;
alter table pathway_steps enable row level security;

-- Content tables: public read, same as illustrations/qbank content.
create policy "Public can read pathways" on pathways for select using (true);
create policy "Public can read pathway steps" on pathway_steps for select using (true);
