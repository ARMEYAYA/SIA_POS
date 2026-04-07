import React, { useState } from 'react';
import Topbar from './Topbar';
import './POS.css';
 
const CATEGORIES = ['All', 'New Arrivals', 'Daily wear', 'OOTD', 'Dresses', 'Sleepwear'];
 
const PRODUCTS = [
  { id: 1, name: "Cute & Comfy Girls' Terno Set", brand: 'Dress Code', price: 1470, img: '/images/pos_terno.jpg', categories: ['All', 'New Arrivals'], types: ['set A', 'set B', 'set C', 'set D', 'set E', 'set F'], sizes: [80, 90, 100, 110, 120, 130, 140, 150, 160, 170], stock: 40, minQty: 4, pcsPerPack: 6 },
  { id: 2, name: 'Playful Everyday Tops', brand: 'Dress Code', price: 1470, img: '/images/pos_tops.jpg', categories: ['All', 'Daily wear'], types: ['set A', 'set B', 'set C', 'set D', 'set E', 'set F'], sizes: [80, 90, 100, 110, 120, 130, 140, 150, 160, 170], stock: 40, minQty: 4, pcsPerPack: 6 },
  { id: 3, name: 'Terno Set Clothes', brand: 'Dress Code', price: 150, img: '/images/product3.jpg', categories: ['All', 'OOTD'], types: ['set A', 'set B', 'set C', 'set D'], sizes: [80, 90, 100, 110, 120, 130, 140, 150, 160, 170], stock: 40, minQty: 4, pcsPerPack: 6 },
  { id: 4, name: 'Better Days Boy Set', brand: 'Dress Code', price: 1750, img: '/images/pos_boyset.jpg', categories: ['All', 'New Arrivals'], types: ['set A', 'set B', 'set C', 'set D', 'set E', 'set F'], sizes: [80, 90, 100, 110, 120, 130, 140, 150, 160, 170], stock: 40, minQty: 4, pcsPerPack: 6 },
];
 
const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};
 
const formatPeso = (n) => 'P ' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });
 
