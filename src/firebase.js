import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, onValue, serverTimestamp } from 'firebase/database';

// ─── Firebase Config ──────────────────────────────────
// Fill these in .env after creating a Firebase project at console.firebase.google.com
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Detect if Firebase is configured
const isConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey !== 'undefined' && firebaseConfig.apiKey !== 'YOUR_API_KEY_HERE';

let app = null;
let db = null;

if (isConfigured) {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
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
  const presenceRef = ref(db, `presence/${SESSION_ID}`);
  const data = { name: guestName, device: DEVICE, lastSeen: serverTimestamp(), section: 'Hero' };
  set(presenceRef, data);
  const iv = setInterval(() => set(presenceRef, { ...data, lastSeen: serverTimestamp() }), 30000);
  return () => { clearInterval(iv); set(presenceRef, null); };
}

// ─── Update Current Section ───────────────────────────
export function updatePresenceSection(sectionName) {
  if (!db) return;
  set(ref(db, `presence/${SESSION_ID}/section`), sectionName);
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

export { isConfigured };
