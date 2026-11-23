import { place } from '../legoCatalog.js';

function buildBricks() {
  const B = [];
  const add = (part, color, xMin, y, zMin, rot, bag, step) => B.push(place(part, color, xMin, y, zMin, rot, bag, step));

  // =========================================================================
  // BAG 1: 20×20 建築典藏黑框底座、圓形中庭水池、銘牌與林蔭草坪 (Steps 1–4)
  // Grid: X = -10..10 (20 studs), Z = -10..10 (20 studs) — exact match to img4.jpg
  // =========================================================================
  // Step 1: 20x20 Dark-Brown Architecture Collector Baseplate (y = 0)
  add('plate_16x16', 'DARK_BROWN', -10, 0, -10, 0, 1, 1); // X -10..6,  Z -10..6
  add('plate_4x8',   'DARK_BROWN',   6, 0, -10, 0, 1, 1); // X 6..10,   Z -10..-2
  add('plate_4x8',   'DARK_BROWN',   6, 0,  -2, 0, 1, 1); // X 6..10,   Z -2..6
  add('plate_4x4',   'DARK_BROWN',   6, 0,   6, 0, 1, 1); // X 6..10,   Z 6..10
  add('plate_4x8',   'DARK_BROWN', -10, 0,   6, 1, 1, 1); // X -10..-2, Z 6..10
  add('plate_4x8',   'DARK_BROWN',  -2, 0,   6, 1, 1, 1); // X -2..6,   Z 6..10

  // Step 2: 18x18 Light-Bluish-Gray Inner Architectural Curb & Courtyard Floor (y = 1, X -9..9, Z -9..9)
  add('plate_6x12', 'LIGHT_BLUISH_GRAY', -9, 1, -9, 0, 1, 2); // X -9..-3, Z -9..3
  add('plate_6x12', 'LIGHT_BLUISH_GRAY', -3, 1, -9, 0, 1, 2); // X -3..3,  Z -9..3
  add('plate_6x12', 'LIGHT_BLUISH_GRAY',  3, 1, -9, 0, 1, 2); // X 3..9,   Z -9..3
  add('plate_6x6_x' === 'a' ? 'plate_6x8' : 'plate_6x8', 'LIGHT_BLUISH_GRAY', -9, 1, 3, 1, 1, 2); // X -9..-1, Z 3..9
  add('plate_6x8',  'LIGHT_BLUISH_GRAY', -1, 1, 3, 1, 1, 2); // X -1..7,  Z 3..9
  add('plate_2x6',  'LIGHT_BLUISH_GRAY',  7, 1, 3, 0, 1, 2); // X 7..9,   Z 3..9

  // Step 3: Recessed Circular Courtyard Fountain Ring (X -7..-1, Z 2..8) & Sloped Nameplate
  // Smooth dark-gray courtyard paving on left
  add('tile_2x4', 'DARK_BLUISH_GRAY', -9, 2, 2, 0, 1, 3);
  add('tile_2x2', 'DARK_BLUISH_GRAY', -9, 2, 6, 0, 1, 3);
  // Circular light-gray fountain ring built from individual 1x1 tiles/plates
  const ringPts = [
    [-6, 2], [-5, 2], [-4, 2], [-3, 2],
    [-7, 3], [-7, 4], [-7, 5], [-7, 6],
    [-2, 3], [-2, 4], [-2, 5], [-2, 6],
    [-6, 7], [-5, 7], [-4, 7], [-3, 7]
  ];
  for (const [rx, rz] of ringPts) {
    add('plate_1x1', 'LIGHT_BLUISH_GRAY', rx, 2, rz, 0, 1, 3);
    add('tile_1x1',  'LIGHT_BLUISH_GRAY', rx, 3, rz, 0, 1, 3);
  }
  // Dark-gray recessed center pedestal
  add('round_plate_2x2', 'DARK_BLUISH_GRAY', -5, 2, 4, 0, 1, 3);
  add('round_tile_2x2',  'DARK_BLUISH_GRAY', -5, 3, 4, 0, 1, 3);
  // Front sloped nameplate "張忠謀大樓 Morris Chang Building" (X -6..-4, Z 8..10, cleanly clears fountain ring)
  add('slope_morris_2x2', 'LIGHT_BLUISH_GRAY', -6, 2, 8, 0, 1, 3);

  // Step 4: Bright-Green Front Lawn & 5 Multi-Layered Brick-Built Trees (X -1..9, Z 6..9)
  add('plate_2x8', 'BRIGHT_GREEN', -1, 2, 7, 1, 1, 4); // X -1..7, Z 7..9
  add('plate_2x2', 'BRIGHT_GREEN',  7, 2, 7, 0, 1, 4); // X 7..9,  Z 7..9
  add('plate_2x6', 'BRIGHT_GREEN',  7, 2, 1, 0, 1, 4); // X 7..9,  Z 1..7
  // 5 detailed trees along the front lawn matching img4.jpg
  const treeCoords = [[-1, 7], [1, 7], [3, 7], [5, 7], [7, 6]];
  for (const [tx, tz] of treeCoords) {
    add('round_brick_1x1', 'REDDISH_BROWN', tx, 3, tz, 0, 1, 4);
    add('flower_1x1',      'DARK_GREEN',    tx, 6, tz, 0, 1, 4);
    add('flower_1x1',      'BRIGHT_GREEN',  tx, 7, tz, 0, 1, 4);
    add('flower_1x1',      'LIME',          tx, 8, tz, 0, 1, 4);
  }
  // Low lush shrubs along right lawn
  for (const [sx, sz] of [[0, 8], [2, 8], [4, 8], [6, 8], [8, 7], [8, 5], [8, 3], [8, 1]]) {
    add('flower_1x1', 'BRIGHT_GREEN', sx, 3, sz, 0, 1, 4);
  }

  // =========================================================================
  // BAG 2: 門前「張忠謀大樓」地標紀念牆 & 左側純白三條紋主翼 (Steps 5–8)
  // =========================================================================
  // Step 5: Dark-Gray Monument Sign Wall (X -9..-2, Z 0..2) with VERTICAL SNOT Signage!
  add('brick_1x6', 'DARK_BLUISH_GRAY', -9, 2, 0, 1, 2, 5);
  add('brick_1x1', 'DARK_BLUISH_GRAY', -3, 2, 0, 0, 2, 5);
  add('brick_1x6', 'DARK_BLUISH_GRAY', -9, 5, 0, 1, 2, 5);
  add('brick_1x1', 'DARK_BLUISH_GRAY', -3, 5, 0, 0, 2, 5);
  add('tile_1x6',  'DARK_BLUISH_GRAY', -9, 8, 0, 1, 2, 5);
  add('tile_1x1',  'DARK_BLUISH_GRAY', -3, 8, 0, 0, 2, 5);
  // VERTICAL SNOT "張忠謀大樓 Morris Chang Building" wall sign + red bar (X -6..-2, Z 1..2, facing +Z)
  add('wall_morris_1x4',     'DARK_BLUISH_GRAY', -6, 3, 1, 0, 2, 5);
  // VERTICAL SNOT circular red-wafer TSMC logo on left pier (X -9..-7, Z 1..2, facing +Z)
  add('wall_tsmc_round_2x2', 'DARK_BLUISH_GRAY', -9, 3, 1, 0, 2, 5);

  // Step 6: White Main Wing Lower Walls & 3 Iconic Dark-Slate Horizontal Stripes (X -8..2, Z -9..-3)
  // Base masonry course (Y 2..5)
  for (let x = -8; x < 2; x += 2) {
    add('brick_2x6', 'WHITE', x, 2, -9, 0, 2, 6);
  }
  // 3 crisp dark-bluish-gray horizontal architectural stripes (Y 5..11)
  for (let x = -8; x < 2; x += 2) {
    add('plate_2x6', 'DARK_BLUISH_GRAY', x, 5, -9, 0, 2, 6);
    add('plate_2x6', 'WHITE',            x, 6, -9, 0, 2, 6);
    add('plate_2x6', 'DARK_BLUISH_GRAY', x, 7, -9, 0, 2, 6);
    add('plate_2x6', 'WHITE',            x, 8, -9, 0, 2, 6);
    add('plate_2x6', 'DARK_BLUISH_GRAY', x, 9, -9, 0, 2, 6);
    add('plate_2x6', 'WHITE',            x, 10, -9, 0, 2, 6);
  }
  // Recessed white louver grille bays on lower front facade (Z -3..-2, Y 5..11)
  add('vent_brick_1x2', 'WHITE', -6, 5, -3, 1, 2, 6);
  add('vent_brick_1x2', 'WHITE', -4, 5, -3, 1, 2, 6);
  add('vent_brick_1x2', 'WHITE', -2, 5, -3, 1, 2, 6);
  add('vent_brick_1x2', 'WHITE', -6, 8, -3, 1, 2, 6);
  add('vent_brick_1x2', 'WHITE', -4, 8, -3, 1, 2, 6);
  add('vent_brick_1x2', 'WHITE', -2, 8, -3, 1, 2, 6);

  // Step 7: Tall Upper White Facade Masonry (Y 11..23) & White Studded Roof
  for (let y = 11; y <= 20; y += 3) {
    for (let x = -8; x < 2; x += 2) {
      add('brick_2x6', 'WHITE', x, y, -9, 0, 2, 7);
    }
  }
  // Studded white roof field (Y 23, X -8..2, Z -9..-3)
  add('plate_6x6_r' === 'a' ? 'plate_4x6' : 'plate_4x6', 'WHITE', -8, 23, -9, 0, 2, 7);
  add('plate_4x6', 'WHITE', -4, 23, -9, 0, 2, 7);
  add('plate_2x6', 'WHITE',  0, 23, -9, 0, 2, 7);

  // Step 8: Vertical Trans-Light-Blue Glass Corner Shaft, Gray Corner Pilaster & VERTICAL TSMC Logo!
  // Tall Light-Gray vertical front-left corner pilaster (X -9..-8, Z -3..-2, Y 2..24)
  for (let y = 2; y <= 20; y += 6) {
    add('brick_1x1x2', 'LIGHT_BLUISH_GRAY', -9, y, -3, 0, 2, 8);
  }
  // Wait: 2, 8, 14, 20 -> 20+6=26! Use y=2,8,14 (up to 20) + brick_1x1 at 20 (up to 23) + tile_1x1 at 23!
  B.pop();
  add('brick_1x1', 'LIGHT_BLUISH_GRAY', -9, 20, -3, 0, 2, 8);
  add('tile_1x1',  'LIGHT_BLUISH_GRAY', -9, 23, -3, 0, 2, 8);
  // Glowing vertical Trans-Light-Blue glass shaft (X -9..-8, Z -4..-3, Y 2..24)
  for (let y = 2; y <= 20; y += 3) {
    add('brick_1x1', 'TRANS_LIGHT_BLUE', -9, y, -4, 0, 2, 8);
  }
  add('tile_1x1', 'TRANS_LIGHT_BLUE', -9, 23, -4, 0, 2, 8);
  // Left white continuation wall with 3 matching dark stripes (X -9..-8, Z -9..-4)
  add('brick_1x4', 'WHITE',            -9,  2, -9, 0, 2, 8);
  add('brick_1x1', 'WHITE',            -9,  2, -5, 0, 2, 8);
  add('plate_1x4', 'DARK_BLUISH_GRAY', -9,  5, -9, 0, 2, 8);
  add('plate_1x1', 'DARK_BLUISH_GRAY', -9,  5, -5, 0, 2, 8);
  add('plate_1x4', 'WHITE',            -9,  6, -9, 0, 2, 8);
  add('plate_1x1', 'WHITE',            -9,  6, -5, 0, 2, 8);
  add('plate_1x4', 'DARK_BLUISH_GRAY', -9,  7, -9, 0, 2, 8);
  add('plate_1x1', 'DARK_BLUISH_GRAY', -9,  7, -5, 0, 2, 8);
  add('plate_1x4', 'WHITE',            -9,  8, -9, 0, 2, 8);
  add('plate_1x1', 'WHITE',            -9,  8, -5, 0, 2, 8);
  add('plate_1x4', 'DARK_BLUISH_GRAY', -9,  9, -9, 0, 2, 8);
  add('plate_1x1', 'DARK_BLUISH_GRAY', -9,  9, -5, 0, 2, 8);
  add('plate_1x4', 'WHITE',            -9, 10, -9, 0, 2, 8);
  add('plate_1x1', 'WHITE',            -9, 10, -5, 0, 2, 8);
  for (let y = 11; y <= 20; y += 3) {
    add('brick_1x4', 'WHITE', -9, y, -9, 0, 2, 8);
    add('brick_1x1', 'WHITE', -9, y, -5, 0, 2, 8);
  }
  add('tile_1x4', 'WHITE', -9, 23, -9, 0, 2, 8);
  add('tile_1x1', 'WHITE', -9, 23, -5, 0, 2, 8);
  // VERTICAL SNOT Official Red-Wafer TSMC Logo high on the front white facade (X -7..-5, Z -3..-2, Y 16..21)
  add('wall_tsmc_2x2', 'WHITE', -7, 16, -3, 0, 2, 8);

  // =========================================================================
  // BAG 3: 中央透藍玻璃大廳、台積紅雨遮與雙片沙藍建築鰭板 (Steps 9–12)
  // Podium: X 0..6, Z 0..5, Y 2..12
  // =========================================================================
  // Step 9: Multi-Layer Glowing Trans-Blue Glass Podium (6x5 footprint)
  for (let y = 2; y <= 10; y += 2) {
    add('plate_4x4', 'TRANS_LIGHT_BLUE',  0, y,     0, 0, 3, 9);
    add('plate_2x4', 'TRANS_LIGHT_BLUE',  4, y,     0, 0, 3, 9);
    add('plate_1x6', 'TRANS_LIGHT_BLUE',  0, y,     4, 1, 3, 9);
    add('plate_4x4', 'TRANS_MEDIUM_BLUE', 0, y + 1, 0, 0, 3, 9);
    add('plate_2x4', 'TRANS_MEDIUM_BLUE', 4, y + 1, 0, 0, 3, 9);
    add('plate_1x6', 'TRANS_MEDIUM_BLUE', 0, y + 1, 4, 1, 3, 9);
  }
  // Light-gray cornice deck on top of podium (Y 12)
  add('plate_4x4', 'LIGHT_BLUISH_GRAY', 0, 12, 0, 0, 3, 9);
  add('plate_2x4', 'LIGHT_BLUISH_GRAY', 4, 12, 0, 0, 3, 9);
  add('plate_1x6', 'LIGHT_BLUISH_GRAY', 0, 12, 4, 1, 3, 9);

  // Step 10: Front-Left Dark-Gray Entrance Vestibule & Bright RED Cantilevered Awning
  add('brick_1x3', 'DARK_BLUISH_GRAY', -1, 2, 2, 0, 3, 10);
  add('plate_1x3', 'LIGHT_BLUISH_GRAY',-1, 5, 2, 0, 3, 10);
  add('plate_1x3', 'RED',              -1, 6, 2, 0, 3, 10);
  add('tile_1x3',  'RED',              -1, 7, 2, 0, 3, 10);

  // Step 11: Iconic Twin Tall Sand-Blue Vertical Fins & Vertical Red Accent Line
  for (let y = 13; y <= 25; y += 3) {
    add('brick_1x4', 'SAND_BLUE', 0, y, 0, 0, 3, 11); // Left fin X 0..1, Z 0..4
    add('brick_1x4', 'SAND_BLUE', 4, y, 0, 0, 3, 11); // Right fin X 4..5, Z 0..4
  }
  add('tile_1x4', 'SAND_BLUE', 0, 28, 0, 0, 3, 11);
  add('tile_1x4', 'SAND_BLUE', 4, 28, 0, 0, 3, 11);
  // Signature vertical RED accent line behind left fin (X 0..1, Z -1..0, Y 13..25)
  add('brick_1x1x2', 'RED', 0, 13, -1, 0, 3, 11);
  add('brick_1x1x2', 'RED', 0, 19, -1, 0, 3, 11);
  add('brick_1x1',   'RED', 0, 25, -1, 0, 3, 11);

  // Step 12: Cantilevered White-Framed Trans-Blue Glass Sky-Boxes Between & Beside Fins
  // Inner glass sky-box (X 1..4, Z 0..3, Y 18..24)
  add('plate_1x3', 'WHITE',            1, 18, 0, 1, 3, 12);
  add('plate_2x3', 'WHITE',            1, 18, 1, 1, 3, 12);
  add('brick_1x3', 'TRANS_LIGHT_BLUE', 1, 19, 0, 1, 3, 12);
  add('brick_2x3', 'TRANS_LIGHT_BLUE', 1, 19, 1, 1, 3, 12);
  add('plate_1x3', 'WHITE',            1, 22, 0, 1, 3, 12);
  add('plate_2x3', 'WHITE',            1, 22, 1, 1, 3, 12);
  // Projecting right glass sky-box (X 5..7, Z 1..4, Y 18..24)
  add('plate_2x3', 'WHITE',            5, 18, 1, 0, 3, 12);
  add('brick_2x3', 'TRANS_LIGHT_BLUE', 5, 19, 1, 0, 3, 12);
  add('plate_2x3', 'WHITE',            5, 22, 1, 0, 3, 12);

  // =========================================================================
  // BAG 4: 右側 10 層高聳淺灰電梯核心塔與屋頂凹槽收邊 (Steps 13–16)
  // Service Tower: X 6..9 (3 studs), Z -9..0 (9 studs), Y 2..32
  // =========================================================================
  // Step 13: Lower 5 Courses of Far-Right Light-Gray Elevator Core Tower (Y 2..17)
  for (let y = 2; y <= 14; y += 3) {
    add('brick_2x6', 'LIGHT_BLUISH_GRAY', 7, y, -9, 0, 4, 13);
    add('brick_1x6', 'LIGHT_BLUISH_GRAY', 6, y, -9, 0, 4, 13);
    add('brick_2x3', 'LIGHT_BLUISH_GRAY', 7, y, -3, 0, 4, 13);
    add('brick_1x3', 'LIGHT_BLUISH_GRAY', 6, y, -3, 0, 4, 13);
  }

  // Step 14: Upper 5 Courses of Elevator Core Tower (Y 17..32)
  for (let y = 17; y <= 29; y += 3) {
    add('brick_2x6', 'LIGHT_BLUISH_GRAY', 7, y, -9, 0, 4, 14);
    add('brick_1x6', 'LIGHT_BLUISH_GRAY', 6, y, -9, 0, 4, 14);
    add('brick_2x3', 'LIGHT_BLUISH_GRAY', 7, y, -3, 0, 4, 14);
    add('brick_1x3', 'LIGHT_BLUISH_GRAY', 6, y, -3, 0, 4, 14);
  }

  // Step 15: Recessed Studded Mechanical Channel on Core Tower Roof (Y 32)
  add('tile_1x6',  'LIGHT_BLUISH_GRAY', 6, 32, -9, 0, 4, 15);
  add('tile_1x3',  'LIGHT_BLUISH_GRAY', 6, 32, -3, 0, 4, 15);
  add('tile_1x6',  'LIGHT_BLUISH_GRAY', 8, 32, -9, 0, 4, 15);
  add('tile_1x3',  'LIGHT_BLUISH_GRAY', 8, 32, -3, 0, 4, 15);
  add('plate_1x6', 'DARK_BLUISH_GRAY',  7, 32, -9, 0, 4, 15);
  add('plate_1x3', 'DARK_BLUISH_GRAY',  7, 32, -3, 0, 4, 15);

  // Step 16: Smooth White Perimeter Parapet Around Studded Main Roof (Y 24)
  add('tile_1x6', 'WHITE', -8, 24, -9, 0, 4, 16);
  add('tile_1x6', 'WHITE',  1, 24, -9, 0, 4, 16);
  add('tile_1x8' === 'x' ? 'tile_1x6' : 'tile_1x4', 'WHITE', -7, 24, -9, 1, 4, 16);
  add('tile_1x4', 'WHITE', -3, 24, -9, 1, 4, 16);
  add('tile_1x4', 'WHITE', -7, 24, -4, 1, 4, 16);
  add('tile_1x4', 'WHITE', -3, 24, -4, 1, 4, 16);

  return B;
}