export default function POS() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sels, setSels] = useState(
    Object.fromEntries(PRODUCTS.map((p) => [p.id, { type: p.types[0], qty: p.minQty }]))
  );
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [editMode, setEditMode] = useState(false);
  const [modal, setModal] = useState(null);
  const [paymentRef, setPaymentRef] = useState('');
 
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchCat = activeCategory === 'All' || p.categories.includes(activeCategory);
    const matchSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });
 
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal;
 
  const updateSel = (pid, field, val) =>
    setSels((prev) => ({ ...prev, [pid]: { ...prev[pid], [field]: val } }));
 
  const addToCart = (product) => {
    const sel = sels[product.id];
    const key = `${product.id}_${sel.type}`;
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.key === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + sel.qty };
        return next;
      }
      return [...prev, {
        id: Date.now() + Math.random(),
        key,
        productId: product.id,
        name: product.name,
        img: product.img,
        price: product.price,
        type: sel.type,
        sizes: product.sizes,
        qty: sel.qty,
      }];
    });
  };
 
  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
 
  const updateCartQty = (id, delta) =>
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)));
 
  const handlePlaceOrder = () => {
    if (!customerName.trim()) { setModal('noName'); return; }
    if (cart.length === 0) { setModal('noCart'); return; }
    setModal('confirm');
  };
 
  const handleNewOrder = () => {
    setCart([]); setCustomerName(''); setPaymentMethod('Cash');
    setPaymentRef(''); setEditMode(false); setModal(null);
  };
 
  return (
    <div className="pos">
      <div className="pos__page">
 
        <div className="pos__header">
          <div className="pos__title-block">
            <h1 className="pos__title">ORDER</h1>
            <p className="pos__subtitle">Select products and create orders quickly for a smooth checkout.</p>
          </div>
          <Topbar />
        </div>
 
        <div className="pos__cat-row">
          <div className="pos__cat-bar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`pos__cat-btn${activeCategory === cat ? ' pos__cat-btn--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
 
          <div className="pos__search-wrap">
            <span className="material-icons pos__search-icon">search</span>
            <input
              className="pos__search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
 
        <div className="pos__body">
          <div className="pos__products-area">
            <p className="pos__showing">Showing {filteredProducts.length} items</p>
            <div className="pos__grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  sel={sels[product.id]}
                  onSel={(f, v) => updateSel(product.id, f, v)}
                  onAdd={() => addToCart(product)}
                />
              ))}
            </div>
          </div>
 
          <aside className="pos__panel">
            <div className="pos__panel-scroll">
              <p className="pos__panel-section-title">Customer Information</p>
              <div className="pos__bill-row">
                <span className="pos__bill-label">Bill To:</span>
                <input
                  className={`pos__bill-input${modal === 'noName' ? ' pos__bill-input--err' : ''}`}
                  placeholder="Enter Name"
                  value={customerName}
                  onChange={(e) => { setCustomerName(e.target.value); if (modal === 'noName') setModal(null); }}
                />
              </div>
 
              <div className="pos__panel-hdr">
                <p className="pos__panel-section-title">Order Details</p>
                {cart.length > 0 && (
                  <button className="pos__edit-tag" onClick={() => setEditMode((e) => !e)}>
                    {editMode ? 'Done' : 'Edit'}
                  </button>
                )}
              </div>
 
              {cart.length === 0 && (
                <div className={`pos__cart-empty${modal === 'noCart' ? ' pos__cart-empty--err' : ''}`}>
                  <span className="material-icons">shopping_cart</span>
                  {modal === 'noCart' ? 'Add at least one product before placing an order.' : 'No items added yet'}
                </div>
              )}
 
              <div className="pos__cart">
                {cart.map((item) => (
                  <div key={item.id} className={`pos__cart-item${editMode ? ' pos__cart-item--edit' : ''}`}>
                    <div className="pos__cart-img-wrap">
                      <img src={item.img} alt={item.name} className="pos__cart-img" onError={(e) => (e.target.style.display = 'none')} />
                    </div>
                    <div className="pos__cart-info">
                      <p className="pos__cart-name">{item.name}</p>
                      <p className="pos__cart-variant">
                        {item.type}
                        {item.sizes && item.sizes.length > 0 && (
                          <span className="pos__cart-sizes"> · Sizes: {item.sizes.join(', ')}</span>
                        )}
                      </p>
                      <p className="pos__cart-price">P {item.price.toLocaleString()}.00</p>
                    </div>
                    <div className="pos__cart-right">
                      <div className="pos__mini-stepper">
                        <button onClick={() => updateCartQty(item.id, -1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateCartQty(item.id, 1)}>+</button>
                      </div>
                      <span className="pos__cart-qty-lbl">{item.qty}x</span>
                    </div>
                    {editMode && (
                      <button className="pos__del-btn" onClick={() => removeFromCart(item.id)} title="Remove">
                        <span className="material-icons">delete_outline</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
 
              <p className="pos__panel-section-title pos__panel-section-title--mt">Order Summary</p>
              <div className="pos__summary">
                <div className="pos__sum-row"><span>Sub Total</span><span>{formatPeso(subtotal)}</span></div>
                <div className="pos__sum-row"><span>Tax</span><span>{formatPeso(0)}</span></div>
                <div className="pos__sum-row"><span>Discount</span><span>{formatPeso(0)}</span></div>
                <div className="pos__sum-divider" />
                <div className="pos__sum-total">
                  <span className="pos__sum-total-label">TOTAL AMOUNT</span>
                  <span className="pos__sum-total-val">{formatPeso(total)}</span>
                </div>
              </div>
 
              <p className="pos__panel-section-title">Payment Method</p>
              <div className="pos__pay-btns">
                {[{ id: 'Cash', icon: 'attach_money' }, { id: 'GCash', icon: 'qr_code_scanner' }, { id: 'Union Bank', icon: 'add_card' }].map((pm) => (
                  <button key={pm.id} className={`pos__pay-btn${paymentMethod === pm.id ? ' pos__pay-btn--active' : ''}`} onClick={() => setPaymentMethod(pm.id)}>
                    <span className="material-icons">{pm.icon}</span>
                  </button>
                ))}
              </div>
              <div className="pos__pay-labels">
                <span>Cash</span><span>GCASH</span><span>Union Bank</span>
              </div>
            </div>
 
            <div className="pos__panel-footer">
              <button className="pos__place-order" onClick={handlePlaceOrder}>Place order</button>
            </div>
          </aside>
        </div>
      </div>
 
      {modal === 'noName' && <ValidationModal icon="person_off" iconColor="#BE1300" title="Customer Name Required" message="Please enter the customer's name in the Bill To field before placing an order." onClose={() => setModal(null)} />}
      {modal === 'noCart' && <ValidationModal icon="remove_shopping_cart" iconColor="#BE1300" title="Cart is Empty" message="Please add at least one product to the cart before placing an order." onClose={() => setModal(null)} />}
 
      {modal === 'confirm' && (
        <ConfirmOrderModal customerName={customerName} cart={cart} paymentMethod={paymentMethod} subtotal={subtotal} tax={0} discount={0} total={total} onEdit={() => { setModal(null); setEditMode(true); }} onConfirm={() => setModal('payref')} />
      )}
 
      {modal === 'payref' && (
        <div className="pos__overlay">
          <div className="pos__payref-modal">
            <h2 className="pos__payref-title">Payment Confirmation</h2>
            <p className="pos__payref-sub">If you already have your reference number, kindly input it below. This will be displayed here for your confirmation</p>
            <input className="pos__payref-input" placeholder="Enter Payment Reference Number to confirm your transaction." value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} />
            <div className="pos__payref-actions">
              <button className="pos__payref-confirm-btn" onClick={() => setModal('success')}>Confirm Payment</button>
              <button className="pos__payref-later-btn" onClick={() => setModal('success')}>Later</button>
            </div>
          </div>
        </div>
      )}
 
      {modal === 'success' && (
        <div className="pos__overlay">
          <div className="pos__success-modal">
            <div className="pos__success-circle"><span className="material-icons pos__success-check">check</span></div>
            <h2 className="pos__success-title">Order Successful!</h2>
            <p className="pos__success-desc">Order processed and saved. Sales record updated in reports.</p>
            <button className="pos__success-new-btn" onClick={handleNewOrder}>New Order</button>
          </div>
        </div>
      )}
    </div>
  );
}
 
function ProductCard({ product, sel, onSel, onAdd }) {
  const typeRows = chunk(product.types, 4);
  const sizeRows = chunk(product.sizes, 5);
 
  return (
    <div className="pos__card">
      <div className="pos__card-top">
        <div className="pos__card-img-wrap">
          <img src={product.img} alt={product.name} className="pos__card-img"
            onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.classList.add('pos__card-img-wrap--ph'); }} />
        </div>
        <div className="pos__card-info">
          <p className="pos__card-name">{product.name}</p>
          <p className="pos__card-brand">{product.brand}</p>
 
          <div className="pos__sel-grp">
            <div className="pos__sel-hdr">
              <span className="pos__sel-label">Type / Color</span>
              <span className="pos__sel-stock">Stock: {product.stock}</span>
            </div>
            {typeRows.map((row, ri) => (
              <div key={ri} className="pos__sel-row">
                {row.map((t) => (
                  <button
                    key={t}
                    className={`pos__sel-btn pos__sel-btn--type${sel?.type === t ? ' pos__sel-btn--on' : ''}`}
                    onClick={() => onSel('type', t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            ))}
          </div>
 
          <div className="pos__sel-grp">
            <div className="pos__sel-hdr">
              <span className="pos__sel-label">
                Size
              </span>
              <span className="pos__sel-stock">Stock: {product.stock}</span>
            </div>
            {sizeRows.map((row, ri) => (
              <div key={ri} className="pos__sel-row">
                {row.map((s) => (
                  <span
                    key={s}
                    className="pos__sel-btn pos__sel-btn--size pos__sel-btn--display"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ))}
          </div>
 
          <div className="pos__card-qty-area">
            {product.minQty > 0 && <p className="pos__card-min">minimum of {product.minQty} per order</p>}
            <div className="pos__card-qty-row">
              <span className="pos__card-qty-label">Quantity:</span>
              <div className="pos__card-stepper">
                <button onClick={() => onSel('qty', Math.max(product.minQty, (sel?.qty || product.minQty) - 1))}>−</button>
                <span>{sel?.qty || product.minQty}</span>
                <button onClick={() => onSel('qty', (sel?.qty || product.minQty) + 1)}>+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pos__card-bottom">
        <div className="pos__card-price-block">
          <div className="pos__card-price-row-inner">
            <span className="pos__card-price-sym">P</span>
            <span className="pos__card-price-val">{Number(product.price).toLocaleString()}.00</span>
          </div>
          <div className="pos__card-meta">
            <span className="pos__card-stock-lbl">Stock: {product.stock}</span>
            <span className="pos__card-pcs">{product.pcsPerPack} pcs per pack</span>
          </div>
        </div>
        <button className="pos__card-add-btn" onClick={onAdd}>Add Order</button>
      </div>
    </div>
  );
}
 
function ConfirmOrderModal({ customerName, cart, paymentMethod, subtotal, tax, discount, total, onEdit, onConfirm }) {
  return (
    <div className="pos__overlay">
      <div className="pos__cm">
        <h2 className="pos__cm-title">Customer Information</h2>
        <div className="pos__cm-bill">
          <span className="pos__cm-bill-label">Bill To:</span>
          <div className="pos__cm-bill-val">{customerName}</div>
        </div>
        <h3 className="pos__cm-sec">Order Details</h3>
        <div className="pos__cm-items">
          {cart.map((item) => (
            <div key={item.id} className="pos__cm-item">
              <div className="pos__cm-img-wrap"><img src={item.img} alt={item.name} className="pos__cm-img" onError={(e) => (e.target.style.display = 'none')} /></div>
              <div className="pos__cm-item-info">
                <p className="pos__cm-item-name">{item.name}</p>

                <p className="pos__cm-item-var">
                  {item.type}
                  {item.sizes && item.sizes.length > 0 && ` · Sizes: ${item.sizes.join(', ')}`}
                </p>
                <p className="pos__cm-item-price">P {item.price.toLocaleString()}.00</p>
                <span className="pos__cm-item-qty">{item.qty} {item.qty === 1 ? 'piece' : 'pieces'}</span>
              </div>
              <p className="pos__cm-item-total">P {(item.price * item.qty).toLocaleString()}.00</p>
            </div>
          ))}
        </div>
        <h3 className="pos__cm-sec">Order Summary</h3>
        <div className="pos__cm-summary">
          <div className="pos__cm-sum-row"><span>Sub Total</span><span>P{subtotal.toLocaleString()}.00</span></div>
          <div className="pos__cm-sum-row"><span>Tax</span><span>P0.00</span></div>
          <div className="pos__cm-sum-row"><span>Discount</span><span>P0.00</span></div>
          <hr className="pos__cm-line" />
          <div className="pos__cm-sum-total"><span>TOTAL AMOUNT</span><span>P {total.toLocaleString()}.00</span></div>
        </div>
        <div className="pos__cm-payment">
          <span className="pos__cm-pay-label">Payment Method:</span>
          <span className="pos__cm-pay-val">{paymentMethod} - CARD</span>
        </div>
        <div className="pos__cm-actions">
          <button className="pos__cm-edit-btn" onClick={onEdit}>Edit</button>
          <button className="pos__cm-confirm-btn" onClick={onConfirm}>Confirm Order</button>
        </div>
      </div>
    </div>
  );
}
 
function ValidationModal({ icon, iconColor, title, message, onClose }) {
  return (
    <div className="pos__overlay" onClick={onClose}>
      <div className="pos__val-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pos__val-icon-wrap" style={{ background: `${iconColor}18` }}>
          <span className="material-icons pos__val-icon" style={{ color: iconColor }}>{icon}</span>
        </div>
        <h3 className="pos__val-title">{title}</h3>
        <p className="pos__val-msg">{message}</p>
        <button className="pos__val-close-btn" onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}