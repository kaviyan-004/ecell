'use strict';

// -------------------------------------------------------------
// AquaSentinel Digital Twin & 3D Visualization Engine
// Autonomous Surface Vessel (Catamaran ASV-01)
// Tethered Underwater Mini-ROV (Aquanaut-IV)
// Multi-Subsystem Engineering Inspector & Operational Twin
// -------------------------------------------------------------

// =============================================================
// 1. SUBSYSTEM SPECIFICATIONS & LIVE TELEMETRY SCHEMA
// =============================================================

const partInfo = {
  Hulls: {
    title: 'Twin High-Density Polyethylene (HDPE) Hulls',
    spec: 'Dimensions: 4.80 m L × 0.45 m W × 0.65 m H (Assumed illustrative)\nDisplacement: 185 kg · Operating Draft: 0.18 m\nMaterial: Rotomolded UV-stabilized marine HDPE\nHydrodynamic Form: Asymmetric catamaran demi-hulls with wave-piercing bow entries to suppress pitch oscillations in reservoir chop.',
    getReadings: (s) => [
      { label: 'Surface Speed', value: `${s.boat.speed.toFixed(1)} m/s (${(s.boat.speed * 1.944).toFixed(1)} kts)` },
      { label: 'Vessel Heading', value: `${s.heading}° (True North)` },
      { label: 'Operating State', value: s.boat.state }
    ]
  },
  Propulsion: {
    title: 'Dual Stern Electric Propulsion System',
    spec: 'Motors: Dual 24V DC brushless underwater thrusters (1.2 kW total)\nConfiguration: Stern-mounted with hydrofoil Kort nozzles\nSteering: Rudderless differential thrust vectoring\nPropellers: 3-blade nickel-aluminium bronze counter-rotating props.',
    getReadings: (s) => [
      { label: 'Thrust Output', value: s.boat.speed > 0 ? '42% Forward (85 N)' : '0% (Stationary holding)' },
      { label: 'Steering Vector', value: `${s.heading}° active heading` },
      { label: 'Motor Voltage', value: '24.2 V DC' }
    ]
  },
  Deck: {
    title: 'Marine Anodized Aluminium Crossbeam Deck',
    spec: 'Frame: 6061-T6 structural aluminium box crossbeams (Assumed illustrative)\nFasteners: 316 stainless steel with galvanic isolation bushings\nPayload Capacity: 65 kg scientific instrumentation\nDeck Platform: Perforated non-skid polypropylene mesh.',
    getReadings: (s) => [
      { label: 'Structural Payload', value: '42.5 kg active' },
      { label: 'Beam Overall', value: '1.96 m crossbeam span' }
    ]
  },
  Enclosure: {
    title: 'Central IP67 Electronics Bay & Avionics Enclosure',
    spec: 'Enclosure: Die-cast aluminium enclosure with dual silicone O-ring seals\nAvionics: Embedded Linux survey autopilot with RTK-GNSS receiver\nTelemetry: 868 MHz long-range LoRa link & 5 GHz Wi-Fi mission offload\nPower Distribution: 24V 40Ah LiFePO4 battery pack (960 Wh).',
    getReadings: (s) => [
      { label: 'Battery Capacity', value: `${s.boat.battery}% (LiFePO4)` },
      { label: 'Internal Temp', value: '28.4 °C (Nominal)' },
      { label: 'Telemetry Link', value: `${s.boat.signal} (-68 dBm)` }
    ]
  },
  Solar: {
    title: '180W Monocrystalline Photovoltaic Array',
    spec: 'Array: 6×4 monocrystalline silicon cells laminated under ETFE\nPeak Output: 180W @ 21.6V Voc\nCharge Controller: Dual MPPT with 98% tracking efficiency\nTilt: Flush-deck mounted with self-cleaning hydrophobic coating.',
    getReadings: (s) => [
      { label: 'Instantaneous Solar', value: `${s.boat.solarWatts} W` },
      { label: 'Solar Controller', value: 'MPPT Bulk Charging' }
    ]
  },
  Navigation: {
    title: 'Dual-Band RTK-GNSS & 9-DOF IMU Compass Mast',
    spec: 'GNSS: Multi-constellation L1/L2 RTK receiver (GPS, GLONASS, Galileo)\nPosition Accuracy: Sub-meter RTK fixed fix (< 0.05 m horizontal)\nHeading Reference: Dual-antenna baseline + 9-DOF MEMS IMU (0.2° RMS)\nElevation: 1.15 m mast clearance above waterline.',
    getReadings: (s) => [
      { label: 'GNSS Status', value: s.boat.gnssStatus },
      { label: 'Geotag Position', value: formatCoords(gridToGeo(s.pos.x, s.pos.y).lat, gridToGeo(s.pos.x, s.pos.y).lon) },
      { label: 'HDOP', value: '0.82 (Fixed)' }
    ]
  },
  'Sonar-200kHz': {
    title: '200 kHz High-Frequency Bathymetric Transducer',
    spec: 'Acoustic Frequency: 200 kHz (Narrow-beam seabed sounded)\nBeam Pattern: 8° conical beam (-3 dB)\nMounting: Port keel acoustic pod below waterline (Draft: -0.25 m)\nFunction: Precise upper boundary water column depth and seabed detection.',
    getReadings: (s) => [
      { label: 'Operating Frequency', value: '200 kHz (Narrow-beam)' },
      { label: 'Seabed Return Depth', value: `${(s.latest ? s.latest.seabedDepth : waterDepth(s.pos)).toFixed(2)} m` },
      { label: 'Pulse Repetition', value: '10 Hz (Ping Interval 100 ms)' }
    ]
  },
  'Sonar-33kHz': {
    title: '33 kHz Low-Frequency Sub-Bottom Penetrating Transducer',
    spec: 'Acoustic Frequency: 33 kHz (Low-frequency chirp penetration)\nBeam Pattern: 24° wide-beam\nMounting: Starboard keel acoustic pod below waterline (Draft: -0.25 m)\nFunction: Acoustic penetration through soft sediment to detect hard acoustic basement.',
    getReadings: (s) => [
      { label: 'Operating Frequency', value: '33 kHz (Penetrating)' },
      { label: 'Sub-Bottom Reflector', value: `${(s.latest ? s.latest.basementDepth : waterDepth(s.pos) + terrain(s.pos, s.scenario)).toFixed(2)} m` },
      { label: 'Acoustic Sediment', value: `${(s.latest ? s.latest.value : terrain(s.pos, s.scenario)).toFixed(2)} m` },
      { label: 'Classification', value: s.latest ? s.latest.classification : 'Soft Sediment' }
    ]
  },
  Winch: {
    title: 'Automated Stern Umbilical Winch Mechanism',
    spec: 'Drive: 24V planetary geared electric motor with dynamic brake\nDrum: Cylindrical aluminium spool (R = 0.08 m, Assumed illustrative)\nCable Guide: Diamond-screw level-wind fairlead with tension sensor\nUmbilical: 15.0 m Kevlar-reinforced polyurethane jacketed tether\nCradle: Stern twin-arm latching cradle with inductive proximity sensors.',
    getReadings: (s) => [
      { label: 'Drum State', value: s.rov.state === 'Deploying' ? 'Rotating (Paying out)' : s.rov.state === 'Recovering' ? 'Rotating (Reeling in)' : s.rov.state === 'Inspecting' ? 'Holding Station' : 'Secured (Docked)' },
      { label: 'Drum Rotation', value: `${((s.rov.tetherLength / 0.08) * 180 / Math.PI % 360).toFixed(0)}° (Angle)` },
      { label: 'Cable Payout', value: `${s.rov.tetherLength.toFixed(1)} m / 15.0 m max` },
      { label: 'Line Tension', value: s.rov.state === 'Docked' ? '0 N' : `${(18 + s.rov.depth * 2.2).toFixed(1)} N` }
    ]
  },
  ROV: {
    title: 'Aquanaut-IV Tethered Underwater Mini-ROV',
    spec: 'Frame: Lightweight marine aluminium exoskeleton with HDPE fairing\nThrusters: 6× magnetic coupling thrusters (4 horizontal vectored, 2 vertical)\nCamera Dome: Optical acrylic hemispherical dome (1080p 30fps Sony sensor)\nIllumination: Dual 1200-lumen high-CRI forward LED spotlights\nTether Port: Top stern wet-mate bulkhead connector.',
    getReadings: (s) => [
      { label: 'Operating State', value: s.rov.state },
      { label: 'Current Depth', value: `${s.rov.depth.toFixed(2)} m` },
      { label: 'Clearance Above Bed', value: `${Math.max(0, (s.latest ? s.latest.seabedDepth : waterDepth(s.pos)) - s.rov.depth).toFixed(2)} m` },
      { label: 'Tether Length Out', value: `${s.rov.tetherLength.toFixed(1)} m` }
    ]
  }
};

