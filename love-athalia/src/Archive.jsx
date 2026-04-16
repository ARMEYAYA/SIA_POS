import React, { useState, useRef, useEffect, useMemo } from 'react';
import Topbar from './Topbar';
import './Archive.css';

const ARCHIVED_TRANSACTIONS = [
  { id: 'TXN-100245', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'cancelled' },
  { id: 'TXN-100246', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'cancelled' },
  { id: 'TXN-100247', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'completed' },
  { id: 'TXN-100248', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'cancelled' },
  { id: 'TXN-100249', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'completed' },
  { id: 'TXN-100250', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'cancelled' },
  { id: 'TXN-100251', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'completed' },
  { id: 'TXN-100252', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'cancelled' },
  { id: 'TXN-100253', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'cancelled' },
];

const ARCHIVED_INVENTORY = [
  { id: 1, code: 'PLNPJSSMALLB3', name: 'Plain Pajamas',       sizes: '3,7',   pack: 10, pcs: 5,  retailPrice: 145,  pricePerPack: 725,  dateAdded: '03/01/2026', img: null },
  { id: 2, code: 'PLNPJSSMALLB3', name: 'Plain Pajamas',       sizes: '3,7',   pack: 10, pcs: 20, retailPrice: 725,  pricePerPack: 725,  dateAdded: '03/02/2026', img: null },
  { id: 3, code: 'SNSDRSMD5',     name: 'Sunshine Dress',      sizes: '80,90', pack: 6,  pcs: 12, retailPrice: 300,  pricePerPack: 1800, dateAdded: '03/03/2026', img: null },
  { id: 4, code: 'KDJMSLGB7',     name: 'Kiddosaurs Jammies',  sizes: '100',   pack: 8,  pcs: 16, retailPrice: 175,  pricePerPack: 1400, dateAdded: '03/04/2026', img: null },
  { id: 5, code: 'TRNSETMXB2',    name: 'Terno Set Clothes',   sizes: '80,90', pack: 6,  pcs: 12, retailPrice: 150,  pricePerPack: 900,  dateAdded: '03/05/2026', img: null },
  { id: 6, code: 'BTRDYBOYS9',    name: 'Better Days Boy Set', sizes: '110',   pack: 4,  pcs: 8,  retailPrice: 1750, pricePerPack: 7000, dateAdded: '03/06/2026', img: null },
];

const TXN_STATUS_META = {
  cancelled: { label: 'cancelled', bg: 'rgba(209,213,219,0.25)', border: 'rgba(209,213,219,0.66)', dot: '#D1D5DB' },
  completed: { label: 'completed', bg: 'rgba(112,233,90,0.25)',  border: 'rgba(112,233,90,0.63)',  dot: '#70E95A' },
};

const SUB_TABS = ['Transaction', 'Inventory'];

const formatCurrency = (n) => '₱ ' + n.toLocaleString('en-PH', { minimumFractionDigits: 2 });

/* ─── Badges ─── */
function StatusBadgeTxn({ status }) {
  const m = TXN_STATUS_META[status] || TXN_STATUS_META.cancelled;
  return (
    <span className="archive__badge" style={{ background: m.bg, border: `0.5px solid ${m.border}` }}>
      <span className="archive__badge-dot" style={{ background: m.dot }} />
      {m.label}
    </span>
  );
}

