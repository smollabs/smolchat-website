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
  const detected = /Mac/i.test(plat + ua) && !/iPhone|iPad/i.test(ua) ? 'macos' : /Win/i.test(plat + ua) ? 'windows' : null;
  const iconFor = { windows: 'i-win', macos: 'i-apple' };
  function dlButton(key, i) {
    const d = C.downloads[key], ok = !!d.file, a = document.createElement('a');
    a.className = 'btn ' + (i === 0 ? 'btn-primary' : 'btn-ghost') + (key === detected ? ' rec' : '');
    const detail = ok ? [d.arch, d.size].filter(Boolean).join(' · ') : '';
    a.innerHTML = `${icon(iconFor[key])}<span>${ok ? 'Download for ' : ''}${d.label}${ok ? '' : ' (unavailable)'}</span>${detail ? `<small>${detail}</small>` : ''}`;
    if (ok) { a.href = d.dir + encodeURIComponent(d.file); a.setAttribute('download', d.file); }
    else { a.setAttribute('aria-disabled', 'true'); a.setAttribute('role', 'link'); a.tabIndex = -1; a.title = 'Installer not yet available'; }
    return a;
  }
  const order = ['windows', 'macos'].sort((a, b) => (b === detected) - (a === detected));
  document.querySelectorAll('[data-downloads]').forEach(el => {
    order.forEach((k, i) => el.append(dlButton(k, i)));
    if (el.dataset.downloads === 'hero') el.append(Object.assign(document.createElement('a'), { className: 'btn btn-ghost', href: '#models', textContent: 'Browse models' }));
  });
  const meta = [C.version && 'Version ' + C.version, C.releaseDate].filter(Boolean).join(' · ');
  const anyOk = Object.values(C.downloads).some(d => d.file);
  $('#dlMeta').textContent = meta || (anyOk ? '' : 'Installers are not published yet.');

  // ---------- Theme (palette + particle colours) ----------
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const themeParticles = {
    ember:    { spark: ['#fdeba4', '#fee072', '#bb6afd', '#cf96fb', '#fdfcfc', '#fe7603'].map(hex), ember: [[254, 118, 3], [254, 224, 114], [207, 150, 251]] },
    graphite: { spark: ['#c8d8ff', '#a0c4ff', '#5580f0', '#8ca8f8', '#e8ecf4', '#4e8fff'].map(hex), ember: [[78, 143, 255], [160, 196, 255], [140, 168, 248]] },
    ocean:    { spark: ['#a8eddf', '#7fe8d0', '#15bfb0', '#5dd8cc', '#e0f4f8', '#00d4aa'].map(hex), ember: [[0, 212, 170], [127, 232, 208], [93, 216, 204]] }
  };
  const bgMap = { ember: '#060512', graphite: '#0a0c10', ocean: '#02080e' };
  function applyTheme(id) {
    const t = themeParticles[id] ? id : 'ember';
    document.documentElement.setAttribute('data-theme', t);
    const m = $('meta[name="theme-color"]'); if (m) m.content = bgMap[t];
    window._smolTheme = themeParticles[t]; // particles ease toward these colours
  }
  applyTheme('ember');

  // ---------- Screenshots + accessible tabs (cross-fading) ----------
  const stage = $('#shotStage'), tabs = $('#shotTabs');
  const placeholder = t => `<div class="ph">${icon('i-monitor')}<p>${t}<br>Add the file to assets/images/ and set it in js/config.js</p></div>`;
  function show(s) {
    const olds = [...stage.querySelectorAll('.shot-img')];
    if (!s.src) { stage.innerHTML = placeholder(s.label); return; }
    stage.querySelector('.ph')?.remove();
    const img = new Image();
    img.className = 'shot-img'; img.alt = s.alt; img.width = 1800; img.height = 1125; img.decoding = 'async';
    if (olds.length && !calm) img.classList.add('enter');
    img.src = s.src; stage.append(img);
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
    setTimeout(() => C.screenshots.slice(1).forEach(s => { if (s.src) new Image().src = s.src; }), 800);
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
  if (matchMedia('(pointer:fine)').matches) addEventListener('pointermove', e => { glow.style.opacity = 1; glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; }, { passive: true });

  const cv = $('#sparks'), cx = cv.getContext('2d'), lite = matchMedia('(max-width:820px)').matches;
  let W, H;
  const size = () => { const r = devicePixelRatio || 1; cv.width = innerWidth * r; cv.height = innerHeight * r; cx.setTransform(r, 0, 0, r, 0, 0); W = innerWidth; H = innerHeight; };
  size(); addEventListener('resize', size);
  const pal = () => window._smolTheme.spark;
  const mk = () => { const i = Math.random() * 6 | 0; return { x: Math.random() * W, y: Math.random() * H, r: 2 + Math.random() * 5, v: .08 + Math.random() * .25, t: Math.random() * 6.28, s: .6 + Math.random() * 1.4, i, c: [...pal()[i]] }; };
  const P = Array.from({ length: Math.min(lite ? 14 : 46, innerWidth / 24 | 0) }, mk);
  const star = (x, y, r) => { cx.beginPath(); cx.moveTo(x, y - r); cx.quadraticCurveTo(x, y, x + r, y); cx.quadraticCurveTo(x, y, x, y + r); cx.quadraticCurveTo(x, y, x - r, y); cx.quadraticCurveTo(x, y, x, y - r); cx.fill(); };
  let raf = 0;
  function loop(now) {
    cx.clearRect(0, 0, W, H);
    const cols = pal();
    for (const p of P) {
      p.y -= p.v; p.x += Math.sin(now / 3000 + p.t) * .15;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      const tc = cols[p.i]; for (let k = 0; k < 3; k++) p.c[k] += (tc[k] - p.c[k]) * .04; // ease to new theme
      const col = `rgb(${p.c[0] | 0},${p.c[1] | 0},${p.c[2] | 0})`;
      cx.globalAlpha = (.25 + .6 * (.5 + .5 * Math.sin(now / 1000 * p.s + p.t))) * .8; cx.fillStyle = col;
      cx.shadowColor = col; cx.shadowBlur = lite ? 6 : 12; star(p.x, p.y, p.r);
    }
    raf = requestAnimationFrame(loop);
  }
  const start = () => { if (!raf) raf = requestAnimationFrame(loop); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  start();
})();
