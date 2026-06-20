const CATEGORY_ICONS = {
  meat: "🥩",
  dairy: "🥛",
  vegetable: "🥦",
  fruit: "🍎",
  frozen: "❄️",
  pantry: "🏠",
};

const CATEGORY_LABELS = {
  meat: "🥩 肉類",
  dairy: "🥛 奶蛋",
  vegetable: "🥦 蔬菜",
  fruit: "🍎 水果",
  frozen: "❄️ 冷凍",
  pantry: "🏠 常溫",
};

function renderApp(foods) {
  var lists = getCategorizedLists(foods);
  var urgent = lists.expired.concat(lists.danger).sort(function (a, b) {
    return a.expireDate.localeCompare(b.expireDate);
  });

  var banner = document.getElementById("alert-banner");
  if (lists.danger.length > 0) {
    banner.textContent = "今天有 " + lists.danger.length + " 項食材快過期囉！";
    banner.classList.remove("hidden");
  } else {
    banner.classList.add("hidden");
  }

  var container = document.getElementById("food-sections");
  container.innerHTML = "";

  container.appendChild(createSection("🚨 救命呀 (已過期/快過期)", urgent));
  container.appendChild(createSection("🐱 快吃我", lists.warning));
  container.appendChild(createSection("🎀 安全唷", lists.safe));
  container.appendChild(createSection("✔ 已完食", lists.completed));
}

function createSection(title, items) {
  var section = document.createElement("div");
  section.className = "rounded-3xl bg-white/70 backdrop-blur-md p-4 shadow-[0_8px_30px_rgba(244,63,94,0.04)]";

  var header = document.createElement("h2");
  header.className = "text-lg font-bold text-pink-500 mb-3";
  header.textContent = title + (items.length ? " (" + items.length + ")" : "");
  section.appendChild(header);

  if (items.length === 0) {
    var empty = document.createElement("p");
    empty.className = "text-gray-300 text-sm text-center py-4";
    empty.textContent = "空空如也～";
    section.appendChild(empty);
  } else {
    items.forEach(function (food) {
      section.appendChild(createCard(food));
    });
  }

  return section;
}

function createCard(food) {
  var card = document.createElement("div");
  card.className = "flex items-center gap-3 py-3 border-b border-pink-100/20 last:border-b-0";
  card.dataset.card = "";

  var info = document.createElement("div");
  info.className = "flex-1 min-w-0";

  var nameLine = document.createElement("div");
  nameLine.className = "font-medium text-gray-800 truncate";
  nameLine.textContent = food.name;
  info.appendChild(nameLine);

  var unitType = food.unitType || "x";
  var originalQty = food.originalQuantity || food.quantity;
  var qtyLine = document.createElement("div");
  qtyLine.className = "text-xs text-gray-500 mt-0.5 qty-line";
  if (unitType === "x") {
    qtyLine.textContent = food.quantity > 1 ? "x" + food.quantity : "";
  } else {
    var unitLabel = unitType === "ml" ? "ml" : unitType === "g" ? "g" : "%";
    qtyLine.textContent = "剩餘 " + food.quantity + " / " + originalQty + " " + unitLabel;
  }
  info.appendChild(qtyLine);

  var subLine = document.createElement("div");
  subLine.className = "text-xs text-gray-400 mt-0.5";
  subLine.textContent = food.location;
  info.appendChild(subLine);

  var days = calculateRemainingDays(food.expireDate);
  var daysDiv = document.createElement("div");
  daysDiv.className = "text-xs mt-1 inline-block px-2 py-0.5 rounded-full border";
  if (days < 0) {
    daysDiv.textContent = "已過期 " + Math.abs(days) + " 天";
    daysDiv.className += " bg-red-50 text-red-400 border-red-200/50";
  } else if (days <= 2) {
    daysDiv.textContent = days === 0 ? "今天到期" : days + " 天後到期";
    daysDiv.className += " bg-rose-50 text-rose-400 border-rose-200/50";
  } else if (days <= 5) {
    daysDiv.textContent = days + " 天後到期";
    daysDiv.className += " bg-amber-50 text-amber-500 border-amber-200/50";
  } else {
    daysDiv.textContent = days + " 天後到期";
    daysDiv.className += " bg-emerald-50 text-emerald-500 border-emerald-200/50";
  }
  info.appendChild(daysDiv);

  card.appendChild(info);

  if (!food.finished) {
    var btnGroup = document.createElement("div");
    btnGroup.className = "flex items-center gap-1.5 shrink-0";

    var consumeBtn = document.createElement("button");
    consumeBtn.className = "text-xs px-2.5 py-1 rounded-full border border-pink-200 text-pink-400 bg-white/80 backdrop-blur-sm hover:bg-pink-50 shadow-sm";
    if (unitType === "x") {
      consumeBtn.textContent = "吃 1 個";
    } else if (unitType === "%") {
      consumeBtn.textContent = "用 10%";
    } else {
      consumeBtn.textContent = "用一點";
    }
    consumeBtn.dataset.consumeId = food.id;
    consumeBtn.dataset.unitType = unitType;
    btnGroup.appendChild(consumeBtn);

    var clearBtn = document.createElement("button");
    clearBtn.className = "text-xs px-2.5 py-1 rounded-full bg-pink-400 text-white hover:bg-pink-500 shadow-sm";
    clearBtn.textContent = "全吃完";
    clearBtn.dataset.clearId = food.id;
    btnGroup.appendChild(clearBtn);

    card.appendChild(btnGroup);
  }

  return card;
}

function populateLocationSelect(selectEl) {
  selectEl.innerHTML = "";
  var locations = getLocations();
  locations.forEach(function (loc) {
    var option = document.createElement("option");
    option.value = loc;
    option.textContent = loc;
    selectEl.appendChild(option);
  });
}
