import { useEffect, useRef, useState } from 'react';
import { Users, ShoppingCart, Package, Settings, BarChart3, Database, Truck } from 'lucide-react';
import ServicePage from './ServicePage';
import './cbs.css';
import { SoftwareArchitecture, SoftwareWorkflow, SoftwareBenefits, SoftwareProcess, SoftwareCta } from './BusinessSoftwareSections';

/* ── hooks ── */
function usePrefersReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fn = () => setR(m.matches);
    fn(); m.addEventListener('change', fn);
    return () => m.removeEventListener('change', fn);
  }, []);
  return r;
}
function useInView(threshold = 0.18) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ── data ── */

const DISCOVERY_MAP_CARDS = [
  { id: 'customer', title: 'Customer', items: ['New Enquiry', 'Product Questions', 'Support Requests'], place: 'customer' },
  { id: 'sales', title: 'Sales & Orders', items: ['Create Quote', 'Manage Orders', 'Track Pipeline'], place: 'sales' },
  { id: 'inventory', title: 'Inventory & Resources', items: ['Check Stock', 'Manage Inventory', 'Purchase Orders'], place: 'inventory' },
  { id: 'operations', title: 'Business Operations', items: ['Fulfillment & Delivery', 'Team Coordination', 'Process Management'], place: 'operations' },
  { id: 'finance', title: 'Finance & Reporting', items: ['Generate Invoice', 'Track Payments', 'Reports & Analytics'], place: 'finance' },
  { id: 'tools', title: 'Data & Tools', items: ['CRM / ERP', 'Accounting Tools', 'Other Internal Systems'], place: 'tools' },
];

const SYS_MODULES = [
  { id: 'crm',    label: 'CRM',            cx: 162, cy: 148,
    items: ['Customers', 'Leads', 'Follow-ups'] },
  { id: 'pos',    label: 'POS',            cx: 738, cy: 148,
    items: ['Sales', 'Payments', 'Receipts'] },
  { id: 'erp',    label: 'ERP',            cx: 162, cy: 368,
    items: ['Inventory', 'Purchasing', 'Finance'] },
  { id: 'custom', label: 'Custom Modules', cx: 738, cy: 368,
    items: ['Workflows', 'Approvals', 'Reporting'] },
];

const ORBIT_CORE = { cx: 550, cy: 270 };
const ORBIT_NODES = [
  { id: 'crm',   label: 'CRM',        cx: 680, cy: 155, prime: true },
  { id: 'pos',   label: 'POS',        cx: 400, cy: 390, prime: true },
  { id: 'erp',   label: 'ERP',        cx: 700, cy: 390, prime: true },
  { id: 'cust',  label: 'Customers',  cx: 200, cy:  90 },
  { id: 'sales', label: 'Sales',      cx: 910, cy: 130 },
  { id: 'ord',   label: 'Orders',     cx: 980, cy: 290 },
  { id: 'inven', label: 'Inventory',  cx: 870, cy: 470 },
  { id: 'ops',   label: 'Operations', cx: 190, cy: 460 },
  { id: 'fin',   label: 'Finance',    cx:  80, cy: 270 },
  { id: 'rep',   label: 'Reporting',  cx: 380, cy: 520 },
];
const ORBIT_SEQ = ['cust','crm','sales','pos','ord','inven','erp','fin','rep'];

const WF_MAIN = [
  { id: 'enq',   label: 'Customer Enquiry',   status: 'Signal received',    x:  70, y: 110 },
  { id: 'crm',   label: 'CRM Record',         status: 'Contact logged',     x: 240, y:  52 },
  { id: 'quote', label: 'Quote Generated',    status: 'Quote prepared',     x: 420, y:  52 },
  { id: 'order', label: 'Order Confirmed',    status: 'Order created',      x: 600, y: 110 },
  { id: 'sale',  label: 'Sale Completed',     status: 'Payment received',   x: 770, y:  52 },
];
const WF_BRANCH = [
  { id: 'inv',   label: 'Inventory Updated',   status: 'Stock adjusted',    x: 1020, y:  26 },
  { id: 'fin',   label: 'Finance Updated',     status: 'Transaction logged', x: 1020, y: 104 },
  { id: 'rep',   label: 'Reporting Refreshed', status: 'Dashboard updated',  x: 1020, y: 182 },
];
const WF_MAIN_PATH = 'M70,110 L240,52 L420,52 L600,110 L770,52';
const WF_TO_BRANCH  = 'M770,52 L845,52';

