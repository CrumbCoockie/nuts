class ProductSlider {
    constructor(container) {
        this.container = container;
        this.slider = container.querySelector('.products-slider');
        this.track = container.querySelector('.product-container');
        this.cards = container.querySelectorAll('.product-card');
        this.pagination = container.querySelector('.slider-pagination');
        this.prevBtn = container.querySelector('.prev-btn');
        this.nextBtn = container.querySelector('.next-btn');
        
        this.cardWidth = this.cards[0].offsetWidth + 30;
        this.currentIndex = 0;
        this.maxIndex = this.cards.length - 1;
        
        this.initPagination();
        this.setupEvents();
        this.updateSlider();
    }
    
    initPagination() {
        this.pagination.innerHTML = '';
        this.cards.forEach((_, index) => {
            const bullet = document.createElement('div');
            bullet.classList.add('bullet');
            if(index === 0) bullet.classList.add('active');
            bullet.addEventListener('click', () => this.goToSlide(index));
            this.pagination.appendChild(bullet);
        });
    }
    
    setupEvents() {
        if(this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
        if(this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Touch events for mobile swipe
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});
        
        this.slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, {passive: true});
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        if(startX - endX > threshold) this.nextSlide();
        if(endX - startX > threshold) this.prevSlide();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlider();
    }
    
    prevSlide() {
        if(this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSlider();
        }
    }
    
    nextSlide() {
        if(this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateSlider();
        }
    }
    
    updateSlider() {
        const offset = -this.currentIndex * this.cardWidth;
        this.track.style.transform = `translateX(${offset}px)`;
        
        // Update pagination bullets
        const bullets = this.pagination.querySelectorAll('.bullet');
        bullets.forEach((bullet, index) => {
            bullet.classList.toggle('active', index === this.currentIndex);
        });
        
        // Update button states
        if(this.prevBtn) this.prevBtn.disabled = this.currentIndex === 0;
        if(this.nextBtn) this.nextBtn.disabled = this.currentIndex === this.maxIndex;
    }
}

// Ініціалізація слайдера
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.products-slider-container');
    sliders.forEach(container => new ProductSlider(container));
});