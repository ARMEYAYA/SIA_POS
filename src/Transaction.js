import React, { useState, useMemo, useEffect, useRef } from 'react';
import Topbar from './Topbar';
import './Transaction.css';
 
const TAB_STATUSES = {
  Pending:   ['reserved', 'overdue'],
  Completed: ['to ship', 'shipped out'],
  Cancelled: [],
  Return:    ['returning', 'exchanged', 'reshipped'],
};
 
/* ── Static mock data ── */
const PENDING_DATA = [
  { id: 'TXN-100245', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'overdue' },
  { id: 'TXN-100246', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'reserved' },
  { id: 'TXN-100247', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'reserved' },
  { id: 'TXN-100248', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'reserved' },
  { id: 'TXN-100249', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'reserved' },
  { id: 'TXN-100250', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'overdue' },
  { id: 'TXN-100251', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'reserved' },
  { id: 'TXN-100252', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'overdue' },
  { id: 'TXN-100253', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'reserved' },
];
 
const COMPLETED_DATA = [
  { id: 'TXN-100245', customer: 'Hean Aether Delacruz', date: '03/10/2026 4:00 PM', method: 'Metro Bank - CARD',    ref: '1738499484733673', refDate: '02/10/11 - 20:00PM', total: 20000, status: 'to ship' },
  { id: 'TXN-100246', customer: 'Hean Aether Delacruz', date: '03/10/2026 4:00 PM', method: 'Union Bank - CARD',    ref: '1738499484733673', refDate: '02/10/11 - 20:00PM', total: 20000, status: 'to ship' },
  { id: 'TXN-100247', customer: 'Hean Aether Delacruz', date: '03/10/2026 4:00 PM', method: 'Union Bank - CARD',    ref: '1738499484733673', refDate: '02/10/11 - 20:00PM', total: 20000, status: 'to ship' },
  { id: 'TXN-100248', customer: 'Hean Aether Delacruz', date: '03/10/2026 4:00 PM', method: 'Cash',                 ref: 'Cash',             refDate: '02/10/11 - 20:00PM', total: 20000, status: 'to ship' },
  { id: 'TXN-100249', customer: 'Hean Aether Delacruz', date: '03/10/2026 4:00 PM', method: 'Gcash - Epayment',     ref: '1738499484733673', refDate: '02/10/11 - 20:00PM', total: 20000, status: 'shipped out' },
  { id: 'TXN-100250', customer: 'Hean Aether Delacruz', date: '03/10/2026 4:00 PM', method: 'Union Bank - CARD',    ref: '1738499484733673', refDate: '02/10/11 - 20:00PM', total: 20000, status: 'shipped out' },
  { id: 'TXN-100251', customer: 'Hean Aether Delacruz', date: '03/10/2026 4:00 PM', method: 'Union Bank - CARD',    ref: '1738499484733673', refDate: '02/10/11 - 20:00PM', total: 20000, status: 'shipped out' },
  { id: 'TXN-100252', customer: 'Hean Aether Delacruz', date: '03/10/2026 4:00 PM', method: 'Union Bank - CARD',    ref: '1738499484733673', refDate: '02/10/11 - 20:00PM', total: 20000, status: 'shipped out' },
  { id: 'TXN-100253', customer: 'Hean Aether Delacruz', date: '03/10/2026 4:00 PM', method: 'Union Bank - CARD',    ref: '1738499484733673', refDate: '02/10/11 - 20:00PM', total: 20000, status: 'shipped out' },
];
 