const PROCESS_STEPS = [
  { num: '01', title: 'Understand',
    desc: 'We study how the business operates before deciding what to build.',
    keywords: ['Business goals', 'Existing processes', 'Pain points', 'Users'],
  },
  { num: '02', title: 'Map',
    desc: 'We document how work and information move through the company.',
    keywords: ['Workflows', 'Information movement', 'Roles', 'Dependencies'],
  },
  { num: '03', title: 'Design the System',
    desc: 'We define the architecture, modules, rules, permissions and integrations.',
    keywords: ['Architecture', 'CRM / POS / ERP', 'Rules', 'Permissions'],
  },
  { num: '04', title: 'Design the Experience',
    desc: 'We design interfaces around the people who will actually use the system.',
    keywords: ['User flows', 'Dashboards', 'Interfaces', 'Admin tools'],
  },
  { num: '05', title: 'Build',
    desc: 'We build the system, connected end to end, integrated where needed.',
    keywords: ['Frontend', 'Backend', 'Database', 'Integrations'],
  },
  { num: '06', title: 'Refine',
    desc: 'We refine based on real use and continue improving over time.',
    keywords: ['Testing', 'Feedback', 'Optimisation', 'Iteration'],
  },
];

const WHAT_WE_BUILD = [
  { tag: 'CRM',        title: 'CRM Systems',              desc: 'Customers, leads, communication and sales pipelines in one place.' },
  { tag: 'POS',        title: 'POS Systems',              desc: 'Sales, payments, products and real-time stock movement.' },
  { tag: 'ERP',        title: 'ERP Systems',              desc: 'Operations, inventory, finance, purchasing and reporting.' },
  { tag: 'OPS',        title: 'Operations Platforms',     desc: 'Jobs, teams, approvals, scheduling and internal workflows.' },
  { tag: 'ADMIN',      title: 'Admin & Management',       desc: 'Permissions, dashboards, records and controls.' },
  { tag: 'CONNECTED',  title: 'Connected Business Platforms', desc: 'Multiple business functions working through one shared system.' },
];

const SYS_DEPTS = [
  { tag: 'CRM',        label: 'CRM',        color: 'orange',
    items: ['Customer profile', 'Lead / opportunity', 'Communication history'] },
  { tag: 'POS',        label: 'POS',        color: 'mid',
    items: ['Order', 'Payment', 'Receipt'] },
  { tag: 'ERP',        label: 'ERP',        color: 'mid',
    items: ['Stock', 'Purchasing', 'Finance', 'Operations'] },
  { tag: 'MANAGEMENT', label: 'Management', color: 'mid',
    items: ['Reports', 'Performance', 'Forecasts'] },
];

