// ─────────────────────────────────────────────────────────
//  KrishnaVerse – Web Auth Module  (classic script / compat SDK)
//  Handles Login, Register, and Auth State for the web app.
//
//  Uses the Firebase *compat* global API exposed by firebase-config.js:
//    window.kvAuth  → firebase.auth()
//    window.kvDb    → firebase.firestore()
//  This avoids ES-module MIME requirements so login works on any
//  static server (localhost included) and on Firebase Hosting.
// ─────────────────────────────────────────────────────────

(function () {
  'use strict';

  var auth = window.kvAuth;
  var db = window.kvDb;

  if (!auth || !db) {
    console.error('[KrishnaVerse] Auth not initialized — firebase-config.js must load before auth.js.');
    return;
  }

  var serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

  // ── Cloud data sync (Firestore users/{uid}) ─────────────
  // Exposed for app.js to read and persist a signed-in user's
  // personal data across devices.
  window.__kvCloud = {
    load: async function (uid) {
      try {
        var snap = await db.collection('users').doc(uid).get();
        return snap.exists ? snap.data() : null;
      } catch (e) {
        console.warn('Cloud load failed:', e && e.message);
        return null;
      }
    },
    save: async function (uid, data) {
      try {
        await db.collection('users').doc(uid).set(
          Object.assign({}, data, { updatedAt: serverTimestamp() }),
          { merge: true }
        );
        return true;
      } catch (e) {
        console.warn('Cloud save failed:', e && e.message);
        return false;
      }
    },
    // Create an order document (used by the storefront checkout).
    createOrder: async function (order) {
      try {
        var ref = await db.collection('orders').add(
          Object.assign({}, order, { createdAt: serverTimestamp() }));
        return ref.id;
      } catch (e) {
        console.warn('Order create failed:', e && e.message);
        return null;
      }
    },
    // Record a donation intent (used by the donate flow).
    createDonation: async function (donation) {
      try {
        var ref = await db.collection('donations').add(
          Object.assign({}, donation, { createdAt: serverTimestamp() }));
        return ref.id;
      } catch (e) {
        console.warn('Donation record failed:', e && e.message);
        return null;
      }
    },
  };

  // ── Profile actions (exposed to app.js / inline handlers) ───
  window.__kvUpdateName = async function (name) {
    if (!auth.currentUser) return false;
    await auth.currentUser.updateProfile({ displayName: name });
    return true;
  };
  window.__kvSendVerify = async function () {
    if (!auth.currentUser) return false;
    await auth.currentUser.sendEmailVerification();
    return true;
  };
  window.__kvChangePassword = async function (currentPassword, newPassword) {
    var user = auth.currentUser;
    if (!user || !user.email) throw new Error('Not signed in.');
    var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    await user.reauthenticateWithCredential(cred);
    await user.updatePassword(newPassword);
    return true;
  };

  // ── Auth State Observer ─────────────────────────────────
  // auth.js is the single source of truth for which top-level layer is
  // visible (splash / authOverlay / #app). app.js exposes __kvShowApp()
  // and __kvShowAuth() and never reveals the app on its own timer, which
  // eliminates the previous race where the app flashed for signed-out
  // users and the splash could get stuck for signed-in users.
  auth.onAuthStateChanged(function (user) {
    window.__kvAuthResolved = true;
    if (user) {
      onUserLoggedIn(user);
    } else {
      onUserLoggedOut();
    }
  }, function (error) {
    // Network/init error — fail safe to the login screen.
    window.__kvAuthResolved = true;
    console.warn('Auth error:', error && error.message);
    onUserLoggedOut();
  });

  function onUserLoggedIn(user) {
    // Reveal the app (handles overlay/splash/app visibility + rendering).
    if (typeof window.__kvShowApp === 'function') {
      window.__kvShowApp();
    } else {
      document.getElementById('authOverlay').classList.add('hidden');
      var splashEl = document.getElementById('splash');
      if (splashEl) { splashEl.classList.remove('hidden'); splashEl.style.opacity = '1'; }
    }

    // Expose the current user + load their cloud-synced data.
    window.__kvUser = user;
    if (typeof window.__kvOnLogin === 'function') window.__kvOnLogin(user);

    // Show a gentle reminder if the email is not yet verified.
    if (user && user.emailVerified === false) showVerifyNotice(user);

    // Update header user menu
    var initial = (user.displayName || user.email || 'U')[0].toUpperCase();
    var headerMenu = document.getElementById('headerUserMenu');
    headerMenu.innerHTML =
      '<div class="header-user-menu">' +
      '  <button class="user-avatar-btn" onclick="window._toggleUserDropdown()" title="' + (user.displayName || user.email) + '">' +
      '    <span class="user-initial">' + initial + '</span>' +
      '  </button>' +
      '  <div class="user-dropdown hidden" id="userDropdown">' +
      '    <div class="user-dropdown-header">' +
      '      <strong>' + (user.displayName || 'Devotee') + '</strong>' +
      '      <small>' + user.email + '</small>' +
      '    </div>' +
      '    <hr class="user-dropdown-sep" />' +
      '    <button class="user-dropdown-item" onclick="window._toggleUserDropdown();window.openProfileModal&&window.openProfileModal()">My Profile</button>' +
      '    <button class="user-dropdown-item" onclick="window._handleSignOut()">Sign Out</button>' +
      '  </div>' +
      '</div>';

    // Greet user - update header greeting if app is loaded
    var greetEl = document.querySelector('.greeting-name');
    if (greetEl && user.displayName) {
      greetEl.textContent = 'Jai Shri Krishna, ' + user.displayName.split(' ')[0] + ' 🙏';
    }
  }

  function onUserLoggedOut() {
    window.__kvUser = null;
    if (typeof window.__kvOnLogout === 'function') window.__kvOnLogout();

    // Show auth overlay (and hide splash/app) via the shared hook.
    if (typeof window.__kvShowAuth === 'function') {
      window.__kvShowAuth();
    } else {
      document.getElementById('authOverlay').classList.remove('hidden');
      document.getElementById('app').classList.add('hidden');
      document.getElementById('splash').classList.add('hidden');
    }

    // Clear header user menu
    var headerMenu = document.getElementById('headerUserMenu');
    if (headerMenu) headerMenu.innerHTML = '';

    // Reset to login screen
    window.switchAuthScreen('login');
  }

  // ── Email verification notice ───────────────────────────
  function showVerifyNotice(user) {
    // Non-blocking banner offering to resend the verification email.
    if (document.getElementById('kvVerifyNotice')) return;
    var bar = document.createElement('div');
    bar.id = 'kvVerifyNotice';
    bar.className = 'kv-verify-notice';
    bar.innerHTML =
      '<span>📧 Please verify your email (' + user.email + ') to secure your account.</span>' +
      '<button id="kvResendVerify" class="kv-verify-btn">Resend</button>' +
      '<button id="kvDismissVerify" class="kv-verify-x" aria-label="Dismiss">✕</button>';
    document.body.appendChild(bar);
    document.getElementById('kvDismissVerify').onclick = function () { bar.remove(); };
    document.getElementById('kvResendVerify').onclick = async function () {
      try {
        await user.sendEmailVerification();
        bar.querySelector('span').textContent = '✓ Verification email sent — check your inbox.';
      } catch (e) {
        bar.querySelector('span').textContent = 'Could not send right now. Please try again later.';
      }
    };
  }

  // ── Auth Actions ───────────────────────────────────────
  window.handleLogin = async function () {
    var email = document.getElementById('loginEmail').value.trim();
    var password = document.getElementById('loginPassword').value;
    var errorEl = document.getElementById('loginError');
    var btn = document.getElementById('loginBtn');

    if (!email || !password) {
      showAuthError(errorEl, 'Please enter your email and password.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Signing in...';
    hideAuthError(errorEl);

    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      showAuthError(errorEl, getErrorMessage(err.code));
      btn.disabled = false;
      btn.textContent = 'Sign In';
    }
  };

  window.handleRegister = async function () {
    var name = document.getElementById('regName').value.trim();
    var email = document.getElementById('regEmail').value.trim();
    var phoneEl = document.getElementById('regPhone');
    var phone = phoneEl ? phoneEl.value.trim() : '';
    var password = document.getElementById('regPassword').value;
    var confirm = document.getElementById('regConfirm').value;
    var errorEl = document.getElementById('registerError');
    var btn = document.getElementById('registerBtn');

    if (!name || !email || !password || !confirm) {
      showAuthError(errorEl, 'Please fill in your name, email and password.');
      return;
    }
    // Phone is OPTIONAL, but if provided it must look like a real number.
    var phoneClean = phone.replace(/[\s\-()]/g, '');
    if (phoneClean && !/^\+?\d{7,15}$/.test(phoneClean)) {
      showAuthError(errorEl, 'Enter a valid phone number (7–15 digits), or leave it blank.');
      return;
    }
    if (password.length < 6) {
      showAuthError(errorEl, 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      showAuthError(errorEl, 'Passwords do not match.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Creating account...';
    hideAuthError(errorEl);

    try {
      var cred = await auth.createUserWithEmailAndPassword(email, password);
      await cred.user.updateProfile({ displayName: name });
      // Persist the optional phone to local + cloud state.
      if (phoneClean && typeof STATE !== 'undefined') {
        STATE.phone = phoneClean;
        if (typeof saveState === 'function') saveState();
      }
      // Send a verification email so the account can be confirmed.
      try { await cred.user.sendEmailVerification(); } catch (e) {}
    } catch (err) {
      showAuthError(errorEl, getErrorMessage(err.code));
      btn.disabled = false;
      btn.textContent = 'Create Account';
    }
  };

  window.handleForgotPassword = async function () {
    var email = document.getElementById('loginEmail').value.trim();
    if (!email) {
      showAuthError(document.getElementById('loginError'), 'Please enter your email address first.');
      return;
    }
    try {
      await auth.sendPasswordResetEmail(email);
      showAuthError(document.getElementById('loginError'), '✓ Reset email sent! Check your inbox.', 'success');
    } catch (e) {
      showAuthError(document.getElementById('loginError'), 'Could not send reset email. Check the address.');
    }
  };

  window._handleSignOut = async function () {
    if (confirm('Sign out of KrishnaVerse?')) {
      try { await auth.signOut(); } catch (e) {}
    }
  };

  window._toggleUserDropdown = function () {
    var dd = document.getElementById('userDropdown');
    if (dd) dd.classList.toggle('hidden');
  };

  // Close dropdown on outside click
  document.addEventListener('click', function (e) {
    var dd = document.getElementById('userDropdown');
    if (dd && !dd.classList.contains('hidden')) {
      if (!e.target.closest('.header-user-menu')) {
        dd.classList.add('hidden');
      }
    }
  });

  // ── UI Helpers ─────────────────────────────────────────
  window.switchAuthScreen = function (screen) {
    var login = document.getElementById('authLogin');
    var register = document.getElementById('authRegister');
    if (screen === 'login') {
      login.classList.add('active');
      login.classList.remove('hidden');
      register.classList.add('hidden');
      register.classList.remove('active');
      // Reset
      document.getElementById('loginBtn').disabled = false;
      document.getElementById('loginBtn').textContent = 'Sign In';
    } else {
      register.classList.add('active');
      register.classList.remove('hidden');
      login.classList.add('hidden');
      login.classList.remove('active');
      document.getElementById('registerBtn').disabled = false;
      document.getElementById('registerBtn').textContent = 'Create Account';
    }
  };

  window.toggleAuthPass = function (inputId, btn) {
    var input = document.getElementById(inputId);
    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = '🙈';
    } else {
      input.type = 'password';
      btn.textContent = '👁️';
    }
  };

  window.updatePasswordStrength = function (value) {
    var row = document.getElementById('strengthRow');
    var bar = document.getElementById('strengthBar');
    var label = document.getElementById('strengthLabel');

    if (!value) { row.classList.add('hidden'); return; }
    row.classList.remove('hidden');

    if (value.length < 6) {
      bar.style.width = '33%';
      bar.style.backgroundColor = '#C0392B';
      label.textContent = 'Weak';
    } else if (value.length < 10) {
      bar.style.width = '66%';
      bar.style.backgroundColor = '#E6830A';
      label.textContent = 'Good';
    } else {
      bar.style.width = '100%';
      bar.style.backgroundColor = '#2D8A4E';
      label.textContent = 'Strong';
    }
  };

  // Allow Enter key to submit
  document.addEventListener('DOMContentLoaded', function () {
    var lp = document.getElementById('loginPassword');
    if (lp) lp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') window.handleLogin();
    });
    var rc = document.getElementById('regConfirm');
    if (rc) rc.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') window.handleRegister();
    });
  });

  function showAuthError(el, msg, type) {
    type = type || 'error';
    el.textContent = msg;
    el.classList.remove('hidden');
    el.style.color = type === 'success' ? '#2D8A4E' : '#C0392B';
    el.style.backgroundColor = type === 'success' ? '#E8F5E9' : '#FDECEA';
  }

  function hideAuthError(el) {
    el.classList.add('hidden');
    el.textContent = '';
  }

  function getErrorMessage(code) {
    switch (code) {
      case 'auth/user-not-found': return 'No account found with this email.';
      case 'auth/wrong-password': return 'Incorrect password. Please try again.';
      case 'auth/invalid-email': return 'Please enter a valid email address.';
      case 'auth/email-already-in-use': return 'An account with this email already exists.';
      case 'auth/weak-password': return 'Password is too weak. Use at least 6 characters.';
      case 'auth/too-many-requests': return 'Too many attempts. Please wait a moment.';
      case 'auth/network-request-failed': return 'Network error. Check your connection.';
      case 'auth/invalid-credential': return 'Invalid email or password.';
      case 'auth/operation-not-allowed': return 'Email sign-up is currently disabled. Please contact support.';
      default: return 'Something went wrong. Please try again.';
    }
  }
})();
