/* SaveBench walkthrough player. One dependency-free file, no external requests.
   window.SaveBenchWalkthrough.mount(element, versionData, { base: 'versions/2026-11-16/' })
   versionData is a version's scenes.json (already parsed). Engines: "v3" (cinematic: map camera, factories plotted from run records, charts, film; from Nov 24), "v2" (data-driven, real results) and
   "concept1" (the October 27 concept animation, kept for the history). Never autoplays. */
(function () {
'use strict';
const W = 1920, H = 1080;
const C = { bg:'#0b0c0f', pn:'rgba(21,23,28,0.94)', pn2:'#1d2027', ln:'#2c313a', tx:'#f4f1ea', mu:'#a9adb6', or:'#fa8c3c', A:'#38bdf8', B:'#f472b6', C:'#a3e635', D:'#c4b5fd', ok:'#7ddc9a', bad:'#ff8a7a', un:'#f2c14e', pw:'#f2c14e' };
const FH = "'Bricolage Grotesque','Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif";
const FB = "'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif";
const FM = "'JetBrains Mono',ui-monospace,Menlo,Consolas,monospace";
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
const eio = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const eo = k => 1 - Math.pow(1 - k, 3);
const back = k => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };

// ---------- sound (made on the page, only after Play is pressed) ----------
function sfx(ac, out, type, at, v = 1) {
  const g = ac.createGain(); g.connect(out);
  const env = (a, d, peak) => { g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(peak * v, at + a); g.gain.exponentialRampToValueAtTime(0.0001, at + a + d); };
  const osc = (type, f0, f1, dur) => { const o = ac.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, at); if (f1) o.frequency.exponentialRampToValueAtTime(f1, at + dur); o.connect(g); o.start(at); o.stop(at + dur + .05); return o; };
  const noise = (dur, f0, f1, q = 1.2) => { const n = ac.createBufferSource(), len = Math.ceil(ac.sampleRate * dur), b = ac.createBuffer(1, len, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = q; f.frequency.setValueAtTime(f0, at); f.frequency.exponentialRampToValueAtTime(f1, at + dur); n.connect(f); f.connect(g); n.start(at); n.stop(at + dur); };
  switch (type) {
    case 'thud': env(.005, .28, .5); osc('sine', 120, 48, .3); break;
    case 'tick': env(.002, .05, .18); osc('triangle', 2200, 1800, .06); break;
    case 'pop': env(.004, .14, .25); osc('sine', 520, 880, .14); break;
    case 'click': env(.001, .08, .45); noise(.08, 3000, 1500, 3); osc('square', 900, 600, .05); break;
    case 'whoosh': env(.12, .35, .18); noise(.5, 400, 2400, .8); break;
    case 'zip': env(.05, .5, .08); noise(.55, 1200, 3800, 4); break;
    case 'swell': env(.8, 1.6, .12); osc('sine', 55, 82, 2.4); osc('triangle', 110, 164, 2.4); break;
    case 'low': env(.01, .5, .3); osc('sine', 196, 98, .5); break;
    case 'chime': env(.01, 1.1, .2); [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => { const o = ac.createOscillator(), gg = ac.createGain(); o.type = 'sine'; o.frequency.value = f; gg.gain.setValueAtTime(0.0001, at + i * .08); gg.gain.exponentialRampToValueAtTime(.18 * v, at + i * .08 + .01); gg.gain.exponentialRampToValueAtTime(0.0001, at + i * .08 + .9); o.connect(gg); gg.connect(out); o.start(at + i * .08); o.stop(at + i * .08 + 1); }); break;
  }
}
function mixTo(ac, out) { const comp = ac.createDynamicsCompressor(); comp.connect(out); const m = ac.createGain(); m.gain.value = .8; m.connect(comp); return m; }

const ENG = {};

// =====================================================================================
// Engine "concept1": the October 27 concept animation, unchanged apart from a label.
// =====================================================================================
ENG.concept1 = function (x0, IM, data) {
  let x = x0;
  const W = 1920, H = 1080, DUR = 88;
const C = { bg:'#0b0c0f', pn:'rgba(21,23,28,0.94)', pn2:'#1d2027', ln:'#2c313a', tx:'#f4f1ea', mu:'#a9adb6', or:'#fa8c3c', A:'#38bdf8', B:'#f472b6', C:'#a3e635', D:'#c4b5fd' };
const FH = "'Bricolage Grotesque','Inter Display',sans-serif", FB = "'Plus Jakarta Sans','Inter',sans-serif", FM = "'JetBrains Mono',monospace";

// ---------- math ----------
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
const eio = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const eo = k => 1 - Math.pow(1 - k, 3);
const ei = k => k * k * k;
const back = k => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
// arrive springy, leave smooth
const inout = (t, a, b, d = .6, e = .5) => Math.min(back(seg(t, a, a + d)), 1 - eo(seg(t, b - e, b)) * 1);
const vis = (t, a, b, d = .5, e = .5) => Math.min(eo(seg(t, a, a + d)), 1 - seg(t, b - e, b));

// ---------- map space (8192 units = full world) ----------
const G = (gx, gy) => [400 + gx / 2.4, 3500 + gy / 2.4];            // grass-1920 px -> map
const Wt = (sx, sy) => G((sx + 656) / 1.6, (sy + 682) / 1.6);        // canvas-board coords -> map
const KEYS = [
  [0, 4300, 4100, .15], [5, 4250, 4050, .16], [8.5, 1500, 3760, .5], [19, 1520, 3770, .54],
  [24.5, 790, 3806, 5.0], [61, 790, 3806, 5.0], [68, 790, 3806, 5.0], [74, 790, 3806, 5.0],
  [79.5, 4100, 4096, .135], [88, 4100, 4096, .13]
];
function cam(t) {
  for (let i = 0; i < KEYS.length - 1; i++) {
    const a = KEYS[i], b = KEYS[i + 1];
    if (t <= b[0]) {
      const k = eio(seg(t, a[0], b[0]));
      const lz = lerp(Math.log(a[3]), Math.log(b[3]), k);
      // keep the target in view while zooming: weight centre by zoom progress
      const zin = b[3] > a[3];
      const kc = zin ? eo(k) : ei(k) * 0 + eio(k);
      return { cx: lerp(a[1], b[1], kc), cy: lerp(a[2], b[2], kc), z: Math.exp(lz) };
    }
  }
  const l = KEYS[KEYS.length - 1]; return { cx: l[1], cy: l[2], z: l[3] };
}
const S = (c, mx, my) => [(mx - c.cx) * c.z + c.ox, (my - c.cy) * c.z + c.oy];

// ---------- factory data ----------
const I = { miner:'MinerMk1', smelter:'SmelterMk1', con:'ConstructorMk1', split:'ConveyorAttachmentSplitter', store:'StorageContainerMk1' };
const NAME = { miner:'Miner', smelter:'Smelter', con:'Constructor', split:'Splitter', store:'Storage' };
const FA = { col: C.A, letter: 'A',
  b: [['miner',680,366,25.8,31.2],['miner',515,446,26.2,31.7],['smelter',560,278,26.8,32.3],['smelter',704,246,27.3,32.8],['con',832,278,27.9,33.6],['con',880,406,28.4,34.1],['con',752,486,28.9,34.6],['store',899,643,29.4,35.2]],
  p: [['M680 366 L704 246','OreIron',33.0],['M515 446 L515 278 L560 278','OreIron',33.3],['M704 246 L832 246 L832 278','IronIngot',34.0],['M704 246 L880 246 L880 406','IronIngot',34.4],['M560 278 L608 278 L608 486 L752 486','IronIngot',34.9],['M832 278 L960 278 L960 643 L899 643','IronPlate',35.6],['M880 406 L928 406 L928 643','IronRod',35.9],['M752 486 L752 643 L899 643','IronPlate',36.2]] };
const FBk = { col: C.B, letter: 'B',
  b: [['miner',680,366,39.4,39.6],['miner',515,446,39.6,39.9],['smelter',464,582,39.8,40.2],['smelter',576,598,40.0,40.5],['split',688,598,40.3,40.8],['con',784,502,40.6,41.3],['con',800,646,40.9,41.7],['con',704,742,41.2,42.1],['store',899,643,41.5,42.5]],
  p: [['M515 446 L464 446 L464 582','OreIron',41.0],['M680 366 L680 534 L576 534 L576 598','OreIron',41.2],['M464 582 L464 662 L688 662 L688 598','IronIngot',41.8],['M576 598 L688 598','IronIngot',42.0],['M688 598 L688 502 L784 502','IronIngot',42.3],['M688 598 L800 598 L800 646','IronIngot',42.5],['M688 598 L704 598 L704 742','IronIngot',42.7],['M784 502 L899 502 L899 643','IronPlate',43.2],['M800 646 L899 646','IronRod',43.4],['M704 742 L899 742 L899 643','IronPlate',43.6]] };
function parsePath(d) { const n = d.match(/-?\d+(\.\d+)?/g).map(Number); const pts = []; for (let i = 0; i < n.length; i += 2) pts.push(Wt(n[i], n[i + 1])); return pts; }
for (const F of [FA, FBk]) F.p = F.p.map(([d, item, t0]) => { const pts = parsePath(d); let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return { pts, item, t0, L }; });
const NODES = [Wt(680, 366), Wt(515, 446)], DEPOT = Wt(899, 643);

function along(pts, d) { for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (d <= l) return [lerp(a[0], b[0], d / l), lerp(a[1], b[1], d / l)]; d -= l; } return pts[pts.length - 1]; }

// ---------- drawing helpers ----------
function rr(X, Y, w, h, r, fill, stroke, lw = 1) { x.beginPath(); x.roundRect(X, Y, w, h, r); if (fill) { x.fillStyle = fill; x.fill(); } if (stroke) { x.lineWidth = lw; x.strokeStyle = stroke; x.stroke(); } }
function tx(s, X, Y, font, col, al = 'left', base = 'alphabetic') { x.font = font; x.fillStyle = col; x.textAlign = al; x.textBaseline = base; x.fillText(s, X, Y); }
function img(n, X, Y, s) { const m = IM[n]; if (m) x.drawImage(m, X - s / 2, Y - s / 2, s, s); }
function A(a, fn) { if (a <= 0.001) return; x.save(); x.globalAlpha *= clamp(a); fn(); x.restore(); }
function hex(X, Y, s, col) { x.save(); x.translate(X, Y); x.scale(s / 26, s / 26); x.translate(-13, -15); x.strokeStyle = col; x.lineWidth = 2.6; x.beginPath(); x.moveTo(13, 2); x.lineTo(24, 8); x.lineTo(24, 22); x.lineTo(13, 28); x.lineTo(2, 22); x.lineTo(2, 8); x.closePath(); x.stroke(); x.fillStyle = col; x.beginPath(); x.moveTo(13, 9); x.lineTo(19, 12.5); x.lineTo(19, 17.5); x.lineTo(13, 21); x.lineTo(7, 17.5); x.lineTo(7, 12.5); x.closePath(); x.fill(); x.restore(); }
function badge(X, Y, letter, col, s = 30) { rr(X, Y, s, s, 7, 'rgba(0,0,0,.25)', col, 2.5); tx(letter, X + s / 2, Y + s / 2 + 1, `800 ${s * .55}px ${FB}`, col, 'center', 'middle'); }
function wrap(s, X, Y, maxW, lh, font, col) { x.font = font; const words = s.split(' '); let line = '', yy = Y; for (const w of words) { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > maxW && line) { tx(line, X, yy, font, col); line = w; yy += lh; } else line = t; } if (line) tx(line, X, yy, font, col); return yy; }

// ---------- map layers ----------
function drawMap(c) {
  x.fillStyle = C.bg; x.fillRect(0, 0, W, H);
  const [wx, wy] = S(c, 0, 0); x.drawImage(IM.world, wx, wy, 8192 * c.z, 8192 * c.z);
  const ga = seg(Math.log(c.z), Math.log(.9), Math.log(2.2));
  if (ga > 0) { const [gx, gy] = S(c, 400, 3500); A(ga, () => x.drawImage(IM.grass, gx, gy, 800 * c.z, 450 * c.z)); }
}
function drawFactory(c, F, t, opt = {}) {
  const k = clamp(c.z / 5, .45, 1.2);
  // depot ring + nodes
  const [dx, dy] = S(c, DEPOT[0], DEPOT[1]);
  x.save(); x.setLineDash([8, 8]); x.beginPath(); x.arc(dx, dy, 72 * k, 0, 7); x.fillStyle = 'rgba(250,140,60,.12)'; x.fill(); x.strokeStyle = C.or; x.lineWidth = 2; x.stroke(); x.restore();
  if (!opt.noLabels) tx('Depot', dx + 40 * k, dy + 78 * k, `700 ${18 * k}px ${FB}`, C.tx);
  for (const n of NODES) { const [nx, ny] = S(c, n[0], n[1]); const p = .5 + .5 * Math.sin(t * 3); x.beginPath(); x.arc(nx, ny, (30 + 8 * p) * k, 0, 7); x.fillStyle = `rgba(250,140,60,${.1 + .12 * p})`; x.fill(); x.beginPath(); x.arc(nx, ny, 24 * k, 0, 7); x.fillStyle = 'rgba(0,0,0,.6)'; x.fill(); x.strokeStyle = C.or; x.lineWidth = 2.5; x.stroke(); img('OreIron', nx, ny, 32 * k); }
  // belts
  for (const b of F.p) {
    const pr = eio(seg(t, b.t0, b.t0 + .8)); if (pr <= 0) continue;
    const L = b.L * pr; x.save(); x.lineJoin = 'round'; x.lineCap = 'round';
    const path = () => { x.beginPath(); let d = 0; x.moveTo(...S(c, ...b.pts[0])); for (let i = 1; i < b.pts.length; i++) { const a = b.pts[i - 1], e = b.pts[i], l = Math.hypot(e[0] - a[0], e[1] - a[1]); if (d + l >= L) { const q = (L - d) / l; x.lineTo(...S(c, lerp(a[0], e[0], q), lerp(a[1], e[1], q))); break; } x.lineTo(...S(c, ...e)); d += l; } };
    path(); x.strokeStyle = 'rgba(0,0,0,.55)'; x.lineWidth = 13 * k; x.stroke();
    path(); x.strokeStyle = F.col; x.lineWidth = 6.5 * k; x.stroke(); x.restore();
    // items
    const run = t - (b.t0 + .8); if (run > 0 && !opt.noItems) { const sp = 11, gap = 13; const head = Math.min(b.L, run * sp); for (let d = (run * sp) % gap; d <= head; d += gap) { const [px, py] = S(c, ...along(b.pts, d)); x.beginPath(); x.arc(px, py, 13 * k, 0, 7); x.fillStyle = 'rgba(11,12,15,.85)'; x.fill(); img(b.item, px, py, 22 * k); } }
  }
  // buildings
  for (const [kind, sx, sy, tg, ts] of F.b) {
    const ghost = seg(t, tg, tg + .4), solid = seg(t, ts, ts + .45);
    if (ghost <= 0 && solid <= 0) continue;
    const [m0, m1] = Wt(sx, sy); const [bx, by] = S(c, m0, m1);
    const sc = (solid > 0 ? back(solid) : back(ghost)) * k, s = 60 * sc;
    x.save(); x.globalAlpha *= solid > 0 ? 1 : .55;
    if (solid <= 0) x.setLineDash([7, 6]);
    x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = solid > 0 ? 14 : 0; x.shadowOffsetY = 5;
    rr(bx - s / 2, by - s / 2, s, s, 13 * sc, solid > 0 ? 'rgba(21,23,28,.95)' : 'rgba(21,23,28,.4)', F.col, 3.5 * k);
    x.restore();
    A(solid > 0 ? 1 : .6, () => img(I[kind], bx, by, 44 * sc));
  }
}

