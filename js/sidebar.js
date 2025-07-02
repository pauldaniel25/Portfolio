// Sidebar navigation functionality
class SidebarManager {
    constructor() {
        this.navToggle = document.getElementById('nav-toggle');
        this.navSidebar = document.getElementById('nav-sidebar');
        this.navItems = document.querySelectorAll('.nav-item');
        this.sections = document.querySelectorAll('.section');
        this.currentSection = 0;
        this.init();
    }

    init() {
        if (this.navToggle && this.navSidebar) {
            this.setupToggleButton();
            this.setupOutsideClick();
            this.setupEscapeKey();
            this.setupNavigationItems();
            this.updateActiveNavItem();
        }
        
        // Make this instance globally accessible
        window.sidebarManager = this;
    }

    setupToggleButton() {
        this.navToggle.addEventListener('click', () => {
            this.toggleSidebar();
        });
    }

    toggleSidebar() {
        this.navToggle.classList.toggle('active');
        this.navSidebar.classList.toggle('active');
    }

    closeSidebar() {
        this.navToggle.classList.remove('active');
        this.navSidebar.classList.remove('active');
    }

    setupOutsideClick() {
        document.addEventListener('click', (e) => {
            if (!this.navSidebar.contains(e.target) && !this.navToggle.contains(e.target)) {
                this.closeSidebar();
            }
        });
    }

    setupEscapeKey() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSidebar();
            }
        });
    }

    setupNavigationItems() {
        this.navItems.forEach((navItem, index) => {
            const handleNavigation = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const sectionIndex = parseInt(navItem.getAttribute('data-section'));
                
                // Update current section immediately
                this.currentSection = sectionIndex;
                this.updateActiveNavItem();
                
                // Navigate via the navigation system with sidebar flag
                if (window.navigation) {
                    window.navigation.goToSection(sectionIndex, true);
                } else {
                    // Fallback if navigation isn't ready
                    this.navigateToSection(sectionIndex);
                }
                
            };

            navItem.addEventListener('click', handleNavigation);

            navItem.addEventListener('touchstart', (e) => {
                e.preventDefault();
                navItem.style.transform = 'scale(1.1)';
            }, { passive: false });

            navItem.addEventListener('touchend', (e) => {
                e.preventDefault();
                setTimeout(() => {
                    navItem.style.transform = navItem.classList.contains('active') ? 'scale(1.05)' : 'scale(1)';
                }, 100);
                handleNavigation(e);
            }, { passive: false });

            navItem.addEventListener('mouseenter', () => {
                if (!('ontouchstart' in window)) {
                    if (!navItem.classList.contains('active')) {
                        navItem.style.transform = 'scale(1.1)';
                    }
                }
            });

            navItem.addEventListener('mouseleave', () => {
                if (!('ontouchstart' in window)) {
                    if (!navItem.classList.contains('active')) {
                        navItem.style.transform = 'scale(1)';
                    }
                }
            });
        });
    }

    navigateToSection(sectionIndex) {
        if (sectionIndex >= 0 && sectionIndex < this.sections.length) {
            const targetSection = this.sections[sectionIndex];
            
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            this.currentSection = sectionIndex;
            this.updateActiveNavItem();
        }
    }

    updateActiveNavItem() {
        this.navItems.forEach(item => {
            item.classList.remove('active');
            item.style.transform = 'scale(1)';
        });
        
        if (this.navItems[this.currentSection]) {
            this.navItems[this.currentSection].classList.add('active');
            this.navItems[this.currentSection].style.transform = 'scale(1.05)';
        }
    }

    // Method to be called from navigation.js to update current section
    updateCurrentSection(sectionIndex) {
        if (sectionIndex !== this.currentSection) {
            this.currentSection = sectionIndex;
            this.updateActiveNavItem();
        }
    }

    getCurrentSection() {
        return this.currentSection;
    }

    goToSection(index) {
        this.currentSection = index;
        this.updateActiveNavItem();
        
        if (window.navigation) {
            window.navigation.goToSection(index, true);
        } else {
            this.navigateToSection(index);
        }
    }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SidebarManager();
});