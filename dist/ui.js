'use strict';

// -------------------------------------------------------------
// AquaSentinel Studio - User Interface & Routing Architecture
// Compact freshwater reservoir survey console
// -------------------------------------------------------------

const pages = [
  'Home',
  'Live Monitoring',
  'Map & Navigation',
  'Water Analysis',
  'Surface Analysis',
  'Sediment Analysis',
  'Fish & Ecosystem',
  'Reports',
  'Alerts',
  'Settings',
  'Digital Twin'
];

// Clean Outline SVG Icons (No Emojis)
const navIcons = [
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/></svg>',
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>',
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20"/><path d="M20 12v8H4v-8"/><path d="m4 8 16-4"/></svg>',
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20h20"/><path d="m5 20 7-14 7 14"/></svg>',
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6-3.56 0-7.56-2.54-8.5-6Z"/></svg>',
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21 16-9 5-9-5V8l9-5 9 5v8Z"/><path d="m3.27 6.96 8.73 4.88 8.73-4.88"/><path d="M12 21.84V11.84"/></svg>'
];

// Persistent Settings
const defaultSettings = {
  speed: 2,
  coordFormat: 'DD', // 'DD' | 'UTM' | 'DMS'
  thresholds: {
    sedimentMax: 1.40,
    turbidityMax: 20.0,
    phMin: 6.80,
    phMax: 8.50,
    condMax: 550
  }
};

let userSettings = { ...defaultSettings };
try {
  const saved = localStorage.getItem('aquasentinel_settings');
  if (saved) userSettings = JSON.parse(saved);
} catch (e) {
  console.warn('Could not load settings from localStorage:', e);
}

// Global simulation variables
let page = 0;
let scenario = 2; // Default to 'High sediment near intake' for demo story
let mode = 'Adaptive';
let noise = 0.18;
let running = false;
let s, baseline;
let core = null;
let approval = '';
let verifiedPoint = null;
let mapMode = '2D'; // '2D' | '3D'
let selectedStation = null;
let mapCenter = null;
let mapZoom = 1.0;

function resetSimulation() {
  running = false;
  s = createMission(mode, scenario, noise);
  baseline = createMission(mode === 'Adaptive' ? 'Fixed' : 'Adaptive', scenario, noise);
  core = null;
  approval = '';
  verifiedPoint = null;
  selectedStation = null;
  mapCenter = null;
}

resetSimulation();

const $ = id => document.getElementById(id);
const num = (v, n = 2) => Number(v).toFixed(n);

// Navigation routing
function go(i) {
  page = i;
  location.hash = String(i);
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function togglePlay() {
  running = !running;
  s.boat.speed = running ? 1.2 : 0.0;
  s.boat.state = running ? 'Surveying' : 'Paused';
  render();
}

function stepForward() {
  if (s.done) return;
  stepMission(s, userSettings.thresholds);
  stepMission(baseline, userSettings.thresholds);
  if (s.done) running = false;
  render();
}

function setScenario(scId) {
  scenario = Number(scId);
  resetSimulation();
  render();
}

// Background simulation ticker
setInterval(() => {
  let needsRender = false;

  // ROV Winch payout & recovery animation when holding station or paused
  if (s && s.rov && (s.rov.state === 'Deploying' || s.rov.state === 'Recovering')) {
    const targetDepth = (s.latest ? s.latest.seabedDepth : 3.5) + 0.3;
    if (s.rov.state === 'Deploying') {
      s.rov.depth = Math.min(targetDepth, Number((s.rov.depth + 0.35).toFixed(1)));
      s.rov.tetherLength = Number((s.rov.depth * 1.4).toFixed(1));
      if (s.rov.depth >= targetDepth - 0.05) {
        s.rov.state = 'Inspecting';
        s.events.unshift(`ROV reached target depth ${s.rov.depth}m. Commencing visual verification.`);
      }
    } else if (s.rov.state === 'Recovering') {
      s.rov.depth = Math.max(0, Number((s.rov.depth - 0.45).toFixed(1)));
      s.rov.tetherLength = Number((s.rov.depth * 1.4).toFixed(1));
      if (s.rov.depth <= 0.05) {
        s.rov.state = 'Docked';
        s.rov.depth = 0;
        s.rov.tetherLength = 0;
        s.events.unshift('ROV securely docked on ASV stern cradle.');
      }
    }
    needsRender = true;
  }

  if (running && !s.done) {
    const spd = userSettings.speed || 2;
    for (let i = 0; i < spd && !s.done; i++) {
      stepMission(s, userSettings.thresholds);
      stepMission(baseline, userSettings.thresholds);
    }
    if (s.done) running = false;
    needsRender = true;
  }

  if (needsRender) {
    render();
  } else {
    // Keep 3D scene smoothly animating water ripples & lighting
    const c = document.getElementById('map3d-canvas');
    if (c && typeof drawMissionScene === 'function') {
      drawMissionScene(c, s);
    }
  }
}, 450);

// Synchronized Local Header Clock
function updateHeaderClock() {
  const now = new Date();
  const timeEl = $('clock-time');
  const dateEl = $('clock-date');
  if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-GB');
  if (dateEl) {
    const opts = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-GB', opts);
  }
}
setInterval(updateHeaderClock, 1000);
updateHeaderClock();

// Live Bell Badge update
function updateBell() {
  const badge = $('bell-badge');
  if (badge) {
    const unread = s.alerts.filter(a => a.status === 'Active').length;
    badge.textContent = unread;
    badge.style.display = unread > 0 ? 'grid' : 'none';
  }
}

// -------------------------------------------------------------
// Sparkline SVG Generator (Uniform 24px Height)
// -------------------------------------------------------------
function sparklineSvg(data, strokeColor, fillColor) {
  if (!data || data.length < 2) {
    return '<div class="sparkline-empty">Awaiting samples</div>';
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 120, h = 24;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * w;
    const y = h - ((val - min) / range) * (h - 6) - 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const polylinePts = points.join(' ');
  const areaPts = `0,${h} ${polylinePts} ${w},${h}`;
  const gradId = `grad-${strokeColor.replace('#', '')}`;

  return `
    <svg class="metric-sparkline" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${fillColor}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="${fillColor}" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <polygon points="${areaPts}" fill="url(#${gradId})"/>
      <polyline points="${polylinePts}" fill="none" stroke="${strokeColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}

// -------------------------------------------------------------
// Interactive 2D Vector Reservoir Map (Amaravathi Inspired)
// -------------------------------------------------------------
function renderReservoirMap2D() {
  const c = 16;
  const px = p => 28 + c * p.x;
  const py = p => 210 - c * p.y;

  const routePts = s.path.map(p => `${px(p)},${py(p)}`).join(' ');
  const pos = s.pos;
  const intakeX = px({ x: 15 });
  const intakeY = py({ y: 4 });

  let svg = `
    <svg class="map-svg" viewBox="0 0 350 240" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="waterDeep" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#0284c7"/>
          <stop offset="70%" stop-color="#0369a1"/>
          <stop offset="100%" stop-color="#082f49"/>
        </radialGradient>
      </defs>

      <!-- Shoreline & Surrounding Land Terrain -->
      <rect width="350" height="240" fill="#0b243b"/>
      <!-- Realistic Organic Reservoir Boundary (Amaravathi contour) -->
      <path d="M 12 110 C 25 30, 95 15, 175 25 C 245 35, 335 55, 340 125 C 342 195, 275 228, 185 225 C 95 220, 10 185, 12 110 Z" fill="url(#waterDeep)" stroke="#0ea5e9" stroke-width="1.8"/>

      <!-- Bathymetric Depth Contours -->
      <path d="M 30 112 C 45 48, 100 38, 175 45 C 235 52, 315 75, 318 125 C 320 178, 260 205, 180 202 C 105 198, 32 170, 30 112 Z" fill="none" stroke="#38bdf8" stroke-width="0.7" stroke-dasharray="2 3" opacity="0.45"/>

      <!-- Grid Cells -->
  `;

  for (const cell of cells) {
    const q = s.samples.find(v => dist(v, cell) === 0);
    const xPos = px(cell);
    const yPos = py(cell);

    if (q) {
      let fill = '#16a34a'; // Green for normal thin sediment (<0.6m)
      if (q.value >= 0.6 && q.value < 1.4) fill = '#d97706'; // Amber for moderate
      if (q.value >= 1.4) fill = '#dc2626'; // Red for critical thick deposit (>1.4m)
      svg += `<rect x="${xPos - 6.5}" y="${yPos - 6.5}" width="13" height="13" rx="2" fill="${fill}" opacity="0.82" stroke="#ffffff" stroke-width="0.4" style="cursor:pointer;" onclick="inspectStation(${cell.x}, ${cell.y})"/>`;
    } else {
      svg += `<rect x="${xPos - 6}" y="${yPos - 6}" width="12" height="12" rx="1.5" fill="#0369a1" opacity="0.22" stroke="#0ea5e9" stroke-width="0.3"/>`;
    }
  }

  // Planned Survey Route (Dashed)
  const plannedPts = s.route.map(p => `${px(p)},${py(p)}`).join(' ');
  svg += `<polyline points="${plannedPts}" fill="none" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3 4" opacity="0.55"/>`;

  // Actual Travelled Track (Solid Cyan)
  svg += `<polyline points="${routePts}" fill="none" stroke="#38bdf8" stroke-width="2.0"/>`;

  // Intake Structure Marker
  svg += `
    <g transform="translate(${intakeX}, ${intakeY})">
      <rect x="-6" y="-6" width="12" height="12" fill="#d97706" stroke="#ffffff" stroke-width="1.2" rx="2"/>
      <text x="9" y="4" fill="#fef08a" font-size="8" font-weight="700">INTAKE</text>
    </g>
  `;

  // Surface Boat Marker (Yellow Catamaran)
  const boatX = px(pos);
  const boatY = py(pos);

  // Active Acoustic Sonar Swath Cone
  svg += `
    <g transform="translate(${boatX}, ${boatY}) rotate(${s.heading})">
      <path d="M 0 0 L -22 45 A 50 50 0 0 0 22 45 Z" fill="#38bdf8" opacity="0.28"/>
    </g>
  `;

  // Catamaran Hull shape
  svg += `
    <g transform="translate(${boatX}, ${boatY}) rotate(${s.heading})">
      <ellipse cx="0" cy="0" rx="6" ry="11" fill="#facc15" stroke="#0f172a" stroke-width="1.2"/>
      <path d="M 0 -8 L 3 4 L 0 2 L -3 4 Z" fill="#0f172a"/>
    </g>
  `;

  // Tethered Underwater ROV Marker (Green dot linked to boat via tether)
  if (s.rov.state !== 'Docked') {
    const rovX = boatX + 14;
    const rovY = boatY + 12;
    svg += `
      <line x1="${boatX}" y1="${boatY}" x2="${rovX}" y2="${rovY}" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="2 2"/>
      <circle cx="${rovX}" cy="${rovY}" r="5.5" fill="#16a34a" stroke="#ffffff" stroke-width="1.2"/>
      <text x="${rovX + 8}" y="${rovY + 3}" fill="#a7f3d0" font-size="7.5" font-weight="700">ROV (${s.rov.depth.toFixed(1)}m)</text>
    `;
  }

  // Active Alert Pulse Badges on Map
  for (const alert of s.alerts) {
    if (alert.status === 'Active') {
      const ax = px(alert.pos);
      const ay = py(alert.pos);
      svg += `
        <circle cx="${ax}" cy="${ay}" r="8" fill="none" stroke="#dc2626" stroke-width="1.8" opacity="0.8">
          <animate attributeName="r" values="6;13;6" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="${ax}" cy="${ay}" r="3.5" fill="#dc2626"/>
      `;
    }
  }

  // Map Coordinates & Scale
  svg += `
    <g fill="#e2e8f0" font-size="8" font-family="monospace">
      <text x="14" y="20" font-weight="700">AMARAVATHI SECTOR A (5m)</text>
      <text x="312" y="20" font-weight="700">↑ N</text>
      <text x="14" y="230">0</text>
      <line x1="24" y1="227" x2="74" y2="227" stroke="#ffffff" stroke-width="1.5"/>
      <text x="80" y="230">25m</text>
    </g>
  `;

  svg += `</svg>`;
  return svg;
}

// -------------------------------------------------------------
// Dynamic Camera Feeds (Surface & Underwater)
// -------------------------------------------------------------
function drawSurfaceCamera(canvas) {
  if (!canvas) return;
  const w = canvas.width = 320;
  const h = canvas.height = 200;
  const ctx = canvas.getContext('2d');

  const waveOffset = Math.sin(Date.now() * 0.003) * 3;
  const headingShift = ((s.heading - 85) * 0.4);

  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.52);
  skyGrad.addColorStop(0, '#7dd3fc');
  skyGrad.addColorStop(1, '#bae6fd');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h * 0.52);

  // Distant Green Reservoir Shoreline
  ctx.fillStyle = '#166534';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.52);
  ctx.quadraticCurveTo(80 + headingShift, h * 0.45 + waveOffset * 0.3, 160 + headingShift, h * 0.50);
  ctx.quadraticCurveTo(240 + headingShift, h * 0.42, w, h * 0.52);
  ctx.lineTo(w, h * 0.55);
  ctx.lineTo(0, h * 0.55);
  ctx.closePath();
  ctx.fill();

  // Reservoir Water Body with gentle waves
  const waterGrad = ctx.createLinearGradient(0, h * 0.52, 0, h);
  waterGrad.addColorStop(0, '#0284c7');
  waterGrad.addColorStop(1, '#075985');
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, h * 0.52, w, h * 0.48);

  // Water reflections & ripple highlights
  ctx.strokeStyle = 'rgba(224, 242, 254, 0.4)';
  ctx.lineWidth = 1.0;
  for (let i = 0; i < 5; i++) {
    const y = h * 0.58 + i * 18 + waveOffset;
    ctx.beginPath();
    ctx.moveTo(10, y);
    ctx.bezierCurveTo(90, y - 2, 180, y + 2, w - 10, y);
    ctx.stroke();
  }
}

