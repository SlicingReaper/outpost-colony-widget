// OUTPOST// — colony-trading game for Übersicht, same 230 × 314 panel as NOTE//PAD and TETRIS//GRID
// An original game in the spirit of the 1980s land-grab economy classics: claim land, outfit robots, produce, trade.
// Install: double-click install.command in this repo (https://github.com/SlicingReaper/outpost-colony-widget).
// No backend: the game runs in the widget. Save: ~/Library/Application Support/STUDYTERM/outpost-save.json · best: outpost-best
//
//   Mouse only. You and three AI colonists settle a 7 × 5 grid for 12 months. Each month has four phases:
//   1 CLAIM    click a free plot to take it (one per month)
//   2 BUILD    click one of your plots → pick a robot job: FOOD · ENERGY · ORE (robot + outfit cost money) → DONE
//   3 PRODUCE  every robot works its plot. Terrain decides the yield; every robot also burns 1 energy, so energy
//              shortages halve output. A random event may hit the colony.
//   4 MARKET   trade food, energy and ore with the store. Prices follow the store's stock: scarce = expensive.
//              Each colonist eats 3 food a month. Hungry colonists lose a robot shift next month.
//   Score = cash + land (400 / plot) + robots (120 each) + goods at sell price. Most points after month 12 wins,
//   and the colony's total decides if the outpost survives.
//   Terrain yields  FOOD river 4 · plains 2 · mountain 1   ENERGY river 2 · plains 3 · mountain 1   ORE plains 1 · mountain 1 + peaks
//
// Default spot: WIDGET//CTL col 3 row 0 → fallback top 40, right 766 (= 524 + 230 + 12).
// Hidden while ~/Library/Application Support/STUDYTERM/hidden exists (⌃⌥⌘W toggles it).
// No JSX fragments (<>…</>): Übersicht has no global React, so they crash with "Can't find variable: React".

import { run } from "uebersicht";

