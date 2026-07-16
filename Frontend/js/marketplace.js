/* Student Marketplace Page Controller */

document.addEventListener('DOMContentLoaded', () => {
  Marketplace.init();
});

const Marketplace = {
  list: [],
  filteredList: [],
  showingOnlyFavs: false,
  activeChatSeller: '',
  activeChatItemName: '',

  init: function () {
    this.loadData();
    this.setupSellModal();
    this.setupChatModal();
    this.setupListeners();
    this.render();
  },

  loadData: function () {
    this.list = window.StorageManager.get(window.STORAGE_KEYS.MARKETPLACE) || [];
  },

  setupSellModal: function () {
    const modal = document.getElementById('sell-modal');
    const openBtn = document.getElementById('open-sell-modal-btn');
    const closeBtn = document.getElementById('close-sell-modal-btn');
    const cancelBtn = document.getElementById('cancel-sell-btn');
    const form = document.getElementById('sell-item-form');

    const openModal = () => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      form.reset();
      window.FormValidator.clearAllErrors(form);
    };

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate required fields
        const required = ['name', 'price', 'description', 'contact'];
        const isValid = window.FormValidator.validateRequired(form, required);

        if (!isValid) return;

        const formData = new FormData(form);
        const name = formData.get('name');
        const price = parseFloat(formData.get('price'));
        const category = formData.get('category');
        const desc = formData.get('description');
        const contact = formData.get('contact');
        let image = formData.get('image').trim();

        if (!image) {
          image = this.getDefaultCategoryImage(category);
        }

        const newItem = {
          name: name,
          price: price,
          category: category,
          description: desc,
          contact: contact,
          image: image,
          seller: 'Alex Carter', // Mock User
          date: new Date().toISOString().split('T')[0]
        };

        window.StorageManager.add(window.STORAGE_KEYS.MARKETPLACE, newItem);
        window.showToast('Item listed for sale successfully!', 'success');

        this.loadData();
        this.filterAndSort();
        closeModal();
      });
    }
  },

  setupChatModal: function () {
    const chatModal = document.getElementById('chat-modal');
    const closeBtn = document.getElementById('close-chat-btn');
    const closeFooterBtn = document.getElementById('close-chat-footer-btn');
    const inputForm = document.getElementById('chat-input-form');
    const inputMsg = document.getElementById('chat-user-message');
    const msgContainer = document.getElementById('chat-messages-container');

    const closeChat = () => {
      chatModal.classList.remove('active');
      document.body.style.overflow = '';
      inputForm.reset();
    };

    if (closeBtn) closeBtn.addEventListener('click', closeChat);
    if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeChat);

    if (inputForm) {
      inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msgText = inputMsg.value.trim();
        if (!msgText) return;

        // Append User bubble
        const userBubble = document.createElement('div');
        userBubble.className = 'chat-bubble chat-bubble-sent';
        userBubble.innerText = msgText;
        msgContainer.appendChild(userBubble);
        inputMsg.value = '';
        msgContainer.scrollTop = msgContainer.scrollHeight;

        // Simulate reply after 1.2 seconds
        setTimeout(() => {
          const sellerBubble = document.createElement('div');
          sellerBubble.className = 'chat-bubble chat-bubble-received';
          sellerBubble.innerText = `Thanks for your interest in the "${this.activeChatItemName}"! I am available to meet near Block C cafeteria tomorrow between 12 PM and 2 PM. Does that work for you?`;
          msgContainer.appendChild(sellerBubble);
          msgContainer.scrollTop = msgContainer.scrollHeight;
          
          // Play micro notification sound or toast
          window.showToast(`New message from ${this.activeChatSeller}`, 'primary');
        }, 1200);
      });
    }
  },

  setupListeners: function () {
    const searchInput = document.getElementById('market-search-input');
    const categorySelect = document.getElementById('market-category-select');
    const priceSelect = document.getElementById('market-price-select');
    const favsBtn = document.getElementById('market-favs-btn');

    const updateFilter = () => {
      this.filterAndSort();
    };

    if (searchInput) searchInput.addEventListener('input', updateFilter);
    if (categorySelect) categorySelect.addEventListener('change', updateFilter);
    if (priceSelect) priceSelect.addEventListener('change', updateFilter);

    if (favsBtn) {
      favsBtn.addEventListener('click', () => {
        this.showingOnlyFavs = !this.showingOnlyFavs;
        
        if (this.showingOnlyFavs) {
          favsBtn.classList.add('active');
          favsBtn.querySelector('span').innerText = 'View All Items';
        } else {
          favsBtn.classList.remove('active');
          favsBtn.querySelector('span').innerText = 'View Favorites';
        }
        
        this.filterAndSort();
      });
    }

    // Dynamic buttons delegation (favorites & contact triggers)
    document.addEventListener('click', (e) => {
      // 1. Favorite Toggle
      const favBtn = e.target.closest('.fav-btn');
      if (favBtn) {
        e.stopPropagation();
        const id = favBtn.getAttribute('data-id');
        const added = window.StorageManager.toggleFavorite(id);
        
        window.showToast(
          added ? 'Added to favorites!' : 'Removed from favorites.',
          added ? 'success' : 'primary'
        );

        this.filterAndSort();
      }

      // 2. Open Chat Trigger
      const chatBtn = e.target.closest('.contact-seller-btn');
      if (chatBtn) {
        const sellerName = chatBtn.getAttribute('data-seller');
        const itemName = chatBtn.getAttribute('data-item');
        
        this.activeChatSeller = sellerName;
        this.activeChatItemName = itemName;
        
        this.openChatDialogue();
      }
    });
  },

  openChatDialogue: function () {
    const chatModal = document.getElementById('chat-modal');
    const title = document.getElementById('chat-seller-title');
    const msgContainer = document.getElementById('chat-messages-container');

    if (!chatModal || !title || !msgContainer) return;

    title.innerText = `Chat with ${this.activeChatSeller}`;
    
    // Initial Seed messages
    msgContainer.innerHTML = `
      <div class="chat-bubble chat-bubble-received">
        Hi! I am selling the <strong>${this.activeChatItemName}</strong>. It's in great condition. Let me know if you have any questions!
      </div>
    `;

    chatModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    msgContainer.scrollTop = msgContainer.scrollHeight;
  },

  filterAndSort: function () {
    const query = document.getElementById('market-search-input')?.value || '';
    const selectedCategory = document.getElementById('market-category-select')?.value || 'all';
    const sortBy = document.getElementById('market-price-select')?.value || 'newest';

    // 1. Search Filter
    let results = window.SearchManager.search(this.list, query, ['name', 'description', 'seller']);

    // 2. Category Filter
    const criteria = {};
    if (selectedCategory !== 'all') criteria.category = selectedCategory;
    results = window.SearchManager.filter(results, criteria);

    // 3. Favorites Filter
    if (this.showingOnlyFavs) {
      results = results.filter(item => window.StorageManager.isFavorite(item.id));
    }

    // 4. Sorting
    if (sortBy === 'price-asc') {
      results = window.SearchManager.sort(results, 'price', 'asc');
    } else if (sortBy === 'price-desc') {
      results = window.SearchManager.sort(results, 'price', 'desc');
    } else {
      results = window.SearchManager.sort(results, 'id', 'desc'); // newest first
    }

    this.filteredList = results;
    this.render();
  },

  render: function () {
    const grid = document.getElementById('market-grid');
    if (!grid) return;

    const queryActive = this.showingOnlyFavs || 
                         document.getElementById('market-search-input')?.value || 
                         document.getElementById('market-category-select')?.value !== 'all' || 
                         document.getElementById('market-price-select')?.value !== 'newest';

    const displayList = queryActive ? this.filteredList : this.list;

    if (displayList.length === 0) {
      grid.innerHTML = `
        <div class="card w-100 reveal" style="grid-column: 1 / -1;">
          <div class="empty-state">
            <div class="empty-state-icon">🛍️</div>
            <div class="empty-state-title">No Listings Found</div>
            <div class="empty-state-desc">No marketplace listings match your query. Try clearing search fields or look up other tags.</div>
          </div>
        </div>
      `;
      return;
    }

    grid.innerHTML = displayList.map(item => {
      const isFav = window.StorageManager.isFavorite(item.id);
      return `
        <div class="card reveal fade-in" style="display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; padding: 0;">
          <div>
            <div class="market-img-container">
              <img src="${item.image}" alt="${item.name}">
              <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${item.id}" aria-label="Favorite Item">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="${isFav ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            
            <div style="padding: var(--spacing-lg);">
              <span class="badge badge-info" style="font-size: 0.65rem; margin-bottom: var(--spacing-xs);">${item.category}</span>
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <h3 class="card-title" style="font-size: 1.15rem; margin: 0; line-height: 1.2; max-width: 80%;">${item.name}</h3>
                <span style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; color: var(--color-primary);">₹${item.price}</span>
              </div>
              <p class="card-subtitle" style="margin-top: 4px; margin-bottom: var(--spacing-md);">Listed by ${item.seller} • ${item.date}</p>
              <p class="card-body" style="font-size: 0.85rem; margin-bottom: 0;">${item.description}</p>
            </div>
          </div>
          
          <div style="padding: 0 var(--spacing-lg) var(--spacing-lg) var(--spacing-lg);">
            <button class="btn btn-primary btn-sm w-100 contact-seller-btn" data-seller="${item.seller}" data-item="${item.name}">
              Contact Seller
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  getDefaultCategoryImage: function (category) {
    switch (category) {
      case 'Electronics':
        return '../images/market_monitor.png';
      case 'Books':
        return '../images/market_clrs_book.png';
      case 'Academic Kits':
        return '../images/market_drawing_board.png';
      default:
        return '../images/market_drawing_board.png';
    }
  }
};
