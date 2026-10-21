// Global Cart state loaded from localStorage
let cart = JSON.parse(localStorage.getItem('fruitCart')) || [];
const DELIVERY_FEE = 1.50;

// Update the Cart Badge in Navigation Bar on all pages
function updateCartBadge() {
    const cartBadges = document.querySelectorAll('.cart-count-badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartBadges.forEach(badge => {
        badge.textContent = `(${totalItems})`;
    });
}

// Add item to cart
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: parseFloat(price),
            quantity: 1
        });
    }

    saveAndRefresh();
}

// Change item quantity directly (+ / -)
function updateQuantity(index, change) {
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveAndRefresh();
}

// Clear all items from cart
function clearCart() {
    cart = [];
    saveAndRefresh();
}

// Save to browser storage & update UI elements
function saveAndRefresh() {
    localStorage.setItem('fruitCart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
}

// Render cart contents and calculations
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    if (!cartItemsContainer || !cartTotalElement) return;

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #888; padding: 20px 0;">Your cart is empty.</p>';
        cartTotalElement.textContent = '$0.00';
        return;
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <strong>${item.name}</strong>
                <span style="color: #777; font-size: 14px;">($${item.price.toFixed(2)})</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <button onclick="updateQuantity(${index}, -1)" class="cart-qty-btn">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${index}, 1)" class="cart-qty-btn">+</button>
                <strong style="min-width: 60px; text-align: right;">$${itemTotal.toFixed(2)}</strong>
            </div>
        `;
        cartItemsContainer.appendChild(row);
    });

    // Add Delivery Fee row
    const deliveryRow = document.createElement('div');
    deliveryRow.className = 'cart-item-row';
    deliveryRow.innerHTML = `
        <span>🚚 Delivery Fee</span>
        <strong>$${DELIVERY_FEE.toFixed(2)}</strong>
    `;
    cartItemsContainer.appendChild(deliveryRow);

    // Update Total
    const total = subtotal + DELIVERY_FEE;
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

// Event Listeners on Page Load
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    renderCart();

    // Attach click events to "Add to Cart" buttons
    const addButtons = document.querySelectorAll('.add-to-cart-btn');
    addButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name');
            const price = e.target.getAttribute('data-price');
            addToCart(name, price);
        });
    });

    // Clear Cart button event
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
});