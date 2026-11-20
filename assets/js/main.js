/* RADIUS ARCHIVE */
(function () {
  'use strict';
  
  // ==========================================
  // RADIUS ARCHIVE: Console Easter Egg
  // ==========================================
  console.log("%c> RADIUS ARCHIVE SYSTEM INITIALIZED", "color: #c83d73; font-size: 16px; font-weight: bold; font-family: monospace;");
  console.log("%c> OPERATOR ID: 7749", "color: #e8d8bb; font-size: 12px; font-family: monospace;");
  console.log("%c> PERSONNEL DOSSIER LOCATED AT: https://rtvarchive.github.io/resume/", "color: #6c8fa3; font-size: 14px; font-weight: bold; font-family: monospace;");
  console.log("%c> Welcome to the Engineering Dept.", "color: #7b9c91; font-size: 12px; font-family: monospace;");

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

  // Build waveform bars dynamically
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
    const chips = group.querySelectorAll('.chip:not([data-filter-more])');
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

  // Универсальный обработчик для кнопок "показать еще" (More / Less)
  const moreButtons = document.querySelectorAll('[data-filter-more], [data-channels-more]');
  
  moreButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = btn.getAttribute('aria-controls');
      const target = document.getElementById(targetId);
      
      if (!target) return;
      
      const isHidden = target.hasAttribute('hidden');
      
      if (isHidden) {
        target.removeAttribute('hidden');
        btn.setAttribute('aria-expanded', 'true');
        btn.textContent = btn.getAttribute('data-label-less') || '− Less';
      } else {
        target.setAttribute('hidden', '');
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = btn.getAttribute('data-label-more') || '+ More';
      }
    });
  });

  // Универсальный обработчик для всех форм на сайте
  document.addEventListener('DOMContentLoaded', () => {
    
    // --- ОТПРАВКА ФОРМ ---
    const forms = document.querySelectorAll('[data-testid="submission-form"], #report-form');
    
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const formData = new FormData(this);
        
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Transmitting...';
        submitBtn.disabled = true;
        
        fetch(this.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        })
        .then(response => {
          if (response.ok) {
            console.log('Formspark: Submission successful.');
          } else {
            console.warn('Formspark: Limit reached or error. Status:', response.status);
          }
          
          form.reset();
          const modal = document.getElementById('success-modal');
          if (modal) modal.classList.add('is-active');
          
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        })
        .catch(error => {
          console.error('Network error:', error);
          
          form.reset();
          const modal = document.getElementById('success-modal');
          if (modal) modal.classList.add('is-active');
          
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        });
      });
    });

    // --- ЗАКРЫТИЕ МОДАЛКИ (КРЕСТИК, КЛИК ПО ФОНУ, ESCAPE) ---
    const modal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');

    if (modal && closeModalBtn) {
      closeModalBtn.addEventListener('click', function() {
        modal.classList.remove('is-active');
      });

      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.classList.remove('is-active');
        }
      });

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) {
          modal.classList.remove('is-active');
        }
      });
    }
  });

  // =========================================================
  // ЛОГИКА КНОПКИ "ПОКАЗАТЬ ВСЕ ПРОЕКТЫ" (АККОРДЕОН)
  // =========================================================
  document.addEventListener('DOMContentLoaded', () => {
    const projectGrid = document.getElementById('artist-list');
    if (!projectGrid) return;

    const cards = Array.from(projectGrid.querySelectorAll('.artist-card'));
    const itemsToShow = 6;

    if (cards.length > itemsToShow) {
      cards.forEach((card, index) => {
        if (index >= itemsToShow) {
          card.classList.add('is-hidden');
          card.style.display = 'none';
        }
      });

      const btnContainer = document.createElement('div');
      btnContainer.style.textAlign = 'center';
      btnContainer.style.marginTop = '4rem';
      btnContainer.style.width = '100%';

      const btn = document.createElement('button');
      btn.style.setProperty('background', 'transparent', 'important');
      btn.style.setProperty('border', '1px solid var(--neon-cyan)', 'important');
      btn.style.setProperty('color', 'var(--neon-cyan)', 'important');
      btn.style.setProperty('padding', '1rem 2.5rem', 'important');
      btn.style.setProperty('font-size', '1.1rem', 'important');
      btn.style.setProperty('font-family', 'var(--ff-mono)', 'important');
      btn.style.setProperty('text-transform', 'uppercase', 'important');
      btn.style.setProperty('letter-spacing', '0.1em', 'important');
      btn.style.setProperty('cursor', 'pointer', 'important');
      btn.style.setProperty('border-radius', '4px', 'important');
      btn.style.setProperty('transition', 'all 0.3s', 'important');
      btn.style.setProperty('display', 'inline-block', 'important');
      
      btn.addEventListener('mouseover', () => {
        btn.style.setProperty('background', 'rgba(108, 143, 163, 0.1)', 'important');
        btn.style.setProperty('box-shadow', '0 0 15px rgba(108, 143, 163, 0.3)', 'important');
      });
      btn.addEventListener('mouseout', () => {
        btn.style.setProperty('background', 'transparent', 'important');
        btn.style.setProperty('box-shadow', 'none', 'important');
      });

      const isRu = document.documentElement.lang === 'ru';
      btn.textContent = isRu ? 'Показать все проекты' : 'Show all projects';
      btn.dataset.testid = 'btn-show-all-projects';

      btn.addEventListener('click', () => {
        const hiddenCards = projectGrid.querySelectorAll('.is-hidden');
        
        if (hiddenCards.length > 0) {
          hiddenCards.forEach(card => {
            card.classList.remove('is-hidden');
            card.style.display = '';
          });
          btn.textContent = isRu ? 'Свернуть проекты' : 'Show less';
        } else {
          cards.forEach((card, index) => {
            if (index >= itemsToShow) {
              card.classList.add('is-hidden');
              card.style.display = 'none';
            }
          });
          btn.textContent = isRu ? 'Показать все проекты' : 'Show all projects';
          projectGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      btnContainer.appendChild(btn);
      projectGrid.parentNode.insertBefore(btnContainer, projectGrid.nextSibling);
    }
  });

  // 1. Функция открытия/закрытия досье
  window.toggleDossier = function(id, btn) {
    const dossier = document.getElementById('dossier-' + id);
    if (!dossier) return;

    const isOpening = dossier.style.display === 'none' || dossier.style.display === '';

    if (isOpening) {
      dossier.style.display = 'block';
      
      if (btn) {
        const span = btn.querySelector('.dossier-btn-text') || btn;
        const isRu = document.documentElement.lang === 'ru' || window.location.pathname.includes('/ru/');
        span.textContent = isRu ? '▼ Закрыть архивное досье' : '▼ Close Archive Dossier';
      }

      const tabs = dossier.querySelectorAll('.folder-tabs .tab');
      const panes = dossier.querySelectorAll('.folder-content .tab-pane');
      tabs.forEach((t, i) => t.classList.toggle('is-active', i === 0));
      panes.forEach((p, i) => p.classList.toggle('is-active', i === 0));

    } else {
      dossier.style.display = 'none';
      
      if (btn) {
        const span = btn.querySelector('.dossier-btn-text') || btn;
        const isRu = document.documentElement.lang === 'ru' || window.location.pathname.includes('/ru/');
        span.textContent = isRu ? '▶ Открыть архивное досье' : '▶ Open Archive Dossier';
      }
    }
  };

  // 2. Делегирование кликов для вкладок
  document.addEventListener('click', function(e) {
    const tab = e.target.closest('.dossier-content .tab');
    if (!tab) return;

    e.preventDefault();

    const container = tab.closest('.dossier-content');
    const tabId = tab.getAttribute('data-tab');
    if (!container || !tabId) return;

    container.querySelectorAll('.tab').forEach(t => t.classList.remove('is-active'));
    container.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('is-active'));

    tab.classList.add('is-active');

    const dossierId = container.id.replace('dossier-', '');
    const pane = container.querySelector('#' + tabId + '-' + dossierId);
    
    if (pane) {
      pane.classList.add('is-active');
    }
  });

  // ==========================================
  // ЛАЙТБОКС ДЛЯ ФОТОГРАФИЙ
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    let lightbox = document.getElementById('photo-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'photo-lightbox';
      lightbox.className = 'photo-lightbox';
      lightbox.innerHTML = `
        <span class="photo-lightbox-close">&times;</span>
        <img class="photo-lightbox-img" src="" alt="Archive Photo">
      `;
      document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('.photo-lightbox-img');
    const closeBtn = lightbox.querySelector('.photo-lightbox-close');

    document.addEventListener('click', function(e) {
      if (e.target.tagName === 'IMG' && e.target.closest('.photo-item')) {
        lightboxImg.src = e.target.src;
        lightboxImg.alt = e.target.alt;
        lightbox.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('is-active');
        document.body.style.overflow = '';
      });
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-active')) {
        lightbox.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    });
  });
  
