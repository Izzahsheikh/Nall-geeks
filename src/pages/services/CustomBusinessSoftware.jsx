import { useEffect, useRef, useState } from 'react';
import ServicePage from './ServicePage';
import './cbs.css';

/* ── hooks ── */

function usePrefersReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setR(m.matches);
    update();
    m.addEventListener('change', update);
    return () => m.removeEventListener('change', update);
  }, []);
  return r;
}

function useInView(threshold = 0.18) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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

const SYSTEMS = [
  {
    num: '01',
    abbr: 'CRM',
    name: 'Customer Relationship Management',
    desc: 'Customer relationships, leads, communication, sales pipeline and follow-ups.',
  },
  {
    num: '02',
    abbr: 'POS',
    name: 'Point of Sale',
    desc: 'Sales, products, payments, transaction history and stock movement.',
  },
  {
    num: '03',
    abbr: 'ERP',
    name: 'Enterprise Resource Planning',
    desc: 'Operations, inventory, finance workflows, departments and reporting.',
  },
];

const ARCH_LAYERS = [
  { meta: 'Layer 01 — Users',      title: 'Users',          items: ['Customer', 'Staff', 'Admin'],                                      accent: false },
  { meta: 'Layer 02 — Interfaces', title: 'Interfaces',     items: ['CRM', 'POS', 'ERP', 'Admin Dashboard'],                            accent: true  },
  { meta: 'Layer 03 — Logic',      title: 'Business Logic', items: ['Orders', 'Sales', 'Operations', 'Permissions'],                    accent: false },
  { meta: 'Layer 04 — Data',       title: 'Shared Data',    items: ['Customers', 'Products', 'Inventory', 'Transactions'],              accent: false },
  { meta: 'Layer 05 — Outputs',    title: 'Outputs',        items: ['Reports', 'Analytics', 'Notifications'],                           accent: false },
];

const OPS_NODES = ['Customer', 'CRM', 'Sale / Order', 'Inventory', 'Operations', 'Reporting'];

const WORKFLOW_STEPS = [
  'Customer enquiry',
  'CRM record created',
  'Quote / order created',
  'Sale confirmed',
  'Inventory updated',
  'Operational record created',
  'Reporting updated',
];

const PROCESS_STEPS = [
  ['01', 'Understand',     'Business requirements, users, problems and existing workflows.'],
  ['02', 'System Design',  'Architecture, data structure, permissions and workflow logic.'],
  ['03', 'Build',          'Interfaces, integrations and core functionality.'],
  ['04', 'Refine',         'Testing, feedback, optimisation and iteration.'],
];

const PRINCIPLES = [
  ['WORKFLOWS',    'Processes designed around how your team actually operates.'],
  ['ROLES',        'Access and permissions based on responsibilities.'],
  ['INFORMATION',  'The data your team genuinely needs to work with.'],
  ['GROWTH',       'A structure that can evolve as requirements change.'],
];

/* ── 02 — What We Build ── */

