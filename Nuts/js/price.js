document.addEventListener('DOMContentLoaded', function() {
    const basePrice = 2; // Базова ціна за 0.1 кг
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const minusBtn = card.querySelector('.minus');
        const plusBtn = card.querySelector('.plus');
        const weightValue = card.querySelector('.weight-value');
        const priceValue = card.querySelector('.price-value');
        
        let currentWeight = 0.1;
        
        function updatePrice() {
            const totalPrice = (basePrice * (currentWeight / 0.1)).toFixed(2);
            priceValue.textContent = totalPrice;
            weightValue.textContent = currentWeight.toFixed(1);
        }
        
        minusBtn.addEventListener('click', function() {
            if (currentWeight > 0.1) {
                currentWeight -= 0.1;
                updatePrice();
            }
        });
        
        plusBtn.addEventListener('click', function() {
            currentWeight += 0.1;
            updatePrice();
        });
        
        updatePrice();
    });
});
