/**
 * Developer Developer Theme - Search JavaScript
 * Handles search functionality including live search and results display
 */

(function() {
  'use strict';

  const Search = {
    // ============================================
    // Configuration
    // ============================================
    config: {
      minQueryLength: 2,
      debounceDelay: 300,
      maxResults: 10,
      highlightClass: 'search-highlight',
      endpoints: {
        search: '/api/search',
        suggestions: '/api/search/suggestions'
      }
    },

    // ============================================
    // State
    // ============================================
    state: {
      isOpen: false,
      query: '',
      results: [],
      selectedIndex: -1,
      isLoading: false
    },

    // ============================================
    // Initialize
    // ============================================
    init: function() {
      this.cacheElements();
      this.bindEvents();
      this.initInstantSearch();
    },

    // ============================================
    // Cache DOM Elements
    // ============================================
    cacheElements: function() {
      this.elements = {
        searchToggle: document.querySelector('.header-search-toggle'),
        searchOverlay: document.querySelector('.search-overlay'),
        searchForm: document.querySelector('.search-form'),
        searchInput: document.querySelector('.search-input'),
        searchResults: document.querySelector('.search-results'),
        searchClose: document.querySelector('.search-close'),
        instantSearch: document.querySelector('[data-instant-search]')
      };
    },

    // ============================================
    // Bind Events
    // ============================================
    bindEvents: function() {
      const { searchToggle, searchOverlay, searchInput, searchClose, searchForm } = this.elements;

      // Toggle search overlay
      if (searchToggle) {
        searchToggle.addEventListener('click', () => this.toggleSearch());
      }

      // Close search
      if (searchClose) {
        searchClose.addEventListener('click', () => this.closeSearch());
      }

      // Close on overlay click
      if (searchOverlay) {
        searchOverlay.addEventListener('click', (e) => {
          if (e.target === searchOverlay) {
            this.closeSearch();
          }
        });
      }

      // Search input events
      if (searchInput) {
        searchInput.addEventListener('input', this.debounce((e) => {
          this.handleSearch(e.target.value);
        }, this.config.debounceDelay));

        searchInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        searchInput.addEventListener('focus', () => this.showResults());
      }

      // Form submission
      if (searchForm) {
        searchForm.addEventListener('submit', (e) => this.handleSubmit(e));
      }

      // Global escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.state.isOpen) {
          this.closeSearch();
        }
        // Open search with Ctrl/Cmd + K
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          this.toggleSearch();
        }
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (this.state.isOpen &&
            !e.target.closest('.search-container') &&
            !e.target.closest('.header-search-toggle')) {
          this.hideResults();
        }
      });
    },

    // ============================================
    // Search Methods
    // ============================================
    toggleSearch: function() {
      if (this.state.isOpen) {
        this.closeSearch();
      } else {
        this.openSearch();
      }
    },

    openSearch: function() {
      const { searchOverlay, searchInput } = this.elements;

      this.state.isOpen = true;

      if (searchOverlay) {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      if (searchInput) {
        setTimeout(() => searchInput.focus(), 100);
      }
    },

    closeSearch: function() {
      const { searchOverlay, searchInput } = this.elements;

      this.state.isOpen = false;
      this.state.query = '';
      this.state.results = [];
      this.state.selectedIndex = -1;

      if (searchOverlay) {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }

      if (searchInput) {
        searchInput.value = '';
      }

      this.hideResults();
    },

    handleSearch: async function(query) {
      this.state.query = query.trim();

      if (this.state.query.length < this.config.minQueryLength) {
        this.hideResults();
        return;
      }

      this.state.isLoading = true;
      this.showLoading();

      try {
        const results = await this.fetchResults(this.state.query);
        this.state.results = results;
        this.renderResults(results);
      } catch (error) {
        console.error('Search error:', error);
        this.showError('An error occurred while searching.');
      } finally {
        this.state.isLoading = false;
      }
    },

    fetchResults: async function(query) {
      // This would typically fetch from your search endpoint
      // For demo purposes, we'll simulate results

      // Simulated delay
      await new Promise(resolve => setTimeout(resolve, 200));

      // Example API call:
      // const response = await fetch(`${this.config.endpoints.search}?q=${encodeURIComponent(query)}&limit=${this.config.maxResults}`);
      // if (!response.ok) throw new Error('Search failed');
      // return await response.json();

      // Simulated results for demo
      return this.generateMockResults(query);
    },

    generateMockResults: function(query) {
      // This is just for demonstration - replace with actual API results
      const mockData = [
        { type: 'post', title: 'Getting Started with RustPress', url: '/blog/getting-started', excerpt: 'Learn how to set up your first RustPress site...', date: '2024-01-15' },
        { type: 'post', title: 'Building Custom Themes', url: '/blog/custom-themes', excerpt: 'Create beautiful themes for your site...', date: '2024-01-10' },
        { type: 'product', title: 'Premium Theme Pack', url: '/shop/theme-pack', price: '$49.99', image: '/images/theme-pack.jpg' },
        { type: 'page', title: 'About Us', url: '/about', excerpt: 'Learn more about our company...' },
        { type: 'category', title: 'Tutorials', url: '/category/tutorials', count: 24 }
      ];

      return mockData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
      ).slice(0, this.config.maxResults);
    },

    // ============================================
    // Results Display
    // ============================================
    renderResults: function(results) {
      const { searchResults } = this.elements;
      if (!searchResults) return;

      if (results.length === 0) {
        this.showNoResults();
        return;
      }

      const groupedResults = this.groupResultsByType(results);
      let html = '';

      for (const [type, items] of Object.entries(groupedResults)) {
        html += `
          <div class="search-results-group">
            <h4 class="search-results-group-title">${this.getTypeLabel(type)}</h4>
            <ul class="search-results-list">
              ${items.map((item, index) => this.renderResultItem(item, index)).join('')}
            </ul>
          </div>
        `;
      }

      searchResults.innerHTML = html;
      this.showResults();
      this.bindResultEvents();
    },

    renderResultItem: function(item, index) {
      const isSelected = index === this.state.selectedIndex;

      switch (item.type) {
        case 'post':
          return `
            <li class="search-result-item ${isSelected ? 'selected' : ''}" data-index="${index}">
              <a href="${item.url}">
                <div class="search-result-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div class="search-result-content">
                  <span class="search-result-title">${this.highlightQuery(item.title)}</span>
                  <span class="search-result-meta">${item.date}</span>
                  ${item.excerpt ? `<span class="search-result-excerpt">${this.highlightQuery(item.excerpt)}</span>` : ''}
                </div>
              </a>
            </li>
          `;

        case 'product':
          return `
            <li class="search-result-item ${isSelected ? 'selected' : ''}" data-index="${index}">
              <a href="${item.url}">
                <div class="search-result-image">
                  ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
                </div>
                <div class="search-result-content">
                  <span class="search-result-title">${this.highlightQuery(item.title)}</span>
                  <span class="search-result-price">${item.price}</span>
                </div>
              </a>
            </li>
          `;

        case 'page':
          return `
            <li class="search-result-item ${isSelected ? 'selected' : ''}" data-index="${index}">
              <a href="${item.url}">
                <div class="search-result-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                </div>
                <div class="search-result-content">
                  <span class="search-result-title">${this.highlightQuery(item.title)}</span>
                  ${item.excerpt ? `<span class="search-result-excerpt">${item.excerpt}</span>` : ''}
                </div>
              </a>
            </li>
          `;

        case 'category':
          return `
            <li class="search-result-item ${isSelected ? 'selected' : ''}" data-index="${index}">
              <a href="${item.url}">
                <div class="search-result-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <div class="search-result-content">
                  <span class="search-result-title">${this.highlightQuery(item.title)}</span>
                  <span class="search-result-count">${item.count} posts</span>
                </div>
              </a>
            </li>
          `;

        default:
          return `
            <li class="search-result-item ${isSelected ? 'selected' : ''}" data-index="${index}">
              <a href="${item.url}">
                <div class="search-result-content">
                  <span class="search-result-title">${this.highlightQuery(item.title)}</span>
                </div>
              </a>
            </li>
          `;
      }
    },

    groupResultsByType: function(results) {
      return results.reduce((groups, item) => {
        const type = item.type || 'other';
        if (!groups[type]) {
          groups[type] = [];
        }
        groups[type].push(item);
        return groups;
      }, {});
    },

    getTypeLabel: function(type) {
      const labels = {
        post: 'Posts',
        page: 'Pages',
        product: 'Products',
        category: 'Categories',
        tag: 'Tags',
        other: 'Other'
      };
      return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
    },

    highlightQuery: function(text) {
      if (!this.state.query || !text) return text;

      const regex = new RegExp(`(${this.escapeRegex(this.state.query)})`, 'gi');
      return text.replace(regex, `<mark class="${this.config.highlightClass}">$1</mark>`);
    },

    escapeRegex: function(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    bindResultEvents: function() {
      const { searchResults } = this.elements;
      if (!searchResults) return;

      const items = searchResults.querySelectorAll('.search-result-item');
      items.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
          this.state.selectedIndex = index;
          this.updateSelectedItem();
        });
      });
    },

    // ============================================
    // Keyboard Navigation
    // ============================================
    handleKeydown: function(e) {
      const { results, selectedIndex } = this.state;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.state.selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
          this.updateSelectedItem();
          break;

        case 'ArrowUp':
          e.preventDefault();
          this.state.selectedIndex = Math.max(selectedIndex - 1, -1);
          this.updateSelectedItem();
          break;

        case 'Enter':
          if (selectedIndex >= 0 && results[selectedIndex]) {
            e.preventDefault();
            window.location.href = results[selectedIndex].url;
          }
          break;

        case 'Escape':
          this.hideResults();
          break;
      }
    },

    updateSelectedItem: function() {
      const { searchResults } = this.elements;
      if (!searchResults) return;

      const items = searchResults.querySelectorAll('.search-result-item');
      items.forEach((item, index) => {
        item.classList.toggle('selected', index === this.state.selectedIndex);
      });

      // Scroll selected item into view
      const selectedItem = searchResults.querySelector('.search-result-item.selected');
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    },

    // ============================================
    // Form Submission
    // ============================================
    handleSubmit: function(e) {
      const { searchInput } = this.elements;
      const query = searchInput?.value.trim();

      if (!query || query.length < this.config.minQueryLength) {
        e.preventDefault();
        return;
      }

      // Allow form submission to search results page
    },

    // ============================================
    // UI States
    // ============================================
    showResults: function() {
      const { searchResults } = this.elements;
      if (searchResults) {
        searchResults.classList.add('active');
      }
    },

    hideResults: function() {
      const { searchResults } = this.elements;
      if (searchResults) {
        searchResults.classList.remove('active');
      }
      this.state.selectedIndex = -1;
    },

    showLoading: function() {
      const { searchResults } = this.elements;
      if (searchResults) {
        searchResults.innerHTML = `
          <div class="search-loading">
            <div class="loading-spinner"></div>
            <span>Searching...</span>
          </div>
        `;
        this.showResults();
      }
    },

    showNoResults: function() {
      const { searchResults } = this.elements;
      if (searchResults) {
        searchResults.innerHTML = `
          <div class="search-no-results">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <p>No results found for "<strong>${this.escapeHtml(this.state.query)}</strong>"</p>
            <span>Try searching with different keywords</span>
          </div>
        `;
        this.showResults();
      }
    },

    showError: function(message) {
      const { searchResults } = this.elements;
      if (searchResults) {
        searchResults.innerHTML = `
          <div class="search-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <p>${this.escapeHtml(message)}</p>
          </div>
        `;
        this.showResults();
      }
    },

    // ============================================
    // Instant Search (for dedicated search pages)
    // ============================================
    initInstantSearch: function() {
      const { instantSearch } = this.elements;
      if (!instantSearch) return;

      const input = instantSearch.querySelector('input');
      const resultsContainer = instantSearch.querySelector('[data-search-results]');

      if (!input || !resultsContainer) return;

      input.addEventListener('input', this.debounce(async (e) => {
        const query = e.target.value.trim();

        if (query.length < this.config.minQueryLength) {
          resultsContainer.innerHTML = '';
          return;
        }

        resultsContainer.innerHTML = '<div class="loading-spinner"></div>';

        try {
          const results = await this.fetchResults(query);
          this.state.results = results;
          this.state.query = query;
          this.renderInstantResults(results, resultsContainer);
        } catch (error) {
          resultsContainer.innerHTML = '<p class="search-error">An error occurred</p>';
        }
      }, this.config.debounceDelay));

      // Update URL as user types
      input.addEventListener('input', this.debounce((e) => {
        const query = e.target.value.trim();
        const url = new URL(window.location);
        if (query) {
          url.searchParams.set('q', query);
        } else {
          url.searchParams.delete('q');
        }
        history.replaceState(null, '', url);
      }, 500));

      // Load initial query from URL
      const urlParams = new URLSearchParams(window.location.search);
      const initialQuery = urlParams.get('q');
      if (initialQuery) {
        input.value = initialQuery;
        input.dispatchEvent(new Event('input'));
      }
    },

    renderInstantResults: function(results, container) {
      if (results.length === 0) {
        container.innerHTML = `
          <div class="no-results">
            <h2>No results found</h2>
            <p>Try adjusting your search terms or browse our categories.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <p class="search-results-info">Found ${results.length} result${results.length !== 1 ? 's' : ''}</p>
        <div class="posts-grid">
          ${results.map(result => this.renderInstantResultCard(result)).join('')}
        </div>
      `;
    },

    renderInstantResultCard: function(result) {
      return `
        <article class="card">
          <a href="${result.url}" class="card-image">
            <img src="${result.image || '/images/placeholder.jpg'}" alt="${this.escapeHtml(result.title)}">
          </a>
          <div class="card-content">
            <div class="card-meta">
              <span>${result.type}</span>
              ${result.date ? `<span>${result.date}</span>` : ''}
            </div>
            <h3 class="card-title">
              <a href="${result.url}">${this.highlightQuery(result.title)}</a>
            </h3>
            ${result.excerpt ? `<p class="card-excerpt">${this.highlightQuery(result.excerpt)}</p>` : ''}
          </div>
        </article>
      `;
    },

    // ============================================
    // Utility Functions
    // ============================================
    debounce: function(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    escapeHtml: function(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  };

  // ============================================
  // Initialize when DOM is ready
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Search.init());
  } else {
    Search.init();
  }

  // Expose to global scope
  window.DeveloperSearch = Search;

})();
