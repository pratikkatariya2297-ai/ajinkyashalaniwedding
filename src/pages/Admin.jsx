import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, Eye, CalendarCheck, Crown, Search, Download, Menu, X, MapPin, Smartphone, Clock, Music } from 'lucide-react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

const Admin = () => {
  const [data, setData] = useState({ 
    leads: [], 
    rsvps: [], 
    activities: [], 
    performances: [],
    traffic: { pageViews: 0, uniqueVisitors: 0 } 
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!db) return;

    // Real-time listeners for all data nodes
    const unsubLeads = onValue(ref(db, 'leads'), (snap) => {
      const vals = snap.val() || {};
      setData(prev => ({ ...prev, leads: Object.entries(vals).map(([id, v]) => ({ id, ...v })).sort((a,b) => (b.timestamp || 0) - (a.timestamp || 0)) }));
    });

    const unsubRSVPs = onValue(ref(db, 'rsvps'), (snap) => {
      const vals = snap.val() || {};
      setData(prev => ({ ...prev, rsvps: Object.entries(vals).map(([id, v]) => ({ id, ...v })).sort((a,b) => (b.timestamp || 0) - (a.timestamp || 0)) }));
    });

    const unsubActivity = onValue(ref(db, 'activity'), (snap) => {
      const vals = snap.val() || {};
      const list = Object.entries(vals)
        .map(([id, v]) => ({ id, ...v }))
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 50);
      setData(prev => ({ ...prev, activities: list }));
    });

    const unsubTraffic = onValue(ref(db, 'traffic'), (snap) => {
      setData(prev => ({ ...prev, traffic: snap.val() || { pageViews: 0, uniqueVisitors: 0 } }));
    });

    const unsubPerformances = onValue(ref(db, 'performances'), (snap) => {
      const vals = snap.val() || {};
      setData(prev => ({ ...prev, performances: Object.entries(vals).map(([id, v]) => ({ id, ...v })).sort((a,b) => (b.submittedAt || 0) - (a.submittedAt || 0)) }));
    });

    return () => {
      unsubLeads();
      unsubRSVPs();
      unsubActivity();
      unsubTraffic();
      unsubPerformances();
    };
  }, []);

  const exportCSV = (type) => {
    const items = data[type];
    if (!items || !items.length) return alert('No data to export.');
    
    const headers = Object.keys(items[0]).filter(k => k !== 'id').join(',');
    const rows = items.map(obj => Object.keys(obj).filter(k => k !== 'id').map(k => `"${String(obj[k]).replace(/"/g, '""')}"`).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_export_${new Date().toLocaleDateString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredLeads = data.leads.filter(l => l.name?.toLowerCase().includes(search.toLowerCase()) || l.phone?.includes(search));
  const filteredRSVPs = data.rsvps.filter(r => r.name?.toLowerCase().includes(search.toLowerCase()) || r.email?.toLowerCase().includes(search.toLowerCase()));
  const filteredPerformances = data.performances.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.songTitle?.toLowerCase().includes(search.toLowerCase()));

  const NavButton = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => { setActiveTab(id); setMobileMenuOpen(false); setSearch(''); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium active:scale-95 ${activeTab === id ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-100' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'}`}
    >
      <Icon className={`w-5 h-5 ${activeTab === id ? 'text-orange-500' : 'text-gray-400'}`} /> {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-800">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 text-orange-600">
          <Crown className="w-6 h-6" />
          <h1 className="font-bold text-xl tracking-tight">Admin Dash</h1>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-gray-100 rounded-md text-gray-600 active:scale-95 transition-transform">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-64 lg:w-72 bg-white border-r border-gray-200 h-[calc(100vh-65px)] md:h-screen sticky top-[65px] md:top-0 z-40 p-6 shadow-sm`}>
        <div className="hidden md:flex flex-col items-center mb-10 pb-6 border-b border-gray-100 mt-4">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 border border-orange-100 shadow-sm">
            <Crown className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Royal Dashboard</h1>
          <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase mt-1">Cloud Sync Active</p>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <NavButton id="dashboard" icon={Activity} label="System Overview" />
          <NavButton id="guests" icon={Users} label="Captured Leads" />
          <NavButton id="rsvps" icon={CalendarCheck} label="RSVP Responses" />
          <NavButton id="performances" icon={Music} label="Performance Acts" />
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100 text-center">
          <a href="/" target="_blank" rel="noreferrer" className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline">View Live Site →</a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 md:max-h-screen md:overflow-y-auto bg-gray-50/50">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h2>
              <p className="text-gray-500 mt-1">Real-time cloud data across all devices.</p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Page Views', val: data.traffic.pageViews, icon: Eye, color: 'bg-blue-50 text-blue-600' },
                { label: 'Unique Visitors', val: data.traffic.uniqueVisitors, icon: Activity, color: 'bg-purple-50 text-purple-600' },
                { label: 'Total Leads', val: data.leads.length, icon: Users, color: 'bg-orange-50 text-orange-600' },
                { label: 'Total RSVPs', val: data.rsvps.length, icon: CalendarCheck, color: 'bg-green-50 text-green-600' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
                  </div>
                  <div>
                    <h4 className="text-3xl font-bold text-gray-900">{stat.val}</h4>
                    <p className="text-sm font-medium text-gray-500 mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Cloud Activity
              </h3>
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {data.activities.length === 0 ? (
                  <p className="text-gray-400 italic text-center py-8">No activity recorded yet.</p>
                ) : (
                  data.activities.map((act, i) => (
                    <motion.div key={act.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-orange-100 text-orange-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4 md:group-odd:text-right">
                        <p className="text-gray-800 font-medium">{act.message}</p>
                        <time className="text-xs font-semibold text-gray-400 mt-2 flex items-center gap-1 md:group-odd:justify-end"><Clock className="w-3 h-3"/> {act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}</time>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* GUESTS TAB */}
        {activeTab === 'guests' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Captured Leads</h2>
                <p className="text-gray-500 mt-1 text-sm">Guests who passed the entrance gate.</p>
              </div>
              <div className="flex w-full md:w-auto gap-3">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search leads..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm" />
                </div>
                <button onClick={() => exportCSV('leads')} className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 active:scale-95 transition-all shadow-sm">
                  <Download className="w-4 h-4" /> <span className="hidden md:inline">Export</span>
                </button>
              </div>
            </div>

            <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">IP / Device</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Recorded At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLeads.length === 0 ? (
                      <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No leads found.</td></tr>
                    ) : (
                      filteredLeads.map(lead => (
                        <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs mr-3 shadow-sm">{lead.name?.charAt(0)}</div>
                              <span className="font-semibold text-gray-900">{lead.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-700">{lead.phone}</td>
                          <td className="px-6 py-4 text-gray-600 text-sm flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0"/> {lead.loc || 'Unknown'}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 font-mono text-xs text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded inline-block mb-1">{lead.ip || 'Unknown'}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1"><Smartphone className="w-3.5 h-3.5 text-gray-400 shrink-0"/> {lead.device} • {lead.browser}</div>
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-500 whitespace-nowrap">
                            {lead.timestamp ? new Date(lead.timestamp).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'}) : 'Pending'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Mobile Cards View */}
            <div className="grid gap-4 md:hidden">
              {filteredLeads.map(lead => (
                <div key={lead.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{lead.name}</h3>
                  <p className="text-gray-600 font-medium mb-3">{lead.phone}</p>
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2">
                    <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-400"/> {lead.loc || 'Unknown'}</div>
                    <div className="flex items-center gap-2"><Smartphone className="w-3.5 h-3.5 text-gray-400"/> {lead.device} ({lead.browser})</div>
                    <div className="text-[10px] font-mono text-blue-500">{lead.ip}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* RSVPS TAB */}
        {activeTab === 'rsvps' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">RSVP Responses</h2>
                <p className="text-gray-500 mt-1 text-sm">Official attendance confirmations.</p>
              </div>
              <div className="flex w-full md:w-auto gap-3">
                <Search className="flex-1" />
                <button onClick={() => exportCSV('rsvps')} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all shadow-sm">
                   Export
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRSVPs.length === 0 ? (
                    <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">No RSVPs found.</td></tr>
                  ) : (
                    filteredRSVPs.map(rsvp => (
                      <tr key={rsvp.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">{rsvp.name}</td>
                        <td className="px-6 py-4 text-gray-600">{rsvp.email}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${rsvp.attending === 'yes' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                            {rsvp.attending === 'yes' ? '✓ Attending' : '✕ Declined'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-500 whitespace-nowrap">
                          {rsvp.timestamp ? new Date(rsvp.timestamp).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'}) : 'Just now'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* PERFORMANCES TAB */}
        {activeTab === 'performances' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Performance Acts</h2>
                <p className="text-gray-500 mt-1 text-sm">Guests who signed up to perform.</p>
              </div>
              <button onClick={() => exportCSV('performances')} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all shadow-sm">
                Export Acts
              </button>
            </div>

            <div className="grid gap-6">
              {filteredPerformances.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl border border-dashed border-gray-300 text-gray-500">No performance signups yet.</div>
              ) : (
                filteredPerformances.map(act => (
                  <div key={act.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                    <div className="bg-orange-600 p-6 md:w-48 flex flex-col items-center justify-center text-white text-center">
                      <Music className="w-10 h-10 mb-2 opacity-80" />
                      <p className="font-bold text-sm uppercase tracking-widest">{act.type || 'Act'}</p>
                      <p className="text-[10px] opacity-70 mt-1">{act.duration}</p>
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{act.songTitle || 'Untitled Act'}</h3>
                          <p className="text-orange-600 font-semibold">{act.name}</p>
                        </div>
                        <div className="text-right">
                           <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter block">{act.event}</span>
                           <span className="text-[10px] text-gray-500">{act.phone}</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                        <span>Submitted on {act.submittedAt ? new Date(act.submittedAt).toLocaleDateString() : 'Realtime'}</span>
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Admin;