// ── WIDGET//CTL block — theme + position, set by the WIDGET//CTL app (⌃⌥⌘S). Identical in every widget: change them together. ──
// Reads ~/Library/Application Support/STUDYTERM/widgets.json on every refresh. No file / no entry for this widget →
// it keeps its className spot and the cyan terminal look, exactly as before. "placed": false → stored (renders nothing).
const W_ID = "outpost";
const W_CFG = `cat "$HOME/Library/Application Support/STUDYTERM/widgets.json" 2>/dev/null | tr -d '\\n\\r'`;
// schemes = colours. c accent · blue/amber/red status · dim muted · bg panel rgb · inset field rgb · text body. cycle = rainbow hue drift
const W_SCHEMES = {
  cyan:    { c: "#3ef0ff", blue: "#1f8fff", amber: "#ffb84d", red: "#ff5f6d", dim: "#5d7a99", bg: "4,9,20",      inset: "10,24,48",    text: "#cfefff" },
  amber:   { c: "#ffb000", blue: "#ff7b29", amber: "#ffe066", red: "#ff4d3d", dim: "#8f7350", bg: "16,9,2",      inset: "40,22,6",     text: "#ffe9c4" },
  matrix:  { c: "#3dff7f", blue: "#19c25e", amber: "#d8ff47", red: "#ff4f6b", dim: "#4f8a62", bg: "2,13,6",      inset: "6,32,14",     text: "#d4ffe1" },
  vapor:   { c: "#ff5ad9", blue: "#8b6dff", amber: "#ffc857", red: "#ff4f7e", dim: "#8c6fa3", bg: "15,5,25",     inset: "38,14,56",    text: "#f7deff" },
  sunset:  { c: "#ff8c5a", blue: "#ffc06b", amber: "#ffe07a", red: "#ff4f6d", dim: "#9c7a72", bg: "22,9,10",     inset: "52,20,22",    text: "#ffe7dc" },
  ice:     { c: "#eaf6ff", blue: "#8ec9ff", amber: "#ffd38f", red: "#ff8f8f", dim: "#7e90a6", bg: "12,16,24",    inset: "30,38,52",    text: "#f3f8ff" },
  gold:    { c: "#e8c15a", blue: "#c9a227", amber: "#f5dc8c", red: "#d9534f", dim: "#8a7a4f", bg: "8,8,8",       inset: "26,24,18",    text: "#f3e6c0" },
  royal:   { c: "#ffffff", blue: "#d9c8ff", amber: "#ffd479", red: "#ff8fa3", dim: "#b9a3e6", bg: "74,32,140",   inset: "98,54,170",   text: "#f4eeff" },
  marble:  { c: "#2d2a26", blue: "#5b6b7a", amber: "#a07a2c", red: "#b0413e", dim: "#8d877e", bg: "243,240,234", inset: "228,224,216", text: "#3a3631" },
  pastel:  { c: "#8a6fd1", blue: "#5f9bd6", amber: "#d69a4a", red: "#d9707f", dim: "#a59bb4", bg: "251,245,252", inset: "240,232,246", text: "#4d4560" },
  rose:    { c: "#f2b5a7", blue: "#d79a8c", amber: "#f5d0a9", red: "#e0707a", dim: "#8f7471", bg: "26,17,19",    inset: "48,32,35",    text: "#f8e4df" },
  ink:     { c: "#111111", blue: "#3a3a3a", amber: "#8a6d1f", red: "#c0392b", dim: "#8a8a8a", bg: "255,255,255", inset: "240,240,240", text: "#1a1a1a" },
  forest:  { c: "#a8d5a2", blue: "#7fb7a4", amber: "#e3c77a", red: "#e08a7a", dim: "#6f8a6a", bg: "14,26,18",    inset: "26,44,32",    text: "#e2f1df" },
  ocean:   { c: "#7fdbff", blue: "#4aa3df", amber: "#ffd27f", red: "#ff7f8f", dim: "#5f86a3", bg: "6,28,48",     inset: "14,48,76",    text: "#e2f5ff" },
  rainbow: { c: "#ff4fd8", blue: "#4fa8ff", amber: "#ffd84f", red: "#ff4f6b", dim: "#9a7fb8", bg: "12,6,22",     inset: "34,18,52",    text: "#fbeaff", cycle: true },
  vice:    { c: "#ff4fa3", blue: "#2de2e6", amber: "#ffb347", red: "#ff3f5e", dim: "#a07ab8", bg: "24,8,40",     inset: "52,16,72",    text: "#ffe6f3" },
};
// styles = finish. tex grid|scan|glass|marble|none · bw border px · hard = offset shadow · glow = neon text/edges
const W_STYLES = {
  terminal: { tex: "grid",   bin: true,  brackets: true,  radius: 0,  alpha: 0.88, blur: 22, glow: true,  edge: "55", bw: 1 },
  crt:      { tex: "scan",   bin: false, brackets: true,  radius: 4,  alpha: 0.92, blur: 16, glow: true,  edge: "77", bw: 1 },
  glass:    { tex: "glass",  bin: false, brackets: false, radius: 18, alpha: 0.5,  blur: 30, glow: true,  edge: "40", bw: 1 },
  minimal:  { tex: "none",   bin: false, brackets: false, radius: 8,  alpha: 0.95, blur: 10, glow: false, edge: "30", bw: 1 },
  marble:   { tex: "marble", bin: false, brackets: false, radius: 12, alpha: 0.97, blur: 8,  glow: false, edge: "44", bw: 1 },
  paper:    { tex: "none",   bin: false, brackets: false, radius: 14, alpha: 0.98, blur: 0,  glow: false, edge: "18", bw: 1, soft: true },
  bold:     { tex: "none",   bin: false, brackets: false, radius: 0,  alpha: 1,    blur: 0,  glow: false, edge: "",   bw: 2, hard: true },
  vice:     { tex: "vice",   bin: false, brackets: false, radius: 10, alpha: 0.9,  blur: 20, glow: true,  edge: "88", bw: 1 },
};
let C, BLUE, AMBER, RED, DIM, T;
let W_LAST = null, W_POS = { position: "relative" };
const W_RGBA = (hex, a) => { const n = parseInt(String(hex).slice(1), 16) || 0; return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };
const W_INSET = () => `rgba(${T.inset},0.55)`;
const W_APPLY = (style, scheme) => {
  const st = W_STYLES[style] ? style : "terminal", sc = W_SCHEMES[scheme] ? scheme : "cyan";
  T = { ...W_STYLES[st], ...W_SCHEMES[sc], name: st };
  C = T.c; BLUE = T.blue; AMBER = T.amber; RED = T.red; DIM = T.dim;
};
W_APPLY("terminal", "cyan");
const W_LOAD = (output) => {
  const m = /CFG:(\{.*\})/.exec(output || "");
  if (m) { try { W_LAST = JSON.parse(m[1]); } catch (e) {} }
  const cfg = W_LAST || {}, g = cfg.global || {}, w = (cfg.widgets || {})[W_ID] || {};
  W_APPLY(w.style || g.style, w.scheme || g.scheme);
  const ok = typeof w.x === "number" && typeof w.y === "number";
  W_POS = ok ? { position: "fixed", left: w.x, top: w.y } : { position: "relative" };
  return { unplaced: w.placed === false };
};
const W_TEX = () => {
  if (T.tex === "grid") return `linear-gradient(${W_RGBA(C, 0.045)} 1px, transparent 1px), linear-gradient(90deg, ${W_RGBA(C, 0.045)} 1px, transparent 1px)`;
  if (T.tex === "scan") return `repeating-linear-gradient(0deg, ${W_RGBA(C, 0.07)} 0px, ${W_RGBA(C, 0.07)} 1px, transparent 1px, transparent 3px)`;
  if (T.tex === "glass") return `linear-gradient(135deg, ${W_RGBA(C, 0.12)}, transparent 55%)`;
  if (T.tex === "marble") {
    const v = W_RGBA(T.dim, 0.38), v2 = W_RGBA(T.dim, 0.2);
    return [
      `linear-gradient(118deg, transparent 31%, ${v} 31.6%, transparent 33%)`,
      `linear-gradient(152deg, transparent 58%, ${v2} 58.5%, transparent 60.5%)`,
      `linear-gradient(28deg, transparent 69%, ${v2} 69.4%, transparent 70.6%)`,
      `linear-gradient(97deg, transparent 12%, ${v2} 12.3%, transparent 13.4%)`,
      `radial-gradient(ellipse at 78% 22%, ${W_RGBA(T.text, 0.06)}, transparent 55%)`,
      `radial-gradient(ellipse at 15% 85%, ${W_RGBA(T.dim, 0.12)}, transparent 50%)`,
    ].join(", ");
  }
  if (T.tex === "vice") return [
    `radial-gradient(ellipse at 88% 118%, ${W_RGBA(T.amber, 0.42)}, transparent 58%)`,
    `radial-gradient(ellipse at 8% -12%, ${W_RGBA(C, 0.30)}, transparent 60%)`,
    `repeating-linear-gradient(0deg, ${W_RGBA(T.blue, 0.07)} 0px, ${W_RGBA(T.blue, 0.07)} 1px, transparent 1px, transparent 9px)`,
    `linear-gradient(160deg, ${W_RGBA(C, 0.10)}, ${W_RGBA(T.blue, 0.08)})`,
  ].join(", ");
  return "none";
};
// col = the widget's own frame colour (STUDY//TERM: dim at standby, amber paused). Flat styles only show
// it when it means something — standby dim would turn their solid border + hard shadow muddy, so they use the accent.
const W_PANEL = (c0) => { const col = !T.glow && c0 === DIM ? C : c0; return ({
  ...W_POS,
  background: `rgba(${T.bg},${T.alpha})`, backdropFilter: `blur(${T.blur}px)`, WebkitBackdropFilter: `blur(${T.blur}px)`,
  border: `${T.bw}px solid ${col}${T.edge}`, borderRadius: T.radius, color: T.text,
  boxShadow: T.hard ? `5px 5px 0 ${col}`
    : T.soft ? "0 10px 26px rgba(0,0,0,0.28), 0 2px 6px rgba(0,0,0,0.18)"
    : (T.glow ? `0 8px 30px rgba(0,0,0,0.45), 0 0 18px ${col}22` : "0 6px 20px rgba(0,0,0,0.35)") + (T.tex === "scan" ? ", inset 0 0 40px rgba(0,0,0,0.55)" : ""),
  backgroundImage: W_TEX(),
  backgroundSize: T.tex === "grid" ? "12px 12px" : "auto",
  animation: T.cycle ? "wctlhue 16s linear infinite" : "none",
}); };
const W_CSS = `.wctl-noglow * { text-shadow: none !important; filter: none !important; }
@keyframes wctlhue { from { filter: hue-rotate(0deg) } to { filter: hue-rotate(360deg) } }`;
// ── end WIDGET//CTL block ──

