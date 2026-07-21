# 專案架構分析與 Linux 遠端部署規劃 (project-arc.md)

本文件針對此 Django Web 專案進行完整架構分析，並擬定將 Windows 環境腳本（`.bat`）轉換為 Linux Shell 腳本（`.sh`）之技術規範與部署建議。

---

## 1. 專案總覽 (Project Overview)

* **專案名稱**：DjangoBlog
* **核心框架**：Django 6.0 (Python Web 框架)
* **資料庫**：SQLite 3 (`db.sqlite3`)
* **前端與模板**：Django Templates (HTML5, CSS, Components)
* **語言與時區**：`zh-hant` (繁體中文) / `Asia/Taipei`

---

## 2. 檔案目錄結構分析 (Directory Structure)

專案根目錄包含 Django 專案核心、應用程式模組、前端模板以及自動化管理腳本：

```
.
├── DjangoBlog/              # Django 專案核心設定目錄
│   ├── __init__.py
│   ├── asgi.py              # ASGI 異步服務進入點
│   ├── settings.py          # 全域組態設定 (資料庫、語言、APP、模板路徑)
│   ├── urls.py              # 主路由表
│   └── wsgi.py              # WSGI 同步服務進入點 (遠端部署常用)
├── article/                 # 部落格文章模組 (Django App)
│   ├── __init__.py
│   ├── admin.py             # 後台管理介面註冊
│   ├── apps.py              # App 設定
│   ├── migrations/          # 資料庫遷移檔
│   ├── models.py            # 資料模型定義 (Post)
│   ├── tests.py             # 單元測試
│   └── views.py             # 視圖邏輯處理
├── templates/               # 前端 HTML 模板
│   ├── base.html            # 基礎版型
│   ├── index.html           # 首頁模板
│   ├── demo-index.html      # 示範/備用模板
│   └── components/          # 模組化組件模板
├── documents/               # 專案文檔目錄
│   ├── project-arc.md       # 本架構分析與 Linux 部署規劃文件
│   └── 002-bash-scripts.md  # Linux Shell 腳本轉換步驟實作計畫
├── manage.py                # Django 核心 CLI 管理腳本
├── requirement.txt          # Python 套件依賴清單 (包含 Django==6.0)
├── Readme.md                # 專案說明文件
├── build_venv.bat           # [Windows] 建立 Python 虛擬環境與安裝依賴腳本
├── config.bat               # [Windows] 專案環境變數與參數組態檔 (被其他 bat 引用)
├── download_db.bat          # [Windows] 自動下載預設 SQLite 資料庫腳本
└── setup_git.bat            # [Windows] 自動設定 Git 本地 User/Email 腳本 (Linux 端不需轉換)
```

---

## 3. 現有腳本分析與 Linux 轉譯規範 (Script Conversion Analysis)

目前專案使用 Windows Batch (`.bat`) 腳本進行環境建置與營運設定。部署至 Linux 時，僅需轉換生產營運必備之腳本：

### 3.1 `build_venv.bat` 轉為 `build_venv.sh`

* **原始功能**：
  1. 檢查系統是否已安裝 `python`。
  2. 建立 `.venv` 虛擬環境 (`python -m venv .venv`)。
  3. 升級 pip (`.venv\Scripts\python.exe -m pip install --upgrade pip`)。
  4. 讀取 `requirement.txt` 並安裝套件。
* **Linux 轉換要點**：
  * 使用 `#!/bin/bash` 宣告。
  * Python 指令在 Linux 通常為 `python3`（需確認系統安裝 `python3-venv`）。
  * 虛擬環境可執行檔路徑由 `.venv\Scripts\` 轉為 `.venv/bin/`（或使用 `source .venv/bin/activate`）。
  * 移除 `pause` 指令與 `%errorlevel%`，改用 `$?` 或 `set -e` 進行錯誤處理與中斷。

### 3.2 `config.bat` 轉為 `config.sh`

* **原始功能**：
  * 定義 `DOWNLOAD_URL`、`DB_PATH` 等全域參數，供 `download_db` 呼叫。
* **Linux 轉換要點**：
  * 使用 `export` 宣告環境變數（例如 `export DB_PATH="db.sqlite3"`）。
  * 在其他 `.sh` 腳本中透過 `source ./config.sh` 載入變數。

### 3.3 `download_db.bat` 轉為 `download_db.sh`

* **原始功能**：
  1. 載入 `config.bat`。
  2. 檢查 `curl.exe` 或回退至 PowerShell `Invoke-WebRequest` 下載 SQLite 資料庫。
  3. 驗證資料庫檔案下載結果。
* **Linux 轉換要點**：
  * 載入 `source ./config.sh`。
  * Linux 預設通常具備 `curl` 或 `wget`。可直接使用 `curl -L "${DOWNLOAD_URL}" -o "${DB_PATH}"`。
  * 移除 Windows 特有之 `powershell` 回退機制與 `%~dp0` 語法，改用 `$(dirname "$0")` 取得腳本目錄。

### 3.4 `setup_git.bat`（不需轉譯為 Linux 腳本）

* **不轉換原因**：
  * 遠端 Linux 主機僅作為專案部署與運行環境，不會在遠端進行 commit 與推送 (`git push`) 版本資訊至 GitHub，因此不需要在遠端建立 `setup_git.sh`。

---

## 4. 轉譯對照總表 (Quick Reference Matrix)

| 項目 | Windows (`.bat`) | Linux (`.sh`) |
| :--- | :--- | :--- |
| **Shebang 標頭** | 無 (使用 `@echo off`) | `#!/bin/bash` |
| **環境變數載入** | `call config.bat` | `source ./config.sh` |
| **變數設定/引用** | `set VAR=val` / `!VAR!` | `export VAR="val"` / `"$VAR"` |
| **Python 執行檔** | `.venv\Scripts\python.exe` | `.venv/bin/python` 或 `python3` |
| **暫停等待輸入** | `pause` | 移除或改用 `read -p "Press enter..."` |
| **路徑分隔符** | 反斜線 `\` | 正斜線 `/` |
| **執行權限** | 不需要特地設定 | 需要 `chmod +x *.sh` |
| **Git 設定腳本** | `setup_git.bat` | **不需轉換** |

---

## 5. Linux 遠端部署注意事項 (Linux Deployment Checklist)

1. **檔案權限**：Linux 上執行的 `.sh` 腳本必須賦予可執行權限：
   ```bash
   chmod +x build_venv.sh config.sh download_db.sh
   ```
2. **換行符號問題 (CRLF vs LF)**：在 Windows 建立的 `.sh` 檔案可能帶有 `\r\n` (CRLF)，傳至 Linux 前應確保儲存為 `LF` 格式，避免出現 `\r: command not found` 錯誤。
3. **生產環境安全與 WSGI 伺服器**：
   * 部署到 Linux 後，建議使用 WSGI 伺服器 (如 `gunicorn` 或 `uWSGI`) 搭配 Nginx 代理。
   * 將 [settings.py](file:///c:/Users/admin/Desktop/VS-Code/DjangoBlog/settings.py) 中的 `DEBUG = True` 在生產環境設為 `False`，並透過環境變數傳入 `SECRET_KEY`。
