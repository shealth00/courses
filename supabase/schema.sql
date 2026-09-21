-- USMLE Illustration Portfolio — Supabase schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query) once.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Courses: top-level groupings (e.g. "USMLE Step 1", "USMLE Step 2 CK")
-- ---------------------------------------------------------------------------
create table if not exists courses (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  subtitle     text,
  step         text not null check (step in ('step1', 'step2ck')),
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Modules: subject areas within a course (Cardiovascular, Neuroscience, ...)
-- ---------------------------------------------------------------------------
create table if not exists modules (
  id           uuid primary key default gen_random_uuid(),
  course_id    uuid not null references courses(id) on delete cascade,
  slug         text unique not null,
  title        text not null,
  summary      text,
  accent_color text default '#3b5f8a',
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Illustrations: one row per plate, either a 2D diagram or a 3D model entry.
-- 2D rows use storage_path (image in the "illustrations" bucket).
-- 3D rows use model_path (a .glb/.gltf file in the "models-3d" bucket) and may
-- also carry a storage_path as a poster/thumbnail image.
-- ---------------------------------------------------------------------------
create table if not exists illustrations (
  id           uuid primary key default gen_random_uuid(),
  module_id    uuid not null references modules(id) on delete cascade,
  title        text not null,
  description  text,
  kind         text not null check (kind in ('2d', '3d')),
  storage_path text,   -- path within the "illustrations" bucket (2D image or 3D poster)
  model_path   text,   -- path within the "models-3d" bucket (.glb/.gltf), 3D rows only
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  constraint illustration_kind_paths check (
    (kind = '2d' and storage_path is not null) or
    (kind = '3d' and model_path is not null)
  )
);

create index if not exists idx_modules_course on modules(course_id);
create index if not exists idx_illustrations_module on illustrations(module_id);

-- ---------------------------------------------------------------------------
-- Row Level Security: this is a public course catalog — anonymous read access,
-- no writes from the client. All writes happen via the seed script or an
-- admin tool using the service role key, which bypasses RLS.
-- ---------------------------------------------------------------------------
alter table courses enable row level security;
alter table modules enable row level security;
alter table illustrations enable row level security;

create policy "Public can read courses" on courses
  for select using (true);

create policy "Public can read modules" on modules
  for select using (true);

create policy "Public can read illustrations" on illustrations
  for select using (true);

-- No insert/update/delete policies are created for the anon role, so the
-- public client can only ever read. Content changes go through the seed
-- script (supabase/seed.js) run with the service role key, or a future
-- authenticated admin panel.

-- ---------------------------------------------------------------------------
-- Storage buckets — create these from the Supabase dashboard
-- (Storage > New bucket) or via the Supabase CLI; SQL alone cannot create
-- buckets on all plans, so this is a checklist, not a runnable statement:
--   1. "illustrations"  — public bucket, for 2D plate images and 3D posters
--   2. "models-3d"       — public bucket, for .glb / .gltf model files
-- Mark both buckets "Public" so getPublicUrl() works without signed URLs.
-- ---------------------------------------------------------------------------
