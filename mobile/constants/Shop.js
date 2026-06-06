// ─────────────────────────────────────────────────────────
//  KrishnaVerse Mobile – Shop data
//  Live products from Cloud Firestore with an offline fallback.
//  Keep SEED_PRODUCTS in sync with the web app's shop-data.js.
// ─────────────────────────────────────────────────────────
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Offline / fallback catalog (mirrors web shop-data.js)
export const SEED_PRODUCTS = [
  { id: 'i1', category: 'idols',   title: 'Brass Krishna Idol',     emoji: '🪈', price: 1299, tag: 'New',        desc: 'Hand-cast brass Bal Gopal idol with flute, 6 inch.', sortOrder: 1 },
  { id: 'i2', category: 'idols',   title: 'Radha Krishna Murti',    emoji: '🛕', price: 2499, tag: 'Premium',    desc: 'Panchaloha Radha-Krishna idol pair, 8 inch.',        sortOrder: 2 },
  { id: 'c1', category: 'counter', title: 'Digital Jaap Counter',   emoji: '🖲️', price: 149,  tag: 'Bestseller', desc: 'Electronic finger tally counter for mantra jaap.',    sortOrder: 3 },
  { id: 'c2', category: 'counter', title: 'Tulsi Mala 108',         emoji: '📿', price: 199,  tag: 'Sacred',     desc: 'Hand-knotted sacred Tulsi beads, 108 beads.',         sortOrder: 4 },
  { id: 'b1', category: 'books',   title: 'Bhagavad Gita As It Is', emoji: '📖', price: 249,  tag: 'Must Read',  desc: 'By Srila Prabhupada — Hindi & English.',              sortOrder: 5 },
  { id: 'p1', category: 'puja',    title: 'Brass Diya Set (5 pc)',  emoji: '🪔', price: 299,  tag: 'Popular',    desc: 'Traditional hand-crafted brass diyas.',               sortOrder: 6 },
  { id: 'f1', category: 'frames',  title: 'Shri Krishna Frame',     emoji: '🖼️', price: 499,  tag: '',           desc: 'Premium wooden frame, 12×16 inch.',                   sortOrder: 7 },
];

export const SHOP_TABS = ['All', 'Idols', 'Mala', 'Puja', 'Books', 'Frames'];
export const TAB_TO_CATEGORY = { Idols: 'idols', Mala: 'counter', Puja: 'puja', Books: 'books', Frames: 'frames' };

export function formatPrice(price) {
  if (price == null) return '';
  if (typeof price === 'number') return '₹' + price.toLocaleString('en-IN');
  return String(price);
}

// Loads products from Firestore; falls back to SEED_PRODUCTS on any error.
export async function fetchProducts() {
  try {
    const snap = await getDocs(query(collection(db, 'products'), orderBy('sortOrder', 'asc')));
    if (snap.empty) return SEED_PRODUCTS;
    const list = [];
    snap.forEach(d => {
      const data = d.data();
      list.push({
        id: d.id,
        category: data.category || 'puja',
        // web stores `name`; mobile UI uses `title` — support both
        title: data.title || data.name || 'Untitled',
        emoji: data.emoji || '🛍️',
        imageUrl: data.imageUrl || '',
        price: data.price,
        tag: data.tag || '',
        desc: data.desc || '',
        inStock: data.inStock !== false,
        sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 999,
      });
    });
    list.sort((a, b) => a.sortOrder - b.sortOrder);
    return list;
  } catch (e) {
    console.warn('[KrishnaVerse] shop offline, using fallback:', e?.message);
    return SEED_PRODUCTS;
  }
}
