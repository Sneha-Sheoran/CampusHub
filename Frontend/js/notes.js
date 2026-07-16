/* Notes Controller Module */

document.addEventListener('DOMContentLoaded', () => {
  Notes.init();
});

const Notes = {
  list: [],
  filteredList: [],
  showingOnlyBookmarks: false,

  init: async function () {
    this.setupListeners();
    await this.loadNotes();
    this.render();
  },

  loadNotes: async function () {
    try {
      const response = await window.API.notes.list('');
      this.list = response.data || [];
      this.filteredList = [...this.list];
    } catch (error) {
      this.list = [];
      this.filteredList = [];
      console.error('Failed to load notes', error);
    }
  },

  setupListeners: function () {
    const searchInput = document.getElementById('notes-search-input');
    const deptSelect = document.getElementById('notes-dept-select');
    const semSelect = document.getElementById('notes-sem-select');
    const sortSelect = document.getElementById('notes-sort-select');
    const bookmarksBtn = document.getElementById('toggle-bookmarks-view');

    const updateFilter = () => {
      this.filterAndSort();
    };

    if (searchInput) searchInput.addEventListener('input', updateFilter);
    if (deptSelect) deptSelect.addEventListener('change', updateFilter);
    if (semSelect) semSelect.addEventListener('change', updateFilter);
    if (sortSelect) sortSelect.addEventListener('change', updateFilter);

    if (bookmarksBtn) {
      bookmarksBtn.addEventListener('click', () => {
        this.showingOnlyBookmarks = !this.showingOnlyBookmarks;
        
        if (this.showingOnlyBookmarks) {
          bookmarksBtn.classList.add('active');
          bookmarksBtn.querySelector('span').innerText = 'View All Notes';
        } else {
          bookmarksBtn.classList.remove('active');
          bookmarksBtn.querySelector('span').innerText = 'View Bookmarked';
        }
        
        this.filterAndSort();
      });
    }
  },

  filterAndSort: function () {
    const searchQuery = document.getElementById('notes-search-input')?.value || '';
    const selectedDept = document.getElementById('notes-dept-select')?.value || 'all';
    const selectedSem = document.getElementById('notes-sem-select')?.value || 'all';
    const sortBy = document.getElementById('notes-sort-select')?.value || 'downloads';

    // 1. Core search matching subject name, code, author or description
    let results = window.SearchManager.search(this.list, searchQuery, ['subject', 'code', 'author', 'description']);

    // 2. Department & Semester Filtering
    const criteria = {};
    if (selectedDept !== 'all') criteria.department = selectedDept;
    if (selectedSem !== 'all') criteria.semester = selectedSem;
    results = window.SearchManager.filter(results, criteria);

    // 3. Bookmarks checking
    if (this.showingOnlyBookmarks) {
      results = results.filter(note => window.StorageManager.isBookmarked(note.id));
    }

    // 4. Sorting
    if (sortBy === 'subject') {
      results = window.SearchManager.sort(results, 'subject', 'asc');
    } else if (sortBy === 'bookmarks') {
      results = window.SearchManager.sort(results, 'bookmarkCount', 'desc');
    } else {
      results = window.SearchManager.sort(results, 'downloads', 'desc');
    }

    this.filteredList = results;
    this.render();
  },

  render: function () {
    const grid = document.getElementById('notes-grid');
    if (!grid) return;

    // Use current state to display search/filters
    const listToDisplay = this.showingOnlyBookmarks || 
                          document.getElementById('notes-search-input')?.value || 
                          document.getElementById('notes-dept-select')?.value !== 'all' || 
                          document.getElementById('notes-sem-select')?.value !== 'all'
                          ? this.filteredList : this.list;

    if (listToDisplay.length === 0) {
      grid.innerHTML = `
        <div class="card w-100 reveal" style="grid-column: 1 / -1;">
          <div class="empty-state">
            <div class="empty-state-icon">📂</div>
            <div class="empty-state-title">No Notes Found</div>
            <div class="empty-state-desc">Try clearing filters or search keywords to view other available lecture materials.</div>
          </div>
        </div>
      `;
      return;
    }

    grid.innerHTML = listToDisplay.map(note => {
      const isBookmarked = window.StorageManager.isBookmarked(note.id);
      return `
        <div class="card reveal fade-in" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div class="d-flex justify-between align-center mb-sm">
              <span class="badge badge-primary">${note.department}</span>
              <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" data-id="${note.id}" aria-label="Bookmark Note">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="${isBookmarked ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
            
            <div style="font-size: 0.8rem; color: var(--color-text-muted); font-weight: 600; margin-bottom: 2px;">
              ${note.code} • ${note.semester}
            </div>
            <h3 class="card-title" style="font-size: 1.2rem; margin-bottom: var(--spacing-sm);">${note.subject}</h3>
            <p class="card-subtitle" style="margin-bottom: var(--spacing-md);">Shared by ${note.author}</p>
            <p class="card-body" style="font-size: 0.85rem; margin-bottom: var(--spacing-lg);">${note.description}</p>
          </div>
          
          <div class="card-footer">
            <div style="font-size: 0.8rem; color: var(--color-text-secondary); display: flex; flex-direction: column;">
              <span>💾 ${note.size}</span>
              <span>📥 ${note.downloads} downloads</span>
            </div>
            <button class="btn btn-primary btn-sm download-note-btn" data-id="${note.id}">Download</button>
          </div>
        </div>
      `;
    }).join('');

    this.bindDynamicListeners();
  },

  bindDynamicListeners: function () {
    // 1. Bookmark toggles click events
    const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
    bookmarkBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const added = window.StorageManager.toggleBookmark(id);
        
        // Find item and update bookmarkCount local visualization
        const itemIdx = this.list.findIndex(item => item.id === id);
        if (itemIdx !== -1) {
          this.list[itemIdx].bookmarkCount += added ? 1 : -1;
          window.StorageManager.set(window.STORAGE_KEYS.NOTES, this.list);
        }

        window.showToast(
          added ? 'Note bookmarked to your account!' : 'Note removed from bookmarks.', 
          added ? 'success' : 'primary'
        );

        this.filterAndSort();
      });
    });

    // 2. Download Simulation click events
    const downloadBtns = document.querySelectorAll('.download-note-btn');
    downloadBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        this.simulateDownload(id);
      });
    });
  },

  simulateDownload: function (id) {
    const modal = document.getElementById('download-modal');
    const progressText = document.getElementById('download-progress-text');
    if (!modal || !progressText) return;

    modal.classList.add('active');
    
    // Stage 1: Initiating
    progressText.innerText = 'Connecting to server nodes...';
    
    setTimeout(() => {
      // Stage 2: Fetching
      progressText.innerText = 'Downloading payload (45%)...';
      
      setTimeout(() => {
        // Stage 3: Compressing
        progressText.innerText = 'Extracting and verifying hash signatures (85%)...';
        
        setTimeout(() => {
          // Finish
          modal.classList.remove('active');
          
          // Increment downloads count in local storage
          const note = this.list.find(n => n.id === id);
          if (note) {
            note.downloads += 1;
            window.API.notes.update(id, { downloads: note.downloads }).catch(() => {});
            this.list = this.list.map(item => item.id === id ? note : item);
          }

          window.showToast('Note package downloaded successfully!', 'success');
          this.filterAndSort(); // Re-render update downloads
        }, 800);
      }, 700);
    }, 600);
  }
};
