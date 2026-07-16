/* Events Controller Module */

document.addEventListener('DOMContentLoaded', () => {
  EventsApp.init();
});

const EventsApp = {
  list: [],
  filteredList: [],
  selectedCategory: 'all',
  timerInterval: null,

  init: async function () {
    await this.loadEvents();
    this.renderFeatured();
    this.renderEventsGrid();
    this.setupListeners();
  },

  loadEvents: async function () {
    try {
      const response = await window.API.events.list('');
      this.list = response.data || [];
      this.filteredList = [...this.list];
    } catch (error) {
      this.list = [];
      this.filteredList = [];
      console.error('Failed to load events', error);
    }
  },

  renderFeatured: function () {
    const container = document.getElementById('featured-banner-container');
    if (!container) return;

    const featuredEvent = this.list.find(e => e.featured) || this.list[0];
    if (!featuredEvent) {
      container.style.display = 'none';
      return;
    }

    container.innerHTML = `
      <img src="${featuredEvent.image}" class="featured-image-bg" alt="${featuredEvent.title}">
      <div class="featured-content">
        <span class="badge badge-primary" style="align-self: flex-start; margin-bottom: var(--spacing-sm); font-size: 0.8rem;">FEATURED EVENT</span>
        <h2 style="font-size: 2.25rem; font-weight: 800; margin-bottom: var(--spacing-xs);">${featuredEvent.title}</h2>
        <p style="font-size: 1.05rem; opacity: 0.9; max-width: 600px; margin-bottom: var(--spacing-md);">${featuredEvent.description}</p>
        
        <div style="font-size: 0.95rem; display: flex; gap: var(--spacing-lg); margin-bottom: var(--spacing-md);">
          <span>📍 ${featuredEvent.location}</span>
          <span>👥 By ${featuredEvent.organizer}</span>
        </div>

        <div class="countdown-timer" id="featured-countdown" data-date="${featuredEvent.date}">
          <div class="countdown-block">
            <div class="countdown-number" id="cd-days">00</div>
            <div class="countdown-label">Days</div>
          </div>
          <div class="countdown-block">
            <div class="countdown-number" id="cd-hours">00</div>
            <div class="countdown-label">Hrs</div>
          </div>
          <div class="countdown-block">
            <div class="countdown-number" id="cd-minutes">00</div>
            <div class="countdown-label">Min</div>
          </div>
          <div class="countdown-block">
            <div class="countdown-number" id="cd-seconds">00</div>
            <div class="countdown-label">Sec</div>
          </div>
        </div>
        
        <div>
          <button class="btn btn-primary set-reminder-btn" data-id="${featuredEvent.id}">
            Set Reminder Notification
          </button>
        </div>
      </div>
    `;

    this.startCountdown(featuredEvent.date);
  },

  startCountdown: function (targetDateString) {
    if (this.timerInterval) clearInterval(this.timerInterval);

    const targetDate = new Date(targetDateString).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      const daysEl = document.getElementById('cd-days');
      const hoursEl = document.getElementById('cd-hours');
      const minutesEl = document.getElementById('cd-minutes');
      const secondsEl = document.getElementById('cd-seconds');

      if (difference <= 0) {
        clearInterval(this.timerInterval);
        if (daysEl) {
          document.getElementById('featured-countdown').innerHTML = `
            <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; background: var(--color-success); padding: var(--spacing-sm) var(--spacing-md); border-radius: var(--radius-md);">
              🚀 EVENT STARTED
            </div>
          `;
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
    };

    updateTimer();
    this.timerInterval = setInterval(updateTimer, 1000);
  },

  setupListeners: function () {
    // 1. Filter Category Tabs
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.selectedCategory = tab.getAttribute('data-category');
        this.filterAndSearch();
      });
    });

    // 2. Search Input
    const searchInput = document.getElementById('events-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this.filterAndSearch();
      });
    }

    // 3. Reminder buttons delegation (since grid updates dynamically)
    document.addEventListener('click', (e) => {
      const reminderBtn = e.target.closest('.set-reminder-btn');
      if (!reminderBtn) return;

      const eventId = reminderBtn.getAttribute('data-id');
      const isSet = reminderBtn.classList.toggle('btn-accent');
      
      if (isSet) {
        reminderBtn.innerText = '🔔 Reminder Scheduled';
        window.showToast('We will notify you 30 minutes before the event!', 'success');
      } else {
        reminderBtn.innerText = 'Set Reminder Notification';
        window.showToast('Reminder cancelled.', 'primary');
      }
    });
  },

  filterAndSearch: function () {
    const searchQuery = document.getElementById('events-search-input')?.value || '';
    
    // Search filter
    let results = window.SearchManager.search(this.list, searchQuery, ['title', 'description', 'organizer', 'location']);

    // Category filter
    if (this.selectedCategory !== 'all') {
      results = window.SearchManager.filter(results, { category: this.selectedCategory });
    }

    this.filteredList = results;
    this.renderEventsGrid();
  },

  renderEventsGrid: function () {
    const grid = document.getElementById('events-grid');
    if (!grid) return;

    if (this.filteredList.length === 0) {
      grid.innerHTML = `
        <div class="card w-100 reveal" style="grid-column: 1 / -1;">
          <div class="empty-state">
            <div class="empty-state-icon">📅</div>
            <div class="empty-state-title">No Events Scheduled</div>
            <div class="empty-state-desc">There are no events matches in this category. Check back later or create a search refinement.</div>
          </div>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.filteredList.map(event => {
      const dateObj = new Date(event.date);
      const isPassed = dateObj.getTime() < new Date().getTime();
      return `
        <div class="card reveal fade-in" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div class="event-card-img-container">
              <img src="${event.image}" alt="${event.title}">
              <span class="badge badge-secondary" style="position: absolute; bottom: var(--spacing-sm); left: var(--spacing-sm);">${event.category}</span>
            </div>
            
            <div style="padding-top: var(--spacing-md);">
              <h3 class="card-title" style="font-size: 1.25rem;">${event.title}</h3>
              
              <div class="event-meta-info">
                <span>📅 ${dateObj.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} at ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span>📍 ${event.location}</span>
                <span>👥 ${event.organizer}</span>
              </div>
              
              <p class="card-body" style="font-size: 0.9rem; margin-bottom: 0;">${event.description}</p>
            </div>
          </div>
          
          <div class="card-footer" style="margin-top: var(--spacing-lg);">
            <span style="font-size: 0.8rem; font-weight: 600; color: ${isPassed ? 'var(--color-text-muted)' : 'var(--color-success)'}">
              ${isPassed ? '🔴 Completed' : '🟢 Upcoming'}
            </span>
            <button class="btn btn-secondary btn-sm set-reminder-btn" data-id="${event.id}" ${isPassed ? 'disabled' : ''}>
              ${isPassed ? 'Passed' : 'Set Reminder'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
};
