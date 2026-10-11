import React, { createContext, useContext, useState } from 'react';

const PlatformContext = createContext(null);

export function PlatformProvider({ children }) {
  // Navigation / View state
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'distributor' | 'pharmacy'
  const [distributorModule, setDistributorModule] = useState('dashboard');
  const [pharmacyScreen, setPharmacyScreen] = useState('dashboard');
  const [pharmacyLoggedIn, setPharmacyLoggedIn] = useState(true);
  const [language, setLanguage] = useState('en'); // 'en' | 'ur'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Notifications ticker
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'urgent', text: 'Urgent Order #ORD-9840 received from Malik Medicos (Augmentin 625mg)', time: '2m ago' },
    { id: 2, type: 'success', text: 'FBR ATL Synchronized: 184 Pharmacies verified for Q4 withholding', time: '14m ago' },
    { id: 3, type: 'info', text: 'Courier Rider Dispatched: CN-490218 (M&P Logistics)', time: '28m ago' },
  ]);

  // 1. Orders Data (4-Stage Lifecycle Tracing)
  const [orders, setOrders] = useState([
    {
      id: 'ORD-9840',
      pharmacyId: '501390',
      pharmacyName: 'Malik Medicos Centre',
      city: 'Abbottabad',
      orderType: 'urgent',
      stage: 'submitted', // submitted -> confirmed -> packed -> dispatched
      items: [
        { name: 'Augmentin 625mg Tab', qty: 50, pack: 'Box of 10s', price: 620 },
        { name: 'Risek 40mg IV Inj', qty: 20, pack: 'Vial', price: 440 },
        { name: 'Lantus Solostar 100IU', qty: 15, pack: 'Pen 3ml', price: 1850 },
      ],
      totalPkr: 67550,
      createdAt: 'Today, 10:14 AM',
      stageTimes: {
        submitted: '10:14 AM',
        confirmed: null,
        packed: null,
        dispatched: null,
      },
      riderName: 'Farhan Ali (Bike-14)',
      notes: 'Emergency critical-care replenishment for cardiac surgical ICU.'
    },
    {
      id: 'ORD-9836',
      pharmacyId: '449120',
      pharmacyName: 'Shaheen Chemist Blue Area',
      city: 'Islamabad',
      orderType: 'normal',
      stage: 'confirmed',
      items: [
        { name: 'Panadol CF Caplets', qty: 120, pack: 'Blister 100s', price: 185 },
        { name: 'Brufen 400mg Tab', qty: 80, pack: 'Box of 30s', price: 210 },
        { name: 'Flagyl 400mg Tab', qty: 60, pack: 'Box of 20s', price: 145 },
      ],
      totalPkr: 47700,
      createdAt: 'Today, 09:30 AM',
      stageTimes: {
        submitted: '09:30 AM',
        confirmed: '09:42 AM',
        packed: null,
        dispatched: null,
      },
      riderName: 'TCS Pharma Express',
      notes: 'Scheduled stock replenishment with Q4 scheme bonus.'
    },
    {
      id: 'ORD-9828',
      pharmacyId: '331089',
      pharmacyName: 'Faisal Pharmacy & Surgicals',
      city: 'Rawalpindi',
      orderType: 'normal',
      stage: 'packed',
      items: [
        { name: 'Cravit 500mg Tab', qty: 40, pack: 'Box of 7s', price: 920 },
        { name: 'Nexum 40mg Cap', qty: 70, pack: 'Box of 14s', price: 540 },
        { name: 'Klaricid 500mg Tab', qty: 30, pack: 'Box of 10s', price: 1100 },
      ],
      totalPkr: 107600,
      createdAt: 'Today, 08:15 AM',
      stageTimes: {
        submitted: '08:15 AM',
        confirmed: '08:25 AM',
        packed: '09:10 AM',
        dispatched: null,
      },
      riderName: 'Leopards Courier Van 03',
      notes: 'Cartons sealed with tamper-evident security holographic tape.'
    },
    {
      id: 'ORD-9815',
      pharmacyId: '501390',
      pharmacyName: 'Malik Medicos Centre',
      city: 'Abbottabad',
      orderType: 'normal',
      stage: 'dispatched',
      items: [
        { name: 'Ventolin Inhaler 100mcg', qty: 50, pack: 'Canister', price: 340 },
        { name: 'Seretide Diskus 250mcg', qty: 25, pack: 'Diskus', price: 1650 },
        { name: 'Zyrtec 10mg Tab', qty: 100, pack: 'Box of 10s', price: 160 },
      ],
      totalPkr: 74250,
      createdAt: 'Yesterday, 04:45 PM',
      stageTimes: {
        submitted: '04:45 PM',
        confirmed: '05:05 PM',
        packed: '05:40 PM',
        dispatched: '06:15 PM',
      },
      riderName: 'In-House Courier: Tariq Shah',
      trackingCode: 'M&P-99281744',
      eta: 'Out for delivery (ETA 35m)'
    },
    {
      id: 'ORD-9799',
      pharmacyId: '120944',
      pharmacyName: 'Al-Khidmat Drug Store',
      city: 'Peshawar',
      orderType: 'urgent',
      stage: 'dispatched',
      items: [
        { name: 'Meronem 1g IV Inj', qty: 12, pack: 'Vial', price: 2950 },
        { name: 'Clexane 40mg Syringe', qty: 20, pack: 'Pre-filled', price: 1200 },
      ],
      totalPkr: 59400,
      createdAt: 'Yesterday, 02:20 PM',
      stageTimes: {
        submitted: '02:20 PM',
        confirmed: '02:30 PM',
        packed: '03:00 PM',
        dispatched: '03:40 PM',
      },
      riderName: 'Daewoo Cargo Express',
      trackingCode: 'DEX-778219',
      eta: 'Delivered (Signed by Pharmacist)'
    }
  ]);

  // 2. Expiry Intimations (DRAP 6-Month Prior Policy)
  const [expiryIntimations, setExpiryIntimations] = useState([
    {
      id: 'EXP-4011',
      pharmacyId: '501390',
      pharmacyName: 'Malik Medicos Centre',
      productName: 'Augmentin 625mg Tab',
      principal: 'GSK Pakistan',
      batchNo: 'BT-99021',
      expiryDate: '2027-05-31',
      quantity: 45,
      monthsRemaining: 7.2,
      isSixMonthsPrior: true,
      intimationType: 'manual',
      status: 'verified_approved', // verified_approved -> forwarded_principal -> pending_pickup -> credit_settled
      intimationDate: '2026-10-12',
      creditNoteNo: 'CN-GSK-8812',
      creditNoteAmount: 27900
    },
    {
      id: 'EXP-4012',
      pharmacyId: '501390',
      pharmacyName: 'Malik Medicos Centre',
      productName: 'Lantus Solostar 100IU',
      principal: 'Sanofi Pakistan',
      batchNo: 'SN-44108',
      expiryDate: '2027-04-15',
      quantity: 18,
      monthsRemaining: 6.1,
      isSixMonthsPrior: true,
      intimationType: 'auto',
      status: 'forwarded_principal',
      intimationDate: '2026-10-18',
      creditNoteNo: 'Pending Principal',
      creditNoteAmount: 33300
    },
    {
      id: 'EXP-4009',
      pharmacyId: '331089',
      pharmacyName: 'Faisal Pharmacy & Surgicals',
      productName: 'Risek 40mg IV Inj',
      principal: 'Getz Pharma',
      batchNo: 'GT-33129',
      expiryDate: '2027-04-28',
      quantity: 30,
      monthsRemaining: 6.5,
      isSixMonthsPrior: true,
      intimationType: 'manual',
      status: 'pending_pickup',
      intimationDate: '2026-10-22',
      creditNoteNo: 'GTZ-CN-190',
      creditNoteAmount: 13200
    },
    {
      id: 'EXP-3994',
      pharmacyId: '449120',
      pharmacyName: 'Shaheen Chemist Blue Area',
      productName: 'Nexum 40mg Cap',
      principal: 'Getz Pharma',
      batchNo: 'GT-44812',
      expiryDate: '2027-05-10',
      quantity: 60,
      monthsRemaining: 6.8,
      isSixMonthsPrior: true,
      intimationType: 'auto',
      status: 'credit_settled',
      intimationDate: '2026-09-28',
      creditNoteNo: 'GTZ-CN-098',
      creditNoteAmount: 32400
    }
  ]);

  // 3. Broadcast Announcements (Pushed to Mobile App)
  const [broadcasts, setBroadcasts] = useState([
    {
      id: 'BC-2026-108',
      title: 'Iqbal Day Delivery Cut-Off & Gazetted Schedule',
      category: 'Holiday Notice',
      target: 'All 184 Connected Pharmacies',
      content: 'In observance of Iqbal Day (9th November), distributor warehouse order booking will close at 02:00 PM on 8th Nov. Normal morning runs resume on 10th Nov.',
      publishedAt: '2026-10-31 09:00 AM',
      priority: 'high',
      acknowledgedCount: 142,
      totalTarget: 184,
      schemeCode: 'NOT-IQBAL-26'
    },
    {
      id: 'BC-2026-107',
      title: 'Q4 Manufacturer Scheme: 10 + 1 Free on Augmentin & Panadol',
      category: 'Trade Scheme',
      target: 'Retail Tier 1 & Tier 2',
      content: 'Special Q4 winter booking trade scheme active till Nov 15th. Order 10 boxes of Augmentin 625mg or Panadol CF and receive 1 bonus box automatically invoiced at Rs. 0.00.',
      publishedAt: '2026-10-28 11:30 AM',
      priority: 'normal',
      acknowledgedCount: 178,
      totalTarget: 184,
      schemeCode: 'SCH-WINTER-Q4'
    },
    {
      id: 'BC-2026-105',
      title: 'Month-End Banking Closing: Cheque Clearing Timelines',
      category: 'Bank Closing',
      target: 'Accounts Departments',
      content: 'State Bank of Pakistan month-end clearing requires all recovery cheques and direct online transfers to be posted by 29th Oct 03:00 PM for timely credit ledger reconciliation.',
      publishedAt: '2026-10-25 04:00 PM',
      priority: 'normal',
      acknowledgedCount: 165,
      totalTarget: 184,
      schemeCode: 'ACC-OCT-CLOSING'
    }
  ]);

  // 4. Acknowledgement Center Proofs
  const [acknowledgements, setAcknowledgements] = useState([
    {
      id: 'ACK-9901',
      announcementId: 'BC-2026-108',
      subject: 'Iqbal Day Delivery Cut-Off & Gazetted Schedule',
      pharmacyId: '501390',
      pharmacyName: 'Malik Medicos Centre',
      signerRole: 'Licensed Pharmacist',
      signerName: 'Dr. Aamir Khan (RPh #3910)',
      timestamp: '2026-10-31 09:14:22',
      hashFingerprint: 'SHA256:7f9c2e0b...48a1',
      status: 'Acknowledged'
    },
    {
      id: 'ACK-9902',
      announcementId: 'BC-2026-108',
      subject: 'Iqbal Day Delivery Cut-Off & Gazetted Schedule',
      pharmacyId: '449120',
      pharmacyName: 'Shaheen Chemist Blue Area',
      signerRole: 'Purchase Officer',
      signerName: 'Khurram Shehzad',
      timestamp: '2026-10-31 09:18:05',
      hashFingerprint: 'SHA256:d481b83e...339b',
      status: 'Acknowledged'
    },
    {
      id: 'ACK-9903',
      announcementId: 'BC-2026-107',
      subject: 'Q4 Manufacturer Scheme: 10 + 1 Free on Augmentin & Panadol',
      pharmacyId: '120944',
      pharmacyName: 'Al-Khidmat Drug Store',
      signerRole: 'Manager Operations',
      signerName: 'Muhammad Salman',
      timestamp: '2026-10-28 11:45:10',
      hashFingerprint: 'SHA256:bb12c3f8...607a',
      status: 'Acknowledged'
    }
  ]);

  // 5. FBR ATL Taxpayer Verification Engine
  const [taxpayers, setTaxpayers] = useState([
    {
      id: 1,
      pharmacyId: '501390',
      legalName: 'Malik Medicos Centre (Pvt) Ltd',
      ntn: '3108920-1',
      cnic: '37405-1829401-3',
      city: 'Abbottabad',
      atlStatus: 'active', // active (0.5%) | inactive (1.0% or 4.0%)
      withholdingRate: '0.5% (Active Filer)',
      lastVerified: '2026-10-28 (FBR Portal Live Sync)',
      quarterTurnoverPkr: 4250000
    },
    {
      id: 2,
      pharmacyId: '449120',
      legalName: 'Shaheen Chemist Blue Area Enterprise',
      ntn: '4490182-4',
      cnic: '61101-9920141-1',
      city: 'Islamabad',
      atlStatus: 'active',
      withholdingRate: '0.5% (Active Filer)',
      lastVerified: '2026-10-28 (FBR Portal Live Sync)',
      quarterTurnoverPkr: 8900000
    },
    {
      id: 3,
      pharmacyId: '331089',
      legalName: 'Faisal Pharmacy & Surgical Store',
      ntn: '1849201-9',
      cnic: '37405-4491029-7',
      city: 'Rawalpindi',
      atlStatus: 'active',
      withholdingRate: '0.5% (Active Filer)',
      lastVerified: '2026-10-28 (FBR Portal Live Sync)',
      quarterTurnoverPkr: 3100000
    },
    {
      id: 4,
      pharmacyId: '772109',
      legalName: 'Khyber Medical Hall',
      ntn: '2981044-8',
      cnic: '17301-2284910-5',
      city: 'Peshawar',
      atlStatus: 'inactive',
      withholdingRate: '1.0% (Non-Filer Surcharge)',
      lastVerified: '2026-10-28 (FBR ATL Notice Issued)',
      quarterTurnoverPkr: 1850000
    }
  ]);

  // 6. Support & Feedback Tickets (100% SLA)
  const [tickets, setTickets] = useState([
    {
      ticketId: 'TCK-2026-904',
      pharmacyId: '501390',
      pharmacyName: 'Malik Medicos Centre',
      category: 'Damaged Packets',
      subject: 'Carton Seal Broken on Ventolin Inhaler shipment CN-490218',
      status: 'Needs Reply', // All Logged | Needs Reply | Investigating | Settled
      priority: 'urgent',
      submittedAt: 'Today, 10:30 AM',
      assignedTo: 'Zahid Khan (Dispatch Lead)',
      csatScore: null,
      messages: [
        { sender: 'Malik Medicos', text: 'Outer packing box had tear marks on arrival from M&P courier. 2 packs have dented canisters.', time: '10:30 AM' }
      ]
    },
    {
      ticketId: 'TCK-2026-899',
      pharmacyId: '449120',
      pharmacyName: 'Shaheen Chemist',
      category: 'Invoice Discrepancy',
      subject: 'Rule 42 WHT calculation on Invoice #INV-88910',
      status: 'Investigating',
      priority: 'medium',
      submittedAt: 'Yesterday, 03:15 PM',
      assignedTo: 'Nida Fatima (Accounts Officer)',
      csatScore: null,
      messages: [
        { sender: 'Shaheen Chemist', text: 'Please check WHT adjusted for 0.5% vs 1%. Our ATL certificate is verified.', time: 'Yesterday' },
        { sender: 'TheDigitalPortal Support', text: 'Reviewing against latest FBR ATL dump. Credit note of Rs. 1,420 will be adjusted.', time: 'Yesterday' }
      ]
    },
    {
      ticketId: 'TCK-2026-880',
      pharmacyId: '331089',
      pharmacyName: 'Faisal Pharmacy',
      category: 'Cold Chain Excursion',
      subject: 'Temperature log inquiry for Insulin delivery batch',
      status: 'Settled',
      priority: 'high',
      submittedAt: '3 days ago',
      assignedTo: 'Dr. Tariq (Quality Assurance)',
      csatScore: '5/5 Stars (100% SLA Satisfied)',
      messages: [
        { sender: 'Faisal Pharmacy', text: 'Requesting calibrated temperature data logger graph for Lantus delivery.', time: '3 days ago' },
        { sender: 'TheDigitalPortal Support', text: 'Data logger report attached: Constant 4.2°C maintained throughout 48-minute transit.', time: '2 days ago' }
      ]
    }
  ]);

  // 7. Batches Upload Registry (Anti-Counterfeit Protection)
  const [batchesRegistry, setBatchesRegistry] = useState([
    { batchNo: 'BT-99021', brand: 'Augmentin 625mg', principal: 'GSK Pakistan', mfgDate: '2024-05', expDate: '2027-05', cartonsDispatched: 320, returnsVerified: 45, status: 'Active Genuine' },
    { batchNo: 'SN-44108', brand: 'Lantus Solostar 100IU', principal: 'Sanofi Pakistan', mfgDate: '2024-04', expDate: '2027-04', cartonsDispatched: 180, returnsVerified: 18, status: 'Active Genuine' },
    { batchNo: 'GT-33129', brand: 'Risek 40mg IV Inj', principal: 'Getz Pharma', mfgDate: '2024-04', expDate: '2027-04', cartonsDispatched: 450, returnsVerified: 30, status: 'Active Genuine' },
    { batchNo: 'AB-88019', brand: 'Panadol CF Caplets', principal: 'GSK Consumer', mfgDate: '2024-06', expDate: '2027-06', cartonsDispatched: 1200, returnsVerified: 0, status: 'Active Genuine' }
  ]);

  // 8. Fleet Lifecycle Vehicles (8-Step Manager)
  const [fleetVehicles, setFleetVehicles] = useState([
    {
      vehicleId: 'FLT-01',
      plate: 'LED-8920 (Toyota Hiace Van)',
      driver: 'Muhammad Tariq (Verified R-301)',
      step: 7, // 1 to 8 in lifecycle
      stepName: '7. Live Dispatch Runs',
      status: 'In Transit',
      route: 'Abbottabad → Mansehra Supply Line',
      fuelKmpl: '11.8 km/l',
      tokenTaxExpiry: 'Valid till June 2027',
      routePermit: 'Hazara Regional Permit #HZ-991',
      coldChainEquipped: true,
      lastService: '12 days ago'
    },
    {
      vehicleId: 'FLT-02',
      plate: 'ICT-4419 (Suzuki Carry Chilled)',
      driver: 'Naveed Akhtar (Bio-verified)',
      step: 6,
      stepName: '6. Fuel Logs & Mileage',
      status: 'Depot Standby',
      route: 'Islamabad Rawalpindi Express Corridor',
      fuelKmpl: '14.2 km/l',
      tokenTaxExpiry: 'Valid till Dec 2026',
      routePermit: 'Twin Cities Pharma Pass #TW-330',
      coldChainEquipped: true,
      lastService: '5 days ago'
    },
    {
      vehicleId: 'FLT-03',
      plate: 'RWP-1180 (Honda CD-70 Courier)',
      driver: 'Farhan Ali (Express Runner)',
      step: 7,
      stepName: '7. Live Dispatch Runs',
      status: 'Active Delivery',
      route: 'Local Urgent Care Circuit (Abbottabad)',
      fuelKmpl: '48.5 km/l',
      tokenTaxExpiry: 'Valid till 2027',
      routePermit: 'Municipal Rider ID #MR-14',
      coldChainEquipped: false,
      lastService: '18 days ago'
    }
  ]);

  // 9. Company Claims Tracker (Principals Ledger)
  const [claims, setClaims] = useState([
    { id: 'CLM-GSK-08', principal: 'GSK Pakistan', claimType: 'Debit Note (6-Mo Expiry)', amountPkr: 145000, aging: '< 30 Days', status: 'Approved for Credit Note', date: '2026-10-15' },
    { id: 'CLM-SNF-04', principal: 'Sanofi Pakistan', claimType: 'Price Revision Difference', amountPkr: 82400, aging: '30–60 Days', status: 'Under Field Audit', date: '2026-09-20' },
    { id: 'CLM-GTZ-12', principal: 'Getz Pharma', claimType: 'Breakage & Damaged Cartons', amountPkr: 38900, aging: '60–90 Days', status: 'Credit Note Bank Linked', date: '2026-08-14' },
    { id: 'CLM-ABT-02', principal: 'Abbott Laboratories', claimType: 'Near-Expiry Claim Return', amountPkr: 210000, aging: '< 30 Days', status: 'Pending Physical Lifting', date: '2026-10-22' }
  ]);

  // 10. Backup Vault History
  const [backups, setBackups] = useState([
    { id: 'BAK-102', filename: 'vault_backup_abbass_dist_20261011.enc', size: '42.8 MB', timestamp: 'Today, 10:00 AM', type: 'AES-256 Offline + Cloud Geo-Redundant', status: 'Verified Healthy (SHA256 Match)' },
    { id: 'BAK-101', filename: 'vault_backup_abbass_dist_20261010.enc', size: '42.3 MB', timestamp: 'Yesterday, 11:59 PM', type: 'AES-256 Cloud Mirror', status: 'Verified Healthy' },
    { id: 'BAK-100', filename: 'vault_backup_abbass_dist_20261009.enc', size: '41.9 MB', timestamp: '9 Oct 2026, 11:59 PM', type: 'AES-256 Offline Mirror', status: 'Verified Healthy' }
  ]);

  // ─── Shared Reactive Actions ───

  // Advance Order Lifecycle Stage
  const advanceOrderStage = (orderId) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      const stageMap = {
        'submitted': 'confirmed',
        'confirmed': 'packed',
        'packed': 'dispatched',
        'dispatched': 'dispatched'
      };
      const nextStage = stageMap[order.stage];
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        ...order,
        stage: nextStage,
        stageTimes: {
          ...order.stageTimes,
          [nextStage]: nowTime
        }
      };
    }));
  };

  // Pharmacy places new urgent / normal order
  const placeNewPharmacyOrder = ({ items, orderType, notes }) => {
    const totalPkr = items.reduce((acc, it) => acc + (it.qty * it.price), 0);
    const newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: newId,
      pharmacyId: '501390',
      pharmacyName: 'Malik Medicos Centre',
      city: 'Abbottabad',
      orderType: orderType || 'urgent',
      stage: 'submitted',
      items,
      totalPkr,
      createdAt: 'Just now',
      stageTimes: {
        submitted: 'Just now',
        confirmed: null,
        packed: null,
        dispatched: null,
      },
      riderName: orderType === 'urgent' ? 'Express Priority Courier' : 'Standard Delivery Van',
      notes: notes || 'Submitted from Pharmacy Counter Mobile App'
    };

    setOrders(prev => [newOrder, ...prev]);
    setNotifications(prev => [
      { id: Date.now(), type: 'urgent', text: `New ${orderType.toUpperCase()} order #${newId} placed by Malik Medicos (Rs. ${totalPkr.toLocaleString()})`, time: 'Just now' },
      ...prev
    ]);
    return newOrder;
  };

  // Pharmacy intimates an expiry
  const submitExpiryIntimation = ({ productName, principal, batchNo, expiryDate, quantity, intimationType }) => {
    const newId = `EXP-${Math.floor(4020 + Math.random() * 500)}`;
    const newIntimation = {
      id: newId,
      pharmacyId: '501390',
      pharmacyName: 'Malik Medicos Centre',
      productName,
      principal,
      batchNo,
      expiryDate,
      quantity: Number(quantity),
      monthsRemaining: 6.4,
      isSixMonthsPrior: true,
      intimationType: intimationType || 'manual',
      status: 'verified_approved',
      intimationDate: new Date().toISOString().split('T')[0],
      creditNoteNo: 'Pending Principal Assignment',
      creditNoteAmount: quantity * 450
    };

    setExpiryIntimations(prev => [newIntimation, ...prev]);
    setNotifications(prev => [
      { id: Date.now(), type: 'info', text: `Expiry Intimation ${newId} received for ${productName} (Batch ${batchNo})`, time: 'Just now' },
      ...prev
    ]);
    return newIntimation;
  };

  // Pharmacy acknowledges a broadcast announcement
  const acknowledgeBroadcast = (announcementId) => {
    const bc = broadcasts.find(b => b.id === announcementId);
    if (!bc) return;

    // Check if already acknowledged
    const exists = acknowledgements.some(a => a.announcementId === announcementId && a.pharmacyId === '501390');
    if (exists) return;

    const newAck = {
      id: `ACK-${Math.floor(9910 + Math.random() * 500)}`,
      announcementId,
      subject: bc.title,
      pharmacyId: '501390',
      pharmacyName: 'Malik Medicos Centre',
      signerRole: 'Licensed Pharmacist',
      signerName: 'Dr. Aamir Khan (RPh #3910)',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      hashFingerprint: `SHA256:${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
      status: 'Acknowledged'
    };

    setAcknowledgements(prev => [newAck, ...prev]);
    setBroadcasts(prev => prev.map(b => b.id === announcementId ? { ...b, acknowledgedCount: b.acknowledgedCount + 1 } : b));
  };

  // Create Support Ticket
  const createSupportTicket = ({ category, subject, message }) => {
    const newId = `TCK-${Math.floor(905 + Math.random() * 100)}`;
    const newTicket = {
      ticketId: newId,
      pharmacyId: '501390',
      pharmacyName: 'Malik Medicos Centre',
      category,
      subject,
      status: 'Needs Reply',
      priority: 'high',
      submittedAt: 'Just now',
      assignedTo: 'Dispatch Lead',
      csatScore: null,
      messages: [
        { sender: 'Malik Medicos', text: message, time: 'Just now' }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);
    setNotifications(prev => [
      { id: Date.now(), type: 'urgent', text: `Support Ticket ${newId} logged: ${subject}`, time: 'Just now' },
      ...prev
    ]);
    return newTicket;
  };

  // Distributor pushes a new broadcast
  const pushNewBroadcast = ({ title, category, content, priority, target }) => {
    const newId = `BC-${Math.floor(2026 + Math.random() * 1000)}`;
    const newBroadcast = {
      id: newId,
      title,
      category,
      target: target || 'All 184 Connected Pharmacies',
      content,
      publishedAt: 'Just now',
      priority: priority || 'normal',
      acknowledgedCount: 0,
      totalTarget: 184,
      schemeCode: `CIRC-${Math.floor(100 + Math.random() * 900)}`
    };

    setBroadcasts(prev => [newBroadcast, ...prev]);
    setNotifications(prev => [
      { id: Date.now(), type: 'info', text: `Broadcast pushed to 184 pharmacies: "${title}"`, time: 'Just now' },
      ...prev
    ]);
  };

  // Trigger Backup
  const createBackupSnapshot = () => {
    const newBak = {
      id: `BAK-${Math.floor(103 + Math.random() * 100)}`,
      filename: `vault_backup_abbass_dist_${new Date().toISOString().slice(0,10).replace(/-/g,'')}.enc`,
      size: '43.1 MB',
      timestamp: 'Just now',
      type: 'AES-256 Offline + Cloud Geo-Redundant',
      status: 'Verified Healthy (SHA256 Match)'
    };
    setBackups(prev => [newBak, ...prev]);
  };

  return (
    <PlatformContext.Provider
      value={{
        currentView,
        setCurrentView,
        distributorModule,
        setDistributorModule,
        pharmacyScreen,
        setPharmacyScreen,
        pharmacyLoggedIn,
        setPharmacyLoggedIn,
        language,
        setLanguage,
        sidebarCollapsed,
        setSidebarCollapsed,
        notifications,
        orders,
        advanceOrderStage,
        placeNewPharmacyOrder,
        expiryIntimations,
        submitExpiryIntimation,
        broadcasts,
        acknowledgeBroadcast,
        pushNewBroadcast,
        acknowledgements,
        taxpayers,
        setTaxpayers,
        tickets,
        createSupportTicket,
        batchesRegistry,
        setBatchesRegistry,
        fleetVehicles,
        setFleetVehicles,
        claims,
        setClaims,
        backups,
        createBackupSnapshot,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
}
