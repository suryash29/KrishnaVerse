# KrishnaVerse — Complete Go-Live Guide

This is your end-to-end playbook to:

- **A.** Test the mobile app on your Android phone (today)
- **B.** Put the website live on **krishnaverse.online** (Firebase Hosting + GoDaddy DNS)
- **C.** Build a shareable Android **APK** and test it
- **D.** Publish the Android app to the **Google Play Store**
- **E.** (Later) iOS

Your stack is already wired for all of this: Firebase project **`krishnaverse-5d551`**,
Android package **`com.krishnaverse.app`**, app version **1.1.0**, EAS build profiles
ready, and hosting config in `firebase.json`.

> **First principle to keep in mind the whole way:** *every "live" thing is just your
> files placed on a server someone else can reach, plus a name (DNS) that points to it,
> plus a lock (SSL/signing) that proves it's really you.* Web and mobile differ only in
> **who** the server is (Firebase Hosting vs. an app store) and **how** you prove identity
> (an SSL certificate vs. an app signing key).

---

## PART 0 — One-time setup (do this once)

You'll run commands in a terminal. Install these first:

1. **Node.js 20 LTS** — https://nodejs.org . Verify: `node -v` → `v20.x`.
2. **Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```
3. **EAS CLI** (Expo's build service) — needed for the Android build:
   ```bash
   npm install -g eas-cli
   ```
4. **Accounts you'll need** (free unless noted):
   - Google account (for Firebase) — you already have this.
   - **Expo account** (free) — sign up at https://expo.dev (used by EAS Build).
   - **Google Play Developer account** — **$25 one-time** (Part D; you don't have this yet).

> Throughout, run commands **from the project root** (the folder containing
> `firebase.json`) unless a step says `cd mobile`.

---

## PART A — Test the mobile app on your Android phone (today)

The app is built with **Expo**, and we deliberately avoided native-only modules, so you
can test the *real* app instantly using **Expo Go** — no build required.

### A1. Install dependencies
```bash
cd mobile
npm install
```

### A2. Start the dev server
```bash
npx expo start
```
A QR code appears in your terminal/browser.

### A3. Open it on your phone
1. On your Android phone, install **"Expo Go"** from the Play Store.
2. Make sure your phone and computer are on the **same Wi-Fi**.
3. Open Expo Go → **Scan QR code** → scan the QR from step A2.
4. The app loads on your phone. Edits you save on your computer hot-reload instantly.

> If the QR won't connect (common on office/college Wi-Fi that blocks devices from
> seeing each other), run `npx expo start --tunnel` instead — it routes through Expo's
> servers and works on any network.

### A4. What to test
- **Japa Mala**: Home → 📿 *Japa Mala / Chant 108* → tap to count, watch the ring fill to
  108, feel the haptic buzz, try changing the mantra, *Undo*, and *Reset today*.
- **Account**: sign up / sign in, verify your data (bookmarks, journal, japa count) syncs.
- **Premium sheet**: Profile → *Upgrade to Premium*. You'll see the UPI button. ⚠️ Tapping
  it only *works* after you deploy the backend (Part B3) — until then it falls back to the
  manual UPI/WhatsApp option. That's expected.
- **Version**: Profile should show **KrishnaVerse v1.1.0** at the bottom.

✅ **Milestone:** the app runs on your phone and the Japa counter works.

---

## PART B — Put the website live on krishnaverse.online

Order matters: deploy the **backend (Functions + rules)** first, then **Hosting**, then
attach your **domain**.

### B1. Connect the CLI to your project
```bash
# from the project root
firebase use krishnaverse-5d551
```

### B2. Upgrade Firebase to the Blaze plan (required for Cloud Functions)
Cloud Functions that call Razorpay need the pay-as-you-go **Blaze** plan (it has a large
free tier; small apps usually pay ₹0). In the Firebase Console:
**⚙ (Project settings area) → Usage and billing → Details & settings → Modify plan → Blaze.**

### B3. Deploy the backend (Functions + Firestore rules)
```bash
cd functions
npm install
cd ..

# Set Razorpay secrets (see RAZORPAY_SETUP.md for where to get these).
# Use TEST keys for now; switch to live keys later.
firebase functions:secrets:set RAZORPAY_KEY_ID
firebase functions:secrets:set RAZORPAY_KEY_SECRET
firebase functions:secrets:set RAZORPAY_WEBHOOK_SECRET

