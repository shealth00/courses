// viewer3d.js — a real, reusable Three.js orbit viewer for anatomical models.
//
// Loads a .glb/.gltf from a URL when one exists. When no model_url is set
// yet, it falls back to a procedural, animated placeholder scene chosen by
// slugifying the plate title — a distinct, moving stand-in per structure
// (branching vessels, layer-peel shells, joint flex, molecular assemblies,
// etc.) rather than one generic shape reused everywhere. Swap in a real
// .glb later and it just works, no code changes needed.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const PALETTE = {
  red: 0xb5472a,
  redLight: 0xd97a5f,
  blue: 0x3b5f8a,
  blueLight: 0x7ea3d1,
  gold: 0xc9a25a,
  green: 0x2f7d4f,
  bone: 0xe9dfc4,
  cream: 0xf4ecd8,
  ink: 0x1c2430,
};

function slugify(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ---------------------------------------------------------------------------
// geometry helpers
// ---------------------------------------------------------------------------
function stdMat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.5,
    metalness: opts.metalness ?? 0.05,
    transparent: opts.opacity !== undefined,
    opacity: opts.opacity ?? 1,
    side: opts.side ?? THREE.FrontSide,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 0,
  });
}
function meshOf(geo, color, opts) {
  const m = new THREE.Mesh(geo, stdMat(color, opts));
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}
function sphere(r, color, opts) {
  return meshOf(new THREE.SphereGeometry(r, 32, 24), color, opts);
}
function tubeFromPoints(points, radius, color, opts) {
  const curve = new THREE.CatmullRomCurve3(points);
  return meshOf(new THREE.TubeGeometry(curve, 48, radius, 8, false), color, opts);
}
function cylinder(r1, r2, h, color, opts) {
  return meshOf(new THREE.CylinderGeometry(r1, r2, h, 24), color, opts);
}
function torusKnotless(r, tube, color, opts) {
  return meshOf(new THREE.TorusGeometry(r, tube, 16, 48), color, opts);
}
function box(w, h, d, color, opts) {
  return meshOf(new THREE.BoxGeometry(w, h, d), color, opts);
}
function icoBlob(r, color, opts) {
  return meshOf(new THREE.IcosahedronGeometry(r, 1), color, opts);
}

// A branching tube tree: each level splits into `spread` children with
// shrinking radius, used for vascular casts and fiber bundles.
function buildBranch(group, origin, dir, len, radius, depth, color, opts, spread = 2) {
  const end = origin.clone().add(dir.clone().multiplyScalar(len));
  const mid = origin.clone().lerp(end, 0.5).add(
    new THREE.Vector3((Math.random() - 0.5) * len * 0.3, (Math.random() - 0.5) * len * 0.3, (Math.random() - 0.5) * len * 0.3)
  );
  const tube = tubeFromPoints([origin, mid, end], radius, color, opts);
  group.add(tube);
  if (depth <= 0) return;
  for (let i = 0; i < spread; i++) {
    const angle = (Math.PI / 3) * (i - (spread - 1) / 2) + (Math.random() - 0.5) * 0.4;
    const axis = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    const newDir = dir.clone().applyAxisAngle(axis, angle).normalize();
    buildBranch(group, end, newDir, len * 0.72, radius * 0.68, depth - 1, color, opts, spread);
  }
}

// ---------------------------------------------------------------------------
// archetype builders — each returns an optional update(t) animation hook
// ---------------------------------------------------------------------------

function layeredOrgan(group, shapes) {
  // shapes: [{ r, color, rest: [x,y,z], out: [x,y,z] }]
  const meshes = shapes.map((s) => {
    const m = sphere(s.r, s.color, { roughness: 0.45 });
    m.position.set(...s.rest);
    group.add(m);
    return { mesh: m, rest: new THREE.Vector3(...s.rest), out: new THREE.Vector3(...s.out) };
  });
  return (t) => {
    const k = (Math.sin(t * 0.6) + 1) / 2; // 0..1 breathing explode/collapse
    meshes.forEach(({ mesh, rest, out }) => {
      mesh.position.lerpVectors(rest, out, k * 0.6);
    });
  };
}