function WhatWeBuild() {
  const [ref, inView] = useInView(0.15);
  return (
    <section className="cbs-section" ref={ref}>
      <div className="cbs-wrap">
        <header className={`cbs-build-head cbs-reveal${inView ? ' is-in' : ''}`}>
          <span className="cbs-eyebrow">What We Build</span>
          <h2 className="cbs-h2">Systems built around your operations</h2>
          <p className="cbs-lead">Different businesses require different systems. Whether you need to manage customer relationships, handle daily sales or connect your operations, the system should reflect your workflow — not the other way around.</p>
        </header>
        <div className="cbs-systems">
          {SYSTEMS.map((s, i) => (
            <article
              key={s.abbr}
              className={`cbs-system cbs-reveal${inView ? ' is-in' : ''}`}
              style={{ transitionDelay: inView ? `${0.15 + i * 0.13}s` : '0s' }}
            >
              <span className="cbs-sys-num">{s.num}</span>
              <h3 className="cbs-sys-abbr">{s.abbr}</h3>
              <p className="cbs-sys-name">{s.name}</p>
              <p className="cbs-sys-desc">{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 03 — System Design ── */

function SystemDesign() {
  const [ref, inView] = useInView(0.12);
  return (
    <section className="cbs-section cbs-section--soft" ref={ref}>
      <div className="cbs-wrap">
        <header className={`cbs-arch-head cbs-reveal${inView ? ' is-in' : ''}`}>
          <span className="cbs-eyebrow">System Design</span>
          <h2 className="cbs-h2">One system. Designed around how your business works.</h2>
          <p className="cbs-lead">Before development begins, we define how users, workflows, data and business rules should connect.</p>
        </header>

        <div className="cbs-arch-diagram" aria-label="System architecture layers">
          {ARCH_LAYERS.map((layer, i) => (
            <div key={layer.title}>
              {i > 0 && (
                <div
                  className={`cbs-arch-connector${inView ? ' is-in' : ''}`}
                  style={{ transitionDelay: inView ? `${0.08 + i * 0.16}s` : '0s' }}
                  aria-hidden="true"
                />
              )}
              <div
                className={`cbs-arch-layer${layer.accent ? ' cbs-arch-layer--accent' : ''}${inView ? ' is-in' : ''}`}
                style={{ transitionDelay: inView ? `${0.06 + i * 0.16}s` : '0s' }}
              >
                <div className="cbs-arch-layer-box">
                  <span className="cbs-arch-layer-meta">{layer.meta}</span>
                  <h3 className="cbs-arch-layer-title">{layer.title}</h3>
                  <ul className="cbs-arch-layer-items">
                    {layer.items.map(item => (
                      <li className="cbs-arch-item" key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 04 — Connected Operations ── */

function ConnectedOperations() {
  const [ref, inView] = useInView(0.2);
  return (
    <section className="cbs-section" ref={ref}>
      <div className="cbs-wrap">
        <header className={`cbs-ops-head cbs-reveal${inView ? ' is-in' : ''}`}>
          <span className="cbs-eyebrow">Connected Operations</span>
          <h2 className="cbs-h2">Information should move once, not be entered everywhere.</h2>
          <p className="cbs-lead">Customer, sales, inventory and operational information can live inside one connected system instead of separate spreadsheets and disconnected software.</p>
        </header>

        <div className="cbs-ops-flow">
          <div className="cbs-ops-track">
            {OPS_NODES.flatMap((node, i) => {
              const isFirst = i === 0;
              const isLast = i === OPS_NODES.length - 1;
              const nodeEl = (
                <div
                  key={`node-${i}`}
                  className={`cbs-ops-node${isFirst ? ' cbs-ops-node--first' : ''}${isLast ? ' cbs-ops-node--last' : ''}${inView ? ' is-in' : ''}`}
                  style={{ transitionDelay: inView ? `${0.08 + i * 0.1}s` : '0s' }}
                >
                  <span className="cbs-ops-node-label">{node}</span>
                </div>
              );
              if (isLast) return [nodeEl];
              const arrowEl = (
                <div
                  key={`sep-${i}`}
                  className={`cbs-ops-sep${inView ? ' is-in' : ''}`}
                  style={{ transitionDelay: inView ? `${0.12 + i * 0.1}s` : '0s' }}
                  aria-hidden="true"
                >
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                    <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              );
              return [nodeEl, arrowEl];
            })}
          </div>
          <div className="cbs-ops-line-wrap">
            <div
              className={`cbs-ops-line-fill${inView ? ' is-in' : ''}`}
              style={{ transitionDelay: inView ? '0.25s' : '0s' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 05 — Real Workflow ── */

function RealWorkflow() {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView(0.12);
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!inView || reduced) return;
    let step = 0;
    timerRef.current = setInterval(() => {
      step += 1;
      if (step >= WORKFLOW_STEPS.length) {
        clearInterval(timerRef.current);
        return;
      }
      setActive(step);
    }, 750);
    return () => clearInterval(timerRef.current);
  }, [inView, reduced]);

  return (
    <section className="cbs-section" ref={ref}>
      <div className="cbs-wrap">
        <header className={`cbs-wf-head cbs-reveal${inView ? ' is-in' : ''}`}>
          <span className="cbs-eyebrow">Connected Workflow</span>
          <h2 className="cbs-h2">See the system working as one workflow</h2>
        </header>
        <div className="cbs-wf-layout">
          <ol className="cbs-wf-steps">
            {WORKFLOW_STEPS.map((step, i) => (
              <li key={step}>
                {i > 0 && <div className="cbs-wf-connector" aria-hidden="true" />}
                <div
                  className={`cbs-wf-step${i === active ? ' is-active' : ''}${i < active ? ' is-visited' : ''}`}
                  onClick={() => setActive(i)}
                >
                  <span className="cbs-wf-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="cbs-wf-label">{step}</span>
                </div>
              </li>
            ))}
          </ol>

          <div className={`cbs-wf-copy cbs-reveal${inView ? ' is-in' : ''}`} style={{ transitionDelay: '0.2s' }}>
            <span className="cbs-wf-copy-eyebrow">One Workflow</span>
            <h3 className="cbs-wf-copy-h3">One structured system, not disconnected tools</h3>
            <p>Customer information, sales activity and operational data move through one structured system instead of being repeatedly entered into disconnected tools.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 06 — How We Build It ── */

function HowWeBuildIt() {
  const [ref, inView] = useInView(0.15);
  return (
    <section className="cbs-section cbs-section--soft" ref={ref}>
      <div className="cbs-wrap">
        <header className={`cbs-process-head cbs-reveal${inView ? ' is-in' : ''}`}>
          <span className="cbs-eyebrow">Our Approach</span>
          <h2 className="cbs-h2">Built around the business, not the other way around.</h2>
          <p className="cbs-lead">Custom software should reflect real workflows. We first understand how the business operates, then define the system around those requirements.</p>
        </header>

        <ol className="cbs-process-track">
          <div className="cbs-process-bar">
            <div className={`cbs-process-bar-fill${inView ? ' is-in' : ''}`} />
          </div>
          {PROCESS_STEPS.map(([num, title, desc], i) => (
            <li
              key={num}
              className={`cbs-process-step${inView ? ' is-in' : ''}`}
              style={{ transitionDelay: inView ? `${0.15 + i * 0.12}s` : '0s' }}
            >
              <span className="cbs-process-num">{num}</span>
              <h3 className="cbs-process-title">{title}</h3>
              <p>{desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── 07 — Built For Your Workflow ── */

function BuiltForYourWorkflow() {
  const [ref, inView] = useInView(0.15);
  return (
    <section className="cbs-section" ref={ref}>
      <div className="cbs-wrap">
        <header className={`cbs-flex-head cbs-reveal${inView ? ' is-in' : ''}`}>
          <span className="cbs-eyebrow">Built For Your Workflow</span>
          <h2 className="cbs-h2">Not every business works the same way.</h2>
        </header>
        <p className={`cbs-flex-body cbs-reveal${inView ? ' is-in' : ''}`} style={{ transitionDelay: '0.1s' }}>
          That is why we do not begin with a fixed feature list. The structure, permissions, workflows and functionality are defined around the requirements of the business using it.
        </p>
        <div className="cbs-principles">
          {PRINCIPLES.map(([title, desc], i) => (
            <article
              key={title}
              className={`cbs-principle${inView ? ' is-in' : ''}`}
              style={{ transitionDelay: inView ? `${0.15 + i * 0.1}s` : '0s' }}
            >
              <span className="cbs-principle-title">{title}</span>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 08 — Final CTA ── */

function FinalCta() {
  const [ref, inView] = useInView(0.2);
  return (
    <section className="cbs-cta" ref={ref}>
      <div className="cbs-wrap">
        <div className={`cbs-cta-inner cbs-reveal${inView ? ' is-in' : ''}`}>
          <div>
            <span className="cbs-cta-eyebrow">Custom Software</span>
            <h2 className="cbs-cta-h2">Your workflow shouldn't have to fit someone else's software.</h2>
          </div>
          <div className="cbs-cta-side">
            <p>Tell us how your business works. We'll help define the system that should support it.</p>
            <a href="/contact" className="cbs-btn">Discuss Your System</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── page ── */

export default function CustomBusinessSoftware() {
  return (
    <ServicePage
      eyebrow="Services"
      title="Custom Business Software"
      description="We design custom CRM, ERP, POS, dashboards and operational software around the way your business actually works."
      pageClassName="sp--custom-business-software"
      hideWork
      hideCta
    >
      <div className="cbs-root">
        <WhatWeBuild />
        <SystemDesign />
        <ConnectedOperations />
        <RealWorkflow />
        <HowWeBuildIt />
        <BuiltForYourWorkflow />
        <FinalCta />
      </div>
    </ServicePage>
  );
}
