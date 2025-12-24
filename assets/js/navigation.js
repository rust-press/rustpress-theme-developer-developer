/**
 * Developer Developer Theme - Navigation JavaScript
 * Handles all navigation-related functionality
 */

(function() {
  'use strict';

  const Navigation = {
    // ============================================
    // Configuration
    // ============================================
    config: {
      mobileBreakpoint: 768,
      dropdownDelay: 200,
      megaMenuDelay: 100
    },

    // ============================================
    // Initialize
    // ============================================
    init: function() {
      this.initDesktopNav();
      this.initMegaMenu();
      this.initKeyboardNav();
      this.initBreadcrumbs();
      this.initStickyNav();
    },

    // ============================================
    // Desktop Navigation
    // ============================================
    initDesktopNav: function() {
      const navItems = document.querySelectorAll('.nav-menu > li');

      navItems.forEach(item => {
        const subMenu = item.querySelector('.sub-menu');
        if (!subMenu) return;

        let timeout;

        // Mouse enter
        item.addEventListener('mouseenter', () => {
          clearTimeout(timeout);
          this.closeAllDropdowns();
          item.classList.add('dropdown-open');
        });

        // Mouse leave with delay
        item.addEventListener('mouseleave', () => {
          timeout = setTimeout(() => {
            item.classList.remove('dropdown-open');
          }, this.config.dropdownDelay);
        });

        // Click for touch devices
        const link = item.querySelector(':scope > a');
        if (link && window.matchMedia('(hover: none)').matches) {
          link.addEventListener('click', (e) => {
            if (subMenu) {
              e.preventDefault();
              item.classList.toggle('dropdown-open');
            }
          });
        }
      });
    },

    closeAllDropdowns: function() {
      document.querySelectorAll('.nav-menu > li.dropdown-open').forEach(item => {
        item.classList.remove('dropdown-open');
      });
    },

    // ============================================
    // Mega Menu
    // ============================================
    initMegaMenu: function() {
      const megaMenuItems = document.querySelectorAll('.nav-menu > li.has-mega-menu');

      megaMenuItems.forEach(item => {
        const megaMenu = item.querySelector('.mega-menu');
        if (!megaMenu) return;

        let timeout;

        item.addEventListener('mouseenter', () => {
          clearTimeout(timeout);
          this.closeAllMegaMenus();
          item.classList.add('mega-menu-open');

          // Position mega menu
          this.positionMegaMenu(megaMenu);
        });

        item.addEventListener('mouseleave', () => {
          timeout = setTimeout(() => {
            item.classList.remove('mega-menu-open');
          }, this.config.megaMenuDelay);
        });
      });
    },

    closeAllMegaMenus: function() {
      document.querySelectorAll('.nav-menu > li.mega-menu-open').forEach(item => {
        item.classList.remove('mega-menu-open');
      });
    },

    positionMegaMenu: function(megaMenu) {
      const container = document.querySelector('.container');
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const menuRect = megaMenu.getBoundingClientRect();

      // Center the mega menu with the container
      const leftOffset = containerRect.left - menuRect.left;
      megaMenu.style.left = `${leftOffset}px`;
      megaMenu.style.width = `${containerRect.width}px`;
    },

    // ============================================
    // Keyboard Navigation
    // ============================================
    initKeyboardNav: function() {
      const navMenu = document.querySelector('.nav-menu');
      if (!navMenu) return;

      navMenu.addEventListener('keydown', (e) => {
        const currentItem = document.activeElement.closest('li');
        if (!currentItem) return;

        const items = Array.from(navMenu.querySelectorAll(':scope > li'));
        const currentIndex = items.indexOf(currentItem);
        const subMenu = currentItem.querySelector('.sub-menu');
        const isInSubMenu = document.activeElement.closest('.sub-menu');

        switch (e.key) {
          case 'ArrowRight':
            if (!isInSubMenu && currentIndex < items.length - 1) {
              e.preventDefault();
              items[currentIndex + 1].querySelector('a')?.focus();
            }
            break;

          case 'ArrowLeft':
            if (!isInSubMenu && currentIndex > 0) {
              e.preventDefault();
              items[currentIndex - 1].querySelector('a')?.focus();
            }
            break;

          case 'ArrowDown':
            e.preventDefault();
            if (subMenu && !isInSubMenu) {
              currentItem.classList.add('dropdown-open');
              subMenu.querySelector('a')?.focus();
            } else if (isInSubMenu) {
              const subItems = Array.from(isInSubMenu.querySelectorAll('li'));
              const subCurrentItem = document.activeElement.closest('li');
              const subCurrentIndex = subItems.indexOf(subCurrentItem);
              if (subCurrentIndex < subItems.length - 1) {
                subItems[subCurrentIndex + 1].querySelector('a')?.focus();
              }
            }
            break;

          case 'ArrowUp':
            e.preventDefault();
            if (isInSubMenu) {
              const subItems = Array.from(isInSubMenu.querySelectorAll('li'));
              const subCurrentItem = document.activeElement.closest('li');
              const subCurrentIndex = subItems.indexOf(subCurrentItem);
              if (subCurrentIndex > 0) {
                subItems[subCurrentIndex - 1].querySelector('a')?.focus();
              } else {
                currentItem.querySelector(':scope > a')?.focus();
                currentItem.classList.remove('dropdown-open');
              }
            }
            break;

          case 'Escape':
            if (isInSubMenu) {
              e.preventDefault();
              currentItem.querySelector(':scope > a')?.focus();
              currentItem.classList.remove('dropdown-open');
            }
            break;

          case 'Enter':
          case ' ':
            if (subMenu && !isInSubMenu) {
              e.preventDefault();
              currentItem.classList.toggle('dropdown-open');
              if (currentItem.classList.contains('dropdown-open')) {
                subMenu.querySelector('a')?.focus();
              }
            }
            break;
        }
      });

      // Close dropdowns when focus leaves menu
      navMenu.addEventListener('focusout', (e) => {
        setTimeout(() => {
          if (!navMenu.contains(document.activeElement)) {
            this.closeAllDropdowns();
          }
        }, 0);
      });
    },

    // ============================================
    // Breadcrumbs
    // ============================================
    initBreadcrumbs: function() {
      const breadcrumbs = document.querySelector('.breadcrumbs');
      if (!breadcrumbs) return;

      // Make breadcrumbs responsive
      const checkOverflow = () => {
        const items = breadcrumbs.querySelectorAll('.breadcrumb-item');
        if (items.length <= 2) return;

        const containerWidth = breadcrumbs.offsetWidth;
        let totalWidth = 0;

        items.forEach((item, index) => {
          totalWidth += item.offsetWidth;
          if (index < items.length - 1) {
            totalWidth += 20; // Separator width
          }
        });

        if (totalWidth > containerWidth) {
          breadcrumbs.classList.add('collapsed');
        } else {
          breadcrumbs.classList.remove('collapsed');
        }
      };

      // Handle collapsed breadcrumbs expansion
      const ellipsis = breadcrumbs.querySelector('.breadcrumb-ellipsis');
      if (ellipsis) {
        ellipsis.addEventListener('click', () => {
          breadcrumbs.classList.toggle('expanded');
        });
      }

      checkOverflow();
      window.addEventListener('resize', this.debounce(checkOverflow, 200));
    },

    // ============================================
    // Sticky Navigation
    // ============================================
    initStickyNav: function() {
      const stickyNav = document.querySelector('.sticky-nav');
      if (!stickyNav) return;

      const placeholder = document.createElement('div');
      placeholder.className = 'sticky-nav-placeholder';
      placeholder.style.display = 'none';

      stickyNav.parentNode.insertBefore(placeholder, stickyNav);

      const navTop = stickyNav.offsetTop;
      const navHeight = stickyNav.offsetHeight;

      const handleScroll = () => {
        if (window.pageYOffset >= navTop) {
          stickyNav.classList.add('is-sticky');
          placeholder.style.display = 'block';
          placeholder.style.height = `${navHeight}px`;
        } else {
          stickyNav.classList.remove('is-sticky');
          placeholder.style.display = 'none';
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
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
    }
  };

  // ============================================
  // Initialize when DOM is ready
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Navigation.init());
  } else {
    Navigation.init();
  }

  // Expose to global scope
  window.DeveloperNavigation = Navigation;

})();
