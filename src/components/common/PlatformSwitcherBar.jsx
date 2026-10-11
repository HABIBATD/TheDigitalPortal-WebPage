import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import './PlatformSwitcherBar.css';

export default function PlatformSwitcherBar() {
  const { currentView, setCurrentView, orders, expiryIntimations } = usePlatform();

  return (
    <aside className="platform-global-switcher-bar" aria-label="Platform view switcher">
      <div className="switcher-pill-container">
        <div className="switcher-brand-tag">
          <span className="live-pulse-dot" />
          <span className="platform-tag-text">LIVE DEMO PLATFORM</span>
        </div>

        <nav className="switcher-buttons-group" aria-label="Active environment navigation">
          <button
            className={`view-switch-btn ${currentView === 'landing' ? 'active' : ''}`}
            onClick={() => setCurrentView('landing')}
          >
            <span className="material-symbols-outlined">web</span>
            <span className="btn-text">Landing Page</span>
          </button>

          <button
            className={`view-switch-btn ${currentView === 'distributor' ? 'active' : ''}`}
            onClick={() => setCurrentView('distributor')}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="btn-text">Distributor Center</span>
            <span className="badge-count font-mono">15 Modules</span>
          </button>

          <button
            className={`view-switch-btn ${currentView === 'pharmacy' ? 'active' : ''}`}
            onClick={() => setCurrentView('pharmacy')}
          >
            <span className="material-symbols-outlined">smartphone</span>
            <span className="btn-text">Pharmacy App</span>
            <span className="badge-count font-mono">Counter UI</span>
          </button>
        </nav>

        <div className="switcher-stats-strip">
          <span className="stat-text font-mono">
            <strong>{orders.length}</strong> Orders • <strong>{expiryIntimations.length}</strong> Expiries Active
          </span>
        </div>
      </div>
    </aside>
  );
}
