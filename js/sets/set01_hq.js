import { place } from '../legoCatalog.js';

function buildBricks() {
  const B = [];
  const add = (part, color, xMin, y, zMin, rot, bag, step) => B.push(place(part, color, xMin, y, zMin, rot, bag, step));

  // =========================================================================
  // BAG 1: 30×20 園區底板、八角生態水池、護欄與景觀綠化 (Steps 1–4)
  // Grid: X = -15..15 (30 studs), Z = -10..10 (20 studs) — faithful to img1.jpg
  // =========================================================================
  // Step 1: Exact-tiled 30 x 20 Baseplate (y = 0)
  // Back 30x16 (Z -10..6): 8+8+8+6 = 30
  add('plate_8x16', 'LIGHT_BLUISH_GRAY', -15, 0, -10, 0, 1, 1); // X -15..-7, Z -10..6
  add('plate_8x16', 'LIGHT_BLUISH_GRAY',  -7, 0, -10, 0, 1, 1); // X -7..1,   Z -10..6
  add('plate_8x16', 'LIGHT_BLUISH_GRAY',   1, 0, -10, 0, 1, 1); // X 1..9,    Z -10..6
  add('plate_6x12', 'LIGHT_BLUISH_GRAY',   9, 0, -10, 0, 1, 1); // X 9..15,   Z -10..2
  add('plate_4x6',  'LIGHT_BLUISH_GRAY',   9, 0,   2, 1, 1, 1); // X 9..15,   Z 2..6
  // Front 30x4 (Z 6..10): 8+8+8+6 = 30
  add('plate_4x8',  'LIGHT_BLUISH_GRAY', -15, 0,   6, 1, 1, 1); // X -15..-7, Z 6..10
  add('plate_4x8',  'LIGHT_BLUISH_GRAY',  -7, 0,   6, 1, 1, 1); // X -7..1,   Z 6..10
  add('plate_4x8',  'LIGHT_BLUISH_GRAY',   1, 0,   6, 1, 1, 1); // X 1..9,    Z 6..10
  add('plate_4x6',  'LIGHT_BLUISH_GRAY',   9, 0,   6, 1, 1, 1); // X 9..15,   Z 6..10

  // Step 2: Large Circular Eco-Pond & Translucent Medium-Blue Water (X -6..3, Z 1..9)
  for (let x = -5; x <= 1; x++) {
    for (let z = 2; z <= 7; z++) {
      if ((x === -5 || x === 1) && (z === 2 || z === 7)) continue; // rounded corners
      if ((x === -2 || x === -1) && (z === 4 || z === 5)) continue; // central lotus island
      if (x === -2 && (z === 2 || z === 3)) continue;               // grey walkway bridge
      add('tile_1x1', 'TRANS_MEDIUM_BLUE', x, 1, z, 0, 1, 2);
    }
  }
  // Curved pond border rim (Light Bluish Gray, 2 plates high)
  const pondRim = [
    [-4, 1], [-3, 1], [-2, 1], [-1, 1], [0, 1],
    [-5, 2], [1, 2],
    [-6, 3], [-6, 4], [-6, 5], [-6, 6],
    [2, 3],  [2, 4],  [2, 5],  [2, 6],
    [-5, 7], [1, 7],
    [-4, 8], [-3, 8], [-2, 8], [-1, 8], [0, 8]
  ];
  for (const [px, pz] of pondRim) {
    add('plate_1x1', 'LIGHT_BLUISH_GRAY', px, 1, pz, 0, 1, 2);
    add('tile_1x1',  'LIGHT_BLUISH_GRAY', px, 2, pz, 0, 1, 2);
  }
  // Central green lotus island & walkway into pond
  add('plate_2x2',  'BRIGHT_GREEN',      -2, 1, 4, 0, 1, 2);
  add('flower_1x1', 'DARK_GREEN',        -2, 2, 4, 0, 1, 2);
  add('flower_1x1', 'BRIGHT_GREEN',      -1, 2, 5, 0, 1, 2);
  add('tile_1x2',   'LIGHT_BLUISH_GRAY', -2, 1, 2, 0, 1, 2);

  // Step 3: Front White Roadside Bollards & Silver Pipe Barriers
  for (let x = -15; x <= -8; x++) {
    add('slope_1x2', 'WHITE', x, 1, 8, 0, 1, 3);
  }
  add('bar_1x4', 'FLAT_SILVER', -7, 1, 9, 1, 1, 3);
  add('bar_1x4', 'FLAT_SILVER', -2, 1, 9, 1, 1, 3);
  add('bar_1x4', 'FLAT_SILVER',  3, 1, 9, 1, 1, 3);

  // Step 4: Dark-Green Triangular Lawns & 5 Slender Trees Around Pond
  add('plate_4x6', 'DARK_GREEN',  4, 1, 4, 1, 1, 4); // X 4..10, Z 4..8
  add('plate_2x4', 'DARK_GREEN', 10, 1, 4, 0, 1, 4);
  add('plate_2x4', 'DARK_GREEN', 13, 1, -2, 0, 1, 4);
  add('plate_2x3', 'DARK_GREEN', -8, 1, 5, 0, 1, 4);
  const trees = [[-7, 4], [3, 6], [3, 2], [2, 8], [11, 3]];
  for (const [tx, tz] of trees) {
    add('round_plate_1x1', 'REDDISH_BROWN', tx, 1, tz, 0, 1, 4);
    add('plant_stem',      'BRIGHT_GREEN',  tx, 2, tz, 0, 1, 4);
  }

  // =========================================================================
  // BAG 2: 左側台積創新館圓頂與階梯花園 (Steps 5–7)
  // =========================================================================
  // Step 5: Dark-Brown Circular Plaza, Blue/Green Terraced Garden & Rear Water Channel
  add('round_plate_4x4', 'DARK_BROWN', -13, 1, -3, 0, 2, 5);
  add('plate_2x6',       'DARK_BROWN', -14, 1,  2, 1, 2, 5);
  add('tile_1x2',        'DARK_BLUE',  -13, 2,  2, 1, 2, 5);
  add('tile_1x2',        'DARK_BLUE',  -10, 2,  2, 1, 2, 5);
  for (const [fx, fz] of [[-14, 3], [-12, 3], [-10, 3], [-9, 3]]) {
    add('flower_1x1', 'BRIGHT_GREEN', fx, 2, fz, 0, 2, 5);
  }
  for (let z = -9; z <= 1; z += 2) {
    add('tile_1x2', 'TRANS_LIGHT_BLUE', -15, 1, z, 0, 2, 5);
  }

  // Step 6: Round Pavilion Core Drum & Dark Recessed Window Band
  add('round_brick_2x2', 'LIGHT_BLUISH_GRAY', -12, 2, -2, 0, 2, 6);
  add('round_plate_2x2', 'DARK_BLUISH_GRAY',  -12, 5, -2, 0, 2, 6);
  add('round_brick_2x2', 'WHITE',             -12, 6, -2, 0, 2, 6);

  // Step 7: Iconic White Saucer Dome Roof
  add('round_plate_4x4', 'WHITE', -13, 9, -3, 0, 2, 7);
  add('dish_4x4',        'WHITE', -13, 10, -3, 0, 2, 7);

  // =========================================================================
  // BAG 3: 中央純白 V 型斜撐懸空長廊與立面 TSMC 紅標 (Steps 8–11)
  // Footprint: X = -6..0 (6 studs wide!), Z = -9..1 (10 studs long!)
  // =========================================================================
  // Step 8: 6 Iconic White V-Support Pillars & Elevated Deck
  for (const pz of [-9, -5, -1]) {
    add('v_pillar_1x2', 'WHITE', -6, 1, pz, 0, 3, 8);
    add('v_pillar_1x2', 'WHITE', -1, 1, pz, 0, 3, 8);
  }
  add('plate_6x8', 'LIGHT_BLUISH_GRAY', -6, 4, -9, 0, 3, 8); // Z -9..-1
  add('plate_2x6', 'LIGHT_BLUISH_GRAY', -6, 4, -1, 1, 3, 8); // Z -1..1

  // Step 9: Long White Main Hall Lower & Upper Body (Y 5..11)
  for (let y = 5; y <= 8; y += 3) {
    for (let x = -6; x < 0; x += 2) {
      add('brick_2x6', 'WHITE', x, y, -9, 0, 3, 9);
      add('brick_2x4', 'WHITE', x, y, -3, 0, 3, 9);
    }
  }

  // Step 10: Front Cantilevered Nose & VERTICAL SNOT 'tsmc' Red Logo!
  add('wall_tsmc_1x2', 'WHITE', -4, 5, 1, 0, 3, 10);
  add('curved_slope_1x2', 'WHITE', -6, 5, 1, 0, 3, 10);
  add('curved_slope_1x2', 'WHITE', -1, 5, 1, 2, 3, 10);

  // Step 11: Sleek Longitudinal Grooved White Roof (6 studs wide x 10 studs long)
  for (let z = -9; z <= -1; z += 2) {
    add('curved_slope_1x2', 'WHITE', -6, 11, z, 0, 3, 11);
    add('tile_grille',      'WHITE', -5, 11, z, 0, 3, 11);
    add('tile_grille',      'WHITE', -4, 11, z, 0, 3, 11);
    add('tile_grille',      'WHITE', -3, 11, z, 0, 3, 11);
    add('tile_grille',      'WHITE', -2, 11, z, 0, 3, 11);
    add('curved_slope_1x2', 'WHITE', -1, 11, z, 2, 3, 11);
  }

  // =========================================================================
  // BAG 4: 右側大型環形白色晶圓廠與高密度屋頂機電管排 (Steps 12–16)
  // Core Sand-Blue Fab: X = 3..11 (8 studs), Z = -8..0 (8 studs)
  // Outer White Segmented Ring: X 2, X 11..12, Z -9, Z 0..1
  // =========================================================================
  // Step 12: Segmented Circular White Outer Ring Wall (16 curved segments)
  for (let x = 3; x <= 9; x += 2) {
    add('brick_1x2',        'WHITE', x, 1,  0, 1, 4, 12);
    add('curved_slope_1x2', 'WHITE', x, 4,  0, 1, 4, 12);
    add('brick_1x2',        'WHITE', x, 1, -9, 1, 4, 12);
    add('curved_slope_1x2', 'WHITE', x, 4, -9, 1, 4, 12);
  }
  for (let z = -8; z <= -2; z += 2) {
    add('brick_1x2',        'WHITE',  2, 1, z, 0, 4, 12);
    add('curved_slope_1x2', 'WHITE',  2, 4, z, 0, 4, 12);
    add('brick_1x2',        'WHITE', 11, 1, z, 0, 4, 12);
    add('curved_slope_1x2', 'WHITE', 11, 4, z, 0, 4, 12);
  }

  // Step 13: Inner Sand-Blue Fab Cleanroom Core (8x8 footprint, Y 1..8)
  for (let x = 3; x < 11; x += 2) {
    add('brick_2x6', 'SAND_BLUE', x, 1, -8, 0, 4, 13);
    add('brick_2x2', 'SAND_BLUE', x, 1, -2, 0, 4, 13);
    add('brick_2x6', 'SAND_BLUE', x, 4, -8, 0, 4, 13);
    add('brick_2x2', 'SAND_BLUE', x, 4, -2, 0, 4, 13);
  }
  add('plate_4x8', 'LIGHT_BLUISH_GRAY', 3, 7, -8, 0, 4, 13);
  add('plate_4x8', 'LIGHT_BLUISH_GRAY', 7, 7, -8, 0, 4, 13);

  // Step 14: Rear-Right Light-Gray Mechanical Service Tower (X 12..14, Z -9..-6)
  for (let y = 1; y <= 10; y += 3) {
    add('brick_2x3', 'LIGHT_BLUISH_GRAY', 12, y, -9, 0, 4, 14);
  }
  add('tile_2x3', 'DARK_BLUISH_GRAY', 12, 13, -9, 0, 4, 14);

  // Step 15: Rooftop White Cleanroom Plenums & Parallel Silver Pipe Racks (Y 8)
  add('tile_2x4', 'WHITE',       3, 8, -7, 1, 4, 15);
  add('tile_2x4', 'WHITE',       3, 8, -4, 1, 4, 15);
  add('tile_2x4', 'WHITE',       3, 8, -2, 1, 4, 15);
  add('bar_1x4',  'FLAT_SILVER', 3, 8, -8, 1, 4, 15);
  add('bar_1x4',  'FLAT_SILVER', 3, 8, -5, 1, 4, 15);
  add('bar_1x4',  'FLAT_SILVER', 7, 8, -8, 1, 4, 15);

  // Step 16: High-Density Rooftop Cooling Fans, Grilles & Exhaust Stacks (Y 8)
  for (const [fx, fz] of [[8, -7], [9, -7], [10, -7], [8, -5], [9, -5], [10, -5]]) {
    add('cooling_fan_1x1', 'FLAT_SILVER', fx, 8, fz, 0, 4, 16);
  }
  add('tile_grille', 'LIGHT_BLUISH_GRAY', 7, 8, -4, 0, 4, 16);
  add('tile_grille', 'LIGHT_BLUISH_GRAY', 8, 8, -4, 0, 4, 16);
  add('tile_grille', 'LIGHT_BLUISH_GRAY', 9, 8, -4, 0, 4, 16);
  add('round_brick_1x1', 'LIGHT_BLUISH_GRAY', 10, 8, -3, 0, 4, 16);
  add('round_brick_1x1', 'LIGHT_BLUISH_GRAY', 10, 8, -1, 0, 4, 16);
  add('round_plate_1x1', 'FLAT_SILVER',       10, 11, -3, 0, 4, 16);
  add('round_plate_1x1', 'FLAT_SILVER',       10, 11, -1, 0, 4, 16);

  return B;
}

