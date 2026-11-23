import { place } from '../legoCatalog.js';

function buildBricks() {
  const B = [];
  const add = (part, color, xMin, y, zMin, rot, bag, step) => B.push(place(part, color, xMin, y, zMin, rot, bag, step));

  // =========================================================================
  // BAG 1: 32×18 熊本廠區底板、雙排立體綠籬與員工停車場 (Steps 1–4)
  // Grid: X = -16..16 (32 studs), Z = -9..9 (18 studs) — faithful to img2.jpg
  // =========================================================================
  // Step 1: Exact-tiled 32 x 18 Baseplate (y = 0)
  // Back 32x16 (Z -9..7): four 8x16 plates!
  add('plate_8x16', 'LIGHT_BLUISH_GRAY', -16, 0, -9, 0, 1, 1);
  add('plate_8x16', 'LIGHT_BLUISH_GRAY',  -8, 0, -9, 0, 1, 1);
  add('plate_8x16', 'LIGHT_BLUISH_GRAY',   0, 0, -9, 0, 1, 1);
  add('plate_8x16', 'LIGHT_BLUISH_GRAY',   8, 0, -9, 0, 1, 1);
  // Front 32x2 strip (Z 7..9): four 2x8 plates!
  add('plate_2x8',  'LIGHT_BLUISH_GRAY', -16, 0,  7, 1, 1, 1);
  add('plate_2x8',  'LIGHT_BLUISH_GRAY',  -8, 0,  7, 1, 1, 1);
  add('plate_2x8',  'LIGHT_BLUISH_GRAY',   0, 0,  7, 1, 1, 1);
  add('plate_2x8',  'LIGHT_BLUISH_GRAY',   8, 0,  7, 1, 1, 1);

  // Step 2: Smooth Front Driveway Plaza Tiles (y = 1, Z 4..6)
  for (let x = -16; x < 12; x += 4) {
    add('tile_2x4', 'LIGHT_BLUISH_GRAY', x, 1, 4, 1, 1, 2);
  }

  // Step 3: Twin Long Front Bright-Green Lawns & 28 Dense Shrub Clusters (Z 6..9)
  add('plate_2x8', 'BRIGHT_GREEN', -16, 1, 6, 1, 1, 3); // X -16..-8
  add('plate_2x8', 'BRIGHT_GREEN',  -8, 1, 6, 1, 1, 3); // X -8..0
  add('plate_2x8', 'BRIGHT_GREEN',   4, 1, 6, 1, 1, 3); // X 4..12
  for (let x = -16; x < 0; x += 2) {
    add('flower_1x1', 'BRIGHT_GREEN', x,     2, 6, 0, 1, 3);
    add('flower_1x1', 'DARK_GREEN',   x + 1, 2, 7, 0, 1, 3);
  }
  for (let x = 4; x < 12; x += 2) {
    add('flower_1x1', 'BRIGHT_GREEN', x,     2, 6, 0, 1, 3);
    add('flower_1x1', 'DARK_GREEN',   x + 1, 2, 7, 0, 1, 3);
  }

  // Step 4: Far-Right Staff Parking Lot & 6 Micro Cars (X 12..16, Z -7..7)
  add('plate_4x8', 'DARK_BLUISH_GRAY', 12, 1, -7, 0, 1, 4); // Z -7..1
  add('plate_4x6', 'DARK_BLUISH_GRAY', 12, 1,  1, 0, 1, 4); // Z 1..7
  const cars = [
    [13, -6, 'BLACK'], [13, -4, 'WHITE'], [13, -2, 'RED'],
    [13,  0, 'BLUE'],  [13,  2, 'RED'],   [13,  4, 'WHITE']
  ];
  for (const [cx, cz, col] of cars) {
    add('plate_1x2', col, cx, 2, cz, 1, 1, 4);
  }

  // =========================================================================
  // BAG 2: 左側氣體供應站、3 支氣槽與 12×8 主晶圓廠肋條立面 (Steps 5–8)
  // =========================================================================
  // Step 5: Left White Utility Annex (X -16..-12, Z -8..0) & 3 White Gas Storage Tanks
  for (let y = 1; y <= 4; y += 3) {
    add('brick_2x6', 'WHITE', -16, y, -8, 0, 2, 5);
    add('brick_2x6', 'WHITE', -14, y, -8, 0, 2, 5);
    add('brick_2x2', 'WHITE', -16, y, -2, 0, 2, 5);
    add('brick_2x2', 'WHITE', -14, y, -2, 0, 2, 5);
  }
  add('plate_4x8',   'WHITE',            -16, 7, -8, 0, 2, 5);
  add('tile_grille', 'DARK_BLUISH_GRAY', -15, 8, -7, 1, 2, 5);
  add('tile_grille', 'DARK_BLUISH_GRAY', -15, 8, -4, 1, 2, 5);
  add('tile_grille', 'DARK_BLUISH_GRAY', -15, 8, -1, 1, 2, 5);
  // 3 tall white gas storage tanks in front (Z 0..1)
  for (const gx of [-16, -15, -14]) {
    add('round_brick_1x1', 'WHITE',             gx, 1, 0, 0, 2, 5);
    add('round_brick_1x1', 'WHITE',             gx, 4, 0, 0, 2, 5);
    add('round_plate_1x1', 'LIGHT_BLUISH_GRAY', gx, 7, 0, 0, 2, 5);
  }

  // Step 6: Main Fab Core Lower & Upper Walls (X -11..1, Z -8..0 -> 12x8 footprint!)
  for (let x = -11; x < 1; x += 2) {
    add('brick_2x6', 'DARK_BLUISH_GRAY', x, 1, -8, 0, 2, 6);
    add('brick_2x2', 'DARK_BLUISH_GRAY', x, 1, -2, 0, 2, 6);
    add('brick_2x6', 'WHITE',            x, 4, -8, 0, 2, 6);
    add('brick_2x2', 'WHITE',            x, 4, -2, 0, 2, 6);
  }

  // Step 7: Main Fab Upper White Cladding & 12x8 Light-Gray Roof Deck
  for (let x = -11; x < 1; x += 2) {
    add('brick_2x6', 'WHITE', x, 7, -8, 0, 2, 7);
    add('brick_2x2', 'WHITE', x, 7, -2, 0, 2, 7);
  }
  add('plate_6x8', 'LIGHT_BLUISH_GRAY', -11, 10, -8, 0, 2, 7); // X -11..-5, Z -8..0
  add('plate_6x8', 'LIGHT_BLUISH_GRAY',  -5, 10, -8, 0, 2, 7); // X -5..1,   Z -8..0

  // Step 8: 6 Iconic Vertical Light-Gray Structural Pilasters Along Front Facade (Z 0..1)
  for (let x = -11; x <= -1; x += 2) {
    add('brick_1x1x2', 'LIGHT_BLUISH_GRAY', x, 1, 0, 0, 2, 8);
    add('brick_1x1',   'LIGHT_BLUISH_GRAY', x, 7, 0, 0, 2, 8);
    add('tile_1x1',    'LIGHT_BLUISH_GRAY', x, 10, 0, 0, 2, 8);
  }

  // =========================================================================
  // BAG 3: 屋頂超高密度金銀製程管排、空調箱與洗滌塔陣列 (Steps 9–12)
  // Roof: X -11..1, Z -8..0, Y = 11
  // =========================================================================
  // Step 9: White Cleanroom Plenum Roof Boxes & Perimeter Trim
  add('tile_2x4', 'WHITE', -7, 11, -4, 1, 3, 9);
  add('tile_2x4', 'WHITE', -3, 11, -4, 1, 3, 9);
  add('tile_2x4', 'WHITE', -7, 11, -7, 1, 3, 9);
  add('tile_2x4', 'WHITE', -3, 11, -7, 1, 3, 9);

  // Step 10: Dual Parallel Pearl-Gold & Flat-Silver MEP Pipe Racks
  add('bar_1x4', 'PEARL_GOLD',  -7, 11, -5, 1, 3, 10);
  add('bar_1x4', 'PEARL_GOLD',  -3, 11, -5, 1, 3, 10);
  add('bar_1x4', 'FLAT_SILVER', -7, 11, -2, 1, 3, 10);
  add('bar_1x4', 'FLAT_SILVER', -3, 11, -2, 1, 3, 10);
  add('bar_1x4', 'FLAT_SILVER', -7, 11, -8, 1, 3, 10);
  add('bar_1x4', 'FLAT_SILVER', -3, 11, -8, 1, 3, 10);

  // Step 11: 8 Tan & Silver Cylindrical Scrubber Stacks (X -11..-8)
  const stacks = [
    [-11, -2], [-10, -2], [-9, -2],
    [-11, -4], [-10, -4], [-9, -4],
    [-11, -6], [-10, -6]
  ];
  for (const [sx, sz] of stacks) {
    add('round_brick_1x1', 'TAN',         sx, 11, sz, 0, 3, 11);
    add('round_plate_1x1', 'FLAT_SILVER', sx, 14, sz, 0, 3, 11);
  }

  // Step 12: Exhaust Chimneys & Rooftop Cooling Fans
  add('cone_1x1',        'DARK_BLUISH_GRAY', -11, 11, -8, 0, 3, 12);
  add('cone_1x1',        'DARK_BLUISH_GRAY', -10, 11, -8, 0, 3, 12);
  add('cone_1x1',        'DARK_BLUISH_GRAY',  -9, 11, -8, 0, 3, 12);
  add('cooling_fan_1x1', 'FLAT_SILVER',       -9, 11, -6, 0, 3, 12);
  add('cooling_fan_1x1', 'FLAT_SILVER',       -8, 11, -6, 0, 3, 12);
  add('cooling_fan_1x1', 'FLAT_SILVER',       -8, 11, -3, 0, 3, 12);

  // =========================================================================
  // BAG 4: JASM 立面門廳與六層透亮水藍玻璃辦公大樓 (Steps 13–16)
  // =========================================================================
  // Step 13: Protruding JASM Entrance Wing, Canopy & VERTICAL SNOT 'Jasm' Logo (X 1..4, Z -2..2)
  add('brick_2x3',     'DARK_BLUISH_GRAY', 1, 1, -2, 0, 4, 13);
  add('plate_2x3',     'WHITE',            1, 4, -2, 0, 4, 13);
  add('brick_2x3',     'WHITE',            1, 5, -2, 0, 4, 13);
  add('tile_2x3',      'WHITE',            1, 8, -2, 0, 4, 13);
  add('plate_1x2',     'WHITE',            1, 4,  1, 1, 4, 13);
  add('wall_jasm_1x2', 'WHITE',            1, 5,  1, 0, 4, 13); // Vertical 'Jasm' facing +Z!

  // Step 14: Lower 3 Stories of Glowing Trans-Light-Blue Glass Office Tower (X 4..11, Z -5..3 -> 7x8? Use 6x8: X 5..11, Z -5..3!)
  for (let floor = 0; floor < 3; floor++) {
    const fy = 1 + floor * 2;
    add('plate_6x8', 'TRANS_LIGHT_BLUE', 5, fy,     -5, 0, 4, 14);
    add('plate_6x8', 'WHITE',            5, fy + 1, -5, 0, 4, 14);
  }

  // Step 15: Upper 3 Stories of Glass Office Tower (6 stories total — matches img2.jpg!)
  for (let floor = 3; floor < 6; floor++) {
    const fy = 1 + floor * 2;
    add('plate_6x8', 'TRANS_LIGHT_BLUE', 5, fy,     -5, 0, 4, 15);
    add('plate_6x8', 'WHITE',            5, fy + 1, -5, 0, 4, 15);
  }

  // Step 16: White Roof Parapet & Multi-Row Dark-Gray Slatted Mechanical Penthouse (Y 13)
  add('brick_1x8' === 'x' ? 'brick_1x6' : 'brick_1x6', 'WHITE', 5, 13, -5, 0, 4, 16);
  add('brick_1x2', 'WHITE', 5, 13,  1, 0, 4, 16);
  add('brick_1x6', 'WHITE', 10, 13, -5, 0, 4, 16);
  add('brick_1x2', 'WHITE', 10, 13,  1, 0, 4, 16);
  for (let z = -5; z <= 1; z += 2) {
    add('tile_grille', 'DARK_BLUISH_GRAY', 6, 13, z, 0, 4, 16);
    add('tile_grille', 'DARK_BLUISH_GRAY', 7, 13, z, 0, 4, 16);
    add('tile_grille', 'DARK_BLUISH_GRAY', 8, 13, z, 0, 4, 16);
    add('tile_grille', 'DARK_BLUISH_GRAY', 9, 13, z, 0, 4, 16);
  }

  return B;
}

