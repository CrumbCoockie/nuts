document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".comment-form");
    const commentContainer = document.querySelector(".comments-container");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Отримуємо значення з полів
        const username = document.getElementById("username").value.trim();
        const commentText = document.getElementById("comment").value.trim();
        let rating = document.getElementById("rating").value.trim();

        if (username && commentText && rating) {
            rating = Math.max(1, Math.min(5, rating)); // Обмежуємо рейтинг від 1 до 5
            const stars = "⭐ ".repeat(rating).trim();

            // Створюємо новий коментар
            const commentElement = document.createElement("div");
            commentElement.classList.add("comment");

            // Вставляємо аватар, ім'я, рейтинг і коментар
            commentElement.innerHTML = `
                <img src="img/avatar${Math.ceil(Math.random() * 3)}.png" alt="User Avatar" class="avatar">
                <div class="comment-content">
                    <p class="comment-name">${username}</p>
                    <div class="rating">${stars}</div>
                    <p class="comment-text">${commentText}</p>
                </div>
            `;

            // Додаємо коментар у контейнер
            commentContainer.appendChild(commentElement);

            // Очищаємо форму
            form.reset();
        }
    });
});
