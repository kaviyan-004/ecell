'use strict';

// -------------------------------------------------------------
// AquaSentinel Simulation & Environmental Telemetry Engine
// Autonomous Surface ASV + Tethered Underwater Mini-ROV
// Synthetic Reservoir Sector (Inspired by Amaravathi Reservoir)
// -------------------------------------------------------------

const W = 19, H = 11, limit = 82;
const key = (x, y) => y * W + x;
const wet = (x, y) => x >= 0 && y >= 0 && x < W && y < H && ((x - 9) / 10) ** 2 + ((y - 5) / 6) ** 2 < 1;
const cells = Array.from({ length: W * H }, (_, i) => ({ x: i % W, y: Math.floor(i / W) })).filter(p => wet(p.x, p.y));
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// Reservoir Geo Origin (Amaravathi Reservoir reference: 10.58350° N, 77.26800° E)
const GEO_ORIGIN = { lat: 10.58350, lon: 77.26800 };
// 5m grid spacing converted to degrees (approx 111,139 m/deg lat, 109,240 m/deg lon at 10.6° N)
const LAT_PER_METER = 1 / 111139;
const LON_PER_METER = 1 / (111139 * Math.cos(GEO_ORIGIN.lat * Math.PI / 180));

function gridToGeo(x, y) {
  const dx = (x - 9) * 5; // meters east from center
  const dy = (y - 5) * 5; // meters north from center
  return {
    lat: GEO_ORIGIN.lat + dy * LAT_PER_METER,
    lon: GEO_ORIGIN.lon + dx * LON_PER_METER,
    e: dx,
    n: dy
  };
}

function formatCoords(lat, lon, format = 'DD') {
  if (format === 'UTM') {
    const e = Math.round((lon - GEO_ORIGIN.lon) / LON_PER_METER);
    const n = Math.round((lat - GEO_ORIGIN.lat) / LAT_PER_METER);
    return `E ${e >= 0 ? '+' : ''}${e}m, N ${n >= 0 ? '+' : ''}${n}m (Survey Ref)`;
  }
  if (format === 'DMS') {
    const toDMS = (deg, pos, neg) => {
      const d = Math.floor(Math.abs(deg));
      const m = Math.floor((Math.abs(deg) - d) * 60);
      const s = ((Math.abs(deg) - d - m / 60) * 3600).toFixed(1);
      return `${d}°${m}'${s}"${deg >= 0 ? pos : neg}`;
    };
    return `${toDMS(lat, 'N', 'S')}, ${toDMS(lon, 'E', 'W')}`;
  }
  // Decimal Degrees (default)
  return `${lat.toFixed(5)}° N, ${lon.toFixed(5)}° E`;
}

// Pseudo-random generator with deterministic seed
function rng(n) {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
}

// Synthetic bathymetry and sediment deposition
// Scenario seeds:
// 1 = Normal survey (moderate sediment, balanced water quality)
// 2 = High sediment near intake (heavy accumulation near x:15, y:4)
// 3 = Water quality anomaly (localized runoff in southern cove x:6, y:2)
function terrain(p, scenario = 1) {
  if (scenario === 2) {
    // High sediment near intake (intake is at x:15, y:4)
    const intakeSediment = 1.82 * Math.exp(-((p.x - 15) ** 2 / 5 + (p.y - 4) ** 2 / 2.5));
    const basinSediment = 0.45 * Math.exp(-((p.x - 7) ** 2 / 8 + (p.y - 6) ** 2 / 4));
    return Math.max(0.15, 0.22 + intakeSediment + basinSediment);
  }
  if (scenario === 3) {
    // Water anomaly scenario - sediment is standard moderate
    return 0.20 + 0.95 * Math.exp(-((p.x - 12) ** 2 / 8 + (p.y - 4) ** 2 / 3)) + 0.4 * Math.exp(-((p.x - 5) ** 2 / 9 + (p.y - 6) ** 2 / 4));
  }
  // Normal Survey (scenario 1)
  const cx = 12, cy = 3;
  return 0.15 + 0.92 * Math.exp(-((p.x - cx) ** 2 / 8 + (p.y - cy) ** 2 / 3)) + 0.45 * Math.exp(-((p.x - 5) ** 2 / 9 + (p.y - 6) ** 2 / 4));
}

