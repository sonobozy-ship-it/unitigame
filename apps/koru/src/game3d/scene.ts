// Three.js game scene HTML — inlined as a string for WebView
// Full 3D neon pipe puzzle with bloom glow effect

export const GAME_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#0A0A14; overflow:hidden; touch-action:none; }
  canvas { display:block; width:100vw; height:100vh; }
  #hud {
    position:fixed; top:12px; left:50%; transform:translateX(-50%);
    background:rgba(10,10,20,0.8); border:1px solid #3ECFB2;
    border-radius:20px; padding:6px 18px; color:#3ECFB2;
    font-family:system-ui,sans-serif; font-size:14px; font-weight:700;
    pointer-events:none; letter-spacing:1px;
  }
</style>
</head>
<body>
<div id="hud">0 moves · 0% filled</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
// ─── State ────────────────────────────────────────────────────────────────────
let level = null;
let pipes = {};      // color -> { cells:[[r,c],...], mesh: THREE.Group, completed: false }
let grid = [];       // grid[r][c] = color | null
let moves = 0;
let dragging = null; // color being drawn
let levelGroup;
let cellMeshes = []; // [r][c] -> mesh
const cellSize = 1.1;

// ─── Three.js Setup ───────────────────────────────────────────────────────────
const scene    = new THREE.Scene();
scene.background = new THREE.Color(0x0A0A14);
scene.fog = new THREE.FogExp2(0x0A0A14, 0.04);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference:'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 200);
camera.position.set(0, 10, 10);
camera.lookAt(0, 0, 0);

// Ambient + directional light
scene.add(new THREE.AmbientLight(0x111122, 2));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// ─── Color Palette ────────────────────────────────────────────────────────────
const COLORS = {
  red:    0xFF3B3B, blue:   0x3B8EFF, green:  0x2ECC71,
  yellow: 0xFFD600, orange: 0xFF8C00, purple: 0xA855F7,
  cyan:   0x00D4FF, pink:   0xFF69B4, lime:   0xA3E635,
  white:  0xF0F0F0, brown:  0xA0522D, teal:   0x14B8A6,
};

function getColor(name) {
  return new THREE.Color(COLORS[name] ?? 0xffffff);
}

// ─── Glow material ────────────────────────────────────────────────────────────
function glowMat(color) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 1.8,
    roughness: 0.1,
    metalness: 0.8,
  });
}

// ─── Build Level ──────────────────────────────────────────────────────────────
function buildLevel(lvl) {
  level = lvl;
  moves = 0;
  dragging = null;

  // Clear
  if (levelGroup) scene.remove(levelGroup);
  levelGroup = new THREE.Group();
  scene.add(levelGroup);
  pipes = {};
  cellMeshes = [];
  grid = Array.from({length: lvl.size}, () => Array(lvl.size).fill(null));

  const n = lvl.size;
  const offset = -(n - 1) * cellSize / 2;

  // Platform base
  const platGeo = new THREE.BoxGeometry(n * cellSize + 0.6, 0.18, n * cellSize + 0.6);
  const platMat = new THREE.MeshStandardMaterial({
    color: 0x13131F, emissive: 0x0a0a1a, emissiveIntensity: 0.5,
    roughness: 0.2, metalness: 0.9,
  });
  const platform = new THREE.Mesh(platGeo, platMat);
  platform.position.y = -0.15;
  levelGroup.add(platform);

  // Grid edge glow
  const edgeGeo = new THREE.BoxGeometry(n * cellSize + 0.7, 0.05, n * cellSize + 0.7);
  const edgeMat = new THREE.MeshStandardMaterial({ color: 0x3ECFB2, emissive: 0x3ECFB2, emissiveIntensity: 0.6 });
  const edge = new THREE.Mesh(edgeGeo, edgeMat);
  edge.position.y = -0.06;
  levelGroup.add(edge);

  // Cells
  for (let r = 0; r < n; r++) {
    cellMeshes[r] = [];
    for (let c = 0; c < n; c++) {
      const geo = new THREE.BoxGeometry(cellSize * 0.9, 0.12, cellSize * 0.9);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x16213e, emissive: 0x0a1020, emissiveIntensity: 0.3,
        roughness: 0.3, metalness: 0.7, transparent: true, opacity: 0.9,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(offset + c * cellSize, 0, offset + r * cellSize);
      mesh.userData = { r, c };
      levelGroup.add(mesh);
      cellMeshes[r][c] = mesh;
    }
  }

  // Grid lines
  const lineMat = new THREE.LineBasicMaterial({ color: 0x1a2040, transparent: true, opacity: 0.5 });
  for (let i = 0; i <= n; i++) {
    const x = offset - cellSize/2 + i * cellSize;
    const z0 = offset - cellSize/2;
    const z1 = offset - cellSize/2 + n * cellSize;
    const hGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, 0.07, z0), new THREE.Vector3(x, 0.07, z1)]);
    const vGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(z0, 0.07, x), new THREE.Vector3(z1, 0.07, x)]);
    levelGroup.add(new THREE.Line(hGeo, lineMat));
    levelGroup.add(new THREE.Line(vGeo, lineMat));
  }

  // Dots
  for (const dot of lvl.dots) {
    grid[dot.start[0]][dot.start[1]] = dot.color;
    grid[dot.end[0]][dot.end[1]] = dot.color;
    pipes[dot.color] = { cells: [dot.start], completed: false, tubeGroup: null };
    spawnDot(dot.start, dot.color, offset);
    spawnDot(dot.end, dot.color, offset);
  }

  // Camera fit
  const fitDist = n * cellSize * 1.1;
  camera.position.set(0, fitDist * 0.9, fitDist);
  camera.lookAt(0, 0, 0);

  updateHUD();
}

