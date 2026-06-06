# 🕉️ KrishnaVerse — Daily Gita Wisdom

> Your personal spiritual companion. Daily Bhagavad Gita wisdom, an AI Krishna guide, mood tracking, a reflection journal, and a devotional shop.

KrishnaVerse ships in two forms from this one repository:

| Surface | Tech | Location | Live at |
|---|---|---|---|
| **Web app (PWA)** | Vanilla JS + HTML/CSS, Firebase | repo root | https://krishnaverse.online |
| **Mobile app** | React Native + Expo | [`/mobile`](./mobile) | Google Play (in progress) |

Both share one **Firebase** project (Auth + Cloud Firestore), so products you add show up everywhere.

---

## ✨ Features

- 📖 Daily shloka with Sanskrit, transliteration, translation & teaching
- 🪈 "Ask Krishna" AI guide
- 🧭 Browse all 18 chapters + search
- 📝 Reflection journal, bookmarks, mood tracking & streaks
- 🛍️ **Shop** — idols, jaap counters, malas, puja items, books & frames (live catalog from Firestore, order via WhatsApp)
- 🙏 Donations to dharmic causes via UPI
- 📲 Installable PWA, works offline

---

## 🗄️ Data model (Cloud Firestore)

```
products/{id}      → name, category, price (₹ number), desc, emoji, imageUrl, tag, inStock, sortOrder, createdAt, updatedAt
users/{uid}        → profile + per-user bookmarks / journal / progress (owner-only)
orders/{id}        → userId, items, total, status   (owner + admin)
donations/{id}     → cause, amount  (admin-readable)
```

Categories: `idols · counter · puja · books · frames`. Security is enforced by [`firestore.rules`](./firestore.rules) — the catalog is world-readable, but **only admin emails can write**.

---

## 🛒 Adding / managing products

No code required. Open the **admin console**:

```
https://krishnaverse.online/admin       (or admin.html locally)
```

Sign in with an admin email (configured in `admin.js → ADMIN_EMAILS` and `firestore.rules`), then add, edit, delete, or click **"Seed sample catalog"** to load the starter idols & counters.

Full walkthrough: **[docs/PRODUCTS.md](./docs/PRODUCTS.md)**

---

## 🚀 Run locally

```bash
# Web (any static server works)
npx serve .            # then open http://localhost:3000

# Mobile
cd mobile && npm install && npx expo start
```

---

## 📦 Deploy

- **Web → Firebase Hosting + custom domain:** [docs/DEPLOY_WEB.md](./docs/DEPLOY_WEB.md)
- **Mobile → Google Play Store:** [docs/PLAYSTORE.md](./docs/PLAYSTORE.md)

```bash
# One-time
npm install -g firebase-tools
firebase login

# Deploy site + Firestore rules
firebase deploy
```

---

## 🔑 Firebase config & secrets

The Firebase web API keys in `firebase-config.js` / `mobile/firebaseConfig.js` are **safe to be public** — they only identify the project. Real protection comes from Firestore Security Rules and the authorized-domains list. Never commit service-account JSON keys (already covered by `.gitignore`).

---

## 📁 Structure

```
KrishnaVerse/
├── index.html / styles.css / app.js   ← web PWA
├── auth.js                            ← Firebase auth (web)
├── firebase-config.js                 ← Firebase init (auth + firestore)
├── shop-data.js                       ← live product loader + offline fallback
├── admin.html / admin.js              ← product admin console
├── firestore.rules / firestore.indexes.json
├── firebase.json / .firebaserc        ← Firebase Hosting + Firestore
├── service-worker.js / manifest.json  ← PWA
├── data/shlokas.js                    ← Gita content
├── docs/                              ← deploy & ops guides
└── mobile/                            ← React Native + Expo app
```

🙏 *Hare Krishna.*
