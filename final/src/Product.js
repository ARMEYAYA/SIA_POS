import React, { useState, useMemo, useRef, useEffect } from 'react';
import Topbar from './Topbar';
import './Product.css';
 
const SEED_PRODUCTS = [
  { id: 1, code: 'PLNPJSSMALLB3', name: 'Plain Pajamas', sizes: ['3', '7'], pack: 10, pcs: 5, retailPrice: 145, wholesalePrice: 725, pricePerPack: 725, slot: 5, remainingStock: 5, status: 'out', category: 'Sleepwear', img: null, description: '' },
  { id: 2, code: 'PLNPJSSMALLB3', name: 'Plain Pajamas', sizes: ['3', '7'], pack: 10, pcs: 20, retailPrice: 725, wholesalePrice: 725, pricePerPack: 725, slot: 20, remainingStock: 20, status: 'out', category: 'Sleepwear', img: null, description: '' },
  { id: 3, code: 'PLNPJSSMALLB3', name: 'Plain Pajamas', sizes: ['3', '7'], pack: 10, pcs: 20, retailPrice: 725, wholesalePrice: 725, pricePerPack: 725, slot: 20, remainingStock: 20, status: 'low', category: 'Sleepwear', img: null, description: '' },
  { id: 4, code: 'PLNPJSSMALLB3', name: 'Plain Pajamas', sizes: ['3', '7'], pack: 10, pcs: 20, retailPrice: 725, wholesalePrice: 725, pricePerPack: 725, slot: 20, remainingStock: 20, status: 'in', category: 'Daily wear', img: null, description: '' },
  { id: 5, code: 'PLNPJSSMALLB3', name: 'Plain Pajamas', sizes: ['3', '7'], pack: 10, pcs: 20, retailPrice: 725, wholesalePrice: 725, pricePerPack: 725, slot: 20, remainingStock: 20, status: 'in', category: 'New Arrivals', img: null, description: '' },
];
 
const CATEGORIES = ['All', 'New Arrivals', 'Daily wear', 'OOTD', 'Dresses', 'Sleepwear'];
const SIZES_ROW1 = [80, 90, 100, 110, 120];
const SIZES_ROW2 = [130, 140, 150, 160, 170];
const SETS_ROW1  = ['Set A', 'Set B', 'Set C'];
const SETS_ROW2  = ['Set D', 'Set E', 'Set F'];
 
const STATUS_META = {
  out: { label: 'Out of Stock', bg: 'rgba(159,0,3,0.25)',    border: 'rgba(159,0,3,0.63)',    dot: '#750010' },
  low: { label: 'Low Stock',    bg: 'rgba(13,13,187,0.25)',  border: 'rgba(13,13,187,0.63)',  dot: '#0D0DBB' },
  in:  { label: 'In Stock',     bg: 'rgba(112,233,90,0.25)', border: 'rgba(112,233,90,0.63)', dot: '#70E95A' },
};
 
const SORT_OPTIONS = [
  { value: 'default',     label: 'Default' },
  { value: 'name_asc',    label: 'Name A → Z' },
  { value: 'name_desc',   label: 'Name Z → A' },
  { value: 'price_asc',   label: 'Price: Low → High' },
  { value: 'price_desc',  label: 'Price: High → Low' },
  { value: 'stock_asc',   label: 'Stock: Low → High' },
  { value: 'stock_desc',  label: 'Stock: High → Low' },
  { value: 'status_in',   label: 'Status: In Stock first' },
  { value: 'status_out',  label: 'Status: Out of Stock first' },
];
 
const BLANK_FORM = {
  code: '', name: '', description: '',
  sizes: [], sets: [],
  sellingPrice: '', retailPrice: '',
  minSlot: '', packQty: '', piecesPerPack: '',
  stockQty: '',
  category: '',
  images: [],
  mainImageIdx: 0,
};
 
