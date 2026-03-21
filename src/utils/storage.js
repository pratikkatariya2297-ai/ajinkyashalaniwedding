import { db } from '../firebase';
import { ref, push, set, onValue, serverTimestamp, increment } from 'firebase/database';

const KEYS = {
  LEADS: 'leads',
  RSVPS: 'rsvps',
  ACTIVITY: 'activity',
  TRAFFIC: 'traffic'
};

export const storage = {
  // LEADS
  saveLead: async (lead) => {
    if (!db) return;
    try {
      await push(ref(db, KEYS.LEADS), {
        ...lead,
        timestamp: serverTimestamp()
      });
      storage.logActivity(`Lead captured: ${lead.name}`);
    } catch (err) {
      console.error('Failed to save lead to Firebase', err);
    }
  },
  
  // RSVPS
  saveRSVP: async (rsvp) => {
    if (!db) return;
    try {
      await push(ref(db, KEYS.RSVPS), {
        ...rsvp,
        timestamp: serverTimestamp()
      });
      storage.logActivity(`New RSVP from ${rsvp.name}: ${rsvp.attending}`);
    } catch (err) {
      console.error('Failed to save RSVP to Firebase', err);
    }
  },

  // ACTIVITY
  logActivity: (message) => {
    if (!db) return;
    push(ref(db, KEYS.ACTIVITY), {
      message,
      timestamp: serverTimestamp()
    }).catch(() => {});
  },

  // TRAFFIC
  incrementPageView: () => {
    if (!db) return;
    // Increment total page views
    set(ref(db, `${KEYS.TRAFFIC}/pageViews`), increment(1)).catch(() => {});
    
    // Check for unique visitor via sessionStorage (local to session)
    if (!sessionStorage.getItem('has_counted_unique')) {
      set(ref(db, `${KEYS.TRAFFIC}/uniqueVisitors`), increment(1)).catch(() => {});
      sessionStorage.setItem('has_counted_unique', 'true');
    }
  },

  // PERFORMANCES
  savePerformance: async (performance) => {
    if (!db) return;
    try {
      await push(ref(db, 'performances'), {
        ...performance,
        submittedAt: serverTimestamp()
      });
      storage.logActivity(`New Performance: ${performance.name} (${performance.songTitle || 'Act'})`);
    } catch (err) {
      console.error('Failed to save performance to Firebase', err);
    }
  },

  // GETTERS (Legacy support - though Admin.jsx should use real-time listeners)
  getLeads: () => [], 
  getRSVPs: () => [],
  getActivities: () => [],
  getTraffic: () => ({ pageViews: 0, uniqueVisitors: 0 })
};

