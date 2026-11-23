# TSMC × LEGO Architecture — 台積電全球廠區樂高 3D 互動組裝工坊

🌐 **線上 3D 互動體驗 (GitHub Pages)**：[https://pc007ya.github.io/TSMC_LEGO_GEMINI/](https://pc007ya.github.io/TSMC_LEGO_GEMINI/)

本專案依據台積電全球五大代表性廠區樂高建築參考圖，打造完整的 **Three.js 3D 互動樂高展示與組裝工坊**，包含真實樂高比例積木、頂部橫欄快速切換、典藏盒裝開箱、編號分包零件袋拆袋、官方風格組裝說明書與 100% 精準零件 BOM 表。

## 🏛️ 收錄五款 TSMC 樂高建築盒組（共 2,770 塊零重疊積木）

| 編號 | 盒組名稱 | 底座 (凸點) | 總零件數 | 獨立料號 | 步驟 / 貼紙 | 說明書 / BOM / LDraw |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **#21035** | 台積電南京廠 (`TSMC Nanjing Company Limited`) | **40 × 32** | **589** | 34 | 16 步 / 1 貼紙 | [MD](./docs/SET01_21035_NANJING_MANUAL.md) · [CSV](./docs/SET01_21035_NANJING_BOM.csv) · [LDR](./docs/SET01_21035_NANJING.ldr) |
| **#21036** | JASM 熊本一廠 (`TSMC JASM Kumamoto`) | **48 × 24** | **472** | 39 | 16 步 / 1 貼紙 | [MD](./docs/SET02_21036_JASM_MANUAL.md) · [CSV](./docs/SET02_21036_JASM_BOM.csv) · [LDR](./docs/SET02_21036_JASM.ldr) |
| **#21037** | 台積電亞利桑那州廠 (`TSMC Arizona Fab 21`) | **48 × 28** | **357** | 29 | 15 步 / 1 貼紙 | [MD](./docs/SET03_21037_ARIZONA_MANUAL.md) · [CSV](./docs/SET03_21037_ARIZONA_BOM.csv) · [LDR](./docs/SET03_21037_ARIZONA.ldr) |
| **#21038** | 台積總部及晶圓十二A廠・張忠謀大樓 (`TSMC HQ & Fab 12A`) | **32 × 32** | **877** | 47 | 24 步 / 4 貼紙 | [MD](./docs/SET04_21038_MORRIS_MANUAL.md) · [CSV](./docs/SET04_21038_MORRIS_BOM.csv) · [LDR](./docs/SET04_21038_MORRIS.ldr) |
| **#21039** | 台積電全球研發中心 (`Global R&D Center`) | **52 × 32** | **475** | 40 | 16 步 / 1 貼紙 | [MD](./docs/SET05_21039_RD_MANUAL.md) · [CSV](./docs/SET05_21039_RD_BOM.csv) · [LDR](./docs/SET05_21039_RD.ldr) |

👉 完整全系列設計規格與 5 組總合併 BOM 請見：[docs/TSMC_LEGO_MASTER_DESIGN.md](./docs/TSMC_LEGO_MASTER_DESIGN.md)

## ✨ 核心功能

- **頂部橫欄切換 5 款盒組**：流暢切換新竹總部、JASM 熊本、亞利桑那、張忠謀大樓與全球研發中心。
- **Three.js 3D 完整模型檢視**：支援 360° 自由旋轉、縮放、自動旋轉、**爆炸層次檢視**、以及參考原圖並排對照。
- **擬真開箱與分包組裝體驗**：
  1. **典藏盒裝開箱**：點擊「📦 開箱組裝」顯示樂高建築黑盒包裝，撕開封條打開盒蓋。
  2. **1～4 號透明零件袋**：依序點擊各包編號零件袋，撕開倒出至托盤。
  3. **樂高說明書步驟組裝**：藍框零件需求清單（含 SVG 積木圖示、官方料號、顏色與數量），點擊「🧱 放置積木」觸發 3D 積木降落卡合動畫與音效，亦支援自動組裝模式。
- **完整零件 BOM 與 CSV 匯出**：支援按分包篩選並一鍵匯出 CSV。

## 🚀 本機執行

```bash
python3 -m http.server 8080
# 開啟 http://localhost:8080
```
