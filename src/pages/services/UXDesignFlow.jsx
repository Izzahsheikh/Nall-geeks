import { useEffect, useRef, useState } from 'react';
import './uxflow.css';

/*
 * "How we design digital experiences": one sticky stage that develops as the page scrolls.
 * Research → Persona → Flow are separate boards; Wireframe → Visual Design → Prototype → Refinement share ONE screen
 * that changes fidelity, shrinks into a connected set, then returns large with refinement notes.
 */

const STAGES = [
  {
    title: 'Research',
    phase: 'Understand',
    text: 'We learn about the business, its audience and what the product has to achieve before anything is drawn.',
    tags: ['Business goals', 'Target audience', 'User needs', 'Problems to solve'],
  },
  {
    title: 'User Persona',
    phase: 'Understand',
    text: 'Research becomes a clear picture of who we are designing for: what they need and what gets in their way.',
    tags: ['Goals', 'Needs', 'Frustrations', 'Behaviour'],
  },
  {
    title: 'User Flow',
    phase: 'Structure',
    text: 'We map how a person moves through the product, and where they decide, hesitate or drop off.',
    tags: ['User intent', 'Decision points', 'Friction points'],
  },
  {
    title: 'Wireframe',
    phase: 'Structure',
    text: 'Low-fidelity screens set the structure first: layout, navigation, content hierarchy and calls to action.',
    tags: ['Layout', 'Navigation', 'Content hierarchy', 'CTA placement'],
  },
  {
    title: 'Visual Design',
    phase: 'Design',
    text: 'The wireframe becomes a polished interface, with typography, colour, spacing and components defined.',
    tags: ['Typography', 'Colour', 'Spacing', 'Components'],
  },
  {
    title: 'Prototype',
    phase: 'Prototype',
    text: 'We turn the designed screens into an interactive prototype to test flow, usability and interactions.',
    tags: ['Connected screens', 'Click flow', 'Usability'],
  },
  {
    title: 'Final Refinement',
    phase: 'Refine',
    text: 'We refine the details until the interface feels finished: consistent, clear and easy to use.',
    tags: ['Consistency', 'Hierarchy', 'Usability'],
  },
];

const PHASES = [
  ['Understand', 2],
  ['Structure', 2],
  ['Design', 1],
  ['Prototype', 1],
  ['Refine', 1],
];

const RESEARCH = [
  ['Business goals', 'Increase online bookings'],
  ['Target audience', 'Independent studio owners'],
  ['User needs', 'Clear pricing and a fast set-up'],
  ['Problems to solve', 'People drop off at sign-up'],
];

const PERSONA = [
  ['Goals', 'Win more clients online'],
  ['Needs', 'A clear, quick booking process'],
  ['Frustrations', 'Confusing forms, hidden pricing'],
  ['Behaviour', 'Browses on mobile, compares three or four options'],
];

const FLOW_NODES = ['Landing Page', 'Explore', 'Compare', 'Decide', 'Take Action'];

const FLOW_NOTES = [
  ['1', 'User intent', 'Find the right option quickly'],
  ['2', 'Friction points', 'Too many options, unclear pricing'],
  ['3', 'Decision points', 'Compare, then decide'],
];

const WIRE_NOTES = [
  ['Layout', 'Two-column hero, three-part feature row'],
  ['Navigation', 'Logo, three links, one action'],
  ['Content hierarchy', 'Headline first, support copy second'],
  ['CTA placement', 'Primary action above the fold'],
];

const FINAL_NOTES = [
  ['Consistent spacing', 'One 8px rhythm throughout'],
  ['Clearer hierarchy', 'Headline, support, action, in order'],
  ['Readable contrast', 'Legible on every surface'],
  ['Refined interactions', 'Hover and focus states defined'],
];

// Marker positions on the large screen (em, inside the 40 × 30 screen).
// Order matches WIRE_NOTES / FINAL_NOTES.
const WIRE_MARKS = [[24, 5.5], [39.4, 3.6], [2, 5.4], [11, 19.6]];
const FINAL_MARKS = [[2, 23.8], [2, 5.4], [11, 19.6], [38.2, 0.7]];

