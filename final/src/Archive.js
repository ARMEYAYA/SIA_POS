import React, { useState, useMemo } from 'react';
import Topbar from './Topbar';
import './Archive.css';
 
const ARCHIVED_TRANSACTIONS = [
  { id: 'TXN-100245', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'cancelled' },
  { id: 'TXN-100246', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'cancelled' },
  { id: 'TXN-100247', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'cancelled' },
  { id: 'TXN-100248', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'cancelled' },
  { id: 'TXN-100249', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'cancelled' },
  { id: 'TXN-100250', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'cancelled' },
  { id: 'TXN-100251', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'cancelled' },
  { id: 'TXN-100252', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'cancelled' },
  { id: 'TXN-100253', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'cancelled' },
];
 
const ARCHIVED_INVENTORY = [
  { id: 1, code: 'PLNPJSSMALLB3', name: 'Plain Pajamas',       sizes: '3,7',   pack: 10, pcs: 5,  retailPrice: 145,  pricePerPack: 725,  status: 'out', img: null },
  { id: 2, code: 'PLNPJSSMALLB3', name: 'Plain Pajamas',       sizes: '3,7',   pack: 10, pcs: 20, retailPrice: 725,  pricePerPack: 725,  status: 'out', img: null },
  { id: 3, code: 'SNSDRSMD5',     name: 'Sunshine Dress',      sizes: '80,90', pack: 6,  pcs: 12, retailPrice: 300,  pricePerPack: 1800, status: 'out', img: null },
  { id: 4, code: 'KDJMSLGB7',     name: 'Kiddosaurs Jammies',  sizes: '100',   pack: 8,  pcs: 16, retailPrice: 175,  pricePerPack: 1400, status: 'out', img: null },
  { id: 5, code: 'TRNSETMXB2',    name: 'Terno Set Clothes',   sizes: '80,90', pack: 6,  pcs: 12, retailPrice: 150,  pricePerPack: 900,  status: 'out', img: null },
  { id: 6, code: 'BTRDYBOYS9',    name: 'Better Days Boy Set', sizes: '110',   pack: 4,  pcs: 8,  retailPrice: 1750, pricePerPack: 7000, status: 'out', img: null },
];
 
const LOG_REPORTS = [
  { id: 1, name: 'Ella', email: 'ellamatriz@gmail.com', role: 'Admin',           lastActive: 'March 10, 2026', timeIn: '9:00AM', timeOut: '8:00PM', img: null },
  { id: 2, name: 'Ella', email: 'ellamatriz@gmail.com', role: 'Manager',         lastActive: 'March 10, 2026', timeIn: '9:00AM', timeOut: '8:00PM', img: null },
  { id: 3, name: 'Ella', email: 'ellamatriz@gmail.com', role: 'Manager',         lastActive: 'March 10, 2026', timeIn: '9:00AM', timeOut: '8:00PM', img: null },
  { id: 4, name: 'Ella', email: 'ellamatriz@gmail.com', role: 'Inventory Staff', lastActive: 'March 10, 2026', timeIn: '9:00AM', timeOut: '8:00PM', img: null },
  { id: 5, name: 'Ella', email: 'ellamatriz@gmail.com', role: 'Inventory Staff', lastActive: 'March 10, 2026', timeIn: '9:00AM', timeOut: '8:00PM', img: null },
  { id: 6, name: 'Ella', email: 'ellamatriz@gmail.com', role: 'Cashier',         lastActive: 'March 10, 2026', timeIn: '9:00AM', timeOut: '8:00PM', img: null },
];
 
