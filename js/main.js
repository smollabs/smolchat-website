(() => {
  const C = window.SMOLCHAT_CONFIG, $ = (s, r = document) => r.querySelector(s);
  const icon = id => `<svg class="ico" aria-hidden="true"><use href="#${id}"/></svg>`;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Missing mascot/logo -> hide instead of a broken image
  document.querySelectorAll('[data-mascot]').forEach(img => {
    img.addEventListener('error', () => { img.style.visibility = 'hidden'; });
  });

  // Nav: soft background once scrolled
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // ---------- Downloads ----------
  const ua = navigator.userAgent, plat = navigator.userAgentData?.platform || navigator.platform || '';
  const detected = /Android/i.test(plat + ua) ? 'android'
    : /Mac/i.test(plat + ua) && !/iPhone|iPad/i.test(ua) && navigator.maxTouchPoints < 2 ? 'macos'
    : /Win/i.test(plat + ua) ? 'windows' : null;
  const iconFor = { windows: 'i-win', macos: 'i-apple', android: 'i-android' };
  function dlButton(key, i) {
    const d = C.downloads[key], ok = !!(d.url || d.file), a = document.createElement('a');
    a.className = 'btn ' + (i === 0 ? 'btn-primary' : 'btn-ghost') + (key === detected ? ' rec' : '');
    const detail = ok ? [d.arch, d.size].filter(Boolean).join(' · ') : '';
    a.innerHTML = `${icon(iconFor[key])}<span>${ok ? 'Download for ' : ''}${d.label}${ok ? '' : ' (unavailable)'}</span>${detail ? `<small>${detail}</small>` : ''}`;
    if (ok) {
      a.href = d.url || d.dir + encodeURIComponent(d.file);
      if (d.file) a.setAttribute('download', d.file);
    }
    else { a.setAttribute('aria-disabled', 'true'); a.setAttribute('role', 'link'); a.tabIndex = -1; a.title = 'Installer not yet available'; }
    return a;
  }
  const order = Object.keys(C.downloads).sort((a, b) => (b === detected) - (a === detected));
  document.querySelectorAll('[data-downloads]').forEach(el => {
    order.forEach((k, i) => el.append(dlButton(k, i)));
    if (el.dataset.downloads === 'hero') el.append(Object.assign(document.createElement('a'), { className: 'btn btn-ghost', href: '#models', textContent: 'Browse models' }));
  });
  const meta = [C.version && 'Version ' + C.version, C.releaseDate].filter(Boolean).join(' · ');
  const anyOk = Object.values(C.downloads).some(d => d.url || d.file);
  $('#dlMeta').textContent = detected === 'android'
    ? 'Version ' + C.downloads.android.version + ' · if Android asks, allow installs from your browser.'
    : meta || (anyOk ? '' : 'Installers are not published yet.');

  // ---------- Theme (palette + particle colours) ----------
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const themeParticles = {
    ember:    { spark: ['#ffe2b8', '#ffc46b', '#e0701c', '#ffb070', '#fdfcfc', '#ff8a2b'].map(hex), ember: [[255, 138, 43], [255, 196, 107], [255, 176, 112]] },
    graphite: { spark: ['#e4e4e8', '#cfcfd6', '#6e6e78', '#a1a1aa', '#ededf0', '#b9b9c2'].map(hex), ember: [[185, 185, 194], [207, 207, 214], [161, 161, 170]] },
    ocean:    { spark: ['#bcd8ff', '#8ec2ff', '#2f7cf0', '#7fb4ff', '#e8f1ff', '#4d9bff'].map(hex), ember: [[77, 155, 255], [142, 194, 255], [127, 180, 255]] }
  };
  const bgMap = { ember: '#07060f', graphite: '#09090c', ocean: '#030812' };
  function applyTheme(id) {
    const t = themeParticles[id] ? id : 'ember';
    document.documentElement.setAttribute('data-theme', t);
    const m = $('meta[name="theme-color"]'); if (m) m.content = bgMap[t];
    window._smolTheme = themeParticles[t]; // particles ease toward these colours
  }
  applyTheme('ember');

  // ---------- Screenshots + accessible tabs (cross-fading) ----------
  const stage = $('#shotStage'), phone = $('#phoneStage'), tabs = $('#shotTabs');
  const placeholder = t => `<div class="ph">${icon('i-monitor')}<p>${t}<br>Add the file to assets/images/ and set it in js/config.js</p></div>`;
  function show(s) {
    if (!s.src) stage.innerHTML = placeholder(s.label);
    else swap(stage, s.src, s.alt, 1800, 1125);
    if (phone) { phone.parentElement.hidden = !s.mobile; if (s.mobile) swap(phone, s.mobile, '', 716, 1600); }
  }
  function swap(host, src, alt, w, h) {
    const olds = [...host.querySelectorAll('.shot-img')];
    host.querySelector('.ph')?.remove();
    const img = new Image();
    img.className = 'shot-img'; img.alt = alt; img.width = w; img.height = h; img.decoding = 'async';
    if (olds.length && !calm) img.classList.add('enter');
    img.src = src; host.append(img);
    const done = () => {
      requestAnimationFrame(() => img.classList.add('on'));
      setTimeout(() => olds.forEach(o => o.remove()), calm ? 0 : 650);
    };
    (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(done);
  }
  const tabEls = [];
  function select(i, focus) {
    tabEls.forEach((t, j) => { t.setAttribute('aria-selected', j === i); t.tabIndex = j === i ? 0 : -1; });
    if (focus) tabEls[i].focus();
    stage.setAttribute('aria-labelledby', tabEls[i].id);
    show(C.screenshots[i]);
    applyTheme(C.screenshots[i].id);
  }
  tabs.setAttribute('role', 'tablist');
  stage.setAttribute('role', 'tabpanel');
  C.screenshots.forEach((s, i) => {
    const t = Object.assign(document.createElement('button'), { className: 'tab', textContent: s.label, id: 'tab-' + s.id, type: 'button' });
    t.setAttribute('role', 'tab'); t.setAttribute('aria-controls', 'shotStage');
    t.onclick = () => select(i);
    t.onkeydown = e => {
      const n = C.screenshots.length, k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: n - 1 }[e.key];
      if (k === undefined) return; e.preventDefault(); select((k + n) % n, true);
    };
    tabs.append(t); tabEls.push(t);
  });
  if (C.screenshots.length) {
    select(0);
    // warm the cache so theme switches cross-fade instantly
    setTimeout(() => C.screenshots.slice(1).forEach(s => [s.src, s.mobile].forEach(u => { if (u) new Image().src = u; })), 800);
  }

  // ---------- Models: comparison table grouped by category ----------
  const cats = [['text', 'Text'], ['vision', 'Vision-language'], ['document', 'Document']];
  const toNum = z => parseFloat(z) * (/B$/i.test(z) ? 1e9 : 1e6);
  const host = $('#modelTable');
  if (host && C.models?.length) {
    const cols = [...new Set(C.models.flatMap(m => m.sizes))].sort((a, b) => toNum(a) - toNum(b));
    const rows = key => C.models.filter(m => m.type === key).map(m => `<tr class="row">
      <th scope="row"><b>${m.name}${m.confirmed ? '' : '<span class="tag">Support to be confirmed</span>'}</b><span class="d">${m.note}</span></th>
      ${cols.map(c => m.sizes.includes(c) ? `<td><span class="dot" aria-hidden="true"></span><span class="sr">Available in ${c}</span></td>` : `<td><span class="no" aria-hidden="true"></span><span class="sr">Not available in ${c}</span></td>`).join('')}
    </tr>`).join('');
    host.innerHTML = `<table class="mtable">
      <colgroup><col class="n">${cols.map(() => '<col>').join('')}</colgroup>
      <thead>
        <tr class="span"><td></td><th scope="colgroup" colspan="${cols.length}">Parameters</th></tr>
        <tr class="sizes"><th scope="col">Model</th>${cols.map(c => `<th scope="col">${c}</th>`).join('')}</tr>
      </thead>
      ${cats.filter(([k]) => C.models.some(m => m.type === k)).map(([k, l]) => `<tbody><tr class="grp"><th scope="colgroup" colspan="${cols.length + 1}">${l}</th></tr>${rows(k)}</tbody>`).join('')}
    </table>`;
    const sizes = C.models.reduce((n, m) => n + m.sizes.length, 0);
    const mm = $('#modelMeta'); if (mm) mm.textContent = `${C.models.length} model families · ${sizes} sizes`;
  }

  // ---------- Footer ----------
  const L = C.links;
  $('#footLinks').innerHTML = [['smollabs', L.org], ['GitHub', L.github], ['Documentation', L.docs], ['Report an issue', L.issues], [L.licenseName, L.license]]
    .filter(([, u]) => u && u !== '#')
    .map(([t, u]) => `<li><a href="${u}"${u.startsWith('http') ? ' rel="noopener" target="_blank"' : ''}>${t}</a></li>`).join('');

  // ---------- Sparkles + cursor glow (motion allowed only) ----------
  if (calm) return;
  const glow = $('#glow');
  if (matchMedia('(pointer:fine)').matches) {
    let gx = -999, gy = -999, tx = gx, ty = gy, gRaf = 0;
    const follow = () => {
      gx += (tx - gx) * .18; gy += (ty - gy) * .18;
      glow.style.transform = `translate3d(${gx}px,${gy}px,0)`;
      gRaf = Math.abs(tx - gx) + Math.abs(ty - gy) > .5 ? requestAnimationFrame(follow) : 0;
    };
    addEventListener('pointermove', e => {
      if (gx === -999) { gx = e.clientX; gy = e.clientY; }
      tx = e.clientX; ty = e.clientY; glow.style.opacity = 1;
      if (!gRaf) gRaf = requestAnimationFrame(follow);
    }, { passive: true });
  }

  const cv = $('#sparks'), cx = cv.getContext('2d'), lite = matchMedia('(max-width:820px)').matches;
  let W = 0, H = 0;
  // Ignore the height jitter of mobile address bars; only re-allocate when really needed
  const size = () => {
    if (innerWidth === W && innerHeight <= H) return;
    const r = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = Math.max(innerHeight, H);
    cv.width = W * r; cv.height = H * r; cv.style.height = H + 'px'; cx.setTransform(r, 0, 0, r, 0, 0);
  };
  size(); addEventListener('resize', size);
  const pal = () => window._smolTheme.spark;
  const mk = () => { const i = Math.random() * 6 | 0; return { x: Math.random() * W, y: Math.random() * H, r: 2 + Math.random() * 5, v: .08 + Math.random() * .25, t: Math.random() * 6.28, s: .6 + Math.random() * 1.4, i, c: [...pal()[i]] }; };
  const P = Array.from({ length: Math.min(lite ? 14 : 46, innerWidth / 24 | 0) }, mk);
  // Glowing stars are pre-rendered once per colour (shadowBlur every frame is the costly part)
  const SR = 8, SB = lite ? 6 : 12, SS = (SR + SB * 2) * 2, sprites = new Map();
  const sprite = c => {
    const key = (c[0] >> 3) << 10 | (c[1] >> 3) << 5 | c[2] >> 3;
    let sp = sprites.get(key);
    if (!sp) {
      if (sprites.size > 400) sprites.clear();
      sp = document.createElement('canvas'); sp.width = sp.height = SS;
      const g = sp.getContext('2d'), m = SS / 2, col = `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
      g.fillStyle = g.shadowColor = col; g.shadowBlur = SB;
      g.beginPath(); g.moveTo(m, m - SR); g.quadraticCurveTo(m, m, m + SR, m); g.quadraticCurveTo(m, m, m, m + SR); g.quadraticCurveTo(m, m, m - SR, m); g.quadraticCurveTo(m, m, m, m - SR); g.fill();
      sprites.set(key, sp);
    }
    return sp;
  };
  let raf = 0;
  function loop(now) {
    cx.clearRect(0, 0, W, H);
    const cols = pal();
    for (const p of P) {
      p.y -= p.v; p.x += Math.sin(now / 3000 + p.t) * .15;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      const tc = cols[p.i]; for (let k = 0; k < 3; k++) p.c[k] += (tc[k] - p.c[k]) * .04; // ease to new theme
      cx.globalAlpha = (.25 + .6 * (.5 + .5 * Math.sin(now / 1000 * p.s + p.t))) * .8;
      const d = SS * p.r / SR; cx.drawImage(sprite(p.c), p.x - d / 2, p.y - d / 2, d, d);
    }
    raf = requestAnimationFrame(loop);
  }
  const start = () => { if (!raf) raf = requestAnimationFrame(loop); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  start();
})();
