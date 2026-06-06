import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as Speech from 'expo-speech';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { Colors } from '../constants/Colors';
import { CHAPTER_AUDIO } from '../constants/Config';
import { VERSE_AUDIO } from '../constants/VerseAudioMap';
import { useApp } from '../context/AppContext';

// Verse audio: free device TTS read-aloud for everyone + Premium authentic
// chapter recitation (streamed from a configured URL). First principles: the
// elder audience benefits most from HEARING the verse; TTS needs no network or
// licence and covers all 700 verses, while authentic chanting is the upgrade.
export default function VerseAudio({ shloka, onUpgrade }) {
  const { language, isPremium } = useApp();
  const hiFirst = language === 'hi';
  const [speaking, setSpeaking] = useState(false);

  // Premium chapter player state
  const soundRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Prefer authentic per-verse recitation (gita/gita), fall back to a configured
  // full-chapter recitation. Either is the Premium upgrade over free TTS.
  const verseUrl = (VERSE_AUDIO && shloka && VERSE_AUDIO[shloka.id]) || '';
  const chapterUrl = (CHAPTER_AUDIO && CHAPTER_AUDIO[shloka.chapter]) || '';
  const audioUrl = verseUrl || chapterUrl;
  const isVerseAudio = !!verseUrl;

  // Stop everything when the verse changes or component unmounts.
  useEffect(() => {
    return () => {
      Speech.stop();
      if (soundRef.current) { try { soundRef.current.remove(); } catch (e) {} soundRef.current = null; }
    };
  }, [shloka && shloka.id]);

  async function toggleSpeak() {
    if (speaking) { Speech.stop(); setSpeaking(false); return; }
    const parts = [];
    if (shloka.transliteration) parts.push({ text: shloka.transliteration.replace(/\n/g, ', '), lang: 'hi-IN' });
    if (hiFirst && shloka.hindi) parts.push({ text: shloka.hindi, lang: 'hi-IN' });
    else if (shloka.english) parts.push({ text: shloka.english, lang: 'en-IN' });
    setSpeaking(true);
    parts.forEach((p, i) => {
      Speech.speak(p.text, {
        language: p.lang,
        rate: 0.92,
        onDone: i === parts.length - 1 ? () => setSpeaking(false) : undefined,
        onStopped: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      });
    });
  }

  async function toggleChapter() {
    try {
      // Already created: just toggle play/pause (expo-audio uses synchronous
      // properties + methods instead of expo-av's async status calls).
      if (soundRef.current) {
        if (soundRef.current.playing) { soundRef.current.pause(); setPlaying(false); return; }
        soundRef.current.play(); setPlaying(true); return;
      }
      setLoading(true);
      await setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false });
      const player = createAudioPlayer({ uri: audioUrl });
      soundRef.current = player;
      player.addListener('playbackStatusUpdate', (s) => {
        if (!s || !s.isLoaded) return;
        setPlaying(!!s.playing);
        if (s.didJustFinish) setPlaying(false);
      });
      player.play();
      setPlaying(true);
    } catch (e) {
      setPlaying(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <Text style={styles.label}>{hiFirst ? 'श्रवण · AUDIO' : 'AUDIO · श्रवण'}</Text>

      {/* Free TTS read-aloud */}
      <TouchableOpacity
        style={[styles.listenBtn, speaking && styles.listenBtnOn]}
        activeOpacity={0.85}
        onPress={toggleSpeak}
      >
        <Text style={[styles.listenIco, speaking && styles.listenTxtOn]}>🔊</Text>
        <Text style={[styles.listenTxt, speaking && styles.listenTxtOn]}>
          {speaking ? (hiFirst ? 'रोकें' : 'Stop') : (hiFirst ? 'सुनें' : 'Listen')}
        </Text>
      </TouchableOpacity>

      {/* Premium authentic chapter recitation */}
      {isPremium ? (
        audioUrl ? (
          <View style={styles.premiumBox}>
            <Text style={styles.premiumTitle}>
              {isVerseAudio
                ? (hiFirst ? `श्लोक ${shloka.chapter}.${shloka.verse} का पाठ` : `Verse ${shloka.chapter}.${shloka.verse} recitation`)
                : (hiFirst ? `अध्याय ${shloka.chapter} का पाठ` : `Chapter ${shloka.chapter} recitation`)} 🪔
            </Text>
            <TouchableOpacity style={styles.playRow} activeOpacity={0.85} onPress={toggleChapter}>
              {loading ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <Text style={styles.playIco}>{playing ? '⏸' : '▶'}</Text>
              )}
              <Text style={styles.playTxt}>
                {loading ? (hiFirst ? 'लोड हो रहा है…' : 'Loading…') : playing ? (hiFirst ? 'चल रहा है' : 'Playing') : (hiFirst ? 'पाठ सुनें' : 'Play recitation')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.comingBox}>
            <Text style={styles.comingTxt}>{hiFirst
              ? `अध्याय ${shloka.chapter} का प्रामाणिक पाठ शीघ्र जोड़ा जाएगा। 🙏`
              : `Authentic recitation for Chapter ${shloka.chapter} is being added soon. 🙏`}</Text>
          </View>
        )
      ) : (
        <TouchableOpacity style={styles.lockCard} activeOpacity={0.85} onPress={onUpgrade}>
          <Text style={styles.lockIcon}>🎧</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.lockTitle}>{hiFirst ? 'प्रामाणिक पाठ सुनें' : 'Listen to authentic recitation'}</Text>
            <Text style={styles.lockSub}>{hiFirst
              ? 'शुद्ध संस्कृत उच्चारण में पूरे अध्याय का पाठ।'
              : 'Full-chapter chanting in pure Sanskrit pronunciation.'}</Text>
            <Text style={styles.lockCta}>{hiFirst ? 'प्रीमियम लें · ₹399/वर्ष →' : 'Go Premium · ₹399/year →'}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 11, fontWeight: '700', color: Colors.primary, letterSpacing: 1, marginTop: 8, marginBottom: 6 },
  listenBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start',
    backgroundColor: '#FEF3E2', borderRadius: 999, paddingVertical: 9, paddingHorizontal: 16,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 8,
  },
  listenBtnOn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  listenIco: { fontSize: 15 },
  listenTxt: { fontSize: 13, fontWeight: '700', color: Colors.text },
  listenTxtOn: { color: '#fff' },
  premiumBox: {
    backgroundColor: '#FEF3E2', borderRadius: 12, padding: 12,
    borderLeftWidth: 3, borderLeftColor: Colors.accent,
  },
  premiumTitle: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  playRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  playIco: { fontSize: 18, color: Colors.primary },
  playTxt: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  comingBox: {
    backgroundColor: '#FEF3E2', borderRadius: 12, padding: 14,
    borderLeftWidth: 3, borderLeftColor: Colors.accent,
  },
  comingTxt: { fontSize: 14, color: Colors.text, lineHeight: 22 },
  lockCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFF6E6', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#F2C879',
  },
  lockIcon: { fontSize: 26 },
  lockTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 3 },
  lockSub: { fontSize: 12, color: Colors.textMuted, lineHeight: 17, marginBottom: 6 },
  lockCta: { fontSize: 13, fontWeight: '700', color: Colors.primaryDark },
});
