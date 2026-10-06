import { useEffect, useRef, useState } from 'react';
import ServicePage from './ServicePage';
import './cbs.css';

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
const DISCOVERY_ITEMS = [
  { label: 'Business Goals',     note: 'What the company is trying to achieve' },
  { label: 'People & Roles',     note: 'Who does what and how they interact' },
  { label: 'Current Workflow',   note: 'How work actually moves today' },
  { label: 'Pain Points',        note: 'Where things break down or slow down' },
  { label: 'Data & Tools',       note: 'What information the business relies on' },
];

const ROLE_NODES = [
  { id: 'cust', label: 'Customer',   cx: 90,  cy: 100 },
  { id: 'sale', label: 'Sales',      cx: 255, cy: 100 },
  { id: 'ops',  label: 'Operations', cx: 448, cy: 100 },
  { id: 'inv',  label: 'Inventory',  cx: 630, cy: 100 },
  { id: 'fin',  label: 'Finance',    cx: 812, cy: 100 },
];
const ROLE_FLOWS = ['Enquiry', 'Quote / Order', 'Fulfilment', 'Invoice'];

const ARCH_LAYERS = [
  { id: 'people', label: '01  PEOPLE',
    nodes: [
      { id: 'customer', label: 'Customer' },
      { id: 'staff',    label: 'Staff'    },
      { id: 'manager',  label: 'Manager'  },
      { id: 'admin',    label: 'Admin'    },
    ]
  },
  { id: 'exp', label: '02  EXPERIENCE',
    nodes: [
      { id: 'cportal',   label: 'Customer Portal'    },
      { id: 'pos-exp',   label: 'POS Interface'      },
      { id: 'dash',      label: 'Internal Dashboard' },
      { id: 'admpanel',  label: 'Admin Panel'        },
    ]
  },
  { id: 'core', label: '03  CORE SYSTEM', isCore: true,
    nodes: [
      { id: 'crm',    label: 'CRM',       prime: true },
      { id: 'pos',    label: 'POS',       prime: true },
      { id: 'erp',    label: 'ERP',       prime: true },
      { id: 'sales',  label: 'Sales'  },
      { id: 'orders', label: 'Orders' },
      { id: 'inv',    label: 'Inventory' },
      { id: 'fin',    label: 'Finance'   },
    ]
  },
  { id: 'data', label: '04  DATA',
    nodes: [
      { id: 'dc', label: 'Customers' },
      { id: 'dp', label: 'Products'  },
      { id: 'do', label: 'Orders'    },
      { id: 'dy', label: 'Payments'  },
      { id: 'di', label: 'Inventory' },
      { id: 'da', label: 'Activity'  },
    ]
  },
  { id: 'integr', label: '05  INTEGRATIONS',
    nodes: [
      { id: 'ip',  label: 'Payments'   },
      { id: 'ia',  label: 'Accounting' },
      { id: 'ie',  label: 'Email'      },
      { id: 'iap', label: 'APIs'       },
      { id: 'ian', label: 'Analytics'  },
    ]
  },
];

const ARCH_FOCUS = {
  crm: ['customer', 'cportal', 'crm', 'sales', 'dc', 'ie'],
  pos: ['staff', 'pos-exp', 'pos', 'orders', 'dy', 'di', 'ip'],
  erp: ['manager', 'dash', 'erp', 'inv', 'fin', 'dp', 'ia', 'ian'],
};

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