const TXN_STATUS_META   = { cancelled: { label: 'cancelled', bg: 'rgba(209,213,219,0.25)', border: 'rgba(209,213,219,0.66)', dot: '#D1D5DB' } };
const INV_STATUS_META   = {
  out: { label: 'Out of Stock', bg: 'rgba(159,0,3,0.25)',    border: 'rgba(159,0,3,0.63)',    dot: '#750010' },
  low: { label: 'Low Stock',    bg: 'rgba(13,13,187,0.25)',  border: 'rgba(13,13,187,0.63)',  dot: '#0D0DBB' },
  in:  { label: 'In Stock',     bg: 'rgba(112,233,90,0.25)', border: 'rgba(112,233,90,0.63)', dot: '#70E95A' },
};
const ROLE_META = {
  'Admin':           { bg: 'rgba(23,130,57,0.29)',   border: '#178239', color: '#178239' },
  'Manager':         { bg: 'rgba(199,22,155,0.29)',  border: '#C7169B', color: '#C7169B' },
  'Inventory Staff': { bg: 'rgba(22,36,199,0.29)',   border: '#1624C7', color: '#1624C7' },
  'Cashier':         { bg: 'rgba(113,18,145,0.29)',  border: '#711291', color: '#711291' },
};
 
const SUB_TABS = ['Transaction', 'Inventory', 'Log Reports'];
const formatCurrency = (n) => '₱ ' + n.toLocaleString('en-PH', { minimumFractionDigits: 2 });
 
function StatusBadgeTxn({ status }) {
  const m = TXN_STATUS_META[status] || TXN_STATUS_META.cancelled;
  return <span className="archive__badge" style={{ background: m.bg, border: `0.5px solid ${m.border}` }}><span className="archive__badge-dot" style={{ background: m.dot }} />{m.label}</span>;
}
function StatusBadgeInv({ status }) {
  const m = INV_STATUS_META[status] || INV_STATUS_META.out;
  return <span className="archive__badge" style={{ background: m.bg, border: `0.5px solid ${m.border}` }}><span className="archive__badge-dot" style={{ background: m.dot }} />{m.label}</span>;
}
function RoleBadge({ role }) {
  const m = ROLE_META[role] || ROLE_META['Admin'];
  return <span className="archive__role-badge" style={{ background: m.bg, border: `0.5px solid ${m.border}`, color: m.color }}>{role}</span>;
}
function UserAvatar({ name, img }) {
  if (img) return <img src={img} alt={name} className="archive__avatar" />;
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return <div className="archive__avatar archive__avatar--fallback">{initials}</div>;
}
 
