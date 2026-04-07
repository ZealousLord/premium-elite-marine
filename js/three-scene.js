/* ================================================================
   three-scene.js — Three.js Animated Water + Yacht Hero Scene
   ================================================================ */
(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  /* ── Scene Setup ──────────────────────────────────────────────── */
  const scene    = new THREE.Scene();
  const clock    = new THREE.Clock();
  let   scrollY  = 0;
  let   rafId;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000, 0);

  const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 500);
  camera.position.set(0, 6, 18);
  camera.lookAt(0, 0, 0);

  /* ── Lighting ─────────────────────────────────────────────────── */
  scene.add(new THREE.AmbientLight(0x0a2050, 0.8));

  const sun = new THREE.DirectionalLight(0xc2a27c, 2.2);
  sun.position.set(8, 12, 6);
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0x4090cc, 0.4);
  fill.position.set(-12, 8, -4);
  scene.add(fill);

  /* ── Animated Water Plane ─────────────────────────────────────── */
  const waterGeo = new THREE.PlaneGeometry(80, 80, 80, 80);
  waterGeo.rotateX(-Math.PI / 2);
  const basePositions = Float32Array.from(waterGeo.attributes.position.array);

  const waterMat = new THREE.MeshPhongMaterial({
    color: 0x0a2244,
    specular: 0x4488cc,
    shininess: 120,
    transparent: true,
    opacity: 0.82,
    side: THREE.DoubleSide,
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.position.y = -0.8;
  scene.add(water);

  function animateWater(t) {
    const pos = water.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = basePositions[i * 3];
      const z = basePositions[i * 3 + 2];
      pos.setY(i,
        Math.sin(x * 0.25 + t * 0.9) * 0.35 +
        Math.cos(z * 0.18 + t * 0.7) * 0.25 +
        Math.sin((x + z) * 0.12 + t * 0.5) * 0.15
      );
    }
    pos.needsUpdate = true;
    water.geometry.computeVertexNormals();
  }

  /* ── Yacht Model (geometry primitives) ───────────────────────── */
  const yacht = new THREE.Group();

  const white   = new THREE.MeshPhongMaterial({ color: 0xf0f0f0, shininess: 220 });
  const cream   = new THREE.MeshPhongMaterial({ color: 0xd4c0a0, shininess: 80  });
  const silver  = new THREE.MeshPhongMaterial({ color: 0xb0b8c8, shininess: 180 });
  const darkMat = new THREE.MeshPhongMaterial({ color: 0x1a2a3a, shininess: 60  });
  const glass   = new THREE.MeshPhongMaterial({ color: 0x88aacc, shininess: 300, transparent: true, opacity: 0.55 });

  /* Hull */
  const hullShape = new THREE.Shape();
  hullShape.moveTo(-4, 0);
  hullShape.lineTo(-3.6, -0.7);
  hullShape.lineTo(3.2, -0.7);
  hullShape.bezierCurveTo(4.5, -0.7, 5.2, 0, 5.2, 0);
  hullShape.lineTo(-4, 0);
  const hullGeo  = new THREE.ExtrudeGeometry(hullShape, { depth: 1.8, bevelEnabled: false });
  const hull     = new THREE.Mesh(hullGeo, white);
  hull.position.set(-4, 0, -0.9);
  yacht.add(hull);

  /* Main deck */
  const deck = new THREE.Mesh(new THREE.BoxGeometry(9, 0.15, 1.92), cream);
  deck.position.set(0.6, 0, 0);
  yacht.add(deck);

  /* Cabin */
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.4, 1.65), white);
  cabin.position.set(-0.2, 0.78, 0);
  yacht.add(cabin);

  /* Cabin windows */
  [-0.8, 0.2, 1.2].forEach(x => {
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.4, 0.05), glass);
    win.position.set(x, 0.88, 0.85);
    yacht.add(win);
  });

  /* Bridge */
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.6, 1.55), white);
  bridge.position.set(-0.2, 1.78, 0);
  yacht.add(bridge);

  /* Bridge windshield */
  const shield = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 0.05), glass);
  shield.position.set(-0.2, 1.72, 0.79);
  yacht.add(shield);

  /* Mast */
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 5.5, 8), silver);
  mast.position.set(0.8, 3.7, 0);
  yacht.add(mast);

  /* Radar arm */
  const radar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 6), silver);
  radar.rotation.z = Math.PI / 2;
  radar.position.set(0.8, 6.4, 0);
  yacht.add(radar);

  /* Stern deck */
  const stern = new THREE.Mesh(new THREE.BoxGeometry(2, 0.18, 1.88), cream);
  stern.position.set(2.6, 0, 0);
  yacht.add(stern);

  /* Bow accent stripe */
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.1, 0.12), darkMat);
  stripe.position.set(0.6, -0.02, 0.96);
  yacht.add(stripe);

  yacht.position.set(0, 1.2, 0);
  yacht.rotation.y = 0.28;
  scene.add(yacht);

  /* ── Particle Stars / Sea Spray ──────────────────────────────── */
  const partCount    = 600;
  const partPositions = new Float32Array(partCount * 3);
  for (let i = 0; i < partCount * 3; i += 3) {
    partPositions[i]     = (Math.random() - 0.5) * 70;
    partPositions[i + 1] = Math.random() * 15 - 2;
    partPositions[i + 2] = (Math.random() - 0.5) * 70;
  }
  const partGeo = new THREE.BufferGeometry();
  partGeo.setAttribute('position', new THREE.BufferAttribute(partPositions, 3));
  const partMat  = new THREE.PointsMaterial({ color: 0xc2a27c, size: 0.07, transparent: true, opacity: 0.55 });
  const particles = new THREE.Points(partGeo, partMat);
  scene.add(particles);

  /* ── Resize ───────────────────────────────────────────────────── */
  function onResize() {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }
  window.addEventListener('resize', onResize);

  /* ── Scroll Tracking ──────────────────────────────────────────── */
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  /* ── Render Loop ─────────────────────────────────────────────── */
  function animate() {
    rafId = requestAnimationFrame(animate);
    const t   = clock.getElapsedTime();
    const sp  = Math.min(scrollY / 800, 1); // 0→1 over 800px

    animateWater(t);

    /* Yacht: bob + gentle roll + scroll movement */
    yacht.position.y = 1.2 + Math.sin(t * 0.75) * 0.18;
    yacht.rotation.z = Math.sin(t * 0.55) * 0.018;
    yacht.position.x = sp * 6 - 1.5;
    yacht.rotation.y = 0.28 + sp * 0.6;

    /* Camera slight drift */
    camera.position.y = 6 - sp * 2.5;
    camera.position.x = Math.sin(t * 0.08) * 0.4;
    camera.lookAt(yacht.position.x, yacht.position.y - 1, 0);

    /* Particles slow rotation */
    particles.rotation.y = t * 0.015;

    renderer.render(scene, camera);
  }

  animate();

  /* ── Cleanup on page hide ─────────────────────────────────────── */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      clock.start();
      animate();
    }
  });

})();
