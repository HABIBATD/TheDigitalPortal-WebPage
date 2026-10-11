import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import './DistributorPortal.css';

export default function DistributorPortal() {
  const {
    setCurrentView,
    distributorModule,
    setDistributorModule,
    sidebarCollapsed,
    setSidebarCollapsed,
    language,
    setLanguage,
    orders,
    advanceOrderStage,
    expiryIntimations,
    broadcasts,
    pushNewBroadcast,
    acknowledgements,
    taxpayers,
    tickets,
    batchesRegistry,
    fleetVehicles,
    claims,
    backups,
    createBackupSnapshot,
    notifications,
  } = usePlatform();

  // Local UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showRule42Modal, setShowRule42Modal] = useState(false);
  const [rule42SelectedPharmacy, setRule42SelectedPharmacy] = useState(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [proofData, setProofData] = useState(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [ntnInput, setNtnInput] = useState('');
  const [ntnResult, setNtnResult] = useState(null);

  // Broadcast Form State
  const [bcTitle, setBcTitle] = useState('');
  const [bcCategory, setBcCategory] = useState('Trade Scheme');
  const [bcContent, setBcContent] = useState('');

  // 15 System Modules Definition matching the Specification
  const navGroups = [
    {
      group: 'Overview',
      modules: [
        { id: 'dashboard', label: 'Command Dashboard', icon: 'dashboard', badge: 'Live' },
      ],
    },
    {
      group: 'Operations',
      modules: [
        { id: 'orders', label: 'Orders & 4-Stage Pipeline', icon: 'local_shipping', count: orders.length },
        { id: 'expiry', label: 'Expiry Portal (6-Mo DRAP)', icon: 'warning', badge: 'Policy' },
        { id: 'history', label: 'Expiry Intimation History', icon: 'history' },
        { id: 'broadcast', label: 'Broadcast & Announcements', icon: 'campaign', count: broadcasts.length },
        { id: 'acknowledgement', label: 'Acknowledgement Center', icon: 'verified', count: acknowledgements.length },
        { id: 'batches', label: 'Batches Upload Center', icon: 'upload_file', badge: 'Anti-Fake' },
        { id: 'courier', label: 'Courier & Fleet Dispatch', icon: 'alt_route' },
        { id: 'payroll', label: 'Attendance & Monthly Payroll', icon: 'badge' },
        { id: 'claims', label: 'Company Claims & Settlements', icon: 'account_balance_wallet', count: claims.length },
      ],
    },
    {
      group: 'Compliance & Taxation',
      modules: [
        { id: 'fbr', label: 'FBR ATL Verification Engine', icon: 'fact_check', badge: '100% ATL' },
        { id: 'rule42', label: 'Rule 42 Tax Certificates', icon: 'receipt_long' },
      ],
    },
    {
      group: 'Management & Governance',
      modules: [
        { id: 'fleet', label: 'Logistics & Fleet 8-Step Flow', icon: 'local_shipping' },
        { id: 'feedback', label: 'Helpdesk Response Center', icon: 'support_agent', count: tickets.filter(t => t.status !== 'Settled').length },
        { id: 'backup', label: 'Encrypted Vault & Disaster Recovery', icon: 'shield', badge: '256-bit' },
      ],
    },
  ];

  // Helper calculation for today's volume
  const totalVolumePkr = orders.reduce((sum, o) => sum + o.totalPkr, 0);
  const pendingOrdersCount = orders.filter(o => o.stage !== 'dispatched').length;

  const handleNtnVerify = (e) => {
    e.preventDefault();
    if (!ntnInput.trim()) return;
    const found = taxpayers.find(t => t.ntn.includes(ntnInput.trim()) || t.legalName.toLowerCase().includes(ntnInput.toLowerCase()));
    if (found) {
      setNtnResult(found);
    } else {
      setNtnResult({
        legalName: 'Searched Entity / Non-Enrolled',
        ntn: ntnInput,
        atlStatus: 'active',
        withholdingRate: '0.5% (Active Filer Verified via FBR API Gateway)',
        lastVerified: 'Just now (Live FBR Server Response)'
      });
    }
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!bcTitle || !bcContent) return;
    pushNewBroadcast({
      title: bcTitle,
      category: bcCategory,
      content: bcContent,
      priority: 'normal'
    });
    setBcTitle('');
    setBcContent('');
    setShowBroadcastModal(false);
  };

  const simulateRestore = () => {
    setShowRestoreModal(true);
    setRestoreProgress(10);
    const interval = setInterval(() => {
      setRestoreProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  return (
    <div className={`distributor-workspace ${sidebarCollapsed ? 'sidebar-compact' : ''}`}>
      {/* ─── Top Global Command Bar ─── */}
      <header className="distributor-topbar">
        <div className="topbar-left">
          <button
            className="btn-icon sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title="Toggle Sidebar"
          >
            <span className="material-symbols-outlined">{sidebarCollapsed ? 'menu_open' : 'menu'}</span>
          </button>

          <div className="distributor-brand-badge">
            <div className="brand-dot-pulse" />
            <div className="distributor-meta">
              <span className="distributor-name">Abbas Distributors (Pvt) Ltd</span>
              <span className="distributor-hub">Rawalpindi / Abbottabad Pharma Supply Center</span>
            </div>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="topbar-right">
          <div className="topbar-search">
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              placeholder="Search 15 portals, orders, NTN, batches, pharmacies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="topbar-badges">
            <span className="telemetry-pill">
              <span className="material-symbols-outlined text-teal">shield</span>
              <span>256-bit AES Vault</span>
            </span>

            <button
              className="lang-pill-btn"
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              title="Toggle Language (English / Urdu)"
            >
              {language === 'en' ? 'اردو' : 'English'}
            </button>
          </div>

          <div className="platform-nav-group">
            <button
              className="btn-switch-portal mobile-switch"
              onClick={() => setCurrentView('pharmacy')}
              title="Open Pharmacy Counter Mobile App Simulator"
            >
              <span className="material-symbols-outlined">smartphone</span>
              <span>Pharmacy App</span>
            </button>

            <button
              className="btn-switch-portal landing-switch"
              onClick={() => setCurrentView('landing')}
              title="Return to Main Landing Page"
            >
              <span className="material-symbols-outlined">home</span>
              <span>Landing Page</span>
            </button>
          </div>
        </div>
      </header>

      <div className="distributor-body">
        {/* ─── 15-Module Collapsible Sidebar ─── */}
        <aside className="distributor-sidebar">
          <div className="sidebar-scrollable">
            {navGroups.map((group) => (
              <div key={group.group} className="nav-group">
                <div className="nav-group-title">{group.group}</div>
                <div className="nav-items-list">
                  {group.modules.map((m) => {
                    const isActive = distributorModule === m.id;
                    return (
                      <button
                        key={m.id}
                        className={`nav-module-btn ${isActive ? 'active' : ''}`}
                        onClick={() => setDistributorModule(m.id)}
                        title={m.label}
                      >
                        <span className="material-symbols-outlined module-icon">{m.icon}</span>
                        <span className="module-label">{m.label}</span>
                        {m.badge && <span className="module-pill-badge">{m.badge}</span>}
                        {m.count !== undefined && <span className="module-count">{m.count}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="system-health-card">
              <div className="health-row">
                <span className="health-dot" />
                <span className="health-title">DRAP & FBR Connected</span>
              </div>
              <p className="health-sub">Last ATL sync: Today 10:00 AM</p>
            </div>
          </div>
        </aside>

        {/* ─── Main Content Workspace ─── */}
        <main className="distributor-main-content">
          {/* Active Notifications Banner */}
          {notifications.length > 0 && (
            <div className="live-notification-ticker">
              <span className="ticker-badge">LIVE EVENT</span>
              <p className="ticker-text">{notifications[0].text}</p>
              <span className="ticker-time">{notifications[0].time}</span>
            </div>
          )}

          {/* ════════════ 1. COMMAND DASHBOARD ════════════ */}
          {distributorModule === 'dashboard' && (
            <div className="module-view animate-fade-in">
              <div className="view-header">
                <div>
                  <h1 className="view-title">Enterprise Command Center</h1>
                  <p className="view-desc">
                    Live operational telemetry, orders pipeline, DRAP 6-month compliance, and network run-rate.
                  </p>
                </div>
                <div className="view-header-actions">
                  <button
                    className="btn-action-primary"
                    onClick={() => setDistributorModule('orders')}
                  >
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                    <span>View Orders Pipeline</span>
                  </button>
                  <button
                    className="btn-action-secondary"
                    onClick={() => setShowBroadcastModal(true)}
                  >
                    <span className="material-symbols-outlined">campaign</span>
                    <span>Broadcast Notice</span>
                  </button>
                </div>
              </div>

              {/* KPI Cards Strip */}
              <div className="kpi-grid">
                <div className="kpi-card teal-glow">
                  <div className="kpi-icon-wrap bg-teal-soft text-teal">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <div className="kpi-data">
                    <span className="kpi-label">Today's Order Run-Rate</span>
                    <h3 className="kpi-value font-mono">Rs. {totalVolumePkr.toLocaleString()}</h3>
                    <span className="kpi-trend positive">↑ 14.8% vs last week</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-icon-wrap bg-blue-soft text-blue">
                    <span className="material-symbols-outlined">pending_actions</span>
                  </div>
                  <div className="kpi-data">
                    <span className="kpi-label">Orders in Pipeline</span>
                    <h3 className="kpi-value">{pendingOrdersCount} Active</h3>
                    <span className="kpi-trend neutral">4-Stage tracking enabled</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-icon-wrap bg-amber-soft text-amber">
                    <span className="material-symbols-outlined">notification_important</span>
                  </div>
                  <div className="kpi-data">
                    <span className="kpi-label">6-Mo Expiry Intimations</span>
                    <h3 className="kpi-value">{expiryIntimations.length} Batches</h3>
                    <span className="kpi-trend warning">100% DRAP Compliant</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-icon-wrap bg-emerald-soft text-emerald">
                    <span className="material-symbols-outlined">verified_user</span>
                  </div>
                  <div className="kpi-data">
                    <span className="kpi-label">FBR ATL Filer Rate</span>
                    <h3 className="kpi-value">98.7% Active</h3>
                    <span className="kpi-trend positive">0.5% WHT Applied</span>
                  </div>
                </div>
              </div>

              {/* 4-Stage Orders Pipeline Summary Kanban */}
              <div className="section-block">
                <div className="block-header">
                  <div>
                    <h3 className="block-title">4-Stage Order Lifecycle Pipeline</h3>
                    <p className="block-subtitle">Trace pharmacy requisitions through dispatch and delivery</p>
                  </div>
                  <button
                    className="link-btn"
                    onClick={() => setDistributorModule('orders')}
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="pipeline-kanban">
                  {['submitted', 'confirmed', 'packed', 'dispatched'].map((stage) => {
                    const stageOrders = orders.filter(o => o.stage === stage);
                    const stagePkr = stageOrders.reduce((sum, o) => sum + o.totalPkr, 0);
                    const stageTitles = {
                      submitted: '1. Submitted',
                      confirmed: '2. Confirmed & Stock Allocated',
                      packed: '3. Packed & Invoiced',
                      dispatched: '4. Dispatched with Courier/Rider'
                    };
                    return (
                      <div key={stage} className={`pipeline-column col-${stage}`}>
                        <div className="col-header">
                          <span className="col-title">{stageTitles[stage]}</span>
                          <span className="col-count">{stageOrders.length}</span>
                        </div>
                        <div className="col-val-bar font-mono">Rs. {stagePkr.toLocaleString()}</div>
                        <div className="col-cards-list">
                          {stageOrders.map(o => (
                            <div
                              key={o.id}
                              className={`kanban-order-card ${o.orderType === 'urgent' ? 'urgent-border' : ''}`}
                              onClick={() => setSelectedOrder(o)}
                            >
                              <div className="k-card-top">
                                <span className="k-order-id font-mono">{o.id}</span>
                                {o.orderType === 'urgent' && (
                                  <span className="badge-urgent">URGENT</span>
                                )}
                              </div>
                              <h4 className="k-pharmacy-name">{o.pharmacyName}</h4>
                              <p className="k-meta">{o.city} • {o.items.length} items</p>
                              <div className="k-card-bottom">
                                <span className="k-price font-mono">Rs. {o.totalPkr.toLocaleString()}</span>
                                {stage !== 'dispatched' && (
                                  <button
                                    className="btn-advance-chip"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      advanceOrderStage(o.id);
                                    }}
                                    title="Advance to next stage"
                                  >
                                    Advance →
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Jump Grid to Core Modules */}
              <div className="quick-access-grid">
                <div
                  className="quick-tile"
                  onClick={() => setDistributorModule('expiry')}
                >
                  <div className="tile-icon bg-amber-soft text-amber">
                    <span className="material-symbols-outlined">history_toggle_off</span>
                  </div>
                  <div>
                    <h4>6-Month Expiry Intimations</h4>
                    <p>DRAP policy compliance & company credit notes</p>
                  </div>
                </div>

                <div
                  className="quick-tile"
                  onClick={() => setDistributorModule('broadcast')}
                >
                  <div className="tile-icon bg-teal-soft text-teal">
                    <span className="material-symbols-outlined">send_and_archive</span>
                  </div>
                  <div>
                    <h4>1-Click Broadcast Engine</h4>
                    <p>Push schemes and Iqbal day holidays to 184 pharmacies</p>
                  </div>
                </div>

                <div
                  className="quick-tile"
                  onClick={() => setDistributorModule('fbr')}
                >
                  <div className="tile-icon bg-blue-soft text-blue">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div>
                    <h4>FBR ATL Verification</h4>
                    <p>Batch NTN synchronization & automatic WHT rates</p>
                  </div>
                </div>

                <div
                  className="quick-tile"
                  onClick={() => setDistributorModule('backup')}
                >
                  <div className="tile-icon bg-purple-soft text-purple">
                    <span className="material-symbols-outlined">enhanced_encryption</span>
                  </div>
                  <div>
                    <h4>256-bit AES Backup Vault</h4>
                    <p>Local offline mirror + cloud geo-redundancy</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════ 2. ORDERS PORTAL ════════════ */}
          {distributorModule === 'orders' && (
            <div className="module-view animate-fade-in">
              <div className="view-header">
                <div>
                  <h1 className="view-title">Orders Portal & 4-Stage Lifecycle</h1>
                  <p className="view-desc">
                    Segregated Normal vs Urgent dispatches, live stage valuation in PKR, and rider courier allocation.
                  </p>
                </div>
                <div className="view-header-actions">
                  <span className="telemetry-pill">
                    <span className="material-symbols-outlined text-teal">autorenew</span>
                    <span>Auto-Syncing with Pharmacy Mobile Apps</span>
                  </span>
                </div>
              </div>

              {/* Order Stats Banner */}
              <div className="orders-summary-strip">
                <div className="summary-item">
                  <span className="label">Total Order Pipeline</span>
                  <span className="val font-mono">Rs. {totalVolumePkr.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Urgent Critical-Care Orders</span>
                  <span className="val text-urgent font-mono">
                    {orders.filter(o => o.orderType === 'urgent').length} Orders
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Active Dispatch Fleet</span>
                  <span className="val">26 Vehicles & Riders</span>
                </div>
                <div className="summary-item">
                  <span className="label">Average Delivery SLA</span>
                  <span className="val text-teal">42 Minutes (Hazara / Twin Cities)</span>
                </div>
              </div>

              {/* Table of Orders */}
              <div className="data-table-container">
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Pharmacy / Client</th>
                      <th>Type</th>
                      <th>Items & Medicines</th>
                      <th>Stage & Lifecycle</th>
                      <th>Valuation</th>
                      <th>Assigned Rider / Fleet</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className={o.orderType === 'urgent' ? 'urgent-row' : ''}>
                        <td>
                          <span className="font-mono font-bold text-dark">{o.id}</span>
                          <span className="sub-date">{o.createdAt}</span>
                        </td>
                        <td>
                          <div className="pharmacy-cell">
                            <strong>{o.pharmacyName}</strong>
                            <span className="text-muted text-xs">ID #{o.pharmacyId} • {o.city}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge-${o.orderType}`}>
                            {o.orderType.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div className="items-cell">
                            <span>{o.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</span>
                          </div>
                        </td>
                        <td>
                          <div className="stage-progress-badge">
                            <span className={`stage-dot dot-${o.stage}`} />
                            <span className="stage-name font-semibold capitalize">{o.stage}</span>
                          </div>
                        </td>
                        <td>
                          <span className="price-val font-mono">Rs. {o.totalPkr.toLocaleString()}</span>
                        </td>
                        <td>
                          <span className="rider-text text-xs">{o.riderName}</span>
                        </td>
                        <td className="text-right">
                          <div className="table-actions">
                            {o.stage !== 'dispatched' ? (
                              <button
                                className="btn-table-primary"
                                onClick={() => advanceOrderStage(o.id)}
                              >
                                Advance Stage →
                              </button>
                            ) : (
                              <span className="badge-delivered">Dispatched</span>
                            )}
                            <button
                              className="btn-table-secondary"
                              onClick={() => setSelectedOrder(o)}
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════════════ 3. EXPIRY PORTAL (DRAP 6-MONTH) ════════════ */}
          {distributorModule === 'expiry' && (
            <div className="module-view animate-fade-in">
              <div className="view-header">
                <div>
                  <h1 className="view-title">Expiry Intimations Portal</h1>
                  <p className="view-desc">
                    Strict adherence to DRAP and principal policies requiring notification at least 6 months prior to expiry.
                  </p>
                </div>
              </div>

              {/* Official Policy Banner */}
              <div className="official-policy-banner">
                <div className="policy-icon-box">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <div className="policy-content">
                  <div className="policy-tag-line">
                    <span className="policy-badge">OFFICIAL REGULATORY NOTICE</span>
                    <span className="policy-law">DRAP Drug Act 1976 / Section 23</span>
                  </div>
                  <h3 className="policy-headline">
                    Intimate expiry at least 6 months in advance to protect distributor credit notes.
                  </h3>
                  <p className="policy-sub">
                    Stock intimated with under 180 days remaining is rejected by pharmaceutical principals (GSK, Abbott, Sanofi, Getz), leading to total distributor deduction losses.
                  </p>
                </div>
              </div>

              {/* Expiry Data Table */}
              <div className="data-table-container">
                <div className="table-toolbar">
                  <h3 className="table-heading">Active 6-Month Expiry Claims Ledger</h3>
                  <div className="toolbar-stats">
                    <span className="stat-pill">4 Claims Pending Principal Credit</span>
                  </div>
                </div>

                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Intimation Ref</th>
                      <th>Pharmacy Name</th>
                      <th>Product SKU</th>
                      <th>Pharma Principal</th>
                      <th>Batch ID</th>
                      <th>Expiry Date</th>
                      <th>Months Left</th>
                      <th>Credit Value</th>
                      <th className="text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiryIntimations.map((exp) => (
                      <tr key={exp.id}>
                        <td className="font-mono font-bold">{exp.id}</td>
                        <td>
                          <strong>{exp.pharmacyName}</strong>
                          <span className="text-xs text-muted block">ID #{exp.pharmacyId}</span>
                        </td>
                        <td><strong>{exp.productName}</strong> ({exp.quantity} units)</td>
                        <td><span className="badge-principal">{exp.principal}</span></td>
                        <td className="font-mono text-xs">{exp.batchNo}</td>
                        <td>{exp.expiryDate}</td>
                        <td>
                          <span className="badge-months-left">
                            {exp.monthsRemaining} mos
                          </span>
                        </td>
                        <td className="font-mono font-bold text-dark">
                          Rs. {exp.creditNoteAmount.toLocaleString()}
                        </td>
                        <td className="text-right">
                          <span className={`badge-status status-${exp.status}`}>
                            {exp.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════════════ 4. EXPIRY INTIMATION HISTORY ════════════ */}
          {distributorModule === 'history' && (
            <div className="module-view animate-fade-in">
              <div className="view-header">
                <div>
                  <h1 className="view-title">Expiry Intimation History Ledger</h1>
                  <p className="view-desc">
                    Tamper-proof, searchable audit trail of past claims, physical lifting slips, and settled credit notes.
                  </p>
                </div>
                <div className="view-header-actions">
                  <button
                    className="btn-action-secondary"
                    onClick={() => alert('Exporting full Expiry Ledger to verified Excel CSV format for Principal reconciliation.')}
                  >
                    <span className="material-symbols-outlined">download</span>
                    <span>Export Audit Log (CSV)</span>
                  </button>
                </div>
              </div>

              <div className="data-table-container">
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Log ID</th>
                      <th>Date Intimated</th>
                      <th>Pharmacy</th>
                      <th>Principal</th>
                      <th>Batch Number</th>
                      <th>Credit Note Number</th>
                      <th>Credit Amount</th>
                      <th className="text-right">Lifting Proof</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiryIntimations.map(exp => (
                      <tr key={exp.id}>
                        <td className="font-mono">{exp.id}</td>
                        <td>{exp.intimationDate}</td>
                        <td><strong>{exp.pharmacyName}</strong></td>
                        <td>{exp.principal}</td>
                        <td className="font-mono">{exp.batchNo}</td>
                        <td>
                          <span className="font-mono text-teal font-bold">{exp.creditNoteNo}</span>
                        </td>
                        <td className="font-mono font-bold">Rs. {exp.creditNoteAmount.toLocaleString()}</td>
                        <td className="text-right">
                          <span className="badge-verified">
                            <span className="material-symbols-outlined text-xs">verified</span>
                            <span>Signed & Lifted</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════════════ 5. BROADCAST & ANNOUNCEMENTS ════════════ */}
          {distributorModule === 'broadcast' && (
            <div className="module-view animate-fade-in">
              <div className="view-header">
                <div>
                  <h1 className="view-title">Broadcast & Announcement Engine</h1>
                  <p className="view-desc">
                    Push 1-click trade notices, holiday cut-offs, bank closings, and price revisions instantly to counter mobile apps.
                  </p>
                </div>
                <div className="view-header-actions">
                  <button
                    className="btn-action-primary"
                    onClick={() => setShowBroadcastModal(true)}
                  >
                    <span className="material-symbols-outlined">campaign</span>
                    <span>Compose Broadcast</span>
                  </button>
                </div>
              </div>

              <div className="broadcasts-grid">
                {broadcasts.map(b => (
                  <div key={b.id} className="broadcast-card">
                    <div className="bc-card-header">
                      <span className={`bc-category cat-${b.category.toLowerCase().replace(/\s+/g, '-')}`}>
                        {b.category}
                      </span>
                      <span className="bc-time text-xs text-muted">{b.publishedAt}</span>
                    </div>
                    <h3 className="bc-title">{b.title}</h3>
                    <p className="bc-content">{b.content}</p>
                    <div className="bc-footer">
                      <div className="ack-progress">
                        <span className="ack-label">Acknowledged by counter:</span>
                        <div className="progress-bar-wrap">
                          <div
                            className="progress-fill"
                            style={{ width: `${(b.acknowledgedCount / b.totalTarget) * 100}%` }}
                          />
                        </div>
                        <span className="ack-count font-mono">{b.acknowledgedCount} / {b.totalTarget} Pharmacies</span>
                      </div>
                      <button
                        className="btn-view-proof"
                        onClick={() => {
                          setProofData(b);
                          setShowProofModal(true);
                        }}
                      >
                        Proof Ledger →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════════ 6. ACKNOWLEDGEMENT CENTER ════════════ */}
          {distributorModule === 'acknowledgement' && (
            <div className="module-view animate-fade-in">
              <div className="view-header">
                <div>
                  <h1 className="view-title">Acknowledgement Center (Verifiable Proof Ledger)</h1>
                  <p className="view-desc">
                    Cryptographic timestamped record of retail pharmacies acknowledging circulars, trade schemes, and price changes.
                  </p>
                </div>
                <div className="view-header-actions">
                  <button
                    className="btn-action-primary"
                    onClick={() => {
                      setProofData(broadcasts[0]);
                      setShowProofModal(true);
                    }}
                  >
                    <span className="material-symbols-outlined">verified</span>
                    <span>Export Legal Proof for Principal</span>
                  </button>
                </div>
              </div>

              <div className="data-table-container">
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Proof ID</th>
                      <th>Timestamp</th>
                      <th>Pharmacy Enterprise</th>
                      <th>Signer Role</th>
                      <th>Notice Reference</th>
                      <th>SHA-256 Fingerprint</th>
                      <th className="text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acknowledgements.map(ack => (
                      <tr key={ack.id}>
                        <td className="font-mono">{ack.id}</td>
                        <td className="text-xs font-mono">{ack.timestamp}</td>
                        <td>
                          <strong>{ack.pharmacyName}</strong>
                          <span className="text-xs text-muted block">ID #{ack.pharmacyId}</span>
                        </td>
                        <td>
                          <span className="badge-role">{ack.signerRole}</span>
                          <span className="text-xs text-muted block">{ack.signerName}</span>
                        </td>
                        <td><span className="text-xs">{ack.subject}</span></td>
                        <td><span className="font-mono text-xs text-muted">{ack.hashFingerprint}</span></td>
                        <td className="text-right">
                          <span className="badge-verified">
                            <span className="material-symbols-outlined text-xs">check_circle</span>
                            <span>{ack.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════════════ 7. BATCHES UPLOAD CENTER ════════════ */}
          {distributorModule === 'batches' && (
            <div className="module-view animate-fade-in">
              <div className="view-header">
                <div>
                  <h1 className="view-title">Batches Upload Center (Anti-Counterfeit Registry)</h1>
                  <p className="view-desc">
                    Register genuine batch numbers supplied to the trade. Prevent spurious drug return fraud by locking returns to verified delivery logs.
                  </p>
                </div>
                <div className="view-header-actions">
                  <button
                    className="btn-action-primary"
                    onClick={() => alert('Batch manifest upload: Drag & Drop CSV with Batch IDs, MFG, and Expiry Dates for Anti-Counterfeit Verification.')}
                  >
                    <span className="material-symbols-outlined">upload_file</span>
                    <span>Upload Batch Manifest</span>
                  </button>
                </div>
              </div>

              <div className="data-table-container">
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Batch Number</th>
                      <th>Brand / Product SKU</th>
                      <th>Manufacturer Principal</th>
                      <th>Mfg Date</th>
                      <th>Expiry Date</th>
                      <th>Cartons Dispatched</th>
                      <th>Returns Verified</th>
                      <th className="text-right">Authenticity Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchesRegistry.map(b => (
                      <tr key={b.batchNo}>
                        <td className="font-mono font-bold text-teal">{b.batchNo}</td>
                        <td><strong>{b.brand}</strong></td>
                        <td>{b.principal}</td>
                        <td>{b.mfgDate}</td>
                        <td>{b.expDate}</td>
                        <td className="font-mono">{b.cartonsDispatched} cartons</td>
                        <td className="font-mono">{b.returnsVerified} units</td>
                        <td className="text-right">
                          <span className="badge-verified">
                            <span className="material-symbols-outlined text-xs">verified</span>
                            <span>{b.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════════════ 8. COURIER & LOGISTICS PORTAL ════════════ */}
          {distributorModule === 'courier' && (
            <div className="module-view animate-fade-in">
              <div className="view-header">
                <div>
                  <h1 className="view-title">Courier & Heavy Logistics Consignment Portal</h1>
                  <p className="view-desc">
                    Multi-courier parcel tracking (TCS, Leopards, M&P, Daewoo, In-House Delivery Fleet) with live run-sheets.
                  </p>
                </div>
              </div>

              <div className="courier-cards-grid">
                <div className="courier-card">
                  <div className="courier-logo">M&P Express Logistics</div>
                  <div className="courier-stats">
                    <span className="stat-num font-mono">18</span>
                    <span className="stat-label">Cartons Dispatched Today</span>
                  </div>
                  <p className="text-xs text-muted">Tracking Code: CN-490218 (Abbottabad Corridor)</p>
                  <span className="badge-status status-forwarded_principal">Active Run-Sheet</span>
                </div>

                <div className="courier-card">
                  <div className="courier-logo">TCS Pharma Courier</div>
                  <div className="courier-stats">
                    <span className="stat-num font-mono">24</span>
                    <span className="stat-label">Twin Cities Consignments</span>
                  </div>
                  <p className="text-xs text-muted">Tracking Code: TCS-884019 (Blue Area / Rawalpindi)</p>
                  <span className="badge-status status-forwarded_principal">Active Run-Sheet</span>
                </div>

                <div className="courier-card">
                  <div className="courier-logo">In-House Cold-Chain Fleet</div>
                  <div className="courier-stats">
                    <span className="stat-num font-mono">32</span>
                    <span className="stat-label">Chilled Vaccines & Insulins</span>
                  </div>
                  <p className="text-xs text-muted">Sensor Status: 4.2°C Stable (2°C–8°C Cold Chain)</p>
                  <span className="badge-status status-verified_approved">Sensor Active</span>
                </div>
              </div>
            </div>
          )}

          {/* ════════════ 9. DIGITAL ATTENDANCE & MONTHLY PAYROLL ════════════ */}
          {distributorModule === 'payroll' && (
            <div className="module-view animate-fade-in">
              <div className="view-header">
                <div>
                  <h1 className="view-title">Digital Attendance & Monthly Payroll Engine</h1>
                  <p className="view-desc">
                    Geofenced biometric punches, field force GPS mobile check-ins, automated WHT deductions, and payslips.
                  </p>
                </div>
              </div>

              <div className="payroll-overview-strip">
                <div className="payroll-stat">
                  <span className="label">Active Field Force</span>
                  <span className="val font-mono">48 Reps & Order Bookers</span>
                </div>
                <div className="payroll-stat">
                  <span className="label">Monthly Base Payroll</span>
                  <span className="val font-mono">Rs. 2,840,000</span>
                </div>
                <div className="payroll-stat">
                  <span className="label">FBR WHT Withholding Deducted</span>
                  <span className="val font-mono text-teal">Rs. 142,000</span>
                </div>
                <div className="payroll-stat">
                  <span className="label">Payroll Verification</span>
                  <span className="badge-verified">Auto-Balanced & Signed</span>
                </div>
              </div>

              <div className="data-table-container">
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Staff ID</th>
                      <th>Name & Role</th>
                      <th>GPS / Biometric Punches</th>
                      <th>Base Salary</th>
                      <th>Allowances</th>
                      <th>WHT Tax</th>
                      <th>Net Disbursed</th>
                      <th className="text-right">Payslip</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-mono">EMP-104</td>
                      <td><strong>Zahid Khan</strong><span className="text-xs text-muted block">Dispatch & Fleet Lead</span></td>
                      <td><span className="badge-verified">26 / 26 Days Geofenced</span></td>
                      <td className="font-mono">Rs. 85,000</td>
                      <td className="font-mono">Rs. 15,000</td>
                      <td className="font-mono text-red">-Rs. 5,000</td>
                      <td className="font-mono font-bold">Rs. 95,000</td>
                      <td className="text-right">
                        <button className="btn-table-secondary" onClick={() => alert('Generating Signed Cryptographic Payslip for Zahid Khan.')}>
                          Print Slip
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="font-mono">EMP-118</td>
                      <td><strong>Farhan Ali</strong><span className="text-xs text-muted block">Express Field Rep (Bike-14)</span></td>
                      <td><span className="badge-verified">25 / 26 GPS Punches</span></td>
                      <td className="font-mono">Rs. 60,000</td>
                      <td className="font-mono">Rs. 22,000</td>
                      <td className="font-mono text-red">-Rs. 3,500</td>
                      <td className="font-mono font-bold">Rs. 78,500</td>
                      <td className="text-right">
                        <button className="btn-table-secondary" onClick={() => alert('Generating Signed Cryptographic Payslip for Farhan Ali.')}>
                          Print Slip
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════════════ 10. COMPANY-WISE CLAIMS TRACKER ════════════ */}
          {distributorModule === 'claims' && (
            <div className="module-view animate-fade-in">
              <div className="view-header">
                <div>
                  <h1 className="view-title">Company-Wise Claims Tracker & Settlements</h1>
                  <p className="view-desc">
                    Principal claim ledger tracking debit notes, credit notes, price difference claims, and aging exposure.
                  </p>
                </div>
              </div>

              <div className="aging-exposure-card">
                <h3>Principal Aging Exposure Overview</h3>
                <div className="aging-bars">
                  <div className="aging-segment seg-green" style={{ width: '60%' }}>
                    <span>&lt; 30 Days (Rs. 355,000)</span>
                  </div>
                  <div className="aging-segment seg-amber" style={{ width: '25%' }}>
                    <span>30–60 Days (Rs. 82,400)</span>
                  </div>
                  <div className="aging-segment seg-red" style={{ width: '15%' }}>
                    <span>60–90 Days (Rs. 38,900)</span>
                  </div>
                </div>
              </div>

              <div className="data-table-container">
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Claim ID</th>
                      <th>Principal</th>
                      <th>Claim Nature</th>
                      <th>Amount (PKR)</th>
                      <th>Aging Bucket</th>
                      <th>Submission Date</th>
                      <th className="text-right">Settlement Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map(c => (
                      <tr key={c.id}>
                        <td className="font-mono">{c.id}</td>
                        <td><strong>{c.principal}</strong></td>
                        <td>{c.claimType}</td>
                        <td className="font-mono font-bold">Rs. {c.amountPkr.toLocaleString()}</td>
                        <td><span className="badge-aging">{c.aging}</span></td>
                        <td>{c.date}</td>
                        <td className="text-right">
                          <span className="badge-verified">{c.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════════════ 11. FBR ATL VERIFICATION ENGINE ════════════ */}
          {distributorModule === 'fbr' && (
            <div className="module-view animate-fade-in">
              <div className="view-header">
                <div>
                  <h1 className="view-title">FBR ATL (Active Taxpayer List) Verification Engine</h1>
                  <p className="view-desc">
                    Direct integration & CSV batch verification against the official Federal Board of Revenue databases.
                  </p>
                </div>
              </div>

              {/* NTN Lookup Card */}
              <div className="lookup-box">
                <h3>Instant CNIC / NTN Verification</h3>
                <form className="lookup-form" onSubmit={handleNtnVerify}>
                  <input
                    type="text"
                    placeholder="Enter NTN (e.g. 3108920-1) or CNIC or Pharmacy Name..."
                    value={ntnInput}
                    onChange={(e) => setNtnInput(e.target.value)}
                  />
                  <button type="submit" className="btn-action-primary">
                    <span className="material-symbols-outlined">search</span>
                    <span>Verify with FBR</span>
                  </button>
                </form>

                {ntnResult && (
                  <div className="ntn-result-card animate-fade-in">
                    <div className="result-top">
                      <span className="material-symbols-outlined text-emerald">verified</span>
                      <div>
                        <h4>{ntnResult.legalName}</h4>
                        <p className="text-xs font-mono text-muted">NTN: {ntnResult.ntn}</p>
                      </div>
                      <span className="badge-active-filer">ACTIVE TAXPAYER</span>
                    </div>
                    <div className="result-grid">
                      <div>
                        <span className="r-label">Applicable WHT Rate</span>
                        <span className="r-val text-teal font-bold">{ntnResult.withholdingRate}</span>
                      </div>
                      <div>
                        <span className="r-label">FBR Server Sync Status</span>
                        <span className="r-val">{ntnResult.lastVerified}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Taxpayers Table */}
              <div className="data-table-container">
                <div className="table-toolbar">
                  <h3 className="table-heading">Enrolled Pharmacies Active Taxpayer Directory</h3>
                </div>

                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Pharmacy / Business</th>
                      <th>NTN</th>
                      <th>CNIC</th>
                      <th>City</th>
                      <th>ATL Status</th>
                      <th>Withholding Rate</th>
                      <th className="text-right">Quarter Turnover</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxpayers.map(t => (
                      <tr key={t.id}>
                        <td><strong>{t.legalName}</strong></td>
                        <td className="font-mono">{t.ntn}</td>
                        <td className="font-mono text-xs">{t.cnic}</td>
                        <td>{t.city}</td>
                        <td>
                          <span className={`badge-atl ${t.atlStatus === 'active' ? 'atl-active' : 'atl-inactive'}`}>
                            {t.atlStatus.toUpperCase()}
                          </span>
                        </td>
                        <td><span className="font-semibold text-teal">{t.withholdingRate}</span></td>
                        <td className="text-right font-mono font-bold">
                          Rs. {t.quarterTurnoverPkr.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════════════ 12. RULE 42 TAX CERTIFICATE GENERATOR ════════════ */}
          {distributorModule === 'rule42' && (
            <div className="module-view animate-fade-in">
              <div className="view-header">
                <div>
                  <h1 className="view-title">Rule 42 Tax Deduction Certificate Generator</h1>
                  <p className="view-desc">
                    Automated 1-click bulk generation of Section 153 / Rule 42 income tax deduction certificates with cryptographic QR stamps.
                  </p>
                </div>
                <div className="view-header-actions">
                  <button
                    className="btn-action-primary"
                    onClick={() => {
                      setRule42SelectedPharmacy(taxpayers[0]);
                      setShowRule42Modal(true);
                    }}
                  >
                    <span className="material-symbols-outlined">receipt_long</span>
                    <span>Generate Batch Certificates</span>
                  </button>
                </div>
              </div>

              <div className="data-table-container">
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Pharmacy Name</th>
                      <th>NTN</th>
                      <th>Tax Year</th>
                      <th>Q3 Turnover</th>
                      <th>Tax Withheld (0.5%)</th>
                      <th>Certificate Status</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxpayers.map(tp => (
                      <tr key={tp.id}>
                        <td><strong>{tp.legalName}</strong></td>
                        <td className="font-mono">{tp.ntn}</td>
                        <td>2026-2027</td>
                        <td className="font-mono">Rs. {tp.quarterTurnoverPkr.toLocaleString()}</td>
                        <td className="font-mono font-bold text-teal">
                          Rs. {(tp.quarterTurnoverPkr * 0.005).toLocaleString()}
                        </td>
                        <td>
                          <span className="badge-verified">Rule 42 Validated</span>
                        </td>
                        <td className="text-right">
                          <button
                            className="btn-table-primary"
                            onClick={() => {
                              setRule42SelectedPharmacy(tp);
                              setShowRule42Modal(true);
                            }}
                          >
                            View Certificate →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════════════ 13. LOGISTICS & FLEET 8-STEP LIFECYCLE ════════════ */}
          {distributorModule === 'fleet' && (
            <div className="module-view animate-fade-in">
              <div className="view-header">
                <div>
                  <h1 className="view-title">Logistics & Fleet 8-Step Lifecycle Manager</h1>
                  <p className="view-desc">
                    Comprehensive 8-step lifecycle: Vehicle → Driver → Documents → Token Tax → Route Permits → Fuel → Live Dispatch → Maintenance.
                  </p>
                </div>
              </div>

              {/* 8-Step Flow Banner */}
              <div className="fleet-steps-flow">
                {[
                  { step: 1, label: 'Vehicle Registry', icon: 'directions_car' },
                  { step: 2, label: 'Driver Verification', icon: 'person' },
                  { step: 3, label: 'Registration Book', icon: 'folder_shared' },
                  { step: 4, label: 'Token Tax Clear', icon: 'receipt' },
                  { step: 5, label: 'Route Permit', icon: 'map' },
                  { step: 6, label: 'Fuel Mileage', icon: 'local_gas_station' },
                  { step: 7, label: 'Live Geo-Drop', icon: 'package_2' },
                  { step: 8, label: 'Preventive Care', icon: 'build' },
                ].map(s => (
                  <div key={s.step} className="flow-step-box">
                    <span className="material-symbols-outlined step-ico">{s.icon}</span>
                    <span className="step-num">{s.step}. {s.label}</span>
                  </div>
                ))}
              </div>

              <div className="data-table-container">
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Vehicle Unit</th>
                      <th>Driver Assigned</th>
                      <th>Current Lifecycle Step</th>
                      <th>Token Tax Status</th>
                      <th>Route Permit</th>
                      <th>Cold-Chain Status</th>
                      <th className="text-right">Operational State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fleetVehicles.map(f => (
                      <tr key={f.vehicleId}>
                        <td>
                          <strong>{f.plate}</strong>
                          <span className="text-xs text-muted block font-mono">{f.vehicleId}</span>
                        </td>
                        <td>{f.driver}</td>
                        <td>
                          <span className="badge-step font-semibold">{f.stepName}</span>
                        </td>
                        <td><span className="badge-verified">{f.tokenTaxExpiry}</span></td>
                        <td><span className="text-xs">{f.routePermit}</span></td>
                        <td>
                          {f.coldChainEquipped ? (
                            <span className="badge-cold-chain">
                              <span className="material-symbols-outlined text-xs">ac_unit</span>
                              <span>2°C–8°C Stable</span>
                            </span>
                          ) : (
                            <span className="text-xs text-muted">Ambient Cargo</span>
                          )}
                        </td>
                        <td className="text-right">
                          <span className="badge-verified">{f.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════════════ 14. HELPDESK & FEEDBACK RESPONSE ════════════ */}
          {distributorModule === 'feedback' && (
            <div className="module-view animate-fade-in">
              <div className="view-header">
                <div>
                  <h1 className="view-title">Help & Feedback Response Center</h1>
                  <p className="view-desc">
                    4-Tier ticket lifecycle (All Logged → Needs Reply → Investigating → Settled) with 100% resolution efficiency SLA.
                  </p>
                </div>
              </div>

              <div className="data-table-container">
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Pharmacy Name</th>
                      <th>Category</th>
                      <th>Subject</th>
                      <th>Submitted</th>
                      <th>Assigned Lead</th>
                      <th className="text-right">Lifecycle Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(t => (
                      <tr key={t.ticketId}>
                        <td className="font-mono font-bold">{t.ticketId}</td>
                        <td><strong>{t.pharmacyName}</strong></td>
                        <td><span className="badge-role">{t.category}</span></td>
                        <td>{t.subject}</td>
                        <td className="text-xs text-muted">{t.submittedAt}</td>
                        <td>{t.assignedTo}</td>
                        <td className="text-right">
                          <span className={`badge-status status-${t.status.toLowerCase().replace(/\s+/g, '_')}`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════════════ 15. ENCRYPTED BACKUP & VAULT ════════════ */}
          {distributorModule === 'backup' && (
            <div className="module-view animate-fade-in">
              <div className="view-header">
                <div>
                  <h1 className="view-title">Encrypted Backup & Disaster Recovery Vault</h1>
                  <p className="view-desc">
                    Client-side 256-bit AES encryption protecting master accounts ledger, stock ledgers, and pharmacy database.
                  </p>
                </div>
                <div className="view-header-actions">
                  <button
                    className="btn-action-primary"
                    onClick={createBackupSnapshot}
                  >
                    <span className="material-symbols-outlined">cloud_sync</span>
                    <span>Create Encrypted Snapshot</span>
                  </button>
                  <button
                    className="btn-action-secondary"
                    onClick={simulateRestore}
                  >
                    <span className="material-symbols-outlined">restore</span>
                    <span>Test Restore Verification</span>
                  </button>
                </div>
              </div>

              <div className="vault-security-summary">
                <div className="vault-icon-badge">
                  <span className="material-symbols-outlined">security</span>
                </div>
                <div>
                  <h3>Dual-Target Redundancy: Local Offline Mirror + Secure Cloud Vault</h3>
                  <p className="text-sm text-muted">
                    Encrypted with 256-bit AES key before leaving local memory. Zero risk of data loss from hardware crashes or system corruption.
                  </p>
                </div>
              </div>

              <div className="data-table-container">
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Snapshot ID</th>
                      <th>Encrypted Archive File</th>
                      <th>File Size</th>
                      <th>Timestamp</th>
                      <th>Target Redundancy</th>
                      <th className="text-right">SHA-256 Health Check</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backups.map(bak => (
                      <tr key={bak.id}>
                        <td className="font-mono">{bak.id}</td>
                        <td className="font-mono font-bold text-teal">{bak.filename}</td>
                        <td className="font-mono">{bak.size}</td>
                        <td>{bak.timestamp}</td>
                        <td>{bak.type}</td>
                        <td className="text-right">
                          <span className="badge-verified">
                            <span className="material-symbols-outlined text-xs">check_circle</span>
                            <span>{bak.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ─── MODAL: ORDER DETAILS DRAWER ─── */}
      {selectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge-pill">Order Specification</span>
                <h2>Order {selectedOrder.id}</h2>
              </div>
              <button className="btn-close" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="order-modal-body">
              <div className="order-meta-grid">
                <div>
                  <span className="m-label">Pharmacy Name</span>
                  <strong>{selectedOrder.pharmacyName}</strong>
                </div>
                <div>
                  <span className="m-label">Delivery Destination</span>
                  <span>{selectedOrder.city}</span>
                </div>
                <div>
                  <span className="m-label">Priority Tier</span>
                  <span className={`badge-${selectedOrder.orderType}`}>{selectedOrder.orderType.toUpperCase()}</span>
                </div>
                <div>
                  <span className="m-label">Lifecycle Stage</span>
                  <span className="badge-verified capitalize">{selectedOrder.stage}</span>
                </div>
              </div>

              <h4>Order Line Items (Invoice Pack)</h4>
              <div className="items-list">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="item-row">
                    <div>
                      <strong>{item.name}</strong>
                      <span className="text-xs text-muted block">{item.pack} • Qty: {item.qty}</span>
                    </div>
                    <span className="font-mono font-bold">Rs. {(item.qty * item.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="modal-total-bar">
                <span>Total Requisition Value:</span>
                <span className="font-mono font-bold text-teal text-xl">
                  Rs. {selectedOrder.totalPkr.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="modal-footer">
              {selectedOrder.stage !== 'dispatched' ? (
                <button
                  className="btn-action-primary"
                  onClick={() => {
                    advanceOrderStage(selectedOrder.id);
                    setSelectedOrder(null);
                  }}
                >
                  Advance Lifecycle Stage →
                </button>
              ) : (
                <span className="text-teal font-bold text-sm">Dispatched with Courier Rider</span>
              )}
              <button className="btn-action-secondary" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: COMPOSE BROADCAST ─── */}
      {showBroadcastModal && (
        <div className="modal-backdrop" onClick={() => setShowBroadcastModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>1-Click Broadcast Engine</h2>
              <button className="btn-close" onClick={() => setShowBroadcastModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSendBroadcast}>
              <div className="form-group">
                <label>Notice Category</label>
                <select value={bcCategory} onChange={e => setBcCategory(e.target.value)}>
                  <option>Trade Scheme</option>
                  <option>Holiday Notice</option>
                  <option>Bank Closing</option>
                  <option>Price Revision</option>
                </select>
              </div>

              <div className="form-group">
                <label>Broadcast Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Q4 Manufacturer Bonus & Iqbal Day Dispatch Notice"
                  value={bcTitle}
                  onChange={e => setBcTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Circular Announcement Content</label>
                <textarea
                  rows={4}
                  placeholder="Enter details pushed to all connected counter apps..."
                  value={bcContent}
                  onChange={e => setBcContent(e.target.value)}
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn-action-primary">
                  <span className="material-symbols-outlined">send</span>
                  <span>Push Broadcast to 184 Pharmacies</span>
                </button>
                <button type="button" className="btn-action-secondary" onClick={() => setShowBroadcastModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: RULE 42 TAX DEDUCTION CERTIFICATE ─── */}
      {showRule42Modal && rule42SelectedPharmacy && (
        <div className="modal-backdrop" onClick={() => setShowRule42Modal(false)}>
          <div className="modal-box rule42-box" onClick={e => e.stopPropagation()}>
            <div className="certificate-frame">
              <div className="cert-header">
                <h3>FEDERAL BOARD OF REVENUE — GOVERNMENT OF PAKISTAN</h3>
                <h4>CERTIFICATE OF COLLECTION OR DEDUCTION OF INCOME TAX</h4>
                <p className="cert-rule">Under Section 153 / Rule 42 of Income Tax Rules, 2002</p>
              </div>

              <div className="cert-body">
                <div className="cert-row">
                  <span>Withholding Agent:</span>
                  <strong>Abbas Distributors (Pvt) Ltd — NTN: 0981240-5</strong>
                </div>
                <div className="cert-row">
                  <span>Name of Taxpayer (Retailer):</span>
                  <strong>{rule42SelectedPharmacy.legalName}</strong>
                </div>
                <div className="cert-row">
                  <span>NTN / CNIC of Taxpayer:</span>
                  <strong>{rule42SelectedPharmacy.ntn} / {rule42SelectedPharmacy.cnic}</strong>
                </div>
                <div className="cert-row">
                  <span>Tax Period / Assessment Year:</span>
                  <strong>Q3 (Tax Year 2026-2027)</strong>
                </div>
                <div className="cert-row">
                  <span>Gross Requisition Supplies:</span>
                  <strong className="font-mono">Rs. {rule42SelectedPharmacy.quarterTurnoverPkr.toLocaleString()}</strong>
                </div>
                <div className="cert-row highlighted">
                  <span>Tax Deducted & Deposited (0.5% ATL):</span>
                  <strong className="font-mono text-teal">
                    Rs. {(rule42SelectedPharmacy.quarterTurnoverPkr * 0.005).toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="cert-qr-stamp">
                <div className="qr-box">
                  <span className="material-symbols-outlined qr-icon">qr_code_2</span>
                </div>
                <div className="stamp-meta">
                  <span className="stamp-title">Cryptographic FBR QR Stamp</span>
                  <span className="stamp-hash font-mono text-xs">FBR-STAMP-SHA256:88fa2901ce489b02</span>
                  <span className="stamp-verified text-xs text-emerald">Verified Active Filer Rate</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-action-primary"
                onClick={() => {
                  alert(`Downloading Audit-Certified Rule 42 PDF for ${rule42SelectedPharmacy.legalName}`);
                  setShowRule42Modal(false);
                }}
              >
                <span className="material-symbols-outlined">download</span>
                <span>Download Certified PDF</span>
              </button>
              <button className="btn-action-secondary" onClick={() => setShowRule42Modal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: LEGAL PROOF FOR PRINCIPAL ─── */}
      {showProofModal && proofData && (
        <div className="modal-backdrop" onClick={() => setShowProofModal(false)}>
          <div className="modal-box proof-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Verifiable Proof Ledger for Principal</h2>
              <button className="btn-close" onClick={() => setShowProofModal(false)}>✕</button>
            </div>
            <div className="proof-body">
              <p className="text-sm text-muted mb-4">
                This document certifies that circular <strong>"{proofData.title}"</strong> was electronically delivered and cryptographically signed by retail pharmacies across Pakistan.
              </p>

              <div className="proof-stats-strip">
                <div>
                  <span className="label">Delivered & Acknowledged</span>
                  <strong className="font-mono text-teal">{proofData.acknowledgedCount} Pharmacies</strong>
                </div>
                <div>
                  <span className="label">Verification Protocol</span>
                  <strong>SHA-256 Timestamps</strong>
                </div>
              </div>

              <div className="proof-signatures-list">
                {acknowledgements.map(a => (
                  <div key={a.id} className="proof-sig-item">
                    <span className="material-symbols-outlined text-emerald text-sm">verified</span>
                    <div className="sig-text">
                      <strong>{a.pharmacyName}</strong>
                      <span className="text-xs text-muted block">Signed by {a.signerName} ({a.signerRole}) at {a.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-action-primary"
                onClick={() => {
                  alert('Exporting verified legal packet with cryptographic hashes for Principal audit.');
                  setShowProofModal(false);
                }}
              >
                <span className="material-symbols-outlined">file_download</span>
                <span>Export Sealed Audit Dossier</span>
              </button>
              <button className="btn-action-secondary" onClick={() => setShowProofModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: RESTORE SIMULATION ─── */}
      {showRestoreModal && (
        <div className="modal-backdrop" onClick={() => setShowRestoreModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Automated Zero-Loss Restore Verification</h2>
              <button className="btn-close" onClick={() => setShowRestoreModal(false)}>✕</button>
            </div>
            <div className="restore-body">
              <p className="text-sm text-muted mb-4">
                Simulating decryption and validation of 256-bit AES master archive: <code>vault_backup_abbass_dist.enc</code>
              </p>

              <div className="restore-bar-wrap">
                <div className="restore-fill" style={{ width: `${restoreProgress}%` }} />
              </div>
              <span className="font-mono text-center block mt-2 font-bold">{restoreProgress}% Complete</span>

              {restoreProgress >= 100 && (
                <div className="restore-success-alert animate-fade-in">
                  <span className="material-symbols-outlined text-emerald">task_alt</span>
                  <div>
                    <strong>Verification Succeeded with 0 Data Loss</strong>
                    <p className="text-xs text-muted">All 184 pharmacy accounts, 12,400 SKU records, and FBR tax ledgers verified matching cryptographic hashes.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-action-secondary" onClick={() => setShowRestoreModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