const SUP = `"$HOME/Library/Application Support/STUDYTERM"`;
const SAVE_F = `${SUP}/outpost-save.json`;
const BEST_F = `${SUP}/outpost-best`;

export const command = `H="$HOME/Library/Application Support/STUDYTERM/hidden"; [ -f "$H" ] && { echo HIDDEN; exit 0; }; echo "CFG:$(${W_CFG})"; echo "BEST:$(cat ${BEST_F} 2>/dev/null)"; echo "SAVE:$(base64 -i ${SAVE_F} 2>/dev/null | tr -d '\\n')"`;

export const refreshFrequency = 2000; // theme / position / hidden only — the game redraws itself on every click

export const className = `
  top: 40px;
  right: 766px;
  font-family: "SF Mono", Menlo, ui-monospace, monospace;
  color: #cfefff;
`;

export const initialState = { output: "", f: 0 };
export const updateState = (ev, prev) => {
  switch (ev.type) {
    case "UB/COMMAND_RAN": return { ...prev, output: ev.output || prev.output };
    case "FRAME": return { ...prev, f: ev.f };
    default: return prev;
  }
};

// ───────── rules ─────────
const COLS = 7, ROWS = 5, CELL = 26, STORE = 17, MONTHS = 12;
const NAMES = ["YOU", "KADE", "RHO", "VEX"];
const RES = ["F", "E", "O"];
const RNAME = { F: "FOOD", E: "ENERGY", O: "ORE" };
const BASE = { F: 30, E: 25, O: 50 };
const TARGET = { F: 12, E: 12, O: 8 };
const OUTFIT = { F: 25, E: 50, O: 75 };
const EAT = 3, LAND = 400, BOT_VALUE = 120;
const YIELD = { river: { F: 4, E: 2, O: 0 }, plains: { F: 2, E: 3, O: 1 }, mtn: { F: 1, E: 1, O: 1 } };

