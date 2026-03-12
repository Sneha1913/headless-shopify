/**
 * js/api.js — Shopify Storefront API + Demo Data
 */

const ShopifyAPI = (() => {

  // ─── Demo Products ────────────────────────────────────────────
  const DEMO = [
    {
      id: 'demo-1', handle: 'linen-cushion-cover', title: 'Belgian Linen Cushion Cover',
      vendor: 'Atelier Nord', productType: 'Cushions', tags: ['linen','cushion','living room','natural'],
      description: 'Hand-woven Belgian linen in a natural undyed finish. The slightly irregular weave gives each piece a unique character. Cover only — insert sold separately. Machine wash cold, gentle cycle.',
      priceRange: { minVariantPrice: { amount: '48.00', currencyCode: 'USD' } },
      compareAtPriceRange: { minVariantPrice: { amount: '65.00', currencyCode: 'USD' } },
      images: { edges: [
        { node: { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', altText: 'Linen Cushion' } },
        { node: { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', altText: 'Living Room' } }
      ]},
      variants: { edges: [
        { node: { id: 'v-1-1', title: 'Natural / 50x50cm', availableForSale: true, price: { amount: '48.00', currencyCode: 'USD' } } },
        { node: { id: 'v-1-2', title: 'Stone / 50x50cm', availableForSale: true, price: { amount: '48.00', currencyCode: 'USD' } } },
        { node: { id: 'v-1-3', title: 'Slate / 50x50cm', availableForSale: false, price: { amount: '48.00', currencyCode: 'USD' } } }
      ]}
    },
    {
      id: 'demo-2', handle: 'ceramic-vase-set', title: 'Hand-Thrown Ceramic Vase',
      vendor: 'Terra Studio', productType: 'Vases', tags: ['ceramic','vase','living room','handmade'],
      description: 'Each vase is individually thrown on a potter\'s wheel and finished with a reactive glaze that creates unique surface variations. No two pieces are exactly alike. Suitable for fresh or dried flowers.',
      priceRange: { minVariantPrice: { amount: '72.00', currencyCode: 'USD' } },
      compareAtPriceRange: { minVariantPrice: { amount: '72.00', currencyCode: 'USD' } },
      images: { edges: [
        { node: { url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80', altText: 'Ceramic Vase' } }
      ]},
      variants: { edges: [
        { node: { id: 'v-2-1', title: 'Chalk White / Medium', availableForSale: true, price: { amount: '72.00', currencyCode: 'USD' } } },
        { node: { id: 'v-2-2', title: 'Sand / Medium', availableForSale: true, price: { amount: '72.00', currencyCode: 'USD' } } },
        { node: { id: 'v-2-3', title: 'Moss / Large', availableForSale: true, price: { amount: '89.00', currencyCode: 'USD' } } }
      ]}
    },
    {
      id: 'demo-3', handle: 'walnut-tray', title: 'Walnut Serving Tray',
      vendor: 'Timber & Table', productType: 'Kitchen', tags: ['wood','walnut','kitchen','serving'],
      description: 'Solid American walnut with a live edge finish. Food-safe beeswax oil provides a natural protective coating that deepens in colour with use. Each piece showcases the unique grain of the wood.',
      priceRange: { minVariantPrice: { amount: '95.00', currencyCode: 'USD' } },
      compareAtPriceRange: { minVariantPrice: { amount: '95.00', currencyCode: 'USD' } },
      images: { edges: [
        { node: { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', altText: 'Walnut Tray' } }
      ]},
      variants: { edges: [
        { node: { id: 'v-3-1', title: 'Small — 30×20cm', availableForSale: true, price: { amount: '95.00', currencyCode: 'USD' } } },
        { node: { id: 'v-3-2', title: 'Large — 50×30cm', availableForSale: true, price: { amount: '135.00', currencyCode: 'USD' } } }
      ]}
    },
    {
      id: 'demo-4', handle: 'cotton-throw', title: 'Organic Cotton Throw',
      vendor: 'Weave & Weft', productType: 'Throws', tags: ['cotton','throw','bedroom','organic'],
      description: 'GOTS-certified organic cotton, woven in a traditional herringbone pattern. Generously sized at 130×180cm. Pre-washed for a soft, lived-in feel from the first use.',
      priceRange: { minVariantPrice: { amount: '115.00', currencyCode: 'USD' } },
      compareAtPriceRange: { minVariantPrice: { amount: '115.00', currencyCode: 'USD' } },
      images: { edges: [
        { node: { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80', altText: 'Cotton Throw' } }
      ]},
      variants: { edges: [
        { node: { id: 'v-4-1', title: 'Oat', availableForSale: true, price: { amount: '115.00', currencyCode: 'USD' } } },
        { node: { id: 'v-4-2', title: 'Warm Grey', availableForSale: true, price: { amount: '115.00', currencyCode: 'USD' } } },
        { node: { id: 'v-4-3', title: 'Rust', availableForSale: true, price: { amount: '115.00', currencyCode: 'USD' } } }
      ]}
    },
    {
      id: 'demo-5', handle: 'beeswax-candles', title: 'Beeswax Pillar Candles — Set of 3',
      vendor: 'Hive & Light', productType: 'Candles', tags: ['candle','beeswax','living room','natural'],
      description: 'Pure British beeswax in a warm honey tone. Naturally scented with the subtle fragrance of the hive. Burns cleanly for 30+ hours per candle. Heights: 8cm, 12cm, 16cm.',
      priceRange: { minVariantPrice: { amount: '38.00', currencyCode: 'USD' } },
      compareAtPriceRange: { minVariantPrice: { amount: '52.00', currencyCode: 'USD' } },
      images: { edges: [
        { node: { url: 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=800&q=80', altText: 'Beeswax Candles' } }
      ]},
      variants: { edges: [
        { node: { id: 'v-5-1', title: 'Natural Honey', availableForSale: true, price: { amount: '38.00', currencyCode: 'USD' } } }
      ]}
    },
    {
      id: 'demo-6', handle: 'rattan-basket', title: 'Handwoven Rattan Storage Basket',
      vendor: 'Woven & Willow', productType: 'Storage', tags: ['rattan','basket','storage','living room'],
      description: 'Hand-woven by artisans in Vietnam using sustainably harvested rattan. Natural undyed finish. Perfect for blankets, magazines, or plants. Each basket has minor variations in weave — a mark of handcraft.',
      priceRange: { minVariantPrice: { amount: '62.00', currencyCode: 'USD' } },
      compareAtPriceRange: { minVariantPrice: { amount: '62.00', currencyCode: 'USD' } },
      images: { edges: [
        { node: { url: 'https://images.unsplash.com/photo-1594666757003-3ee20de41e1a?w=800&q=80', altText: 'Rattan Basket' } }
      ]},
      variants: { edges: [
        { node: { id: 'v-6-1', title: 'Small — 25cm', availableForSale: true, price: { amount: '62.00', currencyCode: 'USD' } } },
        { node: { id: 'v-6-2', title: 'Large — 40cm', availableForSale: true, price: { amount: '88.00', currencyCode: 'USD' } } }
      ]}
    },
    {
      id: 'demo-7', handle: 'botanical-prints', title: 'Botanical Giclée Print Set',
      vendor: 'Paper Garden', productType: 'Art', tags: ['art','print','botanical','living room','bedroom'],
      description: 'Set of 4 archival-quality giclée prints reproduced from original watercolour paintings. Printed on 310gsm cotton rag paper. Supplied unframed with a 3cm white border. Size: 20×28cm each.',
      priceRange: { minVariantPrice: { amount: '145.00', currencyCode: 'USD' } },
      compareAtPriceRange: { minVariantPrice: { amount: '145.00', currencyCode: 'USD' } },
      images: { edges: [
        { node: { url: 'https://images.unsplash.com/photo-1580913428735-bd3c269d6a82?w=800&q=80', altText: 'Botanical Print' } }
      ]},
      variants: { edges: [
        { node: { id: 'v-7-1', title: 'Set of 4', availableForSale: true, price: { amount: '145.00', currencyCode: 'USD' } } }
      ]}
    },
    {
      id: 'demo-8', handle: 'marble-coasters', title: 'Marble Coaster Set',
      vendor: 'Stone & Surface', productType: 'Kitchen', tags: ['marble','coaster','kitchen','stone'],
      description: 'Solid marble coasters in a natural white with warm grey veining. Felt-backed to protect surfaces. Set of 4. Each piece is unique — the veining pattern varies naturally.',
      priceRange: { minVariantPrice: { amount: '55.00', currencyCode: 'USD' } },
      compareAtPriceRange: { minVariantPrice: { amount: '55.00', currencyCode: 'USD' } },
      images: { edges: [
        { node: { url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80', altText: 'Marble Coasters' } }
      ]},
      variants: { edges: [
        { node: { id: 'v-8-1', title: 'White Marble / Set of 4', availableForSale: true, price: { amount: '55.00', currencyCode: 'USD' } } },
        { node: { id: 'v-8-2', title: 'Black Marble / Set of 4', availableForSale: true, price: { amount: '55.00', currencyCode: 'USD' } } }
      ]}
    },
    {
      id: 'demo-9', handle: 'linen-bedding-set', title: 'Washed Linen Duvet Cover',
      vendor: 'Atelier Nord', productType: 'Bedding', tags: ['linen','bedding','bedroom','natural'],
      description: 'Pre-washed French linen for an instantly relaxed, lived-in texture. Gets softer with every wash. Button closure. Available in double and king sizes.',
      priceRange: { minVariantPrice: { amount: '195.00', currencyCode: 'USD' } },
      compareAtPriceRange: { minVariantPrice: { amount: '240.00', currencyCode: 'USD' } },
      images: { edges: [
        { node: { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80', altText: 'Linen Bedding' } }
      ]},
      variants: { edges: [
        { node: { id: 'v-9-1', title: 'Natural / Double', availableForSale: true, price: { amount: '195.00', currencyCode: 'USD' } } },
        { node: { id: 'v-9-2', title: 'Natural / King', availableForSale: true, price: { amount: '225.00', currencyCode: 'USD' } } },
        { node: { id: 'v-9-3', title: 'Dove / Double', availableForSale: true, price: { amount: '195.00', currencyCode: 'USD' } } }
      ]}
    }
  ];

  // ─── GraphQL Queries ───────────────────────────────────────────
  const PRODUCTS_QUERY = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id handle title vendor productType tags description
            priceRange { minVariantPrice { amount currencyCode } }
            compareAtPriceRange { minVariantPrice { amount currencyCode } }
            images(first: 5) {
              edges { node { url altText } }
            }
            variants(first: 10) {
              edges {
                node {
                  id title availableForSale
                  price { amount currencyCode }
                  compareAtPrice { amount currencyCode }
                  selectedOptions { name value }
                }
              }
            }
          }
        }
      }
    }
  `;

  const PRODUCT_BY_HANDLE_QUERY = `
    query GetProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id handle title vendor productType tags description
        priceRange { minVariantPrice { amount currencyCode } }
        compareAtPriceRange { minVariantPrice { amount currencyCode } }
        images(first: 8) {
          edges { node { url altText } }
        }
        variants(first: 20) {
          edges {
            node {
              id title availableForSale
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              selectedOptions { name value }
            }
          }
        }
      }
    }
  `;

  const CREATE_CART_MUTATION = `
    mutation CreateCart($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id quantity
                merchandise { ... on ProductVariant { id title product { title } } }
              }
            }
          }
        }
        userErrors { field message }
      }
    }
  `;

  // ─── Config ────────────────────────────────────────────────────
  let cfg = { domain: '', token: '', useDemo: false };

  function loadConfig() {
    try {
      const saved = JSON.parse(localStorage.getItem('maison_config') || '{}');
      cfg = { ...cfg, ...saved };
    } catch {}
    return cfg;
  }

  function saveConfig(domain, token) {
    cfg = { domain: domain.trim(), token: token.trim(), useDemo: false };
    localStorage.setItem('maison_config', JSON.stringify(cfg));
  }

  function setDemo() {
    cfg = { domain: '', token: '', useDemo: true };
    localStorage.setItem('maison_config', JSON.stringify(cfg));
  }

  function isReady() {
    return cfg.useDemo || (cfg.domain && cfg.token);
  }

  // ─── GraphQL Fetch ─────────────────────────────────────────────
  async function gql(query, variables = {}) {
    const res = await fetch(`https://${cfg.domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': cfg.token,
      },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.errors) throw new Error(json.errors[0].message);
    return json.data;
  }

  // ─── Public API ────────────────────────────────────────────────
  async function fetchProducts(limit = 50) {
    if (cfg.useDemo) return DEMO;
    const data = await gql(PRODUCTS_QUERY, { first: limit });
    return data.products.edges.map(e => e.node);
  }

  async function fetchProductByHandle(handle) {
    if (cfg.useDemo) return DEMO.find(p => p.handle === handle) || null;
    const data = await gql(PRODUCT_BY_HANDLE_QUERY, { handle });
    return data.productByHandle;
  }

  async function createCheckout(lines) {
    // lines: [{ variantId, quantity }]
    if (cfg.useDemo) {
      alert('Demo mode: In a real store, this would redirect to Shopify checkout!');
      return null;
    }
    const cartLines = lines.map(l => ({ merchandiseId: l.variantId, quantity: l.quantity }));
    const data = await gql(CREATE_CART_MUTATION, { lines: cartLines });
    if (data.cartCreate.userErrors.length) throw new Error(data.cartCreate.userErrors[0].message);
    return data.cartCreate.cart;
  }

  async function testConnection() {
    const data = await gql(`{ shop { name } }`);
    return data.shop.name;
  }

  // ─── Helpers ───────────────────────────────────────────────────
  function formatPrice(amount, currencyCode = 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amount);
  }

  function getPrice(product) {
    const { amount, currencyCode } = product.priceRange.minVariantPrice;
    return formatPrice(amount, currencyCode);
  }

  function getComparePrice(product) {
    const compare = parseFloat(product.compareAtPriceRange?.minVariantPrice?.amount || 0);
    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    if (compare > price) {
      return formatPrice(compare, product.priceRange.minVariantPrice.currencyCode);
    }
    return null;
  }

  function getImages(product) {
    return (product.images?.edges || []).map(e => e.node);
  }

  function getVariants(product) {
    return (product.variants?.edges || []).map(e => e.node);
  }

  function isOnSale(product) {
    const compare = parseFloat(product.compareAtPriceRange?.minVariantPrice?.amount || 0);
    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    return compare > price;
  }

  return {
    loadConfig, saveConfig, setDemo, isReady,
    fetchProducts, fetchProductByHandle, createCheckout, testConnection,
    getPrice, getComparePrice, getImages, getVariants, formatPrice, isOnSale,
    get config() { return cfg; },
  };
})();