const SCREEN_POS = [
  null,
  null,
  null,
  { x: 20, y: 90, s: 1 },
  { x: 20, y: 90, s: 1 },
  { x: 16, y: 170, s: 0.44 },
  { x: 20, y: 90, s: 1 },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

// Which of the 7 stages is active while the tall section scrolls past its pinned panel.
function useStageFromScroll(count) {
  const ref = useRef(null);
  const [stage, setStage] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height - window.innerHeight, 1)));
      const next = Math.min(count - 1, Math.floor(progress * count));
      setStage((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [count]);
  return [ref, stage];
}

// The stage is laid out in a fixed 640 × 480 box and scaled to fit, so type and spacing stay in proportion.
function useFitScale() {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setScale(el.clientWidth / 640);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, scale];
}

/* ---------- the one screen that evolves ---------- */

function Txt({ className = '', style, children }) {
  return (
    <div className={`uf-el ${className}`} style={style}>
      <span className="uf-t">{children}</span>
      <i className="uf-wf" />
    </div>
  );
}

function Screen({ mode, pos }) {
  const hidden = !pos;
  const p = pos || SCREEN_POS[3];
  return (
    <div
      className={`uf-screen is-${mode}${hidden ? ' is-hidden' : ''}`}
      style={{ transform: `translate(${p.x}px, ${p.y}px) scale(${p.s})` }}
    >
      <Txt className="uf-logo">Studio</Txt>
      <Txt className="uf-links">Work &nbsp;&nbsp; About &nbsp;&nbsp; Pricing</Txt>
      <div className="uf-el uf-navbtn"><span className="uf-t">Book</span></div>
      <div className="uf-rule" />
      <Txt className="uf-h1">Designed for how you work.</Txt>
      <Txt className="uf-p">A calmer way to plan, track and deliver client projects.</Txt>
      <div className="uf-el uf-cta"><span className="uf-t">Get started</span></div>
      <Txt className="uf-link2">See how it works</Txt>
      <div className="uf-el uf-image">
        <i className="uf-x" />
        <span className="uf-img-row" />
        <span className="uf-img-row" />
        <span className="uf-img-row is-short" />
      </div>
      {['Plan', 'Track', 'Deliver'].map((t, i) => (
        <div className="uf-el uf-feature" style={{ left: `${2 + i * 12.6}em` }} key={t}>
          <span className="uf-dot" />
          <span className="uf-ft">{t}</span>
          <span className="uf-fp">One calm view.</span>
        </div>
      ))}
    </div>
  );
}

function MiniOptions({ show }) {
  return (
    <div className={`uf-screen is-styled uf-mini uf-mini--b${show ? ' is-shown' : ''}`}>
      <div className="uf-el uf-logo"><span className="uf-t">Studio</span></div>
      <div className="uf-el uf-navbtn"><span className="uf-t">Book</span></div>
      <div className="uf-rule" />
      <div className="uf-el uf-h1 uf-h1--sm"><span className="uf-t">Choose a plan</span></div>
      {['Starter', 'Studio', 'Team'].map((t, i) => (
        <div className={`uf-row${i === 1 ? ' is-picked' : ''}`} style={{ top: `${10.4 + i * 6.2}em` }} key={t}>
          <span>{t}</span>
          <b>Select</b>
        </div>
      ))}
    </div>
  );
}

function MiniDone({ show }) {
  return (
    <div className={`uf-screen is-styled uf-mini uf-mini--c${show ? ' is-shown' : ''}`}>
      <div className="uf-el uf-logo"><span className="uf-t">Studio</span></div>
      <div className="uf-rule" />
      <div className="uf-tick"><svg viewBox="0 0 20 20"><path d="M4.5 10.5 8.2 14 15.8 6" /></svg></div>
      <div className="uf-el uf-done"><span className="uf-t">You’re all set</span></div>
      <div className="uf-el uf-done-p"><span className="uf-t">Your studio is ready to take bookings.</span></div>
      <div className="uf-el uf-cta uf-cta--c"><span className="uf-t">Go to dashboard</span></div>
    </div>
  );
}

/* ---------- boards ---------- */

function ResearchBoard({ on }) {
  return (
    <div className={`uf-layer uf-research${on ? ' is-on' : ''}`}>
      {RESEARCH.map(([label, value], i) => (
        <div className="uf-research-row" style={{ transitionDelay: `${0.35 + i * 0.12}s` }} key={label}>
          <span className="uf-rn">{String(i + 1).padStart(2, '0')}</span>
          <span className="uf-rl">{label}</span>
          <span className="uf-rv">{value}</span>
        </div>
      ))}
    </div>
  );
}

