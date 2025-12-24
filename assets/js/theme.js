/**
 * Developer Developer Theme - Main JavaScript
 * Handles theme functionality, dark mode, and utilities
 */

(function() {
  'use strict';

  // ============================================
  // Theme Configuration
  // ============================================
  const DeveloperTheme = {
    config: {
      stickyHeader: true,
      stickyOffset: 100,
      animationDuration: 300,
      mobileBreakpoint: 768,
      storageKeys: {
        darkMode: 'developer-developer-dark-mode',
        fontSize: 'developer-developer-font-size'
      }
    },

    // ============================================
    // Initialize
    // ============================================
    init: function() {
      this.initDarkMode();
      this.initStickyHeader();
      this.initMobileMenu();
      this.initSearch();
      this.initDropdowns();
      this.initBackToTop();
      this.initLazyLoad();
      this.initSmoothScroll();
      this.initTableOfContents();
      this.initQuantitySelectors();
      this.initProductGallery();
      this.initTabs();
      this.initAccordions();
      this.initCopyCode();
      this.initNewsletterForm();
      this.initContactForm();
      this.initReadingProgress();

      // Dispatch ready event
      document.dispatchEvent(new CustomEvent('developerThemeReady'));
    },

    // ============================================
    // Dark Mode
    // ============================================
    initDarkMode: function() {
      const toggle = document.querySelector('.dark-mode-toggle');
      const html = document.documentElement;

      // Check for saved preference or system preference
      const savedMode = localStorage.getItem(this.config.storageKeys.darkMode);
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (savedMode === 'dark' || (!savedMode && systemPrefersDark)) {
        html.setAttribute('data-theme', 'dark');
        html.classList.add('dark-mode');
      } else if (savedMode === 'light') {
        html.setAttribute('data-theme', 'light');
        html.classList.remove('dark-mode');
      }

      if (toggle) {
        toggle.addEventListener('click', () => {
          const isDark = html.classList.contains('dark-mode');

          if (isDark) {
            html.classList.remove('dark-mode');
            html.setAttribute('data-theme', 'light');
            localStorage.setItem(this.config.storageKeys.darkMode, 'light');
          } else {
            html.classList.add('dark-mode');
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem(this.config.storageKeys.darkMode, 'dark');
          }
        });
      }

      // Listen for system preference changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const savedMode = localStorage.getItem(this.config.storageKeys.darkMode);
        if (!savedMode) {
          if (e.matches) {
            html.classList.add('dark-mode');
            html.setAttribute('data-theme', 'dark');
          } else {
            html.classList.remove('dark-mode');
            html.setAttribute('data-theme', 'light');
          }
        }
      });
    },

    // ============================================
    // Sticky Header
    // ============================================
    initStickyHeader: function() {
      const header = document.querySelector('.site-header--sticky');
      if (!header || !this.config.stickyHeader) return;

      let lastScroll = 0;
      const headerHeight = header.offsetHeight;

      window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
          header.classList.remove('header--hidden');
          header.classList.remove('header--scrolled');
          return;
        }

        if (currentScroll > this.config.stickyOffset) {
          header.classList.add('header--scrolled');
        } else {
          header.classList.remove('header--scrolled');
        }

        if (currentScroll > lastScroll && currentScroll > headerHeight) {
          // Scrolling down
          header.classList.add('header--hidden');
        } else {
          // Scrolling up
          header.classList.remove('header--hidden');
        }

        lastScroll = currentScroll;
      }, { passive: true });
    },

    // ============================================
    // Mobile Menu
    // ============================================
    initMobileMenu: function() {
      const toggle = document.querySelector('.mobile-menu-toggle');
      const menu = document.querySelector('.mobile-menu');
      const close = document.querySelector('.mobile-menu-close');
      const body = document.body;

      if (!toggle || !menu) return;

      const openMenu = () => {
        menu.classList.add('active');
        body.style.overflow = 'hidden';
        toggle.setAttribute('aria-expanded', 'true');
      };

      const closeMenu = () => {
        menu.classList.remove('active');
        body.style.overflow = '';
        toggle.setAttribute('aria-expanded', 'false');
      };

      toggle.addEventListener('click', () => {
        if (menu.classList.contains('active')) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      if (close) {
        close.addEventListener('click', closeMenu);
      }

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
          closeMenu();
        }
      });

      // Close on outside click
      menu.addEventListener('click', (e) => {
        if (e.target === menu) {
          closeMenu();
        }
      });

      // Handle submenu toggles
      const subMenuToggles = menu.querySelectorAll('.has-children > a');
      subMenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
          const parent = toggle.parentElement;
          const subMenu = parent.querySelector('.sub-menu');

          if (subMenu) {
            e.preventDefault();
            parent.classList.toggle('expanded');
            subMenu.style.maxHeight = parent.classList.contains('expanded')
              ? subMenu.scrollHeight + 'px'
              : '0';
          }
        });
      });
    },

    // ============================================
    // Search
    // ============================================
    initSearch: function() {
      const searchToggle = document.querySelector('.header-search-toggle');
      const searchOverlay = document.querySelector('.header-search');
      const searchInput = document.querySelector('.header-search .search-input');
      const searchClose = document.querySelector('.search-close');

      if (!searchToggle || !searchOverlay) return;

      const openSearch = () => {
        searchOverlay.classList.add('active');
        if (searchInput) {
          setTimeout(() => searchInput.focus(), 100);
        }
      };

      const closeSearch = () => {
        searchOverlay.classList.remove('active');
      };

      searchToggle.addEventListener('click', () => {
        if (searchOverlay.classList.contains('active')) {
          closeSearch();
        } else {
          openSearch();
        }
      });

      if (searchClose) {
        searchClose.addEventListener('click', closeSearch);
      }

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
          closeSearch();
        }
      });

      // Live search functionality
      if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(() => {
            this.performSearch(e.target.value);
          }, 300);
        });
      }
    },

    performSearch: function(query) {
      if (query.length < 2) return;

      // This would typically make an AJAX request to the search endpoint
      console.log('Searching for:', query);

      // Placeholder for search results display
      const resultsContainer = document.querySelector('.search-results');
      if (resultsContainer) {
        // Display loading state
        resultsContainer.innerHTML = '<div class="loading-spinner"></div>';

        // Fetch search results (implement based on your backend)
        // fetch(`/api/search?q=${encodeURIComponent(query)}`)
        //   .then(response => response.json())
        //   .then(data => this.displaySearchResults(data, resultsContainer));
      }
    },

    // ============================================
    // Dropdowns
    // ============================================
    initDropdowns: function() {
      const dropdowns = document.querySelectorAll('[data-dropdown]');

      dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('[data-dropdown-trigger]');
        const content = dropdown.querySelector('[data-dropdown-content]');

        if (!trigger || !content) return;

        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = dropdown.classList.contains('open');

          // Close all other dropdowns
          document.querySelectorAll('[data-dropdown].open').forEach(d => {
            d.classList.remove('open');
          });

          if (!isOpen) {
            dropdown.classList.add('open');
          }
        });
      });

      // Close dropdowns on outside click
      document.addEventListener('click', () => {
        document.querySelectorAll('[data-dropdown].open').forEach(d => {
          d.classList.remove('open');
        });
      });
    },

    // ============================================
    // Back to Top
    // ============================================
    initBackToTop: function() {
      const button = document.querySelector('.back-to-top');
      if (!button) return;

      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
          button.classList.add('visible');
        } else {
          button.classList.remove('visible');
        }
      }, { passive: true });

      button.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    },

    // ============================================
    // Lazy Load Images
    // ============================================
    initLazyLoad: function() {
      if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;

              if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
              }

              img.classList.add('loaded');
              observer.unobserve(img);
            }
          });
        }, {
          rootMargin: '50px 0px',
          threshold: 0.01
        });

        lazyImages.forEach(img => imageObserver.observe(img));
      } else {
        // Fallback for older browsers
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
          img.src = img.dataset.src;
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
        });
      }
    },

    // ============================================
    // Smooth Scroll
    // ============================================
    initSmoothScroll: function() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (href === '#') return;

          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });

            // Update URL hash without scrolling
            history.pushState(null, null, href);
          }
        });
      });
    },

    // ============================================
    // Table of Contents
    // ============================================
    initTableOfContents: function() {
      const toc = document.querySelector('.table-of-contents');
      const tocToggle = document.querySelector('.toc-toggle');
      const tocLinks = document.querySelectorAll('.toc-list a');
      const headings = document.querySelectorAll('.single-post-content h2, .single-post-content h3');

      if (!toc || headings.length === 0) return;

      // Toggle TOC on mobile
      if (tocToggle) {
        tocToggle.addEventListener('click', () => {
          toc.classList.toggle('expanded');
        });
      }

      // Highlight current section
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute('id');
              tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                  link.classList.add('active');
                }
              });
            }
          });
        }, {
          rootMargin: '-100px 0px -66%',
          threshold: 0
        });

        headings.forEach(heading => {
          if (heading.id) {
            observer.observe(heading);
          }
        });
      }
    },

    // ============================================
    // Quantity Selectors (E-commerce)
    // ============================================
    initQuantitySelectors: function() {
      const selectors = document.querySelectorAll('.quantity-selector');

      selectors.forEach(selector => {
        const input = selector.querySelector('input');
        const minusBtn = selector.querySelector('[data-action="minus"]');
        const plusBtn = selector.querySelector('[data-action="plus"]');

        if (!input) return;

        const min = parseInt(input.getAttribute('min') || 1);
        const max = parseInt(input.getAttribute('max') || 99);

        const updateValue = (newValue) => {
          newValue = Math.max(min, Math.min(max, newValue));
          input.value = newValue;
          input.dispatchEvent(new Event('change'));
        };

        if (minusBtn) {
          minusBtn.addEventListener('click', () => {
            updateValue(parseInt(input.value) - 1);
          });
        }

        if (plusBtn) {
          plusBtn.addEventListener('click', () => {
            updateValue(parseInt(input.value) + 1);
          });
        }

        input.addEventListener('change', () => {
          updateValue(parseInt(input.value) || min);
        });
      });
    },

    // ============================================
    // Product Gallery
    // ============================================
    initProductGallery: function() {
      const gallery = document.querySelector('.product-gallery');
      if (!gallery) return;

      const mainImage = gallery.querySelector('.product-gallery-main img');
      const thumbs = gallery.querySelectorAll('.product-gallery-thumb');

      if (!mainImage || thumbs.length === 0) return;

      thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
          // Update main image
          const newSrc = thumb.querySelector('img')?.src || thumb.dataset.src;
          if (newSrc) {
            mainImage.src = newSrc;
          }

          // Update active state
          thumbs.forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });
      });

      // Initialize first thumb as active
      if (thumbs[0]) {
        thumbs[0].classList.add('active');
      }
    },

    // ============================================
    // Tabs
    // ============================================
    initTabs: function() {
      const tabContainers = document.querySelectorAll('[data-tabs]');

      tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('[data-tab]');
        const panels = container.querySelectorAll('[data-tab-panel]');

        tabs.forEach(tab => {
          tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;

            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update panels
            panels.forEach(panel => {
              if (panel.dataset.tabPanel === targetId) {
                panel.classList.add('active');
              } else {
                panel.classList.remove('active');
              }
            });
          });
        });
      });
    },

    // ============================================
    // Accordions
    // ============================================
    initAccordions: function() {
      const accordions = document.querySelectorAll('[data-accordion]');

      accordions.forEach(accordion => {
        const triggers = accordion.querySelectorAll('[data-accordion-trigger]');

        triggers.forEach(trigger => {
          trigger.addEventListener('click', () => {
            const item = trigger.closest('[data-accordion-item]');
            const content = item?.querySelector('[data-accordion-content]');

            if (!item || !content) return;

            const isOpen = item.classList.contains('open');

            // Close all other items (for exclusive accordion)
            if (accordion.dataset.accordion === 'exclusive') {
              accordion.querySelectorAll('[data-accordion-item].open').forEach(openItem => {
                const openContent = openItem.querySelector('[data-accordion-content]');
                openItem.classList.remove('open');
                if (openContent) openContent.style.maxHeight = '0';
              });
            }

            // Toggle current item
            if (isOpen) {
              item.classList.remove('open');
              content.style.maxHeight = '0';
            } else {
              item.classList.add('open');
              content.style.maxHeight = content.scrollHeight + 'px';
            }
          });
        });
      });
    },

    // ============================================
    // Copy Code Blocks
    // ============================================
    initCopyCode: function() {
      const codeBlocks = document.querySelectorAll('pre code');

      codeBlocks.forEach(block => {
        const pre = block.parentElement;
        if (!pre) return;

        // Create copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-code-btn';
        copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        copyBtn.title = 'Copy code';

        pre.style.position = 'relative';
        pre.appendChild(copyBtn);

        copyBtn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(block.textContent);
            copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            copyBtn.classList.add('copied');

            setTimeout(() => {
              copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
              copyBtn.classList.remove('copied');
            }, 2000);
          } catch (err) {
            console.error('Failed to copy:', err);
          }
        });
      });
    },

    // ============================================
    // Newsletter Form
    // ============================================
    initNewsletterForm: function() {
      const forms = document.querySelectorAll('.newsletter-form');

      forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();

          const emailInput = form.querySelector('input[type="email"]');
          const submitBtn = form.querySelector('button[type="submit"]');
          const messageEl = form.querySelector('.form-message');

          if (!emailInput) return;

          const email = emailInput.value.trim();

          if (!this.validateEmail(email)) {
            this.showFormMessage(form, 'Please enter a valid email address.', 'error');
            return;
          }

          // Disable form
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spinner"></span>';
          }

          try {
            // This would typically post to your newsletter endpoint
            // const response = await fetch('/api/newsletter', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ email })
            // });

            // Simulated success
            await new Promise(resolve => setTimeout(resolve, 1000));

            this.showFormMessage(form, 'Thank you for subscribing!', 'success');
            emailInput.value = '';
          } catch (error) {
            this.showFormMessage(form, 'Something went wrong. Please try again.', 'error');
          } finally {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = 'Subscribe';
            }
          }
        });
      });
    },

    // ============================================
    // Contact Form
    // ============================================
    initContactForm: function() {
      const form = document.querySelector('.contact-form form');
      if (!form) return;

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');

        // Basic validation
        const required = form.querySelectorAll('[required]');
        let isValid = true;

        required.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
          } else {
            field.classList.remove('error');
          }
        });

        if (!isValid) {
          this.showFormMessage(form, 'Please fill in all required fields.', 'error');
          return;
        }

        // Disable form
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
        }

        try {
          // This would typically post to your contact form endpoint
          // const response = await fetch('/api/contact', {
          //   method: 'POST',
          //   body: formData
          // });

          // Simulated success
          await new Promise(resolve => setTimeout(resolve, 1500));

          this.showFormMessage(form, 'Your message has been sent successfully!', 'success');
          form.reset();
        } catch (error) {
          this.showFormMessage(form, 'Something went wrong. Please try again.', 'error');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message';
          }
        }
      });
    },

    // ============================================
    // Reading Progress
    // ============================================
    initReadingProgress: function() {
      const progressBar = document.querySelector('.reading-progress');
      const article = document.querySelector('.single-post-content');

      if (!progressBar || !article) return;

      const updateProgress = () => {
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;

        const progress = Math.min(100, Math.max(0,
          ((scrollTop - articleTop + windowHeight * 0.5) / articleHeight) * 100
        ));

        progressBar.style.width = `${progress}%`;
      };

      window.addEventListener('scroll', updateProgress, { passive: true });
      updateProgress();
    },

    // ============================================
    // Utility Functions
    // ============================================
    validateEmail: function(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    showFormMessage: function(form, message, type) {
      let messageEl = form.querySelector('.form-message');

      if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.className = 'form-message';
        form.appendChild(messageEl);
      }

      messageEl.textContent = message;
      messageEl.className = `form-message form-message--${type}`;
      messageEl.style.display = 'block';

      setTimeout(() => {
        messageEl.style.display = 'none';
      }, 5000);
    },

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

    throttle: function(func, limit) {
      let inThrottle;
      return function executedFunction(...args) {
        if (!inThrottle) {
          func(...args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }
  };

  // ============================================
  // Initialize when DOM is ready
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DeveloperTheme.init());
  } else {
    DeveloperTheme.init();
  }

  // Expose to global scope for external use
  window.DeveloperTheme = DeveloperTheme;

})();