// Water column depth (reservoir bed depth from surface)
function waterDepth(p) {
  return 3.2 + Math.sin(p.x * 0.24) * 0.8 + Math.cos(p.y * 0.4) * 0.4;
}

// Dual-frequency echo simulation (200 kHz & 33 kHz)
function ping(p, scenario, noise = 0.18) {
  const top = waterDepth(p); // Seabed upper interface
  const sedThickness = terrain(p, scenario);
  const lower = top + sedThickness; // Sub-bottom acoustic reflector (hard rock/basement)
  
  // 161 range bins from 0 to 8 meters (0.05 m per bin)
  const traces = [top, lower].map((center, ch) => Array.from({ length: 161 }, (_, i) => {
    const depth = i * 0.05;
    const n = rng(i + key(p.x, p.y) * 173 + ch * 913 + scenario * 37);
    // 200 kHz has sharper reflection at seabed; 33 kHz penetrates and reflects off sub-bottom
    const pulseWidth = ch === 0 ? 0.010 : 0.018;
    const baseAmp = ch === 0 ? 0.95 : 0.82;
    return baseAmp * Math.exp(-((depth - center) ** 2) / pulseWidth) + noise * n;
  }));

  const picks = traces.map(t => t.indexOf(Math.max(...t)) * 0.05);
  const thickness = Math.max(0, picks[1] - picks[0]);

  // Acoustic classification based on signal features
  let classification = 'Soft Sediment';
  let confidence = 0.92;
  let rationale = 'Clear dual-frequency separation. Strong 200 kHz surface return followed by distinct 33 kHz sub-bottom penetration.';

  if (thickness < 0.25) {
    classification = 'Hard Rock';
    confidence = 0.88;
    rationale = 'Minimal separation between high and low frequency returns indicates exposed acoustic basement.';
  } else if (thickness >= 0.25 && thickness <= 0.65) {
    classification = 'Compacted Sand';
    confidence = 0.85;
    rationale = 'Moderate echo attenuation with partial 33 kHz penetration characteristic of denser sand/silt mixture.';
  } else if (thickness > 1.40) {
    classification = 'Soft Silt Deposit';
    confidence = 0.94;
    rationale = 'Deep acoustic penetration (>1.4 m) with low seabed acoustic impedance, indicating thick fluid mud / uncompacted silt.';
  }

  // Check noise level
  if (noise > 0.45) {
    confidence = 0.62;
    classification = 'Uncertain';
    rationale = 'High acoustic noise floor impairs secondary interface peak detection.';
  }

  return {
    traces,
    picks,
    value: thickness,
    seabedDepth: picks[0],
    basementDepth: picks[1],
    classification,
    confidence,
    rationale
  };
}

// Inverse-distance weighted sediment map estimator
function estimate(p, samples) {
  const near = samples.map(s => ({ d: dist(p, s), v: s.value })).sort((a, b) => a.d - b.d).slice(0, 5);
  if (!near.length) return { value: 0, gap: 20 };
  if (near[0].d === 0) return { value: near[0].v, gap: 0 };
  let sum = 0, w = 0;
  for (const n of near) {
    const k = 1 / (n.d ** 2);
    sum += k * n.v;
    w += k;
  }
  return { value: sum / w, gap: near[0].d };
}

