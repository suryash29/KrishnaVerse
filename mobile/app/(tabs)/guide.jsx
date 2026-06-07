import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getAIResponse, getShlokaById } from '../../constants/Shlokas';
import { Colors } from '../../constants/Colors';
import { useApp } from '../../context/AppContext';

const QUICK_PROMPTS = [
  'I feel overwhelmed',
  'Career confusion',
  'Anger issues',
  'Feeling lost',
  'Need discipline',
  'Fear of failure',
];

export default function GuideScreen() {
  const [messages, setMessages] = useState([
    {
      id: '0',
      from: 'bot',
      text: 'Namaste 🙏 I am here to help you find wisdom from the Bhagavad Gita.\n\nAsk me about anything — stress, relationships, career, fear, anger, or seeking meaning. I will guide you with Krishna\'s eternal teachings.\n\nWhat is troubling your heart today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const flatRef = useRef(null);
  const { toggleBookmark, isBookmarked } = useApp();

  function send(text) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    const userMsg = { id: Date.now().toString(), from: 'user', text: msg };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    setTimeout(() => {
      const response = getAIResponse(msg);
      const shlokas = response.shlokas
        .map(id => getShlokaById(id))
        .filter(Boolean)
        .slice(0, 2);

      const botMsg = {
        id: (Date.now() + 1).toString(),
        from: 'bot',
        text: response.reply,
        shlokas,
      };
      setMessages(prev => [...prev, botMsg]);
      setTyping(false);
    }, 1200);
  }

  function renderMessage({ item }) {
    if (item.from === 'user') {
      return (
        <View style={styles.userBubbleRow}>
          <View style={styles.userBubble}>
            <Text style={styles.userText}>{item.text}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.botRow}>
        <Text style={styles.botAvatar}>🪈</Text>
        <View style={styles.botContent}>
          <View style={styles.botBubble}>
            <Text style={styles.botText}>{item.text}</Text>
          </View>
          {item.shlokas?.map(s => (
            <View key={s.id} style={styles.shlokaCard}>
              <View style={styles.shlokaCardHeader}>
                <Text style={styles.shlokaRef}>BG {s.chapter}.{s.verse} — {s.chapterTitle}</Text>
                <TouchableOpacity onPress={() => toggleBookmark(s.id)}>
                  <Text>{isBookmarked(s.id) ? '🔖' : '🏷️'}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.shlokaText}>{s.english}</Text>
              <Text style={styles.shlokaApp}>{s.lifeApplication}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerAvatar}>🪈</Text>
        <View>
          <Text style={styles.headerTitle}>KrishnaVerse Guide</Text>
          <Text style={styles.headerSub}>Gita wisdom for your questions</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Messages */}
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={
            typing ? (
              <View style={styles.botRow}>
                <Text style={styles.botAvatar}>🪈</Text>
                <View style={[styles.botBubble, styles.typingBubble]}>
                  <Text style={styles.botText}>Reflecting on the Gita... ✨</Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* Quick Prompts */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickScroll}
          contentContainerStyle={styles.quickContent}
        >
          {QUICK_PROMPTS.map(p => (
            <TouchableOpacity key={p} style={styles.quickBtn} onPress={() => send(p)}>
              <Text style={styles.quickText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Share what's on your heart..."
            placeholderTextColor={Colors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={300}
            returnKeyType="send"
            onSubmitEditing={() => send()}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={() => send()}
            disabled={!input.trim()}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  headerAvatar: { fontSize: 32 },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  headerSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  messageList: {
    padding: 16,
    paddingBottom: 8,
    gap: 16,
  },
  userBubbleRow: {
    alignItems: 'flex-end',
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
  },
  userText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  botRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  botAvatar: { fontSize: 24, marginTop: 4 },
  botContent: { flex: 1, gap: 10 },
  botBubble: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typingBubble: { opacity: 0.7 },
  botText: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
  shlokaCard: {
    backgroundColor: '#FEF3E2',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shlokaCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  shlokaRef: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    flex: 1,
  },
  shlokaText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 8,
  },
  shlokaApp: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  quickScroll: {
    maxHeight: 48,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  quickContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  quickBtn: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bg,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.border },
  sendIcon: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
