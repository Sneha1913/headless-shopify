/**
 * js/cart.js — Cart state, localStorage persistence, drawer UI
 */

const Cart = (() => {
  const CART_KEY = 'maison_cart';
  let items = [];
  let isOpen = false;

  // ─── Persistence ───────────────────────────────────────────────
  function load() {
    try { items = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch { items = []; }
    updateUI();
  }

  function save() {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  // ─── Cart Operations ───────────────────────────────────────────
  function addItem(product, variant, quantity = 1) {
    const existing = items.find(i => i.variantId === variant.id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, 99);
    } else {
      items.push({
        id: Date.now().toString(),
        productId: product.id,
        productTitle: product.title,
        variantId: variant.id,
        variantTitle: variant.title !== 'Default Title' ? variant.title : '',
        price: parseFloat(variant.price.amount),
        currency: variant.price.currencyCode,
        image: ShopifyAPI.getImages(product)[0]?.url || '',
        quantity,
      });
    }
    save();
    updateUI();
    showDrawer();
    showToast(`Added to cart — ${product.title}`);
  }

  function updateQuantity(itemId, quantity) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    if (quantity < 1) {
      removeItem(itemId);
      return;
    }
    item.quantity = Math.min(quantity, 99);
    save();
    updateUI();
  }

  function removeItem(itemId) {
    items = items.filter(i => i.id !== itemId);
    save();
    updateUI();
  }

  function getTotal() {
    return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  function getCount() {
    return items.reduce((sum, i) => sum + i.quantity, 0);
  }

  function getCheckoutLines() {
    return items.map(i => ({ variantId: i.variantId, quantity: i.quantity }));
  }

  // ─── UI Updates ────────────────────────────────────────────────
  function updateUI() {
    renderCount();
    renderItems();
    renderFooter();
  }

  function renderCount() {
    const count = getCount();
    const countEl = document.getElementById('cartCount');
    if (!countEl) return;
    if (count > 0) {
      countEl.textContent = count > 9 ? '9+' : count;
      countEl.style.display = 'flex';
    } else {
      countEl.style.display = 'none';
    }
  }

  function renderItems() {
    const container = document.getElementById('cartItems');
    const emptyEl = document.getElementById('cartEmpty');
    if (!container) return;

    if (!items.length) {
      if (emptyEl) emptyEl.style.display = 'block';
      // Remove all item elements
      container.querySelectorAll('.cart-item').forEach(el => el.remove());
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    // Remove old items
    container.querySelectorAll('.cart-item').forEach(el => el.remove());

    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.dataset.id = item.id;
      el.innerHTML = `
        ${item.image
          ? `<img class="cart-item-img" src="${item.image}" alt="${item.productTitle}"/>`
          : `<div class="cart-item-img" style="background:var(--surface)"></div>`}
        <div>
          <div class="cart-item-title">${item.productTitle}</div>
          ${item.variantTitle ? `<div class="cart-item-variant">${item.variantTitle}</div>` : ''}
          <div class="cart-item-qty">
            <button class="item-qty-btn" data-action="minus">−</button>
            <span class="item-qty-num">${item.quantity}</span>
            <button class="item-qty-btn" data-action="plus">+</button>
          </div>
          <button class="cart-item-remove">Remove</button>
        </div>
        <div class="cart-item-price">${ShopifyAPI.formatPrice(item.price * item.quantity, item.currency)}</div>
      `;

      el.querySelector('[data-action="minus"]').addEventListener('click', () => updateQuantity(item.id, item.quantity - 1));
      el.querySelector('[data-action="plus"]').addEventListener('click', () => updateQuantity(item.id, item.quantity + 1));
      el.querySelector('.cart-item-remove').addEventListener('click', () => removeItem(item.id));

      container.appendChild(el);
    });
  }

  function renderFooter() {
    const footer = document.getElementById('cartFooter');
    const subtotalEl = document.getElementById('cartSubtotal');
    if (!footer) return;

    if (items.length) {
      footer.style.display = 'block';
      if (subtotalEl) subtotalEl.textContent = ShopifyAPI.formatPrice(getTotal(), items[0]?.currency || 'USD');
    } else {
      footer.style.display = 'none';
    }
  }

  // ─── Drawer ────────────────────────────────────────────────────
  function showDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    isOpen = true;
  }

  function hideDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    isOpen = false;
  }

  function toggleDrawer() {
    isOpen ? hideDrawer() : showDrawer();
  }

  // ─── Checkout ──────────────────────────────────────────────────
  async function checkout() {
    if (!items.length) return;
    try {
      const cart = await ShopifyAPI.createCheckout(getCheckoutLines());
      if (cart?.checkoutUrl) {
        window.location.href = cart.checkoutUrl;
      }
    } catch (err) {
      showToast('Checkout error: ' + err.message);
    }
  }

  // ─── Toast ─────────────────────────────────────────────────────
  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // ─── Bind Events ───────────────────────────────────────────────
  function bindEvents() {
    const cartBtn = document.getElementById('cartBtn');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (cartBtn) cartBtn.addEventListener('click', toggleDrawer);
    if (cartClose) cartClose.addEventListener('click', hideDrawer);
    if (cartOverlay) cartOverlay.addEventListener('click', hideDrawer);
    if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) hideDrawer();
    });
  }

  return {
    load, addItem, updateQuantity, removeItem,
    showDrawer, hideDrawer, toggleDrawer,
    showToast, bindEvents,
    get items() { return items; },
    get count() { return getCount(); },
  };
})();