const rnd = (n) => Math.floor(Math.random() * n);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const buyPrice = (k) => Math.round(BASE[k] * clamp(1 + ((TARGET[k] - G.store[k]) / TARGET[k]) * 0.9, 0.5, 2.5));
const sellPrice = (k) => Math.round(buyPrice(k) * 0.75);
const botPrice = () => 100 + 12 * Math.max(0, 6 - G.store.O);
const baseYield = (c, k) => YIELD[c.t][k] + (k === "O" && c.t === "mtn" ? c.peaks : 0);
const robots = (i) => G.map.filter((c) => c.owner === i && c.job).length;
const needOf = (i, k) => (k === "F" ? EAT : k === "E" ? robots(i) + 1 : 0);

let G = null;           // the game; null until a save is loaded or a new game starts
let LOADED = false, BEST = 0, SAVED_BEST = 0, DISPATCH = null, FR = 0;

const bump = () => { FR++; if (DISPATCH) DISPATCH({ type: "FRAME", f: FR }); };
const save = () => {
  try {
    const b = btoa(unescape(encodeURIComponent(JSON.stringify(G))));
    run(`mkdir -p ${SUP}; printf %s '${b}' | base64 -D > ${SAVE_F}`).catch(() => {});
  } catch (e) {}
};
const saveBest = (n) => {
  if (n > SAVED_BEST) { SAVED_BEST = n; run(`mkdir -p ${SUP}; echo ${n} > ${BEST_F}`).catch(() => {}); }
};

const newGame = () => {
  const map = [];
  for (let i = 0; i < COLS * ROWS; i++) map.push({ t: i % COLS === 3 ? "river" : "plains", peaks: 0, owner: -1, job: null });
  map[STORE] = { t: "store", peaks: 0, owner: -2, job: null };
  let m = 0;
  while (m < 9) {
    const i = rnd(COLS * ROWS);
    if (map[i].t === "plains") { map[i].t = "mtn"; map[i].peaks = 1 + rnd(3); m++; }
  }
  G = {
    v: 1, month: 1, phase: "claim", map, sel: -1, mk: 0, hungry: [false, false, false, false],
    p: NAMES.map((n) => ({ money: 1000, F: 4, E: 2, O: 0 })),
    store: { F: 10, E: 10, O: 8 },
    msg: "MONTH 1 · CLICK A FREE PLOT TO CLAIM IT", last: null, scores: null,
  };
  save(); bump();
};

