import React, { useState, useMemo } from 'react';
import Topbar from './Topbar';
import SalesChart from './Saleschart';
import './Dashboard.css';
 
/* Static data lang toh (paki-replace na lang when back-end is ready)  */
 
const TRANSACTIONS = [
  { id: 'TXN-100245', customer: 'Hean Delacruz', method: 'Union Bank - Card', ref: 'UB-REF-772001', total: 20000, status: 'pending',  date: new Date('2026-03-03T08:10:00') },
  { id: 'TXN-100246', customer: 'Bill Santos',    method: 'Union Bank - Card', ref: 'UB-REF-772002', total: 20000, status: 'pending',  date: new Date('2026-03-03T09:00:00') },
  { id: 'TXN-100247', customer: 'Honey Lopez',    method: 'Cash',              ref: 'UB-REF-772003', total: 20000, status: 'pending',  date: new Date('2026-03-03T09:30:00') },
  { id: 'TXN-100248', customer: 'Leah Jimenez',   method: 'Union Bank - Card', ref: 'UB-REF-772004', total: 20000, status: 'paid',     date: new Date('2026-03-03T10:15:00') },
  { id: 'TXN-100249', customer: 'Sam Ramos',      method: 'Union Bank - Card', ref: 'UB-REF-772005', total: 20000, status: 'shipped',  date: new Date('2026-03-03T11:00:00') },
  { id: 'TXN-100250', customer: 'Nicole Cruz',    method: 'Union Bank - Card', ref: 'UB-REF-772006', total: 20000, status: 'shipped',  date: new Date('2026-03-03T11:45:00') },
];
 
const TOP_PRODUCTS = [
  { rank: 1, name: 'Pastel Sunshine Dress', price: '₱ 300.00', unitsSold: '1500 items', revenue: 'P 450,000', img: '/images/product1.jpg' },
  { rank: 2, name: 'Kiddosaurs Jammies',    price: '₱ 175.00', unitsSold: '1200 items', revenue: 'P 210,000', img: '/images/product2.jpg' },
  { rank: 3, name: 'Terno Set Clothes',     price: '₱ 150.00', unitsSold: '800 items',  revenue: 'P 120,000', img: '/images/product3.jpg' },
];
 
const LOW_STOCK = [
  { name: 'Pastel Sunshine Dress', stock: 0,  status: 'out',  color: 'red',  img: '/images/low1.jpg' },
  { name: 'Pastel Sunshine Dress', stock: 0,  status: 'out',  color: 'red',  img: '/images/low2.jpg' },
  { name: 'Pastel Sunshine Dress', stock: 0,  status: 'out',  color: 'red',  img: '/images/low3.jpg' },
  { name: 'Pastel Sunshine Dress', stock: 5,  status: 'low',  color: 'blue', img: '/images/low4.jpg' },
];
 
const STATUS_META = {
  pending: { label: 'pending', bg: 'rgba(190,19,0,0.25)', border: 'rgba(190,19,0,0.63)', dot: '#BE1300' },
  paid:    { label: 'paid',    bg: 'rgba(112,233,90,0.25)', border: '#70E95A',             dot: '#70E95A' },
  shipped: { label: 'shipped', bg: 'rgba(13,13,187,0.25)', border: 'rgba(13,13,187,0.63)', dot: '#0D0DBB' },
};
 
const PERIOD_TABS = ['Monthly', 'Quarterly', 'Yearly'];
 
