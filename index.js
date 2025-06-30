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

// Project detail functionality - Arknights style
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    const blackSection = document.getElementById('black-section');
    const cardsContainer = document.getElementById('cards-container');
    const projectDetailsContainer = document.getElementById('project-details-container');
    const projectDetailsInline = document.querySelectorAll('.project-detail-inline');
    const closeBtn = document.getElementById('close-project-btn');

    // Card click handlers
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const cardId = this.id.toLowerCase();
            const detailId = cardId + '-detail-inline';
            
            // Add detail view classes
            blackSection.classList.add('detail-view');
            cardsContainer.classList.add('detail-active');
            projectDetailsContainer.classList.add('active');
            
            // Hide all project details first
            projectDetailsInline.forEach(detail => {
                detail.classList.remove('active');
            });
            
            // Show selected project detail
            const projectDetail = document.getElementById(detailId);
            if (projectDetail) {
                setTimeout(() => {
                    projectDetail.classList.add('active');
                }, 300);
            }
        });
    });

    // Close button handler
closeBtn.addEventListener('click', function() {
    // Remove detail view classes in the right order
    projectDetailsContainer.classList.remove('active');
    
    // Let the project details fade out first, then bring cards back
    setTimeout(() => {
        blackSection.classList.remove('detail-view');
        cardsContainer.classList.remove('detail-active');
        
        // Hide all project details
        projectDetailsInline.forEach(detail => {
            detail.classList.remove('active');
        });
    }, 300);
});
});


// Image slider functionality
document.addEventListener('DOMContentLoaded', function() {
    const sliders = document.querySelectorAll('.image-slider');
    
    sliders.forEach(slider => {
        const track = slider.querySelector('.slider-track');
        const images = slider.querySelectorAll('.project-image-inline');
        const prevBtn = slider.querySelector('.slider-arrow.prev');
        const nextBtn = slider.querySelector('.slider-arrow.next');
        const dots = slider.parentElement.querySelectorAll('.slider-dot');
        
        let currentSlide = 0;
        const totalSlides = images.length;
        
        // Hide arrows and dots if only one image
        if (totalSlides <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            slider.parentElement.querySelector('.slider-dots').style.display = 'none';
            return;
        }
        
        function updateSlider() {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        }
        
        // Arrow click handlers
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        // Dot click handlers
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateSlider();
            });
        });
        
        // Auto-play (optional)
         setInterval(nextSlide, 5000);
    });
});