export const SET_02_JASM = {
  id: 'set02_jasm',
  setNumber: '21036',
  shortName: 'JASM 熊本廠',
  name: 'JASM 熊本一廠',
  englishName: 'TSMC JASM Kumamoto Fab, Japan',
  location: '日本・熊本縣菊陽町 (Kumamoto, Japan)',
  age: '18+',
  year: '2024',
  refImage: 'assets/ref/set02.jpg',
  accentColor: '#1D8F44',
  cameraPos: [27, 19, 28],
  cameraTarget: [0, 3.0, 0],
  description: '高密度 32×18 規格完整還原台積電日本 JASM 熊本一廠！具備 28 組雙色立體綠籬、右側 6 輛微縮員工車停車場、左側 3 支雙層高純度氣體槽、6 根垂直灰柱韻律的 12×8 純白主廠房、6 道金銀雙排屋頂管線與 8 座圓柱洗滌塔、立面垂直「Jasm」印刷門廳，以及 6 層透亮水藍玻璃帷幕辦公大樓與 16 組格柵機房。',
  bags: [
    { id: 1, title: '第 1 包：32×18 底板、雙排綠籬與停車場', subtitle: '32x18 Base, Hedges & 6-Car Lot', color: '#1D8F44' },
    { id: 2, title: '第 2 包：氣體站、主廠房與 6 根結構柱', subtitle: 'Gas Annex & 12x8 Ribbed Fab', color: '#A8AEB4' },
    { id: 3, title: '第 3 包：屋頂雙排金銀管線與 8 座洗滌塔', subtitle: 'Dense Gold/Silver MEP & Stacks', color: '#C8A35A' },
    { id: 4, title: '第 4 包：JASM 立面門廳與 6 層玻璃大樓', subtitle: 'JASM Entrance & 6-Story Tower', color: '#3AC5ED' }
  ],
  steps: [
    { step: 1,  bag: 1, title: '拼接 32×18 熊本廠區淺灰底板',       tip: '無縫對齊四塊 8×16 與四塊 2×8 淺藍灰薄板。' },
    { step: 2,  bag: 1, title: '鋪設前排廠區平滑車道光磚',         tip: '沿前庭道路鋪上 7 塊 2×4 淺藍灰平滑光磚。' },
    { step: 3,  bag: 1, title: '種植雙段鮮綠草坪與 24 組雙色灌木', tip: '安裝鮮綠薄板並交錯扣上鮮綠與深松綠花葉片，還原原圖密集綠帶。' },
    { step: 4,  bag: 1, title: '打造右側員工停車場與 6 輛微縮汽車', tip: '鋪設深灰柏油停車場並停放 6 輛紅、藍、白、黑微型車。' },
    { step: 5,  bag: 2, title: '建立左側氣體供應站與 3 支雙層氣槽', tip: '砌起左側白色附屬廠房與 3 支雙層高白色圓柱氣體儲槽。' },
    { step: 6,  bag: 2, title: '堆疊 12×8 主晶圓廠下半部牆體',     tip: '以深藍灰為底、純白磚為中層建立寬廣的無塵室主體。' },
    { step: 7,  bag: 2, title: '完成主廠房上層純白牆體與屋頂板',   tip: '疊上第三層純白磚並精準覆蓋兩塊 6×8 淺灰屋頂板（零穿插）。' },
    { step: 8,  bag: 2, title: '鑲嵌正面 6 根垂直淺灰結構柱',      tip: '沿正面牆等距立起 6 根淺灰高柱並以光磚封頂。' },
    { step: 9,  bag: 3, title: '配置屋頂 4 組大型白色空調箱',      tip: '於屋頂中央整齊排列 4 塊 2×4 白色空調箱光磚。' },
    { step: 10, bag: 3, title: '架設 6 段珍珠金與金屬銀雙排管線',  tip: '平行佈設珍珠金與金屬銀 4L 管線圓桿，重現高密度廠務管排。' },
    { step: 11, bag: 3, title: '安裝 8 座沙漠米與銀蓋圓柱洗滌塔',  tip: '在左方屋頂整齊排列 8 座圓柱洗滌塔。' },
    { step: 12, bag: 3, title: '加裝 3 支排氣煙囪與 3 座冷卻風扇', tip: '於後方屋頂補上深灰錐形排氣管與金屬冷卻風扇。' },
    { step: 13, bag: 4, title: '建構 JASM 入口門廳與立面印刷標誌', tip: '安裝白色懸挑雨遮，正面垂直掛載 SNOT「Jasm」印刷光磚。' },
    { step: 14, bag: 4, title: '層疊玻璃辦公大樓 1–3 樓',          tip: '交替堆疊 6×8 透亮水藍與純白薄板打造通透帷幕。' },
    { step: 15, bag: 4, title: '層疊玻璃辦公大樓 4–6 樓',          tip: '繼續疊高至 6 層，呈現俐落現代玻璃建築比例。' },
    { step: 16, bag: 4, title: '封頂白色女兒牆與 16 組深灰格柵',   tip: '兩側立起純白邊牆，中央鋪滿 16 組深灰散熱格柵光磚，熊本一廠落成！' }
  ],
  bricks: buildBricks()
};
