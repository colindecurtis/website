// Dark Mode Toggle
const darkToggle = document.getElementById('darkModeToggle');
if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', document.body.classList.contains('dark'));
  });
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
  }
}

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('show');
  });
}

// CART FUNCTIONS
const CART_KEY = 'shoppingCart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productName) {
  const cart = getCart();
  const item = cart.find(p => p.name === productName);
  if (item) {
    item.quantity += 1;
  } else {
    cart.push({ name: productName, quantity: 1 });
  }
  saveCart(cart);
  alert(`${productName} has been added to your cart!`);
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) cartCountEl.textContent = `(${count})`;
}

function renderCart() {
  const cart = getCart();
  const cartList = document.getElementById('cart-list');
  const totalEl = document.getElementById('cart-total');

  if (!cartList || !totalEl) return;

  cartList.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `<strong>${item.name}</strong> x ${item.quantity}`;
    cartList.appendChild(el);
    // Fake price handling — you can connect to product data if needed
    total += item.quantity * 20;
  });

  totalEl.textContent = total.toFixed(2);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartCount();
  renderCart();
}

// Hook up on cart page
if (window.location.pathname.includes('cart.html')) {
  document.getElementById('clear-cart').addEventListener('click', clearCart);
  renderCart();
}

// Dynamic Product Injection (products.html)
if (window.location.pathname.includes('products.html')) {
  fetch('products.json')
    .then(res => res.json())
    .then(products => {
      const grid = document.querySelector('.products-grid');
      if (!grid) return;
      products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <p class="price">$${p.price.toFixed(2)}</p>
          <button onclick="addToCart('${p.name}')">Add to Cart</button>
        `;
        grid.appendChild(card);
      });
    });
}

// Always update cart count
updateCartCount();