export const SET_04_MORRIS = {
  id: 'set04_morris',
  setNumber: '21038',
  shortName: '台積總部・張忠謀大樓',
  name: '台積總部及晶圓十二A廠 (張忠謀大樓)',
  englishName: 'TSMC HQ & Fab 12A (Morris Chang Building)',
  location: '台灣・新竹科學園區力行六路 (Hsinchu, Taiwan)',
  age: '18+',
  year: '2024',
  refImage: 'assets/ref/set04.jpg',
  accentColor: '#C91A09',
  cameraPos: [22, 20, 24],
  cameraTarget: [0, 5.2, 0],
  description: '高密度 20×20 典藏版「張忠謀大樓」！完整還原實拍圖每一處建築語彙：深棕建築方框底座、圓形水景中庭、斜面印刷銘牌、5 棵三層花葉喬木、正面垂直「張忠謀大樓」地標紀念牆與圓形紅晶圓 TSMC 徽章、三道深灰條紋與雙排百葉窗格純白主翼、垂直透藍玻璃角柱與正牆紅晶圓 TSMC 標、紅雨遮玻璃大廳、帶台積紅飾線的雙片沙藍鰭板與懸挑玻璃空中盒體，以及 10 層高聳淺灰核心塔。',
  bags: [
    { id: 1, title: '第 1 包：20×20 典藏底座、圓形中庭與林蔭', subtitle: '20x20 Frame, Fountain Ring & Trees', color: '#352218' },
    { id: 2, title: '第 2 包：地標紀念牆、三條紋白翼與 TSMC 標', subtitle: 'Monument Wall, Striped Wing & Logo', color: '#F6F7F9' },
    { id: 3, title: '第 3 包：透藍玻璃大廳、紅雨遮與雙鰭高塔', subtitle: 'Glass Podium, Red Awning & Sky-Boxes', color: '#3AC5ED' },
    { id: 4, title: '第 4 包：10 層淺灰電梯核心塔與屋頂收邊',   subtitle: '10-Story Elevator Tower & Roof Trim', color: '#A8AEB4' }
  ],
  steps: [
    { step: 1,  bag: 1, title: '拼合 20×20 深棕典藏建築底座',       tip: '無縫組合深棕薄板構成 20×20 建築系列標準展示底框。' },
    { step: 2,  bag: 1, title: '鋪設 18×18 淺藍灰內層前庭平台',     tip: '內縮一格鋪設淺灰平台，保留四邊俐落深棕外框顆粒。' },
    { step: 3,  bag: 1, title: '砌出圓形中庭水池環與斜面印刷銘牌',   tip: '以 16 組 1×1 淺灰板與光磚圍出圓形水景環，正前方扣上「張忠謀大樓」斜面銘牌。' },
    { step: 4,  bag: 1, title: '種植前庭鮮綠草坪、5 棵喬木與灌木',   tip: '立起 5 棵紅棕樹幹並疊加三層綠系花葉片，右側點綴低矮綠籬。' },
    { step: 5,  bag: 2, title: '建立深灰地標紀念牆與立面印刷徽標',   tip: '正面垂直掛載 SNOT「張忠謀大樓」銘牌與圓形紅晶圓 TSMC 徽章。' },
    { step: 6,  bag: 2, title: '堆疊純白主翼三道深灰條紋與百葉窗',   tip: '交錯 3 層深灰薄板與純白薄板，正面鑲入 6 組白色百葉紋建築磚。' },
    { step: 7,  bag: 2, title: '砌高純白主樓牆體與顆粒屋頂',         tip: '向上疊加 4 層純白主牆，覆蓋白色顆粒屋頂板。' },
    { step: 8,  bag: 2, title: '鑲嵌透藍角柱與正牆紅晶圓 TSMC 標',   tip: '組合轉角淺灰柱、透藍玻璃柱、左側延伸條紋牆，並於高處垂直掛載 TSMC 紅晶圓印刷磚。' },
    { step: 9,  bag: 3, title: '層疊五層透亮水藍玻璃大廳基座',       tip: '交替疊合透亮水藍與透海藍薄板，頂部覆蓋淺藍灰屋簷板。' },
    { step: 10, bag: 3, title: '加裝門廳玄關與台積紅懸挑雨遮',       tip: '於玻璃基座左前方立起深灰門廳，頂部扣上醒目台積紅雨遮。' },
    { step: 11, bag: 3, title: '立起雙片沙藍建築鰭板與紅飾線',       tip: '對稱架高兩道 5 層高沙藍建築翼板，並於左翼後方鑲入垂直紅色飾線。' },
    { step: 12, bag: 3, title: '懸挑安裝白框透藍玻璃空中盒體',       tip: '在雙鰭之間與右側懸挑安裝白框透亮水藍玻璃盒體。' },
    { step: 13, bag: 4, title: '堆疊淺灰電梯核心塔下半部 (1–5 層)',  tip: '於最右側開始砌築 3×9 淺藍灰核心塔身。' },
    { step: 14, bag: 4, title: '堆疊淺灰電梯核心塔上半部 (6–10 層)', tip: '持續向上堆疊至 10 層高，成為全棟最高天際線。' },
    { step: 15, bag: 4, title: '完成核心塔頂凹槽顆粒機電溝槽',       tip: '兩側以淺灰光磚包邊，中央嵌入深灰顆粒薄板重現原圖凹槽。' },
    { step: 16, bag: 4, title: '純白主翼屋頂女兒牆收邊完工',         tip: '四邊以純白光磚收邊，保留中央純白顆粒質感，張忠謀大樓完美落成！' }
  ],
  bricks: buildBricks()
};
