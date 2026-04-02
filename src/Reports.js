import React, { useState } from 'react';
import Topbar from './Topbar';
import SalesChart from './Saleschart';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import './Reports.css';
 
const SALES_TREND_TABLE = {
  Monthly: {
    colLabel: 'Month',
    rows: [
      { period: 'Week 1', dailywear: 1200, ootd: 1000, dress: 800,  sleepwear: 1500,  revenue: 'P 1,125,000' },
      { period: 'Week 2', dailywear: 1000, ootd: 900,  dress: 700,  sleepwear: 1200,  revenue: 'P 950,000'   },
      { period: 'Week 3', dailywear: 1400, ootd: 1100, dress: 900,  sleepwear: 1500,  revenue: 'P 1,225,000' },
      { period: 'Week 4', dailywear: 800,  ootd: 700,  dress: 500,  sleepwear: 900,   revenue: 'P 750,000'   },
      { period: 'TOTAL',  dailywear: 4400, ootd: 3700, dress: 2900, sleepwear: 5100,  revenue: 'P 4,050,000', isTotal: true },
    ],
  },
  Quarterly: {
    colLabel: 'Quarter',
    rows: [
      { period: 'Q1 ( Jan - Mar )', dailywear: 3600,  ootd: 3000,  dress: 2400, sleepwear: 4200,  revenue: 'P 3,300,000'  },
      { period: 'Q2 ( Apr - Jun )', dailywear: 3200,  ootd: 2800,  dress: 2100, sleepwear: 3800,  revenue: 'P 2,950,000'  },
      { period: 'Q3 ( Jul - Sep )', dailywear: 2800,  ootd: 2400,  dress: 1800, sleepwear: 3400,  revenue: 'P 2,600,000'  },
      { period: 'Q4 ( Oct - Dec )', dailywear: 3500,  ootd: 2900,  dress: 2200, sleepwear: 4000,  revenue: 'P 3,100,000'  },
      { period: 'TOTAL',            dailywear: 13100, ootd: 11100, dress: 8500, sleepwear: 15400, revenue: 'P 11,950,000', isTotal: true },
    ],
  },
  Yearly: {
    colLabel: 'Month',
    rows: [
      { period: 'January',   dailywear: 1200,  ootd: 1000,  dress: 800,  sleepwear: 1500,  revenue: 'P 1,125,000' },
      { period: 'February',  dailywear: 1000,  ootd: 900,   dress: 700,  sleepwear: 1200,  revenue: 'P 950,000'   },
      { period: 'March',     dailywear: 1400,  ootd: 1100,  dress: 900,  sleepwear: 1500,  revenue: 'P 1,225,000' },
      { period: 'April',     dailywear: 1100,  ootd: 950,   dress: 750,  sleepwear: 1300,  revenue: 'P 1,025,000' },
      { period: 'May',       dailywear: 1300,  ootd: 1050,  dress: 850,  sleepwear: 1400,  revenue: 'P 1,150,000' },
      { period: 'June',      dailywear: 1150,  ootd: 980,   dress: 780,  sleepwear: 1280,  revenue: 'P 1,040,000' },
      { period: 'July',      dailywear: 900,   ootd: 780,   dress: 620,  sleepwear: 1100,  revenue: 'P 870,000'   },
      { period: 'August',    dailywear: 950,   ootd: 820,   dress: 640,  sleepwear: 1150,  revenue: 'P 910,000'   },
      { period: 'September', dailywear: 1050,  ootd: 880,   dress: 700,  sleepwear: 1200,  revenue: 'P 960,000'   },
      { period: 'October',   dailywear: 980,   ootd: 830,   dress: 660,  sleepwear: 1150,  revenue: 'P 920,000'   },
      { period: 'November',  dailywear: 1350,  ootd: 1100,  dress: 870,  sleepwear: 1450,  revenue: 'P 1,175,000' },
      { period: 'December',  dailywear: 1620,  ootd: 1380,  dress: 1030, sleepwear: 1770,  revenue: 'P 1,450,000' },
      { period: 'TOTAL',     dailywear: 13000, ootd: 10770, dress: 8300, sleepwear: 15000, revenue: 'P 11,575,000', isTotal: true },
    ],
  },
};
 
