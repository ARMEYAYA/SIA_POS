import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from './Topbar';
import './Transaction.css';

const TAB_STATUSES = {
  Pending:   ['reserved', 'overdue'],
  Completed: ['to ship', 'shipped out', 'completed'],
  Cancelled: [],
  Return:    ['returning', 'exchanged', 'reshipped', 'return'],
};

const PENDING_DATA = [
  { id: 'TXN-100245', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, method: 'Metro Bank - CARD',  status: 'overdue'  },
  { id: 'TXN-100246', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, method: 'Union Bank - CARD',  status: 'reserved' },
  { id: 'TXN-100247', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, method: 'Union Bank - CARD',  status: 'reserved' },
  { id: 'TXN-100248', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, method: 'Cash',               status: 'reserved' },
  { id: 'TXN-100249', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, method: 'Gcash - Epayment',   status: 'reserved' },
  { id: 'TXN-100250', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, method: 'Union Bank - CARD',  status: 'overdue'  },
  { id: 'TXN-100251', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, method: 'Union Bank - CARD',  status: 'reserved' },
  { id: 'TXN-100252', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, method: 'Gcash - Epayment',   status: 'overdue'  },
  { id: 'TXN-100253', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, method: 'Cash',               status: 'reserved' },
];

const COMPLETED_DATA = [
  { id: 'TXN-100245', customer: 'Angel Vargas',         date: '03/10/2026 4:00 PM', method: 'Union Bank - CARD', ref: '1738499484733673', refDate: '02/10/11 - 20:00PM', total: 20000, status: 'to ship'    },
  { id: 'TXN-100246', customer: 'Hanni Pham',           date: '03/10/2026 4:00 PM', method: 'Union Bank - CARD', ref: '1738499484733673', refDate: '02/10/11 - 20:00PM', total: 20000, status: 'to ship'    },
  { id: 'TXN-100247', customer: 'Mark Lee',             date: '03/10/2026 4:00 PM', method: 'Union Bank - CARD', ref: '1738499484733673', refDate: '02/10/11 - 20:00PM', total: 20000, status: 'to ship'    },
  { id: 'TXN-100248', customer: 'Minji Kim',            date: '03/10/2026 4:00 PM', method: 'Cash',              ref: 'Cash',             refDate: '02/10/11 - 20:00PM', total: 20000, status: 'to ship'    },
  { id: 'TXN-100249', customer: 'Danna Dela Cruz',      date: '03/10/2026 4:00 PM', method: 'Gcash - Epayment',  ref: '1738499484733673', refDate: '02/10/11 - 20:00PM', total: 20000, status: 'shipped out' },
  { id: 'TXN-100250', customer: 'Hean Aether Delacruz', date: '03/10/2026 4:00 PM', method: 'Union Bank - CARD', ref: '1738499484733673', refDate: '02/10/11 - 20:00PM', total: 20000, status: 'shipped out' },
  { id: 'TXN-100251', customer: 'Hean Aether Delacruz', date: '03/10/2026 4:00 PM', method: 'Union Bank - CARD', ref: '1738499484733673', refDate: '02/10/11 - 20:00PM', total: 20000, status: 'completed'   },
  { id: 'TXN-100252', customer: 'Hean Aether Delacruz', date: '03/10/2026 4:00 PM', method: 'Union Bank - CARD', ref: '1738499484733673', refDate: '02/10/11 - 20:00PM', total: 20000, status: 'completed'   },
  { id: 'TXN-100253', customer: 'Hean Aether Delacruz', date: '03/10/2026 4:00 PM', method: 'Union Bank - CARD', ref: '1738499484733673', refDate: '02/10/11 - 20:00PM', total: 20000, status: 'completed'   },
];

const CANCELLED_DATA = [
  { id: 'TXN-100245', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, method: 'Union Bank - CARD', status: 'cancelled' },
  { id: 'TXN-100246', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, method: 'Union Bank - CARD', status: 'cancelled' },
  { id: 'TXN-100247', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, method: 'Cash',              status: 'cancelled' },
  { id: 'TXN-100248', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, method: 'Gcash - Epayment',  status: 'cancelled' },
  { id: 'TXN-100249', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, method: 'Union Bank - CARD', status: 'cancelled' },
  { id: 'TXN-100250', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, method: 'Union Bank - CARD', status: 'cancelled' },
  { id: 'TXN-100251', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, method: 'Union Bank - CARD', status: 'cancelled' },
  { id: 'TXN-100252', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, method: 'Gcash - Epayment',  status: 'cancelled' },
  { id: 'TXN-100253', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, method: 'Cash',              status: 'cancelled' },
];

const RETURN_DATA = [
  { id: 'TXN-100245', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, returnQty: '8 pack',   reason: 'Defective',          status: 'return'    },
  { id: 'TXN-100246', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, returnQty: '2 pieces', reason: 'Wrong Item Received', status: 'return'    },
  { id: 'TXN-100247', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, returnQty: '2 pieces', reason: 'Wrong Size',          status: 'exchanged' },
  { id: 'TXN-100248', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, returnQty: '2 pieces', reason: 'Size Adjustment',     status: 'exchanged' },
  { id: 'TXN-100249', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, returnQty: '8 pack',   reason: 'Defective',          status: 'returning' },
  { id: 'TXN-100250', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, returnQty: '8 pack',   reason: 'Wrong Size',          status: 'reshipped' },
  { id: 'TXN-100251', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, returnQty: '2 pieces', reason: 'Wrong Size',          status: 'returning' },
  { id: 'TXN-100252', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, returnQty: '2 pieces', reason: 'Size Adjustment',     status: 'returning' },
  { id: 'TXN-100253', customer: 'Hean Aether Delacruz', date: '03/10/2026 - 4:00 PM', total: 20000, returnQty: '2 pieces', reason: 'Defective',          status: 'reshipped' },
];

