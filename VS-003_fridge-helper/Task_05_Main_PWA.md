任務目標：完成最後的事件綁定、激活 Service Worker 離線快取，並啟動本地伺服器進行最終驗證。

請執行以下操作：
1. 編寫 js/`main.js`（總指揮官）：
   - 引入 `storage.js`、`engine.js`、`ui.js`。
   - 監聽 `DOMContentLoaded` 事件，從 storage 撈出資料並執行首次 `renderApp`。
   - 綁定新增食物表單的 submit 事件：攔截表單、呼叫 `model.js` 建立資料、呼叫 `storage.js` 存入、最後重新渲染並關閉彈窗。
   - 綁定「吃完了」按鈕的點擊事件，串接動畫與 `storage.finishFood(id)`。
   - 註冊 `sw.js`。

2. 完善 `sw.js`：
   - 實作基礎的靜態資源快取（index.html, styles.css, js/ 內的所有檔案）。
   - 加入 `activate` 事件監聽，當 CACHE_NAME 版本改變時，自動刪除舊快取。

3. 啟動測試：
   - 檢查當前專案下所有檔案是否齊全且無語法錯誤。
   - 使用 Python http.server 或輕量伺服器工具，在 Port 3000 啟動本地伺服器，並輸出供手機連線的區域網路 IP 網址。

完成後請回報本地伺服器啟動狀態。