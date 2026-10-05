import { useEffect, useRef, useState } from 'react';
import ServicePage from './ServicePage';

const AREAS = [
  {
    number: '01',
    title: 'Operations Automation',
    description: 'Internal processes, repetitive admin, notifications, updates and follow-ups.',
  },
  {
    number: '02',
    title: 'Customer & Lead Workflows',
    description: 'Lead qualification, customer requests, CRM updates, routing and responses.',
  },
  {
    number: '03',
    title: 'Data & Reporting',
    description: 'Extracting information, organising data, generating reports and syncing records.',
  },
];

// `tag` marks the steps where AI or a person is involved; everything else is rule-based automation.
const WORKFLOWS = [
  {
    label: 'Lead Management',
    steps: [
      { label: 'Website Form' },
      { label: 'AI Qualification', tag: 'AI' },
      { label: 'CRM' },
      { label: 'Assign Team' },
      { label: 'Follow-up' },
    ],
  },
  {
    label: 'Customer Support',
    steps: [
      { label: 'Customer Message' },
      { label: 'AI Understands Request', tag: 'AI' },
      { label: 'Categorise' },
      { label: 'AI Reply / Human Team', tag: 'AI + Human' },
      { label: 'Update Record' },
    ],
  },
  {
    label: 'Document Processing',
    steps: [
      { label: 'Document Upload' },
      { label: 'AI Extracts Data', tag: 'AI' },
      { label: 'Validate' },
      { label: 'Human Review if Needed', tag: 'Human' },
      { label: 'Business System' },
    ],
  },
  {
    label: 'Communication',
    steps: [
      { label: 'Trigger' },
      { label: 'Customer / Lead Data' },
      { label: 'Generate Message', tag: 'AI' },
      { label: 'Send' },
      { label: 'Response' },
      { label: 'Update Record' },
    ],
  },
  {
    label: 'Reporting',
    steps: [
      { label: 'Business Data' },
      { label: 'Collect' },
      { label: 'Organise' },
      { label: 'Analyse', tag: 'AI' },
      { label: 'Prepare Report' },
      { label: 'Deliver to Team' },
    ],
  },
];

const TOOLS = [
  { label: 'Forms', detail: 'Website & intake forms' },
  { label: 'CRM', detail: 'Contacts, deals, pipelines' },
  { label: 'Email', detail: 'Inbox & outbound mail' },
  { label: 'Documents', detail: 'PDFs, invoices, contracts' },
  { label: 'Internal Systems', detail: 'Databases, sheets, ERP' },
  { label: 'Notifications', detail: 'Chat, SMS & alerts' },
];

const APPROACH = [
  ['01', 'Identify', 'Find the repetitive or disconnected work.'],
  ['02', 'Map', 'Understand triggers, decisions, data and outcomes.'],
  ['03', 'Automate', 'Build and connect the workflow.'],
  ['04', 'Test', 'Check normal cases, exceptions and handoffs.'],
  ['05', 'Refine', 'Improve the workflow based on real use.'],
];

const FLOW_DWELL_MS = 900;
const FLOW_TRAVEL_MS = 1150;
const FLOW_END_PAUSE_MS = 1400;
const FLOW_SWAP_MS = 280;
const HUB_TRAVEL_MS = 1500;
const HUB_HOLD_MS = 450;
const HUB_REST_MS = 1300;

const pad = (value) => String(value).padStart(2, '0');
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);

    update();
    media.addEventListener('change', update);

    return () => media.removeEventListener('change', update);
  }, []);

  return reducedMotion;
}

function useInView(ref, { threshold = 0.2, once = false } = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || !('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting && once) observer.disconnect();
    }, { threshold });
    observer.observe(node);

    return () => observer.disconnect();
  }, [ref, threshold, once]);

  return inView;
}

// True once the element is narrower than `breakpoint`, so diagrams can switch to a stacked layout.
function useNarrow(ref, breakpoint) {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || !('ResizeObserver' in window)) return undefined;

    const observer = new ResizeObserver(([entry]) => setNarrow(entry.contentRect.width < breakpoint));
    observer.observe(node);

    return () => observer.disconnect();
  }, [ref, breakpoint]);

  return narrow;
}

