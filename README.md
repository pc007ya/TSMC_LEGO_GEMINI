# TSMC × LEGO Architecture — 台積電全球廠區樂高 3D 互動組裝工坊

🌐 **線上 3D 互動體驗 (GitHub Pages)**：[https://pc007ya.github.io/TSMC_LEGO_GEMINI/](https://pc007ya.github.io/TSMC_LEGO_GEMINI/)

本專案依據台積電全球五大代表性廠區樂高建築參考圖，打造完整的 **Three.js 3D 互動樂高展示與組裝工坊**，包含真實樂高比例積木、頂部橫欄快速切換、典藏盒裝開箱、編號分包零件袋拆袋、官方風格組裝說明書與逐項核對的模型零件表。

## 🏛️ 收錄七款建築典藏盒組（共 21,974 個模型配置）

| 編號 | 盒組名稱 | 底座 (凸點) | 總零件數 | 料號 × 顏色列 | 步驟 / 貼紙 | 說明書 / BOM / LDraw |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **#21035** | 台積電南京廠 (`TSMC Nanjing Company Limited`) | **40 × 32** | **589** | 46 | 16 步 / 1 貼紙 | [MD](./docs/SET01_21035_NANJING_MANUAL.md) · [CSV](./docs/SET01_21035_NANJING_BOM.csv) · [LDR](./docs/SET01_21035_NANJING.ldr) |
| **#21036** | JASM 熊本一廠 (`TSMC JASM Kumamoto`) | **48 × 24** | **472** | 44 | 16 步 / 1 貼紙 | [MD](./docs/SET02_21036_JASM_MANUAL.md) · [CSV](./docs/SET02_21036_JASM_BOM.csv) · [LDR](./docs/SET02_21036_JASM.ldr) |
| **#21037** | 台積電亞利桑那州廠 (`TSMC Arizona Fab 21`) | **48 × 28** | **357** | 41 | 15 步 / 1 貼紙 | [MD](./docs/SET03_21037_ARIZONA_MANUAL.md) · [CSV](./docs/SET03_21037_ARIZONA_BOM.csv) · [LDR](./docs/SET03_21037_ARIZONA.ldr) |
| **#21038** | 台積總部及晶圓十二A廠・張忠謀大樓 (`TSMC HQ & Fab 12A`) | **32 × 32** | **865** | 95 | 24 步 / 4 貼紙 | [MD](./docs/SET04_21038_MORRIS_MANUAL.md) · [CSV](./docs/SET04_21038_MORRIS_BOM.csv) · [LDR](./docs/SET04_21038_MORRIS.ldr) |
| **#21039** | 台積電全球研發中心 (`Global R&D Center`) | **52 × 32** | **475** | 60 | 16 步 / 1 貼紙 | [MD](./docs/SET05_21039_RD_MANUAL.md) · [CSV](./docs/SET05_21039_RD_BOM.csv) · [LDR](./docs/SET05_21039_RD.ldr) |
| **#21040** | **臺中國家歌劇院 UCS 典藏版 (`National Taichung Theater`)** | **64 × 48** | **9,115** | 44 | 28 步 / 6 包 / 1 貼紙 | [MD](./docs/SET06_21040_TAICHUNG_OPERA_MANUAL.md) · [CSV](./docs/SET06_21040_TAICHUNG_OPERA_BOM.csv) · [LDR](./docs/SET06_21040_TAICHUNG_OPERA.ldr) |
| **#21041** | **臺中國際會展中心 1・2 期 UCS 典藏版 (`Taichung Expo Phases 1 & 2`)** | **80 × 44** | **10,101** | 79 | 25 步 / 6 包 / 1 貼紙 | [MD](./docs/SET07_21041_TAICHUNG_EXPO_MANUAL.md) · [CSV](./docs/SET07_21041_TAICHUNG_EXPO_BOM.csv) · [LDR](./docs/SET07_21041_TAICHUNG_EXPO.ldr) |

👉 [五廠區料號核對摘要](./docs/TSMC_LEGO_BOM_AUDIT.md) · [合併核對 CSV](./docs/TSMC_LEGO_BOM_AUDIT.csv) · [設計總覽](./docs/TSMC_LEGO_MASTER_DESIGN.md)

表內 21035–21039 是本專案代號，不是 LEGO 官方盒組編號。五份模型 CSV 保留原 8 欄與數量；舊欄位 `LEGO_Part_ID`、`Color_ID` 是專案保留值，可能不是可採購料號或有效 LDraw 色號。請另外查閱核對狀態與原廠 Element ID。自訂圖樣、未驗證配色、占位件與目前 LDraw 原色碼不能直接下單或當作實體組裝規格。

## ✨ 核心功能

- **頂部橫欄切換 5 款盒組**：流暢切換新竹總部、JASM 熊本、亞利桑那、張忠謀大樓與全球研發中心。
- **Three.js 3D 完整模型檢視**：支援 360° 自由旋轉、縮放、自動旋轉、**爆炸層次檢視**、以及參考原圖並排對照。
- **擬真開箱與分包組裝體驗**：
  1. **典藏盒裝開箱**：點擊「📦 開箱組裝」顯示樂高建築黑盒包裝，撕開封條打開盒蓋。
  2. **1～4 號透明零件袋**：依序點擊各包編號零件袋，撕開倒出至托盤。
  3. **樂高說明書步驟組裝**：藍框零件需求清單（含 SVG 積木圖示、模型料號、顏色與數量），點擊「🧱 放置積木」觸發 3D 積木降落卡合動畫與音效，亦支援自動組裝模式。
- **模型零件表與核對 CSV**：畫面支援按分包篩選；下載提供整組的核對 CSV。

## 🚀 本機執行

```bash
python3 -m http.server 8080
# 開啟 http://localhost:8080
```

