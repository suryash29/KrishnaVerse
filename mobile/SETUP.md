# KrishnaVerse Mobile App – Setup Guide

## Tech Stack
- **React Native** + **Expo** (Android + iOS + Web)
- **Expo Router** v3 – file-based navigation
- **Firebase Auth** – email/password login
- **AsyncStorage** – local data persistence
- **Expo Linear Gradient** – UI gradients

---

## Step 1: Install Node.js & Expo CLI

```bash
# Install Node.js from https://nodejs.org (v18+)

# Install Expo CLI globally
npm install -g expo-cli eas-cli
```

---

## Step 2: Firebase Setup

1. Go to [firebase.google.com](https://console.firebase.google.com)
2. Click **Add Project** → Name it "KrishnaVerse"
3. Go to **Authentication** → **Sign-in method** → Enable **Email/Password**
4. Go to **Project Settings** → **Your apps** → Click **Add app** → choose **Web** (</>)
5. Copy the config object
6. Open `mobile/firebaseConfig.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "YOUR_REAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};
```

---

## Step 3: Install Dependencies

```bash
cd projectOne/mobile
npm install
```

---

## Step 4: Run the App

```bash
# Start Expo dev server
npx expo start

# Then press:
#   a  → run on Android emulator / device
#   i  → run on iOS simulator (Mac only)
#   w  → run in browser
```

### Run on Android Device (physical phone):
1. Install **Expo Go** app from Play Store
2. Scan the QR code shown in terminal

---

## Step 5: Build for Production

```bash
# Login to EAS (Expo Application Services)
eas login

# Build Android APK
eas build --platform android --profile preview

# Build Android AAB (for Play Store)
eas build --platform android

# Build iOS (requires Apple Developer account)
eas build --platform ios
```

---

## Project Structure

```
mobile/
├── app/
│   ├── _layout.jsx          ← Auth gate (redirects login/app)
│   ├── (auth)/
│   │   ├── login.jsx        ← Login screen
│   │   └── register.jsx     ← Register screen
│   └── (tabs)/
│       ├── index.jsx        ← Home (daily shloka, mood, streak)
│       ├── guide.jsx        ← AI Krishna chat
│       ├── explore.jsx      ← Browse all 18 chapters + search
│       ├── reflect.jsx      ← Journal, bookmarks, progress
│       └── shop.jsx         ← Donations + spiritual products
├── context/
│   ├── AuthContext.jsx      ← Firebase auth state
│   └── AppContext.jsx       ← App state + AsyncStorage
├── constants/
│   ├── Colors.js            ← Spiritual color palette
│   └── Shlokas.js           ← All shloka data + AI responses
├── firebaseConfig.js        ← Firebase setup (fill in your keys)
└── app.json                 ← Expo config
```

---

## Web App Auth Setup (firebase-config.js)

The web app uses the same Firebase project. Update `projectOne/firebase-config.js` with your Firebase credentials (same config as above).

The web version uses ES modules, so make sure your server supports it (works on any modern browser + local file server like Live Server).
