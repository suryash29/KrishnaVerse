/* ═══════════════════════════════════════════════════════════
   KrishnaVerse – Main Application Logic
   Features: Navigation, AI Guide, Streaks, Bookmarks,
             Mood Tracker, Journal, Reflection, Search
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ── State ──────────────────────────────────────────────────
const STATE = {
  currentScreen: 'home',
  previousScreen: null,
  language: 'en',      // 'en' | 'hi' | 'sa'
  darkMode: false,
  bookmarks: [],       // [shlokaId, ...]
  notes: {},           // {shlokaId: text}
  journal: [],         // [{id, date, mood, text}]
  moodHistory: [],     // [{date, mood}]
  streak: { current: 0, best: 0, lastDate: null },
  todayMood: null,
  noteTarget: null,    // shlokaId for note modal
  reflectionStep: 0,
  chatHistory: [],
  initialized: false,
};

// ── Persistence ────────────────────────────────────────────
function saveState() {
  const data = {
    language: STATE.language,
    darkMode: STATE.darkMode,
    bookmarks: STATE.bookmarks,
    notes: STATE.notes,
    journal: STATE.journal,
    moodHistory: STATE.moodHistory,
    streak: STATE.streak,
  };
  try { localStorage.setItem('krishna_guide_v2', JSON.stringify(data)); } catch(e) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem('krishna_guide_v2');
    if (!raw) return;
    const d = JSON.parse(raw);
    STATE.language = d.language || 'en';
    STATE.darkMode = d.darkMode || false;
    STATE.bookmarks = d.bookmarks || [];
    STATE.notes = d.notes || {};
    STATE.journal = d.journal || [];
    STATE.moodHistory = d.moodHistory || [];
    STATE.streak = d.streak || { current: 0, best: 0, lastDate: null };
  } catch(e) {}
}

// ── Boot ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  applyTheme();
  updateLangLabel();
  updateStreakForToday();

  setTimeout(() => {
    document.getElementById('splash').style.opacity = '0';
    document.getElementById('splash').style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      document.getElementById('splash').classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');
      document.getElementById('app').style.animation = 'splash-in 0.4s ease forwards';
      STATE.initialized = true;
      renderHome();
      renderExplore();
      renderReflect();
      renderSaved();
    }, 500);
  }, 2000);

  // Enter key for chat
  document.getElementById('chatInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage();
  });

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  }
});

// ── Theme ──────────────────────────────────────────────────
function applyTheme() {
  const body = document.body;
  const icon = document.getElementById('themeIcon');
  if (STATE.darkMode) {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
    if (icon) icon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
  } else {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    if (icon) icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  }
}

function toggleTheme() {
  STATE.darkMode = !STATE.darkMode;
  applyTheme();
  saveState();
  showToast(STATE.darkMode ? '🌙 Dark mode' : '☀️ Light mode');
}

// ── Language ───────────────────────────────────────────────
const LANG_CYCLE = ['en', 'hi', 'sa'];
const LANG_LABELS = { en: 'EN', hi: 'हि', sa: 'सं' };

function cycleLanguage() {
  const idx = LANG_CYCLE.indexOf(STATE.language);
  STATE.language = LANG_CYCLE[(idx + 1) % LANG_CYCLE.length];
  updateLangLabel();
  saveState();
  if (STATE.initialized) {
    renderHome();
    showToast({ en: '🌐 English', hi: '🌐 हिंदी', sa: '🌐 संस्कृत' }[STATE.language]);
  }
}

function updateLangLabel() {
  const el = document.getElementById('langLabel');
  if (el) el.textContent = LANG_LABELS[STATE.language];
}

function getTranslation(shloka) {
  if (STATE.language === 'hi') return shloka.hindi;
  if (STATE.language === 'sa') return shloka.transliteration || shloka.sanskrit;
  return shloka.english;
}

// ── Navigation ─────────────────────────────────────────────
function navigateTo(screen) {
  if (screen === STATE.currentScreen) return;
  STATE.previousScreen = STATE.currentScreen;
  STATE.currentScreen = screen;

  // Update screens
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`screen-${screen}`);
  if (target) target.classList.add('active');

  // Update nav
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const navBtn = document.getElementById(`nav-${screen}`);
  if (navBtn) navBtn.classList.add('active');

  // Update header
  const titles = { home: 'KrishnaVerse', guide: 'Ask Krishna', explore: 'Explore', reflect: 'My Space', shop: 'Donate & Shop' };
  document.getElementById('headerTitle').textContent = titles[screen] || 'KrishnaVerse';
  document.getElementById('backBtn').style.display = 'none';

  // Screen-specific init
  if (screen === 'reflect') renderSaved();
  if (screen === 'shop') renderShop();
}

function goBack() {
  if (STATE.previousScreen) navigateTo(STATE.previousScreen);
}

// ── Streak System ──────────────────────────────────────────
function updateStreakForToday() {
  const today = todayDateStr();
  const s = STATE.streak;

  if (s.lastDate === today) {
    // Already counted today
  } else if (s.lastDate === yesterdayDateStr()) {
    s.current += 1;
    s.best = Math.max(s.best, s.current);
    s.lastDate = today;
    saveState();
  } else if (!s.lastDate) {
    s.current = 1;
    s.best = 1;
    s.lastDate = today;
    saveState();
  } else {
    // Streak broken
    s.current = 1;
    s.lastDate = today;
    saveState();
  }
}

function todayDateStr() {
  return new Date().toISOString().split('T')[0];
}
function yesterdayDateStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

// ── Home Screen ────────────────────────────────────────────
function renderHome() {
  const shloka = getTodayShloka();

  // Greeting
  const h = new Date().getHours();
  const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const greetEl = document.getElementById('greetingTime');
  if (greetEl) greetEl.textContent = greet;

  // Streak
  const streakEl = document.getElementById('streakCount');
  if (streakEl) streakEl.textContent = STATE.streak.current;

  // Daily shloka
  document.getElementById('dailyRef').textContent = `BG ${shloka.chapter}.${shloka.verse}`;
  document.getElementById('dailyChapter').textContent = `Chapter ${shloka.chapter} · ${shloka.chapterTitle}`;
  document.getElementById('dailySanskrit').textContent = shloka.sanskrit;
  document.getElementById('dailyTranslit').textContent = shloka.transliteration;
  document.getElementById('dailyTranslation').textContent = getTranslation(shloka);

  // Bookmark state
  updateDailyBookmarkBtn();

  // Mood grid
  renderMoodGrid('homeMoodGrid', (moodId) => {
    STATE.todayMood = moodId;
    recordMood(moodId);
    showToast('Mood saved 🙏');
    // Suggest shloka for mood
    const match = SHLOKAS.find(s => s.moods && s.moods.includes(moodId));
    if (match) setTimeout(() => openShlokaDetail(match), 600);
  });

  // Situation cards
  renderSituationCards();

  // Journey stats
  const jShlokas = document.getElementById('jShlokas');
  const jDays = document.getElementById('jDays');
  const jNotes = document.getElementById('jNotes');
  if (jShlokas) jShlokas.textContent = STATE.bookmarks.length;
  if (jDays) jDays.textContent = STATE.streak.best;
  if (jNotes) jNotes.textContent = STATE.journal.length + Object.keys(STATE.notes).length;

  // Achievements
  renderAchievementsRow();
}

function renderMoodGrid(containerId, onSelect) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = MOODS.map(m => `
    <button class="mood-btn${STATE.todayMood === m.id ? ' selected' : ''}" onclick="(${onSelect.toString()})('${m.id}')">
      <span class="mood-emoji">${m.emoji}</span>
      <span class="mood-label">${m.label}</span>
    </button>
  `).join('');
}

function renderSituationCards() {
  const el = document.getElementById('situationScroll');
  if (!el) return;
  el.innerHTML = WISDOM_CATEGORIES.map(c => `
    <div class="situation-card" onclick="showSituationWisdom('${c.id}')">
      <span class="sit-icon">${c.icon}</span>
      <span class="sit-label">${c.label}</span>
    </div>
  `).join('');
}

function showSituationWisdom(categoryId) {
  const cat = WISDOM_CATEGORIES.find(c => c.id === categoryId);
  const shlokas = getShlokasByCategory(categoryId);
  if (!shlokas.length) return showToast('No shlokas found for this category');
  // Show first relevant shloka
  openShlokaDetail(shlokas[0]);
}

function renderAchievementsRow() {
  const el = document.getElementById('achievementsRow');
  if (!el) return;
  const badges = getEarnedBadges();
  if (badges.length === 0) {
    el.innerHTML = '<span style="font-size:12px;color:var(--text-muted)">Keep learning to earn badges 🏆</span>';
    return;
  }
  el.innerHTML = badges.slice(0, 3).map(b => `
    <div class="achievement-badge">
      <span class="ach-icon">${b.icon}</span>
      <span class="ach-label">${b.name}</span>
    </div>
  `).join('');
}

// ── Bookmarks ──────────────────────────────────────────────
function toggleBookmark(shlokaId) {
  const idx = STATE.bookmarks.indexOf(shlokaId);
  if (idx > -1) {
    STATE.bookmarks.splice(idx, 1);
    showToast('Bookmark removed');
  } else {
    STATE.bookmarks.push(shlokaId);
    showToast('Bookmarked 🔖');
  }
  saveState();
  updateDailyBookmarkBtn();
  renderBadgeUpdate();
  return STATE.bookmarks.includes(shlokaId);
}

function toggleBookmarkDaily() {
  const shloka = getTodayShloka();
  const isNow = toggleBookmark(shloka.id);
  updateDailyBookmarkBtn();
}

function updateDailyBookmarkBtn() {
  const btn = document.getElementById('dailyBookmarkBtn');
  if (!btn) return;
  const shloka = getTodayShloka();
  const isBookmarked = STATE.bookmarks.includes(shloka.id);
  btn.classList.toggle('bookmarked', isBookmarked);
  btn.querySelector('svg path').setAttribute('fill', isBookmarked ? 'currentColor' : 'none');
}

// ── Mood Tracking ──────────────────────────────────────────
function recordMood(moodId) {
  const today = todayDateStr();
  const existing = STATE.moodHistory.findIndex(m => m.date === today);
  if (existing > -1) {
    STATE.moodHistory[existing].mood = moodId;
  } else {
    STATE.moodHistory.push({ date: today, mood: moodId });
  }
  // Keep last 30 days
  STATE.moodHistory = STATE.moodHistory.slice(-30);
  saveState();
  renderMoodHistory();
}

// ── Explore Screen ─────────────────────────────────────────
function renderExplore() {
  renderChaptersList();
  renderTopicsGrid();
  renderAllShlokasList();
}

function renderChaptersList() {
  const el = document.getElementById('chaptersList');
  if (!el) return;
  el.innerHTML = CHAPTERS.map(c => `
    <div class="chapter-card" onclick="showChapterShlokas(${c.num})">
      <div class="chapter-num">${c.num}</div>
      <div class="chapter-info">
        <div class="chapter-title">${c.title}</div>
        <div class="chapter-hindi">${c.hindi}</div>
        <div class="chapter-theme">${c.theme}</div>
      </div>
      <div class="chapter-verses">${c.verses}v</div>
    </div>
  `).join('');
}

function renderTopicsGrid() {
  const el = document.getElementById('topicsGrid');
  if (!el) return;
  el.innerHTML = WISDOM_CATEGORIES.map(c => {
    const count = getShlokasByCategory(c.id).length;
    return `
      <div class="topic-card" onclick="showTopicShlokas('${c.id}', '${c.label}')">
        <span class="topic-icon">${c.icon}</span>
        <div class="topic-label">${c.label}</div>
        <div class="topic-count">${count} shlokas</div>
      </div>
    `;
  }).join('');
}

function renderAllShlokasList() {
  const el = document.getElementById('allShlokasList');
  if (!el) return;
  el.innerHTML = SHLOKAS.map(s => renderShlokaListCard(s)).join('');
}

function renderShlokaListCard(shloka) {
  const isBookmarked = STATE.bookmarks.includes(shloka.id);
  return `
    <div class="shloka-list-card" onclick="openShlokaDetail(getShlokaById('${shloka.id}'))">
      <div class="slc-header">
        <span class="slc-ref">BG ${shloka.chapter}.${shloka.verse}</span>
        <span class="slc-bm ${isBookmarked ? 'bookmarked' : ''}">${isBookmarked ? '🔖' : '○'}</span>
      </div>
      <div class="slc-sanskrit">${shloka.sanskrit.split('\n')[0]}...</div>
      <div class="slc-english">${shloka.english}</div>
      <div class="slc-tags">${shloka.tags.slice(0, 3).map(t => `<span class="slc-tag">${t}</span>`).join('')}</div>
    </div>
  `;
}

function showChapterShlokas(chapterNum) {
  const shlokas = SHLOKAS.filter(s => s.chapter === chapterNum);
  const chapter = CHAPTERS.find(c => c.num === chapterNum);
  if (!shlokas.length) return showToast(`No shlokas loaded for Chapter ${chapterNum} yet`);
  // Show first shloka from that chapter
  openShlokaDetail(shlokas[0]);
}

function showTopicShlokas(categoryId, label) {
  const shlokas = getShlokasByCategory(categoryId);
  if (!shlokas.length) return showToast('No shlokas for this topic yet');
  openShlokaDetail(shlokas[0]);
}

// ── Search ─────────────────────────────────────────────────
let searchTimeout = null;

function handleSearch(query) {
  clearTimeout(searchTimeout);
  const clearBtn = document.getElementById('searchClear');
  const resultsEl = document.getElementById('searchResults');
  const tabsEl = document.getElementById('exploreTabs');

  if (!query.trim()) {
    clearSearch();
    return;
  }

  clearBtn.style.display = 'block';
  resultsEl.classList.remove('hidden');
  tabsEl.style.display = 'none';
  document.querySelectorAll('.exp-view').forEach(v => v.classList.add('hidden'));

  searchTimeout = setTimeout(() => {
    const results = searchShlokas(query);
    if (results.length === 0) {
      resultsEl.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><p>No results found</p><span>Try different keywords</span></div>`;
      return;
    }
    resultsEl.innerHTML = `
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">${results.length} result${results.length !== 1 ? 's' : ''}</div>
      <div class="shlokas-list">${results.map(s => renderShlokaListCard(s)).join('')}</div>
    `;
  }, 300);
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  document.getElementById('searchClear').style.display = 'none';
  document.getElementById('searchResults').classList.add('hidden');
  document.getElementById('exploreTabs').style.display = '';
  // Re-show active tab
  const activeTab = document.querySelector('.exp-tab.active');
  if (activeTab) {
    const tab = activeTab.textContent.toLowerCase().includes('chapter') ? 'chapters' :
                activeTab.textContent.toLowerCase().includes('topic') ? 'topics' : 'all';
    showExpView(tab);
  } else {
    document.getElementById('expChapters').classList.remove('hidden');
  }
}

function switchExpTab(view, btn) {
  document.querySelectorAll('.exp-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  showExpView(view);
}

function showExpView(view) {
  document.querySelectorAll('.exp-view').forEach(v => v.classList.add('hidden'));
  document.getElementById(`exp${view.charAt(0).toUpperCase() + view.slice(1)}`).classList.remove('hidden');
}

// ── Shloka Detail Modal ─────────────────────────────────────
function openShlokaDetail(shloka) {
  if (!shloka) return;
  const isBookmarked = STATE.bookmarks.includes(shloka.id);
  const hasNote = STATE.notes[shloka.id];

  const langContent = STATE.language === 'hi' ? shloka.hindi :
                      STATE.language === 'sa' ? shloka.transliteration : shloka.english;

  const wordByWordHTML = shloka.wordByWord ? `
    <div class="sd-section-label">Word by Word</div>
    <div class="sd-word-grid">
      ${shloka.wordByWord.map(w => `
        <div class="sd-word-chip">
          <span class="sdw-word">${w.w}</span>
          <span class="sdw-meaning">${w.m}</span>
        </div>
      `).join('')}
    </div>
  ` : '';

  document.getElementById('shlokaDetailBody').innerHTML = `
    <div style="padding-top:8px">
      <span class="sd-ref">BG ${shloka.chapter}.${shloka.verse}</span>
      <div class="sd-chapter">Chapter ${shloka.chapter} · ${shloka.chapterTitle} · ${shloka.chapterTitleHindi}</div>

      <div class="sd-section-label">Sanskrit</div>
      <div class="sd-sanskrit">${shloka.sanskrit}</div>
      <div class="sd-translit">${shloka.transliteration}</div>

      ${wordByWordHTML}

      <div class="sd-section-label">${STATE.language === 'hi' ? 'अनुवाद' : 'Translation'}</div>
      ${STATE.language !== 'en' ? `<div class="sd-hindi" style="margin-bottom:8px">${shloka.hindi}</div>` : ''}
      <div class="sd-translation">${shloka.english}</div>

      <div class="sd-section-label">Context</div>
      <div class="sd-box"><p>${shloka.context}</p></div>

      <div class="sd-section-label">Understanding</div>
      <div class="sd-box"><p>${shloka.explanation}</p></div>

      <div class="sd-section-label">💡 Life Application</div>
      <div class="sd-box" style="border-left-color:var(--gold)"><p>${shloka.lifeApplication}</p></div>

      ${hasNote ? `
        <div class="sd-section-label">My Note</div>
        <div class="sd-box" style="border-left-color:#4CAF50"><p style="font-style:italic">"${hasNote}"</p></div>
      ` : ''}

      <div class="sd-actions">
        <button class="sd-action-btn ${isBookmarked ? 'primary' : ''}" onclick="toggleBookmarkFromModal('${shloka.id}', this)">
          <svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" ${isBookmarked ? 'fill="currentColor"' : ''}></path></svg>
          ${isBookmarked ? 'Saved' : 'Save'}
        </button>
        <button class="sd-action-btn" onclick="openNoteModal('${shloka.id}')">
          <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Note
        </button>
        <button class="sd-action-btn" onclick="openShareModal(getShlokaById('${shloka.id}'))">
          <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          Share
        </button>
      </div>
    </div>
  `;

  document.getElementById('shlokaModal').classList.remove('hidden');
}

function closeShlokaModal(e) {
  if (!e || e.target === document.getElementById('shlokaModal')) {
    document.getElementById('shlokaModal').classList.add('hidden');
  }
}

function toggleBookmarkFromModal(shlokaId, btn) {
  const isNow = toggleBookmark(shlokaId);
  btn.classList.toggle('primary', isNow);
  btn.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" ${isNow ? 'fill="currentColor"' : ''}></path></svg>
    ${isNow ? 'Saved' : 'Save'}
  `;
}

// ── Notes ──────────────────────────────────────────────────
function openNoteModal(shlokaId) {
  STATE.noteTarget = shlokaId;
  const shloka = getShlokaById(shlokaId);
  document.getElementById('noteShlokRef').textContent = `BG ${shloka.chapter}.${shloka.verse} · ${shloka.chapterTitle}`;
  document.getElementById('noteTextarea').value = STATE.notes[shlokaId] || '';
  document.getElementById('noteModal').classList.remove('hidden');
}

function closeNoteModal(e) {
  if (!e || e.target === document.getElementById('noteModal')) {
    document.getElementById('noteModal').classList.add('hidden');
  }
}

function saveNote() {
  const text = document.getElementById('noteTextarea').value.trim();
  if (!text) {
    delete STATE.notes[STATE.noteTarget];
    showToast('Note removed');
  } else {
    STATE.notes[STATE.noteTarget] = text;
    showToast('Note saved ✏️');
  }
  saveState();
  closeNoteModal();
  // Re-render detail if same shloka still open
  const shloka = getShlokaById(STATE.noteTarget);
  if (shloka && !document.getElementById('shlokaModal').classList.contains('hidden')) {
    openShlokaDetail(shloka);
  }
}

// ── Reflect Screen ─────────────────────────────────────────
function renderReflect() {
  // Mood selector
  const moodSel = document.getElementById('reflectMoodSelector');
  if (moodSel) {
    moodSel.innerHTML = MOODS.map(m => `
      <button class="mood-btn${STATE.todayMood === m.id ? ' selected' : ''}" onclick="selectReflectMood('${m.id}')">
        <span class="mood-emoji">${m.emoji}</span>
        <span class="mood-label">${m.label}</span>
      </button>
    `).join('');
  }
  renderMoodHistory();
  renderJournalEntries();
}

function selectReflectMood(moodId) {
  STATE.todayMood = moodId;
  recordMood(moodId);
  // Update selector
  document.querySelectorAll('#reflectMoodSelector .mood-btn').forEach(b => b.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
  showToast('Mood logged 🙏');

  // Suggest shloka
  const match = SHLOKAS.find(s => s.moods && s.moods.includes(moodId));
  if (match) {
    setTimeout(() => {
      if (confirm(`Here's a shloka matched to your mood. View it?`)) {
        openShlokaDetail(match);
      }
    }, 800);
  }
}

function renderMoodHistory() {
  const el = document.getElementById('moodHistory');
  if (!el) return;
  const recent = STATE.moodHistory.slice(-7).reverse();
  if (!recent.length) {
    el.innerHTML = '<div class="mood-history-title">No mood history yet — log your first mood above!</div>';
    return;
  }
  el.innerHTML = `
    <div class="mood-history-title">Last 7 days</div>
    <div class="mood-history-row">
      ${recent.map(m => {
        const mood = MOODS.find(md => md.id === m.mood);
        if (!mood) return '';
        const dateStr = new Date(m.date).toLocaleDateString('en-IN', { month:'short', day:'numeric' });
        return `<div class="mood-history-item">
          <div class="mhi-dot" style="background:${mood.color}"></div>
          ${mood.emoji} <span>${dateStr}</span>
        </div>`;
      }).join('')}
    </div>
  `;
}

// ── Journal ────────────────────────────────────────────────
let editingJournalId = null;

function openNewJournalEntry() {
  editingJournalId = null;
  document.getElementById('journalTextarea').value = '';
  // Mini mood selector
  renderMiniMoodSelector('journalMoodSelector');
  document.getElementById('journalModal').classList.remove('hidden');
}

function renderMiniMoodSelector(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = MOODS.slice(0, 5).map(m => `
    <button class="mood-btn${STATE.todayMood === m.id ? ' selected' : ''}"
      onclick="selectJournalMood('${m.id}', this)">
      <span class="mood-emoji">${m.emoji}</span>
      <span class="mood-label">${m.label}</span>
    </button>
  `).join('');
}

function selectJournalMood(moodId, btn) {
  STATE.todayMood = moodId;
  document.querySelectorAll('#journalMoodSelector .mood-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function closeJournalModal(e) {
  if (!e || e.target === document.getElementById('journalModal')) {
    document.getElementById('journalModal').classList.add('hidden');
  }
}

function saveJournalEntry() {
  const text = document.getElementById('journalTextarea').value.trim();
  if (!text) return showToast('Write something first ✍️');

  if (editingJournalId) {
    const entry = STATE.journal.find(j => j.id === editingJournalId);
    if (entry) { entry.text = text; entry.mood = STATE.todayMood; }
  } else {
    STATE.journal.push({
      id: Date.now().toString(),
      date: todayDateStr(),
      mood: STATE.todayMood,
      text
    });
  }
  saveState();
  closeJournalModal();
  renderJournalEntries();
  showToast('Journal saved 📖');
  editingJournalId = null;
}

function renderJournalEntries() {
  const el = document.getElementById('journalEntries');
  if (!el) return;
  const entries = [...STATE.journal].reverse();
  if (!entries.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📖</div><p>No entries yet</p><span>Start your reflection journey</span></div>';
    return;
  }
  el.innerHTML = entries.map(j => {
    const mood = MOODS.find(m => m.id === j.mood);
    const dateStr = new Date(j.date).toLocaleDateString('en-IN', { weekday:'short', month:'short', day:'numeric' });
    return `
      <div class="journal-entry-card" onclick="editJournalEntry('${j.id}')">
        <div class="je-header">
          <span class="je-date">${dateStr}</span>
          <span class="je-mood">${mood ? mood.emoji : '📖'}</span>
        </div>
        <div class="je-text">${j.text}</div>
      </div>
    `;
  }).join('');
}

function editJournalEntry(id) {
  const entry = STATE.journal.find(j => j.id === id);
  if (!entry) return;
  editingJournalId = id;
  STATE.todayMood = entry.mood;
  renderMiniMoodSelector('journalMoodSelector');
  document.getElementById('journalTextarea').value = entry.text;
  document.getElementById('journalModal').classList.remove('hidden');
}

// ── Guided Reflection ──────────────────────────────────────
const REFLECTION_PROMPTS = [
  { q: "What is the most important duty you are avoiding right now?", placeholder: "Be honest with yourself..." },
  { q: "What are you most attached to that is causing you suffering?", placeholder: "Think deeply..." },
  { q: "What one action, done with full presence, would most serve your highest purpose today?", placeholder: "Write your commitment..." },
];

function startGuidedReflection() {
  STATE.reflectionStep = 0;
  const shloka = getTodayShloka();
  renderReflectionStep(shloka);
  document.getElementById('reflectionModal').classList.remove('hidden');
}

function renderReflectionStep(shloka) {
  const step = STATE.reflectionStep;
  const total = REFLECTION_PROMPTS.length;
  const prompt = REFLECTION_PROMPTS[step];

  document.getElementById('reflectionSession').innerHTML = `
    <div style="text-align:center;margin-bottom:20px">
      <div style="font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">
        Reflection ${step + 1} of ${total}
      </div>
      <div class="rs-step-indicator">
        ${Array.from({length: total}, (_, i) => `<div class="rs-dot ${i <= step ? 'active' : ''}"></div>`).join('')}
      </div>
    </div>

    <div class="rs-shloka-mini">
      <div class="rs-shloka-ref">Today · BG ${shloka.chapter}.${shloka.verse}</div>
      <div class="rs-shloka-text">${shloka.english.substring(0, 120)}...</div>
    </div>

    <div class="rs-prompt-label">Reflect</div>
    <div class="rs-prompt-q">${prompt.q}</div>

    <textarea id="rsTextarea" class="rs-textarea" placeholder="${prompt.placeholder}"></textarea>

    <button class="rs-next-btn" onclick="nextReflectionStep()">
      ${step < total - 1 ? 'Next Reflection →' : 'Complete Session ✓'}
    </button>
  `;
}

function nextReflectionStep() {
  const text = document.getElementById('rsTextarea').value.trim();
  const prompt = REFLECTION_PROMPTS[STATE.reflectionStep];

  // Save to journal if they wrote something
  if (text) {
    STATE.journal.push({
      id: Date.now().toString(),
      date: todayDateStr(),
      mood: STATE.todayMood,
      text: `[Reflection: ${prompt.q}]\n${text}`
    });
    saveState();
  }

  if (STATE.reflectionStep < REFLECTION_PROMPTS.length - 1) {
    STATE.reflectionStep++;
    renderReflectionStep(getTodayShloka());
  } else {
    // Complete
    document.getElementById('reflectionSession').innerHTML = `
      <div style="text-align:center;padding:32px 16px">
        <div style="font-size:56px;margin-bottom:16px">🙏</div>
        <div style="font-family:var(--font-serif);font-size:22px;color:white;margin-bottom:10px">
          Reflection Complete
        </div>
        <div style="font-size:14px;color:rgba(255,255,255,0.6);line-height:1.6;margin-bottom:24px">
          "The self is the friend of one who has conquered the mind." — BG 6.6
        </div>
        <button class="rs-next-btn" onclick="closeReflectionModal()">Return to Practice</button>
      </div>
    `;
    renderJournalEntries();
    showToast('Session complete 🧘 +1 streak');
  }
}

function closeReflectionModal(e) {
  if (!e || e.target === document.getElementById('reflectionModal')) {
    document.getElementById('reflectionModal').classList.add('hidden');
  }
}

// ── Saved Screen ───────────────────────────────────────────
function renderSaved() {
  renderBookmarksList();
  renderNotesList();
  renderProgressSection();
}

function switchReflectTab(tab, btn) {
  document.querySelectorAll('#screen-reflect .exp-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  // Toggle reflect content
  const reflectContent = document.getElementById('reflectContent');
  if (reflectContent) reflectContent.classList.toggle('hidden', tab !== 'reflect');
  // Toggle saved sub-sections
  ['Bookmarks', 'Notes', 'Progress'].forEach(t => {
    const el = document.getElementById(`saved${t}`);
    if (el) el.classList.toggle('hidden', t.toLowerCase() !== tab);
  });
}

// Keep alias for backward compatibility
function switchSavedTab(tab, btn) { switchReflectTab(tab, btn); }

function renderBookmarksList() {
  const el = document.getElementById('bookmarksList');
  if (!el) return;
  if (!STATE.bookmarks.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">🔖</div><p>No bookmarks yet</p><span>Tap the bookmark icon on any shloka</span></div>`;
    return;
  }
  const shlokas = STATE.bookmarks.map(id => getShlokaById(id)).filter(Boolean);
  el.innerHTML = shlokas.map(s => renderShlokaListCard(s)).join('');
}

function renderNotesList() {
  const el = document.getElementById('notesList');
  if (!el) return;
  const noteIds = Object.keys(STATE.notes);
  if (!noteIds.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">📝</div><p>No notes yet</p><span>Add notes while reading shlokas</span></div>`;
    return;
  }
  el.innerHTML = noteIds.map(id => {
    const shloka = getShlokaById(id);
    if (!shloka) return '';
    return `
      <div class="note-card" onclick="openShlokaDetail(getShlokaById('${id}'))">
        <div class="nc-ref">BG ${shloka.chapter}.${shloka.verse} · ${shloka.chapterTitle}</div>
        <div class="nc-text">${STATE.notes[id]}</div>
      </div>
    `;
  }).join('');
}

function renderProgressSection() {
  const el = document.getElementById('progressSection');
  if (!el) return;
  const badges = ALL_BADGES;
  const earned = getEarnedBadges();

  el.innerHTML = `
    <div class="progress-stats-grid">
      <div class="ps-card"><span class="ps-num">${STATE.streak.current}</span><span class="ps-label">Current Streak</span></div>
      <div class="ps-card"><span class="ps-num">${STATE.streak.best}</span><span class="ps-label">Best Streak</span></div>
      <div class="ps-card"><span class="ps-num">${STATE.bookmarks.length}</span><span class="ps-label">Bookmarks</span></div>
      <div class="ps-card"><span class="ps-num">${STATE.journal.length}</span><span class="ps-label">Journal Entries</span></div>
    </div>
    <div class="achievements-section">
      <div class="ach-title">Achievements</div>
      <div class="achievements-grid">
        ${badges.map(b => {
          const isEarned = earned.find(e => e.id === b.id);
          return `
            <div class="ach-card ${isEarned ? 'earned' : ''}">
              <div class="ach-card-icon">${b.icon}</div>
              <div class="ach-card-name">${b.name}</div>
              <div class="ach-card-desc">${b.desc}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ── Achievements ───────────────────────────────────────────
const ALL_BADGES = [
  { id: 'first_step', icon: '🌱', name: 'First Step', desc: 'Open the app' },
  { id: 'karma_yogi', icon: '⚡', name: 'Karma Yogi', desc: '5 bookmarks' },
  { id: 'jnana_seeker', icon: '📖', name: 'Jnana Seeker', desc: '10 bookmarks' },
  { id: 'bhakti_devotee', icon: '🙏', name: 'Bhakti Devotee', desc: '3-day streak' },
  { id: 'dharma_keeper', icon: '🔥', name: 'Dharma Keeper', desc: '7-day streak' },
  { id: 'arjuna_seeker', icon: '🏹', name: 'Arjuna Seeker', desc: 'First journal' },
  { id: 'reflection_yogi', icon: '🧘', name: 'Reflection Yogi', desc: '5 journals' },
  { id: 'wisdom_walker', icon: '✨', name: 'Wisdom Walker', desc: '21-day streak' },
  { id: 'gita_student', icon: '🏆', name: 'Gita Student', desc: '15 bookmarks' },
];

function getEarnedBadges() {
  const earned = [];
  if (STATE.initialized || true) earned.push(ALL_BADGES[0]); // first_step
  if (STATE.bookmarks.length >= 5) earned.push(ALL_BADGES[1]);
  if (STATE.bookmarks.length >= 10) earned.push(ALL_BADGES[2]);
  if (STATE.streak.best >= 3) earned.push(ALL_BADGES[3]);
  if (STATE.streak.best >= 7) earned.push(ALL_BADGES[4]);
  if (STATE.journal.length >= 1) earned.push(ALL_BADGES[5]);
  if (STATE.journal.length >= 5) earned.push(ALL_BADGES[6]);
  if (STATE.streak.best >= 21) earned.push(ALL_BADGES[7]);
  if (STATE.bookmarks.length >= 15) earned.push(ALL_BADGES[8]);
  return earned;
}

function renderBadgeUpdate() {
  renderAchievementsRow();
  if (STATE.currentScreen === 'reflect') renderProgressSection();
}

// ── AI Guide ───────────────────────────────────────────────
function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  appendUserMessage(text);
  showTypingIndicator();

  setTimeout(() => {
    removeTypingIndicator();
    const response = getAIResponse(text);
    appendBotMessage(response, text);
    scrollChatToBottom();
  }, 1200 + Math.random() * 800);

  scrollChatToBottom();
}

function sendQuickPrompt(text) {
  document.getElementById('chatInput').value = text;
  sendMessage();
  // Hide quick prompts after use
  document.getElementById('quickPrompts').style.display = 'none';
}

function appendUserMessage(text) {
  const el = document.createElement('div');
  el.className = 'chat-message user';
  el.innerHTML = `
    <div class="message-bubble">
      <p>${escapeHtml(text)}</p>
    </div>
  `;
  document.getElementById('chatMessages').appendChild(el);
  scrollChatToBottom();
}

function appendBotMessage(response, userText) {
  const el = document.createElement('div');
  el.className = 'chat-message bot';

  // Get referenced shlokas
  const shlokaCards = response.shlokas.slice(0, 2).map(id => {
    const s = getShlokaById(id);
    if (!s) return '';
    return `
      <div class="chat-shloka-card" onclick="openShlokaDetail(getShlokaById('${s.id}'))">
        <div class="chat-shloka-ref">📿 BG ${s.chapter}.${s.verse} · ${s.chapterTitle}</div>
        <div class="chat-shloka-text">${s.english.substring(0, 100)}...</div>
        <div class="chat-shloka-btn">Read full teaching →</div>
      </div>
    `;
  }).join('');

  el.innerHTML = `
    <div class="bot-avatar">🪈</div>
    <div class="message-bubble">
      <p>${response.reply}</p>
      ${shlokaCards}
      <p style="font-size:12px;color:var(--text-muted);margin-top:8px">
        <em>Tap any shloka to read the full teaching with life application.</em>
      </p>
    </div>
  `;
  document.getElementById('chatMessages').appendChild(el);
}

function showTypingIndicator() {
  const el = document.createElement('div');
  el.className = 'chat-message bot';
  el.id = 'typingIndicator';
  el.innerHTML = `
    <div class="bot-avatar">🪈</div>
    <div class="message-bubble">
      <div class="typing-indicator"><span></span><span></span><span></span></div>
    </div>
  `;
  document.getElementById('chatMessages').appendChild(el);
  scrollChatToBottom();
}

function removeTypingIndicator() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function scrollChatToBottom() {
  const el = document.getElementById('chatMessages');
  if (el) setTimeout(() => { el.scrollTop = el.scrollHeight; }, 50);
}

// ── Share ──────────────────────────────────────────────────
let shareTarget = null;

function shareDaily() {
  openShareModal(getTodayShloka());
}

function openShareModal(shloka) {
  shareTarget = shloka;
  document.getElementById('shareCardPreview').innerHTML = `
    <div class="scp-om">ॐ</div>
    <div class="scp-sanskrit">${shloka.sanskrit.split('\n')[0]}</div>
    <div class="scp-divider">❁</div>
    <div class="scp-english">"${shloka.english.substring(0, 140)}..."</div>
    <div class="scp-ref">— Bhagavad Gita ${shloka.chapter}.${shloka.verse}</div>
    <div class="scp-brand">KrishnaVerse App</div>
  `;
  document.getElementById('shareModal').classList.remove('hidden');
}

function closeShareModal(e) {
  if (!e || e.target === document.getElementById('shareModal')) {
    document.getElementById('shareModal').classList.add('hidden');
  }
}

function copyShareText() {
  if (!shareTarget) return;
  const text = `ॐ\n\n${shareTarget.sanskrit}\n\n"${shareTarget.english}"\n\n— Bhagavad Gita ${shareTarget.chapter}.${shareTarget.verse}\n\n🙏 KrishnaVerse App`;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard! 📋');
  }).catch(() => {
    showToast('Copy failed — try manually');
  });
}

function shareWhatsApp() {
  if (!shareTarget) return;
  const text = encodeURIComponent(`ॐ\n\n"${shareTarget.english}"\n\n— Bhagavad Gita ${shareTarget.chapter}.${shareTarget.verse}, ${shareTarget.chapterTitle}\n\n🙏 KrishnaVerse App`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

// ── Toast ──────────────────────────────────────────────────
let toastTimeout = null;

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove('show'), 2500);
}

// ── Utilities ──────────────────────────────────────────────
function escapeHtml(text) {
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Close modals on overlay click is handled in HTML onclick attrs
// Keyboard escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m => m.classList.add('hidden'));
  }
});

// ── Shop & Donate ───────────────────────────────────────────

const DONATION_CAUSES = [
  {
    id: 'goseva',
    emoji: '🐄',
    name: 'GoSeva',
    subtitle: 'Protect Sacred Cows',
    desc: 'Support our gaushala by providing shelter, food, and medical care for abandoned and injured cows. Every contribution feeds a cow for a day.',
    raised: '₹2,14,500',
    goal: '₹5,00,000',
    percent: 43,
    color: '#4CAF50',
    upiId: 'goseva@upi',
    impact: '₹51 feeds a cow for one day · ₹501 sponsors a week of care',
  },
  {
    id: 'gita',
    emoji: '📖',
    name: 'Spread the Gita',
    subtitle: 'Free Gita Distribution',
    desc: 'Help us distribute free Bhagavad Gita copies to students, hospitals, prisons, and rural communities — spreading eternal wisdom to every corner.',
    raised: '₹87,200',
    goal: '₹2,00,000',
    percent: 44,
    color: '#FF9800',
    upiId: 'spreadgita@upi',
    impact: '₹101 gifts one Gita · ₹1001 reaches 10 lives',
  },
  {
    id: 'culture',
    emoji: '🪔',
    name: 'Cultural Movement',
    subtitle: 'Preserve Sanatan Dharma',
    desc: 'Fund satsangs, Gita classes, yoga camps, and festivals that celebrate our eternal Sanatan culture and pass it on to the next generation.',
    raised: '₹1,45,000',
    goal: '₹3,00,000',
    percent: 48,
    color: '#E8690A',
    upiId: 'dharmamovement@upi',
    impact: '₹251 sponsors a satsang · ₹1001 funds a community Gita class',
  },
];

const SHOP_PRODUCTS = [
  // Puja Items
  { id: 'p1', category: 'puja', name: 'Brass Diya Set', desc: 'Set of 5 traditional hand-crafted brass diyas for daily puja', price: '₹299', emoji: '🪔', tag: 'Bestseller' },
  { id: 'p2', category: 'puja', name: 'Premium Agarbatti', desc: 'Pure sandalwood & rose incense sticks – 100 pcs pack', price: '₹149', emoji: '🌿', tag: '' },
  { id: 'p3', category: 'puja', name: 'Brass Ghanti', desc: 'Hand-crafted temple bell with rosewood handle', price: '₹399', emoji: '🔔', tag: 'Popular' },
  { id: 'p4', category: 'puja', name: 'Puja Thali Set', desc: 'Complete 7-piece brass puja thali with diya, ghanti & more', price: '₹599', emoji: '✨', tag: '' },
  { id: 'p5', category: 'puja', name: 'Kumkum & Chandan', desc: 'Premium kumkum, chandan & haldi combo pack', price: '₹199', emoji: '🌺', tag: '' },
  { id: 'p6', category: 'puja', name: 'Camphor Tablets', desc: 'Pure natural camphor for aarti – 50 tablets', price: '₹89', emoji: '💫', tag: '' },
  // Books
  { id: 'b1', category: 'books', name: 'Bhagavad Gita', desc: 'As It Is by Prabhupada – Hindi & English editions available', price: '₹249', emoji: '📖', tag: 'Must Read' },
  { id: 'b2', category: 'books', name: 'Valmiki Ramayana', desc: 'Complete illustrated edition with Sanskrit shlokas', price: '₹399', emoji: '📚', tag: 'Classic' },
  { id: 'b3', category: 'books', name: 'Srimad Bhagavatam', desc: 'Condensed single volume – all 12 cantos', price: '₹599', emoji: '📙', tag: '' },
  { id: 'b4', category: 'books', name: 'Upanishads', desc: 'Principal 12 Upanishads with commentary', price: '₹349', emoji: '📜', tag: '' },
  { id: 'b5', category: 'books', name: 'Chanakya Niti', desc: 'Timeless wisdom on leadership, ethics & life', price: '₹199', emoji: '📗', tag: 'Popular' },
  { id: 'b6', category: 'books', name: 'Hanuman Chalisa', desc: 'Illustrated edition with Sanskrit, Hindi & English', price: '₹99', emoji: '📕', tag: '' },
  // Mala / Counter
  { id: 'm1', category: 'counter', name: 'Tulsi Mala 108', desc: 'Hand-knotted sacred Tulsi beads – 108 beads for jaap', price: '₹199', emoji: '📿', tag: 'Sacred' },
  { id: 'm2', category: 'counter', name: 'Rudraksha Mala', desc: 'Authentic 5-mukhi Rudraksha japmala – certified', price: '₹799', emoji: '📿', tag: 'Authentic' },
  { id: 'm3', category: 'counter', name: 'Sphatik Mala', desc: 'Crystal quartz 108-bead mala for meditation', price: '₹499', emoji: '📿', tag: '' },
  { id: 'm4', category: 'counter', name: 'Digital Counter', desc: 'Electronic tally counter for effortless jaap counting', price: '₹149', emoji: '🖲️', tag: '' },
  // Deity Frames
  { id: 'f1', category: 'frames', name: 'Shri Krishna Frame', desc: 'Premium wooden frame – Vrindavan Krishna 12×16"', price: '₹499', emoji: '🖼️', tag: 'Bestseller' },
  { id: 'f2', category: 'frames', name: 'Ram Darbar Frame', desc: 'Ram, Sita, Lakshman & Hanuman – gold border finish', price: '₹599', emoji: '🖼️', tag: '' },
  { id: 'f3', category: 'frames', name: 'Lord Shiva Frame', desc: 'Mahadev meditating in Himalayas – large format', price: '₹499', emoji: '🖼️', tag: '' },
  { id: 'f4', category: 'frames', name: 'Shri Ganesh Frame', desc: 'Auspicious Ganesh Ji – gold leaf embossed frame', price: '₹449', emoji: '🖼️', tag: 'Popular' },
  { id: 'f5', category: 'frames', name: 'Maa Lakshmi Frame', desc: 'Goddess Lakshmi – prosperity & abundance blessings', price: '₹499', emoji: '🖼️', tag: '' },
];

let currentShopTab = 'all';
let selectedDonateAmount = null;
let currentDonateId = null;

function renderShop() {
  renderDonationCauses();
  renderProducts('all');
}

function renderDonationCauses() {
  const el = document.getElementById('donationCauses');
  if (!el) return;
  el.innerHTML = DONATION_CAUSES.map(c => `
    <div class="cause-card">
      <div class="cause-header">
        <span class="cause-emoji">${c.emoji}</span>
        <div class="cause-info">
          <div class="cause-name">${c.name}</div>
          <div class="cause-subtitle">${c.subtitle}</div>
        </div>
      </div>
      <div class="cause-desc">${c.desc}</div>
      <div class="cause-progress-bar">
        <div class="cause-progress-fill" style="width:${c.percent}%;background:${c.color}"></div>
      </div>
      <div class="cause-stats">
        <span class="cause-raised">Raised: ${c.raised}</span>
        <span class="cause-goal">Goal: ${c.goal}</span>
      </div>
      <button class="cause-donate-btn" onclick="openDonateModal('${c.id}')">
        🙏 Donate to ${c.name}
      </button>
    </div>
  `).join('');
}

function renderProducts(tab) {
  const el = document.getElementById('productsGrid');
  if (!el) return;
  const list = tab === 'all' ? SHOP_PRODUCTS : SHOP_PRODUCTS.filter(p => p.category === tab);
  el.innerHTML = list.map(p => `
    <div class="product-card" onclick="openProductModal('${p.id}')">
      ${p.tag ? `<div class="product-tag">${p.tag}</div>` : ''}
      <span class="product-emoji">${p.emoji}</span>
      <div class="product-name">${p.name}</div>
      <div class="product-desc">${p.desc}</div>
      <div class="product-footer">
        <span class="product-price">${p.price}</span>
        <button class="product-order-btn" onclick="event.stopPropagation();openProductModal('${p.id}')">+</button>
      </div>
    </div>
  `).join('');
}

function switchShopTab(tab, btn) {
  currentShopTab = tab;
  document.querySelectorAll('.shop-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(tab);
}

// ── Donate Modal ──
function openDonateModal(causeId) {
  currentDonateId = causeId;
  selectedDonateAmount = null;
  const cause = DONATION_CAUSES.find(c => c.id === causeId);
  if (!cause) return;
  const amounts = ['₹51', '₹101', '₹251', '₹501', '₹1001'];
  document.getElementById('donateModalBody').innerHTML = `
    <div class="dm-cause-header">
      <span class="dm-cause-emoji">${cause.emoji}</span>
      <div>
        <div class="dm-cause-name">${cause.name}</div>
        <div class="dm-cause-sub">${cause.subtitle}</div>
      </div>
    </div>
    <div class="dm-desc">${cause.desc}</div>
    <div class="dm-amount-label">Choose Amount</div>
    <div class="dm-amounts">
      ${amounts.map(a => `<button class="dm-amount-btn" onclick="selectDonateAmount(this,'${a}')">${a}</button>`).join('')}
    </div>
    <input type="text" class="dm-custom-input" id="dmCustomAmt" placeholder="Or enter custom amount (₹)" oninput="clearAmountSelection()" />
    <div class="dm-upi-section">
      <div class="dm-upi-title">Pay via UPI</div>
      <div class="dm-upi-id">${cause.upiId}</div>
      <div class="dm-upi-note">Scan QR or pay directly to the UPI ID above</div>
    </div>
    <button class="dm-copy-btn" onclick="copyUpiId('${cause.upiId}')">📋 Copy UPI ID</button>
    <button class="dm-pay-btn" onclick="proceedDonate('${cause.id}')">🙏 Proceed to Pay</button>
    <div class="dm-impact-note">${cause.impact}</div>
  `;
  document.getElementById('donateModal').classList.remove('hidden');
}

function selectDonateAmount(btn, amount) {
  selectedDonateAmount = amount;
  document.querySelectorAll('.dm-amount-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const custom = document.getElementById('dmCustomAmt');
  if (custom) custom.value = '';
}

function clearAmountSelection() {
  selectedDonateAmount = null;
  document.querySelectorAll('.dm-amount-btn').forEach(b => b.classList.remove('selected'));
}

function copyUpiId(id) {
  navigator.clipboard.writeText(id).then(() => showToast('UPI ID copied!')).catch(() => showToast('Copy: ' + id));
}

function proceedDonate(causeId) {
  const cause = DONATION_CAUSES.find(c => c.id === causeId);
  const custom = document.getElementById('dmCustomAmt');
  const amount = selectedDonateAmount || (custom && custom.value ? '₹' + custom.value.replace(/[₹,]/g, '') : null);
  if (!amount) { showToast('Please select or enter an amount'); return; }
  const msg = encodeURIComponent(`Jai Shri Krishna! 🙏\n\nI want to donate ${amount} to *${cause.name}* – ${cause.subtitle}.\n\nUPI: ${cause.upiId}\n\nHare Krishna 🪔`);
  window.open(`https://wa.me/?text=${msg}`, '_blank');
  showToast('Jai Shri Krishna! Opening WhatsApp...');
}

function closeDonateModal(e) {
  if (!e || e.target === document.getElementById('donateModal')) {
    document.getElementById('donateModal').classList.add('hidden');
  }
}

// ── Product Modal ──
function openProductModal(productId) {
  const p = SHOP_PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  const msg = encodeURIComponent(`Jai Shri Krishna! 🙏\n\nI want to order:\n\n*${p.name}*\nPrice: ${p.price}\n\n${p.desc}\n\nPlease confirm availability and delivery details.\n\nHare Krishna 🪔`);
  const waLink = `https://wa.me/?text=${msg}`;
  document.getElementById('productModalBody').innerHTML = `
    <span class="pm-emoji">${p.emoji}</span>
    <div class="pm-name">${p.name}</div>
    <div class="pm-price">${p.price}</div>
    <div class="pm-desc">${p.desc}</div>
    <div class="pm-divider"></div>
    <div class="pm-note">All products are carefully sourced from trusted artisans & publishers. Order via WhatsApp and our team will assist you with delivery.</div>
    <a class="pm-wa-btn" href="${waLink}" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Order via WhatsApp
    </a>
  `;
  document.getElementById('productModal').classList.remove('hidden');
}

function closeProductModal(e) {
  if (!e || e.target === document.getElementById('productModal')) {
    document.getElementById('productModal').classList.add('hidden');
  }
}