function vascularTree(group, { color = PALETTE.red, depth = 4, len = 0.9, radius = 0.09, spread = 2, trunkFrom = new THREE.Vector3(0, -0.9, 0) } = {}) {
  buildBranch(group, trunkFrom, new THREE.Vector3(0, 1, 0), len, radius, depth, color, { roughness: 0.4 }, spread);
  const pulse = sphere(0.07, PALETTE.gold, { emissive: PALETTE.gold, emissiveIntensity: 0.6 });
  group.add(pulse);
  return (t) => {
    const k = (t * 0.35) % 1;
    pulse.position.set(0, -0.9 + k * 1.8, 0);
    pulse.scale.setScalar(1 + 0.3 * Math.sin(t * 6));
  };
}

function fiberBundle(group, { color = PALETTE.blue, count = 5 } = {}) {
  for (let i = 0; i < count; i++) {
    const off = (i - (count - 1) / 2) * 0.18;
    const pts = [
      new THREE.Vector3(off, -0.9, off * 0.4),
      new THREE.Vector3(off * 1.4, 0, -off * 0.3),
      new THREE.Vector3(off, 0.9, off * 0.4),
    ];
    group.add(tubeFromPoints(pts, 0.06, i % 2 ? color : PALETTE.blueLight, { roughness: 0.4 }));
  }
  return (t) => { group.rotation.y = t * 0.15; };
}

function cutawayShell(group, { outerR = 0.9, outerColor = PALETTE.bone, opacity = 0.25, inner = [] } = {}) {
  const shell = sphere(outerR, outerColor, { opacity, roughness: 0.3, side: THREE.DoubleSide });
  group.add(shell);
  inner.forEach((s) => {
    const m = s.torus
      ? torusKnotless(s.r, s.r * 0.25, s.color, { roughness: 0.5 })
      : sphere(s.r, s.color, { roughness: 0.5 });
    m.position.set(...(s.pos || [0, 0, 0]));
    group.add(m);
  });
  const wedge = box(outerR * 1.4, outerR * 2.2, outerR * 1.4, 0x0a1420, { opacity: 0.94 });
  wedge.position.x = outerR * 0.9;
  group.add(wedge);
  return (t) => {
    group.rotation.y = t * 0.25;
  };
}

function segmentedColumn(group, { n = 8, color = PALETTE.cream, highlight = PALETTE.gold } = {}) {
  const segs = [];
  for (let i = 0; i < n; i++) {
    const y = (i - (n - 1) / 2) * 0.24;
    const seg = cylinder(0.28, 0.28, 0.2, color, { roughness: 0.5 });
    seg.position.y = y;
    group.add(seg);
    segs.push(seg);
  }
  return (t) => {
    const active = Math.floor((t * 1.2) % n);
    segs.forEach((seg, i) => {
      seg.material.emissive.set(i === active ? highlight : 0x000000);
      seg.material.emissiveIntensity = i === active ? 0.7 : 0;
    });
  };
}

function moleculeAssembly(group, { color = PALETTE.blue, arms = 2 } = {}) {
  const stem = cylinder(0.06, 0.06, 0.7, color, { roughness: 0.4 });
  stem.position.y = -0.35;
  group.add(stem);
  for (let i = 0; i < arms; i++) {
    const side = i === 0 ? -1 : 1;
    const arm = cylinder(0.06, 0.06, 0.6, i % 2 ? PALETTE.gold : color, { roughness: 0.4 });
    arm.position.set(side * 0.22, 0.3, 0);
    arm.rotation.z = side * 0.5;
    group.add(arm);
    const tip = sphere(0.12, PALETTE.redLight, { roughness: 0.4 });
    tip.position.set(side * 0.42, 0.55, 0);
    group.add(tip);
  }
  const base = sphere(0.12, PALETTE.redLight, { roughness: 0.4 });
  base.position.y = -0.7;
  group.add(base);
  return (t) => { group.rotation.y = t * 0.4; };
}

