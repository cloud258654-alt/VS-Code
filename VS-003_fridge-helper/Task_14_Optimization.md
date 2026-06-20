任務目標：修復高優先級 Bug 與補強中低優先級功能完善度，確保專案達到可正式部署水準。

---

## 🔴 Phase 1：高優先（影響功能正確性）

### 1. 舊資料相容性 Migration
- **檔案**：`js/storage.js`
- **問題**：舊版 LocalStorage 無 `unitType` / `originalQuantity` 欄位，首次渲染顯示 `undefined / undefined`
- **修改**：`getFoods()` 讀出後遍歷陣列，補上預設值：
  ```js
  foods.forEach(function (f) {
    if (!f.unitType) f.unitType = "x";
    if (f.originalQuantity === undefined) f.originalQuantity = f.quantity || 1;
  });
  ```
- **驗證**：清除所有 LocalStorage，手動插入一筆缺少兩欄位的舊資料 → 重新整理 → 卡片應正常顯示

### 2. Canvas 捲動座標偏移修正
- **檔案**：`js/canvas-ui.js` → `onClick`
- **問題**：座標計算使用 `window.scrollY` 與 `rect.top` 重複偏移，手動計算多餘導致點擊位置不準
- **修改**：簡化為 `x = e.clientX - rect.left; y = e.clientY - rect.top;`（移除 window.scrollY 加減）
- **驗證**：加入 8 筆食材使頁面可捲動 → 捲到底部後點擊「吃 1 個」→ 按鈕回應正確

### 3. Retina Resize 後 ctx.setTransform 遺漏
- **檔案**：`js/canvas-ui.js` → `resize` 與 `render`
- **問題**：`computeLayout` 中重新設定 canvas.height 後呼叫 `ctx.setTransform` 會覆蓋 resize 時的正確縮放
- **修改**：將 `computeLayout` 內的 `ctx.setTransform` 獨立成 `resetTransform()` 並確保只設定一次
- **驗證**：在 2x Retina 螢幕上縮放瀏覽器視窗 → Canvas 內容不模糊

### 4. 模組載入順序 Guard
- **檔案**：`js/history.js`、`js/metric.js`、`js/notifier.js`
- **問題**：`getFoods()` / `calculateRemainingDays()` 等函數依賴 `<script>` 順序，無執行期防禦
- **修改**：在頂部加入型別檢查：
  ```js
  if (typeof getFoods !== "function") { console.warn("storage not loaded"); }
  ```
- **驗證**：故意調整 script 順序 → Console 出現明確警告而非 TypeError

---

## 🟠 Phase 2：中優先（UX / 完備性）

### 5. Canvas 空狀態引導畫面
- **檔案**：`js/canvas-ui.js` → `draw`
- **修改**：當 `foods.length === 0` 時，在 Canvas 中央繪製插圖與引導文字「空空如也～ 點 ＋ 開始吧」
- **視覺**：極淡灰色圖示 + 粗體引導句，符合 Apple Empty State 設計慣例

### 6. 表單即時驗證
- **檔案**：`index.html` + `js/main.js`
- **修改**：
  - 名稱 input 加入 `minlength="1"` + 紅色底線即時提示
  - 數量 input 不可為 0，即時顯示「請輸入有效數量」
  - 送出前 `checkValidity()` 攔截 + shake 動畫

### 7. 卡片長按編輯選單
- **檔案**：`js/canvas-ui.js`
- **修改**：加入 `touchstart` / `mousedown` 長按偵測（600ms），彈出精簡操作選單：編輯名稱 / 刪除食材
- **驗證**：長按卡片 → 出現圓角選單，點擊外部關閉

### 8. 已完食批次清理
- **檔案**：`js/canvas-ui.js` + `js/storage.js`
- **修改**：
  - 已完食區右上角加入「全部清除」按鈕
  - `clearAllCompleted()` 刪除所有 finished=true 的食材
  - 加入確認對話框防止誤觸

### 9. 到期日手動覆蓋保護
- **檔案**：`js/main.js` → `initModal`
- **問題**：使用者手動選了到期日後，若切換類別會被 `updateExpireDate()` 覆蓋
- **修改**：加入 `expireDateManuallySet` 旗標；僅在 `!manuallySet` 時連動；日期 input 的 change 事件設為 true

### 10. 搜尋與篩選
- **檔案**：`js/canvas-ui.js`
- **修改**：Canvas 頂部加入搜尋列（input），輸入文字即時過濾卡片；支援名稱、類別模糊比對
- **驗證**：輸入「奶」→ 僅顯示含「奶」的卡片，其餘淡出

---

## 🟢 Phase 3：低優先（打磨 / 未來擴充）

### 11. Dark Mode 深色模式
- **檔案**：`styles.css` + `js/canvas-ui.js`
- **修改**：`prefers-color-scheme: dark` 媒體查詢；CanvasUI.COLORS 依 `matchMedia` 切換兩組色票
- **驗證**：系統切換深色模式 → 全介面自動轉換

### 12. 音效回饋
- **檔案**：`assets/sounds/` + `js/animation.js`
- **修改**：使用 Web Audio API 播放輕柔提示音（消耗：水滴、完食：風鈴）
- **驗證**：iOS/Android 靜音開關不影響、音量適中

### 13. 主畫面 Widget
- **檔案**：`manifest.json` + 獨立 widget 頁面
- **修改**：iOS 用 `apple-touch-icon` + Web Clip；Android 用 WebAPK 捷徑
- **驗證**：加入主畫面後的 icon 顯示今日快過期數量 badge

### 14. 多語系 i18n
- **檔案**：`js/i18n.js`（新建）
- **修改**：抽離所有 UI 字串至 `{ zh: {...}, en: {...}, ja: {...} }`，依 `navigator.language` 自動切換
- **驗證**：瀏覽器語言設為 English → 全部 UI 文字變為英文

### 15. 自動化單元測試
- **檔案**：`tests/`（新建）
- **修改**：至少覆蓋 `engine.js`（calculateRemainingDays）、`storage.js`（consumeFood 各分支）、`state.js`
- **工具**：可直接用 Node.js assert 或引入 Vitest

### 16. GitHub Pages 部署
- **檔案**：`.github/workflows/deploy.yml`（新建）
- **修改**：GitHub Actions → 自動 deploy 至 `gh-pages` 分支
- **驗證**：Push → `https://cloud258654-alt.github.io/VS-Code/VS-003_fridge-helper/` 可直接存取

---

## 執行順序建議

```
Phase 1 (本次修復)  →  1, 2, 3, 4  同步修復
Phase 2 (下次迭代)  →  5, 6, 9, 10  優先於 7, 8
Phase 3 (未來規劃)  →  15 → 16 → 11 → 14 → 12 → 13
```
