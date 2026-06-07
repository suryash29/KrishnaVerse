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

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password || !confirm) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register(email.trim(), password, name.trim());
      // Auth gate navigates to tabs automatically
    } catch (err) {
      Alert.alert('Registration Failed', getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  const passwordStrength = password.length === 0 ? null
    : password.length < 6 ? 'weak'
    : password.length < 10 ? 'good'
    : 'strong';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <LinearGradient colors={['#1A1208', '#2E1F0D', '#1A1208']} style={styles.bg}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={styles.hero}>
            <Text style={styles.om}>ॐ</Text>
            <Text style={styles.appName}>KrishnaVerse</Text>
            <Text style={styles.tagline}>Begin Your Journey</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create Account</Text>
            <Text style={styles.cardSub}>Your spiritual journey starts here 🙏</Text>

            {/* Name */}
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Arjuna Das"
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              returnKeyType="next"
            />

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
                placeholder="Min. 6 characters"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                returnKeyType="next"
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(v => !v)}>
                <Text style={styles.eyeText}>{showPass ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            {/* Password strength */}
            {passwordStrength && (
              <View style={styles.strengthRow}>
                {['weak', 'good', 'strong'].map((level, i) => (
                  <View
                    key={level}
                    style={[
                      styles.strengthBar,
                      {
                        backgroundColor:
                          (passwordStrength === 'weak' && i === 0) ? '#E53935'
                          : (passwordStrength === 'good' && i <= 1) ? '#FF9800'
                          : (passwordStrength === 'strong') ? '#2D8A4E'
                          : '#3D2A12',
                      },
                    ]}
                  />
                ))}
                <Text style={styles.strengthText}>{passwordStrength}</Text>
              </View>
            )}

            {/* Confirm Password */}
            <Text style={[styles.label, { marginTop: 12 }]}>Confirm Password</Text>
            <TextInput
              style={[
                styles.input,
                confirm && confirm !== password && { borderColor: Colors.error },
              ]}
              placeholder="Re-enter password"
              placeholderTextColor={Colors.textMuted}
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry={!showPass}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />
            {confirm !== '' && confirm !== password && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient colors={['#E8690A', '#C55507']} style={styles.btnGradient}>
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.btnText}>Create Account</Text>
                }
              </LinearGradient>
            </TouchableOpacity>

            {/* Terms note */}
            <Text style={styles.terms}>
              By creating an account you agree to our Terms of Service and Privacy Policy.
            </Text>

            {/* Back to Login */}
            <TouchableOpacity
              style={styles.backRow}
              onPress={() => router.back()}
            >
              <Text style={styles.backText}>
                Already have an account?{' '}
                <Text style={{ color: Colors.primary, fontWeight: '600' }}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

function getErrorMessage(code) {
  switch (code) {
    case 'auth/email-already-in-use': return 'An account with this email already exists.';
    case 'auth/invalid-email': return 'Please enter a valid email address.';
    case 'auth/weak-password': return 'Password is too weak. Use at least 6 characters.';
    case 'auth/network-request-failed': return 'Network error. Check your connection.';
    default: return 'Registration failed. Please try again.';
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
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingBottom: 24,
  },
  om: {
    fontSize: 48,
    color: Colors.primary,
    marginBottom: 8,
  },
  appName: {
    fontSize: 28,
    color: '#F5E8D0',
    fontWeight: '700',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 13,
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
    fontSize: 22,
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
    fontSize: 12,
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
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthText: {
    color: Colors.textMuted,
    fontSize: 11,
    textTransform: 'capitalize',
    minWidth: 40,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
  },
  btn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 16,
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
  terms: {
    color: Colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
  },
  backRow: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  backText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  bottomSpacer: { height: 20 },
});
