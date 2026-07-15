/* Lost & Found Page Controller */

document.addEventListener('DOMContentLoaded', () => {
  LostFoundApp.init();
});

const LostFoundApp = {
  list: [],
  filteredList: [],
  selectedType: 'all',

  init: function () {
    this.loadData();
    this.setupDrawer();
    this.setupListeners();
    this.render();
  },

  loadData: function () {
    this.list = window.StorageManager.get(window.STORAGE_KEYS.LOST_FOUND) || [];
  },

  setupDrawer: function () {
    const overlay = document.getElementById('report-drawer-overlay');
    const openBtn = document.getElementById('open-report-drawer-btn');
    const closeBtn = document.getElementById('close-report-drawer-btn');
    const cancelBtn = document.getElementById('cancel-report-btn');
    const form = document.getElementById('lf-report-form');

    const openDrawer = () => {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock body scroll
    };

    const closeDrawer = () => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      form.reset();
      window.FormValidator.clearAllErrors(form);
    };

    if (openBtn) openBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (cancelBtn) cancelBtn.addEventListener('click', closeDrawer);

    // Form Submit
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate required inputs
        const required = ['name', 'description', 'location', 'contact'];
        const isValid = window.FormValidator.validateRequired(form, required);
        
        if (!isValid) return;

        // Gather form fields
        const formData = new FormData(form);
        const itemType = formData.get('type');
        const itemName = formData.get('name');
        const itemCategory = formData.get('category');
        const itemDesc = formData.get('description');
        const itemLoc = formData.get('location');
        const itemContact = formData.get('contact');
        let itemImage = formData.get('image').trim();

        // Assign placeholder image if URL is omitted
        if (!itemImage) {
          itemImage = this.getDefaultCategoryImage(itemCategory);
        }

        const newItem = {
          type: itemType,
          name: itemName,
          category: itemCategory,
          description: itemDesc,
          location: itemLoc,
          contact: itemContact,
          image: itemImage,
          date: new Date().toISOString().split('T')[0]
        };

        window.StorageManager.add(window.STORAGE_KEYS.LOST_FOUND, newItem);
        window.showToast(`${itemType === 'lost' ? 'Lost' : 'Found'} item reported successfully!`, 'success');
        
        this.loadData();
        this.filterAndSearch();
        closeDrawer();
      });
    }
  },

  setupListeners: function () {
    const searchInput = document.getElementById('lf-search-input');
    const categorySelect = document.getElementById('lf-category-select');
    const typeButtons = document.querySelectorAll('.type-btn');

    const updateFilter = () => {
      this.filterAndSearch();
    };

    if (searchInput) searchInput.addEventListener('input', updateFilter);
    if (categorySelect) categorySelect.addEventListener('change', updateFilter);

    // Type Tabs Toggling
    typeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Clear all active classes first
        typeButtons.forEach(b => {
          b.classList.remove('active-all', 'active-lost', 'active-found');
        });

        const type = btn.getAttribute('data-type');
        this.selectedType = type;

        if (type === 'all') {
          btn.classList.add('active-all');
        } else if (type === 'lost') {
          btn.classList.add('active-lost');
        } else if (type === 'found') {
          btn.classList.add('active-found');
        }

        this.filterAndSearch();
      });
    });

    // Delegate dynamic claim / info buttons
    document.addEventListener('click', (e) => {
      const contactBtn = e.target.closest('.contact-reporter-btn');
      if (!contactBtn) return;

      const contact = contactBtn.getAttribute('data-contact');
      const type = contactBtn.getAttribute('data-type');
      
      window.showToast(`Call finder/owner at: ${contact}`, 'success');
    });
  },

  filterAndSearch: function () {
    const query = document.getElementById('lf-search-input')?.value || '';
    const selectedCategory = document.getElementById('lf-category-select')?.value || 'all';

    // 1. Search filter
    let results = window.SearchManager.search(this.list, query, ['name', 'description', 'location']);

    // 2. Category & Type filters
    const criteria = {};
    if (selectedCategory !== 'all') criteria.category = selectedCategory;
    if (this.selectedType !== 'all') criteria.type = this.selectedType;

    results = window.SearchManager.filter(results, criteria);

    this.filteredList = results;
    this.render();
  },

  render: function () {
    const grid = document.getElementById('lf-grid');
    if (!grid) return;

    // Default displaying full lists unless filters have been triggered
    const queryActive = document.getElementById('lf-search-input')?.value || 
                         document.getElementById('lf-category-select')?.value !== 'all' || 
                         this.selectedType !== 'all';
    
    const displayList = queryActive ? this.filteredList : this.list;

    if (displayList.length === 0) {
      grid.innerHTML = `
        <div class="card w-100 reveal" style="grid-column: 1 / -1;">
          <div class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <div class="empty-state-title">No Items Found</div>
            <div class="empty-state-desc">No lost or found reports match your search criteria. Check spelling or try selecting a different category filter.</div>
          </div>
        </div>
      `;
      return;
    }

    grid.innerHTML = displayList.map(item => {
      const isLost = item.type === 'lost';
      return `
        <div class="card reveal fade-in" style="display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; padding: 0;">
          <div>
            <div style="position: relative; height: 180px; width: 100%;">
              <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
              <span class="badge ${isLost ? 'badge-danger' : 'badge-success'}" style="position: absolute; top: var(--spacing-sm); left: var(--spacing-sm);">
                ${item.type}
              </span>
            </div>
            
            <div style="padding: var(--spacing-lg);">
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--color-text-muted); font-weight: 600; margin-bottom: 2px;">
                <span>${item.category}</span>
                <span>${item.date}</span>
              </div>
              <h3 class="card-title" style="font-size: 1.2rem; margin-bottom: var(--spacing-xs);">${item.name}</h3>
              <p style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: var(--spacing-md); font-weight: 500;">📍 ${item.location}</p>
              <p class="card-body" style="font-size: 0.85rem; margin-bottom: 0;">${item.description}</p>
            </div>
          </div>
          
          <div style="padding: 0 var(--spacing-lg) var(--spacing-lg) var(--spacing-lg);">
            <button class="btn btn-secondary btn-sm w-100 contact-reporter-btn" data-contact="${item.contact}" data-type="${item.type}">
              Contact ${isLost ? 'Owner' : 'Finder'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  getDefaultCategoryImage: function (category) {
    switch (category) {
      case 'Electronics':
        return 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop';
      case 'Books':
        return 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop';
      case 'Accessories':
        return 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=800&auto=format&fit=crop';
    }
  }
};
