import React, { useState, useRef, useEffect } from 'react';
import Topbar from './Topbar';
import SalesChart from './Saleschart';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
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
  Monthly:   [{ label: 'Week 1', exchange: 42, defective: 38 },{ label: 'Week 2', exchange: 58, defective: 65 },{ label: 'Week 3', exchange: 75, defective: 82 },{ label: 'Week 4', exchange: 91, defective: 78 }],
  Quarterly: [{ label: 'Jan-Mar', exchange: 74, defective: 82 },{ label: 'Apr-Jun', exchange: 88, defective: 101 },{ label: 'Jul-Sep', exchange: 113, defective: 143 },{ label: 'Oct-Dec', exchange: 175, defective: 179 }],
  Yearly:    [
    { label: 'Jan', exchange: 74,  defective: 82  },{ label: 'Feb', exchange: 88,  defective: 101 },
    { label: 'Mar', exchange: 113, defective: 143 },{ label: 'Apr', exchange: 175, defective: 179 },
    { label: 'May', exchange: 109, defective: 124 },{ label: 'Jun', exchange: 120, defective: 113 },
    { label: 'Jul', exchange: 72,  defective: 58  },{ label: 'Aug', exchange: 78,  defective: 89  },
    { label: 'Sep', exchange: 86,  defective: 113 },{ label: 'Oct', exchange: 66,  defective: 89  },
    { label: 'Nov', exchange: 140, defective: 123 },{ label: 'Dec', exchange: 233, defective: 241 },
  ],
};