const CANCELLED_DATA = [
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
 
const RETURN_DATA = [
  { id: 'TXN-100245', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'returning' },
  { id: 'TXN-100246', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'returning' },
  { id: 'TXN-100247', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'exchanged' },
  { id: 'TXN-100248', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'exchanged' },
  { id: 'TXN-100249', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'reshipped' },
  { id: 'TXN-100250', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'reshipped' },
  { id: 'TXN-100251', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'returning' },
  { id: 'TXN-100252', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'exchanged' },
  { id: 'TXN-100253', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, status: 'reshipped' },
];
 
 
const INVOICE_ITEMS = [
  { name: 'Kiddiesaurs Pajama Set', code: 'KJPS001', size: 100, qty: 15, unitPrice: 145,  pricePerPack: 725,  tax: 0, discount: 0, amount: 10875 },
  { name: 'Sunny Day Twirl Dress',  code: 'SDTD002', size: 100, qty: 3,  unitPrice: 245,  pricePerPack: 1470, tax: 0, discount: 0, amount: 4410  },
  { name: 'Rainbow Snuggle Pajamas',code: 'RSP003',  size: 100, qty: 3,  unitPrice: 315,  pricePerPack: 1890, tax: 0, discount: 0, amount: 5670  },
  { name: 'Tiny Trendsetter OOTD',  code: 'TTO004',  size: 100, qty: 2,  unitPrice: 210,  pricePerPack: 1260, tax: 0, discount: 0, amount: 2520  },
  { name: "Lil' Sunshine Casual",   code: 'LSC005',  size: 100, qty: 2,  unitPrice: 240,  pricePerPack: 960,  tax: 0, discount: 0, amount: 1920  },
  { name: 'Sweet Bunny Pajama Set', code: 'SBP006',  size: 100, qty: 3,  unitPrice: 205,  pricePerPack: 1230, tax: 0, discount: 0, amount: 3690  },
  { name: 'Tiny Explorer Outfit',   code: 'TEO007',  size: 100, qty: 2,  unitPrice: 255,  pricePerPack: 1530, tax: 0, discount: 0, amount: 3060  },
];
 
const STATUS_META = {
  reserved:      { label: 'reserved',    bg: 'rgba(253,230,138,0.25)', border: 'rgba(253,230,138,0.63)', dot: '#FDE68A' },
  overdue:       { label: 'overdue',     bg: 'rgba(252,165,165,0.25)', border: 'rgba(252,165,165,0.66)', dot: '#FCA5A5' },
  pending:       { label: 'pending',     bg: '#F6F2DF',                border: 'rgba(254,215,0,0.63)',   dot: '#FED700' },
  'to ship':     { label: 'to ship',     bg: 'rgba(147,197,253,0.25)', border: 'rgba(147,197,253,0.66)', dot: '#93C5FD' },
  'shipped out': { label: 'shipped out', bg: 'rgba(196,181,253,0.25)', border: 'rgba(196,181,253,0.66)', dot: '#C4B5FD' },
  completed:     { label: 'completed',   bg: 'rgba(112,233,90,0.25)',  border: 'rgba(112,233,90,0.66)',  dot: '#70E95A' },
  cancelled:     { label: 'cancelled',   bg: 'rgba(153,2,20,0.25)',    border: '#990214',                dot: '#990214' },
  paid:          { label: 'paid',        bg: 'rgba(112,233,90,0.25)',  border: 'rgba(112,233,90,0.66)',  dot: '#70E95A' },
  returning:     { label: 'returning',   bg: 'rgba(251,191,36,0.25)',  border: 'rgba(251,191,36,0.66)',  dot: '#FBBF24' },
  exchanged:     { label: 'exchanged',   bg: 'rgba(52,211,153,0.25)',  border: 'rgba(52,211,153,0.66)',  dot: '#34D399' },
  reshipped:     { label: 'reshipped',   bg: 'rgba(99,102,241,0.25)',  border: 'rgba(99,102,241,0.66)',  dot: '#6366F1' },
};
 
function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.reserved;
  return (
    <span className="txn__badge" style={{ background: m.bg, border: `0.5px solid ${m.border}` }}>
      <span className="txn__badge-dot" style={{ background: m.dot }} />
      {m.label}
    </span>
  );
}
 