function drawUnderwaterCamera(canvas) {
  if (!canvas) return;
  const w = canvas.width = 320;
  const h = canvas.height = 200;
  const ctx = canvas.getContext('2d');

  if (s.rov.state === 'Docked') {
    // Docked standby view
    ctx.fillStyle = '#0a192f';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#1e3a5f';
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, w - 32, h - 32);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '700 12px -apple-system, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ROV DOCKED', w / 2, h / 2 - 8);

    ctx.fillStyle = '#64748b';
    ctx.font = '11px monospace';
    ctx.fillText('Depth 0.0 m · Tether secured', w / 2, h / 2 + 10);
    ctx.textAlign = 'start';
    return;
  }

  // Deployed Submerged View
  const waterGrad = ctx.createLinearGradient(0, 0, 0, h);
  waterGrad.addColorStop(0, '#0369a1');
  waterGrad.addColorStop(1, '#082f49');
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, 0, w, h);

  // Sunlight filtering down (caustic sun rays)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.moveTo(w * 0.2, 0);
  ctx.lineTo(w * 0.1, h);
  ctx.lineTo(w * 0.35, h);
  ctx.lineTo(w * 0.4, 0);
  ctx.closePath();
  ctx.fill();

  // Floating silt particles / suspended sediment
  ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
  for (let i = 0; i < 16; i++) {
    const px = (i * 37 + (Date.now() * 0.02)) % w;
    const py = (i * 23 + (Date.now() * 0.015)) % h;
    ctx.beginPath();
    ctx.arc(px, py, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Reservoir Bed Silhouette at Bottom
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.78);
  ctx.quadraticCurveTo(w * 0.3, h * 0.72, w * 0.6, h * 0.82);
  ctx.quadraticCurveTo(w * 0.85, h * 0.75, w, h * 0.80);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();
}

// -------------------------------------------------------------
// Sediment Cross-Section Graphic (With Distance & Depth Axes)
// -------------------------------------------------------------
function renderSedimentCrossSection() {
  const currentStation = s.samples.find(q => dist(q, s.pos) < 0.01);

  let svg = `
    <svg class="sediment-svg" viewBox="0 0 380 180" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sedGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
        <linearGradient id="rockGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>

      <!-- Water Column -->
      <rect width="380" height="55" fill="#0c233c"/>
      <path d="M 0 55 H 380" stroke="#38bdf8" stroke-width="1.2" opacity="0.6"/>

      <!-- Depth Grid Guides & Y-Axis Labels -->
      <line x1="28" y1="85" x2="380" y2="85" stroke="#1e3a5f" stroke-dasharray="2 4"/>
      <text x="4" y="88" fill="#94a3b8" font-size="8" font-family="monospace">3.0m</text>
      <line x1="28" y1="125" x2="380" y2="125" stroke="#1e3a5f" stroke-dasharray="2 4"/>
      <text x="4" y="128" fill="#94a3b8" font-size="8" font-family="monospace">4.5m</text>

      <!-- Layer 1: Soft Sediment Layer (Amber) -->
      <path d="M 28 55 Q 110 70 200 66 T 380 58 L 380 110 Q 280 130 200 116 T 28 102 Z" fill="url(#sedGrad)"/>

      <!-- Layer 2: Hard Rock Sub-Bottom Acoustic Basement (Blue) -->
      <path d="M 28 102 Q 110 116 200 116 T 380 110 L 380 165 L 28 165 Z" fill="url(#rockGrad)"/>

      <!-- Distance X-Axis at bottom -->
      <line x1="28" y1="165" x2="380" y2="165" stroke="#334155" stroke-width="1"/>
      <text x="28" y="176" fill="#64748b" font-size="7.5" font-family="monospace">0m (W)</text>
      <text x="180" y="176" fill="#64748b" font-size="7.5" font-family="monospace">45m</text>
      <text x="330" y="176" fill="#64748b" font-size="7.5" font-family="monospace">90m (E)</text>
  `;

  // Place active station indicator
  if (currentStation) {
    const x = 35 + (currentStation.x / W) * 330;
    svg += `
      <line x1="${x}" y1="0" x2="${x}" y2="165" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3 3"/>
      <g transform="translate(${x - 42}, 125)" style="cursor:pointer;" onclick="inspectStation(${currentStation.x}, ${currentStation.y})">
        <rect width="84" height="18" rx="3" fill="rgba(15, 23, 42, 0.9)" stroke="#38bdf8" stroke-width="0.8"/>
        <text x="42" y="12" fill="#ffffff" font-size="8" font-weight="700" text-anchor="middle">Rock: 3.1m</text>
      </g>
    `;
  }

  // Hotspot chip near intake if sampled
  const intakeSample = s.samples.find(q => q.x >= 14 && q.value > 1.3);
  if (intakeSample) {
    svg += `
      <g transform="translate(255, 62)" style="cursor:pointer;" onclick="inspectStation(${intakeSample.x}, ${intakeSample.y})">
        <rect width="105" height="19" rx="3" fill="rgba(220, 38, 38, 0.9)" stroke="#ffffff" stroke-width="1"/>
        <circle cx="9" cy="9.5" r="3" fill="#fef08a"/>
        <text x="16" y="13" fill="#ffffff" font-size="8" font-weight="700">Hotspot: ${intakeSample.value.toFixed(2)}m Silt</text>
      </g>
    `;
  }

  svg += `</svg>`;
  return svg;
}

// -------------------------------------------------------------
// Interactive Station Inspection Modal
// -------------------------------------------------------------
function inspectStation(x, y) {
  const sample = s.samples.find(q => q.x === x && q.y === y);
  if (!sample) return;
  selectedStation = sample;

  const geoStr = formatCoords(sample.geo.lat, sample.geo.lon, userSettings.coordFormat);

  // Dual echo traces SVG
  const echoSvg = `
    <svg viewBox="0 0 340 100" style="width:100%;height:100px;background:#0f172a;border-radius:6px;">
      <polyline points="${sample.traces[0].map((v, i) => `${i * 2.1},${90 - v * 70}`).join(' ')}" fill="none" stroke="#16a34a" stroke-width="1.8"/>
      <polyline points="${sample.traces[1].map((v, i) => `${i * 2.1},${90 - v * 70}`).join(' ')}" fill="none" stroke="#d97706" stroke-width="1.8"/>
    </svg>
  `;

  $('modal-layer').innerHTML = `
    <div class="modal-backdrop" onclick="closeModal(event)">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e2e8f0;padding-bottom:10px;margin-bottom:14px;">
          <div>
            <h2 style="font-size:16px;color:#0d2342;margin:0;">Sonar Station Inspector · ${sample.stationId}</h2>
            <small style="color:#64748b;">${geoStr} · Sampled at ${sample.time}</small>
          </div>
          <button style="border:0;background:none;font-size:20px;cursor:pointer;color:#64748b;" onclick="closeModal()">✕</button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
          <div style="background:#f8fafc;padding:10px;border-radius:6px;border:1px solid #e2e8f0;">
            <small style="color:#64748b;font-weight:600;">ACOUSTIC THICKNESS</small>
            <div style="font-size:20px;font-weight:800;color:#0d2342;margin:3px 0;">${sample.value.toFixed(2)} m</div>
            <div style="font-size:11.5px;color:#0066cc;">Seabed: ${sample.seabedDepth.toFixed(2)}m · Basement: ${sample.basementDepth.toFixed(2)}m</div>
          </div>
          <div style="background:#f8fafc;padding:10px;border-radius:6px;border:1px solid #e2e8f0;">
            <small style="color:#64748b;font-weight:600;">ACOUSTIC CLASSIFICATION</small>
            <div style="font-size:16px;font-weight:800;color:${sample.value > 1.4 ? '#dc2626' : '#16a34a'};margin:3px 0;">${sample.classification}</div>
            <div style="font-size:11.5px;color:#64748b;">Confidence: ${(sample.confidence * 100).toFixed(0)}%</div>
          </div>
        </div>

        <div style="margin-bottom:14px;">
          <h4 style="font-size:12px;color:#0d2342;margin-bottom:4px;">Dual-Frequency Echo Traces (200 kHz Green & 33 kHz Amber)</h4>
          ${echoSvg}
          <div style="font-size:10.5px;color:#64748b;margin-top:3px;">0–8 m range · Peak 1 (seabed) at ${sample.seabedDepth.toFixed(2)}m · Peak 2 (reflector) at ${sample.basementDepth.toFixed(2)}m</div>
        </div>

        <div style="background:#e0f2fe;border-left:3px solid #0066cc;padding:8px 12px;border-radius:4px;font-size:11.5px;color:#0369a1;margin-bottom:14px;">
          <b>Interpretation Rationale:</b> ${sample.classification === 'Soft Silt Deposit' ? 'Deep acoustic penetration (>1.4 m) with secondary interface reflection indicates fluid silt layer requiring dredging assessment.' : 'Distinct impedance contrast between water-sediment and sediment-bedrock interfaces.'}
        </div>

        <div style="display:flex;gap:8px;justify-content:flex-end;">
          <button class="btn-ctrl" onclick="locateOnMap(${sample.x}, ${sample.y})">Center on map</button>
          <button class="btn-ctrl primary" onclick="deployROVAtStation(${sample.x}, ${sample.y})">Approve ROV inspection</button>
          <button class="btn-ctrl" onclick="takeCoreAtStation(${sample.x}, ${sample.y})">Collect core</button>
        </div>
      </div>
    </div>
  `;
}

function closeModal() {
  $('modal-layer').innerHTML = '';
}

function deployROVAtStation(x, y) {
  s.pos = { x, y };
  s.boat.speed = 0.0;
  s.boat.state = 'Holding station · ROV inspection';
  s.rov.state = 'Deploying';
  approval = 'Approved';
  s.events.unshift(`Operator approved ROV deployment at station (${x * 5}m E, ${y * 5}m N).`);
  if (typeof setMissionViewMode === 'function') {
    setMissionViewMode('rov');
  }
  closeModal();
  render();
}

function takeCoreAtStation(x, y) {
  verifiedPoint = { x, y, value: s.latest ? s.latest.value : 1.45 };
  core = terrain({ x, y }, s.scenario) + 0.02 * (rng(x + y) - 0.5);
  s.events.unshift(`Physical core sample collected at station (${x * 5}m E, ${y * 5}m N). Measured thickness: ${core.toFixed(2)}m.`);
  closeModal();
  render();
}

