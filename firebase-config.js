// ─────────────────────────────────────────────────────────
//  Firebase Configuration – KrishnaVerse Web App
//  Auth + Cloud Firestore (products, orders, profiles)
//
//  NOTE: These web API keys are SAFE to expose publicly. Firebase
//  web config is identifying, not secret — real protection comes
//  from Firestore Security Rules (see firestore.rules) and the
//  authorized-domains list in the Firebase console.
//  Docs: https://firebase.google.com/docs/projects/api-keys
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
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

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
const db = getFirestore(app);

export {
  // app
  app,
  // auth
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  // firestore
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
};