const RETURN_DATA = {
  Monthly: [
    { label: 'Week 1', exchange: 42, defective: 38 },
    { label: 'Week 2', exchange: 58, defective: 65 },
    { label: 'Week 3', exchange: 75, defective: 82 },
    { label: 'Week 4', exchange: 91, defective: 78 },
  ],
  Quarterly: [
    { label: 'Jan-Mar', exchange: 74,  defective: 82  },
    { label: 'Apr-Jun', exchange: 88,  defective: 101 },
    { label: 'Jul-Sep', exchange: 113, defective: 143 },
    { label: 'Oct-Dec', exchange: 175, defective: 179 },
  ],
  Yearly: [
    { label: 'Jan', exchange: 74,  defective: 82  }, { label: 'Feb', exchange: 88,  defective: 101 },
    { label: 'Mar', exchange: 113, defective: 143 }, { label: 'Apr', exchange: 175, defective: 179 },
    { label: 'May', exchange: 109, defective: 124 }, { label: 'Jun', exchange: 120, defective: 113 },
    { label: 'Jul', exchange: 72,  defective: 58  }, { label: 'Aug', exchange: 78,  defective: 89  },
    { label: 'Sep', exchange: 86,  defective: 113 }, { label: 'Oct', exchange: 66,  defective: 89  },
    { label: 'Nov', exchange: 140, defective: 123 }, { label: 'Dec', exchange: 233, defective: 241 },
  ],
};
 
const RETURN_TABLE_ALL = [
  ...Array.from({ length: 6 }, (_, i) => ({
    txnId: `TXN00${i + 1}`, productId: `P100${i + 1}`,
    productName: 'Product Name', size: '100',
    returnQty: String(5 + i), amount: `P ${(i + 1) * 50}.00`, reason: 'exchange',
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    txnId: `TXN0${i + 7}`, productId: `P200${i + 1}`,
    productName: 'Product Name', size: '100',
    returnQty: String(3 + i), amount: `P ${(i + 1) * 40}.00`, reason: 'defective',
  })),
];
 
const CATEGORY_DATA = [
  { label: 'Sleepwear', pct: 45, color: '#FED700' },
  { label: 'Dailywear', pct: 30, color: '#1500A0' },
  { label: 'OOTD',      pct: 15, color: '#C31D7B' },
  { label: 'Dress',     pct: 10, color: '#419E0B' },
];
 
const TOP_PRODUCTS = [
  { rank: 1, name: 'Pastel Sunshine Dress', price: '₱ 300.00', units: '1,500 items', revenue: 'P 450,000', img: '/images/product1.jpg' },
  { rank: 2, name: 'Kiddosaurs Jammies',    price: '₱ 175.00', units: '1,200 items', revenue: 'P 210,000', img: '/images/product2.jpg' },
  { rank: 3, name: 'Terno Set Clothes',     price: '₱ 150.00', units: '800 items',   revenue: 'P 120,000', img: '/images/product3.jpg' },
  { rank: 4, name: 'Terno Set Clothes',     price: '₱ 200.00', units: '600 items',   revenue: 'P 120,000', img: '/images/product3.jpg' },
  { rank: 5, name: 'Terno Set Clothes',     price: '₱ 200.00', units: '300 items',   revenue: 'P 60,000',  img: '/images/product3.jpg' },
];
 
const CATEGORY_PRODUCTS = {
  Sleepwear: generateProducts(),
  Dailywear: generateProducts(),
  OOTD:      generateProducts(),
  Dress:     generateProducts(),
};
 
function generateProducts() {
  return [
    { id: 'CODE', name: 'Summer Floral Dress',  wholesale: '₱7,500', unitPrice: '₱375',   stock: 30, unitsSold: 20, revenue: '₱13,500', img: '/images/product1.jpg' },
    { id: 'CODE', name: 'Party Tulle Dress',    wholesale: '₱5,500', unitPrice: '₱550',   stock: 30, unitsSold: 20, revenue: '₱13,500', img: '/images/product1.jpg' },
    { id: 'CODE', name: 'Casual Cotton Dress',  wholesale: '₱9,000', unitPrice: '₱300',   stock: 30, unitsSold: 20, revenue: '₱13,500', img: '/images/product1.jpg' },
    { id: 'CODE', name: 'Denim Jumper Dress',   wholesale: '₱6,750', unitPrice: '₱450',   stock: 30, unitsSold: 20, revenue: '₱13,500', img: '/images/product1.jpg' },
    { id: 'CODE', name: 'Princess Gown',        wholesale: '₱5,000', unitPrice: '₱1,000', stock: 30, unitsSold: 20, revenue: '₱13,500', img: '/images/product1.jpg' },
    { id: 'CODE', name: 'Polka Dot Dress',      wholesale: '₱8,400', unitPrice: '₱350',   stock: 30, unitsSold: 20, revenue: '₱13,500', img: '/images/product1.jpg' },
    { id: 'CODE', name: 'Sleeveless Cotton',    wholesale: '₱6,000', unitPrice: '₱300',   stock: 30, unitsSold: 20, revenue: '₱13,500', img: '/images/product1.jpg' },
    { id: 'CODE', name: 'Ruffled Party Dress',  wholesale: '₱9,600', unitPrice: '₱600',   stock: 30, unitsSold: 20, revenue: '₱13,500', img: '/images/product1.jpg' },
  ];
}
 