// pseudo-3D "game lens": re-project the flat frame strip by strip
const off = document.createElement('canvas'); off.width = W; off.height = H; const ox = off.getContext('2d');
function tiltProject(a, f = 1500) { // returns fn(screenY)->{y,s}
  return y => { const vy = y - H * .55, yy = vy * Math.cos(a), zz = vy * Math.sin(a), s = f / (f + zz); return { y: H * .55 + yy * s, s }; };
}
function drawTilted(a) {
  const P = tiltProject(a); const N = 120, sh = H / N;
  x.fillStyle = '#07080a'; x.fillRect(0, 0, W, H);
  for (let i = 0; i < N; i++) { const y0 = i * sh, p0 = P(y0), p1 = P(y0 + sh); const s = p0.s; x.drawImage(off, 0, y0, W, sh, W / 2 - W / 2 * s, p0.y, W * s, p1.y - p0.y + .8); }
  // horizon haze
  const g = x.createLinearGradient(0, 0, 0, H * .5); g.addColorStop(0, 'rgba(11,12,15,1)'); g.addColorStop(1, 'rgba(11,12,15,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H * .5);
  return P;
}

// ---------- UI chrome ----------
const STEPS = ['Brief', 'Plan', 'Build', 'Measure', 'Compare'];
function topBar(t, a, mode) {
  A(a, () => {
    rr(24, 24, W - 48, 76, 16, C.pn, C.ln);
    hex(64, 62, 32, C.or); tx('SaveBench', 92, 72, `800 28px ${FH}`, C.tx);
    if (mode === 'live') { const p = .55 + .45 * Math.sin(t * 5); x.beginPath(); x.arc(270, 62, 8, 0, 7); x.fillStyle = C.or; x.shadowColor = C.or; x.shadowBlur = 16 * p; x.fill(); x.shadowBlur = 0; tx('LIVE', 288, 70, `800 20px ${FB}`, C.or); }
    else { rr(256, 46, 232, 34, 8, '#2c313a'); tx('RECORDED, NOT LIVE', 372, 69, `700 16px ${FM}`, C.tx, 'center'); }
    tx('Plates and rods · Grass Fields', mode === 'live' ? 360 : 512, 70, `600 19px ${FB}`, C.mu);
    const si = mode !== 'live' ? -1 : t < 31 ? 1 : t < 54 ? 2 : 3; let sx = 900;
    STEPS.forEach((s, i) => { x.font = `600 16px ${FB}`; const w = x.measureText(s).width + 28; rr(sx, 44, w, 36, 9, i === si ? 'rgba(250,140,60,.18)' : 'transparent', i === si ? C.or : C.ln); tx(s, sx + w / 2, 68, `600 16px ${FB}`, i === si ? C.tx : C.mu, 'center'); sx += w + 8; });
    const gs = Math.max(0, (mode === 'live' ? t - 24.5 : (t - 68) * 9) * 42 + 600); const mm = Math.floor(gs / 60), ss = Math.floor(gs % 60);
    tx(`00:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`, W - 56, 72, `600 22px ${FM}`, C.tx, 'right');
  });
}
function rail(t, a, focus) {
  A(a, () => {
    const st = { A: t < 31 ? 'Planning' : t < 39 ? 'Building · revision 2' : t < 54 ? 'Revision 2 written' : 'Game trial running', B: t < 39 ? 'Planning' : t < 46 ? 'Building · revision 1' : t < 54 ? 'Revision 1 written' : 'Trial queued' };
    [['A', C.A], ['B', C.B]].forEach(([L, col], i) => {
      const y = 128 + i * 116, on = focus === L;
      rr(W - 440, y, 416, 100, 14, on ? 'rgba(29,32,39,.97)' : C.pn, on ? col : C.ln, on ? 2.5 : 1);
      x.fillStyle = col; x.fillRect(W - 440, y + 14, 6, 72);
      badge(W - 416, y + 20, L, col, 34); tx(`[model ${L}]`, W - 368, y + 44, `700 20px ${FB}`, C.tx);
      tx(st[L], W - 416, y + 82, `500 17px ${FB}`, C.mu);
      if (on) tx('ON CAMERA', W - 44, y + 44, `700 13px ${FM}`, col, 'right');
    });
  });
}
function headline(t, a, h, sub) {
  A(a, () => { rr(24, H - 250, 760, 170, 16, C.pn, C.ln); tx("WHAT'S HAPPENING", 52, H - 212, `600 14px ${FM}`, C.or); const yy = wrap(h, 52, H - 172, 700, 36, `800 30px ${FH}`, C.tx); tx(sub, 52, yy + 36, `500 18px ${FB}`, C.mu); });
}
function director(a, s) { A(a, () => { x.font = `700 20px ${FB}`; const w = x.measureText(s).width + 150, x0 = W / 2 - 220 - w / 2; rr(x0, 118, w, 48, 24, 'rgba(21,23,28,.94)', C.or, 2); tx('DIRECTOR', x0 + 24, 148, `700 14px ${FM}`, C.or); tx(s, x0 + 122, 149, `700 20px ${FB}`, C.tx); }); }
const EVENTS = [[31.2,'A','MinerMk1','Miner placed'],[32.3,'A','SmelterMk1','Smelter placed'],[33.6,'A','ConstructorMk1','Constructor placed'],[36.0,'A','ConveyorBeltMk1','Belts reach the depot'],[37.4,'A','IronPlate','First plate at depot'],[40.8,'B','ConveyorAttachmentSplitter','Splitter placed'],[42.5,'B','StorageContainerMk1','Storage placed']];
function ticker(t, a) {
  A(a, () => { const shown = EVENTS.filter(e => t >= e[0]).slice(-4); let y = H - 230; rr(W - 440, y, 416, 150, 16, C.pn, C.ln); tx('EVENTS', W - 414, y + 34, `600 14px ${FM}`, C.mu);
    shown.reverse().forEach((e, i) => { if (i > 2) return; const k = back(seg(t, e[0], e[0] + .45)); const yy = y + 52 + i * 32; A(k, () => { const col = e[1] === 'A' ? C.A : C.B; x.fillStyle = col; x.fillRect(W - 414, yy + 4, 4, 22); img(e[2], W - 390, yy + 15, 24); tx(`${e[1]} · ${e[3]}`, W - 370, yy + 22, `600 16px ${FB}`, C.tx); }); });
  });
}
function wipe(t, t0, col) { const k = seg(t, t0, t0 + .7); if (k <= 0 || k >= 1) return; const p = eio(k); const xx = lerp(-200, W + 200, p); x.save(); x.fillStyle = col; x.globalAlpha = .9; x.beginPath(); x.moveTo(xx - 160, 0); x.lineTo(xx + 40, 0); x.lineTo(xx - 60, H); x.lineTo(xx - 260, H); x.fill(); x.restore(); }

// ---------- scenes ----------
function frame(t) {
  x.save(); x.clearRect(0, 0, W, H);
  const c = cam(t); c.ox = W / 2; c.oy = H / 2;
  if (t >= 61 && t < 68) { compare(t); x.restore(); return; }

  // base map (+ factory when zoomed in)
  const live = t >= 24.5 && t < 61, rep = t >= 68 && t < 74.6;
  const focus = (t >= 39.35 && t < 46.35) ? 'B' : 'A';
  const F = focus === 'A' ? FA : FBk;
  const tilt = (t >= 46 && t < 54.6) ? eio(seg(t, 46.8, 48.3)) * (1 - eio(seg(t, 53.3, 54.5))) : 0;
  if (tilt > 0) {
    const sv = x; // draw flat frame into offscreen then reproject
    ox.save(); ox.clearRect(0, 0, W, H);
    swapCtx(ox, () => { drawMap(c); drawFactory(c, F, t, { noLabels: true, flatOnly: true }); });
    ox.restore();
    const P = drawTilted(tilt * .95);
    // extrude buildings as blocks
    const k = c.z / 5;
    const list = F.b.map(b => { const m = Wt(b[1], b[2]); const s = S(c, m[0], m[1]); return [b, s]; }).sort((p, q) => p[1][1] - q[1][1]);
    for (const [b, [sx, sy]] of list) { const p = P(sy), px = W / 2 + (sx - W / 2) * p.s, py = p.y, s = p.s; const hgt = 70 * tilt * s; x.fillStyle = shade(F.col, .35); x.fillRect(px - 30 * s, py - hgt, 60 * s, hgt); rr(px - 30 * s, py - hgt - 60 * s * .5, 60 * s, 60 * s * .62, 8 * s, 'rgba(21,23,28,.96)', F.col, 3 * s); img(I[b[0]], px, py - hgt - 12 * s, 40 * s); }
  } else {
    drawMap(c);
    const fa = seg(c.z, 1.6, 3.2);
    if (rep) { const p = seg(t, 68.6, 73.2); A(fa, () => drawFactory(c, FA, lerp(25, 38, p))); }
    else if (t >= 19 && t < 61) A(fa, () => drawFactory(c, F, t));
    else if (t >= 74 && t < 80) A(fa, () => drawFactory(c, FA, 60));
  }
  // vignette
  const g = x.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .95); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)'); x.fillStyle = g; x.fillRect(0, 0, W, H);

  if (t < 5.2) title(t);
  if (t >= 4.8 && t < 19.2) challenge(t, c);
  if (t >= 19 && t < 25) flyLabels(t, c);
  if (live) liveChrome(t, focus, tilt);
  if (rep) replay(t);
  if (t >= 74) world(t, c);
  if (t >= 83.6) endCard(t);
  wipe(t, 39.0, C.B); wipe(t, 46.0, C.A);
  x.restore();
}
function shade(hexc, k) { const n = parseInt(hexc.slice(1), 16); const r = (n >> 16) * k | 0, g = ((n >> 8) & 255) * k | 0, b = (n & 255) * k | 0; return `rgb(${r},${g},${b})`; }
let ctxStack = []; function swapCtx(nc, fn) { ctxStack.push(x); x = nc; try { fn(); } finally { x = ctxStack.pop(); } }

function title(t) {
  const a = 1 - seg(t, 4.4, 5.2);
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(11,12,15,.55)'); g.addColorStop(.6, 'rgba(11,12,15,.75)'); g.addColorStop(1, 'rgba(11,12,15,.95)');
  A(a, () => { x.fillStyle = g; x.fillRect(0, 0, W, H);
    const k1 = back(seg(t, .3, 1.1)); A(seg(t, .3, .8), () => { x.save(); x.translate(W / 2, 470 + (1 - k1) * 40); x.font = `800 120px ${FH}`; const tw = x.measureText('SaveBench').width; hex(-tw / 2 - 20, -40, 80, C.or); tx('SaveBench', 40, 0, `800 120px ${FH}`, C.tx, 'center'); x.restore(); });
    A(eo(seg(t, 1.6, 2.4)), () => tx('Watch AI build in the real game.', W / 2, 580 + (1 - eo(seg(t, 1.6, 2.4))) * 16, `600 40px ${FB}`, '#dfe2e8', 'center'));
  });
}
function challenge(t, c) {
  // region rect
  const [rx, ry] = S(c, 400, 3500), rw = 800 * c.z, rh = 450 * c.z;
  const ra = vis(t, 5.8, 19.4, .3, .6), dr = eio(seg(t, 5.8, 6.6));
  A(ra, () => { x.save(); x.strokeStyle = C.or; x.lineWidth = 4; x.fillStyle = `rgba(250,140,60,${.16 * dr})`; x.fillRect(rx, ry, rw, rh); x.setLineDash([2 * (rw + rh) * dr, 9999]); x.strokeRect(rx, ry, rw, rh); x.restore();
    A(seg(t, 6.4, 6.8), () => { rr(rx, ry + rh + 14, 170, 38, 8, C.or); tx('Grass Fields', rx + 85, ry + rh + 40, `800 19px ${FB}`, '#111', 'center'); }); });
  // contract card
  const cin = back(seg(t, 6.2, 6.9)), cout = eo(seg(t, 17.4, 18.4));
  const X0 = 1020 + (1 - cin) * 900 + cout * 1000, Y0 = 70;
  if (t < 6.2) return;
  x.save(); x.translate(X0, Y0);
  rr(0, 0, 860, 600, 18, C.pn, C.ln);
  tx('THE CHALLENGE', 40, 56, `600 15px ${FM}`, C.or);
  wrap('Build 15 Iron Plate/min and 10 Iron Rod/min.', 40, 110, 780, 46, `800 40px ${FH}`, C.tx);
  [[7.4, 'IronPlate', '15', 'Iron Plate'], [7.8, 'IronRod', '10', 'Iron Rod']].forEach(([t0, ic, n, nm], i) => { const k = back(seg(t, t0, t0 + .45)); if (k <= 0) return; x.save(); x.translate(40 + i * 400 + 180, 240); x.scale(k, k); rr(-180, -50, 380, 100, 14, C.pn2, C.ln); img(ic, -130, 0, 64); tx(n, -80, 14, `700 44px ${FM}`, C.tx); x.font = `700 44px ${FM}`; const w = x.measureText(n).width; tx('/min', -80 + w + 8, 14, `500 20px ${FM}`, C.mu); tx(nm, 110, 10, `600 20px ${FB}`, C.mu); x.restore(); });
  A(seg(t, 8.6, 9.0), () => tx('ALLOWED BUILDINGS', 40, 340, `600 15px ${FM}`, C.mu));
  ['MinerMk1', 'SmelterMk1', 'ConstructorMk1', 'ConveyorBeltMk1', 'ConveyorAttachmentSplitter', 'StorageContainerMk1'].forEach((ic, i) => { const k = back(seg(t, 8.9 + i * .22, 9.3 + i * .22)); if (k <= 0) return; x.save(); x.translate(80 + i * 92, 400); x.scale(k, k); rr(-38, -38, 76, 76, 12, C.pn2, C.ln); img(ic, 0, 0, 56); x.restore(); });
  A(seg(t, 10.6, 11.0), () => { img('OreIron', 64, 490, 44); tx('2 iron nodes · real positions', 100, 498, `600 21px ${FB}`, C.tx); });
  // contestants + lock
  [['A', C.A, 13.2], ['B', C.B, 13.7]].forEach(([L, col, t0], i) => { const k = back(seg(t, t0, t0 + .55)); if (k <= 0) return; const xx = 40 + i * 300 - (1 - k) * 120; x.save(); x.globalAlpha *= seg(t, t0, t0 + .3); rr(xx, 640, 280, 74, 12, C.pn, col, 2); badge(xx + 18, 660, L, col, 34); tx(`[model ${L}]`, xx + 66, 685, `700 21px ${FB}`, C.tx); x.restore(); });
  const lk = back(seg(t, 14.6, 15.1)); if (lk > 0) { const pressed = t >= 16.0; const pk = pressed ? 1 - .06 * Math.sin(Math.PI * seg(t, 16.0, 16.25)) : 1; x.save(); x.translate(40 + 620 + 100, 677); x.scale(lk * pk, lk * pk); if (pressed) { x.shadowColor = C.or; x.shadowBlur = 30 * (1 - seg(t, 16.2, 17.4)) + 8; } rr(-110, -37, 220, 74, 14, C.or, pressed ? '#ffd2ad' : null, 2); x.shadowBlur = 0; tx(pressed ? 'Contract locked' : 'Lock contract and start', 0, 7, `800 ${pressed ? 21 : 17}px ${FB}`, '#111', 'center'); x.restore(); }
  x.restore();
}
function flyLabels(t, c) {
  A(vis(t, 22.4, 25.2, .5, .5), () => { NODES.forEach(n => { const [nx, ny] = S(c, n[0], n[1]); rr(nx + 34, ny - 18, 196, 36, 8, C.pn, C.ln); tx('Iron node · Normal', nx + 48, ny + 6, `600 17px ${FB}`, C.tx); }); });
}
function liveChrome(t, focus, tilt) {
  const a = seg(t, 24.5, 25.3) * (1 - seg(t, 60.4, 61));
  topBar(t, a, 'live'); rail(t, a, focus); ticker(t, a * seg(t, 31, 31.4));
  let h = 'A is planning: two smelters feeding three constructors.', sub = 'Dashed icons are ideas: said, not yet written.';
  if (t >= 31) { h = 'A is building revision 2.'; sub = 'Solid icons exist in a stored revision. The game has not tested them yet.'; }
  if (t >= 39.35) { h = 'B is building revision 1: a splitter-fed line.'; }
  if (t >= 46.35) { h = 'Game lens: the same factory, in 3D.'; sub = 'Reconstruction, not game footage.'; }
  if (t >= 54) { h = "The game is running a trial of A's design."; sub = 'Numbers appear only when the game writes a measured window.'; }
  headline(t, a * seg(t, 25.6, 26.1), h, sub);
  let d = null; if (t >= 36 && t < 39) d = 'Cut to A: belts reach the depot'; if (t >= 40.8 && t < 46) d = 'Cut to B: first splitter placed'; if (t >= 46.4 && t < 54) d = 'Cut to A: game lens';
  if (t >= 25.8 && t < 31) d = 'Holding wide: A is planning';
  if (d) director(a, d);
  if (tilt > 0) A(tilt, () => { rr(24, 128, 420, 48, 24, C.pn, C.ln); tx('Reconstruction, not game footage', 234, 159, `700 19px ${FB}`, C.tx, 'center');
    const px = W - 440, py = 380; rr(px, py, 416, 236, 14, '#16181d', C.ln); x.save(); x.beginPath(); x.roundRect(px, py, 416, 236, 14); x.clip(); x.strokeStyle = '#1f2229'; x.lineWidth = 14; for (let i = -20; i < 40; i++) { x.beginPath(); x.moveTo(px + i * 28, py); x.lineTo(px + i * 28 + 236, py + 236); x.stroke(); } x.restore();
    tx('LIVE GAME FEED', px + 210, py + 100, `700 15px ${FM}`, C.or, 'center'); tx('Spectator capture from the dedicated server', px + 210, py + 132, `500 16px ${FB}`, '#dfe2e8', 'center'); tx('[PLACEHOLDER: real footage]', px + 210, py + 158, `500 16px ${FB}`, C.mu, 'center'); });
  // measurement panel
  const ma = back(seg(t, 54.6, 55.2)) * (1 - seg(t, 60.4, 61)); if (ma > 0) A(seg(t, 54.6, 55), () => { x.save(); x.translate(W - 440, 380); rr(0, 0, 416, 360, 16, C.pn, C.or, 1.5); tx('GAME TRIAL · MEASUREMENT', 26, 38, `600 14px ${FM}`, C.or);
    for (let i = 0; i < 3; i++) { const p = eio(seg(t, 55.2 + i * 1.5, 56.6 + i * 1.5)); tx(`Window ${i + 1}`, 26, 82 + i * 46, `600 16px ${FB}`, C.mu); rr(120, 68 + i * 46, 270, 16, 8, C.pn2); if (p > 0) rr(120, 68 + i * 46, 270 * p, 16, 8, C.or); }
    [['IronPlate', '15', 'Iron Plate'], ['IronRod', '10', 'Iron Rod']].forEach(([ic, n, nm], i) => { const y = 228 + i * 58; rr(20, y, 376, 50, 10, C.pn2); img(ic, 46, y + 25, 34); tx(`[PH] / ${n}`, 76, y + 33, `700 22px ${FM}`, C.tx); tx(`${nm} per min`, 380, y + 32, `500 15px ${FB}`, C.mu, 'right'); });
    tx('Awaiting game observation', 26, 350, `600 15px ${FB}`, C.mu); x.restore(); });
}
function compare(t) {
  const a = seg(t, 61, 61.7);
  for (let i = 0; i < 2; i++) {
    const F = i ? FBk : FA, ox0 = i * W / 2;
    x.save(); x.beginPath(); x.rect(ox0, 0, W / 2, H); x.clip();
    const c = { cx: 760, cy: 3800, z: 3.4, ox: ox0 + W / 4, oy: 520 };
    drawMap(c); drawFactory(c, F, 60, { noLabels: true });
    const g = x.createLinearGradient(0, H * .55, 0, H); g.addColorStop(0, 'rgba(11,12,15,0)'); g.addColorStop(1, 'rgba(11,12,15,.92)'); x.fillStyle = g; x.fillRect(ox0, 0, W / 2, H);
    x.restore();
  }
  // reveal: slide divider
  const d = eio(seg(t, 61, 61.8)); x.fillStyle = C.bg; x.fillRect(W / 2 - 3, 0, 6, H * d);
  A(a, () => {
    rr(W / 2 - 360, 24, 720, 56, 14, C.pn, C.ln); tx('Compare · same region, same zoom, same contract', W / 2, 60, `700 21px ${FB}`, C.tx, 'center');
    [[FA, 'A', 'revision 2'], [FBk, 'B', 'revision 1']].forEach(([F, L, rv], i) => { const ox0 = i * W / 2; rr(ox0 + 28, 104, 270, 56, 12, C.pn, F.col, 2); badge(ox0 + 42, 117, L, F.col, 30); tx(`[model ${L}] · ${rv}`, ox0 + 84, 140, `700 18px ${FB}`, C.tx);
      const cnt = {}; F.b.forEach(b => cnt[b[0]] = (cnt[b[0]] || 0) + 1);
      Object.keys(cnt).forEach((k, j) => { const kk = back(seg(t, 62 + j * .2 + i * .1, 62.4 + j * .2 + i * .1)); if (kk <= 0) return; x.save(); x.translate(ox0 + 70 + j * 130, H - 200); x.scale(kk, kk); rr(-42, -34, 116, 68, 12, C.pn, C.ln); img(I[k], -10, 0, 44); tx(`×${cnt[k]}`, 18, 10, `700 24px ${FM}`, C.tx); x.restore(); });
      A(seg(t, 63, 63.4), () => { tx('[PH] / 15 plates · [PH] / 10 rods per min', ox0 + 32, H - 120, `600 19px ${FM}`, C.mu); });
    });
    const b = back(seg(t, 63.5, 64.1)); if (b > 0) { x.save(); x.translate(W / 2, H - 58); x.scale(b, b); rr(-250, -30, 500, 60, 30, 'rgba(250,140,60,.18)', C.or, 2); tx('No winner is declared.', 0, 9, `800 26px ${FH}`, C.tx, 'center'); x.restore(); }
  });
  A(seg(t, 67.4, 68), () => { x.fillStyle = C.bg; x.fillRect(0, 0, W, H); });
}
const RMARK = [[0.08, 'MinerMk1', C.A], [0.3, 'SmelterMk1', C.A], [0.55, 'ConstructorMk1', C.A], [0.82, 'ConveyorBeltMk1', C.A], [0.95, 'IronPlate', C.or]];
function replay(t) {
  const a = seg(t, 68, 68.5) * (1 - seg(t, 74, 74.6));
  topBar(t, a, 'rec');
  A(a, () => { const p = seg(t, 68.6, 73.2); const X0 = 120, X1 = W - 120, y = H - 110; rr(60, H - 190, W - 120, 150, 16, C.pn, C.ln); tx('Replay', 96, H - 146, `800 26px ${FH}`, C.tx); tx('Scrub any moment', 210, H - 146, `500 18px ${FB}`, C.mu);
    rr(X0, y - 3, X1 - X0, 6, 3, C.ln); rr(X0, y - 3, (X1 - X0) * p, 6, 3, C.or);
    RMARK.forEach(([q, ic, col]) => { const mx = lerp(X0, X1, q), on = p >= q; const k = on ? back(seg(p, q, q + .05)) : 1; x.save(); x.translate(mx, y); x.scale(1 + .15 * (on ? Math.max(0, 1 - (p - q) * 8) : 0), 1 + .15 * (on ? Math.max(0, 1 - (p - q) * 8) : 0)); rr(-24, -24, 48, 48, 11, on ? '#2c313a' : C.pn, on ? col : C.ln, 2); img(ic, 0, 0, 32); x.restore(); });
    const px = lerp(X0, X1, p); x.fillStyle = C.tx; x.fillRect(px - 2, y - 40, 4, 80); });
}
const ROUTES = [{ a: [800, 3725], b: [4100, 4300], col: C.A, ic: 'TrainStation', t0: 76.6 }, { a: [4100, 4300], b: [6300, 2500], col: C.B, ic: 'DroneStation', t0: 77.2, dash: [4, 18] }, { a: [4100, 4300], b: [2900, 6300], col: C.C, ic: 'TruckStation', t0: 77.8 }, { a: [6300, 2500], b: [6700, 5600], col: C.D, ic: 'TrainStation', t0: 78.4, dash: [26, 14] }];
function qpt(r, u) { const mx = (r.a[0] + r.b[0]) / 2, my = (r.a[1] + r.b[1]) / 2 - 900; const v = 1 - u; return [v * v * r.a[0] + 2 * v * u * mx + u * u * r.b[0], v * v * r.a[1] + 2 * v * u * my + u * u * r.b[1]]; }
function world(t, c) {
  const a = seg(t, 76, 76.8);
  A(a, () => {
    for (const r of ROUTES) { const p = eio(seg(t, r.t0, r.t0 + 1.4)); if (p <= 0) continue; x.save(); x.lineCap = 'round'; x.beginPath(); for (let i = 0; i <= 60 * p; i++) { const q = qpt(r, i / 60); const s = S(c, q[0], q[1]); i ? x.lineTo(...s) : x.moveTo(...s); } x.strokeStyle = 'rgba(0,0,0,.6)'; x.lineWidth = 9; x.stroke(); x.setLineDash(r.dash || []); x.strokeStyle = r.col; x.lineWidth = 4.5; x.stroke(); x.restore();
      const e = S(c, ...r.b); const k = back(seg(t, r.t0 + 1.2, r.t0 + 1.6)); if (k > 0) { x.save(); x.translate(...e); x.scale(k, k); rr(-30, -30, 60, 60, 12, C.pn, r.col, 3); img(r.ic, 0, 0, 44); x.restore(); }
      if (t > r.t0 + 1.6) { const u = ((t - r.t0) * .22) % 1; const q = S(c, ...qpt(r, u)); x.beginPath(); x.arc(q[0], q[1], 9, 0, 7); x.fillStyle = r.col; x.shadowColor = r.col; x.shadowBlur = 14; x.fill(); x.shadowBlur = 0; } }
    const h = S(c, 4100, 4300), hp = .5 + .5 * Math.sin(t * 2.4); x.beginPath(); x.arc(h[0], h[1], 52 + 10 * hp, 0, 7); x.fillStyle = `rgba(250,140,60,${.14 + .1 * hp})`; x.fill(); rr(h[0] - 40, h[1] - 40, 80, 80, 16, C.pn, C.or, 3); img('SpaceElevator', h[0], h[1], 62);
    const g = S(c, 800, 3725); rr(g[0] - 30, g[1] - 22, 60, 44, 8, 'rgba(250,140,60,.25)', C.or, 3);
    rr(40, 40, 760, 150, 18, C.pn, C.ln); tx('WORLD SCALE', 72, 84, `600 15px ${FM}`, C.or); tx('From one line to the whole map.', 72, 136, `800 42px ${FH}`, C.tx); tx('Concept · routes illustrative', 72, 172, `500 19px ${FB}`, C.mu);
    A(seg(t, 79, 79.5), () => { rr(W - 330, 40, 290, 230, 16, C.pn, C.ln); [['TrainStation', 'Train route'], ['DroneStation', 'Drone route'], ['TruckStation', 'Truck route'], ['SpaceElevator', 'Space Elevator']].forEach(([ic, s], i) => { img(ic, W - 290, 86 + i * 50, 36); tx(s, W - 260, 93 + i * 50, `600 19px ${FB}`, C.tx); }); });
  });
}
function endCard(t) {
  const a = seg(t, 83.6, 84.4);
  A(a, () => { x.fillStyle = 'rgba(11,12,15,.86)'; x.fillRect(0, 0, W, H); x.font = `800 96px ${FH}`; const tw = x.measureText('SaveBench').width; hex(W / 2 - tw / 2 - 10, 392, 64, C.or); tx('SaveBench', W / 2 + 36, 424, `800 96px ${FH}`, C.tx, 'center');
    (data.end || ['Layouts are fixtures.', '[PH] values await the game.', 'Terrain and icons © Coffee Stain, private use.']).forEach((s, i, arr) => A(eo(seg(t, 84.6 + i * .5, 85.1 + i * .5)), () => tx(s, W / 2, 520 + i * 50, `500 28px ${FB}`, i === arr.length - 1 ? C.mu : '#dfe2e8', 'center'))); });
}

