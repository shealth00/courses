-- USMLE Illustration Portfolio — QBank extension
-- Run AFTER schema.sql. Adds a UWorld-style question bank: blocks, questions,
-- answer choices, explanations, and per-user attempt tracking with a timed,
-- flaggable exam interface in mind.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Question blocks: a set of questions taken together (e.g. "Cardiovascular
-- Block 1", 40 questions, timed). Mirrors how UWorld groups questions.
-- ---------------------------------------------------------------------------
create table if not exists qbank_blocks (
  id             uuid primary key default gen_random_uuid(),
  course_id      uuid references courses(id) on delete set null,
  module_id      uuid references modules(id) on delete set null,
  slug           text unique not null,
  title          text not null,
  description    text,
  question_count int not null default 0,       -- denormalized, kept in sync by trigger below
  time_limit_sec int not null default 3600,      -- default 60 min, tutor/timed modes both use this as the cap
  mode_default   text not null default 'tutor' check (mode_default in ('tutor', 'timed')),
  sort_order     int not null default 0,
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Questions: one clinical vignette + stem per row.
-- ---------------------------------------------------------------------------
create table if not exists qbank_questions (
  id                uuid primary key default gen_random_uuid(),
  block_id          uuid not null references qbank_blocks(id) on delete cascade,
  position          int not null,                -- 1-based order within the block
  stem              text not null,                -- the vignette + question text (markdown-ish plain text)
  lead_in           text,                          -- the final question sentence, shown bolded if present
  exhibit_image_path text,                         -- optional image in "illustrations" bucket (labs, ECG, imaging)
  system_tag        text,                          -- e.g. "Cardiovascular", used for performance breakdown
  difficulty        text default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  explanation       text not null,                 -- shown after answering
  educational_objective text,                      -- one-line "Educational Objective" banner, UWorld-style
  references         text,                          -- citation / further reading text
  created_at        timestamptz not null default now(),
  unique (block_id, position)
);

-- ---------------------------------------------------------------------------
-- Answer choices: 4-6 per question, exactly one correct.
-- ---------------------------------------------------------------------------
create table if not exists qbank_choices (
  id            uuid primary key default gen_random_uuid(),
  question_id   uuid not null references qbank_questions(id) on delete cascade,
  label         text not null,       -- "A", "B", "C", ...
  choice_text   text not null,
  is_correct    boolean not null default false,
  explanation   text,                -- optional per-choice "why wrong / why right" detail
  sort_order    int not null default 0,
  unique (question_id, label)
);

-- ---------------------------------------------------------------------------
-- Attempts: one row per user per block "run" (timed session).
-- ---------------------------------------------------------------------------
create table if not exists qbank_attempts (
  id            uuid primary key default gen_random_uuid(),
  block_id      uuid not null references qbank_blocks(id) on delete cascade,
  user_id       uuid references auth.users(id) on delete cascade,  -- null = anonymous practice
  mode          text not null default 'tutor' check (mode in ('tutor', 'timed')),
  started_at    timestamptz not null default now(),
  submitted_at  timestamptz,
  time_used_sec int,
  score_correct int,
  score_total   int
);

-- ---------------------------------------------------------------------------
-- Attempt answers: one row per question answered within an attempt.
-- ---------------------------------------------------------------------------
create table if not exists qbank_attempt_answers (
  id             uuid primary key default gen_random_uuid(),
  attempt_id     uuid not null references qbank_attempts(id) on delete cascade,
  question_id    uuid not null references qbank_questions(id) on delete cascade,
  choice_id      uuid references qbank_choices(id) on delete set null,
  flagged        boolean not null default false,
  time_spent_sec int,
  answered_at    timestamptz,
  unique (attempt_id, question_id)
);

create index if not exists idx_qbank_questions_block on qbank_questions(block_id);
create index if not exists idx_qbank_choices_question on qbank_choices(question_id);
create index if not exists idx_qbank_attempts_user on qbank_attempts(user_id);
create index if not exists idx_qbank_attempt_answers_attempt on qbank_attempt_answers(attempt_id);

-- ---------------------------------------------------------------------------
-- Keep qbank_blocks.question_count in sync.
-- ---------------------------------------------------------------------------
create or replace function qbank_sync_question_count() returns trigger as $$
begin
  update qbank_blocks
    set question_count = (select count(*) from qbank_questions where block_id = coalesce(new.block_id, old.block_id))
    where id = coalesce(new.block_id, old.block_id);
  return null;
end;
$$ language plpgsql;

drop trigger if exists trg_qbank_question_count on qbank_questions;
create trigger trg_qbank_question_count
  after insert or update or delete on qbank_questions
  for each row execute function qbank_sync_question_count();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table qbank_blocks enable row level security;
alter table qbank_questions enable row level security;
alter table qbank_choices enable row level security;
alter table qbank_attempts enable row level security;
alter table qbank_attempt_answers enable row level security;

-- Content tables: public read (question content itself is not secret; the
-- exam-feel UI still hides answers client-side until submission).
create policy "Public can read blocks" on qbank_blocks for select using (true);
create policy "Public can read questions" on qbank_questions for select using (true);
create policy "Public can read choices" on qbank_choices for select using (true);

-- Attempts: a signed-in user can only see and write their own attempts.
-- Anonymous (user_id is null) attempts are readable/writable by anyone with
-- the attempt id, since there is no session to scope them to — the frontend
-- keeps the attempt id in localStorage as the access token for that run.
create policy "Users manage own attempts" on qbank_attempts
  for all using (auth.uid() = user_id or user_id is null)
  with check (auth.uid() = user_id or user_id is null);

create policy "Users manage own attempt answers" on qbank_attempt_answers
  for all using (
    exists (
      select 1 from qbank_attempts a
      where a.id = attempt_id
        and (a.user_id = auth.uid() or a.user_id is null)
    )
  )
  with check (
    exists (
      select 1 from qbank_attempts a
      where a.id = attempt_id
        and (a.user_id = auth.uid() or a.user_id is null)
    )
  );
