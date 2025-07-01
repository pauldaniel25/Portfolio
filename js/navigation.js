// Navigation and scrolling functionality
class Navigation {
    constructor() {
        this.scrollContainer = document.querySelector('.scroll-container');
        this.sections = document.querySelectorAll('.section');
        this.isScrolling = false;
        this.currentSection = 0;
        this.blackSectionAnimated = false;
        this.skillsSectionAnimated = false;
        this.init();
    }

    init() {
        this.setupScrollArrow();
        this.setupWheelNavigation();
        this.setupKeyboardNavigation();
        this.setupTouchNavigation();
        this.setupIntersectionObserver();
        this.updateSectionVisibility();
    }

    scrollToSection(index) {
        if (index >= 0 && index < this.sections.length) {
            const targetSection = this.sections[index];
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            this.currentSection = index;
            this.updateSectionVisibility();
            
            // Fixed: Call the correct method name
            this.triggerSectionAnimations(targetSection, index);
        }
    }

    setupScrollArrow() {
        const scrollArrow = document.getElementById('scroll-arrow');
        
        if (scrollArrow) {
            scrollArrow.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Arrow clicked!');
                if (this.currentSection < this.sections.length - 1) {
                    this.currentSection++;
                    this.scrollToSection(this.currentSection);
                }
            });
        }
    }

    setupWheelNavigation() {
        this.scrollContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            if (this.isScrolling) return;
            
            this.isScrolling = true;
            
            if (e.deltaY > 0) {
                // Scrolling down
                if (this.currentSection < this.sections.length - 1) {
                    this.currentSection++;
                    this.scrollToSection(this.currentSection);
                }
            } else {
                // Scrolling up
                if (this.currentSection > 0) {
                    this.currentSection--;
                    this.scrollToSection(this.currentSection);
                }
            }
            
            // Reset scrolling flag after animation
            setTimeout(() => {
                this.isScrolling = false;
            }, 800);
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.isScrolling) return;
            
            switch(e.key) {
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    if (this.currentSection < this.sections.length - 1) {
                        this.currentSection++;
                        this.scrollToSection(this.currentSection);
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (this.currentSection > 0) {
                        this.currentSection--;
                        this.scrollToSection(this.currentSection);
                    }
                    break;
                case 'Home':
                    e.preventDefault();
                    this.currentSection = 0;
                    this.scrollToSection(this.currentSection);
                    break;
                case 'End':
                    e.preventDefault();
                    this.currentSection = this.sections.length - 1;
                    this.scrollToSection(this.currentSection);
                    break;
            }
        });
    }

    setupTouchNavigation() {
        let touchStartY = 0;
        let touchEndY = 0;

        this.scrollContainer.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        });

        this.scrollContainer.addEventListener('touchend', (e) => {
            if (this.isScrolling) return;
            
            touchEndY = e.changedTouches[0].screenY;
            const swipeDistance = touchStartY - touchEndY;
            
            if (Math.abs(swipeDistance) > 50) {
                this.isScrolling = true;
                
                if (swipeDistance > 0 && this.currentSection < this.sections.length - 1) {
                    // Swipe up - go to next section
                    this.currentSection++;
                    this.scrollToSection(this.currentSection);
                } else if (swipeDistance < 0 && this.currentSection > 0) {
                    // Swipe down - go to previous section
                    this.currentSection--;
                    this.scrollToSection(this.currentSection);
                }
                
                setTimeout(() => {
                    this.isScrolling = false;
                }, 800);
            }
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionIndex = Array.from(this.sections).indexOf(entry.target);
                    if (sectionIndex !== -1) {
                        this.currentSection = sectionIndex;
                        this.updateSectionVisibility();
                        
                        // Fixed: Call the correct method name and add debug logging
                        console.log(`Section ${sectionIndex} is now visible`);
                        this.triggerSectionAnimations(entry.target, sectionIndex);
                        
                        // Update sidebar if it exists
                        if (window.sidebarManager) {
                            window.sidebarManager.currentSection = sectionIndex;
                            window.sidebarManager.updateActiveNavItem();
                        }
                    }
                }
            });
        }, {
            threshold: 0.5
        });

        // Observe all sections
        this.sections.forEach(section => {
            observer.observe(section);
            section.style.transition = 'opacity 0.6s ease-in-out';
        });
    }

    updateSectionVisibility() {
        this.sections.forEach((section, index) => {
            if (index === this.currentSection) {
                // Animate cards in black section
                if (section.classList.contains('black-section') && !this.blackSectionAnimated) {
                    const cards = section.querySelectorAll('.card');
                    cards.forEach(card => {
                        card.classList.add('animate');
                    });
                    this.blackSectionAnimated = true;
                }
            } 
        });
    }
    
    // Fixed: Corrected method name and improved logic
    triggerSectionAnimations(targetSection, sectionIndex) {
        console.log(`Triggering animations for section: ${targetSection.className}`);
        
        // Animate cards in the works section (black section)
        if (targetSection.classList.contains('black-section') && !this.blackSectionAnimated) {
            console.log('Animating black section cards');
            setTimeout(() => {
                const cards = targetSection.querySelectorAll('.card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate');
                    }, index * 200);
                });
                this.blackSectionAnimated = true;
            }, 300);
        }
        
        // Animate skill items in the skills section
        if (targetSection.classList.contains('skills-section') && !this.skillsSectionAnimated) {
            console.log('Animating skills section');
            setTimeout(() => {
                // First animate skill categories
                const skillCategories = targetSection.querySelectorAll('.skill-category');
                console.log(`Found ${skillCategories.length} skill categories`);
                skillCategories.forEach((category, index) => {
                    setTimeout(() => {
                        category.style.transform = 'translateY(0)';
                        category.style.opacity = '1';
                        console.log(`Animated category ${index + 1}`);
                    }, index * 200);
                });
                
                // Then animate individual skill items
                const skillItems = targetSection.querySelectorAll('.skill-item');
                console.log(`Found ${skillItems.length} skill items`);
                skillItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.transform = 'translateY(0)';
                        item.style.opacity = '1';
                    }, 400 + (index * 100));
                });
                
                this.skillsSectionAnimated = true;
            }, 300);
        }
        
        // Animate contact items in the contact section
        if (targetSection.classList.contains('contact-section')) {
            console.log('Animating contact section');
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

    // Public method to get current section
    getCurrentSection() {
        return this.currentSection;
    }

    // Public method to navigate to section
    goToSection(index) {
        this.scrollToSection(index);
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Make Navigation globally accessible
    window.navigation = new Navigation();
});