// ---------- sound cues (shared by preview and render) ----------
const CUES = [];
(function () {
  const q = (t, type, v = 1) => CUES.push({ t, type, v });
  q(0.2, 'swell', .7); q(0.4, 'whoosh'); q(1.6, 'tick');
  q(5.0, 'swell', .6); q(5.8, 'whoosh', .6); q(6.2, 'whoosh'); q(7.4, 'pop'); q(7.8, 'pop');
  for (let i = 0; i < 6; i++) q(8.9 + i * .22, 'tick');
  q(10.6, 'pop'); q(13.2, 'whoosh', .8); q(13.7, 'whoosh', .8); q(14.6, 'pop'); q(16.0, 'click'); q(17.4, 'whoosh', .7);
  q(19.0, 'swell', 1); q(24.5, 'tick');
  FA.b.forEach(b => { q(b[3], 'tick', .5); q(b[4], 'thud'); });
  FA.p.forEach(b => q(b.t0, 'zip', .5)); q(37.4, 'chime');
  q(39.0, 'whoosh'); FBk.b.forEach(b => q(b[4], 'thud', .7)); q(40.8, 'pop');
  q(46.0, 'whoosh'); q(46.8, 'swell', .7); q(53.3, 'swell', .5);
  q(54.6, 'whoosh', .7); for (let i = 0; i < 3; i++) q(56.6 + i * 1.5, 'tick');
  q(61.0, 'whoosh'); for (let i = 0; i < 9; i++) q(62 + i * .2, 'tick', .6); q(63.5, 'pop');
  q(68.0, 'whoosh', .7); RMARK.forEach(m => q(lerp(68.6, 73.2, m[0]), 'tick'));
  q(74.0, 'swell', 1); ROUTES.forEach(r => { q(r.t0, 'zip', .6); q(r.t0 + 1.2, 'pop'); });
  q(83.6, 'swell', .6); q(84.6, 'chime', .7);
  CUES.sort((a, b) => a.t - b.t);
})();
function sfx(ac, out, type, at, v = 1) {
  const g = ac.createGain(); g.connect(out);
  const env = (a, d, peak) => { g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(peak * v, at + a); g.gain.exponentialRampToValueAtTime(0.0001, at + a + d); };
  const osc = (type, f0, f1, dur) => { const o = ac.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, at); if (f1) o.frequency.exponentialRampToValueAtTime(f1, at + dur); o.connect(g); o.start(at); o.stop(at + dur + .05); return o; };
  const noise = (dur, f0, f1, q = 1.2) => { const n = ac.createBufferSource(), len = Math.ceil(ac.sampleRate * dur), b = ac.createBuffer(1, len, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = q; f.frequency.setValueAtTime(f0, at); f.frequency.exponentialRampToValueAtTime(f1, at + dur); n.connect(f); f.connect(g); n.start(at); n.stop(at + dur); };
  switch (type) {
    case 'thud': env(.005, .28, .5); osc('sine', 120, 48, .3); break;
    case 'tick': env(.002, .05, .18); osc('triangle', 2200, 1800, .06); break;
    case 'pop': env(.004, .14, .25); osc('sine', 520, 880, .14); break;
    case 'click': env(.001, .08, .45); noise(.08, 3000, 1500, 3); osc('square', 900, 600, .05); break;
    case 'whoosh': env(.12, .35, .18); noise(.5, 400, 2400, .8); break;
    case 'zip': env(.05, .5, .08); noise(.55, 1200, 3800, 4); break;
    case 'swell': env(.8, 1.6, .12); osc('sine', 55, 82, 2.4); osc('triangle', 110, 164, 2.4); break;
    case 'chime': env(.01, 1.1, .2); [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => { const o = ac.createOscillator(), gg = ac.createGain(); o.type = 'sine'; o.frequency.value = f; gg.gain.setValueAtTime(0.0001, at + i * .08); gg.gain.exponentialRampToValueAtTime(.18 * v, at + i * .08 + .01); gg.gain.exponentialRampToValueAtTime(0.0001, at + i * .08 + .9); o.connect(gg); gg.connect(out); o.start(at + i * .08); o.stop(at + i * .08 + 1); }); break;
  }
}
function mixTo(ac, out) { const comp = ac.createDynamicsCompressor(); comp.connect(out); const m = ac.createGain(); m.gain.value = .8; m.connect(comp); return m; }
async function renderAudio() { const sr = 48000, ac = new OfflineAudioContext(2, sr * DUR, sr); const m = mixTo(ac, ac.destination); CUES.forEach(c => sfx(ac, m, c.type, c.t, c.v)); const buf = await ac.startRendering(); return wav(buf); }
function wav(buf) { const ch = buf.numberOfChannels, len = buf.length, sr = buf.sampleRate, bytes = 44 + len * ch * 2, ab = new ArrayBuffer(bytes), v = new DataView(ab); const ws = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); }; ws(0, 'RIFF'); v.setUint32(4, bytes - 8, true); ws(8, 'WAVE'); ws(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, ch, true); v.setUint32(24, sr, true); v.setUint32(28, sr * ch * 2, true); v.setUint16(32, ch * 2, true); v.setUint16(34, 16, true); ws(36, 'data'); v.setUint32(40, len * ch * 2, true); const cd = []; for (let c = 0; c < ch; c++) cd.push(buf.getChannelData(c)); let o = 44; for (let i = 0; i < len; i++) for (let c = 0; c < ch; c++) { v.setInt16(o, Math.max(-1, Math.min(1, cd[c][i])) * 32767, true); o += 2; } let s = ''; const u8 = new Uint8Array(ab); for (let i = 0; i < u8.length; i += 32768) s += String.fromCharCode.apply(null, u8.subarray(i, i + 32768)); return btoa(s); }


  return {
    dur: DUR, cues: CUES, chips: data.chips,
    frame(t) {
      frame(t);
      x = x0; x.save();
      const s = data.watermark || 'CONCEPT. NOT REAL PLAY.';
      x.font = `700 20px ${FM}`; const w = x.measureText(s).width + 48;
      x.beginPath(); x.roundRect(W / 2 - w / 2, H - 62, w, 44, 22); x.fillStyle = 'rgba(11,12,15,.92)'; x.fill(); x.lineWidth = 2; x.strokeStyle = '#f2c14e'; x.stroke();
      x.fillStyle = '#f2c14e'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(s, W / 2, H - 39);
      x.restore();
    }
  };
};