function locateOnMap(x, y) {
  closeModal();
  selectedStation = s.samples.find(q => q.x === x && q.y === y) || { x, y, geo: gridToGeo(x, y), value: terrain({ x, y }, s.scenario), stationId: `STN-${String(x).padStart(2, '0')}-${String(y).padStart(2, '0')}` };
  mapCenter = { x, y };
  go(2); // Go to Map & Navigation
}

function followBoat() {
  mapCenter = { ...s.pos };
  if (mapMode === '3D' && typeof setMissionViewMode === 'function') setMissionViewMode('surface');
  else render();
}

function followROV() {
  if (s.rov.state !== 'Docked') {
    mapCenter = { x: s.pos.x + 0.3, y: s.pos.y + 0.3 };
  } else {
    mapCenter = { ...s.pos };
  }
  if (mapMode === '3D' && typeof setMissionViewMode === 'function') setMissionViewMode('rov');
  else render();
}

function fitMission() {
  mapCenter = null;
  mapZoom = 1.0;
  if (mapMode === '3D' && typeof setMissionViewMode === 'function') setMissionViewMode('overview');
  else render();
}

// -------------------------------------------------------------
// PAGE 0: HOME MONITORING DASHBOARD (Clean Freshwater Survey Console)
// -------------------------------------------------------------
function renderHome() {
  const wq = s.latestWQ;
  const hist = s.history;
  const isSurveying = running;
  const isPaused = !running && s.steps > 0 && !s.done;
  const isDone = s.done;

  const stateClass = isDone ? 'completed' : isPaused ? 'paused' : '';
  const stateLabel = isDone
    ? 'Completed · All soundings acquired'
    : isSurveying
    ? 'Surveying · Active transect'
    : isPaused
    ? 'Paused · Standby'
    : 'Ready at launch';

  // Current vehicle speed: 0.0 m/s when stationary!
  const currentSpeed = running ? '1.2 m/s' : '0.0 m/s';

  // 1. Top Metric Cards (6 Cards with Uniform Structure & Aligned Baselines)
  const cardsHtml = `
    <div class="metrics-row">
      <!-- 1. Water Level -->
      <div class="metric-card" onclick="go(3)" title="Click for Water Analysis">
        <div class="metric-label">Water level</div>
        <div class="metric-val-row">
          <span class="metric-number">${wq.waterLevel.toFixed(2)}</span>
          <span class="metric-unit">m</span>
        </div>
        <span class="metric-status-tag tag-normal">+0.03 m</span>
        ${sparklineSvg(hist.waterLevel, '#0066cc', '#38bdf8')}
      </div>

      <!-- 2. Water Temperature -->
      <div class="metric-card" onclick="go(3)" title="Click for Water Analysis">
        <div class="metric-label">Water temperature</div>
        <div class="metric-val-row">
          <span class="metric-number">${wq.temp.toFixed(1)}</span>
          <span class="metric-unit">°C</span>
        </div>
        <span class="metric-status-tag tag-normal">+0.2 °C</span>
        ${sparklineSvg(hist.temp, '#d97706', '#fbbf24')}
      </div>

      <!-- 3. pH Level -->
      <div class="metric-card" onclick="go(3)" title="Click for Water Analysis">
        <div class="metric-label">pH level</div>
        <div class="metric-val-row">
          <span class="metric-number">${wq.ph.toFixed(2)}</span>
        </div>
        <span class="metric-status-tag ${wq.ph < 6.8 ? 'tag-red' : 'tag-normal'}">${wq.ph < 6.8 ? 'Acidic shift' : 'Normal'}</span>
        ${sparklineSvg(hist.ph, '#16a34a', '#86efac')}
      </div>

      <!-- 4. Dissolved Oxygen -->
      <div class="metric-card" onclick="go(3)" title="Click for Water Analysis">
        <div class="metric-label">Dissolved oxygen</div>
        <div class="metric-val-row">
          <span class="metric-number">${wq.do.toFixed(1)}</span>
          <span class="metric-unit">mg/L</span>
        </div>
        <span class="metric-status-tag ${wq.do < 5.0 ? 'tag-amber' : 'tag-normal'}">${wq.do < 5.0 ? 'Depleted' : 'Optimal'}</span>
        ${sparklineSvg(hist.do, '#0066cc', '#93c5fd')}
      </div>

      <!-- 5. Conductivity -->
      <div class="metric-card" onclick="go(3)" title="Click for Water Analysis">
        <div class="metric-label">Conductivity</div>
        <div class="metric-val-row">
          <span class="metric-number">${wq.cond}</span>
          <span class="metric-unit">µS/cm</span>
        </div>
        <span class="metric-status-tag ${wq.cond >= userSettings.thresholds.condMax ? 'tag-amber' : 'tag-normal'}">${wq.cond >= userSettings.thresholds.condMax ? 'Elevated' : 'Normal'}</span>
        ${sparklineSvg(hist.cond, '#0066cc', '#38bdf8')}
      </div>

      <!-- 6. Turbidity -->
      <div class="metric-card" onclick="go(3)" title="Click for Water Analysis">
        <div class="metric-label">Turbidity</div>
        <div class="metric-val-row">
          <span class="metric-number">${wq.turb.toFixed(1)}</span>
          <span class="metric-unit">NTU</span>
        </div>
        <span class="metric-status-tag ${wq.turb >= userSettings.thresholds.turbidityMax ? 'tag-amber' : 'tag-normal'}">${wq.turb >= userSettings.thresholds.turbidityMax ? 'Elevated' : 'Clear'}</span>
        ${sparklineSvg(hist.turb, '#d97706', '#fbbf24')}
      </div>
    </div>
  `;

  // 2. Second Row: Live Mission View (50%) & Map (50%)
  const secondRowHtml = `
    <div class="split-50">
      <!-- Live Mission View (Surface + Underwater Cameras) -->
      <div class="card-panel">
        <div class="panel-head">
          <h3>Live mission view</h3>
        </div>
        <div class="dual-camera-grid">
          <!-- Surface Camera -->
          <div class="camera-feed-box">
            <canvas id="surf-cam-canvas" class="camera-canvas"></canvas>
            <span class="camera-label-pill">Surface camera</span>
            <span class="camera-telemetry-overlay">ASV–01 · HDG ${s.heading}°</span>
          </div>

          <!-- Underwater Camera -->
          <div class="camera-feed-box">
            ${s.rov.state === 'Docked' ? `
              <div class="rov-docked-box">
                <b>ROV docked</b>
                <small>Stern winch secured · Depth 0.0 m</small>
                <button class="btn-sm-action" onclick="toggleROVDeployment()">Deploy ROV</button>
              </div>
            ` : `
              <canvas id="under-cam-canvas" class="camera-canvas"></canvas>
              <span class="camera-label-pill">Underwater camera</span>
              <span class="camera-telemetry-overlay">DEPTH ${s.rov.depth.toFixed(1)}m</span>
            `}
          </div>
        </div>
      </div>

      <!-- Map & Navigation Panel -->
      <div class="card-panel">
        <div class="panel-head">
          <h3>Map & navigation</h3>
          <div class="panel-head-actions">
            <div class="map-switch-toggle">
              <button class="map-switch-btn ${mapMode === '2D' ? 'active' : ''}" onclick="setMapMode('2D')">2D</button>
              <button class="map-switch-btn ${mapMode === '3D' ? 'active' : ''}" onclick="setMapMode('3D')">3D</button>
            </div>
            <button class="btn-sm-action" onclick="go(2)">Full map →</button>
          </div>
        </div>

        <div class="map-view-wrapper">
          ${mapMode === '2D' ? renderReservoirMap2D() : `
            <canvas id="map3d-canvas" style="width:100%;height:100%;display:block;touch-action:none;"></canvas>
            <div class="map-3d-toolbar">
              <button class="map-3d-btn ${mission3D.viewMode === 'surface' ? 'active' : ''}" onclick="setMissionViewMode('surface')">Surface</button>
              <button class="map-3d-btn ${mission3D.viewMode === 'cutaway' ? 'active' : ''}" onclick="setMissionViewMode('cutaway')">Cutaway</button>
              <button class="map-3d-btn ${mission3D.viewMode === 'rov' ? 'active' : ''}" onclick="setMissionViewMode('rov')">ROV</button>
              <button class="map-3d-btn ${mission3D.viewMode === 'overview' ? 'active' : ''}" onclick="setMissionViewMode('overview')">Fit</button>
              <button class="map-3d-btn ${mission3D.overlay ? 'active' : ''}" onclick="toggleSurveyOverlay()">${mission3D.overlay ? 'Overlay ON' : 'Overlay'}</button>
            </div>
          `}
          
          <div class="map-controls-overlay">
            <button class="map-btn" onclick="go(2)" title="North">N</button>
            <button class="map-btn" onclick="stepForward()" title="Single step">+</button>
          </div>
          
          <div class="map-depth-chip">
            <span>Water depth:</span>
            <b>${waterDepth(s.pos).toFixed(2)} m</b>
          </div>
        </div>
      </div>
    </div>
  `;

  // 3. Third Row: System Status (Left) | Water Quality Table (Mid) | Sediment (Right)
  const thirdRowHtml = `
    <div class="row-three-cols">
      <!-- 1. System Status (Vehicle Telemetry) -->
      <div class="card-panel">
        <div class="panel-head">
          <h3>System status</h3>
          <span class="metric-status-tag tag-normal">Nominal</span>
        </div>

        <div class="system-status-body">
          <!-- Surface Boat -->
          <div class="vehicle-subpanel">
            <div class="vehicle-subhead">
              <b>Surface boat (ASV–01)</b>
              <small style="color:#0066cc;">${s.boat.state}</small>
            </div>
            <div class="vehicle-visual-box">
              <canvas id="boat" style="width:100%;height:100%;display:block;"></canvas>
            </div>
            <div class="telemetry-bars-grid">
              <div class="stat-item-row">
                <span>Battery</span>
                <b>${s.boat.battery}%</b>
              </div>
              <div class="stat-item-row">
                <span>Solar charge</span>
                <b>${s.boat.solarWatts} W</b>
              </div>
              <div class="stat-item-row">
                <span>Heading</span>
                <b>${s.heading}°</b>
              </div>
              <div class="stat-item-row">
                <span>Speed</span>
                <b>${currentSpeed}</b>
              </div>
              <div class="stat-item-row">
                <span>Water depth</span>
                <b>${waterDepth(s.pos).toFixed(2)} m</b>
              </div>
              <div class="stat-item-row">
                <span>Comms link</span>
                <b style="color:var(--status-green);">Strong</b>
              </div>
            </div>
          </div>

          <!-- Mini-ROV -->
          <div class="vehicle-subpanel">
            <div class="vehicle-subhead">
              <b>Mini-ROV (Aquanaut–IV)</b>
              <small style="color:${s.rov.state === 'Docked' ? 'var(--text-dim)' : 'var(--status-green)'};">${s.rov.state}</small>
            </div>
            <div class="vehicle-visual-box" style="height:70px;">
              <canvas id="rov-canvas" style="width:100%;height:100%;display:block;"></canvas>
            </div>
            <div class="telemetry-bars-grid">
              <div class="stat-item-row">
                <span>Tether power</span>
                <b>${s.rov.tetherPower}</b>
              </div>
              <div class="stat-item-row">
                <span>ROV depth</span>
                <b>${s.rov.depth.toFixed(1)} m</b>
              </div>
              <div class="stat-item-row">
                <span>Tether deployed</span>
                <b>${s.rov.tetherLength.toFixed(1)} m</b>
              </div>
              <div class="stat-item-row">
                <span>Estimated position</span>
                <b>${s.rov.state === 'Docked' ? 'At surface boat' : 'USBL acoustic fix'}</b>
              </div>
            </div>
            <div class="rov-action-row">
              <button class="btn-sm-action" onclick="toggleROVDeployment()">${s.rov.state === 'Docked' ? 'Deploy ROV' : 'Recover ROV'}</button>
              <button class="btn-sm-action primary" onclick="openDigitalTwin('inspect')" style="font-weight:700;">Open digital twin →</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Water Quality Parameters (Compact Table) -->
      <div class="card-panel">
        <div class="panel-head">
          <h3>Water quality parameters</h3>
          <button class="btn-sm-action" onclick="go(3)">View details →</button>
        </div>

        <table class="wq-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Reading</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>pH</td>
              <td>${wq.ph.toFixed(2)}</td>
              <td><span class="metric-status-tag ${wq.ph < 6.8 ? 'tag-red' : 'tag-normal'}">${wq.ph < 6.8 ? 'Acidic shift' : 'Normal'}</span></td>
            </tr>
            <tr>
              <td>Dissolved oxygen</td>
              <td>${wq.do.toFixed(1)} mg/L</td>
              <td><span class="metric-status-tag ${wq.do < 5.0 ? 'tag-amber' : 'tag-normal'}">${wq.do < 5.0 ? 'Depleted' : 'Optimal'}</span></td>
            </tr>
            <tr>
              <td>Turbidity</td>
              <td>${wq.turb.toFixed(1)} NTU</td>
              <td><span class="metric-status-tag ${wq.turb >= userSettings.thresholds.turbidityMax ? 'tag-amber' : 'tag-normal'}">${wq.turb >= userSettings.thresholds.turbidityMax ? 'Elevated' : 'Clear'}</span></td>
            </tr>
            <tr>
              <td>Conductivity</td>
              <td>${wq.cond} µS/cm</td>
              <td><span class="metric-status-tag ${wq.cond >= userSettings.thresholds.condMax ? 'tag-amber' : 'tag-normal'}">${wq.cond >= userSettings.thresholds.condMax ? 'Elevated' : 'Normal'}</span></td>
            </tr>
            <tr>
              <td>Water temperature</td>
              <td>${wq.temp.toFixed(1)} °C</td>
              <td><span class="metric-status-tag tag-normal">Normal</span></td>
            </tr>
            <tr>
              <td>Salinity</td>
              <td>${wq.salinity.toFixed(2)} PSU</td>
              <td><span class="metric-status-tag tag-normal">Freshwater</span></td>
            </tr>
            <tr>
              <td>Total dissolved solids</td>
              <td>${wq.tds} ppm</td>
              <td><span class="metric-status-tag tag-normal">Normal</span></td>
            </tr>
            <tr>
              <td>Nitrate (NO₃⁻)</td>
              <td>${wq.nitrate.toFixed(1)} mg/L</td>
              <td><span class="metric-status-tag tag-normal">Normal</span></td>
            </tr>
            <tr>
              <td>Ammonia (NH₃)</td>
              <td>${wq.ammonia.toFixed(2)} mg/L</td>
              <td><span class="metric-status-tag tag-normal">Normal</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 3. Sediment Analysis (Cross-Section & Acoustic Profiling) -->
      <div class="card-panel">
        <div class="panel-head">
          <h3>Sediment analysis</h3>
          <button class="btn-sm-action" onclick="go(5)">Inspect sonar</button>
        </div>

        <div class="sediment-cross-wrap">
          ${renderSedimentCrossSection()}
        </div>

        <div class="sediment-legend-bar">
          <div class="sediment-legend-item">
            <span class="color-dot" style="background:#0284c7;"></span>
            <span>Hard rock</span>
          </div>
          <div class="sediment-legend-item">
            <span class="color-dot" style="background:#f59e0b;"></span>
            <span>Soft sediment</span>
          </div>
          <div class="sediment-legend-item">
            <span class="color-dot" style="background:#64748b;"></span>
            <span>Uncertain</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // 4. Bottom Row: Fish & Ecosystem | Alerts & Notifications | Mission Controls
  const recentAlerts = s.alerts.slice(0, 3);
  const progressPct = Math.round((s.steps / limit) * 100);

  const bottomRowHtml = `
    <div class="row-bottom-grid">
      <!-- Fish & Ecosystem -->
      <div class="card-panel">
        <div class="panel-head">
          <h3>Fish & ecosystem</h3>
        </div>
        <div class="eco-content-box">
          <div class="eco-ring-gauge">
            <svg class="eco-ring-svg" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" stroke-width="3"/>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#16a34a" stroke-width="3" stroke-dasharray="92, 100"/>
            </svg>
            <div class="eco-ring-center">92%</div>
          </div>
          <div class="eco-info-text">
            <b>Ecosystem status: Healthy</b>
            <small>${s.ecoObservations.evidence}</small>
          </div>
        </div>
      </div>

      <!-- Alerts & Notifications -->
      <div class="card-panel">
        <div class="panel-head">
          <h3>Alerts & notifications</h3>
          <button class="btn-sm-action" onclick="go(8)">View all →</button>
        </div>
        <div class="alerts-compact-list">
          ${recentAlerts.length ? recentAlerts.map(a => `
            <div class="alert-item-mini">
              <span class="alert-dot" style="background:${a.severity === 'critical' ? 'var(--status-red)' : a.severity === 'warning' ? 'var(--status-amber)' : 'var(--status-green)'};"></span>
              <span class="alert-time">${a.time}</span>
              <div class="alert-desc">
                ${a.message}
                <a class="alert-locate-link" onclick="locateOnMap(${a.pos.x}, ${a.pos.y})">Locate on map →</a>
              </div>
            </div>
          `).join('') : '<div style="font-size:12px;color:var(--text-dim);padding:6px 0;">All monitored parameters within nominal limits. No active alerts.</div>'}
        </div>
      </div>

      <!-- Mission Controls -->
      <div class="card-panel">
        <div class="panel-head">
          <h3>Mission controls</h3>
        </div>
        <div class="controls-body">
          <div class="control-buttons-row">
            <button class="btn-ctrl primary" onclick="togglePlay()">
              ${running ? 'Pause' : s.steps ? 'Resume' : 'Start survey'}
            </button>
            <button class="btn-ctrl" onclick="stepForward()" ${running || s.done ? 'disabled' : ''}>Step</button>
            <button class="btn-ctrl" onclick="resetSimulation();render()">Reset</button>
          </div>

          <div style="display:flex;align-items:center;gap:6px;font-size:11.5px;">
            <label style="color:var(--text-dim);font-weight:600;">Scenario:</label>
            <select id="scenario-selector" onchange="setScenario(this.value)" style="padding:4px 6px;font-size:11.5px;border-radius:4px;border:1px solid #cbd5e1;">
              <option value="1" ${scenario === 1 ? 'selected' : ''}>Normal survey</option>
              <option value="2" ${scenario === 2 ? 'selected' : ''}>High sediment near intake</option>
              <option value="3" ${scenario === 3 ? 'selected' : ''}>Water-quality anomaly</option>
            </select>
          </div>

          <div class="progress-bar-wrap">
            <div class="progress-bar-label">
              <span>Mission progress</span>
              <b>${progressPct}%</b>
            </div>
            <div class="progress-track-lg">
              <div class="progress-fill-lg" style="width:${progressPct}%;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Main Header Banner for Home
  return `
    <div class="dash-header-banner">
      <div class="dash-title-text">
        <h1>Mission overview</h1>
        <p>Amaravathi Reservoir · Sector A survey · <span style="font-weight:600;color:var(--navy-heading);">Simulated telemetry</span></p>
      </div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
        <button class="btn-ctrl primary" onclick="openDigitalTwin('inspect')" style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;font-weight:700;font-size:12px;box-shadow:0 2px 6px rgba(0,102,204,0.25);">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21 16-9 5-9-5V8l9-5 9 5v8Z"/><path d="m3.27 6.96 8.73 4.88 8.73-4.88"/><path d="M12 21.84V11.84"/></svg>
          Open digital twin →
        </button>
        <div class="mission-state-pill ${stateClass}">
          ${stateLabel}
        </div>
      </div>
    </div>

    ${cardsHtml}
    ${secondRowHtml}
    ${thirdRowHtml}
    ${bottomRowHtml}
  `;
}

