(() => {
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);

  // Headline: split into words (keeps <em> styling); real spaces keep words apart
  const h1 = $('h1'); let n = 0;
  (function split(node) {
    [...node.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const f = document.createDocumentFragment();
        c.textContent.split(/\s+/).filter(Boolean).forEach(w => { const s = document.createElement('span'); s.className = 'w'; s.style.setProperty('--i', n++); s.textContent = w; f.append(s, ' '); });
        c.replaceWith(f);
      } else split(c);
    });
  })(h1);

  // Scroll reveal (single place for the whole page)
  const targets = document.querySelectorAll('.head, .mtable-wrap, .final h2, .final .cta-row');
  targets.forEach(el => { el.classList.add('rv'); el.style.setProperty('--d', Math.min([...el.parentElement.children].indexOf(el), 6) * 90 + 'ms'); });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  targets.forEach(el => io.observe(el));
  if (reduce) return;

  // Product frame + phone: scroll-driven rise + mouse tilt, eased every frame so it
  // glides instead of stepping; mascots drift at their own pace
  const frame = $('.frame'), stage = $('.stage'), phone = $('.phone'), ml = $('.mascot.l'), mr = $('.mascot.r');
  const small = matchMedia('(max-width:820px)');
  let mx = 0, my = 0, raf = 0;
  const cur = { rx: 14, ry: 0, ty: 30, py: 60, ml: 0, mr: 0 }, tgt = { ...cur };
  const target = () => {
    const r = stage.getBoundingClientRect(), p = Math.min(1, Math.max(0, 1 - r.top / innerHeight)), k = Math.min(1, p * 1.6);
    const tilt = small.matches ? 8 : 14, sy = Math.min(scrollY, 900);
    tgt.rx = tilt - k * tilt + my * -3; tgt.ry = mx * 5; tgt.ty = 30 - k * 30;
    tgt.py = 60 - k * 60 - mx * 10; tgt.ml = sy * .10; tgt.mr = sy * .18;
  };
  const step = () => {
    let moving = false;
    for (const key in cur) { const d = tgt[key] - cur[key]; cur[key] += d * .14; if (Math.abs(d) > .01) moving = true; }
    frame.style.setProperty('--rx', cur.rx.toFixed(2) + 'deg');
    frame.style.setProperty('--ry', cur.ry.toFixed(2) + 'deg');
    frame.style.setProperty('--ty', cur.ty.toFixed(1) + 'px');
    phone?.style.setProperty('--py', cur.py.toFixed(1) + 'px');
    ml.style.setProperty('--py', cur.ml.toFixed(1) + 'px');
    mr.style.setProperty('--py', cur.mr.toFixed(1) + 'px');
    raf = moving ? requestAnimationFrame(step) : 0;
  };
  const req = () => { target(); if (!raf) raf = requestAnimationFrame(step); };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req, { passive: true });
  if (matchMedia('(pointer:fine)').matches) addEventListener('mousemove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; req(); }, { passive: true });
  req();

  // Rising embers (hero only; loop stops when off-screen or tab hidden)
  const cv = $('#embers'), ctx = cv.getContext('2d'); let W = 0, H = 0, on = true, running = false;
  const size = () => { if (cv.offsetWidth === W && Math.abs(cv.offsetHeight - H) < 120) return; W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; };
  size(); addEventListener('resize', size);
  // Soft glow dot pre-rendered per colour; drawImage is far cheaper than shadowBlur per particle
  const ER = 12, glows = new Map();
  const glowFor = c => {
    const key = (c[0] >> 3) << 10 | (c[1] >> 3) << 5 | c[2] >> 3;
    let g = glows.get(key);
    if (!g) {
      if (glows.size > 300) glows.clear();
      g = document.createElement('canvas'); g.width = g.height = ER * 2;
      const x = g.getContext('2d'), rgb = `${c[0] | 0},${c[1] | 0},${c[2] | 0}`, gr = x.createRadialGradient(ER, ER, 0, ER, ER, ER);
      gr.addColorStop(0, `rgba(${rgb},1)`); gr.addColorStop(.16, `rgba(${rgb},1)`); gr.addColorStop(.3, `rgba(${rgb},.45)`); gr.addColorStop(1, `rgba(${rgb},0)`);
      x.fillStyle = gr; x.fillRect(0, 0, ER * 2, ER * 2); glows.set(key, g);
    }
    return g;
  };
  const cols = () => window._smolTheme.ember;
  const mk = init => { const i = Math.random() * 3 | 0; return { x: Math.random() * W, y: init ? Math.random() * H : H + 10, r: Math.random() * 1.8 + .5, v: Math.random() * .5 + .15, s: Math.random() * 2 * Math.PI, i, c: [...cols()[i]], a: Math.random() * .6 + .2 }; };
  const P = Array.from({ length: Math.min(innerWidth < 820 ? 26 : 70, W / 18 | 0) }, () => mk(true));
  function tick(t) {
    if (!on || document.hidden) { running = false; return; }
    ctx.clearRect(0, 0, W, H);
    const cc = cols();
    P.forEach((p, i) => {
      p.y -= p.v; p.x += Math.sin(t / 1500 + p.s) * .25;
      if (p.y < -10) { P[i] = mk(false); return; }
      const tc = cc[p.i]; for (let k = 0; k < 3; k++) p.c[k] += (tc[k] - p.c[k]) * .04; // ease to new theme
      ctx.globalAlpha = Math.max(0, p.a * Math.min(1, p.y / (H * .5)));
      const d = p.r * 6.25 * 2; ctx.drawImage(glowFor(p.c), p.x - d / 2, p.y - d / 2, d, d);
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  const kick = () => { if (!running && on && !document.hidden) { running = true; requestAnimationFrame(tick); } };
  new IntersectionObserver(e => { on = e[0].isIntersecting; kick(); }).observe(cv);
  document.addEventListener('visibilitychange', kick);
  kick();
})();
