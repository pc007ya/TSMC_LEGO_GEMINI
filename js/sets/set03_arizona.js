import { place } from '../legoCatalog.js';

function buildBricks() {
  const B = [];
  const add = (part, color, xMin, y, zMin, rot, bag, step) => B.push(place(part, color, xMin, y, zMin, rot, bag, step));

  // =========================================================================
  // BAG 1: 32×18 亞利桑那沙漠米色光滑底板與廠區地基 (Steps 1–4)
  // Grid: X = -16..16 (32 studs), Z = -9..9 (18 studs) — faithful to img3.jpg
  // =========================================================================
  // Step 1: Exact-tiled 32 x 18 Desert Tan Baseplate (y = 0)
  add('plate_8x16', 'TAN', -16, 0, -9, 0, 1, 1);
  add('plate_8x16', 'TAN',  -8, 0, -9, 0, 1, 1);
  add('plate_8x16', 'TAN',   0, 0, -9, 0, 1, 1);
  add('plate_8x16', 'TAN',   8, 0, -9, 0, 1, 1);
  add('plate_2x8',  'TAN', -16, 0,  7, 1, 1, 1);
  add('plate_2x8',  'TAN',  -8, 0,  7, 1, 1, 1);
  add('plate_2x8',  'TAN',   0, 0,  7, 1, 1, 1);
  add('plate_2x8',  'TAN',   8, 0,  7, 1, 1, 1);

  // Step 2: Smooth Desert Tan Border Tiles All Around (y = 1)
  for (let x = -16; x < 16; x += 4) {
    add('tile_2x4', 'TAN', x, 1,  7, 1, 1, 2); // Front Z 7..9
    add('tile_2x4', 'TAN', x, 1, -9, 1, 1, 2); // Rear Z -9..-7
  }
  for (let z = -7; z < 5; z += 4) {
    add('tile_2x4', 'TAN', -16, 1, z, 0, 1, 2); // Left X -16..-14
    add('tile_2x4', 'TAN',  14, 1, z, 0, 1, 2); // Right X 14..16
  }
  add('tile_2x2', 'TAN', -16, 1, 5, 0, 1, 2);
  add('tile_2x2', 'TAN',  14, 1, 5, 0, 1, 2);

  // Step 3: Main Fab 21 Black Sub-Foundation Plinth (X -12..2 -> 14x12: Z -7..5)
  add('plate_6x12', 'BLACK', -12, 1, -7, 0, 1, 3); // X -12..-6, Z -7..5
  add('plate_6x12', 'BLACK',  -6, 1, -7, 0, 1, 3); // X -6..0,   Z -7..5
  add('plate_2x6',  'BLACK',   0, 1, -7, 0, 1, 3); // X 0..2,    Z -7..-1
  add('plate_2x6',  'BLACK',   0, 1, -1, 0, 1, 3); // X 0..2,    Z -1..5

  // Step 4: Right Central Utility Plant (CUP) Foundation Plinth (X 6..12 -> 6x10: Z -7..3)
  add('plate_6x8', 'DARK_BLUISH_GRAY', 6, 1, -7, 0, 1, 4); // Z -7..1
  add('plate_2x6', 'DARK_BLUISH_GRAY', 6, 1,  1, 1, 1, 4); // Z 1..3

  // =========================================================================
  // BAG 2: Fab 21 重裝工業主廠房、重型扶壁柱與立面圓形 TSMC 徽章 (Steps 5–8)
  // Main Fab: X -12..2 (14 studs), Z -7..5 (12 studs), Y 2..9
  // =========================================================================
  // Step 5: Main Cleanroom Lower Walls (Light Bluish Gray, Y 2..5)
  for (let x = -12; x < 2; x += 2) {
    add('brick_2x6', 'LIGHT_BLUISH_GRAY', x, 2, -7, 0, 2, 5);
    add('brick_2x6', 'LIGHT_BLUISH_GRAY', x, 2, -1, 0, 2, 5);
  }

  // Step 6: Main Cleanroom Upper Walls (Y 5..8) & Dark-Gray Roof Deck (Y 8)
  for (let x = -12; x < 2; x += 2) {
    add('brick_2x6', 'LIGHT_BLUISH_GRAY', x, 5, -7, 0, 2, 6);
    add('brick_2x6', 'LIGHT_BLUISH_GRAY', x, 5, -1, 0, 2, 6);
  }
  add('plate_6x12', 'DARK_BLUISH_GRAY', -12, 8, -7, 0, 2, 6);
  add('plate_6x12', 'DARK_BLUISH_GRAY',  -6, 8, -7, 0, 2, 6);
  add('plate_2x6',  'DARK_BLUISH_GRAY',   0, 8, -7, 0, 2, 6);
  add('plate_2x6',  'DARK_BLUISH_GRAY',   0, 8, -1, 0, 2, 6);

  // Step 7: Heavy Vertical Exterior Buttress Columns (4 front dark-gray + 4 left black)
  for (const cx of [-11, -7, -3]) {
    add('brick_1x2x2', 'DARK_BLUISH_GRAY', cx, 2, 5, 1, 2, 7);
    add('tile_1x2',    'DARK_BLUISH_GRAY', cx, 8, 5, 1, 2, 7);
  }
  for (const cz of [-6, -3, 0, 3]) {
    add('brick_1x2x2', 'BLACK', -13, 2, cz, 0, 2, 7);
    add('tile_1x2',    'BLACK', -13, 8, cz, 0, 2, 7);
  }

  // Step 8: Dark-Gray Parapet Rim & VERTICAL SNOT Circular TSMC Wafer Emblem!
  add('tile_1x6', 'DARK_BLUISH_GRAY', -12, 9,  4, 1, 2, 8);
  add('tile_1x6', 'DARK_BLUISH_GRAY',  -6, 9,  4, 1, 2, 8);
  add('tile_1x2', 'DARK_BLUISH_GRAY',   0, 9,  4, 1, 2, 8);
  add('tile_1x6', 'DARK_BLUISH_GRAY', -12, 9, -7, 1, 2, 8);
  add('tile_1x6', 'DARK_BLUISH_GRAY',  -6, 9, -7, 1, 2, 8);
  add('tile_1x2', 'DARK_BLUISH_GRAY',   0, 9, -7, 1, 2, 8);
  // VERTICAL SNOT Circular Red-Wafer TSMC Emblem on front-right facade (X 0..2, Z 5..6, Y 3..8)
  add('wall_tsmc_round_2x2', 'WHITE', 0, 3, 5, 0, 2, 8);

  // =========================================================================
  // BAG 3: 超高密度沙漠廠務屋頂 (空調箱、金屬銀管排與 14 座儲槽) (Steps 9–12)
  // Inner roof: X -12..2, Z -6..4, Y = 9
  // =========================================================================
  // Step 9: 6 Tan Rectangular HVAC Air Handling Units
  for (const x of [-11, -6, -2]) {
    add('tile_2x4', 'TAN', x, 9,  2, 1, 3, 9); // Front row Z 2..4
    add('tile_2x4', 'TAN', x, 9, -5, 1, 3, 9); // Rear row Z -5..-3
  }

  // Step 10: High-Density Flat-Silver Piping Grid (8 parallel pipe runs!)
  for (const x of [-11, -6, -2]) {
    add('bar_1x4', 'FLAT_SILVER', x, 9,  0, 1, 3, 10);
    add('bar_1x4', 'FLAT_SILVER', x, 9, -2, 1, 3, 10);
  }
  add('bar_1x4', 'FLAT_SILVER', -12, 9, -4, 0, 3, 10);
  add('bar_1x4', 'FLAT_SILVER', -12, 9,  0, 0, 3, 10);

  // Step 11: 12 Cylindrical Process Tanks & Scrubber Stacks (Silver + Tan caps)
  const tanks = [
    [-7, -5], [-7, -4], [-7, -1], [-7, 2], [-7, 3],
    [-11, -1], [-10, -1], [-5, -1], [-4, -1],
    [-1, -1], [0, -1], [1, -1]
  ];
  for (const [tx, tz] of tanks) {
    add('round_brick_1x1', 'FLAT_SILVER', tx, 9, tz, 0, 3, 11);
    add('round_plate_1x1', 'TAN',         tx, 12, tz, 0, 3, 11);
  }

  // Step 12: Dark-Tan Rooftop Louver Grilles & Metallic Exhaust Vents
  for (const [gx, gz] of [[-10, 1], [-8, 1], [-5, 1], [-3, 1], [-1, 1], [-10, -6], [-6, -6], [-2, -6]]) {
    add('tile_grille', 'DARK_TAN', gx, 9, gz, 1, 3, 12);
  }

  // =========================================================================
  // BAG 4: 跨棟管線空橋與右側中央公用系統廠 (CUP 雙排 12 座風扇與冷卻水池) (Steps 13–16)
  // Bridge: X 2..6 (4 studs) | CUP: X 6..12 (6 studs), Z -7..3 (10 studs)
  // =========================================================================
  // Step 13: Dual-Level Skybridge & Lower Utility Pipe Corridor (X 2..6)
  add('brick_2x4', 'DARK_BLUISH_GRAY',  2, 1,  0, 1, 4, 13);
  add('tile_2x4',  'LIGHT_BLUISH_GRAY', 2, 4,  0, 1, 4, 13);
  add('brick_2x4', 'DARK_BLUISH_GRAY',  2, 4, -4, 1, 4, 13);
  add('tile_2x4',  'DARK_BLUISH_GRAY',  2, 7, -4, 1, 4, 13);

  // Step 14: Right Central Utility Plant (CUP) Dark-Gray Walls (6x10, Y 2..8)
  for (let x = 6; x < 12; x += 2) {
    add('brick_2x6', 'DARK_BLUISH_GRAY', x, 2, -7, 0, 4, 14);
    add('brick_2x4', 'DARK_BLUISH_GRAY', x, 2, -1, 0, 4, 14);
    add('brick_2x6', 'DARK_BLUISH_GRAY', x, 5, -7, 0, 4, 14);
    add('brick_2x4', 'DARK_BLUISH_GRAY', x, 5, -1, 0, 4, 14);
  }
  // Heavy black front buttress on CUP
  add('brick_1x2x2', 'BLACK', 8, 2, 3, 1, 4, 14);

  // Step 15: Translucent Cyan Cooling Water Basin on Front Half of CUP Roof (Y 8, Z 0..3)
  for (let x = 6; x < 12; x += 2) {
    add('tile_2x3', 'TRANS_LIGHT_BLUE', x, 8, 0, 0, 4, 15);
  }

  // Step 16: Twin Rows of 12 Detailed Metallic Cooling Tower Fans (Y 8, Z -7..-1)
  for (let z = -7; z <= -2; z++) {
    add('cooling_fan_1x1', 'FLAT_SILVER',  7, 8, z, 0, 4, 16);
    add('cooling_fan_1x1', 'FLAT_SILVER', 10, 8, z, 0, 4, 16);
  }
  add('bar_1x4', 'FLAT_SILVER', 8, 8, -6, 0, 4, 16);
  add('bar_1x4', 'FLAT_SILVER', 9, 8, -6, 0, 4, 16);

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
  accentColor: '#C8A35A',
  cameraPos: [27, 20, 27],
  cameraTarget: [0, 2.5, 0],
  description: '高密度 32×18 規格展現台積電美國亞利桑那州 Fab 21 的硬派沙漠工業堡壘！以整圈沙漠米色平滑光磚地基托起 14×12 重裝扶壁柱主廠房，前右立面垂直掛載官方圓形紅晶圓 TSMC 徽章，屋頂密佈 6 組米色空調箱、8 段銀色管排、12 座圓柱製程槽與 8 組散熱格柵，並經雙層空橋連接右側具備 12 座金屬冷卻風扇與透藍水池的中央公用系統廠 (CUP)。',
  bags: [
    { id: 1, title: '第 1 包：32×18 沙漠底板與雙棟地基',     subtitle: '32x18 Desert Tan Base & Plinths', color: '#DAC596' },
    { id: 2, title: '第 2 包：14×12 重裝廠房與立面徽章',    subtitle: 'Main Fab Walls, Buttresses & Emblem', color: '#555C63' },
    { id: 3, title: '第 3 包：超高密度屋頂管排與 12 座儲槽', subtitle: 'Ultra-Dense Rooftop HVAC & Tanks', color: '#92989F' },
    { id: 4, title: '第 4 包：雙層空橋與 CUP 12 座冷卻風扇', subtitle: 'Skybridge & 12-Fan Cooling Plant', color: '#3AC5ED' }
  ],
  steps: [
    { step: 1,  bag: 1, title: '拼接 32×18 亞利桑那沙漠米色底板',   tip: '無縫組合沙漠米 (Tan) 薄板構成寬闊沙漠廠區基底。' },
    { step: 2,  bag: 1, title: '鋪設四周沙漠米色平滑邊框光磚',       tip: '沿四邊滿鋪 2×4 沙漠米光磚，營造典藏展示底座質感。' },
    { step: 3,  bag: 1, title: '定位左側 14×12 曜石黑主廠房基座',   tip: '鋪設主晶圓廠深黑地基薄板。' },
    { step: 4,  bag: 1, title: '定位右側 6×10 公用系統廠基座',       tip: '於右側鋪設深藍灰公用廠 (CUP) 地基。' },
    { step: 5,  bag: 2, title: '砌築 14×12 主廠房下層淺灰牆體',     tip: '排滿第一層淺藍灰標準磚形成厚實廠房量體。' },
    { step: 6,  bag: 2, title: '堆疊上層牆體與深灰屋頂底板',         tip: '疊加第二層淺藍灰牆並鋪設深藍灰屋頂結構板。' },
    { step: 7,  bag: 2, title: '加裝外部 7 根重型垂直扶壁柱',        tip: '正面 3 根深灰、左側 4 根曜石黑高柱，重現沙漠工業堡壘氣勢。' },
    { step: 8,  bag: 2, title: '收邊女兒牆與立面圓形 TSMC 徽章',     tip: '前後收邊深灰光磚，於正面右角垂直掛載官方圓形紅晶圓 TSMC 徽章。' },
    { step: 9,  bag: 3, title: '配置前後雙排 6 組大型米色空調箱',    tip: '整齊擺放 6 塊 2×4 沙漠米光磚空調箱。' },
    { step: 10, bag: 3, title: '佈線 8 段金屬銀高密度管排陣列',      tip: '縱橫架設 8 條金屬銀 4L 管線圓桿。' },
    { step: 11, bag: 3, title: '安裝 12 座銀柱米蓋製程儲槽',         tip: '於屋頂精密排列 12 座金屬銀圓柱磚與沙漠米圓蓋。' },
    { step: 12, bag: 3, title: '鋪設 8 組深米棕屋頂散熱格柵',        tip: '補齊前後排散熱格柵光磚，完成極致微縮屋頂細節。' },
    { step: 13, bag: 4, title: '搭設跨棟雙層管線空橋與下層廊道',     tip: '建立兩條連接主廠房與 CUP 的高架與地面管線廊道。' },
    { step: 14, bag: 4, title: '建造右側 6×10 中央公用系統廠 (CUP)', tip: '以深藍灰標準磚堆疊 CUP 主體並加上正面黑色扶壁柱。' },
    { step: 15, bag: 4, title: '鋪設 CUP 前半部透亮水藍冷卻水池',    tip: '以三塊 2×3 透亮水藍光磚打造清澈冷卻水池。' },
    { step: 16, bag: 4, title: '安裝雙排 12 座金屬冷卻塔風扇',       tip: '屋頂後半部排滿 6×2 共 12 座銀框黑芯冷卻風扇，亞利桑那廠完工！' }
  ],
  bricks: buildBricks()
};