// =============================================================
// 2. 3D DIGITAL TWIN STATE & CAMERA CONTROLS
// =============================================================

const digitalTwin = {
  mode: 'inspect', // 'inspect' | 'operate'
  preset: 'surface', // 'surface' | 'winch' | 'rov'
  selectedPart: 'Winch',
  exploded: false,
  xray: false,
  yaw: -0.68,
  pitch: 0.38,
  zoom: 1.05,
  presets: {
    surface: { yaw: -0.68, pitch: 0.38, zoom: 1.05 },
    winch:   { yaw: -2.35, pitch: 0.45, zoom: 1.85 },
    rov:     { yaw: -0.60, pitch: 0.28, zoom: 1.55 }
  }
};

// Backward-compatible camera object for legacy bindings
const camera = {
  get yaw() { return digitalTwin.yaw; },
  set yaw(v) { digitalTwin.yaw = v; },
  get pitch() { return digitalTwin.pitch; },
  set pitch(v) { digitalTwin.pitch = v; },
  get zoom() { return digitalTwin.zoom; },
  set zoom(v) { digitalTwin.zoom = v; },
  get exploded() { return digitalTwin.exploded; },
  set exploded(v) { digitalTwin.exploded = v; },
  get xray() { return digitalTwin.xray; },
  set xray(v) { digitalTwin.xray = v; },
  get selected() { return digitalTwin.selectedPart; },
  set selected(v) { digitalTwin.selectedPart = v; }
};