// =====================================================================================
// Engine "v2": every scene is drawn from the version's scenes.json. Nothing is invented here.
// =====================================================================================
ENG.v2 = function (x, IM, data, ctl) {
  const ICON = { miner:'MinerMk1', smelter:'SmelterMk1', con:'ConstructorMk1', store:'StorageContainerMk1', bank:'StorageContainerMk1', relay:'StorageContainerMk1' };
  function rr(X, Y, w, h, r, fill, stroke, lw = 1) { x.beginPath(); x.roundRect(X, Y, w, h, r); if (fill) { x.fillStyle = fill; x.fill(); } if (stroke) { x.lineWidth = lw; x.strokeStyle = stroke; x.stroke(); } }
  function tx(s, X, Y, font, col, al = 'left', base = 'alphabetic') { x.font = font; x.fillStyle = col; x.textAlign = al; x.textBaseline = base; x.fillText(s, X, Y); }
  function has(n) { return n && IM[n]; }
  function img(n, X, Y, s) { const m = IM[n]; if (m) x.drawImage(m, X - s / 2, Y - s / 2, s, s); }
  function A(a, fn) { if (a <= 0.001) return; x.save(); x.globalAlpha *= clamp(a); fn(); x.restore(); }
  function hex(X, Y, s, col) { x.save(); x.translate(X, Y); x.scale(s / 26, s / 26); x.translate(-13, -15); x.strokeStyle = col; x.lineWidth = 2.6; x.beginPath(); x.moveTo(13, 2); x.lineTo(24, 8); x.lineTo(24, 22); x.lineTo(13, 28); x.lineTo(2, 22); x.lineTo(2, 8); x.closePath(); x.stroke(); x.fillStyle = col; x.beginPath(); x.moveTo(13, 9); x.lineTo(19, 12.5); x.lineTo(19, 17.5); x.lineTo(13, 21); x.lineTo(7, 17.5); x.lineTo(7, 12.5); x.closePath(); x.fill(); x.restore(); }
  function badge(X, Y, letter, col, s = 30) { rr(X, Y, s, s, 7, 'rgba(0,0,0,.25)', col, 2.5); tx(letter, X + s / 2, Y + s / 2 + 1, `800 ${s * .55}px ${FB}`, col, 'center', 'middle'); }
  function lines(s, maxW, font) { x.font = font; const out = []; let line = ''; for (const w of String(s).split(' ')) { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out; }
  function wrap(s, X, Y, maxW, lh, font, col, al = 'left') { const ls = lines(s, maxW, font); ls.forEach((l, i) => tx(l, X, Y + i * lh, font, col, al)); return Y + (ls.length - 1) * lh; }
  function dot(it, X, Y, r) { x.beginPath(); x.arc(X, Y, r, 0, 7); x.fillStyle = 'rgba(11,12,15,.9)'; x.fill(); if (has(it.icon)) img(it.icon, X, Y, r * 1.7); else { x.beginPath(); x.arc(X, Y, r * .62, 0, 7); x.fillStyle = it.color || C.mu; x.fill(); } }
  function itemIcon(it, X, Y, s) { if (has(it.icon)) img(it.icon, X, Y, s); else { rr(X - s * .36, Y - s * .36, s * .72, s * .72, s * .16, it.color || C.mu); } }
  function along(pts, d) { for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (d <= l) return [lerp(a[0], b[0], d / l), lerp(a[1], b[1], d / l)]; d -= l; } return pts[pts.length - 1]; }
  function plen(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }
  function partial(pts, L) { x.beginPath(); let d = 0; x.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], e = pts[i], l = Math.hypot(e[0] - a[0], e[1] - a[1]); if (d + l >= L) { const q = l ? (L - d) / l : 0; x.lineTo(lerp(a[0], e[0], q), lerp(a[1], e[1], q)); break; } x.lineTo(e[0], e[1]); d += l; } }
  function vignette() { const g = x.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .95); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
  function bgWorld(k, dark) { x.fillStyle = C.bg; x.fillRect(0, 0, W, H); const m = IM.world; if (m) { const s = lerp(2500, 2050, k); x.drawImage(m, W / 2 - s / 2, H / 2 - s / 2 - 40, s, s); } x.fillStyle = `rgba(11,12,15,${dark})`; x.fillRect(0, 0, W, H); vignette(); }
  function bgPanel() { x.fillStyle = '#0e1014'; x.fillRect(0, 0, W, H); x.strokeStyle = 'rgba(255,255,255,.035)'; x.lineWidth = 1; x.beginPath(); for (let gx = 0; gx <= W; gx += 60) { x.moveTo(gx, 0); x.lineTo(gx, H); } for (let gy = 0; gy <= H; gy += 60) { x.moveTo(0, gy); x.lineTo(W, gy); } x.stroke(); vignette(); }
  function bolt(X, Y, s, col) { x.save(); x.translate(X, Y); x.scale(s / 40, s / 40); x.beginPath(); x.moveTo(4, -20); x.lineTo(-12, 3); x.lineTo(-1, 3); x.lineTo(-5, 20); x.lineTo(12, -4); x.lineTo(1, -4); x.closePath(); x.fillStyle = col; x.fill(); x.restore(); }

  // precompute
  for (const sc of data.scenes) if (sc.type === 'build') { (sc.belts || []).forEach(b => b.L = plen(b.pts)); (sc.wires || []).forEach(b => b.L = plen(b.pts)); (sc.carries || []).forEach(b => b.L = plen(b.pts)); }

  function title(sc, u) {
    bgWorld(seg(u, 0, sc.t1 - sc.t0), .7);
    const k1 = back(seg(u, .3, 1.1));
    A(seg(u, .3, .8), () => { x.save(); x.translate(W / 2, 450 + (1 - k1) * 40); x.font = `800 130px ${FH}`; const tw = x.measureText('SaveBench').width; hex(-tw / 2 - 22, -44, 88, C.or); tx('SaveBench', 44, 0, `800 130px ${FH}`, C.tx, 'center'); x.restore(); });
    A(eo(seg(u, 1.4, 2.2)), () => wrap(sc.line, W / 2, 590, 1400, 62, `600 46px ${FB}`, '#dfe2e8', 'center'));
    A(eo(seg(u, 2.8, 3.5)), () => { x.font = `700 24px ${FM}`; const w = x.measureText(sc.sub).width + 64; rr(W / 2 - w / 2, 752, w, 58, 29, 'rgba(250,140,60,.16)', C.or, 2); tx(sc.sub, W / 2, 789, `700 24px ${FM}`, C.tx, 'center'); });
  }

  function challenge(sc, u) {
    bgWorld(.5, .84);
    const cin = back(seg(u, .2, .9));
    x.save(); x.translate(90 - (1 - cin) * 300, 110); x.globalAlpha *= seg(u, .2, .6);
    rr(0, 0, 1010, 860, 18, C.pn, C.ln);
    tx(sc.eyebrow, 48, 66, `600 18px ${FM}`, C.or);
    const y1 = wrap(sc.head, 48, 134, 910, 58, `800 50px ${FH}`, C.tx);
    tx(sc.costHead, 48, y1 + 66, `600 17px ${FM}`, C.mu);
    sc.cost.forEach((c, i) => { const k = back(seg(u, 1.4 + i * .4, 1.85 + i * .4)); if (k <= 0) return; x.save(); x.translate(48 + i * 310 + 147, y1 + 148); x.scale(k, k); rr(-147, -56, 294, 112, 14, C.pn2, C.ln); itemIcon(c, -98, 0, 68); tx(String(c.n), -50, 12, `700 48px ${FM}`, C.tx); tx(c.name, -50, 42, `600 19px ${FB}`, C.mu); x.restore(); });
    tx(sc.rulesHead, 48, y1 + 268, `600 17px ${FM}`, C.mu);
    sc.rules.forEach((r, i) => A(eo(seg(u, 3.4 + i * .7, 4.0 + i * .7)), () => { const yy = y1 + 324 + i * 62; x.beginPath(); x.arc(64, yy - 10, 10, 0, 7); x.fillStyle = C.or; x.fill(); tx(r, 96, yy, `600 30px ${FB}`, C.tx); }));
    A(eo(seg(u, 10.2, 10.9)), () => { const yy = y1 + 324 + sc.rules.length * 62 + 4, ls = lines(sc.judge, 860, `700 25px ${FB}`), bh = 34 + ls.length * 34; rr(48, yy, 914, bh, 12, 'rgba(250,140,60,.14)', C.or, 1.5); ls.forEach((l, j) => tx(l, 74, yy + 44 + j * 34, `700 25px ${FB}`, C.tx)); });
    x.restore();
    // players
    tx(sc.playersHead, 1170, 176, `600 18px ${FM}`, C.or);
    sc.players.forEach((p, i) => { const t0 = 6.2 + i * .7, k = back(seg(u, t0, t0 + .55)); if (k <= 0) return; const col = C[p.col], yy = 212 + i * 300; x.save(); x.globalAlpha *= seg(u, t0, t0 + .3); x.translate((1 - k) * 200, 0); rr(1170, yy, 660, 268, 16, C.pn, col, 2.5); badge(1200, yy + 30, p.letter, col, 60); tx(p.name, 1280, yy + 76, `800 44px ${FH}`, C.tx); tx(p.kind, 1200, yy + 136, `700 19px ${FM}`, col); wrap(p.note, 1200, yy + 180, 600, 34, `500 25px ${FB}`, C.mu); x.restore(); });
  }

  function topBar(sc, u) {
    const col = C[sc.who.col];
    rr(24, 24, W - 48, 76, 16, C.pn, C.ln);
    hex(64, 62, 32, C.or); tx('SaveBench', 92, 72, `800 28px ${FH}`, C.tx);
    badge(270, 44, sc.who.letter, col, 36); tx(sc.who.name, 318, 71, `800 24px ${FB}`, C.tx);
    x.font = `800 24px ${FB}`; const nw = x.measureText(sc.who.name).width;
    tx(sc.who.kind, 318 + nw + 18, 70, `700 15px ${FM}`, col);
    x.font = `700 16px ${FM}`; const pw = x.measureText(sc.pill).width + 36; rr(W - 48 - pw, 43, pw, 38, 9, sc.pillCol === 'bad' ? 'rgba(255,138,122,.14)' : 'rgba(125,220,154,.14)', sc.pillCol === 'bad' ? C.bad : C.ok, 1.5); tx(sc.pill, W - 48 - pw / 2, 68, `700 16px ${FM}`, C.tx, 'center');
    tx(sc.tag, W - 48 - pw - 24, 70, `600 21px ${FB}`, C.mu, 'right');
  }
  function tile(b, u, col) {
    const k = back(seg(u, b.t, b.t + .45)); if (k <= 0) return;
    const big = b.size || 92, s = big * k, off = b.off && u >= b.off.t, sc = off ? '#6b7280' : col;
    x.save(); x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 14; x.shadowOffsetY = 5;
    rr(b.x - s / 2, b.y - s / 2, s, s, 15 * k, 'rgba(21,23,28,.97)', sc, 3.5); x.restore();
    A(off ? .45 : 1, () => { if (b.kind === 'burner') bolt(b.x, b.y, s * .62, C.pw); else if (has(ICON[b.kind])) img(ICON[b.kind], b.x, b.y, s * .74); else tx((b.label || '?').slice(0, 2), b.x, b.y + 2, `800 ${s * .34}px ${FB}`, col, 'center', 'middle'); });
    if (b.label) A(seg(u, b.t + .2, b.t + .5), () => { const ls = b.label.split('\n'); ls.forEach((l, i) => tx(l, b.x, b.y + big / 2 + 30 + i * 24, `600 ${i ? 18 : 21}px ${FB}`, i ? C.mu : C.tx, 'center')); });
    if (off) { const kk = back(seg(u, b.off.t, b.off.t + .4)); x.save(); x.translate(b.x, b.y - big / 2 - 26); x.scale(kk, kk); x.font = `700 16px ${FM}`; const w = x.measureText(b.off.text).width + 26; rr(-w / 2, -17, w, 34, 17, 'rgba(40,14,12,.96)', C.bad, 2); tx(b.off.text, 0, 6, `700 16px ${FM}`, C.bad, 'center'); x.restore(); }
  }
  function build(sc, u) {
    bgPanel();
    const col = C[sc.who.col];
    // ore nodes
    for (const n of sc.nodes || []) A(seg(u, n.t || 0, (n.t || 0) + .5), () => { const p = .5 + .5 * Math.sin(u * 3); x.beginPath(); x.arc(n.x, n.y, 78 + 8 * p, 0, 7); x.fillStyle = `rgba(250,140,60,${.07 + .07 * p})`; x.fill(); x.save(); x.setLineDash([8, 8]); x.beginPath(); x.arc(n.x, n.y, 72, 0, 7); x.strokeStyle = C.or; x.lineWidth = 2; x.stroke(); x.restore(); tx(n.label, n.x, n.y - 90, `700 19px ${FM}`, C.or, 'center'); });
    // power wires
    for (const w of sc.wires || []) { const pr = eio(seg(u, w.t, w.t + .6)); if (pr <= 0) continue; x.save(); x.lineCap = 'round'; partial(w.pts, w.L * pr); x.strokeStyle = 'rgba(242,193,78,.75)'; x.lineWidth = 3; x.setLineDash([3, 9]); x.stroke(); x.restore(); }
    // belts
    for (const b of sc.belts || []) {
      const pr = eio(seg(u, b.t, b.t + .8)); if (pr <= 0) continue;
      const no = b.refused && u >= b.refused.t;
      x.save(); x.lineJoin = 'round'; x.lineCap = 'round';
      partial(b.pts, b.L * pr); x.strokeStyle = 'rgba(0,0,0,.6)'; x.lineWidth = 18; x.stroke();
      partial(b.pts, b.L * pr); if (b.refused) x.setLineDash([14, 16]); x.strokeStyle = no ? C.bad : col; x.lineWidth = 8; x.globalAlpha *= b.refused ? .8 : 1; x.stroke(); x.restore();
      if (no) { const kk = back(seg(u, b.refused.t, b.refused.t + .4)); const m = along(b.pts, b.L / 2); x.save(); x.translate(m[0], m[1]); x.scale(kk, kk); x.beginPath(); x.arc(0, 0, 24, 0, 7); x.fillStyle = 'rgba(40,14,12,.97)'; x.fill(); x.strokeStyle = C.bad; x.lineWidth = 3; x.stroke(); x.beginPath(); x.moveTo(-9, -9); x.lineTo(9, 9); x.moveTo(9, -9); x.lineTo(-9, 9); x.stroke(); const ls = b.refused.text.split('\n'); ls.forEach((l, i) => tx(l, 0, -72 + (i - ls.length + 2) * 28 + 0, `700 21px ${FB}`, C.bad, 'center')); x.restore(); }
      if (b.item && !b.refused) { const run = u - (b.t + .8), sp = 150, gap = 54; if (run > 0) { const it = (b.item2 && u >= b.item2.t) ? b.item2 : b.item; const head = Math.min(b.L, run * sp); for (let d = (run * sp) % gap; d <= head; d += gap) { const p = along(b.pts, d); dot(it, p[0], p[1], 15); } } }
    }
    // carries (a declared hand move, drawn differently from a belt)
    for (const c of sc.carries || []) { const pr = eio(seg(u, c.t, c.t + 1.2)); if (pr <= 0) continue; x.save(); x.lineCap = 'round'; partial(c.pts, c.L * pr); x.setLineDash([4, 12]); x.strokeStyle = '#dfe2e8'; x.lineWidth = 4; x.stroke(); x.restore(); const p = along(c.pts, c.L * pr); dot(c.item, p[0], p[1], 17); A(seg(u, c.t + .3, c.t + .7), () => { const m = along(c.pts, c.L * .5); x.font = `700 17px ${FB}`; const w = x.measureText(c.label).width + 26; rr(m[0] + 22, m[1] - 18, w, 36, 8, C.pn, '#dfe2e8', 1.5); tx(c.label, m[0] + 35, m[1] + 6, `700 17px ${FB}`, C.tx); }); }
    for (const b of sc.buildings || []) tile(b, u, col);
    topBar(sc, u);
    // counters
    const cs = sc.counters || []; if (cs.length) { const px = 1470, py = 128, ph = 62 + cs.length * 92; rr(px, py, 426, ph, 16, C.pn, C.ln); tx(sc.counterHead, px + 24, py + 38, `600 14px ${FM}`, C.or);
      cs.forEach((c, i) => { const y = py + 60 + i * 92; const v = Math.round(c.made * eio(seg(u, c.t0, c.t1))), done = v >= c.want; rr(px + 16, y, 394, 80, 12, C.pn2); itemIcon(c, px + 52, y + 32, 46); tx(c.name, px + 86, y + 28, `600 19px ${FB}`, C.mu); tx(`${v}`, px + 86, y + 58, `700 28px ${FM}`, done ? C.ok : C.tx); x.font = `700 28px ${FM}`; const vw = x.measureText(`${v}`).width; tx(`/ ${c.want}`, px + 94 + vw, y + 58, `600 19px ${FM}`, C.mu); rr(px + 230, y + 42, 164, 12, 6, '#2c313a'); if (v > 0) rr(px + 230, y + 42, 164 * clamp(v / c.want), 12, 6, done ? C.ok : C.or); if (done) tx('reached', px + 394, y + 28, `700 14px ${FM}`, C.ok, 'right'); }); }
    // caption
    const cap = (sc.captions || []).filter(c => u >= c.t).pop();
    if (cap) A(seg(u, .3, .8), () => { rr(24, H - 232, 1010, 208, 16, C.pn, C.ln); tx('WHAT IS HAPPENING', 52, H - 194, `600 14px ${FM}`, C.or); const k = eo(seg(u, cap.t, cap.t + .35)); A(.35 + .65 * k, () => { const yy = wrap(cap.h, 52, H - 150, 950, 38, `800 30px ${FH}`, C.tx); if (cap.sub) wrap(cap.sub, 52, yy + 40, 950, 28, `500 21px ${FB}`, C.mu); }); });
    // events
    const ev = (sc.events || []).filter(e => u >= e.t).slice(-4).reverse();
    A(seg(u, .3, .8), () => { rr(1470, H - 232, 426, 208, 16, C.pn, C.ln); tx('EVENTS', 1496, H - 194, `600 14px ${FM}`, C.mu); ev.forEach((e, i) => { const k = back(seg(u, e.t, e.t + .45)); A(k, () => { const yy = H - 176 + i * 38; x.fillStyle = e.bad ? C.bad : col; x.fillRect(1496, yy, 4, 26); tx(e.text, 1512, yy + 20, `600 19px ${FB}`, C.tx); }); }); });
    // stamp
    stampDraw(sc, u);
  }
  function stampDraw(sc, u) {
    if (sc.stamp && u >= sc.stamp.t && !(sc.stamp.until && u >= sc.stamp.until)) { const k = back(seg(u, sc.stamp.t, sc.stamp.t + .5)), bad = sc.stamp.col === 'bad', cc = bad ? C.bad : C.ok; x.save(); x.translate(sc.stamp.x || 735, sc.stamp.y || 455); x.scale(k, k); x.globalAlpha *= seg(u, sc.stamp.t, sc.stamp.t + .2); x.shadowColor = cc; x.shadowBlur = 40; rr(-400, -84, 800, 168, 22, bad ? 'rgba(40,14,12,.97)' : 'rgba(12,34,22,.97)', cc, 4); x.shadowBlur = 0; tx(sc.stamp.text, 0, -10, `800 56px ${FH}`, cc, 'center'); wrap(sc.stamp.sub, 0, 36, 740, 28, `600 21px ${FB}`, C.tx, 'center'); x.restore(); }
  }


  // a real game film clip, played in sync with the timeline, with what it shows beside it
  function film(sc, u) {
    bgPanel();
    const col = C[(sc.who && sc.who.col) || 'A'];
    tx(sc.eyebrow, 60, 70, `600 16px ${FM}`, C.or); tx(sc.head, 60, 120, `800 46px ${FH}`, C.tx);
    const VX = 60, VY = 150, VW = 1216, VH = 684, k = eo(seg(u, .1, .7));
    x.save(); x.globalAlpha *= seg(u, .1, .4); x.translate(VX + VW / 2, VY + VH / 2); x.scale(.96 + .04 * k, .96 + .04 * k); x.translate(-VW / 2, -VH / 2);
    x.save(); x.beginPath(); x.roundRect(0, 0, VW, VH, 14); x.clip();
    const v = ctl && ctl.vids && ctl.vids[sc.film], m = (v && v.readyState >= 2) ? v : IM[sc.poster];
    if (m) { const mw = m.videoWidth || m.width, mh = m.videoHeight || m.height, r = Math.max(VW / mw, VH / mh); x.drawImage(m, (VW - mw * r) / 2, (VH - mh * r) / 2, mw * r, mh * r); } else { x.fillStyle = C.pn2; x.fillRect(0, 0, VW, VH); }
    x.restore(); rr(0, 0, VW, VH, 14, null, col, 3);
    x.font = `700 17px ${FM}`; const dw = x.measureText(sc.date).width + 28; rr(18, 18, dw, 36, 9, 'rgba(11,12,15,.9)', C.or, 1.5); tx(sc.date, 32, 42, `700 17px ${FM}`, C.tx);
    const rt = sc.filmTag || 'REAL GAME FOOTAGE'; const rw = x.measureText(rt).width + 28; rr(VW - 18 - rw, 18, rw, 36, 9, 'rgba(11,12,15,.9)', C.ok, 1.5); tx(rt, VW - 18 - rw / 2, 42, `700 17px ${FM}`, C.ok, 'center');
    x.restore();
    // side panel: who and what the film shows
    const PX = 1306, PY = 150, PW = 554, PH = 684;
    A(eo(seg(u, .4, .9)), () => { rr(PX, PY, PW, PH, 16, C.pn, C.ln);
      if (sc.who) { badge(PX + 28, PY + 28, sc.who.letter, col, 48); tx(sc.who.name, PX + 92, PY + 64, `800 30px ${FH}`, C.tx); tx(sc.who.kind, PX + 28, PY + 112, `700 15px ${FM}`, col); }
      let yy = PY + 160;
      (sc.rows || []).forEach((r, i) => { const t0 = r.t != null ? r.t : 1 + i * .8, kk = eo(seg(u, t0, t0 + .4)); const ls = lines(r.v, PW - 56, `600 24px ${FB}`); A(kk, () => { tx(r.k, PX + 28, yy, `700 14px ${FM}`, C.mu); ls.forEach((l, j) => tx(l, PX + 28, yy + 32 + j * 31, `600 24px ${FB}`, r.col ? C[r.col] : C.tx)); }); yy += 54 + ls.length * 31; });
      if (sc.label) { const ok = sc.label === 'VERIFIED', lc = ok ? C.ok : C.un; x.font = `700 15px ${FM}`; const lw = x.measureText(sc.label).width + 28; rr(PX + 28, PY + PH - 64, lw, 36, 9, ok ? 'rgba(125,220,154,.12)' : 'rgba(242,193,78,.12)', lc, 1.5); tx(sc.label, PX + 42, PY + PH - 40, `700 15px ${FM}`, lc); if (sc.labelNote) wrap(sc.labelNote, PX + 40 + lw, PY + PH - 50, PW - lw - 64, 20, `500 16px ${FB}`, C.mu); }
    });
    // caption under the film
    const cap = (sc.captions || []).filter(c => u >= c.t).pop();
    if (cap) { const kc = eo(seg(u, cap.t, cap.t + .35)); A(.3 + .7 * kc, () => { const yy = wrap(cap.h, 60, 900, 1800, 40, `800 32px ${FH}`, C.tx); if (cap.sub) wrap(cap.sub, 60, yy + 42, 1800, 30, `500 23px ${FB}`, C.mu); }); }
    stampDraw(sc, u);
  }

  function footage(sc, u) {
    bgPanel();
    tx(sc.eyebrow, 120, 70, `600 16px ${FM}`, C.or); tx(sc.head, 120, 116, `800 44px ${FH}`, C.tx); tx(sc.credit, W - 120, 112, `500 18px ${FB}`, C.mu, 'right');
    const cw = 800, chh = 450 * .78, cell = [[120, 160], [1000, 160], [120, 600], [1000, 600]];
    sc.shots.forEach((s, i) => { const t0 = .5 + i * 1.5, k = back(seg(u, t0, t0 + .5)); if (k <= 0) return; const [cx, cy] = cell[i]; x.save(); x.globalAlpha *= seg(u, t0, t0 + .3); x.translate(cx + cw / 2, cy + chh / 2); x.scale(.9 + .1 * k, .9 + .1 * k); x.translate(-cw / 2, -chh / 2);
      x.save(); x.beginPath(); x.roundRect(0, 0, cw, chh, 12); x.clip(); const m = IM[s.img]; if (m) { const r = Math.max(cw / m.width, chh / m.height), dw = m.width * r, dh = m.height * r; x.drawImage(m, (cw - dw) / 2, (chh - dh) / 2, dw, dh); } else { x.fillStyle = C.pn2; x.fillRect(0, 0, cw, chh); } const g = x.createLinearGradient(0, chh - 150, 0, chh); g.addColorStop(0, 'rgba(11,12,15,0)'); g.addColorStop(1, 'rgba(11,12,15,.93)'); x.fillStyle = g; x.fillRect(0, chh - 150, cw, 150); x.restore();
      rr(0, 0, cw, chh, 12, null, C.ln, 2);
      x.font = `700 16px ${FM}`; const dw2 = x.measureText(s.date).width + 24; rr(16, 16, dw2, 32, 8, 'rgba(11,12,15,.9)', C.or, 1.5); tx(s.date, 28, 38, `700 16px ${FM}`, C.tx);
      const ls = lines(s.caption, cw - 48, `600 21px ${FB}`); ls.forEach((l, j) => tx(l, 24, chh - 22 - (ls.length - 1 - j) * 28, `600 21px ${FB}`, C.tx));
      x.restore(); });
  }

  function score(sc, u) {
    bgPanel();
    tx(sc.eyebrow, 120, 70, `600 16px ${FM}`, C.or); tx(sc.head, 120, 116, `800 44px ${FH}`, C.tx);
    sc.cols.forEach((c, i) => { const col = C[c.col], X0 = 120 + i * 860, t0 = .4 + i * .3, k = eo(seg(u, t0, t0 + .5)); A(k, () => { rr(X0, 160, 820, 690, 18, C.pn, col, 2.5); badge(X0 + 30, 190, c.letter, col, 52); tx(c.name, X0 + 100, 230, `800 38px ${FH}`, C.tx); x.font = `800 38px ${FH}`; const nw = x.measureText(c.name).width; tx(c.kind, X0 + 118 + nw, 228, `700 16px ${FM}`, col);
      let yy = 300; c.rows.forEach((r, j) => { const tt = 1.4 + j * .7 + i * .35, kk = eo(seg(u, tt, tt + .45)); const ls = lines(r.text, 640, `600 27px ${FB}`); A(kk, () => { const cc = r.ok === true ? C.ok : r.ok === false ? C.bad : C.mu; x.beginPath(); x.arc(X0 + 50, yy + 4, 14, 0, 7); x.fillStyle = cc; x.fill(); x.strokeStyle = '#0b0c0f'; x.lineWidth = 3.5; x.lineCap = 'round'; x.beginPath(); if (r.ok === true) { x.moveTo(X0 + 43, yy + 4); x.lineTo(X0 + 48, yy + 10); x.lineTo(X0 + 57, yy - 2); } else if (r.ok === false) { x.moveTo(X0 + 44, yy - 2); x.lineTo(X0 + 56, yy + 10); x.moveTo(X0 + 56, yy - 2); x.lineTo(X0 + 44, yy + 10); } else { x.moveTo(X0 + 44, yy + 4); x.lineTo(X0 + 56, yy + 4); } x.stroke(); tx(r.date, X0 + 84, yy - 4, `700 17px ${FM}`, C.mu); if (r.label) tx(r.label, X0 + 790, yy - 4, `700 15px ${FM}`, r.label === 'VERIFIED' ? C.ok : C.un, 'right'); ls.forEach((l, q) => tx(l, X0 + 84, yy + 32 + q * 35, `600 27px ${FB}`, C.tx)); }); yy += 70 + ls.length * 35; });
      const tk = back(seg(u, 4.6 + i * .3, 5.1 + i * .3)); if (tk > 0) { x.save(); x.translate(X0 + 410, 790); x.scale(tk, tk); rr(-380, -36, 760, 72, 14, C.pn2, col, 2); tx(c.total, 0, 9, `800 28px ${FH}`, C.tx, 'center'); x.restore(); } }); });
    const b = back(seg(u, 5.4, 6)); if (b > 0) { x.save(); x.translate(W / 2, 940); x.scale(b, b); x.font = `800 30px ${FH}`; const w = x.measureText(sc.banner).width + 80; rr(-w / 2, -36, w, 72, 36, 'rgba(250,140,60,.18)', C.or, 2); tx(sc.banner, 0, 10, `800 30px ${FH}`, C.tx, 'center'); x.restore(); }
  }

  function timeline(sc, u) {
    bgPanel();
    tx(sc.eyebrow, 120, 70, `600 16px ${FM}`, C.or); tx(sc.head, 120, 116, `800 44px ${FH}`, C.tx);
    const X0 = 210, X1 = W - 210, y = 450, n = sc.marks.length, p = eio(seg(u, .4, .4 + n * .9));
    rr(X0, y - 3, X1 - X0, 6, 3, C.ln); rr(X0, y - 3, (X1 - X0) * p, 6, 3, C.or);
    sc.marks.forEach((m, i) => { const q = n > 1 ? i / (n - 1) : 0, mx = lerp(X0, X1, q), t0 = .4 + i * .9, k = back(seg(u, t0, t0 + .45)); if (k <= 0) return; x.save(); x.translate(mx, y); x.scale(k, k); x.beginPath(); x.arc(0, 0, 15, 0, 7); x.fillStyle = m.concept ? C.un : C.or; x.fill(); x.strokeStyle = '#0b0c0f'; x.lineWidth = 4; x.stroke(); x.restore();
      A(seg(u, t0, t0 + .4), () => { const up = i % 2 === 0, ls = lines(m.text, 318, `600 23px ${FB}`), bh = 56 + ls.length * 30, by = up ? y - 46 - bh : y + 46; rr(mx - 180, by, 360, bh, 12, C.pn, m.concept ? C.un : C.ln, 1.5); tx(m.date, mx - 159, by + 32, `700 17px ${FM}`, m.concept ? C.un : C.or); ls.forEach((l, j) => tx(l, mx - 159, by + 66 + j * 30, `600 23px ${FB}`, C.tx)); x.strokeStyle = C.ln; x.lineWidth = 2; x.beginPath(); x.moveTo(mx, up ? y - 46 : y + 18); x.lineTo(mx, up ? y - 18 : y + 46); x.stroke(); }); });
    const bar = sc.bar, bt = .4 + n * .9 + .3; A(eo(seg(u, bt, bt + .5)), () => { rr(120, 760, W - 240, 250, 16, C.pn, C.ln); tx(bar.label, 152, 806, `600 16px ${FM}`, C.or); if (bar.note) tx(bar.note, W - 152, 806, `500 17px ${FB}`, C.mu, 'right'); const m = bar.steps.length, bw = (W - 304 - (m - 1) * 24) / m; bar.steps.forEach((s, i) => { const bx = 152 + i * (bw + 24), kk = eio(seg(u, bt + .3 + i * .25, bt + 1 + i * .25)); tx(s.label, bx, 852, `600 18px ${FB}`, C.mu); rr(bx, 868, bw, 22, 11, '#2c313a'); if (kk > 0) rr(bx, 868, bw * (s.n / s.of) * kk, 22, 11, s.verified ? C.ok : C.un); tx(`${Math.round(s.n * kk)}`, bx, 942, `700 40px ${FM}`, C.tx); x.font = `700 40px ${FM}`; const vw = x.measureText(`${Math.round(s.n * kk)}`).width; tx(`of ${s.of}`, bx + vw + 12, 942, `600 20px ${FM}`, C.mu); tx(s.verified ? 'read from a status file' : "a work thread's count", bx, 976, `500 15px ${FB}`, s.verified ? C.ok : C.un); }); });
  }

  function ahead(sc, u) {
    bgWorld(1 - .6 * seg(u, 0, sc.t1 - sc.t0), .74);
    tx(sc.eyebrow, 120, 110, `600 16px ${FM}`, C.or); tx(sc.head, 120, 164, `800 52px ${FH}`, C.tx);
    sc.items.forEach((it, i) => { const t0 = .8 + i * .9, k = back(seg(u, t0, t0 + .5)); if (k <= 0) return; const cx = 120 + (i % 2) * 860, cy = 230 + Math.floor(i / 2) * 250; x.save(); x.globalAlpha *= seg(u, t0, t0 + .3); x.translate(cx + 410, cy + 110); x.scale(.92 + .08 * k, .92 + .08 * k); x.translate(-410, -110); rr(0, 0, 820, 220, 16, C.pn, C.ln); x.fillStyle = C.or; x.fillRect(0, 22, 6, 176); tx(it.tag, 34, 46, `700 16px ${FM}`, C.or); tx(it.head, 34, 90, `800 32px ${FH}`, C.tx); wrap(it.text, 34, 130, 760, 32, `500 24px ${FB}`, C.mu); x.restore(); });
  }

  function end(sc, u) {
    bgWorld(.4, .86);
    const a = seg(u, 0, .8);
    A(a, () => { x.font = `800 96px ${FH}`; const tw = x.measureText('SaveBench').width; hex(W / 2 - tw / 2 - 10, 352, 64, C.or); tx('SaveBench', W / 2 + 36, 384, `800 96px ${FH}`, C.tx, 'center');
      sc.lines.forEach((s, i, arr) => A(eo(seg(u, 1 + i * .5, 1.5 + i * .5)), () => wrap(s, W / 2, 490 + i * 56, 1500, 34, `500 29px ${FB}`, i === arr.length - 1 ? C.mu : '#dfe2e8', 'center'))); });
  }

  const DRAW = { title, challenge, build, film, footage, score, timeline, ahead, end };
  // sound cues from the same data
  const cues = []; const q = (t, type, v = 1) => cues.push({ t, type, v });
  for (const sc of data.scenes) { const o = sc.t0; q(o + .05, sc.type === 'title' || sc.type === 'ahead' ? 'swell' : 'whoosh', .7);
    if (sc.type === 'title') { q(o + 1.4, 'tick'); q(o + 2.8, 'pop'); }
    if (sc.type === 'challenge') { sc.cost.forEach((c, i) => q(o + 1.4 + i * .4, 'pop')); sc.rules.forEach((r, i) => q(o + 3.4 + i * .7, 'tick')); sc.players.forEach((p, i) => q(o + 6.2 + i * .7, 'whoosh', .7)); q(o + 10.2, 'click'); }
    if (sc.type === 'build') { (sc.buildings || []).forEach(b => { q(o + b.t, 'thud', .7); if (b.off) q(o + b.off.t, 'low', .6); }); (sc.belts || []).forEach(b => { q(o + b.t, 'zip', .5); if (b.refused) q(o + b.refused.t, 'low'); }); (sc.counters || []).forEach(c => { if (c.made >= c.want) q(o + c.t1, 'pop'); }); if (sc.stamp) q(o + sc.stamp.t, sc.stamp.col === 'bad' ? 'low' : 'chime'); }
    if (sc.type === 'footage') sc.shots.forEach((s, i) => q(o + .5 + i * 1.5, 'click', .5));
    if (sc.type === 'film') { (sc.rows || []).forEach((r, i) => q(o + (r.t != null ? r.t : 1 + i * .8), 'tick', .6)); if (sc.stamp) q(o + sc.stamp.t, sc.stamp.col === 'bad' ? 'low' : 'chime'); }
    if (sc.type === 'score') { sc.cols.forEach((c, i) => c.rows.forEach((r, j) => q(o + 1.4 + j * .7 + i * .35, 'tick'))); q(o + 5.4, 'pop'); }
    if (sc.type === 'timeline') sc.marks.forEach((m, i) => q(o + .4 + i * .9, 'pop', .8));
    if (sc.type === 'ahead') sc.items.forEach((m, i) => q(o + .8 + i * .9, 'tick'));
    if (sc.type === 'end') q(o + 1, 'chime', .7);
  }
  cues.sort((a, b) => a.t - b.t);

  return {
    dur: data.dur, cues, chips: data.scenes.map(s => [s.t0, s.chip]),
    filmAt(t) { let sc = data.scenes[0]; for (const s of data.scenes) if (t >= s.t0) sc = s; if (sc.type !== 'film') return null; return { key: sc.film, local: Math.max(0, t - sc.t0 - (sc.lead != null ? sc.lead : .6)) }; },
    frame(t) {
      x.save(); x.clearRect(0, 0, W, H);
      let sc = data.scenes[0]; for (const s of data.scenes) if (t >= s.t0) sc = s;
      const u = t - sc.t0; DRAW[sc.type](sc, u);
      const fin = 1 - seg(u, 0, .45), fout = seg(t, sc.t1 - .3, sc.t1); const f = Math.max(sc === data.scenes[0] ? 0 : fin, sc.type === 'end' ? 0 : fout); if (f > 0) { x.fillStyle = `rgba(11,12,15,${f})`; x.fillRect(0, 0, W, H); }
      // every frame says what it is
      x.font = `600 15px ${FM}`; x.fillStyle = 'rgba(169,173,182,.8)'; x.textAlign = 'right'; x.textBaseline = 'alphabetic'; if (data.stampLine && sc.type !== 'build' && sc.type !== 'timeline') x.fillText(data.stampLine, W - 32, H - 22);
      x.restore();
    }
  };
};