// -------------------------------------------------------------
// Water Quality & Environmental Parameters Simulation
// -------------------------------------------------------------
function sampleWaterQuality(p, scenario, stepCount) {
  // Baseline ambient values with slight spatial/temporal micro-variations
  const timeSec = stepCount * 3.5;
  const timeVariation = Math.sin(timeSec * 0.05);

  let temp = 24.7 + 0.2 * Math.sin(p.x * 0.3) + 0.1 * timeVariation;
  let ph = 7.32 + 0.04 * Math.cos(p.y * 0.4) + 0.02 * timeVariation;
  let do_mg = 6.8 + 0.15 * Math.sin((p.x + p.y) * 0.25);
  let cond = 412 + 8 * Math.cos(p.x * 0.2) + 4 * timeVariation;
  let turb = 12.5 + 1.2 * Math.sin(p.y * 0.3) + 0.8 * rng(stepCount + 11);
  let salinity = 0.12;
  let nitrate = 1.2 + 0.05 * Math.sin(p.x * 0.2);
  let ammonia = 0.05 + 0.005 * Math.cos(p.y * 0.2);
  let waterLevel = 2.48 + 0.03 * Math.sin(timeSec * 0.02);

  // Scenario 3: Localized water-quality anomaly in southern cove (x: 4-8, y: 1-4)
  if (scenario === 3) {
    const anomalyDist = Math.hypot(p.x - 6, p.y - 2);
    if (anomalyDist < 3.8) {
      const factor = Math.max(0, 1 - anomalyDist / 3.8);
      cond += 225 * factor; // Surge to ~637 µS/cm
      ph -= 0.68 * factor;   // Drop to ~6.64 (acidic runoff)
      turb += 14.5 * factor; // Surge to ~27 NTU
      do_mg -= 1.4 * factor; // Drop to ~5.4 mg/L
      ammonia += 0.12 * factor;
      nitrate += 0.8 * factor;
    }
  }

  // Scenario 2: Sediment near intake causes localized turbidity elevation
  if (scenario === 2) {
    const intakeDist = Math.hypot(p.x - 15, p.y - 4);
    if (intakeDist < 3.2) {
      const factor = Math.max(0, 1 - intakeDist / 3.2);
      turb += 6.5 * factor; // Elevated turbidity near silt mound
    }
  }

  const tds = Math.round(cond * 0.75); // TDS derived from conductivity

  return {
    temp: Number(temp.toFixed(1)),
    ph: Number(ph.toFixed(2)),
    do: Number(do_mg.toFixed(1)),
    cond: Math.round(cond),
    turb: Number(turb.toFixed(1)),
    salinity: Number(salinity.toFixed(2)),
    tds,
    nitrate: Number(nitrate.toFixed(1)),
    ammonia: Number(ammonia.toFixed(2)),
    waterLevel: Number(waterLevel.toFixed(2))
  };
}

// -------------------------------------------------------------
// Mission State Management & Autonomous Navigation
// -------------------------------------------------------------
function createMission(mode = 'Adaptive', scenario = 1, noise = 0.18) {
  // Survey path across reservoir
  const route = [];
  for (let y = 1; y < H; y += 2) {
    let row = cells.filter(p => p.y === y);
    if (y % 4 === 3) row.reverse();
    route.push(...row);
  }

  const startPos = { ...route[0] };
  const startTime = new Date();
  startTime.setHours(14, 20, 0); // 14:20:00 benchmark demo start time

  return {
    mode,
    scenario, // 1: Normal, 2: High Sediment, 3: Water Quality Anomaly
    noise,
    route,
    index: 0,
    pos: { ...startPos },
    heading: 85, // degrees
    speed: 0.0, // m/s (zero when stationary)
    path: [{ ...startPos }],
    samples: [],
    steps: 0,
    target: null,
    done: false,
    latest: null,
    latestWQ: sampleWaterQuality(startPos, scenario, 0),
    detours: 0,
    startTime,
    currentTime: new Date(startTime.getTime()),
    
    // Telemetry histories for sparklines (up to 30 points)
    history: {
      waterLevel: [2.45, 2.46, 2.47, 2.48],
      temp: [24.5, 24.6, 24.6, 24.7],
      ph: [7.30, 7.31, 7.32, 7.32],
      do: [6.9, 6.8, 6.8, 6.8],
      cond: [408, 410, 411, 412],
      turb: [11.8, 12.1, 12.3, 12.5],
      sediment: [0.35, 0.42, 0.48]
    },

    // Vehicle hardware status
    boat: {
      name: 'Surface boat (ASV–01)',
      battery: 92, // %
      solarWatts: 142, // W
      signal: 'Strong', // dBm / label
      speed: 0.0, // m/s
      heading: 85, // deg
      state: 'Ready at launch',
      gnssStatus: 'Fixed RTK (0.8m HDOP)'
    },

    rov: {
      name: 'Mini-ROV (Aquanaut–IV)',
      state: 'Docked', // 'Docked' | 'Deploying' | 'Inspecting' | 'Recovering'
      depth: 0.0, // meters
      tetherPower: '48V DC / 185W',
      tetherLength: 0.0, // meters deployed
      maxTether: 15.0, // meters
      offset: { dx: 0, dy: 0 },
      evidence: null // inspection photo/log
    },

    // Alerts collection
    alerts: [],
    alertUnreadCount: 0,

    // Surface observations
    surfaceObservations: [
      { time: '14:20:15', pos: { x: 3, y: 1 }, type: 'Calm water surface', note: 'Wave height 0.08m, clear surface visibility.' }
    ],

    // Ecological & Fish observations
    ecoObservations: {
      fishAcousticContacts: 0,
      score: 92,
      status: 'Healthy',
      evidence: 'Dissolved oxygen 6.8 mg/L and low turbidity support active fish population. Normal acoustic backscatter.'
    },

    // Operational event logs
    events: ['Survey initialized in Sector A (5 m grid spacing).']
  };
}

