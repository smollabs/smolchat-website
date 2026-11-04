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

  // Product frame: scroll-driven rise + mouse tilt; mascots drift at their own pace
  const frame = $('.frame'), stage = $('.stage'), ml = $('.mascot.l'), mr = $('.mascot.r');
  let mx = 0, my = 0, ticking = false;
  const apply = () => {
    const r = stage.getBoundingClientRect(), p = Math.min(1, Math.max(0, 1 - r.top / innerHeight)), k = Math.min(1, p * 1.6);
    frame.style.setProperty('--rx', (14 - k * 14 + my * -3).toFixed(2) + 'deg');
    frame.style.setProperty('--ry', (mx * 5).toFixed(2) + 'deg');
    frame.style.setProperty('--ty', (30 - k * 30).toFixed(1) + 'px');
    const sy = Math.min(scrollY, 900);
    ml.style.setProperty('--py', (sy * .10).toFixed(1) + 'px');
    mr.style.setProperty('--py', (sy * .18).toFixed(1) + 'px');
    ticking = false;
  };
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('mousemove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; req(); }, { passive: true });
  apply();

  // Rising embers (hero only; loop stops when off-screen or tab hidden)
  const cv = $('#embers'), ctx = cv.getContext('2d'); let W, H, on = true, running = false;
  const size = () => { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; };
  size(); addEventListener('resize', size);
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
      const rgb = `${p.c[0] | 0},${p.c[1] | 0},${p.c[2] | 0}`;
      ctx.beginPath(); ctx.fillStyle = `rgba(${rgb},${p.a * Math.min(1, p.y / (H * .5))})`; ctx.shadowColor = `rgb(${rgb})`; ctx.shadowBlur = 10;
      ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  const kick = () => { if (!running && on && !document.hidden) { running = true; requestAnimationFrame(tick); } };
  new IntersectionObserver(e => { on = e[0].isIntersecting; kick(); }).observe(cv);
  document.addEventListener('visibilitychange', kick);
  kick();
})();
