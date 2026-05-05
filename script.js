/* =====================================================
   Java Vectors – Educational Website
   script.js  |  Vanilla JavaScript – No dependencies
   ===================================================== */

'use strict';

/* ---- Mobile navigation ---- */
const navToggle = document.getElementById('nav-toggle');
const navMobile = document.getElementById('nav-mobile');

if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.querySelectorAll('span').forEach((s, i) => {
      if (isOpen) {
        if (i === 0) s.style.transform = 'rotate(45deg) translate(5px, 5px)';
        if (i === 1) s.style.opacity = '0';
        if (i === 2) s.style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        s.style.transform = '';
        s.style.opacity = '';
      }
    });
  });

  // Close on link click
  navMobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMobile.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    });
  });
}

/* ---- Back to top button ---- */
const backToTop = document.getElementById('back-to-top');

if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- Walkthrough tabs ---- */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    const container = btn.closest('.walkthrough-section') || document;

    container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const panel = container.querySelector(`[data-panel="${target}"]`);
    if (panel) {
      // Force display before applying the transition-triggering class
      panel.style.display = 'block';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => panel.classList.add('active'));
      });
    }
  });
});

/* ---- Copy code buttons ---- */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const block = btn.closest('.method-code-block, .walkthrough-code-block');
    if (!block) return;

    const codeEl = block.querySelector('.code-block-body, .walkthrough-code-body');
    if (!codeEl) return;

    const text = codeEl.innerText || codeEl.textContent;

    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = '✓ Copiado';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copiar';
        btn.classList.remove('copied');
      }, 2000);
    }).catch(() => {
      // Alternativa para navegadores más antiguos
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand('copy'); } catch (_) { /* */ }
      document.body.removeChild(ta);
      btn.textContent = '✓ Copiado';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copiar';
        btn.classList.remove('copied');
      }, 2000);
    });
  });
});

/* ---- Active nav section on scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"], .nav-mobile a[href^="#"]');

const observerOptions = {
  root: null,
  rootMargin: '-20% 0px -60% 0px',
  threshold: 0,
};

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.classList.toggle('active-section', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, observerOptions);

sections.forEach(s => sectionObserver.observe(s));

/* ---- Fade-in on scroll (staggered) ---- */
const fadeElements = document.querySelectorAll(
  '.concept-card, .method-card, .flow-step, .analysis-card, .glossary-item, .trouble-item, .intro-card'
);

if ('IntersectionObserver' in window) {
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeElements.forEach((el, idx) => {
    el.style.opacity = '0';
    // Stagger: items inside the same grid get increasing delay
    const parent = el.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(c => c === el || c.classList.contains(el.classList[0]));
      const pos = siblings.indexOf(el);
      if (pos > 0) el.style.animationDelay = `${pos * 0.07}s`;
    }
    fadeObserver.observe(el);
  });
}

/* ---- Scroll progress bar ---- */
const scrollProgress = document.getElementById('scroll-progress');

if (scrollProgress) {
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${pct}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ---- Counter animation for fact values ---- */
function animateCounter(el) {
  const raw = el.textContent.trim();
  const target = parseInt(raw, 10);
  if (isNaN(target)) return;

  const duration = 900;
  const start = performance.now();

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = raw; // restore original (e.g. "10–100")
  };

  requestAnimationFrame(tick);
}

const factValues = document.querySelectorAll('.fact-value');
if ('IntersectionObserver' in window && factValues.length) {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  factValues.forEach(el => counterObserver.observe(el));
}

/* ---- Hero parallax on mouse move ---- */
const hero = document.querySelector('.hero');
const heroDots = document.querySelector('.hero-dots');
const heroFactsCard = document.querySelector('.facts-card');

if (hero && heroDots) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (e.clientX - rect.left - cx) / cx; // -1 to 1
    const dy = (e.clientY - rect.top  - cy) / cy;

    heroDots.style.transform = `translate(${dx * 18}px, ${dy * 12}px)`;
    if (heroFactsCard) {
      heroFactsCard.style.transform = `translateY(calc(-10px + ${dy * -6}px)) translateX(${dx * -4}px)`;
    }
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    heroDots.style.transform = '';
    if (heroFactsCard) heroFactsCard.style.transform = '';
  });
}
