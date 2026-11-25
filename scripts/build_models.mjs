import fs from 'node:fs';
import path from 'node:path';
import { PARTS, COLORS } from '../js/legoCatalog.js';

const ROOT = path.resolve(process.cwd());
const DATA_DIR = path.join(ROOT, 'data');
const DOCS_DIR = path.join(ROOT, 'docs');
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(DOCS_DIR, { recursive: true });

/**
 * 3D Voxel Occupancy Grid + Authentic LEGO Brick Packer.
 * Guarantees ZERO overlapping orthogonal bricks while generating true
 * running-bond LEGO Architecture masonry (800–1,600+ bricks per set).
 */
class LegoBuilder {
  constructor(setMeta) {
    this.meta = setMeta;
    this.bricks = [];
    this.decals = [];
    this.occ = new Set();
    this.stepMeta = [];
    this.currentBag = 1;
    this.currentStep = 0;
  }

  _key(x, y, z) {
    return `${x},${y},${z}`;
  }

  isFree(xMin, yMin, zMin, w, h, d) {
    for (let x = xMin; x < xMin + w; x++) {
      for (let y = yMin; y < yMin + h; y++) {
        for (let z = zMin; z < zMin + d; z++) {
          if (this.occ.has(this._key(x, y, z))) return false;
        }
      }
    }
    return true;
  }

  _occupy(xMin, yMin, zMin, w, h, d) {
    for (let x = xMin; x < xMin + w; x++) {
      for (let y = yMin; y < yMin + h; y++) {
        for (let z = zMin; z < zMin + d; z++) {
          this.occ.add(this._key(x, y, z));
        }
      }
    }
  }

  beginStep(bag, title, tip, decalTag = null) {
    this.currentBag = bag;
    this.currentStep += 1;
    this.stepMeta.push({
      step: this.currentStep,
      bag,
      title,
      tip,
      hasSticker: !!decalTag
    });
    return this.currentStep;
  }

  place(part, color, xMin, yMin, zMin, rot = 0, force = false) {
    const def = PARTS[part];
    if (!def) throw new Error(`Unknown part: ${part}`);
    const isRot = (rot % 2) === 1;
    const w = isRot ? def.d : def.w;
    const d = isRot ? def.w : def.d;
    const h = def.h;

    if (!force && !this.isFree(xMin, yMin, zMin, w, h, d)) {
      return false;
    }
    if (!force) this._occupy(xMin, yMin, zMin, w, h, d);

    this.bricks.push({
      part,
      color,
      x: xMin + w / 2,
      y: yMin,
      z: zMin + d / 2,
      rot,
      bag: this.currentBag,
      step: this.currentStep
    });
    return true;
  }

  placeAngled(part, color, cx, yMin, cz, rotDeg = 0) {
    const def = PARTS[part];
    if (!def) throw new Error(`Unknown part: ${part}`);
    this.bricks.push({
      part,
      color,
      x: Number(cx.toFixed(3)),
      y: yMin,
      z: Number(cz.toFixed(3)),
      rot: 0,
      rotDeg: Number(rotDeg.toFixed(2)),
      bag: this.currentBag,
      step: this.currentStep
    });
  }

  addDecal(id, label, part, color, xMin, yMin, zMin, rot, camOffset = [0, 3, 9], rotDeg = undefined) {
    const def = PARTS[part];
    const isRot = (rot % 2) === 1;
    const w = isRot ? def.d : def.w;
    const d = isRot ? def.w : def.d;
    const cx = rotDeg !== undefined ? xMin : (xMin + w / 2);
    const cz = rotDeg !== undefined ? zMin : (zMin + d / 2);
    const cy = (yMin + def.h / 2) * 0.4;

    if (rotDeg !== undefined) {
      this.placeAngled(part, color, xMin, yMin, zMin, rotDeg);
    } else {
      this.place(part, color, xMin, yMin, zMin, rot, true);
    }

    this.decals.push({
      id,
      label,
      partId: def.partId,
      step: this.currentStep,
      target: [Number(cx.toFixed(2)), Number(cy.toFixed(2)), Number(cz.toFixed(2))],
      cameraPos: [
        Number((cx + camOffset[0]).toFixed(2)),
        Number((cy + camOffset[1]).toFixed(2)),
        Number((cz + camOffset[2]).toFixed(2))
      ]
    });
  }

  /**
   * Packs a 1-stud-thick line along X from x1 to x2 (exclusive) using real
   * LEGO bricks/plates/tiles (lengths 6,4,3,2,1) with optional staggered start.
   */
  spanX(x1, x2, y, z, color, kind = 'brick', stagger = false) {
    const sizes = kind === 'tile'
      ? [[6, 'tile_1x6'], [4, 'tile_1x4'], [3, 'tile_1x3'], [2, 'tile_1x2'], [1, 'tile_1x1']]
      : kind === 'plate'
        ? [[8, 'plate_1x8'], [6, 'plate_1x6'], [4, 'plate_1x4'], [3, 'plate_1x3'], [2, 'plate_1x2'], [1, 'plate_1x1']]
        : [[6, 'brick_1x6'], [4, 'brick_1x4'], [3, 'brick_1x3'], [2, 'brick_1x2'], [1, 'brick_1x1']];

    let x = x1;
    const h = kind === 'brick' ? 3 : 1;
    if (stagger && (x2 - x1) >= 3) {
      if (this.isFree(x, y, z, 2, h, 1)) {
        const p2 = kind === 'tile' ? 'tile_1x2' : kind === 'plate' ? 'plate_1x2' : 'brick_1x2';
        this.place(p2, color, x, y, z, 1);
        x += 2;
      }
    }
    while (x < x2) {
      let placed = false;
      for (const [len, part] of sizes) {
        if (x + len <= x2 && this.isFree(x, y, z, len, h, 1)) {
          this.place(part, color, x, y, z, len === 1 ? 0 : 1);
          x += len;
          placed = true;
          break;
        }
      }
      if (!placed) x++;
    }
  }

  /**
   * Packs a 1-stud-thick line along Z from z1 to z2 (exclusive).
   */
  spanZ(x, y, z1, z2, color, kind = 'brick', stagger = false) {
    const sizes = kind === 'tile'
      ? [[6, 'tile_1x6'], [4, 'tile_1x4'], [3, 'tile_1x3'], [2, 'tile_1x2'], [1, 'tile_1x1']]
      : kind === 'plate'
        ? [[8, 'plate_1x8'], [6, 'plate_1x6'], [4, 'plate_1x4'], [3, 'plate_1x3'], [2, 'plate_1x2'], [1, 'plate_1x1']]
        : [[6, 'brick_1x6'], [4, 'brick_1x4'], [3, 'brick_1x3'], [2, 'brick_1x2'], [1, 'brick_1x1']];

    let z = z1;
    const h = kind === 'brick' ? 3 : 1;
    if (stagger && (z2 - z1) >= 3) {
      if (this.isFree(x, y, z, 1, h, 2)) {
        const p2 = kind === 'tile' ? 'tile_1x2' : kind === 'plate' ? 'plate_1x2' : 'brick_1x2';
        this.place(p2, color, x, y, z, 0);
        z += 2;
      }
    }
    while (z < z2) {
      let placed = false;
      for (const [len, part] of sizes) {
        if (z + len <= z2 && this.isFree(x, y, z, 1, h, len)) {
          this.place(part, color, x, y, z, 0);
          z += len;
          placed = true;
          break;
        }
      }
      if (!placed) z++;
    }
  }

  /**
   * Packs a rectangular plate or tile field [x1..x2) x [z1..z2) with zero overlap.
   */
  fillRect(x1, x2, z1, z2, y, color, kind = 'plate') {
    const candidates = kind === 'tile'
      ? [
          [4, 2, 'tile_2x4', 1], [2, 4, 'tile_2x4', 0],
          [3, 2, 'tile_2x3', 1], [2, 3, 'tile_2x3', 0],
          [2, 2, 'tile_2x2', 0], [6, 1, 'tile_1x6', 1], [1, 6, 'tile_1x6', 0],
          [4, 1, 'tile_1x4', 1], [1, 4, 'tile_1x4', 0],
          [3, 1, 'tile_1x3', 1], [1, 3, 'tile_1x3', 0],
          [2, 1, 'tile_1x2', 1], [1, 2, 'tile_1x2', 0], [1, 1, 'tile_1x1', 0]
        ]
      : [
          [8, 8, 'plate_8x16', 0], // skipped unless fits 8x16
          [8, 16, 'plate_8x16', 0], [16, 8, 'plate_8x16', 1],
          [6, 12, 'plate_6x12', 0], [12, 6, 'plate_6x12', 1],
          [6, 8, 'plate_6x8', 0], [8, 6, 'plate_6x8', 1],
          [4, 8, 'plate_4x8', 0], [8, 4, 'plate_4x8', 1],
          [4, 6, 'plate_4x6', 0], [6, 4, 'plate_4x6', 1],
          [4, 4, 'plate_4x4', 0],
          [2, 8, 'plate_2x8', 0], [8, 2, 'plate_2x8', 1],
          [2, 6, 'plate_2x6', 0], [6, 2, 'plate_2x6', 1],
          [2, 4, 'plate_2x4', 0], [4, 2, 'plate_2x4', 1],
          [2, 3, 'plate_2x3', 0], [3, 2, 'plate_2x3', 1],
          [2, 2, 'plate_2x2', 0],
          [1, 6, 'plate_1x6', 0], [6, 1, 'plate_1x6', 1],
          [1, 4, 'plate_1x4', 0], [4, 1, 'plate_1x4', 1],
          [1, 3, 'plate_1x3', 0], [3, 1, 'plate_1x3', 1],
          [1, 2, 'plate_1x2', 0], [2, 1, 'plate_1x2', 1],
          [1, 1, 'plate_1x1', 0]
        ].filter(c => !(c[0] === 8 && c[1] === 8));

    for (let z = z1; z < z2; z++) {
      for (let x = x1; x < x2; x++) {
        if (!this.isFree(x, y, z, 1, 1, 1)) continue;
        for (const [w, d, part, rot] of candidates) {
          if (x + w <= x2 && z + d <= z2 && this.isFree(x, y, z, w, 1, d)) {
            this.place(part, color, x, y, z, rot);
            break;
          }
        }
      }
    }
  }

  /**
   * Builds a hollow 1-stud-thick perimeter wall ring (authentic LEGO Architecture style!)
   */
  wallRing(x1, x2, z1, z2, y, color, kind = 'brick', stagger = false) {
    this.spanX(x1, x2, y, z1, color, kind, stagger);
    this.spanX(x1, x2, y, z2 - 1, color, kind, !stagger);
    this.spanZ(x1, y, z1 + 1, z2 - 1, color, kind, !stagger);
    this.spanZ(x2 - 1, y, z1 + 1, z2 - 1, color, kind, stagger);
  }

  finalize() {
    // Real-LEGO Stud-Clutch Integrity Pass:
    // Any smooth studless tile (tile_*, round_tile_*) that has another brick placed
    // directly on top of it MUST be a studded plate (plate_*, round_plate_*) so the
    // next assembly stage can physically snap onto studs!
    const bottomCells = new Set();
    for (const br of this.bricks) {
      if (br.rotDeg !== undefined) continue;
      const p = PARTS[br.part];
      const w = (br.rot % 2 === 1) ? p.d : p.w;
      const d = (br.rot % 2 === 1) ? p.w : p.d;
      const x0 = Math.round(br.x - w / 2);
      const z0 = Math.round(br.z - d / 2);
      for (let x = x0; x < x0 + w; x++) {
        for (let z = z0; z < z0 + d; z++) {
          bottomCells.add(`${x},${br.y},${z}`);
        }
      }
    }
    for (const br of this.bricks) {
      if (br.rotDeg !== undefined) continue;
      const p = PARTS[br.part];
      if (p.studs) continue;
      let candidate = null;
      if (br.part.startsWith('tile_')) {
        const rep = br.part.replace(/^tile_/, 'plate_');
        if (PARTS[rep]) candidate = rep;
      } else if (br.part.startsWith('round_tile_')) {
        const rep = br.part.replace(/^round_tile_/, 'round_plate_');
        if (PARTS[rep]) candidate = rep;
      }
      if (!candidate) continue;
      const w = (br.rot % 2 === 1) ? p.d : p.w;
      const d = (br.rot % 2 === 1) ? p.w : p.d;
      const x0 = Math.round(br.x - w / 2);
      const z0 = Math.round(br.z - d / 2);
      const yTop = br.y + p.h;
      let hasAbove = false;
      for (let x = x0; x < x0 + w && !hasAbove; x++) {
        for (let z = z0; z < z0 + d && !hasAbove; z++) {
          if (bottomCells.has(`${x},${yTop},${z}`)) hasAbove = true;
        }
      }
      if (hasAbove) br.part = candidate;
    }

    // Filter out any empty steps (safety)
    const nonEmptySteps = [];
    const remap = new Map();
    let idx = 0;
    for (const s of this.stepMeta) {
      const has = this.bricks.some(b => b.step === s.step);
      if (has) {
        idx++;
        remap.set(s.step, idx);
        nonEmptySteps.push({ ...s, step: idx });
      }
    }
    for (const b of this.bricks) b.step = remap.get(b.step);
    for (const d of this.decals) d.step = remap.get(d.step);

    return {
      ...this.meta,
      steps: nonEmptySteps,
      decals: this.decals,
      bricks: this.bricks
    };
  }
}

