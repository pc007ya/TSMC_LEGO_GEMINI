import { place } from '../legoCatalog.js';

function buildBricks() {
  const B = [];
  const add = (part, color, xMin, y, zMin, rot, bag, step) => B.push(place(part, color, xMin, y, zMin, rot, bag, step));

  // =========================================================================
  // BAG 1: 亞利桑那沙漠米色地基與廠區鋪面 (Steps 1–3)
  // Grid: X = -12..12 (24 studs), Z = -7..7 (14 studs)
  // =========================================================================
  // Step 1: Exact-tiled 24 x 14 Desert Tan Baseplate (y = 0, ZERO overlap)
  add('plate_8x16', 'TAN', -12, 0, -7, 1, 1, 1); // X -12..4, Z -7..1
  add('plate_6x8',  'TAN', -12, 0,  1, 1, 1, 1); // X -12..-4, Z 1..7
  add('plate_6x8',  'TAN',  -4, 0,  1, 1, 1, 1); // X -4..4, Z 1..7
  add('plate_6x8',  'TAN',   4, 0, -7, 1, 1, 1); // X 4..12, Z -7..-1
  add('plate_6x8',  'TAN',   4, 0, -1, 1, 1, 1); // X 4..12, Z -1..5
  add('plate_2x8',  'TAN',   4, 0,  5, 1, 1, 1); // X 4..12, Z 5..7

  // Step 2: Smooth Desert Tan Border Tiles (y = 1)
  for (let x = -12; x < 12; x += 4) {
    add('tile_2x4', 'TAN', x, 1, 5, 1, 1, 2); // Front edge Z 5..7
  }
  add('tile_2x4', 'TAN', -12, 1, -5, 0, 1, 2); // Left edge X -12..-10
  add('tile_2x4', 'TAN', -12, 1, -1, 0, 1, 2);
  add('tile_2x4', 'TAN',  10, 1, -5, 0, 1, 2); // Right edge X 10..12
  add('tile_2x4', 'TAN',  10, 1, -1, 0, 1, 2);

  // Step 3: Dark-Gray & Black Sub-Foundation Plinths (y = 1)
  // Main Fab plinth: X -9..1 (10 studs), Z -5..3 (8 studs)
  add('plate_4x8', 'BLACK', -9, 1, -5, 0, 1, 3); // X -9..-5, Z -5..3
  add('plate_4x8', 'BLACK', -5, 1, -5, 0, 1, 3); // X -5..-1, Z -5..3
  add('plate_2x8', 'BLACK', -1, 1, -5, 0, 1, 3); // X -1..1,  Z -5..3
  // Right CUP plinth: X 5..9 (4 studs), Z -5..3 (8 studs)
  add('plate_4x8', 'DARK_BLUISH_GRAY', 5, 1, -5, 0, 1, 3);

  // =========================================================================
  // BAG 2: Fab 21 主廠房重裝結構、外部扶壁柱與 TSMC 徽章 (Steps 4–6)
  // Main Fab: X -9..1 (10 studs), Z -5..3 (8 studs), Y 2..8
  // =========================================================================
  // Step 4: Main Cleanroom Industrial Walls (Light Bluish Gray)
  for (let x = -9; x < 1; x += 2) {
    add('brick_2x6', 'LIGHT_BLUISH_GRAY', x, 2, -5, 0, 2, 4); // Z -5..1
    add('brick_2x2', 'LIGHT_BLUISH_GRAY', x, 2,  1, 0, 2, 4); // Z 1..3
    add('brick_2x6', 'LIGHT_BLUISH_GRAY', x, 5, -5, 0, 2, 4);
    add('brick_2x2', 'LIGHT_BLUISH_GRAY', x, 5,  1, 0, 2, 4);
  }
  add('plate_4x8', 'DARK_BLUISH_GRAY', -9, 8, -5, 0, 2, 4);
  add('plate_4x8', 'DARK_BLUISH_GRAY', -5, 8, -5, 0, 2, 4);
  add('plate_2x8', 'DARK_BLUISH_GRAY', -1, 8, -5, 0, 2, 4);

  // Step 5: Heavy Vertical Exterior Buttress Columns (outside wall: Z 3..4 & X -10..-9)
  const frontCols = [-8, -5, -2];
  for (const cx of frontCols) {
    add('brick_1x2x2', 'DARK_BLUISH_GRAY', cx, 2, 3, 1, 2, 5); // 2x1 along X, Z 3..4
    add('tile_1x2',    'DARK_BLUISH_GRAY', cx, 8, 3, 1, 2, 5);
  }
  const sideCols = [-4, -1, 1];
  for (const cz of sideCols) {
    add('brick_1x2x2', 'BLACK', -10, 2, cz, 0, 2, 5); // X -10..-9, 2 along Z
    add('tile_1x2',    'BLACK', -10, 8, cz, 0, 2, 5);
  }

  // Step 6: Dark-Gray Parapet Rim & Circular TSMC Wafer Emblem (Y = 9)
  add('tile_1x6', 'DARK_BLUISH_GRAY', -9, 9,  2, 1, 2, 6); // X -9..-3, Z 2..3
  add('tile_1x4', 'DARK_BLUISH_GRAY', -3, 9,  2, 1, 2, 6); // X -3..1,  Z 2..3
  add('tile_1x6', 'DARK_BLUISH_GRAY', -9, 9, -5, 1, 2, 6); // X -9..-3, Z -5..-4
  add('tile_1x4', 'DARK_BLUISH_GRAY', -3, 9, -5, 1, 2, 6); // X -3..1,  Z -5..-4
  // Iconic circular white TSMC wafer emblem mounted cleanly on front-right roof corner
  add('tile_tsmc_round_2x2', 'WHITE', -1, 10, 1, 0, 2, 6);

  // =========================================================================
  // BAG 3: 超高密度沙漠廠務屋頂 (空調機組與銀色管排) (Steps 7–9)
  // Inner roof: X -9..1, Z -4..2, Y = 9
  // =========================================================================
  // Step 7: Tan Rectangular HVAC Air Handling Units
  add('tile_2x4', 'TAN', -8, 9,  0, 1, 3, 7); // X -8..-4, Z 0..2
  add('tile_2x4', 'TAN', -3, 9,  0, 1, 3, 7); // X -3..1,  Z 0..2
  add('tile_2x4', 'TAN', -8, 9, -4, 1, 3, 7); // X -8..-4, Z -4..-2
  add('tile_2x4', 'TAN', -3, 9, -4, 1, 3, 7); // X -3..1,  Z -4..-2

  // Step 8: High-Density Flat-Silver Piping Grid (Z -2..-1 & X -9..-8)
  add('bar_1x4', 'FLAT_SILVER', -8, 9, -2, 1, 3, 8); // X -8..-4, Z -2..-1
  add('bar_1x4', 'FLAT_SILVER', -3, 9, -2, 1, 3, 8); // X -3..1,  Z -2..-1
  add('bar_1x4', 'FLAT_SILVER', -9, 9, -3, 0, 3, 8); // X -9..-8, Z -3..1

  // Step 9: Cylindrical Process Tanks & Exhaust Stacks (in clean X -4..-3 channel)
  const tanks = [[-4, -4], [-4, -3], [-4, -1], [-4, 0], [-4, 1]];
  for (const [tx, tz] of tanks) {
    add('round_brick_1x1', 'FLAT_SILVER', tx, 9, tz, 0, 3, 9);
    add('round_plate_1x1', 'TAN',         tx, 12, tz, 0, 3, 9);
  }
  add('tile_grille', 'DARK_TAN', -8, 9, -1, 1, 3, 9); // X -8..-6, Z -1..0
  add('tile_grille', 'DARK_TAN', -2, 9, -1, 1, 3, 9); // X -2..0,  Z -1..0

  // =========================================================================
  // BAG 4: 跨棟管線空橋與右側中央公用系統廠 (CUP 冷卻水池) (Steps 10–12)
  // Bridge: X 1..5 (4 studs wide) | CUP: X 5..9, Z -5..3
  // =========================================================================
  // Step 10: Elevated Skybridge & Lower Utility Pipe Corridor
  add('brick_1x4', 'DARK_BLUISH_GRAY',  1, 1,  0, 1, 4, 10); // X 1..5, Z 0..1, Y 1..4
  add('tile_1x4',  'LIGHT_BLUISH_GRAY', 1, 4,  0, 1, 4, 10);
  add('brick_1x4', 'DARK_BLUISH_GRAY',  1, 4, -3, 1, 4, 10); // X 1..5, Z -3..-2, Y 4..7
  add('tile_1x4',  'DARK_BLUISH_GRAY',  1, 7, -3, 1, 4, 10);

  // Step 11: Right Central Utility Plant (CUP) Dark-Gray Building (X 5..9, Z -5..3)
  add('brick_2x6', 'DARK_BLUISH_GRAY', 5, 2, -5, 0, 4, 11);
  add('brick_2x6', 'DARK_BLUISH_GRAY', 7, 2, -5, 0, 4, 11);
  add('brick_2x2', 'DARK_BLUISH_GRAY', 5, 2,  1, 0, 4, 11);
  add('brick_2x2', 'DARK_BLUISH_GRAY', 7, 2,  1, 0, 4, 11);
  add('brick_2x6', 'DARK_BLUISH_GRAY', 5, 5, -5, 0, 4, 11);
  add('brick_2x6', 'DARK_BLUISH_GRAY', 7, 5, -5, 0, 4, 11);
  add('brick_2x2', 'DARK_BLUISH_GRAY', 5, 5,  1, 0, 4, 11);
  add('brick_2x2', 'DARK_BLUISH_GRAY', 7, 5,  1, 0, 4, 11);
  // Black front buttress on CUP (Z 3..4)
  add('brick_1x2x2', 'BLACK', 6, 2, 3, 1, 4, 11);

  // Step 12: Twin Rows of Metallic Cooling Tower Fans & Trans-Cyan Water Basin (Y = 8)
  add('tile_2x2', 'TRANS_LIGHT_BLUE', 5, 8, 1, 0, 4, 12);
  add('tile_2x2', 'TRANS_LIGHT_BLUE', 7, 8, 1, 0, 4, 12);
  for (let z = -5; z <= -1; z++) {
    add('round_plate_1x1', 'FLAT_SILVER', 5, 8, z, 0, 4, 12);
    add('round_plate_1x1', 'FLAT_SILVER', 8, 8, z, 0, 4, 12);
  }
  add('bar_1x4', 'FLAT_SILVER', 6, 8, -4, 0, 4, 12);

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
    { step: 1,  bag: 1, title: '拼接 24×14 沙漠米色大型底板',       tip: '以沙漠米 (Tan) 薄板無縫拼出鳳凰城沙漠基地輪廓。' },
    { step: 2,  bag: 1, title: '鋪設周界沙漠平滑光磚',               tip: '沿前左右邊鋪上 2×4 沙漠米光磚，呈現俐落展示底座質感。' },
    { step: 3,  bag: 1, title: '定位曜石黑廠房基座',                 tip: '在左側主廠房與右側公用廠位置鋪設深色底層。' },
    { step: 4,  bag: 2, title: '堆疊淺藍灰主晶圓廠核心牆體',         tip: '雙層堆疊淺藍灰標準磚，上方以深藍灰屋頂板封層。' },
    { step: 5,  bag: 2, title: '加裝外部深灰與曜石黑垂直扶壁柱',     tip: '在正面與左側安裝高聳的 1×2×2 結構扶壁柱，重現工業堡壘氣勢。' },
    { step: 6,  bag: 2, title: '收邊深灰女兒牆與圓形 TSMC 徽章',     tip: '沿屋頂前後鋪上深灰光磚，於前右角扣上專屬圓形 TSMC 晶圓徽章。' },
    { step: 7,  bag: 3, title: '配置 4 組沙漠米色屋頂空調機組',      tip: '對稱擺放 2×4 沙漠米光磚作為大型無塵室外氣空調箱。' },
    { step: 8,  bag: 3, title: '佈線金屬銀製程管排陣列',             tip: '縱橫架設金屬銀 4L 管線圓桿。' },
    { step: 9,  bag: 3, title: '安裝 5 座圓柱製程槽與散熱格柵',      tip: '金屬銀圓柱磚頂部扣上沙漠米圓薄片，搭配深米棕散熱格柵。' },
    { step: 10, bag: 4, title: '搭設跨棟雙層管線空橋',               tip: '建立上下兩條連接主廠房與右側 CUP 的管線廊道。' },
    { step: 11, bag: 4, title: '建造右側中央公用系統廠 (CUP)',       tip: '以深藍灰標準磚堆疊右側附屬廠房，正面加上黑色垂直柱飾。' },
    { step: 12, bag: 4, title: '安裝雙排 10 座冷卻風扇與透藍水池',  tip: '屋頂後半部排滿雙排金屬銀圓形風扇，前半部鋪上透亮水藍冷卻池！' }
  ],
  bricks: buildBricks()
};
