(() => {
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);

  // Headline: split into words (keeps <em> styling)
  const h1 = $('h1'); let n = 0;
  (function split(node) {
    [...node.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const f = document.createDocumentFragment();
        c.textContent.split(/\s+/).filter(Boolean).forEach(w => { const s = document.createElement('span'); s.className = 'w'; s.style.setProperty('--i', n++); s.textContent = w; f.append(s); });
        c.replaceWith(f);
      } else split(c);
    });
  })(h1);

  // Scroll reveal
  const targets = document.querySelectorAll('.head, .card, .chip, .shot, .video, .step, .note, details, .intro h2, .install, .req');
  targets.forEach(el => { el.classList.add('rv'); const sib = [...el.parentElement.children].indexOf(el); el.style.setProperty('--d', Math.min(sib, 6) * 90 + 'ms'); });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  targets.forEach(el => io.observe(el));
  if (reduce) return;

  // Product frame: scroll-driven rise + mouse tilt
  const frame = $('.frame'), stage = $('.stage'); let mx = 0, my = 0, ticking = false;
  const apply = () => {
    const r = stage.getBoundingClientRect(), p = Math.min(1, Math.max(0, 1 - r.top / innerHeight));
    const rx = 14 - Math.min(1, p * 1.6) * 14 + my * -3, ry = mx * 5;
    frame.style.setProperty('--rx', rx.toFixed(2) + 'deg'); frame.style.setProperty('--ry', ry.toFixed(2) + 'deg');
    frame.style.setProperty('--ty', (30 - Math.min(1, p * 1.6) * 30).toFixed(1) + 'px'); ticking = false;
  };
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('mousemove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; req(); }, { passive: true });
  apply();

  // Card spotlight
  document.addEventListener('pointermove', e => {
    const c = e.target.closest?.('.card,.chip'); if (!c) return;
    const b = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - b.left + 'px'); c.style.setProperty('--my', e.clientY - b.top + 'px');
  });

  // Rising embers (hero only, paused offscreen)
  const cv = $('#embers'), ctx = cv.getContext('2d'); let W, H, P = [], on = true;
  const size = () => { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; };
  size(); addEventListener('resize', size);
  const getEmberCols = () => (window._smolTheme || { ember: ['254,118,3','254,224,114','207,150,251'] }).ember;
  const mk = init => { const cols = getEmberCols(); return { x: Math.random() * W, y: init ? Math.random() * H : H + 10, r: Math.random() * 1.8 + .5, v: Math.random() * .5 + .15, s: Math.random() * 2 * Math.PI, c: cols[Math.random() * 3 | 0], a: Math.random() * .6 + .2 }; };
  P = Array.from({ length: Math.min(70, W / 18 | 0) }, () => mk(true));
  new IntersectionObserver(e => on = e[0].isIntersecting).observe(cv);
  (function tick(t) {
    if (on) {
      ctx.clearRect(0, 0, W, H);
      const cols = getEmberCols();
      P.forEach((p, i) => {
        p.y -= p.v; p.x += Math.sin(t / 1500 + p.s) * .25;
        if (p.y < -10) P[i] = mk(false);
        ctx.beginPath(); ctx.fillStyle = `rgba(${p.c},${p.a * Math.min(1, p.y / (H * .5))})`; ctx.shadowColor = `rgb(${p.c})`; ctx.shadowBlur = 10;
        ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
      });
    }
    requestAnimationFrame(tick);
  })(0);
})();
