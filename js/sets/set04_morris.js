import { place } from '../legoCatalog.js';

function buildBricks() {
  const B = [];
  const add = (part, color, xMin, y, zMin, rot, bag, step) => B.push(place(part, color, xMin, y, zMin, rot, bag, step));

  // =========================================================================
  // BAG 1: 建築典藏黑框底座、圓形中庭廣場與張忠謀大樓銘牌 (Steps 1–3)
  // Grid: X = -8..8 (16 studs), Z = -8..8 (16 studs) — faithful to img4.jpg
  // =========================================================================
  // Step 1: 16x16 Dark-Brown Collector Baseplate + Light-Gray Curb + Dark-Gray Courtyard
  add('plate_16x16', 'DARK_BROWN', -8, 0, -8, 0, 1, 1);
  // Inner 14x14 platform (X -7..7, Z -7..7)
  add('plate_6x12', 'LIGHT_BLUISH_GRAY', -7, 1, -7, 0, 1, 1); // X -7..-1, Z -7..5
  add('plate_6x12', 'LIGHT_BLUISH_GRAY', -1, 1, -7, 0, 1, 1); // X -1..5,  Z -7..5
  add('plate_2x6',  'LIGHT_BLUISH_GRAY',  5, 1, -7, 0, 1, 1); // X 5..7,   Z -7..-1
  add('plate_2x6',  'LIGHT_BLUISH_GRAY',  5, 1, -1, 0, 1, 1); // X 5..7,   Z -1..5
  add('plate_2x8',  'LIGHT_BLUISH_GRAY', -7, 1,  5, 1, 1, 1); // X -7..1,  Z 5..7
  add('plate_2x6',  'LIGHT_BLUISH_GRAY',  1, 1,  5, 1, 1, 1); // X 1..7,   Z 5..7
  // Dark gray recessed courtyard paving (X -7..-1, Z 1..5)
  add('tile_2x4',   'DARK_BLUISH_GRAY',  -7, 2,  1, 0, 1, 1);

  // Step 2: Recessed Circular Courtyard Ring (X -5..-1, Z 1..5) & Front Sloped Nameplate (X -4..-2, Z 5..7)
  add('round_plate_4x4',  'LIGHT_BLUISH_GRAY', -5, 2, 1, 0, 1, 2);
  add('round_plate_2x2',  'DARK_BLUISH_GRAY',  -4, 3, 2, 0, 1, 2);
  add('round_tile_2x2',   'DARK_BLUISH_GRAY',  -4, 4, 2, 0, 1, 2);
  add('slope_morris_2x2', 'LIGHT_BLUISH_GRAY', -4, 2, 5, 0, 1, 2);

  // Step 3: Bright-Green Front Lawn & 4 Layered Brick-Built Trees (X -1..7, Z 5..7)
  add('plate_2x8', 'BRIGHT_GREEN', -1, 2, 5, 1, 1, 3);
  add('plate_2x4', 'BRIGHT_GREEN',  5, 2, 1, 0, 1, 3);
  const trees = [[-1, 5], [1, 5], [3, 5], [5, 5]];
  for (const [tx, tz] of trees) {
    add('round_brick_1x1', 'REDDISH_BROWN', tx, 3, tz, 0, 1, 3);
    add('flower_1x1',      'DARK_GREEN',    tx, 6, tz, 0, 1, 3);
    add('flower_1x1',      'BRIGHT_GREEN',  tx, 7, tz, 0, 1, 3);
    add('flower_1x1',      'LIME',          tx, 8, tz, 0, 1, 3);
  }
  add('flower_1x1', 'BRIGHT_GREEN', 6, 3, 2, 0, 1, 3);
  add('flower_1x1', 'BRIGHT_GREEN', 6, 3, 4, 0, 1, 3);

  // =========================================================================
  // BAG 2: 「張忠謀大樓」門前紀念牆 & 左側純白三條紋主樓 (Steps 4–6)
  // =========================================================================
  // Step 4: Front-Left Dark-Gray Monument Sign Wall (X -7..-1, Z -1..1) with VERTICAL Signs!
  // Backing wall at Z = -1..0
  add('brick_1x6', 'DARK_BLUISH_GRAY', -7, 2, -1, 1, 2, 4); // Y 2..5
  add('brick_1x6', 'DARK_BLUISH_GRAY', -7, 5, -1, 1, 2, 4); // Y 5..8
  add('tile_1x6',  'DARK_BLUISH_GRAY', -7, 8, -1, 1, 2, 4); // Smooth top cap Y 8..9
  // VERTICAL SNOT printed "張忠謀大樓 Morris Chang Building" wall sign + red bar (Z = 0..1, facing +Z!)
  add('wall_morris_1x4',     'DARK_BLUISH_GRAY', -5, 3, 0, 0, 2, 4); // X -5..-1, Y 3..7, facing +Z
  // VERTICAL SNOT circular TSMC wafer logo on left pier (X -7..-5, Z = 0..1, facing +Z!)
  add('wall_tsmc_round_2x2', 'DARK_BLUISH_GRAY', -7, 3, 0, 0, 2, 4); // X -7..-5, Y 3..8, facing +Z

  // Step 5: Tall Left-Rear White Main Wing (X -6..2, Z -7..-3, Y 2..20) with 3 Dark Stripes & Louvers
  // Base white layer (Y 2..5)
  for (let x = -6; x < 2; x += 2) {
    add('brick_2x4', 'WHITE', x, 2, -7, 0, 2, 5);
  }
  // 3 crisp horizontal dark-slate architectural bands with white vent louvers (Y 5..11)
  for (let x = -6; x < 2; x += 2) {
    add('plate_2x4', 'DARK_BLUISH_GRAY', x, 5, -7, 0, 2, 5);
    add('plate_2x4', 'WHITE',            x, 6, -7, 0, 2, 5);
    add('plate_2x4', 'DARK_BLUISH_GRAY', x, 7, -7, 0, 2, 5);
    add('plate_2x4', 'WHITE',            x, 8, -7, 0, 2, 5);
    add('plate_2x4', 'DARK_BLUISH_GRAY', x, 9, -7, 0, 2, 5);
    add('plate_2x4', 'WHITE',            x, 10, -7, 0, 2, 5);
  }
  // Upper tall white clean facade (Y 11..20)
  for (let x = -6; x < 2; x += 2) {
    add('brick_2x4', 'WHITE', x, 11, -7, 0, 2, 5);
    add('brick_2x4', 'WHITE', x, 14, -7, 0, 2, 5);
    add('brick_2x4', 'WHITE', x, 17, -7, 0, 2, 5);
  }
  // White studded recessed roof (Y 20)
  add('plate_4x8', 'WHITE', -6, 20, -7, 1, 2, 5); // X -6..2, Z -7..-3

  // Step 6: Vertical Trans-Light-Blue Glass Corner Shaft, Gray Pilaster & VERTICAL TSMC Logo!
  // Tall Light-Gray front-left vertical corner pilaster (X -7..-6, Z -3..-2)
  add('brick_1x1x2', 'LIGHT_BLUISH_GRAY', -7,  2, -3, 0, 2, 6);
  add('brick_1x1x2', 'LIGHT_BLUISH_GRAY', -7,  8, -3, 0, 2, 6);
  add('brick_1x1x2', 'LIGHT_BLUISH_GRAY', -7, 14, -3, 0, 2, 6);
  add('tile_1x1',    'LIGHT_BLUISH_GRAY', -7, 20, -3, 0, 2, 6);
  // Glowing vertical Trans-Light-Blue glass shaft right next to it (X -7..-6, Z -4..-3)
  for (let y = 2; y <= 17; y += 3) {
    add('brick_1x1', 'TRANS_LIGHT_BLUE', -7, y, -4, 0, 2, 6);
  }
  add('tile_1x1', 'TRANS_LIGHT_BLUE', -7, 20, -4, 0, 2, 6);
  // White side continuation (X -7..-6, Z -7..-4)
  for (let y = 2; y <= 17; y += 3) {
    add('brick_1x3', 'WHITE', -7, y, -7, 0, 2, 6);
  }
  add('tile_1x3', 'WHITE', -7, 20, -7, 0, 2, 6);
  // Authentic VERTICAL SNOT white TSMC Red-Wafer Logo mounted high on the front white wall (Z = -3..-2, facing +Z!)
  add('wall_tsmc_2x2', 'WHITE', -5, 14, -3, 0, 2, 6); // X -5..-3, Y 14..19, flush against Z=-3 wall!
  // White louver vents on lower white facade (Z = -3..-2, Y 5..11)
  add('vent_brick_1x2', 'WHITE', -4, 5, -3, 1, 2, 6);
  add('vent_brick_1x2', 'WHITE', -2, 5, -3, 1, 2, 6);

  // =========================================================================
  // BAG 3: 中央透藍玻璃基座、台積紅雨遮與雙片沙藍高塔 (Steps 7–9)
  // Podium: X 0..4, Z 0..4, Y 2..11 | Fins: X 0..1 & X 3..4, Z -1..3, Y 11..24
  // =========================================================================
  // Step 7: Multi-Layer Trans-Light-Blue Glass Podium & Vibrant Red Entrance Awning
  for (let y = 2; y <= 8; y += 2) {
    add('plate_4x4', 'TRANS_LIGHT_BLUE',  0, y,     0, 0, 3, 7);
    add('plate_4x4', 'TRANS_MEDIUM_BLUE', 0, y + 1, 0, 0, 3, 7);
  }
  add('plate_4x4', 'LIGHT_BLUISH_GRAY', 0, 10, 0, 0, 3, 7); // Cornice roof
  // Small dark-gray vestibule + bright RED cantilevered awning (X -1..0, Z 2..4)
  add('brick_1x2', 'DARK_BLUISH_GRAY', -1, 2, 2, 0, 3, 7);
  add('plate_1x2', 'RED',              -1, 5, 2, 0, 3, 7);
  add('tile_1x2',  'RED',              -1, 6, 2, 0, 3, 7);

  // Step 8: Iconic Twin Tall Sand-Blue Architectural Fins (X 0..1 & X 3..4, Z 0..4, Y 11..24)
  for (let y = 11; y <= 20; y += 3) {
    add('brick_1x4', 'SAND_BLUE', 0, y, 0, 0, 3, 8);
    add('brick_1x4', 'SAND_BLUE', 3, y, 0, 0, 3, 8);
  }
  add('tile_1x4', 'SAND_BLUE', 0, 23, 0, 0, 3, 8);
  add('tile_1x4', 'SAND_BLUE', 3, 23, 0, 0, 3, 8);
  // Subtle red accent edge on left fin (matching img4.jpg!)
  add('brick_1x1x2', 'RED', 0, 11, -1, 0, 3, 8);
  add('brick_1x1x2', 'RED', 0, 17, -1, 0, 3, 8);

  // Step 9: Cantilevered White-Framed Trans-Blue Glass Sky-Boxes Between & Beside Fins
  // Inner sky-box (X 1..3, Z 0..3, Y 15..20)
  add('plate_2x3', 'WHITE',            1, 15, 0, 0, 3, 9);
  add('brick_2x3', 'TRANS_LIGHT_BLUE', 1, 16, 0, 0, 3, 9);
  add('plate_2x3', 'WHITE',            1, 19, 0, 0, 3, 9);
  // Projecting right glass sky-box (X 4..5, Z 1..3, Y 15..20)
  add('plate_1x2', 'WHITE',            4, 15, 1, 0, 3, 9);
  add('brick_1x2', 'TRANS_LIGHT_BLUE', 4, 16, 1, 0, 3, 9);
  add('plate_1x2', 'WHITE',            4, 19, 1, 0, 3, 9);

  // =========================================================================
  // BAG 4: 右側高聳淺灰電梯核心塔與屋頂建築收邊 (Steps 10–12)
  // Service Tower: X 4..7 (3 studs), Z -7..-1 (6 studs), Y 2..27
  // =========================================================================
  // Step 10: Tall Far-Right Light-Bluish-Gray Service & Elevator Core Tower
  for (let y = 2; y <= 23; y += 3) {
    add('brick_2x6', 'LIGHT_BLUISH_GRAY', 5, y, -7, 0, 4, 10); // X 5..7, Z -7..-1
    add('brick_1x6', 'LIGHT_BLUISH_GRAY', 4, y, -7, 0, 4, 10); // X 4..5, Z -7..-1
  }

  // Step 11: Recessed Studded Mechanical Channel on Service Tower Roof (Y 26..27)
  add('tile_1x6',    'LIGHT_BLUISH_GRAY', 4, 26, -7, 0, 4, 11);
  add('tile_1x6',    'LIGHT_BLUISH_GRAY', 6, 26, -7, 0, 4, 11);
  add('plate_1x6',   'DARK_BLUISH_GRAY',  5, 26, -7, 0, 4, 11); // Recessed dark studded channel

  // Step 12: Smooth White Perimeter Trim Around Recessed Studded Main Roof (Y = 21)
  add('tile_1x4', 'WHITE', -6, 21, -7, 0, 4, 12); // Left edge X -6..-5
  add('tile_1x4', 'WHITE',  1, 21, -7, 0, 4, 12); // Right edge X 1..2
  add('tile_1x6', 'WHITE', -5, 21, -7, 1, 4, 12); // Back edge Z -7..-6
  add('tile_1x6', 'WHITE', -5, 21, -4, 1, 4, 12); // Front edge Z -4..-3

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
  cameraPos: [18, 17, 20],
  cameraTarget: [0, 4.2, 0],
  description: '高度還原實拍圖的台積電總部「張忠謀大樓」樂高建築典藏版！採 16×16 深棕建築方框底座，配備立面垂直掛載的官方紅晶圓 TSMC 印刷磚、「張忠謀大樓」地標紀念牆與斜面銘牌、三道深灰飾帶與百葉窗格純白主翼、垂直透藍玻璃角柱、紅雨遮玻璃基座、帶紅邊的雙片沙藍建築鰭板與懸挑玻璃空中盒體，以及最高聳的淺灰核心塔。',
  bags: [
    { id: 1, title: '第 1 包：建築方框底座、圓形廣場與銘牌', subtitle: 'Architecture Frame, Plaza & Plaque', color: '#362318' },
    { id: 2, title: '第 2 包：立面紀念牆、TSMC 紅晶圓標與主翼', subtitle: 'Monument Wall, TSMC Logo & White Wing', color: '#F6F7F9' },
    { id: 3, title: '第 3 包：透藍玻璃基座、紅雨遮與雙鰭高塔', subtitle: 'Glass Podium, Red Awning & Twin Fins', color: '#3AC5ED' },
    { id: 4, title: '第 4 包：高聳淺灰核心塔與屋頂邊框收邊',   subtitle: 'Elevator Tower & Recessed Roof Trim', color: '#A8AEB4' }
  ],
  steps: [
    { step: 1,  bag: 1, title: '建立 16×16 深棕建築典藏底板與前庭', tip: '以深棕 16×16 薄板為展示框，內層無縫鋪上淺藍灰與深灰前庭地板。' },
    { step: 2,  bag: 1, title: '建造圓形中庭水池與斜面印刷銘牌',   tip: '疊合 4×4 與 2×2 圓盤構成圓形廣場，正前方扣上「張忠謀大樓」銘牌磚。' },
    { step: 3,  bag: 1, title: '種植前庭鮮綠草坪與四棵多層次喬木', tip: '以紅棕圓柱為樹幹，疊上深松綠、鮮綠與嫩芽綠三層花葉片。' },
    { step: 4,  bag: 2, title: '立起「張忠謀大樓」地標牆與圓形徽標', tip: '在深灰紀念牆正面垂直安裝 SNOT「張忠謀大樓」銘牌與圓形紅晶圓 TSMC 徽章。' },
    { step: 5,  bag: 2, title: '堆疊純白主翼與三道深灰水平飾帶',   tip: '精準交錯三層深藍灰與純白薄板，再疊高純白主牆與顆粒屋頂。' },
    { step: 6,  bag: 2, title: '鑲嵌垂直透藍角柱與正牆 TSMC 晶圓標', tip: '安裝轉角淺灰柱與透藍玻璃柱，於白牆高處垂直掛載官方 TSMC 紅晶圓印刷磚與百葉窗格。' },
    { step: 7,  bag: 3, title: '建構透藍玻璃基座與台積紅入口雨遮', tip: '交替疊加透亮水藍與透海藍薄板打造玻璃大廳，點綴鮮紅雨遮。' },
    { step: 8,  bag: 3, title: '立起雙片沙藍垂直建築鰭板與紅飾條', tip: '於基座上方對稱架高兩道沙藍建築翼板，並於左側加入標誌性台積紅垂直飾線。' },
    { step: 9,  bag: 3, title: '懸挑安裝白框透藍玻璃空中盒體',     tip: '於雙翼板之間與外側鑲嵌白框透亮水藍玻璃盒體，還原原圖立體結構。' },
    { step: 10, bag: 4, title: '堆疊最右側 8 層高淺灰電梯核心塔',  tip: '垂直疊加 8 層 3×6 淺藍灰塔身，成為全棟建築最高視覺焦點。' },
    { step: 11, bag: 4, title: '完成核心塔頂凹槽顆粒機電溝槽',     tip: '兩側以淺灰長條光磚收邊，中央保留深灰凹槽顆粒質感。' },
    { step: 12, bag: 4, title: '純白主翼屋頂凹槽女兒牆收邊',       tip: '四邊以純白光磚圍出屋頂外框，保留中央純白顆粒紋理，完美致敬原圖！' }
  ],
  bricks: buildBricks()
};
