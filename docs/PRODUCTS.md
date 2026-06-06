# 🛍️ Managing the KrishnaVerse Shop

This guide explains how products work and how you list / edit them — **no coding needed**.

---

## First principle: how the shop actually works

Think of the shop as **one shared notebook in the cloud** (Cloud Firestore, the `products` collection). Every product is one page in that notebook. Both the website and the mobile app *read* from the same notebook, so:

- You write a product **once** → it appears on the **website and the app**.
- You never touch code or redeploy to change the catalog.

There is also a built-in **offline copy** (`shop-data.js` → `SEED_PRODUCTS`) so the shop is never blank, even before you've added anything or if the user is offline.

```
            ┌─────────────────────────┐
            │   Firestore: products    │   ← the cloud notebook (source of truth)
            └───────────┬─────────────┘
              reads      │      reads
        ┌────────────────┴────────────────┐
        ▼                                  ▼
   Website (index.html)            Mobile app (shop.jsx)
        ▲
        │ writes (add/edit/delete)
   Admin console (admin.html)  ← only admin emails
```

---

## One-time setup (≈10 min)

You only do this once.

1. **Enable Firestore**
   - Go to <https://console.firebase.google.com> → project **krishnaverse-5d551**.
   - Build → **Firestore Database** → **Create database** → Start in **production mode** → choose region **asia-south1 (Mumbai)**.

2. **Publish the security rules** (so only you can edit products):
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules,firestore:indexes
   ```
   These come from `firestore.rules` and `firestore.indexes.json` in this repo.

3. **Set your admin email** — must match in **two** places:
   - `admin.js` → `ADMIN_EMAILS = ["1997sharmasurya@gmail.com"]`
   - `firestore.rules` → the email list inside `isAdmin()`
   Re-deploy the rules after any change.
   > ⚠️ The admin account must have a **verified email** (the rules require `email_verified`). Register that account in the app, then verify via the email Firebase sends.

---

## Listing a product (the everyday workflow)

1. Open **`https://krishnaverse.online/admin`** (or open `admin.html` while testing locally).
2. Sign in with your admin email + password.
3. Fill the **Add a product** form:

   | Field | Example | Notes |
   |---|---|---|
   | Product name * | `Brass Krishna Idol` | required |
   | Category * | `Idols` | idols / counter / puja / books / frames |
   | Price (₹) * | `1299` | **number only**, no ₹ symbol |
   | Sort order | `10` | lower = shown first |
   | Description | `Hand-cast brass Bal Gopal, 6 inch` | shown on the card |
   | Emoji | `🪈` | fallback shown when no image |
   | Tag | `New` | small badge (optional) |
   | Image URL | `https://…/idol.jpg` | optional; overrides emoji |
   | In stock | ✅ | uncheck to show "Sold out" |

4. Click **Save product**. Refresh the site/app — it's live. 🎉

**Edit / delete:** every product in the list has *Edit* and *Delete* buttons.

**Seed sample catalog:** the **"Seed sample catalog"** button instantly loads the starter products (2 idols, a digital jaap counter, a Tulsi mala, a Gita, a diya set, a frame) so you have something to see immediately.

---

## Product images (recommended)

Emojis are fine to launch, but real photos sell better. Two easy options:

- **Firebase Storage** (same project): Console → Storage → upload → copy the file's **download URL** → paste into *Image URL*.
- Any public image host / CDN works too. Use ~800×800px, square, < 200 KB.

---

## How customers order

Tapping a product opens **WhatsApp** with a pre-filled message (product + price). Zero payment-gateway setup, no fees — perfect to launch.

There is now **one config block per app** (single source of truth) for both the WhatsApp number and the donation UPI IDs:

- **Web:** edit `KV_CONFIG` at the top of `app.js` → set `shopWhatsApp: '919812345678'` (country code, no `+`) and the `upi` IDs.
- **Mobile:** edit `KV_CONFIG` in `mobile/constants/Config.js` → same `shopWhatsApp` and `upi` fields.

If `shopWhatsApp` is left blank, WhatsApp opens a contact picker (the customer chooses who to send to).

> Every order now also writes an `orders` document in Firestore (status `pending`) for signed-in users, and donations log a `donations` intent — so you have a record even before adding a payment gateway. When you're ready for in-app card/UPI payments, the next step is a Razorpay integration on top of the existing `orders` collection.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Admin says "not an authorized admin" | Email isn't in `ADMIN_EMAILS` **and** `firestore.rules`. Update both, redeploy rules. |
| "Save failed: permission-denied" | Rules not deployed, or admin email not verified. |
| Shop shows old/sample items only | Firestore empty or unreachable → it's using the offline fallback. Add real products via admin. |
| Prices show as `₹NaN` | Price must be a plain number (e.g. `1299`, not `₹1,299`). |
