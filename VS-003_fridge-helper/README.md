# 🍏 冰箱保衛戰 — Fridge-Guard Kawaii Pro

Apple Canvas Edition · PWA 智慧冰箱管理系統

---

## 設計理念

```
買進 → 提醒 → 消耗 → 完食 → 成就感 → 減少浪費
```

目標：零食物浪費、極簡操作、Apple 等級流暢動畫。

---

## 功能特色

- **Canvas 渲染引擎** — Retina 2x 高解析度繪製，彈簧物理動畫
- **多單位系統** — 支援 個數(x) / 毫升(ml) / 公克(g) / 百分比(%)
- **雙按鈕消耗** — 逐次扣除 + 一鍵完食，自訂 ml/g 扣除量
- **自訂存放位置** — 動態增刪，預設冷藏/冷凍庫/常溫/乾糧櫃/調味架
- **狀態機分類** — SAFE → WARNING → URGENT → EXPIRED → COMPLETED
- **歷史時間軸** — 每次增減記錄，Git-commit 風格
- **5 秒復原** — 誤點全吃完可即時復原
- **到期推播** — 過期/快過期瀏覽器通知
- **粒子特效** — ❤️✨💠 愛心 + 星芒 + 晶瑩氣泡
- **PWA 離線** — Service Worker 快取，可安裝到手機主畫面

---

## Live Demo

### 本機啟動

```bash
cd fridge-helper
python -m http.server 3000
```

開啟瀏覽器：

```
http://localhost:3000          # 本機
http://192.168.x.x:3000        # 手機（同區網）
```

### PWA 安裝

1. 用手機瀏覽器開啟 `http://<你的IP>:3000`
2. iOS Safari → 分享 → 加入主畫面
3. Android Chrome → 選單 → 安裝應用程式

---

## 架構

```
js/
├── constants.js      # 類別預設天數 (meat:3, dairy:7...)
├── model.js          # createFoodItem 工廠函數
├── storage.js        # LocalStorage CRUD + 位置管理
├── engine.js         # 剩餘天數計算 + 分類
├── state.js          # 狀態機 (SAFE→WARNING→URGENT→EXPIRED→COMPLETED)
├── history.js        # 時間軸記錄引擎
├── metric.js         # 分析儀表板
├── animation.js      # 粒子特效 (❤️✨💠)
├── ui.js             # 輔助渲染函數
├── canvas-ui.js      # Canvas 渲染引擎 + 彈簧物理
├── undo.js           # 5 秒復原系統
├── notifier.js       # 到期推播
├── main.js           # 總指揮官
sw.js                 # Service Worker
```

---

## 資料模型

```js
{
  id: "uuid",
  name: "高鮮鮮奶",
  category: "dairy",
  addedDate: "2026-06-20",
  expireDate: "2026-06-27",
  quantity: 750,
  originalQuantity: 1000,
  unitType: "ml",
  location: "🥛 冷藏",
  finished: false
}
```

---

## 快速使用

1. 點右下角 **＋** 新增食材
2. 選擇類別、單位、存放位置
3. Canvas 卡片自動分類為：
   - 🚨 救命呀（已過期/快過期）
   - 🐱 快吃我（3-5 天）
   - 🎀 安全唷（>5 天）
   - ✔ 已完食
4. 點 **吃 1 個 / 用一點 / 用 10%** 逐次消耗
5. 點 **全吃完** 直接歸零（5 秒內可復原）
