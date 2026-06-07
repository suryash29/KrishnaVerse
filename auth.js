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
  sendPasswordResetEmail,
} from './firebase-config.js';

// ── Auth State Observer ─────────────────────────────────
onAuthStateChanged(auth, (user) => {
  if (user) {
    onUserLoggedIn(user);
  } else {
    onUserLoggedOut();
  }
});

function onUserLoggedIn(user) {
  // Hide auth overlay, show splash then app
  document.getElementById('authOverlay').classList.add('hidden');
  const splashEl = document.getElementById('splash');
  splashEl.classList.remove('hidden');
  splashEl.style.opacity = '1';

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
  // Show auth overlay
  document.getElementById('authOverlay').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
  document.getElementById('splash').classList.add('hidden');

  // Clear header user menu
  const headerMenu = document.getElementById('headerUserMenu');
  if (headerMenu) headerMenu.innerHTML = '';

  // Reset to login screen
  switchAuthScreen('login');
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