export default function Dashboard() {
  const [period, setPeriod]       = useState('Monthly');
  const [sortOrder, setSortOrder] = useState('desc'); 
  const [sortDropOpen, setSortDropOpen] = useState(false);
 
  /* Sort transactions by date */
  const sortedTxns = useMemo(() => {
    return [...TRANSACTIONS].sort((a, b) =>
      sortOrder === 'desc' ? b.date - a.date : a.date - b.date
    );
  }, [sortOrder]);
 
  const formatCurrency = (n) =>
    'P ' + n.toLocaleString('en-PH', { minimumFractionDigits: 2 });
 
  return (
    <div className="dashboard">
      {/* Header row  */}
      <div className="dashboard__header">
        <div className="dashboard__title-block">
          <h1 className="dashboard__title">OVERVIEW</h1>
          <p className="dashboard__subtitle">
            View your business summary, sales insights, and activity at a glance.
          </p>
        </div>
        <Topbar />
      </div>
 
      {/* Stat cards */}
      <div className="dashboard__stats fade-in">
        <StatCard
          value={120}
          label="Total Order"
        />
        <StatCard
          value={40}
          label="To Shipped"
        />
        <StatCard
          value={5}
          label="Overdue Order"
        />
      </div>
 
      {/* Sa Right column: Top Products & Low Stock */}
      <div className="dashboard__right">
        {/* Top Selling Product */}
        <div className="dashboard__top-products fade-in" style={{ animationDelay: '0.15s' }}>
          <h2 className="section-title">Top Selling Product</h2>
          <div className="top-products__card">
            {TOP_PRODUCTS.map((p) => (
              <div key={p.rank} className="top-product__item">
                <span className="top-product__rank">{p.rank}</span>
                <div className="top-product__img-wrap">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="top-product__img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.classList.add('top-product__img-wrap--placeholder');
                    }}
                  />
                </div>
                <div className="top-product__info">
                  <p className="top-product__name">{p.name}</p>
                  <p className="top-product__price">{p.price}</p>
                  <p className="top-product__units">
                    <span>Units Sold:</span> {p.unitsSold}
                  </p>
                  <p className="top-product__revenue">
                    <span>Sales Revenue:</span> {p.revenue}
                  </p>
                </div>
                <span className="material-icons top-product__trend">trending_up</span>
              </div>
            ))}
          </div>
        </div>
 
        {/* Low Stock */}
        <div className="dashboard__low-stock fade-in" style={{ animationDelay: '0.25s' }}>
          <h2 className="section-title">Low Stock</h2>
          <div className="low-stock__list">
            {LOW_STOCK.map((item, i) => (
              <div
                key={i}
                className={`low-stock__item low-stock__item--${item.color}`}
              >
                <div className="low-stock__img-wrap">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="low-stock__img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.classList.add('low-stock__img-wrap--placeholder');
                    }}
                  />
                </div>
                <div className="low-stock__info">
                  <p className="low-stock__name">{item.name}</p>
                  <p className="low-stock__stock">
                    Stock: <strong>{item.stock}</strong>
                  </p>
                </div>
                <div className="low-stock__status">
                  <span
                    className="low-stock__dot"
                    style={{
                      background: item.color === 'red' ? '#750010' : '#0D0DBB',
                    }}
                  />
                  <span className="low-stock__label">
                    {item.status === 'out' ? 'Out of Stock' : 'Low Stock'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Analytics & Recent Transactions  */}
      <div className="dashboard__body">
        {/* Left column */}
        <div className="dashboard__left">
          {/* Sales Analytics card */}
          <div className="dashboard__chart-card fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="chart-card__header">
              <div>
                <h2 className="chart-card__title">Sales Analytics</h2>
                <p className="chart-card__sub">
                  {period === 'Monthly'   && 'Sales performance for the past 30 days'}
                  {period === 'Quarterly' && 'Sales performance every 3 months'}
                  {period === 'Yearly'    && 'Sales performance for the past 12 months'}
                </p>
              </div>
              {/* Period toggle */}
              <div className="period-toggle">
                {PERIOD_TABS.map((tab) => (
                  <button
                    key={tab}
                    className={`period-toggle__btn ${period === tab ? 'period-toggle__btn--active' : ''}`}
                    onClick={() => setPeriod(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <SalesChart period={period} />
          </div>

          {/* Recent Transactions */}
          <div className="dashboard__txn-card fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="txn__header">
              <h2 className="txn__title">Recent Transactions</h2>
              {/* Sort by date dropdown */}
              <div className="txn__sort-wrap">
                <button
                  className="txn__sort-btn"
                  onClick={() => setSortDropOpen((v) => !v)}
                >
                  <span className="txn__sort-label">Sort By:</span>
                  <span className="txn__sort-value">Date</span>
                  <span className="material-icons txn__sort-arrow">keyboard_arrow_down</span>
                </button>
                {sortDropOpen && (
                  <div className="txn__sort-drop scale-in">
                    <div
                      className={`txn__sort-option ${sortOrder === 'desc' ? 'active' : ''}`}
                      onClick={() => { setSortOrder('desc'); setSortDropOpen(false); }}
                    >
                      <span className="material-icons">arrow_downward</span>Newest 
                    </div>
                    <div
                      className={`txn__sort-option ${sortOrder === 'asc' ? 'active' : ''}`}
                      onClick={() => { setSortOrder('asc'); setSortDropOpen(false); }}
                    >
                      <span className="material-icons">arrow_upward</span>Oldest
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="txn__table-wrap">
              <table className="txn__table">
                <thead>
                  <tr className="txn__thead-row">
                    <th>Transaction ID</th>
                    <th>Customers Name</th>
                    <th>Payment Method</th>
                    <th>Payment Reference</th>
                    <th>Total Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTxns.map((txn, i) => {
                    const meta = STATUS_META[txn.status];
                    return (
                      <tr
                        key={txn.id}
                        className="txn__row"
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        <td className="txn__id">{txn.id}</td>
                        <td>{txn.customer}</td>
                        <td>{txn.method}</td>
                        <td>{txn.ref}</td>
                        <td>{formatCurrency(txn.total)}</td>
                        <td>
                          <span
                            className="txn__status-badge"
                            style={{
                              background: meta.bg,
                              border: `0.5px solid ${meta.border}`,
                            }}
                          >
                            <span
                              className="txn__status-dot"
                              style={{ background: meta.dot }}
                            />
                            {meta.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
/* Basta Stat Card sub-component */
function StatCard({ value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-card__inner">
        <p className="stat-card__value">{value}</p>
        <p className="stat-card__label">{label}</p>
      </div>
    </div>
  );
}