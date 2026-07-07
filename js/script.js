/* ==========================================================================
   ANI-MELODY — FOUNDATION SCRIPT
   Phase 1: Loading screen, navbar behavior, theme toggle, mobile menu.
   Vanilla JS only. Each feature is isolated in its own init function so
   later phases can add modules without touching this file's core wiring.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     Loading Screen
     Hides once the window has fully loaded (images, fonts, etc). A minimum
     display time avoids an unpleasant "flash" on fast connections.
     ------------------------------------------------------------------------ */
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    const MIN_DISPLAY_MS = 600;
    const shownAt = Date.now();

    function hideLoader() {
      const elapsed = Date.now() - shownAt;
      const remaining = Math.max(MIN_DISPLAY_MS - elapsed, 0);
      window.setTimeout(() => {
        loader.classList.add('is-hidden');
        // Remove from tab order / a11y tree once hidden
        loader.setAttribute('aria-hidden', 'true');
      }, remaining);
    }

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
      // Safety net: never let the loader block the site for more than 4s
      window.setTimeout(hideLoader, 4000);
    }
  }

  /* ------------------------------------------------------------------------
     Navbar scroll state
     Adds a subtle shadow/border once the user scrolls past the top.
     ------------------------------------------------------------------------ */
  function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    function onScroll() {
      navbar.classList.toggle('is-scrolled', window.scrollY > 8);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------------
     Mobile hamburger menu
     ------------------------------------------------------------------------ */
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('navbarOverlay');
    if (!hamburger || !mobileMenu) return;

    function closeMenu() {
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
      if (overlay) overlay.hidden = true;
    }

    function openMenu() {
      hamburger.classList.add('is-active');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close menu');
      mobileMenu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (overlay) overlay.hidden = false;
    }

    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    // Tapping the dimmed backdrop closes the drawer — expected mobile pattern
    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // Close when a nav link inside the drawer is tapped
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape for keyboard users
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // Close if resized back to desktop width
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  /* ------------------------------------------------------------------------
     Theme toggle (Dark / Light)
     Persists preference in localStorage; respects system preference on
     first visit if no preference has been saved yet.
     ------------------------------------------------------------------------ */
  const THEME_KEY = 'ani-melody-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);

    const themeColor = theme === 'light' ? '#f4f4f9' : '#0b0b16';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', themeColor);

    updateThemeIcon(theme);
  }

  function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (!icon) return;

    // Sun icon for light mode, moon icon for dark mode
    if (theme === 'light') {
      icon.innerHTML = '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>';
    } else {
      icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"></path>';
    }
  }

  function initThemeToggle() {
    const stored = window.localStorage.getItem(THEME_KEY);
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initial = stored || (prefersLight ? 'light' : 'dark');
    applyTheme(initial);

    function toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      window.localStorage.setItem(THEME_KEY, next);
    }

    const desktopBtn = document.getElementById('themeToggle');
    const mobileBtn = document.getElementById('themeToggleMobile');
    if (desktopBtn) desktopBtn.addEventListener('click', toggleTheme);
    if (mobileBtn) mobileBtn.addEventListener('click', toggleTheme);
  }

  /* ------------------------------------------------------------------------
     Active nav link highlighting
     Matches the current page filename against nav links so the correct
     item gets the `.is-active` state (works across index/anime/search/etc).
     ------------------------------------------------------------------------ */
  function initActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar__link, .bottom-nav__link').forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('is-active', href === currentPage);
    });
  }

  /* ------------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------------ */
  function initFooterYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------------
     Scroll-reveal
     Lightweight IntersectionObserver-based fade-in for elements marked
     with [data-reveal]. Available now so future homepage sections can
     simply add the attribute without extra JS wiring.
     ------------------------------------------------------------------------ */
  function initScrollReveal() {
    const targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------------
     PHASE 2 — Hero particles
     Generates a handful of small drifting motes inside #heroParticles.
     Purely decorative (aria-hidden container), skipped for users who
     prefer reduced motion.
     ------------------------------------------------------------------------ */
  function initHeroParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const colors = ['var(--neon-purple)', 'var(--neon-blue)', 'var(--spectrum-pink)'];
    const PARTICLE_COUNT = 24;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement('span');
      particle.className = 'hero__particle';
      particle.style.setProperty('--left', `${Math.random() * 100}%`);
      particle.style.setProperty('--size', `${2 + Math.random() * 3}px`);
      particle.style.setProperty('--duration', `${8 + Math.random() * 10}s`);
      particle.style.setProperty('--delay', `${Math.random() * 10}s`);
      particle.style.setProperty('--color', colors[i % colors.length]);
      container.appendChild(particle);
    }
  }

  /* ------------------------------------------------------------------------
     PHASE 2 — Trending carousel controls
     Arrow buttons scroll the trending strip by roughly one card's width.
     Native scroll-snap (CSS) handles the settling; this just nudges it.
     ------------------------------------------------------------------------ */
  function initTrendingCarousel() {
    const track = document.getElementById('trendingCarousel');
    const prevBtn = document.getElementById('trendingPrev');
    const nextBtn = document.getElementById('trendingNext');
    if (!track || !prevBtn || !nextBtn) return;

    function scrollByCard(direction) {
      const card = track.querySelector('.anime-card');
      const cardWidth = card ? card.getBoundingClientRect().width : 240;
      track.scrollBy({ left: direction * (cardWidth + 20), behavior: 'smooth' });
    }

    prevBtn.addEventListener('click', () => scrollByCard(-1));
    nextBtn.addEventListener('click', () => scrollByCard(1));
  }

  /* ------------------------------------------------------------------------
     PHASE 2 — Hero scroll cue
     Clicking the little scroll indicator jumps to the first content
     section after the hero.
     ------------------------------------------------------------------------ */
  function initHeroScrollCue() {
    const cue = document.getElementById('heroScrollCue');
    if (!cue) return;

    cue.addEventListener('click', () => {
      const hero = cue.closest('.hero');
      const next = hero ? hero.nextElementSibling : null;
      if (next) next.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------------
     Init
     ------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initNavbarScroll();
    initMobileMenu();
    initActiveNavLink();
    initFooterYear();
    initScrollReveal();
    initHeroParticles();
    initTrendingCarousel();
    initHeroScrollCue();
  });

  // Loader listens on window load, so it's registered outside DOMContentLoaded
  initLoader();
})();
