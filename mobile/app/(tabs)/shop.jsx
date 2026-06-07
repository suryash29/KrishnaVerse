import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Linking, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../constants/Colors';

const CAUSES = [
  {
    id: 'goseva',
    emoji: '🐄',
    title: 'Go Seva',
    desc: 'Feed and protect cows at local gaushalas',
    amounts: [51, 101, 251, 501],
    upi: 'goseva@upi',
  },
  {
    id: 'gita',
    emoji: '📖',
    title: 'Gita Distribution',
    desc: 'Distribute free Bhagavad Gita to students',
    amounts: [21, 51, 101, 201],
    upi: 'gitadaan@upi',
  },
  {
    id: 'temple',
    emoji: '🛕',
    title: 'Temple Seva',
    desc: 'Support temple prasad and puja activities',
    amounts: [51, 108, 251, 1008],
    upi: 'templeseva@upi',
  },
];

const PRODUCTS = [
  { id: 'gita1', category: 'books', emoji: '📕', title: 'Bhagavad Gita As It Is', author: 'Srila Prabhupada', price: '₹250', tag: 'Bestseller' },
  { id: 'gita2', category: 'books', emoji: '📗', title: 'Gita Makaranda', author: 'Vidyaprakashananda', price: '₹180', tag: null },
  { id: 'puja1', category: 'puja', emoji: '🪔', title: 'Ghee Diya Set (5pc)', author: null, price: '₹350', tag: 'Handmade' },
  { id: 'puja2', category: 'puja', emoji: '🌺', title: 'Puja Thali Premium', author: null, price: '₹599', tag: null },
  { id: 'mala1', category: 'counter', emoji: '📿', title: 'Tulsi Mala 108', author: null, price: '₹299', tag: 'Sacred' },
  { id: 'mala2', category: 'counter', emoji: '📿', title: 'Chandan Mala', author: null, price: '₹449', tag: null },
  { id: 'frame1', category: 'frames', emoji: '🖼️', title: 'Krishna Arjuna Frame', author: null, price: '₹799', tag: 'Popular' },
  { id: 'frame2', category: 'frames', emoji: '🖼️', title: 'Gita Shloka Print', author: null, price: '₹399', tag: null },
];

const SHOP_TABS = ['All', 'Books', 'Puja', 'Mala', 'Frames'];

export default function ShopScreen() {
  const [shopTab, setShopTab] = useState('All');

  const filtered = shopTab === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => {
        const map = { Books: 'books', Puja: 'puja', Mala: 'counter', Frames: 'frames' };
        return p.category === map[shopTab];
      });

  function handleDonate(cause, amount) {
    const upiUrl = `upi://pay?pa=${cause.upi}&pn=${encodeURIComponent(cause.title)}&am=${amount}&cu=INR&tn=${encodeURIComponent('KrishnaVerse Donation')}`;
    Linking.openURL(upiUrl).catch(() => {
      Alert.alert('UPI App Not Found', 'Please update the UPI ID in firebaseConfig.js for real payments.');
    });
  }

  function handleOrder(product) {
    const msg = encodeURIComponent(
      `Hare Krishna 🙏\n\nI would like to order: *${product.title}*\nPrice: ${product.price}\n\nFrom KrishnaVerse App`
    );
    Linking.openURL(`whatsapp://send?text=${msg}`).catch(() => {
      Alert.alert('WhatsApp Not Found', 'Install WhatsApp to order via chat.');
    });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <LinearGradient colors={['#E8690A', '#C55507']} style={styles.hero}>
          <Text style={styles.heroEmoji}>🙏</Text>
          <Text style={styles.heroTitle}>Support Dharma</Text>
          <Text style={styles.heroSub}>Protect cows · Spread Gita · Preserve culture</Text>
        </LinearGradient>

        {/* Donation Causes */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DONATE TO A CAUSE</Text>
          {CAUSES.map(cause => (
            <View key={cause.id} style={styles.causeCard}>
              <View style={styles.causeHeader}>
                <Text style={styles.causeEmoji}>{cause.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.causeTitle}>{cause.title}</Text>
                  <Text style={styles.causeDesc}>{cause.desc}</Text>
                </View>
              </View>
              <View style={styles.amountRow}>
                {cause.amounts.map(amt => (
                  <TouchableOpacity
                    key={amt}
                    style={styles.amountBtn}
                    onPress={() => handleDonate(cause, amt)}
                  >
                    <Text style={styles.amountText}>₹{amt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Shop */}
        <View style={styles.section}>
          <View style={styles.shopHeader}>
            <Text style={styles.sectionLabel}>SPIRITUAL SHOP</Text>
            <View style={styles.shopBadge}>
              <Text style={styles.shopBadgeText}>Order via WhatsApp</Text>
            </View>
          </View>

          {/* Shop Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.shopTabs}>
              {SHOP_TABS.map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.shopTab, shopTab === tab && styles.shopTabActive]}
                  onPress={() => setShopTab(tab)}
                >
                  <Text style={[styles.shopTabText, shopTab === tab && styles.shopTabTextActive]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Products Grid */}
          <View style={styles.productsGrid}>
            {filtered.map(product => (
              <View key={product.id} style={styles.productCard}>
                {product.tag && (
                  <View style={styles.productTag}>
                    <Text style={styles.productTagText}>{product.tag}</Text>
                  </View>
                )}
                <Text style={styles.productEmoji}>{product.emoji}</Text>
                <Text style={styles.productTitle}>{product.title}</Text>
                {product.author && (
                  <Text style={styles.productAuthor}>{product.author}</Text>
                )}
                <Text style={styles.productPrice}>{product.price}</Text>
                <TouchableOpacity
                  style={styles.orderBtn}
                  onPress={() => handleOrder(product)}
                >
                  <Text style={styles.orderBtnText}>Order</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  hero: {
    padding: 40,
    alignItems: 'center',
    gap: 8,
  },
  heroEmoji: { fontSize: 48 },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  heroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  section: { padding: 16, gap: 12 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  causeCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  causeHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  causeEmoji: { fontSize: 32 },
  causeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  causeDesc: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
    lineHeight: 18,
  },
  amountRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  amountBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  amountText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  shopBadgeText: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: '600',
  },
  shopTabs: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
  },
  shopTab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  shopTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  shopTabText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  shopTabTextActive: { color: '#fff', fontWeight: '700' },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: 6,
    position: 'relative',
  },
  productTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  productTagText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  productEmoji: { fontSize: 36 },
  productTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 18,
  },
  productAuthor: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  orderBtn: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  orderBtnText: {
    color: Colors.success,
    fontWeight: '700',
    fontSize: 13,
  },
});
