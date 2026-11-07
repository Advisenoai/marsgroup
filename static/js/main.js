/* =====================================================
   MarsGroup — main.js
   Minimal vanilla JS: star field + contact form UX
   ===================================================== */

/* ── Star field ─────────────────────────────────── */
(function generateStars() {
  const container = document.getElementById('stars');
  if (!container) return;

  const COUNT = 160;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < COUNT; i++) {
    const star = document.createElement('span');
    const size = Math.random() < 0.15 ? 2 : 1;
    const x    = Math.random() * 100;
    const y    = Math.random() * 100;
    const delay = (Math.random() * 6).toFixed(2);
    const dur   = (3 + Math.random() * 4).toFixed(2);
    const op    = (.3 + Math.random() * .7).toFixed(2);

    Object.assign(star.style, {
      position:        'absolute',
      left:            `${x}%`,
      top:             `${y}%`,
      width:           `${size}px`,
      height:          `${size}px`,
      borderRadius:    '50%',
      background:      '#ffffff',
      opacity:         op,
      animation:       `twinkle ${dur}s ${delay}s ease-in-out infinite alternate`,
    });

    fragment.appendChild(star);
  }

  container.appendChild(fragment);

  /* Inject keyframe once */
  if (!document.getElementById('twinkle-kf')) {
    const style = document.createElement('style');
    style.id = 'twinkle-kf';
    style.textContent = `
      @keyframes twinkle {
        from { opacity: var(--op-from, .3); transform: scale(1); }
        to   { opacity: 1;                  transform: scale(1.6); }
      }
    `;
    document.head.appendChild(style);
  }
})();


/* ── Scroll-reveal ──────────────────────────────── */
(function initReveal() {
  const targets = document.querySelectorAll(
    '.mission-card, .feature, .stat-card, .section-header'
  );

  if (!window.IntersectionObserver) return; // graceful degradation

  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(28px); transition: opacity .55s ease, transform .55s ease; }
    .reveal.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();


/* ── Contact form ───────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form || !note) return;

  function setNote(msg, type /* 'success' | 'error' | '' */) {
    note.textContent = msg;
    note.className = 'form-note' + (type ? ` form-note--${type}` : '');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setNote('', '');

    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const mission = form.querySelector('#mission').value;

    if (!name) {
      setNote('Please enter your full name.', 'error');
      form.querySelector('#name').focus();
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNote('Please enter a valid email address.', 'error');
      form.querySelector('#email').focus();
      return;
    }
    if (!mission) {
      setNote('Please select a mission.', 'error');
      form.querySelector('#mission').focus();
      return;
    }

    /* Simulate async submission */
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    await new Promise(r => setTimeout(r, 1200));

    btn.disabled = false;
    btn.textContent = 'Send Enquiry →';
    form.reset();
    setNote('🚀 Enquiry received! A mission specialist will reach out within 48 hours.', 'success');
  });
})();


/* ── Active nav link on scroll ──────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__links a[href^="#"]');
  if (!sections.length || !links.length) return;

  const style = document.createElement('style');
  style.textContent = `.nav__links a.active { color: var(--accent) !important; }`;
  document.head.appendChild(style);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const active = [...links].find(l => l.getAttribute('href') === `#${e.target.id}`);
      if (active) active.classList.add('active');
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(s => observer.observe(s));
})();