function membraneComplex(group) {
  const membrane = box(1.6, 0.06, 1.6, PALETTE.bone, { opacity: 0.5, roughness: 0.6 });
  group.add(membrane);
  const receptor = cylinder(0.08, 0.08, 0.55, PALETTE.blue, { roughness: 0.4 });
  group.add(receptor);
  const cascade = [];
  for (let i = 0; i < 4; i++) {
    const s = sphere(0.09 - i * 0.01, i === 0 ? PALETTE.gold : PALETTE.green, { roughness: 0.4 });
    s.position.set(0.3 + i * 0.28, -0.05, 0);
    group.add(s);
    cascade.push(s);
  }
  const signal = sphere(0.06, 0xffffff, { emissive: 0xffffff, emissiveIntensity: 0.9 });
  group.add(signal);
  return (t) => {
    const k = (t * 0.5) % 1;
    const idx = k * (cascade.length - 1);
    const i0 = Math.floor(idx);
    const i1 = Math.min(i0 + 1, cascade.length - 1);
    const frac = idx - i0;
    signal.position.lerpVectors(cascade[i0].position, cascade[i1].position, frac);
    signal.position.y += 0.15;
  };
}

function jointModel(group, { boneColor = PALETTE.bone, ligColor = PALETTE.red } = {}) {
  const upper = cylinder(0.14, 0.18, 0.9, boneColor, { roughness: 0.5 });
  upper.position.y = 0.55;
  group.add(upper);
  const lower = cylinder(0.16, 0.13, 0.9, boneColor, { roughness: 0.5 });
  lower.position.y = -0.55;
  group.add(lower);
  const capsule = sphere(0.22, PALETTE.blueLight, { opacity: 0.55, roughness: 0.4 });
  group.add(capsule);
  const ligs = [];
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const pts = [
      new THREE.Vector3(Math.cos(a) * 0.12, 0.3, Math.sin(a) * 0.12),
      new THREE.Vector3(Math.cos(a) * 0.2, 0, Math.sin(a) * 0.2),
      new THREE.Vector3(Math.cos(a) * 0.12, -0.3, Math.sin(a) * 0.12),
    ];
    const lig = tubeFromPoints(pts, 0.035, i % 2 ? ligColor : PALETTE.gold, { roughness: 0.4 });
    group.add(lig);
    ligs.push(lig);
  }
  lower.userData.pivot = new THREE.Vector3(0, -0.1, 0);
  return (t) => {
    const flex = Math.sin(t * 0.8) * 0.22;
    lower.rotation.z = flex;
    lower.position.set(Math.sin(flex) * 0.3, -0.55, 0);
  };
}

function torsoOrgans(group, organs) {
  const torso = sphere(1, PALETTE.bone, { opacity: 0.22, roughness: 0.3 });
  torso.scale.set(0.8, 1.15, 0.6);
  group.add(torso);
  organs.forEach((o) => {
    const m = sphere(o.r, o.color, { roughness: 0.5 });
    m.position.set(...o.pos);
    group.add(m);
  });
  return (t) => { group.rotation.y = t * 0.2; };
}

