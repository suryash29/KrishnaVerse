import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, Pressable, StyleSheet, Modal,
  TextInput, ScrollView, Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { useApp } from '../context/AppContext';

// Japa Mala — digital chant counter. One round = 108 beads.
// First principles: count must be effortless (one big tap + instant haptic),
// and the sacred unit of 108 gets an honoured round + a small celebration.
const JAPA_MALA = 108;
const MANTRAS = {
  radhe:    { dev: 'राधे राधे',              tr: 'Rādhe Rādhe',                  en: 'Radha Naam' },
  hare:     { dev: 'हरे कृष्ण हरे कृष्ण',     tr: 'Hare Krishna Mahā-mantra',     en: 'Hare Krishna' },
  vasudev:  { dev: 'ॐ नमो भगवते वासुदेवाय', tr: 'Om Namo Bhagavate Vāsudevāya', en: 'Dvādaśākṣarī' },
  sharanam: { dev: 'श्री कृष्ण शरणं मम',     tr: 'Śrī Kṛṣṇa Śaraṇaṁ Mama',       en: 'Sharanam' },
  custom:   { dev: '', tr: '', en: 'Custom' },
};
const PRESETS = ['radhe', 'hare', 'vasudev', 'sharanam', 'custom'];

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function JapaSheet({ visible, onClose }) {
  const { japa, update, language } = useApp();
  const hi = language === 'hi';
  const j = japa || { mantra: 'radhe', customText: '', todayCount: 0, totalCount: 0, lastDate: null, haptic: true, sound: true };

  const [celebrate, setCelebrate] = useState('');
  const scale = useState(new Animated.Value(1))[0];
  const celebOpacity = useState(new Animated.Value(0))[0];

  // Daily reset when the sheet opens on a new day.
  useEffect(() => {
    if (!visible) return;
    const today = todayKey();
    if (j.lastDate !== today) {
      update({ japa: { ...j, todayCount: 0, lastDate: today } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const inRound = j.todayCount % JAPA_MALA;
  const roundsToday = Math.floor(j.todayCount / JAPA_MALA);
  const frac = inRound === 0 && j.todayCount > 0 ? 1 : inRound / JAPA_MALA;
  const m = j.mantra === 'custom'
    ? { dev: (j.customText || '').trim() || (hi ? 'अपना मंत्र लिखें' : 'Enter your mantra'), tr: '' }
    : (MANTRAS[j.mantra] || MANTRAS.radhe);

  function buzz(style) {
    if (j.haptic === false) return;
    try { Haptics.impactAsync(style || Haptics.ImpactFeedbackStyle.Light); } catch {}
  }
  function buzzSuccess() {
    if (j.haptic === false) return;
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
  }

  function count() {
    const today = todayKey();
    const base = j.lastDate === today ? j : { ...j, todayCount: 0, lastDate: today };
    const todayCount = base.todayCount + 1;
    const totalCount = (base.totalCount || 0) + 1;
    const completed = todayCount % JAPA_MALA === 0;
    update({ japa: { ...base, todayCount, totalCount, lastDate: today } });

    Animated.sequence([
      Animated.timing(scale, { toValue: 0.94, duration: 70, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 90, useNativeDriver: true }),
    ]).start();

    if (completed) {
      buzzSuccess();
      const rounds = Math.floor(todayCount / JAPA_MALA);
      setCelebrate(hi ? `🌼 ${rounds} माला पूर्ण! राधे राधे 🙏` : `🌼 Mala ${rounds} complete! Radhe Radhe 🙏`);
      celebOpacity.setValue(0);
      Animated.timing(celebOpacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
      setTimeout(() => {
        Animated.timing(celebOpacity, { toValue: 0, duration: 350, useNativeDriver: true }).start(() => setCelebrate(''));
      }, 2400);
    } else {
      buzz(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  function undo() {
    if (j.todayCount <= 0 && (j.totalCount || 0) <= 0) return;
    update({ japa: { ...j, todayCount: Math.max(0, j.todayCount - 1), totalCount: Math.max(0, (j.totalCount || 0) - 1) } });
  }
  function resetToday() { update({ japa: { ...j, todayCount: 0, lastDate: todayKey() } }); }
  function setMantra(key) { update({ japa: { ...j, mantra: key } }); }
  function setCustom(text) { update({ japa: { ...j, customText: text } }); }
  function toggleHaptic() { update({ japa: { ...j, haptic: j.haptic === false } }); }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingBottom: 10 }}>
            <View style={styles.handle} />
            <Text style={styles.title}>{hi ? '📿 जप माला' : '📿 Japa Mala'}</Text>

            <View style={styles.chipRow}>
              {PRESETS.map(k => (
                <TouchableOpacity key={k} style={[styles.chip, j.mantra === k && styles.chipActive]} onPress={() => setMantra(k)}>
                  <Text style={[styles.chipText, j.mantra === k && styles.chipTextActive]}>
                    {k === 'custom' ? (hi ? 'अपना मंत्र' : 'Custom') : MANTRAS[k].dev}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {j.mantra === 'custom' && (
              <TextInput
                style={styles.customInput}
                value={j.customText}
                onChangeText={setCustom}
                maxLength={60}
                placeholder={hi ? 'अपना मंत्र यहाँ लिखें…' : 'Type your mantra…'}
                placeholderTextColor="#B98A55"
              />
            )}

            <Pressable onPress={count} style={styles.beadTouch}>
              <Animated.View style={{ transform: [{ scale }] }}>
                <LinearGradient colors={['#FFFBF4', '#F6C98A', '#D98A3A']} start={{ x: 0.3, y: 0.2 }} end={{ x: 0.8, y: 1 }} style={styles.bead}>
                  <Text style={styles.beadDev}>{m.dev}</Text>
                  {!!m.tr && <Text style={styles.beadTr}>{m.tr}</Text>}
                  <Text style={styles.beadCount}>{inRound}</Text>
                  <Text style={styles.beadOf}>{hi ? 'में से 108' : 'of 108'}</Text>
                  <Text style={styles.tapHint}>{hi ? 'जप करने के लिए स्पर्श करें' : 'tap to chant'}</Text>
                </LinearGradient>
              </Animated.View>
              {!!celebrate && (
                <Animated.View style={[styles.celebrate, { opacity: celebOpacity }]}>
                  <Text style={styles.celebrateText}>{celebrate}</Text>
                </Animated.View>
              )}
            </Pressable>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.round(frac * 100)}%` }]} />
            </View>

            <View style={styles.statsRow}>
              <Stat num={roundsToday} label={hi ? 'आज की मालाएँ' : 'Rounds today'} />
              <Stat num={j.todayCount} label={hi ? 'आज के जप' : 'Today'} />
              <Stat num={j.totalCount || 0} label={hi ? 'कुल जप' : 'Lifetime'} />
            </View>

            <View style={styles.ctrlRow}>
              <TouchableOpacity style={styles.ctrl} onPress={toggleHaptic}>
                <Text style={styles.ctrlText}>{(j.haptic === false ? '📴' : '📳')} {hi ? 'कंपन' : 'Haptic'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ctrl} onPress={undo}>
                <Text style={styles.ctrlText}>↩︎ {hi ? 'पूर्ववत' : 'Undo'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.ctrl, styles.ctrlReset]} onPress={resetToday}>
                <Text style={[styles.ctrlText, styles.ctrlResetText]}>⟳ {hi ? 'रीसेट' : 'Reset'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>{hi ? 'बंद करें' : 'Close'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
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
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FBE8CC', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 18, paddingTop: 10, maxHeight: '94%' },
  handle: { width: 44, height: 5, borderRadius: 3, backgroundColor: 'rgba(138,75,10,0.3)', alignSelf: 'center', marginBottom: 10 },
  title: { fontSize: 18, fontWeight: '800', color: '#8A4B0A', marginBottom: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 6 },
  chip: { borderWidth: 1, borderColor: '#E7B36A', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { color: '#8A4B0A', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  customInput: { width: '100%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E7B36A', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontSize: 15, textAlign: 'center', color: '#5A3410', marginTop: 6 },
  beadTouch: { marginTop: 14, marginBottom: 6, alignItems: 'center', justifyContent: 'center' },
  bead: {
    width: 240, height: 240, borderRadius: 120, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18,
    shadowColor: '#7A3D06', shadowOpacity: 0.3, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8,
  },
  beadDev: { fontSize: 20, fontWeight: '800', color: '#7A3D06', textAlign: 'center', lineHeight: 26 },
  beadTr: { fontSize: 11, color: '#9A5A1A', fontStyle: 'italic', marginBottom: 2 },
  beadCount: { fontSize: 52, fontWeight: '800', color: '#5A2E04', lineHeight: 56 },
  beadOf: { fontSize: 12, color: '#9A5A1A', letterSpacing: 1 },
  tapHint: { fontSize: 10, color: 'rgba(122,61,6,0.6)', marginTop: 4, letterSpacing: 1.5, textTransform: 'uppercase' },
  celebrate: { position: 'absolute', alignSelf: 'center', top: '40%', backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 16, shadowColor: '#7A3D06', shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 10 },
  celebrateText: { color: '#8A4B0A', fontWeight: '800', fontSize: 15 },
  progressTrack: { width: '88%', height: 8, borderRadius: 4, backgroundColor: 'rgba(138,75,10,0.15)', marginTop: 8, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: Colors.primary },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 14, width: '100%' },
  stat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 12, paddingVertical: 8, alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  statLbl: { fontSize: 10.5, color: '#8A4B0A' },
  ctrlRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 12 },
  ctrl: { borderWidth: 1, borderColor: 'rgba(138,75,10,0.25)', backgroundColor: 'rgba(255,255,255,0.7)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  ctrlText: { color: '#8A4B0A', fontSize: 12.5, fontWeight: '600' },
  ctrlReset: { borderColor: 'rgba(192,57,43,0.3)' },
  ctrlResetText: { color: '#C0392B' },
  closeBtn: { marginTop: 16, paddingVertical: 12, alignItems: 'center', width: '100%' },
  closeText: { color: '#8A4B0A', fontWeight: '700', fontSize: 15 },
});