function TransactionTab({ search, sortOrder }) {
  const filtered = useMemo(() => {
    let d = ARCHIVED_TRANSACTIONS.filter((r) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase())
    );
    return [...d].sort((a, b) => sortOrder === 'desc' ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id));
  }, [search, sortOrder]);
 
  return (
    <div className="archive__card">
      <div className="archive__table-wrap">
        <table className="archive__table">
          <thead>
            <tr className="archive__thead-row">
              <th>Transaction ID</th><th>Customer Full Name</th><th>Date of Order</th><th>Total Amount</th>
              <th>Status <span className="material-icons archive__th-arrow">arrow_drop_down</span></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={row.id + i} className="archive__row">
                <td className="archive__td--id">{row.id}</td>
                <td>{row.customer}</td>
                <td>{row.date}</td>
                <td>{formatCurrency(row.total)}</td>
                <td><StatusBadgeTxn status={row.status} /></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="archive__empty-row">No archived transactions found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
function InventoryTab({ search, sortOrder }) {
  const filtered = useMemo(() => {
    let d = ARCHIVED_INVENTORY.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
    );
    return [...d].sort((a, b) => sortOrder === 'desc' ? b.id - a.id : a.id - b.id);
  }, [search, sortOrder]);
 
  return (
    <div className="archive__card">
      <div className="archive__table-wrap">
        <table className="archive__table">
          <thead>
            <tr className="archive__thead-row">
              <th>No.</th><th>Product ID</th><th>Product Img</th><th>Product Name</th>
              <th>Size</th><th>Pack</th><th>Pcs</th><th>Unit Price</th><th>Price Per Pack</th>
              <th>Status <span className="material-icons archive__th-arrow">arrow_drop_down</span></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} className="archive__row">
                <td className="archive__td--no">{i + 1}</td>
                <td className="archive__td--code">{p.code}</td>
                <td>
                  <div className="archive__img-cell">
                    {p.img
                      ? <img src={p.img} alt={p.name} className="archive__product-img" onError={(e) => (e.target.style.display = 'none')} />
                      : <div className="archive__product-img-placeholder"><span className="material-icons" style={{ fontSize: 22, color: '#ccc' }}>image</span></div>
                    }
                  </div>
                </td>
                <td>{p.name}</td>
                <td>{p.sizes}</td><td>{p.pack}</td><td>{p.pcs}</td>
                <td>₱ {p.retailPrice.toLocaleString()}</td>
                <td>₱ {p.pricePerPack.toLocaleString()}</td>
                <td><StatusBadgeInv status={p.status} /></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={10} className="archive__empty-row">No archived products found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
function LogReportsTab({ search, sortOrder }) {
  const filtered = useMemo(() => {
    let d = LOG_REPORTS.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
    );
    return [...d].sort((a, b) => sortOrder === 'desc' ? b.id - a.id : a.id - b.id);
  }, [search, sortOrder]);
 
  return (
    <div className="archive__card">
      <div className="archive__table-wrap">
        <table className="archive__table">
          <thead>
            <tr className="archive__thead-row">
              <th>Username</th><th>Access</th><th>Last Active</th><th>Time In</th><th>Time Out</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="archive__row">
                <td>
                  <div className="archive__user-cell">
                    <UserAvatar name={user.name} img={user.img} />
                    <div className="archive__user-info">
                      <span className="archive__user-name">{user.name}</span>
                      <span className="archive__user-email">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td><RoleBadge role={user.role} /></td>
                <td>{user.lastActive}</td>
                <td>{user.timeIn}</td>
                <td>{user.timeOut}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="archive__empty-row">No log records found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
export default function Archive() {
  const [activeTab, setActiveTab] = useState('Transaction');
 
  const [search, setSearch]       = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortOpen, setSortOpen]   = useState(false);
 
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch('');
  };
 
  return (
    <div className="archive-page">
      {/* ── Header ── */}
      <div className="archive-page__header">
        <div className="archive-page__title-block">
          <h1 className="archive-page__title">ARCHIVE</h1>
        </div>
        <Topbar />
      </div>
 
      <div className="archive-page__body">
 
        <div className="archive-page__controls">
 
          <div className="archive-page__subtabs">
            {SUB_TABS.map((tab) => (
              <button
                key={tab}
                className={`archive-page__subtab ${activeTab === tab ? 'archive-page__subtab--active' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
 
          <div className="archive-page__tools">
            <div className="archive__search">
              <span className="material-icons archive__search-icon">search</span>
              <input
                className="archive__search-input"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
 
            <div className="archive__sort-wrap">
              <button className="archive__sort-btn" onClick={() => setSortOpen((v) => !v)}>
                <span className="archive__sort-label">Sort By:</span>
                <span className="archive__sort-value">Date</span>
                <span className="material-icons archive__sort-arrow">keyboard_arrow_down</span>
              </button>
              {sortOpen && (
                <div className="archive__sort-drop">
                  <div className={`archive__sort-option ${sortOrder === 'desc' ? 'active' : ''}`}
                    onClick={() => { setSortOrder('desc'); setSortOpen(false); }}>
                    <span className="material-icons">arrow_downward</span> Newest
                  </div>
                  <div className={`archive__sort-option ${sortOrder === 'asc' ? 'active' : ''}`}
                    onClick={() => { setSortOrder('asc'); setSortOpen(false); }}>
                    <span className="material-icons">arrow_upward</span> Oldest
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
 
        {activeTab === 'Transaction' && <TransactionTab search={search} sortOrder={sortOrder} />}
        {activeTab === 'Inventory'   && <InventoryTab   search={search} sortOrder={sortOrder} />}
        {activeTab === 'Log Reports' && <LogReportsTab  search={search} sortOrder={sortOrder} />}
      </div>
    </div>
  );
}