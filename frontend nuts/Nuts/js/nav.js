document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burger');
    const navList = document.getElementById('navList');
    
    // Функція для перевірки елементів
    if (!burger || !navList) {
        console.error('Не знайдено елементи меню! Перевірте ID');
        return;
    }

    // Перемикання меню
    const toggleMenu = () => {
        burger.classList.toggle('active');
        navList.classList.toggle('active');
        document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
    };

    // Обробник кліку на бургер
    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Закриття меню при кліку на посилання
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
        });
    });

    // Закриття меню при кліку поза нього
    document.addEventListener('click', (e) => {
        if (navList.classList.contains('active') && 
            !e.target.closest('.nav-list') && 
            !e.target.closest('.burger')) {
            toggleMenu();
        }
    });

    // Закриття меню при зміні розміру вікна
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navList.classList.contains('active')) {
            toggleMenu();
        }
    });
});