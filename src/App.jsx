import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { trackPageView, initScrollTracking, initPresence, updatePresenceSection, subscribeToActivity, subscribeToPresence, isConfigured } from './firebase';

// ─── STORAGE (Fallback) ──────────────────────────
const KEYS = { LEADS:'wl', RSVPS:'wr', ACTIVITY:'wa', TRAFFIC:'wt' };
const getJ = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } };
const storage = {
  saveLead: (l) => { const a = getJ(KEYS.LEADS,[]); a.push({...l,id:Date.now(),timestamp:new Date().toISOString()}); localStorage.setItem(KEYS.LEADS,JSON.stringify(a)); storage.log(`Lead: ${l.name}`); },
  getLeads: () => getJ(KEYS.LEADS,[]),
  saveRSVP: (r) => { const a = getJ(KEYS.RSVPS,[]); a.push({...r,id:Date.now(),timestamp:new Date().toISOString()}); localStorage.setItem(KEYS.RSVPS,JSON.stringify(a)); storage.log(`RSVP: ${r.name}`); },
  getRSVPs: () => getJ(KEYS.RSVPS,[]),
  log: (m) => { const a = getJ(KEYS.ACTIVITY,[]); a.unshift({message:m,id:Date.now(),timestamp:new Date().toISOString()}); localStorage.setItem(KEYS.ACTIVITY,JSON.stringify(a.slice(0,100))); },
  getLogs: () => getJ(KEYS.ACTIVITY,[]),
  hit: () => { const t = getJ(KEYS.TRAFFIC,{p:0,u:0}); t.p++; if(!sessionStorage.getItem('v')){t.u++;sessionStorage.setItem('v','1');} localStorage.setItem(KEYS.TRAFFIC,JSON.stringify(t)); },
  getTraffic: () => getJ(KEYS.TRAFFIC,{p:0,u:0}),
};

// ─── GOOGLE CALENDAR HELPER ───────────────────────
function getCalendarUrl(title, desc, location, start, end) {
  const formatTime = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '');
  const url = new URL('https://calendar.google.com/calendar/render?action=TEMPLATE');
  url.searchParams.append('text', title);
  url.searchParams.append('details', desc);
  url.searchParams.append('location', location);
  url.searchParams.append('dates', `${formatTime(start)}/${formatTime(end)}`);
  return url.toString();
}

// ─── 3D Tilt Card Hook ────────────────────────────
function useTilt() {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const cx = r.width / 2, cy = r.height / 2;
    const rotX = ((y - cy) / cy) * -12;
    const rotY = ((x - cx) / cx) * 12;
    el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;
    el.style.boxShadow = `${-rotY*2}px ${rotX*2}px 40px rgba(232,101,10,0.35)`;
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    el.style.boxShadow = '';
  };
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}

// ─── TiltCard Component (fixes Rules of Hooks — can't call hook in .map) ────
function TiltCard({ children, style, className }) {
  const tilt = useTilt();
  return (
    <div {...tilt} className={`tilt-card ${className||''}`} style={style}>
      {children}
    </div>
  );
}

