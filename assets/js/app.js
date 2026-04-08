const HEROES = [
      { id: "mage", name: "Arc Mage", emoji: "🧙", desc: "平衡輸出，奧義累積快", hp: 100, dmg: 12, crit: 0.12, shield: 50, ultGainMul: 1.15 },
      { id: "knight", name: "Spell Knight", emoji: "🛡️", desc: "高生存，長線穩定", hp: 128, dmg: 10, crit: 0.1, shield: 74, ultGainMul: 1.0 },
      { id: "assassin", name: "Rune Assassin", emoji: "⚔️", desc: "高暴擊，連擊成長快", hp: 92, dmg: 13, crit: 0.18, shield: 40, ultGainMul: 1.0 }
    ];

    const SPELL_GROUPS = {
      fire: ["fire", "flame", "blaze", "nova", "ember", "inferno"],
      bolt: ["bolt", "shock", "flash", "storm", "spark", "light"],
      slash: ["slash", "dash", "blade", "fang", "cleave", "cut"],
      heal: ["heal", "mend", "renew", "bloom", "vital", "cure"],
      guard: ["guard", "aegis", "shield", "wall", "ward", "barrier"],
      ultimate: ["meteor", "cataclysm", "supernova"]
    };

    const ENEMY_ARCHETYPES = [
      { id: "striker", name: "Rift Striker", emoji: "👹", hpMul: 1.0, dmgMul: 1.1, ai: { basic: 0.5, quick: 0.3, heavy: 0.2 } },
      { id: "warlock", name: "Night Warlock", emoji: "🧿", hpMul: 0.95, dmgMul: 1.05, ai: { basic: 0.3, poison: 0.32, drain: 0.22, heavy: 0.16 } },
      { id: "breaker", name: "Iron Breaker", emoji: "🪓", hpMul: 1.15, dmgMul: 0.98, ai: { basic: 0.3, break: 0.4, heavy: 0.3 } },
      { id: "trickster", name: "Hex Trickster", emoji: "🎭", hpMul: 1.0, dmgMul: 1.0, ai: { basic: 0.25, poison: 0.2, interrupt: 0.35, quick: 0.2 } }
    ];

    const BOSSES = [
      { id: "demon-lord", name: "Demon Lord", emoji: "😈", hpMul: 1.35, dmgMul: 1.2, ai: { bossMeteor: 0.34, heavy: 0.25, break: 0.15, drain: 0.12, quick: 0.14 } },
      { id: "sky-dragon", name: "Sky Dragon", emoji: "🐉", hpMul: 1.3, dmgMul: 1.22, ai: { bossMeteor: 0.3, quick: 0.23, heavy: 0.22, poison: 0.25 } },
      { id: "void-king", name: "Void King", emoji: "👑", hpMul: 1.42, dmgMul: 1.16, ai: { bossMeteor: 0.26, interrupt: 0.25, heavy: 0.24, drain: 0.25 } }
    ];

    const TALENTS = [
      { id: "dmgUp", name: "Power Surge", desc: "+3 基礎傷害" },
      { id: "critUp", name: "Deadly Focus", desc: "+6% 暴擊率" },
      { id: "hpUp", name: "Vital Core", desc: "+20 最大 HP 並回復 20" },
      { id: "shieldUp", name: "Barrier Mastery", desc: "+16 最大護盾並補 16" },
      { id: "ultUp", name: "Arcane Battery", desc: "奧義值 +25" },
      { id: "comboUp", name: "Combo Engine", desc: "連擊傷害成長提升" }
    ];

    const HERO_UNIQUE_SKILLS = {
      mage: {
        normal: "Arc Overload: 雷系附加追擊閃電",
        ultimate: "Astral Cataclysm: 流星強化、段數更多"
      },
      knight: {
        normal: "Fortress Guard: 防禦時額外護盾並小量回血",
        ultimate: "Aegis Judgment: 奧義同時給護盾與回復"
      },
      assassin: {
        normal: "Shadow Combo: 斬擊暴擊更高且追擊更容易",
        ultimate: "Phantom Execution: 高爆發多段斬擊"
      }
    };

    const STORAGE_KEY = "typing_battle_rankings_json_v2";
    const CONFIG_KEY = "typing_battle_rankings_config_v1";
    const TIMED_LIMIT_MS = 150000;
    const XP_INITIAL_REQUIREMENT = 90;
    const XP_GROWTH_PER_LEVEL = 30;
    const FIREBASE_DB_BASE_URL = "https://typing-master-6ece2-default-rtdb.asia-southeast1.firebasedatabase.app/";
    const FIREBASE_LEADERBOARD_PATH = "typing-battle/leaderboard";
    const FIREBASE_DEFAULT_JSON_URL = `${FIREBASE_DB_BASE_URL}${FIREBASE_LEADERBOARD_PATH}.json`;

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
      soundOn: true,
      playerName: "Player",
      mode: "timed",
      boardViewMode: "timed",
      timeLeftMs: TIMED_LIMIT_MS,
      remoteSyncState: "local"
    };

    const player = {
      maxHp: 100,
      hp: 100,
      shield: 0,
      maxShield: 50,
      ult: 0,
      critBase: 0.12,
      baseDamage: 12,
      ultGainMul: 1,
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

    function defaultBoard() {
      return {
        schema: "typing-battle.leaderboard.v1",
        updatedAt: null,
        timed: [],
        endless: []
      };
    }
    function normalizeBoard(raw) {
      const base = defaultBoard();
      if (!raw || typeof raw !== "object") return base;
      base.schema = typeof raw.schema === "string" ? raw.schema : base.schema;
      base.updatedAt = typeof raw.updatedAt === "string" ? raw.updatedAt : null;
      base.timed = Array.isArray(raw.timed) ? raw.timed : [];
      base.endless = Array.isArray(raw.endless) ? raw.endless : [];
      return base;
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
      let board = normalizeBoard(localRaw);
      game.remoteSyncState = "local";

      const remoteFetchUrl = getRemoteFetchUrl();
      if (!remoteFetchUrl) return board;

      try {
        const res = await fetch(remoteFetchUrl, { method: "GET", headers: getRemoteHeaders() });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const payload = data && data.record ? data.record : data;
        board = normalizeBoard(payload);
        if (payload == null) {
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
      } catch (_) {
        game.remoteSyncState = "fallback";
        updateConnBadge("warn");
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
      const modeRows = game.boardViewMode === "timed" ? board.timed : board.endless;
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
      const bucket = mode === "timed" ? board.timed : board.endless;
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
      if (mode === "timed") board.timed = bucket.slice(0, 10);
      else board.endless = bucket.slice(0, 10);

      await persistBoard(board);
      game.boardViewMode = mode;
      setBoardChips();
      await updateLeaderboard();
    }

    function applyHero(hero) {
      game.selectedHero = hero;
      player.maxHp = hero.hp;
      player.hp = hero.hp;
      player.baseDamage = hero.dmg;
      player.critBase = hero.crit;
      player.maxShield = hero.shield;
      player.shield = 0;
      player.ultGainMul = hero.ultGainMul;
      $("playerChar").textContent = hero.emoji;
      document.querySelectorAll(".char-option").forEach((el) => {
        el.classList.toggle("active", el.dataset.id === hero.id);
      });
      updateUI();
    }

    function renderHeroSelect() {
      const box = $("characterSelect");
      box.innerHTML = "";
      HEROES.forEach((hero) => {
        const unique = HERO_UNIQUE_SKILLS[hero.id];
        const card = document.createElement("div");
        card.className = `char-option${hero.id === game.selectedHero.id ? " active" : ""}`;
        card.dataset.id = hero.id;
        card.innerHTML = `
          <div class="char-emoji">${hero.emoji}</div>
          <div class="char-name">${hero.name}</div>
          <div class="char-desc">${hero.desc}</div>
          <div class="char-unique">
            <div>一般：${unique ? unique.normal : "無"}</div>
            <div>奧義：${unique ? unique.ultimate : "無"}</div>
          </div>
        `;
        card.onclick = () => {
          if (game.started && !game.over) return;
          applyHero(hero);
        };
        box.appendChild(card);
      });
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

    function getCritRate() { return clamp(player.critBase + game.combo * 0.01 + (game.fever > 0 ? 0.08 : 0), 0, 0.66); }

    function chooseSkillType() {
      if (player.ult >= 100) return "ultimate";

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

    function generatePrompt() {
      const type = chooseSkillType();
      const word = choice(SPELL_GROUPS[type]);
      game.prompt = { type, word };
      game.typedIndex = 0;
      renderPrompt();
      $("playerStatus").textContent = `法術：${type.toUpperCase()}`;
    }

    function renderPrompt() {
      const box = $("typingBox");
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
      $("damageValue").textContent = `${player.baseDamage + Math.floor(game.combo * (1.45 + game.comboScaleBonus))}${game.fever > 0 ? "🔥" : ""}`;
      $("critValue").textContent = `${Math.floor(getCritRate() * 100)}%`;

      $("enemyName").textContent = enemy.isBoss ? `Boss | ${enemy.name}` : enemy.name;
      $("enemyChar").textContent = enemy.emoji;
      $("enemyChar").classList.toggle("boss-aura", enemy.isBoss);

      $("feverBanner").innerHTML = game.fever > 0 ? `<span class="fever-banner">FEVER ${Math.ceil(game.fever / 1000)}s</span>` : "";
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

    function resetCombo(reason = "") {
      if (game.combo > 0 && reason) setMessage(reason);
      game.combo = 0;
      updateUI();
    }

    function applyTalent(id) {
      if (id === "dmgUp") player.baseDamage += 3;
      if (id === "critUp") player.critBase += 0.06;
      if (id === "hpUp") { player.maxHp += 20; player.hp = clamp(player.hp + 20, 0, player.maxHp); }
      if (id === "shieldUp") { player.maxShield += 16; player.shield = clamp(player.shield + 16, 0, player.maxShield); }
      if (id === "ultUp") player.ult = clamp(player.ult + 25, 0, 100);
      if (id === "comboUp") game.comboScaleBonus += 0.4;
    }

    function openTalentSelection() {
      game.waitingTalent = true;
      game.paused = true;
      $("talentOverlay").classList.add("show");
      const grid = $("talentGrid");
      grid.innerHTML = "";
      const options = [...TALENTS].sort(() => Math.random() - 0.5).slice(0, 3);
      options.forEach((opt) => {
        const card = document.createElement("div");
        card.className = "talent-card";
        card.innerHTML = `<h4>${opt.name}</h4><p>${opt.desc}</p>`;
        card.onclick = () => {
          applyTalent(opt.id);
          $("talentOverlay").classList.remove("show");
          game.waitingTalent = false;
          game.paused = false;
          setMessage(`你學會了 ${opt.name}。`);
          updateUI();
          game.lastTick = performance.now();
          cancelAnimationFrame(game.loopId);
          game.loopId = requestAnimationFrame(gameLoop);
        };
        grid.appendChild(card);
      });
    }

    function giveXp(amount) {
      player.xp += amount;
      while (player.xp >= player.xpToNext) {
        player.xp -= player.xpToNext;
        player.level += 1;
        player.xpToNext += XP_GROWTH_PER_LEVEL;
        sfxLevel();
        openTalentSelection();
      }
    }

    function healPlayer(percent, flat = 0) {
      const amount = Math.floor(player.maxHp * percent) + flat;
      player.hp = clamp(player.hp + amount, 0, player.maxHp);
      spawnBurstAt($("playerChar"), "heal-pulse");
      floatText($("playerChar"), `+${amount}`, "heal-green");
      sfxHeal();
    }

    function addShield(amount) {
      player.shield = clamp(player.shield + amount, 0, player.maxShield);
      spawnBurstAt($("playerChar"), "shield-ring");
      floatText($("playerChar"), `+${amount} 護盾`, "shield-cyan");
    }

    function damagePlayer(amount, sourceText = "") {
      let remaining = amount;
      if (player.shield > 0) {
        const absorbed = Math.min(player.shield, remaining);
        player.shield -= absorbed;
        remaining -= absorbed;
        if (absorbed > 0) floatText($("playerChar"), `格擋 ${absorbed}`, "shield-cyan");
      }
      if (remaining > 0) {
        player.hp = clamp(player.hp - remaining, 0, player.maxHp);
        floatText($("playerChar"), `-${remaining}`, "damage-blue");
        sfxHit();
      }
      animateChar("playerChar", "hit");
      shakeScreen();
      if (player.hp <= 0) {
        endGame("你被擊倒了");
      } else if (sourceText) {
        setMessage(sourceText);
      }
    }
    function damageEnemy(amount, isCrit = false) {
      enemy.hp = clamp(enemy.hp - amount, 0, enemy.maxHp);
      animateChar("enemyChar", "hit");
      floatText($("enemyChar"), isCrit ? `CRIT -${amount}` : `-${amount}`, isCrit ? "crit-gold" : "damage-red");
      if (isCrit) sfxCrit();
      else sfxHit();
      if (enemy.isBoss && !enemy.enrage && enemy.hp <= enemy.maxHp * 0.45) {
        enemy.enrage = true;
        enemy.castSpeedMul = 1.28;
        setMessage(`Boss ${enemy.name} 進入狂暴，攻勢加速。`);
      }
    }

    function calcDamage(base, critBonus = 1.8) {
      let dmg = base + Math.floor(game.combo * (1.45 + game.comboScaleBonus));
      if (game.fever > 0) dmg = Math.floor(dmg * 1.5);
      const isCrit = Math.random() < getCritRate();
      if (isCrit) dmg = Math.floor(dmg * critBonus);
      return { damage: dmg, isCrit };
    }

    function tryDropItem() {
      if (Math.random() > 0.34) return;
      const roll = Math.random();
      let itemText = "";
      if (roll < 0.33) { player.ult = clamp(player.ult + 18, 0, 100); itemText = "秘能球：奧義 +18"; }
      else if (roll < 0.66) { player.shield = clamp(player.shield + 14, 0, player.maxShield); itemText = "護核：護盾 +14"; }
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
      player.ult = clamp(player.ult + (enemy.isBoss ? 26 : 15), 0, 100);
      giveXp(enemy.isBoss ? 84 : 36);
      tryDropItem();
      setMessage(enemy.isBoss ? `Boss 已擊倒，回復 ${Math.floor(healPct * 100)}% HP。` : `敵人已擊倒，回復 ${Math.floor(healPct * 100)}% HP。`);
      setTimeout(() => {
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
      let scoreGain = 8;
      let critResult = false;
      animateChar("playerChar", "attack-forward");

      if (type === "fire") {
        spawnProjectile("playerChar", "enemyChar", "fireball");
        const r = calcDamage(player.baseDamage + 6, 1.75);
        damageEnemy(r.damage, r.isCrit);
        critResult = r.isCrit;
        player.ult += 16 * player.ultGainMul;
        scoreGain = r.damage;
        setMessage(`${word.toUpperCase()} 命中。`);
      }

      if (type === "bolt") {
        spawnLightning("enemyChar");
        const r = calcDamage(player.baseDamage + 10 + (heroId === "mage" ? 4 : 0), heroId === "mage" ? 2.15 : 2.0);
        damageEnemy(r.damage, r.isCrit);
        critResult = r.isCrit;
        player.ult += 18 * player.ultGainMul;
        scoreGain = r.damage + 4;
        if (heroId === "mage") {
          setTimeout(() => {
            if (game.over || enemy.hp <= 0) return;
            spawnLightning("enemyChar");
            const extra = calcDamage(player.baseDamage + 5, 1.35);
            damageEnemy(extra.damage, extra.isCrit);
            updateUI();
            if (enemy.hp <= 0) onEnemyDefeated();
          }, 120);
          setMessage(`${word.toUpperCase()} 觸發 Arc Overload 追擊閃電。`);
        } else {
          setMessage(`${word.toUpperCase()} 雷擊爆發。`);
        }
      }

      if (type === "slash") {
        spawnSlash("playerChar", "enemyChar");
        const first = calcDamage(player.baseDamage + 4 + (heroId === "assassin" ? 3 : 0), heroId === "assassin" ? 1.75 : 1.5);
        damageEnemy(first.damage, first.isCrit);
        critResult = first.isCrit;
        player.ult += 14 * player.ultGainMul;
        scoreGain = first.damage;
        const followUpChance = heroId === "assassin" ? 0.55 : 0.35;
        if (Math.random() < followUpChance) {
          setTimeout(() => {
            if (game.over || enemy.hp <= 0) return;
            const second = calcDamage(8 + Math.floor(player.level / 4) + (heroId === "assassin" ? 2 : 0), heroId === "assassin" ? 1.55 : 1.35);
            damageEnemy(second.damage, second.isCrit);
            updateUI();
            if (enemy.hp <= 0) onEnemyDefeated();
          }, 120);
          setMessage(heroId === "assassin"
            ? `${word.toUpperCase()} 觸發 Shadow Combo 追擊。`
            : `${word.toUpperCase()} 觸發追擊。`);
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
        addShield(18 + Math.floor(game.combo * 1.35) + (heroId === "knight" ? 10 : 0));
        if (heroId === "knight") {
          healPlayer(0.08, 0);
        }
        player.ult += 8 * player.ultGainMul;
        scoreGain = 10;
        setMessage(heroId === "knight"
          ? `${word.toUpperCase()} 啟動 Fortress Guard（護盾+回血）。`
          : `${word.toUpperCase()} 建立護盾。`);
      }

      if (type === "ultimate") {
        sfxUltimate();
        const meteorCount = heroId === "mage"
          ? (enemy.isBoss ? 8 : 6)
          : (enemy.isBoss ? 6 : 4);
        spawnMeteorStorm("enemyChar", meteorCount);
        player.ult = 0;
        scoreGain = heroId === "assassin" ? 96 : 86;
        if (heroId === "mage") setMessage(`${word.toUpperCase()} 啟動 Astral Cataclysm。`);
        else if (heroId === "knight") setMessage(`${word.toUpperCase()} 啟動 Aegis Judgment。`);
        else if (heroId === "assassin") setMessage(`${word.toUpperCase()} 啟動 Phantom Execution。`);
        else setMessage(`${word.toUpperCase()} 召喚流星雨。`);
        setTimeout(() => {
          if (game.over) return;
          let total = 0;
          const hits = heroId === "assassin"
            ? (enemy.isBoss ? 5 : 4)
            : heroId === "mage"
              ? (enemy.isBoss ? 5 : 4)
              : (enemy.isBoss ? 4 : 3);
          for (let i = 0; i < hits; i++) {
            const base = player.baseDamage + 18 + (heroId === "assassin" ? 4 : 0) + (heroId === "mage" ? 2 : 0);
            const critMul = heroId === "assassin" ? 1.72 : 1.56;
            total += calcDamage(base, critMul).damage;
          }
          if (heroId === "knight") {
            addShield(18 + Math.floor(player.level * 0.8));
            healPlayer(0.12, 0);
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
      if (game.combo > game.maxCombo) game.maxCombo = game.combo;
      if (game.combo >= 8 && game.fever <= 0) {
        game.fever = 7000;
        setMessage("FEVER MODE 啟動，傷害與暴擊率上升。");
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
      setTimeout(() => {
        if (game.over) return;
        const dmg = enemy.damageBase + rand(5) + Math.floor(enemy.level * 0.78);
        damagePlayer(dmg, `${enemy.name} 使用暗影彈。`);
        resetCombo("被敵方攻擊，連擊中斷。");
        updateUI();
      }, 240);
    }

    function enemyAttackQuick() {
      animateChar("enemyChar", "attack-backward");
      spawnSlash("enemyChar", "playerChar");
      setTimeout(() => {
        if (game.over) return;
        damagePlayer(enemy.damageBase + 2 + rand(4), `${enemy.name} 快速突襲。`);
        resetCombo("快攻打亂了你的節奏。");
        setTimeout(() => {
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

    function enemyAttackHeavy() { setIntent("heavy", "Dark Nova", Math.max(760, (enemy.isBoss ? 1180 : 1450) / enemy.castSpeedMul)); }
    function enemyAttackPoison() { setIntent("poison", "Venom Burst", Math.max(760, 1250 / enemy.castSpeedMul)); }
    function enemyAttackDrain() { setIntent("drain", "Soul Drain", Math.max(700, 1220 / enemy.castSpeedMul)); }
    function enemyAttackBreak() { setIntent("break", "Shield Shatter", Math.max(720, 1180 / enemy.castSpeedMul)); }
    function enemyAttackInterrupt() { setIntent("interrupt", "Mind Spike", Math.max(700, 1150 / enemy.castSpeedMul)); }
    function enemyAttackBossMeteor() { setIntent("bossMeteor", "Apocalypse Rain", Math.max(850, 1500 / enemy.castSpeedMul)); }

    function resolveEnemyIntent() {
      if (!enemy.intent || game.over) return;
      const t = enemy.intent.type;
      $("enemyChar").classList.remove("charge-glow");

      if (t === "heavy") {
        spawnLightning("playerChar");
        animateChar("enemyChar", "attack-backward");
        setTimeout(() => {
          if (game.over) return;
          const dmg = enemy.damageBase + 10 + rand(6) + Math.floor(enemy.level * 1.16);
          damagePlayer(dmg, `${enemy.name} 施放 ${enemy.intent.label}。`);
          resetCombo("重擊命中，連擊中斷。");
          updateUI();
        }, 170);
      }

      if (t === "poison") {
        spawnProjectile("enemyChar", "playerChar", "darkball");
        setTimeout(() => {
          if (game.over) return;
          damagePlayer(enemy.damageBase + 6 + rand(4), `${enemy.name} 的毒爆命中。`);
          resetCombo("毒爆讓你斷連。");
          let ticks = enemy.isBoss ? 4 : 3;
          const timer = setInterval(() => {
            if (game.over || ticks <= 0) { clearInterval(timer); return; }
            ticks--;
            damagePlayer(4 + Math.floor(enemy.level * 0.4), "中毒持續掉血。");
            updateUI();
          }, 780);
          updateUI();
        }, 170);
      }

      if (t === "drain") {
        spawnProjectile("enemyChar", "playerChar", "darkball");
        setTimeout(() => {
          if (game.over) return;
          const dmg = enemy.damageBase + 7 + rand(5);
          damagePlayer(dmg, `${enemy.name} 吸取你的生命。`);
          const heal = Math.floor(dmg * (enemy.isBoss ? 0.55 : 0.38));
          enemy.hp = clamp(enemy.hp + heal, 0, enemy.maxHp);
          floatText($("enemyChar"), `+${heal}`, "heal-green");
          resetCombo("生命吸取破壞了你的節奏。");
          updateUI();
        }, 170);
      }

      if (t === "break") {
        spawnSlash("enemyChar", "playerChar");
        setTimeout(() => {
          if (game.over) return;
          applyShieldBreak(enemy.isBoss ? 8 : 4);
          damagePlayer(enemy.damageBase + 5 + rand(4), `${enemy.name} 使用破盾斬。`);
          resetCombo("護盾被破壞，連擊中斷。");
          updateUI();
        }, 170);
      }

      if (t === "interrupt") {
        spawnLightning("playerChar");
        setTimeout(() => {
          if (game.over) return;
          damagePlayer(enemy.damageBase + 3 + rand(4), `${enemy.name} 使用心靈尖刺。`);
          const ultLoss = 14 + Math.floor(enemy.level * 0.35);
          player.ult = Math.max(0, player.ult - ultLoss);
          game.typedIndex = 0;
          renderPrompt();
          resetCombo(`奧義被干擾，損失 ${ultLoss}。`);
          updateUI();
        }, 170);
      }

      if (t === "bossMeteor") {
        spawnMeteorStorm("playerChar", 5);
        animateChar("enemyChar", "attack-backward");
        setTimeout(() => {
          if (game.over) return;
          const dmg = enemy.damageBase + 18 + rand(10) + Math.floor(enemy.level * 1.45);
          damagePlayer(dmg, `Boss ${enemy.name} 施放 Apocalypse Rain。`);
          resetCombo("Boss 大招打碎了連擊。");
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
        ? (enemy.isBoss ? 1980 : 2420)
        : (enemy.isBoss ? 1760 : 2200);
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
        ? (enemy.isBoss ? 1980 : 2420)
        : (enemy.isBoss ? 1760 : 2200);
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
      player.hp = player.maxHp;
      player.shield = 0;
      player.ult = 0;
      player.level = 1;
      player.xp = 0;
      player.xpToNext = XP_INITIAL_REQUIREMENT;
    }

    function startGame() {
      game.playerName = sanitizeName(game.playerName);
      initAudio();
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
      game.timeLeftMs = TIMED_LIMIT_MS;

      resetPlayerState();
      $("playerChar").classList.remove("char-dead");
      $("enemyChar").classList.remove("char-dead", "boss-aura");
      $("talentOverlay").classList.remove("show");
      $("pauseOverlay").classList.remove("show");
      $("heroOverlay").classList.remove("show");
      $("leaderboardOverlay").classList.remove("show");

      spawnEnemy();
      setMessage(game.mode === "timed" ? `戰鬥開始，${game.playerName}。限時 2:30！` : `戰鬥開始，${game.playerName}。無盡模式挑戰極限！`);
      updateUI();

      cancelAnimationFrame(game.loopId);
      game.lastTick = performance.now();
      game.loopId = requestAnimationFrame(gameLoop);
    }

    function resetGame() {
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
      updateUI();
      cancelAnimationFrame(game.loopId);
    }

    async function endGame(reason = "") {
      if (game.over) return;
      game.over = true;
      game.started = false;
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
      if (!game.started || game.over || game.waitingSpawn || game.waitingTalent || game.paused || !game.prompt) return;
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
      $("heroOverlay").classList.add("show");
    });
    $("closeHeroOverlayBtn").addEventListener("click", () => {
      $("heroOverlay").classList.remove("show");
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

    bindSetupOverlay();
    loadConfig();
    renderHeroSelect();
    setModeButtons();
    setBoardChips();
    resetGame();
    updateLeaderboard();
    $("playerNameInput").value = game.playerName;
