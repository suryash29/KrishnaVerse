import React, { createContext, useContext, useEffect, useState } from 'react';
import {
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
} from 'firebase/auth';
import { auth } from '../firebaseConfig';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = still loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Timeout fallback — if Firebase takes too long, treat as logged out
    const timeout = setTimeout(() => {
      if (loading) {
        setUser(null);
        setLoading(false);
      }
    }, 8000);

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        clearTimeout(timeout);
        setUser(firebaseUser ?? null);
        setLoading(false);
      },
      (error) => {
        // Auth error (e.g. network) — treat as logged out
        clearTimeout(timeout);
        console.warn('Auth error:', error.message);
        setUser(null);
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  async function register(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    // Send a verification email so the account can be confirmed.
    try { await sendEmailVerification(cred.user); } catch {}
    return cred.user;
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }

  async function logout() {
    await signOut(auth);
  }

  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
  }

  async function resendVerification() {
    if (auth.currentUser) await sendEmailVerification(auth.currentUser);
  }

  async function updateDisplayName(displayName) {
    if (!auth.currentUser) throw new Error('Not signed in.');
    await updateProfile(auth.currentUser, { displayName });
    // Reflect the change locally so consumers re-render.
    setUser({ ...auth.currentUser });
  }

  async function changePassword(currentPassword, newPassword) {
    const u = auth.currentUser;
    if (!u || !u.email) throw new Error('Not signed in.');
    const cred = EmailAuthProvider.credential(u.email, currentPassword);
    await reauthenticateWithCredential(u, cred);
    await updatePassword(u, newPassword);
  }

  return (
    <AuthContext.Provider value={{
      user, loading, register, login, logout, resetPassword,
      resendVerification, updateDisplayName, changePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
