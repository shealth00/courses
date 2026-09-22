-- USMLE Illustration Portfolio — Pathophysiology extension
-- Run AFTER schema.sql. Symptom-first (not disease-first) reasoning: one row
-- per presenting complaint/finding (e.g. "Chest Pain", "Jaundice"), each with
-- a big-picture framing, the physical exam findings that narrow things down,
-- and a differential diagnosis where every candidate condition carries its
-- own underlying mechanism right alongside it — DDx and mechanism paired,
-- not two disconnected lists.
--
-- Distinct from clinical_topics (disease-first deep-dives) and flashcards
-- (compact recall cards) — this is the "here's a symptom, what could it be
-- and why" reference.

create extension if not exists "pgcrypto";

create table if not exists pathophysiology_topics (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  title          text not null,        -- "Chest Pain"
  system_tag     text,                 -- "Cardiovascular" — groups topics for browsing
  sort_order     int not null default 0,

  big_picture    text not null,        -- broad framing: why this symptom matters, how to think about it
  exam_findings  text not null,        -- key associated physical exam findings and what each one narrows toward

  -- Differential diagnosis, each entry pairing the condition with its own
  -- mechanism (and optionally its own distinguishing feature), shape:
  -- [{"condition": "...", "key_features": "...", "mechanism": "..."}, ...]
  ddx            jsonb not null default '[]'::jsonb,

  created_at     timestamptz not null default now()
);

create index if not exists idx_pathophysiology_topics_system on pathophysiology_topics(system_tag, sort_order);

alter table pathophysiology_topics enable row level security;

create policy "Public can read pathophysiology topics" on pathophysiology_topics for select using (true);
