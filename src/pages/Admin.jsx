import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, Eye, CalendarCheck, Crown } from 'lucide-react';
import { storage } from '../utils/storage';

const Admin = () => {
  const [data, setData] = useState({
    leads: [], rsvps: [], activities: [], traffic: { pageViews: 0, uniqueVisitors: 0 }
  });
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchData = () => {
    setData({
      leads: storage.getLeads(), rsvps: storage.getRSVPs(),
      activities: storage.getActivities(), traffic: storage.getTraffic()
    });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-maroon-950 text-cream-50 font-sans flex flex-col md:flex-row selection:bg-gold-500/40 relative">
      <div className="absolute inset-0 bg-jaali opacity-20 pointer-events-none mix-blend-color-burn" />
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-maroon-900 border-r-4 border-gold-500 p-8 flex flex-col shrink-0 relative z-10 shadow-[5px_0_20px_rgba(0,0,0,0.5)]">
        <div className="mb-14 text-center md:text-left mt-4 border-b border-gold-500/30 pb-8">
          <Crown className="w-12 h-12 text-gold-500 mx-auto md:mx-0 mb-4 drop-shadow-md" />
          <h1 className="text-3xl font-serif text-gold-500 tracking-wide font-bold">Royal Admin</h1>
          <p className="text-cream-100/70 text-[10px] font-bold tracking-[0.3em] uppercase mt-2">Invitation Control</p>
        </div>

        <nav className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-4 px-5 py-4 rounded-md transition-all whitespace-nowrap font-bold tracking-wide uppercase text-sm border-2 ${activeTab === 'dashboard' ? 'bg-cream-50 text-maroon-950 border-gold-500 shadow-md transform translate-x-1' : 'text-cream-50/70 border-transparent hover:border-gold-500/30 hover:bg-maroon-950'}`}
          >
            <Activity className="w-5 h-5 flex-shrink-0" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('guests')}
            className={`flex items-center gap-4 px-5 py-4 rounded-md transition-all whitespace-nowrap font-bold tracking-wide uppercase text-sm border-2 ${activeTab === 'guests' ? 'bg-cream-50 text-maroon-950 border-gold-500 shadow-md transform translate-x-1' : 'text-cream-50/70 border-transparent hover:border-gold-500/30 hover:bg-maroon-950'}`}
          >
            <Users className="w-5 h-5 flex-shrink-0" /> Guests / Leads
          </button>
          <button 
            onClick={() => setActiveTab('rsvps')}
            className={`flex items-center gap-4 px-5 py-4 rounded-md transition-all whitespace-nowrap font-bold tracking-wide uppercase text-sm border-2 ${activeTab === 'rsvps' ? 'bg-cream-50 text-maroon-950 border-gold-500 shadow-md transform translate-x-1' : 'text-cream-50/70 border-transparent hover:border-gold-500/30 hover:bg-maroon-950'}`}
          >
            <CalendarCheck className="w-5 h-5 flex-shrink-0" /> RSVPs
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-14 md:h-screen md:overflow-y-auto w-full relative z-10 transition-all">
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h2 className="text-4xl font-serif text-gold-500 mb-10 font-bold border-b-2 border-gold-500/20 pb-4 inline-block">System Overview</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
              <div className="bg-maroon-900 p-8 rounded-lg border-2 border-gold-500/30 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gold-500/10 rounded-bl-full group-hover:scale-110 transition-transform" />
                <div className="flex items-center justify-between mb-6">
                  <span className="text-cream-50/80 text-xs uppercase tracking-[0.2em] font-bold">Page Views</span>
                  <Eye className="w-6 h-6 text-gold-500" />
                </div>
                <div className="text-5xl font-serif text-gold-500 font-bold drop-shadow-sm">{data.traffic.pageViews}</div>
              </div>
              
              <div className="bg-maroon-900 p-8 rounded-lg border-2 border-gold-500/30 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gold-500/10 rounded-bl-full group-hover:scale-110 transition-transform" />
                <div className="flex items-center justify-between mb-6">
                  <span className="text-cream-50/80 text-xs uppercase tracking-[0.2em] font-bold">Unique Visitors</span>
                  <Users className="w-6 h-6 text-gold-500" />
                </div>
                <div className="text-5xl font-serif text-gold-500 font-bold drop-shadow-sm">{data.traffic.uniqueVisitors}</div>
              </div>

              <div className="bg-maroon-900 p-8 rounded-lg border-2 border-gold-500/30 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gold-500/10 rounded-bl-full group-hover:scale-110 transition-transform" />
                <div className="flex items-center justify-between mb-6">
                  <span className="text-cream-50/80 text-xs uppercase tracking-[0.2em] font-bold">Total Leads</span>
                  <Users className="w-6 h-6 text-gold-500" />
                </div>
                <div className="text-5xl font-serif text-gold-500 font-bold drop-shadow-sm">{data.leads.length}</div>
              </div>

              <div className="bg-maroon-900 p-8 rounded-lg border-2 border-gold-500/30 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gold-500/10 rounded-bl-full group-hover:scale-110 transition-transform" />
                <div className="flex items-center justify-between mb-6">
                  <span className="text-cream-50/80 text-xs uppercase tracking-[0.2em] font-bold">Total RSVPs</span>
                  <CalendarCheck className="w-6 h-6 text-gold-500" />
                </div>
                <div className="text-5xl font-serif text-gold-500 font-bold drop-shadow-sm">{data.rsvps.length}</div>
              </div>
            </div>

            {/* Activity Stream */}
            <div className="bg-maroon-900 p-8 rounded-lg border-2 border-gold-500/30 shadow-xl max-w-4xl">
              <h3 className="text-2xl font-serif text-gold-500 mb-8 font-bold flex items-center gap-3">
                <Activity className="w-5 h-5" /> Real-Time Activity
              </h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 hide-scrollbar">
                {data.activities.length === 0 ? (
                  <p className="text-cream-50/50 font-light italic">No activity recorded yet.</p>
                ) : (
                  data.activities.map(act => (
                    <motion.div 
                      key={act.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-5 items-start border-b border-gold-500/10 pb-5 last:border-0"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-gold-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(212,175,55,1)]" />
                      <div>
                        <p className="text-cream-50 font-medium text-lg leading-snug">{act.message}</p>
                        <p className="text-gold-500/60 text-xs mt-2 font-mono uppercase tracking-widest">{new Date(act.timestamp).toLocaleString()}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Guests / Leads Tab */}
        {activeTab === 'guests' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h2 className="text-4xl font-serif text-gold-500 mb-10 font-bold border-b-2 border-gold-500/20 pb-4 inline-block">Captured Leads</h2>
            <div className="bg-maroon-900 border-2 border-gold-500/30 rounded-lg overflow-x-auto shadow-2xl max-w-5xl">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-maroon-950/80 border-b border-gold-500/30">
                  <tr>
                    <th className="p-6 text-gold-500 font-sans tracking-[0.2em] text-xs uppercase font-bold">Name</th>
                    <th className="p-6 text-gold-500 font-sans tracking-[0.2em] text-xs uppercase font-bold">Phone</th>
                    <th className="p-6 text-gold-500 font-sans tracking-[0.2em] text-xs uppercase font-bold">Recorded At</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leads.length === 0 ? (
                    <tr><td colSpan="3" className="p-8 text-center text-cream-50/50 italic">No leads captured yet.</td></tr>
                  ) : (
                    data.leads.map(lead => (
                      <tr key={lead.id} className="border-t border-gold-500/10 hover:bg-gold-500/5 transition-colors">
                        <td className="p-6 font-serif text-lg tracking-wide">{lead.name}</td>
                        <td className="p-6 font-medium">{lead.phone}</td>
                        <td className="p-6 text-gold-500/60 text-xs font-mono tracking-widest uppercase">{new Date(lead.timestamp).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* RSVPs Tab */}
        {activeTab === 'rsvps' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h2 className="text-4xl font-serif text-gold-500 mb-10 font-bold border-b-2 border-gold-500/20 pb-4 inline-block">RSVP Responses</h2>
            <div className="bg-maroon-900 border-2 border-gold-500/30 rounded-lg overflow-x-auto shadow-2xl max-w-6xl">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-maroon-950/80 border-b border-gold-500/30">
                  <tr>
                    <th className="p-6 text-gold-500 font-sans tracking-[0.2em] text-xs uppercase font-bold">Name</th>
                    <th className="p-6 text-gold-500 font-sans tracking-[0.2em] text-xs uppercase font-bold">Email</th>
                    <th className="p-6 text-gold-500 font-sans tracking-[0.2em] text-xs uppercase font-bold">Status</th>
                    <th className="p-6 text-gold-500 font-sans tracking-[0.2em] text-xs uppercase font-bold">Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rsvps.length === 0 ? (
                    <tr><td colSpan="4" className="p-8 text-center text-cream-50/50 italic">No RSVPs yet.</td></tr>
                  ) : (
                    data.rsvps.map(rsvp => (
                      <tr key={rsvp.id} className="border-t border-gold-500/10 hover:bg-gold-500/5 transition-colors">
                        <td className="p-6 font-serif text-lg font-bold tracking-wide">{rsvp.name}</td>
                        <td className="p-6 text-cream-50/80 font-medium">{rsvp.email}</td>
                        <td className="p-6">
                          <span className={`px-4 py-2 border-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${rsvp.attending === 'yes' ? 'bg-gold-500/10 text-gold-500 border-gold-500/50' : 'bg-cream-50/5 text-cream-50/70 border-cream-50/30'}`}>
                            {rsvp.attending === 'yes' ? 'Attending' : 'Declined'}
                          </span>
                        </td>
                        <td className="p-6 text-gold-500/60 text-xs font-mono tracking-widest uppercase">{new Date(rsvp.timestamp).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Admin;
