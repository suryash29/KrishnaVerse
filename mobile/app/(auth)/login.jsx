import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login, resetPassword } = useAuth();
  const router = useRouter();

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      // Navigation handled by auth gate in _layout
    } catch (err) {
      const msg = getErrorMessage(err.code);
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      Alert.alert('Enter Email', 'Please enter your email address first.');
      return;
    }
    try {
      await resetPassword(email.trim());
      Alert.alert('Email Sent', 'Check your inbox for the password reset link.');
    } catch {
      Alert.alert('Error', 'Could not send reset email. Check the address and try again.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <LinearGradient colors={['#1A1208', '#2E1F0D', '#1A1208']} style={styles.bg}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Om Header */}
          <View style={styles.hero}>
            <Text style={styles.om}>ॐ</Text>
            <Text style={styles.appName}>KrishnaVerse</Text>
            <Text style={styles.tagline}>Daily Gita Wisdom</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome Back</Text>
            <Text style={styles.cardSub}>Jai Shri Krishna 🙏</Text>

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.passRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(v => !v)}>
                <Text style={styles.eyeText}>{showPass ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotRow}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient colors={['#E8690A', '#C55507']} style={styles.btnGradient}>
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.btnText}>Sign In</Text>
                }
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>New to KrishnaVerse?</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register Link */}
            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => router.push('/(auth)/register')}
              activeOpacity={0.85}
            >
              <Text style={styles.outlineBtnText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* Footer quote */}
          <Text style={styles.quote}>
            "You have a right to perform your duties, but never to the fruits."
          </Text>
          <Text style={styles.quoteRef}>— Bhagavad Gita 2.47</Text>

        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

function getErrorMessage(code) {
  switch (code) {
    case 'auth/user-not-found': return 'No account found with this email.';
    case 'auth/wrong-password': return 'Incorrect password. Please try again.';
    case 'auth/invalid-email': return 'Please enter a valid email address.';
    case 'auth/too-many-requests': return 'Too many attempts. Please wait a moment.';
    case 'auth/network-request-failed': return 'Network error. Check your connection.';
    default: return 'Login failed. Please try again.';
  }
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 32,
  },
  om: {
    fontSize: 64,
    color: Colors.primary,
    fontWeight: '300',
    marginBottom: 8,
  },
  appName: {
    fontSize: 32,
    color: '#F5E8D0',
    fontWeight: '700',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  card: {
    width: '100%',
    backgroundColor: '#1E1408',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#3D2A12',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F5E8D0',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondaryDark,
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#2E1F0D',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3D2A12',
    color: '#F5E8D0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  passRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  eyeBtn: {
    padding: 12,
    backgroundColor: '#2E1F0D',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3D2A12',
  },
  eyeText: { fontSize: 18 },
  forgotRow: {
    alignItems: 'flex-end',
    marginBottom: 20,
    marginTop: 4,
  },
  forgotText: {
    color: Colors.primaryLight,
    fontSize: 13,
    fontWeight: '500',
  },
  btn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 20,
  },
  btnDisabled: { opacity: 0.6 },
  btnGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#3D2A12' },
  dividerText: {
    color: Colors.textMuted,
    fontSize: 12,
    whiteSpace: 'nowrap',
  },
  outlineBtn: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingVertical: 14,
    alignItems: 'center',
  },
  outlineBtnText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  quote: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 32,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  quoteRef: {
    color: Colors.primary,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: 0.5,
  },
});