function setMapMode(m) {
  mapMode = m;
  render();
}

function handle3DFallback(canvas, err) {
  mapMode = '2D';
  render();
  const alertBox = document.createElement('div');
  alertBox.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#fee2e2;border:1px solid #dc2626;color:#991b1b;padding:12px 16px;border-radius:8px;font-size:12px;z-index:999;box-shadow:0 4px 12px rgba(0,0,0,0.15);display:flex;gap:10px;align-items:center;';
  alertBox.innerHTML = `<span>3D view unavailable (${err.message || 'initialization error'}). Reverted to 2D reservoir map.</span> <button class="btn-sm-action" onclick="setMapMode('3D');this.parentElement.remove()">Retry 3D</button> <button style="border:0;background:none;cursor:pointer;font-weight:700;" onclick="this.parentElement.remove()">✕</button>`;
  document.body.appendChild(alertBox);
  setTimeout(() => alertBox.remove(), 7000);
}

function toggleROVDeployment() {
  if (s.rov.state === 'Docked') {
    s.rov.state = 'Deploying';
    approval = 'Approved';
    s.events.unshift(`Operator initiated ROV deployment to inspect current seabed.`);
    if (typeof setMissionViewMode === 'function') {
      setMissionViewMode('rov');
    }
  } else {
    s.rov.state = 'Recovering';
    s.events.unshift('Operator initiated ROV recovery to surface cradle.');
  }
  render();
}

