// ─────────────────────────────────────────────────────────
//  Firebase Configuration – KrishnaVerse Web App
//  Steps:
//  1. Go to https://console.firebase.google.com
//  2. Create project "KrishnaVerse"
//  3. Enable Authentication → Email/Password
//  4. Add a Web App → copy your config here
//  5. Replace ALL placeholder values below
// ─────────────────────────────────────────────────────────

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
};
