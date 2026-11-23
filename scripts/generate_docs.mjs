import fs from 'node:fs';
import path from 'node:path';
import { ALL_SETS } from '../js/sets/index.js';
import { PARTS, COLORS } from '../js/legoCatalog.js';
import { computeBOM, computeBagSummaries } from '../js/bomGenerator.js';

const ROOT = path.resolve(process.cwd());
const DOCS_DIR = path.join(ROOT, 'docs');
fs.mkdirSync(DOCS_DIR, { recursive: true });

let errors = 0;
let grandTotalPieces = 0;

const manualFiles = {
  set01_hq:      'SET01_21035_HQ_MANUAL.md',
  set02_jasm:    'SET02_21036_JASM_MANUAL.md',
  set03_arizona: 'SET03_21037_ARIZONA_MANUAL.md',
  set04_morris:  'SET04_21038_MORRIS_MANUAL.md',
  set05_rd:      'SET05_21039_RD_MANUAL.md'
};

// 1. Validate every single brick in every set
for (const set of ALL_SETS) {
  for (const b of set.bricks) {
    if (!PARTS[b.part]) {
      console.error(`[ERROR] Unknown part "${b.part}" in ${set.id}`);
      errors++;
    }
    if (!COLORS[b.color]) {
      console.error(`[ERROR] Unknown color "${b.color}" in ${set.id}`);
      errors++;
    }
  }
  for (const st of set.steps) {
    const count = set.bricks.filter(b => b.step === st.step).length;
    if (count === 0) {
      console.error(`[ERROR] Step ${st.step} has 0 bricks in ${set.id}`);
      errors++;
    }
  }
  grandTotalPieces += set.bricks.length;
}

if (errors > 0) {
  console.error(`Validation failed with ${errors} errors.`);
  process.exit(1);
}

console.log(`✅ All 5 TSMC LEGO sets validated! Grand total bricks across 5 sets: ${grandTotalPieces}`);

// 2. Generate per-set LEGO Instruction Manual & BOM Markdown files
for (const set of ALL_SETS) {
  const totalBom = computeBOM(set.bricks);
  const bagSummaries = computeBagSummaries(set);

  let md = `# LEGO Architecture #${set.setNumber} — ${set.name}\n\n`;
  md += `> **${set.englishName}**  \n`;
  md += `> 📍 地點：${set.location} ｜ 適用年齡：${set.age} ｜ 總零件數：**${totalBom.totalCount} PCS** ｜ 獨立料號：**${totalBom.uniqueCount} 種** ｜ 分包數量：**${set.bags.length} 包**\n\n`;
  md += `## 1. 盒組設計簡介\n\n${set.description}\n\n`;
  md += `## 2. 分包封裝規劃 (Numbered Polybags)\n\n`;
  md += `| 袋號 | 分包主題 (繁中 / EN) | 對應步驟 | 零件數 | 獨立料號數 |\n`;
  md += `| :---: | :--- | :---: | :---: | :---: |\n`;
  for (const bag of bagSummaries) {
    const minS = Math.min(...bag.steps);
    const maxS = Math.max(...bag.steps);
    md += `| **BAG ${bag.id}** | ${bag.title} (${bag.subtitle}) | Step ${minS}–${maxS} | ${bag.pieceCount} | ${bag.uniqueParts} |\n`;
  }

  md += `\n## 3. 樂高官方風格組裝說明書 (Step-by-Step Building Instructions)\n\n`;
  for (const bag of bagSummaries) {
    md += `### 🛍️ ${bag.title} (${bag.pieceCount} PCS)\n\n`;
    const bagSteps = set.steps.filter(s => s.bag === bag.id);
    for (const st of bagSteps) {
      const stepBom = computeBOM(set.bricks, { step: st.step });
      md += `#### STEP ${st.step} — ${st.title}\n`;
      md += `- **組裝要點**：${st.tip}\n`;
      md += `- **本步驟所需零件 (${stepBom.totalCount} 件)**：\n\n`;
      md += `| 數量 | LEGO 料號 | 零件名稱 | 顏色 (Color ID) |\n`;
      md += `| :---: | :---: | :--- | :--- |\n`;
      for (const item of stepBom.items) {
        md += `| **${item.qty}×** | \`${item.partId}\` | ${item.partZh} (${item.partName}) | ${item.colorZh} / ${item.colorName} (#${item.colorId}) |\n`;
      }
      md += `\n`;
    }
  }

  md += `## 4. 完整零件清單 BOM (Complete Bill of Materials)\n\n`;
  md += `| LEGO 料號 | 零件名稱 (繁中) | Part Name (EN) | 顏色 | Color ID | 數量 |\n`;
  md += `| :---: | :--- | :--- | :--- | :---: | :---: |\n`;
  for (const item of totalBom.items) {
    md += `| \`${item.partId}\` | ${item.partZh} | ${item.partName} | ${item.colorZh} (${item.colorName}) | #${item.colorId} | **${item.qty}** |\n`;
  }
  md += `\n---\n*由 TSMC × LEGO Architecture 3D 互動工坊自動核對生成，與 Three.js 3D 模型 100% 零件一致。*\n`;

  const outFile = path.join(DOCS_DIR, manualFiles[set.id]);
  fs.writeFileSync(outFile, md, 'utf-8');
  console.log(`📄 Generated ${manualFiles[set.id]} (${totalBom.totalCount} pcs, ${totalBom.uniqueCount} unique)`);
}

