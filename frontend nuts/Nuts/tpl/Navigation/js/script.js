// JS-код для інтеграції в HTML і управління діаграмою, вагою та ціною
const nuts = [
    { name: "Pistachios", weight: 0.4, color: "#d4af6a", img: "pistachio.png" },
    { name: "Hazelnut", weight: 0.2, color: "#e6d5c3", img: "hazelnut.png" },
    { name: "Brazil nut", weight: 0.2, color: "#d8a999", img: "brazilnut.png" },
    { name: "Peanut", weight: 0.2, color: "#a7c7e7", img: "peanut.png" },
    { name: "Walnut", weight: 0.0, color: "#c8a2c8", img: "walnut.png" }
];

const pricePer100g = 2; // 2$ за 100 г

document.addEventListener("DOMContentLoaded", function () {
    updateUI();
});

function updateChart() {
    const totalWeight = nuts.reduce((sum, nut) => sum + nut.weight, 0);
    let startAngle = 0;
    const canvas = document.getElementById("chart");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    nuts.forEach(nut => {
        if (totalWeight === 0) return;
        const percentage = (nut.weight / totalWeight);
        const endAngle = startAngle + percentage * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, 100, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = nut.color;
        ctx.fill();
        
        startAngle = endAngle;
    });
}

function updateTotalPrice() {
    const totalWeight = nuts.reduce((sum, nut) => sum + nut.weight, 0);
    document.getElementById("totalPrice").innerText = `$${(totalWeight * 10 * pricePer100g).toFixed(2)}`;
}

function updateUI() {
    const nutList = document.getElementById("nutList");
    nutList.innerHTML = "";
    nuts.forEach((nut, index) => {
        const item = document.createElement("div");
        item.className = "nut-item";
        item.innerHTML = `
            <img src="${nut.img}" alt="${nut.name}" class="nut-img">
            <span class="nut-name">${nut.name}</span>
            <button class="nut-btn" onclick="changeWeight(${index}, -0.1)">-</button>
            <span class="nut-weight">${nut.weight.toFixed(1)} kg</span>
            <button class="nut-btn" onclick="changeWeight(${index}, 0.1)">+</button>
        `;
        nutList.appendChild(item);
    });
    updateChart();
    updateTotalPrice();
}

function changeWeight(index, delta) {
    if (nuts[index].weight + delta >= 0) {
        nuts[index].weight += delta;
        updateUI();
    }
}
