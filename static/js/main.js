/* =====================================================
   Mars Groups — main.js
   Hero slider · scroll-reveal · count-up · contact form
   ===================================================== */

/* ── Hero Slider ─────────────────────────────────── */
(function initSlider() {
  const slides = document.querySelectorAll('.hero__slide');
  const dots   = document.querySelectorAll('.hero__dot');
  const prev   = document.querySelector('.hero__arrow--prev');
  const next   = document.querySelector('.hero__arrow--next');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function advance() { goTo(current + 1); }

  function startAuto() { timer = setInterval(advance, 5000); }
  function stopAuto()  { clearInterval(timer); }

  startAuto();

  if (next) next.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
  if (prev) prev.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
  });

  // Pause on hover
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mouseenter', stopAuto);
    hero.addEventListener('mouseleave', startAuto);
  }
})();


/* ── Scroll-reveal ───────────────────────────────── */
(function initReveal() {
  if (!window.IntersectionObserver) return;

  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(32px); transition: opacity .6s ease, transform .6s ease; }
    .reveal.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll(
    '.segment-card, .project-card, .feature, .news-card, .stat-card, .section-header, .contact__info'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => observer.observe(el));
})();


/* ── Count-up animation ──────────────────────────── */
(function initCountUp() {
  const cards = document.querySelectorAll('.stat-card__value[data-target]');
  if (!cards.length || !window.IntersectionObserver) return;

  function countUp(el, target, suffix) {
    const duration = 1800;
    const start = performance.now();
    const isDecimal = target.toString().includes('.');

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = eased * parseFloat(target);
      el.textContent = (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const raw = el.dataset.target || '';
      const match = raw.match(/^([\d.]+)(.*)$/);
      if (match) countUp(el, match[1], match[2]);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  cards.forEach(c => observer.observe(c));
})();


/* ── Active nav on scroll ────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__links a[href^="#"]');
  if (!sections.length || !links.length || !window.IntersectionObserver) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const active = [...links].find(l => l.getAttribute('href') === `#${e.target.id}`);
      if (active) active.classList.add('active');
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(s => observer.observe(s));
})();


/* ── Back to top ─────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  // Inject style
  const style = document.createElement('style');
  style.textContent = `
    .back-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 999;
      width: 42px; height: 42px;
      background: var(--red);
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 1.1rem;
      cursor: pointer;
      opacity: 0;
      transform: translateY(12px);
      transition: opacity .3s, transform .3s, background .2s;
      box-shadow: 0 4px 16px rgba(196,18,48,.35);
    }
    .back-to-top.visible { opacity: 1; transform: translateY(0); }
    .back-to-top:hover { background: var(--red-dark); }
  `;
  document.head.appendChild(style);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();


/* ── Contact form ────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form || !note) return;

  function setNote(msg, type) {
    note.textContent = msg;
    note.className = 'form-note' + (type ? ` form-note--${type}` : '');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setNote('', '');

    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const project = form.querySelector('#project').value;

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
    if (!project) {
      setNote('Please select a project.', 'error');
      form.querySelector('#project').focus();
      return;
    }

    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    await new Promise(r => setTimeout(r, 1200));

    btn.disabled = false;
    btn.textContent = 'Send Enquiry →';
    form.reset();
    setNote('✅ Enquiry received! A project advisor will reach out within 24 hours.', 'success');
  });
})();
