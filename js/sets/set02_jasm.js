import { brick } from '../legoCatalog.js';

function buildBricks() {
  const B = [];
  const add = (part, color, x, y, z, rot, bag, step) => B.push(brick(part, color, x, y, z, rot, bag, step));

  // =========================================================================
  // BAG 1: 熊本廠區底板、綠化植栽帶與右側停車場 (Steps 1–3)
  // =========================================================================
  // Step 1: Wide 24 x 14 Baseplate
  add('plate_8x16', 'LIGHT_BLUISH_GRAY', -8, 0,  0, 1, 1, 1);
  add('plate_8x16', 'LIGHT_BLUISH_GRAY',  4, 0,  0, 1, 1, 1);
  add('plate_6x12', 'LIGHT_BLUISH_GRAY', -6, 0, -5, 1, 1, 1);
  add('plate_6x12', 'LIGHT_BLUISH_GRAY',  6, 0, -5, 1, 1, 1);
  // Smooth front driveway plaza
  for (let x = -10; x <= 6; x += 4) {
    add('tile_2x4', 'LIGHT_BLUISH_GRAY', x, 1, 3, 1, 1, 1);
  }

  // Step 2: Twin Front Bright-Green Lawn & Shrub Strips
  add('plate_2x8', 'BRIGHT_GREEN', -7, 1, 5.5, 1, 1, 2);
  add('plate_2x4', 'BRIGHT_GREEN', -1, 1, 5.5, 1, 1, 2);
  add('plate_2x6', 'BRIGHT_GREEN',  6, 1, 5.5, 1, 1, 2);
  for (let x = -10; x <= 0; x += 2) {
    add('flower_1x1', 'BRIGHT_GREEN', x, 2, 5.5, 0, 1, 2);
  }
  for (let x = 4; x <= 8; x += 2) {
    add('flower_1x1', 'BRIGHT_GREEN', x, 2, 5.5, 0, 1, 2);
  }

  // Step 3: Far-Right Staff Parking Lot & Micro Cars
  add('plate_4x6', 'DARK_BLUISH_GRAY', 10, 1, -1, 0, 1, 3);
  // 4 Micro cars (Red, Blue, White, Black)
  add('plate_1x2', 'RED',   9.5, 2,  0.5, 1, 1, 3);
  add('plate_1x2', 'BLUE',  9.5, 2,  2.2, 1, 1, 3);
  add('plate_1x2', 'WHITE', 10.8, 2, -1.5, 1, 1, 3);
  add('plate_1x2', 'BLACK', 10.8, 2, -3.2, 1, 1, 3);

  // =========================================================================
  // BAG 2: 左側氣體供應站與主晶圓廠白色肋條立面 (Steps 4–6)
  // =========================================================================
  // Step 4: Left Utility Annex & 3 White Gas Storage Tanks
  add('brick_2x6',       'WHITE', -9.5, 1, -3.5, 0, 2, 4);
  add('brick_2x6',       'WHITE', -9.5, 4, -3.5, 0, 2, 4);
  add('tile_2x4',        'WHITE', -9.5, 7, -3.5, 0, 2, 4);
  add('tile_grille',     'DARK_BLUISH_GRAY', -9.5, 7, -1.0, 0, 2, 4);
  add('tile_grille',     'DARK_BLUISH_GRAY', -9.5, 7, -5.5, 0, 2, 4);
  // 3 iconic vertical white gas tanks
  add('round_brick_1x1', 'WHITE', -10.8, 1, 0.2, 0, 2, 4);
  add('round_brick_1x1', 'WHITE', -9.6,  1, 0.8, 0, 2, 4);
  add('round_brick_1x1', 'WHITE', -8.4,  1, 1.4, 0, 2, 4);

  // Step 5: Main Fab Core Walls (Dark Gray Base + White Panels)
  for (let x = -6; x <= 0; x += 2) {
    add('brick_2x6', 'DARK_BLUISH_GRAY', x, 1, -3.0, 0, 2, 5);
    add('brick_2x6', 'WHITE',            x, 4, -3.0, 0, 2, 5);
    add('brick_2x6', 'WHITE',            x, 7, -3.0, 0, 2, 5);
  }
  add('plate_6x12', 'LIGHT_BLUISH_GRAY', -3, 10, -3.0, 1, 2, 5);

  // Step 6: Vertical Light-Gray Structural Pilasters Along Front Facade
  for (let x = -7; x <= 1; x += 2) {
    add('brick_1x1x2', 'LIGHT_BLUISH_GRAY', x, 2, 0.3, 0, 2, 6);
    add('tile_1x1',    'LIGHT_BLUISH_GRAY', x, 8, 0.3, 0, 2, 6);
  }

  // =========================================================================
  // BAG 3: 屋頂精密管線、金銀製程管排與排氣塔 (Steps 7–9)
  // =========================================================================
  // Step 7: White Cleanroom Plenum Roof Boxes
  add('tile_2x4', 'WHITE', -3.0, 11, -2.0, 1, 3, 7);
  add('tile_2x4', 'WHITE', -2.0, 11, -4.5, 1, 3, 7);
  add('tile_1x6', 'WHITE', -3.0, 11,  0.0, 1, 3, 7);

  // Step 8: Pearl-Gold & Flat-Silver Horizontal MEP Pipe Racks
  add('bar_1x4', 'PEARL_GOLD',  -3.0, 11, -1.0, 1, 3, 8);
  add('bar_1x4', 'PEARL_GOLD',  -3.0, 11, -3.3, 1, 3, 8);
  add('bar_1x4', 'FLAT_SILVER', -3.0, 11, -0.5, 1, 3, 8);
  add('bar_1x4', 'FLAT_SILVER', -2.5, 11, -5.6, 1, 3, 8);

  // Step 9: Tan Cylindrical Scrubber Stacks & Exhaust Chimneys
  const stacks = [[-6.5, -1.2], [-5.5, -1.2], [-6.0, -2.5], [-4.5, -5.2], [-3.5, -5.2]];
  for (const [sx, sz] of stacks) {
    add('round_brick_1x1', 'TAN',         sx, 11, sz, 0, 3, 9);
    add('round_plate_1x1', 'FLAT_SILVER', sx, 14, sz, 0, 3, 9);
  }
  add('cone_1x1', 'DARK_BLUISH_GRAY', -5.8, 11, -5.6, 0, 3, 9);
  add('cone_1x1', 'DARK_BLUISH_GRAY', -4.8, 11, -6.0, 0, 3, 9);

  // =========================================================================
  // BAG 4: JASM 入口門廳與五層透明水藍玻璃辦公大樓 (Steps 10–12)
  // =========================================================================
  // Step 10: Protruding JASM Entrance Wing & Printed Logo
  add('brick_2x2',     'DARK_BLUISH_GRAY', 2.0, 1,  1.0, 0, 4, 10);
  add('plate_2x3',     'WHITE',            2.0, 4,  1.2, 0, 4, 10);
  add('brick_2x3',     'WHITE',            2.0, 5,  0.6, 0, 4, 10);
  add('tile_2x2',      'WHITE',            2.0, 8,  0.6, 0, 4, 10);
  add('tile_jasm_1x2', 'WHITE',            2.0, 6,  2.1, 1, 4, 10);

  // Step 11: 5-Story Alternating White & Trans-Light-Blue Glass Office Building
  for (let floor = 0; floor < 5; floor++) {
    const fy = 1 + floor * 2;
    // Translucent cyan glass curtain wall layer
    add('plate_4x6', 'TRANS_LIGHT_BLUE', 6.0, fy,     0.5, 0, 4, 11);
    // Crisp white concrete floor slab
    add('plate_4x6', 'WHITE',            6.0, fy + 1, 0.5, 0, 4, 11);
  }

  // Step 12: White Roof Parapet & Dark-Gray Slatted Penthouse
  add('brick_1x6',   'WHITE',            4.5, 11, 0.5, 0, 4, 12);
  add('brick_1x6',   'WHITE',            7.5, 11, 0.5, 0, 4, 12);
  add('tile_2x4',    'WHITE',            6.0, 11, 0.5, 0, 4, 12);
  add('tile_grille', 'DARK_BLUISH_GRAY', 6.0, 12, -1.0, 0, 4, 12);
  add('tile_grille', 'DARK_BLUISH_GRAY', 6.0, 12,  1.0, 0, 4, 12);
  add('tile_grille', 'DARK_BLUISH_GRAY', 6.0, 12,  2.5, 0, 4, 12);

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
    { step: 1,  bag: 1, title: '組裝 24×14 廠區淺灰底板與車道',     tip: '拼接大型淺藍灰底板，於前排鋪上平滑 2×4 光磚作為廠區道路。' },
    { step: 2,  bag: 1, title: '鋪設前排雙段鮮綠草坪與灌木',       tip: '對稱安裝鮮綠薄板，並扣上 1×1 樹冠花葉片增添立體綠意。' },
    { step: 3,  bag: 1, title: '打造右側員工停車場與 4 輛微型車',  tip: '以深灰薄板作為柏油停車場，停放紅、藍、白、黑四輛 1×2 微縮汽車。' },
    { step: 4,  bag: 2, title: '建立左側氣體供應站與三支白色氣槽', tip: '於最左側立起 3 根白色 1×1 圓柱磚模擬高純度氣體儲槽。' },
    { step: 5,  bag: 2, title: '堆疊中央純白晶圓廠主結構',         tip: '底層深灰基座搭配雙層白色標準磚，頂部覆蓋 6×12 淺灰屋頂板。' },
    { step: 6,  bag: 2, title: '鑲嵌立面垂直結構灰柱',             tip: '沿廠房正面等距立起 5 根 1×1×2 淺灰高柱磚，呈現工業建築節奏感。' },
    { step: 7,  bag: 3, title: '鋪設白色無塵室屋頂空調箱',         tip: '於屋頂中央整齊配置 2×4 白色光磚與長條邊飾。' },
    { step: 8,  bag: 3, title: '架設珍珠金與金屬銀製程管線',       tip: '平行排列珍珠金與金屬銀 4L 管線圓桿，還原高密度廠務管排。' },
    { step: 9,  bag: 3, title: '安裝沙漠米洗滌塔與錐形排氣煙囪',   tip: '在左後方屋頂組合 5 座圓柱洗滌塔與 2 支深灰錐形排氣管。' },
    { step: 10, bag: 4, title: '建構 JASM 凸出入口門廳與印刷標誌', tip: '安裝白色懸挑雨遮，正面貼上專屬「Jasm」印刷光磚。' },
    { step: 11, bag: 4, title: '層疊五層透亮水藍玻璃辦公大樓',     tip: '交替堆疊 5 層透亮水藍薄板與純白樓板，打造通透現代玻璃帷幕！' },
    { step: 12, bag: 4, title: '封頂白色女兒牆與深灰格柵機房',     tip: '加上頂層純白邊牆與 3 組深灰散熱格柵光磚，完成熊本一廠！' }
  ],
  bricks: buildBricks()
};
