const STORAGE_KEY = "mythic-seas-standalone-v1";

const config = {
  maxLevel: 100,
  statPointsPerLevel: 3,
  stats: ["Power", "Vitality", "Focus", "Agility"],
  islands: [
    { id: "sunspire", name: "日耀環礁", requiredLevel: 1 },
    { id: "moonfall", name: "月落群島", requiredLevel: 25, unlockQuest: "sunspire_guardian" },
    { id: "stormglass", name: "暴璃海岬", requiredLevel: 60, unlockQuest: "moonfall_echo" }
  ],
  cores: {
    Tideheart: {
      name: "潮心核心",
      bonus: { Focus: 4, Vitality: 2 },
      skill: { name: "湧潮斬", multiplier: 1.45, cooldown: 4 }
    },
    Ashflare: {
      name: "燼焰核心",
      bonus: { Power: 5 },
      skill: { name: "燼旋爆", multiplier: 1.7, cooldown: 5 }
    },
    Skylumen: {
      name: "天輝核心",
      bonus: { Agility: 4, Focus: 3 },
      skill: { name: "輝步連擊", multiplier: 1.6, cooldown: 5 }
    }
  },
  weapons: {
    Driftblade: { name: "漂浪刃", requiredLevel: 1, damage: 12 },
    Reefsplitter: { name: "裂礁重刃", requiredLevel: 25, damage: 34 },
    StormglassSaber: { name: "暴璃軍刀", requiredLevel: 60, damage: 78 }
  },
  enemies: [
    { id: "reef_wisp", name: "礁光幽靈", island: "sunspire", level: 1, hp: 55, damage: 6, exp: 18, glyph: "礁" },
    { id: "shellback_raider", name: "甲背掠奪者", island: "sunspire", level: 8, hp: 135, damage: 13, exp: 45, glyph: "甲" },
    { id: "brine_crowned_colossus", name: "鹽冠巨像", island: "sunspire", level: 18, hp: 1800, damage: 42, exp: 900, boss: true, glyph: "冠", drops: [{ id: "Reefsplitter", chance: 0.22 }, { id: "Tideheart", chance: 0.12 }] },
    { id: "moon_reef_duelist", name: "月礁決鬥者", island: "moonfall", level: 28, hp: 420, damage: 38, exp: 160, glyph: "月" },
    { id: "glassfin_marauder", name: "璃鰭劫掠者", island: "moonfall", level: 42, hp: 720, damage: 58, exp: 260, glyph: "璃" },
    { id: "moonlit_seraph", name: "月曜戰魂", island: "moonfall", level: 50, hp: 7400, damage: 125, exp: 4200, boss: true, glyph: "魂", drops: [{ id: "Ashflare", chance: 0.14 }, { id: "StormglassSaber", chance: 0.16 }] },
    { id: "stormbound_keeper", name: "縛雷守衛", island: "stormglass", level: 68, hp: 1450, damage: 110, exp: 640, glyph: "雷" },
    { id: "tempest_archon", name: "暴風執政者", island: "stormglass", level: 88, hp: 18000, damage: 240, exp: 9800, boss: true, glyph: "嵐", drops: [{ id: "Skylumen", chance: 0.12 }, { id: "StormglassSaber", chance: 0.22 }] }
  ],
  quests: {
    reef_first_light: { name: "初升礁光", island: "sunspire", level: 1, target: "reef_wisp", count: 5, exp: 160, coins: 120, next: "sunspire_guardian" },
    sunspire_guardian: { name: "日耀守門戰", island: "sunspire", level: 12, target: "brine_crowned_colossus", count: 1, exp: 1100, coins: 550, next: "moonfall_echo" },
    moonfall_echo: { name: "月落迴聲", island: "moonfall", level: 28, target: "moon_reef_duelist", count: 8, exp: 2100, coins: 900, next: "stormglass_oath" },
    stormglass_oath: { name: "暴璃誓約", island: "stormglass", level: 60, target: "stormbound_keeper", count: 10, exp: 7400, coins: 2200 }
  },
  questOrder: ["reef_first_light", "sunspire_guardian", "moonfall_echo", "stormglass_oath"]
};

const els = {
  islandLine: document.getElementById("islandLine"),
  saveStatus: document.getElementById("saveStatus"),
  enemyArt: document.getElementById("enemyArt"),
  enemyInitial: document.getElementById("enemyInitial"),
  enemyName: document.getElementById("enemyName"),
  enemyLevel: document.getElementById("enemyLevel"),
  enemyHp: document.getElementById("enemyHp"),
  enemyHpText: document.getElementById("enemyHpText"),
  attackBtn: document.getElementById("attackBtn"),
  coreBtn: document.getElementById("coreBtn"),
  nextEnemyBtn: document.getElementById("nextEnemyBtn"),
  log: document.getElementById("log"),
  playerLevel: document.getElementById("playerLevel"),
  coins: document.getElementById("coins"),
  expBar: document.getElementById("expBar"),
  expText: document.getElementById("expText"),
  points: document.getElementById("points"),
  stats: document.getElementById("stats"),
  questText: document.getElementById("questText"),
  questBtn: document.getElementById("questBtn"),
  islands: document.getElementById("islands"),
  coreSelect: document.getElementById("coreSelect"),
  weaponSelect: document.getElementById("weaponSelect")
};