function PersonaBoard({ on }) {
  return (
    <div className={`uf-layer uf-persona${on ? ' is-on' : ''}`}>
      <div className="uf-persona-head">
        <span className="uf-avatar">SM</span>
        <div>
          <b>Sara Malik</b>
          <span>Studio owner · 34</span>
        </div>
      </div>
      <div className="uf-persona-grid">
        {PERSONA.map(([label, value], i) => (
          <div style={{ transitionDelay: `${0.4 + i * 0.12}s` }} key={label}>
            <span className="uf-pl">{label}</span>
            <p>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowBoard({ on }) {
  const nodeX = (i) => 30 + i * 122;
  return (
    <div className={`uf-layer uf-flow${on ? ' is-on' : ''}`}>
      <svg className="uf-flow-svg" viewBox="0 0 640 480" aria-hidden="true">
        {FLOW_NODES.slice(1).map((_, i) => (
          <g key={i} className="uf-conn" style={{ animationDelay: `${0.4 + i * 0.3}s` }}>
            <path d={`M${nodeX(i) + 90} 215 H${nodeX(i + 1)}`} pathLength="1" />
            <path d={`M${nodeX(i + 1) - 7} 209 L${nodeX(i + 1)} 215 L${nodeX(i + 1) - 7} 221`} className="uf-arrow" />
          </g>
        ))}
        {/* leaders to the numbered notes */}
        <path d="M75 192 V157" className="uf-leader" />
        <path d="M258 215 V181" className="uf-leader" />
        <path d="M319 192 V165 H441 V192" className="uf-leader" />
        {[[75, 148, '1'], [258, 172, '2'], [380, 156, '3']].map(([x, y, n]) => (
          <g key={n} className="uf-flow-mark">
            <circle cx={x} cy={y} r="9" />
            <text x={x} y={y + 4} textAnchor="middle">{n}</text>
          </g>
        ))}
      </svg>
      {FLOW_NODES.map((label, i) => (
        <div
          className={`uf-node${i === 2 || i === 3 ? ' is-decision' : ''}`}
          style={{ left: `${nodeX(i)}px`, transitionDelay: `${0.2 + i * 0.3}s` }}
          key={label}
        >
          {label}
        </div>
      ))}
      <div className="uf-flow-notes">
        {FLOW_NOTES.map(([n, title, text]) => (
          <div key={n}>
            <span className="uf-pl"><b>{n}</b> {title}</span>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SidePane({ on, className, notes }) {
  return (
    <div className={`uf-layer uf-pane ${className}${on ? ' is-on' : ''}`}>
      {notes.map(([title, text], i) => (
        <div style={{ transitionDelay: `${0.35 + i * 0.1}s` }} key={title}>
          <span className="uf-pn">{i + 1}</span>
          <b>{title}</b>
          <p>{text}</p>
        </div>
      ))}
    </div>
  );
}

function StylePane({ on }) {
  return (
    <div className={`uf-layer uf-pane uf-style${on ? ' is-on' : ''}`}>
      <div style={{ transitionDelay: '0.35s' }}>
        <span className="uf-pl">Typography</span>
        <div className="uf-type"><i>Aa</i><em>Aa</em></div>
      </div>
      <div style={{ transitionDelay: '0.45s' }}>
        <span className="uf-pl">Colour</span>
        <div className="uf-swatches"><i style={{ background: '#1f2124' }} /><i style={{ background: '#fbf8f3' }} /><i style={{ background: '#c95e18' }} /><i style={{ background: '#e4dccf' }} /></div>
      </div>
      <div style={{ transitionDelay: '0.55s' }}>
        <span className="uf-pl">Spacing</span>
        <div className="uf-space"><i style={{ width: '1.6em' }} /><i style={{ width: '3.2em' }} /><i style={{ width: '4.8em' }} /></div>
      </div>
      <div style={{ transitionDelay: '0.65s' }}>
        <span className="uf-pl">Components</span>
        <div className="uf-comps"><b>Button</b><span>Input</span></div>
      </div>
    </div>
  );
}

function Marks({ marks, on }) {
  return (
    <div className={`uf-marks${on ? ' is-on' : ''}`}>
      {marks.map(([x, y], i) => (
        <span style={{ left: `${x * 10}px`, top: `${y * 10}px`, transitionDelay: `${0.5 + i * 0.1}s` }} key={i}>{i + 1}</span>
      ))}
    </div>
  );
}

/* ---------- prototype connectors ---------- */

function ProtoLines({ on }) {
  return (
    <svg className={`uf-proto${on ? ' is-on' : ''}`} viewBox="0 0 640 480" aria-hidden="true">
      <circle cx="46" cy="263" r="5" className="uf-hot" />
      <circle cx="46" cy="263" r="5" className="uf-hot-ring" />
      <path d="M54 263 C 130 263 160 236 230 236" pathLength="1" className="uf-proto-line uf-pl-1" />
      <path d="M223 231 L231 236 L223 241" className="uf-proto-head uf-ph-1" />
      <circle cx="376" cy="254" r="5" className="uf-hot uf-hot-2" />
      <path d="M384 254 C 410 254 420 236 446 236" pathLength="1" className="uf-proto-line uf-pl-2" />
      <path d="M439 231 L447 236 L439 241" className="uf-proto-head uf-ph-2" />
    </svg>
  );
}

/* ---------- section ---------- */

export default function UXDesignFlow() {
  const [sectionRef, stage] = useStageFromScroll(STAGES.length);
  const [boxRef, scale] = useFitScale();
  const reduced = usePrefersReducedMotion();
  const active = STAGES[stage];

  const screenMode = stage === 3 ? 'wire' : 'styled';

  const jumpTo = (index) => {
    const el = sectionRef.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY + ((index + 0.5) / STAGES.length) * total;
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section className="uf-section" aria-labelledby="uf-title">
      <div className="sp-inner uf-head">
        <span className="uf-eyebrow">Process</span>
        <h2 id="uf-title">How we design digital experiences</h2>
        <p>We move from understanding users and goals to building structured wireframes, polished interfaces, and interactive prototypes.</p>
      </div>

      <div className="uf-track" ref={sectionRef} style={{ height: `${STAGES.length * 62 + 38}vh` }}>
        <div className="uf-sticky">
          <div className="sp-inner uf-split">
            <div className="uf-left">
              <ol className="uf-phases" aria-hidden="true">
                {PHASES.map(([name, span]) => (
                  <li
                    key={name}
                    className={name === active.phase ? 'is-active' : ''}
                    style={{ gridColumn: `span ${span}` }}
                  >
                    {name}
                  </li>
                ))}
              </ol>
              <ol className="uf-rail">
                {STAGES.map((s, i) => (
                  <li key={s.title} className={i === stage ? 'is-active' : i < stage ? 'is-past' : ''}>
                    <button type="button" onClick={() => jumpTo(i)} aria-label={`Go to ${s.title}`} aria-current={i === stage ? 'step' : undefined}>
                      <span />
                    </button>
                  </li>
                ))}
              </ol>

              <div className="uf-copy" aria-live="polite">
                {STAGES.map((s, i) => (
                  <div className={`uf-copy-item${i === stage ? ' is-active' : i === stage - 1 ? ' is-leaving' : ''}`} aria-hidden={i !== stage} key={s.title}>
                    <span className="uf-num"><b>{String(i + 1).padStart(2, '0')}</b> {s.title}</span>
                    <p>{s.text}</p>
                    <ul>
                      {s.tags.map((t) => <li key={t}>{t}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="uf-canvas" ref={boxRef}>
              <div className="uf-stage" style={{ transform: `scale(${scale})` }}>
                <ResearchBoard on={stage === 0} />
                <PersonaBoard on={stage === 1} />
                <FlowBoard on={stage === 2} />

                <Screen mode={screenMode} pos={SCREEN_POS[stage]} />
                <Marks marks={WIRE_MARKS} on={stage === 3} />
                <Marks marks={FINAL_MARKS} on={stage === 6} />
                <SidePane on={stage === 3} className="uf-wire-pane" notes={WIRE_NOTES} />
                <StylePane on={stage === 4} />
                <SidePane on={stage === 6} className="uf-final-pane" notes={FINAL_NOTES} />

                <MiniOptions show={stage === 5} />
                <MiniDone show={stage === 5} />
                <ProtoLines on={stage === 5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