const RETURN_TABLE_ALL = [
  ...Array.from({ length: 6 }, (_, i) => ({ txnId: `TXN00${i+1}`, productId: `P100${i+1}`, productName: 'Product Name', size: '100', returnQty: String(5+i), amount: `P ${(i+1)*50}.00`, reason: 'exchange'  })),
  ...Array.from({ length: 6 }, (_, i) => ({ txnId: `TXN0${i+7}`,  productId: `P200${i+1}`, productName: 'Product Name', size: '100', returnQty: String(3+i), amount: `P ${(i+1)*40}.00`, reason: 'defective' })),
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

const CATEGORY_PRODUCTS   = { Sleepwear: generateProducts(), Dailywear: generateProducts(), OOTD: generateProducts(), Dress: generateProducts() };

const CATEGORY_HEADER_BG = {
  Sleepwear: 'rgba(254,215,0,0.5)',
  Dailywear: 'rgba(21,0,160,0.13)',
  OOTD:      'rgba(195,29,123,0.15)',
  Dress:     'rgba(65,158,11,0.15)',
};

const TRANSACTION_PRODUCTS = [
  { id: 'CODE', name: 'Summer Floral Dress', category: 'Dress',     wholesale: '₱7,500', packSize: '(6 pcs)', qty: '8 pack', payment: 'Union Bank', total: '₱7,500', img: '/images/product1.jpg' },
  { id: 'CODE', name: 'Party Tulle Dress',   category: 'OOTD',      wholesale: '₱5,500', packSize: '(6 pcs)', qty: '8 pack', payment: 'Union Bank', total: '₱7,500', img: '/images/product1.jpg' },
  { id: 'CODE', name: 'Casual Cotton Dress', category: 'Sleepwear', wholesale: '₱9,000', packSize: '(6 pcs)', qty: '8 pack', payment: 'Union Bank', total: '₱7,500', img: '/images/product1.jpg' },
  { id: 'CODE', name: 'Denim Jumper Dress',  category: 'Sleepwear', wholesale: '₱6,750', packSize: '(6 pcs)', qty: '8 pack', payment: 'Union Bank', total: '₱7,500', img: '/images/product1.jpg' },
  { id: 'CODE', name: 'Princess Gown',       category: 'OOTD',      wholesale: '₱5,000', packSize: '(6 pcs)', qty: '8 pack', payment: 'Union Bank', total: '₱7,500', img: '/images/product1.jpg' },
  { id: 'CODE', name: 'Polka Dot Dress',     category: 'Sleepwear', wholesale: '₱8,400', packSize: '(6 pcs)', qty: '8 pack', payment: 'Union Bank', total: '₱7,500', img: '/images/product1.jpg' },
  { id: 'CODE', name: 'Sleeveless Cotton',   category: 'Dailywear', wholesale: '₱6,000', packSize: '(6 pcs)', qty: '8 pack', payment: 'Union Bank', total: '₱7,500', img: '/images/product1.jpg' },
  { id: 'CODE', name: 'Ruffled Party Dress', category: 'Dailywear', wholesale: '₱9,600', packSize: '(6 pcs)', qty: '8 pack', payment: 'Union Bank', total: '₱7,500', img: '/images/product1.jpg' },
];

const PERIOD_OPTIONS = {
  Monthly: [
    { label: 'Week 1', sub: 'Jan 1 – 7',   dateRange: 'Jan 1 – Jan 7, 2026'   },
    { label: 'Week 2', sub: 'Jan 8 – 14',  dateRange: 'Jan 8 – Jan 14, 2026'  },
    { label: 'Week 3', sub: 'Jan 15 – 21', dateRange: 'Jan 15 – Jan 21, 2026' },
    { label: 'Week 4', sub: 'Jan 22 – 31', dateRange: 'Jan 22 – Jan 31, 2026' },
  ],
  Quarterly: [
    { label: 'Quarter 1', sub: 'Jan – Mar',  dateRange: 'Jan 1 – Mar 31, 2026' },
    { label: 'Quarter 2', sub: 'Apr – Jun',  dateRange: 'Apr 1 – Jun 30, 2026' },
    { label: 'Quarter 3', sub: 'Jul – Sept', dateRange: 'Jul 1 – Sep 30, 2026' },
    { label: 'Quarter 4', sub: 'Oct – Dec',  dateRange: 'Oct 1 – Dec 31, 2026' },
  ],
  Yearly: [
    { label: 'January',   sub: 'Jan 2026', dateRange: 'Jan 1 – Jan 31, 2026'  },
    { label: 'February',  sub: 'Feb 2026', dateRange: 'Feb 1 – Feb 28, 2026'  },
    { label: 'March',     sub: 'Mar 2026', dateRange: 'Mar 1 – Mar 31, 2026'  },
    { label: 'April',     sub: 'Apr 2026', dateRange: 'Apr 1 – Apr 30, 2026'  },
    { label: 'May',       sub: 'May 2026', dateRange: 'May 1 – May 31, 2026'  },
    { label: 'June',      sub: 'Jun 2026', dateRange: 'Jun 1 – Jun 30, 2026'  },
    { label: 'July',      sub: 'Jul 2026', dateRange: 'Jul 1 – Jul 31, 2026'  },
    { label: 'August',    sub: 'Aug 2026', dateRange: 'Aug 1 – Aug 31, 2026'  },
    { label: 'September', sub: 'Sep 2026', dateRange: 'Sep 1 – Sep 30, 2026'  },
    { label: 'October',   sub: 'Oct 2026', dateRange: 'Oct 1 – Oct 31, 2026'  },
    { label: 'November',  sub: 'Nov 2026', dateRange: 'Nov 1 – Nov 30, 2026'  },
    { label: 'December',  sub: 'Dec 2026', dateRange: 'Dec 1 – Dec 31, 2026'  },
  ],
};

const ROW_PERIOD_MAP = {
  'Q1 ( Jan - Mar )': 'Quarter 1',
  'Q2 ( Apr - Jun )': 'Quarter 2',
  'Q3 ( Jul - Sep )': 'Quarter 3',
  'Q4 ( Oct - Dec )': 'Quarter 4',
};
function rowToOptionLabel(rowPeriod) { return ROW_PERIOD_MAP[rowPeriod] || rowPeriod; }

const RETURN_DETAIL_REASONS = ['All', 'Defective', 'Wrong Size', 'Wrong Item Received', 'Size Adjustment'];

const RETURN_DETAIL_ROWS = [
  { txnId: 'TXN001', customer: 'Hean Aether Dela Cruz',  dateReturn: '03/10/2026', time: '4:00 PM',  total: '₱ 20,000.00', returnQty: '8 pack',   reason: 'Defective'          },
  { txnId: 'TXN002', customer: 'Maria Santos',            dateReturn: '03/10/2026', time: '4:00 PM',  total: '₱ 20,000.00', returnQty: '2 pieces', reason: 'Wrong Item Received' },
  { txnId: 'TXN003', customer: 'Juan dela Cruz',          dateReturn: '03/10/2026', time: '4:00 PM',  total: '₱ 20,000.00', returnQty: '2 pieces', reason: 'Wrong Size'          },
  { txnId: 'TXN004', customer: 'Ana Reyes',               dateReturn: '03/10/2026', time: '4:00 PM',  total: '₱ 20,000.00', returnQty: '2 pieces', reason: 'Size Adjustment'     },
  { txnId: 'TXN005', customer: 'Hean Aether Dela Cruz',   dateReturn: '03/11/2026', time: '10:30 AM', total: '₱ 20,000.00', returnQty: '8 pack',   reason: 'Defective'           },
  { txnId: 'TXN006', customer: 'Luisa Bautista',          dateReturn: '03/11/2026', time: '1:15 PM',  total: '₱ 20,000.00', returnQty: '8 pack',   reason: 'Wrong Size'          },
  { txnId: 'TXN007', customer: 'Carlo Mendoza',           dateReturn: '03/12/2026', time: '9:00 AM',  total: '₱ 20,000.00', returnQty: '2 pieces', reason: 'Defective'           },
  { txnId: 'TXN008', customer: 'Rosa Gonzales',           dateReturn: '03/12/2026', time: '3:45 PM',  total: '₱ 20,000.00', returnQty: '2 pieces', reason: 'Wrong Item Received' },
  { txnId: 'TXN009', customer: 'Pedro Villanueva',        dateReturn: '03/13/2026', time: '11:00 AM', total: '₱ 20,000.00', returnQty: '2 pieces', reason: 'Wrong Size'          },
];

const INVOICE_ITEMS = [
  { name: 'Kiddiesaurs Pajama Set',    code: 'ITEM-001', size: 'M', qty: 15, unitPrice: '₱145.00', pricePerPack: '₱725.00',   tax: 0, discount: 0, amount: '₱10,875.00' },
  { name: 'Sunny Day Twirl Dress',     code: 'ITEM-002', size: 'S', qty: 3,  unitPrice: '₱245.00', pricePerPack: '₱1,470.00', tax: 0, discount: 0, amount: '₱4,410.00'  },
  { name: 'Rainbow Snuggle Pajamas',   code: 'ITEM-003', size: 'L', qty: 3,  unitPrice: '₱315.00', pricePerPack: '₱1,890.00', tax: 0, discount: 0, amount: '₱5,670.00'  },
  { name: 'Tiny Trendsetter OOTD',     code: 'ITEM-004', size: 'M', qty: 2,  unitPrice: '₱210.00', pricePerPack: '₱1,260.00', tax: 0, discount: 0, amount: '₱2,520.00'  },
  { name: "Lil' Sunshine Casual Wear", code: 'ITEM-005', size: 'S', qty: 2,  unitPrice: '₱240.00', pricePerPack: '₱960.00',   tax: 0, discount: 0, amount: '₱1,920.00'  },
  { name: 'Sweet Bunny Pajama Set',    code: 'ITEM-006', size: 'M', qty: 3,  unitPrice: '₱205.00', pricePerPack: '₱1,230.00', tax: 0, discount: 0, amount: '₱3,690.00'  },
  { name: 'Tiny Explorer Outfit Set',  code: 'ITEM-007', size: 'L', qty: 2,  unitPrice: '₱255.00', pricePerPack: '₱1,530.00', tax: 0, discount: 0, amount: '₱3,060.00'  },
];

function getFilteredChartLabels(period, dateRange) {
  if (!dateRange?.from || !dateRange?.to) return null;
  const { from, to } = dateRange;
  const fromTs = new Date(from).setHours(0,0,0,0);
  const toTs   = new Date(to).setHours(23,59,59,999);
  const year   = from.getFullYear();
  if (period === 'Monthly') {
    const month = from.getMonth();
    const weekBounds = [
      [new Date(year, month, 1),  new Date(year, month, 7)],
      [new Date(year, month, 8),  new Date(year, month, 14)],
      [new Date(year, month, 15), new Date(year, month, 21)],
      [new Date(year, month, 22), new Date(year, month + 1, 0)],
    ];
    const labels = ['Week 1','Week 2','Week 3','Week 4'];
    return weekBounds.reduce((acc, [s, e], i) => {
      if (e.getTime() >= fromTs && s.getTime() <= toTs) acc.push(labels[i]);
      return acc;
    }, []);
  }
  if (period === 'Quarterly') {
    const quarterBounds = [
      [new Date(year, 0, 1),  new Date(year, 2, 31)],
      [new Date(year, 3, 1),  new Date(year, 5, 30)],
      [new Date(year, 6, 1),  new Date(year, 8, 30)],
      [new Date(year, 9, 1),  new Date(year, 11, 31)],
    ];
    const labels = ['Jan - Mar','Apr - Jun','Jul - Sep','Oct - Dec'];
    return quarterBounds.reduce((acc, [s, e], i) => {
      if (e.getTime() >= fromTs && s.getTime() <= toTs) acc.push(labels[i]);
      return acc;
    }, []);
  }
  if (period === 'Yearly') {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return months.filter((_, i) => {
      const s = new Date(year, i, 1).getTime();
      const e = new Date(year, i + 1, 0, 23, 59, 59, 999).getTime();
      return e >= fromTs && s <= toTs;
    });
  }
  return null;
}

function getChartSubtitle(period, dateRange) {
  if (dateRange?.from && dateRange?.to) {
    const fmt = (d) => d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${fmt(dateRange.from)} – ${fmt(dateRange.to)}`;
  }
  if (period === 'Monthly')   return 'Sales performance for the current month';
  if (period === 'Quarterly') return 'Sales performance for the past 4 quarters';
  return 'Sales performance for the past 12 months';
}

function formatChartDateLabel(dateRange) {
  if (!dateRange?.from && !dateRange?.to) return null;
  const fmt = (d) => d?.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }) || '—';
  if (!dateRange.to) return `${fmt(dateRange.from)} – —`;
  return `${fmt(dateRange.from)} – ${fmt(dateRange.to)}`;
}

const SHARED_PRINT_STYLES = `*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;font-size:11px;color:#000;padding:28px}h1{font-size:18px;font-weight:800;color:#8B333D;margin-bottom:4px}p.sub{font-size:11px;color:rgba(0,0,0,0.45);margin-bottom:16px;font-style:italic}table{width:100%;border-collapse:collapse;font-size:10px}thead tr{background:rgba(255,242,141,0.6)}th{padding:8px 10px;font-weight:700;text-align:left;border-bottom:1px solid #ddd;white-space:nowrap}td{padding:8px 10px;border-bottom:1px solid rgba(0,0,0,0.06);vertical-align:middle}tr.total-row td{background:rgba(255,242,141,0.25);font-weight:700;border-top:1.5px solid rgba(0,0,0,0.12)}tr:nth-child(even):not(.total-row) td{background:rgba(0,0,0,0.016)}.revenue{color:#226133;font-weight:700;text-align:right}.center{text-align:center}.footer{margin-top:20px;font-size:8px;color:rgba(0,0,0,0.38);text-align:center;border-top:1px solid #eee;padding-top:10px}@media print{html,body{height:auto}}`;

function openPrintWindow(html) {
  const pw = window.open('', '_blank', 'width=960,height=750');
  if (!pw) { alert('Pop-up blocked. Please allow pop-ups to enable printing.'); return; }
  pw.document.write(html); pw.document.close();
  pw.onload = () => { pw.focus(); pw.print(); };
}

function downloadHTML(html, filename) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

function generateSalesTrendHTML(period, colLabel, rows) {
  const title = period === 'Monthly' ? 'Monthly Sales Trend' : period === 'Quarterly' ? 'Quarterly Sales Trend' : 'Yearly Sales Trend';
  const bodyRows = rows.map((r) => `<tr class="${r.isTotal ? 'total-row' : ''}"><td>${r.period}</td><td>${r.dailywear.toLocaleString()}</td><td>${r.ootd.toLocaleString()}</td><td>${r.dress.toLocaleString()}</td><td>${r.sleepwear.toLocaleString()}</td><td class="revenue">${r.revenue}</td></tr>`).join('');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>${title}</title><style>${SHARED_PRINT_STYLES}</style></head><body><h1>LOVE ATHALIA — ${title}</h1><p class="sub">Generated ${new Date().toLocaleDateString('en-PH')}</p><table><thead><tr><th>${colLabel}</th><th>Dailywear Units</th><th>OOTD Units</th><th>Dress Units</th><th>Sleepwear Units</th><th style="text-align:right">Total Revenue</th></tr></thead><tbody>${bodyRows}</tbody></table><div class="footer">BIR Permit No. OCN 027 AU2024000002225</div></body></html>`;
}

function generateCategoryHTML(category, products) {
  const bodyRows = products.map((p, i) => `<tr><td>${i+1}</td><td>${p.id}</td><td>${p.name}</td><td>${p.wholesale}</td><td>${p.unitPrice}</td><td class="center">${p.stock}</td><td class="center">${p.unitsSold}</td><td class="revenue">${p.revenue}</td></tr>`).join('');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>${category}</title><style>${SHARED_PRINT_STYLES}</style></head><body><h1>LOVE ATHALIA — ${category}</h1><p class="sub">Generated ${new Date().toLocaleDateString('en-PH')}</p><table><thead><tr><th>Rank</th><th>Item Code</th><th>Product Name</th><th>Wholesale Price</th><th>Unit Price</th><th class="center">Stock</th><th class="center">Units Sold</th><th style="text-align:right">Revenue</th></tr></thead><tbody>${bodyRows}</tbody></table><div class="footer">BIR Permit No. OCN 027 AU2024000002225</div></body></html>`;
}

function generateReturnHTML(title, rows) {
  const bodyRows = rows.map((r) => `<tr><td>${r.txnId}</td><td>${r.productId}</td><td>${r.productName}</td><td class="center">${r.size}</td><td class="center">${r.returnQty}</td><td>${r.amount}</td><td>${r.reason}</td></tr>`).join('');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>${title}</title><style>${SHARED_PRINT_STYLES}</style></head><body><h1>LOVE ATHALIA — ${title}</h1><p class="sub">Generated ${new Date().toLocaleDateString('en-PH')}</p><table><thead><tr><th>Transaction ID</th><th>Product ID</th><th>Product Name</th><th class="center">Size</th><th class="center">Return Qty</th><th>Amount</th><th>Reason</th></tr></thead><tbody>${bodyRows}</tbody></table><div class="footer">BIR Permit No. OCN 027 AU2024000002225</div></body></html>`;
}

function generateReturnDetailHTML(rows) {
  const bodyRows = rows.map((r) => `<tr><td>${r.txnId}</td><td>${r.customer}</td><td>${r.dateReturn} ${r.time}</td><td>${r.total}</td><td class="center">${r.returnQty}</td><td>${r.reason}</td></tr>`).join('');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>Return &amp; Exchange Details</title><style>${SHARED_PRINT_STYLES}</style></head><body><h1>LOVE ATHALIA — Return &amp; Exchange</h1><p class="sub">Generated ${new Date().toLocaleDateString('en-PH')}</p><table><thead><tr><th>Transaction ID</th><th>Customer Full Name</th><th>Date of Return</th><th>Total Amount</th><th class="center">Return Qty</th><th>Reason</th></tr></thead><tbody>${bodyRows}</tbody></table><div class="footer">BIR Permit No. OCN 027 AU2024000002225</div></body></html>`;
}

function generateTransactionHTML(periodLabel, dateRange, rows) {
  const bodyRows = rows.map((r, i) => `<tr><td>${r.id}-${String(i+1).padStart(3,'0')}</td><td>${r.name}</td><td>${r.category}</td><td>${r.wholesale} <small>(6 pcs)</small></td><td class="center">${r.qty}</td><td>${r.payment}</td><td class="revenue">${r.total}</td></tr>`).join('');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>${periodLabel}</title><style>${SHARED_PRINT_STYLES}</style></head><body><h1>LOVE ATHALIA — ${periodLabel}</h1><p class="sub">${dateRange} · Generated ${new Date().toLocaleDateString('en-PH')}</p><table><thead><tr><th>Transaction ID</th><th>Product Name</th><th>Category</th><th>Wholesale Price</th><th class="center">Qty Sold</th><th>Payment Method</th><th style="text-align:right">Total Amount</th></tr></thead><tbody>${bodyRows}</tbody></table><div class="footer">BIR Permit No. OCN 027 AU2024000002225</div></body></html>`;
}

function ModalFooter({ onDownload, onPrint }) {
  return (
    <div className="modal-footer">
      <button className="modal-act-btn modal-act-btn--download" onClick={onDownload} title="Download">
        <span className="material-icons" style={{ fontSize: 18 }}>download</span>
      </button>
      <button className="modal-act-btn modal-act-btn--print" onClick={onPrint} title="Print">
        <span className="material-icons" style={{ fontSize: 18, marginRight: 5 }}>print</span>
        Print
      </button>
    </div>
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
    const t   = new Date(year, month, c.day).setHours(0,0,0,0);
    const s   = ts(rangeStart);
    const e   = ts(rangeEnd) || ts(hovered);
    const lo  = s && e ? Math.min(s,e) : s;
    const hi  = s && e ? Math.max(s,e) : null;
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
  const [view, setView]   = useState('day');
  const [yr,   setYr]     = useState(now.getFullYear());
  const [mo,   setMo]     = useState(now.getMonth());
  const [hov,  setHov]    = useState(null);
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

function ModalDateFilter({ dateRange, setDateRange, showDatePicker, setShowDatePicker }) {
  function displayRange() {
    if (dateRange.from && dateRange.to) {
      const f = (d) => d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
      return `${f(dateRange.from)} – ${f(dateRange.to)}`;
    }
    return 'From – To';
  }
  return (
    <div className="modal-date-filter-outer">
      <button className={`txn-date-btn${dateRange.from ? ' txn-date-btn--active' : ''}`} onClick={() => setShowDatePicker(v => !v)}>
        <span className="material-icons" style={{ fontSize: 16, color: '#1C1B1F', flexShrink: 0 }}>filter_list</span>
        <span className="txn-date-btn__label">Date:</span>
        <span className="txn-date-btn__range">{displayRange()}</span>
        {dateRange.from && (
          <button className="chart-date-btn__clear" onClick={(e) => { e.stopPropagation(); setDateRange({ from: null, to: null }); setShowDatePicker(false); }} title="Clear">
            <span className="material-icons" style={{ fontSize: 13 }}>close</span>
          </button>
        )}
      </button>
      {showDatePicker && (
        <DateRangePicker value={dateRange} onChange={setDateRange} onClose={() => setShowDatePicker(false)} />
      )}
    </div>
  );
}

function ReturnInvoicePanel({ txn }) {
  if (!txn) return null;
  return (
    <div className="rinv">
      <div className="rinv__top">
        <div className="rinv__logo-box">
          <img src="/images/logo.png" alt="Love Athalia" className="rinv__logo-img"
            onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<span style="font-size:9px;font-weight:800;color:#8B333D;">LOVE<br/>ATHALIA</span>'; }} />
        </div>
        <div className="rinv__title-area">
          <h3 className="rinv__invoice-label">INVOICE</h3>
          <div className="rinv__meta-row">
            <span className="rinv__meta-key">Invoice no:</span>
            <span className="rinv__meta-val">PJM-1100192-79</span>
          </div>
          <div className="rinv__meta-row">
            <span className="rinv__meta-key">Date Issued:</span>
            <span className="rinv__meta-val">03/20/2026 - 9:19 PM</span>
          </div>
          <div className="rinv__meta-row">
            <span className="rinv__meta-key">Ref:</span>
            <span className="rinv__meta-val">BC 8888888888</span>
          </div>
        </div>
      </div>

      <div className="rinv__address">
        <p>Blk 15 Lot 4 Ph 4 Pkg 2 Barangay 176 Bagong Silang 1400</p>
        <p>City of Caloocan NCR, Third District Philippines</p>
        <p>Shane Anne C. Gapas - Prop.</p>
        <p>Non VAT-Reg Tin: 425-464-696-000000</p>
      </div>

      <hr className="rinv__divider" />

      <div className="rinv__customer-row">
        <div>
          <p className="rinv__field-label">Customer Name:</p>
          <p className="rinv__field-val rinv__field-val--bold">{txn.customer}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p className="rinv__field-label" style={{ textAlign: 'right' }}>Payment Method:</p>
          <p className="rinv__field-val rinv__field-val--bold">Union Bank - CARD</p>
        </div>
      </div>

      <div className="rinv__order-meta">
        <div className="rinv__order-meta-left">
          <div className="rinv__detail-row">
            <span className="rinv__detail-key">Transaction ID:</span>
            <span className="rinv__detail-val">ORD0001</span>
          </div>
          <div className="rinv__detail-row">
            <span className="rinv__detail-key">Date Order:</span>
            <span className="rinv__detail-val">{txn.dateReturn} {txn.time}</span>
          </div>
        </div>
        <div className="rinv__order-meta-right">
          <div className="rinv__detail-row">
            <span className="rinv__detail-key">Payment Reference:</span>
            <span className="rinv__detail-val">1738499484733673</span>
          </div>
          <div className="rinv__detail-row">
            <span className="rinv__detail-val" style={{ color: 'rgba(0,0,0,0.45)' }}>02/10/11 - 20:00PM</span>
          </div>
        </div>
      </div>

      <hr className="rinv__divider" />

      <p className="rinv__section-label">Return Order Details:</p>

      <table className="rinv__table">
        <thead>
          <tr>
            <th className="rinv__th-item">Item</th>
            <th className="rinv__th-num">Qty</th>
            <th className="rinv__th-num">Unit<br/>Price</th>
            <th className="rinv__th-num">Per<br/>Pack</th>
            <th className="rinv__th-num">Tax</th>
            <th className="rinv__th-num">Disc.</th>
            <th className="rinv__th-num rinv__th-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {INVOICE_ITEMS.map((item, i) => (
            <tr key={i} className={i % 2 === 1 ? 'rinv__tr-alt' : ''}>
              <td>
                <p className="rinv__item-name">{item.name}</p>
                <p className="rinv__item-sub">{item.code} &nbsp;·&nbsp; Size {item.size}</p>
              </td>
              <td className="rinv__td-num">{item.qty}</td>
              <td className="rinv__td-num">{item.unitPrice}</td>
              <td className="rinv__td-num">{item.pricePerPack}</td>
              <td className="rinv__td-num">{item.tax}</td>
              <td className="rinv__td-num">{item.discount}</td>
              <td className="rinv__td-num rinv__td-right">{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="rinv__totals">
        <div className="rinv__total-line">
          <span>Sub Total:</span><span>₱32,145.00</span>
        </div>
        <div className="rinv__total-line">
          <span>Vat Tax:</span><span>₱0.00</span>
        </div>
        <div className="rinv__total-line">
          <span>Discount:</span><span>₱0.00</span>
        </div>
        <hr className="rinv__total-divider" />
        <div className="rinv__total-line rinv__total-line--grand">
          <span>Total Amount :</span><span>₱32,145.00</span>
        </div>
      </div>

      <div className="rinv__footer">
        <div className="rinv__footer-logo">
          <img src="/images/logo-removebg-preview.png" alt="Love Athalia" className="rinv__footer-logo-img"
            onError={e => { e.target.style.display = 'none'; }} />
        </div>
        <p className="rinv__bir">BIR Permit No. OCN 027 AU2024000002225</p>
      </div>
    </div>
  );
}

function ReturnDetailModal({ onClose, onBack }) {
  const [selectedTxn,    setSelectedTxn]    = useState(RETURN_DETAIL_ROWS[0]);
  const [reasonFilter,   setReasonFilter]   = useState('All');
  const [showReasonDrop, setShowReasonDrop] = useState(false);
  const [dateRange,      setDateRange]      = useState({ from: null, to: null });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const reasonRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (reasonRef.current && !reasonRef.current.contains(e.target)) setShowReasonDrop(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filtered = RETURN_DETAIL_ROWS.filter(r => reasonFilter === 'All' || r.reason === reasonFilter);
  const html = () => generateReturnDetailHTML(filtered);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-box--return-detail" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <span className="material-icons" style={{ fontSize: 16 }}>close</span>
        </button>

        {/* Header */}
        <div className="rdet__header">
          <div className="rdet__header-left">
            {onBack && (
              <button className="txn-back-btn" onClick={onBack}>
                <span className="material-icons" style={{ fontSize: 15 }}>arrow_back_ios</span>
                Back
              </button>
            )}
            <div>
              <h2 className="modal-title-text">Return &amp; Exchange</h2>
              <p className="modal-subtitle">Click any transaction to view its invoice</p>
            </div>
          </div>
          <ModalDateFilter
            dateRange={dateRange}
            setDateRange={setDateRange}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
          />
        </div>

        <div className="rdet__body">
          <div className="rdet__left">
            <div className="rdet__table-wrap">
              <table className="modal-table rdet__table">
                <thead>
                  <tr className="modal-thead-row modal-thead-row--yellow">
                    <th className="th-padl">Transaction ID</th>
                    <th>Customer Full Name</th>
                    <th>Date of Return</th>
                    <th>Total Amount</th>
                    <th className="th-center">Return Qty</th>
                    <th className="th-padr">
                      <div className="return-reason-th" ref={reasonRef}>
                        <span>Reason</span>
                        <button className="reason-custom-btn" onClick={e => { e.stopPropagation(); setShowReasonDrop(v => !v); }}>
                          <span className="reason-custom-btn__label">
                            {reasonFilter === 'All' ? 'All' : reasonFilter}
                          </span>
                          <span className="material-icons" style={{ fontSize: 14 }}>arrow_drop_down</span>
                        </button>
                        {showReasonDrop && (
                          <div className="reason-custom-drop" onClick={e => e.stopPropagation()}>
                            <div className="reason-custom-drop__hd">Filter by Reason</div>
                            {RETURN_DETAIL_REASONS.map(opt => (
                              <button
                                key={opt}
                                className={`reason-custom-opt${reasonFilter === opt ? ' reason-custom-opt--active' : ''}`}
                                onClick={e => { e.stopPropagation(); setReasonFilter(opt); setShowReasonDrop(false); }}
                              >
                                <span className="reason-custom-opt__dot-placeholder" />
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, i) => (
                    <tr
                      key={row.txnId}
                      className={`modal-row modal-row--clickable${i % 2 !== 0 ? ' modal-row--alt' : ''}${selectedTxn?.txnId === row.txnId ? ' modal-row--selected' : ''}`}
                      onClick={() => setSelectedTxn(row)}
                    >
                      <td className="th-padl td-bold td-code">{row.txnId}</td>
                      <td className="td-name">{row.customer}</td>
                      <td>
                        <span className="rdet__date">{row.dateReturn}</span>
                        <span className="rdet__time">{row.time}</span>
                      </td>
                      <td className="td-bold">{row.total}</td>
                      <td className="th-center">{row.returnQty}</td>
                      <td className="th-padr">
                        <span className={`rdet__reason-badge rdet__reason-badge--${row.reason.toLowerCase().replace(/\s+/g,'-')}`}>
                          {row.reason}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rdet__right">
            <ReturnInvoicePanel txn={selectedTxn} />
          </div>
        </div>

        <ModalFooter
          onDownload={() => downloadHTML(html(), 'return-exchange-details.html')}
          onPrint={() => openPrintWindow(html())}
        />
      </div>
    </div>
  );
}

const TXN_CATEGORIES = ['All', 'Dailywear', 'OOTD', 'Sleepwear', 'Dress'];

function TransactionDetailModal({ periodType, initialPeriod, onClose, onBack }) {
  const options = PERIOD_OPTIONS[periodType] || [];
  const initIdx = options.findIndex(o => o.label === initialPeriod);

  const [periodIdx, setPeriodIdx]         = useState(initIdx >= 0 ? initIdx : 0);
  const [showPeriodDrop, setShowPeriodDrop] = useState(false);
  const [catFilter,      setCatFilter]    = useState('All');
  const [showCatDrop,    setShowCatDrop]  = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange,      setDateRange]    = useState({ from: null, to: null });

  const catRef    = useRef(null);
  const periodRef = useRef(null);

  const current  = options[periodIdx] || { label: '', sub: '', dateRange: '' };
  const filtered = TRANSACTION_PRODUCTS.filter(p => catFilter === 'All' || p.category === catFilter);
  const html     = () => generateTransactionHTML(current.label, current.dateRange, filtered);

  useEffect(() => {
    const h = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setShowCatDrop(false);
      if (periodRef.current && !periodRef.current.contains(e.target)) setShowPeriodDrop(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  function displayRange() {
    if (dateRange.from && dateRange.to) {
      const f = (d) => d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
      return `${f(dateRange.from)} – ${f(dateRange.to)}`;
    }
    return current.dateRange;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-box--txn" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <span className="material-icons" style={{ fontSize: 16 }}>close</span>
        </button>
        <div className="modal-header txn-modal-header">
          <div className="txn-header-left">
            {onBack && (
              <button className="txn-back-btn" onClick={onBack}>
                <span className="material-icons" style={{ fontSize: 15 }}>arrow_back_ios</span>
                Back
              </button>
            )}
            <div className="txn-period-display" ref={periodRef} onClick={() => setShowPeriodDrop(v => !v)} style={{ cursor: 'pointer', position: 'relative' }}>
              <span className="txn-period-label">{current.label}</span>
              <span className="material-icons txn-period-caret">keyboard_arrow_down</span>
              {showPeriodDrop && (
                <div className="period-selector-drop" onClick={(e) => e.stopPropagation()}>
                  <div className="period-selector-drop__hd">Select Period</div>
                  {options.map((opt, i) => (
                    <button
                      key={opt.label}
                      className={`period-selector-opt${i === periodIdx ? ' period-selector-opt--active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setPeriodIdx(i); setShowPeriodDrop(false); setDateRange({ from: null, to: null }); }}
                    >
                      <span className="period-selector-opt__label">{opt.label}</span>
                      <span className="period-selector-opt__sub">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="txn-date-range-sub">{displayRange()}</p>
          </div>

          <div className="txn-date-filter-wrap">
            <button className="txn-date-btn" onClick={() => setShowDatePicker(v => !v)}>
              <span className="material-icons" style={{ fontSize: 16, color: '#1C1B1F', flexShrink: 0 }}>filter_list</span>
              <span className="txn-date-btn__label">Date:</span>
              <span className="txn-date-btn__range">{displayRange()}</span>
            </button>
            {showDatePicker && (
              <DateRangePicker value={dateRange} onChange={setDateRange} onClose={() => setShowDatePicker(false)} />
            )}
          </div>
        </div>

        <div className="modal-table-wrap">
          <table className="modal-table">
            <thead>
              <tr className="modal-thead-row modal-thead-row--yellow">
                <th className="th-padl">Transaction ID</th>
                <th className="th-img"></th>
                <th>Product Name</th>
                <th>
                  <div className="txn-cat-th" ref={catRef}>
                    <span>Category</span>
                    <button className="txn-cat-arrow" onClick={() => setShowCatDrop(v => !v)}>
                      <span className="material-icons" style={{ fontSize: 15 }}>arrow_drop_down</span>
                    </button>
                    {showCatDrop && (
                      <div className="txn-cat-drop">
                        <div className="txn-cat-drop__hd">Category</div>
                        {TXN_CATEGORIES.map(cat => (
                          <button key={cat} className={`txn-cat-opt${catFilter === cat ? ' txn-cat-opt--active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setCatFilter(cat); setShowCatDrop(false); }}
                          >{cat}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </th>
                <th>Wholesale Price</th>
                <th>Qty Sold</th>
                <th>Payment Method</th>
                <th className="th-padr th-right">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={i} className={`modal-row${i % 2 !== 0 ? ' modal-row--alt' : ''}`}>
                  <td className="th-padl td-bold td-code">{p.id}-{String(i+1).padStart(3,'0')}</td>
                  <td><div className="modal-img-wrap"><img src={p.img} alt={p.name} onError={(e) => { e.target.style.display = 'none'; }} /></div></td>
                  <td className="td-name">{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.wholesale}<span className="modal-sub"> {p.packSize}</span></td>
                  <td>{p.qty}</td>
                  <td>{p.payment}</td>
                  <td className="th-padr th-right td-bold">{p.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ModalFooter
          onDownload={() => downloadHTML(html(), `transactions-${current.label.toLowerCase().replace(/\s+/g, '-')}.html`)}
          onPrint={() => openPrintWindow(html())}
        />
      </div>
    </div>
  );
}

const ReturnTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rpt-tooltip">
        <p className="rpt-tooltip__label">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} className="rpt-tooltip__val" style={{ color: p.dataKey === 'exchange' ? '#c0607a' : '#4a7edc' }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function DonutChart({ data, onSliceClick }) {
  const size = 195, cx = size / 2, cy = size / 2, r = 80, inn = 48;
  const slices = data.reduce((acc, d) => {
    const start = acc.length === 0 ? 0 : acc[acc.length - 1].end;
    acc.push({ ...d, start, end: start + d.pct });
    return acc;
  }, []);
  function polarToXY(pct, radius) {
    const angle = (pct / 100) * 2 * Math.PI - Math.PI / 2;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  }
  function slicePath(start, end, outer, inner) {
    const [x1,y1] = polarToXY(start, outer); const [x2,y2] = polarToXY(end, outer);
    const [x3,y3] = polarToXY(end, inner);   const [x4,y4] = polarToXY(start, inner);
    const large = end - start > 50 ? 1 : 0;
    return [`M ${x1} ${y1}`,`A ${outer} ${outer} 0 ${large} 1 ${x2} ${y2}`,`L ${x3} ${y3}`,`A ${inner} ${inner} 0 ${large} 0 ${x4} ${y4}`,'Z'].join(' ');
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      {slices.map((s) => (
        <path key={s.label} d={slicePath(s.start, s.end, r, inn)} fill={s.color}
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
      <span className="reason-badge__dot" />{reason}
    </span>
  );
}

function SalesTrendModal({ period, onClose, onRowClick }) {
  const [dateRange,      setDateRange]      = useState({ from: null, to: null });
  const [showDatePicker, setShowDatePicker] = useState(false);

  if (!period) return null;

  const { colLabel, rows } = SALES_TREND_TABLE[period] || { colLabel: '', rows: [] };
  const periodTitle = period === 'Monthly' ? 'Monthly Sales Trend' : period === 'Quarterly' ? 'Quarterly Sales Trend' : 'Yearly Sales Trend';
  const html = () => generateSalesTrendHTML(period, colLabel, rows);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><span className="material-icons" style={{ fontSize: 16 }}>close</span></button>
        <div className="modal-header">
          <div className="modal-header-row modal-header-row--between">
            <div>
              <h2 className="modal-title-text">{periodTitle}</h2>
              <p className="modal-subtitle">Click any row to view its individual transactions</p>
            </div>
            <ModalDateFilter
              dateRange={dateRange}
              setDateRange={setDateRange}
              showDatePicker={showDatePicker}
              setShowDatePicker={setShowDatePicker}
            />
          </div>
        </div>
        <div className="modal-table-wrap">
          <table className="modal-table">
            <thead>
              <tr className="modal-thead-row modal-thead-row--yellow">
                <th className="th-padl">{colLabel}</th><th>Dailywear Units</th><th>OOTD Units</th><th>Dress Units</th><th>Sleepwear Units</th><th className="th-padr th-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}
                  className={`modal-row${row.isTotal ? ' modal-row--total' : i % 2 !== 0 ? ' modal-row--alt' : ''}${!row.isTotal ? ' modal-row--clickable' : ''}`}
                  onClick={() => !row.isTotal && onRowClick && onRowClick(row.period)}
                  title={!row.isTotal ? 'View transactions' : undefined}
                >
                  <td className="th-padl td-bold">{row.period}</td>
                  <td>{row.dailywear.toLocaleString()}</td><td>{row.ootd.toLocaleString()}</td>
                  <td>{row.dress.toLocaleString()}</td><td>{row.sleepwear.toLocaleString()}</td>
                  <td className="th-padr th-right td-bold td-green">{row.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ModalFooter onDownload={() => downloadHTML(html(), `sales-trend-${period.toLowerCase()}.html`)} onPrint={() => openPrintWindow(html())} />
      </div>
    </div>
  );
}

function CategoryModal({ category, onClose }) {
  const [dateRange,      setDateRange]      = useState({ from: null, to: null });
  const [showDatePicker, setShowDatePicker] = useState(false);

  if (!category) return null;
  const products  = CATEGORY_PRODUCTS[category] || [];
  const headerBg  = CATEGORY_HEADER_BG[category] || 'rgba(255,242,141,0.5)';
  const catColor  = CATEGORY_DATA.find((c) => c.label === category)?.color || '#000';
  const html      = () => generateCategoryHTML(category, products);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><span className="material-icons" style={{ fontSize: 16 }}>close</span></button>
        <div className="modal-header" style={{ borderLeft: `4px solid ${catColor}`, paddingLeft: 20 }}>
          <div className="modal-header-row modal-header-row--between">
            <div>
              <h2 className="modal-title-text">{category}</h2>
              <p className="modal-subtitle">Product inventory &amp; sales breakdown</p>
            </div>
            <ModalDateFilter
              dateRange={dateRange}
              setDateRange={setDateRange}
              showDatePicker={showDatePicker}
              setShowDatePicker={setShowDatePicker}
            />
          </div>
        </div>
        <div className="modal-table-wrap">
          <table className="modal-table">
            <thead>
              <tr className="modal-thead-row" style={{ background: headerBg, borderBottom: `2.5px solid ${catColor}` }}>
                <th className="th-padl th-rank" style={{ color: catColor }}>Rank</th>
                <th style={{ color: catColor }}>Item Code</th>
                <th className="th-img"></th>
                <th style={{ color: catColor }}>Product Name</th>
                <th style={{ color: catColor }}>Wholesale Price</th>
                <th style={{ color: catColor }}>Unit Price</th>
                <th className="th-center" style={{ color: catColor }}>Stock</th>
                <th className="th-center" style={{ color: catColor }}>Units Sold</th>
                <th className="th-padr th-right" style={{ color: catColor }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i} className={`modal-row${i % 2 !== 0 ? ' modal-row--alt' : ''}`}>
                  <td className="th-padl td-rank" style={{ color: catColor }}>{i + 1}</td>
                  <td className="td-code">{p.id}</td>
                  <td><div className="modal-img-wrap"><img src={p.img} alt={p.name} onError={(e) => { e.target.style.display = 'none'; }} /></div></td>
                  <td className="td-name">{p.name}</td>
                  <td>{p.wholesale}<span className="modal-sub"> (6 pcs)</span></td>
                  <td>{p.unitPrice}</td>
                  <td className="th-center">{p.stock}</td>
                  <td className="th-center">{p.unitsSold}</td>
                  <td className="th-padr th-right td-bold td-green">{p.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ModalFooter onDownload={() => downloadHTML(html(), `category-${category.toLowerCase()}.html`)} onPrint={() => openPrintWindow(html())} />
      </div>
    </div>
  );
}

function ReturnModal({ filter = 'all', onClose, onRowClick }) {
  const initSelect = filter === 'exchange' ? 'exchange' : filter === 'defective' ? 'defective' : 'All';
  const [reasonFilter,   setReasonFilter]   = useState(initSelect);
  const [showReasonDrop, setShowReasonDrop] = useState(false);
  const [dateRange,      setDateRange]      = useState({ from: null, to: null });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const reasonRef = useRef(null);

  const title    = filter === 'exchange' ? 'Exchange Items' : filter === 'defective' ? 'Defective Items' : 'Return & Exchange';
  const filtered = RETURN_TABLE_ALL.filter((r) => reasonFilter === 'All' || r.reason === reasonFilter);
  const stats    = {
    exchange:  RETURN_TABLE_ALL.filter((r) => r.reason === 'exchange').length,
    defective: RETURN_TABLE_ALL.filter((r) => r.reason === 'defective').length,
  };
  const html = () => generateReturnHTML(title, filtered);

  useEffect(() => {
    const h = (e) => { if (reasonRef.current && !reasonRef.current.contains(e.target)) setShowReasonDrop(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const REASON_OPTIONS = [
    { value: 'All',       label: 'All',       dot: null },
    { value: 'exchange',  label: 'Exchange',  dot: '#FFB6C8' },
    { value: 'defective', label: 'Defective', dot: '#78A5FA' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><span className="material-icons" style={{ fontSize: 16 }}>close</span></button>
        <div className="modal-header">
          <div className="modal-header-row modal-header-row--between">
            <div>
              <h2 className="modal-title-text">{title}</h2>
              <p className="modal-subtitle">Click any transaction row to view full return details &amp; invoice</p>
            </div>
            <div className="return-header-right">
              <div className="return-stat-badges">
                <div className="return-stat-badge return-stat-badge--exchange">
                  <span className="return-stat-badge__dot" /><span className="return-stat-badge__label">Exchange</span><span className="return-stat-badge__count">{stats.exchange}</span>
                </div>
                <div className="return-stat-badge return-stat-badge--defective">
                  <span className="return-stat-badge__dot" /><span className="return-stat-badge__label">Defective</span><span className="return-stat-badge__count">{stats.defective}</span>
                </div>
              </div>
              <ModalDateFilter
                dateRange={dateRange}
                setDateRange={setDateRange}
                showDatePicker={showDatePicker}
                setShowDatePicker={setShowDatePicker}
              />
            </div>
          </div>
        </div>
        <div className="modal-table-wrap">
          <table className="modal-table">
            <thead>
              <tr className="modal-thead-row modal-thead-row--yellow">
                <th className="th-padl">Transaction ID</th><th>Product ID</th><th>Product Name</th>
                <th className="th-center">Size</th><th className="th-center">Return Qty</th><th>Amount</th>
                <th className="th-padr">
                  <div className="return-reason-th" ref={reasonRef}>
                    <span>Reason</span>
                    <button className="reason-custom-btn" onClick={(e) => { e.stopPropagation(); setShowReasonDrop(v => !v); }}>
                      <span className="reason-custom-btn__label">
                        {reasonFilter === 'All' ? 'All' : reasonFilter.charAt(0).toUpperCase() + reasonFilter.slice(1)}
                      </span>
                      <span className="material-icons" style={{ fontSize: 14 }}>arrow_drop_down</span>
                    </button>
                    {showReasonDrop && (
                      <div className="reason-custom-drop" onClick={(e) => e.stopPropagation()}>
                        <div className="reason-custom-drop__hd">Filter by Reason</div>
                        {REASON_OPTIONS.map(opt => (
                          <button
                            key={opt.value}
                            className={`reason-custom-opt${reasonFilter === opt.value ? ' reason-custom-opt--active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setReasonFilter(opt.value); setShowReasonDrop(false); }}
                          >
                            {opt.dot && <span className="reason-custom-opt__dot" style={{ background: opt.dot }} />}
                            {!opt.dot && <span className="reason-custom-opt__dot-placeholder" />}
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr
                  key={i}
                  className={`modal-row modal-row--clickable${i % 2 !== 0 ? ' modal-row--alt' : ''}`}
                  onClick={() => onRowClick && onRowClick(r)}
                >
                  <td className="th-padl td-bold td-code">{r.txnId}</td>
                  <td>{r.productId}</td><td>{r.productName}</td>
                  <td className="th-center">{r.size}</td><td className="th-center">{r.returnQty}</td>
                  <td>{r.amount}</td>
                  <td className="th-padr"><ReasonBadge reason={r.reason} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ModalFooter onDownload={() => downloadHTML(html(), `return-${reasonFilter.toLowerCase()}.html`)} onPrint={() => openPrintWindow(html())} />
      </div>
    </div>
  );
}

const PERIOD_TABS = ['Monthly', 'Quarterly', 'Yearly'];

export default function Reports() {
  const [period,            setPeriod]            = useState('Monthly');
  const [categoryModal,     setCategoryModal]     = useState(null);
  const [showReturnModal,   setShowReturnModal]   = useState(false);
  const [returnFilter,      setReturnFilter]      = useState('all');
  const [showReturnDetail,  setShowReturnDetail]  = useState(false);
  const [showSalesTrend,    setShowSalesTrend]    = useState(false);
  const [txnModal,          setTxnModal]          = useState(null);

  const [chartDateRange,    setChartDateRange]    = useState({ from: null, to: null });
  const [showChartDatePick, setShowChartDatePick] = useState(false);

  const openReturnModal = (filter) => { setReturnFilter(filter); setShowReturnModal(true); };

  function handleRowClick(rowPeriod) {
    setShowSalesTrend(false);
    setTxnModal({ periodType: period, period: rowToOptionLabel(rowPeriod) });
  }

  function handleTxnBack() {
    setTxnModal(null);
    setShowSalesTrend(true);
  }

  function handleReturnRowClick() {
    setShowReturnModal(false);
    setShowReturnDetail(true);
  }

  function handleReturnDetailBack() {
    setShowReturnDetail(false);
    setShowReturnModal(true);
  }

  const chartFilteredLabels = getFilteredChartLabels(period, chartDateRange);
  const chartDateLabel      = formatChartDateLabel(chartDateRange);
  const chartSubtitle       = getChartSubtitle(period, chartDateRange);

  function clearChartDate(e) {
    e.stopPropagation();
    setChartDateRange({ from: null, to: null });
    setShowChartDatePick(false);
  }

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
          <div className="reports__chart-header-left">
            <h2 className="reports__section-title">Sales Trend</h2>
            <p className="reports__chart-sub">{chartSubtitle}</p>
          </div>

          <div className="reports__chart-header-right">
            <div className="reports__chart-right-top">
              <span className="reports__chart-view-hint" onClick={() => setShowSalesTrend(true)}>
                View full list →
              </span>
              <div className="period-toggle">
                {PERIOD_TABS.map((t) => (
                  <button
                    key={t}
                    className={`period-toggle__btn ${period === t ? 'period-toggle__btn--active' : ''}`}
                    onClick={() => { setPeriod(t); setChartDateRange({ from: null, to: null }); }}
                  >{t}</button>
                ))}
              </div>
            </div>

            <div className="reports__chart-right-bottom">
              <div className="chart-date-wrap">
                <button
                  className={`chart-date-btn${chartDateLabel ? ' chart-date-btn--active' : ''}`}
                  onClick={() => setShowChartDatePick(v => !v)}
                >
                  <span className="material-icons" style={{ fontSize: 16, color: '#1C1B1F', flexShrink: 0 }}>filter_list</span>
                  <span className="chart-date-btn__label">Date:</span>
                  <span className="chart-date-btn__range">{chartDateLabel || 'From – To'}</span>
                  {chartDateLabel && (
                    <button className="chart-date-btn__clear" onClick={clearChartDate} title="Clear filter">
                      <span className="material-icons" style={{ fontSize: 13 }}>close</span>
                    </button>
                  )}
                </button>
                {showChartDatePick && (
                  <DateRangePicker value={chartDateRange} onChange={setChartDateRange} onClose={() => setShowChartDatePick(false)} />
                )}
              </div>
            </div>
          </div>
        </div>

        {chartFilteredLabels && chartFilteredLabels.length > 0 && (
          <div className="chart-filter-bar">
            <span className="material-icons" style={{ fontSize: 13, color: 'rgba(112,2,15,0.7)' }}>event</span>
            <span className="chart-filter-bar__text">
              Showing: <strong>{chartFilteredLabels.join(', ')}</strong>
            </span>
          </div>
        )}

        <SalesChart period={period} dateRange={chartDateRange} filteredLabels={chartFilteredLabels} />
      </div>

      <div className="reports__content-row fade-in">
        <div className="reports__left-col">

          <div className="reports__category-card">
            <h2 className="reports__section-title">Category based Sales Share</h2>
            <div className="reports__category-body">
              <DonutChart data={CATEGORY_DATA} onSliceClick={(label) => setCategoryModal(label)} />
              <div className="reports__category-legend">
                {CATEGORY_DATA.map((d) => (
                  <div key={d.label} className="reports__legend-item" onClick={() => setCategoryModal(d.label)} style={{ cursor: 'pointer' }}>
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
                <BarChart data={RETURN_DATA[period]} margin={{ top: 6, right: 10, left: -10, bottom: 0 }} barCategoryGap="30%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontFamily: 'Inter', fontSize: 10, fill: 'rgba(0,0,0,0.5)' }} axisLine={{ stroke: 'rgba(0,0,0,0.3)' }} tickLine={false} />
                  <YAxis tick={{ fontFamily: 'Inter', fontSize: 10, fill: 'rgba(0,0,0,0.4)' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ReturnTooltip />} />
                  <Bar dataKey="exchange"  name="Exchange"  fill="#FFB6C8" radius={[4,4,0,0]} animationDuration={700} style={{ cursor: 'pointer' }} onClick={(data, index, e) => { e.stopPropagation(); openReturnModal('exchange'); }} />
                  <Bar dataKey="defective" name="Defective" fill="#78A5FA" radius={[4,4,0,0]} animationDuration={700} style={{ cursor: 'pointer' }} onClick={(data, index, e) => { e.stopPropagation(); openReturnModal('defective'); }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="reports__return-hint" onClick={() => openReturnModal('all')}>View full return &amp; exchange list →</p>
          </div>
        </div>

        <div className="reports__top-selling">
          <h2 className="reports__section-title">Top Selling</h2>
          <div className="reports__products-list">
            {TOP_PRODUCTS.map((p) => (
              <div key={p.rank} className="reports__product-card">
                <span className="reports__product-rank">{p.rank}</span>
                <div className="reports__product-img-wrap">
                  <img src={p.img} alt={p.name} className="reports__product-img" onError={(e) => { e.target.style.display = 'none'; }} />
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

      {showSalesTrend  && <SalesTrendModal period={period} onClose={() => setShowSalesTrend(false)} onRowClick={handleRowClick} />}
      {categoryModal   && <CategoryModal  category={categoryModal} onClose={() => setCategoryModal(null)} />}

      {showReturnModal && (
        <ReturnModal
          filter={returnFilter}
          onClose={() => setShowReturnModal(false)}
          onRowClick={handleReturnRowClick}
        />
      )}

      {showReturnDetail && (
        <ReturnDetailModal
          onClose={() => setShowReturnDetail(false)}
          onBack={handleReturnDetailBack}
        />
      )}

      {txnModal && (
        <TransactionDetailModal
          periodType={txnModal.periodType}
          initialPeriod={txnModal.period}
          onClose={() => setTxnModal(null)}
          onBack={handleTxnBack}
        />
      )}
    </div>
  );
}