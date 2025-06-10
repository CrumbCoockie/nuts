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
        
        this.isDragging = false;
        this.startPosX = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.sensitivity = 0.3;
        
        this.init();
    }

    init() {
        this.initPagination();
        this.setupEvents();
        this.updateSlider();
        this.addStyles();
    }

    addStyles() {
        this.track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        this.track.style.cursor = 'grab';
    }

    initPagination() {
        this.pagination.innerHTML = '';
        this.cards.forEach((_, i) => {
            const bullet = document.createElement('div');
            bullet.className = `bullet${i === 0 ? ' active' : ''}`;
            bullet.addEventListener('click', () => this.goToSlide(i));
            this.pagination.appendChild(bullet);
        });
    }

    setupEvents() {
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());

        this.track.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.track.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.track.addEventListener('touchend', this.handleTouchEnd.bind(this));

        this.track.addEventListener('mousedown', this.handleMouseStart.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('mouseup', this.handleMouseEnd.bind(this));
    }

    handleTouchStart(e) {
        this.startPosX = e.touches[0].clientX;
        this.track.style.transition = 'none';
        this.isDragging = true;
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;
        const currentX = e.touches[0].clientX;
        this.drag(currentX);
    }

    handleTouchEnd() {
        this.isDragging = false;
        this.settlePosition();
    }

    handleMouseStart(e) {
        e.preventDefault();
        this.startPosX = e.clientX;
        this.track.style.transition = 'none';
        this.isDragging = true;
        this.track.style.cursor = 'grabbing';
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        const currentX = e.clientX;
        this.drag(currentX);
    }

    handleMouseEnd() {
        this.isDragging = false;
        this.track.style.cursor = 'grab';
        this.settlePosition();
    }

    drag(currentX) {
        const deltaX = (currentX - this.startPosX) * this.sensitivity;
        const newTranslate = -this.currentIndex * this.cardWidth + deltaX;
        
        // Обмеження перетягування з урахуванням меж
        const minTranslate = -((this.maxIndex + 1) * this.cardWidth);
        this.currentTranslate = Math.max(minTranslate, Math.min(newTranslate, this.cardWidth));
        
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    settlePosition() {
        const movedBy = this.currentTranslate - (-this.currentIndex * this.cardWidth);
        const threshold = this.cardWidth * 0.2;
        
        if (movedBy < -threshold) {
            this.currentIndex = Math.min(this.currentIndex + 1, this.maxIndex);
        } else if (movedBy > threshold) {
            this.currentIndex = Math.max(this.currentIndex - 1, 0);
        }

        // Обмеження індексу
        this.currentIndex = Math.max(0, Math.min(this.currentIndex, this.maxIndex));
        
        this.currentTranslate = -this.currentIndex * this.cardWidth;
        this.track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
        
        this.updatePagination();
        this.updateButtons();
    }

    updatePagination() {
        this.pagination.querySelectorAll('.bullet').forEach((bullet, i) => {
            bullet.classList.toggle('active', i === this.currentIndex);
        });
    }

    updateButtons() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
            this.prevBtn.classList.toggle('disabled', this.currentIndex === 0);
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex === this.maxIndex;
            this.nextBtn.classList.toggle('disabled', this.currentIndex === this.maxIndex);
        }
    }

    goToSlide(index) {
        this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
        this.updateSlider(true);
    }

    prevSlide() {
        this.currentIndex = Math.max(0, this.currentIndex - 1);
        this.updateSlider(true);
    }

    nextSlide() {
        this.currentIndex = Math.min(this.maxIndex, this.currentIndex + 1);
        this.updateSlider(true);
    }

    updateSlider(withAnimation = true) {
        this.currentTranslate = -this.currentIndex * this.cardWidth;
        
        if (!withAnimation) {
            this.track.style.transition = 'none';
        }
        
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
        this.updatePagination();
        this.updateButtons();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.products-slider-container').forEach(container => {
        new ProductSlider(container);
    });
});