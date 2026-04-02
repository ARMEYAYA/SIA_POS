import React, { useState, createContext } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
 
export const SidebarContext = createContext({ expanded: false });
 
const navItems = [
  { label: 'Dashboard', iconFile: 'dashboard.png', path: '/dashboard' },
  { label: 'POS',       iconFile: 'storefront.png', path: '/pos' },
  { label: 'Transaction', iconFile: 'box_add.png', path: '/transaction' },
  { label: 'Product',   iconFile: 'box.png',        path: '/product' },
  { label: 'Reports',   iconFile: 'grouped_bar_chart.png', path: '/reports' },
  { label: 'Archive',   iconFile: 'archive.png',    path: '/archive' },
];
 
export default function Sidebar({ onExpandChange }) {
  const [expanded, setExpanded] = useState(false);
 
  const handleEnter = () => { setExpanded(true);  onExpandChange?.(true);  };
  const handleLeave = () => { setExpanded(false); onExpandChange?.(false); };
 
  const handleLogout = () => {
    alert('Log out clicked. Connect your auth logic here.');
  };
 
  return (
    <aside
      className={`sidebar ${expanded ? 'sidebar--expanded' : 'sidebar--collapsed'}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Logo */}
      <div className="sidebar__logo-wrap">
        <img
          src="/images/logo.png"
          alt="Love Athalia Essentials"
          className="sidebar__logo"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="sidebar__logo-fallback" style={{ display: 'none' }}>
          <span className="material-icons sidebar__logo-icon">favorite</span>
          <div className="sidebar__logo-text-wrap">
            <span className="sidebar__logo-text">Love Athalia</span>
            <span className="sidebar__logo-sub">ESSENTIALS</span>
          </div>
        </div>
      </div>
 
      {/* Nav */}
      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={!expanded ? item.label : undefined}
            className={({ isActive }) =>
              `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`
            }
          >
            <span className="sidebar__nav-icon">
              <img src={`/images/${item.iconFile}`} alt={item.label} className="sidebar__nav-icon-img" />
            </span>
            <span className="sidebar__nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
 
      {/* Logout */}
      <button className="sidebar__logout" onClick={handleLogout} title={!expanded ? 'Log Out' : undefined}>
        <img src="/images/exit_to_app.png" alt="Log out" className="sidebar__logout-icon-img" />
        <span className="sidebar__logout-label">Log Out</span>
      </button>
    </aside>
  );
}