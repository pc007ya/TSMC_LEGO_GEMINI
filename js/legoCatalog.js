/**
 * Official LEGO Color Palette & Standard Part Catalog (High-Detail Architecture Edition)
 * Scale: 1 stud = 1.0 unit (8.0mm), 1 plate = 0.4 units (3.2mm), 1 brick = 1.2 units (9.6mm)
 */

export const STUD = 1.0;
export const PLATE = 0.4;
export const BRICK = 1.2;

export const COLORS = {
  WHITE:             { id: '1',   name: 'White',             zh: '純白',       hex: '#F6F7F9', roughness: 0.22, metalness: 0.02 },
  LIGHT_BLUISH_GRAY: { id: '194', name: 'Light Bluish Gray', zh: '淺藍灰',     hex: '#A8AEB4', roughness: 0.26, metalness: 0.05 },
  DARK_BLUISH_GRAY:  { id: '199', name: 'Dark Bluish Gray',  zh: '深藍灰',     hex: '#555C63', roughness: 0.28, metalness: 0.06 },
  BLACK:             { id: '26',  name: 'Black',             zh: '曜石黑',     hex: '#1D2024', roughness: 0.24, metalness: 0.05 },
  DARK_BROWN:        { id: '308', name: 'Dark Brown',        zh: '深棕',       hex: '#352218', roughness: 0.32, metalness: 0.02 },
  REDDISH_BROWN:     { id: '192', name: 'Reddish Brown',     zh: '紅棕',       hex: '#6B3D24', roughness: 0.30, metalness: 0.02 },
  TAN:               { id: '5',   name: 'Tan',               zh: '沙漠米',     hex: '#DAC596', roughness: 0.28, metalness: 0.02 },
  DARK_TAN:          { id: '138', name: 'Dark Tan',          zh: '深米棕',     hex: '#9A8B6C', roughness: 0.30, metalness: 0.02 },
  SAND_BLUE:         { id: '135', name: 'Sand Blue',         zh: '沙藍色',     hex: '#5B7B95', roughness: 0.26, metalness: 0.08 },
  DARK_BLUE:         { id: '140', name: 'Dark Blue',         zh: '海軍深藍',   hex: '#1B3A63', roughness: 0.24, metalness: 0.04 },
  BLUE:              { id: '23',  name: 'Bright Blue',       zh: '寶藍',       hex: '#0055BF', roughness: 0.22, metalness: 0.04 },
  RED:               { id: '21',  name: 'Bright Red',        zh: '台積紅',     hex: '#C91A09', roughness: 0.22, metalness: 0.03 },
  BRIGHT_GREEN:      { id: '37',  name: 'Bright Green',      zh: '鮮綠',       hex: '#1D8F44', roughness: 0.26, metalness: 0.02 },
  DARK_GREEN:        { id: '141', name: 'Dark Green',        zh: '深松綠',     hex: '#184A32', roughness: 0.28, metalness: 0.02 },
  LIME:              { id: '119', name: 'Lime',              zh: '嫩芽綠',     hex: '#9FC33A', roughness: 0.24, metalness: 0.02 },
  FLAT_SILVER:       { id: '315', name: 'Flat Silver',       zh: '金屬銀',     hex: '#92989F', roughness: 0.22, metalness: 0.68 },
  PEARL_GOLD:        { id: '297', name: 'Pearl Gold',        zh: '珍珠金',     hex: '#C8A35A', roughness: 0.24, metalness: 0.58 },
  TRANS_LIGHT_BLUE:  { id: '42',  name: 'Trans-Light Blue',  zh: '透亮水藍',   hex: '#3AC5ED', roughness: 0.06, metalness: 0.08, transparent: true, opacity: 0.72 },
  TRANS_MEDIUM_BLUE: { id: '43',  name: 'Trans-Medium Blue', zh: '透海藍',     hex: '#0D8ECF', roughness: 0.06, metalness: 0.08, transparent: true, opacity: 0.78 },
  TRANS_CLEAR:       { id: '40',  name: 'Trans-Clear',       zh: '透明晶白',   hex: '#E6F4FA', roughness: 0.05, metalness: 0.05, transparent: true, opacity: 0.52 }
};

