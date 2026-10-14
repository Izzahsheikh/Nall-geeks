import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Settings, Users, BarChart2, FileText, UserPlus, Globe, Mail, Megaphone,
  MessageSquare, Inbox, Headset, Phone, FileUp, FolderOpen, ScanText,
  ClipboardCheck, Database, Send, Bell, FileSpreadsheet, Server,
  ChartNoAxesCombined, Search, Brain, Play, Workflow, CircleCheck, Zap,
  ClipboardList, Bot, UserRound, FileOutput, ListChecks, ArrowUpRight,
} from 'lucide-react';
import ServicePage from './ServicePage';

const AREAS = [
  {
    number: '01',
    title: 'Operations Automation',
    description: 'Internal processes, repetitive administration, approvals, notifications and follow-ups.',
    Icon: Settings,
    cta: 'Reduce manual work',
  },
  {
    number: '02',
    title: 'Customer & Lead Workflows',
    description: 'Lead capture, customer inquiries, CRM updates, routing and automated responses.',
    Icon: Users,
    cta: 'Improve response time',
  },
  {
    number: '03',
    title: 'Data & Reporting',
    description: 'Collecting, transforming, organising and reporting data across business systems.',
    Icon: BarChart2,
    cta: 'Turn data into insights',
  },
  {
    number: '04',
    title: 'Content & Document Processing',
    description: 'Extracting information, summarising documents, organising content and generating drafts.',
    Icon: FileText,
    cta: 'Save time on documents',
  },
];

// `tag` marks the steps where AI or a person is involved; everything else is rule-based automation.
const WORKFLOWS = [
  {
    label: 'Lead Management',
    inputs: [
      { title: 'New Lead', detail: 'Form submission or enquiry', Icon: UserPlus, tone: 'teal' },
      { title: 'Website Visit', detail: 'High intent activity', Icon: Globe, tone: 'blue' },
      { title: 'Email Enquiry', detail: 'Inbound sales request', Icon: Mail, tone: 'orange' },
      { title: 'Campaign Reply', detail: 'Response or referral', Icon: Megaphone, tone: 'purple' },
    ],
    outputs: [
      { title: 'Create or Update Record', detail: 'CRM, database or sheet', Icon: Database, tone: 'teal' },
      { title: 'Assign to Sales', detail: 'Route to the right person', Icon: UserRound, tone: 'orange' },
      { title: 'Send a Follow-up', detail: 'Email or message', Icon: Send, tone: 'purple' },
      { title: 'Notify the Team', detail: 'Keep everyone in sync', Icon: Bell, tone: 'blue' },
    ],
  },
  {
    label: 'Customer Support',
    inputs: [
      { title: 'Support Ticket', detail: 'New customer issue', Icon: Headset, tone: 'teal' },
      { title: 'Email Request', detail: 'Message to the team', Icon: Inbox, tone: 'blue' },
      { title: 'Chat Message', detail: 'Live customer question', Icon: MessageSquare, tone: 'purple' },
      { title: 'Call Notes', detail: 'Conversation summary', Icon: Phone, tone: 'orange' },
    ],
    outputs: [
      { title: 'Categorise Request', detail: 'Topic and priority', Icon: ListChecks, tone: 'purple' },
      { title: 'Send a Response', detail: 'Helpful, timely reply', Icon: Send, tone: 'teal' },
      { title: 'Escalate to a Person', detail: 'When human judgement helps', Icon: UserRound, tone: 'orange' },
      { title: 'Update Support Record', detail: 'Keep the history complete', Icon: ClipboardCheck, tone: 'blue' },
    ],
  },
  {
    label: 'Document Processing',
    inputs: [
      { title: 'Document Upload', detail: 'PDF, scan or image', Icon: FileUp, tone: 'blue' },
      { title: 'Invoice Email', detail: 'Attachment in the inbox', Icon: Mail, tone: 'orange' },
      { title: 'Shared Folder', detail: 'New file in a workspace', Icon: FolderOpen, tone: 'teal' },
      { title: 'Form Attachment', detail: 'Customer-submitted file', Icon: FileText, tone: 'purple' },
    ],
    outputs: [
      { title: 'Extract Key Details', detail: 'Names, dates and values', Icon: ScanText, tone: 'blue' },
      { title: 'Validate Information', detail: 'Check rules and accuracy', Icon: CircleCheck, tone: 'teal' },
      { title: 'Review Exceptions', detail: 'Bring a person in as needed', Icon: ClipboardCheck, tone: 'orange' },
      { title: 'Update Business System', detail: 'Save structured records', Icon: Database, tone: 'purple' },
    ],
  },
  {
    label: 'Communication',
    inputs: [
      { title: 'Trigger Event', detail: 'A change or key moment', Icon: Workflow, tone: 'orange' },
      { title: 'New Enquiry', detail: 'Someone needs a response', Icon: MessageSquare, tone: 'teal' },
      { title: 'Customer Details', detail: 'Context from your CRM', Icon: Users, tone: 'blue' },
      { title: 'Booking Update', detail: 'Appointment or schedule', Icon: ClipboardList, tone: 'purple' },
    ],
    outputs: [
      { title: 'Prepare a Message', detail: 'Personalised to the context', Icon: FileText, tone: 'purple' },
      { title: 'Send Email or SMS', detail: 'Reach the right person', Icon: Send, tone: 'teal' },
      { title: 'Notify the Team', detail: 'Share important updates', Icon: Bell, tone: 'orange' },
      { title: 'Log Conversation', detail: 'Keep a complete record', Icon: ClipboardCheck, tone: 'blue' },
    ],
  },
  {
    label: 'Reporting',
    inputs: [
      { title: 'CRM Records', detail: 'Customers and opportunities', Icon: Database, tone: 'teal' },
      { title: 'Sales Data', detail: 'Orders and performance', Icon: ChartNoAxesCombined, tone: 'blue' },
      { title: 'Operations Metrics', detail: 'Work in progress', Icon: Settings, tone: 'orange' },
      { title: 'Finance Records', detail: 'Costs and revenue', Icon: FileSpreadsheet, tone: 'purple' },
    ],
    outputs: [
      { title: 'Combine and Clean', detail: 'Reliable, ready-to-use data', Icon: ListChecks, tone: 'teal' },
      { title: 'Generate a Report', detail: 'Clear summaries and trends', Icon: FileOutput, tone: 'blue' },
      { title: 'Share with the Team', detail: 'Deliver insights on schedule', Icon: Send, tone: 'purple' },
      { title: 'Flag Key Changes', detail: 'Surface important movement', Icon: Bell, tone: 'orange' },
    ],
  },
];

