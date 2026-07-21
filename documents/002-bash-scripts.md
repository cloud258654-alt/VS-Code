# Linux Bash 腳本轉換實作計畫 (002-bash-scripts.md)

本文件詳細規劃將現有 Windows 批次檔 (`.bat`) 轉譯為 Linux 專用 Bash 腳本 (`.sh`) 的實作步驟與程式碼規範。

> **備註**：`setup_git.bat` **不需轉換** 為 `setup_git.sh`。由於遠端 Linux 部署環境僅作運行使用，不會在遠端進行 commit 與推送（push）版本資訊至 GitHub，因此無需於 Linux 端設定 Git 使用者資訊。

---

## 實作目標

建立以下 Linux Shell 腳本，實現跨平台部署自動化：
1. `config.sh`：環境變數與參數集中管理檔（主要儲存資料庫下載與儲存路徑）。
2. `build_venv.sh`：Python 虛擬環境建立與套件安裝腳本。
3. `download_db.sh`：自動從 Google Drive 下載 SQLite 資料庫腳本。

---

## 步驟一：建立集中組態檔 (`config.sh`)

### 說明
作為所有 `.sh` 腳本的共通組態，儲存資料庫下載網址與資料庫路徑。

### 步驟與規格
- 檔名：`config.sh`
- 內容規格：
  ```bash
  #!/bin/bash
  # 專案共通環境變數設定檔

  export DOWNLOAD_URL="https://drive.google.com/uc?export=download&id=YOUR_FILE_ID"
  export DB_PATH="db.sqlite3"
  ```

---

## 步驟二：建立虛擬環境建置腳本 (`build_venv.sh`)

### 說明
對應 [build_venv.bat](file:///c:/Users/admin/Desktop/VS-Code/build_venv.bat)，負責在 Linux 環境初始化 `.venv` 並安裝依賴套件。

### 步驟與規格
- 檔名：`build_venv.sh`
- 轉譯要點：
  1. 加入 Shebang `#!/bin/bash` 與 `set -e`（遭遇錯誤立即停止）。
  2. 使用 `command -v python3` 檢查 Python 3。
  3. 檢查 `.venv` 目錄，若不存在則執行 `python3 -m venv .venv`。
  4. 使用 `.venv/bin/python -m pip install --upgrade pip` 升級 pip。
  5. 若 `requirement.txt` 存在，執行 `.venv/bin/python -m pip install -r requirement.txt`。

---

## 步驟三：建立資料庫下載腳本 (`download_db.sh`)

### 說明
對應 [download_db.bat](file:///c:/Users/admin/Desktop/VS-Code/download_db.bat)，自動讀取 `config.sh` 並下載 SQLite 資料庫。

### 步驟與規格
- 檔名：`download_db.sh`
- 轉譯要點：
  1. 動態取得腳本所在目錄：`SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"`。
  2. 載入 `config.sh`：`source "${SCRIPT_DIR}/config.sh"`。
  3. 檢查 `curl` 或 `wget` 工具。
  4. 執行 `curl -L "${DOWNLOAD_URL}" -o "${DB_PATH}"`。
  5. 檢查檔案是否成功下載且非空檔 (`[ -s "${DB_PATH}" ]`)。

---

## 步驟四：檔案權限與換行符號檢驗 (Permissions & LF Encoding)

### 步驟
1. 賦予 Linux 腳本執行權限：
   ```bash
   chmod +x config.sh build_venv.sh download_db.sh
   ```
2. 確保腳本編碼格式為 **LF**（UNIX 格式），避免 Windows 的 CRLF (`\r\n`) 導致 Linux 執行時回報 `\r: command not found`。

---

## 驗證計畫 (Verification Plan)

| 腳本 | 驗證方式 | 預期結果 |
| :--- | :--- | :--- |
| `config.sh` | 執行 `source ./config.sh && echo $DB_PATH` | 印出 `db.sqlite3` |
| `build_venv.sh` | 執行 `./build_venv.sh` | 建立 `.venv` 並完成 Django 6.0 套件安裝 |
| `download_db.sh` | 執行 `./download_db.sh` | 成功產出 `db.sqlite3` |
