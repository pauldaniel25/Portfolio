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
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            slider.parentElement.querySelector('.slider-dots').style.display = 'none';
            return;
        }
        
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
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageSlider();
});