const PROCESS_STEPS = [
  { label: 'Understand', Icon: Search },
  { label: 'Process', Icon: Brain },
  { label: 'Take Action', Icon: Play },
  { label: 'Update Systems', Icon: Database },
];

const TOOLS = [
  { label: 'Forms', detail: 'Website & intake forms', side: 'input', Icon: FileText, tone: 'blue' },
  { label: 'Email', detail: 'Inbox & outbound mail', side: 'input', Icon: Mail, tone: 'teal' },
  { label: 'Documents', detail: 'PDFs, invoices, contracts', side: 'input', Icon: FileUp, tone: 'orange' },
  { label: 'Notifications', detail: 'Chat, SMS & alerts', side: 'input', Icon: Bell, tone: 'orange' },
  { label: 'CRM', detail: 'Contacts, deals, pipelines', side: 'output', Icon: Users, tone: 'blue' },
  { label: 'Sheets & Databases', detail: 'Structured business data', side: 'output', Icon: FileSpreadsheet, tone: 'teal' },
  { label: 'Internal Systems', detail: 'Your tools & platforms', side: 'output', Icon: ChartNoAxesCombined, tone: 'blue' },
  { label: 'Other Applications', detail: 'Your connected tools', side: 'output', Icon: Workflow, tone: 'purple' },
];

const QUALITIES = [
  ['01', 'Business-first approach', 'Solutions designed around your actual goals and problems.', Search, 'orange'],
  ['02', 'Custom workflows', 'Automation tailored to your processes, tools and team.', Workflow, 'teal'],
  ['03', 'Secure & reliable', 'Thoughtful security, privacy, human oversight and dependable operation.', Settings, 'blue'],
  ['04', 'End-to-end support', 'Planning, implementation, testing, monitoring and improvement.', Headset, 'teal'],
];