firebase deploy --only functions,firestore:rules
```
> Full payment wiring (webhook URL, etc.) is in **RAZORPAY_SETUP.md**. You can deploy
> Hosting (next) even before payments are fully configured — the site will work, and only
> the Razorpay button needs the backend.

### B4. Deploy the website
```bash
firebase deploy --only hosting
```
When it finishes, the CLI prints two free URLs, e.g.:
```
https://krishnaverse-5d551.web.app
https://krishnaverse-5d551.firebaseapp.com
```
Open one — your site is **live** on the internet right now. (We'll put your custom domain
on top of it next.)

> Good news: your `firebase.json` already sets `service-worker.js` to **no-cache**, so the
> PWA caching problem you hit locally won't happen on the live site — updates propagate
> after a normal reload.

### B5. Add your GoDaddy domain in Firebase
1. Firebase Console → **Hosting** (or **Build → Hosting**) → **Add custom domain**.
2. Enter **`krishnaverse.online`** → Continue.
3. Firebase will ask you to **verify ownership** and then give you DNS records. You'll
   typically get either:
   - **A records** — two IP addresses for the apex domain, **and/or**
   - a **TXT record** — to verify ownership.
4. **Keep this Firebase screen open** — it shows the *exact* values to copy. (Firebase's
   IPs are usually `151.101.1.195` and `151.101.65.195`, but **always use the values
   Firebase shows you**, not these.)
5. Repeat "Add custom domain" for **`www.krishnaverse.online`** too (so both work). For
   `www`, Firebase usually gives a **CNAME** target like `krishnaverse-5d551.web.app`.

### B6. Add the records in GoDaddy
1. Sign in to **GoDaddy** → top-right profile → **My Products**.
2. Find **krishnaverse.online** → click **DNS** (or "Manage DNS").
3. You'll see a **DNS Records** table. Now add what Firebase gave you:

   **For the apex `krishnaverse.online` (A records):**
   - If there's an existing `A` record with **Name `@`** pointing to a GoDaddy parking IP,
     **edit/delete it.**
   - Add an **A** record: **Name** `@`, **Value** = *first Firebase IP*, TTL 1 hour.
   - Add another **A** record: **Name** `@`, **Value** = *second Firebase IP*.

   **For ownership (TXT), if Firebase asked for it:**
   - Add a **TXT** record: **Name** `@`, **Value** = the long string Firebase shows.

   **For `www` (CNAME):**
   - Add a **CNAME** record: **Name** `www`, **Value** = `krishnaverse-5d551.web.app`
     (or whatever target Firebase shows), TTL 1 hour.
   - If GoDaddy already has a default `www` CNAME pointing elsewhere, edit it to this value.

4. **Save** each record.

> **GoDaddy gotcha:** GoDaddy's "Domain Forwarding" feature can fight with these records.
> If you previously set up forwarding, turn it **off** (DNS → Forwarding → remove), or the
> apex domain may not resolve to Firebase.

### B7. Wait, then verify
- Back in Firebase, it will show **"Pending"** while it checks DNS and issues a free SSL
  certificate. DNS changes can take **15 minutes to a few hours** (occasionally up to 24h).
- When it flips to **"Connected"**, visit **https://krishnaverse.online** — you should see
  your site with a padlock (valid SSL). 🎉
- Test `https://www.krishnaverse.online` and `https://krishnaverse.online/privacy` too.

✅ **Milestone:** the website is live on your own domain with HTTPS.

### B8. Re-deploying the web later
Any time you change web files, just run:
```bash
firebase deploy --only hosting
```
Your domain updates automatically — no DNS changes needed again.

---

## PART C — Build a shareable Android APK (EAS Build)

An APK is a single installable file you can put on any Android phone (no Play Store).
EAS builds it in the cloud, so you **don't need Android Studio**.

### C1. Set your real config before building a release
A build "freezes in" whatever is in your files, so set production values first:
- `mobile/constants/Config.js` → set `premiumUpi`, `shopWhatsApp` (and keep `appVersion`).
- Confirm `mobile/firebaseConfig.js` points to `krishnaverse-5d551` (it does).
- Make sure you've deployed Functions (Part B3) so the app's payment link works.

### C2. Log in to Expo / EAS
```bash
cd mobile
eas login          # use your expo.dev account
```

