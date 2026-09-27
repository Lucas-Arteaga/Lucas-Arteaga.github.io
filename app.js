/* ============================================================
   Lucas Arteaga — personal site
   Vanilla JS. No dependencies. Progressive enhancement:
   without JS the page is fully readable and visible.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. Language
     Both languages are in the HTML (crawlable). We only toggle which
     one is displayed, and remember the choice.
     ------------------------------------------------------------------ */
  var COPY = {
    en: {
      title: 'Lucas Arteaga — Petroleum Engineering · O&G Data & Automation',
      desc: 'Petroleum Engineering student at UBA and Technical Contract Analyst at Valbol Worcester. API 6A/6D compliance, well and production data, Python, SQL and automation.'
    },
    es: {
      title: 'Lucas Arteaga — Ingeniería en Petróleo · Datos y Automatización O&G',
      desc: 'Estudiante de Ingeniería en Petróleo (UBA) y Technical Contract Analyst en Valbol Worcester. Cumplimiento API 6A/6D, datos de pozo y producción, Python, SQL y automatización.'
    }
  };

  var titleEl = document.querySelector('title');
  var descEl = document.querySelector('meta[name="description"]');
  function setLang(lang) {
    if (lang !== 'en' && lang !== 'es') lang = 'en';
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);

    if (titleEl) titleEl.textContent = COPY[lang].title;
    if (descEl) descEl.setAttribute('content', COPY[lang].desc);

    Array.prototype.forEach.call(document.querySelectorAll('[data-lang-set]'), function (btn) {
      var on = btn.getAttribute('data-lang-set') === lang;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    try { localStorage.setItem('la-lang', lang); } catch { /* private mode: ignore */ }
    formatCounters(lang);
  }

  function initialLang() {
    var fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl === 'en' || fromUrl === 'es') return fromUrl;

    var stored = null;
    try { stored = localStorage.getItem('la-lang'); } catch { /* storage blocked: ignore */ }
    if (stored === 'en' || stored === 'es') return stored;

    return (navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en';
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-lang-set]'), function (btn) {
    btn.addEventListener('click', function () { setLang(btn.getAttribute('data-lang-set')); });
  });

  /* ------------------------------------------------------------------
     2. Animated counters
     ------------------------------------------------------------------ */
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  var locale = 'en-US';

  function formatCounters(lang) {
    locale = lang === 'es' ? 'es-AR' : 'en-US';
    counters.forEach(function (el) {
      var value = Number(el.getAttribute('data-count')) || 0;
      if (el.getAttribute('data-done') === '1') el.textContent = value.toLocaleString(locale);
    });
  }

  function runCounter(el) {
    var target = Number(el.getAttribute('data-count')) || 0;

    if (reduce) {
      el.textContent = target.toLocaleString(locale);
      el.setAttribute('data-done', '1');
      return;
    }

    var duration = 1300;
    var start = null;

    function step(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toLocaleString(locale);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString(locale);
        el.setAttribute('data-done', '1');
      }
    }
    requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------
     3. Reveal on scroll
     The .reveal class is applied here, never in the markup, so a
     JS-less page renders every section visible.
     ------------------------------------------------------------------ */
  var revealTargets = document.querySelectorAll(
    '.section > h2, .section > .section-lede, .card, .feature, .certs li, .principles li, .metric, .hero-copy > *, .hero-viz'
  );

  if (!('IntersectionObserver' in window) || reduce) {
    Array.prototype.forEach.call(revealTargets, function (el) {
      el.classList.remove('reveal');
    });
    Array.prototype.forEach.call(counters, runCounter);
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    Array.prototype.forEach.call(revealTargets, function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = Math.min(i % 6, 5) * 45 + 'ms';
      revealObserver.observe(el);
    });

    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { countObserver.observe(el); });

    /* ------------------------------------------------------------------
       4. Active section in the nav
       ------------------------------------------------------------------ */
    var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------------------------------------------------
     5. Reading progress + sticky bar state
     ------------------------------------------------------------------ */
  var progress = document.querySelector('#progress');
  var topbar = document.querySelector('.topbar');
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      if (progress) progress.style.width = pct + '%';
      if (topbar) topbar.classList.toggle('is-stuck', h.scrollTop > 8);
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------
     6. Misc
     ------------------------------------------------------------------ */
  var year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  setLang(initialLang());
  formatCounters(root.getAttribute('data-lang'));
})();
