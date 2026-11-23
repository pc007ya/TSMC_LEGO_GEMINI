import { brick } from '../legoCatalog.js';

function buildBricks() {
  const B = [];
  const add = (part, color, x, y, z, rot, bag, step) => B.push(brick(part, color, x, y, z, rot, bag, step));

  // =========================================================================
  // BAG 1: 亞利桑那沙漠米色地基與廠區鋪面 (Steps 1–3)
  // =========================================================================
  // Step 1: Expansive Arizona Desert Tan Baseplate (24 x 14)
  add('plate_8x16', 'TAN', -8, 0,  0, 1, 1, 1);
  add('plate_8x16', 'TAN',  4, 0,  0, 1, 1, 1);
  add('plate_6x12', 'TAN', -6, 0, -5, 1, 1, 1);
  add('plate_6x12', 'TAN',  6, 0, -5, 1, 1, 1);

  // Step 2: Smooth Desert Tan Border Tiles
  for (let x = -10; x <= 10; x += 4) {
    add('tile_2x4', 'TAN', x, 1, 5.5, 1, 1, 2);
  }
  add('tile_2x4', 'TAN', -11, 1,  1, 0, 1, 2);
  add('tile_2x4', 'TAN', -11, 1, -3, 0, 1, 2);
  add('tile_2x4', 'TAN',  11, 1,  1, 0, 1, 2);

  // Step 3: Dark-Gray Sub-Foundation Plinths
  add('plate_6x12', 'BLACK', -4, 1, -1.0, 1, 1, 3);
  add('plate_4x8',  'BLACK', -4, 1,  2.5, 1, 1, 3);
  add('plate_4x8',  'DARK_BLUISH_GRAY', 7.5, 1, -1.5, 0, 1, 3);

  // =========================================================================
  // BAG 2: Fab 21 主廠房重裝結構、外部扶壁柱與 TSMC 徽章 (Steps 4–6)
  // =========================================================================
  // Step 4: Main Cleanroom Industrial Walls (Light Bluish Gray)
  for (let x = -8; x <= 0; x += 2) {
    add('brick_2x6', 'LIGHT_BLUISH_GRAY', x, 2, -1.0, 0, 2, 4);
    add('brick_2x6', 'LIGHT_BLUISH_GRAY', x, 5, -1.0, 0, 2, 4);
    add('brick_2x4', 'LIGHT_BLUISH_GRAY', x, 2,  2.5, 0, 2, 4);
    add('brick_2x4', 'LIGHT_BLUISH_GRAY', x, 5,  2.5, 0, 2, 4);
  }
  add('plate_6x12', 'DARK_BLUISH_GRAY', -4, 8, -0.5, 1, 2, 4);
  add('plate_4x8',  'DARK_BLUISH_GRAY', -4, 8,  2.5, 1, 2, 4);

  // Step 5: Heavy Vertical Exterior Buttress Columns (Dark Gray & Black)
  const frontCols = [-7.5, -4.0, -0.5];
  for (const cx of frontCols) {
    add('brick_1x2x2', 'DARK_BLUISH_GRAY', cx, 2, 4.6, 1, 2, 5);
    add('tile_1x2',    'DARK_BLUISH_GRAY', cx, 8, 4.6, 1, 2, 5);
  }
  const sideCols = [-3.0, -0.5, 2.0];
  for (const cz of sideCols) {
    add('brick_1x2x2', 'BLACK', -9.6, 2, cz, 0, 2, 5);
    add('tile_1x2',    'BLACK', -9.6, 8, cz, 0, 2, 5);
  }

  // Step 6: Dark-Gray Parapet Rim & Circular TSMC Wafer Emblem
  add('tile_1x6', 'DARK_BLUISH_GRAY', -6.5, 9,  4.2, 1, 2, 6);
  add('tile_1x6', 'DARK_BLUISH_GRAY', -1.5, 9,  4.2, 1, 2, 6);
  add('tile_1x6', 'DARK_BLUISH_GRAY', -6.5, 9, -4.2, 1, 2, 6);
  add('tile_1x6', 'DARK_BLUISH_GRAY', -1.5, 9, -4.2, 1, 2, 6);
  // Iconic circular white TSMC wafer emblem on front-right corner
  add('tile_tsmc_round_2x2', 'WHITE', 1.2, 6, 3.6, 0, 2, 6);

  // =========================================================================
  // BAG 3: 超高密度沙漠廠務屋頂 (空調機組與銀色管排) (Steps 7–9)
  // =========================================================================
  // Step 7: Tan Rectangular HVAC Air Handling Units
  add('tile_2x4', 'TAN', -6.5, 9,  2.2, 1, 3, 7);
  add('tile_2x4', 'TAN', -2.5, 9,  2.2, 1, 3, 7);
  add('tile_2x4', 'TAN', -6.5, 9, -1.8, 1, 3, 7);
  add('tile_2x4', 'TAN', -2.5, 9, -1.8, 1, 3, 7);

  // Step 8: High-Density Flat-Silver Piping Grid
  add('bar_1x4', 'FLAT_SILVER', -6.5, 9,  0.2, 1, 3, 8);
  add('bar_1x4', 'FLAT_SILVER', -2.5, 9,  0.2, 1, 3, 8);
  add('bar_1x4', 'FLAT_SILVER', -4.5, 9, -3.2, 1, 3, 8);
  add('bar_1x4', 'FLAT_SILVER', -8.2, 9,  0.0, 0, 3, 8);
  add('bar_1x4', 'FLAT_SILVER',  0.2, 9,  0.0, 0, 3, 8);

  // Step 9: Cylindrical Process Tanks & Exhaust Stacks
  const tanks = [
    [-7.5, -2.5], [-5.2, -3.2], [-3.0, -3.0],
    [-1.2,  0.8], [-2.2,  0.8], [-7.5,  3.0], [-4.5, 2.2]
  ];
  for (const [tx, tz] of tanks) {
    add('round_brick_1x1', 'FLAT_SILVER', tx, 9, tz, 0, 3, 9);
    add('round_plate_1x1', 'TAN',         tx, 12, tz, 0, 3, 9);
  }
  add('tile_grille', 'DARK_TAN', -4.5, 9, 0.2, 0, 3, 9);

  // =========================================================================
  // BAG 4: 跨棟管線空橋與右側中央公用系統廠 (CUP 冷卻水池) (Steps 10–12)
  // =========================================================================
  // Step 10: Elevated Skybridge & Lower Utility Pipe Corridor
  add('brick_1x4', 'DARK_BLUISH_GRAY',  3.5, 2,  1.2, 1, 4, 10);
  add('tile_1x4',  'LIGHT_BLUISH_GRAY', 3.5, 5,  1.2, 1, 4, 10);
  add('brick_1x4', 'DARK_BLUISH_GRAY',  3.5, 5, -1.6, 1, 4, 10);
  add('tile_1x4',  'DARK_BLUISH_GRAY',  3.5, 8, -1.6, 1, 4, 10);

  // Step 11: Right Central Utility Plant (CUP) Dark-Gray Building
  add('brick_2x6', 'DARK_BLUISH_GRAY',  6.5, 2, -1.5, 0, 4, 11);
  add('brick_2x6', 'DARK_BLUISH_GRAY',  8.5, 2, -1.5, 0, 4, 11);
  add('brick_2x6', 'DARK_BLUISH_GRAY',  6.5, 5, -1.5, 0, 4, 11);
  add('brick_2x6', 'DARK_BLUISH_GRAY',  8.5, 5, -1.5, 0, 4, 11);
  // Black front buttress on CUP
  add('brick_1x2x2', 'BLACK', 7.5, 2, 1.8, 1, 4, 11);

  // Step 12: Twin Rows of Metallic Cooling Tower Fans & Trans-Cyan Water Basin
  // Translucent cyan cooling water basin on front half of CUP roof
  add('tile_2x2', 'TRANS_LIGHT_BLUE', 7.5, 8, 0.2, 0, 4, 12);
  add('tile_1x2', 'TRANS_LIGHT_BLUE', 6.5, 8, 0.2, 0, 4, 12);
  add('tile_1x2', 'TRANS_LIGHT_BLUE', 8.5, 8, 0.2, 0, 4, 12);
  // Two rows of 5 metallic silver cooling tower fan rings
  for (let i = 0; i < 5; i++) {
    add('round_plate_1x1', 'FLAT_SILVER', 6.6, 8, -4.0 + i * 0.9, 0, 4, 12);
    add('round_plate_1x1', 'FLAT_SILVER', 8.2, 8, -4.0 + i * 0.9, 0, 4, 12);
  }
  add('bar_1x4', 'FLAT_SILVER', 7.4, 9, -2.5, 0, 4, 12);

  return B;
}

