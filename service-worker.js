/* ═══════════════════════════════════════════════════════
   KrishnaVerse – Service Worker (Offline-first PWA)
   ═══════════════════════════════════════════════════════ */

const CACHE_NAME = 'krishnaverse-v10';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/shop-data.js',
  '/firebase-config.js',
  '/auth.js',
  '/data/gita-verses.js',
  '/data/shlokas.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap',
];

// Install — cache all static assets
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        STATIC_ASSETS.map(url => cache.add(url).catch(() => {}))
      );
    })
  );
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache-first for static, network-first for others
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Never cache the admin console or live Firestore/Firebase API traffic —
  // these must always be fresh and online.
  if (
    url.pathname.startsWith('/admin') ||
    url.hostname.endsWith('firestore.googleapis.com') ||
    url.hostname.endsWith('firebaseio.com') ||
    url.hostname.endsWith('identitytoolkit.googleapis.com')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Static assets: cache-first
  if (
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.json') ||
    url.pathname === '/' ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(resp => {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return resp;
        }).catch(() => new Response('Offline', { status: 503 }));
      })
    );
    return;
  }

  // Network-first for everything else
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Background sync for notifications
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/').then(client => {
      if (client) client.focus();
    })
  );
});

// Push notifications
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'KrishnaVerse';
  const options = {
    body: data.body || 'Your daily Gita wisdom awaits 🙏',
    icon: '/manifest.json',
    badge: '/manifest.json',
    tag: 'krishnaverse-daily',
    requireInteraction: false,
    actions: [
      { action: 'open', title: 'Read Today\'s Shloka' },
      { action: 'dismiss', title: 'Later' }
    ]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
