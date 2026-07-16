/* Theme Management Module */
(function () {
  // Apply theme immediately to avoid flash of incorrect style
  const savedTheme = localStorage.getItem('campushub-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
  
  const applyTheme = (dark) => {
    if (dark) {
      document.documentElement.classList.add('dark-theme');
      document.body?.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.body?.classList.remove('dark-theme');
    }
  };

  // Apply immediately to documentElement
  if (isDark) {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }

  // Apply to body as soon as DOM is ready
  const applyToBody = () => {
    applyTheme(isDark);
  };
  if (document.body) {
    applyToBody();
  } else {
    document.addEventListener('DOMContentLoaded', applyToBody);
  }

  // Listen to storage events to sync across tabs/pages
  window.addEventListener('storage', (e) => {
    if (e.key === 'campushub-theme') {
      const dark = e.newValue === 'dark';
      applyTheme(dark);
      
      const toggleBtn = document.getElementById('theme-toggle-btn');
      if (toggleBtn && window.ThemeManager) {
        window.ThemeManager.updateToggleUI(toggleBtn);
      }
    }
  });
})();

// Exportable functions
window.ThemeManager = {
  initThemeToggle: function (toggleBtnId) {
    const toggleBtn = document.getElementById(toggleBtnId);
    if (!toggleBtn) return;

    // Set initial icon state or text based on active theme
    this.updateToggleUI(toggleBtn);

    toggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark-theme');
      if (isDark) {
        document.documentElement.classList.remove('dark-theme');
        document.body.classList.remove('dark-theme');
        localStorage.setItem('campushub-theme', 'light');
      } else {
        document.documentElement.classList.add('dark-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('campushub-theme', 'dark');
      }
      this.updateToggleUI(toggleBtn);
      
      // Dispatch custom event for pages that need to update drawing charts etc.
      window.dispatchEvent(new CustomEvent('themechanged', { detail: { isDark: !isDark } }));
    });
  },

  updateToggleUI: function (btn) {
    const isDark = document.documentElement.classList.contains('dark-theme');
    // Set icon or text. We assume an SVG is embedded or icon font.
    // We will use SVG switches inside JS or simple text/Unicode icons like ☀️ and 🌙
    if (isDark) {
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      `;
      btn.setAttribute('aria-label', 'Switch to Light Mode');
    } else {
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      `;
      btn.setAttribute('aria-label', 'Switch to Dark Mode');
    }
  }
};
