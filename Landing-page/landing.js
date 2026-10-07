// script.js
document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Implementation
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  function updateThemeUI(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      localStorage.setItem('vorkoo-theme', newTheme);
      updateThemeUI(newTheme);
    });
  }

  // Mobile Hamburger Navigation Toggle
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('open');
    });

    // Close mobile menu when clicking nav links
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Interactive UI Filter in Product Preview
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('#interactiveWorksList .work-item-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button style
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      workCards.forEach(card => {
        const cardStatus = card.getAttribute('data-status');
        if (filterValue === 'all' || cardStatus === filterValue) {
          card.style.display = 'grid';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal Dialog Trigger Logic
  const ctaModal = document.getElementById('ctaModal');
  const ctaTriggers = document.querySelectorAll('.modal-trigger');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  if (ctaModal) {
    ctaTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        ctaModal.hidden = false;
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        ctaModal.hidden = true;
      });
    }

    ctaModal.addEventListener('click', (e) => {
      if (e.target === ctaModal) {
        ctaModal.hidden = true;
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !ctaModal.hidden) {
        ctaModal.hidden = true;
      }
    });
  }

  // Seamless Demo Session Initialization
  const demoLinks = document.querySelectorAll('a[href*="home.html"]');
  demoLinks.forEach(link => {
    link.addEventListener('click', () => {
      try {
        localStorage.setItem('vorkoo-current-user', JSON.stringify({
          fullName: 'Demo User',
          email: 'demo@vorkoo.app',
          isDemo: true
        }));
      } catch (err) {
        console.warn('Could not set demo session in localStorage:', err);
      }
    });
  });

  // Service Worker Registration for PWA support (handles GitHub Pages subpaths)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('../sw.js', { scope: '../' })
        .then((reg) => {
          // SW registered successfully with repository subpath scope
        })
        .catch((err) => {
          console.warn('ServiceWorker registration error:', err);
        });
    });
  }
});