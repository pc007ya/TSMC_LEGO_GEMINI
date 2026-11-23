import { place } from '../legoCatalog.js';

function buildBricks() {
  const B = [];
  const add = (part, color, xMin, y, zMin, rot, bag, step) => B.push(place(part, color, xMin, y, zMin, rot, bag, step));

  // =========================================================================
  // BAG 1: 建築典藏黑框底座、圓形前庭廣場與張忠謀大樓銘牌 (Steps 1–3)
  // Grid: X = -8..8 (16 studs), Z = -8..8 (16 studs)
  // =========================================================================
  // Step 1: Square 16 x 16 Dark-Brown Frame (y = 0) + Light-Gray Inner Platform (y = 1: X -7..7, Z -7..7)
  add('plate_16x16', 'DARK_BROWN', -8, 0, -8, 0, 1, 1);
  add('plate_6x12', 'LIGHT_BLUISH_GRAY', -7, 1, -7, 0, 1, 1); // X -7..-1, Z -7..5
  add('plate_6x12', 'LIGHT_BLUISH_GRAY', -1, 1, -7, 0, 1, 1); // X -1..5,  Z -7..5
  add('plate_2x6',  'LIGHT_BLUISH_GRAY',  5, 1, -7, 0, 1, 1); // X 5..7,   Z -7..-1
  add('plate_2x6',  'LIGHT_BLUISH_GRAY',  5, 1, -1, 0, 1, 1); // X 5..7,   Z -1..5
  add('plate_2x8',  'LIGHT_BLUISH_GRAY', -7, 1,  5, 1, 1, 1); // X -7..1,  Z 5..7
  add('plate_2x6',  'LIGHT_BLUISH_GRAY',  1, 1,  5, 1, 1, 1); // X 1..7,   Z 5..7

  // Step 2: Recessed Circular Courtyard Fountain Ring (X -5..-1, Z 1..5) & Front Sloped Nameplate (X -4..-2, Z 5..7)
  add('round_plate_4x4',  'LIGHT_BLUISH_GRAY', -5, 2, 1, 0, 1, 2);
  add('round_plate_2x2',  'DARK_BLUISH_GRAY',  -4, 3, 2, 0, 1, 2);
  add('round_tile_2x2',   'DARK_BLUISH_GRAY',  -4, 4, 2, 0, 1, 2);
  add('slope_morris_2x2', 'LIGHT_BLUISH_GRAY', -4, 2, 5, 0, 1, 2); // X -4..-2, Z 5..7

  // Step 3: Bright-Green Front Lawn (X -1..7, Z 5..7) & Brick-Built Trees (X 0..6, Z 5..6)
  add('plate_2x8', 'BRIGHT_GREEN', -1, 2, 5, 1, 1, 3); // X -1..7, Z 5..7
  const treeCoords = [[0, 5], [2, 5], [4, 5], [6, 5]];
  for (const [tx, tz] of treeCoords) {
    add('round_brick_1x1', 'REDDISH_BROWN', tx, 3, tz, 0, 1, 3);
    add('flower_1x1',      'BRIGHT_GREEN',  tx, 6, tz, 0, 1, 3);
    add('flower_1x1',      'LIME',          tx, 7, tz, 0, 1, 3);
  }

  // =========================================================================
  // BAG 2: 門前地標紀念牆與左側純白條紋主翼 (Steps 4–6)
  // =========================================================================
  // Step 4: Front-Left Dark-Gray Monument Wall (X -7..-1, Z 0..1) + Red Bar + Printed Plaque
  add('brick_1x6',        'DARK_BLUISH_GRAY', -7, 2, 0, 1, 2, 4); // X -7..-1, Z 0..1, Y 2..5
  add('brick_1x6',        'DARK_BLUISH_GRAY', -7, 5, 0, 1, 2, 4); // Y 5..8
  add('tile_1x4',         'RED',              -5, 8, 0, 1, 2, 4); // Red accent cap on top (X -5..-1, Y 8)
  add('tile_morris_1x4',  'DARK_BLUISH_GRAY', -5, 9, 0, 1, 2, 4); // Printed "張忠謀大樓" top sign
  add('tile_tsmc_round_2x2', 'DARK_BLUISH_GRAY', -7, 8, -1, 0, 2, 4); // Round TSMC emblem on left pier (X -7..-5, Z -1..1? wait Z -1..0 has white wing at Z -7..-1 -> put at X -7..-5, Z 1..3!)

  // Let's keep Step 4 100% non-overlapping: move round emblem to X -7..-5, Z 1..3 on a 2x2 plinth!
  B.pop();
  add('brick_2x2',           'DARK_BLUISH_GRAY', -7, 2, 1, 0, 2, 4);
  add('tile_tsmc_round_2x2', 'WHITE',            -7, 5, 1, 0, 2, 4);

  // Step 5: Tall Left-Rear White Main Wing (X -6..0, Z -7..-1, Y 2..17) with 3 Horizontal Stripes
  for (let x = -6; x < 0; x += 2) {
    add('brick_2x6', 'WHITE',            x,  2, -7, 0, 2, 5);
    add('plate_2x6', 'DARK_BLUISH_GRAY', x,  5, -7, 0, 2, 5);
    add('plate_2x6', 'WHITE',            x,  6, -7, 0, 2, 5);
    add('plate_2x6', 'DARK_BLUISH_GRAY', x,  7, -7, 0, 2, 5);
    add('plate_2x6', 'WHITE',            x,  8, -7, 0, 2, 5);
    add('plate_2x6', 'DARK_BLUISH_GRAY', x,  9, -7, 0, 2, 5);
    add('brick_2x6', 'WHITE',            x, 10, -7, 0, 2, 5);
    add('brick_2x6', 'WHITE',            x, 13, -7, 0, 2, 5);
  }
  add('plate_6x6_tmp' === 'x' ? 'plate_4x6' : 'plate_4x6', 'WHITE', -6, 16, -7, 0, 2, 5); // X -6..-2, Z -7..-1
  add('plate_2x6', 'WHITE', -2, 16, -7, 0, 2, 5); // X -2..0, Z -7..-1

  // Step 6: Vertical Translucent-Blue Corner Glass Shaft (X -7..-6, Z -2..-1) & Upper TSMC Logo
  for (let y = 2; y <= 14; y += 3) {
    add('brick_1x1', 'TRANS_LIGHT_BLUE', -7, y, -2, 0, 2, 6);
  }
  add('brick_1x1x2', 'LIGHT_BLUISH_GRAY', -7, 2, -1, 0, 2, 6);
  add('brick_1x1x2', 'LIGHT_BLUISH_GRAY', -7, 8, -1, 0, 2, 6);
  add('tile_tsmc_2x2', 'WHITE', -5, 17, -3, 0, 2, 6);

  // =========================================================================
  // BAG 3: 中央透藍玻璃基座、紅色雨遮與雙翼沙藍高塔 (Steps 7–9)
  // Podium: X 0..4 (4 studs), Z 0..4 (4 studs), Y 2..9
  // =========================================================================
  // Step 7: Translucent-Blue Glass Podium & Vibrant Red Entrance Canopy
  for (let y = 2; y <= 6; y += 2) {
    add('plate_4x4', 'TRANS_LIGHT_BLUE',  0, y,     0, 0, 3, 7);
    add('plate_4x4', 'TRANS_MEDIUM_BLUE', 0, y + 1, 0, 0, 3, 7);
  }
  add('plate_4x4', 'LIGHT_BLUISH_GRAY', 0, 8, 0, 0, 3, 7);
  // Vibrant red entrance canopy (X -1..0, Z 2..4)
  add('brick_1x2', 'LIGHT_BLUISH_GRAY', -1, 2, 2, 0, 3, 7);
  add('tile_1x2',  'RED',               -1, 5, 2, 0, 3, 7);

  // Step 8: Iconic Twin Sand-Blue Vertical Architectural Fins (X 0..1 & X 3..4, Z 0..4, Y 9..22)
  for (let y = 9; y <= 18; y += 3) {
    add('brick_1x4', 'SAND_BLUE', 0, y, 0, 0, 3, 8);
    add('brick_1x4', 'SAND_BLUE', 3, y, 0, 0, 3, 8);
  }
  add('tile_1x4', 'SAND_BLUE', 0, 21, 0, 0, 3, 8);
  add('tile_1x4', 'SAND_BLUE', 3, 21, 0, 0, 3, 8);

  // Step 9: Cantilevered White & Trans-Blue Glass Sky-Boxes Between Fins (X 1..3, Z 0..3)
  add('plate_2x3', 'WHITE',            1, 12, 0, 0, 3, 9);
  add('brick_2x3', 'TRANS_LIGHT_BLUE', 1, 13, 0, 0, 3, 9);
  add('plate_2x3', 'WHITE',            1, 16, 0, 0, 3, 9);
  // Side glass sky-box (X 4..5, Z 1..3)
  add('plate_1x2', 'WHITE',            4, 12, 1, 0, 3, 9);
  add('brick_1x2', 'TRANS_LIGHT_BLUE', 4, 13, 1, 0, 3, 9);
  add('plate_1x2', 'WHITE',            4, 16, 1, 0, 3, 9);

  // =========================================================================
  // BAG 4: 右側高聳淺灰電梯核心塔與屋頂建築收邊 (Steps 10–12)
  // Service Tower: X 5..7 (2 studs), Z -7..-1 (6 studs), Y 2..25
  // =========================================================================
  // Step 10: Tall Far-Right Light-Bluish-Gray Service & Elevator Tower
  for (let y = 2; y <= 20; y += 3) {
    add('brick_2x6', 'LIGHT_BLUISH_GRAY', 5, y, -7, 0, 4, 10);
  }

  // Step 11: Recessed Roof Mechanical Parapet on Service Tower (Y 23..24)
  add('tile_1x6',    'LIGHT_BLUISH_GRAY', 5, 23, -7, 0, 4, 11);
  add('tile_grille', 'DARK_BLUISH_GRAY',  6, 23, -7, 0, 4, 11);
  add('tile_grille', 'DARK_BLUISH_GRAY',  6, 23, -5, 0, 4, 11);
  add('tile_grille', 'DARK_BLUISH_GRAY',  6, 23, -3, 0, 4, 11);

  // Step 12: Final Architectural Roof Trim on Main White Wing (Y = 17, X -6..0, Z -7..-1)
  add('tile_1x6', 'WHITE', -6, 17, -7, 0, 4, 12); // Left edge X -6..-5
  add('tile_1x6', 'WHITE', -1, 17, -7, 0, 4, 12); // Right edge X -1..0
  add('tile_1x4', 'WHITE', -5, 17, -7, 1, 4, 12); // Back edge X -5..-1, Z -7..-6

  return B;
}

