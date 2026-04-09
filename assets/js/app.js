  const HEROES = [
      { id: "mage", name: "Arc Mage", emoji: "🧙", desc: "奧義循環快，爆發集中在大招", hp: 100, dmg: 12, critRate: 0.12, critDamage: 1.72, shield: 50, ultGainMul: 1.15 },
      { id: "knight", name: "Spell Knight", emoji: "🛡️", desc: "護盾與回復兼備，續戰能力強", hp: 128, dmg: 10, critRate: 0.1, critDamage: 1.62, shield: 74, ultGainMul: 1.0 },
      { id: "assassin", name: "Rune Assassin", emoji: "⚔️", desc: "連擊越高，暴擊傷害越兇", hp: 92, dmg: 13, critRate: 0.18, critDamage: 1.85, shield: 40, ultGainMul: 1.0 }
    ];

    const SPELL_GROUPS = {
      fire: ["fire", "flame", "blaze", "nova", "ember", "inferno"],
      bolt: ["bolt", "shock", "flash", "storm", "spark", "light"],
      slash: ["slash", "dash", "blade", "fang", "cleave", "cut"],
      heal: ["heal", "mend", "renew", "bloom", "vital", "cure"],
      guard: ["guard", "aegis", "shield", "wall", "ward", "barrier"],
      ultimate: ["meteor", "cataclysm", "supernova"]
    };

    const FEVER_FIRE_WORDS = ["ash", "ray", "sun", "hex", "pyr", "sol"];

    const SPELL_TYPE_LABELS = {
      fire: "Fire",
      bolt: "Bolt",
      slash: "Slash",
      heal: "Heal",
      guard: "Guard",
      ultimate: "Ultimate"
    };

    const HERO_WORD_POOLS = {
      mage: {
        fire: ["pyre", "cinder", "ignite"],
        bolt: ["arc", "surge", "thunder"],
        slash: ["rune", "sigil"],
        heal: ["oracle", "serene"],
        guard: ["prism", "glyph"],
        ultimate: ["astral", "eclipse", "cometfall"]
      },
      knight: {
        fire: ["valor", "smite"],
        bolt: ["judgment", "oath"],
        slash: ["cleaver", "vanguard"],
        heal: ["grace", "mercy", "sanctum"],
        guard: ["bulwark", "bastion", "fortress"],
        ultimate: ["aegis", "dominion", "paragon"]
      },
      assassin: {
        fire: ["brand", "embercut"],
        bolt: ["blink", "sting"],
        slash: ["shadow", "reaper", "phantom"],
        heal: ["siphon", "hush"],
        guard: ["smoke", "veil"],
        ultimate: ["execution", "nightfall", "onslaught"]
      }
    };

    const ENEMY_ARCHETYPES = [
      { id: "striker", name: "Rift Striker", emoji: "👹", hpMul: 1.0, dmgMul: 1.1, ai: { basic: 0.5, quick: 0.3, heavy: 0.2 } },
      { id: "warlock", name: "Night Warlock", emoji: "🧿", hpMul: 0.95, dmgMul: 1.05, ai: { basic: 0.3, poison: 0.32, drain: 0.22, heavy: 0.16 } },
      { id: "breaker", name: "Iron Breaker", emoji: "🪓", hpMul: 1.15, dmgMul: 0.98, ai: { basic: 0.3, break: 0.4, heavy: 0.3 } },
      { id: "trickster", name: "Hex Trickster", emoji: "🎭", hpMul: 1.0, dmgMul: 1.0, ai: { basic: 0.25, poison: 0.2, interrupt: 0.35, quick: 0.2 } }
    ];

    const BOSSES = [
      { id: "demon-lord", name: "Demon Lord", emoji: "😈", hpMul: 1.22, dmgMul: 1.08, ai: { bossMeteor: 0.22, heavy: 0.22, break: 0.14, drain: 0.12, quick: 0.3 } },
      { id: "sky-dragon", name: "Sky Dragon", emoji: "🐉", hpMul: 1.18, dmgMul: 1.1, ai: { bossMeteor: 0.2, quick: 0.3, heavy: 0.2, poison: 0.3 } },
      { id: "void-king", name: "Void King", emoji: "👑", hpMul: 1.26, dmgMul: 1.06, ai: { bossMeteor: 0.18, interrupt: 0.2, heavy: 0.2, drain: 0.2, quick: 0.22 } }
    ];

    const TALENTS = [
      { id: "dmgUp", name: "Power Surge", desc: "+3 基礎傷害" },
      { id: "critUp", name: "Deadly Focus", desc: "+6% 暴擊率" },
      { id: "hpUp", name: "Vital Core", desc: "+20 最大 HP 並回復 20" },
      { id: "shieldUp", name: "Barrier Mastery", desc: "+16 最大護盾並補 16" },
      { id: "ultUp", name: "Arcane Battery", desc: "奧義值 +25" },
      { id: "comboUp", name: "Combo Engine", desc: "提升連擊傷害成長" }
    ];

    const TALENT_TREES = {
      fury: {
        name: "狂戰系",
        nodes: [
          { name: "狂戰 I", desc: "+2 基礎傷害" },
          { name: "狂戰 II", desc: "+8% 暴擊率" },
          { name: "狂戰 III", desc: "+30% 暴擊傷害" },
          { name: "狂戰 IV", desc: "每次連擊獲得 +5% 暴擊率；非敵人造成斷連時清空此加成並受最大 HP 5% 反噬" }
        ]
      },
      arcane: {
        name: "祕法系",
        nodes: [
          { name: "祕法 I", desc: "奧義獲取 +12%" },
          { name: "祕法 II", desc: "FEVER 啟動門檻 -1 連擊" },
          { name: "祕法 III", desc: "每施放兩次奧義，有 50% 機率進入 FEVER" },
          { name: "祕法 IV", desc: "進入 FEVER 時只會出現專用 Fire 三字詞組" }
        ]
      },
      guardian: {
        name: "守護系",
        nodes: [
          { name: "守護 I", desc: "獲得 +20 最大 HP" },
          { name: "守護 II", desc: "受到傷害 -5%" },
          { name: "守護 III", desc: "施放奧義後，獲得一次抵擋特殊斷連攻擊的機會；抵擋後獲得原傷害 30% 護盾" },
          { name: "守護 IV", desc: "護盾吸收的傷害有 30% 反傷給敵人，且可爆擊" }
        ]
      }
    };

    const HERO_PASSIVES = {
      mage: {
        name: "奧術聚流",
        desc: "奧義累積增加 15%，施放奧義時暴擊機率以兩倍計算。"
      },
      knight: {
        name: "聖盾加護",
        desc: "施放護盾技能時附帶較低量回血；施放奧義時依攻擊力獲得護盾與回血；每次造成傷害的 15% 轉為護盾。"
      },
      assassin: {
        name: "致命連舞",
        desc: "每次連擊獲得 7.5% 暴擊傷害。"
      }
    };

    const GAME_VERSION = "v1.1.4";
    const STORAGE_KEY = "typing_battle_rankings_json_v2";
    const CONFIG_KEY = "typing_battle_rankings_config_v1";
    const ANNOUNCEMENT_STORAGE_KEY = "typing_battle_announcement_seen_v1";
    const ANNOUNCEMENT_VERSION = GAME_VERSION;
    const TIMED_LIMIT_MS = 150000;
    const XP_INITIAL_REQUIREMENT = 90;
    const XP_GROWTH_PER_LEVEL = 30;
    const TALENT_PRESET_POINTS = 6;
    const FIREBASE_DB_BASE_URL = "https://typing-master-6ece2-default-rtdb.asia-southeast1.firebasedatabase.app/";
    const FIREBASE_LEADERBOARD_PATH = "typing-battle/leaderboard";
    const FIREBASE_DEFAULT_JSON_URL = `${FIREBASE_DB_BASE_URL}${FIREBASE_LEADERBOARD_PATH}.json`;
    const DEBUG_BATTLE_LOGS = true;

    const game = {
      started: false,
      over: false,
      paused: false,
      waitingSpawn: false,
      waitingTalent: false,
      lastTick: 0,
      loopId: null,
      score: 0,
      wave: 1,
      kills: 0,
      combo: 0,
      maxCombo: 0,
      fever: 0,
      prompt: null,
      typedIndex: 0,
      selectedHero: HEROES[0],
      comboScaleBonus: 0,
      feverTriggerCombo: 7,
      feverDurationBaseMs: 7000,
      feverLockedUntilReset: false,
      pendingSkillChoices: 0,
      talentTreeLevels: { fury: 0, arcane: 0, guardian: 0 },
      soundOn: true,
      playerName: "Player",
      mode: "timed",
      boardViewMode: "timed",
      boardViewVersion: GAME_VERSION,
      timeLeftMs: TIMED_LIMIT_MS,
      remoteSyncState: "local",
      runId: 0
    };

    const player = {
      maxHp: 100,
      hp: 100,
      shield: 0,
      maxShield: 50,
      ult: 0,
      critRateBase: 0.12,
      critDamageBase: 1.7,
      critDamageBonus: 0,
      baseDamage: 12,
      ultGainMul: 1,
      damageReduction: 0,
      sustainBoostTier: 0,
      furyRecoilOnComboBreak: false,
      furyComboCritRateBonus: 0,
      furyComboCritRateEnabled: false,
      arcaneKillUltBonus: 0,
      arcaneUltFeverCounter: 0,
      arcaneUltFeverEnabled: false,
      arcaneFeverWordsEnabled: false,
      guardianSpecialBlockReady: false,
      guardianShieldThornsEnabled: false,
      level: 1,
      xp: 0,
      xpToNext: XP_INITIAL_REQUIREMENT
    };

    const enemy = {
      name: "Enemy",
      emoji: "👾",
      maxHp: 100,
      hp: 100,
      level: 1,
      isBoss: false,
      cooldown: 1800,
      cooldownMax: 1800,
      intent: null,
      damageBase: 8,
      aiTable: { basic: 1 },
      enrage: false,
      castSpeedMul: 1
    };

    const rankingConfig = { remoteUrl: FIREBASE_DEFAULT_JSON_URL, apiKey: "" };

    const $ = (id) => document.getElementById(id);
    function rand(n) { return Math.floor(Math.random() * n); }
    function choice(arr) { return arr[rand(arr.length)]; }
    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
    function nowIso() { return new Date().toISOString(); }
    function formatMs(ms) { const t = Math.max(0, Math.floor(ms / 1000)); return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`; }
    function sanitizeName(name) { const t = (name || "").trim().replace(/\s+/g, " "); return (t || "Player").slice(0, 20); }

    function debugLog(event, payload = {}) {
      if (!DEBUG_BATTLE_LOGS) return;
      console.log(`[TypingDebug][run ${game.runId}] ${event}`, {
        hp: player.hp,
        shield: player.shield,
        combo: game.combo,
        fever: game.fever,
        timeLeftMs: game.timeLeftMs,
        enemy: enemy.name,
        enemyHp: enemy.hp,
        over: game.over,
        ...payload
      });
    }

    function closeAnnouncement() {
      const overlay = $("announcementOverlay");
      if (!overlay) return;
      if ($("announcementDontShow")?.checked) {
        localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, ANNOUNCEMENT_VERSION);
      }
      overlay.classList.remove("show");
    }

    function initAnnouncement() {
      const overlay = $("announcementOverlay");
      const closeBtn = $("closeAnnouncementBtn");
      const title = $("announcementTitle");
      const seenVersion = localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY);
      if (title) title.textContent = `${ANNOUNCEMENT_VERSION} 更新公告`;
      if (!overlay || !closeBtn) return;
      if (seenVersion === ANNOUNCEMENT_VERSION) {
        overlay.classList.remove("show");
        return;
      }
      overlay.classList.add("show");
      closeBtn.onclick = closeAnnouncement;
      overlay.onclick = (e) => {
        if (e.target === overlay) closeAnnouncement();
      };
    }

    function defaultBoardVersionBucket() {
      return {
        updatedAt: null,
        timed: [],
        endless: []
      };
    }

    function defaultBoard() {
      return {
        schema: "typing-battle.leaderboard.v2",
        updatedAt: null,
        versions: {
          [GAME_VERSION]: defaultBoardVersionBucket()
        }
      };
    }

    function normalizeBoardRows(rawRows, mode) {
      let rows = [];
      if (Array.isArray(rawRows)) rows = rawRows;
      else if (rawRows && typeof rawRows === "object") {
        rows = Object.keys(rawRows)
          .filter((k) => /^\d+$/.test(k))
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => rawRows[k]);
      }

      const cleaned = rows
        .filter((r) => r && typeof r === "object")
        .map((r) => ({
          player: sanitizeName(r.player || "Player"),
          hero: typeof r.hero === "string" ? r.hero.slice(0, 30) : "Unknown",
          mode: mode,
          score: Math.max(0, Number(r.score) || 0),
          kills: Math.max(0, Number(r.kills) || 0),
          wave: Math.max(1, Number(r.wave) || 1),
          level: Math.max(1, Number(r.level) || 1),
          endedAt: typeof r.endedAt === "string" ? r.endedAt : nowIso()
        }));

      cleaned.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.wave !== a.wave) return b.wave - a.wave;
        return b.level - a.level;
      });
      return cleaned.slice(0, 10);
    }

    function normalizeBoardVersionBucket(raw) {
      const base = defaultBoardVersionBucket();
      if (!raw || typeof raw !== "object") return base;
      base.updatedAt = typeof raw.updatedAt === "string" ? raw.updatedAt : null;
      base.timed = normalizeBoardRows(raw.timed, "timed");
      base.endless = normalizeBoardRows(raw.endless, "endless");
      return base;
    }

    function ensureBoardVersion(board, version = GAME_VERSION) {
      if (!board.versions || typeof board.versions !== "object") board.versions = {};
      if (!board.versions[version]) board.versions[version] = defaultBoardVersionBucket();
      return board.versions[version];
    }

    function compareBoardVersions(a, b) {
      if (a === GAME_VERSION && b !== GAME_VERSION) return -1;
      if (b === GAME_VERSION && a !== GAME_VERSION) return 1;
      const aParts = (a.match(/\d+/g) || []).map(Number);
      const bParts = (b.match(/\d+/g) || []).map(Number);
      const len = Math.max(aParts.length, bParts.length);
      for (let i = 0; i < len; i++) {
        const diff = (bParts[i] || 0) - (aParts[i] || 0);
        if (diff !== 0) return diff;
      }
      return a.localeCompare(b);
    }

    function getBoardVersionList(board) {
      return Object.keys(board.versions || {}).sort(compareBoardVersions);
    }

    function mergeBoardRows(primaryRows, secondaryRows, mode) {
      const merged = [];
      const seen = new Set();
      const allRows = [...(primaryRows || []), ...(secondaryRows || [])];

      allRows.forEach((row) => {
        if (!row || typeof row !== "object") return;
        const normalized = normalizeBoardRows([row], mode)[0];
        if (!normalized) return;
        const key = [
          normalized.player,
          normalized.hero,
          normalized.mode,
          normalized.score,
          normalized.kills,
          normalized.wave,
          normalized.level,
          normalized.endedAt
        ].join("|");
        if (seen.has(key)) return;
        seen.add(key);
        merged.push(normalized);
      });

      merged.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.wave !== a.wave) return b.wave - a.wave;
        return b.level - a.level;
      });
      return merged.slice(0, 10);
    }

    function mergeBoards(primaryBoard, secondaryBoard) {
      const merged = defaultBoard();
      const allVersions = new Set([
        ...Object.keys((primaryBoard && primaryBoard.versions) || {}),
        ...Object.keys((secondaryBoard && secondaryBoard.versions) || {}),
        GAME_VERSION
      ]);

      merged.updatedAt = [primaryBoard?.updatedAt, secondaryBoard?.updatedAt].find((v) => typeof v === "string") || null;
      merged.versions = {};

      allVersions.forEach((version) => {
        const primaryBucket = primaryBoard?.versions?.[version] || defaultBoardVersionBucket();
        const secondaryBucket = secondaryBoard?.versions?.[version] || defaultBoardVersionBucket();
        merged.versions[version] = {
          updatedAt: [primaryBucket.updatedAt, secondaryBucket.updatedAt].find((v) => typeof v === "string") || null,
          timed: mergeBoardRows(primaryBucket.timed, secondaryBucket.timed, "timed"),
          endless: mergeBoardRows(primaryBucket.endless, secondaryBucket.endless, "endless")
        };
      });

      return merged;
    }

    function normalizeBoard(raw) {
      const base = defaultBoard();
      if (!raw || typeof raw !== "object") return base;

      base.schema = typeof raw.schema === "string" ? raw.schema : base.schema;
      base.updatedAt = typeof raw.updatedAt === "string" ? raw.updatedAt : null;
      base.versions = {};

      if (raw.versions && typeof raw.versions === "object" && !Array.isArray(raw.versions)) {
        Object.entries(raw.versions).forEach(([version, bucket]) => {
          const key = typeof version === "string" ? version.trim() : "";
          if (!key) return;
          base.versions[key] = normalizeBoardVersionBucket(bucket);
        });
      }

      if (Array.isArray(raw.timed) || Array.isArray(raw.endless) || (raw.timed && typeof raw.timed === "object") || (raw.endless && typeof raw.endless === "object")) {
        base.versions[GAME_VERSION] = normalizeBoardVersionBucket(raw);
      }

      ensureBoardVersion(base, GAME_VERSION);
      return base;
    }

    function boardNeedsRepair(raw) {
      if (!raw || typeof raw !== "object") return false;
      if (!raw.versions || typeof raw.versions !== "object" || Array.isArray(raw.versions)) return true;

      const hasCurrentVersion = Object.prototype.hasOwnProperty.call(raw.versions, GAME_VERSION);
      const versionsNeedRepair = Object.values(raw.versions).some((bucket) => {
        if (!bucket || typeof bucket !== "object") return true;
        return [bucket.timed, bucket.endless].some((rows) => {
          if (Array.isArray(rows)) {
            if (rows.length > 0 && !(0 in rows)) return true;
            return rows.some((r) => !r || typeof r !== "object");
          }
          if (rows && typeof rows === "object") return true;
          return false;
        });
      });

      if (versionsNeedRepair) return true;
      if (!hasCurrentVersion) return true;
      return !!raw.timed || !!raw.endless;
    }

    function syncBoardVersionSelect(board) {
      const select = $("boardVersionSelect");
      if (!select) return;
      const versions = getBoardVersionList(board);
      if (!versions.includes(game.boardViewVersion)) {
        game.boardViewVersion = versions.includes(GAME_VERSION) ? GAME_VERSION : (versions[0] || GAME_VERSION);
      }

      select.innerHTML = "";
      versions.forEach((version) => {
        const option = document.createElement("option");
        option.value = version;
        option.textContent = version === GAME_VERSION ? `${version}（目前版本）` : version;
        select.appendChild(option);
      });
      select.value = game.boardViewVersion;
    }

    function getRemoteHeaders() {
      return { "Content-Type": "application/json" };
    }

    function isFirebaseRealtimeDbUrl(url) {
      return /https?:\/\/[^/]*(firebaseio\.com|firebasedatabase\.app)(\/|$)/i.test(url);
    }

    function normalizeRemoteUrl(rawUrl) {
      const raw = (rawUrl || "").trim();
      if (!raw) return "";

      if (!isFirebaseRealtimeDbUrl(raw)) return raw;
      try {
        const u = new URL(raw);
        let p = u.pathname || "/";
        if (!p.endsWith(".json")) {
          p = p.replace(/\/+$/, "");
          if (!p || p === "/") p = `/${FIREBASE_LEADERBOARD_PATH}`;
          p = `${p}.json`;
        }
        u.pathname = p;
        return u.toString();
      } catch (_) {
        return raw;
      }
    }

    function getRemoteFetchUrl() {
      const raw = normalizeRemoteUrl(rankingConfig.remoteUrl || "");
      const token = (rankingConfig.apiKey || "").trim();
      if (!raw) return "";
      if (!token) return raw;
      if (!isFirebaseRealtimeDbUrl(raw)) return raw;
      if (/[?&]auth=/.test(raw)) return raw;
      const sep = raw.includes("?") ? "&" : "?";
      return `${raw}${sep}auth=${encodeURIComponent(token)}`;
    }

    function updateConnBadge(state = "") {
      const badge = $("connBadge");
      badge.classList.remove("ok", "warn");
      if (state === "ok") {
        badge.textContent = "遠端 JSON 連線正常";
        badge.classList.add("ok");
        return;
      }
      if (state === "warn") {
        badge.textContent = "遠端同步失敗，改用本機 JSON";
        badge.classList.add("warn");
        return;
      }
      badge.textContent = rankingConfig.remoteUrl ? "已設定 Firebase/遠端 JSON" : "目前使用本機 JSON";
    }

    function loadConfig() {
      try {
        const raw = JSON.parse(localStorage.getItem(CONFIG_KEY) || "{}");
        rankingConfig.remoteUrl = typeof raw.remoteUrl === "string" ? raw.remoteUrl.trim() : "";
        rankingConfig.apiKey = typeof raw.apiKey === "string" ? raw.apiKey.trim() : "";
      } catch (_) {
        rankingConfig.remoteUrl = "";
        rankingConfig.apiKey = "";
      }
      if (!rankingConfig.remoteUrl) rankingConfig.remoteUrl = FIREBASE_DEFAULT_JSON_URL;
      rankingConfig.remoteUrl = normalizeRemoteUrl(rankingConfig.remoteUrl);
      updateConnBadge();
    }

    function saveConfig() {
      if (!rankingConfig.remoteUrl) rankingConfig.remoteUrl = FIREBASE_DEFAULT_JSON_URL;
      rankingConfig.remoteUrl = normalizeRemoteUrl(rankingConfig.remoteUrl);
      localStorage.setItem(CONFIG_KEY, JSON.stringify(rankingConfig));
      updateConnBadge();
    }

    async function loadBoard() {
      const localRaw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      const localBoard = normalizeBoard(localRaw);
      let board = localBoard;
      game.remoteSyncState = "local";

      const remoteFetchUrl = getRemoteFetchUrl();
      if (!remoteFetchUrl) return board;

      try {
        const res = await fetch(remoteFetchUrl, { method: "GET", headers: getRemoteHeaders() });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const payload = data && data.record ? data.record : data;
        const remoteBoard = normalizeBoard(payload);
        board = mergeBoards(localBoard, remoteBoard);

        const shouldWriteBack = payload == null
          || boardNeedsRepair(payload)
          || JSON.stringify(board) !== JSON.stringify(remoteBoard);

        if (shouldWriteBack) {
          // First-time initialization on cloud DB.
          board.updatedAt = nowIso();
          await fetch(remoteFetchUrl, {
            method: "PUT",
            headers: getRemoteHeaders(),
            body: JSON.stringify(board)
          });
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
        game.remoteSyncState = "remote";
        updateConnBadge("ok");
      } catch (err) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
        game.remoteSyncState = "fallback";
        updateConnBadge("warn");
        debugLog("leaderboardSyncFallback", { error: err?.message || String(err) });
      }

      return board;
    }

    async function persistBoard(board) {
      const normalized = normalizeBoard(board);
      normalized.updatedAt = nowIso();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

      const remoteFetchUrl = getRemoteFetchUrl();
      if (!remoteFetchUrl) {
        game.remoteSyncState = "local";
        return;
      }

      try {
        const res = await fetch(remoteFetchUrl, {
          method: "PUT",
          headers: getRemoteHeaders(),
          body: JSON.stringify(normalized)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        game.remoteSyncState = "remote";
        updateConnBadge("ok");
      } catch (_) {
        game.remoteSyncState = "fallback";
        updateConnBadge("warn");
      }
    }

    function setMessage(msg) { $("messageBox").textContent = msg; }

    function centerOf(el) {
      const rect = el.getBoundingClientRect();
      const layerRect = $("effectLayer").getBoundingClientRect();
      return { x: rect.left - layerRect.left + rect.width / 2, y: rect.top - layerRect.top + rect.height / 2 };
    }

    function floatText(targetEl, text, cls) {
      const area = targetEl.parentElement.parentElement || targetEl.parentElement;
      const t = document.createElement("div");
      t.className = `floating-text ${cls}`;
      t.textContent = text;
      t.style.left = `${50 + rand(34) - 17}%`;
      t.style.top = `${110 + rand(22)}px`;
      area.appendChild(t);
      setTimeout(() => t.remove(), 920);
    }

    function animateChar(id, cls) {
      const el = $(id);
      el.classList.remove("attack-forward", "attack-backward", "hit", "spawn-flash", "charge-glow");
      void el.offsetWidth;
      el.classList.add(cls);
    }

    function shakeScreen() {
      const wrap = $("gameWrap");
      wrap.classList.remove("screen-shake");
      void wrap.offsetWidth;
      wrap.classList.add("screen-shake");
    }

    function spawnProjectile(fromId, toId, className) {
      const layer = $("effectLayer");
      const from = centerOf($(fromId));
      const to = centerOf($(toId));
      const p = document.createElement("div");
      p.className = `projectile ${className}`;
      p.style.left = `${from.x - 17}px`;
      p.style.top = `${from.y - 17}px`;
      p.style.setProperty("--dx", `${to.x - from.x}px`);
      p.style.setProperty("--dy", `${to.y - from.y}px`);
      layer.appendChild(p);
      setTimeout(() => p.remove(), 520);
    }

    function spawnLightning(toId) {
      const layer = $("effectLayer");
      const target = $(toId).getBoundingClientRect();
      const layerRect = layer.getBoundingClientRect();
      const bolt = document.createElement("div");
      bolt.className = "lightning";
      bolt.style.left = `${target.left - layerRect.left + target.width / 2 - 6}px`;
      bolt.style.top = `${target.top - layerRect.top - 36}px`;
      bolt.style.setProperty("--bolt-h", `${target.height + 40}px`);
      layer.appendChild(bolt);
      setTimeout(() => bolt.remove(), 320);
    }

    function spawnSlash(fromId, toId) {
      const layer = $("effectLayer");
      const from = centerOf($(fromId));
      const to = centerOf($(toId));
      const s = document.createElement("div");
      s.className = "slash-wave";
      s.style.left = `${from.x - 35}px`;
      s.style.top = `${from.y - 12}px`;
      s.style.setProperty("--dx", `${to.x - from.x}px`);
      s.style.setProperty("--dy", `${to.y - from.y}px`);
      layer.appendChild(s);
      setTimeout(() => s.remove(), 340);
    }

    function spawnBurstAt(el, className) {
      const layer = $("effectLayer");
      const p = centerOf(el);
      const b = document.createElement("div");
      b.className = `burst ${className}`;
      b.style.left = `${p.x - 20}px`;
      b.style.top = `${p.y - 20}px`;
      layer.appendChild(b);
      setTimeout(() => b.remove(), 650);
    }

    const activeGameTimeouts = new Set();
    const activeGameIntervals = new Set();

    function clearGameAsyncs() {
      debugLog("clearGameAsyncs", { timeouts: activeGameTimeouts.size, intervals: activeGameIntervals.size });
      activeGameTimeouts.forEach((id) => clearTimeout(id));
      activeGameIntervals.forEach((id) => clearInterval(id));
      activeGameTimeouts.clear();
      activeGameIntervals.clear();
    }

    function scheduleGameTimeout(fn, delay, runId = game.runId) {
      const id = setTimeout(() => {
        activeGameTimeouts.delete(id);
        if (runId !== game.runId) return;
        fn();
      }, delay);
      activeGameTimeouts.add(id);
      return id;
    }

    function scheduleGameInterval(fn, delay, runId = game.runId) {
      const id = setInterval(() => {
        if (runId !== game.runId) {
          clearInterval(id);
          activeGameIntervals.delete(id);
          return;
        }
        fn(id);
      }, delay);
      activeGameIntervals.add(id);
      return id;
    }

    function spawnMeteorStorm(targetId, hitCount = 4) {
      const layer = $("effectLayer");
      const targetEl = $(targetId);
      const target = centerOf(targetEl);

      for (let i = 0; i < hitCount; i++) {
        setTimeout(() => {
          const meteor = document.createElement("div");
          meteor.className = "meteor";
          const startX = target.x - 140 + rand(280);
          const startY = target.y - 170 - rand(80);
          const endX = target.x - 30 + rand(60);
          const endY = target.y - 12 + rand(28);
          meteor.style.left = `${startX}px`;
          meteor.style.top = `${startY}px`;
          meteor.style.setProperty("--dx", `${endX - startX}px`);
          meteor.style.setProperty("--dy", `${endY - startY}px`);
          layer.appendChild(meteor);
          setTimeout(() => {
            meteor.remove();
            spawnBurstAt(targetEl, "meteor-impact");
          }, 500);
        }, i * 110);
      }
    }

    let audioCtx = null;
    function initAudio() {
      if (!audioCtx) {
        try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
        catch (_) {}
      }
    }

    function playTone(freq = 440, duration = 0.08, type = "sine", gainValue = 0.03) {
      if (!game.soundOn) return;
      if (!audioCtx) initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = gainValue;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      const t = audioCtx.currentTime;
      gain.gain.setValueAtTime(gainValue, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
      osc.start(t);
      osc.stop(t + duration);
    }

    function sfxCorrect() { playTone(660, 0.06, "triangle", 0.025); }
    function sfxWrong() { playTone(180, 0.12, "sawtooth", 0.03); }
    function sfxHit() { playTone(320, 0.1, "square", 0.04); }
    function sfxCrit() { playTone(880, 0.12, "triangle", 0.04); playTone(1320, 0.09, "triangle", 0.03); }
    function sfxHeal() { playTone(520, 0.1, "sine", 0.03); playTone(700, 0.12, "sine", 0.02); }
    function sfxLevel() { playTone(520, 0.09, "triangle", 0.03); playTone(660, 0.09, "triangle", 0.03); playTone(880, 0.12, "triangle", 0.03); }
    function sfxBoss() { playTone(140, 0.18, "sawtooth", 0.04); }
    function sfxUltimate() { playTone(300, 0.12, "triangle", 0.04); playTone(500, 0.14, "triangle", 0.04); playTone(800, 0.18, "triangle", 0.04); }

    async function updateLeaderboard() {
      const list = $("leaderboardList");
      const board = await loadBoard();
      syncBoardVersionSelect(board);
      const versionBucket = ensureBoardVersion(board, game.boardViewVersion);
      const modeRows = game.boardViewMode === "timed" ? versionBucket.timed : versionBucket.endless;
      list.innerHTML = "";
      if (!modeRows.length) {
        list.innerHTML = "<li>目前尚無紀錄。</li>";
        return;
      }
      modeRows.forEach((r, i) => {
        const li = document.createElement("li");
        const extra = game.boardViewMode === "timed" ? `擊殺 ${r.kills}` : `波次 ${r.wave}`;
        li.textContent = `#${i + 1} ${r.player} | ${r.hero} | 分數 ${r.score} | ${extra} | Lv ${r.level}`;
        list.appendChild(li);
      });
    }

    async function saveScore() {
      const board = await loadBoard();
      const mode = game.mode;
      const versionBucket = ensureBoardVersion(board, GAME_VERSION);
      const bucket = mode === "timed" ? versionBucket.timed : versionBucket.endless;
      bucket.push({
        player: game.playerName,
        hero: game.selectedHero.name,
        mode,
        score: game.score,
        kills: game.kills,
        wave: game.wave,
        level: player.level,
        endedAt: nowIso()
      });
      bucket.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.wave !== a.wave) return b.wave - a.wave;
        return b.level - a.level;
      });
      if (mode === "timed") versionBucket.timed = bucket.slice(0, 10);
      else versionBucket.endless = bucket.slice(0, 10);
      versionBucket.updatedAt = nowIso();

      await persistBoard(board);
      game.boardViewMode = mode;
      game.boardViewVersion = GAME_VERSION;
      setBoardChips();
      await updateLeaderboard();
    }

    function applyHero(hero) {
      game.selectedHero = hero;
      player.maxHp = hero.hp;
      player.hp = hero.hp;
      player.baseDamage = hero.dmg;
      player.critRateBase = hero.critRate;
      player.critDamageBase = hero.critDamage;
      player.critDamageBonus = 0;
      player.maxShield = hero.shield;
      player.shield = 0;
      player.ultGainMul = hero.ultGainMul;
      player.damageReduction = 0;
      player.sustainBoostTier = 0;
      player.furyRecoilOnComboBreak = false;
      player.furyComboCritRateBonus = 0;
      player.furyComboCritRateEnabled = false;
      player.arcaneKillUltBonus = 0;
      player.arcaneUltFeverCounter = 0;
      player.arcaneUltFeverEnabled = false;
      player.arcaneFeverWordsEnabled = false;
      player.guardianSpecialBlockReady = false;
      player.guardianShieldThornsEnabled = false;
      $("playerChar").textContent = hero.emoji;
      document.querySelectorAll(".char-option").forEach((el) => {
        el.classList.toggle("active", el.dataset.id === hero.id);
      });
      renderHeroLoadoutPreview();
      updateUI();
    }

    function renderHeroSelect() {
      const box = $("characterSelect");
      box.innerHTML = "";
      HEROES.forEach((hero) => {
        const passive = HERO_PASSIVES[hero.id];
        const card = document.createElement("div");
        card.className = `char-option${hero.id === game.selectedHero.id ? " active" : ""}`;
        card.dataset.id = hero.id;
        card.innerHTML = `
          <div class="char-emoji">${hero.emoji}</div>
          <div class="char-name">${hero.name}</div>
          <div class="char-desc">${hero.desc}</div>
          <div class="char-desc">暴擊率 ${Math.floor(hero.critRate * 100)}% / 暴擊傷害 ${Math.floor(hero.critDamage * 100)}%</div>
          <div class="char-unique">
            <div>被動：${passive ? passive.name : "無"}</div>
            <div>${passive ? passive.desc : "無"}</div>
          </div>
        `;
        card.onclick = () => {
          if (game.started && !game.over) return;
          applyHero(hero);
        };
        box.appendChild(card);
      });
      renderHeroLoadoutPreview();
    }

    function setModeButtons() {
      const timed = game.mode === "timed";
      $("timedModeBtn").classList.toggle("active", timed);
      $("endlessModeBtn").classList.toggle("active", !timed);
      $("modeValue").textContent = timed ? "限時" : "無盡";
    }

    function setBoardChips() {
      const timed = game.boardViewMode === "timed";
      $("timedBoardChip").classList.toggle("active", timed);
      $("endlessBoardChip").classList.toggle("active", !timed);
    }

    function getCurrentAttackPower() {
      return player.baseDamage + Math.floor(game.combo * (1.45 + game.comboScaleBonus));
    }

    function getCritRate() {
      return clamp(
        player.critRateBase
        + player.furyComboCritRateBonus
        + (game.fever > 0 ? 0.08 : 0),
        0,
        0.75
      );
    }
    function getCritDamage() {
      const assassinComboBonus = game.selectedHero.id === "assassin" ? game.combo * 0.075 : 0;
      return clamp(player.critDamageBase + player.critDamageBonus + assassinComboBonus, 1.2, 6);
    }
    function getFeverTriggerCombo() { return Math.max(5, game.feverTriggerCombo); }
    function getSustainMultiplier() {
      if (player.sustainBoostTier <= 0) return 1;
      return (player.hp / player.maxHp) < 0.3 ? 1.3 : 1.15;
    }
    function getWordPool(type) {
      if (type === "fire" && game.fever > 0 && player.arcaneFeverWordsEnabled) {
        return [...FEVER_FIRE_WORDS];
      }
      const base = SPELL_GROUPS[type] || [];
      const heroExtra = (HERO_WORD_POOLS[game.selectedHero.id] && HERO_WORD_POOLS[game.selectedHero.id][type]) || [];
      return base.concat(heroExtra);
    }

    function isArcaneFeverWordMode() {
      return game.fever > 0 && player.arcaneFeverWordsEnabled;
    }

    function hasArcaneUltFeverTalent() {
      return (game.talentTreeLevels.arcane || 0) >= 3;
    }

    function hasArcaneFeverWordTalent() {
      return (game.talentTreeLevels.arcane || 0) >= 4;
    }

    function getPreviewSpellTypes() {
      return ["fire", "bolt", "slash", "heal", "guard", "ultimate"];
    }

    function getPreviewTypeNote(type) {
      if (type === "heal") return "戰鬥中生命未滿時才會加入輪替。";
      if (type === "ultimate") {
        return hasArcaneUltFeverTalent()
          ? "奧義條滿後按 Space 展開大招詞牌；每施放兩次奧義有 50% 機率進入 FEVER。"
          : "奧義條滿後按 Space 展開大招詞牌。";
      }
      if (type === "fire" && hasArcaneFeverWordTalent()) {
        return "平時為一般 Fire 牌池；進入 FEVER 後會改成專用三字 Fire 詞組。";
      }
      return "基礎牌池，會依戰鬥狀態進入輪替。";
    }

    function getPreviewTypeDetail(type) {
      const heroId = game.selectedHero.id;
      if (type === "fire") {
        return {
          effect: hasArcaneFeverWordTalent()
            ? "FEVER 專用 Fire 詞組，固定只會出三字火焰詞。"
            : "穩定單體輸出，命中後累積奧義。",
          formula: "傷害 = calcDamage(基礎攻擊 + 6, 1.0)"
        };
      }
      if (type === "bolt") {
        return {
          effect: "高倍率雷擊，偏爆發型單體技能，命中後累積較多奧義。",
          formula: "傷害 = calcDamage(基礎攻擊 + 10, 1.1)"
        };
      }
      if (type === "slash") {
        return {
          effect: "快速斬擊，35% 機率觸發一次追擊。",
          formula: "主擊 = calcDamage(基礎攻擊 + 4, 1.0)；追擊 = calcDamage(8 + floor(等級 / 4), 0.9)"
        };
      }
      if (type === "heal") {
        return {
          effect: "回復生命並累積奧義值。",
          formula: "回復 = floor((最大HP * 0.18 + floor(combo * 1.2)) * sustainMultiplier)"
        };
      }
      if (type === "guard") {
        return {
          effect: heroId === "knight"
            ? "獲得護盾並附帶較低量回血；騎士每次造成傷害時，還會把 15% 傷害轉為護盾。"
            : "獲得護盾。",
          formula: heroId === "knight"
            ? "護盾 = floor((18 + floor(combo * 1.35)) * sustainMultiplier)；回血 = floor(max(4, floor(目前攻擊力 * 0.28)) * sustainMultiplier)；傷害轉盾 = floor(本次傷害 * 0.15)"
            : "護盾 = floor((18 + floor(combo * 1.35)) * sustainMultiplier)"
        };
      }
      if (type === "ultimate") {
        return {
          effect: heroId === "mage"
            ? "多段奧義輸出；法師被動讓奧義暴擊率以兩倍計算。"
            : heroId === "knight"
              ? "多段奧義輸出；騎士會依攻擊力獲得護盾與回血，守護 III 還會給一次特殊斷連防護。"
              : "多段奧義輸出；會吃到刺客連擊暴傷被動。",
          formula: heroId === "knight"
            ? "總傷害 = hits 次 calcDamage(基礎攻擊 + 18, 1.08, critRateScale)；額外護盾 = floor(max(18, floor(目前攻擊力 * 1.9)) * sustainMultiplier)；額外回血 = floor(max(8, floor(目前攻擊力 * 0.95)) * sustainMultiplier)"
            : heroId === "mage"
              ? "總傷害 = hits 次 calcDamage(基礎攻擊 + 18, 1.08, 2)；hits = Boss 4 / 一般 3"
              : "總傷害 = hits 次 calcDamage(基礎攻擊 + 18, 1.08, 1)；hits = Boss 4 / 一般 3"
        };
      }

      return {
        effect: "依目前設定產生對應效果。",
        formula: "公式依實際技能邏輯計算"
      };
    }

    function renderHeroLoadoutPreview() {
      const panel = $("heroPoolPreview");
      if (!panel) return;

      const hero = game.selectedHero;
      const passive = HERO_PASSIVES[hero.id];
      const types = getPreviewSpellTypes();
      const groupsHtml = types.map((type) => {
        const words = getWordPool(type);
        const detail = getPreviewTypeDetail(type);
        const chips = words.map((word) => `<span class="hero-pool-chip">${word}</span>`).join("");
        const feverChips = type === "fire" && hasArcaneFeverWordTalent()
          ? `
            <div class="hero-pool-subtitle">FEVER 詞組</div>
            <div class="hero-pool-chip-list">${FEVER_FIRE_WORDS.map((word) => `<span class="hero-pool-chip hero-pool-chip-fever">${word}</span>`).join("")}</div>
          `
          : "";
        return `
          <section class="hero-pool-group">
            <div class="hero-pool-group-title">
              <span>${SPELL_TYPE_LABELS[type] || type}</span>
              <span class="hero-pool-group-meta">${words.length} 張詞牌</span>
            </div>
            <div class="hero-pool-note">${getPreviewTypeNote(type)}</div>
            <div class="hero-pool-effect"><span>效果</span>${detail.effect}</div>
            <div class="hero-pool-formula"><span>公式</span><code>${detail.formula}</code></div>
            ${feverChips}
            <div class="hero-pool-chip-list">${chips}</div>
          </section>
        `;
      }).join("");

      panel.innerHTML = `
        <div class="hero-pool-title">牌池側欄</div>
        <div class="hero-pool-hero">${hero.emoji} ${hero.name}</div>
        <div class="hero-pool-passive">被動：${passive ? `${passive.name}。${passive.desc}` : "無"}</div>
        <div class="hero-pool-note">此處顯示目前英雄與已配置天賦可持有的完整牌池。條件型牌種會在說明中標示。</div>
        ${groupsHtml}
      `;
      syncHeroPoolPreviewHeight();
    }

    function syncHeroPoolPreviewHeight() {
      const panel = $("heroPoolPreview");
      const mainColumn = document.querySelector(".hero-main-column");
      if (!panel || !mainColumn) return;
      requestAnimationFrame(() => {
        if (window.innerWidth <= 980) {
          panel.style.height = "auto";
          return;
        }
        panel.style.height = `${mainColumn.offsetHeight}px`;
      });
    }

    function startFever(message = "FEVER MODE 啟動，傷害與暴擊率上升。") {
      game.fever = game.feverDurationBaseMs;
      game.feverLockedUntilReset = true;
      debugLog("startFever", { message });
      setMessage(message);
      if (
        game.started
        && !game.over
        && !game.waitingSpawn
        && !game.waitingTalent
        && !game.paused
        && (!game.prompt || game.prompt.type !== "ultimate")
      ) {
        generatePrompt();
      }
      updateUI();
    }

    function chooseSkillType() {
      if (isArcaneFeverWordMode()) return "fire";
      const heroId = game.selectedHero.id;
      const pool = ["fire", "fire", "slash", "slash", "bolt", "bolt", "guard", "fire", "slash"];

      // Only allow heal prompts when HP is not full.
      if (player.hp < player.maxHp) pool.push("heal");
      if (player.hp <= player.maxHp * 0.45) pool.push("heal", "heal");
      if (player.shield <= 8) pool.push("guard");

      if (heroId === "mage") pool.push("bolt");
      if (heroId === "knight") pool.push("guard");
      if (heroId === "assassin") pool.push("slash");

      return choice(pool);
    }

    function isUltimateReady() {
      return player.ult >= 100 && (!game.prompt || game.prompt.type !== "ultimate");
    }

    function activateUltimatePrompt() {
      if (!isUltimateReady()) return false;
      const word = choice(getWordPool("ultimate"));
      game.prompt = { type: "ultimate", word };
      game.typedIndex = 0;
      renderPrompt();
      $("playerStatus").textContent = "奧義：ULTIMATE";
      setMessage("奧義詞牌展開，輸入後施放大招。");
      updateUI();
      return true;
    }

    function generatePrompt() {
      const type = chooseSkillType();
      const word = choice(getWordPool(type));
      game.prompt = { type, word };
      game.typedIndex = 0;
      renderPrompt();
      $("playerStatus").textContent = `法術：${type.toUpperCase()}`;
    }

    function renderPrompt() {
      const box = $("typingBox");
      box.classList.toggle("ult-ready", isUltimateReady());
      box.classList.toggle("ult-casting", !!game.prompt && game.prompt.type === "ultimate");
      if (!game.prompt) {
        box.textContent = "---";
        return;
      }
      const w = game.prompt.word;
      let html = "";
      for (let i = 0; i < w.length; i++) {
        let cls = "typed-next";
        if (i < game.typedIndex) cls = "typed-ok";
        else if (i === game.typedIndex) cls = "typed-current";
        html += `<span class="${cls}">${w[i]}</span>`;
      }
      box.innerHTML = html;
    }

    function updateUI() {
      $("playerDisplayName").textContent = `${game.playerName} | ${game.selectedHero.name}`;
      $("playerHpBar").style.width = `${(player.hp / player.maxHp) * 100}%`;
      $("playerHpText").textContent = `${Math.ceil(player.hp)} / ${player.maxHp}`;
      $("playerShieldBar").style.width = `${clamp(player.shield / player.maxShield, 0, 1) * 100}%`;
      $("playerShieldText").textContent = Math.ceil(player.shield);
      $("playerUltBar").style.width = `${clamp(player.ult, 0, 100)}%`;
      $("playerUltText").textContent = `${Math.floor(player.ult)} / 100`;
      $("playerXpBar").style.width = `${(player.xp / player.xpToNext) * 100}%`;
      $("playerXpText").textContent = `${player.xp} / ${player.xpToNext}`;
      const playerCastPct = game.prompt ? clamp((game.typedIndex / game.prompt.word.length) * 100, 0, 100) : 0;
      $("playerCastBar").style.width = `${playerCastPct}%`;
      $("playerCastText").textContent = `${Math.floor(playerCastPct)}%`;

      $("enemyHpBar").style.width = `${(enemy.hp / enemy.maxHp) * 100}%`;
      $("enemyHpText").textContent = `${Math.ceil(enemy.hp)} / ${enemy.maxHp}`;
      const castPct = enemy.intent ? clamp((enemy.intent.elapsed / enemy.intent.duration) * 100, 0, 100) : 0;
      $("enemyCastBar").style.width = `${castPct}%`;
      $("enemyCastText").textContent = enemy.intent ? `${Math.floor(castPct)}%` : "0%";

      $("level").textContent = player.level;
      $("combo").textContent = game.combo;
      $("maxCombo").textContent = game.maxCombo;
      $("score").textContent = game.score;
      $("kills").textContent = game.kills;
      $("wave").textContent = game.wave;
      $("damageValue").textContent = `${getCurrentAttackPower()}${game.fever > 0 ? "🔥" : ""}`;
      $("critValue").textContent = `${Math.floor(getCritRate() * 100)}% / ${Math.floor(getCritDamage() * 100)}%`;

      $("enemyName").textContent = enemy.isBoss ? `Boss | ${enemy.name}` : enemy.name;
      $("enemyChar").textContent = enemy.emoji;
      $("enemyChar").classList.toggle("boss-aura", enemy.isBoss);

      const bannerItems = [];
      if (game.fever > 0) bannerItems.push(`<span class="fever-banner">FEVER ${Math.ceil(game.fever / 1000)}s</span>`);
      if (isUltimateReady()) bannerItems.push(`<span class="ult-ready-banner">⚡ 奧義可施放　Space</span>`);
      $("feverBanner").innerHTML = bannerItems.join(" ");
      $("playerChar").classList.toggle("pulse-fever", game.fever > 0);
      $("soundBtn").textContent = game.soundOn ? "音效：開" : "音效：關";
      $("pauseBtn").textContent = game.paused ? "繼續" : "暫停";
      $("modeValue").textContent = game.mode === "timed" ? "限時" : "無盡";

      if (game.mode === "timed") {
        $("timeText").textContent = formatMs(game.timeLeftMs);
        $("timeBar").style.width = `${clamp(game.timeLeftMs / TIMED_LIMIT_MS, 0, 1) * 100}%`;
      } else {
        $("timeText").textContent = "∞";
        $("timeBar").style.width = "100%";
      }
    }

    function resetCombo(reason = "", cause = "other") {
      const hadCombo = game.combo > 0;
      debugLog("resetCombo", { reason, cause, hadCombo });
      if (hadCombo && reason) setMessage(reason);
      if (hadCombo && cause !== "enemy" && player.furyRecoilOnComboBreak) {
        player.furyComboCritRateBonus = 0;
        const recoil = Math.max(1, Math.floor(player.maxHp * 0.05));
        player.hp = clamp(player.hp - recoil, 0, player.maxHp);
        floatText($("playerChar"), `反噬 -${recoil}`, "damage-blue");
        if (player.hp <= 0) {
          endGame("狂戰反噬擊倒了你");
        }
      }
      game.combo = 0;
      game.feverLockedUntilReset = false;
      updateUI();
    }

    function consumeGuardianSpecialBlock(skillLabel = "", preventedDamage = 0) {
      if (!player.guardianSpecialBlockReady) return false;
      player.guardianSpecialBlockReady = false;
      const shieldGain = Math.max(1, Math.floor(preventedDamage * 0.3));
      debugLog("consumeGuardianSpecialBlock", { skillLabel, preventedDamage, shieldGain });
      floatText($("playerChar"), "抵擋", "shield-cyan");
      if (shieldGain > 0) addShield(shieldGain);
      setMessage(skillLabel
        ? `守護 III 抵擋了 ${skillLabel} 的斷連，並獲得 ${shieldGain} 護盾。`
        : `守護 III 抵擋了特殊斷連，並獲得 ${shieldGain} 護盾。`);
      updateUI();
      return true;
    }

    function applyTalent(id) {
      if (id === "dmgUp") player.baseDamage += 3;
      if (id === "critUp") player.critRateBase += 0.06;
      if (id === "hpUp") { player.maxHp += 20; player.hp = clamp(player.hp + 20, 0, player.maxHp); }
      if (id === "shieldUp") { player.maxShield += 16; player.shield = clamp(player.shield + 16, 0, player.maxShield); }
      if (id === "ultUp") player.ult = clamp(player.ult + 25, 0, 100);
      if (id === "comboUp") game.comboScaleBonus += 0.4;
    }

    function setTalentOverlayHeader(title, subtitle) {
      const card = $("talentOverlay").querySelector(".overlay-card");
      if (!card) return;
      const titleEl = card.querySelector("h3");
      const subEl = card.querySelector(".small-muted");
      if (titleEl) titleEl.textContent = title;
      if (subEl) subEl.textContent = subtitle;
    }

    function getTalentPointsUsed() {
      return Object.values(game.talentTreeLevels).reduce((sum, lv) => sum + lv, 0);
    }

    function getTalentPointsLeft() {
      return Math.max(0, TALENT_PRESET_POINTS - getTalentPointsUsed());
    }

    function applyTalentTreeBonusesFromPreset() {
      const furyLv = game.talentTreeLevels.fury || 0;
      const arcaneLv = game.talentTreeLevels.arcane || 0;
      const guardianLv = game.talentTreeLevels.guardian || 0;

      if (furyLv >= 1) player.baseDamage += 2;
      if (furyLv >= 2) player.critRateBase += 0.08;
      if (furyLv >= 3) player.critDamageBonus += 0.30;
      if (furyLv >= 4) {
        player.furyRecoilOnComboBreak = true;
        player.furyComboCritRateEnabled = true;
      }

      if (arcaneLv >= 1) player.ultGainMul += 0.12;
      if (arcaneLv >= 2) game.feverTriggerCombo -= 1;
      if (arcaneLv >= 3) player.arcaneUltFeverEnabled = true;
      if (arcaneLv >= 4) player.arcaneFeverWordsEnabled = true;

      if (guardianLv >= 1) player.maxHp += 20;
      if (guardianLv >= 2) player.damageReduction = clamp(player.damageReduction + 0.05, 0, 0.45);
      if (guardianLv >= 3) player.guardianSpecialBlockReady = false;
      if (guardianLv >= 4) player.guardianShieldThornsEnabled = true;
    }

    function changeTalentPreset(branch, delta) {
      if (game.started && !game.over) {
        setMessage("戰鬥中不能調整天賦，請先結束本場。");
        return;
      }
      const current = game.talentTreeLevels[branch] || 0;
      const maxLv = TALENT_TREES[branch].nodes.length;
      if (delta > 0) {
        if (current >= maxLv) return;
        if (getTalentPointsLeft() <= 0) return;
      }
      if (delta < 0 && current <= 0) return;
      game.talentTreeLevels[branch] = clamp(current + delta, 0, maxLv);
      renderHeroTalentConfig();
      if (!game.started) resetPlayerState();
      updateUI();
    }

    function renderHeroTalentConfig() {
      const grid = $("heroTalentConfig");
      const summary = $("heroTalentSummary");
      const effects = $("heroTalentEffects");
      if (!grid || !summary || !effects) return;
      const used = getTalentPointsUsed();
      summary.textContent = `天賦點數：${used} / ${TALENT_PRESET_POINTS}`;
      grid.innerHTML = "";
      effects.innerHTML = "";

      Object.entries(TALENT_TREES).forEach(([branch, tree]) => {
        const lv = game.talentTreeLevels[branch] || 0;
        const next = tree.nodes[lv];
        const card = document.createElement("div");
        card.className = "hero-talent-card";
        card.innerHTML = `
          <div class="hero-talent-title">${tree.name}</div>
          <div class="hero-talent-level">Lv ${lv} / ${tree.nodes.length}</div>
          <div class="hero-talent-node">${next ? `下一階：${next.name} - ${next.desc}` : "已達最高階"}</div>
          <div class="hero-talent-controls">
            <button class="btn btn-sm btn-outline-light" data-tree-op="minus">-</button>
            <button class="btn btn-sm btn-outline-info" data-tree-op="plus">+</button>
          </div>
        `;
        card.querySelector('[data-tree-op="minus"]').onclick = () => changeTalentPreset(branch, -1);
        card.querySelector('[data-tree-op="plus"]').onclick = () => changeTalentPreset(branch, 1);
        grid.appendChild(card);

        const side = document.createElement("div");
        side.className = "hero-talent-branch";
        const listItems = tree.nodes.map((node, i) => {
          const cls = i < lv ? "active" : "inactive";
          return `<li class="hero-talent-node-item ${cls}">${node.name}：${node.desc}</li>`;
        }).join("");
        side.innerHTML = `
          <div class="hero-talent-branch-title">${tree.name}</div>
          <ol class="hero-talent-node-list">${listItems}</ol>
        `;
        effects.appendChild(side);
      });
      renderHeroLoadoutPreview();
    }

    function continueUpgradeFlowOrResume() {
      if (game.pendingSkillChoices > 0) {
        game.waitingTalent = false;
        openTalentSelection();
        return;
      }

      $("talentOverlay").classList.remove("show");
      game.waitingTalent = false;
      game.paused = false;
      updateUI();
      game.lastTick = performance.now();
      cancelAnimationFrame(game.loopId);
      game.loopId = requestAnimationFrame(gameLoop);
    }

    function openTalentSelection() {
      if (game.over || game.pendingSkillChoices <= 0) return;
      game.waitingTalent = true;
      game.paused = true;
      $("talentOverlay").classList.add("show");
      setTalentOverlayHeader("等級提升", "選擇一個技能。此時遊戲與限時倒數都會暫停。");
      const grid = $("talentGrid");
      grid.innerHTML = "";
      const options = [...TALENTS].sort(() => Math.random() - 0.5).slice(0, 3);
      options.forEach((opt) => {
        const card = document.createElement("div");
        card.className = "talent-card";
        card.innerHTML = `<h4>${opt.name}</h4><p>${opt.desc}</p>`;
        card.onclick = () => {
          applyTalent(opt.id);
          game.pendingSkillChoices = Math.max(0, game.pendingSkillChoices - 1);
          setMessage(`你學會了 ${opt.name}。`);
          continueUpgradeFlowOrResume();
        };
        grid.appendChild(card);
      });
    }

    function giveXp(amount) {
      player.xp += amount;
      let levelUpCount = 0;
      while (player.xp >= player.xpToNext) {
        player.xp -= player.xpToNext;
        player.level += 1;
        player.xpToNext += XP_GROWTH_PER_LEVEL;
        sfxLevel();
        levelUpCount += 1;
      }
      if (levelUpCount > 0) {
        game.pendingSkillChoices += levelUpCount;
        if (!game.waitingTalent) openTalentSelection();
      }
    }

    function healPlayer(percent, flat = 0) {
      const amount = Math.floor((player.maxHp * percent + flat) * getSustainMultiplier());
      player.hp = clamp(player.hp + amount, 0, player.maxHp);
      spawnBurstAt($("playerChar"), "heal-pulse");
      floatText($("playerChar"), `+${amount}`, "heal-green");
      sfxHeal();
    }

    function addShield(amount) {
      const gain = Math.floor(amount * getSustainMultiplier());
      player.shield = clamp(player.shield + gain, 0, player.maxShield);
      spawnBurstAt($("playerChar"), "shield-ring");
      floatText($("playerChar"), `+${gain} 護盾`, "shield-cyan");
    }

    function calcFlatCritDamage(base, critRateScale = 1, critDamageScale = 1) {
      let dmg = Math.max(0, Math.floor(base));
      const isCrit = Math.random() < clamp(getCritRate() * critRateScale, 0, 1);
      if (isCrit) dmg = Math.floor(dmg * getCritDamage() * critDamageScale);
      return { damage: dmg, isCrit };
    }

    function damagePlayer(amount, sourceText = "") {
      const hpBefore = player.hp;
      const shieldBefore = player.shield;
      let remaining = Math.max(1, Math.floor(amount * (1 - player.damageReduction)));
      if (player.shield > 0) {
        const absorbed = Math.min(player.shield, remaining);
        player.shield -= absorbed;
        remaining -= absorbed;
        if (absorbed > 0) floatText($("playerChar"), `格擋 ${absorbed}`, "shield-cyan");
        if (absorbed > 0 && player.guardianShieldThornsEnabled && !game.over && enemy.hp > 0) {
          const reflect = calcFlatCritDamage(absorbed * 0.3);
          damageEnemy(reflect.damage, reflect.isCrit, "guardian-reflect");
          setMessage(`護盾反震造成 ${reflect.damage} 點反傷${reflect.isCrit ? "，並觸發暴擊" : ""}。`);
        }
      }
      if (remaining > 0) {
        player.hp = clamp(player.hp - remaining, 0, player.maxHp);
        floatText($("playerChar"), `-${remaining}`, "damage-blue");
        sfxHit();
      }
      animateChar("playerChar", "hit");
      shakeScreen();
      debugLog("damagePlayer", {
        amount,
        sourceText,
        hpBefore,
        hpAfter: player.hp,
        shieldBefore,
        shieldAfter: player.shield,
        remainingDamage: remaining
      });
      if (player.hp <= 0) {
        endGame("你被擊倒了");
      } else if (sourceText) {
        setMessage(sourceText);
      }
    }
    function damageEnemy(amount, isCrit = false, source = "player") {
      const enemyHpBefore = enemy.hp;
      enemy.hp = clamp(enemy.hp - amount, 0, enemy.maxHp);
      debugLog("damageEnemy", { amount, isCrit, source, enemyHpBefore, enemyHpAfter: enemy.hp });
      animateChar("enemyChar", "hit");
      floatText($("enemyChar"), isCrit ? `CRIT -${amount}` : `-${amount}`, isCrit ? "crit-gold" : "damage-red");
      if (isCrit) sfxCrit();
      else sfxHit();
      if (source === "player" && game.selectedHero.id === "knight" && amount > 0 && !game.over) {
        addShield(Math.max(1, Math.floor(amount * 0.15)));
      }
      if (enemy.isBoss && !enemy.enrage && enemy.hp <= enemy.maxHp * 0.3) {
        enemy.enrage = true;
        enemy.castSpeedMul = 1.16;
        setMessage(`Boss ${enemy.name} 進入狂暴，攻勢加速。`);
      }
    }

    function calcDamage(base, skillCritScale = 1, critRateScale = 1) {
      let dmg = base + Math.floor(game.combo * (1.45 + game.comboScaleBonus));
      if (game.fever > 0) dmg = Math.floor(dmg * 1.5);
      const isCrit = Math.random() < clamp(getCritRate() * critRateScale, 0, 1);
      if (isCrit) dmg = Math.floor(dmg * getCritDamage() * skillCritScale);
      return { damage: dmg, isCrit };
    }

    function tryDropItem() {
      if (Math.random() > 0.34) return;
      const roll = Math.random();
      let itemText = "";
      if (roll < 0.33) { player.ult = clamp(player.ult + 18, 0, 100); itemText = "秘能球：奧義 +18"; }
      else if (roll < 0.66) {
        const gain = Math.floor(14 * getSustainMultiplier());
        player.shield = clamp(player.shield + gain, 0, player.maxShield);
        itemText = `護核：護盾 +${gain}`;
      }
      else { player.hp = clamp(player.hp + 12, 0, player.maxHp); itemText = "藥劑：HP +12"; }
      spawnBurstAt($("playerChar"), "item-burst");
      floatText($("playerChar"), itemText, "crit-gold");
      setMessage(`獲得掉落：${itemText}`);
    }

    function onEnemyDefeated() {
      if (game.waitingSpawn || game.over) return;
      game.waitingSpawn = true;
      game.kills += 1;
      game.score += enemy.isBoss ? 180 : 55;
      $("enemyChar").classList.add("char-dead");
      const healPct = game.mode === "timed"
        ? (enemy.isBoss ? 0.36 : 0.24)
        : (enemy.isBoss ? 0.3 : 0.18);
      healPlayer(healPct);
      player.ult = clamp(player.ult + (enemy.isBoss ? 26 : 15) + player.arcaneKillUltBonus, 0, 100);
      giveXp(enemy.isBoss ? 84 : 36);
      tryDropItem();
      setMessage(enemy.isBoss ? `Boss 已擊倒，回復 ${Math.floor(healPct * 100)}% HP。` : `敵人已擊倒，回復 ${Math.floor(healPct * 100)}% HP。`);
      scheduleGameTimeout(() => {
        if (!game.over) {
          spawnEnemy();
          game.waitingSpawn = false;
        }
      }, 1000);
    }

    function castSpell() {
      if (!game.prompt || game.over || game.waitingSpawn) return;
      const { type, word } = game.prompt;
      const heroId = game.selectedHero.id;
      const attackPower = getCurrentAttackPower();
      let scoreGain = 8;
      let critResult = false;
      animateChar("playerChar", "attack-forward");

      if (type === "fire") {
        spawnProjectile("playerChar", "enemyChar", "fireball");
        const r = calcDamage(player.baseDamage + 6, 1.0);
        damageEnemy(r.damage, r.isCrit);
        critResult = r.isCrit;
        player.ult += 16 * player.ultGainMul;
        scoreGain = r.damage;
        setMessage(`${word.toUpperCase()} 命中。`);
      }

      if (type === "bolt") {
        spawnLightning("enemyChar");
        const r = calcDamage(player.baseDamage + 10, 1.1);
        damageEnemy(r.damage, r.isCrit);
        critResult = r.isCrit;
        player.ult += 18 * player.ultGainMul;
        scoreGain = r.damage + 4;
        setMessage(`${word.toUpperCase()} 雷擊爆發。`);
      }

      if (type === "slash") {
        spawnSlash("playerChar", "enemyChar");
        const first = calcDamage(player.baseDamage + 4, 1.0);
        damageEnemy(first.damage, first.isCrit);
        critResult = first.isCrit;
        player.ult += 14 * player.ultGainMul;
        scoreGain = first.damage;
        const followUpChance = 0.35;
        if (Math.random() < followUpChance) {
          scheduleGameTimeout(() => {
            if (game.over || enemy.hp <= 0) return;
            const second = calcDamage(8 + Math.floor(player.level / 4), 0.9);
            damageEnemy(second.damage, second.isCrit);
            updateUI();
            if (enemy.hp <= 0) onEnemyDefeated();
          }, 120);
          setMessage(`${word.toUpperCase()} 觸發追擊。`);
        } else {
          setMessage(`${word.toUpperCase()} 斬擊命中。`);
        }
      }

      if (type === "heal") {
        healPlayer(0.18, Math.floor(game.combo * 1.2));
        player.ult += 10 * player.ultGainMul;
        scoreGain = 12;
        setMessage(`${word.toUpperCase()} 回復生命。`);
      }

      if (type === "guard") {
        addShield(18 + Math.floor(game.combo * 1.35));
        if (heroId === "knight") {
          healPlayer(0, Math.max(4, Math.floor(attackPower * 0.28)));
        }
        player.ult += 8 * player.ultGainMul;
        scoreGain = 10;
        setMessage(heroId === "knight"
          ? `${word.toUpperCase()} 啟動聖盾加護（護盾+回血）。`
          : `${word.toUpperCase()} 建立護盾。`);
      }

      if (type === "ultimate") {
        sfxUltimate();
        const meteorCount = enemy.isBoss ? 6 : 4;
        spawnMeteorStorm("enemyChar", meteorCount);
        player.ult = 0;
        scoreGain = 86;
        if (heroId === "mage") setMessage(`${word.toUpperCase()} 啟動 Astral Cataclysm。`);
        else if (heroId === "knight") setMessage(`${word.toUpperCase()} 啟動 Aegis Judgment。`);
        else if (heroId === "assassin") setMessage(`${word.toUpperCase()} 啟動 Phantom Execution。`);
        else setMessage(`${word.toUpperCase()} 召喚流星雨。`);
        scheduleGameTimeout(() => {
          if (game.over) return;
          let total = 0;
          const hits = enemy.isBoss ? 4 : 3;
          for (let i = 0; i < hits; i++) {
            const critRateScale = heroId === "mage" ? 2 : 1;
            total += calcDamage(player.baseDamage + 18, 1.08, critRateScale).damage;
          }
          if (heroId === "knight") {
            addShield(Math.max(18, Math.floor(attackPower * 1.9)));
            healPlayer(0, Math.max(8, Math.floor(attackPower * 0.95)));
          }
          if ((game.talentTreeLevels.guardian || 0) >= 3) {
            player.guardianSpecialBlockReady = true;
          }
          if (player.arcaneUltFeverEnabled) {
            player.arcaneUltFeverCounter += 1;
            if (player.arcaneUltFeverCounter % 2 === 0 && Math.random() < 0.5) {
              startFever("祕法共鳴引爆，進入 FEVER。");
            }
          }
          damageEnemy(total, true);
          updateUI();
          if (enemy.hp <= 0) onEnemyDefeated();
          else if (!game.over && !game.waitingSpawn) {
            generatePrompt();
            setMessage("奧義結束，下一個法術已準備。");
          }
        }, 620);
      }

      player.ult = clamp(player.ult, 0, 100);
      game.score += scoreGain + (critResult ? 8 : 0);
      game.combo += 1;
      if (player.furyComboCritRateEnabled) {
        player.furyComboCritRateBonus = clamp(player.furyComboCritRateBonus + 0.05, 0, 1);
      }
      if (game.combo > game.maxCombo) game.maxCombo = game.combo;
      if (!game.feverLockedUntilReset && game.combo >= getFeverTriggerCombo() && game.fever <= 0) {
        startFever();
      }

      if (type !== "ultimate") {
        if (enemy.hp <= 0) onEnemyDefeated();
        else if (!game.over && !game.waitingSpawn) generatePrompt();
      }
      updateUI();
    }

    function applyShieldBreak(extra = 0) {
      const crush = Math.min(player.shield, 10 + extra + Math.floor(enemy.level * 0.25));
      if (crush > 0) {
        player.shield = Math.max(0, player.shield - crush);
        floatText($("playerChar"), `護盾破壞 ${crush}`, "shield-cyan");
      }
    }

    function enemyAttackBasic() {
      spawnProjectile("enemyChar", "playerChar", "darkball");
      animateChar("enemyChar", "attack-backward");
      scheduleGameTimeout(() => {
        if (game.over) return;
        const dmg = enemy.damageBase + rand(5) + Math.floor(enemy.level * 0.78);
        damagePlayer(dmg, `${enemy.name} 使用暗影彈。`);
        resetCombo("被敵方攻擊，連擊中斷。", "enemy");
        updateUI();
      }, 240);
    }

    function enemyAttackQuick() {
      animateChar("enemyChar", "attack-backward");
      spawnSlash("enemyChar", "playerChar");
      scheduleGameTimeout(() => {
        if (game.over) return;
        damagePlayer(enemy.damageBase + 2 + rand(4), `${enemy.name} 快速突襲。`);
        resetCombo("快攻打亂了你的節奏。", "enemy");
        scheduleGameTimeout(() => {
          if (game.over) return;
          damagePlayer(Math.floor((enemy.damageBase + rand(4)) * 0.8), `${enemy.name} 追加第二擊。`);
          updateUI();
        }, 160);
      }, 180);
    }

    function setIntent(type, label, duration) {
      animateChar("enemyChar", "charge-glow");
      enemy.intent = { type, label, duration, elapsed: 0 };
      $("enemyStatus").textContent = `蓄力：${label}`;
      setMessage(`${enemy.name} 正在準備 ${label}。`);
      updateUI();
    }

    function enemyAttackHeavy() { setIntent("heavy", "Dark Nova", Math.max(760, (enemy.isBoss ? 1320 : 1450) / enemy.castSpeedMul)); }
    function enemyAttackPoison() { setIntent("poison", "Venom Burst", Math.max(760, 1250 / enemy.castSpeedMul)); }
    function enemyAttackDrain() { setIntent("drain", "Soul Drain", Math.max(700, 1220 / enemy.castSpeedMul)); }
    function enemyAttackBreak() { setIntent("break", "Shield Shatter", Math.max(720, 1180 / enemy.castSpeedMul)); }
    function enemyAttackInterrupt() { setIntent("interrupt", "Mind Spike", Math.max(700, 1150 / enemy.castSpeedMul)); }
    function enemyAttackBossMeteor() { setIntent("bossMeteor", "Apocalypse Rain", Math.max(900, 1700 / enemy.castSpeedMul)); }

    function resolveEnemyIntent() {
      if (!enemy.intent || game.over) return;
      const t = enemy.intent.type;
      const intentLabel = enemy.intent.label;
      $("enemyChar").classList.remove("charge-glow");

      if (t === "heavy") {
        spawnLightning("playerChar");
        animateChar("enemyChar", "attack-backward");
        scheduleGameTimeout(() => {
          if (game.over) return;
          const dmg = enemy.damageBase + 10 + rand(6) + Math.floor(enemy.level * 1.16);
          damagePlayer(dmg, `${enemy.name} 施放 ${intentLabel}。`);
          if (!consumeGuardianSpecialBlock(intentLabel, dmg)) resetCombo("重擊命中，連擊中斷。", "enemy");
          updateUI();
        }, 170);
      }

      if (t === "poison") {
        spawnProjectile("enemyChar", "playerChar", "darkball");
        scheduleGameTimeout(() => {
          if (game.over) return;
          const dmg = enemy.damageBase + 6 + rand(4);
          damagePlayer(dmg, `${enemy.name} 的毒爆命中。`);
          if (!consumeGuardianSpecialBlock(intentLabel, dmg)) resetCombo("毒爆讓你斷連。", "enemy");
          let ticks = enemy.isBoss ? 3 : 3;
          scheduleGameInterval((intervalId) => {
            if (game.over || ticks <= 0) {
              clearInterval(intervalId);
              activeGameIntervals.delete(intervalId);
              return;
            }
            ticks--;
            damagePlayer(4 + Math.floor(enemy.level * 0.4), "中毒持續掉血。");
            updateUI();
          }, 780);
          updateUI();
        }, 170);
      }

      if (t === "drain") {
        spawnProjectile("enemyChar", "playerChar", "darkball");
        scheduleGameTimeout(() => {
          if (game.over) return;
          const dmg = enemy.damageBase + 7 + rand(5);
          damagePlayer(dmg, `${enemy.name} 吸取你的生命。`);
          const heal = Math.floor(dmg * (enemy.isBoss ? 0.42 : 0.38));
          enemy.hp = clamp(enemy.hp + heal, 0, enemy.maxHp);
          floatText($("enemyChar"), `+${heal}`, "heal-green");
          if (!consumeGuardianSpecialBlock(intentLabel, dmg)) resetCombo("生命吸取破壞了你的節奏。", "enemy");
          updateUI();
        }, 170);
      }

      if (t === "break") {
        spawnSlash("enemyChar", "playerChar");
        scheduleGameTimeout(() => {
          if (game.over) return;
          applyShieldBreak(enemy.isBoss ? 5 : 4);
          const dmg = enemy.damageBase + 5 + rand(4);
          damagePlayer(dmg, `${enemy.name} 使用破盾斬。`);
          if (!consumeGuardianSpecialBlock(intentLabel, dmg)) resetCombo("護盾被破壞，連擊中斷。", "enemy");
          updateUI();
        }, 170);
      }

      if (t === "interrupt") {
        spawnLightning("playerChar");
        scheduleGameTimeout(() => {
          if (game.over) return;
          const dmg = enemy.damageBase + 3 + rand(4);
          damagePlayer(dmg, `${enemy.name} 使用心靈尖刺。`);
          const ultLoss = 14 + Math.floor(enemy.level * 0.35);
          player.ult = Math.max(0, player.ult - ultLoss);
          game.typedIndex = 0;
          renderPrompt();
          if (!consumeGuardianSpecialBlock(intentLabel, dmg)) resetCombo(`奧義被干擾，損失 ${ultLoss}。`, "enemy");
          updateUI();
        }, 170);
      }

      if (t === "bossMeteor") {
        spawnMeteorStorm("playerChar", 5);
        animateChar("enemyChar", "attack-backward");
        scheduleGameTimeout(() => {
          if (game.over) return;
          const dmg = enemy.damageBase + 14 + rand(8) + Math.floor(enemy.level * 1.15);
          damagePlayer(dmg, `Boss ${enemy.name} 施放 Apocalypse Rain。`);
          if (!consumeGuardianSpecialBlock(intentLabel, dmg)) resetCombo("Boss 大招打碎了連擊。", "enemy");
          updateUI();
        }, 700);
      }

      enemy.intent = null;
      $("enemyStatus").textContent = enemy.isBoss ? "Boss 觀察中..." : "敵人伺機而動...";
    }

    function weightedPick(table) {
      const entries = Object.entries(table);
      let total = 0;
      for (const [, w] of entries) total += w;
      let r = Math.random() * total;
      for (const [k, w] of entries) {
        r -= w;
        if (r <= 0) return k;
      }
      return entries[entries.length - 1][0];
    }

    function adjustedAiTable() {
      const t = { ...enemy.aiTable };
      if (player.hp <= player.maxHp * 0.35) { t.heavy = (t.heavy || 0) + 0.16; t.quick = (t.quick || 0) + 0.1; }
      if (player.shield >= player.maxShield * 0.45) t.break = (t.break || 0) + 0.2;
      if (game.combo >= 6 || player.ult >= 85) t.interrupt = (t.interrupt || 0) + 0.24;
      const scaling = Math.min(0.5, game.wave * 0.018);
      t.heavy = (t.heavy || 0) + scaling;
      t.quick = (t.quick || 0) + scaling * 0.7;
      return t;
    }

    function chooseEnemyAction() {
      if (game.over || game.waitingSpawn || enemy.hp <= 0 || game.paused) return;
      const action = weightedPick(adjustedAiTable());
      debugLog("chooseEnemyAction", { action });
      if (action === "basic") enemyAttackBasic();
      else if (action === "quick") enemyAttackQuick();
      else if (action === "heavy") enemyAttackHeavy();
      else if (action === "poison") enemyAttackPoison();
      else if (action === "drain") enemyAttackDrain();
      else if (action === "break") enemyAttackBreak();
      else if (action === "interrupt") enemyAttackInterrupt();
      else if (action === "bossMeteor") enemyAttackBossMeteor();
      else enemyAttackBasic();

      const baseCd = game.mode === "timed"
        ? (enemy.isBoss ? 2280 : 2420)
        : (enemy.isBoss ? 2060 : 2200);
      const progressSpeed = game.mode === "timed"
        ? Math.min(700, game.wave * 23)
        : Math.min(840, game.wave * 28);
      enemy.cooldownMax = Math.max(760, (baseCd - progressSpeed) / enemy.castSpeedMul);
      enemy.cooldown = enemy.cooldownMax;
    }

    function getEnemyPowerScale() {
      const base = game.mode === "timed"
        ? (1 + game.kills * 0.045)
        : (1 + game.kills * 0.055);
      return game.mode === "endless" ? base + player.level * 0.03 : base;
    }

    function spawnEnemy() {
      const bossEvery = game.mode === "timed" ? 6 : 5;
      const isBoss = game.kills > 0 && game.kills % bossEvery === 0;
      enemy.isBoss = isBoss;
      enemy.enrage = false;
      enemy.castSpeedMul = 1;
      const scale = getEnemyPowerScale();
      const hpModeMul = game.mode === "timed" ? 0.9 : 1;
      const dmgModeMul = game.mode === "timed" ? 0.86 : 1;

      if (isBoss) {
        const boss = choice(BOSSES);
        enemy.name = boss.name;
        enemy.emoji = boss.emoji;
        enemy.level = Math.floor(game.kills / bossEvery) + 1;
        enemy.maxHp = Math.floor((200 + game.kills * 24) * boss.hpMul * scale * hpModeMul);
        enemy.damageBase = Math.floor((13 + game.kills * 0.92) * boss.dmgMul * (1 + game.wave * 0.02) * dmgModeMul);
        enemy.aiTable = { ...boss.ai };
        sfxBoss();
      } else {
        const mob = choice(ENEMY_ARCHETYPES);
        enemy.name = mob.name;
        enemy.emoji = mob.emoji;
        enemy.level = game.kills + 1;
        enemy.maxHp = Math.floor((90 + game.kills * 12) * mob.hpMul * scale * hpModeMul);
        enemy.damageBase = Math.floor((8 + game.kills * 0.58) * mob.dmgMul * (1 + game.wave * 0.015) * dmgModeMul);
        enemy.aiTable = { ...mob.ai };
      }

      enemy.hp = enemy.maxHp;
      enemy.intent = null;
      const baseCd = game.mode === "timed"
        ? (enemy.isBoss ? 2280 : 2420)
        : (enemy.isBoss ? 2060 : 2200);
      const progressSpeed = game.mode === "timed"
        ? Math.min(700, game.wave * 23)
        : Math.min(840, game.wave * 28);
      enemy.cooldownMax = Math.max(760, (baseCd - progressSpeed) / enemy.castSpeedMul);
      enemy.cooldown = enemy.cooldownMax;

      $("enemyChar").classList.remove("char-dead", "charge-glow");
      animateChar("enemyChar", "spawn-flash");
      $("enemyStatus").textContent = enemy.isBoss ? "Boss 降臨" : "敵人出現";
      game.wave = game.kills + 1;
      generatePrompt();
      updateUI();
    }

    function resetPlayerState() {
      applyHero(game.selectedHero);
      player.ult = 0;
      applyTalentTreeBonusesFromPreset();
      player.hp = player.maxHp;
      player.shield = 0;
      player.level = 1;
      player.xp = 0;
      player.xpToNext = XP_INITIAL_REQUIREMENT;
    }

    function startGame() {
      game.playerName = sanitizeName(game.playerName);
      initAudio();
      clearGameAsyncs();
      game.runId += 1;
      game.started = true;
      game.over = false;
      game.paused = false;
      game.waitingSpawn = false;
      game.waitingTalent = false;
      game.score = 0;
      game.wave = 1;
      game.kills = 0;
      game.combo = 0;
      game.maxCombo = 0;
      game.fever = 0;
      game.prompt = null;
      game.typedIndex = 0;
      game.comboScaleBonus = 0;
      game.feverTriggerCombo = 7;
      game.feverDurationBaseMs = 7000;
      game.feverLockedUntilReset = false;
      game.pendingSkillChoices = 0;
      game.timeLeftMs = TIMED_LIMIT_MS;

      resetPlayerState();
      $("playerChar").classList.remove("char-dead");
      $("enemyChar").classList.remove("char-dead", "boss-aura");
      $("talentOverlay").classList.remove("show");
      $("pauseOverlay").classList.remove("show");
      $("heroOverlay").classList.remove("show");
      $("leaderboardOverlay").classList.remove("show");

      spawnEnemy();
      debugLog("startGame", { playerName: game.playerName, hero: game.selectedHero.id, talents: { ...game.talentTreeLevels } });
      setMessage(game.mode === "timed" ? `戰鬥開始，${game.playerName}。限時 2:30！` : `戰鬥開始，${game.playerName}。無盡模式挑戰極限！`);
      updateUI();

      cancelAnimationFrame(game.loopId);
      game.lastTick = performance.now();
      game.loopId = requestAnimationFrame(gameLoop);
    }

    function resetGame() {
      clearGameAsyncs();
      game.runId += 1;
      game.started = false;
      game.over = false;
      game.paused = false;
      game.waitingSpawn = false;
      game.waitingTalent = false;
      game.score = 0;
      game.wave = 1;
      game.kills = 0;
      game.combo = 0;
      game.maxCombo = 0;
      game.fever = 0;
      game.prompt = null;
      game.typedIndex = 0;
      game.comboScaleBonus = 0;
      game.feverTriggerCombo = 7;
      game.feverDurationBaseMs = 7000;
      game.feverLockedUntilReset = false;
      game.pendingSkillChoices = 0;
      game.timeLeftMs = TIMED_LIMIT_MS;

      resetPlayerState();
      enemy.name = "Enemy";
      enemy.emoji = "👾";
      enemy.maxHp = 100;
      enemy.hp = 100;
      enemy.level = 1;
      enemy.isBoss = false;
      enemy.intent = null;
      enemy.cooldown = 1800;
      enemy.cooldownMax = 1800;
      enemy.damageBase = 8;
      enemy.aiTable = { basic: 1 };
      enemy.enrage = false;

      $("playerChar").classList.remove("char-dead", "pulse-fever");
      $("enemyChar").classList.remove("char-dead", "boss-aura", "charge-glow");
      $("playerStatus").textContent = "準備開始";
      $("enemyStatus").textContent = "等待開戰";
      $("typingBox").textContent = "---";
      $("feverBanner").innerHTML = "";
      $("talentOverlay").classList.remove("show");
      $("pauseOverlay").classList.remove("show");
      $("heroOverlay").classList.remove("show");
      $("leaderboardOverlay").classList.remove("show");
      setMessage("先輸入玩家名稱並選擇模式後開始。");
      debugLog("resetGame");
      updateUI();
      cancelAnimationFrame(game.loopId);
    }

    async function endGame(reason = "") {
      if (game.over) return;
      debugLog("endGame", { reason });
      game.over = true;
      game.started = false;
      clearGameAsyncs();
      $("playerChar").classList.add("char-dead");
      let title = game.mode === "timed" ? "限時模式結束" : "無盡模式結束";
      if (reason) title = `${title}：${reason}`;
      setMessage(`${title} | 分數 ${game.score} | 擊殺 ${game.kills} | 波次 ${game.wave}`);
      await saveScore();
      cancelAnimationFrame(game.loopId);
    }

    function togglePause() {
      if (!game.started || game.over || game.waitingTalent) return;
      game.paused = !game.paused;
      $("pauseOverlay").classList.toggle("show", game.paused);
      updateUI();
      if (!game.paused) {
        game.lastTick = performance.now();
        cancelAnimationFrame(game.loopId);
        game.loopId = requestAnimationFrame(gameLoop);
      }
    }

    function onKeyPress(e) {
      if (e.key === "Escape") {
        togglePause();
        return;
      }
      if (!game.started || game.over || game.waitingSpawn || game.waitingTalent || game.paused) return;
      if (e.code === "Space") {
        if (activateUltimatePrompt()) e.preventDefault();
        return;
      }
      if (!game.prompt) return;
      const key = e.key.toLowerCase();
      if (!(key.length === 1 && key >= "a" && key <= "z")) return;
      const expected = game.prompt.word[game.typedIndex];
      if (key === expected) {
        sfxCorrect();
        game.typedIndex += 1;
        renderPrompt();
        if (game.typedIndex >= game.prompt.word.length) castSpell();
        else setMessage(`正確：${key}`);
      } else {
        sfxWrong();
        game.typedIndex = 0;
        renderPrompt();
        resetCombo(`輸入錯誤：${key}，法術重置。`);
        animateChar("playerChar", "hit");
      }
      updateUI();
    }

    async function gameLoop(ts) {
      if (!game.started || game.over || game.paused || game.waitingTalent) return;
      const dt = ts - game.lastTick;
      game.lastTick = ts;

      if (game.fever > 0) game.fever = Math.max(0, game.fever - dt);

      if (game.mode === "timed") {
        game.timeLeftMs = Math.max(0, game.timeLeftMs - dt);
        if (game.timeLeftMs <= 0) {
          updateUI();
          debugLog("timeExpired");
          await endGame("時間到");
          return;
        }
      }

      if (!game.waitingSpawn && enemy.hp > 0) {
        if (enemy.intent) {
          enemy.intent.elapsed += dt;
          $("enemyStatus").textContent = `蓄力：${enemy.intent.label}`;
          if (enemy.intent.elapsed >= enemy.intent.duration) resolveEnemyIntent();
        } else {
          enemy.cooldown -= dt;
          const sec = Math.max(0, enemy.cooldown / 1000).toFixed(1);
          $("enemyStatus").textContent = enemy.isBoss ? `Boss ${sec}s 後攻擊` : `敵人 ${sec}s 後攻擊`;
          if (enemy.cooldown <= 0) chooseEnemyAction();
        }
      }

      updateUI();
      game.loopId = requestAnimationFrame(gameLoop);
    }

    async function syncLeaderboard() {
      await updateLeaderboard();
      if (game.remoteSyncState === "remote") setMessage("排行榜已與遠端 JSON 同步。");
      else if (game.remoteSyncState === "fallback") setMessage("遠端同步失敗，改用本機 JSON。");
      else setMessage("已讀取本機 JSON 排行榜。");
    }

    function bindSetupOverlay() {
      $("setupBtn").addEventListener("click", () => $("setupOverlay").classList.add("show"));
      $("closeSetupBtn").addEventListener("click", () => $("setupOverlay").classList.remove("show"));

      $("timedModeBtn").addEventListener("click", () => { game.mode = "timed"; setModeButtons(); });
      $("endlessModeBtn").addEventListener("click", () => { game.mode = "endless"; setModeButtons(); });

      $("saveSetupBtn").addEventListener("click", async () => {
        game.playerName = sanitizeName($("playerNameInput").value);
        $("playerNameInput").value = game.playerName;
        saveConfig();
        game.boardViewMode = game.mode;
        setBoardChips();
        await updateLeaderboard();
        $("setupOverlay").classList.remove("show");
        setMessage(`設定完成。玩家：${game.playerName}，模式：${game.mode === "timed" ? "限時" : "無盡"}。`);
        updateUI();
      });
    }

    document.addEventListener("keydown", onKeyPress);

    $("startBtn").addEventListener("click", () => {
      game.playerName = sanitizeName($("playerNameInput").value || game.playerName);
      $("playerNameInput").value = game.playerName;
      saveConfig();
      $("setupOverlay").classList.remove("show");
      startGame();
    });

    $("pauseBtn").addEventListener("click", togglePause);
    $("resumeBtn").addEventListener("click", togglePause);

    $("soundBtn").addEventListener("click", () => {
      game.soundOn = !game.soundOn;
      updateUI();
    });

    $("openHeroMenuBtn").addEventListener("click", () => {
      renderHeroTalentConfig();
      $("heroOverlay").classList.add("show");
      syncHeroPoolPreviewHeight();
    });
    $("closeHeroOverlayBtn").addEventListener("click", () => {
      $("heroOverlay").classList.remove("show");
    });
    $("resetTalentPresetBtn").addEventListener("click", () => {
      if (game.started && !game.over) {
        setMessage("戰鬥中不能重置天賦，請先結束本場。");
        return;
      }
      game.talentTreeLevels = { fury: 0, arcane: 0, guardian: 0 };
      renderHeroTalentConfig();
      if (!game.started) resetPlayerState();
      setMessage("已重置天賦配置。");
      updateUI();
    });

    $("openLeaderboardMenuBtn").addEventListener("click", async () => {
      $("leaderboardOverlay").classList.add("show");
      await syncLeaderboard();
    });
    $("closeLeaderboardOverlayBtn").addEventListener("click", () => {
      $("leaderboardOverlay").classList.remove("show");
    });

    document.querySelectorAll("[data-board-mode]").forEach((chip) => {
      chip.addEventListener("click", async () => {
        game.boardViewMode = chip.dataset.boardMode;
        setBoardChips();
        await updateLeaderboard();
      });
    });

    $("boardVersionSelect").addEventListener("change", async (e) => {
      game.boardViewVersion = e.target.value || GAME_VERSION;
      await updateLeaderboard();
    });

    bindSetupOverlay();
    initAnnouncement();
    loadConfig();
    renderHeroSelect();
    renderHeroTalentConfig();
    setModeButtons();
    setBoardChips();
    resetGame();
    updateLeaderboard();
    $("playerNameInput").value = game.playerName;
    window.addEventListener("resize", syncHeroPoolPreviewHeight);
