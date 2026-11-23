import { place } from '../legoCatalog.js';

function buildBricks() {
  const B = [];
  const add = (part, color, xMin, y, zMin, rot, bag, step) => B.push(place(part, color, xMin, y, zMin, rot, bag, step));

  // =========================================================================
  // BAG 1: 園區基礎底板、生態水池與景觀綠化 (Steps 1–3)
  // Grid: X = -12..12 (24 studs), Z = -8..8 (16 studs)
  // =========================================================================
  // Step 1: Exact-tiled 24 x 16 Baseplate (y = 0)
  add('plate_8x16', 'LIGHT_BLUISH_GRAY', -12, 0, -8, 0, 1, 1); // X -12..-4, Z -8..8
  add('plate_8x16', 'LIGHT_BLUISH_GRAY',  -4, 0, -8, 0, 1, 1); // X -4..4,   Z -8..8
  add('plate_8x16', 'LIGHT_BLUISH_GRAY',   4, 0, -8, 0, 1, 1); // X 4..12,   Z -8..8

  // Step 2: Circular Eco-Pond & Translucent Blue Water (Front-center: X -4..3, Z 1..7)
  // Water basin tiles at y = 1
  for (let x = -3; x <= 1; x++) {
    for (let z = 2; z <= 5; z++) {
      if (x === -1 && (z === 3 || z === 4)) continue; // reserve for central green island
      if (x === -1 && z === 2) continue;              // reserve for grey walkway
      add('tile_1x1', 'TRANS_MEDIUM_BLUE', x, 1, z, 0, 1, 2);
    }
  }
  // Curved pond border rim (Light Bluish Gray, y = 1..3)
  const pondRim = [
    [-4, 2], [-4, 3], [-4, 4], [-4, 5],
    [2, 2],  [2, 3],  [2, 4],  [2, 5],
    [-3, 1], [-2, 1], [-1, 1], [0, 1], [1, 1],
    [-3, 6], [-2, 6], [-1, 6], [0, 6], [1, 6]
  ];
  for (const [px, pz] of pondRim) {
    add('plate_1x1', 'LIGHT_BLUISH_GRAY', px, 1, pz, 0, 1, 2);
    add('tile_1x1',  'LIGHT_BLUISH_GRAY', px, 2, pz, 0, 1, 2);
  }
  // Central green lotus island & walkway bridge into pond
  add('plate_1x2',  'BRIGHT_GREEN',      -1, 1, 3, 0, 1, 2);
  add('flower_1x1', 'DARK_GREEN',        -1, 2, 3, 0, 1, 2);
  add('tile_1x1',   'LIGHT_BLUISH_GRAY', -1, 1, 2, 0, 1, 2);

  // Step 3: Perimeter Bollards, Dark-Green Lawns & Trees
  // Front-left angled white roadside barriers (Z = 6..8, X = -12..-6)
  for (let x = -12; x <= -7; x++) {
    add('slope_1x2', 'WHITE', x, 1, 6, 0, 1, 3);
  }
  // Front-center metallic silver bollards (Z = 7, X = -4, -1, 2)
  add('round_brick_1x1', 'FLAT_SILVER', -4, 1, 7, 0, 1, 3);
  add('round_brick_1x1', 'FLAT_SILVER', -1, 1, 7, 0, 1, 3);
  add('round_brick_1x1', 'FLAT_SILVER',  2, 1, 7, 0, 1, 3);
  // Dark green triangular/stepped lawns
  add('plate_4x4', 'DARK_GREEN',  5, 1, 3, 0, 1, 3);
  add('plate_2x2', 'DARK_GREEN',  9, 1, 2, 0, 1, 3);
  add('plate_2x2', 'DARK_GREEN', 10, 1, -2, 0, 1, 3);
  add('plate_2x4', 'DARK_GREEN', -6, 1, 4, 0, 1, 3);
  // 4 signature slender trees around pond
  const trees = [[-5, 3], [3, 5], [0, 7], [3, 1]];
  for (const [tx, tz] of trees) {
    add('round_plate_1x1', 'REDDISH_BROWN', tx, 1, tz, 0, 1, 3);
    add('plant_stem',      'BRIGHT_GREEN',  tx, 2, tz, 0, 1, 3);
  }

  // =========================================================================
  // BAG 2: 左側台積創新館 (圓頂建築與階梯花園) (Steps 4–6)
  // Footprint: X = -11..-6, Z = -5..3
  // =========================================================================
  // Step 4: Circular Dark Plaza & Front Blue/Green Garden Terrace
  add('round_plate_4x4', 'DARK_BROWN', -10, 1, -3, 0, 2, 4); // X -10..-6, Z -3..1
  add('plate_2x4',       'DARK_BROWN', -10, 1,  2, 1, 2, 4); // X -10..-6, Z 2..4
  add('tile_1x2',        'DARK_BLUE',   -9, 2,  2, 1, 2, 4);
  add('flower_1x1',      'BRIGHT_GREEN', -10, 2, 3, 0, 2, 4);
  add('flower_1x1',      'BRIGHT_GREEN',  -7, 2, 3, 0, 2, 4);
  // Water channel along rear-left edge (X = -12, Z = -6..4)
  for (let z = -6; z <= 2; z += 2) {
    add('tile_1x2', 'TRANS_LIGHT_BLUE', -12, 1, z, 0, 2, 4);
  }

  // Step 5: Round Pavilion Core Drum (X -9..-7, Z -2..0)
  add('round_brick_2x2', 'LIGHT_BLUISH_GRAY', -9, 2, -2, 0, 2, 5);
  add('round_brick_2x2', 'WHITE',             -9, 5, -2, 0, 2, 5);

  // Step 6: Iconic White Saucer Dome Roof (X -10..-6, Z -3..1)
  add('round_plate_4x4', 'WHITE', -10, 8, -3, 0, 2, 6);
  add('dish_4x4',        'WHITE', -10, 9, -3, 0, 2, 6);

  // =========================================================================
  // BAG 3: 中央白色懸空長廊與 TSMC 標誌主廳 (Steps 7–9)
  // Footprint: X = -5..-1 (4 studs wide), Z = -7..1 (8 studs long)
  // =========================================================================
  // Step 7: Elevated Pillars & Structural Underframe
  add('brick_1x1', 'WHITE', -5, 1, -7, 0, 3, 7);
  add('brick_1x1', 'WHITE', -2, 1, -7, 0, 3, 7);
  add('brick_1x1', 'WHITE', -5, 1, -3, 0, 3, 7);
  add('brick_1x1', 'WHITE', -2, 1, -3, 0, 3, 7);
  add('brick_1x1', 'WHITE', -5, 1,  0, 0, 3, 7);
  add('brick_1x1', 'WHITE', -2, 1,  0, 0, 3, 7);
  add('plate_4x8', 'LIGHT_BLUISH_GRAY', -5, 4, -7, 0, 3, 7); // X -5..-1, Z -7..1, Y 4..5

  // Step 8: Long White Main Hall Body & Printed TSMC Logo Front
  add('brick_2x6', 'WHITE', -5, 5, -7, 0, 3, 8);
  add('brick_2x6', 'WHITE', -3, 5, -7, 0, 3, 8);
  add('brick_2x2', 'WHITE', -5, 5, -1, 0, 3, 8);
  add('brick_2x2', 'WHITE', -3, 5, -1, 0, 3, 8);
  add('brick_2x6', 'WHITE', -5, 8, -7, 0, 3, 8);
  add('brick_2x6', 'WHITE', -3, 8, -7, 0, 3, 8);
  add('brick_2x2', 'WHITE', -5, 8, -1, 0, 3, 8);
  add('brick_2x2', 'WHITE', -3, 8, -1, 0, 3, 8);
  // Iconic red 'tsmc' logo on the front nose (X -4..-2, Z 1..2, Y 5..6 -> sits on plate)
  add('plate_1x2',     'WHITE', -4, 4, 1, 1, 3, 8);
  add('tile_tsmc_1x2', 'WHITE', -4, 5, 1, 1, 3, 8);

  // Step 9: Sleek Curved Ribbed White Roof (Y = 11..13)
  for (let z = -7; z <= -1; z += 2) {
    add('curved_slope_1x2', 'WHITE', -5, 11, z, 0, 3, 9);
    add('tile_2x2',         'WHITE', -4, 11, z, 0, 3, 9);
    add('curved_slope_1x2', 'WHITE', -2, 11, z, 2, 3, 9);
  }

  // =========================================================================
  // BAG 4: 右側環形白色晶圓廠與屋頂機電管線 (Steps 10–12)
  // Core Sand-Blue Fab: X = 2..8 (6 studs), Z = -6..-1 (5 studs -> use 6x6: Z -6..0)
  // Outer White Ring: X = 1, X = 8..9, Z = -7, Z = 0..1
  // =========================================================================
  // Step 10: Segmented Circular White Outer Ring Wall (no overlap with core X 2..8, Z -6..0)
  for (let x = 2; x <= 6; x += 2) {
    add('brick_1x2',        'WHITE', x, 1,  0, 1, 4, 10);
    add('curved_slope_1x2', 'WHITE', x, 4,  0, 1, 4, 10);
    add('brick_1x2',        'WHITE', x, 1, -7, 1, 4, 10);
    add('curved_slope_1x2', 'WHITE', x, 4, -7, 1, 4, 10);
  }
  for (let z = -6; z <= -2; z += 2) {
    add('brick_1x2',        'WHITE', 1, 1, z, 0, 4, 10);
    add('curved_slope_1x2', 'WHITE', 1, 4, z, 0, 4, 10);
    add('brick_1x2',        'WHITE', 8, 1, z, 0, 4, 10);
    add('curved_slope_1x2', 'WHITE', 8, 4, z, 0, 4, 10);
  }

  // Step 11: Inner Sand-Blue Fab Cleanroom Core (X 2..8, Z -6..0) & Rear Service Tower (X 9..11, Z -7..-5)
  for (let x = 2; x <= 6; x += 2) {
    add('brick_2x6', 'SAND_BLUE', x, 1, -6, 0, 4, 11);
    add('brick_2x6', 'SAND_BLUE', x, 4, -6, 0, 4, 11);
  }
  add('plate_6x6_alt' === 'x' ? 'plate_4x6' : 'plate_4x6', 'LIGHT_BLUISH_GRAY', 2, 7, -6, 0, 4, 11); // X 2..6, Z -6..0
  add('plate_2x6', 'LIGHT_BLUISH_GRAY', 6, 7, -6, 0, 4, 11); // X 6..8, Z -6..0
  // Rear-right gray utility tower (X 9..11, Z -7..-5)
  add('brick_2x2', 'LIGHT_BLUISH_GRAY', 9, 1, -7, 0, 4, 11);
  add('brick_2x2', 'LIGHT_BLUISH_GRAY', 9, 4, -7, 0, 4, 11);
  add('brick_2x2', 'LIGHT_BLUISH_GRAY', 9, 7, -7, 0, 4, 11);
  add('tile_2x2',  'DARK_BLUISH_GRAY',  9, 10, -7, 0, 4, 11);

  // Step 12: Detailed Rooftop MEP Piping & Cleanroom Units (Y = 8, inside X 2..8, Z -6..0)
  add('tile_2x4',        'WHITE',             2, 8, -5, 1, 4, 12); // X 2..6, Z -5..-3
  add('tile_2x4',        'WHITE',             2, 8, -2, 1, 4, 12); // X 2..6, Z -2..0
  add('bar_1x4',         'FLAT_SILVER',       2, 8, -3, 1, 4, 12); // X 2..6, Z -3..-2
  add('tile_grille',     'LIGHT_BLUISH_GRAY', 6, 8, -6, 0, 4, 12); // X 6..7, Z -6..-4
  add('tile_grille',     'LIGHT_BLUISH_GRAY', 6, 8, -3, 0, 4, 12); // X 6..7, Z -3..-1
  add('round_plate_1x1', 'FLAT_SILVER',       7, 8, -5, 0, 4, 12);
  add('round_plate_1x1', 'FLAT_SILVER',       7, 8, -2, 0, 4, 12);

  return B;
}