// =====================================================================================
// Engine "v3" (Nov 24): cinematic. A camera flies over the real game map; every factory is plotted where its
// run records put it; charts and real film clips move. All positions and numbers come from the version's data.
// =====================================================================================
ENG.v3 = function (x, IM, data, ctl) {
  const D = data.map || {};
  const KC = { M:'#fa8c3c', S:'#f2c14e', C:'#38bdf8', A:'#c4b5fd', F:'#f472b6', B:'#8b93a1', G:'#a3e635', K:'#ff8a7a', P:'#4b5563', J:'#7ddc9a', W:'#60a5fa', H:'#f4f1ea', E:'#f4f1ea', X:'#8b93a1' };
  const KN = { M:'Miner', S:'Smelter', C:'Constructor', A:'Assembler', F:'Foundry', B:'Storage', G:'Biomass Burner', K:'Coal Generator', J:'Splitter or Merger', W:'Water Extractor', H:'HUB', P:'Power pole' };
  const ICO = { M:'MinerMk1', S:'SmelterMk1', C:'ConstructorMk1', B:'StorageContainerMk1', J:'ConveyorAttachmentSplitter' };
  const SIZE = { M:9, S:9, C:8, A:11, F:11, B:6, G:7, K:12, P:2.2, J:5, W:9, H:12, E:16, X:8 };
  function rr(X, Y, w, h, r, fill, stroke, lw = 1) { x.beginPath(); x.roundRect(X, Y, w, h, r); if (fill) { x.fillStyle = fill; x.fill(); } if (stroke) { x.lineWidth = lw; x.strokeStyle = stroke; x.stroke(); } }
  function tx(s, X, Y, font, col, al = 'left', base = 'alphabetic') { x.font = font; x.fillStyle = col; x.textAlign = al; x.textBaseline = base; x.fillText(s, X, Y); }
  function A(a, fn) { if (a <= 0.001) return; x.save(); x.globalAlpha *= clamp(a); fn(); x.restore(); }
  function lines(s, maxW, font) { x.font = font; const out = []; let line = ''; for (const w of String(s).split(' ')) { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out; }
  function wrap(s, X, Y, maxW, lh, font, col, al = 'left') { const ls = lines(s, maxW, font); ls.forEach((l, i) => tx(l, X, Y + i * lh, font, col, al)); return Y + (ls.length - 1) * lh; }
  function hex(X, Y, s, col) { x.save(); x.translate(X, Y); x.scale(s / 26, s / 26); x.translate(-13, -15); x.strokeStyle = col; x.lineWidth = 2.6; x.beginPath(); x.moveTo(13, 2); x.lineTo(24, 8); x.lineTo(24, 22); x.lineTo(13, 28); x.lineTo(2, 22); x.lineTo(2, 8); x.closePath(); x.stroke(); x.fillStyle = col; x.beginPath(); x.moveTo(13, 9); x.lineTo(19, 12.5); x.lineTo(19, 17.5); x.lineTo(13, 21); x.lineTo(7, 17.5); x.lineTo(7, 12.5); x.closePath(); x.fill(); x.restore(); }
  function badge(X, Y, letter, col, s = 30) { rr(X, Y, s, s, 7, 'rgba(0,0,0,.35)', col, 2.5); tx(letter, X + s / 2, Y + s / 2 + 1, `800 ${s * .55}px ${FB}`, col, 'center', 'middle'); }
  function pill(s, X, Y, col, al = 'left', fs = 16) { x.font = `700 ${fs}px ${FM}`; const w = x.measureText(s).width + 26, X0 = al === 'right' ? X - w : al === 'center' ? X - w / 2 : X; rr(X0, Y, w, fs + 18, 9, 'rgba(11,12,15,.88)', col, 1.5); tx(s, X0 + 13, Y + fs + 4, `700 ${fs}px ${FM}`, col); return w; }
  const VG = {}; function vignette(s = .6) { const g = VG[s] || (VG[s] = (() => { const gg = x.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, H * .95); gg.addColorStop(0, 'rgba(0,0,0,0)'); gg.addColorStop(1, `rgba(0,0,0,${s})`); return gg; })()); x.fillStyle = g; x.fillRect(0, 0, W, H); }
  function grain(t) { x.save(); x.globalAlpha = .035; for (let i = 0; i < 90; i++) { const r = Math.sin(i * 91.7 + Math.floor(t * 24) * 13.1) * 43758.5; const fx = (r - Math.floor(r)) * W, fy = ((r * 7.3) - Math.floor(r * 7.3)) * H; x.fillStyle = i % 2 ? '#fff' : '#000'; x.fillRect(fx, fy, 2, 2); } x.restore(); }
  function bars(k) { if (k <= 0) return; const h = 64 * k; x.fillStyle = '#000'; x.fillRect(0, 0, W, h); x.fillRect(0, H - h, W, h); }
  function headline(eyebrow, head, u, X = 72, Y = 128) { const k = back(seg(u, .15, .8)); A(seg(u, .1, .5), () => { tx(eyebrow, X, Y - 56, `700 17px ${FM}`, C.or); x.save(); x.translate(X, Y); x.scale(1, .9 + .1 * k); tx(head, 0, 0, `800 54px ${FH}`, C.tx); x.restore(); }); }
  // ---- camera over map space (8192 units across) ----
  const lz = (a, b, k) => Math.exp(lerp(Math.log(a), Math.log(b), k));
  function camAt(keys, u) { if (u <= keys[0].t) return keys[0]; for (let i = 1; i < keys.length; i++) { const a = keys[i - 1], b = keys[i]; if (u <= b.t) { const k = eio(seg(u, a.t, b.t)); return { cx: lerp(a.cx, b.cx, k), cy: lerp(a.cy, b.cy, k), z: lz(a.z, b.z, k) }; } } return keys[keys.length - 1]; }
  function S(cam, p) { return [(p[0] - cam.cx) * cam.z + W / 2, (p[1] - cam.cy) * cam.z + H / 2]; }
  const MAPS = {};
  function mapImg(soft) { const key = soft ? 's' : 'h'; if (MAPS[key] !== undefined) return MAPS[key]; const m = IM.world; if (!m) return (MAPS[key] = null);
    const c = document.createElement('canvas'); c.width = m.width; c.height = m.height; const g = c.getContext('2d'); g.filter = soft ? 'blur(1.2px) saturate(.8)' : 'saturate(.85)'; g.drawImage(m, 0, 0); return (MAPS[key] = c); }
  function mapBg(cam, dark = .45) {
    x.fillStyle = C.bg; x.fillRect(0, 0, W, H);
    const m = mapImg(cam.z > 1.2); if (m) { const [sx, sy] = S(cam, [0, 0]), sz = 8192 * cam.z, k = m.width / 8192;
      // draw only the part of the map that is on screen
      const vx0 = Math.max(0, -sx / cam.z), vy0 = Math.max(0, -sy / cam.z), vx1 = Math.min(8192, (W - sx) / cam.z), vy1 = Math.min(8192, (H - sy) / cam.z);
      if (vx1 > vx0 && vy1 > vy0) { x.imageSmoothingEnabled = true; x.imageSmoothingQuality = cam.z > 1.2 ? 'low' : 'high'; x.drawImage(m, vx0 * k, vy0 * k, (vx1 - vx0) * k, (vy1 - vy0) * k, sx + vx0 * cam.z, sy + vy0 * cam.z, (vx1 - vx0) * cam.z, (vy1 - vy0) * cam.z); } }
    x.fillStyle = `rgba(11,12,15,${dark})`; x.fillRect(0, 0, W, H);
    if (cam.z > .9) { // 100 m grid (1 map unit is about 0.92 m)
      const step = 109, a = clamp((cam.z - .9) / 1.2) * .5; x.save(); x.globalAlpha = a; x.strokeStyle = 'rgba(244,241,234,.12)'; x.lineWidth = 1; x.beginPath();
      const x0 = Math.floor((cam.cx - W / 2 / cam.z) / step) * step, y0 = Math.floor((cam.cy - H / 2 / cam.z) / step) * step;
      for (let gx = x0; gx < cam.cx + W / 2 / cam.z; gx += step) { const X = S(cam, [gx, 0])[0]; x.moveTo(X, 0); x.lineTo(X, H); }
      for (let gy = y0; gy < cam.cy + H / 2 / cam.z; gy += step) { const Y = S(cam, [0, gy])[1]; x.moveTo(0, Y); x.lineTo(W, Y); }
      x.stroke(); x.restore();
      // scale bar
      A(a * 2, () => { const L = 109 * cam.z; x.fillStyle = C.tx; x.fillRect(W - 72 - L, H - 112, L, 3); tx('100 m', W - 72, H - 124, `600 15px ${FM}`, C.mu, 'right'); });
    }
  }
  const SPR = {};
  function sprite(k) { if (SPR[k]) return SPR[k]; const c = KC[k] || C.mu, n = 96, q = 24, cv = document.createElement('canvas'); cv.width = cv.height = n; const g = cv.getContext('2d');
    g.shadowColor = c; g.shadowBlur = 30; g.fillStyle = c; g.beginPath(); g.roundRect(q, q, n - 2 * q, n - 2 * q, (n - 2 * q) * .22); g.fill(); g.shadowBlur = 0; g.fill(); return (SPR[k] = cv); }
  function glyph(k, X, Y, s, a = 1, icons = false) {
    if (k === 'P') { const ga = x.globalAlpha; x.globalAlpha = ga * a * .7; x.fillStyle = KC.P; x.fillRect(X - s / 2, Y - s / 2, s, s); x.globalAlpha = ga; return; }
    const ga = x.globalAlpha; x.globalAlpha = ga * a; x.drawImage(sprite(k), X - s, Y - s, s * 2, s * 2);
    if (icons && ICO[k] && IM[ICO[k]] && s >= 26) { const c = KC[k] || C.mu; rr(X - s / 2, Y - s / 2, s, s, s * .22, 'rgba(11,12,15,.92)', c, 2); x.drawImage(IM[ICO[k]], X - s * .4, Y - s * .4, s * .8, s * .8); }
    x.globalAlpha = ga;
  }
  function plot(cam, pts, u0, u, dur, opts = {}) { // buildings appear in record order
    const n = pts.length, sc = opts.scale || clamp(cam.z / 1.6, .55, 3.2);
    pts.forEach((p, i) => { const ti = u0 + (n > 1 ? i / (n - 1) : 0) * dur; if (u < ti) return; const k = back(seg(u, ti, ti + .35)); const [X, Y] = S(cam, [p[1], p[2]]); if (X < -40 || X > W + 40 || Y < -40 || Y > H + 40) return; glyph(p[0], X, Y, (SIZE[p[0]] || 6) * sc * (opts.big || 1) * Math.max(.01, k), opts.alpha == null ? 1 : opts.alpha, opts.icons); });
  }
  function legend(X, Y, keys, a) { A(a, () => { rr(X, Y, 300, 30 + keys.length * 34, 14, C.pn, C.ln); keys.forEach((k, i) => { glyph(k, X + 30, Y + 32 + i * 34, 14); tx(KN[k], X + 52, Y + 38 + i * 34, `600 18px ${FB}`, C.tx); }); }); }
  function caption(s, u, t, col = C.mu) { A(seg(u, t, t + .4), () => { tx(s, 72, H - 84, `600 16px ${FM}`, col); }); }

  // ---------------------------------------------------------------- scenes
  function open(sc, u) {
    const cam = camAt([{ t: 0, cx: 4096, cy: 4096, z: .118 }, { t: 1.2, cx: 4096, cy: 4096, z: .13 }, { t: sc.t1 - sc.t0, cx: 1700, cy: 2760, z: 1.05 }], u);
    mapBg(cam, .3 + .25 * seg(u, 3, 6));
    const p = S(cam, [1700, 2780]); A(seg(u, 2.5, 4) * (1 - seg(u, 6, 7)), () => { x.strokeStyle = C.or; x.lineWidth = 2; const r = 40 + 30 * Math.sin(u * 3); x.beginPath(); x.arc(p[0], p[1], r, 0, 7); x.stroke(); tx('GRASS FIELDS · WHERE EVERY RUN STARTS', p[0] + r + 16, p[1] + 6, `700 18px ${FM}`, C.or); });
    vignette(.7);
    const k = back(seg(u, .4, 1.3)); A(seg(u, .3, .8) * (1 - seg(u, 4.6, 5.4)), () => { x.save(); x.translate(W / 2, H / 2 - 30); x.scale(.85 + .15 * k, .85 + .15 * k); x.font = `800 128px ${FH}`; const tw = x.measureText('SaveBench').width; hex(-tw / 2 - 40, -40, 84, C.or); tx('SaveBench', 30, 0, `800 128px ${FH}`, C.tx, 'center', 'middle'); x.restore(); });
    A(seg(u, 1.3, 2) * (1 - seg(u, 4.6, 5.4)), () => { tx(sc.line, W / 2, H / 2 + 80, `600 34px ${FB}`, '#dfe2e8', 'center'); tx(sc.sub, W / 2, H / 2 + 130, `700 18px ${FM}`, C.or, 'center'); });
    bars(1 - seg(u, 5, 7) * .4);
  }
  function atlas(sc, u) {
    const L = sc.t1 - sc.t0, ctr = D.center || [1650, 2780];
    const cam = camAt([{ t: 0, cx: 1700, cy: 2760, z: 1.05 }, { t: 3, cx: ctr[0], cy: ctr[1], z: 2.1 }, { t: L - 6, cx: ctr[0] + 30, cy: ctr[1] - 10, z: 2.4 }, { t: L - 1, cx: 1950, cy: 2720, z: 1.4 }, { t: L, cx: 1960, cy: 2720, z: 1.38 }], u);
    mapBg(cam, .55);
    const runs = D.runs || []; const n = runs.length; const t0 = 2, span = 8;
    let shown = 0, bld = 0;
    runs.forEach((r, i) => { const ti = t0 + i / Math.max(1, n - 1) * span; if (u < ti) return; shown++; bld += r.b.length; const fresh = 1 - seg(u, ti, ti + 1.2); x.save(); if (fresh > 0) { x.globalCompositeOperation = 'lighter'; } plot(cam, r.b, ti, u, .5, { alpha: .35 + .65 * fresh, scale: 1.25 }); x.restore(); });
    // the script's base, outlined
    A(seg(u, L - 5.5, L - 4.5), () => { plot(cam, D.script || [], L - 5.5, u, 1.2, { scale: 1.5 }); const p = S(cam, [2400, 2690]); x.strokeStyle = C.or; x.setLineDash([8, 8]); x.lineWidth = 2; x.beginPath(); x.arc(p[0], p[1], 90, 0, 7); x.stroke(); x.setLineDash([]); tx('THE SCRIPT’S COAL PLANT', p[0] - 100, p[1] - 110, `700 17px ${FM}`, C.or); });
    vignette(.55);
    headline(sc.eyebrow, sc.head, u);
    // counters
    A(seg(u, 1.6, 2.2), () => { rr(72, 168, 420, 128, 16, C.pn, C.ln); tx('AI RUNS PLOTTED', 100, 210, `700 15px ${FM}`, C.mu); tx(String(shown), 100, 270, `800 56px ${FH}`, C.tx); tx('BUILDINGS', 290, 210, `700 15px ${FM}`, C.mu); tx(bld.toLocaleString('en-US'), 290, 270, `800 56px ${FH}`, C.tx); });
    legend(W - 372, 168, ['M', 'S', 'C', 'A', 'F', 'K', 'G', 'B', 'J'], seg(u, 3, 3.6) * (1 - seg(u, L - 6.5, L - 5.8)));
    caption(sc.note, u, 2);
  }
  function race(sc, u) {
    const L = sc.t1 - sc.t0; bgPanel3();
    headline(sc.eyebrow, sc.head, u);
    // chart
    const X0 = 140, Y0 = 860, CW = 1080, CH = 560, TMAX = 150, tp = lerp(0, TMAX, eo(seg(u, 1.5, 11.5)));
    A(seg(u, .6, 1.2), () => {
      x.strokeStyle = C.ln; x.lineWidth = 1; for (let m = 0; m <= 3; m++) { const Y = Y0 - m / 3 * CH; x.beginPath(); x.moveTo(X0, Y); x.lineTo(X0 + CW, Y); x.stroke(); tx(String(m), X0 - 20, Y + 6, `600 16px ${FM}`, C.mu, 'right'); }
      for (let t = 0; t <= TMAX; t += 25) { const X = X0 + t / TMAX * CW; tx(String(t), X, Y0 + 32, `600 15px ${FM}`, C.mu, 'center'); }
      tx('TURN', X0 + CW, Y0 + 62, `700 14px ${FM}`, C.mu, 'right'); tx('MILESTONES BOUGHT', X0, Y0 - CH - 22, `700 14px ${FM}`, C.mu);
      // playhead
      const PX = X0 + tp / TMAX * CW; x.strokeStyle = 'rgba(250,140,60,.5)'; x.setLineDash([4, 6]); x.beginPath(); x.moveTo(PX, Y0 - CH - 6); x.lineTo(PX, Y0); x.stroke(); x.setLineDash([]); tx('turn ' + Math.round(tp), PX, Y0 - CH - 30, `700 15px ${FM}`, C.or, 'center');
    });
    (sc.runs || []).forEach((r, ri) => { const col = C[r.col];
      const pts = [[0, 0]]; r.buys.forEach((b, j) => { pts.push([b.t, j]); pts.push([b.t, j + 1]); }); pts.push([r.end, r.buys.length]);
      x.save(); x.lineWidth = 5; x.strokeStyle = col; x.shadowColor = col; x.shadowBlur = 14; x.beginPath(); let last = null;
      for (let i = 0; i < pts.length; i++) { const [t, m] = pts[i]; const tt = Math.min(t, tp); const X = X0 + tt / TMAX * CW, Y = Y0 - m / 3 * CH - ri * 4; if (i === 0) x.moveTo(X, Y); else x.lineTo(X, Y); last = [X, Y]; if (t > tp) break; }
      x.stroke(); x.restore();
      if (last) { x.beginPath(); x.arc(last[0], last[1], 8, 0, 7); x.fillStyle = col; x.fill(); }
      r.buys.forEach((b, j) => { if (tp < b.t) return; const k = back(seg(tp, b.t, b.t + 6)); const X = X0 + b.t / TMAX * CW, Y = Y0 - (j + 1) / 3 * CH - ri * 4; x.save(); x.translate(X + (ri - 1) * 4, Y - 30 - ri * 30); x.scale(k, k); pill(b.m, 0, -22, col, 'center', 15); x.restore(); });
      if (tp >= r.end && r.endNote) A(seg(tp, r.end, r.end + 8), () => tx(r.endNote, X0 + r.end / TMAX * CW + 16, Y0 - r.buys.length / 3 * CH + 34 + ri * 26, `600 15px ${FM}`, col));
    });
    // key with badges
    A(seg(u, 1, 1.6), () => (sc.runs || []).forEach((r, i) => { const Y = 196 + i * 58; badge(1300, Y, r.letter, C[r.col], 38); tx(r.name, 1352, Y + 27, `800 26px ${FH}`, C.tx); tx(r.sum, 1352, Y + 52, `600 15px ${FM}`, C.mu); }));
    // mini factory maps, what each one built, at their game coordinates
    const MW = 176, MH = 230; (sc.runs || []).forEach((r, i) => { const MX = 1300 + i * (MW + 14), MY = 420; const kA = seg(u, 12, 12.6); A(kA, () => { rr(MX, MY, MW, MH, 12, '#101217', C[r.col], 1.5); x.save(); x.beginPath(); x.roundRect(MX, MY, MW, MH, 12); x.clip(); const run = (D.runs || []).find(q => q.id === r.id); if (run) { const xs = run.b.map(p => p[1]), ys = run.b.map(p => p[2]); const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2, z = Math.min(MW / (Math.max(...xs) - Math.min(...xs) + 40), MH / (Math.max(...ys) - Math.min(...ys) + 40)); const cam = { cx, cy, z }; const ox = MX + MW / 2 - W / 2, oy = MY + MH / 2 - H / 2; x.translate(ox, oy); plot(cam, run.b, 12.2 + i * .3, u, 3, { scale: .9 }); } x.restore(); tx(r.letter + ' · ' + (run ? run.b.length : 0) + ' BUILDINGS', MX, MY + MH + 24, `700 13px ${FM}`, C[r.col]); }); });
    A(seg(u, 12.4, 13), () => tx('What each one built, as its run records place it. North is up.', 1300, 720, `500 16px ${FB}`, C.mu));
    A(seg(u, 14, 14.6), () => { pill('NO WINNER IS DECLARED · ONE RUN EACH', 1300, 780, C.un, 'left', 16); wrap(sc.note, 1300, 860, 540, 30, `500 22px ${FB}`, '#dfe2e8'); });
  }
  function bgPanel3() { x.fillStyle = '#0d0f13'; x.fillRect(0, 0, W, H); const g = x.createRadialGradient(W * .3, H * .2, 50, W * .3, H * .2, W); g.addColorStop(0, 'rgba(250,140,60,.07)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H); vignette(.5); }
  function filmpower(sc, u) {
    const L = sc.t1 - sc.t0; x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
    const v = ctl && ctl.vids && ctl.vids[sc.film], m = (v && v.readyState >= 2) ? v : IM[sc.poster];
    if (m) { const mw = m.videoWidth || m.width, mh = m.videoHeight || m.height, s = Math.max(W / mw, H / mh) * (1.04 + .06 * u / L); x.drawImage(m, (W - mw * s) / 2 - 20 * u / L, (H - mh * s) / 2, mw * s, mh * s); }
    x.fillStyle = 'rgba(11,12,15,.25)'; x.fillRect(0, 0, W, H); vignette(.75); bars(1);
    pill(sc.filmTag, 72, 92, C.ok, 'left', 16); pill(sc.date, W - 72, 92, C.or, 'right', 16);
    const cap = (sc.captions || []).filter(c => u >= c.t).pop(); if (cap) A(eo(seg(u, cap.t, cap.t + .4)), () => { const yy = wrap(cap.h, 72, H - 190, 1100, 50, `800 42px ${FH}`, C.tx); if (cap.sub) wrap(cap.sub, 72, yy + 44, 1100, 32, `500 24px ${FB}`, '#dfe2e8'); });
    // power gauge: the third generator
    const g = sc.gauge; if (g) A(seg(u, g.t, g.t + .5), () => { const PX = W - 560, PY = 190, PW = 488, PH = 500; tx(g.note, PX + 28, PY + PH - 18, `500 15px ${FB}`, C.mu); rr(PX, PY, PW, PH, 18, 'rgba(13,15,19,.9)', C.pw, 1.5);
      rr(PX, PY, PW, PH, 18, 'rgba(13,15,19,.9)', C.pw, 1.5); tx(g.label, PX + 28, PY + 44, `700 15px ${FM}`, C.pw);
      const k = eo(seg(u, g.t + .6, g.t + 2.4)), cap = Math.round(lerp(g.from, g.to, k)), cx = PX + PW / 2, cy = PY + 250, R = 150;
      x.lineCap = 'round'; x.lineWidth = 22; x.strokeStyle = '#262a33'; x.beginPath(); x.arc(cx, cy, R, Math.PI * .8, Math.PI * 2.2); x.stroke();
      x.strokeStyle = C.pw; x.shadowColor = C.pw; x.shadowBlur = 18; x.beginPath(); x.arc(cx, cy, R, Math.PI * .8, Math.PI * .8 + Math.PI * 1.4 * cap / g.to); x.stroke(); x.shadowBlur = 0;
      x.strokeStyle = C.ok; x.lineWidth = 10; x.beginPath(); x.arc(cx, cy, R - 30, Math.PI * .8, Math.PI * .8 + Math.PI * 1.4 * (g.use / g.to) * k); x.stroke(); x.lineCap = 'butt';
      tx(cap + ' MW', cx, cy + 10, `800 52px ${FH}`, C.tx, 'center'); tx('CAPACITY', cx, cy + 46, `700 15px ${FM}`, C.mu, 'center');
      tx(g.use + ' MW in use', cx, cy + 82, `600 20px ${FB}`, C.ok, 'center');
      for (let i = 0; i < 3; i++) { const on = i < 2 || u > g.t + 2.2; const kk = i < 2 ? 1 : back(seg(u, g.t + 2.2, g.t + 2.8)); A(on ? 1 : .2, () => { x.save(); x.translate(PX + 120 + i * 124, PY + 420); x.scale(kk, kk); rr(-44, -26, 88, 52, 10, i === 2 ? 'rgba(255,138,122,.2)' : '#1d2027', KC.K, 2); tx('GEN ' + (i + 1), 0, 6, `700 15px ${FM}`, C.tx, 'center'); x.restore(); }); }
      
    });
  }
  function scriptmap(sc, u) {
    const L = sc.t1 - sc.t0, pts = D.script || []; const xs = pts.map(p => p[1]), ys = pts.map(p => p[2]);
    const bx = [Math.min(...xs, D.copper[0]), Math.max(...xs, D.copper[0])], by = [Math.min(...ys, D.copper[1]), Math.max(...ys, D.copper[1])];
    const cx = (bx[0] + bx[1]) / 2, cy = (by[0] + by[1]) / 2, zf = Math.min(W * .78 / (bx[1] - bx[0]), H * .62 / (by[1] - by[0]));
    const F = sc.focus || [cx, cy, zf]; const cam = camAt([{ t: 0, cx, cy: cy + 40, z: zf * .8 }, { t: 2.4, cx, cy, z: zf }, { t: 4.2, cx: F[0], cy: F[1], z: F[2] }, { t: L, cx: F[0] + 12, cy: F[1] - 6, z: F[2] * 1.06 }], u);
    mapBg(cam, .62);
    plot(cam, pts, .6, u, 1.6, { scale: clamp(cam.z / 1.1, 1.3, 4.2), icons: true });
    if (sc.route && D[sc.route]) { // a belt route: drawn on, then items flow along it
      const rp = D[sc.route].map(p => S(cam, p)), segL = []; let tot = 0; for (let i = 1; i < rp.length; i++) { const l = Math.hypot(rp[i][0] - rp[i - 1][0], rp[i][1] - rp[i - 1][1]); segL.push(l); tot += l; }
      const at = d => { for (let i = 0; i < segL.length; i++) { if (d <= segL[i]) { const f = d / segL[i]; return [rp[i][0] + (rp[i + 1][0] - rp[i][0]) * f, rp[i][1] + (rp[i + 1][1] - rp[i][1]) * f]; } d -= segL[i]; } return rp[rp.length - 1]; };
      const k = eo(seg(u, sc.routeAt, sc.routeAt + 2.2));
      if (k > 0) { x.save(); x.lineCap = 'round'; x.lineJoin = 'round'; x.strokeStyle = 'rgba(250,140,60,.28)'; x.lineWidth = 16; const path = () => { x.beginPath(); x.moveTo(rp[0][0], rp[0][1]); let d = 0; for (let i = 1; i < rp.length; i++) { if (d + segL[i - 1] <= tot * k) { x.lineTo(rp[i][0], rp[i][1]); d += segL[i - 1]; } else { const e = at(tot * k); x.lineTo(e[0], e[1]); break; } } };
        path(); x.stroke(); x.strokeStyle = C.or; x.lineWidth = 5; path(); x.stroke(); x.restore();
        if (k >= 1) { const sp = 42, off = ((u - sc.routeAt - 2.2) * 90) % sp; x.fillStyle = '#fff3e6'; for (let d = off; d < tot; d += sp) { const q2 = at(d); x.beginPath(); x.arc(q2[0], q2[1], 4.5, 0, 7); x.fill(); } } }
      if (sc.relaysKey) plot(cam, D[sc.relaysKey] || [], sc.routeAt + .2, u, 1.8, { scale: clamp(cam.z / 1.1, 1.3, 4.2), icons: true });
    }
    if (sc.newKey && D[sc.newKey]) { const np = D[sc.newKey], t0 = sc.newAt || 4, dd = sc.newDur || 2;
      np.forEach((p, i) => { const ti = t0 + (np.length > 1 ? i / (np.length - 1) : 0) * dd; if (u < ti) return; const kk = seg(u, ti, ti + .7); if (kk >= 1) return; const q2 = S(cam, [p[1], p[2]]); A((1 - kk) * .85, () => { x.strokeStyle = '#ffffff'; x.lineWidth = 2; x.beginPath(); x.arc(q2[0], q2[1], 8 + 46 * kk, 0, 7); x.stroke(); }); });
      plot(cam, np, t0, u, dd, { scale: clamp(cam.z / 1.1, 1.3, 4.2), icons: true }); }
    (sc.calls || []).forEach(c => { if (u < c.t) return; const p = S(cam, c.at), k = back(seg(u, c.t, c.t + .5)), col = c.bad ? C.bad : C[c.col] || C.or;
      x.save(); x.strokeStyle = col; x.lineWidth = 2.5; const r = (c.r || 34) * (.6 + .4 * k) + (c.bad ? 6 * Math.sin(u * 6) : 0); x.beginPath(); x.arc(p[0], p[1], r, 0, 7); x.stroke();
      if (c.bad) { x.beginPath(); x.moveTo(p[0] - 14, p[1] - 14); x.lineTo(p[0] + 14, p[1] + 14); x.moveTo(p[0] + 14, p[1] - 14); x.lineTo(p[0] - 14, p[1] + 14); x.stroke(); }
      const lx = p[0] + (c.dx || 50), ly = p[1] + (c.dy || -50); x.beginPath(); x.moveTo(p[0] + r * .7 * Math.sign(c.dx || 1), p[1] + r * .7 * Math.sign(c.dy || -1)); x.lineTo(lx, ly); x.stroke(); x.restore();
      x.save(); x.translate(lx, ly); x.scale(k, k); const w = Math.max(...[c.h, c.s || ''].map(s => { x.font = `800 24px ${FH}`; return x.measureText(s).width; })) + 36; const X0 = (c.dx || 50) < 0 ? -w : 0; rr(X0, -30, w, c.s ? 74 : 46, 12, 'rgba(13,15,19,.94)', col, 1.5); tx(c.h, X0 + 18, 2, `800 24px ${FH}`, C.tx); if (c.s) tx(c.s, X0 + 18, 32, `600 16px ${FB}`, C.mu); x.restore(); });
    vignette(.5); headline(sc.eyebrow, sc.head, u);
    legend(W - 372, 168, ['M', 'S', 'C', 'A', 'F', 'K', 'W', 'B'], seg(u, 1.5, 2) * (sc.meter ? 1 - seg(u, sc.meter.t - .6, sc.meter.t) : 1));
    if (sc.meter) { const m = sc.meter, PW = 600, PX = W - PW - 72, PY = 168, PH = 90 + m.rows.length * 112; const km = back(seg(u, m.t, m.t + .6));
      if (km > 0) { x.save(); x.globalAlpha *= seg(u, m.t, m.t + .3); x.translate(PX + PW, PY); x.scale(.92 + .08 * km, .92 + .08 * km); x.translate(-PW, 0);
        rr(0, 0, PW, PH, 18, 'rgba(13,15,19,.94)', C.or, 1.5); tx(m.label, 28, 46, `700 16px ${FM}`, C.or);
        m.rows.forEach((r, i) => { const Y = 90 + i * 112, kv = r.hot ? eo(seg(u, m.t + .8, m.t + 3.6)) : 1, v = Math.round(lerp(r.from || 0, r.v, kv)), done = v >= r.of;
          tx(r.n, 28, Y + 14, `800 26px ${FH}`, r.hot ? C.tx : '#c9ccd3'); tx(v.toLocaleString('en-US') + ' / ' + r.of.toLocaleString('en-US'), PW - 28, Y + 14, `800 26px ${FH}`, done ? C.ok : C.mu, 'right');
          rr(28, Y + 32, PW - 56, 14, 7, '#262a33'); if (v > 0) { x.save(); if (done) { x.shadowColor = C.ok; x.shadowBlur = 16; } rr(28, Y + 32, (PW - 56) * v / r.of, 14, 7, done ? C.ok : C.or); x.restore(); }
          tx(r.s, 28, Y + 74, `500 17px ${FB}`, C.mu); if (done && r.hot) A(seg(u, m.t + 3.6, m.t + 4), () => pill('PAID', PW - 28, Y + 54, C.ok, 'right', 14)); });
        x.restore(); } }
    caption(sc.note, u, 1.2);
  }
  function pairs(sc, u) {
    bgPanel3(); headline(sc.eyebrow, sc.head, u);
    const rows = sc.rows || [], X0 = 480, XW = 1000, Y0 = 226, RH = Math.min(96, 660 / Math.max(1, rows.length)), TMAX = 150, tp = lerp(0, TMAX + 8, eo(seg(u, 1.6, 10.5)));
    A(seg(u, .8, 1.4), () => { x.strokeStyle = C.ln; x.lineWidth = 1; for (let t = 0; t <= TMAX; t += 25) { const X = X0 + t / TMAX * XW; x.beginPath(); x.moveTo(X, Y0 - 14); x.lineTo(X, Y0 + rows.length * RH); x.stroke(); tx(String(t), X, Y0 + rows.length * RH + 28, `600 15px ${FM}`, C.mu, 'center'); }
      tx('TURN', X0 + XW, Y0 + rows.length * RH + 56, `700 14px ${FM}`, C.mu, 'right'); tx('BOUGHT', X0 + XW + 30, Y0 - 24, `700 13px ${FM}`, C.mu);
      const PX = X0 + Math.min(tp, TMAX) / TMAX * XW; x.strokeStyle = 'rgba(250,140,60,.55)'; x.setLineDash([4, 6]); x.beginPath(); x.moveTo(PX, Y0 - 14); x.lineTo(PX, Y0 + rows.length * RH); x.stroke(); x.setLineDash([]); if (tp < TMAX - .5) tx('turn ' + Math.round(tp), PX, Y0 - 24, `700 15px ${FM}`, C.or, 'center'); });
    rows.forEach((r, i) => { const Y = Y0 + i * RH, col = C[r.col] || C.or, kr = seg(u, .7 + i * .1, 1.2 + i * .1);
      A(kr, () => { if (i % 2 === 0) rr(48, Y - 4, X0 + XW + 340 - 48, RH - 4, 10, 'rgba(255,255,255,.025)'); x.fillStyle = col; x.fillRect(60, Y + 10, 5, RH - 30); tx(r.name, 82, Y + RH / 2 - 4, `800 25px ${FH}`, C.tx); tx(['ONE MARATHON', 'TWO MARATHONS', 'THREE MARATHONS', 'FOUR MARATHONS'][r.runs.length - 1] || (r.runs.length + ' MARATHONS'), 82, Y + RH / 2 + 22, `600 13px ${FM}`, C.mu); });
      const n = r.runs.length;
      r.runs.forEach((run, j) => { const yy = n === 1 ? Y + RH / 2 - 2 : Y + 4 + (RH - 12) * (j + .5) / n;
        A(kr * (run.nr ? .5 : 1), () => { x.strokeStyle = '#23272f'; x.lineWidth = 2; x.beginPath(); x.moveTo(X0, yy); x.lineTo(X0 + XW, yy); x.stroke();
          const e = Math.min(run.end, tp); x.save(); x.strokeStyle = col; x.lineWidth = 4; x.lineCap = 'round'; if (run.nr) x.setLineDash([7, 7]); x.beginPath(); x.moveTo(X0, yy); x.lineTo(X0 + e / TMAX * XW, yy); x.stroke(); x.restore();
          let px = -99; run.buys.forEach(([t, m]) => { if (tp < t) return; const k = back(seg(tp, t, t + 5)); const X = X0 + t / TMAX * XW, LX = Math.max(X, px + 50); px = LX; x.save(); x.translate(LX, yy); x.scale(k, k); const ph = n > 2 ? 19 : 24; rr(-22, -ph / 2, 44, ph, ph / 2, col); tx(m, 0, 4.5, `800 ${n > 2 ? 12 : 13}px ${FM}`, '#0b0c0f', 'center'); x.restore(); });
          if (tp >= run.end) { const ke = seg(tp, run.end, run.end + 6); A(ke, () => { const EX = X0 + run.end / TMAX * XW; x.fillStyle = col; x.fillRect(EX - 1.5, yy - 9, 3, 18); tx(String(run.buys.length), X0 + XW + 44, yy + 8, `800 ${n > 2 ? 20 : 24}px ${FH}`, run.nr ? C.mu : col, 'center'); if (run.nr) tx('no result', EX + 12, yy - 12, `600 13px ${FM}`, C.mu); }); } });
      });
      const kt = back(seg(u, 11 + i * .15, 11.5 + i * .15)); if (kt > 0) { x.save(); x.translate(X0 + XW + 96, Y + RH / 2 - 30); x.scale(kt, kt); pill(r.tag, 0, 0, r.tag === 'TIED' ? C.ok : C.un, 'left', 15); x.restore(); if (r.why) A(kt, () => tx(r.why, X0 + XW + 96, Y + RH / 2 + 26, `500 15px ${FB}`, C.mu)); }
    });
    A(seg(u, 13, 13.6), () => { pill(sc.verdict, 72, H - 176, C.un, 'left', 18); wrap(sc.note, 72, H - 104, 1600, 30, `500 22px ${FB}`, '#dfe2e8'); });
  }
  function tally(sc, u) {
    bgPanel3(); headline(sc.eyebrow, sc.head, u);
    const order = sc.ladder; const X0 = 120, Y0 = 280, CW = 132, gap = 14;
    order.forEach((m, i) => { const X = X0 + i * (CW + gap); const kS = back(seg(u, .8 + i * .12, 1.3 + i * .12)), kA = m.ai ? back(seg(u, 2.8 + i * .12, 3.3 + i * .12)) : 0;
      A(seg(u, .6 + i * .1, 1 + i * .1), () => { rr(X, Y0, CW, 470, 14, '#14161b', C.ln); tx(m.id, X + CW / 2, Y0 + 50, `800 34px ${FH}`, C.tx, 'center'); tx(m.n || '', X + CW / 2, Y0 + 80, `600 13px ${FM}`, C.mu, 'center'); });
      if (m.script) { x.save(); x.translate(X + CW / 2, Y0 + 190); x.scale(kS, kS); rr(-52, -44, 104, 88, 14, 'rgba(250,140,60,.18)', C.or, 2); tx('SCRIPT', 0, 8, `800 18px ${FM}`, C.or, 'center'); x.restore(); }
      if (m.ai) { x.save(); x.translate(X + CW / 2, Y0 + 340); x.scale(kA, kA); rr(-52, -44, 104, 88, 14, 'rgba(56,189,248,.16)', C.A, 2); tx('AI', 0, 0, `800 22px ${FM}`, C.A, 'center'); tx(m.ai, 0, 24, `600 13px ${FM}`, C.mu, 'center'); x.restore(); }
      if (m.isNew && u > 4) A(.6 + .4 * Math.sin(u * 5), () => pill('NEW', X + CW / 2, Y0 - 50, C.un, 'center', 15)); });
    A(seg(u, 4.4, 5), () => wrap(sc.note, X0, Y0 + 560, 1700, 32, `500 24px ${FB}`, '#dfe2e8'));
  }
  function end(sc, u) {
    const cam = camAt([{ t: 0, cx: 1900, cy: 2760, z: 1.3 }, { t: sc.t1 - sc.t0, cx: 4096, cy: 4096, z: .2 }], u);
    mapBg(cam, .78); plot(cam, D.script || [], 0, 99, 0, { alpha: .6 }); vignette(.8);
    A(seg(u, 0, .8), () => { x.font = `800 96px ${FH}`; const tw = x.measureText('SaveBench').width; hex(W / 2 - tw / 2 - 10, 352, 64, C.or); tx('SaveBench', W / 2 + 36, 384, `800 96px ${FH}`, C.tx, 'center');
      sc.lines.forEach((s, i, arr) => A(eo(seg(u, 1 + i * .5, 1.5 + i * .5)), () => wrap(s, W / 2, 490 + i * 56, 1500, 34, `500 29px ${FB}`, i === arr.length - 1 ? C.mu : '#dfe2e8', 'center'))); });
  }
  const DRAW = { open, atlas, race, filmpower, scriptmap, pairs, tally, end };
  mapImg(true); mapImg(false); Object.keys(KC).forEach(sprite); // build caches once, before Play
  const cues = []; const q = (t, type, v = 1) => cues.push({ t, type, v });
  for (const sc of data.scenes) { const o = sc.t0;
    if (sc.type === 'open') { q(o, 'swell', .9); q(o + .5, 'whoosh', .8); q(o + 1.4, 'chime', .5); q(o + 4.5, 'whoosh', .6); }
    if (sc.type === 'atlas') { q(o, 'whoosh', .6); for (let i = 0; i < 24; i++) q(o + 2 + i * 8 / 24, 'tick', .35); q(o + 11, 'pop'); }
    if (sc.type === 'race') { q(o, 'swell', .6); (sc.runs || []).forEach(r => r.buys.forEach(b => q(o + 1.5 + b.t / 150 * 10, 'pop', .9))); q(o + 12, 'zip', .5); q(o + 14, 'click'); }
    if (sc.type === 'filmpower') { q(o, 'whoosh', .7); if (sc.gauge) { q(o + sc.gauge.t + .6, 'swell', .6); q(o + sc.gauge.t + 2.2, 'thud'); } }
    if (sc.type === 'scriptmap') { q(o, 'whoosh', .6); (sc.calls || []).forEach(c => q(o + c.t, c.bad ? 'low' : 'pop', .8)); }
    if (sc.type === 'scriptmap' && sc.route) { q(o + sc.routeAt, 'zip', .6); }
    if (sc.type === 'scriptmap' && sc.meter) { q(o + sc.meter.t, 'swell', .5); q(o + sc.meter.t + 3.6, 'chime', .6); }
    if (sc.type === 'pairs') { q(o, 'swell', .6); (sc.rows || []).forEach(r => r.runs.forEach(run => run.buys.forEach(b => q(o + 1.6 + b[0] / 150 * 8.9, 'tick', .45)))); (sc.rows || []).forEach((r, i) => q(o + 11 + i * .15, 'click', .5)); q(o + 13, 'thud', .6); }
    if (sc.type === 'tally') { q(o, 'swell', .5); sc.ladder.forEach((m, i) => { if (m.script) q(o + .8 + i * .12, 'tick', .5); if (m.ai) q(o + 2.8 + i * .12, 'tick', .6); }); }
    if (sc.type === 'end') q(o + 1, 'chime', .7);
  }
  cues.sort((a, b) => a.t - b.t);
  return {
    dur: data.dur, cues, chips: data.scenes.map(s => [s.t0, s.chip]),
    filmAt(t) { let sc = data.scenes[0]; for (const s of data.scenes) if (t >= s.t0) sc = s; if (!sc.film) return null; return { key: sc.film, local: Math.max(0, t - sc.t0 - (sc.lead || 0)) }; },
    frame(t) {
      x.save(); x.clearRect(0, 0, W, H);
      let sc = data.scenes[0]; for (const s of data.scenes) if (t >= s.t0) sc = s;
      const u = t - sc.t0; DRAW[sc.type](sc, u);
      const fin = 1 - seg(u, 0, .5), fout = seg(t, sc.t1 - .35, sc.t1); const f = Math.max(sc === data.scenes[0] ? 0 : fin, sc.type === 'end' ? 0 : fout); if (f > 0) { x.fillStyle = `rgba(0,0,0,${f})`; x.fillRect(0, 0, W, H); }
      grain(t);
      x.font = `600 14px ${FM}`; x.fillStyle = 'rgba(169,173,182,.75)'; x.textAlign = 'right'; x.textBaseline = 'alphabetic'; if (data.stampLine) x.fillText(data.stampLine, W - 32, H - 22);
      x.restore();
    }
  };
};

// =====================================================================================
// The player: canvas, Play/Pause, Replay, Sound, timeline, scene buttons.
// =====================================================================================
const CSS = `
.sbw{position:relative;color:#f4f1ea;font-family:system-ui,-apple-system,'Segoe UI',sans-serif}
.sbw *{box-sizing:border-box}
.sbw canvas{display:block;width:100%;height:auto;border-radius:12px;background:#000}
.sbw-bar{display:flex;align-items:center;gap:10px;margin-top:12px;flex-wrap:wrap}
.sbw-bar button{min-height:44px;padding:0 16px;border-radius:10px;border:1px solid #2c313a;background:#15171c;color:#f4f1ea;font:600 14px inherit;font-family:inherit;cursor:pointer}
.sbw button:focus-visible,.sbw input:focus-visible{outline:2px solid #fa8c3c;outline-offset:2px}
.sbw-scrub{flex:1;min-width:160px;min-height:36px;accent-color:#fa8c3c}
.sbw-time{font:600 13px ui-monospace,Menlo,Consolas,monospace;color:#a9adb6;min-width:112px;text-align:right;white-space:nowrap;padding-right:6px}
.sbw-chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
.sbw-chips button{min-height:36px;padding:0 10px;border-radius:8px;border:1px solid #2c313a;background:transparent;color:#a9adb6;font:500 12px ui-monospace,Menlo,Consolas,monospace;cursor:pointer}
.sbw-chips button.on{color:#f4f1ea;border-color:#fa8c3c}
.sbw.rec canvas{width:1920px;height:1080px;border-radius:0}
.sbw.rec .sbw-ui{display:none}
`;
function mount(el, data, opts) {
  opts = opts || {}; const base = opts.base || '';
  if (!document.getElementById('sbw-css')) { const st = document.createElement('style'); st.id = 'sbw-css'; st.textContent = CSS; document.head.appendChild(st); }
  el.innerHTML = ''; el.classList.add('sbw'); if (opts.rec) el.classList.add('rec');
  const mk = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const cv = mk('canvas'); cv.width = W; cv.height = H; cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', data.aria || 'SaveBench walkthrough animation. A full transcript is on this page.');
  const ui = mk('div', 'sbw-ui'), bar = mk('div', 'sbw-bar'), chips = mk('div', 'sbw-chips');
  const bPlay = mk('button', '', 'Play'), bRe = mk('button', '', 'Replay'), bSnd = mk('button', '', 'Sound on'), scrub = mk('input', 'sbw-scrub'), time = mk('span', 'sbw-time');
  [bPlay, bRe, bSnd].forEach(b => b.type = 'button'); bSnd.setAttribute('aria-pressed', 'true');
  scrub.type = 'range'; scrub.min = 0; scrub.step = 0.01; scrub.value = 0; scrub.setAttribute('aria-label', 'Timeline');
  bar.append(bPlay, bRe, bSnd, scrub, time); ui.append(bar, chips); el.append(cv, ui);
  const x = cv.getContext('2d'), IM = {}, VIDS = {};
  const vbox = mk('div'); vbox.style.cssText = 'position:absolute;width:2px;height:2px;overflow:hidden;opacity:0;pointer-events:none'; el.append(vbox);
  for (const [n, s] of Object.entries(data.films || {})) { const v = document.createElement('video'); v.muted = true; v.defaultMuted = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('muted', ''); v.preload = 'auto'; v.src = /^(data:|https?:|\/)/.test(s) ? s : base + s; v.addEventListener('seeked', () => { if (!playing) draw(); }); v.addEventListener('loadeddata', () => { if (!playing) draw(); }); vbox.append(v); VIDS[n] = v; }
  let raf = 0, eng = null, T = 0, playing = false, last = 0, ac = null, sound = true, dead = false, started = false;
  const poster = data.poster || 0;
  function vsync() { if (!eng || !eng.filmAt) return; const f = eng.filmAt(started ? T : poster); for (const [n, v] of Object.entries(VIDS)) { if (!f || f.key !== n) { if (!v.paused) v.pause(); continue; } const end = (v.duration || 1e9) - .05, lt = Math.min(f.local, end); if (playing && f.local > 0 && f.local < end) { if (Math.abs(v.currentTime - lt) > .35) v.currentTime = lt; if (v.paused) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } } else { if (!v.paused) v.pause(); if (Math.abs(v.currentTime - lt) > .03) v.currentTime = lt; } } }
  function draw() { if (eng) { vsync(); eng.frame(started ? T : poster); } }
  function stopAudio() { if (ac) { try { ac.close(); } catch (e) {} ac = null; } }
  function startAudio() { stopAudio(); if (!sound || !eng) return; const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; ac = new AC(); const m = mixTo(ac, ac.destination), now = ac.currentTime + .05; eng.cues.forEach(c => { if (c.t >= T) sfx(ac, m, c.type, now + (c.t - T), c.v); }); }
  function sync() { if (!eng) return; scrub.value = T; time.textContent = `${T.toFixed(1)} s / ${eng.dur.toFixed(1)} s`; bPlay.textContent = playing ? 'Pause' : 'Play'; const cs = [...chips.children]; cs.forEach((b, i) => b.classList.toggle('on', started && T >= +b.dataset.t && (i === cs.length - 1 || T < +cs[i + 1].dataset.t))); }
  function tick(ts) { if (!playing || dead) return; const dt = (ts - last) / 1000; last = ts; T = Math.min(eng.dur, T + dt); draw(); sync(); if (T >= eng.dur) { playing = false; stopAudio(); vsync(); sync(); return; } raf = requestAnimationFrame(tick); }
  function play() { if (!eng) return; if (T >= eng.dur) T = 0; started = true; playing = true; last = performance.now(); startAudio(); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); sync(); }
  function pause() { playing = false; cancelAnimationFrame(raf); stopAudio(); vsync(); sync(); }
  function seek(t) { if (!eng) return; started = true; T = clamp(t, 0, eng.dur); draw(); if (playing) startAudio(); sync(); }
  bPlay.onclick = () => playing ? pause() : play();
  bRe.onclick = () => { T = 0; play(); };
  bSnd.onclick = () => { sound = !sound; bSnd.textContent = sound ? 'Sound on' : 'Sound off'; bSnd.setAttribute('aria-pressed', String(sound)); if (playing) startAudio(); else stopAudio(); };
  scrub.oninput = () => seek(+scrub.value);
  const load = (n, src) => new Promise(r => { const im = new Image(); im.onload = () => { IM[n] = im; r(); }; im.onerror = () => r(); im.src = src; });
  const ready = Promise.all(Object.entries(data.images || {}).map(([n, s]) => load(n, /^(data:|https?:|\/)/.test(s) ? s : base + s))).then(async () => {
    if (dead) return;
    eng = ENG[data.engine](x, IM, data, { vids: VIDS });
    scrub.max = eng.dur;
    eng.chips.forEach(([s, n]) => { const b = mk('button', '', n); b.type = 'button'; b.dataset.t = s; b.setAttribute('aria-label', `Go to ${n}, at ${Math.round(s)} seconds`); b.onclick = () => seek(+s); chips.appendChild(b); });
    draw(); sync();
    try { if (document.fonts && document.fonts.ready) { await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))]); if (!dead) draw(); } } catch (e) {}
  });
  return { ready, render(t) { started = true; T = t; draw(); }, seek, play, pause, get dur() { return eng ? eng.dur : data.dur; }, get cues() { return eng ? eng.cues : []; }, destroy() { dead = true; pause(); Object.values(VIDS).forEach(v => { try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) {} }); el.innerHTML = ''; } };
}
window.SaveBenchWalkthrough = { mount, version: 3 };
})();
