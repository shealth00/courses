# USMLE Illustration Portfolio + QBank

A Node/Express app backed by Supabase: a course catalog of 2D diagrams and
interactive 3D anatomical models (Three.js), plus a timed, exam-feel QBank
modeled on UWorld's interface.

## What's here

```
package.json         deps: express, @supabase/supabase-js, dotenv
server.js            static file server + /api/config (serves the public anon key)
db.js                server-side Supabase helpers (not required by the frontend,
                      but handy for future server-rendered routes)
.env.example          copy to .env locally; on Hostinger set these as app env vars
supabase/
  schema.sql          courses / modules / illustrations tables + RLS + storage bucket checklist
  schema_qbank.sql     qbank_blocks / questions / choices / attempts / attempt_answers + RLS
  seed.js              populates the 11-module curriculum + one sample QBank block
public/
  index.html           shell page, import map for Three.js (loaded from jsDelivr CDN)
  styles.css            all styling — catalog, 3D viewer modal, exam interface
  app.js                 router, catalog & module views, 3D viewer modal wiring
  supabaseClient.js      fetches /api/config, creates the browser Supabase client
  viewer3d.js             Three.js OrbitControls + GLTFLoader viewer; falls back to a
                          placeholder mesh when no .glb is uploaded yet
  qbank.js                block list, timed/tutor exam session, question navigator,
                          flagging, explanations, results screen
```

## 1. Set up Supabase

Your project: `https://txosnawkzmhkpzjzdgkn.supabase.co`

1. Open the SQL Editor in your Supabase dashboard and run, in order:
   - `supabase/schema.sql`
   - `supabase/schema_qbank.sql`
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

This creates the Step 1 / Step 2 CK courses, all 11 modules, a handful of
sample illustration rows (2D + 3D), and one sample QBank block with one
worked question so you can see the exam interface end to end.

The `storage_path` / `model_path` values seeded point at files that don't
exist yet (e.g. `cardiovascular/heart-4chamber.glb`) — until you upload
matching files to the two buckets, image cards show a plain label and the 3D
viewer shows its placeholder model. Upload real files to those exact paths
and everything resolves automatically, no code changes needed.

## 3. Run locally

```
npm start
```

Visit `http://localhost:3000`.

## 4. Deploy on Hostinger

Per your Hostinger connect-database flow:

1. `package.json` already has `"@supabase/supabase-js": "^2.0.0"` in
   dependencies — nothing to add there.
2. `db.js` already exists at the project root with the Supabase client setup.
3. Push this whole folder to the GitHub repo Hostinger is watching. Hostinger
   redeploys automatically and injects `SUPABASE_URL` / `SUPABASE_ANON_KEY` as
   environment variables once the app is linked to your Supabase project —
   `server.js` reads them at `process.env.SUPABASE_URL` /
   `process.env.SUPABASE_ANON_KEY`, matching what Hostinger sets.
4. Set `SUPABASE_SERVICE_KEY` only if you plan to run `supabase/seed.js` (or a
   future admin panel) on the server — it is never read by the public-facing
   frontend.
5. Point `courses.shealthmedia.org` at this app in Hostinger's domain
   settings (per your existing `public_html/courses` setup).

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
  question, exactly one `is_correct = true`). `supabase/seed.js` shows the
  shape; a small admin form is a natural next step if you want to avoid
  hand-writing SQL/JS for every question.

## Notes on the 3D viewer

`viewer3d.js` uses real Three.js (loaded from jsDelivr's CDN via the import
map in `index.html`) with `OrbitControls` (drag to rotate, scroll to zoom,
auto-rotate until the user interacts) and `GLTFLoader` for real model files.
Nothing about it is a static image — it is a genuine WebGL 3D scene. Until
you upload real anatomical `.glb` files, it renders a clearly-labeled
placeholder mesh so the full pipeline (Storage → DB → viewer) is provable
before any real assets exist.

## Notes on the QBank

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
  the URL hash is the access token for that run. Wiring up Supabase Auth so
  attempts are tied to a logged-in account (and results persist across
  devices) is a natural next step; `qbank_attempts.user_id` already
  references `auth.users` and the RLS policy already accounts for it.
