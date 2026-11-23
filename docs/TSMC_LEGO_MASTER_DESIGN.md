# TSMC × LEGO Architecture — 全系列設計總覽與總表 BOM

本專案依據台積電全球五大代表性廠區樂高建築實拍圖片，完整建立 **Three.js 3D 互動模型**、**盒裝開箱與編號分包拆袋組裝流程**、**樂高官方風格步驟說明書** 與 **100% 對應之精準零件 BOM 表**。

🌐 **GitHub Pages 線上 3D 互動體驗**：[https://pc007ya.github.io/TSMC_LEGO_GEMINI/](https://pc007ya.github.io/TSMC_LEGO_GEMINI/)

## 1. 全系列五款盒組總覽

| 編號 | 盒組名稱 | 英文名稱 | 地點 | 總零件數 | 獨立料號 | 分包 / 步驟 | 說明書連結 |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **#21035** | 新竹總部與生態池園區 | TSMC Hsinchu HQ & Fab 12 Campus | 台灣・新竹科學園區 (Hsinchu, Taiwan) | **260** | 45 | 4 包 / 16 步 | [SET01_21035_HQ_MANUAL.md](./SET01_21035_HQ_MANUAL.md) |
| **#21036** | JASM 熊本一廠 | TSMC JASM Kumamoto Fab, Japan | 日本・熊本縣菊陽町 (Kumamoto, Japan) | **197** | 40 | 4 包 / 16 步 | [SET02_21036_JASM_MANUAL.md](./SET02_21036_JASM_MANUAL.md) |
| **#21037** | 亞利桑那鳳凰城廠 (Fab 21) | TSMC Arizona Fab 21, Phoenix | 美國・亞利桑那州鳳凰城 (Phoenix, AZ, USA) | **171** | 26 | 4 包 / 16 步 | [SET03_21037_ARIZONA_MANUAL.md](./SET03_21037_ARIZONA_MANUAL.md) |
| **#21038** | 張忠謀大樓 (Morris Chang Building) | TSMC Morris Chang Building (HQ) | 台灣・新竹科學園區力行六路 (Hsinchu, Taiwan) | **303** | 74 | 4 包 / 16 步 | [SET04_21038_MORRIS_MANUAL.md](./SET04_21038_MORRIS_MANUAL.md) |
| **#21039** | 台積電全球研發中心 (Global R&D Center) | TSMC Global R&D Center, Hsinchu | 台灣・新竹寶山 (Baoshan, Hsinchu, Taiwan) | **198** | 42 | 4 包 / 16 步 | [SET05_21039_RD_MANUAL.md](./SET05_21039_RD_MANUAL.md) |

- **全系列 5 組合計總零件數**：**1129 PCS**
- **全系列不重複 (料號 × 顏色) 總數**：**165 項**

## 2. 系統比例與 3D 樂高工程規格

- **標準樂高比例系統 (LEGO System Scale)**：
  - 1 Stud 間距 = `1.0 unit`（對應實體 8.0 mm）
  - 1 Plate 厚度 = `0.4 unit`（對應實體 3.2 mm）
  - 1 Brick 高度 = `1.2 unit` = 3 Plates（對應實體 9.6 mm）
  - 積木接縫公差 = `0.032 unit`，真實呈現物理積木咬合縫隙與陰影
- **專屬印刷磚 (Custom Printed Tiles)**：
  - `3069bpr01`：1×2 純白印刷磚（紅色 `tsmc` 標誌）
  - `3068bpr01`：2×2 純白印刷磚（TSMC 紅色晶圓徽標）
  - `14769pr01`：2×2 圓形印刷磚（TSMC 晶圓徽章）
  - `3069bpr02`：1×2 純白印刷磚（`Jasm` 熊本廠標誌）
  - `2431pr01`：1×4 深灰印刷磚（`張忠謀大樓 Morris Chang Building` 紀念牆）
  - `3039pr01`：2×2 斜面印刷磚（`張忠謀大樓` 展示銘牌）

## 3. 互動開箱與組裝體驗流程

1. **頂部橫欄快速切換**：可一鍵切換 5 款 TSMC 樂高建築，即時載入 Three.js 完整 3D 模型並支援 360° 旋轉、縮放、爆炸檢視與原圖對照。
2. **典藏盒裝開箱 (Unboxing)**：點擊「📦 開箱組裝」進入 3D 盒裝畫面，點擊撕開封條打開盒蓋。
3. **編號零件袋拆袋 (Polybags 1–4)**：盒內展開 4 包透明編號零件袋與精裝說明書，依序點擊拆開每包零件倒出至托盤。
4. **樂高說明書步驟組裝**：藍色零件需求框即時顯示本步驟所需積木 SVG 圖示、料號與數量，點擊「🧱 放置積木」觸發 3D 積木降落卡合動畫與清脆音效，亦支援自動組裝模式。

## 4. 全系列五組合併總 BOM 表 (Master Consolidated BOM)

| LEGO 料號 | 零件名稱 (繁中) | Part Name (EN) | 顏色 | Color ID | 5 組總數量 |
| :---: | :--- | :--- | :--- | :---: | :---: |
| `2456` | 2×6 標準磚 | Brick 2 x 6 | 純白 (White) | #1 | **47** |
| `3070b` | 1×1 單格光磚 | Tile 1 x 1 | 淺藍灰 (Light Bluish Gray) | #194 | **45** |
| `2456` | 2×6 標準磚 | Brick 2 x 6 | 淺藍灰 (Light Bluish Gray) | #194 | **38** |
| `3024` | 1×1 單點薄板 | Plate 1 x 1 | 淺藍灰 (Light Bluish Gray) | #194 | **38** |
| `3070b` | 1×1 單格光磚 | Tile 1 x 1 | 透海藍 (Trans-Medium Blue) | #43 | **32** |
| `24866` | 1×1 樹冠花葉片 | Plate, Round 1 x 1 Flower | 鮮綠 (Bright Green) | #37 | **30** |
| `11477` | 1×2 弧形立面磚 | Slope, Curved 2 x 1 | 純白 (White) | #1 | **28** |
| `2877` | 1×2 百葉紋建築磚 | Brick, Modified 1 x 2 Grille | 曜石黑 (Black) | #26 | **28** |
| `87079` | 2×4 平面光磚 | Tile 2 x 4 | 沙漠米 (Tan) | #5 | **28** |
| `98138f` | 1×1 冷卻風扇圓磚 | Tile, Round 1 x 1 Cooling Fan | 金屬銀 (Flat Silver) | #315 | **27** |
| `2456` | 2×6 標準磚 | Brick 2 x 6 | 沙藍色 (Sand Blue) | #135 | **24** |
| `3003` | 2×2 方磚 | Brick 2 x 2 | 沙藍色 (Sand Blue) | #135 | **24** |
| `30374` | 4L 管線圓桿 | Bar 4L (MEP Pipe) | 金屬銀 (Flat Silver) | #315 | **22** |
| `3062b` | 1×1 圓柱磚 | Brick, Round 1 x 1 | 金屬銀 (Flat Silver) | #315 | **22** |
| `4073` | 1×1 圓薄片 | Plate, Round 1 x 1 | 沙漠米 (Tan) | #5 | **22** |
| `2412b` | 1×2 散熱格柵光磚 | Tile, Modified 1 x 2 Grille | 純白 (White) | #1 | **20** |
| `2412b` | 1×2 散熱格柵光磚 | Tile, Modified 1 x 2 Grille | 深藍灰 (Dark Bluish Gray) | #199 | **19** |
| `3004` | 1×2 標準磚 | Brick 1 x 2 | 純白 (White) | #1 | **19** |
| `24866` | 1×1 樹冠花葉片 | Plate, Round 1 x 1 Flower | 深松綠 (Dark Green) | #141 | **18** |
| `3795` | 2×6 薄板 | Plate 2 x 6 | 深藍灰 (Dark Bluish Gray) | #199 | **18** |
| `3003` | 2×2 方磚 | Brick 2 x 2 | 純白 (White) | #1 | **16** |
| `3795` | 2×6 薄板 | Plate 2 x 6 | 純白 (White) | #1 | **16** |
| `2454` | 1×1×2 高柱磚 | Brick 1 x 1 x 2 | 透亮水藍 (Trans-Light Blue) | #42 | **14** |
| `2456` | 2×6 標準磚 | Brick 2 x 6 | 深藍灰 (Dark Bluish Gray) | #199 | **14** |
| `3002` | 2×3 標準磚 | Brick 2 x 3 | 淺藍灰 (Light Bluish Gray) | #194 | **14** |
| `85984` | 1×2 斜面修飾磚 | Slope 30° 1 x 2 x 2/3 | 純白 (White) | #1 | **14** |
| `3069b` | 1×2 光磚 | Tile 1 x 2 | 透亮水藍 (Trans-Light Blue) | #42 | **13** |
| `87079` | 2×4 平面光磚 | Tile 2 x 4 | 純白 (White) | #1 | **13** |
| `92438` | 8×16 基礎薄板 | Plate 8 x 16 | 淺藍灰 (Light Bluish Gray) | #194 | **11** |
| `3009` | 1×6 長牆磚 | Brick 1 x 6 | 淺藍灰 (Light Bluish Gray) | #194 | **10** |
| `3010` | 1×4 牆磚 | Brick 1 x 4 | 沙藍色 (Sand Blue) | #135 | **10** |
| `3622` | 1×3 牆磚 | Brick 1 x 3 | 淺藍灰 (Light Bluish Gray) | #194 | **10** |
| `3741` | 園藝植栽樹苗 | Plant Flower Stem | 鮮綠 (Bright Green) | #37 | **10** |
| `4073` | 1×1 圓薄片 | Plate, Round 1 x 1 | 金屬銀 (Flat Silver) | #315 | **10** |
| `15068` | 2×2 圓弧屋頂磚 | Slope, Curved 2 x 2 | 純白 (White) | #1 | **9** |
| `2454` | 1×1×2 高柱磚 | Brick 1 x 1 x 2 | 淺藍灰 (Light Bluish Gray) | #194 | **9** |
| `3001` | 2×4 標準磚 | Brick 2 x 4 | 深藍灰 (Dark Bluish Gray) | #199 | **9** |
| `3035` | 4×8 薄板 | Plate 4 x 8 | 淺藍灰 (Light Bluish Gray) | #194 | **9** |
| `2412b` | 1×2 散熱格柵光磚 | Tile, Modified 1 x 2 Grille | 深米棕 (Dark Tan) | #138 | **8** |
| `2431` | 1×4 光磚 | Tile 1 x 4 | 純白 (White) | #1 | **8** |
| `2454` | 1×1×2 高柱磚 | Brick 1 x 1 x 2 | 純白 (White) | #1 | **8** |
| `3062b` | 1×1 圓柱磚 | Brick, Round 1 x 1 | 沙漠米 (Tan) | #5 | **8** |
| `3069b` | 1×2 光磚 | Tile 1 x 2 | 淺藍灰 (Light Bluish Gray) | #194 | **8** |
| `87079` | 2×4 平面光磚 | Tile 2 x 4 | 淺藍灰 (Light Bluish Gray) | #194 | **8** |
| `3005` | 1×1 柱磚 | Brick 1 x 1 | 淺藍灰 (Light Bluish Gray) | #194 | **7** |
| `3005` | 1×1 柱磚 | Brick 1 x 1 | 透亮水藍 (Trans-Light Blue) | #42 | **7** |
| `3010` | 1×4 牆磚 | Brick 1 x 4 | 純白 (White) | #1 | **7** |
| `6636` | 1×6 長條光磚 | Tile 1 x 6 | 純白 (White) | #1 | **7** |
| `2877` | 1×2 百葉紋建築磚 | Brick, Modified 1 x 2 Grille | 純白 (White) | #1 | **6** |
| `3001` | 2×4 標準磚 | Brick 2 x 4 | 純白 (White) | #1 | **6** |
| `3003` | 2×2 方磚 | Brick 2 x 2 | 深藍灰 (Dark Bluish Gray) | #199 | **6** |
| `3004v` | 1×2 V型斜撐柱 | Support V-Pillar 1 x 2 | 純白 (White) | #1 | **6** |
| `3036` | 6×8 薄板 | Plate 6 x 8 | 透亮水藍 (Trans-Light Blue) | #42 | **6** |
| `3036` | 6×8 薄板 | Plate 6 x 8 | 純白 (White) | #1 | **6** |
| `3062b` | 1×1 圓柱磚 | Brick, Round 1 x 1 | 純白 (White) | #1 | **6** |
| `24866` | 1×1 樹冠花葉片 | Plate, Round 1 x 1 Flower | 嫩芽綠 (Lime) | #119 | **5** |
| `3005` | 1×1 柱磚 | Brick 1 x 1 | 純白 (White) | #1 | **5** |
| `3020` | 2×4 薄板 | Plate 2 x 4 | 透亮水藍 (Trans-Light Blue) | #42 | **5** |
| `3020` | 2×4 薄板 | Plate 2 x 4 | 透海藍 (Trans-Medium Blue) | #43 | **5** |
| `3021` | 2×3 薄板 | Plate 2 x 3 | 純白 (White) | #1 | **5** |
| `3031` | 4×4 薄板 | Plate 4 x 4 | 透亮水藍 (Trans-Light Blue) | #42 | **5** |
| `3031` | 4×4 薄板 | Plate 4 x 4 | 透海藍 (Trans-Medium Blue) | #43 | **5** |
| `3036` | 6×8 薄板 | Plate 6 x 8 | 淺藍灰 (Light Bluish Gray) | #194 | **5** |
| `3062b` | 1×1 圓柱磚 | Brick, Round 1 x 1 | 紅棕 (Reddish Brown) | #192 | **5** |
| `3069b` | 1×2 光磚 | Tile 1 x 2 | 深藍灰 (Dark Bluish Gray) | #199 | **5** |
| `3245c` | 1×2×2 高牆柱磚 | Brick 1 x 2 x 2 | 曜石黑 (Black) | #26 | **5** |
| `3666` | 1×6 細長薄板 | Plate 1 x 6 | 透亮水藍 (Trans-Light Blue) | #42 | **5** |
| `3666` | 1×6 細長薄板 | Plate 1 x 6 | 透海藍 (Trans-Medium Blue) | #43 | **5** |
| `4073` | 1×1 圓薄片 | Plate, Round 1 x 1 | 紅棕 (Reddish Brown) | #192 | **5** |
| `6636` | 1×6 長條光磚 | Tile 1 x 6 | 深藍灰 (Dark Bluish Gray) | #199 | **5** |
| `87079` | 2×4 平面光磚 | Tile 2 x 4 | 深藍灰 (Dark Bluish Gray) | #199 | **5** |
| `3028` | 6×12 基礎薄板 | Plate 6 x 12 | 淺藍灰 (Light Bluish Gray) | #194 | **4** |
| `3032` | 4×6 薄板 | Plate 4 x 6 | 純白 (White) | #1 | **4** |
| `3034` | 2×8 長薄板 | Plate 2 x 8 | 淺藍灰 (Light Bluish Gray) | #194 | **4** |
| `3034` | 2×8 長薄板 | Plate 2 x 8 | 鮮綠 (Bright Green) | #37 | **4** |
| `3034` | 2×8 長薄板 | Plate 2 x 8 | 沙漠米 (Tan) | #5 | **4** |
| `3035` | 4×8 薄板 | Plate 4 x 8 | 深棕 (Dark Brown) | #308 | **4** |
| `3069b` | 1×2 光磚 | Tile 1 x 2 | 曜石黑 (Black) | #26 | **4** |
| `3710` | 1×4 薄板 | Plate 1 x 4 | 深藍灰 (Dark Bluish Gray) | #199 | **4** |
| `92438` | 8×16 基礎薄板 | Plate 8 x 16 | 沙漠米 (Tan) | #5 | **4** |
| `2412b` | 1×2 散熱格柵光磚 | Tile, Modified 1 x 2 Grille | 淺藍灰 (Light Bluish Gray) | #194 | **3** |
| `26603` | 2×3 平面光磚 | Tile 2 x 3 | 透亮水藍 (Trans-Light Blue) | #42 | **3** |
| `3023` | 1×2 薄板 | Plate 1 x 2 | 純白 (White) | #1 | **3** |
| `3024` | 1×1 單點薄板 | Plate 1 x 1 | 深藍灰 (Dark Bluish Gray) | #199 | **3** |
| `3024` | 1×1 單點薄板 | Plate 1 x 1 | 純白 (White) | #1 | **3** |
| `3035` | 4×8 薄板 | Plate 4 x 8 | 深藍灰 (Dark Bluish Gray) | #199 | **3** |
| `30374` | 4L 管線圓桿 | Bar 4L (MEP Pipe) | 珍珠金 (Pearl Gold) | #297 | **3** |
| `3245c` | 1×2×2 高牆柱磚 | Brick 1 x 2 x 2 | 深藍灰 (Dark Bluish Gray) | #199 | **3** |
| `3710` | 1×4 薄板 | Plate 1 x 4 | 純白 (White) | #1 | **3** |
| `4073` | 1×1 圓薄片 | Plate, Round 1 x 1 | 淺藍灰 (Light Bluish Gray) | #194 | **3** |
| `4589b` | 1×1 錐形排氣管 | Cone 1 x 1 | 深藍灰 (Dark Bluish Gray) | #199 | **3** |
| `2431` | 1×4 光磚 | Tile 1 x 4 | 沙藍色 (Sand Blue) | #135 | **2** |
| `2454` | 1×1×2 高柱磚 | Brick 1 x 1 x 2 | 台積紅 (Bright Red) | #21 | **2** |
| `26603` | 2×3 平面光磚 | Tile 2 x 3 | 純白 (White) | #1 | **2** |
| `3002` | 2×3 標準磚 | Brick 2 x 3 | 透亮水藍 (Trans-Light Blue) | #42 | **2** |
| `3005` | 1×1 柱磚 | Brick 1 x 1 | 深藍灰 (Dark Bluish Gray) | #199 | **2** |
| `3009` | 1×6 長牆磚 | Brick 1 x 6 | 純白 (White) | #1 | **2** |
| `3009` | 1×6 長牆磚 | Brick 1 x 6 | 深藍灰 (Dark Bluish Gray) | #199 | **2** |
| `3020` | 2×4 薄板 | Plate 2 x 4 | 深松綠 (Dark Green) | #141 | **2** |
| `3022` | 2×2 薄板 | Plate 2 x 2 | 鮮綠 (Bright Green) | #37 | **2** |
| `3023` | 1×2 薄板 | Plate 1 x 2 | 台積紅 (Bright Red) | #21 | **2** |
| `3028` | 6×12 基礎薄板 | Plate 6 x 12 | 曜石黑 (Black) | #26 | **2** |
| `3028` | 6×12 基礎薄板 | Plate 6 x 12 | 深藍灰 (Dark Bluish Gray) | #199 | **2** |
| `3031` | 4×4 薄板 | Plate 4 x 4 | 深藍灰 (Dark Bluish Gray) | #199 | **2** |
| `3032` | 4×6 薄板 | Plate 4 x 6 | 淺藍灰 (Light Bluish Gray) | #194 | **2** |
| `3035` | 4×8 薄板 | Plate 4 x 8 | 純白 (White) | #1 | **2** |
| `3062b` | 1×1 圓柱磚 | Brick, Round 1 x 1 | 淺藍灰 (Light Bluish Gray) | #194 | **2** |
| `3068b` | 2×2 平面光磚 | Tile 2 x 2 | 沙漠米 (Tan) | #5 | **2** |
| `3069b` | 1×2 光磚 | Tile 1 x 2 | 海軍深藍 (Dark Blue) | #140 | **2** |
| `3069bpr01` | 1×2 立面印刷磚 (tsmc 紅標) | Tile 1 x 2 SNOT (Printed TSMC) | 純白 (White) | #1 | **2** |
| `3623` | 1×3 薄板 | Plate 1 x 3 | 純白 (White) | #1 | **2** |
| `3795` | 2×6 薄板 | Plate 2 x 6 | 淺藍灰 (Light Bluish Gray) | #194 | **2** |
| `3795` | 2×6 薄板 | Plate 2 x 6 | 曜石黑 (Black) | #26 | **2** |
| `3795` | 2×6 薄板 | Plate 2 x 6 | 鮮綠 (Bright Green) | #37 | **2** |
| `4032` | 2×2 圓薄板 | Plate, Round 2 x 2 | 深藍灰 (Dark Bluish Gray) | #199 | **2** |
| `4032` | 2×2 圓薄板 | Plate, Round 2 x 2 | 金屬銀 (Flat Silver) | #315 | **2** |
| `4032` | 2×2 圓薄板 | Plate, Round 2 x 2 | 淺藍灰 (Light Bluish Gray) | #194 | **2** |
| `63864` | 1×3 光磚 | Tile 1 x 3 | 淺藍灰 (Light Bluish Gray) | #194 | **2** |
| `6636` | 1×6 長條光磚 | Tile 1 x 6 | 淺藍灰 (Light Bluish Gray) | #194 | **2** |
| `14769` | 2×2 圓形光磚 | Tile, Round 2 x 2 | 深藍灰 (Dark Bluish Gray) | #199 | **1** |
| `14769` | 2×2 圓形光磚 | Tile, Round 2 x 2 | 金屬銀 (Flat Silver) | #315 | **1** |
| `14769pr01` | 2×2 圓形立面印刷磚 (TSMC 徽) | Tile Round 2 x 2 SNOT (TSMC Emblem) | 純白 (White) | #1 | **1** |
| `14769pr01` | 2×2 圓形立面印刷磚 (TSMC 徽) | Tile Round 2 x 2 SNOT (TSMC Emblem) | 深藍灰 (Dark Bluish Gray) | #199 | **1** |
| `2431` | 1×4 光磚 | Tile 1 x 4 | 深藍灰 (Dark Bluish Gray) | #199 | **1** |
| `2431pr01` | 1×4 立面印刷磚 (張忠謀大樓) | Tile 1 x 4 SNOT (張忠謀大樓) | 深藍灰 (Dark Bluish Gray) | #199 | **1** |
| `26603` | 2×3 平面光磚 | Tile 2 x 3 | 深藍灰 (Dark Bluish Gray) | #199 | **1** |
| `3002` | 2×3 標準磚 | Brick 2 x 3 | 深藍灰 (Dark Bluish Gray) | #199 | **1** |
| `3002` | 2×3 標準磚 | Brick 2 x 3 | 純白 (White) | #1 | **1** |
| `3005` | 1×1 柱磚 | Brick 1 x 1 | 台積紅 (Bright Red) | #21 | **1** |
| `3020` | 2×4 薄板 | Plate 2 x 4 | 淺藍灰 (Light Bluish Gray) | #194 | **1** |
| `3020` | 2×4 薄板 | Plate 2 x 4 | 深藍灰 (Dark Bluish Gray) | #199 | **1** |
| `3021` | 2×3 薄板 | Plate 2 x 3 | 深松綠 (Dark Green) | #141 | **1** |
| `3021` | 2×3 薄板 | Plate 2 x 3 | 透亮水藍 (Trans-Light Blue) | #42 | **1** |
| `3023` | 1×2 薄板 | Plate 1 x 2 | 曜石黑 (Black) | #26 | **1** |
| `3023` | 1×2 薄板 | Plate 1 x 2 | 寶藍 (Bright Blue) | #23 | **1** |
| `3028` | 6×12 基礎薄板 | Plate 6 x 12 | 純白 (White) | #1 | **1** |
| `3031` | 4×4 薄板 | Plate 4 x 4 | 深棕 (Dark Brown) | #308 | **1** |
| `3031` | 4×4 薄板 | Plate 4 x 4 | 淺藍灰 (Light Bluish Gray) | #194 | **1** |
| `3032` | 4×6 薄板 | Plate 4 x 6 | 深松綠 (Dark Green) | #141 | **1** |
| `3032` | 4×6 薄板 | Plate 4 x 6 | 深藍灰 (Dark Bluish Gray) | #199 | **1** |
| `3036` | 6×8 薄板 | Plate 6 x 8 | 深藍灰 (Dark Bluish Gray) | #199 | **1** |
| `3039pr01` | 2×2 斜面印刷磚 (張忠謀大樓) | Slope 2 x 2 (張忠謀大樓 銘牌) | 淺藍灰 (Light Bluish Gray) | #194 | **1** |
| `3068b` | 2×2 平面光磚 | Tile 2 x 2 | 深藍灰 (Dark Bluish Gray) | #199 | **1** |
| `3068bpr01` | 2×2 立面印刷磚 (TSMC 晶圓標) | Tile 2 x 2 SNOT (TSMC Wafer Logo) | 純白 (White) | #1 | **1** |
| `3069bpr02` | 1×2 立面印刷磚 (Jasm 標誌) | Tile 1 x 2 SNOT (Printed JASM) | 純白 (White) | #1 | **1** |
| `3070b` | 1×1 單格光磚 | Tile 1 x 1 | 深藍灰 (Dark Bluish Gray) | #199 | **1** |
| `3070b` | 1×1 單格光磚 | Tile 1 x 1 | 透亮水藍 (Trans-Light Blue) | #42 | **1** |
| `3070b` | 1×1 單格光磚 | Tile 1 x 1 | 純白 (White) | #1 | **1** |
| `3460` | 1×8 細長薄板 | Plate 1 x 8 | 鮮綠 (Bright Green) | #37 | **1** |
| `3622` | 1×3 牆磚 | Brick 1 x 3 | 深藍灰 (Dark Bluish Gray) | #199 | **1** |
| `3622` | 1×3 牆磚 | Brick 1 x 3 | 透亮水藍 (Trans-Light Blue) | #42 | **1** |
| `3623` | 1×3 薄板 | Plate 1 x 3 | 淺藍灰 (Light Bluish Gray) | #194 | **1** |
| `3623` | 1×3 薄板 | Plate 1 x 3 | 台積紅 (Bright Red) | #21 | **1** |
| `3623` | 1×3 薄板 | Plate 1 x 3 | 深藍灰 (Dark Bluish Gray) | #199 | **1** |
| `3666` | 1×6 細長薄板 | Plate 1 x 6 | 淺藍灰 (Light Bluish Gray) | #194 | **1** |
| `3666` | 1×6 細長薄板 | Plate 1 x 6 | 深藍灰 (Dark Bluish Gray) | #199 | **1** |
| `3666` | 1×6 細長薄板 | Plate 1 x 6 | 鮮綠 (Bright Green) | #37 | **1** |
| `3795` | 2×6 薄板 | Plate 2 x 6 | 深棕 (Dark Brown) | #308 | **1** |
| `3941` | 2×2 圓塔磚 | Brick, Round 2 x 2 | 淺藍灰 (Light Bluish Gray) | #194 | **1** |
| `3941` | 2×2 圓塔磚 | Brick, Round 2 x 2 | 純白 (White) | #1 | **1** |
| `3960` | 4×4 圓弧穹頂蓋 | Dish 4 x 4 Inverted | 純白 (White) | #1 | **1** |
| `60474` | 4×4 大圓盤 | Plate, Round 4 x 4 | 深棕 (Dark Brown) | #308 | **1** |
| `60474` | 4×4 大圓盤 | Plate, Round 4 x 4 | 純白 (White) | #1 | **1** |
| `63864` | 1×3 光磚 | Tile 1 x 3 | 台積紅 (Bright Red) | #21 | **1** |
| `91405` | 16×16 基礎薄板 | Plate 16 x 16 | 深棕 (Dark Brown) | #308 | **1** |
