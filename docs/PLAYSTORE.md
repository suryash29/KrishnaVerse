# 📲 Publish the KrishnaVerse app to the Google Play Store

The mobile app is **React Native + Expo**. We build it in the cloud with **EAS** (Expo Application Services) — you don't need Android Studio or a powerful PC.

---

## First principle: the 4 things Play needs

1. **An app binary** in `.aab` format (Android App Bundle) → EAS builds this.
2. **A signing key** (proves future updates are really from you) → EAS manages it for you.
3. **A developer account** (Google Play Console, **one-time US $25**) → you create this.
4. **A store listing** (icon, screenshots, description, privacy policy) → templates below.

---

## Step 0 — Accounts you'll need (start these now)

| Account | Cost | Where |
|---|---|---|
| Expo account | Free | <https://expo.dev/signup> |
| Google Play Developer | **$25 one-time** | <https://play.google.com/console/signup> |

> The Play Console identity verification can take 1–2 days, so register early.

---

## Step 1 — Install tooling

```bash
npm install -g eas-cli
cd mobile
npm install
eas login
```

## Step 2 — Link the project

```bash
eas init
```
This creates/links an EAS project and writes a `projectId` into `app.json`. `eas.json` (already in the repo) defines three profiles: `development`, `preview` (APK for testing), `production` (AAB for Play).

## Step 3 — Build a test APK first

```bash
eas build --platform android --profile preview
```
When it finishes, EAS gives a link to download the **APK**. Install it on your phone and test: login, daily shloka, shop (products load from Firestore), WhatsApp order, journal. Fix anything, repeat.

## Step 4 — Build the production AAB

```bash
eas build --platform android --profile production
```
EAS will offer to **generate a new Android Keystore** — say **yes** and let EAS store it. Download the resulting `.aab`.

---

## Step 5 — Create the app in Play Console

1. Play Console → **Create app** → name **KrishnaVerse**, language English, **App**, **Free**.
2. Complete **Set up your app** tasks:
   - **App access** → all features available without special access (or note the test login).
   - **Content rating** → fill the questionnaire (this app → *Everyone*).
   - **Target audience** → 13+ (it's devotional/lifestyle; avoid declaring "for children").
   - **Data safety** → declare: collects **email** (account), stored securely, not sold. (Firebase Auth.)
   - **Privacy policy** → a public URL is **required**. Host one at `https://krishnaverse.online/privacy` (a simple page is enough — see template below).
   - **Ads** → No (unless you add them).

## Step 6 — Store listing assets

| Asset | Spec |
|---|---|
| App icon | 512×512 PNG |
| Feature graphic | 1024×500 PNG |
| Phone screenshots | 2–8, min 1080px on the short side |
| Short description | ≤ 80 chars |
| Full description | ≤ 4000 chars |

**Short description (copy-paste):**
> Daily Bhagavad Gita wisdom, an AI Krishna guide, mood tracking & a devotional shop.

**Full description (starter):**
> KrishnaVerse is your daily spiritual companion rooted in the Bhagavad Gita. Receive a daily shloka with Sanskrit, transliteration, translation and a practical teaching. Ask Krishna for guidance, explore all 18 chapters, track your mood and streak, and reflect in a private journal. Visit the devotional shop for idols, jaap counters, malas, puja items, books and frames. 🙏 Hare Krishna.

## Step 7 — Release

1. **Testing → Internal testing** → create a release → upload the `.aab` → add your email as a tester → roll out. Install via the opt-in link and verify on a real device.
2. When happy: **Production → Create new release** → upload the `.aab` → fill release notes → **Send for review**.
3. Google review for a brand-new account is typically **a few days**. Then it's live on Play. 🎉

### Easier uploads later
Once a Play service account JSON is set up, you can submit straight from the CLI:
```bash
eas submit --platform android --profile production
```
(Place the key at `mobile/play-service-account.json` — it's git-ignored.)

---

## Privacy policy template (host at /privacy)

> **KrishnaVerse Privacy Policy.** We collect your email address solely to create and secure your account (via Google Firebase Authentication). We do not sell or share your personal data. Journal entries, bookmarks and preferences are stored to provide the app's features. Shop orders are completed via WhatsApp using details you choose to send. To delete your account or data, contact 1997sharmasurya@gmail.com. Last updated: <date>.

---

## Updating the app later

1. Bump `version` and `android.versionCode` in `mobile/app.json` (or let `production`'s `autoIncrement` handle versionCode).
2. `eas build --platform android --profile production`
3. Upload the new `.aab` to a Play release.

---

## iOS (optional, later)

Same flow with `--platform ios`, but it needs an **Apple Developer account ($99/year)**. The app is already iOS-ready (`bundleIdentifier: com.krishnaverse.app`).
