import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import './PharmacyMobileApp.css';

export default function PharmacyMobileApp() {
  const {
    setCurrentView,
    pharmacyScreen,
    setPharmacyScreen,
    pharmacyLoggedIn,
    setPharmacyLoggedIn,
    orders,
    placeNewPharmacyOrder,
    expiryIntimations,
    submitExpiryIntimation,
    broadcasts,
    acknowledgeBroadcast,
    tickets,
    createSupportTicket,
    acknowledgements,
  } = usePlatform();

  // Local mobile UI states
  const [deviceFrameMode, setDeviceFrameMode] = useState(true); // true = phone mockup, false = full width
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'urgent' | 'normal'
  const [expiryTab, setExpiryTab] = useState('manual'); // 'manual' | 'auto'

  // New Order Requisition Modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [newOrderType, setNewOrderType] = useState('urgent');
  const [selectedMedicine, setSelectedMedicine] = useState('Augmentin 625mg Tab');
  const [orderQty, setOrderQty] = useState(30);
  const [orderNotes, setOrderNotes] = useState('Urgent surgical ICU restock');

  // Manual Expiry Form
  const [expProduct, setExpProduct] = useState('');
  const [expPrincipal, setExpPrincipal] = useState('GSK Pakistan');
  const [expBatch, setExpBatch] = useState('');
  const [expDate, setExpDate] = useState('2027-05-30');
  const [expQty, setExpQty] = useState(25);

  // New Support Ticket Form
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketCategory, setTicketCategory] = useState('Damaged Packets');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');

  // 3-Step Login Form State
  const [loginDistributor, setLoginDistributor] = useState('Abbas Distributors (Pvt) Ltd');
  const [loginPharmacyId, setLoginPharmacyId] = useState('501390');
  const [loginToken, setLoginToken] = useState('TK-8824');
  const [rememberDevice, setRememberDevice] = useState(true);

  // Available catalog for quick ordering
  const catalogMedicines = [
    { name: 'Augmentin 625mg Tab', principal: 'GSK Pakistan', pack: 'Box of 10s', price: 620 },
    { name: 'Risek 40mg IV Inj', principal: 'Getz Pharma', pack: 'Vial', price: 440 },
    { name: 'Lantus Solostar 100IU', principal: 'Sanofi Pakistan', pack: 'Pen 3ml', price: 1850 },
    { name: 'Ventolin Inhaler 100mcg', principal: 'GSK Pakistan', pack: 'Canister', price: 340 },
    { name: 'Panadol CF Caplets', principal: 'GSK Consumer', pack: 'Blister 100s', price: 185 },
    { name: 'Meronem 1g IV Inj', principal: 'Pfizer Pakistan', pack: 'Vial', price: 2950 },
  ];

  // Auto-intimation past delivery invoices
  const autoInvoicedBatches = [
    { name: 'Augmentin 625mg Tab', batch: 'BT-99021', exp: '2027-05-31', principal: 'GSK Pakistan', invoice: 'INV-77102', qty: 45 },
    { name: 'Lantus Solostar 100IU', batch: 'SN-44108', exp: '2027-04-15', principal: 'Sanofi Pakistan', invoice: 'INV-76890', qty: 18 },
    { name: 'Risek 40mg IV Inj', batch: 'GT-33129', exp: '2027-04-28', principal: 'Getz Pharma', invoice: 'INV-77005', qty: 30 },
  ];

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const med = catalogMedicines.find(m => m.name === selectedMedicine) || catalogMedicines[0];
    placeNewPharmacyOrder({
      orderType: newOrderType,
      items: [{ name: med.name, qty: Number(orderQty), pack: med.pack, price: med.price }],
      notes: orderNotes
    });
    setShowOrderModal(false);
    setPharmacyScreen('orders');
  };

  const handleManualExpirySubmit = (e) => {
    e.preventDefault();
    if (!expProduct || !expBatch) return;
    submitExpiryIntimation({
      productName: expProduct,
      principal: expPrincipal,
      batchNo: expBatch,
      expiryDate: expDate,
      quantity: expQty,
      intimationType: 'manual'
    });
    setExpProduct('');
    setExpBatch('');
    alert('6-Month Expiry Intimation submitted! Distributor verified and logged for Principal credit memo.');
  };

  const handleAutoIntimate = (batch) => {
    submitExpiryIntimation({
      productName: batch.name,
      principal: batch.principal,
      batchNo: batch.batch,
      expiryDate: batch.exp,
      quantity: batch.qty,
      intimationType: 'auto'
    });
    alert(`Auto-Intimated ${batch.name} (Batch ${batch.batch}) successfully from past invoice ${batch.invoice}!`);
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMsg) return;
    createSupportTicket({
      category: ticketCategory,
      subject: ticketSubject,
      message: ticketMsg
    });
    setShowTicketModal(false);
    setTicketSubject('');
    setTicketMsg('');
    setPharmacyScreen('helpdesk');
  };

  // Filtered orders for pharmacy #501390
  const myOrders = orders.filter(o => o.pharmacyId === '501390');
  const filteredOrders = myOrders.filter(o => {
    if (orderFilter === 'urgent') return o.orderType === 'urgent';
    if (orderFilter === 'normal') return o.orderType === 'normal';
    return true;
  });

  return (
    <div className="pharmacy-mobile-wrapper">
      {/* ─── Top Global Bar ─── */}
      <header className="mobile-view-topbar">
        <div className="view-title-group">
          <span className="material-symbols-outlined text-teal">local_pharmacy</span>
          <div>
            <h2 className="topbar-heading">Pharmacy Mobile Counter App</h2>
            <span className="topbar-sub">Malik Medicos Centre (ID #501390) • Abbottabad</span>
          </div>
        </div>

        <div className="topbar-controls">
          <button
            className={`frame-toggle-btn ${deviceFrameMode ? 'active' : ''}`}
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            title="Toggle Device Frame Simulator"
          >
            <span className="material-symbols-outlined">{deviceFrameMode ? 'smartphone' : 'fit_screen'}</span>
            <span>{deviceFrameMode ? 'Device Frame (390px)' : 'Full View'}</span>
          </button>

          <button
            className="btn-switch-portal distributor-switch"
            onClick={() => setCurrentView('distributor')}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>Distributor Portal</span>
          </button>

          <button
            className="btn-switch-portal landing-switch"
            onClick={() => setCurrentView('landing')}
          >
            <span className="material-symbols-outlined">home</span>
            <span>Landing Page</span>
          </button>
        </div>
      </header>

      {/* ─── Device Container (Phone Mockup) ─── */}
      <div className={`phone-simulator-canvas ${deviceFrameMode ? 'framed' : 'full-canvas'}`}>
        <div className="phone-chassis">
          {/* Status Bar */}
          <div className="phone-status-bar">
            <span className="status-time">09:41</span>
            <div className="phone-island-notch">
              <span className="camera-lens" />
              <span className="speaker-slot" />
            </div>
            <div className="status-icons">
              <span className="material-symbols-outlined text-xs">signal_cellular_alt</span>
              <span className="material-symbols-outlined text-xs">wifi</span>
              <span className="material-symbols-outlined text-xs">battery_full</span>
            </div>
          </div>

          {/* ════════════ SCREEN 1: 3-STEP PASSWORDLESS LOGIN ════════════ */}
          {!pharmacyLoggedIn ? (
            <div className="phone-screen-content login-screen animate-fade-in">
              <div className="login-header-hero">
                <div className="login-logo-lockup">
                  <span className="material-symbols-outlined hero-lock-icon">verified_user</span>
                </div>
                <h2 className="login-title">TheDigitalPortal</h2>
                <span className="login-subtitle">Bridge to Digital Excellence</span>
                <p className="login-note">Zero-Password 3-Step Secure Counter Access</p>
              </div>

              <div className="login-card-box">
                {/* Step 1 */}
                <div className="login-step-field">
                  <div className="step-num-badge">1</div>
                  <div className="step-input-group">
                    <label>Select Verified Distributor</label>
                    <div className="input-with-icon">
                      <span className="material-symbols-outlined">hub</span>
                      <select
                        value={loginDistributor}
                        onChange={e => setLoginDistributor(e.target.value)}
                      >
                        <option>Abbas Distributors (Pvt) Ltd</option>
                        <option>Khyber Pharma Distributors</option>
                        <option>Capital Medicos Islamabad</option>
                        <option>Punjab Drug Agency Lahore</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="login-step-field">
                  <div className="step-num-badge">2</div>
                  <div className="step-input-group">
                    <label>Enter Registered Pharmacy ID</label>
                    <div className="input-with-icon">
                      <span className="material-symbols-outlined">badge</span>
                      <input
                        type="text"
                        value={loginPharmacyId}
                        onChange={e => setLoginPharmacyId(e.target.value)}
                        placeholder="e.g. 501390"
                      />
                    </div>
                    <span className="match-tag">✓ Matches: Malik Medicos Centre</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="login-step-field">
                  <div className="step-num-badge">3</div>
                  <div className="step-input-group">
                    <label>Cryptographic Security Token</label>
                    <div className="input-with-icon token-field">
                      <span className="material-symbols-outlined">key</span>
                      <input
                        type="text"
                        value={loginToken}
                        onChange={e => setLoginToken(e.target.value)}
                        className="font-mono"
                      />
                      <span className="auto-token-pill">Auto-Filled</span>
                    </div>
                  </div>
                </div>

                <div className="remember-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={e => setRememberDevice(e.target.checked)}
                    />
                    <span>Remember this Counter Terminal</span>
                  </label>
                </div>

                <button
                  className="btn-counter-primary"
                  onClick={() => setPharmacyLoggedIn(true)}
                >
                  <span className="material-symbols-outlined">lock_open</span>
                  <span>Access Counter Dashboard</span>
                </button>

                <div className="security-badge-footer">
                  <span className="material-symbols-outlined text-xs">shield</span>
                  <span>256-bit AES Cryptographic Device Pairing</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="phone-screen-content app-screens-container">
              {/* App Screen Header */}
              <div className="app-screen-header">
                <div className="counter-profile">
                  <div className="pharmacy-avatar">MM</div>
                  <div>
                    <h3 className="pharmacy-brand-name">Malik Medicos Centre</h3>
                    <span className="pharmacy-sub-text">Abbottabad • RPh Dr. Aamir Khan</span>
                  </div>
                </div>
                <div className="header-actions">
                  <button
                    className="icon-header-btn"
                    onClick={() => setShowOrderModal(true)}
                    title="Quick Order Requisition"
                  >
                    <span className="material-symbols-outlined text-urgent">bolt</span>
                  </button>
                  <button
                    className="icon-header-btn"
                    onClick={() => setPharmacyLoggedIn(false)}
                    title="Lock Terminal"
                  >
                    <span className="material-symbols-outlined">logout</span>
                  </button>
                </div>
              </div>

              {/* ════════════ SCREEN 2: COUNTER DASHBOARD ════════════ */}
              {pharmacyScreen === 'dashboard' && (
                <div className="screen-inner-scroll animate-fade-in">
                  {/* DRAP Alert Strip */}
                  <div
                    className="mobile-policy-card"
                    onClick={() => setPharmacyScreen('expiry')}
                  >
                    <div className="policy-pill">
                      <span className="material-symbols-outlined text-xs">warning</span>
                      <span>DRAP 6-Month Policy</span>
                    </div>
                    <p className="policy-text">
                      Intimate expiry at least <strong>6 months in advance</strong> to guarantee distributor credit memos.
                    </p>
                    <span className="policy-link">Review Stock Expiries →</span>
                  </div>

                  {/* 4 Counter KPI Chips */}
                  <div className="counter-kpis-grid">
                    <div
                      className="counter-kpi-chip"
                      onClick={() => setPharmacyScreen('expiry')}
                    >
                      <span className="chip-label">Pending Returns</span>
                      <strong className="chip-val font-mono">{expiryIntimations.length} Batches</strong>
                      <span className="chip-badge warning">In Review</span>
                    </div>

                    <div
                      className="counter-kpi-chip"
                      onClick={() => setPharmacyScreen('announcements')}
                    >
                      <span className="chip-label">Trade Offers</span>
                      <strong className="chip-val font-mono">10+1 Scheme</strong>
                      <span className="chip-badge active">Active Now</span>
                    </div>

                    <div
                      className="counter-kpi-chip"
                      onClick={() => setPharmacyScreen('helpdesk')}
                    >
                      <span className="chip-label">Support Tickets</span>
                      <strong className="chip-val font-mono">
                        {tickets.filter(t => t.pharmacyId === '501390' && t.status !== 'Settled').length} Open
                      </strong>
                      <span className="chip-badge info">100% SLA</span>
                    </div>

                    <div
                      className="counter-kpi-chip"
                      onClick={() => setPharmacyScreen('orders')}
                    >
                      <span className="chip-label">Active Orders</span>
                      <strong className="chip-val font-mono">{myOrders.length} In Pipe</strong>
                      <span className="chip-badge success">4-Stage</span>
                    </div>
                  </div>

                  {/* Urgent Requisition Banner CTA */}
                  <div className="urgent-requisition-banner">
                    <div className="urgent-badge-label">CRITICAL CARE DISPATCH</div>
                    <h4>Need Urgent Life-Saving Medicines?</h4>
                    <p>Immediate prioritization & dedicated rider allocation.</p>
                    <button
                      className="btn-urgent-order"
                      onClick={() => {
                        setNewOrderType('urgent');
                        setShowOrderModal(true);
                      }}
                    >
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                      <span>1-Tap Urgent Requisition</span>
                    </button>
                  </div>

                  {/* Recent Orders Status Widget */}
                  <div className="mobile-section-block">
                    <div className="sec-header">
                      <h4>Recent Order Requisitions</h4>
                      <button
                        className="sec-link"
                        onClick={() => setPharmacyScreen('orders')}
                      >
                        All Orders →
                      </button>
                    </div>

                    <div className="recent-orders-list">
                      {myOrders.slice(0, 3).map(o => (
                        <div key={o.id} className="mobile-order-item">
                          <div className="item-top">
                            <span className="order-code font-mono">{o.id}</span>
                            <span className={`badge-stage-mobile stage-${o.stage}`}>
                              {o.stage.toUpperCase()}
                            </span>
                          </div>
                          <div className="item-meds">
                            {o.items.map(i => `${i.name} (x${i.qty})`).join(', ')}
                          </div>
                          <div className="item-bottom font-mono">
                            <span className="item-price">Rs. {o.totalPkr.toLocaleString()}</span>
                            <span className="item-date">{o.createdAt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ════════════ SCREEN 3: ORDERS LIFECYCLE TRACING ════════════ */}
              {pharmacyScreen === 'orders' && (
                <div className="screen-inner-scroll animate-fade-in">
                  <div className="orders-top-action">
                    <div>
                      <h3 className="screen-title">Requisitions & Tracing</h3>
                      <p className="screen-sub">4-Stage live dispatch pipeline</p>
                    </div>
                    <button
                      className="btn-mini-primary"
                      onClick={() => setShowOrderModal(true)}
                    >
                      + New Order
                    </button>
                  </div>

                  {/* Normal vs Urgent Separation Tabs */}
                  <div className="mobile-filter-pills">
                    <button
                      className={`filter-pill ${orderFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setOrderFilter('all')}
                    >
                      All ({myOrders.length})
                    </button>
                    <button
                      className={`filter-pill ${orderFilter === 'urgent' ? 'active' : ''}`}
                      onClick={() => setOrderFilter('urgent')}
                    >
                      Urgent ({myOrders.filter(o => o.orderType === 'urgent').length})
                    </button>
                    <button
                      className={`filter-pill ${orderFilter === 'normal' ? 'active' : ''}`}
                      onClick={() => setOrderFilter('normal')}
                    >
                      Normal ({myOrders.filter(o => o.orderType === 'normal').length})
                    </button>
                  </div>

                  {/* Orders Cards with 4-Stage Tracker */}
                  <div className="mobile-orders-cards">
                    {filteredOrders.map(o => (
                      <div key={o.id} className="detailed-order-card">
                        <div className="card-header-row">
                          <div>
                            <span className="order-id font-mono">{o.id}</span>
                            <span className={`tag-${o.orderType}`}>
                              {o.orderType.toUpperCase()}
                            </span>
                          </div>
                          <span className="order-val font-mono">Rs. {o.totalPkr.toLocaleString()}</span>
                        </div>

                        {/* 4-Stage Stepper Bar */}
                        <div className="stage-stepper">
                          {['submitted', 'confirmed', 'packed', 'dispatched'].map((stg, i) => {
                            const stagesList = ['submitted', 'confirmed', 'packed', 'dispatched'];
                            const isDone = stagesList.indexOf(o.stage) >= i;
                            return (
                              <div key={stg} className={`step-dot-wrap ${isDone ? 'done' : ''}`}>
                                <div className="step-circle">{i + 1}</div>
                                <span className="step-lbl capitalize">{stg}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="order-sku-list">
                          {o.items.map((it, idx) => (
                            <div key={idx} className="sku-line">
                              <span>{it.name} ({it.pack})</span>
                              <span className="font-mono font-bold">Qty: {it.qty}</span>
                            </div>
                          ))}
                        </div>

                        {o.riderName && (
                          <div className="rider-manifest-chip">
                            <span className="material-symbols-outlined text-xs">two_wheeler</span>
                            <span>{o.riderName}</span>
                            {o.eta && <span className="eta-tag">{o.eta}</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ════════════ SCREEN 4: 6-MONTH EXPIRY INTIMATIONS ════════════ */}
              {pharmacyScreen === 'expiry' && (
                <div className="screen-inner-scroll animate-fade-in">
                  <div className="expiry-header">
                    <h3 className="screen-title">6-Month Expiry Intimations</h3>
                    <p className="screen-sub">DRAP mandated early notification portal</p>
                  </div>

                  {/* Policy Box */}
                  <div className="drap-mandate-card">
                    <span className="mandate-badge">MANDATORY DRAP TIMELINE</span>
                    <p>
                      Notify stocks at least <strong>6 months before expiry date</strong> to guarantee 100% principal credit notes without penalty.
                    </p>
                  </div>

                  {/* Dual Mode Switcher */}
                  <div className="workflow-tab-switch">
                    <button
                      className={`tab-btn ${expiryTab === 'manual' ? 'active' : ''}`}
                      onClick={() => setExpiryTab('manual')}
                    >
                      Manual Batch Entry
                    </button>
                    <button
                      className={`tab-btn ${expiryTab === 'auto' ? 'active' : ''}`}
                      onClick={() => setExpiryTab('auto')}
                    >
                      1-Tap Auto-Intimation
                    </button>
                  </div>

                  {expiryTab === 'manual' ? (
                    <form className="expiry-form-card" onSubmit={handleManualExpirySubmit}>
                      <div className="m-field">
                        <label>Medicine / SKU Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Augmentin 625mg Tab"
                          value={expProduct}
                          onChange={e => setExpProduct(e.target.value)}
                          required
                        />
                      </div>

                      <div className="m-field">
                        <label>Pharma Principal</label>
                        <select
                          value={expPrincipal}
                          onChange={e => setExpPrincipal(e.target.value)}
                        >
                          <option>GSK Pakistan</option>
                          <option>Sanofi Pakistan</option>
                          <option>Getz Pharma</option>
                          <option>Abbott Laboratories</option>
                          <option>Pfizer Pakistan</option>
                        </select>
                      </div>

                      <div className="grid-2-col">
                        <div className="m-field">
                          <label>Batch Number</label>
                          <input
                            type="text"
                            placeholder="e.g. BT-99021"
                            value={expBatch}
                            onChange={e => setExpBatch(e.target.value)}
                            required
                          />
                        </div>
                        <div className="m-field">
                          <label>Expiry Date</label>
                          <input
                            type="date"
                            value={expDate}
                            onChange={e => setExpDate(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="m-field">
                        <label>Pack Quantity for Return</label>
                        <input
                          type="number"
                          value={expQty}
                          onChange={e => setExpQty(e.target.value)}
                          required
                        />
                      </div>

                      <button type="submit" className="btn-counter-primary">
                        <span className="material-symbols-outlined">send</span>
                        <span>Submit 6-Month Intimation</span>
                      </button>
                    </form>
                  ) : (
                    <div className="auto-intimation-list">
                      <p className="auto-info-text">
                        System detected near-expiry stock from your verified delivery invoices:
                      </p>
                      {autoInvoicedBatches.map(b => (
                        <div key={b.batch} className="auto-batch-card">
                          <div>
                            <strong>{b.name}</strong>
                            <span className="text-xs text-muted block font-mono">
                              Batch #{b.batch} • Exp: {b.exp}
                            </span>
                            <span className="text-xs text-teal font-semibold">
                              From {b.invoice} ({b.qty} units)
                            </span>
                          </div>
                          <button
                            className="btn-auto-intimate"
                            onClick={() => handleAutoIntimate(b)}
                          >
                            1-Tap Intimate
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Past Intimations History */}
                  <div className="past-intimations-block">
                    <h4>Submitted Intimations Log</h4>
                    {expiryIntimations.map(exp => (
                      <div key={exp.id} className="intimation-card-mini">
                        <div className="i-top">
                          <strong>{exp.productName}</strong>
                          <span className={`status-pill ${exp.status}`}>{exp.status}</span>
                        </div>
                        <div className="i-bottom font-mono text-xs text-muted">
                          <span>Batch: {exp.batchNo}</span>
                          <span>Credit: Rs. {exp.creditNoteAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ════════════ SCREEN 5: ANNOUNCEMENTS & EVENTS ════════════ */}
              {pharmacyScreen === 'announcements' && (
                <div className="screen-inner-scroll animate-fade-in">
                  <div className="ann-header">
                    <h3 className="screen-title">Broadcasts & Events</h3>
                    <p className="screen-sub">Official distributor notices and schemes</p>
                  </div>

                  <div className="announcements-mobile-list">
                    {broadcasts.map(b => {
                      const isAck = acknowledgements.some(
                        a => a.announcementId === b.id && a.pharmacyId === '501390'
                      );
                      return (
                        <div key={b.id} className="mobile-broadcast-card">
                          <div className="b-top">
                            <span className="b-category-pill">{b.category}</span>
                            <span className="b-date text-xs text-muted">{b.publishedAt}</span>
                          </div>
                          <h4 className="b-title">{b.title}</h4>
                          <p className="b-content">{b.content}</p>

                          <div className="b-ack-bar">
                            {isAck ? (
                              <span className="acknowledged-tag">
                                <span className="material-symbols-outlined text-xs">verified</span>
                                <span>Acknowledged by Dr. Aamir Khan (RPh)</span>
                              </span>
                            ) : (
                              <button
                                className="btn-acknowledge"
                                onClick={() => acknowledgeBroadcast(b.id)}
                              >
                                <span className="material-symbols-outlined text-xs">edit_note</span>
                                <span>Acknowledge Notice (Sign)</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ════════════ SCREEN 6: HELPDESK TICKETING CENTER ════════════ */}
              {pharmacyScreen === 'helpdesk' && (
                <div className="screen-inner-scroll animate-fade-in">
                  <div className="helpdesk-header">
                    <div>
                      <h3 className="screen-title">Counter Support Hotline</h3>
                      <p className="screen-sub">Direct link to distributor management</p>
                    </div>
                    <button
                      className="btn-mini-primary"
                      onClick={() => setShowTicketModal(true)}
                    >
                      + New Ticket
                    </button>
                  </div>

                  <div className="tickets-mobile-list">
                    {tickets.map(t => (
                      <div key={t.ticketId} className="ticket-card-mobile">
                        <div className="t-top">
                          <span className="t-id font-mono">{t.ticketId}</span>
                          <span className={`t-status-badge status-${t.status.toLowerCase().replace(/\s+/g, '_')}`}>
                            {t.status}
                          </span>
                        </div>
                        <h4 className="t-subject">{t.subject}</h4>
                        <span className="t-category">{t.category}</span>
                        <div className="t-messages">
                          {t.messages.map((m, idx) => (
                            <div key={idx} className="t-msg-row">
                              <span className="m-sender">{m.sender}:</span>
                              <span className="m-text">{m.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── Bottom Navigation Bar ─── */}
              <nav className="counter-bottom-nav">
                <button
                  className={`nav-tab-btn ${pharmacyScreen === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setPharmacyScreen('dashboard')}
                >
                  <span className="material-symbols-outlined">dashboard</span>
                  <span>Home</span>
                </button>

                <button
                  className={`nav-tab-btn ${pharmacyScreen === 'orders' ? 'active' : ''}`}
                  onClick={() => setPharmacyScreen('orders')}
                >
                  <span className="material-symbols-outlined">local_shipping</span>
                  <span>Orders</span>
                </button>

                <button
                  className={`nav-tab-btn ${pharmacyScreen === 'expiry' ? 'active' : ''}`}
                  onClick={() => setPharmacyScreen('expiry')}
                >
                  <span className="material-symbols-outlined">warning</span>
                  <span>Expiries</span>
                </button>

                <button
                  className={`nav-tab-btn ${pharmacyScreen === 'announcements' ? 'active' : ''}`}
                  onClick={() => setPharmacyScreen('announcements')}
                >
                  <span className="material-symbols-outlined">campaign</span>
                  <span>Notices</span>
                </button>

                <button
                  className={`nav-tab-btn ${pharmacyScreen === 'helpdesk' ? 'active' : ''}`}
                  onClick={() => setPharmacyScreen('helpdesk')}
                >
                  <span className="material-symbols-outlined">support_agent</span>
                  <span>Help</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* ─── MODAL: NEW ORDER REQUISITION ─── */}
      {showOrderModal && (
        <div className="modal-backdrop" onClick={() => setShowOrderModal(false)}>
          <div className="modal-box mobile-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>New Requisition to Distributor</h3>
              <button className="btn-close" onClick={() => setShowOrderModal(false)}>✕</button>
            </div>

            <form onSubmit={handlePlaceOrder}>
              <div className="m-field">
                <label>Requisition Priority</label>
                <div className="priority-toggle">
                  <button
                    type="button"
                    className={`btn-priority ${newOrderType === 'urgent' ? 'urgent-active' : ''}`}
                    onClick={() => setNewOrderType('urgent')}
                  >
                    ⚡ Urgent Critical Care
                  </button>
                  <button
                    type="button"
                    className={`btn-priority ${newOrderType === 'normal' ? 'normal-active' : ''}`}
                    onClick={() => setNewOrderType('normal')}
                  >
                    📦 Normal Stock Requisition
                  </button>
                </div>
              </div>

              <div className="m-field">
                <label>Select Medicine from Catalog</label>
                <select
                  value={selectedMedicine}
                  onChange={e => setSelectedMedicine(e.target.value)}
                >
                  {catalogMedicines.map(m => (
                    <option key={m.name} value={m.name}>
                      {m.name} ({m.pack}) — Rs. {m.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="m-field">
                <label>Packs Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={orderQty}
                  onChange={e => setOrderQty(e.target.value)}
                  required
                />
              </div>

              <div className="m-field">
                <label>Counter Clinical Notes</label>
                <input
                  type="text"
                  placeholder="e.g. ICU cardiac emergency requirement"
                  value={orderNotes}
                  onChange={e => setOrderNotes(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn-counter-primary">
                  Transmit Order to Distributor →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: NEW SUPPORT TICKET ─── */}
      {showTicketModal && (
        <div className="modal-backdrop" onClick={() => setShowTicketModal(false)}>
          <div className="modal-box mobile-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Submit Counter Support Ticket</h3>
              <button className="btn-close" onClick={() => setShowTicketModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateTicket}>
              <div className="m-field">
                <label>Issue Category</label>
                <select
                  value={ticketCategory}
                  onChange={e => setTicketCategory(e.target.value)}
                >
                  <option>Damaged Packets</option>
                  <option>Short Delivery</option>
                  <option>Invoice Discrepancy</option>
                  <option>Cold Chain Excursion</option>
                </select>
              </div>

              <div className="m-field">
                <label>Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Broken carton seal on consignment CN-490218"
                  value={ticketSubject}
                  onChange={e => setTicketSubject(e.target.value)}
                  required
                />
              </div>

              <div className="m-field">
                <label>Detailed Message</label>
                <textarea
                  rows={3}
                  placeholder="Describe the issue for warehouse and dispatch manager review..."
                  value={ticketMsg}
                  onChange={e => setTicketMsg(e.target.value)}
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn-counter-primary">
                  Submit Issue Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
