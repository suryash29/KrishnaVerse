// ─────────────────────────────────────────────────────────
//  Firebase Configuration – KrishnaVerse Web App
//  Auth + Cloud Firestore (products, orders, profiles)
//
//  This file is a CLASSIC script (no ES modules) and uses the
//  Firebase *compat* (global `firebase.*`) SDK that is loaded via
//  plain <script> tags in index.html. Classic scripts work on any
//  static server (localhost included) because they do NOT depend on
//  the server sending the correct JavaScript MIME type, which is the
//  requirement that silently breaks <script type="module"> on many
//  simple local servers.
//
//  NOTE: These web API keys are SAFE to expose publicly. Firebase
//  web config is identifying, not secret — real protection comes
//  from Firestore Security Rules (see firestore.rules) and the
//  authorized-domains list in the Firebase console.
//  Docs: https://firebase.google.com/docs/projects/api-keys
// ─────────────────────────────────────────────────────────

(function () {
  'use strict';

  var firebaseConfig = {
    apiKey: "AIzaSyC-pEkR4nCTcCyaCTlVYI1qR0earDh9rx8",
    authDomain: "krishnaverse-5d551.firebaseapp.com",
    projectId: "krishnaverse-5d551",
    storageBucket: "krishnaverse-5d551.firebasestorage.app",
    messagingSenderId: "533625957554",
    appId: "1:533625957554:web:f7143b85268bd07a536dab",
    measurementId: "G-PR0KKZE3F8"
  };

  if (typeof firebase === 'undefined') {
    console.error('[KrishnaVerse] Firebase compat SDK failed to load. Check the <script> tags in index.html.');
    return;
  }

  firebase.initializeApp(firebaseConfig);

  // Shared handles for auth.js and shop-data.js (classic scripts).
  window.kvAuth = firebase.auth();
  window.kvDb = firebase.firestore();
})();
