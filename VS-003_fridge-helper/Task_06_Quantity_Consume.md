任務目標：重構食物消耗邏輯。當食材數量大於 1 時，點擊「吃完了」只會扣除 1 個數量並觸發原地 Q 彈動效；只有當數量歸零時，才將狀態改為已完食並移至已完食區。

請修改現有的模組檔案，執行以下重構步驟：

1. 修改 `js/storage.js`：
   - 將原本的 `finishFood(id)` 函數重構並改名為 `consumeFood(id)`。
   - `consumeFood(id)` 內部邏輯：
     1. 撈出目前的食材陣列。
     2. 根據傳入的 UUID (id) 找到對應的食材物件。
     3. 將該食材的 `quantity` (數量) 減 1。
     4. 進行判定：如果減完後 `quantity <= 0`，則將 `finished` 屬性設為 `true`，並將 `quantity` 強制歸零；如果 `quantity > 0`，則保持 `finished = false`。
     5. 將更新後的陣列寫回 LocalStorage。

2. 修改 `js/ui.js`：
   - 在卡片渲染邏輯中，將原本綁定在「吃完了」按鈕上的 `storage.finishFood` 改為調用新版的 `storage.consumeFood`。
   - 優化點擊後的視覺判定：
     - 如果扣除後的數量依然 **> 0**：立刻觸發 `animation.js` 的粉紅愛心特效（heartParticles），同時將卡片上的數量文字即時更新（例如 x5 變成 x4），並讓該卡片就地執行一次果凍抖動動效（playJellyAnimation），**卡片不消失**。
     - 如果扣除後的數量 **等於 0**：觸發愛心特效後，延遲 500 毫秒讓卡片淡出，並將該食材移入底部的「✔ 已完食」區塊。

3. 修改 `js/main.js`：
   - 確保同步將調用舊函數的地方，改為新版的 `storage.consumeFood(id)`。

請確保重構後的程式碼命名嚴謹、排版整齊，不破壞原有的 Hello Kitty 可愛視覺風。