// =========================================================
// КНОПКА "ПОКАЗАТЬ ВСЕ" ДЛЯ ДОСЬЕ (ИСПРАВЛЕННЫЙ)
// =========================================================
document.addEventListener('click', function(e) {
  // Ищем кнопку
  const btn = e.target.closest('[data-more-btn]');
  if (!btn) return;
  
  // Предотвращаем стандартное поведение
  e.preventDefault();
  
  // Находим контейнер (вкладку), в которой находится кнопка
  const container = btn.closest('.tab-pane');
  if (!container) return;
  
  // Ищем все картинки, которые должны быть скрыты
  const hiddenItems = container.querySelectorAll('[data-more][hidden]');
  
  if (hiddenItems.length > 0) {
    // Если есть скрытые, показываем их
    hiddenItems.forEach(item => item.removeAttribute('hidden'));
    btn.textContent = btn.textContent.includes('Show') ? '− Show less' : '− Свернуть';
  } else {
    // Если все показаны, скрываем обратно
    const allItems = container.querySelectorAll('[data-more]');
    allItems.forEach(item => item.setAttribute('hidden', ''));
    btn.textContent = btn.textContent.includes('less') ? '+ Show all illustrations' : '+ Показать все иллюстрации';
  }
});

})(); // Закрываем основную функцию