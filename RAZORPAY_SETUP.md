# KrishnaVerse — Razorpay (UPI) Premium Setup

This guide wires up **Premium (₹199/year)** payments via **Razorpay, UPI only**, for
both the web PWA and the React Native (Expo) app. It is written so you can follow it
step-by-step with no prior backend experience.

> **First principle behind this design:** *the amount and the entitlement must be
> decided by something the user cannot edit.* The browser/phone can **ask** to pay,
> but only the server (a Firebase Cloud Function using the Admin SDK) ever sets
> `isPremium = true`, and only **after** Razorpay's cryptographic signature is
> verified. That is what makes the unlock trustworthy.

---

## 0. How the pieces fit together

```
                         ┌────────────────────────────────────────────┐
   WEB (browser)         │            Firebase Cloud Functions          │      Razorpay
 ─────────────────       │  (region: asia-south1, Admin SDK = trusted)  │   ───────────────
 createRazorpayOrder ───▶│  createRazorpayOrder  → Razorpay Orders API ─┼──▶  creates order
 Razorpay Checkout  ◀────┤  (returns orderId, amount, keyId)            │
   (UPI only)            │                                              │
 verifyRazorpayPayment ─▶│  verifyRazorpayPayment → HMAC check → GRANT  │
                         │                                              │
 MOBILE (Expo)           │  createRazorpayPaymentLink → UPI Pay Link ───┼──▶  hosted link
 opens link via Linking  │                                              │
                         │  razorpayWebhook (server-to-server backstop) ◀┼──  payment events
                         │     verifies signature → GRANT premium       │
                         └────────────────────────────────────────────┘
```

- **Web** uses Razorpay **Checkout** (instant unlock after `verifyRazorpayPayment`).
- **Mobile (Expo Go friendly)** uses a Razorpay **UPI Payment Link** opened in the
  user's UPI app. Premium is granted by the **webhook** once the link is paid.
- The **webhook** is the safety net for *both* platforms (e.g. if the app closes
  before the verify call returns).

---

## 1. Prerequisites (one-time)

1. **Node.js 20** on your Mac (`node -v` should print `v20.x`).
2. **Firebase CLI**: `npm install -g firebase-tools`, then `firebase login`.
3. **Razorpay account** → https://dashboard.razorpay.com (Test mode is fine to start).
4. **Firebase Blaze plan** (pay-as-you-go). Cloud Functions that call an external
   API (Razorpay) require Blaze. It has a generous free tier — small apps usually
   stay at ₹0. Upgrade at: Firebase Console → ⚙ → Usage and billing → Details &
   settings → Modify plan → Blaze.

---

## 2. Get your Razorpay keys

In the Razorpay Dashboard:

1. **Settings → API Keys → Generate Test Key.**
   You get a **Key ID** (`rzp_test_xxxxxxxx`) and a **Key Secret** (shown once — copy it).
2. Keep both safe. The **secret is never** placed in app code — only in Firebase
   secrets (next step).

> When you go live, repeat in **Live mode** to get `rzp_live_...` keys and re-set the
> secrets below with the live values.

---

## 3. Install function dependencies

```bash
cd KrishnaVerse/functions
npm install
```

This installs `firebase-admin`, `firebase-functions`, and `razorpay`.

---

## 4. Set the secrets (never commit these)

The functions read three secrets via `defineSecret`. Set each one — you'll be
prompted to paste the value:

```bash
cd KrishnaVerse              # run from the project root (where firebase.json is)

firebase functions:secrets:set RAZORPAY_KEY_ID
#   paste:  rzp_test_xxxxxxxxxxxxx

firebase functions:secrets:set RAZORPAY_KEY_SECRET
#   paste:  your-key-secret

firebase functions:secrets:set RAZORPAY_WEBHOOK_SECRET
#   paste:  a-long-random-string-you-invent  (see step 6)
```

> `RAZORPAY_WEBHOOK_SECRET` is **your own** secret — invent a long random string
> (e.g. from a password manager). You will paste the *same* string into the Razorpay
> webhook config in step 6.

You can list what's set with `firebase functions:secrets:get RAZORPAY_KEY_ID`.

---

## 5. Deploy the functions and rules

```bash
cd KrishnaVerse
firebase deploy --only functions,firestore:rules
```

After deploy, the CLI prints the URLs. Note the **`razorpayWebhook`** URL — it looks like:

```
https://asia-south1-krishnaverse-5d551.cloudfunctions.net/razorpayWebhook
```

> The region is **asia-south1**. It must match `firebaseConfig.js` (web:
> `firebase.functions('asia-south1')`, mobile: `getFunctions(app, 'asia-south1')`)
> and `setGlobalOptions({ region: 'asia-south1' })` in `functions/index.js`. Don't
> change one without the others.

---

## 6. Configure the webhook in Razorpay

In the Razorpay Dashboard:

1. **Settings → Webhooks → Add New Webhook.**
2. **Webhook URL:** paste the `razorpayWebhook` URL from step 5.
3. **Secret:** paste the **same** random string you used for
   `RAZORPAY_WEBHOOK_SECRET` in step 4.
