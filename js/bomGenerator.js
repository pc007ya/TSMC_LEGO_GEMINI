import { PARTS, COLORS } from './legoCatalog.js';

/**
 * Dynamically computes 100% accurate BOM (Bill of Materials) directly from
 * a LEGO set's brick array. Supports filtering by bag or by step.
 */
export function computeBOM(bricks, filter = {}) {
  const map = new Map();
  let totalCount = 0;

  for (const b of bricks) {
    if (filter.bag !== undefined && b.bag !== filter.bag) continue;
    if (filter.step !== undefined && b.step !== filter.step) continue;

    const key = `${b.part}__${b.color}`;
    if (!map.has(key)) {
      const partDef = PARTS[b.part];
      const colorDef = COLORS[b.color];
      if (!partDef || !colorDef) {
        console.warn('Unknown part or color in BOM:', b);
        continue;
      }
      map.set(key, {
        key,
        partKey: b.part,
        partId: partDef.partId,
        partName: partDef.name,
        partZh: partDef.zh,
        shape: partDef.shape,
        w: partDef.w,
        d: partDef.d,
        h: partDef.h,
        print: partDef.print || null,
        colorKey: b.color,
        colorId: colorDef.id,
        colorName: colorDef.name,
        colorZh: colorDef.zh,
        hex: colorDef.hex,
        transparent: !!colorDef.transparent,
        qty: 0
      });
    }
    map.get(key).qty += 1;
    totalCount += 1;
  }

  const items = Array.from(map.values()).sort((a, b) => {
    if (b.qty !== a.qty) return b.qty - a.qty;
    return a.partId.localeCompare(b.partId);
  });

  return {
    items,
    totalCount,
    uniqueCount: items.length
  };
}

/**
 * Computes bag-level summaries (piece counts, step ranges) for a set.
 */
export function computeBagSummaries(setData) {
  return setData.bags.map(bagMeta => {
    const bagBricks = setData.bricks.filter(b => b.bag === bagMeta.id);
    const stepNums = [...new Set(bagBricks.map(b => b.step))].sort((a, b) => a - b);
    const bom = computeBOM(bagBricks);
    return {
      ...bagMeta,
      pieceCount: bagBricks.length,
      uniqueParts: bom.uniqueCount,
      steps: stepNums,
      bom
    };
  });
}

/**
 * Generates an inline SVG miniature icon of a LEGO brick in its exact color
 * (just like real LEGO instruction manual callout boxes).
 */