export const SET_03_ARIZONA = {
  id: 'set03_arizona',
  setNumber: '21037',
  shortName: '亞利桑那廠',
  name: '亞利桑那鳳凰城廠 (Fab 21)',
  englishName: 'TSMC Arizona Fab 21, Phoenix',
  location: '美國・亞利桑那州鳳凰城 (Phoenix, AZ, USA)',
  age: '18+',
  year: '2024',
  refImage: 'assets/ref/set03.jpg',
  accentColor: '#C49F58',
  cameraPos: [21, 16, 21],
  cameraTarget: [0, 2.2, 0],
  description: '展現台積電美國亞利桑那州 Fab 21 的硬派沙漠工業美學！以沙漠米色光磚地基托起深灰重裝扶壁柱主廠房，正角鑲嵌圓形 TSMC 晶圓徽章，屋頂佈滿超高密度銀色管排與米色空調箱，並經由雙層空橋連接右側具備雙排金屬冷卻風扇與透藍冷卻水池的中央公用系統廠 (CUP)。',
  bags: [
    { id: 1, title: '第 1 包：亞利桑那沙漠底板與地基',     subtitle: 'Desert Tan Baseplate & Plinths', color: '#D7C294' },
    { id: 2, title: '第 2 包：Fab 21 重裝廠房與扶壁柱',    subtitle: 'Main Fab Walls, Buttresses & Emblem', color: '#575D63' },
    { id: 3, title: '第 3 包：超高密度屋頂管排與儲槽',     subtitle: 'Dense Rooftop HVAC & Piping', color: '#8E949A' },
    { id: 4, title: '第 4 包：跨棟空橋與 CUP 冷卻水池廠',  subtitle: 'Skybridge & Cooling Tower Plant', color: '#46C7EC' }
  ],
  steps: [
    { step: 1,  bag: 1, title: '拼接 24×14 沙漠米色大型底板',       tip: '以沙漠米 (Tan) 薄板構成鳳凰城沙漠基地輪廓。' },
    { step: 2,  bag: 1, title: '鋪設周界沙漠平滑光磚',               tip: '沿四邊鋪上 2×4 沙漠米光磚，呈現俐落展示底座質感。' },
    { step: 3,  bag: 1, title: '定位曜石黑廠房基座',                 tip: '在左側主廠房與右側公用廠位置鋪設深色底層。' },
    { step: 4,  bag: 2, title: '堆疊淺藍灰主晶圓廠核心牆體',         tip: '雙層堆疊淺藍灰標準磚，上方以深藍灰屋頂板封層。' },
    { step: 5,  bag: 2, title: '加裝外部深灰與曜石黑垂直扶壁柱',     tip: '在正面與左側安裝高聳的 1×2×2 結構扶壁柱，重現工業堡壘氣勢。' },
    { step: 6,  bag: 2, title: '收邊深灰女兒牆與圓形 TSMC 徽章',     tip: '沿屋頂四周鋪上深灰光磚，於前右角扣上專屬圓形 TSMC 晶圓徽章。' },
    { step: 7,  bag: 3, title: '配置 4 組沙漠米色屋頂空調機組',      tip: '對稱擺放 2×4 沙漠米光磚作為大型無塵室外氣空調箱。' },
    { step: 8,  bag: 3, title: '佈線金屬銀製程管排陣列',             tip: '縱橫交錯架設 5 條金屬銀 4L 管線圓桿。' },
    { step: 9,  bag: 3, title: '安裝 7 座圓柱製程槽與散熱格柵',      tip: '金屬銀圓柱磚頂部扣上沙漠米圓薄片，呈現極致微縮細節。' },
    { step: 10, bag: 4, title: '搭設跨棟雙層管線空橋',               tip: '建立上下兩條連接主廠房與右側 CUP 的管線廊道。' },
    { step: 11, bag: 4, title: '建造右側中央公用系統廠 (CUP)',       tip: '以深藍灰標準磚堆疊右側附屬廠房，正面加上黑色垂直柱飾。' },
    { step: 12, bag: 4, title: '安裝雙排 10 座冷卻風扇與透藍水池',  tip: '屋頂後半部排滿雙排金屬銀圓形風扇，前半部鋪上透亮水藍冷卻池！' }
  ],
  bricks: buildBricks()
};