function setDigitalTwinMode(m) {
  digitalTwin.mode = m;
  if (m === 'operate') {
    setDigitalTwinPreset(digitalTwin.preset || 'surface');
  } else {
    digitalTwin.yaw = -0.68;
    digitalTwin.pitch = 0.38;
    digitalTwin.zoom = 1.05;
  }
  if (typeof render === 'function') render();
}

function setDigitalTwinPreset(p) {
  digitalTwin.preset = p;
  if (digitalTwin.presets[p]) {
    digitalTwin.yaw = digitalTwin.presets[p].yaw;
    digitalTwin.pitch = digitalTwin.presets[p].pitch;
    digitalTwin.zoom = digitalTwin.presets[p].zoom;
  }
  const c = document.getElementById('twin-canvas') || document.getElementById('boat');
  if (c && typeof s !== 'undefined') drawDigitalTwin(c, s);
  if (typeof render === 'function') render();
}

function selectTwinPart(p) {
  digitalTwin.selectedPart = p;
  const c = document.getElementById('twin-canvas') || document.getElementById('boat');
  if (c && typeof s !== 'undefined') drawDigitalTwin(c, s);
  if (typeof render === 'function') render();
}

// =============================================================
// 3. COMPLETE 3D APPARATUS MESH GENERATOR
// =============================================================

