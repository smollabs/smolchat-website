(() => {
  const C = window.SMOLCHAT_CONFIG, $ = (s, r = document) => r.querySelector(s);
  const icon = id => `<svg class="ico" aria-hidden="true"><use href="#${id}"/></svg>`;

  // Missing mascot/logo -> neutral placeholder instead of broken image
  document.querySelectorAll('[data-mascot]').forEach(img => {
    img.addEventListener('error', () => { img.style.visibility = 'hidden'; });
  });

  // Nav
  const nav = $('#nav'), menu = $('#menu'), btn = $('#menuBtn');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  btn.addEventListener('click', () => { const o = menu.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });
  menu.addEventListener('click', e => { if (e.target.closest('a')) { menu.classList.remove('open'); btn.setAttribute('aria-expanded', false); } });

  // Downloads
  const ua = navigator.userAgent, plat = navigator.userAgentData?.platform || navigator.platform || '';
  const detected = /Mac/i.test(plat + ua) && !/iPhone|iPad/i.test(ua) ? 'macos' : /Win/i.test(plat + ua) ? 'windows' : null;
  const iconFor = { windows: 'i-win', macos: 'i-apple' };
  function dlButton(key, i) {
    const d = C.downloads[key], ok = !!d.file, a = document.createElement('a');
    a.className = 'btn ' + (i === 0 ? 'btn-primary' : 'btn-ghost') + (key === detected ? ' rec' : '');
    const detail = ok ? [d.arch, d.size].filter(Boolean).join(' · ') : 'Coming soon';
    a.innerHTML = `${icon(iconFor[key])}<span>${ok ? 'Download for ' : ''}${d.label}${ok ? '' : ' (unavailable)'}</span>${detail && ok ? `<small>${detail}</small>` : ''}`;
    if (ok) { a.href = d.dir + encodeURIComponent(d.file); a.setAttribute('download', d.file); }
    else { a.setAttribute('aria-disabled', 'true'); a.setAttribute('role', 'link'); a.tabIndex = -1; a.title = 'Installer not yet available'; }
    return a;
  }
  const order = ['windows', 'macos'].sort((a, b) => (b === detected) - (a === detected));
  document.querySelectorAll('[data-downloads]').forEach(el => {
    order.forEach((k, i) => el.append(dlButton(k, i)));
    if (el.dataset.downloads === 'hero') el.append(Object.assign(document.createElement('a'), { className: 'btn btn-ghost', href: '#how', textContent: 'How it works' }));
  });
  const meta = [C.version && 'Version ' + C.version, C.releaseDate].filter(Boolean).join(' · ');
  const anyOk = Object.values(C.downloads).some(d => d.file);
  $('#dlMeta').textContent = meta || (anyOk ? '' : 'Installers are not published yet.');

  // Screenshots + tabs
  const stage = $('#shotStage'), tabs = $('#shotTabs');
  function placeholder(t) { return `<div class="ph">${icon('i-monitor')}<p>${t}<br>Add the file to assets/images/ and set it in js/config.js</p></div>`; }
  function show(s) { stage.innerHTML = s.src ? `<img src="${s.src}" alt="${s.alt}" width="1800" height="1125">` : placeholder(s.label); }
  C.screenshots.forEach((s, i) => {
    const t = Object.assign(document.createElement('button'), { className: 'tab', textContent: s.label });
    t.setAttribute('role', 'tab'); t.setAttribute('aria-selected', i === 0);
    t.onclick = () => { tabs.querySelectorAll('.tab').forEach(x => x.setAttribute('aria-selected', x === t)); show(s); };
    tabs.append(t);
  });
  if (C.screenshots[0]) show(C.screenshots[0]);
  $('#extraShots').innerHTML = C.extraShots.map(s => `<figure class="shot">${s.src ? `<img src="${s.src}" alt="${s.alt}" loading="lazy">` : `<div class="ph">${icon('i-monitor')}<p>${s.title}: screenshot coming soon</p></div>`}</figure>`).join('');

  // Features
  const F = [
    ['i-cpu', 'Local inference', 'Models run on your own hardware, not on a remote server.'],
    ['i-dl', 'One-time model downloads', 'Download a model once from inside the app and reuse it.'],
    ['i-off', 'Offline conversations', 'After setup, chat without an internet connection.'],
    ['i-shield', 'Privacy first', 'Your prompts and replies stay on your computer.'],
    ['i-spark', 'Automatic model selection', 'Leave it on Auto and let smolchat choose a downloaded model.'],
    ['i-swap', 'Manual switching', 'Pick a specific model for any conversation.'],
    ['i-feather', 'Lightweight models', 'Small language models built to be practical on desktops.'],
    ['i-chat', 'Local chat history', 'Search and revisit past chats, stored on your device.']
  ];
  $('#featureGrid').innerHTML = F.map(([i, t, p]) => `<article class="card">${icon(i)}<h3>${t}</h3><p>${p}</p></article>`).join('');

  // Models
  $('#modelChips').innerHTML = C.models.map(m => `<div class="chip"><b>${m.name}</b><span>${m.note}</span><br><span class="tag ${m.confirmed ? 'ok' : ''}">${m.confirmed ? 'Supported' : 'Support to be confirmed'}</span></div>`).join('');

  // Requirements (only when verified)
  if (C.requirements.length) {
    $('#reqList').innerHTML = C.requirements.map(r => `<div><span>${r.label}</span><b>${r.value}</b></div>`).join('');
    $('#requirements').hidden = false;
  }

  // Video
  const v = $('#video');
  const vph = msg => v.innerHTML = `<div class="ph"><div class="play">${icon('i-play')}</div><p>${msg}</p></div>`;
  vph('Demo video coming soon');
  fetch(C.video.src, { method: 'HEAD' }).then(r => {
    if (!r.ok || /text\/html/.test(r.headers.get('content-type') || '')) return;
    v.innerHTML = `<video controls preload="metadata" poster="${C.video.poster}" playsinline><source src="${C.video.src}"></video>`;
  }).catch(() => {});

  // Footer
  const L = C.links;
  $('#footLinks').innerHTML = [['SmolWorks', L.org], ['GitHub', L.github], ['Documentation', L.docs], ['Report an issue', L.issues], [L.licenseName, L.license]]
    .map(([t, u]) => `<li><a href="${u}"${u.startsWith('http') ? ' rel="noopener" target="_blank"' : ''}>${t}</a></li>`).join('');

  /* ---- v2 motion ---- */
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // marquee
  const words = [...C.models.map(m => m.name), 'Private', 'Offline', 'Open source', 'Local-first', 'Windows', 'macOS'];
  const seq = words.map(w => `<span>${w}</span>`).join('');
  $('#marq').innerHTML = seq + seq;
  if (!calm) {
    // scroll reveal with stagger
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.head,.intro>*,.card,.chip,.step,.shot,.video,.install,.req,details,.final h2,.final .cta-row').forEach((el, i) => {
      const sib = [...el.parentElement.children].indexOf(el);
      el.style.setProperty('--d', Math.min(sib, 6) * .08 + 's'); el.classList.add('rv'); io.observe(el);
    });
    // hero showcase tilts flat as you scroll
    const frame = $('.frame'); let tick = false;
    const upd = () => { const p = Math.min(scrollY / 520, 1); frame.style.transform = `rotateX(${12 * (1 - p)}deg) scale(${.95 + .05 * p})`; tick = false; };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    // cursor glow
    const glow = $('#glow');
    if (matchMedia('(pointer:fine)').matches) addEventListener('pointermove', e => { glow.style.opacity = 1; glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; }, { passive: true });
    // twinkling sparkles (palette colours only)
    const cv = $('#sparks'), cx = cv.getContext('2d'), cols = ['#fdeba4', '#fee072', '#bb6afd', '#cf96fb', '#fdfcfc', '#fe7603'];
    let W, H, P = [];
    const size = () => { const r = devicePixelRatio || 1; W = cv.width = innerWidth * r; H = cv.height = innerHeight * r; cx.setTransform(r, 0, 0, r, 0, 0); W = innerWidth; H = innerHeight; };
    size(); addEventListener('resize', size);
    const mk = () => ({ x: Math.random() * W, y: Math.random() * H, r: 2 + Math.random() * 5, v: .08 + Math.random() * .25, t: Math.random() * 6.28, s: .6 + Math.random() * 1.4, c: cols[Math.random() * cols.length | 0] });
    P = Array.from({ length: Math.min(46, innerWidth / 24 | 0) }, mk);
    const star = (x, y, r) => { cx.beginPath(); cx.moveTo(x, y - r); cx.quadraticCurveTo(x, y, x + r, y); cx.quadraticCurveTo(x, y, x, y + r); cx.quadraticCurveTo(x, y, x - r, y); cx.quadraticCurveTo(x, y, x, y - r); cx.fill(); };
    (function loop(now) {
      cx.clearRect(0, 0, W, H);
      for (const p of P) {
        p.y -= p.v; p.x += Math.sin(now / 3000 + p.t) * .15; if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        cx.globalAlpha = (.25 + .6 * (.5 + .5 * Math.sin(now / 1000 * p.s + p.t))) * .8; cx.fillStyle = p.c;
        cx.shadowColor = p.c; cx.shadowBlur = 12; star(p.x, p.y, p.r);
      }
      requestAnimationFrame(loop);
    })(0);
  }
})();
