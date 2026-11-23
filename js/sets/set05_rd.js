import { place } from '../legoCatalog.js';

function buildBricks() {
  const B = [];
  const add = (part, color, xMin, y, zMin, rot, bag, step) => B.push(place(part, color, xMin, y, zMin, rot, bag, step));

  // =========================================================================
  // BAG 1: 30×20 研發中心底板、林蔭道、金屬銀晶圓雕塑與斜坡車道 (Steps 1–4)
  // Grid: X = -15..15 (30 studs), Z = -10..10 (20 studs) — faithful to img5.jpg
  // =========================================================================
  // Step 1: Exact-tiled 30 x 20 Baseplate (y = 0)
  add('plate_8x16', 'LIGHT_BLUISH_GRAY', -15, 0, -10, 0, 1, 1);
  add('plate_8x16', 'LIGHT_BLUISH_GRAY',  -7, 0, -10, 0, 1, 1);
  add('plate_8x16', 'LIGHT_BLUISH_GRAY',   1, 0, -10, 0, 1, 1);
  add('plate_6x12', 'WHITE',               9, 0, -10, 0, 1, 1);
  add('plate_4x6',  'WHITE',               9, 0,   2, 1, 1, 1);
  add('plate_4x8',  'LIGHT_BLUISH_GRAY', -15, 0,   6, 1, 1, 1);
  add('plate_4x8',  'LIGHT_BLUISH_GRAY',  -7, 0,   6, 1, 1, 1);
  add('plate_4x8',  'WHITE',               1, 0,   6, 1, 1, 1);
  add('plate_4x6',  'WHITE',               9, 0,   6, 1, 1, 1);

  // Step 2: Left Green Lawn Strip, 5 Slender Trees & White Corner Curb
  add('plate_1x8', 'BRIGHT_GREEN', -15, 1, -8, 0, 1, 2);
  add('plate_1x6', 'BRIGHT_GREEN', -15, 1,  0, 0, 1, 2);
  add('plate_2x6', 'BRIGHT_GREEN', -14, 1,  6, 1, 1, 2);
  for (let z = -8; z <= 4; z += 3) {
    add('plant_stem', 'BRIGHT_GREEN', -15, 2, z, 0, 1, 2);
  }
  for (let x = -14; x <= -9; x++) {
    add('slope_1x2', 'WHITE', x, 1, 8, 0, 1, 2);
  }

  // Step 3: Dark-Gray Sculpture Plaza & Iconic 5-Layer Stacked Metallic-Silver Wafer Sculpture!
  add('plate_4x4',       'DARK_BLUISH_GRAY',  -8, 1, 5, 0, 1, 3);
  add('round_plate_2x2', 'FLAT_SILVER',       -7, 2, 6, 0, 1, 3);
  add('round_plate_2x2', 'LIGHT_BLUISH_GRAY', -7, 3, 6, 0, 1, 3);
  add('round_plate_2x2', 'FLAT_SILVER',       -7, 4, 6, 0, 1, 3);
  add('round_plate_2x2', 'LIGHT_BLUISH_GRAY', -7, 5, 6, 0, 1, 3);
  add('round_tile_2x2',  'FLAT_SILVER',       -7, 6, 6, 0, 1, 3);

  // Step 4: Front White Boulevard & Iconic Right Sloped White Driveway Ramp (Z 7..10)
  add('tile_2x4',         'WHITE', -4, 1, 8, 1, 1, 4);
  add('tile_2x4',         'WHITE',  0, 1, 8, 1, 1, 4);
  add('tile_2x4',         'WHITE',  4, 1, 8, 1, 1, 4);
  add('curved_slope_2x2', 'WHITE',  8, 1, 8, 1, 1, 4);
  add('tile_2x4',         'WHITE', 10, 1, 8, 1, 1, 4);

  // =========================================================================
  // BAG 2: 後方大型沙藍色研發潔淨廠與高密度屋頂管排 (Steps 5–8)
  // Rear Fab: X -13..3 (16 studs!), Z -10..-2 (8 studs!), Y 1..8
  // =========================================================================
  // Step 5: Rear Sand-Blue Fab Hall Lower & Upper Walls (16x8 footprint)
  for (let x = -13; x < 3; x += 2) {
    add('brick_2x6', 'SAND_BLUE', x, 1, -10, 0, 2, 5);
    add('brick_2x2', 'SAND_BLUE', x, 1,  -4, 0, 2, 5);
    add('brick_2x6', 'SAND_BLUE', x, 4, -10, 0, 2, 5);
    add('brick_2x2', 'SAND_BLUE', x, 4,  -4, 0, 2, 5);
  }
  add('plate_8x16', 'LIGHT_BLUISH_GRAY', -13, 7, -10, 1, 2, 5); // Exact 16x8 roof!

  // Step 6: White Rooftop Parapet Rim Around Rear Fab (Y = 8)
  add('tile_1x6', 'WHITE', -13, 8, -10, 1, 2, 6);
  add('tile_1x6', 'WHITE',  -7, 8, -10, 1, 2, 6);
  add('tile_1x4', 'WHITE',  -1, 8, -10, 1, 2, 6);
  add('tile_1x6', 'WHITE', -13, 8,  -9, 0, 2, 6);

  // Step 7: Dense Rear Rooftop Exhaust Stacks & Cylindrical Tanks (10 stacks!)
  const rearStacks = [
    [-12, -8], [-11, -8], [-10, -8],
    [-12, -6], [-11, -6],
    [-4, -8],  [-3, -8],  [-2, -8],
    [1, -8],   [2, -8]
  ];
  for (const [rx, rz] of rearStacks) {
    add('round_brick_1x1', 'FLAT_SILVER', rx, 8, rz, 0, 2, 7);
    add('round_plate_1x1', 'TAN',         rx, 11, rz, 0, 2, 7);
  }

  // Step 8: Parallel Gold/Silver Pipe Racks, White Plenums & Cooling Fans on Rear Roof
  add('bar_1x4',  'FLAT_SILVER', -9, 8, -9, 1, 2, 8);
  add('bar_1x4',  'PEARL_GOLD',  -9, 8, -7, 1, 2, 8);
  add('bar_1x4',  'FLAT_SILVER', -9, 8, -5, 1, 2, 8);
  add('tile_2x4', 'WHITE',       -11, 8, -4, 1, 2, 8);
  add('tile_2x4', 'WHITE',        -5, 8, -6, 1, 2, 8);
  for (const [fx, fz] of [[0, -6], [1, -6], [2, -6], [0, -4], [1, -4], [2, -4]]) {
    add('cooling_fan_1x1', 'FLAT_SILVER', fx, 8, fz, 0, 2, 8);
  }

  // =========================================================================
  // BAG 3: 雙側深黑百葉機電翼樓與主廳迎賓雨遮 (Steps 9–11)
  // Left Wing: X -12..-9, Z -1..4 | Center Hall: X -7..9, Z -1..4 | Right Wing: X 9..13, Z -1..4
  // =========================================================================
  // Step 9: Left Black Multi-Layer Fluted-Louver Wing (3x5 footprint)
  for (let y of [1, 5]) {
    add('vent_brick_1x2', 'BLACK', -12, y, -1, 0, 3, 9);
    add('vent_brick_1x2', 'BLACK', -12, y,  1, 0, 3, 9);
    add('vent_brick_1x2', 'BLACK', -11, y, -1, 0, 3, 9);
    add('vent_brick_1x2', 'BLACK', -11, y,  1, 0, 3, 9);
    add('vent_brick_1x2', 'BLACK', -10, y, -1, 0, 3, 9);
    add('vent_brick_1x2', 'BLACK', -10, y,  1, 0, 3, 9);
  }
  add('plate_2x4', 'DARK_BLUISH_GRAY', -12, 4, -1, 0, 3, 9);
  add('plate_1x4', 'DARK_BLUISH_GRAY', -10, 4, -1, 0, 3, 9);
  add('tile_2x4',  'DARK_BLUISH_GRAY', -12, 8, -1, 0, 3, 9);
  add('tile_1x4',  'DARK_BLUISH_GRAY', -10, 8, -1, 0, 3, 9);

  // Step 10: Right Black Multi-Layer Fluted-Louver Wing (4x4 footprint: X 9..13, Z -1..3)
  for (let y of [1, 5]) {
    for (let x = 9; x < 13; x++) {
      add('vent_brick_1x2', 'BLACK', x, y, -1, 0, 3, 10);
      add('vent_brick_1x2', 'BLACK', x, y,  1, 0, 3, 10);
    }
  }
  add('plate_4x4', 'DARK_BLUISH_GRAY', 9, 4, -1, 0, 3, 10);
  add('tile_4x4_alt' === 'x' ? 'tile_2x4' : 'tile_2x4', 'DARK_BLUISH_GRAY', 9, 8, -1, 0, 3, 10);
  add('tile_2x4',  'DARK_BLUISH_GRAY', 11, 8, -1, 0, 3, 10);

  // Step 11: Front R&D Hall Core Base (X -7..9 -> 16x5) & Glass-Trimmed Entrance Canopy
  add('plate_4x8', 'DARK_BLUISH_GRAY', -7, 1, -1, 1, 3, 11); // X -7..1, Z -1..3
  add('plate_4x8', 'DARK_BLUISH_GRAY',  1, 1, -1, 1, 3, 11); // X 1..9,  Z -1..3
  add('brick_2x6', 'DARK_BLUISH_GRAY', -7, 2, -1, 1, 3, 11);
  add('brick_2x4', 'DARK_BLUISH_GRAY', -1, 2, -1, 1, 3, 11);
  add('brick_2x6', 'DARK_BLUISH_GRAY',  3, 2, -1, 1, 3, 11);
  // Cantilevered white & cyan glass entrance canopy (X 3..6, Z 5..7)
  add('plate_2x3', 'TRANS_LIGHT_BLUE',  3, 3,  5, 1, 3, 11);
  add('tile_2x3',  'WHITE',             3, 4,  5, 1, 3, 11);

  // =========================================================================
  // BAG 4: 標誌性純白 C 型格柵主體、14 道透藍百葉與 12 道天窗 (Steps 12–16)
  // =========================================================================
  // Step 12: 14-Column Glowing Translucent-Cyan Glass Curtain Wall (X -6..8, Z 2..3, Y 2..8)
  for (let x = -6; x < 8; x++) {
    add('brick_1x1x2', 'TRANS_LIGHT_BLUE', x, 2, 2, 0, 4, 12);
  }
  add('plate_4x8', 'LIGHT_BLUISH_GRAY', -7, 8, -1, 1, 4, 12);
  add('plate_4x8', 'LIGHT_BLUISH_GRAY',  1, 8, -1, 1, 4, 12);

  // Step 13: Iconic White Vertical Facade Louvers & Protruding Center Box (Z 3..4)
  for (let x = -6; x <= 6; x += 2) {
    add('brick_1x1x2', 'WHITE', x, 2, 3, 0, 4, 13);
  }
  add('brick_1x1x2', 'WHITE', 8, 2, 3, 0, 4, 13);
  // Protruding central white architectural block (X 0..2, Z 4..5, Y 4..7)
  add('brick_1x2', 'WHITE', 0, 4, 4, 1, 4, 13);

  // Step 14: Left White C-Frame Cheek Wall & VERTICAL SNOT 'tsmc' Red Logo!
  add('brick_1x4',     'WHITE', -8, 2, -1, 0, 4, 14);
  add('brick_1x4',     'WHITE', -8, 5, -1, 0, 4, 14);
  add('tile_1x4',      'WHITE', -8, 8, -1, 0, 4, 14);
  add('wall_tsmc_1x2', 'WHITE', -8, 4,  3, 0, 4, 14); // Vertical red 'tsmc' facing front!

  // Step 15: Sleek White Wrap-Around C-Frame Curved Roof Front & Rear Rim (Y 9)
  for (let x = -7; x < 9; x += 2) {
    add('curved_slope_2x2', 'WHITE', x, 9, 2, 0, 4, 15);
  }
  add('tile_1x6', 'WHITE', -7, 9, -1, 1, 4, 15);
  add('tile_1x6', 'WHITE', -1, 9, -1, 1, 4, 15);
  add('tile_1x4', 'WHITE',  5, 9, -1, 1, 4, 15);

  // Step 16: 12 Iconic Parallel Trans-Cyan Skylight Bars Across Roof (Z 0..2, Y 9)
  for (let x = -6; x <= 7; x++) {
    if (x % 2 === 0) {
      add('tile_1x2', 'TRANS_LIGHT_BLUE', x, 9, 0, 0, 4, 16);
    } else {
      add('tile_1x2', 'LIGHT_BLUISH_GRAY', x, 9, 0, 0, 4, 16);
    }
  }

  return B;
}