function spawnDot([r, c], color, offset) {
  const col = getColor(color);
  const geo = new THREE.SphereGeometry(0.28, 20, 20);
  const mat = glowMat(col);
  const mesh = new THREE.Mesh(geo, mat);
  const x = offset + c * cellSize;
  const z = offset + r * cellSize;
  mesh.position.set(x, 0.35, z);
  levelGroup.add(mesh);

  // Halo ring
  const ringGeo = new THREE.TorusGeometry(0.38, 0.04, 8, 32);
  const ringMesh = new THREE.Mesh(ringGeo, glowMat(col));
  ringMesh.position.copy(mesh.position);
  ringMesh.rotation.x = Math.PI / 2;
  levelGroup.add(ringMesh);

  // Point light
  const light = new THREE.PointLight(col, 2.5, 3);
  light.position.copy(mesh.position);
  levelGroup.add(light);
}

// ─── Pipe Tube Rendering ──────────────────────────────────────────────────────
function rebuildTube(color) {
  const pipe = pipes[color];
  if (!pipe) return;
  if (pipe.tubeGroup) levelGroup.remove(pipe.tubeGroup);
  if (pipe.cells.length < 2) { pipe.tubeGroup = null; return; }

  const n = level.size;
  const offset = -(n - 1) * cellSize / 2;
  const col = getColor(color);
  const group = new THREE.Group();

  const points = pipe.cells.map(([r, c]) =>
    new THREE.Vector3(offset + c * cellSize, 0.3, offset + r * cellSize)
  );

  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeo = new THREE.TubeGeometry(curve, pipe.cells.length * 8, 0.18, 8, false);
  const tubeMat = glowMat(col);
  const tube = new THREE.Mesh(tubeGeo, tubeMat);
  group.add(tube);

  // Glow halo (slightly bigger transparent tube)
  const haloGeo = new THREE.TubeGeometry(curve, pipe.cells.length * 8, 0.28, 8, false);
  const haloMat = new THREE.MeshStandardMaterial({
    color: col, emissive: col, emissiveIntensity: 0.6,
    transparent: true, opacity: 0.18,
  });
  group.add(new THREE.Mesh(haloGeo, haloMat));

  levelGroup.add(group);
  pipe.tubeGroup = group;
}

// Cell highlight
function setCellColor(r, c, colorName) {
  const mesh = cellMeshes[r]?.[c];
  if (!mesh) return;
  if (colorName) {
    const col = getColor(colorName);
    mesh.material.color.copy(col).multiplyScalar(0.18);
    mesh.material.emissive.copy(col).multiplyScalar(0.12);
  } else {
    mesh.material.color.set(0x16213e);
    mesh.material.emissive.set(0x0a1020);
  }
}

// ─── Touch / Raycast ─────────────────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const planeY    = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
let lastTouchCell = null;

