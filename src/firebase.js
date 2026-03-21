import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase, ref, push, set, onValue, serverTimestamp } from 'firebase/database';

// ─── Firebase Config ──────────────────────────────────
// Production credentials
const firebaseConfig = {
  apiKey: "AIzaSyBCPn8etyBItglkA1QFo0biuWh6uJbKY1I",
  authDomain: "ajinkya-shalini.firebaseapp.com",
  databaseURL: "https://ajinkya-shalini-default-rtdb.firebaseio.com", // Required for Realtime Database
  projectId: "ajinkya-shalini",
  storageBucket: "ajinkya-shalini.firebasestorage.app",
  messagingSenderId: "478689324822",
  appId: "1:478689324822:web:c6c857167580ef32e76a37",
  measurementId: "G-K5LS161CW5"
};

// Detect if Firebase is configured
const isConfigured = !!firebaseConfig.apiKey;

let app = null;
let db = null;
let analytics = null;

if (isConfigured) {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
}

// ─── Session ID ───────────────────────────────────────
const SESSION_ID = (() => {
  let id = sessionStorage.getItem('ws_id');
  if (!id) { id = `${Date.now()}_${Math.random().toString(36).slice(2,8)}`; sessionStorage.setItem('ws_id', id); }
  return id;
})();

const DEVICE = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';

// ─── Track Event ─────────────────────────────────────
export function trackEvent(type, data = {}) {
  if (!db) return; // Firebase not configured yet
  const payload = {
    type,
    sessionId: SESSION_ID,
    device: DEVICE,
    timestamp: serverTimestamp(),
    url: window.location.pathname,
    ...data,
  };
  push(ref(db, 'activity'), payload).catch(() => {});
}

// ─── Track Page View ──────────────────────────────────
export function trackPageView() {
  trackEvent('page_view', { referrer: document.referrer || 'direct' });
}

// ─── Track Section View (IntersectionObserver) ────────
export function trackSection(sectionName) {
  trackEvent('section_viewed', { section: sectionName });
}

// ─── Track Scroll Depth ───────────────────────────────
export function initScrollTracking() {
  if (!db) return;
  const reported = new Set();
  const checkpoints = [25, 50, 75, 100];
  const handler = () => {
    const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    checkpoints.forEach(cp => {
      if (pct >= cp && !reported.has(cp)) {
        reported.add(cp);
        trackEvent('scroll_depth', { depth: cp });
      }
    });
  };
  window.addEventListener('scroll', handler, { passive: true });
  return () => window.removeEventListener('scroll', handler);
}

// ─── Update Active Presence ───────────────────────────
export function initPresence(guestName = 'Guest') {
  if (!db) return () => {};
  
  // Reference to the special '.info/connected' node to detect connection state
  const connectedRef = ref(db, '.info/connected');
  const myPresenceRef = ref(db, `presence/${SESSION_ID}`);

  const unsub = onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      // We're connected (or reconnected)! 
      // Set up onDisconnect to remove this node when we lose connection
      onDisconnect(myPresenceRef).remove();

      // Set our presence data
      set(myPresenceRef, {
        name: guestName,
        device: DEVICE,
        lastSeen: serverTimestamp(),
        url: window.location.pathname,
        online: true
      });
    }
  });

  // Fallback: update lastSeen occasionally to prune stale sessions if onDisconnect fails
  const iv = setInterval(() => {
    set(ref(db, `presence/${SESSION_ID}/lastSeen`), serverTimestamp());
  }, 60000);

  return () => {
    unsub();
    clearInterval(iv);
    set(myPresenceRef, null);
  };
}

export function updatePresenceName(newName) {
  if (!db) return;
  set(ref(db, `presence/${SESSION_ID}/name`), newName);
}

// ─── Update Current Section ───────────────────────────
export function updatePresenceSection(sectionName) {
  if (!db) return;
  set(ref(db, `presence/${SESSION_ID}/section`), sectionName);
  set(ref(db, `presence/${SESSION_ID}/url`), window.location.pathname);
}

// ─── Subscribe to Real-Time Activity (for Admin) ──────
export function subscribeToActivity(callback) {
  if (!db) { callback([]); return () => {}; }
  const actRef = ref(db, 'activity');
  const unsub = onValue(actRef, (snap) => {
    const raw = snap.val() || {};
    const list = Object.entries(raw)
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 100);
    callback(list);
  });
  return unsub;
}

// ─── Subscribe to Active Presence (for Admin) ─────────
export function subscribeToPresence(callback) {
  if (!db) { callback({}); return () => {}; }
  const presRef = ref(db, 'presence');
  const unsub = onValue(presRef, (snap) => callback(snap.val() || {}));
  return unsub;
}

export { db, analytics, isConfigured };
