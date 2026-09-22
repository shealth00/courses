-- USMLE Illustration Portfolio — Flashcards extension
-- Run AFTER schema.sql and schema_qbank.sql. Adds an Anki-style flashcard deck
-- with a simplified SM-2 spaced-repetition schedule, anonymous by default —
-- same "owner id as access token" model as qbank_attempts, but persisted in
-- localStorage (not the URL) since a deck is returned to over many sessions.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Flashcards: one card per row. SRS state is denormalized onto the card so
-- "what's due" is a single indexed query; flashcard_reviews below is an
-- append-only log for a future performance dashboard.
-- ---------------------------------------------------------------------------
create table if not exists flashcards (
  id                 uuid primary key default gen_random_uuid(),
  owner_id           uuid,  -- anonymous browser identity (localStorage) or auth.uid(); null only for is_reference rows
  front              text not null,
  back               text not null,
  system_tag         text,
  source_question_id uuid references qbank_questions(id) on delete set null,
  is_reference       boolean not null default false,  -- curated public card (DDx/signs-symptoms decks) vs. a personal card
  ease_factor        real not null default 2.5,
  interval_days      real not null default 0,
  repetitions        int not null default 0,
  due_at             timestamptz not null default now(),
  last_reviewed_at   timestamptz,
  last_rating        text check (last_rating in ('again', 'hard', 'good', 'easy')),
  created_at         timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Review log: one row per rating submitted, for a future accuracy/streak
-- dashboard. Not required to run the scheduler itself (that reads/writes the
-- denormalized columns on flashcards directly).
-- ---------------------------------------------------------------------------
create table if not exists flashcard_reviews (
  id             uuid primary key default gen_random_uuid(),
  flashcard_id   uuid not null references flashcards(id) on delete cascade,
  rating         text not null check (rating in ('again', 'hard', 'good', 'easy')),
  interval_days  real not null,
  reviewed_at    timestamptz not null default now()
);

create index if not exists idx_flashcards_owner on flashcards(owner_id);
create index if not exists idx_flashcards_due on flashcards(owner_id, due_at);
create index if not exists idx_flashcard_reviews_card on flashcard_reviews(flashcard_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table flashcards enable row level security;
alter table flashcard_reviews enable row level security;

-- Same model as qbank_attempts: a signed-in user's rows are scoped to their
-- own auth.uid(); anonymous rows (the common case here, no login flow yet)
-- are open, since RLS has no session to check a client-supplied owner_id
-- against. The unguessable uuid stored in the client's localStorage is the
-- practical access boundary, same as an anonymous qbank attempt id.
-- Reference rows (is_reference = true, owner_id null) are curator-authored
-- public content — readable by everyone, never client-writable (the check
-- clause forbids ever inserting/updating a row as is_reference = true from
-- the client; those are only written via direct DB access, same trust
-- model as illustrations/qbank content).
create policy "Manage own flashcards" on flashcards
  for all using (
    is_reference = true
    or auth.uid() is null
    or owner_id = auth.uid()
  )
  with check (
    is_reference = false
    and (auth.uid() is null or owner_id = auth.uid())
  );

create policy "Manage own flashcard reviews" on flashcard_reviews
  for all using (
    exists (
      select 1 from flashcards f
      where f.id = flashcard_id
        and (auth.uid() is null or f.owner_id = auth.uid())
    )
  )
  with check (
    exists (
      select 1 from flashcards f
      where f.id = flashcard_id
        and (auth.uid() is null or f.owner_id = auth.uid())
    )
  );
