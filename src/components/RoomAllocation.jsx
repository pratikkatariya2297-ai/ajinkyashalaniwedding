import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Room Data ─────────────────────────────────────────── */
const cottageRooms = [
  { number: '1101', label: 'Ajaykumar family-core 4 + Kids',                                       type: 'Luxury',   side: 'Groom' },
  { number: '1102', label: 'Amitkumar, Prerna, Arnav, Sweety, Priham',                             type: 'Luxury',   side: 'Groom' },
  { number: '1103', label: 'Abhay , Vijay, Asmita, Madhavi, Bhumi',                                type: 'Luxury',   side: 'Groom' },
  { number: '1105', label: 'Prashant Supekar, Prajwal, Sandip, Abhijit Mahajan, Pradip Supekar',  type: 'Standard', side: 'Bride' },
  { number: '1106', label: 'Dada, Nilesh, Tushar, Archit, Ishan',                                  type: 'Standard', side: 'Bride' },
  { number: '1107', label: 'Pratibha Khambekar, Dharmadhikari, Pramila Supekar, Prachi Mahajan, Sunita Girme', type: 'Standard', side: 'Bride' },
  { number: '1108', label: 'Vahini, Vikrant, Sayali, Pushka + 1',                                  type: 'Standard', side: 'Groom' },
  { number: '1110', label: 'Yatinkumar, Nutanben, Utkarsh, Ruchita',                               type: 'Standard', side: 'Groom' },
  { number: '1112', label: 'Sarika (2) + Priya (2)',                                               type: 'Standard', side: 'Groom' },
  { number: '1114', label: 'Shubhangiben (4)',                                                      type: 'Standard', side: 'Groom' },
  { number: '1115', label: 'Alpesh (4) + Harshada',                                                type: 'Standard', side: 'Groom' },
  { number: '1116', label: 'Ravikaka, Meenabhabhi',                                                type: 'Standard', side: 'Groom' },
  { number: '1118', label: 'Ashokkaka (3), Sharmilabhabhi',                                        type: 'Standard', side: 'Groom' },
  { number: '1119', label: 'Sudhir Poonam Rakhi',                                                  type: 'Standard', side: 'Groom' },
  { number: '1120', label: 'Sudhir Poonam Rakhi',                                                  type: 'Standard', side: 'Groom' },
  { number: '1121', label: 'Sopan Girme, Homkar Bhauji, Kumar',                                    type: 'Standard', side: 'Bride' },
  { number: '1122', label: 'Rahul (3) + Subhashbhai',                                              type: 'Standard', side: 'Groom' },
  { number: '1123', label: 'Swapnil (3), Sunandabhabhi',                                           type: 'Standard', side: 'Groom' },
  { number: '1124', label: 'Dada Basale, Nitin Basale, Kamble, Rode, Kalekar',                    type: 'Standard', side: 'Bride' },
  { number: '1125', label: 'Dipti, Sanju atya, Ranju atya, Minu',                                 type: 'Standard', side: 'Bride' },
  { number: '1126', label: 'Sopan Awasarkar, Anil Awasarkar, Nanda Mami, Savita Mami, Bhaiya',   type: 'Standard', side: 'Bride' },
  { number: '1127', label: 'Madhuri Rode + 1, Jaya Basale, Mai',                                  type: 'Standard', side: 'Bride' },
  { number: '1128', label: 'Shrilekha, Hair Artist, Sanskriti, Vaibhavi',                         type: 'Standard', side: 'Bride' },
  { number: '1129', label: 'Gulab, Akhilesh, Anil, Anuj, Sunil',                                  type: 'Standard', side: 'Bride' },
  { number: '1130', label: 'Soniya, Shivani, Vaishali, Sangita',                                   type: 'Standard', side: 'Bride' },
  { number: '1131', label: 'Yash, Ajaykumar, Piyush, Akash',                                      type: 'Suite',    side: 'Groom' },
  { number: '1132', label: 'Sanjay, Smita, Prakash, Chitraben, Maa',                              type: 'Suite',    side: 'Groom' },
];