let player = loadPlayer();
let currentEnemy = spawnEnemy();
let coreReadyAt = 0;

function defaultPlayer() {
  return {
    level: 1,
    exp: 0,
    coins: 0,
    statPoints: 0,
    hp: 120,
    maxHp: 120,
    stats: { Power: 0, Vitality: 0, Focus: 0, Agility: 0 },
    core: "Tideheart",
    weapon: "Driftblade",
    inventory: {
      cores: { Tideheart: true },
      weapons: { Driftblade: true }
    },
    unlockedIslands: { sunspire: true },
    activeIsland: "sunspire",
    activeQuest: null,
    questProgress: {},
    completedQuests: {}
  };
}

function loadPlayer() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return reconcile(defaultPlayer());

  try {
    return reconcile(JSON.parse(raw));
  } catch {
    return defaultPlayer();
  }
}

function reconcile(data) {
  const base = defaultPlayer();
  const merged = {
    ...base,
    ...data,
    stats: { ...base.stats, ...(data.stats || {}) },
    inventory: {
      cores: { ...base.inventory.cores, ...((data.inventory || {}).cores || {}) },
      weapons: { ...base.inventory.weapons, ...((data.inventory || {}).weapons || {}) }
    },
    unlockedIslands: { ...base.unlockedIslands, ...(data.unlockedIslands || {}) },
    questProgress: { ...base.questProgress, ...(data.questProgress || {}) },
    completedQuests: { ...base.completedQuests, ...(data.completedQuests || {}) }
  };

  const expectedMaxHp = 120 + merged.level * 8
    + ((merged.stats.Vitality || 0) + ((config.cores[merged.core].bonus || {}).Vitality || 0)) * 14;
  merged.maxHp = expectedMaxHp;
  if (!data.hp || data.hp > expectedMaxHp) {
    merged.hp = expectedMaxHp;
  }

  return merged;
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  els.saveStatus.textContent = "已自動存檔";
  setTimeout(() => (els.saveStatus.textContent = "本機存檔中"), 900);
}

function expForLevel(level) {
  if (level >= config.maxLevel) return Infinity;
  return Math.floor(80 + Math.pow(level, 2.18) * 22);
}

function effectiveStat(name) {
  const core = config.cores[player.core];
  return (player.stats[name] || 0) + ((core.bonus && core.bonus[name]) || 0);
}

function playerDamage(multiplier = 1) {
  const weapon = config.weapons[player.weapon];
  return Math.floor((weapon.damage + player.level * 1.5 + effectiveStat("Power") * 2.4 + effectiveStat("Focus") * 0.8) * multiplier);
}

function maxHp() {
  return 120 + player.level * 8 + effectiveStat("Vitality") * 14;
}

function spawnEnemy(preferredId) {
  const unlockedEnemies = config.enemies.filter((enemy) => {
    return enemy.island === player.activeIsland && enemy.level <= player.level + 4;
  });
  const pool = unlockedEnemies.length ? unlockedEnemies : config.enemies.filter((enemy) => enemy.island === player.activeIsland);
  const source = preferredId ? config.enemies.find((enemy) => enemy.id === preferredId) : pool[Math.floor(Math.random() * pool.length)];
  return { ...source, currentHp: source.hp };
}

function addLog(text) {
  const line = document.createElement("p");
  line.textContent = text;
  els.log.prepend(line);

  while (els.log.children.length > 9) {
    els.log.lastElementChild.remove();
  }
}

function addExp(amount) {
  if (player.level >= config.maxLevel) return;

  player.exp += amount;
  while (player.level < config.maxLevel && player.exp >= expForLevel(player.level)) {
    player.exp -= expForLevel(player.level);
    player.level += 1;
    player.statPoints += config.statPointsPerLevel;
    player.maxHp = maxHp();
    player.hp = player.maxHp;
    addLog(`等級提升！目前 Lv.${player.level}，獲得 ${config.statPointsPerLevel} 點屬性點。`);
  }
}

