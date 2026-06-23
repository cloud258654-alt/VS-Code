const products = [
  { name: "PCB", carbon: 1.2, target: 1.0 },
  { name: "Notebook", carbon: 1.45, target: 1.1 },
  { name: "Server", carbon: 0.8, target: 1.0 }
];

const energy = [
  { name: "Electricity", value: 250000, unit: "kWh", change: 18 },
  { name: "Natural Gas", value: 5000, unit: "m3", change: 12 },
  { name: "Steam", value: 820, unit: "ton", change: 4 },
  { name: "Renewable Energy", value: 20, unit: "%", change: -12 }
];

const knowledge = [
  { type: "International Standard", title: "ISO14064-1", text: "組織層級溫室氣體盤查與報告要求。" },
  { type: "International Standard", title: "ISO14067", text: "產品碳足跡量化與揭露原則。" },
  { type: "International Standard", title: "ISO50001", text: "能源管理系統與持續改善。" },
  { type: "International Standard", title: "GHG Protocol", text: "Scope 1、Scope 2、Scope 3 盤查框架。" },
  { type: "Internal Document", title: "減碳SOP", text: "設備節能、綠電導入、空壓系統優化程序。" },
  { type: "Internal Document", title: "稽核程序", text: "異常說明、原因、改善措施與責任部門確認。" },
  { type: "Industry Template", title: "電子業", text: "SMT、空壓機、烤箱與產線待機能源最佳實務。" },
  { type: "Industry Template", title: "金屬加工", text: "尖峰用電、設備工時與熱處理能耗模板。" },
  { type: "Industry Template", title: "食品業", text: "冷鏈、蒸氣、包裝與廢棄物排放模板。" }
];

const recommendations = [
  { title: "SMT 待機節能", impact: "減少 5%", detail: "排程閒置超過 15 分鐘自動降載。" },
  { title: "更換空壓機", impact: "減少 8%", detail: "優先處理高耗能且低效率設備。" },
  { title: "提高綠電比例", impact: "減少 12%", detail: "將綠電比例由 20% 拉回目標水準。" },
  { title: "夜間關閉烤箱", impact: "減少 3%", detail: "依 MES 工單自動產生關機時段。" }
];

const reportText = `ESG Audit Report

日期：2026/06/23
產品：Notebook
異常：碳排超標 31%
依據：ISO14064、ISO14067、減碳SOP

原因：
1. SMT 耗電增加 18%
2. 天然氣增加 12%
3. 綠電比例下降至 20%

改善：
1. 設備節能
2. 空壓系統優化
3. 綠電導入
4. 夜間關閉烤箱

預估：減少 22%
完成期限：2026Q4
責任部門：製造部、廠務部、ESG 辦公室`;

function formatNumber(value) {
  return new Intl.NumberFormat("zh-TW").format(value);
}

function renderProducts() {
  const table = document.querySelector("#productTable");
  table.innerHTML = products.map((product) => {
    const over = product.carbon > product.target;
    const percent = Math.min((product.carbon / product.target) * 72, 100);
    return `<div class="product-row">
      <div>
        <strong>${product.name}</strong>
        <div class="bar"><span style="width:${percent}%"></span></div>
      </div>
      <span>${product.carbon}</span>
      <span>${product.target}</span>
      <span class="status ${over ? "critical" : "normal"}">${over ? "超標" : "正常"}</span>
    </div>`;
  }).join("");
}

function renderEnergy() {
  const list = document.querySelector("#energyList");
  list.innerHTML = energy.map((item) => {
    const risky = item.name !== "Renewable Energy" && item.change > 10;
    const renewableDrop = item.name === "Renewable Energy" && item.change < 0;
    return `<div class="energy-row">
      <strong>${item.name}</strong>
      <span>${formatNumber(item.value)}</span>
      <span>${item.unit}</span>
      <span class="status ${risky || renewableDrop ? "warning" : "normal"}">${item.change > 0 ? "+" : ""}${item.change}%</span>
    </div>`;
  }).join("");
}

function buildAlerts() {
  const alerts = [];
  products.forEach((product) => {
    if (product.carbon > product.target) {
      const over = Math.round(((product.carbon - product.target) / product.target) * 100);
      alerts.push({ level: "critical", title: `${product.name} 碳排超標`, text: `Carbon > Target，超標 ${over}%。` });
    }
  });

  const electricity = energy.find((item) => item.name === "Electricity");
  if (electricity.change > 10) {
    alerts.push({ level: "warning", title: "用電較去年同期增加", text: `Electricity 增加 ${electricity.change}%，觸發 Warning。` });
  }

  alerts.push({ level: "critical", title: "碳排趨勢連續三個月上升", text: "Carbon Trend 觸發 Critical。" });
  return alerts;
}

function renderAlerts() {
  const alerts = buildAlerts();
  document.querySelector("#alertCount").textContent = `${alerts.length} 則`;
  document.querySelector("#alertList").innerHTML = alerts.map((alert) => `<div class="alert-item ${alert.level}">
    <strong>${alert.title}</strong>
    <p class="muted">${alert.text}</p>
  </div>`).join("");
}

