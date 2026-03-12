# Maison — Headless Shopify Storefront

A fully functional headless storefront built with the Shopify Storefront API. No frameworks, no build step — pure HTML, CSS, and JavaScript.

## Features

- **Product Listing Page** — grid layout, filter by category, sort by price/name, load more pagination
- **Product Detail Page** — image gallery with thumbnails, variant selector, quantity picker, add to cart, buy now
- **Cart Drawer** — slide-in cart with quantity controls, remove items, subtotal, real Shopify checkout redirect
- **Related Products** — scored by shared tags, product type, and vendor
- **Demo Mode** — 9 built-in home décor products to preview without a real store
- **localStorage** — cart persists across page refreshes

## Project Structure

```
headless-shopify/
├── index.html              # Product listing page
├── netlify.toml            # Netlify config
├── .gitignore
├── css/
│   ├── style.css           # Global styles
│   └── product.css         # Product page styles
├── js/
│   ├── api.js              # Storefront API + demo data
│   ├── cart.js             # Cart state + drawer UI
│   ├── app.js              # Listing page controller
│   └── product.js          # Product detail controller
└── pages/
    └── product.html        # Product detail page
```

## Setup

### 1. Get Storefront API Token
1. Shopify Admin → Settings → Apps → Develop apps → Create an app
2. Configuration → Storefront API → enable `unauthenticated_read_product_listings`
3. Install app → copy Storefront API access token

### 2. Preview Locally
Open `index.html` with VS Code Live Server (Go Live button)

### 3. Deploy to Netlify
```bash
git init
git add .
git commit -m "Initial commit: Maison headless storefront"
git remote add origin https://github.com/YOUR_USERNAME/headless-shopify.git
git push -u origin main
```
Then: Netlify → Add new site → Import from GitHub → select repo → Deploy

### 4. Connect Your Store
Click ⚙ on the live site and enter your store domain + token.

## How Checkout Works
The Storefront API's `cartCreate` mutation returns a hosted Shopify checkout URL. Clicking "Proceed to Checkout" redirects customers to Shopify's secure checkout — you don't need to build a checkout yourself.

## Portfolio Description
> Built a headless e-commerce storefront using the Shopify Storefront API. Features product listing with filtering and sorting, a detailed product page with variant selection and image gallery, a cart drawer with localStorage persistence, and checkout via Shopify's hosted checkout. Deployed on Netlify as a static site with zero build dependencies.