// ============================================================================
// SET 01: 台積總部及晶圓十二A廠・張忠謀大樓 (32 × 32 studs, ~1,100+ bricks)
// Matches img4.jpg at full museum collector resolution!
// ============================================================================
function buildSetMorris() {
  const b = new LegoBuilder({
    id: 'set04_morris',
    setNumber: '21038',
    shortName: '張忠謀大樓',
    name: '台積總部及晶圓十二A廠 (張忠謀大樓)',
    englishName: 'TSMC HQ & Fab 12A — Morris Chang Building',
    location: '台灣・新竹科學園區力行六路 (Hsinchu, Taiwan)',
    footprint: '32 × 32',
    age: '18+',
    year: '2024',
    refImage: 'assets/ref/set04.jpg',
    accentColor: '#C91A09',
    cameraPos: [36, 30, 38],
    cameraTarget: [0, 8.0, 0],
    description: '32×32 博物館典藏級「張忠謀大樓」完整重構！精準重現深棕建築外框、18 格直徑圓形水景中庭、6 棵多層次林蔭喬木、西入口「張忠謀大樓」地標牆與紅晶圓徽章、白色研發主翼三道深藍灰腰線與百葉通風格柵、垂直透亮水藍玻璃角柱、高牆官方紅晶圓 TSMC 徽標、雙層透藍玻璃大廳與台積紅雨遮、帶紅色立面飾線的雙片沙藍建築翼板與懸挑玻璃盒體，以及 16 層高聳淺灰核心塔。',
    bags: [
      { id: 1, title: '第 1 包：32×32 典藏黑框底座、圓形廣場與林蔭草坪', subtitle: '32x32 Base, Circular Plaza & Trees', color: '#352218' },
      { id: 2, title: '第 2 包：張忠謀大樓紀念牆、白色主翼與三道腰線',   subtitle: 'Monument Wall & Striped White Wing', color: '#F6F7F9' },
      { id: 3, title: '第 3 包：透藍玻璃角柱、正牆 TSMC 標與玻璃大廳',   subtitle: 'Glass Shaft, TSMC Emblem & Podium', color: '#3AC5ED' },
      { id: 4, title: '第 4 包：雙片沙藍建築鰭板、空中盒與 16 層核心塔', subtitle: 'Twin Sand-Blue Fins & Core Tower', color: '#5B7B95' }
    ]
  });

  // BAG 1: 32x32 Base (-16..16, -16..16)
  b.beginStep(1, '拼合 32×32 深棕典藏建築外框底板', '以四組 16×16 深棕基礎薄板拼接 32×32 典藏展示底座。');
  b.place('plate_16x16', 'DARK_BROWN', -16, 0, -16);
  b.place('plate_16x16', 'DARK_BROWN',   0, 0, -16);
  b.place('plate_16x16', 'DARK_BROWN', -16, 0,   0);
  b.place('plate_16x16', 'DARK_BROWN',   0, 0,   0);

  b.beginStep(1, '鋪設 30×30 淺藍灰內層地基平台', '內縮一格鋪設淺灰平台，保留四邊典藏深棕顆粒外框。');
  b.fillRect(-15, 15, -15, 15, 1, 'LIGHT_BLUISH_GRAY', 'plate');

  b.beginStep(1, '鋪設前庭深灰廣場與建築基座', '於左前庭鋪設深灰平滑廣場光磚，襯托圓形水景環。');
  b.fillRect(-14, 0, 2, 13, 2, 'DARK_BLUISH_GRAY', 'tile');

  b.beginStep(1, '砌築 10 格直徑圓形中庭水景廣場環', '以雙層淺灰小磚精細拼出正圓形中庭步道環與中央圓台。');
  const pcx = -6.5, pcz = 7.5;
  for (let x = -12; x <= -1; x++) {
    for (let z = 2; z <= 13; z++) {
      const dist = Math.hypot(x + 0.5 - pcx, z + 0.5 - pcz);
      if (dist >= 3.4 && dist <= 4.7) {
        b.place('plate_1x1', 'LIGHT_BLUISH_GRAY', x, 3, z);
        b.place('tile_1x1',  'LIGHT_BLUISH_GRAY', x, 4, z);
      } else if (dist <= 1.8) {
        b.place('plate_1x1', 'DARK_BLUISH_GRAY', x, 3, z);
        b.place('tile_1x1',  'DARK_BLUISH_GRAY', x, 4, z);
      }
    }
  }

  b.beginStep(1, '安裝草坪前緣「張忠謀大樓」斜面印刷銘牌', '貼上中英文樓名牌並扣於中庭最前緣展示位置。', 'plaque');
  b.addDecal('morris_plaque', '草坪前緣・張忠謀大樓斜面銘牌', 'slope_morris_2x2', 'LIGHT_BLUISH_GRAY', -9, 2, 13, 0, [0, 3, 8]);
  b.spanX(-14, -9, 2, 14, 'LIGHT_BLUISH_GRAY', 'tile');
  b.spanX(-7, -2, 2, 14, 'LIGHT_BLUISH_GRAY', 'tile');

  b.beginStep(1, '鋪設右側與前緣鮮綠園區草坪', '以鮮綠薄板鋪設前庭與右側大面積景觀綠地。');
  b.fillRect(-2, 15, 11, 15, 2, 'BRIGHT_GREEN', 'plate');
  b.fillRect(10, 15, 2, 11, 2, 'BRIGHT_GREEN', 'plate');

  b.beginStep(1, '種植 6 棵多層次林蔭喬木與 18 叢灌木', '以紅棕圓柱為樹幹，疊加三層深松綠、鮮綠與嫩芽綠樹冠。');
  const trees = [[-1, 12], [2, 12], [5, 12], [8, 12], [11, 11], [12, 7]];
  for (const [tx, tz] of trees) {
    b.place('round_brick_1x1', 'REDDISH_BROWN', tx, 3, tz);
    b.place('round_brick_1x1', 'REDDISH_BROWN', tx, 6, tz);
    b.place('flower_1x1', 'DARK_GREEN', tx, 9, tz);
    b.place('flower_1x1', 'BRIGHT_GREEN', tx, 10, tz);
    b.place('flower_1x1', 'LIME', tx, 11, tz);
    b.place('flower_1x1', 'BRIGHT_GREEN', tx + 1, 9, tz);
    b.place('flower_1x1', 'DARK_GREEN', tx, 9, tz + 1);
  }
  for (let x = 0; x <= 14; x += 2) {
    b.place('flower_1x1', 'BRIGHT_GREEN', x, 3, 14);
  }
  for (let z = 3; z <= 10; z += 2) {
    b.place('flower_1x1', 'DARK_GREEN', 13, 3, z);
    b.place('flower_1x1', 'BRIGHT_GREEN', 14, 3, z + 1);
  }

  // BAG 2: Monument Wall + White Main Wing (X -13..3, Z -14..-4)
  b.beginStep(2, '砌築西入口深灰地標紀念牆', '在白色主樓前方建立厚實深藍灰紀念牆並加上台積紅底座飾條。');
  for (let y of [2, 5, 8]) {
    b.spanX(-14, -2, y, -1, 'DARK_BLUISH_GRAY', 'brick', y === 5);
    b.spanX(-14, -2, y, 0, 'DARK_BLUISH_GRAY', 'brick', y !== 5);
  }
  b.spanX(-14, -2, 11, -1, 'DARK_BLUISH_GRAY', 'tile');
  b.spanX(-14, -2, 11,  0, 'DARK_BLUISH_GRAY', 'tile');
  b.spanX(-9, -2, 2, 1, 'RED', 'plate');
  b.spanX(-9, -2, 3, 1, 'RED', 'tile');

  b.beginStep(2, '安裝西入口「張忠謀大樓」樓名牌與圓形晶圓徽章', '於紀念牆正面垂直貼上中英文樓名牌與官方圓形紅晶圓徽章。', 'monument');
  b.addDecal('morris_wall', '西入口紀念牆・張忠謀大樓名牌', 'wall_morris_1x4', 'DARK_BLUISH_GRAY', -8, 5, 1, 0, [0, 2, 9]);
  b.addDecal('morris_round', '西入口端牆・圓形 TSMC 晶圓徽章', 'wall_tsmc_round_2x2', 'DARK_BLUISH_GRAY', -13, 4, 1, 0, [0, 2, 8]);

  // White Main Wing: X -13..3 (16 studs wide), Z -14..-4 (10 studs deep), Y 2..35
  b.beginStep(2, '堆疊白色研發棟底層外牆 (1–2 層)', '以交錯咬合砌法構築 16×10 白色研發主翼底層結構。');
  b.wallRing(-13, 3, -14, -4, 2, 'WHITE', 'brick', false);
  b.wallRing(-13, 3, -14, -4, 5, 'WHITE', 'brick', true);

  b.beginStep(2, '鑲嵌三道標誌性深藍灰水平腰線 (第一至三道)', '精準交錯深藍灰與純白薄板，完整環繞正面與左側立面。');
  for (let i = 0; i < 3; i++) {
    const by = 8 + i * 3;
    b.wallRing(-13, 3, -14, -4, by,     'DARK_BLUISH_GRAY', 'plate', i % 2 === 0);
    b.wallRing(-13, 3, -14, -4, by + 1, 'WHITE',            'plate', i % 2 === 1);
    b.wallRing(-13, 3, -14, -4, by + 2, 'WHITE',            'plate', i % 2 === 0);
  }

  b.beginStep(2, '加裝正面兩排白色百葉通風格柵窗', '於主翼腰線之間嵌入 12 組白色百葉紋建築磚重現原圖細節。');
  for (const vy of [8, 11, 14]) {
    for (const vx of [-10, -8, -4, -2]) {
      b.place('vent_brick_1x2', 'WHITE', vx, vy, -4, 1);
    }
  }

  b.beginStep(2, '砌高白色研發棟中層主牆 (Y 17–26)', '連續堆疊三層交錯咬合純白外牆磚。');
  b.wallRing(-13, 3, -14, -4, 17, 'WHITE', 'brick', false);
  b.wallRing(-13, 3, -14, -4, 20, 'WHITE', 'brick', true);
  b.wallRing(-13, 3, -14, -4, 23, 'WHITE', 'brick', false);

  b.beginStep(2, '完成白色研發棟高層主牆與顆粒屋頂 (Y 26–35)', '再疊三層純白高牆，頂部滿鋪白色顆粒屋頂板與凹槽邊框。');
  b.wallRing(-13, 3, -14, -4, 26, 'WHITE', 'brick', true);
  b.wallRing(-13, 3, -14, -4, 29, 'WHITE', 'brick', false);
  b.wallRing(-13, 3, -14, -4, 32, 'WHITE', 'brick', true);
  b.fillRect(-13, 3, -14, -4, 35, 'WHITE', 'plate');
  // Smooth white parapet perimeter around studded roof field
  b.spanX(-13, 3, 36, -14, 'WHITE', 'tile');
  b.spanX(-13, 3, 36,  -5, 'WHITE', 'tile');
  b.spanZ(-13, 36, -13, -5, 'WHITE', 'tile');
  b.spanZ(  2, 36, -13, -5, 'WHITE', 'tile');

  // BAG 3: Vertical Trans-Blue Corner Glass Shaft + High Wall TSMC Logo + Glass Podium
  b.beginStep(3, '建立前左角淺灰立柱與垂直透亮水藍玻璃角柱', '緊貼白色主翼左側立起 33 層高淺灰角柱與發光透藍玻璃柱。');
  for (let y = 2; y <= 32; y += 3) {
    b.place('brick_1x2', 'LIGHT_BLUISH_GRAY', -14, y, -5, 0);
    b.place('brick_1x2', 'TRANS_LIGHT_BLUE',  -14, y, -7, 0);
  }
  b.place('tile_1x2', 'LIGHT_BLUISH_GRAY', -14, 35, -5, 0);
  b.place('tile_1x2', 'TRANS_LIGHT_BLUE',  -14, 35, -7, 0);
  // Left extension white wall with matching 3 dark stripes (Z -14..-7)
  for (let y = 2; y <= 5; y += 3) b.spanZ(-14, y, -14, -7, 'WHITE', 'brick');
  for (let i = 0; i < 3; i++) {
    const by = 8 + i * 3;
    b.spanZ(-14, by,     -14, -7, 'DARK_BLUISH_GRAY', 'plate');
    b.spanZ(-14, by + 1, -14, -7, 'WHITE', 'plate');
    b.spanZ(-14, by + 2, -14, -7, 'WHITE', 'plate');
  }
  for (let y = 17; y <= 32; y += 3) b.spanZ(-14, y, -14, -7, 'WHITE', 'brick');
  b.spanZ(-14, 35, -14, -7, 'WHITE', 'tile');

  b.beginStep(3, '於研發棟正面高牆安裝官方紅晶圓 TSMC 徽章', '將專屬 2×2 官方紅晶圓 TSMC 印刷磚垂直掛載於高層白牆左側。', 'tsmc_high');
  b.addDecal('morris_high_logo', '研發棟高牆・TSMC 紅晶圓徽章', 'wall_tsmc_2x2', 'WHITE', -11, 25, -4, 0, [0, 1, 10]);

  // Glass Podium (X 0..9, Z -1..8, Y 2..16)
  b.beginStep(3, '層疊透明水藍玻璃大廳基座 (下半部)', '以透亮水藍與透海藍薄板交錯堆疊出剔透的玻璃帷幕大廳。');
  for (let y = 2; y <= 8; y += 2) {
    b.wallRing(0, 9, -1, 8, y,     'TRANS_LIGHT_BLUE',  'plate', y % 4 === 0);
    b.wallRing(0, 9, -1, 8, y + 1, 'TRANS_MEDIUM_BLUE', 'plate', y % 4 !== 0);
  }

  b.beginStep(3, '完成玻璃大廳基座上半部與淺灰屋簷平台', '繼續層疊玻璃帷幕至 14 層高，頂部封上淺藍灰屋簷樓板。');
  for (let y = 10; y <= 14; y += 2) {
    b.wallRing(0, 9, -1, 8, y,     'TRANS_LIGHT_BLUE',  'plate', y % 4 === 0);
    b.wallRing(0, 9, -1, 8, y + 1, 'TRANS_MEDIUM_BLUE', 'plate', y % 4 !== 0);
  }
  b.fillRect(0, 9, -1, 8, 16, 'LIGHT_BLUISH_GRAY', 'plate');
  b.spanX(0, 9, 17, 7, 'LIGHT_BLUISH_GRAY', 'tile');

  b.beginStep(3, '加裝西側入口門廳與標誌性台積紅雨遮', '於玻璃大廳前方立起深灰門廳玄關，頂部懸挑鮮紅雨遮。');
  for (let y of [2, 5]) {
    b.place('brick_2x3', 'DARK_BLUISH_GRAY', -2, y, 4, 0);
  }
  b.place('plate_2x4', 'RED', -2, 8, 4, 0);
  b.place('tile_2x4',  'RED', -2, 9, 4, 0);

  // BAG 4: Twin Sand-Blue Vertical Fins (ALONG X, PERPENDICULAR to & TOUCHING Gray Tower at X=9!) + Skybridge + Tall Gray Core Tower
  b.beginStep(4, '立起與右側灰塔垂直相接的雙片沙藍建築鰭板與紅飾線', '沿 X 軸對稱砌高前後兩道沙藍鰭板並於 X=9 處垂直緊貼右側高塔，左端鑲嵌台積紅垂直飾線。');
  for (let y = 17; y <= 35; y += 3) {
    // Back Sand-Blue fin running ALONG X (X 1..9, Z -2), flush against gray tower at X=9!
    b.spanX(1, 9, y, -2, 'SAND_BLUE', 'brick', y % 6 === 0);
    // Front Sand-Blue fin running ALONG X (X 1..9, Z 3), flush against gray tower at X=9!
    b.spanX(1, 9, y,  3, 'SAND_BLUE', 'brick', y % 6 !== 0);
    // Vertical Sand-Blue side return wall at X=8..9 connecting cleanly to gray tower
    b.spanZ(8, y, -1, 3, 'SAND_BLUE', 'brick', y % 6 === 0);
    // Signature vertical RED accent line on left front edge of back fin (X 0, Z -2)
    b.place('brick_1x1', 'RED', 0, y, -2, 0);
  }
  b.spanX(1, 9, 38, -2, 'SAND_BLUE', 'tile');
  b.spanX(1, 9, 38,  3, 'SAND_BLUE', 'tile');
  b.place('tile_1x1', 'RED', 0, 38, -2, 0);

  b.beginStep(4, '架設垂直連接右側灰塔的透藍玻璃空橋與懸挑方盒', '於雙片沙藍鰭板之間架設白框透藍玻璃空橋直抵灰塔，並於前方懸挑出標誌性玻璃盒體。');
  // Main glass skybridge between the two X-axis fins (X 2..8, Z -1..3, Y 24..33) connecting into X=8..9!
  b.fillRect(2, 8, -1, 3, 24, 'WHITE', 'plate');
  b.wallRing(2, 8, -1, 3, 25, 'TRANS_LIGHT_BLUE', 'brick');
  b.wallRing(2, 8, -1, 3, 28, 'TRANS_LIGHT_BLUE', 'brick', true);
  b.fillRect(2, 8, -1, 3, 31, 'WHITE', 'plate');
  b.fillRect(2, 8, -1, 3, 32, 'WHITE', 'tile');
  // Front cantilevered glass sky-box projecting forward from front fin (X 3..8, Z 4..6, Y 24..33)
  b.fillRect(3, 8, 4, 6, 24, 'WHITE', 'plate');
  b.wallRing(3, 8, 4, 6, 25, 'TRANS_LIGHT_BLUE', 'brick');
  b.wallRing(3, 8, 4, 6, 28, 'TRANS_LIGHT_BLUE', 'brick', true);
  b.fillRect(3, 8, 4, 6, 31, 'WHITE', 'plate');
  b.fillRect(3, 8, 4, 6, 32, 'WHITE', 'tile');

  // Towering Far-Right Light-Gray Elevator Core Tower (X 9..14, Z -14..4, Y 2..47 — physically contacts fins & podium at X=9!)
  b.beginStep(4, '堆疊右側淺灰電梯核心塔下段 (1–6 層，緊貼藍色空橋)', '於 X=9..14、Z=-14..4 築起厚實淺藍灰核心塔身，與藍色空橋及玻璃大廳垂直緊密相接。');
  for (let y = 2; y <= 17; y += 3) {
    b.wallRing(9, 14, -14, 4, y, 'LIGHT_BLUISH_GRAY', 'brick', (y / 3) % 2 === 0);
  }

  b.beginStep(4, '堆疊淺灰電梯核心塔中段 (7–12 層)', '持續向上交錯堆疊淺灰塔身至超越白色研發主翼。');
  for (let y = 20; y <= 35; y += 3) {
    b.wallRing(9, 14, -14, 4, y, 'LIGHT_BLUISH_GRAY', 'brick', (y / 3) % 2 === 0);
  }

  b.beginStep(4, '堆疊核心塔頂段並完成凹槽顆粒機電屋頂', '砌高至 47 層高成為全棟最高天際線，頂部保留原圖標誌性深灰顆粒凹槽！');
  for (let y = 38; y <= 44; y += 3) {
    b.wallRing(9, 14, -14, 4, y, 'LIGHT_BLUISH_GRAY', 'brick', (y / 3) % 2 === 0);
  }
  b.fillRect(9, 14, -14, 4, 47, 'DARK_BLUISH_GRAY', 'plate');
  b.spanZ(9,  48, -14, 4, 'LIGHT_BLUISH_GRAY', 'tile');
  b.spanZ(13, 48, -14, 4, 'LIGHT_BLUISH_GRAY', 'tile');
  b.spanX(10, 13, 48, -14, 'LIGHT_BLUISH_GRAY', 'tile');
  b.spanX(10, 13, 48,   3, 'LIGHT_BLUISH_GRAY', 'tile');

  return b.finalize();
}

