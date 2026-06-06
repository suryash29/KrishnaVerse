// ─────────────────────────────────────────────────────────
//  KrishnaVerse – Cloud sync service (Firestore)
//  Personal data (users/{uid}) + orders + donations.
//  All calls are best-effort: failures degrade gracefully so
//  the app keeps working offline / when signed out.
// ─────────────────────────────────────────────────────────
import { db, functions } from '../firebaseConfig';
import {
  doc, getDoc, setDoc, addDoc, collection, serverTimestamp,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

// Razorpay (UPI) — ask the server to mint a UPI payment link for Premium.
// Returns { url, id } on success, or null. The server records the order and
// the webhook grants premium once the link is paid.
export async function createPremiumPaymentLink() {
  try {
    const fn = httpsCallable(functions, 'createRazorpayPaymentLink');
    const res = await fn({});
    return res && res.data ? res.data : null;
  } catch (e) {
    console.warn('Payment link failed:', e && e.message);
    return null;
  }
}

export async function loadUserData(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.warn('Cloud load failed:', e && e.message);
    return null;
  }
}

export async function saveUserData(uid, data) {
  try {
    await setDoc(
      doc(db, 'users', uid),
      { ...data, updatedAt: serverTimestamp() },
      { merge: true }
    );
    return true;
  } catch (e) {
    console.warn('Cloud save failed:', e && e.message);
    return false;
  }
}

export async function createOrder(order) {
  try {
    const ref = await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (e) {
    console.warn('Order create failed:', e && e.message);
    return null;
  }
}

export async function createDonation(donation) {
  try {
    const ref = await addDoc(collection(db, 'donations'), {
      ...donation,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (e) {
    console.warn('Donation record failed:', e && e.message);
    return null;
  }
}

// Merge cloud data into local state without losing local-only entries.
export function mergeCloudIntoState(local, cloud) {
  if (!cloud) return local;
  const out = { ...local };

  if (Array.isArray(cloud.bookmarks)) {
    out.bookmarks = Array.from(new Set([...(local.bookmarks || []), ...cloud.bookmarks]));
  }
  if (cloud.notes && typeof cloud.notes === 'object') {
    out.notes = { ...(local.notes || {}), ...cloud.notes };
  }
  if (Array.isArray(cloud.journal)) {
    const byId = {};
    [...(local.journal || []), ...cloud.journal].forEach(e => {
      if (e && e.id != null) byId[e.id] = e;
    });
    out.journal = Object.values(byId).sort((a, b) =>
      String(b.date || '').localeCompare(String(a.date || '')));
  }
  if (Array.isArray(cloud.moodHistory)) {
    const byDate = {};
    [...(local.moodHistory || []), ...cloud.moodHistory].forEach(m => {
      if (m && m.date) byDate[m.date] = m;
    });
    out.moodHistory = Object.values(byDate);
  }
  if (cloud.streak && typeof cloud.streak === 'object') {
    const l = local.streak || { current: 0, best: 0, lastDate: null };
    out.streak = {
      current: Math.max(l.current || 0, cloud.streak.current || 0),
      best: Math.max(l.best || 0, cloud.streak.best || 0),
      lastDate: (cloud.streak.lastDate && l.lastDate)
        ? (cloud.streak.lastDate > l.lastDate ? cloud.streak.lastDate : l.lastDate)
        : (cloud.streak.lastDate || l.lastDate),
    };
  }
  if (typeof cloud.darkMode === 'boolean') out.darkMode = cloud.darkMode;
  if (cloud.language) out.language = cloud.language;
  // Premium entitlement: once true anywhere, it stays true.
  if (cloud.isPremium === true) out.isPremium = true;
  // Japa: keep larger lifetime total; newer device wins today's tally.
  if (cloud.japa && typeof cloud.japa === 'object') {
    const lj = local.japa || {};
    const cj = cloud.japa;
    const cloudNewer = cj.lastDate && cj.lastDate >= (lj.lastDate || '');
    out.japa = {
      mantra: cj.mantra || lj.mantra || 'radhe',
      customText: cj.customText != null ? cj.customText : (lj.customText || ''),
      totalCount: Math.max(lj.totalCount || 0, cj.totalCount || 0),
      todayCount: cloudNewer ? (cj.todayCount || 0) : (lj.todayCount || 0),
      lastDate: cloudNewer ? cj.lastDate : (lj.lastDate || null),
      sound: typeof cj.sound === 'boolean' ? cj.sound : (lj.sound !== false),
      haptic: typeof cj.haptic === 'boolean' ? cj.haptic : (lj.haptic !== false),
    };
  }
  return out;
}