// 3. Generate Master Design & Series BOM Document
const allBricksCombined = ALL_SETS.flatMap(s => s.bricks);
const masterBom = computeBOM(allBricksCombined);

let masterMd = `# TSMC × LEGO Architecture — 全系列設計總覽與總表 BOM\n\n`;
masterMd += `本專案依據台積電全球五大代表性廠區樂高建築實拍圖片，完整建立 **Three.js 3D 互動模型**、**盒裝開箱與編號分包拆袋組裝流程**、**樂高官方風格步驟說明書** 與 **100% 對應之精準零件 BOM 表**。\n\n`;
masterMd += `🌐 **GitHub Pages 線上 3D 互動體驗**：[https://pc007ya.github.io/TSMC_LEGO_GEMINI/](https://pc007ya.github.io/TSMC_LEGO_GEMINI/)\n\n`;

masterMd += `## 1. 全系列五款盒組總覽\n\n`;
masterMd += `| 編號 | 盒組名稱 | 英文名稱 | 地點 | 總零件數 | 獨立料號 | 分包 / 步驟 | 說明書連結 |\n`;
masterMd += `| :---: | :--- | :--- | :--- | :---: | :---: | :---: | :--- |\n`;
for (const set of ALL_SETS) {
  const b = computeBOM(set.bricks);
  masterMd += `| **#${set.setNumber}** | ${set.name} | ${set.englishName} | ${set.location} | **${b.totalCount}** | ${b.uniqueCount} | ${set.bags.length} 包 / ${set.steps.length} 步 | [${manualFiles[set.id]}](./${manualFiles[set.id]}) |\n`;
}
masterMd += `\n- **全系列 5 組合計總零件數**：**${masterBom.totalCount} PCS**\n`;
masterMd += `- **全系列不重複 (料號 × 顏色) 總數**：**${masterBom.uniqueCount} 項**\n\n`;

masterMd += `## 2. 系統比例與 3D 樂高工程規格\n\n`;
masterMd += `- **標準樂高比例系統 (LEGO System Scale)**：\n`;
masterMd += `  - 1 Stud 間距 = \`1.0 unit\`（對應實體 8.0 mm）\n`;
masterMd += `  - 1 Plate 厚度 = \`0.4 unit\`（對應實體 3.2 mm）\n`;
masterMd += `  - 1 Brick 高度 = \`1.2 unit\` = 3 Plates（對應實體 9.6 mm）\n`;
masterMd += `  - 積木接縫公差 = \`0.032 unit\`，真實呈現物理積木咬合縫隙與陰影\n`;
masterMd += `- **專屬印刷磚 (Custom Printed Tiles)**：\n`;
masterMd += `  - \`3069bpr01\`：1×2 純白印刷磚（紅色 \`tsmc\` 標誌）\n`;
masterMd += `  - \`3068bpr01\`：2×2 純白印刷磚（TSMC 紅色晶圓徽標）\n`;
masterMd += `  - \`14769pr01\`：2×2 圓形印刷磚（TSMC 晶圓徽章）\n`;
masterMd += `  - \`3069bpr02\`：1×2 純白印刷磚（\`Jasm\` 熊本廠標誌）\n`;
masterMd += `  - \`2431pr01\`：1×4 深灰印刷磚（\`張忠謀大樓 Morris Chang Building\` 紀念牆）\n`;
masterMd += `  - \`3039pr01\`：2×2 斜面印刷磚（\`張忠謀大樓\` 展示銘牌）\n\n`;

masterMd += `## 3. 互動開箱與組裝體驗流程\n\n`;
masterMd += `1. **頂部橫欄快速切換**：可一鍵切換 5 款 TSMC 樂高建築，即時載入 Three.js 完整 3D 模型並支援 360° 旋轉、縮放、爆炸檢視與原圖對照。\n`;
masterMd += `2. **典藏盒裝開箱 (Unboxing)**：點擊「📦 開箱組裝」進入 3D 盒裝畫面，點擊撕開封條打開盒蓋。\n`;
masterMd += `3. **編號零件袋拆袋 (Polybags 1–4)**：盒內展開 4 包透明編號零件袋與精裝說明書，依序點擊拆開每包零件倒出至托盤。\n`;
masterMd += `4. **樂高說明書步驟組裝**：藍色零件需求框即時顯示本步驟所需積木 SVG 圖示、料號與數量，點擊「🧱 放置積木」觸發 3D 積木降落卡合動畫與清脆音效，亦支援自動組裝模式。\n\n`;

masterMd += `## 4. 全系列五組合併總 BOM 表 (Master Consolidated BOM)\n\n`;
masterMd += `| LEGO 料號 | 零件名稱 (繁中) | Part Name (EN) | 顏色 | Color ID | 5 組總數量 |\n`;
masterMd += `| :---: | :--- | :--- | :--- | :---: | :---: |\n`;
for (const item of masterBom.items) {
  masterMd += `| \`${item.partId}\` | ${item.partZh} | ${item.partName} | ${item.colorZh} (${item.colorName}) | #${item.colorId} | **${item.qty}** |\n`;
}

fs.writeFileSync(path.join(DOCS_DIR, 'TSMC_LEGO_MASTER_DESIGN.md'), masterMd, 'utf-8');
console.log(`📄 Generated TSMC_LEGO_MASTER_DESIGN.md`);