const CATEGORY_HEADER_BG = {
  Sleepwear: 'rgba(254, 215, 0, 0.28)',
  Dailywear: 'rgba(21, 0, 160, 0.14)',
  OOTD:      'rgba(195, 29, 123, 0.18)',
  Dress:     'rgba(65, 158, 11, 0.18)',
};
 

const SHARED_PRINT_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 11px; color: #000; padding: 28px; }
  h1  { font-size: 18px; font-weight: 800; color: #8B333D; margin-bottom: 4px; }
  p.sub { font-size: 11px; color: rgba(0,0,0,0.45); margin-bottom: 16px; font-style: italic; }
  table { width: 100%; border-collapse: collapse; font-size: 10px; }
  thead tr { background: rgba(255,242,141,0.6); }
  th { padding: 8px 10px; font-weight: 700; text-align: left; border-bottom: 1px solid #ddd; white-space: nowrap; }
  td { padding: 8px 10px; border-bottom: 1px solid rgba(0,0,0,0.06); vertical-align: middle; }
  tr.total-row td { background: rgba(255,242,141,0.25); font-weight: 700; border-top: 1.5px solid rgba(0,0,0,0.12); }
  tr:nth-child(even):not(.total-row) td { background: rgba(0,0,0,0.016); }
  .revenue { color: #226133; font-weight: 700; text-align: right; }
  .center   { text-align: center; }
  .footer   { margin-top: 20px; font-size: 8px; color: rgba(0,0,0,0.38); text-align: center; border-top: 1px solid #eee; padding-top: 10px; }
  @media print { html, body { height: auto; } }
`;
 
function openPrintWindow(html) {
  const pw = window.open('', '_blank', 'width=960,height=750');
  if (!pw) { alert('Pop-up blocked. Please allow pop-ups to enable printing.'); return; }
  pw.document.write(html);
  pw.document.close();
  pw.onload = () => { pw.focus(); pw.print(); };
}
 
function downloadHTML(html, filename) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
 
function generateSalesTrendHTML(period, colLabel, rows) {
  const title =
    period === 'Monthly'   ? 'Monthly Sales Trend'   :
    period === 'Quarterly' ? 'Quarterly Sales Trend'  :
                             'Yearly Sales Trend';
  const bodyRows = rows.map((r) => `
    <tr class="${r.isTotal ? 'total-row' : ''}">
      <td>${r.period}</td>
      <td>${r.dailywear.toLocaleString()}</td>
      <td>${r.ootd.toLocaleString()}</td>
      <td>${r.dress.toLocaleString()}</td>
      <td>${r.sleepwear.toLocaleString()}</td>
      <td class="revenue">${r.revenue}</td>
    </tr>`).join('');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
    <title>${title}</title><style>${SHARED_PRINT_STYLES}</style></head>
    <body>
      <h1>LOVE ATHALIA — ${title}</h1>
      <p class="sub">Sales performance breakdown by category · Generated ${new Date().toLocaleDateString('en-PH')}</p>
      <table>
        <thead><tr><th>${colLabel}</th><th>Dailywear Units</th><th>OOTD Units</th><th>Dress Units</th><th>Sleepwear Units</th><th style="text-align:right">Total Revenue</th></tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
      <div class="footer">BIR Permit No. OCN 027 AU2024000002225</div>
    </body></html>`;
}
 
function generateCategoryHTML(category, products) {
  const bodyRows = products.map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.wholesale} <span style="font-size:8px;color:rgba(0,0,0,0.4)">(6 pcs)</span></td>
      <td>${p.unitPrice}</td>
      <td class="center">${p.stock}</td>
      <td class="center">${p.unitsSold}</td>
      <td class="revenue">${p.revenue}</td>
    </tr>`).join('');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
    <title>${category} — Category Sales</title><style>${SHARED_PRINT_STYLES}</style></head>
    <body>
      <h1>LOVE ATHALIA — ${category}</h1>
      <p class="sub">Product inventory &amp; sales breakdown · Generated ${new Date().toLocaleDateString('en-PH')}</p>
      <table>
        <thead><tr><th>Rank</th><th>Item Code</th><th>Product Name</th><th>Wholesale Price</th><th>Unit Price</th><th class="center">Stock</th><th class="center">Units Sold</th><th style="text-align:right">Revenue</th></tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
      <div class="footer">BIR Permit No. OCN 027 AU2024000002225</div>
    </body></html>`;
}
 
function generateReturnHTML(title, rows) {
  const bodyRows = rows.map((r) => `
    <tr>
      <td>${r.txnId}</td>
      <td>${r.productId}</td>
      <td>${r.productName}</td>
      <td class="center">${r.size}</td>
      <td class="center">${r.returnQty}</td>
      <td>${r.amount}</td>
      <td><span style="padding:3px 8px;border-radius:20px;font-size:9px;font-weight:600;
        background:${r.reason === 'exchange' ? 'rgba(255,182,200,0.25)' : 'rgba(120,165,250,0.2)'};
        color:${r.reason === 'exchange' ? '#b84d6a' : '#3a6ecc'}">${r.reason}</span></td>
    </tr>`).join('');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
    <title>${title}</title><style>${SHARED_PRINT_STYLES}</style></head>
    <body>
      <h1>LOVE ATHALIA — ${title}</h1>
      <p class="sub">Returned items requiring attention · Generated ${new Date().toLocaleDateString('en-PH')}</p>
      <table>
        <thead><tr><th>Transaction ID</th><th>Product ID</th><th>Product Name</th><th class="center">Size</th><th class="center">Return Qty</th><th>Amount</th><th>Reason</th></tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
      <div class="footer">BIR Permit No. OCN 027 AU2024000002225</div>
    </body></html>`;
}
 

function ModalFooter({ onDownload, onPrint }) {
  return (
    <div className="modal-footer">
      <button
        className="modal-act-btn modal-act-btn--download"
        onClick={onDownload}
        title="Download as file"
      >
        <span className="material-icons" style={{ fontSize: 18 }}>download</span>
      </button>
      <button
        className="modal-act-btn modal-act-btn--print"
        onClick={onPrint}
        title="Print this report"
      >
        <span className="material-icons" style={{ fontSize: 18, marginRight: 5 }}>print</span>
        Print
      </button>
    </div>
  );
}
 

const ReturnTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rpt-tooltip">
        <p className="rpt-tooltip__label">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} className="rpt-tooltip__val"
            style={{ color: p.dataKey === 'exchange' ? '#c0607a' : '#4a7edc' }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
 
function DonutChart({ data, onSliceClick }) {
  const size = 195;
  const cx   = size / 2;
  const cy   = size / 2;
  const r    = 80;
  const inn  = 48;
 
  let cumPct = 0;
  const slices = data.map((d) => {
    const start = cumPct;
    cumPct += d.pct;
    return { ...d, start, end: cumPct };
  });
 
  function polarToXY(pct, radius) {
    const angle = (pct / 100) * 2 * Math.PI - Math.PI / 2;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  }
 
  function slicePath(start, end, outer, inner) {
    const [x1, y1] = polarToXY(start, outer);
    const [x2, y2] = polarToXY(end,   outer);
    const [x3, y3] = polarToXY(end,   inner);
    const [x4, y4] = polarToXY(start, inner);
    const large = end - start > 50 ? 1 : 0;
    return [
      `M ${x1} ${y1}`,
      `A ${outer} ${outer} 0 ${large} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${inner} ${inner} 0 ${large} 0 ${x4} ${y4}`,
      'Z',
    ].join(' ');
  }
 
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      {slices.map((s) => (
        <path
          key={s.label}
          d={slicePath(s.start, s.end, r, inn)}
          fill={s.color}
          style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
          onClick={() => onSliceClick && onSliceClick(s.label)}
          onMouseEnter={(e) => { e.target.style.opacity = '0.8'; }}
          onMouseLeave={(e) => { e.target.style.opacity = '1'; }}
        />
      ))}
      <circle cx={cx} cy={cy} r={inn} fill="white" />
    </svg>
  );
}
 
function ReasonBadge({ reason }) {
  const isExchange = reason === 'exchange';
  return (
    <span className={`reason-badge reason-badge--${isExchange ? 'exchange' : 'defective'}`}>
      <span className="reason-badge__dot" />
      {reason}
    </span>
  );
}
 

function SalesTrendModal({ period, onClose }) {
  if (!period) return null;
  const { colLabel, rows } = SALES_TREND_TABLE[period];
  const periodTitle =
    period === 'Monthly'   ? 'Monthly Sales Trend'
    : period === 'Quarterly' ? 'Quarterly Sales Trend'
    : 'Yearly Sales Trend';
 
  const html = () => generateSalesTrendHTML(period, colLabel, rows);
 
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <span className="material-icons" style={{ fontSize: 16 }}>close</span>
        </button>
 
        <div className="modal-header">
          <h2 className="modal-title-text">{periodTitle}</h2>
          <p className="modal-subtitle">Sales performance breakdown by category</p>
        </div>
 
        <div className="modal-table-wrap">
          <table className="modal-table">
            <thead>
              <tr className="modal-thead-row modal-thead-row--yellow">
                <th className="th-padl">{colLabel}</th>
                <th>Dailywear Units</th>
                <th>OOTD Units</th>
                <th>Dress Units</th>
                <th>Sleepwear Units</th>
                <th className="th-padr th-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={`modal-row${row.isTotal ? ' modal-row--total' : i % 2 !== 0 ? ' modal-row--alt' : ''}`}>
                  <td className="th-padl td-bold">{row.period}</td>
                  <td>{row.dailywear.toLocaleString()}</td>
                  <td>{row.ootd.toLocaleString()}</td>
                  <td>{row.dress.toLocaleString()}</td>
                  <td>{row.sleepwear.toLocaleString()}</td>
                  <td className="th-padr th-right td-bold td-green">{row.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
 
        <ModalFooter
          onDownload={() => downloadHTML(html(), `sales-trend-${period.toLowerCase()}.html`)}
          onPrint={() => openPrintWindow(html())}
        />
      </div>
    </div>
  );
}
 
function CategoryModal({ category, onClose }) {
  if (!category) return null;
  const products  = CATEGORY_PRODUCTS[category] || [];
  const headerBg  = CATEGORY_HEADER_BG[category] || 'rgba(255,242,141,0.28)';
  const catColor  = CATEGORY_DATA.find((c) => c.label === category)?.color || '#000';
 
  const html = () => generateCategoryHTML(category, products);
 
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <span className="material-icons" style={{ fontSize: 16 }}>close</span>
        </button>
 
        <div className="modal-header" style={{ borderLeft: `4px solid ${catColor}`, paddingLeft: 20 }}>
          <h2 className="modal-title-text">{category}</h2>
          <p className="modal-subtitle">Product inventory &amp; sales breakdown</p>
        </div>
 
        <div className="modal-table-wrap">
          <table className="modal-table">
            <thead>
              <tr className="modal-thead-row" style={{ background: headerBg }}>
                <th className="th-padl th-rank">Rank</th>
                <th>Item Code</th>
                <th className="th-img"></th>
                <th>Product Name</th>
                <th>Wholesale Price</th>
                <th>Unit Price</th>
                <th className="th-center">Stock</th>
                <th className="th-center">Units Sold</th>
                <th className="th-padr th-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i} className={`modal-row${i % 2 !== 0 ? ' modal-row--alt' : ''}`}>
                  <td className="th-padl td-rank">{i + 1}</td>
                  <td className="td-code">{p.id}</td>
                  <td>
                    <div className="modal-img-wrap">
                      <img src={p.img} alt={p.name}
                        onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                  </td>
                  <td className="td-name">{p.name}</td>
                  <td>
                    {p.wholesale}
                    <span className="modal-sub"> (6 pcs)</span>
                  </td>
                  <td>{p.unitPrice}</td>
                  <td className="th-center">{p.stock}</td>
                  <td className="th-center">{p.unitsSold}</td>
                  <td className="th-padr th-right td-bold td-green">{p.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
 
        <ModalFooter
          onDownload={() => downloadHTML(html(), `category-${category.toLowerCase()}.html`)}
          onPrint={() => openPrintWindow(html())}
        />
      </div>
    </div>
  );
}
 
function ReturnModal({ filter = 'all', onClose }) {
  const initSelect =
    filter === 'exchange'  ? 'exchange'  :
    filter === 'defective' ? 'defective' : 'All';
  const [reasonFilter, setReasonFilter] = useState(initSelect);
 
  const title =
    filter === 'exchange'  ? 'Exchange Items'  :
    filter === 'defective' ? 'Defective Items' : 'Return & Exchange';
 
  const filtered = RETURN_TABLE_ALL.filter(
    (r) => reasonFilter === 'All' || r.reason === reasonFilter
  );
 
  const stats = {
    exchange:  RETURN_TABLE_ALL.filter((r) => r.reason === 'exchange').length,
    defective: RETURN_TABLE_ALL.filter((r) => r.reason === 'defective').length,
  };
 
  const html = () => generateReturnHTML(title, filtered);
 
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <span className="material-icons" style={{ fontSize: 16 }}>close</span>
        </button>
 
        <div className="modal-header">
          <div className="modal-header-row">
            <div>
              <h2 className="modal-title-text">{title}</h2>
              <p className="modal-subtitle">Returned items requiring attention</p>
            </div>
            <div className="return-stat-badges">
              <div className="return-stat-badge return-stat-badge--exchange">
                <span className="return-stat-badge__dot" />
                <span className="return-stat-badge__label">Exchange</span>
                <span className="return-stat-badge__count">{stats.exchange}</span>
              </div>
              <div className="return-stat-badge return-stat-badge--defective">
                <span className="return-stat-badge__dot" />
                <span className="return-stat-badge__label">Defective</span>
                <span className="return-stat-badge__count">{stats.defective}</span>
              </div>
            </div>
          </div>
        </div>
 
        <div className="modal-table-wrap">
          <table className="modal-table">
            <thead>
              <tr className="modal-thead-row modal-thead-row--yellow">
                <th className="th-padl">Transaction ID</th>
                <th>Product ID</th>
                <th>Product Name</th>
                <th className="th-center">Size</th>
                <th className="th-center">Return Qty</th>
                <th>Amount</th>
                <th className="th-padr">
                  <div className="return-reason-th">
                    <span>Reason</span>
                    <select
                      className="reason-select"
                      value={reasonFilter}
                      onChange={(e) => setReasonFilter(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="All">All</option>
                      <option value="exchange">Exchange</option>
                      <option value="defective">Defective</option>
                    </select>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} className={`modal-row${i % 2 !== 0 ? ' modal-row--alt' : ''}`}>
                  <td className="th-padl td-bold td-code">{r.txnId}</td>
                  <td>{r.productId}</td>
                  <td>{r.productName}</td>
                  <td className="th-center">{r.size}</td>
                  <td className="th-center">{r.returnQty}</td>
                  <td>{r.amount}</td>
                  <td className="th-padr">
                    <ReasonBadge reason={r.reason} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
 
        <ModalFooter
          onDownload={() => downloadHTML(html(), `return-${reasonFilter.toLowerCase()}.html`)}
          onPrint={() => openPrintWindow(html())}
        />
      </div>
    </div>
  );
}
 
const PERIOD_TABS = ['Monthly', 'Quarterly', 'Yearly'];
 
export default function Reports() {
  const [period, setPeriod]                   = useState('Monthly');
  const [categoryModal, setCategoryModal]     = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnFilter, setReturnFilter]       = useState('all');
  const [showSalesTrend, setShowSalesTrend]   = useState(false);
 
  const openReturnModal = (filter) => {
    setReturnFilter(filter);
    setShowReturnModal(true);
  };
 
  return (
    <div className="reports">
 
      <div className="reports__header">
        <div className="reports__title-block">
          <h1 className="reports__title">REPORTS</h1>
          <p className="reports__subtitle">Analyze sales performance and generate detailed reports.</p>
        </div>
        <Topbar />
      </div>
 
      <div className="reports__chart-card fade-in">
        <div className="reports__chart-header">
          <div>
            <h2 className="reports__section-title">Sales Trend</h2>
            <p className="reports__chart-sub">
              {period === 'Monthly'   && 'Sales performance for the current month (Week 1 – Week 4)'}
              {period === 'Quarterly' && 'Sales performance for the past 4 quarters'}
              {period === 'Yearly'    && 'Sales performance for the past 12 months'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="reports__chart-view-hint"
              onClick={() => setShowSalesTrend(true)}>
              View full list →
            </span>
            <div className="period-toggle">
              {PERIOD_TABS.map((t) => (
                <button key={t}
                  className={`period-toggle__btn ${period === t ? 'period-toggle__btn--active' : ''}`}
                  onClick={() => setPeriod(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
        <SalesChart period={period} />
      </div>
 
      <div className="reports__content-row fade-in">
 
        <div className="reports__left-col">
 
          <div className="reports__category-card">
            <h2 className="reports__section-title">Category based Sales Share</h2>
            <div className="reports__category-body">
              <DonutChart data={CATEGORY_DATA} onSliceClick={(label) => setCategoryModal(label)} />
              <div className="reports__category-legend">
                {CATEGORY_DATA.map((d) => (
                  <div key={d.label} className="reports__legend-item"
                    onClick={() => setCategoryModal(d.label)}
                    style={{ cursor: 'pointer' }}>
                    <span className="reports__legend-dot" style={{ background: d.color }} />
                    <span className="reports__legend-label">{d.label}</span>
                    <span className="reports__legend-pct" style={{ color: d.color }}>{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
 
          <div className="reports__return-card">
            <div className="reports__return-header">
              <h2 className="reports__section-title">Return Product</h2>
 
              <div className="reports__return-legend">
                <button className="return-legend-btn" onClick={() => openReturnModal('exchange')}>
                  <span className="return-legend-dot return-legend-dot--exchange" />
                  <span className="return-legend-text">Exchange</span>
                </button>
                <button className="return-legend-btn" onClick={() => openReturnModal('defective')}>
                  <span className="return-legend-dot return-legend-dot--defective" />
                  <span className="return-legend-text">Defective</span>
                </button>
              </div>
            </div>
 
            <div className="return-chart-wrap" onClick={() => openReturnModal('all')}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={RETURN_DATA[period]}
                  margin={{ top: 6, right: 10, left: -10, bottom: 0 }}
                  barCategoryGap="30%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis dataKey="label"
                    tick={{ fontFamily: 'Inter', fontSize: 10, fill: 'rgba(0,0,0,0.5)' }}
                    axisLine={{ stroke: 'rgba(0,0,0,0.3)' }} tickLine={false} />
                  <YAxis tick={{ fontFamily: 'Inter', fontSize: 10, fill: 'rgba(0,0,0,0.4)' }}
                    axisLine={false} tickLine={false} />
                  <Tooltip content={<ReturnTooltip />} />
                  <Bar dataKey="exchange" name="Exchange" fill="#FFB6C8"
                    radius={[4, 4, 0, 0]} animationDuration={700}
                    style={{ cursor: 'pointer' }}
                    onClick={(data, index, e) => { e.stopPropagation(); openReturnModal('exchange'); }} />
                  <Bar dataKey="defective" name="Defective" fill="#78A5FA"
                    radius={[4, 4, 0, 0]} animationDuration={700}
                    style={{ cursor: 'pointer' }}
                    onClick={(data, index, e) => { e.stopPropagation(); openReturnModal('defective'); }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
 
            <p className="reports__return-hint" onClick={() => openReturnModal('all')}>
              View full return &amp; exchange list →
            </p>
          </div>
 
        </div>
 
        <div className="reports__top-selling">
          <h2 className="reports__section-title">Top Selling</h2>
          <div className="reports__products-list">
            {TOP_PRODUCTS.map((p) => (
              <div key={p.rank} className="reports__product-card">
                <span className="reports__product-rank">{p.rank}</span>
                <div className="reports__product-img-wrap">
                  <img src={p.img} alt={p.name} className="reports__product-img"
                    onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
                <div className="reports__product-info">
                  <p className="reports__product-name">{p.name}</p>
                  <p className="reports__product-meta">Units Sold: <span>{p.units}</span></p>
                  <p className="reports__product-meta">Sales Revenue: <span>{p.revenue}</span></p>
                </div>
                <span className="reports__product-price">{p.price}</span>
              </div>
            ))}
          </div>
        </div>
 
      </div>
 
      {showSalesTrend && (
        <SalesTrendModal period={period} onClose={() => setShowSalesTrend(false)} />
      )}
      {categoryModal && (
        <CategoryModal category={categoryModal} onClose={() => setCategoryModal(null)} />
      )}
      {showReturnModal && (
        <ReturnModal filter={returnFilter} onClose={() => setShowReturnModal(false)} />
      )}
 
    </div>
  );
}