// ───────── AI ─────────
const value = (c, k) => baseYield(c, k) * buyPrice(k);
const bestJob = (c) => RES.reduce((a, k) => (value(c, k) > value(c, a) ? k : a), "F");
const aiClaim = (i) => {
  let best = -1, score = -1;
  G.map.forEach((c, j) => {
    if (c.owner !== -1) return;
    const s = Math.max(...RES.map((k) => value(c, k))) + Math.random() * 20;
    if (s > score) { score = s; best = j; }
  });
  if (best >= 0) G.map[best].owner = i;
};
const install = (i, j, k) => {
  const c = G.map[j], p = G.p[i];
  const cost = (c.job ? 0 : botPrice()) + OUTFIT[k];
  if (p.money < cost) return false;
  if (!c.job && G.store.O > 0) G.store.O -= 1;      // every new robot is built from store ore
  p.money -= cost; c.job = k;
  return true;
};
const aiBuild = (i) => {
  G.map.forEach((c, j) => {
    if (c.owner !== i || c.job) return;
    const k = robots(i) >= G.p[i].E + 1 && YIELD[c.t].E > 1 ? "E" : bestJob(c);
    if (G.p[i].money - (botPrice() + OUTFIT[k]) > 150) install(i, j, k);
  });
};
const aiTrade = (i, k) => {
  const p = G.p[i], need = needOf(i, k) + (k === "F" ? 1 : 0);
  if (p[k] > need) { const n = p[k] - need; for (let x = 0; x < n; x++) { p.money += sellPrice(k); p[k]--; G.store[k]++; } }
  else {
    let short = need - p[k];
    while (short > 0 && G.store[k] > 0 && p.money - buyPrice(k) > 100) { p.money -= buyPrice(k); p[k]++; G.store[k]--; short--; }
  }
};

// ───────── phases ─────────
const EVENTS = [
  { t: "SOLAR FLARE · energy robots +2", f: (c, k) => (k === "E" ? 2 : 0) },
  { t: "DUST STORM · plains food −1", f: (c, k) => (k === "F" && c.t === "plains" ? -1 : 0) },
  { t: "RICH VEIN · mountain ore +1", f: (c, k) => (k === "O" && c.t === "mtn" ? 1 : 0) },
  { t: "RIVER FLOOD · river energy −1, food +1", f: (c, k) => (c.t === "river" ? (k === "E" ? -1 : k === "F" ? 1 : 0) : 0) },
  { t: "SUPPLY SHIP · store restocked", f: () => 0, once: () => RES.forEach((k) => { G.store[k] += 4; }) },
  { t: "PEST BLOOM · food robots −1", f: (c, k) => (k === "F" ? -1 : 0) },
];

const produce = () => {
  const ev = Math.random() < 0.6 ? EVENTS[rnd(EVENTS.length)] : null;
  if (ev && ev.once) ev.once();
  const out = [];
  for (let i = 0; i < 4; i++) {
    const p = G.p[i];
    const mine = G.map.map((c, j) => ({ c, j })).filter((x) => x.c.owner === i && x.c.job);
    const powered = Math.min(p.E, mine.length);
    p.E -= powered;
    const idle = G.hungry[i] && mine.length ? mine[rnd(mine.length)].j : -1;
    const got = { F: 0, E: 0, O: 0 };
    const count = { F: 0, E: 0, O: 0 };
    mine.forEach((x) => { count[x.c.job]++; });
    mine.forEach((x, n) => {
      if (x.j === idle) return;
      const k = x.c.job;
      let y = baseYield(x.c, k) + rnd(3) - 1 + (count[k] >= 3 ? 1 : 0) + (ev ? ev.f(x.c, k) : 0);
      y = Math.max(0, y);
      if (n >= powered) y = Math.floor(y / 2);         // no energy for this robot → half output
      got[k] += y;
    });
    RES.forEach((k) => { p[k] += got[k]; });
    out.push({ got, unpowered: mine.length - powered, idle: idle >= 0 });
  }
  G.last = out;
  const me = out[0];
  G.msg = `YOU +${me.got.F}F +${me.got.E}E +${me.got.O}O` + (me.unpowered ? ` · ${me.unpowered} UNPOWERED` : "") + (me.idle ? " · 1 IDLE (HUNGRY)" : "")
    + (ev ? ` ⚡ ${ev.t.toUpperCase()}` : "");
  G.phase = "produce";
};

const endMonth = () => {
  for (let i = 0; i < 4; i++) {
    const p = G.p[i];
    p.F -= EAT;
    G.hungry[i] = p.F < 0;
    if (p.F < 0) p.F = 0;
  }
  if (G.month >= MONTHS) return finish();
  G.month++; G.phase = "claim"; G.sel = -1;
  G.msg = (G.hungry[0] ? "YOU WENT HUNGRY · 1 ROBOT IDLES · " : "") + `MONTH ${G.month} · CLAIM A FREE PLOT`;
  if (!G.map.some((c) => c.owner === -1)) { G.phase = "build"; G.msg = `MONTH ${G.month} · NO LAND LEFT · BUILD`; }
};