export const SET_01_HQ = {
  id: 'set01_hq',
  setNumber: '21035',
  shortName: '新竹總部園區',
  name: '新竹總部與生態池園區',
  englishName: 'TSMC Hsinchu HQ & Fab 12 Campus',
  location: '台灣・新竹科學園區 (Hsinchu, Taiwan)',
  age: '18+',
  year: '2024',
  refImage: 'assets/ref/set01.jpg',
  accentColor: '#1492CF',
  cameraPos: [21, 16, 22],
  cameraTarget: [0, 2.2, 0],
  description: '重現台積電新竹總部經典地標：包含中央純白懸空展覽廳與 tsmc 紅標、左側圓頂台積創新館、前方透亮水藍生態景觀池，以及右側白色弧形外牆包覆的沙藍晶圓廠與精密屋頂機電系統。',
  bags: [
    { id: 1, title: '第 1 包：基礎底板、生態水池與植栽', subtitle: 'Foundation, Eco-Pond & Landscaping', color: '#1492CF' },
    { id: 2, title: '第 2 包：台積創新館圓頂與階梯花園', subtitle: 'Innovation Pavilion & Terraced Garden', color: '#5F7F99' },
    { id: 3, title: '第 3 包：中央懸空主廳與 TSMC 標誌', subtitle: 'Elevated White Hall & Logo Canopy', color: '#C91A09' },
    { id: 4, title: '第 4 包：環形白色晶圓廠與屋頂管線', subtitle: 'Curved Fab Ring & Rooftop MEP', color: '#575D63' }
  ],
  steps: [
    { step: 1,  bag: 1, title: '拼接園區基礎底板 (24×16)',       tip: '將三塊 8×16 淺藍灰大型薄板無縫對齊拼合，奠定園區基底。' },
    { step: 2,  bag: 1, title: '建造圓形生態池與透海藍水景',     tip: '使用 1×1 透海藍光磚填滿水池，並以淺灰光磚圍出池岸與中央綠島。' },
    { step: 3,  bag: 1, title: '安裝路緣護欄、綠地與景觀植栽',   tip: '在左下角排列白色斜面路擋，並在生態池四周插上 4 棵園藝樹苗。' },
    { step: 4,  bag: 2, title: '鋪設創新館深棕圓盤與藍綠花圃',   tip: '利用 4×4 深棕大圓盤定位創新館基座，外側點綴透水藍水景溝渠。' },
    { step: 5,  bag: 2, title: '堆疊圓柱核心筒身',               tip: '上下疊加兩組 2×2 圓塔磚，形成懸挑圓頂的支撐柱身。' },
    { step: 6,  bag: 2, title: '蓋上 4×4 白色圓弧穹頂',         tip: '將 4×4 圓弧穹頂蓋扣於白色圓盤上方，完成創新館流線外型。' },
    { step: 7,  bag: 3, title: '架設主廳支撐柱與懸空樓板',       tip: '立起 6 根白色支撐柱並鋪上 4×8 淺灰樓板，營造建築懸空視覺。' },
    { step: 8,  bag: 3, title: '組裝白色長廊主體與 tsmc 紅標',   tip: '雙層堆疊白色標準磚，於正前方鑲嵌專屬「tsmc」紅色印刷光磚。' },
    { step: 9,  bag: 3, title: '覆蓋流線圓弧屋頂',               tip: '兩側對稱扣上白色弧形立面磚，中央以白色光磚收邊。' },
    { step: 10, bag: 4, title: '圍築環形白色晶圓廠外牆',         tip: '沿四邊依序排列白色牆磚與弧形立面磚，形成標誌性環形外殼。' },
    { step: 11, bag: 4, title: '建置沙藍色無塵室核心與機電塔',   tip: '於環牆內堆疊沙藍色廠房主體，右後方立起三層高的淺灰樓梯機電塔。' },
    { step: 12, bag: 4, title: '加裝屋頂銀色機電管線與冷卻機組', tip: '於屋頂精密排列金屬銀 4L 管線、白色空調箱與散熱格柵光磚，大功告成！' }
  ],
  bricks: buildBricks()
};