export const PARTS = {
  // Plates
  plate_16x16:   { partId: '91405', name: 'Plate 16 x 16',          zh: '16×16 基礎薄板',     w: 16, d: 16, h: 1, shape: 'plate', studs: true },
  plate_8x16:    { partId: '92438', name: 'Plate 8 x 16',           zh: '8×16 基礎薄板',      w: 8,  d: 16, h: 1, shape: 'plate', studs: true },
  plate_6x12:    { partId: '3028',  name: 'Plate 6 x 12',           zh: '6×12 基礎薄板',      w: 6,  d: 12, h: 1, shape: 'plate', studs: true },
  plate_6x8:     { partId: '3036',  name: 'Plate 6 x 8',            zh: '6×8 薄板',           w: 6,  d: 8,  h: 1, shape: 'plate', studs: true },
  plate_4x8:     { partId: '3035',  name: 'Plate 4 x 8',            zh: '4×8 薄板',           w: 4,  d: 8,  h: 1, shape: 'plate', studs: true },
  plate_4x6:     { partId: '3032',  name: 'Plate 4 x 6',            zh: '4×6 薄板',           w: 4,  d: 6,  h: 1, shape: 'plate', studs: true },
  plate_4x4:     { partId: '3031',  name: 'Plate 4 x 4',            zh: '4×4 薄板',           w: 4,  d: 4,  h: 1, shape: 'plate', studs: true },
  plate_2x8:     { partId: '3034',  name: 'Plate 2 x 8',            zh: '2×8 長薄板',         w: 2,  d: 8,  h: 1, shape: 'plate', studs: true },
  plate_2x6:     { partId: '3795',  name: 'Plate 2 x 6',            zh: '2×6 薄板',           w: 2,  d: 6,  h: 1, shape: 'plate', studs: true },
  plate_2x4:     { partId: '3020',  name: 'Plate 2 x 4',            zh: '2×4 薄板',           w: 2,  d: 4,  h: 1, shape: 'plate', studs: true },
  plate_2x3:     { partId: '3021',  name: 'Plate 2 x 3',            zh: '2×3 薄板',           w: 2,  d: 3,  h: 1, shape: 'plate', studs: true },
  plate_2x2:     { partId: '3022',  name: 'Plate 2 x 2',            zh: '2×2 薄板',           w: 2,  d: 2,  h: 1, shape: 'plate', studs: true },
  plate_1x8:     { partId: '3460',  name: 'Plate 1 x 8',            zh: '1×8 細長薄板',       w: 1,  d: 8,  h: 1, shape: 'plate', studs: true },
  plate_1x6:     { partId: '3666',  name: 'Plate 1 x 6',            zh: '1×6 細長薄板',       w: 1,  d: 6,  h: 1, shape: 'plate', studs: true },
  plate_1x4:     { partId: '3710',  name: 'Plate 1 x 4',            zh: '1×4 薄板',           w: 1,  d: 4,  h: 1, shape: 'plate', studs: true },
  plate_1x3:     { partId: '3623',  name: 'Plate 1 x 3',            zh: '1×3 薄板',           w: 1,  d: 3,  h: 1, shape: 'plate', studs: true },
  plate_1x2:     { partId: '3023',  name: 'Plate 1 x 2',            zh: '1×2 薄板',           w: 1,  d: 2,  h: 1, shape: 'plate', studs: true },
  plate_1x1:     { partId: '3024',  name: 'Plate 1 x 1',            zh: '1×1 單點薄板',       w: 1,  d: 1,  h: 1, shape: 'plate', studs: true },

  // Tiles (smooth top)
  tile_2x4:      { partId: '87079', name: 'Tile 2 x 4',             zh: '2×4 平面光磚',       w: 2,  d: 4,  h: 1, shape: 'tile', studs: false },
  tile_2x3:      { partId: '26603', name: 'Tile 2 x 3',             zh: '2×3 平面光磚',       w: 2,  d: 3,  h: 1, shape: 'tile', studs: false },
  tile_2x2:      { partId: '3068b', name: 'Tile 2 x 2',             zh: '2×2 平面光磚',       w: 2,  d: 2,  h: 1, shape: 'tile', studs: false },
  tile_1x6:      { partId: '6636',  name: 'Tile 1 x 6',             zh: '1×6 長條光磚',       w: 1,  d: 6,  h: 1, shape: 'tile', studs: false },
  tile_1x4:      { partId: '2431',  name: 'Tile 1 x 4',             zh: '1×4 光磚',           w: 1,  d: 4,  h: 1, shape: 'tile', studs: false },
  tile_1x3:      { partId: '63864', name: 'Tile 1 x 3',             zh: '1×3 光磚',           w: 1,  d: 3,  h: 1, shape: 'tile', studs: false },
  tile_1x2:      { partId: '3069b', name: 'Tile 1 x 2',             zh: '1×2 光磚',           w: 1,  d: 2,  h: 1, shape: 'tile', studs: false },
  tile_1x1:      { partId: '3070b', name: 'Tile 1 x 1',             zh: '1×1 單格光磚',       w: 1,  d: 1,  h: 1, shape: 'tile', studs: false },
  tile_grille:   { partId: '2412b', name: 'Tile, Modified 1 x 2 Grille', zh: '1×2 散熱格柵光磚', w: 1, d: 2, h: 1, shape: 'grille', studs: false },

  // Standard & Architectural Bricks
  brick_2x6:     { partId: '2456',  name: 'Brick 2 x 6',            zh: '2×6 標準磚',         w: 2,  d: 6,  h: 3, shape: 'brick', studs: true },
  brick_2x4:     { partId: '3001',  name: 'Brick 2 x 4',            zh: '2×4 標準磚',         w: 2,  d: 4,  h: 3, shape: 'brick', studs: true },
  brick_2x3:     { partId: '3002',  name: 'Brick 2 x 3',            zh: '2×3 標準磚',         w: 2,  d: 3,  h: 3, shape: 'brick', studs: true },
  brick_2x2:     { partId: '3003',  name: 'Brick 2 x 2',            zh: '2×2 方磚',           w: 2,  d: 2,  h: 3, shape: 'brick', studs: true },
  brick_1x6:     { partId: '3009',  name: 'Brick 1 x 6',            zh: '1×6 長牆磚',         w: 1,  d: 6,  h: 3, shape: 'brick', studs: true },
  brick_1x4:     { partId: '3010',  name: 'Brick 1 x 4',            zh: '1×4 牆磚',           w: 1,  d: 4,  h: 3, shape: 'brick', studs: true },
  brick_1x3:     { partId: '3622',  name: 'Brick 1 x 3',            zh: '1×3 牆磚',           w: 1,  d: 3,  h: 3, shape: 'brick', studs: true },
  brick_1x2:     { partId: '3004',  name: 'Brick 1 x 2',            zh: '1×2 標準磚',         w: 1,  d: 2,  h: 3, shape: 'brick', studs: true },
  brick_1x1:     { partId: '3005',  name: 'Brick 1 x 1',            zh: '1×1 柱磚',           w: 1,  d: 1,  h: 3, shape: 'brick', studs: true },
  brick_1x2x2:   { partId: '3245c', name: 'Brick 1 x 2 x 2',        zh: '1×2×2 高牆柱磚',     w: 1,  d: 2,  h: 6, shape: 'brick', studs: true },
  brick_1x1x2:   { partId: '2454',  name: 'Brick 1 x 1 x 2',        zh: '1×1×2 高柱磚',       w: 1,  d: 1,  h: 6, shape: 'brick', studs: true },
  vent_brick_1x2:{ partId: '2877',  name: 'Brick, Modified 1 x 2 Grille', zh: '1×2 百葉紋建築磚', w: 1, d: 2, h: 3, shape: 'vent_brick', studs: true },
  v_pillar_1x2:  { partId: '3004v', name: 'Support V-Pillar 1 x 2', zh: '1×2 V型斜撐柱',      w: 1,  d: 2,  h: 3, shape: 'v_pillar', studs: false },

  // Round / Cylindrical / Piping / Cooling Fans
  round_brick_1x1: { partId: '3062b', name: 'Brick, Round 1 x 1',   zh: '1×1 圓柱磚',         w: 1,  d: 1,  h: 3, shape: 'round', studs: true },
  round_brick_2x2: { partId: '3941',  name: 'Brick, Round 2 x 2',   zh: '2×2 圓塔磚',         w: 2,  d: 2,  h: 3, shape: 'round', studs: true },
  round_plate_1x1: { partId: '4073',  name: 'Plate, Round 1 x 1',   zh: '1×1 圓薄片',         w: 1,  d: 1,  h: 1, shape: 'round_plate', studs: true },
  round_plate_2x2: { partId: '4032',  name: 'Plate, Round 2 x 2',   zh: '2×2 圓薄板',         w: 2,  d: 2,  h: 1, shape: 'round_plate', studs: true },
  round_plate_4x4: { partId: '60474', name: 'Plate, Round 4 x 4',   zh: '4×4 大圓盤',         w: 4,  d: 4,  h: 1, shape: 'round_plate', studs: true },
  round_tile_2x2:  { partId: '14769', name: 'Tile, Round 2 x 2',    zh: '2×2 圓形光磚',       w: 2,  d: 2,  h: 1, shape: 'round_tile', studs: false },
  round_tile_1x1:  { partId: '98138', name: 'Tile, Round 1 x 1',    zh: '1×1 圓形小光磚',     w: 1,  d: 1,  h: 1, shape: 'round_tile', studs: false },
  cooling_fan_1x1: { partId: '98138f',name: 'Tile, Round 1 x 1 Cooling Fan', zh: '1×1 冷卻風扇圓磚', w: 1, d: 1, h: 1, shape: 'cooling_fan', studs: false },
  dish_4x4:        { partId: '3960',  name: 'Dish 4 x 4 Inverted',  zh: '4×4 圓弧穹頂蓋',     w: 4,  d: 4,  h: 2, shape: 'dish', studs: false },
  cone_1x1:        { partId: '4589b', name: 'Cone 1 x 1',           zh: '1×1 錐形排氣管',     w: 1,  d: 1,  h: 3, shape: 'cone', studs: true },
  bar_1x4:         { partId: '30374', name: 'Bar 4L (MEP Pipe)',    zh: '4L 管線圓桿',        w: 1,  d: 4,  h: 1, shape: 'bar', studs: false },

  // Slopes & Curved Architectural Bricks
  slope_1x2:       { partId: '85984', name: 'Slope 30° 1 x 2 x 2/3', zh: '1×2 斜面修飾磚',    w: 1,  d: 2,  h: 2, shape: 'slope', studs: false },
  slope_2x2:       { partId: '3039',  name: 'Slope 45° 2 x 2',       zh: '2×2 斜面銘牌磚',    w: 2,  d: 2,  h: 3, shape: 'slope', studs: false },
  curved_slope_1x2:{ partId: '11477', name: 'Slope, Curved 2 x 1',   zh: '1×2 弧形立面磚',    w: 1,  d: 2,  h: 2, shape: 'curved_slope', studs: false },
  curved_slope_2x2:{ partId: '15068', name: 'Slope, Curved 2 x 2',   zh: '2×2 圓弧屋頂磚',    w: 2,  d: 2,  h: 2, shape: 'curved_slope', studs: false },

  // Landscaping
  plant_stem:      { partId: '3741',  name: 'Plant Flower Stem',     zh: '園藝植栽樹苗',      w: 1,  d: 1,  h: 3, shape: 'plant', studs: false },
  flower_1x1:      { partId: '24866', name: 'Plate, Round 1 x 1 Flower', zh: '1×1 樹冠花葉片', w: 1, d: 1, h: 1, shape: 'flower', studs: true },

  // Custom Printed TSMC Commemorative Tiles (Flat & Vertical SNOT Wall-Mounted!)
  tile_tsmc_1x2:       { partId: '3069bpr01', name: 'Tile 1 x 2 (Printed TSMC)',             zh: '1×2 印刷磚 (tsmc 紅標)',       w: 1, d: 2, h: 1, shape: 'tile', studs: false, print: 'TSMC_RED' },
  wall_tsmc_1x2:       { partId: '3069bpr01', name: 'Tile 1 x 2 SNOT (Printed TSMC)',        zh: '1×2 立面印刷磚 (tsmc 紅標)',   w: 2, d: 1, h: 3, shape: 'wall_tile', studs: false, print: 'TSMC_RED' },
  wall_tsmc_2x2:       { partId: '3068bpr01', name: 'Tile 2 x 2 SNOT (TSMC Wafer Logo)',     zh: '2×2 立面印刷磚 (TSMC 晶圓標)', w: 2, d: 1, h: 5, shape: 'wall_tile', studs: false, print: 'TSMC_WAFER' },
  wall_tsmc_round_2x2: { partId: '14769pr01', name: 'Tile Round 2 x 2 SNOT (TSMC Emblem)',   zh: '2×2 圓形立面印刷磚 (TSMC 徽)', w: 2, d: 1, h: 5, shape: 'wall_round_tile', studs: false, print: 'TSMC_WAFER' },
  wall_jasm_1x2:       { partId: '3069bpr02', name: 'Tile 1 x 2 SNOT (Printed JASM)',        zh: '1×2 立面印刷磚 (Jasm 標誌)',   w: 2, d: 1, h: 3, shape: 'wall_tile', studs: false, print: 'JASM' },
  wall_morris_1x4:     { partId: '2431pr01',  name: 'Tile 1 x 4 SNOT (張忠謀大樓)',           zh: '1×4 立面印刷磚 (張忠謀大樓)',  w: 4, d: 1, h: 4, shape: 'wall_tile', studs: false, print: 'MORRIS_WALL' },
  slope_morris_2x2:    { partId: '3039pr01',  name: 'Slope 2 x 2 (張忠謀大樓 銘牌)',          zh: '2×2 斜面印刷磚 (張忠謀大樓)',  w: 2, d: 2, h: 3, shape: 'slope', studs: false, print: 'MORRIS_PLAQUE' },
  slope_ntt_2x2:       { partId: '3039pr02',  name: 'Slope 2 x 2 (臺中國家歌劇院 銘牌)',      zh: '2×2 斜面印刷磚 (臺中國家歌劇院)', w: 2, d: 2, h: 3, shape: 'slope', studs: false, print: 'NTT_PLAQUE' },
  slope_ticec_2x2:     { partId: '3039pr03',  name: 'Slope 2 x 2 (臺中國際會展中心 銘牌)',    zh: '2×2 斜面印刷磚 (臺中國際會展中心)', w: 2, d: 2, h: 3, shape: 'slope', studs: false, print: 'TICEC_PLAQUE' },
  slope_tgm_2x2:       { partId: '3039pr04',  name: 'Slope 2 x 2 (臺中綠美圖 銘牌)',          zh: '2×2 斜面印刷磚 (臺中綠美圖)',      w: 2, d: 2, h: 3, shape: 'slope', studs: false, print: 'TGM_PLAQUE' },
  slope_tch_2x2:       { partId: '3039pr05',  name: 'Slope 2 x 2 (臺中市政府 銘牌)',          zh: '2×2 斜面印刷磚 (臺中市政府)',      w: 2, d: 2, h: 3, shape: 'slope', studs: false, print: 'TCH_PLAQUE' },
  slope_dji_2x2:       { partId: '3039pr06',  name: 'Slope 2 x 2 (大疆天空之城 銘牌)',        zh: '2×2 斜面印刷磚 (大疆天空之城)',    w: 2, d: 2, h: 3, shape: 'slope', studs: false, print: 'DJI_PLAQUE' }
};

export function brick(part, color, x, y, z, rot = 0, bag = 1, step = 1) {
  return { part, color, x, y, z, rot, bag, step };
}

/**
 * Grid-exact placement helper using integer corner coordinates (xMin, y, zMin).
 */
export function place(part, color, xMin, y, zMin, rot = 0, bag = 1, step = 1) {
  const def = PARTS[part];
  if (!def) throw new Error(`Unknown part: ${part}`);
  const isRot = (rot % 2) === 1;
  const w = isRot ? def.d : def.w;
  const d = isRot ? def.w : def.d;
  return {
    part,
    color,
    x: xMin + w / 2,
    y,
    z: zMin + d / 2,
    rot,
    bag,
    step
  };
}

/**
 * Free-angle placement helper for 45° diagonal LEGO turntable/hinge sub-assemblies
 * and true circular segmented ring walls (e.g., TSMC Nanjing Fab 16).
 */
export function placeAngled(part, color, cx, y, cz, rotDeg = 0, bag = 1, step = 1) {
  const def = PARTS[part];
  if (!def) throw new Error(`Unknown part: ${part}`);
  return {
    part,
    color,
    x: cx,
    y,
    z: cz,
    rot: 0,
    rotDeg,
    bag,
    step
  };
}
