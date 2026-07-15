/* Common UI & Layout Helper Module */

document.addEventListener('DOMContentLoaded', () => {
  UI.init();
});

const UI = {
  init: function () {
    this.initTheme();
    this.initScrollProgress();
    this.initStickyNavbar();
    this.initMobileMenu();
    this.initBackToTop();
    this.initNotificationsBell();
    this.initProfileDropdown();
    this.initRipples();
    this.initRevealOnScroll();
    this.initAccordion();
  },

  // 1. Theme Toggler
  initTheme: function () {
    if (window.ThemeManager) {
      window.ThemeManager.initThemeToggle('theme-toggle-btn');
    }
  },

  // 2. Scroll Progress Bar
  initScrollProgress: function () {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'scroll-progress-container';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    progressContainer.appendChild(progressBar);
    
    document.body.prepend(progressContainer);

    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = scrolled + '%';
    });
  },

  // 3. Sticky Header
  initStickyNavbar: function () {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  },

  // 4. Mobile hamburger toggle
  initMobileMenu: function () {
    const btn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (!btn || !navLinks) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('active');
      
      // Animate hamburger lines
      const spans = btn.querySelectorAll('span');
      if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !btn.contains(e.target)) {
        navLinks.classList.remove('active');
        const spans = btn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  },

  // 5. Back To Top
  initBackToTop: function () {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    `;
    btn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  // 6. Toast Notifications stack
  showToast: function (message, type = 'primary') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Choose icon based on type
    let icon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    `;
    if (type === 'success') {
      icon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `;
    } else if (type === 'warning') {
      icon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      `;
    } else if (type === 'error') {
      icon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `;
    }

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        container.removeChild(toast);
      }, 300);
    }, 3000);
  },

  // 7. Notification Bell UI
  initNotificationsBell: function () {
    const bell = document.querySelector('.bell-container');
    if (!bell) return;

    bell.addEventListener('click', (e) => {
      e.stopPropagation();
      bell.classList.toggle('active');
      // Deactivate profile menu if active
      const profile = document.querySelector('.profile-container');
      if (profile) profile.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
      if (!bell.contains(e.target)) {
        bell.classList.remove('active');
      }
    });
  },

  // 8. Profile Dropdown
  initProfileDropdown: function () {
    const profile = document.querySelector('.profile-container');
    if (!profile) return;

    profile.addEventListener('click', (e) => {
      e.stopPropagation();
      profile.classList.toggle('active');
      // Deactivate bell if active
      const bell = document.querySelector('.bell-container');
      if (bell) bell.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
      if (!profile.contains(e.target)) {
        profile.classList.remove('active');
      }
    });
  },

  // 9. Button Ripple Effect
  initRipples: function () {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn) return;

      // Ensure button handles relative position
      const prevPosition = window.getComputedStyle(btn).position;
      if (prevPosition !== 'relative' && prevPosition !== 'absolute' && prevPosition !== 'fixed') {
        btn.style.position = 'relative';
      }
      btn.style.overflow = 'hidden';

      const circle = document.createElement('span');
      circle.className = 'ripple';
      
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = `${size}px`;

      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;

      // Remove existing ripples if any
      const existing = btn.querySelector('.ripple');
      if (existing) {
        existing.remove();
      }

      btn.appendChild(circle);

      circle.addEventListener('animationend', () => {
        circle.remove();
      });
    });
  },

  // 10. Reveal on scroll using Intersection Observer
  initRevealOnScroll: function () {
    if (!('IntersectionObserver' in window)) {
      // Fallback: make all visible if browser doesn't support observer
      const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
      elements.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    elements.forEach(el => observer.observe(el));
  },

  // 11. Accordion logic
  initAccordion: function () {
    document.addEventListener('click', (e) => {
      const header = e.target.closest('.accordion-header');
      if (!header) return;

      const item = header.closest('.accordion-item');
      if (!item) return;

      const accordion = item.closest('.accordion');
      const content = item.querySelector('.accordion-content');
      
      // Close sibling items
      if (accordion) {
        const activeItems = accordion.querySelectorAll('.accordion-item.active');
        activeItems.forEach(ai => {
          if (ai !== item) {
            ai.classList.remove('active');
            ai.querySelector('.accordion-content').style.maxHeight = '0';
          }
        });
      }

      item.classList.toggle('active');
      if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    });
  }
};

window.UI = UI;
window.showToast = UI.showToast;