const tentRooms = [
  { number: '2201', label: 'Chetak +1 & Akash +1',                                                side: 'Groom' },
  { number: '2202', label: 'Divya, Mansi, Shreya, Akshata (Day 2 only)',                          side: 'Groom' },
  { number: '2203', label: 'Yash Empty',                                                           side: 'Groom' },
  { number: '2204', label: 'Nikaela, Sam, Luiza, Mukta',                                          side: 'Bride' },
  { number: '2205', label: 'Elion, Andy, Lucas',                                                   side: 'Bride' },
  { number: '2206', label: 'Abhinav, Samar, Sachin, Shubham',                                     side: 'Bride' },
  { number: '2207', label: 'Akshay, Pranav, Akshay Kudale, Sopan (Day 1 & 2), Sojal & Rohit (Day 2 only)', side: 'Groom' },
  { number: '2208', label: 'Onkar, Karan, Sid, Ranka',                                            side: 'Groom' },
  { number: '2209', label: 'Hitesh, Jismon, Sumit Sarda, Devesh',                                 side: 'Groom' },
  { number: '2210', label: 'Yash Empty',                                                           side: 'Groom' },
  { number: '2211', label: 'Soniya Empty',                                                         side: 'Bride' },
  { number: '2212', label: 'Utkarsha, Shubhangi, Chaitali, Shital',                               side: 'Bride' },
  { number: '2214', label: 'Smita, Piyusha, Rohit, Supriya',                                      side: 'Bride' },
  { number: '2215', label: 'Adesh, Shubhada, Vikram, Snehal',                                     side: 'Bride' },
  { number: '2216', label: 'Kartik Kamble, Vishwajeet Pawar, Gaurav Lokahnade, Raj Thopate',      side: 'Bride' },
  { number: '2218', label: 'Omkar Chikane, Varun Landge',                                         side: 'Bride' },
  { number: '2219', label: 'Common Empty',                                                         side: 'Common' },
  { number: '2220', label: 'Photographer 1',                                                      side: 'Common' },
  { number: '2221', label: 'Photographer 2',                                                      side: 'Common' },
  { number: '2222', label: 'Vidhikar, Deepak bhai',                                               side: 'Common' },
  { number: '2223', label: 'Caterer Staff',                                                        side: 'Common' },
];

/* ─── Floating Petal particle ──────────────────────────── */
const Petal = ({ style }) => (
  <motion.div
    style={{
      position: 'absolute',
      width: 10,
      height: 14,
      borderRadius: '50% 0 50% 0',
      opacity: 0.18,
      ...style,
    }}
    animate={{
      y: [0, -120, -240],
      x: [0, style.drift ?? 30, style.drift ? style.drift * 1.6 : 50],
      rotate: [0, 180, 360],
      opacity: [0, 0.25, 0],
    }}
    transition={{
      duration: style.dur ?? 7,
      repeat: Infinity,
      delay: style.delay ?? 0,
      ease: 'easeInOut',
    }}
  />
);

/* ─── Animated background canvas particles ─────────────── */
const LiveBackground = () => {
  const petals = [
    { top: '80%', left: '5%',  background: '#f9a8d4', dur: 8,  delay: 0,   drift: 40  },
    { top: '90%', left: '15%', background: '#fbbf24', dur: 10, delay: 1.5, drift: -20 },
    { top: '85%', left: '30%', background: '#fb7185', dur: 7,  delay: 3,   drift: 60  },
    { top: '92%', left: '50%', background: '#a78bfa', dur: 9,  delay: 0.8, drift: -40 },
    { top: '88%', left: '65%', background: '#fbbf24', dur: 11, delay: 2,   drift: 30  },
    { top: '82%', left: '78%', background: '#f9a8d4', dur: 8,  delay: 4,   drift: -50 },
    { top: '90%', left: '90%', background: '#fb7185', dur: 9,  delay: 1,   drift: 25  },
    { top: '86%', left: '42%', background: '#a78bfa', dur: 12, delay: 5,   drift: -30 },
    { top: '78%', left: '22%', background: '#fbbf24', dur: 6,  delay: 2.5, drift: 45  },
    { top: '95%', left: '58%', background: '#f9a8d4', dur: 13, delay: 3.5, drift: -15 },
    { top: '75%', left: '70%', background: '#34d399', dur: 9,  delay: 0.5, drift: 35  },
    { top: '91%', left: '83%', background: '#fbbf24', dur: 7,  delay: 6,   drift: -45 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* Gradient orbs */}
      <motion.div
        style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)',
        }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute', bottom: '-20%', right: '-10%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,168,212,0.18) 0%, transparent 70%)',
        }}
        animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute', top: '40%', left: '40%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)',
        }}
        animate={{ x: [0, 30, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating petals */}
      {petals.map((p, i) => <Petal key={i} style={p} />)}

      {/* Subtle grid pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(251,191,36,0.08) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />
    </div>
  );
};

/* ─── Person avatar icon ───────────────────────────────── */
const PersonIcon = ({ side }) => {
  const colors = {
    Groom:  { bg: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', shadow: 'rgba(59,130,246,0.4)' },
    Bride:  { bg: 'linear-gradient(135deg,#f43f5e,#be185d)', shadow: 'rgba(244,63,94,0.4)'  },
    Common: { bg: 'linear-gradient(135deg,#9ca3af,#6b7280)', shadow: 'rgba(156,163,175,0.4)' },
  };
  const c = colors[side] ?? colors.Common;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
      background: c.bg, boxShadow: `0 4px 12px ${c.shadow}`,
    }}>
      <svg viewBox="0 0 24 24" fill="white" style={{ width: 16, height: 16 }}>
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    </span>
  );
};

/* ─── Type badge ────────────────────────────────────────── */
const TypeBadge = ({ type }) => {
  const styles = {
    Luxury:   { bg: 'rgba(251,191,36,0.15)', color: '#b45309', border: 'rgba(251,191,36,0.4)' },
    Suite:    { bg: 'rgba(167,139,250,0.15)', color: '#7c3aed', border: 'rgba(167,139,250,0.4)' },
    Standard: { bg: 'rgba(156,163,175,0.12)', color: '#6b7280', border: 'rgba(156,163,175,0.3)' },
  };
  const s = styles[type] ?? styles.Standard;
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
      padding: '2px 7px', borderRadius: 20,
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
    }}>
      {type}
    </span>
  );
};