function renderTrendChart() {
  const canvas = document.querySelector("#trendChart");
  const context = canvas.getContext("2d");
  const values = [2820, 2910, 3040, 3250];
  const labels = ["3月", "4月", "5月", "6月"];
  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;
  const max = 3400;
  const min = 2600;

  context.clearRect(0, 0, width, height);
  context.strokeStyle = "#d9e1dc";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(padding, height - padding);
  context.lineTo(width - padding, height - padding);
  context.stroke();

  const points = values.map((value, index) => {
    const x = padding + (index * (width - padding * 2)) / (values.length - 1);
    const y = height - padding - ((value - min) / (max - min)) * (height - padding * 2);
    return { x, y, value, label: labels[index] };
  });

  context.strokeStyle = "#147a55";
  context.lineWidth = 4;
  context.beginPath();
  points.forEach((point, index) => {
    if (index === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  });
  context.stroke();

  points.forEach((point) => {
    context.fillStyle = "#ffffff";
    context.strokeStyle = "#bd342d";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(point.x, point.y, 7, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = "#66736c";
    context.font = "14px Segoe UI";
    context.fillText(point.label, point.x - 12, height - 12);
    context.fillText(point.value, point.x - 18, point.y - 14);
  });
}

function renderAgent() {
  const steps = [
    ["Step 1 讀取資料", "ERP / MES / EMS：Notebook、50,000 pcs、250,000 kWh、天然氣 5000 m3"],
    ["Step 2 計算碳排", "Carbon 1.45 kgCO2e，Target 1.1，Over 31%"],
    ["Step 3 Root Cause", "SMT 用電 +18%、天然氣 +12%、綠電比例下降至 20%"],
    ["Step 4 RAG Search", "查詢 ISO14064、ISO14067、SOP、稽核案例"],
    ["Step 5 產生建議", "彙整可執行改善措施與預估減碳效果"]
  ];

  document.querySelector("#agentFlow").innerHTML = steps.map(([title, text]) => `<div class="agent-step">
    <strong>${title}</strong>
    <span class="muted">${text}</span>
  </div>`).join("");

  document.querySelector("#recommendations").innerHTML = recommendations.map((item) => `<div class="recommendation">
    <strong>${item.title}</strong>
    <span class="status normal">${item.impact}</span>
    <p class="muted">${item.detail}</p>
  </div>`).join("");
}

function renderKnowledge(filter = "") {
  const keyword = filter.trim().toLowerCase();
  const filtered = knowledge.filter((item) => {
    return `${item.type} ${item.title} ${item.text}`.toLowerCase().includes(keyword);
  });

  document.querySelector("#knowledgeGrid").innerHTML = filtered.map((item) => `<article class="knowledge-item">
    <span class="muted">${item.type}</span>
    <strong>${item.title}</strong>
    <p>${item.text}</p>
  </article>`).join("");
}

function addMessage(text, role = "assistant") {
  const log = document.querySelector("#chatLog");
  const message = document.createElement("div");
  message.className = `message ${role}`;
  message.textContent = text;
  log.appendChild(message);
  log.scrollTop = log.scrollHeight;
}

function answerQuestion(question) {
  if (question.includes("Notebook") || question.includes("超標")) {
    return `碳排：1.45 kgCO2e
目標：1.1 kgCO2e
超標：31%

原因：
1. SMT 耗電增加
2. 天然氣增加
3. 綠電比例下降

依據：ISO14064、ISO14067

建議：設備節能、綠電導入、空壓機優化
預估減碳：22%`;
  }
  return "目前 v1.0 原型支援 Notebook 超標、ISO、SOP 與稽核報告查詢。";
}

function bindNavigation() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("is-active"));
      document.querySelectorAll(".view").forEach((view) => view.classList.remove("is-active"));
      button.classList.add("is-active");
      document.querySelector(`#${button.dataset.view}`).classList.add("is-active");
    });
  });
}

function bindControls() {
  document.querySelector("#ragSearch").addEventListener("input", (event) => {
    renderKnowledge(event.target.value);
  });

  document.querySelector("#chatForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#chatInput");
    addMessage(input.value, "user");
    addMessage(answerQuestion(input.value));
  });

  document.querySelector("#refreshButton").addEventListener("click", () => {
    renderAlerts();
    renderTrendChart();
  });

  document.querySelector("#exportButton").addEventListener("click", () => {
    document.querySelector('[data-view="report"]').click();
  });
}

function init() {
  renderProducts();
  renderEnergy();
  renderAlerts();
  renderTrendChart();
  renderAgent();
  renderKnowledge();
  document.querySelector("#auditReport").textContent = reportText;
  addMessage("Notebook 為什麼超標？", "user");
  addMessage(answerQuestion("Notebook 為什麼超標？"));
  bindNavigation();
  bindControls();
}

init();
