// State
let state = {
    credits: 50000,
    cart: [],
    currentCategory: 'all'
};

// DOM Elements
const gridEl = document.getElementById('product-grid');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const creditsEl = document.getElementById('credits-display');
const navItems = document.querySelectorAll('.nav-item');
const checkoutBtn = document.getElementById('checkout-btn');

// Initialize
function init() {
    renderGrid(items);
    setupEventListeners();
}

// Render Grid
function renderGrid(products) {
    gridEl.innerHTML = '';

    const filtered = state.currentCategory === 'all'
        ? products
        : products.filter(p => p.type === state.currentCategory);

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        // Generate stats HTML dynamically
        const statsHtml = Object.entries(product.stats)
            .map(([key, val]) => `
                <div class="stat-row">
                    <span>${key.toUpperCase()}</span>
                    <span style="color: #fff">${val}</span>
                </div>
            `).join('');

        card.innerHTML = `
            <div class="card-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="card-info">
                <div class="card-title">${product.name}</div>
                <div class="card-type">${product.type}</div>
                <div class="card-stats">
                    ${statsHtml}
                </div>
                <div class="card-price">¥ ${product.price.toLocaleString()}</div>
                <button class="btn-buy" onclick="addToCart(${product.id})">
                    ADD TO LOADOUT
                </button>
            </div>
        `;
        gridEl.appendChild(card);
    });
}

// Add to Cart
window.addToCart = function (id) {
    const product = items.find(p => p.id === id);

    // Check funds
    if (state.credits < product.price) {
        alert('INSUFFICIENT FUNDS');
        return;
    }

    // Add to cart state
    state.cart.push(product);
    state.credits -= product.price;

    // Update UI
    updateUI();

    // Play sound effect (optional/placeholder)
    console.log('Item added:', product.name);
};

// Remove from Cart
window.removeFromCart = function (index) {
    const product = state.cart[index];
    state.credits += product.price;
    state.cart.splice(index, 1);
    updateUI();
};

// Update UI
function updateUI() {
    // Update Credits
    creditsEl.textContent = `¥ ${state.credits.toLocaleString()}`;

    // Update Cart List
    cartItemsEl.innerHTML = '';
    let total = 0;

    if (state.cart.length === 0) {
        cartItemsEl.innerHTML = '<div class="empty-msg">NO ITEMS EQUIPPED</div>';
    } else {
        state.cart.forEach((item, index) => {
            total += item.price;
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">¥ ${item.price.toLocaleString()}</span>
                </div>
                <button class="btn-remove" onclick="removeFromCart(${index})">×</button>
            `;
            cartItemsEl.appendChild(itemEl);
        });
    }

    // Update Total
    cartTotalEl.textContent = `¥ ${total.toLocaleString()}`;

    // Update Capacity
    document.querySelector('.capacity').textContent = `${state.cart.length} / 10`;
}

// Event Listeners
function setupEventListeners() {
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Remove active class
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class
            e.currentTarget.classList.add('active');

            // Update state
            state.currentCategory = e.currentTarget.dataset.category;
            renderGrid(items);
        });
    });

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (state.cart.length === 0) return;

        const btnText = checkoutBtn.querySelector('.btn-content');
        const originalText = btnText.textContent;

        btnText.textContent = 'PROCESSING...';
        checkoutBtn.style.background = '#00f3ff';
        checkoutBtn.style.color = '#000';

        setTimeout(() => {
            alert(`TRANSACTION COMPLETE. \nITEMS TRANSFERRED TO INVENTORY.`);
            state.cart = [];
            updateUI();
            btnText.textContent = originalText;
            checkoutBtn.style.background = '';
            checkoutBtn.style.color = '';
        }, 1500);
    });
}

// Start
init();
