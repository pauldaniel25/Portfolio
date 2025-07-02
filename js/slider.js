// Image slider functionality
class ImageSlider {
    constructor() {
        this.sliders = document.querySelectorAll('.image-slider');
        this.init();
    }

    init() {
        this.sliders.forEach(slider => {
            this.setupSlider(slider);
        });
    }

    setupSlider(slider) {
        const track = slider.querySelector('.slider-track');
        const images = slider.querySelectorAll('.project-image-inline');
        const prevBtn = slider.querySelector('.slider-arrow.prev');
        const nextBtn = slider.querySelector('.slider-arrow.next');
        const dots = slider.parentElement.querySelectorAll('.slider-dot');
        
        let currentSlide = 0;
        const totalSlides = images.length;
        
        // Hide arrows and dots if only one image
        if (totalSlides <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            const dotsContainer = slider.parentElement.querySelector('.slider-dots');
            if (dotsContainer) dotsContainer.style.display = 'none';
            return;
        }
        
        // Touch/swipe variables
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let startTime = 0;
        
        const updateSlider = () => {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        };
        
        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        };
        
        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        };
        
        // Desktop: Arrow click handlers
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        // Touch/Swipe functionality for mobile and tablet
        const handleTouchStart = (e) => {
            startX = e.touches ? e.touches[0].clientX : e.clientX;
            currentX = startX;
            isDragging = true;
            startTime = Date.now();
            track.style.transition = 'none';
        };
        
        const handleTouchMove = (e) => {
            if (!isDragging) return;
            
            currentX = e.touches ? e.touches[0].clientX : e.clientX;
            const diff = currentX - startX;
            const percent = (diff / slider.offsetWidth) * 100;
            
            track.style.transform = `translateX(${-currentSlide * 100 + percent}%)`;
        };
        
        const handleTouchEnd = () => {
            if (!isDragging) return;
            
            isDragging = false;
            track.style.transition = 'transform 0.5s ease';
            
            const diff = currentX - startX;
            const timeDiff = Date.now() - startTime;
            const velocity = Math.abs(diff) / timeDiff;
            
            // Determine if swipe was significant enough
            const threshold = slider.offsetWidth * 0.2;
            const shouldSwipe = Math.abs(diff) > threshold || velocity > 0.3;
            
            if (shouldSwipe) {
                if (diff > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            } else {
                updateSlider();
            }
        };
        
        // Add touch event listeners
        slider.addEventListener('touchstart', handleTouchStart, { passive: true });
        slider.addEventListener('touchmove', handleTouchMove, { passive: false });
        slider.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Add mouse event listeners for desktop drag (optional)
        slider.addEventListener('mousedown', handleTouchStart);
        slider.addEventListener('mousemove', handleTouchMove);
        slider.addEventListener('mouseup', handleTouchEnd);
        slider.addEventListener('mouseleave', handleTouchEnd);
        
        // Dot click handlers
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateSlider();
            });
        });
        
        // Auto-play (optional) - disabled on mobile/tablet
        const isMobileOrTablet = window.innerWidth <= 768;
        if (!isMobileOrTablet) {
            setInterval(nextSlide, 5000);
        }
        
        // Initial update
        updateSlider();
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageSlider();
});