/* ── Hero Blueprint Background ── */
function HeroBg() {
  return (
    <svg viewBox="0 0 1100 560" preserveAspectRatio="xMaxYMid meet" className="cbs-hero-bg" aria-hidden="true">
      <defs>
        <pattern id="cbsHeroGrid" width="56" height="56" patternUnits="userSpaceOnUse">
          <path d="M56 0L0 0 0 56" fill="none" stroke="rgba(31,33,36,0.045)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="1100" height="560" fill="url(#cbsHeroGrid)" />
      {/* Route paths */}
      <path d="M520,60 L700,60 L700,200 L880,200 L880,340" className="cbs-bg-route" />
      <path d="M700,200 L880,120" className="cbs-bg-route" />
      <path d="M880,340 L1060,340" className="cbs-bg-route" />
      <path d="M880,120 L1060,120 L1060,260" className="cbs-bg-route" />
      <path d="M520,200 L700,200" className="cbs-bg-route" />
      <path d="M520,340 L700,340 L700,480" className="cbs-bg-route" />
      <path d="M700,340 L880,340" className="cbs-bg-route" />
      {/* System nodes */}
      <rect x={470} y={44}  width={100} height={34} rx={2} className="cbs-bg-node" />
      <rect x={650} y={184} width={100} height={34} rx={2} className="cbs-bg-node" />
      <rect x={830} y={104} width={ 96} height={34} rx={2} className="cbs-bg-node" />
      <rect x={830} y={184} width={100} height={34} rx={2} className="cbs-bg-node" />
      <rect x={830} y={324} width={100} height={34} rx={2} className="cbs-bg-node" />
      <rect x={470} y={184} width={ 96} height={34} rx={2} className="cbs-bg-node" />
      <rect x={650} y={324} width={100} height={34} rx={2} className="cbs-bg-node" />
      {/* Node labels */}
      <text x={478} y={66}  className="cbs-bg-label">CRM</text>
      <text x={658} y={206} className="cbs-bg-label">ERP</text>
      <text x={838} y={126} className="cbs-bg-label">FINANCE</text>
      <text x={838} y={206} className="cbs-bg-label">INVENTORY</text>
      <text x={838} y={346} className="cbs-bg-label">REPORTING</text>
      <text x={478} y={206} className="cbs-bg-label">SALES</text>
      <text x={658} y={346} className="cbs-bg-label">POS</text>
      {/* Animated signal on one route */}
      <path d="M520,60 L700,60 L700,200 L880,200 L880,340"
        className="cbs-bg-signal" pathLength="1" />
    </svg>
  );
}

/* ── Discovery Diagram ── */
/*
 * Shared 900 × 850 coordinate space for cards, connectors and labels.
 * Operations: (300,280), 300 × 330. Side cards: x=0/700, 200 wide.
 * The center has 100-unit side lanes and a 90-unit data lane below.
 */
function DiscoveryDiagram({ reduced }) {
  const cardBox = (x, y, width, height) => ({
    left: `${x / 900 * 100}%`, top: `${y / 850 * 100}%`,
    width: `${width / 900 * 100}%`, height: `${height / 850 * 100}%`,
  });
  const P = {
    enquiry:    'M200,102 H700',
    quoteOrder: 'M800,196 V228 Q800,240 788,240 H462 Q450,240 450,252 V280',
    stockReq:   'M300,400 H200',
    stockAvail: 'M200,440 H300',
    invoice:    'M600,420 H700',
    opData:     'M437,610 V700',
    dataUp:     'M463,700 V610',
  };

  return (
    <div className="ddiag-wrap">
      <svg className="ddiag-svg" viewBox="0 0 900 850" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <marker id="dda-t" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 1L6 4L0 7" fill="none" stroke="#6ba39e" strokeWidth="1.5" strokeLinejoin="round"/>
          </marker>
          <marker id="dda-o" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 1L6 4L0 7" fill="none" stroke="#c2610c" strokeWidth="1.5" strokeLinejoin="round"/>
          </marker>
          <marker id="dda-s" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 1L6 4L0 7" fill="none" stroke="#8fa3b0" strokeWidth="1.5" strokeLinejoin="round"/>
          </marker>
        </defs>

        <path d={P.enquiry}    className="dln dln-t"           markerEnd="url(#dda-t)" />
        <path d={P.quoteOrder} className="dln dln-o dln-dash"   markerEnd="url(#dda-o)" />
        <path d={P.stockReq}   className="dln dln-s"            markerEnd="url(#dda-s)" />
        <path d={P.stockAvail} className="dln dln-t"            markerEnd="url(#dda-t)" />
        <path d={P.invoice}    className="dln dln-t"            markerEnd="url(#dda-t)" />
        <path d={P.opData}     className="dln dln-s"            markerEnd="url(#dda-s)" />
        <path d={P.dataUp}     className="dln dln-t"            markerEnd="url(#dda-t)" />

        {!reduced && <>
          <circle className="ddot ddot-t" r="3.5"><animateMotion dur="3s"   repeatCount="indefinite" path={P.enquiry} /></circle>
          <circle className="ddot ddot-o" r="3.5"><animateMotion dur="2.8s" begin="0.9s" repeatCount="indefinite" path={P.quoteOrder} /></circle>
          <circle className="ddot ddot-s" r="3.5"><animateMotion dur="2.5s" begin="0.4s" repeatCount="indefinite" path={P.stockReq} /></circle>
          <circle className="ddot ddot-t" r="3.5"><animateMotion dur="2.5s" begin="1.7s" repeatCount="indefinite" path={P.stockAvail} /></circle>
          <circle className="ddot ddot-t" r="3.5"><animateMotion dur="2.6s" begin="0.7s" repeatCount="indefinite" path={P.invoice} /></circle>
          <circle className="ddot ddot-s" r="3.5"><animateMotion dur="3s"   begin="2.1s" repeatCount="indefinite" path={P.opData} /></circle>
          <circle className="ddot ddot-t" r="3.5"><animateMotion dur="3s"   begin="1.2s" repeatCount="indefinite" path={P.dataUp} /></circle>
        </>}

        {/* Labels occupy separate lanes with explicit SVG text anchors. */}
        <text x="450" y="80" className="dptxt">Enquiry</text>
        <text x="625" y="219" className="dptxt">Confirmed Order</text>
        <text x="625" y="266" className="dptxt">Manual handoff</text>
        <text x="250" y="381" className="dptxt">Stock Request</text>
        <text x="250" y="464" className="dptxt">Availability</text>
        <text x="650" y="401" className="dptxt">Invoice</text>
        <text x="487" y="659" className="dptxt dptxt-start">Operational Data</text>
      </svg>


      <div className="dcard" style={cardBox(0, 8, 200, 188)}>
        <div className="dcard-hd">
          <span className="dcard-ico dcard-ico-t"><Users size={17}/></span>
          <div><b>Customer</b><em>Enquiries &amp; Support</em></div>
        </div>
        <ul><li>New enquiry</li><li>Product questions</li><li>Support requests</li></ul>
      </div>

      <div className="dcard" style={cardBox(700, 8, 200, 188)}>
        <div className="dcard-hd">
          <span className="dcard-ico dcard-ico-o"><ShoppingCart size={17}/></span>
          <div><b>Sales &amp; Orders</b><em>Quotes &amp; Conversions</em></div>
        </div>
        <ul><li>Create quote</li><li>Manage orders</li><li>Track pipeline</li></ul>
      </div>

      <div className="dcard" style={cardBox(0, 345, 200, 188)}>
        <div className="dcard-hd">
          <span className="dcard-ico dcard-ico-s"><Package size={17}/></span>
          <div><b>Inventory &amp; Resources</b><em>Stock &amp; Procurement</em></div>
        </div>
        <ul><li>Check stock</li><li>Manage inventory</li><li>Purchase orders</li></ul>
      </div>

      <div className="dcard dcard-ops" style={cardBox(300, 280, 300, 330)}>
        <div className="dops-icon"><Settings size={26}/></div>
        <div className="dops-title">Business Operations</div>
        <div className="dops-sub">Core Processes</div>
        <div className="dops-rows">
          <div className="dops-row"><Truck size={17}/><span>Fulfilment &amp; Delivery</span></div>
          <div className="dops-row"><Users size={17}/><span>Team Coordination</span></div>
          <div className="dops-row"><Settings size={17}/><span>Process Management</span></div>
        </div>
      </div>

      <div className="dcard" style={cardBox(700, 345, 200, 188)}>
        <div className="dcard-hd">
          <span className="dcard-ico dcard-ico-t"><BarChart3 size={17}/></span>
          <div><b>Finance &amp; Reporting</b><em>Invoices &amp; Insights</em></div>
        </div>
        <ul><li>Generate invoice</li><li>Track payments</li><li>Reports &amp; analytics</li></ul>
      </div>

      <div className="dcard dcard-tools" style={cardBox(325, 700, 250, 142)}>
        <div className="dcard-hd">
          <span className="dcard-ico dcard-ico-s"><Database size={17}/></span>
          <div><b>Data &amp; Tools</b><em>Systems &amp; Integrations</em></div>
        </div>
        <ul><li>CRM / ERP</li><li>Accounting tools</li><li>Other internal systems</li></ul>
      </div>

    </div>
  );
}

/* ── Section 1: Business Discovery ── */
function BusinessDiscovery() {
  const [ref, inView] = useInView(0.12);
  const reduced = usePrefersReducedMotion();

  return (
    <section className="cbs-section cbs-section--soft" ref={ref}>
      <div className="cbs-wrap">
        <div className={`cbs-disc-top cbs-reveal${inView ? ' is-in' : ''}`}>
          <span className="cbs-eyebrow">Business Discovery</span>
          <h2 className="cbs-h2">We understand the business before designing the software.</h2>
          <p className="cbs-lead">Before any technical decisions, we study how the company actually operates — the people, the workflows, the data and the friction.</p>
        </div>
        <div className={`cbs-disc-right${inView ? ' is-in' : ''}`}>
          <p className="cbs-disc-map-label">HOW INFORMATION MOVES THROUGH THE BUSINESS</p>
          <DiscoveryDiagram reduced={reduced} />
        </div>
      </div>
    </section>
  );
}

/* ── Section 2: System Blocks (CRM / POS / ERP / Custom) ── */
function SystemBlocks() { return <SoftwareArchitecture />; }

function ConnectedWorkflow() { return <SoftwareWorkflow />; }

function StepCanvas({ step }) {
  const views = [
    /* 01 Understand */
    <svg key={0} viewBox="0 0 360 200" className="cbs-sc-svg">
      {[['Goals', 40, 38], ['Processes', 280, 28], ['Pain Points', 60, 150], ['Users', 300, 160], ['Data', 180, 170], ['Tools', 200, 30]].map(([l, x, y]) => (
        <g key={l}>
          <circle cx={x} cy={y} r={4} className="cbs-sc-dot" />
          <text x={x + 8} y={y + 4} className="cbs-sc-lbl">{l}</text>
        </g>
      ))}
      <rect x={130} y={76} width={100} height={56} rx={2} className="cbs-sc-box" />
      <text x={180} y={101} className="cbs-sc-bh">BUSINESS</text>
      <text x={180} y={118} className="cbs-sc-bh">PROFILE</text>
      {[[40, 38], [280, 28], [60, 150], [300, 160], [180, 170], [200, 30]].map(([x, y], i) => (
        <line key={i} x1={x} y1={y} x2={180} y2={104} className="cbs-sc-line" />
      ))}
    </svg>,

    /* 02 Map */
    <svg key={1} viewBox="0 0 360 120" className="cbs-sc-svg">
      {[['Customer', 40], ['Sales', 120], ['Operations', 216], ['Inventory', 310], ['Finance', 400]].slice(0,5).map(([l, x], i) => (
        <g key={l}>
          {i > 0 && <line x1={x - 50} y1={60} x2={x - 12} y2={60} className="cbs-sc-arrow" />}
          <rect x={x - 44} y={42} width={88} height={34} rx={2} className="cbs-sc-box" />
          <text x={x} y={63} className="cbs-sc-bh">{l}</text>
        </g>
      ))}
    </svg>,

    /* 03 Design System */
    <svg key={2} viewBox="0 0 360 200" className="cbs-sc-svg">
      {[['PEOPLE', 20, 26], ['EXPERIENCE', 20, 74], ['CORE SYSTEM', 20, 130], ['DATA', 20, 170], ['INTEGRATIONS', 20, 196]].map(([l, x, y]) => (
        <text key={l} x={x} y={y} className="cbs-sc-layer-lbl">{l}</text>
      ))}
      <line x1={100} y1={10} x2={100} y2={200} className="cbs-sc-divider" />
      {[['CRM', 130, 118, true], ['POS', 200, 118, true], ['ERP', 270, 118, true]].map(([l, x, y, p]) => (
        <g key={l}>
          <rect x={x - 28} y={y - 18} width={56} height={34} rx={2}
            className={`cbs-sc-box${p ? ' is-prime' : ''}`} />
          <text x={x} y={y + 4} className={`cbs-sc-bh${p ? ' is-prime' : ''}`}>{l}</text>
        </g>
      ))}
      {[['Sales', 130, 62], ['Inventory', 200, 62], ['Finance', 270, 62]].map(([l, x, y]) => (
        <g key={l}>
          <rect x={x - 28} y={y - 12} width={56} height={22} rx={2} className="cbs-sc-box cbs-sc-box--sm" />
          <text x={x} y={y + 4} className="cbs-sc-lbl">{l}</text>
        </g>
      ))}
    </svg>,

    /* 04 Design Experience */
    <svg key={3} viewBox="0 0 360 200" className="cbs-sc-svg">
      {[['Customer Portal', 58, 50], ['POS Interface', 170, 50], ['Dashboard', 275, 50], ['Admin Panel', 58, 148]].map(([l, x, y]) => (
        <g key={l}>
          <rect x={x - 48} y={y - 38} width={96} height={74} rx={3} className="cbs-sc-frame" />
          <rect x={x - 40} y={y - 30} width={80} height={10} rx={1} className="cbs-sc-frame-hd" />
          <text x={x} y={y + 28} className="cbs-sc-lbl">{l}</text>
        </g>
      ))}
    </svg>,

    /* 05 Build */
    <svg key={4} viewBox="0 0 360 180" className="cbs-sc-svg">
      {[['Frontend', 22], ['Business Logic', 66], ['Database', 110], ['Integrations', 154]].map(([l, y]) => (
        <g key={l}>
          <rect x={80} y={y} width={200} height={30} rx={2} className="cbs-sc-box" />
          <text x={180} y={y + 20} className="cbs-sc-bh">{l}</text>
          {y < 154 && <line x1={180} y1={y + 30} x2={180} y2={y + 42} className="cbs-sc-arrow" />}
        </g>
      ))}
    </svg>,

    /* 06 Refine */
    <svg key={5} viewBox="0 0 360 200" className="cbs-sc-svg">
      <circle cx={180} cy={100} r={70} className="cbs-sc-loop" />
      {[['Build', 180, 30], ['Test', 250, 100], ['Measure', 180, 170], ['Improve', 110, 100]].map(([l, x, y]) => (
        <g key={l}>
          <circle cx={x} cy={y} r={18} className="cbs-sc-loop-node" />
          <text x={x} y={y + 5} className="cbs-sc-lbl">{l}</text>
        </g>
      ))}
    </svg>,
  ];
  return <div className="cbs-sc-wrap">{views[step] || views[0]}</div>;
}

/* ── Section 5: How We Build ── */
function HowWeBuild() { return <SoftwareProcess />; }

function WhatWeBuild() { return <SoftwareBenefits />; }

function SystemsWorking() {
  const [ref, inView] = useInView(0.12);
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (!inView || reduced) return;
    const t = setTimeout(() => setStep(0), 400);
    return () => clearTimeout(t);
  }, [inView, reduced]);

  useEffect(() => {
    if (step < 0 || reduced) return;
    const t = setTimeout(() => setStep(s => (s + 1) % SYS_DEPTS.length), 950);
    return () => clearTimeout(t);
  }, [step, reduced]);

  return (
    <section className="cbs-section cbs-section--soft" ref={ref}>
      <div className="cbs-wrap">
        <div className={`cbs-sys-head cbs-reveal${inView ? ' is-in' : ''}`}>
          <span className="cbs-eyebrow">One System. Multiple Operations.</span>
          <h2 className="cbs-h2">One customer interaction.<br />Every system updated.</h2>
          <p className="cbs-lead">A single event in CRM can automatically flow through POS, update ERP, adjust inventory and refresh management reporting — without any manual re-entry.</p>
        </div>
        <div className={`cbs-sys-flow${inView ? ' is-in' : ''}`}>
          {/* Data path line */}
          <div className="cbs-sys-path-wrap" aria-hidden="true">
            <svg viewBox="0 0 1000 6" className="cbs-sys-path-svg" preserveAspectRatio="none">
              <line x1={0} y1={3} x2={1000} y2={3} className="cbs-sysp-track" />
              {step >= 0 && (
                <line x1={0} y1={3} x2={1000} y2={3}
                  className="cbs-sysp-prog"
                  pathLength="1"
                  style={{ strokeDashoffset: Math.max(0, 1 - (step + 0.9) / SYS_DEPTS.length) }}
                />
              )}
            </svg>
          </div>
          <div className="cbs-sys-depts">
            {SYS_DEPTS.map((dept, i) => (
              <div key={dept.tag}
                className={`cbs-dept${i === step ? ' is-active' : i < step ? ' is-past' : ''}`}
              >
                <div className="cbs-dept-header">
                  <span className="cbs-dept-tag">{dept.tag}</span>
                  <h3 className="cbs-dept-name">{dept.label}</h3>
                </div>
                <ul className="cbs-dept-items">
                  {dept.items.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA ── */
function FinalCta() { return <SoftwareCta />; }

export default function CustomBusinessSoftware() {
  return (
    <ServicePage
      eyebrow="Custom Business Software"
      title={<>One system.<br /><em>Built around your business.</em></>}
      description="CRM, sales, inventory, operations, finance and reporting should not live as disconnected tools. We design them as parts of one connected business system."
      pageClassName="sp--custom-business-software"
      heroActions={<a href="/contact" className="cbs-btn cbs-btn--hero">Discuss Your System</a>}
      heroAside={<HeroBg />}
      hideWork
      hideCta
    >
      <div className="cbs-root">
        <BusinessDiscovery />
        <div className="cbs-post-discovery">
        <SystemBlocks />
        <ConnectedWorkflow />
        <WhatWeBuild />
        <HowWeBuild />
        <SystemsWorking />
        <FinalCta />
        </div>
      </div>
    </ServicePage>
  );
}