export default function Product() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery]       = useState('');
  const [sortBy, setSortBy]                 = useState('default');
  const [sortOpen, setSortOpen]             = useState(false);
  const [products, setProducts]             = useState(SEED_PRODUCTS);
  const sortRef = useRef(null);
 
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState(BLANK_FORM);
  const [editId, setEditId]     = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [hoveredImg, setHoveredImg] = useState(false);
 

  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
 
  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchQ   = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
                        || p.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQ;
    });
 
    const sorted = [...list];
    switch (sortBy) {
      case 'name_asc':    sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name_desc':   sorted.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'price_asc':   sorted.sort((a, b) => a.retailPrice - b.retailPrice); break;
      case 'price_desc':  sorted.sort((a, b) => b.retailPrice - a.retailPrice); break;
      case 'stock_asc':   sorted.sort((a, b) => a.remainingStock - b.remainingStock); break;
      case 'stock_desc':  sorted.sort((a, b) => b.remainingStock - a.remainingStock); break;
      case 'status_in':   sorted.sort((a, b) => { const o = { in: 0, low: 1, out: 2 }; return o[a.status] - o[b.status]; }); break;
      case 'status_out':  sorted.sort((a, b) => { const o = { out: 0, low: 1, in: 2 }; return o[a.status] - o[b.status]; }); break;
      default: break;
    }
    return sorted;
  }, [products, activeCategory, searchQuery, sortBy]);
 
  const toggleArr = (arr, val) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
 
  const handleImgUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...newImgs] }));
  };
 
  const openAdd = () => {
    setForm(BLANK_FORM);
    setEditId(null);
    setModal('add');
  };
 
  const openEdit = (product) => {
    setEditId(product.id);
    setForm({
      code: product.code,
      name: product.name,
      description: product.description || '',
      sizes: product.sizes || [],
      sets: product.sets || [],
      sellingPrice: product.retailPrice,
      retailPrice: product.retailPrice,
      minSlot: product.slot,
      packQty: product.pack,
      piecesPerPack: product.pcs,
      stockQty: product.remainingStock,
      category: product.category,
      images: product.images || [],
      mainImageIdx: 0,
    });
    setModal('edit');
  };
 
  const handleAddProduct = () => setModal('confirm');
 
  const handleConfirm = () => {
    if (editId !== null) {
      setProducts((prev) => prev.map((p) =>
        p.id === editId ? {
          ...p,
          code: form.code, name: form.name, description: form.description,
          sizes: form.sizes, sets: form.sets,
          retailPrice: Number(form.retailPrice) || 0,
          wholesalePrice: Number(form.sellingPrice) || 0,
          pricePerPack: Number(form.sellingPrice) || 0,
          slot: Number(form.minSlot) || 0,
          remainingStock: Number(form.stockQty) || 0,
          pack: Number(form.packQty) || 0,
          pcs: Number(form.piecesPerPack) || 0,
          category: form.category, images: form.images,
          status: Number(form.stockQty) <= 0 ? 'out' : Number(form.stockQty) <= 5 ? 'low' : 'in',
        } : p
      ));
    } else {
      setProducts((prev) => [...prev, {
        id: Date.now(),
        code: form.code, name: form.name, description: form.description,
        sizes: form.sizes, sets: form.sets,
        retailPrice: Number(form.retailPrice) || 0,
        wholesalePrice: Number(form.sellingPrice) || 0,
        pricePerPack: Number(form.sellingPrice) || 0,
        slot: Number(form.minSlot) || 0,
        remainingStock: Number(form.stockQty) || 0,
        pack: Number(form.packQty) || 0,
        pcs: Number(form.piecesPerPack) || 0,
        category: form.category, images: form.images,
        status: Number(form.stockQty) <= 0 ? 'out' : Number(form.stockQty) <= 5 ? 'low' : 'in',
      }]);
    }
    setModal('success');
  };
 
  const handleDelete = (id) => { setDeleteId(id); setModal('deleteConfirm'); };
  const confirmDelete = () => { setProducts((prev) => prev.filter((p) => p.id !== deleteId)); setModal(null); setDeleteId(null); };
  const closeAll = () => { setModal(null); setEditId(null); setDeleteId(null); };
 
  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Sort';
 
  return (
    <div className="product-page">
      {/* Header */}
      <div className="product-page__header">
        <div className="product-page__title-block">
          <h1 className="product-page__title">PRODUCT</h1>
          <p className="product-page__subtitle">Monitor stock levels and manage your product listings</p>
        </div>
        <Topbar />
      </div>
 
      {/* Toolbar */}
      <div className="product-page__toolbar">
        <div className="product-page__cat-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`product-page__cat-btn ${activeCategory === cat ? 'product-page__cat-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
 
        <div className="product-page__toolbar-right">
          <div className="product-page__search-wrap">
            <span className="material-icons product-page__search-icon">search</span>
            <input
              className="product-page__search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
 
          {/* Filter / Yung sa Sort dropdown */}
          <div className="product-page__sort-wrap" ref={sortRef}>
            <button
              className={`product-page__filter-btn ${sortOpen ? 'product-page__filter-btn--open' : ''}`}
              onClick={() => setSortOpen((o) => !o)}
            >
              <span className="material-icons" style={{ fontSize: 18 }}>filter_list</span>
              Filter
              <span className="material-icons product-page__filter-arrow">
                {sortOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              </span>
            </button>
            {sortOpen && (
              <div className="product-page__sort-dropdown">
                <p className="product-page__sort-heading">Sort by</p>
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`product-page__sort-option ${sortBy === opt.value ? 'product-page__sort-option--active' : ''}`}
                    onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                  >
                    {sortBy === opt.value && <span className="material-icons product-page__sort-check">check</span>}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
 
      <div className="product-page__card">
        <div className="product-page__card-top-row">
          <p className="product-page__count">Total Product: {filtered.length} item{filtered.length !== 1 ? 's' : ''}</p>
          <div className="product-page__card-actions">
            {/* Edit button — only shown when a product is selected via row click */}
            <button className="product-page__add-btn product-page__edit-btn-top" onClick={() => { if (filtered.length > 0) openEdit(filtered[0]); }} style={{ display: 'none' }} id="edit-btn-placeholder">
              <span className="material-icons" style={{ fontSize: 18 }}>border_color</span>
              Edit
            </button>
            <button className="product-page__add-btn" onClick={openAdd}>
              <span className="product-page__add-btn-plus">+</span>
              Add Product
            </button>
          </div>
        </div>
 
        {sortBy !== 'default' && (
          <div className="product-page__sort-active-badge">
            <span className="material-icons" style={{ fontSize: 13 }}>sort</span>
            Sorted by: <strong>{currentSortLabel}</strong>
            <button className="product-page__sort-clear" onClick={() => setSortBy('default')}>
              <span className="material-icons" style={{ fontSize: 13 }}>close</span>
            </button>
          </div>
        )}
 
        <div className="product-page__table-wrap">
          <table className="product-page__table">
            <thead>
              <tr className="product-page__thead-row">
                <th>No.</th>
                <th>Product ID</th>
                <th>Product img</th>
                <th>Product Name</th>
                <th>Size</th>
                <th>Pack</th>
                <th>Pcs</th>
                <th>Unit Price</th>
                <th>Price Per Pack</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(0,0,0,0.35)', fontStyle: 'italic' }}>
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => {
                  const sm = STATUS_META[p.status] || STATUS_META.in;
                  return (
                    <tr
                      key={p.id}
                      className="product-page__row product-page__row--clickable"
                      onClick={() => openEdit(p)}
                      title="Click to edit this product"
                    >
                      <td className="product-page__td product-page__td--no">{i + 1}</td>
                      <td className="product-page__td product-page__td--code">{p.code}</td>
                      <td className="product-page__td">
                        <div className="product-page__img-cell">
                          {p.images && p.images[0]
                            ? <img src={p.images[0].url} alt={p.name} className="product-page__img" />
                            : <div className="product-page__img-placeholder">
                                <span className="material-icons" style={{ fontSize: 28, color: '#ccc' }}>image</span>
                              </div>
                          }
                        </div>
                      </td>
                      <td className="product-page__td">{p.name}</td>
                      <td className="product-page__td">{Array.isArray(p.sizes) ? p.sizes.join(',') : p.sizes}</td>
                      <td className="product-page__td">{p.pack}</td>
                      <td className="product-page__td">{p.pcs}</td>
                      <td className="product-page__td">₱ {p.retailPrice}</td>
                      <td className="product-page__td">₱ {p.pricePerPack}</td>
                      <td className="product-page__td">
                        <span className="product-page__status-badge" style={{ background: sm.bg, border: `0.5px solid ${sm.border}` }}>
                          <span className="product-page__status-dot" style={{ background: sm.dot }} />
                          {sm.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
 
      {(modal === 'add' || modal === 'edit') && (
        <div className="pmodal__overlay">
          <div className="pmodal__box scale-in">
            <button className="pmodal__close" onClick={closeAll}>
              <span className="material-icons">close</span>
            </button>
 
            <h2 className="pmodal__title">{modal === 'edit' ? 'Edit Product' : 'Add Product'}</h2>
 
            <div className="pmodal__body">
              <div className="pmodal__left">
                <h3 className="pmodal__section-label">Product Information</h3>
                <div className="pmodal__info-card">
                  <div className="pmodal__field">
                    <label className="pmodal__field-label">Product Code: <span className="pmodal__required">*</span></label>
                    <input className="pmodal__input pmodal__input--sm" placeholder="Item Code" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} />
                  </div>
                  <div className="pmodal__field">
                    <label className="pmodal__field-label">Product Name: <span className="pmodal__required">*</span></label>
                    <input className="pmodal__input pmodal__input--full" placeholder="Item Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="pmodal__field">
                    <label className="pmodal__field-label">Product Description:</label>
                    <textarea className="pmodal__textarea" placeholder="Item Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div className="pmodal__field">
                    <label className="pmodal__field-label">Size: <span className="pmodal__required">*</span></label>
                    <p className="pmodal__pick-hint">Pick Available Size</p>
                    <div className="pmodal__chip-row">
                      {[...SIZES_ROW1, ...SIZES_ROW2].map((s) => (
                        <button key={s} type="button" className={`pmodal__chip pmodal__chip--size ${form.sizes.includes(String(s)) ? 'pmodal__chip--active' : ''}`} onClick={() => setForm((f) => ({ ...f, sizes: toggleArr(f.sizes, String(s)) }))}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div className="pmodal__field">
                    <label className="pmodal__field-label">Set: <span className="pmodal__required">*</span></label>
                    <p className="pmodal__pick-hint">Pick Available Set</p>
                    <div className="pmodal__chip-row">
                      {[...SETS_ROW1, ...SETS_ROW2].map((s) => (
                        <button key={s} type="button" className={`pmodal__chip pmodal__chip--set ${form.sets.includes(s) ? 'pmodal__chip--active' : ''}`} onClick={() => setForm((f) => ({ ...f, sets: toggleArr(f.sets, s) }))}>{s}</button>
                      ))}
                    </div>
                  </div>
                </div>
 
                <div className="pmodal__pricing-row">
                  <h3 className="pmodal__section-label pmodal__section-label--inline">Pricing</h3>
                  <div className="pmodal__pricing-card">
                    <div className="pmodal__pricing-top-row">
                      <div className="pmodal__sub-field">
                        <label className="pmodal__sub-label">Minimum Slot Availability:</label>
                        <input className="pmodal__sub-input" placeholder="Minimum Slot per order" value={form.minSlot} onChange={(e) => setForm((f) => ({ ...f, minSlot: e.target.value }))} />
                      </div>
                    </div>
                    <div className="pmodal__pricing-bottom-row">
                      <div className="pmodal__sub-field">
                        <label className="pmodal__sub-label">Quantity per slot:</label>
                        <div className="pmodal__pricing-inline">
                          <input className="pmodal__sub-input pmodal__sub-input--xs" placeholder="1 pack" value={form.packQty} onChange={(e) => setForm((f) => ({ ...f, packQty: e.target.value }))} />
                          <input className="pmodal__sub-input pmodal__sub-input--md" placeholder="pieces per pack" value={form.piecesPerPack} onChange={(e) => setForm((f) => ({ ...f, piecesPerPack: e.target.value }))} />
                        </div>
                      </div>
                    </div>
                    <div className="pmodal__price-fields">
                      <div className="pmodal__sub-field">
                        <label className="pmodal__sub-label">Selling Price:</label>
                        <input className="pmodal__price-input" placeholder="Wholesale Price" value={form.sellingPrice} onChange={(e) => setForm((f) => ({ ...f, sellingPrice: e.target.value }))} />
                      </div>
                      <div className="pmodal__sub-field">
                        <input className="pmodal__price-input" placeholder="Retail Price" value={form.retailPrice} onChange={(e) => setForm((f) => ({ ...f, retailPrice: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
 
              <div className="pmodal__right">
                <h3 className="pmodal__section-label">Product Image</h3>
                <div className="pmodal__img-card">
                  <div className={`pmodal__main-img-wrap ${hoveredImg ? 'pmodal__main-img-wrap--hover' : ''}`} onMouseEnter={() => setHoveredImg(true)} onMouseLeave={() => setHoveredImg(false)}>
                    {form.images.length > 0 ? (
                      <>
                        <img src={form.images[form.mainImageIdx]?.url} alt="main" className="pmodal__main-img" />
                        {hoveredImg && (
                          <div className="pmodal__img-overlay">
                            <label className="pmodal__img-overlay-btn pmodal__img-overlay-btn--replace">
                              Replace
                              <input type="file" accept="image/*" hidden onChange={handleImgUpload} />
                            </label>
                            <button className="pmodal__img-overlay-btn pmodal__img-overlay-btn--remove" onClick={() => setForm((f) => ({ ...f, images: [], mainImageIdx: 0 }))}>Remove</button>
                          </div>
                        )}
                      </>
                    ) : (
                      <label className="pmodal__upload-label">
                        <span className="material-icons pmodal__upload-icon">add_photo_alternate</span>
                        <span className="pmodal__upload-hint">drop your image here or select click to browser</span>
                        <input type="file" accept="image/*" multiple hidden onChange={handleImgUpload} />
                      </label>
                    )}
                  </div>
                  <div className="pmodal__thumb-strip">
                    {[0, 1, 2].map((idx) => (
                      <div key={idx} className={`pmodal__thumb ${form.mainImageIdx === idx && form.images[idx] ? 'pmodal__thumb--active' : ''}`} onClick={() => form.images[idx] && setForm((f) => ({ ...f, mainImageIdx: idx }))}>
                        {form.images[idx] ? (
                          <img src={form.images[idx].url} alt="" className="pmodal__thumb-img" />
                        ) : (
                          <label className="pmodal__thumb-upload">
                            <span className="material-icons" style={{ fontSize: 14, color: '#999' }}>add_photo_alternate</span>
                            <input type="file" accept="image/*" hidden onChange={handleImgUpload} />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
 
                <h3 className="pmodal__section-label pmodal__section-label--mt">Category</h3>
                <div className="pmodal__cat-card">
                  <label className="pmodal__sub-label">Product Category:</label>
                  <div className="pmodal__select-wrap">
                    <select className="pmodal__select" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                      <option value="">Select Category</option>
                      {CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <span className="material-icons pmodal__select-arrow">keyboard_arrow_down</span>
                  </div>
                </div>
 
                <h3 className="pmodal__section-label pmodal__section-label--mt">Inventory</h3>
                <div className="pmodal__inv-card">
                  <label className="pmodal__sub-label">Stock Quantity: <span className="pmodal__required">*</span></label>
                  <input className="pmodal__inv-input" placeholder="Stock by Pack" value={form.stockQty} onChange={(e) => setForm((f) => ({ ...f, stockQty: e.target.value }))} />
                </div>
              </div>
            </div>
 
            <div className="pmodal__footer">
              <button className="pmodal__discard-btn" onClick={closeAll}>Discard</button>
              {modal === 'edit' && (
                <button
                  className="pmodal__delete-inline-btn"
                  onClick={() => { handleDelete(editId); }}
                >
                  <span className="material-icons" style={{ fontSize: 16 }}>delete_outline</span>
                  Delete Product
                </button>
              )}
              <button className="pmodal__submit-btn" onClick={handleAddProduct}>
                {modal === 'edit' ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* CONFIRM MODAL */}
      {modal === 'confirm' && (
        <div className="pmodal__overlay">
          <div className="pmodal__box scale-in">
            <button className="pmodal__close" onClick={closeAll}><span className="material-icons">close</span></button>
            <h2 className="pmodal__title">{editId !== null ? 'Confirm Changes' : 'Add Product'}</h2>
            <div className="pmodal__body">
              <div className="pmodal__left">
                <h3 className="pmodal__section-label">Product Information</h3>
                <div className="pmodal__info-card pmodal__info-card--readonly">
                  <div className="pmodal__field"><label className="pmodal__field-label">Product Code:</label><div className="pmodal__readonly-val">{form.code || '—'}</div></div>
                  <div className="pmodal__field"><label className="pmodal__field-label">Product Name:</label><div className="pmodal__readonly-val">{form.name || '—'}</div></div>
                  <div className="pmodal__field"><label className="pmodal__field-label">Product Description:</label><div className="pmodal__readonly-val pmodal__readonly-val--tall">{form.description || '—'}</div></div>
                  <div className="pmodal__field">
                    <label className="pmodal__field-label">Size:</label>
                    <div className="pmodal__chip-row">
                      {[...SIZES_ROW1, ...SIZES_ROW2].map((s) => (
                        <span key={s} className={`pmodal__chip pmodal__chip--size ${form.sizes.includes(String(s)) ? 'pmodal__chip--active' : ''}`}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="pmodal__field">
                    <label className="pmodal__field-label">Set:</label>
                    <div className="pmodal__chip-row">
                      {[...SETS_ROW1, ...SETS_ROW2].map((s) => (
                        <span key={s} className={`pmodal__chip pmodal__chip--set ${form.sets.includes(s) ? 'pmodal__chip--active' : ''}`}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="pmodal__pricing-row">
                  <h3 className="pmodal__section-label pmodal__section-label--inline">Pricing</h3>
                  <div className="pmodal__pricing-card pmodal__pricing-card--readonly">
                    <div className="pmodal__price-readonly-row"><span className="pmodal__sub-label">Min Slot:</span><span>{form.minSlot || '—'}</span></div>
                    <div className="pmodal__price-readonly-row"><span className="pmodal__sub-label">Pack Qty:</span><span>{form.packQty || '—'}</span></div>
                    <div className="pmodal__price-readonly-row"><span className="pmodal__sub-label">Pcs / pack:</span><span>{form.piecesPerPack || '—'}</span></div>
                    <div className="pmodal__price-readonly-row"><span className="pmodal__sub-label">Selling Price:</span><span>P {form.sellingPrice || '—'}</span></div>
                    <div className="pmodal__price-readonly-row"><span className="pmodal__sub-label">Retail Price:</span><span>P {form.retailPrice || '—'}</span></div>
                  </div>
                </div>
              </div>
              <div className="pmodal__right">
                <h3 className="pmodal__section-label">Product Image</h3>
                <div className="pmodal__img-card">
                  <div className="pmodal__main-img-wrap">
                    {form.images.length > 0 ? <img src={form.images[0].url} alt="main" className="pmodal__main-img" /> : <div className="pmodal__upload-label pmodal__upload-label--empty"><span className="material-icons" style={{ fontSize: 30, color: '#ccc' }}>image</span></div>}
                  </div>
                  <div className="pmodal__thumb-strip">
                    {[0, 1, 2].map((idx) => (
                      <div key={idx} className="pmodal__thumb">
                        {form.images[idx] ? <img src={form.images[idx].url} alt="" className="pmodal__thumb-img" /> : <span className="material-icons" style={{ fontSize: 14, color: '#ccc' }}>image</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <h3 className="pmodal__section-label pmodal__section-label--mt">Category</h3>
                <div className="pmodal__cat-card"><div className="pmodal__readonly-val">{form.category || '—'}</div></div>
                <h3 className="pmodal__section-label pmodal__section-label--mt">Inventory</h3>
                <div className="pmodal__inv-card">
                  <label className="pmodal__sub-label">Stock Quantity:</label>
                  <div className="pmodal__readonly-val">{form.stockQty || '—'}</div>
                </div>
              </div>
            </div>
            <div className="pmodal__footer">
              <button className="pmodal__discard-btn" onClick={closeAll}>Discard</button>
              <button className="pmodal__secondary-btn" onClick={() => setModal(editId !== null ? 'edit' : 'add')}>Edit</button>
              <button className="pmodal__submit-btn" onClick={handleConfirm}>
                {editId !== null ? 'Confirm Changes' : 'Confirm Product'}
              </button>
            </div>
          </div>
        </div>
      )}
 
      {modal === 'success' && (
        <div className="pmodal__overlay">
          <div className="pmodal__success-box scale-in">
            <div className="pmodal__success-circle"><span className="material-icons pmodal__success-icon">check</span></div>
            <h2 className="pmodal__success-title">{editId !== null ? 'Product Updated!' : 'Product Successfully added!'}</h2>
            <p className="pmodal__success-msg">New items added to inventory. Records updated and available for sales.</p>
            <button className="pmodal__submit-btn pmodal__submit-btn--success" onClick={closeAll}>Done</button>
          </div>
        </div>
      )}
 
      {modal === 'deleteConfirm' && (
        <div className="pmodal__overlay">
          <div className="pmodal__delete-box scale-in">
            <span className="material-icons pmodal__delete-icon">delete_forever</span>
            <h2 className="pmodal__delete-title">Delete Product?</h2>
            <p className="pmodal__delete-msg">This action cannot be undone. The product will be permanently removed from inventory.</p>
            <div className="pmodal__delete-actions">
              <button className="pmodal__discard-btn" onClick={closeAll}>Cancel</button>
              <button className="pmodal__submit-btn pmodal__submit-btn--danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}