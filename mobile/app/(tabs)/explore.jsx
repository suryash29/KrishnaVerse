import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, Modal, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SHLOKAS, CHAPTERS, searchShlokas } from '../../constants/Shlokas';
import { Colors } from '../../constants/Colors';
import { useApp } from '../../context/AppContext';

const TABS = ['Chapters', 'All Shlokas', 'Search'];

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState('Chapters');
  const [query, setQuery] = useState('');
  const [selectedShloka, setSelectedShloka] = useState(null);
  const { toggleBookmark, isBookmarked } = useApp();

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchShlokas(query.trim());
  }, [query]);

  function ShlokaItem({ item }) {
    return (
      <TouchableOpacity style={styles.shlokaItem} onPress={() => setSelectedShloka(item)} activeOpacity={0.8}>
        <View style={styles.shlokaItemHeader}>
          <Text style={styles.shlokaRef}>BG {item.chapter}.{item.verse}</Text>
          <TouchableOpacity onPress={() => toggleBookmark(item.id)}>
            <Text style={{ fontSize: 16 }}>{isBookmarked(item.id) ? '🔖' : '🏷️'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.shlokaChapter}>{item.chapterTitle}</Text>
        <Text style={styles.shlokaEnglish} numberOfLines={3}>{item.english}</Text>
        <View style={styles.tagRow}>
          {item.tags.slice(0, 3).map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  }

  function ChaptersView() {
    const grouped = CHAPTERS.map(ch => ({
      ...ch,
      shlokas: SHLOKAS.filter(s => s.chapter === ch.num),
    }));
    return (
      <FlatList
        data={grouped}
        keyExtractor={item => item.num.toString()}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chapterCard}
            onPress={() => {
              if (item.shlokas.length > 0) setSelectedShloka(item.shlokas[0]);
            }}
            activeOpacity={0.85}
          >
            <View style={styles.chapterNumBadge}>
              <Text style={styles.chapterNum}>{item.num}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.chapterTitle}>{item.title}</Text>
              <Text style={styles.chapterSub}>{item.subtitle}</Text>
              {item.shlokas.length > 0 && (
                <Text style={styles.chapterCount}>{item.shlokas.length} shloka{item.shlokas.length !== 1 ? 's' : ''} available</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSub}>Bhagavad Gita Library</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search input always visible in Search tab */}
      {activeTab === 'Search' && (
        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search shlokas, topics, chapters..."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={{ color: Colors.textMuted, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Content */}
      {activeTab === 'Chapters' && <ChaptersView />}

      {activeTab === 'All Shlokas' && (
        <FlatList
          data={SHLOKAS}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
          renderItem={({ item }) => <ShlokaItem item={item} />}
        />
      )}

      {activeTab === 'Search' && (
        <FlatList
          data={query.trim() ? searchResults : []}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
          renderItem={({ item }) => <ShlokaItem item={item} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>{query.trim() ? '🔍' : '📖'}</Text>
              <Text style={styles.emptyText}>
                {query.trim() ? 'No results found' : 'Start typing to search'}
              </Text>
            </View>
          }
        />
      )}

      {/* Shloka Detail Modal */}
      <Modal
        visible={!!selectedShloka}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedShloka(null)}
      >
        {selectedShloka && (
          <SafeAreaView style={styles.modalSafe} edges={['top']}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedShloka(null)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalRef}>BG {selectedShloka.chapter}.{selectedShloka.verse}</Text>
              <TouchableOpacity onPress={() => toggleBookmark(selectedShloka.id)}>
                <Text style={{ fontSize: 22 }}>{isBookmarked(selectedShloka.id) ? '🔖' : '🏷️'}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalChapter}>{selectedShloka.chapterTitle}</Text>
              <Text style={styles.modalSanskrit}>{selectedShloka.sanskrit}</Text>
              <Text style={styles.modalTranslit}>{selectedShloka.transliteration}</Text>
              <View style={styles.modalDivider} />
              <Text style={styles.modalLabel}>ENGLISH</Text>
              <Text style={styles.modalEnglish}>{selectedShloka.english}</Text>
              <Text style={styles.modalLabel}>HINDI</Text>
              <Text style={styles.modalHindi}>{selectedShloka.hindi}</Text>
              <Text style={styles.modalLabel}>CONTEXT</Text>
              <Text style={styles.modalBody}>{selectedShloka.context}</Text>
              <Text style={styles.modalLabel}>MEANING</Text>
              <Text style={styles.modalBody}>{selectedShloka.explanation}</Text>
              <Text style={styles.modalLabel}>LIFE APPLICATION</Text>
              <View style={styles.applicationBox}>
                <Text style={styles.applicationText}>{selectedShloka.lifeApplication}</Text>
              </View>
              <View style={styles.tagRow}>
                {selectedShloka.tags.map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
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
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: { color: '#fff', fontWeight: '700' },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 4,
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    gap: 10,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
  },
  shlokaItem: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shlokaItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  shlokaRef: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  shlokaChapter: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  shlokaEnglish: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: Colors.accentSoft,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
  },
  chapterCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  chapterNumBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterNum: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  chapterTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  chapterSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  chapterCount: {
    fontSize: 11,
    color: Colors.primary,
    marginTop: 4,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyIcon: { fontSize: 48 },
  emptyText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  // Modal
  modalSafe: { flex: 1, backgroundColor: Colors.bg },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalClose: {
    fontSize: 20,
    color: Colors.textMuted,
    padding: 4,
  },
  modalRef: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  modalContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 12,
  },
  modalChapter: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  modalSanskrit: {
    fontSize: 18,
    color: Colors.text,
    lineHeight: 30,
    fontWeight: '500',
  },
  modalTranslit: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  modalDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
    marginTop: 8,
  },
  modalEnglish: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  modalHindi: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  modalBody: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  applicationBox: {
    backgroundColor: '#FEF3E2',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  applicationText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
});
