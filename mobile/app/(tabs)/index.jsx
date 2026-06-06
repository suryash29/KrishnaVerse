import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { getTodayShloka, MOODS, getShlokaById } from '../../constants/Shlokas';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { streak, bookmarks, journal, notes, moodHistory, logMood, updateStreak, toggleBookmark, isBookmarked } = useApp();
  const [todayShloka, setTodayShloka] = useState(null);
  const [greeting, setGreeting] = useState('Good morning');
  const router = useRouter();

  useEffect(() => {
    setTodayShloka(getTodayShloka());
    updateStreak();
    const h = new Date().getHours();
    if (h < 12) setGreeting('Good morning');
    else if (h < 17) setGreeting('Good afternoon');
    else if (h < 21) setGreeting('Good evening');
    else setGreeting('Good night');
  }, []);

  const firstName = user?.displayName?.split(' ')[0] || 'Devotee';
  const todayMoodEntry = moodHistory.find(m => m.date === new Date().toDateString());

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>{greeting}</Text>
          <Text style={styles.headerTitle}>Jai Shri Krishna 🙏</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.streakBadge}>
            <Text style={styles.streakFire}>🔥</Text>
            <Text style={styles.streakNum}>{streak.current}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <View style={styles.avatarBtn}>
              <Text style={styles.avatarText}>{firstName[0].toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Daily Shloka Card */}
        {todayShloka && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>TODAY'S WISDOM</Text>
            <LinearGradient colors={['#FEF3E2', '#FDE8C2']} style={styles.shlokaCard}>
              <View style={styles.shlokaHeader}>
                <Text style={styles.shlokaRef}>BG {todayShloka.chapter}.{todayShloka.verse}</Text>
                <TouchableOpacity onPress={() => toggleBookmark(todayShloka.id)}>
                  <Text style={styles.bookmarkIcon}>
                    {isBookmarked(todayShloka.id) ? '🔖' : '🏷️'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.chapterTag}>{todayShloka.chapterTitle}</Text>
              <Text style={styles.sanskrit}>{todayShloka.sanskrit}</Text>
              <View style={styles.divider} />
              <Text style={styles.translation}>{todayShloka.english}</Text>
              {!!todayShloka.lifeApplication && (
                <Text style={styles.application}>{todayShloka.lifeApplication}</Text>
              )}
            </LinearGradient>
          </View>
        )}

        {/* Mood Check-in */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>HOW ARE YOU FEELING?</Text>
          <View style={styles.moodCard}>
            <Text style={styles.moodPrompt}>Your mood shapes the wisdom you need</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.moodRow}>
                {MOODS.map(mood => (
                  <TouchableOpacity
                    key={mood.id}
                    style={[
                      styles.moodBtn,
                      todayMoodEntry?.mood === mood.id && { backgroundColor: mood.color + '33', borderColor: mood.color },
                    ]}
                    onPress={() => logMood(mood.id)}
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text style={styles.moodLabel}>{mood.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>EXPLORE</Text>
          <View style={styles.actionsGrid}>
            {[
              { emoji: '🪈', label: 'Ask Krishna', desc: 'AI Guide', screen: 'guide' },
              { emoji: '📖', label: 'Library', desc: 'All Shlokas', screen: 'explore' },
              { emoji: '🧘', label: 'Reflect', desc: 'My Space', screen: 'reflect' },
              { emoji: '🔖', label: 'Bookmarks', desc: `${bookmarks.length} saved`, screen: 'reflect' },
              { emoji: '📝', label: 'Journal', desc: `${journal.length} entries`, screen: 'reflect' },
              { emoji: '🛕', label: 'Shop', desc: 'Spiritual', screen: 'shop' },
            ].map(item => (
              <TouchableOpacity
                key={item.label}
                style={styles.actionCard}
                onPress={() => router.push(`/(tabs)/${item.screen}`)}
                activeOpacity={0.8}
              >
                <Text style={styles.actionEmoji}>{item.emoji}</Text>
                <Text style={styles.actionLabel}>{item.label}</Text>
                <Text style={styles.actionDesc}>{item.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Journey Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>YOUR JOURNEY</Text>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{streak.current}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{bookmarks.length}</Text>
              <Text style={styles.statLabel}>Bookmarks</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{journal.length}</Text>
              <Text style={styles.statLabel}>Journal</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{Object.keys(notes).length}</Text>
              <Text style={styles.statLabel}>Notes</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  headerSub: {
    fontSize: 12,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3E2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  streakFire: { fontSize: 14 },
  streakNum: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  scroll: { flex: 1 },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  shlokaCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shlokaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  shlokaRef: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  bookmarkIcon: { fontSize: 20 },
  chapterTag: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  sanskrit: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 26,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 14,
  },
  translation: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  application: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  moodCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  moodPrompt: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  moodRow: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 4,
  },
  moodBtn: {
    alignItems: 'center',
    backgroundColor: Colors.bg,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 64,
  },
  moodEmoji: { fontSize: 22 },
  moodLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionCard: {
    width: '30%',
    flexGrow: 1,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 90,
  },
  actionEmoji: { fontSize: 26, marginBottom: 6 },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  actionDesc: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  statsCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
});