4. **Active Events:** tick at least
   `payment.captured`, `order.paid`, and `payment_link.paid`.
5. Save.

Razorpay will now POST signed events to your function; the function verifies the
`x-razorpay-signature` against the raw body and grants premium.

---

## 7. App config values (UPI ID + WhatsApp fallback)

Even with Razorpay live, the app keeps a **manual UPI fallback** (handy in dev or if
a user prefers it). Set these so the fallback shows your real details:

**Web** — `KrishnaVerse/` config (the `KV_CONFIG` / `window.KV_CONFIG` object):

```js
window.KV_CONFIG = {
  premiumPrice: 199,
  premiumUpi:  'yourname@okhdfcbank',   // your real UPI ID
  shopWhatsApp: '9198XXXXXXXX',          // country code + number, no +
  // ...
};
```

**Mobile** — `KrishnaVerse/mobile/constants/Config.js`:

```js
export const KV_CONFIG = {
  premiumPrice: 199,
  premiumUpi:  'yourname@okhdfcbank',
  shopWhatsApp: '9198XXXXXXXX',
};
```

> If `premiumUpi` is left blank, the manual UPI button warns you to set it. The
> Razorpay buttons don't need it.

---

## 8. Web checkout dependency

`index.html` already loads:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script src="https://www.gstatic.com/firebasejs/.../firebase-functions-compat.js"></script>
```

Nothing else to do on web. The **“Pay ₹199 via UPI (Razorpay)”** button appears in
the premium modal when the user is signed in and Checkout has loaded.

---

## 9. Mobile notes (Expo)

- The mobile app intentionally uses the **UPI Payment Link** (opened via
  `Linking.openURL`) instead of the `react-native-razorpay` native module. The native
  module needs a **custom dev build** and will **not** work in **Expo Go**. The
  payment-link path keeps you on plain Expo.
- The **“Pay ₹199 via UPI”** primary button in `PremiumSheet` calls
  `createRazorpayPaymentLink` and opens the hosted UPI link. Premium is granted by the
  **webhook** when paid; the app reflects it on next cloud sync.
- The **“Pay manually via UPI”** / **WhatsApp** / **“I've already paid”** options
  remain as fallbacks.

---

## 10. Test it end-to-end (Test mode)

1. Sign in to the app.
2. **Web:** open Premium → click the Razorpay UPI button → in the Razorpay test
   sheet, choose UPI and use a **test VPA** like `success@razorpay`. You should be
   unlocked immediately (via `verifyRazorpayPayment`).
3. **Mobile:** open Premium → tap the UPI button → the hosted link opens → complete
   with a test method. Within a few seconds the webhook grants premium.
4. Confirm in **Firestore → `users/{uid}`** that `isPremium == true` and
   `premiumSince`/`premiumOrderId` are set, and that the matching **`orders`** doc is
   marked paid.

---

## 11. Going live

1. Switch Razorpay Dashboard to **Live mode**, generate live keys.
2. Re-run `firebase functions:secrets:set RAZORPAY_KEY_ID` /
   `RAZORPAY_KEY_SECRET` with the `rzp_live_...` values.
3. Add a **Live** webhook (step 6) with its own secret; update
   `RAZORPAY_WEBHOOK_SECRET` to match.
4. `firebase deploy --only functions`.
5. Complete Razorpay **KYC/activation** so you can accept real money.

---

## 12. Security checklist (why this is safe)

- ✅ Client **cannot** set `isPremium` — Firestore rules force it to stay unchanged;
  only the Admin SDK (Cloud Function) can flip it.
- ✅ Amount is fixed **server-side** (`PREMIUM_AMOUNT_PAISE`), not sent by the client.
- ✅ Payment trusted only after **HMAC-SHA256** signature verification
  (`crypto.timingSafeEqual`), for both the verify call and the webhook.
- ✅ Webhook uses the **raw request body** for the signature (don't JSON-parse first).
- ✅ Secrets live in **Firebase Secret Manager**, never in app code or git.

---

## File map (what was added/changed)

| File | Purpose |
|---|---|
| `functions/index.js` | `createRazorpayOrder`, `verifyRazorpayPayment`, `razorpayWebhook`, `createRazorpayPaymentLink` |
| `functions/package.json` | Function deps (firebase-admin, firebase-functions, razorpay) |
| `firestore.rules` | Premium is server-only; client can never self-grant |
| `firebase.json` | Registers the `functions` source |
| `firebase-config.js` (web) | Exposes `window.kvFunctions` (asia-south1) |
| `index.html` (web) | Loads Razorpay Checkout + functions-compat |
| `app.js` (web) | `payWithRazorpay()` UPI-only Checkout |
| `mobile/firebaseConfig.js` | Exports `functions` (asia-south1) |
| `mobile/services/cloud.js` | `createPremiumPaymentLink()` |
| `mobile/components/PremiumSheet.jsx` | `payRazorpay()` opens UPI payment link |

Jai Shri Krishna 🪔
