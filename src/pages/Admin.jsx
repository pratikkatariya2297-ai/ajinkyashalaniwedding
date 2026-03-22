import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Activity, Eye, CalendarCheck, Crown, Search, Download, Menu, X, MapPin, Smartphone, Clock, Music, ArrowRight, Filter, ChevronRight, Star } from 'lucide-react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { subscribeToPresence } from '../firebase';

const Admin = () => {
  const [data, setData] = useState({ 
    leads: [], 
    rsvps: [], 
    activities: [], 
    performances: [],
    traffic: { pageViews: 0, uniqueVisitors: 0 },
    dailyTraffic: [],
    presence: {}
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('admin_auth') === 'true');
  const [pin, setPin] = useState('');

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
      const val = snap.val() || {};
      const daily = val.daily ? Object.entries(val.daily)
        .map(([date, stats]) => ({ date, ...stats }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-14) : []; // Last 14 days
      setData(prev => ({ ...prev, traffic: val, dailyTraffic: daily }));
    });

    const unsubPerformances = onValue(ref(db, 'performances'), (snap) => {
      const vals = snap.val() || {};
      setData(prev => ({ ...prev, performances: Object.entries(vals).map(([id, v]) => ({ id, ...v })).sort((a,b) => (b.submittedAt || 0) - (a.submittedAt || 0)) }));
    });

    const unsubPresence = subscribeToPresence((pres) => {
      setData(prev => ({ ...prev, presence: pres }));
    });

    return () => {
      unsubLeads(); unsubRSVPs(); unsubActivity(); unsubTraffic(); unsubPerformances(); unsubPresence();
    };
  }, []);

  const exportCSV = (type) => {
    const items = data[type];
    if (!items || !items.length) return alert('No data to export.');
    const headers = Object.keys(items[0]).filter(k => k !== 'id').join(',');
    const rows = items.map(obj => Object.keys(obj).filter(k => k !== 'id').map(k => `"${String(obj[k]).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
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
      className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-500 font-bold group relative overflow-hidden ${activeTab === id ? 'text-maroon-950 scale-105' : 'text-cream-100/60 hover:text-gold-500'}`}
    >
      {activeTab === id && (
         <motion.div layoutId="navBG" className="absolute inset-0 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 z-0" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
      )}
      <div className="flex items-center gap-4 relative z-10 transition-transform group-hover:translate-x-1">
        <Icon className={`w-5 h-5 ${activeTab === id ? 'text-maroon-950' : 'text-gold-500/50 group-hover:text-gold-500'}`} /> 
        <span className="tracking-widest uppercase text-[11px] font-sans">{label}</span>
      </div>
      {activeTab === id && <ChevronRight className="w-4 h-4 relative z-10 text-maroon-950" />}
    </button>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-maroon-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="fixed inset-0 z-0 bg-jaali opacity-20 pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-3xl p-10 rounded-[3rem] border-2 border-gold-500/30 w-full max-w-md text-center shadow-4xl relative z-10"
        >
          <div className="w-20 h-20 bg-gold-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-gold-500/20 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
            <Crown className="w-10 h-10 text-gold-500 animate-glow-pulse" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-cream-50 mb-2 uppercase tracking-widest">Royal Access</h2>
          <p className="text-gold-500/40 text-[10px] font-bold uppercase tracking-[0.4em] mb-10">Private Landing • Admin Only</p>
          
          <div className="space-y-6">
            <input 
              type="password" placeholder="Enter Secret PIN" value={pin} onChange={e=>setPin(e.target.value)}
              className="w-full bg-white/5 border border-gold-500/20 rounded-2xl py-4 px-6 text-center text-2xl tracking-[1em] text-gold-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all font-bold placeholder:text-white/10 placeholder:tracking-normal placeholder:text-sm"
              onKeyDown={e => { if(e.key === 'Enter' && pin === '2297') { setIsAuthenticated(true); sessionStorage.setItem('admin_auth', 'true'); } }}
            />
            <button 
              onClick={() => { if(pin === '2297') { setIsAuthenticated(true); sessionStorage.setItem('admin_auth', 'true'); } else { alert('Access Denied'); setPin(''); } }}
              className="w-full bg-gold-500 text-maroon-950 font-bold py-4 rounded-2xl uppercase tracking-[0.2em] text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              Unlock Dashboard
            </button>
          </div>
          <p className="mt-8 text-[9px] text-white/20 uppercase tracking-[0.2em]">Secured by Ivory Tech Solutions</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-maroon-950 flex flex-col md:flex-row font-sans text-cream-50 relative overflow-hidden selection:bg-gold-500 selection:text-maroon-950">
      
      {/* Dynamic Royal Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-maroon-950 via-[#2a050d] to-black opacity-100"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 bg-jaali opacity-20 mix-blend-color-burn" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent shadow-[0_0_20px_rgba(212,175,55,1)]" />
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-maroon-950/90 backdrop-blur-md border-b border-gold-500/30 p-4 flex justify-between items-center sticky top-0 z-[100] shadow-2xl">
        <div className="flex items-center gap-3 text-gold-500">
          <Crown className="w-6 h-6 animate-glow-pulse" />
          <h1 className="font-serif font-bold text-xl tracking-[0.1em] uppercase">Admin Portal</h1>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-gold-500/20 rounded-lg text-gold-500 active:scale-95 transition-all border border-gold-500/40">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-72 lg:w-80 bg-black/40 backdrop-blur-2xl border-r border-gold-500/20 h-[calc(100vh-65px)] md:h-screen sticky top-[65px] md:top-0 z-50 p-6 shadow-[20px_0_40px_rgba(0,0,0,0.5)]`}>
        <div className="hidden md:flex flex-col items-center mb-12 pb-8 border-b border-gold-500/10 mt-6 relative">
          <motion.div 
            className="w-20 h-20 bg-gradient-to-br from-gold-600 to-gold-400 rounded-3xl flex items-center justify-center mb-5 border-2 border-white/20 shadow-[0_0_40px_rgba(212,175,55,0.3)] animate-float"
            whileHover={{ rotate: 15, scale: 1.1 }}
          >
            <Crown className="w-10 h-10 text-maroon-950" />
          </motion.div>
          <h1 className="text-2xl font-serif font-bold text-gold-500 tracking-widest text-center">Royal Panel</h1>
          <p className="text-[10px] font-bold tracking-[0.4em] text-gold-500/40 uppercase mt-2 font-sans">Ajinkya & Shalini</p>
        </div>

        <nav className="flex flex-col gap-3 flex-1">
          <NavButton id="dashboard" icon={Activity} label="Core Insights" />
          <NavButton id="guests" icon={Users} label="Guest Leads" />
          <NavButton id="rsvps" icon={CalendarCheck} label="RSVP Tracker" />
          <NavButton id="performances" icon={Music} label="Sangeet Acts" />
        </nav>

        <div className="mt-auto pt-8 border-t border-gold-500/10 text-center font-sans">
          <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-gold-500 hover:text-gold-400 uppercase tracking-widest transition-all group">
            Return to Site <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </a>
          <p className="text-[9px] text-white/20 uppercase mt-6 tracking-[0.2em]">Sync Status: Live</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 md:p-10 lg:p-14 md:max-h-screen md:overflow-y-auto relative z-10 custom-scrollbar">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 relative">
           <div>
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
               <span className="text-gold-500/60 font-sanskrit text-sm tracking-[0.4em] font-bold mb-2 block uppercase">॥ शुभ लाभ ॥</span>
               <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-cream-50 leading-tight">
                 {activeTab === 'dashboard' ? 'Overview' : activeTab === 'performances' ? 'Acts List' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
               </h2>
             </motion.div>
           </div>
           
           <div className="flex items-center gap-4 w-full md:w-auto font-sans">
             <div className="relative flex-1 md:w-80 group">
               <div className="absolute inset-0 bg-gold-500/10 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
               <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50" />
               <input 
                 type="text" placeholder={`Search ${activeTab}...`} value={search} onChange={e=>setSearch(e.target.value)} 
                 className="w-full pl-12 pr-6 py-4 bg-white/5 backdrop-blur-xl border border-gold-500/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500/80 transition-all font-medium placeholder-maroon-100/30 shadow-2xl text-cream-50" 
               />
             </div>
             {activeTab !== 'dashboard' && (
               <button onClick={() => exportCSV(activeTab)} className="p-4 bg-gold-500 text-maroon-950 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95 transition-all border border-white/20">
                 <Download className="w-5 h-5" />
               </button>
             )}
           </div>
        </div>

        <AnimatePresence mode="wait">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 font-sans">
                {[
                  { label: 'Total Views', val: data.traffic.pageViews, icon: Eye, bg: 'from-blue-600/20 to-blue-400/5', border: 'border-blue-500/30', color: 'text-blue-400' },
                  { label: 'Guests Joined', val: data.traffic.uniqueVisitors, icon: Activity, bg: 'from-purple-600/20 to-purple-400/5', border: 'border-purple-500/30', color: 'text-purple-400' },
                  { label: 'Leads Hooked', val: data.leads.length, icon: Users, bg: 'from-orange-600/20 to-orange-400/5', border: 'border-orange-500/30', color: 'text-orange-400' },
                  { label: 'Live Now', val: Object.keys(data.presence || {}).length, icon: Smartphone, bg: 'from-green-600/20 to-green-400/5', border: 'border-green-500/30', color: 'text-green-400' }
                ].map((stat, i) => (
                  <motion.div key={i} className={`bg-gradient-to-br ${stat.bg} ${stat.border} p-6 rounded-3xl backdrop-blur-xl border relative group hover:scale-[1.02] transition-all`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><stat.icon className="w-12 h-12" /></div>
                    <div className={`p-3 rounded-2xl bg-black/40 w-fit mb-6 shadow-inner ${stat.color}`}><stat.icon className="w-6 h-6" /></div>
                    <div>
                      <h4 className="text-4xl font-bold font-serif mb-1 tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{stat.val}</h4>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold-500/60">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
                <div className="lg:col-span-2 flex flex-col gap-8">
                  {/* Daily Traffic Chart */}
                  <div className="bg-black/30 backdrop-blur-2xl rounded-4xl border border-gold-500/10 p-8 shadow-3xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-jaali opacity-5 pointer-events-none" />
                    <div className="flex justify-between items-center mb-8 relative z-10">
                      <h3 className="text-2xl font-serif font-bold text-gold-500 flex items-center gap-3">
                        <Eye className="w-6 h-6" /> Daily Insights
                      </h3>
                      <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gold-500" /> Views</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400" /> Visitors</div>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto relative z-10 pt-4 custom-scrollbar pb-2">
                      <div className="h-72 flex items-end gap-2 md:gap-4 min-w-[600px] md:min-w-0 relative px-10">
                        {/* Y-Axis Grid Lines & Labels */}
                        <div className="absolute inset-x-0 inset-y-0 pointer-events-none flex flex-col justify-between pt-4 pb-12">
                           {[1, 0.75, 0.5, 0.25, 0].map((tick, idx) => {
                             const max = Math.max(...data.dailyTraffic.map(d => d.pageViews || 1), 1);
                             const val = Math.round(max * tick);
                             return (
                               <div key={idx} className="w-full flex items-center gap-4 relative">
                                 <span className="w-8 text-[9px] font-bold text-white/20 text-right">{val}</span>
                                 <div className="flex-1 h-[1px] bg-white/5 shadow-[0_0_10px_rgba(255,255,255,0.02)]" />
                               </div>
                             );
                           })}
                        </div>

                        {data.dailyTraffic.length === 0 ? (
                          <div className="w-full flex items-center justify-center py-20">
                            <p className="text-white/10 italic text-xs uppercase tracking-widest">No daily data Yet...</p>
                          </div>
                        ) : (
                          data.dailyTraffic.map((day, i) => {
                            const max = Math.max(...data.dailyTraffic.map(d => d.pageViews || 1), 1);
                            const viewsHeight = (day.pageViews / max) * 100;
                            const uniqueHeight = ((day.uniqueVisitors || 0) / max) * 100;

                            return (
                              <div key={day.date} className="flex-1 flex flex-col items-center gap-3 group/bar z-10">
                                <div className="w-full flex flex-col items-center justify-end gap-1 h-56 relative group/inner">
                                  {/* Tooltip */}
                                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-maroon-900/90 backdrop-blur-md border border-gold-500/30 text-gold-500 text-[10px] font-bold px-3 py-2 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-30 shadow-2xl scale-75 group-hover/bar:scale-100 -translate-y-2 group-hover/bar:translate-y-0">
                                    <div className="flex flex-col gap-1 items-center">
                                      <span className="text-white/60 text-[8px] uppercase tracking-widest mb-1">{new Date(day.date).toLocaleDateString([], {month:'short', day:'numeric'})}</span>
                                      <span>{day.pageViews} Total Views</span>
                                      <span className="text-blue-400">{day.uniqueVisitors || 0} Unique Guests</span>
                                    </div>
                                    {/* Tooltip Arrow */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gold-500/30" />
                                  </div>

                                  {/* Page Views Bar */}
                                  <motion.div 
                                    className="w-full relative rounded-t-xl overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.1)] group-hover/bar:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all"
                                    initial={{ height: 0 }} 
                                    animate={{ height: `${viewsHeight}%` }}
                                    transition={{ type: 'spring', damping: 15, stiffness: 100, delay: i * 0.05 }}
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-t from-gold-600 via-gold-500 to-gold-400 group-hover/bar:from-gold-500 group-hover/bar:to-gold-300 transition-colors" />
                                    <div className="absolute inset-0 opacity-30 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-pulse" />
                                  </motion.div>

                                  {/* Unique Visitors Bar */}
                                  <motion.div 
                                    className="w-[70%] absolute bottom-0 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md shadow-lg border-t border-white/20 z-20 group-hover/bar:from-blue-500 group-hover/bar:to-blue-300"
                                    initial={{ height: 0 }} 
                                    animate={{ height: `${uniqueHeight}%` }}
                                    transition={{ type: 'spring', damping: 12, stiffness: 100, delay: i * 0.05 + 0.2 }}
                                  />
                                  
                                  {/* Glass Highlight on Bar */}
                                  <div className="absolute inset-0 group-hover/bar:bg-white/5 transition-colors pointer-events-none rounded-t-xl" />
                                </div>
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-tight group-hover/bar:text-gold-500 group-hover/bar:scale-110 transition-all">
                                  {day.date.split('-').slice(2).join('/')}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Live Pulse Feed */}
                  <div className="bg-black/30 backdrop-blur-2xl rounded-4xl border border-gold-500/10 p-8 shadow-3xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-jaali opacity-5 pointer-events-none" />
                    <h3 className="text-2xl font-serif font-bold text-gold-500 mb-8 flex items-center gap-3">
                      <Activity className="w-6 h-6 animate-pulse" /> Live Pulse Feed
                    </h3>
                    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                      {data.activities.length === 0 ? (
                        <p className="text-white/20 italic text-center py-20 uppercase tracking-[0.3em] text-xs">Awaiting Activity...</p>
                      ) : (
                        data.activities.map((act, i) => (
                          <motion.div key={act.id} className="flex gap-5 group items-start relative px-4 py-4 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-gold-500/10">
                            <div className="h-10 w-10 shrink-0 bg-gold-500/10 border border-gold-500/20 rounded-xl flex items-center justify-center text-gold-500 shadow-xl group-hover:rotate-12 transition-transform">
                               <Clock className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <p className="text-cream-50/90 font-medium text-sm leading-relaxed">{act.message}</p>
                              <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase mt-2 block">
                                {act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Real-time Entry'}
                              </span>
                            </div>
                            {i === 0 && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-gold-500"></span></span>}
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6 font-sans">
                  <div className="bg-gradient-to-br from-gold-600/10 to-transparent backdrop-blur-2xl rounded-4xl border border-gold-500/20 p-8 shadow-2xl overflow-hidden relative">
                    <div className="absolute -right-10 -bottom-10 opacity-5 rotate-12"><Crown className="w-40 h-40" /></div>
                    <h3 className="text-lg font-serif font-bold text-gold-500 mb-4">Quick Insights</h3>
                    <div className="space-y-6">
                       <div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 font-sans">Conversion Rate</p>
                         <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                           <motion.div className="h-full bg-gold-500 shadow-[0_0_10px_rgba(212,175,55,0.5)]" initial={{ width: 0 }} animate={{ width: `${(data.rsvps.length / (data.traffic.uniqueVisitors || 1) * 100).toFixed(0)}%` }} transition={{ duration: 2, delay: 0.5 }} />
                         </div>
                       </div>
                       <div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 font-sans">Lead Engagement</p>
                         <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                           <motion.div className="h-full bg-orange-500" initial={{ width: 0 }} animate={{ width: `${(data.leads.length / (data.traffic.uniqueVisitors || 1) * 100).toFixed(0)}%` }} transition={{ duration: 2, delay: 0.7 }} />
                         </div>
                       </div>
                    </div>
                  </div>
                  
                  <div className="bg-maroon-900/30 backdrop-blur-2xl rounded-4xl border border-gold-500/10 p-8 shadow-2xl flex flex-col items-center text-center font-sans">
                    <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center mb-4 border border-gold-500/20">
                      <Music className="w-8 h-8 text-gold-500" />
                    </div>
                    <h4 className="font-serif text-xl text-cream-50 font-bold mb-1">{data.performances.length} Registered Acts</h4>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-6 font-sans">Sangeet Lineup</p>
                    <button onClick={() => setActiveTab('performances')} className="px-6 py-2 bg-gold-500/10 border border-gold-500/30 text-gold-500 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-gold-500 hover:text-maroon-950 transition-all font-sans">View Full Lineup</button>
                  </div>

                  {/* Live Guests List */}
                  {Object.keys(data.presence).length > 0 && (
                    <div className="bg-green-500/5 backdrop-blur-2xl rounded-4xl border border-green-500/20 p-8 shadow-2xl font-sans">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                        <h3 className="text-lg font-serif font-bold text-green-400 capitalize">Online Now</h3>
                      </div>
                      <div className="space-y-4">
                        {Object.entries(data.presence).map(([id, p]) => (
                          <div key={id} className="flex items-center justify-between group/live">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-[10px] font-bold text-green-500 border border-green-500/20 group-hover/live:bg-green-500 group-hover/live:text-maroon-950 transition-all">
                                {p.name?.charAt(0) || 'G'}
                              </div>
                              <div className="text-left">
                                <p className="text-xs font-bold text-cream-50/80 group-hover/live:text-green-400 transition-colors uppercase tracking-tight">{p.name || 'Anonymous'}</p>
                                <p className="text-[9px] text-white/20 uppercase tracking-widest font-bold">{p.device} • {p.section || 'Browsing'}</p>
                              </div>
                            </div>
                            <span className="text-[9px] font-mono text-green-500/40 font-bold tracking-tighter">LIVE</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* PERFORMANCE TAB */}
          {activeTab === 'performances' && (
            <motion.div key="acts" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}>
               <div className="mb-10 flex items-center gap-4">
                 <div className="p-3 bg-gold-500/20 rounded-2xl border border-gold-500/30"><Music className="w-8 h-8 text-gold-500" /></div>
                 <div className="font-sans">
                   <h3 className="text-2xl font-serif font-bold text-gold-500">Official Festival Lineup</h3>
                   <p className="text-xs text-white/40 uppercase tracking-[0.2em] font-bold">Total {data.performances.length} Acts Registered</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
                {filteredPerformances.length === 0 ? (
                  <div className="col-span-2 bg-black/20 p-20 text-center rounded-5xl border-2 border-dashed border-gold-500/10">
                    <Music className="w-12 h-12 mx-auto mb-4 text-white/10" />
                    <p className="text-white/20 italic tracking-[0.3em] font-bold uppercase text-xs">No acts signed up yet...</p>
                  </div>
                ) : (
                  filteredPerformances.map((act, idx) => (
                    <motion.div 
                      key={act.id} 
                      className="group relative bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-gold-500/20 overflow-hidden shadow-2xl hover:border-gold-500/60 transition-all duration-500 flex flex-col md:flex-row h-full min-h-[220px]"
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      {/* Left visual bar */}
                      <div className="bg-gradient-to-b from-gold-600 to-gold-400 md:w-24 p-6 flex flex-col items-center justify-between text-maroon-950 shrink-0">
                        <div className="font-serif text-3xl font-black">#{idx + 1}</div>
                        <div className="rotate-0 md:-rotate-90 md:mb-12 whitespace-nowrap font-bold tracking-[0.3em] uppercase text-[10px]">
                          {act.type || 'Showcase'}
                        </div>
                        <Star className="w-5 h-5 fill-maroon-950/20" />
                      </div>

                      {/* Info body */}
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                           <div>
                             <h4 className="text-2xl font-serif font-bold text-cream-50 mb-1 group-hover:text-gold-400 transition-colors uppercase tracking-tight">{act.songTitle || 'Untitled Performance'}</h4>
                             <p className="text-gold-500 font-bold tracking-widest text-[11px] uppercase">{act.name}</p>
                           </div>
                           <div className="text-right">
                             <div className="px-3 py-2 bg-gold-500/10 border border-gold-500/30 rounded-full text-[9px] font-black text-gold-500 uppercase tracking-[0.2em] shadow-sm mb-2">{act.event}</div>
                             <div className="text-[10px] font-medium text-white/30 font-mono tracking-tighter">{act.phone || act.contact}</div>
                           </div>
                        </div>

                        <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-white/5 font-sans">
                           <div className="flex items-center gap-2">
                             <Clock className="w-3.5 h-3.5 text-gold-500/60" />
                             <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{act.duration || 'Unset Duration'}</span>
                           </div>
                           <div className="flex items-center gap-2 justify-end">
                             <span className="text-[9px] font-medium text-white/20 italic">
                               {act.submittedAt ? new Date(act.submittedAt).toLocaleDateString() : 'Live Entry'}
                             </span>
                           </div>
                        </div>
                      </div>
                      
                      {/* Decoration circle */}
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold-500/5 rounded-full blur-2xl group-hover:bg-gold-500/10 transition-all pointer-events-none" />
                    </motion.div>
                  ))
                )}
               </div>
            </motion.div>
          )}

          {/* GUESTS TAB */}
          {activeTab === 'guests' && (
            <motion.div key="leads" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-black/30 backdrop-blur-3xl rounded-[2.5rem] border border-gold-500/10 overflow-hidden shadow-4xl mb-20 relative font-sans">
               <div className="absolute inset-0 bg-jaali opacity-5 pointer-events-none" />
               <div className="overflow-x-auto relative z-10 custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead className="bg-gold-500/10 border-b border-gold-500/30">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-bold text-gold-500 uppercase tracking-[0.3em]">Full Name</th>
                      <th className="px-8 py-6 text-[10px] font-bold text-gold-500 uppercase tracking-[0.3em]">Contact</th>
                      <th className="px-8 py-6 text-[10px] font-bold text-gold-500 uppercase tracking-[0.3em]">Origin / Location</th>
                      <th className="px-8 py-6 text-[10px] font-bold text-gold-500 uppercase tracking-[0.3em]">Tech Stack</th>
                      <th className="px-8 py-6 text-[10px] font-bold text-gold-500 uppercase tracking-[0.3em] text-right">Captured At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-500/5">
                    {filteredLeads.map(lead => (
                      <tr key={lead.id} className="hover:bg-white/5 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gold-600 to-gold-400 text-maroon-950 flex items-center justify-center font-black text-xs shadow-lg ring-2 ring-gold-500/20 group-hover:scale-110 transition-transform">
                              {lead.name?.charAt(0)}
                            </div>
                            <span className="font-bold text-cream-50 group-hover:text-gold-400 transition-colors uppercase tracking-tight">{lead.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 font-mono text-xs text-gold-500/80 group-hover:text-gold-500 transition-colors uppercase tracking-tighter">{lead.phone}</td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2 text-white/50 group-hover:text-white/80 transition-all font-medium text-xs">
                             <MapPin className="w-3.5 h-3.5 text-gold-500/50" /> {lead.loc || 'Global Guest'}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex flex-col gap-1.5">
                             <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/10 rounded-md w-fit">
                               <Smartphone className="w-3.5 h-3.5 text-gold-500" />
                               <span className="text-[9px] font-bold uppercase tracking-wider text-white/40">{lead.device} • {lead.browser}</span>
                             </div>
                             <span className="text-[9px] font-mono text-blue-400/50 block tracking-tighter">{lead.ip}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right font-bold text-white/20 text-[10px] tracking-widest uppercase shadow-sm">
                          {lead.timestamp ? new Date(lead.timestamp).toLocaleDateString([], {month:'short', day:'numeric'}) : 'Realtime'}
                        </td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && <tr><td colSpan="5" className="py-20 text-center text-white/20 italic tracking-[0.2em] font-bold uppercase">Database Clear</td></tr>}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* RSVPS TAB */}
          {activeTab === 'rsvps' && (
            <motion.div key="rsvps_tab" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-black/30 backdrop-blur-3xl rounded-[2.5rem] border border-gold-500/10 overflow-hidden shadow-4xl mb-20 font-sans">
               <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[900px]">
                   <thead className="bg-gold-500/10 border-b border-gold-500/30">
                    <tr>
                      <th className="px-10 py-6 text-[10px] font-bold text-gold-500 uppercase tracking-[0.3em]">Confirm Name</th>
                      <th className="px-10 py-6 text-[10px] font-bold text-gold-500 uppercase tracking-[0.3em]">Guest Outreach</th>
                      <th className="px-10 py-6 text-[10px] font-bold text-gold-500 uppercase tracking-[0.3em] text-center">Final Status</th>
                      <th className="px-10 py-6 text-[10px] font-bold text-gold-500 uppercase tracking-[0.3em] text-right">Confirmation Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-500/5">
                    {filteredRSVPs.map(rsvp => (
                      <tr key={rsvp.id} className="hover:bg-white/5 transition-all group">
                        <td className="px-10 py-7 font-bold text-lg text-cream-50 group-hover:text-gold-500 transition-colors uppercase tracking-tight">{rsvp.name}</td>
                        <td className="px-10 py-7 text-xs font-medium text-white/40 group-hover:text-white/80 transition-colors">{rsvp.email}</td>
                        <td className="px-10 py-7 text-center">
                          <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-2xl ${rsvp.attending === 'yes' ? 'bg-gold-500/20 text-gold-500 border-gold-500/40 shadow-gold-500/10' : 'bg-red-500/20 text-red-500 border-red-500/40 shadow-red-500/10 opacity-60'}`}>
                            {rsvp.attending === 'yes' ? '✓ Attending' : '✕ Declined'}
                          </span>
                        </td>
                        <td className="px-10 py-7 text-right text-[10px] font-bold text-white/20 tracking-[0.2em] uppercase">
                          {rsvp.timestamp ? new Date(rsvp.timestamp).toLocaleDateString([], {month:'long', day:'numeric'}) : 'Today'}
                        </td>
                      </tr>
                    ))}
                    {filteredRSVPs.length === 0 && <tr><td colSpan="4" className="py-20 text-center text-white/20 italic tracking-[0.2em] font-bold uppercase">No Confirmation Recorded</td></tr>}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Floating Decorative Elements */}
        <div className="fixed bottom-10 right-10 z-[100] pointer-events-none opacity-20 hidden md:block">
           <div className="relative">
             <motion.div className="w-40 h-40 border-2 border-gold-500/20 rounded-full animate-spin-slow absolute bottom-0 right-0" />
             <motion.div className="w-32 h-32 border border-gold-500/10 rounded-full animate-spin-slow absolute bottom-4 right-4" style={{ animationDirection: 'reverse' }} />
             <Crown className="w-12 h-12 text-gold-500 m-14 animate-pulse fill-gold-500/10" />
           </div>
        </div>

      </main>
    </div>
  );
};

export default Admin;
