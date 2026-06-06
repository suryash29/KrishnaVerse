// ─────────────────────────────────────────────────────────
//  KrishnaVerse – Shop Data Layer
//  Loads products live from Cloud Firestore, with a built-in
//  offline fallback catalog. Bridges to the classic app.js via
//  window globals + a 'kv:products-loaded' event.
// ─────────────────────────────────────────────────────────

import { db, collection, getDocs, query, orderBy } from "./firebase-config.js";

// ── Offline / seed catalog ──────────────────────────────
//  Used when Firestore is unreachable (offline PWA) AND as the
//  canonical seed dataset for the admin "Seed catalog" button.
//  Categories: idols · puja · books · counter · frames
export const SEED_PRODUCTS = [
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
  document.dispatchEvent(new CustomEvent('kv:products-loaded', { detail: { source, count: list.length } }));
}

// ── Load live products from Firestore ────────────────────
export async function loadProducts() {
  try {
    const q = query(collection(db, 'products'), orderBy('sortOrder', 'asc'));
    const snap = await getDocs(q);
    if (snap.empty) {
      // Firestore reachable but no catalog yet → use seed so the shop isn't blank
      publish(SEED_PRODUCTS.map(p => normalize(p)), 'seed-empty');
      return;
    }
    const list = [];
    snap.forEach(d => list.push(normalize(d.data(), d.id)));
    list.sort((a, b) => a.sortOrder - b.sortOrder);
    publish(list, 'firestore');
  } catch (err) {
    // Offline or rules block → graceful fallback
    console.warn('[KrishnaVerse] Using offline catalog:', err && err.message);
    publish(SEED_PRODUCTS.map(p => normalize(p)), 'offline');
  }
}

// Kick off load as soon as the module is parsed
loadProducts();