/* ─── Single room row ───────────────────────────────────── */
const RoomRow = ({ room, index, isHighlighted }) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.025 }}
    whileHover={{ x: 4, transition: { duration: 0.2 } }}
    style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '10px 12px', borderRadius: 10,
      marginBottom: 2,
      background: isHighlighted
        ? 'linear-gradient(135deg, rgba(251,191,36,0.18), rgba(249,168,212,0.12))'
        : 'transparent',
      border: isHighlighted ? '1px solid rgba(251,191,36,0.35)' : '1px solid transparent',
      transition: 'all 0.25s ease',
      cursor: 'default',
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={e => {
      if (!isHighlighted) {
        e.currentTarget.style.background = 'rgba(251,191,36,0.07)';
        e.currentTarget.style.border = '1px solid rgba(251,191,36,0.2)';
      }
    }}
    onMouseLeave={e => {
      if (!isHighlighted) {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.border = '1px solid transparent';
      }
    }}
  >
    {isHighlighted && (
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.1), transparent)',
          pointerEvents: 'none',
        }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    )}
    <PersonIcon side={room.side} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 8px' }}>
        <span style={{ fontWeight: 700, color: '#d97706', fontSize: 13, whiteSpace: 'nowrap' }}>
          {room.number}:
        </span>
        <span style={{ color: '#374151', fontSize: 13, lineHeight: 1.4 }}>
          {room.label}
        </span>
        {room.type && <TypeBadge type={room.type} />}
      </div>
    </div>
  </motion.div>
);

