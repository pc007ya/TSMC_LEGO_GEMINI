import { place, placeAngled } from '../legoCatalog.js';

function buildBricks() {
  const B = [];
  const add = (part, color, xMin, y, zMin, rot, bag, step) => B.push(place(part, color, xMin, y, zMin, rot, bag, step));
  const addAng = (part, color, cx, y, cz, rotDeg, bag, step) => B.push(placeAngled(part, color, cx, y, cz, rotDeg, bag, step));

  // Helper to place a brick in a local rotated coordinate frame (cx, cz, deg)
  const addLocal = (originX, originZ, deg, part, color, lx, y, lz, localRotDeg, bag, step) => {
    const rad = (deg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    // Three.js rotation.y rotates +X toward -Z
    const wx = originX + lx * cos + lz * sin;
    const wz = originZ - lx * sin + lz * cos;
    addAng(part, color, wx, y, wz, deg + localRotDeg, bag, step);
  };

  // =========================================================================
  // BAG 1: 28×22 南京廠區底板、圓角生態水池與園區景觀 (Steps 1–4)
  // Grid: X = -14..14 (28 studs), Z = -11..11 (22 studs)
  // Faithfully matches Front View, Side View & Top View of TSMC Nanjing!
  // =========================================================================
  // Step 1: Exact-tiled 28 x 22 Baseplate (y = 0)
  // Back 28x16 (Z -11..5): 8 + 8 + 8 + 4 = 28
  add('plate_8x16', 'LIGHT_BLUISH_GRAY', -14, 0, -11, 0, 1, 1); // X -14..-6
  add('plate_8x16', 'LIGHT_BLUISH_GRAY',  -6, 0, -11, 0, 1, 1); // X -6..2
  add('plate_8x16', 'LIGHT_BLUISH_GRAY',   2, 0, -11, 0, 1, 1); // X 2..10
  add('plate_4x8',  'LIGHT_BLUISH_GRAY',  10, 0, -11, 0, 1, 1); // X 10..14, Z -11..-3
  add('plate_4x8',  'LIGHT_BLUISH_GRAY',  10, 0,  -3, 0, 1, 1); // X 10..14, Z -3..5
  // Front 28x6 (Z 5..11): 12 + 12 + 4 = 28
  add('plate_6x12', 'LIGHT_BLUISH_GRAY', -14, 0,   5, 1, 1, 1); // X -14..-2, Z 5..11
  add('plate_6x12', 'LIGHT_BLUISH_GRAY',  -2, 0,   5, 1, 1, 1); // X -2..10,  Z 5..11
  add('plate_4x6',  'LIGHT_BLUISH_GRAY',  10, 0,   5, 0, 1, 1); // X 10..14,  Z 5..11

  // Step 2: Rounded-Corner Blue Eco-Pond (Front-Center: X -4..4, Z 2..10)
  for (let x = -3; x <= 2; x++) {
    for (let z = 3; z <= 8; z++) {
      if ((x === -3 || x === 2) && (z === 3 || z === 8)) continue;
      if ((x === -1 || x === 0) && (z === 5 || z === 6)) continue; // central green island
      if (x === -1 && (z === 3 || z === 4)) continue;              // grey walkway
      add('tile_1x1', 'TRANS_MEDIUM_BLUE', x, 1, z, 0, 1, 2);
    }
  }
  const pondRim = [
    [-2, 2], [-1, 2], [0, 2], [1, 2],
    [-3, 3], [2, 3],
    [-4, 4], [-4, 5], [-4, 6], [-4, 7],
    [3, 4],  [3, 5],  [3, 6],  [3, 7],
    [-3, 8], [2, 8],
    [-2, 9], [-1, 9], [0, 9], [1, 9]
  ];
  for (const [px, pz] of pondRim) {
    add('plate_1x1', 'LIGHT_BLUISH_GRAY', px, 1, pz, 0, 1, 2);
    add('tile_1x1',  'LIGHT_BLUISH_GRAY', px, 2, pz, 0, 1, 2);
  }
  add('plate_2x2',  'BRIGHT_GREEN',      -1, 1, 5, 0, 1, 2);
  add('flower_1x1', 'DARK_GREEN',        -1, 2, 5, 0, 1, 2);
  add('flower_1x1', 'BRIGHT_GREEN',       0, 2, 6, 0, 1, 2);
  add('tile_1x2',   'LIGHT_BLUISH_GRAY', -1, 1, 3, 0, 1, 2);

  // Step 3: Front White Alternating Roadside Bollards & Silver Pipe Barriers (matches Front View!)
  for (let x = -14; x <= -6; x += 2) {
    add('brick_1x1', 'WHITE', x, 1, 10, 0, 1, 3);
    add('plate_1x1', 'DARK_GREEN', x + 1, 1, 10, 0, 1, 3);
  }
  add('bar_1x4', 'FLAT_SILVER', -4, 1, 10, 1, 1, 3);
  add('bar_1x4', 'FLAT_SILVER',  1, 1, 10, 1, 1, 3);
  add('bar_1x4', 'FLAT_SILVER',  6, 1, 10, 1, 1, 3);

  // Step 4: Dark-Green Campus Lawns, Brown Terraced Garden & 6 Slender Trees
  add('plate_4x6', 'DARK_GREEN',  5, 1, 5, 1, 1, 4); // X 5..11, Z 5..9
  add('plate_2x4', 'DARK_GREEN', 11, 1, 5, 0, 1, 4);
  add('plate_2x4', 'DARK_GREEN', 12, 1, -2, 0, 1, 4);
  // Brown terraced plaza on back-left (visible in Top View!)
  add('plate_4x4', 'REDDISH_BROWN', -14, 1, -11, 0, 1, 4);
  const trees = [[-5, 6], [4, 7], [4, 3], [8, 9], [10, 9], [12, 4]];
  for (const [tx, tz] of trees) {
    add('round_plate_1x1', 'REDDISH_BROWN', tx, 1, tz, 0, 1, 4);
    add('plant_stem',      'BRIGHT_GREEN',  tx, 2, tz, 0, 1, 4);
  }

  // =========================================================================
  // BAG 2: 左側圓頂建築 (Saucer Pavilion) 與藍綠花園水渠 (Steps 5–7)
  // =========================================================================
  // Step 5: Dark-Brown Circular Plaza, Blue/Green Terraced Garden & Rear Water Channel
  add('round_plate_4x4', 'DARK_BROWN', -12, 1, -1, 0, 2, 5);
  add('plate_2x6',       'DARK_BROWN', -13, 1,  4, 1, 2, 5);
  add('tile_1x2',        'DARK_BLUE',  -12, 2,  4, 1, 2, 5);
  add('tile_1x2',        'DARK_BLUE',   -9, 2,  4, 1, 2, 5);
  for (const [fx, fz] of [[-13, 5], [-11, 5], [-9, 5], [-8, 5]]) {
    add('flower_1x1', 'BRIGHT_GREEN', fx, 2, fz, 0, 2, 5);
  }
  for (let z = -7; z <= 3; z += 2) {
    add('tile_1x2', 'TRANS_LIGHT_BLUE', -14, 1, z, 0, 2, 5);
  }

  // Step 6: Round Pavilion Core Drum & Dark Recessed Window Band
  add('round_brick_2x2', 'LIGHT_BLUISH_GRAY', -11, 2, 0, 0, 2, 6);
  add('round_plate_2x2', 'DARK_BLUISH_GRAY',  -11, 5, 0, 0, 2, 6);
  add('round_brick_2x2', 'WHITE',             -11, 6, 0, 0, 2, 6);

  // Step 7: Iconic White Saucer Dome Roof
  add('round_plate_4x4', 'WHITE', -12, 9, -1, 0, 2, 7);
  add('dish_4x4',        'WHITE', -12, 10, -1, 0, 2, 7);

  // =========================================================================
  // BAG 3: 45° 斜角懸挑純白膠囊主廳 (Cantilevered Overhanging Capsule Hall!) (Steps 8–11)
  // Matches Front View, Side View & Top View: 45° diagonal extending past back-left edge!
  // Origin: (-6.0, -4.5), angle = -45° (front nose points toward +X/+Z eco-pond, tail cantilevers out past -X/-Z!)
  // =========================================================================
  const hOx = -6.2, hOz = -3.8, hDeg = 42;

  // Step 8: Angled White V-Support Pillars Under the Diagonal Hall
  for (const lz of [-2.5, 1.5, 5.0]) {
    addLocal(hOx, hOz, hDeg, 'v_pillar_1x2', 'WHITE', -1.8, 1, lz, 0, 3, 8);
    addLocal(hOx, hOz, hDeg, 'v_pillar_1x2', 'WHITE',  1.8, 1, lz, 0, 3, 8);
  }

  // Step 9: Diagonal Elevated Capsule Hall Floor & Lower Curved Shell (extends out past edge!)
  for (let lz = -9; lz <= 5; lz += 2) {
    addLocal(hOx, hOz, hDeg, 'brick_2x2', 'WHITE', -1.0, 5, lz, 0, 3, 9);
    addLocal(hOx, hOz, hDeg, 'brick_2x2', 'WHITE',  1.0, 5, lz, 0, 3, 9);
  }

  // Step 10: Upper Capsule Body & VERTICAL SNOT 'tsmc' Red Logo on Front Nose!
  for (let lz = -9; lz <= 5; lz += 2) {
    addLocal(hOx, hOz, hDeg, 'brick_2x2', 'WHITE', -1.0, 8, lz, 0, 3, 10);
    addLocal(hOx, hOz, hDeg, 'brick_2x2', 'WHITE',  1.0, 8, lz, 0, 3, 10);
  }
  // Vertical red 'tsmc' logo on the front nose facing the viewer (+Z local)!
  addLocal(hOx, hOz, hDeg, 'wall_tsmc_1x2', 'WHITE', 0, 6, 6.5, 0, 3, 10);

  // Step 11: Sleek Longitudinal Grooved White Capsule Roof (16 studs long, overhanging!)
  for (let lz = -9; lz <= 5; lz += 2) {
    addLocal(hOx, hOz, hDeg, 'curved_slope_1x2', 'WHITE', -2.0, 11, lz, 0,   3, 11);
    addLocal(hOx, hOz, hDeg, 'tile_grille',      'WHITE', -1.0, 11, lz, 0,   3, 11);
    addLocal(hOx, hOz, hDeg, 'tile_grille',      'WHITE',  0.0, 11, lz, 0,   3, 11);
    addLocal(hOx, hOz, hDeg, 'tile_grille',      'WHITE',  1.0, 11, lz, 0,   3, 11);
    addLocal(hOx, hOz, hDeg, 'curved_slope_1x2', 'WHITE',  2.0, 11, lz, 180, 3, 11);
  }

  // =========================================================================
  // BAG 4: 右側真圓 16 段白色環牆 + 內部 45° 菱形沙藍晶圓廠與精密屋頂 (Steps 12–16)
  // Matches Top View: True circular ring wall enclosing a 45°-rotated Sand-Blue Fab!
  // Center: (fOx = 6.2, fOz = -3.2)
  // =========================================================================
  const fOx = 6.2, fOz = -3.2;

  // Step 12: True 16-Segment Circular White Outer Ring Wall (radius = 6.2 studs!)
  const ringCount = 16;
  const ringR = 6.2;
  for (let i = 0; i < ringCount; i++) {
    const theta = (i * 2 * Math.PI) / ringCount;
    const deg = -(theta * 180) / Math.PI;
    const rx = fOx + Math.cos(theta) * ringR;
    const rz = fOz + Math.sin(theta) * ringR;
    addAng('brick_1x2',        'WHITE', rx, 1, rz, deg, 4, 12);
    addAng('brick_1x2',        'WHITE', rx, 4, rz, deg, 4, 12);
    addAng('curved_slope_1x2', 'WHITE', rx, 7, rz, deg, 4, 12);
  }

  // Step 13: Inner 45°-Rotated Diamond Sand-Blue Fab Cleanroom Core (7x7 local)
  const fDeg = 45;
  for (let lx = -3; lx <= 3; lx += 2) {
    for (let lz = -3; lz <= 3; lz += 2) {
      addLocal(fOx, fOz, fDeg, 'brick_2x2', 'SAND_BLUE', lx, 1, lz, 0, 4, 13);
      addLocal(fOx, fOz, fDeg, 'brick_2x2', 'SAND_BLUE', lx, 4, lz, 0, 4, 13);
      addLocal(fOx, fOz, fDeg, 'brick_2x2', 'SAND_BLUE', lx, 7, lz, 0, 4, 13);
    }
  }
  addLocal(fOx, fOz, fDeg, 'plate_4x8', 'LIGHT_BLUISH_GRAY', -2, 10, 0, 0, 4, 13);
  addLocal(fOx, fOz, fDeg, 'plate_4x8', 'LIGHT_BLUISH_GRAY',  2, 10, 0, 0, 4, 13);

  // Step 14: Rear-Right Light-Gray Mechanical Service Tower (X 11..13, Z -10..-7)
  for (let y = 1; y <= 10; y += 3) {
    add('brick_2x3', 'LIGHT_BLUISH_GRAY', 11, y, -10, 0, 4, 14);
  }
  add('tile_2x3', 'DARK_BLUISH_GRAY', 11, 13, -10, 0, 4, 14);

  // Step 15: 45°-Aligned White Cleanroom Plenums & Silver MEP Pipe Racks on Fab Roof (Y 11)
  addLocal(fOx, fOz, fDeg, 'tile_2x4', 'WHITE',       -1.5, 11, -1.5, 90, 4, 15);
  addLocal(fOx, fOz, fDeg, 'tile_2x4', 'WHITE',       -1.5, 11,  1.5, 90, 4, 15);
  addLocal(fOx, fOz, fDeg, 'bar_1x4',  'FLAT_SILVER', -1.5, 11,  0.0, 90, 4, 15);
  addLocal(fOx, fOz, fDeg, 'bar_1x4',  'FLAT_SILVER', -1.5, 11, -3.2, 90, 4, 15);
  addLocal(fOx, fOz, fDeg, 'bar_1x4',  'FLAT_SILVER', -1.5, 11,  3.2, 90, 4, 15);

  // Step 16: 45°-Aligned Rooftop Cooling Fans, Grilles & Exhaust Stacks (Y 11)
  for (const [lx, lz] of [[2.2, -2.5], [2.2, -1.0], [2.2, 0.5], [2.2, 2.0]]) {
    addLocal(fOx, fOz, fDeg, 'cooling_fan_1x1', 'FLAT_SILVER', lx, 11, lz, 0, 4, 16);
  }
  addLocal(fOx, fOz, fDeg, 'tile_grille', 'LIGHT_BLUISH_GRAY', 1.0, 11, -2.0, 0, 4, 16);
  addLocal(fOx, fOz, fDeg, 'tile_grille', 'LIGHT_BLUISH_GRAY', 1.0, 11,  1.0, 0, 4, 16);
  addLocal(fOx, fOz, fDeg, 'round_brick_1x1', 'LIGHT_BLUISH_GRAY', 3.2, 11, -1.5, 0, 4, 16);
  addLocal(fOx, fOz, fDeg, 'round_brick_1x1', 'LIGHT_BLUISH_GRAY', 3.2, 11,  1.5, 0, 4, 16);

  return B;
}

export const SET_01_HQ = {
  id: 'set01_hq',
  setNumber: '21035',
  shortName: '台積電南京廠',
  name: '台積電南京廠 (Fab 16)',
  englishName: 'TSMC Nanjing Company Limited',
  location: '南京・浦口經濟開發區 (Nanjing, China)',
  age: '18+',
  year: '2024',
  refImage: 'assets/ref/set01.jpg',
  accentColor: '#1492CF',
  cameraPos: [25, 19, 27],
  cameraTarget: [0, 2.6, 0],
  description: '精準依據多視角（正視、側視、俯視圖）還原台積電南京廠 (TSMC Nanjing Company Limited) 經典幾何建築：包含 45° 斜角懸挑伸出底板外的純白膠囊展覽廳與立面 tsmc 紅標、16 段真圓弧形白牆包覆 45° 菱形沙藍晶圓廠、左側圓盤飛碟館、前方圓角透海藍生態水池與園區綠化。',
  bags: [
    { id: 1, title: '第 1 包：28×22 底板、生態水池與景觀',     subtitle: '28x22 Base, Eco-Pond & Trees', color: '#1492CF' },
    { id: 2, title: '第 2 包：左側飛碟圓頂館與藍綠階梯花園',   subtitle: 'Saucer Pavilion & Garden', color: '#5B7B95' },
    { id: 3, title: '第 3 包：45° 斜角懸挑純白膠囊主廳',       subtitle: '45° Cantilevered Capsule Hall', color: '#C91A09' },
    { id: 4, title: '第 4 包：真圓 16 段白牆與 45° 沙藍晶圓廠', subtitle: 'Circular Ring & 45° Diamond Fab', color: '#555C63' }
  ],
  steps: [
    { step: 1,  bag: 1, title: '無縫拼接 28×22 南京廠區基礎底板',     tip: '對齊淺藍灰大型薄板構成寬廣的園區展示基地。' },
    { step: 2,  bag: 1, title: '砌築圓角生態水池與透海藍水景',         tip: '鋪設 1×1 透海藍光磚水面，以雙層淺灰池岸圍邊並建置中央綠島與步道。' },
    { step: 3,  bag: 1, title: '安裝前排白綠交錯路擋與金屬銀管護欄',   tip: '依正視圖還原左下白綠交錯方柱路擋與右側三段銀管護欄。' },
    { step: 4,  bag: 1, title: '鋪設深松綠草坪、紅棕台地與 6 棵喬木',  tip: '配置園區綠地、後左角紅棕廣場與 6 棵園藝樹苗。' },
    { step: 5,  bag: 2, title: '建立圓頂館深棕圓盤與藍綠階梯花圃',     tip: '放置 4×4 深棕大圓盤、海軍藍花台與左側透水藍景觀水道。' },
    { step: 6,  bag: 2, title: '堆疊圓柱核心筒身與深灰環形窗帶',       tip: '以淺灰、深灰與純白圓柱磚疊出飛碟館筒身結構。' },
    { step: 7,  bag: 2, title: '蓋上 4×4 白色圓弧穹頂',               tip: '扣上白色大圓盤與 4×4 圓弧穹頂蓋，完成飛碟館流線造型。' },
    { step: 8,  bag: 3, title: '架設 45° 斜角排列的 6 組 V 型斜撐柱', tip: '依俯視圖 45° 斜角軸線立起 6 組白色 V 型斜撐柱。' },
    { step: 9,  bag: 3, title: '砌築懸挑伸出底板外的膠囊主廳下層',     tip: '沿 45° 斜軸組裝純白主廳下層，尾端如原圖大膽懸挑出底板邊緣！' },
    { step: 10, bag: 3, title: '疊加上層主廳與立面 tsmc 紅標',         tip: '完成主廳上層牆體，於正前方圓弧鼻端垂直掛載「tsmc」紅標。' },
    { step: 11, bag: 3, title: '覆蓋 16 格長格柵紋理純白膠囊屋頂',     tip: '兩側扣上白色弧形磚、中央滿鋪白色格柵光磚，重現原圖經典條紋。' },
    { step: 12, bag: 4, title: '圍築 16 段真圓弧形白色外牆',           tip: '以每 22.5° 排列 16 組白色圓弧外牆段，圍成真正圓形廠房外殼！' },
    { step: 13, bag: 4, title: '建置內部 45° 菱形沙藍晶圓廠核心',      tip: '依俯視圖於圓牆內部以 45° 菱形角度堆疊三層沙藍無塵室主體。' },
    { step: 14, bag: 4, title: '立起右後方 4 層高淺灰機電服務塔',      tip: '於右後角疊起 4 層淺灰塔樓並以深灰光磚封頂。' },
    { step: 15, bag: 4, title: '配置 45° 對齊之屋頂空調箱與銀管排',    tip: '沿菱形晶圓廠屋頂鋪設白色空調箱與三道平行金屬銀管線。' },
    { step: 16, bag: 4, title: '安裝屋頂冷卻風扇、格柵與排氣塔完工',   tip: '裝上 4 座金屬冷卻風扇、散熱格柵與 2 座圓柱排氣塔，南京廠完美落成！' }
  ],
  bricks: buildBricks()
};
