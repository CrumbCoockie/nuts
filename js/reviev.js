class TestimonialSlider {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID "${containerId}" not found. Slider cannot be initialized.`);
            return;
        }

        // Оновлені селектори для нової структури HTML
        // products-slider - це flex-контейнер, який містить product-container
        // product-container - це той елемент, який ми будемо трансформувати для прокрутки
        this.slider = this.container.querySelector('.products-slider .product-container'); 
        this.cards = this.container.querySelectorAll('.product-card');
        this.paginationBulletsContainer = this.container.querySelector('.slider-pagination');
        
        if (this.cards.length === 0) {
            console.error("No testimonial cards found. Slider cannot be initialized.");
            return;
        }

        this.cardsPerPage = 3; // Кількість карток, видимих на одній "сторінці"
        this.cardWidth = 0; // Буде встановлено в updateCardWidth
        this.gapValue = 0; // Буде встановлено в updateCardWidth
        
        this.currentIndex = 0; // Поточний індекс "сторінки"
        this.maxPageIndex = 0; // Максимальний індекс "сторінки"
        
        this.isDragging = false;
        this.startPosX = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.sensitivity = 1.5; // Збільшено чутливість для легшої прокрутки
        
        this.init();
    }

    init() {
        this.updateCardWidth(); // Оновлюємо ширину картки та gap
        this.calculateMaxPageIndex(); // Розраховуємо максимальний індекс сторінки
        this.initPagination();
        this.setupEvents();
        this.addStyles();
        this.updateSlider(false); // Ініціалізуємо позицію слайдера без анімації

        window.addEventListener('resize', () => {
            this.updateCardWidth();
            this.calculateMaxPageIndex(); // Перерахуємо максимальний індекс сторінки при зміні розміру
            this.initPagination(); // Перегенеруємо булети, якщо кількість сторінок змінилася
            this.updateSlider(false);
        });
    }

    updateCardWidth() {
        if (this.cards.length > 0) {
            // Отримуємо gap з батьківського елемента .products-slider
            const parentSlider = this.container.querySelector('.products-slider');
            const parentSliderStyle = getComputedStyle(parentSlider);
            this.gapValue = parseFloat(parentSliderStyle.gap) || 0;

            // Ширина картки + відступ (для однієї картки)
            this.cardWidth = this.cards[0].offsetWidth + this.gapValue;
        }
    }

    calculateMaxPageIndex() {
        // Розраховуємо кількість сторінок
        // Якщо cards.length = 5, cardsPerPage = 3: Math.ceil(5 / 3) = 2.
        // Це означає 2 сторінки (індекси 0 та 1).
        this.maxPageIndex = Math.ceil(this.cards.length / this.cardsPerPage) - 1;
        this.maxPageIndex = Math.max(0, this.maxPageIndex);
        console.log(`Total cards: ${this.cards.length}, Cards per page: ${this.cardsPerPage}, Max page index: ${this.maxPageIndex}`);
    }

    addStyles() {
        this.slider.style.transition = 'transform 0.5s cubic-bezier(0.0, 0.0, 0.2, 1)';
        this.slider.style.cursor = 'grab';
        this.slider.style.willChange = 'transform';
    }

    initPagination() {
        this.paginationBulletsContainer.innerHTML = '';
        for (let i = 0; i <= this.maxPageIndex; i++) {
            const bullet = document.createElement('div');
            bullet.className = `pagination-bullet${i === this.currentIndex ? ' active' : ''}`;
            bullet.addEventListener('click', () => this.goToPage(i));
            this.paginationBulletsContainer.appendChild(bullet);
        }
        console.log(`Generated ${this.maxPageIndex + 1} bullets.`);
    }

    setupEvents() {
        this.slider.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.slider.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.slider.addEventListener('touchend', this.handleTouchEnd.bind(this));
        this.slider.addEventListener('touchcancel', this.handleTouchEnd.bind(this));

        this.slider.addEventListener('mousedown', this.handleMouseStart.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('mouseup', this.handleMouseEnd.bind(this));
    }

    handleTouchStart(e) {
        this.startPosX = e.touches[0].clientX;
        this.slider.style.transition = 'none';
        this.isDragging = true;
        this.prevTranslate = this.currentTranslate;
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;
        const currentX = e.touches[0].clientX;
        this.drag(currentX);
    }

    handleTouchEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.settlePosition();
    }

    handleMouseStart(e) {
        e.preventDefault();
        this.startPosX = e.clientX;
        this.slider.style.transition = 'none';
        this.isDragging = true;
        this.slider.style.cursor = 'grabbing';
        this.prevTranslate = this.currentTranslate;
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        const currentX = e.clientX;
        this.drag(currentX);
    }

    handleMouseEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.slider.style.cursor = 'grab';
        this.settlePosition();
    }

    drag(currentX) {
        const deltaX = (currentX - this.startPosX) * this.sensitivity;
        const newTranslate = this.prevTranslate + deltaX;

        // Максимальне зміщення вліво для останньої сторінки
        const minTranslate = -(this.maxPageIndex * this.cardWidth * this.cardsPerPage);
        
        if (this.cards.length <= this.cardsPerPage) {
            this.currentTranslate = 0;
        } else {
            this.currentTranslate = Math.max(minTranslate, Math.min(newTranslate, 0));
        }
        
        this.slider.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    settlePosition() {
        // Визначаємо, наскільки далеко ми прокрутили в картках
        const cardsScrolled = Math.round(Math.abs(this.currentTranslate) / this.cardWidth);
        
        // Визначаємо, на яку сторінку ми повинні перейти
        // Якщо ми прокрутили більше половини поточної сторінки, переходимо на наступну
        this.currentIndex = Math.min(Math.round(cardsScrolled / this.cardsPerPage), this.maxPageIndex);
        
        this.updateSlider(true);
    }

    updatePagination() {
        const bullets = this.paginationBulletsContainer.querySelectorAll('.pagination-bullet');
        bullets.forEach((bullet, i) => {
            if (i === this.currentIndex) {
                bullet.classList.add('active');
            } else {
                bullet.classList.remove('active');
            }
        });
    }

    goToPage(pageIndex) {
        this.currentIndex = Math.max(0, Math.min(pageIndex, this.maxPageIndex));
        this.updateSlider(true);
    }

    updateSlider(withAnimation = true) {
        this.currentTranslate = -(this.currentIndex * this.cardWidth * this.cardsPerPage);
        
        if (!withAnimation) {
            this.slider.style.transition = 'none';
        } else {
             this.slider.style.transition = 'transform 0.5s cubic-bezier(0.0, 0.0, 0.2, 1)';
        }
        
        this.slider.style.transform = `translateX(${this.currentTranslate}px)`;
        this.updatePagination();
        this.prevTranslate = this.currentTranslate;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Ініціалізуємо TestimonialSlider для секції s4
    const testimonialCarousel1 = document.getElementById('s4'); // Змінено ID на s4
    if (testimonialCarousel1) {
        new TestimonialSlider('s4');
    }

    // Якщо у вас є інші свайпери, ініціалізуйте їх за їхніми унікальними ID
    // const menuSlider = document.getElementById('s2'); // Приклад для секції меню, якщо вона також має слайдер
    // if (menuSlider) {
    //     // new SomeOtherSliderClass('s2'); // Використовуйте інший клас, якщо це інший тип слайдера
    // }
});
