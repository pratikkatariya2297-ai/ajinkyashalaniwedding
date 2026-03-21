import { db } from '../firebase';
import { ref, push, set, onValue, serverTimestamp, increment } from 'firebase/database';

const KEYS = {
  LEADS: 'leads',
  RSVPS: 'rsvps',
  ACTIVITY: 'activity',
  TRAFFIC: 'traffic'
};

const withTimeout = (promise, ms = 3000) => {
  let timeout = new Promise((_, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error('Firebase operation timed out'));
    }, ms);
  });
  return Promise.race([promise, timeout]);
};

export const storage = {
  // LEADS
  saveLead: async (lead) => {
    if (!db) return;
    try {
      await withTimeout(push(ref(db, KEYS.LEADS), {
        ...lead,
        timestamp: serverTimestamp()
      }));
      storage.logActivity(`Lead captured: ${lead.name}`);
    } catch (err) {
      console.warn('Firebase lead save timed out/failed', err);
    }
  },
  
  // RSVPS
  saveRSVP: async (rsvp) => {
    if (!db) return;
    try {
      await withTimeout(push(ref(db, KEYS.RSVPS), {
        ...rsvp,
        timestamp: serverTimestamp()
      }));
      storage.logActivity(`New RSVP from ${rsvp.name}: ${rsvp.attending}`);
    } catch (err) {
      console.warn('Firebase RSVP save timed out/failed', err);
    }
  },

  // ACTIVITY
  logActivity: (message) => {
    if (!db) return;
    withTimeout(push(ref(db, KEYS.ACTIVITY), {
      message,
      timestamp: serverTimestamp()
    })).catch(() => {});
  },

  // TRAFFIC
  incrementPageView: () => {
    if (!db) return;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Increment lifetime totals
    withTimeout(set(ref(db, `${KEYS.TRAFFIC}/pageViews`), increment(1))).catch(() => {});
    
    // Increment daily totals
    withTimeout(set(ref(db, `${KEYS.TRAFFIC}/daily/${today}/pageViews`), increment(1))).catch(() => {});
    
    // Check for unique visitor via sessionStorage (local to session)
    if (!sessionStorage.getItem('has_counted_unique')) {
      withTimeout(set(ref(db, `${KEYS.TRAFFIC}/uniqueVisitors`), increment(1))).catch(() => {});
      withTimeout(set(ref(db, `${KEYS.TRAFFIC}/daily/${today}/uniqueVisitors`), increment(1))).catch(() => {});
      sessionStorage.setItem('has_counted_unique', 'true');
    }
  },

  // PERFORMANCES
  savePerformance: async (performance) => {
    if (!db) return;
    try {
      await withTimeout(push(ref(db, 'performances'), {
        ...performance,
        submittedAt: serverTimestamp()
      }));
      storage.logActivity(`New Performance: ${performance.name} (${performance.songTitle || 'Act'})`);
    } catch (err) {
      console.warn('Firebase performance save timed out/failed', err);
    }
  },

  // GETTERS (Legacy support - though Admin.jsx should use real-time listeners)
  getLeads: () => [], 
  getRSVPs: () => [],
  getActivities: () => [],
  getTraffic: () => ({ pageViews: 0, uniqueVisitors: 0 })
};

