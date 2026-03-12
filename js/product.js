/**
 * js/product.js — Product detail page controller
 * Handles: product loading, variants, gallery, quantity, add to cart, related products
 */

const ProductPage = (() => {
  let product = null;
  let selectedVariant = null;
  let allProducts = [];

  const $ = id => document.getElementById(id);

  // ─── Init ──────────────────────────────────────────────────────
  async function init() {
    ShopifyAPI.loadConfig();
    Cart.load();
    Cart.bindEvents();

    const params = new URLSearchParams(window.location.search);
    const handle = params.get('handle');

    if (!handle) {
      window.location.href = '../index.html';
      return;
    }

    if (!ShopifyAPI.isReady()) {
      // Redirect to home to configure
      window.location.href = '../index.html';
      return;
    }

    try {
      // Load product + all products for related
      const [prod, all] = await Promise.all([
        ShopifyAPI.fetchProductByHandle(handle),
        ShopifyAPI.fetchProducts(50),
      ]);

      if (!prod) {
        document.title = 'Not Found — Maison';
        $('productSkeleton').innerHTML = '<div style="padding:4rem;text-align:center;color:var(--text-muted)">Product not found.</div>';
        return;
      }

      product = prod;
      allProducts = all;

      document.title = `${product.title} — Maison`;
      renderProduct();
      renderRelated();
    } catch (err) {
      $('productSkeleton').innerHTML = `<div style="padding:4rem;text-align:center;color:var(--text-muted)">Error: ${err.message}</div>`;
    }
  }

  // ─── Render Product ────────────────────────────────────────────
  function renderProduct() {
    const variants = ShopifyAPI.getVariants(product);
    const images = ShopifyAPI.getImages(product);

    // Select first available variant
    selectedVariant = variants.find(v => v.availableForSale) || variants[0];

    // Hide skeleton, show layout
    $('productSkeleton').style.display = 'none';
    $('productLayout').style.display = 'grid';

    // Gallery
    renderGallery(images);

    // Vendor
    $('productVendor').textContent = product.vendor || '';
    $('productVendor').style.display = product.vendor ? 'block' : 'none';

    // Title
    $('productTitle').textContent = product.title;

    // Price
    updatePriceDisplay();

    // Variants
    renderVariants(variants);

    // Description
    if (product.description) {
      $('productDescription').innerHTML = `<p>${product.description}</p>`;
    } else {
      $('productDescription').style.display = 'none';
    }

    // Tags
    const tags = (product.tags || []).slice(0, 8);
    if (tags.length) {
      $('detailTags').innerHTML = `<div class="detail-tags">${tags.map(t => `<span class="detail-tag">${t}</span>`).join('')}</div>`;
    }

    // Layout visible
    $('productLayout').style.display = 'grid';

    bindProductEvents();
  }

  function renderGallery(images) {
    if (!images.length) {
      $('mainImage').style.display = 'none';
      return;
    }

    // Main image
    $('mainImage').src = images[0].url;
    $('mainImage').alt = images[0].altText || product.title;

    // Thumbnails (only if more than 1 image)
    if (images.length > 1) {
      const thumbsContainer = $('galleryThumbs');
      thumbsContainer.innerHTML = images.map((img, i) => `
        <img
          class="thumb ${i === 0 ? 'active' : ''}"
          src="${img.url}"
          alt="${img.altText || product.title}"
          data-index="${i}"
          loading="lazy"
        />
      `).join('');

      thumbsContainer.querySelectorAll('.thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
          const idx = parseInt(thumb.dataset.index);
          $('mainImage').src = images[idx].url;
          thumbsContainer.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });
      });
    }
  }

  function renderVariants(variants) {
    const section = $('variantsSection');

    // Only show if more than 1 variant or variant isn't "Default Title"
    const hasRealVariants = variants.length > 1 || (variants[0] && variants[0].title !== 'Default Title');

    if (!hasRealVariants) {
      section.style.display = 'none';
      return;
    }

    section.style.display = 'block';

    // Determine option name from first variant
    const optionName = variants[0]?.selectedOptions?.[0]?.name || 'Option';
    $('variantLabel').textContent = optionName;

    const container = $('variantOptions');
    container.innerHTML = variants.map(v => `
      <button
        class="variant-btn ${v.id === selectedVariant?.id ? 'selected' : ''} ${!v.availableForSale ? 'unavailable' : ''}"
        data-variant-id="${v.id}"
        ${!v.availableForSale ? 'disabled' : ''}
      >
        ${v.title}
      </button>
    `).join('');

    container.querySelectorAll('.variant-btn:not(:disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedVariant = ShopifyAPI.getVariants(product).find(v => v.id === btn.dataset.variantId);
        container.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        updatePriceDisplay();
      });
    });
  }

  function updatePriceDisplay() {
    if (!selectedVariant) return;

    const price = ShopifyAPI.formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode);
    $('productPrice').textContent = price;

    const compareEl = $('comparePrice');
    const compare = parseFloat(selectedVariant.compareAtPrice?.amount || 0);
    const current = parseFloat(selectedVariant.price.amount);

    if (compare > current) {
      compareEl.textContent = ShopifyAPI.formatPrice(compare, selectedVariant.price.currencyCode);
      compareEl.style.display = 'inline';
    } else {
      compareEl.style.display = 'none';
    }
  }

  // ─── Related Products ──────────────────────────────────────────
  function renderRelated() {
    if (!product || !allProducts.length) return;

    const sourceTags = new Set(product.tags || []);
    const sourceType = product.productType;

    const related = allProducts
      .filter(p => p.id !== product.id)
      .map(p => {
        let score = 0;
        const pTags = new Set(p.tags || []);
        score += [...sourceTags].filter(t => pTags.has(t)).length * 3;
        if (p.productType === sourceType) score += 2;
        if (p.vendor === product.vendor) score += 1;
        return { p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(s => s.p);

    if (!related.length) return;

    $('relatedSection').style.display = 'block';
    const grid = $('relatedGrid');

    related.forEach(p => {
      const img = ShopifyAPI.getImages(p)[0];
      const price = ShopifyAPI.getPrice(p);
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-card-img">
          ${img ? `<img src="${img.url}" alt="${img.altText || p.title}" loading="lazy"/>` : `<div class="no-img-placeholder">◈</div>`}
        </div>
        <div class="product-card-body">
          ${p.vendor ? `<div class="card-vendor">${p.vendor}</div>` : ''}
          <div class="card-title">${p.title}</div>
          <div class="card-price-row">
            <span class="card-price">${price}</span>
          </div>
        </div>
      `;
      card.addEventListener('click', () => {
        window.location.href = `product.html?handle=${p.handle}`;
      });
      grid.appendChild(card);
    });
  }

  // ─── Events ────────────────────────────────────────────────────
  function bindProductEvents() {
    // Quantity
    const qtyInput = $('qtyInput');
    $('qtyMinus')?.addEventListener('click', () => {
      const val = parseInt(qtyInput.value);
      if (val > 1) qtyInput.value = val - 1;
    });
    $('qtyPlus')?.addEventListener('click', () => {
      const val = parseInt(qtyInput.value);
      if (val < 99) qtyInput.value = val + 1;
    });

    // Add to Cart
    $('addToCartBtn')?.addEventListener('click', () => {
      if (!selectedVariant) return;
      const qty = parseInt($('qtyInput').value) || 1;
      Cart.addItem(product, selectedVariant, qty);
    });

    // Buy Now
    $('buyNowBtn')?.addEventListener('click', async () => {
      if (!selectedVariant) return;
      const qty = parseInt($('qtyInput').value) || 1;
      Cart.addItem(product, selectedVariant, qty);
      // Immediately trigger checkout
      const btn = $('buyNowBtn');
      btn.textContent = 'Redirecting...';
      btn.disabled = true;
      try {
        const cart = await ShopifyAPI.createCheckout([{ variantId: selectedVariant.id, quantity: qty }]);
        if (cart?.checkoutUrl) window.location.href = cart.checkoutUrl;
      } catch {
        btn.textContent = 'Buy Now';
        btn.disabled = false;
      }
    });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', ProductPage.init);
