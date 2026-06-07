// ─────────────────────────────────────────────────────────
//  Firebase Configuration – KrishnaVerse
//  Steps to set up:
//  1. Go to https://console.firebase.google.com
//  2. Create a project named "KrishnaVerse"
//  3. Enable Authentication → Email/Password
//  4. Add a Web App → copy the config below
//  5. Replace ALL placeholder values with your actual keys
// ─────────────────────────────────────────────────────────

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-pEkR4nCTcCyaCTlVYI1qR0earDh9rx8",
  authDomain: "krishnaverse-5d551.firebaseapp.com",
  projectId: "krishnaverse-5d551",
  storageBucket: "krishnaverse-5d551.firebasestorage.app",
  messagingSenderId: "533625957554",
  appId: "1:533625957554:web:f7143b85268bd07a536dab",
  measurementId: "G-PR0KKZE3F8"
};
// Prevent duplicate initialization (hot reload safe)
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Use AsyncStorage persistence on native, default on web
let auth;
try {
  if (Platform.OS !== 'web') {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } else {
    auth = getAuth(app);
  }
} catch {
  auth = getAuth(app);
}

export { auth };
export default app;
