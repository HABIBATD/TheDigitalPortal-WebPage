import React, { useState, useEffect, useRef } from 'react';
import './PlatformShowcase.css';

/* --- Intersection Observer Hook (local copy) --- */
function useShowcaseInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.12, ...options }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

/* --- Phone Mockup Frame --- */
function PhoneMockup({ src, alt, className = '' }) {
  return (
    <div className={`sc-phone-frame ${className}`}>
      <div className="sc-phone-notch" />
      <div className="sc-phone-screen">
        <img src={src} alt={alt} loading="lazy" />
      </div>
      <div className="sc-phone-home-bar" />
    </div>
  );
}

/* --- Single Alternating Row --- */
function ShowcaseRow({ badge, badgeIcon, title, desc, bullets, img, imgAlt, tag, tagColor, reversed, warningBanner }) {
  const [ref, inView] = useShowcaseInView();
  return (
    <div ref={ref} className={`sc-row ${reversed ? 'sc-row-reversed' : ''} ${inView ? 'sc-row-visible' : ''}`}>
      <div className="sc-phone-col">
        <div className="sc-phone-wrapper">
          <div className="sc-phone-glow" />
          <PhoneMockup src={img} alt={imgAlt} />
          <div className="sc-phone-badge sc-phone-badge-top">
            <span className="sc-badge-dot" />
            <span>{tag}</span>
          </div>
        </div>
      </div>
      <div className="sc-content-col">
        <div className={`sc-row-badge sc-row-badge-${tagColor}`}>
          <span className="sc-row-badge-icon">{badgeIcon}</span>
          <span>{badge}</span>
        </div>
        <h3 className="sc-row-title">{title}</h3>
        {warningBanner && (
          <div className="sc-warning-banner">
            <div className="sc-warning-icon">Warning</div>
            <div>
              <div className="sc-warning-header">
                <span className="sc-warning-pill">OFFICIAL NOTICE</span>
                <span>Expiry Intimation Policy</span>
              </div>
              <p className="sc-warning-text">Intimate expiry at least <strong>6 months in advance</strong> to avoid financial loss.</p>
            </div>
          </div>
        )}
        <p className="sc-row-desc">{desc}</p>
        <ul className="sc-bullets">
          {bullets.map((b) => (
            <li key={b.text} className="sc-bullet-item">
              <span className="sc-check">check</span>
              <span>{b.bold && <strong>{b.bold}: </strong>}{b.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* --- Gallery Item Component --- */
function GalleryItem({ screen, i }) {
  const [ref, inView] = useShowcaseInView({ threshold: 0.05 });
  return (
    <div ref={ref} className={`sc-gallery-item ${inView ? `sc-fade-in sc-delay-${(i % 4) + 1}` : ''}`}>
      <div className="sc-gallery-phone">
        <div className="sc-gallery-notch" />
        <div className="sc-gallery-screen">
          <img src={screen.src} alt={screen.title} loading="lazy" />
        </div>
        <div className="sc-gallery-home" />
      </div>
      <div className="sc-gallery-label">
        <span className="sc-gallery-title">{screen.title}</span>
        <span className="sc-gallery-sub">{screen.sub}</span>
      </div>
    </div>
  );
}

export default function PlatformShowcase({ onOpenDemo }) {
  const [headerRef, headerInView] = useShowcaseInView();
  const [compRef, compInView] = useShowcaseInView();
  const [deskRef, deskInView] = useShowcaseInView();
  const [gallRef, gallInView] = useShowcaseInView();

  const operationsRows = [
    { badge: 'Live Command Center', badgeIcon: 'dash', tag: 'Pharmacy Dashboard Real-time', tagColor: 'teal', title: 'Your entire business at a glance', desc: 'Empower warehouse managers, dispatch officers, and accounts directors with instant visibility across open claims, stock in motion, and pharmacy dependencies.', img: '/stitch/pic3.png', imgAlt: 'TheDigitalPortal Mobile Dashboard Screen', reversed: false, bullets: [{ bold: 'Live KPI Cards', text: 'Pending returns, active trade offers, and support ticket counters refreshed in real time.' }, { bold: 'Recent Orders Log', text: 'Status chips (Submitted, Processing, Dispatched, Delivered) across all active orders.' }, { bold: 'One-Tap Access', text: 'Bottom navigation links directly to every core portal without nested menus.' }] },
    { badge: '4-Stage Order Pipeline', badgeIcon: 'pkg', tag: 'Orders Portal Normal and Urgent', tagColor: 'blue', title: 'Receive pharmacy orders and trace each one to final delivery', desc: 'Eliminate lost WhatsApp order slips and late-night calls. Retailers submit structured catalog requisitions directly into your verified dispatch queue.', img: '/stitch/pic4.png', imgAlt: 'Orders Portal Screen', reversed: true, bullets: [{ bold: 'Normal and Urgent Separation', text: 'Clear prioritization tabs for emergency critical-care medicine dispatches.' }, { bold: '4-Stage Lifecycle Tracing', text: 'Step 1: Submitted, Step 2: Confirmed, Step 3: Packed, Step 4: Dispatched.' }, { bold: 'Category Value Tracking', text: 'Instant rupee-value calculations per stage for cashflow precision.' }] },
    { badge: 'DRAP and Principal Aligned', badgeIcon: 'warn', tag: 'Expiry Portal 6-Month Policy', tagColor: 'amber', title: 'Manage expiry intimations under the six-months-before-expiry policy', desc: 'Pharmaceutical principals strictly penalize overdue claims. TheDigitalPortal enforces time-stamped digital requests to secure distributor credit memos effortlessly.', img: '/stitch/pic5.png', imgAlt: 'Expiry Intimations Portal Screen', reversed: false, warningBanner: true, bullets: [{ bold: 'Manual and Auto Intimation', text: 'Pharmacists can type details manually or use 1-tap auto-fetch based on invoice records.' }, { bold: 'Dual Views', text: 'Pharmacy-wise breakdown for credit note settlements, and Pharma-company-wise rollup for claims forwarding.' }, { bold: 'Real-time Forwarding Status', text: 'Track pending stock pickups and company settlement receipts transparently.' }] },
    { badge: 'Broadcast Engine', badgeIcon: 'ann', tag: 'Communication Center 1-Click Broadcast', tagColor: 'teal', title: 'Reach your entire pharmacy network in one click', desc: 'Push manufacturer scheme banners, gazetted holiday schedules, month-end closing alerts, and revised distribution terms instantly to all connected pharmacies.', img: '/stitch/pic6.png', imgAlt: 'Announcement Portal showing Communication Center', reversed: true, bullets: [{ bold: '1-Click Broadcast', text: 'Instantly notify 100+ retail pharmacies simultaneously without manual phone calling.' }, { bold: 'Upcoming Events Calendar', text: 'Automated calendar pins for banking deadlines and stock cutoffs.' }, { bold: 'Verifiable Read Receipts', text: 'Protect your enterprise against claim disputes with legal timestamp proof.' }] },
    { badge: 'SLA and Quality Control', badgeIcon: 'star', tag: 'Help and Feedback 100% Resolution', tagColor: 'purple', title: 'Collect and manage all pharmacy feedback from logged to resolved', desc: "Don't let damaged bottles or delayed deliveries sour customer relationships. Provide your pharmacy accounts with a direct hotline to management.", img: '/stitch/pic7.png', imgAlt: 'Help and Feedback Screen showing ticket lifecycle', reversed: false, bullets: [{ bold: '4 Strict Ticket Statuses', text: 'All Logged, Needs Reply, Investigating, and Settled with automated escalation notifications.' }, { bold: '100% Resolution Rate Scorecard', text: 'Track manager performance and maintain high customer satisfaction retention.' }, { bold: 'Pharmacy-wise Audit History', text: 'Complete record of past complaints and resolutions available when renewing annual supply terms.' }] },
    { badge: 'Zero Password Fatigue', badgeIcon: 'lock', tag: 'Secure 3-Step Login Auto-Token', tagColor: 'green', title: 'Secure verified access built for fast pharmacy counter adoption', desc: 'Retail pharmacies rarely remember complex alpha-numeric passwords. TheDigitalPortal uses a streamlined 3-step authentication framework verified in the field.', img: '/stitch/pic2.png', imgAlt: 'Login Screen showing verified pharmacy with auto-filled security token', reversed: true, bullets: [{ bold: 'Select Verified Distributor', text: 'Search by city or distributor code.' }, { bold: 'Enter Pharmacy ID', text: 'Matches registered retail accounts instantly.' }, { bold: 'Auto-Filled Security Token', text: '6-character one-time cryptotoken auto-populates securely to prevent spoofing.' }] },
  ];

  const galleryScreens = [
    { src: '/stitch/pic1.png', title: 'Secure Login', sub: '3-Step Passwordless Entry' },
    { src: '/stitch/pic2.png', title: 'Verified State', sub: 'Auto-token Authentication' },
    { src: '/stitch/pic3.png', title: 'Dashboard', sub: 'Live Returns, Offers, Orders' },
    { src: '/stitch/pic4.png', title: 'Orders Portal', sub: 'Normal and Urgent 4-Stage' },
    { src: '/stitch/pic5.png', title: 'Expiry Portal', sub: 'Manual and Auto Intimation' },
    { src: '/stitch/pic6.png', title: 'Announcements', sub: 'Broadcast and Events Calendar' },
    { src: '/stitch/pic7.png', title: 'Help and Feedback', sub: '100% Resolution SLA Tracker' },
    { src: '/stitch/pic8.png', title: 'Navigation Drawer', sub: 'Quick Portal Switching' },
  ];

  const modules = [
    { group: 'Overview', items: ['Dashboard'] },
    { group: 'Operations', items: ['Orders Portal', 'Expiry Portal', 'Announcement Portal', 'Expiry Intimation History', 'Acknowledgement Center', 'Batches Upload Center', 'Courier and Logistics Portal', 'Digital Attendance and Payroll', 'Company Claims and Settlements'] },
    { group: 'Compliance', items: ['FBR ATL Verification', 'Tax Deduction Certificate (Rule 42)'] },
    { group: 'Management', items: ['Logistics and Fleet Management', 'Feedback Response Center', 'Backup and Restore', 'Settings'] },
  ];

  return (
    <>
      {/* OPERATIONS SECTION */}
      <section className="sc-operations-section" id="platform-showcase">
        <div className="sc-container">
          <div className="sc-section-header" ref={headerRef}>
            <div className={`sc-header-eyebrow ${headerInView ? 'sc-fade-in' : ''}`}>OPERATIONS</div>
            <h2 className={`sc-header-title ${headerInView ? 'sc-fade-in sc-delay-1' : ''}`}>Everything your daily workflow needs</h2>
            <p className={`sc-header-subtitle ${headerInView ? 'sc-fade-in sc-delay-2' : ''}`}>Purpose-built tools mirroring how pharmaceutical distribution actually operates in Pakistan - from dispatch lines to reverse logistics.</p>
          </div>
          <div className="sc-rows-stack">
            {operationsRows.map((row) => <ShowcaseRow key={row.title} {...row} />)}
          </div>
        </div>
      </section>

      {/* COMPLIANCE SECTION */}
      <section className="sc-compliance-section" id="compliance-showcase">
        <div className="sc-container">
          <div className="sc-section-header" ref={compRef}>
            <div className={`sc-header-eyebrow ${compInView ? 'sc-fade-in' : ''}`}>COMPLIANCE</div>
            <h2 className={`sc-header-title ${compInView ? 'sc-fade-in sc-delay-1' : ''}`}>Stay audit-ready without the paperwork</h2>
            <p className={`sc-header-subtitle ${compInView ? 'sc-fade-in sc-delay-2' : ''}`}>Automate withholding tax validations, Rule 42 certificates, and FBR requirements with zero manual clerical overhead.</p>
          </div>
          <div className="sc-compliance-grid">
            <div className="sc-compliance-card">
              <div className="sc-compliance-watermark">FBR</div>
              <div className="sc-compliance-icon-emoji">ATL</div>
              <h3 className="sc-compliance-title">FBR ATL Verification Engine</h3>
              <p className="sc-compliance-desc">Bulk-verify customer CNIC and NTN records directly against the official Federal Board of Revenue Active Taxpayer List. Map CSV columns to automatically apply non-filer withholding rates.</p>
              <div className="sc-compliance-preview">
                <div className="sc-cprev-header"><span>customer_ntn_list.csv</span><span className="sc-cprev-badge-green">100% ATL Synchronized</span></div>
                <div className="sc-cprev-rows">
                  <div className="sc-cprev-row"><span>NTN: 3108920-1 (Malik Medicos)</span><span className="sc-cprev-status-green">Active Taxpayer (0.5% WHT)</span></div>
                  <div className="sc-cprev-row"><span>NTN: 4490182-4 (Standard Drug Co)</span><span className="sc-cprev-status-green">Active Taxpayer (0.5% WHT)</span></div>
                </div>
              </div>
              <div className="sc-compliance-footer"><span>Automatic weekly FBR database reload</span><span className="sc-compliance-link">Bulk Verify API</span></div>
            </div>
            <div className="sc-compliance-card">
              <div className="sc-compliance-watermark">R42</div>
              <div className="sc-compliance-icon-emoji">Cert</div>
              <h3 className="sc-compliance-title">Tax Deduction Certificates (Rule 42)</h3>
              <p className="sc-compliance-desc">1-click automated bulk generation of Rule 42 tax deduction certificates for all connected retail pharmacies. Save hundreds of accounting hours each tax quarter with signed, printable PDFs.</p>
              <div className="sc-compliance-preview">
                <div className="sc-cprev-header"><span>Rule 42 Digital Certificate Preview</span><span className="sc-cprev-badge-blue">FBR Format Validated</span></div>
                <div className="sc-cprev-cert">
                  <div><p className="sc-cprev-cert-title">Q3 Tax Deduction Batch - 84 Pharmacies</p><p className="sc-cprev-cert-sub">Total Withholding: PKR 4,180,240</p></div>
                  <button className="sc-cprev-dl-btn">Download PDF Batch</button>
                </div>
              </div>
              <div className="sc-compliance-footer"><span>Auditor-certified cryptographic QR stamp</span><span className="sc-compliance-link">Preview Sample</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* DESKTOP SIDEBAR SPOTLIGHT */}
      <section className="sc-desktop-section">
        <div className="sc-container">
          <div ref={deskRef} className={`sc-desktop-inner ${deskInView ? 'sc-fade-in' : ''}`}>
            <div className="sc-desktop-content">
              <div className="sc-header-eyebrow" style={{ marginBottom: '1rem' }}>DISTRIBUTOR COMMAND CENTER</div>
              <h2 className="sc-header-title" style={{ textAlign: 'left', maxWidth: '480px' }}>All 15 enterprise modules in one sidebar</h2>
              <p className="sc-desktop-desc">The Distributor Web Dashboard gives inventory managers, dispatch officers, accounts directors, and compliance officers a unified high-density workspace across every operational domain.</p>
              <div className="sc-module-groups">
                {modules.map((group) => (
                  <div key={group.group} className="sc-module-group">
                    <span className="sc-module-group-label">{group.group}</span>
                    <div className="sc-module-items">{group.items.map((item) => <span key={item} className="sc-module-chip">{item}</span>)}</div>
                  </div>
                ))}
              </div>
              <div className="sc-desktop-trust">
                <div className="sc-trust-item"><span className="sc-trust-icon">online</span><span>All modules active and synced</span></div>
                <div className="sc-trust-item"><span className="sc-trust-icon">lock</span><span>256-bit AES Encrypted Vault</span></div>
                <div className="sc-trust-item"><span className="sc-trust-icon">ok</span><span>FBR and DRAP Compliant</span></div>
              </div>
            </div>
            <div className="sc-desktop-visual">
              <div className="sc-desktop-glow" />
              <div className="sc-desktop-frame">
                <div className="sc-desktop-chrome">
                  <div className="sc-chrome-dots"><span className="sc-chrome-dot red" /><span className="sc-chrome-dot yellow" /><span className="sc-chrome-dot green" /></div>
                  <span className="sc-chrome-title">TheDigitalPortal - Distributor Control Center</span>
                  <span className="sc-chrome-live"><span className="sc-live-dot" />Live</span>
                </div>
                <div className="sc-desktop-screen">
                  <img src="/stitch/distributors_dashboard_sidebar.png" alt="Distributor Dashboard showing all 15 enterprise module navigation sidebar" loading="lazy" />
                </div>
              </div>
              <div className="sc-desktop-badge">
                <span>15</span>
                <div><span className="sc-badge-label">Enterprise Systems</span><span className="sc-badge-value">Fully Integrated and Live</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE APP GALLERY */}
      <section className="sc-gallery-section">
        <div className="sc-container">
          <div className="sc-section-header" ref={gallRef}>
            <div className={`sc-header-eyebrow ${gallInView ? 'sc-fade-in' : ''}`}>PHARMACY COUNTER APP</div>
            <h2 className={`sc-header-title ${gallInView ? 'sc-fade-in sc-delay-1' : ''}`}>Built for the pharmacy in your pocket</h2>
            <p className={`sc-header-subtitle ${gallInView ? 'sc-fade-in sc-delay-2' : ''}`}>Native responsive mobile experience tailored for busy counter operators. All 8 screens of the pharmacy mobile app, designed for Pakistan's retail pharmacists.</p>
          </div>
          <div className="sc-gallery-grid">
            {galleryScreens.map((screen, i) => (
              <GalleryItem key={screen.src} screen={screen} i={i} />
            ))}
          </div>

          {/* Ecosystem Strip */}
          <div className="sc-ecosystem-strip">
            <div className="sc-ecosystem-node">
              <div className="sc-eco-icon">Rx</div>
              <h4>Retail Pharmacy</h4>
              <p>Logs in via token, submits orders, intimates near-expiry batches</p>
              <span className="sc-eco-badge">Orders and Expiry</span>
            </div>
            <div className="sc-ecosystem-connector">
              <div className="sc-connector-line" />
              <div className="sc-connector-hub"><span>TheDigitalPortal Hub</span></div>
              <div className="sc-connector-line" />
            </div>
            <div className="sc-ecosystem-node sc-eco-node-center">
              <div className="sc-eco-icon sc-eco-icon-primary">Dist</div>
              <h4>Distributor Command</h4>
              <p>Validates FBR tax, packs consignments, dispatches fleets, tracks claims</p>
              <span className="sc-eco-badge sc-eco-badge-primary">15 Enterprise Modules</span>
            </div>
            <div className="sc-ecosystem-connector">
              <div className="sc-connector-line" />
              <div className="sc-connector-hub"><span>Verified Proofs</span></div>
              <div className="sc-connector-line" />
            </div>
            <div className="sc-ecosystem-node">
              <div className="sc-eco-icon">Mfg</div>
              <h4>Manufacturing Principals</h4>
              <p>Receives timestamped acknowledgements, verifies anti-counterfeit batch numbers</p>
              <span className="sc-eco-badge">Forwarded Claims</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