export const SET_01_HQ = {
  id: 'set01_hq',
  setNumber: '21035',
  shortName: '新竹總部園區',
  name: '新竹總部與生態池園區',
  englishName: 'TSMC Hsinchu HQ & Fab 12 Campus',
  location: '台灣・新竹科學園區 (Hsinchu, Taiwan)',
  age: '18+',
  year: '2024',
  refImage: 'assets/ref/set01.jpg',
  accentColor: '#1492CF',
  cameraPos: [26, 20, 28],
  cameraTarget: [0, 2.5, 0],
  description: '高密度 30×20 規格重現台積電新竹總部經典地標：包含 6 組 V 型斜撐支撐的 6×10 格柵屋頂純白懸空展覽廳、立面垂直「tsmc」紅標、左側圓頂台積創新館與階梯花圃、前方大型圓弧透海藍生態池，以及右側 16 段環形白色外牆包覆的 8×8 沙藍晶圓廠與高密度冷卻風扇機電屋頂。',
  bags: [
    { id: 1, title: '第 1 包：30×20 底板、生態水池與景觀', subtitle: '30x20 Base, Eco-Pond & Trees', color: '#1492CF' },
    { id: 2, title: '第 2 包：台積創新館圓頂與階梯花園',   subtitle: 'Innovation Pavilion & Garden', color: '#5B7B95' },
    { id: 3, title: '第 3 包：V 型斜撐懸空主廳與 TSMC 標', subtitle: 'V-Pillar Elevated Hall & Logo', color: '#C91A09' },
    { id: 4, title: '第 4 包：大型環形晶圓廠與屋頂機電',   subtitle: 'Curved Fab Ring & Dense MEP', color: '#555C63' }
  ],
  steps: [
    { step: 1,  bag: 1, title: '無縫拼接 30×20 園區基礎底板',     tip: '對齊 9 塊淺藍灰大型薄板構成寬廣的總部園區基地。' },
    { step: 2,  bag: 1, title: '砌築大型圓弧生態池與透海藍水景',   tip: '鋪設 1×1 透海藍光磚水面，以雙層淺灰池岸圍邊並建置中央綠島與步道。' },
    { step: 3,  bag: 1, title: '安裝前排白色路擋與金屬銀管護欄',   tip: '排列 8 組白色斜面路擋與 3 段金屬銀水平管線路擋。' },
    { step: 4,  bag: 1, title: '鋪設深松綠草坪與 5 棵園區喬木',    tip: '配置多塊深松綠綠地，於生態池與草坪周邊立起 5 棵植栽樹苗。' },
    { step: 5,  bag: 2, title: '建立創新館深棕圓盤與藍綠階梯花圃', tip: '放置 4×4 深棕大圓盤、海軍藍花台與左側透水藍景觀水道。' },
    { step: 6,  bag: 2, title: '堆疊圓柱核心筒身與深灰環形窗帶',   tip: '以淺灰、深灰與純白圓柱磚疊出創新館立體結構。' },
    { step: 7,  bag: 2, title: '蓋上 4×4 白色圓弧穹頂',           tip: '扣上白色大圓盤與 4×4 圓弧穹頂蓋，完成創新館外型。' },
    { step: 8,  bag: 3, title: '架設 6 組 V 型斜撐柱與懸空樓板',   tip: '立起 6 組白色 V 型斜撐柱並鋪上 6×10 淺灰懸空底板。' },
    { step: 9,  bag: 3, title: '砌築 6×10 純白主廳牆體',           tip: '雙層堆疊白色標準磚形成修長大氣的中央主廳量體。' },
    { step: 10, bag: 3, title: '安裝立面 tsmc 紅標與流線鼻翼',     tip: '正前方垂直掛載 SNOT「tsmc」紅標，兩側以白色弧形磚收邊。' },
    { step: 11, bag: 3, title: '鋪設 20 片格柵紋理純白弧形屋頂',   tip: '兩側扣上白色弧形磚，中央滿鋪純白散熱格柵光磚重現屋頂細緻溝槽。' },
    { step: 12, bag: 4, title: '圍築 16 段環形白色晶圓廠外牆',     tip: '沿四邊排列 16 組白色牆磚與弧形立面磚，形成標誌性環形外殼。' },
    { step: 13, bag: 4, title: '建置 8×8 沙藍色無塵室核心主體',    tip: '於環牆內部堆疊雙層沙藍色廠房與淺灰屋頂底板。' },
    { step: 14, bag: 4, title: '立起右後方 4 層高淺灰機電塔',      tip: '於右後角疊起 4 層淺灰塔樓並以深灰光磚封頂。' },
    { step: 15, bag: 4, title: '配置屋頂白色空調箱與銀色管排',     tip: '鋪設三組大型白色空調箱與平行金屬銀 4L 管線。' },
    { step: 16, bag: 4, title: '安裝 6 座冷卻風扇、格柵與排氣塔',  tip: '精細裝上 6 座金屬冷卻風扇、散熱格柵與 2 座圓柱排氣塔，總部園區完工！' }
  ],
  bricks: buildBricks()
};