export const SET_04_MORRIS = {
  id: 'set04_morris',
  setNumber: '21038',
  shortName: '張忠謀大樓',
  name: '張忠謀大樓 (Morris Chang Building)',
  englishName: 'TSMC Morris Chang Building (HQ)',
  location: '台灣・新竹科學園區力行六路 (Hsinchu, Taiwan)',
  age: '18+',
  year: '2024',
  refImage: 'assets/ref/set04.jpg',
  accentColor: '#C91A09',
  cameraPos: [18, 16, 19],
  cameraTarget: [0, 3.8, 0],
  description: '致敬半導體教父的台積電總部「張忠謀大樓」樂高建築典藏版！採經典 16×16 深棕建築方框底座，附專屬「張忠謀大樓」斜面印刷銘牌與門前紀念牆、圓形水景中庭、三道深灰條紋的純白主翼與垂直水藍玻璃角柱，以及高聳的雙片沙藍建築鰭板與懸挑玻璃空中盒體。',
  bags: [
    { id: 1, title: '第 1 包：建築方框底座、圓形廣場與銘牌', subtitle: 'Architecture Frame, Plaza & Plaque', color: '#362318' },
    { id: 2, title: '第 2 包：張忠謀大樓紀念牆與純白主翼',   subtitle: 'Monument Wall & Striped White Wing', color: '#F4F5F7' },
    { id: 3, title: '第 3 包：透藍玻璃基座與雙鰭空中盒體',   subtitle: 'Glass Podium & Twin Sand-Blue Fins', color: '#46C7EC' },
    { id: 4, title: '第 4 包：高聳淺灰核心塔與屋頂收邊',     subtitle: 'Elevator Tower & Roof Parapet', color: '#A6ACB2' }
  ],
  steps: [
    { step: 1,  bag: 1, title: '建立 16×16 深棕建築典藏底板',       tip: '以深棕 16×16 薄板為展示框，內層無縫鋪上淺藍灰前庭地板。' },
    { step: 2,  bag: 1, title: '建造圓形中庭水池與斜面印刷銘牌',   tip: '疊合 4×4 與 2×2 圓盤構成圓形廣場，於正前方扣上「張忠謀大樓」銘牌磚。' },
    { step: 3,  bag: 1, title: '種植前庭鮮綠草坪與四棵景觀喬木',   tip: '以紅棕圓柱為樹幹，疊上鮮綠與嫩芽綠花葉片營造多層次樹冠。' },
    { step: 4,  bag: 2, title: '立起「張忠謀大樓」深灰地標紀念牆', tip: '安裝紅色飾條、圓形 TSMC 徽章與「張忠謀大樓」印刷光磚牆面。' },
    { step: 5,  bag: 2, title: '堆疊左側純白主翼與三道深灰飾帶',   tip: '精準交錯三層深藍灰薄板與純白薄板，呈現大樓標誌性水平線條。' },
    { step: 6,  bag: 2, title: '鑲嵌垂直透水藍角柱與高層 TSMC 標', tip: '於轉角堆疊 5 層透亮水藍柱磚，並在屋頂前緣扣上 2×2 TSMC 印刷磚。' },
    { step: 7,  bag: 3, title: '建構透藍玻璃基座與台積紅入口雨遮', tip: '交替疊加透亮水藍與透海藍薄板打造玻璃大廳，點綴鮮紅雨遮。' },
    { step: 8,  bag: 3, title: '立起雙片標誌性沙藍垂直建築鰭板',   tip: '於基座上方對稱架高兩道沙藍色建築翼板並以光磚封頂。' },
    { step: 9,  bag: 3, title: '懸挑安裝玻璃空中盒體',             tip: '於雙翼板之間與外側鑲嵌白框透亮水藍玻璃盒體，呈現立體層次。' },
    { step: 10, bag: 4, title: '堆疊最右側 7 層高淺灰電梯核心塔',  tip: '垂直疊加 7 層 2×6 淺藍灰標準磚，成為全棟建築最高視覺焦點。' },
    { step: 11, bag: 4, title: '完成核心塔頂散熱格柵收邊',         tip: '於塔頂鋪設淺灰長條光磚與 3 組深灰散熱格柵光磚。' },
    { step: 12, bag: 4, title: '純白主翼屋頂女兒牆收邊',           tip: '以純白長條光磚為屋頂收邊，完成張忠謀大樓典藏模型！' }
  ],
  bricks: buildBricks()
};