/* ── Section 1: Business Discovery ── */
function BusinessDiscovery() {
  const [ref, inView] = useInView(0.15);
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (!inView || reduced) return;
    const t = setTimeout(() => setStep(0), 400);
    return () => clearTimeout(t);
  }, [inView, reduced]);

  useEffect(() => {
    if (step < 0 || step >= ROLE_NODES.length - 1 || reduced) return;
    const t = setTimeout(() => setStep(s => s + 1), 480);
    return () => clearTimeout(t);
  }, [step, reduced]);

  const RW = 116, RH = 38;
  return (
    <section className="cbs-section cbs-section--soft" ref={ref}>
      <div className="cbs-wrap">
        <div className="cbs-disc-grid">
          <div className={`cbs-disc-left cbs-reveal${inView ? ' is-in' : ''}`}>
            <span className="cbs-eyebrow">Business Discovery</span>
            <h2 className="cbs-h2">We understand the business before designing the software.</h2>
            <p className="cbs-lead">Before any technical decisions, we study how the company actually operates — the people, the workflows, the data and the friction.</p>
            <ol className="cbs-disc-list">
              {DISCOVERY_ITEMS.map(({ label, note }, i) => (
                <li key={label} className="cbs-disc-item"
                  style={{ transitionDelay: inView ? `${0.1 + i * 0.08}s` : '0s' }}>
                  <span className="cbs-disc-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{label}</strong>
                    <span>{note}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className={`cbs-disc-right${inView ? ' is-in' : ''}`}>
            <p className="cbs-disc-map-label">HOW INFORMATION MOVES THROUGH THE BUSINESS</p>
            <svg viewBox="0 0 900 200" className="cbs-roles-svg" aria-label="Business workflow map">
              {ROLE_NODES.slice(0, -1).map((n, i) => {
                const nx = ROLE_NODES[i + 1];
                return (
                  <g key={n.id + '-conn'}>
                    <line x1={n.cx + RW / 2} y1={n.cy} x2={nx.cx - RW / 2} y2={nx.cy}
                      className={`cbs-rl${step > i ? ' is-on' : ''}`} />
                    <text x={(n.cx + nx.cx) / 2} y={n.cy - 18}
                      className="cbs-rfl"
                      style={{ opacity: step > i ? 1 : 0, transition: 'opacity 0.35s ease' }}
                    >{ROLE_FLOWS[i]}</text>
                  </g>
                );
              })}
              {ROLE_NODES.map((n, i) => (
                <g key={n.id} className={`cbs-rn${step >= i ? ' is-on' : ''}`}
                  style={{ transition: `opacity 0.4s ease ${0.1 + i * 0.06}s` }}
                >
                  <rect x={n.cx - RW / 2} y={n.cy - RH / 2} width={RW} height={RH} rx={2}
                    className="cbs-rb" />
                  <text x={n.cx} y={n.cy + 6} className="cbs-rt">{n.label}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Section 2: System Architecture ── */
function SystemArchitecture() {
  const [ref, inView] = useInView(0.08);
  const [focus, setFocus] = useState(null);
  const related = focus ? new Set(ARCH_FOCUS[focus] || []) : null;

  const nodeClass = (id) => {
    if (!related) return 'cbs-an';
    if (related.has(id)) return 'cbs-an is-lit';
    return 'cbs-an is-dim';
  };

  return (
    <section className="cbs-section" ref={ref}>
      <div className="cbs-wrap">
        <div className={`cbs-arch-head cbs-reveal${inView ? ' is-in' : ''}`}>
          <span className="cbs-eyebrow">System Design</span>
          <h2 className="cbs-h2">We design the system before<br />we design the screens.</h2>
          <p className="cbs-lead">Before development begins, we define how users, workflows, data, permissions, business rules and integrations work together.</p>
        </div>
      </div>
      <div
        className={`cbs-arch-diagram${inView ? ' is-in' : ''}${focus ? ` focus-${focus}` : ''}`}
        onMouseLeave={() => setFocus(null)}
        aria-label="System architecture diagram"
      >
        <div className="cbs-wrap">
          {ARCH_LAYERS.map((layer, li) => (
            <div key={layer.id}
              className={`cbs-al${layer.isCore ? ' is-core' : ''}`}
              style={{ animationDelay: inView ? `${li * 0.07}s` : '0s' }}
            >
              <span className="cbs-al-label">{layer.label}</span>
              <div className="cbs-al-nodes">
                {layer.nodes.map(n => (
                  <button
                    key={n.id}
                    className={`${nodeClass(n.id)}${n.prime ? ' is-prime' : ''}`}
                    onMouseEnter={() => n.id in ARCH_FOCUS ? setFocus(n.id) : null}
                    onFocus={() => n.id in ARCH_FOCUS ? setFocus(n.id) : null}
                    tabIndex={n.id in ARCH_FOCUS ? 0 : -1}
                    aria-label={n.label}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <p className="cbs-arch-hint">
            {focus
              ? `${focus.toUpperCase()} — showing dependency path`
              : 'HOVER CRM, POS OR ERP TO TRACE A DEPENDENCY PATH'}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Section 3: One Connected Business (Orbital) ── */
function ConnectedBusiness() {
  const [ref, inView] = useInView(0.1);
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (!inView || reduced) return;
    const t0 = setTimeout(() => setStep(0), 600);
    return () => clearTimeout(t0);
  }, [inView, reduced]);

  useEffect(() => {
    if (step < 0 || reduced) return;
    const t = setTimeout(() => setStep(s => (s + 1) % ORBIT_SEQ.length), 620);
    return () => clearTimeout(t);
  }, [step, reduced]);

  const activeId = ORBIT_SEQ[step];

  const NW_PRIME = 96, NH_PRIME = 40;
  const NW_STD = 90, NH_STD = 32;
  const CW = 148, CH = 52;

  return (
    <section className="cbs-section cbs-section--soft" ref={ref}>
      <div className="cbs-wrap">
        <div className={`cbs-orb-head cbs-reveal${inView ? ' is-in' : ''}`}>
          <span className="cbs-eyebrow">One Connected Business</span>
          <h2 className="cbs-h2">Different departments.<br />One source of truth.</h2>
          <p className="cbs-lead">Every part of the business can work from the same underlying system instead of relying on disconnected tools and repeated data entry.</p>
        </div>
      </div>
      <div className={`cbs-orb-wrap${inView ? ' is-in' : ''}`}>
        <svg viewBox="0 0 1100 560" className="cbs-orb-svg"
          aria-label="Connected business system diagram">
          {/* Spoke lines */}
          {ORBIT_NODES.map(n => (
            <line key={n.id + '-sp'}
              x1={ORBIT_CORE.cx} y1={ORBIT_CORE.cy}
              x2={n.cx} y2={n.cy}
              className={`cbs-spoke${n.id === activeId ? ' is-on' : ''}`}
            />
          ))}
          {/* Core */}
          <rect x={ORBIT_CORE.cx - CW / 2} y={ORBIT_CORE.cy - CH / 2}
            width={CW} height={CH} rx={3} className="cbs-orb-core" />
          <text x={ORBIT_CORE.cx} y={ORBIT_CORE.cy - 8} className="cbs-orb-core-sub">ONE SYSTEM</text>
          <text x={ORBIT_CORE.cx} y={ORBIT_CORE.cy + 13} className="cbs-orb-core-name">BUSINESS</text>
          {/* Orbit nodes */}
          {ORBIT_NODES.map(n => {
            const w = n.prime ? NW_PRIME : NW_STD;
            const h = n.prime ? NH_PRIME : NH_STD;
            return (
              <g key={n.id} className={`cbs-orbn${n.id === activeId ? ' is-on' : ''} cbs-drift-${n.id}`}>
                <rect x={n.cx - w / 2} y={n.cy - h / 2} width={w} height={h} rx={2}
                  className="cbs-orbn-bg" />
                <text x={n.cx} y={n.cy + 5} className={`cbs-orbn-t${n.prime ? ' is-prime' : ''}`}>
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

/* ── Section 4: Connected Workflow ── */
function ConnectedWorkflow() {
  const [ref, inView] = useInView(0.12);
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(-1);
  const total = WF_MAIN.length + WF_BRANCH.length;

  useEffect(() => {
    if (!inView || reduced) return;
    const timers = Array.from({ length: total }, (_, i) =>
      setTimeout(() => setStep(i), 500 + i * 560)
    );
    return () => timers.forEach(clearTimeout);
  }, [inView, reduced]);

  const NW = 146, NH = 38;
  const BW = 150, BH = 34;

  const mainProgress = step < 0 ? 0 : Math.min(1, (step + 0.9) / WF_MAIN.length);
  const branchStarted = step >= WF_MAIN.length - 1;

  return (
    <section className="cbs-section" ref={ref}>
      <div className="cbs-wrap">
        <div className={`cbs-wf-head cbs-reveal${inView ? ' is-in' : ''}`}>
          <span className="cbs-eyebrow">Connected Workflow</span>
          <h2 className="cbs-h2">See how one action moves<br />through the business.</h2>
          <p className="cbs-lead">One customer action can automatically update multiple parts of the system — no manual re-entry, no disconnected records.</p>
        </div>
      </div>
      <div className={`cbs-wf-canvas${inView ? ' is-in' : ''}`}>
        <div className="cbs-wrap">
          <div className="cbs-wf-scroll">
            <svg viewBox="0 0 1120 220" className="cbs-wf-svg"
              aria-label="Workflow: customer enquiry to CRM, quote, order, sale, then inventory, finance and reporting">
              {/* Main path track */}
              <path d={WF_MAIN_PATH} className="cbs-wf-track" />
              {/* Main path progress */}
              <path d={WF_MAIN_PATH} className="cbs-wf-prog" pathLength="1"
                style={{ strokeDashoffset: Math.max(0, 1 - mainProgress) }} />
              {/* Branch stem track */}
              <path d={WF_TO_BRANCH} className="cbs-wf-track" />
              {branchStarted && <path d={WF_TO_BRANCH} className="cbs-wf-prog" pathLength="1"
                style={{ strokeDashoffset: 0 }} />}
              {/* Branch verticals */}
              {WF_BRANCH.map((b, i) => {
                const active = step >= WF_MAIN.length + i;
                return (
                  <g key={b.id}>
                    <line x1={845} y1={52} x2={b.x - BW / 2} y2={b.y}
                      className="cbs-wf-track" />
                    {active && (
                      <line x1={845} y1={52} x2={b.x - BW / 2} y2={b.y}
                        className="cbs-wf-prog" />
                    )}
                  </g>
                );
              })}
              {/* Main nodes */}
              {WF_MAIN.map((n, i) => (
                <g key={n.id} className={`cbs-wfn${i <= step ? ' is-on' : ''}${i === step ? ' is-active' : ''}`}>
                  <rect x={n.x - NW / 2} y={n.y - NH / 2} width={NW} height={NH} rx={2}
                    className="cbs-wfn-bg" />
                  <text x={n.x} y={n.y + 6} className="cbs-wfn-t">{n.label}</text>
                  {i <= step && (
                    <text x={n.x} y={n.y + NH / 2 + 17} className="cbs-wfn-s">{n.status}</text>
                  )}
                </g>
              ))}
              {/* Branch nodes */}
              {WF_BRANCH.map((n, i) => {
                const active = step >= WF_MAIN.length + i;
                return (
                  <g key={n.id} className={`cbs-wfn is-branch${active ? ' is-on' : ''}`}>
                    <rect x={n.x - BW / 2} y={n.y - BH / 2} width={BW} height={BH} rx={2}
                      className="cbs-wfn-bg" />
                    <text x={n.x} y={n.y + 6} className="cbs-wfn-t cbs-wfn-t--sm">{n.label}</text>
                    {active && (
                      <text x={n.x} y={n.y + BH / 2 + 15} className="cbs-wfn-s">{n.status}</text>
                    )}
                  </g>
                );
              })}
              {/* Branch dot at junction */}
              {branchStarted && (
                <circle cx={845} cy={52} r={4} className="cbs-wf-junc" />
              )}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Step canvas illustrations ── */
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
function HowWeBuild() {
  const [ref, inView] = useInView(0.05);
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    if (!inView) return;
    const observers = PROCESS_STEPS.map((_, i) => {
      const el = stepRefs.current[i];
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveStep(i); },
        { threshold: 0.55, rootMargin: '0px 0px -15% 0px' }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o && o.disconnect());
  }, [inView]);

  return (
    <section className="cbs-section cbs-section--soft cbs-build-section" ref={ref}>
      <div className="cbs-wrap">
        <div className={`cbs-build-head cbs-reveal${inView ? ' is-in' : ''}`}>
          <span className="cbs-eyebrow">How We Build</span>
          <h2 className="cbs-h2">From understanding the business<br />to running the business.</h2>
          <p className="cbs-lead">We understand how the company works, map the dependencies, design the system and build software that fits the organisation.</p>
        </div>
        <div className="cbs-build-layout">
          <ol className="cbs-build-steps">
            {PROCESS_STEPS.map(({ num, title, desc, keywords }, i) => (
              <li key={num}
                ref={el => stepRefs.current[i] = el}
                className={`cbs-build-step${i === activeStep ? ' is-active' : i < activeStep ? ' is-past' : ''}`}
                onClick={() => setActiveStep(i)}
              >
                <div className="cbs-build-marker">
                  <span className="cbs-build-num">{num}</span>
                </div>
                <div className="cbs-build-copy">
                  <h3 className="cbs-build-title">{title}</h3>
                  <p className="cbs-build-desc">{desc}</p>
                  <ul className="cbs-build-tags">
                    {keywords.map(k => <li key={k}>{k}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
          <div className="cbs-build-canvas-wrap">
            <div className="cbs-build-canvas">
              <div className="cbs-build-canvas-label">
                {PROCESS_STEPS[activeStep].num} — {PROCESS_STEPS[activeStep].title}
              </div>
              <StepCanvas step={activeStep} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Section 6: What We Build ── */
function WhatWeBuild() {
  const [ref, inView] = useInView(0.1);
  return (
    <section className="cbs-section" ref={ref}>
      <div className="cbs-wrap">
        <div className={`cbs-what-head cbs-reveal${inView ? ' is-in' : ''}`}>
          <span className="cbs-eyebrow">Built Around Your Operations</span>
          <h2 className="cbs-h2">Not another off-the-shelf tool.</h2>
          <p className="cbs-lead">Every system we build is designed from scratch around how the business actually operates.</p>
        </div>
        <div className="cbs-what-grid">
          {WHAT_WE_BUILD.map(({ tag, title, desc }, i) => (
            <div key={tag}
              className={`cbs-what-item cbs-reveal${inView ? ' is-in' : ''}`}
              style={{ transitionDelay: inView ? `${0.05 + i * 0.07}s` : '0s' }}
            >
              <span className="cbs-what-tag">{tag}</span>
              <h3 className="cbs-what-title">{title}</h3>
              <p className="cbs-what-desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section 7: Systems Working Together ── */
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
function FinalCta() {
  const [ref, inView] = useInView(0.2);
  return (
    <section className="cbs-cta" ref={ref}>
      <div className="cbs-wrap">
        <div className={`cbs-cta-inner cbs-reveal${inView ? ' is-in' : ''}`}>
          <div className="cbs-cta-left">
            <span className="cbs-eyebrow">Custom Software</span>
            <h2 className="cbs-cta-h2">Your workflow shouldn't have to fit<br />someone else's software.</h2>
          </div>
          <div className="cbs-cta-right">
            <p>Tell us how your business operates. We'll help define the system that should support it.</p>
            <a href="/contact" className="cbs-btn">Discuss Your System</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Page ── */
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
        <SystemArchitecture />
        <ConnectedBusiness />
        <ConnectedWorkflow />
        <HowWeBuild />
        <WhatWeBuild />
        <SystemsWorking />
        <FinalCta />
      </div>
    </ServicePage>
  );
}
