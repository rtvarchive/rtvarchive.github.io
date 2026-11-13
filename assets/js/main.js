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
          
          // В ЛЮБОМ СЛУЧАЕ: очищаем форму и открываем модалку
          form.reset();
          const modal = document.getElementById('success-modal');
          if (modal) modal.classList.add('is-active');
          
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        })
        .catch(error => {
          console.error('Network error:', error);
          
          // Даже если упал интернет, показываем успех пользователю
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

})(); // Закрываем основную функцию


// =========================================================
// ЛОГИКА КНОПКИ "ПОКАЗАТЬ ВСЕ ПРОЕКТЫ" (АККОРДЕОН)
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  const projectGrid = document.getElementById('artist-list');
  if (!projectGrid) return;

  const cards = Array.from(projectGrid.querySelectorAll('.artist-card'));
  const itemsToShow = 6; // Показываем первые 6 карточек

  if (cards.length > itemsToShow) {
    // 1. Скрываем лишние карточки
    cards.forEach((card, index) => {
      if (index >= itemsToShow) {
        card.classList.add('is-hidden');
        card.style.display = 'none';
      }
    });

    // 2. Создаем контейнер для кнопки
    const btnContainer = document.createElement('div');
    btnContainer.style.textAlign = 'center';
    btnContainer.style.marginTop = '4rem'; // Чуть больше отступ
    btnContainer.style.width = '100%';

    // 3. Создаем саму кнопку
    const btn = document.createElement('button');
    // Задаем жесткие стили, чтобы никакой CSS сайта не мог испортить кнопку
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
    
    // Эффект при наведении
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

    // 4. Логика клика
    btn.addEventListener('click', () => {
      const hiddenCards = projectGrid.querySelectorAll('.is-hidden');
      
      if (hiddenCards.length > 0) {
        // Показываем
        hiddenCards.forEach(card => {
          card.classList.remove('is-hidden');
          card.style.display = '';
        });
        btn.textContent = isRu ? 'Свернуть проекты' : 'Show less';
      } else {
        // Скрываем
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

    // 5. Вставляем кнопку на страницу
    btnContainer.appendChild(btn);
    projectGrid.parentNode.insertBefore(btnContainer, projectGrid.nextSibling);
  }
});