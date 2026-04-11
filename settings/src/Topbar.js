import React, { useState, useEffect, useRef } from 'react';
import './Topbar.css';
 
const NOTIFS = [
  {
    id: 1,
    icon: 'inventory_2',
    color: '#BE1300',
    bg: 'rgba(190,19,0,0.10)',
    title: 'Low stock alert',
    desc: 'Pastel Sunshine Dress is almost out.',
    time: '2 mins ago',
  },
  {
    id: 2,
    icon: 'receipt_long',
    color: '#0D0DBB',
    bg: 'rgba(13,13,187,0.10)',
    title: 'New transaction placed',
    desc: 'TXN-100251 has been received.',
    time: '15 mins ago',
  },
  {
    id: 3,
    icon: 'error_outline',
    color: '#B07D00',
    bg: 'rgba(254,215,0,0.22)',
    title: '5 overdue orders',
    desc: 'These orders need your attention.',
    time: '1 hour ago',
  },
];
 
export default function Topbar() {
  const [now, setNow] = useState(new Date());
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [readIds, setReadIds] = useState(new Set());
 
  const notifRef = useRef(null);
  const settingsRef = useRef(null);
 
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setSettingsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
 
  const formatTime = (d) => {
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };
 
  const formatDate = (d) =>
    d.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
 
  const unreadCount = NOTIFS.filter((n) => !readIds.has(n.id)).length;
  const markAllRead = () => setReadIds(new Set(NOTIFS.map((n) => n.id)));
  const markOneRead = (id) => setReadIds((prev) => new Set([...prev, id]));
 
  return (
    <header className="topbar">
      {/* DateTime */}
      <div className="topbar__datetime">
        <span className="topbar__time">{formatTime(now)}</span>
        <div className="topbar__divider" />
        <span className="topbar__date">{formatDate(now)}</span>
      </div>
 
      <div className="topbar__actions">
        {/* Notification bell */}
        <div className="topbar__icon-wrap" ref={notifRef}>
          <button
            className={`topbar__icon-btn ${notifOpen ? 'topbar__icon-btn--active' : ''}`}
            onClick={() => { setNotifOpen((v) => !v); setSettingsOpen(!settingsOpen); }}
            title="Notifications"
          >
            <span className="material-icons">notifications</span>
            {unreadCount > 0 && (
              <span className="topbar__badge">{unreadCount}</span>
            )}
          </button>
 
          {notifOpen && (
            <div className="topbar__dropdown topbar__dropdown--notif scale-in">
              {/* Header */}
              <div className="notif__header">
                <div className="notif__header-left">
                  <span className="material-icons notif__header-icon">notifications_active</span>
                  <span className="notif__header-title">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="notif__count-pill">{unreadCount} new</span>
                  )}
                </div>
                {unreadCount > 0 ? (
                  <button className="notif__mark-all" onClick={markAllRead}>
                    <span className="material-icons" style={{ fontSize: 13 }}>done_all</span>
                    Mark all read
                  </button>
                ) : (
                  <span className="notif__all-clear">All caught up ✓</span>
                )}
              </div>
 
              {/* List */}
              <ul className="notif__list">
                {NOTIFS.map((n, i) => {
                  const isRead = readIds.has(n.id);
                  return (
                    <li
                      key={n.id}
                      className={`notif__item ${!isRead ? 'notif__item--unread' : 'notif__item--read'}`}
                      style={{ animationDelay: `${i * 0.06}s` }}
                      onClick={() => markOneRead(n.id)}
                    >
                      <div className="notif__icon-wrap" style={{ background: n.bg }}>
                        <span className="material-icons notif__icon" style={{ color: n.color }}>
                          {n.icon}
                        </span>
                      </div>
 
                      <div className="notif__text">
                        <p className="notif__title">{n.title}</p>
                        <p className="notif__desc">{n.desc}</p>
                        <span className="notif__time">
                          <span className="material-icons" style={{ fontSize: 10, verticalAlign: 'middle' }}>schedule</span>
                          {' '}{n.time}
                        </span>
                      </div>
 
                      {/* Unread indicator */}
                      {!isRead && <span className="notif__unread-dot" />}
                    </li>
                  );
                })}
              </ul>
 
              {/* Footer */}
            </div>
          )}
        </div>
 
        <div className="topbar__icon-wrap" ref={settingsRef}>
          <button
            className="topbar__icon-btn"
            onClick={() => { setSettingsOpen(!settingsOpen); setNotifOpen(false); }}
            title="Settings"
          >
            <span className="material-icons">settings</span>
          </button>
        </div>
 
        {/* Profile avatar */}
        <div className="topbar__profile-wrap">
          <button className="topbar__avatar-btn" title="Profile">
            <img
              src="/images/profile.jpg"
              alt="Profile"
              className="topbar__avatar"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="topbar__avatar-fallback" style={{ display: 'none' }}>
              <span className="material-icons" style={{ fontSize: 28, color: '#fff' }}>person</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}