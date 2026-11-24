# TSMC 五廠區零件核對（不是採購單）

核對來源只限 [TSMC_LEGO_GEMINI 主分支 fbdb6c9](https://github.com/pc007ya/TSMC_LEGO_GEMINI/tree/fbdb6c968fab818abe21b85576631152a625ff91)，不包含另一個 TSMC_LEGO 專案或巨大中科總部 6,000 件。這是原專案模型零件的「料號×顏色」核對與缺口表，並非完成改模、可整批下單的 BOM。未改模型、未下單、未確認台灣庫存。

## 版本、數量與差異

| 專案代號 | 廠區 | 零件數量 | 料號 × 顏色列數 | 原始不同料號 |
| --- | --- | ---: | ---: | ---: |
| 21035 | 南京 | 589 | 46 | 33 |
| 21036 | JASM 熊本 | 472 | 44 | 26 |
| 21037 | 亞利桑那 | 357 | 41 | 24 |
| 21038 | 張忠謀大樓 | 865 | 95 | 36 |
| 21039 | 全球研發中心 | 475 | 60 | 33 |
| 合計 | 5 廠 | 2,758 | 286（合併後 186） | 合併後 57 |

五份 CSV、五份 LDraw 的 type-1 配置，以及網站 `data/models.json` × `js/legoCatalog.js` 的原始料號與顏色欄逐筆計數相符。README 早期曾寫張忠謀大樓 877／全系列 2,770，已修正；目前三份資料一致為 865／2,758。原始 LDraw 顏色代碼不正確，故計數相符不代表 CAD 可正確繪圖或可以實體組裝。

網站的 21035–21039 是**本專案代號**，不能當 LEGO 官網套組編號查採購。官方至少已核實 [21035 古根漢美術館](https://www.lego.com/cdn/product-assets/product.bi.core.pdf/6532390.pdf)、[21036 凱旋門](https://www.lego.com/en-us/product/arc-de-triomphe-21036)、[21037 LEGO House](https://www.lego.com/cdn/product-assets/product.bi.additional.info.pdf/21037_EN_BI_Info_Booklet.pdf) 和本專案所指廠區不同。

## 可查與不能買的欄位

| 核對層級 | 合併列數 | 對應模型件數 |
| --- | ---: | ---: |
| Rebrickable 對照與 LEGO 官方 Pick a Brick 或原廠組裝說明書：設計、色號及 Element ID 交叉核對（非庫存承諾） | 129 | 2,196 |
| Rebrickable 歷史資料有對照，但未逐項核對官方 | 24 | 131 |
| 沒有充分核實同造型同色 Element ID；不能當作已確定可買 | 21 | 327 |
| 原碼形狀錯誤、專案自繪或自訂圖樣 | 12 | 104 |
| 合計 | 186 | 2,758 |

- **2454：54 個。** 專案畫的是 1×1×2 高柱；LDraw 2454 是 1×2×5 且為舊件。不能同號換貨。若採用兩顆 3005 疊高，須先改 CAD、驗證尺寸和疊法，重算件數，並核實各色。
- **3004v：8 個。** V 型斜撐是程式自繪，不等於 3004。需另設計可實際組合的結構。
- **98138f：34 個。** 為程序化風扇。98138 裸圓磚只是重作貼花時的參考，不代表有原款金屬銀風扇成品。
- **六個專案印刷碼共 8 個。** 14769pr01、2431pr01、3039pr01、3068bpr01、3069bpr01、3069bpr02 是本專案圖樣。需另製貼花／印刷；直貼立面還要驗證固定結構。核對表表明可能使用的素面造型，但沒有把它當成等同原件。
- **4589b 不是假料號。** 是 [BrickLink 的頂槽 1×1 錐](https://www.bricklink.com/v2/catalog/catalogitem.page?P=4589b)；LDraw 官方庫文件用 59900。另有 3023→3023b、4032→4032a、4073→6141 的 LDraw 遷移別名。3741 是舊件，歷史對照不代表現售。
- **顏色規則不同。** 19 種配色分別核對 LEGO、LDraw、Rebrickable；目前 LDraw 2,611 個配置的代碼跟正確 LDraw 顏色不同。例如白色 1→15、黑色 26→0、淺灰 194→71、深灰 199→72、透淺藍 42→43、名稱為 Trans-Medium Blue 的原欄 43→LDraw 41、LEGO 143。目前沒有重輸出幾何或替自訂零件補料。

11 組新增核對來自 [另一專案既有的原廠證據紀錄](https://github.com/pc007ya/TSMC_LEGO/blob/76b6054e185d00ea4a5cd60d8ee59c925cf12b16/data/lego-part-verification.json)，只沿用相同零件、色號及既有候選的造型／色件證據，未合併其他專案數量。透明淺藍 3070b 素面 1×1 光磚採用可在原廠 Pick a Brick 查到的 35403／6514261；同色另一歷史編號 6254256 保留備選，不重複採購。

核對來源：[LEGO 原廠：Design／Element 的差異](https://www.lego.com/en-gb/service/help-topics/article/identifying-lego-set-and-piece-numbers) · [LDraw 官方色碼](https://library.ldraw.org/library/official/LDConfig.ldr) · [LDraw 官方件庫鏡像快照 c70360d](https://github.com/kulits/ldraw-parts/tree/c70360d1c588be894997b2168c61909bc8058c4d/ldraw/parts) · [Rebrickable 歷史資料](https://rebrickable.com/downloads/)。CSV 列出每列對應的來源，已證實的原廠 Element ID 欄與歷史備選欄分開。歷史備選同一列只選一個，不是每個備選都要買。
