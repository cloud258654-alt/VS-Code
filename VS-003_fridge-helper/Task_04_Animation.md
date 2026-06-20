任務目標：將視覺動畫從 UI 邏輯中解耦，獨立成動畫模組，實作點擊時的 Q 彈果凍動效與完食時的粉紅愛心噴發粒子特效。

請執行以下操作：
1. 在 js/ 目錄下建立 `animation.js`：
   - 實作 `playJellyAnimation(element)`：給指定的 HTML 元素加上 Q 彈的縮放動效。
   - 實作 `triggerHeartParticles(element)`：在被點擊的卡片位置，動態產生 5~8 個由 HTML/CSS 組成的粉紅愛心 (❤️) 或星星粒子，使其向上飄散、旋轉並淡出消失。

2. 編輯 `styles.css`：
   - 寫入 `@keyframes jelly` 動畫（0% 100%, 30% 125%, 50% 75%, 70% 115% 等縮放比例）。
   - 寫入愛心粒子飄散的 CSS 動畫樣式。

3. 修改 `js/ui.js`：
   - 引入 `animation.js`。
   - 當使用者點擊「吃完了」按鈕時，先觸發 `triggerHeartParticles` 特效，並延遲 500 毫秒（等動畫播完）才執行資料更新與 `renderApp` 重新渲染。

完成後請儲存並回報。