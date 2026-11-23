import { place } from '../legoCatalog.js';

function buildBricks() {
  const B = [];
  const add = (part, color, xMin, y, zMin, rot, bag, step) => B.push(place(part, color, xMin, y, zMin, rot, bag, step));

  // =========================================================================
  // BAG 1: 研發中心底板、左側綠樹林道、銀色晶圓雕塑與斜坡車道 (Steps 1–3)
  // Grid: X = -12..12 (24 studs), Z = -8..8 (16 studs)
  // =========================================================================
  // Step 1: Exact-tiled 24 x 16 Baseplate (y = 0, ZERO overlap)
  add('plate_8x16', 'LIGHT_BLUISH_GRAY', -12, 0, -8, 0, 1, 1); // X -12..-4
  add('plate_8x16', 'LIGHT_BLUISH_GRAY',  -4, 0, -8, 0, 1, 1); // X -4..4
  add('plate_8x16', 'WHITE',               4, 0, -8, 0, 1, 1); // X 4..12

  // Step 2: Left Green Lawn Strip, 4 Trees & Iconic Stacked Silver Wafer Sculpture
  add('plate_1x8', 'BRIGHT_GREEN', -12, 1, -6, 0, 1, 2); // X -12..-11, Z -6..2
  add('plate_2x4', 'BRIGHT_GREEN', -10, 1,  5, 1, 1, 2); // X -10..-6, Z 5..7
  for (let z = -6; z <= 0; z += 2) {
    add('plant_stem', 'BRIGHT_GREEN', -12, 2, z, 0, 1, 2);
  }
  // Dark gray sculpture plaza (X -6..-2, Z 4..8) & metallic-silver stacked circular wafer sculpture
  add('plate_4x4',       'DARK_BLUISH_GRAY',  -6, 1, 4, 0, 1, 2);
  add('round_plate_2x2', 'FLAT_SILVER',       -5, 2, 5, 0, 1, 2);
  add('round_plate_2x2', 'LIGHT_BLUISH_GRAY', -5, 3, 5, 0, 1, 2);
  add('round_plate_2x2', 'FLAT_SILVER',       -5, 4, 5, 0, 1, 2);
  add('round_tile_2x2',  'FLAT_SILVER',       -5, 5, 5, 0, 1, 2);

  // Step 3: Front White Perimeter Curb & Right Sloped Driveway Ramp (Z 6..8)
  add('tile_2x4',         'WHITE', -2, 1, 6, 1, 1, 3); // X -2..2
  add('tile_2x4',         'WHITE',  2, 1, 6, 1, 1, 3); // X 2..6
  add('curved_slope_2x2', 'WHITE',  6, 1, 6, 1, 1, 3); // X 6..8
  add('tile_2x4',         'WHITE',  8, 1, 6, 1, 1, 3); // X 8..12

  // =========================================================================
  // BAG 2: 後方沙藍色研發晶圓廠與精密屋頂管排 (Steps 4–6)
  // Rear Fab: X -10..2 (12 studs), Z -8..-2 (6 studs), Y 1..8
  // =========================================================================
  // Step 4: Rear Sand-Blue Fab Hall Outer Walls
  for (let x = -10; x < 2; x += 2) {
    add('brick_2x6', 'SAND_BLUE', x, 1, -8, 0, 2, 4);
    add('brick_2x6', 'SAND_BLUE', x, 4, -8, 0, 2, 4);
  }
  add('plate_6x12', 'LIGHT_BLUISH_GRAY', -10, 7, -8, 1, 2, 4); // Exact X -10..2, Z -8..-2!

  // Step 5: White Rooftop Parapet Trim Around Rear Fab (Y = 8)
  add('tile_1x6', 'WHITE', -10, 8, -8, 1, 2, 5); // X -10..-4, Z -8..-7
  add('tile_1x6', 'WHITE',  -4, 8, -8, 1, 2, 5); // X -4..2,   Z -8..-7
  add('tile_1x4', 'WHITE', -10, 8, -7, 0, 2, 5); // X -10..-9, Z -7..-3

  // Step 6: Dense Rear Rooftop Exhaust Stacks, Silver Pipes & Tan Tanks (Y = 8, inside X -9..2, Z -7..-2)
  const rearStacks = [[-9, -7], [-8, -7], [-9, -5], [-3, -7], [-2, -7], [0, -6]];
  for (const [rx, rz] of rearStacks) {
    add('round_brick_1x1', 'FLAT_SILVER', rx, 8, rz, 0, 2, 6);
    add('round_plate_1x1', 'TAN',         rx, 11, rz, 0, 2, 6);
  }
  add('bar_1x4',  'FLAT_SILVER', -7, 8, -7, 1, 2, 6); // X -7..-3, Z -7..-6
  add('bar_1x4',  'PEARL_GOLD',  -7, 8, -5, 1, 2, 6); // X -7..-3, Z -5..-4
  add('tile_2x4', 'WHITE',       -8, 8, -4, 1, 2, 6); // X -8..-4, Z -4..-2

  // =========================================================================
  // BAG 3: 兩側深黑格柵機電翼樓與入口迎賓雨遮 (Steps 7–9)
  // Left Wing: X -9..-7, Z -1..3 | Center Core: X -5..7, Z -1..3 | Right Wing: X 7..9, Z -1..3
  // =========================================================================
  // Step 7: Left Dark-Gray/Black Louvered Wing (X -9..-7, Z -1..3)
  add('brick_2x4', 'BLACK',            -9, 1, -1, 0, 3, 7);
  add('plate_2x4', 'DARK_BLUISH_GRAY', -9, 4, -1, 0, 3, 7);
  add('brick_2x4', 'BLACK',            -9, 5, -1, 0, 3, 7);
  add('tile_2x4',  'DARK_BLUISH_GRAY', -9, 8, -1, 0, 3, 7);

  // Step 8: Right Dark-Gray/Black Louvered Wing (X 7..9, Z -1..3)
  add('brick_2x4', 'BLACK',            7, 1, -1, 0, 3, 8);
  add('plate_2x4', 'DARK_BLUISH_GRAY', 7, 4, -1, 0, 3, 8);
  add('brick_2x4', 'BLACK',            7, 5, -1, 0, 3, 8);
  add('tile_2x4',  'DARK_BLUISH_GRAY', 7, 8, -1, 0, 3, 8);

  // Step 9: Front R&D Hall Core Base (X -5..7, Z -1..3) & Glass-Trimmed Entrance Canopy (X 2..4, Z 4..6)
  add('plate_4x6', 'DARK_BLUISH_GRAY', -5, 1, -1, 1, 3, 9); // X -5..1, Z -1..3
  add('plate_4x6', 'DARK_BLUISH_GRAY',  1, 1, -1, 1, 3, 9); // X 1..7,  Z -1..3
  add('brick_2x6', 'DARK_BLUISH_GRAY', -5, 2, -1, 1, 3, 9); // X -5..1, Z -1..1
  add('brick_2x6', 'DARK_BLUISH_GRAY',  1, 2, -1, 1, 3, 9); // X 1..7,  Z -1..1
  // Cantilevered entrance canopy (X 2..4, Z 4..6)
  add('plate_2x2', 'TRANS_LIGHT_BLUE',  2, 3, 4, 0, 3, 9);
  add('tile_2x2',  'WHITE',             2, 4, 4, 0, 3, 9);

  // =========================================================================
  // BAG 4: 標誌性純白 C 型格柵外框、透藍玻璃百葉與天窗 (Steps 10–12)
  // =========================================================================
  // Step 10: Translucent-Cyan Vertical Glass Facade Core (Z = 2..3, X = -4..6, Y = 2..8)
  for (let x = -4; x < 6; x++) {
    add('brick_1x1x2', 'TRANS_LIGHT_BLUE', x, 2, 2, 0, 4, 10);
  }
  add('plate_4x6', 'LIGHT_BLUISH_GRAY', -5, 8, -1, 1, 4, 10); // X -5..1, Z -1..3
  add('plate_4x6', 'LIGHT_BLUISH_GRAY',  1, 8, -1, 1, 4, 10); // X 1..7,  Z -1..3

  // Step 11: Iconic White Vertical Facade Louvers (Z = 3..4), Protruding Center Box & TSMC Logo
  for (let x = -4; x <= 4; x += 2) {
    add('brick_1x1x2', 'WHITE', x, 2, 3, 0, 4, 11);
  }
  // Protruding central white architectural block (X 0..2, Z 4..5, Y 4..7)
  add('brick_1x2',     'WHITE', 0, 4, 4, 1, 4, 11);
  // Left side white frame face (X -6..-5, Z -1..3, Y 2..8) with red 'tsmc' logo
  add('brick_1x4',     'WHITE', -6, 2, -1, 0, 4, 11);
  add('brick_1x4',     'WHITE', -6, 5, -1, 0, 4, 11);
  add('tile_tsmc_1x2', 'WHITE', -6, 8,  0, 0, 4, 11);

  // Step 12: Sleek White Wrap-Around C-Frame Roof & Blue Skylight Strips (Y = 9)
  for (let x = -5; x < 7; x += 2) {
    add('curved_slope_2x2', 'WHITE', x, 9, 2, 0, 4, 12); // Front curved rim Z 2..4
  }
  add('tile_1x6', 'WHITE', -5, 9, -1, 1, 4, 12); // Rear roof trim Z -1..0
  add('tile_1x6', 'WHITE',  1, 9, -1, 1, 4, 12);
  // Iconic blue skylight bars across the roof (Z 0..2)
  for (let x = -4; x <= 5; x += 2) {
    add('tile_1x2', 'TRANS_LIGHT_BLUE', x, 9, 0, 0, 4, 12);
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
  accentColor: '#46C7EC',
  cameraPos: [20, 15, 21],
  cameraTarget: [0, 2.5, 0],
  description: '台灣半導體最前線「台積電全球研發中心」！完整呈現標誌性的純白 C 型現代建築外框、立面垂直透藍玻璃百葉與屋頂天窗陣列、左側 tsmc 紅標、前庭金屬銀堆疊晶圓藝術雕塑、雙側深黑格柵翼樓，以及後方沙藍色潔淨室研發廠房與精密屋頂管排。',
  bags: [
    { id: 1, title: '第 1 包：園區底板、銀色晶圓雕塑與斜坡道', subtitle: 'Baseplate, Wafer Sculpture & Ramp', color: '#8E949A' },
    { id: 2, title: '第 2 包：後方沙藍研發潔淨廠與屋頂管排',   subtitle: 'Rear Sand-Blue Fab & Exhaust Stacks', color: '#5F7F99' },
    { id: 3, title: '第 3 包：左右深黑格柵翼樓與迎賓雨遮',     subtitle: 'Black Louvered Wings & Canopy', color: '#1E2124' },
    { id: 4, title: '第 4 包：純白 C 型格柵主體與透藍天窗',    subtitle: 'White C-Frame, Glass Louvers & Skylights', color: '#46C7EC' }
  ],
  steps: [
    { step: 1,  bag: 1, title: '拼接 24×16 研發中心淺灰與純白底板', tip: '無縫組裝三塊 8×16 基礎底板，預留右側白色車道區塊。' },
    { step: 2,  bag: 1, title: '安裝林蔭步道與金屬銀晶圓疊層雕塑', tip: '於左側種植 4 棵行道樹，前庭疊合 4 層金屬銀 2×2 圓盤打造晶圓意象雕塑。' },
    { step: 3,  bag: 1, title: '鋪設前排純白邊界與弧形斜坡車道',   tip: '右側使用白色 2×2 圓弧屋頂磚做出流暢的地下車道斜坡。' },
    { step: 4,  bag: 2, title: '建置後方沙藍色研發晶圓廠主體',       tip: '雙層堆疊沙藍色標準磚，頂部覆蓋 6×12 淺藍灰大型屋頂板。' },
    { step: 5,  bag: 2, title: '圍築白色屋頂女兒牆邊框',             tip: '以純白長條光磚包覆後方廠房頂部邊緣。' },
    { step: 6,  bag: 2, title: '佈設高密度排氣煙囪與金銀管排',       tip: '立起 6 座金屬銀圓柱排氣塔，搭配金屬銀與珍珠金 4L 管線圓桿。' },
    { step: 7,  bag: 3, title: '組裝左側深黑橫條格柵翼樓',           tip: '黑磚與深灰薄板交錯堆疊，呈現高質感金屬格柵立面。' },
    { step: 8,  bag: 3, title: '對稱組裝右側深黑格柵翼樓',           tip: '於主廳右側對稱建立深黑翼樓，強化建築水平延伸感。' },
    { step: 9,  bag: 3, title: '架設主廳基座與透藍玻璃邊飾雨遮',     tip: '鋪設深灰主廳底層，前方懸挑透水藍與純白雙層入口雨遮。' },
    { step: 10, bag: 4, title: '立起整排透亮水藍玻璃帷幕核心',       tip: '一字排開 10 根 1×1×2 透亮水藍高柱磚，點亮研發中心科技光澤！' },
    { step: 11, bag: 4, title: '扣上純白垂直立面格柵與 tsmc 紅標',   tip: '於玻璃前等距加上純白立面柱與中央凸塊，左側鑲嵌「tsmc」紅標。' },
    { step: 12, bag: 4, title: '覆蓋純白圓弧 C 型屋頂與透藍天窗',    tip: '前緣扣上整排白色圓弧屋頂磚，中央嵌入 5 道透亮水藍採光天窗，完美落成！' }
  ],
  bricks: buildBricks()
};
