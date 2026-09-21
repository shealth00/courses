// viewer3d.js — a real, reusable Three.js orbit viewer for anatomical models.
//
// Loads a .glb/.gltf from a URL when one exists. When no model_url is set
// yet (illustration rows seeded before real assets are uploaded), it falls
// back to a labeled placeholder mesh built from primitives, so the pipeline
// is fully wired end to end — swap in a real .glb later and it just works,
// no code changes needed.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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

  function frameObject(object) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3()).length() || 1;
    const center = box.getCenter(new THREE.Vector3());
    object.position.sub(center);
    const dist = size * 1.3;
    camera.position.set(dist * 0.7, dist * 0.5, dist * 0.9);
    camera.near = size / 100;
    camera.far = size * 100;
    camera.updateProjectionMatrix();
    controls.target.set(0, 0, 0);
    controls.update();
  }

  function buildPlaceholder() {
    // A labeled placeholder: layered lobes standing in for a chamber/organ
    // model, so the interactive-3D pipeline works before real .glb assets
    // are uploaded to the "models-3d" bucket.
    const colors = [0xb5472a, 0xd65a50, 0x3a5c9e, 0x6e96d2];
    const positions = [
      [0.55, -0.35, 0],
      [0.45, 0.45, -0.1],
      [-0.55, -0.3, 0.15],
      [-0.5, 0.4, 0.05],
    ];
    positions.forEach(([x, y, z], i) => {
      const geo = new THREE.SphereGeometry(0.55 - i * 0.03, 32, 24);
      const mat = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        roughness: 0.45,
        metalness: 0.05,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    });
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

  let raf;
  function animate() {
    raf = requestAnimationFrame(animate);
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
