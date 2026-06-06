# 🌐 Deploy the website to krishnaverse.online

We're using **Firebase Hosting** — free SSL, global CDN, instant rollbacks, and it lives in the same Firebase project as your Auth + Firestore. This is the simplest reliable path for a static PWA like KrishnaVerse.

---

## First principle: what "going live" means

Three separate things have to be true:

1. **The files exist on a server** → Firebase Hosting stores `index.html`, `app.js`, etc.
2. **A domain points at that server** → DNS records connect `krishnaverse.online` → Firebase.
3. **The browser trusts it** → an SSL certificate (Firebase issues this automatically).

We'll do them in that order.

---

## Step 1 — Install tools & log in (one time)

```bash
npm install -g firebase-tools
firebase login          # opens a browser, sign in with your Google account
```

## Step 2 — Confirm the project

`.firebaserc` already points to `krishnaverse-5d551`. Verify:

```bash
firebase projects:list
firebase use krishnaverse-5d551
```

## Step 3 — Deploy

From the repo root:

```bash
# Deploy everything: site + Firestore rules + indexes
firebase deploy

# …or just the website
firebase deploy --only hosting
```

You'll get a live URL like `https://krishnaverse-5d551.web.app`. Open it — the site should work fully (auth, shop, admin at `/admin`).

> `firebase.json` already handles SPA routing, the `/admin` route, gzip, long-cache for images, no-cache for the service worker, and security headers.

---

## Step 4 — Connect your custom domain

1. Firebase Console → **Hosting** → **Add custom domain**.
2. Enter `krishnaverse.online` → Continue.
3. Firebase shows DNS records to add. Typically:

   | Type | Host/Name | Value |
   |---|---|---|
   | A | `@` | (IP Firebase gives you) |
   | A | `@` | (second IP, if shown) |
   | TXT | `@` | (verification string) |

   For the `www` version, add Firebase's host too (it'll guide you).

4. Add those records at **your domain registrar** (wherever you bought `krishnaverse.online` — GoDaddy / Namecheap / Hostinger / Google Domains, etc.) in its **DNS settings**.
5. Wait for propagation (15 min – a few hours). Firebase auto-issues the SSL cert and flips the domain to **Connected**.

✅ Done — `https://krishnaverse.online` is live and secure.

---

## Step 5 — Authorize the domain for login

Firebase Console → **Authentication** → **Settings** → **Authorized domains** → make sure both `krishnaverse.online` and `krishnaverse-5d551.web.app` are listed. (Otherwise sign-in throws `auth/unauthorized-domain`.)

---

## Updating the site later

Just re-run:
```bash
firebase deploy --only hosting
```
Each deploy is versioned — roll back anytime from **Hosting → Release history**.

---

## Alternative: cPanel / shared hosting (Hostinger etc.)

If you'd rather host on existing shared hosting, the repo also ships an Apache `.htaccess` (HTTPS redirect, www→non-www, SPA fallback, gzip, caching). To use it:

1. In your host's **File Manager**, open `public_html`.
2. Upload **all root files** (`index.html`, `app.js`, `styles.css`, `auth.js`, `firebase-config.js`, `shop-data.js`, `admin.html`, `admin.js`, `manifest.json`, `service-worker.js`, `.htaccess`, `data/`, images).
   **Do not** upload `mobile/`, `node_modules/`, or `firebase.json`.
3. Point the domain's DNS to the host (the host provides the records).
4. Enable free SSL (Let's Encrypt) in the hosting panel.

Firestore rules still deploy via the Firebase CLI regardless of where the HTML is hosted:
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

> Recommendation: **use Firebase Hosting**. Fewer moving parts, automatic SSL, and it pairs natively with the Firebase backend you already use.

---

## Post-launch checklist

- [ ] Site loads at `https://krishnaverse.online`
- [ ] Login + register work (domain authorized)
- [ ] Shop shows products from Firestore
- [ ] `/admin` loads and you can add a product
- [ ] PWA installs ("Add to Home Screen") and works offline
- [ ] Replace the placeholder `og-image.png` referenced in `index.html` for nice link previews
- [ ] Submit `sitemap.xml` in Google Search Console