### C3. Link the project to EAS (first time only)
```bash
eas build:configure
```
Accept the defaults. This connects the app to your Expo account and prepares Android
credentials (EAS will generate and securely store your **Android signing keystore** —
let it manage this; don't lose access to your Expo account).

### C4. Build the APK (the "preview" profile = APK)
```bash
eas build -p android --profile preview
```
- It uploads your project, builds in the cloud (~10–20 min), and gives you a **download
  link** to the `.apk`.
- Open that link on your Android phone (or transfer the file) and install it. You may need
  to allow "Install unknown apps" for your browser/file manager.

### C5. Test the installed app
This is the *real* production-style app (not Expo Go). Re-run your Part A4 checklist, and
confirm sign-in, sync, Japa, and the premium flow behave on a clean install.

✅ **Milestone:** you have a real APK installed and working on your phone, shareable with
friends/testers.

---

## PART D — Publish to the Google Play Store

### D1. Create a Google Play Developer account ($25, one-time)
1. Go to https://play.google.com/console and sign up with your Google account.
2. Choose an account type (for a personal launch, **"Personal"** is fine — note Google now
   asks individual developers to do **identity verification**).
3. Pay the **$25** one-time fee and complete identity/address verification.
> ⏳ Verification can take **a few hours to a couple of days**. Start this early. Newer
> personal accounts may also need to run a short **closed test with ~12 testers for 14
> days** before they can go fully public — Play will tell you if this applies.

### D2. Prepare your store assets (gather these now)
- **App name:** KrishnaVerse
- **Short description** (≤80 chars) and **full description** (≤4000 chars).
- **App icon:** 512×512 PNG.
- **Feature graphic:** 1024×500 PNG.
- **Screenshots:** at least 2 (phone). Take them from your installed app (Part C).
- **Privacy policy URL:** **https://krishnaverse.online/privacy** (already created for you;
  it goes live with Part B).
- **Content rating** questionnaire answers, **Data safety** form answers (you collect
  email + user content via Firebase; payments via Razorpay — declare these), and **target
  audience** (general / 13+).

### D3. Build the release bundle (AAB)
Google Play requires an **App Bundle (.aab)**, which the "production" profile makes:
```bash
cd mobile
eas build -p android --profile production
```
This auto-increments your version code and produces an `.aab` download link.

### D4. Create the app in Play Console and upload
1. Play Console → **Create app** → fill name, language, app/free, declarations.
2. Complete the left-side setup tasks: **Store listing** (assets from D2), **Privacy
   policy** URL, **Content rating**, **Data safety**, **Target audience**, **App access**
   (give Google test credentials if sign-in is required to see content).
3. Go to **Testing → Internal testing → Create release** → upload your `.aab` → add your
   own email as a tester → roll out. Install via the tester link to confirm it works from
   Play.

### D5. Submitting the build automatically (optional)
You can let EAS upload for you. It needs a Google **service account key**:
- In Google Cloud Console (same project), create a service account, grant it Play access in
  Play Console → **Users & permissions**, download the JSON, and save it as
  `mobile/play-service-account.json` (your `eas.json` already references this path; it is
  git-ignored — never commit it).
- Then: `eas submit -p android --profile production`.

### D6. Go to Production
When internal testing looks good: **Production → Create release** → promote your build →
fill the release notes → **send for review**. First reviews typically take **a few days**.
Once approved, your app is **live on the Play Store**. 🎉

### D7. Shipping updates later
1. Bump the version in `mobile/app.json` (and keep `appVersion` in `Config.js` in sync).
2. `eas build -p android --profile production`
3. Upload/submit the new `.aab` and roll out a new production release.

---

## PART E — iOS (when you're ready)

Same Expo/EAS flow, with Apple specifics:
- **Apple Developer Program:** **$99/year**.
- You do **not** need a Mac — EAS builds iOS in the cloud. (You only need a Mac for some
  advanced local debugging.)
- Build: `eas build -p ios --profile production`.
- Distribute test builds via **TestFlight**, then submit to the **App Store** (review
  usually 1–3 days). Apple is stricter about payments: in-app *digital* unlocks often must
  use Apple's In-App Purchase — review the rules before shipping the Razorpay flow on iOS.
- Your `app.json` already has `ios.bundleIdentifier` `com.krishnaverse.app` and
  `buildNumber` `2`.

---

## Quick command cheat-sheet

| Goal | Command (from where) |
|---|---|
| Test on phone now | `cd mobile && npm install && npx expo start` |
| Deploy backend | `firebase deploy --only functions,firestore:rules` |
| Deploy website | `firebase deploy --only hosting` |
| Build Android APK | `cd mobile && eas build -p android --profile preview` |
| Build Play bundle (AAB) | `cd mobile && eas build -p android --profile production` |
| Submit to Play | `cd mobile && eas submit -p android --profile production` |

## Recommended order for launch
1. **Part A** — confirm it works on your phone (today).
2. **Part B** — get **krishnaverse.online** live (web users can start immediately).
3. Start **Part D1** (Play account verification) in parallel — it's the slowest step.
4. **Part C** — build + test the APK.
5. **Part D** — finish the Play listing and submit.
6. **Part E** — iOS later.

## Things only you can do (need your accounts/keys)
- Firebase **Blaze** upgrade + `firebase login` on your machine.
- Razorpay keys/secrets + webhook (see **RAZORPAY_SETUP.md**) and KYC for real money.
- **GoDaddy DNS** record changes.
- **Google Play** $25 signup + identity verification + store listing.
- Setting real `premiumUpi` / `shopWhatsApp` in config before a release build.

Jai Shri Krishna 🪔