// -------------------------------------------------------------
// PAGE 1: LIVE MONITORING (Comprehensive Telemetry Drill-Down)
// -------------------------------------------------------------
function renderLiveMonitoring() {
  const wq = s.latestWQ;
  const boat = s.boat;
  const rov = s.rov;
  const geo = gridToGeo(s.pos.x, s.pos.y);
  const currentSpeed = running ? '1.2 m/s' : '0.0 m/s';

  return `
    <div class="page-heading-block">
      <small>REAL-TIME SENSOR NETWORK</small>
      <h1>Live monitoring</h1>
      <p>Continuous telemetry stream from surface catamaran, tethered mini-ROV, and environmental multiparameter payload.</p>
    </div>

    <div class="drilldown-grid">
      <!-- 1. Surface Boat Telemetry -->
      <div class="drilldown-card">
        <div class="drilldown-header">
          <b>Surface boat (ASV–01)</b>
          <span class="metric-status-tag tag-normal">Operational</span>
        </div>
        <div class="drilldown-val-large">${currentSpeed} <small style="font-size:13px;color:var(--text-dim);font-weight:500;">(Heading ${boat.heading}°)</small></div>
        <table class="data-table">
          <tr><td>Battery level</td><td><b>${boat.battery}%</b></td></tr>
          <tr><td>Solar charge</td><td><b>${boat.solarWatts} W</b></td></tr>
          <tr><td>GNSS status</td><td><b>${boat.gnssStatus}</b></td></tr>
          <tr><td>Latitude / Longitude</td><td><b>${geo.lat.toFixed(5)}° N, ${geo.lon.toFixed(5)}° E</b></td></tr>
          <tr><td>Travel time / Soundings</td><td><b>${s.steps * 4}s / ${s.samples.length} soundings</b></td></tr>
        </table>
      </div>

      <!-- 2. Underwater Mini-ROV -->
      <div class="drilldown-card">
        <div class="drilldown-header">
          <b>Mini-ROV (Aquanaut–IV)</b>
          <span class="metric-status-tag ${rov.state === 'Docked' ? 'tag-normal' : 'tag-amber'}">${rov.state}</span>
        </div>
        <div class="drilldown-val-large">${rov.depth.toFixed(1)} <small style="font-size:13px;color:var(--text-dim);font-weight:500;">m ROV depth</small></div>
        <table class="data-table">
          <tr><td>Tether power</td><td><b>${rov.tetherPower}</b></td></tr>
          <tr><td>Tether deployed</td><td><b>${rov.tetherLength.toFixed(1)} / ${rov.maxTether} m</b></td></tr>
          <tr><td>USBL tracking</td><td><b>${rov.state === 'Docked' ? 'Stern cradle' : 'Active lock (±0.15m)'}</b></td></tr>
          <tr><td>Estimated position</td><td><b>${rov.state === 'Docked' ? 'At surface boat' : 'Derived via boat GNSS'}</b></td></tr>
          <tr><td>Inspection approval</td><td><b>${approval || 'Standby'}</b></td></tr>
        </table>
        <div style="margin-top:auto;padding-top:8px;">
          <button class="btn-ctrl primary" style="width:100%;justify-content:center;" onclick="toggleROVDeployment()">${rov.state === 'Docked' ? 'Deploy mini-ROV' : 'Recover mini-ROV'}</button>
        </div>
      </div>

      <!-- 3. Water Quality Multiprobe -->
      <div class="drilldown-card">
        <div class="drilldown-header">
          <b>Water quality multiprobe</b>
          <span class="metric-status-tag tag-normal">Calibrated</span>
        </div>
        <div class="drilldown-val-large">pH ${wq.ph.toFixed(2)} <small style="font-size:13px;color:var(--text-dim);font-weight:500;">/ DO ${wq.do.toFixed(1)} mg/L</small></div>
        <table class="data-table">
          <tr><td>Turbidity</td><td><b>${wq.turb.toFixed(1)} NTU</b></td></tr>
          <tr><td>Conductivity</td><td><b>${wq.cond} µS/cm</b></td></tr>
          <tr><td>Total dissolved solids</td><td><b>${wq.tds} ppm</b></td></tr>
          <tr><td>Water temperature</td><td><b>${wq.temp.toFixed(1)} °C</b></td></tr>
          <tr><td>Nitrate / Ammonia</td><td><b>${wq.nitrate.toFixed(1)} / ${wq.ammonia.toFixed(2)} mg/L</b></td></tr>
        </table>
      </div>

      <!-- 4. Acoustic Sonar System -->
      <div class="drilldown-card">
        <div class="drilldown-header">
          <b>Dual-frequency sonar</b>
          <span class="metric-status-tag tag-normal">200 / 33 kHz</span>
        </div>
        <div class="drilldown-val-large">${s.latest ? s.latest.value.toFixed(2) : '0.00'} <small style="font-size:13px;color:var(--text-dim);font-weight:500;">m Sediment</small></div>
        <table class="data-table">
          <tr><td>Seabed depth (200 kHz)</td><td><b>${s.latest ? s.latest.seabedDepth.toFixed(2) : '—'} m</b></td></tr>
          <tr><td>Basement reflector (33 kHz)</td><td><b>${s.latest ? s.latest.basementDepth.toFixed(2) : '—'} m</b></td></tr>
          <tr><td>Acoustic classification</td><td><b>${s.latest ? s.latest.classification : 'Awaiting ping'}</b></td></tr>
          <tr><td>Acoustic confidence</td><td><b>${s.latest ? (s.latest.confidence * 100).toFixed(0) : '—'}%</b></td></tr>
          <tr><td>Verification status</td><td><b>${core !== null ? 'Core verified' : 'Acoustic only'}</b></td></tr>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// PAGE 2: MAP & NAVIGATION (Full-Screen 2D & 3D Vector Map)
// -------------------------------------------------------------
function renderMapPage() {
  const geo = gridToGeo(s.pos.x, s.pos.y);
  const geoFormatted = formatCoords(geo.lat, geo.lon, userSettings.coordFormat);
  const currentSpeed = running ? '1.2 m/s' : '0.0 m/s';

  return `
    <div class="page-heading-block">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
        <div>
          <small>GEOGRAPHIC INFORMATION SYSTEM</small>
          <h1>Map & navigation</h1>
          <p>Autonomous path tracking across Amaravathi Reservoir Sector A with real-time waypoint progression.</p>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <div class="map-switch-toggle">
            <button class="map-switch-btn ${mapMode === '2D' ? 'active' : ''}" onclick="setMapMode('2D')">2D Reservoir</button>
            <button class="map-switch-btn ${mapMode === '3D' ? 'active' : ''}" onclick="setMapMode('3D')">3D Mission View</button>
          </div>
          <button class="btn-ctrl" onclick="followBoat()" title="Follow Surface Boat">Follow boat</button>
          <button class="btn-ctrl" onclick="followROV()" title="Follow Mini-ROV">Follow ROV</button>
          <button class="btn-ctrl" onclick="fitMission()" title="Fit Complete Mission">Fit mission</button>
          <button class="btn-ctrl primary" onclick="togglePlay()">${running ? 'Pause' : 'Start survey'}</button>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 270px;gap:14px;align-items:start;">
      <div class="card-panel" style="padding:0;overflow:hidden;height:520px;position:relative;">
        ${mapMode === '2D' ? renderReservoirMap2D() : `
          <canvas id="map3d-canvas" style="width:100%;height:100%;display:block;touch-action:none;"></canvas>
          <div class="map-3d-toolbar large">
            <button class="map-3d-btn ${mission3D.viewMode === 'surface' ? 'active' : ''}" onclick="setMissionViewMode('surface')">Surface View</button>
            <button class="map-3d-btn ${mission3D.viewMode === 'cutaway' ? 'active' : ''}" onclick="setMissionViewMode('cutaway')">Underwater Cutaway</button>
            <button class="map-3d-btn ${mission3D.viewMode === 'rov' ? 'active' : ''}" onclick="setMissionViewMode('rov')">ROV View</button>
            <button class="map-3d-btn ${mission3D.viewMode === 'overview' ? 'active' : ''}" onclick="setMissionViewMode('overview')">Fit Mission</button>
            <button class="map-3d-btn ${mission3D.overlay ? 'active' : ''}" onclick="toggleSurveyOverlay()">${mission3D.overlay ? 'Survey Overlay: ON' : 'Survey Overlay: OFF'}</button>
          </div>
        `}
      </div>

      <div style="display:flex;flex-direction:column;gap:12px;">
        <div class="card-panel">
          <h3 style="font-size:13px;color:var(--navy-heading);margin-bottom:8px;">Surface boat position (GNSS)</h3>
          <div style="font-family:monospace;font-size:12.5px;color:#0066cc;font-weight:700;margin-bottom:8px;">${geoFormatted}</div>
          <div style="font-size:11.5px;color:var(--text-muted);line-height:1.6;">
            Speed: <b>${currentSpeed}</b><br>
            Heading: <b>${s.heading}°</b><br>
            Survey sector: <b>Sector A (5m grid)</b><br>
            Water depth: <b>${waterDepth(s.pos).toFixed(2)} m</b>
          </div>
        </div>

        <div class="card-panel">
          <h3 style="font-size:13px;color:var(--navy-heading);margin-bottom:8px;">Mini-ROV underwater</h3>
          <div style="font-size:11.5px;color:var(--text-muted);line-height:1.6;">
            Status: <b>${s.rov.state}</b><br>
            ROV depth: <b>${s.rov.depth.toFixed(1)} m</b><br>
            Tether deployed: <b>${s.rov.tetherLength.toFixed(1)} m</b><br>
            Estimated position: <b>${s.rov.state === 'Docked' ? 'At surface boat' : '+0.3m E, +0.3m N'}</b>
          </div>
          <div style="margin-top:8px;">
            <button class="btn-ctrl" style="width:100%;justify-content:center;font-size:11px;" onclick="toggleROVDeployment()">${s.rov.state === 'Docked' ? 'Deploy ROV' : 'Recover ROV'}</button>
          </div>
        </div>

        <div class="card-panel">
          <h3 style="font-size:13px;color:var(--navy-heading);margin-bottom:8px;">Map legend</h3>
          <div style="font-size:11px;color:var(--text-dim);display:flex;flex-direction:column;gap:5px;">
            <div>🟡 <b>Surface boat</b> (ASV–01 Reference)</div>
            <div>🟢 <b>Mini-ROV</b> (Submerged position)</div>
            <div>🔶 <b>Reservoir intake structure</b></div>
            <div>─ <b>Surveyed track</b> (Cyan)</div>
            <div>┈ <b>Planned route</b> (Gray)</div>
            <div>🔴 <b>Active alert station</b></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// PAGE 3: WATER ANALYSIS (Chemical & Physical Parameters Table)
// -------------------------------------------------------------
function renderWaterAnalysis() {
  const wq = s.latestWQ;
  const geo = gridToGeo(s.pos.x, s.pos.y);
  const geoStr = formatCoords(geo.lat, geo.lon, userSettings.coordFormat);

  const params = [
    { name: 'pH level', val: wq.ph.toFixed(2), unit: '', status: wq.ph < 6.8 ? 'Acidic shift' : 'Normal', range: '6.5 – 8.5', sensor: 'Glass bulb combined electrode' },
    { name: 'Dissolved oxygen', val: wq.do.toFixed(1), unit: 'mg/L', status: wq.do < 5.0 ? 'Depleted' : 'Optimal', range: '> 5.0 mg/L', sensor: 'Optical luminescence sensor' },
    { name: 'Water temperature', val: wq.temp.toFixed(1), unit: '°C', status: 'Normal', range: '18 – 30 °C', sensor: 'PT1000 platinum RTD' },
    { name: 'Conductivity', val: wq.cond, unit: 'µS/cm', status: wq.cond >= userSettings.thresholds.condMax ? 'Elevated' : 'Normal', range: '< 550 µS/cm', sensor: '4-electrode toroidal sensor' },
    { name: 'Turbidity', val: wq.turb.toFixed(1), unit: 'NTU', status: wq.turb >= userSettings.thresholds.turbidityMax ? 'Elevated' : 'Clear', range: '< 20 NTU', sensor: '90° nephelometric near-IR' },
    { name: 'Total dissolved solids (TDS)', val: wq.tds, unit: 'ppm', status: 'Normal', range: '< 500 ppm', sensor: 'Derived from conductivity (k=0.75)' },
    { name: 'Salinity', val: wq.salinity.toFixed(2), unit: 'PSU', status: 'Freshwater', range: '< 0.50 PSU', sensor: 'Calculated via PSS-78 algorithm' },
    { name: 'Nitrate (NO₃⁻)', val: wq.nitrate.toFixed(1), unit: 'mg/L', status: 'Normal', range: '< 10.0 mg/L', sensor: 'UV absorption spectrophotometer' },
    { name: 'Ammonia (NH₃)', val: wq.ammonia.toFixed(2), unit: 'mg/L', status: 'Normal', range: '< 0.20 mg/L', sensor: 'Ion selective electrode (ISE)' }
  ];

  return `
    <div class="page-heading-block">
      <small>LIMNOLOGICAL METRICS</small>
      <h1>Water analysis</h1>
      <p>Laboratory-grade water quality parameters sampled at ${geoStr} at depth 0.5m.</p>
    </div>

    <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;box-shadow:var(--shadow-card);margin-bottom:20px;">
      <table class="data-table">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Reading</th>
            <th>Unit</th>
            <th>Status</th>
            <th>Nominal range</th>
            <th>Instrument / Method</th>
          </tr>
        </thead>
        <tbody>
          ${params.map(p => `
            <tr>
              <td><b>${p.name}</b></td>
              <td style="font-size:14px;font-weight:700;color:var(--navy-heading);">${p.val}</td>
              <td style="color:var(--text-dim);">${p.unit || '—'}</td>
              <td><span class="metric-status-tag ${p.status === 'Normal' || p.status === 'Optimal' || p.status === 'Freshwater' || p.status === 'Clear' ? 'tag-normal' : p.status === 'Depleted' || p.status === 'Elevated' ? 'tag-amber' : 'tag-red'}">${p.status}</span></td>
              <td style="color:var(--text-dim);">${p.range}</td>
              <td style="color:var(--text-dim);font-size:11.5px;">${p.sensor} (Simulated)</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// -------------------------------------------------------------
// PAGE 4: SURFACE ANALYSIS (Visual Surface Observations & Waves)
// -------------------------------------------------------------
function renderSurfaceAnalysis() {
  return `
    <div class="page-heading-block">
      <small>OPTICAL & ENVIRONMENTAL OBSERVATIONS</small>
      <h1>Surface analysis</h1>
      <p>Shoreline horizon inspection, surface wave disturbance, and debris observation logging.</p>
    </div>

    <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:14px;margin-bottom:18px;">
      <div class="card-panel">
        <h3 style="font-size:13px;color:var(--navy-heading);margin-bottom:10px;">Surface camera feed</h3>
        <div style="border-radius:8px;overflow:hidden;height:220px;background:#0f172a;position:relative;">
          <canvas id="surf-cam-canvas" style="width:100%;height:100%;display:block;"></canvas>
          <span class="camera-label-pill">Surface camera · ASV–01</span>
        </div>
      </div>

      <div class="card-panel">
        <h3 style="font-size:13px;color:var(--navy-heading);margin-bottom:10px;">Surface conditions</h3>
        <table class="data-table">
          <tr><td>Wave height</td><td><b>0.08 – 0.14 m (Gentle chop)</b></td></tr>
          <tr><td>Surface drift</td><td><b>0.12 m/s North-East</b></td></tr>
          <tr><td>Wind velocity</td><td><b>4.2 kt / ENE</b></td></tr>
          <tr><td>Water clarity</td><td><b>Secchi depth ~2.1 m</b></td></tr>
          <tr><td>Solar irradiance</td><td><b>720 W/m² (Clear sky)</b></td></tr>
        </table>
      </div>
    </div>

    <div class="card-panel">
      <h3 style="font-size:13px;color:var(--navy-heading);margin-bottom:10px;">Visible surface observations</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Location</th>
            <th>Category</th>
            <th>Observation details</th>
          </tr>
        </thead>
        <tbody>
          ${s.surfaceObservations.map(o => `
            <tr>
              <td>${o.time}</td>
              <td>${o.pos.x * 5}m E, ${o.pos.y * 5}m N</td>
              <td><b>${o.type}</b></td>
              <td>${o.note}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// -------------------------------------------------------------
// PAGE 5: SEDIMENT ANALYSIS (Detailed Sonar Cross-Section & Core)
// -------------------------------------------------------------
function renderSedimentAnalysis() {
  const peakSample = s.samples.reduce((a, b) => (!a || b.value > a.value ? b : a), null);

  return `
    <div class="page-heading-block">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
        <div>
          <small>ACOUSTIC SUB-BOTTOM PROFILING</small>
          <h1>Sediment analysis</h1>
          <p>Dual-frequency 200 kHz & 33 kHz sonar interpretation, reservoir silt stratification, and ground-truth core verification.</p>
        </div>
        <button class="btn-ctrl primary" onclick="go(7)">Generate sediment report →</button>
      </div>
    </div>

    <div class="card-panel" style="margin-bottom:16px;">
      <h3 style="font-size:13px;color:var(--navy-heading);margin-bottom:10px;">Longitudinal reservoir transect (Cross-section)</h3>
      <div class="sediment-cross-wrap" style="height:220px;">
        ${renderSedimentCrossSection()}
      </div>
      <div style="font-size:11.5px;color:var(--text-dim);margin-top:6px;">
        Select any station chip to inspect its raw dual-frequency echo waveforms, interface depths, and acoustic classification rationale.
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <div class="card-panel">
        <h3 style="font-size:13px;color:var(--navy-heading);margin-bottom:10px;">Hotspot verification & physical coring</h3>
        <table class="data-table">
          <tr><td>Survey peak thickness</td><td><b>${peakSample ? peakSample.value.toFixed(2) + ' m' : 'Awaiting survey'}</b></td></tr>
          <tr><td>Peak location</td><td><b>${peakSample ? `${peakSample.x * 5}m E, ${peakSample.y * 5}m N` : '—'}</b></td></tr>
          <tr><td>Acoustic sonar estimate</td><td><b>${peakSample ? peakSample.value.toFixed(2) + ' m' : '—'}</b></td></tr>
          <tr><td>Physical core measurement</td><td><b style="color:#0066cc;">${core !== null ? core.toFixed(2) + ' m' : 'Not yet sampled'}</b></td></tr>
          <tr><td>ROV inspection decision</td><td><b>${approval || 'Pending operator review'}</b></td></tr>
        </table>
        <div style="display:flex;gap:6px;margin-top:12px;">
          <button class="btn-ctrl primary" onclick="takeCoreAtStation(${peakSample ? peakSample.x : 15}, ${peakSample ? peakSample.y : 4})" ${!peakSample || core !== null ? 'disabled' : ''}>Collect simulated core</button>
          <button class="btn-ctrl" onclick="deployROVAtStation(${peakSample ? peakSample.x : 15}, ${peakSample ? peakSample.y : 4})" ${approval ? 'disabled' : ''}>Approve ROV inspection</button>
        </div>
      </div>

      <div class="card-panel">
        <h3 style="font-size:13px;color:var(--navy-heading);margin-bottom:10px;">Siltation risk & action thresholds</h3>
        <p style="font-size:12.5px;color:var(--text-muted);line-height:1.6;margin-bottom:10px;">
          Sediment deposits exceeding the <b>1.40 m</b> threshold near the intake structure create active intake clogging risks. Dual-frequency sonar confirms low-impedance fluid mud over hard acoustic basement.
        </p>
        <button class="btn-ctrl" onclick="go(7)">Open full mission report →</button>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// PAGE 6: FISH & ECOSYSTEM (Evidence-Backed Ecological Summary)
// -------------------------------------------------------------
function renderFishEcosystem() {
  return `
    <div class="page-heading-block">
      <small>ECOLOGICAL INTEGRITY ASSESSMENT</small>
      <h1>Fish & ecosystem</h1>
      <p>Evidence-based aquatic habitat evaluation derived from live dissolved oxygen, light penetration, and mid-water sonar echoes.</p>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <div class="card-panel">
        <h3 style="font-size:13px;color:var(--navy-heading);margin-bottom:10px;">Ecosystem health gauge</h3>
        <div style="display:flex;align-items:center;gap:16px;padding:12px 0;">
          <div class="eco-ring-gauge" style="width:80px;height:80px;">
            <svg class="eco-ring-svg" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" stroke-width="3"/>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#16a34a" stroke-width="3" stroke-dasharray="92, 100"/>
            </svg>
            <div class="eco-ring-center" style="font-size:16px;">92%</div>
          </div>
          <div>
            <b style="font-size:14px;color:var(--status-green);">Ecosystem status: Healthy</b>
            <p style="font-size:12px;color:var(--text-muted);margin-top:4px;">High ecological viability. Well-oxygenated water column supports indigenous carp and tilapia populations.</p>
          </div>
        </div>
      </div>

      <div class="card-panel">
        <h3 style="font-size:13px;color:var(--navy-heading);margin-bottom:10px;">Supporting empirical evidence</h3>
        <table class="data-table">
          <tr><td>Dissolved oxygen indicator</td><td><b>${s.latestWQ.do.toFixed(1)} mg/L (Baseline > 5.0 mg/L)</b></td></tr>
          <tr><td>Water turbidity</td><td><b>${s.latestWQ.turb.toFixed(1)} NTU (Adequate euphotic depth)</b></td></tr>
          <tr><td>Acoustic mid-water contacts</td><td><b>${s.ecoObservations.fishAcousticContacts} detected targets</b></td></tr>
          <tr><td>pH stress index</td><td><b>${s.latestWQ.ph.toFixed(2)} (Circumneutral range)</b></td></tr>
        </table>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// PAGE 7: REPORTS (Formal Mission Report with Print & Export)
// -------------------------------------------------------------
function renderReports() {
  const peakSample = s.samples.reduce((a, b) => (!a || b.value > a.value ? b : a), null);
  const geoOrigin = GEO_ORIGIN;

  return `
    <div class="page-heading-block">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
        <div>
          <small>OFFICIAL SURVEY RECORD</small>
          <h1>Mission reports</h1>
          <p>Complete audit log, sensor time-series, acoustic cross-section, and operator inspection decisions.</p>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn-ctrl primary" onclick="window.print()">Print / Save as PDF</button>
          <button class="btn-ctrl" onclick="exportMissionJson()">Export survey JSON</button>
        </div>
      </div>
    </div>

    <div class="card-panel report-printable" style="padding:24px;background:#ffffff;margin-bottom:24px;">
      <div style="border-bottom:2px solid var(--navy-heading);padding-bottom:14px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:flex-end;">
        <div>
          <h2 style="font-size:20px;color:var(--navy-heading);margin:0;">AquaSentinel Survey & Bathymetry Report</h2>
          <div style="font-size:12px;color:var(--text-dim);margin-top:3px;">Sector A · Amaravathi Reservoir Autonomous Hydrographic Survey</div>
        </div>
        <div style="text-align:right;">
          <span class="metric-status-tag ${s.done ? 'tag-normal' : 'tag-amber'}">${s.done ? '[COMPLETED MISSION]' : '[IN PROGRESS / PARTIAL]'}</span>
          <div style="font-size:11.5px;color:var(--text-dim);margin-top:3px;">Mission ID: <b>AQ-2026-1122-A1</b></div>
        </div>
      </div>

      <h3 style="font-size:13px;color:var(--navy-heading);margin-bottom:8px;">1. Operational overview</h3>
      <table class="data-table" style="margin-bottom:18px;">
        <tr><td>Survey scenario</td><td><b>${scenario === 1 ? 'Normal survey' : scenario === 2 ? 'High sediment near intake' : 'Water-quality anomaly'}</b></td><td>Planner algorithm</td><td><b>${s.mode} Infill</b></td></tr>
        <tr><td>Survey sector reference</td><td><b>${geoOrigin.lat.toFixed(5)}° N, ${geoOrigin.lon.toFixed(5)}° E</b></td><td>Soundings collected</td><td><b>${s.samples.length} acoustic stations</b></td></tr>
        <tr><td>Travel time elapsed</td><td><b>${s.steps * 4} seconds</b></td><td>Area coverage</td><td><b>${Math.round((s.samples.length / cells.length) * 100)}% of water cells</b></td></tr>
        <tr><td>Peak sediment layer</td><td><b>${peakSample ? peakSample.value.toFixed(2) + ' m' : '—'}</b></td><td>Physical core validation</td><td><b>${core !== null ? core.toFixed(2) + ' m' : 'Pending'}</b></td></tr>
      </table>

      <h3 style="font-size:13px;color:var(--navy-heading);margin-bottom:8px;">2. Acoustic sub-bottom cross-section</h3>
      <div class="sediment-cross-wrap" style="height:170px;margin-bottom:18px;">
        ${renderSedimentCrossSection()}
      </div>

      <h3 style="font-size:13px;color:var(--navy-heading);margin-bottom:8px;">3. Environmental water quality parameters</h3>
      <table class="data-table" style="margin-bottom:18px;">
        <thead><tr><th>Parameter</th><th>Reading</th><th>Baseline target</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>pH level</td><td><b>${s.latestWQ.ph.toFixed(2)}</b></td><td>6.5 – 8.5</td><td>Normal</td></tr>
          <tr><td>Dissolved oxygen</td><td><b>${s.latestWQ.do.toFixed(1)} mg/L</b></td><td>> 5.0 mg/L</td><td>Optimal</td></tr>
          <tr><td>Turbidity</td><td><b>${s.latestWQ.turb.toFixed(1)} NTU</b></td><td>< 20 NTU</td><td>${s.latestWQ.turb >= 20 ? 'Elevated' : 'Clear'}</td></tr>
          <tr><td>Conductivity</td><td><b>${s.latestWQ.cond} µS/cm</b></td><td>< 550 µS/cm</td><td>${s.latestWQ.cond >= 550 ? 'Elevated' : 'Normal'}</td></tr>
        </tbody>
      </table>

      <h3 style="font-size:13px;color:var(--navy-heading);margin-bottom:8px;">4. Operator audit trail & event log</h3>
      <div style="background:#f8fafc;padding:12px;border-radius:6px;border:1px solid #e2e8f0;font-family:monospace;font-size:11.5px;max-height:140px;overflow-y:auto;">
        ${s.events.map(e => `<div>• ${e}</div>`).join('')}
      </div>
    </div>
  `;
}

function exportMissionJson() {
  const data = {
    project: 'AquaSentinel',
    scenario,
    missionId: 'AQ-2026-1122-A1',
    timestamp: new Date().toISOString(),
    boatTelemetry: s.boat,
    rovTelemetry: s.rov,
    samples: s.samples,
    path: s.path,
    waterQuality: s.latestWQ,
    coreValidation: { coreThickness: core, verifiedPoint },
    operatorDecision: approval,
    eventLog: s.events
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aquasentinel-survey-${Date.now()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// -------------------------------------------------------------
// PAGE 8: ALERTS (Location-Based Alert Management)
// -------------------------------------------------------------
function renderAlertsPage() {
  return `
    <div class="page-heading-block">
      <small>INCIDENT RESPONSE & DISPATCH</small>
      <h1>Alerts & notifications</h1>
      <p>Demonstrable threshold alerts generated when acoustic or chemical evidence meets configured rules.</p>
    </div>

    <div class="card-panel">
      <table class="data-table">
        <thead>
          <tr>
            <th>Severity</th>
            <th>Timestamp</th>
            <th>Station ID</th>
            <th>Parameter</th>
            <th>Measured value</th>
            <th>Threshold</th>
            <th>Action required</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${s.alerts.length ? s.alerts.map(a => `
            <tr>
              <td><span class="metric-status-tag ${a.severity === 'critical' ? 'tag-red' : a.severity === 'warning' ? 'tag-amber' : 'tag-normal'}">${a.severity.toUpperCase()}</span></td>
              <td>${a.time}</td>
              <td><b>${a.stationId}</b></td>
              <td>${a.param}</td>
              <td style="font-weight:700;color:var(--navy-heading);">${a.value}</td>
              <td>${a.threshold}</td>
              <td style="font-size:11.5px;color:var(--text-muted);">${a.actionRequired}</td>
              <td><span class="metric-status-tag ${a.status === 'Active' ? 'tag-red' : 'tag-normal'}">${a.status}</span></td>
              <td>
                <div style="display:flex;gap:4px;">
                  <button class="btn-sm-action" onclick="locateOnMap(${a.pos.x}, ${a.pos.y})">Map</button>
                  <button class="btn-sm-action" onclick="inspectStation(${a.pos.x}, ${a.pos.y})">Inspect</button>
                  <button class="btn-sm-action" onclick="acknowledgeAlert('${a.id}')">Ack</button>
                </div>
              </td>
            </tr>
          `).join('') : '<tr><td colspan="9" style="text-align:center;padding:20px;color:var(--text-dim);">No active alerts. All parameters nominal.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

function acknowledgeAlert(id) {
  const alert = s.alerts.find(a => a.id === id);
  if (alert) {
    alert.status = 'Acknowledged';
    s.alertUnreadCount = Math.max(0, s.alertUnreadCount - 1);
    s.events.unshift(`Operator acknowledged alert ${alert.id} (${alert.title}).`);
    render();
  }
}

// -------------------------------------------------------------
// PAGE 9: SETTINGS (Playback Speed, Alert Thresholds, Coordinate Format)
// -------------------------------------------------------------
function renderSettings() {
  const t = userSettings.thresholds;

  return `
    <div class="page-heading-block">
      <small>SYSTEM CONFIGURATION</small>
      <h1>Settings</h1>
      <p>Configure simulation playback speed, coordinate display format, and location-based demonstration thresholds.</p>
    </div>

    <div style="max-width:640px;background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:20px;box-shadow:var(--shadow-card);">
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div>
          <label style="font-size:12.5px;font-weight:700;color:var(--navy-heading);display:block;margin-bottom:4px;">Simulation playback speed</label>
          <select id="setting-speed" style="width:100%;padding:8px;border-radius:6px;border:1px solid #cbd5e1;font-size:13px;">
            <option value="1" ${userSettings.speed === 1 ? 'selected' : ''}>1× (Real-time survey rate)</option>
            <option value="2" ${userSettings.speed === 2 ? 'selected' : ''}>2× (Demonstration speed - Recommended)</option>
            <option value="5" ${userSettings.speed === 5 ? 'selected' : ''}>5× (Fast survey simulation)</option>
          </select>
        </div>

        <div>
          <label style="font-size:12.5px;font-weight:700;color:var(--navy-heading);display:block;margin-bottom:4px;">Geographic coordinates display format</label>
          <select id="setting-coord" style="width:100%;padding:8px;border-radius:6px;border:1px solid #cbd5e1;font-size:13px;">
            <option value="DD" ${userSettings.coordFormat === 'DD' ? 'selected' : ''}>Decimal Degrees (e.g. 10.58350° N, 77.26800° E)</option>
            <option value="UTM" ${userSettings.coordFormat === 'UTM' ? 'selected' : ''}>Local Survey Grid Ref (e.g. E +25m, N -10m)</option>
            <option value="DMS" ${userSettings.coordFormat === 'DMS' ? 'selected' : ''}>Degrees Minutes Seconds (e.g. 10°35'0.6"N, 77°16'4.8"E)</option>
          </select>
        </div>

        <h3 style="font-size:14px;color:var(--navy-heading);border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-top:6px;">Alert demonstration thresholds</h3>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div>
            <label style="font-size:11.5px;font-weight:600;color:var(--text-dim);display:block;margin-bottom:3px;">Sediment alert threshold (m)</label>
            <input type="number" step="0.05" id="thresh-sed" value="${t.sedimentMax}" style="width:100%;padding:6px 8px;border-radius:5px;border:1px solid #cbd5e1;font-size:12.5px;">
          </div>
          <div>
            <label style="font-size:11.5px;font-weight:600;color:var(--text-dim);display:block;margin-bottom:3px;">Turbidity alert threshold (NTU)</label>
            <input type="number" step="1" id="thresh-turb" value="${t.turbidityMax}" style="width:100%;padding:6px 8px;border-radius:5px;border:1px solid #cbd5e1;font-size:12.5px;">
          </div>
          <div>
            <label style="font-size:11.5px;font-weight:600;color:var(--text-dim);display:block;margin-bottom:3px;">Minimum pH threshold</label>
            <input type="number" step="0.1" id="thresh-ph" value="${t.phMin}" style="width:100%;padding:6px 8px;border-radius:5px;border:1px solid #cbd5e1;font-size:12.5px;">
          </div>
          <div>
            <label style="font-size:11.5px;font-weight:600;color:var(--text-dim);display:block;margin-bottom:3px;">Maximum conductivity (µS/cm)</label>
            <input type="number" step="10" id="thresh-cond" value="${t.condMax}" style="width:100%;padding:6px 8px;border-radius:5px;border:1px solid #cbd5e1;font-size:12.5px;">
          </div>
        </div>

        <div style="display:flex;gap:8px;margin-top:10px;">
          <button class="btn-ctrl primary" onclick="saveSettings()">Save settings</button>
          <button class="btn-ctrl" onclick="restoreDefaultSettings()">Restore defaults</button>
        </div>
      </div>
    </div>
  `;
}

function saveSettings() {
  userSettings.speed = Number($('setting-speed').value);
  userSettings.coordFormat = $('setting-coord').value;
  userSettings.thresholds.sedimentMax = Number($('thresh-sed').value);
  userSettings.thresholds.turbidityMax = Number($('thresh-turb').value);
  userSettings.thresholds.phMin = Number($('thresh-ph').value);
  userSettings.thresholds.condMax = Number($('thresh-cond').value);

  try {
    localStorage.setItem('aquasentinel_settings', JSON.stringify(userSettings));
  } catch (e) {}

  alert('Settings saved successfully!');
  render();
}

function restoreDefaultSettings() {
  userSettings = JSON.parse(JSON.stringify(defaultSettings));
  try {
    localStorage.setItem('aquasentinel_settings', JSON.stringify(userSettings));
  } catch (e) {}
  render();
}

// -------------------------------------------------------------
// PAGE 10: DIGITAL TWIN (Physical Apparatus & Operational Twin)
// -------------------------------------------------------------
function openDigitalTwin(mode = 'inspect') {
  if (typeof setDigitalTwinMode === 'function') {
    setDigitalTwinMode(mode);
  }
  go(10);
}

function renderDigitalTwin() {
  const isOperate = (digitalTwin.mode === 'operate');
  const selected = digitalTwin.selectedPart || 'Winch';
  const info = partInfo[selected] || partInfo['Winch'];
  const readings = info.getReadings ? info.getReadings(s) : [];

  return `
    <div class="page-heading-block">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
        <div>
          <small>PHYSICAL APPARATUS & MULTI-SUBSYSTEM TWIN</small>
          <h1>AquaSentinel Digital Twin</h1>
          <p>3D simulation-driven assembly of Catamaran ASV–01 and tethered Aquanaut–IV Mini-ROV with live telemetry.</p>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <div class="map-switch-toggle">
            <button class="map-switch-btn ${!isOperate ? 'active' : ''}" onclick="setDigitalTwinMode('inspect')">Inspect equipment</button>
            <button class="map-switch-btn ${isOperate ? 'active' : ''}" onclick="setDigitalTwinMode('operate')">Operate mission</button>
          </div>
          <button class="btn-ctrl" onclick="go(0)">← Dashboard</button>
        </div>
      </div>
    </div>

    ${!isOperate ? `
      <!-- 1. INSPECT EQUIPMENT (Neutral Studio Engineering View) -->
      <div style="display:grid;grid-template-columns:1.8fr 1fr;gap:14px;align-items:start;">
        <div class="card-panel" style="padding:0;overflow:hidden;position:relative;">
          <div style="position:relative;height:460px;background:radial-gradient(ellipse at center, #f8fafc, #cbd5e1);">
            <canvas id="twin-canvas" style="width:100%;height:100%;display:block;touch-action:none;"></canvas>
            <div style="position:absolute;left:12px;bottom:10px;background:rgba(255,255,255,0.85);backdrop-filter:blur(4px);padding:4px 8px;border-radius:4px;font:600 10.5px monospace;color:var(--text-muted);border:1px solid #e2e8f0;">
              DRAG TO ORBIT · WHEEL TO ZOOM · CLICK SUBSYSTEM TO INSPECT
            </div>
          </div>

          <div style="display:flex;gap:6px;padding:10px 14px;background:#f8fafc;border-top:1px solid var(--border-color);flex-wrap:wrap;align-items:center;">
            <button class="btn-ctrl ${digitalTwin.exploded ? 'primary' : ''}" onclick="digitalTwin.exploded = !digitalTwin.exploded; render();">Exploded view</button>
            <button class="btn-ctrl ${digitalTwin.xray ? 'primary' : ''}" onclick="digitalTwin.xray = !digitalTwin.xray; render();">X-Ray hull</button>
            <button class="btn-ctrl" onclick="digitalTwin.zoom = Math.min(2.4, digitalTwin.zoom + 0.15); render();">Zoom +</button>
            <button class="btn-ctrl" onclick="digitalTwin.zoom = Math.max(0.65, digitalTwin.zoom - 0.15); render();">Zoom −</button>
            <button class="btn-ctrl" onclick="Object.assign(digitalTwin, {yaw:-0.68, pitch:0.38, zoom:1.05, exploded:false, xray:false}); render();">Reset camera</button>
          </div>
        </div>

        <!-- Subsystems & Engineering Specifications Inspector -->
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div class="card-panel">
            <h3 style="font-size:13px;color:var(--navy-heading);margin-bottom:8px;">Subsystems & payload components</h3>
            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:12px;">
              ${Object.keys(partInfo).map(k => `
                <button class="btn-sm-action ${selected === k ? 'primary' : ''}" onclick="selectTwinPart('${k}')" style="font-size:11px;">${k}</button>
              `).join('')}
            </div>

            <!-- Active Subsystem Engineering Card -->
            <div style="background:#f8fafc;padding:12px;border-radius:6px;border:1px solid #e2e8f0;margin-bottom:12px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <h4 style="font-size:13px;color:var(--navy-heading);font-weight:700;">${info.title}</h4>
                <span class="badge-blue" style="font-size:10px;">Hardware Subsystem</span>
              </div>
              <div style="font-size:11.5px;color:var(--text-muted);white-space:pre-line;line-height:1.5;margin-bottom:10px;">${info.spec}</div>

              <!-- Live Connected Telemetry & Mechanism Readings -->
              <h5 style="font-size:11px;color:var(--navy-heading);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Connected live telemetry (Simulated telemetry)</h5>
              <div class="telemetry-bars-grid" style="grid-template-columns:1fr;gap:4px;">
                ${readings.map(r => `
                  <div class="stat-item-row" style="background:#ffffff;padding:4px 8px;border-radius:4px;border:1px solid #e2e8f0;">
                    <span style="font-size:11px;color:var(--text-dim);">${r.label}</span>
                    <b style="font-size:11.5px;color:var(--navy-heading);">${r.value}</b>
                  </div>
                `).join('')}
              </div>
            </div>

            <button class="btn-ctrl primary" style="width:100%;justify-content:center;font-size:11.5px;" onclick="setDigitalTwinMode('operate')">
              Place equipment in reservoir mission →
            </button>
          </div>
        </div>
      </div>
    ` : `
      <!-- 2. OPERATE MISSION (Live Reservoir Deployment with Camera Presets & Navigation Map) -->
      <div style="display:grid;grid-template-columns:1.8fr 1fr;gap:14px;align-items:start;">
        <div class="card-panel" style="padding:0;overflow:hidden;position:relative;">
          <div style="position:relative;height:520px;">
            <canvas id="twin-canvas" style="width:100%;height:100%;display:block;touch-action:none;"></canvas>

            <!-- Camera Presets Overlay -->
            <div class="map-3d-toolbar large" style="top:12px;left:12px;right:auto;">
              <span style="font-size:10px;font-weight:700;color:#94a3b8;align-self:center;padding:0 4px;">CAMERA PRESETS:</span>
              <button class="map-3d-btn ${digitalTwin.preset === 'surface' ? 'active' : ''}" onclick="setDigitalTwinPreset('surface')">Surface boat</button>
              <button class="map-3d-btn ${digitalTwin.preset === 'winch' ? 'active' : ''}" onclick="setDigitalTwinPreset('winch')">Stern winch</button>
              <button class="map-3d-btn ${digitalTwin.preset === 'rov' ? 'active' : ''}" onclick="setDigitalTwinPreset('rov')">Underwater ROV</button>
            </div>

            <!-- Integrated Reservoir Mini-Map in bottom-right corner -->
            <div style="position:absolute;bottom:12px;right:12px;width:240px;height:160px;background:rgba(15,23,42,0.85);backdrop-filter:blur(6px);border-radius:8px;border:1px solid rgba(56,189,248,0.3);overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.35);">
              <div style="padding:4px 8px;background:rgba(0,0,0,0.4);display:flex;justify-content:space-between;align-items:center;">
                <span style="font:700 9px -apple-system,system-ui;color:#38bdf8;">RESERVOIR SECTOR A MAP</span>
                <button class="btn-sm-action" style="padding:1px 5px;font-size:9px;" onclick="go(2)">Full map →</button>
              </div>
              <div style="width:100%;height:135px;">
                ${renderReservoirMap2D()}
              </div>
            </div>
          </div>

          <!-- Mission Operator Control Bar -->
          <div style="display:flex;gap:8px;padding:10px 14px;background:#f8fafc;border-top:1px solid var(--border-color);flex-wrap:wrap;align-items:center;justify-content:space-between;">
            <div style="display:flex;gap:6px;align-items:center;">
              <button class="btn-ctrl primary" onclick="togglePlay()">${running ? 'Pause survey' : 'Start survey'}</button>
              <button class="btn-ctrl" onclick="stepForward()">Single step</button>
              <button class="btn-ctrl" onclick="toggleROVDeployment()">${s.rov.state === 'Docked' ? 'Deploy ROV' : 'Recover ROV'}</button>
            </div>
            <div style="display:flex;gap:8px;align-items:center;font-size:11px;color:var(--text-muted);">
              <span>Speed: <b>${running ? '1.2 m/s' : '0.0 m/s'}</b></span>
              <span>·</span>
              <span>ROV: <b style="color:${s.rov.state === 'Docked' ? 'var(--text-dim)' : 'var(--status-green)'};">${s.rov.state}</b></span>
            </div>
          </div>
        </div>

        <!-- Right Side: Live Mechanism Telemetry & Hotspot Action -->
        <div style="display:flex;flex-direction:column;gap:12px;">
          <!-- Mechanism Telemetry Card -->
          <div class="card-panel">
            <h3 style="font-size:13px;color:var(--navy-heading);margin-bottom:8px;">Live mechanism & sensor state</h3>
            <div style="display:flex;flex-direction:column;gap:6px;font-size:11.5px;">
              <div class="stat-item-row" style="background:#f8fafc;padding:5px 8px;border-radius:4px;border:1px solid #e2e8f0;">
                <span>Vessel position</span>
                <b>${formatCoords(gridToGeo(s.pos.x, s.pos.y).lat, gridToGeo(s.pos.x, s.pos.y).lon)}</b>
              </div>
              <div class="stat-item-row" style="background:#f8fafc;padding:5px 8px;border-radius:4px;border:1px solid #e2e8f0;">
                <span>Water column depth</span>
                <b>${waterDepth(s.pos).toFixed(2)} m</b>
              </div>
              <div class="stat-item-row" style="background:#f8fafc;padding:5px 8px;border-radius:4px;border:1px solid #e2e8f0;">
                <span>Measured sediment</span>
                <b style="color:${(s.latest ? s.latest.value : 0.58) >= 1.4 ? '#dc2626' : '#d97706'};">${(s.latest ? s.latest.value : 0.58).toFixed(2)} m</b>
              </div>
              <div class="stat-item-row" style="background:#f8fafc;padding:5px 8px;border-radius:4px;border:1px solid #e2e8f0;">
                <span>Winch drum state</span>
                <b>${s.rov.state === 'Deploying' ? 'Rotating (Paying out)' : s.rov.state === 'Recovering' ? 'Rotating (Reeling in)' : s.rov.state === 'Inspecting' ? 'Holding Station' : 'Secured (Docked)'}</b>
              </div>
              <div class="stat-item-row" style="background:#f8fafc;padding:5px 8px;border-radius:4px;border:1px solid #e2e8f0;">
                <span>Drum angle</span>
                <b>${((s.rov.tetherLength / 0.08) * 180 / Math.PI % 360).toFixed(0)}°</b>
              </div>
              <div class="stat-item-row" style="background:#f8fafc;padding:5px 8px;border-radius:4px;border:1px solid #e2e8f0;">
                <span>Tether payout</span>
                <b>${s.rov.tetherLength.toFixed(1)} m</b>
              </div>
              <div class="stat-item-row" style="background:#f8fafc;padding:5px 8px;border-radius:4px;border:1px solid #e2e8f0;">
                <span>ROV depth</span>
                <b>${s.rov.depth.toFixed(2)} m</b>
              </div>
              <div class="stat-item-row" style="background:#f8fafc;padding:5px 8px;border-radius:4px;border:1px solid #e2e8f0;">
                <span>Clearance above bed</span>
                <b style="color:var(--status-green);">${Math.max(0, (s.latest ? s.latest.seabedDepth : waterDepth(s.pos)) - s.rov.depth).toFixed(2)} m</b>
              </div>
            </div>
          </div>

          <!-- Hotspot & Investigation Card -->
          <div class="card-panel">
            <h3 style="font-size:13px;color:var(--navy-heading);margin-bottom:8px;">Hotspot investigation</h3>
            ${(() => {
              const peakSample = s.samples.reduce((a, b) => (!a || b.value > a.value ? b : a), null);
              const criticalAlert = s.alerts.find(a => a.type === 'sediment');
              if (criticalAlert) {
                return `
                  <div style="background:#fef2f2;border:1px solid #fecaca;padding:10px;border-radius:6px;margin-bottom:10px;">
                    <div style="display:flex;gap:6px;align-items:center;color:#dc2626;font-weight:700;font-size:11.5px;margin-bottom:4px;">
                      <span class="status-indicator-dot" style="background:#dc2626;"></span>
                      ${criticalAlert.title}
                    </div>
                    <p style="font-size:11px;color:#991b1b;margin-bottom:8px;">${criticalAlert.message}</p>
                    <button class="btn-ctrl primary" style="width:100%;justify-content:center;font-size:11px;" onclick="deployROVAtStation(${criticalAlert.pos.x}, ${criticalAlert.pos.y})">
                      Approve ROV inspection at ${criticalAlert.stationId} →
                    </button>
                  </div>
                `;
              } else if (peakSample) {
                return `
                  <p style="font-size:11.5px;color:var(--text-muted);margin-bottom:8px;">Peak sounded station ${peakSample.stationId}: <b>${peakSample.value.toFixed(2)} m</b> sediment.</p>
                  <button class="btn-ctrl" style="width:100%;justify-content:center;font-size:11px;" onclick="deployROVAtStation(${peakSample.x}, ${peakSample.y})">
                    Inspect station with ROV →
                  </button>
                `;
              } else {
                return `<p style="font-size:11.5px;color:var(--text-muted);">Start survey to acquire soundings and identify sedimentation hotspots.</p>`;
              }
            })()}
          </div>
        </div>
      </div>
    `}
  `;
}

// Legacy alias
const renderVesselLab = renderDigitalTwin;

// -------------------------------------------------------------
// Core UI Render Orchestrator
// -------------------------------------------------------------
function render() {
  // Update sidebar navigation pills with outline SVG icons
  $('nav').innerHTML = pages.map((p, i) => `
    <button class="${i === page ? 'active' : ''}" onclick="go(${i})">
      ${navIcons[i]}
      <span>${p}</span>
    </button>
  `).join('');

  updateBell();

  // Render view for the active page
  let html = '';
  if (page === 0) html = renderHome();
  else if (page === 1) html = renderLiveMonitoring();
  else if (page === 2) html = renderMapPage();
  else if (page === 3) html = renderWaterAnalysis();
  else if (page === 4) html = renderSurfaceAnalysis();
  else if (page === 5) html = renderSedimentAnalysis();
  else if (page === 6) html = renderFishEcosystem();
  else if (page === 7) html = renderReports();
  else if (page === 8) html = renderAlertsPage();
  else if (page === 9) html = renderSettings();
  else if (page === 10) html = renderDigitalTwin();

  $('content').innerHTML = html;

  // Bind canvases
  bindBoat();
  bindReservoir3D();

  // Draw Camera Feeds if present on this view
  const surfCanvas = $('surf-cam-canvas');
  if (surfCanvas) drawSurfaceCamera(surfCanvas);
  const underCanvas = $('under-cam-canvas');
  if (underCanvas && s.rov.state !== 'Docked') drawUnderwaterCamera(underCanvas);

  // Draw Mini-ROV canvas on Home System Status
  const rovC = $('rov-canvas');
  if (rovC) drawROV(rovC, s.rov.state);
}

// -------------------------------------------------------------
// Search Bar Functionality
// -------------------------------------------------------------
const searchCatalog = [
  { term: 'Home Dashboard', page: 0 },
  { term: 'Live Monitoring', page: 1 },
  { term: 'Surface Catamaran ASV-01', page: 1 },
  { term: 'Mini-ROV Submerged Telemetry', page: 1 },
  { term: 'Map & Navigation (2D/3D)', page: 2 },
  { term: 'Reservoir Intake Location', page: 2 },
  { term: 'Water Analysis', page: 3 },
  { term: 'pH Level Parameter', page: 3 },
  { term: 'Dissolved Oxygen (DO)', page: 3 },
  { term: 'Water Temperature', page: 3 },
  { term: 'Conductivity & TDS', page: 3 },
  { term: 'Turbidity & Clarity', page: 3 },
  { term: 'Nitrate & Ammonia', page: 3 },
  { term: 'Surface Analysis & Wave Chop', page: 4 },
  { term: 'Shoreline Camera Observations', page: 4 },
  { term: 'Sediment Analysis & Sonar', page: 5 },
  { term: 'Dual Echo 200/33 kHz Traces', page: 5 },
  { term: 'Core Verification & Hotspots', page: 5 },
  { term: 'Fish & Ecosystem Integrity', page: 6 },
  { term: 'Mission Reports & Audit Log', page: 7 },
  { term: 'Export Survey JSON Report', page: 7 },
  { term: 'Alerts & Critical Warnings', page: 8 },
  { term: 'Settings & Demonstration Thresholds', page: 9 },
  { term: '3D Vessel Lab & Hardware Twin', page: 10 }
];

const searchInput = $('search');
const datalist = $('search-datalist');
if (datalist) {
  datalist.innerHTML = searchCatalog.map(item => `<option value="${item.term}">`).join('');
}

function handleSearch() {
  const val = searchInput.value.trim().toLowerCase();
  if (!val) return;
  const match = searchCatalog.find(item => item.term.toLowerCase().includes(val));
  if (match) {
    go(match.page);
    searchInput.value = '';
  } else {
    const pageIdx = pages.findIndex(p => p.toLowerCase().includes(val));
    if (pageIdx >= 0) {
      go(pageIdx);
      searchInput.value = '';
    }
  }
}

if (searchInput) {
  searchInput.onchange = handleSearch;
  searchInput.onkeydown = e => { if (e.key === 'Enter') handleSearch(); };
}

// Handle browser URL hash changes
function handleRoute() {
  const n = Number(location.hash.slice(1));
  page = Number.isInteger(n) && n >= 0 && n < pages.length ? n : 0;
  render();
}

window.onhashchange = handleRoute;
window.addEventListener('resize', () => {
  bindBoat();
  bindReservoir3D();
  const surfCanvas = $('surf-cam-canvas');
  if (surfCanvas) drawSurfaceCamera(surfCanvas);
  const underCanvas = $('under-cam-canvas');
  if (underCanvas && s.rov.state !== 'Docked') drawUnderwaterCamera(underCanvas);
});

// Initial boot
handleRoute();