/* ----- Polyline helpers: diagrams are laid out in viewBox units and share one coordinate system ----- */

function measure(points) {
  const lengths = [0];
  for (let i = 1; i < points.length; i += 1) {
    const [a, b] = [points[i - 1], points[i]];
    lengths.push(lengths[i - 1] + Math.hypot(b.x - a.x, b.y - a.y));
  }
  return lengths;
}

function pointAt(points, lengths, distance) {
  const total = lengths[lengths.length - 1];
  const d = Math.min(Math.max(distance, 0), total);
  let i = 1;
  while (i < lengths.length - 1 && lengths[i] < d) i += 1;
  const span = lengths[i] - lengths[i - 1] || 1;
  const t = (d - lengths[i - 1]) / span;
  return {
    x: points[i - 1].x + (points[i].x - points[i - 1].x) * t,
    y: points[i - 1].y + (points[i].y - points[i - 1].y) * t,
  };
}

const toPath = (points) => points.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ');
const pct = (value, of) => `${(value / of) * 100}%`;

/* ----- Workflow diagram ----- */

// Three columns that snake left→right, then right→left, so every connector is horizontal or vertical.
function flowLayout(count, narrow) {
  if (narrow) {
    const width = 320;
    const gap = 112;
    return {
      width,
      height: 64 * 2 + gap * (count - 1),
      nodeWidth: 240,
      points: Array.from({ length: count }, (_, i) => ({ x: width / 2, y: 64 + i * gap })),
    };
  }

  const columns = [150, 450, 750];
  const rows = Math.ceil(count / 3);
  return {
    width: 900,
    height: 84 * 2 + (rows - 1) * 176,
    nodeWidth: 222,
    points: Array.from({ length: count }, (_, i) => {
      const row = Math.floor(i / 3);
      const column = row % 2 ? 2 - (i % 3) : i % 3;
      return { x: columns[column], y: 84 + row * 176 };
    }),
  };
}

