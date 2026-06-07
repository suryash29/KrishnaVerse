import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Modal, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../../context/AppContext';
import { MOODS, getShlokaById } from '../../constants/Shlokas';
import { Colors } from '../../constants/Colors';

const TABS = ['Reflect', 'Bookmarks', 'Notes', 'Progress'];

const REFLECTION_PROMPTS = [
  "What is the most important duty you are avoiding today?",
  "Where are you seeking happiness in things that are temporary?",
  "What would your wisest, most fearless self do right now?",
];

export default function ReflectScreen() {
  const [activeTab, setActiveTab] = useState('Reflect');
  const [journalText, setJournalText] = useState('');
  const [journalMood, setJournalMood] = useState(null);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [reflectStep, setReflectStep] = useState(0);
  const [reflectAnswers, setReflectAnswers] = useState(['', '', '']);

  const {
    moodHistory, logMood, journal, addJournalEntry, deleteJournalEntry,
    bookmarks, notes, streak, darkMode,
  } = useApp();

  const todayMood = moodHistory.find(m => m.date === new Date().toDateString());
  const bookmarkedShlokas = bookmarks.map(id => getShlokaById(id)).filter(Boolean);

  function saveJournal() {
    if (!journalText.trim()) {
      Alert.alert('Empty Entry', 'Please write something first.');
      return;
    }
    addJournalEntry(journalText.trim(), journalMood);
    setJournalText('');
    setJournalMood(null);
    setShowJournalModal(false);
  }

  function ReflectTab() {
    return (
      <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
        {/* Mood */}
        <Text style={styles.sectionLabel}>MOOD JOURNAL</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How is your heart today?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.moodRow}>
              {MOODS.map(mood => (
                <TouchableOpacity
                  key={mood.id}
                  style={[
                    styles.moodBtn,
                    todayMood?.mood === mood.id && { backgroundColor: mood.color + '22', borderColor: mood.color },
                  ]}
                  onPress={() => logMood(mood.id)}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          {/* Mood history */}
          {moodHistory.slice(0, 7).length > 0 && (
            <View style={styles.historyRow}>
              {moodHistory.slice(0, 7).map((m, i) => {
                const mood = MOODS.find(mo => mo.id === m.mood);
                return mood ? (
                  <Text key={i} style={styles.historyEmoji}>{mood.emoji}</Text>
                ) : null;
              })}
              <Text style={styles.historyLabel}>Last 7 days</Text>
            </View>
          )}
        </View>

        {/* Guided Reflection */}
        <Text style={styles.sectionLabel}>GUIDED REFLECTION</Text>
        <View style={styles.card}>
          <Text style={styles.reflectIcon}>🧘</Text>
          <Text style={styles.cardTitle}>Daily Reflection</Text>
          <View style={styles.reflectStep}>
            <Text style={styles.reflectStepNum}>{reflectStep + 1} of 3</Text>
            <Text style={styles.reflectQuestion}>{REFLECTION_PROMPTS[reflectStep]}</Text>
            <TextInput
              style={styles.reflectInput}
              placeholder="Write your answer..."
              placeholderTextColor={Colors.textMuted}
              value={reflectAnswers[reflectStep]}
              onChangeText={text => {
                const updated = [...reflectAnswers];
                updated[reflectStep] = text;
                setReflectAnswers(updated);
              }}
              multiline
              numberOfLines={3}
            />
          </View>
          <View style={styles.reflectBtns}>
            {reflectStep > 0 && (
              <TouchableOpacity style={styles.outlineBtn} onPress={() => setReflectStep(v => v - 1)}>
                <Text style={styles.outlineBtnText}>← Back</Text>
              </TouchableOpacity>
            )}
            {reflectStep < 2 ? (
              <TouchableOpacity style={styles.primaryBtn} onPress={() => setReflectStep(v => v + 1)}>
                <Text style={styles.primaryBtnText}>Next →</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => {
                  Alert.alert('Reflection Complete 🙏', 'Your daily reflection is done. Jai Shri Krishna!');
                  setReflectStep(0);
                  setReflectAnswers(['', '', '']);
                }}
              >
                <Text style={styles.primaryBtnText}>Complete ✓</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Journal */}
        <Text style={styles.sectionLabel}>PERSONAL JOURNAL</Text>
        <TouchableOpacity
          style={styles.newEntryBtn}
          onPress={() => setShowJournalModal(true)}
        >
          <Text style={styles.newEntryText}>+ New Journal Entry</Text>
        </TouchableOpacity>
        {journal.slice(0, 5).map(entry => {
          const mood = MOODS.find(m => m.id === entry.mood);
          return (
            <View key={entry.id} style={styles.journalEntry}>
              <View style={styles.journalHeader}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  {mood && <Text>{mood.emoji}</Text>}
                  <Text style={styles.journalDate}>
                    {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => Alert.alert('Delete?', 'Remove this journal entry?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => deleteJournalEntry(entry.id) },
                ])}>
                  <Text style={{ color: Colors.textMuted, fontSize: 12 }}>Delete</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.journalText} numberOfLines={4}>{entry.text}</Text>
            </View>
          );
        })}
      </ScrollView>
    );
  }

  function BookmarksTab() {
    if (bookmarkedShlokas.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔖</Text>
          <Text style={styles.emptyTitle}>No bookmarks yet</Text>
          <Text style={styles.emptyText}>Tap the bookmark icon on any shloka</Text>
        </View>
      );
    }
    return (
      <ScrollView contentContainerStyle={styles.tabContent}>
        {bookmarkedShlokas.map(s => (
          <View key={s.id} style={styles.card}>
            <Text style={styles.shlokaRef}>BG {s.chapter}.{s.verse}</Text>
            <Text style={styles.shlokaChapter}>{s.chapterTitle}</Text>
            <Text style={styles.shlokaText}>{s.english}</Text>
          </View>
        ))}
      </ScrollView>
    );
  }

  function NotesTab() {
    const entries = Object.entries(notes).filter(([, v]) => v.trim());
    if (entries.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>No notes yet</Text>
          <Text style={styles.emptyText}>Add notes while reading shlokas in Explore</Text>
        </View>
      );
    }
    return (
      <ScrollView contentContainerStyle={styles.tabContent}>
        {entries.map(([id, text]) => {
          const s = getShlokaById(id);
          return (
            <View key={id} style={styles.card}>
              {s && <Text style={styles.shlokaRef}>BG {s.chapter}.{s.verse} — {s.chapterTitle}</Text>}
              <Text style={styles.noteText}>{text}</Text>
            </View>
          );
        })}
      </ScrollView>
    );
  }

  function ProgressTab() {
    const badges = [
      { emoji: '🌅', label: 'First Dawn', desc: 'Opened the app', unlocked: true },
      { emoji: '🔥', label: '7-Day Streak', desc: '7 days in a row', unlocked: streak.current >= 7 },
      { emoji: '📖', label: 'Reader', desc: 'Read 5 shlokas', unlocked: bookmarks.length >= 5 },
      { emoji: '🔖', label: 'Collector', desc: '10 bookmarks', unlocked: bookmarks.length >= 10 },
      { emoji: '✍️', label: 'Journaler', desc: '5 journal entries', unlocked: journal.length >= 5 },
      { emoji: '🧘', label: 'Seeker', desc: '30-day streak', unlocked: streak.current >= 30 },
    ];
    return (
      <ScrollView contentContainerStyle={styles.tabContent}>
        {/* Streak */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Streak Progress</Text>
          <View style={styles.streakRow}>
            <View style={styles.streakStat}>
              <Text style={styles.streakNum}>{streak.current}</Text>
              <Text style={styles.streakLabel}>Current</Text>
            </View>
            <View style={styles.streakStat}>
              <Text style={styles.streakNum}>{streak.best}</Text>
              <Text style={styles.streakLabel}>Best Ever</Text>
            </View>
            <View style={styles.streakStat}>
              <Text style={styles.streakNum}>{journal.length}</Text>
              <Text style={styles.streakLabel}>Journal</Text>
            </View>
            <View style={styles.streakStat}>
              <Text style={styles.streakNum}>{bookmarks.length}</Text>
              <Text style={styles.streakLabel}>Saved</Text>
            </View>
          </View>
        </View>

        {/* Badges */}
        <Text style={styles.sectionLabel}>ACHIEVEMENTS</Text>
        <View style={styles.badgesGrid}>
          {badges.map(badge => (
            <View key={badge.label} style={[styles.badge, !badge.unlocked && styles.badgeLocked]}>
              <Text style={[styles.badgeEmoji, !badge.unlocked && { opacity: 0.3 }]}>{badge.emoji}</Text>
              <Text style={[styles.badgeLabel, !badge.unlocked && { color: Colors.textMuted }]}>{badge.label}</Text>
              <Text style={styles.badgeDesc}>{badge.desc}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Space</Text>
        <Text style={styles.headerSub}>Reflection & Bookmarks</Text>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBarScroll}>
        <View style={styles.tabBar}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {activeTab === 'Reflect' && <ReflectTab />}
      {activeTab === 'Bookmarks' && <BookmarksTab />}
      {activeTab === 'Notes' && <NotesTab />}
      {activeTab === 'Progress' && <ProgressTab />}

      {/* Journal Modal */}
      <Modal
        visible={showJournalModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowJournalModal(false)}
      >
        <SafeAreaView style={styles.modalSafe} edges={['top']}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowJournalModal(false)}>
              <Text style={styles.modalClose}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Journal Entry</Text>
            <TouchableOpacity onPress={saveJournal}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.sectionLabel}>HOW ARE YOU FEELING?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.moodRow}>
                {MOODS.slice(0, 6).map(mood => (
                  <TouchableOpacity
                    key={mood.id}
                    style={[styles.moodBtn, journalMood === mood.id && { backgroundColor: mood.color + '22', borderColor: mood.color }]}
                    onPress={() => setJournalMood(mood.id)}
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text style={styles.moodLabel}>{mood.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <TextInput
              style={styles.journalInput}
              placeholder="Write your thoughts, reflections, and feelings here..."
              placeholderTextColor={Colors.textMuted}
              value={journalText}
              onChangeText={setJournalText}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
              autoFocus
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    padding: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  headerSub: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  tabBarScroll: { maxHeight: 52, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  tabBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabBtnText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  tabBtnTextActive: { color: '#fff', fontWeight: '700' },
  tabContent: { padding: 16, gap: 12, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  moodRow: { flexDirection: 'row', gap: 10 },
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
  moodLabel: { fontSize: 10, color: Colors.textSecondary, marginTop: 4, fontWeight: '500' },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  historyEmoji: { fontSize: 18 },
  historyLabel: { fontSize: 11, color: Colors.textMuted, marginLeft: 4 },
  reflectIcon: { fontSize: 32, textAlign: 'center' },
  reflectStep: { gap: 10 },
  reflectStepNum: { fontSize: 11, color: Colors.primary, fontWeight: '700', letterSpacing: 0.5 },
  reflectQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 24,
  },
  reflectInput: {
    backgroundColor: Colors.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  reflectBtns: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  outlineBtn: {
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outlineBtnText: { color: Colors.textSecondary, fontWeight: '600', fontSize: 14 },
  newEntryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  newEntryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  journalEntry: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  journalDate: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
  journalText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  // Bookmarks / Notes
  shlokaRef: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  shlokaChapter: { fontSize: 11, color: Colors.textMuted },
  shlokaText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20, fontStyle: 'italic' },
  noteText: { fontSize: 14, color: Colors.text, lineHeight: 20 },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 80,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  emptyText: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
  // Progress
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  streakStat: { alignItems: 'center' },
  streakNum: { fontSize: 24, fontWeight: '700', color: Colors.primary },
  streakLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badge: {
    width: '30%',
    flexGrow: 1,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  badgeLocked: { opacity: 0.6 },
  badgeEmoji: { fontSize: 28 },
  badgeLabel: { fontSize: 12, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  badgeDesc: { fontSize: 10, color: Colors.textMuted, textAlign: 'center' },
  // Modal
  modalSafe: { flex: 1, backgroundColor: Colors.bg },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },
  modalClose: { color: Colors.textMuted, fontSize: 15 },
  modalSave: { color: Colors.primary, fontSize: 15, fontWeight: '700' },
  journalInput: {
    marginTop: 16,
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    minHeight: 200,
    textAlignVertical: 'top',
  },
});
