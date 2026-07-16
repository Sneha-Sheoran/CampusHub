/* Simple Search and Filter Helpers */

const SearchManager = {
  /**
   * Search an array of objects
   * @param {Array} list - The list of items to search
   * @param {String} query - The search query
   * @param {Array} fields - Array of strings matching key names in the object
   * @returns {Array} - The filtered list
   */
  search: function (list, query, fields) {
    if (!query || !query.trim()) return list;
    
    const cleanQuery = query.toLowerCase().trim();
    
    return list.filter(item => {
      return fields.some(field => {
        const val = item[field];
        if (val === undefined || val === null) return false;
        
        return String(val).toLowerCase().includes(cleanQuery);
      });
    });
  },

  /**
   * Filter list by matching attributes
   * @param {Array} list 
   * @param {Object} criteria - Key value pairs to check (e.g. { category: 'academic' })
   * @returns {Array}
   */
  filter: function (list, criteria) {
    return list.filter(item => {
      for (const [key, value] of Object.entries(criteria)) {
        if (!value || value === 'all' || value === 'All') continue;
        if (item[key] !== value) return false;
      }
      return true;
    });
  },

  /**
   * Sort array of objects
   * @param {Array} list 
   * @param {String} key - The property key to sort by
   * @param {String} direction - 'asc' or 'desc'
   * @returns {Array}
   */
  sort: function (list, key, direction = 'asc') {
    const sorted = [...list];
    
    sorted.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];
      
      // Parse floats if numeric
      if (!isNaN(parseFloat(valA)) && isFinite(valA)) {
        valA = parseFloat(valA);
        valB = parseFloat(valB);
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }
      
      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }
};

window.SearchManager = SearchManager;