// Single simulation step
function stepMission(s, thresholds) {
  if (s.done) return;

  const p = s.pos;
  const timeOffsetSec = s.steps * 4;
  s.currentTime = new Date(s.startTime.getTime() + timeOffsetSec * 1000);

  // 1. Take sonar ping at current position if not yet sampled
  let currentSample = s.samples.find(q => dist(p, q) < 0.01);
  if (!currentSample) {
    s.latest = ping(p, s.scenario, s.noise);
    const stationId = `STN-${String(p.x).padStart(2, '0')}-${String(p.y).padStart(2, '0')}`;
    const geo = gridToGeo(p.x, p.y);
    
    currentSample = {
      ...p,
      stationId,
      geo,
      value: s.latest.value,
      classification: s.latest.classification,
      confidence: s.latest.confidence,
      seabedDepth: s.latest.seabedDepth,
      basementDepth: s.latest.basementDepth,
      traces: s.latest.traces,
      time: s.currentTime.toLocaleTimeString('en-GB')
    };
    s.samples.push(currentSample);
  }

  // 2. Measure Water Quality at this station
  s.latestWQ = sampleWaterQuality(p, s.scenario, s.steps);

  // Update telemetry histories (keep last 24 entries)
  const pushHist = (arr, val) => { arr.push(val); if (arr.length > 24) arr.shift(); };
  pushHist(s.history.waterLevel, s.latestWQ.waterLevel);
  pushHist(s.history.temp, s.latestWQ.temp);
  pushHist(s.history.ph, s.latestWQ.ph);
  pushHist(s.history.do, s.latestWQ.do);
  pushHist(s.history.cond, s.latestWQ.cond);
  pushHist(s.history.turb, s.latestWQ.turb);
  pushHist(s.history.sediment, s.latest.value);

  // 3. Update Hardware status
  s.boat.battery = Math.max(75, Number((92 - s.steps * 0.12).toFixed(1)));
  s.boat.solarWatts = Math.round(140 + 8 * Math.sin(s.steps * 0.1));
  s.boat.speed = s.done ? 0.0 : 1.2;
  s.boat.state = s.done ? 'Mission Completed' : 'Surveying';

  // 4. Update ROV status if deployed
  if (s.rov.state === 'Deploying') {
    s.rov.depth = Math.min(s.latest.seabedDepth + 0.4, Number((s.rov.depth + 0.35).toFixed(1)));
    s.rov.tetherLength = Number((s.rov.depth * 1.4).toFixed(1));
    if (s.rov.depth >= s.latest.seabedDepth + 0.3) {
      s.rov.state = 'Inspecting';
      s.events.unshift(`ROV reached target depth ${s.rov.depth}m. Commencing visual verification.`);
    }
  } else if (s.rov.state === 'Recovering') {
    s.rov.depth = Math.max(0, Number((s.rov.depth - 0.5).toFixed(1)));
    s.rov.tetherLength = Number((s.rov.depth * 1.4).toFixed(1));
    if (s.rov.depth <= 0.05) {
      s.rov.state = 'Docked';
      s.rov.depth = 0;
      s.rov.tetherLength = 0;
      s.events.unshift('ROV securely docked on ASV stern cradle.');
    }
  }

  // 5. Evaluate Alert Rules (Configurable demonstration thresholds)
  checkAlerts(s, currentSample, thresholds);

  // 6. Surface & Ecological observations
  checkObservations(s, p);

  // 7. Navigation & Route planning (Adaptive or Fixed)
  if (!s.target || dist(p, s.target) < 0.01) {
    s.target = null;
    if (s.mode === 'Adaptive' && s.samples.length >= 8 && s.steps % 5 === 0) {
      const local = cells.filter(q => dist(p, q) <= 3 && estimate(q, s.samples).gap >= 0.99);
      local.sort((a, b) => {
        const score = q => {
          const e = estimate(q, s.samples);
          return e.gap * (0.45 + e.value);
        };
        return score(b) - score(a);
      });
      if (local.length) {
        s.target = local[0];
        s.detours++;
        s.events.unshift(`Infill station selected at ${s.target.x * 5}m E, ${s.target.y * 5}m N`);
      }
    }
    if (!s.target) {
      while (s.index < s.route.length && s.samples.some(q => dist(q, s.route[s.index]) < 0.01)) s.index++;
      if (s.index < s.route.length) {
        s.target = s.route[s.index++];
      } else {
        const rest = cells.filter(q => !s.samples.some(a => dist(q, a) < 0.01));
        rest.sort((a, b) => dist(p, a) - dist(p, b));
        s.target = rest[0];
      }
    }
  }

  s.path.push({ ...p });
  s.steps++;

  if (s.steps >= limit || !s.target) {
    s.done = true;
    s.boat.speed = 0.0;
    s.boat.state = 'Completed';
    s.events.unshift('Survey sector complete. All scheduled soundings acquired.');
    return;
  }

  // Vessel holds station while tethered mini-ROV is deployed or inspecting
  if (s.rov.state === 'Deploying' || s.rov.state === 'Inspecting') {
    s.boat.speed = 0.0;
    s.boat.state = 'Holding station · ROV inspection';
    return;
  }

  // Move vessel one 5m grid step
  const next = cells
    .filter(q => Math.abs(q.x - p.x) + Math.abs(q.y - p.y) === 1)
    .sort((a, b) => dist(a, s.target) - dist(b, s.target))[0];

  // Calculate vessel heading
  if (next) {
    const dx = next.x - p.x;
    const dy = next.y - p.y;
    s.heading = (Math.round((Math.atan2(dx, dy) * 180 / Math.PI) + 360) % 360);
    s.pos = { ...next };
  }
}

