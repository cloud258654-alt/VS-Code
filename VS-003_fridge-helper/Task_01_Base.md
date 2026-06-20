任務目標：建立專案的基礎目錄結構、PWA 基礎設定，以及核心資料模型與常數設定。

請在當前專案目錄下執行以下操作：
1. 建立基本檔案：
   - index.html (引入 Tailwind CSS，設定手機版 viewport)
   - styles.css (留空，待後續填入)
   - manifest.json (PWA 設定，名稱為「冰箱保衛戰」，獨立 Standalone 模式，提供基本 SVG 圖示)
   - sw.js (Service Worker 基礎結構，設定 const CACHE_NAME = "fridge-kawaii-v1")

2. 建立 js/ 目錄，並在裡面建立三個檔案：
   - constants.js：
     導出 `CATEGORY_DEFAULT_DAYS` 物件，包含：
     meat: 3, dairy: 7, vegetable: 5, fruit: 7, frozen: 30, pantry: 180。
   - model.js：
     引入 constants.js。導出一個工廠函數 `createFoodItem(name, category, location, quantity)`。
     功能：自動使用 crypto.randomUUID() 或 Date.now().toString(36) 生成唯一 ID，並自動將 addedDate 設為今天（格式：YYYY-MM-DD）。依據類別自動計算出 expireDate，物件結構需嚴格符合：
     { id, name, category, addedDate, expireDate, quantity, location, finished: false }
   - storage.js：
     封裝 LocalStorage 讀寫，導出三個函數：
     - getFoods(): 回傳儲存的陣列，若無則回傳空陣列。
     - saveFoods(foods): 寫入 LocalStorage。
     - addFood(food): 將新食材 push 進陣列並儲存。
     - finishFood(id): 根據 UUID 將該食材的 finished 屬性改為 true 並儲存。

完成後請回報已建立的檔案與代碼結構。