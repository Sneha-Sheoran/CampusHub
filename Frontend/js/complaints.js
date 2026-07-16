/* Grievance Portal Controller Module */

document.addEventListener('DOMContentLoaded', () => {
  Complaints.init();
});

const Complaints = {
  list: [],
  filteredList: [],

  init: function () {
    this.loadData();
    this.setupListeners();
    this.render();
  },

  loadData: function () {
    this.list = window.StorageManager.get(window.STORAGE_KEYS.COMPLAINTS) || [];
  },

  setupListeners: function () {
    const form = document.getElementById('complaint-form');
    const searchInput = document.getElementById('comp-search-input');
    const statusSelect = document.getElementById('comp-status-select');

    // Submit Action
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const required = ['title', 'description'];
        const isValid = window.FormValidator.validateRequired(form, required);

        if (!isValid) return;

        const formData = new FormData(form);
        const title = formData.get('title');
        const category = formData.get('category');
        const desc = formData.get('description');
        
        // Generate random tracking ID
        const trackingNum = Math.floor(1000 + Math.random() * 9000);
        const trackingId = `CH-COMP-${trackingNum}`;

        const newComplaint = {
          title: title,
          category: category,
          description: desc,
          status: 'pending',
          date: new Date().toISOString().split('T')[0],
          trackingId: trackingId
        };

        window.StorageManager.add(window.STORAGE_KEYS.COMPLAINTS, newComplaint);
        window.showToast(`Complaint filed! Tracking ID: ${trackingId}`, 'success');
        
        form.reset();
        this.loadData();
        this.filterAndSearch();
      });
    }

    const updateFilter = () => {
      this.filterAndSearch();
    };

    if (searchInput) searchInput.addEventListener('input', updateFilter);
    if (statusSelect) statusSelect.addEventListener('change', updateFilter);

    // Administrative status toggle click delegator
    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('.toggle-status-btn');
      if (!toggleBtn) return;

      const id = toggleBtn.getAttribute('data-id');
      this.simulateStatusCycle(id);
    });
  },

  simulateStatusCycle: function (id) {
    const complaint = this.list.find(c => c.id === id);
    if (!complaint) return;

    let nextStatus = 'pending';
    if (complaint.status === 'pending') {
      nextStatus = 'under review';
    } else if (complaint.status === 'under review') {
      nextStatus = 'resolved';
    } else {
      nextStatus = 'pending';
    }

    const updated = window.StorageManager.update(window.STORAGE_KEYS.COMPLAINTS, id, { status: nextStatus });
    if (updated) {
      window.showToast(`Updated status of ${complaint.trackingId} to: ${nextStatus.toUpperCase()}`, 'success');
      this.loadData();
      this.filterAndSearch();
    }
  },

  filterAndSearch: function () {
    const query = document.getElementById('comp-search-input')?.value || '';
    const selectedStatus = document.getElementById('comp-status-select')?.value || 'all';

    // 1. Search filter
    let results = window.SearchManager.search(this.list, query, ['title', 'description', 'trackingId']);

    // 2. Status filter
    const criteria = {};
    if (selectedStatus !== 'all') criteria.status = selectedStatus;
    results = window.SearchManager.filter(results, criteria);

    this.filteredList = results;
    this.render();
  },

  render: function () {
    const timeline = document.getElementById('complaints-timeline');
    if (!timeline) return;

    const queryActive = document.getElementById('comp-search-input')?.value || 
                         document.getElementById('comp-status-select')?.value !== 'all';

    const displayList = queryActive ? this.filteredList : this.list;

    if (displayList.length === 0) {
      timeline.innerHTML = `
        <div class="card reveal" style="border-left: none; margin-left: -2rem;">
          <div class="empty-state">
            <div class="empty-state-icon">⚖️</div>
            <div class="empty-state-title">No Grievances Found</div>
            <div class="empty-state-desc">All clean! There are no active complaints matching the selected parameters.</div>
          </div>
        </div>
      `;
      return;
    }

    timeline.innerHTML = displayList.map(comp => {
      const statusClass = this.getStatusBadgeClass(comp.status);
      const isResolved = comp.status === 'resolved';
      const isPending = comp.status === 'pending';
      const markerTypeClass = isResolved ? 'resolved' : (isPending ? 'pending' : '');
      
      return `
        <div class="timeline-item ${markerTypeClass} reveal fade-in">
          <div class="timeline-marker"></div>
          <div class="timeline-date">${comp.date}</div>
          
          <div class="card complaint-card" style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--spacing-sm);">
              <div>
                <span class="badge badge-primary" style="margin-right: var(--spacing-xs);">${comp.category}</span>
                <span style="font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; color: var(--color-text-muted);">${comp.trackingId}</span>
              </div>
              <span class="badge ${statusClass}">${comp.status}</span>
            </div>
            
            <h3 class="card-title" style="font-size: 1.15rem; margin-top: 4px;">${comp.title}</h3>
            <p class="card-body" style="font-size: 0.9rem; margin-bottom: var(--spacing-md);">${comp.description}</p>
            
            <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--color-border); padding-top: var(--spacing-sm);">
              <button class="btn btn-secondary btn-sm toggle-status-btn" data-id="${comp.id}" style="font-size: 0.75rem;">
                ⚙️ Simulate Status Change
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  getStatusBadgeClass: function (status) {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'under review': return 'badge-info';
      case 'resolved': return 'badge-success';
      default: return 'badge-primary';
    }
  }
};
