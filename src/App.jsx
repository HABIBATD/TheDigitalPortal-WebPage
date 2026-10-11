import React, { useState, useEffect, useRef } from 'react';
import './index.css';

/* ─── Authentic Vector Brand Logo ──────────────────────────────── */
export function BrandLogo({ light = false, height = 36 }) {
  const width = Math.round(height * 3.25);
  const primaryTextColor = light ? '#FFFFFF' : '#0A1628';
  const outerHexStroke = light ? 'rgba(255, 255, 255, 0.35)' : '#0A1628';
  const innerHexCutout = light ? '#0A1628' : '#0A1628';

  return (
    <div className="brand-logo-wrap" style={{ height }}>
      <svg
        viewBox="0 0 520 160"
        width={width}
        height={height}
        style={{ display: 'block', overflow: 'visible' }}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="TheDigitalPortal Logo"
      >
        {/* EMBLEM */}
        <g transform="translate(10, 8)">
          {/* Outer Hexagon Frame */}
          <polygon
            points="74,8 136,44 136,104 74,140 12,104 12,44"
            fill="none"
            stroke={outerHexStroke}
            strokeWidth="14"
            strokeLinejoin="round"
          />

          {/* Inner Cyan Hexagon */}
          <polygon
            points="74,34 112,56 112,94 74,116 36,94 36,56"
            fill="#00A9C6"
            opacity="0.95"
            stroke="#00C8EE"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Inner Cutout */}
          <polygon
            points="74,54 92,65 92,85 74,96 56,85 56,65"
            fill={innerHexCutout}
          />

          {/* Left Arrow */}
          <path
            d="M 64,80 L -4,80"
            fill="none"
            stroke="#00C8EE"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <polygon points="-12,80 4,70 4,90" fill="#00C8EE" />

          {/* Down-Left Arrow */}
          <path
            d="M 86,96 L 68,118 L 44,136 L 36,146"
            fill="none"
            stroke="#00C8EE"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon points="30,154 34,138 48,148" fill="#00C8EE" />
          <circle cx="68" cy="118" r="5" fill={innerHexCutout} stroke="#00C8EE" strokeWidth="4" />

          {/* Up-Right Arrow & Circuit */}
          <path
            d="M 88,88 L 108,70 L 108,54 L 144,30"
            fill="none"
            stroke="#00C8EE"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon points="152,24 136,28 144,42" fill="#00C8EE" />
          <circle cx="88" cy="88" r="5" fill={innerHexCutout} stroke="#00C8EE" strokeWidth="4" />
          <circle cx="108" cy="70" r="4.5" fill={innerHexCutout} stroke="#00C8EE" strokeWidth="3.5" />

          {/* Right Circuit Loop */}
          <path
            d="M 118,66 L 140,66 C 148,66 154,72 154,80 C 154,88 148,94 140,94 L 122,94"
            fill="none"
            stroke="#00C8EE"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle cx="140" cy="66" r="4" fill="#00C8EE" />
        </g>

        {/* TYPOGRAPHY */}
        <g transform="translate(182, 0)">
          <text
            x="0"
            y="76"
            fontFamily="'Plus Jakarta Sans', 'Inter', system-ui, sans-serif"
            fontSize="64"
            fontWeight="800"
            letterSpacing="-1.5"
            fill={primaryTextColor}
          >
            TheDigital
          </text>
          <text
            x="0"
            y="136"
            fontFamily="'Plus Jakarta Sans', 'Inter', system-ui, sans-serif"
            fontSize="64"
            fontWeight="800"
            letterSpacing="-1.5"
            fill="#00A9C6"
          >
            Portal
          </text>
        </g>
      </svg>
    </div>
  );
}

