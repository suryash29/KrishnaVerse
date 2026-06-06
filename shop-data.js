// ─────────────────────────────────────────────────────────
//  KrishnaVerse – Shop Data Layer  (classic script / compat SDK)
//  Loads products live from Cloud Firestore, with a built-in
//  offline fallback catalog. Bridges to app.js via window globals
//  + a 'kv:products-loaded' event.
//
//  Uses window.kvDb (firebase.firestore()) from firebase-config.js.
// ─────────────────────────────────────────────────────────

(function () {
  'use strict';

  var db = window.kvDb;

  // ── Offline / seed catalog ──────────────────────────────
  //  Used when Firestore is unreachable (offline PWA) AND as the
  //  canonical seed dataset for the admin "Seed catalog" button.
  //  Categories: idols · puja · books · counter · frames
  var SEED_PRODUCTS = [
    // ── Idols (NEW category) ──
    { id: 'i1', category: 'idols',   name: 'Brass Krishna Idol',     desc: 'Hand-cast brass Bal Gopal idol with flute, 6 inch — perfect for home mandir', price: 1299, emoji: '🪈', tag: 'New', inStock: true, featured: true,  sortOrder: 1 },
    { id: 'i2', category: 'idols',   name: 'Radha Krishna Murti',    desc: 'Panchaloha (5-metal) Radha-Krishna idol pair, 8 inch, antique gold finish',     price: 2499, emoji: '🛕', tag: 'Premium', inStock: true, featured: true, sortOrder: 2 },
    // ── Counters / Jaap ──
    { id: 'c1', category: 'counter', name: 'Digital Jaap Counter',   desc: 'Electronic finger tally counter for effortless mantra jaap — 0 to 99,999 count',  price: 149,  emoji: '🖲️', tag: 'Bestseller', inStock: true, featured: true, sortOrder: 3 },
    { id: 'c2', category: 'counter', name: 'Tulsi Mala 108',         desc: 'Hand-knotted sacred Tulsi beads — 108 beads for daily jaap & meditation',         price: 199,  emoji: '📿', tag: 'Sacred', inStock: true, featured: false, sortOrder: 4 },
    // ── A few existing favourites kept for a full-looking shop ──
    { id: 'b1', category: 'books',   name: 'Bhagavad Gita As It Is', desc: 'By Srila Prabhupada — Hindi & English editions available',                          price: 249,  emoji: '📖', tag: 'Must Read', inStock: true, featured: true, sortOrder: 5 },
    { id: 'p1', category: 'puja',    name: 'Brass Diya Set (5 pc)',  desc: 'Traditional hand-crafted brass diyas for daily aarti & puja',                       price: 299,  emoji: '🪔', tag: 'Popular', inStock: true, featured: false, sortOrder: 6 },
    { id: 'f1', category: 'frames',  name: 'Shri Krishna Frame',     desc: 'Premium wooden frame — Vrindavan Krishna 12×16 inch',                               price: 499,  emoji: '🖼️', tag: '', inStock: true, featured: false, sortOrder: 7 },
  ];

  // Expose seed catalog (used by admin "Seed sample catalog").
  window.KV_SEED_PRODUCTS = SEED_PRODUCTS;

  // ── Helpers exposed globally for app.js ──────────────────
  window.KV_PRODUCTS = null; // populated after load (live or fallback)

  window.kvFmtPrice = function (price) {
    if (price == null || price === '') return '';
    if (typeof price === 'number') return '₹' + price.toLocaleString('en-IN');
    // already a formatted string like "₹299"
    return String(price);
  };

  window.kvActiveProducts = function () {
    return (window.KV_PRODUCTS && window.KV_PRODUCTS.length) ? window.KV_PRODUCTS : SEED_PRODUCTS;
  };

  function normalize(p, id) {
    return {
      id: id || p.id,
      category: p.category || 'puja',
      name: p.name || 'Untitled',
      desc: p.desc || '',
      price: p.price,
      emoji: p.emoji || '🛍️',
      imageUrl: p.imageUrl || '',
      tag: p.tag || '',
      inStock: p.inStock !== false,
      sortOrder: typeof p.sortOrder === 'number' ? p.sortOrder : 999,
    };
  }

  function publish(list, source) {
    window.KV_PRODUCTS = list;
    window.KV_PRODUCTS_SOURCE = source;
    // Re-render the shop if app.js is already loaded
    if (typeof window.renderProducts === 'function') {
      window.renderProducts(window.currentShopTab || 'all');
    }
    document.dispatchEvent(new CustomEvent('kv:products-loaded', { detail: { source: source, count: list.length } }));
  }

  // ── Load live products from Firestore ────────────────────
  async function loadProducts() {
    if (!db) {
      console.warn('[KrishnaVerse] Firestore not initialized — using offline catalog.');
      publish(SEED_PRODUCTS.map(function (p) { return normalize(p); }), 'offline');
      return;
    }
    try {
      var snap = await db.collection('products').orderBy('sortOrder', 'asc').get();
      if (snap.empty) {
        // Firestore reachable but no catalog yet → use seed so the shop isn't blank
        publish(SEED_PRODUCTS.map(function (p) { return normalize(p); }), 'seed-empty');
        return;
      }
      var list = [];
      snap.forEach(function (d) { list.push(normalize(d.data(), d.id)); });
      list.sort(function (a, b) { return a.sortOrder - b.sortOrder; });
      publish(list, 'firestore');
    } catch (err) {
      // Offline or rules block → graceful fallback
      console.warn('[KrishnaVerse] Using offline catalog:', err && err.message);
      publish(SEED_PRODUCTS.map(function (p) { return normalize(p); }), 'offline');
    }
  }

  window.kvLoadProducts = loadProducts;

  // Kick off load as soon as the script is parsed
  loadProducts();
})();
