import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Colors } from '../../constants/Colors';
import PremiumSheet from '../../components/PremiumSheet';

export default function ProfileScreen() {
  const { user, logout, resendVerification, updateDisplayName, changePassword } = useAuth();
  const { bookmarks, journal, streak, isPremium, language } = useApp();
  const hiFirst = language === 'hi';
  const [showPremium, setShowPremium] = useState(false);

  const [name, setName] = useState(user?.displayName || '');
  const [savingName, setSavingName] = useState(false);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [changing, setChanging] = useState(false);

  const initial = (user?.displayName || user?.email || 'U')[0].toUpperCase();
  const verified = !!user?.emailVerified;

  async function onSaveName() {
    const trimmed = name.trim();
    if (!trimmed) { Alert.alert('Name required', 'Please enter a display name.'); return; }
    setSavingName(true);
    try {
      await updateDisplayName(trimmed);
      Alert.alert('Saved', 'Your name has been updated.');
    } catch {
      Alert.alert('Error', 'Could not update your name. Please try again.');
    } finally {
      setSavingName(false);
    }
  }

  async function onResend() {
    try {
      await resendVerification();
      Alert.alert('Sent', 'Verification email sent — check your inbox.');
    } catch {
      Alert.alert('Error', 'Could not send right now. Please try later.');
    }
  }

  async function onChangePassword() {
    if (!current || !next) { Alert.alert('Missing fields', 'Enter both current and new password.'); return; }
    if (next.length < 6) { Alert.alert('Weak password', 'New password must be at least 6 characters.'); return; }
    setChanging(true);
    try {
      await changePassword(current, next);
      setCurrent(''); setNext('');
      Alert.alert('Done', 'Your password has been updated.');
    } catch (e) {
      const code = e?.code;
      Alert.alert('Error', code === 'auth/wrong-password' || code === 'auth/invalid-credential'
        ? 'Current password is incorrect.' : 'Could not update password. Please try again.');
    } finally {
      setChanging(false);
    }
  }

  function onSignOut() {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#E8690A', '#C55507']} style={styles.hero}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{initial}</Text></View>
          <Text style={styles.name}>{user?.displayName || 'Devotee'}</Text>
          <View style={styles.emailRow}>
            <Text style={styles.email}>{user?.email}</Text>
            <View style={[styles.badge, verified ? styles.badgeOk : styles.badgeWarn]}>
              <Text style={styles.badgeText}>{verified ? '✓ Verified' : 'Unverified'}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.statsRow}>
          <Stat num={(bookmarks || []).length} label="Saved" />
          <Stat num={(journal || []).length} label="Journal" />
          <Stat num={(streak && streak.current) || 0} label="Day Streak" />
        </View>

        {/* Premium: upgrade entry point (or active badge) */}
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          {isPremium ? (
            <View style={[styles.premiumCard, styles.premiumCardOn]}>
              <Text style={styles.premiumIco}>🪔</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.premiumTitle}>{hiFirst ? 'KrishnaVerse प्रीमियम' : 'KrishnaVerse Premium'}</Text>
                <Text style={styles.premiumSub}>{hiFirst ? 'सक्रिय · सभी शब्द-दर-शब्द व पाठ अनलॉक' : 'Active · all word-by-word & recitations unlocked'}</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.premiumCard} activeOpacity={0.85} onPress={() => setShowPremium(true)}>
              <Text style={styles.premiumIco}>🪔</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.premiumTitle}>{hiFirst ? 'प्रीमियम लें' : 'Upgrade to Premium'}</Text>
                <Text style={styles.premiumSub}>{hiFirst ? 'सभी 700 श्लोकों का शब्द-दर-शब्द + प्रामाणिक पाठ · ₹199/वर्ष' : 'Word-by-word for all 700 verses + authentic recitations · ₹199/year'}</Text>
              </View>
              <Text style={styles.premiumCta}>{hiFirst ? 'लें →' : 'Upgrade →'}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DISPLAY NAME</Text>
          <View style={styles.row}>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={Colors.textMuted} />
            <TouchableOpacity style={styles.btn} onPress={onSaveName} disabled={savingName}>
              <Text style={styles.btnText}>{savingName ? '...' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {!verified && (
          <View style={styles.section}>
            <TouchableOpacity style={styles.btnOutline} onPress={onResend}>
              <Text style={styles.btnOutlineText}>📧 Resend verification email</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CHANGE PASSWORD</Text>
          <TextInput style={styles.inputBlock} value={current} onChangeText={setCurrent} secureTextEntry placeholder="Current password" placeholderTextColor={Colors.textMuted} />
          <TextInput style={styles.inputBlock} value={next} onChangeText={setNext} secureTextEntry placeholder="New password (min 6 chars)" placeholderTextColor={Colors.textMuted} />
          <TouchableOpacity style={styles.btnBlock} onPress={onChangePassword} disabled={changing}>
            <Text style={styles.btnText}>{changing ? 'Updating...' : 'Update Password'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.signOut} onPress={onSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <PremiumSheet visible={showPremium} onClose={() => setShowPremium(false)} />
    </SafeAreaView>
  );
}

function Stat({ num, label }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statNum}>{num}</Text>
      <Text style={styles.statLbl}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  hero: { padding: 32, alignItems: 'center', gap: 8 },
  avatar: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 30, fontWeight: '700' },
  name: { color: '#fff', fontSize: 22, fontWeight: '700' },
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  email: { color: 'rgba(255,255,255,0.9)', fontSize: 13 },
  badge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  badgeOk: { backgroundColor: '#E8F5E9' },
  badgeWarn: { backgroundColor: '#FDECEA' },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#333' },
  statsRow: { flexDirection: 'row', gap: 10, padding: 16 },
  stat: { flex: 1, backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', paddingVertical: 14 },
  statNum: { fontSize: 22, fontWeight: '700', color: Colors.primary },
  statLbl: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  premiumCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFF6E6', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#F2C879',
  },
  premiumCardOn: { backgroundColor: '#FDF3E0' },
  premiumIco: { fontSize: 26 },
  premiumTitle: { fontSize: 15, fontWeight: '700', color: '#8A4B0A' },
  premiumSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2, lineHeight: 17 },
  premiumCta: {
    fontSize: 13, fontWeight: '700', color: '#fff',
    backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999,
  },
  section: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.5 },
  row: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: Colors.text },
  inputBlock: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: Colors.text },
  btn: { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 18, justifyContent: 'center' },
  btnBlock: { backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  btnOutline: { borderWidth: 1, borderColor: Colors.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  btnOutlineText: { color: Colors.primary, fontWeight: '700' },
  signOut: { borderWidth: 1, borderColor: '#C0392B', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  signOutText: { color: '#C0392B', fontWeight: '700' },
});
