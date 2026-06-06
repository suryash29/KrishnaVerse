// ─────────────────────────────────────────────────────────
//  KrishnaVerse – Web Auth Module
//  Handles Login, Register, and Auth State for the web app
// ─────────────────────────────────────────────────────────

import {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  db,
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from './firebase-config.js';

// ── Cloud data sync (Firestore users/{uid}) ─────────────
// Exposed for the classic app.js (which cannot import modules) to read
// and persist a signed-in user's personal data across devices.
window.__kvCloud = {
  async load(uid) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      return snap.exists() ? snap.data() : null;
    } catch (e) {
      console.warn('Cloud load failed:', e && e.message);
      return null;
    }
  },
  async save(uid, data) {
    try {
      await setDoc(
        doc(db, 'users', uid),
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
  async createOrder(order) {
    try {
      const ref = await addDoc(collection(db, 'orders'),
        Object.assign({}, order, { createdAt: serverTimestamp() }));
      return ref.id;
    } catch (e) {
      console.warn('Order create failed:', e && e.message);
      return null;
    }
  },
  // Record a donation intent (used by the donate flow).
  async createDonation(donation) {
    try {
      const ref = await addDoc(collection(db, 'donations'),
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
  await updateProfile(auth.currentUser, { displayName: name });
  return true;
};
window.__kvSendVerify = async function () {
  if (!auth.currentUser) return false;
  await sendEmailVerification(auth.currentUser);
  return true;
};
window.__kvChangePassword = async function (currentPassword, newPassword) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('Not signed in.');
  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, cred);
  await updatePassword(user, newPassword);
  return true;
};

// ── Auth State Observer ─────────────────────────────────
// auth.js is the single source of truth for which top-level layer is
// visible (splash / authOverlay / #app). app.js exposes __kvShowApp()
// and __kvShowAuth() and never reveals the app on its own timer, which
// eliminates the previous race where the app flashed for signed-out
// users and the splash could get stuck for signed-in users.
onAuthStateChanged(auth, (user) => {
  window.__kvAuthResolved = true;
  if (user) {
    onUserLoggedIn(user);
  } else {
    onUserLoggedOut();
  }
}, (error) => {
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
    const splashEl = document.getElementById('splash');
    if (splashEl) { splashEl.classList.remove('hidden'); splashEl.style.opacity = '1'; }
  }

  // Expose the current user + load their cloud-synced data.
  window.__kvUser = user;
  if (typeof window.__kvOnLogin === 'function') window.__kvOnLogin(user);

  // Show a gentle reminder if the email is not yet verified.
  if (user && user.emailVerified === false) showVerifyNotice(user);

  // Update header user menu
  const initial = (user.displayName || user.email || 'U')[0].toUpperCase();
  const headerMenu = document.getElementById('headerUserMenu');
  headerMenu.innerHTML = `
    <div class="header-user-menu">
      <button class="user-avatar-btn" onclick="window._toggleUserDropdown()" title="${user.displayName || user.email}">
        <span class="user-initial">${initial}</span>
      </button>
      <div class="user-dropdown hidden" id="userDropdown">
        <div class="user-dropdown-header">
          <strong>${user.displayName || 'Devotee'}</strong>
          <small>${user.email}</small>
        </div>
        <hr class="user-dropdown-sep" />
        <button class="user-dropdown-item" onclick="window._toggleUserDropdown();window.openProfileModal&&window.openProfileModal()">My Profile</button>
        <button class="user-dropdown-item" onclick="window._handleSignOut()">Sign Out</button>
      </div>
    </div>
  `;

  // Greet user - update header greeting if app is loaded
  const greetEl = document.querySelector('.greeting-name');
  if (greetEl && user.displayName) {
    greetEl.textContent = `Jai Shri Krishna, ${user.displayName.split(' ')[0]} 🙏`;
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
  const headerMenu = document.getElementById('headerUserMenu');
  if (headerMenu) headerMenu.innerHTML = '';

  // Reset to login screen
  switchAuthScreen('login');
}

// ── Email verification notice ───────────────────────────
function showVerifyNotice(user) {
  // Non-blocking banner offering to resend the verification email.
  if (document.getElementById('kvVerifyNotice')) return;
  const bar = document.createElement('div');
  bar.id = 'kvVerifyNotice';
  bar.className = 'kv-verify-notice';
  bar.innerHTML = `
    <span>📧 Please verify your email (${user.email}) to secure your account.</span>
    <button id="kvResendVerify" class="kv-verify-btn">Resend</button>
    <button id="kvDismissVerify" class="kv-verify-x" aria-label="Dismiss">✕</button>
  `;
  document.body.appendChild(bar);
  document.getElementById('kvDismissVerify').onclick = () => bar.remove();
  document.getElementById('kvResendVerify').onclick = async () => {
    try {
      await sendEmailVerification(user);
      bar.querySelector('span').textContent = '✓ Verification email sent — check your inbox.';
    } catch {
      bar.querySelector('span').textContent = 'Could not send right now. Please try again later.';
    }
  };
}

// ── Auth Actions ───────────────────────────────────────
window.handleLogin = async function () {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');

  if (!email || !password) {
    showAuthError(errorEl, 'Please enter your email and password.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Signing in...';
  hideAuthError(errorEl);

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    showAuthError(errorEl, getErrorMessage(err.code));
    btn.disabled = false;
    btn.textContent = 'Sign In';
  }
};

window.handleRegister = async function () {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;
  const errorEl = document.getElementById('registerError');
  const btn = document.getElementById('registerBtn');

  if (!name || !email || !password || !confirm) {
    showAuthError(errorEl, 'Please fill in all fields.');
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
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    // Send a verification email so the account can be confirmed.
    try { await sendEmailVerification(cred.user); } catch {}
  } catch (err) {
    showAuthError(errorEl, getErrorMessage(err.code));
    btn.disabled = false;
    btn.textContent = 'Create Account';
  }
};

window.handleForgotPassword = async function () {
  const email = document.getElementById('loginEmail').value.trim();
  if (!email) {
    showAuthError(document.getElementById('loginError'), 'Please enter your email address first.');
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    showAuthError(document.getElementById('loginError'), '✓ Reset email sent! Check your inbox.', 'success');
  } catch {
    showAuthError(document.getElementById('loginError'), 'Could not send reset email. Check the address.');
  }
};

window._handleSignOut = async function () {
  if (confirm('Sign out of KrishnaVerse?')) {
    try { await signOut(auth); } catch {}
  }
};

window._toggleUserDropdown = function () {
  const dd = document.getElementById('userDropdown');
  if (dd) dd.classList.toggle('hidden');
};

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  const dd = document.getElementById('userDropdown');
  if (dd && !dd.classList.contains('hidden')) {
    if (!e.target.closest('.header-user-menu')) {
      dd.classList.add('hidden');
    }
  }
});

// ── UI Helpers ─────────────────────────────────────────
window.switchAuthScreen = function (screen) {
  const login = document.getElementById('authLogin');
  const register = document.getElementById('authRegister');
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
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
};

window.updatePasswordStrength = function (value) {
  const row = document.getElementById('strengthRow');
  const bar = document.getElementById('strengthBar');
  const label = document.getElementById('strengthLabel');

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
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginPassword')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') window.handleLogin();
  });
  document.getElementById('regConfirm')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') window.handleRegister();
  });
});

function showAuthError(el, msg, type = 'error') {
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
    default: return 'Something went wrong. Please try again.';
  }
}