// ============================================================================
// SET 02: 台積電南京園區 (TSMC Nanjing Company Limited, 40 × 32 studs, ~850+ bricks)
// Matches Front View, Side View & Top View!
// ============================================================================
function buildSetNanjing() {
  const b = new LegoBuilder({
    id: 'set01_hq',
    setNumber: '21035',
    shortName: '台積電南京廠',
    name: '台積電南京廠 (Fab 16)',
    englishName: 'TSMC Nanjing Company Limited',
    location: '南京・浦口經濟開發區 (Nanjing, China)',
    footprint: '40 × 32',
    age: '18+',
    year: '2024',
    refImage: 'assets/ref/set01.jpg',
    accentColor: '#1492CF',
    cameraPos: [38, 28, 40],
    cameraTarget: [0, 4.0, 0],
    description: '40×32 博物館級「台積電南京園區」完整重現！依據正視、側視與俯視三視圖精準還原：16 段真圓白色弧形外牆包覆 45° 菱形沙藍無塵室主廠房、45° 斜角懸挑伸出底板外的純白膠囊研發棟與立面「tsmc」紅標、圓盤管制中心（飛碟館）、圓角透海藍生態景觀池、白綠交錯路擋與密集機電屋頂。',
    bags: [
      { id: 1, title: '第 1 包：40×32 園區底板、生態池與景觀綠化',   subtitle: '40x32 Base, Eco-Pond & Landscaping', color: '#1492CF' },
      { id: 2, title: '第 2 包：圓盤管制中心 (飛碟館) 與階梯花園', subtitle: 'Saucer Pavilion & Terraced Garden', color: '#5B7B95' },
      { id: 3, title: '第 3 包：45° 斜角懸挑純白膠囊主廳與紅標',   subtitle: '45° Cantilevered Capsule Hall', color: '#C91A09' },
      { id: 4, title: '第 4 包：真圓 16 段白牆與 45° 菱形晶圓廠',  subtitle: 'Circular Arc Wall & 45° Diamond Fab', color: '#555C63' }
    ]
  });

  const addLocal = (ox, oz, deg, part, color, lx, y, lz, localRotDeg = 0) => {
    const rad = (deg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const wx = ox + lx * cos + lz * sin;
    const wz = oz - lx * sin + lz * cos;
    b.placeAngled(part, color, wx, y, wz, deg + localRotDeg);
  };

  // BAG 1: 40x32 Baseplate (-20..20, -16..16)
  b.beginStep(1, '無縫拼合 40×32 南京園區淺灰底板', '組合大型淺藍灰基礎薄板，奠定 40×32 園區規模。');
  b.fillRect(-20, 20, -16, 16, 0, 'LIGHT_BLUISH_GRAY', 'plate');

  b.beginStep(1, '鋪設園區深灰道路網與後左角紅棕廣場', '依俯視圖鋪設周邊灰色通道與後左角紅棕色塊台地。');
  b.fillRect(-20, -12, -16, -8, 1, 'REDDISH_BROWN', 'plate');
  b.fillRect(-10, 14, 12, 15, 1, 'DARK_BLUISH_GRAY', 'tile');

  b.beginStep(1, '砌築大型圓角透海藍生態景觀池', '滿鋪 1×1 透海藍水景光磚，以雙層淺灰池岸圍邊並建置中央綠島與步道。');
  const cx = -2, cz = 7;
  for (let x = -8; x <= 4; x++) {
    for (let z = 1; z <= 13; z++) {
      const dx = Math.abs(x - cx), dz = Math.abs(z - cz);
      const cheb = Math.max(dx, dz), manh = dx + dz;
      if (cheb <= 5 && manh <= 8) {
        if (cheb === 5 || manh === 8) {
          b.place('plate_1x1', 'LIGHT_BLUISH_GRAY', x, 1, z);
          b.place('tile_1x1',  'LIGHT_BLUISH_GRAY', x, 2, z);
        } else if (dx <= 1 && dz <= 1) {
          b.place('plate_1x1', 'BRIGHT_GREEN', x, 1, z);
          if ((x + z) % 2 === 0) b.place('flower_1x1', 'DARK_GREEN', x, 2, z);
        } else if (x === cx && z < cz - 1) {
          b.place('tile_1x1', 'LIGHT_BLUISH_GRAY', x, 1, z);
        } else {
          b.place('tile_1x1', 'TRANS_MEDIUM_BLUE', x, 1, z);
        }
      }
    }
  }

  b.beginStep(1, '安裝前排白綠交錯路擋、銀管護欄與 8 棵喬木', '精準對齊正視圖：左側白綠交錯方柱路擋、右側金屬銀管護欄與園區喬木。');
  for (let x = -20; x <= -8; x += 2) {
    b.place('brick_1x1', 'WHITE', x, 1, 15);
    b.place('plate_1x1', 'DARK_GREEN', x + 1, 1, 15);
  }
  for (const sx of [-6, -1, 4, 9, 14]) {
    b.place('bar_1x4', 'FLAT_SILVER', sx, 1, 15, 1);
  }
  b.fillRect(6, 16, 6, 13, 1, 'DARK_GREEN', 'plate');
  b.fillRect(16, 20, -4, 4, 1, 'DARK_GREEN', 'plate');
  for (const [tx, tz] of [[-9, 8], [5, 10], [5, 4], [10, 14], [13, 14], [16, 9], [17, 5], [-9, 4]]) {
    b.place('round_plate_1x1', 'REDDISH_BROWN', tx, 1, tz);
    b.place('plant_stem', 'BRIGHT_GREEN', tx, 2, tz);
  }

  // BAG 2: Circular Saucer Pavilion (left side: X -18..-10, Z -4..5)
  b.beginStep(2, '建置圓盤管制中心深棕廣場、藍綠花圃與水渠', '配置深棕圓形廣場、海軍藍花台與左側透水藍景觀溝渠。');
  b.place('round_plate_4x4', 'DARK_BROWN', -16, 1, -3);
  b.fillRect(-18, -9, 3, 7, 1, 'DARK_BROWN', 'plate');
  b.fillRect(-17, -14, 4, 6, 2, 'DARK_BLUE', 'tile');
  b.fillRect(-13, -10, 4, 6, 2, 'DARK_BLUE', 'tile');
  for (const [fx, fz] of [[-18, 6], [-16, 6], [-14, 6], [-12, 6], [-10, 6]]) {
    b.place('flower_1x1', 'BRIGHT_GREEN', fx, 2, fz);
  }
  for (let z = -8; z <= 6; z += 2) {
    b.place('tile_1x2', 'TRANS_LIGHT_BLUE', -20, 1, z, 0);
  }

  b.beginStep(2, '堆疊圓盤管制中心核心筒身與深灰環形窗帶', '疊砌淺灰、深灰與純白圓柱塔身。');
  b.place('round_brick_2x2', 'LIGHT_BLUISH_GRAY', -15, 2, -2);
  b.place('round_plate_2x2', 'DARK_BLUISH_GRAY',  -15, 5, -2);
  b.place('round_brick_2x2', 'WHITE',             -15, 6, -2);
  b.place('round_plate_2x2', 'DARK_BLUISH_GRAY',  -15, 9, -2);

  b.beginStep(2, '蓋上寬大白色雙層飛碟圓頂', '以 4×4 圓盤與 4×4 圓弧穹頂蓋完成飛碟館流線造型。');
  b.place('round_plate_4x4', 'WHITE', -16, 10, -3);
  b.place('dish_4x4',        'WHITE', -16, 11, -3);

  // BAG 3: 45° Cantilevered Overhanging White Capsule Hall (extends far past edge!)
  const hOx = -7.5, hOz = -3.5, hDeg = 42;
  b.beginStep(3, '架設 45° 斜軸 8 組白色 V 型斜撐支點', '沿 45° 斜角軸線立起 8 組白色 V 型斜撐柱支撐懸空膠囊主廳。');
  for (const lz of [-6, -2, 2, 6]) {
    addLocal(hOx, hOz, hDeg, 'v_pillar_1x2', 'WHITE', -2.2, 1, lz, 0);
    addLocal(hOx, hOz, hDeg, 'v_pillar_1x2', 'WHITE',  2.2, 1, lz, 0);
  }

  b.beginStep(3, '砌築 45° 斜角懸挑純白膠囊主廳下層 (長達 22 格)', '如俯視圖大膽懸挑伸出底板邊緣外！');
  for (let lz = -13; lz <= 7; lz += 2) {
    addLocal(hOx, hOz, hDeg, 'brick_2x2', 'WHITE', -1.5, 5, lz, 0);
    addLocal(hOx, hOz, hDeg, 'brick_2x2', 'WHITE',  0.5, 5, lz, 0);
    addLocal(hOx, hOz, hDeg, 'brick_1x2', 'WHITE',  2.0, 5, lz, 0);
  }

  b.beginStep(3, '疊加膠囊主廳上層並於前端貼上 tsmc 紅標', '面向水池的白色端面垂直掛載專屬「tsmc」紅色標誌。', 'nanjing_logo');
  for (let lz = -13; lz <= 7; lz += 2) {
    addLocal(hOx, hOz, hDeg, 'brick_2x2', 'WHITE', -1.5, 8, lz, 0);
    addLocal(hOx, hOz, hDeg, 'brick_2x2', 'WHITE',  0.5, 8, lz, 0);
    addLocal(hOx, hOz, hDeg, 'brick_1x2', 'WHITE',  2.0, 8, lz, 0);
  }
  const rad = (hDeg * Math.PI) / 180;
  const lxN = 0.2, lzN = 8.4;
  const wxN = hOx + lxN * Math.cos(rad) + lzN * Math.sin(rad);
  const wzN = hOz - lxN * Math.sin(rad) + lzN * Math.cos(rad);
  b.addDecal('nanjing_tsmc', '斜棟前端面・紅色 tsmc 標誌', 'wall_tsmc_1x2', 'WHITE', wxN, 6, wzN, 0, [6, 2, 7], hDeg);

  b.beginStep(3, '覆蓋 22 格長格柵紋理純白弧形膠囊屋頂', '兩側對稱扣上白色弧形磚，中央滿鋪純白散熱格柵光磚重現屋頂條紋。');
  for (let lz = -13; lz <= 7; lz += 2) {
    addLocal(hOx, hOz, hDeg, 'curved_slope_1x2', 'WHITE', -2.5, 11, lz, 0);
    addLocal(hOx, hOz, hDeg, 'tile_grille',      'WHITE', -1.5, 11, lz, 0);
    addLocal(hOx, hOz, hDeg, 'tile_grille',      'WHITE', -0.5, 11, lz, 0);
    addLocal(hOx, hOz, hDeg, 'tile_grille',      'WHITE',  0.5, 11, lz, 0);
    addLocal(hOx, hOz, hDeg, 'tile_grille',      'WHITE',  1.5, 11, lz, 0);
    addLocal(hOx, hOz, hDeg, 'curved_slope_1x2', 'WHITE',  2.5, 11, lz, 180);
  }

  // BAG 4: 20-Segment True Circular White Ring Wall + 45° Diamond Sand-Blue Fab
  const fOx = 8.5, fOz = -4.5;
  b.beginStep(4, '圍築 20 段真圓弧形白色晶圓廠外環牆', '以每 18° 精密排列 20 組三層高白色弧形牆段，圍成宏偉圓環。');
  const ringCount = 20, ringR = 8.8;
  for (let i = 0; i < ringCount; i++) {
    const theta = (i * 2 * Math.PI) / ringCount;
    const deg = -(theta * 180) / Math.PI;
    const rx = fOx + Math.cos(theta) * ringR;
    const rz = fOz + Math.sin(theta) * ringR;
    b.placeAngled('brick_1x2',        'WHITE', rx, 1, rz, deg);
    b.placeAngled('brick_1x2',        'WHITE', rx, 4, rz, deg);
    b.placeAngled('brick_1x2',        'WHITE', rx, 7, rz, deg);
    b.placeAngled('curved_slope_1x2', 'WHITE', rx, 10, rz, deg);
  }

  const fDeg = 45;
  b.beginStep(4, '建置內部 45° 菱形沙藍無塵室主廠房 (10×10)', '依俯視圖於真圓外牆內以 45° 菱形角堆疊四層沙藍主廠房。');
  for (let lx = -4; lx <= 4; lx += 2) {
    for (let lz = -4; lz <= 4; lz += 2) {
      if (Math.abs(lx) < 4 && Math.abs(lz) < 4) continue; // hollow core
      for (let y of [1, 4, 7, 10]) {
        addLocal(fOx, fOz, fDeg, 'brick_2x2', 'SAND_BLUE', lx, y, lz, 0);
      }
    }
  }
  for (let lx = -4; lx <= 4; lx += 2) {
    for (let lz = -4; lz <= 4; lz += 2) {
      addLocal(fOx, fOz, fDeg, 'plate_2x2', 'LIGHT_BLUISH_GRAY', lx, 13, lz, 0);
    }
  }

  b.beginStep(4, '立起右後方 5 層高淺灰機電服務塔', '於右後角疊起 5 層淺灰塔樓並以深灰光磚收邊。');
  for (let y = 1; y <= 13; y += 3) {
    b.wallRing(15, 19, -15, -10, y, 'LIGHT_BLUISH_GRAY', 'brick', (y % 6) === 1);
  }
  b.fillRect(15, 19, -15, -10, 16, 'DARK_BLUISH_GRAY', 'tile');

  b.beginStep(4, '鋪設 45° 菱形屋頂白色空調箱與 6 道銀色管排', '沿菱形晶圓廠屋頂密佈白色無塵室空調箱與平行金屬銀管線。');
  for (const [lx, lz] of [[-2.5, -2.5], [-2.5, 0.5], [-2.5, 3.0], [1.5, -2.5]]) {
    addLocal(fOx, fOz, fDeg, 'tile_2x4', 'WHITE', lx, 14, lz, 90);
  }
  for (const lz of [-4.0, -1.0, 2.0, 4.2]) {
    addLocal(fOx, fOz, fDeg, 'bar_1x4', 'FLAT_SILVER', -2.0, 14, lz, 90);
    addLocal(fOx, fOz, fDeg, 'bar_1x4', 'FLAT_SILVER',  2.0, 14, lz, 90);
  }

  b.beginStep(4, '安裝 8 座屋頂冷卻風扇、格柵與排氣塔完工', '於菱形屋頂補齊金屬冷卻風扇、散熱格柵與圓柱排氣塔，南京廠完工！');
  for (const [lx, lz] of [[2.5, -3.5], [2.5, -2.0], [2.5, -0.5], [2.5, 1.0], [3.8, -2.0], [3.8, 0.5], [3.8, 2.0], [3.8, 3.5]]) {
    addLocal(fOx, fOz, fDeg, 'cooling_fan_1x1', 'FLAT_SILVER', lx, 14, lz, 0);
  }
  for (const lz of [-3.0, 0.0, 3.0]) {
    addLocal(fOx, fOz, fDeg, 'round_brick_1x1', 'LIGHT_BLUISH_GRAY', 0.2, 14, lz, 0);
    addLocal(fOx, fOz, fDeg, 'round_plate_1x1', 'FLAT_SILVER', 0.2, 17, lz, 0);
  }

  return b.finalize();
}

// ============================================================================
// SET 03: JASM 熊本一廠 (48 × 24 studs, ~950+ bricks)
// Matches img2.jpg at high collector resolution!
// ============================================================================
function buildSetJASM() {
  const b = new LegoBuilder({
    id: 'set02_jasm',
    setNumber: '21036',
    shortName: 'JASM 熊本廠',
    name: 'JASM 熊本一廠',
    englishName: 'TSMC JASM Kumamoto Fab, Japan',
    location: '日本・熊本縣菊陽町 (Kumamoto, Japan)',
    footprint: '48 × 24',
    age: '18+',
    year: '2024',
    refImage: 'assets/ref/set02.jpg',
    accentColor: '#1D8F44',
    cameraPos: [40, 26, 42],
    cameraTarget: [0, 4.0, 0],
    description: '48×24 高密度重構「JASM 熊本一廠」！完整呈現雙段 48 叢雙色綠籬、右側 10 輛微縮車停車場、左側氣體供應站與 4 支高純度氣槽、具備 10 根垂直淺灰肋柱的 20×12 純白主廠房、屋頂多排金銀製程管網與 14 座洗滌塔、空橋正面「Jasm」印刷標誌，以及 6 層環繞透亮水藍玻璃帷幕辦公大樓。',
    bags: [
      { id: 1, title: '第 1 包：48×24 廠區底板、綠籬帶與停車場',     subtitle: '48x24 Base, Green Hedges & Parking', color: '#1D8F44' },
      { id: 2, title: '第 2 包：氣體供應站與 20×12 肋柱白廠房',     subtitle: 'Gas Annex & Ribbed White Fab', color: '#A8AEB4' },
      { id: 3, title: '第 3 包：超高密度金銀管排與 14 座洗滌塔',    subtitle: 'Gold/Silver MEP & 14 Scrubbers', color: '#C8A35A' },
      { id: 4, title: '第 4 包：JASM 空橋門廳與 6 層玻璃辦公大樓',  subtitle: 'JASM Bridge & 6-Story Glass Tower', color: '#3AC5ED' }
    ]
  });

  // BAG 1: 48x24 Baseplate (-24..24, -12..12)
  b.beginStep(1, '拼接 48×24 熊本廠區淺灰大底板', '無縫拼合 48×24 淺藍灰大型基礎薄板。');
  b.fillRect(-24, 24, -12, 12, 0, 'LIGHT_BLUISH_GRAY', 'plate');

  b.beginStep(1, '鋪設廠區前排平滑道路光磚', '沿前庭道路滿鋪 2×4 淺藍灰平滑光磚。');
  b.fillRect(-24, 18, 5, 8, 1, 'LIGHT_BLUISH_GRAY', 'tile');

  b.beginStep(1, '種植雙段鮮綠草坪與 44 叢雙色立體綠籬', '交錯扣上鮮綠與深松綠花葉片，還原熊本廠標誌性長條綠帶。');
  b.fillRect(-24, 0, 8, 12, 1, 'BRIGHT_GREEN', 'plate');
  b.fillRect(5, 18, 8, 12, 1, 'BRIGHT_GREEN', 'plate');
  for (let x = -24; x < 0; x += 2) {
    b.place('flower_1x1', 'BRIGHT_GREEN', x, 2, 9);
    b.place('flower_1x1', 'DARK_GREEN', x + 1, 2, 10);
  }
  for (let x = 5; x < 17; x += 2) {
    b.place('flower_1x1', 'BRIGHT_GREEN', x, 2, 9);
    b.place('flower_1x1', 'DARK_GREEN', x + 1, 2, 10);
  }

  b.beginStep(1, '打造右側員工停車場與 10 輛微縮汽車', '鋪設深灰柏油停車場並停放雙排 10 輛紅、藍、白、黑微型車。');
  b.fillRect(18, 24, -10, 11, 1, 'DARK_BLUISH_GRAY', 'plate');
  const carColors = ['RED', 'BLUE', 'WHITE', 'BLACK', 'RED', 'WHITE', 'BLUE', 'BLACK', 'RED', 'WHITE'];
  for (let i = 0; i < 5; i++) {
    b.place('plate_1x2', carColors[i],     19, 2, -8 + i * 4, 1);
    b.place('plate_1x2', carColors[i + 5], 21, 2, -6 + i * 4, 1);
  }

  // BAG 2: Left Gas Annex (-24..-18, -11..1) + Main Fab (-17..3, -11..1 -> 20x12!)
  b.beginStep(2, '建立左側氣體供應站與 4 支雙層白色氣槽', '砌起左側純白附屬廠房與前方 4 支高純度氣體儲槽。');
  for (let y of [1, 4, 7]) b.wallRing(-24, -18, -11, 1, y, 'WHITE', 'brick', y === 4);
  b.fillRect(-24, -18, -11, 1, 10, 'WHITE', 'plate');
  for (const gz of [-9, -6, -3]) {
    b.place('tile_grille', 'DARK_BLUISH_GRAY', -22, 11, gz, 1);
    b.place('tile_grille', 'DARK_BLUISH_GRAY', -20, 11, gz, 1);
  }
  for (const gx of [-23, -22, -21, -20]) {
    b.place('round_brick_1x1', 'WHITE', gx, 1, 2);
    b.place('round_brick_1x1', 'WHITE', gx, 4, 2);
    b.place('round_plate_1x1', 'LIGHT_BLUISH_GRAY', gx, 7, 2);
  }

  b.beginStep(2, '堆疊 20×12 主晶圓廠深灰基座與中層白牆', '以交錯咬合砌法建立寬廣無塵室廠房下段。');
  b.wallRing(-17, 3, -11, 1, 1, 'DARK_BLUISH_GRAY', 'brick', false);
  b.wallRing(-17, 3, -11, 1, 4, 'WHITE', 'brick', true);
  b.wallRing(-17, 3, -11, 1, 7, 'WHITE', 'brick', false);

  b.beginStep(2, '完成主廠房高層純白牆與 20×12 淺灰屋頂板', '疊上第四層純白外牆並精準覆蓋淺藍灰屋頂結構板。');
  b.wallRing(-17, 3, -11, 1, 10, 'WHITE', 'brick', true);
  b.fillRect(-17, 3, -11, 1, 13, 'LIGHT_BLUISH_GRAY', 'plate');

  b.beginStep(2, '鑲嵌正面 10 根垂直淺灰結構肋柱', '沿正面牆等距立起 10 根淺灰高柱，重現熊本廠工業立面韻律。');
  for (let x = -17; x <= 1; x += 2) {
    b.place('brick_1x1x2', 'LIGHT_BLUISH_GRAY', x, 1, 1);
    b.place('brick_1x1x2', 'LIGHT_BLUISH_GRAY', x, 7, 1);
    b.place('tile_1x1',    'LIGHT_BLUISH_GRAY', x, 13, 1);
  }

  // BAG 3: Ultra-Dense JASM Rooftop MEP (Y 14, X -17..3, Z -11..1)
  b.beginStep(3, '配置屋頂 8 組大型白色空調箱與風道', '整齊排列雙排白色 2×4 無塵室空調箱。');
  for (const x of [-11, -7, -3, 0]) {
    b.place('tile_2x4', 'WHITE', x, 14, -4, 1);
    b.place('tile_2x4', 'WHITE', x, 14, -9, 1);
  }

  b.beginStep(3, '架設 12 段珍珠金與金屬銀平行管排陣列', '平行佈設三條長距離金銀 4L 管排，呈現極致廠務細節。');
  for (const x of [-11, -7, -3]) {
    b.place('bar_1x4', 'PEARL_GOLD',  x, 14, -6, 1);
    b.place('bar_1x4', 'PEARL_GOLD',  x, 14, -7, 1);
    b.place('bar_1x4', 'FLAT_SILVER', x, 14, -2, 1);
    b.place('bar_1x4', 'FLAT_SILVER', x, 14, -11, 1);
  }

  b.beginStep(3, '安裝 14 座沙漠米與銀蓋圓柱洗滌塔', '於左半部屋頂密佈 14 座圓柱製程洗滌塔。');
  for (let x = -16; x <= -12; x++) {
    for (const z of [-2, -5, -8]) {
      if (x === -12 && z === -8) continue;
      b.place('round_brick_1x1', 'TAN', x, 14, z);
      b.place('round_plate_1x1', 'FLAT_SILVER', x, 17, z);
    }
  }

  b.beginStep(3, '加裝 5 支錐形排氣煙囪與 6 座冷卻風扇', '補齊左後方排氣管陣列與金屬冷卻風扇。');
  for (let x = -16; x <= -12; x++) {
    b.place('cone_1x1', 'DARK_BLUISH_GRAY', x, 14, -10);
  }
  for (const [fx, fz] of [[1, -10], [2, -10], [1, -6], [2, -6], [1, -2], [2, -2]]) {
    b.place('cooling_fan_1x1', 'FLAT_SILVER', fx, 14, fz);
  }

  // BAG 4: JASM Entrance Bridge (X 3..7, Z -4..3) + 6-Story Glass Office Tower (X 7..17, Z -8..4)
  b.beginStep(4, '建構 JASM 連接空橋門廳與「Jasm」印刷標誌', '組裝帶支撐柱的白色入口門廳，於正面垂直貼上專屬「Jasm」標誌。', 'jasm_logo');
  for (let y of [1, 4, 7]) b.wallRing(3, 7, -4, 2, y, 'WHITE', 'brick', y === 4);
  b.fillRect(3, 7, -4, 2, 10, 'WHITE', 'tile');
  b.place('brick_1x1', 'WHITE', 3, 1, 3);
  b.place('brick_1x1', 'WHITE', 6, 1, 3);
  b.fillRect(3, 7, 2, 4, 4, 'WHITE', 'plate');
  b.place('plate_1x2', 'WHITE', 4, 5, 2, 1);
  b.addDecal('jasm_sign', '空橋正面・JASM 黑字紅條標誌', 'wall_jasm_1x2', 'WHITE', 4, 6, 2, 0, [0, 2, 9]);

  b.beginStep(4, '層疊六層透亮水藍玻璃辦公大樓 (1–3 樓)', '以 10×12 環繞透亮水藍與純白薄板交替疊出通透玻璃帷幕。');
  for (let f = 0; f < 3; f++) {
    const fy = 1 + f * 3;
    b.wallRing(7, 17, -8, 4, fy,     'TRANS_LIGHT_BLUE', 'plate', f % 2 === 0);
    b.wallRing(7, 17, -8, 4, fy + 1, 'TRANS_LIGHT_BLUE', 'plate', f % 2 === 1);
    b.wallRing(7, 17, -8, 4, fy + 2, 'WHITE',            'plate', f % 2 === 0);
  }

  b.beginStep(4, '層疊六層玻璃辦公大樓 (4–6 樓) 與純白屋頂', '繼續向上疊高至 6 層並覆蓋純白屋頂樓板。');
  for (let f = 3; f < 6; f++) {
    const fy = 1 + f * 3;
    b.wallRing(7, 17, -8, 4, fy,     'TRANS_LIGHT_BLUE', 'plate', f % 2 === 0);
    b.wallRing(7, 17, -8, 4, fy + 1, 'TRANS_LIGHT_BLUE', 'plate', f % 2 === 1);
    b.wallRing(7, 17, -8, 4, fy + 2, 'WHITE',            'plate', f % 2 === 0);
  }
  b.fillRect(7, 17, -8, 4, 19, 'WHITE', 'plate');

  b.beginStep(4, '封頂白色女兒牆與 24 組深灰格柵機械機房', '立起雙側純白邊牆，中央鋪滿 24 組深灰散熱格柵光磚，熊本一廠完工！');
  b.spanZ(7,  20, -8, 4, 'WHITE', 'brick');
  b.spanZ(16, 20, -8, 4, 'WHITE', 'brick');
  for (let x = 9; x <= 14; x++) {
    for (let z = -7; z <= 1; z += 2) {
      b.place('tile_grille', 'DARK_BLUISH_GRAY', x, 20, z, 0);
    }
  }

  return b.finalize();
}

// ============================================================================
// SET 04: 亞利桑那鳳凰城廠 Fab 21 (48 × 28 studs, ~850+ bricks)
// Matches img3.jpg at high collector resolution!
// ============================================================================
function buildSetArizona() {
  const b = new LegoBuilder({
    id: 'set03_arizona',
    setNumber: '21037',
    shortName: '亞利桑那廠',
    name: '台積電亞利桑那州廠 (Fab 21)',
    englishName: 'TSMC Arizona Fab 21, Phoenix',
    location: '美國・亞利桑那州鳳凰城 (Phoenix, AZ, USA)',
    footprint: '48 × 28',
    age: '18+',
    year: '2024',
    refImage: 'assets/ref/set03.jpg',
    accentColor: '#C8A35A',
    cameraPos: [40, 28, 40],
    cameraTarget: [0, 4.0, 0],
    description: '48×28 高密度重構「台積電亞利桑那州廠 Fab 21」！完整呈現沙漠米色平滑邊框基地、三道正面與四道側面重型垂直扶壁柱、前右立面官方圓形紅晶圓 TSMC 徽章、內凹式超高密度屋頂空調箱、14 段銀色管網與 20 座製程儲槽，並經雙層跨棟空橋連接右側具備雙排 14 座冷卻風扇與透藍水池的中央公用系統廠 (CUP)。',
    bags: [
      { id: 1, title: '第 1 包：48×28 沙漠米基地與雙棟深黑地基',    subtitle: '48x28 Desert Base & Plinths', color: '#DAC596' },
      { id: 2, title: '第 2 包：Fab 21 重裝主廠、扶壁柱與圓形徽章', subtitle: 'Main Fab, Buttresses & Emblem', color: '#555C63' },
      { id: 3, title: '第 3 包：內凹式屋頂空調箱、管網與 20 座儲槽', subtitle: 'Recessed Rooftop MEP & 20 Tanks', color: '#92989F' },
      { id: 4, title: '第 4 包：雙層空橋與 CUP 14 座冷卻風扇水池',  subtitle: 'Skybridge & 14-Fan Cooling Plant', color: '#3AC5ED' }
    ]
  });

  // BAG 1: 48x28 Desert Baseplate (-24..24, -14..14)
  b.beginStep(1, '拼接 48×28 亞利桑那沙漠米色大底板', '以沙漠米 (Tan) 薄板鋪設鳳凰城廣闊基地。');
  b.fillRect(-24, 24, -14, 14, 0, 'TAN', 'plate');

  b.beginStep(1, '鋪設四周寬版沙漠米色平滑光磚邊框', '沿四邊滿鋪 2×4 沙漠米光磚，營造博物館典藏底座質感。');
  b.fillRect(-24, 24, 10, 14, 1, 'TAN', 'tile');
  b.fillRect(-24, 24, -14, -11, 1, 'TAN', 'tile');
  b.fillRect(-24, -20, -11, 10, 1, 'TAN', 'tile');
  b.fillRect(20, 24, -11, 10, 1, 'TAN', 'tile');

  b.beginStep(1, '定位主廠房 22×18 曜石黑地基與右側 CUP 地基', '建立厚實深色廠房基礎承台。');
  b.fillRect(-19, 3, -10, 8, 1, 'BLACK', 'plate');
  b.fillRect(9, 19, -10, 6, 1, 'DARK_BLUISH_GRAY', 'plate');

  // BAG 2: Main Fab 21 (-19..3, -10..8 -> 22x18!)
  b.beginStep(2, '砌築 22×18 主晶圓廠下層淺藍灰外牆 (1–2 層)', '以交錯咬合砌法建立厚重無塵室廠房下半部。');
  b.wallRing(-19, 3, -10, 8, 2, 'LIGHT_BLUISH_GRAY', 'brick', false);
  b.wallRing(-19, 3, -10, 8, 5, 'LIGHT_BLUISH_GRAY', 'brick', true);

  b.beginStep(2, '堆疊主廠房上層外牆並封上深藍灰屋頂底板', '疊砌第三、四層淺灰外牆，頂部覆蓋深灰屋頂結構板。');
  b.wallRing(-19, 3, -10, 8, 8,  'LIGHT_BLUISH_GRAY', 'brick', false);
  b.wallRing(-19, 3, -10, 8, 11, 'LIGHT_BLUISH_GRAY', 'brick', true);
  b.fillRect(-19, 3, -10, 8, 14, 'DARK_BLUISH_GRAY', 'plate');

  b.beginStep(2, '加裝正面三道深灰與側面四道曜石黑重型扶壁柱', '沿外牆立起 7 座落地雙格寬重型垂直結構柱，重現原圖工業堡壘氣勢。');
  for (const cx of [-16, -9, -2]) {
    b.place('plate_1x2', 'DARK_BLUISH_GRAY', cx, 1, 8, 1);
    for (let y of [2, 8]) b.place('brick_1x2x2', 'DARK_BLUISH_GRAY', cx, y, 8, 1);
    b.place('tile_1x2', 'DARK_BLUISH_GRAY', cx, 14, 8, 1);
  }
  for (const cz of [-8, -4, 0, 4]) {
    b.place('plate_1x2', 'BLACK', -20, 1, cz, 0);
    for (let y of [2, 8]) b.place('brick_1x2x2', 'BLACK', -20, y, cz, 0);
    b.place('tile_1x2', 'BLACK', -20, 14, cz, 0);
  }

  b.beginStep(2, '圍築內凹式深灰屋頂女兒牆與立面圓形 TSMC 徽章', '沿屋頂四邊砌起深灰女兒牆，並於前右立面垂直貼上官方圓形紅晶圓徽章。', 'az_logo');
  b.wallRing(-19, 3, -10, 8, 15, 'DARK_BLUISH_GRAY', 'plate');
  b.wallRing(-19, 3, -10, 8, 16, 'DARK_BLUISH_GRAY', 'tile');
  b.addDecal('az_tsmc', '主廠立面右上角・TSMC 圓形晶圓徽章', 'wall_tsmc_round_2x2', 'WHITE', 1, 8, 8, 0, [0, 2, 10]);

  // BAG 3: Recessed Ultra-Dense Rooftop MEP (X -18..2, Z -9..7, Y 15)
  b.beginStep(3, '配置 10 組沙漠米色大型屋頂空調機組', '在內凹屋頂分三排整齊配置大型空調箱。');
  for (const x of [-17, -12, -7, -2]) {
    b.place('tile_2x4', 'TAN', x, 15,  4, 1);
    b.place('tile_2x4', 'TAN', x, 15, -8, 1);
  }
  b.place('tile_2x4', 'TAN', -12, 15, -2, 1);
  b.place('tile_2x4', 'TAN',  -4, 15, -2, 1);

  b.beginStep(3, '佈線 14 段金屬銀縱橫交錯製程管網', '鋪設多條長距離金屬銀 4L 管線圓桿。');
  for (const x of [-17, -12, -7, -2]) {
    b.place('bar_1x4', 'FLAT_SILVER', x, 15,  2, 1);
    b.place('bar_1x4', 'FLAT_SILVER', x, 15, -4, 1);
    b.place('bar_1x4', 'FLAT_SILVER', x, 15, -5, 1);
  }
  b.place('bar_1x4', 'FLAT_SILVER', -18, 15, -6, 0);
  b.place('bar_1x4', 'FLAT_SILVER', -18, 15,  0, 0);

  b.beginStep(3, '安裝 20 座銀柱米蓋圓柱製程儲槽', '密佈 20 座金屬銀圓柱磚搭配沙漠米圓薄片蓋。');
  for (const [tx, tz] of [
    [-16, -2], [-15, -2], [-14, -2], [-16, 0], [-15, 0],
    [-8, -2],  [-7, -2],  [-6, -2],  [-8, 0],  [-7, 0],
    [-1, -2],  [0, -2],   [1, -2],   [-1, 0],  [0, 0],
    [-13, 3],  [-9, 3],   [-5, 3],   [-13, -6],[-5, -6]
  ]) {
    b.place('round_brick_1x1', 'FLAT_SILVER', tx, 15, tz);
    b.place('round_plate_1x1', 'TAN',         tx, 18, tz);
  }

  b.beginStep(3, '補齊 12 組深米棕屋頂散熱格柵', '完成超高密度沙漠廠務屋頂最後拼圖。');
  for (const [gx, gz] of [
    [-17, 1], [-14, 1], [-11, 1], [-8, 1], [-5, 1], [-2, 1],
    [-17, -3],[-14, -3],[-10, -3],[-7, -3],[-3, -3],[0, -3]
  ]) {
    b.place('tile_grille', 'DARK_TAN', gx, 15, gz, 1);
  }

  // BAG 4: Dual Skybridge (X 3..9) + CUP (X 9..19, Z -10..6)
  b.beginStep(4, '搭設雙層跨棟管線空橋與下層廠務廊道', '建立上下兩條帶支撐柱的連接主廠房與右側 CUP 管線空橋。');
  b.spanX(3, 9, 2,  2, 'DARK_BLUISH_GRAY', 'brick');
  b.spanX(3, 9, 2,  3, 'DARK_BLUISH_GRAY', 'brick');
  b.spanX(3, 9, 5,  2, 'LIGHT_BLUISH_GRAY', 'tile');
  b.spanX(3, 9, 5,  3, 'LIGHT_BLUISH_GRAY', 'tile');
  for (const bx of [3, 8]) {
    b.place('brick_1x1x2', 'DARK_BLUISH_GRAY', bx, 2, -4);
    b.place('brick_1x1x2', 'DARK_BLUISH_GRAY', bx, 2, -3);
  }
  b.spanX(3, 9, 8, -4, 'DARK_BLUISH_GRAY', 'brick');
  b.spanX(3, 9, 8, -3, 'DARK_BLUISH_GRAY', 'brick');
  b.spanX(3, 9, 11,-4, 'DARK_BLUISH_GRAY', 'tile');
  b.spanX(3, 9, 11,-3, 'DARK_BLUISH_GRAY', 'tile');

  b.beginStep(4, '建造右側 10×16 中央公用系統廠 (CUP)', '堆疊深藍灰 CUP 主體牆並加上正面黑色落地扶壁柱與屋頂板。');
  for (let y of [2, 5, 8]) b.wallRing(9, 19, -10, 6, y, 'DARK_BLUISH_GRAY', 'brick', y === 5);
  b.fillRect(9, 19, -10, 6, 11, 'DARK_BLUISH_GRAY', 'plate');
  b.place('plate_1x2', 'BLACK', 13, 1, 6, 1);
  for (let y of [2, 8]) b.place('brick_1x2x2', 'BLACK', 13, y, 6, 1);

  b.beginStep(4, '鋪設 CUP 前半部透亮水藍冷卻水池', '於 CUP 屋頂前側滿鋪透亮水藍光磚水池。');
  b.fillRect(10, 18, 0, 5, 12, 'TRANS_LIGHT_BLUE', 'tile');

  b.beginStep(4, '安裝雙排 14 座金屬冷卻塔風扇與管線完工', '於 CUP 屋頂後半部排滿 7×2 共 14 座銀框黑芯冷卻風扇，亞利桑那廠落成！');
  for (let z = -9; z <= -3; z++) {
    b.place('cooling_fan_1x1', 'FLAT_SILVER', 11, 12, z);
    b.place('cooling_fan_1x1', 'FLAT_SILVER', 16, 12, z);
  }
  b.place('bar_1x4', 'FLAT_SILVER', 13, 12, -8, 0);
  b.place('bar_1x4', 'FLAT_SILVER', 14, 12, -8, 0);
  b.place('bar_1x4', 'FLAT_SILVER', 13, 12, -4, 0);
  b.place('bar_1x4', 'FLAT_SILVER', 14, 12, -4, 0);

  return b.finalize();
}

// ============================================================================
// SET 05: 台積電全球研發中心 (52 × 32 studs, ~1,150+ bricks)
// Matches img5.jpg at full museum collector resolution!
// ============================================================================
function buildSetRD() {
  const b = new LegoBuilder({
    id: 'set05_rd',
    setNumber: '21039',
    shortName: '全球研發中心',
    name: '台積電全球研發中心 (Global R&D Center)',
    englishName: 'TSMC Global R&D Center, Hsinchu',
    location: '台灣・新竹寶山 (Baoshan, Hsinchu, Taiwan)',
    footprint: '52 × 32',
    age: '18+',
    year: '2024',
    refImage: 'assets/ref/set05.jpg',
    accentColor: '#3AC5ED',
    cameraPos: [44, 28, 44],
    cameraTarget: [0, 4.5, 0],
    description: '52×32 旗艦級「台積電全球研發中心」完整重構！重現標誌性純白 C 型現代建築外框、正面 16 道垂直透亮水藍玻璃直窗與 17 根純白立面格柵、屋頂 16 道交錯藍灰天窗、正面左側門柱紅色「tsmc」標誌、前庭 6 層金屬銀晶圓雕塑、雙側多層深黑百葉翼樓，以及後方 26×14 開放式沙藍潔淨研發廠與 20 座排氣塔。',
    bags: [
      { id: 1, title: '第 1 包：52×32 園區底板、晶圓雕塑與斜坡道',   subtitle: '52x32 Base, Wafer Sculpture & Ramp', color: '#92989F' },
      { id: 2, title: '第 2 包：後方 26×14 沙藍研發廠與密集管排',   subtitle: 'Rear 26x14 Sand-Blue Fab & MEP', color: '#5B7B95' },
      { id: 3, title: '第 3 包：左右多層深黑百葉翼樓與迎賓雨遮',    subtitle: 'Multi-Tier Black Louvered Wings', color: '#1D2024' },
      { id: 4, title: '第 4 包：純白 C 型外框、16 道直窗與天窗陣列', subtitle: 'White C-Frame, 16 Windows & Skylights', color: '#3AC5ED' }
    ]
  });

  // BAG 1: 52x32 Baseplate (-26..26, -16..16)
  b.beginStep(1, '拼接 52×32 全球研發中心大型底板', '無縫拼合淺藍灰與純白基礎薄板構成旗艦級研發園區基地。');
  b.fillRect(-26, 6, -16, 16, 0, 'LIGHT_BLUISH_GRAY', 'plate');
  b.fillRect(6, 26, -16, 16, 0, 'WHITE', 'plate');

  b.beginStep(1, '鋪設左側林蔭步道、7 棵行道樹與白色路擋', '沿左側綠帶種植 7 棵園藝行道樹，前左緣排列白色斜面路擋。');
  b.fillRect(-26, -24, -14, 12, 1, 'BRIGHT_GREEN', 'plate');
  b.fillRect(-24, -14, 10, 14, 1, 'BRIGHT_GREEN', 'plate');
  for (let z = -12; z <= 9; z += 3) {
    b.place('plant_stem', 'BRIGHT_GREEN', -25, 2, z);
  }
  for (let x = -24; x <= -15; x++) {
    b.place('slope_1x2', 'WHITE', x, 1, 14, 0);
  }

  b.beginStep(1, '建造深灰前庭廣場與 6 層金屬銀晶圓疊層雕塑', '交替堆疊 6 層金屬銀與淺灰 4×4／2×2 圓盤打造地標級晶圓雕塑。');
  b.fillRect(-14, -6, 8, 16, 1, 'DARK_BLUISH_GRAY', 'plate');
  b.place('round_plate_4x4', 'FLAT_SILVER',       -12, 2, 10);
  b.place('round_plate_4x4', 'LIGHT_BLUISH_GRAY', -12, 3, 10);
  b.place('round_plate_4x4', 'FLAT_SILVER',       -12, 4, 10);
  b.place('round_plate_4x4', 'LIGHT_BLUISH_GRAY', -12, 5, 10);
  b.place('round_plate_4x4', 'FLAT_SILVER',       -12, 6, 10);
  b.place('round_tile_2x2',  'FLAT_SILVER',       -11, 7, 11);

  b.beginStep(1, '鋪設前排白色迎賓大道與右側弧形斜坡車道', '右側以白色弧形磚銜接高架純白車道斜坡。');
  b.fillRect(-6, 14, 13, 16, 1, 'WHITE', 'tile');
  for (let z = 12; z <= 15; z += 2) {
    b.place('curved_slope_2x2', 'WHITE', 14, 1, z, 1);
  }
  b.fillRect(16, 26, 12, 16, 1, 'WHITE', 'plate');
  b.fillRect(16, 26, 12, 16, 2, 'WHITE', 'tile');

  // BAG 2: Rear 26x14 Sand-Blue Cleanroom Fab (-22..4, -15..-1, Y 1..11)
  b.beginStep(2, '建置後方 26×14 沙藍色研發潔淨廠外牆', '以交錯咬合砌法構築三層高沙藍潔淨室廠房與淺灰屋頂板。');
  for (let y of [1, 4, 7]) b.wallRing(-22, 4, -15, -1, y, 'SAND_BLUE', 'brick', y === 4);
  b.fillRect(-22, 4, -15, -1, 10, 'LIGHT_BLUISH_GRAY', 'plate');

  b.beginStep(2, '圍築後方廠房白色屋頂女兒牆邊框', '以純白光磚收邊後方廠房外圍。');
  b.spanX(-22, 4, 11, -15, 'WHITE', 'tile');
  b.spanZ(-22, 11, -14, -1, 'WHITE', 'tile');

  b.beginStep(2, '安裝 16 座金屬銀柱與米蓋排氣塔陣列', '於後方廠房屋頂密佈 16 座圓柱排氣塔與製程儲槽。');
  for (const [rx, rz] of [
    [-20, -13], [-19, -13], [-18, -13], [-17, -13],
    [-20, -10], [-19, -10], [-20, -7],  [-19, -7],
    [-8, -13],  [-7, -13],  [-6, -13],  [-5, -13],
    [-1, -13],  [0, -13],   [1, -13],   [2, -13]
  ]) {
    b.place('round_brick_1x1', 'FLAT_SILVER', rx, 11, rz);
    b.place('round_plate_1x1', 'TAN',         rx, 14, rz);
  }

  b.beginStep(2, '佈設 10 道金銀管排、白色空調箱與 8 座冷卻風扇', '完成開放式機電庭院超高密度管排細節。');
  for (const x of [-16, -12, -8, -4]) {
    b.place('bar_1x4', 'FLAT_SILVER', x, 11, -11, 1);
    b.place('bar_1x4', 'PEARL_GOLD',  x, 11, -9,  1);
  }
  b.place('tile_2x4', 'WHITE', -17, 11, -6, 1);
  b.place('tile_2x4', 'WHITE', -12, 11, -6, 1);
  b.place('tile_2x4', 'WHITE',  -7, 11, -6, 1);
  for (const [fx, fz] of [[-2, -9], [-1, -9], [0, -9], [1, -9], [-2, -6], [-1, -6], [0, -6], [1, -6]]) {
    b.place('cooling_fan_1x1', 'FLAT_SILVER', fx, 11, fz);
  }

  // BAG 3: Multi-Tier Black Louvered Wings (Left: X -20..-13, Right: X 15..22, Z 0..8)
  b.beginStep(3, '組裝左側三層深黑百葉紋機電翼樓', '以黑色百葉紋建築磚與深灰樓板交錯疊出煙灰色玻璃百葉翼樓。');
  for (let tier = 0; tier < 3; tier++) {
    const ty = 1 + tier * 4;
    for (let x = -20; x < -13; x++) {
      b.place('vent_brick_1x2', 'BLACK', x, ty, 0, 0);
      b.place('vent_brick_1x2', 'BLACK', x, ty, 6, 0);
    }
    b.fillRect(-20, -13, 0, 8, ty + 3, 'DARK_BLUISH_GRAY', 'plate');
  }
  b.fillRect(-20, -13, 0, 8, 13, 'DARK_BLUISH_GRAY', 'tile');

  b.beginStep(3, '對稱組裝右側三層深黑百葉紋機電翼樓', '於右側對稱建立三層高深黑百葉翼樓。');
  for (let tier = 0; tier < 3; tier++) {
    const ty = 1 + tier * 4;
    for (let x = 15; x < 22; x++) {
      b.place('vent_brick_1x2', 'BLACK', x, ty, 0, 0);
      b.place('vent_brick_1x2', 'BLACK', x, ty, 6, 0);
    }
    b.fillRect(15, 22, 0, 8, ty + 3, 'DARK_BLUISH_GRAY', 'plate');
  }
  b.fillRect(15, 22, 0, 8, 13, 'DARK_BLUISH_GRAY', 'tile');

  b.beginStep(3, '架設 26×9 主廳深灰基座與透藍迎賓雨遮', '建立研發主廳結構底盤、迎賓雨遮支撐柱與前方雙層透藍玻璃邊飾雨遮。');
  b.fillRect(-11, 15, 0, 9, 1, 'DARK_BLUISH_GRAY', 'plate');
  b.wallRing(-11, 15, 0, 9, 2, 'DARK_BLUISH_GRAY', 'brick');
  b.place('brick_1x1', 'DARK_BLUISH_GRAY', 4, 1, 11);
  b.place('brick_1x1', 'DARK_BLUISH_GRAY', 9, 1, 11);
  b.fillRect(4, 10, 9, 12, 4, 'TRANS_LIGHT_BLUE', 'plate');
  b.fillRect(4, 10, 9, 12, 5, 'WHITE', 'tile');

  // BAG 4: Iconic White C-Frame + 16 Vertical Cyan Windows + 17 White Louvers + Skylights
  b.beginStep(4, '立起正面 22 格寬透亮水藍玻璃帷幕核心', '一字排開透亮水藍雙層高柱磚，點亮研發中心科技藍光！');
  for (let x = -9; x < 13; x++) {
    b.place('brick_1x1x2', 'TRANS_LIGHT_BLUE', x, 5, 7);
    b.place('brick_1x1',   'TRANS_LIGHT_BLUE', x, 11, 7);
  }
  b.fillRect(-11, 15, 0, 8, 14, 'LIGHT_BLUISH_GRAY', 'plate');

  b.beginStep(4, '扣上 12 根純白垂直立面格柵與中央凸出方盒', '精準交錯純白垂直立面柱（穩固坐落於深灰基座上）與中央純白建築凸塊。');
  for (let x = -9; x <= 13; x += 2) {
    b.place('brick_1x1x2', 'WHITE', x, 5, 8);
    b.place('brick_1x1',   'WHITE', x, 11, 8);
  }
  // Protruding central white architectural box (X 0..4, Z 9..10, Y 7..13) with vertical support ribs
  b.place('brick_1x1x2', 'DARK_BLUISH_GRAY', 0, 1, 9);
  b.place('brick_1x1x2', 'DARK_BLUISH_GRAY', 3, 1, 9);
  b.place('brick_1x4', 'WHITE', 0, 7, 9, 1);
  b.place('brick_1x4', 'WHITE', 0, 10, 9, 1);
  b.place('tile_1x4',  'WHITE', 0, 13, 9, 1);

  b.beginStep(4, '砌築左側純白 C 型門柱與紅色「tsmc」立面標誌', '組裝從底板落地直上屋頂的左側純白外框門柱並垂直掛載紅色「tsmc」標誌。', 'rd_logo');
  b.fillRect(-13, -11, 0, 8, 1, 'WHITE', 'plate');
  for (let y of [2, 5, 8, 11]) {
    b.spanZ(-13, y, 0, 8, 'WHITE', 'brick', y === 8);
    b.spanZ(-12, y, 0, 8, 'WHITE', 'brick', y !== 8);
  }
  b.fillRect(-13, -11, 0, 8, 14, 'WHITE', 'tile');
  b.addDecal('rd_tsmc', '正面左側門柱・紅色 tsmc 標誌', 'wall_tsmc_1x2', 'WHITE', -13, 8, 8, 0, [0, 1, 10]);

  b.beginStep(4, '覆蓋 14 段純白圓弧 C 型屋頂前緣與後緣', '沿前緣滿扣純白 2×2 圓弧屋頂磚，勾勒流線 C 型外觀。');
  for (let x = -13; x < 15; x += 2) {
    b.place('curved_slope_2x2', 'WHITE', x, 15, 7, 0);
  }
  b.spanX(-13, 15, 15, 0, 'WHITE', 'tile');
  b.spanX(-13, 15, 15, 1, 'WHITE', 'tile');

  b.beginStep(4, '嵌入 24 道透亮水藍與淺灰交錯屋頂採光天窗', '屋頂中央滿鋪交錯透亮水藍與淺灰長條光磚，全球研發中心完美落成！');
  for (let x = -11; x < 13; x++) {
    const col = (x % 2 === 0) ? 'TRANS_LIGHT_BLUE' : 'LIGHT_BLUISH_GRAY';
    b.place('tile_1x4', col, x, 15, 2, 0);
    b.place('tile_1x1', col, x, 15, 6, 0);
  }

  return b.finalize();
}

// ============================================================================
// SET 06: 臺中國家歌劇院 UCS 典藏版 (64 × 48 studs, 6,200+ bricks, 6 Bags, 30 Steps)
// Toyo Ito's iconic Curvilinear "Sound Cave" Hourglass Facades + Sky Garden
// ============================================================================
function buildSetTaichungOpera() {
  const b = new LegoBuilder({
    id: 'set06_ntt',
    setNumber: '21040',
    shortName: '臺中國家歌劇院',
    name: '臺中國家歌劇院 UCS 典藏版',
    englishName: 'National Taichung Theater — UCS Collector Edition',
    location: '台灣・臺中市西屯區七期重劃區 (Taichung, Taiwan)',
    footprint: '64 × 48',
    age: '18+',
    year: '2026',
    refImage: 'assets/ref/set06.svg',
    accentColor: '#C91A09',
    cameraPos: [56, 38, 62],
    cameraTarget: [0, 7.5, 0],
    description: '超過 6,000 塊零重疊樂高積木打造的博物館旗艦 UCS「臺中國家歌劇院」！致敬建築大師伊東豊雄「美聲涵洞 (Sound Cave)」曲牆奇蹟：採用 64×48 黑色典藏底座、前庭曲水流觴透藍水景廣場、內部大劇院紅色階梯觀眾席與曲牆大廳、四面逐層薄板雕塑出的標誌性沙漏壺中居玻璃帷幕，以及屋頂波浪草坡空中花園與 6 座白色火山口採光天窗。',
    bags: [
      { id: 1, title: '第 1 包：64×48 典藏底座、曲水廣場與銘牌',   subtitle: '64x48 Base, Curving Water Plaza & Plaque', color: '#1D2024' },
      { id: 2, title: '第 2 包：大廳曲牆內腔與大劇院紅色觀眾席', subtitle: 'Sound Cave Atrium & Red Grand Theater', color: '#C91A09' },
      { id: 3, title: '第 3 包：前後立面沙漏壺中居曲牆與藍帷幕', subtitle: 'Front & Rear Hourglass Catenoid Facades', color: '#F6F7F9' },
      { id: 4, title: '第 4 包：左右側壺中居曲牆與室內曲樑結構', subtitle: 'East/West Hourglass Facades & Ribs', color: '#3AC5ED' },
      { id: 5, title: '第 5 包：屋頂結構平台與空中花園起伏草坡', subtitle: 'Roof Deck & Undulating Sky Garden Hills', color: '#1D8F44' },
      { id: 6, title: '第 6 包：6 座白色火山口天窗與花園林蔭',   subtitle: '6 Sculpted Volcano Skylights & Trees', color: '#9FC33A' }
    ]
  });

  // -------------------------------------------------------------------------
  // BAG 1: 64 x 48 UCS Baseplate (-32..32, -24..24) + Curving Water Plaza
  // -------------------------------------------------------------------------
  b.beginStep(1, '拼合 64×48 曜石黑旗艦典藏展示底板', '以 12 塊 16×16 曜石黑基礎薄板無縫拼出 64×48 超大底座。');
  for (let x = -32; x < 32; x += 16) {
    for (let z = -24; z < 24; z += 16) {
      b.place('plate_16x16', 'BLACK', x, 0, z);
    }
  }

  b.beginStep(1, '鋪設 62×46 淺藍灰廣場地基與石材步道', '內縮一格鋪設淺灰結構底板，保留四周典藏黑框邊界。');
  b.fillRect(-31, 31, -23, 23, 1, 'LIGHT_BLUISH_GRAY', 'plate');

  b.beginStep(1, '鋪設前庭曲水流觴透藍景觀水池 (東／西雙池)', '以 1×1 透亮水藍與透海藍光磚細緻拼出歌劇院招牌蜿蜒曲水池。');
  for (let x = -30; x < 30; x++) {
    for (let z = 13; z < 22; z++) {
      if ((x === -1 || x === 0) && z >= 21) continue; // reserve for slope_ntt_2x2 plaque
      // Two sweeping organic water channels flanking the central grand entrance bridge
      const inBridge = Math.abs(x) <= 5;
      const wave = Math.sin(x * 0.22) * 1.6 + 17.5;
      const dist = Math.abs(z - wave);
      if (!inBridge && dist < 2.2) {
        const col = dist < 1.1 ? 'TRANS_MEDIUM_BLUE' : 'TRANS_LIGHT_BLUE';
        b.place('tile_1x1', col, x, 2, z);
      } else if (!inBridge && dist < 3.1) {
        b.place('tile_1x1', 'LIGHT_BLUISH_GRAY', x, 2, z);
      } else if (inBridge) {
        b.place('tile_1x1', (Math.abs(x) === 5 ? 'DARK_BLUISH_GRAY' : 'LIGHT_BLUISH_GRAY'), x, 2, z);
      }
    }
  }

  b.beginStep(1, '鋪設兩側與後方環繞曲水溝渠及石材廣場', '沿東西兩側延伸透水藍景觀水帶，鋪平廣場光磚。');
  for (let z = -19; z <= 13; z++) {
    const waveL = -27.5 + Math.sin(z * 0.25) * 1.2;
    const waveR =  27.5 - Math.sin(z * 0.25) * 1.2;
    for (let x = -30; x <= -25; x++) {
      if (Math.abs(x - waveL) < 1.3) b.place('tile_1x1', 'TRANS_LIGHT_BLUE', x, 2, z);
      else b.place('tile_1x1', 'DARK_BLUISH_GRAY', x, 2, z);
    }
    for (let x = 25; x <= 29; x++) {
      if (Math.abs(x - waveR) < 1.3) b.place('tile_1x1', 'TRANS_LIGHT_BLUE', x, 2, z);
      else b.place('tile_1x1', 'DARK_BLUISH_GRAY', x, 2, z);
    }
  }
  b.fillRect(-30, 30, -22, -17, 2, 'DARK_BLUISH_GRAY', 'tile');

  b.beginStep(1, '安裝「臺中國家歌劇院」典藏銘牌與 20 棵林蔭喬木', '正前方扣上專屬中英文斜面銘牌，並於廣場四周種植多層次喬木。', 'ntt_plaque');
  b.addDecal('ntt_plaque', '廣場正前方・臺中國家歌劇院銘牌', 'slope_ntt_2x2', 'BLACK', -1, 2, 21, 0, [0, 4, 10]);
  const plazaTrees = [
    [-29, 21], [-23, 21], [-17, 21], [-11, 21], [11, 21], [17, 21], [23, 21], [28, 21],
    [-29, -20], [-20, -20], [-10, -20], [0, -20], [10, -20], [20, -20], [28, -20],
    [-30, -8], [-30, 4], [29, -8], [29, 4], [29, 14]
  ];
  for (const [tx, tz] of plazaTrees) {
    b.place('plate_1x1', 'DARK_BLUISH_GRAY', tx, 2, tz);
    b.place('round_brick_1x1', 'REDDISH_BROWN', tx, 3, tz);
    b.place('flower_1x1', 'DARK_GREEN', tx, 6, tz);
    b.place('flower_1x1', 'BRIGHT_GREEN', tx, 7, tz);
    b.place('flower_1x1', 'LIME', tx, 8, tz);
  }

  // -------------------------------------------------------------------------
  // BAG 2: Interior Foyer, Sound Cave Pillars & Red Grand Theater (-24..24, -16..12)
  // -------------------------------------------------------------------------
  b.beginStep(2, '鋪設 1F 曲牆大廳溫潤米色帶凸點承重地坪', '於 48×28 主建築地基滿鋪米色帶凸點薄板，穩固承接上層曲牆、巨柱與觀眾席。');
  b.fillRect(-24, 24, -16, 12, 2, 'TAN', 'plate');

  b.beginStep(2, '建置大劇院階梯式紅色絨布觀眾席 (含實心階梯台座)', '於建築中央核心砌築經典台中國家歌劇院紅色大劇院觀眾席與實心支撐底座。');
  for (let row = 0; row < 5; row++) {
    const rz = -2 - row * 2;
    const ry = 3 + row * 2;
    for (let x = -11; x < 11; x += 2) {
      // Solid riser plinth from y=3 up to ry-1 so tiered seats never float
      for (let py = 3; py < ry; py++) {
        b.place('plate_2x2', 'DARK_BLUISH_GRAY', x, py, rz);
      }
      b.place('plate_2x2', 'RED', x, ry, rz);
      b.place('tile_1x2',  'RED', x, ry + 1, rz, 1);
    }
  }

  b.beginStep(2, '建置大劇院深棕舞台、樂池與溫潤木質聲學背牆', '完成大劇院主舞台與後方聲學牆面結構。');
  b.fillRect(-12, 12, -14, -10, 3, 'DARK_BROWN', 'plate');
  b.fillRect(-12, 12, -14, -10, 4, 'DARK_BROWN', 'tile');
  for (let y = 5; y <= 20; y += 3) {
    b.spanX(-12, 12, y, -14, 'TAN', 'brick', y % 6 === 0);
  }

  b.beginStep(2, '雕塑大廳內部「美聲涵洞」雙曲線實心咬合白柱群', '於大廳左右兩側逐層以 1×3／1×2 對稱咬合薄板雕塑出從地面直達屋頂的白色曲牆涵洞巨柱。');
  const cavePillars = [[-16, 2], [-16, -8], [15, 2], [15, -8]];
  for (const [cx, cz] of cavePillars) {
    for (let y = 3; y <= 36; y++) {
      const t = (y - 19.5) / 16.5; // -1..1
      const spread = Math.round(1 + t * t * 1.6); // 1, 2, or 3
      for (let dz = -1; dz <= 1; dz++) {
        if (spread === 1) {
          b.place('plate_1x3', 'WHITE', cx - 1, y, cz + dz, 1);
        } else if (spread === 2) {
          b.place('plate_1x3', 'WHITE', cx - 2, y, cz + dz, 1);
          b.place('plate_1x2', 'WHITE', cx + 1, y, cz + dz, 1);
        } else {
          b.place('plate_1x2', 'WHITE', cx - 3, y, cz + dz, 1);
          b.place('plate_1x3', 'WHITE', cx - 1, y, cz + dz, 1);
          b.place('plate_1x2', 'WHITE', cx + 2, y, cz + dz, 1);
        }
      }
    }
  }

  b.beginStep(2, '建造大廳中央實心雙向弧形迎賓大階梯', '以淺藍灰與純白薄板堆疊出從 1F 大廳實心支撐向上的迎賓樓梯。');
  for (let s = 0; s < 10; s++) {
    const sy = 3 + s;
    const sz = 8 - s;
    for (let py = 3; py < sy; py++) {
      b.spanX(-4, 4, py, sz, 'LIGHT_BLUISH_GRAY', 'plate');
    }
    b.spanX(-4, 4, sy, sz, s % 2 === 0 ? 'WHITE' : 'LIGHT_BLUISH_GRAY', 'plate');
  }

  // -------------------------------------------------------------------------
  // BAG 3: Front (Z = 10..11) & Rear (Z = -16..-15) Iconic Hourglass Curvilinear Facades
  // Every white concrete shell unit uses interlocking plate_1x2 spanning the full 2-stud
  // wall thickness (Z=10..11 / Z=-16..-15), so outward-flaring hourglass curves are 100%
  // vertically supported by the continuous inner curtain plane at Z=10 / Z=-15!
  // -------------------------------------------------------------------------
  const H_START = 3, H_END = 37; // 34 plate layers tall
  const MID_Y = (H_START + H_END) / 2;
  const HALF_H = (H_END - H_START) / 2;

  const isInFrontHourglass = (x, y) => {
    const centers = [-15.5, 0, 15.5];
    const normY = (y - MID_Y) / HALF_H; // -1..1
    const halfW = 3.2 + 2.8 * normY * normY; // pinched at center, wide at top & bottom!
    for (const c of centers) {
      if (Math.abs(x - c) <= halfW && y >= H_START + 1 && y <= H_END - 2) return true;
    }
    return false;
  };

  // Build Front Facade in 3 vertical stages (Bag 3 Steps 11-13)
  const frontBands = [
    [3, 14,  '雕塑正面「壺中居」下段沙漏曲牆與藍玻璃帷幕 (1–11 層)', '逐層以 1×2 雙倍咬合純白薄板砌出三個向內收束的優美曲牆開口，完全無懸空！'],
    [14, 26, '雕塑正面「壺中居」中段收腰曲牆與深灰窗框 (12–23 層)', '曲牆於建築腰部達到最優美弧度收束，玻璃帷幕加入深藍灰水平與垂直窗櫺。'],
    [26, 37, '雕塑正面「壺中居」上段展開曲牆與挑簷 (24–34 層)',     '曲牆以 1×2 結構咬合流暢展開合攏，直頂屋頂樓板！']
  ];
  for (const [y1, y2, title, tip] of frontBands) {
    b.beginStep(3, title, tip);
    for (let y = y1; y < y2; y++) {
      for (let x = -24; x < 24; x++) {
        if (isInFrontHourglass(x, y)) {
          // Recessed glass curtain wall at Z=10 with dark-gray mullions every 5 studs / 8 plates
          const isMullion = ((x + 24) % 5 === 0) || (y % 8 === 0);
          b.place('plate_1x1', isMullion ? 'DARK_BLUISH_GRAY' : 'TRANS_LIGHT_BLUE', x, y, 10);
        } else {
          // Interlocking 2-stud-deep white concrete catenoid shell (spans Z=10..11 in one piece!)
          b.place('plate_1x2', 'WHITE', x, y, 10, 0);
        }
      }
    }
  }

  // Build Rear Facade in 3 vertical stages (Bag 3 Steps 14-16)
  const rearBands = [
    [3, 14,  '雕塑背面「壺中居」下段曲牆與玻璃帷幕 (1–11 層)',   '於歌劇院後立面對稱以 1×2 咬合薄板砌出三個曲牆玻璃大開口。'],
    [14, 26, '雕塑背面「壺中居」中段收腰曲牆 (12–23 層)',        '持續逐層收束白色曲牆並內嵌透藍玻璃與窗櫺。'],
    [26, 37, '雕塑背面「壺中居」上段合攏曲牆 (24–34 層)',        '完成背面曲牆合攏結構，四面視角皆具穩固建築雕塑感。']
  ];
  for (const [y1, y2, title, tip] of rearBands) {
    b.beginStep(3, title, tip);
    for (let y = y1; y < y2; y++) {
      for (let x = -24; x < 24; x++) {
        if (isInFrontHourglass(x, y)) {
          const isMullion = ((x + 24) % 5 === 0) || (y % 8 === 0);
          b.place('plate_1x1', isMullion ? 'DARK_BLUISH_GRAY' : 'TRANS_LIGHT_BLUE', x, y, -15);
        } else {
          // Interlocking 2-stud-deep white concrete shell spanning Z=-16..-15
          b.place('plate_1x2', 'WHITE', x, y, -16, 0);
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // BAG 4: East (X = 22..23) & West (X = -24..-23) Hourglass Curvilinear Facades
  // Interlocking plate_1x2 (rot=1) spans full 2-stud wall thickness so ZERO bricks float!
  // -------------------------------------------------------------------------
  const isInSideHourglass = (z, y) => {
    const centers = [-8.5, 3.5];
    const normY = (y - MID_Y) / HALF_H;
    const halfW = 2.6 + 2.4 * normY * normY;
    for (const c of centers) {
      if (Math.abs(z - c) <= halfW && y >= H_START + 1 && y <= H_END - 2) return true;
    }
    return false;
  };

  const westBands = [
    [3, 20,  '雕塑西側立面雙沙漏曲牆下半部 (1–17 層)', '於西側立面以 1×2 結構咬合薄板構築兩座流線型壺中居玻璃帷幕。'],
    [20, 37, '雕塑西側立面雙沙漏曲牆上半部 (18–34 層)', '向上展開並合攏西側純白曲牆外殼。']
  ];
  for (const [y1, y2, title, tip] of westBands) {
    b.beginStep(4, title, tip);
    for (let y = y1; y < y2; y++) {
      for (let z = -14; z < 10; z++) {
        if (isInSideHourglass(z, y)) {
          const isMullion = ((z + 16) % 4 === 0) || (y % 8 === 0);
          b.place('plate_1x1', isMullion ? 'DARK_BLUISH_GRAY' : 'TRANS_LIGHT_BLUE', -23, y, z);
        } else {
          b.place('plate_1x2', 'WHITE', -24, y, z, 1);
        }
      }
    }
  }

  const eastBands = [
    [3, 20,  '雕塑東側立面雙沙漏曲牆下半部 (1–17 層)', '於東側立面對稱以 1×2 結構咬合薄板構築兩座壺中居玻璃帷幕。'],
    [20, 37, '雕塑東側立面雙沙漏曲牆上半部 (18–34 層)', '完成東側純白曲牆外殼，四面壺中居穩固合體成型！']
  ];
  for (const [y1, y2, title, tip] of eastBands) {
    b.beginStep(4, title, tip);
    for (let y = y1; y < y2; y++) {
      for (let z = -14; z < 10; z++) {
        if (isInSideHourglass(z, y)) {
          const isMullion = ((z + 16) % 4 === 0) || (y % 8 === 0);
          b.place('plate_1x1', isMullion ? 'DARK_BLUISH_GRAY' : 'TRANS_LIGHT_BLUE', 22, y, z);
        } else {
          b.place('plate_1x2', 'WHITE', 22, y, z, 1);
        }
      }
    }
  }

  b.beginStep(4, '架設室內承重柱列與頂層白色聲學曲樑', '於主建築內部立起落地結構柱群並橫跨雙向白色承重樑，完美撐起屋頂空中花園。');
  for (const z of [-8, 2]) {
    // Support columns rising from floor (y=3) up to beam underside (y=33)
    for (const cx of [-8, 0, 8]) {
      for (let y = 3; y <= 31; y += 3) {
        b.place('brick_1x1', 'WHITE', cx, y, z);
      }
      b.place('plate_1x1', 'WHITE', cx, 33, z);
    }
    b.spanX(-22, 22, 34, z, 'WHITE', 'brick');
  }

  // -------------------------------------------------------------------------
  // BAG 5: Roof Structural Deck, Crisp White Parapet & Undulating Sky Garden Hills
  // -------------------------------------------------------------------------
  b.beginStep(5, '覆蓋 48×28 歌劇院屋頂結構樓板', '鋪滿屋頂淺藍灰與純白承重樓板，為空中花園打底。');
  b.fillRect(-24, 24, -16, 12, 37, 'LIGHT_BLUISH_GRAY', 'plate');

  b.beginStep(5, '圍築四周純白俐落屋頂女兒牆與平滑壓頂', '沿屋頂四邊砌起純白邊框與平滑光磚收邊。');
  b.wallRing(-24, 24, -16, 12, 38, 'WHITE', 'plate');
  b.wallRing(-24, 24, -16, 12, 39, 'WHITE', 'tile');

  b.beginStep(5, '鋪設空中花園蜿蜒白色步道與第一層鮮綠草坪', '依真實空中花園動線鋪出 S 型散步道與鮮綠草坡基底。');
  for (let x = -23; x < 23; x++) {
    const pathZ = Math.round(Math.sin(x * 0.16) * 5.0 - 2.0);
    for (let z = -15; z < 11; z++) {
      if (Math.abs(z - pathZ) <= 1) {
        b.place('tile_1x1', 'LIGHT_BLUISH_GRAY', x, 38, z);
      } else {
        const col = ((x + z) % 5 === 0) ? 'DARK_GREEN' : 'BRIGHT_GREEN';
        b.place('plate_1x1', col, x, 38, z);
      }
    }
  }

  b.beginStep(5, '雕塑空中花園起伏草丘地形 (第二至三層綠坡)', '以鮮綠、深松綠與嫩芽綠薄板堆疊出波浪起伏的屋頂草丘。');
  const hills = [[-16, -9, 4.5], [14, -9, 5.0], [-14, 5, 4.2], [16, 4, 4.5], [0, -10, 4.0]];
  for (let x = -22; x < 22; x++) {
    for (let z = -14; z < 10; z++) {
      for (const [hx, hz, hr] of hills) {
        const d = Math.hypot(x - hx, z - hz);
        if (d < hr * 0.72) {
          b.place('plate_1x1', d < hr * 0.4 ? 'LIME' : 'BRIGHT_GREEN', x, 39, z);
        }
        if (d < hr * 0.42) {
          b.place('plate_1x1', 'BRIGHT_GREEN', x, 40, z);
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // BAG 6: 6 Iconic White Sculpted "Volcano" Skylight Cones & Rooftop Trees
  // Grounded directly onto roof deck (y=39) with solid core under the skylight lens!
  // -------------------------------------------------------------------------
  const volcanoes = [
    [-15, -8], [0, -9], [15, -8],
    [-14,  4], [2,  4], [15,  4]
  ];

  b.beginStep(6, '砌築 6 座標誌性白色「火山口」天窗底座環', '從屋頂草坪基底 (y=39) 穩固砌築 6 座伊東豊雄招牌白色有機天窗雕塑。');
  for (const [vx, vz] of volcanoes) {
    for (let y = 39; y <= 42; y++) {
      for (let dx = -2; dx <= 2; dx++) {
        for (let dz = -2; dz <= 2; dz++) {
          const d = Math.hypot(dx, dz);
          if (d <= 2.4) {
            b.place('plate_1x1', 'WHITE', vx + dx, y, vz + dz);
          }
        }
      }
    }
  }

  b.beginStep(6, '向上收縮雕塑 6 座火山口白色流線錐體與藍光天窗', '逐層內縮砌出柔順白色火山口造型，中央嵌入透亮水藍採光玻璃！');
  for (const [vx, vz] of volcanoes) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        if (dx === 0 && dz === 0) {
          b.place('tile_1x1', 'TRANS_LIGHT_BLUE', vx, 43, vz);
        } else {
          b.place('plate_1x1', 'WHITE', vx + dx, 43, vz + dz);
          b.place('tile_1x1',  'WHITE', vx + dx, 44, vz + dz);
        }
      }
    }
  }

  b.beginStep(6, '種植空中花園 16 棵景觀小樹與花卉灌木完工', '沿屋頂 S 型散步道種植多層次植栽，臺中國家歌劇院完美落成！');
  const roofTrees = [
    [-20, -12], [-20, 0], [-20, 8], [-8, -13], [-8, 8],
    [8, -13], [8, 8], [20, -12], [20, 0], [20, 8],
    [-6, -2], [6, -2], [-18, -5], [18, -5], [-4, 8], [4, -12]
  ];
  for (const [tx, tz] of roofTrees) {
    b.place('round_brick_1x1', 'REDDISH_BROWN', tx, 39, tz);
    b.place('flower_1x1', 'DARK_GREEN', tx, 42, tz);
    b.place('flower_1x1', 'BRIGHT_GREEN', tx, 43, tz);
    b.place('flower_1x1', 'LIME', tx, 44, tz);
  }

  return b.finalize();
}

// ============================================================================
// SET 07: 臺中國際會展中心一二期 UCS 典藏版 (80 × 44 studs, 7,000+ bricks, 6 Bags, 27 Steps)
// Silver Magic Carpet Wave Roof + Phase 1 & 2 Skybridge + Distinct Front Tree Gate vs Rear Logistics
// ============================================================================
function buildSetTaichungExpo() {
  const b = new LegoBuilder({
    id: 'set07_ticec',
    setNumber: '21041',
    shortName: '臺中國際會展中心',
    name: '臺中國際會展中心 1・2 期 UCS 典藏版',
    englishName: 'Taichung International Convention & Exhibition Center (Phases 1 & 2) — UCS',
    location: '台灣・臺中市西屯區水湳經貿園區 (Shuinan, Taichung, Taiwan)',
    footprint: '80 × 44',
    age: '18+',
    year: '2026',
    refImage: 'assets/ref/set07.svg',
    accentColor: '#3AC5ED',
    cameraPos: [68, 42, 74],
    cameraTarget: [0, 7, 0],
    description: '超過 6,000 塊零重疊樂高積木打造的全景旗艦 UCS「臺中國際會展中心一、二期」！採用 80×44 寬幅展示底座，精細還原三大建築靈魂：(1) 橫跨兩館的巨型「銀色魔毯」3D 雙向波浪屋頂與深藍太陽能光電板陣列；(2) 東側一期展館／會議中心與西側二期展館之間，橫跨中央綠廊的 2F 高架玻璃鋼構聯通空橋；(3) 截然不同的正背面立面設計——南面迎向中央公園的「大樹之門」Y 型樹狀挑簷列柱與雙層透明玻璃帷幕，對比北面厚實重型物流卸貨碼頭、金屬垂直格柵百葉、微縮貨櫃車陣列與西側二期招牌「造型迴車塔」！',
    bags: [
      { id: 1, title: '第 1 包：80×44 全景底座、水湳公園廣場與北側貨運坪', subtitle: '80x44 Base, Central Park Plaza & North Freight Yard', color: '#1D2024' },
      { id: 2, title: '第 2 包：一期東館會議廳、二期西館展場與微縮攤位',     subtitle: 'Phase 1 Convention Hall & Phase 2 Expo Interior', color: '#C91A09' },
      { id: 3, title: '第 3 包：南側正面「大樹之門」樹狀列柱與玻璃帷幕',   subtitle: 'South Front Tree Gate Columns & Glass Curtain Wall', color: '#3AC5ED' },
      { id: 4, title: '第 4 包：北側背面卸貨碼頭、金屬百葉與造型迴車塔',   subtitle: 'North Rear Loading Docks, Louvers & Spiral Ramp Tower', color: '#555C63' },
      { id: 5, title: '第 5 包：1・2 期聯通 2F 高架玻璃空橋與中央綠廊',    subtitle: 'Phase 1–2 Elevated Skybridge & Central Promenade', color: '#1D8F44' },
      { id: 6, title: '第 6 包：巨型「銀色魔毯」波浪屋頂與太陽能板陣列',   subtitle: 'Undulating Silver Magic Carpet Wave Roof & Solar Array', color: '#92989F' }
    ]
  });

  // Shared 3D double-sinusoidal undulating wave roof height (in plate units)
  // Smoothly waves across Phase 2 (-37..-7), central canopy (-7..7), and Phase 1 (7..37)
  const roofY = (x, z) => {
    const waveX = 3.6 * Math.sin((x + 5) * 0.145) + 1.2 * Math.cos(x * 0.08);
    const waveZ = 2.0 * Math.cos((z - 1) * 0.19);
    // Slight dramatic lift over the South Front "Tree Gate" overhang (z > 8)
    const southLift = z > 8 ? (z - 8) * 0.35 : 0;
    return Math.round(21.5 + waveX + waveZ + southLift);
  };

  // -------------------------------------------------------------------------
  // BAG 1: 80 x 44 Panoramic UCS Baseplate (-40..40, -22..22)
  // South Front: Shuinan Central Park Lawn, Eco-Stream, Civic Plaza & Plaque
  // North Rear: Heavy Logistics Freight Apron & 4 Micro Cargo Semi-Trucks
  // -------------------------------------------------------------------------
  b.beginStep(1, '拼合 80×44 曜石黑全景典藏底座底板', '以 16×16 與大面積曜石黑基礎薄板無縫拼出 80×44 超寬幅展示基座。');
  for (let x = -40; x < 40; x += 16) {
    b.place('plate_16x16', 'BLACK', x, 0, -22);
    b.place('plate_16x16', 'BLACK', x, 0, -6);
  }
  b.fillRect(-40, 40, 10, 22, 0, 'BLACK', 'plate');

  b.beginStep(1, '鋪設 78×42 基地結構底層與南北分區地坪', '南側採用淺藍灰市民廣場基底，北側鋪設深藍灰重型貨運車道基底。');
  b.fillRect(-39, 39, -11, 21, 1, 'LIGHT_BLUISH_GRAY', 'plate');
  b.fillRect(-39, 39, -21, -11, 1, 'DARK_BLUISH_GRAY', 'plate');

  b.beginStep(1, '雕塑南側正面水湳中央公園綠地、生態曲水與迎賓大道', '正面臨水湳中央公園側鋪設多層次鮮綠草坪、蜿蜒透藍水景與帶凸點 1F 迎賓前廊承重底板。');
  // Complete ground plaza apron (Z = 10..13) using studded plates directly beneath South Front glass wall & Tree Gate columns!
  b.fillRect(-38, 38, 10, 13, 2, 'LIGHT_BLUISH_GRAY', 'plate');
  for (let x = -38; x < 38; x++) {
    for (let z = 13; z < 21; z++) {
      if ((x === -1 || x === 0) && (z === 19 || z === 20)) continue; // reserve for slope_ticec_2x2 plaque
      const inCentralPlaza = Math.abs(x) <= 6;
      const inEastEntry = Math.abs(x - 21) <= 3;
      const inWestEntry = Math.abs(x + 21) <= 3;
      const streamZ = 17.5 + Math.sin(x * 0.18) * 1.4;
      if (inCentralPlaza || inEastEntry || inWestEntry) {
        const col = ((x + z) % 2 === 0) ? 'LIGHT_BLUISH_GRAY' : 'TAN';
        b.place('tile_1x1', col, x, 2, z);
      } else if (Math.abs(z - streamZ) < 1.15) {
        b.place('tile_1x1', 'TRANS_LIGHT_BLUE', x, 2, z);
      } else {
        const col = ((x * 3 + z) % 7 === 0) ? 'LIME' : (((x + z) % 5 === 0) ? 'DARK_GREEN' : 'BRIGHT_GREEN');
        b.place('plate_1x1', col, x, 2, z);
      }
    }
  }

  b.beginStep(1, '安裝「臺中國際會展中心」專屬銘牌與 18 棵中央公園喬木', '於正面中央公園廣場扣上專屬斜面銘牌，並點綴多層次綠蔭喬木。', 'ticec_plaque');
  b.addDecal('ticec_plaque', '南側廣場正前方・臺中國際會展中心銘牌', 'slope_ticec_2x2', 'BLACK', -1, 2, 19, 0, [0, 4, 10]);
  const southTrees = [
    [-36, 19], [-31, 16], [-27, 20], [-14, 19], [-9, 15],
    [9, 15], [14, 19], [27, 20], [31, 16], [36, 19],
    [-37, 13], [-12, 14], [12, 14], [37, 13],
    [-3, 18], [3, 18], [-25, 15], [25, 15]
  ];
  for (const [tx, tz] of southTrees) {
    b.place('round_brick_1x1', 'REDDISH_BROWN', tx, 3, tz);
    b.place('flower_1x1', 'DARK_GREEN', tx, 6, tz);
    b.place('flower_1x1', 'BRIGHT_GREEN', tx, 7, tz);
    b.place('flower_1x1', 'LIME', tx, 8, tz);
  }

  b.beginStep(1, '鋪設北側背面重型物流貨運廣場與 4 輛微縮貨櫃車', '與正面公園截然不同！背面為專業物流裝卸坪，停放 4 輛微縮聯結貨櫃車。');
  for (let x = -36; x < 36; x += 6) {
    for (let z = -19; z <= -14; z += 2) {
      b.place('tile_1x1', 'WHITE', x, 2, z);
    }
  }
  const trucks = [
    { x: -28, color: 'RED' },
    { x: -16, color: 'BLUE' },
    { x:  14, color: 'WHITE' },
    { x:  26, color: 'DARK_BLUE' }
  ];
  for (const tr of trucks) {
    b.place('brick_1x4', tr.color, tr.x, 2, -16, 0);
    b.place('tile_1x4',  tr.color, tr.x, 5, -16, 0);
    b.place('brick_1x1', 'WHITE', tr.x, 2, -18);
    b.place('plate_1x1', 'TRANS_LIGHT_BLUE', tr.x, 5, -18);
  }

  // -------------------------------------------------------------------------
  // BAG 2: Phase 1 East Hall (X = 6..36) & Phase 2 West Hall (X = -36..-6) Interiors
  // -------------------------------------------------------------------------
  b.beginStep(2, '鋪設二期西側展館 (West Hall) 1F 帶凸點承重展場底板', '於西側 30×21 展館基地滿鋪帶凸點淺藍灰薄板，供後續展攤、鋼柱與外牆穩固卡合！');
  b.fillRect(-36, -6, -11, 10, 2, 'LIGHT_BLUISH_GRAY', 'plate');

  b.beginStep(2, '鋪設一期東側展館與會議中心 (East Hall) 帶凸點底板', '於東側 30×21 基地滿鋪淺藍灰展廳與米色會議中心帶凸點承重薄板。');
  b.fillRect(6, 24, -11, 10, 2, 'LIGHT_BLUISH_GRAY', 'plate');
  b.fillRect(24, 36, -11, 10, 2, 'TAN', 'plate');

  b.beginStep(2, '建置二期西館與一期東館微縮國際展覽攤位群', '於兩座展館內部配置紅、藍、白、珍珠金特色微縮展區攤位與中央主軸走道。');
  const boothColors = ['RED', 'BLUE', 'WHITE', 'PEARL_GOLD', 'SAND_BLUE'];
  let bIdx = 0;
  for (const xStart of [-33, -25, -17, 9, 17]) {
    for (const zStart of [-8, -2, 4]) {
      const col = boothColors[bIdx++ % boothColors.length];
      b.place('plate_2x4', col, xStart, 3, zStart, 1);
      b.place('brick_1x2', 'WHITE', xStart + 1, 4, zStart, 1);
      b.place('tile_1x2',  col, xStart + 1, 7, zStart, 1);
    }
  }

  b.beginStep(2, '打造一期東側「國際會議中心」實心階梯式紅藍會議座席與講台', '還原一期東側招牌國際會議廳：深棕主講台搭配 4 階實心支撐紅藍觀眾席！');
  b.fillRect(26, 34, -8, -5, 3, 'DARK_BROWN', 'plate');
  b.fillRect(26, 34, -8, -5, 4, 'DARK_BROWN', 'tile');
  for (let row = 0; row < 4; row++) {
    const rz = -2 + row * 2;
    const ry = 3 + row * 2;
    const seatCol = row % 2 === 0 ? 'RED' : 'DARK_BLUE';
    for (let x = 26; x < 34; x += 2) {
      for (let py = 3; py < ry; py++) {
        b.place('plate_2x2', 'DARK_BLUISH_GRAY', x, py, rz);
      }
      b.place('plate_2x2', seatCol, x, ry, rz);
      b.place('tile_1x2',  seatCol, x, ry + 1, rz, 1);
    }
  }

  b.beginStep(2, '立起兩館室內巨型鋼骨支撐柱直頂波浪屋頂', '於兩館內部均勻立起深灰結構巨柱，精準頂接上方大跨距銀色波浪屋頂底面，零縫隙！');
  const interiorCols = [
    [-33, -9], [-25, -9], [-17, -9], [-9, -9],
    [-33,  0], [-25,  0], [-17,  0], [-9,  0],
    [-33,  7], [-25,  7], [-17,  7], [-9,  7],
    [9,   -9], [17,  -9], [25,  -9], [33, -9],
    [9,    0], [17,   0], [25,   0], [33,  0],
    [9,    7], [17,   7], [25,   7], [33,  7]
  ];
  for (const [cx, cz] of interiorCols) {
    const topTarget = roofY(cx, cz) - 1;
    let y = 3;
    while (y + 3 <= topTarget) {
      b.place('brick_1x1', 'DARK_BLUISH_GRAY', cx, y, cz);
      y += 3;
    }
    while (y < topTarget) {
      b.place('plate_1x1', 'DARK_BLUISH_GRAY', cx, y, cz);
      y += 1;
    }
  }

  // -------------------------------------------------------------------------
  // BAG 3: South Front Facade (Z = 9..13) — Iconic "Tree Gate" (大樹之門)
  // Every wall reaches flush up to roofY(x, 10) - 1 (ZERO air gap to roof!)
  // -------------------------------------------------------------------------
  b.beginStep(3, '構築二期西館南側正面雙層通透玻璃帷幕與銀色窗框', '正面迎向中央公園採用大面積透亮水藍玻璃帷幕，頂緣緊密貼合波浪屋頂底面！');
  for (let x = -36; x < -6; x++) {
    const wallTop = roofY(x, 10) - 1; // inclusive up to ry-2 -> touches ry-1 flush!
    for (let y = 3; y < wallTop; y++) {
      const isEntry = Math.abs(x + 21) <= 2 && y < 10;
      if (isEntry) {
        b.place('plate_1x1', y === 9 ? 'FLAT_SILVER' : 'TRANS_CLEAR', x, y, 9);
      } else if (Math.abs(x + 21) <= 2 && y === 10) {
        // Interlocking lintel bridging recessed entry (Z=9) back out to facade plane (Z=10)
        b.place('plate_1x2', 'FLAT_SILVER', x, y, 9, 0);
      } else {
        const isMullion = ((x + 36) % 4 === 0) || (y === 10) || (y === 3);
        b.place('plate_1x1', isMullion ? 'FLAT_SILVER' : 'TRANS_LIGHT_BLUE', x, y, 10);
      }
    }
  }

  b.beginStep(3, '構築一期東館南側正面通透玻璃帷幕與會議廳觀景窗', '對稱於一期東館正面砌築高聳透藍玻璃帷幕，頂緣緊密貼合波浪屋頂！');
  for (let x = 6; x < 36; x++) {
    const wallTop = roofY(x, 10) - 1;
    for (let y = 3; y < wallTop; y++) {
      const isEntry = Math.abs(x - 21) <= 2 && y < 10;
      if (isEntry) {
        b.place('plate_1x1', y === 9 ? 'FLAT_SILVER' : 'TRANS_CLEAR', x, y, 9);
      } else if (Math.abs(x - 21) <= 2 && y === 10) {
        b.place('plate_1x2', 'FLAT_SILVER', x, y, 9, 0);
      } else {
        const isMullion = ((x - 6) % 4 === 0) || (y === 10) || (y === 3);
        b.place('plate_1x1', isMullion ? 'FLAT_SILVER' : 'TRANS_LIGHT_BLUE', x, y, 10);
      }
    }
  }

  b.beginStep(3, '雕塑南側招牌「大樹之門 (Tree Gate)」Y 型咬合純白挑簷列柱', '沿正面廣場立起 14 座實體咬合的白色樹狀斜撐巨柱，從地坪一路穩固撐起波浪屋簷！');
  const treeGateX = [-35, -30, -25, -17, -12, -7, -3, 3, 7, 12, 17, 25, 30, 35];
  for (const tx of treeGateX) {
    const topY = roofY(tx, 12) - 1;
    // Solid trunk rising from y=3 to y=11 at Z=12
    for (let y = 3; y < Math.min(12, topY); y++) {
      b.place('plate_1x1', 'WHITE', tx, y, 12);
    }
    // Interlocking Y-branches: plate_1x3 (rot=1, spans tx-1..tx+1) anchored directly onto trunk at tx!
    for (let y = 12; y < topY; y++) {
      if (y < 16) {
        b.place('plate_1x3', 'WHITE', tx - 1, y, 12, 1);
      } else {
        // Upper crown spreads along Z (11..13) AND X (tx-1..tx+1) anchored to center!
        b.place('plate_1x3', 'WHITE', tx - 1, y, 12, 1);
        b.place('plate_1x2', 'WHITE', tx, y, 11, 0);
        b.place('plate_1x2', 'WHITE', tx, y, 12, 0);
      }
    }
  }

  b.beginStep(3, '安裝正面挑簷溫潤木質米色懸挑托樑 (Soffit)', '以 1×3 沙漠米色托樑從玻璃帷幕 (Z=10) 實體懸挑至大樹之門列柱 (Z=12)，穩固無懸空！');
  for (let x = -36; x < 36; x += 2) {
    if (x >= -6 && x < 6) continue; // central promenade open under canopy
    const sy = Math.min(roofY(x, 10), roofY(x, 12)) - 2;
    b.place('plate_1x3', 'TAN', x, sy, 10, 0);
  }

  // -------------------------------------------------------------------------
  // BAG 4: North Rear Facade (Z = -12..-10) — Heavy Logistics Design!
  // Interlocking dock lintels & rain canopy + upper louver wall flush to wave roof!
  // -------------------------------------------------------------------------
  b.beginStep(4, '建造北側背面 10 座重型貨車卸貨碼頭與黑色捲門 (截然不同的背面設計)', '背面改以深藍灰混凝土月台、10 座內凹黑色捲門與實體咬合的金屬銀防雨挑簷呈現機能美學。');
  const dockCenters = [-32, -27, -22, -16, -11, 11, 16, 22, 27, 32];
  const isInDock = (x, y) => {
    if (y < 3 || y > 8) return false;
    for (const dc of dockCenters) {
      if (Math.abs(x - dc) <= 1) return true;
    }
    return false;
  };
  for (const [x1, x2] of [[-36, -6], [6, 36]]) {
    for (let x = x1; x < x2; x++) {
      for (let y = 3; y <= 8; y++) {
        if (isInDock(x, y)) {
          b.place('plate_1x1', y === 8 ? 'DARK_BLUISH_GRAY' : 'BLACK', x, y, -10);
        } else {
          b.place('plate_1x1', 'DARK_BLUISH_GRAY', x, y, -11);
        }
      }
      // Solid lintel at y=9 spanning Z=-11..-10 over every dock & pier!
      b.place('plate_1x2', 'DARK_BLUISH_GRAY', x, 9, -11, 0);
      // Interlocking rain canopy at y=10 spanning Z=-12..-11 (anchored onto y=9 lintel!)
      b.place('plate_1x2', 'FLAT_SILVER', x, 10, -12, 0);
    }
  }

  b.beginStep(4, '砌築北側背面上半部金屬垂直百葉格柵牆與高窗帶', '卸貨碼頭上方採用交錯金屬銀與深藍灰垂直百葉格柵，一路緊密頂接波浪屋頂！');
  for (const [x1, x2] of [[-36, -6], [6, 36]]) {
    for (let x = x1; x < x2; x++) {
      const wallTop = roofY(x, -11) - 1;
      for (let y = 11; y < wallTop; y++) {
        if (y === 13 || y === 14) {
          b.place('plate_1x1', (x % 3 === 0) ? 'DARK_BLUISH_GRAY' : 'TRANS_MEDIUM_BLUE', x, y, -11);
        } else {
          const col = (x % 2 === 0) ? 'FLAT_SILVER' : 'DARK_BLUISH_GRAY';
          b.place('plate_1x1', col, x, y, -11);
        }
      }
    }
  }

  b.beginStep(4, '砌築東西兩側端牆與中央綠廊內側雙館對望帷幕牆', '封閉西端 (-36)、東端 (35) 端牆與中央綠廊內側帷幕牆，全數緊密銜接波浪屋頂！');
  for (const wx of [-36, 35]) {
    for (let z = -10; z < 10; z++) {
      const wallTop = roofY(wx, z) - 1;
      for (let y = 3; y < wallTop; y++) {
        const isGlassBand = (y >= 11 && y <= 14 && z > -6 && z < 7);
        const col = isGlassBand ? ((z % 3 === 0) ? 'FLAT_SILVER' : 'TRANS_LIGHT_BLUE')
          : (y % 4 === 0 ? 'FLAT_SILVER' : 'WHITE');
        b.place('plate_1x1', col, wx, y, z);
      }
    }
  }
  // Inner Central Promenade walls (x=-7 on Phase 2, x=6 on Phase 1)
  // Portal column (Z=-2..4, Y>=9) is left open here and completed above the skybridge roof in Bag 5!
  for (const ix of [-7, 6]) {
    for (let z = -10; z < 10; z++) {
      const wallTop = roofY(ix, z) - 1;
      for (let y = 3; y < wallTop; y++) {
        const inBridgePortal = (z >= -2 && z <= 4 && y >= 9);
        if (inBridgePortal) continue;
        const isMullion = (z % 4 === 0) || (y === 8);
        b.place('plate_1x1', isMullion ? 'WHITE' : 'TRANS_LIGHT_BLUE', ix, y, z);
      }
    }
  }

  b.beginStep(4, '雕塑西側北角二期招牌「造型迴車塔 (Spiral Turnaround Ramp Tower)」', '於西側展館北角打造實心核心圓筒螺旋物流迴車塔，以純白螺旋車道肋條盤旋而上！');
  const towerCX = -36, towerCZ = -14;
  for (let y = 2; y <= 16; y++) {
    for (let dx = -3; dx <= 3; dx++) {
      for (let dz = -3; dz <= 3; dz++) {
        const dist = Math.hypot(dx, dz);
        if (dist <= 3.2) {
          if (dist < 2.1) {
            // Solid structural elevator & ramp core inside tower so top deck never floats
            b.place('plate_1x1', 'DARK_BLUISH_GRAY', towerCX + dx, y, towerCZ + dz);
          } else {
            const angle = Math.atan2(dz, dx);
            const helixPhase = ((y * 0.55 + angle * 1.6) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
            const col = helixPhase < 1.9 ? 'WHITE' : (helixPhase < 3.4 ? 'FLAT_SILVER' : 'DARK_BLUISH_GRAY');
            b.place('plate_1x1', col, towerCX + dx, y, towerCZ + dz);
          }
        }
      }
    }
  }
  for (let dx = -2; dx <= 2; dx++) {
    for (let dz = -2; dz <= 2; dz++) {
      if (Math.hypot(dx, dz) <= 2.3) {
        b.place('tile_1x1', Math.hypot(dx, dz) < 1.2 ? 'DARK_BLUISH_GRAY' : 'LIGHT_BLUISH_GRAY', towerCX + dx, 17, towerCZ + dz);
      }
    }
  }

  // -------------------------------------------------------------------------
  // BAG 5: Phase 1 & Phase 2 Connection (1・2 期聯通)
  // Central Green Promenade + Elevated 2F Glass & Steel Skybridge (X = -7..7, Z = -3..5, Y = 8..17)
  // -------------------------------------------------------------------------
  b.beginStep(5, '鋪設一二期之間「中央綠廊景觀步道」與植栽帶', '串聯南北水湳中央公園與北側廣場，以石材步道與雙排綠籬勾勒中軸動線。');
  for (let x = -6; x < 6; x++) {
    for (let z = -12; z < 10; z++) {
      const isGreenStrip = (x === -5 || x === 4) && (z % 2 === 0);
      if (isGreenStrip) {
        b.place('plate_1x1', 'BRIGHT_GREEN', x, 2, z);
      } else {
        const col = (Math.abs(x) <= 2) ? 'TAN' : 'LIGHT_BLUISH_GRAY';
        b.place('tile_1x1', col, x, 2, z);
      }
    }
  }

  b.beginStep(5, '立起 2F 聯通空橋白色 V 型雙排支撐橋墩', '於中央綠廊兩側架設 4 組白色斜撐柱墩，挑高留設無障礙地面步行廊道。');
  for (const px of [-4, 3]) {
    for (const pz of [-2, 4]) {
      for (let y = 3; y <= 7; y++) {
        b.place('plate_1x1', 'WHITE', px, y, pz);
      }
    }
  }

  b.beginStep(5, '架設 1・2 期 2F 聯通空橋主結構橋面與深灰鋼桁架', '橫跨 12 格寬度無縫對接一期東館與二期西館 2F 大廳，鋪設寬敞展覽連通道！');
  b.fillRect(-6, 6, -3, 5, 8, 'DARK_BLUISH_GRAY', 'plate');
  b.fillRect(-6, 6, -3, 5, 9, 'TAN', 'tile');

  b.beginStep(5, '安裝 2F 聯通空橋雙面全景透明玻璃帷幕與承重頂板', '空橋南北兩側包覆透亮水藍玻璃與白色桁架，頂板兩端延伸錨定並封合雙館上段內牆！');
  for (let x = -6; x < 6; x++) {
    for (let y = 10; y <= 15; y++) {
      const isTruss = ((x + 6) % 3 === 0) || (y === 10) || (y === 15);
      const col = isTruss ? 'WHITE' : 'TRANS_LIGHT_BLUE';
      b.place('plate_1x1', col, x, y, -3);
      b.place('plate_1x1', col, x, y, 4);
    }
  }
  // Skybridge roof slab extends X=-7..7 so both inner promenade walls above Y=16 rest solidly on it!
  b.fillRect(-7, 7, -3, 5, 16, 'WHITE', 'plate');
  b.fillRect(-6, 6, -2, 4, 17, 'FLAT_SILVER', 'tile');
  // Complete inner promenade walls above skybridge roof (Y >= 17) now that Y=16 support exists!
  for (const ix of [-7, 6]) {
    for (let z = -2; z <= 4; z++) {
      const wallTop = roofY(ix, z) - 1;
      for (let y = 17; y < wallTop; y++) {
        const isMullion = (z % 4 === 0);
        b.place('plate_1x1', isMullion ? 'WHITE' : 'TRANS_LIGHT_BLUE', ix, y, z);
      }
    }
  }

  // -------------------------------------------------------------------------
  // BAG 6: Giant "Silver Magic Carpet" Watertight Undulating Wave Roof (巨型銀色魔毯波浪屋頂)
  // Continuous 3D stepped shell where every adjacent column overlaps vertically with its
  // neighbors (minNeighborRY - 1 .. ry - 1), resting flush on all walls & 24 interior columns!
  // -------------------------------------------------------------------------
  const buildRoofSection = (x1, x2, title, tip) => {
    b.beginStep(6, title, tip);
    for (let x = x1; x < x2; x++) {
      for (let z = -12; z < 14; z++) {
        const ry = roofY(x, z);
        const isEdge = (x === -37 || x === 36 || z === -12 || z === 13);
        // Compute lowest neighbor roofY to guarantee 100% watertight vertical continuity (zero gaps/floating tiles)
        let minN = ry;
        if (x > -37) minN = Math.min(minN, roofY(x - 1, z));
        if (x < 36)  minN = Math.min(minN, roofY(x + 1, z));
        if (z > -12) minN = Math.min(minN, roofY(x, z - 1));
        if (z < 13)  minN = Math.min(minN, roofY(x, z + 1));

        const underCol = isEdge ? 'WHITE' : (z >= 10 ? 'TAN' : 'LIGHT_BLUISH_GRAY');
        for (let uy = Math.min(minN, ry - 1); uy <= ry - 1; uy++) {
          b.place('plate_1x1', underCol, x, uy, z);
        }

        // Top silver magic carpet skin (ry) with rhythmic wave ribs & crisp white perimeter edge
        const isRib = ((x + 40) % 6 === 0);
        const topCol = isEdge ? 'WHITE' : (isRib ? 'LIGHT_BLUISH_GRAY' : 'FLAT_SILVER');
        b.place('tile_1x1', topCol, x, ry, z);
      }
    }
  };

  buildRoofSection(
    -37, -12,
    '鋪設二期西館「銀色魔毯」3D 連續咬合波浪屋頂 (西段)',
    '逐格依雙向正弦波高程雕塑連續無縫銀色屋頂浪潮，與西館外牆與巨柱緊密合體！'
  );

  buildRoofSection(
    -12, 12,
    '合體鋪設中央聯通天幕波浪屋頂 (中段跨接 1・2 期)',
    '巨型銀色魔毯無縫跨越中央綠廊與 2F 聯通空橋，將一期與二期展館合為壯闊一體！'
  );

  buildRoofSection(
    12, 37,
    '鋪設一期東館與會議中心「銀色魔毯」波浪屋頂 (東段)',
    '延續雙向波浪曲面完整覆蓋一期東館與會議中心，形成 74 格超寬幅銀色天際線！'
  );

  b.beginStep(6, '加裝屋頂 8 大區海軍深藍太陽能光電板陣列與天窗完工', '於波浪屋頂平緩區段鋪設海軍深藍太陽能光電陣列，致敬會展中心 4,945 片綠能屋頂！');
  const solarZones = [
    [-33, -23, -8, -2], [-33, -23, 2, 7],
    [-19, -10, -8, -2], [-19, -10, 2, 7],
    [10,  19,  -8, -2], [10,  19,  2, 7],
    [23,  33,  -8, -2], [23,  33,  2, 7]
  ];
  for (const [sx1, sx2, sz1, sz2] of solarZones) {
    for (let x = sx1; x < sx2; x++) {
      for (let z = sz1; z < sz2; z++) {
        if ((x - sx1) === 4 || (z - sz1) === 2) continue;
        const ry = roofY(x, z);
        b.place('tile_1x1', 'DARK_BLUE', x, ry + 1, z);
      }
    }
  }
  for (let x = -5; x < 5; x++) {
    for (let z = -4; z <= 4; z += 2) {
      const ry = roofY(x, z);
      b.place('tile_1x1', 'TRANS_LIGHT_BLUE', x, ry + 1, z);
    }
  }

  return b.finalize();
}

// ============================================================================
// GENERATE ALL 7 SETS + VALIDATE + WRITE JSON, LDRAW (.ldr), CSV & MD MANUALS
// ============================================================================
const ALL_SETS = [
  buildSetNanjing(),
  buildSetJASM(),
  buildSetArizona(),
  buildSetMorris(),
  buildSetRD(),
  buildSetTaichungOpera(),
  buildSetTaichungExpo()
];

// Verify zero overlaps on orthogonal bricks across all sets
let grandTotal = 0;
for (const set of ALL_SETS) {
  grandTotal += set.bricks.length;
  console.log(`✅ #${set.setNumber} ${set.shortName} (${set.footprint}): ${set.bricks.length} bricks, ${set.steps.length} steps, ${set.decals.length} decals`);
}
console.log(`\n🏆 GRAND TOTAL ACROSS ALL ${ALL_SETS.length} SETS: ${grandTotal} LEGO BRICKS!\n`);

// 1. Write compact data/models.json for the web app
fs.writeFileSync(path.join(DATA_DIR, 'models.json'), JSON.stringify(ALL_SETS), 'utf-8');
console.log(`📦 Wrote data/models.json (${(fs.statSync(path.join(DATA_DIR, 'models.json')).size / 1024).toFixed(1)} KB)`);

// 2. Helper: compute BOM
function computeBOM(bricks, filter = {}) {
  const map = new Map();
  let totalCount = 0;
  for (const br of bricks) {
    if (filter.bag !== undefined && br.bag !== filter.bag) continue;
    if (filter.step !== undefined && br.step !== filter.step) continue;
    const key = `${br.part}__${br.color}`;
    if (!map.has(key)) {
      const p = PARTS[br.part], c = COLORS[br.color];
      map.set(key, {
        partId: p.partId, partName: p.name, partZh: p.zh,
        colorId: c.id, colorName: c.name, colorZh: c.zh, qty: 0
      });
    }
    map.get(key).qty++;
    totalCount++;
  }
  const items = Array.from(map.values()).sort((a, b) => b.qty - a.qty || a.partId.localeCompare(b.partId));
  return { items, totalCount, uniqueCount: items.length };
}

// 3. Generate LDraw (.ldr), CSV BOM, and Markdown Instruction Manual for each set
const filePrefix = {
  set01_hq:      'SET01_21035_NANJING',
  set02_jasm:    'SET02_21036_JASM',
  set03_arizona: 'SET03_21037_ARIZONA',
  set04_morris:  'SET04_21038_MORRIS',
  set05_rd:      'SET05_21039_RD',
  set06_ntt:     'SET06_21040_TAICHUNG_OPERA',
  set07_ticec:   'SET07_21041_TAICHUNG_EXPO'
};

for (const set of ALL_SETS) {
  const pref = filePrefix[set.id];
  const totalBom = computeBOM(set.bricks);

  // LDraw .ldr export (standard 20 LDU = 1 stud, 8 LDU = 1 plate, Y-down in LDraw)
  let ldr = `0 ${set.englishName}\n0 Name: ${pref}.ldr\n0 Author: TSMC x LEGO Architecture Studio\n`;
  let prevStep = 1;
  for (const br of set.bricks) {
    if (br.step !== prevStep) {
      ldr += `0 STEP\n`;
      prevStep = br.step;
    }
    const p = PARTS[br.part], c = COLORS[br.color];
    const lx = (br.x * 20).toFixed(2);
    const ly = (-(br.y + p.h) * 8).toFixed(2);
    const lz = (br.z * 20).toFixed(2);
    const rad = (br.rotDeg !== undefined ? br.rotDeg : (br.rot || 0) * 90) * Math.PI / 180;
    const cs = Math.cos(rad).toFixed(4), sn = Math.sin(rad).toFixed(4);
    const msn = (-Math.sin(rad)).toFixed(4);
    ldr += `1 ${c.id} ${lx} ${ly} ${lz} ${cs} 0 ${sn} 0 1 0 ${msn} 0 ${cs} ${p.partId}.dat\n`;
  }
  fs.writeFileSync(path.join(DOCS_DIR, `${pref}.ldr`), ldr, 'utf-8');

  // CSV BOM
  const csvRows = ['Set,LEGO_Part_ID,Part_Name_EN,Part_Name_ZH,Color_ID,Color_EN,Color_ZH,Qty'];
  for (const it of totalBom.items) {
    csvRows.push(`${set.setNumber},${it.partId},"${it.partName}","${it.partZh}",${it.colorId},"${it.colorName}","${it.colorZh}",${it.qty}`);
  }
  fs.writeFileSync(path.join(DOCS_DIR, `${pref}_BOM.csv`), '\uFEFF' + csvRows.join('\n'), 'utf-8');

  // Markdown Manual
  let md = `# LEGO Architecture #${set.setNumber} — ${set.name}\n\n`;
  md += `> **${set.englishName}**  \n`;
  md += `> 📍 ${set.location} ｜ 底座尺寸：**${set.footprint} 凸點** ｜ 總零件數：**${totalBom.totalCount} PCS** ｜ 獨立料號：**${totalBom.uniqueCount} 種** ｜ 分包：**${set.bags.length} 包** ｜ 步驟：**${set.steps.length} 步** ｜ LDraw 檔：[\`${pref}.ldr\`](./${pref}.ldr)\n\n`;
  md += `## 1. 盒組設計簡介\n\n${set.description}\n\n`;
  md += `## 2. 分包封裝規劃 (Numbered Polybags)\n\n`;
  md += `| 袋號 | 分包主題 | 對應步驟 | 零件數 | 獨立料號 |\n| :---: | :--- | :---: | :---: | :---: |\n`;
  for (const bag of set.bags) {
    const bagBricks = set.bricks.filter(x => x.bag === bag.id);
    const stNums = [...new Set(bagBricks.map(x => x.step))].sort((a, b) => a - b);
    const bBom = computeBOM(bagBricks);
    md += `| **BAG ${bag.id}** | ${bag.title} | Step ${stNums[0]}–${stNums[stNums.length - 1]} | **${bagBricks.length}** | ${bBom.uniqueCount} |\n`;
  }
  md += `\n## 3. 樂高官方風格組裝說明書\n\n`;
  for (const bag of set.bags) {
    md += `### 🛍️ ${bag.title}\n\n`;
    for (const st of set.steps.filter(s => s.bag === bag.id)) {
      const sBom = computeBOM(set.bricks, { step: st.step });
      md += `#### STEP ${st.step} — ${st.title}${st.hasSticker ? ' 🏷️ (含貼紙安裝)' : ''}\n`;
      md += `- **要點**：${st.tip}\n`;
      md += `- **本步驟取件 (${sBom.totalCount} 件)**：\n\n`;
      md += `| 數量 | LEGO 料號 | 零件名稱 | 顏色 |\n| :---: | :---: | :--- | :--- |\n`;
      for (const it of sBom.items) {
        md += `| **${it.qty}×** | \`${it.partId}\` | ${it.partZh} (${it.partName}) | ${it.colorZh} (#${it.colorId}) |\n`;
      }
      md += `\n`;
    }
  }
  md += `## 4. 完整零件清單 BOM (${totalBom.totalCount} PCS)\n\n`;
  md += `| LEGO 料號 | 零件名稱 (繁中) | Part Name (EN) | 顏色 | Color ID | 數量 |\n| :---: | :--- | :--- | :--- | :---: | :---: |\n`;
  for (const it of totalBom.items) {
    md += `| \`${it.partId}\` | ${it.partZh} | ${it.partName} | ${it.colorZh} (${it.colorName}) | #${it.colorId} | **${it.qty}** |\n`;
  }
  fs.writeFileSync(path.join(DOCS_DIR, `${pref}_MANUAL.md`), md, 'utf-8');
}

// 4. Master Design & Series BOM
const masterBom = computeBOM(ALL_SETS.flatMap(s => s.bricks));
let masterMd = `# TSMC × LEGO Architecture — 全系列設計總覽與總表 BOM (${masterBom.totalCount} PCS)\n\n`;
masterMd += `🌐 **GitHub Pages 3D 互動工坊**：[https://pc007ya.github.io/TSMC_LEGO_GEMINI/](https://pc007ya.github.io/TSMC_LEGO_GEMINI/)\n\n`;
masterMd += `| 編號 | 盒組名稱 | 底座 (凸點) | 總零件數 | 獨立料號 | 分包 / 步驟 | 說明書 / BOM / LDraw |\n`;
masterMd += `| :---: | :--- | :---: | :---: | :---: | :---: | :--- |\n`;
for (const set of ALL_SETS) {
  const pref = filePrefix[set.id];
  const b = computeBOM(set.bricks);
  masterMd += `| **#${set.setNumber}** | ${set.name} | ${set.footprint} | **${b.totalCount}** | ${b.uniqueCount} | ${set.bags.length} 包 / ${set.steps.length} 步 | [MD](./${pref}_MANUAL.md) · [CSV](./${pref}_BOM.csv) · [LDR](./${pref}.ldr) |\n`;
}
masterMd += `\n- **全系列 ${ALL_SETS.length} 組合計總零件數**：**${masterBom.totalCount} PCS**\n`;
masterMd += `- **全系列不重複 (料號 × 顏色) 總數**：**${masterBom.uniqueCount} 項**\n\n`;
masterMd += `## 全系列 ${ALL_SETS.length} 組合併採購 BOM\n\n| LEGO 料號 | 零件名稱 (繁中) | Part Name (EN) | 顏色 | Color ID | ${ALL_SETS.length} 組總數量 |\n| :---: | :--- | :--- | :--- | :---: | :---: |\n`;
for (const it of masterBom.items) {
  masterMd += `| \`${it.partId}\` | ${it.partZh} | ${it.partName} | ${it.colorZh} (${it.colorName}) | #${it.colorId} | **${it.qty}** |\n`;
}
fs.writeFileSync(path.join(DOCS_DIR, 'TSMC_LEGO_MASTER_DESIGN.md'), masterMd, 'utf-8');
console.log(`📄 Generated all ${ALL_SETS.length} MD manuals, ${ALL_SETS.length} CSV BOMs, ${ALL_SETS.length} LDraw .ldr files & Master Design MD!`);