const score = (i) => {
  const p = G.p[i], plots = G.map.filter((c) => c.owner === i).length;
  return p.money + plots * LAND + robots(i) * BOT_VALUE + RES.reduce((a, k) => a + p[k] * sellPrice(k), 0);
};
const finish = () => {
  G.scores = [0, 1, 2, 3].map((i) => ({ i, s: score(i) })).sort((a, b) => b.s - a.s);
  const total = G.scores.reduce((a, x) => a + x.s, 0);
  G.rating = total < 22000 ? "ABANDONED" : total < 25000 ? "STRUGGLING" : total < 28000 ? "THRIVING" : "BOOMTOWN";
  G.total = total;
  G.phase = "over";
  const mine = G.scores.find((x) => x.i === 0).s;
  if (mine > BEST) BEST = mine;
  saveBest(BEST);
};

// ───────── player actions ─────────
const clickCell = (j) => {
  if (!G) return;
  const c = G.map[j];
  if (G.phase === "claim" && c.owner === -1) {
    c.owner = 0;
    [1, 2, 3].forEach(aiClaim);
    G.phase = "build"; G.sel = -1;
    G.msg = `BUILD · ROBOT $${botPrice()} + JOB · CLICK YOUR PLOT`;
  } else if (G.phase === "build" && c.owner === 0) {
    G.sel = G.sel === j ? -1 : j;
    G.msg = G.sel < 0 ? "BUILD · CLICK YOUR PLOT" : c.job ? `RE-OUTFIT THIS ${RNAME[c.job]} ROBOT` : `NEW ROBOT $${botPrice()} + JOB`;
  } else return;
  save(); bump();
};
const pickJob = (k) => {
  if (G.sel < 0) return;
  const c = G.map[G.sel];
  if (c.job === k) return;
  if (install(0, G.sel, k)) G.msg = `${RNAME[k]} ROBOT ON ${c.t === "mtn" ? "MOUNTAIN" : c.t.toUpperCase()} · YIELD ~${baseYield(c, k)}`;
  else G.msg = `NOT ENOUGH CASH ($${(c.job ? 0 : botPrice()) + OUTFIT[k]})`;
  save(); bump();
};
const doneBuild = () => {
  [1, 2, 3].forEach(aiBuild);
  G.sel = -1; produce(); save(); bump();
};
const toMarket = () => { G.phase = "market"; G.mk = 0; G.msg = ""; save(); bump(); };
const trade = (dir) => {
  const k = RES[G.mk], p = G.p[0];
  if (dir > 0) {
    if (!G.store[k]) G.msg = `STORE IS OUT OF ${RNAME[k]}`;
    else if (p.money < buyPrice(k)) G.msg = "NOT ENOUGH CASH";
    else { p.money -= buyPrice(k); p[k]++; G.store[k]--; G.msg = ""; }
  } else if (p[k] > 0) { p.money += sellPrice(k); p[k]--; G.store[k]++; G.msg = ""; }
  save(); bump();
};
const doneMarket = () => {
  [1, 2, 3].forEach((i) => aiTrade(i, RES[G.mk]));
  if (G.mk < 2) { G.mk++; G.msg = ""; }
  else endMonth();
  save(); bump();
};

// ───────── look ─────────
const BIN = "0110100101110011 1000110101001011 0011101011000101 1101001010010110 0101110100101101 1010011101010010 0110101100101011 1001010111010010 0101101001110101 1100101011010010 0011010110101101 1001011010110100";
const Bracket = ({ pos, color }) => {
  const p = {
    tl: { top: -1, left: -1, borderTopWidth: 2, borderLeftWidth: 2 },
    tr: { top: -1, right: -1, borderTopWidth: 2, borderRightWidth: 2 },
    bl: { bottom: -1, left: -1, borderBottomWidth: 2, borderLeftWidth: 2 },
    br: { bottom: -1, right: -1, borderBottomWidth: 2, borderRightWidth: 2 },
  }[pos];
  return <div style={{ position: "absolute", width: 10, height: 10, borderColor: color, borderStyle: "solid", borderWidth: 0, filter: `drop-shadow(0 0 3px ${color})`, ...p }} />;
};
const OWN = () => [C, BLUE, AMBER, RED];
const CSS = () => `.op-btn:hover{background:${W_RGBA(C, 0.16)} !important} .op-cell:hover{filter:brightness(1.35)}`;

const btn = (key, label, on, col, dim) => (
  <span key={key} className="op-btn" onClick={dim ? undefined : on} style={{
    display: "inline-block", padding: "2px 5px", marginRight: 4, fontSize: 8, letterSpacing: 1, cursor: dim ? "default" : "pointer",
    userSelect: "none", color: dim ? DIM : col || C, border: `1px solid ${dim ? DIM : col || C}66`, opacity: dim ? 0.6 : 1,
  }}>{label}</span>
);