function createDigitalTwinMesh() {
  const faces = [];

  function solid(rings, group, colors) {
    const n = rings[0].length;
    faces.push({ v: rings[0], group, color: colors[0] }, { v: rings[1], group, color: colors[1] });
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      faces.push({
        v: [rings[0][i], rings[0][j], rings[1][j], rings[1][i]],
        group,
        color: colors[2 + i % (colors.length - 2)]
      });
    }
  }

  function box(x, y, z, l, h, w, g, c) {
    solid([y, y + h].map(v => [[x, v, z], [x + l, v, z], [x + l, v, z + w], [x, v, z + w]]), g, c);
  }

  // Material Palettes
  const yellow = ['#eab308', '#facc15', '#ca8a04', '#eab308'];
  const darkNavy = ['#0c1e33', '#1b3452', '#14283d', '#23446b'];
  const alumWhite = ['#e2e8f0', '#ffffff', '#cbd5e1', '#94a3b8'];
  const darkSlate = ['#0f172a', '#1e293b', '#334155', '#475569'];
  const solarBlue = ['#1e3a8a', '#2563eb', '#1d4ed8', '#1e40af'];
  const orangeWinch = ['#f59e0b', '#fbbf24', '#d97706', '#b45309'];
  const sonarCyan = ['#0284c7', '#38bdf8', '#0369a1', '#075985'];
  const thrusterBronze = ['#78350f', '#92400e', '#451a03', '#b45309'];

  // 1. TWIN HULLS (Port: z=-0.98, Starboard: z=+0.98)
  for (const z of [-0.98, 0.98]) {
    const outline = [[-2.30, -0.25], [1.55, -0.28], [2.52, 0], [1.55, 0.28], [-2.30, 0.25]];
    for (const [low, high, palette] of [[-0.38, 0.02, darkSlate], [0.02, 0.32, yellow], [0.32, 0.40, darkNavy]]) {
      solid([low, high].map(y => outline.map(([x, d]) => [x, y, z + d])), 'Hulls', palette);
    }
    // Stern hydrodynamic transom wedge
    box(-2.45, -0.28, z - 0.12, 0.28, 0.26, 0.24, 'Hulls', darkSlate);
  }

  // 2. STERN PROPULSION (Dual electric thrusters with Kort nozzles)
  for (const z of [-0.98, 0.98]) {
    // Mounting bracket from transom
    box(-2.62, -0.18, z - 0.04, 0.18, 0.16, 0.08, 'Propulsion', darkSlate);
    // Cylindrical motor body
    box(-2.82, -0.22, z - 0.10, 0.22, 0.14, 0.20, 'Propulsion', darkNavy);
    // Kort nozzle shroud
    box(-2.95, -0.25, z - 0.14, 0.14, 0.20, 0.28, 'Propulsion', darkSlate);
    // Bronze propeller blades
    box(-2.90, -0.20, z - 0.08, 0.04, 0.12, 0.16, 'Propulsion', thrusterBronze);
  }

  // 3. ANODIZED ALUMINIUM DECK CROSSBEAMS
  for (const x of [-1.75, -0.25, 1.35]) {
    box(x, 0.36, -1.22, 0.24, 0.18, 2.44, 'Deck', alumWhite);
  }
  // Central scientific equipment payload platform
  box(-1.82, 0.50, -0.88, 3.48, 0.14, 1.76, 'Deck', darkNavy);

  // 4. CENTRAL ELECTRONICS ENCLOSURE / PAYLOAD BAY
  box(-0.82, 0.64, -0.72, 1.78, 0.34, 1.44, 'Enclosure', darkSlate);
  box(-0.76, 0.98, -0.66, 1.66, 0.06, 1.32, 'Enclosure', alumWhite);

  // 5. 180W MONOCRYSTALLINE SOLAR ARRAY
  box(-0.72, 1.04, -0.62, 1.58, 0.03, 1.24, 'Solar', darkSlate);
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 4; j++) {
      box(-0.70 + i * 0.26, 1.065, -0.60 + j * 0.305, 0.245, 0.015, 0.285, 'Solar', solarBlue);
    }
  }

  // 6. POSITIONING MAST & RTK-GNSS RADOME
  box(0.98, 0.65, -0.18, 0.38, 0.24, 0.36, 'Navigation', yellow);
  box(1.12, 0.88, -0.04, 0.08, 0.95, 0.08, 'Navigation', alumWhite);
  // Cylindrical RTK antenna radome & compass dome
  box(0.96, 1.82, -0.16, 0.40, 0.12, 0.32, 'Navigation', alumWhite);

  // 7. DOWNWARD-FACING SONAR TRANSDUCERS (Under-hull below waterline)
  // Acoustic pod keel casing
  box(0.18, -0.38, -0.32, 0.54, 0.36, 0.64, 'Hulls', darkNavy);
  // Transducer 1: 200 kHz Narrow-beam (Port keel pod)
  box(0.25, -0.44, -0.24, 0.20, 0.08, 0.20, 'Sonar-200kHz', sonarCyan);
  // Transducer 2: 33 kHz Sub-bottom Penetrating (Starboard keel pod)
  box(0.25, -0.44, 0.04, 0.20, 0.08, 0.20, 'Sonar-33kHz', orangeWinch);

  // 8. STERN WINCH, DRUM, LEVEL-WIND GUIDE & ROV CRADLE
  // Winch side frames
  box(-1.62, 0.64, -0.30, 0.58, 0.34, 0.60, 'Winch', darkSlate);
  for (const z of [-0.30, 0.22]) {
    box(-1.60, 0.82, z, 0.52, 0.38, 0.08, 'Winch', yellow);
  }
  // Rotating cylindrical drum with orange spooled cable
  box(-1.50, 0.92, -0.22, 0.36, 0.20, 0.44, 'Winch', orangeWinch);
  // Cable guide roller / level-wind fairlead
  box(-1.38, 0.74, -0.06, 0.12, 0.12, 0.12, 'Winch', alumWhite);
  // Stern ROV cradle arms
  box(-2.15, 0.46, -0.44, 0.55, 0.12, 0.10, 'Winch', darkSlate);
  box(-2.15, 0.46, 0.34, 0.55, 0.12, 0.10, 'Winch', darkSlate);

  // 9. COMPACT UNDERWATER MINI-ROV (Aquanaut-IV)
  // When modeled in assembly: sits secured in the stern cradle [-1.90, 0.58, 0.0]
  const rx = -1.90, ry = 0.58, rz = 0.0;
  // Protective yellow tubular frame
  box(rx - 0.28, ry - 0.14, rz - 0.22, 0.56, 0.28, 0.44, 'ROV', yellow);
  // Dark pressure enclosure body
  box(rx - 0.22, ry - 0.10, rz - 0.16, 0.44, 0.20, 0.32, 'ROV', darkSlate);
  // Front clear acrylic camera dome
  box(rx + 0.24, ry - 0.06, rz - 0.10, 0.08, 0.12, 0.20, 'ROV', sonarCyan);
  // Dual LED floodlight housings
  box(rx + 0.22, ry + 0.06, rz - 0.18, 0.08, 0.06, 0.08, 'ROV', alumWhite);
  box(rx + 0.22, ry + 0.06, rz + 0.10, 0.08, 0.06, 0.08, 'ROV', alumWhite);
  // 4 Horizontal vectored thrusters + 2 vertical thrusters
  for (const tz of [-0.26, 0.20]) {
    box(rx - 0.24, ry - 0.12, tz, 0.16, 0.08, 0.06, 'ROV', darkNavy);
    box(rx + 0.08, ry - 0.12, tz, 0.16, 0.08, 0.06, 'ROV', darkNavy);
  }
  box(rx - 0.08, ry + 0.12, rz - 0.04, 0.16, 0.08, 0.08, 'ROV', darkNavy);
  // Tether termination socket on ROV top
  box(rx - 0.14, ry + 0.12, rz - 0.04, 0.08, 0.06, 0.08, 'ROV', orangeWinch);

  return faces;
}

