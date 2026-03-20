const KEYS = {
  LEADS: 'wedding_leads',
  RSVPS: 'wedding_rsvps',
  ACTIVITY: 'wedding_activity',
  TRAFFIC: 'wedding_traffic'
};

const initStorage = () => {
  if (!localStorage.getItem(KEYS.LEADS)) localStorage.setItem(KEYS.LEADS, JSON.stringify([]));
  if (!localStorage.getItem(KEYS.RSVPS)) localStorage.setItem(KEYS.RSVPS, JSON.stringify([]));
  if (!localStorage.getItem(KEYS.ACTIVITY)) localStorage.setItem(KEYS.ACTIVITY, JSON.stringify([]));
  if (!localStorage.getItem(KEYS.TRAFFIC)) {
    localStorage.setItem(KEYS.TRAFFIC, JSON.stringify({ pageViews: 0, uniqueVisitors: 0 }));
  }
};

initStorage();

export const storage = {
  // LEADS
  saveLead: (lead) => {
    const leads = JSON.parse(localStorage.getItem(KEYS.LEADS) || '[]');
    leads.push({ ...lead, id: Date.now(), timestamp: new Date().toISOString() });
    localStorage.setItem(KEYS.LEADS, JSON.stringify(leads));
    storage.logActivity(`Lead captured: ${lead.name}`);
  },
  getLeads: () => JSON.parse(localStorage.getItem(KEYS.LEADS) || '[]'),
  
  // RSVPS
  saveRSVP: (rsvp) => {
    const rsvps = JSON.parse(localStorage.getItem(KEYS.RSVPS) || '[]');
    rsvps.push({ ...rsvp, id: Date.now(), timestamp: new Date().toISOString() });
    localStorage.setItem(KEYS.RSVPS, JSON.stringify(rsvps));
    storage.logActivity(`New RSVP from ${rsvp.name}: ${rsvp.attending}`);
  },
  getRSVPs: () => JSON.parse(localStorage.getItem(KEYS.RSVPS) || '[]'),

  // ACTIVITY
  logActivity: (message) => {
    const activities = JSON.parse(localStorage.getItem(KEYS.ACTIVITY) || '[]');
    activities.unshift({ message, id: Date.now(), timestamp: new Date().toISOString() });
    localStorage.setItem(KEYS.ACTIVITY, JSON.stringify(activities.slice(0, 100)));
  },
  getActivities: () => JSON.parse(localStorage.getItem(KEYS.ACTIVITY) || '[]'),

  // TRAFFIC
  incrementPageView: () => {
    const traffic = JSON.parse(localStorage.getItem(KEYS.TRAFFIC) || '{"pageViews":0,"uniqueVisitors":0}');
    traffic.pageViews += 1;
    
    if (!sessionStorage.getItem('has_visited')) {
      traffic.uniqueVisitors += 1;
      sessionStorage.setItem('has_visited', 'true');
    }
    
    localStorage.setItem(KEYS.TRAFFIC, JSON.stringify(traffic));
  },
  getTraffic: () => JSON.parse(localStorage.getItem(KEYS.TRAFFIC) || '{"pageViews":0,"uniqueVisitors":0}')
};