/* ─── Intersection Observer Hook ─────────────────────────────── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.15, ...options }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

/* ─── Animated Counter with Decimal Support ──────────────────── */
function Counter({ to, suffix = '', prefix = '', decimals = 0 }) {
  const [displayVal, setDisplayVal] = useState('0');
  const [ref, inView] = useInView();

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    let frameId;

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = ease * to;

      if (decimals > 0) {
        setDisplayVal(current.toFixed(decimals));
      } else {
        setDisplayVal(Math.round(current).toLocaleString());
      }

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setDisplayVal(decimals > 0 ? to.toFixed(decimals) : to.toLocaleString());
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [inView, to, decimals]);

  return (
    <span ref={ref} className="counter-val">
      {prefix}{displayVal}{suffix}
    </span>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────── */
function Navbar({ onOpenDemo, onOpenPortal }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Solutions', href: '#solutions' },
    { label: 'Features', href: '#features' },
    { label: 'Security', href: '#security' },
    { label: 'Calculator', href: '#calculator' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <a href="#" className="nav-logo" aria-label="TheDigitalPortal Home">
        <BrandLogo light={!scrolled} height={34} />
      </a>

      <ul className="nav-links">
        {navItems.map(item => (
          <li key={item.label}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>

      <div className="nav-actions">
        <button
          className="nav-login"
          onClick={onOpenPortal}
          title="Access Distributor, Pharmacy, or Courier Portals"
        >
          Portal Login
        </button>
        <button
          className="btn-primary nav-demo-btn"
          onClick={onOpenDemo}
        >
          <span>Request Demo</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        {/* Mobile Hamburger Button */}
        <button
          className={`hamburger-btn ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-nav-inner">
          <ul className="mobile-nav-links">
            {navItems.map(item => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mobile-nav-actions">
            <button
              className="btn-ghost mobile-action-btn"
              onClick={() => { setMobileOpen(false); onOpenPortal(); }}
            >
              🔐 Portal Login
            </button>
            <button
              className="btn-primary mobile-action-btn"
              onClick={() => { setMobileOpen(false); onOpenDemo(); }}
            >
              🚀 Book a Free Demo
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero Section ───────────────────────────────────────────── */
function Hero({ onOpenDemo }) {
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-bg-grid" />
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />
        <div className="hero-orbit orbit-1" />
        <div className="hero-orbit orbit-2" />
        <div className="hero-orbit orbit-3" />
      </div>

      <div className="hero-content">
        <div className="hero-eyebrow animate-up">
          <span className="pulse-indicator" />
          Pakistan's #1 Pharma Distribution Platform
        </div>

        <h1 className="hero-heading animate-up delay-1">
          The Digital Future of<br />
          <span className="highlight">Pharma Distribution</span>
        </h1>

        <p className="hero-subheading animate-up delay-2">
          An all-in-one ecosystem connecting Pharmaceutical Distributors and Pharmacies.
          Manage orders, automate FBR ATL compliance, track logistics, and handle expiry claims
          — all in real time, with bank-grade security.
        </p>

        <div className="hero-cta animate-up delay-3">
          <button
            onClick={onOpenDemo}
            className="btn-primary hero-btn"
          >
            Book a Free Demo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <a href="#solutions" className="btn-ghost hero-btn">
            Explore 4 Portals
          </a>
        </div>

        <div className="hero-stats animate-up delay-4">
          <div className="hero-stat">
            <span className="hero-stat-value">2,800+</span>
            <span className="hero-stat-label">Active Pharmacies</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">98.7%</span>
            <span className="hero-stat-label">FBR Compliance Rate</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">99.9%</span>
            <span className="hero-stat-label">Uptime SLA</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">4.2M+</span>
            <span className="hero-stat-label">Orders Processed</span>
          </div>
        </div>
      </div>

      {/* Dashboard Visual Frame */}
      <div className="hero-visual-wrapper animate-up delay-5">
        <div className="hero-visual-frame">
          <div className="hero-visual-glow" />

          {/* Floating Badge – Left */}
          <div className="hero-badge hero-badge-left">
            <div className="badge-icon green">✓</div>
            <div>
              <span className="badge-text-label">FBR ATL Status</span>
              <span className="badge-text-value">Active Taxpayer Verified</span>
            </div>
          </div>

          <img
            src="/dashboard_mockup.jpg"
            alt="TheDigitalPortal Distributor Dashboard Preview"
            className="hero-visual-img"
          />

          {/* Floating Badge – Right */}
          <div className="hero-badge hero-badge-right">
            <div className="badge-icon blue">📦</div>
            <div>
              <span className="badge-text-label">Orders Today</span>
              <span className="badge-text-value">156 Live Orders</span>
            </div>
          </div>

          {/* Floating Badge – Bottom */}
          <div className="hero-badge hero-badge-bottom">
            <div className="badge-icon teal">⚡</div>
            <div>
              <span className="badge-text-label">Real-time Sync</span>
              <span className="badge-text-value">4 Portals Live & Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Trusted By ─────────────────────────────────────────────── */
function TrustedBy() {
  const distributors = [
    'MedCore Distributors',
    'PharmaPlus Network',
    'AlShifa Wholesale',
    'HealthBridge PK',
    'Medix Supply Co.',
    'NovaCure Distribution',
    'Apex Pharma Logistics'
  ];

  return (
    <div className="trusted-by">
      <div className="trusted-by-inner">
        <span className="trusted-by-label">Trusted by leading distributors across Pakistan</span>
        <div className="trusted-logos-scroller">
          <div className="trusted-logos">
            {distributors.concat(distributors).map((d, i) => (
              <span key={`${d}-${i}`} className="trusted-logo-item">
                <span className="pharma-badge-dot" />
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Portals Section (2x2 Balanced Layout) ──────────────────── */
function PortalsSection({ onOpenDemo, onOpenPortal }) {
  const [ref, inView] = useInView();

  const portals = [
    {
      badge: 'Operational Command Center',
      tag: 'Distributor SaaS',
      icon: '🖥️',
      title: 'Distributor Web Dashboard',
      desc: 'The mission-critical hub for modern pharmaceutical distributors. Automate your multi-warehouse supply chain, monitor live order pipelines, and direct your field sales reps in real time.',
      features: [
        'Real-time order pipeline (Pending → Approved → Dispatched)',
        'Automated FBR ATL compliance checks for every pharmacy NTN',
        'Sales rep GPS route tracking & geofenced order booking',
        'Near-expiry claim authorization & inventory salvage workflow'
      ],
      portalKey: 'distributor',
    },
    {
      badge: 'Retail Ordering App',
      tag: 'Android & iOS App',
      icon: '📱',
      title: 'Pharmacy Mobile Network',
      desc: 'An intuitive, fast mobile app built for retail and hospital pharmacies. Allows pharmacies to browse live distributor catalogues, unlock volume trade offers, and submit one-tap orders anytime.',
      features: [
        'Secure QR & OTP login tailored for pharmacy owners',
        'Floating catalogues with real-time stock availability & pricing',
        'Exclusive manufacturer trade offers & bonus scheme claims',
        'Instant photo-based batch expiry return reporting'
      ],
      portalKey: 'pharmacy',
    },
    {
      badge: 'Fleet & Dispatch',
      tag: 'Courier Logistics App',
      icon: '🚚',
      title: 'Logistics & Courier App',
      desc: 'End-to-end delivery tracking designed for pharma dispatch teams. Cold-chain sensitive delivery confirmation, geofenced drop-offs, and digital sign-off proof of delivery.',
      features: [
        'Turn-by-turn route optimization for delivery drivers',
        'Digital signature & photo proof-of-delivery (POD) capture',
        'Cash-on-Delivery (COD) reconciliation & receipt generation',
        'Automated SMS/WhatsApp dispatch alerts to receiving pharmacists'
      ],
      portalKey: 'courier',
    },
    {
      badge: 'Executive Oversight',
      tag: 'Admin & Analytics Suite',
      icon: '🔬',
      title: 'Network Intelligence Console',
      desc: 'A macro-level dashboard delivering holistic visibility across multi-branch distribution operations, supply velocity, regional demand patterns, and regulatory compliance health.',
      features: [
        'Unified multi-branch inventory balance & demand heatmaps',
        'Rule 42 Tax Deduction Certificate compliance vault',
        'Machine-learning stockout prediction & reorder signals',
        'Audit-ready financial ledgers and DRAP traceability reports'
      ],
      portalKey: 'intelligence',
    },
  ];

  return (
    <section className="section portals-section" id="solutions">
      <div className="container">
        <div className="section-header centered" ref={ref}>
          <div className="section-eyebrow">Unified Pharma Architecture</div>
          <h2 className={`section-title ${inView ? 'animate-up' : ''}`}>
            Four Portals. One Seamless Ecosystem.
          </h2>
          <p className={`section-subtitle centered ${inView ? 'animate-up delay-1' : ''}`}>
            Every participant in your pharmaceutical supply chain interacts through dedicated,
            synchronized interfaces built specifically for their daily workflows.
          </p>
        </div>

        <div className="portals-grid-balanced">
          {portals.map((portal, i) => (
            <div
              key={portal.title}
              className={`portal-card-premium ${inView ? `animate-up delay-${(i % 2) + 1}` : ''}`}
            >
              <div className="portal-card-top">
                <div className="portal-icon-wrapper">
                  <span className="portal-emoji">{portal.icon}</span>
                </div>
                <div className="portal-badge-group">
                  <span className="portal-tag">{portal.tag}</span>
                  <span className="portal-subtag">{portal.badge}</span>
                </div>
              </div>

              <h3 className="portal-card-title">{portal.title}</h3>
              <p className="portal-card-desc">{portal.desc}</p>

              <div className="portal-features-list">
                <span className="features-list-label">Key Capabilities:</span>
                <ul>
                  {portal.features.map(f => (
                    <li key={f}>
                      <span className="check-bullet">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="portal-card-footer">
                <button
                  className="btn-portal-demo"
                  onClick={onOpenDemo}
                >
                  Schedule Demo for this Portal →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Stats Band (High Contrast & Visible Numbers) ───────────── */
function StatsBand() {
  const stats = [
    { value: 2800, suffix: '+', label: 'Active Pharmacies Network', prefix: '', decimals: 0 },
    { value: 4.2, suffix: 'M+', label: 'Processed Orders', prefix: '', decimals: 1 },
    { value: 98.7, suffix: '%', label: 'FBR Compliance Rate', prefix: '', decimals: 1 },
    { value: 99.9, suffix: '%', label: 'Platform Uptime SLA', prefix: '', decimals: 1 },
  ];

  return (
    <div className="stats-band">
      <div className="stats-grid">
        {stats.map(stat => (
          <div key={stat.label} className="stat-card">
            <div className="stat-value-container">
              <span className="stat-prefix">{stat.prefix}</span>
              <Counter
                to={stat.value}
                suffix={stat.suffix}
                decimals={stat.decimals}
              />
            </div>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Features Section (Detailed Product Highlights) ─────────── */
function FeaturesSection({ onOpenDemo }) {
  const features = [
    {
      eyebrow: 'Intelligent Order Pipeline',
      title: 'Smart 4-Stage Workflow with Zero Bottlenecks',
      desc: 'Eliminate order lost in WhatsApp messages or paper slips. Every incoming prescription or wholesale order progresses seamlessly through an automated 4-stage pipeline with instant status broadcasts.',
      bullets: [
        'Structured pipeline: Pending Review → Credit Check → Warehouse Batching → Dispatched',
        'Automatic credit-limit enforcement before manager approval',
        'Bulk order batching with barcode-scanned pick-and-pack lists',
        'Instant order status push notifications sent directly to retail pharmacists',
      ],
      img: '/dashboard_mockup.jpg',
      imgAlt: 'Order management pipeline dashboard interface',
      reversed: false,
    },
    {
      eyebrow: 'FBR Tax Compliance Automation',
      title: 'Real-time FBR ATL Checks & Instant Rule 42 Certificates',
      desc: 'Never risk tax penalties or cumbersome manual filing. TheDigitalPortal connects with the Federal Board of Revenue to verify Active Taxpayer List status in milliseconds and automatically generate Rule 42 Tax Deduction Certificates.',
      bullets: [
        'Live NTN & CNIC verification against official FBR ATL databases',
        'Instant generation of DRAP & Rule 42 compliant withholding certificates',
        'Tamper-proof audit trail for tax authorities and annual reconciliations',
        'Automated withholding tax slab calculations for filer vs. non-filer pharmacies',
      ],
      img: '/compliance_visual.jpg',
      imgAlt: 'FBR ATL compliance verification dashboard',
      reversed: true,
    },
    {
      eyebrow: 'Pharmacy Partner Experience',
      title: 'Seamless Mobile App Empowering Retailers',
      desc: 'Give your pharmacy buyers an app they love using daily. They can check live inventory, take advantage of seasonal manufacturer schemes, place orders 24/7, and submit near-expiry batch returns effortlessly.',
      bullets: [
        'Dynamic digital product catalog showing real-time batches and pricing',
        'One-click trade scheme activations and volume bonus calculations',
        'Photo-based near-expiry batch return logging directly to distributor warehouse',
        'Digital delivery tracking with courier location and estimated arrival time',
      ],
      img: '/pharmacy_mobile_app.jpg',
      imgAlt: 'Pharmacy mobile application ordering UI',
      reversed: false,
    },
  ];

  return (
    <section className="section features-section" id="features">
      <div className="container">
        <div className="section-header centered">
          <div className="section-eyebrow">Enterprise Capabilities</div>
          <h2 className="section-title">Engineered for Operational Dominance</h2>
          <p className="section-subtitle centered">
            Purpose-built specifically for the intricacies of Pakistan's pharmaceutical distribution sector.
            Automating compliance, accelerating order cycles, and minimizing revenue leaks.
          </p>
        </div>

        {features.map((feat) => {
          const [ref, inView] = useInView();
          return (
            <div
              key={feat.title}
              className={`feature-block ${feat.reversed ? 'reversed' : ''}`}
              ref={ref}
            >
              <div className={`feature-info ${inView ? 'animate-up' : ''}`}>
                <div className="feature-eyebrow">✦ {feat.eyebrow}</div>
                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-desc">{feat.desc}</p>
                <ul className="feature-bullets">
                  {feat.bullets.map(b => (
                    <li key={b}>
                      <span className="bullet-icon">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="feature-cta-group">
                  <button onClick={onOpenDemo} className="btn-primary">
                    Request Feature Walkthrough
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className={`feature-img-wrapper ${inView ? 'animate-up delay-2' : ''}`}>
                <img src={feat.img} alt={feat.imgAlt} loading="lazy" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─── Interactive ROI & Efficiency Calculator ────────────────── */
function RoiCalculator({ onOpenDemo }) {
  const [ordersPerMonth, setOrdersPerMonth] = useState(3500);
  const [pharmaciesCount, setPharmaciesCount] = useState(250);

  // Calculations:
  // FBR checks take ~12 mins manually per pharmacy/month
  const hoursSaved = Math.round((pharmaciesCount * 14) / 60);
  // Near-expiry leakage saved: ~Rs 120 per order in prevented misrouting & salvage
  const expirySavings = Math.round(ordersPerMonth * 115);
  // Dispatch speedup: typical manual distribution 28-36 hrs vs TDP 4.2 hrs
  const dispatchVelocity = '7.5x';
  // Annual bottom-line gain in Millions PKR
  const annualGainMillion = ((expirySavings * 12 + hoursSaved * 12 * 1200) / 1000000).toFixed(1);

  return (
    <section className="section calculator-section" id="calculator">
      <div className="container">
        <div className="section-header centered">
          <div className="section-eyebrow">Quantifiable Value</div>
          <h2 className="section-title">Calculate Your Distribution ROI</h2>
          <p className="section-subtitle centered">
            Adjust the sliders below to estimate how much time and capital TheDigitalPortal saves
            your distribution operation every month.
          </p>
        </div>

        <div className="calculator-container">
          <div className="calc-inputs-card">
            <h4 className="calc-card-title">Your Operation Scale</h4>

            <div className="calc-control-group">
              <div className="calc-control-header">
                <label htmlFor="orders-slider">Monthly Order Volume</label>
                <span className="calc-control-val">{ordersPerMonth.toLocaleString()} orders</span>
              </div>
              <input
                id="orders-slider"
                type="range"
                min="500"
                max="25000"
                step="250"
                value={ordersPerMonth}
                onChange={e => setOrdersPerMonth(Number(e.target.value))}
                className="calc-range-slider"
              />
              <div className="calc-range-labels">
                <span>500</span>
                <span>12,500</span>
                <span>25,000+</span>
              </div>
            </div>

            <div className="calc-control-group">
              <div className="calc-control-header">
                <label htmlFor="pharmacy-slider">Connected Retail Pharmacies</label>
                <span className="calc-control-val">{pharmaciesCount.toLocaleString()} pharmacies</span>
              </div>
              <input
                id="pharmacy-slider"
                type="range"
                min="25"
                max="1500"
                step="25"
                value={pharmaciesCount}
                onChange={e => setPharmaciesCount(Number(e.target.value))}
                className="calc-range-slider"
              />
              <div className="calc-range-labels">
                <span>25</span>
                <span>750</span>
                <span>1,500+</span>
              </div>
            </div>

            <div className="calc-info-note">
              <span>💡</span>
              <p>
                Calculations are based on empirical performance benchmarks across 2,800+ active pharmacies
                and 40+ wholesale distributors across Punjab, Sindh, and KPK.
              </p>
            </div>
          </div>

          <div className="calc-results-card">
            <h4 className="calc-card-title">Estimated Monthly Impact</h4>

            <div className="calc-results-grid">
              <div className="calc-result-item">
                <span className="calc-result-label">Staff Hours Saved / Month</span>
                <span className="calc-result-number">{hoursSaved.toLocaleString()} hrs</span>
                <span className="calc-result-sub">On FBR checks & manual slips</span>
              </div>

              <div className="calc-result-item">
                <span className="calc-result-label">Expiry Loss Avoidance / Month</span>
                <span className="calc-result-number">₨ {(expirySavings / 1000).toFixed(0)}k</span>
                <span className="calc-result-sub">Through batch traceability</span>
              </div>

              <div className="calc-result-item">
                <span className="calc-result-label">Order Fulfillment Speed</span>
                <span className="calc-result-number">{dispatchVelocity}</span>
                <span className="calc-result-sub">Average dispatch within 4 hours</span>
              </div>

              <div className="calc-result-item highlight-item">
                <span className="calc-result-label">Est. Annual Value Added</span>
                <span className="calc-result-number highlight-num">₨ {annualGainMillion}M</span>
                <span className="calc-result-sub">Combined efficiency & savings</span>
              </div>
            </div>

            <button
              className="btn-primary calc-cta-btn"
              onClick={onOpenDemo}
            >
              Get Custom ROI Assessment for Your Network →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Security Section (Clean 3x2 Grid) ───────────────────────── */
function SecuritySection() {
  const [ref, inView] = useInView();

  const items = [
    {
      icon: '🔒',
      title: 'End-to-End AES-256 Encryption',
      desc: 'All operational records, pharmacy databases, and pricing schedules are strictly encrypted both in transit and at rest with TLS 1.3 and AES-256 standards.'
    },
    {
      icon: '🛡️',
      title: 'Role-Based Access Control',
      desc: 'Define pinpoint permissions for sales reps, inventory clerks, warehouse dispatchers, and finance managers. No unauthorized eyes on margin data.'
    },
    {
      icon: '💾',
      title: 'Continuous Redundant Backups',
      desc: 'Automated snapshots taken every hour with multi-region failover. Zero chance of data loss even during hardware failures or local telecom outages.'
    },
    {
      icon: '👁️',
      title: 'Immutable Audit Trail',
      desc: 'Every single discount change, order edit, FBR status query, and dispatch receipt is recorded with cryptographic timestamps and user IDs.'
    },
    {
      icon: '🔑',
      title: 'Multi-Factor Authentication',
      desc: 'Mandatory two-factor SMS/OTP and hardware key authentication for administrative distributor portals and biometric app login for pharmacists.'
    },
    {
      icon: '📊',
      title: 'DRAP & FBR Compliance Vault',
      desc: 'Built specifically in conformance with Drug Regulatory Authority of Pakistan (DRAP) tracking mandates and FBR withholding tax statutes.'
    },
  ];

  return (
    <section className="section security-section" id="security">
      <div className="container">
        <div className="section-header centered" ref={ref}>
          <div className="section-eyebrow">Enterprise Security</div>
          <h2 className={`section-title ${inView ? 'animate-up' : ''}`}>
            Your Commercial Data. Fortress Protected.
          </h2>
          <p className={`section-subtitle centered ${inView ? 'animate-up delay-1' : ''}`}>
            Your customer lists, pricing tiers, and inventory volumes are your proprietary advantage.
            We protect them with financial-institution grade controls.
          </p>
        </div>

        <div className="security-grid-clean">
          {items.map((item, i) => (
            <div
              key={item.title}
              className={`security-card ${inView ? `animate-up delay-${(i % 3) + 1}` : ''}`}
            >
              <div className="security-card-icon">{item.icon}</div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────────────── */
function Testimonials() {
  const [ref, inView] = useInView();

  const reviews = [
    {
      stars: '★★★★★',
      text: '"TheDigitalPortal transformed our order management completely. What used to take our sales order team 2 days on paper slips now takes 2 hours. The automated FBR ATL verification alone saves us 15+ hours of accounting headache every single week."',
      name: 'Ahmed Raza',
      role: 'Director of Operations, MedCore Distributors (Lahore)',
      initials: 'AR',
    },
    {
      stars: '★★★★★',
      text: '"Our pharmacy clients love the mobile app. They can browse our full trade catalog, place orders at 11 PM after closing their shop, and track our courier in real time. Our repeat order frequency jumped 42% in our very first quarter."',
      name: 'Fatima Khan',
      role: 'General Manager, PharmaPlus Network (Karachi)',
      initials: 'FK',
    },
    {
      stars: '★★★★★',
      text: '"The Rule 42 Certificate automation is phenomenal. Documents that required an entire junior audit team to prepare at month-end are generated instantly with official NTN details. We are 100% compliant with zero stress."',
      name: 'Bilal Mahmood',
      role: 'Chief Financial Officer, AlShifa Wholesale (Rawalpindi)',
      initials: 'BM',
    },
  ];

  return (
    <section className="section testimonials-section" id="testimonials">
      <div className="container">
        <div className="section-header centered" ref={ref}>
          <div className="section-eyebrow">Industry Endorsements</div>
          <h2 className={`section-title ${inView ? 'animate-up' : ''}`}>
            Trusted by Pakistan's Leading Distributors
          </h2>
          <p className={`section-subtitle centered ${inView ? 'animate-up delay-1' : ''}`}>
            Read firsthand accounts from pharma leadership teams who have digitized their distribution operations.
          </p>
        </div>

        <div className="testimonials-grid">
          {reviews.map((r, i) => (
            <div
              key={r.name}
              className={`testimonial-card ${inView ? `animate-up delay-${i + 1}` : ''}`}
            >
              <div className="testimonial-stars">{r.stars}</div>
              <p className="testimonial-text">{r.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{r.initials}</div>
                <div>
                  <span className="testimonial-name">{r.name}</span>
                  <span className="testimonial-role">{r.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Frequently Asked Questions (FAQ) ───────────────────────── */
function FAQSection({ onOpenDemo }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How does real-time FBR Active Taxpayer List (ATL) verification work?',
      a: 'TheDigitalPortal connects via secure API pipelines to verify any pharmacy’s NTN or CNIC directly against the FBR Active Taxpayer List. When an invoice is prepared, the system instantly identifies whether the buyer is an Active Taxpayer, applies the appropriate withholding tax rate, and prevents compliance fines.',
    },
    {
      q: 'Can TheDigitalPortal integrate with our existing ERP system (SAP, Candela, Oracle, QuickBooks)?',
      a: 'Yes. TheDigitalPortal offers bidirectional REST APIs and file-based batch sync connectors for all major ERPs including Candela, SAP Business One, Oracle NetSuite, and custom SQL inventory systems. Orders, inventory stocks, and customer ledgers sync smoothly.',
    },
    {
      q: 'Does a retail pharmacy need continuous internet access to place orders?',
      a: 'The Pharmacy Mobile App supports offline catalog caching. Pharmacists can build their order cart and queue near-expiry batch claims even with intermittent cellular data. As soon as connectivity returns, orders sync automatically to the distributor.',
    },
    {
      q: 'How are Rule 42 Tax Deduction Certificates generated?',
      a: 'Under Section 42 of the Sales Tax Act, distributors must issue deduction certificates. The platform automatically aggregates transaction totals, tax withheld, and buyer NTN details into the prescribed format, with digital signatures and downloadable PDFs in one click.',
    },
    {
      q: 'How does the near-expiry batch claim and return process work?',
      a: 'Pharmacies can scan or photograph near-expiry medicines (e.g. within 90 days of expiry) using the mobile app. The claim routes directly to the distributor’s returns department with batch number, quantity, and purchase invoice reference for immediate authorization.',
    },
    {
      q: 'How long does deployment and staff onboarding take?',
      a: 'A typical distributor is fully operational within 48 to 72 hours. Our dedicated onboarding specialists handle catalog import, pharmacy network invitations, and provide hands-on training for your warehouse managers and sales reps.',
    },
  ];

  return (
    <section className="section faq-section" id="faq">
      <div className="container">
        <div className="section-header centered">
          <div className="section-eyebrow">Clarity & Details</div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle centered">
            Everything you need to know about implementing TheDigitalPortal in your distribution business.
          </p>
        </div>

        <div className="faq-accordion">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className={`faq-item ${isOpen ? 'active' : ''}`}
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              >
                <div className="faq-question">
                  <span>{faq.q}</span>
                  <span className="faq-chevron">{isOpen ? '−' : '+'}</span>
                </div>
                {isOpen && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="faq-footer-note">
          <span>Have a question specific to your distribution network?</span>
          <button className="link-btn" onClick={onOpenDemo}>
            Speak directly with our solutions architect →
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Section ────────────────────────────────────────────── */
function CTASection({ onOpenDemo }) {
  return (
    <section className="cta-section" id="contact">
      <div className="cta-grid-bg" />
      <div className="cta-inner">
        <div className="cta-badge">
          🚀 Next-Generation Pharma SaaS Infrastructure
        </div>
        <h2 className="cta-title">
          Ready to Modernize Your<br />
          <span style={{ color: 'var(--primary-light)' }}>Pharma Distribution Network?</span>
        </h2>
        <p className="cta-subtitle">
          Join Pakistan's fastest-growing network of digitized distributors and pharmacies.
          Schedule a personalized live demonstration with our industry tech team.
        </p>
        <div className="cta-actions">
          <button
            onClick={onOpenDemo}
            className="btn-primary cta-main-btn"
          >
            Schedule Free Demo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <a
            href="tel:+923001234567"
            className="btn-ghost cta-call-btn"
          >
            📞 +92 300 1234567 (Sales)
          </a>
        </div>
        <p className="cta-note">
          ✓ No credit card required <span>·</span> ✓ 30-day trial period <span>·</span> ✓ Rapid 48-hour onboarding
        </p>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────── */
function Footer({ onOpenDemo, onOpenPortal }) {
  return (
    <footer>
      <div className="footer-grid container">
        <div className="footer-brand">
          <div className="footer-logo-wrap">
            <BrandLogo light={true} height={38} />
          </div>
          <p>
            The comprehensive digital infrastructure connecting Pakistan's pharmaceutical
            distributors, retail pharmacies, and logistics couriers in real time.
          </p>
          <div className="footer-compliance-badges">
            <span className="badge-pill">FBR ATL Integrated</span>
            <span className="badge-pill">DRAP Aligned</span>
            <span className="badge-pill">AES-256 Cloud</span>
          </div>
        </div>

        <div className="footer-col">
          <h5>Platform Portals</h5>
          <ul>
            <li><a href="#solutions" onClick={onOpenPortal}>Distributor Web Dashboard</a></li>
            <li><a href="#solutions" onClick={onOpenPortal}>Pharmacy Mobile App</a></li>
            <li><a href="#solutions" onClick={onOpenPortal}>Logistics & Dispatch App</a></li>
            <li><a href="#solutions" onClick={onOpenPortal}>Network Intelligence Console</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Solutions</h5>
          <ul>
            <li><a href="#features">Order Management Pipeline</a></li>
            <li><a href="#features">FBR ATL Verification</a></li>
            <li><a href="#features">Rule 42 Tax Certificates</a></li>
            <li><a href="#calculator">ROI & Efficiency Calculator</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Contact & Support</h5>
          <ul>
            <li><a href="mailto:info@thedigitalportal.pk">info@thedigitalportal.pk</a></li>
            <li><a href="tel:+923001234567">+92 300 1234567</a></li>
            <li><a href="#contact" onClick={onOpenDemo}>Schedule Private Demo</a></li>
            <li><a href="#faq">Frequently Asked Questions</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>© {new Date().getFullYear()} TheDigitalPortal. All rights reserved. Pakistan's Premier Pharma Distribution SaaS.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">FBR Security Whitepaper</a>
        </div>
      </div>
    </footer>
  );
}

/* ─── Interactive Schedule Demo Modal ────────────────────────── */
function DemoModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: 'Distributor',
    phone: '',
    city: 'Karachi',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {!submitted ? (
          <>
            <div className="modal-header">
              <span className="modal-eyebrow">Personalized Walkthrough</span>
              <h3 className="modal-title">Schedule a Live Product Demo</h3>
              <p className="modal-subtitle">
                See how TheDigitalPortal streamlines orders, FBR compliance, and pharmacy relations for your specific operation.
              </p>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="demo-name">Full Name *</label>
                  <input
                    id="demo-name"
                    required
                    type="text"
                    placeholder="e.g. Tariq Mehmood"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="demo-company">Company / Distribution Name *</label>
                  <input
                    id="demo-company"
                    required
                    type="text"
                    placeholder="e.g. Al-Madina Pharma"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="demo-role">Your Role *</label>
                  <select
                    id="demo-role"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="Distributor">Pharmaceutical Distributor</option>
                    <option value="PharmacyChain">Pharmacy Chain Owner</option>
                    <option value="PharmacyRetail">Independent Retail Pharmacy</option>
                    <option value="Logistics">Courier / 3PL Logistics</option>
                    <option value="Manufacturer">Pharmaceutical Manufacturer</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="demo-city">Primary City *</label>
                  <select
                    id="demo-city"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                  >
                    <option value="Karachi">Karachi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad / Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Quetta">Quetta</option>
                    <option value="Sialkot">Sialkot / Gujranwala</option>
                    <option value="Other">Other City</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="demo-phone">WhatsApp / Phone Number *</label>
                <input
                  id="demo-phone"
                  required
                  type="tel"
                  placeholder="+92 300 0000000"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="demo-notes">Specific Requirements (Optional)</label>
                <textarea
                  id="demo-notes"
                  rows="2"
                  placeholder="e.g. Need FBR ATL integration for 350 pharmacies and ERP sync."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary modal-submit-btn">
                Confirm Demo Request →
              </button>
            </form>
          </>
        ) : (
          <div className="modal-success">
            <div className="success-icon">✓</div>
            <h3>Demo Request Received!</h3>
            <p>
              Thank you, <strong>{formData.name}</strong>. Our pharma technology consultant will reach
              out to you via WhatsApp at <strong>{formData.phone}</strong> within 2 business hours.
            </p>
            <div className="success-badge">
              Fast Track: A confirmation summary has been registered for {formData.company}.
            </div>
            <button
              className="btn-primary"
              onClick={() => { setSubmitted(false); onClose(); }}
              style={{ marginTop: '1.5rem', width: '100%' }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Portal Selector Modal ──────────────────────────────────── */
function PortalModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const portals = [
    {
      title: 'Distributor Web Dashboard',
      desc: 'For distribution owners, managers & warehouse inventory staff',
      icon: '🖥️',
      url: 'https://distributor.thedigitalportal.pk',
      badge: 'Web App',
    },
    {
      title: 'Pharmacy Mobile App',
      desc: 'For retail pharmacists to browse catalogs & place orders',
      icon: '📱',
      url: 'https://pharmacy.thedigitalportal.pk',
      badge: 'Mobile Web / Android',
    },
    {
      title: 'Logistics Courier App',
      desc: 'For dispatch drivers & delivery fleet personnel',
      icon: '🚚',
      url: 'https://courier.thedigitalportal.pk',
      badge: 'Driver App',
    },
    {
      title: 'Network Intelligence Suite',
      desc: 'For head-office executive oversight and multi-branch analytics',
      icon: '🔬',
      url: 'https://admin.thedigitalportal.pk',
      badge: 'Admin Console',
    },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card portal-modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="modal-header">
          <span className="modal-eyebrow">Secure Portal Gateway</span>
          <h3 className="modal-title">Select Your Gateway</h3>
          <p className="modal-subtitle">
            Choose the portal tailored for your role to access your dedicated workspace.
          </p>
        </div>

        <div className="portal-cards-list">
          {portals.map(p => (
            <div key={p.title} className="portal-select-item">
              <span className="portal-select-icon">{p.icon}</span>
              <div className="portal-select-text">
                <div className="portal-select-header">
                  <h5>{p.title}</h5>
                  <span className="portal-select-badge">{p.badge}</span>
                </div>
                <p>{p.desc}</p>
              </div>
              <button
                className="btn-primary btn-portal-go"
                onClick={() => {
                  alert(`Connecting to ${p.title} secure environment. (Demo Mode Enabled)`);
                  onClose();
                }}
              >
                Access →
              </button>
            </div>
          ))}
        </div>

        <div className="portal-modal-footer">
          <span>Need demo login credentials?</span>
          <span className="login-hint">Email: <code>demo@thedigitalportal.pk</code> | Pass: <code>demo2026</code></span>
        </div>
      </div>
    </div>
  );
}

/* ─── App Root Component ─────────────────────────────────────── */
export default function App() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [portalModalOpen, setPortalModalOpen] = useState(false);

  return (
    <>
      <Navbar
        onOpenDemo={() => setDemoModalOpen(true)}
        onOpenPortal={() => setPortalModalOpen(true)}
      />
      <main>
        <Hero onOpenDemo={() => setDemoModalOpen(true)} />
        <TrustedBy />
        <PortalsSection
          onOpenDemo={() => setDemoModalOpen(true)}
          onOpenPortal={() => setPortalModalOpen(true)}
        />
        <StatsBand />
        <FeaturesSection onOpenDemo={() => setDemoModalOpen(true)} />
        <RoiCalculator onOpenDemo={() => setDemoModalOpen(true)} />
        <SecuritySection />
        <Testimonials />
        <FAQSection onOpenDemo={() => setDemoModalOpen(true)} />
        <CTASection onOpenDemo={() => setDemoModalOpen(true)} />
      </main>
      <Footer
        onOpenDemo={() => setDemoModalOpen(true)}
        onOpenPortal={() => setPortalModalOpen(true)}
      />

      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
      <PortalModal
        isOpen={portalModalOpen}
        onClose={() => setPortalModalOpen(false)}
      />
    </>
  );
}
