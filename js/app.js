/**
 * js/app.js — Index page controller
 * Handles: product listing, filtering, sorting, config modal, hero images
 */

const App = (() => {
  let allProducts = [];
  let filtered = [];
  let displayed = 0;
  const PAGE_SIZE = 9;

  const $ = id => document.getElementById(id);

  // ─── Init ──────────────────────────────────────────────────────
  async function init() {
    ShopifyAPI.loadConfig();
    Cart.load();
    Cart.bindEvents();
    bindEvents();

    if (ShopifyAPI.isReady()) {
      await loadProducts();
    } else {
      openConfig();
    }
  }

  async function loadProducts() {
    try {
      allProducts = await ShopifyAPI.fetchProducts(50);
      filtered = [...allProducts];
      displayed = 0;
      renderPage();
      renderHeroImages();
    } catch (err) {
      $('productsGrid').innerHTML = `
        <div class="empty-state">
          <h3>Could not load products</h3>
          <p>${err.message}</p>
        </div>`;
    }
  }

  // ─── Render ────────────────────────────────────────────────────
  function renderPage() {
    const next = filtered.slice(displayed, displayed + PAGE_SIZE);
    if (displayed === 0) $('productsGrid').innerHTML = '';

    next.forEach(product => {
      $('productsGrid').appendChild(createCard(product));
    });

    displayed += next.length;

    const loadMoreWrap = $('loadMoreWrap');
    if (displayed < filtered.length) {
      loadMoreWrap.style.display = 'block';
    } else {
      loadMoreWrap.style.display = 'none';
    }

    if (!filtered.length) {
      $('productsGrid').innerHTML = `
        <div class="empty-state">
          <h3>No products found</h3>
          <p>Try a different filter or add products to your Shopify store.</p>
        </div>`;
    }
  }

  function createCard(product) {
    const img = ShopifyAPI.getImages(product)[0];
    const price = ShopifyAPI.getPrice(product);
    const comparePrice = ShopifyAPI.getComparePrice(product);
    const onSale = ShopifyAPI.isOnSale(product);

    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-card-img">
        ${onSale ? '<span class="card-badge">Sale</span>' : ''}
        ${img
          ? `<img src="${img.url}" alt="${img.altText || product.title}" loading="lazy"/>`
          : `<div class="no-img-placeholder">◈</div>`}
      </div>
      <div class="product-card-body">
        ${product.vendor ? `<div class="card-vendor">${product.vendor}</div>` : ''}
        <div class="card-title">${product.title}</div>
        <div class="card-price-row">
          <div>
            <span class="card-price">${price}</span>
            ${comparePrice ? `<span class="card-compare"> ${comparePrice}</span>` : ''}
          </div>
          <button class="card-quick-add" data-id="${product.id}">+ Add</button>
        </div>
      </div>
    `;

    // Navigate to product detail
    card.addEventListener('click', e => {
      if (e.target.classList.contains('card-quick-add')) return;
      window.location.href = `pages/product.html?handle=${product.handle}`;
    });

    // Quick add to cart
    card.querySelector('.card-quick-add').addEventListener('click', e => {
      e.stopPropagation();
      const variants = ShopifyAPI.getVariants(product);
      const available = variants.find(v => v.availableForSale) || variants[0];
      if (available) Cart.addItem(product, available, 1);
    });

    return card;
  }

  function renderHeroImages() {
    // Show first 2 products as hero images
    if (allProducts.length < 1) return;

    const img1 = ShopifyAPI.getImages(allProducts[0])[0];
    const img2 = ShopifyAPI.getImages(allProducts[1] || allProducts[0])[0];

    if (img1) {
      $('heroImg1').innerHTML = `<img src="${img1.url}" alt="${img1.altText || ''}"/>`;
    }
    if (img2) {
      $('heroImg2').innerHTML = `<img src="${img2.url}" alt="${img2.altText || ''}"/>`;
    }
  }

  // ─── Filter & Sort ─────────────────────────────────────────────
  function filterByType(type) {
    if (!type) {
      filtered = [...allProducts];
    } else {
      filtered = allProducts.filter(p =>
        (p.productType || '').toLowerCase().includes(type.toLowerCase()) ||
        (p.tags || []).some(t => t.toLowerCase().includes(type.toLowerCase()))
      );
    }
    applySort();
    displayed = 0;
    renderPage();
  }

  function applySort() {
    const val = $('sortSelect')?.value;
    if (val === 'price-asc') {
      filtered.sort((a, b) =>
        parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount)
      );
    } else if (val === 'price-desc') {
      filtered.sort((a, b) =>
        parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount)
      );
    } else if (val === 'name-asc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
  }

  // ─── Config ────────────────────────────────────────────────────
  function openConfig() {
    const overlay = $('configOverlay');
    if (overlay) overlay.classList.add('open');
    const cfg = ShopifyAPI.config;
    if (cfg.domain) $('storeDomain').value = cfg.domain;
    if (cfg.token) $('storefrontToken').value = cfg.token;
  }

  function closeConfig() {
    const overlay = $('configOverlay');
    if (overlay) overlay.classList.remove('open');
  }

  async function connectStore() {
    const domain = $('storeDomain').value.trim();
    const token = $('storefrontToken').value.trim();
    const status = $('configStatus');

    if (!domain || !token) {
      status.textContent = 'Please fill in both fields.';
      status.className = 'config-status error';
      return;
    }

    status.textContent = 'Connecting...';
    status.className = 'config-status';

    ShopifyAPI.saveConfig(domain, token);

    try {
      const shopName = await ShopifyAPI.testConnection();
      status.textContent = `✓ Connected to "${shopName}"`;
      status.className = 'config-status success';
      setTimeout(() => {
        closeConfig();
        loadProducts();
      }, 1200);
    } catch (err) {
      status.textContent = `✗ ${err.message}`;
      status.className = 'config-status error';
    }
  }

  // ─── Bind Events ───────────────────────────────────────────────
  function bindEvents() {
    // Config
    $('connectBtn')?.addEventListener('click', connectStore);
    $('useDemoBtn')?.addEventListener('click', () => {
      ShopifyAPI.setDemo();
      closeConfig();
      loadProducts();
    });

    // Sort
    $('sortSelect')?.addEventListener('change', () => {
      applySort();
      displayed = 0;
      renderPage();
    });

    // Load more
    $('loadMoreBtn')?.addEventListener('click', renderPage);

    // Filter nav
    document.querySelectorAll('.nav-link[data-filter]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        filterByType(link.dataset.filter);
      });
    });
    document.querySelector('.nav-link:not([data-filter])')?.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      e.target.classList.add('active');
      filterByType(null);
    });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
