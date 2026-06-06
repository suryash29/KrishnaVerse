/* ═══════════════════════════════════════════════════════════
   KrishnaVerse – Main Application Logic
   Features: Navigation, AI Guide, Streaks, Bookmarks,
             Mood Tracker, Journal, Reflection, Search
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ╔══════════════════════════════════════════════════════════════╗
// ║  ⚙️  CONFIG — EDIT THESE VALUES (single source of truth)      ║
// ║  • shopWhatsApp: your WhatsApp business number in intl        ║
// ║    format with no '+' or spaces, e.g. '919812345678'.        ║
// ║    Leave '' to open WhatsApp without a preset recipient.      ║
// ║  • upi: the UPI ID for each donation cause.                   ║
// ╚══════════════════════════════════════════════════════════════╝
const KV_CONFIG = {
  shopWhatsApp: '',            // TODO: set your WhatsApp number, e.g. '919812345678'
  upi: {
    goseva:  'goseva@upi',     // TODO: set real UPI IDs
    gita:    'spreadgita@upi',
    culture: 'dharmamovement@upi',
  },
};
window.KV_CONFIG = KV_CONFIG;

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
  userId: null,        // Firebase uid when signed in (for cloud sync)
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
  // Mirror to the cloud (debounced) when signed in.
  scheduleCloudSave();
}

// ── Cloud sync bridge (Firestore via auth.js module) ───────
let __kvCloudSaveTimer = null;
function scheduleCloudSave() {
  if (!STATE.userId || !window.__kvCloud) return;
  clearTimeout(__kvCloudSaveTimer);
  __kvCloudSaveTimer = setTimeout(() => {
    window.__kvCloud.save(STATE.userId, {
      language: STATE.language,
      darkMode: STATE.darkMode,
      bookmarks: STATE.bookmarks,
      notes: STATE.notes,
      journal: STATE.journal,
      moodHistory: STATE.moodHistory,
      streak: STATE.streak,
    });
  }, 1200);
}

// Merge cloud data into local STATE without losing local-only entries.
function mergeCloudIntoState(cloud) {
  if (!cloud) return;
  // Bookmarks: union of ids.
  if (Array.isArray(cloud.bookmarks)) {
    STATE.bookmarks = Array.from(new Set([...(STATE.bookmarks || []), ...cloud.bookmarks]));
  }
  // Notes: cloud values win for shared keys, keep local-only keys.
  if (cloud.notes && typeof cloud.notes === 'object') {
    STATE.notes = Object.assign({}, STATE.notes || {}, cloud.notes);
  }
  // Journal: union by id.
  if (Array.isArray(cloud.journal)) {
    const byId = {};
    [...(STATE.journal || []), ...cloud.journal].forEach(e => { if (e && e.id != null) byId[e.id] = e; });
    STATE.journal = Object.values(byId).sort((a, b) => (b.date || 0) - (a.date || 0));
  }
  // Mood history: union by date.
  if (Array.isArray(cloud.moodHistory)) {
    const byDate = {};
    [...(STATE.moodHistory || []), ...cloud.moodHistory].forEach(m => { if (m && m.date) byDate[m.date] = m; });
    STATE.moodHistory = Object.values(byDate);
  }
  // Streak: keep the strongest record.
  if (cloud.streak && typeof cloud.streak === 'object') {
    const local = STATE.streak || { current: 0, best: 0, lastDate: null };
    STATE.streak = {
      current: Math.max(local.current || 0, cloud.streak.current || 0),
      best: Math.max(local.best || 0, cloud.streak.best || 0),
      lastDate: (cloud.streak.lastDate && local.lastDate)
        ? (cloud.streak.lastDate > local.lastDate ? cloud.streak.lastDate : local.lastDate)
        : (cloud.streak.lastDate || local.lastDate),
    };
  }
  if (typeof cloud.darkMode === 'boolean') STATE.darkMode = cloud.darkMode;
  if (cloud.language) STATE.language = cloud.language;
}

// Called by auth.js when a user signs in.
window.__kvOnLogin = async function (user) {
  STATE.userId = user.uid;
  if (!window.__kvCloud) return;
  const cloud = await window.__kvCloud.load(user.uid);
  if (cloud) {
    mergeCloudIntoState(cloud);
    applyTheme();
    updateLangLabel();
    try { localStorage.setItem('krishna_guide_v2', JSON.stringify({
      language: STATE.language, darkMode: STATE.darkMode, bookmarks: STATE.bookmarks,
      notes: STATE.notes, journal: STATE.journal, moodHistory: STATE.moodHistory, streak: STATE.streak,
    })); } catch (e) {}
    if (STATE.initialized) { renderHome(); renderReflect(); renderSaved(); }
  }
  // Push the (merged or first-time) state up to the cloud.
  scheduleCloudSave();
};

// Called by auth.js when the user signs out.
window.__kvOnLogout = function () {
  STATE.userId = null;
};

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
// First principles: the UI has three mutually-exclusive layers —
// splash (loading), authOverlay (signed-out), and #app (signed-in).
// Exactly one should be visible at a time, and ONLY Firebase auth
// state may decide between authOverlay and #app. app.js therefore
// never reveals #app on a timer; it only prepares data + renders,
// and exposes reveal hooks that auth.js calls once auth resolves.

let __kvPrepped = false;
function __kvPrep() {
  if (__kvPrepped) return;
  __kvPrepped = true;
  loadState();
  applyTheme();
  updateLangLabel();
  updateStreakForToday();
}

let __kvRendered = false;
function __kvRenderAll() {
  if (__kvRendered) return;
  __kvRendered = true;
  STATE.initialized = true;
  renderHome();
  renderExplore();
  renderReflect();
  renderSaved();
}

// Called by auth.js when a signed-in user is confirmed.
window.__kvShowApp = function () {
  __kvPrep();
  __kvRenderAll();
  const splash = document.getElementById('splash');
  const app = document.getElementById('app');
  const overlay = document.getElementById('authOverlay');
  if (overlay) overlay.classList.add('hidden');
  if (!splash || !app) return;
  splash.style.transition = 'opacity 0.5s ease';
  splash.style.opacity = '0';
  setTimeout(() => {
    splash.classList.add('hidden');
    app.classList.remove('hidden');
    app.style.animation = 'splash-in 0.4s ease forwards';
  }, 500);
};

// Called by auth.js when there is no signed-in user.
window.__kvShowAuth = function () {
  const splash = document.getElementById('splash');
  const app = document.getElementById('app');
  const overlay = document.getElementById('authOverlay');
  if (app) app.classList.add('hidden');
  if (splash) { splash.style.opacity = '0'; splash.classList.add('hidden'); }
  if (overlay) overlay.classList.remove('hidden');
  if (typeof window.switchAuthScreen === 'function') window.switchAuthScreen('login');
};

document.addEventListener('DOMContentLoaded', () => {
  __kvPrep();

  // Show the splash as a loading screen while Firebase auth resolves —
  // but only if auth hasn't already resolved (and possibly revealed the
  // app) before this handler ran.
  if (!window.__kvAuthResolved) {
    const splash = document.getElementById('splash');
    if (splash) { splash.classList.remove('hidden'); splash.style.opacity = '1'; }
  }

  // Fallback: if the auth module never initialises (e.g. the page was
  // opened directly from the filesystem, where ES modules + Firebase
  // cannot run), there is no auth state to wait for. After a grace
  // period, surface the login screen so the user is never stuck on the
  // splash forever.
  setTimeout(() => {
    if (!window.__kvAuthResolved) window.__kvShowAuth();
  }, 10000);

  // Enter key for chat
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') sendMessage();
    });
  }

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
  // Always (re)enter Explore on the Chapters tab, never stuck inside a chapter view.
  const tabsEl = document.getElementById('exploreTabs');
  if (tabsEl) tabsEl.style.display = '';
  const chapterView = document.getElementById('expChapter');
  if (chapterView) chapterView.classList.add('hidden');
  document.querySelectorAll('#exploreTabs .exp-tab').forEach((b, i) => b.classList.toggle('active', i === 0));
  showExpView('chapters');
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

// ── Paginated "All Shlokas" (avoid rendering all 700 cards at once) ──
const ALL_SHLOKAS_PAGE = 30;
let allShlokasShown = 0;
let allShlokasObserver = null;

function renderAllShlokasList() {
  const el = document.getElementById('allShlokasList');
  if (!el) return;
  el.innerHTML = '';
  allShlokasShown = 0;
  appendAllShlokas();
  setupAllShlokasObserver();
}

function appendAllShlokas() {
  const el = document.getElementById('allShlokasList');
  if (!el) return;
  const next = SHLOKAS.slice(allShlokasShown, allShlokasShown + ALL_SHLOKAS_PAGE);
  el.insertAdjacentHTML('beforeend', next.map(s => renderShlokaListCard(s)).join(''));
  allShlokasShown += next.length;

  const moreBtn = document.getElementById('allShlokasMore');
  if (moreBtn) {
    const remaining = SHLOKAS.length - allShlokasShown;
    if (remaining > 0) {
      moreBtn.style.display = '';
      moreBtn.textContent = `Load more (${remaining} remaining)`;
    } else {
      moreBtn.style.display = 'none';
    }
  }
}

// Infinite scroll: auto-load the next page when the sentinel scrolls into view.
function setupAllShlokasObserver() {
  const sentinel = document.getElementById('allShlokasSentinel');
  if (!sentinel || typeof IntersectionObserver === 'undefined') return;
  if (allShlokasObserver) allShlokasObserver.disconnect();
  allShlokasObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && allShlokasShown < SHLOKAS.length) appendAllShlokas();
    });
  }, { rootMargin: '400px' });
  allShlokasObserver.observe(sentinel);
}

function renderShlokaListCard(shloka) {
  const isBookmarked = STATE.bookmarks.includes(shloka.id);
  const firstLine = (shloka.sanskrit || '').split('\n')[0] || '';
  const tags = Array.isArray(shloka.tags) ? shloka.tags.slice(0, 3) : [];
  const tagsHTML = tags.length
    ? `<div class="slc-tags">${tags.map(t => `<span class="slc-tag">${t}</span>`).join('')}</div>`
    : '';
  return `
    <div class="shloka-list-card" onclick="openShlokaDetail(getShlokaById('${shloka.id}'))">
      <div class="slc-header">
        <span class="slc-ref">BG ${shloka.chapter}.${shloka.verse}</span>
        <span class="slc-bm ${isBookmarked ? 'bookmarked' : ''}">${isBookmarked ? '🔖' : '○'}</span>
      </div>
      <div class="slc-sanskrit">${firstLine}</div>
      <div class="slc-english">${shloka.english || ''}</div>
      ${tagsHTML}
    </div>
  `;
}

// Show ALL verses of a chapter as a scrollable list (with a back button).
function showChapterShlokas(chapterNum) {
  const shlokas = SHLOKAS.filter(s => s.chapter === chapterNum)
    .sort((a, b) => a.verse - b.verse);
  const chapter = CHAPTERS.find(c => c.num === chapterNum);
  if (!shlokas.length) return showToast(`No shlokas loaded for Chapter ${chapterNum} yet`);

  const headerEl = document.getElementById('chapterDetailHeader');
  if (headerEl && chapter) {
    headerEl.innerHTML = `
      <div class="chapter-detail-head">
        <div class="cdh-num">Chapter ${chapter.num}</div>
        <div class="cdh-title">${chapter.title}</div>
        <div class="cdh-hindi">${chapter.hindi}</div>
        <div class="cdh-theme">${chapter.theme || ''}</div>
        <div class="cdh-count">${shlokas.length} verses</div>
      </div>
    `;
  }

  const listEl = document.getElementById('chapterShlokasList');
  if (listEl) listEl.innerHTML = shlokas.map(s => renderShlokaListCard(s)).join('');

  // Swap to the single-chapter view.
  document.querySelectorAll('.exp-view').forEach(v => v.classList.add('hidden'));
  const view = document.getElementById('expChapter');
  if (view) view.classList.remove('hidden');
  const tabsEl = document.getElementById('exploreTabs');
  if (tabsEl) tabsEl.style.display = 'none';
  // Scroll the explore screen back to top for the new list.
  const scroller = document.querySelector('#screen-explore .screen-scroll') || document.getElementById('expChapter');
  if (scroller && scroller.scrollTo) scroller.scrollTo({ top: 0 });
}

// Return from a single chapter back to the chapters list.
function closeChapterView() {
  const tabsEl = document.getElementById('exploreTabs');
  if (tabsEl) tabsEl.style.display = '';
  showExpView('chapters');
  const activeTab = document.querySelector('#exploreTabs .exp-tab');
  document.querySelectorAll('#exploreTabs .exp-tab').forEach(b => b.classList.remove('active'));
  if (activeTab) activeTab.classList.add('active');
}

// Show all verses tagged to a wisdom topic, as a list.
function showTopicShlokas(categoryId, label) {
  const shlokas = getShlokasByCategory(categoryId);
  if (!shlokas.length) return showToast('No shlokas for this topic yet');

  const headerEl = document.getElementById('chapterDetailHeader');
  if (headerEl) {
    headerEl.innerHTML = `
      <div class="chapter-detail-head">
        <div class="cdh-title">${label}</div>
        <div class="cdh-count">${shlokas.length} shloka${shlokas.length !== 1 ? 's' : ''}</div>
      </div>
    `;
  }
  const listEl = document.getElementById('chapterShlokasList');
  if (listEl) listEl.innerHTML = shlokas.map(s => renderShlokaListCard(s)).join('');

  document.querySelectorAll('.exp-view').forEach(v => v.classList.add('hidden'));
  const view = document.getElementById('expChapter');
  if (view) view.classList.remove('hidden');
  const tabsEl = document.getElementById('exploreTabs');
  if (tabsEl) tabsEl.style.display = 'none';
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

  const wordByWordHTML = (Array.isArray(shloka.wordByWord) && shloka.wordByWord.length) ? `
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

  // Rich teaching fields exist only for curated verses — render them only when present.
  const contextHTML = shloka.context ? `
      <div class="sd-section-label">Context</div>
      <div class="sd-box"><p>${shloka.context}</p></div>` : '';

  const explanationHTML = shloka.explanation ? `
      <div class="sd-section-label">Understanding</div>
      <div class="sd-box"><p>${shloka.explanation}</p></div>` : '';

  const lifeAppHTML = shloka.lifeApplication ? `
      <div class="sd-section-label">💡 Life Application</div>
      <div class="sd-box" style="border-left-color:var(--gold)"><p>${shloka.lifeApplication}</p></div>` : '';

  document.getElementById('shlokaDetailBody').innerHTML = `
    <div style="padding-top:8px">
      <span class="sd-ref">BG ${shloka.chapter}.${shloka.verse}</span>
      <div class="sd-chapter">Chapter ${shloka.chapter} · ${shloka.chapterTitle} · ${shloka.chapterTitleHindi}</div>

      <div class="sd-section-label">Sanskrit</div>
      <div class="sd-sanskrit">${shloka.sanskrit}</div>
      <div class="sd-translit">${shloka.transliteration}</div>

      ${wordByWordHTML}

      <div class="sd-section-label">${STATE.language === 'hi' ? 'अनुवाद' : 'Translation'}</div>
      ${STATE.language !== 'en' && shloka.hindi ? `<div class="sd-hindi" style="margin-bottom:8px">${shloka.hindi}</div>` : ''}
      <div class="sd-translation">${shloka.english}</div>

      ${contextHTML}
      ${explanationHTML}
      ${lifeAppHTML}

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
    upiId: KV_CONFIG.upi.goseva,
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
    upiId: KV_CONFIG.upi.gita,
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
    upiId: KV_CONFIG.upi.culture,
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

// Products are loaded live from Firestore by shop-data.js (with an offline
// fallback). kvActiveProducts() / kvFmtPrice() are provided there; these
// guards keep the shop working even if that module hasn't loaded yet.
function _shopProducts() {
  return (typeof window.kvActiveProducts === 'function') ? window.kvActiveProducts() : SHOP_PRODUCTS;
}
function _shopPrice(price) {
  return (typeof window.kvFmtPrice === 'function') ? window.kvFmtPrice(price) : String(price);
}

function renderProducts(tab) {
  const el = document.getElementById('productsGrid');
  if (!el) return;
  currentShopTab = tab;
  window.currentShopTab = tab;
  const all = _shopProducts();
  const list = tab === 'all' ? all : all.filter(p => p.category === tab);
  if (!list.length) {
    el.innerHTML = `<div class="shop-empty">No items in this category yet. 🙏</div>`;
    return;
  }
  el.innerHTML = list.map(p => {
    const media = p.imageUrl
      ? `<img class="product-img" src="${p.imageUrl}" alt="${p.name}" loading="lazy" />`
      : `<span class="product-emoji">${p.emoji || '🛍️'}</span>`;
    const soldOut = p.inStock === false;
    return `
    <div class="product-card${soldOut ? ' sold-out' : ''}" onclick="openProductModal('${p.id}')">
      ${p.tag ? `<div class="product-tag">${p.tag}</div>` : ''}
      ${soldOut ? `<div class="product-soldout">Sold out</div>` : ''}
      ${media}
      <div class="product-name">${p.name}</div>
      <div class="product-desc">${p.desc}</div>
      <div class="product-footer">
        <span class="product-price">${_shopPrice(p.price)}</span>
        <button class="product-order-btn" onclick="event.stopPropagation();openProductModal('${p.id}')">+</button>
      </div>
    </div>`;
  }).join('');
}
window.renderProducts = renderProducts;

function switchShopTab(tab, btn) {
  currentShopTab = tab;
  window.currentShopTab = tab;
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
  // Best-effort record of the donation intent.
  if (window.__kvCloud && typeof window.__kvCloud.createDonation === 'function') {
    window.__kvCloud.createDonation({
      causeId: cause.id,
      causeName: cause.name,
      amount: String(amount),
      upiId: cause.upiId,
      userId: STATE.userId || null,
      status: 'intent',
    });
  }
  const waNum = (KV_CONFIG && KV_CONFIG.shopWhatsApp) ? KV_CONFIG.shopWhatsApp : '';
  const waBase = waNum ? `https://wa.me/${waNum}` : `https://wa.me/`;
  const msg = encodeURIComponent(`Jai Shri Krishna! 🙏\n\nI want to donate ${amount} to *${cause.name}* – ${cause.subtitle}.\n\nUPI: ${cause.upiId}\n\nHare Krishna 🪔`);
  window.open(`${waBase}?text=${msg}`, '_blank', 'noopener');
  showToast('Jai Shri Krishna! Opening WhatsApp...');
}

function closeDonateModal(e) {
  if (!e || e.target === document.getElementById('donateModal')) {
    document.getElementById('donateModal').classList.add('hidden');
  }
}

// ── Product Modal ──
function openProductModal(productId) {
  const p = _shopProducts().find(x => x.id === productId);
  if (!p) return;
  const priceStr = _shopPrice(p.price);
  // Order routing number comes from the single KV_CONFIG block at the top.
  const waNum = (KV_CONFIG && KV_CONFIG.shopWhatsApp) ? KV_CONFIG.shopWhatsApp : '';
  const waBase = waNum ? `https://wa.me/${waNum}` : `https://wa.me/`;
  const msg = encodeURIComponent(`Jai Shri Krishna! 🙏\n\nI want to order:\n\n*${p.name}*\nPrice: ${priceStr}\n\n${p.desc}\n\nPlease confirm availability and delivery details.\n\nHare Krishna 🪔`);
  const waLink = `${waBase}?text=${msg}`;
  const media = p.imageUrl
    ? `<img class="pm-img" src="${p.imageUrl}" alt="${p.name}" />`
    : `<span class="pm-emoji">${p.emoji || '🛍️'}</span>`;
  document.getElementById('productModalBody').innerHTML = `
    ${media}
    <div class="pm-name">${p.name}</div>
    <div class="pm-price">${priceStr}</div>
    <div class="pm-desc">${p.desc}</div>
    <div class="pm-divider"></div>
    <div class="pm-note">All products are carefully sourced from trusted artisans & publishers. Order via WhatsApp and our team will assist you with delivery.</div>
    <button class="pm-wa-btn" type="button" onclick="placeOrder('${p.id}', '${waLink.replace(/'/g, "\\'")}')">
      <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Order via WhatsApp
    </button>
  `;
  document.getElementById('productModal').classList.remove('hidden');
}

// Record the order in Firestore (best-effort) then open WhatsApp.
function placeOrder(productId, waLink) {
  const p = _shopProducts().find(x => x.id === productId);
  if (p && STATE.userId && window.__kvCloud && typeof window.__kvCloud.createOrder === 'function') {
    window.__kvCloud.createOrder({
      userId: STATE.userId,
      items: [{ id: p.id, name: p.name, price: _shopPrice(p.price), category: p.category || null }],
      status: 'pending',
      channel: 'whatsapp',
    });
  }
  if (waLink) window.open(waLink, '_blank', 'noopener');
}
window.placeOrder = placeOrder;

function closeProductModal(e) {
  if (!e || e.target === document.getElementById('productModal')) {
    document.getElementById('productModal').classList.add('hidden');
  }
}

// ── Profile / Account Modal ──
function openProfileModal() {
  const user = window.__kvUser;
  if (!user) { showToast('Please sign in first'); return; }
  const initial = (user.displayName || user.email || 'U')[0].toUpperCase();
  const verified = user.emailVerified;
  const bookmarks = (STATE.bookmarks || []).length;
  const entries = (STATE.journal || []).length;
  const streak = (STATE.streak && STATE.streak.current) || 0;
  document.getElementById('profileModalBody').innerHTML = `
    <div class="pf-head">
      <div class="pf-avatar">${initial}</div>
      <div class="pf-id">
        <div class="pf-name-line">${user.displayName || 'Devotee'}</div>
        <div class="pf-email-line">${user.email}
          <span class="pf-badge ${verified ? 'ok' : 'warn'}">${verified ? '✓ Verified' : 'Unverified'}</span>
        </div>
      </div>
    </div>

    <div class="pf-stats">
      <div class="pf-stat"><span class="pf-stat-num">${bookmarks}</span><span class="pf-stat-lbl">Saved</span></div>
      <div class="pf-stat"><span class="pf-stat-num">${entries}</span><span class="pf-stat-lbl">Journal</span></div>
      <div class="pf-stat"><span class="pf-stat-num">${streak}</span><span class="pf-stat-lbl">Day Streak</span></div>
    </div>

    <div class="pf-section">
      <label class="pf-label">Display Name</label>
      <div class="pf-row">
        <input type="text" id="pfName" class="pf-input" value="${(user.displayName || '').replace(/"/g, '&quot;')}" />
        <button class="pf-btn" onclick="saveProfileName()">Save</button>
      </div>
    </div>

    ${verified ? '' : `
    <div class="pf-section">
      <button class="pf-btn pf-btn-outline" onclick="resendVerify()">📧 Resend verification email</button>
    </div>`}

    <div class="pf-section">
      <label class="pf-label">Change Password</label>
      <input type="password" id="pfCurrent" class="pf-input pf-input-block" placeholder="Current password" autocomplete="current-password" />
      <input type="password" id="pfNew" class="pf-input pf-input-block" placeholder="New password (min 6 chars)" autocomplete="new-password" />
      <button class="pf-btn pf-btn-block" onclick="changeProfilePassword()">Update Password</button>
    </div>

    <div id="pfMsg" class="pf-msg hidden"></div>

    <button class="pf-signout" onclick="window._handleSignOut()">Sign Out</button>
  `;
  document.getElementById('profileModal').classList.remove('hidden');
}
window.openProfileModal = openProfileModal;

function closeProfileModal(e) {
  if (!e || e.target === document.getElementById('profileModal')) {
    document.getElementById('profileModal').classList.add('hidden');
  }
}
window.closeProfileModal = closeProfileModal;

function _pfMsg(text, ok) {
  const el = document.getElementById('pfMsg');
  if (!el) return;
  el.textContent = text;
  el.classList.remove('hidden');
  el.style.color = ok ? '#2D8A4E' : '#C0392B';
}

async function saveProfileName() {
  const name = (document.getElementById('pfName').value || '').trim();
  if (!name) { _pfMsg('Name cannot be empty.', false); return; }
  try {
    await window.__kvUpdateName(name);
    _pfMsg('✓ Name updated.', true);
    const greetEl = document.querySelector('.greeting-name');
    if (greetEl) greetEl.textContent = `Jai Shri Krishna, ${name.split(' ')[0]} 🙏`;
  } catch (e) {
    _pfMsg('Could not update name. Please try again.', false);
  }
}
window.saveProfileName = saveProfileName;

async function resendVerify() {
  try { await window.__kvSendVerify(); _pfMsg('✓ Verification email sent.', true); }
  catch { _pfMsg('Could not send right now. Try later.', false); }
}
window.resendVerify = resendVerify;

async function changeProfilePassword() {
  const cur = document.getElementById('pfCurrent').value;
  const nw = document.getElementById('pfNew').value;
  if (!cur || !nw) { _pfMsg('Enter both current and new password.', false); return; }
  if (nw.length < 6) { _pfMsg('New password must be at least 6 characters.', false); return; }
  try {
    await window.__kvChangePassword(cur, nw);
    _pfMsg('✓ Password updated.', true);
    document.getElementById('pfCurrent').value = '';
    document.getElementById('pfNew').value = '';
  } catch (e) {
    const code = e && e.code;
    _pfMsg(code === 'auth/wrong-password' || code === 'auth/invalid-credential'
      ? 'Current password is incorrect.' : 'Could not update password. Please try again.', false);
  }
}
window.changeProfilePassword = changeProfilePassword;