function cellCutaway(group, { organelles = 'standard', swelling = false } = {}) {
  const membrane = sphere(0.95, PALETTE.blueLight, { opacity: 0.28, roughness: 0.3 });
  group.add(membrane);
  const nucleus = sphere(0.32, PALETTE.blue, { roughness: 0.5 });
  nucleus.position.set(-0.15, 0.1, 0.1);
  group.add(nucleus);
  const mitos = [];
  const positions = [[0.4, 0.3, -0.1], [0.3, -0.35, 0.2], [-0.45, -0.25, -0.3]];
  positions.forEach((p) => {
    const mito = cylinder(0.11, 0.11, 0.32, PALETTE.red, { roughness: 0.5 });
    mito.position.set(...p);
    mito.rotation.z = Math.random() * Math.PI;
    group.add(mito);
    mitos.push(mito);
  });
  if (organelles === 'bacterial') {
    const wall = torusKnotless(0.9, 0.05, PALETTE.gold, { roughness: 0.5 });
    wall.rotation.x = Math.PI / 2;
    group.add(wall);
    for (let i = 0; i < 10; i++) {
      const rib = sphere(0.045, PALETTE.green, { roughness: 0.5 });
      rib.position.set((Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 0.6);
      group.add(rib);
    }
  }
  return (t) => {
    const k = swelling ? 1 + 0.18 * Math.max(0, Math.sin(t * 0.7)) : 1;
    mitos.forEach((m) => m.scale.setScalar(k));
    group.rotation.y = t * 0.18;
  };
}

function tissueInvasion(group) {
  const slab = box(1.6, 0.12, 1, PALETTE.bone, { roughness: 0.6 });
  slab.position.y = -0.1;
  group.add(slab);
  const membraneLine = box(1.6, 0.02, 1, PALETTE.ink, { roughness: 0.6 });
  membraneLine.position.y = -0.04;
  group.add(membraneLine);
  const cluster = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const c = sphere(0.09, PALETTE.red, { roughness: 0.5 });
    c.position.set((Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.3);
    cluster.add(c);
  }
  cluster.position.set(-0.5, 0.1, 0);
  group.add(cluster);
  return (t) => {
    const k = (Math.sin(t * 0.5) + 1) / 2;
    cluster.position.x = -0.5 + k * 1.0;
    cluster.position.y = 0.1 - k * 0.25;
  };
}

function probeTorso(group) {
  const torso = sphere(1, PALETTE.bone, { opacity: 0.25, roughness: 0.3 });
  torso.scale.set(0.75, 1.2, 0.55);
  group.add(torso);
  const windows = [
    [0.3, 0.4, 0.4],
    [-0.3, 0.4, 0.4],
    [0.3, -0.2, 0.4],
    [0, 0.55, 0.35],
  ].map((p) => {
    const w = box(0.18, 0.18, 0.04, PALETTE.gold, { emissive: PALETTE.gold, emissiveIntensity: 0 });
    w.position.set(...p);
    group.add(w);
    return w;
  });
  return (t) => {
    const active = Math.floor((t * 0.8) % windows.length);
    windows.forEach((w, i) => { w.material.emissiveIntensity = i === active ? 0.8 : 0.1; });
    group.rotation.y = Math.sin(t * 0.2) * 0.3;
  };
}

function foldingSheet(group, { color = PALETTE.bone } = {}) {
  const segments = 24;
  const width = 1.4;
  const geo = new THREE.PlaneGeometry(width, 0.9, segments, 1);
  const flatPos = geo.attributes.position.array.slice();
  const mesh = meshOf(geo, color, { roughness: 0.5, side: THREE.DoubleSide });
  group.add(mesh);
  return (t) => {
    const fold = (Math.sin(t * 0.5) + 1) / 2; // 0 = flat, 1 = rolled into a tube
    const pos = geo.attributes.position;
    const radius = width / (Math.PI * 2);
    for (let i = 0; i < pos.count; i++) {
      const x0 = flatPos[i * 3];
      const y0 = flatPos[i * 3 + 1];
      const angle = (x0 / width) * Math.PI * 2 * fold;
      const flatX = x0 * (1 - fold);
      const rolledX = Math.sin(angle) * radius * fold;
      const rolledZ = (Math.cos(angle) - 1) * radius * fold;
      pos.setXYZ(i, flatX + rolledX * 0 + (fold > 0 ? rolledX : 0), y0, rolledZ);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  };
}

// ---------------------------------------------------------------------------
// registry: slug (from slugified plate title) -> builder
// ---------------------------------------------------------------------------
const PROCEDURAL_BUILDERS = {
  'arterial-wall-layer-peel': (g) => cutawayShell(g, {
    outerR: 0.9, outerColor: PALETTE.redLight, opacity: 0.35,
    inner: [{ r: 0.65, color: PALETTE.gold }, { r: 0.4, color: PALETTE.bone }],
  }),
  'fetal-neonatal-circulation': (g) => vascularTree(g, { color: PALETTE.blue, depth: 3, spread: 2, len: 0.7 }),
  'adrenal-gland-layer-peel': (g) => cutawayShell(g, {
    outerR: 0.75, outerColor: PALETTE.gold, opacity: 0.4,
    inner: [{ r: 0.42, color: PALETTE.redLight }, { r: 0.22, color: PALETTE.blueLight }],
  }),
  'pituitary-gland-anterior-posterior': (g) => layeredOrgan(g, [
    { r: 0.32, color: PALETTE.red, rest: [-0.1, 0, 0], out: [-0.45, 0.1, 0] },
    { r: 0.28, color: PALETTE.blue, rest: [0.1, 0, 0], out: [0.45, -0.1, 0] },
  ]),
  'hepatic-lobule-3d-sinusoid-model': (g) => vascularTree(g, { color: PALETTE.red, depth: 2, spread: 3, len: 0.5, radius: 0.05, trunkFrom: new THREE.Vector3(0, 0, 0) }),
  'immunoglobulin-structure-3d': (g) => moleculeAssembly(g, { arms: 2 }),
  'lymph-node-zone-cutaway': (g) => cutawayShell(g, {
    outerR: 0.85, outerColor: PALETTE.cream, opacity: 0.4,
    inner: [{ r: 0.55, color: PALETTE.gold }, { r: 0.3, color: PALETTE.blueLight }],
  }),
  'knee-joint-ligament-layer': (g) => jointModel(g, { ligColor: PALETTE.red }),
  'shoulder-joint-rotator-cuff': (g) => jointModel(g, { ligColor: PALETTE.blue }),
  'cell-injury-organelle-level': (g) => cellCutaway(g, { swelling: true }),
  'tumor-invasion-metastasis': (g) => tissueInvasion(g),
  'bacterial-cell-layered-cutaway': (g) => cellCutaway(g, { organelles: 'bacterial' }),
  'gpcr-signal-transduction-3d': (g) => membraneComplex(g),
  'renal-vascular-architecture': (g) => vascularTree(g, { color: PALETTE.red, depth: 4, spread: 2, radius: 0.08 }),
  'embryonic-folding-animated-3d': (g) => foldingSheet(g),
  'regional-surgical-anatomy-3d': (g) => layeredOrgan(g, [
    { r: 0.5, color: PALETTE.bone, rest: [0, 0, 0.1], out: [0, 0, 0.7] },
    { r: 0.36, color: PALETTE.redLight, rest: [0, 0, -0.05], out: [0.1, 0.15, 0.1] },
    { r: 0.22, color: PALETTE.blue, rest: [0, 0, -0.15], out: [-0.15, -0.1, -0.2] },
  ]),
  'trauma-assessment-views': (g) => probeTorso(g),
  // covered by real .glb assets already, kept here only as a safety net if
  // one is ever removed:
  'white-matter-tract-bundles': (g) => fiberBundle(g, { color: PALETTE.blue }),
  'coronary-artery-distribution': (g) => vascularTree(g, { color: PALETTE.red, depth: 4, spread: 2 }),
  'cerebral-vasculature-cast': (g) => vascularTree(g, { color: PALETTE.red, depth: 4, spread: 3, len: 0.7 }),
  'spinal-cord-level-by-level': (g) => segmentedColumn(g, { n: 10 }),
  'whole-brain-transparency-model': (g) => cutawayShell(g, {
    outerR: 0.95, outerColor: PALETTE.cream, opacity: 0.22,
    inner: [{ r: 0.3, color: PALETTE.blueLight }, { r: 0.18, color: PALETTE.gold }],
  }),
  'abdominal-viscera-in-situ': (g) => torsoOrgans(g, [
    { r: 0.3, color: PALETTE.red, pos: [0.2, 0.2, 0.1] },
    { r: 0.24, color: PALETTE.gold, pos: [-0.25, 0, 0.15] },
    { r: 0.2, color: PALETTE.blue, pos: [0.1, -0.35, 0] },
  ]),
  'four-chamber-heart-exploded': (g) => layeredOrgan(g, [
    { r: 0.42, color: PALETTE.red, rest: [0.3, -0.2, 0], out: [0.6, -0.35, 0] },
    { r: 0.38, color: PALETTE.redLight, rest: [0.25, 0.25, -0.05], out: [0.5, 0.45, -0.1] },
    { r: 0.4, color: PALETTE.blue, rest: [-0.3, -0.18, 0.08], out: [-0.6, -0.3, 0.15] },
    { r: 0.36, color: PALETTE.blueLight, rest: [-0.28, 0.28, 0.03], out: [-0.5, 0.4, 0.05] },
  ]),
  'kidney-cutaway-model': (g) => cutawayShell(g, {
    outerR: 0.85, outerColor: PALETTE.redLight, opacity: 0.35,
    inner: [{ r: 0.55, color: PALETTE.gold }, { r: 0.28, color: PALETTE.bone }],
  }),
  'female-pelvis-layer-peel-model': (g) => torsoOrgans(g, [
    { r: 0.26, color: PALETTE.blueLight, pos: [0, 0.1, 0.1] },
    { r: 0.2, color: PALETTE.gold, pos: [0.2, -0.1, 0] },
    { r: 0.2, color: PALETTE.red, pos: [-0.2, -0.1, 0] },
  ]),
};

export function mountViewer(container, { modelUrl, title } = {}) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a1420);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(3, 2, 4);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 1.5;
  controls.maxDistance = 12;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.4;
  controls.addEventListener('start', () => { controls.autoRotate = false; });

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(4, 6, 5);
  key.castShadow = true;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x8fb3ff, 0.6);
  fill.position.set(-4, -2, -3);
  scene.add(fill);
  scene.add(new THREE.AmbientLight(0x404050, 0.9));

  const grid = new THREE.GridHelper(6, 12, 0x22344a, 0x16232f);
  grid.position.y = -1.2;
  scene.add(grid);

  const group = new THREE.Group();
  scene.add(group);

  let placeholderUpdate = null;

  function frameObject(object) {
    const box3 = new THREE.Box3().setFromObject(object);
    const size = box3.getSize(new THREE.Vector3()).length() || 1;
    const center = box3.getCenter(new THREE.Vector3());
    object.position.sub(center);
    const dist = size * 1.3;
    camera.position.set(dist * 0.7, dist * 0.5, dist * 0.9);
    camera.near = size / 100;
    camera.far = size * 100;
    camera.updateProjectionMatrix();
    controls.target.set(0, 0, 0);
    controls.update();
  }

  function buildGenericPlaceholder() {
    const colors = [0xb5472a, 0xd65a50, 0x3a5c9e, 0x6e96d2];
    const positions = [
      [0.55, -0.35, 0], [0.45, 0.45, -0.1], [-0.55, -0.3, 0.15], [-0.5, 0.4, 0.05],
    ];
    positions.forEach(([x, y, z], i) => {
      const m = sphere(0.55 - i * 0.03, colors[i % colors.length], { roughness: 0.45 });
      m.position.set(x, y, z);
      group.add(m);
    });
  }

  function buildPlaceholder() {
    // Procedural, animated stand-in chosen by plate title, so every model
    // that lacks a real .glb still gets a structurally distinct, moving
    // visualization instead of one generic shape reused everywhere.
    const slug = slugify(title);
    const builder = PROCEDURAL_BUILDERS[slug];
    if (builder) {
      placeholderUpdate = builder(group) || null;
    } else {
      buildGenericPlaceholder();
    }
    frameObject(group);
  }

  function loadModel(url) {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        gltf.scene.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        group.add(gltf.scene);
        frameObject(gltf.scene);
      },
      undefined,
      (err) => {
        console.warn(`Could not load model "${url}" — showing placeholder instead.`, err);
        buildPlaceholder();
      }
    );
  }

  if (modelUrl) {
    loadModel(modelUrl);
  } else {
    buildPlaceholder();
  }

  const clock = new THREE.Clock();
  let raf;
  function animate() {
    raf = requestAnimationFrame(animate);
    if (placeholderUpdate) placeholderUpdate(clock.getElapsedTime());
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(container);

  return {
    dispose() {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
