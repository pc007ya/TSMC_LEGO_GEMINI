import { place } from '../legoCatalog.js';

function buildBricks() {
  const B = [];
  const add = (part, color, xMin, y, zMin, rot, bag, step) => B.push(place(part, color, xMin, y, zMin, rot, bag, step));

  // =========================================================================
  // BAG 1: 熊本廠區底板、綠化植栽帶與右側停車場 (Steps 1–3)
  // Grid: X = -12..12 (24 studs), Z = -7..7 (14 studs)
  // =========================================================================
  // Step 1: Exact-tiled 24 x 14 Baseplate (y = 0, ZERO overlap)
  add('plate_8x16', 'LIGHT_BLUISH_GRAY', -12, 0, -7, 1, 1, 1); // X -12..4, Z -7..1
  add('plate_6x8',  'LIGHT_BLUISH_GRAY', -12, 0,  1, 1, 1, 1); // X -12..-4, Z 1..7
  add('plate_6x8',  'LIGHT_BLUISH_GRAY',  -4, 0,  1, 1, 1, 1); // X -4..4, Z 1..7
  add('plate_6x8',  'LIGHT_BLUISH_GRAY',   4, 0, -7, 1, 1, 1); // X 4..12, Z -7..-1
  add('plate_6x8',  'LIGHT_BLUISH_GRAY',   4, 0, -1, 1, 1, 1); // X 4..12, Z -1..5
  add('plate_2x8',  'LIGHT_BLUISH_GRAY',   4, 0,  5, 1, 1, 1); // X 4..12, Z 5..7
  // Smooth front driveway plaza (y = 1, Z 2..4, X -12..4)
  for (let x = -12; x < 4; x += 4) {
    add('tile_2x4', 'LIGHT_BLUISH_GRAY', x, 1, 2, 1, 1, 1);
  }

  // Step 2: Twin Front Bright-Green Lawn & Shrub Strips (y = 1, Z 5..7)
  add('plate_2x8', 'BRIGHT_GREEN', -12, 1, 5, 1, 1, 2); // X -12..-4
  add('plate_2x4', 'BRIGHT_GREEN',  -4, 1, 5, 1, 1, 2); // X -4..0
  add('plate_2x6', 'BRIGHT_GREEN',   3, 1, 5, 1, 1, 2); // X 3..9
  for (let x = -11; x <= -1; x += 2) {
    add('flower_1x1', 'BRIGHT_GREEN', x, 2, 5, 0, 1, 2);
  }
  for (let x = 4; x <= 8; x += 2) {
    add('flower_1x1', 'BRIGHT_GREEN', x, 2, 5, 0, 1, 2);
  }

  // Step 3: Far-Right Staff Parking Lot & Micro Cars (X 10..12, Z -5..5)
  add('plate_2x6', 'DARK_BLUISH_GRAY', 10, 1, -5, 0, 1, 3); // Z -5..1
  add('plate_2x4', 'DARK_BLUISH_GRAY', 10, 1,  1, 0, 1, 3); // Z 1..5
  // 4 Micro cars (Black, White, Red, Blue)
  add('plate_1x2', 'BLACK', 10, 2, -4, 1, 1, 3);
  add('plate_1x2', 'WHITE', 10, 2, -2, 1, 1, 3);
  add('plate_1x2', 'RED',   10, 2,  1, 1, 1, 3);
  add('plate_1x2', 'BLUE',  10, 2,  3, 1, 1, 3);

  // =========================================================================
  // BAG 2: 左側氣體供應站與主晶圓廠白色肋條立面 (Steps 4–6)
  // =========================================================================
  // Step 4: Left Utility Annex (X -12..-9, Z -6..0) & 3 White Gas Storage Tanks (Z 0..1)
  add('brick_2x6',   'WHITE', -12, 1, -6, 0, 2, 4);
  add('brick_1x6',   'WHITE', -10, 1, -6, 0, 2, 4);
  add('brick_2x6',   'WHITE', -12, 4, -6, 0, 2, 4);
  add('brick_1x6',   'WHITE', -10, 4, -6, 0, 2, 4);
  add('tile_2x4',    'WHITE', -12, 7, -5, 0, 2, 4);
  add('tile_1x4',    'WHITE', -10, 7, -5, 0, 2, 4);
  add('tile_grille', 'DARK_BLUISH_GRAY', -12, 7, -6, 1, 2, 4);
  add('tile_grille', 'DARK_BLUISH_GRAY', -12, 7, -1, 1, 2, 4);
  // 3 iconic vertical white gas tanks
  add('round_brick_1x1', 'WHITE', -12, 1, 0, 0, 2, 4);
  add('round_brick_1x1', 'WHITE', -11, 1, 0, 0, 2, 4);
  add('round_brick_1x1', 'WHITE', -10, 1, 0, 0, 2, 4);

  // Step 5: Main Fab Core Walls (X -8..0, Z -6..0, Y 1..11 — 100% flush, ZERO overlap!)
  for (let x = -8; x < 0; x += 2) {
    add('brick_2x6', 'DARK_BLUISH_GRAY', x, 1, -6, 0, 2, 5);
    add('brick_2x6', 'WHITE',            x, 4, -6, 0, 2, 5);
    add('brick_2x6', 'WHITE',            x, 7, -6, 0, 2, 5);
  }
  add('plate_6x8', 'LIGHT_BLUISH_GRAY', -8, 10, -6, 1, 2, 5); // Exact X -8..0, Z -6..0!

  // Step 6: Vertical Light-Gray Structural Pilasters Along Front Facade (Z 0..1, flush with wall)
  for (let x = -8; x <= -2; x += 2) {
    add('brick_1x1x2', 'LIGHT_BLUISH_GRAY', x, 1, 0, 0, 2, 6);
    add('brick_1x1',   'LIGHT_BLUISH_GRAY', x, 7, 0, 0, 2, 6);
    add('tile_1x1',    'LIGHT_BLUISH_GRAY', x, 10, 0, 0, 2, 6);
  }

  // =========================================================================
  // BAG 3: 屋頂精密管線、金銀製程管排與排氣塔 (Steps 7–9)
  // Roof area: X -8..0, Z -6..0, Y = 11
  // =========================================================================
  // Step 7: White Cleanroom Plenum Roof Boxes (X -5..-1)
  add('tile_2x4', 'WHITE', -5, 11, -3, 1, 3, 7); // X -5..-1, Z -3..-1
  add('tile_2x4', 'WHITE', -5, 11, -6, 1, 3, 7); // X -5..-1, Z -6..-4

  // Step 8: Pearl-Gold & Flat-Silver Horizontal MEP Pipe Racks
  add('bar_1x4', 'PEARL_GOLD',  -5, 11, -4, 1, 3, 8); // X -5..-1, Z -4..-3
  add('bar_1x4', 'FLAT_SILVER', -5, 11, -1, 1, 3, 8); // X -5..-1, Z -1..0

  // Step 9: Tan Cylindrical Scrubber Stacks & Exhaust Chimneys (X -8..-6)
  const stacks = [[-8, -2], [-7, -2], [-8, -4], [-7, -4]];
  for (const [sx, sz] of stacks) {
    add('round_brick_1x1', 'TAN',         sx, 11, sz, 0, 3, 9);
    add('round_plate_1x1', 'FLAT_SILVER', sx, 14, sz, 0, 3, 9);
  }
  add('cone_1x1', 'DARK_BLUISH_GRAY', -8, 11, -6, 0, 3, 9);
  add('cone_1x1', 'DARK_BLUISH_GRAY', -7, 11, -6, 0, 3, 9);

  // =========================================================================
  // BAG 4: JASM 入口門廳與五層透明水藍玻璃辦公大樓 (Steps 10–12)
  // =========================================================================
  // Step 10: Protruding JASM Entrance Wing & Printed Logo (X 0..2, Z -1..2)
  add('brick_2x2',     'DARK_BLUISH_GRAY', 0, 1, -1, 0, 4, 10);
  add('plate_2x3',     'WHITE',            0, 4, -1, 0, 4, 10);
  add('brick_2x3',     'WHITE',            0, 5, -1, 0, 4, 10);
  add('tile_2x2',      'WHITE',            0, 8, -1, 0, 4, 10);
  add('tile_jasm_1x2', 'WHITE',            0, 8,  1, 1, 4, 10);

  // Step 11: 5-Story Alternating White & Trans-Light-Blue Glass Office Building (X 4..8, Z -3..3)
  for (let floor = 0; floor < 5; floor++) {
    const fy = 1 + floor * 2;
    add('plate_4x6', 'TRANS_LIGHT_BLUE', 4, fy,     -3, 0, 4, 11);
    add('plate_4x6', 'WHITE',            4, fy + 1, -3, 0, 4, 11);
  }

  // Step 12: White Roof Parapet & Dark-Gray Slatted Penthouse (Y = 11, X 4..8, Z -3..3)
  add('brick_1x6',   'WHITE',            4, 11, -3, 0, 4, 12); // X 4..5
  add('brick_1x6',   'WHITE',            7, 11, -3, 0, 4, 12); // X 7..8
  add('tile_grille', 'DARK_BLUISH_GRAY', 5, 11, -2, 1, 4, 12); // X 5..7, Z -2..-1
  add('tile_grille', 'DARK_BLUISH_GRAY', 5, 11,  0, 1, 4, 12); // X 5..7, Z 0..1
  add('tile_grille', 'DARK_BLUISH_GRAY', 5, 11,  2, 1, 4, 12); // X 5..7, Z 2..3
  add('tile_1x2',    'WHITE',            5, 11, -3, 1, 4, 12);
  add('tile_1x2',    'WHITE',            5, 11, -1, 1, 4, 12);
  add('tile_1x2',    'WHITE',            5, 11,  1, 1, 4, 12);

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
  cameraPos: [21, 15, 22],
  cameraTarget: [0, 2.5, 0],
  description: '完整還原台積電日本子公司 JASM 熊本晶圓廠！包含前方雙條鮮綠植栽帶、左側白色氣體槽、具垂直灰柱韻律的純白主廠房、珍珠金與金屬銀交織的屋頂管排、專屬「Jasm」印刷入口門廳，以及五層透亮水藍玻璃帷幕辦公大樓與微型員工停車場。',
  bags: [
    { id: 1, title: '第 1 包：廠區底板、綠籬與微型停車場', subtitle: 'Baseplate, Green Hedges & Parking', color: '#1D8F44' },
    { id: 2, title: '第 2 包：氣體供應站與主廠房立面',     subtitle: 'Gas Annex & Ribbed Fab Facade', color: '#A6ACB2' },
    { id: 3, title: '第 3 包：屋頂金銀管排與排氣塔',       subtitle: 'Gold/Silver MEP & Scrubber Stacks', color: '#C49F58' },
    { id: 4, title: '第 4 包：JASM 門廳與五層玻璃辦公樓',  subtitle: 'JASM Entrance & Glass Office Tower', color: '#46C7EC' }
  ],
  steps: [
    { step: 1,  bag: 1, title: '組裝 24×14 廠區淺灰底板與車道',     tip: '無縫拼接淺藍灰底板，於前排鋪上平滑 2×4 光磚作為廠區道路。' },
    { step: 2,  bag: 1, title: '鋪設前排雙段鮮綠草坪與灌木',       tip: '對稱安裝鮮綠薄板，並扣上 1×1 樹冠花葉片增添立體綠意。' },
    { step: 3,  bag: 1, title: '打造右側員工停車場與 4 輛微型車',  tip: '以深灰薄板作為柏油停車場，停放紅、藍、白、黑四輛 1×2 微縮汽車。' },
    { step: 4,  bag: 2, title: '建立左側氣體供應站與三支白色氣槽', tip: '於最左側立起 3 根白色 1×1 圓柱磚模擬高純度氣體儲槽。' },
    { step: 5,  bag: 2, title: '堆疊中央純白晶圓廠主結構',         tip: '底層深灰基座搭配雙層白色標準磚，頂部精準覆蓋 6×8 淺灰屋頂板。' },
    { step: 6,  bag: 2, title: '鑲嵌立面垂直結構灰柱',             tip: '沿廠房正面等距立起 4 根淺灰高柱磚，呈現工業建築節奏感。' },
    { step: 7,  bag: 3, title: '鋪設白色無塵室屋頂空調箱',         tip: '於屋頂中央整齊配置兩組 2×4 白色光磚空調箱。' },
    { step: 8,  bag: 3, title: '架設珍珠金與金屬銀製程管線',       tip: '平行排列珍珠金與金屬銀 4L 管線圓桿，還原高密度廠務管排。' },
    { step: 9,  bag: 3, title: '安裝沙漠米洗滌塔與錐形排氣煙囪',   tip: '在左後方屋頂組合 4 座圓柱洗滌塔與 2 支深灰錐形排氣管。' },
    { step: 10, bag: 4, title: '建構 JASM 凸出入口門廳與印刷標誌', tip: '安裝白色懸挑雨遮，頂部前緣貼上專屬「Jasm」印刷光磚。' },
    { step: 11, bag: 4, title: '層疊五層透亮水藍玻璃辦公大樓',     tip: '交替堆疊 5 層透亮水藍薄板與純白樓板，打造通透現代玻璃帷幕！' },
    { step: 12, bag: 4, title: '封頂白色女兒牆與深灰格柵機房',     tip: '加上頂層純白邊牆與 3 組深灰散熱格柵光磚，完成熊本一廠！' }
  ],
  bricks: buildBricks()
};
