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
    }

    optimizeForMobile() {
        if (this.isMobile) {
            // Disable default touch behaviors that might interfere
            document.body.style.touchAction = 'pan-y';
            this.scrollContainer.style.touchAction = 'pan-y';
            
            // Prevent iOS bounce and zoom
            document.addEventListener('touchmove', (e) => {
                if (e.scale !== 1) { e.preventDefault(); }
            }, { passive: false });
            
            // Optimize for 60fps on mobile
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

    scrollToSection(index) {
        if (index >= 0 && index < this.sections.length) {
            const targetSection = this.sections[index];
            
            if (this.isMobile) {
                // For mobile: Use smooth native scrolling with CSS scroll-snap
                this.scrollContainer.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            } else {
                // For desktop: Use scrollIntoView
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            this.currentSection = index;
            this.updateSectionVisibility();
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
        // Desktop wheel navigation
        if (!this.isMobile) {
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
                
                setTimeout(() => {
                    this.isScrolling = false;
                }, 800);
            });
        }
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
        let isScrollingProgrammatically = false;
        let touchHistory = [];
        
        // Touch start
        this.scrollContainer.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
            this.touchMoveY = this.touchStartY;
            this.lastTouchTime = Date.now();
            this.touchVelocity = 0;
            touchHistory = [];
            
            // Record initial touch
            touchHistory.push({
                y: this.touchStartY,
                time: this.lastTouchTime
            });
            
        }, { passive: true });

        // Touch move - track velocity like Arknights
        this.scrollContainer.addEventListener('touchmove', (e) => {
            const currentY = e.touches[0].clientY;
            const currentTime = Date.now();
            
            // Track touch history for velocity calculation
            touchHistory.push({
                y: currentY,
                time: currentTime
            });
            
            // Keep only recent touches (last 100ms)
            touchHistory = touchHistory.filter(touch => currentTime - touch.time < 100);
            
            // Calculate velocity
            if (touchHistory.length >= 2) {
                const recent = touchHistory[touchHistory.length - 1];
                const previous = touchHistory[0];
                const timeDiff = recent.time - previous.time;
                const distanceDiff = recent.y - previous.y;
                this.touchVelocity = timeDiff > 0 ? distanceDiff / timeDiff : 0;
            }
            
            this.touchMoveY = currentY;
            
        }, { passive: true });

        // Touch end - Arknights-style smooth section snapping
        this.scrollContainer.addEventListener('touchend', (e) => {
            if (this.isScrolling || isScrollingProgrammatically) return;
            
            const swipeDistance = this.touchStartY - this.touchMoveY;
            const swipeTime = Date.now() - this.lastTouchTime;
            const absVelocity = Math.abs(this.touchVelocity);
            
            // Arknights-inspired thresholds
            const minDistance = 30;
            const minVelocity = 0.3;
            const maxTime = 500;
            
            // Determine if we should navigate
            const shouldNavigate = (
                Math.abs(swipeDistance) > minDistance || 
                absVelocity > minVelocity
            ) && swipeTime < maxTime;
            
            if (shouldNavigate && !this.isScrolling) {
                this.isScrolling = true;
                isScrollingProgrammatically = true;
                
                // Determine direction based on distance and velocity
                const isUpSwipe = swipeDistance > 0 || this.touchVelocity < -minVelocity;
                const isDownSwipe = swipeDistance < 0 || this.touchVelocity > minVelocity;
                
                if (isUpSwipe && this.currentSection < this.sections.length - 1) {
                    // Swipe up - go to next section
                    this.currentSection++;
                    this.scrollToSection(this.currentSection);
                } else if (isDownSwipe && this.currentSection > 0) {
                    // Swipe down - go to previous section
                    this.currentSection--;
                    this.scrollToSection(this.currentSection);
                }
                
                // Reset flags after smooth scroll completes
                setTimeout(() => {
                    this.isScrolling = false;
                    isScrollingProgrammatically = false;
                }, 600);
            }
            
        }, { passive: true });

        // Prevent default scroll behavior during programmatic scrolling
        this.scrollContainer.addEventListener('scroll', (e) => {
            if (isScrollingProgrammatically) {
                return;
            }
        }, { passive: true });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionIndex = Array.from(this.sections).indexOf(entry.target);
                    if (sectionIndex !== -1 && sectionIndex !== this.currentSection) {
                        this.currentSection = sectionIndex;
                        this.updateSectionVisibility();
                        
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
            threshold: this.isMobile ? 0.6 : 0.5,
            rootMargin: this.isMobile ? '-20% 0px -20% 0px' : '-10% 0px -10% 0px'
        });

        // Observe all sections
        this.sections.forEach(section => {
            observer.observe(section);
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