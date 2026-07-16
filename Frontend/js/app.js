/* CampusHub Dashboard Core Controller */

document.addEventListener('DOMContentLoaded', () => {
  Dashboard.init();
});

const Dashboard = {
  init: function () {
    this.renderHeaderNotices();
    this.renderHomePreviews();
    this.initStatsCounter();
  },

  // 1. Render notifications in header bell
  renderHeaderNotices: function () {
    const listEl = document.getElementById('header-notices-list');
    if (!listEl) return;

    const notices = window.StorageManager.get(window.STORAGE_KEYS.NOTICES) || [];
    const importantNotices = notices.filter(n => n.important).slice(0, 3);
    
    if (importantNotices.length === 0) {
      listEl.innerHTML = `
        <div style="padding: var(--spacing-md); text-align: center; color: var(--color-text-muted); font-size: 0.85rem;">
          No new notifications.
        </div>
      `;
      const badge = document.querySelector('.bell-badge');
      if (badge) badge.style.display = 'none';
      return;
    }

    listEl.innerHTML = importantNotices.map(notice => `
      <div class="notification-item" onclick="location.href='notice-board.html'">
        <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
          <span class="badge badge-danger" style="padding: 1px 4px; font-size: 0.65rem;">Important</span>
          <span style="font-size: 0.75rem; color: var(--color-text-muted);">${notice.date}</span>
        </div>
        <div style="font-weight: 600; color: var(--color-text-primary); margin-bottom: 2px;">${notice.title}</div>
        <div style="font-size: 0.8rem; color: var(--color-text-secondary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
          ${notice.content}
        </div>
      </div>
    `).join('');
  },

  // 2. Render all previews on Home Dashboard
  renderHomePreviews: function () {
    // 2a. Notices
    const noticesGrid = document.getElementById('home-notices-grid');
    if (noticesGrid) {
      const notices = window.StorageManager.get(window.STORAGE_KEYS.NOTICES) || [];
      const recentNotices = notices.slice(0, 3);
      
      if (recentNotices.length === 0) {
        noticesGrid.innerHTML = '<div class="empty-state">No notices listed yet.</div>';
      } else {
        noticesGrid.innerHTML = recentNotices.map(notice => `
          <div class="card notice-item-home" onclick="location.href='notice-board.html'">
            <div class="notice-meta">
              <span class="badge ${this.getNoticeCategoryClass(notice.category)}">${notice.category}</span>
              <span>${notice.date}</span>
            </div>
            <h3 class="card-title" style="font-size: 1.15rem;">${notice.title}</h3>
            <p class="card-body" style="font-size: 0.85rem; margin-bottom: 0;">
              ${notice.content.length > 120 ? notice.content.substring(0, 120) + '...' : notice.content}
            </p>
          </div>
        `).join('');
      }
    }

    // 2b. Events
    const eventsGrid = document.getElementById('home-events-grid');
    if (eventsGrid) {
      const events = window.StorageManager.get(window.STORAGE_KEYS.EVENTS) || [];
      const upcomingEvents = events.slice(0, 3);

      if (upcomingEvents.length === 0) {
        eventsGrid.innerHTML = '<div class="empty-state">No events scheduled.</div>';
      } else {
        eventsGrid.innerHTML = upcomingEvents.map(event => `
          <div class="card" onclick="location.href='events.html'">
            <div style="position: relative; border-radius: var(--radius-md); overflow: hidden; height: 160px; margin-bottom: var(--spacing-md);">
              <img src="${event.image}" alt="${event.title}" style="width: 100%; height: 100%; object-fit: cover;">
              <span class="badge badge-primary" style="position: absolute; top: var(--spacing-sm); left: var(--spacing-sm);">${event.category}</span>
            </div>
            <h3 class="card-title" style="font-size: 1.15rem;">${event.title}</h3>
            <p class="card-subtitle" style="margin-bottom: var(--spacing-sm);">📅 ${new Date(event.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            <p class="card-body" style="font-size: 0.85rem; margin-bottom: 0;">${event.description.substring(0, 80)}...</p>
          </div>
        `).join('');
      }
    }

    // 2c. Lost & Found Items
    const lostfoundGrid = document.getElementById('home-lostfound-grid');
    if (lostfoundGrid) {
      const items = window.StorageManager.get(window.STORAGE_KEYS.LOST_FOUND) || [];
      const recentItems = items.slice(0, 3);

      if (recentItems.length === 0) {
        lostfoundGrid.innerHTML = '<div class="empty-state">No items reported.</div>';
      } else {
        lostfoundGrid.innerHTML = recentItems.map(item => `
          <div class="card" style="display: flex; gap: var(--spacing-md); align-items: center; padding: var(--spacing-md); cursor: pointer;" onclick="location.href='lost-found.html'">
            <img src="${item.image}" alt="${item.name}" style="width: 72px; height: 72px; border-radius: var(--radius-md); object-fit: cover;">
            <div style="flex-grow: 1;">
              <span class="badge ${item.type === 'lost' ? 'badge-danger' : 'badge-success'}" style="font-size: 0.65rem; margin-bottom: var(--spacing-xs);">${item.type}</span>
              <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 2px;">${item.name}</h4>
              <p style="font-size: 0.8rem; color: var(--color-text-muted); margin: 0;">📍 ${item.location}</p>
            </div>
          </div>
        `).join('');
      }
    }

    // 2d. Marketplace
    const marketplaceGrid = document.getElementById('home-marketplace-grid');
    if (marketplaceGrid) {
      const items = window.StorageManager.get(window.STORAGE_KEYS.MARKETPLACE) || [];
      const recentMarket = items.slice(0, 3);

      if (recentMarket.length === 0) {
        marketplaceGrid.innerHTML = '<div class="empty-state">No items for sale.</div>';
      } else {
        marketplaceGrid.innerHTML = recentMarket.map(item => `
          <div class="card" style="display: flex; gap: var(--spacing-md); align-items: center; padding: var(--spacing-md); cursor: pointer;" onclick="location.href='marketplace.html'">
            <img src="${item.image}" alt="${item.name}" style="width: 72px; height: 72px; border-radius: var(--radius-md); object-fit: cover;">
            <div style="flex-grow: 1;">
              <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 2px;">${item.name}</h4>
              <p style="font-size: 0.8rem; color: var(--color-text-muted); margin: 0;">By ${item.seller} • ${item.category}</p>
            </div>
            <div style="font-weight: 800; color: var(--color-primary); font-size: 1.1rem;">
              ₹${item.price}
            </div>
          </div>
        `).join('');
      }
    }
  },

  // 3. Animated Statistics Counters
  initStatsCounter: function () {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length === 0) return;

    const runCounters = () => {
      stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const speed = 200; // Lower number means faster
        const count = parseInt(stat.innerText);
        const increment = Math.ceil(target / speed);

        const updateCount = () => {
          const current = parseInt(stat.innerText);
          if (current < target) {
            stat.innerText = current + increment > target ? target : current + increment;
            setTimeout(updateCount, 15);
          } else {
            stat.innerText = target;
          }
        };
        updateCount();
      });
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            runCounters();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      const statsSection = document.querySelector('.stats-container');
      if (statsSection) observer.observe(statsSection);
    } else {
      runCounters();
    }
  },

  getNoticeCategoryClass: function (category) {
    switch (category) {
      case 'academic': return 'badge-primary';
      case 'placement': return 'badge-secondary';
      case 'holiday': return 'badge-warning';
      case 'events': return 'badge-info';
      case 'exams': return 'badge-danger';
      default: return 'badge-primary';
    }
  }
};