// Location-based Alert Evaluation
function checkAlerts(s, sample, thresholds) {
  const t = thresholds || {
    sedimentMax: 1.40,
    turbidityMax: 20.0,
    phMin: 6.80,
    phMax: 8.50,
    condMax: 550
  };

  const timeStr = s.currentTime.toLocaleTimeString('en-GB');

  // Rule 1: High Sediment near Intake / Sector
  if (sample.value >= t.sedimentMax) {
    const existing = s.alerts.find(a => a.type === 'sediment' && dist(a.pos, sample) < 2);
    if (!existing) {
      const alert = {
        id: 'ALT-' + (s.alerts.length + 1),
        type: 'sediment',
        severity: 'critical', // 'info' | 'warning' | 'critical'
        title: 'Critical Sediment Accumulation',
        message: `Measured acoustic thickness ${sample.value.toFixed(2)} m exceeds threshold (${t.sedimentMax.toFixed(2)} m) at ${sample.stationId}. Risk of intake siltation.`,
        param: 'Sediment Thickness',
        value: `${sample.value.toFixed(2)} m`,
        threshold: `${t.sedimentMax.toFixed(2)} m`,
        pos: { ...sample },
        stationId: sample.stationId,
        geo: sample.geo,
        time: timeStr,
        status: 'Active',
        actionRequired: 'Deploy ROV for visual inspection & take core sample',
        actionTaken: null
      };
      s.alerts.unshift(alert);
      s.alertUnreadCount++;
      s.events.unshift(`[ALERT] ${alert.title} at ${sample.stationId}`);
    }
  }

  // Rule 2: Water Quality Anomaly (Conductivity spike & pH drop)
  if (s.latestWQ.cond >= t.condMax || s.latestWQ.ph <= t.phMin) {
    const existing = s.alerts.find(a => a.type === 'water_quality' && dist(a.pos, sample) < 2);
    if (!existing) {
      const alert = {
        id: 'ALT-' + (s.alerts.length + 1),
        type: 'water_quality',
        severity: 'warning',
        title: 'Possible Water-Quality Anomaly',
        message: `Sustained conductivity shift (${s.latestWQ.cond} µS/cm > ${t.condMax}) and pH drop (${s.latestWQ.ph} < ${t.phMin}) at ${sample.stationId}.`,
        param: 'Conductivity & pH',
        value: `${s.latestWQ.cond} µS/cm, pH ${s.latestWQ.ph}`,
        threshold: `> ${t.condMax} µS/cm, < ${t.phMin}`,
        pos: { ...sample },
        stationId: sample.stationId,
        geo: sample.geo,
        time: timeStr,
        status: 'Active',
        actionRequired: 'Collect water sample & inspect inflow source',
        actionTaken: null
      };
      s.alerts.unshift(alert);
      s.alertUnreadCount++;
      s.events.unshift(`[ALERT] ${alert.title} at ${sample.stationId}`);
    }
  }

  // Rule 3: High Turbidity
  if (s.latestWQ.turb >= t.turbidityMax) {
    const existing = s.alerts.find(a => a.type === 'turbidity' && dist(a.pos, sample) < 2);
    if (!existing) {
      const alert = {
        id: 'ALT-' + (s.alerts.length + 1),
        type: 'turbidity',
        severity: 'warning',
        title: 'Elevated Turbidity Detected',
        message: `Water turbidity reached ${s.latestWQ.turb} NTU (threshold: ${t.turbidityMax} NTU). Potential suspended silt plume.`,
        param: 'Turbidity',
        value: `${s.latestWQ.turb} NTU`,
        threshold: `${t.turbidityMax} NTU`,
        pos: { ...sample },
        stationId: sample.stationId,
        geo: sample.geo,
        time: timeStr,
        status: 'Active',
        actionRequired: 'Monitor particulate dispersion',
        actionTaken: null
      };
      s.alerts.unshift(alert);
      s.alertUnreadCount++;
    }
  }
}

// Surface & Ecological observations
function checkObservations(s, p) {
  const timeStr = s.currentTime.toLocaleTimeString('en-GB');

  // Surface observation around intake
  if (p.x === 14 && p.y === 4 && !s.surfaceObservations.some(o => o.type === 'Debris boom')) {
    s.surfaceObservations.push({
      time: timeStr,
      pos: { ...p },
      type: 'Intake debris boom',
      note: 'Floating barrier intact; minor floating organic debris trapped along north arm.'
    });
  }

  // Ecological acoustic observation
  if (p.x === 10 && p.y === 6 && s.ecoObservations.fishAcousticContacts === 0) {
    s.ecoObservations.fishAcousticContacts = 3;
    s.ecoObservations.evidence = 'Acoustic mid-water echoes detect small school of fish (Oreochromis niloticus) at 1.8m depth. DO: 6.8 mg/L confirms well-oxygenated habitat.';
    s.events.unshift('Acoustic mid-water target detected: Fish school at 1.8 m depth.');
  }
}

// Compute map MAE error against synthetic ground truth
function computeMapError(s) {
  return 100 * cells.reduce((sum, p) => sum + Math.abs(estimate(p, s.samples).value - terrain(p, s.scenario)), 0) / cells.length;
}