function grantDrop(drop) {
  if (config.cores[drop.id]) {
    if (!player.inventory.cores[drop.id]) addLog(`獲得 Mythic Core：${config.cores[drop.id].name}`);
    player.inventory.cores[drop.id] = true;
  }

  if (config.weapons[drop.id]) {
    if (!player.inventory.weapons[drop.id]) addLog(`獲得武器：${config.weapons[drop.id].name}`);
    player.inventory.weapons[drop.id] = true;
  }
}

function registerQuestKill(enemyId) {
  const quest = config.quests[player.activeQuest];
  if (!quest || quest.target !== enemyId) return;

  player.questProgress[player.activeQuest] = Math.min((player.questProgress[player.activeQuest] || 0) + 1, quest.count);
  if (player.questProgress[player.activeQuest] >= quest.count) {
    addLog(`任務目標完成：${quest.name}，請回報任務。`);
  }
}

function defeatEnemy() {
  addLog(`擊敗 ${currentEnemy.name}，獲得 ${currentEnemy.exp} EXP。`);
  addExp(currentEnemy.exp);
  registerQuestKill(currentEnemy.id);

  if (currentEnemy.drops) {
    currentEnemy.drops.forEach((drop) => {
      if (Math.random() <= drop.chance) grantDrop(drop);
    });
  }

  currentEnemy = spawnEnemy();
  save();
  render();
}

function enemyCounterAttack() {
  const reduction = effectiveStat("Agility") * 0.35;
  const damage = Math.max(1, Math.floor(currentEnemy.damage - reduction));
  player.hp -= damage;

  if (player.hp <= 0) {
    player.hp = maxHp();
    player.coins = Math.max(0, player.coins - Math.floor(player.coins * 0.08));
    addLog("你被擊倒並回到港口，損失少量 Coins。");
    currentEnemy = spawnEnemy();
  } else {
    addLog(`${currentEnemy.name} 反擊，造成 ${damage} 傷害。`);
  }
}

function attack(useCore = false) {
  const now = Date.now();
  const core = config.cores[player.core];
  const multiplier = useCore ? core.skill.multiplier : 1;

  if (useCore && now < coreReadyAt) {
    addLog("Mythic Core 技能仍在冷卻。");
    return;
  }

  if (useCore) coreReadyAt = now + core.skill.cooldown * 1000;

  const damage = playerDamage(multiplier);
  currentEnemy.currentHp -= damage;
  addLog(`${useCore ? core.skill.name : "普通攻擊"}造成 ${damage} 傷害。`);

  if (currentEnemy.currentHp <= 0) {
    defeatEnemy();
    return;
  }

  enemyCounterAttack();
  save();
  render();
}

function currentQuestCandidate() {
  if (player.activeQuest) return player.activeQuest;

  return config.questOrder.find((questId) => {
    const quest = config.quests[questId];
    return !player.completedQuests[questId]
      && player.level >= quest.level
      && player.unlockedIslands[quest.island];
  });
}

function handleQuest() {
  const questId = currentQuestCandidate();
  if (!questId) {
    addLog("目前沒有可接取的任務。");
    return;
  }

  const quest = config.quests[questId];
  const progress = player.questProgress[questId] || 0;

  if (!player.activeQuest) {
    player.activeQuest = questId;
    player.questProgress[questId] = 0;
    addLog(`接取任務：${quest.name}`);
  } else if (progress >= quest.count) {
    player.completedQuests[questId] = true;
    player.activeQuest = null;
    player.exp += 0;
    player.coins += quest.coins;
    addExp(quest.exp);
    addLog(`回報任務：${quest.name}，獲得 ${quest.exp} EXP 與 ${quest.coins} Coins。`);
    unlockIslands();
  } else {
    addLog(`任務尚未完成：${progress}/${quest.count}`);
  }

  save();
  render();
}

function unlockIslands() {
  config.islands.forEach((island) => {
    if (!player.unlockedIslands[island.id]
      && player.level >= island.requiredLevel
      && (!island.unlockQuest || player.completedQuests[island.unlockQuest])) {
      player.unlockedIslands[island.id] = true;
      addLog(`新島嶼解鎖：${island.name}`);
    }
  });
}

function spendStat(stat) {
  if (player.statPoints <= 0) return;
  player.stats[stat] += 1;
  player.statPoints -= 1;
  player.maxHp = maxHp();
  player.hp = Math.min(player.hp, player.maxHp);
  save();
  render();
}

function changeIsland(id) {
  if (!player.unlockedIslands[id]) return;
  player.activeIsland = id;
  currentEnemy = spawnEnemy();
  addLog(`航行至 ${config.islands.find((island) => island.id === id).name}。`);
  save();
  render();
}

function renderStats() {
  els.stats.innerHTML = "";
  config.stats.forEach((stat) => {
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML = `<span>${stat}: <strong>${player.stats[stat]}</strong> <small>(總和 ${effectiveStat(stat)})</small></span>`;

    const button = document.createElement("button");
    button.textContent = "+";
    button.disabled = player.statPoints <= 0;
    button.addEventListener("click", () => spendStat(stat));
    row.append(button);
    els.stats.append(row);
  });
}