// ─── GLOBAL STYLES ────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotateZ(0deg); }
    33% { transform: translateY(-14px) rotateZ(1deg); }
    66% { transform: translateY(-7px) rotateZ(-1deg); }
  }
  @keyframes spin3d {
    from { transform: perspective(400px) rotateY(0deg) rotateX(15deg); }
    to   { transform: perspective(400px) rotateY(360deg) rotateX(15deg); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); } to { transform: rotate(360deg); }
  }
  @keyframes glowPulse {
    0%,100% { box-shadow: 0 0 20px rgba(232,101,10,0.4), 0 0 40px rgba(232,101,10,0.2); }
    50%      { box-shadow: 0 0 40px rgba(232,101,10,0.7), 0 0 80px rgba(232,101,10,0.3); }
  }
  @keyframes riseIn {
    from { opacity:0; transform: perspective(800px) translateZ(-120px) translateY(40px); }
    to   { opacity:1; transform: perspective(800px) translateZ(0px) translateY(0px); }
  }
  @keyframes slideZ {
    from { opacity:0; transform: perspective(600px) rotateX(20deg) translateY(30px); }
    to   { opacity:1; transform: perspective(600px) rotateX(0deg) translateY(0px); }
  }
  @keyframes orbits {
    from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
  }
  @keyframes counterSpin {
    from { transform: rotate(0deg); } to { transform: rotate(-360deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes depthBob {
    0%,100% { transform: perspective(600px) translateZ(0px); }
    50%      { transform: perspective(600px) translateZ(20px); }
  }
  @keyframes cardEntrance {
    from { opacity:0; transform: perspective(800px) rotateY(-30deg) translateX(-30px); }
    to   { opacity:1; transform: perspective(800px) rotateY(0deg) translateX(0px); }
  }

  .tilt-card { transition: transform 0.15s ease, box-shadow 0.15s ease; will-change: transform; }
  .ev-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .ev-card:hover { transform: perspective(800px) rotateX(-3deg) translateZ(12px) !important; box-shadow: 0 24px 50px rgba(61,26,0,0.25) !important; }
  .saffron-btn:hover { background: #E8650A !important; color: #FFFBF0 !important; transform: perspective(400px) translateZ(6px); }
  .dir-btn:hover { background: #E8650A !important; color: #FFFBF0 !important; transform: perspective(400px) translateZ(8px) !important; }
  .nav-btn:hover { background: rgba(232,101,10,0.15) !important; }
  .count-box { transition: transform 0.3s ease; }
  .count-box:hover { transform: perspective(300px) translateZ(20px) scale(1.06) !important; }
  .shimmer-text {
    background: linear-gradient(90deg, #FF8C3A 0%, #FFFBF0 40%, #E8650A 60%, #FF8C3A 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }
`;

// ─── HOME ────────────────────────────────────────
function Home() {
  const [step, setStep] = useState('lead');
  const [prog, setProg] = useState(0);
  const [form, setForm] = useState({name:'',phone:''});
  const [timeLeft, setTimeLeft] = useState({days:0,hours:0,minutes:0,seconds:0});
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({name:'',email:'',attending:''});
  const [rsvpDone, setRsvpDone] = useState(false);
  const cardTilt = useTilt();

  // ─── Firebase Tracking ───
  useEffect(() => {
    storage.hit();
    trackPageView();
    const cleanupScroll = initScrollTracking();
    return () => { if (cleanupScroll) cleanupScroll(); };
  }, []);

  useEffect(() => {
    if (step === 'site' && isConfigured) {
      const cleanupPresence = initPresence(form.name || 'Guest');
      return () => cleanupPresence();
    }
  }, [step, form.name]);

  useEffect(() => {
    // Basic Intersection Observer for sections
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) updatePresenceSection(e.target.id);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [step]);
  // ─────────────────────────

  useEffect(() => { if (sessionStorage.getItem('ga')) setStep('site'); }, []);

  useEffect(() => {
    if (step !== 'loader') return;
    const start = Date.now();
    const iv = setInterval(() => {
      const p = Math.min(((Date.now()-start)/8000)*100, 100);
      setProg(Math.floor(p));
      if (p >= 100) { clearInterval(iv); setTimeout(()=>setStep('site'), 600); }
    }, 50);
    return () => clearInterval(iv);
  }, [step]);

  useEffect(() => {
    const target = new Date('2026-04-26T00:00:00').getTime();
    const iv = setInterval(() => {
      const diff = target - Date.now();
      if (diff > 0) setTimeLeft({
        days: Math.floor(diff/86400000),
        hours: Math.floor((diff%86400000)/3600000),
        minutes: Math.floor((diff%3600000)/60000),
        seconds: Math.floor((diff%60000)/1000)
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const submitLead = (e) => { e.preventDefault(); storage.saveLead(form); sessionStorage.setItem('ga','1'); setStep('loader'); };
  const submitRSVP = (e) => { e.preventDefault(); storage.saveRSVP(rsvpForm); setRsvpDone(true); };

  const events = [
    {title:'Mehendi Ceremony', date:'24 April 2026', time:'Evening', desc:'An evening of colors, music & beautiful henna patterns.', icon:'🌿'},
    {title:'Kumkum Ceremony', date:'25 April 2026', time:'10:00 AM', desc:'A traditional start to the wedding festivities.', icon:'🪷'},
    {title:'Haldi Ceremony', date:'25 April 2026', time:'2:00 PM', desc:'Blessing the couple with the holy turmeric paste.', icon:'🌼'},
    {title:'Sangeet', date:'25 April 2026', time:'7:00 PM', desc:'A night of music, dance & joyous celebrations.', icon:'🎵'},
    {title:'Engagement (Sagai)', date:'25 April 2026', time:'8:00 PM', desc:'Exchanging rings & taking the first step towards forever.', icon:'💍'},
    {title:'Wedding Rituals (Pheras)', date:'26 April 2026', time:'9:00 AM', desc:'The sacred vows & seven steps around the holy fire.', icon:'🔥'},
    {title:'Wedding Ceremony', date:'26 April 2026', time:'6:15 PM', desc:'Grand reception & evening celebrations with loved ones.', icon:'🎊'},
  ];

  // ─ LEAD CATCHER ────────────────────────────────
  if (step === 'lead') return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#2A1000 0%,#5C2200 40%,#3D1A00 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',fontFamily:'"Playfair Display",Georgia,serif',perspective:'1200px'}}>
      <style>{GLOBAL_CSS}</style>
      {/* Floating bg orbs for depth */}
      <div style={{position:'fixed',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
        {[...Array(6)].map((_,i)=>(
          <div key={i} style={{position:'absolute',borderRadius:'50%',background:'radial-gradient(circle,rgba(232,101,10,0.08) 0%,transparent 70%)',width:`${180+i*80}px`,height:`${180+i*80}px`,left:`${10+i*14}%`,top:`${5+i*13}%`,animation:`float ${5+i*1.5}s ease-in-out infinite`,animationDelay:`${i*0.7}s`}} />
        ))}
      </div>
      <div {...cardTilt} className="tilt-card" style={{background:'linear-gradient(145deg,#FFFBF0 0%,#FFF3D6 100%)',border:'4px solid #E8650A',padding:'3rem 2.5rem',maxWidth:'430px',width:'100%',textAlign:'center',position:'relative',zIndex:1,transformStyle:'preserve-3d',animation:'riseIn 1s ease-out'}}>
        {/* Layered 3D border glow */}
        <div style={{position:'absolute',inset:'-8px',border:'1px solid rgba(232,101,10,0.2)',zIndex:-1,transform:'translateZ(-10px)'}} />
        <div style={{position:'absolute',inset:'-16px',border:'1px solid rgba(212,175,55,0.1)',zIndex:-2,transform:'translateZ(-20px)'}} />
        {/* Corner ornaments */}
        {[[0,0,'TL'],[0,1,'TR'],[1,0,'BL'],[1,1,'BR']].map(([b,r,k])=>(
          <div key={k} style={{position:'absolute',[b?'bottom':'top']:'8px',[r?'right':'left']:'8px',width:'28px',height:'28px',[b?'borderBottom':'borderTop']:'3px solid #D4AF37',[r?'borderRight':'borderLeft']:'3px solid #D4AF37'}} />
        ))}
        <div style={{width:'70px',height:'70px',background:'linear-gradient(135deg,#E8650A,#7B3400)',border:'3px solid #D4AF37',borderRadius:'50%',margin:'0 auto 1.5rem',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.2rem',animation:'glowPulse 3s ease-in-out infinite, float 4s ease-in-out infinite',boxShadow:'0 8px 30px rgba(232,101,10,0.5)',transform:'translateZ(20px)',transformStyle:'preserve-3d'}}>🪔</div>
        <h2 style={{color:'#3D1A00',fontSize:'2.6rem',fontWeight:'bold',marginBottom:'0.2rem',transform:'translateZ(8px)',transformStyle:'preserve-3d',textShadow:'0 4px 0 rgba(61,26,0,0.15), 0 8px 16px rgba(61,26,0,0.1)'}}>Padharo</h2>
        <p style={{color:'#E8650A',fontSize:'0.85rem',letterSpacing:'4px',textTransform:'uppercase',marginBottom:'0.5rem'}}>॥ शुभ विवाह ॥</p>
        <div style={{height:'2px',background:'linear-gradient(90deg,transparent,#D4AF37,transparent)',margin:'0 auto 1.5rem',width:'80px'}} />
        <p style={{color:'#7B3400',fontStyle:'italic',marginBottom:'2rem',fontSize:'0.95rem',lineHeight:1.7}}>Kindly grace us with your name<br/>to open the royal scroll</p>
        <form onSubmit={submitLead}>
          <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your Gracious Name" style={{width:'100%',padding:'0.85rem 1rem',border:'none',borderBottom:'2px solid #D4AF37',background:'rgba(255,243,214,0.8)',marginBottom:'1rem',fontSize:'1.1rem',color:'#3D1A00',fontFamily:'"Playfair Display",Georgia,serif',outline:'none',transition:'all 0.3s',backdropFilter:'blur(4px)'}} />
          <input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone Number" type="tel" style={{width:'100%',padding:'0.85rem 1rem',border:'none',borderBottom:'2px solid #D4AF37',background:'rgba(255,243,214,0.8)',marginBottom:'2rem',fontSize:'1rem',color:'#3D1A00',fontFamily:'Georgia,serif',outline:'none',transition:'all 0.3s'}} />
          <button type="submit" className="saffron-btn" style={{width:'100%',padding:'1.1rem',background:'#7B3400',color:'#FFF3D6',border:'2px solid #E8650A',fontSize:'0.85rem',letterSpacing:'3px',textTransform:'uppercase',cursor:'pointer',fontWeight:'bold',fontFamily:'Georgia,serif',transition:'all 0.3s',boxShadow:'0 6px 0 #3D1A00, 0 8px 20px rgba(232,101,10,0.4)',transform:'translateZ(4px)'}}>Open Invitation</button>
        </form>
      </div>
    </div>
  );

  // ─ LOADER (Enhanced 3D) ──────────────────────────
  if (step === 'loader') return (
    <div style={{minHeight:'100vh',background:'radial-gradient(ellipse at center,#5C2200 0%,#2A0A00 50%,#0A0300 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'"Playfair Display",Georgia,serif',perspective:'1200px',overflow:'hidden'}}>
      <style>{GLOBAL_CSS}</style>
      
      {/* 3D Depth Rings */}
      {[...Array(5)].map((_,i)=>(
        <div key={`ring-${i}`} style={{position:'absolute',top:'50%',left:'50%',width:`${200+i*150}px`,height:`${200+i*150}px`,borderRadius:'50%',border:`${1+i*0.5}px solid rgba(232,101,10,${0.15-i*0.02})`,transform:`translate(-50%,-50%) translateZ(${-i*100}px) rotateX(60deg)`,animation:`spin ${10+i*5}s linear infinite`,pointerEvents:'none'}} />
      ))}

      {/* Orbiting particles */}
      <div style={{position:'absolute',width:'400px',height:'400px',animation:'spin 12s linear infinite',pointerEvents:'none',transformStyle:'preserve-3d'}}>
        {[...Array(12)].map((_,i)=>(
          <div key={`p-${i}`} style={{position:'absolute',top:'50%',left:'50%',width:'8px',height:'8px',borderRadius:'50%',background:`rgba(255,140,58,${0.4+i*0.05})`,transform:`rotate(${i*30}deg) translateX(180px) translateY(-50%) translateZ(${Math.sin(i)*50}px)`,boxShadow:'0 0 15px rgba(255,140,58,0.8)'}} />
        ))}
      </div>
      
      {/* Central Rotating Mandala/Flower */}
      <div style={{position:'relative',width:'180px',height:'180px',marginBottom:'2.5rem',transformStyle:'preserve-3d',animation:prog===100?'spin3d 1s ease-out forwards':'spin3d 8s linear infinite',transform:`scale(${0.5 + (prog/200)})`}}>
        <div style={{position:'absolute',inset:0,border:'4px solid #D4AF37',borderRadius:'50%',borderTopColor:'transparent',borderBottomColor:'transparent',animation:'spin 3s linear infinite'}} />
        <div style={{position:'absolute',inset:'15px',border:'2px dashed #E8650A',borderRadius:'50%',animation:'counterSpin 5s linear infinite'}} />
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'5.5rem',filter:'drop-shadow(0 0 40px rgba(232,101,10,1))'}}>🌺</div>
      </div>

      <div style={{position:'relative',zIndex:10,textAlign:'center',transform:`translateZ(${prog/2}px)`}}>
        <p style={{color:'#D4AF37',letterSpacing:'6px',fontSize:'0.9rem',marginBottom:'1rem',textShadow:'0 0 15px rgba(212,175,55,0.6)',animation:'depthBob 3s ease-in-out infinite'}}>॥ श्री गणेशाय नमः ॥</p>
        <h1 className="shimmer-text" style={{fontSize:'clamp(2.5rem,6vw,4.5rem)',fontWeight:'bold',marginBottom:'0.5rem',lineHeight:1.1}}>Ajinkya &amp; Shalini</h1>
        <p style={{color:'#FF8C3A',letterSpacing:'4px',fontSize:'1.1rem',marginBottom:'3.5rem',textShadow:'0 0 10px rgba(232,101,10,0.5)'}}>A Royal Beginning</p>
        
        <div style={{color:'#FFF3D6',fontSize:'3.5rem',fontWeight:'bold',marginBottom:'1.5rem',textShadow:'0 4px 20px rgba(232,101,10,0.8)',fontVariantNumeric:'tabular-nums'}}>{prog}%</div>
        
        <div style={{width:'360px',maxWidth:'85vw',height:'14px',margin:'0 auto',background:'rgba(26,10,0,0.8)',border:'1px solid #E8650A',borderRadius:'8px',overflow:'hidden',boxShadow:'0 0 25px rgba(232,101,10,0.4), inset 0 2px 6px rgba(0,0,0,0.8)',position:'relative'}}>
          {/* Progress Shimmer */}
          <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)',transform:'skewX(-20deg)',animation:'shimmer 2s infinite',zIndex:2}} />
          <div style={{height:'100%',width:`${prog}%`,background:'linear-gradient(90deg,#7B3400,#E8650A,#FF8C3A)',transition:'width 0.15s ease-out',borderRadius:'6px',boxShadow:'0 0 15px rgba(232,101,10,1)',position:'relative',zIndex:1}} />
        </div>
      </div>
    </div>
  );

  // ─ MAIN SITE ─────────────────────────────────────
  return (
    <div style={{fontFamily:'"Playfair Display",Georgia,serif',color:'#3D1A00',overflowX:'hidden',perspective:'1px',perspectiveOrigin:'center top'}}>
      <style>{GLOBAL_CSS}</style>

      {/* ── HERO ── */}
      <section id="Hero" style={{minHeight:'100vh',background:'linear-gradient(160deg,#1A0A00 0%,#5C2200 40%,#3D1A00 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'2rem',position:'relative',borderBottom:'6px solid #E8650A',overflow:'hidden',perspective:'1000px'}}>
        {/* 3D depth layers */}
        <div style={{position:'absolute',inset:0,background:'url("https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=2000") center/cover',opacity:0.1,transform:'perspective(1000px) translateZ(-50px) scale(1.05)'}} />
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center,rgba(232,101,10,0.18) 0%,transparent 65%)'}} />
        {/* Floating geometrical shapes */}
        {[...Array(5)].map((_,i)=>(
          <div key={i} style={{position:'absolute',width:`${30+i*20}px`,height:`${30+i*20}px`,border:'1px solid rgba(232,101,10,0.25)',borderRadius:i%2===0?'50%':'4px',left:`${5+i*18}%`,top:`${8+i*12}%`,animation:`float ${4+i}s ease-in-out infinite`,animationDelay:`${i*0.5}s`,transform:'translateZ(0)',pointerEvents:'none'}} />
        ))}
        {/* Frame lines with 3D depth */}
        <div style={{position:'absolute',inset:'1.5rem',border:'1px solid rgba(232,101,10,0.25)',pointerEvents:'none',transform:'perspective(800px) translateZ(-5px)'}} />

        <div style={{position:'relative',zIndex:1,animation:'slideZ 1.2s ease-out both'}}>
          <p style={{color:'#FF8C3A',letterSpacing:'4px',fontSize:'1rem',marginBottom:'1rem',textShadow:'0 2px 8px rgba(0,0,0,0.6)'}}>॥ मंगलम् भगवान विष्णुः ॥</p>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'1rem',marginBottom:'1rem'}}>
            <div style={{height:'1px',width:'60px',background:'linear-gradient(90deg,transparent,#E8650A)'}} />
            <span style={{color:'#FFF3D6',fontSize:'0.65rem',letterSpacing:'5px',textTransform:'uppercase'}}>Save The Date</span>
            <div style={{height:'1px',width:'60px',background:'linear-gradient(90deg,#E8650A,transparent)'}} />
          </div>
          <h1 className="shimmer-text" style={{fontSize:'clamp(3rem,10vw,7rem)',fontWeight:'bold',lineHeight:1.1,marginBottom:'0.5rem',filter:'drop-shadow(0 8px 20px rgba(0,0,0,0.6))'}}>
            Ajinkya ♥ Shalini
          </h1>
          <p style={{color:'#FF8C3A',fontSize:'clamp(1.2rem,3vw,1.8rem)',fontStyle:'italic',marginBottom:'3rem',textShadow:'0 4px 12px rgba(0,0,0,0.4)',animation:'depthBob 4s ease-in-out infinite'}}>
            26th April, 2026
          </p>
          {/* 3D Countdown */}
          <div style={{display:'flex',gap:'1.5rem',justifyContent:'center',flexWrap:'wrap',transformStyle:'preserve-3d'}}>
            {Object.entries(timeLeft).map(([u,v])=>(
              <div key={u} className="count-box" style={{textAlign:'center',transform:'perspective(400px) rotateX(0deg)',cursor:'default'}}>
                <div style={{background:'linear-gradient(145deg,rgba(92,34,0,0.9),rgba(61,26,0,0.95))',border:'2px solid #E8650A',padding:'1rem 1.5rem',minWidth:'78px',boxShadow:'0 12px 0 #1A0A00, 0 14px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',position:'relative',borderRadius:'4px'}}>
                  <div style={{position:'absolute',top:0,left:0,right:0,height:'4px',background:'linear-gradient(90deg,#7B3400,#FF8C3A,#7B3400)',borderRadius:'4px 4px 0 0'}} />
                  <div style={{color:'#FF8C3A',fontSize:'2.8rem',fontWeight:'bold',lineHeight:1,textShadow:'0 0 20px rgba(232,101,10,0.7)'}}>{String(v).padStart(2,'0')}</div>
                </div>
                <div style={{color:'#FFF3D6',fontSize:'0.6rem',letterSpacing:'3px',textTransform:'uppercase',marginTop:'0.75rem',opacity:0.8}}>{u}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WARDROBE ── */}
      <section id="Wardrobe" style={{background:'linear-gradient(180deg,#FFFBF0 0%,#FFF3D6 100%)',padding:'6rem 1rem',borderBottom:'6px solid #E8650A',perspective:'1200px'}}>
        <div style={{maxWidth:'1000px',margin:'0 auto',textAlign:'center'}}>
          <p style={{color:'#E8650A',letterSpacing:'4px',marginBottom:'0.5rem',fontSize:'1rem',animation:'depthBob 4s ease-in-out infinite'}}>॥ परिधान ॥</p>
          <h2 style={{color:'#3D1A00',fontSize:'clamp(2rem,5vw,3.5rem)',fontWeight:'bold',marginBottom:'1rem',textShadow:'0 4px 0 rgba(61,26,0,0.12), 0 8px 16px rgba(61,26,0,0.08)'}}>Wardrobe</h2>
          <div style={{display:'flex',gap:'0.5rem',justifyContent:'center',alignItems:'center',marginBottom:'3rem'}}>
            <div style={{height:'2px',width:'50px',background:'linear-gradient(90deg,transparent,#E8650A)'}} />
            <div style={{width:'10px',height:'10px',background:'#7B3400',transform:'rotate(45deg)',boxShadow:'0 0 8px rgba(232,101,10,0.5)'}} />
            <div style={{height:'2px',width:'50px',background:'linear-gradient(90deg,#E8650A,transparent)'}} />
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'2.5rem',transformStyle:'preserve-3d'}}>
            {[{e:'Haldi & Mehendi',d:'Vibrant Yellows, Greens & Florals',icon:'🌼'},{e:'Sangeet',d:'Indo-Western Glamour & Pastels',icon:'✨'},{e:'Wedding Pheras',d:'Traditional Marwari / Royal Regalia',icon:'👑'}].map((item,i)=>(
              <TiltCard key={i} style={{background:'linear-gradient(145deg,#FFFBF0,#FFF0D0)',border:'3px solid #D4AF37',padding:'2.5rem 2rem',textAlign:'center',boxShadow:'0 10px 0 rgba(61,26,0,0.12), 0 15px 30px rgba(61,26,0,0.12)',cursor:'default',position:'relative',borderRadius:'4px',transformStyle:'preserve-3d',animation:`cardEntrance 0.8s ease-out ${i*0.2}s both`}}>
                <div style={{position:'absolute',top:'10px',left:'10px',width:'16px',height:'16px',borderTop:'2px solid #E8650A',borderLeft:'2px solid #E8650A'}} />
                <div style={{position:'absolute',top:'10px',right:'10px',width:'16px',height:'16px',borderTop:'2px solid #E8650A',borderRight:'2px solid #E8650A'}} />
                <div style={{position:'absolute',bottom:'10px',left:'10px',width:'16px',height:'16px',borderBottom:'2px solid #E8650A',borderLeft:'2px solid #E8650A'}} />
                <div style={{position:'absolute',bottom:'10px',right:'10px',width:'16px',height:'16px',borderBottom:'2px solid #E8650A',borderRight:'2px solid #E8650A'}} />
                <div style={{fontSize:'3.5rem',marginBottom:'1rem',animation:'float 4s ease-in-out infinite',animationDelay:`${i*0.4}s`,display:'inline-block'}}>{item.icon}</div>
                <h3 style={{color:'#3D1A00',fontSize:'1.4rem',fontWeight:'bold',marginBottom:'0.75rem',textShadow:'0 2px 0 rgba(61,26,0,0.1)'}}>{item.e}</h3>
                <div style={{height:'2px',background:'linear-gradient(90deg,transparent,#E8650A,transparent)',margin:'0 auto 0.75rem',width:'50px'}} />
                <p style={{color:'#7B3400',fontSize:'0.85rem',letterSpacing:'1px',textTransform:'uppercase',fontWeight:'bold',lineHeight:1.7}}>{item.d}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

// ─── TIMELINE ───
      <section id="Timeline" style={{background:'linear-gradient(180deg,#FFF3D6 0%,#FFEDB8 100%)',padding:'6rem 1rem',borderBottom:'6px solid #E8650A'}}>
        <div style={{maxWidth:'900px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'4rem'}}>
            <p style={{color:'#E8650A',letterSpacing:'4px',marginBottom:'0.5rem',fontSize:'1rem'}}>॥ उत्सव ॥</p>
            <h2 style={{color:'#3D1A00',fontSize:'clamp(2rem,5vw,3.5rem)',fontWeight:'bold',marginBottom:'1rem',textShadow:'0 4px 0 rgba(61,26,0,0.12)'}}>Festivities</h2>
            <div style={{display:'flex',gap:'0.5rem',justifyContent:'center',alignItems:'center'}}>
              <div style={{height:'2px',width:'50px',background:'linear-gradient(90deg,transparent,#E8650A)'}} />
              <div style={{width:'10px',height:'10px',background:'#7B3400',transform:'rotate(45deg)',boxShadow:'0 0 8px rgba(232,101,10,0.4)'}} />
              <div style={{height:'2px',width:'50px',background:'linear-gradient(90deg,#E8650A,transparent)'}} />
            </div>
          </div>
          <div style={{position:'relative',marginBottom:'4rem'}}>
            <div style={{position:'absolute',left:'24px',top:0,bottom:0,width:'4px',background:'linear-gradient(180deg,#E8650A,#FF8C3A,#E8650A)',borderRadius:'2px',boxShadow:'0 0 15px rgba(232,101,10,0.5)'}} />
            {events.map((ev,i)=>(
              <div key={i} className="ev-card" style={{display:'flex',gap:'2rem',marginBottom:'2.5rem',perspective:'800px'}}>
                <div style={{width:'52px',height:'52px',minWidth:'52px',background:'linear-gradient(135deg,#E8650A,#7B3400)',border:'3px solid #3D1A00',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1,boxShadow:'0 8px 0 rgba(61,26,0,0.3), 0 12px 20px rgba(232,101,10,0.3)',fontSize:'1.3rem',animation:'float 5s ease-in-out infinite',animationDelay:`${i*0.3}s`}}>{ev.icon}</div>
                <div style={{background:'linear-gradient(145deg,#FFFBF0,#FFF3D6)',border:'2px solid #D4AF37',borderLeft:'5px solid #E8650A',padding:'1.5rem',flex:1,boxShadow:'0 8px 0 rgba(61,26,0,0.08), 0 12px 24px rgba(61,26,0,0.08)',borderRadius:'0 4px 4px 0',transformOrigin:'left center'}}>
                  <h3 style={{color:'#3D1A00',fontSize:'1.4rem',fontWeight:'bold',marginBottom:'0.5rem',textShadow:'0 2px 0 rgba(61,26,0,0.08)'}}>{ev.title}</h3>
                  <div style={{display:'flex',gap:'1.5rem',marginBottom:'0.75rem',flexWrap:'wrap'}}>
                    <span style={{color:'#E8650A',fontSize:'0.75rem',fontWeight:'bold',letterSpacing:'1px',textTransform:'uppercase'}}>📅 {ev.date}</span>
                    <span style={{color:'#7B3400',fontSize:'0.75rem',fontWeight:'bold',letterSpacing:'1px',textTransform:'uppercase'}}>🕐 {ev.time}</span>
                  </div>
                  <p style={{color:'#5C2A00',fontSize:'0.92rem',lineHeight:1.7,margin:0}}>{ev.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{textAlign:'center'}}>
            <a href={getCalendarUrl(
              'Ajinkya & Shalini Wedding Festivities',
              'Join us for our wedding celebrations! Full details: Mehendi, Haldi, Sangeet & Pheras.',
              'Ajinkya Tara Resort, Pune-Solapur Road, Pune',
              new Date('2026-04-24T16:00:00Z'),
              new Date('2026-04-26T20:00:00Z')
            )} target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:'0.75rem',padding:'1.2rem 3rem',background:'linear-gradient(135deg,#FFFBF0,#FFF3D6)',color:'#4285F4',border:'2px solid #D4AF37',fontWeight:'bold',fontSize:'0.9rem',letterSpacing:'2px',textTransform:'uppercase',textDecoration:'none',borderRadius:'4px',boxShadow:'0 8px 0 rgba(212,175,55,0.3), 0 12px 24px rgba(232,101,10,0.2)',transition:'transform 0.2s'}}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill="#4285F4"/>
                <rect x="7" y="12" width="5" height="5" fill="#34A853"/>
              </svg>
              Add All to Google Calendar
            </a>
          </div>
        </div>
      </section>

      {/* ── VENUE ── */}
      <section id="Venue" style={{background:'linear-gradient(135deg,#1A0A00 0%,#5C2200 50%,#3D1A00 100%)',padding:'6rem 1rem',borderBottom:'6px solid #E8650A',color:'#FFFBF0',perspective:'1000px',overflow:'hidden',position:'relative'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 30% 50%,rgba(232,101,10,0.1) 0%,transparent 60%)'}} />
        {[...Array(3)].map((_,i)=>(
          <div key={i} style={{position:'absolute',borderRadius:'50%',border:'1px solid rgba(232,101,10,0.15)',width:`${200+i*150}px`,height:`${200+i*150}px`,top:'50%',left:'50%',transform:`translate(-50%,-50%) perspective(600px) translateZ(${-i*30}px)`,pointerEvents:'none'}} />
        ))}
        <div style={{maxWidth:'900px',margin:'0 auto',textAlign:'center',position:'relative',zIndex:1,animation:'slideZ 1s ease-out both'}}>
          <p style={{color:'#FF8C3A',letterSpacing:'4px',marginBottom:'0.5rem',fontSize:'1rem'}}>॥ शुभ स्थल ॥</p>
          <h2 style={{color:'#FF8C3A',fontSize:'clamp(2rem,5vw,3.5rem)',fontWeight:'bold',marginBottom:'1rem',textShadow:'0 4px 0 rgba(26,10,0,0.5), 0 0 40px rgba(232,101,10,0.3)'}}>The Venue</h2>
          <div style={{display:'flex',gap:'0.5rem',justifyContent:'center',alignItems:'center',marginBottom:'2rem'}}>
            <div style={{height:'2px',width:'50px',background:'linear-gradient(90deg,transparent,#E8650A)'}} />
            <div style={{width:'10px',height:'10px',background:'#FFF3D6',transform:'rotate(45deg)',animation:'spin 4s linear infinite'}} />
            <div style={{height:'2px',width:'50px',background:'linear-gradient(90deg,#E8650A,transparent)'}} />
          </div>
          <h3 style={{fontSize:'2rem',fontWeight:'bold',marginBottom:'1rem',color:'#FFF3D6',textShadow:'0 4px 0 rgba(26,10,0,0.4)'}}>Ajinkya Tara Resort</h3>
          <p style={{fontSize:'1rem',lineHeight:2,opacity:0.88,marginBottom:'2.5rem'}}>Near Namdev Baug, Indian Grape Research Center,<br/>Pune–Solapur Road, Hadapsar, Pune – 411028</p>
          <a href="https://share.google/7CvusHgvRr4Cgerc7" target="_blank" rel="noopener noreferrer" className="dir-btn" style={{display:'inline-block',padding:'1.2rem 3.5rem',background:'#E8650A',color:'#FFFBF0',fontWeight:'bold',letterSpacing:'2px',textTransform:'uppercase',textDecoration:'none',border:'2px solid #FFF3D6',fontSize:'0.88rem',transition:'all 0.3s',boxShadow:'0 8px 0 rgba(26,10,0,0.4), 0 12px 24px rgba(232,101,10,0.4)',borderRadius:'2px'}}>Get Directions →</a>
        </div>
      </section>

      {/* ── RSVP CTA ── */}
      <section id="RSVP" style={{background:'radial-gradient(ellipse at center,#3D1A00 0%,#1A0A00 100%)',padding:'6rem 1rem',textAlign:'center',borderBottom:'6px solid #E8650A',position:'relative',overflow:'hidden'}}>
        {[...Array(4)].map((_,i)=>(
          <div key={i} style={{position:'absolute',top:'50%',left:'50%',border:'1px solid rgba(232,101,10,0.1)',width:`${100+i*100}px`,height:`${100+i*100}px`,borderRadius:'50%',transform:`translate(-50%,-50%)`,animation:`spin ${8+i*3}s linear infinite`,pointerEvents:'none'}} />
        ))}
        <p style={{color:'#E8650A',letterSpacing:'4px',marginBottom:'1.5rem',fontSize:'1rem',position:'relative',zIndex:1}}>॥ आमंत्रण ॥</p>
        <button onClick={()=>setRsvpOpen(true)} style={{position:'relative',zIndex:1,padding:'1.4rem 5rem',background:'linear-gradient(135deg,#E8650A,#7B3400)',color:'#FFFBF0',border:'3px solid #FFF3D6',fontWeight:'bold',fontSize:'1rem',letterSpacing:'3px',textTransform:'uppercase',cursor:'pointer',fontFamily:'"Playfair Display",Georgia,serif',boxShadow:'0 10px 0 rgba(26,10,0,0.5), 0 15px 30px rgba(232,101,10,0.5)',transition:'all 0.2s',borderRadius:'2px'}}>
          RSVP Now
        </button>
      </section>

      {/* ── RSVP MODAL ── */}
      {rsvpOpen && (
        <div style={{position:'fixed',inset:0,background:'rgba(26,10,0,0.93)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'1rem',backdropFilter:'blur(8px)',perspective:'1000px'}}>
          <div style={{background:'linear-gradient(145deg,#FFFBF0,#FFF3D6)',border:'4px solid #E8650A',padding:'3rem 2.5rem',maxWidth:'480px',width:'100%',position:'relative',boxShadow:'0 30px 0 rgba(26,10,0,0.4), 0 40px 60px rgba(0,0,0,0.8)',animation:'riseIn 0.5s ease-out both',borderRadius:'4px'}}>
            {[[0,0,'TL'],[0,1,'TR'],[1,0,'BL'],[1,1,'BR']].map(([b,r,k])=>(
              <div key={k} style={{position:'absolute',[b?'bottom':'top']:'10px',[r?'right':'left']:'10px',width:'22px',height:'22px',[b?'borderBottom':'borderTop']:'2px solid #D4AF37',[r?'borderRight':'borderLeft']:'2px solid #D4AF37'}} />
            ))}
            <button onClick={()=>setRsvpOpen(false)} style={{position:'absolute',top:'1rem',right:'1rem',background:'none',border:'none',fontSize:'1.5rem',cursor:'pointer',color:'#7B3400',lineHeight:1}}>✕</button>
            <div style={{textAlign:'center',marginBottom:'2rem'}}>
              <p style={{color:'#E8650A',letterSpacing:'3px',fontSize:'0.8rem'}}>॥ स्वागत ॥</p>
              <h3 style={{color:'#3D1A00',fontSize:'2.2rem',fontWeight:'bold',margin:'0.5rem 0',textShadow:'0 3px 0 rgba(61,26,0,0.12)'}}>Your Presence</h3>
              <div style={{height:'3px',background:'linear-gradient(90deg,transparent,#E8650A,transparent)',width:'80px',margin:'0.5rem auto'}} />
            </div>
            {rsvpDone ? (
              <div style={{textAlign:'center',padding:'2rem 0'}}>
                <div style={{fontSize:'4rem',marginBottom:'1rem',animation:'float 3s ease-in-out infinite'}}>🙏</div>
                <p style={{color:'#3D1A00',fontSize:'2rem',fontWeight:'bold',marginBottom:'0.5rem'}}>Dhanyawad!</p>
                <p style={{color:'#7B3400',fontSize:'0.95rem'}}>Your response has been received.</p>
              </div>
            ) : (
              <form onSubmit={submitRSVP}>
                <input required value={rsvpForm.name} onChange={e=>setRsvpForm({...rsvpForm,name:e.target.value})} placeholder="Your Full Name" style={{width:'100%',padding:'0.85rem 1rem',border:'none',borderBottom:'2px solid #D4AF37',background:'rgba(255,243,214,0.7)',marginBottom:'1rem',fontSize:'1rem',color:'#3D1A00',fontFamily:'"Playfair Display",Georgia,serif',outline:'none'}} />
                <input required type="email" value={rsvpForm.email} onChange={e=>setRsvpForm({...rsvpForm,email:e.target.value})} placeholder="Email Address" style={{width:'100%',padding:'0.85rem 1rem',border:'none',borderBottom:'2px solid #D4AF37',background:'rgba(255,243,214,0.7)',marginBottom:'1.5rem',fontSize:'1rem',color:'#3D1A00',fontFamily:'Georgia,serif',outline:'none'}} />
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'2rem'}}>
                  {[['yes','✓ Accept'],['no','✗ Decline']].map(([v,l])=>(
                    <label key={v} className="rsvp-label" style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.85rem 1rem',border:`2px solid ${rsvpForm.attending===v?'#E8650A':'#D4AF37'}`,cursor:'pointer',background:rsvpForm.attending===v?'rgba(232,101,10,0.1)':'rgba(255,251,240,0.8)',transition:'all 0.2s',borderRadius:'2px'}}>
                      <input type="radio" name="attending" value={v} onChange={e=>setRsvpForm({...rsvpForm,attending:e.target.value})} required style={{accentColor:'#E8650A',width:'16px',height:'16px'}} />
                      <span style={{fontSize:'0.8rem',fontWeight:'bold',textTransform:'uppercase',letterSpacing:'1px',color:'#3D1A00'}}>{l}</span>
                    </label>
                  ))}
                </div>
                <button type="submit" style={{width:'100%',padding:'1.1rem',background:'linear-gradient(135deg,#7B3400,#E8650A)',color:'#FFF3D6',border:'none',fontWeight:'bold',fontSize:'0.88rem',letterSpacing:'3px',textTransform:'uppercase',cursor:'pointer',fontFamily:'Georgia,serif',boxShadow:'0 6px 0 rgba(61,26,0,0.4), 0 10px 20px rgba(232,101,10,0.3)',borderRadius:'2px',transition:'all 0.2s'}}>Seal RSVP</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer style={{background:'radial-gradient(ellipse at center,#3D1A00 0%,#1A0A00 100%)',borderTop:'4px solid #E8650A',padding:'4rem 1rem',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center,rgba(232,101,10,0.07) 0%,transparent 60%)'}} />
        <p className="shimmer-text" style={{fontSize:'2rem',fontWeight:'bold',marginBottom:'0.5rem',position:'relative'}}>Ajinkya &amp; Shalini</p>
        <div style={{height:'2px',background:'linear-gradient(90deg,transparent,#E8650A,transparent)',margin:'0.75rem auto',width:'100px',position:'relative'}} />
        <p style={{color:'#FFF3D6',fontSize:'0.65rem',letterSpacing:'4px',textTransform:'uppercase',opacity:0.45,position:'relative'}}>Built with Love &amp; Tradition</p>
      </footer>
    </div>
  );
}

  // ─── ADMIN ────────────────────────────────────────
function Admin() {
  const [tab, setTab] = useState('dashboard');
  const [data, setData] = useState({leads:[],rsvps:[],logs:[],traffic:{p:0,u:0}});
  const [liveActivity, setLiveActivity] = useState([]);
  const [livePresence, setLivePresence] = useState({});

  useEffect(() => {
    // Load local storage fallback data
    const load = () => setData({leads:storage.getLeads(),rsvps:storage.getRSVPs(),logs:storage.getLogs(),traffic:storage.getTraffic()});
    load();
    const iv = setInterval(load, 5000); // reduced frequency since we have live DB

    // Subscribe to Firebase real-time data
    if (isConfigured) {
      const unsubAct = subscribeToActivity(setLiveActivity);
      const unsubPres = subscribeToPresence(setLivePresence);
      return () => { clearInterval(iv); unsubAct(); unsubPres(); };
    }
    return () => clearInterval(iv);
  }, []);

  const activeUsersCount = Object.keys(livePresence).length;

  const btnStyle = (active) => ({padding:'0.75rem 1.25rem',background:active?'linear-gradient(135deg,#E8650A,#7B3400)':'transparent',color:active?'#FFFBF0':'#FF8C3A',border:`1px solid ${active?'#E8650A':'rgba(232,101,10,0.3)'}`,cursor:'pointer',fontWeight:'bold',textTransform:'uppercase',letterSpacing:'1px',fontSize:'0.78rem',fontFamily:'Georgia,serif',textAlign:'left',transition:'all 0.2s',borderRadius:'2px',boxShadow:active?'0 4px 0 rgba(26,10,0,0.4), 0 6px 12px rgba(232,101,10,0.3)':'none'});
  const cardStyle = {background:'linear-gradient(145deg,rgba(92,34,0,0.7),rgba(61,26,0,0.8))',border:'1px solid rgba(232,101,10,0.3)',padding:'1.75rem',flex:1,minWidth:'130px',borderTop:'3px solid #E8650A',borderRadius:'4px',boxShadow:'0 8px 0 rgba(26,10,0,0.3), 0 12px 24px rgba(0,0,0,0.2)',transition:'transform 0.2s'};

  return (
    <div style={{minHeight:'100vh',background:'radial-gradient(ellipse at top left,#5C2200 0%,#3D1A00 40%,#1A0A00 100%)',display:'flex',fontFamily:'"Playfair Display",Georgia,serif',color:'#FFFBF0'}}>
      <style>{GLOBAL_CSS}</style>
      <nav style={{minWidth:'225px',background:'rgba(26,10,0,0.95)',borderRight:'3px solid #E8650A',padding:'2rem 1.25rem',display:'flex',flexDirection:'column',gap:'0.75rem',backdropFilter:'blur(10px)'}}>
        <div style={{marginBottom:'2rem',paddingBottom:'1.5rem',borderBottom:'1px solid rgba(232,101,10,0.3)'}}>
          <div style={{fontSize:'2.5rem',marginBottom:'0.5rem',animation:'float 4s ease-in-out infinite'}}>👑</div>
          <p style={{color:'#FF8C3A',fontWeight:'bold',fontSize:'1.2rem',margin:0,textShadow:'0 0 15px rgba(232,101,10,0.4)'}}>Royal Admin</p>
          <p style={{color:'#FFF3D6',opacity:0.4,fontSize:'0.6rem',letterSpacing:'3px',textTransform:'uppercase',margin:'0.25rem 0 0'}}>Wedding Control</p>
        </div>
        {[['dashboard','📊 Dashboard'],['guests','👥 Guests'],['rsvps','💌 RSVPs']].map(([k,l])=>(
          <button key={k} style={btnStyle(tab===k)} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </nav>
      <main style={{flex:1,padding:'2.5rem',overflowY:'auto'}}>
        {tab==='dashboard' && <>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'2rem',borderBottom:'2px solid rgba(232,101,10,0.3)',paddingBottom:'0.75rem'}}>
            <h2 style={{color:'#FF8C3A',fontSize:'2rem',margin:0,fontWeight:'bold',textShadow:'0 0 20px rgba(232,101,10,0.3)'}}>System Overview</h2>
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',background:'rgba(232,101,10,0.1)',padding:'0.5rem 1rem',borderRadius:'2rem',border:'1px solid rgba(232,101,10,0.3)'}}>
              <div style={{width:'8px',height:'8px',background:isConfigured?'#34A853':'#EA4335',borderRadius:'50%',boxShadow:`0 0 8px ${isConfigured?'#34A853':'#EA4335'}`}} />
              <span style={{fontSize:'0.7rem',color:'#FFF3D6',textTransform:'uppercase',letterSpacing:'1px'}}>{isConfigured ? 'Firebase Live' : 'Local Fallback'}</span>
            </div>
          </div>

          <div style={{display:'flex',gap:'1.5rem',flexWrap:'wrap',marginBottom:'2.5rem'}}>
            {[['🟢 Active Now',activeUsersCount],['👁️ Page Views',data.traffic.p],['👥 Visitors',data.traffic.u],['🎯 Leads',data.leads.length],['💌 RSVPs',data.rsvps.length]].map(([l,v])=>(
              <div key={l} style={cardStyle}>
                <p style={{color:'#FF8C3A',fontSize:'0.65rem',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'0.75rem',opacity:0.8}}>{l}</p>
                <p style={{color:'#E8650A',fontSize:'2.8rem',fontWeight:'bold',margin:0,textShadow:'0 0 15px rgba(232,101,10,0.5)'}}>{v}</p>
              </div>
            ))}
          </div>
          
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))',gap:'2rem'}}>
            <div style={{background:'linear-gradient(145deg,rgba(92,34,0,0.6),rgba(61,26,0,0.7))',border:'1px solid rgba(232,101,10,0.25)',padding:'2rem',borderTop:'3px solid #E8650A',borderRadius:'4px',boxShadow:'0 8px 0 rgba(26,10,0,0.3), 0 12px 30px rgba(0,0,0,0.3)',height:'400px',overflowY:'auto'}}>
              <h3 style={{color:'#FF8C3A',fontSize:'1.3rem',fontWeight:'bold',marginBottom:'1.5rem',display:'flex',alignItems:'center',gap:'0.5rem'}}><span style={{animation:'glowPulse 2s infinite',borderRadius:'50%',width:'8px',height:'8px',background:'#E8650A'}}/> Live Guest Presence</h3>
              {Object.entries(livePresence).length===0 ? <p style={{opacity:0.4,fontStyle:'italic',color:'#FFF3D6'}}>No one currently online.</p> : Object.entries(livePresence).map(([id,p])=>(
                <div key={id} style={{background:'rgba(26,10,0,0.4)',border:'1px solid rgba(232,101,10,0.1)',padding:'1rem',marginBottom:'0.5rem',borderRadius:'2px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <p style={{fontWeight:'bold',color:'#FFFBF0',margin:'0 0 0.2rem'}}>{p.name}</p>
                    <p style={{color:'#FF8C3A',fontSize:'0.7rem',margin:0}}>{p.device === 'mobile' ? '📱 Mobile' : '💻 Desktop'} • Viewing: <span style={{color:'#FFF3D6'}}>{p.section||'Site'}</span></p>
                  </div>
                  <div style={{fontSize:'1.2rem'}}>{p.section==='Hero'?'🏰':p.section==='Wardrobe'?'👑':p.section==='Timeline'?'🎊':p.section==='Venue'?'📍':'✨'}</div>
                </div>
              ))}
            </div>

            <div style={{background:'linear-gradient(145deg,rgba(92,34,0,0.6),rgba(61,26,0,0.7))',border:'1px solid rgba(232,101,10,0.25)',padding:'2rem',borderTop:'3px solid #D4AF37',borderRadius:'4px',boxShadow:'0 8px 0 rgba(26,10,0,0.3), 0 12px 30px rgba(0,0,0,0.3)',height:'400px',overflowY:'auto'}}>
              <h3 style={{color:'#D4AF37',fontSize:'1.3rem',fontWeight:'bold',marginBottom:'1.5rem'}}>📡 Activity Stream {isConfigured ? '(Live)' : '(Local)'}</h3>
              {(isConfigured ? liveActivity : data.logs).length===0 ? <p style={{opacity:0.4,fontStyle:'italic',color:'#FFF3D6'}}>No activity yet.</p> : (isConfigured ? liveActivity : data.logs).map(a=>(
                <div key={a.id} style={{borderLeft:`2px solid ${a.type==='page_view'?'#4285F4':a.type==='scroll_depth'?'#34A853':a.type==='section_viewed'?'#FBBC05':'#E8650A'}`,paddingLeft:'1rem',marginBottom:'1rem'}}>
                  <p style={{fontSize:'0.92rem',margin:'0 0 0.25rem',color:'#FFF3D6'}}>{a.message || `${a.type.replace('_',' ')} ${a.section?`(${a.section})`:a.depth?`(${a.depth}%)`:''}`}</p>
                  <div style={{display:'flex',gap:'1rem',color:'#FF8C3A',fontSize:'0.65rem',opacity:0.7}}>
                    <span>{new Date(a.timestamp).toLocaleTimeString()}</span>
                    {a.device && <span>{a.device}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>}
        {tab==='guests' && <>
          <h2 style={{color:'#FF8C3A',fontSize:'2rem',marginBottom:'2rem',fontWeight:'bold',borderBottom:'2px solid rgba(232,101,10,0.3)',paddingBottom:'0.75rem'}}>Captured Leads</h2>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',background:'rgba(92,34,0,0.4)',border:'1px solid rgba(232,101,10,0.25)',minWidth:'500px',borderRadius:'4px',boxShadow:'0 8px 24px rgba(0,0,0,0.3)'}}>
              <thead><tr style={{background:'rgba(26,10,0,0.8)',borderBottom:'2px solid #E8650A'}}>{['Name','Phone','Recorded At'].map(h=><th key={h} style={{padding:'1rem',textAlign:'left',color:'#FF8C3A',fontSize:'0.7rem',letterSpacing:'2px',textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
              <tbody>{data.leads.length===0?<tr><td colSpan="3" style={{padding:'2rem',textAlign:'center',opacity:0.4,color:'#FFF3D6'}}>No leads yet.</td></tr>:data.leads.map(l=><tr key={l.id} style={{borderBottom:'1px solid rgba(232,101,10,0.08)'}}><td style={{padding:'0.85rem 1rem',color:'#FFFBF0',fontWeight:'bold'}}>{l.name}</td><td style={{padding:'0.85rem 1rem',color:'#FFF3D6',opacity:0.85}}>{l.phone}</td><td style={{padding:'0.85rem 1rem',color:'#FF8C3A',fontSize:'0.75rem'}}>{new Date(l.timestamp).toLocaleString()}</td></tr>)}</tbody>
            </table>
          </div>
        </>}
        {tab==='rsvps' && <>
          <h2 style={{color:'#FF8C3A',fontSize:'2rem',marginBottom:'2rem',fontWeight:'bold',borderBottom:'2px solid rgba(232,101,10,0.3)',paddingBottom:'0.75rem'}}>RSVP Responses</h2>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',background:'rgba(92,34,0,0.4)',border:'1px solid rgba(232,101,10,0.25)',minWidth:'640px',borderRadius:'4px',boxShadow:'0 8px 24px rgba(0,0,0,0.3)'}}>
              <thead><tr style={{background:'rgba(26,10,0,0.8)',borderBottom:'2px solid #E8650A'}}>{['Name','Email','Status','Submitted At'].map(h=><th key={h} style={{padding:'1rem',textAlign:'left',color:'#FF8C3A',fontSize:'0.7rem',letterSpacing:'2px',textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
              <tbody>{data.rsvps.length===0?<tr><td colSpan="4" style={{padding:'2rem',textAlign:'center',opacity:0.4,color:'#FFF3D6'}}>No RSVPs yet.</td></tr>:data.rsvps.map(r=><tr key={r.id} style={{borderBottom:'1px solid rgba(232,101,10,0.08)'}}><td style={{padding:'0.85rem 1rem',color:'#FFFBF0',fontWeight:'bold'}}>{r.name}</td><td style={{padding:'0.85rem 1rem',color:'#FFF3D6',opacity:0.85}}>{r.email}</td><td style={{padding:'0.85rem 1rem'}}><span style={{padding:'0.3rem 0.85rem',border:'1px solid #E8650A',color:'#FF8C3A',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'1px',borderRadius:'2px'}}>{r.attending==='yes'?'Attending':'Declined'}</span></td><td style={{padding:'0.85rem 1rem',color:'#FF8C3A',fontSize:'0.72rem'}}>{new Date(r.timestamp).toLocaleString()}</td></tr>)}</tbody>
            </table>
          </div>
        </>}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