const INVOICE_ITEMS = [
  { name: 'Kiddiesaurs Pajama Set',  code: 'KJPS001', size: 100, qty: 15, unitPrice: 145, pricePerPack: 725,  tax: 0, discount: 0, amount: 10875 },
  { name: 'Sunny Day Twirl Dress',   code: 'SDTD002', size: 100, qty: 3,  unitPrice: 245, pricePerPack: 1470, tax: 0, discount: 0, amount: 4410  },
  { name: 'Rainbow Snuggle Pajamas', code: 'RSP003',  size: 100, qty: 3,  unitPrice: 315, pricePerPack: 1890, tax: 0, discount: 0, amount: 5670  },
  { name: 'Tiny Trendsetter OOTD',   code: 'TTO004',  size: 100, qty: 2,  unitPrice: 210, pricePerPack: 1260, tax: 0, discount: 0, amount: 2520  },
  { name: "Lil' Sunshine Casual",    code: 'LSC005',  size: 100, qty: 2,  unitPrice: 240, pricePerPack: 960,  tax: 0, discount: 0, amount: 1920  },
  { name: 'Sweet Bunny Pajama Set',  code: 'SBP006',  size: 100, qty: 3,  unitPrice: 205, pricePerPack: 1230, tax: 0, discount: 0, amount: 3690  },
  { name: 'Tiny Explorer Outfit',    code: 'TEO007',  size: 100, qty: 2,  unitPrice: 255, pricePerPack: 1530, tax: 0, discount: 0, amount: 3060  },
];