export const SET_05_RD = {
  id: 'set05_rd',
  setNumber: '21039',
  shortName: '全球研發中心',
  name: '台積電全球研發中心 (Global R&D Center)',
  englishName: 'TSMC Global R&D Center, Hsinchu',
  location: '台灣・新竹寶山 (Baoshan, Hsinchu, Taiwan)',
  age: '18+',
  year: '2024',
  refImage: 'assets/ref/set05.jpg',
  accentColor: '#3AC5ED',
  cameraPos: [26, 19, 27],
  cameraTarget: [0, 2.8, 0],
  description: '高密度 30×20 規格重現台灣半導體最前線「台積電全球研發中心」！完整呈現標誌性純白 C 型現代外框、14 道透亮水藍玻璃帷幕與 8 根純白垂直立面格柵、屋頂 14 道交錯藍灰天窗、左側立面垂直「tsmc」紅標、5 層金屬銀晶圓雕塑、雙側共 28 塊深黑百葉紋翼樓，以及後方 16×8 沙藍色研發潔淨廠與 10 座排氣塔。',
  bags: [
    { id: 1, title: '第 1 包：30×20 底板、銀色晶圓雕塑與斜坡道', subtitle: '30x20 Base, Wafer Sculpture & Ramp', color: '#92989F' },
    { id: 2, title: '第 2 包：後方 16×8 沙藍潔淨廠與 10 座排氣塔', subtitle: 'Rear 16x8 Sand-Blue Fab & Stacks', color: '#5B7B95' },
    { id: 3, title: '第 3 包：左右深黑百葉翼樓與迎賓雨遮',         subtitle: 'Fluted Black Wings & Canopy', color: '#1D2024' },
    { id: 4, title: '第 4 包：純白 C 型格柵主體與透藍天窗陣列',   subtitle: 'White C-Frame, Louvers & Skylights', color: '#3AC5ED' }
  ],
  steps: [
    { step: 1,  bag: 1, title: '拼接 30×20 研發中心淺灰與純白底板', tip: '無縫組裝 9 塊大型薄板，右側預留純白車道區塊。' },
    { step: 2,  bag: 1, title: '種植 5 棵林蔭行道樹與前排白路擋',   tip: '沿左側綠帶插上 5 棵樹苗，前緣排列 6 組白色斜面路擋。' },
    { step: 3,  bag: 1, title: '疊砌 5 層金屬銀晶圓藝術雕塑',       tip: '於前庭深灰廣場交替疊合 5 層金屬銀與淺灰 2×2 圓盤。' },
    { step: 4,  bag: 1, title: '鋪設前排白色大道與弧形斜坡車道',     tip: '右側以白色 2×2 圓弧屋頂磚銜接流暢車道斜坡。' },
    { step: 5,  bag: 2, title: '建置後方 16×8 沙藍色研發潔淨廠',     tip: '雙層堆疊沙藍色標準磚並覆蓋 8×16 淺灰屋頂板。' },
    { step: 6,  bag: 2, title: '圍築白色屋頂女兒牆邊框',             tip: '以純白長條光磚包覆後方廠房頂部邊緣。' },
    { step: 7,  bag: 2, title: '安裝 10 座銀柱米蓋排氣塔陣列',       tip: '在後方廠房屋頂整齊排布 10 座圓柱排氣塔。' },
    { step: 8,  bag: 2, title: '佈設金銀管排、空調箱與 6 座冷卻風扇', tip: '架設三道金銀 4L 管線、白色空調箱與 6 座冷卻風扇。' },
    { step: 9,  bag: 3, title: '組裝左側深黑百葉紋格柵翼樓',         tip: '使用 12 塊黑色 1×2 百葉紋建築磚打造高質感金屬橫柵。' },
    { step: 10, bag: 3, title: '對稱組裝右側深黑百葉紋翼樓',         tip: '於右側以 16 塊黑色百葉紋磚對稱建立大型翼樓。' },
    { step: 11, bag: 3, title: '架設 16×4 主廳基座與透藍玻璃雨遮',   tip: '鋪設深灰主廳底層，前方懸挑透水藍與純白雙層入口雨遮。' },
    { step: 12, bag: 4, title: '立起 14 根透亮水藍玻璃帷幕核心',     tip: '一字排開 14 根 1×1×2 透亮水藍高柱磚，點亮研發中心科技光澤！' },
    { step: 13, bag: 4, title: '扣上純白垂直立面格柵與中央凸塊',     tip: '於玻璃前等距加上 8 根純白立面柱與中央純白凸出量體。' },
    { step: 14, bag: 4, title: '建構左側純白外框與立面 tsmc 紅標',   tip: '砌起左側白色外框並正面垂直掛載 SNOT「tsmc」紅標。' },
    { step: 15, bag: 4, title: '覆蓋 8 段純白圓弧 C 型屋頂前緣',     tip: '扣上 8 塊 2×2 純白圓弧屋頂磚與後方光磚收邊。' },
    { step: 16, bag: 4, title: '嵌入 14 道透藍與淺灰交錯採光天窗',   tip: '屋頂中央交錯鋪滿透亮水藍與淺灰光磚，全球研發中心完美落成！' }
  ],
  bricks: buildBricks()
};
