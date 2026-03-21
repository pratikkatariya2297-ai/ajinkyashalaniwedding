import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { 
  subscribeToActivity, 
  subscribeToPresence, 
  isConfigured 
} from '../firebase';

const Admin = () => {
  const [tab, setTab] = useState('dashboard');
  const [data, setData] = useState({
    leads: [],
    rsvps: [],
    logs: [],
    traffic: { pageViews: 0, uniqueVisitors: 0 }
  });
  const [liveActivity, setLiveActivity] = useState([]);
  const [livePresence, setLivePresence] = useState({});

  useEffect(() => {
    // Load initial storage data
    const load = () => {
      setData({
        leads: storage.getLeads(),
        rsvps: storage.getRSVPs(),
        logs: storage.getActivities(),
        traffic: storage.getTraffic()
      });
    };
    
    load();
    const interval = setInterval(load, 5000);

    // Subscribe to Firebase real-time data if configured
    let unsubAct = () => {};
    let unsubPres = () => {};

    if (isConfigured) {
      unsubAct = subscribeToActivity(setLiveActivity);
      unsubPres = subscribeToPresence(setLivePresence);
    }

    return () => {
      clearInterval(interval);
      unsubAct();
      unsubPres();
    };
  }, []);

  const activeUsersCount = Object.keys(livePresence).length;

  const btnStyle = (active) => ({
    padding: '0.75rem 1.25rem',
    background: active ? 'linear-gradient(135deg,#E8650A,#7B3400)' : 'transparent',
    color: active ? '#FFFBF0' : '#FF8C3A',
    border: `1px solid ${active ? '#E8650A' : 'rgba(232,101,10,0.3)'}`,
    cursor: 'pointer',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '0.78rem',
    fontFamily: 'Georgia,serif',
    textAlign: 'left',
    transition: 'all 0.2s',
    borderRadius: '2px',
    boxShadow: active ? '0 4px 0 rgba(26,10,0,0.4), 0 6px 12px rgba(232,101,10,0.3)' : 'none'
  });

  const cardStyle = {
    background: 'linear-gradient(145deg,rgba(92,34,0,0.7),rgba(61,26,0,0.8))',
    border: '1px solid rgba(232,101,10,0.3)',
    padding: '1.75rem',
    flex: 1,
    minWidth: '130px',
    borderTop: '3px solid #E8650A',
    borderRadius: '4px',
    boxShadow: '0 8px 0 rgba(26,10,0,0.3), 0 12px 24px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s'
  };

  const downloadCSV = (type) => {
    const items = type === 'leads' ? data.leads : data.rsvps;
    if (items.length === 0) return;
    
    const headers = Object.keys(items[0]);
    const csvContent = [
      headers.join(','),
      ...items.map(item => headers.map(h => `"${String(item[h] || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `wedding_${type}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,#5C2200_0%,#3D1A00_40%,#1A0A00_100%)] flex text-cream-50 font-serif">
      {/* Sidebar */}
      <nav className="min-w-[225px] bg-[rgba(26,10,0,0.95)] border-r-3 border-gold-500 p-8 flex flex-col gap-3 backdrop-blur-md">
        <div className="mb-8 pb-6 border-b border-gold-500/30">
          <div className="logo-container w-32 h-32 mx-auto mb-4">
            <img src={logo} alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            <div className="logo-shine-overlay" />
          </div>
          <p className="text-gold-400 font-bold text-xl m-0 text-center drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] tracking-widest uppercase">Admin</p>
          <p className="text-cream-100/40 text-[0.6rem] tracking-[3px] uppercase mt-1 text-center">Wedding Control</p>
        </div>
        {[
          ['dashboard', '📊 Dashboard'],
          ['guests', '👥 Guests'],
          ['rsvps', '💌 RSVPs']
        ].map(([k, l]) => (
          <button key={k} style={btnStyle(tab === k)} onClick={() => setTab(k)}>{l}</button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {tab === 'dashboard' && (
          <>
            <div className="flex justify-between items-end mb-8 border-b-2 border-gold-500/30 pb-3">
              <h2 className="text-gold-400 text-3xl m-0 font-bold drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]">System Overview</h2>
              <div className="flex items-center gap-2 bg-gold-500/10 px-4 py-2 rounded-full border border-gold-500/30">
                <div className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-green-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
                <span className="text-[0.7rem] text-cream-100 uppercase tracking-widest">{isConfigured ? 'Firebase Live' : 'Local Fallback'}</span>
              </div>
            </div>

            <div className="flex gap-6 flex-wrap mb-10">
              {[
                ['🟢 Active Now', activeUsersCount],
                ['👁️ Page Views', data.traffic.pageViews],
                ['👥 Visitors', data.traffic.uniqueVisitors],
                ['🎯 Leads', data.leads.length],
                ['💌 RSVPs', data.rsvps.length]
              ].map(([l, v]) => (
                <div key={l} style={cardStyle}>
                  <p className="text-gold-400 text-[0.65rem] tracking-[2px] uppercase mb-3 opacity-80">{l}</p>
                  <p className="text-gold-500 text-5xl font-bold m-0 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">{v}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Presence Panel */}
              <div className="bg-[linear-gradient(145deg,rgba(92,34,0,0.6),rgba(61,26,0,0.7))] border border-gold-500/25 p-8 border-t-3 border-gold-500 rounded-sm shadow-[0_8px_0_rgba(26,10,0,0.3),0_12px_30px_rgba(0,0,0,0.3)] h-[400px] overflow-y-auto">
                <h3 className="text-gold-400 text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="animate-pulse bg-gold-400 rounded-full w-2 h-2" /> Live Guest Presence
                </h3>
                {Object.entries(livePresence).length === 0 ? (
                  <p className="opacity-40 italic text-cream-100">No one currently online.</p>
                ) : (
                  Object.entries(livePresence).map(([id, p]) => (
                    <div key={id} className="bg-black/40 border border-gold-500/10 p-4 mb-2 rounded-sm flex justify-between items-center">
                      <div>
                        <p className="font-bold text-cream-50 m-0">{p.name || 'Anonymous'}</p>
                        <p className="text-gold-400 text-[0.7rem] m-0">
                          {p.device === 'mobile' ? '📱 Mobile' : '💻 Desktop'} • Viewing: <span className="text-cream-100">{p.section || 'Site'}</span>
                        </p>
                      </div>
                      <div className="text-2xl">
                        {p.section === 'Hero' ? '🏰' : p.section === 'Wardrobe' ? '👑' : p.section === 'Timeline' ? '🎊' : p.section === 'Venue' ? '📍' : '✨'}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Activity Stream Panel */}
              <div className="bg-[linear-gradient(145deg,rgba(92,34,0,0.6),rgba(61,26,0,0.7))] border border-gold-500/25 p-8 border-t-3 border-gold-500 rounded-sm shadow-[0_8px_0_rgba(26,10,0,0.3),0_12px_30px_rgba(0,0,0,0.3)] h-[400px] overflow-y-auto">
                <h3 className="text-gold-400 text-xl font-bold mb-6">📡 Activity Stream {isConfigured ? '(Live)' : '(Local)'}</h3>
                {(isConfigured ? liveActivity : data.logs).length === 0 ? (
                  <p className="opacity-40 italic text-cream-100">No activity yet.</p>
                ) : (
                  (isConfigured ? liveActivity : data.logs).map(a => (
                    <div key={a.id} className="border-l-2 pl-4 mb-4" style={{ borderColor: a.type === 'page_view' ? '#4285F4' : a.type === 'scroll_depth' ? '#34A853' : a.type === 'section_viewed' ? '#FBBC05' : '#E8650A' }}>
                      <p className="text-[0.92rem] m-0 text-cream-100">
                        {a.message || `${a.type.replace('_', ' ')} ${a.section ? `(${a.section})` : a.depth ? `(${a.depth}%)` : ''}`}
                      </p>
                      <div className="flex gap-4 text-gold-400 text-[0.65rem] opacity-70">
                        <span>{new Date(a.timestamp).toLocaleTimeString()}</span>
                        {a.device && <span>{a.device}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {tab === 'guests' && (
          <>
            <div className="flex justify-between items-center mb-8 border-b-2 border-gold-500/30 pb-3">
              <h2 className="text-gold-400 text-3xl m-0 font-bold">Captured Leads</h2>
              <button 
                onClick={() => downloadCSV('leads')}
                className="px-4 py-2 bg-gold-500 text-maroon-950 font-bold text-xs rounded-sm hover:translate-y-[-2px] transition-transform shadow-md"
              >
                📥 Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-maroon-900/40 border border-gold-500/25 min-w-[800px] rounded-sm shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
                <thead>
                  <tr className="bg-black/80 border-b-2 border-gold-500">
                    {['Name', 'Phone', 'Location', 'Device', 'Browser', 'Recorded At'].map(h => (
                      <th key={h} className="p-4 text-left text-gold-400 text-[0.7rem] tracking-[2px] uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.leads.length === 0 ? (
                    <tr><td colSpan="6" className="p-8 text-center opacity-40 text-cream-100">No leads yet.</td></tr>
                  ) : (
                    data.leads.map(l => (
                      <tr key={l.id} className="border-b border-gold-500/10">
                        <td className="p-4 text-cream-50 font-bold">{l.name}</td>
                        <td className="p-4 text-cream-100 opacity-85">{l.phone}</td>
                        <td className="p-4 text-cream-100/70 text-sm italic">{l.loc || 'Unknown'}</td>
                        <td className="p-4 text-cream-100/70 text-sm">{l.device || 'Unknown'}</td>
                        <td className="p-4 text-cream-100/70 text-sm">{l.browser || 'Unknown'}</td>
                        <td className="p-4 text-gold-400 text-[0.75rem]">{new Date(l.timestamp).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'rsvps' && (
          <>
            <div className="flex justify-between items-center mb-8 border-b-2 border-gold-500/30 pb-3">
              <h2 className="text-gold-400 text-3xl m-0 font-bold">RSVP Responses</h2>
              <button 
                onClick={() => downloadCSV('rsvps')}
                className="px-4 py-2 bg-gold-500 text-maroon-950 font-bold text-xs rounded-sm hover:translate-y-[-2px] transition-transform shadow-md"
              >
                📥 Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-maroon-900/40 border border-gold-500/25 min-w-[640px] rounded-sm shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
                <thead>
                  <tr className="bg-black/80 border-b-2 border-gold-500">
                    {['Name', 'Email', 'Status', 'Submitted At'].map(h => (
                      <th key={h} className="p-4 text-left text-gold-400 text-[0.7rem] tracking-[2px] uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rsvps.length === 0 ? (
                    <tr><td colSpan="4" className="p-8 text-center opacity-40 text-cream-100">No RSVPs yet.</td></tr>
                  ) : (
                    data.rsvps.map(r => (
                      <tr key={r.id} className="border-b border-gold-500/10">
                        <td className="p-4 text-cream-50 font-bold">{r.name}</td>
                        <td className="p-4 text-cream-100 opacity-85">{r.email}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 border border-gold-500 text-gold-400 text-[0.68rem] uppercase tracking-widest rounded-sm">
                            {r.attending === 'yes' ? 'Attending' : 'Declined'}
                          </span>
                        </td>
                        <td className="p-4 text-gold-400 text-[0.72rem]">{new Date(r.timestamp).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
