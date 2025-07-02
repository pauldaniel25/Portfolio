// Navigation and scrolling functionality
class Navigation {
    constructor() {
        this.scrollContainer = document.querySelector('.scroll-container');
        this.sections = document.querySelectorAll('.section');
        this.isScrolling = false;
        this.currentSection = 0;
        this.blackSectionAnimated = false;
        this.skillsSectionAnimated = false;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        this.touchStartY = 0;
        this.touchMoveY = 0;
        this.touchVelocity = 0;
        this.lastTouchTime = 0;
        this.isNavigatingViaSidebar = false; // Flag to prevent conflicts
        this.observerTimeout = null;
        this.init();
    }

    init() {
        this.setupScrollArrow();
        this.setupWheelNavigation();
        this.setupKeyboardNavigation();
        this.setupTouchNavigation();
        this.setupIntersectionObserver();
        this.updateSectionVisibility();
        this.handleResize();
        this.optimizeForMobile();
        
        // Make this instance globally accessible
        window.navigation = this;
    }

    optimizeForMobile() {
        if (this.isMobile) {
            document.body.style.touchAction = 'pan-y';
            this.scrollContainer.style.touchAction = 'pan-y';
            
            document.addEventListener('touchmove', (e) => {
                if (e.scale !== 1) { e.preventDefault(); }
            }, { passive: false });
            
            this.scrollContainer.style.willChange = 'scroll-position';
            this.sections.forEach(section => {
                section.style.willChange = 'transform';
            });
        }
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        });
    }

    scrollToSection(index, fromSidebar = false) {
        if (index >= 0 && index < this.sections.length) {
            const targetSection = this.sections[index];
            
            // Set flag if navigating from sidebar
            if (fromSidebar) {
                this.isNavigatingViaSidebar = true;
                this.currentSection = index;
                
                // Clear any pending observer updates
                if (this.observerTimeout) {
                    clearTimeout(this.observerTimeout);
                }
            }
            
            if (this.isMobile) {
                this.scrollContainer.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            } else {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            if (!fromSidebar) {
                this.currentSection = index;
            }
            
            this.updateSectionVisibility();
            this.triggerSectionAnimations(targetSection, index);
            
            // Update sidebar if navigating from navigation
            if (!fromSidebar && window.sidebarManager) {
                window.sidebarManager.updateCurrentSection(index);
            }
            
            // Reset sidebar flag after scroll completes
            if (fromSidebar) {
                setTimeout(() => {
                    this.isNavigatingViaSidebar = false;
                }, 1000);
            }
        }
    }

    setupScrollArrow() {
        const scrollArrow = document.getElementById('scroll-arrow');
        
        if (scrollArrow) {
            scrollArrow.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.currentSection < this.sections.length - 1) {
                    this.currentSection++;
                    this.scrollToSection(this.currentSection);
                }
            });
        }
    }

    setupWheelNavigation() {
        if (!this.isMobile) {
            this.scrollContainer.addEventListener('wheel', (e) => {
                e.preventDefault();
                
                if (this.isScrolling || this.isNavigatingViaSidebar) return;
                
                this.isScrolling = true;
                
                if (e.deltaY > 0) {
                    if (this.currentSection < this.sections.length - 1) {
                        this.currentSection++;
                        this.scrollToSection(this.currentSection);
                    }
                } else {
                    if (this.currentSection > 0) {
                        this.currentSection--;
                        this.scrollToSection(this.currentSection);
                    }
                }
                
                setTimeout(() => {
                    this.isScrolling = false;
                }, 800);
            });
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.isScrolling || this.isNavigatingViaSidebar) return;
            
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
        let isScrollingProgrammatically = false;
        let touchHistory = [];
        
        this.scrollContainer.addEventListener('touchstart', (e) => {
            if (this.isNavigatingViaSidebar) return;
            
            this.touchStartY = e.touches[0].clientY;
            this.touchMoveY = this.touchStartY;
            this.lastTouchTime = Date.now();
            this.touchVelocity = 0;
            touchHistory = [];
            
            touchHistory.push({
                y: this.touchStartY,
                time: this.lastTouchTime
            });
            
        }, { passive: true });

        this.scrollContainer.addEventListener('touchmove', (e) => {
            if (this.isNavigatingViaSidebar) return;
            
            const currentY = e.touches[0].clientY;
            const currentTime = Date.now();
            
            touchHistory.push({
                y: currentY,
                time: currentTime
            });
            
            touchHistory = touchHistory.filter(touch => currentTime - touch.time < 100);
            
            if (touchHistory.length >= 2) {
                const recent = touchHistory[touchHistory.length - 1];
                const previous = touchHistory[0];
                const timeDiff = recent.time - previous.time;
                const distanceDiff = recent.y - previous.y;
                this.touchVelocity = timeDiff > 0 ? distanceDiff / timeDiff : 0;
            }
            
            this.touchMoveY = currentY;
            
        }, { passive: true });

        this.scrollContainer.addEventListener('touchend', (e) => {
            if (this.isScrolling || isScrollingProgrammatically || this.isNavigatingViaSidebar) return;
            
            const swipeDistance = this.touchStartY - this.touchMoveY;
            const swipeTime = Date.now() - this.lastTouchTime;
            const absVelocity = Math.abs(this.touchVelocity);
            
            const minDistance = 30;
            const minVelocity = 0.3;
            const maxTime = 500;
            
            const shouldNavigate = (
                Math.abs(swipeDistance) > minDistance || 
                absVelocity > minVelocity
            ) && swipeTime < maxTime;
            
            if (shouldNavigate && !this.isScrolling) {
                this.isScrolling = true;
                isScrollingProgrammatically = true;
                
                const isUpSwipe = swipeDistance > 0 || this.touchVelocity < -minVelocity;
                const isDownSwipe = swipeDistance < 0 || this.touchVelocity > minVelocity;
                
                if (isUpSwipe && this.currentSection < this.sections.length - 1) {
                    this.currentSection++;
                    this.scrollToSection(this.currentSection);
                } else if (isDownSwipe && this.currentSection > 0) {
                    this.currentSection--;
                    this.scrollToSection(this.currentSection);
                }
                
                setTimeout(() => {
                    this.isScrolling = false;
                    isScrollingProgrammatically = false;
                }, 600);
            }
            
        }, { passive: true });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            // Ignore observer updates if navigating via sidebar
            if (this.isNavigatingViaSidebar) return;
            
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionIndex = Array.from(this.sections).indexOf(entry.target);
                    if (sectionIndex !== -1 && sectionIndex !== this.currentSection) {
                        // Add a small delay to prevent conflicts with sidebar navigation
                        this.observerTimeout = setTimeout(() => {
                            if (!this.isNavigatingViaSidebar) {
                                this.currentSection = sectionIndex;
                                this.updateSectionVisibility();
                                this.triggerSectionAnimations(entry.target, sectionIndex);
                                
                                if (window.sidebarManager) {
                                    window.sidebarManager.updateCurrentSection(sectionIndex);
                                }
                            }
                        }, 100);
                    }
                }
            });
        }, {
            threshold: this.isMobile ? 0.6 : 0.5,
            rootMargin: this.isMobile ? '-20% 0px -20% 0px' : '-10% 0px -10% 0px'
        });

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    updateSectionVisibility() {
        this.sections.forEach((section, index) => {
            if (index === this.currentSection) {
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
    
    triggerSectionAnimations(targetSection, sectionIndex) {
        if (targetSection.classList.contains('black-section') && !this.blackSectionAnimated) {
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
        
        if (targetSection.classList.contains('skills-section') && !this.skillsSectionAnimated) {
            setTimeout(() => {
                const skillCategories = targetSection.querySelectorAll('.skill-category');
                skillCategories.forEach((category, index) => {
                    setTimeout(() => {
                        category.style.transform = 'translateY(0)';
                        category.style.opacity = '1';
                    }, index * 200);
                });
                
                const skillItems = targetSection.querySelectorAll('.skill-item');
                skillItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.transform = 'translateY(0)';
                        item.style.opacity = '1';
                    }, 400 + (index * 100));
                });
                
                this.skillsSectionAnimated = true;
            }, 300);
        }
        
        if (targetSection.classList.contains('contact-section')) {
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

    getCurrentSection() {
        return this.currentSection;
    }

    goToSection(index, fromSidebar = false) {
        this.scrollToSection(index, fromSidebar);
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});