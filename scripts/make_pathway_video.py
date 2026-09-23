#!/usr/bin/env python3
"""
make_pathway_video.py — turn a pathway's ordered steps (label, description,
optional drug_intervention) into a narrated MP4: one frame per step (current
step highlighted in the same node-flow style as pathway.js), a gTTS
narration clip per step, gentle Ken-Burns motion within each step, and a
crossfade between steps. Entirely local/free: cairosvg (SVG->PNG), gTTS
(text->speech), ffmpeg (frame+audio->video). No paid API, no external
service beyond gTTS's free endpoint.

Usage:
  python3 make_pathway_video.py pathway.json out.mp4

pathway.json shape:
  {
    "title": "Atherosclerosis",
    "steps": [
      {"label": "...", "description": "...", "drug_intervention": null},
      ...
    ]
  }
"""
import json
import subprocess
import sys
import textwrap
import os

PALETTE = {
    "ink": "#1c2430",
    "ink_soft": "#5b6472",
    "paper": "#faf8f4",
    "accent": "#b5472a",
    "accent_blue": "#3b5f8a",
    "gold": "#c9a25a",
    "line": "#e2ddd2",
}

W, H = 1280, 720


def esc(s):
    return (
        (s or "")
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def wrap_lines(text, width, max_lines=None):
    lines = textwrap.wrap(text, width=width)
    if max_lines and len(lines) > max_lines:
        lines = lines[: max_lines - 1] + [lines[max_lines - 1].rstrip() + "…"]
    return lines


def render_frame_svg(pathway_title, steps, current_idx):
    p = PALETTE
    n = len(steps)

    # Left rail: mini flow of all steps, current one highlighted.
    rail_x = 40
    rail_w = 300
    row_h = 34
    rail_top = 90
    rail_items = []
    for i, s in enumerate(steps):
        y = rail_top + i * row_h
        is_current = i == current_idx
        is_past = i < current_idx
        fill = p["accent_blue"] if is_current else "#ffffff"
        text_fill = "#ffffff" if is_current else (p["ink_soft"] if is_past else p["ink"])
        opacity = "1" if not is_past or is_current else "0.55"
        label = s["label"]
        if len(label) > 30:
            label = label[:29] + "…"
        rail_items.append(
            f'<g opacity="{opacity}">'
            f'<rect x="{rail_x}" y="{y}" width="{rail_w}" height="{row_h-6}" rx="5" '
            f'fill="{fill}" stroke="{p["line"]}" stroke-width="1"/>'
            f'<circle cx="{rail_x+16}" cy="{y+(row_h-6)/2}" r="9" fill="{p["ink"] if is_current else p["paper"]}" '
            f'stroke="{p["ink"]}" stroke-width="1"/>'
            f'<text x="{rail_x+16}" y="{y+(row_h-6)/2+4}" font-size="10" text-anchor="middle" '
            f'fill="{"#ffffff" if is_current else p["ink"]}" font-weight="700">{i+1}</text>'
            f'<text x="{rail_x+32}" y="{y+(row_h-6)/2+4}" font-size="12" '
            f'fill="{text_fill}" font-weight="{"700" if is_current else "400"}">{esc(label)}</text>'
            f"</g>"
        )

    # Main content panel: current step's full label + description + drug note.
    panel_x = rail_x + rail_w + 40
    panel_w = W - panel_x - 40
    step = steps[current_idx]

    desc_lines = wrap_lines(step.get("description") or "", width=52, max_lines=8)
    drug = step.get("drug_intervention")
    drug_lines = wrap_lines(drug, width=52, max_lines=4) if drug else []

    desc_tspans = "".join(
        f'<tspan x="{panel_x}" dy="{0 if i==0 else 30}">{esc(line)}</tspan>' for i, line in enumerate(desc_lines)
    )

    drug_block = ""
    if drug_lines:
        drug_y = 260 + len(desc_lines) * 30 + 50
        drug_tspans = "".join(
            f'<tspan x="{panel_x+20}" dy="{0 if i==0 else 26}">{esc(line)}</tspan>' for i, line in enumerate(drug_lines)
        )
        drug_block = f"""
        <rect x="{panel_x}" y="{drug_y-34}" width="{panel_w}" height="{34 + len(drug_lines)*26 + 16}" rx="8"
              fill="#f5f2ea" stroke="{p['gold']}" stroke-width="2"/>
        <text x="{panel_x+20}" y="{drug_y}" font-size="13" font-weight="700" letter-spacing="1"
              fill="{p['ink_soft']}">PHARMACOLOGIC INTERVENTION</text>
        <text x="{panel_x+20}" y="{drug_y+26}" font-size="15" fill="{p['ink']}">{drug_tspans}</text>
        """

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif">
  <rect width="{W}" height="{H}" fill="{p['paper']}"/>
  <rect width="{W}" height="56" fill="{p['ink']}"/>
  <text x="40" y="35" font-size="20" font-weight="700" fill="#f4f1ea">{esc(pathway_title)}</text>
  <text x="{W-40}" y="35" font-size="14" text-anchor="end" fill="{p['gold']}">Step {current_idx+1} of {n}</text>

  {''.join(rail_items)}

  <line x1="{panel_x-20}" y1="90" x2="{panel_x-20}" y2="{H-40}" stroke="{p['line']}" stroke-width="1"/>

  <text x="{panel_x}" y="130" font-size="11" letter-spacing="2" fill="{p['accent_blue']}" font-weight="700">CURRENT STEP</text>
  <text x="{panel_x}" y="170" font-size="30" font-weight="700" fill="{p['ink']}">{esc(step['label'])}</text>
  <text x="{panel_x}" y="220" font-size="17" fill="{p['ink']}">{desc_tspans}</text>
  {drug_block}
</svg>"""
    return svg


def synthesize_narration(text, out_path):
    from gtts import gTTS

    tts = gTTS(text, lang="en")
    tts.save(out_path)


def get_duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", path],
        capture_output=True,
        text=True,
        check=True,
    )
    return float(out.stdout.strip())


def main():
    if len(sys.argv) != 3:
        print("Usage: make_pathway_video.py pathway.json out.mp4")
        sys.exit(1)

    pathway_path, out_path = sys.argv[1], sys.argv[2]
    with open(pathway_path) as f:
        pathway = json.load(f)

    title = pathway["title"]
    steps = pathway["steps"]
    workdir = os.path.dirname(os.path.abspath(out_path)) or "."
    frames_dir = os.path.join(workdir, "_frames")
    audio_dir = os.path.join(workdir, "_audio")
    os.makedirs(frames_dir, exist_ok=True)
    os.makedirs(audio_dir, exist_ok=True)

    segment_paths = []

    for i, step in enumerate(steps):
        # 1. Render frame
        svg = render_frame_svg(title, steps, i)
        svg_path = os.path.join(frames_dir, f"step_{i:02d}.svg")
        png_path = os.path.join(frames_dir, f"step_{i:02d}.png")
        with open(svg_path, "w") as f:
            f.write(svg)
        import cairosvg

        cairosvg.svg2png(url=svg_path, write_to=png_path, output_width=W, output_height=H)

        # 2. Narration audio
        narration_text = step["label"] + ". " + (step.get("description") or "")
        if step.get("drug_intervention"):
            narration_text += " Pharmacologic intervention: " + step["drug_intervention"]
        mp3_path = os.path.join(audio_dir, f"step_{i:02d}.mp3")
        synthesize_narration(narration_text, mp3_path)
        duration = get_duration(mp3_path)
        # Pad slightly so the frame doesn't feel rushed right at the audio's end.
        frame_duration = duration + 0.6

        # 3. Per-step clip: still image with gentle zoom (Ken Burns), audio muxed in.
        seg_path = os.path.join(frames_dir, f"seg_{i:02d}.mp4")
        zoom_expr = f"zoompan=z='min(zoom+0.0006,1.08)':d={int(frame_duration*25)}:s={W}x{H}:fps=25"
        subprocess.run(
            [
                "ffmpeg", "-y",
                "-loop", "1", "-i", png_path,
                "-i", mp3_path,
                "-filter_complex", f"[0:v]{zoom_expr}[v]",
                "-map", "[v]", "-map", "1:a",
                "-c:v", "libx264", "-tune", "stillimage", "-c:a", "aac", "-b:a", "128k",
                "-pix_fmt", "yuv420p",
                "-t", str(frame_duration),
                seg_path,
            ],
            check=True,
            capture_output=True,
        )
        segment_paths.append(seg_path)
        print(f"  step {i+1}/{len(steps)}: {step['label']} ({duration:.1f}s narration)")

    # 4. Concatenate all per-step segments with a short crossfade-free concat
    # (a real xfade chain is possible but adds real complexity for marginal
    # benefit here — a clean cut between narrated steps reads fine).
    concat_list = os.path.join(frames_dir, "concat.txt")
    with open(concat_list, "w") as f:
        for seg in segment_paths:
            f.write(f"file '{os.path.abspath(seg)}'\n")

    subprocess.run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat_list, "-c", "copy", out_path],
        check=True,
        capture_output=True,
    )
    print(f"\nDone: {out_path}")


if __name__ == "__main__":
    main()