function WorkflowDiagram({ workflow, animate }) {
  const canvasRef = useRef(null);
  const dotRef = useRef(null);
  const [activeStep, setActiveStep] = useState(-1);
  const narrow = useNarrow(canvasRef, 620);
  const { width, height, nodeWidth, points } = flowLayout(workflow.steps.length, narrow);

  // One pulse travels the connector: it rests inside a step (lighting it), then eases on to the next.
  useEffect(() => {
    const dot = dotRef.current;
    if (!animate || !dot) {
      setActiveStep(-1);
      return undefined;
    }

    const path = flowLayout(workflow.steps.length, narrow).points;
    const lengths = measure(path);
    const count = path.length;
    const cycle = count * FLOW_DWELL_MS + (count - 1) * FLOW_TRAVEL_MS + FLOW_END_PAUSE_MS;
    let frame = 0;
    let start = 0;
    let current = -2;

    const tick = (now) => {
      if (!start) start = now;
      let t = (now - start) % cycle;
      let step = -1;
      let distance = 0;
      let travelling = false;

      for (let i = 0; i < count; i += 1) {
        if (t < FLOW_DWELL_MS) {
          step = i;
          distance = lengths[i];
          break;
        }
        t -= FLOW_DWELL_MS;
        if (i === count - 1) break;
        if (t < FLOW_TRAVEL_MS) {
          travelling = true;
          distance = lengths[i] + (lengths[i + 1] - lengths[i]) * easeInOut(t / FLOW_TRAVEL_MS);
          break;
        }
        t -= FLOW_TRAVEL_MS;
      }

      const point = pointAt(path, lengths, distance);
      dot.setAttribute('cx', point.x);
      dot.setAttribute('cy', point.y);
      dot.style.opacity = travelling ? '1' : '0';
      if (step !== current) {
        current = step;
        setActiveStep(step);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate, workflow, narrow]);

  return (
    <div className="aia-flow-canvas" ref={canvasRef}>
      <div className="aia-flow-diagram" style={{ aspectRatio: `${width} / ${height}` }}>
        <svg viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
          <path className="aia-line" d={toPath(points)} />
          <circle className="aia-pulse" ref={dotRef} r="4.5" cx={points[0].x} cy={points[0].y} />
        </svg>

        <ol className="aia-flow-steps">
          {workflow.steps.map((step, index) => (
            <li
              className={`aia-node${index === activeStep ? ' is-active' : ''}`}
              key={step.label}
              style={{ left: pct(points[index].x, width), top: pct(points[index].y, height), width: pct(nodeWidth, width) }}
            >
              <span className="aia-node-meta">
                <span>{pad(index + 1)}</span>
                {step.tag && <em>{step.tag}</em>}
              </span>
              <strong>{step.label}</strong>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Workflows({ reducedMotion }) {
  const sectionRef = useRef(null);
  const [selected, setSelected] = useState(0);
  const [shown, setShown] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const inView = useInView(sectionRef);

  // Fade the current diagram out, swap it, and let the new one fade in from the side.
  useEffect(() => {
    if (selected === shown) return undefined;
    if (reducedMotion) {
      setShown(selected);
      return undefined;
    }

    setLeaving(true);
    const timer = window.setTimeout(() => {
      setShown(selected);
      setLeaving(false);
    }, FLOW_SWAP_MS);

    return () => window.clearTimeout(timer);
  }, [selected, shown, reducedMotion]);

  return (
    <section className="aia-section aia-flows" ref={sectionRef} aria-labelledby="aia-flows-title">
      <div className="sp-inner">
        <header className="aia-head">
          <span className="aia-eyebrow">Workflows</span>
          <h2 className="aia-h2" id="aia-flows-title">Different processes. Different automations.</h2>
        </header>

        <div className="aia-flows-layout">
          <ol className="aia-flow-nav" aria-label="Example workflows">
            {WORKFLOWS.map((workflow, index) => (
              <li key={workflow.label}>
                <button
                  type="button"
                  className={index === selected ? 'is-active' : undefined}
                  aria-pressed={index === selected}
                  onClick={() => setSelected(index)}
                >
                  <span>{pad(index + 1)}</span>
                  {workflow.label}
                </button>
              </li>
            ))}
          </ol>

          <div className={`aia-flow-stage${leaving ? ' is-leaving' : ''}`} aria-live="polite">
            <p className="aia-sr">{WORKFLOWS[shown].label}: {WORKFLOWS[shown].steps.map((step) => step.label).join(', then ')}.</p>
            <WorkflowDiagram
              key={shown}
              workflow={WORKFLOWS[shown]}
              animate={inView && !reducedMotion && !leaving}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----- Tools around the automation layer ----- */

function hubLayout(narrow) {
  if (narrow) {
    const width = 360;
    const height = 600;
    const hub = { x: 180, y: 300 };
    const tools = [60, 180, 300].flatMap((x) => [{ x, y: 64 }, { x, y: 536 }]);
    // Order to match TOOLS: top row first, then bottom row.
    const ordered = [tools[0], tools[2], tools[4], tools[1], tools[3], tools[5]];
    return {
      width,
      height,
      hub,
      hubWidth: 200,
      toolWidth: 108,
      tools: ordered,
      routes: ordered.map((t) => {
        const bend = t.y < hub.y ? 170 : 430;
        return [t, { x: t.x, y: bend }, { x: hub.x, y: bend }, hub];
      }),
    };
  }

  const width = 1000;
  const height = 420;
  const hub = { x: 500, y: 210 };
  const tools = [
    { x: 140, y: 70 }, { x: 140, y: 210 }, { x: 140, y: 350 },
    { x: 860, y: 70 }, { x: 860, y: 210 }, { x: 860, y: 350 },
  ];
  return {
    width,
    height,
    hub,
    hubWidth: 248,
    toolWidth: 210,
    tools,
    routes: tools.map((t) => {
      const bend = t.x < hub.x ? 320 : 680;
      return [t, { x: bend, y: t.y }, { x: bend, y: hub.y }, hub];
    }),
  };
}

function ToolsDiagram({ reducedMotion }) {
  const wrapRef = useRef(null);
  const dotRef = useRef(null);
  const [active, setActive] = useState({ tool: -1, hub: false });
  const narrow = useNarrow(wrapRef, 720);
  const inView = useInView(wrapRef);
  const layout = hubLayout(narrow);
  const { width, height, hub, routes } = layout;

  // Every so often a pulse leaves one tool, passes through the automation layer and arrives at another.
  useEffect(() => {
    const dot = dotRef.current;
    if (reducedMotion || !inView || !dot) {
      setActive({ tool: -1, hub: false });
      return undefined;
    }

    const { hub: center, routes: paths } = hubLayout(narrow);
    const measured = paths.map((route) => ({ route, lengths: measure(route) }));
    const cycle = HUB_TRAVEL_MS * 2 + HUB_HOLD_MS + HUB_REST_MS;
    let frame = 0;
    let start = 0;
    let round = -1;
    let pair = [0, 4];
    let last = '';

    const tick = (now) => {
      if (!start) start = now;
      const elapsed = now - start;
      const thisRound = Math.floor(elapsed / cycle);
      if (thisRound !== round) {
        round = thisRound;
        const from = (pair[1] + 1 + Math.floor(Math.random() * 4)) % paths.length;
        const to = (from + 2 + Math.floor(Math.random() * 3)) % paths.length;
        pair = [from, to];
      }

      const t = elapsed % cycle;
      const [from, to] = pair;
      let point = center;
      let visible = true;
      let state = { tool: -1, hub: false };

      if (t < HUB_TRAVEL_MS) {
        const { route, lengths } = measured[from];
        point = pointAt(route, lengths, lengths[lengths.length - 1] * easeInOut(t / HUB_TRAVEL_MS));
        state = { tool: t < 450 ? from : -1, hub: false };
      } else if (t < HUB_TRAVEL_MS + HUB_HOLD_MS) {
        visible = false;
        state = { tool: -1, hub: true };
      } else if (t < HUB_TRAVEL_MS * 2 + HUB_HOLD_MS) {
        const { route, lengths } = measured[to];
        const total = lengths[lengths.length - 1];
        const progress = easeInOut((t - HUB_TRAVEL_MS - HUB_HOLD_MS) / HUB_TRAVEL_MS);
        point = pointAt(route, lengths, total * (1 - progress));
        state = { tool: progress > 0.86 ? to : -1, hub: false };
      } else {
        visible = false;
        state = { tool: t < HUB_TRAVEL_MS * 2 + HUB_HOLD_MS + 500 ? to : -1, hub: false };
      }

      dot.setAttribute('cx', point.x);
      dot.setAttribute('cy', point.y);
      dot.style.opacity = visible ? '1' : '0';
      const key = `${state.tool}-${state.hub}`;
      if (key !== last) {
        last = key;
        setActive(state);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion, inView, narrow]);

  return (
    <div className="aia-hub-wrap" ref={wrapRef}>
      <div className={`aia-hub${narrow ? ' is-narrow' : ''}`} style={{ aspectRatio: `${width} / ${height}` }}>
        <svg viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
          {routes.map((route, index) => <path className="aia-line" d={toPath(route)} key={TOOLS[index].label} />)}
          <circle className="aia-pulse" ref={dotRef} r={narrow ? 4 : 4.5} cx={hub.x} cy={hub.y} />
        </svg>

        <div
          className={`aia-hub-core${active.hub ? ' is-active' : ''}`}
          style={{ left: pct(hub.x, width), top: pct(hub.y, height), width: pct(layout.hubWidth, width) }}
        >
          <strong>Automation Layer</strong>
          <span>Rules · AI · Integrations</span>
        </div>

        <ul className="aia-hub-tools" aria-label="Connected tools">
          {TOOLS.map((tool, index) => (
            <li
              className={`aia-tool${active.tool === index ? ' is-active' : ''}`}
              key={tool.label}
              style={{
                left: pct(layout.tools[index].x, width),
                top: pct(layout.tools[index].y, height),
                width: pct(layout.toolWidth, width),
              }}
            >
              <strong>{tool.label}</strong>
              <span>{tool.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ----- Approach ----- */

function Approach() {
  const trackRef = useRef(null);
  const inView = useInView(trackRef, { threshold: 0.35, once: true });

  return (
    <section className="aia-section aia-approach" aria-labelledby="aia-approach-title">
      <div className="sp-inner">
        <header className="aia-head aia-head--split">
          <div>
            <span className="aia-eyebrow">Our approach</span>
            <h2 className="aia-h2" id="aia-approach-title">From repetitive task to working automation</h2>
          </div>
          <p>
            We start with the process, not the tool — mapping your rules and systems, and keeping people involved
            wherever judgement matters.
          </p>
        </header>

        <ol className={`aia-steps${inView ? ' is-visible' : ''}`} ref={trackRef} style={{ '--steps': APPROACH.length }}>
          {APPROACH.map(([number, title, description], index) => (
            <li key={number} style={{ '--i': index }}>
              <span className="aia-step-dot" aria-hidden="true" />
              <span className="aia-step-num">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function AIAutomation() {
  const reducedMotion = useReducedMotion();

  return (
    <ServicePage
      title="AI Automation"
      description="We automate repetitive business processes by connecting AI, data and the tools your team already uses — so everyday operations keep moving without the manual work."
      pageClassName="sp--ai-automation"
      heroActions={<a className="aia-btn" href="/contact">Discuss an Automation</a>}
      hideWork
      hideCta
    >
      <div className="aia-page">
        <section className="aia-section aia-areas" aria-labelledby="aia-areas-title">
          <div className="sp-inner">
            <header className="aia-head aia-head--split">
              <div>
                <span className="aia-eyebrow">What we automate</span>
                <h2 className="aia-h2" id="aia-areas-title">Automate the work that slows your team down</h2>
              </div>
              <p>
                Every team repeats different tasks. We design focused automations that remove the manual steps,
                so people can spend their time on the work that needs them.
              </p>
            </header>

            <div className="aia-area-grid">
              {AREAS.map((area) => (
                <article className="aia-area" key={area.number}>
                  <span>{area.number}</span>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Workflows reducedMotion={reducedMotion} />

        <section className="aia-section aia-tools" aria-labelledby="aia-tools-title">
          <div className="sp-inner">
            <header className="aia-head aia-head--center">
              <span className="aia-eyebrow">Integrations</span>
              <h2 className="aia-h2" id="aia-tools-title">Connect the tools around the workflow</h2>
              <p>Automation sits between the systems you already use, moving information to where it is needed.</p>
            </header>
            <ToolsDiagram reducedMotion={reducedMotion} />
          </div>
        </section>

        <section className="aia-section aia-judgement" aria-labelledby="aia-judgement-title">
          <div className="sp-inner">
            <header className="aia-head">
              <span className="aia-eyebrow">AI + Automation</span>
              <h2 className="aia-h2" id="aia-judgement-title">
                AI where judgement is useful.<br />Automation where rules are enough.
              </h2>
            </header>

            <div className="aia-compare">
              <div>
                <span className="aia-compare-label">Automation</span>
                <p className="aia-compare-lead">Best for predictable actions and clear rules.</p>
                <ul>
                  <li>Move data</li>
                  <li>Send notifications</li>
                  <li>Create records</li>
                  <li>Trigger tasks</li>
                  <li>Update systems</li>
                </ul>
              </div>
              <div>
                <span className="aia-compare-label">AI</span>
                <p className="aia-compare-lead">Useful when information needs to be interpreted.</p>
                <ul>
                  <li>Understand messages</li>
                  <li>Extract information</li>
                  <li>Classify requests</li>
                  <li>Summarise content</li>
                  <li>Generate drafts</li>
                </ul>
              </div>
            </div>

            <p className="aia-uda" aria-label="Understand, decide, act">
              <span>Understand</span>
              <i aria-hidden="true" />
              <span>Decide</span>
              <i aria-hidden="true" />
              <span>Act</span>
            </p>
          </div>
        </section>

        <Approach />

        <section className="aia-cta" aria-labelledby="aia-cta-title">
          <div className="sp-inner">
            <h2 id="aia-cta-title">Have a repetitive process in your business?</h2>
            <p>We’ll help you identify what should be automated, where AI adds value, and what should stay human.</p>
            <a className="aia-btn" href="/contact">Discuss your workflow <span aria-hidden="true">→</span></a>
          </div>
        </section>
      </div>
    </ServicePage>
  );
}
