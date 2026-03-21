/**
 * Shared Calendar Utilities for Ajinkya & Shalini Wedding
 */

/**
 * Detects if the user is on an Apple device (iPhone, iPad, Mac)
 */
export const isAppleDevice = () => {
  return /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent) && !window.MSStream;
};

/**
 * Builds a Google Calendar URL for a given event
 */
export const getGoogleCalendarUrl = (event) => {
  const months = { January:0,February:1,March:2,April:3,May:4,June:5,July:6,August:7,September:8,October:9,November:10,December:11 };
  
  // Default to 26 April 2026 if not provided
  const dateStr = event.date || "26 April 2026";
  const parts = dateStr.split(' ');
  const day = parseInt(parts[0], 10);
  const month = months[parts[1]] || 3;
  const year = parseInt(parts[2], 10) || 2026;
  
  const timeStr = event.time || "00:00 AM";
  let hour = 0, minute = 0;
  
  if (timeStr && timeStr.includes(':')) {
    const [h, mPart] = timeStr.split(':');
    hour = parseInt(h, 10);
    minute = parseInt(mPart, 10) || 0;
    if (timeStr.toLowerCase().includes('pm') && hour !== 12) hour += 12;
    if (timeStr.toLowerCase().includes('am') && hour === 12) hour = 0;
  } else if (timeStr.toLowerCase() === 'evening') {
    hour = 18;
  }

  const pad = n => String(n).padStart(2, '0');
  const dtStart = `${year}${pad(month+1)}${pad(day)}T${pad(hour)}${pad(minute)}00`;
  const dtEnd = `${year}${pad(month+1)}${pad(day)}T${pad(hour+2)}${pad(minute)}00`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${event.title} – Ajinkya & Shalini Wedding 💍`,
    dates: `${dtStart}/${dtEnd}`,
    details: event.description || "Join us to celebrate the wedding of Ajinkya & Shalini! 🌸",
    location: 'Ajinkya Tara Resort, Near Namdev Baug, Pune–Solapur Road, Hadapsar, Pune – 411028',
    trp: 'false',
    sprop: 'website:https://ajinkyashalaniwedding.vercel.app/',
    ctz: 'Asia/Kolkata'
  });

  return `https://www.google.com/calendar/event?${params.toString()}`;
};

/**
 * Triggers an .ics download for Apple/Standard calendars
 */
export const downloadICS = (event) => {
  const months = { January:0,February:1,March:2,April:3,May:4,June:5,July:6,August:7,September:8,October:9,November:10,December:11 };
  const dateStr = event.date || "26 April 2026";
  const parts = dateStr.split(' ');
  const day = parseInt(parts[0], 10);
  const month = months[parts[1]] || 3;
  const year = parseInt(parts[2], 10) || 2026;
  
  const timeStr = event.time || "00:00 AM";
  let hour = 0, minute = 0;
  
  if (timeStr && timeStr.includes(':')) {
    const [h, mPart] = timeStr.split(':');
    hour = parseInt(h, 10);
    minute = parseInt(mPart, 10) || 0;
    if (timeStr.toLowerCase().includes('pm') && hour !== 12) hour += 12;
    if (timeStr.toLowerCase().includes('am') && hour === 12) hour = 0;
  } else if (timeStr.toLowerCase() === 'evening') {
    hour = 18;
  }

  const pad = n => String(n).padStart(2, '0');
  const dtStart = `${year}${pad(month+1)}${pad(day)}T${pad(hour)}${pad(minute)}00`;
  const dtEnd = `${year}${pad(month+1)}${pad(day)}T${pad(hour+2)}${pad(minute)}00`;

  const icsMsg = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ivory Tech Solutions//Wedding//EN',
    'BEGIN:VEVENT',
    `URL:${window.location.href}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${event.title} – Ajinkya & Shalini Wedding 💍`,
    `DESCRIPTION:${event.description || "Join us to celebrate the wedding of Ajinkya & Shalini! 🌸"}`,
    'LOCATION:Ajinkya Tara Resort, Near Namdev Baug, Pune–Solapur Road, Hadapsar, Pune – 411028',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');
  
  const blob = new Blob([icsMsg], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.title.replace(/\s/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Higher-level function to handle a smart click
 */
export const handleSmartCalendarClick = (event) => {
  if (isAppleDevice()) {
    downloadICS(event);
  } else {
    window.open(getGoogleCalendarUrl(event), '_blank');
  }
};
