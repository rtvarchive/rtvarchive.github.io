/* Sonomir — minimal vanilla JS */
(function () {
  'use strict';

  // Mobile nav toggle
  const toggle = document.querySelector('[data-menu-toggle]');
  const navList = document.querySelector('[data-nav-list]');
  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      const open = navList.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'Close' : 'Menu';
    });
  }

  // Build waveform bars dynamically (deterministic seed for consistent rendering)
  const wave = document.querySelector('[data-waveform]');
  if (wave) {
    const heights = [22, 38, 64, 48, 90, 72, 55, 28, 44, 80, 92, 60, 36, 52, 74, 88, 46, 30, 58, 82, 68, 42, 26, 70, 95, 55, 38, 62, 84, 48];
    heights.forEach((h, i) => {
      const bar = document.createElement('span');
      bar.className = 'waveform__bar';
      bar.style.animationDelay = `${(i % 12) * 80}ms`;
      bar.style.height = `${h}%`;
      wave.appendChild(bar);
    });
  }

  // Filter chips on releases / artists pages
  document.querySelectorAll('[data-filter-group]').forEach((group) => {
    const chips = group.querySelectorAll('.chip');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('is-on'));
        chip.classList.add('is-on');
        const target = chip.getAttribute('data-filter');
        const list = document.querySelector(group.getAttribute('data-filter-target'));
        if (!list) return;
        list.querySelectorAll('[data-tag]').forEach((card) => {
          if (target === 'all' || card.getAttribute('data-tag').includes(target)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  });

  // Reveal on scroll (light)
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -10% 0px' });

    reveals.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
      io.observe(el);
    });
  }

  // Year stamp
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