function touchToCell(clientX, clientY) {
  if (!level) return null;
  const ndc = new THREE.Vector2(
    (clientX / window.innerWidth) * 2 - 1,
   -(clientY / window.innerHeight) * 2 + 1
  );
  raycaster.setFromCamera(ndc, camera);
  const pt = new THREE.Vector3();
  raycaster.ray.intersectPlane(planeY, pt);
  if (!pt) return null;
  const n = level.size;
  const offset = -(n - 1) * cellSize / 2;
  const col = Math.round((pt.x - offset) / cellSize);
  const row = Math.round((pt.z - offset) / cellSize);
  if (row < 0 || row >= n || col < 0 || col >= n) return null;
  return [row, col];
}

function isDotCell([r, c]) {
  if (!level) return null;
  for (const dot of level.dots) {
    if (dot.start[0]===r && dot.start[1]===c) return dot.color;
    if (dot.end[0]===r && dot.end[1]===c) return dot.color;
  }
  return null;
}

function isAdj([r1,c1],[r2,c2]) {
  return Math.abs(r1-r2)+Math.abs(c1-c2)===1;
}

function startDrag(cell) {
  const dotColor = isDotCell(cell);
  const cellColor = grid[cell[0]][cell[1]];
  const color = dotColor ?? cellColor;
  if (!color || !pipes[color]) return;

  dragging = color;
  const pipe = pipes[color];

  // Clear existing pipe (except dots)
  for (const [r,c] of pipe.cells) {
    if (!isDotCell([r,c])) { grid[r][c] = null; setCellColor(r,c,null); }
  }
  pipe.cells = [cell];
  pipe.completed = false;
  grid[cell[0]][cell[1]] = color;
  setCellColor(cell[0], cell[1], color);
  rebuildTube(color);
}

function continueDrag(cell) {
  if (!dragging) return;
  const pipe = pipes[dragging];
  const last = pipe.cells[pipe.cells.length - 1];
  if (last[0]===cell[0] && last[1]===cell[1]) return;
  if (!isAdj(last, cell)) return;

  // Backtrack
  if (pipe.cells.length >= 2) {
    const prev = pipe.cells[pipe.cells.length - 2];
    if (prev[0]===cell[0] && prev[1]===cell[1]) {
      const removed = pipe.cells.pop();
      if (!isDotCell(removed)) { grid[removed[0]][removed[1]]=null; setCellColor(removed[0],removed[1],null); }
      rebuildTube(dragging);
      updateHUD();
      return;
    }
  }

  const existing = grid[cell[0]][cell[1]];
  if (existing && existing !== dragging) return;
  if (pipe.cells.some(([r,c])=>r===cell[0]&&c===cell[1])) return;

  pipe.cells.push(cell);
  grid[cell[0]][cell[1]] = dragging;
  setCellColor(cell[0], cell[1], dragging);
  moves++;

  const dot = level.dots.find(d=>d.color===dragging);
  const isEnd = (dot.end[0]===cell[0]&&dot.end[1]===cell[1]) ||
                (dot.start[0]===cell[0]&&dot.start[1]===cell[1]&&pipe.cells.length>1);
  if (isEnd) {
    pipe.completed = true;
    dragging = null;
    winEffect(dragging);
  }

  rebuildTube(pipe.cells.length > 1 ? dragging ?? pipes[existing]?.color ?? Object.keys(pipes).find(k=>pipes[k].cells.includes(cell)) : dragging);
  updateHUD();
  checkWin();
}

function rebuildActiveTube() {
  if (dragging) rebuildTube(dragging);
}

// ─── Win ──────────────────────────────────────────────────────────────────────
function checkWin() {
  if (!level) return;
  const allCompleted = level.dots.every(d => pipes[d.color]?.completed);
  const totalCells = level.size * level.size;
  const filled = grid.flat().filter(Boolean).length;
  if (allCompleted && filled === totalCells) {
    setTimeout(() => triggerWin(), 200);
  }
}

function triggerWin() {
  // Pulse all tubes
  Object.values(pipes).forEach(p => {
    if (p.tubeGroup) {
      p.tubeGroup.traverse(m => {
        if (m.material) m.material.emissiveIntensity = 4;
      });
    }
  });
  postToRN({ type: 'WIN', moves });
}

function winEffect() {
  // Handled by triggerWin
}

// ─── HUD ──────────────────────────────────────────────────────────────────────
function updateHUD() {
  if (!level) return;
  const total = level.size * level.size;
  const filled = grid.flat().filter(Boolean).length;
  const pct = Math.round(filled/total*100);
  document.getElementById('hud').textContent = moves + ' moves · ' + pct + '% filled';
  postToRN({ type: 'PROGRESS', moves, fillPct: pct });
}

