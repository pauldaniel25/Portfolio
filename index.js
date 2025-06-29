document.addEventListener('DOMContentLoaded', function() {
    const scrollContainer = document.querySelector('.scroll-container');
    const sections = document.querySelectorAll('.section');
    let isScrolling = false;
    let currentSection = 0;

    // Smooth scroll to section function
    function scrollToSection(index) {
        if (index >= 0 && index < sections.length) {
            const targetSection = sections[index];
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            currentSection = index;
            updateSectionVisibility();
        }
    }

    // Enhanced wheel event for smoother control
    scrollContainer.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        if (isScrolling) return;
        
        isScrolling = true;
        
        if (e.deltaY > 0) {
            // Scrolling down
            if (currentSection < sections.length - 1) {
                currentSection++;
                scrollToSection(currentSection);
            }
        } else {
            // Scrolling up
            if (currentSection > 0) {
                currentSection--;
                scrollToSection(currentSection);
            }
        }
        
        // Reset scrolling flag after animation
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (isScrolling) return;
        
        switch(e.key) {
            case 'ArrowDown':
            case ' ':
                e.preventDefault();
                if (currentSection < sections.length - 1) {
                    currentSection++;
                    scrollToSection(currentSection);
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (currentSection > 0) {
                    currentSection--;
                    scrollToSection(currentSection);
                }
                break;
            case 'Home':
                e.preventDefault();
                currentSection = 0;
                scrollToSection(currentSection);
                break;
            case 'End':
                e.preventDefault();
                currentSection = sections.length - 1;
                scrollToSection(currentSection);
                break;
        }
    });

    // Touch/swipe support for mobile
    let touchStartY = 0;
    let touchEndY = 0;

    scrollContainer.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });

    scrollContainer.addEventListener('touchend', function(e) {
        if (isScrolling) return;
        
        touchEndY = e.changedTouches[0].screenY;
        const swipeDistance = touchStartY - touchEndY;
        
        if (Math.abs(swipeDistance) > 50) {
            isScrolling = true;
            
            if (swipeDistance > 0 && currentSection < sections.length - 1) {
                // Swipe up - go to next section
                currentSection++;
                scrollToSection(currentSection);
            } else if (swipeDistance < 0 && currentSection > 0) {
                // Swipe down - go to previous section
                currentSection--;
                scrollToSection(currentSection);
            }
            
            setTimeout(() => {
                isScrolling = false;
            }, 800);
        }
    });

    // Intersection Observer to track current section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionIndex = Array.from(sections).indexOf(entry.target);
                if (sectionIndex !== -1) {
                    currentSection = sectionIndex;
                    updateSectionVisibility();
                }
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });

    // Initialize sections with proper styling
    sections.forEach((section, index) => {
        section.style.transition = 'opacity 0.6s ease-in-out';
    });

let blackSectionAnimated = false;

  function updateSectionVisibility() {
    sections.forEach((section, index) => {
        if (index === currentSection) {
            // section.style.opacity = '1';
            
            // Animate cards in black section
            if (section.classList.contains('black-section') && !blackSectionAnimated) {
                const cards = section.querySelectorAll('.card');
                cards.forEach(card => {
                    card.classList.add('animate');
                });
                 blackSectionAnimated = true;
            }
        } 
    });
}

    // Initial setup
    updateSectionVisibility();
});