function generateInvoicePrintHTML(txn, items) {
  const subTotal = items.reduce((s, i) => s + i.amount, 0);
  const rows = items.map(item => `
    <tr>
      <td>
        <div style="font-weight:700;font-size:8px">${item.name}</div>
        <div style="font-size:6px;color:rgba(0,0,0,0.45)">ITEM CODE &nbsp; Size ${item.size}</div>
      </td>
      <td>${item.qty}</td>
      <td>P ${item.unitPrice.toLocaleString()}.OO</td>
      <td>P ${item.pricePerPack.toLocaleString()}.OO</td>
      <td>${item.tax}</td>
      <td>${item.discount}</td>
      <td>P ${item.amount.toLocaleString()}.OO</td>
    </tr>`).join('');
 
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Invoice ${txn?.id || 'PJM'}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,sans-serif;font-size:10px;color:#000;padding:28px;max-width:820px;margin:0 auto}
    .hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;padding-bottom:12px;border-bottom:1.5px solid #8B333D}
    .brand{font-weight:800;font-size:18px;color:#8B333D;margin-bottom:6px}
    .addr{font-size:7px;color:rgba(0,0,0,0.5);line-height:1.6}
    .inv-title{font-size:26px;font-weight:700;color:rgba(0,0,0,0.3);text-align:right;margin-bottom:6px}
    .meta{font-size:9px;text-align:right;line-height:1.8}
    .meta b{font-weight:600}
    .cust-box{display:flex;gap:24px;margin-bottom:14px;padding:10px 14px;background:#fafafa;border:1px solid #eee;border-radius:4px}
    .cust-col{display:flex;flex-direction:column;gap:3px}
    .cust-lbl{font-size:8px;font-weight:700;color:#555;text-transform:uppercase}
    .cust-val{font-size:10px;font-weight:500}
    .section{font-weight:700;font-size:11px;margin-bottom:8px}
    table{width:100%;border-collapse:collapse;font-size:8px;margin-bottom:14px}
    thead tr{background:rgba(255,242,141,0.6)}
    th{padding:6px 8px;font-weight:700;text-align:left;white-space:nowrap;border-bottom:1px solid #ddd}
    td{padding:6px 8px;border-bottom:1px solid rgba(0,0,0,0.05);vertical-align:top}
    .summary{display:flex;flex-direction:column;align-items:flex-end;gap:3px;margin-bottom:14px;padding:10px 14px;border-top:1px solid #eee}
    .sum-row{display:flex;gap:20px;font-size:9px}
    .sum-row span:first-child{font-weight:600;min-width:80px;text-align:right}
    .divider{width:200px;border-top:1px solid #ddd;margin:5px 0}
    .total{display:flex;gap:20px;font-size:12px;font-weight:800;color:#8B333D}
    .footer{text-align:center;font-size:7px;color:rgba(0,0,0,0.4);border-top:1px solid #eee;padding-top:10px;margin-top:16px}
    @media print{html,body{height:auto}}
  </style>
</head>
<body>
  <div class="hdr">
    <div>
      <div class="brand">LOVE ATHALIA</div>
      <div class="addr">
        Blk 15 Lot 4 Ph 4 Pkg 2 Barangay 176 Bagong Silang 1400<br/>
        City of Caloocan NCR, Third District Philippines<br/>
        Shane Anne C. Gapas - Prop.<br/>
        Non VAT- Reg Tin: 425-464-696-000000
      </div>
    </div>
    <div>
      <div class="inv-title">INVOICE</div>
      <div class="meta">
        <div><b>Invoice no:</b> PJM-1100192-79</div>
        <div><b>Date Issued:</b> 03/20/2026 - 9:19 PM</div>
        <div><b>Ref:</b> BC 8888888888</div>
      </div>
    </div>
  </div>
  <div class="cust-box">
    <div class="cust-col">
      <span class="cust-lbl">Customer Name</span>
      <span class="cust-val">${txn?.customer || 'Hean Aether Dela Cruz'}</span>
    </div>
    <div class="cust-col">
      <span class="cust-lbl">Transaction ID</span>
      <span class="cust-val">${txn?.id || 'ORD0001'}</span>
      <span class="cust-lbl" style="margin-top:5px">Date of Order</span>
      <span class="cust-val">${txn?.date || '03/10/2026 4:00 PM'}</span>
    </div>
    <div class="cust-col">
      <span class="cust-lbl">Payment Method</span>
      <span class="cust-val">${txn?.method || 'Union Bank - CARD'}</span>
      <span class="cust-lbl" style="margin-top:5px">Payment Reference</span>
      <span class="cust-val">${txn?.ref || '—'}</span>
      <span style="font-size:8px;color:rgba(0,0,0,0.4)">${txn?.refDate || ''}</span>
    </div>
  </div>
  <div class="section">Order Details:</div>
  <table>
    <thead>
      <tr><th>Item</th><th>Qty</th><th>Unit Price</th><th>Price/Pack</th><th>Tax</th><th>Discount</th><th>Amount</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="summary">
    <div class="sum-row"><span>Sub Total:</span><span>P ${subTotal.toLocaleString()}.00</span></div>
    <div class="sum-row"><span>Vat Tax:</span><span>P 0.00</span></div>
    <div class="sum-row"><span>Discount:</span><span>P 0.00</span></div>
    <div class="divider"></div>
    <div class="total"><span>Total Amount:</span><span>P ${subTotal.toLocaleString()}.00</span></div>
  </div>
  <div class="footer">BIR Permit No. OCN 027 AU2024000002225</div>
</body>
</html>`;
}
 
function InvoicePanel({ txn, onReturn }) {
  const subTotal = INVOICE_ITEMS.reduce((s, i) => s + i.amount, 0);
  const total    = subTotal;
 
  const handlePrint = () => {
    const html = generateInvoicePrintHTML(txn, INVOICE_ITEMS);
    const pw = window.open('', '_blank', 'width=900,height=750');
    if (!pw) {
      alert('Pop-up blocked. Please allow pop-ups for this site to enable printing.');
      return;
    }
    pw.document.write(html);
    pw.document.close();
    pw.onload = () => { pw.focus(); pw.print(); };
  };
 
  const handleDownload = () => {
    const html = generateInvoicePrintHTML(txn, INVOICE_ITEMS);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `invoice-${txn?.id || 'PJM'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
 
  return (
    <div className="invoice">
      <div className="invoice__head">
        <div className="invoice__logo-wrap">
          <img src="/images/logo.png" alt="Love Athalia" className="invoice__logo"
            onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
        <div className="invoice__head-right">
          <p className="invoice__title-text">INVOICE</p>
          <div className="invoice__meta-row">
            <span className="invoice__meta-label">Invoice no:</span>
            <span className="invoice__meta-val">PJM-1100192-79</span>
          </div>
          <div className="invoice__meta-row">
            <span className="invoice__meta-label">Date Issued:</span>
            <span className="invoice__meta-val" style={{ color: 'rgba(0,0,0,0.51)' }}>03/20/2026 - 9:19 PM</span>
          </div>
          <div className="invoice__meta-row">
            <span className="invoice__meta-label">Ref:</span>
            <span className="invoice__meta-val" style={{ color: 'rgba(0,0,0,0.51)' }}>BC 8888888888</span>
          </div>
        </div>
      </div>
 
      <div className="invoice__address">
        <p>Blk 15 Lot 4 Ph 4 Pkg 2 Barangay 176 Bagong Silang 1400</p>
        <p>City of Caloocan NCR, Third District Philippines</p>
        <p>Shane Anne C. Gapas - Prop.</p>
        <p>Non VAT- Reg Tin: 425-464-696-000000</p>
      </div>
 
      <div className="invoice__customer">
        <div className="invoice__customer-row">
          <span className="invoice__cust-label">Customer Name:</span>
          <span className="invoice__cust-val">{txn?.customer || 'Hean Aether Dela Cruz'}</span>
        </div>
        <div className="invoice__customer-row">
          <span className="invoice__cust-label" style={{ fontSize: 8, color: '#4A4A4A' }}>Transaction ID:</span>
          <span className="invoice__cust-val"   style={{ fontSize: 8, color: '#4A4A4A' }}>{txn?.id || 'ORD0001'}</span>
          <span className="invoice__cust-label" style={{ fontSize: 8, color: '#4A4A4A', marginLeft: 10 }}>Payment Method:</span>
          <span className="invoice__cust-val"   style={{ fontSize: 8 }}>{txn?.method || 'Union Bank - CARD'}</span>
        </div>
        <div className="invoice__customer-row">
          <span className="invoice__cust-label" style={{ fontSize: 8, color: '#4A4A4A' }}>Date Order:</span>
          <span className="invoice__cust-val"   style={{ fontSize: 8, color: 'rgba(0,0,0,0.55)' }}>{txn?.date || '03/10/2026 4:00 PM'}</span>
          <span className="invoice__cust-label" style={{ fontSize: 8, color: '#4A4A4A', marginLeft: 10 }}>Payment Reference:</span>
          <span className="invoice__cust-val"   style={{ fontSize: 8 }}>{txn?.ref || '—'}</span>
        </div>
      </div>
 
      <p className="invoice__section-label">Order Details:</p>
 
      <div className="invoice__items-wrap">
        <table className="invoice__items-table">
          <thead>
            <tr className="invoice__items-head">
              <th>Item</th><th>Qty</th><th>Unit Price</th><th>Price/Pack</th><th>Tax</th><th>Discount</th><th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {INVOICE_ITEMS.map((item, i) => (
              <tr key={i} className="invoice__item-row">
                <td>
                  <span className="invoice__item-name">{item.name}</span>
                  <span className="invoice__item-sub">ITEM CODE &nbsp; Size {item.size}</span>
                </td>
                <td>{item.qty}</td>
                <td>P {item.unitPrice.toLocaleString()}.OO</td>
                <td>P {item.pricePerPack.toLocaleString()}.OO</td>
                <td>{item.tax}</td>
                <td>{item.discount}</td>
                <td>P {item.amount.toLocaleString()}.OO</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      <div className="invoice__summary">
        <div className="invoice__sum-row"><span>Sub Total:</span><span>P {subTotal.toLocaleString()}.00</span></div>
        <div className="invoice__sum-row"><span>Vat Tax:</span><span>P 0.00</span></div>
        <div className="invoice__sum-row"><span>Discount:</span><span>P 0.00</span></div>
        <div className="invoice__sum-divider" />
        <div className="invoice__sum-total">
          <span>Total Amount :</span>
          <span style={{ color: '#8B333D' }}>P {total.toLocaleString()}.00</span>
        </div>
      </div>
 
      <div className="invoice__footer-logo">
        <img src="/images/logo.png" alt="" style={{ height: 22 }} onError={(e) => (e.target.style.display = 'none')} />
      </div>
      <p className="invoice__bir">BIR Permit No. OCN 027 AU2024000002225</p>
 
      <div className="invoice__actions">
        <button
          className="invoice__act-btn invoice__act-btn--return"
          onClick={onReturn}
          title="Process a return for this transaction"
        >
          Return
        </button>
        <button
          className="invoice__act-btn invoice__act-btn--download"
          onClick={handleDownload}
          title="Download invoice"
        >
          <span className="material-icons" style={{ fontSize: 18 }}>download</span>
        </button>
        <button
          className="invoice__act-btn invoice__act-btn--print"
          onClick={handlePrint}
          title="Print invoice"
        >
          <span className="material-icons" style={{ fontSize: 18, marginRight: 4 }}>print</span>
          Print
        </button>
      </div>
    </div>
  );
}
 
function PaymentModal({ txn, onClose, onConfirm }) {
  const [ref, setRef] = useState('');
  return (
    <div className="modal-overlay">
      <div className="modal modal--payment">
        <h2 className="modal__title">Payment Confirmation</h2>
        <p className="modal__desc">
          If you already have your reference number, kindly input it below.
          This will be displayed here for your confirmation.
        </p>
        <input
          className="modal__input"
          placeholder="Enter Payment Reference Number to confirm your transaction."
          value={ref}
          onChange={(e) => setRef(e.target.value)}
        />
        <div className="modal__actions">
          <button className="modal__btn modal__btn--cancel" onClick={onClose}>cancel</button>
          <button className="modal__btn modal__btn--primary" onClick={() => onConfirm(ref)} disabled={!ref.trim()}>
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}
 
function ShipmentModal({ txn, onClose, onConfirm }) {
  const [method, setMethod]   = useState('');
  const [courier, setCourier] = useState('');
  return (
    <div className="modal-overlay">
      <div className="modal modal--shipment">
        <h2 className="modal__title">Confirm Shipment</h2>
        <p className="modal__desc">Please select the Shipment Method to proceed.</p>
        <div className="shipment__field">
          <label className="shipment__label">Shipment Method:</label>
          <div className="shipment__select-wrap">
            <select className="shipment__select" value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="">Delivery</option>
              <option value="pickup">Pick-up</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
        </div>
        <div className="shipment__field">
          <label className="shipment__label">Delivery Courier</label>
          <div className="shipment__select-wrap">
            <select className="shipment__select" value={courier} onChange={(e) => setCourier(e.target.value)}>
              <option value="">Shopee Checkout</option>
              <option value="shopee">Shopee Checkout</option>
              <option value="lalamove">Lalamove</option>
              <option value="jnt">J&T Express</option>
            </select>
          </div>
        </div>
        <div className="modal__actions">
          <button className="modal__btn modal__btn--cancel" onClick={onClose}>Cancel</button>
          <button className="modal__btn modal__btn--primary" onClick={() => onConfirm({ method, courier })}>
            Confirm Shipment
          </button>
        </div>
      </div>
    </div>
  );
}
 
function ReturnModal({ txn, onClose }) {
  const [step, setStep]       = useState('form');
  const [product, setProduct] = useState('');
  const [qty, setQty]         = useState('');
  const [reason, setReason]   = useState('');
  const returnItems = [
    { id: 'RP-001', name: 'Kiddiesaurs Pajama Set', size: 100, amount: 100, returnQty: '2 pack', reason: 'Wrong Item' },
    { id: 'RP-002', name: 'Sunny Day Twirl Dress',  size: 100, amount: 100, returnQty: '2 pack', reason: 'Wrong Item' },
  ];
 
  if (step === 'success') {
    return (
      <div className="modal-overlay">
        <div className="modal modal--success">
          <div className="success__circle">
            <span className="material-icons success__check">check</span>
          </div>
          <h2 className="success__title">Return Submitted!</h2>
          <p className="success__desc">The return request has been successfully recorded</p>
          <button className="modal__btn modal__btn--primary" style={{ marginTop: 16 }} onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    );
  }
 
  if (step === 'confirm') {
    return (
      <div className="modal-overlay">
        <div className="modal modal--return modal--return-lg">
          <button className="modal__close" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
          <h2 className="return__title">Return &amp; Exchange</h2>
          <div className="return__info-row">
            <span className="return__info-label">Transaction No:</span>
            <span className="return__info-value">{txn?.id || 'ORD0001'}</span>
            <span className="return__info-label" style={{ marginLeft: 'auto' }}>Invoice No:</span>
            <span className="return__info-value" style={{ color: '#8B333D' }}>PJM-1100192-79</span>
          </div>
          <div className="return__info-row">
            <span className="return__info-label">Customer Name:</span>
            <span className="return__info-value">{txn?.customer || 'Hean Aether Dela Cruz'}</span>
          </div>
          <div className="return__info-row">
            <span className="return__info-label">Date of Order:</span>
            <span className="return__info-value">{txn?.date || '03/10/2026 4:00 PM'}</span>
          </div>
          <h3 className="return__section-title">Return Details:</h3>
          <div className="return__table-wrap">
            <table className="return__table">
              <thead>
                <tr className="return__thead-row">
                  <th>Product ID</th><th>Product Name</th><th>Size</th><th>Amount</th><th>Return Quantity</th><th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {returnItems.map((item) => (
                  <tr key={item.id} className="return__row">
                    <td>{item.id}</td><td>{item.name}</td><td>{item.size}</td>
                    <td>{item.amount}</td><td>{item.returnQty}</td><td>{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="modal__actions" style={{ marginTop: 16 }}>
            <button className="modal__btn modal__btn--cancel" onClick={() => setStep('form')}>Discard</button>
            <button className="modal__btn modal__btn--outline" onClick={() => setStep('form')}>Edit</button>
            <button className="modal__btn modal__btn--primary" onClick={() => setStep('success')}>Confirm Return</button>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="modal-overlay">
      <div className="modal modal--return modal--return-lg">
        <button className="modal__close" onClick={onClose}>
          <span className="material-icons">close</span>
        </button>
        <h2 className="return__title">Return &amp; Exchange</h2>
        <div className="return__info-row">
          <span className="return__info-label">Transaction No:</span>
          <span className="return__info-value">{txn?.id || 'ORD0001'}</span>
          <span className="return__info-label" style={{ marginLeft: 'auto' }}>Invoice No:</span>
          <span className="return__info-value" style={{ color: '#8B333D' }}>PJM-1100192-79</span>
        </div>
        <div className="return__info-row">
          <span className="return__info-label">Customer Name:</span>
          <span className="return__info-value">{txn?.customer || 'Hean Aether Dela Cruz'}</span>
        </div>
        <div className="return__info-row">
          <span className="return__info-label">Date of Order:</span>
          <span className="return__info-value">{txn?.date || '03/10/2026 4:00 PM'}</span>
        </div>
 
        <h3 className="return__section-title">Return Product</h3>
        <div className="return__form-row">
          <div className="return__form-group">
            <label className="return__form-label">Product:</label>
            <div className="return__select-wrap">
              <select className="return__select" value={product} onChange={(e) => setProduct(e.target.value)}>
                <option value="">Select Return Product</option>
                <option value="p1">Kiddiesaurs Pajama Set</option>
                <option value="p2">Sunny Day Twirl Dress</option>
              </select>
            </div>
          </div>
          <div className="return__form-group">
            <label className="return__form-label">Reason:</label>
            <div className="return__select-wrap">
              <select className="return__select" value={reason} onChange={(e) => setReason(e.target.value)}>
                <option value="">Select Return Reason</option>
                <option value="wrong">Wrong Item</option>
                <option value="defective">Defective</option>
                <option value="size">Wrong Size</option>
              </select>
            </div>
          </div>
        </div>
        <div className="return__form-row">
          <div className="return__form-group">
            <label className="return__form-label">Quantity:</label>
            <div className="return__select-wrap">
              <select className="return__select" value={qty} onChange={(e) => setQty(e.target.value)}>
                <option value="">Select Return Quantity</option>
                <option value="1">1</option>
                <option value="2">2 pack</option>
                <option value="3">3</option>
              </select>
            </div>
          </div>
          <button className="return__add-btn">Add Return Product</button>
        </div>
 
        <h3 className="return__section-title">Return Details:</h3>
        <div className="return__table-wrap">
          <table className="return__table">
            <thead>
              <tr className="return__thead-row">
                <th>Product ID</th><th>Product Name</th><th>Size</th><th>Amount</th><th>Return Quantity</th><th>Reason</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '14px', color: 'rgba(0,0,0,0.35)', fontSize: 12 }}>
                  No return items added yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="modal__actions" style={{ marginTop: 16 }}>
          <button className="modal__btn modal__btn--cancel" onClick={onClose}>Discard</button>
          <button className="modal__btn modal__btn--primary" onClick={() => setStep('confirm')}>Submit Return</button>
        </div>
      </div>
    </div>
  );
}
 
export default function TransactionPage() {
 
  const TABS = ['Pending', 'Completed', 'Cancelled', 'Return'];
 
  const [activeTab, setActiveTab]         = useState('Pending');
  const [search, setSearch]               = useState('');
  const [sortOrder, setSortOrder]         = useState('desc');
  const [sortOpen, setSortOpen]           = useState(false);
  const [statusFilter, setStatusFilter]   = useState('all');
  const [statusDropOpen, setStatusDropOpen] = useState(false);
  const [paymentModal, setPaymentModal]   = useState(null);
  const [shipmentModal, setShipmentModal] = useState(null);
  const [returnModal, setReturnModal]     = useState(null);
  const [invoiceTxn, setInvoiceTxn]       = useState(null);
 
  const statusThRef = useRef(null);
 
  useEffect(() => {
    const handler = (e) => {
      if (statusThRef.current && !statusThRef.current.contains(e.target)) {
        setStatusDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
 
  const rawData = useMemo(() => {
    if (activeTab === 'Pending')   return PENDING_DATA;
    if (activeTab === 'Completed') return COMPLETED_DATA;
    if (activeTab === 'Return')    return RETURN_DATA;
    return CANCELLED_DATA;
  }, [activeTab]);
 
  const tableData = useMemo(() => {
    let data = rawData.filter((r) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== 'all') {
      data = data.filter((r) => r.status === statusFilter);
    }
    return [...data].sort((a, b) =>
      sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
    );
  }, [rawData, search, sortOrder, statusFilter]);
 
  const formatCurrency = (n) => '₱ ' + n.toLocaleString('en-PH', { minimumFractionDigits: 2 });
  const isCompleted = activeTab === 'Completed';
 
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setStatusFilter('all');
    setStatusDropOpen(false);
    setInvoiceTxn(null);
  };
 
  const handleRowClick = (txn) => {
    if (activeTab === 'Pending') {
      setPaymentModal(txn);
    } else if (activeTab === 'Completed') {
      if (txn.status === 'to ship') {
        setShipmentModal(txn);
      } else {
        setInvoiceTxn((prev) => (prev?.id === txn.id ? null : txn));
      }
    }
  };
 
  const handleShipmentConfirm = () => {
    const txn = shipmentModal;
    setShipmentModal(null);
    setInvoiceTxn(txn);
  };
 
  const showInvoice = isCompleted && invoiceTxn !== null;
 
  return (
    <div className="txnpage">
      {/* ── Header ── */}
      <div className="txnpage__header">
        <div className="txnpage__title-block">
          <h1 className="txnpage__title">TRANSACTION</h1>
          <p className="txnpage__subtitle">Track and manage all customer orders and transaction details.</p>
        </div>
        <Topbar />
      </div>
 
      <div className="txnpage__controls">
        {/* ── Tabs ── */}
        <div className="txnpage__tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`txnpage__tab ${activeTab === tab ? 'txnpage__tab--active' : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
 
        <div className="txnpage__toolbar">
          <div className="txnpage__search">
            <span className="material-icons txnpage__search-icon">search</span>
            <input
              className="txnpage__search-input"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="txnpage__sort-wrap">
            <button className="txnpage__sort-btn" onClick={() => setSortOpen((v) => !v)}>
              <span className="txnpage__sort-label">Sort By:</span>
              <span className="txnpage__sort-value">Date</span>
              <span className="material-icons txnpage__sort-arrow">keyboard_arrow_down</span>
            </button>
            {sortOpen && (
              <div className="txnpage__sort-drop">
                <div
                  className={`txnpage__sort-option ${sortOrder === 'desc' ? 'active' : ''}`}
                  onClick={() => { setSortOrder('desc'); setSortOpen(false); }}
                >
                  <span className="material-icons">arrow_downward</span> Newest
                </div>
                <div
                  className={`txnpage__sort-option ${sortOrder === 'asc' ? 'active' : ''}`}
                  onClick={() => { setSortOrder('asc'); setSortOpen(false); }}
                >
                  <span className="material-icons">arrow_upward</span> Oldest
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
 
      <div className={`txnpage__body ${showInvoice ? 'txnpage__body--split' : ''}`}>
        {/* Table card */}
        <div className="txnpage__card">
          <div className="txnpage__table-wrap">
            <table className="txnpage__table">
              <thead>
                <tr className="txnpage__thead-row">
                  <th>Transaction ID</th>
                  <th>Customer Full Name</th>
                  <th>Date of Order</th>
                  {isCompleted && <th>Payment Method</th>}
                  {isCompleted && <th>Payment Reference</th>}
                  <th>Total Amount</th>
                  <th
                    ref={statusThRef}
                    className="txnpage__th-status"
                    onClick={() => {
                      /* Cancelled has only one status — no need for a dropdown */
                      if (activeTab !== 'Cancelled') setStatusDropOpen((v) => !v);
                    }}
                    style={{ cursor: activeTab !== 'Cancelled' ? 'pointer' : 'default' }}
                  >
                    <span className="txnpage__th-status-inner">
                      Status
                      {activeTab !== 'Cancelled' && (
                        <span className={`material-icons txnpage__th-arrow ${statusDropOpen ? 'txnpage__th-arrow--open' : ''}`}>
                          arrow_drop_down
                        </span>
                      )}
                    </span>
 
                    {/* ── Status column dropdown ── */}
                    {statusDropOpen && activeTab !== 'Cancelled' && (
                      <div className="txnpage__status-drop" onClick={(e) => e.stopPropagation()}>
                        {/* Yellow header row */}
                        <div className="txnpage__status-drop-header">
                          <span>Status</span>
                          <span className="material-icons" style={{ fontSize: 14 }}>arrow_drop_down</span>
                        </div>
 
                        {/* All option */}
                        <div
                          className={`txnpage__status-drop-row ${statusFilter === 'all' ? 'txnpage__status-drop-row--active' : ''}`}
                          onClick={() => { setStatusFilter('all'); setStatusDropOpen(false); }}
                        >
                          <span className="txnpage__status-drop-all">All</span>
                        </div>
 
                        {/* Per-tab status options */}
                        {TAB_STATUSES[activeTab].map((s) => (
                          <div
                            key={s}
                            className={`txnpage__status-drop-row ${statusFilter === s ? 'txnpage__status-drop-row--active' : ''}`}
                            onClick={() => { setStatusFilter(s); setStatusDropOpen(false); }}
                          >
                            <StatusBadge status={s} />
                          </div>
                        ))}
                      </div>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr
                    key={row.id + i}
                    className={`txnpage__row ${invoiceTxn?.id === row.id ? 'txnpage__row--active' : ''}`}
                    onClick={() => handleRowClick(row)}
                    style={{
                      cursor: (activeTab === 'Pending' || activeTab === 'Completed') ? 'pointer' : 'default',
                    }}
                  >
                    <td className="txnpage__td--id">{row.id}</td>
                    <td>{row.customer}</td>
                    <td>{row.date}</td>
                    {isCompleted && <td>{row.method}</td>}
                    {isCompleted && (
                      <td>
                        <div className="txnpage__ref-num">{row.ref}</div>
                        <div className="txnpage__ref-date">{row.refDate}</div>
                      </td>
                    )}
                    <td>{formatCurrency(row.total)}</td>
                    <td><StatusBadge status={row.status} /></td>
                  </tr>
                ))}
                {tableData.length === 0 && (
                  <tr>
                    <td
                      colSpan={isCompleted ? 7 : 5}
                      style={{ textAlign: 'center', padding: '32px 16px', color: 'rgba(0,0,0,0.35)', fontSize: 13 }}
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
 
        {showInvoice && (
          <div className="txnpage__invoice-wrap">
            <InvoicePanel
              txn={invoiceTxn}
              onReturn={() => setReturnModal(invoiceTxn)}
            />
          </div>
        )}
      </div>
 
      {showInvoice && (
        <div className="txnpage__invoice-footer-bar">
          <button
            className="txnpage__footer-return-btn"
            onClick={() => setInvoiceTxn(null)}
          >
            Return
          </button>
        </div>
      )}
 
      {/* ── Modals ── */}
      {paymentModal && (
        <PaymentModal
          txn={paymentModal}
          onClose={() => setPaymentModal(null)}
          onConfirm={() => setPaymentModal(null)}
        />
      )}
      {shipmentModal && (
        <ShipmentModal
          txn={shipmentModal}
          onClose={() => setShipmentModal(null)}
          onConfirm={handleShipmentConfirm}
        />
      )}
      {returnModal && (
        <ReturnModal txn={returnModal} onClose={() => setReturnModal(null)} />
      )}
    </div>
  );
}