const LOGIC_STEPS = [
  ['Understand', 'Receive and interpret information.', Search],
  ['Decide', 'Apply business rules or AI reasoning.', Brain],
  ['Act', 'Trigger the right action across connected systems.', ArrowUpRight],
];

const APPROACH = [
  ['01', 'Identify', 'Find the repetitive work.'],
  ['02', 'Map', 'Clarify steps and decisions.'],
  ['03', 'Automate', 'Connect tools and actions.'],
  ['04', 'Test', 'Check edge cases and handoffs.'],
  ['05', 'Refine', 'Improve with real use.'],
];

const FLOW_DWELL_MS = 400;
const FLOW_TRAVEL_MS = 620;
const FLOW_END_PAUSE_MS = 380;
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

const FLOW_WIDTH = 1000;
const FLOW_HEIGHT = 520;
const FLOW_INPUT_ROWS = [62, 194, 326, 458];
const FLOW_PROCESS_ROWS = [194, 240, 286, 332];

const incomingPath = (index) => {
  const y = FLOW_INPUT_ROWS[index];
  const processY = FLOW_PROCESS_ROWS[index];
  return `M 270 ${y} H 310 L 346 ${processY} H 390`;
};

const outgoingPath = (index) => {
  const y = FLOW_INPUT_ROWS[index];
  const processY = FLOW_PROCESS_ROWS[index];
  return `M 610 ${processY} H 654 L 690 ${y} H 730`;
};

const flowRoute = (index) => [
  [{ x: 270, y: FLOW_INPUT_ROWS[index] }, { x: 310, y: FLOW_INPUT_ROWS[index] }, { x: 346, y: FLOW_PROCESS_ROWS[index] }, { x: 390, y: FLOW_PROCESS_ROWS[index] }],
  [{ x: 610, y: FLOW_PROCESS_ROWS[index] }, { x: 654, y: FLOW_PROCESS_ROWS[index] }, { x: 690, y: FLOW_INPUT_ROWS[index] }, { x: 730, y: FLOW_INPUT_ROWS[index] }],
];