/* ─── Column card ───────────────────────────────────────── */
const RoomCard = ({ title, icon, rooms, searchQ, delay = 0 }) => {
  const q = searchQ.toLowerCase().trim();
  const filtered = q
    ? rooms.filter(r => r.number.includes(q) || r.label.toLowerCase().includes(q))
    : rooms;

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      style={{
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 20,
        border: '1px solid rgba(251,191,36,0.25)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.6) inset',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Card header */}
      <div style={{
        padding: '18px 24px 14px',
        background: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(249,168,212,0.08))',
        borderBottom: '1px solid rgba(251,191,36,0.18)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 18, fontWeight: 700,
          background: 'linear-gradient(135deg, #d97706, #be185d)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          margin: 0,
        }}>
          {title}
        </h3>
        <div style={{
          marginTop: 6, fontSize: 11, color: '#9ca3af', fontWeight: 500,
        }}>
          {filtered.length} room{filtered.length !== 1 ? 's' : ''}
          {q && ` matched`}
        </div>
      </div>

      {/* Scrollable list */}
      <div style={{
        padding: '8px 14px',
        maxHeight: 520,
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(251,191,36,0.4) transparent',
      }}>
        <AnimatePresence>
          {filtered.length > 0 ? (
            filtered.map((room, i) => (
              <RoomRow
                key={room.number}
                room={room}
                index={i}
                isHighlighted={!!q}
              />
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13, padding: '32px 0' }}
            >
              No rooms found ✦
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* ─── Main component ────────────────────────────────────── */
const RoomAllocation = () => {
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  return (
    <section
      id="rooms"
      style={{
        position: 'relative',
        padding: '80px 0',
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #fdf8f0 0%, #fff5f7 40%, #f8f4ff 70%, #fdf8f0 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Live background */}
      <LiveBackground />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <motion.div
            style={{ fontSize: 36, marginBottom: 8 }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            🏨
          </motion.div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #92400e, #d97706, #be185d)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            margin: '0 0 10px',
          }}>
            Room Allocation
          </h2>
          {/* Animated underline */}
          <motion.div
            style={{
              height: 3, borderRadius: 9, margin: '0 auto 16px',
              background: 'linear-gradient(90deg, #fbbf24, #f43f5e, #a78bfa)',
            }}
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3 }}
          />
          <p style={{
            color: '#6b7280', fontSize: 14, maxWidth: 420, margin: '0 auto', lineHeight: 1.7,
          }}>
            Your comfortable stay arrangements at the resort. Please coordinate
            with resort staff for luggage assistance.
          </p>
        </motion.div>

        {/* ── Search bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}
        >
          <div style={{ position: 'relative', width: '100%', maxWidth: 380 }}>
            {/* Glow ring on focus */}
            <motion.div
              animate={{
                boxShadow: focused
                  ? '0 0 0 3px rgba(251,191,36,0.35), 0 0 24px rgba(251,191,36,0.2)'
                  : '0 0 0 0px transparent',
              }}
              transition={{ duration: 0.3 }}
              style={{ borderRadius: 99, position: 'absolute', inset: 0, pointerEvents: 'none' }}
            />
            <svg
              style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                width: 16, height: 16, color: focused ? '#d97706' : '#9ca3af',
                transition: 'color 0.3s',
              }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by name or room number…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{
                width: '100%',
                paddingLeft: 42, paddingRight: search ? 40 : 16,
                paddingTop: 11, paddingBottom: 11,
                borderRadius: 99,
                border: '1.5px solid rgba(251,191,36,0.35)',
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(12px)',
                fontSize: 13, color: '#374151',
                outline: 'none',
                transition: 'border-color 0.3s',
                borderColor: focused ? '#fbbf24' : 'rgba(251,191,36,0.35)',
                boxSizing: 'border-box',
              }}
            />
            {search && (
              <button
                onClick={() => { setSearch(''); inputRef.current?.focus(); }}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#9ca3af', fontSize: 16, lineHeight: 1, padding: 2,
                }}
              >
                ✕
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Two-column cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
          gap: 24,
        }}>
          <RoomCard
            title="Cottage Rooms (11xx Series)"
            icon="🏡"
            rooms={cottageRooms}
            searchQ={search}
            delay={0}
          />
          <RoomCard
            title="Tent Rooms (22xx Series)"
            icon="⛺"
            rooms={tentRooms}
            searchQ={search}
            delay={0.1}
          />
        </div>

        {/* ── Important Notes ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 }}
          style={{
            marginTop: 28,
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(251,191,36,0.3)',
            borderRadius: 18,
            padding: '20px 24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: 18 }}
            >
              ℹ️
            </motion.span>
            <span style={{ fontWeight: 700, color: '#b45309', fontSize: 14 }}>Important Notes</span>
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Check-in starts from arrival on 29th December 2026',
              'Resort staff will assist with luggage handling',
              'Room maps available at reception desk',
              'For any room-related queries, contact resort management',
            ].map((note, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: '#6b7280', fontSize: 12 }}>
                <motion.div
                  style={{ width: 6, height: 6, borderRadius: '50%', background: '#fbbf24', flexShrink: 0, marginTop: 4 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                />
                {note}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ── Legend ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            marginTop: 20,
            display: 'flex', flexWrap: 'wrap',
            justifyContent: 'center', gap: '8px 24px',
            fontSize: 12, color: '#6b7280',
          }}
        >
          {[
            { color: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', label: 'Groom Side' },
            { color: 'linear-gradient(135deg,#f43f5e,#be185d)', label: 'Bride Side' },
            { color: 'linear-gradient(135deg,#9ca3af,#6b7280)', label: 'Common' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                display: 'inline-block', width: 16, height: 16, borderRadius: 5,
                background: color,
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }} />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default RoomAllocation;
