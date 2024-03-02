function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function setData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

const cartContents = getData('cart');
const checkoutElementDiv = document.getElementById('checkout-items');

function updateSubtotal() {
    const cartTotal = cartContents.reduce((a, item) => a + item.product.price * item.quantity, 0);
    document.getElementById('checkout-total-price').textContent = cartTotal;
}

updateSubtotal();

function updateQuantity(index, change) {
    const item = cartContents[index];
    item.quantity += change;
    if (item.quantity < 1) {
        item.quantity = 1;
    }
    document.getElementById(`item-quantity-value-${index}`).textContent = item.quantity;
    updateSubtotal();
    setData('cart', cartContents);
}

cartContents.forEach((item, index) => {
    const card = document.createElement("div");

    card.innerHTML = `
    <div>
        <img src=${item.product.image} />
        <a class="cardTitle">${item.product.title}</a>
        <span>$ ${item.product.price}</span>

        <div class="item-quantity">
            <button onClick="updateQuantity(${index}, -1)">-</button>
            <span class="quantity-value" id="item-quantity-value-${index}">${item.quantity}</span>
            <button onClick="updateQuantity(${index}, 1)">+</button>
        </div>
    </div>
    `;

    card.classList.add('card');

    checkoutElementDiv.appendChild(card);
});