const cellView = (c, j) => {
  const r = Math.floor(j / COLS), x = j % COLS, own = OWN();
  const claimable = G.phase === "claim" && c.owner === -1;
  const mine = G.phase === "build" && c.owner === 0;
  const oc = c.owner >= 0 ? own[c.owner] : null;
  const bg = c.t === "river" ? W_RGBA(BLUE, 0.2) : c.t === "mtn" ? W_RGBA(DIM, 0.28) : c.t === "store" ? W_RGBA(C, 0.18) : W_RGBA(C, 0.05);
  return (
    <div key={j} className={claimable || mine ? "op-cell" : ""} onClick={() => clickCell(j)} style={{
      position: "absolute", left: x * CELL, top: r * CELL, width: CELL - 2, height: CELL - 2, boxSizing: "border-box",
      background: bg, border: oc ? `2px solid ${oc}` : `1px solid ${W_RGBA(C, claimable ? 0.45 : 0.12)}`,
      outline: G.sel === j ? `1px solid ${T.text}` : "none", outlineOffset: 1,
      cursor: claimable || mine ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: oc && T.glow ? `0 0 6px ${oc}55` : "none",
    }}>
      <span style={{ position: "absolute", top: 1, left: 2, fontSize: 6.5, lineHeight: "7px", color: c.t === "river" ? BLUE : DIM, letterSpacing: -0.5 }}>
        {c.t === "river" ? "≈" : c.t === "mtn" ? "▲".repeat(c.peaks) : ""}
      </span>
      {c.t === "store" && <span style={{ fontSize: 11, color: C }}>⌂</span>}
      {c.job && <span style={{ fontSize: 10, fontWeight: 700, color: oc, textShadow: T.glow ? `0 0 5px ${oc}` : "none" }}>{c.job}</span>}
    </div>
  );
};

