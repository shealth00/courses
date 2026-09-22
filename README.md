# USMLE Illustration Portfolio + QBank

A Node/Express app backed by Supabase: a course catalog of 2D diagrams and
interactive 3D anatomical models (Three.js), a timed, exam-feel QBank
modeled on UWorld's interface, an Anki-style flashcard deck with spaced
repetition, and a step-through pathway/pathogenesis visualizer.

## What's here

```
package.json         deps: express, @supabase/supabase-js (2.55.0), @supabase/storage-js
                      (2.78.0, pinned directly — see "Node version" note below), dotenv
server.js            static file server + /api/config (serves the public anon key)
db.js                server-side Supabase helpers (not required by the frontend,
                      but handy for future server-rendered routes)
.env.example          copy to .env locally; on Hostinger set these as app env vars
supabase/
  schema.sql          courses / modules / illustrations tables + RLS + storage bucket checklist
  schema_qbank.sql     qbank_blocks / questions / choices / attempts / attempt_answers + RLS
  schema_flashcards.sql  flashcards / flashcard_reviews (SM-2 spaced repetition) + RLS
  schema_pathways.sql    pathways / pathway_steps (step-through mechanism viewer) + RLS
  seed.js              populates the 11-module curriculum (83 plates), one sample QBank
                       block, and the sample "Atherosclerosis" pathway
public/
  index.html           shell page, import map for Three.js (loaded from jsDelivr CDN)
  styles.css            all styling — catalog, 3D viewer modal, exam interface, flashcards, pathway flow
  app.js                 router, catalog & module views, 3D viewer modal wiring
  supabaseClient.js      fetches /api/config, creates the browser Supabase client
  viewer3d.js             Three.js OrbitControls + GLTFLoader viewer; falls back to a
                          placeholder mesh when no .glb is uploaded yet
  qbank.js                block list, timed/tutor exam session, question navigator,
                          flagging, per-choice "why X is wrong" explanations, results screen
  flashcards.js           deck home, manual card creation, SM-2 study mode, short quiz mode
  pathway.js              step-through pathway/pathogenesis viewer (play or step manually)
  account.js              optional Supabase Auth UI (#/account): sign up, sign in, sign out
```

## 1. Set up Supabase

Your project: `https://txosnawkzmhkpzjzdgkn.supabase.co`

1. Open the SQL Editor in your Supabase dashboard and run, in order:
   - `supabase/schema.sql`
   - `supabase/schema_qbank.sql`
   - `supabase/schema_flashcards.sql`
   - `supabase/schema_pathways.sql`
2. Create two **public** storage buckets (Storage → New bucket):
   - `illustrations` — 2D plate images, 3D poster thumbnails, exam exhibit images
   - `models-3d` — `.glb` / `.gltf` model files
3. Get your keys from Project Settings → API:
   - **Project URL** and **anon public key** → these go in `.env` as `SUPABASE_URL` / `SUPABASE_ANON_KEY` (you already have these: see `.env.example`)
   - **service_role key** (secret) → only needed locally to run the seed script; set it in `.env` as `SUPABASE_SERVICE_KEY` and never commit it or put it in Hostinger's client-visible env

## 2. Seed sample content

```
npm install
cp .env.example .env
# edit .env: fill in SUPABASE_SERVICE_KEY from Project Settings > API
node supabase/seed.js
```

