import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, Box, ArrowRight, Truck, Activity, Lock, Users } from 'lucide-react';
import './index.css';

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-container">
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="logo">TheDigitalPortal</div>
        <ul className="nav-links">
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#security">Security</a></li>
        </ul>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary">Login</button>
          <button className="btn-primary">Request Demo</button>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <div className="pre-headline">Welcome to the Future of Pharma Distribution</div>
            <h1>Your Bridge to Digital Excellence.</h1>
            <p>
              An all-in-one ecosystem connecting Pharmaceutical Distributors and Pharmacies. 
              Manage orders, automate compliance, track logistics, and handle expiry claims—all in real time, from anywhere.
            </p>
            <div className="hero-cta">
              <button className="btn-primary">Get Started</button>
              <button className="btn-secondary">Learn How It Works</button>
            </div>
          </div>
          <div className="hero-visual">
            {/* We will use a placeholder that looks good, but since we can't use generic placeholders, 
                let's build a CSS representation of the dashboard */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)',
              border: '1px solid rgba(0,169,198,0.2)',
              display: 'flex',
              gap: '2rem',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px'
            }}>
              <div style={{flex: 2, display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div style={{height: '40px', width: '30%', background: '#f1f5f9', borderRadius: '8px'}}></div>
                <div style={{display: 'flex', gap: '1rem'}}>
                   <div style={{height: '100px', flex: 1, background: 'linear-gradient(135deg, #00A9C622, #00A9C611)', borderRadius: '12px'}}></div>
                   <div style={{height: '100px', flex: 1, background: '#f1f5f9', borderRadius: '12px'}}></div>
                   <div style={{height: '100px', flex: 1, background: '#f1f5f9', borderRadius: '12px'}}></div>
                </div>
                <div style={{height: '200px', width: '100%', background: '#f8fafc', borderRadius: '12px'}}></div>
              </div>
              <div style={{flex: 1, height: '400px', background: '#0f172a', borderRadius: '24px', border: '8px solid #334155', position: 'relative'}}>
                <div style={{position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '4px', background: '#475569', borderRadius: '4px'}}></div>
                <div style={{padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                   <div style={{height: '60px', width: '100%', background: '#1e293b', borderRadius: '8px'}}></div>
                   <div style={{height: '150px', width: '100%', background: '#1e293b', borderRadius: '8px'}}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ecosystem Section */}
        <section id="how-it-works" style={{ backgroundColor: '#f8fafc' }}>
          <div className="section-header">
            <h2>One Platform. Three Powerful Portals.</h2>
            <p>Seamlessly integrated to connect every node in your supply chain.</p>
          </div>
          <div className="ecosystem-grid">
            <div className="ecosystem-card">
              <div className="icon-wrapper">
                <Box size={28} />
              </div>
              <h3>Distributor Web Dashboard</h3>
              <p>The operational command center for modern distributors. Automate your supply chain, monitor real-time KPIs, and digitize your workforce.</p>
            </div>
            <div className="ecosystem-card">
              <div className="icon-wrapper">
                <Smartphone size={28} />
              </div>
              <h3>Pharmacy Mobile Network</h3>
              <p>A seamless mobile experience for pharmacies to securely log in, place orders, claim trade offers, and report expiries instantly.</p>
            </div>
            <div className="ecosystem-card">
              <div className="icon-wrapper">
                <Truck size={28} />
              </div>
              <h3>Logistics & Admin Intelligence</h3>
              <p>End-to-end vehicle tracking for couriers, backed by top-level Network Intelligence for server admins to monitor health and growth.</p>
            </div>
          </div>
        </section>

        {/* Features Breakdown */}
        <section id="features" className="features">
          <div className="section-header">
            <h2>Engineered for Operational Dominance.</h2>
            <p>Powerful tools designed to eliminate bottlenecks and accelerate growth.</p>
          </div>

          <div className="feature-row">
            <div className="feature-content">
              <h3>Smart Order & Expiry Management</h3>
              <p>Eliminate bottlenecks. Track every order through our 4-stage pipeline (Pending, Approved, Processed, Dispatched). Automate expiry intimations and seamlessly route claims back to parent companies.</p>
              <button className="btn-secondary">Explore Pipeline <ArrowRight size={16} style={{marginLeft: '8px', verticalAlign: 'middle'}} /></button>
            </div>
            <div className="feature-visual">
               <div style={{width: '100%', height: '300px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  <div style={{display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem'}}>
                     <span style={{color: '#00A9C6', fontWeight: 600}}>Pending (12)</span>
                     <span style={{color: '#475569'}}>Approved (5)</span>
                     <span style={{color: '#475569'}}>Dispatched (32)</span>
                  </div>
                  <div style={{flex: 1, background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1'}}></div>
               </div>
            </div>
          </div>

          <div className="feature-row">
            <div className="feature-content">
              <h3>Automated Compliance (FBR ATL)</h3>
              <p>Stay 100% compliant without the paperwork. Instantly verify FBR ATL (Active Taxpayer List) status and automatically generate Rule 42 Tax Deduction Certificates for your network.</p>
            </div>
            <div className="feature-visual">
                <div style={{width: '100%', height: '300px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={{textAlign: 'center'}}>
                       <Shield size={64} color="#10b981" style={{marginBottom: '1rem'}} />
                       <h4 style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>Verified Active Taxpayer</h4>
                       <p style={{color: '#475569'}}>Rule 42 Certificate Generated</p>
                    </div>
                </div>
            </div>
          </div>

          <div className="feature-row">
            <div className="feature-content">
              <h3>Advanced Network Intelligence</h3>
              <p>Monitor connected pharmacies, unique floating catalog items, and overall app usage through our intelligent, glassmorphic analytics engine.</p>
            </div>
            <div className="feature-visual">
                <div style={{width: '100%', height: '300px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                   <div style={{background: 'linear-gradient(135deg, rgba(0,169,198,0.1), transparent)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                      <Activity color="#00A9C6" size={32} />
                      <h4 style={{fontSize: '2rem', marginTop: '1rem'}}>99.9%</h4>
                      <span style={{color: '#475569'}}>Uptime</span>
                   </div>
                   <div style={{background: 'linear-gradient(135deg, rgba(139,92,246,0.1), transparent)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                      <Users color="#8b5cf6" size={32} />
                      <h4 style={{fontSize: '2rem', marginTop: '1rem'}}>2.4k+</h4>
                      <span style={{color: '#475569'}}>Pharmacies</span>
                   </div>
                </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" style={{backgroundColor: '#f8fafc', textAlign: 'center'}}>
           <div className="section-header">
             <h2>Bank-Grade Security & Reliability</h2>
             <p>Your operational data is your most valuable asset.</p>
           </div>
           <div style={{display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap'}}>
              <div style={{maxWidth: '300px'}}>
                 <Lock size={48} color="#00A9C6" style={{marginBottom: '1rem'}}/>
                 <h4 style={{fontSize: '1.25rem', marginBottom: '1rem'}}>Encrypted Backups</h4>
                 <p style={{color: '#475569'}}>Localized data protection and automated secure snapshots.</p>
              </div>
              <div style={{maxWidth: '300px'}}>
                 <Shield size={48} color="#00A9C6" style={{marginBottom: '1rem'}}/>
                 <h4 style={{fontSize: '1.25rem', marginBottom: '1rem'}}>Granular Access</h4>
                 <p style={{color: '#475569'}}>Detailed Access Control Lists (ACL) for staff permissions.</p>
              </div>
           </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to step into the digital era?</h2>
          <p>Join the growing network of smart distributors utilizing TheDigitalPortal to scale their operations.</p>
          <button className="btn-primary" style={{fontSize: '1.2rem', padding: '1rem 2.5rem'}}>Book a Free Consultation</button>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-brand">
            <span className="logo">TheDigitalPortal</span>
            <p>Empowering the pharmaceutical supply chain through modern digital infrastructure.</p>
          </div>
          <div className="footer-links">
            <h4>Portals</h4>
            <ul>
              <li><a href="#">Distributor Login</a></li>
              <li><a href="#">Admin Login</a></li>
              <li><a href="#">Pharmacy App</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} TheDigitalPortal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
