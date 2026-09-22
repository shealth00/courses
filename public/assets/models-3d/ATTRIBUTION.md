# 3D Model Attribution

All models below were sourced under licenses that permit reuse (CC BY 4.0
in every case here) and are attributed per the license's requirements.
Each was downloaded as a `.stl` file and converted to `.glb` (glTF binary)
locally with [trimesh](https://trimesh.org/) (large meshes were also
decimated with `fast-simplification` to keep file size reasonable — no
geometry was invented, only the polygon count was reduced).

---

## cardiovascular/four-chamber-heart-exploded.glb

- **Plate**: Four-Chamber Heart, Exploded
- **Title**: "Realistic Human Heart" (re-hosted as "3D model of a human heart.stl")
- **Original author**: neshallads (Sketchfab)
- **Original source**: https://sketchfab.com/3d-models/realistic-human-heart-3f8072336ce94d18b3d0d055a1ece089
- **Downloaded via** (Sketchfab downloads require a logged-in account; this
  CC-BY model was re-hosted with attribution preserved on Wikimedia Commons):
  https://commons.wikimedia.org/wiki/File:3D_model_of_a_human_heart.stl
- **License**: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/
- **Note**: this is a realistic external/gross heart model, not a
  chamber-by-chamber exploded rig — used as the best available real,
  open-licensed stand-in for the "four-chamber heart" plate per the task's
  guidance that an honest real model beats a placeholder.

## neuroscience/spinal-cord-level-by-level.glb

- **Plate**: Spinal Cord, Level-by-Level
- **Title**: "Spinal cord and nerves.stl"
- **Author**: Athikhun.suw (Wikimedia Commons)
- **Source**: https://commons.wikimedia.org/wiki/File:Spinal_cord_and_nerves.stl
- **License**: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/

## neuroscience/whole-brain-transparency-model.glb

- **Plate**: Whole-Brain Transparency Model
- **Title**: "Brain AS.stl"
- **Author**: AgnieszkaStarostecka (Wikimedia Commons)
- **Source**: https://commons.wikimedia.org/wiki/File:Brain_AS.stl
- **License**: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/
- **Note**: original mesh was ~3.06M faces / 152MB; decimated to 80,000
  faces (~1.4MB as .glb) for web delivery. No geometry added, only polygon
  count reduced via quadric decimation.

## reproductive/female-pelvis-layer-peel-model.glb

- **Plate**: Female Pelvis, Layer-Peel Model
- **Title**: "3D model of human male and female pelvis.stl" ("HUMAN MALE AND
  FEMALE PELVIS")
- **Author**: ramon.gonzalez.cabrera (Wikimedia Commons); built from real CT
  scans of a healthy living male and female for a comparative-anatomy
  project
- **Source**: https://commons.wikimedia.org/wiki/File:3D_model_of_human_male_and_female_pelvis.stl
- **License**: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/
- **Note**: original mesh was ~994K faces / 49.7MB (paired male+female
  pelvis); decimated to 60,000 faces (~1.0MB as .glb). Model contains both
  pelves as sourced (comparative-anatomy pair); used for the "Female
  Pelvis" plate as the closest available real, open-licensed match — no
  layer-peel rig exists in the source geometry.

---

## Sources checked but not used

- **NIH 3D Print Exchange** (3d.nih.gov) — many strong anatomical matches
  exist here (e.g. a CC-BY "Detailed Human Brain Model", entry
  `3DPX-021161`, already in native `.glb`), but the site's file-download
  flow requires signing in to a free account before the "Download Files"
  button becomes active. Creating an account to get past that gate was out
  of scope (account creation is off-limits for this kind of automated
  task), so nothing was downloaded from NIH 3D directly.
- **Wikimedia Commons mirror of NIH 3D content (user Nevit Dilmen)** — a
  large, well-matched set of real CT/MRI-derived NIH 3D Print Exchange
  models is mirrored here under clear licensing (coronary CTA, white-matter
  tractography, CNS venography, abdominal CTA, urinary collecting system,
  large intestine, brain, etc. — excellent matches for several plates).
  Skipped because the license on all of them is **CC BY-SA 3.0**
  (ShareAlike), not plain CC0/PD/CC-BY as this task's license policy
  requires.
- **BodyParts3D / Life Sciences Integrated Database** (Japan) — the task
  brief listed this as a "CC-BY" source, but the database's own license
  page and its GitHub STL mirror both state the actual license is
  **CC BY-SA 2.1 Japan** (Attribution-ShareAlike), not plain CC-BY. Skipped
  for the same reason as above.
- **Sketchfab** direct downloads — Sketchfab requires a logged-in account
  to download any model regardless of its license (the site's search API
  is usable without auth to *identify* CC0/CC-BY models, but the file
  itself is gated). No downloads were made directly from Sketchfab;
  the one Sketchfab-sourced model used above (`four-chamber-heart-exploded.glb`)
  was obtained via a Wikimedia Commons re-hosting that preserved the
  original CC-BY attribution.
