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
            this.setupSectionObserver();
            this.updateActiveNavItem();
        }
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
            navItem.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const sectionIndex = parseInt(navItem.getAttribute('data-section'));
                console.log(`Navigating to section ${sectionIndex}`); // Debug log
                
                this.navigateToSection(sectionIndex);
                
                // Optional: Close sidebar after navigation on mobile
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        this.closeSidebar();
                    }, 300);
                }
            });

            // Add hover effects
            navItem.addEventListener('mouseenter', () => {
                navItem.style.transform = 'scale(1.1)';
            });

            navItem.addEventListener('mouseleave', () => {
                if (!navItem.classList.contains('active')) {
                    navItem.style.transform = 'scale(1)';
                }
            });
        });
    }

    navigateToSection(sectionIndex) {
        if (sectionIndex >= 0 && sectionIndex < this.sections.length) {
            const targetSection = this.sections[sectionIndex];
            
            // Smooth scroll to section
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            this.currentSection = sectionIndex;
            this.updateActiveNavItem();
            
            // Trigger any section-specific animations
            this.triggerSectionAnimations(targetSection, sectionIndex);
        }
    }

    updateActiveNavItem() {
        // Remove active class from all nav items
        this.navItems.forEach(item => {
            item.classList.remove('active');
            item.style.transform = 'scale(1)';
        });
        
        // Add active class to current nav item
        if (this.navItems[this.currentSection]) {
            this.navItems[this.currentSection].classList.add('active');
            this.navItems[this.currentSection].style.transform = 'scale(1.05)';
        }
    }

    setupSectionObserver() {
        // Intersection Observer to track which section is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionIndex = Array.from(this.sections).indexOf(entry.target);
                    if (sectionIndex !== -1 && sectionIndex !== this.currentSection) {
                        this.currentSection = sectionIndex;
                        this.updateActiveNavItem();
                    }
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-50px 0px -50px 0px'
        });

        // Observe all sections
        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    triggerSectionAnimations(targetSection, sectionIndex) {
        // Trigger animations for specific sections
        if (targetSection.classList.contains('black-section')) {
            // Animate cards in the works section
            setTimeout(() => {
                const cards = targetSection.querySelectorAll('.card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate');
                    }, index * 200);
                });
            }, 300);
        }
        
        if (targetSection.classList.contains('skills-section')) {
            // Animate skill items
            setTimeout(() => {
                const skillItems = targetSection.querySelectorAll('.skill-item');
                skillItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.transform = 'translateY(0)';
                        item.style.opacity = '1';
                    }, index * 100);
                });
            }, 300);
        }
        
        if (targetSection.classList.contains('contact-section')) {
            // Animate contact items
            setTimeout(() => {
                const contactItems = targetSection.querySelectorAll('.contact-item, .social-link');
                contactItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.transform = 'translateY(0)';
                        item.style.opacity = '1';
                    }, index * 150);
                });
            }, 300);
        }
    }

    // Public method to get current section (for other modules)
    getCurrentSection() {
        return this.currentSection;
    }

    // Public method to navigate to section (for other modules)
    goToSection(index) {
        this.navigateToSection(index);
    }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Make SidebarManager globally accessible
    window.sidebarManager = new SidebarManager();
});