export const render = ({ output }, dispatch) => {
  DISPATCH = dispatch;
  if (/^HIDDEN/.test(output || "")) return <div />;
  const W_L = W_LOAD(output);
  if (W_L.unplaced) return <div />;
  const bm = /BEST:(\d+)/.exec(output || "");
  if (bm) { const b = parseInt(bm[1], 10) || 0; if (b > BEST) BEST = b; if (b > SAVED_BEST) SAVED_BEST = b; }
  if (!LOADED) {
    const sm = /SAVE:(\S+)/.exec(output || "");
    if (sm) { try { const g = JSON.parse(decodeURIComponent(escape(atob(sm[1])))); if (g && g.v === 1 && g.map) G = g; } catch (e) {} }
    if (/SAVE:/.test(output || "")) LOADED = true;
  }

  const own = OWN();
  const p = G ? G.p[0] : null;
  const col = G && G.phase === "over" ? AMBER : C;
  const head = !G ? "NEW COLONY" : G.phase === "over" ? "FINAL" : `MO ${G.month}/${MONTHS}`;

  // map + overlays
  let mapArea;
  if (!G) {
    mapArea = (
      <div onClick={newGame} style={{ position: "relative", height: ROWS * CELL, cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 6, textAlign: "center", border: `1px solid ${C}33`, background: W_INSET() }}>
        <div style={{ fontSize: 18, letterSpacing: 4, color: C, textShadow: T.glow ? `0 0 10px ${C}` : "none" }}>OUTPOST//</div>
        <div style={{ fontSize: 7.5, lineHeight: "11px", letterSpacing: 0.8, color: DIM, padding: "0 10px" }}>CLAIM LAND · BUILD ROBOTS<br />PRODUCE · TRADE · 12 MONTHS<br />3 RIVALS · ONE COLONY</div>
        <div style={{ fontSize: 8.5, letterSpacing: 1.5, color: C }}>▶ CLICK TO START{BEST ? ` · BEST $${BEST}` : ""}</div>
      </div>
    );
  } else {
    const over = G.phase === "over" ? (
      <div onClick={newGame} style={{ position: "absolute", inset: 0, cursor: "pointer", background: `rgba(${T.bg},0.88)`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 3 }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: AMBER }}>COLONY: {G.rating}</div>
        {G.scores.map((x, n) => (
          <div key={x.i} style={{ fontSize: 9, letterSpacing: 1, color: own[x.i], width: 140, display: "flex", justifyContent: "space-between" }}>
            <span>{n + 1}. {NAMES[x.i]}</span><span>${x.s}</span>
          </div>
        ))}
        <div style={{ fontSize: 7.5, letterSpacing: 1.5, color: C, marginTop: 3 }}>CLICK FOR A NEW COLONY</div>
      </div>
    ) : null;
    mapArea = (
      <div style={{ position: "relative", width: COLS * CELL, height: ROWS * CELL, margin: "0 auto" }}>
        {G.map.map(cellView)}
        {over}
      </div>
    );
  }

  // status + controls
  let line = "", ctrls = [];
  if (G && G.phase === "claim") { line = G.msg; ctrls = [btn("x", "PASS ▸", () => { [1, 2, 3].forEach(aiClaim); G.phase = "build"; G.msg = "BUILD · CLICK YOUR PLOT"; save(); bump(); }, DIM)]; }
  if (G && G.phase === "build") {
    line = G.msg;
    const c = G.sel >= 0 ? G.map[G.sel] : null;
    ctrls = RES.map((k) => btn(k, `${k} ${(c && c.job ? 0 : botPrice()) + OUTFIT[k]}`, () => pickJob(k), own[0], !c || (c && c.job === k)))
      .concat([btn("d", "DONE", doneBuild, AMBER)]);
  }
  if (G && G.phase === "produce") { line = G.msg; ctrls = [btn("n", "MARKET ▸", toMarket, AMBER)]; }
  if (G && G.phase === "market") {
    const k = RES[G.mk];
    line = G.msg || `${RNAME[k]} · YOU ${p[k]} · NEED ${needOf(0, k)} · STORE ${G.store[k]}`;
    ctrls = [btn("s", `SELL $${sellPrice(k)}`, () => trade(-1), C, p[k] <= 0), btn("b", `BUY $${buyPrice(k)}`, () => trade(1), BLUE, !G.store[k]), btn("d", G.mk < 2 ? "NEXT ▸" : "END MONTH ▸", doneMarket, AMBER)];
  }
  if (G && G.phase === "over") { line = `YOU FINISHED #${G.scores.findIndex((x) => x.i === 0) + 1} · BEST $${BEST}`; }

  return (
    <div className={"wctl-" + T.name + (T.glow ? "" : " wctl-noglow")} style={{
      width: 230, height: 314, padding: "16px 18px 14px", overflow: "hidden",
      boxSizing: "border-box", display: "flex", flexDirection: "column", ...W_PANEL(col),
    }}>
      <style>{W_CSS}</style>
      <style>{CSS()}</style>
      {T.bin && <div style={{ position: "absolute", inset: 0, fontSize: 8, lineHeight: "10px", letterSpacing: 2, color: C, opacity: 0.06, wordBreak: "break-all", pointerEvents: "none" }}>{BIN}{BIN}</div>}
      {T.brackets && ["tl", "tr", "bl", "br"].map((q) => <Bracket key={q} pos={q} color={col} />)}

      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 9, letterSpacing: 2, flexShrink: 0 }}>
        <span style={{ color: C, textShadow: T.glow ? `0 0 6px ${C}` : "none" }}>OUTPOST//</span>
        <span style={{ fontSize: 8.5, letterSpacing: 1.5, color: DIM }}>{head}{G && G.phase !== "over" ? ` · ${G.phase.toUpperCase()}` : ""}</span>
      </div>
      <div style={{ position: "relative", height: 1, background: `${C}33`, margin: "8px 0 8px", flexShrink: 0 }} />

      {mapArea}

      <div style={{ position: "relative", marginTop: 8, flex: 1, display: "flex", flexDirection: "column" }}>
        {G && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, letterSpacing: 0.6 }}>
            <span style={{ color: own[0] }}>${p.money}</span>
            <span style={{ color: T.text }}>F{p.F} · E{p.E} · O{p.O}</span>
            <span style={{ color: DIM }}>🤖{robots(0)}</span>
          </div>
        )}
        {G && G.phase !== "over" && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 7, letterSpacing: 0.5, color: DIM, marginTop: 3 }}>
            {[1, 2, 3].map((i) => <span key={i} style={{ color: own[i] }}>{NAMES[i]} ${G.p[i].money}</span>)}
          </div>
        )}
        <div style={{ fontSize: 7.5, lineHeight: "10px", letterSpacing: 0.6, color: T.text, marginTop: 5, minHeight: 20 }}>{line}</div>
        <div style={{ marginTop: "auto" }}>{ctrls}</div>
      </div>
    </div>
  );
};