const STATUS_META = {
  reserved:      { label: 'reserved',    bg: 'rgba(253,230,138,0.25)', border: 'rgba(253,230,138,0.63)', dot: '#FDE68A' },
  overdue:       { label: 'overdue',     bg: 'rgba(252,165,165,0.25)', border: 'rgba(252,165,165,0.66)', dot: '#FCA5A5' },
  'to ship':     { label: 'to ship',     bg: 'rgba(147,197,253,0.25)', border: 'rgba(147,197,253,0.66)', dot: '#93C5FD' },
  'shipped out': { label: 'shipped out', bg: 'rgba(196,181,253,0.25)', border: 'rgba(196,181,253,0.66)', dot: '#C4B5FD' },
  completed:     { label: 'completed',   bg: 'rgba(112,233,90,0.25)',  border: 'rgba(112,233,90,0.66)',  dot: '#70E95A' },
  cancelled:     { label: 'cancelled',   bg: 'rgba(153,2,20,0.25)',    border: '#990214',                dot: '#990214' },
  returning:     { label: 'returning',   bg: 'rgba(139,69,19,0.25)',   border: 'rgba(139,69,19,0.66)',   dot: '#8B4513' },
  exchanged:     { label: 'exchanged',   bg: 'rgba(128,128,128,0.25)', border: 'rgba(128,128,128,0.66)', dot: '#808080' },
  reshipped:     { label: 'reshipped',   bg: 'rgba(0,128,128,0.25)',   border: 'rgba(0,128,128,0.66)',   dot: '#008080' },
  return:        { label: 'return',      bg: 'rgba(64,224,208,0.25)',  border: 'rgba(64,224,208,0.66)',  dot: '#40E0D0' },
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
  const rows = items.map((item) => `<tr>
    <td><div style="font-weight:700;font-size:9px">${item.name}</div><div style="font-size:7px;color:rgba(0,0,0,0.45)">ITEM CODE Size ${item.size}</div></td>
    <td>${item.qty}</td><td>P ${item.unitPrice.toLocaleString()}.OO</td>
    <td>P ${item.pricePerPack.toLocaleString()}.OO</td>
    <td>${item.tax}</td><td>${item.discount}</td>
    <td>P ${item.amount.toLocaleString()}.OO</td></tr>`).join('');
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Invoice</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;font-size:10px;padding:28px}
.hdr{display:flex;justify-content:space-between;margin-bottom:14px;padding-bottom:12px;border-bottom:1.5px solid #8B333D}
.brand{font-weight:800;font-size:18px;color:#8B333D;margin-bottom:6px}.addr{font-size:8px;color:rgba(0,0,0,0.5);line-height:1.6}
.inv-title{font-size:26px;font-weight:700;color:rgba(0,0,0,0.3);text-align:right}
.meta{font-size:9px;text-align:right;line-height:1.8}table{width:100%;border-collapse:collapse;font-size:9px;margin-bottom:14px}
thead tr{background:#FFF28D}th{padding:6px 8px;font-weight:700;text-align:left;border-bottom:1px solid #ddd}
td{padding:6px 8px;border-bottom:1px solid rgba(0,0,0,0.05);vertical-align:top}
.footer{text-align:center;font-size:7px;color:rgba(0,0,0,0.4);border-top:1px solid #eee;padding-top:10px;margin-top:16px}
@media print{html,body{height:auto}}</style></head>
<body><div class="hdr"><div><div class="brand">LOVE ATHALIA</div>
<div class="addr">Blk 15 Lot 4 Ph 4 Pkg 2 Barangay 176 Bagong Silang 1400<br/>City of Caloocan NCR, Third District Philippines<br/>Shane Anne C. Gapas - Prop.<br/>Non VAT- Reg Tin: 425-464-696-000000</div></div>
<div><div class="inv-title">INVOICE</div>
<div class="meta"><b>Invoice no:</b> PJM-1100192-79<br/><b>Date Issued:</b> 03/20/2026 - 9:19 PM<br/><b>Ref:</b> BC 8888888888</div></div></div>
<p style="font-weight:700;font-size:11px;margin-bottom:8px">Order Details:</p>
<table><thead><tr><th>Item</th><th>Qty</th><th>Unit Price</th><th>Price/Pack</th><th>Tax</th><th>Discount</th><th>Amount</th></tr></thead>
<tbody>${rows}</tbody></table>
<div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;margin-bottom:14px">
<div style="display:flex;gap:20px;font-size:9px"><span style="font-weight:600;min-width:80px;text-align:right">Sub Total:</span><span>P ${subTotal.toLocaleString()}.00</span></div>
<div style="display:flex;gap:20px;font-size:9px"><span style="font-weight:600;min-width:80px;text-align:right">Vat Tax:</span><span>P 0.00</span></div>
<div style="display:flex;gap:20px;font-size:12px;font-weight:800;color:#8B333D"><span>Total Amount:</span><span>P ${subTotal.toLocaleString()}.00</span></div></div>
<div class="footer">BIR Permit No. OCN 027 AU2024000002225</div></body></html>`;
}

function CustomerInfoPanel({ txn, onConfirmPayment, onClose, onEdit, readOnly = false }) {
  const subTotal = INVOICE_ITEMS.reduce((s, i) => s + i.amount, 0);
  return (
    <div className="custinfo">
      <button className="panel__close-x" onClick={onClose} title="Close">
        <span className="material-icons" style={{ fontSize: 16 }}>close</span>
      </button>

      <div className="custinfo__scroll-body">
        <h2 className="custinfo__title">Customer Information</h2>

        <div className="custinfo__meta-section">
          <div className="custinfo__meta-row">
            <span className="custinfo__label">Transaction ID:</span>
            <span className="custinfo__value custinfo__value--muted">{txn?.id}</span>
            <span className="custinfo__label" style={{ marginLeft: 'auto' }}>Date of order:</span>
            <span className="custinfo__value custinfo__value--muted">{txn?.date}</span>
          </div>
          <div className="custinfo__meta-row">
            <span className="custinfo__label">Customer Name:</span>
            <span className="custinfo__value">{txn?.customer}</span>
          </div>
          <div className="custinfo__meta-row">
            <span className="custinfo__label">Payment Method:</span>
            <span className="custinfo__value">{txn?.method}</span>
          </div>
          {readOnly && (
            <div className="custinfo__meta-row">
              <span className="custinfo__label">Status:</span>
              <span><StatusBadge status={txn?.status} /></span>
            </div>
          )}
        </div>

        <h3 className="custinfo__section-title">Order Details</h3>
        <div className="custinfo__items-list">
          {INVOICE_ITEMS.map((item, i) => (
            <div key={i} className="custinfo__item-card">
              <div className="custinfo__item-img" />
              <div className="custinfo__item-info">
                <div className="custinfo__item-name">{item.name}</div>
                <div className="custinfo__item-sub">M / Size {item.size}</div>
                <div className="custinfo__item-footer">
                  <span className="custinfo__item-unit-price">P {item.unitPrice.toLocaleString()}.00</span>
                  <span className="custinfo__item-qty">{item.qty} pack</span>
                </div>
              </div>
              <div className="custinfo__item-amount">P {item.amount.toLocaleString()}.00</div>
            </div>
          ))}
        </div>

        <h3 className="custinfo__section-title">Order Summary</h3>
        <div className="custinfo__summary-box">
          <div className="custinfo__sum-row"><span>Sub Total</span><span>P{subTotal.toLocaleString()}.00</span></div>
          <div className="custinfo__sum-row"><span>Tax</span><span>P0.00</span></div>
          <div className="custinfo__sum-row"><span>Discount</span><span>P0.00</span></div>
          <div className="custinfo__sum-divider" />
          <div className="custinfo__sum-total-row">
            <span className="custinfo__sum-total-label">TOTAL AMOUNT</span>
            <span className="custinfo__sum-total-val">P {subTotal.toLocaleString()}.00</span>
          </div>
        </div>
      </div>

      {!readOnly && (
        <div className="custinfo__actions">
          <button className="custinfo__btn--edit" onClick={onEdit}>edit</button>
          <button className="custinfo__btn--confirm" onClick={onConfirmPayment}>Confirm Payment</button>
        </div>
      )}
    </div>
  );
}

function InvoicePanel({ txn, onReturn, onConfirmShipment, onClose, isReturnMode = false, onReturnProduct, onReshipProduct }) {
  const subTotal = INVOICE_ITEMS.reduce((s, i) => s + i.amount, 0);

  const canReturn        = !isReturnMode && (txn?.status === 'shipped out' || txn?.status === 'completed');
  const canShip          = !isReturnMode && txn?.status === 'to ship';
  const canReturnProduct = isReturnMode  && txn?.status === 'returning';
  const canReshipProduct = isReturnMode  && txn?.status === 'reshipped';

  const handlePrint = () => {
    const html = generateInvoicePrintHTML(txn, INVOICE_ITEMS);
    const pw = window.open('', '_blank', 'width=900,height=750');
    if (!pw) { alert('Pop-up blocked.'); return; }
    pw.document.write(html); pw.document.close();
    pw.onload = () => { pw.focus(); pw.print(); };
  };

  const handleDownload = () => {
    const html = generateInvoicePrintHTML(txn, INVOICE_ITEMS);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `invoice-${txn?.id || 'PJM'}.html`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  return (
    <div className="invoice">
      <button className="panel__close-x" onClick={onClose} title="Close">
        <span className="material-icons" style={{ fontSize: 16 }}>close</span>
      </button>

      <div className="invoice__scroll-body">
        <div className="invoice__head">
          <div className="invoice__logo-wrap">
            <img src="/images/logo.png" alt="Love Athalia" className="invoice__logo" onError={(e) => (e.target.style.display = 'none')} />
          </div>
          <div className="invoice__head-right">
            <p className="invoice__title-text">INVOICE</p>
            <div className="invoice__meta-row"><span className="invoice__meta-label">Invoice no:</span><span className="invoice__meta-val">PJM-1100192-79</span></div>
            <div className="invoice__meta-row"><span className="invoice__meta-label">Date Issued:</span><span className="invoice__meta-val" style={{ color: 'rgba(0,0,0,0.51)' }}>03/20/2026 - 9:19 PM</span></div>
            <div className="invoice__meta-row"><span className="invoice__meta-label">Ref:</span><span className="invoice__meta-val" style={{ color: 'rgba(0,0,0,0.51)' }}>BC 8888888888</span></div>
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
            <span className="invoice__cust-label invoice__cust-label--sm">Transaction ID:</span>
            <span className="invoice__cust-val invoice__cust-val--sm">{txn?.id || 'ORD0001'}</span>
            <span className="invoice__cust-label invoice__cust-label--sm" style={{ marginLeft: 10 }}>Payment Method:</span>
            <span className="invoice__cust-val invoice__cust-val--sm">{txn?.method || 'Union Bank - CARD'}</span>
          </div>
          <div className="invoice__customer-row">
            <span className="invoice__cust-label invoice__cust-label--sm">Date Order:</span>
            <span className="invoice__cust-val invoice__cust-val--sm" style={{ color: 'rgba(0,0,0,0.55)' }}>{txn?.date || '03/10/2026 4:00 PM'}</span>
            {!isReturnMode && <>
              <span className="invoice__cust-label invoice__cust-label--sm" style={{ marginLeft: 10 }}>Payment Reference:</span>
              <span className="invoice__cust-val invoice__cust-val--sm">{txn?.ref || '—'}</span>
            </>}
          </div>
        </div>

        <p className="invoice__section-label">{isReturnMode ? 'Return Order Details:' : 'Order Details:'}</p>

        <div className="invoice__items-scroll">
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
            <span style={{ color: '#8B333D' }}>P {subTotal.toLocaleString()}.00</span>
          </div>
        </div>

        <div className="invoice__footer-logo">
          <img src="/images/logo.png" alt="" style={{ height: 24 }} onError={(e) => (e.target.style.display = 'none')} />
        </div>
        <p className="invoice__bir">BIR Permit No. OCN 027 AU2024000002225</p>
      </div>

      <div className="invoice__actions">
        {canReturn        && <button className="invoice__act-btn invoice__act-btn--return"         onClick={onReturn}>Return</button>}
        {canShip          && <button className="invoice__act-btn invoice__act-btn--ship"           onClick={onConfirmShipment}><span className="material-icons" style={{ fontSize: 15, marginRight: 4 }}>local_shipping</span>Confirm Shipment</button>}
        {canReturnProduct && <button className="invoice__act-btn invoice__act-btn--return-product" onClick={onReturnProduct}>Return Product</button>}
        {canReshipProduct && <button className="invoice__act-btn invoice__act-btn--reship-product" onClick={onReshipProduct}>Reshipped Product</button>}
        <button className="invoice__act-btn invoice__act-btn--download" onClick={handleDownload}><span className="material-icons" style={{ fontSize: 18 }}>download</span></button>
        <button className="invoice__act-btn invoice__act-btn--print"    onClick={handlePrint}><span className="material-icons" style={{ fontSize: 16, marginRight: 4 }}>print</span>Print</button>
      </div>
    </div>
  );
}

function PaymentModal({ txn, onClose }) {
  const [method, setMethod] = useState(txn?.method || '');
  const [ref,    setRef]    = useState('');
  const [success, setSuccess] = useState(false);
  if (success) return <div className="modal-overlay"><div className="modal modal--success">
    <div className="success__circle"><span className="material-icons success__check">check</span></div>
    <h2 className="success__title">Payment Confirmed!</h2>
    <p className="success__desc">Payment successfully recorded.</p>
    <button className="modal__btn modal__btn--primary" style={{ marginTop: 16 }} onClick={onClose}>Done</button>
  </div></div>;
  return <div className="modal-overlay"><div className="modal modal--payment">
    <h2 className="modal__title">Payment Confirmation</h2>
    <p className="modal__desc">If you already have your reference number, kindly input it below.</p>
    <div className="modal__field">
      <label className="modal__field-label">Payment Method:</label>
      <div className="modal__select-wrap">
        <select className="modal__select" value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="">Select Payment Method</option>
          <option value="Union Bank - CARD">Union Bank - CARD</option>
          <option value="GCASH">GCASH</option>
          <option value="CASH">CASH</option>
        </select>
      </div>
    </div>
    <input className="modal__input" placeholder="Enter Payment Reference Number to confirm your transaction." value={ref} onChange={(e) => setRef(e.target.value)} />
    <div className="modal__actions">
      <button className="modal__btn modal__btn--cancel" onClick={onClose}>cancel</button>
      <button className="modal__btn modal__btn--primary" onClick={() => setSuccess(true)} disabled={!ref.trim() || !method}>Confirm Payment</button>
    </div>
  </div></div>;
}

function ShipmentModal({ onClose, onConfirm }) {
  const [method, setMethod] = useState('');
  const [courier, setCourier] = useState('');
  return <div className="modal-overlay"><div className="modal modal--shipment">
    <h2 className="modal__title">Confirm Shipment</h2>
    <p className="modal__desc">Please select the Shipment Method to proceed.</p>
    <div className="shipment__field"><label className="shipment__label">Shipment Method:</label>
      <div className="shipment__select-wrap"><select className="shipment__select" value={method} onChange={(e) => setMethod(e.target.value)}>
        <option value="">Delivery</option><option value="pickup">Pick-up</option><option value="delivery">Delivery</option>
      </select></div></div>
    <div className="shipment__field"><label className="shipment__label">Delivery Courier</label>
      <div className="shipment__select-wrap"><select className="shipment__select" value={courier} onChange={(e) => setCourier(e.target.value)}>
        <option value="">Shopee Checkout</option><option value="shopee">Shopee Checkout</option>
        <option value="lalamove">Lalamove</option><option value="jnt">J&T Express</option>
      </select></div></div>
    <div className="modal__actions">
      <button className="modal__btn modal__btn--cancel" onClick={onClose}>Cancel</button>
      <button className="modal__btn modal__btn--primary" onClick={() => onConfirm({ method, courier })}>Confirm Shipment</button>
    </div>
  </div></div>;
}

function ReturnShipmentModal({ onClose }) {
  const [courier, setCourier] = useState('');
  const [trackingNo, setTrackingNo] = useState('');
  const [success, setSuccess] = useState(false);
  if (success) return <div className="modal-overlay"><div className="modal modal--success">
    <div className="success__circle"><span className="material-icons success__check">check</span></div>
    <h2 className="success__title">Return Shipment Submitted!</h2>
    <p className="success__desc">The return shipment has been successfully recorded</p>
    <button className="modal__btn modal__btn--primary" style={{ marginTop: 16 }} onClick={onClose}>Done</button>
  </div></div>;
  return <div className="modal-overlay"><div className="modal modal--shipment">
    <h2 className="modal__title">Confirm Return Shipment</h2>
    <p className="modal__desc">Please enter the return tracking number to proceed.</p>
    <div className="shipment__field"><label className="shipment__label">Delivery Courier</label>
      <div className="shipment__select-wrap"><select className="shipment__select" value={courier} onChange={(e) => setCourier(e.target.value)}>
        <option value="">Shopee Checkout</option><option value="shopee">Shopee Checkout</option>
        <option value="lalamove">Lalamove</option><option value="jnt">J&T Express</option>
      </select></div></div>
    <div className="shipment__field"><label className="shipment__label">Tracking Number</label>
      <input className="shipment__input" placeholder="Enter Tracking Number to confirm return product" value={trackingNo} onChange={(e) => setTrackingNo(e.target.value)} />
    </div>
    <div className="modal__actions">
      <button className="modal__btn modal__btn--cancel" onClick={onClose}>cancel</button>
      <button className="modal__btn modal__btn--primary" onClick={() => setSuccess(true)} disabled={!trackingNo.trim()}>Confirm Return Tracking</button>
    </div>
  </div></div>;
}

function ReshipmentModal({ onClose }) {
  const [method, setMethod] = useState('');
  const [courier, setCourier] = useState('');
  const [success, setSuccess] = useState(false);
  if (success) return <div className="modal-overlay"><div className="modal modal--success">
    <div className="success__circle"><span className="material-icons success__check">check</span></div>
    <h2 className="success__title">Reshipment Submitted!</h2>
    <p className="success__desc">The Reshipment has been successfully recorded</p>
    <button className="modal__btn modal__btn--primary" style={{ marginTop: 16 }} onClick={onClose}>Done</button>
  </div></div>;
  return <div className="modal-overlay"><div className="modal modal--shipment">
    <h2 className="modal__title">Confirm Reshipment</h2>
    <p className="modal__desc">Please select the Shipment Method to proceed.</p>
    <div className="shipment__field"><label className="shipment__label">Shipment Method:</label>
      <div className="shipment__select-wrap"><select className="shipment__select" value={method} onChange={(e) => setMethod(e.target.value)}>
        <option value="">Delivery</option><option value="pickup">Pick-up</option><option value="delivery">Delivery</option>
      </select></div></div>
    <div className="shipment__field"><label className="shipment__label">Delivery Courier</label>
      <div className="shipment__select-wrap"><select className="shipment__select" value={courier} onChange={(e) => setCourier(e.target.value)}>
        <option value="">Shopee Checkout</option><option value="shopee">Shopee Checkout</option>
        <option value="lalamove">Lalamove</option><option value="jnt">J&T Express</option>
      </select></div></div>
    <div className="modal__actions">
      <button className="modal__btn modal__btn--cancel" onClick={onClose}>Cancel</button>
      <button className="modal__btn modal__btn--primary" onClick={() => setSuccess(true)}>Confirm Reshipment</button>
    </div>
  </div></div>;
}

function ReturnModal({ txn, onClose }) {
  const [step, setStep]             = useState('form');
  const [returnType, setReturnType] = useState('return');
  const [product, setProduct]       = useState('');
  const [qty, setQty]               = useState('');
  const [reason, setReason]         = useState('');
  const [returnItems, setReturnItems] = useState([]);

  const PRODUCTS = {
    p1: { name: 'Kiddiesaurs Pajama Set',  size: 100, price: 145 },
    p2: { name: 'Sunny Day Twirl Dress',   size: 100, price: 245 },
    p3: { name: 'Rainbow Snuggle Pajamas', size: 100, price: 315 },
    p4: { name: 'Tiny Trendsetter OOTD',   size: 100, price: 210 },
    p5: { name: "Lil' Sunshine Casual",    size: 100, price: 240 },
  };
  const REASONS = { wrong: 'Wrong Item', defective: 'Defective', size: 'Wrong Size' };

  const handleAdd = () => {
    if (!product || !qty || !reason) return;
    const p = PRODUCTS[product];
    setReturnItems(prev => [...prev, {
      id: `RP-${String(prev.length + 1).padStart(3, '0')}`,
      name: p.name, size: p.size, amount: p.price,
      returnQty: `${qty} pack`, reason: REASONS[reason],
    }]);
    setProduct(''); setQty(''); setReason('');
  };

  if (step === 'success') return <div className="modal-overlay"><div className="modal modal--success">
    <div className="success__circle"><span className="material-icons success__check">check</span></div>
    <h2 className="success__title">Return Submitted!</h2>
    <p className="success__desc">The return request has been successfully recorded</p>
    <button className="modal__btn modal__btn--primary" style={{ marginTop: 16 }} onClick={onClose}>Done</button>
  </div></div>;

  if (step === 'confirm') return (
    <div className="modal-overlay">
      <div className="modal modal--return modal--return-lg">
        <button className="modal__close" onClick={onClose}><span className="material-icons">close</span></button>
        <h2 className="return__title">Return &amp; Exchange</h2>
        <p className="return__verify-note">Please verify the product details before confirming the return.</p>
        <div className="return__info-grid">
          <div className="return__info-row"><span className="return__info-label">Transaction No:</span><span className="return__info-value">{txn?.id || 'ORD0001'}</span></div>
          <div className="return__info-row return__info-row--right"><span className="return__info-label">Invoice No:</span><span className="return__info-value" style={{ color: '#8B333D' }}>PJM-1100192-79</span></div>
          <div className="return__info-row"><span className="return__info-label">Customer Name:</span><span className="return__info-value">{txn?.customer || 'Hean Aether Dela Cruz'}</span></div>
          <div className="return__info-row return__info-row--right"><span className="return__info-label">Date of Order:</span><span className="return__info-value">{txn?.date || '03/10/2026 4:00 PM'}</span></div>
        </div>
        <h3 className="return__section-title">Return Details:</h3>
        <div className="return__table-wrap">
          <table className="return__table">
            <thead><tr className="return__thead-row">
              <th>Product ID</th><th>Product Name</th><th>Size</th><th>Amount</th><th>Return Quantity</th><th>Reason</th>
            </tr></thead>
            <tbody>
              {returnItems.length === 0
                ? <tr><td colSpan={6} className="return__empty">No return items added yet</td></tr>
                : returnItems.map((item) => (
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
          <button className="modal__btn modal__btn--primary" onClick={() => setStep('success')} disabled={returnItems.length === 0}>Confirm Return</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal modal--return modal--return-lg">
        <button className="modal__close" onClick={onClose}><span className="material-icons">close</span></button>
        <h2 className="return__title">Return &amp; Exchange</h2>
        <div className="return__info-grid">
          <div className="return__info-row"><span className="return__info-label">Transaction No:</span><span className="return__info-value">{txn?.id || 'ORD0001'}</span></div>
          <div className="return__info-row return__info-row--right"><span className="return__info-label">Invoice No:</span><span className="return__info-value" style={{ color: '#8B333D' }}>PJM-1100192-79</span></div>
          <div className="return__info-row"><span className="return__info-label">Customer Name:</span><span className="return__info-value">{txn?.customer || 'Hean Aether Dela Cruz'}</span></div>
          <div className="return__info-row return__info-row--right"><span className="return__info-label">Date of Order:</span><span className="return__info-value">{txn?.date || '03/10/2026 4:00 PM'}</span></div>
        </div>

        <h3 className="return__section-title">Return Product</h3>

        <div className="return__product-row">
          <div className="return__product-col">
            <label className="return__form-label">Product:</label>
            <div className="return__select-wrap">
              <select className="return__select return__select--product" value={product} onChange={(e) => setProduct(e.target.value)}>
                <option value="">Select Return Product</option>
                <option value="p1">Kiddiesaurs Pajama Set</option>
                <option value="p2">Sunny Day Twirl Dress</option>
                <option value="p3">Rainbow Snuggle Pajamas</option>
                <option value="p4">Tiny Trendsetter OOTD</option>
                <option value="p5">Lil' Sunshine Casual</option>
              </select>
            </div>
          </div>
          <div className="return__type-col">
            <label className="return__type-option">
              <input type="radio" name="returnType" value="return" checked={returnType === 'return'} onChange={() => setReturnType('return')} className="return__type-radio" />
              <span className="return__type-label">Return Product</span>
            </label>
            <label className="return__type-option">
              <input type="radio" name="returnType" value="exchange" checked={returnType === 'exchange'} onChange={() => setReturnType('exchange')} className="return__type-radio" />
              <span className="return__type-label">Exchanged Product</span>
            </label>
          </div>
        </div>

        <div className="return__qty-reason-row">
          <div className="return__form-group">
            <label className="return__form-label">Quantity:</label>
            <div className="return__select-wrap">
              <select className="return__select" value={qty} onChange={(e) => setQty(e.target.value)}>
                <option value="">Select Return Quantity</option>
                <option value="1">1</option><option value="2">2 pack</option><option value="3">3</option>
              </select>
            </div>
          </div>
          <div className="return__form-group">
            <label className="return__form-label">Reason:</label>
            <div className="return__select-wrap">
              <select className="return__select" value={reason} onChange={(e) => setReason(e.target.value)}>
                <option value="">Select Reason</option>
                <option value="wrong">Wrong Item</option><option value="defective">Defective</option><option value="size">Wrong Size</option>
              </select>
            </div>
          </div>
        </div>

        <div className="return__add-row">
          <button className="return__add-btn" onClick={handleAdd} disabled={!product || !qty || !reason}>
            Add Return Product
          </button>
        </div>

        <h3 className="return__section-title">Return Details:</h3>
        <div className="return__table-wrap">
          <table className="return__table">
            <thead><tr className="return__thead-row">
              <th>Product ID</th><th>Product Name</th><th>Size</th><th>Amount</th><th>Return Quantity</th><th>Reason</th>
            </tr></thead>
            <tbody>
              {returnItems.length === 0
                ? <tr><td colSpan={6} className="return__empty">No return items added yet</td></tr>
                : returnItems.map((item) => (
                    <tr key={item.id} className="return__row">
                      <td>{item.id}</td><td>{item.name}</td><td>{item.size}</td>
                      <td>{item.amount}</td><td>{item.returnQty}</td><td>{item.reason}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        <div className="modal__actions" style={{ marginTop: 16 }}>
          <button className="modal__btn modal__btn--cancel" onClick={onClose}>Discard</button>
          <button className="modal__btn modal__btn--primary" onClick={() => setStep('confirm')} disabled={returnItems.length === 0}>Submit Return</button>
        </div>
      </div>
    </div>
  );
}

export default function TransactionPage() {
  const TABS = ['Pending', 'Completed', 'Cancelled', 'Return'];
  const navigate = useNavigate();

  const [activeTab, setActiveTab]       = useState('Pending');
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusDropOpen, setStatusDropOpen] = useState(false);
  const [dateFrom, setDateFrom]         = useState('');
  const [dateTo, setDateTo]             = useState('');

  const [customerInfoTxn, setCustomerInfoTxn] = useState(null);
  const [invoiceTxn, setInvoiceTxn]           = useState(null);

  const [paymentModal,        setPaymentModal]        = useState(null);
  const [shipmentModal,       setShipmentModal]       = useState(null);
  const [returnModal,         setReturnModal]         = useState(null);
  const [returnShipmentModal, setReturnShipmentModal] = useState(null);
  const [reshipmentModal,     setReshipmentModal]     = useState(null);

  const statusThRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (statusThRef.current && !statusThRef.current.contains(e.target)) setStatusDropOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const rawData = useMemo(() => {
    if (activeTab === 'Pending')   return PENDING_DATA;
    if (activeTab === 'Completed') return COMPLETED_DATA;
    if (activeTab === 'Return')    return RETURN_DATA;
    return CANCELLED_DATA;
  }, [activeTab]);

  const tableData = useMemo(() => {
    let d = rawData.filter((r) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== 'all') d = d.filter((r) => r.status === statusFilter);
    return [...d].sort((a, b) => b.id.localeCompare(a.id));
  }, [rawData, search, statusFilter]);

  const formatCurrency = (n) => '₱ ' + n.toLocaleString('en-PH', { minimumFractionDigits: 2 });

  const isCompleted = activeTab === 'Completed';
  const isPending   = activeTab === 'Pending';
  const isReturn    = activeTab === 'Return';
  const isCancelled = activeTab === 'Cancelled';

  const showCustomerInfo = (isPending || isCancelled) && customerInfoTxn !== null;
  const showInvoice      = (isCompleted || isReturn)  && invoiceTxn      !== null;
  const showSidePanel    = showCustomerInfo || showInvoice;

  const handleTabChange = (tab) => {
    setActiveTab(tab); setStatusFilter('all'); setStatusDropOpen(false);
    setInvoiceTxn(null); setCustomerInfoTxn(null);
  };

  const handleRowClick = (txn) => {
    if (isPending || isCancelled) setCustomerInfoTxn((prev) => (prev?.id === txn.id ? null : txn));
    else if (isCompleted || isReturn) setInvoiceTxn((prev) => (prev?.id === txn.id ? null : txn));
  };

  const colSpan = isCompleted ? 7 : isPending ? 6 : isReturn ? 7 : 5;

  return (
    <div className="txnpage">
      <div className="txnpage__header">
        <div className="txnpage__title-block">
          <h1 className="txnpage__title">TRANSACTION</h1>
          <p className="txnpage__subtitle">Track and manage all customer orders and transaction details.</p>
        </div>
        <Topbar />
      </div>

      <div className="txnpage__controls">
        <div className="txnpage__tabs">
          {TABS.map((tab) => (
            <button key={tab} className={`txnpage__tab ${activeTab === tab ? 'txnpage__tab--active' : ''}`} onClick={() => handleTabChange(tab)}>{tab}</button>
          ))}
        </div>

        <div className="txnpage__toolbar">
          <div className="txnpage__search">
            <span className="material-icons txnpage__search-icon">search</span>
            <input className="txnpage__search-input" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="txnpage__date-filter">
            <span className="material-icons txnpage__date-icon">filter_list</span>
            <span className="txnpage__date-label">Date:</span>
            <input type="text" className="txnpage__date-input" placeholder="From" value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              onFocus={(e) => { e.target.type = 'date'; }}
              onBlur={(e)  => { if (!e.target.value) e.target.type = 'text'; }}
            />
            <span className="txnpage__date-sep">-</span>
            <input type="text" className="txnpage__date-input" placeholder="To" value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              onFocus={(e) => { e.target.type = 'date'; }}
              onBlur={(e)  => { if (!e.target.value) e.target.type = 'text'; }}
            />
          </div>
        </div>
      </div>

      <div className={`txnpage__body ${showSidePanel ? 'txnpage__body--split' : ''}`}>
        <div className="txnpage__card">
          <div className="txnpage__table-wrap">
            <table className="txnpage__table">
              <thead>
                <tr className="txnpage__thead-row">
                  <th>Transaction ID</th>
                  <th>Customer Full Name</th>
                  <th>{isReturn ? 'Date of Return' : 'Date of Order'}</th>
                  {(isPending || isCompleted) && <th>Payment Method</th>}
                  {isCompleted && <th>Payment Reference</th>}
                  <th>Total Amount</th>
                  {isReturn && <th>Return Qty</th>}
                  {isReturn && <th>Reason</th>}
                  <th
                    ref={statusThRef}
                    className="txnpage__th-status"
                    onClick={() => { if (!isCancelled) setStatusDropOpen((v) => !v); }}
                    style={{ cursor: !isCancelled ? 'pointer' : 'default' }}
                  >
                    <span className="txnpage__th-status-inner">
                      Status
                      {!isCancelled && <span className={`material-icons txnpage__th-arrow ${statusDropOpen ? 'txnpage__th-arrow--open' : ''}`}>arrow_drop_down</span>}
                    </span>
                    {statusDropOpen && !isCancelled && (
                      <div className="txnpage__status-drop" onClick={(e) => e.stopPropagation()}>
                        <div className={`txnpage__status-drop-row ${statusFilter === 'all' ? 'txnpage__status-drop-row--active' : ''}`} onClick={() => { setStatusFilter('all'); setStatusDropOpen(false); }}>
                          <span className="txnpage__status-drop-all">All</span>
                        </div>
                        {TAB_STATUSES[activeTab].map((s) => (
                          <div key={s} className={`txnpage__status-drop-row ${statusFilter === s ? 'txnpage__status-drop-row--active' : ''}`} onClick={() => { setStatusFilter(s); setStatusDropOpen(false); }}>
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
                  <tr key={row.id + i}
                    className={`txnpage__row ${(invoiceTxn?.id === row.id || customerInfoTxn?.id === row.id) ? 'txnpage__row--active' : ''}`}
                    onClick={() => handleRowClick(row)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="txnpage__td--id">{row.id}</td>
                    <td>{row.customer}</td>
                    <td>{row.date}</td>
                    {(isPending || isCompleted) && <td>{row.method}</td>}
                    {isCompleted && <td><div className="txnpage__ref-num">{row.ref}</div><div className="txnpage__ref-date">{row.refDate}</div></td>}
                    <td>{formatCurrency(row.total)}</td>
                    {isReturn && <td>{row.returnQty}</td>}
                    {isReturn && <td>{row.reason}</td>}
                    <td><StatusBadge status={row.status} /></td>
                  </tr>
                ))}
                {tableData.length === 0 && (
                  <tr><td colSpan={colSpan} style={{ textAlign: 'center', padding: '32px 16px', color: 'rgba(0,0,0,0.35)', fontSize: 13 }}>No transactions found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showCustomerInfo && (
          <div className="txnpage__invoice-wrap">
            <CustomerInfoPanel txn={customerInfoTxn} onConfirmPayment={() => setPaymentModal(customerInfoTxn)} onClose={() => setCustomerInfoTxn(null)} onEdit={() => navigate('/pos')} readOnly={isCancelled} />
          </div>
        )}

        {showInvoice && (
          <div className="txnpage__invoice-wrap">
            <InvoicePanel txn={invoiceTxn} onReturn={() => setReturnModal(invoiceTxn)} onConfirmShipment={() => setShipmentModal(invoiceTxn)} onClose={() => setInvoiceTxn(null)} isReturnMode={isReturn} onReturnProduct={() => setReturnShipmentModal(invoiceTxn)} onReshipProduct={() => setReshipmentModal(invoiceTxn)} />
          </div>
        )}
      </div>


      {paymentModal        && <PaymentModal        txn={paymentModal}        onClose={() => { setPaymentModal(null); setCustomerInfoTxn(null); }} />}
      {shipmentModal       && <ShipmentModal       txn={shipmentModal}       onClose={() => setShipmentModal(null)}       onConfirm={() => setShipmentModal(null)} />}
      {returnModal         && <ReturnModal         txn={returnModal}         onClose={() => setReturnModal(null)} />}
      {returnShipmentModal && <ReturnShipmentModal txn={returnShipmentModal} onClose={() => { setReturnShipmentModal(null); setInvoiceTxn(null); }} />}
      {reshipmentModal     && <ReshipmentModal                               onClose={() => { setReshipmentModal(null);     setInvoiceTxn(null); }} />}
    </div>
  );
}