// ─── Camera Orbit ─────────────────────────────────────────────────────────────
let orbitStart = null;
let cameraTheta = 0.5;
let cameraPhi   = 0.7;
const cameraR   = () => (level ? level.size * cellSize * 1.6 : 16);

function updateCamera() {
  const r = cameraR();
  camera.position.set(
    r * Math.sin(cameraTheta) * Math.cos(cameraPhi),
    r * Math.sin(cameraPhi),
    r * Math.cos(cameraTheta) * Math.cos(cameraPhi)
  );
  camera.lookAt(0, 0, 0);
}

// ─── Touch Events ─────────────────────────────────────────────────────────────
let touchMode = null; // 'draw' | 'orbit'
let touchStart = null;
let touchStartCell = null;

document.addEventListener('touchstart', e => {
  const t = e.touches[0];
  touchStart = { x: t.clientX, y: t.clientY };
  const cell = touchToCell(t.clientX, t.clientY);
  touchStartCell = cell;

  if (cell) {
    const color = isDotCell(cell) ?? grid[cell[0]][cell[1]];
    if (color) {
      touchMode = 'draw';
      startDrag(cell);
      return;
    }
  }
  touchMode = 'orbit';
  orbitStart = { theta: cameraTheta, phi: cameraPhi, x: t.clientX, y: t.clientY };
}, { passive: true });

document.addEventListener('touchmove', e => {
  e.preventDefault();
  const t = e.touches[0];
  if (touchMode === 'draw') {
    const cell = touchToCell(t.clientX, t.clientY);
    if (cell && (!lastTouchCell || cell[0]!==lastTouchCell[0]||cell[1]!==lastTouchCell[1])) {
      lastTouchCell = cell;
      continueDrag(cell);
    }
  } else if (touchMode === 'orbit' && orbitStart) {
    const dx = (t.clientX - orbitStart.x) / window.innerWidth * 3;
    const dy = (t.clientY - orbitStart.y) / window.innerHeight * 2;
    cameraTheta = orbitStart.theta - dx;
    cameraPhi   = Math.max(0.2, Math.min(1.2, orbitStart.phi + dy));
    updateCamera();
  }
}, { passive: false });

document.addEventListener('touchend', () => {
  dragging = null;
  touchMode = null;
  lastTouchCell = null;
  touchStart = null;
}, { passive: true });

// ─── RN Bridge ────────────────────────────────────────────────────────────────
function postToRN(data) {
  try { window.ReactNativeWebView?.postMessage(JSON.stringify(data)); } catch(e){}
}

// Messages from React Native
window.addEventListener('message', e => {
  try {
    const msg = JSON.parse(e.data);
    if (msg.type === 'LOAD_LEVEL') buildLevel(msg.level);
    if (msg.type === 'RESET') buildLevel(level);
    if (msg.type === 'HINT_CLEAR') {
      // Clear incomplete pipes
      for (const [color, pipe] of Object.entries(pipes)) {
        if (!pipe.completed) {
          for (const [r,c] of pipe.cells) {
            if (!isDotCell([r,c])) { grid[r][c]=null; setCellColor(r,c,null); }
          }
          pipe.cells = [];
          if (pipe.tubeGroup) { levelGroup.remove(pipe.tubeGroup); pipe.tubeGroup=null; }
        }
      }
      // Re-seed pipes from dots
      if (level) for (const dot of level.dots) {
        if (!pipes[dot.color].completed) pipes[dot.color].cells = [dot.start];
      }
      updateHUD();
    }
  } catch(e) {}
});

// Also support document.addEventListener for Android WebView
document.addEventListener('message', e => {
  window.dispatchEvent(new MessageEvent('message', { data: e.data }));
});

// ─── Render Loop ──────────────────────────────────────────────────────────────
let t0 = 0;
function animate(ts) {
  requestAnimationFrame(animate);
  const dt = (ts - t0) / 1000;
  t0 = ts;

  // Pulsing glow on dots/tubes
  if (levelGroup) {
    levelGroup.traverse(obj => {
      if (obj.material?.emissive && obj.userData?.pulse) {
        obj.material.emissiveIntensity = 1.4 + 0.6 * Math.sin(ts * 0.003);
      }
    });
  }

  renderer.render(scene, camera);
}
animate(0);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
</script>
</body>
</html>`;