const digitalTwinFaces = createDigitalTwinMesh();
const boatFaces = digitalTwinFaces; // Shared 100% consistent geometry across app
let twinHitFaces = [];

// =============================================================
// 4. DIGITAL TWIN CANVAS RENDERER (INSPECT & OPERATE MODES)
// =============================================================

function drawDigitalTwin(canvas, mission) {
  if (!canvas) return;
  const sRef = (typeof s !== 'undefined') ? s : mission;
  if (!sRef) return;

  const r = canvas.getBoundingClientRect();
  const w = Math.max(300, r.width || 600);
  const h = Math.max(200, r.height || 420);
  const d = Math.min(2, window.devicePixelRatio || 1);

  if (canvas.width !== Math.floor(w * d) || canvas.height !== Math.floor(h * d)) {
    canvas.width = Math.floor(w * d);
    canvas.height = Math.floor(h * d);
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.save();
  ctx.scale(d, d);

  const isOperate = (digitalTwin.mode === 'operate');
  const yaw = digitalTwin.yaw;
  const pitch = digitalTwin.pitch;
  const zoom = digitalTwin.zoom;
  const selected = digitalTwin.selectedPart;
  const timeSec = Date.now() * 0.002;

  // Winch drum angle derived from tether payout
  const drumRadius = 0.08; // 8 cm radius (Illustrative)
  const drumAngle = (sRef.rov.tetherLength / drumRadius);

  // 1. BACKGROUND ENVIRONMENT
  if (isOperate) {
    // Reservoir Daylight Environment
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.52);
    skyGrad.addColorStop(0, '#7dd3fc');
    skyGrad.addColorStop(1, '#bae6fd');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h * 0.52);

    const waterGrad = ctx.createLinearGradient(0, h * 0.48, 0, h);
    waterGrad.addColorStop(0, '#0284c7');
    waterGrad.addColorStop(0.5, '#075985');
    waterGrad.addColorStop(1, '#082f49');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, h * 0.48, w, h * 0.52);

    // Distant Shoreline
    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.50);
    ctx.quadraticCurveTo(w * 0.3, h * 0.44, w * 0.65, h * 0.48);
    ctx.quadraticCurveTo(w * 0.85, h * 0.43, w, h * 0.50);
    ctx.lineTo(w, h * 0.52);
    ctx.lineTo(0, h * 0.52);
    ctx.closePath();
    ctx.fill();
  } else {
    // Neutral Engineering Studio (PowerGuard Style Slate Background)
    const bg = ctx.createRadialGradient(w * 0.5, h * 0.45, 40, w * 0.5, h * 0.5, w * 0.7);
    bg.addColorStop(0, '#f8fafc');
    bg.addColorStop(0.7, '#e2e8f0');
    bg.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }

  // 2. 3D PROJECTION MATRIX
  // Catamaran length is approx 5.4m. Scale calibrated for close three-quarter framing (~25-35% viewport)
  const baseScale = Math.min(w / 7.2, h / 4.8) * zoom;
  const originX = w * 0.5;
  const originY = isOperate && digitalTwin.preset === 'winch' ? h * 0.42 : h * 0.54;

  function project([x, y, z]) {
    const u = x * Math.cos(yaw) - z * Math.sin(yaw);
    const v = x * Math.sin(yaw) + z * Math.cos(yaw);
    return [
      originX + baseScale * u,
      originY + baseScale * (v * Math.sin(pitch) - y * Math.cos(pitch)),
      v * Math.cos(pitch) + y * Math.sin(pitch)
    ];
  }

  // 3. REFERENCE WATERLINE / GROUND PLANE
  if (!isOperate) {
    // Technical CAD Ground Grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = 0.8;
    for (let i = -6; i <= 6; i += 2) {
      const p1 = project([i, -0.45, -6]);
      const p2 = project([i, -0.45, 6]);
      ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke();
      const p3 = project([-6, -0.45, i]);
      const p4 = project([6, -0.45, i]);
      ctx.beginPath(); ctx.moveTo(p3[0], p3[1]); ctx.lineTo(p4[0], p4[1]); ctx.stroke();
    }
  } else {
    // Water Surface Ripples & Dynamic Wake
    const isMoving = sRef.boat.speed > 0;
    if (isMoving) {
      // Diverging foam wake behind hulls
      const wL1 = project([-2.45, 0, -0.98]);
      const wL2 = project([-5.5, 0, -2.2]);
      const wR1 = project([-2.45, 0, 0.98]);
      const wR2 = project([-5.5, 0, 2.2]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(wL1[0], wL1[1]); ctx.lineTo(wL2[0], wL2[1]);
      ctx.moveTo(wR1[0], wR1[1]); ctx.lineTo(wR2[0], wR2[1]);
      ctx.stroke();
    }
  }

  // 4. EXPLODED VIEW OFFSETS ALONG MOUNTING AXES
  const explodedOffsets = {
    Hulls: [0, 0, 0],
    Propulsion: [-0.65, 0, 0],
    Deck: [0, 0.40, 0],
    Enclosure: [0, 0.60, 0],
    Solar: [0, 1.10, 0],
    Navigation: [0, 0.85, 0],
    'Sonar-200kHz': [0, -0.55, 0],
    'Sonar-33kHz': [0, -0.55, 0],
    Winch: [-0.55, 0.45, 0],
    ROV: [-1.20, 0.20, 0]
  };

  // 5. PROJECT FACES & DEPTH SORTING
  const isExploded = (!isOperate && digitalTwin.exploded);
  const isXray = (!isOperate && digitalTwin.xray);

  const projectedFaces = digitalTwinFaces.map(f => {
    const off = isExploded ? explodedOffsets[f.group] || [0, 0, 0] : [0, 0, 0];
    const points = f.v.map(([x, y, z]) => project([x + off[0], y + off[1], z + off[2]]));
    const depth = points.reduce((acc, p) => acc + p[2], 0) / points.length;
    return { ...f, points, depth };
  }).sort((a, b) => a.depth - b.depth);

  twinHitFaces = projectedFaces;

  // 6. DRAW 3D FACES WITH PHYSICAL SHADING & HIGHLIGHTS
  for (const f of projectedFaces) {
    const isSelected = (selected === f.group);
    ctx.save();

    if (isXray && ['Hulls', 'Deck'].includes(f.group)) {
      ctx.globalAlpha = 0.22;
    } else {
      ctx.globalAlpha = 1.0;
    }

    ctx.fillStyle = isSelected ? '#0284c7' : f.color;
    ctx.strokeStyle = isSelected ? '#38bdf8' : (isOperate ? '#1e293b' : '#64748b');
    ctx.lineWidth = isSelected ? 2.0 : 0.7;

    ctx.beginPath();
    f.points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  // 7. WINCH DRUM ROTATING MECHANISM & CONTINUOUS TETHER
  const winchGuide = project(isExploded ? [-1.38 - 0.55, 0.74 + 0.45, 0] : [-1.38, 0.74, 0]);
  const isRovDeployed = (sRef.rov.state !== 'Docked');

  // Winch Drum Rotating Indicator Spokes (Visibly rotates with drumAngle)
  const drumCenter = project(isExploded ? [-1.50 - 0.55, 1.02 + 0.45, 0] : [-1.50, 1.02, 0]);
  ctx.save();
  ctx.translate(drumCenter[0], drumCenter[1]);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  for (let a = 0; a < 4; a++) {
    const ang = drumAngle + a * (Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(8 * Math.cos(ang), 8 * Math.sin(ang));
    ctx.stroke();
  }
  ctx.restore();

  // ROV Socket & Continuous Tether
  let rovSocketPt;
  if (!isRovDeployed) {
    // Docked in cradle
    rovSocketPt = project(isExploded ? [-1.90 - 1.20 - 0.14, 0.58 + 0.20 + 0.12, 0] : [-1.90 - 0.14, 0.58 + 0.12, 0]);
  } else {
    // Deployed underwater
    const vex = 2.0;
    const submergedY = -sRef.rov.depth * vex * 0.45;
    rovSocketPt = project([-1.90 - 0.8, submergedY, 0.2]);
  }

  // Draw continuous tether from winch fairlead to ROV socket
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(winchGuide[0], winchGuide[1]);
  if (!isRovDeployed) {
    ctx.lineTo(rovSocketPt[0], rovSocketPt[1]);
  } else {
    // Subtle catenary curve under water tension
    const midX = (winchGuide[0] + rovSocketPt[0]) * 0.5 - 12;
    const midY = (winchGuide[1] + rovSocketPt[1]) * 0.5 + 8;
    ctx.quadraticCurveTo(midX, midY, rovSocketPt[0], rovSocketPt[1]);
  }
  ctx.stroke();

  // 8. ACOUSTIC SOUNDING PULSE VISUALIZATION (Operate Mode)
  if (isOperate) {
    const p200 = project([0.25, -0.44, -0.24]);
    const p33 = project([0.25, -0.44, 0.04]);
    const pulseActive = sRef.boat.speed > 0 || isRovDeployed;

    if (pulseActive) {
      // 200 kHz Narrow-beam pulse
      const bBed = project([0.25, -2.4, -0.24]);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(p200[0], p200[1]);
      ctx.lineTo(bBed[0] - 14, bBed[1]);
      ctx.lineTo(bBed[0] + 14, bBed[1]);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 33 kHz Penetrating sub-bottom pulse
      const bBasement = project([0.25, -3.2, 0.04]);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
      ctx.beginPath();
      ctx.moveTo(p33[0], p33[1]);
      ctx.lineTo(bBasement[0] - 22, bBasement[1]);
      ctx.lineTo(bBasement[0] + 22, bBasement[1]);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  // 9. OVERLAY METADATA & TELEMETRY LABELS
  ctx.fillStyle = isOperate ? '#cbd5e1' : '#475569';
  ctx.font = '700 9.5px -apple-system, system-ui, sans-serif';
  ctx.fillText(isOperate ? 'OPERATE MISSION · 3D APPARATUS TWIN' : 'INSPECT EQUIPMENT · NEUTRAL ENGINEERING VIEW', 14, 18);

  ctx.fillStyle = isOperate ? '#94a3b8' : '#64748b';
  ctx.font = '600 8.5px monospace';
  const drumLabel = sRef.rov.state === 'Deploying' ? 'PAYING OUT' : sRef.rov.state === 'Recovering' ? 'REELING IN' : 'STATIONARY';
  ctx.fillText(`WINCH: ${drumLabel} · TETHER: ${sRef.rov.tetherLength.toFixed(1)} m · ROV: ${sRef.rov.state.toUpperCase()}`, 14, h - 12);

  ctx.restore();
}

// -------------------------------------------------------------
// Interactive Pointer & Event Binding for Digital Twin
// -------------------------------------------------------------
function bindDigitalTwin() {
  const c = document.getElementById('twin-canvas') || document.getElementById('boat');
  if (!c) return;

  drawDigitalTwin(c, s);

  let start = null, drag = false;
  c.onpointerdown = e => {
    start = [e.clientX, e.clientY];
    drag = false;
    c.setPointerCapture(e.pointerId);
  };

  c.onpointermove = e => {
    if (!start) return;
    const dx = e.clientX - start[0];
    const dy = e.clientY - start[1];
    if (dx || dy) {
      drag = true;
      digitalTwin.yaw += dx * 0.009;
      digitalTwin.pitch = Math.max(-0.45, Math.min(1.35, digitalTwin.pitch + dy * 0.007));
      start = [e.clientX, e.clientY];
      drawDigitalTwin(c, s);
    }
  };

  c.onpointerup = e => {
    if (!drag && digitalTwin.mode === 'inspect') {
      const rect = c.getBoundingClientRect();
      const ctx = c.getContext('2d');
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Reverse check front-to-back hit detection
      for (const f of [...twinHitFaces].reverse()) {
        const path = new Path2D();
        f.points.forEach(([px, py], i) => (i ? path.lineTo(px, py) : path.moveTo(px, py)));
        path.closePath();
        if (ctx.isPointInPath(path, x * (c.width / rect.width), y * (c.height / rect.height))) {
          selectTwinPart(f.group);
          break;
        }
      }
    }
    start = null;
  };

  c.onpointercancel = () => { start = null; };

  c.onwheel = e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    digitalTwin.zoom = Math.max(0.55, Math.min(2.5, digitalTwin.zoom + delta));
    drawDigitalTwin(c, s);
  };
}

// Legacy alias for existing boat bindings
function bindBoat() {
  bindDigitalTwin();
}

function drawBoat(canvas, thumb = false) {
  if (thumb) {
    drawDigitalTwin(canvas, s);
  } else {
    drawDigitalTwin(canvas, s);
  }
}

// =============================================================
// 5. 3D MISSION VIEW (RESERVOIR MAP VIEW ON HOME & PAGE 2)
// =============================================================

const mission3D = {
  viewMode: 'surface',
  overlay: false,
  yaw: -0.68,
  pitch: 0.36,
  zoom: 1.0,
  presets: {
    surface:  { yaw: -0.68, pitch: 0.36, zoom: 1.0 },
    cutaway:  { yaw: -0.42, pitch: 0.22, zoom: 1.15 },
    rov:      { yaw: -0.62, pitch: 0.30, zoom: 1.3 },
    overview: { yaw: -0.72, pitch: 0.58, zoom: 1.0 }
  }
};

function setMissionViewMode(mode) {
  if (mission3D.presets[mode]) {
    mission3D.viewMode = mode;
    mission3D.yaw = mission3D.presets[mode].yaw;
    mission3D.pitch = mission3D.presets[mode].pitch;
    mission3D.zoom = mission3D.presets[mode].zoom;
  }
  const c = document.getElementById('map3d-canvas');
  if (c && typeof s !== 'undefined') drawMissionScene(c, s);
  if (typeof render === 'function') render();
}

function toggleSurveyOverlay() {
  mission3D.overlay = !mission3D.overlay;
  const c = document.getElementById('map3d-canvas');
  if (c && typeof s !== 'undefined') drawMissionScene(c, s);
  if (typeof render === 'function') render();
}

function resetMap3DCamera() {
  setMissionViewMode('surface');
}

let activeResizeObserver = null;

function drawMissionScene(canvas, mission) {
  if (!canvas || !mission) return;
  drawDigitalTwin(canvas, mission);
}

function bindReservoir3D() {
  const c = document.getElementById('map3d-canvas');
  if (!c) return;
  drawDigitalTwin(c, s);

  let start = null;
  c.onpointerdown = e => {
    start = [e.clientX, e.clientY];
    c.setPointerCapture(e.pointerId);
  };
  c.onpointermove = e => {
    if (!start) return;
    const dx = e.clientX - start[0];
    const dy = e.clientY - start[1];
    if (dx || dy) {
      digitalTwin.yaw += dx * 0.008;
      digitalTwin.pitch = Math.max(0.12, Math.min(1.42, digitalTwin.pitch + dy * 0.006));
      start = [e.clientX, e.clientY];
      drawDigitalTwin(c, s);
    }
  };
  c.onpointerup = () => { start = null; };
  c.onpointercancel = () => { start = null; };
  c.onwheel = e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    digitalTwin.zoom = Math.max(0.5, Math.min(2.8, digitalTwin.zoom + delta));
    drawDigitalTwin(c, s);
  };

  if (window.ResizeObserver && c.parentElement) {
    if (activeResizeObserver) activeResizeObserver.disconnect();
    activeResizeObserver = new ResizeObserver(() => {
      drawDigitalTwin(c, s);
    });
    activeResizeObserver.observe(c.parentElement);
  }
}

// -------------------------------------------------------------
// Tethered Underwater Mini-ROV 2D/3D Thumbnail Renderer
// -------------------------------------------------------------
function drawROV(canvas, rovState = 'Docked') {
  if (!canvas) return;
  const r = canvas.getBoundingClientRect();
  const w = r.width || 200;
  const h = r.height || 120;
  const d = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.floor(w * d);
  canvas.height = Math.floor(h * d);
  const ctx = canvas.getContext('2d');
  ctx.scale(d, d);

  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, '#0a223a');
  bgGrad.addColorStop(1, '#051322');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  const cx = w * 0.5;
  const cy = h * 0.52;

  // Tether line entering from top
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.2;
  ctx.setLineDash([4, 2]);
  ctx.beginPath();
  ctx.moveTo(cx - 30, 0);
  ctx.bezierCurveTo(cx - 25, cy - 35, cx - 10, cy - 20, cx, cy - 16);
  ctx.stroke();
  ctx.setLineDash([]);

  // Main Body
  ctx.fillStyle = '#f59e0b';
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(cx - 38, cy - 14, 76, 28, 8);
  ctx.fill();
  ctx.stroke();

  // Acrylic Front Camera Dome
  ctx.fillStyle = 'rgba(125, 211, 252, 0.85)';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx + 38, cy, 10, -Math.PI / 2, Math.PI / 2);
  ctx.fill();
  ctx.stroke();

  // Dual LED Illuminators
  const ledGlow = rovState !== 'Docked';
  ctx.fillStyle = ledGlow ? '#ffffff' : '#64748b';
  ctx.beginPath();
  ctx.arc(cx + 34, cy - 8, 3, 0, Math.PI * 2);
  ctx.arc(cx + 34, cy + 8, 3, 0, Math.PI * 2);
  ctx.fill();

  if (ledGlow) {
    ctx.fillStyle = 'rgba(254, 240, 138, 0.22)';
    ctx.beginPath();
    ctx.moveTo(cx + 37, cy - 8);
    ctx.lineTo(w, cy - 30);
    ctx.lineTo(w, cy + 30);
    ctx.lineTo(cx + 37, cy + 8);
    ctx.closePath();
    ctx.fill();
  }

  // Thruster pods
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;
  ctx.fillRect(cx - 32, cy - 22, 18, 8);
  ctx.fillRect(cx - 32, cy + 14, 18, 8);
  ctx.fillRect(cx + 12, cy - 22, 18, 8);
  ctx.fillRect(cx + 12, cy + 14, 18, 8);

  // Status Badge
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.beginPath();
  ctx.roundRect(8, h - 22, 105, 16, 4);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = rovState === 'Docked' ? '#94a3b8' : '#16a34a';
  ctx.beginPath();
  ctx.arc(15, h - 14, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f8fafc';
  ctx.font = '600 9px -apple-system, system-ui, sans-serif';
  ctx.fillText(`ROV ${rovState.toUpperCase()}`, 22, h - 11);
}