This creates the Step 1 / Step 2 CK courses, all 11 modules with their full
83-plate 2D + 3D catalog (mirroring the original portfolio deck), one sample
QBank block with a fully worked question (including per-choice "why each
answer is right/wrong" explanations), and one sample interactive pathway
("Atherosclerosis") so every feature is provable end to end.

The `storage_path` / `model_path` values seeded point at files that don't
exist yet (e.g. `cardiovascular/four-chamber-heart-exploded.glb`) — until you
upload matching files to the two buckets, image cards show a plain label and
the 3D viewer shows its placeholder model. Upload real files to those exact
paths and everything resolves automatically, no code changes needed.

## 3. Run locally

```
npm start
```

Visit `http://localhost:3000`.

## 4. Deploy on Hostinger

Per your Hostinger connect-database flow:

1. `package.json` pins `@supabase/supabase-js` to `2.55.0` and
   `@supabase/storage-js` to `2.78.0` as a **direct dependency** (not an
   `overrides` entry — Hostinger's build tooling choked on that field).
   Newer Supabase JS releases pull in a `storage-js` build that requires
   Node ≥20/22, which breaks on Hostinger's Node **18.x** app runtime at
   *import time*, not at build time — the install step succeeds and only
   the running app crashes. If you ever bump `@supabase/supabase-js`,
   re-check `@supabase/storage-js`'s resolved version and re-pin it if it's
   crept past Node 18 support (`npm view @supabase/storage-js@<version>
   engines`).
2. `db.js` already exists at the project root with the Supabase client setup.
3. Push this whole folder to the GitHub repo Hostinger is watching. Hostinger
   redeploys automatically and injects `SUPABASE_URL` / `SUPABASE_ANON_KEY` as
   environment variables once the app is linked to your Supabase project —
   `server.js` reads them at `process.env.SUPABASE_URL` /
   `process.env.SUPABASE_ANON_KEY`, matching what Hostinger sets.
4. Set `SUPABASE_SERVICE_KEY` only if you plan to run `supabase/seed.js` (or
   a future admin panel) on the server — it is never read by the
   public-facing frontend.
5. Point `courses.shealthmedia.org` at this app in Hostinger's domain
   settings (per your existing `public_html/courses` setup).
6. **Before editing `package.json` by hand**, validate it:
   `python3 -m json.tool package.json > /dev/null && echo "valid"`. A single
   malformed edit here (a stray duplicate quote, a missing comma) makes
   Hostinger's build fail in a confusing way — its analyzer sometimes reports
   a syntactically-broken `package.json` as "missing or inaccessible" /
   `null` even though `npm install` runs fine against it, because install and
   its post-install "what's the start command" analysis are separate steps.
   If a deploy ever fails with that message and you've confirmed the file is
   valid JSON (checked into git, not just on disk locally), disconnecting
   and reconnecting the Git integration on the Node app's dashboard forces a
   fresh clone — but if the build log itself shows a *successful* install
   and the app still won't start, that's a different failure mode: check the
   deployment's build directory in Hostinger's file manager directly (the
   built app and its own `.metadata.json` are ground truth) before assuming
   the file is at fault again.

## Illustration design: the 11-module curriculum

The catalog is organized as two courses — **USMLE Step 1** and **USMLE Step 2
CK** — broken into 11 modules, seeded by `supabase/seed.js` and matching the
original Design-canvas portfolio this app replaced (83 plates total: 2D
diagram sets plus 3D illustration briefs per module):

- Cardiovascular (12 plates)
- Neuroscience (12 plates)
- Renal, Fluid & Acid-Base (6 plates)
- GI & Hepatobiliary (8 plates)
- Endocrine (6 plates)
- Musculoskeletal (6 plates)
- Pathology & Histology (8 plates, including dedicated histology recognition plates)
- Pharmacology Mechanisms (6 plates)
- Immunology (6 plates)
- Reproductive & Embryology (7 plates)
- Clinical & Surgical Correlation (Step 2 CK-specific, 6 plates)

Each module page (`#/module/:slug`) splits its plates into two grids:

- **2D diagram set** — labeled anatomical/pathology diagrams, rendered as
  plain image cards (`kind = '2d'`) once a real image is uploaded to the
  `illustrations` bucket; shows a plain-text label placeholder until then.
- **3D interactive models** — real WebGL models (`kind = '3d'`), opened in a
  modal via `viewer3d.js`. This is genuine Three.js, not a static image or a
  colored placeholder box: `OrbitControls` for drag-to-rotate/scroll-to-zoom
  with auto-rotate until the user interacts, and `GLTFLoader` for real
  `.glb` files uploaded to the `models-3d` bucket. Until a real model is
  uploaded, it falls back to a clearly-labeled placeholder mesh (layered
  sphere "lobes") so the full Storage → DB → viewer pipeline is provable
  end to end before any real assets exist.

Adding a new module means inserting a row into `modules` (with a
`course_id`, `slug`, `title`, `summary`, `accent_color`, `sort_order`) and
then `illustrations` rows under it — no frontend code changes required;
`app.js` renders whatever rows exist for a module.

## QBank: what's implemented vs. planned

The QBank models UWorld's exam interface. Current implementation:

**Implemented**
- Tutor mode (immediate answer reveal + explanation) and timed mode
  (deferred reveal, countdown timer from `time_limit_sec`)
- Question blocks (`qbank_blocks`), each with its own set of questions
- Flag for review (per-question flag toggle, tracked in
  `qbank_attempt_answers`)
- Answer tracking (selected choice, correct/incorrect, per-question)
- Full clinical-vignette question shape: stem, patient demographics,
  history/exam/labs baked into the stem text, the question itself, and 4–6
  answer choices (`qbank_choices`, exactly one `is_correct`)
- Explanation engine: correct answer, free-text explanation, a separate
  "Educational Objective" banner, and **per-choice "why X is wrong" /
  "why this is correct" breakdowns** (`qbank_choices.explanation`, rendered
  under each choice once revealed)
- "Create flashcard from this question" — one click in the tutor-mode
  explanation panel inserts a flashcard (stem + lead-in as front, correct
  answer + explanation + educational objective as back) into the flashcard
  deck below
- Question navigator: right-hand grid showing answered/unanswered/flagged
  state for every question in the block, click-to-jump
- Results screen: score, time used, and a per-`system_tag` breakdown
  (`qbank_questions.system_tag` groups questions by subject/system for this
  rollup)
- Anonymous attempts by default — the attempt id in the URL hash is the
  access token for that run; no login required to take a block
- **Highlighting** — select text in the question stem, click the popup to
  mark it (`<mark>`-style background); click a highlight to remove it.
  Session-only (in-memory, resets on reload) — purely a frontend feature,
  no schema change
- **Strike-through** — a "Strike" control on each answer choice visually
  eliminates it (UWorld's "eliminate this choice"), independent of actually
  selecting that choice; doesn't affect scoring. Session-only, same as
  highlighting
- **Lab values reference panel** — a "Lab values" button in the exam
  footer opens a static, filterable table of normal ranges (CBC, BMP,
  LFTs, ABG, coagulation, and a few more), independent of any one question
- Optional Supabase Auth (email + password, `#/account`) — signing in
  attaches new attempts to `qbank_attempts.user_id` instead of leaving it
  null; anonymous attempts keep working exactly as before for anyone who
  doesn't sign in

**Planned / not yet built** (the UWorld feature set to grow into)
- **Persisting highlighting/strike-through across reloads** — currently
  session-only (in-memory); would need a small per-question UI-state table
  (owner_id-scoped, same RLS pattern as `flashcards`) once worth the schema
  change, or auth-backed attempts if scoping to a logged-in account instead
- **Notes** — a personal free-text note attached to a question, scoped to
  the user, not the attempt
- **Unused-question tracking** — excluding previously-answered questions
  from a new custom block; needs a per-user "seen" set, which in turn
  needs authenticated (not anonymous) attempts
- **Custom test builder** — filter question pool by system/subject/
  difficulty before starting a block, rather than only pre-built
  `qbank_blocks`
- **Multi-block exam simulation** (7-8 blocks back-to-back with break
  timers, like the real Step exam) — deliberately not built yet: it's a
  frontend-only chaining of existing `qbank_blocks`/`qbank_attempts`, but
  only worth building once there are enough real blocks seeded to chain;
  right now there's exactly one sample block, so this would be UI with
  nothing to actually exercise
- **Performance analytics / progress dashboard** — cumulative accuracy,
  percentile, trend over time across all attempts, not just one block's
  results screen
- **Knowledge graph / adaptive review** — tagging each question with the
  underlying clinical concepts it tests (not just `system_tag`), so
  repeated misses on a concept (e.g. "obstructive jaundice") can surface a
  targeted mini-review instead of just re-showing the same question. This
  needs a concept-tag table, a many-to-many join to questions, and a query
  that finds a user's weakest concepts from their `qbank_attempt_answers`
  history — the biggest lift on this list.
- ~~Auth-backed attempts~~ — done: `#/account` (email + password via
  Supabase Auth) lets `startAttempt()` set `qbank_attempts.user_id` to
  `supabase.auth.getUser()`'s id when signed in. Password reset, OAuth, and
  email-verification UI are still out of scope.

## Flashcards: what's implemented vs. planned

`flashcards.js` + `schema_flashcards.sql`. Anonymous by default, same model
as QBank attempts, but persisted: a browser-generated `owner_id` (uuid) is
stored in `localStorage` (not the URL) so a deck survives across sessions on
the same browser. `getOwnerId()` now checks for a signed-in Supabase Auth
session first and uses the real `auth.uid()` as the owner id when there is
one, falling back to the localStorage uuid otherwise — so a deck follows a
login (`#/account`) once signed in, and keeps working exactly as before for
anyone who isn't.

**Implemented**
- Manual card creation (front/back/system tag) from the deck home
- "Create flashcard from this question" one-click capture from a missed or
  answered QBank question (see above)
- **Study mode**: due cards only, Again/Hard/Good/Easy rating, a simplified
  **SM-2 spaced-repetition schedule** (ease factor + growing interval,
  written to `flashcards.ease_factor` / `.interval_days` / `.repetitions` /
  `.due_at`; each rating also logged to `flashcard_reviews` for a future
  dashboard). This is the real SM-2 core algorithm at day-granularity — not
  the full Anki scheduler (which adds sub-day "learning steps" for lapsed
  cards and a fuzz factor), but genuinely spaces reviews out rather than
  just repeating a fixed interval.
- **Short quiz mode**: 5 random cards (due or not), simple right/wrong
  self-grading, results screen — deliberately does **not** touch the SRS
  schedule, so it's safe to use as a quick recall check without disrupting
  the study queue

**Planned / not yet built**
- ~~Auth-backed decks~~ — done, see above
- A dashboard surfacing `flashcard_reviews` history (retention rate over
  time, cards nearing a lapse, etc.)
- Full Anki-parity scheduling (sub-day learning steps, configurable fuzz,
  leech detection)

## Pathways: a step-through pathogenesis viewer

`pathway.js` + `schema_pathways.sql`. Not real video or 3D animation — that
needs an actual animation pipeline and authored assets, the same honest
caveat `viewer3d.js` already documents for 3D models. Instead, a pathway is
a genuinely ordered sequence of mechanism steps (`pathway_steps`, one row
per step) that can be **played** (auto-advances every ~1.8s) or **stepped**
manually by clicking any node in the flow. Each step can optionally carry a
`drug_intervention` note, so pharmacology can be shown acting directly on a
specific point in the mechanism rather than as a disconnected fact.

One real worked example is seeded: **Atherosclerosis**, 12 steps from
endothelial dysfunction through rupture and thrombosis, with statin and
antiplatelet/anticoagulant intervention notes at the two steps they
actually act on — directly paired with the "Atherosclerosis Progression" 2D
plate already in the Cardiovascular module.

Adding a new pathway means inserting a `pathways` row and its ordered
`pathway_steps` — no frontend changes required.

**Planned / not yet built**
- Real animated illustrations per step (the actual "3D video" version of
  this) — needs an art/animation pipeline, not just code
- Linking a pathway directly from its related QBank explanations ("why?"
  drill-down) and from the illustration catalog's plate cards
- A depth-tiered "30-second / 2-minute / deep dive" version of the same
  pathway, as originally scoped

## Notes on the 3D viewer

`viewer3d.js` uses real Three.js (loaded from jsDelivr's CDN via the import
map in `index.html`) with `OrbitControls` (drag to rotate, scroll to zoom,
auto-rotate until the user interacts) and `GLTFLoader` for real model files.
Nothing about it is a static image — it is a genuine WebGL 3D scene. Until
you upload real anatomical `.glb` files, it renders a clearly-labeled
placeholder mesh so the full pipeline (Storage → DB → viewer) is provable
before any real assets exist.

## Notes on the QBank exam interface

- **Tutor mode**: answering a question immediately reveals the correct
  answer, explanation, and educational objective, and locks further choice
  changes on that question (matches UWorld's tutor mode).
- **Timed mode**: the timer counts down from the block's `time_limit_sec`;
  answers are recorded but explanations are not shown until the block ends.
- Both modes share: a right-hand question navigator grid (answered/flagged
  state), a flag toggle, previous/next navigation, and an "End block" action
  that scores the attempt and shows a results screen with a per-system
  breakdown.
- Attempts are anonymous by default (`user_id` is null) — the attempt id in
  the URL hash is the access token for that run. Signing in at `#/account`
  (Supabase Auth, email + password) ties new attempts to that account
  instead, so results can persist across devices; `qbank_attempts.user_id`
  already references `auth.users` and the RLS policy already accounts for
  both cases.

## 5. Adding real content

- **2D illustrations**: upload an image to the `illustrations` bucket, then
  insert or update a row in `illustrations` with `kind = '2d'` and
  `storage_path` set to that file's path within the bucket.
- **3D models**: export a `.glb` (glTF binary) from Blender/Cinema4D/whatever
  pipeline you use, upload it to the `models-3d` bucket, and set
  `model_path` on an `illustrations` row with `kind = '3d'`. Optionally also
  set `storage_path` to a poster/thumbnail image in the `illustrations`
  bucket for the card view before the viewer opens.
- **QBank questions**: insert rows into `qbank_blocks`, then
  `qbank_questions` (one per vignette) and `qbank_choices` (4–6 per
  question, exactly one `is_correct = true`, plus a per-choice
  `explanation` for the "why X is wrong" breakdown). `supabase/seed.js`
  shows the shape; a small admin form is a natural next step if you want to
  avoid hand-writing SQL/JS for every question.
- **Pathways**: insert a `pathways` row, then ordered `pathway_steps` rows
  (`position`, `label`, `description`, optional `drug_intervention`).
