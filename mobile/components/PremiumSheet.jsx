import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView,
  Linking, Alert, ActivityIndicator,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../constants/Colors';
import { KV_CONFIG } from '../constants/Config';
import { createOrder, createPremiumPaymentLink } from '../services/cloud';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

// KrishnaVerse Premium (₹199/yr) — unlocks word-by-word for all 700 verses.
// First principles: the paid value is authentic word-by-word meaning across the
// whole Gita (the 23 curated verses are free). Payment is out-of-band via
// UPI/WhatsApp; we record intent and let the cloud entitlement be the source of
// truth. A self-serve "I've paid" path optimistically unlocks the device.
export default function PremiumSheet({ visible, onClose }) {
  const { language, update } = useApp();
  const { user } = useAuth();
  const hiFirst = language === 'hi';

  const price = (KV_CONFIG && KV_CONFIG.premiumPrice) ? KV_CONFIG.premiumPrice : 199;
  const upi = (KV_CONFIG && KV_CONFIG.premiumUpi) ? KV_CONFIG.premiumUpi : '';
  const waNum = (KV_CONFIG && KV_CONFIG.shopWhatsApp) ? KV_CONFIG.shopWhatsApp : '';

  const [rzpLoading, setRzpLoading] = useState(false);

  const benefits = hiFirst
    ? ['सभी 700 श्लोकों का शब्द-दर-शब्द अर्थ', 'हिंदी + अंग्रेज़ी, दोनों भाषाओं में', 'भविष्य के सभी अपडेट शामिल', 'गौ-सेवा व गीता प्रचार में योगदान']
    : ['Word-by-word meaning for all 700 verses', 'Both Hindi & English, side by side', 'All future updates included', 'Supports Gita propagation & go-seva'];

  function recordIntent() {
    if (user) {
      createOrder({
        userId: user.uid,
        items: [{ id: 'premium-annual', name: 'KrishnaVerse Premium (Annual)', price: '₹' + price, category: 'subscription' }],
        status: 'pending',
        channel: 'whatsapp',
      });
    }
  }

  // Razorpay (UPI-only) — the server mints a UPI Payment Link; we open it in any
  // UPI app via Linking. The webhook (server) grants premium once it's paid, so
  // the entitlement is trustworthy without bundling a native Razorpay module
  // (which would break Expo Go). Available only when signed in.
  async function payRazorpay() {
    if (!user) {
      Alert.alert(
        hiFirst ? 'साइन-इन ज़रूरी' : 'Sign in required',
        hiFirst ? 'सुरक्षित भुगतान के लिए पहले साइन-इन करें।' : 'Please sign in first for a secure payment.'
      );
      return;
    }
    if (rzpLoading) return;
    setRzpLoading(true);
    try {
      const data = await createPremiumPaymentLink();
      if (data && data.url) {
        await Linking.openURL(data.url);
      } else {
        // Server not configured yet — fall back to the manual UPI path.
        payUpi();
      }
    } catch (e) {
      payUpi();
    } finally {
      setRzpLoading(false);
    }
  }

  function payUpi() {
    recordIntent();
    if (!upi) {
      Alert.alert('Set UPI ID', 'Please set premiumUpi in constants/Config.js for real payments.');
      return;
    }
    const url = `upi://pay?pa=${upi}&pn=${encodeURIComponent('KrishnaVerse Premium')}&am=${price}&cu=INR&tn=${encodeURIComponent('KrishnaVerse Premium Annual')}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('UPI App Not Found', `Pay ₹${price} to ${upi} via any UPI app.`);
    });
  }

  function payWhatsApp() {
    recordIntent();
    const msg = encodeURIComponent(
      `Jai Shri Krishna! 🙏\n\nI want *KrishnaVerse Premium* (word-by-word for all 700 verses) for ₹${price}/year.${upi ? `\n\nUPI: ${upi}` : ''}\n\nHare Krishna 🪔`
    );
    const url = waNum ? `whatsapp://send?phone=${waNum}&text=${msg}` : `whatsapp://send?text=${msg}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('WhatsApp Not Found', 'Install WhatsApp to continue.');
    });
  }

  function copyUpi() {
    if (!upi) return;
    try { Clipboard.setStringAsync(upi); } catch {}
    Alert.alert(hiFirst ? 'कॉपी हो गया' : 'Copied', upi);
  }

  function alreadyPaid() {
    Alert.alert(
      hiFirst ? 'भुगतान की पुष्टि' : 'Confirm Payment',
      hiFirst
        ? `क्या आपने ₹${price}/वर्ष का भुगतान कर दिया है? पुष्टि होने पर प्रीमियम अनलॉक हो जाएगा।`
        : `Have you completed the ₹${price}/year payment? Premium will be unlocked on this device.`,
      [
        { text: hiFirst ? 'अभी नहीं' : 'Not yet', style: 'cancel' },
        {
          text: hiFirst ? 'हाँ, अनलॉक करें' : 'Yes, unlock',
          onPress: () => {
            update({ isPremium: true });
            onClose && onClose();
            Alert.alert('🙏', hiFirst ? 'प्रीमियम सक्रिय! जय श्री कृष्ण।' : 'Premium activated! Jai Shri Krishna.');
          },
        },
      ]
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.close} onPress={onClose}>
              <Text style={styles.closeTxt}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.crown}>🪔</Text>
            <Text style={styles.title}>{hiFirst ? 'KrishnaVerse प्रीमियम' : 'KrishnaVerse Premium'}</Text>
            <Text style={styles.price}>₹{price}<Text style={styles.per}>/{hiFirst ? 'वर्ष' : 'year'}</Text></Text>

            <View style={styles.benefits}>
              {benefits.map((b, i) => (
                <Text key={i} style={styles.benefit}>✓  {b}</Text>
              ))}
            </View>

            {!!upi && (
              <>
                <Text style={styles.upiLabel}>{hiFirst ? 'UPI से भुगतान करें' : 'PAY VIA UPI'}</Text>
                <TouchableOpacity onPress={copyUpi}>
                  <Text style={styles.upi}>{upi}  📋</Text>
                </TouchableOpacity>
              </>
            )}

            {!!user && (
              <TouchableOpacity activeOpacity={0.85} onPress={payRazorpay} disabled={rzpLoading}>
                <LinearGradient colors={Gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cta}>
                  {rzpLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.ctaTxt}>{hiFirst ? `UPI से ₹${price} भुगतान करें` : `Pay ₹${price} via UPI`}</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            )}

            {!!user && <View style={styles.orRow}><Text style={styles.orTxt}>{hiFirst ? 'या' : 'or'}</Text></View>}

            <TouchableOpacity activeOpacity={0.85} onPress={payUpi}>
              {!!user ? (
                <View style={styles.ctaSecondary}>
                  <Text style={styles.ctaSecondaryTxt}>{hiFirst ? `मैन्युअल UPI से ₹${price} भेजें` : `Pay ₹${price} manually via UPI`}</Text>
                </View>
              ) : (
                <LinearGradient colors={Gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cta}>
                  <Text style={styles.ctaTxt}>{hiFirst ? `UPI से ₹${price} भुगतान करें` : `Pay ₹${price} via UPI`}</Text>
                </LinearGradient>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.ctaGhost} activeOpacity={0.85} onPress={payWhatsApp}>
              <Text style={styles.ctaGhostTxt}>{hiFirst ? 'WhatsApp पर बात करें' : 'Ask on WhatsApp'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.paid} onPress={alreadyPaid}>
              <Text style={styles.paidTxt}>{hiFirst ? 'मैंने भुगतान कर दिया है' : "I've already paid"}</Text>
            </TouchableOpacity>

            <Text style={styles.note}>{hiFirst
              ? 'भुगतान की पुष्टि के बाद आपका खाता अनलॉक हो जाएगा। 🙏'
              : 'Your account is unlocked once payment is confirmed. 🙏'}</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  content: { padding: 24, paddingTop: 28, alignItems: 'center' },
  close: { position: 'absolute', top: 14, right: 16, padding: 6, zIndex: 2 },
  closeTxt: { fontSize: 18, color: Colors.textMuted },
  crown: { fontSize: 44, marginBottom: 4 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 2 },
  price: { fontSize: 34, fontWeight: '800', color: Colors.primary, marginBottom: 16 },
  per: { fontSize: 15, fontWeight: '500', color: Colors.textMuted },
  benefits: { alignSelf: 'stretch', marginBottom: 18 },
  benefit: {
    fontSize: 14, color: Colors.textSecondary, paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border,
  },
  upiLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, color: Colors.textMuted, marginBottom: 4 },
  upi: { fontSize: 16, fontWeight: '700', color: Colors.primary, marginBottom: 16 },
  cta: { borderRadius: 14, paddingVertical: 14, paddingHorizontal: 28, alignSelf: 'stretch', alignItems: 'center' },
  ctaTxt: { color: '#fff', fontSize: 16, fontWeight: '800' },
  orRow: { alignSelf: 'stretch', alignItems: 'center', marginVertical: 10 },
  orTxt: { fontSize: 12, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1, textTransform: 'uppercase' },
  ctaSecondary: {
    borderRadius: 14, paddingVertical: 13, paddingHorizontal: 28,
    alignSelf: 'stretch', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.primary,
  },
  ctaSecondaryTxt: { color: Colors.primary, fontSize: 15, fontWeight: '800' },
  ctaGhost: {
    marginTop: 10, alignSelf: 'stretch', alignItems: 'center',
    paddingVertical: 13, borderRadius: 14, borderWidth: 1, borderColor: Colors.border,
  },
  ctaGhostTxt: { color: Colors.textSecondary, fontSize: 15, fontWeight: '700' },
  paid: { marginTop: 14, paddingVertical: 6 },
  paidTxt: { color: Colors.primaryDark, fontSize: 14, fontWeight: '700' },
  note: { fontSize: 12, color: Colors.textMuted, textAlign: 'center', lineHeight: 18, marginTop: 14 },
});