function renderIslands() {
  els.islands.innerHTML = "";
  config.islands.forEach((island) => {
    const unlocked = player.unlockedIslands[island.id];
    const row = document.createElement("div");
    row.className = "island-row";
    row.innerHTML = `<span>${island.name}</span><small>${unlocked ? "已解鎖" : `Lv.${island.requiredLevel}`}</small>`;
    row.addEventListener("click", () => changeIsland(island.id));
    els.islands.append(row);
  });
}

function renderInventory() {
  els.coreSelect.innerHTML = "";
  Object.entries(config.cores).forEach(([id, core]) => {
    if (!player.inventory.cores[id]) return;
    const option = new Option(core.name, id, id === player.core, id === player.core);
    els.coreSelect.add(option);
  });

  els.weaponSelect.innerHTML = "";
  Object.entries(config.weapons).forEach(([id, weapon]) => {
    if (!player.inventory.weapons[id]) return;
    const option = new Option(`${weapon.name} Lv.${weapon.requiredLevel}`, id, id === player.weapon, id === player.weapon);
    els.weaponSelect.add(option);
  });
}

function renderQuest() {
  const questId = currentQuestCandidate();
  if (!questId) {
    els.questText.textContent = "目前沒有可接任務。";
    return;
  }

  const quest = config.quests[questId];
  const progress = player.questProgress[questId] || 0;
  const target = config.enemies.find((enemy) => enemy.id === quest.target);

  if (player.activeQuest) {
    els.questText.textContent = `任務：${quest.name}，擊敗 ${target.name} ${progress}/${quest.count}`;
  } else {
    els.questText.textContent = `可接任務：${quest.name}`;
  }
}

function renderEnemy() {
  els.enemyInitial.textContent = currentEnemy.glyph;
  els.enemyName.textContent = currentEnemy.name;
  els.enemyLevel.textContent = `${currentEnemy.boss ? "Boss " : ""}Lv.${currentEnemy.level}`;
  els.enemyHp.style.width = `${Math.max(0, currentEnemy.currentHp / currentEnemy.hp) * 100}%`;
  els.enemyHpText.textContent = `${Math.max(0, Math.floor(currentEnemy.currentHp))} / ${currentEnemy.hp}`;
  els.enemyArt.style.background = currentEnemy.boss
    ? "radial-gradient(circle at 35% 30%, rgba(255,255,255,.42), transparent 6rem), linear-gradient(145deg, #6f5b23, #d4564a)"
    : "radial-gradient(circle at 35% 30%, rgba(255,255,255,.45), transparent 6rem), linear-gradient(145deg, #168c86, #d4564a)";
}

function render() {
  unlockIslands();
  player.maxHp = maxHp();

  const island = config.islands.find((item) => item.id === player.activeIsland);
  const expNeed = expForLevel(player.level);
  els.islandLine.textContent = `${island.name} | HP ${Math.floor(player.hp)} / ${player.maxHp}`;
  els.playerLevel.textContent = `Lv.${player.level}`;
  els.coins.textContent = `${player.coins} Coins`;
  els.points.textContent = player.statPoints;
  els.expBar.style.width = expNeed === Infinity ? "100%" : `${Math.min(100, (player.exp / expNeed) * 100)}%`;
  els.expText.textContent = expNeed === Infinity ? "EXP MAX" : `EXP ${player.exp} / ${expNeed}`;

  renderEnemy();
  renderStats();
  renderQuest();
  renderIslands();
  renderInventory();
}

els.attackBtn.addEventListener("click", () => attack(false));
els.coreBtn.addEventListener("click", () => attack(true));
els.nextEnemyBtn.addEventListener("click", () => {
  currentEnemy = spawnEnemy();
  render();
});
els.questBtn.addEventListener("click", handleQuest);
els.coreSelect.addEventListener("change", (event) => {
  player.core = event.target.value;
  addLog(`裝備 Mythic Core：${config.cores[player.core].name}`);
  save();
  render();
});
els.weaponSelect.addEventListener("change", (event) => {
  const weapon = config.weapons[event.target.value];
  if (player.level < weapon.requiredLevel) {
    addLog("等級不足，無法裝備此武器。");
    renderInventory();
    return;
  }
  player.weapon = event.target.value;
  addLog(`裝備武器：${weapon.name}`);
  save();
  render();
});

window.addEventListener("beforeunload", save);
setInterval(save, 30000);

addLog("歡迎來到 Mythic Seas。點擊攻擊開始戰鬥，完成任務解鎖新的海域。");
render();
save();
