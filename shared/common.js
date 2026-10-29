/* =====================================================================
   共用零件：所有游戏都用这一份
   （拼音排版、岛的横条、读取单元生词、配音、计时器、冰淇淋难度、开始画面）
   一般不需要改这个档案。
   ===================================================================== */
(function () {
  const S = {};

  // ---- 拼音在上、中文在下 ----
  S.ruby = function (zh, py) {
    const p = String(py || '').split(' ');
    return Array.from(zh).map((c, i) => `<span><span class="py">${p[i] || ''}</span><span class="zh">${c}</span></span>`).join('');
  };
  S.esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // ---- 记住设定（声音、计时器、难度）。读不到也没关系 ----
  S.get = (k, d) => { try { const v = localStorage.getItem('shih:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } };
  S.set = (k, v) => { try { localStorage.setItem('shih:' + k, JSON.stringify(v)); } catch (e) {} };

  // ---- 岛的横条：每个游戏的第一行，点了回到岛上 ----
  S.islandBar = function () {
    const a = document.createElement('a');
    a.className = 'islandBar';
    a.href = '../';
    a.innerHTML = `<span aria-hidden="true">🏝</span><span class="ruby">${S.ruby('史老师的中文游戏岛', 'shǐ lǎo shī de zhōng wén yóu xì dǎo')}</span>` +
      `<span class="en">Ms. Shih's Island of Chinese Games</span><span class="back">← Back to the island</span>`;
    document.body.insertBefore(a, document.body.firstChild);
  };

  // ---- 读取单元：网址 ?unit=family 就读 units/family/words.js ----
  S.unitId = function () {
    const u = new URLSearchParams(location.search).get('unit') || 'family';
    return /^[a-z0-9-]+$/.test(u) ? u : 'family';
  };
  S.loadUnit = function () {
    const id = S.unitId();
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = `../units/${id}/words.js`;
      s.onload = () => window.UNIT ? resolve(window.UNIT) : reject(new Error('no UNIT in ' + s.src));
      s.onerror = () => reject(new Error('cannot load ' + s.src));
      document.head.appendChild(s);
    }).catch(err => {
      document.body.insertAdjacentHTML('beforeend',
        `<p style="font-size:20px;color:#C2372F">This game can't find its word list (units/${S.esc(id)}/words.js). Check the folder name in the link.</p>`);
      throw err;
    });
  };
  // a word from the unit by its Chinese
  S.wordMap = unit => Object.fromEntries(unit.words.map(w => [w.zh, w]));

  // ---- 配音：用装置内建的中文语音 ----
  S.SPEED = 0.55;          // 念的速度：1 = 正常，越小越慢
  let zhVoice = null;
  function findVoice() {
    if (!('speechSynthesis' in window)) return;
    const vs = speechSynthesis.getVoices();
    zhVoice = vs.find(v => /zh[-_]CN/i.test(v.lang)) || vs.find(v => /^zh/i.test(v.lang) && !/HK|yue/i.test(v.lang)) || null;
  }
  if ('speechSynthesis' in window) { findVoice(); speechSynthesis.onvoiceschanged = findVoice; }
  S.soundOn = S.get('sound', true);
  S.speak = function (text) {
    if (!S.soundOn || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN'; u.rate = S.SPEED;
    if (zhVoice) u.voice = zhVoice;
    speechSynthesis.speak(u);
  };

  // ---- on / off 按钮（声音、计时器） ----
  S.toggle = function (btn, key, onText, offText, dflt, onChange) {
    let on = S.get(key, dflt);
    const paint = () => { btn.setAttribute('aria-pressed', String(on)); btn.textContent = on ? onText : offText; };
    paint();
    btn.addEventListener('click', () => { on = !on; S.set(key, on); paint(); onChange && onChange(on); });
    onChange && onChange(on);
    return () => on;
  };
  S.soundButton = function (btn) {
    return S.toggle(btn, 'sound', '🔊 Sound on', '🔇 Sound off', true, on => {
      S.soundOn = on;
      if (!on && 'speechSynthesis' in window) speechSynthesis.cancel();
    });
  };

  // ---- 计时器 ----
  S.fmt = ms => { const s = Math.floor(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  S.timer = function (el) {
    let start = 0, tick = null;
    const T = {
      start() { start = Date.now(); clearInterval(tick); tick = setInterval(() => el.textContent = S.fmt(Date.now() - start), 250); },
      stop() { clearInterval(tick); tick = null; return start ? Date.now() - start : 0; },
      reset() { clearInterval(tick); tick = null; start = 0; el.textContent = '0:00'; }
    };
    return T;
  };

  // ---- 冰淇淋难度按钮 ----
  const SCOOPS = ['#F7A8C4', '#A8E0C2', '#9B6B4E', '#FBE7A1', '#B9D3F5', '#F2B27A'];
  S.iceCream = function (n) {
    let g = '<path d="M7 34 L23 34 L15 55 Z" fill="#E8B46A" stroke="#8A5A2B" stroke-width="1.5" stroke-linejoin="round"/>' +
            '<path d="M10 38 L19 45 M13 34 L21 41 M9 41 L16 50" stroke="#8A5A2B" stroke-width="1" fill="none"/>';
    for (let k = 0; k < n; k++) g += `<circle cx="15" cy="${30 - k * 8.5}" r="8.5" fill="${SCOOPS[k % SCOOPS.length]}" stroke="#2B2B2B" stroke-width="1.5"/>`;
    return `<svg viewBox="0 ${-6 - Math.max(0, n - 4) * 8.5} 30 ${62 + Math.max(0, n - 4) * 8.5}" aria-hidden="true">${g}</svg>`;
  };
  // levels: [{ note }, ...]   countOf(level) -> how many items at that level
  S.levelButtons = function (box, levels, current, countOf, onPick) {
    box.innerHTML = '';
    const btns = levels.map((L, k) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'level'; b.dataset.level = k + 1;
      const n = countOf ? countOf(k + 1) : null;
      b.innerHTML = S.iceCream(k + 1) + `<span class="lv-text">Level ${k + 1}<small>${S.esc(L.note || '')}${n ? ' · ' + n : ''}</small></span>`;
      b.addEventListener('click', () => onPick(k + 1));
      box.appendChild(b);
      return b;
    });
    return lv => btns.forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.level === lv)));
  };
  // level from the link (#3) or from last time
  S.startLevel = function (key, max) {
    const h = +(location.hash || '').replace(/\D/g, '');
    if (h >= 1 && h <= max) return h;
    const saved = +S.get(key, 1);
    return saved >= 1 && saved <= max ? saved : 1;
  };

  // ---- 开始画面：游戏区先模糊，按 Start 才开始 ----
  S.startCover = function (area, onStart) {
    const cover = document.createElement('div');
    cover.className = 'startCover';
    cover.innerHTML = `<button type="button" class="startBtn"><span class="ruby">${S.ruby('开始', 'kāi shǐ')}</span><span>Start</span></button>`;
    area.appendChild(cover);
    cover.querySelector('button').addEventListener('click', () => { area.classList.remove('waiting'); cover.hidden = true; onStart(); });
    return function wait() { area.classList.add('waiting'); cover.hidden = false; };
  };

  window.Shih = S;
})();