function WorkflowDiagram({ workflow, animate }) {
  const dotRef = useRef(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [processingStep, setProcessingStep] = useState(-1);

  // One pulse travels from an input through the processing module and out to its paired action.
  useEffect(() => {
    const dot = dotRef.current;
    if (!animate || !dot) {
      setActiveStep(-1);
      setProcessingStep(-1);
      return undefined;
    }

    const routes = workflow.inputs.map((_, index) => flowRoute(index).map((route) => ({ route, lengths: measure(route) })));
    const stageDuration = FLOW_DWELL_MS * 2 + FLOW_TRAVEL_MS * 2 + FLOW_END_PAUSE_MS;
    const cycle = workflow.inputs.length * stageDuration;
    let frame = 0;
    let start = 0;
    let current = -2;
    let processing = -2;

    const tick = (now) => {
      if (!start) start = now;
      let t = (now - start) % cycle;
      const step = Math.floor(t / stageDuration);
      const stageTime = t % stageDuration;
      const [incoming, outgoing] = routes[step];
      const centerX = 500;
      const centerY = FLOW_PROCESS_ROWS[step];
      let point = { x: 270, y: FLOW_INPUT_ROWS[step] };
      let visible = false;
      let inProcessor = false;

      if (stageTime < FLOW_DWELL_MS) {
        point = { x: 270, y: FLOW_INPUT_ROWS[step] };
      } else if (stageTime < FLOW_DWELL_MS + FLOW_TRAVEL_MS) {
        const progress = easeInOut((stageTime - FLOW_DWELL_MS) / FLOW_TRAVEL_MS);
        point = pointAt(incoming.route, incoming.lengths, incoming.lengths[incoming.lengths.length - 1] * progress);
        visible = true;
      } else if (stageTime < FLOW_DWELL_MS * 2 + FLOW_TRAVEL_MS) {
        point = { x: centerX, y: centerY };
        inProcessor = true;
      } else if (stageTime < FLOW_DWELL_MS * 2 + FLOW_TRAVEL_MS * 2) {
        const progress = easeInOut((stageTime - FLOW_DWELL_MS * 2 - FLOW_TRAVEL_MS) / FLOW_TRAVEL_MS);
        point = pointAt(outgoing.route, outgoing.lengths, outgoing.lengths[outgoing.lengths.length - 1] * progress);
        visible = true;
      } else {
        point = { x: 730, y: FLOW_INPUT_ROWS[step] };
      }

      dot.setAttribute('cx', point.x);
      dot.setAttribute('cy', point.y);
      dot.style.opacity = visible ? '1' : '0';
      if (step !== current) {
        current = step;
        setActiveStep(step);
      }
      const processorIndex = inProcessor ? step : -1;
      if (processorIndex !== processing) {
        processing = processorIndex;
        setProcessingStep(processorIndex);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate, workflow]);

  const accessibilityText = workflow.inputs
    .map((input, index) => `${input.title}, then ${PROCESS_STEPS.map(({ label }) => label).join(', then ')}, then ${workflow.outputs[index].title}`)
    .join('. ');

  return (
    <div className="aia-flow-canvas">
      <p className="aia-sr">{accessibilityText}</p>
      <div className="aia-flow-map">
        <svg viewBox={`0 0 ${FLOW_WIDTH} ${FLOW_HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
          {workflow.inputs.map((_, index) => (
            <g key={index}>
              <path className={`aia-map-link aia-map-link--input${activeStep === index ? ' is-active' : ''}`} d={incomingPath(index)} />
              <path className={`aia-map-link aia-map-link--output${activeStep === index ? ' is-active' : ''}`} d={outgoingPath(index)} />
            </g>
          ))}
          <circle className="aia-map-pulse" ref={dotRef} r="5" cx="270" cy={FLOW_INPUT_ROWS[0]} />
        </svg>
        <ol className="aia-flow-cards aia-flow-cards--inputs" aria-label="Workflow inputs">
          {workflow.inputs.map(({ title, detail, Icon, tone }, index) => (
            <li className={`aia-flow-card tone-${tone}${activeStep === index ? ' is-active' : ''}`} key={title} style={{ '--flow-y': `${(FLOW_INPUT_ROWS[index] / FLOW_HEIGHT) * 100}%` }}>
              <span className="aia-flow-card-icon"><Icon size={18} strokeWidth={1.8} /></span>
              <span className="aia-flow-card-copy"><strong>{title}</strong><small>{detail}</small></span>
              <span className="aia-flow-card-port" aria-hidden="true" />
            </li>
          ))}
        </ol>

        <div className={`aia-flow-core${processingStep >= 0 ? ' is-processing' : ''}`}>
          <div className="aia-flow-core-head">
            <span className="aia-flow-core-mark" aria-hidden="true"><Bot size={19} strokeWidth={1.8} /></span>
            <strong>AI & Automation</strong>
            <span className="aia-flow-core-status"><i /> ACTIVE</span>
          </div>
          <ol className="aia-flow-core-steps">
            {PROCESS_STEPS.map(({ label, Icon }, index) => (
              <li className={index === processingStep ? 'is-active' : undefined} key={label}>
                <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
                <span>{label}</span>
                <CircleCheck size={13} className="aia-flow-core-check" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>

        <ol className="aia-flow-cards aia-flow-cards--outputs" aria-label="Workflow actions">
          {workflow.outputs.map(({ title, detail, Icon, tone }, index) => (
            <li className={`aia-flow-card tone-${tone}${activeStep === index ? ' is-active' : ''}`} key={title} style={{ '--flow-y': `${(FLOW_INPUT_ROWS[index] / FLOW_HEIGHT) * 100}%` }}>
              <span className="aia-flow-card-port" aria-hidden="true" />
              <span className="aia-flow-card-icon"><Icon size={18} strokeWidth={1.8} /></span>
              <span className="aia-flow-card-copy"><strong>{title}</strong><small>{detail}</small></span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const UNIVERSAL_INPUTS = [
  { title: 'Form submitted', detail: 'New form submission on your website', Icon: FileText, tone: 'teal' },
  { title: 'New email', detail: 'Incoming email in your inbox', Icon: Mail, tone: 'blue' },
  { title: 'Uploaded document', detail: 'File added to your folder', Icon: FileUp, tone: 'orange' },
  { title: 'New lead', detail: 'New contact in your CRM', Icon: UserRound, tone: 'purple' },
];
const UNIVERSAL_OUTPUTS = [
  { title: 'CRM updated', detail: 'Contact or deal added automatically', Icon: Database, tone: 'teal' },
  { title: 'Task created', detail: 'New task assigned to your team', Icon: ClipboardCheck, tone: 'blue' },
  { title: 'Follow-up sent', detail: 'Personalized email sent automatically', Icon: Send, tone: 'orange' },
  { title: 'Team notified', detail: 'Instant notification in your communication tools', Icon: Users, tone: 'purple' },
];
const UNIVERSAL_STEPS = [
  { label: 'Capture', detail: 'Collect data from your tools', Icon: Database },
  { label: 'Route', detail: 'Send to the right process', Icon: Workflow },
  { label: 'Decide', detail: 'Apply rules and logic', Icon: FileText },
  { label: 'Act', detail: 'Take action across your tools', Icon: Zap },
];
const USE_CASES = [
  { title: 'Lead management', detail: 'Capture and nurture leads', Icon: UserRound },
  { title: 'Customer support', detail: 'Automate responses and tasks', Icon: Headset },
  { title: 'Document workflows', detail: 'Process and organize files', Icon: FileText },
  { title: 'Reporting', detail: 'Turn data into insights', Icon: BarChart2 },
];

function UniversalWorkflowDiagram({ animate }) {
  const mapRef = useRef(null);
  const svgRef = useRef(null);
  const [routes, setRoutes] = useState([]);
  const [activeFlow, setActiveFlow] = useState({ phase: 'idle', index: -1 });

  useLayoutEffect(() => {
    const map = mapRef.current;
    const svg = svgRef.current;
    if (!map || !svg) return undefined;
    const update = () => {
      const bounds = map.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
      const core = map.querySelector('.aia-flow-core');
      const inputs = [...map.querySelectorAll('.aia-flow-cards--inputs .aia-flow-card')];
      const outputs = [...map.querySelectorAll('.aia-flow-cards--outputs .aia-flow-card')];
      if (!core || inputs.length !== 4 || outputs.length !== 4) return;
      const narrow = window.matchMedia('(max-width: 760px)').matches;
      const mapBox = map.getBoundingClientRect();
      const coreBox = core.getBoundingClientRect();
      const edge = (rect, side) => ({ x: (side === 'left' ? rect.left : side === 'right' ? rect.right : rect.left + rect.width / 2) - mapBox.left, y: (side === 'top' ? rect.top : side === 'bottom' ? rect.bottom : rect.top + rect.height / 2) - mapBox.top });
      const inputPaths = inputs.map((card, index) => {
        const rect = card.getBoundingClientRect();
        const from = edge(rect, narrow ? 'bottom' : 'right');
        const to = narrow ? { x: coreBox.left + coreBox.width / 2 - mapBox.left, y: coreBox.top - mapBox.top } : { x: coreBox.left - mapBox.left, y: coreBox.top + coreBox.height * ((index + 1) / 5) - mapBox.top };
        return {
          d: narrow
            ? `M ${from.x} ${from.y} C ${from.x} ${from.y + 24}, ${to.x} ${to.y - 24}, ${to.x} ${to.y}`
            : `M ${from.x} ${from.y} C ${from.x + 45} ${from.y}, ${to.x - 45} ${to.y}, ${to.x} ${to.y}`,
          start: from,
          end: to,
        };
      });
      const outputPaths = outputs.map((card, index) => {
        const rect = card.getBoundingClientRect();
        const to = edge(rect, narrow ? 'top' : 'left');
        const from = narrow ? { x: coreBox.left + coreBox.width / 2 - mapBox.left, y: coreBox.bottom - mapBox.top } : { x: coreBox.right - mapBox.left, y: coreBox.top + coreBox.height * ((index + 1) / 5) - mapBox.top };
        return {
          d: narrow
            ? `M ${from.x} ${from.y} C ${from.x} ${from.y + 24}, ${to.x} ${to.y - 24}, ${to.x} ${to.y}`
            : `M ${from.x} ${from.y} C ${from.x + 45} ${from.y}, ${to.x - 45} ${to.y}, ${to.x} ${to.y}`,
          start: from,
          end: to,
        };
      });
      setRoutes([...inputPaths, ...outputPaths]);
    };
    const observer = new ResizeObserver(update);
    observer.observe(map);
    map.querySelectorAll('.aia-flow-card, .aia-flow-core').forEach(element => observer.observe(element));
    window.addEventListener('resize', update);
    update();
    return () => { observer.disconnect(); window.removeEventListener('resize', update); };
  }, []);

  useEffect(() => {
    if (!animate) {
      setActiveFlow({ phase: 'idle', index: -1 });
      return undefined;
    }

    const inputLeadIn = 1000;
    const stageClassSpan = 3000;
    const outputTransition = 1000;
    const outputHold = 2000;
    const resetDuration = 1000;
    const stageStart = inputLeadIn;
    const outputStart = stageStart + stageClassSpan * UNIVERSAL_STEPS.length;
    const outputEnd = outputStart + outputTransition + outputHold;
    const cycleDuration = outputEnd + resetDuration;
    let frame;
    let lastKey = '';
    let start;
    const tick = now => {
      if (start === undefined) start = now;
      const overallElapsed = now - start;
      const elapsed = overallElapsed % cycleDuration;
      const workflowIndex = Math.floor(overallElapsed / cycleDuration) % UNIVERSAL_INPUTS.length;
      let next;
      if (elapsed < stageStart) {
        next = { phase: 'input', index: workflowIndex };
      } else if (elapsed < outputStart) {
        const stageElapsed = elapsed - stageStart;
        const stageIndex = Math.floor(stageElapsed / stageClassSpan);
        next = { phase: 'stage', index: stageIndex };
      } else if (elapsed < outputEnd) {
        next = { phase: 'output', index: workflowIndex };
      } else {
        next = { phase: 'idle', index: -1 };
      }
      const key = `${next.phase}-${next.index}`;
      if (key !== lastKey) {
        lastKey = key;
        setActiveFlow(next);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  return (
    <div className={`aia-flow-map${animate ? ' is-visible' : ''}`} ref={mapRef}>
      <p className="aia-sr">Four example business triggers connect to an automation engine that captures, routes, decides and acts. Example outcomes include CRM updates, task creation, follow-ups and team notifications. These are examples of capabilities, not fixed one-to-one paths.</p>
      <svg className="aia-flow-connectors" ref={svgRef} aria-hidden="true">
        {routes.map(({ d, start, end }, index) => {
          const isInput = index < 4;
          const inputIsActive = isInput && activeFlow.index === index % 4 && ['input', 'stage'].includes(activeFlow.phase);
          const outputIsActive = !isInput && activeFlow.index === index % 4 && activeFlow.phase === 'output';
          const isActive = inputIsActive || outputIsActive;
          return <g className={`aia-flow-route${isInput ? ' is-input' : ' is-output'} tone-${index % 4}${isActive ? ' is-active' : ''}`} key={`${index}-${d}`}><path d={d} pathLength="100" /><path className="aia-flow-route-highlight" d={d} pathLength="100" /><circle className="aia-flow-connection-node" cx={start.x} cy={start.y} r="3.5" /><circle className="aia-flow-connection-node" cx={end.x} cy={end.y} r="3.5" /></g>;
        })}
      </svg>
      <ol className="aia-flow-cards aia-flow-cards--inputs" aria-label="Business triggers">{UNIVERSAL_INPUTS.map(({ title, detail, Icon, tone }, index) => <li className={`aia-flow-card tone-${tone}${activeFlow.index === index && ['input', 'stage'].includes(activeFlow.phase) ? ' is-active' : ''}`} key={title} style={{ '--flow-index': index }}><span className="aia-flow-card-icon"><Icon size={19} strokeWidth={1.8} /></span><span className="aia-flow-card-copy"><strong>{title}</strong><small>{detail}</small></span><span className="aia-flow-card-port" /></li>)}</ol>
      <section className="aia-flow-core" aria-label="Automation Engine">
        <header className="aia-flow-core-head"><span className="aia-flow-core-mark"><Zap size={20} strokeWidth={1.7} /></span><div><strong>Automation Engine</strong><small>CONNECT · PROCESS · DELIVER</small></div></header>
        <ol className="aia-flow-core-steps">{UNIVERSAL_STEPS.map(({ label, detail, Icon }, index) => <li className={activeFlow.phase === 'stage' && activeFlow.index === index ? 'is-active' : undefined} key={label}><Icon size={18} strokeWidth={1.7} /><span><strong>{label}</strong><small>{detail}</small></span></li>)}</ol>
      </section>
      <ol className="aia-flow-cards aia-flow-cards--outputs" aria-label="Automated outcomes">{UNIVERSAL_OUTPUTS.map(({ title, detail, Icon, tone }, index) => <li className={`aia-flow-card tone-${tone}${activeFlow.index === index && ['output', 'idle'].includes(activeFlow.phase) ? ' is-active' : ''}`} key={title} style={{ '--flow-index': index }}><span className="aia-flow-card-port" /><span className="aia-flow-card-icon"><Icon size={19} strokeWidth={1.8} /></span><span className="aia-flow-card-copy"><strong>{title}</strong><small>{detail}</small></span></li>)}</ol>
    </div>
  );
}

function Workflows({ reducedMotion }) {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);

  return (
    <section className="aia-section aia-flows" ref={sectionRef} aria-labelledby="aia-flows-title">
      <div className="sp-inner">
        <header className="aia-head aia-head--split">
          <div>
            <span className="aia-eyebrow">Workflow</span>
            <h2 className="aia-h2" id="aia-flows-title">From manual work to automated workflows</h2>
          </div>
          <p>A universal automation flow that connects your tools, data, and actions so work moves automatically from trigger to outcome.</p>
        </header>
        <UniversalWorkflowDiagram animate={inView && !reducedMotion} />
        <ul className="aia-flow-usecases" aria-label="Example automation use cases">
          {USE_CASES.map(({ title, detail, Icon }, index) => <li key={title} style={{ '--flow-index': index }}><span><Icon size={21} strokeWidth={1.7} /></span><div><strong>{title}</strong><small>{detail}</small></div></li>)}
        </ul>
      </div>
    </section>
  );
}

/* ----- Tools around the automation layer ----- */

function hubLayout(narrow) {
  if (narrow) {
    const width = 720;
    const height = 740;
    const hub = { x: 360, y: 370 };
    const xs = [175, 545];
    const tools = [
      ...xs.map((x, i) => ({ x, y: 72 + i * 72 })),
      ...xs.map((x, i) => ({ x, y: 596 + i * 72 })),
    ];
    return {
      width,
      height,
      hub,
      hubWidth: 400,
      toolWidth: 290,
      tools,
      routes: tools.map((t, index) => {
        const bend = t.y < hub.y ? 236 : 504;
        const sideHub = { x: index % 2 === 0 ? 180 : 540, y: hub.y };
        return [t, { x: t.x, y: bend }, { x: sideHub.x, y: bend }, sideHub, hub];
      }),
    };
  }

  const width = 1000;
  const height = 460;
  const hub = { x: 500, y: 230 };
  const inputXs = [125, 375, 625, 875];
  const outputXs = [125, 375, 625, 875];
  const tools = [
    ...inputXs.map((x) => ({ x, y: 70 })),
    ...outputXs.map((x) => ({ x, y: 390 })),
  ];
  return {
    width,
    height,
    hub,
    hubWidth: 280,
    toolWidth: 190,
    tools,
    routes: tools.map((t, index) => {
      const top = index < 4;
      const anchor = { x: hub.x, y: top ? hub.y - 50 : hub.y + 50 };
      const bend = top ? hub.y - 100 : hub.y + 100;
      return [t, { x: t.x, y: bend }, { x: anchor.x, y: bend }, anchor, hub];
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
      <span className="aia-hub-label aia-hub-label--in">Inputs</span>
      <span className="aia-hub-label aia-hub-label--out">Connected systems</span>
      <div className={`aia-hub${narrow ? ' is-narrow' : ''}`} style={{ aspectRatio: `${width} / ${height}` }}>
        <svg viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
          {routes.map((route, index) => <path className="aia-line" d={toPath(route)} key={TOOLS[index].label} />)}
          <circle className="aia-pulse" ref={dotRef} r={narrow ? 4 : 4.5} cx={hub.x} cy={hub.y} />
        </svg>

        <div
          className={`aia-hub-core${active.hub ? ' is-active' : ''}`}
          style={{ left: pct(hub.x, width), top: pct(hub.y, height), width: pct(layout.hubWidth, width) }}
        >
          <span className="aia-hub-mark" aria-hidden="true"><Workflow size={18} strokeWidth={1.8} /></span>
          <strong>Your Automated Workflow</strong>
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
              <strong><i className={`tone-${tool.tone}`} aria-hidden="true"><tool.Icon size={17} strokeWidth={1.8} /></i>{tool.label}</strong>
              <span>{tool.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Practical() {
  return (
    <section className="aia-section aia-practical" aria-labelledby="aia-practical-title">
      <div className="sp-inner">
        <header className="aia-head aia-head--split">
          <div>
            <span className="aia-eyebrow">Practical AI & automation</span>
            <h2 className="aia-h2" id="aia-practical-title">Practical AI & automation. Built for real businesses.</h2>
          </div>
          <p>We focus on solutions that deliver measurable business value, not technology for its own sake.</p>
        </header>
        <ol className="aia-qualities">
          {QUALITIES.map(([number, title, description, Icon, tone], index) => (
            <li key={number} style={{ '--quality-index': index }}>
              <span className="aia-quality-icon"><b>{number}</b><i className={`tone-${tone}`}><Icon size={18} strokeWidth={1.8} /></i></span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
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
            <h2 className="aia-h2" id="aia-approach-title">From repetitive tasks to working automation.</h2>
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
      eyebrow="AI & Automation"
      title="AI Automation"
      description="We automate repetitive business processes by connecting AI, data and the tools your team already uses — so everyday operations keep moving without the manual work."
      pageClassName="sp--ai-automation"
      heroActions={<a className="aia-btn" href="/contact">Discuss an Automation</a>}
      hideWork
      hideCta
    >
      <div className="aia-page">
        <Workflows reducedMotion={reducedMotion} />

        <section className="aia-section aia-tools" aria-labelledby="aia-tools-title">
          <div className="sp-inner">
            <header className="aia-head aia-head--center">
              <span className="aia-eyebrow">Integrations</span>
              <h2 className="aia-h2" id="aia-tools-title">Connect the tools around the workflow.</h2>
              <p>We connect the systems you already use, allowing information to move between tools without repeated manual work.</p>
            </header>
            <ToolsDiagram reducedMotion={reducedMotion} />
          </div>
        </section>

        <section className="aia-section aia-areas" aria-labelledby="aia-areas-title">
          <div className="sp-inner">
            <header className="aia-head aia-head--split">
              <div>
                <span className="aia-eyebrow">What we automate</span>
                <h2 className="aia-h2" id="aia-areas-title">Automate the work that slows your team down.</h2>
              </div>
              <p>We design focused automations that reduce manual work, improve accuracy, and give your team more time for meaningful tasks.</p>
            </header>

            <div className="aia-area-grid">
              {AREAS.map((area) => {
                const Icon = area.Icon;
                return (
                  <article className="aia-area" key={area.number}>
                    <div className="aia-area-icon" aria-hidden="true">
                      <Icon size={19} strokeWidth={1.6} />
                    </div>
                    <h3>{area.title}</h3>
                    <p>{area.description}</p>
                    <a href="/contact" className="aia-area-link">
                      {area.cta} <span aria-hidden="true">→</span>
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="aia-section aia-judgement" aria-labelledby="aia-judgement-title">
          <div className="sp-inner">
            <header className="aia-head">
              <span className="aia-eyebrow">AI + Automation</span>
              <h2 className="aia-h2" id="aia-judgement-title">Each solves a different problem.</h2>
              <p>We use automation for predictable processes and AI where information needs interpretation.</p>
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

            <ol className="aia-logic" aria-label="How an intelligent workflow operates">
              {LOGIC_STEPS.map(([title, description, Icon], index) => (
                <li key={title}>
                  <span className="aia-logic-icon" aria-hidden="true"><Icon size={24} strokeWidth={1.6} /></span>
                  <span className="aia-logic-step">0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Practical />

        <Approach />

        <section className="aia-cta" aria-labelledby="aia-cta-title">
          <div className="sp-inner">
            <h2 id="aia-cta-title">Have a repetitive process <em>in your business?</em></h2>
            <p>Tell us how your team works. We’ll help identify what should be automated, where AI adds value, and what should stay human.</p>
            <a className="aia-btn" href="/contact">Discuss Your Workflow <span aria-hidden="true">→</span></a>
          </div>
        </section>
      </div>
    </ServicePage>
  );
}
