# AI ESG Copilot Platform 第四輪優化項目

本文件記錄第四輪參考國外同類型產品、網站與 App 後，新增到靜態 MVP 的產品化體驗。此輪重點是讓平台更像可導入、可展示、可協作、可商業化的 SaaS 產品。

## 本次已完成

| # | 優化項目 | 對應畫面 | 已加入內容 |
|---|---|---|---|
| 1 | 首次導入精靈 Onboarding Wizard | Onboarding | 新增公司資料、產業與產品、資料來源、框架、供應商範圍 5 步導入流程。 |
| 2 | 角色化首頁 | Role Home | 新增主管、ESG 專員、廠務、採購 4 種角色與各自重點 KPI。 |
| 3 | 資料匯入 Wizard | Connectors | 新增選來源、上傳檔案、欄位對應、錯誤驗證、完成匯入流程。 |
| 4 | 通知中心 Notification Center | Notifications | 新增供應商逾期、係數過期、碳排超標、佐證缺漏、報告完成通知。 |
| 5 | 行動版現場填報 App 體驗 | Mobile Field | 新增設備讀數、照片佐證、改善措施確認的手機式任務卡。 |
| 6 | 整合市場 / Connector Hub | Connectors | 新增 ERP、MES、EMS、Power BI、Excel、Utility Bills、LINE、Email 連接器。 |
| 7 | AI 可信度面板 | Notifications | 新增回答信心、引用來源、缺漏資料、建議下一步。 |
| 8 | 報告輸出中心 | Export Center | 新增 PDF、Word、Excel、Power BI、XBRL、Board Deck 輸出格式。 |
| 9 | 網站式產品導覽 / Demo Mode | Export Center | 新增 Dashboard、Scenario、Supplier Portal、Disclosure、Value 導覽步驟。 |
| 10 | 安全、權限、稽核設定頁 | Admin | 新增使用者角色、簽核流程、資料留存、稽核紀錄設定。 |
| 11 | 學習中心 / Regulation Academy | Academy | 新增 ISO14064、CBAM、CSRD、SBTi、GHG Protocol、Scope 3 學習卡。 |
| 12 | ROI / 商業價值頁 | Value | 新增節省報告工時、避免碳費、節能節費、供應商回覆率。 |

## 新增介面

- Onboarding
- Role Home
- Connectors
- Notifications
- Mobile Field
- Export Center
- Admin
- Academy
- Value

以上介面皆延續中英切換架構。

## 後續建議

1. 將 Onboarding Wizard 改成真正可保存設定的流程。
2. 將 Connector Hub 接上 API 設定、憑證狀態與同步排程。
3. 將 Notification Center 改為全站右上角通知抽屜。
4. 將 Mobile Field 做成獨立手機版路由或 PWA。
5. 將 Export Center 接上實際 PDF / Word / Excel / XBRL 產生器。
6. 將 Admin 接上使用者、角色、簽核與 audit log 權限模型。
7. 將 Academy 接上短文、測驗與內部訓練紀錄。
8. 將 Value Dashboard 接上實際節省成本、風險降低與導入 ROI。

## 驗收重點

- 新使用者能從 Onboarding 理解導入步驟。
- 不同角色能看到不同的管理重點。
- 使用者能看懂資料如何匯入、驗證與連接。
- 使用者能看到任務與通知的優先順序。
- 現場人員能用 Mobile Field 理解填報流程。
- 管理者能從 Value Dashboard 看出商業價值。