const CAL_DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function MiniCalendar({ year, month, rangeStart, rangeEnd, hovered, onSelect, onHover }) {
  const firstDay     = new Date(year, month, 1).getDay();
  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const prevMonthEnd = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevMonthEnd - i, inMonth: false });
  for (let d = 1; d <= daysInMonth; d++)  cells.push({ day: d, inMonth: true });
  while (cells.length < 42) cells.push({ day: cells.length - firstDay - daysInMonth + 1, inMonth: false });
  const ts = (d) => d ? new Date(d).setHours(0,0,0,0) : null;
  function cellClass(c) {
    if (!c.inMonth) return 'mc-cell mc-cell--out';
    const t  = new Date(year, month, c.day).setHours(0,0,0,0);
    const s  = ts(rangeStart);
    const e  = ts(rangeEnd) || ts(hovered);
    const lo = s && e ? Math.min(s,e) : s;
    const hi = s && e ? Math.max(s,e) : null;
    let cls = 'mc-cell';
    if (s && t === s) cls += ' mc-cell--start';
    else if (e && t === ts(rangeEnd)) cls += ' mc-cell--end';
    else if (lo && hi && t > lo && t < hi) cls += ' mc-cell--range';
    return cls;
  }
  return (
    <div className="mini-cal">
      <div className="mini-cal__grid">
        {CAL_DAYS.map(d => <span key={d} className="mc-day-name">{d}</span>)}
        {cells.map((c, i) => (
          <span key={i} className={cellClass(c)}
            onClick={() => c.inMonth && onSelect(new Date(year, month, c.day))}
            onMouseEnter={() => c.inMonth && onHover(new Date(year, month, c.day))}
          >{c.day}</span>
        ))}
      </div>
    </div>
  );
}

const MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function DateRangePicker({ value, onChange, onClose }) {
  const now = new Date();
  const [view, setView] = useState('day');
  const [yr,   setYr]   = useState(now.getFullYear());
  const [mo,   setMo]   = useState(now.getMonth());
  const [hov,  setHov]  = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);
  const { from, to } = value || {};
  function handleDaySelect(date) {
    if (!from || (from && to)) { onChange({ from: date, to: null }); setHov(null); }
    else { onChange(date < from ? { from: date, to: from } : { from, to: date }); }
  }
  function handleMonthClick(idx) { setMo(idx); setView('day'); }
  function prevNav() {
    if (view === 'month') { setYr(y => y - 1); return; }
    if (mo === 0) { setMo(11); setYr(y => y - 1); } else setMo(m => m - 1);
  }
  function nextNav() {
    if (view === 'month') { setYr(y => y + 1); return; }
    if (mo === 11) { setMo(0); setYr(y => y + 1); } else setMo(m => m + 1);
  }
  const fmt = (d) => d ? d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  return (
    <div className={`drp${view === 'month' ? ' drp--month-view' : ''}`} ref={ref} onClick={(e) => e.stopPropagation()}>
      <div className="drp__nav-row">
        <button className="drp__nav-btn" onClick={prevNav}>
          <span className="material-icons" style={{ fontSize: 18 }}>chevron_left</span>
        </button>
        {view === 'day' ? (
          <button className="drp__month-year-btn" onClick={() => setView('month')}>
            {MONTHS_FULL[mo].slice(0, 3)} {yr}
          </button>
        ) : (
          <span className="drp__year-display">{yr}</span>
        )}
        <button className="drp__nav-btn" onClick={nextNav}>
          <span className="material-icons" style={{ fontSize: 18 }}>chevron_right</span>
        </button>
      </div>
      {view === 'day' && (
        <>
          <MiniCalendar year={yr} month={mo} rangeStart={from} rangeEnd={to} hovered={hov} onSelect={handleDaySelect} onHover={setHov} />
          <div className="drp__footer">
            <span className="drp__range-label">{fmt(from)} – {fmt(to)}</span>
            <button className="drp__apply" onClick={onClose}>Apply</button>
          </div>
        </>
      )}
      {view === 'month' && (
        <div className="drp__month-list">
          <div className="drp__month-col">
            {MONTHS_FULL.slice(0, 6).map((m, i) => (
              <button key={m} className={`drp__month-item${i === mo ? ' drp__month-item--active' : ''}`} onClick={() => handleMonthClick(i)}>{m}</button>
            ))}
          </div>
          <div className="drp__month-col">
            {MONTHS_FULL.slice(6).map((m, i) => (
              <button key={m} className={`drp__month-item${i + 6 === mo ? ' drp__month-item--active' : ''}`} onClick={() => handleMonthClick(i + 6)}>{m}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TransactionTab({ search }) {
  const [statusFilter, setStatusFilter]   = useState('all');
  const [statusDropOpen, setStatusDropOpen] = useState(false);

  useEffect(() => {
    const h = (e) => {
      if (!e.target.closest('.archive__status-th')) setStatusDropOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filtered = useMemo(() => {
    return ARCHIVED_TRANSACTIONS
      .filter((r) => {
        const matchSearch =
          r.id.toLowerCase().includes(search.toLowerCase()) ||
          r.customer.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || r.status === statusFilter;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => b.id.localeCompare(a.id));
  }, [search, statusFilter]);

  return (
    <div className="archive__card">
      <div className="archive__table-wrap">
        <table className="archive__table">
          <thead>
            <tr className="archive__thead-row">
              <th>Transaction ID</th>
              <th>Customer Full Name</th>
              <th>Date of Order</th>
              <th>Total Amount</th>
              <th>
                <div className="archive__status-th">
                  <span>Status</span>
                  <span
                    className="material-icons archive__th-arrow"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setStatusDropOpen(v => !v)}
                  >arrow_drop_down</span>
                  {statusDropOpen && (
                    <div className="archive__status-drop">
                      <div
                        className={`archive__status-option ${statusFilter === 'all' ? 'active' : ''}`}
                        onClick={() => { setStatusFilter('all'); setStatusDropOpen(false); }}
                      >
                        <span className="archive__status-all-dot" />
                        All
                      </div>
                      {Object.entries(TXN_STATUS_META).map(([key, meta]) => (
                        <div
                          key={key}
                          className={`archive__status-option ${statusFilter === key ? 'active' : ''}`}
                          onClick={() => { setStatusFilter(key); setStatusDropOpen(false); }}
                        >
                          <span className="archive__badge-dot" style={{ background: meta.dot, width: 10, height: 10, borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
                          {meta.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </th>
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
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="archive__empty-row">No archived transactions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryTab({ search }) {
  const filtered = useMemo(() => {
    return ARCHIVED_INVENTORY
      .filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => b.id - a.id);
  }, [search]);

  return (
    <div className="archive__card">
      <div className="archive__table-wrap">
        <table className="archive__table">
          <thead>
            <tr className="archive__thead-row">
              <th>No.</th>
              <th>Product ID</th>
              <th>Product Img</th>
              <th>Product Name</th>
              <th>Size</th>
              <th>Pack</th>
              <th>Pcs</th>
              <th>Unit Price</th>
              <th>Price Per Pack</th>
              <th>Date Added</th>
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
                <td>{p.sizes}</td>
                <td>{p.pack}</td>
                <td>{p.pcs}</td>
                <td>₱ {p.retailPrice.toLocaleString()}</td>
                <td>₱ {p.pricePerPack.toLocaleString()}</td>
                <td className="archive__td--date">{p.dateAdded}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={10} className="archive__empty-row">No archived products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Archive() {
  const [activeTab,      setActiveTab]      = useState('Transaction');
  const [search,         setSearch]         = useState('');
  const [dateRange,      setDateRange]      = useState({ from: null, to: null });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch('');
  };

  function formatDateRange() {
    const f = (d) => d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    if (dateRange.from && dateRange.to) return `${f(dateRange.from)} – ${f(dateRange.to)}`;
    if (dateRange.from) return `${f(dateRange.from)} – —`;
    return 'From – To';
  }

  const hasDate = !!(dateRange.from);

  return (
    <div className="archive-page">
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

            <div className="archive__date-wrap">
              <button
                className={`archive__date-btn${hasDate ? ' archive__date-btn--active' : ''}`}
                onClick={() => setShowDatePicker(v => !v)}
              >
                <span className="material-icons" style={{ fontSize: 16, color: '#1C1B1F', flexShrink: 0 }}>filter_list</span>
                <span className="archive__date-label">Date:</span>
                <span className="archive__date-range">{formatDateRange()}</span>
                {hasDate && (
                  <button
                    className="archive__date-clear"
                    onClick={(e) => { e.stopPropagation(); setDateRange({ from: null, to: null }); setShowDatePicker(false); }}
                    title="Clear date filter"
                  >
                    <span className="material-icons" style={{ fontSize: 13 }}>close</span>
                  </button>
                )}
              </button>
              {showDatePicker && (
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  onClose={() => setShowDatePicker(false)}
                />
              )}
            </div>
          </div>
        </div>

        {activeTab === 'Transaction' && <TransactionTab search={search} />}
        {activeTab === 'Inventory'   && <InventoryTab   search={search} />}
      </div>
    </div>
  );
}