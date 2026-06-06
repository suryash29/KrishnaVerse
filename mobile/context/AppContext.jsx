import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { loadUserData, saveUserData, mergeCloudIntoState } from '../services/cloud';

const AppContext = createContext(null);
const STORAGE_KEY = 'krishnaverse_v1';

const defaultState = {
  darkMode: false,
  language: 'en',
  bookmarks: [],
  notes: {},
  journal: [],
  moodHistory: [],
  streak: { current: 0, best: 0, lastDate: null },
  todayMood: null,
};

export function AppProvider({ children }) {
  const { user } = useAuth();
  const [state, setState] = useState(defaultState);
  const [loaded, setLoaded] = useState(false);
  const [cloudSynced, setCloudSynced] = useState(false);
  const cloudTimer = useRef(null);

  // Load from local storage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) {
        try {
          const saved = JSON.parse(raw);
          setState(prev => ({ ...prev, ...saved }));
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  // Persist locally on every state change
  useEffect(() => {
    if (!loaded) return;
    const { darkMode, language, bookmarks, notes, journal, moodHistory, streak } = state;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      darkMode, language, bookmarks, notes, journal, moodHistory, streak
    })).catch(() => {});
  }, [state, loaded]);

  // When the signed-in user changes, pull their cloud data and merge it
  // into local state (union — never lose local-only entries).
  useEffect(() => {
    if (!user) { setCloudSynced(false); return; }
    if (!loaded) return;
    let active = true;
    (async () => {
      const cloud = await loadUserData(user.uid);
      if (!active) return;
      if (cloud) setState(prev => mergeCloudIntoState(prev, cloud));
      setCloudSynced(true);
    })();
    return () => { active = false; };
  }, [user, loaded]);

  // Mirror state to the cloud (debounced) once synced and signed in.
  useEffect(() => {
    if (!loaded || !user || !cloudSynced) return;
    if (cloudTimer.current) clearTimeout(cloudTimer.current);
    const { darkMode, language, bookmarks, notes, journal, moodHistory, streak } = state;
    cloudTimer.current = setTimeout(() => {
      saveUserData(user.uid, { darkMode, language, bookmarks, notes, journal, moodHistory, streak });
    }, 1200);
    return () => { if (cloudTimer.current) clearTimeout(cloudTimer.current); };
  }, [state, loaded, user, cloudSynced]);

  function update(partial) {
    setState(prev => ({ ...prev, ...partial }));
  }

  // Streak logic
  function updateStreak() {
    const today = new Date().toDateString();
    const { streak } = state;
    if (streak.lastDate === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const current = streak.lastDate === yesterday ? streak.current + 1 : 1;
    const best = Math.max(current, streak.best);
    update({ streak: { current, best, lastDate: today } });
  }

  // Bookmarks
  function toggleBookmark(shlokaId) {
    const bookmarks = state.bookmarks.includes(shlokaId)
      ? state.bookmarks.filter(id => id !== shlokaId)
      : [...state.bookmarks, shlokaId];
    update({ bookmarks });
  }

  function isBookmarked(shlokaId) {
    return state.bookmarks.includes(shlokaId);
  }

  // Notes
  function saveNote(shlokaId, text) {
    update({ notes: { ...state.notes, [shlokaId]: text } });
  }

  // Mood
  function logMood(moodId) {
    const today = new Date().toDateString();
    const history = state.moodHistory.filter(m => m.date !== today);
    update({
      moodHistory: [{ date: today, mood: moodId }, ...history].slice(0, 90),
      todayMood: moodId,
    });
  }

  // Journal
  function addJournalEntry(text, mood) {
    const entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood,
      text,
    };
    update({ journal: [entry, ...state.journal] });
  }

  function deleteJournalEntry(id) {
    update({ journal: state.journal.filter(e => e.id !== id) });
  }

  return (
    <AppContext.Provider value={{
      ...state,
      loaded,
      update,
      updateStreak,
      toggleBookmark,
      isBookmarked,
      saveNote,
      logMood,
      addJournalEntry,
      deleteJournalEntry,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