export function renderPartSVG(item) {
  const fill = item.hex;
  const stroke = item.colorKey === 'WHITE' ? '#C4C9D0' : 'rgba(0,0,0,0.28)';
  const opacity = item.transparent ? '0.78' : '1';

  if (item.shape === 'round' || item.shape === 'round_plate' || item.shape === 'round_tile' || item.shape === 'dish' || item.shape === 'cone') {
    const isTall = item.h >= 3;
    return `
      <svg viewBox="0 0 44 44" class="part-svg" aria-hidden="true">
        <ellipse cx="22" cy="${isTall ? 31 : 27}" rx="12" ry="6" fill="${fill}" stroke="${stroke}" stroke-width="1.3" opacity="${opacity}"/>
        ${isTall ? `<rect x="10" y="15" width="24" height="16" fill="${fill}" opacity="${opacity}"/>
        <line x1="10" y1="15" x2="10" y2="31" stroke="${stroke}" stroke-width="1.2"/>
        <line x1="34" y1="15" x2="34" y2="31" stroke="${stroke}" stroke-width="1.2"/>` : ''}
        <ellipse cx="22" cy="${isTall ? 15 : 22}" rx="12" ry="6" fill="${fill}" stroke="${stroke}" stroke-width="1.3" opacity="${opacity}"/>
        ${item.shape !== 'round_tile' && item.shape !== 'dish' ? `<ellipse cx="22" cy="${isTall ? 13 : 20}" rx="5" ry="2.6" fill="${fill}" stroke="${stroke}" stroke-width="1.1"/>` : ''}
        ${item.print ? `<circle cx="22" cy="22" r="4.5" fill="#C91A09"/>` : ''}
      </svg>`;
  }

  if (item.shape === 'plant' || item.shape === 'flower') {
    return `
      <svg viewBox="0 0 44 44" class="part-svg" aria-hidden="true">
        <rect x="20" y="20" width="4" height="14" rx="1.5" fill="${fill}" stroke="${stroke}" stroke-width="1"/>
        <circle cx="22" cy="17" r="6" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>
        <circle cx="16" cy="21" r="4.5" fill="${fill}" stroke="${stroke}" stroke-width="1.1"/>
        <circle cx="28" cy="21" r="4.5" fill="${fill}" stroke="${stroke}" stroke-width="1.1"/>
      </svg>`;
  }

  if (item.shape === 'bar') {
    return `
      <svg viewBox="0 0 44 44" class="part-svg" aria-hidden="true">
        <rect x="6" y="19" width="32" height="6" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="1.3"/>
        <line x1="10" y1="21" x2="34" y2="21" stroke="rgba(255,255,255,0.45)" stroke-width="1.2"/>
      </svg>`;
  }

  // Isometric-ish brick / plate / tile / slope representation
  const isPlate = item.h <= 1;
  const isSlope = item.shape === 'slope' || item.shape === 'curved_slope';
  const boxH = isPlate ? 8 : (item.h >= 6 ? 20 : 14);
  const topY = 26 - boxH;
  const hasStuds = item.shape === 'brick' || item.shape === 'plate';

  return `
    <svg viewBox="0 0 44 44" class="part-svg" aria-hidden="true">
      ${isSlope ? `
        <polygon points="8,30 36,30 36,16 18,16" fill="${fill}" stroke="${stroke}" stroke-width="1.3" opacity="${opacity}"/>
      ` : `
        <rect x="7" y="${topY}" width="30" height="${boxH}" rx="1.8" fill="${fill}" stroke="${stroke}" stroke-width="1.3" opacity="${opacity}"/>
        <rect x="7" y="${topY}" width="30" height="3.2" rx="1" fill="rgba(255,255,255,0.22)"/>
      `}
      ${hasStuds ? `
        <rect x="11" y="${topY - 3.2}" width="6" height="3.2" rx="1" fill="${fill}" stroke="${stroke}" stroke-width="1"/>
        <rect x="27" y="${topY - 3.2}" width="6" height="3.2" rx="1" fill="${fill}" stroke="${stroke}" stroke-width="1"/>
      ` : ''}
      ${item.shape === 'grille' ? `
        <line x1="13" y1="${topY + 2}" x2="13" y2="${topY + boxH - 2}" stroke="${stroke}" stroke-width="1.4"/>
        <line x1="22" y1="${topY + 2}" x2="22" y2="${topY + boxH - 2}" stroke="${stroke}" stroke-width="1.4"/>
        <line x1="31" y1="${topY + 2}" x2="31" y2="${topY + boxH - 2}" stroke="${stroke}" stroke-width="1.4"/>
      ` : ''}
      ${item.print ? `<rect x="14" y="${topY + 2}" width="16" height="4" rx="1" fill="#C91A09"/>` : ''}
    </svg>`;
}

/**
 * Export BOM as CSV string for download.
 */
export function exportBOMToCSV(setData) {
  const bom = computeBOM(setData.bricks);
  const header = ['Set ID', 'LEGO Part ID', 'Part Name (EN)', '零件名稱 (繁中)', 'Color ID', 'Color (EN)', '顏色', 'Quantity'];
  const rows = bom.items.map(item => [
    setData.setNumber,
    item.partId,
    `"${item.partName}"`,
    `"${item.partZh}"`,
    item.colorId,
    `"${item.colorName}"`,
    `"${item.colorZh}"`,
    item.qty
  ]);
  return [header.join(','), ...rows.map(r => r.join(','))].join('\n');
}
